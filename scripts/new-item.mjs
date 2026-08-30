import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"
import prettier from "prettier"

/**
 * Скаффолд нового item'а.
 *
 * Заводит папку, исходник по эталону и заготовку metadata в `registry.json`
 * категории. Индексы после этого пересобираются сами (`npm run indexes`),
 * руками они больше нигде не ведутся.
 *
 * Заготовка намеренно не проходит `npm run meta:validate`: в ней остались
 * `TODO`, и сборка будет падать, пока автор не напишет описание, инструкцию
 * для агента и перевод. Незаполненный item не должен уехать на витрину.
 *
 * Запуск: `npm run item -- <категория> [префикс]`
 * Пример:  `npm run item -- inputs input`
 */

const ROOT = process.cwd()
const TREES = [
  { root: "registry/blocks", kind: "block" },
  { root: "registry/components", kind: "component" },
]

/**
 * Имя item'а — не имя категории: в `buttons` лежат `button-001`. Где
 * отличие не выводится отбрасыванием «s», префикс задаётся вторым аргументом.
 */
function defaultPrefix(category) {
  return category.endsWith("s") && !["features"].includes(category)
    ? category.slice(0, -1)
    : category
}

function fail(message) {
  console.error(`✗ ${message}`)
  process.exit(1)
}

function pascalCase(name) {
  return name
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}

const [category, prefixArgument] = process.argv.slice(2)

if (!category) {
  fail("нужна категория: npm run item -- <категория> [префикс]")
}

const categories = readFileSync(
  path.join(ROOT, "registry/categories.ts"),
  "utf8",
)

if (!categories.includes(`slug: "${category}"`)) {
  fail(
    `категория "${category}" не объявлена в registry/categories.ts — сначала добавь её туда вместе с group`,
  )
}

const kindArgument = process.argv.includes("--block") ? "block" : "component"
const tree =
  TREES.find((entry) => existsSync(path.join(ROOT, entry.root, category))) ??
  TREES.find((entry) => entry.kind === kindArgument)

const directory = path.join(ROOT, tree.root, category)
const manifestPath = path.join(directory, "registry.json")

// Первая категория заводится вместе с первым item'ом: пустой реестр всё
// равно ничего не публикует, а забыть `$schema` в нём — легко.
if (!existsSync(manifestPath)) {
  mkdirSync(directory, { recursive: true })
  writeFileSync(
    manifestPath,
    `${JSON.stringify(
      { $schema: "https://ui.shadcn.com/schema/registry.json", items: [] },
      null,
      2,
    )}\n`,
  )
  console.log(`  заведена категория ${tree.root}/${category}`)
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"))
const prefix = prefixArgument ?? defaultPrefix(category)

// Нумерация ведётся внутри префикса: в одной категории могут жить
// `checkbox-001` и `switch-001` — это разные компоненты, а не варианты.
const taken = (manifest.items ?? [])
  .filter((item) => item.name.startsWith(`${prefix}-`))
  .map((item) => Number(item.name.slice(prefix.length + 1)))
  .filter((value) => Number.isInteger(value))
const number = String(Math.max(0, ...taken) + 1).padStart(3, "0")
const name = `${prefix}-${number}`
const symbol = pascalCase(name)

if (existsSync(path.join(directory, name))) {
  fail(`${name} уже существует`)
}

const componentSource = `import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type ${symbol}Props = ComponentPropsWithoutRef<"button"> & {
  tint?: string
}

// TODO: идея компонента одной фразой — чем он отличается от соседей
// по категории. Не «синяя кнопка», а визуальное решение.
const STYLES = \`
:where([data-vibeui-block="${name}"]){
--vibeui-${name}-fg:oklch(0.27 0.016 265);
--vibeui-${name}-accent:oklch(0.55 0.02 265);
--vibeui-${name}-ring:oklch(0.55 0.02 265 / 60%);
--vibeui-${name}-radius:0.5rem;
--vibeui-${name}-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="${name}"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.25rem;padding:0 0.875rem;border-radius:var(--vibeui-${name}-radius);
font-family:var(--vibeui-${name}-font);font-size:0.875rem;font-weight:500;line-height:1;
color:var(--vibeui-${name}-fg);background:transparent;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="${name}"]:focus-visible{outline:2px solid var(--vibeui-${name}-ring);outline-offset:2px}
[data-vibeui-block="${name}"]:disabled{cursor:not-allowed;opacity:.5}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="${name}"] *{animation:none!important;transition:none!important}}
\`

/** TODO: что это за компонент, одним предложением. */
export function ${symbol}({
  tint,
  type = "button",
  className,
  style,
  children = "TODO",
  ...props
}: ${symbol}Props) {
  const palette = {
    ...(tint ? { "--vibeui-${name}-accent": tint } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-${name}" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-vibeui-block="${name}"
        className={className}
        style={palette}
      >
        {children}
      </button>
    </>
  )
}
`

const blockSource = `import type { CSSProperties } from "react"

export type ${symbol}Props = {
  className?: string
  style?: CSSProperties
}

// TODO: идея блока одной фразой. Раскладка считается от собственной ширины
// блока (container queries), а не от ширины окна — иначе миниатюра каталога
// покажет мобильную вёрстку и соврёт про дизайн.
const STYLES = \`
:where([data-vibeui-block="${name}"]){
--vibeui-${name}-bg:oklch(0.99 0.002 265);
--vibeui-${name}-fg:oklch(0.24 0.016 265);
--vibeui-${name}-muted:oklch(0.52 0.014 265);
--vibeui-${name}-accent:oklch(0.55 0.02 265);
--vibeui-${name}-border:oklch(0.9 0.006 265);
--vibeui-${name}-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="${name}"]{
background:var(--vibeui-${name}-bg);color:var(--vibeui-${name}-fg);
font-family:var(--vibeui-${name}-font);
}
[data-vibeui-block="${name}"] [data-part="frame"]{
padding:3rem 1.5rem;margin:0 auto;max-width:80rem;
}
[data-vibeui-block="${name}"] [data-part="title"]{
font-size:clamp(1.75rem,5cqi,3.25rem);line-height:1.05;letter-spacing:-0.02em;margin:0;
}
@container (min-width: 48rem){
[data-vibeui-block="${name}"] [data-part="frame"]{padding:5rem 3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="${name}"] *{animation:none!important;transition:none!important}}
\`

/** TODO: что это за блок, одним предложением. */
export function ${symbol}({ className, style }: ${symbol}Props) {
  return (
    <>
      <style href="vibeui-${name}" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="${name}"
        className={className}
        style={style}
      >
        <div data-part="frame">
          <h2 data-part="title">TODO</h2>
        </div>
      </section>
    </>
  )
}
`

const metadata = {
  name,
  type: tree.kind === "block" ? "registry:block" : "registry:component",
  title: "TODO",
  description:
    "TODO: что это и в чём его идея. Одно-два предложения для карточки каталога.",
  categories: [category],
  dependencies: [],
  registryDependencies: [],
  files: [
    {
      path: `${name}/${name}.tsx`,
      type: "registry:component",
      target: `@components/vibeui/${name}.tsx`,
    },
  ],
  docs: "TODO: техническая справка для агента — из чего состоит и на чём держится.",
  meta: {
    tags: ["TODO"],
    ai: {
      ...(tree.kind === "component" ? { export: symbol } : null),
      usage: `<${symbol} />`,
      summary: "TODO: что делает компонент и чем он самодостаточен.",
      preserve: ["TODO", "TODO", "TODO"],
      adapt: ["TODO", "TODO", "TODO"],
      notes: ["TODO"],
    },
    ...(tree.kind === "component"
      ? {
          controls: [
            {
              prop: "children",
              label: "Подпись",
              type: "text",
              default: "TODO",
              maxLength: 40,
            },
          ],
        }
      : null),
    i18n: {
      en: {
        description: "TODO",
        ai: {
          summary: "TODO",
          preserve: ["TODO", "TODO", "TODO"],
          adapt: ["TODO", "TODO", "TODO"],
          notes: ["TODO"],
          usage: `<${symbol} />`,
        },
        ...(tree.kind === "component"
          ? { controls: { children: { label: "Label", default: "TODO" } } }
          : null),
      },
    },
  },
}

mkdirSync(path.join(directory, name), { recursive: true })
writeFileSync(
  path.join(directory, name, `${name}.tsx`),
  tree.kind === "component" ? componentSource : blockSource,
)

manifest.items = [...(manifest.items ?? []), metadata]

// Форматируем реестр prettier'ом проекта: иначе `npm run format:check`
// поднимет весь файл изменённым из-за переносов в коротких массивах.
const manifestOptions = await prettier.resolveConfig(manifestPath)

writeFileSync(
  manifestPath,
  await prettier.format(`${JSON.stringify(manifest, null, 2)}\n`, {
    ...manifestOptions,
    filepath: manifestPath,
  }),
)

execFileSync("node", ["scripts/build-indexes.mjs"], { stdio: "inherit" })

console.log(`
✓ ${name} создан:
  ${tree.root}/${category}/${name}/${name}.tsx
  запись в ${tree.root}/${category}/registry.json

Дальше:
  1. написать компонент — своя палитра --vibeui-${name}-*, ноль зависимостей;
  2. заменить все TODO в metadata (описание, ai.preserve/adapt, перевод en);
  3. npm run meta:validate && npm run lint && npm run build;
  4. посмотреть /preview/${name} и карточку в каталоге.
`)
