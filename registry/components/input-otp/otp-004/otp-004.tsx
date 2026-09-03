"use client"

import { useId, useRef, useState } from "react"
import type { ClipboardEvent, ComponentProps, CSSProperties } from "react"

export type Otp004Props = Omit<
  ComponentProps<"div">,
  "children" | "onSubmit"
> & {
  label?: string
  expected?: string
  attempts?: number
  /** Подпись клетки для screen reader: {index} — номер, {total} — всего. */
  digitLabel?: string
  /** Подсказка до первой ошибки: {code} — код из пропа expected. */
  hintText?: string
  /** Сообщение о неверном коде, пока попытки ещё остались. */
  errorText?: string
  /** Сообщение, когда попытки кончились. */
  lockedText?: string
  /** Счётчик попыток: {left} — осталось, {total} — всего. */
  attemptsText?: string
  onSubmit?: (code: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
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
--vibeui-otp-004-bg:transparent;
--vibeui-otp-004-surface:light-dark(oklch(1 0 0),oklch(0.26 0.014 265));
--vibeui-otp-004-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-otp-004-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-otp-004-muted:color-mix(in oklab,var(--vibeui-otp-004-fg) 68%,transparent);
--vibeui-otp-004-field:light-dark(oklch(0.98 0.002 265),oklch(0.26 0.014 265));
--vibeui-otp-004-border:light-dark(oklch(0.87 0.008 265),oklch(0.42 0.014 265));
--vibeui-otp-004-accent:light-dark(oklch(0.52 0.18 285),oklch(0.74 0.16 285));
--vibeui-otp-004-bad:light-dark(oklch(0.55 0.21 25),oklch(0.72 0.17 25));
--vibeui-otp-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="otp-004"]{color-scheme:dark}
[data-vibeui-block="otp-004"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы поле
   схлопывается в ниточку внутри flex-контейнера. */
min-width:min(100%,17rem);max-width:21rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-otp-004-bg);
border:1px solid var(--vibeui-otp-004-shell);border-radius:0.875rem;
font-family:var(--vibeui-otp-004-font);color:var(--vibeui-otp-004-fg);
}
[data-vibeui-block="otp-004"] *{box-sizing:border-box}
[data-vibeui-block="otp-004"] [data-part="label"]{font-size:0.9375rem;font-weight:600}
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
flex-wrap:wrap;margin:0;
font-size:0.875rem;line-height:1.4;color:var(--vibeui-otp-004-muted);
}
[data-vibeui-block="otp-004"] [data-part="foot"][data-bad="1"]{color:var(--vibeui-otp-004-bad)}
[data-vibeui-block="otp-004"] [data-part="left"]{
flex:none;font-variant-numeric:tabular-nums;
}
/* Шкала категории. Порог 19rem, а не 32rem: карточка упёрта в max-width:21rem. */
@container (min-width: 19rem){
[data-vibeui-block="otp-004"] [data-part="label"]{font-size:1rem}
[data-vibeui-block="otp-004"] [data-part="foot"]{font-size:0.9375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="otp-004"] *{animation:none!important;transition:none!important}}
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
 * Код подтверждения с честной ошибкой: красная рамка, встряска и счётчик попыток.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Otp004({
  label = "Код подтверждения",
  expected = "482913",
  attempts = 3,
  digitLabel = "Цифра {index} из {total}",
  hintText = "Введите код из сообщения. Для примера подойдёт {code}.",
  errorText = "Код неверный. Проверьте последнее сообщение.",
  lockedText = "Попытки кончились — запросите новый код.",
  attemptsText = "{left} из {total}",
  onSubmit,
  background = "",
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
    ...(background
      ? {
          "--vibeui-otp-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const digitName = (index: number) =>
    digitLabel
      .replace("{index}", String(index + 1))
      .replace("{total}", String(size))

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
        data-slot="input-otp"
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
              aria-label={digitName(index)}
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
                ? errorText
                : lockedText
              : hintText.replace("{code}", expected)}
          </span>
          <span data-part="left">
            {attemptsText
              .replace("{left}", String(left))
              .replace("{total}", String(attempts))}
          </span>
        </p>
      </div>
    </>
  )
}
