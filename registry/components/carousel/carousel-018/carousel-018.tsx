"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Carousel018Slide = {
  title: string
  text: string
  /** Тон кадра в градусах: кадр рисуется градиентом, а не картинкой. */
  hue: number
}

export type Carousel018Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  slides?: Carousel018Slide[]
  ratio?: "16:9" | "4:3" | "21:9"
  /** Подпись поверх кадра или отдельной строкой под ним. */
  captionPlace?: "over" | "under"
  /** Подпись ряда точек для озвучки: компонент несёт русскую. */
  dotsLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: кадры не едут, а растворяются друг в друге. Сдвиг ленты
// читается как «список», и это правильно для полки товаров; hero-обложке
// список не нужен — ей нужна смена настроения без движения, поэтому слайды
// лежат стопкой в одной ячейке грида и меняются прозрачностью. Точки-пейджер
// остаются единственным указателем места, а подпись живёт вместе с кадром.
const STYLES = `
:where([data-vibeui-block="carousel-018"]){
--vibeui-carousel-018-bg:transparent;
--vibeui-carousel-018-fg:light-dark(oklch(0.24 0 265),oklch(0.95 0 265));
--vibeui-carousel-018-muted:color-mix(in oklab,var(--vibeui-carousel-018-fg) 68%,transparent);
--vibeui-carousel-018-border:light-dark(oklch(0.89 0 265),oklch(0.37 0 265));
--vibeui-carousel-018-accent:light-dark(oklch(0.53 0.17 22),oklch(0.78 0.13 22));
--vibeui-carousel-018-dot:light-dark(oklch(0.55 0 265 / 32%),oklch(0.92 0 265 / 34%));
--vibeui-carousel-018-radius:0.875rem;
--vibeui-carousel-018-hue:22;
--vibeui-carousel-018-fade:.55s;
--vibeui-carousel-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="carousel-018"]{color-scheme:dark}
[data-vibeui-block="carousel-018"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:32rem;box-sizing:border-box;
background:var(--vibeui-carousel-018-bg);color:var(--vibeui-carousel-018-fg);
font-family:var(--vibeui-carousel-018-font);
}
[data-vibeui-block="carousel-018"] *{box-sizing:border-box}
[data-vibeui-block="carousel-018"] [data-part="frame"]{position:relative}
/* Слайды лежат в одной ячейке грида: высота держится по самому высокому,
   а смена идёт прозрачностью, поэтому кадр не дёргается. */
[data-vibeui-block="carousel-018"] [data-part="stage"]{
display:grid;aspect-ratio:16/9;
border:1px solid var(--vibeui-carousel-018-border);
border-radius:var(--vibeui-carousel-018-radius);overflow:hidden;
}
[data-vibeui-block="carousel-018"] [data-part="stage"][data-ratio="4:3"]{aspect-ratio:4/3}
[data-vibeui-block="carousel-018"] [data-part="stage"][data-ratio="21:9"]{aspect-ratio:21/9}
[data-vibeui-block="carousel-018"] [data-part="slide"]{
grid-area:1/1;opacity:0;pointer-events:none;
transition:opacity var(--vibeui-carousel-018-fade) ease;
background:
radial-gradient(120% 90% at 18% 12%,oklch(0.86 0.11 var(--vibeui-carousel-018-hue) / 85%),transparent 62%),
linear-gradient(148deg,oklch(0.66 0.16 var(--vibeui-carousel-018-hue)),oklch(0.34 0.12 calc(var(--vibeui-carousel-018-hue) + 48)));
}
[data-vibeui-block="carousel-018"] [data-part="slide"][data-current="true"]{opacity:1}
[data-vibeui-block="carousel-018"] [data-part="caption"]{
display:flex;flex-direction:column;gap:0.125rem;margin:0;
}
[data-vibeui-block="carousel-018"] [data-part="caption"][data-place="over"]{
position:absolute;inset-inline:0;bottom:0;
padding:1.5rem 0.875rem 0.75rem;
border-radius:0 0 var(--vibeui-carousel-018-radius) var(--vibeui-carousel-018-radius);
background:linear-gradient(to top,oklch(0.14 0 265 / 82%),transparent);
color:oklch(0.98 0 0);
}
[data-vibeui-block="carousel-018"] [data-part="caption"][data-place="under"]{
margin-block-start:0.625rem;color:var(--vibeui-carousel-018-fg);
}
[data-vibeui-block="carousel-018"] [data-part="caption-title"]{
font-size:0.9375rem;font-weight:700;line-height:1.3;
}
[data-vibeui-block="carousel-018"] [data-part="caption-text"]{
font-size:0.8125rem;line-height:1.45;
}
[data-vibeui-block="carousel-018"] [data-part="caption"][data-place="under"] [data-part="caption-text"]{
color:var(--vibeui-carousel-018-muted);
}
[data-vibeui-block="carousel-018"] [data-part="caption"][data-place="over"] [data-part="caption-text"]{
color:oklch(0.98 0 0 / 82%);
}
[data-vibeui-block="carousel-018"] [data-part="dots"]{
display:flex;flex-wrap:wrap;gap:0.375rem;align-items:center;justify-content:center;
}
/* Точка — настоящая кнопка: попасть в 8 пикселей пальцем нельзя, поэтому
   у неё есть невидимое поле нажатия вокруг видимого кружка. */
[data-vibeui-block="carousel-018"] [data-part="dot"]{
display:inline-flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;padding:0;
appearance:none;cursor:pointer;border:0;border-radius:999px;background:none;
}
[data-vibeui-block="carousel-018"] [data-part="dot"]::before{
content:"";display:block;width:0.5rem;height:0.5rem;border-radius:999px;
background:var(--vibeui-carousel-018-dot);
transition:width var(--vibeui-carousel-018-fade) ease,background-color var(--vibeui-carousel-018-fade) ease;
}
[data-vibeui-block="carousel-018"] [data-part="dot"][aria-current="true"]::before{
width:1.125rem;background:var(--vibeui-carousel-018-accent);
}
[data-vibeui-block="carousel-018"] [data-part="dot"]:focus-visible{outline:2px solid var(--vibeui-carousel-018-accent);outline-offset:1px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="carousel-018"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SLIDES: Carousel018Slide[] = [
  {
    title: "Летняя коллекция",
    text: "Двадцать четыре модели, отшитые небольшими партиями.",
    hue: 22,
  },
  {
    title: "Северное направление",
    text: "Маршруты выходного дня в четырёх часах от города.",
    hue: 232,
  },
  {
    title: "Сезон подписки",
    text: "Первый месяц открыт, дальше можно уйти в один клик.",
    hue: 152,
  },
  {
    title: "Работа мастерской",
    text: "Каждую пятницу показываем, что вышло за неделю.",
    hue: 300,
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона.
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
 * Слайдер, где кадры растворяются друг в друге, а не едут лентой: точки-пейджер
 * и подпись слайда. Один файл, ноль зависимостей, кадры на градиентах.
 */
export function Carousel018({
  label = "Обложки раздела",
  slides = DEFAULT_SLIDES,
  ratio = "16:9",
  captionPlace = "over",
  dotsLabel = "Выбор слайда",
  background = "",
  accent,
  className,
  style,
  ...props
}: Carousel018Props) {
  const uid = useId()
  const dots = useRef(new Map<number, HTMLButtonElement>())
  const [index, setIndex] = useState(0)
  const total = slides.length
  const slide = slides[index] ?? slides[0]

  function go(next: number) {
    const target = (next + total) % total
    setIndex(target)
    dots.current.get(target)?.focus()
  }

  function onDotsKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault()
      go(index + 1)
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault()
      go(index - 1)
    } else if (event.key === "Home") {
      event.preventDefault()
      go(0)
    } else if (event.key === "End") {
      event.preventDefault()
      go(total - 1)
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-carousel-018-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-carousel-018-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-carousel-018" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="carousel"
        data-vibeui-block="carousel-018"
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <div
            data-part="stage"
            data-ratio={ratio}
            role="group"
            aria-label={label}
          >
            {slides.map((entry, position) => (
              <div
                key={entry.title}
                data-part="slide"
                data-current={position === index || undefined}
                aria-hidden={position === index ? undefined : true}
                style={
                  {
                    "--vibeui-carousel-018-hue": String(entry.hue),
                  } as CSSProperties
                }
              />
            ))}
          </div>
          <p
            data-part="caption"
            data-place={captionPlace}
            id={`${uid}-caption`}
            aria-live="polite"
          >
            <strong data-part="caption-title">{slide?.title}</strong>
            <span data-part="caption-text">{slide?.text}</span>
          </p>
        </div>

        <div
          data-part="dots"
          role="group"
          aria-label={dotsLabel}
          onKeyDown={onDotsKeyDown}
        >
          {slides.map((entry, position) => (
            <button
              key={entry.title}
              type="button"
              data-part="dot"
              aria-label={entry.title}
              aria-current={position === index || undefined}
              aria-controls={`${uid}-caption`}
              ref={(element) => {
                if (element) {
                  dots.current.set(position, element)
                } else {
                  dots.current.delete(position)
                }
              }}
              onClick={() => setIndex(position)}
            />
          ))}
        </div>
      </div>
    </>
  )
}
