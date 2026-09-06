"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Button018Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange" | "defaultValue"
> & {
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  label?: string
  unit?: string
  /** Подпись кнопки «минус». {value} — значение, которое получится. */
  decreaseLabel?: string
  /** Подпись кнопки «плюс». {value} — значение, которое получится. */
  increaseLabel?: string
  /** Пусто — подложки нет, счётчик лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  onChange?: (value: number) => void
}

// Идея компонента: пара кнопок вокруг числа. Само число — поле ввода, а не
// текст: набрать «12» быстрее, чем нажать плюс двенадцать раз. Кнопки
// гаснут на границах диапазона, а не молча ничего не делают, и у каждой своё
// имя со значением — «минус» без контекста скринридеру бесполезен.
const STYLES = `
:where([data-vibeui-block="button-018"]){
--vibeui-button-018-fg:light-dark(oklch(0.3 0 265),oklch(0.94 0 265));
--vibeui-button-018-muted:color-mix(in oklab,var(--vibeui-button-018-fg) 68%,transparent);
--vibeui-button-018-bg:transparent;
--vibeui-button-018-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-button-018-hover:light-dark(oklch(0.96 0 265),oklch(0.32 0 265));
--vibeui-button-018-accent:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-018"]{color-scheme:dark}
[data-vibeui-block="button-018"]{
display:inline-flex;align-items:center;
height:2.25rem;box-sizing:border-box;
border:1px solid var(--vibeui-button-018-border);border-radius:0.625rem;
background:var(--vibeui-button-018-bg);color:var(--vibeui-button-018-fg);
font-family:var(--vibeui-button-018-font);
}
[data-vibeui-block="button-018"] button{
appearance:none;border:0;cursor:pointer;background:transparent;
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:2.125rem;height:100%;padding:0;color:inherit;border-radius:0.5rem;
}
[data-vibeui-block="button-018"] button:hover:not(:disabled){background:var(--vibeui-button-018-hover)}
[data-vibeui-block="button-018"] button:focus-visible{outline:2px solid var(--vibeui-button-018-accent);outline-offset:-2px}
/* На границе диапазона кнопка гаснет: молчаливое бездействие путает. */
[data-vibeui-block="button-018"] button:disabled{cursor:not-allowed;opacity:.35}
[data-vibeui-block="button-018"] [data-part="sign"]{position:relative;width:0.75rem;height:0.75rem}
[data-vibeui-block="button-018"] [data-part="sign"]::before{
content:"";position:absolute;left:50%;top:50%;width:0.6875rem;height:1.5px;
margin:-0.75px 0 0 -0.34375rem;background:currentColor;border-radius:9999px;
}
[data-vibeui-block="button-018"] [data-plus="true"]::after{
content:"";position:absolute;left:50%;top:50%;width:1.5px;height:0.6875rem;
margin:-0.34375rem 0 0 -0.75px;background:currentColor;border-radius:9999px;
}
/* Число — поле: набрать «12» быстрее, чем нажать плюс двенадцать раз. */
[data-vibeui-block="button-018"] input{
width:2.5rem;height:100%;box-sizing:border-box;padding:0;
border:0;border-left:1px solid var(--vibeui-button-018-border);
border-right:1px solid var(--vibeui-button-018-border);
background:transparent;color:inherit;
font:inherit;font-size:0.875rem;font-weight:650;text-align:center;
font-variant-numeric:tabular-nums;
-moz-appearance:textfield;
}
[data-vibeui-block="button-018"] input::-webkit-outer-spin-button,
[data-vibeui-block="button-018"] input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
[data-vibeui-block="button-018"] input:focus-visible{outline:2px solid var(--vibeui-button-018-accent);outline-offset:-2px}
[data-vibeui-block="button-018"] [data-part="unit"]{
padding:0 0.625rem;font-size:0.75rem;color:var(--vibeui-button-018-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-018"] *{animation:none!important;transition:none!important}}
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
 * Счётчик количества: две кнопки вокруг настоящего поля ввода.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button018({
  defaultValue = 2,
  min = 1,
  max = 20,
  step = 1,
  label = "Количество",
  unit = "шт",
  decreaseLabel = "Уменьшить до {value}",
  increaseLabel = "Увеличить до {value}",
  background = "",
  accent,
  onChange,
  className,
  style,
  ...props
}: Button018Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)

  const update = (next: number) => {
    const safe = Math.min(max, Math.max(min, next))
    setValue(safe)
    onChange?.(safe)
  }

  const palette = {
    ...(accent ? { "--vibeui-button-018-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-018-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-018" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button"
        data-vibeui-block="button-018"
        className={className}
        style={palette}
      >
        <button
          type="button"
          aria-label={decreaseLabel.replace(
            "{value}",
            String(Math.max(min, value - step)),
          )}
          disabled={value <= min}
          onClick={() => update(value - step)}
        >
          <span data-part="sign" aria-hidden="true" />
        </button>
        <label htmlFor={id} hidden>
          {label}
        </label>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => update(Number(event.target.value) || min)}
        />
        <button
          type="button"
          aria-label={increaseLabel.replace(
            "{value}",
            String(Math.min(max, value + step)),
          )}
          disabled={value >= max}
          onClick={() => update(value + step)}
        >
          <span data-part="sign" data-plus="true" aria-hidden="true" />
        </button>
        {unit ? <span data-part="unit">{unit}</span> : null}
      </div>
    </>
  )
}
