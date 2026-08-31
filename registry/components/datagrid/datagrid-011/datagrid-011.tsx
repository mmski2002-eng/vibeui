"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Datagrid011Row = {
  id: string
  request: string
  city: string
  status: "Новая" | "В работе" | "Архив"
  score: number
}

export type Datagrid011Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  rows?: Datagrid011Row[]
  caption?: string
  emptyTitle?: string
  accent?: string
}

// Идея компонента: пустое состояние как часть сетки, а не отдельная
// заглушка. Оно показано ровно тогда, когда фильтры сошлись в ноль, и
// называет причину — какие именно фильтры стоят, — а рядом даёт выход:
// снять один фильтр или сбросить все. Шапка таблицы остаётся на месте,
// поэтому не создаётся впечатление, что таблица пропала.
const STYLES = `
:where([data-vibeui-block="datagrid-011"]){
--vibeui-datagrid-011-bg:oklch(1 0 0);
--vibeui-datagrid-011-fg:oklch(0.23 0.014 210);
--vibeui-datagrid-011-muted:oklch(0.55 0.014 210);
--vibeui-datagrid-011-border:oklch(0.92 0.006 210);
--vibeui-datagrid-011-head:oklch(0.975 0.003 210);
--vibeui-datagrid-011-accent:oklch(0.52 0.13 210);
--vibeui-datagrid-011-accent-soft:oklch(0.52 0.13 210 / 10%);
--vibeui-datagrid-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="datagrid-011"]{
box-sizing:border-box;width:100%;max-width:48rem;margin:0 auto;
background:var(--vibeui-datagrid-011-bg);color:var(--vibeui-datagrid-011-fg);
border:1px solid var(--vibeui-datagrid-011-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-011-font);overflow:hidden;
}
[data-vibeui-block="datagrid-011"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-011"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-datagrid-011-border);
}
[data-vibeui-block="datagrid-011"] [data-part="title"]{
margin:0 0.5rem 0 0;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="datagrid-011"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.375rem;
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;
padding:0.25rem 0.5rem;border-radius:999px;
color:var(--vibeui-datagrid-011-accent);background:var(--vibeui-datagrid-011-accent-soft);
border:1px solid transparent;
}
[data-vibeui-block="datagrid-011"] [data-part="chip"]:hover{border-color:var(--vibeui-datagrid-011-accent)}
[data-vibeui-block="datagrid-011"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-datagrid-011-accent);outline-offset:2px}
[data-vibeui-block="datagrid-011"] [data-part="reset"]{
margin-inline-start:auto;
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;
padding:0.3125rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-datagrid-011-border);
background:var(--vibeui-datagrid-011-bg);color:var(--vibeui-datagrid-011-fg);
}
[data-vibeui-block="datagrid-011"] [data-part="reset"]:disabled{opacity:.45;cursor:not-allowed}
[data-vibeui-block="datagrid-011"] [data-part="reset"]:focus-visible{outline:2px solid var(--vibeui-datagrid-011-accent);outline-offset:2px}
[data-vibeui-block="datagrid-011"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-011"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-011-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-011"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-011"] caption{
padding:0 0.875rem 0.625rem;text-align:left;
font-size:0.75rem;color:var(--vibeui-datagrid-011-muted);
}
[data-vibeui-block="datagrid-011"] th,
[data-vibeui-block="datagrid-011"] td{
padding:0.4375rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-datagrid-011-border);
}
[data-vibeui-block="datagrid-011"] thead th{background:var(--vibeui-datagrid-011-head);font-weight:600}
[data-vibeui-block="datagrid-011"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-011"] [data-part="muted"]{color:var(--vibeui-datagrid-011-muted)}
[data-vibeui-block="datagrid-011"] [data-part="empty-cell"]{padding:0}
[data-vibeui-block="datagrid-011"] [data-part="empty"]{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
padding:2rem 1.25rem;text-align:center;white-space:normal;
}
/* Значок нарисован рамками: одна лишняя картинка сломала бы обещание
   «компонент — это один файл без ресурсов». */
[data-vibeui-block="datagrid-011"] [data-part="glyph"]{
position:relative;width:2.5rem;height:2.5rem;border-radius:999px;
border:2px dashed var(--vibeui-datagrid-011-border);
}
[data-vibeui-block="datagrid-011"] [data-part="glyph"]::after{
content:"";position:absolute;left:50%;top:50%;
width:1rem;height:2px;border-radius:1px;
background:var(--vibeui-datagrid-011-border);transform:translate(-50%,-50%);
}
[data-vibeui-block="datagrid-011"] [data-part="empty-title"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="datagrid-011"] [data-part="empty-text"]{
margin:0;max-width:26rem;font-size:0.8125rem;line-height:1.45;
color:var(--vibeui-datagrid-011-muted);
}
[data-vibeui-block="datagrid-011"] [data-part="empty-actions"]{display:flex;flex-wrap:wrap;gap:0.375rem;margin-top:0.25rem}
[data-vibeui-block="datagrid-011"] [data-part="empty-actions"] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:550;
padding:0.375rem 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-datagrid-011-border);
background:var(--vibeui-datagrid-011-bg);color:var(--vibeui-datagrid-011-fg);
}
[data-vibeui-block="datagrid-011"] [data-part="empty-actions"] button[data-tone="primary"]{
border-color:transparent;background:var(--vibeui-datagrid-011-accent);color:oklch(1 0 0);
}
[data-vibeui-block="datagrid-011"] [data-part="empty-actions"] button:focus-visible{outline:2px solid var(--vibeui-datagrid-011-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Datagrid011Row[] = [
  {
    id: "r1",
    request: "Замена ручек",
    city: "Москва",
    status: "В работе",
    score: 74,
  },
  {
    id: "r2",
    request: "Доставка витрины",
    city: "Казань",
    status: "Новая",
    score: 91,
  },
  {
    id: "r3",
    request: "Ремонт полки",
    city: "Сочи",
    status: "В работе",
    score: 63,
  },
  {
    id: "r4",
    request: "Возврат ковра",
    city: "Москва",
    status: "Архив",
    score: 88,
  },
  {
    id: "r5",
    request: "Сборка стола",
    city: "Сочи",
    status: "Новая",
    score: 79,
  },
  {
    id: "r6",
    request: "Замер кухни",
    city: "Петербург",
    status: "Архив",
    score: 95,
  },
]

const FILTERS: {
  id: string
  label: string
  test: (row: Datagrid011Row) => boolean
}[] = [
  {
    id: "status",
    label: "Статус: архив",
    test: (row) => row.status === "Архив",
  },
  { id: "city", label: "Город: Сочи", test: (row) => row.city === "Сочи" },
  { id: "score", label: "Оценка от 90", test: (row) => row.score >= 90 },
]

/**
 * Сетка с пустым состоянием: когда фильтры сошлись в ноль, тело таблицы
 * объясняет причину и предлагает сбросить фильтры. Один файл.
 */
export function Datagrid011({
  rows = DEFAULT_ROWS,
  caption = "Заявки сервисной службы",
  emptyTitle = "Ни одной заявки не подошло",
  accent,
  className,
  style,
  ...props
}: Datagrid011Props) {
  const [active, setActive] = useState<string[]>(FILTERS.map((one) => one.id))

  const applied = FILTERS.filter((one) => active.includes(one.id))
  const visible = rows.filter((row) => applied.every((one) => one.test(row)))

  const palette = {
    ...(accent ? { "--vibeui-datagrid-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-011" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="datagrid-011"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <h3 data-part="title">Заявки</h3>
          {applied.map((one) => (
            <button
              key={one.id}
              type="button"
              data-part="chip"
              aria-label={`Снять фильтр «${one.label}»`}
              onClick={() =>
                setActive((current) =>
                  current.filter((value) => value !== one.id),
                )
              }
            >
              {one.label}
              <span aria-hidden="true">×</span>
            </button>
          ))}
          <button
            type="button"
            data-part="reset"
            disabled={applied.length === 0}
            onClick={() => setActive([])}
          >
            Сбросить всё
          </button>
        </div>
        <div
          data-part="scroll"
          role="region"
          aria-label="Таблица заявок, прокручивается вбок"
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col">Заявка</th>
                <th scope="col">Город</th>
                <th scope="col">Статус</th>
                <th scope="col" data-align="end">
                  Оценка
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.request}</th>
                  <td data-part="muted">{row.city}</td>
                  <td data-part="muted">{row.status}</td>
                  <td data-align="end">{row.score}</td>
                </tr>
              ))}
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={4} data-part="empty-cell">
                    <div data-part="empty" aria-live="polite">
                      <span data-part="glyph" aria-hidden="true" />
                      <p data-part="empty-title">{emptyTitle}</p>
                      <p data-part="empty-text">
                        Одновременно стоят фильтры:{" "}
                        {applied.map((one) => one.label).join(", ")}. Снимите
                        один из них или сбросьте все — данные никуда не делись.
                      </p>
                      <div data-part="empty-actions">
                        <button
                          type="button"
                          data-tone="primary"
                          onClick={() => setActive([])}
                        >
                          Сбросить фильтры
                        </button>
                        <button type="button">Создать заявку</button>
                      </div>
                    </div>
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
