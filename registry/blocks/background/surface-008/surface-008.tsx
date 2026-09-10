import type { CSSProperties, ReactNode } from "react"

export type Surface008Props = {
  /** Контент поверх фона. Без него блок показывает демонстрационный пример. */
  children?: ReactNode
  /** База: чёрная или белая. */
  tone?: "dark" | "light"
  /** Высота линии горизонта от низа, в процентах высоты блока. */
  horizon?: "low" | "middle"
  /** Медленное дыхание свечения. */
  breathe?: boolean
  accent?: string
  className?: string
  style?: CSSProperties
}

// Световой горизонт: тонкая оранжевая линия с мягким свечением, уходящим
// в чёрный или белый фон. Для технологического релиза и исследования.
// Горизонт лежит ниже текста; центр не пересвечен. Дыхание — медленная
// CSS-анимация непрозрачности свечения, полностью отключается
// prefers-reduced-motion; статический кадр сохраняет композицию.
const STYLES = `
:where([data-vibeui-block="surface-008"]){
--vibeui-surface-008-bg:#000000;
--vibeui-surface-008-ink:#ffffff;
--vibeui-surface-008-muted:color-mix(in oklab,#ffffff 62%,#000000);
--vibeui-surface-008-accent:#ff5900;
--vibeui-surface-008-horizon:22%;
--vibeui-surface-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="surface-008"][data-tone="light"]){
--vibeui-surface-008-bg:#ffffff;
--vibeui-surface-008-ink:#000000;
--vibeui-surface-008-muted:color-mix(in oklab,#000000 56%,#ffffff);
}
:where([data-vibeui-block="surface-008"][data-horizon="middle"]){--vibeui-surface-008-horizon:38%}
[data-vibeui-block="surface-008"]{
position:relative;display:block;min-width:min(100%,16rem);overflow:hidden;
background:var(--vibeui-surface-008-bg);color:var(--vibeui-surface-008-ink);
font-family:var(--vibeui-surface-008-font);
}
[data-vibeui-block="surface-008"] *{box-sizing:border-box}
[data-vibeui-block="surface-008"] [data-part="glow"]{
position:absolute;left:-10%;right:-10%;pointer-events:none;
bottom:calc(var(--vibeui-surface-008-horizon) - 9rem);height:18rem;
background:radial-gradient(50% 100% at 50% 50%,color-mix(in oklab,var(--vibeui-surface-008-accent) 38%,transparent),transparent 70%);
}
[data-vibeui-block="surface-008"][data-breathe="on"] [data-part="glow"]{
animation:vibeui-surface-008-breathe 7s ease-in-out infinite;
}
@keyframes vibeui-surface-008-breathe{0%,100%{opacity:1}50%{opacity:0.62}}
[data-vibeui-block="surface-008"] [data-part="line"]{
position:absolute;left:0;right:0;pointer-events:none;
bottom:var(--vibeui-surface-008-horizon);height:2px;
background:linear-gradient(90deg,transparent,var(--vibeui-surface-008-accent) 18%,var(--vibeui-surface-008-accent) 82%,transparent);
}
[data-vibeui-block="surface-008"] [data-part="frame"]{
position:relative;max-width:80rem;margin:0 auto;min-height:30rem;
padding:4rem 1.5rem calc(var(--vibeui-surface-008-horizon) + 4rem);
display:flex;flex-direction:column;justify-content:flex-start;gap:1.25rem;
}
[data-vibeui-block="surface-008"] [data-part="kicker"]{
margin:0;display:inline-flex;align-items:center;gap:0.5rem;
font-size:0.8125rem;font-weight:620;letter-spacing:0.1em;text-transform:uppercase;
color:var(--vibeui-surface-008-muted);
}
[data-vibeui-block="surface-008"] [data-part="kicker"]::before{
content:"";width:0.5rem;height:0.5rem;background:var(--vibeui-surface-008-accent);
}
[data-vibeui-block="surface-008"] [data-part="title"]{
margin:0;max-width:22ch;
font-size:clamp(2rem,5.5cqi,3.75rem);line-height:1.05;letter-spacing:-0.02em;font-weight:660;
}
[data-vibeui-block="surface-008"] [data-part="lede"]{
margin:0;max-width:44ch;font-size:1.0625rem;line-height:1.6;
color:var(--vibeui-surface-008-muted);
}
[data-vibeui-block="surface-008"] [data-part="action"]{
align-self:flex-start;display:inline-flex;align-items:center;
min-height:2.75rem;padding:0.375rem 1.375rem;margin-top:0.5rem;
background:var(--vibeui-surface-008-accent);color:#000000;
text-decoration:none;font-size:1rem;font-weight:640;
transition:filter .16s ease;
}
[data-vibeui-block="surface-008"] [data-part="action"]:hover{filter:brightness(1.06)}
[data-vibeui-block="surface-008"] a:focus-visible{
outline:2px solid var(--vibeui-surface-008-accent);outline-offset:2px;
}
@container (min-width: 48rem){
[data-vibeui-block="surface-008"] [data-part="frame"]{padding-top:6rem;min-height:36rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="surface-008"] *{animation:none!important;transition:none!important}}
`

/** Фон-горизонт: тонкая оранжевая линия света над чёрной или белой глубиной. */
export function Surface008({
  children,
  tone = "dark",
  horizon = "low",
  breathe = true,
  accent,
  className,
  style,
}: Surface008Props) {
  const palette = {
    ...(accent ? { "--vibeui-surface-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-surface-008" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="surface-008"
        data-tone={tone === "light" ? "light" : undefined}
        data-horizon={horizon === "middle" ? "middle" : undefined}
        data-breathe={breathe ? "on" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="glow" aria-hidden="true" />
        <div data-part="line" aria-hidden="true" />
        <div data-part="frame">
          {children ?? (
            <>
              <p data-part="kicker">Релиз 4.0</p>
              <h2 data-part="title">Свет на границе возможного</h2>
              <p data-part="lede">
                Линия горизонта завершает первый экран и растворяется в
                следующей секции. Текст стоит выше света — центр никогда не
                пересвечен.
              </p>
              <a data-part="action" href="#release">
                Читать анонс
              </a>
            </>
          )}
        </div>
      </section>
    </>
  )
}
