"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Inputgroup007Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  placeholder?: string
  /** Стартовое значение поля. */
  defaultValue?: string
  /** Подпись кнопки очистки для чтения вслух. */
  clearLabel?: string
  hint?: string
  onChange?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: слева значок-приставка, справа кнопка очистки, и обе
// половины сцеплены с полем одной рамкой. Значок не кнопка — по нему нечего
// нажимать, поэтому это span с aria-hidden. Кнопка очистки появляется только
// когда есть что очищать, и её место заранее не резервируется: пустое поле не
// должно выглядеть как поле с выключенной кнопкой. После очистки фокус
// возвращается в поле — иначе он повисает на исчезнувшей кнопке.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="inputgroup-007"]){
--vibeui-inputgroup-007-surface:transparent;
--vibeui-inputgroup-007-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-inputgroup-007-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-inputgroup-007-muted:color-mix(in oklab,var(--vibeui-inputgroup-007-fg) 68%,transparent);
--vibeui-inputgroup-007-field:light-dark(oklch(0.99 0 265),oklch(0.27 0 265));
--vibeui-inputgroup-007-fixed:light-dark(oklch(0.96 0 265),oklch(0.32 0 265));
--vibeui-inputgroup-007-border:light-dark(oklch(0.86 0 265),oklch(0.44 0 265));
--vibeui-inputgroup-007-accent:light-dark(oklch(0.28 0 0),oklch(0.903 0 0));
--vibeui-inputgroup-007-radius:0.75rem;
--vibeui-inputgroup-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="inputgroup-007"]{color-scheme:dark}
[data-vibeui-block="inputgroup-007"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-007-surface);
border:1px solid var(--vibeui-inputgroup-007-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-007-font);color:var(--vibeui-inputgroup-007-fg);
}
[data-vibeui-block="inputgroup-007"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-007"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-007"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-007"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-007-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-007"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-007-radius) 0 0 var(--vibeui-inputgroup-007-radius);
}
[data-vibeui-block="inputgroup-007"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-007-radius) var(--vibeui-inputgroup-007-radius) 0;
}
[data-vibeui-block="inputgroup-007"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-007"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-007-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-007-accent);
}
/* Приставка со значком — не мишень: ни курсора, ни фокуса. */
[data-vibeui-block="inputgroup-007"] [data-part="icon"]{
flex:none;display:grid;place-items:center;width:2.5rem;
background:var(--vibeui-inputgroup-007-fixed);
color:var(--vibeui-inputgroup-007-muted);
}
[data-vibeui-block="inputgroup-007"] [data-part="icon"] svg{width:1rem;height:1rem;display:block}
[data-vibeui-block="inputgroup-007"] input{
flex:1;min-width:0;padding:0 0.75rem;font-size:0.875rem;
background:var(--vibeui-inputgroup-007-field);
}
[data-vibeui-block="inputgroup-007"] [data-part="clear"]{
appearance:none;flex:none;cursor:pointer;width:2.5rem;
display:grid;place-items:center;
background:var(--vibeui-inputgroup-007-fixed);
color:var(--vibeui-inputgroup-007-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="inputgroup-007"] [data-part="clear"]:hover{
background:color-mix(in oklab,var(--vibeui-inputgroup-007-accent) 14%,var(--vibeui-inputgroup-007-fixed));
color:var(--vibeui-inputgroup-007-fg);
}
[data-vibeui-block="inputgroup-007"] [data-part="clear"] svg{width:0.875rem;height:0.875rem;display:block}
[data-vibeui-block="inputgroup-007"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-007-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-007"] *{animation:none!important;transition:none!important}}
`

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
 * Сцепка со значком слева и кнопкой очистки справа: кнопка есть, только если есть что стирать.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup007({
  label = "Кодовое слово поддержки",
  placeholder = "Слово из письма",
  defaultValue = "вьюга-77",
  clearLabel = "Очистить поле",
  hint = "Кнопка очистки появляется вместе с текстом и уходит вместе с ним.",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup007Props) {
  const id = useId()
  const field = useRef<HTMLInputElement | null>(null)
  const [value, setValue] = useState(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-inputgroup-007-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const push = (next: string) => {
    setValue(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-inputgroup-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input-group"
        data-vibeui-block="inputgroup-007"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <span data-part="icon" aria-hidden="true">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="2.5" y="7" width="11" height="7" rx="1.75" />
              <path d="M5 7V5a3 3 0 0 1 6 0v2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            ref={field}
            id={id}
            type="text"
            autoComplete="off"
            placeholder={placeholder}
            value={value}
            aria-describedby={`${id}-hint`}
            onChange={(event) => push(event.target.value)}
          />
          {value ? (
            <button
              type="button"
              data-part="clear"
              aria-label={clearLabel}
              onClick={() => {
                push("")
                field.current?.focus()
              }}
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="m4 4 8 8M12 4l-8 8" strokeLinecap="round" />
              </svg>
            </button>
          ) : null}
        </div>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
