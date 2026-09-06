"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Checkbox004Filter = {
  label: string
  count: number
  disabled?: boolean
}

export type Checkbox004Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "onChange"
> & {
  legend?: string
  filters?: Checkbox004Filter[]
  defaultValue?: string[]
  /** Итог внизу. {count} — сумма находок по отмеченным фильтрам. */
  foundText?: string
  /** Подпись кнопки сброса. */
  resetLabel?: string
  onChange?: (value: string[]) => void
  /** Пусто — подложки нет, панель лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: список фильтров с числом находок у каждого. Ноль находок
// не прячется, а выключается: исчезнувший фильтр заставляет думать, что его
// вообще нет. Числа выровнены по правому краю табличными цифрами — так
// сравнивают, что выбрать.
//
// Тема берётся из color-scheme окружения через light-dark(): панель темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="checkbox-004"]){
--vibeui-checkbox-004-surface:transparent;
--vibeui-checkbox-004-bg:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-checkbox-004-fg:light-dark(oklch(0.22 0 265),oklch(0.95 0 265));
--vibeui-checkbox-004-muted:color-mix(in oklab,var(--vibeui-checkbox-004-fg) 68%,transparent);
--vibeui-checkbox-004-border:light-dark(oklch(0.88 0 265),oklch(0.4 0 265));
--vibeui-checkbox-004-hover:light-dark(oklch(0.97 0 265),oklch(0.32 0 265));
--vibeui-checkbox-004-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.73 0.15 39.8));
--vibeui-checkbox-004-mark:light-dark(oklch(0.99 0 265),oklch(0.2 0 265));
--vibeui-checkbox-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="checkbox-004"]{color-scheme:dark}
[data-vibeui-block="checkbox-004"]{
display:flex;flex-direction:column;gap:0.125rem;
width:100%;max-width:17rem;box-sizing:border-box;
margin:0;padding:0.75rem;
border:1px solid var(--vibeui-checkbox-004-border);border-radius:0.875rem;
background:var(--vibeui-checkbox-004-surface);
font-family:var(--vibeui-checkbox-004-font);color:var(--vibeui-checkbox-004-fg);
}
/* legend у fieldset садится на рамку и обрезается — float возвращает
   его в поток обычной строкой. */
[data-vibeui-block="checkbox-004"] legend{float:left;width:100%;padding:0 0 0.375rem;font-size:0.8125rem;font-weight:650}
/* Строка целиком кликабельна и подсвечивается: попадать в квадратик не надо. */
[data-vibeui-block="checkbox-004"] label{
display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:0.625rem;
min-height:2rem;padding:0 0.375rem;border-radius:0.5rem;
font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="checkbox-004"] label:hover{background:var(--vibeui-checkbox-004-hover)}
[data-vibeui-block="checkbox-004"] label:has(input:disabled){cursor:not-allowed;color:var(--vibeui-checkbox-004-muted)}
[data-vibeui-block="checkbox-004"] label:has(input:disabled):hover{background:transparent}
[data-vibeui-block="checkbox-004"] input{
appearance:none;flex:none;cursor:inherit;position:relative;
width:1.125rem;height:1.125rem;margin:0;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-004-border);border-radius:0.3125rem;
background:var(--vibeui-checkbox-004-bg);
}
[data-vibeui-block="checkbox-004"] input:checked{border-color:transparent;background:var(--vibeui-checkbox-004-accent)}
[data-vibeui-block="checkbox-004"] input:checked::after{
content:"";position:absolute;left:50%;top:50%;
width:0.25rem;height:0.4375rem;margin:-0.3125rem 0 0 -0.125rem;
border-right:2px solid var(--vibeui-checkbox-004-mark);
border-bottom:2px solid var(--vibeui-checkbox-004-mark);
transform:rotate(45deg);
}
[data-vibeui-block="checkbox-004"] input:focus-visible{outline:2px solid var(--vibeui-checkbox-004-accent);outline-offset:2px}
/* Ноль находок выключается, а не исчезает: пропавший фильтр читается как
   отсутствующий вовсе. */
[data-vibeui-block="checkbox-004"] [data-part="count"]{
justify-self:end;font-size:0.75rem;color:var(--vibeui-checkbox-004-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="checkbox-004"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
margin-top:0.375rem;padding-top:0.5rem;
border-top:1px solid var(--vibeui-checkbox-004-border);
font-size:0.75rem;color:var(--vibeui-checkbox-004-muted);
}
[data-vibeui-block="checkbox-004"] button{
appearance:none;border:0;background:transparent;cursor:pointer;padding:0;
color:var(--vibeui-checkbox-004-accent);font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="checkbox-004"] button:disabled{color:var(--vibeui-checkbox-004-muted);cursor:not-allowed}
[data-vibeui-block="checkbox-004"] button:focus-visible{outline:2px solid var(--vibeui-checkbox-004-accent);outline-offset:2px;border-radius:0.25rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FILTERS: Checkbox004Filter[] = [
  { label: "Кнопки", count: 20 },
  { label: "Формы", count: 14 },
  { label: "Навигация", count: 12 },
  { label: "Графики", count: 10 },
  { label: "Календари", count: 0, disabled: true },
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
 * Список фильтров с числом находок: ноль выключается, а не исчезает.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Checkbox004({
  legend = "Категория",
  filters = DEFAULT_FILTERS,
  defaultValue = ["Кнопки"],
  foundText = "Найдётся: {count}",
  resetLabel = "Сбросить",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Checkbox004Props) {
  const [value, setValue] = useState<string[]>(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-checkbox-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-checkbox-004-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const update = (next: string[]) => {
    setValue(next)
    onChange?.(next)
  }

  const found = filters
    .filter((filter) => value.includes(filter.label))
    .reduce((sum, filter) => sum + filter.count, 0)

  return (
    <>
      <style href="vibeui-checkbox-004" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="checkbox"
        data-vibeui-block="checkbox-004"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        {filters.map((filter) => (
          <label key={filter.label}>
            <input
              type="checkbox"
              checked={value.includes(filter.label)}
              disabled={filter.disabled}
              onChange={() =>
                update(
                  value.includes(filter.label)
                    ? value.filter((item) => item !== filter.label)
                    : [...value, filter.label],
                )
              }
            />
            <span>{filter.label}</span>
            <span data-part="count">{filter.count}</span>
          </label>
        ))}
        <p data-part="foot">
          <span>{foundText.replace("{count}", String(found))}</span>
          <button
            type="button"
            disabled={value.length === 0}
            onClick={() => update([])}
          >
            {resetLabel}
          </button>
        </p>
      </fieldset>
    </>
  )
}
