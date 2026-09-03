import type { ComponentProps, CSSProperties } from "react"

export type Codeblock011Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  hint?: string
  code?: string
  /** Подпись области прокрутки для скринридера: {title} — имя файла. */
  codeLabel?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: честная горизонтальная прокрутка. Правый край затенён, а
// подсказка «прокрутите» гаснет по мере прокрутки — за это отвечает
// scroll-driven анимация, привязанная к самой области прокрутки. Без
// поддержки подсказка просто остаётся на месте, ничего не ломая.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// нет, а затенение края — полупрозрачный градиент, а не сплошной цвет фона.
const STYLES = `
:where([data-vibeui-block="codeblock-011"]){
--vibeui-codeblock-011-bg:transparent;
--vibeui-codeblock-011-head:light-dark(oklch(0 0 0 / 4%),oklch(1 0 0 / 5%));
--vibeui-codeblock-011-edge:light-dark(oklch(0.99 0.004 60 / 88%),oklch(0.19 0.018 60 / 88%));
--vibeui-codeblock-011-chip:light-dark(oklch(0 0 0 / 8%),oklch(1 0 0 / 12%));
--vibeui-codeblock-011-fg:light-dark(oklch(0.28 0.018 60),oklch(0.93 0.008 60));
--vibeui-codeblock-011-muted:color-mix(in oklab,var(--vibeui-codeblock-011-fg) 68%,transparent);
--vibeui-codeblock-011-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 13%));
--vibeui-codeblock-011-accent:light-dark(oklch(0.52 0.13 70),oklch(0.83 0.13 75));
--vibeui-codeblock-011-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
timeline-scope:--vibeui-codeblock-011-track;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="codeblock-011"]{color-scheme:dark}
[data-vibeui-block="codeblock-011"]{
position:relative;display:flex;flex-direction:column;
width:100%;box-sizing:border-box;margin:0;overflow:hidden;
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
background:linear-gradient(to right,transparent,var(--vibeui-codeblock-011-edge));
}
[data-vibeui-block="codeblock-011"] [data-part="hint"]{
position:absolute;right:0.625rem;bottom:0.4375rem;pointer-events:none;
display:inline-flex;align-items:center;gap:0.25rem;
padding:0.125rem 0.4375rem;border-radius:999px;
background:var(--vibeui-codeblock-011-chip);color:var(--vibeui-codeblock-011-accent);
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

/** Блок кода с горизонтальной прокруткой и подсказкой, гаснущей при прокрутке. */
export function Codeblock011({
  title = "table/columns.ts",
  hint = "Прокрутите вправо",
  code = CODE,
  codeLabel = "Код файла {title}",
  background = "",
  className,
  style,
  ...props
}: Codeblock011Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-codeblock-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-codeblock-011" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="code-block"
        data-vibeui-block="codeblock-011"
        className={className}
        style={palette}
      >
        <figcaption>{title}</figcaption>
        <pre
          tabIndex={0}
          role="region"
          aria-label={codeLabel.replace("{title}", title)}
        >
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
