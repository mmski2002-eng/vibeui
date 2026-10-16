# Аналитика и измеримость — VibeUI, 2026-10-16

Статусы: **Факт** — проверено в коде/production; **Гипотеза** — не проверено данными; **Рекомендация**.

## 1. Что реально есть (код)

| Что | Где | Статус |
|---|---|---|
| Яндекс.Метрика `112394418`, webvisor, clickmap, trackLinks, accurateTrackBounce | [components/analytics.tsx:47](../../../components/analytics.tsx#L47) | Факт |
| GA4 `G-0JSZ10JSHW`, `send_page_view:true` | [components/analytics.tsx:74](../../../components/analytics.tsx#L74) | Факт |
| SPA-хиты: `ym hit` + `gtag event page_view` при смене pathname/query, первый хит пропускается | [components/analytics-route-hits.tsx:30-55](../../../components/analytics-route-hits.tsx#L30-L55) | Факт |
| Верификация GSC/Вебмастера мета-тегами | [app/layout.tsx:105-110](../../../app/layout.tsx#L105-L110) | Факт: права подтверждены — в GSC и Вебмастере есть данные по обоим доменам (2026-10-16) |
| **Событий продуктовой воронки** (`reachGoal`, `gtag('event', …)` кроме page_view) | grep по `app/`, `components/`, `lib/`; GA4 «Ключевые события» = 0 | **Факт в проде: ноль.** В рабочей копии добавлены `copy_for_ai`, `sign_up`, `begin_checkout` (STAGE-1), не задеплоено |

Вывод: сейчас измеряются только просмотры. Ни Copy for AI, ни копирование install, ни регистрация, ни checkout в GA4/Метрику не уходят. Связать органику с ключевыми действиями невозможно.

## 2. Риски корректности

| # | Риск | Статус | Деталь |
|---|---|---|---|
| A1 | Двойной page_view в GA4 | Не подтверждено и не опровергнуто (2026-10-16): в GA4 улучшенная статистика «Просмотры страниц» включена; в сети на один SPA-переход виден один запрос с `en=page_view` в URL, тело POST не проверено | `gtag config send_page_view:true` шлёт первый хит; RouteHits пропускает первый рендер. Но GA4 Enhanced Measurement «page changes based on browser history» по умолчанию включён и тоже ловит pushState → при SPA-переходе возможен дубль. Проверить: GA4 → Admin → Data streams → Enhanced measurement; DebugView при клиентском переходе. |
| A2 | Смена только query (`?theme=`, `?q=`) = новый хит | Факт (код) | RouteHits реагирует на `searchParams`. Переключение темы/фильтра, если пишется в URL, раздувает pageviews. Проверить, какие контролы item-страницы меняют URL. |
| A3 | Один GA4-поток/счётчик на оба домена | Факт (ID захардкожен) | `.ru` и `.club` пишут в один ресурс. Для GA4 это нормально при фильтре по hostname; в Метрике счётчик заведён на vibeui.ru — `.club`-визиты попадут как «чужой домен». Нужны сегменты по hostname и отдельный счётчик/доп. домен в Метрике. |
| A4 | Cross-domain `.ru ↔ .club` | Факт | Кросс-доменная настройка отсутствует; переключатель языка ведёт на другой домен → новая сессия с self-referral. Добавить оба домена в GA4 «Configure your domains» и referral exclusions. |
| A5 | Партнёрские `/?ref=` | Факт | proxy делает 307 → `/i/<код>` ([proxy.ts:23-26](../../../proxy.ts#L23-L26)). UTM, если пришли вместе с ref, теряются при редиректе на `/i/` (проверить, сохраняет ли `/i/` query при возврате). |
| A6 | Consent | Факт | Баннера согласия нет, webvisor пишет сессии. Для RU (152-ФЗ) и EU-аудитории .club — юридический вопрос, не SEO; указать в политике, рассмотреть consent mode для .club. |
| A7 | Внутренний трафик/боты | Не проверено | Фильтры IP разработчика и роботов в Метрике/GA4 — проверить в интерфейсе. |
| A8 | Webvisor + CSP | Факт | CSP разрешает `mc.yandex.ru`, но `frame-src`/`connect-src` не включают `mc.yandex.com`/`*.yandex.ru` для webvisor-плеера — проверить, что записи воспроизводятся. |

## 3. Предлагаемая схема событий

Одна обёртка `track(name, params)` → GA4 `gtag('event')` + Метрика `reachGoal(name, params)`. Имена snake_case, одинаковые в обеих системах.

| Событие | Параметры | Где возникает | Key event | Гипотеза, которую проверяет |
|---|---|---|---|---|
| `view_catalog` | kind | /blocks, /components, /animations | нет | доля органики, доходящей до каталога |
| `view_category` | kind, category, items_count | страница категории | нет | категории как посадочные |
| `view_item` | item, kind, category, is_pro | страница item | нет | item как посадочная, глубина |
| `preview_interact` | item, control (`device`/`theme`/`accent`/…), value | контролы превью | нет | превью вовлекает |
| `copy_for_ai` | item, kind, theme, logged_in, source (`item`/`card`/`scenario`) | кнопка «Копировать для ИИ» | **да** | главная конверсия продукта |
| `copy_install` | item, method (`npx`/`url`) | блок «Исходник компонента» | **да** | реальная установка разработчиком |
| `copy_code` | item | копирование кода | да | |
| `open_guide` | from | «Пошаговый гайд»/`/start` | нет | новички без агента |
| `search` | query, results_count, locale | /search, подсказки | нет | спрос внутри сайта |
| `search_zero` | query | results_count = 0 | нет | пробелы ассортимента/синонимов |
| `scenario_view` / `scenario_copy` | scenario | /scenarios/* | copy — да | сценарии как вход |
| `demo_view` | scenario | /scenarios/*/demo | нет | демо ведут в продукт? |
| `paywall_view` | item, reason (`limit`/`pro`) | лимит копирований, PRO | нет | где упирается бесплатный |
| `sign_up` | method, source_page | Better Auth success | **да** | |
| `login` | method | | нет | |
| `view_pricing` | source | /pricing | нет | |
| `begin_checkout` | plan, currency, provider | startCheckout/startCryptoCheckout | **да** | |
| `purchase` | transaction_id, value, currency, plan | серверно из вебхука (GA4 Measurement Protocol / Метрика offline conversions) | **да** | revenue из органики |
| `return_copy` | days_since_first | повторный copy_for_ai у user | нет | удержание |

`purchase` слать только серверно из вебхуков ЮKassa/NOWPayments (`app/api/payments/**`) — клиент может не вернуться на сайт.

## 4. Измеримая воронка

```
GSC/Вебмастер: показ → клик
GA4/Метрика (session source = organic):
  landing (view_item | view_category | scenario_view | home)
  → preview_interact
  → copy_for_ai | copy_install
  → sign_up
  → begin_checkout → purchase (сервер)
```

Связка: GSC ↔ GA4 (Search Console linking), Вебмастер ↔ Метрика. Ключ сегмента — landing page template (по префиксу пути + regex `-\d{3}$` для item).

## 5. Что сделать в кабинетах (владелец)

1. GA4: включить связь с Search Console; проверить Enhanced Measurement (A1); добавить оба домена в cross-domain; отметить key events из таблицы.
2. Метрика: добавить `vibeui.club` в «Дополнительные адреса» или завести второй счётчик; цели по reachGoal; фильтр своих визитов.
3. Вебмастер: подтвердить права (SEO.md на 08.09 писал «не подтверждены» — **текущий статус не проверен**), добавить sitemap, связать с Метрикой.
4. GSC: ресурс `https://vibeui.club/` уже есть (данные с 24.09); sitemap .club — проверить отправку.
