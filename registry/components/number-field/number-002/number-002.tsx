"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Number002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  pack?: number
  min?: number
  max?: number
  defaultPacks?: number
  unit?: string
  /** Строка про размер упаковки. Подстановки: {pack}, {unit}. */
  packText?: string
  /** Подпись кнопки, убирающей строку из заказа. */
  removeLabel?: string
  /** Подпись кнопки «на упаковку меньше». */
  decrementLabel?: string
  /** Подпись кнопки «на упаковку больше». */
  incrementLabel?: string
  /** Текст пустого заказа. */
  emptyText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: счётчик товара, который считает упаковками, а не штуками.
// Шаг равен размеру упаковки, поэтому промежуточные значения физически
// недостижимы, а под полем всегда видно, во что превратится заказ в штуках.
// На минимуме кнопка «минус» становится удалением строки: обнулять счётчик
// «в никуда» пользователи не догадываются, а корзину чистить надо.
//
// Тема берётся из color-scheme окружения через light-dark(): строка заказа
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="number-002"]){
--vibeui-number-002-surface:transparent;
--vibeui-number-002-chip:light-dark(oklch(1 0 0),oklch(0.31 0.013 265));
--vibeui-number-002-field:light-dark(oklch(0.975 0.003 265),oklch(0.25 0.011 265));
--vibeui-number-002-shell:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-number-002-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-number-002-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-number-002-border:light-dark(oklch(0.88 0.008 265),oklch(0.42 0.014 265));
--vibeui-number-002-accent:light-dark(oklch(0.55 0.16 160),oklch(0.74 0.14 160));
--vibeui-number-002-ring:light-dark(oklch(0.55 0.16 160 / 20%),oklch(0.74 0.14 160 / 30%));
--vibeui-number-002-danger:light-dark(oklch(0.55 0.19 25),oklch(0.72 0.16 25));
--vibeui-number-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Подложки по умолчанию нет: строка заказа ложится на фон страницы. */
[data-vibeui-block="number-002"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:19rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-number-002-surface);
border:1px solid var(--vibeui-number-002-shell);border-radius:0.875rem;
font-family:var(--vibeui-number-002-font);color:var(--vibeui-number-002-fg);
}
[data-vibeui-block="number-002"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;margin:0;
}
[data-vibeui-block="number-002"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="number-002"] [data-part="pack"]{
font-size:0.6875rem;color:var(--vibeui-number-002-muted);white-space:nowrap;
}
[data-vibeui-block="number-002"] [data-part="field"]{
display:flex;align-items:center;
border:1px solid var(--vibeui-number-002-border);border-radius:9999px;
background:var(--vibeui-number-002-field);padding:0.25rem;
}
[data-vibeui-block="number-002"] [data-part="field"]:focus-within{
border-color:var(--vibeui-number-002-accent);
box-shadow:0 0 0 2px var(--vibeui-number-002-ring);
}
[data-vibeui-block="number-002"] button{
appearance:none;border:0;cursor:pointer;flex:none;
width:2.25rem;height:2.25rem;border-radius:9999px;
background:var(--vibeui-number-002-chip);color:inherit;
font:inherit;font-size:1rem;line-height:1;
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 12%);
transition:color .14s ease,opacity .14s ease;
}
[data-vibeui-block="number-002"] button:focus-visible{outline:2px solid var(--vibeui-number-002-accent);outline-offset:2px}
/* На минимуме «минус» превращается в удаление: обнулять счётчик не догадываются. */
[data-vibeui-block="number-002"] button[data-role="remove"]{color:var(--vibeui-number-002-danger)}
[data-vibeui-block="number-002"] button:disabled{cursor:default;opacity:.45}
[data-vibeui-block="number-002"] input{
flex:1 1 auto;min-width:0;width:100%;
appearance:none;border:0;background:none;outline:none;
height:2.25rem;padding:0 0.25rem;color:inherit;
font:inherit;font-size:1rem;font-weight:680;text-align:center;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="number-002"] input::-webkit-outer-spin-button,
[data-vibeui-block="number-002"] input::-webkit-inner-spin-button{appearance:none;margin:0}
/* Пересчёт в штуки: упаковки считают, а получают всё равно штуки. */
[data-vibeui-block="number-002"] [data-part="total"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
margin:0;font-size:0.75rem;color:var(--vibeui-number-002-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="number-002"] [data-part="pieces"]{font-weight:650;color:var(--vibeui-number-002-fg)}
[data-vibeui-block="number-002"] [data-part="empty"]{color:var(--vibeui-number-002-danger);font-weight:600}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="number-002"] *{animation:none!important;transition:none!important}}
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
 * Счётчик, который считает упаковками и пересчитывает их в штуки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Number002({
  label = "Вода в бутылках",
  pack = 6,
  min = 0,
  max = 24,
  defaultPacks = 2,
  unit = "бут.",
  packText = "упаковка — {pack} {unit}",
  removeLabel = "Убрать из заказа",
  decrementLabel = "На упаковку меньше",
  incrementLabel = "На упаковку больше",
  emptyText = "Нет в заказе",
  background = "",
  accent,
  className,
  style,
  ...props
}: Number002Props) {
  const id = useId()
  const [packs, setPacks] = useState(defaultPacks)
  const empty = packs <= min

  const clamp = (value: number) => Math.min(max, Math.max(min, value))

  const palette = {
    ...(accent ? { "--vibeui-number-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-number-002-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-number-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="number-002"
        className={className}
        style={palette}
      >
        <p data-part="head">
          <label htmlFor={id}>{label}</label>
          <span data-part="pack">
            {packText.replace("{pack}", String(pack)).replace("{unit}", unit)}
          </span>
        </p>
        <div data-part="field">
          <button
            type="button"
            data-role={packs === min + 1 ? "remove" : "minus"}
            disabled={empty}
            aria-label={packs === min + 1 ? removeLabel : decrementLabel}
            onClick={() => setPacks(clamp(packs - 1))}
          >
            {packs === min + 1 ? "✕" : "−"}
          </button>
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            step={1}
            value={packs}
            aria-describedby={`${id}-total`}
            onChange={(event) => {
              const next = Number(event.target.value)
              setPacks(Number.isFinite(next) ? clamp(next) : min)
            }}
          />
          <button
            type="button"
            disabled={packs >= max}
            aria-label={incrementLabel}
            onClick={() => setPacks(clamp(packs + 1))}
          >
            +
          </button>
        </div>
        <p id={`${id}-total`} data-part="total" aria-live="polite">
          {empty ? (
            <span data-part="empty">{emptyText}</span>
          ) : (
            <>
              <span>
                {packs} × {pack}
              </span>
              <span data-part="pieces">
                {packs * pack} {unit}
              </span>
            </>
          )}
        </p>
      </div>
    </>
  )
}
