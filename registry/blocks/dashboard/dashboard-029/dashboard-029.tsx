import type { CSSProperties } from "react"

export type Dashboard029Node = {
  name: string
  kind: "folder" | "file"
  size?: string
  changed?: string
  children?: Dashboard029Node[]
  open?: boolean
  active?: boolean
}

export type Dashboard029Fact = {
  label: string
  value: string
}

export type Dashboard029Props = {
  title?: string
  path?: string
  tree?: Dashboard029Node[]
  fileName?: string
  fileText?: string
  facts?: Dashboard029Fact[]
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Подпись дерева для скринридера. */
  treeLabel?: string
  /** Шаблон подписи предпросмотра: {name}. */
  previewAriaText?: string
  /** Подпись кнопки скачивания. */
  downloadText?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: файловый экран, где дерево собрано на вложенных details.
// Раскрытие папки — состояние браузера, а не стор: клавиатура, память
// прокрутки и печать работают сами. Папка и файл различаются формой значка,
// а не только отступом: на третьем уровне отступ перестаёт читаться.
// Предпросмотр показывает начало файла моноширинным и рядом кладёт факты —
// размер и дату, потому что «этот ли файл» решают по ним, а не по тексту.
const STYLES = `
:where([data-vibeui-block="dashboard-029"]){
--vibeui-dashboard-029-bg:transparent;
--vibeui-dashboard-029-panel:light-dark(oklch(0.985 0.003 265),oklch(0.27 0.012 265));
/* Подсветка строки под курсором: подложка бывает прозрачной, и подсветить
   строку фоном блока тогда нечем. */
--vibeui-dashboard-029-hover:light-dark(oklch(1 0 0),oklch(0.33 0.012 265));
--vibeui-dashboard-029-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-dashboard-029-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-dashboard-029-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.011 265));
--vibeui-dashboard-029-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-dashboard-029-pick:light-dark(oklch(0.96 0.02 262),oklch(0.36 0.055 262));
--vibeui-dashboard-029-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-dashboard-029-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
container-type:inline-size;
}
[data-vibeui-block="dashboard-029"]{
box-sizing:border-box;
background:var(--vibeui-dashboard-029-bg);
color:var(--vibeui-dashboard-029-fg);
font-family:var(--vibeui-dashboard-029-sans);
border:1px solid var(--vibeui-dashboard-029-border);border-radius:1rem;
}
[data-vibeui-block="dashboard-029"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-029"] [data-part="shell"]{
display:grid;grid-template-columns:1fr;gap:1rem;padding:1.125rem;
}
[data-vibeui-block="dashboard-029"] [data-part="bar"]{
grid-column:1 / -1;display:flex;flex-wrap:wrap;align-items:baseline;gap:0.375rem 0.75rem;
}
[data-vibeui-block="dashboard-029"] h2{margin:0;font-size:1.0625rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-029"] [data-part="path"]{
margin:0;font-family:var(--vibeui-dashboard-029-mono);font-size:0.6875rem;
color:var(--vibeui-dashboard-029-muted);overflow-wrap:anywhere;
}
[data-vibeui-block="dashboard-029"] [data-part="tree"]{
background:var(--vibeui-dashboard-029-panel);
border:1px solid var(--vibeui-dashboard-029-border);border-radius:0.875rem;
padding:0.625rem;max-height:20rem;overflow:auto;
}
[data-vibeui-block="dashboard-029"] ul{list-style:none;margin:0;padding:0}
[data-vibeui-block="dashboard-029"] [data-part="tree"] ul ul{
margin-left:0.5rem;padding-left:0.5rem;
border-left:1px solid var(--vibeui-dashboard-029-border);
}
[data-vibeui-block="dashboard-029"] summary,
[data-vibeui-block="dashboard-029"] [data-part="file"]{
display:flex;align-items:center;gap:0.4375rem;
padding:0.25rem 0.375rem;border-radius:0.375rem;
font-size:0.75rem;list-style:none;cursor:pointer;
}
[data-vibeui-block="dashboard-029"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="dashboard-029"] summary:hover,
[data-vibeui-block="dashboard-029"] [data-part="file"]:hover{background:var(--vibeui-dashboard-029-hover)}
[data-vibeui-block="dashboard-029"] [data-active="true"]{
background:var(--vibeui-dashboard-029-pick);font-weight:650;
}
/* Форма значка, а не отступ: на третьем уровне отступ уже не читается. */
[data-vibeui-block="dashboard-029"] [data-part="glyph"]{
width:0.75rem;height:0.625rem;flex:none;border-radius:0.125rem 0.25rem 0.125rem 0.125rem;
background:color-mix(in oklab,var(--vibeui-dashboard-029-accent) 25%,white);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-dashboard-029-accent) 45%,white);
}
[data-vibeui-block="dashboard-029"] [data-part="file"] [data-part="glyph"]{
width:0.625rem;height:0.75rem;border-radius:0.125rem;
background:none;
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-029-border);
}
[data-vibeui-block="dashboard-029"] [data-part="size"]{
margin-left:auto;font-size:0.625rem;color:var(--vibeui-dashboard-029-muted);
font-variant-numeric:tabular-nums;white-space:nowrap;
}
[data-vibeui-block="dashboard-029"] [data-part="view"]{
border:1px solid var(--vibeui-dashboard-029-border);border-radius:0.875rem;overflow:hidden;
}
[data-vibeui-block="dashboard-029"] [data-part="viewhead"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.625rem 0.75rem;border-bottom:1px solid var(--vibeui-dashboard-029-border);
background:var(--vibeui-dashboard-029-panel);
}
[data-vibeui-block="dashboard-029"] h3{
margin:0;font-family:var(--vibeui-dashboard-029-mono);font-size:0.8125rem;font-weight:650;
overflow-wrap:anywhere;
}
[data-vibeui-block="dashboard-029"] [data-part="download"]{
margin-left:auto;appearance:none;cursor:pointer;font:inherit;font-size:0.6875rem;font-weight:650;
padding:0.3125rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-029-border);
background:var(--vibeui-dashboard-029-hover);color:inherit;
}
[data-vibeui-block="dashboard-029"] pre{
margin:0;padding:0.75rem;max-height:12rem;overflow:auto;
font-family:var(--vibeui-dashboard-029-mono);font-size:0.6875rem;line-height:1.55;
}
[data-vibeui-block="dashboard-029"] dl{
display:grid;grid-template-columns:auto 1fr;gap:0.25rem 0.75rem;margin:0;
padding:0.625rem 0.75rem;border-top:1px solid var(--vibeui-dashboard-029-border);
font-size:0.6875rem;
}
[data-vibeui-block="dashboard-029"] dt{color:var(--vibeui-dashboard-029-muted);white-space:nowrap}
[data-vibeui-block="dashboard-029"] dd{margin:0;font-weight:600;overflow-wrap:anywhere}
[data-vibeui-block="dashboard-029"] :is(summary,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-029-accent);outline-offset:1px;
}
@container (min-width: 46rem){
[data-vibeui-block="dashboard-029"] [data-part="shell"]{grid-template-columns:15rem 1fr;padding:1.375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-029"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TREE: Dashboard029Node[] = [
  {
    name: "registry",
    kind: "folder",
    open: true,
    children: [
      {
        name: "blocks",
        kind: "folder",
        open: true,
        children: [
          {
            name: "dashboard",
            kind: "folder",
            open: true,
            children: [
              {
                name: "registry.json",
                kind: "file",
                size: "184 КБ",
                active: true,
              },
              { name: "dashboard-029.tsx", kind: "file", size: "9 КБ" },
            ],
          },
          { name: "hero", kind: "folder", children: [] },
        ],
      },
      { name: "index.ts", kind: "file", size: "2 КБ" },
    ],
  },
  {
    name: "public",
    kind: "folder",
    children: [{ name: "r", kind: "folder", children: [] }],
  },
  { name: "package.json", kind: "file", size: "1 КБ" },
]

const DEFAULT_FACTS: Dashboard029Fact[] = [
  { label: "Размер", value: "184 КБ" },
  { label: "Изменён", value: "сегодня, 14:22 · Анна Реброва" },
  { label: "Тип", value: "application/json" },
  { label: "Версий", value: "37" },
]

const DEFAULT_TEXT = `{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "items": [
    {
      "name": "dashboard-029",
      "type": "registry:block",
      "title": "File Browser",
      "categories": ["dashboard"]
    }
  ]
}`

/**
 * Ветка темы для заданного фона: светлая подложка не должна доставаться
 * тексту тёмной ветки light-dark().
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

function renderNode(node: Dashboard029Node, key: string) {
  if (node.kind === "file") {
    return (
      <li key={key}>
        <span data-part="file" data-active={node.active ? "true" : "false"}>
          <span data-part="glyph" aria-hidden="true" />
          {node.name}
          {node.size ? <span data-part="size">{node.size}</span> : null}
        </span>
      </li>
    )
  }

  return (
    <li key={key}>
      <details open={node.open}>
        <summary>
          <span data-part="glyph" aria-hidden="true" />
          {node.name}
          <span data-part="size">{(node.children ?? []).length}</span>
        </summary>
        <ul>
          {(node.children ?? []).map((child) =>
            renderNode(child, `${key}/${child.name}`),
          )}
        </ul>
      </details>
    </li>
  )
}

/**
 * Файловый экран: дерево на вложенных details и предпросмотр с фактами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard029({
  title = "Файлы проекта",
  path = "registry / blocks / dashboard / registry.json",
  tree = DEFAULT_TREE,
  fileName = "registry.json",
  fileText = DEFAULT_TEXT,
  facts = DEFAULT_FACTS,
  accent,
  background = "",
  treeLabel = "Дерево файлов",
  previewAriaText = "Предпросмотр {name}",
  downloadText = "Скачать",
  className,
  style,
}: Dashboard029Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-029-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-029-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-029" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-029"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="bar">
            <h2>{title}</h2>
            <p data-part="path">{path}</p>
          </div>

          <nav data-part="tree" aria-label={treeLabel}>
            <ul>{tree.map((node) => renderNode(node, node.name))}</ul>
          </nav>

          <article
            data-part="view"
            aria-label={previewAriaText.replace("{name}", fileName)}
          >
            <header data-part="viewhead">
              <h3>{fileName}</h3>
              <button type="button" data-part="download">
                {downloadText}
              </button>
            </header>
            <pre>{fileText}</pre>
            <dl>
              {facts.map((fact) => (
                <div key={fact.label} style={{ display: "contents" }}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </article>
        </div>
      </section>
    </>
  )
}
