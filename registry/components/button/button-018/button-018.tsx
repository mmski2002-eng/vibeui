"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button018Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange" | "defaultValue"
> & {
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  label?: string
  unit?: string
  onChange?: (value: number) => void
}

// Идея компонента: пара кнопок вокруг числа. Само число — поле ввода, а не
// текст: набрать «12» быстрее, чем нажать плюс двенадцать раз. Кнопки
// гаснут на границах диапазона, а не молча ничего не делают, и у каждой своё
// имя со значением — «минус» без контекста скринридеру бесполезен.
const STYLES = `
:where([data-vibeui-block="button-018"]){
--vibeui-button-018-fg:oklch(0.3 0.014 265);
--vibeui-button-018-muted:oklch(0.55 0.014 265);
--vibeui-button-018-bg:oklch(1 0 0);
--vibeui-button-018-border:oklch(0.9 0.006 265);
--vibeui-button-018-hover:oklch(0.96 0.004 265);
--vibeui-button-018-accent:oklch(0.55 0.17 265);
--vibeui-button-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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

  return (
    <>
      <style href="vibeui-button-018" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="button-018"
        className={className}
        style={style as CSSProperties}
      >
        <button
          type="button"
          aria-label={`Уменьшить до ${Math.max(min, value - step)}`}
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
          aria-label={`Увеличить до ${Math.min(max, value + step)}`}
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
