import type { CSSProperties } from "react"

export type Dashboard063Record = {
  id: string
  label: string
  meta: string
  waiting: string
}

export type Dashboard063Person = {
  name: string
  role: string
  load: number
  capacity: number
  away?: string
}

export type Dashboard063Props = {
  title?: string
  records?: Dashboard063Record[]
  people?: Dashboard063Person[]
  ruleText?: string
  assignLabel?: string
  autoLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: назначить владельца — значит выбрать не «свободного», а того,
// кто справится. Поэтому справа не список имён, а список людей с текущей
// нагрузкой полосой и подписью «сколько из скольких»: перегруженный человек
// виден до клика, а не после. Отсутствующие не исчезают из списка, а несут
// причину и дату возвращения — иначе на них назначают и удивляются тишине.
// Слева нераспределённые записи с чекбоксами и сроком ожидания: сортировка по
// ожиданию честнее сортировки по дате создания. Правило автораспределения
// вынесено отдельной строкой: ручное назначение — это отступление от него.
const STYLES = `
:where([data-vibeui-block="dashboard-063"]){
--vibeui-dashboard-063-bg:oklch(0.985 0.003 230);
--vibeui-dashboard-063-card:oklch(1 0 0);
--vibeui-dashboard-063-fg:oklch(0.21 0.014 230);
--vibeui-dashboard-063-muted:oklch(0.55 0.014 230);
--vibeui-dashboard-063-border:oklch(0.91 0.006 230);
--vibeui-dashboard-063-accent:oklch(0.52 0.15 230);
--vibeui-dashboard-063-soft:oklch(0.965 0.02 230);
--vibeui-dashboard-063-over:oklch(0.57 0.19 25);
--vibeui-dashboard-063-free:oklch(0.6 0.13 155);
--vibeui-dashboard-063-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-063"]{
box-sizing:border-box;width:100%;
background:var(--vibeui-dashboard-063-bg);
color:var(--vibeui-dashboard-063-fg);
font-family:var(--vibeui-dashboard-063-sans);
border:1px solid var(--vibeui-dashboard-063-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-063"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-063"] [data-part="shell"]{display:grid;grid-template-columns:1fr;gap:0.875rem}
[data-vibeui-block="dashboard-063"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-063"] h3{margin:0 0 0.4375rem;font-size:0.75rem;font-weight:750;text-transform:uppercase;letter-spacing:0.06em;color:var(--vibeui-dashboard-063-muted)}
[data-vibeui-block="dashboard-063"] [data-part="rule"]{
margin:0.1875rem 0 0;font-size:0.75rem;color:var(--vibeui-dashboard-063-muted);max-width:64ch;
}
[data-vibeui-block="dashboard-063"] [data-part="col"]{min-width:0}
[data-vibeui-block="dashboard-063"] [data-part="records"],
[data-vibeui-block="dashboard-063"] [data-part="people"]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.375rem}
[data-vibeui-block="dashboard-063"] [data-part="record"]{
display:flex;gap:0.5rem;align-items:flex-start;padding:0.5625rem 0.6875rem;border-radius:0.75rem;
background:var(--vibeui-dashboard-063-card);border:1px solid var(--vibeui-dashboard-063-border);
cursor:pointer;
}
[data-vibeui-block="dashboard-063"] [data-part="record"]:has(input:checked){
border-color:color-mix(in oklab,var(--vibeui-dashboard-063-accent) 45%,white);
background:var(--vibeui-dashboard-063-soft);
}
[data-vibeui-block="dashboard-063"] input[type="checkbox"]{margin:0.1875rem 0 0;width:1rem;height:1rem;accent-color:var(--vibeui-dashboard-063-accent)}
[data-vibeui-block="dashboard-063"] input[type="radio"]{margin:0.1875rem 0 0;width:1rem;height:1rem;accent-color:var(--vibeui-dashboard-063-accent)}
[data-vibeui-block="dashboard-063"] [data-part="label"]{display:block;font-size:0.8125rem;font-weight:700}
[data-vibeui-block="dashboard-063"] [data-part="meta"]{display:block;font-size:0.6875rem;color:var(--vibeui-dashboard-063-muted)}
[data-vibeui-block="dashboard-063"] [data-part="wait"]{
margin-left:auto;font-size:0.6875rem;font-weight:750;white-space:nowrap;
color:var(--vibeui-dashboard-063-over);
}
[data-vibeui-block="dashboard-063"] [data-part="person"]{
display:grid;grid-template-columns:auto 1fr;gap:0.1875rem 0.5rem;align-items:start;
padding:0.5625rem 0.6875rem;border-radius:0.75rem;cursor:pointer;
background:var(--vibeui-dashboard-063-card);border:1px solid var(--vibeui-dashboard-063-border);
}
[data-vibeui-block="dashboard-063"] [data-part="person"]:has(input:checked){
border-color:color-mix(in oklab,var(--vibeui-dashboard-063-accent) 45%,white);
background:var(--vibeui-dashboard-063-soft);
}
[data-vibeui-block="dashboard-063"] [data-part="who"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.4375rem}
[data-vibeui-block="dashboard-063"] [data-part="who"] b{font-size:0.8125rem;font-weight:750}
[data-vibeui-block="dashboard-063"] [data-part="who"] span{font-size:0.6875rem;color:var(--vibeui-dashboard-063-muted)}
[data-vibeui-block="dashboard-063"] [data-part="away"]{
font-size:0.625rem;font-weight:750;padding:0.0625rem 0.375rem;border-radius:0.3125rem;
background:var(--vibeui-dashboard-063-bg);border:1px solid var(--vibeui-dashboard-063-border);
}
[data-vibeui-block="dashboard-063"] [data-part="bar"]{
grid-column:2;position:relative;height:0.375rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-dashboard-063-bg);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-063-border);
}
[data-vibeui-block="dashboard-063"] [data-part="bar"] span{
position:absolute;inset:0 auto 0 0;border-radius:9999px;background:var(--vibeui-dashboard-063-accent);
}
[data-vibeui-block="dashboard-063"] [data-load="free"] [data-part="bar"] span{background:var(--vibeui-dashboard-063-free)}
[data-vibeui-block="dashboard-063"] [data-load="over"] [data-part="bar"] span{background:var(--vibeui-dashboard-063-over)}
[data-vibeui-block="dashboard-063"] [data-part="load"]{grid-column:2;margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-063-muted)}
[data-vibeui-block="dashboard-063"] [data-load="over"] [data-part="load"]{color:var(--vibeui-dashboard-063-over);font-weight:700}
[data-vibeui-block="dashboard-063"] [data-part="foot"]{
grid-column:1 / -1;display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;
padding-top:0.125rem;
}
[data-vibeui-block="dashboard-063"] [data-part="assign"]{
appearance:none;border:0;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:700;
padding:0.5rem 1rem;border-radius:0.625rem;
background:var(--vibeui-dashboard-063-accent);color:oklch(1 0 0);
}
[data-vibeui-block="dashboard-063"] [data-part="auto"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:700;
padding:0.5rem 1rem;border-radius:0.625rem;background:transparent;color:inherit;
border:1px solid var(--vibeui-dashboard-063-border);
}
[data-vibeui-block="dashboard-063"] :is(a,button,input,label):focus-visible{
outline:2px solid var(--vibeui-dashboard-063-accent);outline-offset:2px;
}
@container (min-width: 46rem){
[data-vibeui-block="dashboard-063"] [data-part="shell"]{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr)}
[data-vibeui-block="dashboard-063"] [data-part="head"]{grid-column:1 / -1}
}
`

const DEFAULT_RECORDS: Dashboard063Record[] = [
  {
    id: "zk-4901",
    label: "ЗК-4901 · Поставка стеллажей",
    meta: "ООО «Северный лес» · 412 000 ₽",
    waiting: "ждёт 3 дня",
  },
  {
    id: "zk-4902",
    label: "ЗК-4902 · Ремонт линии розлива",
    meta: "Комбинат «Заря» · 1 240 000 ₽",
    waiting: "ждёт 2 дня",
  },
  {
    id: "zk-4903",
    label: "ЗК-4903 · Продление сервиса",
    meta: "Аптеки «Вита» · 186 500 ₽",
    waiting: "ждёт 2 дня",
  },
  {
    id: "zk-4904",
    label: "ЗК-4904 · Обучение операторов",
    meta: "ТД «Ремстрой» · 128 000 ₽",
    waiting: "ждёт 1 день",
  },
  {
    id: "zk-4905",
    label: "ЗК-4905 · Пусконаладка станции",
    meta: "Водоканал Тюмени · 930 000 ₽",
    waiting: "ждёт 4 часа",
  },
]

const DEFAULT_PEOPLE: Dashboard063Person[] = [
  { name: "Ирина Кузнецова", role: "старший менеджер", load: 18, capacity: 20 },
  { name: "Павел Дорохов", role: "менеджер", load: 24, capacity: 20 },
  { name: "Марина Тюрина", role: "менеджер", load: 9, capacity: 20 },
  {
    name: "Егор Савельев",
    role: "менеджер",
    load: 12,
    capacity: 20,
    away: "в отпуске до 24 июня",
  },
  { name: "Алла Никитина", role: "стажёр", load: 4, capacity: 8 },
]

/**
 * Экран назначения владельцев: слева нераспределённые записи с чекбоксами и
 * сроком ожидания, справа люди с полосой нагрузки и отметкой отсутствия,
 * внизу правило автораспределения. Один файл, ноль зависимостей, без JS.
 */
export function Dashboard063({
  title = "Назначение владельцев",
  records = DEFAULT_RECORDS,
  people = DEFAULT_PEOPLE,
  ruleText = "Автораспределение выключено с 3 июня: заявки крупнее 500 000 ₽ решили назначать вручную. Ручное назначение всегда сильнее правила.",
  assignLabel = "Назначить выбранные",
  autoLabel = "Распределить по правилу",
  accent,
  className,
  style,
}: Dashboard063Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-063-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-063" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-063"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="rule">{ruleText}</p>
          </div>

          <div data-part="col">
            <h3>Без владельца: {records.length}</h3>
            <ul data-part="records">
              {records.map((record) => (
                <li key={record.id}>
                  <label data-part="record">
                    <input type="checkbox" defaultChecked />
                    <span>
                      <span data-part="label">{record.label}</span>
                      <span data-part="meta">{record.meta}</span>
                    </span>
                    <span data-part="wait">{record.waiting}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div data-part="col">
            <h3>Кому назначить</h3>
            <ul data-part="people">
              {people.map((person) => {
                const share = Math.min(
                  100,
                  Math.round((person.load / person.capacity) * 100),
                )
                const zone =
                  share > 100 || person.load > person.capacity
                    ? "over"
                    : share < 60
                      ? "free"
                      : "busy"

                return (
                  <li key={person.name}>
                    <label data-part="person" data-load={zone}>
                      <input type="radio" name="dashboard-063-owner" />
                      <span data-part="who">
                        <b>{person.name}</b>
                        <span>{person.role}</span>
                        {person.away ? (
                          <span data-part="away">{person.away}</span>
                        ) : null}
                      </span>
                      <span data-part="bar">
                        <span style={{ width: `${share}%` }} />
                      </span>
                      <span data-part="load">
                        в работе {person.load} из {person.capacity} заявок
                        {person.load > person.capacity
                          ? " — сверх нормы"
                          : null}
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>

          <div data-part="foot">
            <button type="button" data-part="assign">
              {assignLabel}
            </button>
            <button type="button" data-part="auto">
              {autoLabel}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
