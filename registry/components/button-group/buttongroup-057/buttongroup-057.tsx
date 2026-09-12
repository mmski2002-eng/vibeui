"use client"

import { useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup057Props = Omit<
  ComponentProps<"div">,
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
// Трек — toolbar с roving tabindex: Tab останавливается на группе один раз,
// значение переключают стрелками, как в настоящем поле выбора.
const STYLES = `
:where([data-vibeui-block="buttongroup-057"]){
--vibeui-buttongroup-057-surface:transparent;
--vibeui-buttongroup-057-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-buttongroup-057-muted:color-mix(in oklab,var(--vibeui-buttongroup-057-fg) 68%,transparent);
--vibeui-buttongroup-057-border:light-dark(oklch(0.89 0 265),oklch(0.41 0 265));
/* Нажатая кнопка — самый контрастный элемент группы: в светлой теме тёмная
   плашка, в тёмной светлая, иначе выбор перестаёт читаться. */
--vibeui-buttongroup-057-on:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-buttongroup-057-on-fg:light-dark(oklch(0.99 0 265),oklch(0.21 0 265));
--vibeui-buttongroup-057-code:light-dark(oklch(0.96 0 265),oklch(0.32 0 265));
--vibeui-buttongroup-057-accent:light-dark(oklch(0.275 0 0),oklch(0.906 0 0));
--vibeui-buttongroup-057-radius:0.625rem;
--vibeui-buttongroup-057-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-057"]{color-scheme:dark}
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
  const track = useRef<HTMLDivElement>(null)
  const index = Math.max(0, options.indexOf(value))

  const select = (option: string, position: number) => {
    setValue(option)
    onChange?.(option)
    track.current?.querySelectorAll("button")[position]?.focus()
  }

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
        data-slot="button-group"
        data-vibeui-block="buttongroup-057"
        data-value={value}
        className={className}
        style={palette}
      >
        <div
          data-part="track"
          ref={track}
          role="toolbar"
          aria-label={label}
          onKeyDown={(event) => {
            const step =
              event.key === "ArrowRight" || event.key === "ArrowDown"
                ? 1
                : event.key === "ArrowLeft" || event.key === "ArrowUp"
                  ? -1
                  : 0

            if (step === 0) {
              return
            }

            event.preventDefault()
            const next = (index + step + options.length) % options.length
            select(options[next], next)
          }}
        >
          {options.map((option, position) => (
            <button
              key={option}
              type="button"
              aria-pressed={option === value}
              tabIndex={position === index ? 0 : -1}
              onClick={() => select(option, position)}
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
