import type { CSSProperties } from "react"

type Case004Item = {
  client: string
  task: string
  metric: string
  metricLabel: string
}

export type Case004Props = {
  eyebrow?: string
  title?: string
  hint?: string
  items?: Case004Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Кейсы горизонтальной лентой на scroll-snap: карточки фиксированной ширины,
// прокрутка колесом, пальцем или клавиатурой — без единой строки JS.
// Карусель честная: подсказка «листайте» и обрезанная последняя карточка
// сразу говорят, что справа есть ещё. Снап по левому краю держит ритм ленты.
const STYLES = `
:where([data-vibeui-block="case-004"]){
--vibeui-case-004-bg:transparent;
--vibeui-case-004-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-case-004-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-case-004-muted:light-dark(oklch(0.46 0 0),oklch(0.71 0 0));
--vibeui-case-004-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-case-004-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-case-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="case-004"]{color-scheme:dark}
[data-vibeui-block="case-004"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-case-004-bg);color:var(--vibeui-case-004-ink);
font-family:var(--vibeui-case-004-font);
}
[data-vibeui-block="case-004"] [data-part="shell"]{
max-width:76rem;margin:0 auto;padding:3rem 0 3rem 1.25rem;
}
[data-vibeui-block="case-004"] [data-part="head"]{
display:flex;align-items:flex-end;justify-content:space-between;gap:1rem;
margin-bottom:1.75rem;padding-right:1.25rem;
}
[data-vibeui-block="case-004"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-case-004-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="case-004"] [data-part="title"]{
margin:0;max-width:22ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="case-004"] [data-part="hint"]{
flex:none;display:inline-flex;align-items:center;gap:0.375rem;
color:var(--vibeui-case-004-muted);font-size:0.8125rem;font-weight:600;white-space:nowrap;
}
[data-vibeui-block="case-004"] [data-part="hint"] svg{color:var(--vibeui-case-004-accent)}
[data-vibeui-block="case-004"] [data-part="track"]{
display:flex;gap:1rem;margin:0;padding:0.25rem 1.25rem 1rem 0;list-style:none;
overflow-x:auto;overscroll-behavior-x:contain;
scroll-snap-type:x mandatory;scroll-padding-left:0.25rem;
scrollbar-width:thin;
scrollbar-color:color-mix(in oklab,var(--vibeui-case-004-accent) 55%,transparent) transparent;
}
[data-vibeui-block="case-004"] [data-part="track"]:focus-visible{
outline:2px solid var(--vibeui-case-004-accent);outline-offset:3px;border-radius:0.5rem;
}
[data-vibeui-block="case-004"] [data-part="card"]{
flex:none;inline-size:min(82cqi,20rem);scroll-snap-align:start;
display:flex;flex-direction:column;gap:0.875rem;
padding:1.5rem;border:1px solid var(--vibeui-case-004-border);border-radius:1.125rem;
background:var(--vibeui-case-004-card);
}
[data-vibeui-block="case-004"] [data-part="client"]{
align-self:flex-start;
padding:0.25rem 0.625rem;border-radius:999px;
background:color-mix(in oklab,var(--vibeui-case-004-accent) 10%,var(--vibeui-case-004-card));
color:var(--vibeui-case-004-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="case-004"] [data-part="task"]{
margin:0;flex:1 1 auto;font-size:0.9375rem;line-height:1.55;
}
[data-vibeui-block="case-004"] [data-part="result"]{
margin:0;padding-top:1rem;border-top:1px solid var(--vibeui-case-004-border);
}
[data-vibeui-block="case-004"] [data-part="metric"]{
display:block;color:var(--vibeui-case-004-accent);
font-size:1.75rem;line-height:1;letter-spacing:-0.03em;font-weight:750;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="case-004"] [data-part="metric-label"]{
display:block;margin-top:0.375rem;color:var(--vibeui-case-004-muted);
font-size:0.8125rem;line-height:1.4;
}
@container (min-width: 40rem){
[data-vibeui-block="case-004"] [data-part="shell"]{padding:4.5rem 0 4.5rem 2rem}
[data-vibeui-block="case-004"] [data-part="head"]{padding-right:2rem}
[data-vibeui-block="case-004"] [data-part="track"]{padding-right:2rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="case-004"] *{animation:none!important;transition:none!important}
[data-vibeui-block="case-004"] [data-part="track"]{scroll-behavior:auto}
}
`

const DEFAULT_ITEMS: Case004Item[] = [
  {
    client: "Атлас Логистика",
    task: "Корпоративный сайт на тридцать страниц собрали без агентства.",
    metric: "9 дней",
    metricLabel: "от макета до релиза",
  },
  {
    client: "Ботаника",
    task: "Витрину магазина растений основатель собрал сам по вечерам.",
    metric: "+47%",
    metricLabel: "к заказам за квартал",
  },
  {
    client: "Полярис",
    task: "Сайт продукта к инвестиционному раунду силами двух человек.",
    metric: "6 дней",
    metricLabel: "от идеи до релиза",
  },
  {
    client: "Тёплый Дом",
    task: "Лендинг застройщика с подбором квартир вместо PDF-каталога.",
    metric: "×2",
    metricLabel: "к звонкам в отдел продаж",
  },
  {
    client: "Медпункт+",
    task: "Онлайн-запись в клинику вместо очереди на телефонной линии.",
    metric: "−35%",
    metricLabel: "нагрузки на колл-центр",
  },
  {
    client: "Шкатулка",
    task: "Переехали с конструктора на собственный код без переплат.",
    metric: "0 ₽",
    metricLabel: "ежемесячных подписок",
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

/** Кейсы горизонтальной лентой: scroll-snap карточки с подсказкой прокрутки. */
export function Case004({
  eyebrow = "Кейсы",
  title = "Проекты, собранные на VibeUI",
  hint = "Листайте",
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: Case004Props) {
  const palette = {
    ...(accent ? { "--vibeui-case-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-case-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-case-004" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="case-004" className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              <p data-part="eyebrow">{eyebrow}</p>
              <h2 data-part="title">{title}</h2>
            </div>
            <p data-part="hint" aria-hidden="true">
              {hint}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </p>
          </div>
          <ul
            data-part="track"
            tabIndex={0}
            role="region"
            aria-label={`${title}: лента прокручивается горизонтально`}
          >
            {items.map((item) => (
              <li key={item.client} data-part="card">
                <span data-part="client">{item.client}</span>
                <p data-part="task">{item.task}</p>
                <p data-part="result">
                  <span data-part="metric">{item.metric}</span>
                  <span data-part="metric-label">{item.metricLabel}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
