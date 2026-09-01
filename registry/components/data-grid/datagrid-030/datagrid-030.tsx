import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Datagrid030Shift = "day" | "night" | "off" | "vacation"

export type Datagrid030Row = {
  employee: string
  role: string
  shifts: Datagrid030Shift[]
}

export type Datagrid030Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  rows?: Datagrid030Row[]
  days?: string[]
  caption?: string
  scrollHint?: string
  accent?: string
}

// Идея компонента: широкий график смен, у которого закреплена только первая
// колонка — имя сотрудника. Остальное уезжает при прокрутке. В отличие от
// сетки с закреплёнными обеими сторонами, здесь нечего закреплять справа:
// день, до которого долистали, важнее итоговой колонки.
const STYLES = `
:where([data-vibeui-block="datagrid-030"]){
--vibeui-datagrid-030-bg:oklch(1 0 0);
--vibeui-datagrid-030-fg:oklch(0.23 0.014 250);
--vibeui-datagrid-030-muted:oklch(0.55 0.014 250);
--vibeui-datagrid-030-border:oklch(0.92 0.006 250);
--vibeui-datagrid-030-head:oklch(0.975 0.003 250);
--vibeui-datagrid-030-accent:oklch(0.52 0.14 250);
--vibeui-datagrid-030-day:oklch(0.58 0.14 235);
--vibeui-datagrid-030-night:oklch(0.46 0.09 280);
--vibeui-datagrid-030-off:oklch(0.85 0.006 250);
--vibeui-datagrid-030-vacation:oklch(0.62 0.14 150);
--vibeui-datagrid-030-shadow:oklch(0.23 0.014 250 / 18%);
--vibeui-datagrid-030-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="datagrid-030"]{
box-sizing:border-box;width:100%;max-width:56rem;margin:0 auto;
background:var(--vibeui-datagrid-030-bg);color:var(--vibeui-datagrid-030-fg);
border:1px solid var(--vibeui-datagrid-030-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-030-font);overflow:hidden;
}
[data-vibeui-block="datagrid-030"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-030"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.5rem;
padding:0.875rem;border-bottom:1px solid var(--vibeui-datagrid-030-border);
}
[data-vibeui-block="datagrid-030"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="datagrid-030"] [data-part="hint"]{
margin:0;font-size:0.75rem;color:var(--vibeui-datagrid-030-muted);
}
[data-vibeui-block="datagrid-030"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-030"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-030-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-030"] table{
width:100%;min-width:48rem;border-collapse:separate;border-spacing:0;font-size:0.8125rem;
}
[data-vibeui-block="datagrid-030"] caption{
padding:0 0.875rem 0.625rem;text-align:left;
font-size:0.75rem;color:var(--vibeui-datagrid-030-muted);
}
[data-vibeui-block="datagrid-030"] th,
[data-vibeui-block="datagrid-030"] td{
padding:0.4375rem 0.625rem;text-align:center;white-space:nowrap;
border-bottom:1px solid var(--vibeui-datagrid-030-border);
background:var(--vibeui-datagrid-030-bg);
}
[data-vibeui-block="datagrid-030"] thead th{background:var(--vibeui-datagrid-030-head);font-weight:600}
[data-vibeui-block="datagrid-030"] tbody tr:last-child th,
[data-vibeui-block="datagrid-030"] tbody tr:last-child td{border-bottom:0}
/* Закреплена только первая колонка — своя подложка обязательна, иначе
   прокрученные дни видно сквозь неё. */
[data-vibeui-block="datagrid-030"] [data-part="lead"]{
position:sticky;left:0;z-index:2;min-width:11rem;text-align:left;
border-right:1px solid var(--vibeui-datagrid-030-border);
}
[data-vibeui-block="datagrid-030"] thead [data-part="lead"]{z-index:3;background:var(--vibeui-datagrid-030-head)}
[data-vibeui-block="datagrid-030"] [data-part="person"]{display:flex;flex-direction:column;gap:0.0625rem}
[data-vibeui-block="datagrid-030"] [data-part="role"]{font-size:0.6875rem;font-weight:400;color:var(--vibeui-datagrid-030-muted)}
[data-vibeui-block="datagrid-030"] [data-part="badge"]{
display:inline-flex;align-items:center;justify-content:center;
min-width:1.75rem;padding:0.125rem 0.375rem;border-radius:0.375rem;
font-size:0.6875rem;font-weight:650;color:oklch(1 0 0);
}
[data-vibeui-block="datagrid-030"] [data-part="badge"][data-shift="day"]{background:var(--vibeui-datagrid-030-day)}
[data-vibeui-block="datagrid-030"] [data-part="badge"][data-shift="night"]{background:var(--vibeui-datagrid-030-night)}
[data-vibeui-block="datagrid-030"] [data-part="badge"][data-shift="vacation"]{background:var(--vibeui-datagrid-030-vacation)}
[data-vibeui-block="datagrid-030"] [data-part="badge"][data-shift="off"]{
background:var(--vibeui-datagrid-030-off);color:var(--vibeui-datagrid-030-muted);
}
[data-vibeui-block="datagrid-030"] [data-part="key"]{
display:flex;flex-wrap:wrap;gap:0.25rem 0.875rem;margin:0;padding:0.625rem 0.875rem 0.875rem;
list-style:none;font-size:0.6875rem;color:var(--vibeui-datagrid-030-muted);
border-top:1px solid var(--vibeui-datagrid-030-border);
}
[data-vibeui-block="datagrid-030"] [data-part="key"] li{display:flex;align-items:center;gap:0.375rem}
[data-vibeui-block="datagrid-030"] [data-part="chip"]{width:0.625rem;height:0.625rem;border-radius:0.1875rem}
[data-vibeui-block="datagrid-030"] [data-part="chip"][data-shift="day"]{background:var(--vibeui-datagrid-030-day)}
[data-vibeui-block="datagrid-030"] [data-part="chip"][data-shift="night"]{background:var(--vibeui-datagrid-030-night)}
[data-vibeui-block="datagrid-030"] [data-part="chip"][data-shift="vacation"]{background:var(--vibeui-datagrid-030-vacation)}
[data-vibeui-block="datagrid-030"] [data-part="chip"][data-shift="off"]{background:var(--vibeui-datagrid-030-off)}
@supports (animation-timeline: scroll(nearest inline)){
[data-vibeui-block="datagrid-030"] [data-part="lead"]{
animation:vibeui-datagrid-030-lead linear both;
animation-timeline:scroll(nearest inline);animation-range:0 2rem;
}
@keyframes vibeui-datagrid-030-lead{
from{box-shadow:0 0 0 transparent}
to{box-shadow:0.5rem 0 0.75rem -0.5rem var(--vibeui-datagrid-030-shadow)}
}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-030"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_DAYS = Array.from({ length: 14 }, (_, index) => `${index + 1}`)

const SHIFT_LABEL: Record<Datagrid030Shift, string> = {
  day: "Д",
  night: "Н",
  off: "В",
  vacation: "О",
}

const SHIFT_NAME: Record<Datagrid030Shift, string> = {
  day: "дневная смена",
  night: "ночная смена",
  off: "выходной",
  vacation: "отпуск",
}

const DEFAULT_ROWS: Datagrid030Row[] = [
  {
    employee: "Орлова Дарья",
    role: "Старший смены",
    shifts: [
      "day",
      "day",
      "night",
      "night",
      "off",
      "off",
      "day",
      "day",
      "day",
      "night",
      "night",
      "off",
      "vacation",
      "vacation",
    ],
  },
  {
    employee: "Гнедин Марк",
    role: "Оператор",
    shifts: [
      "night",
      "off",
      "off",
      "day",
      "day",
      "night",
      "night",
      "off",
      "day",
      "day",
      "day",
      "night",
      "off",
      "off",
    ],
  },
  {
    employee: "Ким Ирина",
    role: "Оператор",
    shifts: [
      "off",
      "day",
      "day",
      "off",
      "night",
      "night",
      "off",
      "day",
      "day",
      "off",
      "night",
      "night",
      "day",
      "off",
    ],
  },
  {
    employee: "Савва Тимур",
    role: "Стажёр",
    shifts: [
      "day",
      "day",
      "off",
      "day",
      "day",
      "off",
      "off",
      "day",
      "day",
      "day",
      "off",
      "day",
      "day",
      "off",
    ],
  },
]

/**
 * График смен с закреплённой только первой колонкой: имя сотрудника
 * остаётся на месте, дни прокручиваются вбок. Серверный компонент.
 */
export function Datagrid030({
  rows = DEFAULT_ROWS,
  days = DEFAULT_DAYS,
  caption = "График смен на две недели",
  scrollHint = "Прокрутите вбок: колонка с именем закреплена",
  accent,
  className,
  style,
  ...props
}: Datagrid030Props) {
  const palette = {
    ...(accent ? { "--vibeui-datagrid-030-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-030" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="datagrid-030"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3 data-part="title">График смен</h3>
          <p data-part="hint">{scrollHint}</p>
        </div>
        <div
          data-part="scroll"
          role="region"
          aria-label="Таблица графика смен, прокручивается вбок"
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col" data-part="lead">
                  Сотрудник
                </th>
                {days.map((day) => (
                  <th key={day} scope="col">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.employee}>
                  <th scope="row" data-part="lead">
                    <span data-part="person">
                      {row.employee}
                      <span data-part="role">{row.role}</span>
                    </span>
                  </th>
                  {row.shifts.map((shift, index) => (
                    <td key={days[index] ?? index}>
                      <span
                        data-part="badge"
                        data-shift={shift}
                        aria-label={SHIFT_NAME[shift]}
                      >
                        {SHIFT_LABEL[shift]}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul data-part="key">
          {(Object.keys(SHIFT_LABEL) as Datagrid030Shift[]).map((shift) => (
            <li key={shift}>
              <span data-part="chip" data-shift={shift} aria-hidden="true" />
              {SHIFT_LABEL[shift]} — {SHIFT_NAME[shift]}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
