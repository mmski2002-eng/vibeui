import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Progress007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  /** Сколько единиц работы уже сделано: честное число вместо выдуманной доли. */
  processed?: number
  unit?: string
  elapsed?: string
}

// Идея компонента: длительность неизвестна, поэтому доли нет вовсе. Дорожка
// залита штриховкой во всю ширину, движение задано background-position, а
// вместо процентов показан счётчик уже сделанной работы — единственное
// число, которое здесь честно. aria-valuenow сознательно не выставлен.
const STYLES = `
:where([data-vibeui-block="progress-007"]){
--vibeui-progress-007-bg:oklch(1 0 0);
--vibeui-progress-007-fg:oklch(0.25 0.016 265);
--vibeui-progress-007-muted:oklch(0.56 0.014 265);
--vibeui-progress-007-border:oklch(0.9 0.006 265);
--vibeui-progress-007-track:oklch(0.93 0.005 265);
--vibeui-progress-007-accent:oklch(0.6 0.15 262);
--vibeui-progress-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="progress-007"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.9375rem 1.0625rem;
background:var(--vibeui-progress-007-bg);
border:1px solid var(--vibeui-progress-007-border);border-radius:0.875rem;
font-family:var(--vibeui-progress-007-font);color:var(--vibeui-progress-007-fg);
}
[data-vibeui-block="progress-007"] [data-part="head"]{
display:flex;align-items:center;gap:0.5rem;font-size:0.8125rem;font-weight:650;
}
/* Точка-маячок: подпись остаётся живой, даже когда полосу не видно. */
[data-vibeui-block="progress-007"] [data-part="pip"]{
flex:none;width:0.4375rem;height:0.4375rem;border-radius:9999px;
background:var(--vibeui-progress-007-accent);
animation:vibeui-progress-007-pulse 1.6s ease-in-out infinite;
}
/* Штриховка едет по всей дорожке: конца у неё нет, и это честно. */
[data-vibeui-block="progress-007"] [data-part="track"]{
height:0.5rem;border-radius:9999px;overflow:hidden;
background-color:var(--vibeui-progress-007-track);
background-image:repeating-linear-gradient(
115deg,
var(--vibeui-progress-007-accent) 0 0.5rem,
color-mix(in oklch,var(--vibeui-progress-007-accent) 45%,var(--vibeui-progress-007-track)) 0.5rem 1rem);
background-size:2rem 100%;
animation:vibeui-progress-007-drift 0.9s linear infinite;
}
@keyframes vibeui-progress-007-drift{
0%{background-position:0 0}
100%{background-position:-2rem 0}
}
@keyframes vibeui-progress-007-pulse{
0%,100%{opacity:1}
50%{opacity:.3}
}
[data-vibeui-block="progress-007"] [data-part="foot"]{
display:flex;justify-content:space-between;gap:0.75rem;
font-size:0.6875rem;color:var(--vibeui-progress-007-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="progress-007"] [data-part="foot"] strong{
color:var(--vibeui-progress-007-fg);font-weight:650;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="progress-007"] *{animation:none!important;transition:none!important}
[data-vibeui-block="progress-007"] [data-part="track"]{background-image:none;background-color:color-mix(in oklch,var(--vibeui-progress-007-accent) 35%,var(--vibeui-progress-007-track))}
}
`

/**
 * Неопределённый прогресс: штриховка вместо доли, счётчик вместо процента.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Progress007({
  label = "Индексируем архив",
  processed = 12_480,
  unit = "документов",
  elapsed = "идёт 3 мин",
  className,
  style,
  ...props
}: Progress007Props) {
  return (
    <>
      <style href="vibeui-progress-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="progress-007"
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="head">
          <span data-part="pip" aria-hidden="true" />
          <span>{label}</span>
        </div>
        <div
          data-part="track"
          role="progressbar"
          aria-label={label}
          aria-valuetext="Длительность неизвестна"
        />
        <div data-part="foot">
          <span>
            обработано <strong>{processed.toLocaleString("ru-RU")}</strong>{" "}
            {unit}
          </span>
          <span>{elapsed}</span>
        </div>
      </div>
    </>
  )
}
