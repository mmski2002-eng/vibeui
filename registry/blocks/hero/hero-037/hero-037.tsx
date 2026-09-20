"use client"

import { useState, type CSSProperties, type ReactNode } from "react"

export type Hero037Room = {
  name: string
  /** Площадь, м². */
  area: number
  /** Прямоугольник комнаты в координатах плана 640×420. */
  x: number
  y: number
  w: number
  h: number
  /** Что показать в подписи при наведении: «два окна, ламинат». */
  note?: string
}

export type Hero037Door = {
  x: number
  y: number
  /** Ширина проёма и направление дуги: «h» — в горизонтальной стене, «v» — в вертикальной. */
  size?: number
  axis?: "h" | "v"
  flip?: boolean
}

export type Hero037Props = {
  eyebrow?: string
  /** Слово в *звёздочках* получает размерную линию с подписью measure. */
  title?: string
  measure?: string
  lede?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  /** Факты моно-строкой под кнопками. */
  facts?: readonly string[]
  rooms?: readonly Hero037Room[]
  doors?: readonly Hero037Door[]
  /** Окна — отрезки на наружной стене: x1,y1,x2,y2. */
  windows?: readonly (readonly [number, number, number, number])[]
  /** Штамп чертежа: пары «ключ — значение». */
  stamp?: readonly (readonly [string, string])[]
  /** Габариты для размерных линий по низу и справа. */
  widthLabel?: string
  heightLabel?: string
  /** Единица площади, разделитель дробной части, aria плана и подсказка. */
  areaUnit?: string
  decimalSeparator?: string
  planLabel?: string
  hintLine?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Хиро ремонтной бригады на миллиметровке: слева заголовок, у которого
// ключевое слово взято в размерную линию с подписью «± 1 мм», лид, две
// кнопки и строка фактов моно. Справа — план квартиры в svg: стены
// прорисовываются штрихом по загрузке (stroke-dashoffset с задержками),
// потом проявляются двери, окна и размерные линии. Комната под курсором
// или в фокусе заливается акцентом и показывает площадь, под планом
// подпись меняется на «Гостиная · 24,6 м² · два окна». Внизу штамп
// чертежа: объект, масштаб, лист.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-037"]){
--vibeui-hero-037-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-hero-037-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-037-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-037-on-accent:oklch(from var(--vibeui-hero-037-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-037-muted:color-mix(in oklab,var(--vibeui-hero-037-fg) 62%,var(--vibeui-hero-037-bg));
--vibeui-hero-037-line:color-mix(in oklab,var(--vibeui-hero-037-fg) 16%,transparent);
--vibeui-hero-037-grid:color-mix(in oklab,var(--vibeui-hero-037-fg) 9%,transparent);
--vibeui-hero-037-grid-fine:color-mix(in oklab,var(--vibeui-hero-037-fg) 4%,transparent);
--vibeui-hero-037-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-037-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-037-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-037"]{color-scheme:dark}
:where([data-vibeui-block="hero-037"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-037"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-037"]{box-sizing:border-box;position:relative;padding:clamp(3rem,7cqi,5.5rem) 0 clamp(3rem,6cqi,4.5rem);background-color:var(--vibeui-hero-037-bg);background-image:linear-gradient(var(--vibeui-hero-037-grid) 1px,transparent 1px),linear-gradient(90deg,var(--vibeui-hero-037-grid) 1px,transparent 1px),linear-gradient(var(--vibeui-hero-037-grid-fine) 1px,transparent 1px),linear-gradient(90deg,var(--vibeui-hero-037-grid-fine) 1px,transparent 1px);background-size:5rem 5rem,5rem 5rem,1rem 1rem,1rem 1rem;color:var(--vibeui-hero-037-fg);font-family:var(--vibeui-hero-037-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-037"] *{box-sizing:border-box}
[data-vibeui-block="hero-037"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:3rem;align-items:center}
[data-vibeui-block="hero-037"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 1.4rem;font-family:var(--vibeui-hero-037-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-hero-037-muted)}
[data-vibeui-block="hero-037"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-hero-037-accent)}
[data-vibeui-block="hero-037"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-037-display);font-weight:800;font-size:clamp(2.6rem,7cqi,5.4rem);line-height:.98;letter-spacing:-.04em;text-wrap:balance}
[data-vibeui-block="hero-037"] [data-part="dim"]{position:relative;display:inline-block;padding-top:.55em;white-space:nowrap}
[data-vibeui-block="hero-037"] [data-part="dim"]::before{content:"";position:absolute;left:0;right:0;top:.24em;height:.2em;border:1px solid var(--vibeui-hero-037-accent);border-bottom:0;animation:vibeui-hero-037-dim 1s cubic-bezier(.2,.8,.2,1) .9s both}
[data-vibeui-block="hero-037"] [data-part="dim"]::after{content:attr(data-dim);position:absolute;left:50%;top:0;transform:translateX(-50%);padding:0 .35em;line-height:1;opacity:0;background:var(--vibeui-hero-037-bg);font-family:var(--vibeui-hero-037-mono);font-weight:500;font-size:.2em;letter-spacing:.04em;color:var(--vibeui-hero-037-accent);animation:vibeui-hero-037-fade .5s ease-out 1.6s both}
[data-vibeui-block="hero-037"] [data-part="lede"]{margin:1.4rem 0 0;max-width:32rem;font-size:1.08rem;color:var(--vibeui-hero-037-muted)}
[data-vibeui-block="hero-037"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:.7rem;margin:1.8rem 0 0}
[data-vibeui-block="hero-037"] [data-part="primary"],[data-vibeui-block="hero-037"] [data-part="secondary"]{display:inline-flex;align-items:center;gap:.5rem;padding:.9rem 1.4rem;border-radius:.4rem;font-weight:600;text-decoration:none;font-size:.95rem;transition:transform .18s,box-shadow .2s,background .2s}
[data-vibeui-block="hero-037"] [data-part="primary"]{background:var(--vibeui-hero-037-accent);color:var(--vibeui-hero-037-on-accent);box-shadow:0 0 0 1px color-mix(in oklab,var(--vibeui-hero-037-fg) 20%,transparent) inset}
[data-vibeui-block="hero-037"] [data-part="primary"]:hover{transform:translateY(-2px);box-shadow:0 0 0 1px color-mix(in oklab,var(--vibeui-hero-037-fg) 20%,transparent) inset,0 14px 30px -12px var(--vibeui-hero-037-accent)}
[data-vibeui-block="hero-037"] [data-part="secondary"]{color:var(--vibeui-hero-037-fg);border:1px solid var(--vibeui-hero-037-line)}
[data-vibeui-block="hero-037"] [data-part="secondary"]:hover{background:color-mix(in oklab,var(--vibeui-hero-037-fg) 7%,transparent)}
[data-vibeui-block="hero-037"] a:focus-visible,[data-vibeui-block="hero-037"] [data-part="room"]:focus-visible{outline:2px solid var(--vibeui-hero-037-accent);outline-offset:3px}
[data-vibeui-block="hero-037"] [data-part="facts"]{display:flex;flex-wrap:wrap;gap:.4rem 1.2rem;margin:2rem 0 0;padding:0;list-style:none;font-family:var(--vibeui-hero-037-mono);font-size:.74rem;letter-spacing:.02em;color:var(--vibeui-hero-037-muted)}
[data-vibeui-block="hero-037"] [data-part="facts"] li::before{content:"■ ";color:var(--vibeui-hero-037-accent);font-size:.6em;vertical-align:.2em}
[data-vibeui-block="hero-037"] [data-part="sheet"]{position:relative;border:1px solid var(--vibeui-hero-037-line);background:color-mix(in oklab,var(--vibeui-hero-037-bg) 60%,transparent);padding:1rem 1rem .8rem;box-shadow:0 30px 60px -40px rgb(0 0 0 / .6)}
[data-vibeui-block="hero-037"] [data-part="sheet"]::before{content:"";position:absolute;inset:.45rem;border:1px solid var(--vibeui-hero-037-line);pointer-events:none}
[data-vibeui-block="hero-037"] [data-part="plan"]{display:block;width:100%;height:auto;font-family:var(--vibeui-hero-037-mono)}
[data-vibeui-block="hero-037"] [data-part="wall"]{fill:none;stroke:var(--vibeui-hero-037-fg);stroke-width:3;stroke-linejoin:miter;stroke-dasharray:1;stroke-dashoffset:1;animation:vibeui-hero-037-draw 1.3s cubic-bezier(.4,0,.2,1) forwards}
[data-vibeui-block="hero-037"] [data-part="gap"]{fill:var(--vibeui-hero-037-bg);opacity:0;animation:vibeui-hero-037-fade .3s ease-out 1.5s forwards}
[data-vibeui-block="hero-037"] [data-part="door"]{fill:none;stroke:var(--vibeui-hero-037-accent);stroke-width:1.5;stroke-dasharray:1;stroke-dashoffset:1;animation:vibeui-hero-037-draw .6s ease-out 1.6s forwards}
[data-vibeui-block="hero-037"] [data-part="window"]{stroke:var(--vibeui-hero-037-accent);stroke-width:5;opacity:0;animation:vibeui-hero-037-fade .4s ease-out 1.5s forwards}
[data-vibeui-block="hero-037"] [data-part="room"]{cursor:pointer;outline:none}
[data-vibeui-block="hero-037"] [data-part="room"] rect{fill:var(--vibeui-hero-037-accent);opacity:0;transition:opacity .25s}
[data-vibeui-block="hero-037"] [data-part="room"]:hover rect,[data-vibeui-block="hero-037"] [data-part="room"]:focus-visible rect,[data-vibeui-block="hero-037"] [data-part="room"][data-active="true"] rect{opacity:.22}
[data-vibeui-block="hero-037"] [data-part="room"] text{fill:var(--vibeui-hero-037-fg);font-family:var(--vibeui-hero-037-font);font-size:13px;font-weight:500;opacity:0;animation:vibeui-hero-037-fade .5s ease-out 1.9s forwards;pointer-events:none}
[data-vibeui-block="hero-037"] [data-part="room"] text[data-area]{font-family:var(--vibeui-hero-037-mono);font-size:12px;fill:var(--vibeui-hero-037-muted);animation-delay:2.1s}
[data-vibeui-block="hero-037"] [data-part="room"]:hover text[data-area],[data-vibeui-block="hero-037"] [data-part="room"][data-active="true"] text[data-area]{fill:var(--vibeui-hero-037-fg)}
[data-vibeui-block="hero-037"] [data-part="size"]{stroke:var(--vibeui-hero-037-muted);stroke-width:1;fill:none;opacity:0;animation:vibeui-hero-037-fade .5s ease-out 2s forwards}
[data-vibeui-block="hero-037"] [data-part="size-text"]{fill:var(--vibeui-hero-037-muted);font-size:11px;letter-spacing:.04em;opacity:0;animation:vibeui-hero-037-fade .5s ease-out 2.1s forwards}
[data-vibeui-block="hero-037"] [data-part="foot"]{display:grid;gap:.8rem;margin-top:.6rem;padding-top:.7rem;border-top:1px solid var(--vibeui-hero-037-line)}
[data-vibeui-block="hero-037"] [data-part="caption"]{margin:0;min-height:2.6em;font-size:.88rem;color:var(--vibeui-hero-037-muted)}
[data-vibeui-block="hero-037"] [data-part="caption"] b{font-family:var(--vibeui-hero-037-mono);font-weight:600;color:var(--vibeui-hero-037-fg)}
[data-vibeui-block="hero-037"] [data-part="stamp"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));margin:0;border:1px solid var(--vibeui-hero-037-line);font-family:var(--vibeui-hero-037-mono);font-size:.68rem;line-height:1.3}
[data-vibeui-block="hero-037"] [data-part="stamp"] div{display:grid;gap:.1rem;padding:.4rem .6rem;border-right:1px solid var(--vibeui-hero-037-line);border-bottom:1px solid var(--vibeui-hero-037-line)}
[data-vibeui-block="hero-037"] [data-part="stamp"] dt{color:var(--vibeui-hero-037-muted);text-transform:uppercase;font-size:.58rem;letter-spacing:.06em}
[data-vibeui-block="hero-037"] [data-part="stamp"] dd{margin:0;font-weight:500;color:var(--vibeui-hero-037-fg)}
@keyframes vibeui-hero-037-draw{to{stroke-dashoffset:0}}
@keyframes vibeui-hero-037-fade{to{opacity:1}}
@keyframes vibeui-hero-037-dim{from{transform:scaleX(0);opacity:0}to{transform:scaleX(1);opacity:1}}
@container (min-width: 40rem){[data-vibeui-block="hero-037"] [data-part="stamp"]{grid-template-columns:repeat(4,minmax(0,1fr))}[data-vibeui-block="hero-037"] [data-part="stamp"] div{border-bottom:0}[data-vibeui-block="hero-037"] [data-part="stamp"] div:last-child{border-right:0}}
@container (min-width: 64rem){[data-vibeui-block="hero-037"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:4rem}[data-vibeui-block="hero-037"] [data-part="foot"]{grid-template-columns:minmax(0,1fr)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-037"] *{animation:none!important;transition:none!important}[data-vibeui-block="hero-037"] [data-part="wall"],[data-vibeui-block="hero-037"] [data-part="door"]{stroke-dashoffset:0}[data-vibeui-block="hero-037"] [data-part="gap"],[data-vibeui-block="hero-037"] [data-part="window"],[data-vibeui-block="hero-037"] [data-part="room"] text,[data-vibeui-block="hero-037"] [data-part="size"],[data-vibeui-block="hero-037"] [data-part="size-text"]{opacity:1}}`

const DEFAULT_ROOMS: Hero037Room[] = [
  { name: "Прихожая", area: 8.2, x: 20, y: 20, w: 160, h: 120, note: "встроенный шкаф до потолка" },
  { name: "Санузел", area: 5.4, x: 180, y: 20, w: 100, h: 120, note: "плитка 60×120, тёплый пол" },
  { name: "Кухня", area: 12.3, x: 280, y: 20, w: 160, h: 120, note: "перенос мокрой зоны согласован" },
  { name: "Гостиная", area: 24.6, x: 20, y: 140, w: 240, h: 260, note: "два окна, инженерная доска" },
  { name: "Спальня", area: 16.8, x: 260, y: 140, w: 180, h: 260, note: "шумоизоляция стены к соседям" },
  { name: "Детская", area: 13.1, x: 440, y: 20, w: 180, h: 200, note: "пробковый пол, розетки на 30 см" },
  { name: "Кабинет", area: 11.6, x: 440, y: 220, w: 180, h: 180, note: "отдельная линия под технику" },
]

const DEFAULT_DOORS: Hero037Door[] = [
  { x: 20, y: 60, axis: "v", size: 44 },
  { x: 110, y: 140, axis: "h", size: 44, flip: true },
  { x: 180, y: 70, axis: "v", size: 40 },
  { x: 330, y: 140, axis: "h", size: 44, flip: true },
  { x: 260, y: 200, axis: "v", size: 44 },
  { x: 440, y: 90, axis: "v", size: 44 },
  { x: 440, y: 290, axis: "v", size: 44 },
]

const DEFAULT_WINDOWS: (readonly [number, number, number, number])[] = [
  [310, 20, 400, 20],
  [480, 20, 580, 20],
  [60, 400, 200, 400],
  [300, 400, 400, 400],
  [620, 260, 620, 360],
]

function renderTitle(title: string, measure: string): ReactNode[] {
  return title.split(/(\*[^*]+\*)/).map((part, index) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <span key={index} data-part="dim" data-dim={measure}>
        {part.slice(1, -1)}
      </span>
    ) : (
      part
    ),
  )
}

function formatArea(value: number, decimalSeparator: string) {
  return value.toFixed(1).replace(".", decimalSeparator)
}

function doorPath(door: Hero037Door) {
  const size = door.size ?? 44
  const sign = door.flip ? -1 : 1
  if (door.axis === "v") {
    // петля в (x, y), полотно уходит внутрь по x, дуга до (x, y + size)
    return `M${door.x} ${door.y} L${door.x + size * sign} ${door.y} A${size} ${size} 0 0 ${door.flip ? 0 : 1} ${door.x} ${door.y + size}`
  }
  return `M${door.x} ${door.y} L${door.x} ${door.y + size * sign} A${size} ${size} 0 0 ${door.flip ? 1 : 0} ${door.x + size} ${door.y}`
}

/** Хиро с планом квартиры, который рисуется линиями, и размерной линией в заголовке. */
export function Hero037({
  eyebrow = "Ремонт квартир под ключ · Москва",
  title = "Ремонт, в котором *всё ровно*",
  measure = "± 1 мм",
  lede = "Смета фиксируется в договоре, срок — в календаре, стройка — в вашем телефоне. Сдаём в срок 14 лет подряд.",
  primaryLabel = "Рассчитать смету",
  primaryHref = "#calc",
  secondaryLabel = "Смотреть объекты",
  secondaryHref = "#works",
  facts = ["312 объектов сдано", "0 дней задержки", "цена не меняется после подписания"],
  rooms = DEFAULT_ROOMS,
  doors = DEFAULT_DOORS,
  windows = DEFAULT_WINDOWS,
  stamp = [
    ["Объект", "3-к квартира, 92,0 м²"],
    ["Стадия", "Рабочий проект"],
    ["Масштаб", "1:100"],
    ["Лист", "1 из 12"],
  ],
  widthLabel = "12 400",
  heightLabel = "7 600",
  areaUnit = "м²",
  decimalSeparator = ",",
  planLabel = "План квартиры, {area}",
  hintLine = "Наведите на комнату. Всего {area}, {n} помещений.",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero037Props) {
  const [active, setActive] = useState<number | null>(null)
  const current = active === null ? null : rooms[active]
  const total = rooms.reduce((sum, room) => sum + room.area, 0)

  const palette = {
    ...(accent ? { "--vibeui-hero-037-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-037-fg": ink } : null),
    ...(background ? { "--vibeui-hero-037-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-037" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-037" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="copy">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h1 data-part="title">{renderTitle(title, measure)}</h1>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="actions">
              {primaryLabel ? (
                <a data-part="primary" href={primaryHref}>
                  {primaryLabel}
                </a>
              ) : null}
              {secondaryLabel ? (
                <a data-part="secondary" href={secondaryHref}>
                  {secondaryLabel}
                </a>
              ) : null}
            </div>
            {facts.length > 0 ? (
              <ul data-part="facts">
                {facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            ) : null}
          </div>
          <div data-part="sheet">
            <svg data-part="plan" viewBox="0 0 660 440" role="group" aria-label={planLabel.replace("{area}", `${formatArea(total, decimalSeparator)} ${areaUnit}`)} onMouseLeave={() => setActive(null)}>
              {rooms.map((room, index) => (
                <g
                  key={room.name}
                  data-part="room"
                  data-active={active === index}
                  role="button"
                  tabIndex={0}
                  aria-label={`${room.name}, ${formatArea(room.area, decimalSeparator)} ${areaUnit}`}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onBlur={() => setActive(null)}
                >
                  <rect x={room.x} y={room.y} width={room.w} height={room.h} />
                  <text x={room.x + 12} y={room.y + 24}>{room.name}</text>
                  <text data-area="" x={room.x + 12} y={room.y + 42}>
                    {formatArea(room.area, decimalSeparator)} {areaUnit}
                  </text>
                </g>
              ))}
              {rooms.map((room, index) => (
                <rect key={room.name} data-part="wall" x={room.x} y={room.y} width={room.w} height={room.h} pathLength={1} style={{ animationDelay: `${0.15 + index * 0.16}s` }} />
              ))}
              {doors.map((door, index) => {
                const size = door.size ?? 44
                const gap = door.axis === "v" ? { x: door.x - 2.5, y: door.y, width: 5, height: size } : { x: door.x, y: door.y - 2.5, width: size, height: 5 }
                return (
                  <g key={index}>
                    <rect data-part="gap" {...gap} />
                    <path data-part="door" d={doorPath(door)} pathLength={1} style={{ animationDelay: `${1.6 + index * 0.08}s` }} />
                  </g>
                )
              })}
              {windows.map(([x1, y1, x2, y2], index) => (
                <line key={index} data-part="window" x1={x1} y1={y1} x2={x2} y2={y2} />
              ))}
              <g data-part="size">
                <path d="M20 416v10M620 416v10M20 421h600" />
                <path d="M634 20h10M634 400h10M639 20v380" />
              </g>
              <text data-part="size-text" x="320" y="436" textAnchor="middle">
                {widthLabel}
              </text>
              <text data-part="size-text" x="653" y="214" textAnchor="middle" transform="rotate(-90 653 214)">
                {heightLabel}
              </text>
            </svg>
            <div data-part="foot">
              <p data-part="caption" aria-live="polite">
                {current ? (
                  <>
                    <b>{current.name}</b> · <b>{formatArea(current.area, decimalSeparator)} {areaUnit}</b>
                    {current.note ? ` · ${current.note}` : ""}
                  </>
                ) : (
                  <>
                    {hintLine.split("{area}")[0]}
                    <b>{formatArea(total, decimalSeparator)} {areaUnit}</b>
                    {(hintLine.split("{area}")[1] ?? "").replace("{n}", String(rooms.length))}
                  </>
                )}
              </p>
              {stamp.length > 0 ? (
                <dl data-part="stamp">
                  {stamp.map(([key, value]) => (
                    <div key={key}>
                      <dt>{key}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
