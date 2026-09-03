import type { CSSProperties } from "react"

export type Commerce071Item = {
  id: string
  title: string
  spec: string
  price: string
  times: string
  last: string
  changed?: string
  hue?: number
}

export type Commerce071Props = {
  title?: string
  lead?: string
  items?: Commerce071Item[]
  cta?: string
  allLabel?: string
  note?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: «купить снова» из истории заказов. Повторную покупку двигает
// не картинка, а факт: сколько раз брали и когда в последний раз — по этим
// двум строкам решают, пора ли. Изменение цены с прошлого раза названо
// словами: молча подорожавший товар в один клик — верный способ получить
// возврат. Лента прокручивается с привязкой и остаётся проходимой с
// клавиатуры, потому что карточки — обычные ссылки в списке.
const STYLES = `
:where([data-vibeui-block="commerce-071"]){
--vibeui-commerce-071-bg:transparent;
--vibeui-commerce-071-fg:light-dark(oklch(0.21 0.014 130),oklch(0.94 0.007 130));
--vibeui-commerce-071-muted:light-dark(oklch(0.53 0.016 130),oklch(0.73 0.013 130));
--vibeui-commerce-071-border:light-dark(oklch(0.9 0.008 130),oklch(0.38 0.016 130));
--vibeui-commerce-071-soft:light-dark(oklch(0.972 0.006 130),oklch(0.27 0.016 130));
--vibeui-commerce-071-accent:light-dark(oklch(0.45 0.12 145),oklch(0.76 0.13 145));
--vibeui-commerce-071-onaccent:light-dark(oklch(0.99 0 0),oklch(0.2 0.04 145));
--vibeui-commerce-071-warn:light-dark(oklch(0.55 0.15 40),oklch(0.77 0.14 40));
--vibeui-commerce-071-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-071"]{color-scheme:dark}
[data-vibeui-block="commerce-071"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-071-bg);
color:var(--vibeui-commerce-071-fg);font-family:var(--vibeui-commerce-071-sans);
}
[data-vibeui-block="commerce-071"] *{box-sizing:border-box}
[data-vibeui-block="commerce-071"] [data-part="shell"]{max-width:64rem;margin:0 auto;padding:1.25rem 1rem 1.75rem}
[data-vibeui-block="commerce-071"] [data-part="top"]{display:flex;flex-wrap:wrap;gap:0.5rem;align-items:baseline;justify-content:space-between;margin-bottom:0.875rem}
[data-vibeui-block="commerce-071"] h2{margin:0;font-size:1.25rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-071"] [data-part="lead"]{margin:0.25rem 0 0;max-width:52ch;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-commerce-071-muted)}
[data-vibeui-block="commerce-071"] [data-part="all"]{
font-size:0.8125rem;font-weight:650;color:var(--vibeui-commerce-071-accent);
text-decoration:underline;text-underline-offset:2px;border-radius:0.25rem;
}
[data-vibeui-block="commerce-071"] [data-part="all"]:focus-visible,
[data-vibeui-block="commerce-071"] [data-part="add"]:focus-visible{outline:2px solid var(--vibeui-commerce-071-accent);outline-offset:2px}
[data-vibeui-block="commerce-071"] ul{
list-style:none;margin:0;padding:0 0 0.5rem;display:grid;grid-auto-flow:column;grid-auto-columns:15rem;gap:0.75rem;
overflow-x:auto;scroll-snap-type:x mandatory;overscroll-behavior-x:contain;
}
[data-vibeui-block="commerce-071"] [data-part="item"]{
position:relative;scroll-snap-align:start;border:1px solid var(--vibeui-commerce-071-border);border-radius:0.875rem;
padding:0.75rem;display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="commerce-071"] [data-part="item"]:has(a:focus-visible){outline:2px solid var(--vibeui-commerce-071-accent);outline-offset:2px}
[data-vibeui-block="commerce-071"] [data-part="head"]{display:flex;gap:0.625rem;align-items:flex-start}
[data-vibeui-block="commerce-071"] [data-part="thumb"]{
flex:none;width:3rem;height:3rem;border-radius:0.625rem;
background:linear-gradient(150deg,oklch(0.94 0.05 var(--vibeui-commerce-071-hue,145)),oklch(0.85 0.09 var(--vibeui-commerce-071-hue,145)));
}
[data-vibeui-block="commerce-071"] [data-part="name"]{margin:0;font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="commerce-071"] [data-part="name"] a{color:inherit;text-decoration:none;outline:none}
[data-vibeui-block="commerce-071"] [data-part="name"] a::after{content:"";position:absolute;inset:0}
[data-vibeui-block="commerce-071"] [data-part="spec"]{margin:0.125rem 0 0;font-size:0.6875rem;color:var(--vibeui-commerce-071-muted)}
[data-vibeui-block="commerce-071"] [data-part="facts"]{
margin:0;padding:0.4375rem 0.5rem;border-radius:0.5rem;background:var(--vibeui-commerce-071-soft);
font-size:0.6875rem;line-height:1.45;color:var(--vibeui-commerce-071-muted);
}
[data-vibeui-block="commerce-071"] [data-part="facts"] strong{color:var(--vibeui-commerce-071-fg);font-weight:700}
[data-vibeui-block="commerce-071"] [data-part="changed"]{margin:0;font-size:0.6875rem;font-weight:650;color:var(--vibeui-commerce-071-warn)}
[data-vibeui-block="commerce-071"] [data-part="bottom"]{margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:0.5rem}
[data-vibeui-block="commerce-071"] [data-part="price"]{margin:0;font-size:0.9375rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-071"] [data-part="add"]{
position:relative;z-index:1;appearance:none;border:0;cursor:pointer;height:2rem;padding:0 0.75rem;border-radius:0.5rem;
background:var(--vibeui-commerce-071-accent);color:var(--vibeui-commerce-071-onaccent);font:inherit;font-size:0.75rem;font-weight:700;
}
[data-vibeui-block="commerce-071"] [data-part="sr"]{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
[data-vibeui-block="commerce-071"] [data-part="note"]{margin:0.75rem 0 0;max-width:56ch;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-071-muted)}
@container (min-width: 44rem){
[data-vibeui-block="commerce-071"] [data-part="shell"]{padding:2rem 2rem 2.5rem}
[data-vibeui-block="commerce-071"] ul{grid-auto-columns:17rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-071"] *{animation:none!important;transition:none!important}}
`

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

const DEFAULT_ITEMS: Commerce071Item[] = [
  {
    id: "1",
    title: "Зерно «Плёс», обжарка под фильтр",
    spec: "250 г, Эфиопия",
    price: "1 690 ₽",
    times: "Брали 7 раз",
    last: "последний — 12 февраля",
    hue: 45,
  },
  {
    id: "2",
    title: "Фильтры бумажные V02",
    spec: "100 шт., отбеленные",
    price: "540 ₽",
    times: "Брали 4 раза",
    last: "последний — 3 февраля",
    hue: 200,
  },
  {
    id: "3",
    title: "Средство для промывки группы",
    spec: "500 г, без запаха",
    price: "1 240 ₽",
    times: "Брали 2 раза",
    last: "последний — 18 декабря",
    changed: "Подорожало на 190 ₽ с прошлой покупки",
    hue: 300,
  },
  {
    id: "4",
    title: "Молоко для капучино",
    spec: "1 л, ультрапастеризованное",
    price: "180 ₽",
    times: "Брали 12 раз",
    last: "последний — 28 февраля",
    hue: 150,
  },
]

/**
 * Блок «купить снова» из истории: частота и дата последней покупки видны
 * до нажатия, подорожание названо словами. Один файл, ноль зависимостей.
 */
export function Commerce071({
  title = "Купить снова",
  lead = "Собрано из ваших заказов за полгода. Порядок — по тому, как часто вы это берёте.",
  items = DEFAULT_ITEMS,
  cta = "Добавить",
  allLabel = "Все прошлые покупки",
  note = "Наличие проверяется в момент добавления: если товара нет, кнопка предложит подписку на возврат в продажу, а не пустую корзину.",
  accent,
  background = "",
  className,
  style,
}: Commerce071Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-071-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-071-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-071" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-071"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="top">
            <div>
              <h2>{title}</h2>
              <p data-part="lead">{lead}</p>
            </div>
            <a data-part="all" href="#history">
              {allLabel}
            </a>
          </div>

          <ul>
            {items.map((item) => (
              <li
                key={item.id}
                data-part="item"
                style={
                  {
                    "--vibeui-commerce-071-hue": item.hue ?? 145,
                  } as CSSProperties
                }
              >
                <div data-part="head">
                  <span data-part="thumb" aria-hidden="true" />
                  <div>
                    <p data-part="name">
                      <a href="#product">{item.title}</a>
                    </p>
                    <p data-part="spec">{item.spec}</p>
                  </div>
                </div>
                <p data-part="facts">
                  <strong>{item.times}</strong>, {item.last}
                </p>
                {item.changed ? (
                  <p data-part="changed">{item.changed}</p>
                ) : null}
                <div data-part="bottom">
                  <p data-part="price">{item.price}</p>
                  <button type="button" data-part="add">
                    {cta}
                    <span data-part="sr"> — {item.title}</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <p data-part="note">{note}</p>
        </div>
      </section>
    </>
  )
}
