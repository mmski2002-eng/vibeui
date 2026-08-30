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
- shadcn CLI настроен, установленных primitives нет (`components/ui/` пуст);
  когда понадобятся — `@base-ui/react`, не Radix;
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

- ручной источник ровно один: `registry/**/registry.json` плюс сам `.tsx`
  item'а. Индексы (`registry/sources.ts`, `registry/previews.ts`,
  `registry/previews.lazy.ts`, `include[]` корневого реестра) генерируются
  командой `npm run indexes` и правятся только через генератор.
  Конвейер целиком — [PIPELINE.md](PIPELINE.md);
- новый item заводится скаффолдом `npm run item -- <категория>`; заготовка
  намеренно не проходит `meta:validate`, пока в metadata остались `TODO`;
- корневой `registry.json` — то, что публикуется; в `include[]` только
  категории, которые должны быть доступны снаружи;
- `npm run registry:build` очищает `public/r/` перед сборкой: иначе
  удалённый из реестра item продолжает раздаваться со старой сборки;
- служебных items в реестре больше нет: `_smoke` сначала исключили из
  корневого `include[]`, затем удалили из репозитория вместе с
  `components/ui/button.tsx`, который он один и держал. Production registry —
  только публичный каталог. Отдельный dev-реестр завести не получилось:
  `shadcn` требует, чтобы корневой файл назывался ровно `registry.json`;
  если служебный item понадобится снова, его придётся держать вне
  `include[]`, как раньше.

## Важные файлы

- [PRODUCT.md](PRODUCT.md) — продукт, аудитория, ключевой сценарий.
- [ARCHITECTURE.md](ARCHITECTURE.md) — устройство кода и registry.
- [DELIVERY.md](DELIVERY.md) — Product Delivery Model: как компонент попадает к пользователю.
- [CONTROLS.md](CONTROLS.md) — настройка item'а на витрине и вопрос про базу данных.
- [I18N.md](I18N.md) — два языка: маршруты, словари, метаданные, промпты.
- [ASSORTMENT.md](ASSORTMENT.md) — карта ассортимента и очередь работ.
- [PIPELINE.md](PIPELINE.md) — конвейер: скаффолд, генерация индексов, проверки.
- [ROADMAP.md](ROADMAP.md) — фазы и Definition of Done.
- [DEPLOY.md](DEPLOY.md) — production deployment.
- [../CLAUDE.md](../CLAUDE.md) — инструкции для AI-разработчика.
- [../registry/blocks/hero/registry.json](../registry/blocks/hero/registry.json) — metadata hero-блоков.
- [../registry/blocks/hero/hero-001/hero-001.tsx](../registry/blocks/hero/hero-001/hero-001.tsx) — первый эталонный блок.
- [../components/block-preview.tsx](../components/block-preview.tsx) — iframe preview.
- [../components/catalog/catalog-thumbnail.tsx](../components/catalog/catalog-thumbnail.tsx) — live thumbnail в каталоге.
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
- Удалён служебный smoke-test: `registry/blocks/_smoke/` и
  `components/ui/button.tsx`, который он один и держал. Следом убраны
  ставшие ненужными `@base-ui/react` и `class-variance-authority`.
  `components/ui/` физически исчез, алиас `ui` в `components.json`
  оставлен — он нужен shadcn CLI.
- Component preview mode + `button-001` — первый item типа `component`:
  `registry/components/buttons/button-001/`. Превью выбирается по `kind`,
  поэтому кнопка показывается в натуральную величину, а не точкой.
  Каталог: 6 items, два типа, sidebar раскрылся в два уровня.
- Button Pack v1 — ещё 10 кнопок, `button-002`…`button-011`. Каталог:
  16 items (5 блоков + 11 кнопок).
- Каталог разделён по типам: `/` и `/components` — только компоненты,
  `/blocks` — только блоки, ссылки на оба в шапке. Sidebar показывает
  категории одного типа, `getCatalogNavSections(kind?)` принимает фильтр.
  Страницы item'ов остались на `/components/<slug>`.
- Карточка перебрана по геометрии reui: двойная рамка (`p-0.5`, внешний
  радиус 16px, внутренний 12px, `shadow-sm shadow-black/5`), кадр превью
  `flex-1 min-h-44`, подвал в одну строку — имя слева, действие справа.
  Сетка — 1/2 колонки на контейнерных запросах, gap 24px.
- Переключатель тёмной и светлой подложки превью в углу кадра
  (`components/catalog/card-interactive.tsx`). По умолчанию тёмная. Меняется
  только подложка: registry-компоненты не перекрашиваются.
- **Доставка по ссылке.** Главный артефакт больше не текст промпта, а
  ссылка `/c/<name>` — plain text ~1200 символов, который агент открывает
  сам. Плюс `/f/<name>.tsx` — исходник для проектов без shadcn CLI.
  Проверено: установка по команде и скачивание по `curl` дают файл,
  побайтово равный исходнику (SHA-256 сверен); агент, получивший фразу
  «размести такую кнопку в шапке: <ссылка>», поставил компонент из registry
  и разместил его в `<header>`, свой вариант не сочинял. Подробности —
  в [DELIVERY.md](DELIVERY.md).
- `ASSORTMENT.md` — карта ассортимента и очередь работ по категориям.
- **Конфигуратор item'а.** `meta.controls` объявляет, что можно настроить;
  значения меняют пропсы и сниппет, но никогда исходник. Едут в ссылке,
  на сервере не хранятся, санитизируются по объявленным контролам —
  бриф читает агент, поэтому это граница безопасности, а не косметика.
  Подробности — [CONTROLS.md](CONTROLS.md).
- **Два языка.** Русский в корне, английский под `/en`; переключатель в
  шапке. Переведены интерфейс, метаданные всех items и обе инструкции
  для агента (`?lang=en`). Подробности — [I18N.md](I18N.md).
- **Конвейер наполнения.** Три ручных индекса (`components.ts` категорий,
  `previews.ts`, `previews.lazy.ts`) и `SOURCES` заменены генерацией из
  `registry.json` (`npm run indexes`), добавлен скаффолд `npm run item`.
  `meta:validate` дорос до жёстких правил: полнота metadata, паритет
  перевода `i18n.en`, а также сам исходник item'а — чужие импорты, классы
  темы проекта-хозяина, переменные без префикса `--vibeui-`, анимация без
  `prefers-reduced-motion`. Публикуемые `/r/*.json` при переходе не
  изменились ни на байт. Подробности — [PIPELINE.md](PIPELINE.md).
- **Наполнение каталога волнами.** 210 items в 28 реестрах: компоненты —
  `buttons` (20), `accordion` (11), `alert` (20), `dialog` (14), `aspect` (8),
  `autocomplete` (12), `avatar` (12), `badge` (12), `breadcrumb` (12),
  `calendar` (10), `card` (10), `carousel` (8), `checkbox` (8), `menu` (8),
  `inputs` (12), `display` (2),
  `feedback` (4), `navigation` (4), `tables` (3), `charts` (10); блоки — `hero` (3), `features`, `pricing`, `navbar`, `cta`,
  `faq`, `testimonials`, `footer`. Вместе с hero, features и pricing блоки
  собирают целый лендинг. Большинство items не несёт
  клиентского JS: раскрытие держат `details`, модалки и меню — HTML popover,
  графики считаются на сервере в SVG и разметке.
- **Витринные поля metadata.** `meta.preview` объявляет, как показывать item
  на карточке: `width` (`auto` или `full`) и `props` — демо-пропсы только для
  витрины. Подложка карточки всегда тёмная, светлая — только переключателем. В устанавливаемый файл
  это не попадает и дефолты компонента не меняет.

## Статус Phase 3

Закрыты фактически: 5 пользовательских блоков (hero-001/002/003,
features-001, pricing-001), **три типа блоков** (hero, features, pricing),
каталог и главная из registry metadata, публикация по HTTPS, служебных
items нет, `REGISTRY_BASE_URL` на реальном домене, метаданные нигде не
дублируются, все проверки зелёные.

Осталось: проверить установку по HTTPS в чистом проекте на features и pricing
и прогнать Copy for AI на всех трёх типах. Отметки в `ROADMAP.md` намеренно
не проставлены — ставить их стоит после внешнего user test, а не после
собственной проверки.

**Каталог наращиваем волнами по категориям.** Прежнее ограничение («блоки
6–20 не делаем») снято решением владельца: конвейер сделан, и ассортимент
идёт по очереди из [ASSORTMENT.md](ASSORTMENT.md). Одна волна — одна
категория: спека всех items сразу, реализация, отдельный проход ревью,
проверка в браузере, коммит.

Внешний user test сценария «выбрал → Copy for AI → агент установил» остаётся
следующей вехой и от наращивания каталога не зависит. Артефакт для него —
`USER_TEST.md`: сценарий для внешнего человека и место, куда он кладёт
результат.

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

`CopyButton`, `CodeBlock`, `BlockPreview` и `CatalogThumbnail` — это
**catalog-shell UI**: их цвета завязаны на
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

### Button Pack v1

Первая коллекция мелких компонентов — 11 кнопок в
`registry/components/buttons/`, каждая со своей визуальной идеей, а не
вариацией цвета:

| item                                | идея                                                  |
| ----------------------------------- | ----------------------------------------------------- |
| `button-001` Action Button          | базовая: три размера, три тона, состояние загрузки    |
| `button-002` Split Action Button    | две зоны в одном пятне через волосяной разделитель    |
| `button-003` Magnetic CTA Button    | подъём, разрастающееся свечение и блик по поверхности |
| `button-004` Quiet Secondary Button | нулевой вес в покое: ни рамки, ни фона                |
| `button-005` Confirm Button         | подтверждение в два шага с убывающей полосой времени  |
| `button-006` Danger Action Button   | предупреждающая штриховка выезжает по левому краю     |
| `button-007` Social Proof Button    | стопка аватаров из инициалов на CSS и счётчик         |
| `button-008` Command Button         | объёмные клавиши, которые нажимаются на наведении     |
| `button-009` Pill Toggle Button     | кнопка и переключатель в одном пятне                  |
| `button-010` Download Button        | прогресс заливает подложку самой кнопки               |
| `button-011` Minimal Link Button    | подчёркивание прочерчивается слева направо            |

Общие правила набора: один файл на item, `dependencies: []`,
`registryDependencies: []`, локальные переменные `--vibeui-button-00X-*`,
`focus-visible`, `disabled`, `prefers-reduced-motion`, поддержка `className`
и нативных пропсов `button`. Ни `@base-ui/react`, ни `cva`, ни иконочных
библиотек: стрелки и галочки — инлайновый SVG, спиннеры и штриховка — CSS.

Девять из одиннадцати — серверные компоненты. Клиентские только там, где
состояние составляет саму идею: `button-005` (окно подтверждения) и
`button-009` (переключатель).

### Как добавить мелкий компонент

Порядок:

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

- **главный output — ссылка `/c/<name>`.** Не код, не registry URL и уже
  не текст промпта: пользователь вставляет ссылку в собственную фразу
  агенту, агент открывает её сам;
- **registry URL — транспорт внутри инструкции.** Наружу вынесен только для
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

Режимы превью закрыты вместе с первым компонентом: миниатюра и фрейм
выбираются по `kind` — секция масштабируется из 1280px, мелкий компонент
показывается в натуральную величину по центру кадра. См. DELIVERY.md.

Обернуть миниатюру в ссылку нельзя — внутри блоков есть свои `<a>`, вложенные
ссылки дают ошибку гидратации. Кликабельность карточки даёт растянутый
псевдоэлемент заголовка (`after:absolute after:inset-0`), поэтому кнопка Copy
поднята над ним через `relative z-10`; ссылки самого блока убраны из
Tab-порядка атрибутом `inert` на обёртке миниатюры.

### Миниатюры

`CatalogThumbnail` (тогда — `BlockThumbnail`) не изменился по существу: тот
же блок, тот же масштаб от собственной ширины. Подложка — цвет панели карточки, чтобы блок ниже 16/9 не
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

Текущая точка: шаг 15, расширенный. Кроме оболочки в рабочем дереве лежат
разделение каталога на `/blocks` и `/components`, новая карточка,
переключатель темы превью и доставка по ссылке (`/c`, `/f`). Всё проверено
локально сборкой и тестами установки; глазами в браузере не проверялось —
браузерных инструментов в той сессии не было.
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
