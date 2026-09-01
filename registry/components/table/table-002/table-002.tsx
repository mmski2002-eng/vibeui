import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Table002Value = boolean | string

export type Table002Row = {
  label: string
  values: Table002Value[]
}

export type Table002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  /** Названия сравниваемых вариантов. */
  options?: string[]
  rows?: Table002Row[]
  /** Номер выделенной колонки, считая с нуля. -1 — без выделения. */
  highlight?: number
  accent?: string
}

// Идея компонента: сравнение читают строками, а глазами держатся за колонку.
// Поэтому первая колонка липнет при горизонтальной прокрутке, а выбранный
// вариант подсвечен целиком, а не только в заголовке.
const STYLES = `
:where([data-vibeui-block="table-002"]){
--vibeui-table-002-fg:oklch(0.24 0.016 265);
--vibeui-table-002-muted:oklch(0.54 0.014 265);
--vibeui-table-002-bg:oklch(1 0 0);
--vibeui-table-002-border:oklch(0.91 0.006 265);
--vibeui-table-002-accent:oklch(0.55 0.2 262);
--vibeui-table-002-yes:oklch(0.58 0.15 152);
--vibeui-table-002-radius:0.75rem;
--vibeui-table-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="table-002"]{
width:100%;box-sizing:border-box;overflow-x:auto;
border:1px solid var(--vibeui-table-002-border);
border-radius:var(--vibeui-table-002-radius);
background:var(--vibeui-table-002-bg);color:var(--vibeui-table-002-fg);
font-family:var(--vibeui-table-002-font);
}
[data-vibeui-block="table-002"] table{width:100%;border-collapse:separate;border-spacing:0;font-size:0.875rem}
[data-vibeui-block="table-002"] th,
[data-vibeui-block="table-002"] td{
padding:0.6875rem 0.875rem;border-bottom:1px solid var(--vibeui-table-002-border);
text-align:center;white-space:nowrap;
}
[data-vibeui-block="table-002"] tr:last-child th,
[data-vibeui-block="table-002"] tr:last-child td{border-bottom:0}
[data-vibeui-block="table-002"] thead th{
font-size:0.8125rem;font-weight:600;
background:oklch(0.975 0.003 265);
}
/* Первая колонка липнет: при прокрутке вправо строка не теряет подпись. */
[data-vibeui-block="table-002"] [data-part="label"]{
position:sticky;left:0;z-index:1;
text-align:left;font-weight:500;white-space:normal;
background:var(--vibeui-table-002-bg);
box-shadow:1px 0 0 var(--vibeui-table-002-border);
}
[data-vibeui-block="table-002"] thead [data-part="label"]{background:oklch(0.975 0.003 265)}
/* Выделенный вариант подсвечен во всех строках, а не только в шапке. */
[data-vibeui-block="table-002"] [data-highlight="true"]{
background:color-mix(in oklab,var(--vibeui-table-002-accent) 7%,transparent);
}
[data-vibeui-block="table-002"] thead [data-highlight="true"]{
color:var(--vibeui-table-002-accent);
background:color-mix(in oklab,var(--vibeui-table-002-accent) 12%,transparent);
}
[data-vibeui-block="table-002"] [data-part="yes"]{color:var(--vibeui-table-002-yes);font-weight:600}
[data-vibeui-block="table-002"] [data-part="no"]{color:var(--vibeui-table-002-muted)}
/* Слово для скринридера: галочку и прочерк он прочитает как символы. */
[data-vibeui-block="table-002"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="table-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = ["Старт", "Команда", "Студия"]

const DEFAULT_ROWS: Table002Row[] = [
  { label: "Проектов", values: ["1", "10", "Без ограничений"] },
  { label: "Свой домен", values: [false, true, true] },
  { label: "Совместная работа", values: [false, true, true] },
  { label: "История публикаций", values: ["7 дней", "90 дней", "Навсегда"] },
  { label: "Поддержка", values: ["Почта", "Почта", "Чат за час"] },
]

/**
 * Таблица сравнения вариантов: липкая первая колонка, выделенный столбец.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table002({
  options = DEFAULT_OPTIONS,
  rows = DEFAULT_ROWS,
  highlight = 1,
  accent,
  className,
  style,
  ...props
}: Table002Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-table-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="table-002"
        className={className}
        style={palette}
      >
        <table>
          <thead>
            <tr>
              <th data-part="label" scope="col">
                Что входит
              </th>
              {options.map((option, index) => (
                <th
                  key={option}
                  scope="col"
                  data-highlight={index === highlight || undefined}
                >
                  {option}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th data-part="label" scope="row">
                  {row.label}
                </th>
                {row.values.map((value, index) => (
                  <td
                    key={`${row.label}-${index}`}
                    data-highlight={index === highlight || undefined}
                  >
                    {typeof value === "boolean" ? (
                      <span data-part={value ? "yes" : "no"}>
                        <span aria-hidden="true">{value ? "✓" : "—"}</span>
                        <span data-part="sr">{value ? "да" : "нет"}</span>
                      </span>
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
    </>
  )
}
