import { useId, type ComponentProps, type CSSProperties } from "react"

export type Chart007Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  value?: number
  max?: number
  unit?: string
  target?: number
  /** Подпись шкалы для скринридера: {title}, {value}, {max}, {target}. */
  valueLabel?: string
  /** Подпись риски цели под шкалой: {target}. */
  targetLabel?: string
  /** Наполнять дугу при появлении. */
  animate?: boolean
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: полукруглая шкала для одного показателя. Полукруг честнее
// кольца там, где значение имеет предел: пустая часть дуги показывает, сколько
// осталось. Цель отмечена риской — без неё «74%» не отвечает, хорошо это или
// плохо, а сравнивать надо именно с планом.
//
// Тема берётся из color-scheme окружения через light-dark(): шкала темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="chart-007"]){
--vibeui-chart-007-bg:transparent;
--vibeui-chart-007-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-chart-007-muted:color-mix(in oklab,var(--vibeui-chart-007-fg) 68%,transparent);
--vibeui-chart-007-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-chart-007-track:light-dark(oklch(0.93 0 265),oklch(0.31 0 265));
--vibeui-chart-007-accent:light-dark(oklch(0.62 0.17 145),oklch(0.78 0.16 145));
--vibeui-chart-007-dur:1.2s;
--vibeui-chart-007-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-chart-007-mark:light-dark(oklch(0.45 0 265),oklch(0.76 0 265));
--vibeui-chart-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-007"]{color-scheme:dark}
[data-vibeui-block="chart-007"]{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
width:100%;max-width:16rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-007-bg);
border:1px solid var(--vibeui-chart-007-border);border-radius:0.875rem;
color:var(--vibeui-chart-007-fg);font-family:var(--vibeui-chart-007-font);
}
[data-vibeui-block="chart-007"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650;letter-spacing:-0.01em;align-self:flex-start}
[data-vibeui-block="chart-007"] svg{display:block;width:100%;height:auto;overflow:visible}
[data-vibeui-block="chart-007"] [data-part="track"]{
fill:none;stroke:var(--vibeui-chart-007-track);stroke-width:14;stroke-linecap:round;
}
/* Дуга значения: градиент от приглушённого акцента к яркому, свечение снаружи. */
[data-vibeui-block="chart-007"] [data-part="value"]{
fill:none;stroke-width:14;stroke-linecap:round;
filter:drop-shadow(0 0 8px color-mix(in oklab,var(--vibeui-chart-007-accent) 40%,transparent));
}
[data-vibeui-block="chart-007"] [data-part="knob"]{fill:light-dark(oklch(1 0 0),oklch(0.2 0 265));stroke:var(--vibeui-chart-007-accent);stroke-width:3}
/* Риска цели: без неё процент не отвечает, хорошо это или плохо. */
[data-vibeui-block="chart-007"] [data-part="target"]{stroke:var(--vibeui-chart-007-mark);stroke-width:2}
[data-vibeui-block="chart-007"] [data-part="number"]{
margin-top:-2.25rem;font-size:1.75rem;font-weight:700;line-height:1;letter-spacing:-0.02em;
font-variant-numeric:tabular-nums;
}
/* Появление: дуга наполняется, риска и число всплывают. */
[data-vibeui-block="chart-007"][data-animate] [data-part="value"]{
animation:vibeui-chart-007-fill var(--vibeui-chart-007-dur) var(--vibeui-chart-007-ease) both;
}
[data-vibeui-block="chart-007"][data-animate] [data-part="knob"]{
transform-box:fill-box;transform-origin:center;
animation:vibeui-chart-007-pop 0.4s var(--vibeui-chart-007-ease) calc(var(--vibeui-chart-007-dur) - 0.2s) both;
}
[data-vibeui-block="chart-007"][data-animate] [data-part="number"],[data-vibeui-block="chart-007"][data-animate] [data-part="unit"],[data-vibeui-block="chart-007"][data-animate] [data-part="legend"]{
opacity:0;animation:vibeui-chart-007-rise 0.5s var(--vibeui-chart-007-ease) 0.45s forwards;
}
[data-vibeui-block="chart-007"][data-animate] [data-part="legend"]{animation-delay:0.65s}
@keyframes vibeui-chart-007-fill{from{stroke-dasharray:0 1000}}
@keyframes vibeui-chart-007-pop{from{transform:scale(0)}60%{transform:scale(1.3)}to{transform:scale(1)}}
@keyframes vibeui-chart-007-rise{from{opacity:0;translate:0 0.3rem}to{opacity:1;translate:0 0}}
[data-vibeui-block="chart-007"] [data-part="unit"]{font-size:0.75rem;color:var(--vibeui-chart-007-muted)}
[data-vibeui-block="chart-007"] [data-part="legend"]{
display:flex;align-items:center;gap:0.375rem;font-size:0.75rem;color:var(--vibeui-chart-007-muted);
}
[data-vibeui-block="chart-007"] [data-part="tick"]{width:0.125rem;height:0.625rem;background:var(--vibeui-chart-007-mark)}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="chart-007"] *{animation:none!important;transition:none!important}
[data-vibeui-block="chart-007"][data-animate] [data-part="number"],[data-vibeui-block="chart-007"][data-animate] [data-part="unit"],[data-vibeui-block="chart-007"][data-animate] [data-part="legend"]{opacity:1}
}
`

// Полукруг радиусом 70 в системе 160×90: длина дуги нужна для штриховки.
const RADIUS = 70
const ARC = Math.PI * RADIUS

function pointAt(share: number) {
  const angle = Math.PI * (1 - share)
  return {
    x: 80 + Math.cos(angle) * RADIUS,
    y: 80 - Math.sin(angle) * RADIUS,
  }
}

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

function fillTemplate(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}

/**
 * Полукруглая шкала показателя с риской цели.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart007({
  title = "План продаж",
  value = 74,
  max = 100,
  unit = "процентов от плана",
  target = 85,
  valueLabel = "{title}: {value} из {max}, цель {target}",
  targetLabel = "Цель: {target}%",
  animate = true,
  accent,
  background = "",
  className,
  style,
  ...props
}: Chart007Props) {
  const share = Math.max(0, Math.min(1, value / (max || 1)))
  const targetShare = Math.max(0, Math.min(1, target / (max || 1)))
  const inner = pointAt(targetShare)
  const outer = {
    x: 80 + Math.cos(Math.PI * (1 - targetShare)) * (RADIUS + 9),
    y: 80 - Math.sin(Math.PI * (1 - targetShare)) * (RADIUS + 9),
  }

  const knob = pointAt(share)
  const id = useId()
  const gradient = `vc7-${id.replace(/[^a-zA-Z0-9]/g, "")}`
  const palette = {
    ...(accent ? { "--vibeui-chart-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-chart-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-007" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
        data-vibeui-block="chart-007"
        data-animate={animate ? "" : undefined}
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <svg
          viewBox="0 0 160 92"
          role="img"
          aria-label={fillTemplate(valueLabel, { title, value, max, target })}
        >
          <defs>
            <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" style={{ stopColor: "var(--vibeui-chart-007-accent)", stopOpacity: 0.55 }} />
              <stop offset="1" style={{ stopColor: "var(--vibeui-chart-007-accent)", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path data-part="track" d="M10 80 A70 70 0 0 1 150 80" />
          <path
            data-part="value"
            d="M10 80 A70 70 0 0 1 150 80"
            strokeDasharray={`${ARC * share} 1000`}
            style={{ stroke: `url(#${gradient})` }}
          />
          <circle data-part="knob" cx={knob.x} cy={knob.y} r={5} />
          <line
            data-part="target"
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
          />
        </svg>
        <span data-part="number">{value}%</span>
        <span data-part="unit">{unit}</span>
        <span data-part="legend">
          <span data-part="tick" aria-hidden="true" />
          {fillTemplate(targetLabel, { target })}
        </span>
      </figure>
    </>
  )
}
