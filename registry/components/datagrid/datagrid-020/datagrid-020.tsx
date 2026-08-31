"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Datagrid020Row = {
  id: string
  deal: string
  stage: "Квалификация" | "Предложение" | "Переговоры" | "Закрыта"
  owner: string
  amount: number
}

export type Datagrid020Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  rows?: Datagrid020Row[]
  caption?: string
  startView?: string
  accent?: string
}

// Идея компонента: настройки сетки живут не в голове пользователя, а в
// именованных представлениях. Представление — это связка «фильтр по этапу
// плюс сортировка»; переключение восстанавливает обе половины сразу.
// Активная вкладка помечена aria-current, а отклонение от сохранённого
// набора показано отдельной пометкой «изменено» — без неё непонятно,
// смотришь ты представление или уже что-то своё.
const STYLES = `
:where([data-vibeui-block="datagrid-020"]){
--vibeui-datagrid-020-bg:oklch(1 0 0);
--vibeui-datagrid-020-fg:oklch(0.23 0.014 285);
--vibeui-datagrid-020-muted:oklch(0.55 0.014 285);
--vibeui-datagrid-020-border:oklch(0.92 0.006 285);
--vibeui-datagrid-020-head:oklch(0.975 0.003 285);
--vibeui-datagrid-020-accent:oklch(0.48 0.15 320);
--vibeui-datagrid-020-chip:oklch(0.97 0.025 320);
--vibeui-datagrid-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="datagrid-020"]{
box-sizing:border-box;width:100%;max-width:52rem;margin:0 auto;
background:var(--vibeui-datagrid-020-bg);color:var(--vibeui-datagrid-020-fg);
border:1px solid var(--vibeui-datagrid-020-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-020-font);overflow:hidden;
}
[data-vibeui-block="datagrid-020"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-020"] [data-part="views"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
padding:0.625rem 0.875rem;border-bottom:1px solid var(--vibeui-datagrid-020-border);
}
[data-vibeui-block="datagrid-020"] [data-part="view"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:550;
padding:0.3125rem 0.6875rem;border-radius:999px;
border:1px solid var(--vibeui-datagrid-020-border);
background:var(--vibeui-datagrid-020-bg);color:var(--vibeui-datagrid-020-muted);
}
[data-vibeui-block="datagrid-020"] [data-part="view"][aria-current="true"]{
border-color:var(--vibeui-datagrid-020-accent);background:var(--vibeui-datagrid-020-chip);
color:var(--vibeui-datagrid-020-accent);
}
[data-vibeui-block="datagrid-020"] [data-part="view"]:focus-visible{outline:2px solid var(--vibeui-datagrid-020-accent);outline-offset:2px}
[data-vibeui-block="datagrid-020"] [data-part="dirty"]{
margin-inline-start:auto;font-size:0.6875rem;font-weight:600;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-datagrid-020-accent);
}
[data-vibeui-block="datagrid-020"] [data-part="tools"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.625rem 0.875rem;border-bottom:1px solid var(--vibeui-datagrid-020-border);
background:oklch(0.985 0.004 285);
}
[data-vibeui-block="datagrid-020"] [data-part="tools"] label{
display:inline-flex;align-items:center;gap:0.375rem;font-size:0.75rem;color:var(--vibeui-datagrid-020-muted);
}
[data-vibeui-block="datagrid-020"] select{
font:inherit;font-size:0.75rem;color:inherit;padding:0.25rem 0.4375rem;
border:1px solid var(--vibeui-datagrid-020-border);border-radius:0.4375rem;
background:var(--vibeui-datagrid-020-bg);
}
[data-vibeui-block="datagrid-020"] select:focus-visible{outline:2px solid var(--vibeui-datagrid-020-accent);outline-offset:1px}
[data-vibeui-block="datagrid-020"] [data-part="save"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:600;margin-inline-start:auto;
padding:0.3125rem 0.625rem;border-radius:0.4375rem;border:1px solid var(--vibeui-datagrid-020-accent);
background:transparent;color:var(--vibeui-datagrid-020-accent);
}
[data-vibeui-block="datagrid-020"] [data-part="save"]:disabled{opacity:.4;cursor:not-allowed}
[data-vibeui-block="datagrid-020"] [data-part="save"]:focus-visible{outline:2px solid var(--vibeui-datagrid-020-accent);outline-offset:2px}
[data-vibeui-block="datagrid-020"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-020"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-020-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-020"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-020"] caption{
padding:0.625rem 0.875rem;text-align:left;font-size:0.75rem;color:var(--vibeui-datagrid-020-muted);caption-side:top;
}
[data-vibeui-block="datagrid-020"] th,
[data-vibeui-block="datagrid-020"] td{
padding:0.5rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-datagrid-020-border);
}
[data-vibeui-block="datagrid-020"] thead th{background:var(--vibeui-datagrid-020-head);font-weight:600}
[data-vibeui-block="datagrid-020"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-020"] [data-part="stage"]{
display:inline-flex;align-items:center;gap:0.375rem;font-size:0.75rem;
}
[data-vibeui-block="datagrid-020"] [data-part="stage"]::before{content:"";width:0.4375rem;height:0.4375rem;border-radius:999px;background:currentColor}
[data-vibeui-block="datagrid-020"] [data-part="none"]{padding:1.5rem 0.875rem;text-align:center;color:var(--vibeui-datagrid-020-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-020"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Datagrid020Row[] = [
  {
    id: "v1",
    deal: "Обновление парка",
    stage: "Переговоры",
    owner: "Гараев",
    amount: 2100000,
  },
  {
    id: "v2",
    deal: "Пилот на складе",
    stage: "Квалификация",
    owner: "Лапина",
    amount: 340000,
  },
  {
    id: "v3",
    deal: "Годовая лицензия",
    stage: "Предложение",
    owner: "Гараев",
    amount: 890000,
  },
  {
    id: "v4",
    deal: "Интеграция с 1С",
    stage: "Переговоры",
    owner: "Мещеряков",
    amount: 1450000,
  },
  {
    id: "v5",
    deal: "Продление поддержки",
    stage: "Закрыта",
    owner: "Лапина",
    amount: 620000,
  },
  {
    id: "v6",
    deal: "Внедрение в филиале",
    stage: "Предложение",
    owner: "Мещеряков",
    amount: 1780000,
  },
]

type ViewState = { stage: string; sort: "amount" | "deal" | "stage" }

const VIEWS: { id: string; label: string; state: ViewState }[] = [
  { id: "all", label: "Все сделки", state: { stage: "", sort: "deal" } },
  {
    id: "hot",
    label: "В переговорах",
    state: { stage: "Переговоры", sort: "amount" },
  },
  { id: "new", label: "Новые", state: { stage: "Квалификация", sort: "deal" } },
  { id: "won", label: "Закрытые", state: { stage: "Закрыта", sort: "amount" } },
]

const STAGES = ["Квалификация", "Предложение", "Переговоры", "Закрыта"]

const SORTS: { value: ViewState["sort"]; label: string }[] = [
  { value: "deal", label: "по названию" },
  { value: "amount", label: "по сумме" },
  { value: "stage", label: "по этапу" },
]

/**
 * Сетка с сохранёнными представлениями: вкладка восстанавливает фильтр и
 * сортировку разом, отклонение помечается. Один файл, ноль зависимостей.
 */
export function Datagrid020({
  rows = DEFAULT_ROWS,
  caption = "Представление хранит фильтр по этапу и порядок сортировки",
  startView = "hot",
  accent,
  className,
  style,
  ...props
}: Datagrid020Props) {
  const [views, setViews] = useState(VIEWS)
  const [active, setActive] = useState(startView)
  const [state, setState] = useState<ViewState>(
    VIEWS.find((view) => view.id === startView)?.state ?? VIEWS[0].state,
  )

  const saved = views.find((view) => view.id === active)?.state
  const dirty =
    !saved || saved.stage !== state.stage || saved.sort !== state.sort

  const visible = rows
    .filter((row) => state.stage === "" || row.stage === state.stage)
    .slice()
    .sort((left, right) => {
      if (state.sort === "amount") {
        return right.amount - left.amount
      }

      if (state.sort === "stage") {
        return STAGES.indexOf(left.stage) - STAGES.indexOf(right.stage)
      }

      return left.deal.localeCompare(right.deal, "ru")
    })

  const palette = {
    ...(accent ? { "--vibeui-datagrid-020-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-020" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="datagrid-020"
        className={className}
        style={palette}
      >
        <nav data-part="views" aria-label="Сохранённые представления сетки">
          {views.map((view) => (
            <button
              key={view.id}
              type="button"
              data-part="view"
              aria-current={active === view.id ? "true" : undefined}
              onClick={() => {
                setActive(view.id)
                setState(view.state)
              }}
            >
              {view.label}
            </button>
          ))}
          {dirty ? (
            <span data-part="dirty" role="status" aria-live="polite">
              изменено
            </span>
          ) : null}
        </nav>
        <div data-part="tools">
          <label>
            Этап
            <select
              value={state.stage}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  stage: event.target.value,
                }))
              }
            >
              <option value="">любой</option>
              {STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </label>
          <label>
            Сортировка
            <select
              value={state.sort}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  sort: event.target.value as ViewState["sort"],
                }))
              }
            >
              {SORTS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            data-part="save"
            disabled={!dirty}
            onClick={() =>
              setViews((current) =>
                current.map((view) =>
                  view.id === active ? { ...view, state } : view,
                ),
              )
            }
          >
            Сохранить в представление
          </button>
        </div>
        <div
          data-part="scroll"
          role="region"
          aria-label="Таблица сделок, прокручивается вбок"
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col">Сделка</th>
                <th scope="col">Этап</th>
                <th scope="col">Ответственный</th>
                <th scope="col" data-align="end">
                  Сумма, ₽
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.deal}</th>
                  <td>
                    <span data-part="stage">{row.stage}</span>
                  </td>
                  <td>{row.owner}</td>
                  <td data-align="end">{row.amount.toLocaleString("ru-RU")}</td>
                </tr>
              ))}
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={4} data-part="none">
                    В этом представлении нет сделок
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
