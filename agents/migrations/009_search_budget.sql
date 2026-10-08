ALTER TABLE agent_control ADD COLUMN IF NOT EXISTS search_budget_usd numeric(10, 2);
UPDATE agent_control SET search_budget_usd = 3, model_operations_paused = false WHERE singleton = true AND search_budget_usd IS NULL;
