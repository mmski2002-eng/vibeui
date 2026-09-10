import type { CSSProperties, ReactNode } from "react"

export type Surface011Props = {
  /** Контент поверх фона. Без него блок показывает демонстрационный пример. */
  children?: ReactNode
  /** Поверхность: бумага или графит. */
  tone?: "light" | "dark"
  /** Шаг матрицы точек. */
  step?: "normal" | "sparse"
  /** Медленный оранжевый импульс в одном узле. */
  pulse?: boolean
  accent?: string
  className?: string
  style?: CSSProperties
}

// Точечное поле: регулярная матрица серых точек CSS-градиентом и один
// медленный оранжевый импульс в фиксированном узле. Для AI-инструмента,
// данных и образования. Поле затухает к центру — зона текста спокойна;
// точки не мельчают до мерцающего шума. Импульс — CSS-анимация,
// полностью отключается prefers-reduced-motion. Без JS и canvas.
const STYLES = `
:where([data-vibeui-block="surface-011"]){
--vibeui-surface-011-bg:#ffffff;
--vibeui-surface-011-ink:#000000;
--vibeui-surface-011-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-surface-011-dot:color-mix(in oklab,#000000 16%,transparent);
--vibeui-surface-011-accent:#ff5900;
--vibeui-surface-011-step:1.75rem;
--vibeui-surface-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="surface-011"][data-tone="dark"]){
--vibeui-surface-011-bg:#1a1a1a;
--vibeui-surface-011-ink:#ffffff;
--vibeui-surface-011-muted:color-mix(in oklab,#ffffff 62%,#1a1a1a);
--vibeui-surface-011-dot:color-mix(in oklab,#ffffff 18%,transparent);
}
:where([data-vibeui-block="surface-011"][data-step="sparse"]){--vibeui-surface-011-step:2.5rem}
[data-vibeui-block="surface-011"]{
position:relative;display:block;min-width:min(100%,16rem);overflow:hidden;
background:var(--vibeui-surface-011-bg);color:var(--vibeui-surface-011-ink);
font-family:var(--vibeui-surface-011-font);
}
[data-vibeui-block="surface-011"] *{box-sizing:border-box}
[data-vibeui-block="surface-011"] [data-part="field"]{
position:absolute;inset:0;pointer-events:none;
background-image:radial-gradient(var(--vibeui-surface-011-dot) 1.5px,transparent 1.5px);
background-size:var(--vibeui-surface-011-step) var(--vibeui-surface-011-step);
-webkit-mask-image:radial-gradient(120% 120% at 50% 50%,transparent 26%,#000000 64%);
mask-image:radial-gradient(120% 120% at 50% 50%,transparent 26%,#000000 64%);
}
[data-vibeui-block="surface-011"] [data-part="pulse"]{
position:absolute;top:24%;right:16%;width:0.625rem;height:0.625rem;
border-radius:999px;background:var(--vibeui-surface-011-accent);
pointer-events:none;
}
[data-vibeui-block="surface-011"][data-pulse="on"] [data-part="pulse"]::after{
content:"";position:absolute;inset:-0.375rem;border-radius:999px;
border:2px solid var(--vibeui-surface-011-accent);
animation:vibeui-surface-011-wave 4.5s ease-out infinite;
}
@keyframes vibeui-surface-011-wave{
0%{transform:scale(0.6);opacity:0.9}
70%,100%{transform:scale(2.4);opacity:0}
}
[data-vibeui-block="surface-011"][data-pulse="off"] [data-part="pulse"]{display:none}
[data-vibeui-block="surface-011"] [data-part="frame"]{
position:relative;max-width:80rem;margin:0 auto;min-height:28rem;
padding:4rem 1.5rem;display:flex;flex-direction:column;justify-content:center;gap:1.25rem;
}
[data-vibeui-block="surface-011"] [data-part="kicker"]{
margin:0;display:inline-flex;align-items:center;gap:0.5rem;
font-size:0.8125rem;font-weight:620;letter-spacing:0.1em;text-transform:uppercase;
color:var(--vibeui-surface-011-muted);
}
[data-vibeui-block="surface-011"] [data-part="kicker"]::before{
content:"";width:0.5rem;height:0.5rem;border-radius:999px;
background:var(--vibeui-surface-011-accent);
}
[data-vibeui-block="surface-011"] [data-part="title"]{
margin:0;max-width:22ch;
font-size:clamp(2rem,5.5cqi,3.75rem);line-height:1.05;letter-spacing:-0.02em;font-weight:660;
}
[data-vibeui-block="surface-011"] [data-part="lede"]{
margin:0;max-width:44ch;font-size:1.0625rem;line-height:1.6;
color:var(--vibeui-surface-011-muted);
}
[data-vibeui-block="surface-011"] a:focus-visible{
outline:2px solid var(--vibeui-surface-011-accent);outline-offset:2px;
}
@container (min-width: 48rem){
[data-vibeui-block="surface-011"] [data-part="frame"]{padding:6rem 3rem;min-height:34rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="surface-011"] *{animation:none!important;transition:none!important}
[data-vibeui-block="surface-011"][data-pulse="on"] [data-part="pulse"]::after{display:none}}
`

/** Точечное поле с затуханием к центру и одним медленным оранжевым импульсом. */
export function Surface011({
  children,
  tone = "light",
  step = "normal",
  pulse = true,
  accent,
  className,
  style,
}: Surface011Props) {
  const palette = {
    ...(accent ? { "--vibeui-surface-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-surface-011" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="surface-011"
        data-tone={tone === "dark" ? "dark" : undefined}
        data-step={step === "sparse" ? "sparse" : undefined}
        data-pulse={pulse ? "on" : "off"}
        className={className}
        style={palette}
      >
        <div data-part="field" aria-hidden="true" />
        <span data-part="pulse" aria-hidden="true" />
        <div data-part="frame">
          {children ?? (
            <>
              <p data-part="kicker">Модель · вторая версия</p>
              <h2 data-part="title">Данные складываются в поле</h2>
              <p data-part="lede">
                Матрица точек тает к центру и оставляет место работе.
                Один медленный импульс намекает на живую систему — без
                звёздного неба и мерцающего шума.
              </p>
            </>
          )}
        </div>
      </section>
    </>
  )
}
