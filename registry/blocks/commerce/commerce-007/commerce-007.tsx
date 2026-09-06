import type { CSSProperties } from "react"

export type Commerce007Product = {
  id: string
  title: string
  spec: string
  price: number
  old?: number
  rating: number
  votes: number
  hue?: number
  badge?: string
}

export type Commerce007Props = {
  title?: string
  crumbs?: string[]
  chips?: string[]
  sorts?: string[]
  products?: Commerce007Product[]
  found?: number
  more?: string
  /** Подписи блока: компонент несёт русские, проект подставляет свои. */
  labels?: Record<string, string>
  /** Шаблон цены: {value} — отформатированное число. */
  priceText?: string
  /** Локаль форматирования цен. */
  locale?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: витрина категории, где сортировка и число найденного стоят в
// одной строке с заголовком. Число найденного — не украшение: без него
// сортировка и фильтры выглядят так, будто ничего не изменилось. Сортировка
// сделана нативным select: он открывается на телефоне системным списком и
// работает с клавиатуры без единой строки JS.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// по умолчанию нет, он лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="commerce-007"]){
--vibeui-commerce-007-bg:transparent;
--vibeui-commerce-007-card:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-commerce-007-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-commerce-007-muted:light-dark(oklch(0.55 0 265),oklch(0.72 0 265));
--vibeui-commerce-007-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-commerce-007-soft:light-dark(oklch(0.97 0 265),oklch(0.29 0 265));
--vibeui-commerce-007-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-commerce-007-sale:light-dark(oklch(0.58 0.19 22),oklch(0.7 0.17 22));
--vibeui-commerce-007-on-sale:light-dark(oklch(1 0 0),oklch(0.19 0.02 22));
--vibeui-commerce-007-star:light-dark(oklch(0.72 0.16 75),oklch(0.82 0.15 75));
--vibeui-commerce-007-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-007"]{color-scheme:dark}
[data-vibeui-block="commerce-007"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-commerce-007-bg);
font-family:var(--vibeui-commerce-007-sans);color:var(--vibeui-commerce-007-fg);
}
[data-vibeui-block="commerce-007"] *{box-sizing:border-box}
[data-vibeui-block="commerce-007"] [data-part="vh"]{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
[data-vibeui-block="commerce-007"] [data-part="shell"]{padding:1rem;max-width:76rem;margin:0 auto}
[data-vibeui-block="commerce-007"] [data-part="crumbs"]{
display:flex;flex-wrap:wrap;gap:0.375rem;margin:0 0 0.5rem;padding:0;list-style:none;
font-size:0.6875rem;color:var(--vibeui-commerce-007-muted);
}
[data-vibeui-block="commerce-007"] [data-part="crumbs"] li+li::before{content:"/";margin-right:0.375rem}
[data-vibeui-block="commerce-007"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.5rem 0.75rem;margin-bottom:0.75rem;
}
[data-vibeui-block="commerce-007"] h2{margin:0;font-size:1.25rem;font-weight:700;letter-spacing:-0.02em}
/* Число найденного рядом с сортировкой: иначе смена порядка выглядит как ничего. */
[data-vibeui-block="commerce-007"] [data-part="found"]{font-size:0.75rem;color:var(--vibeui-commerce-007-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-007"] [data-part="sort"]{display:flex;align-items:center;gap:0.375rem;margin-left:auto;font-size:0.75rem;color:var(--vibeui-commerce-007-muted)}
[data-vibeui-block="commerce-007"] select{
appearance:none;font:inherit;font-size:0.75rem;font-weight:600;color:inherit;
padding:0.375rem 1.5rem 0.375rem 0.5rem;border-radius:0.5rem;
border:1px solid var(--vibeui-commerce-007-border);background:var(--vibeui-commerce-007-card);
background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);
background-position:calc(100% - 0.75rem) 55%,calc(100% - 0.5rem) 55%;
background-size:0.25rem 0.25rem,0.25rem 0.25rem;background-repeat:no-repeat;
}
[data-vibeui-block="commerce-007"] select:focus-visible{outline:2px solid var(--vibeui-commerce-007-accent);outline-offset:2px}
[data-vibeui-block="commerce-007"] [data-part="chips"]{display:flex;flex-wrap:wrap;gap:0.375rem;margin:0 0 0.875rem;padding:0;list-style:none}
[data-vibeui-block="commerce-007"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.25rem 0.5rem;border-radius:9999px;font-size:0.6875rem;
background:var(--vibeui-commerce-007-soft);border:1px solid var(--vibeui-commerce-007-border);
}
[data-vibeui-block="commerce-007"] [data-part="chip"] button{
appearance:none;border:0;background:none;cursor:pointer;padding:0;color:var(--vibeui-commerce-007-muted);font:inherit;line-height:1;
}
[data-vibeui-block="commerce-007"] [data-part="chip"] button:focus-visible{outline:2px solid var(--vibeui-commerce-007-accent);outline-offset:2px}
[data-vibeui-block="commerce-007"] [data-part="grid"]{
list-style:none;margin:0;padding:0;display:grid;gap:0.75rem;grid-template-columns:repeat(2,minmax(0,1fr));
}
@container (min-width: 34rem){
[data-vibeui-block="commerce-007"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@container (min-width: 58rem){
[data-vibeui-block="commerce-007"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr))}
}
[data-vibeui-block="commerce-007"] [data-part="card"]{
position:relative;display:flex;flex-direction:column;
border:1px solid var(--vibeui-commerce-007-border);border-radius:0.875rem;overflow:hidden;
background:var(--vibeui-commerce-007-card);
}
[data-vibeui-block="commerce-007"] [data-part="card"]:has(a:focus-visible){outline:2px solid var(--vibeui-commerce-007-accent);outline-offset:2px}
[data-vibeui-block="commerce-007"] [data-part="cover"]{
aspect-ratio:4/3;
background:linear-gradient(150deg,light-dark(oklch(0.93 0.06 var(--vibeui-commerce-007-hue,262)),oklch(0.42 0.07 var(--vibeui-commerce-007-hue,262))),light-dark(oklch(0.86 0.09 var(--vibeui-commerce-007-hue,262)),oklch(0.32 0.06 var(--vibeui-commerce-007-hue,262))));
}
[data-vibeui-block="commerce-007"] [data-part="badge"]{
position:absolute;top:0.5rem;left:0.5rem;z-index:1;
padding:0.125rem 0.375rem;border-radius:0.375rem;
background:var(--vibeui-commerce-007-sale);color:var(--vibeui-commerce-007-on-sale);
font-size:0.625rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="commerce-007"] [data-part="body"]{padding:0.625rem;display:flex;flex-direction:column;gap:0.25rem;flex:1}
[data-vibeui-block="commerce-007"] h3{margin:0;font-size:0.8125rem;font-weight:600;line-height:1.3}
[data-vibeui-block="commerce-007"] h3 a{color:inherit;text-decoration:none;outline:none}
[data-vibeui-block="commerce-007"] h3 a::after{content:"";position:absolute;inset:0}
[data-vibeui-block="commerce-007"] [data-part="spec"]{margin:0;font-size:0.6875rem;color:var(--vibeui-commerce-007-muted);line-height:1.35}
[data-vibeui-block="commerce-007"] [data-part="rate"]{
margin:0;font-size:0.6875rem;color:var(--vibeui-commerce-007-muted);
display:flex;align-items:center;gap:0.25rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="commerce-007"] [data-part="stars"]{color:var(--vibeui-commerce-007-star);letter-spacing:0.06em}
[data-vibeui-block="commerce-007"] [data-part="prices"]{margin-top:auto;padding-top:0.375rem;display:flex;align-items:baseline;gap:0.375rem}
[data-vibeui-block="commerce-007"] [data-part="now"]{font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-007"] [data-part="was"]{font-size:0.6875rem;color:var(--vibeui-commerce-007-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-007"] [data-part="foot"]{
display:flex;flex-direction:column;align-items:center;gap:0.375rem;margin-top:1rem;
}
[data-vibeui-block="commerce-007"] [data-part="more"]{
appearance:none;cursor:pointer;height:2.375rem;padding:0 1.25rem;
border:1px solid var(--vibeui-commerce-007-border);border-radius:0.625rem;
background:var(--vibeui-commerce-007-card);color:inherit;font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="commerce-007"] [data-part="more"]:focus-visible{outline:2px solid var(--vibeui-commerce-007-accent);outline-offset:2px}
[data-vibeui-block="commerce-007"] [data-part="shown"]{margin:0;font-size:0.6875rem;color:var(--vibeui-commerce-007-muted);font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PRODUCTS: Commerce007Product[] = [
  {
    id: "1",
    title: "Кресло «Хмарь»",
    spec: "Дуб, шерсть, каркас 12 лет",
    price: 38900,
    old: 44900,
    rating: 4.8,
    votes: 213,
    hue: 262,
    badge: "−13%",
  },
  {
    id: "2",
    title: "Лампа «Луч»",
    spec: "Тёплый свет, диммер",
    price: 4900,
    rating: 4.6,
    votes: 88,
    hue: 75,
  },
  {
    id: "3",
    title: "Стол «Полдень»",
    spec: "Ясень, 140 × 80 см",
    price: 52400,
    rating: 4.9,
    votes: 41,
    hue: 150,
  },
  {
    id: "4",
    title: "Ковёр «Туман»",
    spec: "Шерсть, 200 × 300 см",
    price: 27600,
    old: 31000,
    rating: 4.4,
    votes: 156,
    hue: 20,
    badge: "−11%",
  },
]

/** Русские подписи по умолчанию: установленный файл не меняет язык сам. */
const LABELS: Record<string, string> = {
  found: "{count} товаров",
  sort: "Сортировка",
  filters: "Выбранные фильтры",
  removeFilter: "Снять фильтр «{chip}»",
  votes: "{count} оценок",
  oldPrice: "Старая цена",
  shown: "Показано {shown} из {found}",
}

function stars(rating: number) {
  return "★★★★★".slice(0, Math.round(rating)).padEnd(5, "☆")
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
 * Витрина категории: сортировка и число найденного в одной строке с заголовком.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce007({
  title = "Мебель для гостиной",
  crumbs = ["Каталог", "Дом", "Гостиная"],
  chips = ["Дерево", "До 60 000 ₽", "В наличии"],
  sorts = [
    "Сначала популярные",
    "Сначала дешёвые",
    "Сначала новые",
    "По оценке",
  ],
  products = DEFAULT_PRODUCTS,
  found = 128,
  more = "Показать ещё",
  labels = LABELS,
  priceText = "{value} ₽",
  locale = "ru-RU",
  accent,
  background = "",
  className,
  style,
}: Commerce007Props) {
  const text = { ...LABELS, ...labels }
  const money = (value: number) =>
    priceText.replace("{value}", value.toLocaleString(locale))

  const palette = {
    ...(accent ? { "--vibeui-commerce-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-007" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-007"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <ol data-part="crumbs">
            {crumbs.map((crumb) => (
              <li key={crumb}>{crumb}</li>
            ))}
          </ol>

          <div data-part="bar">
            <h2>{title}</h2>
            <span data-part="found">
              {text.found.replace("{count}", String(found))}
            </span>
            <span data-part="sort">
              <label htmlFor="commerce-007-sort">{text.sort}</label>
              <select id="commerce-007-sort" defaultValue={sorts[0]}>
                {sorts.map((sort) => (
                  <option key={sort}>{sort}</option>
                ))}
              </select>
            </span>
          </div>

          {chips.length > 0 ? (
            <ul data-part="chips" aria-label={text.filters}>
              {chips.map((chip) => (
                <li key={chip} data-part="chip">
                  {chip}
                  <button
                    type="button"
                    aria-label={text.removeFilter.replace("{chip}", chip)}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          <ul data-part="grid">
            {products.map((product) => (
              <li
                key={product.id}
                data-part="card"
                style={
                  {
                    "--vibeui-commerce-007-hue": product.hue ?? 262,
                  } as CSSProperties
                }
              >
                {product.badge ? (
                  <span data-part="badge">{product.badge}</span>
                ) : null}
                <span data-part="cover" aria-hidden="true" />
                <div data-part="body">
                  <h3>
                    <a href="#product">{product.title}</a>
                  </h3>
                  <p data-part="spec">{product.spec}</p>
                  <p data-part="rate">
                    <span data-part="stars" aria-hidden="true">
                      {stars(product.rating)}
                    </span>
                    {product.rating} ·{" "}
                    {text.votes.replace("{count}", String(product.votes))}
                  </p>
                  <p data-part="prices">
                    <span data-part="now">{money(product.price)}</span>
                    {product.old ? (
                      <s data-part="was">
                        <span data-part="vh">{text.oldPrice} </span>
                        {money(product.old)}
                      </s>
                    ) : null}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div data-part="foot">
            <button type="button" data-part="more">
              {more}
            </button>
            <p data-part="shown">
              {text.shown
                .replace("{shown}", String(products.length))
                .replace("{found}", String(found))}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
