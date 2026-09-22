"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Button078 } from "@/registry/components/button/button-078/button-078"

export type Charity003Item = {
  label: string
  /** Сумма за год, в рублях. */
  value: number
}

export type Charity003Year = {
  year: string
  items: readonly Charity003Item[]
  /** Короткая пометка к году: «аудит пройден». */
  note?: string
}

export type Charity003Props = {
  eyebrow?: string
  title?: string
  lede?: string
  years?: readonly Charity003Year[]
  currency?: string
  /** Текст штампа. Пусто — не показывать. */
  stamp?: string
  reportLabel?: string
  reportHref?: string
  /** Единицы суммы, aria года и кольца, подпись. */
  millionUnit?: string
  thousandUnit?: string
  decimalSeparator?: string
  yearsLabel?: string
  ringLabel?: string
  spentLine?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Отчётность фонда: кольцевая диаграмма на SVG — сегменты по pathLength
// растут из нуля, когда блок попадает в viewport, и плавно перетекают при
// переключении года чипами. В центре кольца сумма за год, справа легенда
// со свёрстанными полосками, штамп «0 % на рекламу» бьётся по бумаге при
// появлении. Никаких библиотек графиков.
const FONTS = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;700&display=swap"

const STYLES = `
:where([data-vibeui-block="charity-003"]){
--vibeui-charity-003-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-charity-003-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-charity-003-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-charity-003-on-accent:oklch(from var(--vibeui-charity-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-charity-003-muted:color-mix(in oklab,var(--vibeui-charity-003-fg) 62%,var(--vibeui-charity-003-bg));
--vibeui-charity-003-line:color-mix(in oklab,var(--vibeui-charity-003-fg) 16%,transparent);
--vibeui-charity-003-soft:color-mix(in oklab,var(--vibeui-charity-003-fg) 6%,var(--vibeui-charity-003-bg));
--vibeui-charity-003-c1:var(--vibeui-charity-003-accent);
--vibeui-charity-003-c2:color-mix(in oklab,var(--vibeui-charity-003-accent) 45%,#e0b000);
--vibeui-charity-003-c3:color-mix(in oklab,var(--vibeui-charity-003-fg) 72%,var(--vibeui-charity-003-bg));
--vibeui-charity-003-c4:color-mix(in oklab,var(--vibeui-charity-003-accent) 45%,var(--vibeui-charity-003-bg));
--vibeui-charity-003-c5:color-mix(in oklab,var(--vibeui-charity-003-fg) 32%,var(--vibeui-charity-003-bg));
--vibeui-charity-003-c6:color-mix(in oklab,var(--vibeui-charity-003-accent) 20%,var(--vibeui-charity-003-bg));
--vibeui-charity-003-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-charity-003-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-charity-003-hand:"Caveat","Segoe Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="charity-003"]{color-scheme:dark}
:where([data-vibeui-block="charity-003"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="charity-003"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="charity-003"]{box-sizing:border-box;overflow:hidden;padding:5rem 0;background:var(--vibeui-charity-003-bg);color:var(--vibeui-charity-003-fg);font-family:var(--vibeui-charity-003-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="charity-003"] *{box-sizing:border-box}
[data-vibeui-block="charity-003"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="charity-003"] [data-part="head"]{max-width:44rem}
[data-vibeui-block="charity-003"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.8rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-charity-003-accent)}
[data-vibeui-block="charity-003"] [data-part="title"]{margin:0;font-family:var(--vibeui-charity-003-display);font-weight:500;font-size:clamp(2rem,4.6cqi,3.4rem);line-height:1.08;letter-spacing:-.02em}
[data-vibeui-block="charity-003"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-charity-003-muted)}
[data-vibeui-block="charity-003"] [data-part="years"]{display:flex;flex-wrap:wrap;gap:.5rem;margin:2rem 0 0;padding:0;list-style:none}
[data-vibeui-block="charity-003"] button:focus-visible,[data-vibeui-block="charity-003"] a:focus-visible{outline:2px solid var(--vibeui-charity-003-accent);outline-offset:2px}
[data-vibeui-block="charity-003"] [data-part="grid"]{display:grid;gap:2.5rem;margin:2.5rem 0 0;align-items:center}
[data-vibeui-block="charity-003"] [data-part="chart"]{position:relative;width:min(100%,22rem);margin:0 auto}
[data-vibeui-block="charity-003"] [data-part="ring"]{display:block;width:100%;height:auto;transform:rotate(-90deg)}
[data-vibeui-block="charity-003"] [data-part="seg"]{fill:none;stroke-width:14;stroke-linecap:butt;stroke-dasharray:0 100;transition:stroke-dasharray 1.4s cubic-bezier(.2,.8,.2,1),stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1),opacity .3s}
[data-vibeui-block="charity-003"][data-in="true"] [data-part="seg"]{stroke-dasharray:var(--vibeui-charity-003-len) 100}
[data-vibeui-block="charity-003"] [data-part="seg"][data-dim="true"]{opacity:.25}
[data-vibeui-block="charity-003"] [data-part="center"]{position:absolute;inset:0;display:grid;place-content:center;text-align:center;gap:.2rem;padding:20%}
[data-vibeui-block="charity-003"] [data-part="center"] strong{font-family:var(--vibeui-charity-003-display);font-weight:700;font-size:clamp(1.5rem,8cqi,2.2rem);line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums;animation:vibeui-charity-003-in .5s ease-out both}
[data-vibeui-block="charity-003"] [data-part="center"] span{font-size:.85rem;color:var(--vibeui-charity-003-muted)}
[data-vibeui-block="charity-003"] [data-part="stamp"]{position:absolute;right:-.5rem;bottom:-.5rem;width:7.5rem;height:7.5rem;border:3px double var(--vibeui-charity-003-accent);border-radius:50%;display:grid;place-content:center;text-align:center;font-family:var(--vibeui-charity-003-hand);font-size:1.15rem;line-height:1;color:var(--vibeui-charity-003-accent);transform:rotate(-14deg) scale(1.8);opacity:0;mix-blend-mode:multiply;transition:transform .5s cubic-bezier(.2,.9,.3,1.4) 1.2s,opacity .3s ease 1.2s;pointer-events:none}
[data-vibeui-block="charity-003"] [data-part="stamp"] b{font-size:2.2rem;font-weight:700;display:block}
[data-vibeui-block="charity-003"][data-in="true"] [data-part="stamp"]{transform:rotate(-14deg) scale(1);opacity:.9}
[data-vibeui-block="charity-003"] [data-part="legend"]{margin:0;padding:0;list-style:none;display:grid;gap:.9rem}
[data-vibeui-block="charity-003"] [data-part="row"]{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:.4rem .8rem;padding:.3rem 0;cursor:default}
[data-vibeui-block="charity-003"] [data-part="dot"]{width:.9rem;height:.9rem;border-radius:.25rem;background:var(--vibeui-charity-003-c)}
[data-vibeui-block="charity-003"] [data-part="row"] h3{margin:0;font-weight:500;font-size:1rem}
[data-vibeui-block="charity-003"] [data-part="row"] output{font-family:var(--vibeui-charity-003-display);font-weight:700;font-size:1.15rem;font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="charity-003"] [data-part="row"] output small{font-family:var(--vibeui-charity-003-font);font-weight:400;font-size:.8rem;color:var(--vibeui-charity-003-muted);margin-left:.4rem}
[data-vibeui-block="charity-003"] [data-part="track"]{grid-column:2/-1;height:.35rem;border-radius:999px;background:var(--vibeui-charity-003-soft);overflow:hidden}
[data-vibeui-block="charity-003"] [data-part="track"] i{display:block;height:100%;width:var(--vibeui-charity-003-w);background:var(--vibeui-charity-003-c);transform:scaleX(0);transform-origin:left;transition:transform 1.2s cubic-bezier(.2,.8,.2,1) .2s,width .8s ease}
[data-vibeui-block="charity-003"][data-in="true"] [data-part="track"] i{transform:scaleX(1)}
[data-vibeui-block="charity-003"] [data-part="foot"]{display:flex;flex-wrap:wrap;align-items:center;gap:.6rem 1.4rem;margin:1.6rem 0 0;font-size:.9rem;color:var(--vibeui-charity-003-muted)}
[data-vibeui-block="charity-003"] [data-part="foot"] em{font-family:var(--vibeui-charity-003-hand);font-style:normal;font-size:1.3rem;color:var(--vibeui-charity-003-accent)}
[data-vibeui-block="charity-003"] [data-part="report"]{color:var(--vibeui-charity-003-fg);font-weight:600;text-decoration:none;border-bottom:1px solid var(--vibeui-charity-003-line);transition:border-color .2s}
[data-vibeui-block="charity-003"] [data-part="report"]:hover{border-color:var(--vibeui-charity-003-accent)}
@keyframes vibeui-charity-003-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@container (min-width: 56rem){[data-vibeui-block="charity-003"] [data-part="grid"]{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:4rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="charity-003"] *{animation:none!important;transition:none!important}[data-vibeui-block="charity-003"] [data-part="seg"]{stroke-dasharray:var(--vibeui-charity-003-len) 100}[data-vibeui-block="charity-003"] [data-part="track"] i{transform:scaleX(1)}[data-vibeui-block="charity-003"] [data-part="stamp"]{transform:rotate(-14deg);opacity:.9}}`

const DEFAULT_YEARS: Charity003Year[] = [
  {
    year: "2025",
    note: "аудит пройден",
    items: [
      { label: "Продукты и лекарства", value: 9_640_000 },
      { label: "Соцработники: зарплаты", value: 6_120_000 },
      { label: "Ремонт и оборудование", value: 2_380_000 },
      { label: "Транспорт и логистика", value: 1_150_000 },
      { label: "Администрирование", value: 890_000 },
    ],
  },
  {
    year: "2024",
    note: "аудит пройден",
    items: [
      { label: "Продукты и лекарства", value: 7_210_000 },
      { label: "Соцработники: зарплаты", value: 4_480_000 },
      { label: "Ремонт и оборудование", value: 1_930_000 },
      { label: "Транспорт и логистика", value: 960_000 },
      { label: "Администрирование", value: 720_000 },
    ],
  },
  {
    year: "2023",
    items: [
      { label: "Продукты и лекарства", value: 4_860_000 },
      { label: "Соцработники: зарплаты", value: 2_940_000 },
      { label: "Ремонт и оборудование", value: 1_120_000 },
      { label: "Транспорт и логистика", value: 610_000 },
      { label: "Администрирование", value: 540_000 },
    ],
  },
]

function formatMoney(value: number) {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

function formatShort(value: number, millionUnit: string, thousandUnit: string, decimalSeparator: string) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(".0", "").replace(".", decimalSeparator)} ${millionUnit}`
  if (value >= 1_000) return `${Math.round(value / 1_000)} ${thousandUnit}`
  return String(value)
}

/** Отчётность: кольцевая диаграмма по годам и штамп «0 % на рекламу». */
export function Charity003({
  eyebrow = "Отчётность",
  title = "Куда ушёл каждый рубль",
  lede = "Раз в год — аудит, раз в квартал — отчёт на сайте, раз в месяц — письмо жертвователям с цифрами. Рекламу не покупаем: о нас рассказывают те, кому помогли.",
  years = DEFAULT_YEARS,
  currency = "₽",
  stamp = "на рекламу",
  reportLabel = "Открыть годовой отчёт (PDF)",
  reportHref = "#documents",
  millionUnit = "млн",
  thousandUnit = "тыс.",
  decimalSeparator = ",",
  yearsLabel = "Год",
  ringLabel = "Расходы за {year}: {total}",
  spentLine = "расходы за {year}",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Charity003Props) {
  const rootRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const [yearIndex, setYearIndex] = useState(0)
  const [hover, setHover] = useState<number | null>(null)
  const current = years[yearIndex] ?? years[0]
  const total = current ? current.items.reduce((sum, item) => sum + item.value, 0) : 0

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-charity-003-accent": accent } : null),
    ...(ink ? { "--vibeui-charity-003-fg": ink } : null),
    ...(background ? { "--vibeui-charity-003-bg": background } : null),
    ...style,
  } as CSSProperties

  // Стартовые смещения сегментов: накопленная сумма долей до текущего.
  const starts = current ? current.items.reduce<number[]>((acc, item) => [...acc, acc[acc.length - 1] + (total > 0 ? (item.value / total) * 100 : 0)], [0]) : []

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-charity-003" precedence="medium">
        {STYLES}
      </style>
      <section ref={rootRef} data-vibeui-block="charity-003" data-tone={tone === "auto" ? undefined : tone} data-in={inView} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          {years.length > 1 ? (
            <ul data-part="years" aria-label={yearsLabel}>
              {years.map((item, index) => (
                <li key={item.year}>
                  <Button078 data-part="year" year={item.year} aria-pressed={index === yearIndex} onClick={() => setYearIndex(index)} accent={accent} />
                </li>
              ))}
            </ul>
          ) : null}
          {current ? (
            <div data-part="grid">
              <div data-part="chart">
                <svg data-part="ring" viewBox="0 0 100 100" role="img" aria-label={ringLabel.replace("{year}", current.year).replace("{total}", `${formatMoney(total)} ${currency}`)}>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--vibeui-charity-003-soft)" strokeWidth="14" />
                  {current.items.map((item, index) => {
                    const length = total > 0 ? (item.value / total) * 100 : 0
                    const start = starts[index]
                    return (
                      <circle
                        key={item.label}
                        data-part="seg"
                        data-dim={hover !== null && hover !== index}
                        cx="50"
                        cy="50"
                        r="40"
                        pathLength={100}
                        stroke={`var(--vibeui-charity-003-c${(index % 6) + 1})`}
                        style={{ ["--vibeui-charity-003-len" as string]: Math.max(0, length - 0.6), strokeDashoffset: -start }}
                      />
                    )
                  })}
                </svg>
                <div data-part="center" aria-hidden="true">
                  <strong key={current.year}>
                    {formatShort(total, millionUnit, thousandUnit, decimalSeparator)} {currency}
                  </strong>
                  <span>{spentLine.replace("{year}", current.year)}</span>
                </div>
                {stamp ? (
                  <div data-part="stamp" aria-hidden="true">
                    <b>0 %</b>
                    {stamp}
                  </div>
                ) : null}
              </div>
              <div>
                <ul data-part="legend">
                  {current.items.map((item, index) => {
                    const share = total > 0 ? (item.value / total) * 100 : 0
                    return (
                      <li key={item.label} data-part="row" onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(null)} style={{ ["--vibeui-charity-003-c" as string]: `var(--vibeui-charity-003-c${(index % 6) + 1})` }}>
                        <i data-part="dot" aria-hidden="true" />
                        <h3>{item.label}</h3>
                        <output>
                          {share.toFixed(1).replace(".", ",")} %<small>{formatMoney(item.value)} {currency}</small>
                        </output>
                        <div data-part="track" aria-hidden="true">
                          <i style={{ ["--vibeui-charity-003-w" as string]: `${share}%` }} />
                        </div>
                      </li>
                    )
                  })}
                </ul>
                <div data-part="foot">
                  {current.note ? <em>✓ {current.note}</em> : null}
                  {reportLabel ? (
                    <a data-part="report" href={reportHref}>
                      {reportLabel}
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
