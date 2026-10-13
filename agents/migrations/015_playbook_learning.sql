-- The reply playbook lives in the database so the owner edits it in the admin and the agent rewrites its own part.
-- `locked` (facts, prohibitions) is changed only by the owner; `experience` (tone, typical answers) also by learning.
CREATE TABLE IF NOT EXISTS playbook_versions (
  id uuid PRIMARY KEY,
  locked text NOT NULL,
  experience text NOT NULL,
  author text NOT NULL CHECK (author IN ('seed', 'owner', 'agent', 'rollback')),
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS learning_runs (
  id uuid PRIMARY KEY,
  window_start timestamptz NOT NULL,
  window_end timestamptz NOT NULL,
  metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  changes jsonb NOT NULL DEFAULT '[]'::jsonb,
  version_id uuid REFERENCES playbook_versions(id),
  rolled_back_version_id uuid REFERENCES playbook_versions(id),
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- While true every reply the agent writes waits for the owner's button; false sends it at once.
ALTER TABLE agent_control ADD COLUMN IF NOT EXISTS ask_owner boolean NOT NULL DEFAULT true;

ALTER TABLE telegram_drafts ADD COLUMN IF NOT EXISTS author text NOT NULL DEFAULT 'owner';
ALTER TABLE telegram_drafts ADD COLUMN IF NOT EXISTS decision text;
ALTER TABLE telegram_drafts ADD COLUMN IF NOT EXISTS skipped_at timestamptz;
