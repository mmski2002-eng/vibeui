"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Carousel006Story = {
  title: string
  hue?: number
}

export type Carousel006Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  stories?: Carousel006Story[]
  /** Секунд на один кадр. */
  seconds?: number
  label?: string
}

// Идея компонента: истории с полосками прогресса. Полоски показывают, сколько
// кадров всего и где мы сейчас, а пауза по наведению и по фокусу — то, чего
// не хватает почти всем таким лентам: без неё прочитать текст невозможно.
// При prefers-reduced-motion автопереход выключается совсем.
const STYLES = `
:where([data-vibeui-block="carousel-006"]){
--vibeui-carousel-006-fg:oklch(0.99 0.003 265);
--vibeui-carousel-006-muted:oklch(0.9 0.01 265);
--vibeui-carousel-006-track:oklch(1 0 0 / 35%);
--vibeui-carousel-006-seconds:6s;
--vibeui-carousel-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="carousel-006"]{
position:relative;display:flex;flex-direction:column;justify-content:flex-end;gap:0.375rem;
width:100%;max-width:15rem;aspect-ratio:9 / 16;
box-sizing:border-box;padding:0.75rem;overflow:hidden;
border-radius:1rem;
background:
radial-gradient(90% 60% at 30% 15%,oklch(0.88 0.07 var(--vibeui-carousel-006-hue,250)),transparent 70%),
linear-gradient(160deg,oklch(0.62 0.12 var(--vibeui-carousel-006-hue,250)),oklch(0.34 0.09 var(--vibeui-carousel-006-hue,250)));
color:var(--vibeui-carousel-006-fg);font-family:var(--vibeui-carousel-006-font);
}
/* Полоски сверху: сколько кадров всего и где мы сейчас. */
[data-vibeui-block="carousel-006"] [data-part="bars"]{
position:absolute;left:0.75rem;right:0.75rem;top:0.75rem;
display:flex;gap:0.25rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="carousel-006"] [data-part="bar"]{
flex:1;height:0.1875rem;border-radius:9999px;background:var(--vibeui-carousel-006-track);overflow:hidden;
}
[data-vibeui-block="carousel-006"] [data-part="fill"]{
display:block;height:100%;border-radius:inherit;background:var(--vibeui-carousel-006-fg);
transition:width .2s linear;
}
[data-vibeui-block="carousel-006"] [data-part="title"]{margin:0;font-size:1rem;font-weight:680;line-height:1.25}
[data-vibeui-block="carousel-006"] [data-part="hint"]{font-size:0.75rem;color:var(--vibeui-carousel-006-muted)}
[data-vibeui-block="carousel-006"] [data-part="taps"]{position:absolute;inset:0;display:flex}
[data-vibeui-block="carousel-006"] [data-part="taps"] button{
flex:1;appearance:none;border:0;background:transparent;cursor:pointer;
}
[data-vibeui-block="carousel-006"] [data-part="taps"] button:focus-visible{outline:2px solid var(--vibeui-carousel-006-fg);outline-offset:-4px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="carousel-006"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_STORIES: Carousel006Story[] = [
  { title: "Каталог живых компонентов", hue: 250 },
  { title: "Инструкция едет вместе с кодом", hue: 150 },
  { title: "Установка одной командой", hue: 30 },
]

/**
 * Истории с полосками прогресса и паузой по наведению и фокусу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Carousel006({
  stories = DEFAULT_STORIES,
  seconds = 6,
  label = "Истории",
  className,
  style,
  ...props
}: Carousel006Props) {
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const paused = useRef(false)

  useEffect(() => {
    // Шаг в 100 мс: полоска движется плавно, а таймеров остаётся немного.
    const step = 100 / ((seconds * 1000) / 100)
    const timer = setInterval(() => {
      if (paused.current) return
      setProgress((value) => {
        if (value + step < 100) return value + step
        setIndex((current) => (current + 1) % stories.length)
        return 0
      })
    }, 100)

    return () => clearInterval(timer)
  }, [seconds, stories.length])

  const palette = {
    "--vibeui-carousel-006-hue": stories[index]?.hue ?? 250,
    "--vibeui-carousel-006-seconds": `${seconds}s`,
    ...style,
  } as CSSProperties

  const go = (delta: number) => {
    setIndex((index + delta + stories.length) % stories.length)
    setProgress(0)
  }

  return (
    <>
      <style href="vibeui-carousel-006" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="carousel-006"
        aria-roledescription="карусель"
        aria-label={label}
        className={className}
        style={palette}
        onMouseEnter={() => {
          paused.current = true
        }}
        onMouseLeave={() => {
          paused.current = false
        }}
        onFocusCapture={() => {
          paused.current = true
        }}
        onBlurCapture={() => {
          paused.current = false
        }}
      >
        <ul data-part="bars">
          {stories.map((story, position) => (
            <li key={story.title} data-part="bar">
              <span
                data-part="fill"
                style={{
                  width:
                    position < index
                      ? "100%"
                      : position === index
                        ? `${progress}%`
                        : "0%",
                }}
              />
            </li>
          ))}
        </ul>
        <h3 data-part="title">{stories[index]?.title}</h3>
        <p data-part="hint">
          {index + 1} из {stories.length} · наведите, чтобы остановить
        </p>
        <div data-part="taps">
          <button
            type="button"
            aria-label="Предыдущий кадр"
            onClick={() => go(-1)}
          />
          <button
            type="button"
            aria-label="Следующий кадр"
            onClick={() => go(1)}
          />
        </div>
      </section>
    </>
  )
}
