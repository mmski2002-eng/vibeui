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
  onChange?: (value: string) => void
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
--vibeui-buttongroup-057-surface:oklch(1 0 0);
--vibeui-buttongroup-057-fg:oklch(0.25 0.016 265);
--vibeui-buttongroup-057-muted:oklch(0.56 0.014 265);
--vibeui-buttongroup-057-border:oklch(0.89 0.008 265);
--vibeui-buttongroup-057-on:oklch(0.24 0.02 265);
--vibeui-buttongroup-057-accent:oklch(0.5 0.16 265);
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
color:oklch(0.99 0.002 265);
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
background:oklch(0.96 0.005 265);
color:var(--vibeui-buttongroup-057-fg);
font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
font-size:0.6875rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-057"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = ["Черновик", "На проверку", "Опубликовать"]

/**
 * Группа кнопок, чей выбор лежит в скрытом input и в data-value на корне.
 * Один файл, ноль зависимостей, клиентский компонент.
 */
export function Buttongroup057({
  options = DEFAULT_OPTIONS,
  defaultValue = "На проверку",
  name = "status",
  label = "Что сделать с материалом",
  onChange,
  accent,
  className,
  style,
  ...props
}: Buttongroup057Props) {
  const [value, setValue] = useState(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-buttongroup-057-accent": accent } : null),
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
          Форма отправит{" "}
          <code>
            {name}={value}
          </code>
        </p>
      </div>
    </>
  )
}
