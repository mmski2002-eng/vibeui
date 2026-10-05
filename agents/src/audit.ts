import type { Database } from "./database.js";
import type postgres from "postgres";

export interface AuditEntry {
  actor: string;
  action: string;
  targetType?: string;
  targetId?: string;
  decision: "allowed" | "blocked" | "completed" | "failed";
  reason?: string;
  details?: Record<string, unknown>;
}

export async function writeAudit(database: Database, entry: AuditEntry): Promise<void> {
  await database`
    INSERT INTO agent_actions (
      actor, action, target_type, target_id, decision, reason, details
    ) VALUES (
      ${entry.actor}, ${entry.action}, ${entry.targetType ?? null},
      ${entry.targetId ?? null}, ${entry.decision}, ${entry.reason ?? null},
      ${database.json((entry.details ?? {}) as postgres.JSONValue)}
    )
  `;
}
