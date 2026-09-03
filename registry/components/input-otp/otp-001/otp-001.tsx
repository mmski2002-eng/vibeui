"use client"

import { useId, useRef, useState } from "react"
import type {
  ClipboardEvent,
  ComponentProps,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Otp001Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  length?: number
  hint?: string
  /** Подпись клетки для screen reader: {index} — номер, {total} — всего. */
  digitLabel?: string
  onChange?: (code: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: код из СМС по одной цифре в клетке. Главное здесь —
// вставка целиком: код почти всегда копируют, и поле обязано разложить его по
// клеткам само. Backspace на пустой клетке уводит назад, иначе стереть
// набранное невозможно.
const STYLES = `
:where([data-vibeui-block="otp-001"]){
--vibeui-otp-001-bg:transparent;
--vibeui-otp-001-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-otp-001-muted:color-mix(in oklab,var(--vibeui-otp-001-fg) 68%,transparent);
--vibeui-otp-001-border:light-dark(oklch(0.88 0.008 265),oklch(0.42 0.014 265));
--vibeui-otp-001-field:light-dark(oklch(0.985 0.002 265),oklch(0.27 0.014 265));
--vibeui-otp-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-otp-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="otp-001"]{color-scheme:dark}
[data-vibeui-block="otp-001"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-otp-001-bg);
border:1px solid var(--vibeui-otp-001-border);border-radius:0.875rem;
font-family:var(--vibeui-otp-001-font);color:var(--vibeui-otp-001-fg);
}
[data-vibeui-block="otp-001"] [data-part="label"]{font-size:0.9375rem;font-weight:600}
[data-vibeui-block="otp-001"] [data-part="row"]{display:flex;gap:0.375rem}
[data-vibeui-block="otp-001"] input{
flex:1;min-width:0;height:3rem;padding:0;box-sizing:border-box;
border:1.5px solid var(--vibeui-otp-001-border);border-radius:0.625rem;
background:var(--vibeui-otp-001-field);color:inherit;
font:inherit;font-size:1.125rem;font-weight:650;text-align:center;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="otp-001"] input:focus-visible{
outline:2px solid var(--vibeui-otp-001-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="otp-001"] input:not(:placeholder-shown){border-color:var(--vibeui-otp-001-accent)}
[data-vibeui-block="otp-001"] [data-part="hint"]{font-size:0.875rem;line-height:1.4;color:var(--vibeui-otp-001-muted)}
/* Шкала категории: в узкой колонке подпись и подсказка мельче. Порог 19rem, а
   не 32rem, — карточка упёрта в max-width:20rem и шире не бывает. */
@container (min-width: 19rem){
[data-vibeui-block="otp-001"] [data-part="label"]{font-size:1rem}
[data-vibeui-block="otp-001"] [data-part="hint"]{font-size:0.9375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="otp-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Код из СМС по клеткам: вставка целиком раскладывается сама.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Otp001({
  label = "Код из СМС",
  length = 6,
  hint = "Отправили на +7 999 000-00-00. Код придёт в течение минуты",
  digitLabel = "Цифра {index} из {total}",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Otp001Props) {
  const id = useId()
  const size = Math.max(4, Math.min(8, length))
  const [code, setCode] = useState<string[]>(Array(size).fill(""))
  const boxes = useRef<(HTMLInputElement | null)[]>([])

  const palette = {
    ...(accent ? { "--vibeui-otp-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-otp-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const digitName = (index: number) =>
    digitLabel
      .replace("{index}", String(index + 1))
      .replace("{total}", String(size))

  const push = (next: string[]) => {
    setCode(next)
    onChange?.(next.join(""))
  }

  const type = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1)
    const next = [...code]
    next[index] = digit
    push(next)
    if (digit && index < size - 1) boxes.current[index + 1]?.focus()
  }

  // Вставка целиком: код копируют из сообщения, и раскладывать его руками
  // по клеткам никто не станет.
  const paste = (event: ClipboardEvent<HTMLInputElement>) => {
    const digits = event.clipboardData.getData("text").replace(/\D/g, "")
    if (!digits) return
    event.preventDefault()
    const next = Array.from({ length: size }, (_, index) => digits[index] ?? "")
    push(next)
    boxes.current[Math.min(digits.length, size - 1)]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      event.preventDefault()
      boxes.current[index - 1]?.focus()
      const next = [...code]
      next[index - 1] = ""
      push(next)
    } else if (event.key === "ArrowLeft" && index > 0) {
      boxes.current[index - 1]?.focus()
    } else if (event.key === "ArrowRight" && index < size - 1) {
      boxes.current[index + 1]?.focus()
    }
  }

  return (
    <>
      <style href="vibeui-otp-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input-otp"
        data-vibeui-block="otp-001"
        className={className}
        style={palette}
        role="group"
        aria-labelledby={`${id}-label`}
      >
        <span data-part="label" id={`${id}-label`}>
          {label}
        </span>
        <div data-part="row">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(node) => {
                boxes.current[index] = node
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              placeholder=" "
              value={digit}
              aria-label={digitName(index)}
              onChange={(event) => type(index, event.target.value)}
              onPaste={paste}
              onKeyDown={(event) => onKeyDown(event, index)}
            />
          ))}
        </div>
        {hint ? <span data-part="hint">{hint}</span> : null}
      </div>
    </>
  )
}
