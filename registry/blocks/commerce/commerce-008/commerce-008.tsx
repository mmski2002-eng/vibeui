import type { CSSProperties } from "react"

export type Commerce008Variant = {
  value: string
  label: string
  hue: number
  note?: string
}

export type Commerce008Props = {
  title?: string
  brand?: string
  price?: string
  variants?: Commerce008Variant[]
  shots?: string[]
  stock?: string
  cta?: string
  /** Подписи блока: компонент несёт русские, проект подставляет свои. */
  labels?: Record<string, string>
  className?: string
  style?: CSSProperties
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: галерея товара, которая листается без единой строки JS. Кадр
// выбирается радиокнопкой, а сам показ делают соседние селекторы — поэтому
// блок остаётся серверным, работает с клавиатуры и не мигает при гидрации.
// Вариант товара выбирается образцами цвета, но у каждого образца есть
// подпись словами: цветом одним нельзя называть вариант — его не прочитает
// ни скринридер, ни человек с дальтонизмом.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// по умолчанию нет, он лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="commerce-008"]){
--vibeui-commerce-008-bg:transparent;
--vibeui-commerce-008-field:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-commerce-008-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-commerce-008-muted:light-dark(oklch(0.55 0 265),oklch(0.72 0 265));
--vibeui-commerce-008-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-commerce-008-soft:light-dark(oklch(0.97 0 265),oklch(0.29 0 265));
--vibeui-commerce-008-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-commerce-008-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0 262));
--vibeui-commerce-008-shot-fg:light-dark(oklch(0.24 0 265),oklch(0.95 0 265));
--vibeui-commerce-008-ring:light-dark(oklch(0 0 0 / 12%),oklch(1 0 0 / 18%));
--vibeui-commerce-008-ok:light-dark(oklch(0.58 0.14 152),oklch(0.76 0.14 152));
--vibeui-commerce-008-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-008"]{color-scheme:dark}
[data-vibeui-block="commerce-008"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-commerce-008-bg);
font-family:var(--vibeui-commerce-008-sans);color:var(--vibeui-commerce-008-fg);
}
[data-vibeui-block="commerce-008"] *{box-sizing:border-box}
[data-vibeui-block="commerce-008"] form{display:contents}
[data-vibeui-block="commerce-008"] [data-part="shell"]{
padding:1rem;max-width:72rem;margin:0 auto;display:grid;gap:1rem;grid-template-columns:1fr;align-items:start;
}
@container (min-width: 44rem){
[data-vibeui-block="commerce-008"] [data-part="shell"]{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr)}
}
[data-vibeui-block="commerce-008"] [data-part="pick"]{position:absolute;width:1px;height:1px;opacity:0;margin:0}
[data-vibeui-block="commerce-008"] [data-part="stage"]{
position:relative;aspect-ratio:4/3;border-radius:1rem;overflow:hidden;
border:1px solid var(--vibeui-commerce-008-border);
}
[data-vibeui-block="commerce-008"] [data-part="stage"] span{
position:absolute;inset:0;opacity:0;transition:opacity .2s ease;
display:flex;align-items:flex-end;padding:0.75rem;
font-size:0.6875rem;color:var(--vibeui-commerce-008-shot-fg);
background:linear-gradient(140deg,light-dark(oklch(0.94 0.05 var(--vibeui-commerce-008-hue,262)),oklch(0.42 0.06 var(--vibeui-commerce-008-hue,262))),light-dark(oklch(0.84 0.1 var(--vibeui-commerce-008-hue,262)),oklch(0.3 0.07 var(--vibeui-commerce-008-hue,262))));
}
[data-vibeui-block="commerce-008"] [data-part="thumbs"]{display:flex;gap:0.5rem;margin-top:0.5rem}
[data-vibeui-block="commerce-008"] [data-part="thumbs"] label{
flex:1;aspect-ratio:1;border-radius:0.625rem;cursor:pointer;
border:2px solid var(--vibeui-commerce-008-border);
background:linear-gradient(140deg,light-dark(oklch(0.95 0.04 var(--vibeui-commerce-008-hue,262)),oklch(0.43 0.05 var(--vibeui-commerce-008-hue,262))),light-dark(oklch(0.87 0.08 var(--vibeui-commerce-008-hue,262)),oklch(0.33 0.06 var(--vibeui-commerce-008-hue,262))));
}
/* Кадр выбирается радиокнопкой: галерея живёт без JS и без гидрации. */
[data-vibeui-block="commerce-008"] #commerce-008-shot-1:checked ~ [data-part="stage"] [data-slide="1"],
[data-vibeui-block="commerce-008"] #commerce-008-shot-2:checked ~ [data-part="stage"] [data-slide="2"],
[data-vibeui-block="commerce-008"] #commerce-008-shot-3:checked ~ [data-part="stage"] [data-slide="3"],
[data-vibeui-block="commerce-008"] #commerce-008-shot-4:checked ~ [data-part="stage"] [data-slide="4"]{opacity:1}
[data-vibeui-block="commerce-008"] #commerce-008-shot-1:checked ~ [data-part="thumbs"] [data-thumb="1"],
[data-vibeui-block="commerce-008"] #commerce-008-shot-2:checked ~ [data-part="thumbs"] [data-thumb="2"],
[data-vibeui-block="commerce-008"] #commerce-008-shot-3:checked ~ [data-part="thumbs"] [data-thumb="3"],
[data-vibeui-block="commerce-008"] #commerce-008-shot-4:checked ~ [data-part="thumbs"] [data-thumb="4"]{border-color:var(--vibeui-commerce-008-accent)}
[data-vibeui-block="commerce-008"] #commerce-008-shot-1:focus-visible ~ [data-part="thumbs"] [data-thumb="1"],
[data-vibeui-block="commerce-008"] #commerce-008-shot-2:focus-visible ~ [data-part="thumbs"] [data-thumb="2"],
[data-vibeui-block="commerce-008"] #commerce-008-shot-3:focus-visible ~ [data-part="thumbs"] [data-thumb="3"],
[data-vibeui-block="commerce-008"] #commerce-008-shot-4:focus-visible ~ [data-part="thumbs"] [data-thumb="4"]{outline:2px solid var(--vibeui-commerce-008-accent);outline-offset:2px}
[data-vibeui-block="commerce-008"] [data-part="brand"]{margin:0;font-size:0.6875rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--vibeui-commerce-008-muted)}
[data-vibeui-block="commerce-008"] h2{margin:0.25rem 0 0.5rem;font-size:1.375rem;font-weight:700;letter-spacing:-0.02em;line-height:1.15}
[data-vibeui-block="commerce-008"] [data-part="price"]{margin:0 0 0.75rem;font-size:1.5rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-008"] fieldset{margin:0 0 0.875rem;padding:0;border:0}
[data-vibeui-block="commerce-008"] legend{padding:0;margin-bottom:0.5rem;font-size:0.75rem;font-weight:650;color:var(--vibeui-commerce-008-muted)}
[data-vibeui-block="commerce-008"] [data-part="swatches"]{display:flex;flex-wrap:wrap;gap:0.5rem}
[data-vibeui-block="commerce-008"] [data-part="swatch"]{
display:inline-flex;align-items:center;gap:0.5rem;cursor:pointer;
padding:0.375rem 0.625rem 0.375rem 0.375rem;border-radius:9999px;
border:1px solid var(--vibeui-commerce-008-border);font-size:0.75rem;
}
[data-vibeui-block="commerce-008"] [data-part="swatch"] input{position:absolute;opacity:0;width:1px;height:1px}
[data-vibeui-block="commerce-008"] [data-part="dot"]{
width:1.125rem;height:1.125rem;border-radius:9999px;
box-shadow:inset 0 0 0 1px var(--vibeui-commerce-008-ring);
background:oklch(0.72 0.15 var(--vibeui-commerce-008-dot,262));
}
[data-vibeui-block="commerce-008"] [data-part="swatch"]:has(input:checked){border-color:var(--vibeui-commerce-008-accent);background:var(--vibeui-commerce-008-soft)}
[data-vibeui-block="commerce-008"] [data-part="swatch"]:has(input:focus-visible){outline:2px solid var(--vibeui-commerce-008-accent);outline-offset:2px}
[data-vibeui-block="commerce-008"] [data-part="row"]{display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center}
[data-vibeui-block="commerce-008"] select{
appearance:none;font:inherit;font-size:0.8125rem;color:inherit;height:2.5rem;
padding:0 1.75rem 0 0.75rem;border-radius:0.625rem;
border:1px solid var(--vibeui-commerce-008-border);background:var(--vibeui-commerce-008-field);
background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);
background-position:calc(100% - 1rem) 55%,calc(100% - 0.75rem) 55%;
background-size:0.25rem 0.25rem,0.25rem 0.25rem;background-repeat:no-repeat;
}
[data-vibeui-block="commerce-008"] select:focus-visible{outline:2px solid var(--vibeui-commerce-008-accent);outline-offset:2px}
[data-vibeui-block="commerce-008"] [data-part="buy"]{
flex:1;min-width:10rem;appearance:none;border:0;cursor:pointer;height:2.5rem;border-radius:0.625rem;
background:var(--vibeui-commerce-008-accent);color:var(--vibeui-commerce-008-on-accent);font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="commerce-008"] [data-part="buy"]:focus-visible{outline:2px solid var(--vibeui-commerce-008-accent);outline-offset:2px}
[data-vibeui-block="commerce-008"] [data-part="stock"]{
display:flex;align-items:center;gap:0.375rem;margin:0.75rem 0 0;
font-size:0.75rem;color:var(--vibeui-commerce-008-ok);font-weight:600;
}
[data-vibeui-block="commerce-008"] [data-part="stock"] i{width:0.5rem;height:0.5rem;border-radius:9999px;background:currentColor}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_VARIANTS: Commerce008Variant[] = [
  { value: "sand", label: "Песочный", hue: 75, note: "в наличии" },
  { value: "moss", label: "Мох", hue: 150, note: "в наличии" },
  { value: "ink", label: "Чернила", hue: 262, note: "под заказ" },
]

const DEFAULT_SHOTS = ["Общий вид", "Спинка", "Ткань вблизи", "В интерьере"]

/** Русские подписи по умолчанию: установленный файл не меняет язык сам. */
const LABELS: Record<string, string> = {
  color: "Цвет обивки",
  count: "Количество",
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
 * Товар с галереей на радиокнопках и выбором варианта образцами цвета.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce008({
  title = "Кресло «Хмарь» с подлокотниками",
  brand = "Хмарь",
  price = "38 900 ₽",
  variants = DEFAULT_VARIANTS,
  shots = DEFAULT_SHOTS,
  stock = "На складе 6 штук — отгружаем сегодня",
  cta = "Добавить в корзину",
  labels = LABELS,
  accent,
  background = "",
  className,
  style,
}: Commerce008Props) {
  const frames = shots.slice(0, 4)
  const text = { ...LABELS, ...labels }

  const palette = {
    ...(accent ? { "--vibeui-commerce-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-008" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-008"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <form>
            <div data-part="gallery">
              {frames.map((shot, index) => (
                <input
                  key={shot}
                  data-part="pick"
                  type="radio"
                  name="commerce-008-shot"
                  id={`commerce-008-shot-${index + 1}`}
                  defaultChecked={index === 0}
                  aria-label={shot}
                />
              ))}
              <div data-part="stage">
                {frames.map((shot, index) => (
                  <span
                    key={shot}
                    data-slide={index + 1}
                    style={
                      {
                        "--vibeui-commerce-008-hue": 240 + index * 40,
                      } as CSSProperties
                    }
                  >
                    {shot}
                  </span>
                ))}
              </div>
              <div data-part="thumbs">
                {frames.map((shot, index) => (
                  <label
                    key={shot}
                    data-thumb={index + 1}
                    htmlFor={`commerce-008-shot-${index + 1}`}
                    title={shot}
                    style={
                      {
                        "--vibeui-commerce-008-hue": 240 + index * 40,
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
            </div>
          </form>

          <div>
            <p data-part="brand">{brand}</p>
            <h2>{title}</h2>
            <p data-part="price">{price}</p>

            <form>
              <fieldset>
                <legend>{text.color}</legend>
                <div data-part="swatches">
                  {variants.map((variant, index) => (
                    <label key={variant.value} data-part="swatch">
                      <input
                        type="radio"
                        name="commerce-008-variant"
                        value={variant.value}
                        defaultChecked={index === 0}
                      />
                      <span
                        data-part="dot"
                        aria-hidden="true"
                        style={
                          {
                            "--vibeui-commerce-008-dot": variant.hue,
                          } as CSSProperties
                        }
                      />
                      {variant.label}
                      {variant.note ? ` · ${variant.note}` : ""}
                    </label>
                  ))}
                </div>
              </fieldset>
            </form>

            <div data-part="row">
              <label htmlFor="commerce-008-count" data-part="brand">
                {text.count}
              </label>
              <select id="commerce-008-count" defaultValue="1">
                <option>1</option>
                <option>2</option>
                <option>3</option>
              </select>
              <button type="button" data-part="buy">
                {cta}
              </button>
            </div>

            <p data-part="stock">
              <i aria-hidden="true" />
              {stock}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
