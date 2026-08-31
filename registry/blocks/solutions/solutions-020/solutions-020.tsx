import type { CSSProperties } from "react"

export type Solutions020Listing = {
  title: string
  district: string
  metro: string
  price: number
  area: number
  rooms: number
  floor: string
  status?: "new" | "deal" | "reserved"
}

export type Solutions020Props = {
  title?: string
  found?: string
  filters?: string[]
  activeFilter?: string
  listings?: Solutions020Listing[]
  currency?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: подборка объектов недвижимости. Фильтр сделан радиокнопками, а не
// кнопками с обработчиками: выбор живёт в форме, подсветка — на :has(), поэтому
// блок остаётся серверным и работает с клавиатуры без единой строчки JS.
// Цена за квадратный метр считается из цены и площади, а не приходит отдельным
// полем: два несогласованных числа рано или поздно разойдутся, а сравнивают
// объекты именно по нему. Вместо фотографии — блок с районом и метро: подборка
// без картинок честнее подборки с заглушками.
const STYLES = `
:where([data-vibeui-block="solutions-020"]){
--vibeui-solutions-020-bg:oklch(1 0 0);
--vibeui-solutions-020-panel:oklch(0.975 0.005 85);
--vibeui-solutions-020-fg:oklch(0.22 0.014 85);
--vibeui-solutions-020-muted:oklch(0.53 0.012 85);
--vibeui-solutions-020-border:oklch(0.9 0.006 85);
--vibeui-solutions-020-accent:oklch(0.52 0.13 45);
--vibeui-solutions-020-mark:oklch(0.58 0.14 150);
--vibeui-solutions-020-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-020"]{
box-sizing:border-box;padding:1rem;
background:var(--vibeui-solutions-020-bg);
border:1px solid var(--vibeui-solutions-020-border);border-radius:1rem;
font-family:var(--vibeui-solutions-020-sans);color:var(--vibeui-solutions-020-fg);
}
[data-vibeui-block="solutions-020"] *{box-sizing:border-box}
[data-vibeui-block="solutions-020"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="solutions-020"] h2{margin:0;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-020"] [data-part="found"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-020-muted)}
[data-vibeui-block="solutions-020"] fieldset{
margin:0.75rem 0 0;padding:0;border:0;display:flex;flex-wrap:wrap;gap:0.375rem;
}
[data-vibeui-block="solutions-020"] legend{
float:left;width:100%;margin:0 0 0.375rem;padding:0;
font-size:0.625rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-020-muted);
}
/* legend с float требует clear, иначе чипы обтекают его сбоку. */
[data-vibeui-block="solutions-020"] fieldset::after{content:"";display:block;clear:both}
[data-vibeui-block="solutions-020"] [data-part="chip"]{
position:relative;display:inline-flex;clear:both;
}
[data-vibeui-block="solutions-020"] [data-part="chip"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
[data-vibeui-block="solutions-020"] [data-part="chip"] span{
padding:0.3125rem 0.6875rem;border-radius:9999px;
border:1px solid var(--vibeui-solutions-020-border);
background:var(--vibeui-solutions-020-bg);
font-size:0.75rem;font-weight:600;
}
/* Выбор живёт в форме, подсветка — на :has(): блок остаётся серверным. */
[data-vibeui-block="solutions-020"] [data-part="chip"]:has(input:checked) span{
background:var(--vibeui-solutions-020-accent);
border-color:var(--vibeui-solutions-020-accent);
color:oklch(1 0 0);
}
[data-vibeui-block="solutions-020"] [data-part="chip"]:has(input:focus-visible) span{
outline:2px solid var(--vibeui-solutions-020-accent);outline-offset:2px;
}
[data-vibeui-block="solutions-020"] ul{
list-style:none;margin:0.875rem 0 0;padding:0;display:grid;gap:0.625rem;
}
@container (min-width: 38rem){
[data-vibeui-block="solutions-020"] ul{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (min-width: 60rem){
[data-vibeui-block="solutions-020"] ul{grid-template-columns:repeat(3,minmax(0,1fr))}
}
[data-vibeui-block="solutions-020"] li{
display:flex;flex-direction:column;
border-radius:0.875rem;overflow:hidden;
border:1px solid var(--vibeui-solutions-020-border);
background:var(--vibeui-solutions-020-bg);
}
/* Вместо фото — район и метро: подборка без картинок честнее заглушек. */
[data-vibeui-block="solutions-020"] [data-part="place"]{
padding:0.75rem 0.875rem;background:var(--vibeui-solutions-020-panel);
border-bottom:1px solid var(--vibeui-solutions-020-border);
}
[data-vibeui-block="solutions-020"] [data-part="district"]{display:block;font-size:0.8125rem;font-weight:700}
[data-vibeui-block="solutions-020"] [data-part="metro"]{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-020-muted);
}
[data-vibeui-block="solutions-020"] [data-part="body"]{padding:0.75rem 0.875rem;display:flex;flex-direction:column;gap:0.375rem;flex:1}
[data-vibeui-block="solutions-020"] [data-part="name"]{margin:0;font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="solutions-020"] [data-part="price"]{
margin:0;font-size:1.125rem;font-weight:700;letter-spacing:-0.02em;font-variant-numeric:tabular-nums;
}
/* Цена за метр считается из цены и площади: два поля обязательно разойдутся. */
[data-vibeui-block="solutions-020"] [data-part="permeter"]{
display:block;font-size:0.6875rem;font-weight:500;color:var(--vibeui-solutions-020-muted);
}
[data-vibeui-block="solutions-020"] [data-part="specs"]{
margin:auto 0 0;padding-top:0.5rem;border-top:1px solid var(--vibeui-solutions-020-border);
display:flex;flex-wrap:wrap;gap:0.25rem 0.75rem;
font-size:0.6875rem;color:var(--vibeui-solutions-020-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-020"] [data-part="tag"]{
align-self:flex-start;padding:0.0625rem 0.4375rem;border-radius:0.375rem;
font-size:0.625rem;font-weight:700;letter-spacing:0.02em;text-transform:uppercase;
color:oklch(1 0 0);background:var(--vibeui-solutions-020-mark);
}
[data-vibeui-block="solutions-020"] [data-status="reserved"] [data-part="tag"]{background:var(--vibeui-solutions-020-accent)}
[data-vibeui-block="solutions-020"] [data-status="deal"] [data-part="tag"]{background:var(--vibeui-solutions-020-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-020"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FILTERS = ["Все", "Студии", "1 комната", "2 комнаты", "3+"]

const DEFAULT_LISTINGS: Solutions020Listing[] = [
  {
    title: "Кирпичный дом, окна во двор",
    district: "Хамовники",
    metro: "Фрунзенская · 7 мин пешком",
    price: 18400000,
    area: 42,
    rooms: 1,
    floor: "4 из 9",
    status: "new",
  },
  {
    title: "Квартира с отделкой от застройщика",
    district: "Нагатинский Затон",
    metro: "Технопарк · 12 мин пешком",
    price: 12900000,
    area: 33,
    rooms: 1,
    floor: "11 из 24",
  },
  {
    title: "Двушка с изолированными комнатами",
    district: "Сокол",
    metro: "Панфиловская · 5 мин пешком",
    price: 24600000,
    area: 58,
    rooms: 2,
    floor: "2 из 12",
    status: "reserved",
  },
  {
    title: "Студия под сдачу, ремонт 2023",
    district: "Люблино",
    metro: "Братиславская · 9 мин пешком",
    price: 8700000,
    area: 24,
    rooms: 0,
    floor: "7 из 17",
  },
  {
    title: "Трёшка в сталинке, потолки 3,2 м",
    district: "Академический",
    metro: "Профсоюзная · 4 мин пешком",
    price: 31200000,
    area: 78,
    rooms: 3,
    floor: "5 из 6",
  },
  {
    title: "Квартира у парка, свободная продажа",
    district: "Измайлово",
    metro: "Первомайская · 10 мин пешком",
    price: 15100000,
    area: 46,
    rooms: 2,
    floor: "9 из 14",
    status: "deal",
  },
]

const STATUS_LABEL = {
  new: "новое",
  reserved: "бронь",
  deal: "сделка",
} as const

/**
 * Подборка объектов: фильтр на радиокнопках и :has(), цена за метр считается.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions020({
  title = "Объекты в продаже",
  found = "Найдено 6 объектов · сортировка по дате",
  filters = DEFAULT_FILTERS,
  activeFilter = "Все",
  listings = DEFAULT_LISTINGS,
  currency = "₽",
  accent,
  className,
  style,
}: Solutions020Props) {
  const palette = {
    ...(accent ? { "--vibeui-solutions-020-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-020" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-020"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <h2>{title}</h2>
          <p data-part="found">{found}</p>
        </header>

        <fieldset>
          <legend>Комнатность</legend>
          {filters.map((filter) => (
            <label data-part="chip" key={filter}>
              <input
                type="radio"
                name="vibeui-solutions-020-rooms"
                defaultChecked={filter === activeFilter}
              />
              <span>{filter}</span>
            </label>
          ))}
        </fieldset>

        <ul>
          {listings.map((listing) => (
            <li key={listing.title} data-status={listing.status ?? "none"}>
              <div data-part="place">
                <span data-part="district">{listing.district}</span>
                <span data-part="metro">{listing.metro}</span>
              </div>

              <div data-part="body">
                {listing.status ? (
                  <span data-part="tag">{STATUS_LABEL[listing.status]}</span>
                ) : null}
                <p data-part="name">{listing.title}</p>
                <p data-part="price">
                  {listing.price.toLocaleString("ru-RU")} {currency}
                  <span data-part="permeter">
                    {Math.round(listing.price / listing.area).toLocaleString(
                      "ru-RU",
                    )}{" "}
                    {currency} за м²
                  </span>
                </p>
                <p data-part="specs">
                  <span>
                    {listing.rooms === 0 ? "студия" : `${listing.rooms}-комн.`}
                  </span>
                  <span>{listing.area} м²</span>
                  <span>этаж {listing.floor}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
