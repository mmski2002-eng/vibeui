"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Datagrid020Row = {
  id: string
  deal: string
  /** Ключ этапа: значение из stages, оно же попадает в фильтр. */
  stage: string
  owner: string
  amount: number
}

export type Datagrid020Sort = "amount" | "deal" | "stage"

export type Datagrid020View = {
  id: string
  label: string
  state: { stage: string; sort: Datagrid020Sort }
}

export type Datagrid020Props = Omit<ComponentProps<"section">, "children"> & {
  rows?: Datagrid020Row[]
  caption?: string
  startView?: string
  /** Сохранённые представления: компонент несёт русские. */
  views?: Datagrid020View[]
  /** Этапы сделки в порядке воронки: они же значения фильтра. */
  stages?: string[]
  /** Названия способов сортировки по ключу. */
  sortText?: Record<string, string>
  /** Подпись фильтра по этапу. */
  stageLabel?: string
  /** Значение «любой этап» в списке. */
  anyStageText?: string
  /** Подпись списка сортировки. */
  sortLabel?: string
  /** Подпись кнопки сохранения в представление. */
  saveText?: string
  /** Пометка «набор отличается от сохранённого». */
  dirtyText?: string
  /** Подпись полосы представлений для скринридера. */
  navLabel?: string
  /** Строка, когда в представлении нет строк. */
  emptyText?: string
  /** Заголовки колонок по ключу: компонент несёт русские. */
  columnText?: Record<string, string>
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Пусто — подложки нет, сетка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: настройки сетки живут не в голове пользователя, а в
// именованных представлениях. Представление — это связка «фильтр по этапу
// плюс сортировка»; переключение восстанавливает обе половины сразу.
// Активная вкладка помечена aria-current, а отклонение от сохранённого
// набора показано отдельной пометкой «изменено» — без неё непонятно,
// смотришь ты представление или уже что-то своё.
//
// Тема берётся из color-scheme окружения через light-dark(): сетка темнеет
// вместе со страницей и не носит собственной подложки.
const STYLES = `
:where([data-vibeui-block="datagrid-020"]){
--vibeui-datagrid-020-bg:transparent;
--vibeui-datagrid-020-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
--vibeui-datagrid-020-muted:color-mix(in oklab,var(--vibeui-datagrid-020-fg) 68%,transparent);
--vibeui-datagrid-020-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-datagrid-020-head:light-dark(oklch(0.975 0 285),oklch(0.27 0 285));
--vibeui-datagrid-020-panel:light-dark(oklch(0.985 0 285),oklch(0.26 0 285));
--vibeui-datagrid-020-accent:light-dark(oklch(0.27 0 0),oklch(0.91 0 0));
--vibeui-datagrid-020-chip:light-dark(oklch(0.97 0.025 320),oklch(0.31 0 0));
--vibeui-datagrid-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="datagrid-020"]{color-scheme:dark}
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
background:transparent;color:var(--vibeui-datagrid-020-muted);
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
background:var(--vibeui-datagrid-020-panel);
}
[data-vibeui-block="datagrid-020"] [data-part="tools"] label{
display:inline-flex;align-items:center;gap:0.375rem;font-size:0.75rem;color:var(--vibeui-datagrid-020-muted);
}
[data-vibeui-block="datagrid-020"] select{
font:inherit;font-size:0.75rem;color:inherit;padding:0.25rem 0.4375rem;
border:1px solid var(--vibeui-datagrid-020-border);border-radius:0.4375rem;
background:transparent;
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

type ViewState = Datagrid020View["state"]

const VIEWS: Datagrid020View[] = [
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

const SORTS: Datagrid020Sort[] = ["deal", "amount", "stage"]

const SORT_TEXT: Record<string, string> = {
  deal: "по названию",
  amount: "по сумме",
  stage: "по этапу",
}

const COLUMN_TEXT: Record<string, string> = {
  deal: "Сделка",
  stage: "Этап",
  owner: "Ответственный",
  amount: "Сумма, ₽",
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
 * Сетка с сохранёнными представлениями: вкладка восстанавливает фильтр и
 * сортировку разом, отклонение помечается. Один файл, ноль зависимостей.
 */
export function Datagrid020({
  rows = DEFAULT_ROWS,
  caption = "Представление хранит фильтр по этапу и порядок сортировки",
  startView = "hot",
  views = VIEWS,
  stages = STAGES,
  sortText = SORT_TEXT,
  stageLabel = "Этап",
  anyStageText = "любой",
  sortLabel = "Сортировка",
  saveText = "Сохранить в представление",
  dirtyText = "изменено",
  navLabel = "Сохранённые представления сетки",
  emptyText = "В этом представлении нет сделок",
  columnText = COLUMN_TEXT,
  scrollLabel = "Таблица сделок, прокручивается вбок",
  background = "",
  accent,
  className,
  style,
  ...props
}: Datagrid020Props) {
  // Правки читателя живут рядом с пропами, а не вместо них: смена views
  // или startView снаружи обязана переставить сетку, иначе пропы работали
  // бы ровно один раз, при монтировании.
  const [edited, setEdited] = useState<Datagrid020View[] | null>(null)
  const [seedViews, setSeedViews] = useState(views)
  const [seedStart, setSeedStart] = useState(startView)
  const [active, setActive] = useState(startView)
  const [state, setState] = useState<ViewState>(
    views.find((view) => view.id === startView)?.state ?? views[0].state,
  )

  if (seedViews !== views) {
    setSeedViews(views)
    setEdited(null)
  }

  if (seedStart !== startView) {
    setSeedStart(startView)
    setActive(startView)
    setState(
      views.find((view) => view.id === startView)?.state ?? views[0].state,
    )
  }

  const list = edited ?? views
  const saved = list.find((view) => view.id === active)?.state
  const dirty =
    !saved || saved.stage !== state.stage || saved.sort !== state.sort

  // Порядок задан списком, а не щелчком по шапке, но колонка всё равно обязана
  // сообщить о себе: без aria-sort скринридер не узнает, чем отсортирована таблица.
  const sortOf = (column: ViewState["sort"]) =>
    state.sort !== column
      ? "none"
      : column === "amount"
        ? "descending"
        : "ascending"

  const visible = rows
    .filter((row) => state.stage === "" || row.stage === state.stage)
    .slice()
    .sort((left, right) => {
      if (state.sort === "amount") {
        return right.amount - left.amount
      }

      if (state.sort === "stage") {
        return stages.indexOf(left.stage) - stages.indexOf(right.stage)
      }

      return left.deal.localeCompare(right.deal, "ru")
    })

  const palette = {
    ...(accent ? { "--vibeui-datagrid-020-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-datagrid-020-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-020" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="data-grid"
        data-vibeui-block="datagrid-020"
        className={className}
        style={palette}
      >
        <nav data-part="views" aria-label={navLabel}>
          {list.map((view) => (
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
              {dirtyText}
            </span>
          ) : null}
        </nav>
        <div data-part="tools">
          <label>
            {stageLabel}
            <select
              value={state.stage}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  stage: event.target.value,
                }))
              }
            >
              <option value="">{anyStageText}</option>
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </label>
          <label>
            {sortLabel}
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
                <option key={item} value={item}>
                  {sortText[item] ?? SORT_TEXT[item]}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            data-part="save"
            disabled={!dirty}
            onClick={() =>
              setEdited((current) =>
                (current ?? views).map((view) =>
                  view.id === active ? { ...view, state } : view,
                ),
              )
            }
          >
            {saveText}
          </button>
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
                <th scope="col" aria-sort={sortOf("deal")}>
                  {columnText.deal ?? COLUMN_TEXT.deal}
                </th>
                <th scope="col" aria-sort={sortOf("stage")}>
                  {columnText.stage ?? COLUMN_TEXT.stage}
                </th>
                <th scope="col">{columnText.owner ?? COLUMN_TEXT.owner}</th>
                <th scope="col" data-align="end" aria-sort={sortOf("amount")}>
                  {columnText.amount ?? COLUMN_TEXT.amount}
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
                    {emptyText}
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
