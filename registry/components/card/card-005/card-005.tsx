"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Card005Option = {
  value: string
  title: string
  description: string
  price?: string
  note?: string
}

export type Card005Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "onChange"
> & {
  legend?: string
  options?: Card005Option[]
  defaultValue?: string
  onChange?: (value: string) => void
  /** Пусто — подложки нет, группа лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: выбор тарифа карточками. Внутри настоящие radio, поэтому
// стрелки и объявление «2 из 3» работают сами; вся карточка — это label, и
// попасть можно в любую её точку, а не в кружок диаметром 16 пикселей.
// Выбранная отличается рамкой и кружком, а не только фоном.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте рамка светлее подложки, а не темнее.
const STYLES = `
:where([data-vibeui-block="card-005"]){
--vibeui-card-005-bg:light-dark(oklch(1 0 0),oklch(0.29 0.011 265));
--vibeui-card-005-surface:transparent;
--vibeui-card-005-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-card-005-muted:color-mix(in oklab,var(--vibeui-card-005-fg) 68%,transparent);
--vibeui-card-005-border:light-dark(oklch(0.91 0.006 265),oklch(0.37 0.012 265));
--vibeui-card-005-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-card-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-005"]{color-scheme:dark}
/* Подложка группы по умолчанию прозрачная: заголовок «как платить» ложится
   на фон страницы и красится из color-scheme. */
[data-vibeui-block="card-005"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;
margin:0;padding:0.875rem;
border:1px solid var(--vibeui-card-005-border);border-radius:1rem;
background:var(--vibeui-card-005-surface);
font-family:var(--vibeui-card-005-font);color:var(--vibeui-card-005-fg);
}
[data-vibeui-block="card-005"] legend{
padding:0;margin-bottom:0.375rem;font-size:0.8125rem;font-weight:650;
}
/* Вся карточка — label: цель нажатия размером с карточку, а не с кружок. */
[data-vibeui-block="card-005"] label{
position:relative;display:grid;grid-template-columns:auto 1fr auto;
align-items:start;gap:0.125rem 0.625rem;
padding:0.75rem;cursor:pointer;
border:1px solid var(--vibeui-card-005-border);border-radius:0.75rem;
background:var(--vibeui-card-005-bg);
}
[data-vibeui-block="card-005"] input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}
[data-vibeui-block="card-005"] [data-part="mark"]{
grid-row:span 2;display:flex;align-items:center;justify-content:center;flex:none;
width:1.125rem;height:1.125rem;margin-top:0.125rem;
border:1.5px solid var(--vibeui-card-005-border);border-radius:9999px;
}
[data-vibeui-block="card-005"] [data-part="mark"]::after{
content:"";width:0.5rem;height:0.5rem;border-radius:9999px;background:transparent;
}
[data-vibeui-block="card-005"] label:has(input:checked){
border-color:var(--vibeui-card-005-accent);
box-shadow:inset 0 0 0 1px var(--vibeui-card-005-accent);
}
[data-vibeui-block="card-005"] label:has(input:checked) [data-part="mark"]{border-color:var(--vibeui-card-005-accent)}
[data-vibeui-block="card-005"] label:has(input:checked) [data-part="mark"]::after{background:var(--vibeui-card-005-accent)}
[data-vibeui-block="card-005"] label:has(input:focus-visible){outline:2px solid var(--vibeui-card-005-accent);outline-offset:2px}
[data-vibeui-block="card-005"] [data-part="title"]{font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="card-005"] [data-part="price"]{
grid-column:3;grid-row:span 2;justify-self:end;
font-size:0.875rem;font-weight:680;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="card-005"] [data-part="description"]{
grid-column:2;font-size:0.8125rem;line-height:1.4;color:var(--vibeui-card-005-muted);
}
[data-vibeui-block="card-005"] [data-part="note"]{
grid-column:2;margin-top:0.25rem;font-size:0.75rem;color:var(--vibeui-card-005-accent);font-weight:600;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Card005Option[] = [
  {
    value: "month",
    title: "Помесячно",
    description: "Списание раз в месяц, отказаться можно в любой момент.",
    price: "990 ₽",
  },
  {
    value: "year",
    title: "На год",
    description: "Один платёж вместо двенадцати, счёт выставляется сразу.",
    price: "9 900 ₽",
    note: "Два месяца в подарок",
  },
  {
    value: "team",
    title: "Команда",
    description: "До десяти человек, общая оплата и единый счёт.",
    price: "24 900 ₽",
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Выбор тарифа карточками на настоящих radio.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Card005({
  legend = "Как платить",
  options = DEFAULT_OPTIONS,
  defaultValue = "year",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Card005Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-card-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-card-005-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-005" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="card"
        data-vibeui-block="card-005"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        {options.map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name={id}
              value={option.value}
              checked={value === option.value}
              onChange={() => {
                setValue(option.value)
                onChange?.(option.value)
              }}
            />
            <span data-part="mark" aria-hidden="true" />
            <span data-part="title">{option.title}</span>
            {option.price ? (
              <span data-part="price">{option.price}</span>
            ) : null}
            <span data-part="description">{option.description}</span>
            {option.note ? <span data-part="note">{option.note}</span> : null}
          </label>
        ))}
      </fieldset>
    </>
  )
}
