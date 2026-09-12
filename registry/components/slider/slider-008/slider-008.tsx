"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Slider008Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  unit?: string
  /** Имя числового поля для скринридера. Шаблон: {label} подставляется. */
  exactText?: string
  /** Строка под полем. Шаблон: {min}, {max}, {unit} и {step} подставляются. */
  hintText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: ползунок и поле числа — две двери в одно значение.
// Ползунком удобно прикидывать, полем — вводить точную цифру из брифа.
// Поле не «чинит» ввод на каждом нажатии: пока в нём печатают, значение
// живёт строкой, а к диапазону приводится на blur — иначе «10» невозможно
// набрать, если минимум равен 100.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="slider-008"]){
--vibeui-slider-008-bg:transparent;
--vibeui-slider-008-surface:light-dark(oklch(1 0 0),oklch(0.28 0 265));
--vibeui-slider-008-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-slider-008-muted:color-mix(in oklab,var(--vibeui-slider-008-fg) 68%,transparent);
--vibeui-slider-008-border:light-dark(oklch(0.9 0 265),oklch(0.38 0 265));
--vibeui-slider-008-field:light-dark(oklch(0.985 0 265),oklch(0.32 0 265));
--vibeui-slider-008-track:light-dark(oklch(0.92 0 265),oklch(0.42 0 265));
--vibeui-slider-008-accent:light-dark(oklch(0.28 0 0),oklch(0.903 0 0));
--vibeui-slider-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-slider-008-fill:50%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="slider-008"]{color-scheme:dark}
[data-vibeui-block="slider-008"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-slider-008-bg);
border:1px solid var(--vibeui-slider-008-border);border-radius:0.875rem;
font-family:var(--vibeui-slider-008-font);color:var(--vibeui-slider-008-fg);
}
[data-vibeui-block="slider-008"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="slider-008"] [data-part="row"]{display:flex;align-items:center;gap:0.875rem}
[data-vibeui-block="slider-008"] [data-part="rail"]{flex:1 1 auto;min-width:0;display:flex}
[data-vibeui-block="slider-008"] [data-part="range"]{
appearance:none;width:100%;height:1.25rem;margin:0;background:none;cursor:pointer;
}
[data-vibeui-block="slider-008"] [data-part="range"]::-webkit-slider-runnable-track{
height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,var(--vibeui-slider-008-accent) var(--vibeui-slider-008-fill),var(--vibeui-slider-008-track) var(--vibeui-slider-008-fill));
}
[data-vibeui-block="slider-008"] [data-part="range"]::-moz-range-track{
height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,var(--vibeui-slider-008-accent) var(--vibeui-slider-008-fill),var(--vibeui-slider-008-track) var(--vibeui-slider-008-fill));
}
[data-vibeui-block="slider-008"] [data-part="range"]::-webkit-slider-thumb{
appearance:none;margin-top:-0.3125rem;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-slider-008-accent);border:3px solid var(--vibeui-slider-008-surface);
box-shadow:0 1px 4px oklch(0.2 0 265 / 30%);color:oklch(from var(--vibeui-slider-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="slider-008"] [data-part="range"]::-moz-range-thumb{
width:1rem;height:1rem;border-radius:9999px;box-sizing:border-box;
background:var(--vibeui-slider-008-accent);border:3px solid var(--vibeui-slider-008-surface);color:oklch(from var(--vibeui-slider-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="slider-008"] [data-part="range"]:focus-visible{outline:2px solid var(--vibeui-slider-008-accent);outline-offset:4px;border-radius:0.5rem}
/* Поле числа: стрелки убраны, ширина фиксирована и цифры моноширинные —
   иначе поле дёргается на каждом разряде. */
[data-vibeui-block="slider-008"] [data-part="field"]{
display:flex;align-items:center;gap:0.25rem;flex:none;
padding:0 0.5rem;height:2.25rem;border-radius:0.5rem;
border:1px solid var(--vibeui-slider-008-border);
background:var(--vibeui-slider-008-field);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="slider-008"] [data-part="field"]:focus-within{
border-color:var(--vibeui-slider-008-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-slider-008-accent) 20%,transparent);
}
[data-vibeui-block="slider-008"] [data-part="number"]{
appearance:none;-moz-appearance:textfield;
width:3rem;border:0;padding:0;background:none;color:inherit;
font:inherit;font-size:0.9375rem;font-weight:650;font-variant-numeric:tabular-nums;
text-align:right;
}
[data-vibeui-block="slider-008"] [data-part="number"]:focus{outline:none}
[data-vibeui-block="slider-008"] [data-part="number"]::-webkit-outer-spin-button,
[data-vibeui-block="slider-008"] [data-part="number"]::-webkit-inner-spin-button{
-webkit-appearance:none;margin:0;
}
[data-vibeui-block="slider-008"] [data-part="unit"]{font-size:0.75rem;color:var(--vibeui-slider-008-muted)}
[data-vibeui-block="slider-008"] [data-part="hint"]{
margin:0;font-size:0.6875rem;color:var(--vibeui-slider-008-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="slider-008"] *{animation:none!important;transition:none!important}}
`

/** Подстановка значений в шаблон подписи. */
function fillTemplate(template: string, values: Record<string, string>) {
  return template.replace(
    /\{(\w+)\}/g,
    (match, key: string) => values[key] ?? match,
  )
}

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
 * Ползунок с полем числа: приблизительно мышью, точно — с клавиатуры.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Slider008({
  label = "Бюджет на рекламу",
  min = 5,
  max = 300,
  step = 5,
  defaultValue = 60,
  unit = "тыс. ₽",
  exactText = "{label}, точное значение",
  hintText = "от {min} до {max} {unit}, шаг {step}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Slider008Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [draft, setDraft] = useState(String(defaultValue))

  const commit = (raw: string) => {
    const parsed = Number(raw)
    const next = Number.isFinite(parsed)
      ? Math.min(max, Math.max(min, parsed))
      : value
    setValue(next)
    setDraft(String(next))
  }

  const words = {
    label,
    min: String(min),
    max: String(max),
    step: String(step),
    unit,
  }

  const palette = {
    "--vibeui-slider-008-fill": `${((value - min) / (max - min)) * 100}%`,
    ...(accent ? { "--vibeui-slider-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-slider-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-slider-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="slider"
        data-vibeui-block="slider-008"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={`${id}-range`}>
          {label}
        </label>
        <div data-part="row">
          <span data-part="rail">
            <input
              data-part="range"
              id={`${id}-range`}
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(event) => {
                setValue(Number(event.target.value))
                setDraft(event.target.value)
              }}
            />
          </span>
          <span data-part="field">
            <input
              data-part="number"
              id={`${id}-number`}
              type="number"
              inputMode="numeric"
              min={min}
              max={max}
              step={step}
              value={draft}
              aria-label={fillTemplate(exactText, words)}
              onChange={(event) => setDraft(event.target.value)}
              onBlur={(event) => commit(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  commit(event.currentTarget.value)
                }
              }}
            />
            <span data-part="unit">{unit}</span>
          </span>
        </div>
        <p data-part="hint">{fillTemplate(hintText, words)}</p>
      </div>
    </>
  )
}
