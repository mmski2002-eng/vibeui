"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup027Unit = "currency" | "percent"

export type Inputgroup027Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  name?: string
  label?: string
  defaultValue?: number
  defaultUnit?: Inputgroup027Unit
  maxPercent?: number
  onChange?: (value: number, unit: Inputgroup027Unit) => void
  hint?: string
  /** Подписи кнопок единицы: компонент несёт русские, проект подставляет свои. */
  unitText?: Record<string, string>
  /** Подсказки по единицам: компонент несёт русские, проект подставляет свои. */
  unitHint?: Record<string, string>
  /** Подпись группы кнопок для скринридера. */
  toggleLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

const UNIT_HINT: Record<Inputgroup027Unit, string> = {
  currency: "Скидка задана фиксированной суммой в рублях.",
  percent: "Скидка задана процентом от стоимости заказа.",
}

const UNIT_TEXT: Record<Inputgroup027Unit, string> = {
  currency: "₽",
  percent: "%",
}

// Идея компонента: скидку можно задать суммой или процентом — это два
// разных числа с разным смыслом, а не одно значение с другим значком.
// Переключатель «₽ / %» — сегментированная группа из двух кнопок с
// aria-pressed, а не select: выбор из двух постоянно видимых вариантов
// быстрее переключать кнопками. Смена единицы не пересчитывает число —
// она меняет его смысл, поэтому значение остаётся как есть, а верхняя
// граница поля (max) подстраивается только для процента.
const STYLES = `
:where([data-vibeui-block="inputgroup-027"]){
--vibeui-inputgroup-027-surface:transparent;
--vibeui-inputgroup-027-raised:light-dark(oklch(1 0 0),oklch(0.28 0.014 265));
--vibeui-inputgroup-027-shell:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-inputgroup-027-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-inputgroup-027-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-inputgroup-027-field:light-dark(oklch(0.99 0.002 265),oklch(0.26 0.012 265));
--vibeui-inputgroup-027-fixed:light-dark(oklch(0.96 0.004 265),oklch(0.31 0.012 265));
--vibeui-inputgroup-027-border:light-dark(oklch(0.86 0.008 265),oklch(0.42 0.014 265));
--vibeui-inputgroup-027-accent:light-dark(oklch(0.55 0.16 145),oklch(0.76 0.14 145));
--vibeui-inputgroup-027-radius:0.75rem;
--vibeui-inputgroup-027-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="inputgroup-027"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-027-surface);
border:1px solid var(--vibeui-inputgroup-027-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-027-font);color:var(--vibeui-inputgroup-027-fg);
}
[data-vibeui-block="inputgroup-027"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-027"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-027"] [data-part="group"]{
display:flex;align-items:stretch;overflow:hidden;height:3rem;
background:var(--vibeui-inputgroup-027-field);
border:1px solid var(--vibeui-inputgroup-027-border);
border-radius:var(--vibeui-inputgroup-027-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="inputgroup-027"] [data-part="group"]:focus-within{
border-color:var(--vibeui-inputgroup-027-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-inputgroup-027-accent) 18%,transparent);
}
[data-vibeui-block="inputgroup-027"] input{
flex:1;min-width:0;padding:0 0.75rem;border:0;background:none;
font:inherit;font-size:1.125rem;font-weight:700;font-variant-numeric:tabular-nums;
color:inherit;
}
[data-vibeui-block="inputgroup-027"] input:focus{outline:none}
[data-vibeui-block="inputgroup-027"] input::-webkit-outer-spin-button,
[data-vibeui-block="inputgroup-027"] input::-webkit-inner-spin-button{appearance:none;margin:0}
[data-vibeui-block="inputgroup-027"] [data-part="toggle"]{
display:flex;flex:none;padding:0.25rem;gap:0.25rem;
background:var(--vibeui-inputgroup-027-fixed);
box-shadow:inset 1px 0 0 var(--vibeui-inputgroup-027-border);
}
[data-vibeui-block="inputgroup-027"] [data-part="toggle"] button{
appearance:none;cursor:pointer;width:2.25rem;border:0;border-radius:0.5rem;
background:none;font:inherit;font-size:0.875rem;font-weight:700;color:var(--vibeui-inputgroup-027-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="inputgroup-027"] [data-part="toggle"] button[aria-pressed="true"]{
background:var(--vibeui-inputgroup-027-raised);color:var(--vibeui-inputgroup-027-accent);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 0.16);
}
[data-vibeui-block="inputgroup-027"] [data-part="toggle"] button:focus-visible{
outline:2px solid var(--vibeui-inputgroup-027-accent);outline-offset:2px;
}
[data-vibeui-block="inputgroup-027"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-027-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-027"] *{transition:none!important}}
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
 * Сцепка «число + переключатель ₽ / %»: сегментированная группа из двух
 * кнопок с aria-pressed меняет единицу измерения скидки, число сохраняется
 * как есть, верхняя граница поля подстраивается только под процент.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup027({
  name = "discount",
  label = "Размер скидки",
  defaultValue = 15,
  defaultUnit = "percent",
  maxPercent = 100,
  onChange,
  hint,
  unitText = UNIT_TEXT,
  unitHint = UNIT_HINT,
  toggleLabel = "Единица скидки",
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup027Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [unit, setUnit] = useState<Inputgroup027Unit>(defaultUnit)

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-027-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-inputgroup-027-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const setUnitAndNotify = (next: Inputgroup027Unit) => {
    setUnit(next)
    const clamped = next === "percent" ? Math.min(value, maxPercent) : value
    setValue(clamped)
    onChange?.(clamped, next)
  }

  return (
    <>
      <style href="vibeui-inputgroup-027" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="inputgroup-027"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <input
            id={id}
            name={name}
            type="number"
            inputMode="decimal"
            min={0}
            max={unit === "percent" ? maxPercent : undefined}
            value={value}
            aria-describedby={`${id}-hint`}
            onChange={(event) => {
              const next = Number(event.target.value)
              const safe = Number.isNaN(next) ? 0 : next
              const clamped =
                unit === "percent" ? Math.min(safe, maxPercent) : safe
              setValue(clamped)
              onChange?.(clamped, unit)
            }}
          />
          <div data-part="toggle" role="group" aria-label={toggleLabel}>
            <button
              type="button"
              aria-pressed={unit === "currency"}
              onClick={() => setUnitAndNotify("currency")}
            >
              {unitText.currency ?? UNIT_TEXT.currency}
            </button>
            <button
              type="button"
              aria-pressed={unit === "percent"}
              onClick={() => setUnitAndNotify("percent")}
            >
              {unitText.percent ?? UNIT_TEXT.percent}
            </button>
          </div>
        </div>
        <p data-part="hint" id={`${id}-hint`}>
          {hint ?? unitHint[unit] ?? UNIT_HINT[unit]}
        </p>
      </div>
    </>
  )
}
