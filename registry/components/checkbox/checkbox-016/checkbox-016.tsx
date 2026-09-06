"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Checkbox016Props = Omit<
  ComponentProps<"section">,
  "children" | "onChange"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  defaultValue?: string[]
  /** Заголовок группы отмеченных. */
  pickedLabel?: string
  /** Заголовок группы остальных. */
  restLabel?: string
  /** Строка, когда поиск ничего не дал. */
  emptyText?: string
  /** Счётчик внизу. {count} — отмечено, {total} — всего. */
  countText?: string
  onChange?: (value: string[]) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: длинный список с поиском по пунктам. Отмеченные всегда
// показываются сверху и не прячутся фильтром — иначе поиск выглядит так,
// будто он сбросил выбор. Список прокручивается внутри себя, чтобы поле
// поиска и счётчик оставались на месте.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="checkbox-016"]){
--vibeui-checkbox-016-bg:transparent;
--vibeui-checkbox-016-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-checkbox-016-muted:color-mix(in oklab,var(--vibeui-checkbox-016-fg) 68%,transparent);
--vibeui-checkbox-016-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-checkbox-016-field:light-dark(oklch(0.975 0 265),oklch(0.27 0 265));
--vibeui-checkbox-016-accent:light-dark(oklch(0.54 0.16 245),oklch(0.66 0.16 245));
--vibeui-checkbox-016-on-accent:oklch(0.99 0 245);
--vibeui-checkbox-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="checkbox-016"]{color-scheme:dark}
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
width:1.125rem;height:1.125rem;margin:0;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-016-border);border-radius:0.3125rem;
background:var(--vibeui-checkbox-016-bg);
transition:background-color .15s ease,border-color .15s ease;
}
[data-vibeui-block="checkbox-016"] input[type="checkbox"]:checked{border-color:transparent;background:var(--vibeui-checkbox-016-accent)}
[data-vibeui-block="checkbox-016"] input[type="checkbox"]:checked::after{
content:"";position:absolute;left:50%;top:50%;
width:0.25rem;height:0.4375rem;margin:-0.3125rem 0 0 -0.125rem;
border-right:2px solid var(--vibeui-checkbox-016-on-accent);border-bottom:2px solid var(--vibeui-checkbox-016-on-accent);
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
 * Список чекбоксов с поиском по пунктам: отмеченные закреплены сверху
 * и не исчезают при фильтрации. Один файл, ноль зависимостей.
 */
export function Checkbox016({
  label = "Страны доставки",
  placeholder = "Поиск по списку",
  options = DEFAULT_OPTIONS,
  defaultValue = ["Грузия"],
  pickedLabel = "Выбрано",
  restLabel = "Остальные",
  emptyText = "Ничего не нашлось",
  countText = "Отмечено {count} из {total}",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Checkbox016Props) {
  const [value, setValue] = useState<string[]>(defaultValue)
  const [query, setQuery] = useState("")

  const palette = {
    ...(accent ? { "--vibeui-checkbox-016-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-checkbox-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        data-slot="checkbox"
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
              {pickedLabel}
            </li>
          ) : null}
          {picked.map(row)}
          {picked.length > 0 && rest.length > 0 ? (
            <li data-part="group" aria-hidden="true">
              {restLabel}
            </li>
          ) : null}
          {rest.map(row)}
          {rest.length === 0 && query.trim() !== "" ? (
            <li data-part="empty">{emptyText}</li>
          ) : null}
        </ul>
        <p data-part="foot" role="status">
          {countText
            .replace("{count}", String(value.length))
            .replace("{total}", String(options.length))}
        </p>
      </section>
    </>
  )
}
