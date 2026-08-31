"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Datagrid018Row = {
  id: string
  ticket: string
  subject: string
  requester: string
  team: string
}

export type Datagrid018Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  rows?: Datagrid018Row[]
  caption?: string
  placeholder?: string
  accent?: string
}

// Идея компонента: один запрос ищет по всем колонкам сразу, а найденное
// подсвечивается прямо в ячейке тегом mark — иначе в широкой строке
// непонятно, за что она зацепилась. Совпадения считаются отдельно от
// строк: «12 совпадений в 4 строках» честнее одного числа. Переключатель
// прячет несовпавшие строки, но шапка и счётчик остаются на месте.
const STYLES = `
:where([data-vibeui-block="datagrid-018"]){
--vibeui-datagrid-018-bg:oklch(1 0 0);
--vibeui-datagrid-018-fg:oklch(0.23 0.014 285);
--vibeui-datagrid-018-muted:oklch(0.55 0.014 285);
--vibeui-datagrid-018-border:oklch(0.92 0.006 285);
--vibeui-datagrid-018-head:oklch(0.975 0.003 285);
--vibeui-datagrid-018-accent:oklch(0.55 0.17 55);
--vibeui-datagrid-018-mark:oklch(0.92 0.13 95);
--vibeui-datagrid-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="datagrid-018"]{
box-sizing:border-box;width:100%;max-width:52rem;margin:0 auto;
background:var(--vibeui-datagrid-018-bg);color:var(--vibeui-datagrid-018-fg);
border:1px solid var(--vibeui-datagrid-018-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-018-font);overflow:hidden;
}
[data-vibeui-block="datagrid-018"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-018"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.625rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-datagrid-018-border);
}
[data-vibeui-block="datagrid-018"] [data-part="field"]{
display:flex;align-items:center;gap:0.375rem;flex:1 1 12rem;min-width:9rem;
padding:0.3125rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-datagrid-018-border);background:var(--vibeui-datagrid-018-bg);
}
[data-vibeui-block="datagrid-018"] [data-part="field"]:focus-within{border-color:var(--vibeui-datagrid-018-accent)}
[data-vibeui-block="datagrid-018"] [data-part="field"]::before{
content:"";flex:none;width:0.75rem;height:0.75rem;border-radius:999px;
border:1.5px solid var(--vibeui-datagrid-018-muted);
box-shadow:0.375rem 0.375rem 0 -0.28rem var(--vibeui-datagrid-018-muted);
}
[data-vibeui-block="datagrid-018"] [data-part="field"] input{
flex:1;min-width:0;border:0;outline:0;background:transparent;font:inherit;font-size:0.8125rem;color:inherit;
}
[data-vibeui-block="datagrid-018"] [data-part="only"]{
display:inline-flex;align-items:center;gap:0.375rem;font-size:0.75rem;color:var(--vibeui-datagrid-018-muted);cursor:pointer;
}
[data-vibeui-block="datagrid-018"] [data-part="only"] input{accent-color:var(--vibeui-datagrid-018-accent);margin:0;width:0.9375rem;height:0.9375rem}
[data-vibeui-block="datagrid-018"] [data-part="only"] input:focus-visible{outline:2px solid var(--vibeui-datagrid-018-accent);outline-offset:2px}
[data-vibeui-block="datagrid-018"] [data-part="count"]{margin:0;font-size:0.75rem;color:var(--vibeui-datagrid-018-muted);flex:none}
[data-vibeui-block="datagrid-018"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-018"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-018-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-018"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-018"] caption{
padding:0.625rem 0.875rem;text-align:left;font-size:0.75rem;color:var(--vibeui-datagrid-018-muted);caption-side:top;
}
[data-vibeui-block="datagrid-018"] th,
[data-vibeui-block="datagrid-018"] td{
padding:0.5rem 0.875rem;text-align:left;
border-top:1px solid var(--vibeui-datagrid-018-border);
}
[data-vibeui-block="datagrid-018"] thead th{background:var(--vibeui-datagrid-018-head);font-weight:600;white-space:nowrap}
[data-vibeui-block="datagrid-018"] mark{
background:var(--vibeui-datagrid-018-mark);color:inherit;border-radius:0.1875rem;padding:0 0.0625rem;
box-shadow:inset 0 -2px 0 var(--vibeui-datagrid-018-accent);
}
[data-vibeui-block="datagrid-018"] tbody tr[data-hit="true"] th[scope="row"]{box-shadow:inset 3px 0 0 var(--vibeui-datagrid-018-accent)}
[data-vibeui-block="datagrid-018"] tbody tr[data-hit="false"]{color:var(--vibeui-datagrid-018-muted)}
[data-vibeui-block="datagrid-018"] [data-part="code"]{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:0.75rem;white-space:nowrap}
[data-vibeui-block="datagrid-018"] [data-part="none"]{padding:1.5rem 0.875rem;text-align:center;color:var(--vibeui-datagrid-018-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-018"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Datagrid018Row[] = [
  {
    id: "t1",
    ticket: "SD-2041",
    subject: "Не приходит код подтверждения",
    requester: "Марина Соколова",
    team: "Поддержка",
  },
  {
    id: "t2",
    ticket: "SD-2042",
    subject: "Ошибка оплаты картой Мир",
    requester: "Игорь Панов",
    team: "Платежи",
  },
  {
    id: "t3",
    ticket: "SD-2043",
    subject: "Пропал доступ к отчётам",
    requester: "Ольга Мартынова",
    team: "Доступы",
  },
  {
    id: "t4",
    ticket: "SD-2044",
    subject: "Дубли в выгрузке платежей",
    requester: "Павел Игнатов",
    team: "Платежи",
  },
  {
    id: "t5",
    ticket: "SD-2045",
    subject: "Просит вернуть старый отчёт",
    requester: "Мария Ким",
    team: "Аналитика",
  },
]

function splitByQuery(value: string, query: string): ReactNode[] {
  if (query === "") {
    return [value]
  }

  const parts: ReactNode[] = []
  const lower = value.toLowerCase()
  const needle = query.toLowerCase()
  let cursor = 0
  let found = lower.indexOf(needle, cursor)

  while (found !== -1) {
    if (found > cursor) {
      parts.push(value.slice(cursor, found))
    }

    parts.push(
      <mark key={`${found}-${parts.length}`}>
        {value.slice(found, found + needle.length)}
      </mark>,
    )
    cursor = found + needle.length
    found = lower.indexOf(needle, cursor)
  }

  if (cursor < value.length) {
    parts.push(value.slice(cursor))
  }

  return parts
}

function countIn(value: string, query: string) {
  if (query === "") {
    return 0
  }

  return value.toLowerCase().split(query.toLowerCase()).length - 1
}

/**
 * Сетка со сквозным поиском по всем колонкам и подсветкой совпадений
 * тегом mark. Один файл, ноль зависимостей.
 */
export function Datagrid018({
  rows = DEFAULT_ROWS,
  caption = "Поиск идёт по всем колонкам сразу, найденное подсвечено",
  placeholder = "Искать по таблице",
  accent,
  className,
  style,
  ...props
}: Datagrid018Props) {
  const [query, setQuery] = useState("плат")
  const [onlyHits, setOnlyHits] = useState(false)
  const inputId = useId()

  const needle = query.trim()

  const scored = rows.map((row) => {
    const hits =
      countIn(row.ticket, needle) +
      countIn(row.subject, needle) +
      countIn(row.requester, needle) +
      countIn(row.team, needle)

    return { row, hits }
  })

  const visible =
    onlyHits && needle ? scored.filter((item) => item.hits > 0) : scored
  const matched = scored.filter((item) => item.hits > 0)
  const total = scored.reduce((sum, item) => sum + item.hits, 0)

  const palette = {
    ...(accent ? { "--vibeui-datagrid-018-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-018" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="datagrid-018"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <span data-part="field">
            <label htmlFor={inputId} hidden>
              Поиск по всей таблице обращений
            </label>
            <input
              id={inputId}
              type="search"
              value={query}
              placeholder={placeholder}
              onChange={(event) => setQuery(event.target.value)}
            />
          </span>
          <label data-part="only">
            <input
              type="checkbox"
              checked={onlyHits}
              onChange={(event) => setOnlyHits(event.target.checked)}
            />
            Только совпавшие
          </label>
          <p data-part="count" role="status" aria-live="polite">
            {needle === ""
              ? `Строк: ${rows.length}`
              : `${total} совпадений в ${matched.length} строках`}
          </p>
        </div>
        <div
          data-part="scroll"
          role="region"
          aria-label="Таблица обращений, прокручивается вбок"
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col">Обращение</th>
                <th scope="col">Тема</th>
                <th scope="col">Заявитель</th>
                <th scope="col">Команда</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(({ row, hits }) => (
                <tr key={row.id} data-hit={hits > 0 ? "true" : "false"}>
                  <th scope="row" data-part="code">
                    {splitByQuery(row.ticket, needle)}
                  </th>
                  <td>{splitByQuery(row.subject, needle)}</td>
                  <td>{splitByQuery(row.requester, needle)}</td>
                  <td>{splitByQuery(row.team, needle)}</td>
                </tr>
              ))}
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={4} data-part="none">
                    По запросу «{needle}» не найдено ни одной строки
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
