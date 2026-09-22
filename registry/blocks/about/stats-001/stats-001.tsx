"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Card135 } from "@/registry/components/card/card-135/card-135"

export type Stats001Item = {
  /** Число для счётчика. */
  value: number
  /** «+», « %», « лет». */
  suffix?: string
  label: string
  /** Заполнение кольца в долях: 1 — полное. По умолчанию 1. */
  fill?: number
  /** Цвет кольца. */
  color?: string
}

export type Stats001Props = {
  eyebrow?: string
  title?: string
  items?: readonly Stats001Item[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Цифры студии: четыре неоновых кольца, при появлении в кадре дуга
// заполняется (stroke-dashoffset), число набегает счётчиком, кольцо
// светится своим цветом. Сетка 2/4. Каскад по --n.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"

const STYLES = `
:where([data-vibeui-block="stats-001"]){
--vibeui-stats-001-bg:#07060b;
--vibeui-stats-001-fg:#f3eefc;
--vibeui-stats-001-muted:#a39bb5;
--vibeui-stats-001-line:rgb(255 255 255 / .12);
--vibeui-stats-001-accent:#ff2bd6;
--vibeui-stats-001-cyan:#22f3ff;
--vibeui-stats-001-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-stats-001-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-stats-001-mono:"JetBrains Mono",ui-monospace,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="stats-001"]{color-scheme:dark}
:where([data-vibeui-block="stats-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="stats-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="stats-001"]{box-sizing:border-box;display:block;background:var(--vibeui-stats-001-bg);color:var(--vibeui-stats-001-fg);font-family:var(--vibeui-stats-001-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="stats-001"] *{box-sizing:border-box}
[data-vibeui-block="stats-001"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="stats-001"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:.5rem 1.5rem;margin-bottom:2rem}
[data-vibeui-block="stats-001"] [data-part="eyebrow"]{margin:0;font-family:var(--vibeui-stats-001-mono);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-stats-001-cyan);text-shadow:0 0 10px color-mix(in oklab,var(--vibeui-stats-001-cyan) 70%,transparent)}
[data-vibeui-block="stats-001"] [data-part="title"]{margin:0;font-family:var(--vibeui-stats-001-display);font-size:1.3rem;font-weight:600;letter-spacing:-.01em}
[data-vibeui-block="stats-001"] [data-part="grid"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;margin:0;padding:0;list-style:none}
@keyframes vibeui-stats-001-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@container (min-width: 56rem){[data-vibeui-block="stats-001"] [data-part="shell"]{padding:4rem 2rem}[data-vibeui-block="stats-001"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr));gap:1.25rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="stats-001"] *{animation:none!important;transition:none!important}}`

const DEFAULT_ITEMS: Stats001Item[] = [
  { value: 11, label: "лет студии", fill: 0.7, color: "#ff2bd6" },
  { value: 4800, suffix: "+", label: "работ сделано", fill: 0.92, color: "#8b5cff" },
  { value: 100, suffix: " %", label: "одноразовые иглы и краски", fill: 1, color: "#22f3ff" },
  { value: 98, suffix: " %", label: "возвращаются за второй", fill: 0.98, color: "#c8ff3a" },
]


/** Цифры студии неоновыми кольцами: дуги заполняются, числа набегают при появлении. */
export function Stats001({
  eyebrow = "В цифрах",
  title = "Студия, которой доверяют кожу",
  items = DEFAULT_ITEMS,
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Stats001Props) {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)
  const palette = {
    ...(accent ? { "--vibeui-stats-001-accent": accent } : null),
    ...(background ? { "--vibeui-stats-001-bg": background } : null),
    ...style,
  } as CSSProperties

  useEffect(() => {
    const node = root.current
    if (!node || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(true)
        })
      },
      { threshold: 0.3 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-stats-001" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="stats-001" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow || title ? (
            <div data-part="head">
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              {title ? <h2 data-part="title">{title}</h2> : null}
            </div>
          ) : null}
          <ul data-part="grid">
            {items.map((item, index) => (
              <Card135 key={item.label} data-part="item" label={item.label} value={item.value} suffix={item.suffix} active={active} style={{ ["--vibeui-stats-001-neon" as string]: item.color ?? "#ff2bd6", ["--vibeui-stats-001-fill" as string]: item.fill ?? 1, ["--vibeui-stats-001-n" as string]: index }} accent={accent} />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
