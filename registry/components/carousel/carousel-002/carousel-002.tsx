"use client"

import { useRef } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Carousel002Item = {
  title: string
  meta: string
  hue?: number
}

export type Carousel002Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  items?: Carousel002Item[]
  label?: string
  accent?: string
}

// Идея компонента: лента карточек, где следующая выглядывает за краем. Это
// не украшение: обрезанная карточка — единственный честный сигнал, что
// список продолжается. Стрелки прокручивают на ширину видимой области через
// scrollBy, а не на «одну карточку»: карточек в кадре бывает разное число.
const STYLES = `
:where([data-vibeui-block="carousel-002"]){
--vibeui-carousel-002-surface:oklch(1 0 0);
--vibeui-carousel-002-bg:oklch(1 0 0);
--vibeui-carousel-002-fg:oklch(0.22 0.014 265);
--vibeui-carousel-002-muted:oklch(0.58 0.014 265);
--vibeui-carousel-002-border:oklch(0.91 0.006 265);
--vibeui-carousel-002-accent:oklch(0.55 0.17 265);
--vibeui-carousel-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Собственная подложка: заголовок и счётчик — это текст, и на тёмной
   странице он обязан читаться без правки палитры проекта. */
[data-vibeui-block="carousel-002"]{
padding:0.875rem;background:var(--vibeui-carousel-002-surface);
border:1px solid var(--vibeui-carousel-002-border);border-radius:1rem;
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:30rem;box-sizing:border-box;
font-family:var(--vibeui-carousel-002-font);color:var(--vibeui-carousel-002-fg);
}
[data-vibeui-block="carousel-002"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="carousel-002"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="carousel-002"] [data-part="nav"]{display:flex;gap:0.375rem}
[data-vibeui-block="carousel-002"] [data-part="nav"] button{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;padding:0;
border:1px solid var(--vibeui-carousel-002-border);border-radius:0.5rem;
background:var(--vibeui-carousel-002-bg);color:inherit;
}
[data-vibeui-block="carousel-002"] [data-part="nav"] button:hover{background:oklch(0.96 0.004 265)}
[data-vibeui-block="carousel-002"] [data-part="nav"] button:focus-visible{outline:2px solid var(--vibeui-carousel-002-accent);outline-offset:2px}
[data-vibeui-block="carousel-002"] [data-part="arrow"]{
width:0.375rem;height:0.375rem;
border-left:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg) translate(0.0625rem,-0.0625rem);
}
[data-vibeui-block="carousel-002"] [data-part="arrow"][data-dir="next"]{transform:rotate(-135deg) translate(0.0625rem,-0.0625rem)}
/* Ширина карточки в процентах от ленты: следующая всегда выглядывает. */
[data-vibeui-block="carousel-002"] [data-part="track"]{
display:flex;gap:0.625rem;
margin:0;padding:0 0 0.25rem;list-style:none;
overflow-x:auto;overscroll-behavior-x:contain;
scroll-snap-type:x mandatory;scroll-behavior:smooth;
scrollbar-width:none;
}
[data-vibeui-block="carousel-002"] [data-part="track"]::-webkit-scrollbar{display:none}
[data-vibeui-block="carousel-002"] [data-part="card"]{
flex:0 0 62%;scroll-snap-align:start;
display:flex;flex-direction:column;gap:0.5rem;
padding:0.75rem;box-sizing:border-box;
border:1px solid var(--vibeui-carousel-002-border);border-radius:0.875rem;
background:var(--vibeui-carousel-002-bg);
}
[data-vibeui-block="carousel-002"] [data-part="cover"]{
aspect-ratio:16 / 10;border-radius:0.625rem;
background:
radial-gradient(90% 80% at 25% 20%,oklch(0.92 0.06 var(--vibeui-carousel-002-hue,250)),transparent 70%),
linear-gradient(150deg,oklch(0.8 0.08 var(--vibeui-carousel-002-hue,250)),oklch(0.55 0.1 var(--vibeui-carousel-002-hue,250)));
}
[data-vibeui-block="carousel-002"] [data-part="card-title"]{font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="carousel-002"] [data-part="meta"]{font-size:0.75rem;color:var(--vibeui-carousel-002-muted)}
@media (min-width: 40rem){
[data-vibeui-block="carousel-002"] [data-part="card"]{flex-basis:38%}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="carousel-002"] *{animation:none!important;transition:none!important}
[data-vibeui-block="carousel-002"] [data-part="track"]{scroll-behavior:auto}
}
`

const DEFAULT_ITEMS: Carousel002Item[] = [
  { title: "Как собрать лендинг за вечер", meta: "8 минут чтения", hue: 250 },
  {
    title: "Что отдать агенту, а что править руками",
    meta: "6 минут",
    hue: 150,
  },
  { title: "Токены темы без боли", meta: "11 минут", hue: 30 },
  { title: "Почему компонент — один файл", meta: "5 минут", hue: 300 },
]

/**
 * Лента карточек с подглядыванием следующей и прокруткой на ширину кадра.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Carousel002({
  items = DEFAULT_ITEMS,
  label = "Читать дальше",
  accent,
  className,
  style,
  ...props
}: Carousel002Props) {
  const track = useRef<HTMLUListElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-carousel-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  // Прокрутка на ширину кадра, а не на «одну карточку»: в кадре их бывает
  // одна на телефоне и две с половиной на десктопе.
  const scroll = (direction: 1 | -1) => {
    const node = track.current
    if (!node) return
    node.scrollBy({ left: direction * node.clientWidth * 0.8 })
  }

  return (
    <>
      <style href="vibeui-carousel-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="carousel-002"
        aria-roledescription="карусель"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3 data-part="title">{label}</h3>
          <div data-part="nav">
            <button
              type="button"
              aria-label="Предыдущие карточки"
              onClick={() => scroll(-1)}
            >
              <span data-part="arrow" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Следующие карточки"
              onClick={() => scroll(1)}
            >
              <span data-part="arrow" data-dir="next" aria-hidden="true" />
            </button>
          </div>
        </div>
        <ul data-part="track" ref={track} tabIndex={0}>
          {items.map((item) => (
            <li
              key={item.title}
              data-part="card"
              style={
                {
                  "--vibeui-carousel-002-hue": item.hue ?? 250,
                } as CSSProperties
              }
            >
              <span data-part="cover" aria-hidden="true" />
              <span data-part="card-title">{item.title}</span>
              <span data-part="meta">{item.meta}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
