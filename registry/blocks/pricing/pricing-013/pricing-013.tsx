"use client"

import { useId, useState } from "react"
import type { CSSProperties } from "react"

export type Pricing013Props = {
  eyebrow?: string
  title?: string
  lede?: string
  perSeat?: number
  currency?: string
  includedSeats?: number
  minSeats?: number
  maxSeats?: number
  defaultSeats?: number
  features?: string[]
  action?: { label: string; href: string }
  note?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: цена за место со счётчиком. Клиентский компонент: без состояния
// счётчик мест бессмысленен. Число мест — не текстовое поле со стрелками, а
// пара кнопок и <output>: так значение нельзя испортить вставкой из буфера,
// а <output> с aria-live объявляет пересчёт голосом. Кнопки блокируются на
// границах диапазона, а не молча игнорируют нажатие: заблокированная кнопка
// объясняет, что предел достигнут.
const STYLES = `
:where([data-vibeui-block="pricing-013"]){
--vibeui-pricing-013-bg:oklch(0.97 0.004 270);
--vibeui-pricing-013-fg:oklch(0.2 0.014 270);
--vibeui-pricing-013-muted:oklch(0.51 0.014 270);
--vibeui-pricing-013-card:oklch(1 0 0);
--vibeui-pricing-013-line:oklch(0.89 0.008 270);
--vibeui-pricing-013-accent:oklch(0.5 0.18 285);
--vibeui-pricing-013-accent-fg:oklch(0.99 0 0);
--vibeui-pricing-013-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="pricing-013"]{
box-sizing:border-box;background:var(--vibeui-pricing-013-bg);color:var(--vibeui-pricing-013-fg);
font-family:var(--vibeui-pricing-013-sans);
}
[data-vibeui-block="pricing-013"] *{box-sizing:border-box}
[data-vibeui-block="pricing-013"] [data-part="shell"]{max-width:56rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="pricing-013"] [data-part="eyebrow"]{
margin:0 0 0.75rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-pricing-013-accent);
}
[data-vibeui-block="pricing-013"] h2{
margin:0;max-width:22ch;font-size:clamp(1.5rem,4.2cqi,2.25rem);line-height:1.14;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="pricing-013"] [data-part="lede"]{margin:0.875rem 0 1.75rem;max-width:34rem;font-size:0.9375rem;line-height:1.6;color:var(--vibeui-pricing-013-muted);text-wrap:pretty}
[data-vibeui-block="pricing-013"] [data-part="card"]{
display:grid;grid-template-columns:1fr;gap:1.75rem;padding:1.75rem;border-radius:1.25rem;
border:1px solid var(--vibeui-pricing-013-line);background:var(--vibeui-pricing-013-card);
}
[data-vibeui-block="pricing-013"] [data-part="seatlabel"]{margin:0 0 0.75rem;font-size:0.8125rem;font-weight:650;color:var(--vibeui-pricing-013-muted)}
[data-vibeui-block="pricing-013"] [data-part="stepper"]{
display:inline-flex;align-items:center;gap:0.25rem;padding:0.25rem;border-radius:0.875rem;
border:1px solid var(--vibeui-pricing-013-line);
}
[data-vibeui-block="pricing-013"] button{
appearance:none;cursor:pointer;width:2.5rem;height:2.5rem;border-radius:0.625rem;border:0;
background:color-mix(in oklab,var(--vibeui-pricing-013-accent) 10%,transparent);color:var(--vibeui-pricing-013-accent);
font:inherit;font-size:1.25rem;line-height:1;transition:background-color .16s ease;
}
[data-vibeui-block="pricing-013"] button:hover:not(:disabled){background:color-mix(in oklab,var(--vibeui-pricing-013-accent) 20%,transparent)}
[data-vibeui-block="pricing-013"] button:disabled{cursor:not-allowed;opacity:.4}
[data-vibeui-block="pricing-013"] button:focus-visible{outline:2px solid var(--vibeui-pricing-013-accent);outline-offset:2px}
[data-vibeui-block="pricing-013"] output{
min-width:3.5rem;text-align:center;font-size:1.25rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pricing-013"] [data-part="seathint"]{margin:0.75rem 0 0;font-size:0.75rem;color:var(--vibeui-pricing-013-muted)}
[data-vibeui-block="pricing-013"] ul{list-style:none;margin:1.5rem 0 0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="pricing-013"] li{display:flex;align-items:flex-start;gap:0.5rem;font-size:0.875rem;line-height:1.5}
[data-vibeui-block="pricing-013"] [data-part="tick"]{flex:0 0 auto;margin-top:0.25rem;color:var(--vibeui-pricing-013-accent)}
[data-vibeui-block="pricing-013"] [data-part="bill"]{
display:flex;flex-direction:column;justify-content:center;padding:1.5rem;border-radius:1rem;
background:color-mix(in oklab,var(--vibeui-pricing-013-accent) 8%,transparent);
}
[data-vibeui-block="pricing-013"] [data-part="row"]{
display:flex;justify-content:space-between;gap:1rem;padding:0.375rem 0;
font-size:0.8125rem;color:var(--vibeui-pricing-013-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pricing-013"] [data-part="total"]{
display:flex;align-items:baseline;justify-content:space-between;gap:1rem;margin-top:0.75rem;padding-top:0.875rem;
border-top:1px solid color-mix(in oklab,var(--vibeui-pricing-013-accent) 25%,transparent);
}
[data-vibeui-block="pricing-013"] [data-part="sum"]{
font-size:2rem;font-weight:700;letter-spacing:-0.04em;color:var(--vibeui-pricing-013-accent);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pricing-013"] a{
display:inline-flex;align-items:center;justify-content:center;margin-top:1.25rem;height:2.75rem;border-radius:0.625rem;
background:var(--vibeui-pricing-013-accent);color:var(--vibeui-pricing-013-accent-fg);
font-size:0.9375rem;font-weight:650;text-decoration:none;transition:background-color .16s ease;
}
[data-vibeui-block="pricing-013"] a:hover{background:color-mix(in oklab,var(--vibeui-pricing-013-accent) 86%,black)}
[data-vibeui-block="pricing-013"] a:focus-visible{outline:2px solid var(--vibeui-pricing-013-accent);outline-offset:3px}
[data-vibeui-block="pricing-013"] [data-part="note"]{margin:1rem 0 0;font-size:0.75rem;color:var(--vibeui-pricing-013-muted)}
@container (min-width: 34rem){
[data-vibeui-block="pricing-013"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="pricing-013"] [data-part="card"]{padding:2.25rem}
}
@container (min-width: 52rem){
[data-vibeui-block="pricing-013"] [data-part="card"]{grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:2.5rem}
[data-vibeui-block="pricing-013"] [data-part="shell"]{padding:6rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FEATURES = [
  "Общая библиотека пресетов палитры",
  "Роли и права на проект",
  "История установок по каждому участнику",
  "Единый счёт на всю команду",
]

const MONEY = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 })

/** Тариф для команд с ценой за место: счётчик мест и живой пересчёт счёта. */
export function Pricing013({
  eyebrow = "Для команды",
  title = "Платите за тех, кто действительно работает",
  lede = "Первые места входят в тариф, остальные считаются поштучно. Убрать участника можно в любой момент — счёт пересчитается со следующего месяца.",
  perSeat = 390,
  currency = "₽",
  includedSeats = 3,
  minSeats = 1,
  maxSeats = 50,
  defaultSeats = 8,
  features = DEFAULT_FEATURES,
  action = { label: "Подключить команду", href: "#" },
  note = "Оплата помесячно. При годовой подписке место стоит на 17 % дешевле.",
  accent,
  className,
  style,
}: Pricing013Props) {
  const id = useId()
  const [seats, setSeats] = useState(defaultSeats)

  const palette = {
    ...(accent ? { "--vibeui-pricing-013-accent": accent } : null),
    ...style,
  } as CSSProperties

  const paidSeats = Math.max(0, seats - includedSeats)
  const total = paidSeats * perSeat

  return (
    <>
      <style href="vibeui-pricing-013" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="pricing-013"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}

          <div data-part="card">
            <div>
              <p data-part="seatlabel" id={`${id}-label`}>
                Участников в команде
              </p>
              <div data-part="stepper">
                <button
                  type="button"
                  onClick={() =>
                    setSeats((value) => Math.max(minSeats, value - 1))
                  }
                  disabled={seats <= minSeats}
                  aria-label="Убрать участника"
                >
                  −
                </button>
                <output htmlFor={`${id}-label`} aria-live="polite">
                  {seats}
                </output>
                <button
                  type="button"
                  onClick={() =>
                    setSeats((value) => Math.min(maxSeats, value + 1))
                  }
                  disabled={seats >= maxSeats}
                  aria-label="Добавить участника"
                >
                  +
                </button>
              </div>
              <p data-part="seathint">
                Первые {includedSeats} мест входят в тариф. Максимум —{" "}
                {maxSeats}.
              </p>

              <ul>
                {features.slice(0, 5).map((feature) => (
                  <li key={feature}>
                    <span data-part="tick" aria-hidden="true">
                      <svg viewBox="0 0 16 16" width="12" height="12">
                        <path
                          d="M3.5 8.5 6.5 11.5 12.5 4.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div data-part="bill">
              <p data-part="row">
                <span>Входит в тариф</span>
                <span>{includedSeats} мест</span>
              </p>
              <p data-part="row">
                <span>Дополнительно</span>
                <span>
                  {paidSeats} × {MONEY.format(perSeat)} {currency}
                </span>
              </p>
              <p data-part="total">
                <span>В месяц</span>
                <span data-part="sum">
                  {MONEY.format(total)} {currency}
                </span>
              </p>
              <a href={action.href}>{action.label}</a>
            </div>
          </div>

          {note ? <p data-part="note">{note}</p> : null}
        </div>
      </section>
    </>
  )
}
