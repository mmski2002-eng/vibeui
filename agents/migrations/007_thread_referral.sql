ALTER TABLE conversation_threads
  ADD COLUMN IF NOT EXISTS referral_code text,
  ADD COLUMN IF NOT EXISTS referral_url text;
