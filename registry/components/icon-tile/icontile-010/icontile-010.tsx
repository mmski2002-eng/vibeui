import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Icontile010Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  value?: number
  label?: string
  tone?: "neutral" | "accent" | "success" | "warning" | "danger"
  size?: "sm" | "md" | "lg"
}

const RADIUS = 18
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

// Идея компонента: прогресс по кругу как одна плитка. Длина обхода кольца
// посчитана один раз от фиксированного радиуса, а не подобрана на глаз —
// поэтому число в центре и заполнение кольца никогда не расходятся. Поворот
// кольца сделан CSS-трансформом всего svg, а не пересчётом координат каждой
// окружности. Значение объявлено через role="progressbar": заполнение кольца
// цветом — это иллюстрация, а не замена доступного состояния прогресса.
const STYLES = `
:where([data-vibeui-block="icontile-010"]){
container-type:inline-size;
--vibeui-icontile-010-size:3.75rem;
--vibeui-icontile-010-hue:262;
--vibeui-icontile-010-chroma:0.05;
--vibeui-icontile-010-fg:oklch(0.26 0.014 265);
--vibeui-icontile-010-muted:oklch(0.52 0.014 265);
--vibeui-icontile-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="icontile-010"]{
display:inline-flex;flex-direction:column;align-items:center;gap:0.5rem;
font-family:var(--vibeui-icontile-010-font);
}
[data-vibeui-block="icontile-010"] [data-part="ring"]{
position:relative;display:grid;place-items:center;flex:none;
width:var(--vibeui-icontile-010-size);height:var(--vibeui-icontile-010-size);
}
[data-vibeui-block="icontile-010"] [data-part="ring"] svg{
width:100%;height:100%;transform:rotate(-90deg);transform-origin:50% 50%;
}
[data-vibeui-block="icontile-010"] [data-part="track"]{
fill:none;stroke-width:4;
stroke:oklch(0.9 0.012 var(--vibeui-icontile-010-hue));
}
[data-vibeui-block="icontile-010"] [data-part="value"]{
fill:none;stroke-width:4;stroke-linecap:round;
stroke:oklch(0.5 calc(var(--vibeui-icontile-010-chroma) * 4) var(--vibeui-icontile-010-hue));
transition:stroke-dashoffset 0.3s ease;
}
[data-vibeui-block="icontile-010"] [data-part="percent"]{
position:absolute;inset:0;display:grid;place-items:center;
font-size:calc(var(--vibeui-icontile-010-size) * 0.24);font-weight:650;
color:var(--vibeui-icontile-010-fg);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="icontile-010"] [data-part="label"]{
margin:0;font-size:0.75rem;color:var(--vibeui-icontile-010-muted);text-align:center;
}
[data-vibeui-block="icontile-010"][data-size="sm"]{--vibeui-icontile-010-size:3rem}
[data-vibeui-block="icontile-010"][data-size="lg"]{--vibeui-icontile-010-size:4.75rem}
[data-vibeui-block="icontile-010"][data-tone="neutral"]{--vibeui-icontile-010-chroma:0.015}
[data-vibeui-block="icontile-010"][data-tone="success"]{--vibeui-icontile-010-hue:152}
[data-vibeui-block="icontile-010"][data-tone="warning"]{--vibeui-icontile-010-hue:75}
[data-vibeui-block="icontile-010"][data-tone="danger"]{--vibeui-icontile-010-hue:25}
@container (max-width: 72px){
[data-vibeui-block="icontile-010"] [data-part="label"]{display:none}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="icontile-010"] [data-part="value"]{transition:none!important}
}
`

/**
 * Плитка с прогрессом по кругу: длина обхода кольца посчитана от радиуса
 * один раз, состояние объявлено role="progressbar".
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Icontile010({
  value = 72,
  label = "Профиль заполнен",
  tone = "accent",
  size = "md",
  className,
  style,
  ...props
}: Icontile010Props) {
  const clamped = Math.min(100, Math.max(0, value))
  const rounded = Math.round(clamped)
  const offset = CIRCUMFERENCE * (1 - clamped / 100)

  return (
    <>
      <style href="vibeui-icontile-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="icontile-010"
        data-tone={tone}
        data-size={size}
        className={className}
        style={style as CSSProperties}
      >
        <div
          data-part="ring"
          role="progressbar"
          aria-valuenow={rounded}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        >
          <svg viewBox="0 0 44 44" aria-hidden="true">
            <circle data-part="track" cx="22" cy="22" r={RADIUS} />
            <circle
              data-part="value"
              cx="22"
              cy="22"
              r={RADIUS}
              style={
                {
                  strokeDasharray: CIRCUMFERENCE,
                  strokeDashoffset: offset,
                } as CSSProperties
              }
            />
          </svg>
          <span data-part="percent">{rounded}%</span>
        </div>
        <p data-part="label">{label}</p>
      </div>
    </>
  )
}
