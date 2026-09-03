"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Number008Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  step?: number
  bigStep?: number
  defaultValue?: number
  min?: number
  max?: number
  /** Значок действующего шага. Подстановка: {step}. */
  stepText?: string
  /** Подпись точного шага в легенде. Подстановка: {step}. */
  fineText?: string
  /** Подпись крупного шага в легенде. Подстановка: {step}. */
  bigText?: string
  /** Строка про границы. Подстановки: {min}, {max}. */
  boundsText?: string
  /** Локаль форматирования чисел. */
  locale?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: два шага на одних стрелках. Нативный input меняет число на
// step, и добраться стрелками от 500 до 5000 нереально; Shift увеличивает шаг
// в десять раз, поэтому грубая наводка и точная доводка живут в одной клавише.
// Событие перехватывается и отменяется вручную: иначе браузер прибавит свой
// step поверх нашего и значение прыгнет дважды. Подсказка с клавишами видна
// всегда — скрытую горячую клавишу не находят.
//
// Тема берётся из color-scheme окружения через light-dark(): поле темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="number-008"]){
--vibeui-number-008-surface:transparent;
--vibeui-number-008-field:light-dark(oklch(0.985 0.002 265),oklch(0.25 0.011 265));
--vibeui-number-008-shell:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-number-008-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-number-008-muted:color-mix(in oklab,var(--vibeui-number-008-fg) 68%,transparent);
--vibeui-number-008-border:light-dark(oklch(0.88 0.008 265),oklch(0.42 0.014 265));
--vibeui-number-008-key:light-dark(oklch(0.96 0.004 265),oklch(0.3 0.012 265));
--vibeui-number-008-accent:light-dark(oklch(0.5 0.16 300),oklch(0.76 0.14 300));
--vibeui-number-008-ring:light-dark(oklch(0.5 0.16 300 / 20%),oklch(0.76 0.14 300 / 30%));
--vibeui-number-008-badge:light-dark(oklch(0.5 0.16 300 / 12%),oklch(0.76 0.14 300 / 20%));
--vibeui-number-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-number-008-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="number-008"]{color-scheme:dark}
/* Подложки по умолчанию нет: поле ложится на фон страницы. */
[data-vibeui-block="number-008"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-number-008-surface);
border:1px solid var(--vibeui-number-008-shell);border-radius:0.875rem;
font-family:var(--vibeui-number-008-font);color:var(--vibeui-number-008-fg);
}
[data-vibeui-block="number-008"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="number-008"] [data-part="field"]{
display:flex;align-items:center;gap:0.5rem;
padding:0 0.875rem;box-sizing:border-box;height:3rem;
border:1px solid var(--vibeui-number-008-border);border-radius:0.75rem;
background:var(--vibeui-number-008-field);
}
[data-vibeui-block="number-008"] [data-part="field"]:focus-within{
border-color:var(--vibeui-number-008-accent);
box-shadow:0 0 0 2px var(--vibeui-number-008-ring);
}
[data-vibeui-block="number-008"] input{
flex:1 1 auto;min-width:0;width:100%;
appearance:none;border:0;background:none;outline:none;
height:100%;color:inherit;
font:inherit;font-size:1.375rem;font-weight:700;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="number-008"] input::-webkit-outer-spin-button,
[data-vibeui-block="number-008"] input::-webkit-inner-spin-button{appearance:none;margin:0}
/* Виден шаг, который сработает прямо сейчас: Shift переключает его на лету. */
[data-vibeui-block="number-008"] [data-part="badge"]{
flex:none;padding:0.1875rem 0.5rem;border-radius:9999px;
background:var(--vibeui-number-008-badge);color:var(--vibeui-number-008-accent);
font-size:0.75rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="number-008"] [data-part="legend"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
margin:0;font-size:0.75rem;color:var(--vibeui-number-008-muted);
}
[data-vibeui-block="number-008"] kbd{
display:inline-block;padding:0.0625rem 0.375rem;
border:1px solid var(--vibeui-number-008-border);border-bottom-width:2px;border-radius:0.3125rem;
background:var(--vibeui-number-008-key);color:var(--vibeui-number-008-fg);
font-family:var(--vibeui-number-008-mono);font-size:0.6875rem;line-height:1.4;
}
[data-vibeui-block="number-008"] [data-part="bounds"]{
margin:0;font-size:0.75rem;color:var(--vibeui-number-008-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="number-008"] *{animation:none!important;transition:none!important}}
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
 * Число, где стрелки дают точный шаг, а Shift со стрелками — крупный.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Number008({
  label = "Лимит запросов",
  step = 100,
  bigStep = 1000,
  defaultValue = 2500,
  min = 0,
  max = 20000,
  stepText = "шаг {step}",
  fineText = "по {step}",
  bigText = "+ стрелка по {step}",
  boundsText = "от {min} до {max}",
  locale = "ru-RU",
  background = "",
  accent,
  className,
  style,
  ...props
}: Number008Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [big, setBig] = useState(false)

  const shift = (direction: number, amount: number) =>
    setValue(Math.min(max, Math.max(min, value + direction * amount)))

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const direction =
      event.key === "ArrowUp" ? 1 : event.key === "ArrowDown" ? -1 : 0
    if (direction === 0) {
      if (event.key === "Shift") setBig(true)
      return
    }
    // Событие отменяем: иначе браузер прибавит свой step поверх нашего.
    event.preventDefault()
    shift(direction, event.shiftKey ? bigStep : step)
  }

  const palette = {
    ...(accent ? { "--vibeui-number-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-number-008-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-number-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="number-field"
        data-vibeui-block="number-008"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="field">
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            step={step}
            value={value}
            aria-describedby={`${id}-legend`}
            onKeyDown={onKeyDown}
            onKeyUp={(event) => {
              if (event.key === "Shift") setBig(false)
            }}
            onBlur={() => setBig(false)}
            onChange={(event) => {
              const next = Number(event.target.value)
              setValue(
                Number.isFinite(next)
                  ? Math.min(max, Math.max(min, next))
                  : min,
              )
            }}
          />
          <span data-part="badge" aria-live="polite">
            {stepText.replace("{step}", String(big ? bigStep : step))}
          </span>
        </div>
        <p id={`${id}-legend`} data-part="legend">
          <kbd>↑</kbd>
          <kbd>↓</kbd>
          <span>{fineText.replace("{step}", String(step))}</span>
          <span aria-hidden="true">·</span>
          <kbd>Shift</kbd>
          <span>{bigText.replace("{step}", String(bigStep))}</span>
        </p>
        <p data-part="bounds">
          {boundsText
            .replace("{min}", min.toLocaleString(locale))
            .replace("{max}", max.toLocaleString(locale))}
        </p>
      </div>
    </>
  )
}
