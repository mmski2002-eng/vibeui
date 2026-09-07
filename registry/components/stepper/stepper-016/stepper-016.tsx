"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Stepper016Props = Omit<ComponentProps<"div">, "children"> & {
  /** Названия шагов: они же подписи под узлами. Разумно 3–5 штук. */
  steps?: string[]
  /** Шаг, с которого компонент стартует. Считается от единицы. */
  defaultStep?: number
  backLabel?: string
  nextLabel?: string
  accent?: string
  /** Пусто — подложки нет, компонент ложится на фон страницы. */
  background?: string
}

// Идея компонента: прогресс оформления, где движение объясняет переход. Заливка
// трека доезжает до следующего узла с перелётом, узел в этот момент хлопает —
// вместе это читается как «дошли сюда», а не как перерисованная полоска.
//
// Заливка тянется одним элементом через scaleX, а не шириной: transform не
// вызывает пересчёт раскладки, поэтому пружина идёт ровно даже на длинном
// списке шагов. Номер пройденного шага заменяется галочкой — так видно, что
// шаг закрыт, а не просто подсвечен.
const STYLES = `
:where([data-vibeui-block="stepper-016"]){
--vibeui-stepper-016-bg:transparent;
--vibeui-stepper-016-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-stepper-016-muted:color-mix(in oklab,var(--vibeui-stepper-016-fg) 58%,transparent);
--vibeui-stepper-016-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 14%));
--vibeui-stepper-016-card:light-dark(oklch(0.955 0 0),oklch(0.2178 0 0));
--vibeui-stepper-016-accent:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-stepper-016-on-accent:oklch(0.15 0.02 39.8);
--vibeui-stepper-016-ease:linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1);
--vibeui-stepper-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="stepper-016"]{color-scheme:dark}
[data-vibeui-block="stepper-016"]{
display:flex;flex-direction:column;gap:1.25rem;
width:100%;max-width:24rem;box-sizing:border-box;
background:var(--vibeui-stepper-016-bg);color:var(--vibeui-stepper-016-fg);
font-family:var(--vibeui-stepper-016-font);
}
[data-vibeui-block="stepper-016"] *{box-sizing:border-box}
[data-vibeui-block="stepper-016"] [data-part="rail"]{position:relative}
[data-vibeui-block="stepper-016"] [data-part="steps"]{
list-style:none;margin:0;padding:0;
display:flex;align-items:flex-start;
}
/* Трек начинается в центре первого узла и кончается в центре последнего.
   Отступ считается от числа шагов: узлы делят строку поровну, поэтому центр
   крайнего лежит на половине своей доли, а не на половине ширины узла. */
[data-vibeui-block="stepper-016"] [data-part="track"]{
position:absolute;top:0.9375rem;
left:var(--vibeui-stepper-016-inset);right:var(--vibeui-stepper-016-inset);
height:0.1875rem;
margin-top:-0.09375rem;border-radius:9999px;overflow:hidden;
background:color-mix(in oklab,var(--vibeui-stepper-016-fg) 16%,transparent);
}
[data-vibeui-block="stepper-016"] [data-part="fill"]{
display:block;height:100%;border-radius:9999px;
background:var(--vibeui-stepper-016-accent);
transform:scaleX(var(--vibeui-stepper-016-progress));transform-origin:left center;
transition:transform .5s cubic-bezier(.22,1.2,.36,1);
transition:transform .5s var(--vibeui-stepper-016-ease);
}
[data-vibeui-block="stepper-016"] [data-part="step"]{
position:relative;z-index:1;flex:1 1 0;min-width:0;
display:flex;flex-direction:column;align-items:center;gap:0.4375rem;
}
[data-vibeui-block="stepper-016"] [data-part="node"]{
width:1.875rem;height:1.875rem;border-radius:50%;
display:grid;place-items:center;
background:var(--vibeui-stepper-016-card);color:var(--vibeui-stepper-016-muted);
border:1px solid var(--vibeui-stepper-016-border);
font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums;
transition:transform .4s cubic-bezier(.22,1.2,.36,1),background-color .3s ease,border-color .3s ease,color .3s ease;
transition:transform .4s var(--vibeui-stepper-016-ease),background-color .3s ease,border-color .3s ease,color .3s ease;
}
[data-vibeui-block="stepper-016"] [data-part="node"] svg{width:1rem;height:1rem}
[data-vibeui-block="stepper-016"] [data-part="step"][data-state="done"] [data-part="node"],
[data-vibeui-block="stepper-016"] [data-part="step"][data-state="current"] [data-part="node"]{
background:var(--vibeui-stepper-016-accent);border-color:var(--vibeui-stepper-016-accent);
color:var(--vibeui-stepper-016-on-accent);
}
/* Хлопок достаётся только текущему узлу: если увеличивать все пройденные,
   взгляд теряет точку, до которой дошли. */
[data-vibeui-block="stepper-016"] [data-part="step"][data-state="current"] [data-part="node"]{transform:scale(1.18)}
[data-vibeui-block="stepper-016"] [data-part="caption"]{
font-size:0.6875rem;line-height:1.25;text-align:center;
color:var(--vibeui-stepper-016-muted);
transition:color .3s ease;
}
[data-vibeui-block="stepper-016"] [data-part="step"][data-state="current"] [data-part="caption"]{color:var(--vibeui-stepper-016-fg)}
[data-vibeui-block="stepper-016"] [data-part="controls"]{display:flex;gap:0.5rem;justify-content:center}
[data-vibeui-block="stepper-016"] [data-part="back"],
[data-vibeui-block="stepper-016"] [data-part="next"]{
appearance:none;cursor:pointer;min-height:2.25rem;padding:0.3125rem 1.125rem;
border-radius:9999px;font:inherit;font-size:0.8125rem;font-weight:650;
transition:border-color .2s ease,background-color .2s ease,opacity .2s ease;
}
[data-vibeui-block="stepper-016"] [data-part="back"]{
border:1px solid var(--vibeui-stepper-016-border);
background:var(--vibeui-stepper-016-card);color:var(--vibeui-stepper-016-fg);
}
[data-vibeui-block="stepper-016"] [data-part="back"]:hover:not(:disabled){border-color:var(--vibeui-stepper-016-accent)}
[data-vibeui-block="stepper-016"] [data-part="next"]{
border:1px solid var(--vibeui-stepper-016-accent);
background:var(--vibeui-stepper-016-accent);color:var(--vibeui-stepper-016-on-accent);
}
[data-vibeui-block="stepper-016"] [data-part="back"]:disabled,
[data-vibeui-block="stepper-016"] [data-part="next"]:disabled{cursor:not-allowed;opacity:.45}
[data-vibeui-block="stepper-016"] [data-part="back"]:focus-visible,
[data-vibeui-block="stepper-016"] [data-part="next"]:focus-visible{outline:2px solid var(--vibeui-stepper-016-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="stepper-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS = ["Корзина", "Доставка", "Оплата", "Готово"]

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
 * Прогресс по шагам: заливка трека с пружиной и хлопок текущего узла.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Stepper016({
  steps = DEFAULT_STEPS,
  defaultStep = 1,
  backLabel = "Назад",
  nextLabel = "Далее",
  accent,
  background = "",
  className,
  style,
  ...props
}: Stepper016Props) {
  const last = Math.max(steps.length, 1)
  const [step, setStep] = useState(Math.min(Math.max(defaultStep, 1), last))

  const current = Math.min(Math.max(step, 1), last)
  const progress = last > 1 ? (current - 1) / (last - 1) : 1

  const palette = {
    "--vibeui-stepper-016-progress": String(progress),
    "--vibeui-stepper-016-inset": `${50 / last}%`,
    ...(accent ? { "--vibeui-stepper-016-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-stepper-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-stepper-016" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="stepper"
        data-vibeui-block="stepper-016"
        className={className}
        style={palette}
      >
        <div data-part="rail">
          <span data-part="track" aria-hidden="true">
            <i data-part="fill" />
          </span>
          <ol data-part="steps">
            {steps.map((title, index) => {
              const state =
                index + 1 < current
                  ? "done"
                  : index + 1 === current
                    ? "current"
                    : "todo"

              return (
                <li
                  key={title}
                  data-part="step"
                  data-state={state}
                  aria-current={state === "current" ? "step" : undefined}
                >
                  <span data-part="node">
                    {state === "done" ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m5 12.5 4.5 4.5L19 7.5" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span data-part="caption">{title}</span>
                </li>
              )
            })}
          </ol>
        </div>
        <div data-part="controls">
          <button
            type="button"
            data-part="back"
            disabled={current <= 1}
            onClick={() => setStep((value) => Math.max(value - 1, 1))}
          >
            {backLabel}
          </button>
          <button
            type="button"
            data-part="next"
            disabled={current >= last}
            onClick={() => setStep((value) => Math.min(value + 1, last))}
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </>
  )
}
