import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Slider003Props = Omit<
  ComponentPropsWithoutRef<"input">,
  "type" | "list" | "children"
> & {
  label?: string
  /** Подписанные ступени: их порядок и есть шкала. */
  ticks?: string[]
  accent?: string
}

// Идея компонента: ползунок по именованным ступеням, а не по числам.
// Значения вроде «раз в неделю» не выражаются цифрой в подписи, поэтому
// шкала подписана целиком: деления нарисованы повторяющимся градиентом,
// подписи стоят под ними, а сам input остаётся серверным — состояние не
// нужно, значение читает форма.
const STYLES = `
:where([data-vibeui-block="slider-003"]){
--vibeui-slider-003-bg:oklch(1 0 0);
--vibeui-slider-003-fg:oklch(0.22 0.014 265);
--vibeui-slider-003-muted:oklch(0.55 0.014 265);
--vibeui-slider-003-border:oklch(0.9 0.006 265);
--vibeui-slider-003-track:oklch(0.91 0.006 265);
--vibeui-slider-003-accent:oklch(0.52 0.14 195);
--vibeui-slider-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-slider-003-steps:3;
--vibeui-slider-003-marks:4;
}
[data-vibeui-block="slider-003"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-slider-003-bg);
border:1px solid var(--vibeui-slider-003-border);border-radius:0.875rem;
font-family:var(--vibeui-slider-003-font);color:var(--vibeui-slider-003-fg);
}
[data-vibeui-block="slider-003"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="slider-003"] [data-part="rail"]{position:relative;padding:0 0.5rem}
/* Деления — повторяющийся градиент по ширине дорожки: столько же
   вертикальных штрихов, сколько ступеней, без единого лишнего узла. */
[data-vibeui-block="slider-003"] [data-part="ticks"]{
position:absolute;left:0.5rem;right:0.5rem;top:0.4375rem;height:0.375rem;
pointer-events:none;border-radius:9999px;
background:
repeating-linear-gradient(to right,var(--vibeui-slider-003-border) 0 1.5px,transparent 1.5px calc((100% - 1.5px) / var(--vibeui-slider-003-steps))),
var(--vibeui-slider-003-track);
}
[data-vibeui-block="slider-003"] input{
appearance:none;position:relative;display:block;
width:100%;height:1.25rem;margin:0;background:none;cursor:pointer;
}
[data-vibeui-block="slider-003"] input::-webkit-slider-runnable-track{height:0.375rem;border-radius:9999px;background:transparent}
[data-vibeui-block="slider-003"] input::-moz-range-track{height:0.375rem;border-radius:9999px;background:transparent}
[data-vibeui-block="slider-003"] input::-webkit-slider-thumb{
appearance:none;margin-top:-0.34375rem;
width:1.0625rem;height:1.0625rem;border-radius:9999px;
background:var(--vibeui-slider-003-accent);border:3px solid var(--vibeui-slider-003-bg);
box-shadow:0 1px 4px oklch(0.2 0.02 265 / 32%);
}
[data-vibeui-block="slider-003"] input::-moz-range-thumb{
width:1.0625rem;height:1.0625rem;border-radius:9999px;box-sizing:border-box;
background:var(--vibeui-slider-003-accent);border:3px solid var(--vibeui-slider-003-bg);
}
[data-vibeui-block="slider-003"] input:focus-visible{outline:2px solid var(--vibeui-slider-003-accent);outline-offset:4px;border-radius:0.5rem}
/* Подписи: крайние прижаты к краям, средние центрированы под своими
   делениями — поэтому это grid с равными колонками, а не space-between. */
[data-vibeui-block="slider-003"] [data-part="marks"]{
display:grid;grid-template-columns:repeat(var(--vibeui-slider-003-marks),1fr);
margin:0;padding:0;list-style:none;
font-size:0.6875rem;line-height:1.3;color:var(--vibeui-slider-003-muted);
}
[data-vibeui-block="slider-003"] [data-part="marks"] li{text-align:center}
[data-vibeui-block="slider-003"] [data-part="marks"] li:first-child{text-align:left}
[data-vibeui-block="slider-003"] [data-part="marks"] li:last-child{text-align:right}
`

const DEFAULT_TICKS = ["Никогда", "Раз в месяц", "Раз в неделю", "Каждый день"]

/**
 * Ползунок по именованным ступеням: деления градиентом, подписи под ними.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Slider003({
  label = "Как часто присылать сводку",
  ticks = DEFAULT_TICKS,
  accent,
  id,
  className,
  style,
  defaultValue = 2,
  ...props
}: Slider003Props) {
  const last = Math.max(1, ticks.length - 1)

  const palette = {
    "--vibeui-slider-003-steps": String(last),
    "--vibeui-slider-003-marks": String(ticks.length),
    ...(accent ? { "--vibeui-slider-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-slider-003" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="slider-003" className={className} style={palette}>
        <label data-part="label" htmlFor={id}>
          {label}
        </label>
        <div data-part="rail">
          <span data-part="ticks" aria-hidden="true" />
          <input
            {...props}
            id={id}
            type="range"
            min={0}
            max={last}
            step={1}
            defaultValue={defaultValue}
            aria-valuetext={ticks[Number(defaultValue)]}
          />
        </div>
        <ul data-part="marks" aria-hidden="true">
          {ticks.map((tick) => (
            <li key={tick}>{tick}</li>
          ))}
        </ul>
      </div>
    </>
  )
}
