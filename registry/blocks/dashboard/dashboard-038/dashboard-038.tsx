import type { CSSProperties } from "react"

export type Dashboard038Event = {
  day: string
  time: string
  kind: "Звонок" | "Письмо" | "Встреча" | "Оплата" | "Заявка"
  title: string
  text: string
  who: string
}

export type Dashboard038Fact = {
  label: string
  value: string
}

export type Dashboard038Props = {
  company?: string
  segment?: string
  manager?: string
  since?: string
  stats?: Dashboard038Fact[]
  events?: Dashboard038Event[]
  facts?: Dashboard038Fact[]
  noteLabel?: string
  callLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: карточка клиента, где главное — не реквизиты, а история
// взаимодействий. Лента идёт вертикальной линией с точкой на каждом событии;
// тип события несёт не только цвет, но и букву внутри точки — на печати и на
// монохромном экране цветовая метка исчезает. День объявлен подзаголовком
// внутри ленты, потому что без группировки время не читается. Реквизиты
// вынесены в отдельный столбец списком dl: это справка, а не события.
const STYLES = `
:where([data-vibeui-block="dashboard-038"]){
--vibeui-dashboard-038-bg:oklch(0.985 0.003 265);
--vibeui-dashboard-038-card:oklch(1 0 0);
--vibeui-dashboard-038-fg:oklch(0.22 0.014 265);
--vibeui-dashboard-038-muted:oklch(0.55 0.014 265);
--vibeui-dashboard-038-border:oklch(0.91 0.006 265);
--vibeui-dashboard-038-accent:oklch(0.5 0.15 172);
--vibeui-dashboard-038-soft:oklch(0.95 0.03 172);
--vibeui-dashboard-038-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-038"]{
box-sizing:border-box;
background:var(--vibeui-dashboard-038-bg);
color:var(--vibeui-dashboard-038-fg);
font-family:var(--vibeui-dashboard-038-sans);
border:1px solid var(--vibeui-dashboard-038-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-038"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-038"] [data-part="shell"]{display:grid;gap:0.875rem;grid-template-columns:1fr}
[data-vibeui-block="dashboard-038"] [data-part="head"]{
grid-column:1/-1;display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem;
background:var(--vibeui-dashboard-038-card);
border:1px solid var(--vibeui-dashboard-038-border);border-radius:0.875rem;padding:0.875rem;
}
[data-vibeui-block="dashboard-038"] [data-part="logo"]{
width:2.75rem;height:2.75rem;border-radius:0.75rem;flex:none;display:grid;place-items:center;
font-size:1rem;font-weight:800;
background:var(--vibeui-dashboard-038-soft);color:var(--vibeui-dashboard-038-accent);
}
[data-vibeui-block="dashboard-038"] [data-part="who"]{min-width:9rem}
[data-vibeui-block="dashboard-038"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-038"] [data-part="sub"]{
display:block;margin-top:0.1875rem;font-size:0.75rem;color:var(--vibeui-dashboard-038-muted);
}
[data-vibeui-block="dashboard-038"] [data-part="acts"]{display:flex;gap:0.5rem;margin-left:auto}
[data-vibeui-block="dashboard-038"] [data-part="call"]{
appearance:none;border:0;cursor:pointer;font:inherit;
font-size:0.8125rem;font-weight:700;padding:0.5rem 0.875rem;border-radius:0.625rem;
background:var(--vibeui-dashboard-038-accent);color:oklch(1 0 0);
}
[data-vibeui-block="dashboard-038"] [data-part="note"]{
appearance:none;cursor:pointer;font:inherit;
font-size:0.8125rem;font-weight:650;padding:0.5rem 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-dashboard-038-border);background:var(--vibeui-dashboard-038-card);color:inherit;
}
[data-vibeui-block="dashboard-038"] [data-part="stats"]{
grid-column:1/-1;display:grid;grid-template-columns:repeat(2,1fr);gap:0.5rem;
}
[data-vibeui-block="dashboard-038"] [data-part="stat"]{
background:var(--vibeui-dashboard-038-card);
border:1px solid var(--vibeui-dashboard-038-border);border-radius:0.75rem;padding:0.625rem 0.75rem;
}
[data-vibeui-block="dashboard-038"] [data-part="stat"] dt{
font-size:0.625rem;font-weight:650;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-dashboard-038-muted);
}
[data-vibeui-block="dashboard-038"] [data-part="stat"] dd{
margin:0.25rem 0 0;font-size:1rem;font-weight:750;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-038"] [data-part="feed"]{
background:var(--vibeui-dashboard-038-card);
border:1px solid var(--vibeui-dashboard-038-border);border-radius:0.875rem;padding:0.875rem;
}
[data-vibeui-block="dashboard-038"] h3{margin:0 0 0.625rem;font-size:0.875rem;font-weight:750}
[data-vibeui-block="dashboard-038"] [data-part="day"]{
display:block;margin:0.75rem 0 0.375rem;
font-size:0.625rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-dashboard-038-muted);
}
[data-vibeui-block="dashboard-038"] [data-part="day"]:first-of-type{margin-top:0}
[data-vibeui-block="dashboard-038"] [data-part="line"]{
list-style:none;margin:0;padding:0 0 0 1.5rem;position:relative;
}
[data-vibeui-block="dashboard-038"] [data-part="line"]::before{
content:"";position:absolute;left:0.5625rem;top:0.375rem;bottom:0.375rem;width:1px;
background:var(--vibeui-dashboard-038-border);
}
[data-vibeui-block="dashboard-038"] [data-part="event"]{position:relative;padding:0.375rem 0 0.625rem}
[data-vibeui-block="dashboard-038"] [data-part="dot"]{
position:absolute;left:-1.5rem;top:0.375rem;
width:1.1875rem;height:1.1875rem;border-radius:50%;display:grid;place-items:center;
font-size:0.5625rem;font-weight:800;
background:var(--vibeui-dashboard-038-card);
border:1.5px solid var(--vibeui-dashboard-038-border);
color:var(--vibeui-dashboard-038-muted);
}
[data-vibeui-block="dashboard-038"] [data-part="event"][data-kind="Оплата"] [data-part="dot"],
[data-vibeui-block="dashboard-038"] [data-part="event"][data-kind="Встреча"] [data-part="dot"]{
border-color:var(--vibeui-dashboard-038-accent);color:var(--vibeui-dashboard-038-accent);
background:var(--vibeui-dashboard-038-soft);
}
[data-vibeui-block="dashboard-038"] [data-part="top"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.375rem;
font-size:0.8125rem;font-weight:700;
}
[data-vibeui-block="dashboard-038"] [data-part="time"]{
font-size:0.6875rem;font-weight:600;color:var(--vibeui-dashboard-038-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-038"] [data-part="text"]{
margin:0.1875rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-dashboard-038-muted);
}
[data-vibeui-block="dashboard-038"] [data-part="side"]{
align-self:start;
background:var(--vibeui-dashboard-038-card);
border:1px solid var(--vibeui-dashboard-038-border);border-radius:0.875rem;padding:0.875rem;
}
[data-vibeui-block="dashboard-038"] [data-part="side"] dl{
margin:0;display:grid;grid-template-columns:1fr auto;gap:0.4375rem 0.75rem;
}
[data-vibeui-block="dashboard-038"] [data-part="side"] dt{font-size:0.75rem;color:var(--vibeui-dashboard-038-muted)}
[data-vibeui-block="dashboard-038"] [data-part="side"] dd{
margin:0;font-size:0.75rem;font-weight:700;text-align:right;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-038"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-038-accent);outline-offset:2px;
}
@container (min-width: 34rem){
[data-vibeui-block="dashboard-038"] [data-part="stats"]{grid-template-columns:repeat(4,1fr)}
}
@container (min-width: 50rem){
[data-vibeui-block="dashboard-038"] [data-part="shell"]{grid-template-columns:1.7fr 1fr;gap:1rem}
}
`

const DEFAULT_STATS: Dashboard038Fact[] = [
  { label: "Оборот за год", value: "4 180 000 ₽" },
  { label: "Заявок закрыто", value: "37" },
  { label: "Средний чек", value: "112 900 ₽" },
  { label: "Просрочек", value: "0" },
]

const DEFAULT_EVENTS: Dashboard038Event[] = [
  {
    day: "Сегодня",
    time: "11:20",
    kind: "Звонок",
    title: "Исходящий звонок, 8 минут",
    text: "Обсудили перенос поставки на конец марта. Клиент просит счёт заранее.",
    who: "Мария Соловьёва",
  },
  {
    day: "Сегодня",
    time: "09:05",
    kind: "Заявка",
    title: "Заявка ЗА-4818 закрыта",
    text: "Настроили доступ второму бухгалтеру, вопросов не осталось.",
    who: "Игорь Панов",
  },
  {
    day: "Вчера",
    time: "16:41",
    kind: "Оплата",
    title: "Оплачен счёт № 2270 на 340 000 ₽",
    text: "Поступление подтверждено банком, акт отправлен на почту.",
    who: "Автоматически",
  },
  {
    day: "Вчера",
    time: "10:00",
    kind: "Встреча",
    title: "Встреча в офисе, 45 минут",
    text: "Показали отчёты по складу, договорились о пилоте на втором филиале.",
    who: "Анна Реброва",
  },
]

const DEFAULT_FACTS: Dashboard038Fact[] = [
  { label: "ИНН", value: "7728311021" },
  { label: "Договор", value: "ДГ-114 от 12.04.2023" },
  { label: "Тариф", value: "Команда, годовой" },
  { label: "Отсрочка", value: "14 дней" },
  { label: "Ближайший счёт", value: "20 марта" },
  { label: "Каналов связи", value: "3" },
]

/**
 * Страница клиента: шапка с компанией и менеджером, показатели, лента
 * взаимодействий по дням и столбец реквизитов. Один файл, ноль зависимостей,
 * клиентского JS нет.
 */
export function Dashboard038({
  company = "ООО «Северный лес»",
  segment = "Крупный клиент · Лесозаготовка",
  manager = "Мария Соловьёва",
  since = "с апреля 2023",
  stats = DEFAULT_STATS,
  events = DEFAULT_EVENTS,
  facts = DEFAULT_FACTS,
  noteLabel = "Добавить заметку",
  callLabel = "Позвонить",
  accent,
  className,
  style,
}: Dashboard038Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-038-accent": accent } : null),
    ...style,
  } as CSSProperties

  const days = events.reduce<string[]>(
    (list, event) => (list.includes(event.day) ? list : [...list, event.day]),
    [],
  )

  return (
    <>
      <style href="vibeui-dashboard-038" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-038"
        className={className}
        style={palette}
        aria-label={`Карточка клиента: ${company}`}
      >
        <div data-part="shell">
          <div data-part="head">
            <span data-part="logo" aria-hidden="true">
              {company.replace(/[^А-ЯЁA-Z]/g, "").slice(0, 2)}
            </span>
            <div data-part="who">
              <h2>{company}</h2>
              <span data-part="sub">
                {segment} · {since}
              </span>
            </div>
            <span data-part="sub">Менеджер: {manager}</span>
            <div data-part="acts">
              <button type="button" data-part="call">
                {callLabel}
              </button>
              <button type="button" data-part="note">
                {noteLabel}
              </button>
            </div>
          </div>

          <dl data-part="stats">
            {stats.map((stat) => (
              <div key={stat.label} data-part="stat">
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>

          <div data-part="feed">
            <h3>История взаимодействий</h3>
            {days.map((day) => (
              <div key={day}>
                <span data-part="day">{day}</span>
                <ul data-part="line">
                  {events
                    .filter((event) => event.day === day)
                    .map((event) => (
                      <li
                        key={event.time + event.title}
                        data-part="event"
                        data-kind={event.kind}
                      >
                        <span data-part="dot" title={event.kind}>
                          {event.kind.charAt(0)}
                        </span>
                        <span data-part="top">
                          {event.title}
                          <span data-part="time">
                            {event.time} · {event.kind} · {event.who}
                          </span>
                        </span>
                        <p data-part="text">{event.text}</p>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>

          <div data-part="side">
            <h3>Реквизиты и условия</h3>
            <dl>
              {facts.map((fact) => (
                <div key={fact.label} style={{ display: "contents" }}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  )
}
