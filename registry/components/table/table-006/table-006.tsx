import { Fragment } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Table006Row = {
  id: string
  order: string
  customer: string
  sum: string
  details: { label: string; value: string }[]
}

export type Table006Props = Omit<ComponentProps<"div">, "children"> & {
  rows?: Table006Row[]
  caption?: string
  /** Заголовки колонок: компонент несёт русские, проект подставляет свои. */
  columnText?: Record<string, string>
  /** Подпись флажка строки; {order} подставляет номер счёта. */
  toggleText?: string
  /** Пусто — подложки нет, таблица лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: строка с раскрывающимися подробностями и без JS. Состояние
// держит чекбокс внутри строки, а строка деталей показывается селектором :has()
// по нему. Детали лежат в отдельном <tr> с colspan, а не внутри ячейки: только
// так они занимают всю ширину таблицы и не ломают колонки.
//
// Тема берётся из color-scheme окружения через light-dark(): таблица темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="table-006"]){
--vibeui-table-006-bg:transparent;
--vibeui-table-006-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-table-006-muted:color-mix(in oklab,var(--vibeui-table-006-fg) 68%,transparent);
--vibeui-table-006-border:light-dark(oklch(0.92 0 265),oklch(0.36 0 265));
--vibeui-table-006-head:light-dark(oklch(0.5 0 265 / 5%),oklch(0.85 0 265 / 7%));
--vibeui-table-006-open:light-dark(oklch(0.5 0 265 / 5%),oklch(0.85 0 265 / 7%));
--vibeui-table-006-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.75 0.16 39.8));
--vibeui-table-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="table-006"]{color-scheme:dark}
[data-vibeui-block="table-006"]{
width:100%;box-sizing:border-box;overflow-x:auto;
background:var(--vibeui-table-006-bg);
border:1px solid var(--vibeui-table-006-border);border-radius:0.875rem;
font-family:var(--vibeui-table-006-font);color:var(--vibeui-table-006-fg);
}
[data-vibeui-block="table-006"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="table-006"] caption{padding:0.75rem 0.875rem;text-align:left;font-size:0.875rem;font-weight:650}
[data-vibeui-block="table-006"] th,
[data-vibeui-block="table-006"] td{
padding:0.5rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-table-006-border);
}
[data-vibeui-block="table-006"] thead th{background:var(--vibeui-table-006-head);font-weight:600}
[data-vibeui-block="table-006"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="table-006"] [data-part="toggle"]{width:1.5rem;padding-right:0}
[data-vibeui-block="table-006"] input{position:absolute;opacity:0;pointer-events:none}
/* Заголовок колонки есть, но не занимает места: пустой th нечем объявить. */
[data-vibeui-block="table-006"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="table-006"] [data-part="chevron"]{
display:inline-flex;cursor:pointer;
width:1.5rem;height:1.5rem;align-items:center;justify-content:center;
border-radius:0.375rem;color:var(--vibeui-table-006-muted);
}
[data-vibeui-block="table-006"] [data-part="chevron"]::before{
content:"";width:0.375rem;height:0.375rem;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(-45deg) translate(-0.0625rem,0);
}
[data-vibeui-block="table-006"] input:focus-visible + [data-part="chevron"]{outline:2px solid var(--vibeui-table-006-accent);outline-offset:-2px}
/* Раскрытие без JS: строка деталей показывается по отмеченному чекбоксу. */
[data-vibeui-block="table-006"] tr:has(input:checked) [data-part="chevron"]::before{transform:rotate(45deg) translate(-0.0625rem,-0.0625rem)}
[data-vibeui-block="table-006"] tr:has(input:checked){background:var(--vibeui-table-006-open)}
[data-vibeui-block="table-006"] [data-part="details"]{display:none}
[data-vibeui-block="table-006"] tr:has(input:checked) + [data-part="details"]{display:table-row}
[data-vibeui-block="table-006"] [data-part="details"] td{padding:0.5rem 0.875rem 0.875rem 2.375rem;white-space:normal}
[data-vibeui-block="table-006"] [data-part="grid"]{
display:grid;grid-template-columns:auto 1fr;gap:0.25rem 0.75rem;
margin:0;font-size:0.75rem;
}
[data-vibeui-block="table-006"] [data-part="grid"] dt{color:var(--vibeui-table-006-muted)}
[data-vibeui-block="table-006"] [data-part="grid"] dd{margin:0}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="table-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Table006Row[] = [
  {
    id: "300",
    order: "№ 300",
    customer: "ООО «Полёт»",
    sum: "24 000 ₽",
    details: [
      { label: "Состав", value: "Годовая подписка, 4 места" },
      { label: "Оплата", value: "Счёт выставлен 12 марта, срок 20 марта" },
      { label: "Менеджер", value: "Анна Реброва" },
    ],
  },
  {
    id: "301",
    order: "№ 301",
    customer: "ИП Гаврилов",
    sum: "5 900 ₽",
    details: [
      { label: "Состав", value: "Годовая подписка, 1 место" },
      { label: "Оплата", value: "Оплачен 13 марта картой" },
      { label: "Менеджер", value: "Илья Мохов" },
    ],
  },
]

const COLUMN_TEXT: Record<string, string> = {
  details: "Детали",
  order: "Счёт",
  customer: "Заказчик",
  sum: "Сумма",
}

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
 * Таблица с раскрывающимися подробностями строки: без JS, на :has().
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table006({
  rows = DEFAULT_ROWS,
  caption = "Счета за март",
  columnText = COLUMN_TEXT,
  toggleText = "Подробности счёта {order}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Table006Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-table-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-table-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="table"
        data-vibeui-block="table-006"
        className={className}
        style={palette}
      >
        <table>
          <caption>{caption}</caption>
          <thead>
            <tr>
              <th scope="col" data-part="toggle">
                <span data-part="sr">
                  {columnText.details ?? COLUMN_TEXT.details}
                </span>
              </th>
              <th scope="col">{columnText.order ?? COLUMN_TEXT.order}</th>
              <th scope="col">{columnText.customer ?? COLUMN_TEXT.customer}</th>
              <th scope="col" data-align="end">
                {columnText.sum ?? COLUMN_TEXT.sum}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <Fragment key={row.id}>
                <tr>
                  <td data-part="toggle">
                    <label>
                      <input
                        type="checkbox"
                        aria-label={toggleText.replace("{order}", row.order)}
                      />
                      <span data-part="chevron" aria-hidden="true" />
                    </label>
                  </td>
                  <td>{row.order}</td>
                  <td>{row.customer}</td>
                  <td data-align="end">{row.sum}</td>
                </tr>
                <tr data-part="details">
                  <td colSpan={4}>
                    <dl data-part="grid">
                      {row.details.map((detail) => (
                        <Fragment key={detail.label}>
                          <dt>{detail.label}</dt>
                          <dd>{detail.value}</dd>
                        </Fragment>
                      ))}
                    </dl>
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
