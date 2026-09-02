"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Date003Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  defaultFrom?: string
  defaultTo?: string
  min?: string
  /** Подписи полей и итога: компонент несёт русские, проект подставляет свои. */
  fromLabel?: string
  toLabel?: string
  durationLabel?: string
  /** Склонения ночей с подстановкой {count}: ключи one, few и many. */
  nightsText?: Record<string, string>
  /** Пусто — подложки нет, поля лежат прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: диапазон двумя полями, где порядок дат чинится сам. Второму
// полю ставится min по первому, поэтому системный календарь физически не даёт
// выбрать дату раньше начала. Если начало сдвинули вперёд уже выбранного конца,
// конец подтягивается за ним, а не превращается в ошибку: перевыбирать обе даты
// из-за одной правки — обидно. Число ночей считается тут же: диапазон дат
// пользователь всё равно мысленно переводит в длительность.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="date-003"]){
--vibeui-date-003-surface:transparent;
--vibeui-date-003-field:light-dark(oklch(1 0 0),oklch(0.26 0.012 265));
--vibeui-date-003-shell:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-date-003-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-date-003-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-date-003-border:light-dark(oklch(0.88 0.008 265),oklch(0.42 0.014 265));
--vibeui-date-003-accent:light-dark(oklch(0.52 0.16 210),oklch(0.78 0.13 210));
--vibeui-date-003-soft:color-mix(in oklch,var(--vibeui-date-003-accent) 12%,transparent);
--vibeui-date-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Подложки по умолчанию нет: рамка держит форму, фон приходит со страницы. */
[data-vibeui-block="date-003"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-date-003-surface);
border:1px solid var(--vibeui-date-003-shell);border-radius:0.875rem;
font-family:var(--vibeui-date-003-font);color:var(--vibeui-date-003-fg);
}
/* legend во float даёт обтекание: clear возвращает нормальный поток. */
[data-vibeui-block="date-003"] legend{
float:left;width:100%;padding:0;margin-bottom:0.5rem;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="date-003"] [data-part="pair"]{clear:both;display:flex;gap:0.5rem;flex-wrap:wrap}
[data-vibeui-block="date-003"] [data-part="cell"]{
flex:1 1 8rem;min-width:0;display:flex;flex-direction:column;gap:0.25rem;
}
[data-vibeui-block="date-003"] label{font-size:0.6875rem;font-weight:650;color:var(--vibeui-date-003-muted);text-transform:uppercase;letter-spacing:0.04em}
[data-vibeui-block="date-003"] input{
width:100%;box-sizing:border-box;height:2.625rem;padding:0 0.625rem;
background:var(--vibeui-date-003-field);color:inherit;
border:1px solid var(--vibeui-date-003-border);border-radius:0.625rem;
font:inherit;font-size:0.875rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="date-003"] input:focus-visible{
outline:2px solid var(--vibeui-date-003-accent);outline-offset:1px;border-color:var(--vibeui-date-003-accent);
}
[data-vibeui-block="date-003"] input::-webkit-calendar-picker-indicator{cursor:pointer;opacity:.55}
[data-vibeui-block="date-003"] input::-webkit-calendar-picker-indicator:hover{opacity:1}
/* Длительность важнее самих дат: её всё равно считают в уме. */
[data-vibeui-block="date-003"] [data-part="summary"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
margin:0;padding:0.5rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-date-003-soft);
font-size:0.8125rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="date-003"] [data-part="nights"]{font-weight:700;color:var(--vibeui-date-003-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="date-003"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000

function nightsBetween(from: string, to: string) {
  const start = Date.parse(from)
  const end = Date.parse(to)
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0
  return Math.max(0, Math.round((end - start) / DAY))
}

function plusDay(date: string) {
  const next = Date.parse(date)
  if (!Number.isFinite(next)) return date
  return new Date(next + DAY).toISOString().slice(0, 10)
}

const NIGHTS_TEXT: Record<string, string> = {
  one: "{count} ночь",
  few: "{count} ночи",
  many: "{count} ночей",
}

// Русские склонения: 1 ночь, 2–4 ночи, остальное — ночей, кроме подростковых.
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
 * Диапазон дат двумя полями: порядок чинится сам, длительность считается сразу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Date003({
  legend = "Даты проживания",
  defaultFrom = "2026-09-14",
  defaultTo = "2026-09-19",
  min = "2026-09-01",
  fromLabel = "Заезд",
  toLabel = "Выезд",
  durationLabel = "Длительность",
  nightsText = NIGHTS_TEXT,
  background = "",
  accent,
  className,
  style,
  ...props
}: Date003Props) {
  const id = useId()
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)
  const nights = nightsBetween(from, to)
  const key = pluralKey(nights)
  const nightsLabel = (nightsText[key] ?? NIGHTS_TEXT[key]).replace(
    "{count}",
    String(nights),
  )

  const palette = {
    ...(accent ? { "--vibeui-date-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-date-003-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-date-003" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="date-003"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="pair">
          <div data-part="cell">
            <label htmlFor={`${id}-from`}>{fromLabel}</label>
            <input
              id={`${id}-from`}
              type="date"
              value={from}
              min={min}
              onChange={(event) => {
                const next = event.target.value
                setFrom(next)
                // Конец подтягивается за началом: перевыбирать обе даты обидно.
                if (next && next >= to) setTo(plusDay(next))
              }}
            />
          </div>
          <div data-part="cell">
            <label htmlFor={`${id}-to`}>{toLabel}</label>
            <input
              id={`${id}-to`}
              type="date"
              value={to}
              min={plusDay(from)}
              onChange={(event) => setTo(event.target.value)}
            />
          </div>
        </div>
        <p data-part="summary" aria-live="polite">
          <span>{durationLabel}</span>
          <span data-part="nights">{nightsLabel}</span>
        </p>
      </fieldset>
    </>
  )
}
