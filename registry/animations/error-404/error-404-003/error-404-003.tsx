import type { ComponentProps, CSSProperties } from "react"

export type Error404003Props = Omit<ComponentProps<"section">, "children"> & {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  /** Цвет нити, которой вышиты цифры. */
  accent?: string
  /** Пусто — подложки нет, страница ложится на фон сайта. */
  background?: string
}

// «404» вышито по сетке точек, как фигура на доске с гвоздиками: нить
// натягивается от гвоздя к гвоздю (stroke-dashoffset), а по готовому
// контуру бегает светлячок. Геометрия — ломаные по узлам сетки, без шрифта.
const STYLES = `
:where([data-vibeui-block="error-404-003"]){
--vibeui-error-404-003-bg:light-dark(oklch(0.95 0.02 85),oklch(0.2 0.01 85));
--vibeui-error-404-003-fg:light-dark(oklch(0.24 0.05 300),oklch(0.95 0.01 85));
--vibeui-error-404-003-muted:light-dark(oklch(0.5 0.02 85),oklch(0.72 0.02 85));
--vibeui-error-404-003-dot:light-dark(oklch(0.8 0.02 85),oklch(0.38 0.01 85));
--vibeui-error-404-003-accent:light-dark(oklch(0.64 0.12 75),oklch(0.78 0.13 80));
--vibeui-error-404-003-font:ui-serif,Georgia,Cambria,"Times New Roman",serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="error-404-003"]{color-scheme:dark}
[data-vibeui-block="error-404-003"]{
display:flex;flex-direction:column;align-items:center;gap:1.25rem;box-sizing:border-box;padding:3rem 1.25rem;text-align:center;
background:var(--vibeui-error-404-003-bg);color:var(--vibeui-error-404-003-fg);font-family:var(--vibeui-error-404-003-font);
}
[data-vibeui-block="error-404-003"] [data-part="board"]{width:100%;max-width:30rem;height:auto;overflow:visible}
[data-vibeui-block="error-404-003"] [data-part="dot"]{fill:var(--vibeui-error-404-003-dot)}
[data-vibeui-block="error-404-003"] [data-part="thread"]{
fill:none;stroke:var(--vibeui-error-404-003-accent);stroke-width:3;stroke-linecap:round;stroke-linejoin:round;
stroke-dasharray:1;stroke-dashoffset:1;
animation:vibeui-error-404-003-draw 2.4s cubic-bezier(.6,0,.3,1) forwards;
}
[data-vibeui-block="error-404-003"] [data-part="thread"]:nth-of-type(2){animation-delay:.4s}
[data-vibeui-block="error-404-003"] [data-part="thread"]:nth-of-type(3){animation-delay:.8s}
[data-vibeui-block="error-404-003"] [data-part="spark"]{
fill:var(--vibeui-error-404-003-accent);filter:drop-shadow(0 0 6px var(--vibeui-error-404-003-accent));
offset-path:var(--vibeui-error-404-003-path);animation:vibeui-error-404-003-run 6s linear 3s infinite;opacity:0;
}
@keyframes vibeui-error-404-003-draw{to{stroke-dashoffset:0}}
@keyframes vibeui-error-404-003-run{0%{offset-distance:0%;opacity:1}100%{offset-distance:100%;opacity:1}}
[data-vibeui-block="error-404-003"] [data-part="title"]{margin:0;font-size:clamp(1.75rem,5cqi,2.5rem);font-weight:600;letter-spacing:-0.02em}
[data-vibeui-block="error-404-003"]{container-type:inline-size}
[data-vibeui-block="error-404-003"] [data-part="text"]{margin:0;color:var(--vibeui-error-404-003-muted);font-size:0.9375rem}
[data-vibeui-block="error-404-003"] [data-part="actions"]{display:flex;flex-wrap:wrap;justify-content:center;gap:0.75rem}
[data-vibeui-block="error-404-003"] [data-part="primary"],
[data-vibeui-block="error-404-003"] [data-part="secondary"]{
padding:0.625rem 1rem;font-size:0.875rem;text-decoration:none;border:1px solid var(--vibeui-error-404-003-fg);transition:background .2s ease,color .2s ease;
}
[data-vibeui-block="error-404-003"] [data-part="primary"]{background:var(--vibeui-error-404-003-fg);color:var(--vibeui-error-404-003-bg)}
[data-vibeui-block="error-404-003"] [data-part="secondary"]{color:var(--vibeui-error-404-003-fg)}
[data-vibeui-block="error-404-003"] [data-part="secondary"]:hover{background:color-mix(in oklab,var(--vibeui-error-404-003-fg) 8%,transparent)}
[data-vibeui-block="error-404-003"] :is([data-part="primary"],[data-part="secondary"]):focus-visible{outline:2px solid var(--vibeui-error-404-003-accent);outline-offset:3px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="error-404-003"] [data-part="thread"]{animation:none;stroke-dashoffset:0}
[data-vibeui-block="error-404-003"] [data-part="spark"]{display:none}
}
[data-vibeui-block="error-404-003"]{width:100%}
`

// Узлы сетки 5×5 на каждую цифру; шаг 20, отступ между цифрами 120.
const FOUR = (dx: number) => `M${dx + 60} 100 V20 L${dx} 80 H${dx + 80}`
const ZERO = (dx: number) =>
  `M${dx + 20} 20 H${dx + 60} L${dx + 80} 40 V80 L${dx + 60} 100 H${dx + 20} L${dx} 80 V40 Z`
const PATHS = [FOUR(0), ZERO(120), FOUR(240)]

export function Error404003({
  title = "Страница не найдена",
  description = "Страницы, которую вы искали, не существует.",
  actionLabel = "На главную",
  actionHref = "/",
  secondaryLabel = "Открыть справку",
  secondaryHref = "/docs",
  accent,
  background,
  className,
  style,
  ...props
}: Error404003Props) {
  const palette = {
    ...(accent ? { "--vibeui-error-404-003-accent": accent } : null),
    ...(background ? { "--vibeui-error-404-003-bg": background } : null),
    "--vibeui-error-404-003-path": `path("${PATHS[2]}")`,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-error-404-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="error-404-003"
        data-slot="not-found"
        className={className}
        style={palette}
      >
        <svg data-part="board" viewBox="-10 10 340 100" role="img" aria-label="404">
          {Array.from({ length: 17 * 5 }, (_, index) => (
            <circle
              key={index}
              data-part="dot"
              cx={(index % 17) * 20}
              cy={20 + Math.floor(index / 17) * 20}
              r="2"
            />
          ))}
          {PATHS.map((path) => (
            <path key={path} data-part="thread" d={path} pathLength={1} />
          ))}
          <circle data-part="spark" r="5" />
        </svg>
        <h1 data-part="title">{title}</h1>
        <p data-part="text">{description}</p>
        <div data-part="actions">
          <a data-part="primary" href={actionHref}>
            {actionLabel}
          </a>
          <a data-part="secondary" href={secondaryHref}>
            {secondaryLabel}
          </a>
        </div>
      </section>
    </>
  )
}
