import type { CSSProperties } from "react"

export type Dashboard055View = {
  name: string
  count: number
  shared: boolean
  active?: boolean
}

export type Dashboard055Filter = {
  field: string
  value: string
}

export type Dashboard055Row = {
  id: string
  subject: string
  customer: string
  owner: string
  stage: string
  amount: string
  due: string
  state: "ok" | "warn" | "late"
}

export type Dashboard055Props = {
  title?: string
  views?: Dashboard055View[]
  filters?: Dashboard055Filter[]
  rows?: Dashboard055Row[]
  activeView?: string
  saveLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: сетка заявок, где сохранённое представление — это не украшение,
// а единственный способ не собирать один и тот же набор фильтров каждое утро.
// Поэтому представления стоят слева отдельной колонкой со счётчиком строк, а
// активные фильтры продублированы чипами над таблицей: свёрнутое условие,
// которого не видно, приводит к вопросу «почему тут пусто». Расхождение между
// сохранённым представлением и текущими фильтрами подписано словами и кнопкой
// сохранения — иначе пользователь теряет правки, переключив вид.
const STYLES = `
:where([data-vibeui-block="dashboard-055"]){
--vibeui-dashboard-055-bg:oklch(0.985 0.003 260);
--vibeui-dashboard-055-card:oklch(1 0 0);
--vibeui-dashboard-055-fg:oklch(0.21 0.014 260);
--vibeui-dashboard-055-muted:oklch(0.55 0.014 260);
--vibeui-dashboard-055-border:oklch(0.91 0.006 260);
--vibeui-dashboard-055-accent:oklch(0.52 0.16 260);
--vibeui-dashboard-055-soft:oklch(0.965 0.018 260);
--vibeui-dashboard-055-warn:oklch(0.68 0.15 72);
--vibeui-dashboard-055-late:oklch(0.57 0.19 25);
--vibeui-dashboard-055-ok:oklch(0.6 0.13 155);
--vibeui-dashboard-055-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-055"]{
box-sizing:border-box;width:100%;
background:var(--vibeui-dashboard-055-bg);
color:var(--vibeui-dashboard-055-fg);
font-family:var(--vibeui-dashboard-055-sans);
border:1px solid var(--vibeui-dashboard-055-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-055"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-055"] [data-part="shell"]{display:grid;grid-template-columns:1fr;gap:0.875rem}
[data-vibeui-block="dashboard-055"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-055"] h3{margin:0;font-size:0.75rem;font-weight:750;text-transform:uppercase;letter-spacing:0.06em;color:var(--vibeui-dashboard-055-muted)}
[data-vibeui-block="dashboard-055"] [data-part="side"]{display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="dashboard-055"] [data-part="views"]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.25rem}
[data-vibeui-block="dashboard-055"] [data-part="view"]{
display:flex;align-items:center;gap:0.5rem;width:100%;
appearance:none;border:1px solid transparent;cursor:pointer;font:inherit;text-align:left;
font-size:0.8125rem;padding:0.4375rem 0.5625rem;border-radius:0.5625rem;
background:transparent;color:inherit;
}
[data-vibeui-block="dashboard-055"] [data-part="view"][aria-current="true"]{
background:var(--vibeui-dashboard-055-soft);
border-color:color-mix(in oklab,var(--vibeui-dashboard-055-accent) 30%,white);
font-weight:750;
}
[data-vibeui-block="dashboard-055"] [data-part="view"] em{
font-style:normal;font-size:0.625rem;color:var(--vibeui-dashboard-055-muted);
border:1px solid var(--vibeui-dashboard-055-border);border-radius:0.3125rem;padding:0 0.25rem;
}
[data-vibeui-block="dashboard-055"] [data-part="view"] b{
margin-left:auto;font-variant-numeric:tabular-nums;font-size:0.75rem;font-weight:700;
color:var(--vibeui-dashboard-055-muted);
}
[data-vibeui-block="dashboard-055"] [data-part="main"]{display:flex;flex-direction:column;gap:0.625rem;min-width:0}
[data-vibeui-block="dashboard-055"] [data-part="bar"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem}
[data-vibeui-block="dashboard-055"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.375rem;font-size:0.6875rem;font-weight:650;
background:var(--vibeui-dashboard-055-card);border:1px solid var(--vibeui-dashboard-055-border);
border-radius:9999px;padding:0.25rem 0.5rem 0.25rem 0.5625rem;
}
[data-vibeui-block="dashboard-055"] [data-part="chip"] span{color:var(--vibeui-dashboard-055-muted);font-weight:500}
[data-vibeui-block="dashboard-055"] [data-part="drop"]{
appearance:none;border:0;background:transparent;cursor:pointer;font:inherit;
line-height:1;font-size:0.875rem;color:var(--vibeui-dashboard-055-muted);padding:0;
}
[data-vibeui-block="dashboard-055"] [data-part="save"]{
margin-left:auto;appearance:none;cursor:pointer;font:inherit;
font-size:0.75rem;font-weight:700;padding:0.375rem 0.75rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-055-accent);color:oklch(1 0 0);border:0;
}
[data-vibeui-block="dashboard-055"] [data-part="scroll"]{
overflow-x:auto;background:var(--vibeui-dashboard-055-card);
border:1px solid var(--vibeui-dashboard-055-border);border-radius:0.875rem;
}
[data-vibeui-block="dashboard-055"] table{border-collapse:collapse;width:100%;min-width:44rem;font-size:0.8125rem}
[data-vibeui-block="dashboard-055"] th{
text-align:left;font-size:0.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;
color:var(--vibeui-dashboard-055-muted);padding:0.625rem 0.75rem;
border-bottom:1px solid var(--vibeui-dashboard-055-border);white-space:nowrap;
}
[data-vibeui-block="dashboard-055"] td{padding:0.625rem 0.75rem;border-bottom:1px solid var(--vibeui-dashboard-055-border);vertical-align:top}
[data-vibeui-block="dashboard-055"] tbody tr:last-child td{border-bottom:0}
[data-vibeui-block="dashboard-055"] [data-part="id"]{font-size:0.6875rem;color:var(--vibeui-dashboard-055-muted);display:block}
[data-vibeui-block="dashboard-055"] [data-part="subject"]{font-weight:700}
[data-vibeui-block="dashboard-055"] [data-part="num"]{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap;font-weight:700}
[data-vibeui-block="dashboard-055"] [data-part="due"]{display:inline-flex;align-items:center;gap:0.375rem;white-space:nowrap;font-weight:650}
[data-vibeui-block="dashboard-055"] [data-part="due"]::before{content:"";width:0.4375rem;height:0.4375rem;border-radius:50%;background:var(--vibeui-dashboard-055-ok)}
[data-vibeui-block="dashboard-055"] tr[data-state="warn"] [data-part="due"]::before{background:var(--vibeui-dashboard-055-warn);border-radius:0.125rem}
[data-vibeui-block="dashboard-055"] tr[data-state="late"] [data-part="due"]::before{background:var(--vibeui-dashboard-055-late);border-radius:0;transform:rotate(45deg)}
[data-vibeui-block="dashboard-055"] tr[data-state="late"] [data-part="due"]{color:var(--vibeui-dashboard-055-late)}
[data-vibeui-block="dashboard-055"] [data-part="stage"]{
display:inline-block;font-size:0.6875rem;font-weight:700;padding:0.125rem 0.4375rem;border-radius:0.375rem;
background:var(--vibeui-dashboard-055-soft);white-space:nowrap;
}
[data-vibeui-block="dashboard-055"] [data-part="foot"]{
display:flex;flex-wrap:wrap;gap:0.5rem 0.875rem;font-size:0.6875rem;color:var(--vibeui-dashboard-055-muted);
}
[data-vibeui-block="dashboard-055"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-055-accent);outline-offset:2px;
}
@container (min-width: 52rem){
[data-vibeui-block="dashboard-055"] [data-part="shell"]{grid-template-columns:13rem minmax(0,1fr);align-items:start}
[data-vibeui-block="dashboard-055"] [data-part="head"]{grid-column:1 / -1}
}
`

const DEFAULT_VIEWS: Dashboard055View[] = [
  { name: "Все заявки", count: 1248, shared: false },
  { name: "Мои на этой неделе", count: 37, shared: false, active: true },
  { name: "Просроченные", count: 9, shared: true },
  { name: "Крупные сделки", count: 24, shared: true },
  { name: "Без исполнителя", count: 15, shared: true },
  { name: "Ждут ответа клиента", count: 61, shared: false },
]

const DEFAULT_FILTERS: Dashboard055Filter[] = [
  { field: "Исполнитель", value: "я" },
  { field: "Срок", value: "до 14 июня" },
  { field: "Этап", value: "не «Закрыта»" },
  { field: "Сумма", value: "от 100 000 ₽" },
]

const DEFAULT_ROWS: Dashboard055Row[] = [
  {
    id: "ЗК-4821",
    subject: "Поставка стеллажей на склад",
    customer: "ООО «Северный лес»",
    owner: "Ирина К.",
    stage: "Согласование",
    amount: "412 000 ₽",
    due: "сегодня",
    state: "warn",
  },
  {
    id: "ЗК-4817",
    subject: "Замена контроллеров линии розлива",
    customer: "Комбинат «Заря»",
    owner: "Ирина К.",
    stage: "Смета",
    amount: "1 240 000 ₽",
    due: "12 июня",
    state: "ok",
  },
  {
    id: "ЗК-4802",
    subject: "Продление сервисного договора",
    customer: "Аптеки «Вита»",
    owner: "Ирина К.",
    stage: "Договор",
    amount: "186 500 ₽",
    due: "просрочено на 3 дня",
    state: "late",
  },
  {
    id: "ЗК-4795",
    subject: "Пусконаладка станции очистки",
    customer: "Водоканал Тюмени",
    owner: "Ирина К.",
    stage: "Смета",
    amount: "930 000 ₽",
    due: "14 июня",
    state: "ok",
  },
  {
    id: "ЗК-4788",
    subject: "Обучение операторов на площадке",
    customer: "ТД «Ремстрой»",
    owner: "Ирина К.",
    stage: "Согласование",
    amount: "128 000 ₽",
    due: "завтра",
    state: "warn",
  },
]

/**
 * Сетка заявок с сохранёнными представлениями: список видов со счётчиками,
 * активные фильтры чипами и таблица с состоянием срока. Один файл,
 * ноль зависимостей, клиентского JS нет.
 */
export function Dashboard055({
  title = "Заявки",
  views = DEFAULT_VIEWS,
  filters = DEFAULT_FILTERS,
  rows = DEFAULT_ROWS,
  activeView = "Мои на этой неделе",
  saveLabel = "Сохранить как представление",
  accent,
  className,
  style,
}: Dashboard055Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-055-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-055" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-055"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
          </div>

          <nav data-part="side" aria-label="Сохранённые представления">
            <h3>Представления</h3>
            <ul data-part="views">
              {views.map((view) => (
                <li key={view.name}>
                  <button
                    type="button"
                    data-part="view"
                    aria-current={view.name === activeView}
                  >
                    {view.name}
                    {view.shared ? <em>общее</em> : null}
                    <b>{view.count.toLocaleString("ru-RU")}</b>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div data-part="main">
            <div data-part="bar">
              {filters.map((filter) => (
                <span key={filter.field} data-part="chip">
                  <span>{filter.field}:</span>
                  {filter.value}
                  <button
                    type="button"
                    data-part="drop"
                    aria-label={`Снять фильтр «${filter.field}»`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <button type="button" data-part="save">
                {saveLabel}
              </button>
            </div>

            <div data-part="scroll">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Заявка</th>
                    <th scope="col">Клиент</th>
                    <th scope="col">Этап</th>
                    <th scope="col">Сумма</th>
                    <th scope="col">Срок</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} data-state={row.state}>
                      <td>
                        <span data-part="id">{row.id}</span>
                        <span data-part="subject">{row.subject}</span>
                      </td>
                      <td>{row.customer}</td>
                      <td>
                        <span data-part="stage">{row.stage}</span>
                      </td>
                      <td data-part="num">{row.amount}</td>
                      <td>
                        <span data-part="due">{row.due}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p data-part="foot">
              <span>
                Показано {rows.length} из{" "}
                {views
                  .find((view) => view.name === activeView)
                  ?.count.toLocaleString("ru-RU") ?? "—"}
              </span>
              <span>
                Фильтров применено: {filters.length}. Представление изменено и
                пока не сохранено.
              </span>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
