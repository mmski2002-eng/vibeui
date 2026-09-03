import type { CSSProperties } from "react"

export type Commerce018Store = {
  id: string
  name: string
  address: string
  distance: string
  hours: string
  stock: number
  ready?: string
}

export type Commerce018Props = {
  title?: string
  product?: string
  cities?: string[]
  stores?: Commerce018Store[]
  cta?: string
  note?: string
  /** Подпись выбора города. */
  cityLabel?: string
  /** Действие в строке без товара. */
  notifyCta?: string
  /** До какого остатка наличие считается малым. */
  lowAt?: number
  /**
   * Подписи наличия по уровням: none, few и many. {count} — остаток числом.
   */
  stockText?: Record<string, string>
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: наличие по магазинам, где количество названо числом, а не
// словом «есть». «Есть» и «одна штука» ведут себя по-разному, когда человек
// едет через город. Строка без товара не исчезает и не выключает адрес: она
// показывает срок подвоза, иначе покупатель ищет пропавший магазин глазами.
// Вместо брони там предлагается подписка на поступление — тупик заменён
// следующим шагом.
const STYLES = `
:where([data-vibeui-block="commerce-018"]){
--vibeui-commerce-018-bg:transparent;
--vibeui-commerce-018-paper:light-dark(oklch(1 0 0),oklch(0.2 0.012 265));
--vibeui-commerce-018-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-commerce-018-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-commerce-018-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-commerce-018-soft:light-dark(oklch(0.975 0.004 265),oklch(0.27 0.01 265));
--vibeui-commerce-018-accent:light-dark(oklch(0.55 0.2 262),oklch(0.73 0.16 262));
--vibeui-commerce-018-ok:light-dark(oklch(0.58 0.14 152),oklch(0.76 0.14 152));
--vibeui-commerce-018-low:light-dark(oklch(0.7 0.15 75),oklch(0.82 0.14 75));
--vibeui-commerce-018-off:light-dark(oklch(0.63 0.02 265),oklch(0.63 0.02 265));
--vibeui-commerce-018-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-018"]{color-scheme:dark}
[data-vibeui-block="commerce-018"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-commerce-018-bg);
font-family:var(--vibeui-commerce-018-sans);color:var(--vibeui-commerce-018-fg);
}
[data-vibeui-block="commerce-018"] *{box-sizing:border-box}
[data-vibeui-block="commerce-018"] [data-part="shell"]{padding:1rem;max-width:48rem;margin:0 auto}
[data-vibeui-block="commerce-018"] [data-part="top"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 0.75rem;margin-bottom:0.25rem}
[data-vibeui-block="commerce-018"] h2{margin:0;font-size:1.125rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-018"] [data-part="city"]{margin-left:auto;display:inline-flex;align-items:center;gap:0.375rem;font-size:0.75rem;color:var(--vibeui-commerce-018-muted)}
[data-vibeui-block="commerce-018"] select{
appearance:none;font:inherit;font-size:0.75rem;font-weight:650;color:inherit;height:2rem;
padding:0 1.5rem 0 0.5rem;border-radius:0.5rem;
border:1px solid var(--vibeui-commerce-018-border);background:var(--vibeui-commerce-018-paper);
background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);
background-position:calc(100% - 0.75rem) 55%,calc(100% - 0.5rem) 55%;
background-size:0.25rem 0.25rem,0.25rem 0.25rem;background-repeat:no-repeat;
}
[data-vibeui-block="commerce-018"] select:focus-visible{outline:2px solid var(--vibeui-commerce-018-accent);outline-offset:2px}
[data-vibeui-block="commerce-018"] [data-part="product"]{margin:0 0 0.875rem;font-size:0.8125rem;color:var(--vibeui-commerce-018-muted)}
[data-vibeui-block="commerce-018"] ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="commerce-018"] [data-part="store"]{
display:grid;gap:0.5rem;grid-template-columns:1fr;
padding:0.75rem;border-radius:0.875rem;border:1px solid var(--vibeui-commerce-018-border);
}
@container (min-width: 34rem){
[data-vibeui-block="commerce-018"] [data-part="store"]{grid-template-columns:minmax(0,1fr) auto;align-items:center}
[data-vibeui-block="commerce-018"] [data-part="side"]{text-align:right}
}
[data-vibeui-block="commerce-018"] [data-part="name"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="commerce-018"] [data-part="address"]{margin:0.125rem 0 0;font-size:0.75rem;color:var(--vibeui-commerce-018-muted);line-height:1.4}
[data-vibeui-block="commerce-018"] [data-part="hours"]{margin:0.25rem 0 0;font-size:0.6875rem;color:var(--vibeui-commerce-018-muted)}
/* Количество числом: «есть» и «одна штука» — разные решения для покупателя. */
[data-vibeui-block="commerce-018"] [data-part="stock"]{
display:inline-flex;align-items:center;gap:0.375rem;margin:0 0 0.375rem;
font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="commerce-018"] [data-part="stock"] i{width:0.5rem;height:0.5rem;border-radius:9999px;background:currentColor;flex:none}
[data-vibeui-block="commerce-018"] [data-level="many"]{color:var(--vibeui-commerce-018-ok)}
[data-vibeui-block="commerce-018"] [data-level="few"]{color:var(--vibeui-commerce-018-low)}
[data-vibeui-block="commerce-018"] [data-level="none"]{color:var(--vibeui-commerce-018-off)}
[data-vibeui-block="commerce-018"] [data-part="hold"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-commerce-018-fg);background:var(--vibeui-commerce-018-fg);
color:var(--vibeui-commerce-018-paper);font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="commerce-018"] [data-kind="notify"]{
background:var(--vibeui-commerce-018-paper);border-color:var(--vibeui-commerce-018-border);
color:var(--vibeui-commerce-018-fg);font-weight:600;
}
[data-vibeui-block="commerce-018"] [data-part="hold"]:focus-visible{outline:2px solid var(--vibeui-commerce-018-accent);outline-offset:2px}
[data-vibeui-block="commerce-018"] [data-part="ready"]{margin:0.375rem 0 0;font-size:0.6875rem;color:var(--vibeui-commerce-018-muted)}
[data-vibeui-block="commerce-018"] [data-part="note"]{margin:0.875rem 0 0;font-size:0.6875rem;line-height:1.45;color:var(--vibeui-commerce-018-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-018"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STORES: Commerce018Store[] = [
  {
    id: "1",
    name: "Салон на Пушкина",
    address: "Пушкина 12, вход со двора",
    distance: "1,2 км",
    hours: "Сегодня до 22:00",
    stock: 4,
    ready: "Соберём за 20 минут",
  },
  {
    id: "2",
    name: "Салон в «Меге»",
    address: "Ленинский проспект 108, 2 этаж",
    distance: "6,8 км",
    hours: "Сегодня до 21:00",
    stock: 1,
    ready: "Придержим до конца дня",
  },
  {
    id: "3",
    name: "Склад «Восток»",
    address: "Шоссе Энтузиастов 44, склад 3",
    distance: "14 км",
    hours: "Пн–Пт до 18:00",
    stock: 0,
    ready: "Привезут 14 марта",
  },
]

const STOCK_LABEL: Record<string, string> = {
  none: "Нет в наличии",
  few: "Осталось {count} шт.",
  many: "{count} шт. в зале",
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
 * Наличие по магазинам: количество числом, бронь выключена там, где нечего.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce018({
  title = "Где забрать сегодня",
  product = "Кресло «Хмарь», песочный",
  cities = ["Москва", "Санкт-Петербург", "Казань"],
  stores = DEFAULT_STORES,
  cta = "Забронировать",
  note = "Бронь держим 24 часа и не просим предоплату. Наличие обновляется каждые 15 минут.",
  cityLabel = "Город",
  notifyCta = "Сообщить о поступлении",
  lowAt = 2,
  stockText = STOCK_LABEL,
  accent,
  background = "",
  className,
  style,
}: Commerce018Props) {
  // Уровень выводится из числа, а не задаётся отдельно: иначе цвет точки и
  // цифра рано или поздно разойдутся.
  const level = (stock: number) => {
    if (stock === 0) return "none"

    return stock <= lowAt ? "few" : "many"
  }

  const label = (stock: number) =>
    (stockText[level(stock)] ?? STOCK_LABEL[level(stock)]).replace(
      "{count}",
      String(stock),
    )

  const palette = {
    ...(accent ? { "--vibeui-commerce-018-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-018-bg": background,
          "--vibeui-commerce-018-paper": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-018" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-018"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="top">
            <h2>{title}</h2>
            <span data-part="city">
              <label htmlFor="commerce-018-city">{cityLabel}</label>
              <select id="commerce-018-city" defaultValue={cities[0]}>
                {cities.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </span>
          </div>
          <p data-part="product">{product}</p>

          <ul>
            {stores.map((store) => (
              <li key={store.id} data-part="store">
                <div>
                  <p data-part="stock" data-level={level(store.stock)}>
                    <i aria-hidden="true" />
                    {label(store.stock)}
                  </p>
                  <p data-part="name">
                    {store.name} · {store.distance}
                  </p>
                  <p data-part="address">{store.address}</p>
                  <p data-part="hours">{store.hours}</p>
                </div>
                <div data-part="side">
                  <button
                    type="button"
                    data-part="hold"
                    data-kind={store.stock === 0 ? "notify" : "book"}
                  >
                    {store.stock === 0 ? notifyCta : cta}
                  </button>
                  {store.ready ? <p data-part="ready">{store.ready}</p> : null}
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
