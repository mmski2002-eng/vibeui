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
  /** Названия инстанций по ключу из поля instance. */
  instanceText?: Record<string, string>
  /** Чип инстанции. {instance} — название инстанции. */
  instanceLabel?: string
  /** Названия событий: filed, hearing, ruling, appeal. */
  kindText?: Record<string, string>
  /** Подписи плиток: cases, soon, appeals, total; {days} — окно «скоро». */
  summaryText?: Record<string, string>
  /** Подписи реквизитов: plaintiff, defendant, instance, claim. */
  factText?: Record<string, string>
  /** Стороны в свёрнутой карточке. {plaintiff} и {defendant}. */
  partiesText?: string
  /** Заголовок ленты событий. */
  feedTitle?: string
  /** Прошедшее событие. {days} — число дней. */
  eventPastText?: string
  /** Будущее событие. {days} — число дней. */
  eventFutureText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
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
--vibeui-solutions-042-bg:transparent;
--vibeui-solutions-042-panel:light-dark(oklch(0.976 0.004 260),oklch(0.27 0.011 265));
--vibeui-solutions-042-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-solutions-042-muted:light-dark(oklch(0.54 0.014 265),oklch(0.69 0.012 265));
--vibeui-solutions-042-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-solutions-042-accent:light-dark(oklch(0.48 0.15 265),oklch(0.72 0.14 265));
--vibeui-solutions-042-urgent:light-dark(oklch(0.57 0.19 25),oklch(0.71 0.17 25));
--vibeui-solutions-042-soon:light-dark(oklch(0.65 0.15 75),oklch(0.78 0.14 75));
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

const KIND_LABEL: Record<string, string> = {
  filed: "подано",
  hearing: "заседание",
  ruling: "решение",
  appeal: "жалоба",
}

const INSTANCE_LABEL: Record<string, string> = {
  первая: "первая",
  апелляция: "апелляция",
  кассация: "кассация",
}

const SUMMARY_LABEL: Record<string, string> = {
  cases: "дел в производстве",
  soon: "заседаний в ближайшие {days} дн.",
  appeals: "в апелляции или кассации",
  total: "всего дел в реестре",
}

const FACT_LABEL: Record<string, string> = {
  plaintiff: "Истец",
  defendant: "Ответчик",
  instance: "Инстанция",
  claim: "Сумма иска",
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
  instanceText = INSTANCE_LABEL,
  instanceLabel = "{instance} инстанция",
  kindText = KIND_LABEL,
  summaryText = SUMMARY_LABEL,
  factText = FACT_LABEL,
  partiesText = "{plaintiff} против {defendant}",
  feedTitle = "Лента событий",
  eventPastText = "{days} дн. назад",
  eventFutureText = "через {days} дн.",
  accent,
  background = "",
  className,
  style,
}: Solutions042Props) {
  const summary = (key: string) => summaryText[key] ?? SUMMARY_LABEL[key]
  const fact = (key: string) => factText[key] ?? FACT_LABEL[key]
  const instance = (key: string) => instanceText[key] ?? key
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
    ...(background
      ? {
          "--vibeui-solutions-042-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
            <span>{summary("cases")}</span>
          </p>
          <p data-part="tile">
            <b>{soon}</b>
            <span>{summary("soon").replace("{days}", String(soonInDays))}</span>
          </p>
          <p data-part="tile">
            <b>{appeals}</b>
            <span>{summary("appeals")}</span>
          </p>
          <p data-part="tile">
            <b>{totalClaim}</b>
            <span>{summary("total")}</span>
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
                      {partiesText
                        .replace("{plaintiff}", item.plaintiff)
                        .replace("{defendant}", item.defendant)}
                    </span>
                    <span data-part="instance">
                      {instanceLabel.replace(
                        "{instance}",
                        instance(item.instance),
                      )}
                    </span>
                    <span data-part="urgency" data-urgency={urgency}>
                      <span data-part="dot" aria-hidden="true" />
                      {item.hearing}
                    </span>
                    <span data-part="claim">{item.claim}</span>
                  </summary>
                  <div data-part="body">
                    <dl data-part="facts">
                      <div>
                        <dt>{fact("plaintiff")}</dt>
                        <dd>{item.plaintiff}</dd>
                      </div>
                      <div>
                        <dt>{fact("defendant")}</dt>
                        <dd>{item.defendant}</dd>
                      </div>
                      <div>
                        <dt>{fact("instance")}</dt>
                        <dd>{instance(item.instance)}</dd>
                      </div>
                      <div>
                        <dt>{fact("claim")}</dt>
                        <dd>{item.claim}</dd>
                      </div>
                    </dl>
                    <h3 data-part="feed-title">{feedTitle}</h3>
                    <ol data-part="feed">
                      {item.events.map((event) => (
                        <li
                          data-part="event"
                          data-kind={event.kind}
                          key={`${item.number}-${event.day}-${event.kind}`}
                        >
                          <span data-part="event-day">
                            {event.day <= 0
                              ? eventPastText.replace(
                                  "{days}",
                                  String(Math.abs(event.day)),
                                )
                              : eventFutureText.replace(
                                  "{days}",
                                  String(event.day),
                                )}
                          </span>
                          <span data-part="event-kind">
                            {kindText[event.kind] ?? KIND_LABEL[event.kind]}
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
