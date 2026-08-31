"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Rating006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  legend?: string
  threshold?: number
  minLength?: number
  accent?: string
}

// Идея компонента: низкая оценка без объяснения бесполезна. Три звезды сами по
// себе не говорят, что чинить, поэтому ниже порога открывается обязательное
// поле комментария, а кнопка отправки остаётся выключенной, пока в нём меньше
// минимума символов. Поле появляется только при низкой оценке: требовать текст
// от довольного человека — верный способ потерять и оценку тоже. Счётчик
// символов показывает, сколько осталось, а не сколько написано: важен порог.
const STYLES = `
:where([data-vibeui-block="rating-006"]){
--vibeui-rating-006-surface:oklch(1 0 0);
--vibeui-rating-006-field:oklch(0.985 0.002 265);
--vibeui-rating-006-shell:oklch(0.9 0.006 265);
--vibeui-rating-006-fg:oklch(0.23 0.014 265);
--vibeui-rating-006-muted:oklch(0.55 0.014 265);
--vibeui-rating-006-border:oklch(0.88 0.008 265);
--vibeui-rating-006-empty:oklch(0.88 0.008 265);
--vibeui-rating-006-star:oklch(0.75 0.16 78);
--vibeui-rating-006-accent:oklch(0.55 0.17 265);
--vibeui-rating-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: форму показывают поверх любого фона. */
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
height:2.5rem;border-radius:0.625rem;
background:var(--vibeui-rating-006-accent);color:oklch(1 0 0);
font:inherit;font-size:0.8125rem;font-weight:650;
transition:opacity .14s ease;
}
[data-vibeui-block="rating-006"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-rating-006-accent);outline-offset:2px}
/* Кнопка выключена, а не молчит: иначе непонятно, почему ничего не происходит. */
[data-vibeui-block="rating-006"] [data-part="submit"]:disabled{opacity:.45;cursor:not-allowed}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="rating-006"] *{animation:none!important;transition:none!important}}
`

/**
 * Оценка звёздами, требующая комментарий, если оценка ниже порога.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Rating006({
  legend = "Оцените доставку",
  threshold = 3,
  minLength = 20,
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

  const palette = {
    ...(accent ? { "--vibeui-rating-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-rating-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
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
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={score === star}
              aria-label={`${star} из 5`}
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
            <label htmlFor={`${id}-reason`}>
              Что пошло не так? Без этого оценку не отправить
            </label>
            <textarea
              id={`${id}-reason`}
              value={reason}
              required
              aria-describedby={`${id}-counter`}
              placeholder="Курьер приехал на два часа позже окна…"
              onChange={(event) => setReason(event.target.value)}
            />
            <p id={`${id}-counter`} data-part="counter" aria-live="polite">
              {left > 0
                ? `Ещё ${left} символов до отправки`
                : "Достаточно, можно отправлять"}
            </p>
          </div>
        ) : null}
        <button type="button" data-part="submit" disabled={!ready}>
          Отправить оценку
        </button>
      </div>
    </>
  )
}
