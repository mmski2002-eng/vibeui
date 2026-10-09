import { randomUUID } from "node:crypto";
import type { Database } from "./database.js";
import { enqueue } from "./queue.js";

// limit: the scheduler drafts only what the next days of sending need, best scores first; the admin button drafts all.
export async function prepareDrafts(database: Database, limit: number | null = null): Promise<number> {
  // One thread per creator and campaign; email is preferred because only email can be sent automatically.
  const rows = await database<{ creator_id: string; campaign_id: string; contact_id: string; kind: string }[]>`
    SELECT creator_id, campaign_id, contact_id, kind FROM (
    SELECT DISTINCT ON (c.id, oc.id) c.id AS creator_id, oc.id AS campaign_id, cc.id AS contact_id, cc.kind,
      (SELECT total FROM candidate_scores s WHERE s.creator_id = c.id ORDER BY s.created_at DESC LIMIT 1) AS score
    FROM creators c
    JOIN creator_contacts cc ON cc.creator_id = c.id AND cc.is_public_business = true AND cc.verified_at IS NOT NULL
    JOIN outreach_campaigns oc ON oc.market = c.market AND oc.status IN ('dry_run', 'active')
    WHERE c.status = 'eligible' AND c.do_not_contact = false
      AND EXISTS (SELECT 1 FROM candidate_scores cs WHERE cs.creator_id = c.id AND cs.valid = true AND cs.total >= (SELECT minimum_score FROM agent_control WHERE singleton = true))
      AND NOT EXISTS (SELECT 1 FROM conversation_threads t WHERE t.creator_id = c.id AND t.campaign_id = oc.id)
    ORDER BY c.id, oc.id, (cc.kind = 'email') DESC, cc.verified_at DESC
    ) candidates ORDER BY (kind = 'email') DESC, score DESC NULLS LAST LIMIT ${limit}
  `;
  for (const row of rows) {
    const threadId = randomUUID();
    await database`
      INSERT INTO conversation_threads (id, creator_id, campaign_id, contact_id, channel, state)
      VALUES (${threadId}, ${row.creator_id}, ${row.campaign_id}, ${row.contact_id}, ${row.kind}, 'queued')
      ON CONFLICT (creator_id, campaign_id, channel) DO NOTHING
    `;
    await enqueue(database, "personalize_thread", { threadId }, `personalize_thread:${threadId}`);
  }
  return rows.length;
}
