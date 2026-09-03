"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Datagrid027Row = {
  id: string
  document: string
  author: string
  note: string
  size: string
  changed: string
}

export type Datagrid027Props = Omit<ComponentProps<"section">, "children"> & {
  rows?: Datagrid027Row[]
  caption?: string
  density?: "compact" | "regular" | "roomy"
  /** Заголовок панели над таблицей. */
  heading?: string
  /** Подпись переключателя плотности. */
  densityLegend?: string
  /** Подписи режимов плотности по ключу: компонент несёт русские. */
  densityText?: Record<string, string>
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Заголовки колонок по ключу: компонент несёт русские. */
  columnText?: Record<string, string>
  /** Строка состояния. {density} — режим, {height} — высота строки. */
  metricsText?: string
  /** Хвост строки состояния про примечание. */
  noteShownText?: string
  noteHiddenText?: string
  /** Пусто — подложки нет, таблица лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: плотность — это не только отступ. Переключатель меняет
// сразу три переменные: вертикальный отступ, размер шрифта и высоту
// строки, а на просторной плотности показывает вторую строку с примечанием,
// которой в компактном режиме нет. Переключатель собран радиокнопками в
// fieldset: это выбор одного из трёх, а не три независимые кнопки.
//
// Тема берётся из color-scheme окружения через light-dark(): таблица темнеет
// вместе со страницей и не носит собственной подложки.
const STYLES = `
:where([data-vibeui-block="datagrid-027"]){
--vibeui-datagrid-027-bg:transparent;
--vibeui-datagrid-027-fg:light-dark(oklch(0.23 0.014 285),oklch(0.93 0.006 285));
--vibeui-datagrid-027-muted:color-mix(in oklab,var(--vibeui-datagrid-027-fg) 68%,transparent);
--vibeui-datagrid-027-border:light-dark(oklch(0.92 0.006 285),oklch(0.35 0.012 285));
--vibeui-datagrid-027-head:light-dark(oklch(0.975 0.003 285),oklch(0.27 0.012 285));
--vibeui-datagrid-027-accent:light-dark(oklch(0.5 0.14 145),oklch(0.75 0.13 145));
--vibeui-datagrid-027-chip:light-dark(oklch(0.96 0.03 145),oklch(0.31 0.04 145));
--vibeui-datagrid-027-pad:0.5rem;
--vibeui-datagrid-027-size:0.8125rem;
--vibeui-datagrid-027-lead:1.4;
--vibeui-datagrid-027-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="datagrid-027"]{color-scheme:dark}
[data-vibeui-block="datagrid-027"]{
box-sizing:border-box;width:100%;max-width:50rem;margin:0 auto;
background:var(--vibeui-datagrid-027-bg);color:var(--vibeui-datagrid-027-fg);
border:1px solid var(--vibeui-datagrid-027-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-027-font);overflow:hidden;
}
[data-vibeui-block="datagrid-027"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-027"][data-density="compact"]{
--vibeui-datagrid-027-pad:0.25rem;--vibeui-datagrid-027-size:0.75rem;--vibeui-datagrid-027-lead:1.25;
}
[data-vibeui-block="datagrid-027"][data-density="roomy"]{
--vibeui-datagrid-027-pad:0.875rem;--vibeui-datagrid-027-size:0.875rem;--vibeui-datagrid-027-lead:1.55;
}
[data-vibeui-block="datagrid-027"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-datagrid-027-border);
}
[data-vibeui-block="datagrid-027"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="datagrid-027"] [data-part="switch"]{
border:1px solid var(--vibeui-datagrid-027-border);border-radius:0.5rem;
margin:0;padding:0.1875rem;display:flex;gap:0.1875rem;
}
[data-vibeui-block="datagrid-027"] [data-part="switch"] legend{
padding:0 0.25rem;font-size:0.625rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-datagrid-027-muted);
}
[data-vibeui-block="datagrid-027"] [data-part="switch"] label{
display:inline-flex;align-items:center;gap:0.3125rem;cursor:pointer;
padding:0.25rem 0.5rem;border-radius:0.375rem;font-size:0.75rem;color:var(--vibeui-datagrid-027-muted);
}
[data-vibeui-block="datagrid-027"] [data-part="switch"] label:has(input:checked){
background:var(--vibeui-datagrid-027-chip);color:var(--vibeui-datagrid-027-accent);font-weight:600;
}
[data-vibeui-block="datagrid-027"] [data-part="switch"] input{accent-color:var(--vibeui-datagrid-027-accent);margin:0;width:0.8125rem;height:0.8125rem}
[data-vibeui-block="datagrid-027"] [data-part="switch"] input:focus-visible{outline:2px solid var(--vibeui-datagrid-027-accent);outline-offset:2px}
[data-vibeui-block="datagrid-027"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-027"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-027-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-027"] table{
width:100%;border-collapse:collapse;
font-size:var(--vibeui-datagrid-027-size);line-height:var(--vibeui-datagrid-027-lead);
}
[data-vibeui-block="datagrid-027"] caption{
padding:0.625rem 0.875rem;text-align:left;font-size:0.75rem;color:var(--vibeui-datagrid-027-muted);caption-side:top;
}
[data-vibeui-block="datagrid-027"] th,
[data-vibeui-block="datagrid-027"] td{
padding:var(--vibeui-datagrid-027-pad) 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-datagrid-027-border);
}
[data-vibeui-block="datagrid-027"] thead th{background:var(--vibeui-datagrid-027-head);font-weight:600}
[data-vibeui-block="datagrid-027"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-027"] [data-part="note"]{
display:block;margin-top:0.1875rem;font-size:0.6875rem;font-weight:400;color:var(--vibeui-datagrid-027-muted);
white-space:normal;
}
[data-vibeui-block="datagrid-027"] [data-part="author"]{color:var(--vibeui-datagrid-027-muted)}
[data-vibeui-block="datagrid-027"] [data-part="metrics"]{
margin:0;padding:0.5rem 0.875rem 0.625rem;border-top:1px solid var(--vibeui-datagrid-027-border);
font-size:0.6875rem;color:var(--vibeui-datagrid-027-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-027"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Datagrid027Row[] = [
  {
    id: "f1",
    document: "Договор поставки 2026",
    author: "Ким",
    note: "Согласован с юристами, ждём подпись контрагента",
    size: "412 КБ",
    changed: "12 марта",
  },
  {
    id: "f2",
    document: "Спецификация партии №14",
    author: "Лапина",
    note: "Обновлены цены по позициям 3 и 7",
    size: "88 КБ",
    changed: "11 марта",
  },
  {
    id: "f3",
    document: "Акт сверки за февраль",
    author: "Мещеряков",
    note: "Расхождение 14 200 ₽, отправлено на уточнение",
    size: "57 КБ",
    changed: "9 марта",
  },
  {
    id: "f4",
    document: "Регламент приёмки",
    author: "Гараев",
    note: "Черновик, раздел про возвраты не дописан",
    size: "1,2 МБ",
    changed: "6 марта",
  },
  {
    id: "f5",
    document: "Протокол встречи 04.03",
    author: "Ким",
    note: "Решения зафиксированы, задачи заведены",
    size: "24 КБ",
    changed: "4 марта",
  },
]

const MODES = [
  { value: "compact", height: "≈28 px" },
  { value: "regular", height: "≈36 px" },
  { value: "roomy", height: "≈48 px" },
] as const

const DENSITY_TEXT: Record<string, string> = {
  compact: "Компактно",
  regular: "Обычно",
  roomy: "Просторно",
}

const COLUMN_TEXT: Record<string, string> = {
  document: "Документ",
  author: "Автор",
  changed: "Изменён",
  size: "Размер",
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
 * Сетка с переключателем плотности: отступ, кегль и высота строки меняются
 * вместе, на просторной плотности появляется примечание. Один файл.
 */
export function Datagrid027({
  rows = DEFAULT_ROWS,
  caption = "Плотность меняет отступ, кегль и высоту строки одновременно",
  density = "regular",
  heading = "Документы сделки",
  densityLegend = "Плотность",
  densityText = DENSITY_TEXT,
  scrollLabel = "Таблица документов, прокручивается вбок",
  columnText = COLUMN_TEXT,
  metricsText = "Плотность: {density}, высота строки {height}",
  noteShownText = ", примечание показано",
  noteHiddenText = ", примечание скрыто",
  background = "",
  accent,
  className,
  style,
  ...props
}: Datagrid027Props) {
  const [mode, setMode] = useState<(typeof MODES)[number]["value"]>(density)

  const current = MODES.find((item) => item.value === mode) ?? MODES[1]
  const currentLabel = densityText[current.value] ?? DENSITY_TEXT[current.value]

  const palette = {
    ...(accent ? { "--vibeui-datagrid-027-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-datagrid-027-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-027" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="data-grid"
        data-vibeui-block="datagrid-027"
        data-density={mode}
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <h3 data-part="title">{heading}</h3>
          <fieldset data-part="switch">
            <legend>{densityLegend}</legend>
            {MODES.map((item) => (
              <label key={item.value}>
                <input
                  type="radio"
                  name="vibeui-datagrid-027-density"
                  value={item.value}
                  checked={mode === item.value}
                  onChange={() => setMode(item.value)}
                />
                {densityText[item.value] ?? DENSITY_TEXT[item.value]}
              </label>
            ))}
          </fieldset>
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
                  {columnText.document ?? COLUMN_TEXT.document}
                </th>
                <th scope="col">{columnText.author ?? COLUMN_TEXT.author}</th>
                <th scope="col">{columnText.changed ?? COLUMN_TEXT.changed}</th>
                <th scope="col" data-align="end">
                  {columnText.size ?? COLUMN_TEXT.size}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <th scope="row">
                    {row.document}
                    {mode === "roomy" ? (
                      <span data-part="note">{row.note}</span>
                    ) : null}
                  </th>
                  <td data-part="author">{row.author}</td>
                  <td>{row.changed}</td>
                  <td data-align="end">{row.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p data-part="metrics" role="status" aria-live="polite">
          {metricsText
            .replace("{density}", currentLabel.toLowerCase())
            .replace("{height}", current.height)}
          {mode === "roomy" ? noteShownText : noteHiddenText}
        </p>
      </section>
    </>
  )
}
