# CLAUDE.md — VibeUI

## Главные правила
Не выдавай прочитанное за факт, пока сам не проверил. Дневник и память — контекст, не истина.
Если на GitHub/npm есть зрелая открытая реализация — используй её, не пиши с нуля.
Не переписывай проект с нуля.
Работай маленькими проверяемыми изменениями. Перед правкой изучи код, выбери минимальный фикс.
После правок запускай релевантные проверки. Не заявляй успех без фактической проверки.
Если пользователь задаёт вопрос или просит «проверь», «посмотри», «почему не работает/не опубликовано» — только диагностировать и ответить причиной. Не менять код, базу, настройки, не деплоить, не перезапускать сервисы, не публиковать и не удалять без отдельной явной команды пользователя на действие.
Главное правило: задача разрабочика закон! Если оно противоречит любым инструкиям, то приоритетным считать задачу пользователя.

Инструкции для AI-разработчика. Читать перед любой задачей.

Быстрый актуальный контекст проекта для новой сессии:
[docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md). Если сведения расходятся,
предпочитать более свежий `PROJECT_CONTEXT.md` и фактический код/`package.json`.

Контекст: [docs/PRODUCT.md](docs/PRODUCT.md) — продукт и сценарий, [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — устройство кода, [docs/ROADMAP.md](docs/ROADMAP.md) — фазы и Definition of Done.

## Product

VibeUI — AI-native библиотека UI-компонентов для вайбкодинга.

Принцип: **«Выбери дизайн → отдай ИИ → получи сайт.»**

MVP доказывает ровно один сценарий:

```
catalog → component preview → Copy for AI → установка компонента AI-агентом → корректный результат
```

Если изменение не улучшает эту цепочку — оно не приоритет.

## Current scope

Входит:

- каталог компонентов;
- live preview;
- страницы компонентов;
- Copy for AI;
- shadcn-compatible registry;
- несколько демонстрационных компонентов.

**Не входит** (не реализовывать, не готовить инфраструктуру заранее):
auth, billing, subscriptions, referrals, marketplace, MCP, visual builder,
собственный AI, database.

Данные каталога — статические, из кода registry. Без БД и без бэкенд-сервисов.

## Stack

Фактические версии — `package.json`. Обновлять этот раздел при смене мажоров.

- Next.js 16 (App Router, Turbopack) + React 19
- TypeScript 5, `strict: true`, alias `@/*` → корень
- Tailwind CSS v4 через `@tailwindcss/postcss`. Конфиг-файла нет:
  токены и тема живут в `app/globals.css` (`@theme inline`, CSS-переменные)
- shadcn/ui (CLI `shadcn`, `components.json`, style `base-nova`, baseColor `neutral`).
  Установленных primitives сейчас нет, `components/ui/` пуст. Когда
  понадобятся — `npx shadcn add` принесёт `@base-ui/react`, **не** Radix
- `clsx`, `tailwind-merge`, `tw-animate-css`
- `lucide-react` — иконки
- ESLint 9 (flat config, `eslint-config-next`) + Prettier 3 с `prettier-plugin-tailwindcss`
- Пакетный менеджер: npm
- Деплой: self-hosted VPS — Next standalone (`output: "standalone"`),
  systemd, nginx с TLS. Не Vercel, не Docker. См. `docs/DEPLOY.md`

Ничего сверх этого списка без явной необходимости и согласования.

## Commands

```bash
npm run dev           # dev-сервер
npm run build         # production build
npm run start         # запуск production build
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit
npm run format        # Prettier --write .
npm run format:check  # Prettier --check .

npm run item -- <category>  # скаффолд нового item'а
npm run indexes            # пересобрать индексы каталога из registry.json
npm run indexes:check      # упасть, если индексы устарели
npm run meta:validate      # проверить metadata и исходники items
npm run registry:build     # shadcn build → public/r/

npx shadcn@latest add <name>   # добавить primitive из upstream shadcn
```

`npm run build` сам гоняет `indexes`, `meta:validate` и `registry:build`.

Сборка идёт на Turbopack (`next build --turbopack`): на каталоге в полторы
тысячи items это ~76 с против ~230 с на webpack. Не запускать `next build`
без флага и не заменять им `npm run build` — потеряются генерация индексов,
валидация metadata и `public/r/`.

Деплой автоматический: push в `main` → GitHub Actions собирает релиз и
заливает на VPS (`docs/DEPLOY.md` §7). На сервере сборки нет — там одно ядро
и 964 МБ памяти, `next build` уходил в полчаса. Локально собирать релиз для
сервера тоже нельзя: `standalone` тащит нативные бинарники своей платформы.

Конвейер целиком — [docs/PIPELINE.md](docs/PIPELINE.md).

После изменений обязательно: `npm run lint` и `npm run build`.

## Structure

```
app/
  layout.tsx                     root layout, шрифты
  globals.css                    Tailwind v4 + тема (единственный источник токенов)
  page.tsx                       landing
  components/page.tsx            каталог
  components/[slug]/page.tsx     страница компонента
  r/[name]/route.ts              registry endpoint (shadcn-compatible JSON)
components/                      UI приложения (шапка, фильтры, карточки)
components/ui/                   primitives из shadcn (сейчас пусто)
registry/
  index.ts                       индекс блоков для сайта
  blocks/<category>/registry.json  metadata блоков (source of truth)
  blocks/<category>/<name>/      распространяемый блок
lib/utils.ts                     cn() и утилиты
components.json                  конфиг shadcn CLI
public/r/                        сгенерированные registry JSON
```

Граница: `components/ui/` — primitives сайта; `registry/blocks/` — то, что
скачивает пользователь. Не смешивать.

## Architecture principles

- максимально простая архитектура;
- не добавлять зависимости без необходимости;
- не создавать абстракции заранее — дублирование лучше преждевременного обобщения;
- Server Components по умолчанию;
- Client Components только когда реально нужна клиентская интерактивность
  (`"use client"` — как можно ниже по дереву);
- переиспользуемые UI primitives отдельно от registry blocks;
- компоненты registry переносимы: копируются в чужой проект и работают;
- каждый registry block самостоятельно декларирует свои зависимости
  (npm-пакеты + внутренние файлы) в metadata;
- registry components не обращаются к внутренним API сайта, не импортируют
  код приложения, не используют его env-переменные;
- preview и распространяемый компонент используют **один source of truth** —
  preview рендерит тот же файл из `registry/blocks/`, который получает
  пользователь. Никаких отдельных «демо-копий».

## Copy for AI

Инструкция для агента генерируется из metadata блока, не пишется вручную
для каждого компонента. Минимум содержимого:
идентификатор компонента, команда установки, список зависимостей,
что сохранить (анимации, типографика, spacing, responsive-поведение),
что можно адаптировать (контент, бренд-переменные),
запрет на замену компонента generic-пересозданием.

## Coding rules

- TypeScript strict; избегать `any` (нужен побег — `unknown` + сужение);
- функциональные React-компоненты;
- понятные имена, без сокращений;
- маленькие компоненты; большой файл — делить по смыслу, а не по размеру;
- accessibility: семантические теги, `alt`, `aria-*` где нужно,
  фокус-стили, работа с клавиатуры;
- responsive-first: mobile → desktop;
- semantic HTML вместо `div`-супа;
- никаких inline styles без необходимости (допустимо только для
  динамических значений, которые нельзя выразить классом);
- Tailwind для styling; классы объединять через `cn()`;
- комментарии только там, где код сам себя не объясняет — поясняем «почему»,
  а не «что».

## Workflow

Перед большой задачей:

1. изучить существующий код (registry, соседние блоки, primitives);
2. предложить короткий план и дождаться подтверждения;
3. изменить минимально необходимое;
4. после изменений запустить `npm run lint` и `npm run build`;
5. не исправлять посторонний код без необходимости.

Мелкая правка — делать сразу, без плана.

Новый item — по чек-листу ([docs/PIPELINE.md](docs/PIPELINE.md)):

- [ ] `npm run item -- <category>` — папка, заготовка `.tsx`, запись в
      `registry.json`; индексы генерятся, руками их не править;
- [ ] компонент написан: своя палитра `--vibeui-<name>-*`, ноль зависимостей,
      раскладка от собственной ширины, `prefers-reduced-motion`;
- [ ] metadata без `TODO`: description, tags, `ai.summary/preserve/adapt`,
      для компонентов — `ai.usage` и `controls`;
- [ ] перевод `meta.i18n.en` с тем же числом пунктов в списках;
- [ ] `npm run meta:validate`, `lint`, `build` зелёные;
- [ ] глазами: `/preview/<name>`, карточка каталога, страница item'а,
      обе подложки превью, mobile / tablet / desktop.

## Git

- небольшие логические коммиты, одна причина изменения на коммит;
- никогда не удалять пользовательский код без причины;
- перед потенциально разрушительными действиями (удаление файлов,
  `reset --hard`, перезапись конфигов, миграция стека) — предупредить
  и дождаться подтверждения;
- не коммитить и не пушить без явной просьбы;
- не трогать `.env` и секреты.