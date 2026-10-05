CREATE TABLE IF NOT EXISTS webhook_events (
  id text PRIMARY KEY,
  provider text NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now()
);
