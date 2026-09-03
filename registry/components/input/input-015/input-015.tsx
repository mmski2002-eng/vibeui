"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Input015Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  suffix?: string
  max?: number
  onChange?: (amount: number) => void
  /** Строка при превышении лимита. */
  overText?: string
  /** Короткая запись суммы; {amount} и {suffix} подставляются. */
  aboutText?: string
  /** Напоминание о лимите; {amount} и {suffix} подставляются. */
  limitText?: string
  /** Сокращения разрядов: ключи million и thousand, {value} подставляется. */
  shortText?: Record<string, string>
  /** Десятичный знак в короткой записи. */
  decimalMark?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: разряды расставляются прямо во время набора, а курсор
// не улетает в конец — он пересчитывается по числу цифр слева от него.
// Это главная сложность живого форматирования: без пересчёта поле нельзя
// править в середине. Под полем сумма продублирована словами-сокращениями,
// чтобы «1 200 000» и «120 000» не путались краем глаза.
const STYLES = `
:where([data-vibeui-block="input-015"]){
--vibeui-input-015-surface:transparent;
--vibeui-input-015-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-input-015-fg:light-dark(oklch(0.21 0.014 265),oklch(0.95 0.005 265));
--vibeui-input-015-muted:color-mix(in oklab,var(--vibeui-input-015-fg) 68%,transparent);
--vibeui-input-015-field:light-dark(oklch(0.985 0.002 265),oklch(0.27 0.011 265));
--vibeui-input-015-border:light-dark(oklch(0.88 0.008 265),oklch(0.41 0.013 265));
--vibeui-input-015-accent:light-dark(oklch(0.5 0.15 150),oklch(0.76 0.14 150));
--vibeui-input-015-bad:light-dark(oklch(0.55 0.2 25),oklch(0.73 0.16 25));
--vibeui-input-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-015"]{color-scheme:dark}
[data-vibeui-block="input-015"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-015-surface);
border:1px solid var(--vibeui-input-015-shell);border-radius:0.875rem;
font-family:var(--vibeui-input-015-font);color:var(--vibeui-input-015-fg);
}
[data-vibeui-block="input-015"] *{box-sizing:border-box}
[data-vibeui-block="input-015"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-015"] [data-part="frame"]{
display:flex;align-items:baseline;gap:0.375rem;
padding:0.5rem 0.75rem;
background:var(--vibeui-input-015-field);
border:1px solid var(--vibeui-input-015-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-015"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-015-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-015-accent) 18%,transparent);
}
[data-vibeui-block="input-015"] [data-part="frame"][data-over="1"]{border-color:var(--vibeui-input-015-bad)}
/* Крупные табличные цифры: сумму читают, а не разглядывают. */
[data-vibeui-block="input-015"] input{
flex:1;min-width:0;border:0;background:none;color:inherit;
font:inherit;font-size:1.5rem;font-weight:700;line-height:1.2;
letter-spacing:-0.01em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="input-015"] input:focus{outline:none}
[data-vibeui-block="input-015"] [data-part="suffix"]{
flex:none;font-size:1rem;font-weight:600;color:var(--vibeui-input-015-muted);
user-select:none;
}
[data-vibeui-block="input-015"] [data-part="foot"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-015-muted);
}
[data-vibeui-block="input-015"] [data-part="words"]{font-weight:600;color:var(--vibeui-input-015-fg)}
[data-vibeui-block="input-015"] [data-part="foot"][data-over="1"] [data-part="words"]{color:var(--vibeui-input-015-bad)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-015"] *{animation:none!important;transition:none!important}}
`

// Неразрывный пробел: обычный переносит строку между разрядами.
const THIN = " "

function group(digits: string) {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, THIN)
}

const SHORT: Record<string, string> = {
  million: "{value} млн",
  thousand: "{value} тыс.",
}

function short(
  amount: number,
  shortText: Record<string, string>,
  decimalMark: string,
) {
  if (amount >= 1_000_000) {
    const value = (amount / 1_000_000).toFixed(1).replace(".", decimalMark)

    return (shortText.million ?? SHORT.million).replace("{value}", value)
  }

  if (amount >= 1_000) {
    return (shortText.thousand ?? SHORT.thousand).replace(
      "{value}",
      String(Math.round(amount / 1000)),
    )
  }

  return String(amount)
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
 * Сумма с разделителями разрядов прямо при вводе и сохранением места курсора.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input015({
  label = "Сумма перевода",
  suffix = "₽",
  max = 300000,
  onChange,
  overText = "Больше лимита",
  aboutText = "≈ {amount} {suffix}",
  limitText = `лимит {amount}${THIN}{suffix}`,
  shortText = SHORT,
  decimalMark = ",",
  background = "",
  accent,
  className,
  style,
  ...props
}: Input015Props) {
  const id = useId()
  const field = useRef<HTMLInputElement | null>(null)
  const [digits, setDigits] = useState("125000")

  const palette = {
    ...(accent ? { "--vibeui-input-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-015-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const amount = Number(digits || "0")
  const over = amount > max

  return (
    <>
      <style href="vibeui-input-015" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input"
        data-vibeui-block="input-015"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="frame" data-over={over ? "1" : "0"}>
          <input
            ref={field}
            id={id}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="0"
            value={group(digits)}
            aria-invalid={over}
            aria-describedby={`${id}-foot`}
            onChange={(event) => {
              const input = event.target
              const before = input.value.slice(0, input.selectionStart ?? 0)
              const digitsBefore = before.replace(/\D/g, "").length
              const next = input.value.replace(/\D/g, "").slice(0, 12)

              setDigits(next)
              onChange?.(Number(next || "0"))

              // Курсор ставится после того же количества цифр, а не на тот же
              // индекс: разделители сдвигают строку и индекс врёт.
              window.requestAnimationFrame(() => {
                const node = field.current
                if (!node) return
                const formatted = group(next)
                let seen = 0
                let position = formatted.length
                for (let index = 0; index < formatted.length; index += 1) {
                  if (/\d/.test(formatted[index])) seen += 1
                  if (seen === digitsBefore) {
                    position = index + 1
                    break
                  }
                }
                if (digitsBefore === 0) position = 0
                node.setSelectionRange(position, position)
              })
            }}
          />
          <span data-part="suffix" aria-hidden="true">
            {suffix}
          </span>
        </div>
        <p
          data-part="foot"
          id={`${id}-foot`}
          data-over={over ? "1" : "0"}
          aria-live="polite"
        >
          <span data-part="words">
            {over
              ? overText
              : aboutText
                  .replace("{amount}", short(amount, shortText, decimalMark))
                  .replace("{suffix}", suffix)}
          </span>
          <span>
            {limitText
              .replace("{amount}", group(String(max)))
              .replace("{suffix}", suffix)}
          </span>
        </p>
      </div>
    </>
  )
}
