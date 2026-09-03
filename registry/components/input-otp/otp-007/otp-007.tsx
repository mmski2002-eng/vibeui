"use client"

import { useId, useRef, useState } from "react"
import type { ClipboardEvent, ComponentProps, CSSProperties } from "react"

export type Otp007Props = Omit<
  ComponentProps<"div">,
  "children" | "onSubmit"
> & {
  label?: string
  length?: number
  /** Подпись клетки для screen reader: {index} — номер, {total} — всего. */
  digitLabel?: string
  /** Строка состояния: ключи idle, sending и done. */
  statusText?: Record<string, string>
  /** Подпись кнопки возврата к вводу. */
  retryText?: string
  onSubmit?: (code: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

const STATUS_LABEL: Record<string, string> = {
  idle: "Кнопки нет: проверка начнётся на последней цифре.",
  sending: "Проверяем код…",
  done: "Код принят, входим.",
}

// Идея компонента: кнопки «Подтвердить» здесь нет. Как только набрана
// последняя цифра, код уходит на проверку сам — нажимать после шести цифр
// нечего, и лишняя кнопка только добавляет шаг. Взамен появляется явное
// состояние: клетки блокируются, поверх них идёт полоса ожидания, а результат
// объявляется через aria-live. Кнопка возврата к вводу обязательна: без неё
// после ошибки поле остаётся заблокированным навсегда.
const STYLES = `
:where([data-vibeui-block="otp-007"]){
--vibeui-otp-007-bg:transparent;
--vibeui-otp-007-surface:light-dark(oklch(1 0 0),oklch(0.26 0.014 265));
--vibeui-otp-007-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-otp-007-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-otp-007-muted:color-mix(in oklab,var(--vibeui-otp-007-fg) 68%,transparent);
--vibeui-otp-007-field:light-dark(oklch(0.98 0.002 265),oklch(0.26 0.014 265));
--vibeui-otp-007-border:light-dark(oklch(0.87 0.008 265),oklch(0.42 0.014 265));
--vibeui-otp-007-accent:light-dark(oklch(0.5 0.17 250),oklch(0.74 0.15 250));
--vibeui-otp-007-ok:light-dark(oklch(0.48 0.13 155),oklch(0.74 0.14 155));
--vibeui-otp-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="otp-007"]{color-scheme:dark}
[data-vibeui-block="otp-007"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-otp-007-bg);
border:1px solid var(--vibeui-otp-007-shell);border-radius:0.875rem;
font-family:var(--vibeui-otp-007-font);color:var(--vibeui-otp-007-fg);
}
[data-vibeui-block="otp-007"] *{box-sizing:border-box}
[data-vibeui-block="otp-007"] [data-part="label"]{font-size:0.9375rem;font-weight:600}
[data-vibeui-block="otp-007"] [data-part="row"]{display:flex;gap:0.375rem}
[data-vibeui-block="otp-007"] input{
flex:1;min-width:0;height:3rem;padding:0;
border:1.5px solid var(--vibeui-otp-007-border);border-radius:0.625rem;
background:var(--vibeui-otp-007-field);color:inherit;
font:inherit;font-size:1.25rem;font-weight:700;text-align:center;
font-variant-numeric:tabular-nums;
transition:border-color .16s ease,opacity .16s ease;
}
[data-vibeui-block="otp-007"] input:focus-visible{
outline:2px solid var(--vibeui-otp-007-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="otp-007"] input:disabled{opacity:.6;cursor:default}
[data-vibeui-block="otp-007"] [data-state="done"] input{
border-color:var(--vibeui-otp-007-ok);
background:color-mix(in oklab,var(--vibeui-otp-007-ok) 8%,var(--vibeui-otp-007-surface));
}
/* Полоса ожидания вместо кнопки: без неё автоотправка выглядит как зависание. */
[data-vibeui-block="otp-007"] [data-part="track"]{
height:0.1875rem;border-radius:999px;overflow:hidden;
background:color-mix(in oklab,var(--vibeui-otp-007-muted) 22%,transparent);
}
[data-vibeui-block="otp-007"] [data-part="beam"]{
display:block;width:40%;height:100%;border-radius:999px;
background:var(--vibeui-otp-007-accent);
animation:vibeui-otp-007-run 1.1s ease-in-out infinite;
}
@keyframes vibeui-otp-007-run{
0%{transform:translateX(-100%)}
100%{transform:translateX(250%)}
}
[data-vibeui-block="otp-007"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
flex-wrap:wrap;min-height:2rem;
}
[data-vibeui-block="otp-007"] [data-part="status"]{
flex:1 1 9rem;
font-size:0.875rem;line-height:1.4;color:var(--vibeui-otp-007-muted);
}
[data-vibeui-block="otp-007"] [data-state="done"] [data-part="status"]{
color:var(--vibeui-otp-007-ok);font-weight:600;
}
[data-vibeui-block="otp-007"] [data-part="again"]{
appearance:none;flex:none;cursor:pointer;
height:2rem;padding:0 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-otp-007-border);
background:transparent;color:inherit;
font:inherit;font-size:0.875rem;font-weight:600;
}
[data-vibeui-block="otp-007"] [data-part="again"]:focus-visible{
outline:2px solid var(--vibeui-otp-007-accent);outline-offset:2px;
}
/* Шкала категории. Порог 19rem, а не 32rem: карточка упёрта в max-width:21rem. */
@container (min-width: 19rem){
[data-vibeui-block="otp-007"] [data-part="label"]{font-size:1rem}
[data-vibeui-block="otp-007"] [data-part="status"]{font-size:0.9375rem}
[data-vibeui-block="otp-007"] [data-part="again"]{font-size:0.9375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="otp-007"] *{animation:none!important;transition:none!important}}
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
 * Код подтверждения с автоотправкой: последняя цифра запускает проверку сама.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Otp007({
  label = "Подтверждение входа",
  length = 6,
  digitLabel = "Цифра {index} из {total}",
  statusText = STATUS_LABEL,
  retryText = "Ввести заново",
  onSubmit,
  background = "",
  accent,
  className,
  style,
  ...props
}: Otp007Props) {
  const id = useId()
  const size = Math.max(4, Math.min(8, length))
  const [code, setCode] = useState<string[]>(Array(size).fill(""))
  const [state, setState] = useState<"idle" | "sending" | "done">("idle")
  const boxes = useRef<(HTMLInputElement | null)[]>([])

  const palette = {
    ...(accent ? { "--vibeui-otp-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-otp-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const digitName = (index: number) =>
    digitLabel
      .replace("{index}", String(index + 1))
      .replace("{total}", String(size))

  // Отправка вынесена в общий шаг: код можно дособрать вводом, вставкой или
  // правкой средней клетки, и все эти пути обязаны привести к одному действию.
  // Состояние sending — заодно защита от повторной отправки.
  const push = (next: string[]) => {
    setCode(next)
    if (next.join("").length < size) return

    setState("sending")
    window.setTimeout(() => {
      setState("done")
      onSubmit?.(next.join(""))
    }, 900)
  }

  const type = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1)
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
  }

  return (
    <>
      <style href="vibeui-otp-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input-otp"
        data-vibeui-block="otp-007"
        className={className}
        style={palette}
        data-state={state}
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
              value={digit}
              disabled={state !== "idle"}
              aria-label={digitName(index)}
              aria-describedby={`${id}-status`}
              onChange={(event) => type(index, event.target.value)}
              onPaste={paste}
              onKeyDown={(event) => {
                if (event.key === "Backspace" && !digit && index > 0) {
                  event.preventDefault()
                  const next = [...code]
                  next[index - 1] = ""
                  setCode(next)
                  boxes.current[index - 1]?.focus()
                }
              }}
            />
          ))}
        </div>
        {state === "sending" ? (
          <div data-part="track" aria-hidden="true">
            <span data-part="beam" />
          </div>
        ) : null}
        <div data-part="foot">
          <span data-part="status" id={`${id}-status`} aria-live="polite">
            {statusText[state] ?? STATUS_LABEL[state]}
          </span>
          {state === "done" ? (
            <button
              type="button"
              data-part="again"
              onClick={() => {
                setCode(Array(size).fill(""))
                setState("idle")
                boxes.current[0]?.focus()
              }}
            >
              {retryText}
            </button>
          ) : null}
        </div>
      </div>
    </>
  )
}
