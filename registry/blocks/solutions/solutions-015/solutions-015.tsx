import type { CSSProperties } from "react"

export type Solutions015Stop = {
  place: string
  time: string
  state: "done" | "current" | "next"
}

export type Solutions015Route = {
  code: string
  driver: string
  truck: string
  eta: string
  delayMinutes?: number
  stops: Solutions015Stop[]
}

export type Solutions015Props = {
  title?: string
  day?: string
  routes?: Solutions015Route[]
  onTimeLabel?: string
  lateLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: маршруты доставки. Маршрут нарисован лентой остановок, а не
// таблицей: положение машины на линии отвечает на главный вопрос диспетчера —
// «где она сейчас» — без чтения строк. Пройденная часть линии закрашена, точка
// текущей остановки крупнее и обведена, будущие остаются пустыми. Опоздание
// написано минутами и сдвигает ETA: «опаздывает» без числа не помогает решить,
// звонить клиенту или нет. Лента прокручивается по горизонтали — сжимать
// остановки нельзя, подписи времени слипаются.
const STYLES = `
:where([data-vibeui-block="solutions-015"]){
--vibeui-solutions-015-bg:oklch(1 0 0);
--vibeui-solutions-015-panel:oklch(0.975 0.004 250);
--vibeui-solutions-015-fg:oklch(0.21 0.014 260);
--vibeui-solutions-015-muted:oklch(0.54 0.014 260);
--vibeui-solutions-015-border:oklch(0.9 0.006 260);
--vibeui-solutions-015-accent:oklch(0.53 0.16 250);
--vibeui-solutions-015-late:oklch(0.6 0.18 35);
--vibeui-solutions-015-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-015-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-015"]{
box-sizing:border-box;padding:1rem;
background:var(--vibeui-solutions-015-bg);
border:1px solid var(--vibeui-solutions-015-border);border-radius:1rem;
font-family:var(--vibeui-solutions-015-sans);color:var(--vibeui-solutions-015-fg);
}
[data-vibeui-block="solutions-015"] *{box-sizing:border-box}
[data-vibeui-block="solutions-015"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;margin-bottom:0.875rem;
}
[data-vibeui-block="solutions-015"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-015"] [data-part="day"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-015-muted)}
[data-vibeui-block="solutions-015"] [data-part="list"]{display:grid;gap:0.625rem}
[data-vibeui-block="solutions-015"] [data-part="route"]{
padding:0.75rem 0.875rem;border-radius:0.875rem;
background:var(--vibeui-solutions-015-panel);
border:1px solid var(--vibeui-solutions-015-border);
}
[data-vibeui-block="solutions-015"] [data-late="true"]{
border-color:color-mix(in oklab,var(--vibeui-solutions-015-late) 50%,transparent);
background:color-mix(in oklab,var(--vibeui-solutions-015-late) 6%,var(--vibeui-solutions-015-bg));
}
[data-vibeui-block="solutions-015"] [data-part="meta"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem 0.75rem;
}
[data-vibeui-block="solutions-015"] h3{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="solutions-015"] [data-part="code"]{
font-family:var(--vibeui-solutions-015-mono);font-size:0.6875rem;color:var(--vibeui-solutions-015-muted);
}
[data-vibeui-block="solutions-015"] [data-part="truck"]{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-015-muted);
}
[data-vibeui-block="solutions-015"] [data-part="eta"]{
text-align:right;font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums;
}
/* Опоздание в минутах: «опаздывает» без числа не помогает принять решение. */
[data-vibeui-block="solutions-015"] [data-part="delay"]{
display:block;font-size:0.6875rem;font-weight:650;color:var(--vibeui-solutions-015-late);
}
[data-vibeui-block="solutions-015"] [data-part="ontime"]{
display:block;font-size:0.6875rem;font-weight:600;color:var(--vibeui-solutions-015-accent);
}
/* Лента прокручивается: сжатые остановки склеивают подписи времени. */
[data-vibeui-block="solutions-015"] [data-part="line"]{
list-style:none;margin:0.75rem 0 0;padding:0 0 0.25rem;
display:grid;grid-auto-flow:column;grid-auto-columns:minmax(6.5rem,1fr);
overflow-x:auto;scrollbar-width:thin;
}
[data-vibeui-block="solutions-015"] [data-part="stop"]{position:relative;padding-top:1.25rem;padding-right:0.5rem}
[data-vibeui-block="solutions-015"] [data-part="stop"]::before{
content:"";position:absolute;left:0;right:0;top:0.375rem;height:2px;
background:color-mix(in oklab,var(--vibeui-solutions-015-fg) 12%,transparent);
}
[data-vibeui-block="solutions-015"] [data-state="done"]::before{background:var(--vibeui-solutions-015-accent)}
[data-vibeui-block="solutions-015"] [data-part="stop"]:last-child::before{right:50%}
[data-vibeui-block="solutions-015"] [data-part="dot"]{
position:absolute;left:0;top:0;width:0.75rem;height:0.75rem;border-radius:9999px;
background:var(--vibeui-solutions-015-bg);
border:2px solid color-mix(in oklab,var(--vibeui-solutions-015-fg) 22%,transparent);
}
[data-vibeui-block="solutions-015"] [data-state="done"] [data-part="dot"]{
background:var(--vibeui-solutions-015-accent);border-color:var(--vibeui-solutions-015-accent);
}
/* Текущая остановка крупнее и обведена: где машина — видно без чтения строк. */
[data-vibeui-block="solutions-015"] [data-state="current"] [data-part="dot"]{
left:-0.125rem;top:-0.125rem;width:1rem;height:1rem;
border-color:var(--vibeui-solutions-015-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-solutions-015-accent) 22%,transparent);
}
[data-vibeui-block="solutions-015"] [data-part="place"]{
display:block;font-size:0.75rem;font-weight:600;line-height:1.3;
}
[data-vibeui-block="solutions-015"] [data-state="next"] [data-part="place"]{color:var(--vibeui-solutions-015-muted);font-weight:500}
[data-vibeui-block="solutions-015"] [data-part="time"]{
display:block;font-size:0.6875rem;color:var(--vibeui-solutions-015-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-015"] [data-state="current"] [data-part="time"]{color:var(--vibeui-solutions-015-accent);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROUTES: Solutions015Route[] = [
  {
    code: "М-114",
    driver: "Сергей Тарасов",
    truck: "Газель · В 447 ОР",
    eta: "17:20",
    stops: [
      { place: "Склад А", time: "08:00", state: "done" },
      { place: "Кофейня «Мера»", time: "09:40", state: "done" },
      { place: "Ателье «Нить»", time: "11:15", state: "done" },
      { place: "ТЦ «Круг»", time: "13:30", state: "current" },
      { place: "Пекарня «Тесто»", time: "15:40", state: "next" },
      { place: "Склад А", time: "17:20", state: "next" },
    ],
  },
  {
    code: "М-118",
    driver: "Игорь Панин",
    truck: "Фургон · К 019 ТМ",
    eta: "18:55",
    delayMinutes: 45,
    stops: [
      { place: "Склад Б", time: "08:30", state: "done" },
      { place: "Клиника «Исток»", time: "10:05", state: "done" },
      { place: "Офис на Гоголя", time: "12:50", state: "current" },
      { place: "Стройдвор", time: "16:10", state: "next" },
      { place: "Склад Б", time: "18:55", state: "next" },
    ],
  },
  {
    code: "М-121",
    driver: "Дина Соколова",
    truck: "Каблук · Е 902 НН",
    eta: "14:40",
    stops: [
      { place: "Склад А", time: "09:00", state: "done" },
      { place: "Логистика «Верста»", time: "10:30", state: "done" },
      { place: "Пункт выдачи №7", time: "12:10", state: "current" },
      { place: "Склад А", time: "14:40", state: "next" },
    ],
  },
]

/**
 * Маршруты доставки: остановки лентой, положение машины — точкой на линии.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions015({
  title = "Маршруты на сегодня",
  day = "Четверг, 14 марта · 3 машины в рейсе",
  routes = DEFAULT_ROUTES,
  onTimeLabel = "идёт по графику",
  lateLabel = "опаздывает на",
  accent,
  className,
  style,
}: Solutions015Props) {
  const palette = {
    ...(accent ? { "--vibeui-solutions-015-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-015" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-015"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="day">{day}</p>
          </div>
          <p data-part="day">
            Опаздывают: {routes.filter((route) => route.delayMinutes).length}
          </p>
        </header>

        <div data-part="list">
          {routes.map((route) => (
            <article
              key={route.code}
              data-part="route"
              data-late={route.delayMinutes ? "true" : "false"}
              aria-label={`Маршрут ${route.code}, водитель ${route.driver}`}
            >
              <div data-part="meta">
                <div>
                  <h3>
                    {route.driver} <span data-part="code">{route.code}</span>
                  </h3>
                  <span data-part="truck">{route.truck}</span>
                </div>
                <p data-part="eta">
                  возвращение {route.eta}
                  {route.delayMinutes ? (
                    <span data-part="delay">
                      {lateLabel} {route.delayMinutes} мин
                    </span>
                  ) : (
                    <span data-part="ontime">{onTimeLabel}</span>
                  )}
                </p>
              </div>

              <ol data-part="line">
                {route.stops.map((stop) => (
                  <li
                    key={stop.place + stop.time}
                    data-part="stop"
                    data-state={stop.state}
                  >
                    <span data-part="dot" aria-hidden="true" />
                    <span data-part="place">{stop.place}</span>
                    <span data-part="time">{stop.time}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
