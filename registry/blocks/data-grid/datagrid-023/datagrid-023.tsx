"use client"

import { useId, useState } from "react"
import { Card181 } from "@/registry/components/card/card-181/card-181"
import type { ComponentProps, CSSProperties } from "react"

export type Datagrid023Row = {
  id: string
  sku: string
  title: string
  quantity: number
}

export type Datagrid023Props = Omit<ComponentProps<"section">, "children"> & {
  rows?: Datagrid023Row[]
  caption?: string
  separatorHint?: string
  /** Текст, с которым поле вставки открывается. */
  sample?: string
  /** Подпись поля вставки. */
  pasteLabel?: string
  /** Причины отбраковки строки по ключу: fields и quantity. */
  problemText?: Record<string, string>
  /** Подпись кнопки добавления. {count} — число строк. */
  addTemplate?: string
  /** Подпись кнопки очистки поля. */
  clearText?: string
  /** Отчёт разбора: пустое поле, всё разобрано, часть с ошибками. */
  emptyText?: string
  okTemplate?: string
  mixedTemplate?: string
  /** Заголовок строки-ошибки. {line} — номер строки вставки. */
  lineTemplate?: string
  /** Заголовки колонок по ключу: компонент несёт русские. */
  columnText?: Record<string, string>
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Пусто — подложки нет, сетка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: строки добавляются пачкой из буфера обмена, а не по
// одной руками. Между вставкой и таблицей стоит разбор: каждая строка
// текста превращается в предварительную запись, битые строки помечаются
// с номером и причиной, и добавляются только целые. Так вставка из
// таблицы или письма не разъезжается молча.
//
// Тема берётся из color-scheme окружения через light-dark(): сетка темнеет
// вместе со страницей и не носит собственной подложки.
const STYLES = `
:where([data-vibeui-block="datagrid-023"]){
--vibeui-datagrid-023-bg:transparent;
--vibeui-datagrid-023-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
--vibeui-datagrid-023-muted:color-mix(in oklab,var(--vibeui-datagrid-023-fg) 68%,transparent);
--vibeui-datagrid-023-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-datagrid-023-head:light-dark(oklch(0.975 0 285),oklch(0.27 0 285));
--vibeui-datagrid-023-panel:light-dark(oklch(0.985 0 285),oklch(0.26 0 285));
--vibeui-datagrid-023-accent:light-dark(oklch(0.275 0 0),oklch(0.906 0 0));
--vibeui-datagrid-023-on-accent:oklch(from var(--vibeui-datagrid-023-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-datagrid-023-bad:light-dark(oklch(0.53 0.19 27),oklch(0.77 0.16 27));
--vibeui-datagrid-023-badbg:light-dark(oklch(0.97 0.03 27),oklch(0.31 0 0));
--vibeui-datagrid-023-new:light-dark(oklch(0.96 0.04 145),oklch(0.31 0.05 145));
--vibeui-datagrid-023-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="datagrid-023"]{color-scheme:dark}
[data-vibeui-block="datagrid-023"]{
box-sizing:border-box;width:100%;max-width:50rem;margin:0 auto;
background:var(--vibeui-datagrid-023-bg);color:var(--vibeui-datagrid-023-fg);
border:1px solid var(--vibeui-datagrid-023-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-023-font);overflow:hidden;
}
[data-vibeui-block="datagrid-023"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-023"] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:600;
padding:0.375rem 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-datagrid-023-border);
background:transparent;color:var(--vibeui-datagrid-023-fg);
}
[data-vibeui-block="datagrid-023"] button:disabled{opacity:.4;cursor:not-allowed}
[data-vibeui-block="datagrid-023"] button:focus-visible{outline:2px solid var(--vibeui-datagrid-023-accent);outline-offset:2px}
[data-vibeui-block="datagrid-023"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-023"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-023-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-023"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-023"] caption{
padding:0.625rem 0.875rem;text-align:left;font-size:0.75rem;color:var(--vibeui-datagrid-023-muted);caption-side:top;
}
[data-vibeui-block="datagrid-023"] th,
[data-vibeui-block="datagrid-023"] td{
padding:0.4375rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-datagrid-023-border);
}
[data-vibeui-block="datagrid-023"] thead th{background:var(--vibeui-datagrid-023-head);font-weight:600}
[data-vibeui-block="datagrid-023"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-023"] [data-part="sku"]{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:0.75rem}
[data-vibeui-block="datagrid-023"] tbody tr[data-origin="pasted"] td,
[data-vibeui-block="datagrid-023"] tbody tr[data-origin="pasted"] th{background:var(--vibeui-datagrid-023-new)}
[data-vibeui-block="datagrid-023"] tbody tr[data-origin="bad"] td,
[data-vibeui-block="datagrid-023"] tbody tr[data-origin="bad"] th{background:var(--vibeui-datagrid-023-badbg);color:var(--vibeui-datagrid-023-bad)}
[data-vibeui-block="datagrid-023"] [data-part="why"]{font-size:0.6875rem;white-space:normal}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-023"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Datagrid023Row[] = [
  { id: "b1", sku: "MTR-100", title: "Мотор редукторный", quantity: 12 },
  { id: "b2", sku: "BLT-220", title: "Ремень приводной", quantity: 40 },
]

const SAMPLE = [
  "PMP-310\tНасос циркуляционный\t6",
  "VLV-455\tКлапан обратный\t18",
  "SNS-021\tДатчик давления",
  "FLT-777\tФильтр грубой очистки\t25",
].join("\n")

const PROBLEM_TEXT: Record<string, string> = {
  fields: "Ожидались три поля: артикул, название, количество",
  quantity: "Количество должно быть положительным числом",
}

const COLUMN_TEXT: Record<string, string> = {
  sku: "Артикул",
  title: "Наименование",
  quantity: "Количество",
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

type Parsed = {
  line: number
  sku: string
  title: string
  quantity: number
  problem: string
}

function parse(text: string, problems: Record<string, string>): Parsed[] {
  return text
    .split(/\r?\n/)
    .map((raw, index) => ({ raw: raw.trim(), index }))
    .filter((item) => item.raw !== "")
    .map(({ raw, index }) => {
      const parts = raw.split(/\t|;|\s{2,}/).map((part) => part.trim())
      const [sku = "", title = "", quantity = ""] = parts
      const number = Number(quantity)

      let problem = ""

      if (parts.length < 3) {
        problem = problems.fields ?? PROBLEM_TEXT.fields
      } else if (quantity === "" || Number.isNaN(number) || number <= 0) {
        problem = problems.quantity ?? PROBLEM_TEXT.quantity
      }

      return { line: index + 1, sku, title, quantity: number, problem }
    })
}

/**
 * Сетка со вставкой нескольких строк из буфера: разбор с пометкой битых
 * строк перед добавлением в таблицу. Один файл, ноль зависимостей.
 */
export function Datagrid023({
  rows = DEFAULT_ROWS,
  caption = "Вставленные строки помечены заливкой до следующей вставки",
  separatorHint = "артикул ⇥ название ⇥ количество",
  sample = SAMPLE,
  pasteLabel = "Вставьте строки из таблицы или письма",
  problemText = PROBLEM_TEXT,
  addTemplate = "Добавить {count} стр.",
  clearText = "Очистить поле",
  emptyText = "Поле пустое",
  okTemplate = "Разобрано строк: {count}, ошибок нет",
  mixedTemplate = "Готово {good}, с ошибками {bad}",
  lineTemplate = "строка {line}",
  columnText = COLUMN_TEXT,
  scrollLabel = "Таблица номенклатуры, прокручивается вбок",
  background = "",
  accent,
  className,
  style,
  ...props
}: Datagrid023Props) {
  // Добавленные строки и набранный текст живут рядом с пропами, а не
  // вместо них: смена rows или sample снаружи обязана переставить сетку.
  const [added, setAdded] = useState<Datagrid023Row[] | null>(null)
  const [seedRows, setSeedRows] = useState(rows)
  const [pasted, setPasted] = useState<string[]>([])
  const [typed, setTyped] = useState<string | null>(null)
  const [seedText, setSeedText] = useState(sample)
  // Номер вставки, а не время: ключ строки обязан быть предсказуемым и
  // одинаковым на сервере и в браузере.
  const [batch, setBatch] = useState(0)
  const areaId = useId()

  if (seedRows !== rows) {
    setSeedRows(rows)
    setAdded(null)
    setPasted([])
  }

  if (seedText !== sample) {
    setSeedText(sample)
    setTyped(null)
  }

  const table = added ?? rows
  const text = typed ?? sample
  const parsed = parse(text, problemText)
  const good = parsed.filter((item) => item.problem === "")
  const bad = parsed.filter((item) => item.problem !== "")

  const palette = {
    ...(accent ? { "--vibeui-datagrid-023-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-datagrid-023-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-023" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="data-grid"
        data-vibeui-block="datagrid-023"
        className={className}
        style={palette}
      >
        <Card181 data-part="paste" pasteLabel={pasteLabel} separatorHint={separatorHint} rows={rows} addTemplate={addTemplate} clearText={clearText} emptyText={emptyText} okTemplate={okTemplate} mixedTemplate={mixedTemplate} areaId={areaId} bad={bad} batch={batch} good={good} parsed={parsed} setAdded={setAdded} setBatch={setBatch} setPasted={setPasted} setTyped={setTyped} text={text} accent={accent} />
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
                <th scope="col">{columnText.sku ?? COLUMN_TEXT.sku}</th>
                <th scope="col">{columnText.title ?? COLUMN_TEXT.title}</th>
                <th scope="col" data-align="end">
                  {columnText.quantity ?? COLUMN_TEXT.quantity}
                </th>
              </tr>
            </thead>
            <tbody>
              {table.map((row) => (
                <tr
                  key={row.id}
                  data-origin={pasted.includes(row.id) ? "pasted" : undefined}
                >
                  <th scope="row" data-part="sku">
                    {row.sku}
                  </th>
                  <td>{row.title}</td>
                  <td data-align="end">{row.quantity}</td>
                </tr>
              ))}
              {bad.map((item) => (
                <tr key={`bad-${item.line}`} data-origin="bad">
                  <th scope="row" data-part="sku">
                    {lineTemplate.replace("{line}", String(item.line))}
                  </th>
                  <td colSpan={2} data-part="why">
                    {item.problem}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
