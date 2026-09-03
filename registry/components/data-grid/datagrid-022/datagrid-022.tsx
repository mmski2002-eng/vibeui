"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Datagrid022Row = {
  id: string
  employee: string
  email: string
  rate: string
  hours: string
}

export type Datagrid022Props = Omit<ComponentProps<"section">, "children"> & {
  rows?: Datagrid022Row[]
  caption?: string
  maxHours?: number
  /** Заголовок панели над таблицей. */
  heading?: string
  /** Тексты ошибок по ключу. В hours подставляется {max}. */
  errorText?: Record<string, string>
  /** Счётчик ошибок. {count} — число. */
  errorsTemplate?: string
  /** Строка панели после сохранения. */
  savedText?: string
  /** Строка панели, когда ошибок нет. */
  okText?: string
  /** Подпись кнопки сохранения. */
  saveText?: string
  /** Заголовки колонок по ключу: компонент несёт русские. */
  columnText?: Record<string, string>
  /** Подпись поля в ячейке. {field} и {employee} — подстановки. */
  cellLabel?: string
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Пусто — подложки нет, сетка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: ошибка живёт в той же ячейке, что и значение, а не в
// сводке над таблицей. Поле помечается aria-invalid и связывается с текстом
// ошибки через aria-describedby — иначе красная рамка для скринридера
// ничего не значит. Сохранение блокируется, пока есть хоть одна ошибка,
// и счётчик ошибок объявлен отдельно: пользователь должен знать, сколько
// ячеек ещё надо починить.
//
// Тема берётся из color-scheme окружения через light-dark(): сетка темнеет
// вместе со страницей и не носит собственной подложки.
const STYLES = `
:where([data-vibeui-block="datagrid-022"]){
--vibeui-datagrid-022-bg:transparent;
--vibeui-datagrid-022-fg:light-dark(oklch(0.23 0.014 285),oklch(0.93 0.006 285));
--vibeui-datagrid-022-muted:color-mix(in oklab,var(--vibeui-datagrid-022-fg) 68%,transparent);
--vibeui-datagrid-022-border:light-dark(oklch(0.92 0.006 285),oklch(0.35 0.012 285));
--vibeui-datagrid-022-head:light-dark(oklch(0.975 0.003 285),oklch(0.27 0.012 285));
--vibeui-datagrid-022-accent:light-dark(oklch(0.5 0.15 215),oklch(0.76 0.13 215));
--vibeui-datagrid-022-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.014 285));
--vibeui-datagrid-022-bad:light-dark(oklch(0.53 0.19 27),oklch(0.76 0.16 27));
--vibeui-datagrid-022-badbg:light-dark(oklch(0.97 0.03 27),oklch(0.31 0.055 27));
--vibeui-datagrid-022-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="datagrid-022"]{color-scheme:dark}
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
background:var(--vibeui-datagrid-022-accent);color:var(--vibeui-datagrid-022-on-accent);
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
border:1px solid var(--vibeui-datagrid-022-border);background:transparent;
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

const COLUMN_TEXT: Record<string, string> = {
  employee: "Сотрудник",
  email: "Почта",
  rate: "Ставка, ₽/ч",
  hours: "Часы",
}

const ERROR_TEXT: Record<string, string> = {
  email: "Нужен адрес вида имя@домен.ru",
  number: "Нужно число",
  rate: "Ставка должна быть больше нуля",
  hours: "Часов не больше {max}",
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
 * Сетка с валидацией ячейки на месте: ошибка стоит под значением,
 * поле помечено aria-invalid, сохранение заблокировано. Один файл.
 */
export function Datagrid022({
  rows = DEFAULT_ROWS,
  caption = "Ошибка показывается в той же ячейке, где стоит значение",
  maxHours = 200,
  heading = "Табель за март",
  errorText = ERROR_TEXT,
  errorsTemplate = "Ошибок в ячейках: {count}",
  savedText = "Табель сохранён",
  okText = "Ошибок нет",
  saveText = "Сохранить табель",
  columnText = COLUMN_TEXT,
  cellLabel = "{field}, {employee}",
  scrollLabel = "Таблица табеля, прокручивается вбок",
  background = "",
  accent,
  className,
  style,
  ...props
}: Datagrid022Props) {
  // Правки читателя живут рядом с пропом, а не вместо него: смена rows
  // снаружи обязана переставить таблицу, иначе проп сработал бы один раз.
  const [edited, setEdited] = useState<Datagrid022Row[] | null>(null)
  const [seed, setSeed] = useState(rows)
  const [saved, setSaved] = useState(false)
  const base = useId()

  if (seed !== rows) {
    setSeed(rows)
    setEdited(null)
    setSaved(false)
  }

  const values = edited ?? rows
  const message = (key: string) => errorText[key] ?? ERROR_TEXT[key]

  function validate(row: Datagrid022Row, field: Field) {
    if (field === "email") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)
        ? ""
        : message("email")
    }

    const number = Number(row[field])

    if (row[field].trim() === "" || Number.isNaN(number)) {
      return message("number")
    }

    if (field === "rate" && number <= 0) {
      return message("rate")
    }

    if (field === "hours" && (number < 0 || number > maxHours)) {
      return message("hours").replace("{max}", String(maxHours))
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
    ...(background
      ? {
          "--vibeui-datagrid-022-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
          aria-label={cellLabel
            .replace("{field}", label)
            .replace("{employee}", row.employee)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => {
            setSaved(false)
            setEdited((current) =>
              (current ?? rows).map((item) =>
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
        data-slot="data-grid"
        data-vibeui-block="datagrid-022"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <h3 data-part="title">{heading}</h3>
          <p
            data-part="status"
            data-bad={problems.length > 0 ? "true" : undefined}
            role="status"
            aria-live="polite"
          >
            {problems.length > 0
              ? errorsTemplate.replace("{count}", String(problems.length))
              : saved
                ? savedText
                : okText}
          </p>
          <button
            type="button"
            data-part="save"
            disabled={problems.length > 0}
            onClick={() => setSaved(true)}
          >
            {saveText}
          </button>
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
                <th scope="col">
                  {columnText.employee ?? COLUMN_TEXT.employee}
                </th>
                <th scope="col">{columnText.email ?? COLUMN_TEXT.email}</th>
                <th scope="col" data-align="end">
                  {columnText.rate ?? COLUMN_TEXT.rate}
                </th>
                <th scope="col" data-align="end">
                  {columnText.hours ?? COLUMN_TEXT.hours}
                </th>
              </tr>
            </thead>
            <tbody>
              {values.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.employee}</th>
                  {cell(
                    row,
                    "email",
                    columnText.email ?? COLUMN_TEXT.email,
                    false,
                  )}
                  {cell(row, "rate", columnText.rate ?? COLUMN_TEXT.rate, true)}
                  {cell(
                    row,
                    "hours",
                    columnText.hours ?? COLUMN_TEXT.hours,
                    true,
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
