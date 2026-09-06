"use client"

import { useId, useRef } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Date002Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  hint?: string
  defaultValue?: string
  min?: string
  max?: string
  name?: string
  /** Подпись кнопки календаря: компонент несёт русскую, проект подставляет свою. */
  openLabel?: string
  /**
   * Показать кнопку нажатой: витрина, скриншот, отладка. Системный календарь
   * рисует браузер, и на карточке каталога его не видно — от компонента там
   * остаётся поле с иконкой рядом. Отметка показывает, что кнопка живая.
   */
  active?: boolean
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: календарь вынесен в настоящую кнопку рядом с полем.
// Родная иконка календаря — крошечная зона внутри поля, в части браузеров её
// вообще не видно, и попасть в неё пальцем почти невозможно. Кнопка на 2.75rem
// зовёт тот же системный календарь через showPicker(), а если браузер метода
// не знает — просто ставит фокус в поле, и остаётся ввод с клавиатуры.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="date-002"]){
--vibeui-date-002-surface:transparent;
--vibeui-date-002-field:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-date-002-shell:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-date-002-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-date-002-muted:color-mix(in oklab,var(--vibeui-date-002-fg) 68%,transparent);
--vibeui-date-002-border:light-dark(oklch(0.88 0 265),oklch(0.42 0 265));
--vibeui-date-002-accent:light-dark(oklch(0.55 0.18 262),oklch(0.76 0.15 262));
--vibeui-date-002-soft:color-mix(in oklch,var(--vibeui-date-002-accent) 12%,transparent);
--vibeui-date-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="date-002"]{color-scheme:dark}
/* Подложки по умолчанию нет: рамка держит форму, фон приходит со страницы. */
[data-vibeui-block="date-002"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:19rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-date-002-surface);
border:1px solid var(--vibeui-date-002-shell);border-radius:0.875rem;
font-family:var(--vibeui-date-002-font);color:var(--vibeui-date-002-fg);
}
[data-vibeui-block="date-002"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="date-002"] [data-part="row"]{display:flex;gap:0.5rem;align-items:stretch}
[data-vibeui-block="date-002"] input{
flex:1 1 auto;min-width:0;box-sizing:border-box;
height:2.75rem;padding:0 0.75rem;
background:var(--vibeui-date-002-field);color:inherit;
border:1px solid var(--vibeui-date-002-border);border-radius:0.625rem;
font:inherit;font-size:0.9375rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="date-002"] input:focus-visible{
outline:2px solid var(--vibeui-date-002-accent);outline-offset:1px;border-color:var(--vibeui-date-002-accent);
}
/* Родная иконка спрятана: её роль забрала кнопка, две подряд сбивают с толку. */
[data-vibeui-block="date-002"] input::-webkit-calendar-picker-indicator{display:none}
[data-vibeui-block="date-002"] button{
appearance:none;cursor:pointer;flex:none;
width:2.75rem;height:2.75rem;
border:1px solid var(--vibeui-date-002-border);border-radius:0.625rem;
background:var(--vibeui-date-002-surface);color:var(--vibeui-date-002-accent);
display:grid;place-items:center;
transition:background-color .14s ease,border-color .14s ease;
}
[data-vibeui-block="date-002"] button:hover,
[data-vibeui-block="date-002"] button[data-active="true"]{background:var(--vibeui-date-002-soft);border-color:var(--vibeui-date-002-accent)}
/* Витринная отметка: кнопка показана нажатой, потому что системный календарь
   рисует браузер и на скриншоте его нет. */
[data-vibeui-block="date-002"] button[data-active="true"]{box-shadow:inset 0 0 0 1px var(--vibeui-date-002-accent)}
[data-vibeui-block="date-002"] button:focus-visible{outline:2px solid var(--vibeui-date-002-accent);outline-offset:2px}
[data-vibeui-block="date-002"] svg{width:1.25rem;height:1.25rem;display:block}
[data-vibeui-block="date-002"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-date-002-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="date-002"] *{animation:none!important;transition:none!important}}
`

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
 * Поле даты с отдельной кнопкой, открывающей системный календарь.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Date002({
  label = "Дата визита",
  hint = "Кнопка открывает системный календарь, поле принимает ввод с клавиатуры.",
  defaultValue = "2026-09-15",
  min = "2026-09-01",
  max = "2026-12-31",
  name = "visit-date",
  openLabel = "Открыть календарь",
  active = false,
  background = "",
  accent,
  className,
  style,
  ...props
}: Date002Props) {
  const id = useId()
  const field = useRef<HTMLInputElement>(null)

  const openCalendar = () => {
    const input = field.current
    if (!input) return
    // showPicker знают не все браузеры: без него остаётся ввод с клавиатуры.
    if (typeof input.showPicker === "function") {
      input.showPicker()
      return
    }
    input.focus()
  }

  const palette = {
    ...(accent ? { "--vibeui-date-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-date-002-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-date-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="date-selector"
        data-vibeui-block="date-002"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="row">
          <input
            id={id}
            ref={field}
            name={name}
            type="date"
            defaultValue={defaultValue}
            min={min}
            max={max}
            aria-describedby={hint ? `${id}-hint` : undefined}
          />
          <button
            type="button"
            onClick={openCalendar}
            aria-label={openLabel}
            data-active={active || undefined}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect
                x="3"
                y="5"
                width="18"
                height="16"
                rx="3"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M3 10h18M8 3v4M16 3v4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        {hint ? (
          <p id={`${id}-hint`} data-part="hint">
            {hint}
          </p>
        ) : null}
      </div>
    </>
  )
}
