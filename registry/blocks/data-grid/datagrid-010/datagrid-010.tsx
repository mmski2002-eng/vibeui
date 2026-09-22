"use client"

import { useState } from "react"
import { Card160 } from "@/registry/components/card/card-160/card-160"
import type { ComponentProps, CSSProperties } from "react"

export type Datagrid010Row = {
  id: string
  person: string
  role: string
  city: string
  score: number
}

export type Datagrid010Props = Omit<ComponentProps<"section">, "children"> & {
  rows?: Datagrid010Row[]
  caption?: string
  pageSize?: number
  /** Заголовок шапки над таблицей. */
  heading?: string
  /** Подпись выбора размера страницы. */
  pageSizeLabel?: string
  /** Названия колонок: person, role, city, score. */
  columnText?: Record<string, string>
  /** Диапазон записей. {from}, {to} и {total} подставляются. */
  rangeText?: string
  /** Подпись навигации по страницам. */
  pagesLabel?: string
  /** Подпись кнопки «назад». */
  previousLabel?: string
  /** Подпись кнопки «вперёд». */
  nextLabel?: string
  /** Подпись кнопки страницы. {number} — её номер. */
  pageLabel?: string
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Пусто — подложки нет, сетка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: постраничный просмотр с выбором размера страницы.
// Переключатели страниц — настоящая навигация в <nav> с aria-label, текущая
// страница помечена aria-current, а не только цветом. Диапазон «21–23 из 23»
// пересчитывается от размера страницы: без него после смены размера
// непонятно, куда уехали строки.
//
// Тема берётся из color-scheme окружения через light-dark(): сетка темнеет
// вместе со страницей и не носит собственной подложки.
const STYLES = `
:where([data-vibeui-block="datagrid-010"]){
--vibeui-datagrid-010-bg:transparent;
--vibeui-datagrid-010-fg:light-dark(oklch(0.23 0.014 20),oklch(0.93 0.006 20));
--vibeui-datagrid-010-muted:color-mix(in oklab,var(--vibeui-datagrid-010-fg) 68%,transparent);
--vibeui-datagrid-010-border:light-dark(oklch(0.92 0.006 20),oklch(0.34 0.012 20));
--vibeui-datagrid-010-head:light-dark(oklch(0.975 0.004 20),oklch(0.27 0.012 20));
--vibeui-datagrid-010-field:light-dark(oklch(1 0 0),oklch(0.22 0.012 20));
--vibeui-datagrid-010-accent:light-dark(oklch(0.287 0 0),oklch(0.905 0 0));
--vibeui-datagrid-010-on-accent:oklch(from var(--vibeui-datagrid-010-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-datagrid-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="datagrid-010"]{color-scheme:dark}
[data-vibeui-block="datagrid-010"]{
box-sizing:border-box;width:100%;max-width:50rem;margin:0 auto;
background:var(--vibeui-datagrid-010-bg);color:var(--vibeui-datagrid-010-fg);
border:1px solid var(--vibeui-datagrid-010-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-010-font);overflow:hidden;
}
[data-vibeui-block="datagrid-010"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-010"] label{
display:inline-flex;align-items:center;gap:0.375rem;
font-size:0.75rem;color:var(--vibeui-datagrid-010-muted);
}
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
background:var(--vibeui-datagrid-010-field);color:var(--vibeui-datagrid-010-fg);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="datagrid-010"] [data-part="pages"] button[aria-current="page"]{
border-color:transparent;background:var(--vibeui-datagrid-010-accent);color:oklch(from var(--vibeui-datagrid-010-accent) clamp(0,(0.62 - l) * 100,1) 0 0);font-weight:650;
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


const COLUMN_LABEL: Record<string, string> = {
  person: "Участник",
  role: "Роль",
  city: "Город",
  score: "Балл",
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
 * Сетка с пагинацией и выбором размера страницы: диапазон записей,
 * номера страниц с aria-current и навигация в nav. Один файл.
 */
export function Datagrid010({
  rows = DEFAULT_ROWS,
  caption = "Список участников программы",
  pageSize = 5,
  heading = "Участники",
  pageSizeLabel = "Строк на странице",
  columnText = COLUMN_LABEL,
  rangeText = "Показано {from}–{to} из {total}",
  pagesLabel = "Страницы таблицы",
  previousLabel = "Предыдущая страница",
  nextLabel = "Следующая страница",
  pageLabel = "Страница {number}",
  scrollLabel = "Таблица участников, прокручивается вбок",
  background = "",
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

  const label = (column: string) => columnText[column] ?? COLUMN_LABEL[column]

  const palette = {
    ...(accent ? { "--vibeui-datagrid-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-datagrid-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-010" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="data-grid"
        data-vibeui-block="datagrid-010"
        className={className}
        style={palette}
      >
        <Card160 data-part="head" heading={heading} pageSizeLabel={pageSizeLabel} setPage={setPage} setSize={setSize} size={size} accent={accent} />
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
                <th scope="col">{label("person")}</th>
                <th scope="col">{label("role")}</th>
                <th scope="col">{label("city")}</th>
                <th scope="col" data-align="end">
                  {label("score")}
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
            {rangeText
              .replace("{from}", String(from + 1))
              .replace("{to}", String(from + slice.length))
              .replace("{total}", String(rows.length))}
          </p>
          <nav aria-label={pagesLabel}>
            <ul data-part="pages">
              <li>
                <button
                  type="button"
                  disabled={safe === 1}
                  aria-label={previousLabel}
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
                      aria-label={pageLabel.replace("{number}", String(number))}
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
                  aria-label={nextLabel}
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
