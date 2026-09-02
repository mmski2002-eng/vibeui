"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup057Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  options?: string[]
  defaultValue?: string
  name?: string
  label?: string
  /** Строка под группой: {field} — место, куда встаёт имя поля и значение. */
  wireText?: string
  onChange?: (value: string) => void
  /** Пусто — заливки нет, сцепка ложится на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: группа кнопок, которая честно отправляется формой.
// Кнопки с aria-pressed сами по себе ничего не отправляют, поэтому рядом
// лежит скрытый input с тем же значением — форма собирает его через FormData
// так же, как обычное поле, и серверу не нужно ничего знать про кнопки.
// Выбранное значение продублировано на корне атрибутом data-value: его видно
// в инспекторе и по нему можно писать тесты и стили, не заглядывая в состояние
// React. Строка под группой показывает, что именно уедет на сервер, — это не
// украшение, а способ поймать расхождение между видом и данными.
const STYLES = `
:where([data-vibeui-block="buttongroup-057"]){
--vibeui-buttongroup-057-surface:transparent;
--vibeui-buttongroup-057-fg:light-dark(oklch(0.25 0.016 265),oklch(0.95 0.005 265));
--vibeui-buttongroup-057-muted:light-dark(oklch(0.56 0.014 265),oklch(0.72 0.012 265));
--vibeui-buttongroup-057-border:light-dark(oklch(0.89 0.008 265),oklch(0.41 0.012 265));
/* Нажатая кнопка — самый контрастный элемент группы: в светлой теме тёмная
   плашка, в тёмной светлая, иначе выбор перестаёт читаться. */
--vibeui-buttongroup-057-on:light-dark(oklch(0.24 0.02 265),oklch(0.93 0.008 265));
--vibeui-buttongroup-057-on-fg:light-dark(oklch(0.99 0.002 265),oklch(0.21 0.02 265));
--vibeui-buttongroup-057-code:light-dark(oklch(0.96 0.005 265),oklch(0.32 0.012 265));
--vibeui-buttongroup-057-accent:light-dark(oklch(0.5 0.16 265),oklch(0.76 0.14 265));
--vibeui-buttongroup-057-radius:0.625rem;
--vibeui-buttongroup-057-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="buttongroup-057"]{
box-sizing:border-box;display:inline-flex;flex-direction:column;gap:0.5rem;
font-family:var(--vibeui-buttongroup-057-font);
}
[data-vibeui-block="buttongroup-057"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-057"] [data-part="track"]{display:flex;isolation:isolate}
[data-vibeui-block="buttongroup-057"] button{
appearance:none;cursor:pointer;font:inherit;
position:relative;z-index:0;
display:inline-flex;align-items:center;justify-content:center;
height:2.25rem;padding:0 0.875rem;margin-inline-start:-1px;
border:1px solid var(--vibeui-buttongroup-057-border);
background:var(--vibeui-buttongroup-057-surface);
color:var(--vibeui-buttongroup-057-muted);
font-size:0.8125rem;font-weight:600;line-height:1;white-space:nowrap;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="buttongroup-057"] button:first-of-type{
margin-inline-start:0;
border-start-start-radius:var(--vibeui-buttongroup-057-radius);
border-end-start-radius:var(--vibeui-buttongroup-057-radius);
}
[data-vibeui-block="buttongroup-057"] button:last-of-type{
border-start-end-radius:var(--vibeui-buttongroup-057-radius);
border-end-end-radius:var(--vibeui-buttongroup-057-radius);
}
[data-vibeui-block="buttongroup-057"] button:hover{color:var(--vibeui-buttongroup-057-fg)}
[data-vibeui-block="buttongroup-057"] button[aria-pressed="true"]{
z-index:1;
background:var(--vibeui-buttongroup-057-on);
border-color:var(--vibeui-buttongroup-057-on);
color:var(--vibeui-buttongroup-057-on-fg);
}
[data-vibeui-block="buttongroup-057"] button:focus-visible{
z-index:2;outline:2px solid var(--vibeui-buttongroup-057-accent);outline-offset:1px;
}
[data-vibeui-block="buttongroup-057"] [data-part="wire"]{
margin:0;color:var(--vibeui-buttongroup-057-muted);
font-size:0.75rem;line-height:1.4;
}
[data-vibeui-block="buttongroup-057"] code{
padding:0.0625rem 0.3125rem;border-radius:0.25rem;
background:var(--vibeui-buttongroup-057-code);
color:var(--vibeui-buttongroup-057-fg);
font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
font-size:0.6875rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-057"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = ["Черновик", "На проверку", "Опубликовать"]

/**
 * Ветка темы для заданного фона. Без неё светлая заливка досталась бы тексту
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
 * Группа кнопок, чей выбор лежит в скрытом input и в data-value на корне.
 * Один файл, ноль зависимостей, клиентский компонент.
 */
export function Buttongroup057({
  options = DEFAULT_OPTIONS,
  defaultValue = "На проверку",
  name = "status",
  label = "Что сделать с материалом",
  wireText = "Форма отправит {field}",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup057Props) {
  const [value, setValue] = useState(defaultValue)
  const [wireBefore, wireAfter = ""] = wireText.split("{field}")

  const palette = {
    ...(accent ? { "--vibeui-buttongroup-057-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-057-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-057" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="buttongroup-057"
        data-value={value}
        className={className}
        style={palette}
      >
        <div data-part="track" role="group" aria-label={label}>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={option === value}
              onClick={() => {
                setValue(option)
                onChange?.(option)
              }}
            >
              {option}
            </button>
          ))}
          <input type="hidden" name={name} value={value} />
        </div>
        <p data-part="wire">
          {wireBefore}
          <code>
            {name}={value}
          </code>
          {wireAfter}
        </p>
      </div>
    </>
  )
}
