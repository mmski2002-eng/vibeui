"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Commerce015Review = {
  id: string
  author: string
  date: string
  rating: number
  text: string
  photos?: number
  verified?: boolean
}

export type Commerce015Props = {
  title?: string
  reviews?: Commerce015Review[]
  empty?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: отзывы с рабочим фильтром. Фильтр показывает, сколько отзывов
// останется, ещё до нажатия — иначе покупатель попадает в пустой экран и не
// понимает, сломалось это или так и есть. Кнопка с нулём выключена, а не
// спрятана: исчезающие фильтры заставляют искать пропавшее. Счётчик «показано
// N из M» держит связь между выборкой и целым.
const STYLES = `
:where([data-vibeui-block="commerce-015"]){
--vibeui-commerce-015-bg:oklch(1 0 0);
--vibeui-commerce-015-fg:oklch(0.21 0.014 265);
--vibeui-commerce-015-muted:oklch(0.55 0.014 265);
--vibeui-commerce-015-border:oklch(0.91 0.006 265);
--vibeui-commerce-015-soft:oklch(0.975 0.004 265);
--vibeui-commerce-015-accent:oklch(0.55 0.2 262);
--vibeui-commerce-015-star:oklch(0.72 0.16 75);
--vibeui-commerce-015-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-015"]{
box-sizing:border-box;
background:var(--vibeui-commerce-015-bg);
font-family:var(--vibeui-commerce-015-sans);color:var(--vibeui-commerce-015-fg);
}
[data-vibeui-block="commerce-015"] *{box-sizing:border-box}
[data-vibeui-block="commerce-015"] [data-part="shell"]{padding:1rem;max-width:52rem;margin:0 auto}
[data-vibeui-block="commerce-015"] [data-part="top"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.5rem 0.75rem;margin-bottom:0.75rem}
[data-vibeui-block="commerce-015"] h2{margin:0;font-size:1.1875rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-015"] [data-part="avg"]{
display:inline-flex;align-items:baseline;gap:0.375rem;font-size:0.8125rem;color:var(--vibeui-commerce-015-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="commerce-015"] [data-part="avg"] b{font-size:1.125rem;color:var(--vibeui-commerce-015-fg)}
[data-vibeui-block="commerce-015"] [data-part="stars"]{color:var(--vibeui-commerce-015-star);letter-spacing:0.06em}
[data-vibeui-block="commerce-015"] [data-part="filters"]{display:flex;flex-wrap:wrap;gap:0.375rem;margin-bottom:0.5rem}
/* Число в подписи фильтра: пустой результат перестаёт выглядеть поломкой. */
[data-vibeui-block="commerce-015"] [data-part="filter"]{
appearance:none;cursor:pointer;padding:0.3125rem 0.75rem;border-radius:9999px;
border:1px solid var(--vibeui-commerce-015-border);background:var(--vibeui-commerce-015-bg);
color:var(--vibeui-commerce-015-muted);font:inherit;font-size:0.75rem;font-weight:600;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="commerce-015"] [data-part="filter"][aria-pressed="true"]{
background:var(--vibeui-commerce-015-fg);border-color:var(--vibeui-commerce-015-fg);color:var(--vibeui-commerce-015-bg);
}
[data-vibeui-block="commerce-015"] [data-part="filter"]:disabled{opacity:.45;cursor:not-allowed}
[data-vibeui-block="commerce-015"] [data-part="filter"]:focus-visible{outline:2px solid var(--vibeui-commerce-015-accent);outline-offset:2px}
[data-vibeui-block="commerce-015"] [data-part="count"]{margin:0 0 0.75rem;font-size:0.6875rem;color:var(--vibeui-commerce-015-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-015"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.625rem;grid-template-columns:1fr}
@container (min-width: 42rem){
[data-vibeui-block="commerce-015"] ul{grid-template-columns:1fr 1fr}
}
[data-vibeui-block="commerce-015"] [data-part="review"]{
padding:0.75rem;border-radius:0.875rem;border:1px solid var(--vibeui-commerce-015-border);
background:var(--vibeui-commerce-015-bg);
}
[data-vibeui-block="commerce-015"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem 0.5rem;margin-bottom:0.25rem}
[data-vibeui-block="commerce-015"] [data-part="face"]{
display:flex;align-items:center;justify-content:center;width:1.75rem;height:1.75rem;border-radius:9999px;
background:var(--vibeui-commerce-015-soft);font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="commerce-015"] [data-part="who"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="commerce-015"] [data-part="date"]{margin-left:auto;font-size:0.6875rem;color:var(--vibeui-commerce-015-muted)}
[data-vibeui-block="commerce-015"] [data-part="rate"]{margin:0 0 0.25rem;font-size:0.6875rem;color:var(--vibeui-commerce-015-muted);display:flex;gap:0.375rem;align-items:center}
[data-vibeui-block="commerce-015"] [data-part="text"]{margin:0;font-size:0.8125rem;line-height:1.5}
[data-vibeui-block="commerce-015"] [data-part="photos"]{margin:0.5rem 0 0;display:flex;gap:0.25rem}
[data-vibeui-block="commerce-015"] [data-part="photo"]{
width:2.25rem;height:2.25rem;border-radius:0.375rem;
background:linear-gradient(145deg,oklch(0.93 0.05 var(--vibeui-commerce-015-hue,262)),oklch(0.85 0.08 var(--vibeui-commerce-015-hue,262)));
}
[data-vibeui-block="commerce-015"] [data-part="mark"]{font-size:0.625rem;color:var(--vibeui-commerce-015-muted)}
[data-vibeui-block="commerce-015"] [data-part="empty"]{
margin:0;padding:1.25rem;border-radius:0.875rem;border:1px dashed var(--vibeui-commerce-015-border);
font-size:0.8125rem;color:var(--vibeui-commerce-015-muted);text-align:center;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_REVIEWS: Commerce015Review[] = [
  {
    id: "1",
    author: "Анна Р.",
    date: "12 марта",
    rating: 5,
    text: "Взяла размер M при росте 172 — сидит свободно. После четырёх стирок на 30° полотно не село.",
    photos: 2,
    verified: true,
  },
  {
    id: "2",
    author: "Илья М.",
    date: "9 марта",
    rating: 4,
    text: "На фото серый светлее, чем в жизни: пришёл почти графитовый. Швы аккуратные, доставка за день.",
    verified: true,
  },
  {
    id: "3",
    author: "Вера С.",
    date: "2 марта",
    rating: 5,
    text: "Второй заказ за год. Первый до сих пор выглядит новым, поэтому взяла ещё один цвет.",
    verified: true,
  },
  {
    id: "4",
    author: "Кирилл Д.",
    date: "26 февраля",
    rating: 3,
    text: "Ткань приятная, но рукав коротковат для роста 190. Возврат оформили без вопросов.",
  },
  {
    id: "5",
    author: "Ольга Т.",
    date: "18 февраля",
    rating: 2,
    text: "Пришла затяжка на плече. Заменили, но ждать пришлось неделю.",
    photos: 1,
  },
]

const FILTERS = [
  { id: "all", label: "Все" },
  { id: "5", label: "5 звёзд" },
  { id: "4", label: "4 звезды" },
  { id: "low", label: "3 и ниже" },
  { id: "photo", label: "С фото" },
]

function stars(rating: number) {
  return "★★★★★".slice(0, rating).padEnd(5, "☆")
}

function keeps(review: Commerce015Review, filter: string) {
  if (filter === "all") return true
  if (filter === "photo") return Boolean(review.photos)
  if (filter === "low") return review.rating <= 3
  return review.rating === Number(filter)
}

/**
 * Отзывы с фильтром, который показывает число совпадений до нажатия.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce015({
  title = "Отзывы покупателей",
  reviews = DEFAULT_REVIEWS,
  empty = "По этому фильтру отзывов пока нет — снимите его, чтобы увидеть остальные.",
  accent,
  className,
  style,
}: Commerce015Props) {
  const [filter, setFilter] = useState("all")

  const shown = reviews.filter((review) => keeps(review, filter))
  const average =
    reviews.reduce((sum, review) => sum + review.rating, 0) /
    Math.max(reviews.length, 1)

  const palette = {
    ...(accent ? { "--vibeui-commerce-015-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-015" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-015"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="top">
            <h2>{title}</h2>
            <span data-part="avg">
              <b>{average.toFixed(1)}</b>
              <span data-part="stars" aria-hidden="true">
                {stars(Math.round(average))}
              </span>
              {reviews.length} отзывов
            </span>
          </div>

          <div data-part="filters" role="group" aria-label="Фильтр отзывов">
            {FILTERS.map((entry) => {
              const size = reviews.filter((review) =>
                keeps(review, entry.id),
              ).length

              return (
                <button
                  key={entry.id}
                  type="button"
                  data-part="filter"
                  aria-pressed={filter === entry.id}
                  disabled={size === 0}
                  onClick={() => setFilter(entry.id)}
                >
                  {entry.label} · {size}
                </button>
              )
            })}
          </div>

          <p data-part="count" aria-live="polite">
            Показано {shown.length} из {reviews.length}
          </p>

          {shown.length === 0 ? (
            <p data-part="empty">{empty}</p>
          ) : (
            <ul>
              {shown.map((review) => (
                <li key={review.id} data-part="review">
                  <div data-part="head">
                    <span data-part="face" aria-hidden="true">
                      {review.author.slice(0, 1)}
                    </span>
                    <span data-part="who">{review.author}</span>
                    <span data-part="date">{review.date}</span>
                  </div>
                  <p data-part="rate">
                    <span data-part="stars" aria-hidden="true">
                      {stars(review.rating)}
                    </span>
                    {review.rating} из 5
                    {review.verified ? (
                      <span data-part="mark">· покупка подтверждена</span>
                    ) : null}
                  </p>
                  <p data-part="text">{review.text}</p>
                  {review.photos ? (
                    <p data-part="photos" aria-label={`Фото: ${review.photos}`}>
                      {Array.from({ length: review.photos }).map((_, index) => (
                        <span
                          key={index}
                          data-part="photo"
                          aria-hidden="true"
                          style={
                            {
                              "--vibeui-commerce-015-hue": 200 + index * 50,
                            } as CSSProperties
                          }
                        />
                      ))}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
