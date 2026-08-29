# PROJECT_CONTEXT

Актуальный bootstrap-документ для новых Claude Code и ChatGPT-сессий.
Читать первым, затем открывать подробные документы по ссылкам ниже.

Не копировать сюда секреты, токены, пароли, SSH-ключи или приватные значения из
`SECRETS.local.md`.

## Что строим

VibeUI — AI-native библиотека готовых UI-блоков для русскоязычного
вайбкодинга.

Главное обещание:

**Выбери дизайн -> отдай ИИ -> получи сайт.**

Это не просто React component library. Пользователь должен визуально выбрать
готовый блок, открыть live preview, нажать Copy for AI и передать агенту
инструкцию. Агент должен установить настоящий компонент из VibeUI registry, а
не пересоздавать похожий UI по описанию.

Ключевая ценность:

```
visual discovery -> installable component -> AI context -> predictable result
```

Успех MVP: результат после установки в чужой проект визуально совпадает с тем,
что пользователь видел в VibeUI preview.

## Production

- Production: https://vibeui.ru
- Registry base: https://vibeui.ru/r
- Пример registry item: https://vibeui.ru/r/hero-001.json
- Ожидаемая установка: `npx shadcn@latest add https://vibeui.ru/r/hero-001.json`
- GitHub: `mmski2002-eng/vibeui`
- Репозиторий приватный.

Деплой фактически self-hosted на VPS: Next standalone, nginx, systemd, HTTPS.
Подробности: [DEPLOY.md](DEPLOY.md).

Важно: `REGISTRY_BASE_URL` вшивается во время production build. Смена значения
без новой сборки не меняет уже собранный HTML.

## Роль ChatGPT в этом проекте

ChatGPT здесь не обязан быть основным coding agent. Основная роль:

- product architect;
- technical reviewer;
- roadmap owner;
- второй взгляд на планы и отчёты Claude;
- поиск unnecessary complexity;
- проверка соответствия принципам VibeUI;
- подготовка полных самодостаточных prompts для новых Claude Code-сессий.

Если пользователь просит "проверь", "посмотри", "почему" или приносит отчёт
Claude — сначала диагностировать и объяснять. Код, деплой, настройки и сервисы
не менять без отдельной явной команды.

## Текущий scope

Входит:

- каталог компонентов;
- live preview;
- страницы компонентов;
- Copy for AI;
- shadcn-compatible registry;
- несколько качественных демонстрационных блоков.

Не входит сейчас:

- auth;
- database;
- payments;
- subscriptions;
- referrals;
- affiliate dashboard;
- marketplace;
- MCP / Agent Skill;
- AI API;
- CMS;
- admin panel;
- search engine;
- ratings/comments;
- visual page builder;
- AI site generator.

До проверки спроса продукт должен оставаться маленьким.

## Текущий стек

Фактические версии проверять в `package.json`.

- Next.js 16 App Router;
- React 19;
- TypeScript strict;
- Tailwind CSS v4;
- shadcn-compatible registry;
- `@base-ui/react` primitives, не Radix;
- `lucide-react`;
- npm;
- Next standalone output;
- VPS + nginx + systemd + HTTPS.

Перед техническими рекомендациями, связанными с Next.js 16, читать актуальные
локальные docs в `node_modules/next/dist/docs/`. В этом проекте Next.js может
отличаться от привычных API и соглашений.

## Архитектурный принцип

Главное правило:

**У registry block ровно один исходник в `registry/blocks/<category>/<name>/`.**

Этот же файл используется для:

- preview;
- thumbnail в каталоге;
- страницы компонента;
- Copy Code;
- registry install;
- проверки в чистом проекте.

Нельзя создавать отдельные demo-копии, thumbnail-копии, screenshot-копии или
упрощённые версии компонента. Рассинхрон preview и устанавливаемого файла
ломает главное обещание VibeUI.

Metadata также должна жить в одном месте:

- `registry/blocks/<category>/registry.json`

Не создавать параллельные ручные массивы вроде `components-data.ts` с
дублированием title, tags, description или AI metadata.

## Правило фидельности блока

Блок обязан выглядеть одинаково в трёх контекстах: в миниатюре каталога,
в preview и после установки в чужой проект.

Отсюда жёсткое требование: **раскладка и типографика блока считаются от его
собственной ширины, а не от ширины окна.** Миниатюра каталога рендерит блок
в 1280px внутри узкой карточки — viewport-медиазапросы (`sm:`, `md:`, `6vw`)
в этой ситуации отдают мобильную вёрстку и врут про дизайн.

Как это сделано в hero-001 и как делать в новых блоках:

- `container-type: inline-size` объявляется в собственном `<style>` блока,
  не Tailwind-вариантом — блок не должен зависеть от версии Tailwind
  в проекте пользователя;
- правила раскладки — `@container (min-width: …)` там же, селектором
  `[data-vibeui-block="…"] [data-part="…"]`; специфичность `(0,2,0)` выше
  утилит, поэтому они переопределяются;
- размеры шрифта — `cqi`, не `vw`;
- корневой элемент не может быть своим собственным query-контейнером,
  поэтому отступы и `min-height` живут на внутреннем `[data-part="frame"]`.

## Registry pipeline

- корневой `registry.json` — то, что публикуется; в `include[]` только
  категории, которые должны быть доступны снаружи;
- `npm run registry:build` очищает `public/r/` перед сборкой: иначе
  удалённый из реестра item продолжает раздаваться со старой сборки;
- служебный item `_smoke` (`registry/blocks/_smoke/`) из production-реестра
  исключён и по HTTPS больше не публикуется. Файлы остались в репозитории,
  но ни один корневой реестр на них не ссылается. Отдельный dev-реестр
  завести не получилось: `shadcn` требует, чтобы корневой файл назывался
  ровно `registry.json`.

## Важные файлы

- [PRODUCT.md](PRODUCT.md) — продукт, аудитория, ключевой сценарий.
- [ARCHITECTURE.md](ARCHITECTURE.md) — устройство кода и registry.
- [DELIVERY.md](DELIVERY.md) — Product Delivery Model: как компонент попадает к пользователю.
- [ROADMAP.md](ROADMAP.md) — фазы и Definition of Done.
- [DEPLOY.md](DEPLOY.md) — production deployment.
- [../CLAUDE.md](../CLAUDE.md) — инструкции для AI-разработчика.
- [../registry/blocks/hero/registry.json](../registry/blocks/hero/registry.json) — metadata hero-блоков.
- [../registry/blocks/hero/hero-001/hero-001.tsx](../registry/blocks/hero/hero-001/hero-001.tsx) — первый эталонный блок.
- [../components/block-preview.tsx](../components/block-preview.tsx) — iframe preview.
- [../components/block-thumbnail.tsx](../components/block-thumbnail.tsx) — live thumbnail в каталоге.
- [../components/catalog/catalog-shell.tsx](../components/catalog/catalog-shell.tsx) — тёмная оболочка каталога.
- [../components/catalog/catalog-card.tsx](../components/catalog/catalog-card.tsx) — карточка с Copy for AI.
- [../app/globals.css](../app/globals.css) — тема, токены и масштабирование миниатюры.
- [../lib/copy-for-ai.ts](../lib/copy-for-ai.ts) — генерация AI prompt.
- [../registry.json](../registry.json) — корневой публикуемый реестр.

## Что уже сделано

Complete:

- Phase 0 — workspace, docs, lint/build/typecheck foundation.
- Phase 1 — Hero 001 / Aurora Hero.
- Phase 2 — component page, preview, install command, Copy for AI.
- Phase 3A — catalog + home.
- Phase 3A+ — self-hosted production на https://vibeui.ru.
- Phase 3A++ — foundation fixes перед Hero 002 (см. ниже), задеплоено
  коммитом `920bdbb`.
- Hero 002 / Console Hero — светлый split B2B SaaS с product mockup справа,
  задеплоен коммитом `4f3bbad`.
- Hero 003 / Mosaic Hero — тёплый светлый hero из пяти плиток фиксированных
  ролей, задеплоен коммитом `d15dc39`.
- Все три hero помечены `meta.featured: true` (`98116a5`): главная показывает
  ряд из трёх карточек вместо одинокой.
- Features 001 / Spotlight Features — вторая категория: тёмная графитовая
  секция с иерархией «одна главная возможность + три второстепенные»,
  задеплоена коммитом `710f684`.
- Pricing 001 / Inverted Pricing — третья категория: светлая секция тарифов,
  рекомендованный план выделен инвертированной тёмной панелью,
  задеплоена коммитом `2888673`.
- Public Product Shell v1 — продуктовая оболочка вокруг блоков: витрина на
  главной, секция «Собери страницу из блоков», фильтр категорий в каталоге,
  панель «Использовать с AI» на странице блока.
- Catalog Shell v1 — переход на catalog-first: тёмная app-оболочка, topbar,
  sidebar с категориями и counts, плотная сетка карточек, Copy for AI прямо
  на карточке. Лендинг на `/` заменён каталогом; `PageComposition`,
  `BlockCard`, `CatalogFilter` и `SiteHeader` удалены.
- Catalog Data Model v1 — каталог знает два типа items (`block`,
  `component`) плюс зарезервированный `template`; `kind` выводится из
  реестра, `group` — из категории, публикуемый `/r/*.json` не изменился.
  Карточка приведена к библиотечному виду: описание вместо тегов, действия
  Copy for AI / Registry URL / View code. Items типа `component` ещё нет —
  добавлена только модель и точки подключения.
- Product Delivery Prompt v1 — промпт по Product Delivery Model: восемь
  секций, включая How to use it, Where to place it и Verify; поля
  `meta.ai.export` и `meta.ai.usage`; дублирующая строка про «не
  пересоздавай» убрана из metadata всех блоков.

## Статус Phase 3

Закрыты фактически: 5 пользовательских блоков (hero-001/002/003,
features-001, pricing-001), **три типа блоков** (hero, features, pricing),
каталог и главная из registry metadata, публикация по HTTPS, `_smoke` вне
публикации, `REGISTRY_BASE_URL` на реальном домене, метаданные нигде не
дублируются, все проверки зелёные.

Осталось: проверить установку по HTTPS в чистом проекте на features и pricing
и прогнать Copy for AI на всех трёх типах. Отметки в `ROADMAP.md` намеренно
не проставлены — ставить их стоит после внешнего user test, а не после
собственной проверки.

**Каталог не наращиваем: блоки 6–20 не делаем.** Пяти блоков и трёх типов
достаточно, чтобы пройти сценарий целиком. Текущий фокус — продуктовая
оболочка и первый внешний user test сценария «выбрал → Copy for AI → агент
установил». Следующий артефакт — `USER_TEST.md`: сценарий для внешнего
человека и место, куда он кладёт результат.

## Продуктовая оболочка — Catalog Shell v1

VibeUI catalog-first: лендинга больше нет, `/` — это сам каталог. Оболочка
живёт в `components/catalog/`:

- `catalog-shell.tsx` — тёмный app chrome: topbar сверху, две колонки под ним;
- `catalog-topbar.tsx` — лого, счётчик блоков, ссылка на каталог;
- `catalog-sidebar.tsx` — левая колонка, sticky, скрыта ниже `lg`;
- `catalog-nav.tsx` (client) — фильтр категорий: вертикальный список в sidebar
  на desktop, горизонтальная лента над сеткой на mobile;
- `catalog-grid.tsx` — сетка `li[data-category]` + CSS-правила фильтра;
- `catalog-card.tsx` — карточка блока с Copy for AI;
- `catalog-block-nav.tsx` — sidebar страницы блока: категории, раскрытые до
  самих блоков, с подсветкой текущего.

Маршруты: `/` и `/components` — один и тот же каталог с разными заголовками,
`/components/[slug]` — та же оболочка с block-nav вместо фильтра,
`/preview/[slug]` вне оболочки и не меняется.

### Правило тёмной оболочки

Тёмная только оболочка, не сайт. Палитра — локальные токены `--shell-*`
в `.catalog-shell` (`app/globals.css`), проброшенные в Tailwind через
`@theme inline` как `bg-shell-panel`, `text-shell-muted`, `border-shell-border`
и т.д. Глобальная тема и `:root` остаются светлыми.

Класс `.dark` для этого использовать нельзя: вариант объявлен как
`&:is(.dark *)` и каскадит на всё поддерево, включая миниатюры и preview, —
то есть перекрашивал бы registry-блоки от контекста каталога. Это прямое
нарушение правила фидельности. По той же причине оболочка не переопределяет
базовые токены (`--background`, `--border`, `--muted`): цвет chrome ставится
явными `*-shell-*` классами.

### Ограничение: shell-only компоненты

`CopyButton`, `CodeBlock`, `BlockPreview` и `BlockThumbnail` лежат в
`components/`, но сейчас это **catalog-shell UI**: их цвета завязаны на
токены `--shell-*`, а те объявлены только на `.catalog-shell`. Вне оболочки
цвета не разрешатся и компонент отрендерится сломанным.

Если такой компонент понадобится вне `CatalogShell` — сначала добавить ему
варианты (`default` для светлой темы сайта и `shell` для оболочки) и только
потом использовать. Переносить как есть или подмешивать `--shell-*`
в `:root` нельзя: второе вернёт ту же проблему с перекраской блоков.

### Registry как база карточек

Отдельной базы данных каталога нет и не будет. Файловая база — сами
`registry.json`; `registry/index.ts` читает их на сборке и отдаёт UI.
Ручных массивов вроде `components-data.ts` не существует и заводить их нельзя.

## Catalog Data Model v1

Каталог держит **два типа installable items** (третий зарезервирован):

| kind        | что это                                   | где живёт                         |
| ----------- | ----------------------------------------- | --------------------------------- |
| `block`     | большая секция: hero, features, pricing   | `registry/blocks/<category>/`     |
| `component` | мелкий UI-компонент: button, input, badge | `registry/components/<category>/` |
| `template`  | целая страница из блоков                  | зарезервировано, реализации нет   |

Три независимые оси таксономии, все в `registry/categories.ts`:

- `KINDS` — тип единицы установки;
- `CATEGORIES` — тип секции, штатное поле схемы shadcn (`categories[0]`);
- `GROUPS` — предметная область (`marketing`, `application`, `data`,
  `commerce`, `navigation`), у каждой категории проставлена своя.

**Ключевое правило: `kind` и `group` не пишутся в metadata items.**
`kind` объявляется один раз на реестр в `SOURCES` (все items одного
`registry.json` — одного типа), `group` выводится из категории. Поля
`meta.kind` и `meta.group` в типе есть, но это точечное исключение —
их использование означает, что item выбивается из своего реестра.

Следствие, которое надо сохранять: публикуемые `/r/<name>.json` от введения
модели не изменились ни на байт. Проверяется сравнением `public/r/*.json`
до и после сборки.

Типы — `registry/meta.ts`: `CatalogMeta` (tags, ai, kind?, group?, internal?,
featured?) и `CatalogItem = RegistryItem & { meta?: CatalogMeta }`.

API `registry/index.ts`:

- `getCatalogItems()` / `getCatalogItem(slug)` — весь каталог и один item;
- `getItemsByKind(kind)` — items одного типа;
- `getItemKind(slug)` / `getItemGroup(slug)` / `getItemDirectory(slug)` —
  резолв по slug;
- `getUsedCategories(kind?)` — категории с counts, опционально внутри типа;
- `getCatalogNavSections()` — разделы sidebar: типы, внутри — категории.

### Как добавить первый мелкий компонент

Модель готова, items ещё нет — `registry/components/` пустая. Порядок:

1. `registry/components/<category>/registry.json` + сам компонент рядом;
2. корневой `registry.json` → `include[]`;
3. `registry/index.ts` → импорт + строка в `SOURCES` с `kind: "component"`;
4. `registry/components/<category>/components.ts` + расстилка
   в `registry/previews.ts`.

Категории для мелких компонентов (`buttons`, `inputs`, `display`,
`feedback`, `tables`) в `CATEGORIES` уже заведены.

Sidebar и фильтр подхватят новый тип сами: строки типов появляются, только
когда типов в каталоге больше одного, и категории считаются внутри типа —
поэтому blocks и components не смешиваются в одну кашу.

`registry/previews.ts` (бывший `registry/components.ts`) переименован
специально: имя `registry/components.ts` конфликтовало бы с директорией
`registry/components/`.

### Фильтр каталога

Фильтр одномерный: активен либо тип (`kind:block`), либо категория (`hero`).
Client wrapper переключает `data-catalog-filter` на `<main>`, карточки
остаются серверными, правила выводятся из `KINDS` + `CATEGORIES`, обе
страницы каталога остаются статическими. URL-состояния у фильтра в v1 нет.

### Product Delivery Model

Полностью — в [DELIVERY.md](DELIVERY.md). Коротко, потому что это правило
перевешивает developer UX:

- **главный output — agent prompt.** Не код и не registry URL;
- **registry URL — транспорт внутри промпта.** Наружу вынесен только для
  тех, кто сам работает с CLI;
- **код — доверие и отладка для программистов.** Не путь установки;
- **пользователь не должен выбирать** между кодом, URL и промптом. Одно
  очевидное действие, остальное глубже.

Следствия в UI: на карточке ровно одно действие — Copy for AI, рядом
приглушённое «Подробнее»; registry URL и исходник живут только на странице
item'а, в блоке «Для разработчика», исходник свёрнут. После копирования
кнопка говорит «Скопировано — вставьте агенту».

Карточка — Server Component: `buildCopyForAiPrompt(item, getInstallCommand(item.name))`
считается на сервере, клиент получает готовую строку и не тянет registry
в бандл.

### Product Delivery Prompt v1 — реализован

`lib/copy-for-ai.ts` отдаёт восемь секций: Install first · What it is ·
How to use it · Where to place it · Keep exactly as installed ·
You may change · Rules · Verify. Промпт теперь отвечает не только «как
установить», но и «как использовать» и «куда поставить» — последнее через
текст по `kind` и строку `Placement: ___`, которую пользователь дописывает
своими словами.

Контракт: `buildCopyForAiPrompt(item, { installCommand, registryUrl, kind })`.

Два новых авторских поля в `meta.ai` — `export` (имя экспорта) и `usage`
(канонический JSX-сниппет). В типе оба опциональны, чтобы не переписывать
metadata пяти существующих блоков; **для `kind: component` обязательны по
соглашению** — без `usage` агент не знает, с какими пропсами вставлять
мелкий компонент.

Общая строка «установи из registry, не пересоздавай» живёт только в секции 1
генератора; из `meta.ai.notes` всех пяти блоков её копия удалена. Это
единственное изменение публикуемых `/r/*.json` — по одной строке на item,
остальное содержимое побайтово прежнее.

Известный блокер остаётся: для `kind: component` нужен отдельный режим
превью — мелкий компонент нельзя показывать section-масштабом 1280px.
Промпт к первому `button-001` уже готов, превью — нет. Решать вместе
с первым компонентом, см. DELIVERY.md.

Обернуть миниатюру в ссылку нельзя — внутри блоков есть свои `<a>`, вложенные
ссылки дают ошибку гидратации. Кликабельность карточки даёт растянутый
псевдоэлемент заголовка (`after:absolute after:inset-0`), поэтому кнопка Copy
поднята над ним через `relative z-10`; ссылки самого блока убраны из
Tab-порядка атрибутом `inert` на обёртке миниатюры.

### Миниатюры

`BlockThumbnail` не изменился по существу: тот же блок, тот же масштаб от
собственной ширины. Подложка — цвет панели карточки, чтобы блок ниже 16/9 не
читался как обрезанная серая полоса. Запасные фиксированные масштабы
в `.block-thumbnail-scale` посчитаны под ширину карточки в новой сетке
(контейнер `max-w-[1440px]`, sidebar 14rem + gap 2rem от `lg`,
1 / 2 / 3 колонки) — при смене ширины карточки их надо пересчитывать.

## Как добавляется новая категория

Проверено на `features`. `registry/categories.ts` менять не нужно, список
категорий там уже полный. Правятся четыре точки проводки:

1. `registry/blocks/<category>/registry.json` — реестр категории;
2. корневой `registry.json` → `include[]`;
3. `registry/index.ts` → импорт + запись в `SOURCES` (порядок этого списка
   задаёт порядок блоков в каталоге);
4. `registry/blocks/<category>/components.ts` + расстилка в
   `registry/previews.ts`.

`registry/source.server.ts`, страницы и карточка каталога не трогаются:
путь к исходнику считается от директории объявившего реестра, а метка
категории берётся из `getCategoryLabel`. Контроль: `registry:validate`
должен показать на один файл и на один item больше.

**Следующий блок — `pricing-001`.** Он закрывает пункт DoD Phase 3 «минимум
3 типа блоков» и оставшийся пункт «Copy for AI протестирован на hero /
features / pricing». Hero 004 не нужен: четвёртый герой не двигает ни один
незакрытый пункт.

Hero 001:

- `registry/blocks/hero/hero-001/hero-001.tsx`;
- named export `Hero001`;
- self-contained Server Component;
- один файл;
- без runtime dependencies;
- локальная палитра `--vibeui-hero-*`;
- CSS/keyframes внутри компонента через React 19 `<style href=... precedence=...>`;
- CTA сделаны semantic `<a>`, не shadcn Button;
- `prefers-reduced-motion`;
- декоративные слои `aria-hidden`;
- metadata и `meta.ai` в `registry/blocks/hero/registry.json`;
- раскладка на container-запросах, типографика в `cqi` — блок меряет
  собственную ширину, а не ширину окна (см. «Правило фидельности блока»).

## Известные наблюдения visual audit

Production реально рендерился через Edge headless на:

- `390x844`;
- `768x1024`;
- `1440x1000`.

Проверялись:

- `https://vibeui.ru`;
- `https://vibeui.ru/components`;
- `https://vibeui.ru/components/hero-001`;
- `https://vibeui.ru/preview/hero-001`.

Вывод:

- архитектура в целом правильная;
- продуктовый фундамент есть;
- сайт пока местами ощущается как developer demo, потому что блок всего один;
- перед Hero 002 важно закрыть mobile/preview/thumbnail fidelity issues.

## Foundation fixes (закрыты в коде, не задеплоены)

Все критичные темы перед Hero 002 закрыты и проверены рендером.

Почему аудиты расходились по overflow:

- `/components/hero-001` — `<code>` в секции Code уезжал вправо до 1703px
  при viewport 375: вложенный горизонтальный скролл. Настоящий overflow,
  исправлен переносом строк вместо скролла;
- `/`, `/components` — миниатюра каталога имела layout-box 1280px в потоке.
  Chromium сжимал его transform'ом, поэтому `document.scrollWidth` был чистым,
  а layout-based аудит видел 1280px. Слой переведён в `position: absolute`,
  вне потока;
- `/preview/hero-001` — геометрический overflow не воспроизвёлся ни на 390,
  ни на 320.

Что изменено:

- **hero-001** — container-запросы вместо `sm:`/`md:`, типографика в `cqi`,
  отступы и высота на внутреннем `[data-part="frame"]`; минимум заголовка
  `2.25rem`, `break-words` на заголовке и описании;
- **миниатюра** — `position: absolute` вне потока; запасные масштабы для
  движков без деления длин в `calc()` разложены по шагам сетки (на `≥64rem`
  было 0.27 при нужных 0.24 — блок резался на 12%);
- **preview** — дефолтный viewport следует за шириной контейнера
  (`< 700px` → Mobile), после выбора пользователя автопереключение выключается;
  iframe переведён в `absolute`; правая группа контролов получила `flex-wrap`;
- **страница компонента** — Copy for AI стал primary-кнопкой, Copy code
  и Copy command остались secondary;
- **`registry.json`** — `homepage` исправлен на `https://vibeui.ru`;
- **`meta.ai.preserve`** — агенту явно запрещено переписывать container-запросы
  на viewport-медиазапросы.

Проверено на локальной production-сборке, 4 маршрута × 4 ширины
(320 / 390 / 768 / 1440): на всех 16 комбинациях
`documentElement.scrollWidth === clientWidth` и ноль элементов за правым краем.

Фидельность подтверждена измерением, не на глаз. Один и тот же файл при
окне 390px:

|                 | в миниатюре каталога | standalone preview |
| --------------- | -------------------- | ------------------ |
| ширина секции   | 1280px               | 390px              |
| padding         | 40px                 | 24px               |
| min-height      | 680px                | 560px              |
| направление CTA | row                  | column             |
| размер h1       | 76px                 | 36px               |

Остаётся известным и намеренным: `offsetWidth` миниатюры равен 1280px. Это
неустранимо, пока карточка рендерит настоящий блок в его настоящей ширине;
альтернативы (iframe или скриншот на карточку) запрещены архитектурой. Слой
вне потока и обрезан карточкой, страница по горизонтали не едет. `zoom` вместо
`transform` даёт тот же `offsetWidth`, выгоды нет.

Важно: были разные результаты mobile-аудита между сессиями. Новая сессия не
должна считать mobile закрытым без собственного render/screenshot check —
и должна различать настоящий overflow страницы и layout-box масштабированного
слоя.

## Ближайшая дорожная точка

Не начинать Hero 002 вслепую.

Правильный порядок:

1. ~~Исправить foundation issues после visual audit.~~ сделано;
2. ~~Перепроверить local render на mobile/tablet/desktop.~~ сделано;
3. ~~задеплоить foundation fixes на production.~~ сделано, `920bdbb`;
4. ~~утвердить specification Hero 002.~~ сделано;
5. ~~реализовать Hero 002.~~ сделано, ждёт ревью;
6. ~~задеплоить Hero 002.~~ сделано, `4f3bbad`;
7. ~~реализовать Hero 003.~~ сделано, ждёт ревью;
8. ~~задеплоить Hero 003.~~ сделано, `d15dc39`;
9. ~~решить по `meta.featured`.~~ сделано: все три hero featured, `98116a5`;
10. ~~реализовать Features 001.~~ сделано, ждёт ревью;
11. ~~задеплоить Features 001.~~ сделано, `710f684`;
12. ~~реализовать Pricing 001.~~ сделано, ждёт ревью;
13. ~~задеплоить Pricing 001.~~ сделано, `2888673`;
14. ~~собрать продуктовую оболочку.~~ сделано, ждёт ревью;
15. задеплоить оболочку;
16. написать `USER_TEST.md` и провести первый внешний тест. Новые блоки — нет.

Текущая точка: шаг 15. Оболочка лежит в рабочем дереве и проверена локально.
`meta.featured` не выставлен ни у features-001, ни у pricing-001: главная
берёт первые три featured-блока, и это три hero.

## Направление Hero 002

Hero 002 должен принципиально отличаться от Hero 001.

Hero 001:

- dark;
- centered;
- atmospheric;
- glow/grid;
- typography-first.

Hero 002:

- light;
- split layout;
- B2B SaaS;
- content left;
- product visual right;
- clean;
- premium;
- rational, not atmospheric.

Right side:

- не использовать screenshot/image asset;
- создать product visualization через HTML/CSS/inline SVG;
- app/browser shell, metrics, mini chart, activity rows, floating UI pieces;
- mockup является частью дизайна, не placeholder;
- не превращать props API в dashboard builder.

Hero 002 должен быть self-contained, theme-independent, с локальной палитрой
`--vibeui-hero-002-*`, CSS-only animation, `prefers-reduced-motion`, semantic
HTML и компактным props API.

Дополнительно, из опыта foundation fixes:

- split-раскладка обязана переключаться container-запросом. На viewport-медиа
  она схлопнется в колонку прямо в карточке каталога и перестанет отличаться
  от Hero 001 — то есть весь смысл второго блока пропадёт;
- светлый блок на белой карточке каталога рискует выглядеть слабее тёмного
  Hero 001: фон делать тонированным, не чисто белым, окно mockup — с рамкой
  и выраженной тенью;
- внутри product mockup не должно быть мелкого настоящего текста: при
  масштабе миниатюры он превращается в шум. Крупные числа метрик, заголовок
  окна и чип — можно, остальное bar-плейсхолдерами;
- никаких выдуманных логотипов реальных компаний и фейковых имён в
  trust-строке;
- `meta.featured` выставляется после ревью, а не по факту появления блока.

## Правила для новых блоков

Каждый новый блок проходит отдельный цикл:

```
specification -> implementation -> review -> verification
```

Не делать несколько блоков одним запросом.

Для каждого блока:

- один source file в `registry/blocks/<category>/<name>/`;
- metadata в `registry/blocks/<category>/registry.json`;
- добавить mapping в registry component map, если текущая архитектура этого требует;
- `<Block />` без props сразу рендерит законченный demo;
- dependencies и registryDependencies объявлены явно;
- блок не импортирует код приложения;
- блок не читает env;
- theme-independent, если это визуально критично;
- раскладка на container-запросах, типографика в `cqi` — иначе миниатюра
  каталога покажет мобильную вёрстку и соврёт про дизайн;
- высота на ширине 1280px в диапазоне ~700–720px: preview-iframe фиксирован
  760px (выше — обрежется), карточка каталога имеет `aspect-[16/9]`, что при
  1280px даёт ровно 720px и заполняется без серой полосы;
- элементы блока читаются как формы при масштабе ~0.24 — это масштаб
  миниатюры в каталоге;
- responsive проверен на mobile/tablet/desktop;
- проверено отсутствие horizontal overflow, в том числе на 320px;
- Copy for AI metadata объясняет, что сохранить и что можно менять.

## Definition of Done для рабочих изменений

Минимально:

```bash
npm run registry:validate
npm run registry:build
npm run typecheck
npm run lint
npm run build
```

Для визуальных изменений также нужны реальные render/screenshot checks на:

- `390x844`;
- `768x1024`;
- `1440x1000` или шире.

Плюс проверка horizontal overflow — измерением, не глазами:
`documentElement.scrollWidth === clientWidth` и ноль элементов, у которых
`getBoundingClientRect().right` больше ширины viewport. Дополнительно 320px
как стресс-тест.

Для production/deploy задач сначала читать [DEPLOY.md](DEPLOY.md). Не деплоить
без явной команды пользователя.

## Security

Не просить пользователя присылать токены в чат.

Не коммитить секреты. `SECRETS.local.md` содержит локальные/private сведения и
не должен уходить в Git.

В одной из прошлых сессий в чат передавался GitHub classic token с широкими
permissions. Если пользователь не подтвердил revoke, напомнить отозвать его:

GitHub Settings -> Developer settings -> Personal access tokens -> Revoke.

Для server pull использовать минимально привилегированный deploy key/token.

## Как стартовать новой AI-сессии

Первое действие:

```text
Прочитай docs/PROJECT_CONTEXT.md, затем только необходимые связанные документы и код.
Не пересказывай контекст обратно. Кратко подтверди, что понял текущую точку, и
выполни запрошенную задачу в рамках scope.
```

Если задача от пользователя диагностическая, не менять код без отдельного
разрешения.
