import type { CSSProperties, ReactNode } from "react"

export type Surface010Props = {
  /** Контент поверх фона. Без него блок показывает демонстрационный пример. */
  children?: ReactNode
  /** Поверхность: графит или бумага. */
  tone?: "dark" | "light"
  /** Оранжевый маршрут поверх рельефа. */
  route?: boolean
  /** Плотность контуров. */
  density?: "sparse" | "normal"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Топографические линии: тонкие контуры рельефа адаптивным SVG, тяготеющие
// к правому краю, и необязательный оранжевый маршрут с точками старта и
// финиша. Для путешествий, недвижимости, outdoor и инженерии. Это
// декоративный рельеф, не карта: географической точности нет и не
// обещается. Слева остаётся спокойная зона под текст. Без JS и движения.
const STYLES = `
:where([data-vibeui-block="surface-010"]){
--vibeui-surface-010-bg:#1a1a1a;
--vibeui-surface-010-ink:#ffffff;
--vibeui-surface-010-muted:color-mix(in oklab,#ffffff 62%,#1a1a1a);
--vibeui-surface-010-contour:color-mix(in oklab,#ffffff 14%,transparent);
--vibeui-surface-010-accent:#ff5900;
--vibeui-surface-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="surface-010"][data-tone="light"]){
--vibeui-surface-010-bg:#ffffff;
--vibeui-surface-010-ink:#000000;
--vibeui-surface-010-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-surface-010-contour:color-mix(in oklab,#000000 12%,transparent);
}
[data-vibeui-block="surface-010"]{
position:relative;display:block;min-width:min(100%,16rem);overflow:hidden;
background:var(--vibeui-surface-010-bg);color:var(--vibeui-surface-010-ink);
font-family:var(--vibeui-surface-010-font);
}
[data-vibeui-block="surface-010"] *{box-sizing:border-box}
[data-vibeui-block="surface-010"] [data-part="terrain"]{
position:absolute;inset:0;pointer-events:none;
display:block;width:100%;height:100%;
}
[data-vibeui-block="surface-010"] [data-part="terrain"] path{
fill:none;stroke:var(--vibeui-surface-010-contour);stroke-width:1;
}
[data-vibeui-block="surface-010"][data-density="sparse"] [data-part="terrain"] path:nth-of-type(even){display:none}
[data-vibeui-block="surface-010"] [data-part="terrain"] [data-route]{
stroke:var(--vibeui-surface-010-accent);stroke-width:2;stroke-dasharray:6 5;
}
[data-vibeui-block="surface-010"] [data-part="terrain"] circle{
fill:var(--vibeui-surface-010-accent);stroke:none;
}
[data-vibeui-block="surface-010"][data-route="off"] [data-part="terrain"] [data-route],
[data-vibeui-block="surface-010"][data-route="off"] [data-part="terrain"] circle{display:none}
[data-vibeui-block="surface-010"] [data-part="frame"]{
position:relative;max-width:80rem;margin:0 auto;min-height:28rem;
padding:4rem 1.5rem;display:flex;flex-direction:column;justify-content:center;gap:1.25rem;
}
[data-vibeui-block="surface-010"] [data-part="kicker"]{
margin:0;display:inline-flex;align-items:center;gap:0.5rem;
font-size:0.8125rem;font-weight:620;letter-spacing:0.1em;text-transform:uppercase;
color:var(--vibeui-surface-010-muted);
}
[data-vibeui-block="surface-010"] [data-part="kicker"]::before{
content:"";width:0.5rem;height:0.5rem;background:var(--vibeui-surface-010-accent);
}
[data-vibeui-block="surface-010"] [data-part="title"]{
margin:0;max-width:20ch;
font-size:clamp(2rem,5.5cqi,3.75rem);line-height:1.05;letter-spacing:-0.02em;font-weight:660;
}
[data-vibeui-block="surface-010"] [data-part="lede"]{
margin:0;max-width:40ch;font-size:1.0625rem;line-height:1.6;
color:var(--vibeui-surface-010-muted);
}
[data-vibeui-block="surface-010"] [data-part="action"]{
align-self:flex-start;display:inline-flex;align-items:center;
min-height:2.75rem;padding:0.375rem 1.375rem;margin-top:0.5rem;
background:var(--vibeui-surface-010-accent);color:#000000;
text-decoration:none;font-size:1rem;font-weight:640;
transition:filter .16s ease;
}
[data-vibeui-block="surface-010"] [data-part="action"]:hover{filter:brightness(1.06)}
[data-vibeui-block="surface-010"] a:focus-visible{
outline:2px solid var(--vibeui-surface-010-accent);outline-offset:2px;
}
@container (min-width: 48rem){
[data-vibeui-block="surface-010"] [data-part="frame"]{padding:6rem 3rem;min-height:34rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="surface-010"] *{animation:none!important;transition:none!important}}
`

/** Фон-рельеф: топографические контуры и оранжевый маршрут у края композиции. */
export function Surface010({
  children,
  tone = "dark",
  route = true,
  density = "normal",
  accent,
  className,
  style,
}: Surface010Props) {
  const palette = {
    ...(accent ? { "--vibeui-surface-010-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-surface-010" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="surface-010"
        data-tone={tone === "light" ? "light" : undefined}
        data-route={route ? undefined : "off"}
        data-density={density === "sparse" ? "sparse" : undefined}
        className={className}
        style={palette}
      >
        <svg
          data-part="terrain"
          viewBox="0 0 1280 560"
          preserveAspectRatio="xMaxYMid slice"
          aria-hidden="true"
        >
          <path d="M640 560c60-90 40-150 120-190s90-110 170-130 130 30 210 10 110-70 140-90v400Z" />
          <path d="M700 560c55-75 45-130 115-165s85-95 160-115 125 25 200 5 85-55 105-70v345Z" />
          <path d="M760 560c50-60 50-110 110-140s80-80 150-100 120 20 190 0 60-40 70-50v290Z" />
          <path d="M820 560c45-45 55-90 105-115s75-65 140-85 115 15 175-5 30-25 40-30v235Z" />
          <path d="M880 560c40-30 60-70 100-90s70-50 130-70 110 10 160-10v170Z" />
          <path d="M940 560c35-20 65-50 95-65s65-35 120-55 100 5 125-5v125Z" />
          <path d="M1000 560c30-12 70-35 90-45s60-25 110-40 60 0 80-3v88Z" />
          <path d="M1060 560c25-8 75-22 85-28s55-16 100-28 25 0 35-1v57Z" />
          <path data-route="on" d="M760 470c60-40 90-90 170-110s150 10 230-40" />
          <circle cx="760" cy="470" r="5" />
          <circle cx="1160" cy="320" r="5" />
        </svg>
        <div data-part="frame">
          {children ?? (
            <>
              <p data-part="kicker">Маршруты Урала</p>
              <h2 data-part="title">Рельеф ведёт к вершине</h2>
              <p data-part="lede">
                Контуры тяготеют к краю и оставляют текстовую зону
                спокойной. Пунктирный маршрут — декоративный, без обещания
                географической точности.
              </p>
              <a data-part="action" href="#routes">
                Выбрать маршрут
              </a>
            </>
          )}
        </div>
      </section>
    </>
  )
}
