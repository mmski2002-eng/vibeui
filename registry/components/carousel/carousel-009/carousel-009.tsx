"use client"

import { useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Carousel009Slide = {
  title: string
  text?: string
  hue?: number
}

export type Carousel009Props = Omit<ComponentProps<"section">, "children"> & {
  slides?: Carousel009Slide[]
  label?: string
  /** Роль секции для скринридера. */
  roleText?: string
  /** Имя группы точек для скринридера. */
  dotsLabel?: string
  /** Шаблон подписи точки: {index}, {total}, {label}. */
  dotText?: string
  /** Пусто — подложка своя; цвет заменяет её целиком. */
  background?: string
  accent?: string
}

// Идея компонента: точки — не украшение, а полноценный переключатель.
// Каждая точка это <button> с подписью «Слайд N из M», в ряду точек работают
// стрелки клавиатуры с переносом фокуса на выбранную точку, а лента едет
// трансформацией, а не прокруткой: так позиция задаётся числом и не зависит
// от того, куда пользователь докрутил пальцем. Невидимые слайды помечены
// inert, иначе Tab уходит за край кадра.
//
// Тема берётся из color-scheme окружения через light-dark(): карточка и точки
// темнеют вместе со страницей, своей тёмной темы компонент не носит.
const STYLES = `
:where([data-vibeui-block="carousel-009"]){
--vibeui-carousel-009-bg:light-dark(oklch(1 0 0),oklch(0.21 0.012 265));
--vibeui-carousel-009-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-carousel-009-muted:color-mix(in oklab,var(--vibeui-carousel-009-fg) 68%,transparent);
--vibeui-carousel-009-border:light-dark(oklch(0.91 0.006 265),oklch(0.37 0.012 265));
--vibeui-carousel-009-accent:light-dark(oklch(0.55 0.19 262),oklch(0.74 0.16 262));
--vibeui-carousel-009-index:0;
--vibeui-carousel-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="carousel-009"]{color-scheme:dark}
[data-vibeui-block="carousel-009"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-carousel-009-bg);
border:1px solid var(--vibeui-carousel-009-border);border-radius:1rem;
font-family:var(--vibeui-carousel-009-font);color:var(--vibeui-carousel-009-fg);
}
[data-vibeui-block="carousel-009"] [data-part="window"]{overflow:hidden;border-radius:0.875rem}
/* Позиция задаётся числом: одна переменная вместо прокрутки и её округлений. */
[data-vibeui-block="carousel-009"] [data-part="track"]{
display:flex;margin:0;padding:0;list-style:none;
transform:translateX(calc(var(--vibeui-carousel-009-index) * -100%));
transition:transform .32s ease;
}
/* Кадр стоит вместо фотографии: градиент и светлый текст на нём одинаковы
   в любой теме страницы, поэтому второй ветки у них нет. */
[data-vibeui-block="carousel-009"] [data-part="slide"]{
flex:0 0 100%;min-width:0;
display:flex;flex-direction:column;justify-content:flex-end;gap:0.25rem;
aspect-ratio:16 / 9;padding:1rem;box-sizing:border-box;
background:
radial-gradient(90% 80% at 22% 18%,oklch(0.9 0.06 var(--vibeui-carousel-009-hue,250)),transparent 70%),
linear-gradient(150deg,oklch(0.74 0.1 var(--vibeui-carousel-009-hue,250)),oklch(0.44 0.11 var(--vibeui-carousel-009-hue,250)));
color:oklch(0.99 0.003 265);
}
[data-vibeui-block="carousel-009"] [data-part="title"]{margin:0;font-size:1.0625rem;font-weight:680;line-height:1.2}
[data-vibeui-block="carousel-009"] [data-part="text"]{margin:0;font-size:0.8125rem;line-height:1.45;color:oklch(0.94 0.01 265);max-width:20rem}
[data-vibeui-block="carousel-009"] [data-part="dots"]{
display:flex;justify-content:center;align-items:center;gap:0.375rem;
}
/* Точка — настоящая кнопка с подписью: у неё есть фокус, роль и имя. */
[data-vibeui-block="carousel-009"] [data-part="dot"]{
appearance:none;cursor:pointer;padding:0;
width:1.5rem;height:1.5rem;border:0;border-radius:9999px;background:transparent;
display:inline-flex;align-items:center;justify-content:center;
}
[data-vibeui-block="carousel-009"] [data-part="dot"]::before{
content:"";width:0.5rem;height:0.5rem;border-radius:9999px;
background:var(--vibeui-carousel-009-border);
transition:background-color .16s ease,width .16s ease;
}
[data-vibeui-block="carousel-009"] [data-part="dot"]:hover::before{background:var(--vibeui-carousel-009-muted)}
[data-vibeui-block="carousel-009"] [data-part="dot"][aria-current="true"]::before{
width:1.125rem;background:var(--vibeui-carousel-009-accent);
}
[data-vibeui-block="carousel-009"] [data-part="dot"]:focus-visible{outline:2px solid var(--vibeui-carousel-009-accent);outline-offset:0}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="carousel-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SLIDES: Carousel009Slide[] = [
  {
    title: "Северный маршрут",
    text: "Четыре дня вдоль побережья с ночёвками в деревянных домах",
    hue: 220,
  },
  {
    title: "Горная петля",
    text: "Подъём на рассвете и спуск к озеру тем же днём",
    hue: 150,
  },
  {
    title: "Городские крыши",
    text: "Вечерняя прогулка по старым кварталам с гидом",
    hue: 30,
  },
  {
    title: "Долина ветров",
    text: "Два перевала и ночёвка в палатке",
    hue: 285,
  },
]

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
 * Карусель с точками-кнопками и управлением стрелками клавиатуры.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Carousel009({
  slides = DEFAULT_SLIDES,
  label = "Маршруты",
  roleText = "карусель",
  dotsLabel = "Переключение слайдов",
  dotText = "Слайд {index} из {total}: {label}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Carousel009Props) {
  const [index, setIndex] = useState(0)
  const dots = useRef<HTMLDivElement>(null)

  function go(next: number) {
    const target = (next + slides.length) % slides.length
    setIndex(target)
    const buttons = dots.current?.querySelectorAll("[data-part='dot']")
    ;(buttons?.[target] as HTMLButtonElement | undefined)?.focus()
  }

  const palette = {
    "--vibeui-carousel-009-index": index,
    ...(accent ? { "--vibeui-carousel-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-carousel-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-carousel-009" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="carousel"
        data-vibeui-block="carousel-009"
        aria-roledescription={roleText}
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="window">
          <ul data-part="track">
            {slides.map((slide, position) => (
              <li
                data-part="slide"
                key={slide.title}
                inert={position !== index}
                aria-hidden={position !== index}
                style={
                  {
                    "--vibeui-carousel-009-hue": slide.hue ?? 250,
                  } as CSSProperties
                }
              >
                <h3 data-part="title">{slide.title}</h3>
                {slide.text ? <p data-part="text">{slide.text}</p> : null}
              </li>
            ))}
          </ul>
        </div>
        <div
          data-part="dots"
          ref={dots}
          role="group"
          aria-label={dotsLabel}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault()
              go(index + 1)
            }
            if (event.key === "ArrowLeft") {
              event.preventDefault()
              go(index - 1)
            }
            if (event.key === "Home") {
              event.preventDefault()
              go(0)
            }
            if (event.key === "End") {
              event.preventDefault()
              go(slides.length - 1)
            }
          }}
        >
          {slides.map((slide, position) => (
            <button
              key={slide.title}
              type="button"
              data-part="dot"
              aria-current={position === index}
              aria-label={fill(dotText, {
                index: position + 1,
                total: slides.length,
                label: slide.title,
              })}
              onClick={() => setIndex(position)}
            />
          ))}
        </div>
      </section>
    </>
  )
}
