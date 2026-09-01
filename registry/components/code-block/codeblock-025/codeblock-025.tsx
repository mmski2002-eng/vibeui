import type { CSSProperties } from "react"

export type Codeblock025Props = {
  path?: string
  collapsedHeight?: number
  expandedHeight?: number
  code?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: длинный файл, ограниченный по высоте, а не по числу строк.
// Высоту держит max-height, состояние — скрытый чекбокс, поэтому раскрытие
// анимируется и работает без JS; обрыв показан маской, которая гаснет сама.
const STYLES = `
:where([data-vibeui-block="codeblock-025"]){
--vibeui-codeblock-025-bg:oklch(0.2 0.02 320);
--vibeui-codeblock-025-head:oklch(0.24 0.024 320);
--vibeui-codeblock-025-fg:oklch(0.93 0.008 320);
--vibeui-codeblock-025-muted:oklch(0.67 0.018 320);
--vibeui-codeblock-025-border:oklch(1 0 0 / 12%);
--vibeui-codeblock-025-accent:oklch(0.82 0.13 320);
--vibeui-codeblock-025-collapsed:9rem;
--vibeui-codeblock-025-expanded:32rem;
--vibeui-codeblock-025-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-025-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="codeblock-025"]{
display:flex;flex-direction:column;
width:100%;max-width:32rem;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-codeblock-025-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-025-bg);color:var(--vibeui-codeblock-025-fg);
font-family:var(--vibeui-codeblock-025-font);
}
[data-vibeui-block="codeblock-025"] [data-part="head"]{
padding:0.5rem 0.875rem;
background:var(--vibeui-codeblock-025-head);
border-bottom:1px solid var(--vibeui-codeblock-025-border);
font-family:var(--vibeui-codeblock-025-mono);font-size:0.75rem;
color:var(--vibeui-codeblock-025-muted);
}
[data-vibeui-block="codeblock-025"] [data-part="body"]{
max-height:var(--vibeui-codeblock-025-collapsed);overflow:hidden;
transition:max-height .32s cubic-bezier(.32,.72,0,1);
}
/* Пока блок свёрнут, низ гаснет: обрыв обязан читаться как «здесь ещё есть
   код», иначе кнопка «развернуть» выглядит бессмысленной. */
[data-vibeui-block="codeblock-025"]:not(:has(input:checked)) [data-part="body"]{
mask-image:linear-gradient(to bottom,#000 60%,oklch(0 0 0 / 15%) 100%);
}
[data-vibeui-block="codeblock-025"]:has(input:checked) [data-part="body"]{
max-height:var(--vibeui-codeblock-025-expanded);overflow:auto;
}
[data-vibeui-block="codeblock-025"] pre{margin:0;padding:0.75rem 0.875rem}
[data-vibeui-block="codeblock-025"] code{
display:block;min-width:max-content;
font-family:var(--vibeui-codeblock-025-mono);
font-size:0.8125rem;line-height:1.65;white-space:pre;
}
[data-vibeui-block="codeblock-025"] label{
cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.375rem;
padding:0.5rem 0.875rem;
border-top:1px solid var(--vibeui-codeblock-025-border);
background:var(--vibeui-codeblock-025-head);
font-size:0.75rem;font-weight:650;color:var(--vibeui-codeblock-025-accent);
transition:background-color .16s ease;
}
[data-vibeui-block="codeblock-025"] label:hover{background:oklch(1 0 0 / 8%)}
[data-vibeui-block="codeblock-025"] label:has(input:focus-visible){
outline:2px solid var(--vibeui-codeblock-025-accent);outline-offset:-2px;
}
[data-vibeui-block="codeblock-025"] label::after{
content:"▾";transition:transform .2s ease;
}
[data-vibeui-block="codeblock-025"] input{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
border:0;clip-path:inset(50%);overflow:hidden;white-space:nowrap;
}
[data-vibeui-block="codeblock-025"] label:has(input:checked)::after{transform:rotate(180deg)}
[data-vibeui-block="codeblock-025"] label:has(input:checked) [data-part="more"]{display:none}
[data-vibeui-block="codeblock-025"] label:not(:has(input:checked)) [data-part="less"]{display:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="codeblock-025"] *{animation:none!important;transition:none!important}}
`

const CODE = `export type Plan = "free" | "pro" | "team"

const PRICE: Record<Plan, number> = {
  free: 0,
  pro: 1290,
  team: 4900,
}

export function priceOf(plan: Plan, months = 1) {
  const base = PRICE[plan] * months

  if (months >= 12) {
    return Math.round(base * 0.8)
  }

  return base
}`

/** Блок кода с ограничением высоты и кнопкой «развернуть». */
export function Codeblock025({
  path = "lib/pricing.ts",
  collapsedHeight = 9,
  expandedHeight = 32,
  code = CODE,
  className,
  style,
}: Codeblock025Props) {
  const palette = {
    "--vibeui-codeblock-025-collapsed": `${collapsedHeight}rem`,
    "--vibeui-codeblock-025-expanded": `${expandedHeight}rem`,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-codeblock-025" precedence="medium">
        {STYLES}
      </style>
      <figure
        data-vibeui-block="codeblock-025"
        className={className}
        style={palette}
      >
        <figcaption data-part="head">{path}</figcaption>
        <div data-part="body">
          <pre>
            <code>{code}</code>
          </pre>
        </div>
        <label>
          <input type="checkbox" />
          <span data-part="more">Развернуть</span>
          <span data-part="less">Свернуть</span>
        </label>
      </figure>
    </>
  )
}
