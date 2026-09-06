"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Inputgroup036Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  name?: string
  legend?: string
  defaultFrom?: number | string
  defaultTo?: number | string
  min?: number
  max?: number
  onChange?: (from: string, to: string, valid: boolean) => void
  hint?: string
  /** Подписи половин: ключи from и to. */
  boundsText?: Record<string, string>
  /** Сообщение при перевёрнутом диапазоне. */
  errorText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

const BOUNDS_TEXT: Record<string, string> = {
  from: "От",
  to: "До",
}

const ERROR_TEXT = "Значение «до» не может быть меньше значения «от»."

// Идея компонента: в отличие от диапазона с датами, у чисел нет нативного
// min/max, который бы сам не пускал пользователя ввести «до» меньше «от» —
// проверку приходится делать в JS после каждого изменения любой половины.
// Ошибка красит всю сцепку целиком, а не одну половину: «от» без «до» и
// «до» без «от» одинаково неполны, виновата пара, а не один инпут.
const STYLES = `
:where([data-vibeui-block="inputgroup-036"]){
--vibeui-inputgroup-036-surface:transparent;
--vibeui-inputgroup-036-shell:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-inputgroup-036-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-inputgroup-036-muted:color-mix(in oklab,var(--vibeui-inputgroup-036-fg) 68%,transparent);
--vibeui-inputgroup-036-field:light-dark(oklch(0.99 0 265),oklch(0.26 0 265));
--vibeui-inputgroup-036-border:light-dark(oklch(0.86 0 265),oklch(0.42 0 265));
--vibeui-inputgroup-036-accent:light-dark(oklch(0.55 0.15 280),oklch(0.76 0.13 280));
--vibeui-inputgroup-036-error:light-dark(oklch(0.56 0.19 25),oklch(0.75 0.15 25));
--vibeui-inputgroup-036-radius:0.75rem;
--vibeui-inputgroup-036-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="inputgroup-036"]{color-scheme:dark}
[data-vibeui-block="inputgroup-036"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-036-surface);
border:1px solid var(--vibeui-inputgroup-036-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-036-font);color:var(--vibeui-inputgroup-036-fg);
}
[data-vibeui-block="inputgroup-036"] *{box-sizing:border-box}
/* УА-стиль браузера даёт fieldset { min-width: min-content } — без сброса
   сцепка не сжимается меньше содержимого и распирает страницу. */
[data-vibeui-block="inputgroup-036"] fieldset{min-inline-size:0;margin:0;padding:0;border:0;display:flex;flex-direction:column;gap:0.4375rem}
[data-vibeui-block="inputgroup-036"] legend{padding:0;font-size:0.8125rem;font-weight:600;float:left;width:100%}
[data-vibeui-block="inputgroup-036"] [data-part="group"]{
display:flex;align-items:stretch;clear:both;
border-radius:var(--vibeui-inputgroup-036-radius);
box-shadow:0 0 0 1px var(--vibeui-inputgroup-036-border);
}
[data-vibeui-block="inputgroup-036"] [data-part="group"][data-invalid="true"]{
box-shadow:0 0 0 2px var(--vibeui-inputgroup-036-error);
}
[data-vibeui-block="inputgroup-036"] [data-part="half"]{
flex:1;min-width:0;display:flex;flex-direction:column;position:relative;
}
[data-vibeui-block="inputgroup-036"] [data-part="half"] + [data-part="half"]{
box-shadow:inset 1px 0 0 var(--vibeui-inputgroup-036-border);
}
[data-vibeui-block="inputgroup-036"] [data-part="half"] span{
padding:0.4375rem 0.75rem 0;font-size:0.6875rem;color:var(--vibeui-inputgroup-036-muted);
}
[data-vibeui-block="inputgroup-036"] input{
height:2.375rem;border:0;background:var(--vibeui-inputgroup-036-field);
padding:0 0.75rem;font:inherit;font-size:0.875rem;color:inherit;
font-variant-numeric:tabular-nums;border-radius:inherit;
}
/* Стрелки type="number" встают на стык половин и ломают общую рамку сцепки. */
[data-vibeui-block="inputgroup-036"] input::-webkit-outer-spin-button,
[data-vibeui-block="inputgroup-036"] input::-webkit-inner-spin-button{appearance:none;margin:0}
[data-vibeui-block="inputgroup-036"] [data-part="half"]:first-child input{
border-radius:var(--vibeui-inputgroup-036-radius) 0 0 var(--vibeui-inputgroup-036-radius);
}
[data-vibeui-block="inputgroup-036"] [data-part="half"]:last-child input{
border-radius:0 var(--vibeui-inputgroup-036-radius) var(--vibeui-inputgroup-036-radius) 0;
}
[data-vibeui-block="inputgroup-036"] input:focus,
[data-vibeui-block="inputgroup-036"] input:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-036-accent);outline-offset:-2px;
}
[data-vibeui-block="inputgroup-036"] [data-part="error"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-036-error);font-weight:600;
}
[data-vibeui-block="inputgroup-036"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-036-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-036"] *{transition:none!important}}
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

function toNumber(value: string): number | null {
  if (value.trim() === "") return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

/**
 * Сцепка «от — до» с общей рамкой и активной проверкой порядка: значение
 * «до» меньше «от» красит всю группу и выводит сообщение об ошибке, а не
 * полагается на нативный min, которого у произвольных чисел нет.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup036({
  name = "range",
  legend = "Возраст участников",
  defaultFrom = 18,
  defaultTo = 65,
  min,
  max,
  onChange,
  hint = "Проверка порядка идёт на лету: «до» меньше «от» подсвечивает всю сцепку.",
  boundsText = BOUNDS_TEXT,
  errorText = ERROR_TEXT,
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup036Props) {
  const id = useId()
  const [from, setFrom] = useState(String(defaultFrom))
  const [to, setTo] = useState(String(defaultTo))

  const fromNumber = toNumber(from)
  const toNumberValue = toNumber(to)
  const invalid =
    fromNumber !== null && toNumberValue !== null && fromNumber > toNumberValue

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-036-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-inputgroup-036-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const emit = (nextFrom: string, nextTo: string) => {
    const a = toNumber(nextFrom)
    const b = toNumber(nextTo)
    const valid = !(a !== null && b !== null && a > b)
    onChange?.(nextFrom, nextTo, valid)
  }

  return (
    <>
      <style href="vibeui-inputgroup-036" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input-group"
        data-vibeui-block="inputgroup-036"
        className={className}
        style={palette}
      >
        <fieldset>
          <legend>{legend}</legend>
          <div data-part="group" data-invalid={invalid}>
            <div data-part="half">
              <span id={`${id}-from-label`}>
                {boundsText.from ?? BOUNDS_TEXT.from}
              </span>
              <input
                id={`${id}-from`}
                name={`${name}-from`}
                type="number"
                inputMode="numeric"
                min={min}
                max={max}
                value={from}
                aria-labelledby={`${id}-from-label`}
                aria-describedby={invalid ? `${id}-error` : `${id}-hint`}
                aria-invalid={invalid}
                onChange={(event) => {
                  const next = event.target.value
                  setFrom(next)
                  emit(next, to)
                }}
              />
            </div>
            <div data-part="half">
              <span id={`${id}-to-label`}>
                {boundsText.to ?? BOUNDS_TEXT.to}
              </span>
              <input
                id={`${id}-to`}
                name={`${name}-to`}
                type="number"
                inputMode="numeric"
                min={min}
                max={max}
                value={to}
                aria-labelledby={`${id}-to-label`}
                aria-describedby={invalid ? `${id}-error` : `${id}-hint`}
                aria-invalid={invalid}
                onChange={(event) => {
                  const next = event.target.value
                  setTo(next)
                  emit(from, next)
                }}
              />
            </div>
          </div>
        </fieldset>
        {invalid ? (
          <p data-part="error" id={`${id}-error`} role="alert">
            {errorText}
          </p>
        ) : (
          <p data-part="hint" id={`${id}-hint`}>
            {hint}
          </p>
        )}
      </div>
    </>
  )
}
