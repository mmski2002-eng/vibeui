"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Datagrid018Row = {
  id: string
  ticket: string
  subject: string
  requester: string
  team: string
}

export type Datagrid018Props = Omit<ComponentProps<"section">, "children"> & {
  rows?: Datagrid018Row[]
  caption?: string
  placeholder?: string
  /** Запрос, с которым таблица открывается. */
  defaultQuery?: string
  /** Скрытая подпись поля поиска. */
  searchLabel?: string
  /** Подпись флажка «только совпавшие». */
  onlyText?: string
  /** Счётчик без запроса. {count} — число строк. */
  rowsTemplate?: string
  /** Счётчик с запросом. {matches} и {rows} — числа. */
  matchTemplate?: string
  /** Строка, когда ничего не найдено. {query} — запрос. */
  emptyTemplate?: string
  /** Заголовки колонок по ключу: компонент несёт русские. */
  columnText?: Record<string, string>
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Пусто — подложки нет, сетка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: один запрос ищет по всем колонкам сразу, а найденное
// подсвечивается прямо в ячейке тегом mark — иначе в широкой строке
// непонятно, за что она зацепилась. Совпадения считаются отдельно от
// строк: «12 совпадений в 4 строках» честнее одного числа. Переключатель
// прячет несовпавшие строки, но шапка и счётчик остаются на месте.
//
// Тема берётся из color-scheme окружения через light-dark(): сетка темнеет
// вместе со страницей и не носит собственной подложки.
const STYLES = `
:where([data-vibeui-block="datagrid-018"]){
--vibeui-datagrid-018-bg:transparent;
--vibeui-datagrid-018-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
--vibeui-datagrid-018-muted:color-mix(in oklab,var(--vibeui-datagrid-018-fg) 68%,transparent);
--vibeui-datagrid-018-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-datagrid-018-head:light-dark(oklch(0.975 0 285),oklch(0.27 0 285));
--vibeui-datagrid-018-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.78 0.15 39.8));
--vibeui-datagrid-018-mark:light-dark(oklch(0.92 0.13 39.8),oklch(0.52 0.11 39.8));
--vibeui-datagrid-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="datagrid-018"]{color-scheme:dark}
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
border:1px solid var(--vibeui-datagrid-018-border);background:transparent;
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

const COLUMN_TEXT: Record<string, string> = {
  ticket: "Обращение",
  subject: "Тема",
  requester: "Заявитель",
  team: "Команда",
}

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
 * Сетка со сквозным поиском по всем колонкам и подсветкой совпадений
 * тегом mark. Один файл, ноль зависимостей.
 */
export function Datagrid018({
  rows = DEFAULT_ROWS,
  caption = "Поиск идёт по всем колонкам сразу, найденное подсвечено",
  placeholder = "Искать по таблице",
  defaultQuery = "плат",
  searchLabel = "Поиск по всей таблице обращений",
  onlyText = "Только совпавшие",
  rowsTemplate = "Строк: {count}",
  matchTemplate = "{matches} совпадений в {rows} строках",
  emptyTemplate = "По запросу «{query}» не найдено ни одной строки",
  columnText = COLUMN_TEXT,
  scrollLabel = "Таблица обращений, прокручивается вбок",
  background = "",
  accent,
  className,
  style,
  ...props
}: Datagrid018Props) {
  // Запрос читателя живёт рядом с пропом, а не вместо него: смена
  // defaultQuery снаружи обязана переставить поле, иначе проп сработал бы
  // ровно один раз, при монтировании.
  const [typed, setTyped] = useState<string | null>(null)
  const [source, setSource] = useState(defaultQuery)
  const [onlyHits, setOnlyHits] = useState(false)
  const inputId = useId()

  if (source !== defaultQuery) {
    setSource(defaultQuery)
    setTyped(null)
  }

  const query = typed ?? defaultQuery
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
    ...(background
      ? {
          "--vibeui-datagrid-018-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-018" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="data-grid"
        data-vibeui-block="datagrid-018"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <span data-part="field">
            <label htmlFor={inputId} hidden>
              {searchLabel}
            </label>
            <input
              id={inputId}
              type="search"
              value={query}
              placeholder={placeholder}
              onChange={(event) => setTyped(event.target.value)}
            />
          </span>
          <label data-part="only">
            <input
              type="checkbox"
              checked={onlyHits}
              onChange={(event) => setOnlyHits(event.target.checked)}
            />
            {onlyText}
          </label>
          <p data-part="count" role="status" aria-live="polite">
            {needle === ""
              ? rowsTemplate.replace("{count}", String(rows.length))
              : matchTemplate
                  .replace("{matches}", String(total))
                  .replace("{rows}", String(matched.length))}
          </p>
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
                <th scope="col">{columnText.ticket ?? COLUMN_TEXT.ticket}</th>
                <th scope="col">{columnText.subject ?? COLUMN_TEXT.subject}</th>
                <th scope="col">
                  {columnText.requester ?? COLUMN_TEXT.requester}
                </th>
                <th scope="col">{columnText.team ?? COLUMN_TEXT.team}</th>
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
                    {emptyTemplate.replace("{query}", needle)}
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
