CREATE TABLE IF NOT EXISTS agent_control (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  emergency_stop boolean NOT NULL DEFAULT false,
  outreach_paused boolean NOT NULL DEFAULT true,
  reason text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO agent_control (singleton) VALUES (true)
ON CONFLICT (singleton) DO NOTHING;

CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY,
  market text NOT NULL CHECK (market IN ('ru', 'en')),
  platform text NOT NULL,
  display_name text NOT NULL,
  profile_url text NOT NULL UNIQUE,
  contact text,
  contact_source_url text,
  contact_is_public_business boolean NOT NULL DEFAULT false,
  language text,
  country text,
  followers integer,
  median_views integer,
  engagement_rate numeric(8, 4),
  topics jsonb NOT NULL DEFAULT '[]'::jsonb,
  evidence jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'discovered',
  score integer,
  score_details jsonb,
  do_not_contact boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agent_jobs (
  id uuid PRIMARY KEY,
  kind text NOT NULL,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
  attempts integer NOT NULL DEFAULT 0,
  max_attempts integer NOT NULL DEFAULT 3,
  idempotency_key text NOT NULL UNIQUE,
  available_at timestamptz NOT NULL DEFAULT now(),
  locked_at timestamptz,
  locked_by text,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS agent_jobs_claim_idx
ON agent_jobs (status, available_at, created_at);

CREATE TABLE IF NOT EXISTS agent_runs (
  id uuid PRIMARY KEY,
  agent_name text NOT NULL,
  job_id uuid REFERENCES agent_jobs(id),
  status text NOT NULL CHECK (status IN ('running', 'completed', 'failed', 'blocked')),
  model text,
  input_summary text,
  output_summary text,
  error text,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz
);

CREATE TABLE IF NOT EXISTS agent_actions (
  id bigserial PRIMARY KEY,
  actor text NOT NULL,
  action text NOT NULL,
  target_type text,
  target_id text,
  decision text NOT NULL,
  reason text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS agent_actions_created_idx
ON agent_actions (created_at DESC);

CREATE TABLE IF NOT EXISTS contact_attempts (
  id uuid PRIMARY KEY,
  candidate_id uuid NOT NULL REFERENCES candidates(id),
  channel text NOT NULL,
  status text NOT NULL,
  approved_by text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
