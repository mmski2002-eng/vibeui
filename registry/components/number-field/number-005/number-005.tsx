"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Number005Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  defaultValue?: number
  defaultUnit?: "kg" | "lb"
  /** Подписи кнопок переключателя: компонент несёт русские. */
  unitText?: Record<string, string>
  /** Названия единиц в строке эквивалента. */
  mirrorUnitText?: Record<string, string>
  /** Строка эквивалента. Подстановка: {value}. */
  mirrorText?: string
  /** Подпись группы кнопок для скринридера. */
  unitsLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: вес с переключателем единиц, который пересчитывает число,
// а не подменяет подпись. Переключить «кг» на «фунты» и оставить 70 — значит
// молча испортить данные, поэтому 70 кг становятся 154.3 фунта. Внутри
// компонент всегда держит килограммы: одна база и одно место округления
// избавляют от накопления ошибки при щелчках туда-обратно.
//
// Тема берётся из color-scheme окружения через light-dark(): поле темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="number-005"]){
--vibeui-number-005-surface:transparent;
--vibeui-number-005-chip:light-dark(oklch(1 0 0),oklch(0.32 0 265));
--vibeui-number-005-field:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-number-005-shell:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-number-005-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-number-005-muted:color-mix(in oklab,var(--vibeui-number-005-fg) 68%,transparent);
--vibeui-number-005-border:light-dark(oklch(0.88 0 265),oklch(0.42 0 265));
--vibeui-number-005-switch:light-dark(oklch(0.96 0 265),oklch(0.22 0 265));
--vibeui-number-005-accent:light-dark(oklch(0.5 0.14 195),oklch(0.72 0.12 195));
--vibeui-number-005-ring:light-dark(oklch(0.5 0.14 195 / 20%),oklch(0.72 0.12 195 / 30%));
--vibeui-number-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="number-005"]{color-scheme:dark}
/* Подложки по умолчанию нет: поле ложится на фон страницы. */
[data-vibeui-block="number-005"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:18rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-number-005-surface);
border:1px solid var(--vibeui-number-005-shell);border-radius:0.875rem;
font-family:var(--vibeui-number-005-font);color:var(--vibeui-number-005-fg);
}
[data-vibeui-block="number-005"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="number-005"] [data-part="row"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.25rem 0.25rem 0.25rem 0.75rem;box-sizing:border-box;
border:1px solid var(--vibeui-number-005-border);border-radius:0.75rem;
background:var(--vibeui-number-005-field);
}
[data-vibeui-block="number-005"] [data-part="row"]:focus-within{
border-color:var(--vibeui-number-005-accent);
box-shadow:0 0 0 2px var(--vibeui-number-005-ring);
}
[data-vibeui-block="number-005"] input{
flex:1 1 auto;min-width:0;width:100%;
appearance:none;border:0;background:none;outline:none;
height:2.5rem;color:inherit;
font:inherit;font-size:1.25rem;font-weight:700;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="number-005"] input::-webkit-outer-spin-button,
[data-vibeui-block="number-005"] input::-webkit-inner-spin-button{appearance:none;margin:0}
/* Переключатель единиц: две кнопки видны сразу, выпадающий список тут лишний. */
[data-vibeui-block="number-005"] [data-part="units"]{
display:flex;flex:none;gap:0.125rem;padding:0.125rem;
border-radius:0.5rem;background:var(--vibeui-number-005-switch);
}
[data-vibeui-block="number-005"] button{
appearance:none;border:0;cursor:pointer;
height:2rem;padding:0 0.625rem;border-radius:0.4375rem;
background:transparent;color:var(--vibeui-number-005-muted);
font:inherit;font-size:0.8125rem;font-weight:650;
transition:background-color .14s ease,color .14s ease;
}
[data-vibeui-block="number-005"] button[aria-pressed="true"]{
background:var(--vibeui-number-005-chip);color:var(--vibeui-number-005-fg);
box-shadow:0 1px 2px oklch(0.2 0 265 / 14%);
}
[data-vibeui-block="number-005"] button:focus-visible{outline:2px solid var(--vibeui-number-005-accent);outline-offset:2px}
/* Вторая единица подписана всегда: перевод не приходится держать в голове. */
[data-vibeui-block="number-005"] [data-part="mirror"]{
margin:0;font-size:0.75rem;color:var(--vibeui-number-005-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="number-005"] [data-part="mirror"] b{color:var(--vibeui-number-005-fg);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="number-005"] *{animation:none!important;transition:none!important}}
`

const POUNDS_IN_KILOGRAM = 2.2046226218

const UNIT_TEXT: Record<string, string> = { kg: "кг", lb: "lb" }
const MIRROR_UNIT_TEXT: Record<string, string> = { kg: "кг", lb: "фунта" }

function round(value: number) {
  return Math.round(value * 10) / 10
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
 * Вес с переключением единиц: смена единицы пересчитывает число.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Number005({
  label = "Вес посылки",
  defaultValue = 12.5,
  defaultUnit = "kg",
  unitText = UNIT_TEXT,
  mirrorUnitText = MIRROR_UNIT_TEXT,
  mirrorText = "Это же значение: {value}",
  unitsLabel = "Единица измерения",
  background = "",
  accent,
  className,
  style,
  ...props
}: Number005Props) {
  const id = useId()
  const [unit, setUnit] = useState(defaultUnit)
  // База всегда в килограммах: одно место округления, никакого дрейфа.
  const [kilograms, setKilograms] = useState(
    defaultUnit === "kg" ? defaultValue : defaultValue / POUNDS_IN_KILOGRAM,
  )

  const shown = unit === "kg" ? kilograms : kilograms * POUNDS_IN_KILOGRAM
  const mirror =
    unit === "kg"
      ? `${round(kilograms * POUNDS_IN_KILOGRAM)} ${mirrorUnitText["lb"] ?? MIRROR_UNIT_TEXT["lb"]}`
      : `${round(kilograms)} ${mirrorUnitText["kg"] ?? MIRROR_UNIT_TEXT["kg"]}`
  const [mirrorBefore, mirrorAfter] = mirrorText.split("{value}")

  const palette = {
    ...(accent ? { "--vibeui-number-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-number-005-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-number-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="number-field"
        data-vibeui-block="number-005"
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
            step={0.1}
            value={round(shown)}
            aria-describedby={`${id}-mirror`}
            onChange={(event) => {
              const next = Number(event.target.value)
              if (!Number.isFinite(next)) return
              setKilograms(unit === "kg" ? next : next / POUNDS_IN_KILOGRAM)
            }}
          />
          <div data-part="units" role="group" aria-label={unitsLabel}>
            {(["kg", "lb"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={unit === option}
                onClick={() => setUnit(option)}
              >
                {unitText[option] ?? UNIT_TEXT[option]}
              </button>
            ))}
          </div>
        </div>
        <p id={`${id}-mirror`} data-part="mirror" aria-live="polite">
          {mirrorBefore}
          <b>{mirror}</b>
          {mirrorAfter}
        </p>
      </div>
    </>
  )
}
