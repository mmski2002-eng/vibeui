# ARCHITECTURE

## Stack

Фактические версии — `package.json`.

- Next.js 16 (App Router, Turbopack) + React 19
- TypeScript 5, `strict: true`, alias `@/*` → корень проекта (без `src/`)
- Tailwind CSS v4 через `@tailwindcss/postcss`; конфиг-файла нет, тема и токены —
  в `app/globals.css` (`@theme inline`, CSS-переменные)
- shadcn/ui CLI v4 (`components.json`, style `base-nova`, baseColor `neutral`);
  установленных primitives сейчас нет — когда понадобятся, `npx shadcn add`
  принесёт `@base-ui/react`, **не** Radix (стиль `base-nova`)
- `clsx`, `tailwind-merge`, `tw-animate-css`, `lucide-react`
- ESLint 9 (flat) + Prettier 3 с `prettier-plugin-tailwindcss`
- npm; деплой self-hosted на VPS: Next standalone (`output: "standalone"`),
  systemd, nginx с TLS — подробности в [DEPLOY.md](DEPLOY.md)

Без БД и бэкенд-сервисов: данные каталога статические, из кода.

## Структура каталогов

```
app/
  layout.tsx                     root layout, шрифты
  globals.css                    Tailwind v4 + тема (единственный источник токенов)
  page.tsx                       каталог (catalog-first главная)
  components/page.tsx            тот же каталог
  components/[slug]/page.tsx     страница компонента
  preview/[slug]/page.tsx        изолированный рендер блока для iframe
  r/[name]/route.ts              registry endpoint (shadcn-compatible JSON)
components/                      UI сайта: preview, миниатюра, кнопки копирования
components/catalog/              оболочка каталога: shell, topbar, sidebar, nav, grid, card
components/ui/                   primitives из shadcn (сейчас пусто)
registry/
  registry.ts                    индекс блоков + metadata
  categories.ts                  таксономия: kinds, categories, groups
  meta.ts                        типы CatalogItem / CatalogMeta
  previews.ts                    карта slug -> React-компонент
  blocks/<category>/<name>/      распространяемая секция — source of truth
  components/<category>/<name>/  мелкие компоненты (пока пусто)
lib/utils.ts                     cn() и утилиты
components.json                  конфиг shadcn CLI
public/r/                        сгенерированные registry JSON (позже)
docs/                            эти документы
```

## Где обычные UI components

`components/ui/` — primitives (button, dialog, tabs…), поставленные через
`npx shadcn@latest add <name>`. Сейчас каталог пуст: сайт обходится
собственными компонентами, а первый же `shadcn add` создаст его заново.
Алиас `ui` в `components.json` оставлен именно для этого.

`components/` — компоненты сайта: карточка каталога, фильтры, переключатель
viewport, кнопка Copy for AI. Это код продукта, наружу не раздаётся.

## Где registry components

`registry/blocks/<name>/` — то, что получает пользователь. Правила:

- блок не импортирует код приложения и не ходит в его API;
- блок не читает env-переменные сайта;
- зависимости (npm-пакеты + файлы из `components/ui/`) объявляются явно
  в metadata блока в `registry/blocks/<category>/registry.json`;
- блок должен работать после копирования в чистый Next.js + Tailwind проект.

Если блоку нужен primitive — он объявляет его как `registryDependencies`,
а не тащит через относительный импорт вверх по дереву.

## Preview

Preview рендерит **тот же файл**, что скачивает пользователь: страница компонента
импортирует компонент из `registry/blocks/<name>/`. Отдельных демо-копий нет.

Для корректного responsive блок рендерится в `<iframe>` на роут
`/preview/[slug]` (минимальный layout, только тема и блок). Ширина iframe
переключается Desktop / Tablet / Mobile — это даёт настоящие CSS-медиазапросы,
а не имитацию через масштабирование контейнера.

Страницы каталога и компонента — Server Components. Client Components только там,
где нужна интерактивность: фильтры, переключатель viewport, кнопки копирования.

## Registry

Формат — shadcn registry (`shadcn@4.19.0`), свой протокол не изобретаем.

Source: корневой `registry.json` (name, homepage, `include[]`) + по одному
`registry.json` на категорию в `registry/blocks/<category>/`. Пути файлов в
item'е резолвятся относительно объявившего его `registry.json`. Имена item'ов
уникальны по всему дереву.

Корневой `include[]` — это и есть граница публикации: попало в него —
раздаётся по HTTPS.

```
registry.json                       корень: include[] — что публикуется
registry/
  categories.ts                     список категорий каталога
  meta.ts                           типы поля meta (tags + AI-описание)
  blocks/
    hero/registry.json              items категории
    hero/hero-001/hero-001.tsx      исходник блока
public/r/                           артефакт сборки, в git не коммитится
```

Метаданные вне схемы shadcn (tags, AI-описание) кладём в штатное поле `meta` —
оно доезжает в `public/r/<name>.json`, то есть агент видит их при установке.
`categories[]` — штатное поле схемы.

Команды:

```bash
npm run registry:validate   # shadcn registry validate ./registry.json
npm run registry:build      # очистка public/r/, затем shadcn build -> public/r/
npm run build               # registry:build + next build
```

`registry:build` чистит `public/r/` перед сборкой: без этого item, удалённый
из `include[]`, продолжал бы раздаваться со старой сборки.

Установка у пользователя:
`npx shadcn@latest add https://<domain>/r/<name>.json`.

`homepage` в корневом `registry.json` — `https://vibeui.ru`, реальный
production-домен. Значение доезжает в собранный `public/r/registry.json`,
поэтому при смене домена его нужно менять вместе с `REGISTRY_BASE_URL`.

### REGISTRY_BASE_URL

Базовый URL публичного registry (`<origin>/r`) задаётся переменной окружения
`REGISTRY_BASE_URL` (см. `.env.example`). Из неё строится install-команда на
странице компонента и внутри Copy for AI.

- development: переменной может не быть — подставляется `http://localhost:3000/r`;
- production: без переменной UI честно пишет, что команда недоступна,
  выдуманный домен не подставляется;
- значение вшивается на сборке (страницы статические), поэтому смена URL
  требует редеплоя.

## Каталог

`/components` и `/` — один и тот же каталог: статические Server Components,
данные берут из `registry/index.ts`. Оболочка — `components/catalog/*`
(`CatalogShell`, `CatalogTopbar`, `CatalogSidebar`, `CatalogNav`,
`CatalogGrid`, `CatalogCard`), тёмная за счёт локальных токенов `--shell-*`
в `.catalog-shell`, а не глобальной dark-темы. Карточка каталога рендерит
**тот же** компонент блока, что уходит пользователю: iframe и скриншотов
в каталоге нет, поэтому число блоков не увеличивает число фреймов. Copy for AI
собирается на сервере прямо в карточке и доступен из сетки.

Миниатюра: блок рендерится в свою «настоящую» ширину (1280px) и вписывается
в карточку через `transform: scale(calc(100cqw / var(--thumbnail-width)))`
внутри container-query контекста; перед этим объявлен фиксированный запасной
масштаб для браузеров без деления длин в `calc()`. Обёртка получает `inert`
и `pointer-events-none`, поэтому ссылки внутри блока не попадают в Tab-порядок
каталога — кликабельна карточка целиком, а кнопка Copy for AI поднята над
растянутым псевдоэлементом ссылки через `relative z-10`. JS для миниатюры
не используется.

## Registry как файловая база каталога

У каталога нет БД и нет бэкенда. Роль базы играют сами `registry.json`:
`registry/index.ts` импортирует их на сборке, отбрасывает служебные items
(`meta.internal`) и отдаёт UI готовый список. Всё остальное — производные
этих файлов, поэтому параллельных источников данных (`components-data.ts`
и подобных) быть не может.

Каталог различает два типа installable items — `block` (большая секция)
и `component` (мелкий UI-компонент); `template` зарезервирован. Тип
объявляется один раз на реестр в `SOURCES`, предметная область (`group`)
выводится из категории. В metadata items ни то, ни другое не пишется,
поэтому публикуемый `/r/<name>.json` от введения модели не изменился.

Таксономия — `registry/categories.ts` (`KINDS`, `CATEGORIES`, `GROUPS`),
типы — `registry/meta.ts` (`CatalogItem`, `CatalogMeta`), доступ —
`registry/index.ts` (`getCatalogItems`, `getCatalogItem`, `getItemsByKind`,
`getUsedCategories`, `getCatalogNavSections`). Карта slug → React-компонент
для миниатюр и `/preview/[slug]` — `registry/previews.ts`; она называется
так, чтобы не конфликтовать с директорией `registry/components/`.

Подробности модели и порядок добавления первого мелкого компонента —
в [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md), раздел «Catalog Data Model v1».

## Single source of truth

Одно правило, из которого выводится остальное:

**У блока ровно один исходник — `registry/blocks/<name>/`.**

Из него берут данные: preview, страница компонента, Copy for AI, registry JSON,
установка через CLI. Любое дублирование кода блока (демо-версия, «упрощённый
пример для превью», отдельный снапшот для копирования) считается багом:
именно рассинхрон preview и выдачи ломает главное обещание продукта.

Metadata тоже одна — `registry/blocks/<category>/registry.json`. Категории, теги и зависимости
не дублируются в страницах.
