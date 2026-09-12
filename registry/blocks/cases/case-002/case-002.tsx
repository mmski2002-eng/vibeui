import type { CSSProperties } from "react"

type Case002Metric = {
  value: string
  label: string
}

export type Case002Props = {
  eyebrow?: string
  title?: string
  quote?: string
  author?: string
  role?: string
  metrics?: Case002Metric[]
  buttonLabel?: string
  buttonHref?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Один большой кейс вместо сетки: цитата клиента слева, колонка из трёх
// метрик справа, кнопка «Читать историю». Так делают, когда есть один
// по-настоящему сильный проект: развёрнутая цитата даёт контекст, метрики —
// доказательство, а кнопка честно признаёт, что вся история сюда не влезет.
const STYLES = `
:where([data-vibeui-block="case-002"]){
--vibeui-case-002-bg:transparent;
--vibeui-case-002-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-case-002-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-case-002-muted:light-dark(oklch(0.46 0 0),oklch(0.71 0 0));
--vibeui-case-002-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-case-002-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-case-002-accent-fill:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-case-002-on-accent:oklch(from var(--vibeui-case-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-case-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="case-002"]{color-scheme:dark}
[data-vibeui-block="case-002"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-case-002-bg);color:var(--vibeui-case-002-ink);
font-family:var(--vibeui-case-002-font);
}
[data-vibeui-block="case-002"] [data-part="shell"]{
max-width:76rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="case-002"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-case-002-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="case-002"] [data-part="title"]{
margin:0 0 2rem;max-width:24ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="case-002"] [data-part="panel"]{
display:grid;gap:2rem;
padding:clamp(1.5rem,4cqi,2.75rem);
border:1px solid var(--vibeui-case-002-border);border-radius:1.375rem;
background:var(--vibeui-case-002-card);
}
[data-vibeui-block="case-002"] [data-part="story"]{min-inline-size:0;display:flex;flex-direction:column;gap:1.5rem;margin:0}
[data-vibeui-block="case-002"] [data-part="quote"]{
margin:0;flex:1 1 auto;
font-size:clamp(1.125rem,2.6cqi,1.375rem);line-height:1.55;font-weight:500;letter-spacing:-0.01em;
}
[data-vibeui-block="case-002"] [data-part="quote"]::before{content:"«"}
[data-vibeui-block="case-002"] [data-part="quote"]::after{content:"»"}
[data-vibeui-block="case-002"] [data-part="author"]{display:grid;gap:0.125rem}
[data-vibeui-block="case-002"] [data-part="name"]{font-size:0.9375rem;font-weight:640}
[data-vibeui-block="case-002"] [data-part="role"]{color:var(--vibeui-case-002-muted);font-size:0.8125rem;line-height:1.4}
[data-vibeui-block="case-002"] [data-part="button"]{
align-self:flex-start;display:inline-block;
padding:0.6875rem 1.375rem;border-radius:999px;
background:var(--vibeui-case-002-accent-fill);color:var(--vibeui-case-002-on-accent);
font-size:0.9375rem;font-weight:650;text-decoration:none;
transition:filter .18s ease,transform .18s ease;
}
[data-vibeui-block="case-002"] [data-part="button"]:hover{filter:brightness(1.06);transform:translateY(-1px)}
[data-vibeui-block="case-002"] [data-part="button"]:focus-visible{
outline:2px solid var(--vibeui-case-002-accent);outline-offset:3px;
}
[data-vibeui-block="case-002"] [data-part="metrics"]{
display:grid;gap:1rem;margin:0;
padding-top:1.75rem;border-top:1px solid var(--vibeui-case-002-border);
}
[data-vibeui-block="case-002"] [data-part="metric"]{
min-inline-size:0;display:grid;gap:0.25rem;
padding:1rem 1.25rem;border-radius:1rem;
background:color-mix(in oklab,var(--vibeui-case-002-accent) 8%,var(--vibeui-case-002-card));
}
[data-vibeui-block="case-002"] [data-part="value"]{
margin:0;color:var(--vibeui-case-002-accent);
font-size:clamp(1.75rem,4cqi,2.25rem);line-height:1;letter-spacing:-0.03em;font-weight:750;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="case-002"] [data-part="label"]{
margin:0;color:var(--vibeui-case-002-muted);font-size:0.8125rem;line-height:1.4;
}
@container (min-width: 40rem){
[data-vibeui-block="case-002"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="case-002"] [data-part="metrics"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@container (min-width: 64rem){
[data-vibeui-block="case-002"] [data-part="panel"]{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:2.5rem}
[data-vibeui-block="case-002"] [data-part="metrics"]{
grid-template-columns:none;align-content:start;
padding-top:0;border-top:0;padding-left:2.5rem;border-left:1px solid var(--vibeui-case-002-border);
}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="case-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_METRICS: Case002Metric[] = [
  { value: "6 дней", label: "от идеи до релиза сайта" },
  { value: "2", label: "человека — вся команда проекта" },
  { value: "+38%", label: "заявок с нового сайта" },
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

/** Кейс-герой: развёрнутая цитата клиента, три метрики и кнопка на полную историю. */
export function Case002({
  eyebrow = "Кейс",
  title = "«Полярис»: сайт к инвестиционному раунду за неделю",
  quote = "Мы выбрали три блока из каталога, отдали их ИИ вместе с текстами — и получили сайт, который не стыдно показать инвесторам. Правки заняли один вечер, а не месяц согласований с подрядчиком.",
  author = "Дарья Климова",
  role = "Директор по продукту, «Полярис»",
  metrics = DEFAULT_METRICS,
  buttonLabel = "Читать историю",
  buttonHref = "#",
  background = "",
  accent,
  className,
  style,
}: Case002Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-case-002-accent": accent,
          "--vibeui-case-002-accent-fill": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-case-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-case-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="case-002"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="panel">
            <figure data-part="story">
              <blockquote data-part="quote">{quote}</blockquote>
              <figcaption data-part="author">
                <span data-part="name">{author}</span>
                <span data-part="role">{role}</span>
              </figcaption>
              <a data-part="button" href={buttonHref}>
                {buttonLabel}
              </a>
            </figure>
            <dl data-part="metrics">
              {metrics.map((metric) => (
                <div key={metric.label} data-part="metric">
                  <dt data-part="label">{metric.label}</dt>
                  <dd data-part="value">{metric.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  )
}
