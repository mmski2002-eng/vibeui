"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Number007Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  defaultValue?: number
  max?: number
  /** Слова вердикта по тону: компонент несёт русские. */
  verdictText?: Record<string, string>
  /** Подсказка под шкалой. */
  hint?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: оценка числом, а не звёздами. Звёзды дают пять делений,
// а рецензии живут в десятых: 8.4 и 8.6 — разные оценки. Поэтому ввод
// числовой, с шагом 0.1, а рядом — шкала из десяти делений: цифру уточняют
// клавиатурой, а порядок величины считывают глазом. Цвет берётся от значения,
// поэтому «слабо» и «отлично» различимы до чтения подписи.
//
// Тема берётся из color-scheme окружения через light-dark(): поле темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="number-007"]){
--vibeui-number-007-surface:transparent;
--vibeui-number-007-shell:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-number-007-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-number-007-muted:color-mix(in oklab,var(--vibeui-number-007-fg) 68%,transparent);
--vibeui-number-007-border:light-dark(oklch(0.88 0.008 265),oklch(0.42 0.014 265));
--vibeui-number-007-track:light-dark(oklch(0.93 0.006 265),oklch(0.33 0.011 265));
--vibeui-number-007-low:light-dark(oklch(0.58 0.19 25),oklch(0.72 0.16 25));
--vibeui-number-007-mid:light-dark(oklch(0.72 0.15 75),oklch(0.82 0.14 75));
--vibeui-number-007-high:light-dark(oklch(0.6 0.16 150),oklch(0.76 0.14 150));
--vibeui-number-007-accent:var(--vibeui-number-007-high);
--vibeui-number-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="number-007"]{color-scheme:dark}
/* Подложки по умолчанию нет: поле ложится на фон страницы. */
[data-vibeui-block="number-007"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:18rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-number-007-surface);
border:1px solid var(--vibeui-number-007-shell);border-radius:0.875rem;
font-family:var(--vibeui-number-007-font);color:var(--vibeui-number-007-fg);
}
/* Цвет от значения: «слабо» и «отлично» видны до чтения подписи. */
[data-vibeui-block="number-007"][data-tone="low"]{--vibeui-number-007-accent:var(--vibeui-number-007-low)}
[data-vibeui-block="number-007"][data-tone="mid"]{--vibeui-number-007-accent:var(--vibeui-number-007-mid)}
[data-vibeui-block="number-007"][data-tone="high"]{--vibeui-number-007-accent:var(--vibeui-number-007-high)}
[data-vibeui-block="number-007"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="number-007"] [data-part="row"]{
display:flex;align-items:baseline;gap:0.375rem;
padding:0.25rem 0.75rem;box-sizing:border-box;
border:1px solid var(--vibeui-number-007-border);border-radius:0.75rem;
}
[data-vibeui-block="number-007"] [data-part="row"]:focus-within{
border-color:var(--vibeui-number-007-accent);
box-shadow:0 0 0 2px color-mix(in oklch,var(--vibeui-number-007-accent) 22%,transparent);
}
/* Ширина по содержимому: «8.4» и «10» не должны прыгать относительно «/ 10». */
[data-vibeui-block="number-007"] input{
flex:0 1 4.5rem;width:4.5rem;min-width:0;
appearance:none;border:0;background:none;outline:none;
height:2.75rem;color:var(--vibeui-number-007-accent);
font:inherit;font-size:2rem;font-weight:750;letter-spacing:-0.02em;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="number-007"] input::-webkit-outer-spin-button,
[data-vibeui-block="number-007"] input::-webkit-inner-spin-button{appearance:none;margin:0}
[data-vibeui-block="number-007"] [data-part="scale"]{
flex:none;font-size:1rem;font-weight:650;color:var(--vibeui-number-007-muted);
}
[data-vibeui-block="number-007"] [data-part="verdict"]{
margin-left:auto;flex:none;font-size:0.75rem;font-weight:650;
color:var(--vibeui-number-007-accent);
}
/* Десять делений: порядок величины считывают глазом, а не цифрой. */
[data-vibeui-block="number-007"] [data-part="meter"]{display:flex;gap:0.1875rem}
[data-vibeui-block="number-007"] [data-part="tick"]{
flex:1 1 0;height:0.375rem;border-radius:9999px;background:var(--vibeui-number-007-track);
transition:background-color .16s ease;
}
[data-vibeui-block="number-007"] [data-part="tick"][data-on="true"]{background:var(--vibeui-number-007-accent)}
[data-vibeui-block="number-007"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-number-007-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="number-007"] *{animation:none!important;transition:none!important}}
`

const VERDICT_TEXT: Record<string, string> = {
  low: "слабо",
  mid: "средне",
  high: "отлично",
}

function verdictOf(value: number) {
  if (value < 5) return "low"
  if (value < 7.5) return "mid"
  return "high"
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
 * Числовая оценка с десятыми долями и шкалой из десяти делений.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Number007({
  label = "Ваша оценка",
  defaultValue = 8.4,
  max = 10,
  verdictText = VERDICT_TEXT,
  hint = "Шаг 0.1 — стрелки вверх и вниз меняют оценку на одну десятую.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Number007Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const tone = verdictOf(value)
  const ticks = Array.from({ length: max }, (_, index) => index + 1)

  const palette = {
    ...(accent ? { "--vibeui-number-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-number-007-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-number-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="number-field"
        data-vibeui-block="number-007"
        data-tone={tone}
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="row">
          <input
            id={id}
            type="number"
            inputMode="decimal"
            min={0}
            max={max}
            step={0.1}
            value={value}
            aria-describedby={`${id}-hint`}
            onChange={(event) => {
              const next = Number(event.target.value)
              if (!Number.isFinite(next)) return
              setValue(Math.min(max, Math.max(0, Math.round(next * 10) / 10)))
            }}
          />
          <span data-part="scale">/ {max}</span>
          <span data-part="verdict" aria-live="polite">
            {verdictText[tone] ?? VERDICT_TEXT[tone]}
          </span>
        </div>
        <div data-part="meter" aria-hidden="true">
          {ticks.map((tick) => (
            <span key={tick} data-part="tick" data-on={value >= tick - 0.5} />
          ))}
        </div>
        <p id={`${id}-hint`} data-part="hint">
          {hint}
        </p>
      </div>
    </>
  )
}
