import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Codeblock007Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children"
> & {
  path?: string
  message?: string
  errorFrom?: number
  errorTo?: number
  lines?: string[]
}

// Идея компонента: не просто подсветить строку, а сказать, что с ней не так.
// Диапазон помечен полосой слева и волнистым подчёркиванием, а под ним стоит
// выноска с текстом ошибки — читатель не ищет, куда смотреть.
const STYLES = `
:where([data-vibeui-block="codeblock-007"]){
--vibeui-codeblock-007-bg:oklch(0.2 0.014 30);
--vibeui-codeblock-007-head:oklch(0.24 0.018 30);
--vibeui-codeblock-007-fg:oklch(0.93 0.006 30);
--vibeui-codeblock-007-muted:oklch(0.66 0.014 30);
--vibeui-codeblock-007-gutter:oklch(0.5 0.02 30);
--vibeui-codeblock-007-border:oklch(1 0 0 / 13%);
--vibeui-codeblock-007-bad:oklch(0.72 0.19 25);
--vibeui-codeblock-007-bad-bg:oklch(0.55 0.18 25 / 20%);
--vibeui-codeblock-007-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="codeblock-007"]{
display:flex;flex-direction:column;
width:100%;max-width:34rem;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-codeblock-007-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-007-bg);color:var(--vibeui-codeblock-007-fg);
font-family:var(--vibeui-codeblock-007-font);
}
[data-vibeui-block="codeblock-007"] figcaption{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.5rem 0.875rem;
background:var(--vibeui-codeblock-007-head);
border-bottom:1px solid var(--vibeui-codeblock-007-border);
font-family:var(--vibeui-codeblock-007-mono);font-size:0.75rem;
color:var(--vibeui-codeblock-007-muted);
}
[data-vibeui-block="codeblock-007"] [data-part="badge"]{
padding:0.125rem 0.4375rem;border-radius:999px;
background:var(--vibeui-codeblock-007-bad-bg);color:var(--vibeui-codeblock-007-bad);
font-family:var(--vibeui-codeblock-007-font);font-weight:700;
}
[data-vibeui-block="codeblock-007"] pre{margin:0;padding:0.625rem 0;overflow-x:auto}
[data-vibeui-block="codeblock-007"] code{
display:block;min-width:max-content;
font-family:var(--vibeui-codeblock-007-mono);
font-size:0.8125rem;line-height:1.7;white-space:pre;
}
[data-vibeui-block="codeblock-007"] [data-part="row"]{
display:block;position:relative;padding:0 0.875rem 0 3.25rem;
border-left:3px solid transparent;
}
[data-vibeui-block="codeblock-007"] [data-part="row"]::before{
content:attr(data-line);position:absolute;left:0.5rem;width:2rem;
text-align:right;color:var(--vibeui-codeblock-007-gutter);
font-variant-numeric:tabular-nums;
user-select:none;-webkit-user-select:none;
}
[data-vibeui-block="codeblock-007"] [data-part="row"][data-bad="true"]{
background:var(--vibeui-codeblock-007-bad-bg);
border-left-color:var(--vibeui-codeblock-007-bad);
}
[data-vibeui-block="codeblock-007"] [data-part="row"][data-bad="true"]::before{color:var(--vibeui-codeblock-007-bad)}
[data-vibeui-block="codeblock-007"] [data-part="row"][data-bad="true"] span{
text-decoration:underline wavy var(--vibeui-codeblock-007-bad);
text-underline-offset:0.25em;text-decoration-skip-ink:none;
}
[data-vibeui-block="codeblock-007"] [data-part="callout"]{
display:flex;gap:0.5rem;align-items:flex-start;
margin:0;padding:0.625rem 0.875rem 0.75rem 3.25rem;
font-size:0.75rem;line-height:1.45;color:var(--vibeui-codeblock-007-bad);
}
[data-vibeui-block="codeblock-007"] [data-part="callout"]::before{
content:"↑";flex:none;font-weight:700;
}
`

const LINES = [
  "const cart = useCart()",
  "",
  "const total = cart.items.reduce((sum, item) => {",
  "  return sum + item.prise * item.count",
  "}, 0)",
]

/** Блок кода с подсвеченным диапазоном строк и подписью об ошибке. */
export function Codeblock007({
  path = "hooks/use-total.ts",
  message = "Опечатка: у товара поле price, а не prise",
  errorFrom = 4,
  errorTo = 4,
  lines = LINES,
  className,
  style,
  ...props
}: Codeblock007Props) {
  return (
    <>
      <style href="vibeui-codeblock-007" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="codeblock-007"
        className={className}
        style={style as CSSProperties}
      >
        <figcaption>
          <span>{path}</span>
          <span data-part="badge">
            строка {errorFrom}
            {errorTo > errorFrom ? `–${errorTo}` : ""}
          </span>
        </figcaption>
        <pre>
          <code>
            {lines.map((line, index) => {
              const number = index + 1
              const bad = number >= errorFrom && number <= errorTo

              return (
                <span
                  key={index}
                  data-part="row"
                  data-line={number}
                  data-bad={bad || undefined}
                >
                  <span>{line === "" ? " " : line}</span>
                </span>
              )
            })}
          </code>
        </pre>
        <p data-part="callout" role="note">
          {message}
        </p>
      </figure>
    </>
  )
}
