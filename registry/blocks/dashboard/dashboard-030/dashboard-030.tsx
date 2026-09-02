import type { CSSProperties } from "react"

export type Dashboard030Item = {
  time: string
  title: string
  place?: string
  kind?: "meeting" | "focus" | "release"
  done?: boolean
}

export type Dashboard030Day = {
  name: string
  date: string
  today?: boolean
  free?: boolean
  items: Dashboard030Item[]
}

export type Dashboard030Props = {
  title?: string
  week?: string
  days?: Dashboard030Day[]
  prevLabel?: string
  nextLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Шаблон счётчика дел: {count}. */
  loadText?: string
  /** Подпись свободного дня. */
  freeText?: string
  /** Подпись дня без назначенных дел. */
  emptyText?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: неделя как список дел по дням, а не как сетка часов. Сетка
// врёт, когда встречи стоят с 10 до 18 и половина дня пустая: колонка
// выглядит забитой. Здесь день — карточка со списком, и загрузка видна по
// счётчику и высоте, а не по геометрии часов. Сегодняшний день помечен
// рамкой, подписью и порядком: карточка остаётся на своём месте, но её
// нельзя спутать. Свободный день говорит об этом словами, а не пустотой.
const STYLES = `
:where([data-vibeui-block="dashboard-030"]){
--vibeui-dashboard-030-bg:transparent;
--vibeui-dashboard-030-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 265));
/* Плашка дела внутри карточки дня: подложка блока бывает прозрачной, и
   заливать ею дело нельзя. */
--vibeui-dashboard-030-tile:light-dark(oklch(0.975 0.003 265),oklch(0.32 0.012 265));
--vibeui-dashboard-030-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-dashboard-030-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-dashboard-030-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.011 265));
--vibeui-dashboard-030-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-dashboard-030-focus:light-dark(oklch(0.6 0.14 152),oklch(0.76 0.14 152));
--vibeui-dashboard-030-release:light-dark(oklch(0.62 0.16 300),oklch(0.78 0.14 300));
--vibeui-dashboard-030-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-030"]{
box-sizing:border-box;
background:var(--vibeui-dashboard-030-bg);
color:var(--vibeui-dashboard-030-fg);
font-family:var(--vibeui-dashboard-030-sans);
border:1px solid var(--vibeui-dashboard-030-border);border-radius:1rem;
}
[data-vibeui-block="dashboard-030"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-030"] [data-part="shell"]{padding:1.125rem}
[data-vibeui-block="dashboard-030"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;margin-bottom:0.875rem;
}
[data-vibeui-block="dashboard-030"] h2{margin:0;font-size:1.0625rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-030"] [data-part="week"]{
margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-030-muted);
}
[data-vibeui-block="dashboard-030"] [data-part="nav"]{display:flex;gap:0.375rem;margin-left:auto}
[data-vibeui-block="dashboard-030"] [data-part="nav"] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:650;
padding:0.3125rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-030-border);
background:var(--vibeui-dashboard-030-card);color:inherit;
}
[data-vibeui-block="dashboard-030"] [data-part="nav"] button:focus-visible{
outline:2px solid var(--vibeui-dashboard-030-accent);outline-offset:2px;
}
[data-vibeui-block="dashboard-030"] [data-part="week-grid"]{
display:grid;grid-template-columns:1fr;gap:0.625rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="dashboard-030"] [data-part="day"]{
display:flex;flex-direction:column;
background:var(--vibeui-dashboard-030-card);
border:1px solid var(--vibeui-dashboard-030-border);border-radius:0.875rem;
padding:0.625rem;
}
[data-vibeui-block="dashboard-030"] [data-today="true"]{
border-color:var(--vibeui-dashboard-030-accent);
box-shadow:0 0 0 1px var(--vibeui-dashboard-030-accent);
}
[data-vibeui-block="dashboard-030"] [data-part="dayhead"]{
display:flex;align-items:baseline;gap:0.375rem;padding-bottom:0.4375rem;margin-bottom:0.4375rem;
border-bottom:1px solid var(--vibeui-dashboard-030-border);
}
[data-vibeui-block="dashboard-030"] h3{
margin:0;font-size:0.75rem;font-weight:700;letter-spacing:0.02em;text-transform:uppercase;
}
[data-vibeui-block="dashboard-030"] [data-part="date"]{
font-size:0.6875rem;color:var(--vibeui-dashboard-030-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-030"] [data-part="load"]{
margin-left:auto;font-size:0.625rem;font-weight:650;
color:var(--vibeui-dashboard-030-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-030"] [data-today="true"] [data-part="load"]{color:var(--vibeui-dashboard-030-accent)}
[data-vibeui-block="dashboard-030"] ul[data-part="items"]{
margin:0;padding:0;list-style:none;display:grid;gap:0.375rem;
}
[data-vibeui-block="dashboard-030"] [data-part="item"]{
display:grid;grid-template-columns:auto 1fr;gap:0.125rem 0.4375rem;
padding:0.375rem 0.4375rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-030-tile);
border-left:3px solid var(--vibeui-dashboard-030-accent);
}
[data-vibeui-block="dashboard-030"] [data-kind="focus"]{border-left-color:var(--vibeui-dashboard-030-focus)}
[data-vibeui-block="dashboard-030"] [data-kind="release"]{border-left-color:var(--vibeui-dashboard-030-release)}
[data-vibeui-block="dashboard-030"] [data-part="time"]{
grid-row:span 2;align-self:start;
font-size:0.625rem;font-weight:700;color:var(--vibeui-dashboard-030-muted);
font-variant-numeric:tabular-nums;white-space:nowrap;
}
[data-vibeui-block="dashboard-030"] [data-part="what"]{margin:0;font-size:0.75rem;font-weight:600;line-height:1.35}
[data-vibeui-block="dashboard-030"] [data-done="true"] [data-part="what"]{
text-decoration:line-through;color:var(--vibeui-dashboard-030-muted);
}
[data-vibeui-block="dashboard-030"] [data-part="place"]{
margin:0;font-size:0.625rem;color:var(--vibeui-dashboard-030-muted);
}
[data-vibeui-block="dashboard-030"] [data-part="free"]{
margin:auto 0;padding:0.75rem 0.25rem;text-align:center;
font-size:0.6875rem;color:var(--vibeui-dashboard-030-muted);
}
@container (min-width: 34rem){
[data-vibeui-block="dashboard-030"] [data-part="week-grid"]{grid-template-columns:repeat(2,1fr)}
[data-vibeui-block="dashboard-030"] [data-part="shell"]{padding:1.375rem}
}
@container (min-width: 52rem){
[data-vibeui-block="dashboard-030"] [data-part="week-grid"]{grid-template-columns:repeat(4,1fr)}
}
@container (min-width: 72rem){
[data-vibeui-block="dashboard-030"] [data-part="week-grid"]{grid-template-columns:repeat(7,1fr)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-030"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_DAYS: Dashboard030Day[] = [
  {
    name: "Пн",
    date: "9 марта",
    items: [
      { time: "10:00", title: "Планирование спринта", place: "Переговорка 2" },
      { time: "14:00", title: "Разбор метрик каталога", kind: "focus" },
    ],
  },
  {
    name: "Вт",
    date: "10 марта",
    today: true,
    items: [
      {
        time: "09:30",
        title: "Стендап команды",
        place: "Видеозвонок",
        done: true,
      },
      { time: "11:00", title: "Правки блоков dashboard", kind: "focus" },
      {
        time: "16:00",
        title: "Созвон с магазином мебели",
        place: "Видеозвонок",
      },
    ],
  },
  {
    name: "Ср",
    date: "11 марта",
    items: [
      { time: "12:00", title: "Ревью переводов", kind: "focus" },
      { time: "18:00", title: "Выкладка 1.4 на прод", kind: "release" },
    ],
  },
  {
    name: "Чт",
    date: "12 марта",
    items: [{ time: "15:00", title: "Интервью на роль дизайнера" }],
  },
  { name: "Пт", date: "13 марта", free: true, items: [] },
  {
    name: "Сб",
    date: "14 марта",
    items: [{ time: "весь день", title: "Дежурство по поддержке" }],
  },
  { name: "Вс", date: "15 марта", free: true, items: [] },
]

/**
 * Ветка темы для заданного фона: светлая подложка не должна доставаться
 * тексту тёмной ветки light-dark().
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

/**
 * Неделя как семь карточек-дней со списком дел, счётчиком загрузки и явной
 * подписью свободного дня. Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard030({
  title = "Неделя",
  week = "9–15 марта",
  days = DEFAULT_DAYS,
  prevLabel = "Прошлая",
  nextLabel = "Следующая",
  accent,
  background = "",
  loadText = "{count} дел",
  freeText = "Свободно",
  emptyText = "Ничего не назначено",
  className,
  style,
}: Dashboard030Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-030-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-030-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-030" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-030"
        className={className}
        style={palette}
        aria-label={`${title}: ${week}`}
      >
        <div data-part="shell">
          <header data-part="head">
            <h2>{title}</h2>
            <p data-part="week">{week}</p>
            <div data-part="nav">
              <button type="button">{prevLabel}</button>
              <button type="button">{nextLabel}</button>
            </div>
          </header>

          <ol data-part="week-grid">
            {days.map((day) => (
              <li
                key={day.date}
                data-part="day"
                data-today={day.today ? "true" : "false"}
                aria-current={day.today ? "date" : undefined}
              >
                <div data-part="dayhead">
                  <h3>{day.name}</h3>
                  <span data-part="date">{day.date}</span>
                  <span data-part="load">
                    {day.items.length === 0
                      ? "—"
                      : loadText.replace("{count}", String(day.items.length))}
                  </span>
                </div>
                {day.items.length === 0 ? (
                  <p data-part="free">{day.free ? freeText : emptyText}</p>
                ) : (
                  <ul data-part="items">
                    {day.items.map((item) => (
                      <li
                        key={`${day.date}-${item.time}-${item.title}`}
                        data-part="item"
                        data-kind={item.kind ?? "meeting"}
                        data-done={item.done ? "true" : "false"}
                      >
                        <span data-part="time">{item.time}</span>
                        <p data-part="what">{item.title}</p>
                        {item.place ? (
                          <p data-part="place">{item.place}</p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
