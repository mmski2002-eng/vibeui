# Технический SEO-аудит — VibeUI, 2026-10-16

Метод: полный обход sitemap `vibeui.ru` (2141 URL) + каждый 7-й URL sitemap `vibeui.club` (306 URL) = **2447 URL**, UA Googlebot, curl, без выполнения JS. Плюс ручные запросы к служебным маршрутам и чтение кода. Выборка — `URL-SAMPLE.csv`. Метки: **Факт / Гипотеза / Рекомендация**. Масштаб указан в скобках.

## 1. Доступность и индексация

| Проверка | Результат | Статус |
|---|---|---|
| HTTP-статусы URL из sitemap | 2447/2447 = 200 | Факт |
| http → https, www → без www | 301 одним шагом на обоих доменах | Факт, ок |
| Завершающий `/` | `/components/` → 308 `/components` | Факт, ок |
| Регистр | `/COMPONENTS` → 404 | Факт, ок |
| Несуществующий item | `/blocks/hero-999` → 404 | Факт, ок (soft-404 нет) |
| Percent-encoding | `/blocks/hero%2D001` → 200, canonical на `hero-001` | Факт, ок |
| Параметры | `?theme=light`, `?utm_source=` → 200, canonical без параметров | Факт, ок |
| `/?ref=` | 307 → `/i/<код>` | Факт; 307 временный — ок для трекинга |
| `/en`, `/en/*` на .ru | 404 в проде | Факт. **Не «ок»**: по GSC эти адреса получали клики и дают 407 ошибок 404 (SEARCH-DATA). В рабочей копии 301 на .club, не задеплоено (STAGE-1) |
| `/account` | 307 → `/signin?next=` | Факт, ок |
| `/signin` | 200, `noindex, nofollow` | Факт, ок |
| `/search` | Disallow + `noindex, follow` | Факт, ок |
| `/preview/*` | Disallow + `noindex, nofollow` | Факт; см. рендеринг §4 |
| `/c/*` | 401 аноним | Факт |
| `/r/*.json` | 200, Disallow | Факт; см. GEO |
| `/r` (индекс реестра) | 404 | Факт |
| `/llms.txt` | 404 оба домена | Факт |
| **`/legal/offer`, `/legal/privacy`** | **404 на .ru и .club** | Факт. Файлы удалены в коммите `8734e999`, в `app/legal/*` пустые папки. Сайт принимает оплату без доступной оферты — риск доверия и требований ЮKassa/NOWPayments (масштаб: весь сайт) |
| X-Robots-Tag | не выставляется | Факт |
| robots.txt | одинаковый на доменах, `Host:` свой | Факт; директива `Host` Яндексом больше не используется — безвредна |

### Sitemap
- `.ru` — 2141 `<loc>`, 964 КБ; `.club` — 2141, 968 КБ. Один файл без индекса: лимит 50 000 URL/50 МБ не превышен (Факт).
- Состав `.ru`: 3 корня каталога, 60 категорий, 2018 items, `/`, `/start`, `/pricing`, `/scenarios` + 28 сценариев + 28 демо.
- `lastmod` из git, разные даты (694 URL — 2026-09-22, 567 — 09-20, …) — Факт, корректно.
- В sitemap только 200-страницы, закрытых/редиректных нет (по обходу).
- **Расхождение**: у 28 демо sitemap объявляет hreflang-пару ru/en/x-default, а HTML демо hreflang и canonical не содержит (Факт; [app/scenarios/bakery/demo/page.tsx:26](../../../app/scenarios/bakery/demo/page.tsx#L26) — собственный `metadata` без `pageMetadata()`). Масштаб: шаблон, ~56 URL на двух доменах.

### Кеширование и рендер
- Все страницы: `Cache-Control: private, no-cache, no-store`, Cloudflare на .club — `cf-cache-status: DYNAMIC` (Факт). Причина — корневой layout читает `headers()` (host) → весь сайт динамический ([app/layout.tsx:36](../../../app/layout.tsx#L36), [app/sitemap.ts:63](../../../app/sitemap.ts#L63)). Каждый заход краулера = SSR на VPS.
- TTFB под Googlebot UA (Факт, 2447 запросов, 6 параллельных потоков, из РФ): p50 **0.33 с**, p90 **0.69 с**, max **8.18 с** (`vibeui.club/components/popover`). Средний TTFB: item 0.41 с, категории 0.72 с. Под нагрузкой обхода есть выбросы 3–8 с — при активном краулинге это сигнал Googlebot снизить скорость обхода. .club ходит в БД через SSH-туннель в РФ — гипотеза причины выбросов на .club.

## 2. Дубли и каннибализация

| Проблема | Масштаб | Статус |
|---|---|---|
| Повтор title на разных items (RU) — 49 названий на 104 items; в обходе 54 повторяющихся title | шаблон item, ~104 URL × 2 языка | Факт |
| Повтор EN title — 26 групп | ~55 URL .club | Факт (metadata) |
| Повтор description | 0 | Факт |
| Пустой H1 | 0 | Факт |
| Демо vs сценарий: оба индексируемы, один интент («сайт пекарни») | 28 пар × 2 языка | Факт (оба index), каннибализация — гипотеза до GSC |
| Item vs категория: «hero section» может отдать то item, то категорию | шаблон | Гипотеза, проверить по query-page в GSC |
| Объединённые категории → 301 (`MERGED_CATEGORIES` в [next.config.ts:193-201](../../../next.config.ts#L193-L201)) | | Факт, ок |
| .ru/.club — разные языки, взаимный hreflang | | Факт, ок |
| Шаблонные description категорий («N готовых вариантов на React…») | 60 × 2 | Факт; уникальность только за счёт названия и числа |

## 3. International SEO

Архитектура (Факт): `vibeui.ru` — RU в корне; `vibeui.club` — EN без префикса (internal rewrite на `app/en/*`, [next.config.ts:158-176](../../../next.config.ts#L158-L176)); `/en` публично 404. `<html lang>` серверно верный: .ru → `ru` (2141/2141), .club → `en` (306/306).

Hreflang: 2415/2447 страниц — 3 ссылки (ru, en, x-default=en), self-referencing, взаимные; в sitemap — те же пары. Canonical самоссылочный у всех, кроме демо.

| Класс ошибки hreflang | Пример | Масштаб | Статус |
|---|---|---|---|
| Нет hreflang и canonical в HTML, при этом пара есть в sitemap | https://vibeui.ru/scenarios/bakery/demo, https://vibeui.club/scenarios/bakery/demo | 28 демо RU + переведённые EN | Факт |
| x-default = английский для всего, включая RU-аудиторию без пары | https://vibeui.ru/blocks/hero-001 → x-default https://vibeui.club/... | весь сайт | Факт; допустимо, решение продуктовое |
| Пара на страницу, где перевод контента неполный (RU-only демо) | демо без `sourceEn` | по коду sitemap исключает EN-пару для таких, но в текущем sitemap все 28 с парой — значит все переведены | Факт: ошибки нет |
| Пары, ведущие на 404 | — | не найдено в выборке .club (306/306 = 200) | Факт |
| Кириллица на .club | hero-001 .club — кириллицы в видимом тексте нет | выборочно | Факт; но `/r/<item>.json` на .club отдаёт RU title/description |
| Неполный обход .club | проверено 306 из 2141 | — | ограничение |

Региональные сигналы: `.club` — gTLD, без геопривязки, ок для EN. `.ru` — ccTLD → Google считает его таргетированным на Россию; русскоязычные вне РФ получат .ru — приемлемо.

## 4. Rendering / JavaScript SEO

- SSR: H1, описание, «Что можно поменять», техзаметки, ссылки — в исходном HTML (Факт).
- Превью item — `<iframe src="/preview/block/hero/hero-001?theme=dark&lang=ru" class="invisible">` (Факт): содержимое iframe закрыто robots и noindex, а до JS iframe невидим. Для поисковика главный «товар» страницы — визуал компонента — отсутствует. Ни `<img>` скриншота, ни `og:image` у item/категории нет (Факт: `og:image` только у главной).
- Код компонента в HTML отсутствует (выдаётся подписанной ссылкой на 30 мин) — Факт.
- Категории рендерят живые компоненты всех вариантов, без пагинации: HTML до **730 КБ** (`/components/card`), 617 КБ (`/components/button`), p90 всего сайта 214 КБ (Факт). Гипотеза: тяжёлая гидрация → высокий TBT/INP на мобильных.
- JS на item: 16 чанков, 263 КБ gzip (Факт, transfer size).
- Сжатие gzip есть, brotli нет (Факт, `Content-Encoding: gzip` при `Accept-Encoding: br,gzip`).

## 5. Structured data
Подробно — CONTENT-AND-SEMANTICS §6. Кратко (Факт): WebSite+SearchAction+Organization на всех страницах, BreadcrumbList на категории/item, SoftwareSourceCode на item. Ошибок синтаксиса в выборке нет (проверено чтением; Rich Results Test не запускался). Organization без `sameAs`. Демо наследуют WebSite VibeUI.

## 6. Производительность
Lab-замеры (Lighthouse/PSI) **не получены**: PSI API → 429 без ключа; локальный Lighthouse не запускался из-за ограничения машины. Field (CrUX) — нет данных. Ниже только серверные метрики из обхода; LCP/INP/CLS не утверждаются. План замеров — METRICS-BASELINE.csv.

| Шаблон | n | Средний HTML | Средний TTFB (s) | Источник |
|---|---|---|---|---|
| item | 2306 | 159 КБ | 0.41 | curl, 2026-10-16, из РФ |
| категория/корень | 76 | 226 КБ | 0.72 | то же |
| сценарий | 33 | 102 КБ | 0.47 | то же |
| демо | 32 | 292 КБ | 0.57 | то же |

Шрифты, сторонние скрипты: Метрика (webvisor) + GA4 грузятся `afterInteractive` (Факт). Webvisor — заметная нагрузка на main thread (гипотеза, проверить Lighthouse).
