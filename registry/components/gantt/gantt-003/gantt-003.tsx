import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Gantt003Row =
  | {
      kind: "task"
      title: string
      /** Смещение начала в днях от начала плана. */
      start: number
      days: number
      tone?: "work" | "risk" | "done"
    }
  | {
      kind: "milestone"
      title: string
      /** День вехи: смещение от начала плана. */
      start: number
      tone?: "work" | "risk" | "done"
    }

export type Gantt003Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "title"
> & {
  heading?: string
  startDate?: string
  rows?: Gantt003Row[]
  accent?: string
}

// Идея компонента: веха — это не полоса нулевой длины, а точка. Поэтому она
// получает свою форму — ромб, — и подпись с датой рядом: сжатый до пикселя
// прямоугольник в плане не виден, а сдача этапа обычно и есть главное в
// строке. Полосы и ромбы стоят на одной сетке дней, поэтому «сдать до» и
// «работать до» сравниваются глазом без линейки.
const STYLES = `
:where([data-vibeui-block="gantt-003"]){
--vibeui-gantt-003-bg:oklch(1 0 0);
--vibeui-gantt-003-fg:oklch(0.23 0.014 265);
--vibeui-gantt-003-muted:oklch(0.6 0.014 265);
--vibeui-gantt-003-border:oklch(0.91 0.006 265);
--vibeui-gantt-003-line:oklch(0.955 0.004 265);
--vibeui-gantt-003-accent:oklch(0.55 0.16 275);
--vibeui-gantt-003-risk:oklch(0.6 0.18 25);
--vibeui-gantt-003-done:oklch(0.6 0.12 165);
--vibeui-gantt-003-day:2.125rem;
--vibeui-gantt-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="gantt-003"]{
width:100%;box-sizing:border-box;padding:1rem;
background:var(--vibeui-gantt-003-bg);
border:1px solid var(--vibeui-gantt-003-border);border-radius:1rem;
color:var(--vibeui-gantt-003-fg);font-family:var(--vibeui-gantt-003-font);
}
[data-vibeui-block="gantt-003"] *{box-sizing:border-box}
[data-vibeui-block="gantt-003"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;
gap:0.5rem;margin:0 0 0.75rem;
}
[data-vibeui-block="gantt-003"] [data-part="heading"]{
margin:0;font-size:0.9375rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="gantt-003"] [data-part="hint"]{
margin:0;font-size:0.75rem;color:var(--vibeui-gantt-003-muted);
}
[data-vibeui-block="gantt-003"] [data-part="scroll"]{
overflow-x:auto;border:1px solid var(--vibeui-gantt-003-line);border-radius:0.625rem;
}
[data-vibeui-block="gantt-003"] [data-part="scroll"]:focus-visible{
outline:2px solid var(--vibeui-gantt-003-accent);outline-offset:2px;
}
[data-vibeui-block="gantt-003"] [data-part="grid"]{
display:grid;
grid-template-columns:9.5rem repeat(var(--vibeui-gantt-003-days,14),var(--vibeui-gantt-003-day));
}
[data-vibeui-block="gantt-003"] [data-part="corner"]{
position:sticky;left:0;z-index:2;
background:var(--vibeui-gantt-003-bg);
border-right:1px solid var(--vibeui-gantt-003-border);
border-bottom:1px solid var(--vibeui-gantt-003-border);
}
[data-vibeui-block="gantt-003"] [data-part="daycap"]{
padding:0.3125rem 0;text-align:center;
border-left:1px solid var(--vibeui-gantt-003-line);
border-bottom:1px solid var(--vibeui-gantt-003-border);
font-size:0.5625rem;font-variant-numeric:tabular-nums;
color:var(--vibeui-gantt-003-muted);
}
[data-vibeui-block="gantt-003"] [data-part="daycap"][data-weekend="true"]{
background:var(--vibeui-gantt-003-line);
}
[data-vibeui-block="gantt-003"] [data-part="name"]{
position:sticky;left:0;z-index:1;
display:flex;flex-direction:column;justify-content:center;gap:0.0625rem;
min-height:2.125rem;padding:0.25rem 0.625rem;
background:var(--vibeui-gantt-003-bg);
border-right:1px solid var(--vibeui-gantt-003-border);
border-top:1px solid var(--vibeui-gantt-003-line);
font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="gantt-003"] [data-part="name"] small{
font-size:0.625rem;font-weight:400;color:var(--vibeui-gantt-003-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="gantt-003"] [data-part="cell"]{
border-top:1px solid var(--vibeui-gantt-003-line);
border-left:1px solid var(--vibeui-gantt-003-line);
}
[data-vibeui-block="gantt-003"] [data-part="cell"][data-weekend="true"]{
background:color-mix(in oklab,var(--vibeui-gantt-003-line) 70%,transparent);
}
[data-vibeui-block="gantt-003"] [data-part="bar"]{
align-self:center;z-index:1;margin:0 0.1875rem;
display:flex;align-items:center;padding:0.1875rem 0.4375rem;
border-radius:0.375rem;
border:1px solid var(--vibeui-gantt-003-accent);
background:color-mix(in oklab,var(--vibeui-gantt-003-accent) 16%,var(--vibeui-gantt-003-bg));
font-size:0.625rem;line-height:1.2;white-space:nowrap;overflow:hidden;
}
[data-vibeui-block="gantt-003"] [data-tone="risk"]{
border-color:var(--vibeui-gantt-003-risk);border-style:dashed;
background:color-mix(in oklab,var(--vibeui-gantt-003-risk) 14%,var(--vibeui-gantt-003-bg));
}
[data-vibeui-block="gantt-003"] [data-tone="done"]{
border-color:var(--vibeui-gantt-003-done);
background:color-mix(in oklab,var(--vibeui-gantt-003-done) 16%,var(--vibeui-gantt-003-bg));
}
/* Веха — точка, а не короткая полоса: своя форма и подпись рядом. */
[data-vibeui-block="gantt-003"] [data-part="milestone"]{
align-self:center;justify-self:start;z-index:1;
display:flex;align-items:center;gap:0.375rem;
font-size:0.625rem;font-weight:650;white-space:nowrap;
}
[data-vibeui-block="gantt-003"] [data-part="milestone"] i{
flex:none;width:0.75rem;height:0.75rem;
margin-left:calc(var(--vibeui-gantt-003-day) / 2 - 0.375rem);
transform:rotate(45deg);
background:var(--vibeui-gantt-003-accent);
border:1px solid var(--vibeui-gantt-003-accent);
}
[data-vibeui-block="gantt-003"] [data-part="milestone"][data-tone="risk"] i{
background:var(--vibeui-gantt-003-bg);border-color:var(--vibeui-gantt-003-risk);
border-width:2px;
}
[data-vibeui-block="gantt-003"] [data-part="milestone"][data-tone="done"] i{
background:var(--vibeui-gantt-003-done);border-color:var(--vibeui-gantt-003-done);
}
[data-vibeui-block="gantt-003"] [data-part="name"][data-kind="milestone"]{
font-style:italic;
}
[data-vibeui-block="gantt-003"] [data-part="table"]{margin:0.75rem 0 0}
[data-vibeui-block="gantt-003"] summary{
cursor:pointer;font-size:0.75rem;font-weight:600;color:var(--vibeui-gantt-003-accent);
}
[data-vibeui-block="gantt-003"] summary:focus-visible{
outline:2px solid var(--vibeui-gantt-003-accent);outline-offset:2px;border-radius:0.25rem;
}
[data-vibeui-block="gantt-003"] table{
width:100%;margin-top:0.5rem;border-collapse:collapse;font-size:0.6875rem;
}
[data-vibeui-block="gantt-003"] th,
[data-vibeui-block="gantt-003"] td{
padding:0.25rem 0.375rem;text-align:left;
border-bottom:1px solid var(--vibeui-gantt-003-line);
}
[data-vibeui-block="gantt-003"] thead th{color:var(--vibeui-gantt-003-muted);font-weight:600}
[data-vibeui-block="gantt-003"] td{font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="gantt-003"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000

const DEFAULT_ROWS: Gantt003Row[] = [
  { kind: "task", title: "Исследование", start: 0, days: 4, tone: "done" },
  { kind: "milestone", title: "Требования утверждены", start: 4, tone: "done" },
  { kind: "task", title: "Прототип", start: 4, days: 5 },
  { kind: "task", title: "Тексты и данные", start: 6, days: 4 },
  { kind: "milestone", title: "Внутренняя демонстрация", start: 10 },
  {
    kind: "task",
    title: "Правки после демо",
    start: 10,
    days: 3,
    tone: "risk",
  },
  { kind: "milestone", title: "Сдача заказчику", start: 14, tone: "risk" },
]

/**
 * План с вехами-ромбами: задача — полоса, веха — точка со своей формой
 * и датой. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Gantt003({
  heading = "Этапы и вехи",
  startDate = "2026-04-06",
  rows = DEFAULT_ROWS,
  accent,
  className,
  style,
  ...props
}: Gantt003Props) {
  const origin = new Date(`${startDate}T00:00:00Z`).getTime()
  const days =
    Math.max(
      ...rows.map((row) => row.start + (row.kind === "task" ? row.days : 1)),
    ) + 1

  const dates = Array.from({ length: days }, (_, index) => {
    const date = new Date(origin + index * DAY)

    return {
      key: date.toISOString().slice(0, 10),
      number: date.getUTCDate(),
      weekend: date.getUTCDay() % 6 === 0,
    }
  })

  const dateText = (offset: number) =>
    new Date(origin + offset * DAY).toISOString().slice(0, 10)

  const palette = {
    "--vibeui-gantt-003-days": days,
    ...(accent ? { "--vibeui-gantt-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-gantt-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="gantt-003"
        aria-label={heading}
        className={className}
        style={palette}
      >
        <header data-part="head">
          <h3 data-part="heading">{heading}</h3>
          <p data-part="hint">ромб — веха, полоса — работа</p>
        </header>

        <div
          data-part="scroll"
          tabIndex={0}
          role="group"
          aria-label={`${heading}: диаграмма, прокручивается вбок`}
        >
          <div data-part="grid">
            <span data-part="corner" />
            {dates.map((date) => (
              <span
                key={date.key}
                data-part="daycap"
                data-weekend={String(date.weekend)}
              >
                {date.number}
              </span>
            ))}

            {rows.map((row, index) => (
              <span
                key={row.title}
                data-part="name"
                data-kind={row.kind}
                style={{ gridRow: index + 2, gridColumn: 1 } as CSSProperties}
              >
                {row.title}
                <small>
                  {row.kind === "task"
                    ? `${dateText(row.start)} · ${row.days} дн`
                    : dateText(row.start)}
                </small>
              </span>
            ))}

            {rows.map((row, index) =>
              dates.map((date, column) => (
                <span
                  key={`${row.title}-${date.key}`}
                  data-part="cell"
                  data-weekend={String(date.weekend)}
                  style={
                    {
                      gridRow: index + 2,
                      gridColumn: column + 2,
                    } as CSSProperties
                  }
                />
              )),
            )}

            {rows.map((row, index) =>
              row.kind === "task" ? (
                <span
                  key={`${row.title}-bar`}
                  data-part="bar"
                  data-tone={row.tone ?? "work"}
                  style={
                    {
                      gridRow: index + 2,
                      gridColumn: `${row.start + 2} / ${row.start + row.days + 2}`,
                    } as CSSProperties
                  }
                >
                  {row.days} дн
                </span>
              ) : (
                <span
                  key={`${row.title}-milestone`}
                  data-part="milestone"
                  data-tone={row.tone ?? "work"}
                  style={
                    {
                      gridRow: index + 2,
                      gridColumn: `${row.start + 2} / -1`,
                    } as CSSProperties
                  }
                >
                  <i aria-hidden="true" />
                  {dateText(row.start).slice(5)}
                </span>
              ),
            )}
          </div>
        </div>

        <details data-part="table">
          <summary>Те же сроки таблицей</summary>
          <table>
            <thead>
              <tr>
                <th scope="col">Строка</th>
                <th scope="col">Тип</th>
                <th scope="col">Начало</th>
                <th scope="col">Конец</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.title}>
                  <th scope="row">{row.title}</th>
                  <td>{row.kind === "task" ? "работа" : "веха"}</td>
                  <td>{dateText(row.start)}</td>
                  <td>
                    {row.kind === "task"
                      ? dateText(row.start + row.days - 1)
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </section>
    </>
  )
}
