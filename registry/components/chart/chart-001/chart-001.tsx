import { useId, type CSSProperties } from "react"

export type Chart001Point = {
  label: string
  value: number
}

export type Chart001Props = {
  points?: Chart001Point[]
  title?: string
  /** Единица у подписей значений: «₽», «%», « ч». */
  unit?: string
  /** Отмечать точку максимума подписью. */
  markPeak?: boolean
  /** Рисовать линию при появлении и пульсировать последней точкой. */
  animate?: boolean
  /** Подпись графика для скринридера: {title}, {min}, {max}, {unit}. */
  rangeLabel?: string
  /** Локаль форматирования крупного значения. */
  locale?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: график рисуется разметкой, а не библиотекой. SVG считается
// на сервере из массива точек, поэтому клиентского JS нет вовсе, а сам график
// виден до гидратации и печатается. Заливка под линией — не украшение: она
// удерживает взгляд на области значений, а не на самой кривой.
//
// Живость без JS: линия открывается слева направо через clip-path (штриховой
// приём ломается на растянутом SVG), заливка догоняет её, последняя точка
// пульсирует; наведение — HTML-слой
// «ловушек» над каждой точкой: перекрестие и подпись значения рисует CSS.
// SVG растянут по ширине (preserveAspectRatio none), поэтому свечение
// и маркеры считаются в экранных пикселях: CSS-фильтр и HTML-точки, не SVG.
//
// Тема берётся из color-scheme окружения через light-dark(): график темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="chart-001"]){
--vibeui-chart-001-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-chart-001-muted:color-mix(in oklab,var(--vibeui-chart-001-fg) 62%,transparent);
--vibeui-chart-001-bg:transparent;
--vibeui-chart-001-border:light-dark(oklch(0.91 0 265),oklch(0.32 0 265));
--vibeui-chart-001-grid:light-dark(oklch(0.9 0 265),oklch(0.32 0 265));
--vibeui-chart-001-ring:light-dark(oklch(1 0 0),oklch(0.2 0 265));
--vibeui-chart-001-accent:light-dark(oklch(0.56 0.19 255),oklch(0.74 0.15 250));
--vibeui-chart-001-tip-bg:light-dark(oklch(0.22 0 265),oklch(0.96 0 265));
--vibeui-chart-001-tip-fg:light-dark(oklch(0.98 0 265),oklch(0.2 0 265));
--vibeui-chart-001-radius:0.875rem;
--vibeui-chart-001-dur:0.9s;
--vibeui-chart-001-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-chart-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="chart-001"]{color-scheme:dark}
[data-vibeui-block="chart-001"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;box-sizing:border-box;margin:0;padding:1.125rem 1.25rem 1rem;
border:1px solid var(--vibeui-chart-001-border);
border-radius:var(--vibeui-chart-001-radius);
background:var(--vibeui-chart-001-bg);color:var(--vibeui-chart-001-fg);
font-family:var(--vibeui-chart-001-font);
}
[data-vibeui-block="chart-001"] [data-part="head"]{display:flex;align-items:baseline;justify-content:space-between;gap:1rem}
[data-vibeui-block="chart-001"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:600;letter-spacing:-0.01em}
[data-vibeui-block="chart-001"] [data-part="last"]{
font-size:1.375rem;font-weight:650;letter-spacing:-0.02em;line-height:1;
font-variant-numeric:tabular-nums;color:var(--vibeui-chart-001-accent);
}
[data-vibeui-block="chart-001"] [data-part="plot"]{position:relative;height:8.5rem}
[data-vibeui-block="chart-001"] svg{position:absolute;inset:0;display:block;width:100%;height:100%;overflow:visible}
[data-vibeui-block="chart-001"] [data-part="grid"]{stroke:var(--vibeui-chart-001-grid);stroke-width:1;stroke-dasharray:3 4;vector-effect:non-scaling-stroke}
[data-vibeui-block="chart-001"] [data-part="line"]{
fill:none;stroke:var(--vibeui-chart-001-accent);stroke-width:2.25;
stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke;
filter:drop-shadow(0 0 6px color-mix(in oklab,var(--vibeui-chart-001-accent) 45%,transparent));
}
[data-vibeui-block="chart-001"] [data-part="peak"]{
position:absolute;left:calc(var(--x) * 1%);top:calc(var(--y) * 1%);width:0.75rem;height:0.75rem;margin:-0.375rem;
border-radius:50%;background:var(--vibeui-chart-001-ring);border:2px solid var(--vibeui-chart-001-accent);box-sizing:border-box;
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-chart-001-accent) 18%,transparent);pointer-events:none;
}
/* Ловушки наведения: столбик на каждую точку, перекрестие и подпись — CSS. */
[data-vibeui-block="chart-001"] [data-part="hits"]{position:absolute;inset:0}
[data-vibeui-block="chart-001"] [data-part="hit"]{
position:absolute;top:0;bottom:0;left:calc(var(--x) * 1%);width:var(--w);
transform:translateX(-50%);outline:none;cursor:crosshair;
}
[data-vibeui-block="chart-001"] [data-part="hit"]::before{
content:"";position:absolute;left:50%;top:0;bottom:0;border-left:1px dashed var(--vibeui-chart-001-accent);
opacity:0;transition:opacity 0.15s;
}
[data-vibeui-block="chart-001"] [data-part="hit"] i{
position:absolute;left:50%;top:calc(var(--y) * 1%);width:0.625rem;height:0.625rem;margin:-0.3125rem;
border-radius:50%;background:var(--vibeui-chart-001-ring);
border:2px solid var(--vibeui-chart-001-accent);box-sizing:border-box;
opacity:0;transform:scale(0.5);transition:opacity 0.15s,transform 0.2s var(--vibeui-chart-001-ease);
}
[data-vibeui-block="chart-001"] [data-part="hit"]::after{
content:attr(data-value);position:absolute;left:50%;top:calc(var(--y) * 1%);
transform:translate(-50%,calc(-100% - 0.75rem)) scale(0.9);
padding:0.2rem 0.5rem;border-radius:0.375rem;white-space:nowrap;
background:var(--vibeui-chart-001-tip-bg);color:var(--vibeui-chart-001-tip-fg);
font-size:0.75rem;font-weight:600;font-variant-numeric:tabular-nums;line-height:1.3;
box-shadow:0 4px 12px rgb(0 0 0 / .18);pointer-events:none;
opacity:0;transition:opacity 0.15s,transform 0.2s var(--vibeui-chart-001-ease);
}
[data-vibeui-block="chart-001"] [data-part="hit"]:hover::before,[data-vibeui-block="chart-001"] [data-part="hit"]:focus-visible::before{opacity:0.6}
[data-vibeui-block="chart-001"] [data-part="hit"]:hover i,[data-vibeui-block="chart-001"] [data-part="hit"]:focus-visible i{opacity:1;transform:scale(1)}
[data-vibeui-block="chart-001"] [data-part="hit"]:hover::after,[data-vibeui-block="chart-001"] [data-part="hit"]:focus-visible::after{opacity:1;transform:translate(-50%,calc(-100% - 0.75rem)) scale(1)}
/* Пульс последней точки. */
[data-vibeui-block="chart-001"] [data-part="pulse"]{
position:absolute;left:calc(var(--x) * 1%);top:calc(var(--y) * 1%);width:0.5rem;height:0.5rem;margin:-0.25rem;
border-radius:50%;background:var(--vibeui-chart-001-accent);pointer-events:none;
}
[data-vibeui-block="chart-001"] [data-part="pulse"]::before{
content:"";position:absolute;inset:0;border-radius:50%;background:var(--vibeui-chart-001-accent);
}
[data-vibeui-block="chart-001"] [data-part="axis"]{
display:flex;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;color:var(--vibeui-chart-001-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-001"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
/* Появление: линия прорисовывается, заливка догоняет, число всплывает. */
[data-vibeui-block="chart-001"][data-animate] [data-part="line"]{
clip-path:inset(-20% 100% -20% 0);
animation:vibeui-chart-001-draw var(--vibeui-chart-001-dur) var(--vibeui-chart-001-ease) forwards;
}
[data-vibeui-block="chart-001"][data-animate] [data-part="area"]{
clip-path:inset(-20% 100% -20% 0);opacity:0;
animation:vibeui-chart-001-draw var(--vibeui-chart-001-dur) var(--vibeui-chart-001-ease) 0.12s forwards,vibeui-chart-001-fade 0.5s var(--vibeui-chart-001-ease) 0.12s forwards;
}
[data-vibeui-block="chart-001"][data-animate] [data-part="peak"]{
transform:scale(0);
animation:vibeui-chart-001-pop 0.5s var(--vibeui-chart-001-ease) calc(var(--vibeui-chart-001-dur) - 0.15s) forwards;
}
[data-vibeui-block="chart-001"][data-animate] [data-part="last"]{
opacity:0;translate:0 0.35rem;
animation:vibeui-chart-001-rise 0.6s var(--vibeui-chart-001-ease) 0.5s forwards;
}
[data-vibeui-block="chart-001"][data-animate] [data-part="pulse"]{
opacity:0;animation:vibeui-chart-001-fade 0.3s var(--vibeui-chart-001-ease) var(--vibeui-chart-001-dur) forwards;
}
[data-vibeui-block="chart-001"][data-animate] [data-part="pulse"]::before{
animation:vibeui-chart-001-ping 2.2s cubic-bezier(0,0,.2,1) calc(var(--vibeui-chart-001-dur) + 0.2s) infinite;
}
@keyframes vibeui-chart-001-draw{to{clip-path:inset(-20% 0 -20% 0)}}
@keyframes vibeui-chart-001-fade{to{opacity:1}}
@keyframes vibeui-chart-001-pop{60%{transform:scale(1.25)}to{transform:scale(1)}}
@keyframes vibeui-chart-001-rise{to{opacity:1;translate:0 0}}
@keyframes vibeui-chart-001-ping{0%{transform:scale(1);opacity:0.7}70%,100%{transform:scale(3.2);opacity:0}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="chart-001"] *{animation:none!important;transition:none!important}
[data-vibeui-block="chart-001"][data-animate] [data-part="line"],[data-vibeui-block="chart-001"][data-animate] [data-part="area"]{clip-path:none}
[data-vibeui-block="chart-001"][data-animate] [data-part="area"],[data-vibeui-block="chart-001"][data-animate] [data-part="last"],[data-vibeui-block="chart-001"][data-animate] [data-part="pulse"]{opacity:1;translate:none}
[data-vibeui-block="chart-001"][data-animate] [data-part="peak"]{transform:none}
}
`

const DEFAULT_POINTS: Chart001Point[] = [
  { label: "Пн", value: 1240 },
  { label: "Вт", value: 1580 },
  { label: "Ср", value: 1390 },
  { label: "Чт", value: 2180 },
  { label: "Пт", value: 2640 },
  { label: "Сб", value: 1980 },
  { label: "Вс", value: 2310 },
]

const WIDTH = 320
const HEIGHT = 120

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
 * Линейный график на SVG: путь считается из точек, зависимостей нет.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart001({
  points = DEFAULT_POINTS,
  title = "Посетители за неделю",
  unit = "",
  markPeak = true,
  animate = true,
  rangeLabel = "{title}: от {min}{unit} до {max}{unit}",
  locale = "ru-RU",
  accent,
  background = "",
  className,
  style,
}: Chart001Props) {
  const id = useId()
  const gradient = `vc1-${id.replace(/[^a-zA-Z0-9]/g, "")}`
  const palette = {
    ...(accent ? { "--vibeui-chart-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-chart-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const values = points.map((point) => point.value)
  const max = Math.max(...values)
  const min = Math.min(...values)
  // Нижняя граница опускается ниже минимума: линия не должна лежать на оси.
  const floor = min - (max - min) * 0.25
  const span = max - floor || 1

  const coords = points.map((point, index) => ({
    x: (index / Math.max(1, points.length - 1)) * WIDTH,
    y: HEIGHT - ((point.value - floor) / span) * HEIGHT,
    point,
  }))

  const line = coords
    .map((coord, index) => `${index === 0 ? "M" : "L"}${coord.x} ${coord.y}`)
    .join(" ")
  const area = `${line} L${WIDTH} ${HEIGHT} L0 ${HEIGHT} Z`
  const peak = coords.reduce((best, coord) =>
    coord.point.value > best.point.value ? coord : best,
  )
  const last = coords[coords.length - 1]
  const hitWidth = `${100 / Math.max(1, points.length - 1)}%`

  return (
    <>
      <style href="vibeui-chart-001" precedence="medium">
        {STYLES}
      </style>
      <figure
        data-slot="chart"
        data-vibeui-block="chart-001"
        data-animate={animate ? "" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="head">
          <figcaption data-part="title">{title}</figcaption>
          <span data-part="last">
            {last.point.value.toLocaleString(locale)}
            {unit}
          </span>
        </div>
        <div data-part="plot">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={fillTemplate(rangeLabel, { title, min, max, unit })}
          >
            <defs>
              <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" style={{ stopColor: "var(--vibeui-chart-001-accent)", stopOpacity: 0.3 }} />
                <stop offset="1" style={{ stopColor: "var(--vibeui-chart-001-accent)", stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            {[0, 0.5, 1].map((ratio) => (
              <line
                key={ratio}
                data-part="grid"
                x1={0}
                x2={WIDTH}
                y1={HEIGHT * ratio}
                y2={HEIGHT * ratio}
              />
            ))}
            <path data-part="area" d={area} style={{ fill: `url(#${gradient})` }} />
            <path data-part="line" d={line} />
          </svg>
          <div data-part="hits" aria-hidden="true">
            {coords.map((coord) => (
              <span
                key={coord.point.label}
                data-part="hit"
                data-value={`${coord.point.label} · ${coord.point.value.toLocaleString(locale)}${unit}`}
                tabIndex={-1}
                style={
                  {
                    "--x": (coord.x / WIDTH) * 100,
                    "--y": (coord.y / HEIGHT) * 100,
                    "--w": hitWidth,
                  } as CSSProperties
                }
              >
                <i />
              </span>
            ))}
            {markPeak ? (
              <span data-part="peak" style={{ "--x": (peak.x / WIDTH) * 100, "--y": (peak.y / HEIGHT) * 100 } as CSSProperties} />
            ) : null}
            <span
              data-part="pulse"
              style={{ "--x": (last.x / WIDTH) * 100, "--y": (last.y / HEIGHT) * 100 } as CSSProperties}
            />
          </div>
        </div>
        <div data-part="axis">
          {points.map((point) => (
            <span key={point.label}>{point.label}</span>
          ))}
        </div>
      </figure>
    </>
  )
}
