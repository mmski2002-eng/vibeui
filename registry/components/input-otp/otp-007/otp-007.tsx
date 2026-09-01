"use client"

import { useId, useRef, useState } from "react"
import type {
  ClipboardEvent,
  ComponentPropsWithoutRef,
  CSSProperties,
} from "react"

export type Otp007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSubmit"
> & {
  label?: string
  length?: number
  onSubmit?: (code: string) => void
  accent?: string
}

// Идея компонента: кнопки «Подтвердить» здесь нет. Как только набрана
// последняя цифра, код уходит на проверку сам — нажимать после шести цифр
// нечего, и лишняя кнопка только добавляет шаг. Взамен появляется явное
// состояние: клетки блокируются, поверх них идёт полоса ожидания, а результат
// объявляется через aria-live. Кнопка возврата к вводу обязательна: без неё
// после ошибки поле остаётся заблокированным навсегда.
const STYLES = `
:where([data-vibeui-block="otp-007"]){
--vibeui-otp-007-surface:oklch(1 0 0);
--vibeui-otp-007-shell:oklch(0.91 0.006 265);
--vibeui-otp-007-fg:oklch(0.21 0.014 265);
--vibeui-otp-007-muted:oklch(0.56 0.014 265);
--vibeui-otp-007-field:oklch(0.98 0.002 265);
--vibeui-otp-007-border:oklch(0.87 0.008 265);
--vibeui-otp-007-accent:oklch(0.5 0.17 250);
--vibeui-otp-007-ok:oklch(0.48 0.13 155);
--vibeui-otp-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="otp-007"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-otp-007-surface);
border:1px solid var(--vibeui-otp-007-shell);border-radius:0.875rem;
font-family:var(--vibeui-otp-007-font);color:var(--vibeui-otp-007-fg);
}
[data-vibeui-block="otp-007"] *{box-sizing:border-box}
[data-vibeui-block="otp-007"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
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
min-height:2rem;
}
[data-vibeui-block="otp-007"] [data-part="status"]{
font-size:0.75rem;line-height:1.4;color:var(--vibeui-otp-007-muted);
}
[data-vibeui-block="otp-007"] [data-state="done"] [data-part="status"]{
color:var(--vibeui-otp-007-ok);font-weight:600;
}
[data-vibeui-block="otp-007"] [data-part="again"]{
appearance:none;flex:none;cursor:pointer;
height:2rem;padding:0 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-otp-007-border);
background:transparent;color:inherit;
font:inherit;font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="otp-007"] [data-part="again"]:focus-visible{
outline:2px solid var(--vibeui-otp-007-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="otp-007"] *{animation:none!important;transition:none!important}}
`

/**
 * Код подтверждения с автоотправкой: последняя цифра запускает проверку сама.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Otp007({
  label = "Подтверждение входа",
  length = 6,
  onSubmit,
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
    ...style,
  } as CSSProperties

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
              aria-label={`Цифра ${index + 1} из ${size}`}
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
            {state === "sending"
              ? "Проверяем код…"
              : state === "done"
                ? "Код принят, входим."
                : "Кнопки нет: проверка начнётся на последней цифре."}
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
              Ввести заново
            </button>
          ) : null}
        </div>
      </div>
    </>
  )
}
