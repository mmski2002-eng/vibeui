CREATE TABLE IF NOT EXISTS telegram_bot_state (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  update_offset bigint NOT NULL DEFAULT 0
);
INSERT INTO telegram_bot_state (singleton) VALUES (true) ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS telegram_drafts (
  id uuid PRIMARY KEY,
  thread_id uuid NOT NULL REFERENCES conversation_threads(id),
  inbound_message_id uuid NOT NULL REFERENCES outreach_messages(id),
  instruction text NOT NULL,
  body_ru text NOT NULL,
  sent_message_id uuid REFERENCES outreach_messages(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Any Telegram message the owner can reply to points back to the letter it is about.
CREATE TABLE IF NOT EXISTS telegram_links (
  telegram_message_id bigint PRIMARY KEY,
  inbound_message_id uuid NOT NULL REFERENCES outreach_messages(id),
  draft_id uuid REFERENCES telegram_drafts(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
