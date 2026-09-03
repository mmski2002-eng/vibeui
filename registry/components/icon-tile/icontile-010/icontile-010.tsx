import type { ComponentProps, CSSProperties } from "react"

export type Icontile010Props = Omit<ComponentProps<"div">, "children"> & {
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
/* Без container-type: плитка размером с содержимое, а контейнер отвязал бы
   её ширину от кольца и подписи — во флексовом кадре осталось бы ноль. */
:where([data-vibeui-block="icontile-010"]){
--vibeui-icontile-010-size:3.75rem;
--vibeui-icontile-010-hue:262;
--vibeui-icontile-010-chroma:0.05;
--vibeui-icontile-010-fg:light-dark(oklch(0.26 0.014 265),oklch(0.93 0.006 265));
--vibeui-icontile-010-muted:color-mix(in oklab,var(--vibeui-icontile-010-fg) 68%,transparent);
--vibeui-icontile-010-track:light-dark(oklch(0.9 0.012 var(--vibeui-icontile-010-hue)),oklch(0.36 0.016 var(--vibeui-icontile-010-hue)));
--vibeui-icontile-010-arc:light-dark(oklch(0.5 calc(var(--vibeui-icontile-010-chroma) * 4) var(--vibeui-icontile-010-hue)),oklch(0.75 calc(var(--vibeui-icontile-010-chroma) * 3.4) var(--vibeui-icontile-010-hue)));
--vibeui-icontile-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="icontile-010"]{color-scheme:dark}
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
stroke:var(--vibeui-icontile-010-track);
}
[data-vibeui-block="icontile-010"] [data-part="value"]{
fill:none;stroke-width:4;stroke-linecap:round;
stroke:var(--vibeui-icontile-010-arc);
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
        data-slot="icon-tile"
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
