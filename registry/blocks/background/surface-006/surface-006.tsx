import type { CSSProperties, ReactNode } from "react"

export type Surface006Props = {
  /** Контент поверх фона. Без него блок показывает демонстрационный пример. */
  children?: ReactNode
  /** База: светлая воздушная или графитовая насыщенная. */
  tone?: "light" | "dark"
  /** Сила света: мягкий или насыщенный. */
  intensity?: "soft" | "rich"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Мягкая градиентная сетка: несколько больших растушёванных оранжевых и
// нейтральных пятен на белой или графитовой базе. Свет концентрируется у
// края композиции, за текстом остаётся спокойное поле. Статическая
// композиция из трёх radial-gradient — без WebGL, движения и радужной
// палитры: тепло строится только из фирменного оранжевого.
const STYLES = `
:where([data-vibeui-block="surface-006"]){
--vibeui-surface-006-bg:#ffffff;
--vibeui-surface-006-ink:#000000;
--vibeui-surface-006-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-surface-006-accent:#ff5900;
--vibeui-surface-006-spot:26%;
--vibeui-surface-006-neutral:color-mix(in oklab,#000000 7%,transparent);
--vibeui-surface-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="surface-006"][data-tone="dark"]){
--vibeui-surface-006-bg:#1a1a1a;
--vibeui-surface-006-ink:#ffffff;
--vibeui-surface-006-muted:color-mix(in oklab,#ffffff 64%,#1a1a1a);
--vibeui-surface-006-spot:30%;
--vibeui-surface-006-neutral:color-mix(in oklab,#ffffff 6%,transparent);
}
:where([data-vibeui-block="surface-006"][data-intensity="rich"]){
--vibeui-surface-006-spot:42%;
}
[data-vibeui-block="surface-006"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-surface-006-bg);color:var(--vibeui-surface-006-ink);
font-family:var(--vibeui-surface-006-font);
}
[data-vibeui-block="surface-006"] *{box-sizing:border-box}
[data-vibeui-block="surface-006"] [data-part="canvas"]{
position:absolute;inset:0;overflow:hidden;pointer-events:none;
background:
radial-gradient(42rem 26rem at 84% 8%,color-mix(in oklab,var(--vibeui-surface-006-accent) var(--vibeui-surface-006-spot),transparent),transparent 66%),
radial-gradient(34rem 22rem at 4% 88%,color-mix(in oklab,var(--vibeui-surface-006-accent) calc(var(--vibeui-surface-006-spot)*0.5),transparent),transparent 62%),
radial-gradient(36rem 24rem at 46% 112%,var(--vibeui-surface-006-neutral),transparent 64%);
}
[data-vibeui-block="surface-006"] [data-part="frame"]{
position:relative;max-width:80rem;margin:0 auto;min-height:28rem;
padding:4rem 1.5rem;display:flex;flex-direction:column;justify-content:center;gap:1.25rem;
}
[data-vibeui-block="surface-006"] [data-part="chip"]{
margin:0;align-self:flex-start;display:inline-flex;align-items:center;gap:0.5rem;
padding:0.375rem 0.875rem;border-radius:999px;
border:1px solid color-mix(in oklab,var(--vibeui-surface-006-accent) 42%,transparent);
font-size:0.8125rem;font-weight:600;color:var(--vibeui-surface-006-muted);
}
[data-vibeui-block="surface-006"] [data-part="chip"]::before{
content:"";width:0.4375rem;height:0.4375rem;border-radius:999px;
background:var(--vibeui-surface-006-accent);
}
[data-vibeui-block="surface-006"] [data-part="title"]{
margin:0;max-width:22ch;
font-size:clamp(2rem,5.5cqi,3.75rem);line-height:1.05;letter-spacing:-0.02em;font-weight:660;
}
[data-vibeui-block="surface-006"] [data-part="lede"]{
margin:0;max-width:44ch;font-size:1.0625rem;line-height:1.6;
color:var(--vibeui-surface-006-muted);
}
[data-vibeui-block="surface-006"] [data-part="action"]{
align-self:flex-start;display:inline-flex;align-items:center;
min-height:2.75rem;padding:0.375rem 1.375rem;margin-top:0.5rem;border-radius:999px;
background:var(--vibeui-surface-006-accent);color:#000000;
text-decoration:none;font-size:1rem;font-weight:640;
transition:filter .16s ease;
}
[data-vibeui-block="surface-006"] [data-part="action"]:hover{filter:brightness(1.06)}
[data-vibeui-block="surface-006"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-surface-006-accent);outline-offset:2px;
}
@container (min-width: 48rem){
[data-vibeui-block="surface-006"] [data-part="frame"]{padding:6rem 3rem;min-height:34rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="surface-006"] *{animation:none!important;transition:none!important}}
`

/** Мягкий градиентный фон: тёплые растушёванные пятна на светлой или графитовой базе. */
export function Surface006({
  children,
  tone = "light",
  intensity = "soft",
  accent,
  className,
  style,
}: Surface006Props) {
  const palette = {
    ...(accent ? { "--vibeui-surface-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-surface-006" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="surface-006"
        data-tone={tone === "dark" ? "dark" : undefined}
        data-intensity={intensity === "rich" ? "rich" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="canvas" aria-hidden="true" />
        <div data-part="frame">
          {children ?? (
            <>
              <p data-part="chip">Новое приложение</p>
              <h2 data-part="title">Воздух и тёплый свет</h2>
              <p data-part="lede">
                Пятна света собираются у краёв и оставляют центр спокойным:
                заголовок и текст читаются без борьбы с фоном.
              </p>
              <a data-part="action" href="#download">
                Скачать бесплатно
              </a>
            </>
          )}
        </div>
      </section>
    </>
  )
}
