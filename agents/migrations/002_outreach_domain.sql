ALTER TABLE agent_control
  ADD COLUMN IF NOT EXISTS partnerships_paused boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS payouts_paused boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS safe_tasks_only boolean NOT NULL DEFAULT true;

CREATE TABLE IF NOT EXISTS outreach_campaigns (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  market text NOT NULL CHECK (market IN ('ru', 'en')),
  domain text NOT NULL,
  language text NOT NULL,
  status text NOT NULL DEFAULT 'dry_run' CHECK (status IN ('draft', 'dry_run', 'active', 'paused', 'completed')),
  target_topics jsonb NOT NULL DEFAULT '[]'::jsonb,
  search_queries jsonb NOT NULL DEFAULT '[]'::jsonb,
  allowed_platforms jsonb NOT NULL DEFAULT '[]'::jsonb,
  minimum_score integer NOT NULL DEFAULT 80,
  daily_limit integer NOT NULL DEFAULT 5,
  model_budget_usd numeric(12, 4) NOT NULL DEFAULT 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS creators (
  id uuid PRIMARY KEY,
  display_name text NOT NULL,
  market text NOT NULL CHECK (market IN ('ru', 'en')),
  language text,
  country text,
  status text NOT NULL DEFAULT 'new',
  do_not_contact boolean NOT NULL DEFAULT false,
  blocked_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS creator_profiles (
  id uuid PRIMARY KEY,
  creator_id uuid NOT NULL REFERENCES creators(id),
  platform text NOT NULL,
  external_id text,
  profile_url text NOT NULL,
  handle text,
  followers integer,
  median_views integer,
  engagement_rate numeric(8, 4),
  raw_public_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (platform, profile_url),
  UNIQUE NULLS NOT DISTINCT (platform, external_id)
);

CREATE TABLE IF NOT EXISTS creator_posts (
  id uuid PRIMARY KEY,
  creator_id uuid NOT NULL REFERENCES creators(id),
  profile_id uuid NOT NULL REFERENCES creator_profiles(id),
  external_id text,
  url text NOT NULL,
  title text NOT NULL,
  summary text,
  published_at timestamptz,
  views integer,
  likes integer,
  comments integer,
  source_checked_at timestamptz NOT NULL DEFAULT now(),
  raw_public_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (profile_id, url)
);

CREATE TABLE IF NOT EXISTS creator_contacts (
  id uuid PRIMARY KEY,
  creator_id uuid NOT NULL REFERENCES creators(id),
  kind text NOT NULL,
  value text NOT NULL,
  normalized_value text NOT NULL,
  source_url text NOT NULL,
  is_public_business boolean NOT NULL DEFAULT false,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kind, normalized_value)
);

CREATE TABLE IF NOT EXISTS candidate_scores (
  id uuid PRIMARY KEY,
  creator_id uuid NOT NULL REFERENCES creators(id),
  campaign_id uuid REFERENCES outreach_campaigns(id),
  total integer NOT NULL CHECK (total BETWEEN 0 AND 100),
  details jsonb NOT NULL,
  evidence_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  valid boolean NOT NULL DEFAULT false,
  model text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversation_threads (
  id uuid PRIMARY KEY,
  creator_id uuid NOT NULL REFERENCES creators(id),
  campaign_id uuid NOT NULL REFERENCES outreach_campaigns(id),
  contact_id uuid NOT NULL REFERENCES creator_contacts(id),
  channel text NOT NULL,
  external_thread_id text,
  state text NOT NULL DEFAULT 'queued',
  follow_up_count integer NOT NULL DEFAULT 0,
  next_action_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (creator_id, campaign_id, channel)
);

CREATE TABLE IF NOT EXISTS outreach_messages (
  id uuid PRIMARY KEY,
  thread_id uuid NOT NULL REFERENCES conversation_threads(id),
  direction text NOT NULL CHECK (direction IN ('outbound', 'inbound')),
  kind text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  subject text,
  body text NOT NULL,
  facts jsonb NOT NULL DEFAULT '[]'::jsonb,
  source_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  model text,
  approved_by text,
  approved_at timestamptz,
  idempotency_key text UNIQUE,
  external_message_id text UNIQUE,
  sent_at timestamptz,
  received_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS outreach_first_message_once_idx
ON outreach_messages (thread_id) WHERE direction = 'outbound' AND kind = 'first_contact';

CREATE TABLE IF NOT EXISTS do_not_contact (
  id uuid PRIMARY KEY,
  creator_id uuid REFERENCES creators(id),
  normalized_contact text,
  reason text NOT NULL,
  source text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE NULLS NOT DISTINCT (creator_id, normalized_contact)
);

CREATE TABLE IF NOT EXISTS compliance_checks (
  id uuid PRIMARY KEY,
  object_type text NOT NULL,
  object_id uuid NOT NULL,
  rule text NOT NULL,
  result text NOT NULL CHECK (result IN ('passed', 'failed', 'needs_review')),
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  resolved_at timestamptz,
  resolution_comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS model_usage (
  id bigserial PRIMARY KEY,
  run_id uuid REFERENCES agent_runs(id),
  campaign_id uuid REFERENCES outreach_campaigns(id),
  agent_name text NOT NULL,
  model text NOT NULL,
  input_tokens integer NOT NULL DEFAULT 0,
  cached_input_tokens integer NOT NULL DEFAULT 0,
  output_tokens integer NOT NULL DEFAULT 0,
  cost_usd numeric(12, 6) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY,
  severity text NOT NULL,
  kind text NOT NULL,
  title text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  object_url text,
  delivered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
