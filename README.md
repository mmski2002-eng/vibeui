# VibeUI

AI-native библиотека UI-компонентов для вайбкодинга.

**Выбери дизайн → отдай ИИ → получи сайт.**

Каждый блок раздаётся не только кодом, но и инструкцией для AI-агента:
что установить, что сохранить, что можно менять. Registry
shadcn-совместимый, поэтому агенты работают с ним стандартными командами.

## Стек

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 ·
shadcn/ui · npm · Vercel

## Команды

```bash
npm run dev               # dev-сервер
npm run build             # registry:build + next build
npm run lint
npm run typecheck
npm run format
npm run registry:validate # официальная проверка registry
npm run registry:build    # shadcn build -> public/r/
```

## Структура

```
app/                  роуты: /, /components, /components/[slug], /preview/[slug]
components/           UI сайта
registry/blocks/      блоки, которые скачивает пользователь (source of truth)
registry/index.ts     индекс блоков для сайта
public/r/             собранный registry (артефакт сборки, не в git)
docs/                 PRODUCT, ARCHITECTURE, ROADMAP
```

## Установка блока

```bash
npx shadcn@latest add <REGISTRY_BASE_URL>/hero-001.json
```

`REGISTRY_BASE_URL` задаётся переменной окружения (см. `.env.example`).

Подробности: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md),
[docs/PRODUCT.md](docs/PRODUCT.md), [docs/ROADMAP.md](docs/ROADMAP.md).
