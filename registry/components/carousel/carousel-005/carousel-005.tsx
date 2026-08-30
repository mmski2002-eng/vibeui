"use client"

import { useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Carousel005Review = {
  text: string
  name: string
  role: string
}

export type Carousel005Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  reviews?: Carousel005Review[]
  label?: string
  accent?: string
}

// Идея компонента: отзывы по одному с клавиатурой. Стрелки влево-вправо
// листают, когда фокус внутри карусели, — это ожидаемое поведение, которое
// почти никто не делает. Высота держится по самому длинному отзыву, иначе
// страница дёргается при каждом переключении.
const STYLES = `
:where([data-vibeui-block="carousel-005"]){
--vibeui-carousel-005-bg:oklch(1 0 0);
--vibeui-carousel-005-fg:oklch(0.22 0.014 265);
--vibeui-carousel-005-muted:oklch(0.56 0.014 265);
--vibeui-carousel-005-border:oklch(0.91 0.006 265);
--vibeui-carousel-005-accent:oklch(0.55 0.17 265);
--vibeui-carousel-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="carousel-005"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:1rem;
background:var(--vibeui-carousel-005-bg);
border:1px solid var(--vibeui-carousel-005-border);border-radius:0.875rem;
font-family:var(--vibeui-carousel-005-font);color:var(--vibeui-carousel-005-fg);
}
[data-vibeui-block="carousel-005"]:focus-visible{outline:2px solid var(--vibeui-carousel-005-accent);outline-offset:2px}
[data-vibeui-block="carousel-005"] [data-part="quote"]{
position:relative;display:grid;
}
/* Все отзывы лежат в одной ячейке грида: высота держится по самому
   длинному, и страница не дёргается при переключении. */
[data-vibeui-block="carousel-005"] [data-part="review"]{
grid-area:1 / 1;margin:0;
}
[data-vibeui-block="carousel-005"] [data-part="review"][data-hidden="true"]{visibility:hidden}
[data-vibeui-block="carousel-005"] [data-part="text"]{
margin:0 0 0.625rem;font-size:0.9375rem;line-height:1.5;
}
[data-vibeui-block="carousel-005"] figcaption{
display:flex;align-items:center;gap:0.5rem;font-size:0.8125rem;color:var(--vibeui-carousel-005-muted);
}
[data-vibeui-block="carousel-005"] [data-part="name"]{color:var(--vibeui-carousel-005-fg);font-weight:650}
[data-vibeui-block="carousel-005"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="carousel-005"] [data-part="dots"]{display:flex;gap:0.375rem}
[data-vibeui-block="carousel-005"] [data-part="dot"]{
appearance:none;cursor:pointer;padding:0;
width:0.5rem;height:0.5rem;border:0;border-radius:9999px;
background:var(--vibeui-carousel-005-border);
}
[data-vibeui-block="carousel-005"] [data-part="dot"][aria-current="true"]{background:var(--vibeui-carousel-005-accent);width:1.25rem}
[data-vibeui-block="carousel-005"] [data-part="dot"]:focus-visible{outline:2px solid var(--vibeui-carousel-005-accent);outline-offset:3px}
[data-vibeui-block="carousel-005"] [data-part="nav"]{display:flex;gap:0.375rem}
[data-vibeui-block="carousel-005"] [data-part="nav"] button{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:1.875rem;height:1.875rem;padding:0;
border:1px solid var(--vibeui-carousel-005-border);border-radius:0.5rem;
background:transparent;color:inherit;
}
[data-vibeui-block="carousel-005"] [data-part="nav"] button:focus-visible{outline:2px solid var(--vibeui-carousel-005-accent);outline-offset:2px}
[data-vibeui-block="carousel-005"] [data-part="arrow"]{
width:0.375rem;height:0.375rem;
border-left:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg) translate(0.0625rem,-0.0625rem);
}
[data-vibeui-block="carousel-005"] [data-part="arrow"][data-dir="next"]{transform:rotate(-135deg) translate(0.0625rem,-0.0625rem)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="carousel-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_REVIEWS: Carousel005Review[] = [
  {
    text: "Собрали лендинг за вечер: агент поставил блоки из каталога и не стал переписывать их по-своему.",
    name: "Анна Петрова",
    role: "продакт, «Полёт»",
  },
  {
    text: "Впервые вижу библиотеку, где инструкция для ИИ идёт вместе с компонентом, а не пишется руками.",
    name: "Марк Ильин",
    role: "фронтенд, «Контур»",
  },
  {
    text: "Компоненты не тянут зависимостей — это единственная причина, по которой мы их вообще взяли.",
    name: "Ирина Ким",
    role: "техлид, «Заря»",
  },
]

/**
 * Отзывы по одному: стрелки листают, высота держится по длинному.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Carousel005({
  reviews = DEFAULT_REVIEWS,
  label = "Отзывы",
  accent,
  className,
  style,
  ...props
}: Carousel005Props) {
  const [index, setIndex] = useState(0)

  const palette = {
    ...(accent ? { "--vibeui-carousel-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  const move = (delta: number) =>
    setIndex((index + delta + reviews.length) % reviews.length)

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault()
      move(1)
    } else if (event.key === "ArrowLeft") {
      event.preventDefault()
      move(-1)
    }
  }

  return (
    <>
      <style href="vibeui-carousel-005" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="carousel-005"
        aria-roledescription="карусель"
        aria-label={label}
        className={className}
        style={palette}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <div data-part="quote" aria-live="polite">
          {reviews.map((review, position) => (
            <figure
              key={review.name}
              data-part="review"
              data-hidden={position !== index}
              aria-hidden={position !== index}
            >
              <blockquote data-part="text">{review.text}</blockquote>
              <figcaption>
                <span data-part="name">{review.name}</span>
                <span>{review.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <div data-part="foot">
          <div data-part="dots">
            {reviews.map((review, position) => (
              <button
                key={review.name}
                type="button"
                data-part="dot"
                aria-current={position === index}
                aria-label={`Отзыв ${position + 1} из ${reviews.length}`}
                onClick={() => setIndex(position)}
              />
            ))}
          </div>
          <div data-part="nav">
            <button
              type="button"
              aria-label="Предыдущий отзыв"
              onClick={() => move(-1)}
            >
              <span data-part="arrow" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Следующий отзыв"
              onClick={() => move(1)}
            >
              <span data-part="arrow" data-dir="next" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
