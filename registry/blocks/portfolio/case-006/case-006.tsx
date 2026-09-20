import type { CSSProperties } from "react"

type Case006Stat = {
  value: string
  label: string
}

type Case006Item = {
  client: string
  task: string
  metric: string
}

export type Case006Props = {
  eyebrow?: string
  title?: string
  stats?: Case006Stat[]
  items?: Case006Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Сводная полоса цифр по всем внедрениям плюс три мини-кейса как
// доказательство. Агрегат отвечает на «а это вообще работает?», мини-карточки
// — на «а у таких, как мы?». Большие цифры набраны акцентом и tabular-nums,
// карточки намеренно мельче полосы: иерархия от общего к частному.
const STYLES = `
:where([data-vibeui-block="case-006"]){
--vibeui-case-006-bg:transparent;
--vibeui-case-006-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-case-006-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-case-006-muted:light-dark(oklch(0.46 0 0),oklch(0.71 0 0));
--vibeui-case-006-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-case-006-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-case-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="case-006"]{color-scheme:dark}
[data-vibeui-block="case-006"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-case-006-bg);color:var(--vibeui-case-006-ink);
font-family:var(--vibeui-case-006-font);
}
[data-vibeui-block="case-006"] [data-part="shell"]{
max-width:76rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="case-006"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-case-006-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="case-006"] [data-part="title"]{
margin:0 0 2rem;max-width:22ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="case-006"] [data-part="strip"]{
display:grid;gap:1.5rem;margin:0 0 1.25rem;
padding:clamp(1.5rem,4cqi,2.25rem);
border:1px solid color-mix(in oklab,var(--vibeui-case-006-accent) 25%,var(--vibeui-case-006-border));
border-radius:1.375rem;
background:color-mix(in oklab,var(--vibeui-case-006-accent) 8%,var(--vibeui-case-006-card));
}
[data-vibeui-block="case-006"] [data-part="stat"]{min-inline-size:0;display:grid;gap:0.375rem}
[data-vibeui-block="case-006"] [data-part="stat-value"]{
margin:0;color:var(--vibeui-case-006-accent);
font-size:clamp(2.25rem,7cqi,3.25rem);line-height:1;letter-spacing:-0.035em;font-weight:780;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="case-006"] [data-part="stat-label"]{
margin:0;color:var(--vibeui-case-006-muted);font-size:0.875rem;line-height:1.45;
}
[data-vibeui-block="case-006"] [data-part="cards"]{
display:grid;gap:1rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="case-006"] [data-part="card"]{
min-inline-size:0;display:flex;flex-direction:column;gap:0.625rem;
padding:1.25rem 1.375rem;border:1px solid var(--vibeui-case-006-border);border-radius:1.125rem;
background:var(--vibeui-case-006-card);
}
[data-vibeui-block="case-006"] [data-part="client"]{font-size:0.9375rem;font-weight:680}
[data-vibeui-block="case-006"] [data-part="task"]{
margin:0;flex:1 1 auto;color:var(--vibeui-case-006-muted);
font-size:0.875rem;line-height:1.5;
}
[data-vibeui-block="case-006"] [data-part="metric"]{
margin:0;color:var(--vibeui-case-006-accent);
font-size:1.25rem;line-height:1.1;letter-spacing:-0.02em;font-weight:750;
font-variant-numeric:tabular-nums;
}
@container (min-width: 40rem){
[data-vibeui-block="case-006"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="case-006"] [data-part="strip"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:2rem}
[data-vibeui-block="case-006"] [data-part="stat"]:not(:first-child){
padding-left:2rem;border-left:1px solid color-mix(in oklab,var(--vibeui-case-006-accent) 25%,var(--vibeui-case-006-border));
}
[data-vibeui-block="case-006"] [data-part="cards"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="case-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STATS: Case006Stat[] = [
  { value: "124", label: "сайта собрано на VibeUI за год" },
  { value: "−70%", label: "времени на вёрстку в среднем по кейсам" },
  { value: "5 дней", label: "медианный срок от макета до релиза" },
]

const DEFAULT_ITEMS: Case006Item[] = [
  {
    client: "Полярис",
    task: "Сайт продукта к инвестиционному раунду силами двух человек.",
    metric: "+38% заявок",
  },
  {
    client: "Кедр Маркет",
    task: "Переезд с конструктора на собственный код без фронтендера.",
    metric: "−82% времени",
  },
  {
    client: "Курс.Лаб",
    task: "Методисты сами запускают посадочные под каждый курс.",
    metric: "8 000 ₽ за страницу",
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

/** Цифры внедрений: сводная полоса метрик по всем кейсам и три мини-карточки. */
export function Case006({
  eyebrow = "Итоги внедрений",
  title = "Что кейсы дают в сумме",
  stats = DEFAULT_STATS,
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: Case006Props) {
  const palette = {
    ...(accent ? { "--vibeui-case-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-case-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-case-006" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="case-006"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <dl data-part="strip">
            {stats.map((stat) => (
              <div key={stat.label} data-part="stat">
                <dt data-part="stat-label">{stat.label}</dt>
                <dd data-part="stat-value">{stat.value}</dd>
              </div>
            ))}
          </dl>
          <ul data-part="cards">
            {items.map((item) => (
              <li key={item.client} data-part="card">
                <span data-part="client">{item.client}</span>
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
