import type { CSSProperties } from "react"

export type Codeblock021Value =
  | string
  | number
  | boolean
  | null
  | Codeblock021Value[]
  | { [key: string]: Codeblock021Value }

export type Codeblock021Props = {
  rootLabel?: string
  openDepth?: number
  data?: Codeblock021Value
  /** Пусто — подложки нет, дерево лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: JSON, который можно разбирать по частям. Каждый объект и
// массив — нативный details, поэтому раскрытие работает без JS, переживает
// поиск по странице и не требует хранить состояние дерева.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// нет, цвета токенов подобраны отдельно для светлой и тёмной ветки.
const STYLES = `
:where([data-vibeui-block="codeblock-021"]){
--vibeui-codeblock-021-bg:transparent;
--vibeui-codeblock-021-head:light-dark(oklch(0 0 0 / 4%),oklch(1 0 0 / 5%));
--vibeui-codeblock-021-hover:light-dark(oklch(0.5 0.14 265 / 8%),oklch(0.75 0.13 265 / 14%));
--vibeui-codeblock-021-fg:light-dark(oklch(0.28 0.014 250),oklch(0.93 0.008 250));
--vibeui-codeblock-021-muted:color-mix(in oklab,var(--vibeui-codeblock-021-fg) 68%,transparent);
--vibeui-codeblock-021-border:light-dark(oklch(0.89 0.008 250),oklch(1 0 0 / 13%));
--vibeui-codeblock-021-key:light-dark(oklch(0.45 0.14 265),oklch(0.8 0.12 265));
--vibeui-codeblock-021-string:light-dark(oklch(0.48 0.14 150),oklch(0.83 0.12 150));
--vibeui-codeblock-021-number:light-dark(oklch(0.55 0.16 45),oklch(0.84 0.12 60));
--vibeui-codeblock-021-bool:light-dark(oklch(0.5 0.17 320),oklch(0.81 0.13 320));
--vibeui-codeblock-021-null:light-dark(oklch(0.6 0.01 250),oklch(0.62 0.012 250));
--vibeui-codeblock-021-accent:light-dark(oklch(0.5 0.14 265),oklch(0.8 0.13 265));
--vibeui-codeblock-021-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-021-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="codeblock-021"]{color-scheme:dark}
[data-vibeui-block="codeblock-021"]{
display:flex;flex-direction:column;
width:100%;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-codeblock-021-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-021-bg);color:var(--vibeui-codeblock-021-fg);
font-family:var(--vibeui-codeblock-021-font);
}
[data-vibeui-block="codeblock-021"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.5rem 0.875rem;
background:var(--vibeui-codeblock-021-head);
border-bottom:1px solid var(--vibeui-codeblock-021-border);
font-family:var(--vibeui-codeblock-021-mono);font-size:0.75rem;
color:var(--vibeui-codeblock-021-muted);
}
[data-vibeui-block="codeblock-021"] [data-part="tree"]{
padding:0.625rem 0.875rem;overflow-x:auto;
font-family:var(--vibeui-codeblock-021-mono);
font-size:0.8125rem;line-height:1.7;
}
[data-vibeui-block="codeblock-021"] [data-part="children"]{
padding-inline-start:1.125rem;
border-inline-start:1px solid var(--vibeui-codeblock-021-border);
margin-inline-start:0.3125rem;
}
[data-vibeui-block="codeblock-021"] summary{
cursor:pointer;list-style:none;display:flex;align-items:center;gap:0.25rem;
border-radius:0.25rem;
}
[data-vibeui-block="codeblock-021"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="codeblock-021"] summary::before{
content:"▸";flex:none;width:0.75rem;
color:var(--vibeui-codeblock-021-muted);
transition:transform .16s ease;
user-select:none;-webkit-user-select:none;
}
[data-vibeui-block="codeblock-021"] details[open] > summary::before{transform:rotate(90deg)}
[data-vibeui-block="codeblock-021"] summary:hover{background:var(--vibeui-codeblock-021-hover)}
[data-vibeui-block="codeblock-021"] summary:focus-visible{
outline:2px solid var(--vibeui-codeblock-021-accent);outline-offset:1px;
}
/* Свёрнутый узел показывает, сколько в нём полей: без этого закрытая ветка
   ничем не отличается от пустой. Развёрнутый — прячет счётчик и хвост. */
[data-vibeui-block="codeblock-021"] [data-part="count"]{
color:var(--vibeui-codeblock-021-muted);font-size:0.75rem;
}
[data-vibeui-block="codeblock-021"] details[open] > summary [data-part="tail"],
[data-vibeui-block="codeblock-021"] details[open] > summary [data-part="count"]{display:none}
[data-vibeui-block="codeblock-021"] details:not([open]) > [data-part="children"],
[data-vibeui-block="codeblock-021"] details:not([open]) > [data-part="close"]{display:none}
[data-vibeui-block="codeblock-021"] [data-part="close"]{padding-inline-start:1rem}
[data-vibeui-block="codeblock-021"] [data-part="leaf"]{padding-inline-start:1rem}
[data-vibeui-block="codeblock-021"] [data-token="key"]{color:var(--vibeui-codeblock-021-key)}
[data-vibeui-block="codeblock-021"] [data-token="string"]{color:var(--vibeui-codeblock-021-string)}
[data-vibeui-block="codeblock-021"] [data-token="number"]{color:var(--vibeui-codeblock-021-number)}
[data-vibeui-block="codeblock-021"] [data-token="bool"]{color:var(--vibeui-codeblock-021-bool)}
[data-vibeui-block="codeblock-021"] [data-token="null"]{color:var(--vibeui-codeblock-021-null)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="codeblock-021"] *{animation:none!important;transition:none!important}}
`

const DATA: Codeblock021Value = {
  ok: true,
  user: {
    id: 42,
    name: "Ада",
    roles: ["admin", "editor"],
    lastSeen: null,
  },
  items: [{ sku: "vb-001", price: 1290 }],
}

function isBranch(
  value: Codeblock021Value,
): value is Codeblock021Value[] | { [key: string]: Codeblock021Value } {
  return typeof value === "object" && value !== null
}

function leafToken(value: Codeblock021Value) {
  if (value === null) return "null"
  if (typeof value === "string") return "string"
  if (typeof value === "number") return "number"
  return "bool"
}

function leafText(value: Codeblock021Value) {
  return typeof value === "string" ? `"${value}"` : String(value)
}

function Node({
  label,
  quoted,
  value,
  depth,
  openDepth,
  last,
}: {
  label?: string
  quoted?: boolean
  value: Codeblock021Value
  depth: number
  openDepth: number
  last: boolean
}) {
  const prefix = label ? (
    <>
      <span data-token="key">{quoted ? `"${label}"` : label}</span>
      {": "}
    </>
  ) : null

  if (!isBranch(value)) {
    return (
      <div data-part="leaf">
        {prefix}
        <span data-token={leafToken(value)}>{leafText(value)}</span>
        {last ? null : ","}
      </div>
    )
  }

  const array = Array.isArray(value)
  const entries: [string, Codeblock021Value][] = array
    ? value.map((item, index) => [String(index), item])
    : Object.entries(value)
  const open = array ? "[" : "{"
  const close = array ? "]" : "}"

  return (
    <details open={depth < openDepth}>
      <summary>
        {prefix}
        {open}
        <span data-part="count">{entries.length}</span>
        <span data-part="tail">
          {close}
          {last ? "" : ","}
        </span>
      </summary>
      <div data-part="children">
        {entries.map(([key, item], index) => (
          <Node
            key={key}
            label={key}
            quoted={!array}
            value={item}
            depth={depth + 1}
            openDepth={openDepth}
            last={index === entries.length - 1}
          />
        ))}
      </div>
      <div data-part="close">
        {close}
        {last ? "" : ","}
      </div>
    </details>
  )
}

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

/** JSON-дерево с раскрытием вложенных узлов через нативный details. */
export function Codeblock021({
  rootLabel = "response",
  openDepth = 2,
  data = DATA,
  background = "",
  className,
  style,
  ...props
}: Codeblock021Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-codeblock-021-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-codeblock-021" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="code-block"
        data-vibeui-block="codeblock-021"
        className={className}
        style={palette}
      >
        <figcaption data-part="head">
          <span>{rootLabel}.json</span>
          <span>application/json</span>
        </figcaption>
        <div data-part="tree">
          <Node value={data} depth={0} openDepth={openDepth} last />
        </div>
      </figure>
    </>
  )
}
