"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Comparison006Row = {
  name: string
  /** Значение метрики (например, КБ gzip). */
  value: number
  note?: string
  /** Наш пакет — полоса акцентом. */
  self?: boolean
}

export type Comparison006Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Единица после числа: «КБ». */
  unit?: string
  /** Подпись метрики над полосами. */
  metric?: string
  rows?: readonly Comparison006Row[]
  /** Сноска мелким: как измеряли. */
  footnote?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Сравнение размера бандла: горизонтальные полосы от самого большого,
// растут при появлении в кадре с задержкой по строке, число считается
// вверх синхронно с полосой; наш пакет — акцентом и подписью «это мы».
// Пропорция честная: ширина = value / max. Сноска про метод измерения.
const FONTS = "https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="comparison-006"]){
--vibeui-comparison-006-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-comparison-006-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-comparison-006-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-comparison-006-on-accent:oklch(from var(--vibeui-comparison-006-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-comparison-006-muted:color-mix(in oklab,var(--vibeui-comparison-006-fg) 60%,var(--vibeui-comparison-006-bg));
--vibeui-comparison-006-line:color-mix(in oklab,var(--vibeui-comparison-006-fg) 12%,transparent);
--vibeui-comparison-006-panel:color-mix(in oklab,var(--vibeui-comparison-006-fg) 4%,var(--vibeui-comparison-006-bg));
--vibeui-comparison-006-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-comparison-006-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="comparison-006"]{color-scheme:dark}
:where([data-vibeui-block="comparison-006"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="comparison-006"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="comparison-006"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-comparison-006-bg);color:var(--vibeui-comparison-006-fg);font-family:var(--vibeui-comparison-006-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="comparison-006"] *{box-sizing:border-box}
[data-vibeui-block="comparison-006"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem}
[data-vibeui-block="comparison-006"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-comparison-006-mono);font-size:.75rem;color:var(--vibeui-comparison-006-accent)}
[data-vibeui-block="comparison-006"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2rem,4.6cqi,3.2rem);line-height:1.05;letter-spacing:-.03em}
[data-vibeui-block="comparison-006"] [data-part="lede"]{margin:1rem 0 0;max-width:30rem;color:var(--vibeui-comparison-006-muted)}
[data-vibeui-block="comparison-006"] [data-part="chart"]{border:1px solid var(--vibeui-comparison-006-line);border-radius:12px;padding:1.5rem;background:var(--vibeui-comparison-006-panel)}
[data-vibeui-block="comparison-006"] [data-part="metric"]{margin:0 0 1.2rem;font-family:var(--vibeui-comparison-006-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-comparison-006-muted)}
[data-vibeui-block="comparison-006"] [data-part="rows"]{display:grid;gap:1rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="comparison-006"] [data-part="row"]{display:grid;grid-template-columns:minmax(6rem,10rem) 1fr auto;gap:1rem;align-items:center}
[data-vibeui-block="comparison-006"] [data-part="name"]{font-weight:600;font-size:.92rem}
[data-vibeui-block="comparison-006"] [data-part="name"] small{display:block;font-weight:400;font-size:.72rem;color:var(--vibeui-comparison-006-muted)}
[data-vibeui-block="comparison-006"] [data-part="track"]{height:1.6rem;border-radius:6px;background:var(--vibeui-comparison-006-line);overflow:hidden}
[data-vibeui-block="comparison-006"] [data-part="bar"]{height:100%;width:calc(var(--vibeui-comparison-006-w) * 100%);background:color-mix(in oklab,var(--vibeui-comparison-006-fg) 40%,var(--vibeui-comparison-006-bg));border-radius:6px;transform:scaleX(0);transform-origin:left;transition:transform 1.1s cubic-bezier(.2,.8,.2,1);transition-delay:calc(var(--vibeui-comparison-006-i) * .12s)}
[data-vibeui-block="comparison-006"] [data-shown="true"] [data-part="bar"]{transform:none}
[data-vibeui-block="comparison-006"] [data-part="row"][data-self="true"] [data-part="bar"]{background:var(--vibeui-comparison-006-accent)}
[data-vibeui-block="comparison-006"] [data-part="row"][data-self="true"] [data-part="name"]::after{content:attr(data-tag);margin-left:.5rem;padding:.1rem .4rem;border-radius:4px;background:var(--vibeui-comparison-006-accent);color:var(--vibeui-comparison-006-on-accent);font-family:var(--vibeui-comparison-006-mono);font-size:.62rem;vertical-align:middle}
[data-vibeui-block="comparison-006"] [data-part="val"]{font-family:var(--vibeui-comparison-006-mono);font-size:.85rem;font-variant-numeric:tabular-nums;min-width:5rem;text-align:right}
[data-vibeui-block="comparison-006"] [data-part="foot"]{margin:1.4rem 0 0;font-size:.75rem;color:var(--vibeui-comparison-006-muted)}
@container (min-width: 60rem){[data-vibeui-block="comparison-006"] [data-part="shell"]{grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);align-items:center;gap:4rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="comparison-006"] *{transition:none!important}[data-vibeui-block="comparison-006"] [data-part="bar"]{transform:none}}`

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

/** Сравнение размера: полосы растут, числа считают вверх при появлении. */
export function Comparison006({
  eyebrow = "// сравнение",
  title = "Меньше — значит быстрее",
  lede = "Размер после gzip у headless-таблиц для React. Данные с bundlephobia на день релиза 2.4.",
  unit = "КБ",
  metric = "gzip, минимальный импорт",
  rows = [
    { name: "tabl", value: 4.1, note: "2.4.1", self: true },
    { name: "react-table", value: 15.6, note: "8.x" },
    { name: "ag-grid community", value: 238, note: "31.x" },
    { name: "mui data grid", value: 96, note: "7.x" },
  ],
  footnote = "Измерено `import { useTable }` без стилей. Полный набор фич tabl — 6,8 КБ.",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Comparison006Props) {
  const chart = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  const max = Math.max(1, ...rows.map((row) => row.value))

  useEffect(() => {
    const element = chart.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: "-15% 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-comparison-006-accent": accent } : null),
    ...(ink ? { "--vibeui-comparison-006-fg": ink } : null),
    ...(background ? { "--vibeui-comparison-006-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-comparison-006" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="comparison-006" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div ref={chart} data-part="chart" data-shown={shown}>
            {metric ? <p data-part="metric">{metric}</p> : null}
            <ul data-part="rows">
              {rows.map((row, index) => (
                <li key={row.name} data-part="row" data-self={row.self ?? false}>
                  <span data-part="name" data-tag="это мы">
                    {row.name}
                    {row.note ? <small>{row.note}</small> : null}
                  </span>
                  <span data-part="track">
                    <span data-part="bar" style={{ ["--vibeui-comparison-006-w" as string]: row.value / max, ["--vibeui-comparison-006-i" as string]: index }} />
                  </span>
                  <Value target={row.value} run={shown} unit={unit} />
                </li>
              ))}
            </ul>
            {footnote ? <p data-part="foot">{footnote}</p> : null}
          </div>
        </div>
      </section>
    </>
  )
}
