"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Commerce003Line = {
  id: string
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  title: string
  option?: string
  price: number
  count: number
  hue?: number
}

export type Commerce003Props = {
  title?: string
  lines?: Commerce003Line[]
  shipping?: number
  freeFrom?: number
  cta?: string
  /** Подписи корзины: компонент несёт русские, проект подставляет свои. */
  labels?: Record<string, string>
  /** Шаблон суммы: {value} — отформатированное число. */
  priceText?: string
  /** Локаль форматирования сумм. */
  locale?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: корзина, где итог считается из строк, а не приходит числом:
// иначе после изменения количества сумма начинает врать. Строка «до бесплатной
// доставки» — не украшение, а причина добрать товар, поэтому она стоит над
// кнопкой и исчезает, когда порог пройден. Удаление названо товаром, а не
// «удалить»: без имени в списке из пяти строк непонятно, что именно уйдёт.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// по умолчанию нет, он лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="commerce-003"]){
--vibeui-commerce-003-bg:transparent;
--vibeui-commerce-003-panel:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-commerce-003-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-commerce-003-muted:light-dark(oklch(0.55 0 265),oklch(0.71 0 265));
--vibeui-commerce-003-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-commerce-003-track:light-dark(oklch(0.94 0 265),oklch(0.32 0 265));
--vibeui-commerce-003-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.72 0.17 39.8));
--vibeui-commerce-003-on-accent:oklch(0.15 0.02 39.8);
--vibeui-commerce-003-ok:light-dark(oklch(0.58 0.14 152),oklch(0.76 0.14 152));
--vibeui-commerce-003-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-003"]{color-scheme:dark}
[data-vibeui-block="commerce-003"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;padding:1rem;
background:var(--vibeui-commerce-003-bg);
font-family:var(--vibeui-commerce-003-sans);color:var(--vibeui-commerce-003-fg);
}
[data-vibeui-block="commerce-003"] *{box-sizing:border-box}
[data-vibeui-block="commerce-003"] h2{margin:0 0 0.75rem;font-size:1.0625rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="commerce-003"] [data-part="layout"]{display:grid;grid-template-columns:1fr;gap:1rem;align-items:start}
@container (min-width: 42rem){
[data-vibeui-block="commerce-003"] [data-part="layout"]{grid-template-columns:1fr 16rem}
}
[data-vibeui-block="commerce-003"] ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="commerce-003"] [data-part="line"]{
display:grid;grid-template-columns:3rem 1fr auto;gap:0.625rem;align-items:center;
padding:0.5rem;border-radius:0.75rem;
border:1px solid var(--vibeui-commerce-003-border);
}
[data-vibeui-block="commerce-003"] [data-part="shot"]{
position:relative;width:3rem;height:3rem;border-radius:0.5rem;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="commerce-003"] [data-part="shot"][data-empty="true"]{background:light-dark(oklch(0.94 0.05 var(--vibeui-commerce-003-hue,262)),oklch(0.4 0.06 var(--vibeui-commerce-003-hue,262)));}
[data-vibeui-block="commerce-003"] [data-part="shot"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="commerce-003"] [data-part="name"]{margin:0;font-size:0.8125rem;font-weight:600;line-height:1.3}
[data-vibeui-block="commerce-003"] [data-part="option"]{margin:0.0625rem 0 0;font-size:0.6875rem;color:var(--vibeui-commerce-003-muted)}
[data-vibeui-block="commerce-003"] [data-part="right"]{display:flex;flex-direction:column;align-items:flex-end;gap:0.375rem}
[data-vibeui-block="commerce-003"] [data-part="sum"]{font-size:0.875rem;font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-003"] [data-part="count"]{
display:inline-flex;align-items:center;
border:1px solid var(--vibeui-commerce-003-border);border-radius:0.5rem;overflow:hidden;
}
[data-vibeui-block="commerce-003"] [data-part="count"] button{
appearance:none;border:0;background:none;cursor:pointer;
width:1.75rem;height:1.75rem;color:inherit;font:inherit;font-size:0.875rem;line-height:1;
}
[data-vibeui-block="commerce-003"] [data-part="count"] button:disabled{color:var(--vibeui-commerce-003-muted);opacity:.5;cursor:default}
[data-vibeui-block="commerce-003"] [data-part="count"] button:focus-visible{outline:2px solid var(--vibeui-commerce-003-accent);outline-offset:-2px}
[data-vibeui-block="commerce-003"] [data-part="value"]{
min-width:1.5rem;text-align:center;font-size:0.75rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="commerce-003"] [data-part="drop"]{
appearance:none;border:0;background:none;cursor:pointer;
padding:0;color:var(--vibeui-commerce-003-muted);font:inherit;font-size:0.6875rem;text-decoration:underline;
}
[data-vibeui-block="commerce-003"] [data-part="drop"]:focus-visible{outline:2px solid var(--vibeui-commerce-003-accent);outline-offset:2px}
[data-vibeui-block="commerce-003"] [data-part="total"]{
padding:0.875rem;border-radius:0.875rem;
border:1px solid var(--vibeui-commerce-003-border);
background:var(--vibeui-commerce-003-panel);
}
[data-vibeui-block="commerce-003"] dl{display:grid;grid-template-columns:1fr auto;gap:0.375rem 0.75rem;margin:0 0 0.625rem;font-size:0.8125rem}
[data-vibeui-block="commerce-003"] dt{color:var(--vibeui-commerce-003-muted)}
[data-vibeui-block="commerce-003"] dd{margin:0;text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-003"] [data-part="grand"]{font-size:1.125rem;font-weight:700}
/* Полоса до бесплатной доставки — причина добрать, а не украшение. */
[data-vibeui-block="commerce-003"] [data-part="free"]{margin:0 0 0.625rem;font-size:0.6875rem;color:var(--vibeui-commerce-003-muted)}
[data-vibeui-block="commerce-003"] [data-part="track"]{
height:0.3125rem;margin-top:0.25rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-commerce-003-track);
}
[data-vibeui-block="commerce-003"] [data-part="fill"]{
display:block;height:100%;border-radius:9999px;
width:var(--vibeui-commerce-003-progress,0%);
background:var(--vibeui-commerce-003-ok);
}
[data-vibeui-block="commerce-003"] [data-part="pay"]{
width:100%;appearance:none;cursor:pointer;height:2.5rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-commerce-003-accent);color:var(--vibeui-commerce-003-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="commerce-003"] [data-part="pay"]:focus-visible{outline:2px solid var(--vibeui-commerce-003-accent);outline-offset:2px}
[data-vibeui-block="commerce-003"] [data-part="empty"]{
margin:0;padding:1.25rem 0;font-size:0.8125rem;color:var(--vibeui-commerce-003-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINES: Commerce003Line[] = [
  {
    id: "1",
    title: "Свитшот «Тихий вечер»",
    option: "Размер M, серый",
    price: 5400,
    count: 1,
    hue: 262,
  },
  {
    id: "2",
    title: "Настольная лампа «Луч»",
    option: "Тёплый свет",
    price: 4900,
    count: 2,
    hue: 75,
  },
]

/** Русские подписи по умолчанию: установленный файл не меняет язык сам. */
const LABELS: Record<string, string> = {
  goods: "Товары",
  shipping: "Доставка",
  free: "бесплатно",
  total: "Итого",
  less: "Меньше: {title}",
  more: "Больше: {title}",
  remove: "Убрать «{title}»",
  freeLeft: "До бесплатной доставки {sum}",
  empty: "Корзина пуста. Товары из каталога появятся здесь.",
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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
 * Корзина: итог считается из строк, полоса до бесплатной доставки над кнопкой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce003({
  title = "Корзина",
  lines = DEFAULT_LINES,
  shipping = 490,
  freeFrom = 15000,
  cta = "Оформить заказ",
  labels = LABELS,
  priceText = "{value} ₽",
  locale = "ru-RU",
  accent,
  background = "",
  className,
  style,
}: Commerce003Props) {
  const [cart, setCart] = useState(lines)
  const text = { ...LABELS, ...labels }
  const money = (value: number) =>
    priceText.replace("{value}", value.toLocaleString(locale))

  // Итог считается из строк: отдельное число врёт после первой правки.
  const goods = cart.reduce((sum, line) => sum + line.price * line.count, 0)
  const free = goods >= freeFrom
  const delivery = free ? 0 : shipping
  const left = Math.max(freeFrom - goods, 0)
  const progress = `${Math.min(100, (goods / freeFrom) * 100)}%`

  const setCount = (id: string, delta: number) =>
    setCart((current) =>
      current.map((line) =>
        line.id === id
          ? { ...line, count: Math.max(1, line.count + delta) }
          : line,
      ),
    )

  const palette = {
    "--vibeui-commerce-003-progress": progress,
    ...(accent ? { "--vibeui-commerce-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-003"
        className={className}
        style={palette}
        aria-label={title}
      >
        <h2>
          {title} · {cart.length}
        </h2>
        <div data-part="layout">
          <div>
            {cart.length === 0 ? (
              <p data-part="empty">{text.empty}</p>
            ) : (
              <ul>
                {cart.map((line) => (
                  <li key={line.id} data-part="line">
                    <span
                      data-part="shot"
                      data-empty={line.image ? undefined : "true"}
                      aria-hidden="true"
                      style={
                        {
                          "--vibeui-commerce-003-hue": line.hue ?? 262,
                        } as CSSProperties
                      }
                    >
                      {line.image ? (
                        <img
                          src={line.image}
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                      ) : null}
                    </span>
                    <div>
                      <p data-part="name">{line.title}</p>
                      {line.option ? (
                        <p data-part="option">{line.option}</p>
                      ) : null}
                    </div>
                    <div data-part="right">
                      <span data-part="sum">
                        {money(line.price * line.count)}
                      </span>
                      <span data-part="count">
                        <button
                          type="button"
                          disabled={line.count <= 1}
                          aria-label={text.less.replace("{title}", line.title)}
                          onClick={() => setCount(line.id, -1)}
                        >
                          −
                        </button>
                        <span data-part="value">{line.count}</span>
                        <button
                          type="button"
                          aria-label={text.more.replace("{title}", line.title)}
                          onClick={() => setCount(line.id, 1)}
                        >
                          +
                        </button>
                      </span>
                      <button
                        type="button"
                        data-part="drop"
                        onClick={() =>
                          setCart((current) =>
                            current.filter((item) => item.id !== line.id),
                          )
                        }
                      >
                        {text.remove.replace("{title}", line.title)}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div data-part="total">
            <dl>
              <dt>{text.goods}</dt>
              <dd>{money(goods)}</dd>
              <dt>{text.shipping}</dt>
              <dd>{free ? text.free : money(delivery)}</dd>
              <dt data-part="grand">{text.total}</dt>
              <dd data-part="grand">{money(goods + delivery)}</dd>
            </dl>
            {!free ? (
              <p data-part="free">
                {text.freeLeft.replace("{sum}", money(left))}
                <span data-part="track" aria-hidden="true">
                  <span data-part="fill" />
                </span>
              </p>
            ) : null}
            <button type="button" data-part="pay">
              {cta}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
