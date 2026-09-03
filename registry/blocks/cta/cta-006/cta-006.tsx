import type { CSSProperties } from "react"

type Cta006Term = {
  term: string
  detail: string
}

export type Cta006Props = {
  badge?: string
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  terms?: Cta006Term[]
  smallPrint?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Призыв с гарантией: печать слева, условия списком определений и честный
// мелкий шрифт внизу. Мелкий текст здесь не спрятан — он набран читаемым
// кеглем и стоит там, где его ищут. Печать нарисована коническим градиентом
// с вырезом через mask, отдельного изображения нет.
//
// Тема приходит из color-scheme окружения через light-dark(): подложки у
// секции по умолчанию нет, карточка с печатью темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="cta-006"]){
--vibeui-cta-006-bg:transparent;
--vibeui-cta-006-card:light-dark(oklch(1 0 0),oklch(0.24 0.014 150));
--vibeui-cta-006-ink:light-dark(oklch(0.22 0.02 150),oklch(0.95 0.006 150));
--vibeui-cta-006-muted:light-dark(oklch(0.49 0.018 150),oklch(0.72 0.014 150));
--vibeui-cta-006-border:light-dark(oklch(0.89 0.012 150),oklch(0.35 0.014 150));
--vibeui-cta-006-accent:light-dark(oklch(0.5 0.13 152),oklch(0.74 0.13 152));
--vibeui-cta-006-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.18 0.04 152));
--vibeui-cta-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-006"]{color-scheme:dark}
[data-vibeui-block="cta-006"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-cta-006-bg);color:var(--vibeui-cta-006-ink);
font-family:var(--vibeui-cta-006-font);
}
[data-vibeui-block="cta-006"] [data-part="shell"]{
max-width:66rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="cta-006"] [data-part="card"]{
display:grid;gap:1.75rem;
padding:1.75rem;border:1px solid var(--vibeui-cta-006-border);border-radius:1.5rem;
background:var(--vibeui-cta-006-card);
box-shadow:0 30px 60px -48px oklch(0.2 0.04 150 / 60%);
}
[data-vibeui-block="cta-006"] [data-part="seal"]{
width:5rem;height:5rem;flex:none;border-radius:999px;
display:grid;place-items:center;text-align:center;
background:conic-gradient(from 200deg,var(--vibeui-cta-006-accent),color-mix(in oklab,var(--vibeui-cta-006-accent) 40%,var(--vibeui-cta-006-card)),var(--vibeui-cta-006-accent));
}
[data-vibeui-block="cta-006"] [data-part="seal-inner"]{
width:4.25rem;height:4.25rem;padding:0 0.375rem;border-radius:999px;
display:grid;place-items:center;background:var(--vibeui-cta-006-card);
color:var(--vibeui-cta-006-accent);font-size:0.6875rem;font-weight:750;line-height:1.15;letter-spacing:0.01em;
}
[data-vibeui-block="cta-006"] [data-part="head"]{display:flex;align-items:center;gap:1rem}
[data-vibeui-block="cta-006"] [data-part="title"]{
margin:0;max-width:22ch;
font-size:clamp(1.5rem,4.6cqi,2.375rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="cta-006"] [data-part="text"]{
margin:0.75rem 0 0;max-width:56ch;color:var(--vibeui-cta-006-muted);font-size:1rem;line-height:1.6;
}
[data-vibeui-block="cta-006"] [data-part="terms"]{
display:grid;gap:0.875rem;margin:0;padding:1.25rem 0 0;border-top:1px solid var(--vibeui-cta-006-border);
}
[data-vibeui-block="cta-006"] [data-part="terms"] dt{font-size:0.9375rem;font-weight:660}
[data-vibeui-block="cta-006"] [data-part="terms"] dd{margin:0.1875rem 0 0;color:var(--vibeui-cta-006-muted);font-size:0.875rem;line-height:1.5}
[data-vibeui-block="cta-006"] [data-part="actions"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.875rem}
[data-vibeui-block="cta-006"] [data-part="action"]{
display:inline-flex;align-items:center;justify-content:center;
min-height:3rem;padding:0.25rem 1.5rem;border-radius:0.875rem;
background:var(--vibeui-cta-006-accent);color:var(--vibeui-cta-006-accent-fg);
text-decoration:none;font-size:1rem;font-weight:650;
transition:background-color .18s ease;
}
[data-vibeui-block="cta-006"] [data-part="action"]:hover{background:color-mix(in oklab,var(--vibeui-cta-006-accent) 86%,black)}
[data-vibeui-block="cta-006"] [data-part="secondary"]{
color:var(--vibeui-cta-006-ink);font-size:0.9375rem;font-weight:560;text-underline-offset:4px;
}
[data-vibeui-block="cta-006"] [data-part="small"]{
margin:0;color:var(--vibeui-cta-006-muted);font-size:0.8125rem;line-height:1.55;max-width:76ch;
}
[data-vibeui-block="cta-006"] a:focus-visible{outline:2px solid var(--vibeui-cta-006-accent);outline-offset:3px}
@container (min-width: 44rem){
[data-vibeui-block="cta-006"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="cta-006"] [data-part="card"]{grid-template-columns:1.25fr 1fr;gap:2.5rem 3rem;padding:2.75rem}
[data-vibeui-block="cta-006"] [data-part="terms"]{border-top:0;border-left:1px solid var(--vibeui-cta-006-border);padding:0 0 0 2rem}
[data-vibeui-block="cta-006"] [data-part="actions"]{grid-column:1}
[data-vibeui-block="cta-006"] [data-part="small"]{grid-column:1 / -1}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TERMS: Cta006Term[] = [
  {
    term: "Возврат денег 60 дней",
    detail:
      "Пишете в поддержку — возвращаем полную сумму без вопросов о причине.",
  },
  {
    term: "Перенос неиспользованных дней",
    detail: "Если приостановили работу, остаток срока сохраняется на год.",
  },
  {
    term: "Фиксированная цена на год",
    detail: "Тариф не меняется до конца оплаченного периода, даже если вырос.",
  },
]

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

/** Призыв с гарантией: печать, условия списком определений и мелкий шрифт. */
export function Cta006({
  badge = "60 дней гарантии",
  title = "Попробуйте спокойно: деньги вернём без объяснений",
  description = "Мы не держим клиентов договором. Если за два месяца сервис не заменил вам таблицу и переписку, вернём оплату целиком.",
  actionLabel = "Оформить подписку",
  actionHref = "#subscribe",
  secondaryLabel = "Прочитать условия",
  secondaryHref = "#terms",
  terms = DEFAULT_TERMS,
  smallPrint = "Возврат оформляется на исходный способ оплаты в течение десяти рабочих дней. Гарантия распространяется на первый оплаченный период и не действует при повторной подписке после возврата. Стоимость подключённых сторонних сервисов не возвращается.",
  background = "",
  accent,
  className,
  style,
}: Cta006Props) {
  const palette = {
    ...(accent ? { "--vibeui-cta-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-cta-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cta-006" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="cta-006"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="card">
            <div data-part="main">
              <div data-part="head">
                <span data-part="seal" aria-hidden="true">
                  <span data-part="seal-inner">{badge}</span>
                </span>
                <h2 data-part="title">{title}</h2>
              </div>
              <p data-part="text">{description}</p>
            </div>
            <dl data-part="terms">
              {terms.map((entry) => (
                <div key={entry.term}>
                  <dt>{entry.term}</dt>
                  <dd>{entry.detail}</dd>
                </div>
              ))}
            </dl>
            <div data-part="actions">
              <a data-part="action" href={actionHref}>
                {actionLabel}
              </a>
              <a data-part="secondary" href={secondaryHref}>
                {secondaryLabel}
              </a>
            </div>
            <p data-part="small">{smallPrint}</p>
          </div>
        </div>
      </section>
    </>
  )
}
