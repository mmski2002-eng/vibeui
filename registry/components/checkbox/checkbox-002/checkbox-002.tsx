"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Checkbox002Option = {
  value: string
  title: string
  description: string
  price?: string
}

export type Checkbox002Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "onChange"
> & {
  legend?: string
  options?: Checkbox002Option[]
  defaultValue?: string[]
  /** Строка счётчика. {selected} — выбрано, {total} — всего вариантов. */
  countText?: string
  onChange?: (value: string[]) => void
  /** Пусто — подложки нет, панель лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: множественный выбор карточками. Внутри настоящие checkbox,
// поэтому пробел, Tab и объявление «отмечено» работают сами. Вся карточка —
// label: попасть надо в неё, а не в квадратик 16 пикселей. Галочка нарисована
// бордюрами и появляется только у отмеченного.
//
// Тема берётся из color-scheme окружения через light-dark(): панель темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="checkbox-002"]){
--vibeui-checkbox-002-surface:transparent;
--vibeui-checkbox-002-bg:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-checkbox-002-fg:light-dark(oklch(0.22 0.014 265),oklch(0.95 0.005 265));
--vibeui-checkbox-002-muted:color-mix(in oklab,var(--vibeui-checkbox-002-fg) 68%,transparent);
--vibeui-checkbox-002-border:light-dark(oklch(0.91 0.006 265),oklch(0.38 0.012 265));
--vibeui-checkbox-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.15 265));
--vibeui-checkbox-002-mark:light-dark(oklch(0.99 0.01 265),oklch(0.2 0.014 265));
--vibeui-checkbox-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="checkbox-002"]{color-scheme:dark}
[data-vibeui-block="checkbox-002"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;
margin:0;padding:0.875rem;
border:1px solid var(--vibeui-checkbox-002-border);border-radius:1rem;
background:var(--vibeui-checkbox-002-surface);
font-family:var(--vibeui-checkbox-002-font);color:var(--vibeui-checkbox-002-fg);
}
/* legend у fieldset садится на рамку и обрезается — float возвращает
   его в поток обычной строкой. */
[data-vibeui-block="checkbox-002"] legend{float:left;width:100%;padding:0;margin-bottom:0.375rem;font-size:0.8125rem;font-weight:650}
/* Вся карточка — label: цель нажатия размером с карточку, а не с квадратик. */
[data-vibeui-block="checkbox-002"] label{
position:relative;display:grid;grid-template-columns:auto 1fr auto;
align-items:start;gap:0.125rem 0.625rem;
padding:0.75rem;cursor:pointer;
border:1px solid var(--vibeui-checkbox-002-border);border-radius:0.75rem;
background:var(--vibeui-checkbox-002-bg);
}
[data-vibeui-block="checkbox-002"] input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}
[data-vibeui-block="checkbox-002"] [data-part="box"]{
grid-row:span 2;display:flex;align-items:center;justify-content:center;flex:none;
width:1.125rem;height:1.125rem;margin-top:0.125rem;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-002-border);border-radius:0.3125rem;
background:var(--vibeui-checkbox-002-bg);
}
[data-vibeui-block="checkbox-002"] [data-part="tick"]{
width:0.25rem;height:0.4375rem;margin-top:-0.0625rem;opacity:0;
border-right:2px solid var(--vibeui-checkbox-002-mark);
border-bottom:2px solid var(--vibeui-checkbox-002-mark);
transform:rotate(45deg);
}
[data-vibeui-block="checkbox-002"] label:has(input:checked){
border-color:var(--vibeui-checkbox-002-accent);
box-shadow:inset 0 0 0 1px var(--vibeui-checkbox-002-accent);
}
[data-vibeui-block="checkbox-002"] label:has(input:checked) [data-part="box"]{
border-color:transparent;background:var(--vibeui-checkbox-002-accent);
}
[data-vibeui-block="checkbox-002"] label:has(input:checked) [data-part="tick"]{opacity:1}
[data-vibeui-block="checkbox-002"] label:has(input:focus-visible){outline:2px solid var(--vibeui-checkbox-002-accent);outline-offset:2px}
[data-vibeui-block="checkbox-002"] [data-part="title"]{font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="checkbox-002"] [data-part="price"]{grid-column:3;grid-row:span 2;justify-self:end;font-size:0.875rem;font-weight:680;font-variant-numeric:tabular-nums}
[data-vibeui-block="checkbox-002"] [data-part="description"]{grid-column:2;font-size:0.8125rem;line-height:1.4;color:var(--vibeui-checkbox-002-muted)}
[data-vibeui-block="checkbox-002"] [data-part="count"]{font-size:0.75rem;color:var(--vibeui-checkbox-002-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Checkbox002Option[] = [
  {
    value: "delivery",
    title: "Доставка курьером",
    description: "Привезём завтра с 10:00 до 14:00.",
    price: "390 ₽",
  },
  {
    value: "assembly",
    title: "Сборка на месте",
    description: "Соберём и заберём упаковку с собой.",
    price: "1 200 ₽",
  },
  {
    value: "insurance",
    title: "Страховка на год",
    description: "Замена при поломке без экспертизы.",
    price: "590 ₽",
  },
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
 * Множественный выбор карточками на настоящих checkbox.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Checkbox002({
  legend = "Дополнительно к заказу",
  options = DEFAULT_OPTIONS,
  defaultValue = ["delivery"],
  countText = "Выбрано: {selected} из {total}",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Checkbox002Props) {
  const id = useId()
  const [value, setValue] = useState<string[]>(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-checkbox-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-checkbox-002-surface": background,
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

  const count = countText
    .replace("{selected}", String(value.length))
    .replace("{total}", String(options.length))

  return (
    <>
      <style href="vibeui-checkbox-002" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="checkbox"
        data-vibeui-block="checkbox-002"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        {options.map((option) => (
          <label key={option.value}>
            <input
              type="checkbox"
              name={`${id}-${option.value}`}
              checked={value.includes(option.value)}
              onChange={() => toggle(option.value)}
            />
            <span data-part="box" aria-hidden="true">
              <span data-part="tick" />
            </span>
            <span data-part="title">{option.title}</span>
            {option.price ? (
              <span data-part="price">{option.price}</span>
            ) : null}
            <span data-part="description">{option.description}</span>
          </label>
        ))}
        <span data-part="count">{count}</span>
      </fieldset>
    </>
  )
}
