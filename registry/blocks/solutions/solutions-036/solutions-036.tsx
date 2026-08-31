import type { CSSProperties } from "react"

export type Solutions036Priority = "low" | "normal" | "high" | "urgent"

export type Solutions036Ticket = {
  id: string
  address: string
  apartment: string
  issue: string
  priority: Solutions036Priority
  crew: string
  slaHours: number
  elapsedHours: number
}

export type Solutions036Props = {
  title?: string
  hint?: string
  tickets?: Solutions036Ticket[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: диспетчерские заявки ЖКХ. Норматив не сравнивается с прошедшим
// временем текстом — процент считается из slaHours и elapsedHours и рисуется
// полосой: полторы нормы видно сразу, а «3 из 4 часов» нужно вычитать. Приоритет
// несёт букву в бейдже, а не только цвет фона — «А» аварийная не спутать с
// «В» высокой при дальтонизме. Просрочка — не отдельное поле, а вывод из того
// же процента: он же красит полосу, он же подписывает статус словом.
const STYLES = `
:where([data-vibeui-block="solutions-036"]){
--vibeui-solutions-036-bg:oklch(1 0 0);
--vibeui-solutions-036-panel:oklch(0.973 0.005 40);
--vibeui-solutions-036-fg:oklch(0.22 0.014 40);
--vibeui-solutions-036-muted:oklch(0.54 0.014 40);
--vibeui-solutions-036-border:oklch(0.9 0.007 40);
--vibeui-solutions-036-accent:oklch(0.55 0.17 40);
--vibeui-solutions-036-low:oklch(0.6 0.02 240);
--vibeui-solutions-036-normal:oklch(0.56 0.13 235);
--vibeui-solutions-036-high:oklch(0.65 0.16 70);
--vibeui-solutions-036-urgent:oklch(0.57 0.19 25);
--vibeui-solutions-036-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-036"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-036-bg);
border:1px solid var(--vibeui-solutions-036-border);border-radius:1rem;
font-family:var(--vibeui-solutions-036-sans);color:var(--vibeui-solutions-036-fg);
}
[data-vibeui-block="solutions-036"] *{box-sizing:border-box}
[data-vibeui-block="solutions-036"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-036"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-036"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-036-muted)}
[data-vibeui-block="solutions-036"] [data-part="summary"]{
display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-036"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;background:var(--vibeui-solutions-036-panel);
border:1px solid var(--vibeui-solutions-036-border);
}
[data-vibeui-block="solutions-036"] [data-tile="late"]{
border-color:color-mix(in oklab,var(--vibeui-solutions-036-urgent) 45%,transparent);
background:color-mix(in oklab,var(--vibeui-solutions-036-urgent) 8%,var(--vibeui-solutions-036-bg));
}
[data-vibeui-block="solutions-036"] [data-part="tile"] b{
display:block;font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.015em;
}
[data-vibeui-block="solutions-036"] [data-tile="late"] b{color:var(--vibeui-solutions-036-urgent)}
[data-vibeui-block="solutions-036"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-036-muted);
}
[data-vibeui-block="solutions-036"] [data-part="list"]{
display:flex;flex-direction:column;gap:0.625rem;padding:0 1rem 1rem;
}
[data-vibeui-block="solutions-036"] [data-part="card"]{
border:1px solid var(--vibeui-solutions-036-border);border-radius:0.75rem;padding:0.75rem 0.875rem;
display:grid;gap:0.5rem;
}
[data-vibeui-block="solutions-036"] [data-part="row"]{
display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:0.5rem 1rem;
}
[data-vibeui-block="solutions-036"] [data-part="address"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="solutions-036"] [data-part="meta"]{margin:0.1875rem 0 0;font-size:0.75rem;color:var(--vibeui-solutions-036-muted)}
/* Приоритет несёт букву, не только цвет: аварию не спутать с высокой заявкой. */
[data-vibeui-block="solutions-036"] [data-part="priority"]{
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.1875rem 0.5625rem 0.1875rem 0.25rem;border-radius:9999px;
border:1px solid var(--vibeui-solutions-036-border);
font-size:0.6875rem;font-weight:650;white-space:nowrap;color:var(--vibeui-solutions-036-muted);
}
[data-vibeui-block="solutions-036"] [data-part="letter"]{
width:1.125rem;height:1.125rem;border-radius:9999px;display:grid;place-items:center;
font-size:0.625rem;font-weight:700;color:oklch(1 0 0);
}
[data-vibeui-block="solutions-036"] [data-priority="low"] [data-part="letter"]{background:var(--vibeui-solutions-036-low)}
[data-vibeui-block="solutions-036"] [data-priority="normal"] [data-part="letter"]{background:var(--vibeui-solutions-036-normal)}
[data-vibeui-block="solutions-036"] [data-priority="high"] [data-part="letter"]{background:var(--vibeui-solutions-036-high)}
[data-vibeui-block="solutions-036"] [data-priority="urgent"] [data-part="letter"]{background:var(--vibeui-solutions-036-urgent)}
[data-vibeui-block="solutions-036"] [data-priority="high"] [data-part="priority"]{color:color-mix(in oklab,var(--vibeui-solutions-036-high) 65%,var(--vibeui-solutions-036-fg))}
[data-vibeui-block="solutions-036"] [data-priority="urgent"] [data-part="priority"]{color:var(--vibeui-solutions-036-urgent)}
[data-vibeui-block="solutions-036"] [data-part="crew"]{text-align:right;font-size:0.75rem}
[data-vibeui-block="solutions-036"] [data-part="crew"] b{display:block;font-size:0.8125rem}
[data-vibeui-block="solutions-036"] [data-part="crew"] span{color:var(--vibeui-solutions-036-muted)}
/* Норматив — полоса из процента: «3 из 4 часов» приходится вычитать, полосу — нет. */
[data-vibeui-block="solutions-036"] [data-part="sla"]{
height:0.5rem;border-radius:9999px;background:var(--vibeui-solutions-036-panel);
border:1px solid var(--vibeui-solutions-036-border);overflow:hidden;
}
[data-vibeui-block="solutions-036"] [data-part="sla-fill"]{
height:100%;border-radius:9999px;background:var(--vibeui-solutions-036-accent);
}
[data-vibeui-block="solutions-036"] [data-overdue="true"] [data-part="sla-fill"]{background:var(--vibeui-solutions-036-urgent)}
[data-vibeui-block="solutions-036"] [data-part="sla-labels"]{
display:flex;justify-content:space-between;font-size:0.6875rem;color:var(--vibeui-solutions-036-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-036"] [data-overdue="true"] [data-part="sla-status"]{color:var(--vibeui-solutions-036-urgent);font-weight:650}
@container (min-width: 32rem){
[data-vibeui-block="solutions-036"] [data-part="row"]{flex-wrap:nowrap}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-036"] *{animation:none!important;transition:none!important}}
`

const PRIORITY_LETTER: Record<Solutions036Priority, string> = {
  low: "Н",
  normal: "О",
  high: "В",
  urgent: "А",
}

const PRIORITY_LABEL: Record<Solutions036Priority, string> = {
  low: "низкий",
  normal: "обычный",
  high: "высокий",
  urgent: "аварийный",
}

const DEFAULT_TICKETS: Solutions036Ticket[] = [
  {
    id: "З-3381",
    address: "ул. Садовая, д. 12",
    apartment: "кв. 47",
    issue: "Течь стояка ХВС",
    priority: "urgent",
    crew: "Бригада №2 — Кузьмин",
    slaHours: 2,
    elapsedHours: 3,
  },
  {
    id: "З-3384",
    address: "ул. Садовая, д. 12",
    apartment: "кв. 12",
    issue: "Не греет батарея",
    priority: "high",
    crew: "Бригада №1 — Демидов",
    slaHours: 24,
    elapsedHours: 15,
  },
  {
    id: "З-3390",
    address: "пр. Ленина, д. 5",
    apartment: "подъезд 3",
    issue: "Не работает домофон",
    priority: "normal",
    crew: "Бригада №3 — Осипова",
    slaHours: 48,
    elapsedHours: 40,
  },
  {
    id: "З-3392",
    address: "ул. Мира, д. 21",
    apartment: "кв. 9",
    issue: "Скрипит входная дверь подъезда",
    priority: "low",
    crew: "Не назначена",
    slaHours: 72,
    elapsedHours: 6,
  },
]

/**
 * Диспетчерские заявки ЖКХ: норматив — полоса из процента elapsed/sla,
 * приоритет — буква в бейдже. Один файл, ноль зависимостей, своя палитра.
 */
export function Solutions036({
  title = "Диспетчерские заявки",
  hint = "Управляющая компания «Двор» · сегодня",
  tickets = DEFAULT_TICKETS,
  accent,
  className,
  style,
}: Solutions036Props) {
  const overdue = tickets.filter(
    (ticket) => ticket.elapsedHours > ticket.slaHours,
  )
  const urgent = tickets.filter((ticket) => ticket.priority === "urgent")

  const palette = {
    ...(accent ? { "--vibeui-solutions-036-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-036" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-036"
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
            <b>{tickets.length}</b>
            <span>заявок открыто</span>
          </p>
          <p data-part="tile">
            <b>{urgent.length}</b>
            <span>аварийных</span>
          </p>
          <p data-part="tile" data-tile="late">
            <b>{overdue.length}</b>
            <span>вне норматива</span>
          </p>
        </div>

        <div data-part="list">
          {tickets.map((ticket) => {
            const percent = Math.min(
              100,
              Math.round((ticket.elapsedHours / ticket.slaHours) * 100),
            )
            const overdueTicket = ticket.elapsedHours > ticket.slaHours
            const statusLabel = overdueTicket
              ? `просрочено на ${ticket.elapsedHours - ticket.slaHours} ч`
              : `осталось ${ticket.slaHours - ticket.elapsedHours} ч`

            return (
              <article data-part="card" key={ticket.id}>
                <div data-part="row">
                  <div>
                    <p data-part="address">
                      {ticket.address}, {ticket.apartment}
                    </p>
                    <p data-part="meta">
                      {ticket.id} · {ticket.issue}
                    </p>
                    <span data-part="priority" data-priority={ticket.priority}>
                      <span data-part="letter" aria-hidden="true">
                        {PRIORITY_LETTER[ticket.priority]}
                      </span>
                      {PRIORITY_LABEL[ticket.priority]}
                    </span>
                  </div>
                  <p data-part="crew">
                    <b>{ticket.crew}</b>
                    <span>норматив {ticket.slaHours} ч</span>
                  </p>
                </div>

                <div
                  data-part="sla"
                  data-overdue={overdueTicket ? "true" : "false"}
                  role="progressbar"
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Норматив по заявке ${ticket.id}`}
                >
                  <span data-part="sla-fill" style={{ width: `${percent}%` }} />
                </div>
                <div
                  data-part="sla-labels"
                  data-overdue={overdueTicket ? "true" : "false"}
                >
                  <span>
                    {ticket.elapsedHours} из {ticket.slaHours} ч
                  </span>
                  <span data-part="sla-status">{statusLabel}</span>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </>
  )
}
