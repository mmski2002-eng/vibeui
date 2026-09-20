"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Label006Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  limit?: number
  defaultValue?: string
  /** Живое сообщение о переборе. {count} — на сколько символов перебор. */
  overText?: string
  /** Живое сообщение у границы. {count} — сколько символов осталось. */
  nearText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: счётчик — часть подписи, а не подпись под полем. Он
// стоит на правом краю той же строки, поэтому лимит виден до того, как
// человек начал печатать. Жёсткого maxLength нет намеренно: вставленный
// из буфера текст не должен молча обрезаться — он окрашивает счётчик и
// помечает поле неверным, а решает человек.
const STYLES = `
:where([data-vibeui-block="label-006"]){
--vibeui-label-006-surface:transparent;
--vibeui-label-006-surface-border:light-dark(oklch(0.91 0 265),oklch(0.33 0 265));
--vibeui-label-006-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-label-006-muted:color-mix(in oklab,var(--vibeui-label-006-fg) 68%,transparent);
--vibeui-label-006-field-border:light-dark(oklch(0.85 0 265),oklch(0.4 0 265));
--vibeui-label-006-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-label-006-warn:light-dark(oklch(0.62 0.15 65),oklch(0.79 0.13 65));
--vibeui-label-006-over:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-label-006-radius:0.625rem;
--vibeui-label-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="label-006"]{color-scheme:dark}
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
 * Подпись со счётчиком символов справа: лимит виден заранее, перебор
 * подсвечивается и не обрезает вставленный текст. Один файл, ноль
 * зависимостей.
 */
export function Label006({
  label = "Короткое описание",
  limit = 140,
  defaultValue = "Мастерская керамики в центре города: посуда ручной работы и занятия по выходным.",
  overText = "Перебор на {count} символов",
  nearText = "Осталось {count} символов",
  background = "",
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
    ...(background
      ? {
          "--vibeui-label-006-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-label-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="label"
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
            ? overText.replace("{count}", String(-left))
            : state === "near"
              ? nearText.replace("{count}", String(left))
              : ""}
        </p>
      </div>
    </>
  )
}
