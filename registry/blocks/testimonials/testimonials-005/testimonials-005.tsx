import type { CSSProperties } from "react"

type Testimonials005Item = {
  rating: number
  title: string
  quote: string
  name: string
  date: string
}

export type Testimonials005Props = {
  average?: string
  total?: string
  summaryTitle?: string
  /** Подпись ряда звёзд в шапке. {value} — средняя оценка. */
  averageLabel?: string
  /** Подпись ряда звёзд у отзыва. {value} — оценка отзыва. */
  ratingLabel?: string
  items?: Testimonials005Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Отзывы с оценками в звёздах. Звёзды нарисованы clip-path и заливаются
// на нужную долю через градиент, поэтому «4 из 5» видно точно, а не
// приблизительно. Численная оценка продублирована текстом в aria-label:
// ряд одинаковых значков скринридер прочитает как мусор.
const STYLES = `
:where([data-vibeui-block="testimonials-005"]){
--vibeui-testimonials-005-bg:transparent;
--vibeui-testimonials-005-card:light-dark(oklch(1 0 0),oklch(0.25 0.014 80));
--vibeui-testimonials-005-ink:light-dark(oklch(0.21 0.016 80),oklch(0.95 0.008 85));
--vibeui-testimonials-005-muted:light-dark(oklch(0.49 0.016 80),oklch(0.72 0.014 85));
--vibeui-testimonials-005-border:light-dark(oklch(0.9 0.01 85),oklch(0.35 0.014 85));
--vibeui-testimonials-005-accent:light-dark(oklch(0.74 0.16 78),oklch(0.8 0.15 80));
--vibeui-testimonials-005-empty:light-dark(oklch(0.88 0.01 85),oklch(0.4 0.014 85));
--vibeui-testimonials-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="testimonials-005"]{
display:block;background:var(--vibeui-testimonials-005-bg);color:var(--vibeui-testimonials-005-ink);
font-family:var(--vibeui-testimonials-005-font);
}
[data-vibeui-block="testimonials-005"] [data-part="shell"]{
max-width:74rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="testimonials-005"] [data-part="summary"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem 1.25rem;
padding-bottom:1.5rem;margin-bottom:1.75rem;
border-bottom:1px solid var(--vibeui-testimonials-005-border);
}
[data-vibeui-block="testimonials-005"] [data-part="average"]{
font-size:clamp(2rem,5cqi,2.75rem);line-height:1;letter-spacing:-0.04em;font-weight:760;
}
[data-vibeui-block="testimonials-005"] [data-part="summary-title"]{
margin:0;flex:1 1 14rem;max-width:26ch;
font-size:1.125rem;line-height:1.3;letter-spacing:-0.015em;font-weight:640;
}
[data-vibeui-block="testimonials-005"] [data-part="total"]{color:var(--vibeui-testimonials-005-muted);font-size:0.875rem}
[data-vibeui-block="testimonials-005"] [data-part="stars"]{
display:inline-flex;gap:0.125rem;
}
[data-vibeui-block="testimonials-005"] [data-part="star"]{
width:1rem;height:1rem;flex:none;
clip-path:polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
background:var(--vibeui-testimonials-005-empty);
}
[data-vibeui-block="testimonials-005"] [data-part="star"][data-filled="full"]{background:var(--vibeui-testimonials-005-accent)}
[data-vibeui-block="testimonials-005"] [data-part="star"][data-filled="half"]{
background:linear-gradient(90deg,var(--vibeui-testimonials-005-accent) 50%,var(--vibeui-testimonials-005-empty) 50%);
}
[data-vibeui-block="testimonials-005"] [data-part="summary"] [data-part="star"]{width:1.375rem;height:1.375rem}
[data-vibeui-block="testimonials-005"] [data-part="grid"]{display:grid;gap:1rem}
[data-vibeui-block="testimonials-005"] [data-part="card"]{
margin:0;padding:1.375rem;
border:1px solid var(--vibeui-testimonials-005-border);border-radius:1rem;
background:var(--vibeui-testimonials-005-card);
}
[data-vibeui-block="testimonials-005"] [data-part="card-head"]{
display:flex;align-items:center;gap:0.625rem;margin-bottom:0.625rem;
}
[data-vibeui-block="testimonials-005"] [data-part="date"]{margin-left:auto;color:var(--vibeui-testimonials-005-muted);font-size:0.75rem}
[data-vibeui-block="testimonials-005"] [data-part="card-title"]{
margin:0 0 0.375rem;font-size:1rem;font-weight:660;line-height:1.35;
}
[data-vibeui-block="testimonials-005"] [data-part="quote"]{
margin:0 0 0.875rem;color:var(--vibeui-testimonials-005-muted);font-size:0.9375rem;line-height:1.6;
}
[data-vibeui-block="testimonials-005"] [data-part="name"]{font-size:0.8125rem;font-weight:620}
@container (min-width: 42rem){
[data-vibeui-block="testimonials-005"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="testimonials-005"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem}
}
@container (min-width: 66rem){
[data-vibeui-block="testimonials-005"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Testimonials005Item[] = [
  {
    rating: 5,
    title: "Приехало раньше срока",
    quote:
      "Заказывала в пятницу вечером, привезли в субботу днём. Упаковано плотно, ничего не помялось, курьер дождался, пока проверю.",
    name: "Наталья В.",
    date: "12 марта",
  },
  {
    rating: 4,
    title: "Хорошо, но цвет чуть темнее",
    quote:
      "Вещь отличная, шов ровный. На фотографии оттенок светлее, чем в жизни, — учтите, если подбираете под интерьер.",
    name: "Сергей П.",
    date: "5 марта",
  },
  {
    rating: 5,
    title: "Второй заказ за месяц",
    quote:
      "Первый раз брали на пробу, теперь заказали ещё три. Поддержка отвечает по делу и без скриптов.",
    name: "Ирина К.",
    date: "28 февраля",
  },
  {
    rating: 5,
    title: "Помогли с возвратом",
    quote:
      "Ошиблась с размером, вернула без разговоров. Деньги пришли на четвёртый день, никто не уговаривал оставить.",
    name: "Алина Р.",
    date: "21 февраля",
  },
  {
    rating: 3,
    title: "Долго ждал доставку в область",
    quote:
      "Сам товар претензий не вызывает, но обещали три дня, а везли шесть. Предупредили заранее, и на том спасибо.",
    name: "Виктор М.",
    date: "14 февраля",
  },
  {
    rating: 5,
    title: "Понятная инструкция",
    quote:
      "Собрал за двадцать минут без лишних деталей в коробке. Впервые не пришлось смотреть видео на телефоне.",
    name: "Павел С.",
    date: "9 февраля",
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

function starState(index: number, rating: number) {
  if (rating >= index + 1) {
    return "full"
  }

  return rating > index ? "half" : "empty"
}

/** Отзывы с оценками: звёзды на clip-path, оценка продублирована текстом. */
export function Testimonials005({
  average = "4,8",
  total = "на основе 1 214 оценок",
  summaryTitle = "Покупатели ставят нам почти пять из пяти",
  averageLabel = "Средняя оценка {value} из 5",
  ratingLabel = "Оценка {value} из 5",
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: Testimonials005Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-testimonials-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const averageValue = Number(average.replace(",", "."))

  return (
    <>
      <style href="vibeui-testimonials-005" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="testimonials-005"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="summary">
            <span data-part="average">{average}</span>
            <span
              data-part="stars"
              role="img"
              aria-label={averageLabel.replace("{value}", average)}
            >
              {[0, 1, 2, 3, 4].map((index) => (
                <span
                  key={index}
                  data-part="star"
                  data-filled={starState(index, averageValue)}
                />
              ))}
            </span>
            <h2 data-part="summary-title">{summaryTitle}</h2>
            <span data-part="total">{total}</span>
          </div>
          <div data-part="grid">
            {items.map((item) => (
              <figure key={item.title} data-part="card">
                <div data-part="card-head">
                  <span
                    data-part="stars"
                    role="img"
                    aria-label={ratingLabel.replace(
                      "{value}",
                      String(item.rating),
                    )}
                  >
                    {[0, 1, 2, 3, 4].map((index) => (
                      <span
                        key={index}
                        data-part="star"
                        data-filled={starState(index, item.rating)}
                      />
                    ))}
                  </span>
                  <span data-part="date">{item.date}</span>
                </div>
                <p data-part="card-title">{item.title}</p>
                <blockquote data-part="quote">{item.quote}</blockquote>
                <figcaption data-part="name">{item.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
