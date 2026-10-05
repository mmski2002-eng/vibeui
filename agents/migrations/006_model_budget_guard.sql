ALTER TABLE agent_control
  ADD COLUMN IF NOT EXISTS model_operations_paused boolean NOT NULL DEFAULT false;
