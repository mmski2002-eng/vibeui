"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Rating003Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  max?: number
  defaultValue?: number
  hints?: string[]
  /** Подпись клетки для скринридера. {value} — балл, {max} — размер шкалы. */
  pointLabel?: string
  /** Подпись под левым краем шкалы. */
  lowAnchor?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: десятибалльная шкала как ряд пронумерованных клеток. Звёзды
// на десяти делениях перестают считываться — приходится пересчитывать значки
// глазами, а цифра называет оценку сразу. Клетки до выбранной закрашиваются,
// поэтому оценка читается и как число, и как длина. Группа собрана на ролях
// radiogroup/radio с ручным roving tabindex: десять кнопок в табуляции — это
// десять лишних нажатий Tab, поэтому фокус в группу входит один раз, а стрелки
// двигают выбор внутри.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="rating-003"]){
--vibeui-rating-003-surface:transparent;
--vibeui-rating-003-shell:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-rating-003-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-rating-003-muted:color-mix(in oklab,var(--vibeui-rating-003-fg) 68%,transparent);
--vibeui-rating-003-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-rating-003-empty:light-dark(oklch(0.97 0.003 265),oklch(0.26 0.01 265));
--vibeui-rating-003-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.15 265));
--vibeui-rating-003-on:light-dark(oklch(1 0 0),oklch(0.18 0.02 265));
--vibeui-rating-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="rating-003"]{color-scheme:dark}
/* Подложки по умолчанию нет: шкала ложится на фон страницы. */
[data-vibeui-block="rating-003"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-rating-003-surface);
border:1px solid var(--vibeui-rating-003-shell);border-radius:0.875rem;
font-family:var(--vibeui-rating-003-font);color:var(--vibeui-rating-003-fg);
}
[data-vibeui-block="rating-003"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;margin:0;
}
[data-vibeui-block="rating-003"] [data-part="title"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="rating-003"] [data-part="score"]{
font-size:0.8125rem;font-weight:700;color:var(--vibeui-rating-003-accent);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="rating-003"] [data-part="scale"]{display:flex;gap:0.1875rem}
[data-vibeui-block="rating-003"] button{
appearance:none;cursor:pointer;flex:1 1 0;min-width:0;
height:2.25rem;padding:0;
border:1px solid var(--vibeui-rating-003-border);border-radius:0.375rem;
background:var(--vibeui-rating-003-empty);color:var(--vibeui-rating-003-muted);
font:inherit;font-size:0.75rem;font-weight:700;font-variant-numeric:tabular-nums;
transition:background-color .12s ease,color .12s ease,border-color .12s ease;
}
/* Клетки до выбранной закрашены: оценка читается и числом, и длиной. */
[data-vibeui-block="rating-003"] button[data-filled="true"]{
background:color-mix(in oklch,var(--vibeui-rating-003-accent) 22%,var(--vibeui-rating-003-empty));
border-color:transparent;color:var(--vibeui-rating-003-fg);
}
[data-vibeui-block="rating-003"] button[aria-checked="true"]{
background:var(--vibeui-rating-003-accent);border-color:transparent;
color:var(--vibeui-rating-003-on);
}
[data-vibeui-block="rating-003"] button:focus-visible{outline:2px solid var(--vibeui-rating-003-accent);outline-offset:2px}
[data-vibeui-block="rating-003"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;margin:0;
font-size:0.6875rem;color:var(--vibeui-rating-003-muted);
}
[data-vibeui-block="rating-003"] [data-part="hint"]{
font-size:0.75rem;font-weight:650;color:var(--vibeui-rating-003-fg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="rating-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_HINTS = [
  "никогда",
  "очень плохо",
  "плохо",
  "слабо",
  "терпимо",
  "средне",
  "неплохо",
  "хорошо",
  "очень хорошо",
  "отлично",
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Десятибалльная шкала пронумерованными клетками с накопительной заливкой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Rating003({
  label = "Оцените сервис",
  max = 10,
  defaultValue = 8,
  hints = DEFAULT_HINTS,
  pointLabel = "{value} из {max}",
  lowAnchor = "1 — совсем плохо",
  background = "",
  accent,
  className,
  style,
  ...props
}: Rating003Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const points = Array.from({ length: max }, (_, index) => index + 1)

  // Стрелки двигают выбор внутри группы: десять кнопок в табуляции — это
  // десять лишних нажатий Tab до следующего поля формы.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const delta =
      event.key === "ArrowRight" || event.key === "ArrowUp"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowDown"
          ? -1
          : 0
    if (delta === 0) return
    event.preventDefault()
    setValue(Math.min(max, Math.max(1, value + delta)))
  }

  const palette = {
    ...(accent ? { "--vibeui-rating-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-rating-003-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-rating-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="rating"
        data-vibeui-block="rating-003"
        className={className}
        style={palette}
      >
        <p data-part="head">
          <span data-part="title" id={`${id}-label`}>
            {label}
          </span>
          <span data-part="score" aria-live="polite">
            {value} / {max}
          </span>
        </p>
        <div
          data-part="scale"
          role="radiogroup"
          aria-labelledby={`${id}-label`}
          onKeyDown={onKeyDown}
        >
          {points.map((point) => (
            <button
              key={point}
              type="button"
              role="radio"
              aria-checked={value === point}
              aria-label={pointLabel
                .replace("{value}", String(point))
                .replace("{max}", String(max))}
              tabIndex={value === point ? 0 : -1}
              data-filled={point < value}
              onClick={() => setValue(point)}
            >
              {point}
            </button>
          ))}
        </div>
        <p data-part="foot">
          <span>{lowAnchor}</span>
          <span data-part="hint">{hints[value - 1]}</span>
        </p>
      </div>
    </>
  )
}
