import type { CSSProperties } from "react"

export type Commerce013Order = {
  id: string
  date: string
  status: "way" | "done" | "cancel" | "wait"
  statusLabel: string
  total: string
  items: string[]
  hues?: number[]
  action: string
}

export type Commerce013Props = {
  title?: string
  tabs?: string[]
  orders?: Commerce013Order[]
  empty?: string
  /** Скрытая подпись группы фильтра. */
  filterLabel?: string
  /** Шаблон номера заказа, {id} — номер. */
  orderText?: string
  /** Шаблон даты заказа, {date} — дата. */
  dateText?: string
  /** Шаблон ссылки на детали, {id} — номер заказа. */
  detailsText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: список заказов, где у каждой строки одно главное действие.
// «Повторить», «Отследить» и «Оставить отзыв» — разные вещи в разных
// состояниях заказа, и показывать все три сразу значит не показывать ни одной.
// Статус подписан словом рядом с цветной точкой, а состав заказа свёрнут в
// стопку миниатюр с числом остатка: список остаётся списком, а не витриной.
const STYLES = `
:where([data-vibeui-block="commerce-013"]){
--vibeui-commerce-013-bg:transparent;
--vibeui-commerce-013-paper:light-dark(oklch(1 0 0),oklch(0.2 0.012 265));
--vibeui-commerce-013-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-commerce-013-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-commerce-013-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-commerce-013-soft:light-dark(oklch(0.975 0.004 265),oklch(0.27 0.01 265));
--vibeui-commerce-013-accent:light-dark(oklch(0.55 0.2 262),oklch(0.73 0.16 262));
--vibeui-commerce-013-ok:light-dark(oklch(0.58 0.14 152),oklch(0.75 0.14 152));
--vibeui-commerce-013-warn:light-dark(oklch(0.7 0.15 75),oklch(0.81 0.14 75));
--vibeui-commerce-013-off:light-dark(oklch(0.62 0.02 265),oklch(0.62 0.02 265));
--vibeui-commerce-013-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-013"]{
box-sizing:border-box;
background:var(--vibeui-commerce-013-bg);
font-family:var(--vibeui-commerce-013-sans);color:var(--vibeui-commerce-013-fg);
}
[data-vibeui-block="commerce-013"] *{box-sizing:border-box}
[data-vibeui-block="commerce-013"] [data-part="shell"]{padding:1rem;max-width:58rem;margin:0 auto}
[data-vibeui-block="commerce-013"] h2{margin:0 0 0.75rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-013"] [data-part="tabs"]{display:flex;flex-wrap:wrap;gap:0.375rem;margin:0 0 0.875rem;padding:0;border:0}
[data-vibeui-block="commerce-013"] [data-part="vh"]{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
[data-vibeui-block="commerce-013"] [data-part="tab"]{
cursor:pointer;padding:0.3125rem 0.75rem;border-radius:9999px;font-size:0.75rem;font-weight:600;
border:1px solid var(--vibeui-commerce-013-border);color:var(--vibeui-commerce-013-muted);
}
[data-vibeui-block="commerce-013"] [data-part="tab"] input{position:absolute;width:1px;height:1px;opacity:0;margin:0}
[data-vibeui-block="commerce-013"] [data-part="tab"]:has(input:checked){
background:var(--vibeui-commerce-013-fg);border-color:var(--vibeui-commerce-013-fg);color:var(--vibeui-commerce-013-paper);
}
[data-vibeui-block="commerce-013"] [data-part="tab"]:has(input:focus-visible){outline:2px solid var(--vibeui-commerce-013-accent);outline-offset:2px}
[data-vibeui-block="commerce-013"] ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.625rem}
[data-vibeui-block="commerce-013"] [data-part="order"]{
padding:0.75rem;border-radius:1rem;border:1px solid var(--vibeui-commerce-013-border);
display:grid;gap:0.625rem;grid-template-columns:1fr;
}
@container (min-width: 38rem){
[data-vibeui-block="commerce-013"] [data-part="order"]{grid-template-columns:minmax(0,1fr) auto;align-items:center}
[data-vibeui-block="commerce-013"] [data-part="side"]{text-align:right}
}
[data-vibeui-block="commerce-013"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem 0.625rem;margin-bottom:0.5rem}
[data-vibeui-block="commerce-013"] [data-part="num"]{font-size:0.8125rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-013"] [data-part="date"]{font-size:0.6875rem;color:var(--vibeui-commerce-013-muted)}
/* Статус словом рядом с точкой: цвет один статус не называет. */
[data-vibeui-block="commerce-013"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.375rem;font-size:0.6875rem;font-weight:650;
}
[data-vibeui-block="commerce-013"] [data-part="status"] i{width:0.5rem;height:0.5rem;border-radius:9999px;background:var(--vibeui-commerce-013-off)}
[data-vibeui-block="commerce-013"] [data-status="way"] i{background:var(--vibeui-commerce-013-accent)}
[data-vibeui-block="commerce-013"] [data-status="done"] i{background:var(--vibeui-commerce-013-ok)}
[data-vibeui-block="commerce-013"] [data-status="wait"] i{background:var(--vibeui-commerce-013-warn)}
[data-vibeui-block="commerce-013"] [data-part="stack"]{display:flex;align-items:center;gap:0.25rem}
[data-vibeui-block="commerce-013"] [data-part="thumb"]{
width:2.25rem;height:2.25rem;border-radius:0.5rem;flex:none;
border:2px solid var(--vibeui-commerce-013-paper);margin-left:-0.5rem;
background:linear-gradient(145deg,oklch(0.94 0.05 var(--vibeui-commerce-013-hue,262)),oklch(0.86 0.09 var(--vibeui-commerce-013-hue,262)));
}
[data-vibeui-block="commerce-013"] [data-part="thumb"]:first-child{margin-left:0}
[data-vibeui-block="commerce-013"] [data-part="rest"]{
display:flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;border-radius:0.5rem;margin-left:-0.5rem;flex:none;
border:2px solid var(--vibeui-commerce-013-paper);background:var(--vibeui-commerce-013-soft);
font-size:0.6875rem;font-weight:700;color:var(--vibeui-commerce-013-muted);
}
[data-vibeui-block="commerce-013"] [data-part="names"]{margin:0.375rem 0 0;font-size:0.75rem;color:var(--vibeui-commerce-013-muted);line-height:1.4}
[data-vibeui-block="commerce-013"] [data-part="sum"]{display:block;font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums;margin-bottom:0.5rem}
[data-vibeui-block="commerce-013"] [data-part="do"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-commerce-013-fg);background:var(--vibeui-commerce-013-paper);
color:var(--vibeui-commerce-013-fg);font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="commerce-013"] [data-part="do"]:focus-visible{outline:2px solid var(--vibeui-commerce-013-accent);outline-offset:2px}
[data-vibeui-block="commerce-013"] [data-part="open"]{
display:block;margin-top:0.375rem;font-size:0.6875rem;color:var(--vibeui-commerce-013-muted);
background:none;border:0;padding:0;cursor:pointer;font-family:inherit;text-decoration:underline;
}
[data-vibeui-block="commerce-013"] [data-part="open"]:focus-visible{outline:2px solid var(--vibeui-commerce-013-accent);outline-offset:2px}
[data-vibeui-block="commerce-013"] [data-part="empty"]{margin:0;font-size:0.8125rem;color:var(--vibeui-commerce-013-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ORDERS: Commerce013Order[] = [
  {
    id: "2024-1187",
    date: "10 марта",
    status: "way",
    statusLabel: "В пути, будет 12 марта",
    total: "51 505 ₽",
    items: ["Кресло «Хмарь»", "Плед «Пасмурно» × 2"],
    hues: [75, 262],
    action: "Отследить",
  },
  {
    id: "2024-0942",
    date: "2 февраля",
    status: "done",
    statusLabel: "Доставлен 5 февраля",
    total: "12 300 ₽",
    items: ["Торшер «Сумерки»", "Лампочка E27", "Ковёр «Туман»"],
    hues: [150, 40, 20],
    action: "Оставить отзыв",
  },
  {
    id: "2024-0715",
    date: "18 января",
    status: "cancel",
    statusLabel: "Отменён, деньги вернулись",
    total: "4 900 ₽",
    items: ["Лампа «Луч»"],
    hues: [200],
    action: "Повторить заказ",
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
 * Список заказов покупателя: у каждой строки одно действие по её состоянию.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce013({
  title = "Мои заказы",
  tabs = ["Все", "В пути", "Доставленные", "Отменённые"],
  orders = DEFAULT_ORDERS,
  empty = "Заказов в этом разделе нет.",
  filterLabel = "Показывать",
  orderText = "Заказ № {id}",
  dateText = "от {date}",
  detailsText = "Детали заказа № {id}",
  accent,
  background = "",
  className,
  style,
}: Commerce013Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-013-bg": background,
          "--vibeui-commerce-013-paper": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-013" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-013"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>

          <fieldset data-part="tabs">
            <legend data-part="vh">{filterLabel}</legend>
            {tabs.map((tab, index) => (
              <label key={tab} data-part="tab">
                <input
                  type="radio"
                  name="commerce-013-tab"
                  defaultChecked={index === 0}
                />
                {tab}
              </label>
            ))}
          </fieldset>

          {orders.length === 0 ? (
            <p data-part="empty">{empty}</p>
          ) : (
            <ul>
              {orders.map((order) => (
                <li key={order.id} data-part="order">
                  <div>
                    <div data-part="head">
                      <span data-part="num">
                        {orderText.replace("{id}", order.id)}
                      </span>
                      <span data-part="date">
                        {dateText.replace("{date}", order.date)}
                      </span>
                      <span data-part="status" data-status={order.status}>
                        <i aria-hidden="true" />
                        {order.statusLabel}
                      </span>
                    </div>
                    <div data-part="stack">
                      {order.items.slice(0, 3).map((item, index) => (
                        <span
                          key={item}
                          data-part="thumb"
                          aria-hidden="true"
                          style={
                            {
                              "--vibeui-commerce-013-hue":
                                order.hues?.[index] ?? 262,
                            } as CSSProperties
                          }
                        />
                      ))}
                      {order.items.length > 3 ? (
                        <span data-part="rest">+{order.items.length - 3}</span>
                      ) : null}
                    </div>
                    <p data-part="names">{order.items.join(", ")}</p>
                  </div>
                  <div data-part="side">
                    <span data-part="sum">{order.total}</span>
                    <button type="button" data-part="do">
                      {order.action}
                    </button>
                    <button type="button" data-part="open">
                      {detailsText.replace("{id}", order.id)}
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
