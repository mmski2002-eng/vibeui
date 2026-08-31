"use client"

import { useId, useState } from "react"
import type { CSSProperties } from "react"

export type Pricing016Promo = {
  code: string
  percent: number
  caption: string
}

export type Pricing016Props = {
  eyebrow?: string
  title?: string
  planName?: string
  planCaption?: string
  price?: number
  currency?: string
  period?: string
  placeholder?: string
  applyLabel?: string
  promos?: Pricing016Promo[]
  hint?: string
  action?: { label: string; href: string }
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: поле промокода, которое отвечает сразу. Клиентский компонент:
// без состояния поле не проверяет код. Результат проверки объявляется через
// role="status", а не только подкрашивается зелёным и красным — цвет один не
// доходит до скринридера и до дальтоника. Ошибочный код не стирается: его
// оставляют, чтобы человек увидел опечатку. Старая цена набрана в <s> и
// озвучивается как удалённая, новая стоит рядом обычным текстом.
const STYLES = `
:where([data-vibeui-block="pricing-016"]){
--vibeui-pricing-016-bg:oklch(0.98 0.004 300);
--vibeui-pricing-016-fg:oklch(0.2 0.014 300);
--vibeui-pricing-016-muted:oklch(0.51 0.014 300);
--vibeui-pricing-016-card:oklch(1 0 0);
--vibeui-pricing-016-line:oklch(0.89 0.008 300);
--vibeui-pricing-016-accent:oklch(0.5 0.18 305);
--vibeui-pricing-016-accent-fg:oklch(0.99 0 0);
--vibeui-pricing-016-ok:oklch(0.5 0.13 150);
--vibeui-pricing-016-bad:oklch(0.53 0.16 25);
--vibeui-pricing-016-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-pricing-016-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
container-type:inline-size;
}
[data-vibeui-block="pricing-016"]{
box-sizing:border-box;background:var(--vibeui-pricing-016-bg);color:var(--vibeui-pricing-016-fg);
font-family:var(--vibeui-pricing-016-sans);
}
[data-vibeui-block="pricing-016"] *{box-sizing:border-box}
[data-vibeui-block="pricing-016"] [data-part="shell"]{max-width:38rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="pricing-016"] [data-part="eyebrow"]{
margin:0 0 0.75rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-pricing-016-accent);
}
[data-vibeui-block="pricing-016"] h2{
margin:0 0 1.5rem;font-size:clamp(1.375rem,3.8cqi,2rem);line-height:1.16;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="pricing-016"] [data-part="card"]{
padding:1.75rem;border-radius:1.125rem;border:1px solid var(--vibeui-pricing-016-line);background:var(--vibeui-pricing-016-card);
}
[data-vibeui-block="pricing-016"] h3{margin:0;font-size:1rem;font-weight:700}
[data-vibeui-block="pricing-016"] [data-part="caption"]{margin:0.375rem 0 0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-pricing-016-muted)}
[data-vibeui-block="pricing-016"] [data-part="prices"]{
display:flex;align-items:baseline;flex-wrap:wrap;gap:0.5rem;margin:1.25rem 0 0;
}
[data-vibeui-block="pricing-016"] [data-part="now"]{
font-size:2.25rem;font-weight:700;letter-spacing:-0.045em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pricing-016"] s{font-size:1.125rem;color:var(--vibeui-pricing-016-muted)}
[data-vibeui-block="pricing-016"] [data-part="period"]{font-size:0.8125rem;color:var(--vibeui-pricing-016-muted)}
[data-vibeui-block="pricing-016"] form{margin:1.5rem 0 0}
[data-vibeui-block="pricing-016"] label{display:block;margin-bottom:0.375rem;font-size:0.8125rem;font-weight:600}
[data-vibeui-block="pricing-016"] [data-part="row"]{display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="pricing-016"] input{
flex:1 1 auto;min-width:0;height:2.625rem;padding:0 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-pricing-016-line);background:var(--vibeui-pricing-016-card);
font-family:var(--vibeui-pricing-016-mono);font-size:0.875rem;letter-spacing:0.08em;text-transform:uppercase;color:inherit;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="pricing-016"] input:focus-visible{
outline:none;border-color:var(--vibeui-pricing-016-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-pricing-016-accent) 20%,transparent);
}
[data-vibeui-block="pricing-016"] button{
appearance:none;cursor:pointer;flex:0 0 auto;height:2.625rem;padding:0 1.125rem;border:0;border-radius:0.625rem;
background:var(--vibeui-pricing-016-fg);color:var(--vibeui-pricing-016-card);
font:inherit;font-size:0.875rem;font-weight:650;transition:opacity .16s ease;
}
[data-vibeui-block="pricing-016"] button:hover{opacity:.88}
[data-vibeui-block="pricing-016"] button:focus-visible{outline:2px solid var(--vibeui-pricing-016-accent);outline-offset:2px}
[data-vibeui-block="pricing-016"] [data-part="status"]{
display:flex;align-items:center;gap:0.4375rem;margin:0.75rem 0 0;min-height:1.25rem;
font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="pricing-016"] [data-state="ok"]{color:var(--vibeui-pricing-016-ok)}
[data-vibeui-block="pricing-016"] [data-state="bad"]{color:var(--vibeui-pricing-016-bad)}
[data-vibeui-block="pricing-016"] [data-part="hint"]{margin:0.75rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-pricing-016-muted)}
[data-vibeui-block="pricing-016"] a{
display:flex;align-items:center;justify-content:center;margin-top:1.5rem;height:2.75rem;border-radius:0.625rem;
background:var(--vibeui-pricing-016-accent);color:var(--vibeui-pricing-016-accent-fg);
font-size:0.9375rem;font-weight:650;text-decoration:none;transition:background-color .16s ease;
}
[data-vibeui-block="pricing-016"] a:hover{background:color-mix(in oklab,var(--vibeui-pricing-016-accent) 86%,black)}
[data-vibeui-block="pricing-016"] a:focus-visible{outline:2px solid var(--vibeui-pricing-016-accent);outline-offset:3px}
@container (min-width: 30rem){
[data-vibeui-block="pricing-016"] [data-part="row"]{flex-direction:row;align-items:center}
[data-vibeui-block="pricing-016"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="pricing-016"] [data-part="card"]{padding:2.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PROMOS: Pricing016Promo[] = [
  { code: "VIBE20", percent: 20, caption: "Скидка 20 % на первый год" },
  { code: "FRIEND10", percent: 10, caption: "Скидка 10 % по приглашению" },
]

const MONEY = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 })

/** Блок скидки по промокоду: проверка кода на месте, результат объявляется через role="status". */
export function Pricing016({
  eyebrow = "Промокод",
  title = "Есть код — примените его до оплаты",
  planName = "Тариф «Команда», год",
  planCaption = "До пяти участников, все секции каталога, поддержка за рабочий день.",
  price = 14880,
  currency = "₽",
  period = "в год",
  placeholder = "VIBE20",
  applyLabel = "Применить",
  promos = DEFAULT_PROMOS,
  hint = "Промокод действует на первую оплату и не суммируется с другими скидками.",
  action = { label: "Перейти к оплате", href: "#" },
  accent,
  className,
  style,
}: Pricing016Props) {
  const id = useId()
  const [code, setCode] = useState("")
  const [applied, setApplied] = useState<Pricing016Promo | null>(null)
  const [error, setError] = useState("")

  const palette = {
    ...(accent ? { "--vibeui-pricing-016-accent": accent } : null),
    ...style,
  } as CSSProperties

  const discounted = applied
    ? Math.round(price * (1 - applied.percent / 100))
    : price

  function apply() {
    const normalized = code.trim().toUpperCase()
    const found = promos.find((promo) => promo.code === normalized)

    if (found) {
      setApplied(found)
      setError("")
      return
    }

    setApplied(null)
    setError(
      normalized
        ? `Код «${normalized}» не найден или уже использован`
        : "Введите промокод",
    )
  }

  return (
    <>
      <style href="vibeui-pricing-016" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="pricing-016"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>

          <div data-part="card">
            <h3>{planName}</h3>
            <p data-part="caption">{planCaption}</p>

            <p data-part="prices">
              <span data-part="now">
                {MONEY.format(discounted)} {currency}
              </span>
              {applied ? (
                <s>
                  {MONEY.format(price)} {currency}
                </s>
              ) : null}
              <span data-part="period">{period}</span>
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                apply()
              }}
            >
              <label htmlFor={`${id}-code`}>Промокод</label>
              <div data-part="row">
                <input
                  id={`${id}-code`}
                  name="promo"
                  type="text"
                  autoComplete="off"
                  placeholder={placeholder}
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                />
                <button type="submit">{applyLabel}</button>
              </div>
            </form>

            <p
              data-part="status"
              data-state={applied ? "ok" : error ? "bad" : undefined}
              role="status"
            >
              {applied ? `${applied.caption} применена` : error}
            </p>

            {hint ? <p data-part="hint">{hint}</p> : null}

            <a href={action.href}>{action.label}</a>
          </div>
        </div>
      </section>
    </>
  )
}
