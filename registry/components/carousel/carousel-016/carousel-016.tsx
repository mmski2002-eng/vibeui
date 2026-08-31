"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Carousel016Slide = {
  title: string
  meta?: string
  hue?: number
}

export type Carousel016Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  slides?: Carousel016Slide[]
  label?: string
  /** Подпись счётчика: «3 из 8» собирается из неё. */
  ofWord?: string
  accent?: string
}

// Идея компонента: счётчик вместо точек. Когда слайдов восемь и больше,
// ряд точек перестаёт читаться как позиция — «3 из 8» и полоса заполнения
// отвечают точнее и занимают меньше места. Счётчик объявляется через
// aria-live: смена кадра иначе остаётся немой. Лента не зациклена, поэтому
// стрелки гаснут на краях — так видно, что список конечен.
const STYLES = `
:where([data-vibeui-block="carousel-016"]){
--vibeui-carousel-016-bg:oklch(1 0 0);
--vibeui-carousel-016-fg:oklch(0.22 0.014 265);
--vibeui-carousel-016-muted:oklch(0.57 0.014 265);
--vibeui-carousel-016-border:oklch(0.91 0.006 265);
--vibeui-carousel-016-accent:oklch(0.55 0.19 262);
--vibeui-carousel-016-progress:0%;
--vibeui-carousel-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="carousel-016"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-carousel-016-bg);
border:1px solid var(--vibeui-carousel-016-border);border-radius:1rem;
font-family:var(--vibeui-carousel-016-font);color:var(--vibeui-carousel-016-fg);
}
/* Кадры лежат стопкой и меняются проявлением: позиция передаётся счётчиком,
   поэтому ехать ленте незачем. */
[data-vibeui-block="carousel-016"] [data-part="stack"]{
position:relative;aspect-ratio:16 / 9;border-radius:0.875rem;overflow:hidden;
}
[data-vibeui-block="carousel-016"] [data-part="slide"]{
position:absolute;inset:0;
display:flex;flex-direction:column;justify-content:flex-end;gap:0.125rem;
padding:1rem;box-sizing:border-box;
background:
radial-gradient(90% 80% at 22% 18%,oklch(0.9 0.06 var(--vibeui-carousel-016-hue,250)),transparent 70%),
linear-gradient(150deg,oklch(0.74 0.1 var(--vibeui-carousel-016-hue,250)),oklch(0.44 0.11 var(--vibeui-carousel-016-hue,250)));
color:oklch(0.99 0.003 265);
opacity:0;visibility:hidden;transition:opacity .28s ease,visibility .28s ease;
}
[data-vibeui-block="carousel-016"] [data-part="slide"][data-live="true"]{opacity:1;visibility:visible}
[data-vibeui-block="carousel-016"] [data-part="title"]{margin:0;font-size:1.0625rem;font-weight:680;line-height:1.2}
[data-vibeui-block="carousel-016"] [data-part="meta"]{margin:0;font-size:0.8125rem;color:oklch(0.93 0.01 265)}
[data-vibeui-block="carousel-016"] [data-part="bar"]{display:flex;align-items:center;gap:0.625rem}
[data-vibeui-block="carousel-016"] [data-part="bar"] button{
appearance:none;cursor:pointer;flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;padding:0;
border:1px solid var(--vibeui-carousel-016-border);border-radius:0.5rem;
background:var(--vibeui-carousel-016-bg);color:var(--vibeui-carousel-016-fg);
}
[data-vibeui-block="carousel-016"] [data-part="bar"] button:hover:not(:disabled){background:oklch(0.96 0.004 265)}
[data-vibeui-block="carousel-016"] [data-part="bar"] button:focus-visible{outline:2px solid var(--vibeui-carousel-016-accent);outline-offset:2px}
[data-vibeui-block="carousel-016"] [data-part="bar"] button:disabled{cursor:not-allowed;opacity:.35}
[data-vibeui-block="carousel-016"] [data-part="bar"] svg{width:0.875rem;height:0.875rem;display:block}
/* «3 из 8» плюс полоса: число говорит точно, полоса — сразу. */
[data-vibeui-block="carousel-016"] [data-part="count"]{
flex:none;font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="carousel-016"] [data-part="track"]{
flex:1;height:0.25rem;border-radius:9999px;background:var(--vibeui-carousel-016-border);overflow:hidden;
}
[data-vibeui-block="carousel-016"] [data-part="fill"]{
display:block;height:100%;width:var(--vibeui-carousel-016-progress);
border-radius:9999px;background:var(--vibeui-carousel-016-accent);
transition:width .28s ease;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="carousel-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SLIDES: Carousel016Slide[] = [
  { title: "Прихожая", meta: "4 м², шкаф во всю стену", hue: 250 },
  { title: "Гостиная", meta: "22 м², окна на юг", hue: 200 },
  { title: "Кухня", meta: "11 м², техника остаётся", hue: 150 },
  { title: "Спальня", meta: "14 м², гардеробная", hue: 40 },
  { title: "Детская", meta: "12 м², окно во двор", hue: 300 },
  { title: "Ванная", meta: "6 м², окно есть", hue: 20 },
  { title: "Балкон", meta: "5 м², остеклён", hue: 100 },
  { title: "Двор", meta: "закрытый, парковка", hue: 220 },
]

/**
 * Карусель со счётчиком «N из M», полосой заполнения и стрелками без зацикливания.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Carousel016({
  slides = DEFAULT_SLIDES,
  label = "Квартира",
  ofWord = "из",
  accent,
  className,
  style,
  ...props
}: Carousel016Props) {
  const [index, setIndex] = useState(0)

  const palette = {
    "--vibeui-carousel-016-progress": `${((index + 1) / slides.length) * 100}%`,
    ...(accent ? { "--vibeui-carousel-016-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-carousel-016" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="carousel-016"
        aria-roledescription="карусель"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="stack">
          {slides.map((slide, position) => (
            <div
              data-part="slide"
              key={slide.title}
              data-live={position === index}
              inert={position !== index}
              aria-hidden={position !== index}
              style={
                {
                  "--vibeui-carousel-016-hue": slide.hue ?? 250,
                } as CSSProperties
              }
            >
              <h3 data-part="title">{slide.title}</h3>
              {slide.meta ? <p data-part="meta">{slide.meta}</p> : null}
            </div>
          ))}
        </div>
        <div data-part="bar">
          <button
            type="button"
            aria-label="Предыдущий кадр"
            disabled={index === 0}
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor">
              <path
                d="M10 3 5 8l5 5"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span data-part="count" role="status">
            {index + 1} {ofWord} {slides.length}
          </span>
          <span data-part="track">
            <span data-part="fill" />
          </span>
          <button
            type="button"
            aria-label="Следующий кадр"
            disabled={index === slides.length - 1}
            onClick={() =>
              setIndex((value) => Math.min(slides.length - 1, value + 1))
            }
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor">
              <path
                d="m6 3 5 5-5 5"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </section>
    </>
  )
}
