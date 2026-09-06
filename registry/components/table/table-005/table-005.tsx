"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Table005Row = {
  id: string
  name: string
  role: string
  status: string
}

export type Table005Props = Omit<ComponentProps<"div">, "children"> & {
  rows?: Table005Row[]
  caption?: string
  /** Заголовки колонок: компонент несёт русские, проект подставляет свои. */
  columnText?: Record<string, string>
  /** Подписи кнопок панели: ключи message и clear. */
  actionText?: Record<string, string>
  /** Счётчик выбранного; {count} подставляет число. */
  pickedText?: string
  selectAllText?: string
  /** Подпись флажка строки; {name} подставляет имя. */
  selectRowText?: string
  /** Пусто — подложки нет, таблица лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: выбор строк с действиями над выбранным. Флажок в шапке
// имеет три состояния, и промежуточное задаётся свойством indeterminate из
// ref — атрибута для него в HTML нет. Панель действий появляется вместо
// подписи таблицы, а не поверх неё: иначе она перекрывает первую строку.
//
// Тема берётся из color-scheme окружения через light-dark(): таблица темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="table-005"]){
--vibeui-table-005-bg:transparent;
--vibeui-table-005-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-table-005-muted:color-mix(in oklab,var(--vibeui-table-005-fg) 68%,transparent);
--vibeui-table-005-border:light-dark(oklch(0.92 0 265),oklch(0.36 0 265));
--vibeui-table-005-head:light-dark(oklch(0.5 0 265 / 5%),oklch(0.85 0 265 / 7%));
--vibeui-table-005-picked:light-dark(oklch(0.55 0.2 39.8 / 7%),oklch(0.75 0.16 39.8 / 14%));
--vibeui-table-005-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.75 0.16 39.8));
--vibeui-table-005-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0 265));
--vibeui-table-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="table-005"]{color-scheme:dark}
[data-vibeui-block="table-005"]{
width:100%;box-sizing:border-box;overflow-x:auto;
background:var(--vibeui-table-005-bg);
border:1px solid var(--vibeui-table-005-border);border-radius:0.875rem;
font-family:var(--vibeui-table-005-font);color:var(--vibeui-table-005-fg);
}
/* Панель действий встаёт на место подписи: поверх она закрыла бы первую строку. */
[data-vibeui-block="table-005"] [data-part="bar"]{
display:flex;align-items:center;justify-content:space-between;gap:1rem;
min-height:2.75rem;padding:0.5rem 0.875rem;
font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="table-005"] [data-part="actions"]{display:flex;gap:0.375rem}
[data-vibeui-block="table-005"] [data-part="actions"] button{
appearance:none;cursor:pointer;height:1.875rem;padding:0 0.625rem;
border:1px solid var(--vibeui-table-005-border);border-radius:0.5rem;
background:none;color:inherit;font:inherit;font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="table-005"] [data-part="actions"] button:focus-visible{outline:2px solid var(--vibeui-table-005-accent);outline-offset:2px}
[data-vibeui-block="table-005"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="table-005"] th,
[data-vibeui-block="table-005"] td{
padding:0.5rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-table-005-border);
}
[data-vibeui-block="table-005"] thead th{background:var(--vibeui-table-005-head);font-weight:600}
[data-vibeui-block="table-005"] [data-part="pick"]{width:1rem;padding-right:0}
[data-vibeui-block="table-005"] input{
appearance:none;position:relative;cursor:pointer;flex:none;
width:1rem;height:1rem;border-radius:0.3125rem;
border:1.5px solid var(--vibeui-table-005-muted);background:var(--vibeui-table-005-bg);
}
[data-vibeui-block="table-005"] input:checked,
[data-vibeui-block="table-005"] input:indeterminate{
background:var(--vibeui-table-005-accent);border-color:var(--vibeui-table-005-accent);
}
/* Галочка и черта различают выбранное и частично выбранное не одним цветом. */
[data-vibeui-block="table-005"] input:checked::after{
content:"";position:absolute;left:0.28rem;top:0.08rem;
width:0.2rem;height:0.45rem;
border:solid var(--vibeui-table-005-on-accent);border-width:0 2px 2px 0;transform:rotate(45deg);
}
[data-vibeui-block="table-005"] input:indeterminate::after{
content:"";position:absolute;left:0.19rem;top:0.4rem;
width:0.5rem;height:2px;background:var(--vibeui-table-005-on-accent);
}
[data-vibeui-block="table-005"] input:focus-visible{outline:2px solid var(--vibeui-table-005-accent);outline-offset:2px}
/* Выбранная строка отмечена заливкой: один флажок в ряду легко потерять. */
[data-vibeui-block="table-005"] tbody tr:has(input:checked){background:var(--vibeui-table-005-picked)}
[data-vibeui-block="table-005"] [data-part="status"]{color:var(--vibeui-table-005-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="table-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Table005Row[] = [
  { id: "1", name: "Анна Реброва", role: "Дизайнер", status: "Активна" },
  { id: "2", name: "Илья Мохов", role: "Фронтенд", status: "Активен" },
  { id: "3", name: "Ким Сон", role: "Аналитик", status: "Приглашён" },
  { id: "4", name: "Пётр Гай", role: "Фронтенд", status: "Активен" },
]

const COLUMN_TEXT: Record<string, string> = {
  name: "Участник",
  role: "Роль",
  status: "Статус",
}

const ACTION_TEXT: Record<string, string> = {
  message: "Написать",
  clear: "Снять выбор",
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
 * Таблица с выбором строк: флажок шапки с промежуточным состоянием.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table005({
  rows = DEFAULT_ROWS,
  caption = "Участники проекта",
  columnText = COLUMN_TEXT,
  actionText = ACTION_TEXT,
  pickedText = "Выбрано: {count}",
  selectAllText = "Выбрать всех",
  selectRowText = "Выбрать: {name}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Table005Props) {
  const [picked, setPicked] = useState<string[]>(["2"])
  const all = picked.length === rows.length
  const some = picked.length > 0 && !all

  const toggle = (id: string) =>
    setPicked((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )

  const palette = {
    ...(accent ? { "--vibeui-table-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-table-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-table-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="table"
        data-vibeui-block="table-005"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          {picked.length > 0
            ? pickedText.replace("{count}", String(picked.length))
            : caption}
          {picked.length > 0 ? (
            <span data-part="actions">
              <button type="button">
                {actionText.message ?? ACTION_TEXT.message}
              </button>
              <button type="button" onClick={() => setPicked([])}>
                {actionText.clear ?? ACTION_TEXT.clear}
              </button>
            </span>
          ) : null}
        </div>
        <table>
          <thead>
            <tr>
              <th scope="col" data-part="pick">
                <input
                  type="checkbox"
                  checked={all}
                  ref={(node) => {
                    if (node) node.indeterminate = some
                  }}
                  aria-label={selectAllText}
                  onChange={() =>
                    setPicked(all ? [] : rows.map((row) => row.id))
                  }
                />
              </th>
              <th scope="col">{columnText.name ?? COLUMN_TEXT.name}</th>
              <th scope="col">{columnText.role ?? COLUMN_TEXT.role}</th>
              <th scope="col">{columnText.status ?? COLUMN_TEXT.status}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td data-part="pick">
                  <input
                    type="checkbox"
                    checked={picked.includes(row.id)}
                    aria-label={selectRowText.replace("{name}", row.name)}
                    onChange={() => toggle(row.id)}
                  />
                </td>
                <td>{row.name}</td>
                <td>{row.role}</td>
                <td data-part="status">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
