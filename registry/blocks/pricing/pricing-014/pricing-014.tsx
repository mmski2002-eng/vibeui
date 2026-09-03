"use client"

import { useId, useState } from "react"
import type { CSSProperties } from "react"

export type Pricing014Addon = {
  id: string
  title: string
  description: string
  price: number
  preselected?: boolean
}

export type Pricing014Props = {
  eyebrow?: string
  title?: string
  baseName?: string
  basePrice?: number
  currency?: string
  addons?: Pricing014Addon[]
  action?: { label: string; href: string }
  note?: string
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  labels?: Record<string, string>
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: конструктор тарифа на чекбоксах. Клиентский компонент: сумма
// считается на месте. Чекбоксы настоящие, а не квадратики на div'ах —
// пробел, состояние и группировка достаются от браузера; своя галочка
// рисуется псевдоэлементом поверх, а не заменяет input. Цена допуслуги
// стоит в той же строке, что и её название: цена, спрятанная в подсказку,
// заставляет включать услугу вслепую. Итог объявляется aria-live.
const STYLES = `
:where([data-vibeui-block="pricing-014"]){
--vibeui-pricing-014-bg:transparent;
--vibeui-pricing-014-fg:light-dark(oklch(0.2 0.012 230),oklch(0.94 0.005 230));
--vibeui-pricing-014-muted:light-dark(oklch(0.51 0.012 230),oklch(0.7 0.01 230));
--vibeui-pricing-014-card:light-dark(oklch(1 0 0),oklch(0.25 0.011 230));
--vibeui-pricing-014-line:light-dark(oklch(0.89 0.006 230),oklch(0.37 0.01 230));
--vibeui-pricing-014-accent:light-dark(oklch(0.5 0.15 225),oklch(0.75 0.12 225));
--vibeui-pricing-014-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.19 0.03 225));
--vibeui-pricing-014-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-014"]{color-scheme:dark}
[data-vibeui-block="pricing-014"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-pricing-014-bg);color:var(--vibeui-pricing-014-fg);
font-family:var(--vibeui-pricing-014-sans);
}
[data-vibeui-block="pricing-014"] *{box-sizing:border-box}
[data-vibeui-block="pricing-014"] [data-part="shell"]{max-width:58rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="pricing-014"] [data-part="eyebrow"]{
margin:0 0 0.75rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-pricing-014-accent);
}
[data-vibeui-block="pricing-014"] h2{
margin:0 0 1.75rem;max-width:22ch;font-size:clamp(1.5rem,4.2cqi,2.25rem);line-height:1.14;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="pricing-014"] [data-part="grid"]{display:grid;grid-template-columns:1fr;gap:1.25rem;align-items:start}
[data-vibeui-block="pricing-014"] fieldset{margin:0;padding:0;border:0}
[data-vibeui-block="pricing-014"] legend{
padding:0;margin-bottom:0.75rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
color:var(--vibeui-pricing-014-muted);
}
[data-vibeui-block="pricing-014"] [data-part="base"]{
display:flex;align-items:baseline;justify-content:space-between;gap:1rem;padding:1rem 1.125rem;
border-radius:0.875rem;border:1px solid var(--vibeui-pricing-014-line);background:var(--vibeui-pricing-014-card);
margin-bottom:0.75rem;
}
[data-vibeui-block="pricing-014"] [data-part="basename"]{font-size:0.9375rem;font-weight:650}
[data-vibeui-block="pricing-014"] [data-part="baseprice"]{font-size:0.9375rem;font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-014"] [data-part="option"]{
position:relative;display:flex;gap:0.75rem;padding:1rem 1.125rem;cursor:pointer;
border-radius:0.875rem;border:1px solid var(--vibeui-pricing-014-line);background:var(--vibeui-pricing-014-card);
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="pricing-014"] [data-part="option"] + [data-part="option"]{margin-top:0.625rem}
[data-vibeui-block="pricing-014"] [data-part="option"]:hover{border-color:var(--vibeui-pricing-014-accent)}
[data-vibeui-block="pricing-014"] [data-part="option"]:has(input:checked){
border-color:var(--vibeui-pricing-014-accent);
background:color-mix(in oklab,var(--vibeui-pricing-014-accent) 6%,var(--vibeui-pricing-014-card));
}
[data-vibeui-block="pricing-014"] [data-part="option"]:has(input:focus-visible){
outline:2px solid var(--vibeui-pricing-014-accent);outline-offset:2px;
}
[data-vibeui-block="pricing-014"] input{position:absolute;opacity:0;pointer-events:none}
[data-vibeui-block="pricing-014"] [data-part="box"]{
flex:0 0 auto;position:relative;margin-top:0.0625rem;width:1.125rem;height:1.125rem;border-radius:0.3125rem;
border:1.5px solid var(--vibeui-pricing-014-line);background:var(--vibeui-pricing-014-card);
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="pricing-014"] [data-part="option"]:has(input:checked) [data-part="box"]{
background:var(--vibeui-pricing-014-accent);border-color:var(--vibeui-pricing-014-accent);
}
[data-vibeui-block="pricing-014"] [data-part="box"]::after{
content:"";position:absolute;left:0.3125rem;top:0.125rem;width:0.25rem;height:0.5rem;opacity:0;
border:solid var(--vibeui-pricing-014-accent-fg);border-width:0 2px 2px 0;transform:rotate(45deg);
}
[data-vibeui-block="pricing-014"] [data-part="option"]:has(input:checked) [data-part="box"]::after{opacity:1}
[data-vibeui-block="pricing-014"] [data-part="body"]{flex:1 1 auto;min-width:0;display:block}
[data-vibeui-block="pricing-014"] [data-part="head"]{display:flex;align-items:baseline;justify-content:space-between;gap:1rem}
[data-vibeui-block="pricing-014"] [data-part="name"]{font-size:0.9375rem;font-weight:650}
[data-vibeui-block="pricing-014"] [data-part="price"]{flex:0 0 auto;font-size:0.875rem;font-weight:650;color:var(--vibeui-pricing-014-accent);font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-014"] [data-part="desc"]{display:block;margin-top:0.25rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-pricing-014-muted)}
[data-vibeui-block="pricing-014"] [data-part="summary"]{
padding:1.5rem;border-radius:1.125rem;border:1px solid var(--vibeui-pricing-014-line);background:var(--vibeui-pricing-014-card);
}
[data-vibeui-block="pricing-014"] [data-part="row"]{
display:flex;justify-content:space-between;gap:1rem;padding:0.3125rem 0;
font-size:0.8125rem;color:var(--vibeui-pricing-014-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pricing-014"] [data-part="total"]{
display:flex;align-items:baseline;justify-content:space-between;gap:1rem;margin-top:0.75rem;padding-top:0.875rem;
border-top:1px solid var(--vibeui-pricing-014-line);font-size:0.8125rem;color:var(--vibeui-pricing-014-muted);
}
[data-vibeui-block="pricing-014"] [data-part="sum"]{font-size:1.75rem;font-weight:700;letter-spacing:-0.035em;color:var(--vibeui-pricing-014-fg);font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-014"] a{
display:inline-flex;align-items:center;justify-content:center;margin-top:1.25rem;width:100%;height:2.75rem;border-radius:0.625rem;
background:var(--vibeui-pricing-014-accent);color:var(--vibeui-pricing-014-accent-fg);
font-size:0.9375rem;font-weight:650;text-decoration:none;transition:background-color .16s ease;
}
[data-vibeui-block="pricing-014"] a:hover{background:color-mix(in oklab,var(--vibeui-pricing-014-accent) 86%,black)}
[data-vibeui-block="pricing-014"] a:focus-visible{outline:2px solid var(--vibeui-pricing-014-accent);outline-offset:3px}
[data-vibeui-block="pricing-014"] [data-part="note"]{margin:0.875rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-pricing-014-muted)}
@container (min-width: 34rem){
[data-vibeui-block="pricing-014"] [data-part="shell"]{padding:5rem 2rem}
}
@container (min-width: 52rem){
[data-vibeui-block="pricing-014"] [data-part="grid"]{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:2rem}
[data-vibeui-block="pricing-014"] [data-part="shell"]{padding:6rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ADDONS: Pricing014Addon[] = [
  {
    id: "seats",
    title: "Дополнительные места",
    description: "Пять мест сверх тарифа для дизайнеров и подрядчиков.",
    price: 990,
    preselected: true,
  },
  {
    id: "brand",
    title: "Секции под ваш бренд",
    description: "Собираем три секции по вашему гайдлайну и отдаём исходники.",
    price: 4900,
  },
  {
    id: "support",
    title: "Поддержка за четыре часа",
    description: "Ответ в рабочие часы за четыре часа вместо одного дня.",
    price: 1490,
  },
  {
    id: "onprem",
    title: "Реестр в вашем контуре",
    description: "Секции ставятся без обращения к внешним адресам.",
    price: 7900,
  },
]

const MONEY = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 })

const DEFAULT_LABELS: Record<string, string> = {
  legend: "Что включить",
  total: "Итого в месяц",
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

/** Блок допуслуг с чекбоксами: цена каждой в строке, итог считается на месте. */
export function Pricing014({
  eyebrow = "Соберите тариф",
  title = "База плюс то, что действительно нужно",
  baseName = "Тариф «Команда», база",
  basePrice = 1490,
  currency = "₽",
  addons = DEFAULT_ADDONS,
  action = { label: "Перейти к оплате", href: "#" },
  note = "Допуслуги можно включить и выключить в любой момент — счёт пересчитается со следующего месяца.",
  labels = DEFAULT_LABELS,
  accent,
  background = "",
  className,
  style,
}: Pricing014Props) {
  const id = useId()
  const [selected, setSelected] = useState<string[]>(
    addons.filter((addon) => addon.preselected).map((addon) => addon.id),
  )

  const text = (key: string) => labels[key] ?? DEFAULT_LABELS[key]

  const palette = {
    ...(accent ? { "--vibeui-pricing-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pricing-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const chosen = addons.filter((addon) => selected.includes(addon.id))
  const total = chosen.reduce((sum, addon) => sum + addon.price, basePrice)

  function toggle(addonId: string) {
    setSelected((current) =>
      current.includes(addonId)
        ? current.filter((entry) => entry !== addonId)
        : [...current, addonId],
    )
  }

  return (
    <>
      <style href="vibeui-pricing-014" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="pricing-014"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>

          <div data-part="grid">
            <fieldset>
              <legend>{text("legend")}</legend>

              <div data-part="base">
                <span data-part="basename">{baseName}</span>
                <span data-part="baseprice">
                  {MONEY.format(basePrice)} {currency}
                </span>
              </div>

              {addons.slice(0, 6).map((addon) => (
                <label key={addon.id} data-part="option">
                  <input
                    type="checkbox"
                    name={`${id}-addon`}
                    value={addon.id}
                    checked={selected.includes(addon.id)}
                    onChange={() => toggle(addon.id)}
                  />
                  <span data-part="box" aria-hidden="true" />
                  <span data-part="body">
                    <span data-part="head">
                      <span data-part="name">{addon.title}</span>
                      <span data-part="price">
                        +{MONEY.format(addon.price)} {currency}
                      </span>
                    </span>
                    <span data-part="desc">{addon.description}</span>
                  </span>
                </label>
              ))}
            </fieldset>

            <div data-part="summary">
              <p data-part="row">
                <span>{baseName}</span>
                <span>
                  {MONEY.format(basePrice)} {currency}
                </span>
              </p>
              {chosen.map((addon) => (
                <p key={addon.id} data-part="row">
                  <span>{addon.title}</span>
                  <span>
                    {MONEY.format(addon.price)} {currency}
                  </span>
                </p>
              ))}
              <p data-part="total" aria-live="polite">
                <span>{text("total")}</span>
                <span data-part="sum">
                  {MONEY.format(total)} {currency}
                </span>
              </p>
              <a href={action.href}>{action.label}</a>
              {note ? <p data-part="note">{note}</p> : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
