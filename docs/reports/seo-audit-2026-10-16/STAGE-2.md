# Этап 2 — редиректы, диагностика индексации, пилот посадочных (2026-10-16)

**Опубликовано:** коммит `5807c919` в `main`, CI/CD `deploy` run 38937268932 — **success**, завершён 2026-10-16 17:16:38 UTC (20:16 МСК), включая смоук обоих доменов. Production проверен — §9.

## 1. Что изменено и почему

| Что | Почему |
|---|---|
| [proxy.ts](../../../proxy.ts): редирект `/en/*` ограничен публичными разделами `components`, `blocks`, `animations`, `scenarios`, `pricing`, `start` и корнем `/en` | В выгрузке 404 из GSC (374 URL) нет ни одного служебного адреса. Кабинет, вход, регистрация, сброс, поиск, report и verify не входят в редирект и, как раньше, отдают 404 |
| [proxy.ts](../../../proxy.ts): `EN_GONE` — 9 адресов отдают **прямой 404** вместо 301 на несуществующую страницу | У этих 9 нет содержательно равноценной замены (разбор ниже) |
| [.github/workflows/deploy.yml](../../../.github/workflows/deploy.yml): смоук `/en/start?utm_source=ci` на обоих доменах проверяет **статус 301 и Location** `https://vibeui.club/start?utm_source=ci` | Раньше проверялся только Location; теперь заодно проверяется сохранение query |
| [lib/landing-copy.ts](../../../lib/landing-copy.ts) — новый модуль: title, description, H1 и вводный абзац для 5 категорий и 3 сценариев, RU и EN | Пилот поисковых посадочных |
| [lib/seo.ts](../../../lib/seo.ts) `catalogSlugMetadata` | Для пилотных категорий берёт title/description из модуля; остальные категории — прежний шаблон |
| [components/pages/category-page.tsx](../../../components/pages/category-page.tsx) | H1 из модуля и вводный абзац под счётчиком, только у пилотных категорий; хлебные крошки и сетка не тронуты |
| [components/pages/scenario-page.tsx](../../../components/pages/scenario-page.tsx), [app/scenarios/[slug]/page.tsx](../../../app/scenarios/[slug]/page.tsx), [app/en/scenarios/[slug]/page.tsx](../../../app/en/scenarios/[slug]/page.tsx) | То же для 3 сценариев. Демо, Copy for AI и список блоков не тронуты |

Каталог, превью, Copy for AI, robots, canonical, noindex, кеширование и рендер не менялись. Сравнение с прежним кодом сделано на production: у `/blocks/footer` локально прежние title и description.

## 2. Редиректы `/en/*`

Реализация первого этапа перепроверена. Proxy скомпилирован и прогнан на всех 374 адресах из выгрузки «Не найдено (404)» GSC (2026-10-16).

| Проверка | Результат |
|---|---|
| Статус | 365 × **301**, 9 × **404** (`EN_GONE`) |
| Соответствие | Цель — тот же путь на vibeui.club без `/en`. Все 359 уникальных целей 301 на production .club отвечают **200** (проверка curl, 2026-10-16) |
| Лишние переходы | Цели 200 — второго прыжка нет. Слитые категории разрешаются сразу: `/en/components/navigation-menu` → `/components/navigation`, `/en/blocks/bakery` → `/blocks/industry`, `/en/components/cascader` → `/components/combobox`, `/en/animations/text` → `/animations/promo` |
| Петли | Нет: цель никогда не начинается с `/en` |
| Query | Сохраняется: `/en/blocks/bakery?x=1` → `/blocks/industry?x=1`, `/en/start?utm_source=ci` → `/start?utm_source=ci` |
| `?ref=` | Как и раньше, обрабатывается до этого блока: 307 на `/i/<код>` |
| Служебные | `/en/account`, `/en/search`, `/en/legal/offer` → 404 |
| Локально (`next dev`, curl) | `/en/start?utm_source=ci` → 301 Location `https://vibeui.club/start?utm_source=ci`; `/en/components/navigation-menu` → 301 `.../components/navigation`; `/en/blocks/ai-005` → 404; `/en` → 301 `https://vibeui.club/`; при `Host: vibeui.club` `/en/blocks/hero` → 301 `https://vibeui.club/blocks/hero` |

### Разбор 9 целей с 404

| Старый адрес | Что было | Судьба (git) | Замена | Решение |
|---|---|---|---|---|
| `/en/blocks/ai-005` | «Ответ с источниками» | удалён в `509d5245` вместе с группой ai | равноценной нет | 404 |
| `/en/blocks/auth-016` | «Выбор рабочего пространства» | удалён в `7f256174` (auth-011…033) | среди auth нет выбора пространства | 404 |
| `/en/blocks/dashboard-031` | «Прогресс по целям» | удалён в `509d5245` вместе с группой dashboard | нет | 404 |
| `/en/blocks/dashboard-047` | «Очереди задач» | там же | нет | 404 |
| `/en/blocks/features-001` | «Возможности с акцентом» | удалён в `7f256174` вместе с blocks/features | bento-блоки возможностей — другой формат | 404 |
| `/en/components/avatar-033` | «Кружок с инициалами для стопки лиц» | влит в блок в `d2a1dfd4` | avatar-001/002 — аватар с фото и запасными инициалами, это другой компонент | 404 |
| `/en/components/textarea` | категория из 9 полей | удалена в `509d5245` | в `input` один `input-034` (поле с плавающей подписью), это не замена категории | 404 |
| `/en/components/textarea-001` | «Растущее поле» | удалён там же | input-034 не растёт под текст | 404 |
| `/en/scenarios/service-landing` | сценарий | раздел сценариев пересобран (`6f50892f`), слага нет | нет | 404 |

Попутно: в `registry/categories.ts` осталась запись категории `textarea`, но items в ней нет. Это посторонний код, не трогал.

## 3. Диагностика индексации (read-only, 2026-10-16)

### Яндекс.Вебмастер
| Что | Результат | Статус |
|---|---|---|
| «Исключённые страницы» | Вкладка «временно недоступна» — третья попытка за день | Не получено |
| Зеркала («Переезд сайта», только чтение) | Главное зеркало — `https://vibeui.ru`, переезда нет | Факт |
| Свежесть данных | Сводка: «Обновления поиска до 7 октября», «данные временно не обновляются» | Факт: данные кабинета заморожены на 07.10 |
| В поиске (кабинет) | 4 страницы: `/`, `/blocks/hero-001`, `/blocks/hero-008`, `/blocks/hero-014`; `/en` исключена как «малоценная или маловостребованная» (26.09) | Факт на 07.10 |
| Запросы (Сводка) | «сайт с дизайнами для вайбкодинга» 1/1, «готовые дизайны для вайбкодинга» 1/0, «библиотека стилей для вайбкодинга» 1/0 | Факт |
| `site:` в выдаче (Москва) | `.ru` — 3 результата, `.club` — 40 | Наблюдение, не размер индекса |

**Причина исключения в Яндексе не установлена.** Склейка с `.club` маловероятна: главное зеркало `.ru` своё. Остальное — гипотезы.

### Google Search Console (инспекция URL)
| URL | Тип | Статус | Последнее сканирование | Индексация разрешена | Canonical: объявлен / выбран Google | Обнаружен |
|---|---|---|---|---|---|---|
| `/components/slider` | категория | Просканирована, не проиндексирована | 05.10, смартфон | Да | свой / не выбран | sitemap («временная ошибка при обработке»), `/en/components/slider`, `/components/native-select`, `/` |
| `/components/command-009` | item | Просканирована, не проиндексирована | 14.10, смартфон | Да | свой / не выбран | sitemap, `vibeui.club/...`, `/en/...` |
| `/blocks/pricing-013` | item | Просканирована, не проиндексирована | 13.10, смартфон | Да | свой / не выбран | ссылки `/en/blocks/pricing-013`, `.club`, `/blocks/pricing-001`; «нет ссылающихся файлов Sitemap» |
| `/animations/background` | категория | Инспекция: «URL неизвестен Google»; в отчёте покрытия — «Обнаружена, не проиндексирована». Ранее кто-то запрашивал индексирование | нет | — | — | — |
| `/blocks/pricing-001` | item | **Проиндексирована** | 01.10, смартфон | Да | свой | `/en/blocks/pricing-001`, `/` |

**Live-проверка `/components/slider` («Проверить страницу на сайте», 16.10 19:11):**
- «URL доступен Google», «эту страницу можно проиндексировать».
- Хлебные крошки без ошибок, HTTP 200, ошибок JavaScript в консоли нет.
- Не загрузились 2 ресурса из 50: `/api/auth/get-session` и `/api/favorites`, оба закрыты robots. Это персональные XHR, на контент не влияют.
- На скриншоте Google — полностью отрисованная страница: H1 «Слайдеры», «20 компонентов», карточки с ползунками.

**Сравнение проиндексированного и нет.** У `pricing-001` (в индексе) и `pricing-013` (нет) нет технической разницы: 200, смартфон-бот, свой canonical, сходный объём HTML (157 и 155 КБ) и текста (668 и 722 слова), описание (305 и 259 байт). Причину отбора по этим данным **установить нельзя**. «Низкое качество» как причина **не подтверждено**.

**Состав индекса `.ru` (отчёт «Проиндексированные», 913):**
- ~717 URL — `/en/*`: items en/components 454, en/blocks 115, en/animations 67, категории и сценарии.
- Русских — ~196: components items 100, blocks items 52, animations items 24, категории и сценарии около 20.
- Бывшие `/en/*` сейчас отдают 404 в production, поэтому эта часть индекса будет выпадать. Редирект — главное, что может сохранить их сигналы для `.club`.

### Отмечено
- Отчёты GSC расходятся: покрытие относит URL к «Обнаружена», а инспекция говорит «неизвестен». Отчёт покрытия обновляется с задержкой.
- Sitemap у части URL — «Временная ошибка при обработке», у `pricing-013` — «нет ссылающихся файлов Sitemap», хотя адрес в sitemap есть (проверено обходом аудита). Причина не выяснена.

## 4. Пилот посадочных

**Отбор.** Спрос по данным GSC почти нулевой: у категорий 1–4 показа за период, кликов 0 — `/components/slider` 3, `/components/button` 2, `/components/accordion` 2, `/scenarios/restaurant` 1. У `/en/components/accordion` был 1 клик. Wordstat и Keyword Planner недоступны. **Выбор сделан по понятности поискового интента и ценности для продукта, а не по измеренному спросу.**

Числа в title не добавлялись. Счётчик компонентов на странице остался прежним.

| URL | Интент | Было: title / description | Стало RU (`vibeui.ru`) | Стало EN (`vibeui.club`) |
|---|---|---|---|---|
| `/blocks/hero` | hero section / первый экран лендинга | «Первый экран — VibeUI» / «Первый экран — 49 готовых вариантов на React и Tailwind CSS. Живое превью, установка одной командой…» | T: «Первый экран сайта (hero): готовые блоки на React и Tailwind — VibeUI»; H1: «Первый экран сайта»; D: варианты с картинкой, снимком продукта, видео, подпиской, логотипами, отсчётом | T: «Hero section blocks for React and Tailwind — VibeUI»; H1: «Hero sections» |
| `/blocks/pricing` | pricing table / блок тарифов | «Тарифы и сравнение — VibeUI» / шаблон с «37 готовых вариантов» | T: «Блоки тарифов и сравнения цен на React и Tailwind»; H1 прежний «Тарифы и сравнение»; D: три плана, месяц/год, таблица сравнения, цена за место, калькуляторы, «мы против них» | T: «Pricing table and comparison blocks for React and Tailwind»; H1: «Pricing and comparison sections» |
| `/components/button` | react button component | «Кнопки — VibeUI» / «Кнопки — 124 готовых вариантов…» (ошибка согласования) | T: «Кнопки на React и Tailwind: готовые компоненты»; H1 «Кнопки» | T: «Button components for React and Tailwind»; H1 «Buttons» |
| `/components/slider` | range slider | «Слайдеры — VibeUI» / шаблон | T: «Ползунки и диапазоны (range slider) на React и Tailwind»; **H1: «Ползунки и диапазоны»** — в разделе ползунки, а не карусели, во вводном тексте ссылка на раздел «Карусели» | T: «Range slider components for React and Tailwind»; H1 «Sliders and range inputs» |
| `/components/accordion` | accordion / раскрывающийся список | «Аккордеон — VibeUI» / шаблон | T: «Аккордеон на React и Tailwind: раскрывающиеся списки»; H1 «Аккордеоны» | T: «Accordion components for React and Tailwind»; H1 «Accordions» |
| `/scenarios/restaurant` | сайт ресторана | «Ресторан — VibeUI» / описание-перечень демо | T: «Сайт ресторана: готовая страница из блоков для ИИ-агента»; H1 «Сайт ресторана» | T: «Restaurant website built from ready-made blocks»; H1 «Restaurant website» |
| `/scenarios/photographer` | сайт фотографа, портфолио | «Портфолио фотографа — VibeUI» | T: «Сайт фотографа-портфолио: готовая страница из блоков»; H1 «Сайт-портфолио фотографа» | T: «Photographer portfolio website built from ready-made blocks» |
| `/scenarios/saas` | лендинг SaaS / AI-сервиса | «AI-инструмент / SaaS — VibeUI» / описание на 600+ символов | T: «Лендинг AI-сервиса или SaaS: готовая страница из блоков»; H1 «Лендинг AI-сервиса и SaaS»; D сокращено | T: «AI tool and SaaS landing page built from ready-made blocks» |

Полные тексты лежат в [lib/landing-copy.ts](../../../lib/landing-copy.ts).

**Как сверялись тексты с ассортиментом:**
- Перечисления в каждом тексте взяты из названий items категории.
- 20 из 20 ползунков — `type=range` или обработка клавиатуры; 32 из 32 аккордеонов — на `details`, `button` или `aria-expanded`.
- Ярлык «Карусели» сверен с `registry/categories.ts`.
- Обещания, которые проверить нельзя, сняты: «состояния у каждой из 124 кнопок», «цены пропсами у всех тарифов».
- Фраза про Pro на сценариях убрана: она дублировала абзац, который уже есть на странице.

## 5. Выполненные проверки

| Проверка | Результат |
|---|---|
| Синтаксис изменённых файлов (`typescript.transpileModule`) | 0 ошибок |
| `prettier --check` по файлам этапа | Чисто для `lib/landing-copy.ts`, `lib/seo.ts`, `category-page.tsx`, `scenario-page.tsx`, `deploy.yml`. `proxy.ts` и оба `app/**/scenarios/[slug]/page.tsx` не проходили prettier ещё в HEAD — их формат не менял |
| Прогон proxy на 374 URL GSC + граничные случаи | См. §2 |
| `next dev`: статус и Location редиректов | См. §2 |
| `next dev`, серверный HTML 16 страниц (8 × RU/EN через `Host`) | Все 200; title, description, H1 и вводный текст есть **в исходном HTML**; canonical свой; hreflang ru/en/x-default взаимные; `lang` ru/en верный. Непилотная `/blocks/footer` — прежние metadata |
| Глазами (Chrome, localhost, десктоп) | `/components/slider`, `/scenarios/restaurant`, `/blocks/pricing`: текст под H1, вёрстка не съехала, превью и кнопки на месте |
| Мобильная ширина | **Не проверена**: окно браузера не уменьшилось |
| `npm run lint` / `npm run typecheck` | **Не запускались**: CLAUDE.md проекта прямо запрещает их до команды владельца. Типы проверит CI |
| `meta:validate` | Не запускался: registry не менялся |

Браузер закрыт, dev-сервер остановлен.

## 6. Оставшиеся неизвестные
- Почему Яндекс держит в поиске 4 страницы `.ru` — отчёт «Исключённые» недоступен, данные кабинета заморожены на 07.10.
- Почему Google не индексирует технически исправные RU-страницы, в том числе категории.
- Почему sitemap у части URL — «временная ошибка при обработке» или «нет ссылающихся файлов».
- Дубль page_view в GA4 (из этапа 1) не проверен.
- Реальный спрос по выбранным интентам — нет Wordstat и Keyword Planner.

## 7. Файлы этого этапа
- `proxy.ts` — `EN_REDIRECT_SECTIONS`, `EN_GONE`, сужение редиректа
- `.github/workflows/deploy.yml` — смоук: статус + Location + query
- `lib/landing-copy.ts` — новый
- `lib/seo.ts` — подключение текстов категорий
- `components/pages/category-page.tsx`
- `components/pages/scenario-page.tsx`
- `app/scenarios/[slug]/page.tsx`
- `app/en/scenarios/[slug]/page.tsx`
- `docs/reports/seo-audit-2026-10-16/STAGE-2.md`

Не относятся к этому этапу и не готовы к релизу в его рамках: изменения оплаты и аналитики из этапа 1 — `lib/track.ts`, `lib/checkout-handoff.ts`, `app/checkout/`, `components/checkout-go.tsx`, `lib/payment-actions.ts`, `components/analytics.tsx`, `components/catalog/copy-for-ai.tsx`, `components/catalog/scenario-copy.tsx`, `components/auth/flip-auth.tsx`. Они остаются в рабочей копии нетронутыми. `lib/club-routes.ts` и правки `next.config.ts` — инфраструктура редиректа этапа 1, нужны proxy.

## 8. После будущего деплоя
1. `curl -sI "https://vibeui.ru/en/start?utm_source=x"` → `301`, `Location: https://vibeui.club/start?utm_source=x`; то же для `https://vibeui.ru/en/components/navigation-menu` → `.../components/navigation`; `https://vibeui.ru/en/blocks/ai-005` → `404`.
2. Смоук `deploy.yml` зелёный.
3. view-source 8 пилотных страниц на обоих доменах: новые title, description, H1, вводный абзац; canonical и hreflang прежние.
4. GSC: «Проверка URL» → «Запросить индексирование» для 8 пилотных RU-страниц и нескольких бывших `/en/*` — по решению владельца, это действие в кабинете.
5. Через 2–4 недели: снижение «Не найдено (404)» в GSC `.ru`, появление `.club`-аналогов в индексе, показы и CTR пилотных страниц против непилотных категорий.
6. Когда Яндекс восстановит «Исключённые страницы» — снять причины по `.ru`.

## 9. Выпуск и проверка production (2026-10-16)

**Изоляция.** Пакет собран в отдельном worktree от `33ea2387` на ветке `seo/en-redirects-pilot`. В коммит вошли только файлы из §7, `lib/club-routes.ts`, `next.config.ts` и отчёты. Изменения оплаты, checkout, аналитики и регистрации остались в рабочей копии нетронутыми и в релиз не попали.

**Проверки до пуша** (на изолированном наборе):
- `eslint` по файлам пакета — 0 ошибок.
- `next typegen` + `tsc --noEmit` — 0 ошибок. Без typegen ошибка `LayoutProps` — это нормально для чистого checkout, CI делает то же.
- Мобильная эмуляция Playwright, `next dev`. Файлы пакета в основной копии побайтно совпадают с worktree; Turbopack не запускается на junction `node_modules`, поэтому визуальная проверка шла из основной копии:
  - 375 px: `/blocks/hero` (самый длинный заголовок и вводный текст), `/scenarios/photographer`;
  - 390 px: `/scenarios/saas`, `/components/slider`;
  - горизонтального переполнения нет, H1 и абзац переносятся.
- Консоль dev: duplicate key — ключ-градиент в контролах превью hero-блока, к пакету не относится. 500 на `/api/favorites` — локально нет БД.

**Production** (curl и Playwright, после деплоя):

| Проверка | Результат |
|---|---|
| Редиректы на обоих доменах | `/en/start?utm_source=x` → 301 `https://vibeui.club/start?utm_source=x`; `/en/components/navigation-menu` → 301 `/components/navigation`; `/en/blocks/bakery?x=1` → 301 `/blocks/industry?x=1`; `/en/components/cascader` → 301 `/components/combobox`; `/en/animations/text` → 301 `/animations/promo`; `/en/components/accordion` → 301; `/en` → 301 `https://vibeui.club/` |
| Цели без второго прыжка | 6/6 целей → 200 |
| Прямые 404 | `/en/blocks/ai-005`, `/en/components/textarea`, `/en/scenarios/service-landing`, `/en/account`, `/en/search`, `/en/legal/offer` → 404 на обоих доменах |
| 16 пилотных страниц | все 200; title, description, H1 и вводный текст в серверном HTML (16/16); canonical свой; hreflang ru/en/x-default взаимные; `lang` ru/en верный |
| robots.txt | md5 совпадает с состоянием до деплоя на обоих доменах |
| sitemap.xml | 200, 2173 `<loc>` на каждом домене. Рост с 2141 на момент аудита — новые items из чужих коммитов, пакет sitemap не менял |
| Мобильный вид | `vibeui.ru/blocks/hero` при 375 px, `vibeui.club/scenarios/saas` при 390 px — без переполнения, `lang=en` на .club |
| Превью и Copy for AI | `vibeui.ru/blocks/hero-001`: iframe `/preview/...` видим и отрисовал блок, кнопки «Копировать для ИИ» на месте. Сам механизм не менялся; копирование под аккаунтом не проверялось |

Консоль production: gtag `ERR_CONNECTION_CLOSED` из сети проверки и CSP-блок Cloudflare Insights на .club — существовали до релиза.

Браузер закрыт, dev-серверы остановлены.

## 10. Ограничения после выпуска
- Эффект в поиске не измерен: нужны 2–4 недели данных GSC.
- Переиндексация не запрашивалась, настройки кабинетов не менялись — по условию выпуска.
- Причины исключения в Яндексе не установлены — кабинет недоступен.
- Локальная ветка `main` основной копии отстаёт от `origin/main`: в ней те же SEO-файлы лежат как незакоммиченные правки рядом с правками оплаты. Перед `git pull` их нужно разделить — простой pull остановится на конфликте рабочей копии.
- Worktree `C:ibeui-seo` (ветка `seo/en-redirects-pilot`) можно удалить после проверки.

## 11. Что измеряем дальше
- GSC `.ru`: «Не найдено (404)» должно снижаться с 407; бывшие `/en/*` — уходить в «Страница с переадресацией».
- GSC `.club`: рост проиндексированных — аналоги бывших `/en/*`, база 1 750.
- 16 пилотных страниц: показы, CTR, позиция против непилотных категорий той же группы, окна 28 дней до и после 2026-10-16.
- Яндекс: «Страниц в поиске» `.ru` (база 4) и причины исключения, когда отчёт заработает.
