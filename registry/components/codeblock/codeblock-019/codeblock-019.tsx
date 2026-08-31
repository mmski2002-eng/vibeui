import type { CSSProperties } from "react"

export type Codeblock019Mark = {
  line: number
  name: string
  kind: string
}

export type Codeblock019Props = {
  path?: string
  maxHeight?: number
  idPrefix?: string
  lines?: string[]
  outline?: Codeblock019Mark[]
  className?: string
  style?: CSSProperties
}

// Идея компонента: длинный файл, по которому можно ходить. Слева оглавление
// объявлений, справа прокручиваемый листинг; переходы — обычные якоря, поэтому
// работают без JS, а строка-цель подсвечивается через :target.
const STYLES = `
:where([data-vibeui-block="codeblock-019"]){
--vibeui-codeblock-019-bg:oklch(0.19 0.018 240);
--vibeui-codeblock-019-side:oklch(0.23 0.02 240);
--vibeui-codeblock-019-fg:oklch(0.93 0.008 240);
--vibeui-codeblock-019-muted:oklch(0.66 0.016 240);
--vibeui-codeblock-019-gutter:oklch(0.5 0.02 240);
--vibeui-codeblock-019-border:oklch(1 0 0 / 12%);
--vibeui-codeblock-019-accent:oklch(0.82 0.13 200);
--vibeui-codeblock-019-target:oklch(0.6 0.12 200 / 22%);
--vibeui-codeblock-019-height:14rem;
--vibeui-codeblock-019-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="codeblock-019"]{
display:block;width:100%;max-width:38rem;box-sizing:border-box;margin:0;
overflow:hidden;border:1px solid var(--vibeui-codeblock-019-border);
border-radius:0.75rem;
background:var(--vibeui-codeblock-019-bg);color:var(--vibeui-codeblock-019-fg);
font-family:var(--vibeui-codeblock-019-font);
}
[data-vibeui-block="codeblock-019"] [data-part="shell"]{
display:grid;grid-template-columns:1fr;
}
[data-vibeui-block="codeblock-019"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;
gap:0.75rem;padding:0.5rem 0.875rem;
background:var(--vibeui-codeblock-019-side);
border-bottom:1px solid var(--vibeui-codeblock-019-border);
font-family:var(--vibeui-codeblock-019-mono);font-size:0.75rem;
color:var(--vibeui-codeblock-019-muted);
}
[data-vibeui-block="codeblock-019"] nav{
background:var(--vibeui-codeblock-019-side);
border-bottom:1px solid var(--vibeui-codeblock-019-border);
}
[data-vibeui-block="codeblock-019"] ol{
margin:0;padding:0.375rem;list-style:none;
display:flex;flex-wrap:wrap;gap:0.125rem;
}
[data-vibeui-block="codeblock-019"] a{
display:flex;align-items:baseline;gap:0.375rem;
padding:0.25rem 0.5rem;border-radius:0.375rem;
color:var(--vibeui-codeblock-019-muted);text-decoration:none;
font-family:var(--vibeui-codeblock-019-mono);font-size:0.75rem;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="codeblock-019"] a:hover{
background:oklch(1 0 0 / 8%);color:var(--vibeui-codeblock-019-fg);
}
[data-vibeui-block="codeblock-019"] a:focus-visible{
outline:2px solid var(--vibeui-codeblock-019-accent);outline-offset:2px;
}
[data-vibeui-block="codeblock-019"] [data-part="kind"]{
color:var(--vibeui-codeblock-019-accent);font-size:0.625rem;
text-transform:uppercase;letter-spacing:0.06em;
}
[data-vibeui-block="codeblock-019"] [data-part="at"]{
margin-inline-start:auto;color:var(--vibeui-codeblock-019-gutter);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="codeblock-019"] [data-part="scroller"]{
max-height:var(--vibeui-codeblock-019-height);overflow:auto;
scroll-behavior:smooth;overscroll-behavior:contain;
}
[data-vibeui-block="codeblock-019"] [data-part="scroller"]:focus-visible{
outline:2px solid var(--vibeui-codeblock-019-accent);outline-offset:-2px;
}
[data-vibeui-block="codeblock-019"] pre{margin:0;padding:0.625rem 0}
[data-vibeui-block="codeblock-019"] code{
display:block;min-width:max-content;
font-family:var(--vibeui-codeblock-019-mono);
font-size:0.8125rem;line-height:1.7;white-space:pre;
counter-reset:line;
}
[data-vibeui-block="codeblock-019"] [data-part="row"]{
display:block;position:relative;padding:0 0.875rem 0 3rem;min-height:1.7em;
scroll-margin-top:0.625rem;
}
[data-vibeui-block="codeblock-019"] [data-part="row"]::before{
counter-increment:line;content:counter(line);
position:absolute;left:0;width:2.25rem;text-align:right;
color:var(--vibeui-codeblock-019-gutter);font-variant-numeric:tabular-nums;
user-select:none;-webkit-user-select:none;pointer-events:none;
}
/* Строка-цель подсвечивается штатным :target: состояние живёт в адресе,
   а не в JS, поэтому ссылкой на строку можно поделиться. */
[data-vibeui-block="codeblock-019"] [data-part="row"]:target{
background:var(--vibeui-codeblock-019-target);
box-shadow:inset 0.1875rem 0 0 var(--vibeui-codeblock-019-accent);
}
@container (min-width: 32rem){
[data-vibeui-block="codeblock-019"] [data-part="shell"]{grid-template-columns:12rem 1fr}
[data-vibeui-block="codeblock-019"] nav{
border-bottom:0;border-right:1px solid var(--vibeui-codeblock-019-border);
}
[data-vibeui-block="codeblock-019"] ol{flex-direction:column;flex-wrap:nowrap}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="codeblock-019"] *{animation:none!important;transition:none!important}
[data-vibeui-block="codeblock-019"] [data-part="scroller"]{scroll-behavior:auto}
}
`

const LINES = [
  "import { db } from '@/lib/db'",
  "",
  "export async function addToCart(id: string) {",
  "  await db.cart.add(id)",
  "}",
  "",
  "export async function removeFromCart(id: string) {",
  "  await db.cart.remove(id)",
  "}",
  "",
  "export async function clearCart() {",
  "  await db.cart.clear()",
  "}",
  "",
  "export const CART_LIMIT = 50",
]

const OUTLINE: Codeblock019Mark[] = [
  { line: 3, name: "addToCart", kind: "fn" },
  { line: 7, name: "removeFromCart", kind: "fn" },
  { line: 11, name: "clearCart", kind: "fn" },
  { line: 15, name: "CART_LIMIT", kind: "const" },
]

/** Длинный листинг с оглавлением объявлений и переходом по якорям. */
export function Codeblock019({
  path = "app/actions.ts",
  maxHeight = 14,
  idPrefix = "codeblock-019",
  lines = LINES,
  outline = OUTLINE,
  className,
  style,
}: Codeblock019Props) {
  const palette = {
    "--vibeui-codeblock-019-height": `${maxHeight}rem`,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-codeblock-019" precedence="medium">
        {STYLES}
      </style>
      <figure
        data-vibeui-block="codeblock-019"
        className={className}
        style={palette}
      >
        <figcaption data-part="head">
          <span>{path}</span>
          <span>{lines.length} строк</span>
        </figcaption>
        <div data-part="shell">
          <nav aria-label="Оглавление листинга">
            <ol>
              {outline.map((mark) => (
                <li key={mark.name}>
                  <a href={`#${idPrefix}-line-${mark.line}`}>
                    <span data-part="kind">{mark.kind}</span>
                    {mark.name}
                    <span data-part="at">{mark.line}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div
            data-part="scroller"
            tabIndex={0}
            role="region"
            aria-label={`Код файла ${path}`}
          >
            <pre>
              <code>
                {lines.map((line, index) => (
                  <span
                    key={index}
                    data-part="row"
                    id={`${idPrefix}-line-${index + 1}`}
                  >
                    {line}
                  </span>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </figure>
    </>
  )
}
