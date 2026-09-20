"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Range003Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  startDate?: string
  days?: number
  defaultFrom?: number
  defaultTo?: number
  /** Подписи ручек для скринридера: компонент несёт русские. */
  handleText?: Record<string, string>
  /** Формы слова «ночь» по категориям Intl.PluralRules выбранной локали. */
  nightsText?: Record<string, string>
  /** Локаль подписей дат и выбора формы слова. */
  locale?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: диапазон дат ползунком, а не двумя календарями. Когда даты
// плавающие — «где-то в конце сентября, на неделю» — календарь заставляет
// решать точно то, что человек ещё не решил, а ползунок позволяет прикинуть.
// Внутри двигаются номера дней от базовой даты: целые числа сравниваются и
// шагают без арифметики с датами. Даты собираются через Date.UTC и печатаются
// в UTC — иначе на минусовых поясах подпись съедет на день назад.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// фильтра по умолчанию нет, он лежит на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="range-003"]){
--vibeui-range-003-surface:transparent;
--vibeui-range-003-knob:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-range-003-shell:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-range-003-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-range-003-muted:color-mix(in oklab,var(--vibeui-range-003-fg) 68%,transparent);
--vibeui-range-003-track:light-dark(oklch(0.93 0 265),oklch(0.33 0 265));
--vibeui-range-003-accent:light-dark(oklch(0.28 0 0),oklch(0.91 0 0));
--vibeui-range-003-soft:light-dark(oklch(0.28 0 0 / 12%),oklch(0.91 0 0 / 20%));
--vibeui-range-003-shadow:light-dark(oklch(0.2 0 265 / 25%),oklch(0 0 0 / 45%));
--vibeui-range-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-range-003-from:0%;
--vibeui-range-003-to:100%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="range-003"]{color-scheme:dark}
/* Подложки по умолчанию нет: фильтр ложится на фон страницы, плашку включает проп background. */
[data-vibeui-block="range-003"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-range-003-surface);
border:1px solid var(--vibeui-range-003-shell);border-radius:0.875rem;
font-family:var(--vibeui-range-003-font);color:var(--vibeui-range-003-fg);
}
[data-vibeui-block="range-003"] [data-part="label"]{margin:0;font-size:0.8125rem;font-weight:650}
/* Даты крупно: ползунок точен, но читают всё равно подпись. */
[data-vibeui-block="range-003"] [data-part="dates"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;margin:0;
}
[data-vibeui-block="range-003"] [data-part="date"]{
padding:0.3125rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-range-003-soft);color:var(--vibeui-range-003-accent);
font-size:0.875rem;font-weight:700;
}
[data-vibeui-block="range-003"] [data-part="nights"]{font-size:0.6875rem;color:var(--vibeui-range-003-muted)}
[data-vibeui-block="range-003"] [data-part="rail"]{position:relative;height:1.25rem}
[data-vibeui-block="range-003"] [data-part="rail"]::before{
content:"";position:absolute;left:0;right:0;top:0.4375rem;height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,
var(--vibeui-range-003-track) var(--vibeui-range-003-from),
var(--vibeui-range-003-accent) var(--vibeui-range-003-from),
var(--vibeui-range-003-accent) var(--vibeui-range-003-to),
var(--vibeui-range-003-track) var(--vibeui-range-003-to));
}
[data-vibeui-block="range-003"] input{
position:absolute;left:0;top:0;width:100%;height:1.25rem;margin:0;
appearance:none;background:none;pointer-events:none;
}
[data-vibeui-block="range-003"] input::-webkit-slider-runnable-track{background:none;height:0.375rem}
[data-vibeui-block="range-003"] input::-moz-range-track{background:none;height:0.375rem}
/* Дорожка событий не ловит, ручки ловят: иначе верхний ползунок съедает клики. */
[data-vibeui-block="range-003"] input::-webkit-slider-thumb{
appearance:none;pointer-events:auto;cursor:pointer;margin-top:-0.3125rem;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-range-003-knob);border:2px solid var(--vibeui-range-003-accent);
box-shadow:0 1px 3px var(--vibeui-range-003-shadow);
}
[data-vibeui-block="range-003"] input::-moz-range-thumb{
pointer-events:auto;cursor:pointer;box-sizing:border-box;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-range-003-knob);border:2px solid var(--vibeui-range-003-accent);
}
[data-vibeui-block="range-003"] input:focus-visible{outline:2px solid var(--vibeui-range-003-accent);outline-offset:4px;border-radius:0.5rem}
[data-vibeui-block="range-003"] [data-part="scale"]{
display:flex;justify-content:space-between;margin:0;
font-size:0.6875rem;color:var(--vibeui-range-003-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="range-003"] *{animation:none!important;transition:none!important}}
`

const HANDLE_TEXT: Record<string, string> = {
  from: "Дата заезда",
  to: "Дата выезда",
}

const NIGHTS_TEXT: Record<string, string> = {
  one: "ночь",
  few: "ночи",
  many: "ночей",
  other: "ночей",
}

// Дата собирается в UTC и печатается в UTC: иначе на минусовых поясах подпись
// съезжает на день назад.
function dayLabel(startDate: string, offset: number, locale: string) {
  const [year, month, day] = startDate.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day + offset))
  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  })
}

// Неверный проп не должен ронять страницу-хост: на Invalid Date и на
// неразбираемой локали Intl бросает RangeError. Оба значения откатываем на
// дефолтные, чтобы item выглядел как в превью каталога.
function safeStartDate(value: string, fallback: string) {
  const [year, month, day] = value.split("-").map(Number)

  return Number.isNaN(Date.UTC(year, month - 1, day)) ? fallback : value
}

function safeLocale(value: string, fallback: string) {
  try {
    Intl.DateTimeFormat.supportedLocalesOf(value)
    return value
  } catch {
    return fallback
  }
}

// Форму слова выбирает Intl по локали: в русском их три, и своя таблица
// правил сломалась бы на любом другом языке.
function nightsWord(
  count: number,
  locale: string,
  nightsText: Record<string, string>,
) {
  const rule = new Intl.PluralRules(locale).select(count)
  return nightsText[rule] ?? nightsText.other ?? NIGHTS_TEXT.other
}

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
 * Диапазон дат ползунком: внутри номера дней, снаружи подписи датами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Range003({
  label = "Когда поедем",
  startDate = "2026-09-01",
  days = 60,
  defaultFrom = 12,
  defaultTo = 19,
  handleText = HANDLE_TEXT,
  nightsText = NIGHTS_TEXT,
  locale = "ru-RU",
  background = "",
  accent,
  className,
  style,
  ...props
}: Range003Props) {
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)
  const start = safeStartDate(startDate, "2026-09-01")
  const tag = safeLocale(locale, "ru-RU")
  const percent = (value: number) => `${(value / days) * 100}%`

  const palette = {
    "--vibeui-range-003-from": percent(from),
    "--vibeui-range-003-to": percent(to),
    ...(accent ? { "--vibeui-range-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-range-003-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-range-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="range"
        data-vibeui-block="range-003"
        className={className}
        style={palette}
      >
        <p data-part="label">{label}</p>
        <p data-part="dates" aria-live="polite">
          <span data-part="date">{dayLabel(start, from, tag)}</span>
          <span data-part="nights">
            {to - from} {nightsWord(to - from, tag, nightsText)}
          </span>
          <span data-part="date">{dayLabel(start, to, tag)}</span>
        </p>
        <div data-part="rail">
          <input
            type="range"
            min={0}
            max={days}
            step={1}
            value={from}
            aria-label={handleText.from ?? HANDLE_TEXT.from}
            aria-valuetext={dayLabel(start, from, tag)}
            onChange={(event) =>
              setFrom(Math.min(Number(event.target.value), to - 1))
            }
          />
          <input
            type="range"
            min={0}
            max={days}
            step={1}
            value={to}
            aria-label={handleText.to ?? HANDLE_TEXT.to}
            aria-valuetext={dayLabel(start, to, tag)}
            onChange={(event) =>
              setTo(Math.max(Number(event.target.value), from + 1))
            }
          />
        </div>
        <p data-part="scale">
          <span>{dayLabel(start, 0, tag)}</span>
          <span>{dayLabel(start, days, tag)}</span>
        </p>
      </div>
    </>
  )
}
