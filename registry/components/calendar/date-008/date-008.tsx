"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Date008Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  defaultValue?: string
  stepMinutes?: number
  openAt?: string
  closeAt?: string
  /** Подписи кнопок сдвига с подстановкой {minutes}. */
  earlierLabel?: string
  laterLabel?: string
  /** Строка о шаге с подстановкой {minutes}. */
  stepText?: string
  /** Строка о часах приёма с подстановками {open} и {close}. */
  hoursText?: string
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: время по сетке в четверть часа. Запись «на 14:07» не нужна
// никому, но нативное поле её позволяет, поэтому любое введённое значение
// округляется до ближайшей четверти. Кнопки сдвигают время на шаг и заодно
// выравнивают по сетке: сдвиг от 14:07 даёт 14:15, а не 14:22. Границы работы
// заданы через min и max, и за них не выйдут ни кнопки, ни клавиатура.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="date-008"]){
--vibeui-date-008-surface:transparent;
--vibeui-date-008-field:light-dark(oklch(0.985 0 265),oklch(0.27 0 265));
--vibeui-date-008-shell:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-date-008-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-date-008-muted:color-mix(in oklab,var(--vibeui-date-008-fg) 68%,transparent);
--vibeui-date-008-border:light-dark(oklch(0.88 0 265),oklch(0.42 0 265));
--vibeui-date-008-accent:light-dark(oklch(0.275 0 0),oklch(0.906 0 0));
--vibeui-date-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="date-008"]{color-scheme:dark}
/* Подложки по умолчанию нет: рамка держит форму, фон приходит со страницы. */
[data-vibeui-block="date-008"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:19rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-date-008-surface);
border:1px solid var(--vibeui-date-008-shell);border-radius:0.875rem;
font-family:var(--vibeui-date-008-font);color:var(--vibeui-date-008-fg);
}
[data-vibeui-block="date-008"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="date-008"] [data-part="row"]{display:flex;align-items:stretch;gap:0.375rem}
[data-vibeui-block="date-008"] input{
flex:1 1 auto;min-width:0;box-sizing:border-box;
height:2.75rem;padding:0 0.75rem;text-align:center;
background:var(--vibeui-date-008-field);color:inherit;
border:1px solid var(--vibeui-date-008-border);border-radius:0.625rem;
font:inherit;font-size:1.125rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="date-008"] input:focus-visible{
outline:2px solid var(--vibeui-date-008-accent);outline-offset:1px;border-color:var(--vibeui-date-008-accent);
}
[data-vibeui-block="date-008"] input::-webkit-calendar-picker-indicator{display:none}
/* Кнопки сдвигают на шаг и заодно выравнивают по сетке. */
[data-vibeui-block="date-008"] button{
appearance:none;cursor:pointer;flex:none;
width:2.75rem;height:2.75rem;
border:1px solid var(--vibeui-date-008-border);border-radius:0.625rem;
background:var(--vibeui-date-008-surface);color:inherit;
font:inherit;font-size:0.6875rem;font-weight:700;line-height:1.1;
transition:border-color .14s ease,color .14s ease;
}
[data-vibeui-block="date-008"] button:hover:not(:disabled){border-color:var(--vibeui-date-008-accent);color:var(--vibeui-date-008-accent)}
[data-vibeui-block="date-008"] button:focus-visible{outline:2px solid var(--vibeui-date-008-accent);outline-offset:2px}
[data-vibeui-block="date-008"] button:disabled{opacity:.4;cursor:default}
[data-vibeui-block="date-008"] [data-part="hint"]{
display:flex;justify-content:space-between;gap:0.75rem;margin:0;
font-size:0.75rem;color:var(--vibeui-date-008-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="date-008"] *{animation:none!important;transition:none!important}}
`

function toMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number)
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return 0
  return hours * 60 + minutes
}

function toTime(minutes: number) {
  const hours = Math.floor(minutes / 60) % 24
  return `${String(hours).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`
}

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 * Считается один раз при рендере, клиентского кода не добавляет.
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
 * Поле времени с сеткой в четверть часа и кнопками сдвига по шагу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Date008({
  label = "Время записи",
  defaultValue = "14:30",
  stepMinutes = 15,
  openAt = "09:00",
  closeAt = "20:00",
  earlierLabel = "Раньше на {minutes} минут",
  laterLabel = "Позже на {minutes} минут",
  stepText = "Шаг {minutes} мин",
  hoursText = "приём с {open} до {close}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Date008Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const open = toMinutes(openAt)
  const close = toMinutes(closeAt)
  const current = toMinutes(value)

  // Округление к ближайшей четверти: «на 14:07» не записывают никого.
  const snap = (minutes: number) =>
    Math.min(
      close,
      Math.max(open, Math.round(minutes / stepMinutes) * stepMinutes),
    )

  const minutes = String(stepMinutes)

  const palette = {
    ...(accent ? { "--vibeui-date-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-date-008-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-date-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="date-selector"
        data-vibeui-block="date-008"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="row">
          <button
            type="button"
            disabled={current <= open}
            aria-label={earlierLabel.replace("{minutes}", minutes)}
            onClick={() => setValue(toTime(snap(current - stepMinutes)))}
          >
            −{stepMinutes}
          </button>
          <input
            id={id}
            type="time"
            value={value}
            min={openAt}
            max={closeAt}
            step={stepMinutes * 60}
            aria-describedby={`${id}-hint`}
            onChange={(event) => setValue(event.target.value)}
            onBlur={() => setValue(toTime(snap(toMinutes(value))))}
          />
          <button
            type="button"
            disabled={current >= close}
            aria-label={laterLabel.replace("{minutes}", minutes)}
            onClick={() => setValue(toTime(snap(current + stepMinutes)))}
          >
            +{stepMinutes}
          </button>
        </div>
        <p id={`${id}-hint`} data-part="hint">
          <span>{stepText.replace("{minutes}", minutes)}</span>
          <span>
            {hoursText.replace("{open}", openAt).replace("{close}", closeAt)}
          </span>
        </p>
      </div>
    </>
  )
}
