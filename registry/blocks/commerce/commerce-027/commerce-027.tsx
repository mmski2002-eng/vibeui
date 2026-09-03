import type { CSSProperties } from "react"

export type Commerce027Deal = {
  id: string
  title: string
  note: string
  hue?: number
}

export type Commerce027Item = {
  id: string
  title: string
  price: string
  old?: string
  badge?: string
  hue?: number
}

export type Commerce027Fact = {
  value: string
  label: string
}

export type Commerce027Props = {
  kicker?: string
  headline?: string
  lead?: string
  cta?: string
  secondary?: string
  deadline?: string
  dealsTitle?: string
  deals?: Commerce027Deal[]
  gridTitle?: string
  items?: Commerce027Item[]
  /** Плашки с цифрами акции в баннере. */
  facts?: Commerce027Fact[]
  /** Скрытая подпись перед зачёркнутой ценой. */
  oldPriceLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: главная витрины магазина — баннер акции, ряд кураторских
// подборок и сетка товаров одним экраном. Баннер несёт срок акции текстом,
// а не таймером: обратный отсчёт требует клиентского времени и врёт при
// кешировании страницы. Раскладка считается контейнерными запросами, поэтому
// витрина одинаково собирается и в узкой колонке, и на широком экране.
const STYLES = `
:where([data-vibeui-block="commerce-027"]){
--vibeui-commerce-027-bg:transparent;
--vibeui-commerce-027-radius:0;
--vibeui-commerce-027-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-commerce-027-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-commerce-027-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.012 265));
--vibeui-commerce-027-soft:light-dark(oklch(0.975 0.004 265),oklch(0.27 0.011 265));
--vibeui-commerce-027-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-commerce-027-sale:light-dark(oklch(0.56 0.19 25),oklch(0.63 0.18 25));
--vibeui-commerce-027-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-027"]{color-scheme:dark}
[data-vibeui-block="commerce-027"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-027-bg);
border-radius:var(--vibeui-commerce-027-radius);
color:var(--vibeui-commerce-027-fg);font-family:var(--vibeui-commerce-027-sans);
}
[data-vibeui-block="commerce-027"] *{box-sizing:border-box}
[data-vibeui-block="commerce-027"] [data-part="shell"]{padding:1.25rem 1rem;max-width:72rem;margin:0 auto;display:grid;gap:1.5rem}
[data-vibeui-block="commerce-027"] [data-part="banner"]{
position:relative;overflow:hidden;border-radius:1.25rem;padding:1.5rem;
color:oklch(1 0 0);
background:
radial-gradient(120% 140% at 88% 12%,oklch(0.72 0.17 var(--vibeui-commerce-027-hue,262) / 70%),transparent 62%),
linear-gradient(135deg,oklch(0.34 0.09 265),oklch(0.24 0.06 265));
display:grid;gap:1rem;
}
@container (min-width: 46rem){
[data-vibeui-block="commerce-027"] [data-part="banner"]{padding:2.25rem 2.5rem;grid-template-columns:minmax(0,1.15fr) minmax(0,0.85fr);align-items:center}
}
[data-vibeui-block="commerce-027"] [data-part="kicker"]{
display:inline-flex;align-items:center;gap:0.375rem;align-self:start;
padding:0.25rem 0.625rem;border-radius:9999px;font-size:0.6875rem;font-weight:700;
letter-spacing:0.06em;text-transform:uppercase;
background:oklch(1 0 0 / 18%);color:oklch(1 0 0);
}
[data-vibeui-block="commerce-027"] [data-part="banner"] h2{
margin:0.625rem 0 0.5rem;font-size:clamp(1.5rem,4.4cqi,2.5rem);line-height:1.08;letter-spacing:-0.025em;
}
[data-vibeui-block="commerce-027"] [data-part="lead"]{margin:0;max-width:32rem;font-size:0.9375rem;line-height:1.55;color:oklch(1 0 0 / 78%)}
[data-vibeui-block="commerce-027"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:1rem}
[data-vibeui-block="commerce-027"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;height:2.75rem;padding:0 1.5rem;border-radius:0.875rem;
background:oklch(1 0 0);color:oklch(0.22 0.02 265);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-027"] [data-part="alt"]{
appearance:none;cursor:pointer;height:2.75rem;padding:0 1.25rem;border-radius:0.875rem;
border:1px solid oklch(1 0 0 / 40%);background:transparent;color:oklch(1 0 0);
font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="commerce-027"] [data-part="go"]:focus-visible,
[data-vibeui-block="commerce-027"] [data-part="alt"]:focus-visible{outline:2px solid oklch(1 0 0);outline-offset:3px}
/* Срок акции — текст, а не таймер: отсчёт на клиенте врёт при кешировании. */
[data-vibeui-block="commerce-027"] [data-part="deadline"]{
margin:0.875rem 0 0;font-size:0.8125rem;color:oklch(1 0 0 / 72%);
}
[data-vibeui-block="commerce-027"] [data-part="stack"]{display:none}
@container (min-width: 46rem){
[data-vibeui-block="commerce-027"] [data-part="stack"]{
display:grid;gap:0.625rem;grid-template-columns:repeat(2,minmax(0,1fr));
}
}
[data-vibeui-block="commerce-027"] [data-part="chip"]{
border-radius:0.875rem;padding:0.75rem 0.875rem;background:oklch(1 0 0 / 12%);
border:1px solid oklch(1 0 0 / 18%);
}
[data-vibeui-block="commerce-027"] [data-part="chip"] b{display:block;font-size:1.125rem;letter-spacing:-0.01em}
[data-vibeui-block="commerce-027"] [data-part="chip"] span{font-size:0.75rem;color:oklch(1 0 0 / 72%)}
[data-vibeui-block="commerce-027"] h3{
margin:0 0 0.75rem;font-size:1.0625rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="commerce-027"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.75rem}
[data-vibeui-block="commerce-027"] [data-part="deals"]{grid-template-columns:repeat(2,minmax(0,1fr))}
@container (min-width: 46rem){
[data-vibeui-block="commerce-027"] [data-part="deals"]{grid-template-columns:repeat(4,minmax(0,1fr))}
}
[data-vibeui-block="commerce-027"] [data-part="deal"]{
position:relative;border-radius:1rem;overflow:hidden;min-height:7.5rem;padding:0.875rem;
display:flex;flex-direction:column;justify-content:flex-end;color:oklch(1 0 0);
background:linear-gradient(160deg,oklch(0.62 0.14 var(--vibeui-commerce-027-hue,262)),oklch(0.38 0.1 var(--vibeui-commerce-027-hue,262)));
}
[data-vibeui-block="commerce-027"] [data-part="deal"]:has(a:focus-visible){outline:2px solid var(--vibeui-commerce-027-accent);outline-offset:2px}
[data-vibeui-block="commerce-027"] [data-part="deal"] a{color:inherit;text-decoration:none;font-size:0.9375rem;font-weight:700;outline:none}
[data-vibeui-block="commerce-027"] [data-part="deal"] a::after{content:"";position:absolute;inset:0}
[data-vibeui-block="commerce-027"] [data-part="deal"] span{margin-top:0.125rem;font-size:0.75rem;color:oklch(1 0 0 / 78%)}
[data-vibeui-block="commerce-027"] [data-part="items"]{grid-template-columns:repeat(2,minmax(0,1fr))}
@container (min-width: 34rem){
[data-vibeui-block="commerce-027"] [data-part="items"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@container (min-width: 56rem){
[data-vibeui-block="commerce-027"] [data-part="items"]{grid-template-columns:repeat(5,minmax(0,1fr))}
}
[data-vibeui-block="commerce-027"] [data-part="item"]{
position:relative;border:1px solid var(--vibeui-commerce-027-border);border-radius:1rem;overflow:hidden;
display:flex;flex-direction:column;background:var(--vibeui-commerce-027-bg);
}
[data-vibeui-block="commerce-027"] [data-part="item"]:has(a:focus-visible){outline:2px solid var(--vibeui-commerce-027-accent);outline-offset:2px}
[data-vibeui-block="commerce-027"] [data-part="cover"]{
position:relative;aspect-ratio:1;
background:linear-gradient(150deg,oklch(0.95 0.045 var(--vibeui-commerce-027-hue,262)),oklch(0.87 0.085 var(--vibeui-commerce-027-hue,262)));
}
[data-vibeui-block="commerce-027"] [data-part="badge"]{
position:absolute;top:0.5rem;left:0.5rem;padding:0.1875rem 0.4375rem;border-radius:0.4375rem;
background:var(--vibeui-commerce-027-sale);color:oklch(1 0 0);font-size:0.625rem;font-weight:700;
}
[data-vibeui-block="commerce-027"] [data-part="body"]{padding:0.625rem 0.75rem 0.75rem;display:grid;gap:0.25rem}
[data-vibeui-block="commerce-027"] [data-part="name"]{margin:0;font-size:0.8125rem;font-weight:600;line-height:1.32}
[data-vibeui-block="commerce-027"] [data-part="name"] a{color:inherit;text-decoration:none;outline:none}
[data-vibeui-block="commerce-027"] [data-part="name"] a::after{content:"";position:absolute;inset:0}
[data-vibeui-block="commerce-027"] [data-part="cost"]{
margin:0;display:flex;align-items:baseline;gap:0.375rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="commerce-027"] [data-part="cost"] b{font-size:0.9375rem;font-weight:700}
[data-vibeui-block="commerce-027"] [data-part="cost"] s{font-size:0.75rem;color:var(--vibeui-commerce-027-muted)}
[data-vibeui-block="commerce-027"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-027"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_DEALS: Commerce027Deal[] = [
  { id: "d1", title: "Тёплый свет", note: "34 товара", hue: 75 },
  { id: "d2", title: "Для маленькой кухни", note: "58 товаров", hue: 150 },
  { id: "d3", title: "Всё для сна", note: "26 товаров", hue: 262 },
  { id: "d4", title: "Дешевле 3 000 ₽", note: "112 товаров", hue: 20 },
]

const DEFAULT_ITEMS: Commerce027Item[] = [
  {
    id: "1",
    title: "Торшер «Сумерки»",
    price: "16 200 ₽",
    old: "19 900 ₽",
    badge: "−19%",
    hue: 75,
  },
  { id: "2", title: "Плед «Пасмурно»", price: "7 400 ₽", hue: 150 },
  {
    id: "3",
    title: "Ковёр «Туман» 160×230",
    price: "27 600 ₽",
    old: "32 000 ₽",
    badge: "−14%",
    hue: 262,
  },
  { id: "4", title: "Ваза «Отмель»", price: "3 900 ₽", hue: 20 },
  { id: "5", title: "Полка «Полдень»", price: "11 300 ₽", hue: 200 },
]

const DEFAULT_FACTS: Commerce027Fact[] = [
  { value: "−40%", label: "максимальная скидка" },
  { value: "412", label: "товара в акции" },
  { value: "0 ₽", label: "доставка от 5 000 ₽" },
  { value: "14 дней", label: "на возврат без причины" },
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
 * Главная витрины: баннер акции, ряд подборок и сетка товаров.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce027({
  kicker = "Весенняя распродажа",
  headline = "Обновляем дом к теплу",
  lead = "Свет, текстиль и мелочи, которые меняют комнату быстрее ремонта. Скидка действует на всё, что отмечено ярлыком.",
  cta = "Смотреть распродажу",
  secondary = "Новинки",
  deadline = "Акция до 31 марта включительно, пока товар есть на складе.",
  dealsTitle = "Подборки редакции",
  deals = DEFAULT_DEALS,
  gridTitle = "Разбирают на этой неделе",
  items = DEFAULT_ITEMS,
  facts = DEFAULT_FACTS,
  oldPriceLabel = "Старая цена ",
  accent,
  background = "",
  className,
  style,
}: Commerce027Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-027-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-027-bg": background,
          "--vibeui-commerce-027-radius": "1.25rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-027" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-027"
        className={className}
        style={palette}
        aria-label={headline}
      >
        <div data-part="shell">
          <div data-part="banner">
            <div>
              <span data-part="kicker">{kicker}</span>
              <h2>{headline}</h2>
              <p data-part="lead">{lead}</p>
              <div data-part="actions">
                <button type="button" data-part="go">
                  {cta}
                </button>
                <button type="button" data-part="alt">
                  {secondary}
                </button>
              </div>
              <p data-part="deadline">{deadline}</p>
            </div>
            <div data-part="stack" aria-hidden="true">
              {facts.map((fact) => (
                <div key={fact.label} data-part="chip">
                  <b>{fact.value}</b>
                  <span>{fact.label}</span>
                </div>
              ))}
            </div>
          </div>

          <section>
            <h3>{dealsTitle}</h3>
            <ul data-part="deals">
              {deals.map((deal) => (
                <li
                  key={deal.id}
                  data-part="deal"
                  style={
                    {
                      "--vibeui-commerce-027-hue": deal.hue ?? 262,
                    } as CSSProperties
                  }
                >
                  <a href="#collection">{deal.title}</a>
                  <span>{deal.note}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3>{gridTitle}</h3>
            <ul data-part="items">
              {items.map((item) => (
                <li
                  key={item.id}
                  data-part="item"
                  style={
                    {
                      "--vibeui-commerce-027-hue": item.hue ?? 262,
                    } as CSSProperties
                  }
                >
                  <span data-part="cover" aria-hidden="true">
                    {item.badge ? (
                      <span data-part="badge">{item.badge}</span>
                    ) : null}
                  </span>
                  <div data-part="body">
                    <p data-part="name">
                      <a href="#product">{item.title}</a>
                    </p>
                    <p data-part="cost">
                      <b>{item.price}</b>
                      {item.old ? (
                        <s>
                          <span data-part="sr">{oldPriceLabel}</span>
                          {item.old}
                        </s>
                      ) : null}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>
    </>
  )
}
