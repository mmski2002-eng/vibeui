import type { CSSProperties } from "react"

export type Commerce002Option = {
  label: string
  value: string
  available?: boolean
}

export type Commerce002Props = {
  brand?: string
  title?: string
  price?: string
  oldPrice?: string
  rating?: number
  reviews?: number
  summary?: string
  sizes?: Commerce002Option[]
  facts?: { label: string; value: string }[]
  cta?: string
  secondary?: string
  delivery?: string
  /** Подпись группы размеров. */
  sizeLabel?: string
  /** Подпись рейтинга: {count} — число отзывов. */
  reviewsText?: string
  /** Локаль форматирования рейтинга. */
  locale?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: карточка товара. Размеры — радиокнопки, а не div с обработчиком:
// выбор одного варианта, клавиатура и отправка формы достаются от браузера.
// Недоступный размер остаётся видимым и помечен disabled с зачёркиванием —
// исчезнувший вариант заставляет искать его глазами и злит сильнее отсутствия.
// Срок доставки стоит рядом с кнопкой, потому что решение принимают по нему,
// а не по названию, а галерея заменена цветным полем: блок не тянет чужие файлы.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// по умолчанию нет, он лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="commerce-002"]){
--vibeui-commerce-002-bg:transparent;
--vibeui-commerce-002-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-commerce-002-muted:light-dark(oklch(0.55 0 265),oklch(0.71 0 265));
--vibeui-commerce-002-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-commerce-002-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.72 0.17 39.8));
--vibeui-commerce-002-on-accent:oklch(0.15 0.02 39.8);
--vibeui-commerce-002-pick:light-dark(oklch(0.55 0.2 39.8 / 8%),oklch(0.72 0.17 39.8 / 18%));
--vibeui-commerce-002-star:light-dark(oklch(0.72 0.16 75),oklch(0.82 0.15 75));
--vibeui-commerce-002-ok:light-dark(oklch(0.58 0.14 152),oklch(0.76 0.14 152));
--vibeui-commerce-002-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-002"]{color-scheme:dark}
[data-vibeui-block="commerce-002"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;padding:1rem;
background:var(--vibeui-commerce-002-bg);
font-family:var(--vibeui-commerce-002-sans);color:var(--vibeui-commerce-002-fg);
}
[data-vibeui-block="commerce-002"] *{box-sizing:border-box}
[data-vibeui-block="commerce-002"] form{display:contents}
[data-vibeui-block="commerce-002"] [data-part="layout"]{display:grid;grid-template-columns:1fr;gap:1rem}
@container (min-width: 40rem){
[data-vibeui-block="commerce-002"] [data-part="layout"]{grid-template-columns:1fr 1fr;align-items:start}
}
[data-vibeui-block="commerce-002"] [data-part="gallery"]{display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="commerce-002"] [data-part="shot"]{
aspect-ratio:1 / 1;border-radius:0.875rem;
background:
radial-gradient(120% 90% at 30% 20%, light-dark(oklch(0.94 0.08 var(--vibeui-commerce-002-hue,262)),oklch(0.46 0.09 var(--vibeui-commerce-002-hue,262))), transparent 70%),
light-dark(oklch(0.96 0.02 var(--vibeui-commerce-002-hue,262)),oklch(0.34 0.03 var(--vibeui-commerce-002-hue,262)));
}
[data-vibeui-block="commerce-002"] [data-part="thumbs"]{display:flex;gap:0.375rem}
[data-vibeui-block="commerce-002"] [data-part="thumb"]{
flex:1 1 0;aspect-ratio:1 / 1;border-radius:0.5rem;
background:light-dark(oklch(0.95 0.03 var(--vibeui-commerce-002-hue,262)),oklch(0.36 0.04 var(--vibeui-commerce-002-hue,262)));
border:1px solid var(--vibeui-commerce-002-border);
}
[data-vibeui-block="commerce-002"] [data-part="brand"]{margin:0;font-size:0.75rem;color:var(--vibeui-commerce-002-muted)}
[data-vibeui-block="commerce-002"] h2{margin:0.125rem 0 0.375rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.01em;line-height:1.2}
[data-vibeui-block="commerce-002"] [data-part="rating"]{
display:flex;align-items:center;gap:0.375rem;margin:0 0 0.625rem;
font-size:0.75rem;color:var(--vibeui-commerce-002-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="commerce-002"] [data-part="stars"]{color:var(--vibeui-commerce-002-star)}
[data-vibeui-block="commerce-002"] [data-part="prices"]{display:flex;align-items:baseline;gap:0.5rem;margin:0 0 0.625rem}
[data-vibeui-block="commerce-002"] [data-part="price"]{font-size:1.5rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.02em}
[data-vibeui-block="commerce-002"] s{font-size:0.875rem;color:var(--vibeui-commerce-002-muted)}
[data-vibeui-block="commerce-002"] [data-part="summary"]{margin:0 0 0.875rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-commerce-002-muted)}
[data-vibeui-block="commerce-002"] fieldset{margin:0 0 0.875rem;padding:0;border:0}
[data-vibeui-block="commerce-002"] legend{padding:0;margin-bottom:0.375rem;font-size:0.75rem;font-weight:650}
[data-vibeui-block="commerce-002"] [data-part="sizes"]{display:flex;flex-wrap:wrap;gap:0.375rem}
[data-vibeui-block="commerce-002"] input{position:absolute;opacity:0;pointer-events:none}
[data-vibeui-block="commerce-002"] [data-part="size"]{
display:inline-flex;align-items:center;justify-content:center;cursor:pointer;
min-width:2.75rem;height:2.25rem;padding:0 0.5rem;border-radius:0.5rem;
border:1px solid var(--vibeui-commerce-002-border);
font-size:0.8125rem;
}
[data-vibeui-block="commerce-002"] input:checked + [data-part="size"]{
border-color:var(--vibeui-commerce-002-accent);
background:var(--vibeui-commerce-002-pick);font-weight:650;
}
[data-vibeui-block="commerce-002"] input:focus-visible + [data-part="size"]{outline:2px solid var(--vibeui-commerce-002-accent);outline-offset:2px}
/* Недоступный размер виден и зачёркнут: исчезнувший вариант ищут глазами. */
[data-vibeui-block="commerce-002"] input:disabled + [data-part="size"]{
color:var(--vibeui-commerce-002-muted);cursor:not-allowed;
text-decoration:line-through;opacity:.7;
}
[data-vibeui-block="commerce-002"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.5rem}
[data-vibeui-block="commerce-002"] button{
appearance:none;cursor:pointer;height:2.5rem;padding:0 1rem;border-radius:0.625rem;
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="commerce-002"] [data-part="buy"]{flex:1 1 10rem;border:0;background:var(--vibeui-commerce-002-accent);color:var(--vibeui-commerce-002-on-accent)}
[data-vibeui-block="commerce-002"] [data-part="wish"]{
border:1px solid var(--vibeui-commerce-002-border);background:none;color:inherit;
}
[data-vibeui-block="commerce-002"] button:focus-visible{outline:2px solid var(--vibeui-commerce-002-accent);outline-offset:2px}
/* Срок доставки рядом с кнопкой: решение принимают по нему. */
[data-vibeui-block="commerce-002"] [data-part="delivery"]{
display:flex;align-items:center;gap:0.375rem;margin:0 0 0.875rem;
font-size:0.75rem;color:var(--vibeui-commerce-002-ok);font-weight:600;
}
[data-vibeui-block="commerce-002"] [data-part="dot"]{width:0.4375rem;height:0.4375rem;border-radius:9999px;background:currentColor}
[data-vibeui-block="commerce-002"] dl{
display:grid;grid-template-columns:auto 1fr;gap:0.25rem 0.75rem;margin:0;
padding-top:0.75rem;border-top:1px solid var(--vibeui-commerce-002-border);
font-size:0.75rem;
}
[data-vibeui-block="commerce-002"] [data-part="row"]{display:contents}
[data-vibeui-block="commerce-002"] dt{color:var(--vibeui-commerce-002-muted)}
[data-vibeui-block="commerce-002"] dd{margin:0}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SIZES: Commerce002Option[] = [
  { label: "S", value: "s", available: true },
  { label: "M", value: "m", available: true },
  { label: "L", value: "l", available: false },
  { label: "XL", value: "xl", available: true },
]

const DEFAULT_FACTS = [
  { label: "Материал", value: "Хлопок 92 %, эластан 8 %" },
  { label: "Уход", value: "Стирка 30°, без отбеливания" },
  { label: "Артикул", value: "VU-1042" },
]

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
 * Карточка товара: размеры радиокнопками, срок доставки рядом с кнопкой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce002({
  brand = "Свет и форма",
  title = "Свитшот «Тихий вечер»",
  price = "5 400 ₽",
  oldPrice = "6 900 ₽",
  rating = 4.7,
  reviews = 213,
  summary = "Плотное полотно, широкая посадка и рукав-реглан. Не тянется после стирки и держит форму на плечах.",
  sizes = DEFAULT_SIZES,
  facts = DEFAULT_FACTS,
  cta = "В корзину",
  secondary = "В избранное",
  delivery = "Доставка завтра, если заказать сегодня",
  sizeLabel = "Размер",
  reviewsText = "{count} отзывов",
  locale = "ru-RU",
  accent,
  background = "",
  className,
  style,
}: Commerce002Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-002"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="layout">
          <div data-part="gallery">
            <div data-part="shot" aria-hidden="true" />
            <div data-part="thumbs" aria-hidden="true">
              <span data-part="thumb" />
              <span data-part="thumb" />
              <span data-part="thumb" />
            </div>
          </div>

          <div>
            <p data-part="brand">{brand}</p>
            <h2>{title}</h2>
            <p data-part="rating">
              <span data-part="stars" aria-hidden="true">
                {stars(rating)}
              </span>
              {rating.toLocaleString(locale)} ·{" "}
              {reviewsText.replace("{count}", String(reviews))}
            </p>
            <p data-part="prices">
              <span data-part="price">{price}</span>
              {oldPrice ? <s>{oldPrice}</s> : null}
            </p>
            <p data-part="summary">{summary}</p>

            <form>
              <fieldset>
                <legend>{sizeLabel}</legend>
                <div data-part="sizes">
                  {sizes.map((size) => (
                    <label key={size.value}>
                      <input
                        type="radio"
                        name="vibeui-commerce-002-size"
                        value={size.value}
                        disabled={size.available === false}
                        defaultChecked={size.value === "m"}
                      />
                      <span data-part="size">{size.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </form>

            <div data-part="actions">
              <button type="button" data-part="buy">
                {cta}
              </button>
              <button type="button" data-part="wish">
                {secondary}
              </button>
            </div>
            <p data-part="delivery">
              <span data-part="dot" aria-hidden="true" />
              {delivery}
            </p>

            <dl>
              {facts.map((fact) => (
                <div key={fact.label} data-part="row">
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  )
}
