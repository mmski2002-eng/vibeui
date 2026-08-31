"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Checkbox016Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onChange"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  accent?: string
}

// Идея компонента: длинный список с поиском по пунктам. Отмеченные всегда
// показываются сверху и не прячутся фильтром — иначе поиск выглядит так,
// будто он сбросил выбор. Список прокручивается внутри себя, чтобы поле
// поиска и счётчик оставались на месте.
const STYLES = `
:where([data-vibeui-block="checkbox-016"]){
--vibeui-checkbox-016-bg:oklch(1 0 0);
--vibeui-checkbox-016-fg:oklch(0.22 0.014 265);
--vibeui-checkbox-016-muted:oklch(0.56 0.014 265);
--vibeui-checkbox-016-border:oklch(0.9 0.006 265);
--vibeui-checkbox-016-field:oklch(0.975 0.003 265);
--vibeui-checkbox-016-accent:oklch(0.54 0.16 245);
--vibeui-checkbox-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="checkbox-016"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:19rem;box-sizing:border-box;
padding:0.875rem;border:1px solid var(--vibeui-checkbox-016-border);border-radius:0.875rem;
background:var(--vibeui-checkbox-016-bg);
font-family:var(--vibeui-checkbox-016-font);color:var(--vibeui-checkbox-016-fg);
}
[data-vibeui-block="checkbox-016"] [data-part="label"]{
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="checkbox-016"] input[type="search"]{
appearance:none;width:100%;box-sizing:border-box;
height:2.125rem;padding:0 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-checkbox-016-border);
background:var(--vibeui-checkbox-016-field);color:inherit;
font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="checkbox-016"] input[type="search"]:focus-visible{
outline:2px solid var(--vibeui-checkbox-016-accent);outline-offset:1px;
}
/* Список прокручивается внутри себя: поле поиска и счётчик не уезжают
   вместе с ним. */
[data-vibeui-block="checkbox-016"] [data-part="list"]{
display:flex;flex-direction:column;margin:0;padding:0;list-style:none;
max-height:11rem;overflow-y:auto;overscroll-behavior:contain;
}
[data-vibeui-block="checkbox-016"] [data-part="group"]{
padding:0.375rem 0 0.125rem;font-size:0.6875rem;font-weight:700;
letter-spacing:0.04em;text-transform:uppercase;color:var(--vibeui-checkbox-016-muted);
}
[data-vibeui-block="checkbox-016"] label{
display:flex;align-items:center;gap:0.625rem;
min-height:2rem;padding:0 0.375rem;margin:0 -0.375rem;border-radius:0.5rem;
font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="checkbox-016"] label:hover{background:var(--vibeui-checkbox-016-field)}
[data-vibeui-block="checkbox-016"] input[type="checkbox"]{
appearance:none;position:relative;flex:none;cursor:pointer;
width:1.0625rem;height:1.0625rem;margin:0;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-016-border);border-radius:0.3125rem;
background:var(--vibeui-checkbox-016-bg);
transition:background-color .15s ease,border-color .15s ease;
}
[data-vibeui-block="checkbox-016"] input[type="checkbox"]:checked{border-color:transparent;background:var(--vibeui-checkbox-016-accent)}
[data-vibeui-block="checkbox-016"] input[type="checkbox"]:checked::after{
content:"";position:absolute;left:50%;top:50%;
width:0.25rem;height:0.4375rem;margin:-0.3125rem 0 0 -0.125rem;
border-right:2px solid oklch(0.99 0.01 245);border-bottom:2px solid oklch(0.99 0.01 245);
transform:rotate(45deg);
}
[data-vibeui-block="checkbox-016"] input[type="checkbox"]:focus-visible{outline:2px solid var(--vibeui-checkbox-016-accent);outline-offset:2px}
[data-vibeui-block="checkbox-016"] [data-part="empty"]{
padding:0.75rem 0;font-size:0.8125rem;color:var(--vibeui-checkbox-016-muted);text-align:center;
}
[data-vibeui-block="checkbox-016"] [data-part="foot"]{
margin:0;padding-top:0.5rem;border-top:1px solid var(--vibeui-checkbox-016-border);
font-size:0.75rem;color:var(--vibeui-checkbox-016-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "Армения",
  "Бразилия",
  "Венгрия",
  "Германия",
  "Грузия",
  "Индия",
  "Испания",
  "Казахстан",
  "Канада",
  "Мексика",
  "Португалия",
  "Сербия",
  "Турция",
  "Франция",
]

/**
 * Список чекбоксов с поиском по пунктам: отмеченные закреплены сверху
 * и не исчезают при фильтрации. Один файл, ноль зависимостей.
 */
export function Checkbox016({
  label = "Страны доставки",
  placeholder = "Поиск по списку",
  options = DEFAULT_OPTIONS,
  defaultValue = ["Грузия"],
  onChange,
  accent,
  className,
  style,
  ...props
}: Checkbox016Props) {
  const [value, setValue] = useState<string[]>(defaultValue)
  const [query, setQuery] = useState("")

  const palette = {
    ...(accent ? { "--vibeui-checkbox-016-accent": accent } : null),
    ...style,
  } as CSSProperties

  const toggle = (option: string) => {
    const next = value.includes(option)
      ? value.filter((item) => item !== option)
      : [...value, option]

    setValue(next)
    onChange?.(next)
  }

  const picked = options.filter((option) => value.includes(option))
  const rest = options.filter(
    (option) =>
      !value.includes(option) &&
      option.toLowerCase().includes(query.trim().toLowerCase()),
  )

  const row = (option: string) => (
    <li key={option}>
      <label>
        <input
          type="checkbox"
          checked={value.includes(option)}
          onChange={() => toggle(option)}
        />
        <span>{option}</span>
      </label>
    </li>
  )

  return (
    <>
      <style href="vibeui-checkbox-016" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="checkbox-016"
        className={className}
        style={palette}
        aria-label={label}
      >
        <span data-part="label">{label}</span>
        <input
          type="search"
          value={query}
          placeholder={placeholder}
          aria-label={placeholder}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ul data-part="list">
          {picked.length > 0 ? (
            <li data-part="group" aria-hidden="true">
              Выбрано
            </li>
          ) : null}
          {picked.map(row)}
          {picked.length > 0 && rest.length > 0 ? (
            <li data-part="group" aria-hidden="true">
              Остальные
            </li>
          ) : null}
          {rest.map(row)}
          {rest.length === 0 && query.trim() !== "" ? (
            <li data-part="empty">Ничего не нашлось</li>
          ) : null}
        </ul>
        <p data-part="foot" role="status">
          Отмечено {value.length} из {options.length}
        </p>
      </section>
    </>
  )
}
