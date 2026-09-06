"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Carousel011Review = {
  text: string
  author: string
  role?: string
}

export type Carousel011Props = Omit<ComponentProps<"section">, "children"> & {
  reviews?: Carousel011Review[]
  /** Секунд на один отзыв. Меньше четырёх — прочитать не успевают. */
  interval?: number
  label?: string
  /** Роль секции для скринридера. */
  roleText?: string
  /** Подписи кнопки показа: компонент несёт русские, проект подставляет свои. */
  playText?: Record<string, string>
  /** Шаблон счётчика: {index}, {total}. */
  countText?: string
  /** Пусто — подложка своя; цвет заменяет её целиком. */
  background?: string
  accent?: string
}

// Идея компонента: отзывы листаются сами, но останавливаются от любого
// намёка на интерес — наведения, фокуса внутри блока и нажатия на паузу.
// Автопрокрутка без остановки не даёт дочитать длинный отзыв, а это ровно
// то, ради чего блок стоит на странице. При prefers-reduced-motion таймер
// не запускается вовсе: движение здесь не украшение, а действие, и отменять
// его надо целиком, а не гасить анимацию.
//
// Тема берётся из color-scheme окружения через light-dark(): карточка, цитата
// и полоски темнеют вместе со страницей, своей тёмной темы компонент не носит.
const STYLES = `
:where([data-vibeui-block="carousel-011"]){
--vibeui-carousel-011-bg:light-dark(oklch(1 0 0),oklch(0.21 0 265));
--vibeui-carousel-011-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-carousel-011-muted:color-mix(in oklab,var(--vibeui-carousel-011-fg) 68%,transparent);
--vibeui-carousel-011-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-carousel-011-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-carousel-011-step:6s;
--vibeui-carousel-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="carousel-011"]{color-scheme:dark}
[data-vibeui-block="carousel-011"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:28rem;box-sizing:border-box;padding:1rem;
background:var(--vibeui-carousel-011-bg);
border:1px solid var(--vibeui-carousel-011-border);border-radius:1rem;
font-family:var(--vibeui-carousel-011-font);color:var(--vibeui-carousel-011-fg);
}
[data-vibeui-block="carousel-011"] [data-part="quote"]{
margin:0;display:flex;flex-direction:column;gap:0.625rem;
/* Высота держится по самому длинному отзыву: иначе страница прыгает. */
min-height:6.5rem;
}
[data-vibeui-block="carousel-011"] [data-part="text"]{
margin:0;font-size:0.9375rem;line-height:1.5;
}
[data-vibeui-block="carousel-011"] [data-part="text"]::before{content:"«"}
[data-vibeui-block="carousel-011"] [data-part="text"]::after{content:"»"}
[data-vibeui-block="carousel-011"] figcaption{
display:flex;flex-direction:column;gap:0.0625rem;margin-top:auto;
}
[data-vibeui-block="carousel-011"] [data-part="author"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="carousel-011"] [data-part="role"]{font-size:0.75rem;color:var(--vibeui-carousel-011-muted)}
[data-vibeui-block="carousel-011"] [data-part="foot"]{display:flex;align-items:center;gap:0.625rem}
[data-vibeui-block="carousel-011"] [data-part="pause"]{
appearance:none;cursor:pointer;flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;padding:0;
border:1px solid var(--vibeui-carousel-011-border);border-radius:9999px;
background:var(--vibeui-carousel-011-bg);color:var(--vibeui-carousel-011-fg);
}
[data-vibeui-block="carousel-011"] [data-part="pause"]:focus-visible{outline:2px solid var(--vibeui-carousel-011-accent);outline-offset:2px}
[data-vibeui-block="carousel-011"] [data-part="pause"] svg{width:0.75rem;height:0.75rem;display:block}
[data-vibeui-block="carousel-011"] [data-part="bars"]{display:flex;gap:0.25rem;flex:1;margin:0;padding:0;list-style:none}
[data-vibeui-block="carousel-011"] [data-part="bars"] li{flex:1;height:0.1875rem;border-radius:9999px;background:var(--vibeui-carousel-011-border);overflow:hidden}
/* Полоска показывает, сколько осталось до следующего отзыва: без неё
   переключение выглядит внезапным. */
[data-vibeui-block="carousel-011"] [data-part="fill"]{
display:block;height:100%;width:100%;transform-origin:left;transform:scaleX(0);
background:var(--vibeui-carousel-011-accent);
}
[data-vibeui-block="carousel-011"] li[data-state="done"] [data-part="fill"]{transform:scaleX(1)}
[data-vibeui-block="carousel-011"] li[data-state="live"] [data-part="fill"]{
animation:vibeui-carousel-011-run var(--vibeui-carousel-011-step) linear forwards;
}
[data-vibeui-block="carousel-011"][data-paused="true"] [data-part="fill"]{animation-play-state:paused}
@keyframes vibeui-carousel-011-run{from{transform:scaleX(0)}to{transform:scaleX(1)}}
[data-vibeui-block="carousel-011"] [data-part="count"]{
font-size:0.6875rem;color:var(--vibeui-carousel-011-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="carousel-011"] *{animation:none!important;transition:none!important}
[data-vibeui-block="carousel-011"] li[data-state="live"] [data-part="fill"]{transform:scaleX(1)}
}
`

const DEFAULT_REVIEWS: Carousel011Review[] = [
  {
    text: "Поставили за вечер, на следующий день собрали первый экран. Ничего не пришлось переписывать под наш проект.",
    author: "Дмитрий Л.",
    role: "фронтенд-разработчик",
  },
  {
    text: "Больше всего понравилось, что компоненты не тянут за собой чужую тему: цвета остались наши.",
    author: "Марина К.",
    role: "продуктовый дизайнер",
  },
  {
    text: "Команда перестала спорить про отступы: теперь это вопрос выбора варианта, а не часового обсуждения.",
    author: "Артём С.",
    role: "тимлид",
  },
]

const PLAY_LABEL: Record<string, string> = {
  pause: "Остановить показ",
  play: "Продолжить показ",
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
 * Отзывы с автопрокруткой, которая замирает от наведения, фокуса и паузы.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Carousel011({
  reviews = DEFAULT_REVIEWS,
  interval = 6,
  label = "Отзывы",
  roleText = "карусель",
  playText = PLAY_LABEL,
  countText = "{index} / {total}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Carousel011Props) {
  const [index, setIndex] = useState(0)
  const [held, setHeld] = useState(false)
  const [playing, setPlaying] = useState(true)
  const calm = useRef(false)

  useEffect(() => {
    calm.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (calm.current) setPlaying(false)
  }, [])

  useEffect(() => {
    if (!playing || held || calm.current) return
    const timer = window.setTimeout(
      () => setIndex((value) => (value + 1) % reviews.length),
      interval * 1000,
    )
    return () => window.clearTimeout(timer)
  }, [playing, held, index, interval, reviews.length])

  const paused = held || !playing

  const palette = {
    "--vibeui-carousel-011-step": `${interval}s`,
    ...(accent ? { "--vibeui-carousel-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-carousel-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const review = reviews[index]

  return (
    <>
      <style href="vibeui-carousel-011" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="carousel"
        data-vibeui-block="carousel-011"
        data-paused={paused}
        aria-roledescription={roleText}
        aria-label={label}
        className={className}
        style={palette}
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
      >
        <figure data-part="quote" aria-live={paused ? "polite" : "off"}>
          <p data-part="text">{review.text}</p>
          <figcaption>
            <span data-part="author">{review.author}</span>
            {review.role ? <span data-part="role">{review.role}</span> : null}
          </figcaption>
        </figure>
        <div data-part="foot">
          <button
            type="button"
            data-part="pause"
            aria-label={
              playing
                ? (playText.pause ?? PLAY_LABEL.pause)
                : (playText.play ?? PLAY_LABEL.play)
            }
            onClick={() => setPlaying((value) => !value)}
          >
            {playing ? (
              <svg viewBox="0 0 16 16" fill="currentColor">
                <rect x="4" y="3" width="3" height="10" rx="1" />
                <rect x="9" y="3" width="3" height="10" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M5 3.5v9l8-4.5z" />
              </svg>
            )}
          </button>
          <ul data-part="bars" aria-hidden="true">
            {reviews.map((item, position) => (
              <li
                key={item.author}
                data-state={
                  position < index
                    ? "done"
                    : position === index
                      ? "live"
                      : "next"
                }
              >
                <span data-part="fill" key={`${index}-${position}`} />
              </li>
            ))}
          </ul>
          <span data-part="count">
            {fill(countText, { index: index + 1, total: reviews.length })}
          </span>
        </div>
      </section>
    </>
  )
}
