"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Number005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  defaultValue?: number
  defaultUnit?: "кг" | "фунты"
  accent?: string
}

// Идея компонента: вес с переключателем единиц, который пересчитывает число,
// а не подменяет подпись. Переключить «кг» на «фунты» и оставить 70 — значит
// молча испортить данные, поэтому 70 кг становятся 154.3 фунта. Внутри
// компонент всегда держит килограммы: одна база и одно место округления
// избавляют от накопления ошибки при щелчках туда-обратно.
const STYLES = `
:where([data-vibeui-block="number-005"]){
--vibeui-number-005-surface:oklch(1 0 0);
--vibeui-number-005-field:oklch(1 0 0);
--vibeui-number-005-shell:oklch(0.9 0.006 265);
--vibeui-number-005-fg:oklch(0.23 0.014 265);
--vibeui-number-005-muted:oklch(0.55 0.014 265);
--vibeui-number-005-border:oklch(0.88 0.008 265);
--vibeui-number-005-switch:oklch(0.96 0.004 265);
--vibeui-number-005-accent:oklch(0.5 0.14 195);
--vibeui-number-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: поле показывают поверх любого фона. */
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
box-shadow:0 0 0 2px oklch(0.5 0.14 195 / 20%);
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
background:var(--vibeui-number-005-surface);color:var(--vibeui-number-005-fg);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 14%);
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

function round(value: number) {
  return Math.round(value * 10) / 10
}

/**
 * Вес с переключением единиц: смена единицы пересчитывает число.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Number005({
  label = "Вес посылки",
  defaultValue = 12.5,
  defaultUnit = "кг",
  accent,
  className,
  style,
  ...props
}: Number005Props) {
  const id = useId()
  const [unit, setUnit] = useState(defaultUnit)
  // База всегда в килограммах: одно место округления, никакого дрейфа.
  const [kilograms, setKilograms] = useState(
    defaultUnit === "кг" ? defaultValue : defaultValue / POUNDS_IN_KILOGRAM,
  )

  const shown = unit === "кг" ? kilograms : kilograms * POUNDS_IN_KILOGRAM
  const mirror =
    unit === "кг"
      ? `${round(kilograms * POUNDS_IN_KILOGRAM)} фунта`
      : `${round(kilograms)} кг`

  const palette = {
    ...(accent ? { "--vibeui-number-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-number-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
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
              setKilograms(unit === "кг" ? next : next / POUNDS_IN_KILOGRAM)
            }}
          />
          <div data-part="units" role="group" aria-label="Единица измерения">
            {(["кг", "фунты"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={unit === option}
                onClick={() => setUnit(option)}
              >
                {option === "кг" ? "кг" : "lb"}
              </button>
            ))}
          </div>
        </div>
        <p id={`${id}-mirror`} data-part="mirror" aria-live="polite">
          Это же значение: <b>{mirror}</b>
        </p>
      </div>
    </>
  )
}
