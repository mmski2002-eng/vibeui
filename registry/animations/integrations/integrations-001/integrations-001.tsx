import type { ComponentProps, CSSProperties } from "react"

export type Integrations001Service = {
  label: string
}

export type Integrations001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  /** Пилюля справа от заголовка: число подключений и т. п. */
  badge?: string
  services?: Integrations001Service[]
  accent?: string
  /** Изометрический наклон карточки. */
  isometric?: boolean
  /** Радужное свечение под карточкой (дышит). false — плоская карточка. */
  gradient?: boolean
}

// Идея: центральное приложение и вокруг него по кругу — узлы сторонних
// сервисов, каждый соединён со центром спицей. Спицы рисуются по очереди
// (stroke-dashoffset через pathLength="1", без вычисления длины пути), а в
// момент, когда спица дорисовывается, узел на её конце «подключается» —
// пульсирует кольцом и на миг увеличивается. Порядок держит CSS custom
// property --vibeui-integrations-001-i на каждой связке — задержка всех
// трёх анимаций связки считается от неё одной формулой.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="integrations-001"]){
--vibeui-integrations-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-integrations-001-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-integrations-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-integrations-001-muted:color-mix(in oklab,var(--vibeui-integrations-001-fg) 60%,transparent);
--vibeui-integrations-001-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-integrations-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-integrations-001-hub:light-dark(oklch(0.98 0 0),oklch(0.26 0 260));
--vibeui-integrations-001-n1:oklch(0.68 0.19 25);
--vibeui-integrations-001-n2:oklch(0.76 0.15 80);
--vibeui-integrations-001-n3:oklch(0.72 0.16 150);
--vibeui-integrations-001-n4:oklch(0.66 0.15 225);
--vibeui-integrations-001-n5:oklch(0.63 0.19 300);
--vibeui-integrations-001-n6:oklch(0.7 0.16 340);
--vibeui-integrations-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="integrations-001"]{color-scheme:dark}
[data-vibeui-block="integrations-001"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-integrations-001-fg);font-family:var(--vibeui-integrations-001-font);
}
[data-vibeui-block="integrations-001"] *{box-sizing:border-box}
[data-vibeui-block="integrations-001"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="integrations-001"] [data-part="frame"]{
position:relative;isolation:isolate;padding:0.375rem;
border-radius:1.5rem;border:1px solid var(--vibeui-integrations-001-border);
background:color-mix(in oklab,var(--vibeui-integrations-001-frame) 75%,transparent);
transition:transform .3s ease;transform-origin:center;
}
[data-vibeui-block="integrations-001"] [data-part="glow"]{
position:absolute;left:0.3125rem;right:0.3125rem;bottom:0;height:5rem;z-index:0;
border-radius:9999px 9999px 0.75rem 0.75rem;
background:linear-gradient(to right,var(--vibeui-integrations-001-n1),var(--vibeui-integrations-001-n2),var(--vibeui-integrations-001-n3),var(--vibeui-integrations-001-n4),var(--vibeui-integrations-001-n5),var(--vibeui-integrations-001-n6));
filter:blur(7px);opacity:0.55;transform-origin:center bottom;
animation:vibeui-integrations-001-breathe 4.5s ease-in-out infinite;
}
[data-vibeui-block="integrations-001"][data-flat="true"] [data-part="glow"]{display:none}
[data-vibeui-block="integrations-001"] [data-part="card"]{
position:relative;z-index:1;
border-radius:1rem;border:1px solid var(--vibeui-integrations-001-border);
background:var(--vibeui-integrations-001-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="integrations-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.75rem;border-bottom:1px solid var(--vibeui-integrations-001-border);
}
[data-vibeui-block="integrations-001"] [data-part="gtitle"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="integrations-001"] [data-part="badge"]{
display:inline-flex;align-items:center;justify-content:center;
height:1rem;min-width:1rem;padding:0 0.3125rem;border-radius:9999px;
font-size:0.5625rem;font-weight:650;font-variant-numeric:tabular-nums;
color:var(--vibeui-integrations-001-accent);
background:color-mix(in oklab,var(--vibeui-integrations-001-accent) 14%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-integrations-001-accent) 22%,transparent);
}
[data-vibeui-block="integrations-001"] [data-part="hub"]{
display:block;width:100%;height:auto;padding:0.5rem 0.375rem 0.625rem;
}
[data-vibeui-block="integrations-001"] [data-part="spoke"]{
fill:none;stroke:var(--vibeui-integrations-001-border);stroke-width:1.5;
stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;
animation:vibeui-integrations-001-draw 4.8s ease-in-out infinite;
animation-delay:calc(var(--vibeui-integrations-001-i) * 0.5s);
}
[data-vibeui-block="integrations-001"] [data-part="ping"]{
opacity:0;transform-box:fill-box;transform-origin:center;
animation:vibeui-integrations-001-ping 4.8s ease-in-out infinite;
animation-delay:calc(var(--vibeui-integrations-001-i) * 0.5s);
}
[data-vibeui-block="integrations-001"] [data-part="core"]{
stroke:var(--vibeui-integrations-001-card);stroke-width:2;
transform-box:fill-box;transform-origin:center;
animation:vibeui-integrations-001-core 4.8s ease-in-out infinite;
animation-delay:calc(var(--vibeui-integrations-001-i) * 0.5s);
}
[data-vibeui-block="integrations-001"] [data-part="glyph"]{
fill:none;stroke:var(--vibeui-integrations-001-hub);stroke-width:1.6;
stroke-linecap:round;stroke-linejoin:round;
}
[data-vibeui-block="integrations-001"] [data-part="center"]{
fill:var(--vibeui-integrations-001-hub);
stroke:var(--vibeui-integrations-001-accent);stroke-width:1.6;
transform-box:fill-box;transform-origin:center;
animation:vibeui-integrations-001-hub 4.5s ease-in-out infinite;
}
[data-vibeui-block="integrations-001"] [data-part="mark"]{
fill:var(--vibeui-integrations-001-accent);
}
@keyframes vibeui-integrations-001-breathe{0%,100%{transform:scaleX(0.82)}50%{transform:scaleX(1)}}
@keyframes vibeui-integrations-001-draw{
0%{stroke-dashoffset:1;opacity:0.35}
28%{stroke-dashoffset:0;opacity:1}
82%{stroke-dashoffset:0;opacity:1}
100%{stroke-dashoffset:1;opacity:0.35}
}
@keyframes vibeui-integrations-001-ping{
0%,24%{transform:scale(0.5);opacity:0}
30%{transform:scale(0.6);opacity:0.6}
62%{transform:scale(1.9);opacity:0}
100%{transform:scale(1.9);opacity:0}
}
@keyframes vibeui-integrations-001-core{
0%,24%{transform:scale(1)}
30%{transform:scale(1.22)}
42%{transform:scale(1)}
100%{transform:scale(1)}
}
@keyframes vibeui-integrations-001-hub{0%,100%{transform:scale(1)}50%{transform:scale(1.035)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="integrations-001"] [data-part="glow"]{animation:none;transform:scaleX(0.92)}
[data-vibeui-block="integrations-001"] [data-part="spoke"]{animation:none;stroke-dashoffset:0;opacity:1}
[data-vibeui-block="integrations-001"] [data-part="ping"]{animation:none;opacity:0}
[data-vibeui-block="integrations-001"] [data-part="core"]{animation:none}
[data-vibeui-block="integrations-001"] [data-part="center"]{animation:none}
}
`

const DEFAULT_SERVICES: Integrations001Service[] = [
  { label: "Почта" },
  { label: "Чат" },
  { label: "Платежи" },
  { label: "Хранилище" },
  { label: "Аналитика" },
]

const CENTER = { x: 140, y: 96 }
const RADIUS_X = 100
const RADIUS_Y = 66
const NODE_R = 15

/** Простые абстрактные значки-плашки для узлов интеграций (без брендов). */
function nodeGlyph(index: number) {
  const k = index % 6

  if (k === 0) {
    return <circle data-part="mark" r="4.5" />
  }

  if (k === 1) {
    return <rect data-part="mark" x="-4" y="-4" width="8" height="8" rx="2" />
  }

  if (k === 2) {
    return (
      <rect
        data-part="mark"
        x="-3.6"
        y="-3.6"
        width="7.2"
        height="7.2"
        rx="1.5"
        transform="rotate(45)"
      />
    )
  }

  if (k === 3) {
    return <polygon data-part="mark" points="0,-5 4.6,3.6 -4.6,3.6" />
  }

  if (k === 4) {
    return (
      <polygon
        data-part="mark"
        points="0,-5 4.3,-2.5 4.3,2.5 0,5 -4.3,2.5 -4.3,-2.5"
      />
    )
  }

  return (
    <>
      <rect data-part="mark" x="-1.1" y="-4.4" width="2.2" height="8.8" rx="1.1" />
      <rect data-part="mark" x="-4.4" y="-1.1" width="8.8" height="2.2" rx="1.1" />
    </>
  )
}

/**
 * Радиальный хаб интеграций: центральное приложение и узлы сервисов вокруг
 * него, соединённые спицами. Спицы рисуются по очереди, узлы пульсируют в
 * момент «подключения». Один файл, ноль зависимостей, собственная палитра.
 */
export function Integrations001({
  title = "Интеграции",
  badge = "5 активно",
  services = DEFAULT_SERVICES,
  accent,
  isometric = false,
  gradient = true,
  className,
  style,
  ...props
}: Integrations001Props) {
  const palette = {
    ...(accent ? { "--vibeui-integrations-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  const count = Math.max(services.length, 1)

  const nodes = services.map((service, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / count
    const x = CENTER.x + Math.cos(angle) * RADIUS_X
    const y = CENTER.y + Math.sin(angle) * RADIUS_Y

    return { service, index, x, y }
  })

  return (
    <>
      <style href="vibeui-integrations-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="integrations-001"
        data-slot="integrations-hub"
        data-flat={gradient ? undefined : "true"}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="glow" aria-hidden="true" />
            <div data-part="card">
              <div data-part="head">
                <p data-part="gtitle">{title}</p>
                {badge ? <span data-part="badge">{badge}</span> : null}
              </div>
              <svg
                data-part="hub"
                viewBox="0 0 280 192"
                role="img"
                aria-label={title}
              >
                {nodes.map(({ index, x, y }) => (
                  <path
                    key={`spoke-${index}`}
                    data-part="spoke"
                    pathLength="1"
                    d={`M${CENTER.x} ${CENTER.y} L${x} ${y}`}
                    style={
                      {
                        "--vibeui-integrations-001-i": index,
                      } as CSSProperties
                    }
                  />
                ))}
                {nodes.map(({ service, index, x, y }) => (
                  <g
                    key={service.label}
                    data-part="node"
                    transform={`translate(${x} ${y})`}
                    style={
                      {
                        "--vibeui-integrations-001-i": index,
                      } as CSSProperties
                    }
                  >
                    <circle
                      data-part="ping"
                      r={NODE_R}
                      fill={`var(--vibeui-integrations-001-n${(index % 6) + 1})`}
                    />
                    <circle
                      data-part="core"
                      r={NODE_R}
                      fill={`var(--vibeui-integrations-001-n${(index % 6) + 1})`}
                    />
                    {nodeGlyph(index)}
                  </g>
                ))}
                <circle data-part="center" cx={CENTER.x} cy={CENTER.y} r="21" />
                <g
                  data-part="glyph"
                  transform={`translate(${CENTER.x} ${CENTER.y})`}
                >
                  <rect x="-8" y="-8" width="6.5" height="6.5" rx="1.5" />
                  <rect x="1.5" y="-8" width="6.5" height="6.5" rx="1.5" />
                  <rect x="-8" y="1.5" width="6.5" height="6.5" rx="1.5" />
                  <rect x="1.5" y="1.5" width="6.5" height="6.5" rx="1.5" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
