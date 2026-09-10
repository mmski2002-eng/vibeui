import type { CSSProperties, ReactNode } from "react"

export type Surface003Props = {
  /** Контент поверх фона. Без него блок показывает демонстрационный пример. */
  children?: ReactNode
  /** Поверхность: светлая бумага или графит. */
  tone?: "light" | "dark"
  /** Плотность сетки. */
  density?: "sparse" | "normal" | "dense"
  /** Оранжевые узлы на пересечениях. */
  nodes?: boolean
  accent?: string
  className?: string
  style?: CSSProperties
}

// Чертёжная сетка: тонкие квадратные линии, затухающие к краям, угловые
// координатные метки и пара оранжевых узлов. Центральная область спокойнее —
// сетка не спорит с текстом и таблицами. Рисуется двумя linear-gradient и
// маской, каждая линия не является DOM-элементом. Без JS и движения.
const STYLES = `
:where([data-vibeui-block="surface-003"]){
--vibeui-surface-003-bg:#ffffff;
--vibeui-surface-003-ink:#000000;
--vibeui-surface-003-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-surface-003-grid:color-mix(in oklab,#000000 9%,transparent);
--vibeui-surface-003-accent:#ff5900;
--vibeui-surface-003-step:2.5rem;
--vibeui-surface-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="surface-003"][data-tone="dark"]){
--vibeui-surface-003-bg:#1a1a1a;
--vibeui-surface-003-ink:#ffffff;
--vibeui-surface-003-muted:color-mix(in oklab,#ffffff 62%,#1a1a1a);
--vibeui-surface-003-grid:color-mix(in oklab,#ffffff 10%,transparent);
}
[data-vibeui-block="surface-003"][data-density="sparse"]{--vibeui-surface-003-step:3.5rem}
[data-vibeui-block="surface-003"][data-density="dense"]{--vibeui-surface-003-step:1.75rem}
[data-vibeui-block="surface-003"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-surface-003-bg);color:var(--vibeui-surface-003-ink);
font-family:var(--vibeui-surface-003-font);
}
[data-vibeui-block="surface-003"] *{box-sizing:border-box}
[data-vibeui-block="surface-003"] [data-part="canvas"]{
position:absolute;inset:0;overflow:hidden;pointer-events:none;
background-image:linear-gradient(var(--vibeui-surface-003-grid) 1px,transparent 1px),linear-gradient(90deg,var(--vibeui-surface-003-grid) 1px,transparent 1px);
background-size:var(--vibeui-surface-003-step) var(--vibeui-surface-003-step);
-webkit-mask-image:radial-gradient(130% 110% at 50% 42%,#000000 42%,transparent 96%);
mask-image:radial-gradient(130% 110% at 50% 42%,#000000 42%,transparent 96%);
}
[data-vibeui-block="surface-003"] [data-part="mark"]{
position:absolute;font-size:0.6875rem;letter-spacing:0.12em;
color:var(--vibeui-surface-003-muted);
font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
}
[data-vibeui-block="surface-003"] [data-part="mark"][data-at="tl"]{top:0.75rem;left:1rem}
[data-vibeui-block="surface-003"] [data-part="mark"][data-at="br"]{bottom:0.75rem;right:1rem}
[data-vibeui-block="surface-003"] [data-part="dot-a"],
[data-vibeui-block="surface-003"] [data-part="dot-b"]{
position:absolute;width:0.4375rem;height:0.4375rem;
background:var(--vibeui-surface-003-accent);
transform:translate(-50%,-50%);
}
[data-vibeui-block="surface-003"] [data-part="dot-a"]{top:calc(var(--vibeui-surface-003-step)*3);left:calc(var(--vibeui-surface-003-step)*4)}
[data-vibeui-block="surface-003"] [data-part="dot-b"]{bottom:calc(var(--vibeui-surface-003-step)*2 - 0.4375rem);right:calc(var(--vibeui-surface-003-step)*5 - 0.4375rem)}
[data-vibeui-block="surface-003"][data-nodes="off"] [data-part="dot-a"],
[data-vibeui-block="surface-003"][data-nodes="off"] [data-part="dot-b"]{display:none}
[data-vibeui-block="surface-003"] [data-part="frame"]{
position:relative;max-width:80rem;margin:0 auto;min-height:28rem;
padding:4rem 1.5rem;display:flex;flex-direction:column;justify-content:center;gap:1.25rem;
}
[data-vibeui-block="surface-003"] [data-part="eyebrow"]{
display:inline-flex;align-items:center;gap:0.5rem;margin:0;
font-size:0.8125rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-surface-003-muted);
}
[data-vibeui-block="surface-003"] [data-part="eyebrow"]::before{
content:"";width:0.5rem;height:0.5rem;background:var(--vibeui-surface-003-accent);
}
[data-vibeui-block="surface-003"] [data-part="title"]{
margin:0;max-width:26ch;
font-size:clamp(1.875rem,5cqi,3.5rem);line-height:1.06;letter-spacing:-0.02em;font-weight:650;
}
[data-vibeui-block="surface-003"] [data-part="lede"]{
margin:0;max-width:44ch;font-size:1.0625rem;line-height:1.6;
color:var(--vibeui-surface-003-muted);
}
[data-vibeui-block="surface-003"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.5rem;align-self:flex-start;
margin-top:0.5rem;padding:0.5rem 0.875rem;border:1px solid var(--vibeui-surface-003-grid);
background:var(--vibeui-surface-003-bg);
font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:0.8125rem;
color:var(--vibeui-surface-003-muted);
}
@container (min-width: 48rem){
[data-vibeui-block="surface-003"] [data-part="frame"]{padding:6rem 3rem;min-height:34rem}
}
`

/** Фон-чертёж: тонкая сетка с затуханием к краям и оранжевыми узлами. */
export function Surface003({
  children,
  tone = "light",
  density = "normal",
  nodes = true,
  accent,
  className,
  style,
}: Surface003Props) {
  const palette = {
    ...(accent ? { "--vibeui-surface-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-surface-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="surface-003"
        data-tone={tone === "dark" ? "dark" : undefined}
        data-density={density === "normal" ? undefined : density}
        data-nodes={nodes ? undefined : "off"}
        className={className}
        style={palette}
      >
        <div data-part="canvas" aria-hidden="true" />
        <div aria-hidden="true">
          <span data-part="mark" data-at="tl">
            A·01
          </span>
          <span data-part="mark" data-at="br">
            D·12
          </span>
          <span data-part="dot-a" />
          <span data-part="dot-b" />
        </div>
        <div data-part="frame">
          {children ?? (
            <>
              <p data-part="eyebrow">Инженерная основа</p>
              <h2 data-part="title">Сетка, на которой всё сходится</h2>
              <p data-part="lede">
                Чертёжные линии тают к краям и оставляют центр спокойным:
                текст, код и таблицы читаются без визуального спора с фоном.
              </p>
              <span data-part="chip">npx vibeui add surface-003</span>
            </>
          )}
        </div>
      </section>
    </>
  )
}
