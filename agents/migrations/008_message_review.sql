ALTER TABLE outreach_messages
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS edited_at timestamptz;
