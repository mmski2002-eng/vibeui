"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Commerce016Item = {
  id: string
  title: string
  note: string
  price: number
  hue?: number
  fixed?: boolean
}

export type Commerce016Props = {
  title?: string
  items?: Commerce016Item[]
  cta?: string
  saving?: number
  /** Локаль для разрядов в цене. */
  locale?: string
  /** Шаблон цены, {value} — число с разрядами. */
  priceText?: string
  /** Шаблон подписи над суммой, {count} — сколько товаров выбрано. */
  totalText?: string
  /** Шаблон выгоды комплекта, {value} — сумма скидки. */
  savedText?: string
  /** Что стоит вместо выгоды, пока выбран один товар. */
  addMoreText?: string
  /** Шаблон сноски под кнопкой, {percent} — скидка комплекта. */
  hintText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: комплект «с этим покупают», где сумма пересчитывается от
// галочек. Набор без пересчёта — просто картинка: покупатель не видит, во
// что ему обойдётся его выбор, и уходит считать в корзину. Основной товар
// помечен как обязательный и его галочка выключена — иначе получается набор
// без товара, ради которого пришли.
const STYLES = `
:where([data-vibeui-block="commerce-016"]){
--vibeui-commerce-016-bg:transparent;
--vibeui-commerce-016-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-commerce-016-muted:light-dark(oklch(0.55 0 265),oklch(0.7 0 265));
--vibeui-commerce-016-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-commerce-016-soft:light-dark(oklch(0.975 0 265),oklch(0.27 0 265));
--vibeui-commerce-016-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.68 0.17 39.8));
--vibeui-commerce-016-on-accent:oklch(0.15 0.02 39.8);
--vibeui-commerce-016-save:light-dark(oklch(0.58 0.14 39.8),oklch(0.76 0.14 39.8));
--vibeui-commerce-016-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-016"]{color-scheme:dark}
[data-vibeui-block="commerce-016"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-commerce-016-bg);
font-family:var(--vibeui-commerce-016-sans);color:var(--vibeui-commerce-016-fg);
}
[data-vibeui-block="commerce-016"] *{box-sizing:border-box}
[data-vibeui-block="commerce-016"] [data-part="shell"]{padding:1rem;max-width:60rem;margin:0 auto}
[data-vibeui-block="commerce-016"] h2{margin:0 0 0.875rem;font-size:1.125rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-016"] [data-part="row"]{display:grid;gap:0.75rem;grid-template-columns:1fr;align-items:start}
@container (min-width: 44rem){
[data-vibeui-block="commerce-016"] [data-part="row"]{grid-template-columns:minmax(0,1fr) 16rem}
[data-vibeui-block="commerce-016"] [data-part="chain"]{grid-auto-flow:column;grid-auto-columns:1fr}
}
[data-vibeui-block="commerce-016"] [data-part="chain"]{display:grid;gap:0.5rem;align-items:stretch}
[data-vibeui-block="commerce-016"] [data-part="card"]{
position:relative;display:flex;gap:0.625rem;align-items:center;
padding:0.625rem;border-radius:0.875rem;cursor:pointer;
border:1px solid var(--vibeui-commerce-016-border);
}
[data-vibeui-block="commerce-016"] [data-part="card"]:has(input:checked){border-color:var(--vibeui-commerce-016-accent);background:var(--vibeui-commerce-016-soft)}
[data-vibeui-block="commerce-016"] [data-part="card"]:has(input:focus-visible){outline:2px solid var(--vibeui-commerce-016-accent);outline-offset:2px}
[data-vibeui-block="commerce-016"] [data-part="card"]:has(input:disabled){cursor:default;background:var(--vibeui-commerce-016-soft)}
[data-vibeui-block="commerce-016"] input[type="checkbox"]{accent-color:var(--vibeui-commerce-016-accent);width:1rem;height:1rem;margin:0;flex:none}
[data-vibeui-block="commerce-016"] [data-part="shot"]{
width:3rem;height:3rem;border-radius:0.625rem;flex:none;
background:linear-gradient(145deg,oklch(0.94 0.05 var(--vibeui-commerce-016-hue,262)),oklch(0.86 0.09 var(--vibeui-commerce-016-hue,262)));
}
[data-vibeui-block="commerce-016"] [data-part="name"]{display:block;font-size:0.8125rem;font-weight:650;line-height:1.3}
[data-vibeui-block="commerce-016"] [data-part="note"]{display:block;font-size:0.6875rem;color:var(--vibeui-commerce-016-muted);line-height:1.35}
[data-vibeui-block="commerce-016"] [data-part="cost"]{display:block;margin-top:0.1875rem;font-size:0.8125rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-016"] [data-part="total"]{
padding:0.875rem;border-radius:1rem;border:1px solid var(--vibeui-commerce-016-border);
background:var(--vibeui-commerce-016-soft);
}
[data-vibeui-block="commerce-016"] [data-part="cap"]{margin:0;font-size:0.6875rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--vibeui-commerce-016-muted)}
[data-vibeui-block="commerce-016"] [data-part="sum"]{margin:0.125rem 0 0;font-size:1.5rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.02em}
[data-vibeui-block="commerce-016"] [data-part="save"]{margin:0.25rem 0 0.75rem;font-size:0.75rem;font-weight:650;color:var(--vibeui-commerce-016-save)}
[data-vibeui-block="commerce-016"] [data-part="buy"]{
width:100%;appearance:none;border:0;cursor:pointer;height:2.625rem;border-radius:0.75rem;
background:var(--vibeui-commerce-016-accent);color:var(--vibeui-commerce-016-on-accent);font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="commerce-016"] [data-part="buy"]:disabled{opacity:.5;cursor:not-allowed}
[data-vibeui-block="commerce-016"] [data-part="buy"]:focus-visible{outline:2px solid var(--vibeui-commerce-016-accent);outline-offset:2px}
[data-vibeui-block="commerce-016"] [data-part="hint"]{margin:0.5rem 0 0;font-size:0.6875rem;color:var(--vibeui-commerce-016-muted);line-height:1.4}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Commerce016Item[] = [
  {
    id: "main",
    title: "Кресло «Хмарь»",
    note: "Этот товар · песочный, дуб",
    price: 38900,
    hue: 75,
    fixed: true,
  },
  {
    id: "pouf",
    title: "Пуф «Хмарь»",
    note: "Та же ткань, высота 40 см",
    price: 12400,
    hue: 100,
  },
  {
    id: "care",
    title: "Набор для ухода",
    note: "Щётка и спрей для шерсти",
    price: 1900,
    hue: 150,
  },
]

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

/**
 * Комплект «с этим покупают»: сумма пересчитывается от галочек.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce016({
  title = "Часто берут вместе",
  items = DEFAULT_ITEMS,
  cta = "Добавить в корзину",
  saving = 5,
  locale = "ru-RU",
  priceText = "{value} ₽",
  totalText = "Итого за {count} товара",
  savedText = "Комплектом дешевле на {value}",
  addMoreText = "Добавьте второй товар — комплект дешевле",
  hintText = "Скидка комплекта {percent}% действует, пока товары лежат в корзине вместе.",
  accent,
  background = "",
  className,
  style,
}: Commerce016Props) {
  const money = (value: number) =>
    priceText.replace("{value}", value.toLocaleString(locale))

  const [picked, setPicked] = useState(() => items.map((item) => item.id))

  // Сумма считается от галочек: набор без пересчёта ничего не обещает.
  const chosen = items.filter((item) => picked.includes(item.id))
  const full = chosen.reduce((sum, item) => sum + item.price, 0)
  const discount = chosen.length > 1 ? Math.round((full * saving) / 100) : 0

  const toggle = (item: Commerce016Item) =>
    setPicked((current) =>
      current.includes(item.id)
        ? current.filter((id) => id !== item.id)
        : [...current, item.id],
    )

  const palette = {
    ...(accent ? { "--vibeui-commerce-016-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-016" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-016"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <div data-part="row">
            <div data-part="chain">
              {items.map((item, index) => (
                <label
                  key={item.id}
                  data-part="card"
                  style={
                    {
                      "--vibeui-commerce-016-hue": item.hue ?? 262,
                    } as CSSProperties
                  }
                >
                  <input
                    type="checkbox"
                    checked={picked.includes(item.id)}
                    disabled={item.fixed}
                    onChange={() => toggle(item)}
                  />
                  <span data-part="shot" aria-hidden="true" />
                  <span>
                    <span data-part="name">
                      {index > 0 ? "+ " : ""}
                      {item.title}
                    </span>
                    <span data-part="note">{item.note}</span>
                    <span data-part="cost">{money(item.price)}</span>
                  </span>
                </label>
              ))}
            </div>

            <div data-part="total">
              <p data-part="cap">
                {totalText.replace("{count}", String(chosen.length))}
              </p>
              <p data-part="sum">{money(full - discount)}</p>
              <p data-part="save">
                {discount > 0
                  ? savedText.replace("{value}", money(discount))
                  : addMoreText}
              </p>
              <button
                type="button"
                data-part="buy"
                disabled={chosen.length === 0}
              >
                {cta} · {chosen.length}
              </button>
              <p data-part="hint">
                {hintText.replace("{percent}", String(saving))}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
