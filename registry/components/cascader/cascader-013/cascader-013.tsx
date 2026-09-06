"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Cascader013Zone = { name: string; price: number; days: string }

export type Cascader013Region = { name: string; zones: Cascader013Zone[] }

export type Cascader013Props = Omit<
  ComponentProps<"div">,
  "children" | "onSelect"
> & {
  label?: string
  regions?: Cascader013Region[]
  defaultRegion?: string
  defaultZone?: string
  currency?: string
  /** Подпись колонки регионов для скринридера. */
  regionsLabel?: string
  /** Подпись списка зон, {region} — название выбранного региона. */
  zonesLabel?: string
  /** Строка срока в карточке зоны, {days} — срок из справочника. */
  daysText?: string
  /** Строка итога, пока зона не выбрана. */
  emptyText?: string
  onSelect?: (region: string, zone: string, price: number) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: в выборе региона доставки решение принимают не по
// названию, а по цене и сроку. Поэтому цена живёт прямо в строке конечного
// уровня, а не появляется потом в итогах заказа: человек сравнивает зоны
// глазами и выбирает осознанно, а не узнаёт стоимость на шаге оплаты.
const STYLES = `
:where([data-vibeui-block="cascader-013"]){
--vibeui-cascader-013-bg:transparent;
--vibeui-cascader-013-fg:light-dark(oklch(0.22 0.014 155),oklch(0.94 0.006 155));
--vibeui-cascader-013-muted:color-mix(in oklab,var(--vibeui-cascader-013-fg) 68%,transparent);
--vibeui-cascader-013-border:light-dark(oklch(0.9 0.008 155),oklch(0.35 0.012 155));
--vibeui-cascader-013-soft:light-dark(oklch(0.965 0.008 155),oklch(0.28 0.012 155));
--vibeui-cascader-013-accent:light-dark(oklch(0.47 0.11 39.8),oklch(0.78 0.13 39.8));
--vibeui-cascader-013-accentsoft:light-dark(oklch(0.94 0.045 39.8),oklch(0.33 0.05 39.8));
--vibeui-cascader-013-radius:0.625rem;
--vibeui-cascader-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cascader-013"]{color-scheme:dark}
[data-vibeui-block="cascader-013"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-cascader-013-bg);
border:1px solid var(--vibeui-cascader-013-border);
border-radius:calc(var(--vibeui-cascader-013-radius) + 0.25rem);
color:var(--vibeui-cascader-013-fg);
font-family:var(--vibeui-cascader-013-font);
}
[data-vibeui-block="cascader-013"] [data-part="title"]{
margin:0;font-size:0.875rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="cascader-013"] [data-part="cols"]{
display:grid;grid-template-columns:9rem 1fr;gap:0.5rem;
border:1px solid var(--vibeui-cascader-013-border);
border-radius:var(--vibeui-cascader-013-radius);padding:0.3125rem;
}
[data-vibeui-block="cascader-013"] ul{
margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.125rem;
max-height:12rem;overflow:auto;
}
[data-vibeui-block="cascader-013"] [data-part="regions"]{
border-right:1px solid var(--vibeui-cascader-013-border);padding-right:0.3125rem;
}
[data-vibeui-block="cascader-013"] [data-part="region"]{
appearance:none;cursor:pointer;font:inherit;width:100%;
display:flex;align-items:center;justify-content:space-between;gap:0.3125rem;
box-sizing:border-box;padding:0.375rem 0.5rem;
border:0;border-radius:0.4375rem;background:transparent;color:inherit;
font-size:0.8125rem;text-align:left;
transition:background-color .16s ease;
}
[data-vibeui-block="cascader-013"] [data-part="region"]:hover{background:var(--vibeui-cascader-013-soft)}
[data-vibeui-block="cascader-013"] [data-part="region"]:focus-visible,
[data-vibeui-block="cascader-013"] [data-part="zone"]:focus-visible{
outline:2px solid var(--vibeui-cascader-013-accent);outline-offset:-2px;
}
[data-vibeui-block="cascader-013"] [data-part="region"][aria-expanded="true"]{
background:var(--vibeui-cascader-013-accentsoft);font-weight:600;
}
[data-vibeui-block="cascader-013"] [data-part="zone"]{
appearance:none;cursor:pointer;font:inherit;width:100%;
display:grid;grid-template-columns:1fr auto;align-items:baseline;gap:0.1875rem 0.5rem;
box-sizing:border-box;padding:0.375rem 0.5rem;
border:0;border-radius:0.4375rem;background:transparent;color:inherit;text-align:left;
transition:background-color .16s ease;
}
[data-vibeui-block="cascader-013"] [data-part="zone"]:hover{background:var(--vibeui-cascader-013-soft)}
[data-vibeui-block="cascader-013"] [data-part="zone"][aria-selected="true"]{
background:var(--vibeui-cascader-013-accentsoft);
}
[data-vibeui-block="cascader-013"] [data-part="zonename"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="cascader-013"] [data-part="price"]{
font-size:0.8125rem;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap;
color:var(--vibeui-cascader-013-accent);
}
[data-vibeui-block="cascader-013"] [data-part="days"]{
grid-column:1 / -1;font-size:0.6875rem;color:var(--vibeui-cascader-013-muted);
}
[data-vibeui-block="cascader-013"] [data-part="total"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
margin:0;padding-top:0.5625rem;border-top:1px solid var(--vibeui-cascader-013-border);
font-size:0.8125rem;color:var(--vibeui-cascader-013-muted);
}
[data-vibeui-block="cascader-013"] [data-part="path"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
color:var(--vibeui-cascader-013-fg);
}
[data-vibeui-block="cascader-013"] [data-part="sum"]{
flex:none;font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums;
color:var(--vibeui-cascader-013-fg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cascader-013"] *{animation:none!important;transition:none!important}}
`

const REGIONS: Cascader013Region[] = [
  {
    name: "Москва и область",
    zones: [
      { name: "В пределах МКАД", price: 290, days: "сегодня или завтра" },
      { name: "До 30 км от МКАД", price: 590, days: "1–2 дня" },
      { name: "Дальше 30 км", price: 890, days: "2–3 дня" },
    ],
  },
  {
    name: "Северо-Запад",
    zones: [
      { name: "Санкт-Петербург", price: 390, days: "1–2 дня" },
      { name: "Ленинградская область", price: 690, days: "2–4 дня" },
    ],
  },
  {
    name: "Урал",
    zones: [
      { name: "Екатеринбург", price: 490, days: "3–4 дня" },
      { name: "Челябинск", price: 540, days: "3–5 дней" },
      { name: "Прочие города", price: 790, days: "4–7 дней" },
    ],
  },
]

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
 * Каскадный выбор региона доставки с ценой на конечном уровне.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Cascader013({
  label = "Регион доставки",
  regions = REGIONS,
  defaultRegion = "Москва и область",
  defaultZone = "До 30 км от МКАД",
  currency = "₽",
  regionsLabel = "Регионы",
  zonesLabel = "Зоны: {region}",
  daysText = "Срок: {days}",
  emptyText = "Выберите зону доставки",
  onSelect,
  background = "",
  accent,
  className,
  style,
  ...props
}: Cascader013Props) {
  const [region, setRegion] = useState(defaultRegion)
  const [zone, setZone] = useState(defaultZone)

  const current = regions.find((entry) => entry.name === region)
  const picked = current?.zones.find((entry) => entry.name === zone)

  const palette = {
    ...(accent ? { "--vibeui-cascader-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-cascader-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cascader-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="cascader"
        data-vibeui-block="cascader-013"
        className={className}
        style={palette}
      >
        <h3 data-part="title">{label}</h3>
        <div data-part="cols">
          <ul data-part="regions" aria-label={regionsLabel}>
            {regions.map((entry) => (
              <li key={entry.name}>
                <button
                  type="button"
                  data-part="region"
                  aria-expanded={entry.name === region}
                  onClick={() => {
                    setRegion(entry.name)
                    setZone("")
                  }}
                >
                  <span>{entry.name}</span>
                  <span aria-hidden="true">›</span>
                </button>
              </li>
            ))}
          </ul>
          <ul
            role="listbox"
            aria-label={zonesLabel.replace("{region}", region)}
          >
            {(current?.zones ?? []).map((entry) => (
              <li key={entry.name} role="none">
                <button
                  type="button"
                  role="option"
                  data-part="zone"
                  aria-selected={entry.name === zone}
                  onClick={() => {
                    setZone(entry.name)
                    onSelect?.(region, entry.name, entry.price)
                  }}
                >
                  <span data-part="zonename">{entry.name}</span>
                  <span data-part="price">
                    {entry.price} {currency}
                  </span>
                  <span data-part="days">
                    {daysText.replace("{days}", entry.days)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <p data-part="total" aria-live="polite">
          <span data-part="path">
            {picked ? `${region} · ${picked.name}` : emptyText}
          </span>
          <span data-part="sum">
            {picked ? `${picked.price} ${currency}` : "—"}
          </span>
        </p>
      </div>
    </>
  )
}
