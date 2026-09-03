"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Slider005Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  defaultValue?: number
  muteText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: громкость с иконкой, которая живёт вместе со звуком.
// Волны у динамика гаснут по мере убывания громкости, а кнопка слева не
// просто рисунок: она глушит звук и возвращает прежний уровень обратно —
// это единственный жест, который человек делает чаще, чем тянет ползунок.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="slider-005"]){
--vibeui-slider-005-bg:transparent;
--vibeui-slider-005-surface:light-dark(oklch(1 0 0),oklch(0.28 0.012 265));
--vibeui-slider-005-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-slider-005-muted:color-mix(in oklab,var(--vibeui-slider-005-fg) 68%,transparent);
--vibeui-slider-005-border:light-dark(oklch(0.9 0.006 265),oklch(0.37 0.012 265));
--vibeui-slider-005-track:light-dark(oklch(0.92 0.006 265),oklch(0.42 0.012 265));
--vibeui-slider-005-accent:light-dark(oklch(0.55 0.19 300),oklch(0.74 0.16 300));
--vibeui-slider-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-slider-005-fill:60%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="slider-005"]{color-scheme:dark}
[data-vibeui-block="slider-005"]{
display:flex;align-items:center;gap:0.75rem;
width:100%;max-width:19rem;box-sizing:border-box;padding:0.75rem 0.875rem;
background:var(--vibeui-slider-005-bg);
border:1px solid var(--vibeui-slider-005-border);border-radius:0.875rem;
font-family:var(--vibeui-slider-005-font);color:var(--vibeui-slider-005-fg);
}
[data-vibeui-block="slider-005"] [data-part="mute"]{
appearance:none;flex:none;cursor:pointer;
display:grid;place-items:center;
width:2rem;height:2rem;padding:0;border:0;border-radius:0.5rem;
background:transparent;color:var(--vibeui-slider-005-fg);
transition:background-color .16s ease;
}
[data-vibeui-block="slider-005"] [data-part="mute"]:hover{background:color-mix(in oklab,var(--vibeui-slider-005-accent) 10%,transparent)}
[data-vibeui-block="slider-005"] [data-part="mute"]:focus-visible{outline:2px solid var(--vibeui-slider-005-accent);outline-offset:2px}
[data-vibeui-block="slider-005"] [data-part="icon"]{position:relative;width:1.25rem;height:0.875rem}
/* Динамик: корпус и раструб вырезаны одним clip-path — иконка без SVG
   и без пакета иконок. Волны лежат снаружи, иначе обрезка съела бы их. */
[data-vibeui-block="slider-005"] [data-part="speaker"]{
position:absolute;left:0;top:50%;margin-top:-0.375rem;
width:0.75rem;height:0.75rem;background:currentColor;
clip-path:polygon(0 30%,35% 30%,70% 0,70% 100%,35% 70%,0 70%);
}
/* Волны: дуги из кругов, у которых видна только правая грань. */
[data-vibeui-block="slider-005"] [data-part="wave"]{
position:absolute;top:50%;
border:1.5px solid currentColor;border-radius:9999px;
border-left-color:transparent;border-bottom-color:transparent;border-top-color:transparent;
transform:translateY(-50%);
}
[data-vibeui-block="slider-005"] [data-part="wave"]{left:0.5rem;width:0.5rem;height:0.5rem}
/* Вторая дуга выбирается соседним комбинатором, а не nth-of-type:
   тип у всех трёх узлов один и тот же — span. */
[data-vibeui-block="slider-005"] [data-part="wave"] + [data-part="wave"]{left:0.4375rem;width:0.875rem;height:0.875rem}
[data-vibeui-block="slider-005"][data-level="0"] [data-part="wave"]{opacity:0}
[data-vibeui-block="slider-005"][data-level="1"] [data-part="wave"] + [data-part="wave"]{opacity:0}
[data-vibeui-block="slider-005"][data-level="0"] [data-part="icon"]{color:var(--vibeui-slider-005-muted)}
[data-vibeui-block="slider-005"] [data-part="rail"]{flex:1 1 auto;min-width:0;display:flex;align-items:center}
[data-vibeui-block="slider-005"] input{
appearance:none;width:100%;height:1.25rem;margin:0;background:none;cursor:pointer;
}
[data-vibeui-block="slider-005"] input::-webkit-slider-runnable-track{
height:0.25rem;border-radius:9999px;
background:linear-gradient(to right,var(--vibeui-slider-005-accent) var(--vibeui-slider-005-fill),var(--vibeui-slider-005-track) var(--vibeui-slider-005-fill));
}
[data-vibeui-block="slider-005"] input::-moz-range-track{
height:0.25rem;border-radius:9999px;
background:linear-gradient(to right,var(--vibeui-slider-005-accent) var(--vibeui-slider-005-fill),var(--vibeui-slider-005-track) var(--vibeui-slider-005-fill));
}
[data-vibeui-block="slider-005"] input::-webkit-slider-thumb{
appearance:none;margin-top:-0.375rem;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-slider-005-accent);border:3px solid var(--vibeui-slider-005-surface);
box-shadow:0 1px 4px oklch(0.2 0.02 265 / 30%);
}
[data-vibeui-block="slider-005"] input::-moz-range-thumb{
width:1rem;height:1rem;border-radius:9999px;box-sizing:border-box;
background:var(--vibeui-slider-005-accent);border:3px solid var(--vibeui-slider-005-surface);
}
[data-vibeui-block="slider-005"] input:focus-visible{outline:2px solid var(--vibeui-slider-005-accent);outline-offset:4px;border-radius:0.5rem}
[data-vibeui-block="slider-005"] [data-part="value"]{
flex:none;min-width:2.25rem;text-align:right;
font-size:0.8125rem;font-weight:600;font-variant-numeric:tabular-nums;
color:var(--vibeui-slider-005-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="slider-005"] *{animation:none!important;transition:none!important}}
`

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
 * Ползунок громкости: иконка динамика реагирует на уровень, кнопка глушит звук.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Slider005({
  label = "Громкость",
  defaultValue = 60,
  muteText = "Выключить звук",
  background = "",
  accent,
  className,
  style,
  ...props
}: Slider005Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [previous, setPrevious] = useState(defaultValue || 50)
  const level = value === 0 ? 0 : value < 50 ? 1 : 2

  const palette = {
    "--vibeui-slider-005-fill": `${value}%`,
    ...(accent ? { "--vibeui-slider-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-slider-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-slider-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="slider"
        data-vibeui-block="slider-005"
        data-level={level}
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="mute"
          aria-pressed={value === 0}
          aria-label={muteText}
          onClick={() => {
            if (value === 0) {
              setValue(previous)
              return
            }
            setPrevious(value)
            setValue(0)
          }}
        >
          <span data-part="icon" aria-hidden="true">
            <span data-part="speaker" />
            <span data-part="wave" />
            <span data-part="wave" />
          </span>
        </button>
        <span data-part="rail">
          <input
            id={id}
            type="range"
            min={0}
            max={100}
            step={1}
            value={value}
            aria-label={label}
            onChange={(event) => setValue(Number(event.target.value))}
          />
        </span>
        <span data-part="value">{value}%</span>
      </div>
    </>
  )
}
