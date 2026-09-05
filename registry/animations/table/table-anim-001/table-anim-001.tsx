import type { ComponentProps, CSSProperties } from "react"

export type TableAnim001Row = {
  name: string
  segment: string
  value: string
  statusLabel: string
  statusTone: "success" | "warning" | "neutral"
}

export type TableAnim001Columns = {
  name: string
  segment: string
  value: string
  status: string
}

export type TableAnim001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  badge?: string
  columns?: TableAnim001Columns
  rows?: TableAnim001Row[]
  accent?: string
  /** Плотная раскладка строк — меньше вертикальных отступов. */
  compact?: boolean
  /** Колонка, у которой показана активная стрелка сортировки. */
  sortColumn?: "name" | "value"
  sortDirection?: "asc" | "desc"
}

// Идея: таблица данных, где строки въезжают снизу вверх по очереди — как и
// у activity-001, анимацией управляет один именованный view-timeline на
// карточке, а стаггер строк — это просто разные срезы одного и того же
// таймлайна (animation-range сдвинут по номеру строки), без единой строчки
// JS. При наведении строка подсвечивается фоном. Заголовки колонок «Клиент»
// и «Доход» несут иконку сортировки: активная — стрелкой в цвет акцента,
// остальные сортируемые — приглушённой парой стрелок.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, класс
// .dark чужого проекта переводит компонент в тёмную ветку отдельной строкой
// ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="table-anim-001"]){
--vibeui-table-anim-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-table-anim-001-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-table-anim-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-table-anim-001-muted:color-mix(in oklab,var(--vibeui-table-anim-001-fg) 62%,transparent);
--vibeui-table-anim-001-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-table-anim-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-table-anim-001-success:light-dark(oklch(0.6 0.15 148),oklch(0.72 0.14 148));
--vibeui-table-anim-001-warning:light-dark(oklch(0.68 0.15 78),oklch(0.78 0.13 78));
--vibeui-table-anim-001-neutral:var(--vibeui-table-anim-001-muted);
--vibeui-table-anim-001-hover:color-mix(in oklab,var(--vibeui-table-anim-001-fg) 5%,transparent);
--vibeui-table-anim-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="table-anim-001"]{color-scheme:dark}
[data-vibeui-block="table-anim-001"]{
display:block;box-sizing:border-box;width:100%;max-width:28rem;margin:0;
color:var(--vibeui-table-anim-001-fg);font-family:var(--vibeui-table-anim-001-font);
}
[data-vibeui-block="table-anim-001"] *{box-sizing:border-box}
[data-vibeui-block="table-anim-001"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-table-anim-001-border);
background:var(--vibeui-table-anim-001-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
overflow:hidden;
view-timeline:--vibeui-table-anim-001 block;
}
[data-vibeui-block="table-anim-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.875rem;border-bottom:1px solid var(--vibeui-table-anim-001-border);
}
[data-vibeui-block="table-anim-001"] [data-part="gtitle"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="table-anim-001"] [data-part="badge"]{
display:inline-flex;align-items:center;justify-content:center;
height:1rem;min-width:1rem;padding:0 0.3125rem;border-radius:9999px;
font-size:0.5625rem;font-weight:650;font-variant-numeric:tabular-nums;
color:var(--vibeui-table-anim-001-accent);
background:color-mix(in oklab,var(--vibeui-table-anim-001-accent) 14%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-table-anim-001-accent) 22%,transparent);
}
[data-vibeui-block="table-anim-001"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="table-anim-001"] [data-part="table"]{
width:100%;border-collapse:collapse;font-size:0.6875rem;
}
[data-vibeui-block="table-anim-001"] [data-part="th"]{
text-align:left;padding:0.5rem 0.875rem;white-space:nowrap;
font-size:0.625rem;font-weight:650;color:var(--vibeui-table-anim-001-muted);
border-bottom:1px solid var(--vibeui-table-anim-001-border);
}
[data-vibeui-block="table-anim-001"] [data-part="th"][data-align="end"]{text-align:right}
[data-vibeui-block="table-anim-001"] [data-part="thlabel"]{
display:inline-flex;align-items:center;gap:0.25rem;
}
[data-vibeui-block="table-anim-001"] [data-part="sort"]{flex:none;width:0.75rem;height:0.75rem}
[data-vibeui-block="table-anim-001"] [data-part="sort"][data-active="true"]{color:var(--vibeui-table-anim-001-accent)}
[data-vibeui-block="table-anim-001"] [data-part="sort"][data-active="false"]{color:var(--vibeui-table-anim-001-border)}
[data-vibeui-block="table-anim-001"] [data-part="sort"][data-dir="desc"]{transform:rotate(180deg)}
/* Строки въезжают по мере прокрутки карточки в вид: анимацией управляет
   view-timeline карточки, а не время. Стаггер — сдвигом диапазона по номеру
   строки. Где scroll-driven не поддержан, длительности нет и строка сразу
   в конечном состоянии (видима). */
[data-vibeui-block="table-anim-001"] [data-part="row"]{
border-bottom:1px solid var(--vibeui-table-anim-001-border);
transition:background-color .15s ease;
animation:vibeui-table-anim-001-rise linear both;
animation-timeline:--vibeui-table-anim-001;
animation-range:entry 0% entry 42%;
}
[data-vibeui-block="table-anim-001"] [data-part="row"]:last-child{border-bottom:none}
[data-vibeui-block="table-anim-001"] [data-part="row"]:hover{background:var(--vibeui-table-anim-001-hover)}
[data-vibeui-block="table-anim-001"] [data-part="row"]:nth-child(2){animation-range:entry 8% entry 50%}
[data-vibeui-block="table-anim-001"] [data-part="row"]:nth-child(3){animation-range:entry 16% entry 58%}
[data-vibeui-block="table-anim-001"] [data-part="row"]:nth-child(4){animation-range:entry 24% entry 66%}
[data-vibeui-block="table-anim-001"] [data-part="row"]:nth-child(5){animation-range:entry 32% entry 74%}
[data-vibeui-block="table-anim-001"] [data-part="row"]:nth-child(6){animation-range:entry 40% entry 82%}
[data-vibeui-block="table-anim-001"] [data-part="td"]{
padding:0.5rem 0.875rem;vertical-align:middle;white-space:nowrap;
font-weight:550;
}
[data-vibeui-block="table-anim-001"] [data-part="td"][data-align="end"]{
text-align:right;font-variant-numeric:tabular-nums;color:var(--vibeui-table-anim-001-muted);
}
[data-vibeui-block="table-anim-001"][data-density="compact"] [data-part="th"]{padding-top:0.3125rem;padding-bottom:0.3125rem}
[data-vibeui-block="table-anim-001"][data-density="compact"] [data-part="td"]{padding-top:0.3125rem;padding-bottom:0.3125rem}
[data-vibeui-block="table-anim-001"] [data-part="pill"]{
display:inline-flex;align-items:center;gap:0.3125rem;
padding:0.1875rem 0.5rem;border-radius:9999px;
font-size:0.625rem;font-weight:650;white-space:nowrap;
color:var(--vibeui-table-anim-001-tone);
background:color-mix(in oklab,var(--vibeui-table-anim-001-tone) 16%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-table-anim-001-tone) 26%,transparent);
}
[data-vibeui-block="table-anim-001"] [data-part="dot"]{
width:0.375rem;height:0.375rem;border-radius:9999px;background:currentColor;
}
@keyframes vibeui-table-anim-001-rise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="table-anim-001"] [data-part="row"]{animation:none}
}
`

const SORT_ARROW = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m5 12 7-7 7 7" />
    <path d="M12 5v14" />
  </svg>
)

const SORT_IDLE = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m7 15 5 5 5-5" />
    <path d="m7 9 5-5 5 5" />
  </svg>
)

const DEFAULT_COLUMNS: TableAnim001Columns = {
  name: "Клиент",
  segment: "Тариф",
  value: "Доход",
  status: "Статус",
}

const DEFAULT_ROWS: TableAnim001Row[] = [
  {
    name: "Анна Петрова",
    segment: "Enterprise",
    value: "$48 200",
    statusLabel: "Активен",
    statusTone: "success",
  },
  {
    name: "Игорь Смирнов",
    segment: "Pro",
    value: "$12 400",
    statusLabel: "Активен",
    statusTone: "success",
  },
  {
    name: "Мария Кузнецова",
    segment: "Starter",
    value: "$2 100",
    statusLabel: "Ожидание",
    statusTone: "warning",
  },
  {
    name: "Дмитрий Волков",
    segment: "Pro",
    value: "$9 800",
    statusLabel: "Активен",
    statusTone: "success",
  },
  {
    name: "Елена Соколова",
    segment: "Enterprise",
    value: "$61 500",
    statusLabel: "Пауза",
    statusTone: "neutral",
  },
  {
    name: "Павел Орлов",
    segment: "Starter",
    value: "$1 450",
    statusLabel: "Ожидание",
    statusTone: "warning",
  },
]

/**
 * Таблица данных со стаггер-появлением строк. Один файл, ноль зависимостей,
 * собственная палитра. Данные — пропами, анимации на чистом CSS.
 */
export function TableAnim001({
  title = "Клиенты",
  badge = "6 записей",
  columns = DEFAULT_COLUMNS,
  rows = DEFAULT_ROWS,
  accent,
  compact = false,
  sortColumn = "value",
  sortDirection = "desc",
  className,
  style,
  ...props
}: TableAnim001Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-anim-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-table-anim-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="table-anim-001"
        data-slot="data-table"
        data-density={compact ? "compact" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="head">
            <p data-part="gtitle">{title}</p>
            {badge ? <span data-part="badge">{badge}</span> : null}
          </div>
          <div data-part="scroll">
            <table data-part="table">
              <thead>
                <tr>
                  <th data-part="th" scope="col">
                    <span data-part="thlabel">
                      {columns.name}
                      <span
                        data-part="sort"
                        data-active={sortColumn === "name" ? "true" : "false"}
                        data-dir={
                          sortColumn === "name" ? sortDirection : undefined
                        }
                        aria-hidden="true"
                      >
                        {sortColumn === "name" ? SORT_ARROW : SORT_IDLE}
                      </span>
                    </span>
                  </th>
                  <th data-part="th" scope="col">
                    {columns.segment}
                  </th>
                  <th data-part="th" data-align="end" scope="col">
                    <span data-part="thlabel">
                      {columns.value}
                      <span
                        data-part="sort"
                        data-active={sortColumn === "value" ? "true" : "false"}
                        data-dir={
                          sortColumn === "value" ? sortDirection : undefined
                        }
                        aria-hidden="true"
                      >
                        {sortColumn === "value" ? SORT_ARROW : SORT_IDLE}
                      </span>
                    </span>
                  </th>
                  <th data-part="th" scope="col">
                    {columns.status}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr data-part="row" key={row.name}>
                    <td data-part="td">{row.name}</td>
                    <td data-part="td">{row.segment}</td>
                    <td data-part="td" data-align="end">
                      {row.value}
                    </td>
                    <td data-part="td">
                      <span
                        data-part="pill"
                        style={
                          {
                            "--vibeui-table-anim-001-tone": `var(--vibeui-table-anim-001-${row.statusTone})`,
                          } as CSSProperties
                        }
                      >
                        <span data-part="dot" aria-hidden="true" />
                        {row.statusLabel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}
