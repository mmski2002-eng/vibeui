"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Cascader013Zone = { name: string; price: number; days: string }

export type Cascader013Region = { name: string; zones: Cascader013Zone[] }

export type Cascader013Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSelect"
> & {
  label?: string
  regions?: Cascader013Region[]
  defaultRegion?: string
  defaultZone?: string
  currency?: string
  onSelect?: (region: string, zone: string, price: number) => void
  accent?: string
}

// Идея компонента: в выборе региона доставки решение принимают не по
// названию, а по цене и сроку. Поэтому цена живёт прямо в строке конечного
// уровня, а не появляется потом в итогах заказа: человек сравнивает зоны
// глазами и выбирает осознанно, а не узнаёт стоимость на шаге оплаты.
const STYLES = `
:where([data-vibeui-block="cascader-013"]){
--vibeui-cascader-013-bg:oklch(1 0 0);
--vibeui-cascader-013-fg:oklch(0.22 0.014 155);
--vibeui-cascader-013-muted:oklch(0.55 0.014 155);
--vibeui-cascader-013-border:oklch(0.9 0.008 155);
--vibeui-cascader-013-soft:oklch(0.965 0.008 155);
--vibeui-cascader-013-accent:oklch(0.47 0.11 155);
--vibeui-cascader-013-accentsoft:oklch(0.94 0.045 155);
--vibeui-cascader-013-radius:0.625rem;
--vibeui-cascader-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
border-radius:var(--vibeui-cascader-013-radius);padding:0.3rem;
}
[data-vibeui-block="cascader-013"] ul{
margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.1rem;
max-height:12rem;overflow:auto;
}
[data-vibeui-block="cascader-013"] [data-part="regions"]{
border-right:1px solid var(--vibeui-cascader-013-border);padding-right:0.3rem;
}
[data-vibeui-block="cascader-013"] [data-part="region"]{
appearance:none;cursor:pointer;font:inherit;width:100%;
display:flex;align-items:center;justify-content:space-between;gap:0.3rem;
box-sizing:border-box;padding:0.4rem 0.5rem;
border:0;border-radius:0.45rem;background:transparent;color:inherit;
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
display:grid;grid-template-columns:1fr auto;align-items:baseline;gap:0.2rem 0.5rem;
box-sizing:border-box;padding:0.4rem 0.5rem;
border:0;border-radius:0.45rem;background:transparent;color:inherit;text-align:left;
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
grid-column:1 / -1;font-size:0.7rem;color:var(--vibeui-cascader-013-muted);
}
[data-vibeui-block="cascader-013"] [data-part="total"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
margin:0;padding-top:0.55rem;border-top:1px solid var(--vibeui-cascader-013-border);
font-size:0.8125rem;color:var(--vibeui-cascader-013-muted);
}
[data-vibeui-block="cascader-013"] [data-part="path"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
color:var(--vibeui-cascader-013-fg);
}
[data-vibeui-block="cascader-013"] [data-part="sum"]{
flex:none;font-size:0.95rem;font-weight:700;font-variant-numeric:tabular-nums;
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
 * Каскадный выбор региона доставки с ценой на конечном уровне.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Cascader013({
  label = "Регион доставки",
  regions = REGIONS,
  defaultRegion = "Москва и область",
  defaultZone = "До 30 км от МКАД",
  currency = "₽",
  onSelect,
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
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cascader-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="cascader-013"
        className={className}
        style={palette}
      >
        <h3 data-part="title">{label}</h3>
        <div data-part="cols">
          <ul data-part="regions" aria-label="Регионы">
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
          <ul role="listbox" aria-label={`Зоны: ${region}`}>
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
                  <span data-part="days">Срок: {entry.days}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <p data-part="total" aria-live="polite">
          <span data-part="path">
            {picked ? `${region} · ${picked.name}` : "Выберите зону доставки"}
          </span>
          <span data-part="sum">
            {picked ? `${picked.price} ${currency}` : "—"}
          </span>
        </p>
      </div>
    </>
  )
}
