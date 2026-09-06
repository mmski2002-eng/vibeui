"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Rating006Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  legend?: string
  threshold?: number
  minLength?: number
  /** Подпись звезды для скринридера. {value} — номер звезды. */
  starLabel?: string
  /** Подпись поля комментария. */
  reasonLabel?: string
  /** Подсказка внутри поля комментария. */
  reasonPlaceholder?: string
  /** Счётчик, пока символов не хватает. {left} — сколько осталось. */
  counterText?: string
  /** Счётчик, когда символов уже достаточно. */
  counterDoneText?: string
  /** Подпись кнопки отправки. */
  submitText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: низкая оценка без объяснения бесполезна. Три звезды сами по
// себе не говорят, что чинить, поэтому ниже порога открывается обязательное
// поле комментария, а кнопка отправки остаётся выключенной, пока в нём меньше
// минимума символов. Поле появляется только при низкой оценке: требовать текст
// от довольного человека — верный способ потерять и оценку тоже. Счётчик
// символов показывает, сколько осталось, а не сколько написано: важен порог.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="rating-006"]){
--vibeui-rating-006-surface:transparent;
--vibeui-rating-006-field:light-dark(oklch(0.985 0 265),oklch(0.26 0 265));
--vibeui-rating-006-shell:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-rating-006-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-rating-006-muted:color-mix(in oklab,var(--vibeui-rating-006-fg) 68%,transparent);
--vibeui-rating-006-border:light-dark(oklch(0.88 0 265),oklch(0.38 0 265));
--vibeui-rating-006-empty:light-dark(oklch(0.88 0 265),oklch(0.42 0 265));
--vibeui-rating-006-star:light-dark(oklch(0.75 0.16 78),oklch(0.84 0.15 80));
--vibeui-rating-006-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.15 265));
--vibeui-rating-006-on:light-dark(oklch(1 0 0),oklch(0.18 0 265));
--vibeui-rating-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="rating-006"]{color-scheme:dark}
/* Подложки по умолчанию нет: форма ложится на фон страницы. */
[data-vibeui-block="rating-006"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-rating-006-surface);
border:1px solid var(--vibeui-rating-006-shell);border-radius:0.875rem;
font-family:var(--vibeui-rating-006-font);color:var(--vibeui-rating-006-fg);
}
[data-vibeui-block="rating-006"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="rating-006"] [data-part="stars"]{display:flex;gap:0.125rem}
[data-vibeui-block="rating-006"] [data-part="stars"] button{
appearance:none;border:0;background:none;cursor:pointer;padding:0.125rem;
border-radius:0.375rem;line-height:1;
font-size:1.75rem;color:var(--vibeui-rating-006-empty);
transition:color .12s ease;
}
[data-vibeui-block="rating-006"] [data-part="stars"] button[data-on="true"]{color:var(--vibeui-rating-006-star)}
[data-vibeui-block="rating-006"] [data-part="stars"] button:focus-visible{outline:2px solid var(--vibeui-rating-006-accent);outline-offset:1px}
/* Поле появляется только ниже порога: требовать текст у довольного — терять оценку. */
[data-vibeui-block="rating-006"] [data-part="reason"]{display:flex;flex-direction:column;gap:0.375rem}
[data-vibeui-block="rating-006"] label{font-size:0.75rem;font-weight:650}
[data-vibeui-block="rating-006"] textarea{
width:100%;box-sizing:border-box;min-height:4.5rem;resize:vertical;
padding:0.5rem 0.625rem;
background:var(--vibeui-rating-006-field);color:inherit;
border:1px solid var(--vibeui-rating-006-border);border-radius:0.625rem;
font:inherit;font-size:0.8125rem;line-height:1.45;
}
[data-vibeui-block="rating-006"] textarea:focus-visible{
outline:2px solid var(--vibeui-rating-006-accent);outline-offset:1px;border-color:var(--vibeui-rating-006-accent);
}
[data-vibeui-block="rating-006"] [data-part="counter"]{
margin:0;font-size:0.6875rem;color:var(--vibeui-rating-006-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="rating-006"] [data-part="submit"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.5rem;padding:0.25rem 0.875rem;border-radius:0.625rem;
background:var(--vibeui-rating-006-accent);color:var(--vibeui-rating-006-on);
font:inherit;font-size:0.8125rem;font-weight:650;
transition:opacity .14s ease;
}
[data-vibeui-block="rating-006"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-rating-006-accent);outline-offset:2px}
/* Кнопка выключена, а не молчит: иначе непонятно, почему ничего не происходит. */
[data-vibeui-block="rating-006"] [data-part="submit"]:disabled{opacity:.45;cursor:not-allowed}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="rating-006"] *{animation:none!important;transition:none!important}}
`

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
 * Оценка звёздами, требующая комментарий, если оценка ниже порога.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Rating006({
  legend = "Оцените доставку",
  threshold = 3,
  minLength = 20,
  starLabel = "{value} из 5",
  reasonLabel = "Что пошло не так? Без этого оценку не отправить",
  reasonPlaceholder = "Курьер приехал на два часа позже окна…",
  counterText = "Ещё {left} символов до отправки",
  counterDoneText = "Достаточно, можно отправлять",
  submitText = "Отправить оценку",
  background = "",
  accent,
  className,
  style,
  ...props
}: Rating006Props) {
  const id = useId()
  const [score, setScore] = useState(0)
  const [reason, setReason] = useState("")
  const needsReason = score > 0 && score <= threshold
  const left = Math.max(0, minLength - reason.trim().length)
  const ready = score > 0 && (!needsReason || left === 0)

  // Стрелки двигают выбор внутри группы: пять звёзд в табуляции — это четыре
  // лишних нажатия Tab до поля причины.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const delta =
      event.key === "ArrowRight" || event.key === "ArrowUp"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowDown"
          ? -1
          : 0
    if (delta === 0) return
    event.preventDefault()
    setScore(Math.min(5, Math.max(1, (score || 1) + delta)))
  }

  const palette = {
    ...(accent ? { "--vibeui-rating-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-rating-006-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-rating-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="rating"
        data-vibeui-block="rating-006"
        className={className}
        style={palette}
      >
        <p data-part="title" id={`${id}-title`}>
          {legend}
        </p>
        <div
          data-part="stars"
          role="radiogroup"
          aria-labelledby={`${id}-title`}
          onKeyDown={onKeyDown}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={score === star}
              aria-label={starLabel.replace("{value}", String(star))}
              tabIndex={score === star || (score === 0 && star === 1) ? 0 : -1}
              data-on={star <= score}
              onClick={() => setScore(star)}
            >
              ★
            </button>
          ))}
        </div>
        {needsReason ? (
          <div data-part="reason">
            <label htmlFor={`${id}-reason`}>{reasonLabel}</label>
            <textarea
              id={`${id}-reason`}
              value={reason}
              required
              aria-describedby={`${id}-counter`}
              placeholder={reasonPlaceholder}
              onChange={(event) => setReason(event.target.value)}
            />
            <p id={`${id}-counter`} data-part="counter" aria-live="polite">
              {left > 0
                ? counterText.replace("{left}", String(left))
                : counterDoneText}
            </p>
          </div>
        ) : null}
        <button type="button" data-part="submit" disabled={!ready}>
          {submitText}
        </button>
      </div>
    </>
  )
}
