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
  className?: string
  style?: CSSProperties
}

// Идея компонента: JSON, который можно разбирать по частям. Каждый объект и
// массив — нативный details, поэтому раскрытие работает без JS, переживает
// поиск по странице и не требует хранить состояние дерева.
const STYLES = `
:where([data-vibeui-block="codeblock-021"]){
--vibeui-codeblock-021-bg:oklch(0.99 0.003 250);
--vibeui-codeblock-021-head:oklch(0.96 0.006 250);
--vibeui-codeblock-021-fg:oklch(0.28 0.014 250);
--vibeui-codeblock-021-muted:oklch(0.55 0.012 250);
--vibeui-codeblock-021-border:oklch(0.89 0.008 250);
--vibeui-codeblock-021-key:oklch(0.45 0.14 265);
--vibeui-codeblock-021-string:oklch(0.48 0.14 150);
--vibeui-codeblock-021-number:oklch(0.55 0.16 45);
--vibeui-codeblock-021-bool:oklch(0.5 0.17 320);
--vibeui-codeblock-021-null:oklch(0.6 0.01 250);
--vibeui-codeblock-021-accent:oklch(0.5 0.14 265);
--vibeui-codeblock-021-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-021-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="codeblock-021"]{
display:flex;flex-direction:column;
width:100%;max-width:30rem;box-sizing:border-box;margin:0;overflow:hidden;
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
[data-vibeui-block="codeblock-021"] summary:hover{background:oklch(0.5 0.14 265 / 8%)}
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

/** JSON-дерево с раскрытием вложенных узлов через нативный details. */
export function Codeblock021({
  rootLabel = "response",
  openDepth = 2,
  data = DATA,
  className,
  style,
}: Codeblock021Props) {
  return (
    <>
      <style href="vibeui-codeblock-021" precedence="medium">
        {STYLES}
      </style>
      <figure
        data-vibeui-block="codeblock-021"
        className={className}
        style={style}
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
