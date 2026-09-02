"use client"

import { useEffect, useId, useRef, useState } from "react"
import type {
  ClipboardEvent,
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Otp003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  length?: number
  seconds?: number
  /** Подпись клетки для screen reader: {index} — номер, {total} — всего. */
  digitLabel?: string
  /** Строка ожидания: {time} — остаток в формате м:сс. */
  waitText?: string
  /** Строка после отсчёта, когда повтор уже доступен. */
  readyText?: string
  /** Подпись кнопки повторной отправки. */
  resendText?: string
  onChange?: (code: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: рядом с кодом всегда живёт вопрос «а если не пришло».
// Поэтому здесь есть повторная отправка с обратным отсчётом: пока идёт
// таймер, кнопка выключена и вслух читается оставшееся время, а не «кнопка
// недоступна». Отсчёт идёт от отметки времени, а не сложением секунд:
// вкладку сворачивают, таймеры в фоне тормозят, и счёт по тикам врёт.
const STYLES = `
:where([data-vibeui-block="otp-003"]){
--vibeui-otp-003-bg:transparent;
--vibeui-otp-003-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-otp-003-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-otp-003-muted:light-dark(oklch(0.56 0.014 265),oklch(0.7 0.014 265));
--vibeui-otp-003-field:light-dark(oklch(0.98 0.002 265),oklch(0.26 0.014 265));
--vibeui-otp-003-border:light-dark(oklch(0.87 0.008 265),oklch(0.42 0.014 265));
--vibeui-otp-003-accent:light-dark(oklch(0.5 0.16 240),oklch(0.74 0.14 240));
--vibeui-otp-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="otp-003"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-otp-003-bg);
border:1px solid var(--vibeui-otp-003-shell);border-radius:0.875rem;
font-family:var(--vibeui-otp-003-font);color:var(--vibeui-otp-003-fg);
}
[data-vibeui-block="otp-003"] *{box-sizing:border-box}
[data-vibeui-block="otp-003"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="otp-003"] [data-part="row"]{display:flex;gap:0.375rem}
[data-vibeui-block="otp-003"] input{
flex:1;min-width:0;height:2.875rem;padding:0;
border:1.5px solid var(--vibeui-otp-003-border);border-radius:0.625rem;
background:var(--vibeui-otp-003-field);color:inherit;
font:inherit;font-size:1.125rem;font-weight:700;text-align:center;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="otp-003"] input:focus-visible{
outline:2px solid var(--vibeui-otp-003-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="otp-003"] input:not(:placeholder-shown){border-color:var(--vibeui-otp-003-accent)}
/* Полоса времени: остаток видно, не читая цифру. */
[data-vibeui-block="otp-003"] [data-part="track"]{
height:0.1875rem;border-radius:999px;overflow:hidden;
background:color-mix(in oklab,var(--vibeui-otp-003-muted) 25%,transparent);
}
[data-vibeui-block="otp-003"] [data-part="fill"]{
display:block;height:100%;border-radius:999px;
background:var(--vibeui-otp-003-accent);
transition:width 1s linear;
}
[data-vibeui-block="otp-003"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="otp-003"] [data-part="left"]{
font-size:0.75rem;line-height:1.4;color:var(--vibeui-otp-003-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="otp-003"] [data-part="resend"]{
appearance:none;cursor:pointer;flex:none;
height:2rem;padding:0 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-otp-003-accent);
background:transparent;color:var(--vibeui-otp-003-accent);
font:inherit;font-size:0.75rem;font-weight:650;
transition:background-color .16s ease;
}
[data-vibeui-block="otp-003"] [data-part="resend"]:hover:not(:disabled){
background:color-mix(in oklab,var(--vibeui-otp-003-accent) 12%,transparent);
}
[data-vibeui-block="otp-003"] [data-part="resend"]:disabled{
cursor:not-allowed;opacity:.45;border-color:var(--vibeui-otp-003-muted);color:var(--vibeui-otp-003-muted);
}
[data-vibeui-block="otp-003"] [data-part="resend"]:focus-visible{
outline:2px solid var(--vibeui-otp-003-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="otp-003"] *{animation:none!important;transition:none!important}}
`

function clock(total: number) {
  const minutes = Math.floor(total / 60)
  const rest = total % 60
  return `${minutes}:${String(rest).padStart(2, "0")}`
}

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
 * Код подтверждения с таймером повторной отправки и полосой остатка времени.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Otp003({
  label = "Код из письма",
  length = 6,
  seconds = 45,
  digitLabel = "Цифра {index} из {total}",
  waitText = "Новый код можно запросить через {time}",
  readyText = "Код не пришёл? Запросите новый.",
  resendText = "Выслать снова",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Otp003Props) {
  const id = useId()
  const size = Math.max(4, Math.min(8, length))
  const [code, setCode] = useState<string[]>(Array(size).fill(""))
  const [left, setLeft] = useState(seconds)
  const [round, setRound] = useState(0)
  const boxes = useRef<(HTMLInputElement | null)[]>([])

  // Отсчёт от отметки времени: в свёрнутой вкладке таймеры тормозят,
  // и сложение секунд по тикам показало бы больше, чем прошло.
  useEffect(() => {
    const until = Date.now() + seconds * 1000
    const timer = window.setInterval(() => {
      const rest = Math.max(0, Math.round((until - Date.now()) / 1000))
      setLeft(rest)
      if (rest === 0) window.clearInterval(timer)
    }, 500)

    return () => window.clearInterval(timer)
  }, [round, seconds])

  const palette = {
    ...(accent ? { "--vibeui-otp-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-otp-003-bg": background,
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

  const paste = (event: ClipboardEvent<HTMLInputElement>) => {
    const digits = event.clipboardData.getData("text").replace(/\D/g, "")
    if (!digits) return
    event.preventDefault()
    push(Array.from({ length: size }, (_, index) => digits[index] ?? ""))
    boxes.current[Math.min(digits.length, size - 1)]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      event.preventDefault()
      const next = [...code]
      next[index - 1] = ""
      push(next)
      boxes.current[index - 1]?.focus()
    }
  }

  return (
    <>
      <style href="vibeui-otp-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="otp-003"
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
        <div data-part="track" aria-hidden="true">
          <span
            data-part="fill"
            style={{ width: `${(left / seconds) * 100}%` }}
          />
        </div>
        <div data-part="foot">
          <span data-part="left" aria-live="polite">
            {left > 0 ? waitText.replace("{time}", clock(left)) : readyText}
          </span>
          <button
            type="button"
            data-part="resend"
            disabled={left > 0}
            onClick={() => {
              setLeft(seconds)
              setRound((was) => was + 1)
              push(Array(size).fill(""))
              boxes.current[0]?.focus()
            }}
          >
            {resendText}
          </button>
        </div>
      </div>
    </>
  )
}
