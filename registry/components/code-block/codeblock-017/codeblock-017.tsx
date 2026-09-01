import type { CSSProperties } from "react"

export type Codeblock017Props = {
  path?: string
  changedLine?: number
  agoLabel?: string
  lines?: string[]
  className?: string
  style?: CSSProperties
}

// Идея компонента: показать, что именно поменялось только что. Не диф целиком,
// а одна строка: она получает метку в поле номеров, подложку и короткую
// вспышку, которая гаснет сама и не оставляет мигающего элемента на экране.
const STYLES = `
:where([data-vibeui-block="codeblock-017"]){
--vibeui-codeblock-017-bg:oklch(0.2 0.016 150);
--vibeui-codeblock-017-head:oklch(0.24 0.02 150);
--vibeui-codeblock-017-fg:oklch(0.93 0.008 150);
--vibeui-codeblock-017-muted:oklch(0.67 0.016 150);
--vibeui-codeblock-017-gutter:oklch(0.52 0.02 150);
--vibeui-codeblock-017-border:oklch(1 0 0 / 12%);
--vibeui-codeblock-017-mark:oklch(0.82 0.15 152);
--vibeui-codeblock-017-tint:oklch(0.6 0.14 152 / 16%);
--vibeui-codeblock-017-flash:oklch(0.7 0.16 152 / 42%);
--vibeui-codeblock-017-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="codeblock-017"]{
display:flex;flex-direction:column;
width:100%;max-width:34rem;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-codeblock-017-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-017-bg);color:var(--vibeui-codeblock-017-fg);
font-family:var(--vibeui-codeblock-017-font);
}
[data-vibeui-block="codeblock-017"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.5rem 0.875rem;
background:var(--vibeui-codeblock-017-head);
border-bottom:1px solid var(--vibeui-codeblock-017-border);
font-size:0.75rem;color:var(--vibeui-codeblock-017-muted);
}
[data-vibeui-block="codeblock-017"] [data-part="path"]{
font-family:var(--vibeui-codeblock-017-mono);
}
[data-vibeui-block="codeblock-017"] [data-part="ago"]{
display:inline-flex;align-items:center;gap:0.375rem;flex:none;
color:var(--vibeui-codeblock-017-mark);font-weight:650;
}
[data-vibeui-block="codeblock-017"] [data-part="ago"]::before{
content:"";width:0.4375rem;height:0.4375rem;border-radius:50%;
background:currentColor;
}
[data-vibeui-block="codeblock-017"] pre{margin:0;padding:0.625rem 0;overflow-x:auto}
[data-vibeui-block="codeblock-017"] code{
display:block;min-width:max-content;
font-family:var(--vibeui-codeblock-017-mono);
font-size:0.8125rem;line-height:1.7;white-space:pre;
counter-reset:line;
}
[data-vibeui-block="codeblock-017"] [data-part="row"]{
display:block;position:relative;padding:0 0.875rem 0 3.25rem;
}
[data-vibeui-block="codeblock-017"] [data-part="row"]::before{
counter-increment:line;content:counter(line);
position:absolute;left:0;width:2.25rem;text-align:right;
color:var(--vibeui-codeblock-017-gutter);font-variant-numeric:tabular-nums;
user-select:none;-webkit-user-select:none;pointer-events:none;
}
/* Отметка в поле номеров живёт отдельно от подложки: цвет один читается
   плохо, а знак остаётся виден и в печати, и при дальтонизме. */
[data-vibeui-block="codeblock-017"] [data-part="row"][data-changed="true"]::after{
content:"▸";position:absolute;left:2.5rem;
color:var(--vibeui-codeblock-017-mark);
user-select:none;-webkit-user-select:none;pointer-events:none;
}
[data-vibeui-block="codeblock-017"] [data-part="row"][data-changed="true"]{
background:var(--vibeui-codeblock-017-tint);
box-shadow:inset 0.1875rem 0 0 var(--vibeui-codeblock-017-mark);
animation:vibeui-codeblock-017-flash 2.4s ease-out 1;
}
@keyframes vibeui-codeblock-017-flash{
from{background:var(--vibeui-codeblock-017-flash)}
to{background:var(--vibeui-codeblock-017-tint)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="codeblock-017"] *{animation:none!important;transition:none!important}}
`

const LINES = [
  "export function cartTotal(items: Item[]) {",
  "  return items.reduce(",
  "    (sum, item) => sum + item.price * item.count,",
  "    0,",
  "  )",
  "}",
]

/** Листинг с отметкой строки, изменённой последней правкой. */
export function Codeblock017({
  path = "components/cart.tsx",
  changedLine = 3,
  agoLabel = "изменено только что",
  lines = LINES,
  className,
  style,
}: Codeblock017Props) {
  return (
    <>
      <style href="vibeui-codeblock-017" precedence="medium">
        {STYLES}
      </style>
      <figure
        data-vibeui-block="codeblock-017"
        className={className}
        style={style}
      >
        <figcaption data-part="head">
          <span data-part="path">{path}</span>
          <span data-part="ago">{agoLabel}</span>
        </figcaption>
        <pre>
          <code>
            {lines.map((line, index) => (
              <span
                key={index}
                data-part="row"
                data-changed={index + 1 === changedLine || undefined}
                aria-current={index + 1 === changedLine ? "true" : undefined}
              >
                {line}
              </span>
            ))}
          </code>
        </pre>
      </figure>
    </>
  )
}
