"use client"

import { useEffect, useId, useRef, useState, type CSSProperties } from "react"

export type Realty006Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Начальные значения. */
  price?: number
  downPercent?: number
  years?: number
  rate?: number
  /** Диапазоны. */
  priceRange?: readonly [number, number]
  yearsRange?: readonly [number, number]
  rateRange?: readonly [number, number]
  actionLabel?: string
  actionHref?: string
  note?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  /** Подписи ползунков и итога. */
  costLabel?: string
  downLabel?: string
  termLabel?: string
  yearsUnit?: string
  rateLabel?: string
  monthlyLabel?: string
  loanLabel?: string
  overpayLabel?: string
  currency?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Ипотечный калькулятор: четыре ползунка — цена, взнос, срок, ставка —
// и ежемесячный платёж по аннуитетной формуле. Число платежа не прыгает,
// а набегает к новому значению; рядом переплата и сумма кредита.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap"

function annuity(principal: number, yearlyRate: number, years: number) {
  const monthly = yearlyRate / 100 / 12
  const count = years * 12

  if (monthly === 0) return principal / count

  return (principal * monthly) / (1 - (1 + monthly) ** -count)
}

const rub = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 })

function money(value: number, currency: string) {
  return `${rub.format(Math.round(value))} ${currency}`
}

/** Число, которое едет к целевому значению, а не прыгает. */
function useRolling(target: number) {
  const [shown, setShown] = useState(target)
  const frame = useRef(0)

  useEffect(() => {
    const from = shown
    const start = performance.now()
    const duration = 450

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3

      setShown(from + (target - from) * eased)

      if (t < 1) frame.current = window.requestAnimationFrame(tick)
    }

    frame.current = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(frame.current)
    // Перезапуск только по новой цели: shown внутри — стартовая точка.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  return shown
}

const STYLES = `
:where([data-vibeui-block="realty-006"]){
--vibeui-realty-006-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-realty-006-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-realty-006-muted:color-mix(in oklab,var(--vibeui-realty-006-fg) 62%,var(--vibeui-realty-006-bg));
--vibeui-realty-006-card:light-dark(#fffdf9,#242424);
--vibeui-realty-006-line:color-mix(in oklab,var(--vibeui-realty-006-fg) 14%,var(--vibeui-realty-006-bg));
--vibeui-realty-006-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-realty-006-on-accent:oklch(from var(--vibeui-realty-006-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-realty-006-plate-accent:oklch(from var(--vibeui-realty-006-accent) calc(l + clamp(0,(0.02 - c) * 100,1) * (clamp(0,(0.5 - l) * 100,1) * (0.92 - l) - clamp(0,(l - 0.5) * 100,1) * (l - 0.15))) c h);
--vibeui-realty-006-plate-on-accent:oklch(from var(--vibeui-realty-006-plate-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-realty-006-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-realty-006-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="realty-006"]{color-scheme:dark}
:where([data-vibeui-block="realty-006"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="realty-006"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="realty-006"]{box-sizing:border-box;display:block;background:var(--vibeui-realty-006-bg);color:var(--vibeui-realty-006-fg);font-family:var(--vibeui-realty-006-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="realty-006"] *{box-sizing:border-box}
[data-vibeui-block="realty-006"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem;display:grid;gap:2rem}
[data-vibeui-block="realty-006"] [data-part="eyebrow"]{margin:0 0 .5rem;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-realty-006-accent);font-weight:600}
[data-vibeui-block="realty-006"] [data-part="title"]{margin:0;font-family:var(--vibeui-realty-006-display);font-weight:500;font-size:clamp(2rem,4.5cqi,3.25rem);line-height:1.05}
[data-vibeui-block="realty-006"] [data-part="lede"]{margin:.75rem 0 0;max-width:34rem;color:var(--vibeui-realty-006-muted)}
[data-vibeui-block="realty-006"] [data-part="panel"]{display:grid;gap:1.5rem;padding:1.5rem;border-radius:1rem;background:var(--vibeui-realty-006-card);border:1px solid var(--vibeui-realty-006-line)}
[data-vibeui-block="realty-006"] [data-part="field"]{display:grid;gap:.5rem}
[data-vibeui-block="realty-006"] [data-part="field"] label{display:flex;justify-content:space-between;gap:1rem;font-size:.8rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-realty-006-muted)}
[data-vibeui-block="realty-006"] [data-part="field"] output{font-family:var(--vibeui-realty-006-display);font-size:1.25rem;font-weight:600;letter-spacing:0;text-transform:none;color:var(--vibeui-realty-006-fg)}
[data-vibeui-block="realty-006"] input[type="range"]{width:100%;height:1.5rem;margin:0;appearance:none;background:transparent;cursor:pointer}
[data-vibeui-block="realty-006"] input[type="range"]::-webkit-slider-runnable-track{height:3px;border-radius:2px;background:linear-gradient(to right,var(--vibeui-realty-006-accent) var(--vibeui-realty-006-p,50%),var(--vibeui-realty-006-line) var(--vibeui-realty-006-p,50%))}
[data-vibeui-block="realty-006"] input[type="range"]::-moz-range-track{height:3px;border-radius:2px;background:var(--vibeui-realty-006-line)}
[data-vibeui-block="realty-006"] input[type="range"]::-moz-range-progress{height:3px;border-radius:2px;background:var(--vibeui-realty-006-accent)}
[data-vibeui-block="realty-006"] input[type="range"]::-webkit-slider-thumb{appearance:none;width:1.1rem;height:1.1rem;margin-top:-.4rem;border-radius:50%;background:var(--vibeui-realty-006-card);border:2px solid var(--vibeui-realty-006-accent);box-shadow:0 2px 6px rgb(0 0 0 / .2)}
[data-vibeui-block="realty-006"] input[type="range"]::-moz-range-thumb{width:1.1rem;height:1.1rem;border-radius:50%;background:var(--vibeui-realty-006-card);border:2px solid var(--vibeui-realty-006-accent)}
[data-vibeui-block="realty-006"] input[type="range"]:focus-visible{outline:2px solid var(--vibeui-realty-006-accent);outline-offset:4px;border-radius:2px}
[data-vibeui-block="realty-006"] [data-part="result"]{display:grid;gap:1.25rem;align-content:space-between;padding:1.75rem;border-radius:1rem;background:var(--vibeui-realty-006-fg);color:var(--vibeui-realty-006-bg)}
[data-vibeui-block="realty-006"] [data-part="result"] small{display:block;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;opacity:.7}
[data-vibeui-block="realty-006"] [data-part="payment"]{font-family:var(--vibeui-realty-006-display);font-size:clamp(2.5rem,6cqi,4rem);font-weight:600;line-height:1;font-variant-numeric:tabular-nums;color:var(--vibeui-realty-006-plate-accent)}
[data-vibeui-block="realty-006"] [data-part="row"]{display:flex;justify-content:space-between;gap:1rem;padding-top:.75rem;border-top:1px solid color-mix(in oklab,currentColor 18%,transparent);font-variant-numeric:tabular-nums}
[data-vibeui-block="realty-006"] [data-part="row"] b{font-weight:600}
[data-vibeui-block="realty-006"] [data-part="action"]{display:inline-flex;justify-content:center;align-items:center;margin-top:.5rem;padding:.85rem 1.5rem;border-radius:999px;background:var(--vibeui-realty-006-plate-accent);color:var(--vibeui-realty-006-plate-on-accent);font-weight:700;text-decoration:none;transition:transform .2s}
[data-vibeui-block="realty-006"] [data-part="action"]:hover{transform:translateY(-1px)}
[data-vibeui-block="realty-006"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-realty-006-bg);outline-offset:2px}
[data-vibeui-block="realty-006"] [data-part="note"]{margin:0;font-size:.78rem;opacity:.7}
@container (min-width: 56rem){
[data-vibeui-block="realty-006"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-areas:"head head" "panel result";gap:2.5rem 3rem;padding:5.5rem 2rem;align-items:stretch}
[data-vibeui-block="realty-006"] [data-part="head"]{grid-area:head}
[data-vibeui-block="realty-006"] [data-part="panel"]{grid-area:panel;padding:2rem}
[data-vibeui-block="realty-006"] [data-part="result"]{grid-area:result;padding:2.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="realty-006"] *{transition:none!important}}`

/** Ипотечный калькулятор: ползунки и платёж, который набегает к новому значению. */
export function Realty006({
  eyebrow = "Ипотека",
  title = "Сколько это в месяц",
  lede = "Считаем по аннуитетной формуле, как считают банки. Точную ставку подберём под вашу программу: семейная, IT, господдержка.",
  price = 15_000_000,
  downPercent = 20,
  years = 20,
  rate = 16.5,
  priceRange = [3_000_000, 80_000_000],
  yearsRange = [5, 30],
  rateRange = [4, 24],
  actionLabel = "Подобрать программу",
  actionHref = "#valuation",
  note = "Расчёт предварительный и не является офертой банка.",
  costLabel = "Стоимость",
  downLabel = "Первый взнос",
  termLabel = "Срок",
  yearsUnit = "лет",
  rateLabel = "Ставка",
  monthlyLabel = "Платёж в месяц",
  loanLabel = "Сумма кредита",
  overpayLabel = "Переплата за {n} лет",
  currency = "₽",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Realty006Props) {
  const id = useId()
  const [cost, setCost] = useState(price)
  const [down, setDown] = useState(downPercent)
  const [term, setTerm] = useState(years)
  const [percent, setPercent] = useState(rate)
  const principal = cost * (1 - down / 100)
  const payment = annuity(principal, percent, term)
  const total = payment * term * 12
  const rolling = useRolling(payment)
  const progress = (value: number, [min, max]: readonly [number, number]) => `${((value - min) / (max - min)) * 100}%`
  const palette = {
    ...(accent ? { "--vibeui-realty-006-accent": accent } : null),
    ...(ink ? { "--vibeui-realty-006-fg": ink } : null),
    ...(background ? { "--vibeui-realty-006-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-realty-006" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="realty-006" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="panel">
            <div data-part="field">
              <label htmlFor={`${id}-price`}>
                {costLabel} <output>{money(cost, currency)}</output>
              </label>
              <input id={`${id}-price`} type="range" min={priceRange[0]} max={priceRange[1]} step={100_000} value={cost} onChange={(event) => setCost(Number(event.target.value))} style={{ ["--vibeui-realty-006-p" as string]: progress(cost, priceRange) }} />
            </div>
            <div data-part="field">
              <label htmlFor={`${id}-down`}>
                {downLabel} <output>{down} % · {money(cost * (down / 100), currency)}</output>
              </label>
              <input id={`${id}-down`} type="range" min={10} max={80} step={5} value={down} onChange={(event) => setDown(Number(event.target.value))} style={{ ["--vibeui-realty-006-p" as string]: progress(down, [10, 80]) }} />
            </div>
            <div data-part="field">
              <label htmlFor={`${id}-term`}>
                {termLabel} <output>{term} {yearsUnit}</output>
              </label>
              <input id={`${id}-term`} type="range" min={yearsRange[0]} max={yearsRange[1]} step={1} value={term} onChange={(event) => setTerm(Number(event.target.value))} style={{ ["--vibeui-realty-006-p" as string]: progress(term, yearsRange) }} />
            </div>
            <div data-part="field">
              <label htmlFor={`${id}-rate`}>
                {rateLabel} <output>{percent.toFixed(1)} %</output>
              </label>
              <input id={`${id}-rate`} type="range" min={rateRange[0]} max={rateRange[1]} step={0.1} value={percent} onChange={(event) => setPercent(Number(event.target.value))} style={{ ["--vibeui-realty-006-p" as string]: progress(percent, rateRange) }} />
            </div>
          </div>
          <div data-part="result" aria-live="polite">
            <div>
              <small>{monthlyLabel}</small>
              <div data-part="payment">{money(rolling, currency)}</div>
            </div>
            <div data-part="row">
              <span>{loanLabel}</span>
              <b>{money(principal, currency)}</b>
            </div>
            <div data-part="row">
              <span>{overpayLabel.replace("{n}", String(term))}</span>
              <b>{money(total - principal, currency)}</b>
            </div>
            {actionLabel ? (
              <a href={actionHref} data-part="action">
                {actionLabel}
              </a>
            ) : null}
            {note ? <p data-part="note">{note}</p> : null}
          </div>
        </div>
      </section>
    </>
  )
}
