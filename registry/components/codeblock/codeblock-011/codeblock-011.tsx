import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Codeblock011Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children" | "title"
> & {
  title?: string
  hint?: string
  code?: string
}

// Идея компонента: честная горизонтальная прокрутка. Правый край затенён, а
// подсказка «прокрутите» гаснет по мере прокрутки — за это отвечает
// scroll-driven анимация, привязанная к самой области прокрутки. Без
// поддержки подсказка просто остаётся на месте, ничего не ломая.
const STYLES = `
:where([data-vibeui-block="codeblock-011"]){
--vibeui-codeblock-011-bg:oklch(0.21 0.02 60);
--vibeui-codeblock-011-head:oklch(0.25 0.024 60);
--vibeui-codeblock-011-fg:oklch(0.93 0.008 60);
--vibeui-codeblock-011-muted:oklch(0.68 0.02 60);
--vibeui-codeblock-011-border:oklch(1 0 0 / 13%);
--vibeui-codeblock-011-accent:oklch(0.83 0.13 75);
--vibeui-codeblock-011-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
timeline-scope:--vibeui-codeblock-011-track;
}
[data-vibeui-block="codeblock-011"]{
position:relative;display:flex;flex-direction:column;
width:100%;max-width:30rem;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-codeblock-011-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-011-bg);color:var(--vibeui-codeblock-011-fg);
font-family:var(--vibeui-codeblock-011-font);
}
[data-vibeui-block="codeblock-011"] figcaption{
padding:0.5rem 0.875rem;
background:var(--vibeui-codeblock-011-head);
border-bottom:1px solid var(--vibeui-codeblock-011-border);
font-family:var(--vibeui-codeblock-011-mono);font-size:0.75rem;
color:var(--vibeui-codeblock-011-muted);
}
[data-vibeui-block="codeblock-011"] pre{
margin:0;padding:0.875rem 0.875rem 1.75rem;
overflow-x:auto;overscroll-behavior-x:contain;
scroll-timeline:--vibeui-codeblock-011-track inline;
}
[data-vibeui-block="codeblock-011"] pre:focus-visible{outline:2px solid var(--vibeui-codeblock-011-accent);outline-offset:-2px}
[data-vibeui-block="codeblock-011"] code{
display:block;min-width:max-content;
font-family:var(--vibeui-codeblock-011-mono);
font-size:0.8125rem;line-height:1.7;white-space:pre;
}
[data-vibeui-block="codeblock-011"] [data-part="edge"]{
position:absolute;top:2.125rem;right:0;bottom:0;width:3rem;pointer-events:none;
background:linear-gradient(to right,oklch(0.21 0.02 60 / 0%),var(--vibeui-codeblock-011-bg));
}
[data-vibeui-block="codeblock-011"] [data-part="hint"]{
position:absolute;right:0.625rem;bottom:0.4375rem;pointer-events:none;
display:inline-flex;align-items:center;gap:0.25rem;
padding:0.125rem 0.4375rem;border-radius:999px;
background:oklch(1 0 0 / 12%);color:var(--vibeui-codeblock-011-accent);
font-size:0.6875rem;font-weight:700;
}
@supports (animation-timeline:scroll()){
[data-vibeui-block="codeblock-011"] [data-part="hint"],
[data-vibeui-block="codeblock-011"] [data-part="edge"]{
animation:vibeui-codeblock-011-fade linear both;
animation-timeline:--vibeui-codeblock-011-track;
animation-range:0% 20%;
}
}
@keyframes vibeui-codeblock-011-fade{from{opacity:1}to{opacity:0}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="codeblock-011"] *{animation:none!important;transition:none!important}}
`

const CODE = `const columns = [{ key: "name", title: "Название" }, { key: "price", title: "Цена, ₽" }, { key: "stock", title: "Остаток" }]`

/** Блок кода с горизонтальной прокруткой и подсказкой, гаснущей при прокрутке. */
export function Codeblock011({
  title = "table/columns.ts",
  hint = "Прокрутите вправо",
  code = CODE,
  className,
  style,
  ...props
}: Codeblock011Props) {
  return (
    <>
      <style href="vibeui-codeblock-011" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="codeblock-011"
        className={className}
        style={style as CSSProperties}
      >
        <figcaption>{title}</figcaption>
        <pre tabIndex={0} role="region" aria-label={`Код файла ${title}`}>
          <code>{code}</code>
        </pre>
        <span data-part="edge" aria-hidden="true" />
        <span data-part="hint" aria-hidden="true">
          {hint} →
        </span>
      </figure>
    </>
  )
}
