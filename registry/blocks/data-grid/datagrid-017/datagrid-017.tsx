"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Datagrid017Row = {
  id: string
  contract: string
  counterparty: string
  signed: string
  amount: number
}

export type Datagrid017Props = Omit<ComponentProps<"section">, "children"> & {
  rows?: Datagrid017Row[]
  caption?: string
  exportLabel?: string
  /** Заголовок панели над таблицей. */
  heading?: string
  /** Счётчик отмеченных строк. {count} и {total} — числа. */
  statusTemplate?: string
  /** Строка после выгрузки. {count} — число строк, {format} — формат. */
  doneTemplate?: string
  /** Заголовки колонок по ключу: компонент несёт русские. */
  columnText?: Record<string, string>
  /** Подпись флажка строки. {contract} — номер договора. */
  pickLabel?: string
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Заголовок диалога. {count} — число строк. */
  dialogTitleTemplate?: string
  /** Текст диалога. {amount} — сумма, {size} — размер файла. */
  dialogTextTemplate?: string
  /** Заголовок группы форматов. */
  formatsText?: string
  /** Подпись кнопки отмены. */
  cancelText?: string
  /** Подпись кнопки подтверждения. */
  confirmText?: string
  /** Пусто — подложки нет, сетка лежит прямо на фоне страницы. */
  background?: string
  /** Открыть панель сразу и без модального режима: она остаётся внутри блока. */
  defaultOpen?: boolean
  accent?: string
}

// Идея компонента: выгрузка отмеченных строк не запускается кнопкой сразу —
// между кликом и действием стоит подтверждение, которое называет число
// строк, формат и оценочный размер. Диалог нативный: showModal сам
// ловит фокус, закрывает по Escape и рисует ::backdrop. Ему обязательно
// нужен margin:auto — иначе он липнет к левому верхнему углу.
//
// Тема берётся из color-scheme окружения через light-dark(): сетка темнеет
// вместе со страницей и не носит собственной подложки.
//
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="datagrid-017"]){
--vibeui-datagrid-017-bg:transparent;
--vibeui-datagrid-017-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
--vibeui-datagrid-017-muted:color-mix(in oklab,var(--vibeui-datagrid-017-fg) 68%,transparent);
--vibeui-datagrid-017-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-datagrid-017-head:light-dark(oklch(0.975 0 285),oklch(0.27 0 285));
--vibeui-datagrid-017-panel:light-dark(oklch(1 0 0),oklch(0.24 0 285));
--vibeui-datagrid-017-accent:light-dark(oklch(0.275 0 0),oklch(0.899 0 0));
--vibeui-datagrid-017-on-accent:oklch(from var(--vibeui-datagrid-017-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-datagrid-017-pick:light-dark(oklch(0.97 0 255),oklch(0.3 0 0));
--vibeui-datagrid-017-shadow:light-dark(oklch(0.23 0 285 / 24%),oklch(0 0 0 / 60%));
--vibeui-datagrid-017-veil:light-dark(oklch(0.23 0 285 / 45%),oklch(0.1 0 285 / 65%));
--vibeui-datagrid-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="datagrid-017"]{color-scheme:dark}
[data-vibeui-block="datagrid-017"]{
box-sizing:border-box;width:100%;max-width:52rem;margin:0 auto;
background:var(--vibeui-datagrid-017-bg);color:var(--vibeui-datagrid-017-fg);
border:1px solid var(--vibeui-datagrid-017-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-017-font);overflow:hidden;
}
[data-vibeui-block="datagrid-017"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-017"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-017"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-017-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-017"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-017"] caption{
padding:0.625rem 0.875rem;text-align:left;font-size:0.75rem;color:var(--vibeui-datagrid-017-muted);caption-side:top;
}
[data-vibeui-block="datagrid-017"] th,
[data-vibeui-block="datagrid-017"] td{
padding:0.5rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-datagrid-017-border);
}
[data-vibeui-block="datagrid-017"] thead th{background:var(--vibeui-datagrid-017-head);font-weight:600}
[data-vibeui-block="datagrid-017"] [data-part="check"]{width:2.5rem;padding-inline:0.75rem}
[data-vibeui-block="datagrid-017"] input[type="checkbox"]{
width:0.9375rem;height:0.9375rem;margin:0;accent-color:var(--vibeui-datagrid-017-accent);cursor:pointer;
}
[data-vibeui-block="datagrid-017"] input[type="checkbox"]:focus-visible{outline:2px solid var(--vibeui-datagrid-017-accent);outline-offset:2px}
[data-vibeui-block="datagrid-017"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-017"] tbody tr[data-picked="true"] td,
[data-vibeui-block="datagrid-017"] tbody tr[data-picked="true"] th{background:var(--vibeui-datagrid-017-pick)}
[data-vibeui-block="datagrid-017"] [data-part="code"]{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:0.75rem}
/* Нативный dialog без margin:auto липнет к левому верхнему углу. */
[data-vibeui-block="datagrid-017"] dialog{
margin:auto;width:min(24rem,calc(100vw - 2rem));padding:1rem 1.125rem 1.125rem;
border:1px solid var(--vibeui-datagrid-017-border);border-radius:0.875rem;
background:var(--vibeui-datagrid-017-panel);color:var(--vibeui-datagrid-017-fg);
font-family:var(--vibeui-datagrid-017-font);box-shadow:0 24px 60px var(--vibeui-datagrid-017-shadow);
}
[data-vibeui-block="datagrid-017"] dialog::backdrop{background:var(--vibeui-datagrid-017-veil)}
[data-vibeui-block="datagrid-017"] [data-part="dialog-title"]{margin:0 0 0.375rem;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="datagrid-017"] [data-part="dialog-text"]{margin:0 0 0.75rem;font-size:0.8125rem;color:var(--vibeui-datagrid-017-muted);line-height:1.45}
[data-vibeui-block="datagrid-017"] [data-part="format-form"]{display:contents}
[data-vibeui-block="datagrid-017"] [data-part="formats"]{border:0;margin:0 0 0.875rem;padding:0;display:flex;gap:0.5rem;flex-wrap:wrap}
[data-vibeui-block="datagrid-017"] [data-part="formats"] legend{padding:0;margin-bottom:0.375rem;font-size:0.6875rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:var(--vibeui-datagrid-017-muted);float:left;width:100%}
/* legend с float:left заставляет соседей обтекать — сбрасываем поток. */
[data-vibeui-block="datagrid-017"] [data-part="formats"] label{clear:both;display:inline-flex;align-items:center;gap:0.375rem;font-size:0.8125rem;cursor:pointer}
[data-vibeui-block="datagrid-017"] [data-part="formats"] input{accent-color:var(--vibeui-datagrid-017-accent);margin:0}
[data-vibeui-block="datagrid-017"] [data-part="formats"] input:focus-visible{outline:2px solid var(--vibeui-datagrid-017-accent);outline-offset:2px}
[data-vibeui-block="datagrid-017"] [data-part="actions"]{display:flex;gap:0.5rem;justify-content:flex-end}
[data-vibeui-block="datagrid-017"] [data-part="cancel"],
[data-vibeui-block="datagrid-017"] [data-part="confirm"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:600;
padding:0.4375rem 0.875rem;border-radius:0.5rem;border:1px solid var(--vibeui-datagrid-017-border);
background:transparent;color:var(--vibeui-datagrid-017-fg);
}
[data-vibeui-block="datagrid-017"] [data-part="confirm"]{
border-color:transparent;background:var(--vibeui-datagrid-017-accent);color:oklch(from var(--vibeui-datagrid-017-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
[data-vibeui-block="datagrid-017"] [data-part="cancel"]:focus-visible,
[data-vibeui-block="datagrid-017"] [data-part="confirm"]:focus-visible{outline:2px solid var(--vibeui-datagrid-017-accent);outline-offset:2px}
/* Немодальный показ: панель остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так её показывают на витрине и в документации. */
[data-vibeui-block="datagrid-017"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:22rem;
}
[data-vibeui-block="datagrid-017"] dialog:not(:modal){position:absolute;max-width:100%;max-height:100%;z-index:1}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-017"] *{animation:none!important;transition:none!important}}
[data-vibeui-block="datagrid-017"] [data-part="bar"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-datagrid-017-border);}
[data-vibeui-block="datagrid-017"] [data-part="bar"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="datagrid-017"] [data-part="bar"] [data-part="status"]{margin:0;font-size:0.75rem;color:var(--vibeui-datagrid-017-muted)}
[data-vibeui-block="datagrid-017"] [data-part="bar"] [data-part="go"]{appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:600;
padding:0.375rem 0.75rem;border-radius:0.5rem;border:1px solid transparent;
background:var(--vibeui-datagrid-017-accent);color:oklch(from var(--vibeui-datagrid-017-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="datagrid-017"] [data-part="bar"] [data-part="go"]:disabled{opacity:.4;cursor:not-allowed}
[data-vibeui-block="datagrid-017"] [data-part="bar"] [data-part="go"]:focus-visible{outline:2px solid var(--vibeui-datagrid-017-accent);outline-offset:2px}
[data-vibeui-block="datagrid-017"] [data-part="bar"] [data-part="go"]{display:none}
`

const DEFAULT_ROWS: Datagrid017Row[] = [
  {
    id: "d1",
    contract: "ДГ-1104",
    counterparty: "Артель «Кама»",
    signed: "04.02.2026",
    amount: 1240000,
  },
  {
    id: "d2",
    contract: "ДГ-1105",
    counterparty: "Ювенко Логистика",
    signed: "11.02.2026",
    amount: 386000,
  },
  {
    id: "d3",
    contract: "ДГ-1106",
    counterparty: "Северный Порт",
    signed: "19.02.2026",
    amount: 2015000,
  },
  {
    id: "d4",
    contract: "ДГ-1107",
    counterparty: "Гранд-Сервис",
    signed: "27.02.2026",
    amount: 94000,
  },
  {
    id: "d5",
    contract: "ДГ-1108",
    counterparty: "Мостовик",
    signed: "03.03.2026",
    amount: 771000,
  },
]

const COLUMN_TEXT: Record<string, string> = {
  check: "Выбор",
  contract: "Договор",
  counterparty: "Контрагент",
  signed: "Подписан",
  amount: "Сумма, ₽",
}

const FORMATS = [
  { value: "csv", label: "CSV", bytes: 140 },
  { value: "json", label: "JSON", bytes: 320 },
  { value: "xlsx", label: "XLSX", bytes: 620 },
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
 * Сетка с выгрузкой отмеченных строк через подтверждение в нативном
 * диалоге: число строк, формат и размер названы заранее. Один файл.
 */
export type BarRow = {
  id: string
  contract: string
  counterparty: string
  signed: string
  amount: number
}

const BarDEFAULT_ROWS: BarRow[] = [
  {
    id: "d1",
    contract: "ДГ-1104",
    counterparty: "Артель «Кама»",
    signed: "04.02.2026",
    amount: 1240000,
  },
  {
    id: "d2",
    contract: "ДГ-1105",
    counterparty: "Ювенко Логистика",
    signed: "11.02.2026",
    amount: 386000,
  },
  {
    id: "d3",
    contract: "ДГ-1106",
    counterparty: "Северный Порт",
    signed: "19.02.2026",
    amount: 2015000,
  },
  {
    id: "d4",
    contract: "ДГ-1107",
    counterparty: "Гранд-Сервис",
    signed: "27.02.2026",
    amount: 94000,
  },
  {
    id: "d5",
    contract: "ДГ-1108",
    counterparty: "Мостовик",
    signed: "03.03.2026",
    amount: 771000,
  },
]

type BarProps = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  statusTemplate?: string
  rows?: BarRow[]
  exportLabel?: string
  done?: string
  selected?: BarRow[]
  onExport?: () => void
  setDone?: (value: string) => void
  accent?: string
  className?: string
  style?: CSSProperties
}

function Bar({
  heading = "Договоры",
  statusTemplate = "Отмечено: {count} из {total}",
  rows = BarDEFAULT_ROWS,
  exportLabel = "Экспортировать",
  done = "",
  selected = [],
  onExport,
  setDone = () => {},
  accent,
  className,
  style,
  ...props
}: BarProps) {
  const palette = {
    ...(accent ? { "--vibeui-datagrid-017-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
      <div
      {...props}
      className={className}
      style={palette}
      >
        <h3 data-part="title">{heading}</h3>
        <p data-part="status" role="status" aria-live="polite">
          {done ||
            statusTemplate
              .replace("{count}", String(selected.length))
              .replace("{total}", String(rows.length))}
        </p>
        <button
          type="button"
          data-part="go"
          disabled={selected.length === 0}
          onClick={() => {
            setDone("")
            onExport?.()
          }}
        >
          {exportLabel}
        </button>
      </div>
  )
}

export function Datagrid017({
  rows = DEFAULT_ROWS,
  caption = "Отметьте договоры и нажмите «Экспортировать»",
  exportLabel = "Экспортировать",
  heading = "Договоры",
  statusTemplate = "Отмечено: {count} из {total}",
  doneTemplate = "Выгружено {count} стр. в формате {format}",
  columnText = COLUMN_TEXT,
  pickLabel = "Включить договор {contract} в выгрузку",
  scrollLabel = "Таблица договоров, прокручивается вбок",
  dialogTitleTemplate = "Выгрузить {count} стр.?",
  dialogTextTemplate = "В файл попадут только отмеченные договоры на сумму {amount} ₽. Ориентировочный размер — около {size} КБ.",
  formatsText = "Формат файла",
  cancelText = "Отмена",
  confirmText = "Выгрузить",
  background = "",
  defaultOpen = false,
  accent,
  className,
  style,
  ...props
}: Datagrid017Props) {
  const [picked, setPicked] = useState<string[]>(["d1", "d3"])
  const [format, setFormat] = useState("csv")
  const [done, setDone] = useState("")
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!defaultOpen) {
      return
    }

    const active = document.activeElement

    // show() вместо showModal(): немодальная панель живёт внутри своего блока
    // и не уводит страницу в верхний слой. Витрине нужна именно такая.
    dialogRef.current?.show()

    // show() уводит фокус внутрь панели. Для немодального показа это лишнее:
    // страница не должна прыгать к панели просто потому, что та открыта.
    if (active instanceof HTMLElement && active !== document.body) {
      active.focus()
    } else if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [defaultOpen])

  const selected = rows.filter((row) => picked.includes(row.id))
  const size = FORMATS.find((item) => item.value === format)?.bytes ?? 0

  const palette = {
    ...(accent ? { "--vibeui-datagrid-017-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-datagrid-017-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-017" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="data-grid"
        data-vibeui-block="datagrid-017"
        className={className}
        style={palette}
      >
        <Bar data-part="bar" onExport={() => dialogRef.current?.showModal()} heading={heading} statusTemplate={statusTemplate} rows={rows} exportLabel={exportLabel} done={done} selected={selected} setDone={setDone} accent={accent} />
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
                <th scope="col" data-part="check">
                  <span hidden>{columnText.check ?? COLUMN_TEXT.check}</span>
                </th>
                <th scope="col">
                  {columnText.contract ?? COLUMN_TEXT.contract}
                </th>
                <th scope="col">
                  {columnText.counterparty ?? COLUMN_TEXT.counterparty}
                </th>
                <th scope="col">{columnText.signed ?? COLUMN_TEXT.signed}</th>
                <th scope="col" data-align="end">
                  {columnText.amount ?? COLUMN_TEXT.amount}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const on = picked.includes(row.id)

                return (
                  <tr key={row.id} data-picked={on ? "true" : undefined}>
                    <td data-part="check">
                      <input
                        type="checkbox"
                        checked={on}
                        aria-label={pickLabel.replace(
                          "{contract}",
                          row.contract,
                        )}
                        onChange={() =>
                          setPicked((current) =>
                            current.includes(row.id)
                              ? current.filter((id) => id !== row.id)
                              : [...current, row.id],
                          )
                        }
                      />
                    </td>
                    <th scope="row" data-part="code">
                      {row.contract}
                    </th>
                    <td>{row.counterparty}</td>
                    <td>{row.signed}</td>
                    <td data-align="end">
                      {row.amount.toLocaleString("ru-RU")}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <dialog ref={dialogRef} aria-labelledby="vibeui-datagrid-017-heading">
          <h4 data-part="dialog-title" id="vibeui-datagrid-017-heading">
            {dialogTitleTemplate.replace("{count}", String(selected.length))}
          </h4>
          <p data-part="dialog-text">
            {dialogTextTemplate
              .replace(
                "{amount}",
                selected
                  .reduce((total, row) => total + row.amount, 0)
                  .toLocaleString("ru-RU"),
              )
              .replace(
                "{size}",
                String(
                  Math.max(1, Math.round((selected.length * size) / 100) / 10),
                ),
              )}
          </p>
          <form data-part="format-form">
            <fieldset data-part="formats">
              <legend>{formatsText}</legend>
              {FORMATS.map((item) => (
                <label key={item.value}>
                  <input
                    type="radio"
                    name="vibeui-datagrid-017-format"
                    value={item.value}
                    checked={format === item.value}
                    onChange={() => setFormat(item.value)}
                  />
                  {item.label}
                </label>
              ))}
            </fieldset>
          </form>
          <div data-part="actions">
            <button
              type="button"
              data-part="cancel"
              onClick={() => dialogRef.current?.close()}
            >
              {cancelText}
            </button>
            <button
              type="button"
              data-part="confirm"
              onClick={() => {
                setDone(
                  doneTemplate
                    .replace("{count}", String(selected.length))
                    .replace("{format}", format.toUpperCase()),
                )
                dialogRef.current?.close()
              }}
            >
              {confirmText}
            </button>
          </div>
        </dialog>
      </section>
    </>
  )
}
