import { randomUUID } from "node:crypto";
import type postgres from "postgres";
import type { Database } from "./database.js";

export interface AgentJob {
  id: string;
  kind: string;
  payload: Record<string, unknown>;
  attempts: number;
  maxAttempts: number;
}

export async function enqueue(
  database: Database,
  kind: string,
  payload: Record<string, unknown>,
  idempotencyKey: string,
): Promise<string> {
  const id = randomUUID();
  const rows = await database<{ id: string }[]>`
    INSERT INTO agent_jobs (id, kind, payload, idempotency_key)
    VALUES (${id}, ${kind}, ${database.json(payload as postgres.JSONValue)}, ${idempotencyKey})
    ON CONFLICT (idempotency_key) DO UPDATE SET idempotency_key = EXCLUDED.idempotency_key
    RETURNING id
  `;
  const row = rows[0];
  if (!row) throw new Error("Job was not created");
  return row.id;
}

export async function claimNext(database: Database, workerId: string): Promise<AgentJob | null> {
  return database.begin(async (transaction) => {
    const rows = await transaction<{
      id: string; kind: string; payload: Record<string, unknown>; attempts: number; max_attempts: number;
    }[]>`
      SELECT id, kind, payload, attempts, max_attempts
      FROM agent_jobs
      WHERE status = 'queued' AND available_at <= now() AND attempts < max_attempts
      ORDER BY created_at
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    `;
    const row = rows[0];
    if (!row) return null;
    await transaction`
      UPDATE agent_jobs
      SET status = 'running', attempts = attempts + 1, locked_at = now(),
          locked_by = ${workerId}, updated_at = now()
      WHERE id = ${row.id}
    `;
    return {
      id: row.id,
      kind: row.kind,
      payload: row.payload,
      attempts: row.attempts + 1,
      maxAttempts: row.max_attempts,
    };
  });
}

export async function completeJob(database: Database, id: string): Promise<void> {
  await database`UPDATE agent_jobs SET status = 'completed', updated_at = now() WHERE id = ${id}`;
}

export async function failJob(database: Database, job: AgentJob, error: unknown): Promise<void> {
  const message = error instanceof Error ? error.message : String(error);
  const retry = job.attempts < job.maxAttempts;
  await database`
    UPDATE agent_jobs
    SET status = ${retry ? "queued" : "failed"}, last_error = ${message.slice(0, 2000)},
        available_at = CASE WHEN ${retry} THEN now() + interval '5 minutes' ELSE available_at END,
        locked_at = null, locked_by = null, updated_at = now()
    WHERE id = ${job.id}
  `;
}
