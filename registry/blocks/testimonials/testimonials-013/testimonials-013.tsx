import type { CSSProperties } from "react"

export type Testimonials013Props = {
  eyebrow?: string
  title?: string
  beforeTitle?: string
  beforePoints?: string[]
  afterTitle?: string
  afterPoints?: string[]
  quote?: string
  name?: string
  role?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// «До и после» — отзыв, разложенный в историю перемены. Панель боли и
// панель результата стоят рядом: контраст виден до чтения, по одному
// оформлению. Цитата под панелями подтверждает перемену голосом человека —
// без неё сравнение читается как обещание маркетолога, а не как опыт.
const STYLES = `
:where([data-vibeui-block="testimonials-013"]){
--vibeui-testimonials-013-bg:transparent;
--vibeui-testimonials-013-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-testimonials-013-ink:light-dark(oklch(0.17 0 0),oklch(0.96 0 0));
--vibeui-testimonials-013-muted:light-dark(oklch(0.48 0 0),oklch(0.71 0 0));
--vibeui-testimonials-013-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-testimonials-013-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-testimonials-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-013"]{color-scheme:dark}
[data-vibeui-block="testimonials-013"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-testimonials-013-bg);color:var(--vibeui-testimonials-013-ink);
font-family:var(--vibeui-testimonials-013-font);
}
[data-vibeui-block="testimonials-013"] [data-part="shell"]{
max-width:64rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="testimonials-013"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-testimonials-013-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="testimonials-013"] [data-part="title"]{
margin:0 0 2rem;max-width:22ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="testimonials-013"] [data-part="compare"]{display:grid;gap:1rem}
[data-vibeui-block="testimonials-013"] [data-part="pane"]{
min-inline-size:0;
padding:1.5rem;border:1px solid var(--vibeui-testimonials-013-border);border-radius:1.125rem;
background:var(--vibeui-testimonials-013-card);
}
[data-vibeui-block="testimonials-013"] [data-part="pane"][data-kind="after"]{
border-color:color-mix(in oklab,var(--vibeui-testimonials-013-accent) 45%,var(--vibeui-testimonials-013-border));
background:color-mix(in oklab,var(--vibeui-testimonials-013-accent) 8%,var(--vibeui-testimonials-013-card));
}
[data-vibeui-block="testimonials-013"] [data-part="pane-title"]{
margin:0 0 1rem;
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
color:var(--vibeui-testimonials-013-muted);
}
[data-vibeui-block="testimonials-013"] [data-part="pane"][data-kind="after"] [data-part="pane-title"]{
color:var(--vibeui-testimonials-013-accent);
}
[data-vibeui-block="testimonials-013"] [data-part="points"]{
margin:0;padding:0;list-style:none;display:grid;gap:0.75rem;
}
[data-vibeui-block="testimonials-013"] [data-part="point"]{
display:flex;gap:0.625rem;align-items:baseline;
font-size:0.9375rem;line-height:1.5;
}
[data-vibeui-block="testimonials-013"] [data-part="pane"][data-kind="before"] [data-part="point"]{
color:var(--vibeui-testimonials-013-muted);
}
[data-vibeui-block="testimonials-013"] [data-part="mark"]{
flex:none;font-weight:700;font-size:0.8125rem;
}
[data-vibeui-block="testimonials-013"] [data-part="pane"][data-kind="after"] [data-part="mark"]{
color:var(--vibeui-testimonials-013-accent);
}
[data-vibeui-block="testimonials-013"] [data-part="figure"]{
margin:2rem 0 0;display:grid;gap:1rem;
padding-top:1.75rem;border-top:1px solid var(--vibeui-testimonials-013-border);
}
[data-vibeui-block="testimonials-013"] [data-part="quote"]{
margin:0;font-size:clamp(1.125rem,2.6cqi,1.375rem);line-height:1.5;
}
[data-vibeui-block="testimonials-013"] [data-part="quote"]::before{content:"«";color:var(--vibeui-testimonials-013-accent)}
[data-vibeui-block="testimonials-013"] [data-part="quote"]::after{content:"»";color:var(--vibeui-testimonials-013-accent)}
[data-vibeui-block="testimonials-013"] [data-part="author"]{
display:flex;align-items:baseline;gap:0.5rem;flex-wrap:wrap;
}
[data-vibeui-block="testimonials-013"] [data-part="name"]{font-size:0.9375rem;font-weight:640}
[data-vibeui-block="testimonials-013"] [data-part="role"]{color:var(--vibeui-testimonials-013-muted);font-size:0.875rem}
@container (min-width: 44rem){
[data-vibeui-block="testimonials-013"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="testimonials-013"] [data-part="compare"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_BEFORE = [
  "Неделя вёрстки на каждую посадочную страницу",
  "Очередь задач к фронтендерам на месяц вперёд",
  "«На сайте выглядит не так, как в макете»",
  "Запуски кампаний сдвигались из-за вёрстки",
]

const DEFAULT_AFTER = [
  "Страница собирается за вечер из готовых блоков",
  "Маркетолог ставит секции сам, через агента",
  "Превью и продакшен совпадают один в один",
  "К дате запуска успеваем со свободным днём",
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

/** Панели «до» и «после» с подтверждающей цитатой под ними. */
export function Testimonials013({
  eyebrow = "История клиента",
  title = "Что изменилось после перехода",
  beforeTitle = "Было",
  beforePoints = DEFAULT_BEFORE,
  afterTitle = "Стало",
  afterPoints = DEFAULT_AFTER,
  quote = "Мы месяцами жили в очереди на вёрстку. Сейчас маркетинг собирает страницы сам, а разработка впервые за год занимается продуктом.",
  name = "Ирина Белова",
  role = "Продакт-менеджер, «Северная почта»",
  background = "",
  accent,
  className,
  style,
}: Testimonials013Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-testimonials-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-testimonials-013" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="testimonials-013"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="compare">
            <article data-part="pane" data-kind="before">
              <h3 data-part="pane-title">{beforeTitle}</h3>
              <ul data-part="points">
                {beforePoints.map((point) => (
                  <li key={point} data-part="point">
                    <span data-part="mark" aria-hidden="true">
                      —
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </article>
            <article data-part="pane" data-kind="after">
              <h3 data-part="pane-title">{afterTitle}</h3>
              <ul data-part="points">
                {afterPoints.map((point) => (
                  <li key={point} data-part="point">
                    <span data-part="mark" aria-hidden="true">
                      ✓
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          </div>
          <figure data-part="figure">
            <blockquote data-part="quote">{quote}</blockquote>
            <figcaption data-part="author">
              <span data-part="name">{name}</span>
              <span data-part="role">{role}</span>
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  )
}
