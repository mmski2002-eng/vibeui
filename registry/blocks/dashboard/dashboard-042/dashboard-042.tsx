import type { CSSProperties } from "react"

export type Dashboard042Course = {
  name: string
  topic: string
  done: number
  total: number
  next: string
  due: string
  required?: boolean
}

export type Dashboard042Props = {
  title?: string
  learner?: string
  overallLabel?: string
  courses?: Dashboard042Course[]
  continueLabel?: string
  catalogLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Шаблон счётчика уроков: {done} и {total}. */
  lessonsText?: string
  /** Шаблон подписи общей полосы: {label} и {value}. */
  overallAriaText?: string
  /** Шаблон строки курса: {topic}, {done} и {total}. */
  topicText?: string
  /** Подпись перед следующим уроком. */
  nextLabel?: string
  /** Пометка обязательного курса. */
  requiredLabel?: string
  /** Кнопка на пройденном курсе. */
  certificateLabel?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: страница обучения, где прогресс курса нарисован кольцом на
// conic-gradient с кружком-вырезом поверх — это две коробки вместо SVG и без
// единой зависимости. Внутри кольца стоит доля уроков цифрой: кольцо даёт
// ощущение, дробь — точность, и по отдельности каждая половина врёт. Название
// следующего урока вынесено на карточку, потому что возвращаются в курс не
// «к курсу», а к конкретному месту. Обязательные курсы помечены словом и
// рамкой, срок назван датой рядом с ним.
const STYLES = `
:where([data-vibeui-block="dashboard-042"]){
--vibeui-dashboard-042-bg:transparent;
/* Карточки и жёлоб программы: подложка блока прозрачна, и рисовать их ею нечем. */
--vibeui-dashboard-042-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 300));
--vibeui-dashboard-042-track:light-dark(oklch(0.96 0.005 300),oklch(0.21 0.012 300));
--vibeui-dashboard-042-fg:light-dark(oklch(0.22 0.014 300),oklch(0.94 0.005 300));
--vibeui-dashboard-042-muted:light-dark(oklch(0.55 0.014 300),oklch(0.71 0.012 300));
--vibeui-dashboard-042-border:light-dark(oklch(0.91 0.007 300),oklch(0.36 0.012 300));
--vibeui-dashboard-042-accent:light-dark(oklch(0.55 0.18 300),oklch(0.75 0.15 300));
--vibeui-dashboard-042-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.03 300));
--vibeui-dashboard-042-soft:light-dark(oklch(0.96 0.025 300),oklch(0.32 0.05 300));
--vibeui-dashboard-042-must:light-dark(oklch(0.6 0.16 40),oklch(0.77 0.14 40));
--vibeui-dashboard-042-mustline:light-dark(oklch(0.82 0.08 40),oklch(0.48 0.09 40));
--vibeui-dashboard-042-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-042"]{
box-sizing:border-box;
background:var(--vibeui-dashboard-042-bg);
color:var(--vibeui-dashboard-042-fg);
font-family:var(--vibeui-dashboard-042-sans);
border:1px solid var(--vibeui-dashboard-042-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-042"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-042"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.875rem}
[data-vibeui-block="dashboard-042"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem;
background:var(--vibeui-dashboard-042-card);
border:1px solid var(--vibeui-dashboard-042-border);border-radius:0.875rem;padding:0.875rem;
}
[data-vibeui-block="dashboard-042"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-042"] [data-part="learner"]{
display:block;margin-top:0.1875rem;font-size:0.75rem;color:var(--vibeui-dashboard-042-muted);
}
[data-vibeui-block="dashboard-042"] [data-part="overall"]{
flex:1 1 12rem;min-width:10rem;display:grid;gap:0.3125rem;
}
[data-vibeui-block="dashboard-042"] [data-part="cap"]{
display:flex;justify-content:space-between;gap:0.5rem;
font-size:0.6875rem;font-weight:650;color:var(--vibeui-dashboard-042-muted);
}
[data-vibeui-block="dashboard-042"] [data-part="track"]{
height:0.4375rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-dashboard-042-track);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-042-border);
}
[data-vibeui-block="dashboard-042"] [data-part="fill"]{
display:block;height:100%;border-radius:9999px;background:var(--vibeui-dashboard-042-accent);
}
[data-vibeui-block="dashboard-042"] [data-part="catalog"]{
appearance:none;cursor:pointer;font:inherit;
font-size:0.8125rem;font-weight:650;padding:0.5rem 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-dashboard-042-border);background:var(--vibeui-dashboard-042-card);color:inherit;
}
[data-vibeui-block="dashboard-042"] [data-part="cards"]{display:grid;grid-template-columns:1fr;gap:0.625rem}
[data-vibeui-block="dashboard-042"] article{
display:grid;grid-template-columns:auto 1fr;gap:0.25rem 0.875rem;align-items:center;
padding:0.875rem;
background:var(--vibeui-dashboard-042-card);
border:1px solid var(--vibeui-dashboard-042-border);border-radius:0.875rem;
}
[data-vibeui-block="dashboard-042"] article[data-must="yes"]{
border-color:var(--vibeui-dashboard-042-mustline);
}
/* Кольцо прогресса: conic-gradient + mask вместо SVG и внешней библиотеки. */
[data-vibeui-block="dashboard-042"] [data-part="ring"]{
grid-row:1/4;width:3.5rem;height:3.5rem;border-radius:50%;display:grid;place-items:center;
background:conic-gradient(var(--vibeui-dashboard-042-accent) calc(var(--vibeui-dashboard-042-share) * 1%),var(--vibeui-dashboard-042-soft) 0);
}
[data-vibeui-block="dashboard-042"] [data-part="hole"]{
width:2.625rem;height:2.625rem;border-radius:50%;display:grid;place-items:center;
background:var(--vibeui-dashboard-042-card);
font-size:0.625rem;font-weight:800;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-042"] h3{margin:0;font-size:0.875rem;font-weight:750}
[data-vibeui-block="dashboard-042"] [data-part="topic"]{
font-size:0.6875rem;color:var(--vibeui-dashboard-042-muted);
}
[data-vibeui-block="dashboard-042"] [data-part="must"]{
display:inline-block;margin-left:0.375rem;padding:0.0625rem 0.375rem;border-radius:0.3125rem;
font-size:0.5625rem;font-weight:800;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-dashboard-042-must);border:1px solid currentColor;
}
[data-vibeui-block="dashboard-042"] [data-part="next"]{
margin:0;font-size:0.75rem;line-height:1.45;
}
[data-vibeui-block="dashboard-042"] [data-part="next"] b{font-weight:700}
[data-vibeui-block="dashboard-042"] [data-part="foot"]{
grid-column:2;display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 0.75rem;margin-top:0.25rem;
}
[data-vibeui-block="dashboard-042"] [data-part="due"]{
font-size:0.6875rem;color:var(--vibeui-dashboard-042-muted);
}
[data-vibeui-block="dashboard-042"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;font:inherit;margin-left:auto;
font-size:0.75rem;font-weight:700;padding:0.4375rem 0.8125rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-042-accent);color:var(--vibeui-dashboard-042-on-accent);
}
[data-vibeui-block="dashboard-042"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-042-accent);outline-offset:2px;
}
@container (min-width: 44rem){
[data-vibeui-block="dashboard-042"] [data-part="cards"]{grid-template-columns:repeat(2,1fr)}
}
`

const DEFAULT_COURSES: Dashboard042Course[] = [
  {
    name: "Работа с заявками",
    topic: "Поддержка · 12 уроков",
    done: 9,
    total: 12,
    next: "Урок 10. Эскалация и передача смены",
    due: "срок до 28 марта",
    required: true,
  },
  {
    name: "Основы безопасности данных",
    topic: "Обязательный курс · 8 уроков",
    done: 2,
    total: 8,
    next: "Урок 3. Фишинг и подозрительные письма",
    due: "срок до 31 марта",
    required: true,
  },
  {
    name: "Складской учёт без ошибок",
    topic: "Логистика · 10 уроков",
    done: 10,
    total: 10,
    next: "Курс пройден, доступен сертификат",
    due: "завершён 4 марта",
  },
  {
    name: "Переговоры с поставщиками",
    topic: "Закупки · 6 уроков",
    done: 0,
    total: 6,
    next: "Урок 1. Подготовка к разговору",
    due: "срок не назначен",
  },
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
 * Страница обучения: общий прогресс сверху и карточки курсов с кольцом
 * прогресса, следующим уроком и сроком. Один файл, ноль зависимостей,
 * клиентского JS нет.
 */
export function Dashboard042({
  title = "Моё обучение",
  learner = "Пётр Хромов · отдел поддержки",
  overallLabel = "Программа года",
  courses = DEFAULT_COURSES,
  continueLabel = "Продолжить",
  catalogLabel = "Каталог курсов",
  accent,
  background = "",
  lessonsText = "{done} из {total} уроков",
  overallAriaText = "{label}: {value} процентов",
  topicText = "{topic} · пройдено {done} из {total}",
  nextLabel = "Дальше:",
  requiredLabel = "обязательный",
  certificateLabel = "Сертификат",
  className,
  style,
}: Dashboard042Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-042-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-042-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const done = courses.reduce((sum, course) => sum + course.done, 0)
  const total = courses.reduce((sum, course) => sum + course.total, 0)
  const overall = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <>
      <style href="vibeui-dashboard-042" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-042"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <div>
              <h2>{title}</h2>
              <span data-part="learner">{learner}</span>
            </div>

            <div data-part="overall">
              <span data-part="cap">
                <span>{overallLabel}</span>
                <span>
                  {lessonsText
                    .replace("{done}", String(done))
                    .replace("{total}", String(total))}
                </span>
              </span>
              <div
                data-part="track"
                role="progressbar"
                aria-valuenow={overall}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={overallAriaText
                  .replace("{label}", overallLabel)
                  .replace("{value}", String(overall))}
              >
                <span data-part="fill" style={{ width: `${overall}%` }} />
              </div>
            </div>

            <button type="button" data-part="catalog">
              {catalogLabel}
            </button>
          </div>

          <div data-part="cards">
            {courses.map((course) => {
              const share = Math.round((course.done / course.total) * 100)

              return (
                <article
                  key={course.name}
                  data-must={course.required ? "yes" : "no"}
                >
                  <span
                    data-part="ring"
                    style={
                      {
                        "--vibeui-dashboard-042-share": share,
                      } as CSSProperties
                    }
                    aria-hidden="true"
                  >
                    <span data-part="hole">{share} %</span>
                  </span>

                  <h3>
                    {course.name}
                    {course.required ? (
                      <span data-part="must">{requiredLabel}</span>
                    ) : null}
                  </h3>
                  <span data-part="topic">
                    {topicText
                      .replace("{topic}", course.topic)
                      .replace("{done}", String(course.done))
                      .replace("{total}", String(course.total))}
                  </span>
                  <p data-part="next">
                    {nextLabel} <b>{course.next}</b>
                  </p>

                  <div data-part="foot">
                    <span data-part="due">{course.due}</span>
                    <button type="button" data-part="go">
                      {course.done === course.total
                        ? certificateLabel
                        : continueLabel}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
