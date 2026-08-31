import type { CSSProperties } from "react"

export type Solutions042Event = {
  day: number
  label: string
  kind: "filed" | "hearing" | "ruling" | "appeal"
}

export type Solutions042Case = {
  number: string
  plaintiff: string
  defendant: string
  instance: "первая" | "апелляция" | "кассация"
  claim: string
  hearing: string
  hearingInDays: number
  events: Solutions042Event[]
}

export type Solutions042Props = {
  title?: string
  subtitle?: string
  soonInDays?: number
  cases?: Solutions042Case[]
  foot?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: реестр судебных дел как список раскрывающихся карточек. Каждое
// дело — <details>: свёрнутое состояние показывает номер, стороны и ближайшее
// заседание, развёрнутое — полные реквизиты и ленту процессуальных событий.
// Список из десятков дел со всеми событиями сразу нечитаем; список без лент
// вообще не отвечает на вопрос «что уже было по делу». Срочность заседания
// не приходит готовой меткой — считается из числа дней до даты тут же в
// компоненте, поэтому просрочка и «сегодня» не разъезжаются с чипом.
const STYLES = `
:where([data-vibeui-block="solutions-042"]){
--vibeui-solutions-042-bg:oklch(1 0 0);
--vibeui-solutions-042-panel:oklch(0.976 0.004 260);
--vibeui-solutions-042-fg:oklch(0.21 0.014 265);
--vibeui-solutions-042-muted:oklch(0.54 0.014 265);
--vibeui-solutions-042-border:oklch(0.9 0.006 265);
--vibeui-solutions-042-accent:oklch(0.48 0.15 265);
--vibeui-solutions-042-urgent:oklch(0.57 0.19 25);
--vibeui-solutions-042-soon:oklch(0.65 0.15 75);
--vibeui-solutions-042-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-042-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-042"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-042-bg);
border:1px solid var(--vibeui-solutions-042-border);border-radius:1rem;
font-family:var(--vibeui-solutions-042-sans);color:var(--vibeui-solutions-042-fg);
}
[data-vibeui-block="solutions-042"] *{box-sizing:border-box}
[data-vibeui-block="solutions-042"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-042"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-042"] [data-part="subtitle"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-042-muted)}
[data-vibeui-block="solutions-042"] [data-part="stats"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-042"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-solutions-042-panel);border:1px solid var(--vibeui-solutions-042-border);
}
[data-vibeui-block="solutions-042"] [data-part="tile"] b{
display:block;font-size:1.0625rem;font-weight:700;letter-spacing:-0.015em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-042"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-042-muted);
}
[data-vibeui-block="solutions-042"] [data-part="list"]{
list-style:none;margin:0;padding:0 1rem 1rem;display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="solutions-042"] [data-part="case"]{
border:1px solid var(--vibeui-solutions-042-border);border-radius:0.75rem;overflow:hidden;
}
[data-vibeui-block="solutions-042"] [data-part="case"][open]{border-color:color-mix(in oklab,var(--vibeui-solutions-042-accent) 40%,var(--vibeui-solutions-042-border))}
[data-vibeui-block="solutions-042"] [data-part="case-summary"]{
cursor:pointer;list-style:none;padding:0.625rem 0.75rem;
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 0.75rem;
}
[data-vibeui-block="solutions-042"] [data-part="case-summary"]::-webkit-details-marker{display:none}
[data-vibeui-block="solutions-042"] [data-part="case-summary"]:focus-visible{outline:2px solid var(--vibeui-solutions-042-accent);outline-offset:-2px;border-radius:0.5rem}
[data-vibeui-block="solutions-042"] [data-part="number"]{
font-family:var(--vibeui-solutions-042-mono);font-size:0.75rem;font-weight:650;
background:var(--vibeui-solutions-042-panel);border:1px solid var(--vibeui-solutions-042-border);
border-radius:0.375rem;padding:0.125rem 0.375rem;
}
[data-vibeui-block="solutions-042"] [data-part="parties"]{font-size:0.8125rem;font-weight:600;flex:1 1 12rem;min-width:0}
[data-vibeui-block="solutions-042"] [data-part="instance"]{
font-size:0.625rem;font-weight:650;letter-spacing:0.02em;text-transform:uppercase;
color:var(--vibeui-solutions-042-muted);border:1px solid var(--vibeui-solutions-042-border);
border-radius:9999px;padding:0.1875rem 0.5rem;
}
[data-vibeui-block="solutions-042"] [data-part="claim"]{
font-size:0.8125rem;font-weight:700;font-variant-numeric:tabular-nums;margin-left:auto;
}
[data-vibeui-block="solutions-042"] [data-part="urgency"]{
display:inline-flex;align-items:center;gap:0.3125rem;font-size:0.6875rem;font-weight:650;
color:var(--vibeui-solutions-042-muted);white-space:nowrap;
}
[data-vibeui-block="solutions-042"] [data-part="dot"]{
width:0.5rem;height:0.5rem;border-radius:9999px;background:var(--vibeui-solutions-042-muted);
}
[data-vibeui-block="solutions-042"] [data-urgency="urgent"] [data-part="dot"]{background:var(--vibeui-solutions-042-urgent)}
[data-vibeui-block="solutions-042"] [data-urgency="urgent"]{color:var(--vibeui-solutions-042-urgent)}
[data-vibeui-block="solutions-042"] [data-urgency="soon"] [data-part="dot"]{background:var(--vibeui-solutions-042-soon)}
[data-vibeui-block="solutions-042"] [data-urgency="soon"]{color:color-mix(in oklab,var(--vibeui-solutions-042-soon) 70%,var(--vibeui-solutions-042-fg))}
[data-vibeui-block="solutions-042"] [data-part="body"]{
padding:0 0.75rem 0.875rem;border-top:1px solid var(--vibeui-solutions-042-border);
}
[data-vibeui-block="solutions-042"] [data-part="facts"]{
display:grid;grid-template-columns:1fr;gap:0.375rem 1rem;margin:0.75rem 0;
}
[data-vibeui-block="solutions-042"] [data-part="facts"] dt{font-size:0.625rem;color:var(--vibeui-solutions-042-muted);margin:0}
[data-vibeui-block="solutions-042"] [data-part="facts"] dd{font-size:0.8125rem;margin:0 0 0.5rem;font-weight:550}
[data-vibeui-block="solutions-042"] [data-part="feed-title"]{
margin:0.25rem 0 0.5rem;font-size:0.6875rem;font-weight:650;letter-spacing:0.02em;text-transform:uppercase;
color:var(--vibeui-solutions-042-muted);
}
[data-vibeui-block="solutions-042"] [data-part="feed"]{
list-style:none;margin:0;padding:0;border-left:2px solid var(--vibeui-solutions-042-border);
}
[data-vibeui-block="solutions-042"] [data-part="event"]{
position:relative;padding:0 0 0.625rem 0.875rem;font-size:0.8125rem;
}
[data-vibeui-block="solutions-042"] [data-part="event"]:last-child{padding-bottom:0}
[data-vibeui-block="solutions-042"] [data-part="event"]::before{
content:"";position:absolute;left:-0.3125rem;top:0.3125rem;width:0.5rem;height:0.5rem;
border-radius:9999px;background:var(--vibeui-solutions-042-accent);
}
[data-vibeui-block="solutions-042"] [data-kind="ruling"]::before{background:var(--vibeui-solutions-042-urgent)}
[data-vibeui-block="solutions-042"] [data-part="event-day"]{
font-variant-numeric:tabular-nums;font-weight:650;margin-right:0.375rem;
}
[data-vibeui-block="solutions-042"] [data-part="event-kind"]{
font-size:0.625rem;color:var(--vibeui-solutions-042-muted);margin-right:0.375rem;
}
[data-vibeui-block="solutions-042"] [data-part="foot"]{
margin:0;padding:0 1rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-042-muted);
}
@container (min-width: 36rem){
[data-vibeui-block="solutions-042"] [data-part="stats"]{grid-template-columns:repeat(4,minmax(0,1fr))}
[data-vibeui-block="solutions-042"] [data-part="facts"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-042"] *{animation:none!important;transition:none!important}}
`

const KIND_LABEL: Record<Solutions042Event["kind"], string> = {
  filed: "подано",
  hearing: "заседание",
  ruling: "решение",
  appeal: "жалоба",
}

const DEFAULT_CASES: Solutions042Case[] = [
  {
    number: "А40-118203/2024",
    plaintiff: "ООО «Верста Логистик»",
    defendant: "ООО «Стройдвор»",
    instance: "первая",
    claim: "2 400 000 ₽",
    hearing: "14 марта, 10:30, зал 4",
    hearingInDays: 2,
    events: [
      {
        day: -40,
        label: "Исковое заявление принято к производству",
        kind: "filed",
      },
      {
        day: -18,
        label: "Предварительное заседание, назначена экспертиза",
        kind: "hearing",
      },
      { day: 2, label: "Основное заседание, зал 4", kind: "hearing" },
    ],
  },
  {
    number: "А40-95412/2024",
    plaintiff: "ИП Гаврилова А. С.",
    defendant: "ООО «Мера»",
    instance: "апелляция",
    claim: "640 000 ₽",
    hearing: "17 марта, 14:00, зал 2",
    hearingInDays: 5,
    events: [
      { day: -95, label: "Иск удовлетворён частично", kind: "ruling" },
      { day: -60, label: "Подана апелляционная жалоба", kind: "appeal" },
      { day: 5, label: "Заседание апелляционной коллегии", kind: "hearing" },
    ],
  },
  {
    number: "А40-77031/2023",
    plaintiff: "ООО «Исток»",
    defendant: "ООО «Верста Логистик»",
    instance: "кассация",
    claim: "5 100 000 ₽",
    hearing: "заседание не назначено",
    hearingInDays: 0,
    events: [
      {
        day: -210,
        label: "Решение первой инстанции в пользу истца",
        kind: "ruling",
      },
      {
        day: -140,
        label: "Апелляция отменила решение частично",
        kind: "ruling",
      },
      { day: -20, label: "Подана кассационная жалоба", kind: "appeal" },
    ],
  },
  {
    number: "А40-130987/2024",
    plaintiff: "ООО «Нить»",
    defendant: "ООО «Стройдвор»",
    instance: "первая",
    claim: "310 000 ₽",
    hearing: "прошло, ждём определение",
    hearingInDays: -1,
    events: [
      {
        day: -12,
        label: "Исковое заявление принято к производству",
        kind: "filed",
      },
      {
        day: -1,
        label: "Заседание состоялось, объявлен перерыв",
        kind: "hearing",
      },
    ],
  },
]

function urgencyOf(days: number): "urgent" | "soon" | "normal" {
  if (days <= 0) return "urgent"
  return "soon"
}

/**
 * Реестр судебных дел: раскрывающиеся карточки с лентой процессуальных
 * событий, срочность заседания посчитана из числа дней, а не передана меткой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions042({
  title = "Судебные дела",
  subtitle = "Юридический департамент · арбитраж",
  soonInDays = 3,
  cases = DEFAULT_CASES,
  foot = "Раскройте дело, чтобы увидеть полные реквизиты и ленту процессуальных событий.",
  accent,
  className,
  style,
}: Solutions042Props) {
  const inProgress = cases.length
  const appeals = cases.filter(
    (item) => item.instance === "апелляция" || item.instance === "кассация",
  ).length
  const totalClaim = cases.length
  const soon = cases.filter(
    (item) => item.hearingInDays <= soonInDays && item.hearingInDays >= 0,
  ).length

  const palette = {
    ...(accent ? { "--vibeui-solutions-042-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-042" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-042"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="subtitle">{subtitle}</p>
          </div>
        </header>

        <div data-part="stats">
          <p data-part="tile">
            <b>{inProgress}</b>
            <span>дел в производстве</span>
          </p>
          <p data-part="tile">
            <b>{soon}</b>
            <span>заседаний в ближайшие {soonInDays} дн.</span>
          </p>
          <p data-part="tile">
            <b>{appeals}</b>
            <span>в апелляции или кассации</span>
          </p>
          <p data-part="tile">
            <b>{totalClaim}</b>
            <span>всего дел в реестре</span>
          </p>
        </div>

        <ul data-part="list">
          {cases.map((item) => {
            const urgency = urgencyOf(item.hearingInDays)
            return (
              <li key={item.number}>
                <details data-part="case">
                  <summary data-part="case-summary">
                    <span data-part="number">{item.number}</span>
                    <span data-part="parties">
                      {item.plaintiff} против {item.defendant}
                    </span>
                    <span data-part="instance">{item.instance} инстанция</span>
                    <span data-part="urgency" data-urgency={urgency}>
                      <span data-part="dot" aria-hidden="true" />
                      {item.hearing}
                    </span>
                    <span data-part="claim">{item.claim}</span>
                  </summary>
                  <div data-part="body">
                    <dl data-part="facts">
                      <div>
                        <dt>Истец</dt>
                        <dd>{item.plaintiff}</dd>
                      </div>
                      <div>
                        <dt>Ответчик</dt>
                        <dd>{item.defendant}</dd>
                      </div>
                      <div>
                        <dt>Инстанция</dt>
                        <dd>{item.instance}</dd>
                      </div>
                      <div>
                        <dt>Сумма иска</dt>
                        <dd>{item.claim}</dd>
                      </div>
                    </dl>
                    <h3 data-part="feed-title">Лента событий</h3>
                    <ol data-part="feed">
                      {item.events.map((event) => (
                        <li
                          data-part="event"
                          data-kind={event.kind}
                          key={`${item.number}-${event.day}-${event.kind}`}
                        >
                          <span data-part="event-day">
                            {event.day <= 0
                              ? `${Math.abs(event.day)} дн. назад`
                              : `через ${event.day} дн.`}
                          </span>
                          <span data-part="event-kind">
                            {KIND_LABEL[event.kind]}
                          </span>
                          {event.label}
                        </li>
                      ))}
                    </ol>
                  </div>
                </details>
              </li>
            )
          })}
        </ul>

        <p data-part="foot">{foot}</p>
      </section>
    </>
  )
}
