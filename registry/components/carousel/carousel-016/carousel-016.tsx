"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Carousel016Slide = {
  title: string
  meta?: string
  hue?: number
}

export type Carousel016Props = Omit<ComponentProps<"section">, "children"> & {
  slides?: Carousel016Slide[]
  label?: string
  /** Счётчик целой строкой: {index} — текущий кадр, {total} — всего. */
  counterText?: string
  /** Роль блока для скринридера: компонент несёт русскую, проект подставит свою. */
  roleDescription?: string
  /** Подпись левой кнопки. */
  prevLabel?: string
  /** Подпись правой кнопки. */
  nextLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: счётчик вместо точек. Когда слайдов восемь и больше,
// ряд точек перестаёт читаться как позиция — «3 из 8» и полоса заполнения
// отвечают точнее и занимают меньше места. Счётчик объявляется через
// aria-live: смена кадра иначе остаётся немой. Лента не зациклена, поэтому
// стрелки гаснут на краях — так видно, что список конечен.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="carousel-016"]){
--vibeui-carousel-016-bg:transparent;
--vibeui-carousel-016-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-carousel-016-muted:color-mix(in oklab,var(--vibeui-carousel-016-fg) 68%,transparent);
--vibeui-carousel-016-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-carousel-016-hover:light-dark(oklch(0.96 0.004 265),oklch(0.32 0.012 265));
--vibeui-carousel-016-accent:light-dark(oklch(0.55 0.19 262),oklch(0.74 0.16 262));
--vibeui-carousel-016-progress:0%;
--vibeui-carousel-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="carousel-016"]{color-scheme:dark}
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
/* Кадр стоит вместо фотографии: градиент и светлый текст на нём одинаковы
   в любой теме страницы, поэтому второй ветки у них нет. */
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
[data-vibeui-block="carousel-016"] [data-part="bar"] button:hover:not(:disabled){background:var(--vibeui-carousel-016-hover)}
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
 * Ветка темы для заданной подложки. Без неё на светлой плашке достался бы
 * текст тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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
 * Карусель со счётчиком «N из M», полосой заполнения и стрелками без зацикливания.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Carousel016({
  slides = DEFAULT_SLIDES,
  label = "Квартира",
  counterText = "{index} из {total}",
  roleDescription = "карусель",
  prevLabel = "Предыдущий кадр",
  nextLabel = "Следующий кадр",
  background = "",
  accent,
  className,
  style,
  ...props
}: Carousel016Props) {
  const [index, setIndex] = useState(0)

  const palette = {
    "--vibeui-carousel-016-progress": `${((index + 1) / slides.length) * 100}%`,
    ...(accent ? { "--vibeui-carousel-016-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-carousel-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-carousel-016" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="carousel"
        data-vibeui-block="carousel-016"
        aria-roledescription={roleDescription}
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
            aria-label={prevLabel}
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
            {counterText
              .replace("{index}", String(index + 1))
              .replace("{total}", String(slides.length))}
          </span>
          <span data-part="track">
            <span data-part="fill" />
          </span>
          <button
            type="button"
            aria-label={nextLabel}
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
