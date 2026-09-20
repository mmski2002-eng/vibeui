"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Charity004Point = {
  city: string
  /** Сколько подопечных в этом городе. */
  count: number
  /** Координаты на схеме, 0–100 по обеим осям. */
  x: number
  y: number
  /** Короткая пометка: «с 2019», «новый». */
  note?: string
}

export type Charity004Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Подпись региона на схеме. */
  region?: string
  points?: readonly Charity004Point[]
  /** Единица под общим числом: «подопечных». */
  unit?: string
  /** aria карты и компас. */
  mapLabel?: string
  compassLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Карта помощи: стилизованная схема региона на SVG — мягкий контур, штриховка,
// пунктирный маршрут между городами, который прорисовывается, и точки,
// которые зажигаются по очереди с числом подопечных над каждой, когда блок
// попадает в viewport. Справа список городов: строки подсвечиваются
// синхронно с точками, наведение на строку пульсирует точку на карте.
const FONTS = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;700&display=swap"

const STYLES = `
:where([data-vibeui-block="charity-004"]){
--vibeui-charity-004-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-charity-004-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-charity-004-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-charity-004-on-accent:oklch(from var(--vibeui-charity-004-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-charity-004-muted:color-mix(in oklab,var(--vibeui-charity-004-fg) 62%,var(--vibeui-charity-004-bg));
--vibeui-charity-004-line:color-mix(in oklab,var(--vibeui-charity-004-fg) 16%,transparent);
--vibeui-charity-004-soft:color-mix(in oklab,var(--vibeui-charity-004-fg) 5%,var(--vibeui-charity-004-bg));
--vibeui-charity-004-land:color-mix(in oklab,var(--vibeui-charity-004-accent) 8%,var(--vibeui-charity-004-bg));
--vibeui-charity-004-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-charity-004-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-charity-004-hand:"Caveat","Segoe Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="charity-004"]{color-scheme:dark}
:where([data-vibeui-block="charity-004"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="charity-004"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="charity-004"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-charity-004-bg);color:var(--vibeui-charity-004-fg);font-family:var(--vibeui-charity-004-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="charity-004"] *{box-sizing:border-box}
[data-vibeui-block="charity-004"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem;align-items:center}
[data-vibeui-block="charity-004"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.8rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-charity-004-accent)}
[data-vibeui-block="charity-004"] [data-part="title"]{margin:0;font-family:var(--vibeui-charity-004-display);font-weight:500;font-size:clamp(2rem,4.6cqi,3.4rem);line-height:1.08;letter-spacing:-.02em}
[data-vibeui-block="charity-004"] [data-part="lede"]{margin:1rem 0 0;max-width:30rem;color:var(--vibeui-charity-004-muted)}
[data-vibeui-block="charity-004"] [data-part="total"]{display:flex;align-items:baseline;gap:.6rem;margin:1.6rem 0 0}
[data-vibeui-block="charity-004"] [data-part="total"] strong{font-family:var(--vibeui-charity-004-display);font-weight:700;font-size:clamp(2.6rem,6cqi,4rem);line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
[data-vibeui-block="charity-004"] [data-part="total"] span{font-size:.95rem;color:var(--vibeui-charity-004-muted)}
[data-vibeui-block="charity-004"] [data-part="list"]{margin:1.6rem 0 0;padding:0;list-style:none;display:grid;gap:.15rem}
[data-vibeui-block="charity-004"] [data-part="city"]{display:grid;grid-template-columns:1.6rem minmax(0,1fr) auto;align-items:center;gap:.6rem;padding:.55rem .7rem;border-radius:.7rem;opacity:.35;transform:translateX(-6px);transition:opacity .4s,transform .4s,background .2s;cursor:default}
[data-vibeui-block="charity-004"] [data-part="city"][data-lit="true"]{opacity:1;transform:none}
[data-vibeui-block="charity-004"] [data-part="city"]:hover{background:var(--vibeui-charity-004-soft)}
[data-vibeui-block="charity-004"] [data-part="city"] i{width:.6rem;height:.6rem;margin:0 auto;border-radius:50%;background:var(--vibeui-charity-004-accent)}
[data-vibeui-block="charity-004"] [data-part="city"] span{font-weight:500}
[data-vibeui-block="charity-004"] [data-part="city"] span small{margin-left:.5rem;font-family:var(--vibeui-charity-004-hand);font-size:1.1rem;color:var(--vibeui-charity-004-accent)}
[data-vibeui-block="charity-004"] [data-part="city"] b{font-family:var(--vibeui-charity-004-display);font-weight:700;font-size:1.15rem;font-variant-numeric:tabular-nums}
[data-vibeui-block="charity-004"] [data-part="map"]{position:relative;width:100%;max-width:38rem;margin:0 auto}
[data-vibeui-block="charity-004"] [data-part="svg"]{display:block;width:100%;height:auto;overflow:visible}
[data-vibeui-block="charity-004"] [data-part="land"]{fill:var(--vibeui-charity-004-land);stroke:var(--vibeui-charity-004-line);stroke-width:1.2;stroke-linejoin:round}
[data-vibeui-block="charity-004"] [data-part="hatch"]{fill:url(#vibeui-charity-004-hatch);opacity:.5}
[data-vibeui-block="charity-004"] [data-part="river"]{fill:none;stroke:color-mix(in oklab,var(--vibeui-charity-004-fg) 22%,transparent);stroke-width:1.4;stroke-linecap:round}
[data-vibeui-block="charity-004"] [data-part="route"]{fill:none;stroke:var(--vibeui-charity-004-accent);stroke-width:1.2;stroke-dasharray:3 3;opacity:.7;stroke-dashoffset:var(--vibeui-charity-004-d);transition:stroke-dashoffset 4s linear}
[data-vibeui-block="charity-004"] [data-part="label"]{font-family:var(--vibeui-charity-004-hand);font-size:9px;fill:var(--vibeui-charity-004-muted)}
[data-vibeui-block="charity-004"] [data-part="pin"]{opacity:0;transform:scale(0);transform-box:fill-box;transform-origin:center;transition:opacity .4s,transform .5s cubic-bezier(.2,.9,.3,1.4)}
[data-vibeui-block="charity-004"] [data-part="pin"][data-lit="true"]{opacity:1;transform:scale(1)}
[data-vibeui-block="charity-004"] [data-part="pin"] [data-part="halo"]{fill:var(--vibeui-charity-004-accent);opacity:.25;transform-box:fill-box;transform-origin:center;animation:vibeui-charity-004-pulse 2.4s ease-out infinite}
[data-vibeui-block="charity-004"] [data-part="pin"][data-hot="true"] [data-part="halo"]{animation-duration:.9s;opacity:.45}
[data-vibeui-block="charity-004"] [data-part="pin"] [data-part="dot"]{fill:var(--vibeui-charity-004-accent);stroke:var(--vibeui-charity-004-bg);stroke-width:1.5}
[data-vibeui-block="charity-004"] [data-part="pin"] [data-part="num"]{font-family:var(--vibeui-charity-004-display);font-weight:700;font-size:9px;fill:var(--vibeui-charity-004-fg);text-anchor:middle}
[data-vibeui-block="charity-004"] [data-part="pin"] [data-part="name"]{font-family:var(--vibeui-charity-004-font);font-weight:500;font-size:5.4px;fill:var(--vibeui-charity-004-muted);text-anchor:middle}
[data-vibeui-block="charity-004"] [data-part="compass"]{position:absolute;right:0;top:0;font-family:var(--vibeui-charity-004-hand);font-size:1.3rem;line-height:1;color:var(--vibeui-charity-004-muted);transform:rotate(6deg)}
@keyframes vibeui-charity-004-pulse{from{transform:scale(.6);opacity:.45}to{transform:scale(2.4);opacity:0}}
@container (min-width: 56rem){[data-vibeui-block="charity-004"] [data-part="shell"]{grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:4rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="charity-004"] *{animation:none!important;transition:none!important}[data-vibeui-block="charity-004"] [data-part="pin"]{opacity:1;transform:none}[data-vibeui-block="charity-004"] [data-part="city"]{opacity:1;transform:none}[data-vibeui-block="charity-004"] [data-part="route"]{stroke-dashoffset:0}}`

const DEFAULT_POINTS: Charity004Point[] = [
  { city: "Тверь", count: 96, x: 52, y: 58, note: "с 2019" },
  { city: "Ржев", count: 41, x: 30, y: 74 },
  { city: "Торжок", count: 38, x: 40, y: 44 },
  { city: "Вышний Волочёк", count: 32, x: 44, y: 22 },
  { city: "Кимры", count: 28, x: 74, y: 62 },
  { city: "Бежецк", count: 24, x: 70, y: 28, note: "новый" },
  { city: "Кувшиново", count: 19, x: 24, y: 50 },
  { city: "Осташков", count: 18, x: 12, y: 36 },
  { city: "Конаково", count: 16, x: 68, y: 78 },
]

const LAND = "M14 18 C 26 6, 46 4, 60 10 C 74 4, 90 12, 92 26 C 98 40, 94 54, 90 66 C 88 80, 78 92, 64 94 C 50 98, 36 92, 26 86 C 14 80, 4 66, 6 52 C 2 40, 6 26, 14 18 Z"
const RIVER = "M8 46 C 18 48, 24 56, 34 58 C 44 60, 50 54, 58 60 C 66 66, 72 70, 82 72"

/** Карта помощи: точки зажигаются по очереди, маршрут прорисовывается. */
export function Charity004({
  eyebrow = "Где мы работаем",
  title = "Девять городов и сорок деревень между ними",
  lede = "Мы не помогаем «по России» — мы помогаем в Тверской области, где до каждого подопечного можно доехать за день. Так проверяемо и честно.",
  region = "Тверская область",
  points = DEFAULT_POINTS,
  unit = "подопечных на этой неделе",
  mapLabel = "{region}: {cities} городов, {total} подопечных",
  compassLabel = "↑ север",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Charity004Props) {
  const rootRef = useRef<HTMLElement>(null)
  const [lit, setLit] = useState(0)
  const [hot, setHot] = useState<number | null>(null)
  const total = points.reduce((sum, point) => sum + point.count, 0)
  const route = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ")

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    let timer = 0
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (reduce) {
          setLit(points.length)
          return
        }
        let count = 0
        timer = window.setInterval(() => {
          count += 1
          setLit(count)
          if (count >= points.length) window.clearInterval(timer)
        }, 380)
      },
      { threshold: 0.35 },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      window.clearInterval(timer)
    }
  }, [points.length])

  const palette = {
    ...(accent ? { "--vibeui-charity-004-accent": accent } : null),
    ...(ink ? { "--vibeui-charity-004-fg": ink } : null),
    ...(background ? { "--vibeui-charity-004-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-charity-004" precedence="medium">
        {STYLES}
      </style>
      <section ref={rootRef} data-vibeui-block="charity-004" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <p data-part="total">
              <strong>{total}</strong>
              <span>{unit}</span>
            </p>
            <ul data-part="list">
              {points.map((point, index) => (
                <li key={point.city} data-part="city" data-lit={index < lit} onMouseEnter={() => setHot(index)} onMouseLeave={() => setHot(null)}>
                  <i aria-hidden="true" />
                  <span>
                    {point.city}
                    {point.note ? <small>{point.note}</small> : null}
                  </span>
                  <b>{point.count}</b>
                </li>
              ))}
            </ul>
          </div>
          <div data-part="map">
            <svg data-part="svg" viewBox="0 0 100 100" role="img" aria-label={mapLabel.replace("{region}", region).replace("{cities}", String(points.length)).replace("{total}", String(total))}>
              <defs>
                <pattern id="vibeui-charity-004-hatch" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="3" stroke="var(--vibeui-charity-004-line)" strokeWidth=".5" />
                </pattern>
              </defs>
              <path data-part="land" d={LAND} />
              <path data-part="hatch" d={LAND} />
              <path data-part="river" d={RIVER} />
              <text data-part="label" x="50" y="97" textAnchor="middle">
                {region}
              </text>
              <path data-part="route" d={route} pathLength={100} style={{ ["--vibeui-charity-004-d" as string]: lit === 0 ? 100 : Math.max(0, 100 - (lit / Math.max(1, points.length - 1)) * 100 - 12) }} />
              {points.map((point, index) => (
                <g key={point.city} data-part="pin" data-lit={index < lit} data-hot={hot === index}>
                  <circle data-part="halo" cx={point.x} cy={point.y} r="3" />
                  <circle data-part="dot" cx={point.x} cy={point.y} r="2" />
                  <text data-part="num" x={point.x} y={point.y - 4.5}>
                    {point.count}
                  </text>
                  <text data-part="name" x={point.x} y={point.y + 6.5}>
                    {point.city}
                  </text>
                </g>
              ))}
            </svg>
            <span data-part="compass" aria-hidden="true">
              {compassLabel}
            </span>
          </div>
        </div>
      </section>
    </>
  )
}
