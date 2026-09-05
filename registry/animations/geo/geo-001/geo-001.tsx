import type { ComponentProps, CSSProperties } from "react"

export type Geo001Props = Omit<ComponentProps<"section">, "children"> & {
  /** Текст для aria-label: секция декоративна, содержимого для чтения нет. */
  label?: string
  accent?: string
  /** Тонкие линии экватора, меридиана и рамки сферы. */
  grid?: boolean
  /** Маркеры городов с пульсом и дуги-соединения между ними. */
  markers?: boolean
  paused?: boolean
}

// Идея: глобус из точек-континентов, который вращается бесконечной
// прокруткой без единой строки JS. Точки лежат в полосе шириной ровно
// с диаметр сферы, полоса продублирована и едет по translateX на свою же
// ширину — шов невидим, а само вращение продают не поворотом (это плоские
// точки), а круглый clip-path сферы: у полюсов доступная под clip ширина
// естественно сужается, и ряды точек читаются короче ровно там, где сфера
// должна закругляться. Поверх — маркеры городов с пульсом и дуги
// маршрутов между ними (пунктир бежит через stroke-dashoffset), они не
// участвуют в прокрутке и всегда развёрнуты к зрителю. Радиальный
// градиент поверх сферы одновременно даёт блик сверху слева и лёгкое
// затемнение к краю — простая имитация объёма без теней.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="geo-001"]){
--vibeui-geo-001-bg-top:light-dark(oklch(0.94 0.006 260),oklch(0.19 0.012 260));
--vibeui-geo-001-bg-bottom:light-dark(oklch(0.88 0.01 260),oklch(0.09 0.01 260));
--vibeui-geo-001-fg:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-geo-001-border:light-dark(oklch(0.82 0.02 240),oklch(0.34 0.02 240));
--vibeui-geo-001-ocean:light-dark(oklch(0.88 0.03 235),oklch(0.28 0.045 235));
--vibeui-geo-001-land:light-dark(oklch(0.52 0.09 165),oklch(0.66 0.1 165));
--vibeui-geo-001-grid:color-mix(in oklab,var(--vibeui-geo-001-fg) 22%,transparent);
--vibeui-geo-001-accent:light-dark(oklch(0.63 0.19 32),oklch(0.73 0.17 32));
--vibeui-geo-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="geo-001"]{color-scheme:dark}
[data-vibeui-block="geo-001"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-geo-001-fg);font-family:var(--vibeui-geo-001-font);
}
[data-vibeui-block="geo-001"] *{box-sizing:border-box}
[data-vibeui-block="geo-001"] [data-part="stage"]{
position:relative;isolation:isolate;display:flex;align-items:center;justify-content:center;
padding:1.5rem;border-radius:1.5rem;min-height:14rem;
border:1px solid var(--vibeui-geo-001-border);
background:linear-gradient(to bottom,var(--vibeui-geo-001-bg-top),var(--vibeui-geo-001-bg-bottom));
}
[data-vibeui-block="geo-001"] svg{display:block;width:11rem;height:11rem;overflow:visible}
[data-vibeui-block="geo-001"] [data-part="ocean"]{
fill:var(--vibeui-geo-001-ocean);stroke:var(--vibeui-geo-001-border);stroke-width:1;
}
[data-vibeui-block="geo-001"] [data-part="land"]{fill:var(--vibeui-geo-001-land)}
[data-vibeui-block="geo-001"] [data-part="dots-scroll"]{
animation:vibeui-geo-001-spin 16s linear infinite;
}
[data-vibeui-block="geo-001"] [data-part="grid"]{
fill:none;stroke:var(--vibeui-geo-001-grid);stroke-width:0.6;stroke-dasharray:1.5 3;
}
[data-vibeui-block="geo-001"][data-grid="false"] [data-part="grid"]{display:none}
[data-vibeui-block="geo-001"] [data-part="markers"]{color:var(--vibeui-geo-001-accent)}
[data-vibeui-block="geo-001"][data-markers="false"] [data-part="markers"]{display:none}
[data-vibeui-block="geo-001"] [data-part="arc"]{
fill:none;stroke:var(--vibeui-geo-001-accent);stroke-width:1;opacity:0.65;
stroke-dasharray:3 3;animation:vibeui-geo-001-flow 1.1s linear infinite;
}
[data-vibeui-block="geo-001"] [data-part="marker"]{fill:var(--vibeui-geo-001-accent)}
[data-vibeui-block="geo-001"] [data-part="ping"]{
fill:none;stroke:var(--vibeui-geo-001-accent);stroke-width:1.2;
transform-box:fill-box;transform-origin:center;
animation:vibeui-geo-001-ping 2.2s ease-out infinite;
}
[data-vibeui-block="geo-001"] [data-part="shade"]{pointer-events:none}
[data-vibeui-block="geo-001"][data-paused="true"] *{animation-play-state:paused!important}
@keyframes vibeui-geo-001-spin{from{transform:translateX(0)}to{transform:translateX(-156px)}}
@keyframes vibeui-geo-001-flow{to{stroke-dashoffset:-12}}
@keyframes vibeui-geo-001-ping{0%{transform:scale(0.9);opacity:0.6}80%,100%{transform:scale(1.9);opacity:0}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="geo-001"] [data-part="dots-scroll"]{animation:none}
[data-vibeui-block="geo-001"] [data-part="arc"]{animation:none;opacity:0.35}
[data-vibeui-block="geo-001"] [data-part="ping"]{animation:none;opacity:0}
}
`

// Полоса шириной 156 (диаметр сферы), точки сгруппированы в четыре
// блобообразных кластера — условные материки, не географическая карта.
const DOTS: [number, number, number][] = [
  [22, 26, 1.8],
  [30, 24, 1.6],
  [18, 40, 2],
  [26, 42, 2.2],
  [34, 40, 1.8],
  [16, 58, 1.8],
  [24, 60, 2.4],
  [32, 58, 2],
  [40, 56, 1.6],
  [20, 78, 2],
  [28, 80, 2.4],
  [36, 78, 2],
  [18, 98, 1.8],
  [26, 100, 2.2],
  [34, 98, 1.8],
  [24, 118, 1.8],
  [30, 120, 2],
  [22, 134, 1.6],
  [70, 20, 1.6],
  [78, 18, 1.6],
  [64, 34, 1.8],
  [72, 32, 2.2],
  [80, 34, 1.8],
  [88, 32, 1.6],
  [68, 52, 2],
  [76, 54, 2.4],
  [84, 52, 2],
  [92, 50, 1.6],
  [66, 72, 1.8],
  [74, 74, 2.2],
  [82, 72, 1.8],
  [70, 94, 2],
  [78, 96, 2.4],
  [86, 94, 1.8],
  [74, 114, 1.8],
  [80, 116, 2],
  [76, 132, 1.6],
  [110, 20, 1.8],
  [120, 18, 2],
  [130, 22, 1.8],
  [140, 26, 1.6],
  [106, 38, 2],
  [116, 36, 2.4],
  [126, 38, 2],
  [136, 40, 1.8],
  [108, 56, 1.8],
  [118, 58, 2.2],
  [128, 56, 1.8],
  [138, 54, 1.6],
  [112, 74, 1.6],
  [122, 76, 2],
  [132, 74, 1.6],
  [118, 112, 1.4],
  [128, 116, 1.6],
  [112, 128, 1.4],
  [134, 126, 1.6],
]

const MARKERS: { x: number; y: number }[] = [
  { x: 30, y: 60 },
  { x: 78, y: 54 },
  { x: 124, y: 58 },
]

/**
 * Вращающийся глобус из точек-континентов с маркерами городов и дугами
 * соединений. Один файл, ноль зависимостей, собственная палитра, вся
 * анимация на CSS.
 */
export function Geo001({
  label = "Вращающийся глобус с маркерами городов и линиями соединений",
  accent,
  grid = true,
  markers = true,
  paused = false,
  className,
  style,
  ...props
}: Geo001Props) {
  const palette = {
    ...(accent ? { "--vibeui-geo-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-geo-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="geo-001"
        data-slot="geo-globe"
        data-grid={grid ? undefined : "false"}
        data-markers={markers ? undefined : "false"}
        data-paused={paused ? "true" : undefined}
        className={className}
        style={palette}
        role="img"
        aria-label={label}
      >
        <div data-part="stage">
          <svg viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <clipPath id="vibeui-geo-001-clip">
                <circle cx="78" cy="78" r="78" />
              </clipPath>
              <radialGradient
                id="vibeui-geo-001-sphere"
                cx="35%"
                cy="30%"
                r="75%"
              >
                <stop offset="0%" stopColor="#fff" stopOpacity="0.32" />
                <stop offset="45%" stopColor="#fff" stopOpacity="0" />
                <stop offset="100%" stopColor="#000" stopOpacity="0.4" />
              </radialGradient>
            </defs>
            <g transform="translate(22 22)">
              <circle data-part="ocean" cx="78" cy="78" r="78" />
              <g clipPath="url(#vibeui-geo-001-clip)">
                <g data-part="dots-scroll">
                  <g transform="translate(0 0)">
                    {DOTS.map(([x, y, r], index) => (
                      <circle
                        key={`geo-001-dot-a-${index}`}
                        data-part="land"
                        cx={x}
                        cy={y}
                        r={r}
                      />
                    ))}
                  </g>
                  <g transform="translate(156 0)">
                    {DOTS.map(([x, y, r], index) => (
                      <circle
                        key={`geo-001-dot-b-${index}`}
                        data-part="land"
                        cx={x}
                        cy={y}
                        r={r}
                      />
                    ))}
                  </g>
                </g>
                <g data-part="markers">
                  <path data-part="arc" d="M30 60 Q54 30 78 54" />
                  <path data-part="arc" d="M78 54 Q101 28 124 58" />
                  {MARKERS.map((marker, index) => (
                    <g key={`geo-001-marker-${index}`}>
                      <circle
                        data-part="ping"
                        cx={marker.x}
                        cy={marker.y}
                        r="2.6"
                      />
                      <circle
                        data-part="marker"
                        cx={marker.x}
                        cy={marker.y}
                        r="2.2"
                      />
                    </g>
                  ))}
                </g>
              </g>
              <g data-part="grid">
                <ellipse cx="78" cy="78" rx="78" ry="17" />
                <ellipse cx="78" cy="78" rx="17" ry="78" />
                <circle cx="78" cy="78" r="78" />
              </g>
              <circle
                data-part="shade"
                cx="78"
                cy="78"
                r="78"
                fill="url(#vibeui-geo-001-sphere)"
              />
            </g>
          </svg>
        </div>
      </section>
    </>
  )
}
