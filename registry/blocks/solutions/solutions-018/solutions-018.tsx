import type { CSSProperties } from "react"

export type Solutions018Absence = {
  kind: "vacation" | "sick" | "remote" | "study"
  from: number
  to: number
  label?: string
}

export type Solutions018Row = {
  name: string
  team: string
  absences: Solutions018Absence[]
}

export type Solutions018Props = {
  title?: string
  month?: string
  daysInMonth?: number
  today?: number
  rows?: Solutions018Row[]
  emptyLabel?: string
  /** Счётчик в шапке: {label}, {present} и {total}. */
  presentText?: string
  /** Подписи легенды: ключи vacation, sick, remote, study. */
  kindText?: Record<string, string>
  /** Буквы на полосе: те же ключи. */
  kindLetterText?: Record<string, string>
  /** Подпись под сеткой: {out} и {total}. */
  footText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: календарь отсутствий. Отпуск занимает диапазон ячеек через
// grid-column, поэтому длина отпуска видна геометрией — списком дат этого не
// получить. Пересечения читаются по вертикали: если полосы двух человек стоят
// друг под другом, отдел остаётся без людей, и это заметно до согласования.
// Сегодняшний день отмечен вертикальной линией через всю сетку: без него
// непонятно, отпуск уже идёт или только запланирован. Тип отсутствия несёт
// букву и штриховку, а не только цвет.
const STYLES = `
:where([data-vibeui-block="solutions-018"]){
--vibeui-solutions-018-bg:transparent;
--vibeui-solutions-018-panel:light-dark(oklch(0.975 0.004 230),oklch(0.28 0.012 240));
--vibeui-solutions-018-fg:light-dark(oklch(0.21 0.014 240),oklch(0.94 0.005 240));
--vibeui-solutions-018-muted:light-dark(oklch(0.55 0.014 240),oklch(0.7 0.012 240));
--vibeui-solutions-018-border:light-dark(oklch(0.91 0.006 240),oklch(0.36 0.012 240));
--vibeui-solutions-018-vacation:light-dark(oklch(0.62 0.15 200),oklch(0.66 0.14 200));
--vibeui-solutions-018-sick:light-dark(oklch(0.62 0.17 30),oklch(0.66 0.16 30));
--vibeui-solutions-018-remote:light-dark(oklch(0.6 0.13 285),oklch(0.64 0.13 285));
--vibeui-solutions-018-study:light-dark(oklch(0.62 0.13 145),oklch(0.66 0.13 145));
--vibeui-solutions-018-accent:light-dark(oklch(0.5 0.17 250),oklch(0.74 0.15 250));
--vibeui-solutions-018-days:31;
--vibeui-solutions-018-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="solutions-018"]{color-scheme:dark}
[data-vibeui-block="solutions-018"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-018-bg);
border:1px solid var(--vibeui-solutions-018-border);border-radius:1rem;
font-family:var(--vibeui-solutions-018-sans);color:var(--vibeui-solutions-018-fg);
}
[data-vibeui-block="solutions-018"] *{box-sizing:border-box}
[data-vibeui-block="solutions-018"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.625rem;
}
[data-vibeui-block="solutions-018"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-018"] [data-part="month"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-018-muted)}
[data-vibeui-block="solutions-018"] [data-part="legend"]{
display:flex;flex-wrap:wrap;gap:0.25rem 0.75rem;margin:0;padding:0 1rem 0.75rem;
font-size:0.6875rem;color:var(--vibeui-solutions-018-muted);
}
[data-vibeui-block="solutions-018"] [data-part="legend"] span{display:inline-flex;align-items:center;gap:0.3125rem}
[data-vibeui-block="solutions-018"] [data-part="chip"]{
width:0.875rem;height:0.875rem;border-radius:0.25rem;display:grid;place-items:center;
font-size:0.5rem;font-weight:700;line-height:1;color:oklch(1 0 0);
}
[data-vibeui-block="solutions-018"] [data-kind="vacation"]{background:var(--vibeui-solutions-018-vacation)}
[data-vibeui-block="solutions-018"] [data-kind="sick"]{background:var(--vibeui-solutions-018-sick)}
[data-vibeui-block="solutions-018"] [data-kind="remote"]{background:var(--vibeui-solutions-018-remote)}
[data-vibeui-block="solutions-018"] [data-kind="study"]{background:var(--vibeui-solutions-018-study)}
[data-vibeui-block="solutions-018"] [data-part="scroll"]{overflow-x:auto;scrollbar-width:thin;padding-bottom:0.75rem}
[data-vibeui-block="solutions-018"] [data-part="grid"]{min-width:46rem;padding:0 1rem}
[data-vibeui-block="solutions-018"] [data-part="ruler"],
[data-vibeui-block="solutions-018"] [data-part="lane"]{
display:grid;grid-template-columns:10rem repeat(var(--vibeui-solutions-018-days),1fr);
align-items:center;gap:0 1px;
}
[data-vibeui-block="solutions-018"] [data-part="ruler"] b{
font-size:0.5625rem;font-weight:500;text-align:center;color:var(--vibeui-solutions-018-muted);
font-variant-numeric:tabular-nums;
}
/* Сегодня — линия через всю сетку: иначе отпуск «идёт» и «будет» неразличимы. */
[data-vibeui-block="solutions-018"] [data-today="true"]{
color:var(--vibeui-solutions-018-accent);font-weight:700;
box-shadow:inset 0 -2px 0 0 var(--vibeui-solutions-018-accent);
}
[data-vibeui-block="solutions-018"] [data-part="lane"]{
min-height:2.125rem;border-top:1px solid var(--vibeui-solutions-018-border);
}
[data-vibeui-block="solutions-018"] [data-part="who"]{
grid-column:1;padding-right:0.75rem;
}
[data-vibeui-block="solutions-018"] [data-part="name"]{display:block;font-size:0.8125rem;font-weight:650;line-height:1.25}
[data-vibeui-block="solutions-018"] [data-part="team"]{display:block;font-size:0.625rem;color:var(--vibeui-solutions-018-muted)}
[data-vibeui-block="solutions-018"] [data-part="cell"]{
grid-row:1;height:1.375rem;border-left:1px solid var(--vibeui-solutions-018-panel);
}
/* Диапазон занимает ячейки гридом: длина отсутствия видна геометрией. */
[data-vibeui-block="solutions-018"] [data-part="bar"]{
grid-row:1;height:1.375rem;border-radius:0.375rem;
display:flex;align-items:center;padding:0 0.375rem;gap:0.25rem;
font-size:0.625rem;font-weight:650;color:oklch(1 0 0);
overflow:hidden;white-space:nowrap;
}
[data-vibeui-block="solutions-018"] [data-bar="vacation"]{background:var(--vibeui-solutions-018-vacation)}
[data-vibeui-block="solutions-018"] [data-bar="sick"]{
background:var(--vibeui-solutions-018-sick);
background-image:repeating-linear-gradient(45deg,oklch(1 0 0 / 25%) 0 3px,transparent 3px 6px);
}
[data-vibeui-block="solutions-018"] [data-bar="remote"]{
background:var(--vibeui-solutions-018-remote);
background-image:repeating-linear-gradient(90deg,oklch(1 0 0 / 30%) 0 1px,transparent 1px 5px);
}
[data-vibeui-block="solutions-018"] [data-bar="study"]{background:var(--vibeui-solutions-018-study)}
[data-vibeui-block="solutions-018"] [data-part="letter"]{
flex:none;font-size:0.5625rem;opacity:0.85;
}
[data-vibeui-block="solutions-018"] [data-part="foot"]{
margin:0;padding:0 1rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-018-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-018"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Solutions018Row[] = [
  {
    name: "Анна Гаврилова",
    team: "поддержка",
    absences: [{ kind: "vacation", from: 4, to: 15, label: "отпуск" }],
  },
  {
    name: "Сергей Тарасов",
    team: "поддержка",
    absences: [
      { kind: "sick", from: 11, to: 14, label: "больничный" },
      { kind: "remote", from: 25, to: 29, label: "удалённо" },
    ],
  },
  {
    name: "Дина Соколова",
    team: "внедрение",
    absences: [{ kind: "study", from: 18, to: 22, label: "учёба" }],
  },
  {
    name: "Игорь Панин",
    team: "внедрение",
    absences: [{ kind: "vacation", from: 12, to: 26, label: "отпуск" }],
  },
  {
    name: "Мария Лунёва",
    team: "продажи",
    absences: [{ kind: "remote", from: 1, to: 8, label: "удалённо" }],
  },
]

const DEFAULT_KIND_LETTER_TEXT: Record<string, string> = {
  vacation: "О",
  sick: "Б",
  remote: "У",
  study: "Ч",
}

const DEFAULT_KIND_TEXT: Record<string, string> = {
  vacation: "отпуск",
  sick: "больничный",
  remote: "удалённо",
  study: "учёба",
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
 * Календарь отсутствий: диапазон занимает ячейки гридом, сегодня — линией.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions018({
  title = "Отпуска и отсутствия",
  month = "Март 2024 · отдел клиентского сервиса",
  daysInMonth = 31,
  today = 14,
  rows = DEFAULT_ROWS,
  emptyLabel = "Сегодня на месте",
  presentText = "{label}: {present} из {total}",
  kindText = DEFAULT_KIND_TEXT,
  kindLetterText = DEFAULT_KIND_LETTER_TEXT,
  footText = "Сегодня отсутствуют {out} из {total} человек. Пересечения видно по вертикали: полосы друг под другом — день без людей.",
  accent,
  background = "",
  className,
  style,
}: Solutions018Props) {
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1)
  const outToday = rows.filter((row) =>
    row.absences.some(
      (absence) => absence.from <= today && absence.to >= today,
    ),
  ).length

  const palette = {
    ...(accent ? { "--vibeui-solutions-018-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-018-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    "--vibeui-solutions-018-days": String(daysInMonth),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-018" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-018"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="month">{month}</p>
          </div>
          <p data-part="month">
            {presentText
              .replace("{label}", emptyLabel)
              .replace("{present}", String(rows.length - outToday))
              .replace("{total}", String(rows.length))}
          </p>
        </header>

        <p data-part="legend">
          {["vacation", "sick", "remote", "study"].map((kind) => (
            <span key={kind}>
              <span data-part="chip" data-kind={kind} aria-hidden="true">
                {kindLetterText[kind] ?? DEFAULT_KIND_LETTER_TEXT[kind]}
              </span>
              {kindText[kind] ?? DEFAULT_KIND_TEXT[kind]}
            </span>
          ))}
        </p>

        <div data-part="scroll">
          <div data-part="grid">
            <div data-part="ruler">
              <span />
              {days.map((day) => (
                <b key={day} data-today={day === today ? "true" : "false"}>
                  {day}
                </b>
              ))}
            </div>

            {rows.map((row) => (
              <div data-part="lane" key={row.name}>
                <span data-part="who">
                  <span data-part="name">{row.name}</span>
                  <span data-part="team">{row.team}</span>
                </span>
                {days.map((day) => (
                  <span
                    data-part="cell"
                    key={day}
                    style={{ gridColumn: day + 1 }}
                  />
                ))}
                {row.absences.map((absence) => (
                  <span
                    data-part="bar"
                    data-bar={absence.kind}
                    key={`${absence.kind}-${absence.from}`}
                    style={{
                      gridColumn: `${absence.from + 1} / ${absence.to + 2}`,
                    }}
                  >
                    <span data-part="letter" aria-hidden="true">
                      {kindLetterText[absence.kind] ??
                        DEFAULT_KIND_LETTER_TEXT[absence.kind]}
                    </span>
                    {absence.label} {absence.from}–{absence.to}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <p data-part="foot">
          {footText
            .replace("{out}", String(outToday))
            .replace("{total}", String(rows.length))}
        </p>
      </section>
    </>
  )
}
