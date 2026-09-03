import type { CSSProperties } from "react"

export type Solutions016Shift = "morning" | "evening" | "night" | "off" | "sick"

export type Solutions016Person = {
  name: string
  role: string
  week: Solutions016Shift[]
  hours: number
}

export type Solutions016Props = {
  title?: string
  week?: string
  days?: string[]
  people?: Solutions016Person[]
  normHours?: number
  /** Буква смены: ключи morning, evening, night, off, sick. */
  shiftLetterText?: Record<string, string>
  /** Время смены в клетке: те же ключи. */
  shiftTimeText?: Record<string, string>
  /** Подписи легенды: ключи morning, evening, night, sick. */
  legendText?: Record<string, string>
  /** Шапка таблицы: ключи person, hours, coverage. */
  columnText?: Record<string, string>
  /** Норма недели в шапке, {hours} — число часов. */
  normText?: string
  /** Часы в ячейке, {hours} — число часов. */
  hoursText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: график смен на неделю. Матрица «человек × день» показывает
// пересменки и дыры в покрытии сразу, чего список смен по дням не даёт.
// Смена подписана буквой и временем, а не только цветом: ночная и вечерняя
// различаются на печати и при дальтонизме. Первая колонка липкая, а таблица
// прокручивается — сжимать семь дней в ширину телефона значит потерять время
// смены. Внизу строка покрытия: сколько человек выходит в каждый день, потому
// что дыру в четверге по клеткам глазами не сосчитать.
const STYLES = `
:where([data-vibeui-block="solutions-016"]){
--vibeui-solutions-016-bg:transparent;
/* Липкая колонка обязана быть непрозрачной: сквозь неё уезжали бы клетки. */
--vibeui-solutions-016-sticky:light-dark(oklch(1 0 0),oklch(0.18 0.012 280));
--vibeui-solutions-016-panel:light-dark(oklch(0.975 0.004 280),oklch(0.26 0.012 280));
--vibeui-solutions-016-fg:light-dark(oklch(0.21 0.014 280),oklch(0.94 0.005 280));
--vibeui-solutions-016-muted:light-dark(oklch(0.54 0.014 280),oklch(0.7 0.012 280));
--vibeui-solutions-016-border:light-dark(oklch(0.9 0.006 280),oklch(0.36 0.012 280));
--vibeui-solutions-016-morning:light-dark(oklch(0.62 0.14 200),oklch(0.68 0.13 200));
--vibeui-solutions-016-evening:light-dark(oklch(0.62 0.15 300),oklch(0.66 0.14 300));
--vibeui-solutions-016-night:light-dark(oklch(0.42 0.1 275),oklch(0.55 0.12 275));
--vibeui-solutions-016-sick:light-dark(oklch(0.62 0.17 35),oklch(0.7 0.16 35));
--vibeui-solutions-016-accent:light-dark(oklch(0.5 0.17 280),oklch(0.72 0.16 280));
--vibeui-solutions-016-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="solutions-016"]{color-scheme:dark}
[data-vibeui-block="solutions-016"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-016-bg);
border:1px solid var(--vibeui-solutions-016-border);border-radius:1rem;
font-family:var(--vibeui-solutions-016-sans);color:var(--vibeui-solutions-016-fg);
}
[data-vibeui-block="solutions-016"] *{box-sizing:border-box}
[data-vibeui-block="solutions-016"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.625rem;
}
[data-vibeui-block="solutions-016"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-016"] [data-part="week"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-016-muted)}
[data-vibeui-block="solutions-016"] [data-part="legend"]{
display:flex;flex-wrap:wrap;gap:0.25rem 0.75rem;margin:0;padding:0 1rem 0.625rem;
font-size:0.6875rem;color:var(--vibeui-solutions-016-muted);
}
[data-vibeui-block="solutions-016"] [data-part="legend"] span{display:inline-flex;align-items:center;gap:0.3125rem}
[data-vibeui-block="solutions-016"] [data-part="chip"]{
width:0.875rem;height:0.875rem;border-radius:0.25rem;display:grid;place-items:center;
font-size:0.5rem;font-weight:700;color:oklch(1 0 0);line-height:1;
}
[data-vibeui-block="solutions-016"] [data-shift="morning"]{background:var(--vibeui-solutions-016-morning)}
[data-vibeui-block="solutions-016"] [data-shift="evening"]{background:var(--vibeui-solutions-016-evening)}
[data-vibeui-block="solutions-016"] [data-shift="night"]{background:var(--vibeui-solutions-016-night)}
[data-vibeui-block="solutions-016"] [data-shift="sick"]{background:var(--vibeui-solutions-016-sick)}
[data-vibeui-block="solutions-016"] [data-part="scroll"]{overflow-x:auto;scrollbar-width:thin}
[data-vibeui-block="solutions-016"] table{
width:100%;min-width:44rem;border-collapse:separate;border-spacing:0;font-size:0.75rem;
}
[data-vibeui-block="solutions-016"] th,
[data-vibeui-block="solutions-016"] td{
padding:0.375rem 0.3125rem;text-align:center;border-top:1px solid var(--vibeui-solutions-016-border);
}
/* Липкая первая колонка: без неё при прокрутке непонятно, чья это строка. */
[data-vibeui-block="solutions-016"] [data-part="who"]{
position:sticky;left:0;z-index:1;text-align:left;min-width:11rem;padding-left:1rem;
background:var(--vibeui-solutions-016-sticky);
}
[data-vibeui-block="solutions-016"] thead [data-part="who"]{background:var(--vibeui-solutions-016-panel)}
[data-vibeui-block="solutions-016"] thead th{
font-size:0.625rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-016-muted);background:var(--vibeui-solutions-016-panel);border-top:0;
}
[data-vibeui-block="solutions-016"] [data-part="name"]{display:block;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="solutions-016"] [data-part="role"]{
display:block;font-size:0.6875rem;font-weight:400;color:var(--vibeui-solutions-016-muted);
}
/* Смена подписана буквой и временем, а не только цветом. */
[data-vibeui-block="solutions-016"] [data-part="cell"]{
display:block;padding:0.25rem 0.125rem;border-radius:0.4375rem;
font-size:0.6875rem;font-weight:650;line-height:1.25;color:oklch(1 0 0);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-016"] [data-cell="morning"]{background:var(--vibeui-solutions-016-morning)}
[data-vibeui-block="solutions-016"] [data-cell="evening"]{background:var(--vibeui-solutions-016-evening)}
[data-vibeui-block="solutions-016"] [data-cell="night"]{background:var(--vibeui-solutions-016-night)}
[data-vibeui-block="solutions-016"] [data-cell="sick"]{
background:var(--vibeui-solutions-016-sick);
background-image:repeating-linear-gradient(45deg,oklch(1 0 0 / 25%) 0 3px,transparent 3px 6px);
}
[data-vibeui-block="solutions-016"] [data-cell="off"]{
background:var(--vibeui-solutions-016-panel);color:var(--vibeui-solutions-016-muted);font-weight:500;
}
[data-vibeui-block="solutions-016"] [data-part="hours"]{
font-weight:700;font-variant-numeric:tabular-nums;text-align:right;padding-right:1rem;
}
[data-vibeui-block="solutions-016"] [data-under="true"]{color:var(--vibeui-solutions-016-sick)}
/* Строка покрытия: дыру в четверге по клеткам глазами не сосчитать. */
[data-vibeui-block="solutions-016"] tfoot td{
background:var(--vibeui-solutions-016-panel);font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-016"] tfoot [data-part="who"]{
background:var(--vibeui-solutions-016-panel);font-size:0.6875rem;color:var(--vibeui-solutions-016-muted);
text-transform:uppercase;letter-spacing:0.04em;
}
[data-vibeui-block="solutions-016"] [data-thin="true"]{color:var(--vibeui-solutions-016-sick)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_DAYS = [
  "Пн 11",
  "Вт 12",
  "Ср 13",
  "Чт 14",
  "Пт 15",
  "Сб 16",
  "Вс 17",
]

const DEFAULT_PEOPLE: Solutions016Person[] = [
  {
    name: "Анна Гаврилова",
    role: "старший смены",
    week: ["morning", "morning", "off", "evening", "evening", "off", "off"],
    hours: 32,
  },
  {
    name: "Сергей Тарасов",
    role: "оператор",
    week: ["evening", "evening", "evening", "off", "off", "morning", "morning"],
    hours: 40,
  },
  {
    name: "Дина Соколова",
    role: "оператор",
    week: ["night", "night", "off", "off", "night", "night", "off"],
    hours: 44,
  },
  {
    name: "Игорь Панин",
    role: "приёмка",
    week: ["off", "morning", "morning", "sick", "sick", "off", "evening"],
    hours: 24,
  },
  {
    name: "Мария Лунёва",
    role: "стажёр",
    week: ["off", "off", "morning", "off", "morning", "morning", "off"],
    hours: 18,
  },
]

const DEFAULT_SHIFT_LETTER_TEXT: Record<string, string> = {
  morning: "У",
  evening: "В",
  night: "Н",
  off: "—",
  sick: "Б",
}

const DEFAULT_SHIFT_TIME_TEXT: Record<string, string> = {
  morning: "07–15",
  evening: "15–23",
  night: "23–07",
  off: "выходной",
  sick: "больничный",
}

const DEFAULT_LEGEND_TEXT: Record<string, string> = {
  morning: "утро 07–15",
  evening: "вечер 15–23",
  night: "ночь 23–07",
  sick: "больничный",
}

const DEFAULT_COLUMN_TEXT: Record<string, string> = {
  person: "Сотрудник",
  hours: "Часы",
  coverage: "На смене",
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

/**
 * График смен на неделю: матрица «человек × день» и строка покрытия внизу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions016({
  title = "График смен",
  week = "11–17 марта · участок упаковки",
  days = DEFAULT_DAYS,
  people = DEFAULT_PEOPLE,
  normHours = 40,
  shiftLetterText = DEFAULT_SHIFT_LETTER_TEXT,
  shiftTimeText = DEFAULT_SHIFT_TIME_TEXT,
  legendText = DEFAULT_LEGEND_TEXT,
  columnText = DEFAULT_COLUMN_TEXT,
  normText = "Норма недели — {hours} ч",
  hoursText = "{hours} ч",
  accent,
  background = "",
  className,
  style,
}: Solutions016Props) {
  const coverage = days.map(
    (_, index) =>
      people.filter(
        (person) =>
          person.week[index] !== "off" && person.week[index] !== "sick",
      ).length,
  )

  const palette = {
    ...(accent ? { "--vibeui-solutions-016-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-016-bg": background,
          "--vibeui-solutions-016-sticky": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-016" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-016"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="week">{week}</p>
          </div>
          <p data-part="week">
            {normText.replace("{hours}", String(normHours))}
          </p>
        </header>

        <p data-part="legend">
          {["morning", "evening", "night", "sick"].map((shift) => (
            <span key={shift}>
              <span data-part="chip" data-shift={shift} aria-hidden="true">
                {shiftLetterText[shift] ?? DEFAULT_SHIFT_LETTER_TEXT[shift]}
              </span>
              {legendText[shift] ?? DEFAULT_LEGEND_TEXT[shift]}
            </span>
          ))}
        </p>

        <div data-part="scroll">
          <table>
            <thead>
              <tr>
                <th scope="col" data-part="who">
                  {columnText.person ?? DEFAULT_COLUMN_TEXT.person}
                </th>
                {days.map((day) => (
                  <th scope="col" key={day}>
                    {day}
                  </th>
                ))}
                <th scope="col" data-part="hours">
                  {columnText.hours ?? DEFAULT_COLUMN_TEXT.hours}
                </th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={person.name}>
                  <th scope="row" data-part="who">
                    <span data-part="name">{person.name}</span>
                    <span data-part="role">{person.role}</span>
                  </th>
                  {person.week.map((shift, index) => (
                    <td key={days[index]}>
                      <span data-part="cell" data-cell={shift}>
                        {shiftLetterText[shift] ??
                          DEFAULT_SHIFT_LETTER_TEXT[shift]}
                        <br />
                        {shiftTimeText[shift] ?? DEFAULT_SHIFT_TIME_TEXT[shift]}
                      </span>
                    </td>
                  ))}
                  <td
                    data-part="hours"
                    data-under={person.hours < normHours ? "true" : "false"}
                  >
                    {hoursText.replace("{hours}", String(person.hours))}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" data-part="who">
                  {columnText.coverage ?? DEFAULT_COLUMN_TEXT.coverage}
                </th>
                {coverage.map((count, index) => (
                  <td
                    key={days[index]}
                    data-thin={count < 2 ? "true" : "false"}
                  >
                    {count}
                  </td>
                ))}
                <td data-part="hours">
                  {hoursText.replace(
                    "{hours}",
                    String(
                      people.reduce((sum, person) => sum + person.hours, 0),
                    ),
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </>
  )
}
