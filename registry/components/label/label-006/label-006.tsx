"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Label006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  limit?: number
  defaultValue?: string
  accent?: string
}

// Идея компонента: счётчик — часть подписи, а не подпись под полем. Он
// стоит на правом краю той же строки, поэтому лимит виден до того, как
// человек начал печатать. Жёсткого maxLength нет намеренно: вставленный
// из буфера текст не должен молча обрезаться — он окрашивает счётчик и
// помечает поле неверным, а решает человек.
const STYLES = `
:where([data-vibeui-block="label-006"]){
--vibeui-label-006-surface:oklch(1 0 0);
--vibeui-label-006-surface-border:oklch(0.91 0.006 265);
--vibeui-label-006-fg:oklch(0.24 0.016 265);
--vibeui-label-006-muted:oklch(0.54 0.014 265);
--vibeui-label-006-field-border:oklch(0.85 0.01 265);
--vibeui-label-006-accent:oklch(0.55 0.2 262);
--vibeui-label-006-warn:oklch(0.62 0.15 65);
--vibeui-label-006-over:oklch(0.55 0.2 25);
--vibeui-label-006-radius:0.625rem;
--vibeui-label-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="label-006"]{
box-sizing:border-box;width:100%;max-width:26rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-label-006-surface);
border:1px solid var(--vibeui-label-006-surface-border);
font-family:var(--vibeui-label-006-font);color:var(--vibeui-label-006-fg);
display:flex;flex-direction:column;gap:0.4375rem;
}
[data-vibeui-block="label-006"] [data-part="row"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="label-006"] label{
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
}
/* Цифры счётчика прыгают по ширине, если шрифт пропорциональный:
   табличные цифры держат правый край на месте. */
[data-vibeui-block="label-006"] [data-part="count"]{
flex:none;font-size:0.75rem;font-variant-numeric:tabular-nums;
color:var(--vibeui-label-006-muted);transition:color .16s ease;
}
[data-vibeui-block="label-006"] [data-part="count"][data-state="near"]{color:var(--vibeui-label-006-warn)}
[data-vibeui-block="label-006"] [data-part="count"][data-state="over"]{color:var(--vibeui-label-006-over);font-weight:600}
[data-vibeui-block="label-006"] [data-part="live"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
}
[data-vibeui-block="label-006"] textarea{
box-sizing:border-box;width:100%;min-height:5.5rem;resize:vertical;
padding:0.5rem 0.75rem;
font:inherit;font-size:0.9375rem;line-height:1.45;
color:var(--vibeui-label-006-fg);background:var(--vibeui-label-006-surface);
border:1px solid var(--vibeui-label-006-field-border);
border-radius:var(--vibeui-label-006-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="label-006"] textarea:focus-visible{
outline:none;border-color:var(--vibeui-label-006-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-label-006-accent) 22%,transparent);
}
[data-vibeui-block="label-006"] textarea[aria-invalid="true"]{border-color:var(--vibeui-label-006-over)}
[data-vibeui-block="label-006"] textarea[aria-invalid="true"]:focus-visible{
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-label-006-over) 22%,transparent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="label-006"] *{animation:none!important;transition:none!important}}
`

/**
 * Подпись со счётчиком символов справа: лимит виден заранее, перебор
 * подсвечивается и не обрезает вставленный текст. Один файл, ноль
 * зависимостей.
 */
export function Label006({
  label = "Короткое описание",
  limit = 140,
  defaultValue = "Мастерская керамики в центре города: посуда ручной работы и занятия по выходным.",
  accent,
  className,
  style,
  ...props
}: Label006Props) {
  const id = useId()
  const countId = `${id}-count`
  const [value, setValue] = useState(defaultValue)
  const left = limit - value.length
  const state = left < 0 ? "over" : left <= 20 ? "near" : "ok"
  const palette = {
    ...(accent ? { "--vibeui-label-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-label-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="label-006"
        className={className}
        style={palette}
      >
        <div data-part="row">
          <label htmlFor={id}>{label}</label>
          <span data-part="count" data-state={state} id={countId}>
            {value.length} / {limit}
          </span>
        </div>
        <textarea
          id={id}
          name="summary"
          rows={3}
          value={value}
          aria-describedby={countId}
          aria-invalid={left < 0 || undefined}
          onChange={(event) => setValue(event.target.value)}
        />
        {/* Живое сообщение включается только у границы: озвучивать каждый
            символ — это шум, из-за которого выключают озвучку целиком. */}
        <p data-part="live" aria-live="polite">
          {state === "over"
            ? `Перебор на ${-left} символов`
            : state === "near"
              ? `Осталось ${left} символов`
              : ""}
        </p>
      </div>
    </>
  )
}
