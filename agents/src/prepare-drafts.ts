import { randomUUID } from "node:crypto";
import type { Database } from "./database.js";
import { enqueue } from "./queue.js";

export async function prepareDrafts(database: Database): Promise<number> {
  const rows = await database<{ creator_id: string; campaign_id: string; contact_id: string }[]>`
    SELECT c.id AS creator_id, oc.id AS campaign_id, cc.id AS contact_id
    FROM creators c
    JOIN creator_contacts cc ON cc.creator_id = c.id AND cc.is_public_business = true AND cc.verified_at IS NOT NULL
    JOIN outreach_campaigns oc ON oc.market = c.market AND oc.status IN ('dry_run', 'active')
    WHERE c.status = 'eligible' AND c.do_not_contact = false
      AND EXISTS (SELECT 1 FROM candidate_scores cs WHERE cs.creator_id = c.id AND cs.valid = true AND cs.total >= oc.minimum_score)
      AND NOT EXISTS (SELECT 1 FROM conversation_threads t WHERE t.creator_id = c.id AND t.campaign_id = oc.id)
  `;
  for (const row of rows) {
    const threadId = randomUUID();
    await database`
      INSERT INTO conversation_threads (id, creator_id, campaign_id, contact_id, channel, state)
      VALUES (${threadId}, ${row.creator_id}, ${row.campaign_id}, ${row.contact_id}, 'email', 'queued')
      ON CONFLICT (creator_id, campaign_id, channel) DO NOTHING
    `;
    await enqueue(database, "personalize_thread", { threadId }, `personalize_thread:${threadId}`);
  }
  return rows.length;
}
