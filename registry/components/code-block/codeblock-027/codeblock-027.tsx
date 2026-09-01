import type { CSSProperties } from "react"

export type Codeblock027Frame = {
  fn: string
  file: string
  line: number
  column: number
  vendor?: boolean
  source?: string
}

export type Codeblock027Props = {
  errorName?: string
  message?: string
  frames?: Codeblock027Frame[]
  className?: string
  style?: CSSProperties
}

// Идея компонента: стек как список, а не как простыня текста. Свой код стоит
// первым и раскрыт, кадры из node_modules свёрнуты в details — читатель видит
// строку, до которой ему есть дело, а не пятнадцать чужих.
const STYLES = `
:where([data-vibeui-block="codeblock-027"]){
--vibeui-codeblock-027-bg:oklch(0.19 0.016 20);
--vibeui-codeblock-027-head:oklch(0.26 0.06 22);
--vibeui-codeblock-027-fg:oklch(0.94 0.008 20);
--vibeui-codeblock-027-muted:oklch(0.66 0.016 20);
--vibeui-codeblock-027-dim:oklch(0.52 0.014 20);
--vibeui-codeblock-027-border:oklch(1 0 0 / 12%);
--vibeui-codeblock-027-bad:oklch(0.75 0.19 25);
--vibeui-codeblock-027-mark:oklch(0.55 0.18 25 / 26%);
--vibeui-codeblock-027-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-027-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="codeblock-027"]{
display:flex;flex-direction:column;
width:100%;max-width:34rem;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-codeblock-027-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-027-bg);color:var(--vibeui-codeblock-027-fg);
font-family:var(--vibeui-codeblock-027-font);
}
[data-vibeui-block="codeblock-027"] [data-part="head"]{
padding:0.625rem 0.875rem;
background:var(--vibeui-codeblock-027-head);
border-bottom:1px solid var(--vibeui-codeblock-027-border);
border-left:0.1875rem solid var(--vibeui-codeblock-027-bad);
}
[data-vibeui-block="codeblock-027"] [data-part="name"]{
display:block;font-family:var(--vibeui-codeblock-027-mono);
font-size:0.75rem;font-weight:700;letter-spacing:0.02em;
color:var(--vibeui-codeblock-027-bad);
}
[data-vibeui-block="codeblock-027"] [data-part="message"]{
display:block;margin-top:0.1875rem;
font-size:0.8125rem;line-height:1.45;
}
[data-vibeui-block="codeblock-027"] ol{
margin:0;padding:0.375rem 0;list-style:none;
}
[data-vibeui-block="codeblock-027"] li{
display:block;padding:0.25rem 0.875rem;
font-family:var(--vibeui-codeblock-027-mono);font-size:0.75rem;line-height:1.6;
}
[data-vibeui-block="codeblock-027"] [data-part="fn"]{
color:var(--vibeui-codeblock-027-fg);
}
[data-vibeui-block="codeblock-027"] [data-part="at"]{
display:block;color:var(--vibeui-codeblock-027-muted);
}
/* Первый кадр — единственный, у которого показан исходник: остальные строки
   всё равно нечем чинить, а выдержка из каждого превратит стек в листинг. */
[data-vibeui-block="codeblock-027"] [data-part="source"]{
display:block;margin-top:0.25rem;padding:0.25rem 0.5rem;
border-radius:0.375rem;border-left:0.125rem solid var(--vibeui-codeblock-027-bad);
background:var(--vibeui-codeblock-027-mark);
white-space:pre;overflow-x:auto;
}
[data-vibeui-block="codeblock-027"] li[data-vendor="true"]{
color:var(--vibeui-codeblock-027-dim);
}
[data-vibeui-block="codeblock-027"] li[data-vendor="true"] [data-part="fn"],
[data-vibeui-block="codeblock-027"] li[data-vendor="true"] [data-part="at"]{
color:var(--vibeui-codeblock-027-dim);
}
[data-vibeui-block="codeblock-027"] summary{
cursor:pointer;list-style:none;
padding:0.4375rem 0.875rem;
border-top:1px solid var(--vibeui-codeblock-027-border);
font-size:0.6875rem;font-weight:650;color:var(--vibeui-codeblock-027-muted);
transition:color .16s ease,background-color .16s ease;
}
[data-vibeui-block="codeblock-027"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="codeblock-027"] summary::before{content:"▸ ";display:inline-block;transition:transform .18s ease}
[data-vibeui-block="codeblock-027"] details[open] summary::before{content:"▾ "}
[data-vibeui-block="codeblock-027"] summary:hover{color:var(--vibeui-codeblock-027-fg);background:oklch(1 0 0 / 5%)}
[data-vibeui-block="codeblock-027"] summary:focus-visible{
outline:2px solid var(--vibeui-codeblock-027-bad);outline-offset:-2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="codeblock-027"] *{animation:none!important;transition:none!important}}
`

const FRAMES: Codeblock027Frame[] = [
  {
    fn: "cartTotal",
    file: "lib/total.ts",
    line: 12,
    column: 28,
    source: "sum + item.price * item.count",
  },
  { fn: "CartSummary", file: "components/cart.tsx", line: 34, column: 10 },
  {
    fn: "renderWithHooks",
    file: "node_modules/react-dom/cjs/react-dom.development.js",
    line: 15008,
    column: 18,
    vendor: true,
  },
  {
    fn: "beginWork",
    file: "node_modules/react-dom/cjs/react-dom.development.js",
    line: 19146,
    column: 16,
    vendor: true,
  },
  {
    fn: "performUnitOfWork",
    file: "node_modules/react-dom/cjs/react-dom.development.js",
    line: 25738,
    column: 12,
    vendor: true,
  },
]

/** Ошибка выполнения со стеком: свой код раскрыт, чужой свёрнут. */
export function Codeblock027({
  errorName = "TypeError",
  message = "Cannot read properties of undefined (reading 'price')",
  frames = FRAMES,
  className,
  style,
}: Codeblock027Props) {
  const own = frames.filter((frame) => !frame.vendor)
  const vendor = frames.filter((frame) => frame.vendor)

  const renderFrame = (frame: Codeblock027Frame) => (
    <li key={`${frame.file}:${frame.line}`} data-vendor={frame.vendor}>
      <span data-part="fn">{frame.fn}</span>
      <span data-part="at">
        {frame.file}:{frame.line}:{frame.column}
      </span>
      {frame.source ? <span data-part="source">{frame.source}</span> : null}
    </li>
  )

  return (
    <>
      <style href="vibeui-codeblock-027" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="codeblock-027"
        className={className}
        style={style}
        aria-label={`Ошибка выполнения: ${errorName}`}
      >
        <div data-part="head">
          <span data-part="name">{errorName}</span>
          <span data-part="message">{message}</span>
        </div>
        <ol>{own.map(renderFrame)}</ol>
        {vendor.length > 0 ? (
          <details>
            <summary>Кадры из node_modules ({vendor.length})</summary>
            <ol>{vendor.map(renderFrame)}</ol>
          </details>
        ) : null}
      </section>
    </>
  )
}
