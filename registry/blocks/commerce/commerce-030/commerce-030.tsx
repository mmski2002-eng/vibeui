import type { CSSProperties } from "react"

export type Commerce030Size = {
  value: string
  label: string
  left?: string
  available?: boolean
}

export type Commerce030Row = {
  size: string
  chest: string
  waist: string
  length: string
  sleeve: string
}

export type Commerce030Props = {
  title?: string
  price?: string
  sizesTitle?: string
  sizes?: Commerce030Size[]
  hint?: string
  tableTitle?: string
  rows?: Commerce030Row[]
  measureNote?: string
  cta?: string
  /** Подпись над таблицей мерок. */
  tableCaption?: string
  /** Заголовки колонок таблицы. */
  columnLabels?: Record<string, string>
  /** Подписи переключателя таблицы. */
  showText?: string
  hideText?: string
  /** Подпись блока для скринридера: {title} подставляет название товара. */
  pickerLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: выбор размера вместе с таблицей мерок в одном месте. Таблица
// спрятана в нативный details: она нужна не всем и не всегда, но открывать
// её в модальном окне — значит увести человека с выбора. Недоступный размер
// остаётся видимым и объявлен disabled, а не удалён: исчезнувший вариант ищут
// глазами и решают, что сайт сломался.
const STYLES = `
:where([data-vibeui-block="commerce-030"]){
--vibeui-commerce-030-bg:transparent;
--vibeui-commerce-030-radius:0;
--vibeui-commerce-030-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-commerce-030-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-commerce-030-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.012 265));
--vibeui-commerce-030-soft:light-dark(oklch(0.975 0.004 265),oklch(0.27 0.011 265));
--vibeui-commerce-030-card:light-dark(oklch(1 0 0),oklch(0.22 0.01 265));
--vibeui-commerce-030-accent:light-dark(oklch(0.45 0.13 300),oklch(0.76 0.13 300));
--vibeui-commerce-030-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0.03 300));
--vibeui-commerce-030-show:"Показать";
--vibeui-commerce-030-hide:"Скрыть";
--vibeui-commerce-030-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-030"]{color-scheme:dark}
[data-vibeui-block="commerce-030"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-030-bg);
border-radius:var(--vibeui-commerce-030-radius);
color:var(--vibeui-commerce-030-fg);font-family:var(--vibeui-commerce-030-sans);
}
[data-vibeui-block="commerce-030"] *{box-sizing:border-box}
[data-vibeui-block="commerce-030"] [data-part="shell"]{
max-width:44rem;margin:0 auto;padding:1.25rem 1rem;
border-radius:1.25rem;
}
[data-vibeui-block="commerce-030"] [data-part="head"]{display:flex;flex-wrap:wrap;gap:0.5rem;align-items:baseline;justify-content:space-between}
[data-vibeui-block="commerce-030"] h2{margin:0;font-size:1.1875rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-030"] [data-part="price"]{margin:0;font-size:1.25rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-030"] fieldset{margin:1.125rem 0 0;padding:0;border:0}
[data-vibeui-block="commerce-030"] legend{
padding:0;float:left;width:100%;clear:both;
font-size:0.8125rem;font-weight:650;margin-bottom:0.5rem;
}
[data-vibeui-block="commerce-030"] [data-part="sizes"]{clear:both;display:flex;flex-wrap:wrap;gap:0.5rem}
[data-vibeui-block="commerce-030"] [data-part="size"]{position:relative;display:inline-flex}
[data-vibeui-block="commerce-030"] [data-part="size"] input{position:absolute;inset:0;opacity:0;margin:0;cursor:pointer}
[data-vibeui-block="commerce-030"] [data-part="size"] span{
display:grid;place-items:center;min-width:3.25rem;height:3.25rem;padding:0 0.5rem;border-radius:0.875rem;
border:1px solid var(--vibeui-commerce-030-border);background:var(--vibeui-commerce-030-bg);
font-size:0.9375rem;font-weight:650;line-height:1.15;text-align:center;
transition:border-color .15s ease,background-color .15s ease;
}
[data-vibeui-block="commerce-030"] [data-part="size"] small{display:block;font-size:0.5625rem;font-weight:500;color:var(--vibeui-commerce-030-muted)}
[data-vibeui-block="commerce-030"] [data-part="size"] input:checked + span{
border-color:var(--vibeui-commerce-030-accent);background:color-mix(in oklab,var(--vibeui-commerce-030-accent) 10%,transparent);
box-shadow:inset 0 0 0 1px var(--vibeui-commerce-030-accent);
}
[data-vibeui-block="commerce-030"] [data-part="size"] input:focus-visible + span{outline:2px solid var(--vibeui-commerce-030-accent);outline-offset:2px}
/* Недоступный размер остаётся видимым: исчезнувший вариант ищут глазами. */
[data-vibeui-block="commerce-030"] [data-part="size"] input:disabled + span{
color:var(--vibeui-commerce-030-muted);background:var(--vibeui-commerce-030-soft);
text-decoration:line-through;cursor:not-allowed;
}
[data-vibeui-block="commerce-030"] [data-part="hint"]{
margin:0.75rem 0 0;padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-commerce-030-soft);font-size:0.8125rem;line-height:1.5;color:var(--vibeui-commerce-030-muted);
}
[data-vibeui-block="commerce-030"] details{
margin:0.875rem 0 0;border:1px solid var(--vibeui-commerce-030-border);border-radius:1rem;overflow:hidden;
}
[data-vibeui-block="commerce-030"] summary{
cursor:pointer;list-style:none;padding:0.75rem 0.875rem;font-size:0.875rem;font-weight:650;
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="commerce-030"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="commerce-030"] summary::after{content:var(--vibeui-commerce-030-show);font-size:0.75rem;font-weight:600;color:var(--vibeui-commerce-030-accent)}
[data-vibeui-block="commerce-030"] details[open] summary::after{content:var(--vibeui-commerce-030-hide)}
[data-vibeui-block="commerce-030"] summary:focus-visible{outline:2px solid var(--vibeui-commerce-030-accent);outline-offset:-2px}
[data-vibeui-block="commerce-030"] [data-part="scroll"]{overflow-x:auto;border-top:1px solid var(--vibeui-commerce-030-border)}
[data-vibeui-block="commerce-030"] table{border-collapse:collapse;width:100%;min-width:26rem;font-size:0.8125rem}
[data-vibeui-block="commerce-030"] caption{
caption-side:top;padding:0.625rem 0.875rem 0;text-align:left;
font-size:0.75rem;color:var(--vibeui-commerce-030-muted);
}
[data-vibeui-block="commerce-030"] th,
[data-vibeui-block="commerce-030"] td{padding:0.5rem 0.75rem;text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-030"] th[scope="col"]{
text-align:right;font-size:0.6875rem;font-weight:650;color:var(--vibeui-commerce-030-muted);
border-bottom:1px solid var(--vibeui-commerce-030-border);
}
[data-vibeui-block="commerce-030"] th[scope="row"]{
text-align:left;font-weight:700;position:sticky;left:0;background:var(--vibeui-commerce-030-card);
}
[data-vibeui-block="commerce-030"] tbody tr + tr th,
[data-vibeui-block="commerce-030"] tbody tr + tr td{border-top:1px solid var(--vibeui-commerce-030-border)}
[data-vibeui-block="commerce-030"] [data-part="measure"]{
margin:0;padding:0.625rem 0.875rem;border-top:1px solid var(--vibeui-commerce-030-border);
font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-030-muted);background:var(--vibeui-commerce-030-soft);
}
[data-vibeui-block="commerce-030"] [data-part="cta"]{
margin-top:1rem;width:100%;appearance:none;border:0;cursor:pointer;height:3rem;border-radius:0.875rem;
background:var(--vibeui-commerce-030-accent);color:var(--vibeui-commerce-030-on-accent);font:inherit;font-size:1rem;font-weight:700;
}
[data-vibeui-block="commerce-030"] [data-part="cta"]:focus-visible{outline:2px solid var(--vibeui-commerce-030-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-030"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SIZES: Commerce030Size[] = [
  { value: "xs", label: "XS", left: "3 шт." },
  { value: "s", label: "S", left: "8 шт." },
  { value: "m", label: "M", left: "нет", available: false },
  { value: "l", label: "L", left: "5 шт." },
  { value: "xl", label: "XL", left: "12 шт." },
  { value: "xxl", label: "2XL", left: "2 шт." },
]

const DEFAULT_ROWS: Commerce030Row[] = [
  { size: "XS", chest: "88", waist: "76", length: "64", sleeve: "58" },
  { size: "S", chest: "94", waist: "82", length: "66", sleeve: "59" },
  { size: "M", chest: "100", waist: "88", length: "68", sleeve: "60" },
  { size: "L", chest: "108", waist: "96", length: "70", sleeve: "61" },
  { size: "XL", chest: "116", waist: "104", length: "72", sleeve: "62" },
  { size: "2XL", chest: "124", waist: "112", length: "74", sleeve: "63" },
]

const DEFAULT_COLUMNS: Record<string, string> = {
  size: "Размер",
  chest: "Грудь",
  waist: "Талия",
  length: "Длина",
  sleeve: "Рукав",
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
 * Выбор размера с таблицей мерок в details: недоступный вариант остаётся видимым.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce030({
  title = "Свитшот «Тихий вечер»",
  price = "5 400 ₽",
  sizesTitle = "Размер",
  sizes = DEFAULT_SIZES,
  hint = "Свитшот садится свободно. Если вы между размерами — берите меньший: после первой стирки он не сядет.",
  tableTitle = "Таблица размеров",
  rows = DEFAULT_ROWS,
  measureNote = "Мерки указаны в сантиметрах и сняты с изделия, разложенного на столе. Обхват груди измеряйте по самой широкой точке, длину — от плечевого шва.",
  cta = "Добавить в корзину",
  tableCaption = "Мерки изделия, см",
  columnLabels = DEFAULT_COLUMNS,
  showText = "Показать",
  hideText = "Скрыть",
  pickerLabel = "Выбор размера: {title}",
  accent,
  background = "",
  className,
  style,
}: Commerce030Props) {
  // Подписи переключателя живут в CSS-переменных: их печатает content у ::after.
  const palette = {
    ...(accent ? { "--vibeui-commerce-030-accent": accent } : null),
    "--vibeui-commerce-030-show": JSON.stringify(showText),
    "--vibeui-commerce-030-hide": JSON.stringify(hideText),
    ...(background
      ? {
          "--vibeui-commerce-030-bg": background,
          "--vibeui-commerce-030-card": background,
          "--vibeui-commerce-030-radius": "1.25rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-030" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-030"
        className={className}
        style={palette}
        aria-label={pickerLabel.replace("{title}", title)}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="price">{price}</p>
          </div>

          <fieldset>
            <legend>{sizesTitle}</legend>
            <div data-part="sizes">
              {sizes.map((size) => (
                <label data-part="size" key={size.value}>
                  <input
                    type="radio"
                    name="commerce-030-size"
                    value={size.value}
                    defaultChecked={size.value === "l"}
                    disabled={size.available === false}
                  />
                  <span>
                    {size.label}
                    {size.left ? <small>{size.left}</small> : null}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <p data-part="hint">{hint}</p>

          <details>
            <summary>{tableTitle}</summary>
            <div data-part="scroll">
              <table>
                <caption>{tableCaption}</caption>
                <thead>
                  <tr>
                    {["size", "chest", "waist", "length", "sleeve"].map(
                      (column) => (
                        <th scope="col" key={column}>
                          {columnLabels[column] ?? DEFAULT_COLUMNS[column]}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.size}>
                      <th scope="row">{row.size}</th>
                      <td>{row.chest}</td>
                      <td>{row.waist}</td>
                      <td>{row.length}</td>
                      <td>{row.sleeve}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p data-part="measure">{measureNote}</p>
          </details>

          <button type="button" data-part="cta">
            {cta}
          </button>
        </div>
      </section>
    </>
  )
}
