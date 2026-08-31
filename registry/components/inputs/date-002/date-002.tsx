"use client"

import { useId, useRef } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Date002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  hint?: string
  defaultValue?: string
  min?: string
  max?: string
  name?: string
  accent?: string
}

// Идея компонента: календарь вынесен в настоящую кнопку рядом с полем.
// Родная иконка календаря — крошечная зона внутри поля, в части браузеров её
// вообще не видно, и попасть в неё пальцем почти невозможно. Кнопка на 2.75rem
// зовёт тот же системный календарь через showPicker(), а если браузер метода
// не знает — просто ставит фокус в поле, и остаётся ввод с клавиатуры.
const STYLES = `
:where([data-vibeui-block="date-002"]){
--vibeui-date-002-surface:oklch(1 0 0);
--vibeui-date-002-field:oklch(1 0 0);
--vibeui-date-002-shell:oklch(0.9 0.006 265);
--vibeui-date-002-fg:oklch(0.23 0.014 265);
--vibeui-date-002-muted:oklch(0.55 0.014 265);
--vibeui-date-002-border:oklch(0.88 0.008 265);
--vibeui-date-002-accent:oklch(0.55 0.18 262);
--vibeui-date-002-soft:oklch(0.55 0.18 262 / 10%);
--vibeui-date-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: поле показывают поверх любого фона. */
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
[data-vibeui-block="date-002"] button:hover{background:var(--vibeui-date-002-soft);border-color:var(--vibeui-date-002-accent)}
[data-vibeui-block="date-002"] button:focus-visible{outline:2px solid var(--vibeui-date-002-accent);outline-offset:2px}
[data-vibeui-block="date-002"] svg{width:1.25rem;height:1.25rem;display:block}
[data-vibeui-block="date-002"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-date-002-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="date-002"] *{animation:none!important;transition:none!important}}
`

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
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-date-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
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
            aria-label="Открыть календарь"
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
