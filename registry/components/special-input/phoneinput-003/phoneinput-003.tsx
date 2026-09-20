"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Phoneinput003Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  code?: string
  expected?: number
  placeholder?: string
  /** Шаблон строки о наборе: {typed}, {expected} и {code}. */
  progressText?: string
  /** Шаблон строки о готовности: {expected} и {code}. */
  doneText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: главная ошибка в телефоне — потерянная или лишняя
// цифра, и заметить её в сплошной строке невозможно. Здесь под полем
// стоит ряд точек: по одной на ожидаемую цифру. Набранные гаснут в
// заливку, и «не хватает одной» видно раньше, чем форма отправлена.
// Считаются именно цифры, а не символы: разделители не в счёт.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="phoneinput-003"]){
--vibeui-phoneinput-003-surface:transparent;
--vibeui-phoneinput-003-surface-border:light-dark(oklch(0.91 0 265),oklch(0.33 0 265));
--vibeui-phoneinput-003-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-phoneinput-003-muted:color-mix(in oklab,var(--vibeui-phoneinput-003-fg) 68%,transparent);
--vibeui-phoneinput-003-field-border:light-dark(oklch(0.85 0 265),oklch(0.4 0 265));
--vibeui-phoneinput-003-track:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-phoneinput-003-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-phoneinput-003-done:light-dark(oklch(0.55 0.15 155),oklch(0.74 0.14 155));
--vibeui-phoneinput-003-radius:0.625rem;
--vibeui-phoneinput-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="phoneinput-003"]{color-scheme:dark}
[data-vibeui-block="phoneinput-003"]{
box-sizing:border-box;width:100%;max-width:22rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-phoneinput-003-surface);
border:1px solid var(--vibeui-phoneinput-003-surface-border);
font-family:var(--vibeui-phoneinput-003-font);color:var(--vibeui-phoneinput-003-fg);
display:flex;flex-direction:column;gap:0.4375rem;
}
[data-vibeui-block="phoneinput-003"] label{
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
}
[data-vibeui-block="phoneinput-003"] [data-part="group"]{
display:flex;align-items:center;gap:0.5rem;
height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-phoneinput-003-field-border);
border-radius:var(--vibeui-phoneinput-003-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="phoneinput-003"] [data-part="group"]:has(input:focus-visible){
border-color:var(--vibeui-phoneinput-003-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-phoneinput-003-accent) 22%,transparent);
}
[data-vibeui-block="phoneinput-003"] [data-part="group"][data-state="done"]{
border-color:var(--vibeui-phoneinput-003-done);
}
[data-vibeui-block="phoneinput-003"] [data-part="prefix"]{
flex:none;font-size:0.9375rem;color:var(--vibeui-phoneinput-003-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="phoneinput-003"] input{
box-sizing:border-box;width:100%;min-width:0;
font:inherit;font-size:0.9375rem;font-variant-numeric:tabular-nums;
letter-spacing:0.04em;
color:var(--vibeui-phoneinput-003-fg);background:transparent;
border:0;outline:none;padding:0;
}
[data-vibeui-block="phoneinput-003"] input::placeholder{color:var(--vibeui-phoneinput-003-muted);letter-spacing:0}
[data-vibeui-block="phoneinput-003"] [data-part="dots"]{
display:flex;gap:0.1875rem;align-items:center;
}
[data-vibeui-block="phoneinput-003"] [data-part="dot"]{
flex:1 1 0;height:0.25rem;border-radius:999px;
background:var(--vibeui-phoneinput-003-track);
transition:background-color .16s ease;
}
[data-vibeui-block="phoneinput-003"] [data-part="dot"][data-filled="true"]{
background:var(--vibeui-phoneinput-003-accent);color:oklch(from var(--vibeui-phoneinput-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="phoneinput-003"] [data-part="dots"][data-state="done"] [data-part="dot"]{
background:var(--vibeui-phoneinput-003-done);
}
[data-vibeui-block="phoneinput-003"] [data-part="status"]{
margin:0;font-size:0.8125rem;line-height:1.4;
color:var(--vibeui-phoneinput-003-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="phoneinput-003"] [data-part="status"][data-state="done"]{
color:var(--vibeui-phoneinput-003-done);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="phoneinput-003"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Телефон с проверкой длины: ряд точек показывает, сколько цифр из
 * ожидаемых уже набрано. Один файл, ноль зависимостей.
 */
export function Phoneinput003({
  label = "Мобильный телефон",
  code = "+7",
  expected = 10,
  placeholder = "номер без кода страны",
  progressText = "{typed} из {expected} цифр после {code}",
  doneText = "Готово: {expected} цифр после {code}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Phoneinput003Props) {
  const id = useId()
  const statusId = `${id}-status`
  const [value, setValue] = useState("")
  const digits = value.replace(/\D/g, "").length
  const done = digits === expected
  const state = done ? "done" : "typing"
  const palette = {
    ...(accent ? { "--vibeui-phoneinput-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-phoneinput-003-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties
  const status = (done ? doneText : progressText)
    .replace("{typed}", String(digits))
    .replace("{expected}", String(expected))
    .replace("{code}", code)

  return (
    <>
      <style href="vibeui-phoneinput-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="phone-input"
        data-vibeui-block="phoneinput-003"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group" data-state={state}>
          <span data-part="prefix" aria-hidden="true">
            {code}
          </span>
          <input
            id={id}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={placeholder}
            value={value}
            aria-describedby={statusId}
            aria-invalid={value !== "" && !done ? true : undefined}
            onChange={(event) => setValue(event.target.value)}
          />
        </div>
        <div data-part="dots" data-state={state} aria-hidden="true">
          {Array.from({ length: expected }, (_, index) => (
            <span
              data-part="dot"
              data-filled={index < digits}
              key={`${id}-dot-${index}`}
            />
          ))}
        </div>
        <p
          data-part="status"
          data-state={state}
          id={statusId}
          aria-live="polite"
        >
          {status}
        </p>
      </div>
    </>
  )
}
