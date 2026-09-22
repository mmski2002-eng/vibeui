"use client"

import type { ComponentProps, CSSProperties } from "react"
import { useEffect, useState } from "react"

export type Card144Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  self?: boolean
  note?: string
  value?: number
  selfTag?: string
  unit?: string
  max?: number
  shown?: boolean
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

function Value({ target, run, unit }: { target: number; run: boolean; unit: string }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!run) return
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1100)
      setValue(target * (1 - Math.pow(1 - t, 3)))
      if (t < 1) raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [run, target])
  const digits = Number.isInteger(target) ? 0 : 1
  return (
    <span data-part="val">
      {(run ? value : 0).toFixed(digits)} {unit}
    </span>
  )
}

// Часть блока comparison-006, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-144"]){
--vibeui-card-144-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-144-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-144-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-144-line:color-mix(in oklab,var(--vibeui-card-144-fg) 12%,transparent);
--vibeui-card-144-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-card-144-muted:color-mix(in oklab,var(--vibeui-card-144-fg) 60%,var(--vibeui-card-144-bg));
--vibeui-card-144-on-accent:oklch(from var(--vibeui-card-144-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-144"]{color-scheme:dark}
[data-vibeui-block="card-144"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-144"] *{box-sizing:border-box}
[data-vibeui-block="card-144"]{display:grid;grid-template-columns:minmax(6rem,10rem) 1fr auto;gap:1rem;align-items:center}
[data-vibeui-block="card-144"] [data-part="name"]{font-weight:600;font-size:.92rem}
[data-vibeui-block="card-144"] [data-part="name"] small{display:block;font-weight:400;font-size:.72rem;color:var(--vibeui-card-144-muted)}
[data-vibeui-block="card-144"] [data-part="track"]{height:1.6rem;border-radius:6px;background:var(--vibeui-card-144-line);overflow:hidden}
[data-vibeui-block="card-144"] [data-part="bar"]{height:100%;width:calc(var(--vibeui-card-144-w) * 100%);background:color-mix(in oklab,var(--vibeui-card-144-fg) 40%,var(--vibeui-card-144-bg));border-radius:6px;transform:scaleX(0);transform-origin:left;transition:transform 1.1s cubic-bezier(.2,.8,.2,1);transition-delay:calc(var(--vibeui-card-144-i) * .12s)}
[data-vibeui-block="card-144"][data-self="true"] [data-part="bar"]{background:var(--vibeui-card-144-accent)}
[data-vibeui-block="card-144"][data-self="true"] [data-part="name"]::after{content:attr(data-tag);margin-left:.5rem;padding:.1rem .4rem;border-radius:4px;background:var(--vibeui-card-144-accent);color:var(--vibeui-card-144-on-accent);font-family:var(--vibeui-card-144-mono);font-size:.62rem;vertical-align:middle}
[data-vibeui-block="card-144"] [data-part="val"]{font-family:var(--vibeui-card-144-mono);font-size:.85rem;font-variant-numeric:tabular-nums;min-width:5rem;text-align:right}
[data-vibeui-block="card-144"][data-self="true"] [data-part="bar"]{position:relative;overflow:hidden}
[data-vibeui-block="card-144"][data-self="true"] [data-part="bar"]::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgb(255 255 255 / .35),transparent);transform:translateX(-100%)}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="card-144"] [data-part="bar"]{transform:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-144"] *{animation:none!important;transition:none!important}}
`

/** Строка сравнения: название с заметкой и тегом «это мы», полоса относительно максимума и значение-счётчик. */
export function Card144({
  name = "tabl",
  self,
  note,
  value = 4.1,
  selfTag = "это мы",
  unit = "КБ",
  max = 100,
  shown = true,
  index = 0,
  accent,
  className,
  style,
  ...props
}: Card144Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-144-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-144" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-144" data-self={self ?? false}
        className={className}
        style={palette}
      >
        <span data-part="name" data-tag={selfTag}>
          {name}
          {note ? <small>{note}</small> : null}
        </span>
        <span data-part="track">
          <span data-part="bar" style={{ ["--vibeui-card-144-w" as string]: value / max, ["--vibeui-card-144-i" as string]: index }} />
        </span>
        <Value target={value} run={shown} unit={unit} />
      </li>
    </>
  )
}
