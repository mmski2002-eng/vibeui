"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Table005Row = {
  id: string
  name: string
  role: string
  status: string
}

export type Table005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  rows?: Table005Row[]
  caption?: string
  accent?: string
}

// Идея компонента: выбор строк с действиями над выбранным. Флажок в шапке
// имеет три состояния, и промежуточное задаётся свойством indeterminate из
// ref — атрибута для него в HTML нет. Панель действий появляется вместо
// подписи таблицы, а не поверх неё: иначе она перекрывает первую строку.
const STYLES = `
:where([data-vibeui-block="table-005"]){
--vibeui-table-005-bg:oklch(1 0 0);
--vibeui-table-005-fg:oklch(0.24 0.014 265);
--vibeui-table-005-muted:oklch(0.56 0.014 265);
--vibeui-table-005-border:oklch(0.92 0.006 265);
--vibeui-table-005-head:oklch(0.975 0.003 265);
--vibeui-table-005-picked:oklch(0.55 0.2 262 / 7%);
--vibeui-table-005-accent:oklch(0.55 0.2 262);
--vibeui-table-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
border:solid oklch(1 0 0);border-width:0 2px 2px 0;transform:rotate(45deg);
}
[data-vibeui-block="table-005"] input:indeterminate::after{
content:"";position:absolute;left:0.19rem;top:0.4rem;
width:0.5rem;height:2px;background:oklch(1 0 0);
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

/**
 * Таблица с выбором строк: флажок шапки с промежуточным состоянием.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table005({
  rows = DEFAULT_ROWS,
  caption = "Участники проекта",
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
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-table-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="table-005"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          {picked.length > 0 ? `Выбрано: ${picked.length}` : caption}
          {picked.length > 0 ? (
            <span data-part="actions">
              <button type="button">Написать</button>
              <button type="button" onClick={() => setPicked([])}>
                Снять выбор
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
                  aria-label="Выбрать всех"
                  onChange={() =>
                    setPicked(all ? [] : rows.map((row) => row.id))
                  }
                />
              </th>
              <th scope="col">Участник</th>
              <th scope="col">Роль</th>
              <th scope="col">Статус</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td data-part="pick">
                  <input
                    type="checkbox"
                    checked={picked.includes(row.id)}
                    aria-label={`Выбрать: ${row.name}`}
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
