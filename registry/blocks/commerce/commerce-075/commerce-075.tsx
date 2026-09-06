"use client"

import { useId, useState } from "react"
import type { CSSProperties } from "react"

export type Commerce075Fund = {
  value: string
  name: string
  what: string
}

export type Commerce075Props = {
  title?: string
  lead?: string
  orderLabel?: string
  order?: number
  roundTo?: number
  currency?: string
  toggleLabel?: string
  /** Строка галочки: {label} — подпись, {sum} — округлённая сумма. */
  toggleTemplate?: string
  /** Строка надбавки: {sum} — то, что уйдёт фонду. */
  addTemplate?: string
  /** Локаль для разрядов в суммах: компонент несёт русскую. */
  locale?: string
  fundLegend?: string
  funds?: Commerce075Fund[]
  addLabel?: string
  totalLabel?: string
  yearNote?: string
  reportLabel?: string
  reportText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: округление суммы заказа в пользу фонда. Надбавка считается
// от реальной суммы, а не берётся фиксированной: «добавьте 100 ₽» к чеку
// 62 580 ₽ выглядит как навязанная строка, а «округлим до 62 600 ₽» —
// как решение. Галочка снята по умолчанию: включённое по умолчанию
// пожертвование — это списание, о котором не просили.
const STYLES = `
:where([data-vibeui-block="commerce-075"]){
--vibeui-commerce-075-bg:transparent;
--vibeui-commerce-075-fg:light-dark(oklch(0.21 0.014 120),oklch(0.94 0.007 120));
--vibeui-commerce-075-muted:light-dark(oklch(0.53 0.016 120),oklch(0.73 0.013 120));
--vibeui-commerce-075-border:light-dark(oklch(0.9 0.008 120),oklch(0.38 0.016 120));
--vibeui-commerce-075-soft:light-dark(oklch(0.972 0.008 120),oklch(0.27 0.016 120));
--vibeui-commerce-075-accent:light-dark(oklch(0.55 0.12 39.8),oklch(0.78 0.13 39.8));
--vibeui-commerce-075-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-075"]{color-scheme:dark}
[data-vibeui-block="commerce-075"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-075-bg);
color:var(--vibeui-commerce-075-fg);font-family:var(--vibeui-commerce-075-sans);
}
[data-vibeui-block="commerce-075"] *{box-sizing:border-box}
[data-vibeui-block="commerce-075"] [data-part="shell"]{max-width:38rem;margin:0 auto;padding:1.25rem 1rem 1.75rem}
[data-vibeui-block="commerce-075"] [data-part="box"]{border:1px solid var(--vibeui-commerce-075-border);border-radius:1rem;padding:1rem 1.125rem}
[data-vibeui-block="commerce-075"] h2{margin:0 0 0.25rem;font-size:1.0625rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="commerce-075"] [data-part="lead"]{margin:0 0 0.875rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-commerce-075-muted)}
[data-vibeui-block="commerce-075"] [data-part="toggle"]{
display:flex;gap:0.625rem;align-items:flex-start;cursor:pointer;
padding:0.6875rem 0.75rem;border-radius:0.875rem;background:var(--vibeui-commerce-075-soft);
}
[data-vibeui-block="commerce-075"] [data-part="toggle"] input{margin:0.125rem 0 0;flex:none;width:1.25rem;height:1.25rem;accent-color:var(--vibeui-commerce-075-accent)}
[data-vibeui-block="commerce-075"] [data-part="tlabel"]{display:block;font-size:0.9375rem;font-weight:650;line-height:1.35}
[data-vibeui-block="commerce-075"] [data-part="tadd"]{display:block;margin-top:0.1875rem;font-size:0.8125rem;color:var(--vibeui-commerce-075-muted)}
[data-vibeui-block="commerce-075"] [data-part="tadd"] strong{color:var(--vibeui-commerce-075-accent);font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-075"] fieldset{border:0;margin:0.875rem 0 0;padding:0;min-inline-size:0}
[data-vibeui-block="commerce-075"] legend{
padding:0;margin:0 0 0.5rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;
color:var(--vibeui-commerce-075-muted);
}
[data-vibeui-block="commerce-075"] [data-part="funds"]{display:grid;gap:0.4375rem;clear:both}
[data-vibeui-block="commerce-075"] [data-part="fund"]{position:relative;display:block}
[data-vibeui-block="commerce-075"] [data-part="fund"] input{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
[data-vibeui-block="commerce-075"] [data-part="fface"]{
display:block;cursor:pointer;border:1px solid var(--vibeui-commerce-075-border);border-radius:0.75rem;
padding:0.5625rem 0.75rem;transition:border-color .14s ease;
}
[data-vibeui-block="commerce-075"] [data-part="fund"] input:checked+[data-part="fface"]{
border-color:var(--vibeui-commerce-075-accent);box-shadow:inset 0 0 0 1px var(--vibeui-commerce-075-accent);
}
[data-vibeui-block="commerce-075"] [data-part="fund"] input:focus-visible+[data-part="fface"]{outline:2px solid var(--vibeui-commerce-075-accent);outline-offset:2px}
[data-vibeui-block="commerce-075"] [data-part="fund"] input:disabled+[data-part="fface"]{opacity:0.5;cursor:not-allowed}
[data-vibeui-block="commerce-075"] [data-part="fname"]{display:block;font-size:0.875rem;font-weight:650}
[data-vibeui-block="commerce-075"] [data-part="fwhat"]{display:block;margin-top:0.0625rem;font-size:0.75rem;line-height:1.4;color:var(--vibeui-commerce-075-muted)}
[data-vibeui-block="commerce-075"] dl{margin:0.875rem 0 0;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:0.375rem 0.75rem;font-size:0.8125rem}
[data-vibeui-block="commerce-075"] [data-part="pair"]{display:contents}
[data-vibeui-block="commerce-075"] dt{color:var(--vibeui-commerce-075-muted);min-width:0}
[data-vibeui-block="commerce-075"] dd{margin:0;text-align:right;font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-075"] [data-part="total"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;margin:0.75rem 0 0;
padding-top:0.6875rem;border-top:1px solid var(--vibeui-commerce-075-border);
}
[data-vibeui-block="commerce-075"] [data-part="total"] span:first-child{font-size:0.875rem;font-weight:650}
[data-vibeui-block="commerce-075"] [data-part="sum"]{font-size:1.375rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-075"] [data-part="year"]{margin:0.625rem 0 0;font-size:0.75rem;line-height:1.45;color:var(--vibeui-commerce-075-muted)}
[data-vibeui-block="commerce-075"] details{margin-top:0.75rem;font-size:0.75rem;color:var(--vibeui-commerce-075-muted)}
[data-vibeui-block="commerce-075"] summary{cursor:pointer;font-weight:650;border-radius:0.25rem}
[data-vibeui-block="commerce-075"] summary:focus-visible{outline:2px solid var(--vibeui-commerce-075-accent);outline-offset:2px}
[data-vibeui-block="commerce-075"] details p{margin:0.375rem 0 0;line-height:1.55}
@container (min-width: 34rem){
[data-vibeui-block="commerce-075"] [data-part="shell"]{padding:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-075"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FUNDS: Commerce075Fund[] = [
  {
    value: "les",
    name: "Фонд «Лесной дозор»",
    what: "Тушение и восстановление лесов после пожаров",
  },
  {
    value: "dom",
    name: "Фонд «Тёплый дом»",
    what: "Ремонт квартир для семей с детьми-инвалидами",
  },
  {
    value: "lapa",
    name: "Приют «Лапа»",
    what: "Корм и лечение для 180 собак и кошек",
  },
]

function money(value: number, currency: string, locale: string) {
  return `${Math.round(value).toLocaleString(locale)} ${currency}`
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
 * Благотворительное округление суммы заказа: надбавка считается от чека,
 * галочка снята по умолчанию. Один файл, ноль зависимостей.
 */
export function Commerce075({
  title = "Округлить сумму в пользу фонда",
  lead = "Разницу до круглой суммы перечислим фонду от вашего имени. Это не меняет состав заказа и не влияет на доставку.",
  orderLabel = "Заказ",
  order = 62580,
  roundTo = 100,
  currency = "₽",
  toggleLabel = "Округлить заказ",
  toggleTemplate = "{label} до {sum}",
  addTemplate = "Фонду уйдёт {sum}",
  locale = "ru-RU",
  fundLegend = "Куда пойдёт надбавка",
  funds = DEFAULT_FUNDS,
  addLabel = "Пожертвование",
  totalLabel = "К оплате",
  yearNote = "За прошлый год покупатели округлили заказы на 4 180 000 ₽. Отчёт фонда публикуется каждый квартал.",
  reportLabel = "Как мы это подтверждаем",
  reportText = "Надбавка не проходит через счёт магазина: платёж делится на стороне банка, и вторая часть уходит фонду напрямую. В чеке она стоит отдельной строкой, а фонд присылает подтверждение на вашу почту.",
  accent,
  background = "",
  className,
  style,
}: Commerce075Props) {
  // Радиогруппа изолируется по экземпляру: имя фиксировано, и два блока на
  // одной странице делили бы выбор без useId().
  const uid = useId()
  const [on, setOn] = useState(false)
  const [fund, setFund] = useState(funds[0]?.value ?? "")

  const rounded = Math.ceil(order / roundTo) * roundTo
  const add = rounded === order ? roundTo : rounded - order
  const total = on ? order + add : order
  const [addBefore, addAfter = ""] = addTemplate.split("{sum}")

  const palette = {
    ...(accent ? { "--vibeui-commerce-075-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-075-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-075" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-075"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="box">
            <h2>{title}</h2>
            <p data-part="lead">{lead}</p>

            <label data-part="toggle" htmlFor="commerce-075-round">
              <input
                type="checkbox"
                id="commerce-075-round"
                checked={on}
                onChange={(event) => setOn(event.target.checked)}
              />
              <span>
                <span data-part="tlabel">
                  {toggleTemplate
                    .replace("{label}", toggleLabel)
                    .replace("{sum}", money(order + add, currency, locale))}
                </span>
                <span data-part="tadd">
                  {addBefore}
                  <strong>{money(add, currency, locale)}</strong>
                  {addAfter}
                </span>
              </span>
            </label>

            <fieldset disabled={!on}>
              <legend>{fundLegend}</legend>
              <div data-part="funds">
                {funds.map((entry) => (
                  <label
                    key={entry.value}
                    data-part="fund"
                    htmlFor={`${uid}-${entry.value}`}
                  >
                    <input
                      type="radio"
                      id={`${uid}-${entry.value}`}
                      name={`${uid}-fund`}
                      checked={fund === entry.value}
                      onChange={() => setFund(entry.value)}
                    />
                    <span data-part="fface">
                      <span data-part="fname">{entry.name}</span>
                      <span data-part="fwhat">{entry.what}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <dl>
              <div data-part="pair">
                <dt>{orderLabel}</dt>
                <dd>{money(order, currency, locale)}</dd>
              </div>
              <div data-part="pair">
                <dt>{addLabel}</dt>
                <dd>{on ? `+ ${money(add, currency, locale)}` : "—"}</dd>
              </div>
            </dl>

            <p data-part="total" aria-live="polite">
              <span>{totalLabel}</span>
              <span data-part="sum">{money(total, currency, locale)}</span>
            </p>

            <p data-part="year">{yearNote}</p>
            <details>
              <summary>{reportLabel}</summary>
              <p>{reportText}</p>
            </details>
          </div>
        </div>
      </section>
    </>
  )
}
