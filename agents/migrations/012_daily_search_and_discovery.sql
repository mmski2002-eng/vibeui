-- search_budget_usd becomes a daily limit for discovery, scoring and drafting.
UPDATE agent_control SET search_budget_usd = 0.50 WHERE singleton = true;
ALTER TABLE agent_control ADD COLUMN IF NOT EXISTS minimum_score integer NOT NULL DEFAULT 65 CHECK (minimum_score BETWEEN 0 AND 100);
-- Total cap on all model spend ever, next to the daily one; both are edited in the admin.
ALTER TABLE agent_control ADD COLUMN IF NOT EXISTS total_budget_usd numeric(10, 2) NOT NULL DEFAULT 3;
ALTER TABLE agent_control ADD COLUMN IF NOT EXISTS scheduler_state jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS discovery_runs (
  id bigserial PRIMARY KEY,
  source text NOT NULL,
  query text NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  result jsonb,
  error text
);
CREATE INDEX IF NOT EXISTS discovery_runs_source_query_idx ON discovery_runs (source, query, started_at DESC);
