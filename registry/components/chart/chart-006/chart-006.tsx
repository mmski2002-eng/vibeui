import { useId, type ComponentProps, type CSSProperties } from "react"

export type Chart006Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  points?: number[]
  labels?: string[]
  unit?: string
  /** Подпись графика для скринридера: {title}, {min}, {max}, {unit}. */
  rangeLabel?: string
  /** Открывать площадь при появлении и пульсировать последней точкой. */
  animate?: boolean
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: график с заливкой под линией на чистом SVG. Заливка
// подчёркивает объём, но линия остаётся главной: без неё площадь читается как
// клякса. Сетка нарисована тремя линиями — этого хватает, чтобы соотнести
// точку с осью, и не превращает график в тетрадь в клетку.
//
// Тема берётся из color-scheme окружения через light-dark(): график темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="chart-006"]){
--vibeui-chart-006-bg:transparent;
--vibeui-chart-006-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-chart-006-muted:color-mix(in oklab,var(--vibeui-chart-006-fg) 68%,transparent);
--vibeui-chart-006-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-chart-006-grid:light-dark(oklch(0.94 0 265),oklch(0.3 0 265));
--vibeui-chart-006-accent:light-dark(oklch(0.52 0.15 162),oklch(0.78 0.15 162));
--vibeui-chart-006-ring:light-dark(oklch(1 0 0),oklch(0.2 0 265));
--vibeui-chart-006-tip-bg:light-dark(oklch(0.22 0 265),oklch(0.96 0 265));
--vibeui-chart-006-tip-fg:light-dark(oklch(0.98 0 265),oklch(0.2 0 265));
--vibeui-chart-006-dur:0.9s;
--vibeui-chart-006-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-chart-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-006"]{color-scheme:dark}
[data-vibeui-block="chart-006"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:24rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-006-bg);
border:1px solid var(--vibeui-chart-006-border);border-radius:0.875rem;
color:var(--vibeui-chart-006-fg);font-family:var(--vibeui-chart-006-font);
}
[data-vibeui-block="chart-006"] [data-part="head"]{display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem}
[data-vibeui-block="chart-006"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650;letter-spacing:-0.01em}
[data-vibeui-block="chart-006"] [data-part="last"]{font-size:1.25rem;font-weight:700;letter-spacing:-0.02em;line-height:1;font-variant-numeric:tabular-nums;color:var(--vibeui-chart-006-accent)}
[data-vibeui-block="chart-006"] [data-part="plot"]{position:relative;aspect-ratio:300/110}
[data-vibeui-block="chart-006"] svg{position:absolute;inset:0;display:block;width:100%;height:100%;overflow:visible}
[data-vibeui-block="chart-006"] [data-part="grid"]{stroke:var(--vibeui-chart-006-grid);stroke-width:1;stroke-dasharray:3 4;vector-effect:non-scaling-stroke}
/* Заливка подчёркивает объём и гаснет к оси, линия остаётся главной. */
[data-vibeui-block="chart-006"] [data-part="line"]{
fill:none;stroke:var(--vibeui-chart-006-accent);stroke-width:2.25;
stroke-linejoin:round;stroke-linecap:round;vector-effect:non-scaling-stroke;
filter:drop-shadow(0 0 6px color-mix(in oklab,var(--vibeui-chart-006-accent) 45%,transparent));
}
/* Ловушки наведения и пульс последней точки — HTML поверх растянутого SVG. */
[data-vibeui-block="chart-006"] [data-part="hits"]{position:absolute;inset:0}
[data-vibeui-block="chart-006"] [data-part="hit"]{position:absolute;top:0;bottom:0;left:calc(var(--x) * 1%);width:var(--w);transform:translateX(-50%);cursor:crosshair}
[data-vibeui-block="chart-006"] [data-part="hit"]::before{content:"";position:absolute;left:50%;top:0;bottom:0;border-left:1px dashed var(--vibeui-chart-006-accent);opacity:0;transition:opacity 0.15s}
[data-vibeui-block="chart-006"] [data-part="hit"] i{
position:absolute;left:50%;top:calc(var(--y) * 1%);width:0.625rem;height:0.625rem;margin:-0.3125rem;
border-radius:50%;background:var(--vibeui-chart-006-ring);border:2px solid var(--vibeui-chart-006-accent);box-sizing:border-box;
opacity:0;transform:scale(0.5);transition:opacity 0.15s,transform 0.2s var(--vibeui-chart-006-ease);
}
[data-vibeui-block="chart-006"] [data-part="hit"]::after{
content:attr(data-value);position:absolute;left:50%;top:calc(var(--y) * 1%);
transform:translate(-50%,calc(-100% - 0.75rem)) scale(0.9);
padding:0.2rem 0.5rem;border-radius:0.375rem;white-space:nowrap;
background:var(--vibeui-chart-006-tip-bg);color:var(--vibeui-chart-006-tip-fg);
font-size:0.75rem;font-weight:600;font-variant-numeric:tabular-nums;line-height:1.3;
box-shadow:0 4px 12px rgb(0 0 0 / .18);pointer-events:none;
opacity:0;transition:opacity 0.15s,transform 0.2s var(--vibeui-chart-006-ease);
}
[data-vibeui-block="chart-006"] [data-part="hit"]:hover::before{opacity:0.6}
[data-vibeui-block="chart-006"] [data-part="hit"]:hover i{opacity:1;transform:scale(1)}
[data-vibeui-block="chart-006"] [data-part="hit"]:hover::after{opacity:1;transform:translate(-50%,calc(-100% - 0.75rem)) scale(1)}
[data-vibeui-block="chart-006"] [data-part="dot"]{
position:absolute;left:calc(var(--x) * 1%);top:calc(var(--y) * 1%);width:0.5rem;height:0.5rem;margin:-0.25rem;
border-radius:50%;background:var(--vibeui-chart-006-accent);pointer-events:none;
}
[data-vibeui-block="chart-006"] [data-part="dot"]::before{content:"";position:absolute;inset:0;border-radius:50%;background:var(--vibeui-chart-006-accent)}
[data-vibeui-block="chart-006"] [data-part="axis"]{
display:flex;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;color:var(--vibeui-chart-006-muted);
}
/* Появление: площадь и линия открываются слева направо, число всплывает. */
[data-vibeui-block="chart-006"][data-animate] [data-part="line"]{clip-path:inset(-20% 100% -20% 0);animation:vibeui-chart-006-draw var(--vibeui-chart-006-dur) var(--vibeui-chart-006-ease) forwards}
[data-vibeui-block="chart-006"][data-animate] [data-part="area"]{clip-path:inset(-20% 100% -20% 0);animation:vibeui-chart-006-draw var(--vibeui-chart-006-dur) var(--vibeui-chart-006-ease) 0.12s forwards}
[data-vibeui-block="chart-006"][data-animate] [data-part="last"]{opacity:0;translate:0 0.35rem;animation:vibeui-chart-006-rise 0.6s var(--vibeui-chart-006-ease) 0.5s forwards}
[data-vibeui-block="chart-006"][data-animate] [data-part="dot"]{opacity:0;animation:vibeui-chart-006-fade 0.3s var(--vibeui-chart-006-ease) var(--vibeui-chart-006-dur) forwards}
[data-vibeui-block="chart-006"][data-animate] [data-part="dot"]::before{animation:vibeui-chart-006-ping 2.2s cubic-bezier(0,0,.2,1) calc(var(--vibeui-chart-006-dur) + 0.2s) infinite}
@keyframes vibeui-chart-006-draw{to{clip-path:inset(-20% 0 -20% 0)}}
@keyframes vibeui-chart-006-fade{to{opacity:1}}
@keyframes vibeui-chart-006-rise{to{opacity:1;translate:0 0}}
@keyframes vibeui-chart-006-ping{0%{transform:scale(1);opacity:0.7}70%,100%{transform:scale(3.2);opacity:0}}
[data-vibeui-block="chart-006"] [data-part="unit"]{font-size:0.75rem;color:var(--vibeui-chart-006-muted)}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="chart-006"] *{animation:none!important;transition:none!important}
[data-vibeui-block="chart-006"][data-animate] [data-part="line"],[data-vibeui-block="chart-006"][data-animate] [data-part="area"]{clip-path:none}
[data-vibeui-block="chart-006"][data-animate] [data-part="last"],[data-vibeui-block="chart-006"][data-animate] [data-part="dot"]{opacity:1;translate:none}
}
`

const DEFAULT_POINTS = [18, 24, 21, 32, 29, 41, 38, 52]
const DEFAULT_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс", "Пн"]

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
 * График с заливкой под линией на чистом SVG.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart006({
  title = "Установки компонентов",
  points = DEFAULT_POINTS,
  labels = DEFAULT_LABELS,
  unit = "установок в день",
  rangeLabel = "{title}: от {min} до {max} {unit}",
  animate = true,
  accent,
  background = "",
  className,
  style,
  ...props
}: Chart006Props) {
  const width = 300
  const height = 110
  const max = Math.max(...points, 1)
  const min = Math.min(...points, 0)
  const span = max - min || 1

  const coords = points.map((point, index) => {
    const x = (index / Math.max(1, points.length - 1)) * width
    const y = height - ((point - min) / span) * (height - 10) - 5
    return { x, y }
  })

  const line = coords
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ")
  const area = `${line} L${width} ${height} L0 ${height} Z`
  const last = coords[coords.length - 1]
  const id = useId()
  const gradient = `vc6-${id.replace(/[^a-zA-Z0-9]/g, "")}`
  const hitWidth = `${100 / Math.max(1, points.length - 1)}%`
  const palette = {
    ...(accent ? { "--vibeui-chart-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-chart-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-006" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="chart"
        data-vibeui-block="chart-006"
        data-animate={animate ? "" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="head">
          <figcaption data-part="title">{title}</figcaption>
          <span data-part="last">{points[points.length - 1]}</span>
        </div>
        <div data-part="plot">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={fillTemplate(rangeLabel, { title, min, max, unit })}
        >
          <defs>
            <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style={{ stopColor: "var(--vibeui-chart-006-accent)", stopOpacity: 0.32 }} />
              <stop offset="1" style={{ stopColor: "var(--vibeui-chart-006-accent)", stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((step) => (
            <line
              key={step}
              data-part="grid"
              x1={0}
              x2={width}
              y1={height * step}
              y2={height * step}
            />
          ))}
          <path data-part="area" d={area} style={{ fill: `url(#${gradient})` }} />
          <path data-part="line" d={line} />
        </svg>
        <div data-part="hits" aria-hidden="true">
          {coords.map((coord, index) => (
            <span
              key={index}
              data-part="hit"
              data-value={`${labels[index] ?? ""} · ${points[index]}`}
              style={{ "--x": (coord.x / width) * 100, "--y": (coord.y / height) * 100, "--w": hitWidth } as CSSProperties}
            >
              <i />
            </span>
          ))}
          <span data-part="dot" style={{ "--x": (last.x / width) * 100, "--y": (last.y / height) * 100 } as CSSProperties} />
        </div>
        </div>
        <div data-part="axis">
          <span>{labels[0]}</span>
          <span>{labels[Math.floor(labels.length / 2)]}</span>
          <span>{labels[labels.length - 1]}</span>
        </div>
        <figcaption data-part="unit">{unit}</figcaption>
      </figure>
    </>
  )
}
