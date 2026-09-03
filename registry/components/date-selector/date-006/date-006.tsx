"use client"

import { useId, useState, useSyncExternalStore } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Date006Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  defaultValue?: string
  soonInDays?: number
  /**
   * Тексты состояний: ключи idle, past, today, ahead и overdue.
   * В past и ahead подставляется {days} — уже просклонённый срок.
   */
  statusText?: Record<string, string>
  /** Склонения дней с подстановкой {count}: ключи one, few и many. */
  daysText?: Record<string, string>
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: срок, который сам говорит, что он в прошлом. Прошедшая дата
// формально валидна, поэтому браузер о ней молчит, а задача с таким сроком
// тихо уезжает в просрочку. Компонент сравнивает значение с сегодняшним днём и
// показывает одно из трёх состояний: прошло, скоро, в запасе. Сегодняшний день
// вычисляется после монтирования: считать его при отрисовке значит получить на
// сервере и на клиенте разные даты и расхождение при гидратации. До первого
// эффекта состояние нейтральное — это честнее, чем мигнуть ложной тревогой.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="date-006"]){
--vibeui-date-006-surface:transparent;
--vibeui-date-006-field:light-dark(oklch(1 0 0),oklch(0.26 0.012 265));
--vibeui-date-006-shell:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-date-006-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-date-006-muted:color-mix(in oklab,var(--vibeui-date-006-fg) 68%,transparent);
--vibeui-date-006-border:light-dark(oklch(0.88 0.008 265),oklch(0.42 0.014 265));
--vibeui-date-006-ok:light-dark(oklch(0.55 0.14 160),oklch(0.78 0.13 160));
--vibeui-date-006-soon:light-dark(oklch(0.66 0.15 70),oklch(0.82 0.14 70));
--vibeui-date-006-past:light-dark(oklch(0.56 0.19 25),oklch(0.75 0.16 25));
--vibeui-date-006-accent:var(--vibeui-date-006-ok);
--vibeui-date-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="date-006"]{color-scheme:dark}
/* Подложки по умолчанию нет: рамка держит форму, фон приходит со страницы. */
[data-vibeui-block="date-006"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-date-006-surface);
border:1px solid var(--vibeui-date-006-shell);border-radius:0.875rem;
font-family:var(--vibeui-date-006-font);color:var(--vibeui-date-006-fg);
}
/* Одна переменная на состояние: цвет рамки, полосы и текста меняется разом. */
[data-vibeui-block="date-006"][data-state="soon"]{--vibeui-date-006-accent:var(--vibeui-date-006-soon)}
[data-vibeui-block="date-006"][data-state="past"]{--vibeui-date-006-accent:var(--vibeui-date-006-past)}
[data-vibeui-block="date-006"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="date-006"] input{
width:100%;box-sizing:border-box;height:2.75rem;padding:0 0.75rem;
background:var(--vibeui-date-006-field);color:inherit;
border:1px solid var(--vibeui-date-006-border);border-radius:0.625rem;
font:inherit;font-size:0.9375rem;font-weight:650;font-variant-numeric:tabular-nums;
transition:border-color .16s ease;
}
[data-vibeui-block="date-006"][data-state="past"] input,
[data-vibeui-block="date-006"][data-state="soon"] input{border-color:var(--vibeui-date-006-accent)}
[data-vibeui-block="date-006"] input:focus-visible{
outline:2px solid var(--vibeui-date-006-accent);outline-offset:1px;border-color:var(--vibeui-date-006-accent);
}
[data-vibeui-block="date-006"] input::-webkit-calendar-picker-indicator{cursor:pointer;opacity:.55}
[data-vibeui-block="date-006"] input::-webkit-calendar-picker-indicator:hover{opacity:1}
/* Полоса слева вместо иконки: цвет читается боковым зрением. */
[data-vibeui-block="date-006"] [data-part="status"]{
display:flex;align-items:center;gap:0.5rem;margin:0;
padding:0.4375rem 0.625rem;border-radius:0.5rem;
border-left:3px solid var(--vibeui-date-006-accent);
background:color-mix(in oklch,var(--vibeui-date-006-accent) 10%,transparent);
font-size:0.75rem;line-height:1.4;color:var(--vibeui-date-006-fg);
}
[data-vibeui-block="date-006"] [data-part="status"] b{color:var(--vibeui-date-006-accent);font-weight:700}
[data-vibeui-block="date-006"] [data-part="status"][data-idle="true"]{
border-left-color:var(--vibeui-date-006-border);background:none;color:var(--vibeui-date-006-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="date-006"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000

// Часы устройства читаются как внешний источник: на сервере снимка нет вовсе,
// поэтому сравнивать нечего и гидратация не расходится.
const subscribeToClock = () => () => {}

function todayAtMidnight() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
}

function midnight(value: string) {
  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day).getTime()
}

const STATUS_TEXT: Record<string, string> = {
  idle: "Срок сверяется с сегодняшним днём после загрузки.",
  past: "Срок прошёл {days} назад.",
  today: "Срок истекает сегодня.",
  ahead: "В запасе {days}.",
  overdue: "Просрочено.",
}

const DAYS_TEXT: Record<string, string> = {
  one: "{count} день",
  few: "{count} дня",
  many: "{count} дней",
}

// Русские склонения: 1 день, 2–4 дня, остальное — дней, кроме подростковых.
function pluralKey(count: number) {
  const tail = count % 10
  const teen = count % 100
  if (teen > 10 && teen < 20) return "many"
  if (tail === 1) return "one"
  if (tail > 1 && tail < 5) return "few"
  return "many"
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
 * Поле срока, которое предупреждает о прошедшей и о близкой дате.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Date006({
  label = "Срок сдачи",
  defaultValue = "2026-09-04",
  soonInDays = 3,
  statusText = STATUS_TEXT,
  daysText = DAYS_TEXT,
  background = "",
  accent,
  className,
  style,
  ...props
}: Date006Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  // Сегодняшний день приходит только с клиента: на сервере снимок пустой.
  const today = useSyncExternalStore<number | null>(
    subscribeToClock,
    todayAtMidnight,
    () => null,
  )

  const target = midnight(value)
  const left =
    today !== null && target !== null
      ? Math.round((target - today) / DAY)
      : null

  const state =
    left === null
      ? "idle"
      : left < 0
        ? "past"
        : left <= soonInDays
          ? "soon"
          : "ok"

  const line = (key: string) => statusText[key] ?? STATUS_TEXT[key]
  const days = (count: number) =>
    (daysText[pluralKey(count)] ?? DAYS_TEXT[pluralKey(count)]).replace(
      "{count}",
      String(count),
    )

  const message =
    left === null
      ? line("idle")
      : left < 0
        ? line("past").replace("{days}", days(Math.abs(left)))
        : left === 0
          ? line("today")
          : line("ahead").replace("{days}", days(left))

  const palette = {
    ...(accent ? { "--vibeui-date-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-date-006-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-date-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="date-selector"
        data-vibeui-block="date-006"
        data-state={state}
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type="date"
          value={value}
          aria-describedby={`${id}-status`}
          onChange={(event) => setValue(event.target.value)}
        />
        <p
          id={`${id}-status`}
          data-part="status"
          data-idle={state === "idle"}
          aria-live="polite"
        >
          {state === "past" ? <b>{line("overdue")}</b> : null}
          {message}
        </p>
      </div>
    </>
  )
}
