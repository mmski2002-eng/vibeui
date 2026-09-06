"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Commerce063Card = {
  id: string
  bank: string
  tail: string
  system: string
  hue?: number
}

export type Commerce063Props = {
  title?: string
  lead?: string
  total?: number
  currency?: string
  cards?: Commerce063Card[]
  totalLabel?: string
  firstLabel?: string
  restLabel?: string
  stepLabel?: string
  halfLabel?: string
  allLabel?: string
  cta?: string
  errorText?: string
  note?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: оплата, разделённая между двумя картами. Сумма второй карты
// не вводится, а считается как остаток: два свободных поля позволяют
// оплатить меньше заказа и увидеть это уже в банке. Ползунок и поле ввода
// связаны одним состоянием — пальцем удобнее тянуть, клавиатурой удобнее
// набрать точную сумму, и оба способа обязаны быть.
const STYLES = `
:where([data-vibeui-block="commerce-063"]){
--vibeui-commerce-063-bg:transparent;
--vibeui-commerce-063-surface:light-dark(oklch(1 0 0),oklch(0.22 0 275));
--vibeui-commerce-063-fg:light-dark(oklch(0.21 0 275),oklch(0.94 0 275));
--vibeui-commerce-063-muted:light-dark(oklch(0.53 0 275),oklch(0.73 0 275));
--vibeui-commerce-063-border:light-dark(oklch(0.9 0 275),oklch(0.38 0 275));
--vibeui-commerce-063-soft:light-dark(oklch(0.972 0 275),oklch(0.28 0 275));
--vibeui-commerce-063-accent:light-dark(oklch(0.5 0.17 285),oklch(0.75 0.15 285));
--vibeui-commerce-063-onaccent:light-dark(oklch(0.99 0 0),oklch(0.19 0.05 285));
--vibeui-commerce-063-warn:light-dark(oklch(0.55 0.16 25),oklch(0.75 0.15 25));
--vibeui-commerce-063-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-063"]{color-scheme:dark}
[data-vibeui-block="commerce-063"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-063-bg);
color:var(--vibeui-commerce-063-fg);font-family:var(--vibeui-commerce-063-sans);
}
[data-vibeui-block="commerce-063"] *{box-sizing:border-box}
[data-vibeui-block="commerce-063"] [data-part="shell"]{max-width:44rem;margin:0 auto;padding:1.25rem 1rem 2rem}
[data-vibeui-block="commerce-063"] h2{margin:0 0 0.375rem;font-size:1.375rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-063"] [data-part="lead"]{margin:0 0 1rem;max-width:52ch;font-size:0.875rem;line-height:1.55;color:var(--vibeui-commerce-063-muted)}
[data-vibeui-block="commerce-063"] [data-part="total"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;margin:0 0 1.25rem;
padding:0.75rem 0.875rem;border-radius:0.875rem;background:var(--vibeui-commerce-063-soft);
}
[data-vibeui-block="commerce-063"] [data-part="total"] span:first-child{font-size:0.875rem;font-weight:650}
[data-vibeui-block="commerce-063"] [data-part="sum"]{font-size:1.5rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-063"] [data-part="cards"]{list-style:none;margin:0;padding:0;display:grid;gap:0.75rem}
[data-vibeui-block="commerce-063"] [data-part="card"]{border:1px solid var(--vibeui-commerce-063-border);border-radius:1rem;padding:0.875rem 1rem}
[data-vibeui-block="commerce-063"] [data-part="head"]{display:flex;gap:0.75rem;align-items:center}
[data-vibeui-block="commerce-063"] [data-part="chip"]{
flex:none;width:2.5rem;height:1.75rem;border-radius:0.375rem;
background:linear-gradient(140deg,oklch(0.9 0.07 var(--vibeui-commerce-063-hue,285)),oklch(0.72 0.13 var(--vibeui-commerce-063-hue,285)));
}
[data-vibeui-block="commerce-063"] [data-part="bank"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="commerce-063"] [data-part="tail"]{margin:0.0625rem 0 0;font-size:0.75rem;color:var(--vibeui-commerce-063-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-063"] [data-part="amount"]{margin-left:auto;font-size:1.125rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-063"] [data-part="controls"]{margin-top:0.75rem}
[data-vibeui-block="commerce-063"] [data-part="clabel"]{display:block;margin-bottom:0.375rem;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="commerce-063"] input[type="range"]{width:100%;accent-color:var(--vibeui-commerce-063-accent);height:1.5rem}
[data-vibeui-block="commerce-063"] [data-part="entry"]{display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;margin-top:0.375rem}
[data-vibeui-block="commerce-063"] input[type="number"]{
width:8rem;height:2.5rem;padding:0 0.75rem;border-radius:0.625rem;
border:1px solid var(--vibeui-commerce-063-border);background:var(--vibeui-commerce-063-surface);
font:inherit;font-size:0.9375rem;color:inherit;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="commerce-063"] [data-part="quick"]{
appearance:none;cursor:pointer;height:2rem;padding:0 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-commerce-063-border);background:var(--vibeui-commerce-063-soft);
color:inherit;font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="commerce-063"] input:focus-visible,
[data-vibeui-block="commerce-063"] [data-part="quick"]:focus-visible,
[data-vibeui-block="commerce-063"] [data-part="go"]:focus-visible{outline:2px solid var(--vibeui-commerce-063-accent);outline-offset:2px}
[data-vibeui-block="commerce-063"] [data-part="rest"]{margin:0.5rem 0 0;font-size:0.8125rem;color:var(--vibeui-commerce-063-muted)}
[data-vibeui-block="commerce-063"] [data-part="rest"] strong{color:var(--vibeui-commerce-063-fg);font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-063"] [data-part="error"]{
margin:0.875rem 0 0;padding:0.5625rem 0.75rem;border-radius:0.625rem;
border:1px solid var(--vibeui-commerce-063-warn);color:var(--vibeui-commerce-063-warn);
font-size:0.8125rem;line-height:1.45;
}
[data-vibeui-block="commerce-063"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;width:100%;height:2.875rem;margin-top:1rem;border-radius:0.875rem;
background:var(--vibeui-commerce-063-accent);color:var(--vibeui-commerce-063-onaccent);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-063"] [data-part="go"]:disabled{cursor:not-allowed;opacity:0.5}
[data-vibeui-block="commerce-063"] [data-part="note"]{margin:0.875rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-063-muted)}
@container (min-width: 40rem){
[data-vibeui-block="commerce-063"] [data-part="shell"]{padding:2rem 2rem 3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-063"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CARDS: Commerce063Card[] = [
  { id: "1", bank: "Северный банк", tail: "•• 4821", system: "Мир", hue: 285 },
  { id: "2", bank: "Заводской банк", tail: "•• 0175", system: "Мир", hue: 150 },
]

function money(value: number, currency: string) {
  return `${Math.round(value).toLocaleString("ru-RU")} ${currency}`
}

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Оплата двумя картами: сумма второй считается как остаток, поэтому
 * недоплата невозможна. Один файл, ноль зависимостей, палитра своя.
 */
export function Commerce063({
  title = "Разделить оплату между картами",
  lead = "Укажите, сколько списать с первой карты. Остаток уйдёт со второй — сумма всегда сходится с заказом.",
  total = 62580,
  currency = "₽",
  cards = DEFAULT_CARDS,
  totalLabel = "К оплате по заказу",
  firstLabel = "Списать с первой карты",
  restLabel = "Остаток со второй карты",
  stepLabel = "Точная сумма",
  halfLabel = "Пополам",
  allLabel = "Всё одной картой",
  cta = "Оплатить двумя картами",
  errorText = "Сумма первой карты больше заказа: остаток не может быть отрицательным.",
  note = "Банк проведёт две отдельные операции, и в выписке они появятся двумя строками. Возврат тоже придёт двумя частями — на ту карту, с которой списали.",
  accent,
  background = "",
  className,
  style,
}: Commerce063Props) {
  const [first, setFirst] = useState(() => Math.round(total / 2))
  const rest = total - first
  const broken = first < 0 || first > total

  const palette = {
    ...(accent ? { "--vibeui-commerce-063-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-063-bg": background,
          // Поле точной суммы не должно просвечивать: ему нужна непрозрачная
          // подложка, а она задана тем же цветом.
          "--vibeui-commerce-063-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const primary = cards[0]
  const secondary = cards[1]

  return (
    <>
      <style href="vibeui-commerce-063" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-063"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          <p data-part="total">
            <span>{totalLabel}</span>
            <span data-part="sum">{money(total, currency)}</span>
          </p>

          <ul data-part="cards">
            <li
              data-part="card"
              style={
                {
                  "--vibeui-commerce-063-hue": primary?.hue ?? 285,
                } as CSSProperties
              }
            >
              <div data-part="head">
                <span data-part="chip" aria-hidden="true" />
                <div>
                  <p data-part="bank">{primary?.bank}</p>
                  <p data-part="tail">
                    {primary?.system} {primary?.tail}
                  </p>
                </div>
                <p data-part="amount">{money(Math.max(0, first), currency)}</p>
              </div>
              <div data-part="controls">
                <label data-part="clabel" htmlFor="commerce-063-slider">
                  {firstLabel}
                </label>
                <input
                  id="commerce-063-slider"
                  type="range"
                  min={0}
                  max={total}
                  step={100}
                  value={Math.min(Math.max(first, 0), total)}
                  onChange={(event) => setFirst(Number(event.target.value))}
                />
                <div data-part="entry">
                  <label htmlFor="commerce-063-exact" hidden>
                    {stepLabel}
                  </label>
                  <input
                    id="commerce-063-exact"
                    type="number"
                    min={0}
                    max={total}
                    step={1}
                    value={first}
                    onChange={(event) => setFirst(Number(event.target.value))}
                  />
                  <button
                    type="button"
                    data-part="quick"
                    onClick={() => setFirst(Math.round(total / 2))}
                  >
                    {halfLabel}
                  </button>
                  <button
                    type="button"
                    data-part="quick"
                    onClick={() => setFirst(total)}
                  >
                    {allLabel}
                  </button>
                </div>
              </div>
            </li>

            <li
              data-part="card"
              style={
                {
                  "--vibeui-commerce-063-hue": secondary?.hue ?? 150,
                } as CSSProperties
              }
            >
              <div data-part="head">
                <span data-part="chip" aria-hidden="true" />
                <div>
                  <p data-part="bank">{secondary?.bank}</p>
                  <p data-part="tail">
                    {secondary?.system} {secondary?.tail}
                  </p>
                </div>
                <p data-part="amount">{money(Math.max(0, rest), currency)}</p>
              </div>
              <p data-part="rest" aria-live="polite">
                {restLabel}:{" "}
                <strong>{money(Math.max(0, rest), currency)}</strong>
              </p>
            </li>
          </ul>

          {broken ? (
            <p data-part="error" role="alert">
              {errorText}
            </p>
          ) : null}

          <button type="button" data-part="go" disabled={broken}>
            {cta}
          </button>
          <p data-part="note">{note}</p>
        </div>
      </section>
    </>
  )
}
