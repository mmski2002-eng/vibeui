"use client"

import { useId, useMemo, useState } from "react"
import type { CSSProperties } from "react"

export type Pricing006Tier = {
  upTo: number
  perUnit: number
}

export type Pricing006Props = {
  eyebrow?: string
  title?: string
  unitLabel?: string
  unitOne?: string
  min?: number
  max?: number
  step?: number
  defaultVolume?: number
  base?: number
  tiers?: Pricing006Tier[]
  action?: { label: string; href: string }
  note?: string
  /** Подпись ползунка. */
  volumeLabel?: string
  /** Подписи ступеней: {value} — верхняя граница ступени. */
  tierText?: { upTo: string; above: string }
  /** Цена ступени. {price} — ставка, {unit} — подпись unitOne. */
  perUnitText?: string
  /** Итоговая сумма. {sum} — рассчитанное значение. */
  sumText?: string
  /** Пояснение под суммой. {volume}, {unit} и {base} подставляются. */
  summaryText?: string
  /** Локаль форматирования чисел. */
  locale?: string
  accent?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: цена считается ползунком, а не таблицей. Клиентский компонент:
// без состояния ползунок остаётся декорацией. Ступени тарифа заданы массивом
// «до скольки — почём», и итог складывается по ступеням, а не по одной
// ставке: так считают реальные объёмные тарифы, и пользователь видит, что
// следующая тысяча стоит дешевле. Значение объявляется aria-live, поэтому
// пересчёт слышен, а не только виден. Ползунок — нативный input[type=range].
const STYLES = `
:where([data-vibeui-block="pricing-006"]){
--vibeui-pricing-006-bg:transparent;
--vibeui-pricing-006-fg:light-dark(oklch(0.2 0.012 250),oklch(0.95 0.004 250));
--vibeui-pricing-006-muted:light-dark(oklch(0.52 0.012 250),oklch(0.72 0.012 250));
--vibeui-pricing-006-card:light-dark(oklch(1 0 0),oklch(0.22 0.014 250));
--vibeui-pricing-006-line:light-dark(oklch(0.89 0.006 250),oklch(0.34 0.014 250));
--vibeui-pricing-006-track:light-dark(oklch(0.91 0.008 250),oklch(0.33 0.014 250));
--vibeui-pricing-006-accent:light-dark(oklch(0.52 0.17 250),oklch(0.75 0.15 250));
--vibeui-pricing-006-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.18 0.03 250));
--vibeui-pricing-006-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-006"]{color-scheme:dark}
[data-vibeui-block="pricing-006"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-pricing-006-bg);color:var(--vibeui-pricing-006-fg);
font-family:var(--vibeui-pricing-006-sans);
}
[data-vibeui-block="pricing-006"] *{box-sizing:border-box}
[data-vibeui-block="pricing-006"] [data-part="shell"]{max-width:60rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="pricing-006"] [data-part="eyebrow"]{
margin:0 0 0.75rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-pricing-006-accent);
}
[data-vibeui-block="pricing-006"] h2{
margin:0 0 1.75rem;max-width:24ch;font-size:clamp(1.5rem,4.2cqi,2.25rem);line-height:1.14;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="pricing-006"] [data-part="card"]{
display:grid;grid-template-columns:1fr;gap:1.75rem;padding:1.75rem;border-radius:1.25rem;
border:1px solid var(--vibeui-pricing-006-line);background:var(--vibeui-pricing-006-card);
}
[data-vibeui-block="pricing-006"] label{display:block;font-size:0.8125rem;font-weight:650;color:var(--vibeui-pricing-006-muted)}
[data-vibeui-block="pricing-006"] [data-part="volume"]{
display:flex;align-items:baseline;gap:0.5rem;margin:0.5rem 0 1rem;
font-size:2rem;font-weight:700;letter-spacing:-0.03em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pricing-006"] [data-part="unit"]{font-size:0.875rem;font-weight:500;letter-spacing:0;color:var(--vibeui-pricing-006-muted)}
[data-vibeui-block="pricing-006"] input{
appearance:none;width:100%;height:1.5rem;background:none;cursor:pointer;
}
[data-vibeui-block="pricing-006"] input::-webkit-slider-runnable-track{height:0.375rem;border-radius:9999px;background:var(--vibeui-pricing-006-track)}
[data-vibeui-block="pricing-006"] input::-moz-range-track{height:0.375rem;border-radius:9999px;background:var(--vibeui-pricing-006-track)}
[data-vibeui-block="pricing-006"] input::-webkit-slider-thumb{
appearance:none;margin-top:-0.4375rem;width:1.25rem;height:1.25rem;border-radius:9999px;
background:var(--vibeui-pricing-006-accent);border:3px solid var(--vibeui-pricing-006-card);
box-shadow:0 1px 4px oklch(0 0 0 / 22%);
}
[data-vibeui-block="pricing-006"] input::-moz-range-thumb{
width:1.25rem;height:1.25rem;border-radius:9999px;
background:var(--vibeui-pricing-006-accent);border:3px solid var(--vibeui-pricing-006-card);
}
[data-vibeui-block="pricing-006"] input:focus-visible{outline:2px solid var(--vibeui-pricing-006-accent);outline-offset:4px;border-radius:9999px}
[data-vibeui-block="pricing-006"] [data-part="range"]{display:flex;justify-content:space-between;margin-top:0.375rem;font-size:0.75rem;color:var(--vibeui-pricing-006-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-006"] [data-part="tiers"]{list-style:none;margin:1.5rem 0 0;padding:0;display:grid;gap:0.375rem}
[data-vibeui-block="pricing-006"] [data-part="tiers"] li{
display:flex;justify-content:space-between;gap:1rem;padding:0.4375rem 0.625rem;border-radius:0.5rem;
font-size:0.8125rem;color:var(--vibeui-pricing-006-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pricing-006"] [data-active="true"]{background:color-mix(in oklab,var(--vibeui-pricing-006-accent) 10%,transparent);color:var(--vibeui-pricing-006-fg);font-weight:650}
[data-vibeui-block="pricing-006"] [data-part="total"]{
display:flex;flex-direction:column;justify-content:center;padding:1.5rem;border-radius:1rem;
background:color-mix(in oklab,var(--vibeui-pricing-006-accent) 8%,transparent);
}
[data-vibeui-block="pricing-006"] [data-part="sum"]{
font-size:clamp(2.25rem,7cqi,3rem);line-height:1;font-weight:700;letter-spacing:-0.045em;
color:var(--vibeui-pricing-006-accent);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pricing-006"] [data-part="sumnote"]{margin:0.5rem 0 0;font-size:0.8125rem;color:var(--vibeui-pricing-006-muted)}
[data-vibeui-block="pricing-006"] a{
display:inline-flex;align-items:center;justify-content:center;margin-top:1.25rem;height:2.75rem;border-radius:0.625rem;
background:var(--vibeui-pricing-006-accent);color:var(--vibeui-pricing-006-accent-fg);
font-size:0.9375rem;font-weight:650;text-decoration:none;transition:background-color .16s ease;
}
[data-vibeui-block="pricing-006"] a:hover{background:color-mix(in oklab,var(--vibeui-pricing-006-accent) 86%,black)}
[data-vibeui-block="pricing-006"] a:focus-visible{outline:2px solid var(--vibeui-pricing-006-accent);outline-offset:3px}
[data-vibeui-block="pricing-006"] [data-part="note"]{margin:1rem 0 0;font-size:0.75rem;color:var(--vibeui-pricing-006-muted)}
@container (min-width: 34rem){
[data-vibeui-block="pricing-006"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="pricing-006"] [data-part="card"]{padding:2.25rem}
}
@container (min-width: 52rem){
[data-vibeui-block="pricing-006"] [data-part="card"]{grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:2.5rem}
[data-vibeui-block="pricing-006"] [data-part="shell"]{padding:6rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TIERS: Pricing006Tier[] = [
  { upTo: 10000, perUnit: 0.9 },
  { upTo: 50000, perUnit: 0.6 },
  { upTo: Number.POSITIVE_INFINITY, perUnit: 0.35 },
]

const DEFAULT_TIER_TEXT = { upTo: "до {value}", above: "свыше" }

/** Подстановка значений в шаблон подписи: {ключ} → значение. */
function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "")
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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

// Сумма складывается по ступеням: первая тысяча дороже последней, как в
// реальных объёмных тарифах. Одна ставка на весь объём дала бы скачок цены
// на границе ступени.
function total(volume: number, base: number, tiers: Pricing006Tier[]) {
  let rest = volume
  let done = 0
  let sum = base

  for (const tier of tiers) {
    const span = Math.min(rest, tier.upTo - done)
    if (span <= 0) break
    sum += span * tier.perUnit
    rest -= span
    done = tier.upTo
  }

  return Math.round(sum)
}

function safeLocale(value: string, fallback: string) {
  try {
    Intl.NumberFormat.supportedLocalesOf(value)
    return value
  } catch {
    return fallback
  }
}

/** Калькулятор цены по объёму: ползунок, ступенчатый тариф и живой итог. */
export function Pricing006({
  eyebrow = "Калькулятор",
  title = "Посчитайте цену под свой объём",
  unitLabel = "запросов в месяц",
  unitOne = "за запрос",
  min = 1000,
  max = 200000,
  step = 1000,
  defaultVolume = 25000,
  base = 990,
  tiers = DEFAULT_TIERS,
  action = { label: "Подключить тариф", href: "#" },
  note = "Оплата помесячно, объём пересчитывается по факту. Ступени применяются последовательно.",
  volumeLabel = "Объём",
  tierText = DEFAULT_TIER_TEXT,
  perUnitText = "{price} ₽ {unit}",
  sumText = "{sum} ₽",
  summaryText = "в месяц при {volume} {unit}. Абонплата {base} ₽ включена.",
  locale = "ru-RU",
  accent,
  background = "",
  className,
  style,
}: Pricing006Props) {
  const id = useId()
  const [volume, setVolume] = useState(defaultVolume)
  const safeLocaleValue = safeLocale(locale, "ru-RU")
  const numberFormat = useMemo(
    () => new Intl.NumberFormat(safeLocaleValue),
    [safeLocaleValue],
  )
  const moneyFormat = useMemo(
    () => new Intl.NumberFormat(safeLocaleValue, { maximumFractionDigits: 0 }),
    [safeLocaleValue],
  )

  const palette = {
    ...(accent ? { "--vibeui-pricing-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pricing-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const sum = total(volume, base, tiers)
  const activeIndex = tiers.findIndex((tier) => volume <= tier.upTo)

  return (
    <>
      <style href="vibeui-pricing-006" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="pricing-006"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>

          <div data-part="card">
            <div>
              <label htmlFor={`${id}-range`}>{volumeLabel}</label>
              <p data-part="volume">
                {numberFormat.format(volume)}
                <span data-part="unit">{unitLabel}</span>
              </p>
              <input
                id={`${id}-range`}
                type="range"
                min={min}
                max={max}
                step={step}
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
              />
              <p data-part="range">
                <span>{numberFormat.format(min)}</span>
                <span>{numberFormat.format(max)}</span>
              </p>

              <ul data-part="tiers">
                {tiers.map((tier, index) => (
                  <li
                    key={tier.upTo}
                    data-active={index === activeIndex ? "true" : undefined}
                  >
                    <span>
                      {Number.isFinite(tier.upTo)
                        ? fill(tierText.upTo, {
                            value: numberFormat.format(tier.upTo),
                          })
                        : tierText.above}
                    </span>
                    <span>
                      {fill(perUnitText, {
                        price: tier.perUnit.toLocaleString(safeLocaleValue),
                        unit: unitOne,
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div data-part="total">
              <p aria-live="polite">
                <span data-part="sum">
                  {fill(sumText, { sum: moneyFormat.format(sum) })}
                </span>
              </p>
              <p data-part="sumnote">
                {fill(summaryText, {
                  volume: numberFormat.format(volume),
                  unit: unitLabel,
                  base: moneyFormat.format(base),
                })}
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
