import type { ComponentProps, CSSProperties } from "react"

export type Datagrid031Row = {
  sku: string
  values: number[]
}

export type Datagrid031Props = Omit<ComponentProps<"section">, "children"> & {
  rows?: Datagrid031Row[]
  warehouses?: string[]
  caption?: string
  height?: number
  /** Заголовок шапки над сеткой. */
  heading?: string
  /** Подсказка под заголовком про прокрутку в обе стороны. */
  scrollHint?: string
  /** Подпись первой колонки: она же имя угловой ячейки. */
  leadLabel?: string
  /** Подпись прокрутки для скринридера. */
  scrollLabel?: string
  /** Пусто — подложки нет, сетка лежит прямо на фоне страницы. Липкие
   *  шапка и колонка требуют непрозрачного цвета, поэтому по умолчанию он есть. */
  background?: string
  accent?: string
}

// Идея компонента: у широкой и длинной сетки закреплены сразу шапка и первая
// колонка, поэтому в любой точке прокрутки видно и название строки, и
// название колонки. Угловая ячейка — пересечение обеих закреплённых осей: она
// липнет и по top, и по left разом и получает z-index выше соседей, иначе
// прокручивающиеся строки и колонки просвечивают сквозь неё по очереди.
//
// Тема берётся из color-scheme окружения через light-dark(). Подложка тут
// непрозрачная намеренно: закреплённые шапка и колонка перекрывают
// уезжающие ячейки только собственным фоном.
const STYLES = `
:where([data-vibeui-block="datagrid-031"]){
--vibeui-datagrid-031-bg:light-dark(oklch(1 0 0),oklch(0.2 0.012 250));
--vibeui-datagrid-031-fg:light-dark(oklch(0.23 0.014 250),oklch(0.93 0.006 250));
--vibeui-datagrid-031-muted:color-mix(in oklab,var(--vibeui-datagrid-031-fg) 68%,transparent);
--vibeui-datagrid-031-border:light-dark(oklch(0.92 0.006 250),oklch(0.34 0.012 250));
--vibeui-datagrid-031-head:light-dark(oklch(0.975 0.003 250),oklch(0.27 0.012 250));
--vibeui-datagrid-031-zebra:light-dark(oklch(0.985 0.003 250),oklch(0.24 0.01 250));
--vibeui-datagrid-031-accent:light-dark(oklch(0.52 0.14 200),oklch(0.76 0.12 200));
--vibeui-datagrid-031-low:light-dark(oklch(0.55 0.19 25),oklch(0.74 0.15 25));
--vibeui-datagrid-031-height:18rem;
--vibeui-datagrid-031-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="datagrid-031"]{color-scheme:dark}
[data-vibeui-block="datagrid-031"]{
box-sizing:border-box;width:100%;max-width:44rem;margin:0 auto;
background:var(--vibeui-datagrid-031-bg);color:var(--vibeui-datagrid-031-fg);
border:1px solid var(--vibeui-datagrid-031-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-031-font);overflow:hidden;
}
[data-vibeui-block="datagrid-031"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-031"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.5rem;
padding:0.875rem;border-bottom:1px solid var(--vibeui-datagrid-031-border);
}
[data-vibeui-block="datagrid-031"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="datagrid-031"] [data-part="hint"]{
margin:0 0 0 auto;font-size:0.75rem;color:var(--vibeui-datagrid-031-muted);
}
/* overflow:auto по обеим осям разом: вертикальная прокрутка держит шапку,
   горизонтальная — первую колонку. */
[data-vibeui-block="datagrid-031"] [data-part="scroll"]{
max-height:var(--vibeui-datagrid-031-height);overflow:auto;
}
[data-vibeui-block="datagrid-031"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-031-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-031"] table{
width:100%;min-width:34rem;border-collapse:separate;border-spacing:0;font-size:0.8125rem;
}
[data-vibeui-block="datagrid-031"] caption{
padding:0.625rem 0.875rem;text-align:left;
font-size:0.75rem;color:var(--vibeui-datagrid-031-muted);
}
[data-vibeui-block="datagrid-031"] th,
[data-vibeui-block="datagrid-031"] td{
padding:0.4375rem 0.875rem;text-align:left;white-space:nowrap;
border-bottom:1px solid var(--vibeui-datagrid-031-border);
background:var(--vibeui-datagrid-031-bg);
}
[data-vibeui-block="datagrid-031"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-031"] tbody tr:nth-child(even) td,
[data-vibeui-block="datagrid-031"] tbody tr:nth-child(even) th{background:var(--vibeui-datagrid-031-zebra)}
/* Липкая шапка: собственный фон обязателен, иначе строки просвечивают. */
[data-vibeui-block="datagrid-031"] thead th{
position:sticky;top:0;z-index:2;font-weight:600;
background:var(--vibeui-datagrid-031-head);
border-bottom:1px solid var(--vibeui-datagrid-031-border);
}
/* Липкая первая колонка: тень-граница читается и когда шапка уже уехала
   за верх видимой области. */
[data-vibeui-block="datagrid-031"] [data-part="lead"]{
position:sticky;left:0;z-index:1;font-weight:600;
border-right:1px solid var(--vibeui-datagrid-031-border);
}
/* Угловая ячейка — пересечение двух липких осей: собственный z-index выше
   соседей по обеим сторонам, иначе строки и колонки просвечивают по очереди. */
[data-vibeui-block="datagrid-031"] [data-part="corner"]{
position:sticky;top:0;left:0;z-index:3;
background:var(--vibeui-datagrid-031-head);
}
[data-vibeui-block="datagrid-031"] [data-part="low"]{color:var(--vibeui-datagrid-031-low);font-weight:600}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-031"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_WAREHOUSES = ["Москва", "Питер", "Казань", "Уфа", "Омск", "Сочи"]

const DEFAULT_ROWS: Datagrid031Row[] = [
  { sku: "SKU-1001 Кресло Oslo", values: [42, 18, 9, 4, 21, 11] },
  { sku: "SKU-1002 Стол Nord", values: [15, 6, 2, 8, 3, 5] },
  { sku: "SKU-1003 Лампа Dot", values: [63, 40, 27, 12, 34, 19] },
  { sku: "SKU-1004 Полка Vega", values: [8, 3, 1, 6, 2, 4] },
  { sku: "SKU-1005 Коврик Fjord", values: [51, 22, 14, 9, 28, 16] },
  { sku: "SKU-1006 Ваза Klint", values: [24, 11, 6, 3, 9, 7] },
  { sku: "SKU-1007 Часы Delta", values: [30, 17, 8, 5, 12, 10] },
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
 * Сетка остатков с закреплёнными разом шапкой и первой колонкой: угловая
 * ячейка липнет по обеим осям. Серверный компонент, один файл.
 */
export function Datagrid031({
  rows = DEFAULT_ROWS,
  warehouses = DEFAULT_WAREHOUSES,
  caption = "Остатки по складам, шт.",
  height = 18,
  heading = "Остатки на сегодня",
  scrollHint = "Прокрутите в любую сторону — шапка и позиция остаются на месте",
  leadLabel = "Позиция",
  scrollLabel = "Таблица остатков по складам, прокручивается в обе стороны",
  background = "",
  accent,
  className,
  style,
  ...props
}: Datagrid031Props) {
  const palette = {
    "--vibeui-datagrid-031-height": `${height}rem`,
    ...(accent ? { "--vibeui-datagrid-031-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-datagrid-031-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-031" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="data-grid"
        data-vibeui-block="datagrid-031"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3 data-part="title">{heading}</h3>
          <p data-part="hint">{scrollHint}</p>
        </div>
        <div
          data-part="scroll"
          role="region"
          aria-label={scrollLabel}
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col" data-part="corner">
                  {leadLabel}
                </th>
                {warehouses.map((warehouse) => (
                  <th key={warehouse} scope="col" data-align="end">
                    {warehouse}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.sku}>
                  <th scope="row" data-part="lead">
                    {row.sku}
                  </th>
                  {row.values.map((value, index) => (
                    <td key={warehouses[index] ?? index} data-align="end">
                      {value <= 5 ? (
                        <span data-part="low">{value}</span>
                      ) : (
                        value
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
