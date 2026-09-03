"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Checkbox019Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "onChange"
> & {
  legend?: string
  options?: string[]
  defaultValue?: string[]
  /** Подпись кнопки сброса. */
  resetLabel?: string
  /** Строка под лентой, когда ничего не выбрано. */
  emptyText?: string
  /** Строка под лентой со счётчиком. {count} — сколько выбрано. */
  countText?: string
  onChange?: (value: string[]) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: фильтры-таблетки в одну ленту с переносом. Каждая
// таблетка — настоящий чекбокс со спрятанным input, поэтому Tab и пробел
// работают, а внешне это компактный ряд, помещающийся над списком. Отмеченная
// таблетка не только заливается, но и получает галочку слева: заливка одна
// не читается при дальтонизме.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="checkbox-019"]){
--vibeui-checkbox-019-bg:transparent;
--vibeui-checkbox-019-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.006 265));
--vibeui-checkbox-019-muted:color-mix(in oklab,var(--vibeui-checkbox-019-fg) 68%,transparent);
--vibeui-checkbox-019-border:light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265));
--vibeui-checkbox-019-chip:light-dark(oklch(0.97 0.003 265),oklch(0.27 0.009 265));
--vibeui-checkbox-019-accent:light-dark(oklch(0.45 0.13 200),oklch(0.62 0.13 200));
--vibeui-checkbox-019-on:light-dark(oklch(0.98 0.01 200),oklch(0.17 0.03 200));
--vibeui-checkbox-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="checkbox-019"]{color-scheme:dark}
[data-vibeui-block="checkbox-019"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
width:100%;max-width:26rem;box-sizing:border-box;
margin:0;padding:0.75rem;border:1px solid var(--vibeui-checkbox-019-border);border-radius:0.875rem;
background:var(--vibeui-checkbox-019-bg);
font-family:var(--vibeui-checkbox-019-font);color:var(--vibeui-checkbox-019-fg);
}
[data-vibeui-block="checkbox-019"] legend{float:left;width:100%;padding:0 0 0.5rem;font-size:0.75rem;font-weight:650;color:var(--vibeui-checkbox-019-muted);text-transform:uppercase;letter-spacing:0.04em}
[data-vibeui-block="checkbox-019"] label{
clear:both;display:inline-flex;align-items:center;gap:0.25rem;
height:1.875rem;padding:0 0.625rem;border-radius:9999px;cursor:pointer;
background:var(--vibeui-checkbox-019-chip);
box-shadow:inset 0 0 0 1px var(--vibeui-checkbox-019-border);
font-size:0.8125rem;line-height:1;white-space:nowrap;
transition:background-color .15s ease,color .15s ease,box-shadow .15s ease;
}
[data-vibeui-block="checkbox-019"] label:hover{box-shadow:inset 0 0 0 1px var(--vibeui-checkbox-019-accent)}
[data-vibeui-block="checkbox-019"] label:has(input:checked){
background:var(--vibeui-checkbox-019-accent);color:var(--vibeui-checkbox-019-on);
box-shadow:none;font-weight:600;
}
[data-vibeui-block="checkbox-019"] label:has(input:focus-visible){outline:2px solid var(--vibeui-checkbox-019-accent);outline-offset:2px}
[data-vibeui-block="checkbox-019"] input{
appearance:none;position:absolute;width:1px;height:1px;margin:0;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
/* Галочка появляется шириной, а не opacity: невыбранная таблетка не тащит
   за собой пустое место под значок. */
[data-vibeui-block="checkbox-019"] [data-part="tick"]{
display:inline-block;width:0;height:0.5rem;overflow:hidden;
transition:width .15s ease,margin .15s ease;
}
[data-vibeui-block="checkbox-019"] label:has(input:checked) [data-part="tick"]{
width:0.3125rem;margin-right:0.1875rem;
border-right:2px solid currentColor;border-bottom:2px solid currentColor;
height:0.5rem;transform:rotate(45deg) translateY(-1px);
}
[data-vibeui-block="checkbox-019"] button{
appearance:none;border:0;background:transparent;cursor:pointer;padding:0 0.25rem;
font:inherit;font-size:0.75rem;font-weight:650;color:var(--vibeui-checkbox-019-accent);
}
[data-vibeui-block="checkbox-019"] button:disabled{color:var(--vibeui-checkbox-019-muted);cursor:not-allowed}
[data-vibeui-block="checkbox-019"] button:focus-visible{outline:2px solid var(--vibeui-checkbox-019-accent);outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="checkbox-019"] [data-part="count"]{
flex:1 1 100%;margin:0.25rem 0 0;font-size:0.75rem;color:var(--vibeui-checkbox-019-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-019"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "Бесплатно",
  "Со скидкой",
  "Новинки",
  "В наличии",
  "С доставкой",
  "Отзывы 4+",
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
 * Компактный ряд фильтров-таблеток: настоящие чекбоксы со спрятанным input,
 * галочка у отмеченных и сброс. Один файл, ноль зависимостей.
 */
export function Checkbox019({
  legend = "Быстрые фильтры",
  options = DEFAULT_OPTIONS,
  defaultValue = ["В наличии"],
  resetLabel = "Сбросить",
  emptyText = "Фильтры не выбраны",
  countText = "Выбрано фильтров: {count}",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Checkbox019Props) {
  const [value, setValue] = useState<string[]>(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-checkbox-019-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-checkbox-019-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const update = (next: string[]) => {
    setValue(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-checkbox-019" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="checkbox"
        data-vibeui-block="checkbox-019"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        {options.map((option) => (
          <label key={option}>
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={() =>
                update(
                  value.includes(option)
                    ? value.filter((item) => item !== option)
                    : [...value, option],
                )
              }
            />
            <span data-part="tick" aria-hidden="true" />
            <span>{option}</span>
          </label>
        ))}
        <button
          type="button"
          disabled={value.length === 0}
          onClick={() => update([])}
        >
          {resetLabel}
        </button>
        <p data-part="count" role="status">
          {value.length === 0
            ? emptyText
            : countText.replace("{count}", String(value.length))}
        </p>
      </fieldset>
    </>
  )
}
