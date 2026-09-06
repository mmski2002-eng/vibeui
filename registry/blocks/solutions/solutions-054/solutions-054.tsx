import type { CSSProperties } from "react"

export type Solutions054Review = {
  author: string
  rating: 1 | 2 | 3 | 4 | 5
  channel: string
  topic: string
  text: string
  answered: boolean
  responseHours?: number
}

export type Solutions054Props = {
  title?: string
  hint?: string
  reviews?: Solutions054Review[]
  foot?: string
  /** Подписи плиток: avgRating, avgResponse. */
  statsText?: Record<string, string>
  /** Плитка отвеченных. {answered} и {total} подставляются на месте. */
  answeredText?: string
  /** Часы ответа. {hours} — число часов. */
  hoursText?: string
  /** Скрытая подпись гистограммы. {parts} — перечисление столбиков. */
  histLabel?: string
  /** Один столбик в подписи. {rating} — оценка, {count} — число отзывов. */
  histItemText?: string
  /** Скрытая подпись звёзд. {rating} — оценка, {max} — максимум. */
  ratingLabel?: string
  /** Подписи реквизитов отзыва: channel, topic. */
  metaText?: Record<string, string>
  /** Статус отвеченного отзыва. {hours} — часы до ответа. */
  answeredStatusText?: string
  /** Статус отзыва без ответа. */
  waitingText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: разбор отзывов. Гистограмма оценок — пять столбиков одной
// высоты в разметке, но разной высоты по CSS-переменной: распределение видно
// формой, а не пятью числами подряд. Доля отвеченных и срок первого ответа
// не приходят пропами-готовыми метками — компонент считает их из массива
// отзывов, чтобы сводка не могла разойтись со списком под ней. Канал и тема
// отзыва оформлены как реквизиты в <dl>, а неотвеченный отзыв помечен левой
// полосой и словом, не только цветом фона.
const STYLES = `
:where([data-vibeui-block="solutions-054"]){
--vibeui-solutions-054-bg:transparent;
--vibeui-solutions-054-panel:light-dark(oklch(0.977 0 250),oklch(0.27 0 260));
--vibeui-solutions-054-fg:light-dark(oklch(0.21 0 260),oklch(0.94 0 260));
--vibeui-solutions-054-muted:light-dark(oklch(0.54 0 260),oklch(0.69 0 260));
--vibeui-solutions-054-border:light-dark(oklch(0.9 0 260),oklch(0.36 0 260));
--vibeui-solutions-054-accent:light-dark(oklch(0.55 0.15 39.8),oklch(0.74 0.13 39.8));
--vibeui-solutions-054-low:light-dark(oklch(0.57 0.19 30),oklch(0.73 0.16 30));
--vibeui-solutions-054-star:light-dark(oklch(0.75 0.15 85),oklch(0.83 0.14 85));
--vibeui-solutions-054-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="solutions-054"]{color-scheme:dark}
[data-vibeui-block="solutions-054"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-054-bg);
border:1px solid var(--vibeui-solutions-054-border);border-radius:1rem;
font-family:var(--vibeui-solutions-054-sans);color:var(--vibeui-solutions-054-fg);
}
[data-vibeui-block="solutions-054"] *{box-sizing:border-box}
[data-vibeui-block="solutions-054"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-054"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-054"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-054-muted)}
[data-vibeui-block="solutions-054"] [data-part="summary"]{
display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-054"] [data-part="tile"]{
padding:0.5rem 0.625rem;border-radius:0.75rem;background:var(--vibeui-solutions-054-panel);
border:1px solid var(--vibeui-solutions-054-border);
}
[data-vibeui-block="solutions-054"] [data-part="tile"] b{
display:block;font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.015em;
}
[data-vibeui-block="solutions-054"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.625rem;color:var(--vibeui-solutions-054-muted);
}
[data-vibeui-block="solutions-054"] [data-part="body"]{
display:grid;grid-template-columns:1fr;gap:1rem;padding:0 1rem 1rem;
}
@container (min-width: 44rem){
[data-vibeui-block="solutions-054"] [data-part="body"]{grid-template-columns:12rem minmax(0,1fr)}
}
[data-vibeui-block="solutions-054"] [data-part="hist"]{
display:flex;align-items:flex-end;gap:0.5rem;height:7rem;padding:0 0.25rem;
border-bottom:1px solid var(--vibeui-solutions-054-border);
}
[data-vibeui-block="solutions-054"] [data-part="col"]{
flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:0.25rem;height:100%;
}
[data-vibeui-block="solutions-054"] [data-part="bar"]{
width:100%;max-width:1.5rem;border-radius:0.25rem 0.25rem 0 0;
background:var(--vibeui-solutions-054-accent);
height:var(--vibeui-solutions-054-h,2%);
}
[data-vibeui-block="solutions-054"] [data-part="col-label"]{
display:flex;align-items:center;gap:0.1875rem;margin-top:0.25rem;font-size:0.6875rem;font-weight:650;color:var(--vibeui-solutions-054-muted);
}
[data-vibeui-block="solutions-054"] [data-part="col-count"]{
font-size:0.625rem;color:var(--vibeui-solutions-054-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-054"] [data-part="list"]{
display:flex;flex-direction:column;gap:0.625rem;list-style:none;margin:0;padding:0;
}
[data-vibeui-block="solutions-054"] [data-part="review"]{
border:1px solid var(--vibeui-solutions-054-border);border-radius:0.75rem;
padding:0.625rem 0.75rem;
}
[data-vibeui-block="solutions-054"] [data-answered="false"][data-part="review"]{
box-shadow:inset 3px 0 0 0 var(--vibeui-solutions-054-low);
}
[data-vibeui-block="solutions-054"] [data-part="review-head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.375rem;
}
[data-vibeui-block="solutions-054"] [data-part="author"]{margin:0;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="solutions-054"] [data-part="stars"]{
font-size:0.75rem;letter-spacing:0.0625rem;color:var(--vibeui-solutions-054-star);white-space:nowrap;
}
[data-vibeui-block="solutions-054"] [data-part="stars"] [data-off="true"]{color:var(--vibeui-solutions-054-border)}
[data-vibeui-block="solutions-054"] [data-part="meta"]{
display:flex;flex-wrap:wrap;gap:0 0.75rem;margin:0.25rem 0 0.375rem;font-size:0.6875rem;color:var(--vibeui-solutions-054-muted);
}
[data-vibeui-block="solutions-054"] [data-part="meta"] dt{display:inline;font-weight:600;color:var(--vibeui-solutions-054-fg)}
[data-vibeui-block="solutions-054"] [data-part="meta"] dt::after{content:": "}
[data-vibeui-block="solutions-054"] [data-part="meta"] dd{display:inline;margin:0}
[data-vibeui-block="solutions-054"] [data-part="text"]{margin:0 0 0.375rem;font-size:0.8125rem;line-height:1.4}
[data-vibeui-block="solutions-054"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.3125rem;font-size:0.6875rem;font-weight:650;color:var(--vibeui-solutions-054-muted);
}
[data-vibeui-block="solutions-054"] [data-answered="true"] [data-part="status"]{color:var(--vibeui-solutions-054-accent)}
[data-vibeui-block="solutions-054"] [data-answered="false"] [data-part="status"]{color:var(--vibeui-solutions-054-low)}
[data-vibeui-block="solutions-054"] [data-part="foot"]{
margin:0;padding:0 1rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-054-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-054"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_REVIEWS: Solutions054Review[] = [
  {
    author: "Ольга Пестрецова",
    rating: 5,
    channel: "Яндекс Карты",
    topic: "Скорость доставки",
    text: "Заказ привезли на 20 минут раньше окна, всё тёплое. Спасибо курьеру Артуру!",
    answered: true,
    responseHours: 3,
  },
  {
    author: "Дмитрий Хвостов",
    rating: 2,
    channel: "Приложение",
    topic: "Комплектация заказа",
    text: "Недоложили соус и салфетки, пришлось звонить в поддержку.",
    answered: false,
  },
  {
    author: "Алина Су",
    rating: 4,
    channel: "2ГИС",
    topic: "Работа персонала",
    text: "Очень вежливо встретили, но пришлось подождать столик почти 15 минут.",
    answered: true,
    responseHours: 9,
  },
  {
    author: "Виктор Немов",
    rating: 1,
    channel: "Приложение",
    topic: "Качество блюда",
    text: "Пицца пришла холодной, тесто сырое в середине. Заказ был на 1400 ₽.",
    answered: false,
  },
  {
    author: "Юлия Крапивина",
    rating: 5,
    channel: "Google Maps",
    topic: "Атмосфера зала",
    text: "Уютно, тихо, отличный кофе. Будем возвращаться семьёй по выходным.",
    answered: true,
    responseHours: 1,
  },
  {
    author: "Сергей Дробот",
    rating: 3,
    channel: "Яндекс Карты",
    topic: "Цена / качество",
    text: "Порции стали заметно меньше при той же цене, что и полгода назад.",
    answered: false,
  },
  {
    author: "Наталья Возная",
    rating: 4,
    channel: "2ГИС",
    topic: "Скорость доставки",
    text: "Привезли вовремя, но упаковка немного помялась в пути.",
    answered: true,
    responseHours: 6,
  },
]

const RATINGS = [5, 4, 3, 2, 1] as const

const STATS_LABEL: Record<string, string> = {
  avgRating: "средняя оценка",
  avgResponse: "средний первый ответ",
}

const META_LABEL: Record<string, string> = {
  channel: "Канал",
  topic: "Тема",
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
 * Разбор отзывов: гистограмма распределения оценок и лента с реквизитами
 * в <dl>, доля отвеченных и срок первого ответа считаются из данных.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions054({
  title = "Отзывы и обращения",
  hint = "Все каналы · последние 7 дней",
  reviews = DEFAULT_REVIEWS,
  foot = "Срок первого ответа считается только по отвеченным отзывам; неотвеченные помечены полосой слева.",
  statsText = STATS_LABEL,
  answeredText = "отвечено ({answered} из {total})",
  hoursText = "{hours} ч",
  histLabel = "Распределение оценок: {parts}",
  histItemText = "{rating} звёзд — {count}",
  ratingLabel = "Оценка {rating} из {max}",
  metaText = META_LABEL,
  answeredStatusText = "Отвечено через {hours} ч",
  waitingText = "Ждёт ответа",
  accent,
  background = "",
  className,
  style,
}: Solutions054Props) {
  const stat = (key: string) => statsText[key] ?? STATS_LABEL[key]
  const total = reviews.length
  const answeredCount = reviews.filter((review) => review.answered).length
  const answeredShare =
    total > 0 ? Math.round((answeredCount / total) * 100) : 0
  const avgRating =
    total > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / total
      : 0

  const responseHours = reviews
    .filter(
      (review) => review.answered && typeof review.responseHours === "number",
    )
    .map((review) => review.responseHours as number)
  const avgResponse =
    responseHours.length > 0
      ? Math.round(
          (responseHours.reduce((sum, hours) => sum + hours, 0) /
            responseHours.length) *
            10,
        ) / 10
      : null

  const counts = RATINGS.map(
    (rating) => reviews.filter((review) => review.rating === rating).length,
  )
  const maxCount = Math.max(...counts, 1)

  const palette = {
    ...(accent ? { "--vibeui-solutions-054-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-054-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-054" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-054"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="hint">{hint}</p>
          </div>
        </header>

        <div data-part="summary">
          <p data-part="tile">
            <b>{avgRating.toFixed(1)}</b>
            <span>{stat("avgRating")}</span>
          </p>
          <p data-part="tile">
            <b>{answeredShare}%</b>
            <span>
              {answeredText
                .replace("{answered}", String(answeredCount))
                .replace("{total}", String(total))}
            </span>
          </p>
          <p data-part="tile">
            <b>
              {avgResponse === null
                ? "—"
                : hoursText.replace("{hours}", String(avgResponse))}
            </b>
            <span>{stat("avgResponse")}</span>
          </p>
        </div>

        <div data-part="body">
          <div
            data-part="hist"
            role="img"
            aria-label={histLabel.replace(
              "{parts}",
              RATINGS.map((rating, index) =>
                histItemText
                  .replace("{rating}", String(rating))
                  .replace("{count}", String(counts[index])),
              ).join(", "),
            )}
          >
            {RATINGS.map((rating, index) => (
              <div data-part="col" key={rating}>
                <span data-part="col-count">{counts[index]}</span>
                <span
                  data-part="bar"
                  style={
                    {
                      "--vibeui-solutions-054-h": `${Math.max((counts[index] / maxCount) * 100, counts[index] > 0 ? 6 : 2)}%`,
                    } as CSSProperties
                  }
                />
                <span data-part="col-label">{rating}★</span>
              </div>
            ))}
          </div>

          <ol data-part="list">
            {reviews.map((review) => (
              <li
                data-part="review"
                data-answered={review.answered}
                key={`${review.author}-${review.topic}`}
              >
                <div data-part="review-head">
                  <p data-part="author">{review.author}</p>
                  <span
                    data-part="stars"
                    aria-label={ratingLabel
                      .replace("{rating}", String(review.rating))
                      .replace("{max}", "5")}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        data-off={star > review.rating}
                        aria-hidden="true"
                      >
                        ★
                      </span>
                    ))}
                  </span>
                </div>
                <dl data-part="meta">
                  <dt>{metaText.channel ?? META_LABEL.channel}</dt>
                  <dd>{review.channel}</dd>
                  <dt>{metaText.topic ?? META_LABEL.topic}</dt>
                  <dd>{review.topic}</dd>
                </dl>
                <p data-part="text">{review.text}</p>
                <span data-part="status">
                  {review.answered
                    ? answeredStatusText.replace(
                        "{hours}",
                        String(review.responseHours ?? "—"),
                      )
                    : waitingText}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <p data-part="foot">{foot}</p>
      </section>
    </>
  )
}
