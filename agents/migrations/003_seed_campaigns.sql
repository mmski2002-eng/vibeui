INSERT INTO outreach_campaigns (
  id, name, market, domain, language, status, target_topics, search_queries, allowed_platforms,
  minimum_score, daily_limit, model_budget_usd
) VALUES
(
  '10000000-0000-4000-8000-000000000001', 'VibeUI RU research', 'ru', 'vibeui.ru', 'ru', 'dry_run',
  '["вайбкодинг","AI-разработка","React","Next.js","Tailwind CSS","shadcn","SaaS","MVP"]'::jsonb,
  '["вайбкодинг","Cursor урок","Claude Code","Codex разработка","AI для программиста","React компоненты","Tailwind CSS","shadcn","создание SaaS","запуск MVP"]'::jsonb,
  '["youtube","telegram","vk","dzen","habr","vc","rutube","newsletter","podcast","website"]'::jsonb,
  80, 5, 75
),
(
  '10000000-0000-4000-8000-000000000002', 'VibeUI EN research', 'en', 'vibeui.club', 'en', 'dry_run',
  '["vibe coding","AI coding","React","Next.js","Tailwind CSS","shadcn","indie hacking","SaaS","MVP"]'::jsonb,
  '["vibe coding","build with Cursor","Claude Code workflow","Codex workflow","AI coding tools","React component library","Tailwind components","shadcn components","build an MVP"]'::jsonb,
  '["youtube","x","tiktok","linkedin","instagram","newsletter","podcast","devto","hashnode","medium","producthunt","website"]'::jsonb,
  80, 5, 75
)
ON CONFLICT (id) DO NOTHING;
