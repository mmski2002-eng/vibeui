import type { CSSProperties } from "react"

export type Commerce006Review = {
  author: string
  date: string
  rating: number
  title?: string
  text: string
  verified?: boolean
  useful?: number
}

export type Commerce006Props = {
  title?: string
  average?: number
  total?: number
  spread?: number[]
  reviews?: Commerce006Review[]
  cta?: string
  /** Подписи блока: компонент несёт русские, проект подставляет свои. */
  labels?: Record<string, string>
  /** Локаль форматирования средней оценки. */
  locale?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: отзывы с разбивкой по оценкам. Разбивка нужна раньше самих
// отзывов: средние 4,6 из десяти оценок и из тысячи — разные вещи, и полоса
// показывает это без арифметики. Доли считаются из массива, а не приходят
// процентами: заданные отдельно, они перестают сходиться с суммой. Пометка
// «покупка подтверждена» стоит у автора, потому что доверие к отзыву решается
// до чтения текста, а оценка продублирована числом рядом со звёздами.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// по умолчанию нет, он лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="commerce-006"]){
--vibeui-commerce-006-bg:transparent;
--vibeui-commerce-006-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-commerce-006-muted:light-dark(oklch(0.55 0.014 265),oklch(0.72 0.012 265));
--vibeui-commerce-006-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-commerce-006-track:light-dark(oklch(0.94 0.005 265),oklch(0.32 0.01 265));
--vibeui-commerce-006-star:light-dark(oklch(0.72 0.16 75),oklch(0.82 0.15 75));
--vibeui-commerce-006-ok:light-dark(oklch(0.58 0.14 152),oklch(0.76 0.14 152));
--vibeui-commerce-006-on-ok:light-dark(oklch(1 0 0),oklch(0.19 0.02 152));
--vibeui-commerce-006-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-commerce-006-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-006"]{color-scheme:dark}
[data-vibeui-block="commerce-006"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;padding:1rem;
background:var(--vibeui-commerce-006-bg);
font-family:var(--vibeui-commerce-006-sans);color:var(--vibeui-commerce-006-fg);
}
[data-vibeui-block="commerce-006"] *{box-sizing:border-box}
[data-vibeui-block="commerce-006"] h2{margin:0 0 0.875rem;font-size:1.0625rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="commerce-006"] [data-part="layout"]{display:grid;grid-template-columns:1fr;gap:1rem;align-items:start}
@container (min-width: 40rem){
[data-vibeui-block="commerce-006"] [data-part="layout"]{grid-template-columns:14rem 1fr}
}
[data-vibeui-block="commerce-006"] [data-part="score"]{
padding:0.875rem;border-radius:0.875rem;
border:1px solid var(--vibeui-commerce-006-border);
}
[data-vibeui-block="commerce-006"] [data-part="big"]{
margin:0;font-size:2rem;font-weight:700;line-height:1;letter-spacing:-0.02em;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="commerce-006"] [data-part="stars"]{color:var(--vibeui-commerce-006-star);letter-spacing:0.08em}
[data-vibeui-block="commerce-006"] [data-part="total"]{margin:0.25rem 0 0.625rem;font-size:0.75rem;color:var(--vibeui-commerce-006-muted)}
/* Разбивка раньше отзывов: 4,6 из десяти оценок и из тысячи — разные вещи. */
[data-vibeui-block="commerce-006"] [data-part="bar"]{
display:grid;grid-template-columns:1.25rem 1fr 2.5rem;align-items:center;gap:0.375rem;
margin-bottom:0.25rem;font-size:0.6875rem;color:var(--vibeui-commerce-006-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="commerce-006"] [data-part="track"]{height:0.375rem;border-radius:9999px;background:var(--vibeui-commerce-006-track);overflow:hidden}
[data-vibeui-block="commerce-006"] [data-part="fill"]{
display:block;height:100%;border-radius:9999px;
width:var(--vibeui-commerce-006-share,0%);background:var(--vibeui-commerce-006-star);
}
[data-vibeui-block="commerce-006"] [data-part="write"]{
width:100%;margin-top:0.625rem;appearance:none;cursor:pointer;height:2.25rem;
border:1px solid var(--vibeui-commerce-006-border);border-radius:0.625rem;
background:none;color:inherit;font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="commerce-006"] [data-part="write"]:focus-visible{outline:2px solid var(--vibeui-commerce-006-accent);outline-offset:2px}
[data-vibeui-block="commerce-006"] ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.625rem}
[data-vibeui-block="commerce-006"] [data-part="review"]{
padding:0.75rem;border-radius:0.875rem;
border:1px solid var(--vibeui-commerce-006-border);
}
[data-vibeui-block="commerce-006"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem 0.5rem;margin-bottom:0.25rem;
}
[data-vibeui-block="commerce-006"] [data-part="author"]{font-size:0.8125rem;font-weight:650}
/* Пометка о покупке у автора: доверие решается до чтения текста. */
[data-vibeui-block="commerce-006"] [data-part="verified"]{
display:inline-flex;align-items:center;gap:0.25rem;
font-size:0.6875rem;color:var(--vibeui-commerce-006-ok);font-weight:600;
}
[data-vibeui-block="commerce-006"] [data-part="check"]{
display:inline-flex;align-items:center;justify-content:center;
width:0.875rem;height:0.875rem;border-radius:9999px;
background:var(--vibeui-commerce-006-ok);color:var(--vibeui-commerce-006-on-ok);font-size:0.5625rem;line-height:1;
}
[data-vibeui-block="commerce-006"] [data-part="date"]{margin-left:auto;font-size:0.6875rem;color:var(--vibeui-commerce-006-muted)}
[data-vibeui-block="commerce-006"] [data-part="line"]{
display:flex;align-items:center;gap:0.375rem;margin:0 0 0.25rem;
font-size:0.75rem;color:var(--vibeui-commerce-006-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="commerce-006"] h3{margin:0 0 0.1875rem;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="commerce-006"] [data-part="text"]{margin:0;font-size:0.8125rem;line-height:1.55}
[data-vibeui-block="commerce-006"] [data-part="useful"]{
margin:0.5rem 0 0;font-size:0.6875rem;color:var(--vibeui-commerce-006-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SPREAD = [142, 48, 14, 5, 4]

const DEFAULT_REVIEWS: Commerce006Review[] = [
  {
    author: "Анна Р.",
    date: "12 марта",
    rating: 5,
    title: "Держит форму после стирки",
    text: "Взяла размер M при росте 172 — сидит свободно, рукав длинный. После четырёх стирок на 30° полотно не село и не растянулось в плечах.",
    verified: true,
    useful: 24,
  },
  {
    author: "Илья М.",
    date: "9 марта",
    rating: 4,
    title: "Хорошо, но цвет темнее",
    text: "На фото серый светлее, чем в жизни: пришёл почти графитовый. Качество швов вопросов не вызывает, доставка за день.",
    verified: true,
    useful: 11,
  },
]

/** Русские подписи по умолчанию: установленный файл не меняет язык сам. */
const LABELS: Record<string, string> = {
  ratings: "{count} оценок",
  verified: "покупка подтверждена",
  outOf: "{rating} из 5",
  useful: "Отзыв помог {count} покупателям",
}

function stars(rating: number) {
  return "★★★★★".slice(0, Math.round(rating)).padEnd(5, "☆")
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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
 * Отзывы с разбивкой по оценкам: доли считаются из массива, а не задаются.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce006({
  title = "Отзывы",
  average = 4.7,
  total,
  spread = DEFAULT_SPREAD,
  reviews = DEFAULT_REVIEWS,
  cta = "Написать отзыв",
  labels = LABELS,
  locale = "ru-RU",
  accent,
  background = "",
  className,
  style,
}: Commerce006Props) {
  // Доли считаются из массива: заданные отдельно, они перестают сходиться.
  const count = total ?? spread.reduce((sum, value) => sum + value, 0)
  const text = { ...LABELS, ...labels }

  const palette = {
    ...(accent ? { "--vibeui-commerce-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-006" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-006"
        className={className}
        style={palette}
        aria-label={title}
      >
        <h2>{title}</h2>
        <div data-part="layout">
          <aside data-part="score">
            <p data-part="big">
              {average.toLocaleString(locale, { minimumFractionDigits: 1 })}
            </p>
            <p data-part="total">
              <span data-part="stars" aria-hidden="true">
                {stars(average)}
              </span>{" "}
              {text.ratings.replace("{count}", String(count))}
            </p>
            {spread.map((value, index) => {
              const score = spread.length - index
              const share = count ? (value / count) * 100 : 0
              return (
                <p
                  key={score}
                  data-part="bar"
                  style={
                    {
                      "--vibeui-commerce-006-share": `${share.toFixed(1)}%`,
                    } as CSSProperties
                  }
                >
                  <span>{score} ★</span>
                  <span data-part="track" aria-hidden="true">
                    <span data-part="fill" />
                  </span>
                  <span>{value}</span>
                </p>
              )
            })}
            <button type="button" data-part="write">
              {cta}
            </button>
          </aside>

          <ul>
            {reviews.map((review) => (
              <li key={`${review.author}-${review.date}`} data-part="review">
                <div data-part="head">
                  <span data-part="author">{review.author}</span>
                  {review.verified ? (
                    <span data-part="verified">
                      <span data-part="check" aria-hidden="true">
                        ✓
                      </span>
                      {text.verified}
                    </span>
                  ) : null}
                  <span data-part="date">{review.date}</span>
                </div>
                <p data-part="line">
                  <span data-part="stars" aria-hidden="true">
                    {stars(review.rating)}
                  </span>
                  {text.outOf.replace("{rating}", String(review.rating))}
                </p>
                {review.title ? <h3>{review.title}</h3> : null}
                <p data-part="text">{review.text}</p>
                {review.useful ? (
                  <p data-part="useful">
                    {text.useful.replace("{count}", String(review.useful))}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
