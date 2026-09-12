"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Carousel005Review = {
  text: string
  name: string
  role: string
}

export type Carousel005Props = Omit<ComponentProps<"section">, "children"> & {
  reviews?: Carousel005Review[]
  label?: string
  /** Роль секции для скринридера. */
  roleText?: string
  /** Шаблон подписи точки: {index}, {total}. */
  dotText?: string
  /** Подписи стрелок: компонент несёт русские, проект подставляет свои. */
  navText?: Record<string, string>
  /** Пусто — подложка своя; цвет заменяет её целиком. */
  background?: string
  accent?: string
}

// Идея компонента: отзывы по одному с клавиатурой. Стрелки влево-вправо
// листают, когда фокус внутри карусели, — это ожидаемое поведение, которое
// почти никто не делает. Высота держится по самому длинному отзыву, иначе
// страница дёргается при каждом переключении.
//
// Тема берётся из color-scheme окружения через light-dark(): подложка и текст
// темнеют вместе со страницей, своей тёмной темы компонент не носит.
const STYLES = `
:where([data-vibeui-block="carousel-005"]){
--vibeui-carousel-005-bg:light-dark(oklch(1 0 0),oklch(0.21 0 265));
--vibeui-carousel-005-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-carousel-005-muted:color-mix(in oklab,var(--vibeui-carousel-005-fg) 68%,transparent);
--vibeui-carousel-005-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-carousel-005-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-carousel-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="carousel-005"]{color-scheme:dark}
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
[data-vibeui-block="carousel-005"] [data-part="dot"][aria-current="true"]{background:var(--vibeui-carousel-005-accent);width:1.25rem;color:oklch(from var(--vibeui-carousel-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
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

const NAV_LABEL: Record<string, string> = {
  prev: "Предыдущий отзыв",
  next: "Следующий отзыв",
}

/** Подстановка чисел в подпись: перевод остаётся одной строкой. */
function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
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
 * Отзывы по одному: стрелки листают, высота держится по длинному.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Carousel005({
  reviews = DEFAULT_REVIEWS,
  label = "Отзывы",
  roleText = "карусель",
  dotText = "Отзыв {index} из {total}",
  navText = NAV_LABEL,
  background = "",
  accent,
  className,
  style,
  ...props
}: Carousel005Props) {
  const [index, setIndex] = useState(0)

  const palette = {
    ...(accent ? { "--vibeui-carousel-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-carousel-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        data-slot="carousel"
        data-vibeui-block="carousel-005"
        aria-roledescription={roleText}
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
                aria-label={fill(dotText, {
                  index: position + 1,
                  total: reviews.length,
                })}
                onClick={() => setIndex(position)}
              />
            ))}
          </div>
          <div data-part="nav">
            <button
              type="button"
              aria-label={navText.prev ?? NAV_LABEL.prev}
              onClick={() => move(-1)}
            >
              <span data-part="arrow" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={navText.next ?? NAV_LABEL.next}
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
