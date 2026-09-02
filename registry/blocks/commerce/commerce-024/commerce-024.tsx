"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Commerce024Item = {
  id: string
  title: string
  price: string
  old?: string
  drop?: string
  stock: "in" | "low" | "out"
  hue?: number
}

export type Commerce024Props = {
  title?: string
  items?: Commerce024Item[]
  cta?: string
  empty?: string
  /** Шаблон счётчика, {count} — сколько товаров в списке. */
  countText?: string
  /** Шаблон строки отмены, {title} — название товара. */
  removedText?: string
  /** Подпись кнопки возврата товара в список. */
  undoCta?: string
  /** Шаблон подписи кнопки-сердца, {title} — название товара. */
  removeText?: string
  /** Подписи наличия по ключам in, low и out. */
  stockText?: Record<string, string>
  /** Подпись кнопки у товара, которого нет в наличии. */
  outCta?: string
  accent?: string
  /** Цвет сердца. */
  love?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: избранное как список ожидания, а не вторая корзина. Товар сюда
// кладут ради двух событий — падения цены и возвращения в продажу, поэтому
// оба вынесены на карточку словами. Удаление подтверждается строкой отмены:
// сердце нажимают случайно, а восстановить список из головы нельзя.
// Кнопка «в корзину» выключается там, где товара нет, но карточка остаётся.
const STYLES = `
:where([data-vibeui-block="commerce-024"]){
--vibeui-commerce-024-bg:transparent;
--vibeui-commerce-024-paper:light-dark(oklch(1 0 0),oklch(0.2 0.012 265));
--vibeui-commerce-024-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-commerce-024-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-commerce-024-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-commerce-024-soft:light-dark(oklch(0.975 0.004 265),oklch(0.27 0.01 265));
--vibeui-commerce-024-accent:light-dark(oklch(0.55 0.2 262),oklch(0.73 0.16 262));
--vibeui-commerce-024-love:light-dark(oklch(0.6 0.2 15),oklch(0.68 0.19 15));
--vibeui-commerce-024-ok:light-dark(oklch(0.55 0.14 152),oklch(0.75 0.14 152));
--vibeui-commerce-024-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-024"]{
box-sizing:border-box;
background:var(--vibeui-commerce-024-bg);
font-family:var(--vibeui-commerce-024-sans);color:var(--vibeui-commerce-024-fg);
}
[data-vibeui-block="commerce-024"] *{box-sizing:border-box}
[data-vibeui-block="commerce-024"] [data-part="shell"]{padding:1rem;max-width:60rem;margin:0 auto}
[data-vibeui-block="commerce-024"] [data-part="top"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.5rem;margin-bottom:0.75rem}
[data-vibeui-block="commerce-024"] h2{margin:0;font-size:1.125rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-024"] [data-part="count"]{font-size:0.75rem;color:var(--vibeui-commerce-024-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-024"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.75rem;grid-template-columns:1fr}
@container (min-width: 32rem){
[data-vibeui-block="commerce-024"] ul{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (min-width: 52rem){
[data-vibeui-block="commerce-024"] ul{grid-template-columns:repeat(3,minmax(0,1fr))}
}
[data-vibeui-block="commerce-024"] [data-part="card"]{
position:relative;display:flex;flex-direction:column;
border:1px solid var(--vibeui-commerce-024-border);border-radius:0.875rem;overflow:hidden;
}
[data-vibeui-block="commerce-024"] [data-part="cover"]{
aspect-ratio:4/3;
background:linear-gradient(150deg,oklch(0.94 0.05 var(--vibeui-commerce-024-hue,262)),oklch(0.86 0.09 var(--vibeui-commerce-024-hue,262)));
}
/* Сердце — кнопка удаления, поэтому у него собственная подпись с именем товара. */
[data-vibeui-block="commerce-024"] [data-part="heart"]{
position:absolute;top:0.5rem;right:0.5rem;z-index:1;
appearance:none;border:0;cursor:pointer;width:2rem;height:2rem;border-radius:9999px;
background:oklch(1 0 0 / 88%);color:var(--vibeui-commerce-024-love);font-size:0.875rem;line-height:1;
}
[data-vibeui-block="commerce-024"] [data-part="heart"]:focus-visible{outline:2px solid var(--vibeui-commerce-024-accent);outline-offset:2px}
[data-vibeui-block="commerce-024"] [data-part="body"]{padding:0.625rem;display:flex;flex-direction:column;gap:0.25rem;flex:1}
[data-vibeui-block="commerce-024"] h3{margin:0;font-size:0.8125rem;font-weight:650;line-height:1.3}
[data-vibeui-block="commerce-024"] [data-part="prices"]{display:flex;align-items:baseline;gap:0.375rem;margin:0}
[data-vibeui-block="commerce-024"] [data-part="now"]{font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-024"] [data-part="was"]{font-size:0.6875rem;color:var(--vibeui-commerce-024-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-024"] [data-part="drop"]{
margin:0;font-size:0.6875rem;font-weight:700;color:var(--vibeui-commerce-024-ok);
}
[data-vibeui-block="commerce-024"] [data-part="stock"]{margin:0;font-size:0.6875rem;color:var(--vibeui-commerce-024-muted)}
[data-vibeui-block="commerce-024"] [data-part="add"]{
margin-top:auto;appearance:none;border:0;cursor:pointer;height:2.25rem;border-radius:0.625rem;
background:var(--vibeui-commerce-024-fg);color:var(--vibeui-commerce-024-paper);font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="commerce-024"] [data-part="add"]:disabled{
background:var(--vibeui-commerce-024-soft);color:var(--vibeui-commerce-024-muted);cursor:not-allowed;
}
[data-vibeui-block="commerce-024"] [data-part="add"]:focus-visible{outline:2px solid var(--vibeui-commerce-024-accent);outline-offset:2px}
/* Строка отмены: сердце нажимают случайно, а список из головы не восстановить. */
[data-vibeui-block="commerce-024"] [data-part="undo"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;margin:0 0 0.75rem;
padding:0.5rem 0.75rem;border-radius:0.75rem;
border:1px solid var(--vibeui-commerce-024-border);background:var(--vibeui-commerce-024-soft);
font-size:0.75rem;
}
[data-vibeui-block="commerce-024"] [data-part="back"]{
appearance:none;border:0;background:none;cursor:pointer;padding:0;margin-left:auto;
color:var(--vibeui-commerce-024-accent);font:inherit;font-size:0.75rem;font-weight:650;text-decoration:underline;
}
[data-vibeui-block="commerce-024"] [data-part="back"]:focus-visible{outline:2px solid var(--vibeui-commerce-024-accent);outline-offset:2px}
[data-vibeui-block="commerce-024"] [data-part="empty"]{
margin:0;padding:2rem 1rem;text-align:center;border-radius:0.875rem;
border:1px dashed var(--vibeui-commerce-024-border);
font-size:0.8125rem;color:var(--vibeui-commerce-024-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-024"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Commerce024Item[] = [
  {
    id: "1",
    title: "Кресло «Хмарь», песочный",
    price: "34 900 ₽",
    old: "38 900 ₽",
    drop: "Подешевело на 4 000 ₽ с 3 марта",
    stock: "in",
    hue: 75,
  },
  {
    id: "2",
    title: "Торшер «Сумерки»",
    price: "16 200 ₽",
    stock: "low",
    hue: 150,
  },
  {
    id: "3",
    title: "Ковёр «Туман», 200 × 300",
    price: "27 600 ₽",
    stock: "out",
    hue: 262,
  },
]

const STOCK: Record<string, string> = {
  in: "В наличии, доставим завтра",
  low: "Осталось меньше трёх штук",
  out: "Нет в наличии — сообщим, когда вернётся",
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

/**
 * Избранное как список ожидания: падение цены и возврат в продажу — словами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce024({
  title = "Избранное",
  items = DEFAULT_ITEMS,
  cta = "В корзину",
  empty = "Здесь пусто. Нажмите сердце на карточке товара — сообщим, когда он подешевеет.",
  countText = "{count} товара",
  removedText = "«{title}» убран из избранного",
  undoCta = "Вернуть",
  removeText = "Убрать «{title}» из избранного",
  stockText = STOCK,
  outCta = "Нет в наличии",
  accent,
  love,
  background = "",
  className,
  style,
}: Commerce024Props) {
  const [list, setList] = useState(items)
  const [removed, setRemoved] = useState<Commerce024Item | null>(null)

  const drop = (item: Commerce024Item) => {
    setList((current) => current.filter((entry) => entry.id !== item.id))
    setRemoved(item)
  }

  const palette = {
    ...(accent ? { "--vibeui-commerce-024-accent": accent } : null),
    ...(love ? { "--vibeui-commerce-024-love": love } : null),
    ...(background
      ? {
          "--vibeui-commerce-024-bg": background,
          "--vibeui-commerce-024-paper": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-024" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-024"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="top">
            <h2>{title}</h2>
            <span data-part="count">
              {countText.replace("{count}", String(list.length))}
            </span>
          </div>

          {removed ? (
            <p data-part="undo" aria-live="polite">
              {removedText.replace("{title}", removed.title)}
              <button
                type="button"
                data-part="back"
                onClick={() => {
                  setList((current) => [removed, ...current])
                  setRemoved(null)
                }}
              >
                {undoCta}
              </button>
            </p>
          ) : null}

          {list.length === 0 ? (
            <p data-part="empty">{empty}</p>
          ) : (
            <ul>
              {list.map((item) => (
                <li
                  key={item.id}
                  data-part="card"
                  style={
                    {
                      "--vibeui-commerce-024-hue": item.hue ?? 262,
                    } as CSSProperties
                  }
                >
                  <button
                    type="button"
                    data-part="heart"
                    aria-label={removeText.replace("{title}", item.title)}
                    onClick={() => drop(item)}
                  >
                    ♥
                  </button>
                  <span data-part="cover" aria-hidden="true" />
                  <div data-part="body">
                    <h3>{item.title}</h3>
                    <p data-part="prices">
                      <span data-part="now">{item.price}</span>
                      {item.old ? <s data-part="was">{item.old}</s> : null}
                    </p>
                    {item.drop ? <p data-part="drop">{item.drop}</p> : null}
                    <p data-part="stock">
                      {stockText[item.stock] ?? STOCK[item.stock]}
                    </p>
                    <button
                      type="button"
                      data-part="add"
                      disabled={item.stock === "out"}
                    >
                      {item.stock === "out" ? outCta : cta}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
