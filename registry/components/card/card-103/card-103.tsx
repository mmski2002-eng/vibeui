"use client"

import type { ComponentProps, CSSProperties } from "react"
import { useEffect, useRef, useState } from "react"

export type Card103Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  code?: string
  uptime?: string
  latency?: number
  status?: "ok" | "degraded" | "down"
  statusLabels?: readonly [string, string, string]
  uptimeLabel?: string
  p50Label?: string
  sparkLabel?: string
  axisLabels?: readonly [string, string, string]
  now?: number | null
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

function noise(seed: number) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return value - Math.floor(value)
}

// Часть блока api-002, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-103"]){
--vibeui-card-103-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-103-down:#ff6b6b;
--vibeui-card-103-line:color-mix(in oklab,var(--vibeui-card-103-fg) 12%,transparent);
--vibeui-card-103-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-card-103-muted:color-mix(in oklab,var(--vibeui-card-103-fg) 60%,var(--vibeui-card-103-bg));
--vibeui-card-103-ok:var(--vibeui-card-103-accent);
--vibeui-card-103-warn:#ffb454;
--vibeui-card-103-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-103-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-103"]{color-scheme:dark}
[data-vibeui-block="card-103"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-103"] *{box-sizing:border-box}
@keyframes vibeui-card-103-ping{0%{transform:scale(.7);opacity:.9}100%{transform:scale(2.4);opacity:0}}
@keyframes vibeui-card-103-draw{to{stroke-dashoffset:0}}
[data-vibeui-block="card-103"] [data-part="lamp"]{position:relative;flex-shrink:0;width:.7rem;height:.7rem;border-radius:50%;background:var(--vibeui-card-103-ok);box-shadow:0 0 10px var(--vibeui-card-103-ok)}
[data-vibeui-block="card-103"] [data-part="lamp"]::after{content:"";position:absolute;inset:-.3rem;border-radius:50%;border:1px solid var(--vibeui-card-103-ok);animation:vibeui-card-103-ping 2.4s ease-out infinite}
[data-vibeui-block="card-103"] [data-part="lamp"][data-status="degraded"]{background:var(--vibeui-card-103-warn);box-shadow:0 0 10px var(--vibeui-card-103-warn)}
[data-vibeui-block="card-103"] [data-part="lamp"][data-status="degraded"]::after{border-color:var(--vibeui-card-103-warn)}
[data-vibeui-block="card-103"] [data-part="lamp"][data-status="down"]{background:var(--vibeui-card-103-down);box-shadow:0 0 10px var(--vibeui-card-103-down)}
[data-vibeui-block="card-103"] [data-part="lamp"][data-status="down"]::after{border-color:var(--vibeui-card-103-down)}
[data-vibeui-block="card-103"]{display:grid;gap:.8rem;padding:1.1rem 1.25rem;border-bottom:1px solid var(--vibeui-card-103-line)}
[data-vibeui-block="card-103"]:last-child{border-bottom:0}
[data-vibeui-block="card-103"] [data-part="rhead"]{display:flex;align-items:center;gap:.6rem}
[data-vibeui-block="card-103"] [data-part="rhead"] h4{margin:0;font-size:1rem;font-weight:700}
[data-vibeui-block="card-103"] [data-part="rhead"] span{font-family:var(--vibeui-card-103-mono);font-size:.7rem;color:var(--vibeui-card-103-muted)}
[data-vibeui-block="card-103"] [data-part="rhead"] [data-part="lamp"]{margin-left:auto;width:.6rem;height:.6rem}
[data-vibeui-block="card-103"] [data-part="nums"]{display:flex;gap:1.4rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="card-103"] [data-part="nums"] li{display:grid;gap:.05rem}
[data-vibeui-block="card-103"] [data-part="nums"] span{font-size:.68rem;color:var(--vibeui-card-103-muted)}
[data-vibeui-block="card-103"] [data-part="nums"] b{font-family:var(--vibeui-card-103-mono);font-weight:600;font-size:1.05rem;font-variant-numeric:tabular-nums;letter-spacing:-.02em}
[data-vibeui-block="card-103"] [data-part="nums"] b[data-live]{color:var(--vibeui-card-103-accent)}
[data-vibeui-block="card-103"] [data-part="spark"]{width:100%;height:3.4rem;overflow:visible}
[data-vibeui-block="card-103"] [data-part="spark"] [data-part="fill"]{fill:color-mix(in oklab,var(--vibeui-card-103-accent) 12%,transparent);opacity:0;transition:opacity .6s .9s}
[data-vibeui-block="card-103"] [data-part="spark"] [data-part="trace"]{fill:none;stroke:var(--vibeui-card-103-accent);stroke-width:1.5;stroke-linejoin:round;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1}
[data-vibeui-block="card-103"] [data-part="spark"] [data-part="now"]{fill:var(--vibeui-card-103-accent);opacity:0;transition:opacity .3s 1.2s}
[data-vibeui-block="card-103"] [data-part="spark"] [data-part="base"]{stroke:var(--vibeui-card-103-line);stroke-width:1}
[data-vibeui-block="card-103"][data-drawn="true"] [data-part="trace"]{animation:vibeui-card-103-draw 1.4s cubic-bezier(.2,.8,.2,1) forwards}
[data-vibeui-block="card-103"][data-drawn="true"] [data-part="fill"],[data-vibeui-block="card-103"][data-drawn="true"] [data-part="now"]{opacity:1}
[data-vibeui-block="card-103"] [data-part="axis"]{display:flex;justify-content:space-between;font-family:var(--vibeui-card-103-mono);font-size:.62rem;color:var(--vibeui-card-103-muted)}
@container (min-width: 44rem){
[data-vibeui-block="card-103"]:nth-child(2n){border-right:0}
[data-vibeui-block="card-103"]:nth-last-child(-n+2){border-bottom:0}
}
@container (min-width: 64rem){
[data-vibeui-block="card-103"]:nth-child(2n){border-right:1px solid var(--vibeui-card-103-line)}
[data-vibeui-block="card-103"]:last-child{border-right:0}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="card-103"] [data-part="trace"]{stroke-dashoffset:0!important}
[data-vibeui-block="card-103"] [data-part="fill"],[data-vibeui-block="card-103"] [data-part="now"]{opacity:1!important}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-103"] *{animation:none!important;transition:none!important}}
`

/** Карточка региона API: статус, аптайм, p50 и спарклайн, который рисуется при появлении. */
export function Card103({
  name = "Москва",
  code = "msk-1",
  uptime = "99,99 %",
  latency = 38,
  status = "ok",
  statusLabels = ["работает", "деградация", "недоступен"],
  uptimeLabel = "аптайм 30 дн.",
  p50Label = "p50 сейчас",
  sparkLabel = "Латентность {name} за 24 часа",
  axisLabels = ["−24 ч", "−12 ч", "сейчас"],
  now = null,
  index = 0,
  accent,
  className,
  style,
  ...props
}: Card103Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-103-accent": accent } : null),
    ...style,
  } as CSSProperties
  const ref = useRef<HTMLLIElement>(null)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setDrawn(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // Серия по часам: сдвигается раз в час, точка «сейчас» дрожит раз в секунду.
  const hour = now === null ? 0 : Math.floor(now / 3600)
  const points = Array.from({ length: 24 }, (_, offset) => {
    const seed = hour - 23 + offset + index * 1000
    return latency * (0.8 + noise(seed) * 0.5)
  })
  const live = now === null ? latency : Math.round(points[23] + (noise(now + index) - 0.5) * 6)
  const width = 200
  const height = 44
  const max = Math.max(...points) * 1.15
  const min = Math.min(...points) * 0.7
  const x = (offset: number) => (offset / 23) * width
  const y = (value: number) => height - ((value - min) / (max - min)) * height
  const line = points.map((value, offset) => `${offset === 0 ? "M" : "L"}${x(offset).toFixed(1)} ${y(value).toFixed(1)}`).join(" ")
  const area = `${line} L${width} ${height} L0 ${height} Z`
  const statusValue = status ?? "ok"

  return (
    <>
      <style href="vibeui-card-103" precedence="medium">
        {STYLES}
      </style>
      <li
          {...props}
          data-slot="card"
          data-vibeui-block="card-103" ref={ref} data-drawn={drawn ? "true" : undefined}
          className={className}
          style={palette}
        >
        <div data-part="rhead">
          <h4>{name}</h4>
          <span>{code}</span>
          <i data-part="lamp" data-status={statusValue} aria-label={statusValue === "ok" ? statusLabels[0] : statusValue === "degraded" ? statusLabels[1] : statusLabels[2]} />
        </div>
        <ul data-part="nums">
          <li>
            <span>{uptimeLabel}</span>
            <b>{uptime}</b>
          </li>
          <li>
            <span>{p50Label}</span>
            <b data-live="">{now === null ? "—" : `${live} ms`}</b>
          </li>
          <li>
            <span>p99</span>
            <b>{now === null ? "—" : `${Math.round(points[23] * 2.4)} ms`}</b>
          </li>
        </ul>
        <svg data-part="spark" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label={sparkLabel.replace("{name}", name)}>
          <line data-part="base" x1={0} x2={width} y1={height} y2={height} />
          {now === null ? null : (
            <>
              <path data-part="fill" d={area} />
              <path data-part="trace" d={line} pathLength={1} />
              <circle data-part="now" cx={width} cy={y(points[23])} r={3} />
            </>
          )}
        </svg>
        <div data-part="axis" aria-hidden="true">
          <span>{axisLabels[0]}</span>
          <span>{axisLabels[1]}</span>
          <span>{axisLabels[2]}</span>
        </div>
      </li>
    </>
  )
}
