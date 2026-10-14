-- Threshold 60: creators at 60-64 are worth a first contact. The scheduler re-sorts statuses on its next run.
UPDATE agent_control SET minimum_score = 60, updated_at = now() WHERE minimum_score = 65;

-- Re-score creators the old prompt judged by a weak platform or by reach alone; only those we could still contact.
INSERT INTO agent_jobs (id, kind, payload, idempotency_key)
SELECT md5(random()::text || c.id::text)::uuid, 'score_creator', jsonb_build_object('creatorId', c.id), 'rescore_017:' || c.id
FROM creators c
JOIN LATERAL (SELECT total, details FROM candidate_scores WHERE creator_id = c.id ORDER BY created_at DESC LIMIT 1) s ON true
WHERE c.do_not_contact = false
  AND EXISTS (SELECT 1 FROM creator_contacts ct WHERE ct.creator_id = c.id)
  AND NOT EXISTS (SELECT 1 FROM conversation_threads t WHERE t.creator_id = c.id)
  AND ((c.status = 'scored' AND s.total BETWEEN 50 AND 64) OR (c.status = 'eligible' AND (s.details->>'topicFit')::int < 15))
ON CONFLICT (idempotency_key) DO NOTHING;
