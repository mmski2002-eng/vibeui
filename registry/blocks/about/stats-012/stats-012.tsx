"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Chart031 } from "@/registry/components/chart/chart-031/chart-031"

export type Stats012Gauge = {
  label: string
  value: number
  unit?: string
  /** Максимум шкалы для дуги. */
  max: number
  /** Значение прошлой версии для дельты. Пусто — не показывать. */
  previous?: number
  previousLabel?: string
  decimals?: number
}

export type Stats012Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Моно-строка статуса на панели. */
  status?: string
  gauges?: readonly Stats012Gauge[]
  /** Подпись прошлого значения, если у датчика нет своей. */
  wasLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Характеристики как панель приборов: тёмная плита с четырьмя дуговыми
// индикаторами (SVG-окружность на 270°, stroke-dasharray, заполнение
// через transition stroke-dashoffset) и крупными цифрами, которые
// докручиваются от нуля, когда панель входит в viewport
// (IntersectionObserver + requestAnimationFrame, ease-out). Под каждой
// цифрой — дельта к прошлой версии. Сверху строка статуса с пульсирующей
// точкой.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"


const STYLES = `
:where([data-vibeui-block="stats-012"]){
--vibeui-stats-012-bg:light-dark(#ffffff,#0a0a0a);
--vibeui-stats-012-fg:light-dark(#111111,#f2ede4);
--vibeui-stats-012-accent:light-dark(#111111,#f2ede4);
--vibeui-stats-012-muted:color-mix(in oklab,var(--vibeui-stats-012-fg) 60%,var(--vibeui-stats-012-bg));
--vibeui-stats-012-panel:var(--vibeui-stats-012-fg);
--vibeui-stats-012-on-panel:var(--vibeui-stats-012-bg);
--vibeui-stats-012-panel-muted:color-mix(in oklab,var(--vibeui-stats-012-on-panel) 55%,var(--vibeui-stats-012-panel));
--vibeui-stats-012-panel-line:color-mix(in oklab,var(--vibeui-stats-012-on-panel) 14%,transparent);
--vibeui-stats-012-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-stats-012-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-stats-012-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="stats-012"]{color-scheme:dark}
:where([data-vibeui-block="stats-012"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="stats-012"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="stats-012"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-stats-012-bg);color:var(--vibeui-stats-012-fg);font-family:var(--vibeui-stats-012-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="stats-012"] *{box-sizing:border-box}
[data-vibeui-block="stats-012"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="stats-012"] [data-part="head"]{max-width:44rem;margin:0 0 2.5rem}
[data-vibeui-block="stats-012"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-stats-012-mono);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-stats-012-accent)}
[data-vibeui-block="stats-012"] [data-part="title"]{margin:0;font-family:var(--vibeui-stats-012-display);font-weight:900;font-size:clamp(2rem,5.4cqi,4rem);line-height:1;letter-spacing:-.03em;text-wrap:balance}
[data-vibeui-block="stats-012"] [data-part="lede"]{margin:1rem 0 0;max-width:34rem;font-size:1.05rem;color:var(--vibeui-stats-012-muted)}
[data-vibeui-block="stats-012"] [data-part="panel"]{border-radius:1.8rem;padding:1.4rem;background:var(--vibeui-stats-012-panel);color:var(--vibeui-stats-012-on-panel);box-shadow:0 40px 80px -40px rgb(0 0 0/.6)}
[data-vibeui-block="stats-012"] [data-part="status"]{display:flex;align-items:center;gap:.6rem;margin:0 0 1.4rem;padding:0 .4rem .9rem;border-bottom:1px solid var(--vibeui-stats-012-panel-line);font-family:var(--vibeui-stats-012-mono);font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-stats-012-panel-muted)}
[data-vibeui-block="stats-012"] [data-part="status"]::before{content:"";width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-stats-012-accent);box-shadow:0 0 10px var(--vibeui-stats-012-accent);animation:vibeui-stats-012-blink 2s ease-in-out infinite}
[data-vibeui-block="stats-012"] [data-part="grid"]{display:grid;gap:1rem;grid-template-columns:repeat(2,minmax(0,1fr))}
[data-vibeui-block="stats-012"] [data-in="true"] [data-vibeui-block="chart-031"] [data-part="fill"]{stroke-dashoffset:var(--vibeui-stats-012-off)}
@keyframes vibeui-stats-012-blink{0%,100%{opacity:1}50%{opacity:.35}}
@container (min-width: 44rem){[data-vibeui-block="stats-012"] [data-part="panel"]{padding:2rem}}
@container (min-width: 64rem){[data-vibeui-block="stats-012"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="stats-012"] *{animation:none!important;transition:none!important}}`

const DEFAULT_GAUGES: Stats012Gauge[] = [
  { label: "Яркость", value: 1200, unit: "лм", max: 1500, previous: 800, previousLabel: "Луч 1" },
  { label: "Точность цвета", value: 97, unit: "CRI", max: 100, previous: 90, previousLabel: "Луч 1" },
  { label: "Динамик", value: 5, unit: "Вт", max: 6, previous: 2, previousLabel: "Луч 1" },
  { label: "Датчиков", value: 4, unit: "шт", max: 4, previous: 1, previousLabel: "Луч 1" },
]


/** Панель приборов: дуги SVG и цифры, которые докручиваются в viewport. */
export function Stats012({
  eyebrow = "Характеристики",
  title = "Цифры, которые видно с другого конца комнаты",
  lede = "Луч 2 против Луч 1: в полтора раза ярче, в два раза громче, четыре датчика вместо одного. Всё измерено, а не обещано.",
  status = "Луч 2 · прошивка 2.3.1 · все датчики в норме",
  gauges = DEFAULT_GAUGES,
  wasLabel = "было",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Stats012Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  const [t, setT] = useState(0)

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    let frame = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now
      const k = Math.min(1, (now - start) / 1600)
      setT(1 - Math.pow(1 - k, 3))
      if (k < 1) frame = requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          frame = requestAnimationFrame(tick)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(panel)
    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-stats-012-accent": accent } : null),
    ...(ink ? { "--vibeui-stats-012-fg": ink } : null),
    ...(background ? { "--vibeui-stats-012-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-stats-012" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="stats-012" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="panel" data-in={shown} ref={panelRef}>
            {status ? <p data-part="status">{status}</p> : null}
            <div data-part="grid">
              {gauges.map((gauge) => {
                const decimals = gauge.decimals ?? 0
                const fraction = Math.min(1, Math.max(0, gauge.value / Math.max(1, gauge.max)))
                const delta = gauge.previous ? Math.round(((gauge.value - gauge.previous) / gauge.previous) * 100) : null
                return (
                  <Chart031 key={gauge.label} data-part="gauge" label={gauge.label} value={gauge.value} unit={gauge.unit} previousLabel={gauge.previousLabel} previous={gauge.previous} wasLabel={wasLabel} t={t} decimals={decimals} fraction={fraction} delta={delta} accent={accent} />
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
