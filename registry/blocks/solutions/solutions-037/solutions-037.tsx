import type { CSSProperties } from "react"

export type Solutions037Vehicle = {
  plate: string
  model: string
  mileage: number
  lastServiceMileage: number
  intervalKm: number
  nextServiceDate: string
}

export type Solutions037Props = {
  title?: string
  hint?: string
  vehicles?: Solutions037Vehicle[]
  warnThresholdKm?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: реестр ТО автопарка. Просрочка не хранится меткой — она
// вычисляется сравнением текущего пробега с плановым (последнее ТО + интервал):
// это одно число всегда согласовано с одометром, а не расходится с ним при
// правке данных. Полоса под остатком километров — тот же расчёт, что и статус,
// нарисованный визуально: заливка растёт по мере приближения к порогу, а не
// произвольным цветом.
const STYLES = `
:where([data-vibeui-block="solutions-037"]){
--vibeui-solutions-037-bg:oklch(1 0 0);
--vibeui-solutions-037-panel:oklch(0.976 0.004 250);
--vibeui-solutions-037-fg:oklch(0.21 0.014 265);
--vibeui-solutions-037-muted:oklch(0.54 0.014 265);
--vibeui-solutions-037-border:oklch(0.9 0.006 265);
--vibeui-solutions-037-accent:oklch(0.5 0.15 250);
--vibeui-solutions-037-ok:oklch(0.55 0.14 152);
--vibeui-solutions-037-warn:oklch(0.68 0.16 75);
--vibeui-solutions-037-late:oklch(0.57 0.19 25);
--vibeui-solutions-037-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-037-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-037"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-037-bg);
border:1px solid var(--vibeui-solutions-037-border);border-radius:1rem;
font-family:var(--vibeui-solutions-037-sans);color:var(--vibeui-solutions-037-fg);
}
[data-vibeui-block="solutions-037"] *{box-sizing:border-box}
[data-vibeui-block="solutions-037"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-037"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-037"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-037-muted)}
[data-vibeui-block="solutions-037"] [data-part="summary"]{
display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-037"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-solutions-037-panel);
border:1px solid var(--vibeui-solutions-037-border);
}
[data-vibeui-block="solutions-037"] [data-tile="late"]{
border-color:color-mix(in oklab,var(--vibeui-solutions-037-late) 45%,transparent);
background:color-mix(in oklab,var(--vibeui-solutions-037-late) 8%,var(--vibeui-solutions-037-bg));
}
[data-vibeui-block="solutions-037"] [data-tile="warn"]{
border-color:color-mix(in oklab,var(--vibeui-solutions-037-warn) 45%,transparent);
background:color-mix(in oklab,var(--vibeui-solutions-037-warn) 8%,var(--vibeui-solutions-037-bg));
}
[data-vibeui-block="solutions-037"] [data-part="tile"] b{
display:block;font-size:1.125rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.015em;
}
[data-vibeui-block="solutions-037"] [data-tile="late"] b{color:var(--vibeui-solutions-037-late)}
[data-vibeui-block="solutions-037"] [data-tile="warn"] b{color:var(--vibeui-solutions-037-warn)}
[data-vibeui-block="solutions-037"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-037-muted);
}
[data-vibeui-block="solutions-037"] [data-part="scroll"]{overflow-x:auto;scrollbar-width:thin}
[data-vibeui-block="solutions-037"] table{width:100%;min-width:38rem;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="solutions-037"] th,
[data-vibeui-block="solutions-037"] td{
padding:0.5rem 0.625rem;text-align:left;vertical-align:middle;
border-top:1px solid var(--vibeui-solutions-037-border);
}
[data-vibeui-block="solutions-037"] th:first-child,
[data-vibeui-block="solutions-037"] td:first-child{padding-left:1rem}
[data-vibeui-block="solutions-037"] th:last-child,
[data-vibeui-block="solutions-037"] td:last-child{padding-right:1rem}
[data-vibeui-block="solutions-037"] th{
font-size:0.625rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-037-muted);background:var(--vibeui-solutions-037-panel);white-space:nowrap;
}
[data-vibeui-block="solutions-037"] [data-part="plate"]{
display:block;font-family:var(--vibeui-solutions-037-mono);font-size:0.8125rem;font-weight:700;
}
[data-vibeui-block="solutions-037"] [data-part="model"]{
display:block;margin-top:0.0625rem;font-size:0.6875rem;color:var(--vibeui-solutions-037-muted);
}
[data-vibeui-block="solutions-037"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="solutions-037"] [data-part="date"]{white-space:nowrap;font-variant-numeric:tabular-nums}
/* Полоса — тот же расчёт, что и статус: заливка растёт вместе с пробегом до ТО. */
[data-vibeui-block="solutions-037"] [data-part="remain"]{min-width:9rem}
[data-vibeui-block="solutions-037"] [data-part="km"]{
display:block;margin-bottom:0.25rem;font-size:0.75rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-037"] [data-part="bar"]{
height:0.375rem;border-radius:9999px;background:var(--vibeui-solutions-037-panel);
border:1px solid var(--vibeui-solutions-037-border);overflow:hidden;
}
[data-vibeui-block="solutions-037"] [data-part="fill"]{
height:100%;border-radius:9999px;background:var(--vibeui-solutions-037-ok);
}
[data-vibeui-block="solutions-037"] [data-status="warn"] [data-part="fill"]{background:var(--vibeui-solutions-037-warn)}
[data-vibeui-block="solutions-037"] [data-status="late"] [data-part="fill"]{background:var(--vibeui-solutions-037-late)}
[data-vibeui-block="solutions-037"] [data-status="warn"] [data-part="km"]{color:var(--vibeui-solutions-037-warn)}
[data-vibeui-block="solutions-037"] [data-status="late"] [data-part="km"]{color:var(--vibeui-solutions-037-late)}
[data-vibeui-block="solutions-037"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.125rem 0.5rem 0.125rem 0.25rem;border-radius:9999px;
border:1px solid var(--vibeui-solutions-037-border);
font-size:0.6875rem;font-weight:650;color:var(--vibeui-solutions-037-muted);white-space:nowrap;
}
[data-vibeui-block="solutions-037"] [data-part="letter"]{
width:1rem;height:1rem;border-radius:9999px;display:grid;place-items:center;flex:none;
background:var(--vibeui-solutions-037-panel);font-size:0.5625rem;font-weight:700;line-height:1;
}
[data-vibeui-block="solutions-037"] [data-status="ok"] [data-part="status"]{
color:var(--vibeui-solutions-037-ok);
border-color:color-mix(in oklab,var(--vibeui-solutions-037-ok) 50%,transparent);
}
[data-vibeui-block="solutions-037"] [data-status="ok"] [data-part="letter"]{
background:var(--vibeui-solutions-037-ok);color:oklch(1 0 0);
}
[data-vibeui-block="solutions-037"] [data-status="warn"] [data-part="status"]{
color:var(--vibeui-solutions-037-warn);
border-color:color-mix(in oklab,var(--vibeui-solutions-037-warn) 50%,transparent);
}
[data-vibeui-block="solutions-037"] [data-status="warn"] [data-part="letter"]{
background:var(--vibeui-solutions-037-warn);color:oklch(1 0 0);
}
[data-vibeui-block="solutions-037"] [data-status="late"] [data-part="status"]{
color:var(--vibeui-solutions-037-late);
border-color:color-mix(in oklab,var(--vibeui-solutions-037-late) 50%,transparent);
}
[data-vibeui-block="solutions-037"] [data-status="late"] [data-part="letter"]{
background:var(--vibeui-solutions-037-late);color:oklch(1 0 0);
}
[data-vibeui-block="solutions-037"] [data-part="foot"]{
margin:0;padding:0.75rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-037-muted);
border-top:1px solid var(--vibeui-solutions-037-border);
}
/* Сводка от собственной ширины: в узкой карточке три колонки нечитаемы. */
@container (max-width: 30rem){
[data-vibeui-block="solutions-037"] [data-part="summary"]{grid-template-columns:minmax(0,1fr);gap:0.375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-037"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_VEHICLES: Solutions037Vehicle[] = [
  {
    plate: "А 412 ОК 178",
    model: "ГАЗель NEXT, борт",
    mileage: 128400,
    lastServiceMileage: 118000,
    intervalKm: 10000,
    nextServiceDate: "18 марта",
  },
  {
    plate: "В 087 ТС 178",
    model: "Ford Transit, фургон",
    mileage: 96200,
    lastServiceMileage: 86000,
    intervalKm: 10000,
    nextServiceDate: "2 апреля",
  },
  {
    plate: "Е 233 РА 178",
    model: "КАМАЗ 65115, самосвал",
    mileage: 214900,
    lastServiceMileage: 200000,
    intervalKm: 15000,
    nextServiceDate: "9 марта",
  },
  {
    plate: "М 561 НВ 178",
    model: "Lada Largus, фургон",
    mileage: 74850,
    lastServiceMileage: 70000,
    intervalKm: 10000,
    nextServiceDate: "27 марта",
  },
  {
    plate: "Р 019 ЕК 178",
    model: "Hyundai HD78, борт",
    mileage: 152300,
    lastServiceMileage: 140000,
    intervalKm: 12000,
    nextServiceDate: "5 марта",
  },
]

const STATUS_LABEL: Record<"ok" | "warn" | "late", string> = {
  ok: "в норме",
  warn: "скоро ТО",
  late: "просрочено",
}

const STATUS_LETTER: Record<"ok" | "warn" | "late", string> = {
  ok: "✓",
  warn: "~",
  late: "!",
}

function vehicleStatus(remaining: number, warnThresholdKm: number) {
  if (remaining <= 0) return "late" as const
  if (remaining <= warnThresholdKm) return "warn" as const
  return "ok" as const
}

/**
 * Реестр ТО автопарка: остаток до планового ТО и просрочка считаются из
 * пробега и интервала, а не хранятся отдельной меткой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions037({
  title = "Автопарк · ТО",
  hint = "23 машины в парке, показаны активные",
  vehicles = DEFAULT_VEHICLES,
  warnThresholdKm = 1500,
  accent,
  className,
  style,
}: Solutions037Props) {
  const rows = vehicles.map((vehicle) => {
    const nextServiceMileage = vehicle.lastServiceMileage + vehicle.intervalKm
    const remaining = nextServiceMileage - vehicle.mileage
    const used = Math.min(
      Math.max(vehicle.mileage - vehicle.lastServiceMileage, 0),
      vehicle.intervalKm,
    )
    const status = vehicleStatus(remaining, warnThresholdKm)
    return { vehicle, remaining, used, status }
  })

  const lateCount = rows.filter((row) => row.status === "late").length
  const warnCount = rows.filter((row) => row.status === "warn").length

  const palette = {
    ...(accent ? { "--vibeui-solutions-037-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-037" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-037"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="hint">{hint}</p>
          </div>
        </header>

        <div data-part="summary">
          <p data-part="tile">
            <b>{rows.length}</b>
            <span>машин на контроле</span>
          </p>
          <p data-part="tile" data-tile="warn">
            <b>{warnCount}</b>
            <span>приближаются к ТО</span>
          </p>
          <p data-part="tile" data-tile="late">
            <b>{lateCount}</b>
            <span>просрочили ТО</span>
          </p>
        </div>

        <div data-part="scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Машина</th>
                <th scope="col" data-align="end">
                  Пробег
                </th>
                <th scope="col">Плановая дата ТО</th>
                <th scope="col">Остаток до ТО</th>
                <th scope="col">Статус</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ vehicle, remaining, used, status }) => (
                <tr key={vehicle.plate} data-status={status}>
                  <td>
                    <span data-part="plate">{vehicle.plate}</span>
                    <span data-part="model">{vehicle.model}</span>
                  </td>
                  <td data-align="end">
                    {vehicle.mileage.toLocaleString("ru-RU")} км
                  </td>
                  <td>
                    <span data-part="date">{vehicle.nextServiceDate}</span>
                  </td>
                  <td>
                    <span data-part="remain" data-status={status}>
                      <span data-part="km">
                        {remaining > 0
                          ? `осталось ${remaining.toLocaleString("ru-RU")} км`
                          : `перепробег ${Math.abs(remaining).toLocaleString("ru-RU")} км`}
                      </span>
                      <span
                        data-part="bar"
                        role="progressbar"
                        aria-label={`${vehicle.plate}: пробег до ТО`}
                        aria-valuenow={used}
                        aria-valuemin={0}
                        aria-valuemax={vehicle.intervalKm}
                      >
                        <span
                          data-part="fill"
                          style={{
                            width: `${Math.min(100, (used / vehicle.intervalKm) * 100)}%`,
                          }}
                        />
                      </span>
                    </span>
                  </td>
                  <td>
                    <span data-part="status">
                      <span data-part="letter" aria-hidden="true">
                        {STATUS_LETTER[status]}
                      </span>
                      {STATUS_LABEL[status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p data-part="foot">
          Статус считается сравнением пробега с плановым интервалом ТО, а не
          хранится отдельной меткой.
        </p>
      </section>
    </>
  )
}
