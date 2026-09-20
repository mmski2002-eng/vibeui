"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Date005Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  defaultValue?: string
  presets?: { text: string; days: number }[]
  /** Локаль для названия дня недели. */
  locale?: string
  /** Строка под полем с подстановкой {day}. */
  weekdayText?: string
  /** Чем заменить день недели, когда дата не разобралась. */
  unknownDayText?: string
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: относительные пресеты рядом с полем. «Сегодня» и «завтра»
// пользователь думает словами, а вводить вынужден числами — кнопки убирают этот
// перевод. Считаются они по системным часам в момент нажатия, а не при отрисовке:
// вычислить «сегодня» на сервере и на клиенте — верный способ получить разные
// даты на границе часовых поясов и расхождение при гидратации. Под полем
// подписан день недели: «16 сентября» само по себе не говорит, что это среда.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="date-005"]){
--vibeui-date-005-surface:transparent;
--vibeui-date-005-field:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-date-005-shell:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-date-005-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-date-005-muted:color-mix(in oklab,var(--vibeui-date-005-fg) 68%,transparent);
--vibeui-date-005-border:light-dark(oklch(0.88 0 265),oklch(0.42 0 265));
--vibeui-date-005-accent:light-dark(oklch(0.285 0 0),oklch(0.91 0 0));
--vibeui-date-005-soft:color-mix(in oklch,var(--vibeui-date-005-accent) 14%,transparent);
--vibeui-date-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="date-005"]{color-scheme:dark}
/* Подложки по умолчанию нет: рамка держит форму, фон приходит со страницы. */
[data-vibeui-block="date-005"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-date-005-surface);
border:1px solid var(--vibeui-date-005-shell);border-radius:0.875rem;
font-family:var(--vibeui-date-005-font);color:var(--vibeui-date-005-fg);
}
[data-vibeui-block="date-005"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="date-005"] input{
width:100%;box-sizing:border-box;height:2.75rem;padding:0 0.75rem;
background:var(--vibeui-date-005-field);color:inherit;
border:1px solid var(--vibeui-date-005-border);border-radius:0.625rem;
font:inherit;font-size:0.9375rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="date-005"] input:focus-visible{
outline:2px solid var(--vibeui-date-005-accent);outline-offset:1px;border-color:var(--vibeui-date-005-accent);
}
[data-vibeui-block="date-005"] input::-webkit-calendar-picker-indicator{cursor:pointer;opacity:.55}
[data-vibeui-block="date-005"] input::-webkit-calendar-picker-indicator:hover{opacity:1}
/* Кнопки словами: пользователь думает «завтра», а не «2026-09-01». */
[data-vibeui-block="date-005"] [data-part="presets"]{display:flex;flex-wrap:wrap;gap:0.375rem}
[data-vibeui-block="date-005"] button{
appearance:none;cursor:pointer;
height:1.875rem;padding:0 0.75rem;border-radius:9999px;
border:1px solid var(--vibeui-date-005-border);
background:var(--vibeui-date-005-surface);color:inherit;
font:inherit;font-size:0.75rem;font-weight:650;
transition:background-color .14s ease,border-color .14s ease,color .14s ease;
}
[data-vibeui-block="date-005"] button:hover{border-color:var(--vibeui-date-005-accent)}
[data-vibeui-block="date-005"] button:focus-visible{outline:2px solid var(--vibeui-date-005-accent);outline-offset:2px}
/* Нажатый пресет остаётся отмеченным: видно, что дата пришла из кнопки. */
[data-vibeui-block="date-005"] button[aria-pressed="true"]{
background:var(--vibeui-date-005-soft);border-color:var(--vibeui-date-005-accent);
color:var(--vibeui-date-005-accent);
}
[data-vibeui-block="date-005"] [data-part="weekday"]{
margin:0;font-size:0.75rem;color:var(--vibeui-date-005-muted);
}
[data-vibeui-block="date-005"] [data-part="weekday"] b{color:var(--vibeui-date-005-fg);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="date-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PRESETS = [
  { text: "Сегодня", days: 0 },
  { text: "Завтра", days: 1 },
  { text: "Через неделю", days: 7 },
]

// Системные часы читаются в момент нажатия: «сегодня» на сервере и на клиенте
// могут оказаться разными датами, и гидратация это заметит.
function shiftedToday(days: number) {
  const now = new Date()
  now.setDate(now.getDate() + days)
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${now.getFullYear()}-${month}-${day}`
}

// Дата разбирается по частям: Date.parse трактует «2026-09-16» как UTC и
// в минусовых поясах отдаёт предыдущий день.
function weekdayOf(value: string, locale: string) {
  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) return ""
  return new Date(year, month - 1, day).toLocaleDateString(
    safeLocale(locale, "ru-RU"),
    { weekday: "long" },
  )
}

/**
 * Неверная локаль из пропа не должна ронять страницу-хост: toLocaleDateString
 * бросает на ней RangeError, поэтому непригодное значение откатываем на дефолт.
 */
function safeLocale(value: string, fallback: string) {
  try {
    Intl.DateTimeFormat.supportedLocalesOf(value)
    return value
  } catch {
    return fallback
  }
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
 * Поле даты с кнопками «сегодня» и «завтра» и подписью дня недели.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Date005({
  label = "Дата доставки",
  defaultValue = "2026-09-16",
  presets = DEFAULT_PRESETS,
  locale = "ru-RU",
  weekdayText = "Это {day}",
  unknownDayText = "неизвестный день",
  background = "",
  accent,
  className,
  style,
  ...props
}: Date005Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [picked, setPicked] = useState<string | null>(null)
  // Выделенный день недели остаётся внутри <b>, поэтому строка режется по метке.
  const [beforeDay, afterDay] = weekdayText.split("{day}")

  const palette = {
    ...(accent ? { "--vibeui-date-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-date-005-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-date-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="date-selector"
        data-vibeui-block="date-005"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type="date"
          value={value}
          aria-describedby={`${id}-weekday`}
          onChange={(event) => {
            setValue(event.target.value)
            setPicked(null)
          }}
        />
        <div data-part="presets">
          {presets.map((preset) => (
            <button
              key={preset.text}
              type="button"
              aria-pressed={picked === preset.text}
              onClick={() => {
                setValue(shiftedToday(preset.days))
                setPicked(preset.text)
              }}
            >
              {preset.text}
            </button>
          ))}
        </div>
        <p id={`${id}-weekday`} data-part="weekday" aria-live="polite">
          {beforeDay}
          <b>{weekdayOf(value, locale) || unknownDayText}</b>
          {afterDay}
        </p>
      </div>
    </>
  )
}
