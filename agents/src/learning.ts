import { randomUUID } from "node:crypto";
import type postgres from "postgres";
import type { Config } from "./config.js";
import type { Database } from "./database.js";
import { notify } from "./email/inbound.js";
import { calculateModelCost } from "./model-cost.js";
import { currentPlaybook, savePlaybook, unknownFacts } from "./playbook.js";
import { learnPlaybook } from "./reply-agent.js";

export const learningIntervalDays = 3;
const dataLimit = 60_000;

export interface WindowMetrics { sent: number; answered: number; responseRate: number | null; partners: number; publications: number; declined: number }

export async function windowMetrics(database: Database, start: Date, end: Date): Promise<WindowMetrics> {
  const row = (await database<Omit<WindowMetrics, "responseRate">[]>`
    SELECT
      (SELECT count(*)::int FROM outreach_messages WHERE direction = 'outbound' AND sent_at >= ${start} AND sent_at < ${end}) AS sent,
      (SELECT count(*)::int FROM outreach_messages o WHERE o.direction = 'outbound' AND o.sent_at >= ${start} AND o.sent_at < ${end}
        AND EXISTS (SELECT 1 FROM outreach_messages i WHERE i.thread_id = o.thread_id AND i.direction = 'inbound'
          AND i.received_at > o.sent_at AND i.received_at < o.sent_at + interval '4 days')) AS answered,
      (SELECT count(*)::int FROM partners WHERE created_at >= ${start} AND created_at < ${end}) AS partners,
      (SELECT count(*)::int FROM publications WHERE created_at >= ${start} AND created_at < ${end}) AS publications,
      (SELECT count(*)::int FROM outreach_messages WHERE direction = 'inbound' AND received_at >= ${start} AND received_at < ${end}
        AND status IN ('classified:declined', 'classified:unsubscribe')) AS declined
  `)[0]!;
  return { ...row, responseRate: row.sent ? row.answered / row.sent : null };
}

// Too few letters say nothing; with enough, a drop of a third in answers means the new wording hurts.
export function worse(before: WindowMetrics, after: WindowMetrics): boolean {
  if (before.sent < 5 || after.sent < 5 || before.responseRate === null || after.responseRate === null) return false;
  return after.responseRate < before.responseRate * 0.67;
}

async function conversationData(database: Database, start: Date): Promise<string> {
  const threads = await database<{ id: string; display_name: string; market: string; state: string; partner: string | null; publications: number; payments: number }[]>`
    SELECT t.id, c.display_name, c.market, t.state, p.status AS partner,
      (SELECT count(*)::int FROM publications pb WHERE pb.partner_id = p.id) AS publications,
      COALESCE((SELECT rm.payments FROM referral_metrics rm WHERE rm.partner_id = p.id ORDER BY rm.measured_at DESC LIMIT 1), 0)::int AS payments
    FROM conversation_threads t JOIN creators c ON c.id = t.creator_id LEFT JOIN partners p ON p.creator_id = c.id
    WHERE EXISTS (SELECT 1 FROM outreach_messages m WHERE m.thread_id = t.id AND COALESCE(m.sent_at, m.received_at) >= ${start})
    ORDER BY t.updated_at DESC LIMIT 60
  `;
  const parts: string[] = [];
  for (const thread of threads) {
    const messages = await database<{ direction: string; at: Date; body: string; status: string }[]>`
      SELECT direction, COALESCE(sent_at, received_at) AS at, body, status FROM outreach_messages
      WHERE thread_id = ${thread.id} AND (sent_at IS NOT NULL OR direction = 'inbound') ORDER BY COALESCE(sent_at, received_at)
    `;
    parts.push([`### ${thread.display_name} (${thread.market}) — стадия ${thread.state}, партнёр: ${thread.partner ?? "нет"}, роликов ${thread.publications}, оплат ${thread.payments}`,
      ...messages.map((message) => `[${message.direction === "inbound" ? "блогер" : "мы"} ${message.at.toISOString().slice(0, 10)}${message.direction === "inbound" ? ` ${message.status}` : ""}] ${message.body.slice(0, 1500)}`)].join("\n"));
  }
  const corrections = await database<{ agent_body: string; owner_instruction: string; owner_body: string }[]>`
    SELECT a.body_ru AS agent_body, o.instruction AS owner_instruction, o.body_ru AS owner_body
    FROM telegram_drafts a JOIN telegram_drafts o ON o.inbound_message_id = a.inbound_message_id AND o.author = 'owner' AND o.created_at > a.created_at
    WHERE a.author = 'agent' AND a.created_at >= ${start} AND o.sent_message_id IS NOT NULL
  `;
  const skipped = await database<{ body_ru: string }[]>`
    SELECT body_ru FROM telegram_drafts WHERE author = 'agent' AND skipped_at IS NOT NULL AND created_at >= ${start} AND decision = 'reply'
  `;
  const text = [
    "## Переписки и итоги", ...parts,
    "## Правки владельца: что предложил агент → что отправил владелец",
    ...corrections.map((row) => `Агент: ${row.agent_body}\nУказание владельца: ${row.owner_instruction}\nОтправлено: ${row.owner_body}`),
    "## Ответы агента, которые владелец решил не отправлять", ...skipped.map((row) => row.body_ru),
  ].join("\n\n");
  return text.slice(0, dataLimit);
}

export async function learningDue(database: Database): Promise<boolean> {
  const last = (await database<{ created_at: Date }[]>`SELECT created_at FROM learning_runs ORDER BY created_at DESC LIMIT 1`)[0];
  return !last || last.created_at.getTime() < Date.now() - learningIntervalDays * 86_400_000;
}

export async function runLearning(database: Database, config: Config): Promise<void> {
  const previous = (await database<{ created_at: Date; window_start: Date; metrics: WindowMetrics; version_id: string | null }[]>`
    SELECT created_at, window_start, metrics, version_id FROM learning_runs WHERE error IS NULL ORDER BY created_at DESC LIMIT 1
  `)[0];
  const end = new Date();
  const start = previous?.created_at ?? new Date(end.getTime() - 30 * 86_400_000);
  const metrics = await windowMetrics(database, start, end);
  const runId = randomUUID();
  const record = (fields: { version?: string | null; rolledBack?: string | null; changes?: string[]; error?: string | null }) => database`
    INSERT INTO learning_runs (id, window_start, window_end, metrics, changes, version_id, rolled_back_version_id, error)
    VALUES (${runId}, ${start}, ${end}, ${database.json(metrics as unknown as postgres.JSONValue)}, ${database.json((fields.changes ?? []) as postgres.JSONValue)},
      ${fields.version ?? null}, ${fields.rolledBack ?? null}, ${fields.error ?? null})
  `;
  const playbook = await currentPlaybook(database, config);

  // The last agent version is judged by what happened after it; an owner edit since then is never overridden.
  if (previous?.version_id && playbook.id === previous.version_id && playbook.author === "agent" && worse(previous.metrics, metrics)) {
    const before = (await database<{ locked: string; experience: string }[]>`
      SELECT locked, experience FROM playbook_versions WHERE created_at < ${playbook.created_at} ORDER BY created_at DESC LIMIT 1
    `)[0];
    if (before) {
      const restored = await savePlaybook(database, { locked: playbook.locked, experience: before.experience, author: "rollback",
        reason: `Ответов стало меньше: ${percent(previous.metrics.responseRate)} → ${percent(metrics.responseRate)}. Возвращён прошлый опыт.` });
      await record({ version: restored.id, rolledBack: playbook.id, changes: ["Откат прошлой версии опыта: после неё блогеры отвечали заметно реже."] });
      await notify(database, "warning", "playbook_rolled_back", "Агент откатил свои правила", { before: percent(previous.metrics.responseRate), after: percent(metrics.responseRate) });
      return;
    }
  }

  try {
    const data = await conversationData(database, start);
    const learned = await learnPlaybook({ locked: playbook.locked, experience: playbook.experience, data, model: config.generationModel });
    await database`
      INSERT INTO model_usage (agent_name, model, input_tokens, cached_input_tokens, output_tokens, cost_usd)
      VALUES ('playbook_learner', ${config.generationModel}, ${learned.usage.inputTokens}, ${learned.usage.cachedInputTokens}, ${learned.usage.outputTokens},
        ${calculateModelCost(config.generationModel, learned.usage)})
    `;
    const invented = unknownFacts(playbook.locked, learned.experience);
    if (invented.length) throw new Error(`Learner added facts not in the locked part: ${invented.join(", ")}`);
    if (learned.changes.length === 0 || learned.experience.trim() === playbook.experience.trim()) {
      await record({ changes: [] });
      return;
    }
    const version = await savePlaybook(database, { locked: playbook.locked, experience: learned.experience.trim(), author: "agent", reason: learned.changes.join("\n") });
    await record({ version: version.id, changes: learned.changes });
    await notify(database, "info", "playbook_learned", "Агент обновил свои правила", {
      changes: learned.changes.map((change) => `• ${change}`).join("\n"), answers: percent(metrics.responseRate),
    });
  } catch (error) {
    // Recorded, not retried: the next attempt is the regular one in three days.
    const message = error instanceof Error ? error.message : String(error);
    await record({ error: message });
    await notify(database, "warning", "playbook_learning_failed", "Обучение агента не удалось", { error: message.slice(0, 300) });
  }
}

function percent(value: number | null): string {
  return value === null ? "—" : `${Math.round(value * 100)}%`;
}
