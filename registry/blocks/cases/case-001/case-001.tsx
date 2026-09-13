import type { CSSProperties } from "react"

type Case001Item = {
  client: string
  task: string
  metric: string
  metricLabel: string
}

export type Case001Props = {
  eyebrow?: string
  title?: string
  items?: Case001Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Ровная сетка кейсов: клиент, задача одной строкой и крупная метрика
// результата акцентным цветом. Метрика — главный элемент карточки: кейс
// читают ради цифры, а не ради описания. Задача намеренно одна строка —
// длинный пересказ проекта живёт на отдельной странице, не в сетке.
const STYLES = `
:where([data-vibeui-block="case-001"]){
--vibeui-case-001-bg:transparent;
--vibeui-case-001-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-case-001-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-case-001-muted:light-dark(oklch(0.46 0 0),oklch(0.71 0 0));
--vibeui-case-001-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-case-001-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-case-001-shadow:light-dark(oklch(0.2 0 0 / 60%),oklch(0.05 0 0 / 85%));
--vibeui-case-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-case-001-dur-2:180ms;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="case-001"]{color-scheme:dark}
[data-vibeui-block="case-001"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-case-001-bg);color:var(--vibeui-case-001-ink);
font-family:var(--vibeui-case-001-font);
}
[data-vibeui-block="case-001"] [data-part="shell"]{
max-width:76rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="case-001"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-case-001-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="case-001"] [data-part="title"]{
margin:0 0 2rem;max-width:22ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="case-001"] [data-part="grid"]{
display:grid;gap:1rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="case-001"] [data-part="card"]{min-inline-size:0;display:grid}
[data-vibeui-block="case-001"] [data-part="case"]{
display:flex;flex-direction:column;gap:0.875rem;height:100%;
padding:1.5rem;border:1px solid var(--vibeui-case-001-border);border-radius:1.125rem;
background:var(--vibeui-case-001-card);
transition:border-color var(--vibeui-case-001-dur-2) ease,transform var(--vibeui-case-001-dur-2) ease,box-shadow var(--vibeui-case-001-dur-2) ease;
}
[data-vibeui-block="case-001"] [data-part="case"]:hover{
border-color:color-mix(in oklab,var(--vibeui-case-001-accent) 45%,var(--vibeui-case-001-border));
transform:translateY(-2px);
box-shadow:0 22px 44px -36px var(--vibeui-case-001-shadow);
}
[data-vibeui-block="case-001"] [data-part="client"]{
align-self:flex-start;
padding:0.25rem 0.625rem;border-radius:999px;
background:color-mix(in oklab,var(--vibeui-case-001-accent) 10%,var(--vibeui-case-001-card));
color:var(--vibeui-case-001-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="case-001"] [data-part="task"]{
margin:0;flex:1 1 auto;
font-size:0.9375rem;line-height:1.55;
}
[data-vibeui-block="case-001"] [data-part="result"]{
margin:0;padding-top:1rem;border-top:1px solid var(--vibeui-case-001-border);
}
[data-vibeui-block="case-001"] [data-part="metric"]{
display:block;color:var(--vibeui-case-001-accent);
font-size:clamp(1.875rem,7cqi,2.375rem);line-height:1;letter-spacing:-0.03em;font-weight:750;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="case-001"] [data-part="metric-label"]{
display:block;margin-top:0.375rem;color:var(--vibeui-case-001-muted);
font-size:0.8125rem;line-height:1.4;
}
@container (min-width: 40rem){
[data-vibeui-block="case-001"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="case-001"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem}
}
@container (min-width: 64rem){
[data-vibeui-block="case-001"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="case-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Case001Item[] = [
  {
    client: "Кедр Маркет",
    task: "Переехали с конструктора на собственный сайт, не нанимая фронтендера.",
    metric: "−82%",
    metricLabel: "времени на вёрстку страницы",
  },
  {
    client: "Финпилот",
    task: "Собрали лендинг тарифов с калькулятором за один спринт.",
    metric: "×3",
    metricLabel: "быстрее запуск новых страниц",
  },
  {
    client: "Курс.Лаб",
    task: "Методисты сами запустили посадочные под каждый курс.",
    metric: "12",
    metricLabel: "лендингов за первый месяц",
  },
  {
    client: "Атлас Логистика",
    task: "Обновили корпоративный сайт, не останавливая продажи.",
    metric: "9 дней",
    metricLabel: "от макета до релиза",
  },
  {
    client: "Ботаника",
    task: "Витрину магазина растений собрали вдвоём с основателем.",
    metric: "+47%",
    metricLabel: "к конверсии в заказ",
  },
  {
    client: "Вектор Страхование",
    task: "Свели десять продуктовых страниц к единой дизайн-системе.",
    metric: "−60%",
    metricLabel: "стоимости поддержки сайта",
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

/** Сетка кейсов: клиент, задача одной строкой и крупная метрика результата. */
export function Case001({
  eyebrow = "Кейсы",
  title = "Что команды собрали на VibeUI",
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: Case001Props) {
  const palette = {
    ...(accent ? { "--vibeui-case-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-case-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-case-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="case-001"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <ul data-part="grid">
            {items.map((item) => (
              <li key={item.client} data-part="card">
                <article data-part="case">
                  <span data-part="client">{item.client}</span>
                  <p data-part="task">{item.task}</p>
                  <p data-part="result">
                    <span data-part="metric">{item.metric}</span>
                    <span data-part="metric-label">{item.metricLabel}</span>
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
