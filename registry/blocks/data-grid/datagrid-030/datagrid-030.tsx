import type { ComponentProps, CSSProperties } from "react"
import { Card176 } from "@/registry/components/card/card-176/card-176"

export type Datagrid030Shift = "day" | "night" | "off" | "vacation"

export type Datagrid030Row = {
  employee: string
  role: string
  shifts: Datagrid030Shift[]
}

export type Datagrid030Props = Omit<ComponentProps<"section">, "children"> & {
  rows?: Datagrid030Row[]
  days?: string[]
  caption?: string
  scrollHint?: string
  /** Заголовок панели над графиком. */
  heading?: string
  /** Заголовок закреплённой колонки. */
  leadText?: string
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Коды смен по ключу: компонент несёт русские. */
  shiftText?: Record<string, string>
  /** Названия смен по ключу: они же идут в aria-label и в легенду. */
  shiftNameText?: Record<string, string>
  /** Пусто — подложки нет, график лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: широкий график смен, у которого закреплена только первая
// колонка — имя сотрудника. Остальное уезжает при прокрутке. В отличие от
// сетки с закреплёнными обеими сторонами, здесь нечего закреплять справа:
// день, до которого долистали, важнее итоговой колонки.
//
// Тема берётся из color-scheme окружения через light-dark(): график темнеет
// вместе со страницей и не носит собственной подложки. Непрозрачной остаётся
// только липкая колонка — сквозь неё не должны просвечивать дни.
const STYLES = `
:where([data-vibeui-block="datagrid-030"]){
--vibeui-datagrid-030-bg:transparent;
--vibeui-datagrid-030-surface:light-dark(oklch(1 0 0),oklch(0.22 0 250));
--vibeui-datagrid-030-fg:light-dark(oklch(0.23 0 250),oklch(0.93 0 250));
--vibeui-datagrid-030-muted:color-mix(in oklab,var(--vibeui-datagrid-030-fg) 68%,transparent);
--vibeui-datagrid-030-border:light-dark(oklch(0.92 0 250),oklch(0.35 0 250));
--vibeui-datagrid-030-head:light-dark(oklch(0.975 0 250),oklch(0.27 0 250));
--vibeui-datagrid-030-accent:light-dark(oklch(0.28 0 0),oklch(0.905 0 0));
--vibeui-datagrid-030-day:light-dark(oklch(0.58 0.14 235),oklch(0.6 0.14 235));
--vibeui-datagrid-030-night:light-dark(oklch(0.46 0.09 280),oklch(0.53 0.1 280));
--vibeui-datagrid-030-off:light-dark(oklch(0.85 0 250),oklch(0.4 0 250));
--vibeui-datagrid-030-vacation:light-dark(oklch(0.62 0.14 150),oklch(0.6 0.14 150));
--vibeui-datagrid-030-shadow:light-dark(oklch(0.23 0 250 / 18%),oklch(0 0 0 / 55%));
--vibeui-datagrid-030-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="datagrid-030"]{color-scheme:dark}
[data-vibeui-block="datagrid-030"]{
box-sizing:border-box;width:100%;max-width:56rem;margin:0 auto;
background:var(--vibeui-datagrid-030-bg);color:var(--vibeui-datagrid-030-fg);
border:1px solid var(--vibeui-datagrid-030-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-030-font);overflow:hidden;
}
[data-vibeui-block="datagrid-030"] *{box-sizing:border-box}
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
background:var(--vibeui-datagrid-030-surface);
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

const SHIFT_ORDER: Datagrid030Shift[] = ["day", "night", "off", "vacation"]

const SHIFT_TEXT: Record<string, string> = {
  day: "Д",
  night: "Н",
  off: "В",
  vacation: "О",
}

const SHIFT_NAME_TEXT: Record<string, string> = {
  day: "дневная смена",
  night: "ночная смена",
  off: "выходной",
  vacation: "отпуск",
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
  heading = "График смен",
  leadText = "Сотрудник",
  scrollLabel = "Таблица графика смен, прокручивается вбок",
  shiftText = SHIFT_TEXT,
  shiftNameText = SHIFT_NAME_TEXT,
  background = "",
  accent,
  className,
  style,
  ...props
}: Datagrid030Props) {
  const palette = {
    ...(accent ? { "--vibeui-datagrid-030-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-datagrid-030-bg": background,
          "--vibeui-datagrid-030-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-030" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="data-grid"
        data-vibeui-block="datagrid-030"
        className={className}
        style={palette}
      >
        <Card176 data-part="head" heading={heading} scrollHint={scrollHint} accent={accent} />
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
                <th scope="col" data-part="lead">
                  {leadText}
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
                        aria-label={
                          shiftNameText[shift] ?? SHIFT_NAME_TEXT[shift]
                        }
                      >
                        {shiftText[shift] ?? SHIFT_TEXT[shift]}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul data-part="key">
          {SHIFT_ORDER.map((shift) => (
            <li key={shift}>
              <span data-part="chip" data-shift={shift} aria-hidden="true" />
              {shiftText[shift] ?? SHIFT_TEXT[shift]} —{" "}
              {shiftNameText[shift] ?? SHIFT_NAME_TEXT[shift]}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
