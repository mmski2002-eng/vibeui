import type { CSSProperties } from "react"

type Case005Group = "g1" | "g2" | "g3" | "g4"

type Case005Item = {
  client: string
  industry: string
  group: Case005Group
  task: string
  metric: string
}

export type Case005Props = {
  eyebrow?: string
  title?: string
  allLabel?: string
  items?: Case005Item[]
  /** Имя группы radio-фильтра. Менять, если блок встречается на странице дважды. */
  filterName?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Отраслевые кейсы с фильтром-чипами на чистом CSS: чипы — скрытые
// radio-инпуты, а строки прячет селектор :has() по выбранной группе.
// Ни строчки JS — фильтр работает даже до гидратации. Слотов отрасли
// четыре (g1–g4): CSS не умеет сравнивать произвольные значения, поэтому
// набор групп перечислен в стилях явно.
const STYLES = `
:where([data-vibeui-block="case-005"]){
--vibeui-case-005-bg:transparent;
--vibeui-case-005-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-case-005-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-case-005-muted:light-dark(oklch(0.46 0 0),oklch(0.71 0 0));
--vibeui-case-005-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-case-005-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-case-005-accent-fill:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-case-005-on-accent:oklch(0.15 0.02 39.8);
--vibeui-case-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="case-005"]{color-scheme:dark}
[data-vibeui-block="case-005"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-case-005-bg);color:var(--vibeui-case-005-ink);
font-family:var(--vibeui-case-005-font);
}
[data-vibeui-block="case-005"] [data-part="shell"]{
max-width:64rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="case-005"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-case-005-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="case-005"] [data-part="title"]{
margin:0 0 1.5rem;max-width:22ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="case-005"] [data-part="filters"]{
display:flex;flex-wrap:wrap;gap:0.5rem;
margin:0 0 1.5rem;padding:0;border:0;
}
[data-vibeui-block="case-005"] [data-part="chip-input"],
[data-vibeui-block="case-005"] [data-part="legend"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip:rect(0 0 0 0);white-space:nowrap;border:0;
}
[data-vibeui-block="case-005"] [data-part="pair"]{display:contents}
[data-vibeui-block="case-005"] [data-part="chip"]{
display:inline-block;padding:0.4375rem 0.9375rem;border-radius:999px;
border:1px solid var(--vibeui-case-005-border);
color:var(--vibeui-case-005-muted);
font-size:0.8125rem;font-weight:650;cursor:pointer;user-select:none;
transition:background .15s ease,color .15s ease,border-color .15s ease;
}
[data-vibeui-block="case-005"] [data-part="chip"]:hover{
border-color:color-mix(in oklab,var(--vibeui-case-005-accent) 45%,var(--vibeui-case-005-border));
color:var(--vibeui-case-005-ink);
}
[data-vibeui-block="case-005"] [data-part="chip-input"]:checked+[data-part="chip"]{
background:var(--vibeui-case-005-accent-fill);border-color:var(--vibeui-case-005-accent-fill);
color:var(--vibeui-case-005-on-accent);
}
[data-vibeui-block="case-005"] [data-part="chip-input"]:focus-visible+[data-part="chip"]{
outline:2px solid var(--vibeui-case-005-accent);outline-offset:2px;
}
[data-vibeui-block="case-005"] [data-part="list"]{
display:grid;gap:0.75rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="case-005"]:has([data-part="chip-input"][value="g1"]:checked) [data-part="row"]:not([data-group="g1"]),
[data-vibeui-block="case-005"]:has([data-part="chip-input"][value="g2"]:checked) [data-part="row"]:not([data-group="g2"]),
[data-vibeui-block="case-005"]:has([data-part="chip-input"][value="g3"]:checked) [data-part="row"]:not([data-group="g3"]),
[data-vibeui-block="case-005"]:has([data-part="chip-input"][value="g4"]:checked) [data-part="row"]:not([data-group="g4"]){
display:none;
}
[data-vibeui-block="case-005"] [data-part="row"]{
min-inline-size:0;display:grid;gap:0.625rem;
padding:1.125rem 1.25rem;border:1px solid var(--vibeui-case-005-border);border-radius:1rem;
background:var(--vibeui-case-005-card);
}
[data-vibeui-block="case-005"] [data-part="row-head"]{
display:flex;align-items:center;gap:0.625rem;flex-wrap:wrap;
}
[data-vibeui-block="case-005"] [data-part="client"]{font-size:1rem;font-weight:680}
[data-vibeui-block="case-005"] [data-part="badge"]{
padding:0.1875rem 0.5625rem;border-radius:999px;
background:color-mix(in oklab,var(--vibeui-case-005-accent) 10%,var(--vibeui-case-005-card));
color:var(--vibeui-case-005-accent);
font-size:0.6875rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
}
[data-vibeui-block="case-005"] [data-part="task"]{
margin:0;color:var(--vibeui-case-005-muted);font-size:0.9375rem;line-height:1.5;
}
[data-vibeui-block="case-005"] [data-part="metric"]{
color:var(--vibeui-case-005-accent);
font-size:1.25rem;line-height:1.1;letter-spacing:-0.02em;font-weight:750;
font-variant-numeric:tabular-nums;white-space:nowrap;
}
@container (min-width: 44rem){
[data-vibeui-block="case-005"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="case-005"] [data-part="row"]{
grid-template-columns:minmax(0,1fr) auto;align-items:center;column-gap:1.5rem;
}
[data-vibeui-block="case-005"] [data-part="metric"]{grid-row:1/3;grid-column:2}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="case-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Case005Item[] = [
  {
    client: "Кедр Маркет",
    industry: "Ритейл",
    group: "g1",
    task: "Переезд с конструктора на собственный сайт без найма фронтендера.",
    metric: "−82% времени",
  },
  {
    client: "Шкатулка",
    industry: "Ритейл",
    group: "g1",
    task: "Витрина украшений ручной работы с каталогом на сто позиций.",
    metric: "0 ₽ подписок",
  },
  {
    client: "Финпилот",
    industry: "Финтех",
    group: "g2",
    task: "Лендинг тарифов с калькулятором, собранный за один спринт.",
    metric: "+133% заявок",
  },
  {
    client: "Вектор Страхование",
    industry: "Финтех",
    group: "g2",
    task: "Десять продуктовых страниц сведены к единой дизайн-системе.",
    metric: "−60% поддержки",
  },
  {
    client: "Курс.Лаб",
    industry: "Образование",
    group: "g3",
    task: "Методисты сами запускают посадочные под каждый новый курс.",
    metric: "12 лендингов/мес",
  },
  {
    client: "Синтакс Скул",
    industry: "Образование",
    group: "g3",
    task: "Сайт школы программирования с расписанием потоков.",
    metric: "5 дней до релиза",
  },
  {
    client: "Медпункт+",
    industry: "Услуги",
    group: "g4",
    task: "Онлайн-запись в клинику вместо очереди на телефонной линии.",
    metric: "−35% звонков",
  },
  {
    client: "Атлас Логистика",
    industry: "Услуги",
    group: "g4",
    task: "Корпоративный сайт на тридцать страниц без агентства.",
    metric: "9 дней до релиза",
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

/** Отраслевые кейсы: список с бейджами отрасли и CSS-фильтром на radio-чипах. */
export function Case005({
  eyebrow = "Кейсы по отраслям",
  title = "Кому VibeUI уже сэкономил недели",
  allLabel = "Все отрасли",
  items = DEFAULT_ITEMS,
  filterName = "vibeui-case-005-industry",
  background = "",
  accent,
  className,
  style,
}: Case005Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-case-005-accent": accent,
          "--vibeui-case-005-accent-fill": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-case-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const groups: { group: Case005Group; industry: string }[] = []
  for (const item of items) {
    if (!groups.some((entry) => entry.group === item.group)) {
      groups.push({ group: item.group, industry: item.industry })
    }
  }

  return (
    <>
      <style href="vibeui-case-005" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="case-005"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <fieldset data-part="filters">
            <legend data-part="legend">{eyebrow}</legend>
            <input
              data-part="chip-input"
              type="radio"
              name={filterName}
              value="all"
              id={`${filterName}-all`}
              defaultChecked
            />
            <label data-part="chip" htmlFor={`${filterName}-all`}>
              {allLabel}
            </label>
            {groups.map((entry) => (
              <span key={entry.group} data-part="pair">
                <input
                  data-part="chip-input"
                  type="radio"
                  name={filterName}
                  value={entry.group}
                  id={`${filterName}-${entry.group}`}
                />
                <label
                  data-part="chip"
                  htmlFor={`${filterName}-${entry.group}`}
                >
                  {entry.industry}
                </label>
              </span>
            ))}
          </fieldset>
          <ul data-part="list">
            {items.map((item) => (
              <li key={item.client} data-part="row" data-group={item.group}>
                <p data-part="row-head">
                  <span data-part="client">{item.client}</span>
                  <span data-part="badge">{item.industry}</span>
                </p>
                <p data-part="task">{item.task}</p>
                <p data-part="metric">{item.metric}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
