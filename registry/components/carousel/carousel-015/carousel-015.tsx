"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Carousel015Slide = {
  caption: string
  detail?: string
  credit?: string
  hue?: number
}

export type Carousel015Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  slides?: Carousel015Slide[]
  label?: string
  accent?: string
}

// Идея компонента: подпись здесь равноправна кадру, а не наложена на него.
// Текст поверх снимка читается только на тёмной картинке, поэтому подпись
// живёт под кадром на собственной светлой подложке. Место под неё
// зарезервировано по самой длинной: без этого блок прыгает на каждом
// переключении. Разметка — figure/figcaption, то есть подпись остаётся
// подписью и для скринридера, и для поисковика.
const STYLES = `
:where([data-vibeui-block="carousel-015"]){
--vibeui-carousel-015-bg:oklch(1 0 0);
--vibeui-carousel-015-fg:oklch(0.22 0.014 265);
--vibeui-carousel-015-muted:oklch(0.56 0.014 265);
--vibeui-carousel-015-border:oklch(0.91 0.006 265);
--vibeui-carousel-015-accent:oklch(0.52 0.16 200);
--vibeui-carousel-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="carousel-015"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-carousel-015-bg);
border:1px solid var(--vibeui-carousel-015-border);border-radius:1rem;
font-family:var(--vibeui-carousel-015-font);color:var(--vibeui-carousel-015-fg);
}
[data-vibeui-block="carousel-015"] figure{margin:0;display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="carousel-015"] [data-part="frame"]{
aspect-ratio:3 / 2;border-radius:0.875rem;
background:
radial-gradient(85% 80% at 25% 20%,oklch(0.92 0.06 var(--vibeui-carousel-015-hue,250)),transparent 70%),
linear-gradient(150deg,oklch(0.8 0.09 var(--vibeui-carousel-015-hue,250)),oklch(0.5 0.11 var(--vibeui-carousel-015-hue,250)));
}
/* Подпись под кадром на своей подложке: поверх снимка она читается не всегда. */
[data-vibeui-block="carousel-015"] figcaption{
display:flex;flex-direction:column;gap:0.1875rem;
/* Место зарезервировано: иначе блок прыгает на каждом переключении. */
min-height:3.25rem;
}
[data-vibeui-block="carousel-015"] [data-part="caption"]{font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="carousel-015"] [data-part="detail"]{font-size:0.8125rem;line-height:1.4;color:var(--vibeui-carousel-015-muted)}
[data-vibeui-block="carousel-015"] [data-part="credit"]{
font-size:0.6875rem;letter-spacing:0.02em;color:var(--vibeui-carousel-015-muted);
}
[data-vibeui-block="carousel-015"] [data-part="bar"]{display:flex;align-items:center;gap:0.5rem}
[data-vibeui-block="carousel-015"] [data-part="bar"] button{
appearance:none;cursor:pointer;flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;padding:0;
border:1px solid var(--vibeui-carousel-015-border);border-radius:0.5rem;
background:var(--vibeui-carousel-015-bg);color:var(--vibeui-carousel-015-fg);
}
[data-vibeui-block="carousel-015"] [data-part="bar"] button:hover{background:oklch(0.96 0.004 265)}
[data-vibeui-block="carousel-015"] [data-part="bar"] button:focus-visible{outline:2px solid var(--vibeui-carousel-015-accent);outline-offset:2px}
[data-vibeui-block="carousel-015"] [data-part="bar"] svg{width:0.875rem;height:0.875rem;display:block}
[data-vibeui-block="carousel-015"] [data-part="ticks"]{display:flex;gap:0.25rem;margin:0 auto;padding:0;list-style:none}
[data-vibeui-block="carousel-015"] [data-part="tick"]{
width:1.25rem;height:0.1875rem;border-radius:9999px;background:var(--vibeui-carousel-015-border);
}
[data-vibeui-block="carousel-015"] [data-part="tick"][data-live="true"]{background:var(--vibeui-carousel-015-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="carousel-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SLIDES: Carousel015Slide[] = [
  {
    caption: "Цех перед сменой",
    detail:
      "Станки прогреваются час, поэтому смена начинается раньше рабочего дня.",
    credit: "Фото: архив завода",
    hue: 220,
  },
  {
    caption: "Литейная форма",
    detail:
      "Одна форма выдерживает около двухсот отливок, потом её переплавляют.",
    credit: "Фото: Н. Королёв",
    hue: 30,
  },
  {
    caption: "Контроль качества",
    detail: "Каждая десятая деталь уходит на замер: размеры проверяют вручную.",
    credit: "Фото: Н. Королёв",
    hue: 150,
  },
  {
    caption: "Готовая партия",
    detail: "Ящики маркируют в тот же день, отгрузка идёт утром следующего.",
    credit: "Фото: архив завода",
    hue: 280,
  },
]

/**
 * Карусель с подписями под кадром: figure/figcaption и зарезервированная высота.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Carousel015({
  slides = DEFAULT_SLIDES,
  label = "Репортаж",
  accent,
  className,
  style,
  ...props
}: Carousel015Props) {
  const [index, setIndex] = useState(0)
  const slide = slides[index]

  function go(step: number) {
    setIndex((value) => (value + step + slides.length) % slides.length)
  }

  const palette = {
    "--vibeui-carousel-015-hue": slide.hue ?? 250,
    ...(accent ? { "--vibeui-carousel-015-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-carousel-015" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="carousel-015"
        aria-roledescription="карусель"
        aria-label={label}
        className={className}
        style={palette}
      >
        <figure>
          <div data-part="frame" role="img" aria-label={slide.caption} />
          <figcaption>
            <span data-part="caption">{slide.caption}</span>
            {slide.detail ? (
              <span data-part="detail">{slide.detail}</span>
            ) : null}
            {slide.credit ? (
              <span data-part="credit">{slide.credit}</span>
            ) : null}
          </figcaption>
        </figure>
        <div data-part="bar">
          <button
            type="button"
            aria-label="Предыдущий кадр"
            onClick={() => go(-1)}
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
          <ul data-part="ticks" aria-hidden="true">
            {slides.map((item, position) => (
              <li
                data-part="tick"
                key={item.caption}
                data-live={position === index}
              />
            ))}
          </ul>
          <button
            type="button"
            aria-label="Следующий кадр"
            onClick={() => go(1)}
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
