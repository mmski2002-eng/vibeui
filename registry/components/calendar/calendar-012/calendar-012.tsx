"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Calendar012Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange" | "defaultValue"
> & {
  defaultValue?: number
  min?: number
  max?: number
  onChange?: (year: number) => void
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  previousLabel?: string
  nextLabel?: string
  groupLabel?: string
  /** Подпись в подвале. {year} подставляется числом. */
  pickedText?: string
}

// Идея компонента: год выбирается десятилетием, а не прокруткой списка.
// Сетка 4×3 показывает десять лет десятилетия плюс по одному соседнему с
// краёв — переход через границу (1999 → 2000) не требует нажатия стрелки.
const STYLES = `
:where([data-vibeui-block="calendar-012"]){
--vibeui-calendar-012-bg:transparent;
--vibeui-calendar-012-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-calendar-012-muted:color-mix(in oklab,var(--vibeui-calendar-012-fg) 68%,transparent);
--vibeui-calendar-012-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-calendar-012-hover:light-dark(oklch(0.96 0 265),oklch(0.29 0 265));
--vibeui-calendar-012-accent:light-dark(oklch(0.285 0 0),oklch(0.899 0 0));
--vibeui-calendar-012-on-accent:light-dark(oklch(0.99 0 285),oklch(0.19 0 285));
--vibeui-calendar-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="calendar-012"]{color-scheme:dark}
[data-vibeui-block="calendar-012"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:19rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-calendar-012-bg);
border:1px solid var(--vibeui-calendar-012-border);border-radius:0.875rem;
color:var(--vibeui-calendar-012-fg);font-family:var(--vibeui-calendar-012-font);
}
[data-vibeui-block="calendar-012"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="calendar-012"] [data-part="range"]{
font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.01em;
}
[data-vibeui-block="calendar-012"] [data-part="nav"] button{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;margin-left:0.25rem;padding:0;
border:1px solid var(--vibeui-calendar-012-border);border-radius:0.5rem;
background:transparent;color:inherit;
}
[data-vibeui-block="calendar-012"] [data-part="nav"] button:hover:not(:disabled){background:var(--vibeui-calendar-012-hover)}
[data-vibeui-block="calendar-012"] [data-part="nav"] button:disabled{opacity:.35;cursor:not-allowed}
[data-vibeui-block="calendar-012"] [data-part="nav"] button:focus-visible{outline:2px solid var(--vibeui-calendar-012-accent);outline-offset:2px}
[data-vibeui-block="calendar-012"] [data-part="arrow"]{
width:0.375rem;height:0.375rem;
border-left:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg) translate(0.0625rem,-0.0625rem);
}
[data-vibeui-block="calendar-012"] [data-part="arrow"][data-dir="next"]{transform:rotate(-135deg) translate(0.0625rem,-0.0625rem)}
[data-vibeui-block="calendar-012"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(4,1fr);gap:0.25rem;
}
[data-vibeui-block="calendar-012"] [data-part="grid"] button{
appearance:none;cursor:pointer;
height:2.5rem;padding:0;border:0;border-radius:0.5rem;
background:transparent;color:inherit;
font:inherit;font-size:0.8125rem;font-variant-numeric:tabular-nums;
transition:background-color .14s ease;
}
[data-vibeui-block="calendar-012"] [data-part="grid"] button:hover:not(:disabled){background:var(--vibeui-calendar-012-hover)}
[data-vibeui-block="calendar-012"] [data-part="grid"] button:focus-visible{outline:2px solid var(--vibeui-calendar-012-accent);outline-offset:-2px}
/* Соседние десятилетия приглушены, но нажимаются: 1999 из сетки 2000-х
   выбирается одним нажатием, без похода стрелкой назад. */
[data-vibeui-block="calendar-012"] [data-part="grid"] button[data-outside="true"]{color:var(--vibeui-calendar-012-muted);opacity:.6}
[data-vibeui-block="calendar-012"] [data-part="grid"] button:disabled{opacity:.25;cursor:not-allowed;text-decoration:line-through}
[data-vibeui-block="calendar-012"] [data-part="grid"] button[aria-pressed="true"]{
background:var(--vibeui-calendar-012-accent);color:oklch(from var(--vibeui-calendar-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);font-weight:700;opacity:1;
}
[data-vibeui-block="calendar-012"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
font-size:0.875rem;color:var(--vibeui-calendar-012-muted);
}
[data-vibeui-block="calendar-012"] [data-part="foot"] strong{
color:var(--vibeui-calendar-012-fg);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-012"] *{animation:none!important;transition:none!important}}
`

function decadeStart(year: number) {
  return Math.floor(year / 10) * 10
}

// Стрелки водят фокус по сетке. Без них до нужного дня приходится жать Tab
// столько раз, сколько до него дней.
function moveFocus(event: KeyboardEvent<HTMLElement>, columns: number) {
  const steps: Record<string, number> = {
    ArrowLeft: -1,
    ArrowRight: 1,
    ArrowUp: -columns,
    ArrowDown: columns,
  }
  const step = steps[event.key]

  if (step === undefined) {
    return
  }

  const buttons = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>("button"),
  )
  const from = buttons.indexOf(document.activeElement as HTMLButtonElement)

  if (from < 0) {
    return
  }

  let index = from + step

  while (buttons[index]?.disabled) {
    index += step
  }

  if (!buttons[index]) {
    return
  }

  event.preventDefault()
  buttons[index].focus()
}

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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
 * Выбор года десятилетиями: сетка 4×3 и стрелки по десять лет.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar012({
  defaultValue = 2026,
  min = 1970,
  max = 2040,
  onChange,
  accent,
  background = "",
  previousLabel = "Предыдущее десятилетие",
  nextLabel = "Следующее десятилетие",
  groupLabel = "Годы десятилетия",
  pickedText = "Выбран год {year}",
  className,
  style,
  ...props
}: Calendar012Props) {
  const [selected, setSelected] = useState(defaultValue)
  const [decade, setDecade] = useState(() => decadeStart(defaultValue))

  const years = Array.from({ length: 12 }, (_, index) => decade - 1 + index)
  // Ровно одна кнопка сетки в табуляции: выбранный год, а если он в другом
  // десятилетии — первый доступный из показанных.
  const stop = years.includes(selected)
    ? selected
    : (years.find((year) => year >= min && year <= max) ?? years[0])

  const palette = {
    ...(accent ? { "--vibeui-calendar-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-calendar-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const pick = (year: number) => {
    setSelected(year)
    setDecade(decadeStart(year))
    onChange?.(year)
  }

  return (
    <>
      <style href="vibeui-calendar-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="calendar"
        data-vibeui-block="calendar-012"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span data-part="range">
            {decade} — {decade + 9}
          </span>
          <span data-part="nav">
            <button
              type="button"
              aria-label={previousLabel}
              disabled={decade - 10 + 9 < min}
              onClick={() => setDecade(decade - 10)}
            >
              <span data-part="arrow" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={nextLabel}
              disabled={decade + 10 > max}
              onClick={() => setDecade(decade + 10)}
            >
              <span data-part="arrow" data-dir="next" aria-hidden="true" />
            </button>
          </span>
        </div>
        <div
          data-part="grid"
          role="group"
          aria-label={groupLabel}
          onKeyDown={(event) => moveFocus(event, 4)}
        >
          {years.map((year) => (
            <button
              key={year}
              type="button"
              tabIndex={year === stop ? 0 : -1}
              aria-pressed={year === selected}
              data-outside={year < decade || year > decade + 9}
              disabled={year < min || year > max}
              onClick={() => pick(year)}
            >
              {year}
            </button>
          ))}
        </div>
        <div data-part="foot">
          <span>
            {pickedText.split("{year}")[0]}
            <strong>{selected}</strong>
            {pickedText.split("{year}")[1] ?? ""}
          </span>
          <span>
            {min}—{max}
          </span>
        </div>
      </div>
    </>
  )
}
