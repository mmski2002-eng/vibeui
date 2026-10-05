import { hostname } from "node:os";
import { randomUUID } from "node:crypto";
import type postgres from "postgres";
import type { Config } from "./config.js";
import type { Database } from "./database.js";
import { writeAudit } from "./audit.js";
import { claimNext, completeJob, failJob, type AgentJob } from "./queue.js";
import { scoreCandidate } from "./scoring-agent.js";
import { personalizeOutreach } from "./personalization-agent.js";
import { classifyReply } from "./reply-agent.js";
import { loadPolicy } from "./policy.js";
import { sendResendEmail } from "./email/resend.js";
import { calculateModelCost, isPricedModel, ModelOutputError } from "./model-cost.js";
import { VibeUiClient } from "./vibeui-client.js";
import { checkPublication } from "./publication-monitor.js";

export async function runWorker(database: Database, config: Config): Promise<void> {
  for (const model of [config.scoringModel, config.generationModel]) {
    if (!isPricedModel(model)) throw new Error(`No price configured for model ${model}; refusing to start without budget accounting`);
  }
  const workerId = `${hostname()}:${process.pid}`;
  let stopping = false;
  const stop = () => { stopping = true; };
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);

  console.log(`Worker ${workerId} started`);
  while (!stopping) {
    const control = (await database<{ emergency_stop: boolean }[]>`SELECT emergency_stop FROM agent_control WHERE singleton = true`)[0];
    if (control?.emergency_stop) {
      await delay(config.workerPollMs);
      continue;
    }
    const job = await claimNext(database, workerId);
    if (!job) {
      await delay(config.workerPollMs);
      continue;
    }
    try {
      await handleJob(database, config, job);
      await completeJob(database, job.id);
    } catch (error) {
      if (error instanceof ModelOutputError) {
        const model = job.kind === "personalize_thread" ? config.generationModel : config.scoringModel;
        await recordUsage(database, null, null, `${job.kind}:rejected`, model, error.usage);
      }
      await failJob(database, job, error);
      await writeAudit(database, {
        actor: workerId, action: job.kind, targetType: "job", targetId: job.id,
        decision: "failed", reason: error instanceof Error ? error.message : String(error),
      });
    }
  }
  console.log(`Worker ${workerId} stopped`);
}

async function handleJob(database: Database, config: Config, job: AgentJob): Promise<void> {
  if (job.kind === "score_creator") return scoreCreatorJob(database, config, job);
  if (job.kind === "personalize_thread") return personalizeThreadJob(database, config, job);
  if (job.kind === "send_message") return sendMessageJob(database, config, job);
  if (job.kind === "classify_reply") return classifyReplyJob(database, config, job);
  if (job.kind === "create_partner") return createPartnerJob(database, config, job);
  if (job.kind === "monitor_publication") return monitorPublicationJob(database, job);
  if (job.kind === "sync_partner_stats") return syncPartnerStatsJob(database, config, job);
  if (job.kind !== "score_candidate") throw new Error(`Unsupported job kind: ${job.kind}`);
  const candidateId = job.payload.candidateId;
  if (typeof candidateId !== "string") throw new Error("candidateId is required");
  const rows = await database<Record<string, unknown>[]>`
    SELECT * FROM candidates WHERE id = ${candidateId}
  `;
  const candidate = rows[0];
  if (!candidate) throw new Error(`Candidate ${candidateId} not found`);

  const runId = randomUUID();
  await database`
    INSERT INTO agent_runs (id, agent_name, job_id, status, model, input_summary)
    VALUES (${runId}, 'candidate_scorer', ${job.id}, 'running', ${config.scoringModel}, ${candidateId})
  `;
  try {
    await assertModelBudget(database, config);
    const score = await scoreCandidate({ candidate, model: config.scoringModel });
    const { usage: _candidateUsage, ...candidateScoreDetails } = score;
    await database.begin(async (transaction) => {
      await transaction`
        UPDATE candidates SET score = ${score.total}, score_details = ${transaction.json(candidateScoreDetails)},
          status = ${score.total >= 80 ? "qualified" : "review"}, updated_at = now()
        WHERE id = ${candidateId}
      `;
      await transaction`
        UPDATE agent_runs SET status = 'completed', output_summary = ${`score=${score.total}`},
          finished_at = now() WHERE id = ${runId}
      `;
    });
    await writeAudit(database, {
      actor: "candidate_scorer", action: "score_candidate", targetType: "candidate",
      targetId: candidateId, decision: "completed", details: { score: score.total },
    });
    await recordUsage(database, runId, null, "candidate_scorer", config.scoringModel, score.usage);
  } catch (error) {
    await database`
      UPDATE agent_runs SET status = 'failed', error = ${error instanceof Error ? error.message : String(error)},
        finished_at = now() WHERE id = ${runId}
    `;
    throw error;
  }
}

async function createPartnerJob(database: Database, config: Config, job: AgentJob): Promise<void> {
  const offerId = job.payload.offerId;
  if (typeof offerId !== "string") throw new Error("offerId is required");
  const rows = await database<Record<string, unknown>[]>`
    SELECT po.*, c.display_name, cc.value AS email FROM partner_offers po
    JOIN creators c ON c.id = po.creator_id
    JOIN creator_contacts cc ON cc.creator_id = c.id AND cc.kind = 'email' AND cc.is_public_business = true
    WHERE po.id = ${offerId} ORDER BY cc.verified_at DESC NULLS LAST LIMIT 1
  `;
  const offer = rows[0];
  if (!offer) throw new Error(`Partner offer ${offerId} not found`);
  const control = (await database<Record<string, unknown>[]>`SELECT * FROM agent_control WHERE singleton = true`)[0];
  if (control?.emergency_stop === true || control?.partnerships_paused === true) throw new Error("Partner creation is paused");
  if (offer.status !== "approved" || !offer.approved_by || !offer.approved_at) throw new Error("Partner offer requires human approval");
  const client = new VibeUiClient(config.vibeuiInternalApiUrl, config.vibeuiInternalApiKey);
  const external = await client.createPartner({ creatorId: String(offer.creator_id), email: String(offer.email), displayName: String(offer.display_name) }, `partner:${offer.creator_id}`);
  const promo = await client.issuePromo(external.id, {}, `partner-promo:${offer.creator_id}`);
  await client.grantAccess(external.id, `partner-access:${offer.creator_id}`);
  await database.begin(async (transaction) => {
    await transaction`
      INSERT INTO partners (id, creator_id, external_partner_id, referral_code, referral_url, promo_code, status)
      VALUES (${randomUUID()}, ${String(offer.creator_id)}, ${external.id}, ${promo.referralCode}, ${promo.referralUrl}, ${promo.promoCode}, 'active')
      ON CONFLICT (creator_id) DO UPDATE SET external_partner_id = EXCLUDED.external_partner_id,
        referral_code = EXCLUDED.referral_code, referral_url = EXCLUDED.referral_url,
        promo_code = EXCLUDED.promo_code, status = 'active', updated_at = now()
    `;
    await transaction`UPDATE partner_offers SET status = 'created' WHERE id = ${offerId}`;
    await transaction`UPDATE creators SET status = 'partner_created', updated_at = now() WHERE id = ${String(offer.creator_id)}`;
  });
  await writeAudit(database, { actor: "partner_agent", action: "create_partner", targetType: "offer", targetId: offerId, decision: "completed", details: { externalPartnerId: external.id } });
}

async function monitorPublicationJob(database: Database, job: AgentJob): Promise<void> {
  const publicationId = job.payload.publicationId;
  if (typeof publicationId !== "string") throw new Error("publicationId is required");
  const rows = await database<{ url: string; referral_url: string; market: "ru" | "en"; erid: string | null }[]>`
    SELECT pub.url, p.referral_url, c.market, pub.erid FROM publications pub
    JOIN partners p ON p.id = pub.partner_id JOIN creators c ON c.id = p.creator_id WHERE pub.id = ${publicationId}
  `;
  const publication = rows[0];
  if (!publication?.referral_url) throw new Error(`Publication ${publicationId} or referral URL not found`);
  const result = await checkPublication({ url: publication.url, referralUrl: publication.referral_url, market: publication.market, erid: publication.erid });
  await database.begin(async (transaction) => {
    await transaction`INSERT INTO publication_checks (id, publication_id, reachable, referral_present, disclosure_present, erid_present, evidence) VALUES (${randomUUID()}, ${publicationId}, ${result.reachable}, ${result.referralPresent}, ${result.disclosurePresent}, ${result.eridPresent}, ${transaction.json({ checkedUrl: publication.url })})`;
    await transaction`UPDATE publications SET status = ${result.status}, last_checked_at = now() WHERE id = ${publicationId}`;
    if (result.status === "failed") await transaction`INSERT INTO notifications (id, severity, kind, title, details) VALUES (${randomUUID()}, 'critical', 'publication_compliance_failed', 'Публикация не прошла проверку', ${transaction.json({ publicationId, ...result })})`;
  });
}

async function syncPartnerStatsJob(database: Database, config: Config, job: AgentJob): Promise<void> {
  const partnerId = job.payload.partnerId;
  if (typeof partnerId !== "string") throw new Error("partnerId is required");
  const rows = await database<{ id: string; external_partner_id: string }[]>`SELECT id, external_partner_id FROM partners WHERE id = ${partnerId}`;
  const partner = rows[0];
  if (!partner?.external_partner_id) throw new Error(`Partner ${partnerId} is not linked to VibeUI`);
  const raw = await new VibeUiClient(config.vibeuiInternalApiUrl, config.vibeuiInternalApiKey).stats(partner.external_partner_id);
  const number = (key: string) => typeof raw[key] === "number" ? raw[key] : 0;
  await database`INSERT INTO referral_metrics (partner_id, visits, registrations, installations, payments, revenue, commission, raw_data) VALUES (${partnerId}, ${number("visits")}, ${number("registrations")}, ${number("installations")}, ${number("payments")}, ${number("revenue")}, ${number("commission")}, ${database.json(raw as postgres.JSONValue)})`;
}

async function personalizeThreadJob(database: Database, config: Config, job: AgentJob): Promise<void> {
  const threadId = job.payload.threadId;
  if (typeof threadId !== "string") throw new Error("threadId is required");
  const rows = await database<Record<string, unknown>[]>`
    SELECT t.id, t.creator_id, t.campaign_id, t.channel, c.display_name, c.market, c.language, c.country
    FROM conversation_threads t JOIN creators c ON c.id = t.creator_id WHERE t.id = ${threadId}
  `;
  const thread = rows[0];
  if (!thread) throw new Error(`Thread ${threadId} not found`);
  const posts = await database<Record<string, unknown>[]>`
    SELECT title, summary, url, published_at, views, likes, comments FROM creator_posts
    WHERE creator_id = ${String(thread.creator_id)} ORDER BY published_at DESC NULLS LAST LIMIT 10
  `;
  const market = thread.market;
  if (market !== "ru" && market !== "en") throw new Error("Invalid creator market");
  await assertModelBudget(database, config);
  const output = await personalizeOutreach({ creator: thread, posts, market, channel: thread.channel === "telegram" ? "telegram" : "email", model: config.generationModel });
  await database`
    INSERT INTO outreach_messages (id, thread_id, direction, kind, status, subject, body, facts,
      source_urls, model, idempotency_key)
    VALUES (${randomUUID()}, ${threadId}, 'outbound', 'first_contact', 'draft', ${output.subject},
      ${output.body}, ${database.json(output.facts)}, ${database.json([output.chosenPostUrl])},
      ${config.generationModel}, ${`first_contact:${threadId}`})
    ON CONFLICT (thread_id) WHERE direction = 'outbound' AND kind = 'first_contact'
    DO UPDATE SET subject = EXCLUDED.subject, body = EXCLUDED.body, facts = EXCLUDED.facts,
      source_urls = EXCLUDED.source_urls, model = EXCLUDED.model
    WHERE outreach_messages.status = 'draft'
  `;
  await writeAudit(database, { actor: "personalization_agent", action: "draft_first_contact",
    targetType: "thread", targetId: threadId, decision: "completed", details: { sourceUrl: output.chosenPostUrl } });
  await recordUsage(database, null, String(thread.campaign_id), "personalization_agent", config.generationModel, output.usage);
}

async function sendMessageJob(database: Database, config: Config, job: AgentJob): Promise<void> {
  const messageId = job.payload.messageId;
  if (typeof messageId !== "string") throw new Error("messageId is required");
  const policy = await loadPolicy(config.policyPath);
  const rows = await database<Record<string, unknown>[]>`
    SELECT m.*, t.creator_id, t.campaign_id, t.follow_up_count, c.market, c.do_not_contact,
      cc.value AS contact_value, cc.kind AS contact_kind, cc.is_public_business, oc.status AS campaign_status,
      (SELECT cs.total FROM candidate_scores cs WHERE cs.creator_id = c.id AND cs.valid = true ORDER BY cs.created_at DESC LIMIT 1) AS score
    FROM outreach_messages m
    JOIN conversation_threads t ON t.id = m.thread_id
    JOIN creators c ON c.id = t.creator_id
    JOIN creator_contacts cc ON cc.id = t.contact_id
    JOIN outreach_campaigns oc ON oc.id = t.campaign_id
    WHERE m.id = ${messageId}
  `;
  const message = rows[0];
  if (!message) throw new Error(`Message ${messageId} not found`);
  const control = (await database<Record<string, unknown>[]>`SELECT * FROM agent_control WHERE singleton = true`)[0];
  const sentToday = (await database<{ count: number }[]>`
    SELECT count(*)::int AS count FROM outreach_messages
    WHERE direction = 'outbound' AND sent_at >= date_trunc('day', now())
  `)[0]?.count ?? 0;
  const denial = firstSendDenial(message, control ?? {}, policy, sentToday);
  if (denial) {
    await writeAudit(database, { actor: "outreach_agent", action: "send_email", targetType: "message",
      targetId: messageId, decision: "blocked", reason: denial });
    throw new Error(`Send blocked: ${denial}`);
  }
  await database`UPDATE outreach_messages SET status = 'sending' WHERE id = ${messageId} AND status IN ('approved', 'sending')`;
  const market = message.market === "ru" ? "ru" : "en";
  const optOut = market === "ru" ? "\n\nЕсли такие предложения неактуальны, ответьте «не писать», и мы больше не свяжемся." : "\n\nIf this is not relevant, reply “unsubscribe” and we will not contact you again.";
  const externalId = await sendResendEmail(config.resendApiKey, {
    from: config.outreachEmailFrom, to: String(message.contact_value), subject: String(message.subject),
    text: `${String(message.body)}${optOut}`, idempotencyKey: String(message.idempotency_key),
  });
  await database.begin(async (transaction) => {
    await transaction`UPDATE outreach_messages SET status = 'sent', external_message_id = ${externalId}, sent_at = now() WHERE id = ${messageId}`;
    await transaction`UPDATE conversation_threads SET state = 'sent', updated_at = now() WHERE id = ${String(message.thread_id)}`;
    await transaction`UPDATE creators SET status = 'sent', updated_at = now() WHERE id = ${String(message.creator_id)}`;
  });
  await writeAudit(database, { actor: "outreach_agent", action: "send_email", targetType: "message",
    targetId: messageId, decision: "completed", details: { externalId, policyVersion: policy.version } });
}

async function classifyReplyJob(database: Database, config: Config, job: AgentJob): Promise<void> {
  const messageId = job.payload.messageId;
  if (typeof messageId !== "string") throw new Error("messageId is required");
  const rows = await database<Record<string, unknown>[]>`
    SELECT m.*, t.creator_id FROM outreach_messages m JOIN conversation_threads t ON t.id = m.thread_id
    WHERE m.id = ${messageId} AND m.direction = 'inbound'
  `;
  const message = rows[0];
  if (!message) throw new Error(`Inbound message ${messageId} not found`);
  await assertModelBudget(database, config);
  const { usage, ...result } = await classifyReply(String(message.body), config.scoringModel);
  const terminal = result.classification === "unsubscribe" || result.classification === "declined";
  await database.begin(async (transaction) => {
    await transaction`UPDATE outreach_messages SET status = ${`classified:${result.classification}`} WHERE id = ${messageId}`;
    await transaction`UPDATE conversation_threads SET state = ${result.classification}, updated_at = now() WHERE id = ${String(message.thread_id)}`;
    if (terminal) {
      await transaction`UPDATE creators SET do_not_contact = true, status = 'do_not_contact', updated_at = now() WHERE id = ${String(message.creator_id)}`;
      await transaction`
        INSERT INTO do_not_contact (id, creator_id, reason, source) VALUES (${randomUUID()}, ${String(message.creator_id)}, ${result.classification}, 'reply_agent')
        ON CONFLICT DO NOTHING
      `;
    }
  });
  await writeAudit(database, { actor: "reply_agent", action: "classify_reply", targetType: "message",
    targetId: messageId, decision: "completed", details: result });
  await recordUsage(database, null, null, "reply_agent", config.scoringModel, usage);
}

function firstSendDenial(message: Record<string, unknown>, control: Record<string, unknown>, policy: Awaited<ReturnType<typeof loadPolicy>>, sentToday: number): string | null {
  if (control.emergency_stop === true) return "emergency_stop";
  if (message.contact_kind !== "email") return "channel_requires_manual_send";
  if (control.outreach_paused === true || !policy.outreachEnabled) return "outreach_paused";
  if (message.campaign_status !== "active") return "campaign_not_active";
  if (message.status !== "approved" && message.status !== "sending") return "message_not_approved";
  if (!message.approved_by || !message.approved_at) return "human_approval_required";
  if (message.do_not_contact === true) return "do_not_contact";
  if (message.is_public_business !== true) return "contact_not_verified_as_public_business";
  if (typeof message.score !== "number" || message.score < policy.minimumAutomaticScore) return "score_below_threshold";
  if (sentToday >= policy.dailyContactLimit) return "daily_limit_reached";
  if (message.kind === "follow_up" && Number(message.follow_up_count) >= policy.maximumFollowUps) return "follow_up_limit_reached";
  return null;
}

async function scoreCreatorJob(database: Database, config: Config, job: AgentJob): Promise<void> {
  const creatorId = job.payload.creatorId;
  if (typeof creatorId !== "string") throw new Error("creatorId is required");
  const creators = await database<Record<string, unknown>[]>`SELECT * FROM creators WHERE id = ${creatorId}`;
  const creator = creators[0];
  if (!creator) throw new Error(`Creator ${creatorId} not found`);
  const profiles = await database<Record<string, unknown>[]>`
    SELECT platform, profile_url, handle, followers, median_views, engagement_rate, COALESCE(raw_public_data->'snippet'->>'description', raw_public_data->>'description') AS description,
      raw_public_data->'statistics' AS statistics, verified_at
    FROM creator_profiles WHERE creator_id = ${creatorId}
  `;
  const contacts = await database<Record<string, unknown>[]>`
    SELECT kind, is_public_business, source_url FROM creator_contacts WHERE creator_id = ${creatorId}
  `;
  const posts = await database<Record<string, unknown>[]>`
    SELECT title, summary, url, published_at, views, likes, comments FROM creator_posts
    WHERE creator_id = ${creatorId} ORDER BY published_at DESC NULLS LAST LIMIT 10
  `;
  const evidenceUrls = [...profiles.map((profile) => profile.profile_url), ...posts.map((post) => post.url)].filter((url): url is string => typeof url === "string");
  const runId = randomUUID();
  await database`
    INSERT INTO agent_runs (id, agent_name, job_id, status, model, input_summary)
    VALUES (${runId}, 'creator_scorer', ${job.id}, 'running', ${config.scoringModel}, ${creatorId})
  `;
  try {
    await assertModelBudget(database, config);
    const score = await scoreCandidate({ candidate: { creator, profiles, posts, contacts }, model: config.scoringModel, allowedEvidenceUrls: evidenceUrls });
    const { usage: _creatorUsage, ...creatorScoreDetails } = score;
    const campaigns = await database<{ id: string }[]>`
      SELECT id FROM outreach_campaigns WHERE market = ${String(creator.market)} ORDER BY created_at LIMIT 1
    `;
    const valid = score.evidenceUrls.length > 0 && score.redFlags.length === 0;
    await database.begin(async (transaction) => {
      await transaction`
        INSERT INTO candidate_scores (id, creator_id, campaign_id, total, details, evidence_urls, valid, model)
        VALUES (${randomUUID()}, ${creatorId}, ${campaigns[0]?.id ?? null}, ${score.total},
          ${transaction.json(creatorScoreDetails)}, ${transaction.json(score.evidenceUrls)}, ${valid}, ${config.scoringModel})
      `;
      await transaction`
        UPDATE creators SET status = ${valid && score.total >= 80 ? "eligible" : "scored"}, updated_at = now()
        WHERE id = ${creatorId}
      `;
      await transaction`
        UPDATE agent_runs SET status = 'completed', output_summary = ${`score=${score.total};valid=${valid}`},
          finished_at = now() WHERE id = ${runId}
      `;
    });
    await writeAudit(database, { actor: "creator_scorer", action: "score_creator", targetType: "creator",
      targetId: creatorId, decision: "completed", details: { score: score.total, valid } });
    await recordUsage(database, runId, campaigns[0]?.id ?? null, "creator_scorer", config.scoringModel, score.usage);
  } catch (error) {
    await database`UPDATE agent_runs SET status = 'failed', error = ${error instanceof Error ? error.message : String(error)}, finished_at = now() WHERE id = ${runId}`;
    throw error;
  }
}

async function recordUsage(database: Database, runId: string | null, campaignId: string | null, agentName: string, model: string, usage: { inputTokens: number; cachedInputTokens: number; outputTokens: number }): Promise<void> {
  await database`
    INSERT INTO model_usage (run_id, campaign_id, agent_name, model, input_tokens, cached_input_tokens, output_tokens, cost_usd)
    VALUES (${runId}, ${campaignId}, ${agentName}, ${model}, ${usage.inputTokens}, ${usage.cachedInputTokens},
      ${usage.outputTokens}, ${calculateModelCost(model, usage)})
  `;
  if (campaignId) {
    const budget = await database<{ spent: number; budget: number }[]>`
      SELECT COALESCE((SELECT sum(cost_usd) FROM model_usage WHERE campaign_id = ${campaignId}
        AND created_at >= date_trunc('month', now())), 0)::float AS spent,
        model_budget_usd::float AS budget FROM outreach_campaigns WHERE id = ${campaignId}
    `;
    const value = budget[0];
    if (value && value.budget > 0 && value.spent >= value.budget) {
      await database.begin(async (transaction) => {
        await transaction`UPDATE outreach_campaigns SET status = 'paused', updated_at = now() WHERE id = ${campaignId} AND status = 'active'`;
        await transaction`INSERT INTO notifications (id, severity, kind, title, details) VALUES (${randomUUID()}, 'critical', 'campaign_budget_exceeded', 'Кампания остановлена по бюджету', ${transaction.json({ campaignId, spent: value.spent, budget: value.budget })})`;
      });
    }
  }
}

async function assertModelBudget(database: Database, config: Config): Promise<void> {
  const rows = await database<{ spent: number; paused: boolean }[]>`
    SELECT COALESCE((SELECT sum(cost_usd) FROM model_usage), 0)::float AS spent,
      model_operations_paused AS paused FROM agent_control WHERE singleton = true
  `;
  const state = rows[0];
  if (state?.paused) throw new Error("Model operations are paused");
  if ((state?.spent ?? 0) >= config.hardModelBudgetUsd) {
    await database`
      UPDATE agent_control SET model_operations_paused = true,
        reason = 'Hard model budget reached', updated_at = now() WHERE singleton = true
    `;
    throw new Error(`Hard model budget reached: $${config.hardModelBudgetUsd.toFixed(2)}`);
  }
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
