"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Togglegroup008Props = Omit<
  ComponentProps<"section">,
  "children" | "onChange"
> & {
  label?: string
  minMessage?: string
  defaultValue?: string[]
  /** Заголовки колонок по идентификатору. */
  columnText?: Record<string, string>
  /** Значения демонстрационной строки по идентификатору колонки. */
  cellText?: Record<string, string>
  /** Итог с подстановками {selected} и {total}. */
  countText?: string
  onChange?: (value: string[]) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: группа с обязательным минимумом. Последняя нажатая кнопка
// не гаснет молча: она помечается aria-disabled и на нажатие отвечает
// объяснением. Убирать её из группы или отключать заранее нельзя — правило
// становится понятным ровно в тот момент, когда в него упираются.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте панель темнеет, а границы становятся светлее фона.
const STYLES = `
:where([data-vibeui-block="togglegroup-008"]){
--vibeui-togglegroup-008-bg:transparent;
--vibeui-togglegroup-008-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-togglegroup-008-muted:color-mix(in oklab,var(--vibeui-togglegroup-008-fg) 68%,transparent);
--vibeui-togglegroup-008-border:light-dark(oklch(0.9 0.006 265),oklch(0.35 0.012 265));
--vibeui-togglegroup-008-surface:light-dark(oklch(0.97 0.004 265),oklch(0.26 0.01 265));
--vibeui-togglegroup-008-raised:light-dark(oklch(1 0 0),oklch(0.29 0.01 265));
--vibeui-togglegroup-008-accent:light-dark(oklch(0.55 0.16 240),oklch(0.75 0.14 240));
--vibeui-togglegroup-008-warn:light-dark(oklch(0.58 0.17 30),oklch(0.75 0.15 30));
--vibeui-togglegroup-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="togglegroup-008"]{color-scheme:dark}
[data-vibeui-block="togglegroup-008"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:24rem;padding:0.875rem;
border:1px solid var(--vibeui-togglegroup-008-border);border-radius:0.875rem;
background:var(--vibeui-togglegroup-008-bg);color:var(--vibeui-togglegroup-008-fg);
font-family:var(--vibeui-togglegroup-008-font);
}
[data-vibeui-block="togglegroup-008"] *{box-sizing:border-box}
[data-vibeui-block="togglegroup-008"] h3{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="togglegroup-008"] [data-part="group"]{display:flex;flex-wrap:wrap;gap:0.375rem}
[data-vibeui-block="togglegroup-008"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;gap:0.375rem;
height:2rem;padding:0 0.6875rem;
border:1px solid var(--vibeui-togglegroup-008-border);border-radius:9999px;
background:var(--vibeui-togglegroup-008-raised);color:var(--vibeui-togglegroup-008-muted);
font-size:0.8125rem;font-weight:600;line-height:1;
transition:background-color .15s ease,color .15s ease,border-color .15s ease;
}
[data-vibeui-block="togglegroup-008"] button:focus-visible{
outline:2px solid var(--vibeui-togglegroup-008-accent);outline-offset:2px;
}
[data-vibeui-block="togglegroup-008"] button[aria-pressed="true"]{
background:color-mix(in oklab,var(--vibeui-togglegroup-008-accent) 12%,var(--vibeui-togglegroup-008-raised));
border-color:var(--vibeui-togglegroup-008-accent);
color:var(--vibeui-togglegroup-008-accent);
}
/* Единственная оставшаяся кнопка помечена замком и aria-disabled: она
   нажата и снять её нельзя — это состояние, а не запрет на весь элемент. */
[data-vibeui-block="togglegroup-008"] button[aria-disabled="true"]{cursor:not-allowed}
[data-vibeui-block="togglegroup-008"] button svg{width:0.75rem;height:0.75rem}
[data-vibeui-block="togglegroup-008"] button[data-blocked="true"]{
border-color:var(--vibeui-togglegroup-008-warn);color:var(--vibeui-togglegroup-008-warn);
animation:vibeui-togglegroup-008-nudge .22s ease;
}
@keyframes vibeui-togglegroup-008-nudge{
0%,100%{transform:translateX(0)}
30%{transform:translateX(-0.1875rem)}
70%{transform:translateX(0.1875rem)}
}
[data-vibeui-block="togglegroup-008"] table{
width:100%;border-collapse:collapse;font-size:0.75rem;
border:1px solid var(--vibeui-togglegroup-008-border);border-radius:0.5rem;overflow:hidden;
}
[data-vibeui-block="togglegroup-008"] th,[data-vibeui-block="togglegroup-008"] td{
padding:0.375rem 0.5rem;text-align:left;border-bottom:1px solid var(--vibeui-togglegroup-008-border);
}
[data-vibeui-block="togglegroup-008"] th{background:var(--vibeui-togglegroup-008-surface);font-weight:650}
[data-vibeui-block="togglegroup-008"] tr:last-child td{border-bottom:0}
[data-vibeui-block="togglegroup-008"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-togglegroup-008-muted);
}
[data-vibeui-block="togglegroup-008"] [data-part="note"][data-warn="true"]{color:var(--vibeui-togglegroup-008-warn)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="togglegroup-008"] *{animation:none!important;transition:none!important}}
`

const COLUMNS = ["name", "status", "date", "sum"]

const COLUMN_TEXT: Record<string, string> = {
  name: "Клиент",
  status: "Статус",
  date: "Дата",
  sum: "Сумма",
}

const CELL_TEXT: Record<string, string> = {
  name: "ООО «Сфера»",
  status: "Оплачен",
  date: "14.03",
  sum: "48 200 ₽",
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
 * Стрелки водят фокус внутри группы: до дальней кнопки не нужно дожимать
 * Tab через все предыдущие, а Home и End бросают на края.
 */
function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
  const step =
    event.key === "ArrowRight" || event.key === "ArrowDown"
      ? 1
      : event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? -1
        : 0

  if (step === 0 && event.key !== "Home" && event.key !== "End") {
    return
  }

  const buttons = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>("button"),
  )
  const from = buttons.indexOf(document.activeElement as HTMLButtonElement)

  if (from === -1) {
    return
  }

  const last = buttons.length - 1
  const next =
    event.key === "Home" ? 0 : event.key === "End" ? last : from + step

  event.preventDefault()
  buttons[next < 0 ? last : next > last ? 0 : next].focus()
}

/**
 * Группа тумблеров с обязательным минимумом: последняя нажатая кнопка
 * помечена aria-disabled и объясняет отказ. Один файл, ноль зависимостей.
 */
export function Togglegroup008({
  label = "Колонки таблицы",
  minMessage = "Хотя бы одна колонка должна остаться видимой.",
  defaultValue = ["name", "status", "sum"],
  columnText = COLUMN_TEXT,
  cellText = CELL_TEXT,
  countText = "Показано колонок: {selected} из {total}.",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Togglegroup008Props) {
  const [value, setValue] = useState<string[]>(defaultValue)
  const [blocked, setBlocked] = useState("")

  const palette = {
    ...(accent ? { "--vibeui-togglegroup-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-togglegroup-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const locked = (id: string) => value.length === 1 && value[0] === id

  const toggle = (id: string) => {
    if (locked(id)) {
      setBlocked(id)
      return
    }

    const next = value.includes(id)
      ? value.filter((item) => item !== id)
      : [...value, id]

    setBlocked("")
    setValue(next)
    onChange?.(next)
  }

  const shown = COLUMNS.filter((column) => value.includes(column))

  return (
    <>
      <style href="vibeui-togglegroup-008" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="toggle-group"
        data-vibeui-block="togglegroup-008"
        className={className}
        style={palette}
      >
        <h3>{label}</h3>
        <div
          data-part="group"
          role="group"
          aria-label={label}
          onKeyDown={moveFocus}
        >
          {COLUMNS.map((column) => (
            <button
              key={column}
              type="button"
              aria-pressed={value.includes(column)}
              aria-disabled={locked(column)}
              data-blocked={blocked === column}
              onClick={() => toggle(column)}
            >
              {locked(column) ? (
                <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path
                    d="M3.2 5.2V4a2.8 2.8 0 0 1 5.6 0v1.2M2.6 5.2h6.8v5H2.6z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : null}
              {columnText[column] ?? COLUMN_TEXT[column]}
            </button>
          ))}
        </div>
        <table>
          <thead>
            <tr>
              {shown.map((column) => (
                <th key={column} scope="col">
                  {columnText[column] ?? COLUMN_TEXT[column]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {shown.map((column) => (
                <td key={column}>{cellText[column] ?? CELL_TEXT[column]}</td>
              ))}
            </tr>
          </tbody>
        </table>
        <p data-part="note" data-warn={blocked !== ""} role="status">
          {blocked
            ? minMessage
            : countText
                .replace("{selected}", String(value.length))
                .replace("{total}", String(COLUMNS.length))}
        </p>
      </section>
    </>
  )
}
