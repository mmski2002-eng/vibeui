# CLAUDE.md — VibeUI

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
  Внимание: primitives — `@base-ui/react`, **не** Radix
- `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`
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

npx shadcn@latest add <name>   # добавить primitive из upstream shadcn
```

Сборка registry (`npx shadcn build` → `public/r/`) появится вместе с
`registry.json`; тогда же добавить скрипт `registry` в `package.json`.

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
components/ui/                   primitives из shadcn (button.tsx и т.д.)
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

Новый компонент — по чек-листу:

- [ ] файл в `registry/blocks/<name>/`;
- [ ] запись в `registry/blocks/<category>/registry.json` с category, tags, dependencies;
- [ ] страница компонента открывается, preview рендерится;
- [ ] preview корректен на mobile / tablet / desktop;
- [ ] Copy for AI выдаёт полную инструкцию;
- [ ] `lint` и `build` зелёные.

## Git

- небольшие логические коммиты, одна причина изменения на коммит;
- никогда не удалять пользовательский код без причины;
- перед потенциально разрушительными действиями (удаление файлов,
  `reset --hard`, перезапись конфигов, миграция стека) — предупредить
  и дождаться подтверждения;
- не коммитить и не пушить без явной просьбы;
- не трогать `.env` и секреты.

## Definition of done

Задача закрыта, когда: код собирается, lint чистый, сценарий проверен
в браузере вручную, scope не расширен сверх запрошенного.
