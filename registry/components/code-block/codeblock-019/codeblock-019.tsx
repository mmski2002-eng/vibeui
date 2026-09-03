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
  /** Счётчик строк в шапке, {count} — их число. */
  countText?: string
  /** Подпись оглавления для скринридера. */
  outlineLabel?: string
  /** Подпись области кода для скринридера, {path} — путь к файлу. */
  codeLabel?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: длинный файл, по которому можно ходить. Слева оглавление
// объявлений, справа прокручиваемый листинг; переходы — обычные якоря, поэтому
// работают без JS, а строка-цель подсвечивается через :target.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// нет, подсветка строки-цели подобрана отдельно для светлой и тёмной ветки.
const STYLES = `
:where([data-vibeui-block="codeblock-019"]){
--vibeui-codeblock-019-bg:transparent;
--vibeui-codeblock-019-side:light-dark(oklch(0 0 0 / 4%),oklch(1 0 0 / 5%));
--vibeui-codeblock-019-hover:light-dark(oklch(0 0 0 / 6%),oklch(1 0 0 / 8%));
--vibeui-codeblock-019-fg:light-dark(oklch(0.26 0.018 240),oklch(0.93 0.008 240));
--vibeui-codeblock-019-muted:color-mix(in oklab,var(--vibeui-codeblock-019-fg) 68%,transparent);
--vibeui-codeblock-019-gutter:light-dark(oklch(0.63 0.02 240),oklch(0.5 0.02 240));
--vibeui-codeblock-019-border:light-dark(oklch(0 0 0 / 12%),oklch(1 0 0 / 12%));
--vibeui-codeblock-019-accent:light-dark(oklch(0.5 0.13 200),oklch(0.82 0.13 200));
--vibeui-codeblock-019-target:light-dark(oklch(0.7 0.12 200 / 24%),oklch(0.6 0.12 200 / 22%));
--vibeui-codeblock-019-height:14rem;
--vibeui-codeblock-019-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="codeblock-019"]{color-scheme:dark}
[data-vibeui-block="codeblock-019"]{
display:block;width:100%;box-sizing:border-box;margin:0;
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
background:var(--vibeui-codeblock-019-hover);color:var(--vibeui-codeblock-019-fg);
}
[data-vibeui-block="codeblock-019"] a:focus-visible{
outline:2px solid var(--vibeui-codeblock-019-accent);outline-offset:2px;
}
[data-vibeui-block="codeblock-019"] [data-part="kind"]{
color:var(--vibeui-codeblock-019-accent);font-size:0.6875rem;
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

/** Длинный листинг с оглавлением объявлений и переходом по якорям. */
export function Codeblock019({
  path = "app/actions.ts",
  maxHeight = 14,
  idPrefix = "codeblock-019",
  lines = LINES,
  outline = OUTLINE,
  countText = "{count} строк",
  outlineLabel = "Оглавление листинга",
  codeLabel = "Код файла {path}",
  background = "",
  className,
  style,
  ...props
}: Codeblock019Props) {
  const palette = {
    "--vibeui-codeblock-019-height": `${maxHeight}rem`,
    ...(background
      ? {
          "--vibeui-codeblock-019-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-codeblock-019" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="code-block"
        data-vibeui-block="codeblock-019"
        className={className}
        style={palette}
      >
        <figcaption data-part="head">
          <span>{path}</span>
          <span>{countText.replace("{count}", String(lines.length))}</span>
        </figcaption>
        <div data-part="shell">
          <nav aria-label={outlineLabel}>
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
            aria-label={codeLabel.replace("{path}", path)}
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
