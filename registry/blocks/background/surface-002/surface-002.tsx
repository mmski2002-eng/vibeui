import type { CSSProperties, ReactNode } from "react"

export type Surface002Props = {
  /** Контент поверх фона. Без него блок показывает демонстрационный пример. */
  children?: ReactNode
  /** Откуда падает тёплый свет. */
  glow?: "top" | "corner" | "low"
  /** Графитовые панели в глубине. */
  panels?: boolean
  accent?: string
  className?: string
  style?: CSSProperties
}

// Графитовая глубина: чёрная основа, панели #1A1A1A и одно мягкое тёплое
// свечение из фирменного оранжевого. Глубину дают различия поверхностей и
// ограниченный свет, а не размытие: под текстом всегда стабильная тёмная
// область. Статический фон без JS; свечение — обычный градиент.
const STYLES = `
:where([data-vibeui-block="surface-002"]){
--vibeui-surface-002-bg:#000000;
--vibeui-surface-002-panel:#1a1a1a;
--vibeui-surface-002-ink:#ffffff;
--vibeui-surface-002-muted:color-mix(in oklab,#ffffff 62%,#000000);
--vibeui-surface-002-line:color-mix(in oklab,#ffffff 12%,transparent);
--vibeui-surface-002-accent:#ff5900;
--vibeui-surface-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="surface-002"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-surface-002-bg);color:var(--vibeui-surface-002-ink);
font-family:var(--vibeui-surface-002-font);
}
[data-vibeui-block="surface-002"] *{box-sizing:border-box}
[data-vibeui-block="surface-002"] [data-part="canvas"]{
position:absolute;inset:0;overflow:hidden;pointer-events:none;
}
[data-vibeui-block="surface-002"] [data-part="glow"]{
position:absolute;inset:0;
background:radial-gradient(52rem 30rem at 72% -12%,color-mix(in oklab,var(--vibeui-surface-002-accent) 34%,transparent),transparent 62%);
}
[data-vibeui-block="surface-002"][data-glow="corner"] [data-part="glow"]{
background:radial-gradient(46rem 34rem at -8% 4%,color-mix(in oklab,var(--vibeui-surface-002-accent) 30%,transparent),transparent 60%);
}
[data-vibeui-block="surface-002"][data-glow="low"] [data-part="glow"]{
background:radial-gradient(60rem 26rem at 50% 108%,color-mix(in oklab,var(--vibeui-surface-002-accent) 26%,transparent),transparent 64%);
}
[data-vibeui-block="surface-002"] [data-part="panel-a"]{
position:absolute;top:16%;right:6%;width:30%;height:46%;
background:var(--vibeui-surface-002-panel);border:1px solid var(--vibeui-surface-002-line);
}
[data-vibeui-block="surface-002"] [data-part="panel-b"]{
position:absolute;bottom:-6%;right:22%;width:22%;height:34%;
background:color-mix(in oklab,var(--vibeui-surface-002-panel) 72%,#000000);
border:1px solid var(--vibeui-surface-002-line);
}
[data-vibeui-block="surface-002"][data-panels="off"] [data-part="panel-a"],
[data-vibeui-block="surface-002"][data-panels="off"] [data-part="panel-b"]{display:none}
[data-vibeui-block="surface-002"] [data-part="frame"]{
position:relative;max-width:80rem;margin:0 auto;min-height:28rem;
padding:4rem 1.5rem;display:flex;flex-direction:column;justify-content:center;gap:1.25rem;
}
[data-vibeui-block="surface-002"] [data-part="eyebrow"]{
display:inline-flex;align-items:center;gap:0.5rem;margin:0;
font-size:0.8125rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-surface-002-muted);
}
[data-vibeui-block="surface-002"] [data-part="eyebrow"]::before{
content:"";width:0.5rem;height:0.5rem;background:var(--vibeui-surface-002-accent);
}
[data-vibeui-block="surface-002"] [data-part="title"]{
margin:0;max-width:24ch;
font-size:clamp(1.875rem,5cqi,3.5rem);line-height:1.06;letter-spacing:-0.02em;font-weight:650;
}
[data-vibeui-block="surface-002"] [data-part="lede"]{
margin:0;max-width:44ch;font-size:1.0625rem;line-height:1.6;
color:var(--vibeui-surface-002-muted);
}
[data-vibeui-block="surface-002"] [data-part="actions"]{
display:flex;flex-wrap:wrap;gap:0.75rem;margin-top:0.5rem;
}
[data-vibeui-block="surface-002"] [data-part="action"]{
display:inline-flex;align-items:center;min-height:2.5rem;padding:0.375rem 1.125rem;
background:var(--vibeui-surface-002-accent);color:#000000;
text-decoration:none;font-size:0.9375rem;font-weight:640;
}
[data-vibeui-block="surface-002"] [data-part="secondary"]{
display:inline-flex;align-items:center;min-height:2.5rem;padding:0.375rem 1.125rem;
border:1px solid var(--vibeui-surface-002-line);color:var(--vibeui-surface-002-ink);
text-decoration:none;font-size:0.9375rem;font-weight:520;
}
[data-vibeui-block="surface-002"] a:focus-visible{
outline:2px solid var(--vibeui-surface-002-accent);outline-offset:2px;
}
@container (min-width: 48rem){
[data-vibeui-block="surface-002"] [data-part="frame"]{padding:6rem 3rem;min-height:34rem}
}
`

/** Графитовый фон продукта: чёрная глубина, панели и тёплое оранжевое свечение. */
export function Surface002({
  children,
  glow = "top",
  panels = true,
  accent,
  className,
  style,
}: Surface002Props) {
  const palette = {
    ...(accent ? { "--vibeui-surface-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-surface-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="surface-002"
        data-glow={glow === "top" ? undefined : glow}
        data-panels={panels ? undefined : "off"}
        className={className}
        style={palette}
      >
        <div data-part="canvas" aria-hidden="true">
          <div data-part="glow" />
          <div data-part="panel-a" />
          <div data-part="panel-b" />
        </div>
        <div data-part="frame">
          {children ?? (
            <>
              <p data-part="eyebrow">Технологический продукт</p>
              <h2 data-part="title">Глубина без визуального шума</h2>
              <p data-part="lede">
                Чёрная основа и графитовые панели различают уровни, а один
                тёплый источник света ведёт взгляд к главному действию.
              </p>
              <div data-part="actions">
                <a data-part="action" href="#start">
                  Попробовать
                </a>
                <a data-part="secondary" href="#docs">
                  Документация
                </a>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
