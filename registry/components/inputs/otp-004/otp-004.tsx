"use client"

import { useId, useRef, useState } from "react"
import type {
  ClipboardEvent,
  ComponentPropsWithoutRef,
  CSSProperties,
} from "react"

export type Otp004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSubmit"
> & {
  label?: string
  expected?: string
  attempts?: number
  onSubmit?: (code: string) => void
  accent?: string
}

// Идея компонента: неверный код — самое частое состояние этого поля, и оно
// оформлено всерьёз. Встряска короткая (одно движение, 0.3 с), красная рамка
// держится до следующего ввода, счётчик попыток говорит, сколько осталось,
// а фокус сам возвращается на первую клетку — переспрашивать «куда теперь
// печатать» не нужно. При prefers-reduce-motion встряска отключается: смысл
// несёт цвет и текст, а не движение.
const STYLES = `
:where([data-vibeui-block="otp-004"]){
--vibeui-otp-004-surface:oklch(1 0 0);
--vibeui-otp-004-shell:oklch(0.91 0.006 265);
--vibeui-otp-004-fg:oklch(0.21 0.014 265);
--vibeui-otp-004-muted:oklch(0.56 0.014 265);
--vibeui-otp-004-field:oklch(0.98 0.002 265);
--vibeui-otp-004-border:oklch(0.87 0.008 265);
--vibeui-otp-004-accent:oklch(0.52 0.18 285);
--vibeui-otp-004-bad:oklch(0.55 0.21 25);
--vibeui-otp-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="otp-004"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-otp-004-surface);
border:1px solid var(--vibeui-otp-004-shell);border-radius:0.875rem;
font-family:var(--vibeui-otp-004-font);color:var(--vibeui-otp-004-fg);
}
[data-vibeui-block="otp-004"] *{box-sizing:border-box}
[data-vibeui-block="otp-004"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="otp-004"] [data-part="row"]{display:flex;gap:0.375rem}
/* Встряска — одно движение туда-обратно. Длинная анимация читается как
   поломка интерфейса, а не как отказ. */
[data-vibeui-block="otp-004"] [data-part="row"][data-bad="1"][data-shake="a"]{
animation:vibeui-otp-004-shake-a .3s ease-in-out;
}
[data-vibeui-block="otp-004"] [data-part="row"][data-bad="1"][data-shake="b"]{
animation:vibeui-otp-004-shake-b .3s ease-in-out;
}
/* Два одинаковых набора кадров, которые чередуются: смена имени анимации
   перезапускает её без размонтирования клеток, а значит без потери фокуса. */
@keyframes vibeui-otp-004-shake-a{
0%,100%{transform:translateX(0)}
20%{transform:translateX(-0.375rem)}
50%{transform:translateX(0.3125rem)}
80%{transform:translateX(-0.1875rem)}
}
@keyframes vibeui-otp-004-shake-b{
0%,100%{transform:translateX(0)}
20%{transform:translateX(-0.375rem)}
50%{transform:translateX(0.3125rem)}
80%{transform:translateX(-0.1875rem)}
}
[data-vibeui-block="otp-004"] input{
flex:1;min-width:0;height:3rem;padding:0;
border:1.5px solid var(--vibeui-otp-004-border);border-radius:0.625rem;
background:var(--vibeui-otp-004-field);color:inherit;
font:inherit;font-size:1.25rem;font-weight:700;text-align:center;
font-variant-numeric:tabular-nums;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="otp-004"] input:focus-visible{
outline:2px solid var(--vibeui-otp-004-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="otp-004"] [data-part="row"][data-bad="1"] input{
border-color:var(--vibeui-otp-004-bad);
background:color-mix(in oklab,var(--vibeui-otp-004-bad) 7%,var(--vibeui-otp-004-surface));
}
[data-vibeui-block="otp-004"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;line-height:1.4;color:var(--vibeui-otp-004-muted);
}
[data-vibeui-block="otp-004"] [data-part="foot"][data-bad="1"]{color:var(--vibeui-otp-004-bad)}
[data-vibeui-block="otp-004"] [data-part="left"]{
flex:none;font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="otp-004"] *{animation:none!important;transition:none!important}}
`

/**
 * Код подтверждения с честной ошибкой: красная рамка, встряска и счётчик попыток.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Otp004({
  label = "Код подтверждения",
  expected = "482913",
  attempts = 3,
  onSubmit,
  accent,
  className,
  style,
  ...props
}: Otp004Props) {
  const id = useId()
  const size = expected.length
  const [code, setCode] = useState<string[]>(Array(size).fill(""))
  const [bad, setBad] = useState(false)
  const [shakes, setShakes] = useState(0)
  const [left, setLeft] = useState(attempts)
  const boxes = useRef<(HTMLInputElement | null)[]>([])

  const palette = {
    ...(accent ? { "--vibeui-otp-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  const check = (digits: string[]) => {
    const value = digits.join("")
    if (value.length < size) return

    if (value === expected) {
      setBad(false)
      onSubmit?.(value)
      return
    }

    setBad(true)
    setShakes((was) => was + 1)
    setLeft((was) => Math.max(0, was - 1))
    setCode(Array(size).fill(""))
    boxes.current[0]?.focus()
  }

  const type = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1)
    const next = [...code]
    next[index] = digit
    setCode(next)
    setBad(false)
    if (digit && index < size - 1) boxes.current[index + 1]?.focus()
    check(next)
  }

  const paste = (event: ClipboardEvent<HTMLInputElement>) => {
    const digits = event.clipboardData.getData("text").replace(/\D/g, "")
    if (!digits) return
    event.preventDefault()
    const next = Array.from({ length: size }, (_, index) => digits[index] ?? "")
    setCode(next)
    setBad(false)
    check(next)
  }

  return (
    <>
      <style href="vibeui-otp-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="otp-004"
        className={className}
        style={palette}
        role="group"
        aria-labelledby={`${id}-label`}
      >
        <span data-part="label" id={`${id}-label`}>
          {label}
        </span>
        <div
          data-part="row"
          data-bad={bad ? "1" : "0"}
          data-shake={shakes % 2 === 0 ? "a" : "b"}
        >
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
              aria-label={`Цифра ${index + 1} из ${size}`}
              aria-invalid={bad}
              aria-describedby={`${id}-foot`}
              onChange={(event) => type(index, event.target.value)}
              onPaste={paste}
            />
          ))}
        </div>
        <p
          data-part="foot"
          id={`${id}-foot`}
          data-bad={bad ? "1" : "0"}
          aria-live="assertive"
        >
          <span>
            {bad
              ? left > 0
                ? "Код неверный. Проверьте последнее сообщение."
                : "Попытки кончились — запросите новый код."
              : `Введите шесть цифр из сообщения. Для примера подойдёт ${expected}.`}
          </span>
          <span data-part="left">
            {left} из {attempts}
          </span>
        </p>
      </div>
    </>
  )
}
