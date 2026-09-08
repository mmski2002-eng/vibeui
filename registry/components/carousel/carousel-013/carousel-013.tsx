"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Carousel013Shot = {
  title: string
  place?: string
  hue?: number
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
}

export type Carousel013Props = Omit<ComponentProps<"section">, "children"> & {
  shots?: Carousel013Shot[]
  label?: string
  /** Роль блока для скринридера: компонент несёт русскую, проект подставит свою. */
  roleDescription?: string
  /** Подпись полосы миниатюр. */
  stripLabel?: string
  /** Шаблон подписи миниатюры: {n} — номер кадра, {title} — его заголовок. */
  thumbLabel?: string
  /** Подсказка под полосой. Пусто — подсказки нет. */
  hint?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: полоса миниатюр под кадром, по которой ходят стрелками.
// Миниатюр обычно больше, чем влезает в ширину, поэтому выбранная сама
// доезжает до центра полосы — scrollIntoView с inline:"center" и
// block:"nearest", чтобы прокрутить полосу и не дёрнуть страницу. Выбор
// помечен рамкой и подписью «кадр N», а не только яркостью: приглушение
// соседей на маленьком экране почти незаметно.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="carousel-013"]){
--vibeui-carousel-013-bg:transparent;
--vibeui-carousel-013-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-carousel-013-muted:color-mix(in oklab,var(--vibeui-carousel-013-fg) 68%,transparent);
--vibeui-carousel-013-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-carousel-013-accent:light-dark(oklch(0.55 0.19 39.8),oklch(0.74 0.16 39.8));
--vibeui-carousel-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="carousel-013"]{color-scheme:dark}
[data-vibeui-block="carousel-013"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-carousel-013-bg);
border:1px solid var(--vibeui-carousel-013-border);border-radius:1rem;
font-family:var(--vibeui-carousel-013-font);color:var(--vibeui-carousel-013-fg);
}
/* Кадр и миниатюры стоят вместо фотографий: градиент, светлый текст и
   счётчик на затемнении одинаковы в любой теме страницы — второй ветки
   у них нет. */
[data-vibeui-block="carousel-013"] [data-part="stage"]{
position:relative;display:flex;flex-direction:column;justify-content:flex-end;
aspect-ratio:16 / 10;padding:0.875rem;box-sizing:border-box;overflow:hidden;
border-radius:0.875rem;
color:oklch(0.99 0 265);
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="carousel-013"] [data-part="stage"][data-empty="true"]{background:
radial-gradient(90% 80% at 20% 20%,oklch(0.9 0.06 var(--vibeui-carousel-013-hue,250)),transparent 70%),
linear-gradient(150deg,oklch(0.74 0.1 var(--vibeui-carousel-013-hue,250)),oklch(0.42 0.11 var(--vibeui-carousel-013-hue,250)));}
[data-vibeui-block="carousel-013"] [data-part="stage"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="carousel-013"] [data-part="name"]{margin:0;font-size:1rem;font-weight:680;line-height:1.2}
[data-vibeui-block="carousel-013"] [data-part="place"]{margin:0.125rem 0 0;font-size:0.75rem;color:oklch(0.93 0 265)}
[data-vibeui-block="carousel-013"] [data-part="counter"]{
position:absolute;right:0.625rem;top:0.625rem;
padding:0.125rem 0.4375rem;border-radius:9999px;
background:oklch(0.2 0 265 / 45%);color:oklch(1 0 0);
font-size:0.6875rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="carousel-013"] [data-part="thumbs"]{
display:flex;gap:0.375rem;margin:0;padding:0.125rem 0 0.25rem;list-style:none;
overflow-x:auto;overscroll-behavior-x:contain;scroll-behavior:smooth;scrollbar-width:none;
}
[data-vibeui-block="carousel-013"] [data-part="thumbs"]::-webkit-scrollbar{display:none}
[data-vibeui-block="carousel-013"] [data-part="thumb"]{
position:relative;appearance:none;cursor:pointer;flex:none;padding:0;
width:3.5rem;aspect-ratio:4 / 3;border-radius:0.5rem;overflow:hidden;
border:2px solid transparent;
opacity:.65;transition:opacity .16s ease,border-color .16s ease;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="carousel-013"] [data-part="thumb"][data-empty="true"]{background:linear-gradient(150deg,oklch(0.82 0.08 var(--vibeui-carousel-013-hue,250)),oklch(0.55 0.1 var(--vibeui-carousel-013-hue,250)));}
[data-vibeui-block="carousel-013"] [data-part="thumb"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="carousel-013"] [data-part="thumb"]:hover{opacity:1}
[data-vibeui-block="carousel-013"] [data-part="thumb"]:focus-visible{outline:2px solid var(--vibeui-carousel-013-accent);outline-offset:2px}
/* Рамка, а не только яркость: приглушение соседей на телефоне почти не видно. */
[data-vibeui-block="carousel-013"] [data-part="thumb"][aria-current="true"]{
opacity:1;border-color:var(--vibeui-carousel-013-accent);
}
[data-vibeui-block="carousel-013"] [data-part="hint"]{
font-size:0.6875rem;color:var(--vibeui-carousel-013-muted);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="carousel-013"] [data-part="thumbs"]{scroll-behavior:auto}
[data-vibeui-block="carousel-013"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_SHOTS: Carousel013Shot[] = [
  { title: "Утро в порту", place: "Мурманск", hue: 220 },
  { title: "Дорога на перевал", place: "Алтай", hue: 150 },
  { title: "Старый мост", place: "Псков", hue: 40 },
  { title: "Тихая бухта", place: "Приморье", hue: 190 },
  { title: "Поле под снегом", place: "Вологда", hue: 280 },
  { title: "Крыши на закате", place: "Казань", hue: 20 },
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
 * Галерея с полосой миниатюр: выбранная доезжает до центра, стрелки работают.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Carousel013({
  shots = DEFAULT_SHOTS,
  label = "Галерея",
  roleDescription = "карусель",
  stripLabel = "Кадры",
  thumbLabel = "Кадр {n}: {title}",
  hint = "Стрелками ← и → можно перейти к соседнему кадру.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Carousel013Props) {
  const [index, setIndex] = useState(0)
  const strip = useRef<HTMLDivElement>(null)

  useEffect(() => {
    strip.current
      ?.querySelector(`[data-part="thumb"][aria-current="true"]`)
      ?.scrollIntoView({ block: "nearest", inline: "center" })
  }, [index])

  function go(next: number) {
    const target = (next + shots.length) % shots.length
    setIndex(target)
    const buttons = strip.current?.querySelectorAll("[data-part='thumb']")
    ;(buttons?.[target] as HTMLButtonElement | undefined)?.focus()
  }

  const shot = shots[index]

  const palette = {
    "--vibeui-carousel-013-hue": shot.hue ?? 250,
    ...(accent ? { "--vibeui-carousel-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-carousel-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-carousel-013" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="carousel"
        data-vibeui-block="carousel-013"
        aria-roledescription={roleDescription}
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="stage" data-empty={shot.image ? undefined : "true"}>
          {shot.image ? (
            <img src={shot.image} alt="" loading="lazy" decoding="async" />
          ) : null}
          <span data-part="counter">
            {index + 1}/{shots.length}
          </span>
          <p data-part="name">{shot.title}</p>
          {shot.place ? <p data-part="place">{shot.place}</p> : null}
        </div>
        <div
          data-part="thumbs"
          ref={strip}
          role="group"
          aria-label={stripLabel}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault()
              go(index + 1)
            }
            if (event.key === "ArrowLeft") {
              event.preventDefault()
              go(index - 1)
            }
          }}
        >
          {shots.map((item, position) => (
            <button
              key={item.title}
              type="button"
              data-part="thumb"
              data-empty={item.image ? undefined : "true"}
              aria-current={position === index}
              aria-label={thumbLabel
                .replace("{n}", String(position + 1))
                .replace("{title}", item.title)}
              style={
                {
                  "--vibeui-carousel-013-hue": item.hue ?? 250,
                } as CSSProperties
              }
              onClick={() => setIndex(position)}
            >
              {item.image ? (
                <img src={item.image} alt="" loading="lazy" decoding="async" />
              ) : null}
            </button>
          ))}
        </div>
        {hint ? <span data-part="hint">{hint}</span> : null}
      </section>
    </>
  )
}
