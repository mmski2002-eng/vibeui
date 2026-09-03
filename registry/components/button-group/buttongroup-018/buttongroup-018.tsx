"use client"

import { useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup018Option = {
  id: string
  label: string
}

export type Buttongroup018Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  options?: Buttongroup018Option[]
  defaultValue?: string
  label?: string
  /** Строка под группой: {value} заменяется подписью текущей позиции. */
  stateText?: string
  onChange?: (id: string) => void
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: трёхпозиционный переключатель «включено / по умолчанию /
// выключено», где средняя позиция — не «ничего не выбрано», а осмысленное
// «как в настройках проекта». Реализован не на radio, а на паттерне
// radiogroup из WAI-ARIA: кнопки с role="radio" и aria-checked, стрелки
// сразу переносят и фокус, и выбор (в radiogroup это одно движение, в
// отличие от toolbar), tabIndex=0 стоит только на выбранной кнопке.
const STYLES = `
:where([data-vibeui-block="buttongroup-018"]){
--vibeui-buttongroup-018-surface:transparent;
--vibeui-buttongroup-018-thumb:light-dark(oklch(1 0 0),oklch(0.38 0.013 265));
--vibeui-buttongroup-018-track:light-dark(oklch(0.955 0.004 265),oklch(0.26 0.01 265));
--vibeui-buttongroup-018-fg:light-dark(oklch(0.25 0.016 265),oklch(0.94 0.006 265));
--vibeui-buttongroup-018-muted:color-mix(in oklab,var(--vibeui-buttongroup-018-fg) 68%,transparent);
--vibeui-buttongroup-018-border:light-dark(oklch(0.9 0.006 265),oklch(0.37 0.012 265));
--vibeui-buttongroup-018-accent:light-dark(oklch(0.53 0.16 265),oklch(0.76 0.13 265));
--vibeui-buttongroup-018-radius:0.5rem;
--vibeui-buttongroup-018-index:1;
--vibeui-buttongroup-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-018"]{color-scheme:dark}
[data-vibeui-block="buttongroup-018"]{
box-sizing:border-box;display:inline-flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;padding:0.75rem;
border:1px solid var(--vibeui-buttongroup-018-border);border-radius:0.875rem;
background:var(--vibeui-buttongroup-018-surface);
font-family:var(--vibeui-buttongroup-018-font);
}
[data-vibeui-block="buttongroup-018"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-018"] [data-part="title"]{
margin:0;color:var(--vibeui-buttongroup-018-fg);
font-size:0.8125rem;font-weight:650;line-height:1.3;
}
[data-vibeui-block="buttongroup-018"] [data-part="track"]{
position:relative;display:grid;grid-template-columns:repeat(3,1fr);
padding:0.1875rem;
border-radius:calc(var(--vibeui-buttongroup-018-radius) + 0.1875rem);
background:var(--vibeui-buttongroup-018-track);
}
[data-vibeui-block="buttongroup-018"] [data-part="thumb"]{
position:absolute;top:0.1875rem;bottom:0.1875rem;left:0.1875rem;
width:calc((100% - 0.375rem) / 3);
border-radius:var(--vibeui-buttongroup-018-radius);
background:var(--vibeui-buttongroup-018-thumb);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 18%);
transform:translateX(calc(var(--vibeui-buttongroup-018-index) * 100%));
transition:transform .2s cubic-bezier(.2,.7,.3,1);
}
[data-vibeui-block="buttongroup-018"] button{
appearance:none;border:0;background:transparent;font:inherit;cursor:pointer;
position:relative;z-index:1;
display:inline-flex;align-items:center;justify-content:center;
height:1.875rem;padding:0 0.25rem;border-radius:var(--vibeui-buttongroup-018-radius);
color:var(--vibeui-buttongroup-018-muted);
font-size:0.8125rem;font-weight:600;line-height:1;
transition:color .18s ease;
}
[data-vibeui-block="buttongroup-018"] button[aria-checked="true"]{color:var(--vibeui-buttongroup-018-accent)}
[data-vibeui-block="buttongroup-018"] button:focus-visible{
outline:2px solid var(--vibeui-buttongroup-018-accent);outline-offset:2px;
}
[data-vibeui-block="buttongroup-018"] [data-part="state"]{
margin:0;color:var(--vibeui-buttongroup-018-muted);
font-size:0.75rem;line-height:1.4;
}
[data-vibeui-block="buttongroup-018"] [data-part="state"] b{
color:var(--vibeui-buttongroup-018-fg);font-weight:650;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-018"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Buttongroup018Option[] = [
  { id: "on", label: "Включено" },
  { id: "inherit", label: "Как в проекте" },
  { id: "off", label: "Выключено" },
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
 * Трёхпозиционный переключатель на паттерне radiogroup со стрелками.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup018({
  options = DEFAULT_OPTIONS,
  defaultValue = "inherit",
  label = "Уведомления о сборке",
  stateText = "Сейчас: {value}",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup018Props) {
  const [current, setCurrent] = useState(defaultValue)
  const track = useRef<HTMLDivElement>(null)
  const index = Math.max(
    0,
    options.findIndex((option) => option.id === current),
  )

  const select = (next: string, position: number) => {
    setCurrent(next)
    onChange?.(next)
    const buttons = track.current?.querySelectorAll("button")
    buttons?.[position]?.focus()
  }

  const [statePrefix, stateSuffix] = stateText.split("{value}")

  const palette = {
    "--vibeui-buttongroup-018-index": index,
    ...(accent ? { "--vibeui-buttongroup-018-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-018-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-018" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-018"
        className={className}
        style={palette}
      >
        <p data-part="title" id="buttongroup-018-title">
          {label}
        </p>
        <div
          data-part="track"
          ref={track}
          role="radiogroup"
          aria-labelledby="buttongroup-018-title"
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
            select(options[next].id, next)
          }}
        >
          <span data-part="thumb" aria-hidden="true" />
          {options.map((option, position) => (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={option.id === current}
              tabIndex={option.id === current ? 0 : -1}
              onClick={() => select(option.id, position)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p data-part="state">
          {statePrefix}
          <b>{options[index]?.label.toLowerCase()}</b>
          {stateSuffix}
        </p>
      </div>
    </>
  )
}
