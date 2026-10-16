# Пробелы в данных — VibeUI, 2026-10-16

Что не удалось проверить и что нужно от владельца. Без этого выводы о трафике, позициях и конверсиях невозможны — в отчёте они не придумывались.

**Обновление 2026-10-16:** GSC (.ru и .club), Вебмастер и GA4 сняты через браузер — см. SEARCH-DATA.md.
Что осталось открытым:
- Метрика — сбой Яндекса;
- «Исключённые страницы» Вебмастера — сбой Яндекса;
- выгрузки URL-списков из GSC — не делались;
- query-page пары;
- Enhanced measurement GA4.

Таблица ниже — исходный список, по части пунктов уже закрыт.

## Не было доступа

| Источник | Что нужно | Как выгрузить |
|---|---|---|
| Google Search Console `https://vibeui.ru/` | Эффективность: 16 мес., 90 дн., 28 дн. | Эффективность → Результаты поиска → период → «Экспорт» → Google Sheets/CSV; вкладки Запросы, Страницы, Страны, Устройства, Вид в поиске. Для query-page пар — Looker Studio коннектор или Search Analytics API (`dimensions: query,page`) |
| GSC — индексирование | Покрытие | Индексирование → Страницы → «Экспорт» (причины «Обнаружена, не проиндексирована», «Просканирована, не проиндексирована», «Дубликат, канонический выбран Google») |
| GSC — Sitemaps, Статистика сканирования, Core Web Vitals, Меры вручную, Безопасность, Ссылки | Скриншоты/экспорт | Настройки → Статистика сканирования; Ссылки → Экспорт |
| GSC `https://vibeui.club/` | Есть ли ресурс вообще | По коду верификация общая — проверить, добавлен ли .club |
| Яндекс.Вебмастер | Подтверждены ли права (SEO.md на 08.09: нет), страницы в поиске, исключённые, запросы, ИКС, статистика обхода | Индексирование → Страницы в поиске → «Исключённые» → выгрузка; Поисковые запросы → Статистика → выгрузка |
| GA4 | Органические сессии по landing page, hostname, устройства | Reports → Engagement → Landing page, фильтр Session default channel group = Organic Search; или доступ Viewer на `mmski2002@gmail.com`-ресурс |
| Яндекс.Метрика `112394418` | Источники → Поисковые системы, Страницы входа, Вебвизор | Гостевой доступ на просмотр |
| Платёжные данные | Покупки по дате (для revenue from organic) | Позже, после внедрения `purchase` (см. ANALYTICS) |

## Не удалось измерить инструментально

| Что | Почему | Как закрыть |
|---|---|---|
| Lighthouse/PageSpeed lab | PSI API без ключа: `429 Quota exceeded` на все 16 запросов (2026-10-16). Локальный Lighthouse не запускался: правило проекта о слабой машине | Владелец: pagespeed.web.dev по 8 URL из METRICS-BASELINE.csv (mobile+desktop), либо API-ключ PSI |
| CrUX (поле) | Нет PSI; вероятно и нет данных из-за малого трафика | CrUX Vis / GSC CWV |
| Реальная выдача Google и Яндекса (RU-регион) | Доступный поиск — US web index | Ручные проверки по списку запросов из CONTENT-AND-SEMANTICS или сервис позиций (Topvisor/Serpstat) |
| Search volume | Нет Wordstat/Keyword Planner | Wordstat (RU), Google Keyword Planner или Ahrefs (EN) по кластерам из CONTENT-AND-SEMANTICS |
| Ссылки, referring domains | Нет Ahrefs/Semrush | GSC «Ссылки» + Вебмастер «Внешние ссылки» бесплатно |
| AI-ответы (ChatGPT, Perplexity, AI Overviews) | Не тестировалось вручную | Ежемесячный ручной прогон 20 промптов (список в CONTENT-AND-SEMANTICS §GEO) |
| Логи сервера (боты) | Read-only SSH возможен, но не делалось ради экономии | `awk` по nginx access.log: доли Googlebot/YandexBot/GPTBot/ClaudeBot/PerplexityBot по путям |
| Enhanced measurement GA4 (дубль page_view) | Нет доступа к GA4 | DebugView |

## Найденные расхождения документации с фактом
- CLAUDE.md: «`<html lang>` на .club серверно `ru`» — **устарело**: production `.club` отдаёт `<html lang="en">`.
- CLAUDE.md: «`app/en/legal/offer`» — **файла нет**; `/legal/*` только в `app/legal`.
- SEO.md: «английская под `/en`» — устарело: `/en` на .ru отдаёт 404, английский — на vibeui.club без префикса.
- SEO.md: «два `application/ld+json`» на странице каталога — на item их три (site graph, SoftwareSourceCode, BreadcrumbList).
