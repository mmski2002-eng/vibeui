# Item-страницы: аудит, конкуренты, 6 примеров (2026-10-17)

База — `origin/main` `2104d7cc`. В рабочей копии `C:\VIBEUI` файлы шаблона item'а (`components/pages/item-page.tsx`), `lib/seo.ts` и `registry/**` совпадают с `origin/main`; незавершённые правки оплаты и аналитики шаблон item'а не затрагивают.

## 1. Как устроена страница сейчас

Шаблон один на три вида: [components/pages/item-page.tsx](../../../components/pages/item-page.tsx), маршруты `app/{blocks,components,animations}/[slug]` и их `/en`-обёртки. Metadata — `catalogSlugMetadata` в [lib/seo.ts](../../../lib/seo.ts).

| Элемент | Что в HTML | Источник |
|---|---|---|
| `<title>` | `<title item'а> — VibeUI`, без типа и технологии | `item.title` |
| meta description | `item.description` целиком (597 из 2048 длиннее 160 символов) | metadata |
| H1, описание | есть | `title`, `description` |
| «Что можно поменять» | первые 3 пункта `ai.adapt` | metadata |
| Анатомия | только у 34 блоков со `slots` | `meta.slots` |
| «Собран из» | ссылки на компоненты-части | `registryDependencies` |
| Превью | `iframe` `/preview/...` (живой рендер того же файла) | — |
| Контролы | подписи контролов как элементы UI | `meta.controls` |
| «Технические заметки» | `docs` в `<details>`: устройство, зависимости, доступность | `docs` |
| Теги | английские теги | `meta.tags` |
| Исходник | по клику, подписанная ссылка; для Pro закрыт | API |
| JSON-LD | `SoftwareSourceCode` (name, description, url, language, keywords) + `BreadcrumbList` | шаблон |
| hreflang | ru ↔ en(.club), x-default → .club | `pageMetadata` |
| og:image | **нет**; при этом `twitter:card=summary_large_image` | — |
| Сайдбар | ссылки на все items категории (у `button-015` — 109 ссылок) | `CatalogItemNav` |

Замер production 17.10 (curl, текст `<main>` без скриптов): `button-015` — 241 слово, `hero-001` — 336, `pricing-020` — 443, `button-anim-002` — 350. Около половины этих слов — служебная обвязка (шаги Copy for AI, подписи контролов).

### Что уже есть в metadata, но не выводится текстом

| Поле | Заполнено | На странице |
|---|---|---|
| `ai.usage` — пример вызова с пропсами | блоки 594/598, компоненты 1346/1346, анимации 104/104 | нет (лежит только в RSC-payload страницы, в т.ч. у Pro) |
| `ai.summary` | 100 % | нет |
| `ai.adapt` целиком | 100 % | только 3 пункта |
| `meta.controls` (name, label, default) | 100 % | только подписи в интерфейсе, без пропсов |
| обратная связь «используется в блоках» | 174 компонента | нет |
| сценарии, где стоит item | 309 items в 28 сценариях | нет |
| `i18n.en` всех полей | 100 % | EN-страница использует |

### Проблемы, подтверждённые данными
1. **Название не говорит, что это и для чего.** `Кнопка копирования — VibeUI`. В выдаче по конкретному паттерну (D01, D02) у конкурентов в title тип и стек: «React Avatar Stack Component · UI Beats», «Avatar Stack — React Profile Component | Spectrum UI», «Dock — React Component | React Bits».
2. **Дубли заголовков.** RU: 49 групп, 104 items с одинаковым `title` (например `button-015` и `button-074` — оба «Кнопка копирования»; `avatar-003` и `iconstack-001` — «Стопка аватаров»). EN: 26 групп, 54 item. Одинаковые `<title>` и H1 у разных URL.
3. **Нет примера использования.** На всех сравниваемых страницах конкурентов есть Usage/Installation/Props; у VibeUI данные есть (`ai.usage`, `controls`), но на странице не показаны.
4. **Нет связей вне категории**: компонент не знает, в каких блоках стоит, блок — в каких сценариях.
5. **Битая соцкарточка**: `summary_large_image` без изображения.

Не считаю проблемой: iframe-превью (так же у конкурентов с живыми демо), отсутствие исходника в HTML (модель доступа не меняется), английские теги.

## 2. Сравнение с конкурентами

Снято 17.10 (fetch HTML, без JS). Выбраны страницы из топа Google (gl=us) по тем же интентам.

| Страница | Интент | Install | Usage | Props/API | Доступность | Related | FAQ | og:image | JSON-LD |
|---|---|---|---|---|---|---|---|---|---|
| magicui.design/docs/components/dock | dock | да | да | да | да | — | — | да | TechArticle, Breadcrumb |
| reactbits.dev/components/dock | dock | да | — | — | — | да | — | да | WebSite |
| uibeats.com/docs/component/avatar-stack | avatar stack | да | — | да | — | — | — | да | SoftwareSourceCode, SoftwareApplication |
| ui.spectrumhq.in/docs/avatar-stack | avatar stack | да | да | да | да | да | да | да | SoftwareSourceCode, FAQPage, Breadcrumb |
| material-tailwind.com/docs/react/mega-menu | mega menu | — | да | да | да | да | — | — | — |
| flowbite.com/docs/components/mega-menu | mega menu | — | да (варианты) | — | да | — | да | да | — |
| shadcnblocks.com/blocks/pricing | pricing (категория) | да | да | — | — | — | да | да | FAQPage |
| shadcn.io/pricing-block | pricing (категория) | да | — | — | — | — | да | да | CollectionPage, ItemList, FAQPage |
| **vibeui item** | — | ссылка для агента | **нет** | **нет** (только UI-контролы) | в `<details>` | только части и сайдбар | — | **нет** | SoftwareSourceCode, Breadcrumb |

Чего не хватает VibeUI по сравнению с ними — только то, что полезно человеку и уже есть в данных:
- **Usage**: одна строка вызова с пропсами (есть в `ai.usage`).
- **Props**: таблица «проп → что меняет → по умолчанию» (есть в `meta.controls`).
- **Related**: «где используется» и «в каких сценариях» (выводится из `registryDependencies` и `registry/scenarios.ts`).
- **Тип в title**: «React-компонент / блок / анимация».

FAQ и длинные разделы «Overview/Use cases/Features» у Spectrum UI — текст ради объёма, не переносим.

## 3. Минимальное улучшение шаблона

| # | Изменение | Источник данных | Трудоёмкость | Риск |
|---|---|---|---|---|
| T1 | `<title>`: `<title> — <тип> React · VibeUI`; тип из вида и категории (`React-компонент`, `React-блок`, `анимация React`). H1 не трогаем | `kind`, `getCategoryLabel` | 0,5 дня | низкий: меняется сниппет всех 4096 URL, CTR на малых показах не измерить |
| T2 | Раздел «Как использовать»: `ai.usage` как `<pre><code>` + фраза, что агент ставит его из реестра | `meta.ai.usage` (+ `i18n.en.ai.usage`) | 0,5 дня | низкий: данные уже публичны в RSC-payload; 4 блока без usage — раздел не выводится |
| T3 | Раздел «Настройки»: список `controls` — подпись, проп, значение по умолчанию | `meta.controls` | 1 день (форматирование типов контролов) | средний: у контролов разные типы, нужен единый вывод без сырых JSON |
| T4 | «Используется в блоках» у компонентов: до 6 ссылок + «и ещё N» | обратный `registryDependencies` | 0,5 дня | низкий; `button-016` стоит в 157 блоках — без лимита будет простыня |
| T5 | «В сценариях» у items: ссылки на сценарии | `registry/scenarios.ts` (`item:`) | 0,5 дня | низкий |
| T6 | `twitter:card` → `summary`, пока нет картинок | шаблон метаданных | 10 мин | нет |
| T7 | Развести дубли заголовков: 49 групп RU / 26 EN | **ручная редактура** metadata | 1–2 дня | низкий, но затрагивает метаданные каталога (отдельный коммит, `meta:validate`) |

`ai.summary`, `preserve`, `notes` на страницу не выносим: это инструкция агенту, дублирует описание и заметки.

## 4. Шесть примеров итогового содержания

Обозначения источника: **[M]** metadata как есть, **[C]** вычисляется кодом, **[R]** ручная редактура.

### 4.1 `hero-001` — блок, бесплатный, составной (RU)
- title: «Первый экран с сиянием — React-блок hero · VibeUI» [C]
- Как использовать: `<Hero001 />` — usage у блока пустой → раздел не выводится [M]. Это единственный тип пробела в metadata (4 блока).
- Настройки: Тема (`tone`, auto) · Акцент (`accent`) · Текст на кнопке · Подложка (`background`) [M]
- Собран из: button-016, heading-001 (уже есть) [M]
- В сценариях: нет [C]

### 4.2 `pricing-020` — блок, Pro (RU)
- title: «Тарифы курса с рассрочкой, рамкой и полоской мест — React-блок тарифов · VibeUI» [C]; заголовок длинный — допустимо, Google обрежет хвост бренда
- Как использовать: `<Pricing020 … />` из `ai.usage` [M]; код по-прежнему закрыт
- Настройки: из `controls` [M]
- Собран из: button-013, button-016 [M]
- В сценариях: «Онлайн-курс» (`/scenarios/course`) [C]

### 4.3 `navbar-004` — блок, бесплатный (RU)
- title: «Продуктовая шапка с мега-меню — React-блок навигации · VibeUI» [C] — покрывает D05 («mega menu») на EN: «Product Navbar with Mega Menu — React block · VibeUI»
- Как использовать: `<Navbar004 brand="Платформа" groups={[…]} links={[…]} />` [M]
- Настройки: Тема, Название, Кнопка, Акцент [M]
- Собран из: button-016 [M]

### 4.4 `button-015` — компонент, бесплатный, дубль заголовка (RU)
- title сейчас совпадает с `button-074`. Предложение: «Кнопка копирования с подписью» (button-015) и «Кнопка копирования с морфом иконки» (button-074) [R]
- Как использовать: `<Button015 value="npm i vibeui" label="Скопировать" />` [M]
- Настройки: Подпись (`label`), После копирования (`doneLabel`), Держать, мс (`hold`), Фон [M]
- Используется в блоках: contact-033, cta-021, cta-022, cta-023, cta-024, cta-035 и ещё 3 [C]

### 4.5 `avatar-003` — компонент, бесплатный (EN, .club)
- title: «Avatar Stack — React Component · VibeUI» [C] — совпадает с формулировкой выдачи D02. Дубль с `iconstack-001` («Стопка аватаров») — переименовать `iconstack-001` [R]
- Usage: `<Avatar003 names={["Anna", "Mark"]} visible={4} tooltip />` [M, en]
- Settings: Visible, Size, Group label, Name tooltips [M]
- Used in blocks: cta-012 [C]

### 4.6 `button-anim-002` — анимация, Pro (RU)
- title: «Док с увеличением — анимация React в стиле macOS · VibeUI» [C + R: слово «macOS» из описания]
- Как использовать: `<ButtonAnim002 activeIds={["signal"]} onSelect={…} />` [M]
- Настройки: Слот команд, Акцент, Цвет текста [M]
- Связей нет: не часть блоков и сценариев. Похожих по тегам в категории нет — честно пусто.

## 5. Изображения

Сейчас: скриншотов items нет (в репозитории 868 изображений, 688 из них — `public/demo`, контент внутри блоков). Карточки каталога и превью — живые iframe.

Решение — отдельно и позже (см. IMPLEMENTATION-PLAN, «требует данных»):
- og:image только для items с показами в GSC (≈250 на .club, ≈420 на .ru — пересекаются), не для 2048.
- Генерация: Playwright-скриншот `/preview/...` 1200×630 в CI. Порядок стоимости: ~1–2 с на кадр → 250 кадров ≈ 5–10 мин CI; WebP ~30–60 КБ → ~15 МБ.
- Обновление: по `lastmod` item'а (уже есть `registry/generated/lastmod.json`).
- Не делать на локальной машине (слабая) и не генерировать все 4096 URL.

## 6. Проверка
- view-source 6 примеров на обоих доменах: новый title, разделы «Как использовать/Настройки/Используется в», ссылки 200.
- `npm run meta:validate` зелёный (для T7).
- Rich Results Test на 2 URL: JSON-LD без ошибок.
- Глазами: mobile/desktop на `hero-001` и `button-015`.
- Смоук `deploy.yml`: ассерты по item-странице (рендер по slug) остаются верными.
