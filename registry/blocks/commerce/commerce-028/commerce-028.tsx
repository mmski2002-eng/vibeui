import type { CSSProperties } from "react"

export type Commerce028Fact = {
  label: string
  value: string
}

export type Commerce028Line = {
  id: string
  title: string
  price: string
  spec: string
  hue?: number
}

export type Commerce028Props = {
  brand?: string
  tagline?: string
  about?: string
  since?: string
  facts?: Commerce028Fact[]
  follow?: string
  sections?: string[]
  gridTitle?: string
  products?: Commerce028Line[]
  /** Подпись бренда для скринридера: {brand} подставляет название. */
  brandLabel?: string
  /** Строка рядом с тэглайном: {since} подставляет год. */
  sinceText?: string
  /** Подпись навигации по разделам: {brand} подставляет название. */
  sectionsLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: страница бренда — шапка с монограммой и фактами, навигация по
// разделам бренда и сетка его товаров. Монограмма собрана из первой буквы
// названия, поэтому блок не тянет файл логотипа в чужой проект. Разделы
// сделаны настоящей навигацией со ссылками: их открывают в новой вкладке
// и по ним ходят клавиатурой.
const STYLES = `
:where([data-vibeui-block="commerce-028"]){
--vibeui-commerce-028-bg:transparent;
--vibeui-commerce-028-radius:0;
--vibeui-commerce-028-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-commerce-028-muted:light-dark(oklch(0.55 0 265),oklch(0.7 0 265));
--vibeui-commerce-028-border:light-dark(oklch(0.91 0 265),oklch(0.35 0 265));
--vibeui-commerce-028-soft:light-dark(oklch(0.975 0 265),oklch(0.27 0 265));
--vibeui-commerce-028-card:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-commerce-028-accent:light-dark(oklch(0.52 0.13 165),oklch(0.76 0.13 165));
--vibeui-commerce-028-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0.02 165));
--vibeui-commerce-028-on-fg:light-dark(oklch(1 0 0),oklch(0.18 0 265));
--vibeui-commerce-028-shadow:light-dark(oklch(0.2 0 265 / 12%),oklch(0 0 0 / 45%));
--vibeui-commerce-028-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-028"]{color-scheme:dark}
[data-vibeui-block="commerce-028"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-028-bg);
border-radius:var(--vibeui-commerce-028-radius);
color:var(--vibeui-commerce-028-fg);font-family:var(--vibeui-commerce-028-sans);
}
[data-vibeui-block="commerce-028"] *{box-sizing:border-box}
[data-vibeui-block="commerce-028"] [data-part="shell"]{max-width:68rem;margin:0 auto;padding:0 1rem 1.5rem}
[data-vibeui-block="commerce-028"] [data-part="cover"]{
height:7rem;border-radius:0 0 1.25rem 1.25rem;margin-bottom:-2.75rem;
background:linear-gradient(115deg,oklch(0.42 0.11 165),oklch(0.6 0.13 200));
}
[data-vibeui-block="commerce-028"] [data-part="head"]{
position:relative;display:grid;gap:0.875rem;padding:0 0.25rem;
}
@container (min-width: 44rem){
[data-vibeui-block="commerce-028"] [data-part="head"]{grid-template-columns:auto minmax(0,1fr) auto;align-items:end;gap:1.25rem}
}
/* Монограмма вместо файла логотипа: блок остаётся одним переносимым файлом. */
[data-vibeui-block="commerce-028"] [data-part="mark"]{
width:5rem;height:5rem;border-radius:1.25rem;display:grid;place-items:center;
background:var(--vibeui-commerce-028-card);border:1px solid var(--vibeui-commerce-028-border);
box-shadow:0 8px 24px var(--vibeui-commerce-028-shadow);
font-size:2rem;font-weight:800;letter-spacing:-0.04em;color:var(--vibeui-commerce-028-accent);
}
[data-vibeui-block="commerce-028"] h2{margin:0;font-size:1.5rem;font-weight:750;letter-spacing:-0.025em}
[data-vibeui-block="commerce-028"] [data-part="tagline"]{margin:0.1875rem 0 0;font-size:0.875rem;color:var(--vibeui-commerce-028-muted)}
[data-vibeui-block="commerce-028"] [data-part="follow"]{
appearance:none;border:0;cursor:pointer;height:2.5rem;padding:0 1.25rem;border-radius:0.75rem;
background:var(--vibeui-commerce-028-accent);color:var(--vibeui-commerce-028-on-accent);font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="commerce-028"] [data-part="follow"]:focus-visible{outline:2px solid var(--vibeui-commerce-028-accent);outline-offset:2px}
[data-vibeui-block="commerce-028"] [data-part="about"]{
margin:1.25rem 0 0;max-width:44rem;font-size:0.9375rem;line-height:1.6;color:var(--vibeui-commerce-028-muted);
}
[data-vibeui-block="commerce-028"] dl{
margin:1rem 0 0;padding:0.875rem 0;display:grid;gap:0.75rem;
grid-template-columns:repeat(2,minmax(0,1fr));
border-top:1px solid var(--vibeui-commerce-028-border);
border-bottom:1px solid var(--vibeui-commerce-028-border);
}
@container (min-width: 44rem){
[data-vibeui-block="commerce-028"] dl{grid-template-columns:repeat(4,minmax(0,1fr))}
}
[data-vibeui-block="commerce-028"] [data-part="fact"]{display:contents}
[data-vibeui-block="commerce-028"] dt{grid-row:2;font-size:0.75rem;color:var(--vibeui-commerce-028-muted)}
[data-vibeui-block="commerce-028"] dd{grid-row:1;margin:0;font-size:1.125rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-028"] nav{margin:1rem 0 0;overflow-x:auto}
[data-vibeui-block="commerce-028"] nav ul{list-style:none;margin:0;padding:0 0 0.25rem;display:flex;gap:0.375rem}
[data-vibeui-block="commerce-028"] nav a{
display:inline-block;white-space:nowrap;padding:0.4375rem 0.875rem;border-radius:9999px;
border:1px solid var(--vibeui-commerce-028-border);background:var(--vibeui-commerce-028-soft);
font-size:0.8125rem;font-weight:600;color:inherit;text-decoration:none;
}
[data-vibeui-block="commerce-028"] nav li:first-child a{
background:var(--vibeui-commerce-028-fg);border-color:var(--vibeui-commerce-028-fg);color:var(--vibeui-commerce-028-on-fg);
}
[data-vibeui-block="commerce-028"] nav a:focus-visible{outline:2px solid var(--vibeui-commerce-028-accent);outline-offset:2px}
[data-vibeui-block="commerce-028"] h3{margin:1.5rem 0 0.75rem;font-size:1rem;font-weight:700}
[data-vibeui-block="commerce-028"] [data-part="grid"]{
list-style:none;margin:0;padding:0;display:grid;gap:0.75rem;grid-template-columns:repeat(2,minmax(0,1fr));
}
@container (min-width: 36rem){
[data-vibeui-block="commerce-028"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@container (min-width: 56rem){
[data-vibeui-block="commerce-028"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr))}
}
[data-vibeui-block="commerce-028"] [data-part="card"]{
position:relative;border:1px solid var(--vibeui-commerce-028-border);border-radius:1rem;overflow:hidden;
display:flex;flex-direction:column;
}
[data-vibeui-block="commerce-028"] [data-part="card"]:has(a:focus-visible){outline:2px solid var(--vibeui-commerce-028-accent);outline-offset:2px}
[data-vibeui-block="commerce-028"] [data-part="shot"]{
aspect-ratio:4 / 3;
background:linear-gradient(150deg,oklch(0.94 0.05 var(--vibeui-commerce-028-hue,165)),oklch(0.85 0.09 var(--vibeui-commerce-028-hue,165)));
}
[data-vibeui-block="commerce-028"] [data-part="body"]{padding:0.625rem 0.75rem 0.75rem;display:grid;gap:0.1875rem}
[data-vibeui-block="commerce-028"] [data-part="name"]{margin:0;font-size:0.8125rem;font-weight:600;line-height:1.32}
[data-vibeui-block="commerce-028"] [data-part="name"] a{color:inherit;text-decoration:none;outline:none}
[data-vibeui-block="commerce-028"] [data-part="name"] a::after{content:"";position:absolute;inset:0}
[data-vibeui-block="commerce-028"] [data-part="spec"]{margin:0;font-size:0.6875rem;color:var(--vibeui-commerce-028-muted)}
[data-vibeui-block="commerce-028"] [data-part="cost"]{margin:0.125rem 0 0;font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-028"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FACTS: Commerce028Fact[] = [
  { label: "товаров в продаже", value: "184" },
  { label: "средняя оценка", value: "4,8" },
  { label: "отзывов покупателей", value: "2 340" },
  { label: "работает с", value: "2009" },
]

const DEFAULT_SECTIONS = [
  "Все товары",
  "Свет",
  "Текстиль",
  "Посуда",
  "Хранение",
  "Распродажа",
]

const DEFAULT_PRODUCTS: Commerce028Line[] = [
  {
    id: "1",
    title: "Торшер «Сумерки»",
    spec: "Ясень, тканый абажур",
    price: "16 200 ₽",
    hue: 75,
  },
  {
    id: "2",
    title: "Плед «Пасмурно»",
    spec: "Шерсть, 140×200",
    price: "7 400 ₽",
    hue: 150,
  },
  {
    id: "3",
    title: "Ваза «Отмель»",
    spec: "Керамика ручной работы",
    price: "3 900 ₽",
    hue: 200,
  },
  {
    id: "4",
    title: "Короб «Полдень»",
    spec: "Лён, 30×40 см",
    price: "2 700 ₽",
    hue: 262,
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
 * Страница бренда: монограмма, факты о производителе, разделы и сетка товаров.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce028({
  brand = "Хмарь",
  tagline = "Мебель и свет из Карелии",
  about = "Небольшая мастерская под Петрозаводском: делаем свет и текстиль из местных материалов, красим вручную и не запускаем коллекцию, пока не проживём с ней сезон дома.",
  since = "2009",
  facts = DEFAULT_FACTS,
  follow = "Подписаться на бренд",
  sections = DEFAULT_SECTIONS,
  gridTitle = "Товары бренда",
  products = DEFAULT_PRODUCTS,
  brandLabel = "Бренд {brand}",
  sinceText = "на площадке с {since} года",
  sectionsLabel = "Разделы бренда {brand}",
  accent,
  background = "",
  className,
  style,
}: Commerce028Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-028-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-028-bg": background,
          "--vibeui-commerce-028-radius": "1.25rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-028" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-028"
        className={className}
        style={palette}
        aria-label={brandLabel.replace("{brand}", brand)}
      >
        <div data-part="cover" aria-hidden="true" />
        <div data-part="shell">
          <div data-part="head">
            <span data-part="mark" aria-hidden="true">
              {brand.slice(0, 1)}
            </span>
            <div>
              <h2>{brand}</h2>
              <p data-part="tagline">
                {tagline} · {sinceText.replace("{since}", since)}
              </p>
            </div>
            <button type="button" data-part="follow">
              {follow}
            </button>
          </div>

          <p data-part="about">{about}</p>

          <dl>
            {facts.map((fact) => (
              <div data-part="fact" key={fact.label}>
                <dd>{fact.value}</dd>
                <dt>{fact.label}</dt>
              </div>
            ))}
          </dl>

          <nav aria-label={sectionsLabel.replace("{brand}", brand)}>
            <ul>
              {sections.map((section) => (
                <li key={section}>
                  <a href="#section">{section}</a>
                </li>
              ))}
            </ul>
          </nav>

          <h3>{gridTitle}</h3>
          <ul data-part="grid">
            {products.map((product) => (
              <li
                key={product.id}
                data-part="card"
                style={
                  {
                    "--vibeui-commerce-028-hue": product.hue ?? 165,
                  } as CSSProperties
                }
              >
                <span data-part="shot" aria-hidden="true" />
                <div data-part="body">
                  <p data-part="name">
                    <a href="#product">{product.title}</a>
                  </p>
                  <p data-part="spec">{product.spec}</p>
                  <p data-part="cost">{product.price}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
