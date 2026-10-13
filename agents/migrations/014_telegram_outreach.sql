-- Telegram answers PEER_FLOOD / long FLOOD_WAIT with a ban warning; sending stops until this moment.
ALTER TABLE telegram_bot_state ADD COLUMN IF NOT EXISTS outreach_paused_until timestamptz;
