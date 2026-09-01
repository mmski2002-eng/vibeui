"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Datagrid022Row = {
  id: string
  employee: string
  email: string
  rate: string
  hours: string
}

export type Datagrid022Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  rows?: Datagrid022Row[]
  caption?: string
  maxHours?: number
  accent?: string
}

// Идея компонента: ошибка живёт в той же ячейке, что и значение, а не в
// сводке над таблицей. Поле помечается aria-invalid и связывается с текстом
// ошибки через aria-describedby — иначе красная рамка для скринридера
// ничего не значит. Сохранение блокируется, пока есть хоть одна ошибка,
// и счётчик ошибок объявлен отдельно: пользователь должен знать, сколько
// ячеек ещё надо починить.
const STYLES = `
:where([data-vibeui-block="datagrid-022"]){
--vibeui-datagrid-022-bg:oklch(1 0 0);
--vibeui-datagrid-022-fg:oklch(0.23 0.014 285);
--vibeui-datagrid-022-muted:oklch(0.55 0.014 285);
--vibeui-datagrid-022-border:oklch(0.92 0.006 285);
--vibeui-datagrid-022-head:oklch(0.975 0.003 285);
--vibeui-datagrid-022-accent:oklch(0.5 0.15 215);
--vibeui-datagrid-022-bad:oklch(0.53 0.19 27);
--vibeui-datagrid-022-badbg:oklch(0.97 0.03 27);
--vibeui-datagrid-022-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="datagrid-022"]{
box-sizing:border-box;width:100%;max-width:52rem;margin:0 auto;
background:var(--vibeui-datagrid-022-bg);color:var(--vibeui-datagrid-022-fg);
border:1px solid var(--vibeui-datagrid-022-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-022-font);overflow:hidden;
}
[data-vibeui-block="datagrid-022"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-022"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;min-height:3rem;
padding:0.625rem 0.875rem;border-bottom:1px solid var(--vibeui-datagrid-022-border);
}
[data-vibeui-block="datagrid-022"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="datagrid-022"] [data-part="status"]{margin:0;font-size:0.75rem;color:var(--vibeui-datagrid-022-muted)}
[data-vibeui-block="datagrid-022"] [data-part="status"][data-bad="true"]{color:var(--vibeui-datagrid-022-bad);font-weight:600}
[data-vibeui-block="datagrid-022"] [data-part="save"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:600;
padding:0.375rem 0.75rem;border-radius:0.5rem;border:1px solid transparent;
background:var(--vibeui-datagrid-022-accent);color:oklch(1 0 0);
}
[data-vibeui-block="datagrid-022"] [data-part="save"]:disabled{opacity:.4;cursor:not-allowed}
[data-vibeui-block="datagrid-022"] [data-part="save"]:focus-visible{outline:2px solid var(--vibeui-datagrid-022-accent);outline-offset:2px}
[data-vibeui-block="datagrid-022"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-022"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-022-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-022"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-022"] caption{
padding:0.625rem 0.875rem;text-align:left;font-size:0.75rem;color:var(--vibeui-datagrid-022-muted);caption-side:top;
}
[data-vibeui-block="datagrid-022"] th,
[data-vibeui-block="datagrid-022"] td{
padding:0.375rem 0.875rem;text-align:left;vertical-align:top;
border-top:1px solid var(--vibeui-datagrid-022-border);
}
[data-vibeui-block="datagrid-022"] thead th{background:var(--vibeui-datagrid-022-head);font-weight:600;white-space:nowrap;vertical-align:bottom}
[data-vibeui-block="datagrid-022"] tbody th[scope="row"]{padding-top:0.6875rem;white-space:nowrap}
[data-vibeui-block="datagrid-022"] [data-part="input"]{
width:100%;min-width:6rem;font:inherit;font-size:0.8125rem;color:inherit;
padding:0.3125rem 0.5rem;border-radius:0.375rem;
border:1px solid var(--vibeui-datagrid-022-border);background:var(--vibeui-datagrid-022-bg);
}
[data-vibeui-block="datagrid-022"] [data-part="input"]:focus-visible{outline:2px solid var(--vibeui-datagrid-022-accent);outline-offset:1px}
[data-vibeui-block="datagrid-022"] [data-part="input"][aria-invalid="true"]{
border-color:var(--vibeui-datagrid-022-bad);background:var(--vibeui-datagrid-022-badbg);
}
[data-vibeui-block="datagrid-022"] [data-part="error"]{
display:flex;align-items:flex-start;gap:0.25rem;
margin:0.25rem 0 0.1875rem;font-size:0.6875rem;line-height:1.3;color:var(--vibeui-datagrid-022-bad);
}
[data-vibeui-block="datagrid-022"] [data-part="error"]::before{content:"!";flex:none;font-weight:700}
[data-vibeui-block="datagrid-022"] [data-part="ok"]{
margin:0.25rem 0 0.1875rem;font-size:0.6875rem;line-height:1.3;color:transparent;
}
[data-vibeui-block="datagrid-022"] [data-align="end"] [data-part="input"]{text-align:right;font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-022"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Datagrid022Row[] = [
  {
    id: "e1",
    employee: "Гусева А.",
    email: "guseva@studio.ru",
    rate: "1800",
    hours: "148",
  },
  {
    id: "e2",
    employee: "Лапин К.",
    email: "lapin(at)studio.ru",
    rate: "2100",
    hours: "160",
  },
  {
    id: "e3",
    employee: "Орлова М.",
    email: "orlova@studio.ru",
    rate: "-400",
    hours: "132",
  },
  {
    id: "e4",
    employee: "Сафин Р.",
    email: "safin@studio.ru",
    rate: "1950",
    hours: "290",
  },
]

type Field = "email" | "rate" | "hours"

/**
 * Сетка с валидацией ячейки на месте: ошибка стоит под значением,
 * поле помечено aria-invalid, сохранение заблокировано. Один файл.
 */
export function Datagrid022({
  rows = DEFAULT_ROWS,
  caption = "Ошибка показывается в той же ячейке, где стоит значение",
  maxHours = 200,
  accent,
  className,
  style,
  ...props
}: Datagrid022Props) {
  const [values, setValues] = useState(rows)
  const [saved, setSaved] = useState(false)
  const base = useId()

  function validate(row: Datagrid022Row, field: Field) {
    if (field === "email") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)
        ? ""
        : "Нужен адрес вида имя@домен.ru"
    }

    const number = Number(row[field])

    if (row[field].trim() === "" || Number.isNaN(number)) {
      return "Нужно число"
    }

    if (field === "rate" && number <= 0) {
      return "Ставка должна быть больше нуля"
    }

    if (field === "hours" && (number < 0 || number > maxHours)) {
      return `Часов не больше ${maxHours}`
    }

    return ""
  }

  const problems = values.flatMap((row) =>
    (["email", "rate", "hours"] as Field[])
      .map((field) => validate(row, field))
      .filter(Boolean),
  )

  const palette = {
    ...(accent ? { "--vibeui-datagrid-022-accent": accent } : null),
    ...style,
  } as CSSProperties

  function cell(
    row: Datagrid022Row,
    field: Field,
    label: string,
    numeric: boolean,
  ) {
    const error = validate(row, field)
    const errorId = `${base}-${row.id}-${field}`

    return (
      <td data-align={numeric ? "end" : undefined}>
        <input
          data-part="input"
          type="text"
          inputMode={numeric ? "numeric" : "email"}
          value={row[field]}
          aria-label={`${label}, ${row.employee}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => {
            setSaved(false)
            setValues((current) =>
              current.map((item) =>
                item.id === row.id
                  ? { ...item, [field]: event.target.value }
                  : item,
              ),
            )
          }}
        />
        {error ? (
          <p data-part="error" id={errorId}>
            {error}
          </p>
        ) : (
          <p data-part="ok" aria-hidden="true">
            ок
          </p>
        )}
      </td>
    )
  }

  return (
    <>
      <style href="vibeui-datagrid-022" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="datagrid-022"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <h3 data-part="title">Табель за март</h3>
          <p
            data-part="status"
            data-bad={problems.length > 0 ? "true" : undefined}
            role="status"
            aria-live="polite"
          >
            {problems.length > 0
              ? `Ошибок в ячейках: ${problems.length}`
              : saved
                ? "Табель сохранён"
                : "Ошибок нет"}
          </p>
          <button
            type="button"
            data-part="save"
            disabled={problems.length > 0}
            onClick={() => setSaved(true)}
          >
            Сохранить табель
          </button>
        </div>
        <div
          data-part="scroll"
          role="region"
          aria-label="Таблица табеля, прокручивается вбок"
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col">Сотрудник</th>
                <th scope="col">Почта</th>
                <th scope="col" data-align="end">
                  Ставка, ₽/ч
                </th>
                <th scope="col" data-align="end">
                  Часы
                </th>
              </tr>
            </thead>
            <tbody>
              {values.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.employee}</th>
                  {cell(row, "email", "Почта", false)}
                  {cell(row, "rate", "Ставка", true)}
                  {cell(row, "hours", "Часы", true)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
