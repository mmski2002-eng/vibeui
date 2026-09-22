"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Card098 } from "@/registry/components/card/card-098/card-098"


export type Fintech002Bank = {
  name: string
  /** Обслуживание в месяц. */
  fixed: number
  /** Комиссия за переводы, % от оборота. */
  percent: number
  /** Наш тариф: с ним сравниваются остальные. */
  ours?: boolean
}

export type Fintech002Props = {
  eyebrow?: string
  title?: string
  lede?: string
  banks?: readonly Fintech002Bank[]
  /** Диапазон оборота в месяц. */
  minTurnover?: number
  maxTurnover?: number
  step?: number
  defaultTurnover?: number
  currency?: string
  turnoverLabel?: string
  savingLabel?: string
  /** Подпись под цифрой: «в год против самого дешёвого…». */
  savingNote?: string
  perMonthLabel?: string
  perYearLabel?: string
  /** Сокращения тысяч и миллионов на шкале: [«тыс.», «млн»]. */
  units?: readonly [string, string]
  note?: string
  /** aria быстрых значений. */
  presetsLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Калькулятор экономии: один ползунок оборота в месяц, справа крупная
// цифра «сэкономите N ₽ в год», которая докручивается до нового значения
// через requestAnimationFrame, и три полосы — наш тариф и два условных
// банка, полосы масштабируются через transform:scaleX, а не width.
// Модель простая и честная: обслуживание × 12 + процент с оборота × 12,
// экономия считается от самого дешёвого из конкурентов.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;700;800&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="fintech-002"]){
--vibeui-fintech-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-fintech-002-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-fintech-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-fintech-002-on-accent:oklch(from var(--vibeui-fintech-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-fintech-002-mint:color-mix(in oklab,var(--vibeui-fintech-002-accent) 45%,#99f6e4);
--vibeui-fintech-002-muted:color-mix(in oklab,var(--vibeui-fintech-002-fg) 62%,var(--vibeui-fintech-002-bg));
--vibeui-fintech-002-line:color-mix(in oklab,var(--vibeui-fintech-002-fg) 11%,transparent);
--vibeui-fintech-002-glass:color-mix(in oklab,var(--vibeui-fintech-002-fg) 5%,transparent);
--vibeui-fintech-002-aurora:linear-gradient(90deg,var(--vibeui-fintech-002-accent),var(--vibeui-fintech-002-mint));
--vibeui-fintech-002-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-fintech-002-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-fintech-002-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="fintech-002"]{color-scheme:dark}
:where([data-vibeui-block="fintech-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="fintech-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="fintech-002"]{box-sizing:border-box;position:relative;overflow:hidden;padding:5rem 0;background:var(--vibeui-fintech-002-bg);color:var(--vibeui-fintech-002-fg);font-family:var(--vibeui-fintech-002-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="fintech-002"] *{box-sizing:border-box}
[data-vibeui-block="fintech-002"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="fintech-002"] [data-part="head"]{max-width:40rem;margin:0 auto 2.5rem;text-align:center}
[data-vibeui-block="fintech-002"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-fintech-002-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-fintech-002-accent)}
[data-vibeui-block="fintech-002"] [data-part="title"]{margin:0;font-family:var(--vibeui-fintech-002-display);font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.02;letter-spacing:-.04em;text-wrap:balance}
[data-vibeui-block="fintech-002"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-fintech-002-muted)}
[data-vibeui-block="fintech-002"] [data-part="panel"]{position:relative;isolation:isolate;display:grid;gap:2rem;padding:1.6rem;border-radius:1.8rem;background:color-mix(in oklab,var(--vibeui-fintech-002-bg) 55%,transparent);border:1px solid color-mix(in oklab,var(--vibeui-fintech-002-fg) 16%,transparent);backdrop-filter:blur(20px);box-shadow:0 1px 0 rgb(255 255 255 / .12) inset,0 40px 80px -40px rgb(0 0 0 / .7)}
[data-vibeui-block="fintech-002"] [data-part="panel"]::before{content:"";position:absolute;z-index:-1;inset:auto -10% -40% 30%;height:70%;background:radial-gradient(closest-side,var(--vibeui-fintech-002-accent),transparent);opacity:.22;filter:blur(60px);pointer-events:none}
[data-vibeui-block="fintech-002"] [data-part="range"]{-webkit-appearance:none;appearance:none;width:100%;height:.5rem;margin:1rem 0 .5rem;border-radius:999px;background:linear-gradient(90deg,var(--vibeui-fintech-002-accent) var(--vibeui-fintech-002-fill),var(--vibeui-fintech-002-line) var(--vibeui-fintech-002-fill));outline:none;cursor:pointer}
[data-vibeui-block="fintech-002"] [data-part="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:1.5rem;height:1.5rem;border-radius:50%;background:var(--vibeui-fintech-002-bg);border:3px solid var(--vibeui-fintech-002-accent);box-shadow:0 0 0 6px color-mix(in oklab,var(--vibeui-fintech-002-accent) 20%,transparent);cursor:grab}
[data-vibeui-block="fintech-002"] [data-part="range"]::-moz-range-thumb{width:1.5rem;height:1.5rem;border-radius:50%;background:var(--vibeui-fintech-002-bg);border:3px solid var(--vibeui-fintech-002-accent);box-shadow:0 0 0 6px color-mix(in oklab,var(--vibeui-fintech-002-accent) 20%,transparent);cursor:grab}
[data-vibeui-block="fintech-002"] [data-part="range"]:focus-visible{box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-fintech-002-accent) 40%,transparent)}
[data-vibeui-block="fintech-002"] [data-part="ticks"]{display:flex;justify-content:space-between;margin:0;padding:0;list-style:none;font-family:var(--vibeui-fintech-002-mono);font-size:.68rem;color:var(--vibeui-fintech-002-muted)}
[data-vibeui-block="fintech-002"] [data-part="presets"]{display:flex;flex-wrap:wrap;gap:.4rem;margin:1.2rem 0 0}
[data-vibeui-block="fintech-002"] [data-part="presets"] button{padding:.4rem .8rem;border-radius:999px;border:1px solid var(--vibeui-fintech-002-line);background:transparent;color:var(--vibeui-fintech-002-muted);font:inherit;font-size:.8rem;cursor:pointer;transition:background .2s,color .2s,border-color .2s}
[data-vibeui-block="fintech-002"] [data-part="presets"] button:hover,[data-vibeui-block="fintech-002"] [data-part="presets"] button[aria-pressed="true"]{border-color:var(--vibeui-fintech-002-accent);color:var(--vibeui-fintech-002-fg)}
[data-vibeui-block="fintech-002"] [data-part="presets"] button:focus-visible{outline:2px solid var(--vibeui-fintech-002-accent);outline-offset:2px}
[data-vibeui-block="fintech-002"] [data-part="result"]{display:grid;gap:1.4rem;align-content:start}
[data-vibeui-block="fintech-002"] [data-part="saving"]{margin:0;font-size:.9rem;color:var(--vibeui-fintech-002-muted)}
[data-vibeui-block="fintech-002"] [data-part="saving"] strong{display:block;margin:.2rem 0 0;font-family:var(--vibeui-fintech-002-mono);font-weight:600;font-size:clamp(2.2rem,6cqi,3.6rem);line-height:1;letter-spacing:-.04em;font-variant-numeric:tabular-nums;background:var(--vibeui-fintech-002-aurora);-webkit-background-clip:text;background-clip:text;color:transparent}
[data-vibeui-block="fintech-002"] [data-part="saving"] small{display:block;margin:.4rem 0 0;font-size:.82rem}
[data-vibeui-block="fintech-002"] [data-part="bars"]{display:grid;gap:.9rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="fintech-002"] [data-part="note"]{margin:0;font-size:.76rem;color:var(--vibeui-fintech-002-muted)}
@container (min-width: 56rem){[data-vibeui-block="fintech-002"] [data-part="panel"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:3rem;padding:2.4rem}[data-vibeui-block="fintech-002"] [data-part="result"]{padding-left:3rem;border-left:1px solid var(--vibeui-fintech-002-line)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="fintech-002"] *{animation:none!important;transition:none!important}}`

const DEFAULT_BANKS: Fintech002Bank[] = [
  { name: "Ось · Рост", fixed: 490, percent: 0.1, ours: true },
  { name: "Условный банк А", fixed: 1990, percent: 0.5 },
  { name: "Условный банк Б", fixed: 2490, percent: 0.35 },
]

function formatMoney(value: number, currency: string) {
  const digits = String(Math.round(Math.abs(value))).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return `${value < 0 ? "−" : ""}${digits} ${currency}`
}

function formatShort(value: number, units: readonly [string, string]) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1).replace(".", ",")} ${units[1]}`
  if (value >= 1000) return `${Math.round(value / 1000)} ${units[0]}`
  return String(value)
}

function yearlyFee(bank: Fintech002Bank, turnover: number) {
  return bank.fixed * 12 + (turnover * bank.percent) / 100 * 12
}

/** Калькулятор экономии на комиссиях с ползунком оборота. */
export function Fintech002({
  eyebrow = "Калькулятор",
  title = "Сколько вы переплачиваете за переводы",
  lede = "Подвиньте ползунок под ваш оборот — посчитаем комиссии за год у нас и у двух условных банков с типовыми тарифами для малого бизнеса.",
  banks = DEFAULT_BANKS,
  minTurnover = 100000,
  maxTurnover = 20000000,
  step = 50000,
  defaultTurnover = 2500000,
  currency = "₽",
  turnoverLabel = "Оборот в месяц",
  savingLabel = "На комиссиях сэкономите",
  savingNote = "в год против самого дешёвого из сравниваемых банков",
  perMonthLabel = "в месяц",
  perYearLabel = "/ год",
  units = ["тыс.", "млн"],
  note = "Расчёт условный: обслуживание и комиссия за переводы юрлицам, без эквайринга и валютного контроля. Точные тарифы — в разделе ниже.",
  presetsLabel = "Типовые обороты",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Fintech002Props) {
  const [turnover, setTurnover] = useState(defaultTurnover)
  const [shown, setShown] = useState(0)
  const shownRef = useRef(0)

  const ours = banks.find((bank) => bank.ours) ?? banks[0]
  const others = banks.filter((bank) => bank !== ours)
  const ourFee = ours ? yearlyFee(ours, turnover) : 0
  const cheapest = others.length ? Math.min(...others.map((bank) => yearlyFee(bank, turnover))) : ourFee
  const saving = Math.max(0, cheapest - ourFee)
  const maxFee = Math.max(ourFee, ...others.map((bank) => yearlyFee(bank, turnover)), 1)

  useEffect(() => {
    const from = shownRef.current
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 650)
      const k = 1 - Math.pow(1 - t, 3)
      shownRef.current = from + (saving - from) * k
      setShown(shownRef.current)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [saving])

  const fill = `${((turnover - minTurnover) / Math.max(1, maxTurnover - minTurnover)) * 100}%`
  const presets = [500000, 2500000, 10000000].filter((value) => value >= minTurnover && value <= maxTurnover)

  const palette = {
    ...(accent ? { "--vibeui-fintech-002-accent": accent } : null),
    ...(ink ? { "--vibeui-fintech-002-fg": ink } : null),
    ...(background ? { "--vibeui-fintech-002-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-fintech-002" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="fintech-002" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="panel">
            <div data-part="input">
              <label data-part="label">
                <span>{turnoverLabel}</span>
                <output>{formatMoney(turnover, currency)}</output>
              </label>
              <input data-part="range" type="range" min={minTurnover} max={maxTurnover} step={step} value={turnover} onChange={(event) => setTurnover(Number(event.target.value))} aria-label={turnoverLabel} style={{ ["--vibeui-fintech-002-fill" as string]: fill }} />
              <ul data-part="ticks" aria-hidden="true">
                <li>{formatShort(minTurnover, units)}</li>
                <li>{formatShort((minTurnover + maxTurnover) / 2, units)}</li>
                <li>{formatShort(maxTurnover, units)}</li>
              </ul>
              {presets.length > 0 ? (
                <div data-part="presets" role="group" aria-label={presetsLabel}>
                  {presets.map((value) => (
                    <button key={value} type="button" aria-pressed={turnover === value} onClick={() => setTurnover(value)}>
                      {formatShort(value, units)} {currency}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <div data-part="result" aria-live="polite">
              <p data-part="saving">
                {savingLabel}
                <strong>{formatMoney(shown, currency)}</strong>
                <small>{savingNote} · {formatMoney(saving / 12, currency)} {perMonthLabel}</small>
              </p>
              <ul data-part="bars">
                {banks.map((bank) => {
                  const fee = yearlyFee(bank, turnover)
                  return (
                    <Card098 key={bank.name} data-part="bar" name={bank.name} ours={bank.ours} currency={currency} perYearLabel={perYearLabel} fee={fee} maxFee={maxFee} accent={accent} />
                  )
                })}
              </ul>
              {note ? <p data-part="note">{note}</p> : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
