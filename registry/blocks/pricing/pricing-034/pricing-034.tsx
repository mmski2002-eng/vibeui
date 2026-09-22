"use client"

import { useState, type CSSProperties } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"
import { Slider013 } from "@/registry/components/slider/slider-013/slider-013"

export type Pricing034Tier = {
  /** Верхняя граница ступени, запросов в месяц. Последняя — Infinity. */
  upTo: number
  /** Цена за 1 000 запросов внутри ступени. */
  perThousand: number
  label: string
}

export type Pricing034Props = {
  eyebrow?: string
  title?: string
  lede?: string
  tiers?: readonly Pricing034Tier[]
  /** Границы ползунка (логарифмическая шкала). */
  minRequests?: number
  maxRequests?: number
  defaultRequests?: number
  currency?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  /** Подписи под ценой: «без карты», «счёт по факту». */
  fine?: readonly string[]
  /** Единицы счётчика, подписи ползунка, итога и графика. */
  millionUnit?: string
  thousandUnit?: string
  decimalSeparator?: string
  requestsLabel?: string
  requestsUnit?: string
  requestsValue?: string
  totalLabel?: string
  monthUnit?: string
  effectiveLine?: string
  freeLabel?: string
  chartLabel?: string
  yLabel?: string
  xLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Калькулятор оплаты за запросы: логарифмический ползунок от тысячи до
// ста миллионов запросов в месяц, цена считается прогрессивно по
// ступеням (бесплатно до 10k, дальше дешевле с объёмом). Справа SVG-
// лестница ставок: активная ступень подсвечена акцентом, маркер с пунктиром
// едет за ползунком, площадь под пройденными ступенями заливается. Под
// ценой — разбор по ступеням с суммами и эффективная ставка за 1 000.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="pricing-034"]){
--vibeui-pricing-034-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-pricing-034-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-pricing-034-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-pricing-034-on-accent:oklch(from var(--vibeui-pricing-034-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-pricing-034-muted:color-mix(in oklab,var(--vibeui-pricing-034-fg) 60%,var(--vibeui-pricing-034-bg));
--vibeui-pricing-034-line:color-mix(in oklab,var(--vibeui-pricing-034-fg) 12%,transparent);
--vibeui-pricing-034-panel:color-mix(in oklab,var(--vibeui-pricing-034-fg) 4%,var(--vibeui-pricing-034-bg));
--vibeui-pricing-034-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-pricing-034-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-034"]{color-scheme:dark}
:where([data-vibeui-block="pricing-034"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="pricing-034"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="pricing-034"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-pricing-034-bg);color:var(--vibeui-pricing-034-fg);font-family:var(--vibeui-pricing-034-display);font-size:1rem;line-height:1.5}
[data-vibeui-block="pricing-034"] *{box-sizing:border-box}
[data-vibeui-block="pricing-034"] [data-part="range"]{width:100%;margin:.6rem 0 0}
[data-vibeui-block="pricing-034"] [data-part="ticks"]{display:flex;margin:.4rem 0 0}
[data-vibeui-block="pricing-034"] [data-part="range"]{margin:.6rem 0 0}
[data-vibeui-block="pricing-034"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="pricing-034"] [data-part="head"]{max-width:42rem;margin:0 0 2.2rem}
[data-vibeui-block="pricing-034"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-pricing-034-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-pricing-034-accent)}
[data-vibeui-block="pricing-034"] [data-part="eyebrow"]::before{content:"// "}
[data-vibeui-block="pricing-034"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.02;letter-spacing:-.04em}
[data-vibeui-block="pricing-034"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-pricing-034-muted)}
[data-vibeui-block="pricing-034"] [data-part="left"]{display:grid;gap:1.4rem;align-content:start}
[data-vibeui-block="pricing-034"] [data-part="calc"]{display:grid;gap:1.5rem;padding:1.25rem;border:1px solid var(--vibeui-pricing-034-line);border-radius:1.2rem;background:var(--vibeui-pricing-034-panel)}
[data-vibeui-block="pricing-034"] [data-part="count"]{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:.4rem 1rem;font-size:.85rem;color:var(--vibeui-pricing-034-muted)}
[data-vibeui-block="pricing-034"] [data-part="count"] output{font-family:var(--vibeui-pricing-034-mono);font-weight:600;font-size:1.5rem;letter-spacing:-.02em;color:var(--vibeui-pricing-034-fg);font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-034"] [data-part="count"] output small{font-family:var(--vibeui-pricing-034-display);font-weight:400;font-size:.8rem;color:var(--vibeui-pricing-034-muted);margin-left:.4rem}
[data-vibeui-block="pricing-034"] [data-part="ticks"]{display:flex;justify-content:space-between;margin:.4rem 0 0;padding:0;list-style:none;font-family:var(--vibeui-pricing-034-mono);font-size:.64rem;color:var(--vibeui-pricing-034-muted)}
[data-vibeui-block="pricing-034"] [data-part="total"]{display:grid;gap:.2rem;padding:1.1rem 0;border-top:1px dashed var(--vibeui-pricing-034-line);border-bottom:1px dashed var(--vibeui-pricing-034-line)}
[data-vibeui-block="pricing-034"] [data-part="total"] span{font-size:.8rem;color:var(--vibeui-pricing-034-muted)}
[data-vibeui-block="pricing-034"] [data-part="price"]{font-family:var(--vibeui-pricing-034-mono);font-weight:600;font-size:clamp(2.2rem,5cqi,3.2rem);line-height:1;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-034"] [data-part="price"][data-free="true"]{color:var(--vibeui-pricing-034-accent)}
[data-vibeui-block="pricing-034"] [data-part="price"] small{font-size:.9rem;font-weight:400;color:var(--vibeui-pricing-034-muted);letter-spacing:0;margin-left:.3rem}
[data-vibeui-block="pricing-034"] [data-part="rate"]{font-family:var(--vibeui-pricing-034-mono);font-size:.78rem;color:var(--vibeui-pricing-034-muted)}
[data-vibeui-block="pricing-034"] [data-part="rate"] b{color:var(--vibeui-pricing-034-fg);font-weight:600}
[data-vibeui-block="pricing-034"] [data-part="steps"]{display:grid;gap:.35rem;margin:0;padding:0;list-style:none;font-family:var(--vibeui-pricing-034-mono);font-size:.74rem}
[data-vibeui-block="pricing-034"] [data-part="steps"] li{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:.6rem;padding:.5rem .7rem;border-radius:.5rem;border:1px solid transparent;color:var(--vibeui-pricing-034-muted);transition:border-color .25s,background .25s,color .25s}
[data-vibeui-block="pricing-034"] [data-part="steps"] li i{width:.45rem;height:.45rem;border-radius:50%;background:var(--vibeui-pricing-034-line)}
[data-vibeui-block="pricing-034"] [data-part="steps"] li[data-on="true"]{border-color:var(--vibeui-pricing-034-line);background:var(--vibeui-pricing-034-bg);color:var(--vibeui-pricing-034-fg)}
[data-vibeui-block="pricing-034"] [data-part="steps"] li[data-on="true"] i{background:var(--vibeui-pricing-034-accent);box-shadow:0 0 8px var(--vibeui-pricing-034-accent)}
[data-vibeui-block="pricing-034"] [data-part="steps"] li[data-active="true"]{border-color:color-mix(in oklab,var(--vibeui-pricing-034-accent) 60%,transparent)}
[data-vibeui-block="pricing-034"] [data-part="steps"] em{font-style:normal;text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-034"] [data-part="chart"]{display:grid;gap:.6rem;align-content:start}
[data-vibeui-block="pricing-034"] [data-part="chart"] svg{width:100%;height:auto;overflow:visible;font-family:var(--vibeui-pricing-034-mono)}
[data-vibeui-block="pricing-034"] [data-part="chart"] text{font-size:9px;fill:var(--vibeui-pricing-034-muted)}
[data-vibeui-block="pricing-034"] [data-part="grid-line"]{stroke:var(--vibeui-pricing-034-line);stroke-width:1}
[data-vibeui-block="pricing-034"] [data-part="step"]{fill:none;stroke:color-mix(in oklab,var(--vibeui-pricing-034-fg) 35%,transparent);stroke-width:2;transition:stroke .3s}
[data-vibeui-block="pricing-034"] [data-part="step"][data-on="true"]{stroke:var(--vibeui-pricing-034-accent)}
[data-vibeui-block="pricing-034"] [data-part="area"]{fill:color-mix(in oklab,var(--vibeui-pricing-034-accent) 14%,transparent);transition:d .3s}
[data-vibeui-block="pricing-034"] [data-part="marker"]{stroke:var(--vibeui-pricing-034-accent);stroke-width:1;stroke-dasharray:3 3;transition:transform .25s ease-out}
[data-vibeui-block="pricing-034"] [data-part="dot"]{fill:var(--vibeui-pricing-034-accent);stroke:var(--vibeui-pricing-034-bg);stroke-width:3;transition:transform .25s ease-out}
[data-vibeui-block="pricing-034"] [data-part="legend"]{display:flex;justify-content:space-between;font-family:var(--vibeui-pricing-034-mono);font-size:.68rem;color:var(--vibeui-pricing-034-muted)}
[data-vibeui-block="pricing-034"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:.6rem}
[data-vibeui-block="pricing-034"] a:focus-visible{outline:2px solid var(--vibeui-pricing-034-accent);outline-offset:2px}
[data-vibeui-block="pricing-034"] [data-part="fine"]{display:flex;flex-wrap:wrap;gap:.3rem 1rem;margin:0;padding:0;list-style:none;font-size:.78rem;color:var(--vibeui-pricing-034-muted)}
[data-vibeui-block="pricing-034"] [data-part="fine"] li::before{content:"✓ ";color:var(--vibeui-pricing-034-accent)}
@container (min-width: 60rem){[data-vibeui-block="pricing-034"] [data-part="calc"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:2.5rem;padding:2rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-034"] *{animation:none!important;transition:none!important}}`

const DEFAULT_TIERS: Pricing034Tier[] = [
  { upTo: 10000, perThousand: 0, label: "первые 10 000" },
  { upTo: 1000000, perThousand: 0.4, label: "до 1 млн" },
  { upTo: 10000000, perThousand: 0.25, label: "до 10 млн" },
  { upTo: Infinity, perThousand: 0.12, label: "свыше 10 млн" },
]

function formatCount(value: number, millionUnit: string, thousandUnit: string, decimalSeparator: string) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1).replace(".", decimalSeparator)} ${millionUnit}`
  if (value >= 1000) return `${Math.round(value / 1000)} ${thousandUnit}`
  return String(value)
}

function formatMoney(value: number, currency: string) {
  const rounded = Math.round(value)
  return `${String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${currency}`
}

function formatRate(value: number, currency: string) {
  return `${value.toFixed(2).replace(".", ",")} ${currency}`
}

function breakdown(requests: number, tiers: readonly Pricing034Tier[]) {
  let from = 0
  return tiers.map((tier) => {
    const inTier = Math.max(0, Math.min(requests, tier.upTo) - from)
    const sum = (inTier / 1000) * tier.perThousand
    const row = { tier, from, inTier, sum, active: requests > from && requests <= tier.upTo }
    from = tier.upTo
    return row
  })
}

/** Калькулятор оплаты за запросы с лестницей ступеней. */
export function Pricing034({
  eyebrow = "Цены",
  title = "Платите за запросы, не за место",
  lede = "Первые десять тысяч запросов в месяц бесплатно — навсегда. Дальше цена за тысячу падает с объёмом. Подвиньте ползунок под свою нагрузку.",
  tiers = DEFAULT_TIERS,
  minRequests = 1000,
  maxRequests = 100000000,
  defaultRequests = 250000,
  currency = "₽",
  primaryLabel = "Начать бесплатно",
  primaryHref = "#key",
  secondaryLabel = "Нужен договор",
  secondaryHref = "#contact",
  fine = ["Без карты до 10 000", "Счёт по факту в конце месяца", "Лимиты и алерты в кабинете"],
  millionUnit = "млн",
  thousandUnit = "тыс.",
  decimalSeparator = ",",
  requestsLabel = "Запросов в месяц",
  requestsUnit = "запросов / мес",
  requestsValue = "{n} запросов",
  totalLabel = "Итого в месяц",
  monthUnit = "мес",
  effectiveLine = "эффективно {effective} за 1 000 · {rate} на текущей ступени",
  freeLabel = "бесплатно",
  chartLabel = "Лестница ставок: цена за тысячу запросов по объёму",
  yLabel = "{currency} за 1 000 запросов",
  xLabel = "запросов в месяц →",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Pricing034Props) {
  const logMin = Math.log10(minRequests)
  const logMax = Math.log10(maxRequests)
  const toSlider = (value: number) => Math.round(((Math.log10(value) - logMin) / (logMax - logMin)) * 1000)
  const fromSlider = (value: number) => {
    const raw = 10 ** (logMin + (value / 1000) * (logMax - logMin))
    const magnitude = 10 ** Math.floor(Math.log10(raw))
    return Math.round((raw / magnitude) * 10) * (magnitude / 10)
  }
  const [slider, setSlider] = useState(() => toSlider(defaultRequests))
  const requests = fromSlider(slider)
  const rows = breakdown(requests, tiers)
  const total = rows.reduce((sum, row) => sum + row.sum, 0)
  const effective = requests > 0 ? (total / requests) * 1000 : 0

  // Лестница: x — логарифм запросов, y — ставка за тысячу.
  const maxRate = Math.max(...tiers.map((tier) => tier.perThousand), 0.01)
  const width = 400
  const height = 190
  const padL = 30
  const padB = 24
  const x = (value: number) => padL + ((Math.log10(Math.min(Math.max(value, minRequests), maxRequests)) - logMin) / (logMax - logMin)) * (width - padL - 8)
  const y = (rate: number) => 12 + (1 - rate / maxRate) * (height - padB - 12)
  const markerX = x(requests)
  const currentRate = rows.find((row) => row.active)?.tier.perThousand ?? 0
  const area = rows
    .filter((row) => row.inTier > 0)
    .map((row) => `M${x(Math.max(row.from, minRequests))} ${y(0)} V${y(row.tier.perThousand)} H${x(Math.min(row.tier.upTo, requests))} V${y(0)} Z`)
    .join(" ")
  const tickValues = Array.from({ length: Math.floor(logMax - logMin) + 1 }, (_, index) => 10 ** (logMin + index))

  const palette = {
    ...(accent ? { "--vibeui-pricing-034-accent": accent } : null),
    ...(ink ? { "--vibeui-pricing-034-fg": ink } : null),
    ...(background ? { "--vibeui-pricing-034-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-pricing-034" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="pricing-034" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="calc">
            <div data-part="left">
              <div>
                <label data-part="count">
                  <span>{requestsLabel}</span>
                  <output>
                    {formatMoney(requests, "").trim()}
                    <small>{requestsUnit}</small>
                  </output>
                </label>
                <Slider013 data-part="range" value={slider} min={0} max={1000} onChange={setSlider} aria-label={requestsLabel} aria-valuetext={requestsValue.replace("{n}", formatCount(requests, millionUnit, thousandUnit, decimalSeparator))} surface="var(--vibeui-pricing-034-bg)" accent="var(--vibeui-pricing-034-accent)" />
                <ul data-part="ticks" aria-hidden="true">
                  {tickValues.map((value) => (
                    <li key={value}>{formatCount(value, millionUnit, thousandUnit, decimalSeparator)}</li>
                  ))}
                </ul>
              </div>
              <div data-part="total" aria-live="polite">
                <span>{totalLabel}</span>
                <div data-part="price" data-free={total === 0 ? "true" : undefined}>
                  {total === 0 ? "0" : formatMoney(total, "")}
                  <small>{currency} / {monthUnit}</small>
                </div>
                <p data-part="rate">
                  {effectiveLine.split("{effective}")[0]}
                  <b>{formatRate(effective, currency)}</b>
                  {(effectiveLine.split("{effective}")[1] ?? "").replace("{rate}", formatRate(currentRate, currency))}
                </p>
              </div>
              <ul data-part="steps">
                {rows.map((row) => (
                  <li key={row.tier.label} data-on={row.inTier > 0 ? "true" : undefined} data-active={row.active ? "true" : undefined}>
                    <i aria-hidden="true" />
                    <span>
                      {row.tier.label} · {row.tier.perThousand === 0 ? freeLabel : `${formatRate(row.tier.perThousand, currency)} / 1 000`}
                    </span>
                    <em>{row.inTier > 0 ? formatMoney(row.sum, currency) : "—"}</em>
                  </li>
                ))}
              </ul>
            </div>
            <div data-part="chart">
              <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={chartLabel}>
                {[0, 0.5, 1].map((share) => (
                  <line key={share} data-part="grid-line" x1={padL} x2={width - 8} y1={y(maxRate * share)} y2={y(maxRate * share)} />
                ))}
                {[0, 0.5, 1].map((share) => (
                  <text key={share} x={0} y={y(maxRate * share) + 3}>
                    {formatRate(maxRate * share, "")}
                  </text>
                ))}
                {tickValues.map((value) => (
                  <text key={value} x={x(value)} y={height - 6} textAnchor="middle">
                    {formatCount(value, millionUnit, thousandUnit, decimalSeparator)}
                  </text>
                ))}
                <path data-part="area" d={area} />
                {rows.map((row) => (
                  <path key={row.tier.label} data-part="step" data-on={row.inTier > 0 ? "true" : undefined} d={`M${x(Math.max(row.from, minRequests))} ${y(row.tier.perThousand)} H${x(row.tier.upTo)}`} />
                ))}
                <line data-part="marker" x1={0} x2={0} y1={y(0)} y2={8} style={{ transform: `translateX(${markerX}px)` }} />
                <circle data-part="dot" r={5} cx={0} cy={y(currentRate)} style={{ transform: `translateX(${markerX}px)` }} />
              </svg>
              <div data-part="legend">
                <span>{yLabel.replace("{currency}", currency)}</span>
                <span>{xLabel}</span>
              </div>
              <div data-part="actions">
                {primaryLabel ? (
                  <Button016
                    data-part="primary"
                    size="lg"
                    label={primaryLabel}
                    href={primaryHref}
                    external={false}
                    tone="accent"
                    accent={accent}
                  />
                ) : null}
                {secondaryLabel ? (
                  <Button016
                    data-part="secondary"
                    size="lg"
                    label={secondaryLabel}
                    href={secondaryHref}
                    external={false}
                    tone="neutral"
                    accent={accent}
                  />
                ) : null}
              </div>
              {fine.length > 0 ? (
                <ul data-part="fine">
                  {fine.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
