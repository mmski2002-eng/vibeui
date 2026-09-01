"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Datagrid010Row = {
  id: string
  person: string
  role: string
  city: string
  score: number
}

export type Datagrid010Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  rows?: Datagrid010Row[]
  caption?: string
  pageSize?: number
  accent?: string
}

// Идея компонента: постраничный просмотр с выбором размера страницы.
// Переключатели страниц — настоящая навигация в <nav> с aria-label, текущая
// страница помечена aria-current, а не только цветом. Диапазон «21–23 из 23»
// пересчитывается от размера страницы: без него после смены размера
// непонятно, куда уехали строки.
const STYLES = `
:where([data-vibeui-block="datagrid-010"]){
--vibeui-datagrid-010-bg:oklch(1 0 0);
--vibeui-datagrid-010-fg:oklch(0.23 0.014 20);
--vibeui-datagrid-010-muted:oklch(0.55 0.014 20);
--vibeui-datagrid-010-border:oklch(0.92 0.006 20);
--vibeui-datagrid-010-head:oklch(0.975 0.004 20);
--vibeui-datagrid-010-accent:oklch(0.55 0.17 25);
--vibeui-datagrid-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="datagrid-010"]{
box-sizing:border-box;width:100%;max-width:50rem;margin:0 auto;
background:var(--vibeui-datagrid-010-bg);color:var(--vibeui-datagrid-010-fg);
border:1px solid var(--vibeui-datagrid-010-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-010-font);overflow:hidden;
}
[data-vibeui-block="datagrid-010"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-010"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-datagrid-010-border);
}
[data-vibeui-block="datagrid-010"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="datagrid-010"] label{
display:inline-flex;align-items:center;gap:0.375rem;
font-size:0.75rem;color:var(--vibeui-datagrid-010-muted);
}
[data-vibeui-block="datagrid-010"] select{
font:inherit;font-size:0.75rem;color:var(--vibeui-datagrid-010-fg);
padding:0.25rem 0.5rem;border-radius:0.375rem;
border:1px solid var(--vibeui-datagrid-010-border);background:var(--vibeui-datagrid-010-bg);
}
[data-vibeui-block="datagrid-010"] select:focus-visible{outline:2px solid var(--vibeui-datagrid-010-accent);outline-offset:1px}
[data-vibeui-block="datagrid-010"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-010"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-010-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-010"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-010"] caption{
padding:0 0.875rem 0.625rem;text-align:left;
font-size:0.75rem;color:var(--vibeui-datagrid-010-muted);
}
[data-vibeui-block="datagrid-010"] th,
[data-vibeui-block="datagrid-010"] td{
padding:0.4375rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-datagrid-010-border);
}
[data-vibeui-block="datagrid-010"] thead th{background:var(--vibeui-datagrid-010-head);font-weight:600}
[data-vibeui-block="datagrid-010"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-010"] [data-part="muted"]{color:var(--vibeui-datagrid-010-muted)}
[data-vibeui-block="datagrid-010"] [data-part="foot"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.625rem 0.875rem;border-top:1px solid var(--vibeui-datagrid-010-border);
background:var(--vibeui-datagrid-010-head);
}
[data-vibeui-block="datagrid-010"] [data-part="range"]{
margin:0;font-size:0.75rem;color:var(--vibeui-datagrid-010-muted);margin-inline-end:auto;
}
[data-vibeui-block="datagrid-010"] [data-part="pages"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.25rem;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="datagrid-010"] [data-part="pages"] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;
min-width:1.875rem;height:1.875rem;padding:0 0.5rem;border-radius:0.5rem;
border:1px solid var(--vibeui-datagrid-010-border);
background:var(--vibeui-datagrid-010-bg);color:var(--vibeui-datagrid-010-fg);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="datagrid-010"] [data-part="pages"] button[aria-current="page"]{
border-color:transparent;background:var(--vibeui-datagrid-010-accent);color:oklch(1 0 0);font-weight:650;
}
[data-vibeui-block="datagrid-010"] [data-part="pages"] button:disabled{opacity:.4;cursor:not-allowed}
[data-vibeui-block="datagrid-010"] [data-part="pages"] button:focus-visible{outline:2px solid var(--vibeui-datagrid-010-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-010"] *{animation:none!important;transition:none!important}}
`

const NAMES = [
  "Орлова А.",
  "Ким С.",
  "Гнедин П.",
  "Савва Т.",
  "Лебедь М.",
  "Рудь И.",
  "Заика В.",
  "Мороз Е.",
  "Панченко Л.",
  "Юрьев Д.",
  "Бах Н.",
  "Соловей К.",
  "Тихая О.",
  "Верес Р.",
  "Шило Г.",
  "Дуб А.",
  "Марин С.",
  "Клим В.",
  "Ясь Н.",
  "Гай Т.",
  "Роман А.",
  "Зима П.",
  "Град Ю.",
]

const ROLES = ["Инженер", "Аналитик", "Дизайнер", "Менеджер"]
const CITIES = ["Москва", "Казань", "Петербург", "Новосибирск", "Сочи"]

const DEFAULT_ROWS: Datagrid010Row[] = NAMES.map((person, index) => ({
  id: `u-${index + 1}`,
  person,
  role: ROLES[index % ROLES.length],
  city: CITIES[index % CITIES.length],
  score: 60 + ((index * 7) % 40),
}))

const SIZES = [5, 10, 20]

/**
 * Сетка с пагинацией и выбором размера страницы: диапазон записей,
 * номера страниц с aria-current и навигация в nav. Один файл.
 */
export function Datagrid010({
  rows = DEFAULT_ROWS,
  caption = "Список участников программы",
  pageSize = 5,
  accent,
  className,
  style,
  ...props
}: Datagrid010Props) {
  const [size, setSize] = useState(pageSize)
  const [page, setPage] = useState(1)

  const pages = Math.max(1, Math.ceil(rows.length / size))
  const safe = Math.min(page, pages)
  const from = (safe - 1) * size
  const slice = rows.slice(from, from + size)

  const palette = {
    ...(accent ? { "--vibeui-datagrid-010-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-010" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="datagrid-010"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3 data-part="title">Участники</h3>
          <label>
            Строк на странице
            <select
              value={size}
              onChange={(event) => {
                setSize(Number(event.target.value))
                setPage(1)
              }}
            >
              {SIZES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div
          data-part="scroll"
          role="region"
          aria-label="Таблица участников, прокручивается вбок"
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col">Участник</th>
                <th scope="col">Роль</th>
                <th scope="col">Город</th>
                <th scope="col" data-align="end">
                  Балл
                </th>
              </tr>
            </thead>
            <tbody>
              {slice.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.person}</th>
                  <td data-part="muted">{row.role}</td>
                  <td data-part="muted">{row.city}</td>
                  <td data-align="end">{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div data-part="foot">
          <p data-part="range" aria-live="polite">
            Показано {from + 1}–{from + slice.length} из {rows.length}
          </p>
          <nav aria-label="Страницы таблицы">
            <ul data-part="pages">
              <li>
                <button
                  type="button"
                  disabled={safe === 1}
                  aria-label="Предыдущая страница"
                  onClick={() => setPage(safe - 1)}
                >
                  ←
                </button>
              </li>
              {Array.from({ length: pages }, (_, index) => index + 1).map(
                (number) => (
                  <li key={number}>
                    <button
                      type="button"
                      aria-current={number === safe ? "page" : undefined}
                      aria-label={`Страница ${number}`}
                      onClick={() => setPage(number)}
                    >
                      {number}
                    </button>
                  </li>
                ),
              )}
              <li>
                <button
                  type="button"
                  disabled={safe === pages}
                  aria-label="Следующая страница"
                  onClick={() => setPage(safe + 1)}
                >
                  →
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </section>
    </>
  )
}
