import type { CSSProperties } from "react"

export type Commerce051Row = {
  id: string
  title: string
  spec: string
  detail: string
  price: string
  stock: string
  hue?: number
  /** Фото товара. Без него на том же месте остаётся цветное поле. */
  image?: string
}

export type Commerce051Props = {
  title?: string
  found?: number
  gridLabel?: string
  listLabel?: string
  viewLegend?: string
  rows?: Commerce051Row[]
  cta?: string
  /** Счётчик найденного: {count} — сколько товаров. */
  foundText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: один и тот же список в двух видах без единой строки JS.
// Переключатель — пара радиокнопок, раскладку меняет :has() на оболочке.
// Плитка и список показывают разные поля: в списке появляется описание и
// наличие, ради которых вид и переключают, — иначе кнопка меняет только
// ширину карточек и не даёт ничего.
const STYLES = `
:where([data-vibeui-block="commerce-051"]){
--vibeui-commerce-051-bg:transparent;
--vibeui-commerce-051-card:light-dark(oklch(1 0 0),oklch(0.26 0.01 145));
--vibeui-commerce-051-fg:light-dark(oklch(0.21 0.012 145),oklch(0.93 0.006 145));
--vibeui-commerce-051-muted:light-dark(oklch(0.53 0.014 145),oklch(0.72 0.012 145));
--vibeui-commerce-051-border:light-dark(oklch(0.9 0.008 145),oklch(0.36 0.012 145));
--vibeui-commerce-051-soft:light-dark(oklch(0.97 0.008 145),oklch(0.29 0.01 145));
--vibeui-commerce-051-accent:light-dark(oklch(0.55 0.11 39.8),oklch(0.74 0.12 39.8));
--vibeui-commerce-051-onaccent:oklch(0.15 0.02 39.8);
--vibeui-commerce-051-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-051"]{color-scheme:dark}
[data-vibeui-block="commerce-051"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-051-bg);
color:var(--vibeui-commerce-051-fg);font-family:var(--vibeui-commerce-051-sans);
}
[data-vibeui-block="commerce-051"] *{box-sizing:border-box}
[data-vibeui-block="commerce-051"] form{display:contents}
[data-vibeui-block="commerce-051"] [data-part="shell"]{max-width:66rem;margin:0 auto;padding:1.25rem 1rem 2rem}
[data-vibeui-block="commerce-051"] [data-part="top"]{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.75rem;margin-bottom:1rem}
[data-vibeui-block="commerce-051"] h2{margin:0;font-size:1.375rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-051"] [data-part="found"]{display:block;margin-top:0.125rem;font-size:0.8125rem;font-weight:400;color:var(--vibeui-commerce-051-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-051"] fieldset{border:0;margin:0;padding:0;min-inline-size:0}
[data-vibeui-block="commerce-051"] legend{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
[data-vibeui-block="commerce-051"] [data-part="switch"]{display:inline-flex;padding:0.1875rem;border-radius:0.75rem;background:var(--vibeui-commerce-051-soft);border:1px solid var(--vibeui-commerce-051-border)}
[data-vibeui-block="commerce-051"] [data-part="switch"] input{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
[data-vibeui-block="commerce-051"] [data-part="switch"] label{
cursor:pointer;display:inline-flex;align-items:center;gap:0.375rem;height:2rem;padding:0 0.875rem;border-radius:0.625rem;
font-size:0.8125rem;font-weight:650;color:var(--vibeui-commerce-051-muted);
transition:background-color .14s ease,color .14s ease;
}
[data-vibeui-block="commerce-051"] [data-part="switch"] input:checked+label{background:var(--vibeui-commerce-051-card);color:var(--vibeui-commerce-051-fg);box-shadow:0 1px 2px oklch(0.2 0.02 145 / 12%)}
[data-vibeui-block="commerce-051"] [data-part="switch"] input:focus-visible+label{outline:2px solid var(--vibeui-commerce-051-accent);outline-offset:2px}
[data-vibeui-block="commerce-051"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.75rem;grid-template-columns:repeat(2,minmax(0,1fr))}
[data-vibeui-block="commerce-051"] [data-part="row"]{
position:relative;border:1px solid var(--vibeui-commerce-051-border);border-radius:0.875rem;overflow:hidden;
display:flex;flex-direction:column;
}
[data-vibeui-block="commerce-051"] [data-part="row"]:has(a:focus-visible){outline:2px solid var(--vibeui-commerce-051-accent);outline-offset:2px}
[data-vibeui-block="commerce-051"] [data-part="cover"]{
flex:none;display:block;aspect-ratio:4/3;
overflow:hidden;
}
/* Подложка — только когда фото нет: блок обязан быть полноценным
   без единого внешнего файла. */
[data-vibeui-block="commerce-051"] [data-part="cover"][data-empty="true"]{background:linear-gradient(155deg,oklch(0.94 0.05 var(--vibeui-commerce-051-hue,155)),oklch(0.85 0.09 var(--vibeui-commerce-051-hue,155)));}
[data-vibeui-block="commerce-051"] [data-part="cover"] img{
display:block;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="commerce-051"] [data-part="body"]{padding:0.5rem 0.75rem 0.75rem;flex:1;display:flex;flex-direction:column}
[data-vibeui-block="commerce-051"] [data-part="name"]{margin:0;font-size:0.875rem;font-weight:650;line-height:1.35}
[data-vibeui-block="commerce-051"] [data-part="name"] a{color:inherit;text-decoration:none;outline:none}
[data-vibeui-block="commerce-051"] [data-part="name"] a::after{content:"";position:absolute;inset:0}
[data-vibeui-block="commerce-051"] [data-part="spec"]{margin:0.125rem 0 0;font-size:0.75rem;color:var(--vibeui-commerce-051-muted)}
[data-vibeui-block="commerce-051"] [data-part="detail"]{display:none;margin:0.375rem 0 0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-commerce-051-muted)}
[data-vibeui-block="commerce-051"] [data-part="stock"]{display:none;margin:0.375rem 0 0;font-size:0.75rem;font-weight:650;color:var(--vibeui-commerce-051-accent)}
[data-vibeui-block="commerce-051"] [data-part="bottom"]{margin-top:auto;padding-top:0.5rem;display:flex;align-items:center;justify-content:space-between;gap:0.5rem}
[data-vibeui-block="commerce-051"] [data-part="price"]{margin:0;font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-051"] [data-part="buy"]{
position:relative;z-index:1;appearance:none;border:0;cursor:pointer;height:2rem;padding:0 0.875rem;border-radius:0.625rem;
background:var(--vibeui-commerce-051-accent);color:var(--vibeui-commerce-051-onaccent);font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="commerce-051"] [data-part="buy"]:focus-visible{outline:2px solid var(--vibeui-commerce-051-accent);outline-offset:2px}
[data-vibeui-block="commerce-051"] [data-part="sr"]{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
[data-vibeui-block="commerce-051"] [data-part="shell"]:has([data-part="list-mode"]:checked) ul{grid-template-columns:1fr}
[data-vibeui-block="commerce-051"] [data-part="shell"]:has([data-part="list-mode"]:checked) [data-part="row"]{flex-direction:row}
[data-vibeui-block="commerce-051"] [data-part="shell"]:has([data-part="list-mode"]:checked) [data-part="cover"]{width:8rem;aspect-ratio:1}
[data-vibeui-block="commerce-051"] [data-part="shell"]:has([data-part="list-mode"]:checked) [data-part="detail"]{display:block}
[data-vibeui-block="commerce-051"] [data-part="shell"]:has([data-part="list-mode"]:checked) [data-part="stock"]{display:block}
@container (min-width: 36rem){
[data-vibeui-block="commerce-051"] ul{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@container (min-width: 52rem){
[data-vibeui-block="commerce-051"] [data-part="shell"]{padding:2rem 2rem 3rem}
[data-vibeui-block="commerce-051"] ul{grid-template-columns:repeat(4,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-051"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Commerce051Row[] = [
  {
    id: "1",
    title: "Кофемолка «Жёрнов»",
    spec: "Конические жернова",
    detail:
      "38 степеней помола от эспрессо до френч-пресса, бункер на 250 г, шум до 62 дБ.",
    price: "14 900 ₽",
    stock: "На складе: 12 шт.",
    hue: 45,
  },
  {
    id: "2",
    title: "Чайник «Гейзер»",
    spec: "Контроль температуры",
    detail:
      "Пять режимов нагрева, удержание температуры 60 минут, тонкий носик для пуровера.",
    price: "9 400 ₽",
    stock: "На складе: 4 шт.",
    hue: 200,
  },
  {
    id: "3",
    title: "Весы «Капля»",
    spec: "Точность 0,1 г",
    detail:
      "Встроенный таймер, автотара, работа от аккумулятора до 40 часов, влагозащита корпуса.",
    price: "5 600 ₽",
    stock: "На складе: 27 шт.",
    hue: 155,
  },
  {
    id: "4",
    title: "Воронка «Пуровер»",
    spec: "Керамика, размер 02",
    detail:
      "Обжиг 1250 °C, спиральные рёбра для равномерного пролива, подходит под фильтры V02.",
    price: "3 200 ₽",
    stock: "На складе: 41 шт.",
    hue: 25,
  },
]

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

/**
 * Каталог с переключателем «плитка / список» на радиокнопках: раскладку и
 * состав полей меняет :has(). Один файл, ноль зависимостей, палитра своя.
 */
export function Commerce051({
  title = "Кофейное оборудование",
  found = 46,
  gridLabel = "Плиткой",
  listLabel = "Списком",
  viewLegend = "Вид каталога",
  rows = DEFAULT_ROWS,
  cta = "В корзину",
  foundText = "Найдено {count} товаров",
  accent,
  background = "",
  className,
  style,
}: Commerce051Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-051-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-051-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-051" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-051"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="top">
            <h2>
              {title}
              <span data-part="found">
                {foundText.replace("{count}", String(found))}
              </span>
            </h2>
            <form>
              <fieldset>
                <legend>{viewLegend}</legend>
                <div data-part="switch">
                  <input
                    type="radio"
                    name="commerce-051-view"
                    id="commerce-051-grid"
                    defaultChecked
                  />
                  <label htmlFor="commerce-051-grid">{gridLabel}</label>
                  <input
                    type="radio"
                    name="commerce-051-view"
                    id="commerce-051-list"
                    data-part="list-mode"
                  />
                  <label htmlFor="commerce-051-list">{listLabel}</label>
                </div>
              </fieldset>
            </form>
          </div>

          <ul>
            {rows.map((row) => (
              <li
                key={row.id}
                data-part="row"
                style={
                  {
                    "--vibeui-commerce-051-hue": row.hue ?? 155,
                  } as CSSProperties
                }
              >
                <span
                  data-part="cover"
                  data-empty={row.image ? undefined : "true"}
                  aria-hidden={row.image ? undefined : true}
                >
                  {row.image ? (
                    <img
                      src={row.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </span>
                <div data-part="body">
                  <p data-part="name">
                    <a href="#product">{row.title}</a>
                  </p>
                  <p data-part="spec">{row.spec}</p>
                  <p data-part="detail">{row.detail}</p>
                  <p data-part="stock">{row.stock}</p>
                  <div data-part="bottom">
                    <p data-part="price">{row.price}</p>
                    <button type="button" data-part="buy">
                      {cta}
                      <span data-part="sr"> — {row.title}</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
