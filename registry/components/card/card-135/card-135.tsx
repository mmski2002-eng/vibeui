"use client"

import type { ComponentProps, CSSProperties } from "react"
import { useEffect, useState } from "react"

export type Card135Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  label?: string
  value?: number
  suffix?: string
  active?: boolean
  accent?: string
  className?: string
  style?: CSSProperties
}

function Counter({ value, suffix, active }: { value: number; suffix?: string; active: boolean }) {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = performance.now()
    let frame = 0
    const step = (time: number) => {
      const t = Math.min(1, (time - start) / 1600)
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3))))
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [active, value])
  return (
    <span data-part="value">
      {new Intl.NumberFormat("ru-RU").format(active ? shown : value)}
      {suffix}
    </span>
  )
}

// Часть блока stats-001, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-135"]){
--vibeui-card-135-line:rgb(255 255 255 / .12);
--vibeui-card-135-mono:"JetBrains Mono",ui-monospace,monospace;
--vibeui-card-135-muted:#a39bb5;
}
[data-vibeui-block="card-135"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-135"] *{box-sizing:border-box}
@keyframes vibeui-card-135-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
[data-vibeui-block="card-135"]{display:grid;justify-items:center;gap:.75rem;padding:1.5rem 1rem;border-radius:1rem;border:1px solid var(--vibeui-card-135-line);background:linear-gradient(180deg,rgb(255 255 255 / .03),transparent);animation:vibeui-card-135-in .6s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-stats-001-n) * 100ms)}
[data-vibeui-block="card-135"] [data-part="ring"]{position:relative;width:8rem;height:8rem}
[data-vibeui-block="card-135"] [data-part="ring"] svg{width:100%;height:100%;transform:rotate(-90deg)}
[data-vibeui-block="card-135"] [data-part="track"]{fill:none;stroke:var(--vibeui-card-135-line);stroke-width:5}
[data-vibeui-block="card-135"] [data-part="arc"]{fill:none;stroke:var(--vibeui-stats-001-neon);stroke-width:5;stroke-linecap:round;stroke-dasharray:264;stroke-dashoffset:264;filter:drop-shadow(0 0 6px var(--vibeui-stats-001-neon));transition:stroke-dashoffset 1.6s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="card-135"][data-active="true"] [data-part="arc"]{stroke-dashoffset:calc(264 - 264 * var(--vibeui-card-135-fill,1))}
[data-vibeui-block="card-135"] [data-part="value"]{position:absolute;inset:0;display:grid;place-items:center;font-family:var(--vibeui-card-135-mono);font-size:1.6rem;font-weight:700;letter-spacing:-.03em;color:var(--vibeui-stats-001-neon);text-shadow:0 0 12px color-mix(in oklab,var(--vibeui-stats-001-neon) 60%,transparent);font-variant-numeric:tabular-nums}
[data-vibeui-block="card-135"] [data-part="label"]{margin:0;text-align:center;font-size:.9rem;color:var(--vibeui-card-135-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-135"] *{animation:none!important;transition:none!important}}
`

/** Показатель с неоновым кольцом и счётчиком: кольцо заполняется по переменной, число набегает при появлении. */
export function Card135({
  label = "лет студии",
  value = 11,
  suffix,
  active = true,
  accent,
  className,
  style,
  ...props
}: Card135Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-135-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-135" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-135" data-active={active}
        className={className}
        style={palette}
      >
        <div data-part="ring">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle data-part="track" cx="50" cy="50" r="42" />
            <circle data-part="arc" cx="50" cy="50" r="42" />
          </svg>
          <Counter value={value} suffix={suffix} active={active} />
        </div>
        <p data-part="label">{label}</p>
      </li>
    </>
  )
}
