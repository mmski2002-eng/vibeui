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
  { root: "registry/animations", kind: "animation" },
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

const componentSource = `import type { ComponentProps, CSSProperties } from "react"

export type ${symbol}Props = Omit<ComponentProps<"div">, "children"> & {
  /** TODO: настройки компонента. Их же перечисляют meta.controls. */
  label?: string
  accent?: string
  /** Пусто — подложки нет, компонент ложится на фон страницы. */
  background?: string
}

// TODO: идея компонента одной фразой — чем он отличается от соседей по
// категории и какую задачу решает. Не «синяя кнопка», а решение.
const STYLES = \`
:where([data-vibeui-block="${name}"]){
--vibeui-${name}-bg:transparent;
--vibeui-${name}-fg:light-dark(oklch(0.25 0.014 265),oklch(0.95 0.005 265));
--vibeui-${name}-muted:color-mix(in oklab,var(--vibeui-${name}-fg) 62%,transparent);
--vibeui-${name}-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 14%));
--vibeui-${name}-accent:light-dark(oklch(0.5 0.16 265),oklch(0.78 0.12 265));
--vibeui-${name}-on-accent:oklch(from var(--vibeui-${name}-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-${name}-radius:0.625rem;
--vibeui-${name}-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="${name}"]{color-scheme:dark}
[data-vibeui-block="${name}"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;
background:var(--vibeui-${name}-bg);color:var(--vibeui-${name}-fg);
font-family:var(--vibeui-${name}-font);
}
[data-vibeui-block="${name}"] *{box-sizing:border-box}
/* Подпись кнопки настраивается и переводится, поэтому высота набирается
   содержимым: фиксированная обрезала бы длинный вариант. */
[data-vibeui-block="${name}"] [data-part="action"]{
appearance:none;border:0;cursor:pointer;align-self:flex-start;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.25rem;padding:0.3125rem 0.875rem;border-radius:var(--vibeui-${name}-radius);
background:var(--vibeui-${name}-accent);color:var(--vibeui-${name}-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="${name}"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-${name}-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="${name}"] *{animation:none!important;transition:none!important}}
\`

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * TODO: что это за компонент, одним предложением.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function ${symbol}({
  label = "TODO",
  accent,
  background = "",
  className,
  style,
  ...props
}: ${symbol}Props) {
  const palette = {
    ...(accent ? { "--vibeui-${name}-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-${name}-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-${name}" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="${name}"
        className={className}
        style={palette}
      >
        <button type="button" data-part="action">
          {label}
        </button>
      </div>
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
