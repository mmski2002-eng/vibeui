"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Carousel003Slide = {
  title: string
  text: string
  hue?: number
}

export type Carousel003Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  slides?: Carousel003Slide[]
  label?: string
  accent?: string
}

// Идея компонента: слайдер с миниатюрами. Полоса под кадром отвечает на
// вопрос «сколько ещё и что там», на который точки не отвечают. Слайды не
// удаляются из разметки, а прячутся атрибутом hidden — так работает
// клавиатура и не рвётся порядок чтения.
const STYLES = `
:where([data-vibeui-block="carousel-003"]){
--vibeui-carousel-003-surface:oklch(1 0 0);
--vibeui-carousel-003-bg:oklch(1 0 0);
--vibeui-carousel-003-fg:oklch(0.22 0.014 265);
--vibeui-carousel-003-muted:oklch(0.58 0.014 265);
--vibeui-carousel-003-border:oklch(0.91 0.006 265);
--vibeui-carousel-003-accent:oklch(0.55 0.17 265);
--vibeui-carousel-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Собственная подложка: заголовок и счётчик — это текст, и на тёмной
   странице он обязан читаться без правки палитры проекта. */
[data-vibeui-block="carousel-003"]{
padding:0.875rem;background:var(--vibeui-carousel-003-surface);
border:1px solid var(--vibeui-carousel-003-border);border-radius:1rem;
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:26rem;box-sizing:border-box;
font-family:var(--vibeui-carousel-003-font);color:var(--vibeui-carousel-003-fg);
}
[data-vibeui-block="carousel-003"] [data-part="stage"]{
position:relative;display:flex;flex-direction:column;justify-content:flex-end;gap:0.25rem;
aspect-ratio:16 / 9;padding:1rem;box-sizing:border-box;overflow:hidden;
border-radius:0.875rem;
background:
radial-gradient(90% 80% at 20% 20%,oklch(0.9 0.06 var(--vibeui-carousel-003-hue,250)),transparent 70%),
linear-gradient(150deg,oklch(0.72 0.1 var(--vibeui-carousel-003-hue,250)),oklch(0.42 0.11 var(--vibeui-carousel-003-hue,250)));
color:oklch(0.99 0.003 265);
}
[data-vibeui-block="carousel-003"] [data-part="title"]{margin:0;font-size:1.125rem;font-weight:680;line-height:1.2}
[data-vibeui-block="carousel-003"] [data-part="text"]{margin:0;font-size:0.8125rem;line-height:1.45;color:oklch(0.93 0.01 265);max-width:22rem}
/* Миниатюры отвечают на вопрос «что дальше», на который точки не отвечают. */
[data-vibeui-block="carousel-003"] [data-part="thumbs"]{
display:flex;gap:0.375rem;margin:0;padding:0;list-style:none;
overflow-x:auto;scrollbar-width:none;
}
[data-vibeui-block="carousel-003"] [data-part="thumbs"]::-webkit-scrollbar{display:none}
[data-vibeui-block="carousel-003"] [data-part="thumb"]{
appearance:none;cursor:pointer;flex:none;
width:3.5rem;aspect-ratio:16 / 10;padding:0;
border:1px solid var(--vibeui-carousel-003-border);border-radius:0.5rem;
background:
linear-gradient(150deg,oklch(0.8 0.09 var(--vibeui-carousel-003-thumb,250)),oklch(0.55 0.1 var(--vibeui-carousel-003-thumb,250)));
opacity:.55;
}
[data-vibeui-block="carousel-003"] [data-part="thumb"][aria-current="true"]{
opacity:1;border-color:var(--vibeui-carousel-003-accent);
box-shadow:0 0 0 1px var(--vibeui-carousel-003-accent);
}
[data-vibeui-block="carousel-003"] [data-part="thumb"]:focus-visible{outline:2px solid var(--vibeui-carousel-003-accent);outline-offset:2px}
[data-vibeui-block="carousel-003"] [data-part="counter"]{
font-size:0.75rem;color:var(--vibeui-carousel-003-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="carousel-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SLIDES: Carousel003Slide[] = [
  {
    title: "Выберите дизайн",
    text: "Каталог показывает живое превью каждого компонента, а не картинку.",
    hue: 250,
  },
  {
    title: "Отдайте ИИ",
    text: "Copy for AI собирает инструкцию: что установить и что нельзя менять.",
    hue: 150,
  },
  {
    title: "Получите сайт",
    text: "Агент ставит компонент одной командой и не пересобирает его заново.",
    hue: 30,
  },
]

/**
 * Слайдер с полосой миниатюр: видно, сколько ещё и что там.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Carousel003({
  slides = DEFAULT_SLIDES,
  label = "Как это работает",
  accent,
  className,
  style,
  ...props
}: Carousel003Props) {
  const [index, setIndex] = useState(0)
  const current = slides[index] ?? slides[0]

  const palette = {
    "--vibeui-carousel-003-hue": current.hue ?? 250,
    ...(accent ? { "--vibeui-carousel-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-carousel-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="carousel-003"
        aria-roledescription="карусель"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          {slides.map((slide, position) => (
            <div
              key={slide.title}
              hidden={position !== index}
              aria-roledescription="слайд"
              aria-label={`${position + 1} из ${slides.length}`}
            >
              <h3 data-part="title">{slide.title}</h3>
              <p data-part="text">{slide.text}</p>
            </div>
          ))}
        </div>
        <ul data-part="thumbs">
          {slides.map((slide, position) => (
            <li key={slide.title}>
              <button
                type="button"
                data-part="thumb"
                aria-current={position === index}
                aria-label={`Слайд ${position + 1}: ${slide.title}`}
                style={
                  {
                    "--vibeui-carousel-003-thumb": slide.hue ?? 250,
                  } as CSSProperties
                }
                onClick={() => setIndex(position)}
              />
            </li>
          ))}
        </ul>
        <p data-part="counter">
          {index + 1} из {slides.length}
        </p>
      </section>
    </>
  )
}
