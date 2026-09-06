"use client"

import { useEffect, useId, useRef, useState } from "react"
import type {
  ClipboardEvent,
  ComponentProps,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Otp011Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  length?: number
  hint?: string
  /** Подпись клетки для screen reader: {index} — номер, {total} — всего. */
  digitLabel?: string
  /** Сколько цифра видна перед тем, как стать точкой, в миллисекундах. */
  revealMs?: number
  onChange?: (code: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: так набирают код в системных полях iOS и Android —
// цифра на миг видна, чтобы проверить, что нажал не туда пальцем, а затем
// сама становится точкой. Никакой кнопки «показать»: маскировка происходит
// без участия пользователя, а таймер каждой клетки живёт независимо —
// быстрый ввод не даёт соседним цифрам одновременно погаснуть.
const STYLES = `
:where([data-vibeui-block="otp-011"]){
--vibeui-otp-011-bg:transparent;
--vibeui-otp-011-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-otp-011-muted:color-mix(in oklab,var(--vibeui-otp-011-fg) 68%,transparent);
--vibeui-otp-011-border:light-dark(oklch(0.88 0 265),oklch(0.42 0 265));
--vibeui-otp-011-field:light-dark(oklch(0.985 0 265),oklch(0.27 0 265));
--vibeui-otp-011-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-otp-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="otp-011"]{color-scheme:dark}
[data-vibeui-block="otp-011"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы поле
   схлопывается в ниточку внутри flex-контейнера. */
min-width:min(100%,17rem);max-width:20rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-otp-011-bg);
border:1px solid var(--vibeui-otp-011-border);border-radius:0.875rem;
font-family:var(--vibeui-otp-011-font);color:var(--vibeui-otp-011-fg);
}
[data-vibeui-block="otp-011"] *{box-sizing:border-box}
[data-vibeui-block="otp-011"] [data-part="label"]{font-size:0.9375rem;font-weight:600}
[data-vibeui-block="otp-011"] [data-part="row"]{display:flex;gap:0.375rem}
[data-vibeui-block="otp-011"] [data-part="cell"]{position:relative;flex:1;min-width:0}
[data-vibeui-block="otp-011"] input{
width:100%;height:3rem;padding:0;box-sizing:border-box;
border:1.5px solid var(--vibeui-otp-011-border);border-radius:0.625rem;
background:var(--vibeui-otp-011-field);color:transparent;caret-color:transparent;
font:inherit;font-size:1.125rem;font-weight:650;text-align:center;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="otp-011"] input:focus-visible{
outline:2px solid var(--vibeui-otp-011-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="otp-011"] input:not(:placeholder-shown){border-color:var(--vibeui-otp-011-accent)}
/* Значение клетки рисует не сам input — цвет текста у него прозрачный, —
   а этот слой поверх. Так цифра управляется независимо: показана или
   заменена точкой, пока input хранит настоящее значение для форм и autofill. */
[data-vibeui-block="otp-011"] [data-part="face"]{
position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
pointer-events:none;font-size:1.125rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="otp-011"] [data-part="face"][data-shown="0"]{font-size:1.5rem;line-height:1}
[data-vibeui-block="otp-011"] [data-part="hint"]{font-size:0.875rem;line-height:1.4;color:var(--vibeui-otp-011-muted)}
/* Шкала категории: в узкой колонке подпись и подсказка мельче. Порог 19rem, а
   не 32rem, — карточка упёрта в max-width:20rem и шире не бывает. */
@container (min-width: 19rem){
[data-vibeui-block="otp-011"] [data-part="label"]{font-size:1rem}
[data-vibeui-block="otp-011"] [data-part="hint"]{font-size:0.9375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="otp-011"] *{animation:none!important;transition:none!important}}
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
 * Код подтверждения с клетками, как в системных полях телефона: только что
 * набранная цифра видна долю секунды, а затем сама становится точкой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Otp011({
  label = "Код из СМС",
  length = 6,
  hint = "Каждая цифра на миг видна перед тем, как скрыться.",
  digitLabel = "Цифра {index} из {total}",
  revealMs = 700,
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Otp011Props) {
  const id = useId()
  const size = Math.max(4, Math.min(8, length))
  const [code, setCode] = useState<string[]>(Array(size).fill(""))
  const [shown, setShown] = useState<boolean[]>(Array(size).fill(false))
  const boxes = useRef<(HTMLInputElement | null)[]>([])
  const timers = useRef<Array<ReturnType<typeof setTimeout> | undefined>>([])

  useEffect(() => {
    const list = timers.current
    return () => {
      list.forEach((timer) => timer && clearTimeout(timer))
    }
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-otp-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-otp-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const digitName = (index: number) =>
    digitLabel
      .replace("{index}", String(index + 1))
      .replace("{total}", String(size))

  const reveal = (index: number) => {
    setShown((was) => was.map((value, position) => (position === index ? true : value)))
    clearTimeout(timers.current[index])
    timers.current[index] = setTimeout(() => {
      setShown((was) => was.map((value, position) => (position === index ? false : value)))
    }, revealMs)
  }

  const push = (next: string[]) => {
    setCode(next)
    onChange?.(next.join(""))
  }

  const type = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1)
    const next = [...code]
    next[index] = digit
    push(next)
    if (digit) {
      reveal(index)
      if (index < size - 1) boxes.current[index + 1]?.focus()
    } else {
      clearTimeout(timers.current[index])
      setShown((was) => was.map((value, position) => (position === index ? false : value)))
    }
  }

  // Вставка целиком: код копируют из сообщения, и раскладывать его руками
  // по клеткам никто не станет. Каждая клетка получает свой таймер маски.
  const paste = (event: ClipboardEvent<HTMLInputElement>) => {
    const digits = event.clipboardData.getData("text").replace(/\D/g, "")
    if (!digits) return
    event.preventDefault()
    const next = Array.from({ length: size }, (_, index) => digits[index] ?? "")
    push(next)
    next.forEach((digit, index) => {
      if (digit) reveal(index)
    })
    boxes.current[Math.min(digits.length, size - 1)]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      event.preventDefault()
      boxes.current[index - 1]?.focus()
      const next = [...code]
      next[index - 1] = ""
      push(next)
      clearTimeout(timers.current[index - 1])
      setShown((was) => was.map((value, position) => (position === index - 1 ? false : value)))
    } else if (event.key === "ArrowLeft" && index > 0) {
      boxes.current[index - 1]?.focus()
    } else if (event.key === "ArrowRight" && index < size - 1) {
      boxes.current[index + 1]?.focus()
    }
  }

  return (
    <>
      <style href="vibeui-otp-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input-otp"
        data-vibeui-block="otp-011"
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
            <div data-part="cell" key={index}>
              <input
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
              <span data-part="face" data-shown={shown[index] ? "1" : "0"} aria-hidden="true">
                {digit ? (shown[index] ? digit : "•") : ""}
              </span>
            </div>
          ))}
        </div>
        {hint ? <span data-part="hint">{hint}</span> : null}
      </div>
    </>
  )
}
