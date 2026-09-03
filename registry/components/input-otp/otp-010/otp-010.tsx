"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Otp010Props = Omit<ComponentProps<"div">, "children" | "title"> & {
  title?: string
  length?: number
  /** Сколько секунд живёт код. */
  seconds?: number
  /** Подпись остатка. {time} — оставшееся время. */
  leftTemplate?: string
  expiredText?: string
  renewLabel?: string
  accent?: string
  /** Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: у кода из письма есть срок, и обычно про него узнают уже
// после отказа. Здесь остаток виден с самого начала — полосой и цифрами: до
// минуты человек ещё успевает сходить за письмом, после — понимает, почему
// код не подошёл. Когда время вышло, поля не просто гаснут: они запираются, а
// на месте таймера появляется кнопка нового кода, потому что вводить старый
// уже бессмысленно. Полоса нужна не ради украшения — цифры без неё читают
// не все, а полоса без цифр не даёт точности.
const STYLES = `
:where([data-vibeui-block="otp-010"]){
--vibeui-otp-010-bg:light-dark(oklch(0.99 0.002 265),oklch(0.23 0.014 265));
--vibeui-otp-010-fg:light-dark(oklch(0.25 0.014 265),oklch(0.95 0.005 265));
--vibeui-otp-010-muted:color-mix(in oklab,var(--vibeui-otp-010-fg) 62%,transparent);
--vibeui-otp-010-border:light-dark(oklch(0 0 0 / 16%),oklch(1 0 0 / 18%));
--vibeui-otp-010-cell:light-dark(oklch(1 0 0),oklch(1 0 0 / 6%));
--vibeui-otp-010-track:light-dark(oklch(0 0 0 / 10%),oklch(1 0 0 / 14%));
--vibeui-otp-010-accent:light-dark(oklch(0.5 0.16 265),oklch(0.78 0.12 265));
--vibeui-otp-010-alarm:light-dark(oklch(0.58 0.17 45),oklch(0.82 0.14 55));
--vibeui-otp-010-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-otp-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="otp-010"]{color-scheme:dark}
[data-vibeui-block="otp-010"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы поле
   схлопывается в ниточку внутри flex-контейнера. */
min-width:min(100%,17rem);
max-width:20rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-otp-010-bg);
border:1px solid var(--vibeui-otp-010-border);border-radius:0.875rem;
font-family:var(--vibeui-otp-010-font);color:var(--vibeui-otp-010-fg);
}
[data-vibeui-block="otp-010"] *{box-sizing:border-box}
[data-vibeui-block="otp-010"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="otp-010"] [data-part="cells"]{display:flex;gap:0.375rem;margin:0.125rem 0}
[data-vibeui-block="otp-010"] input{
flex:1;min-width:0;width:100%;height:2.75rem;padding:0;
border:1px solid var(--vibeui-otp-010-border);border-radius:0.625rem;
background:var(--vibeui-otp-010-cell);color:inherit;
font-family:var(--vibeui-otp-010-mono);font-size:1.125rem;text-align:center;
}
[data-vibeui-block="otp-010"] input:focus-visible{
outline:2px solid var(--vibeui-otp-010-accent);outline-offset:1px;
border-color:var(--vibeui-otp-010-accent);
}
/* Истёкший код нельзя дослать: поля запираются, чтобы человек не тратил
   время на ввод того, что уже не примут. */
[data-vibeui-block="otp-010"] input:disabled{
opacity:.55;cursor:not-allowed;
}
[data-vibeui-block="otp-010"] [data-part="track"]{
height:0.25rem;border-radius:999px;overflow:hidden;
background:var(--vibeui-otp-010-track);
}
[data-vibeui-block="otp-010"] [data-part="fill"]{
display:block;height:100%;border-radius:inherit;
background:var(--vibeui-otp-010-accent);
transition:width 1s linear;
}
[data-vibeui-block="otp-010"][data-alarm="true"] [data-part="fill"]{background:var(--vibeui-otp-010-alarm)}
[data-vibeui-block="otp-010"] [data-part="foot"]{
display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.5rem;
min-height:1.75rem;
}
[data-vibeui-block="otp-010"] [data-part="left"]{
font-size:0.8125rem;color:var(--vibeui-otp-010-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="otp-010"][data-alarm="true"] [data-part="left"]{color:var(--vibeui-otp-010-alarm);font-weight:600}
[data-vibeui-block="otp-010"] [data-part="renew"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:1.875rem;padding:0.25rem 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-otp-010-accent);
background:transparent;color:var(--vibeui-otp-010-accent);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="otp-010"] [data-part="renew"]:focus-visible{outline:2px solid var(--vibeui-otp-010-accent);outline-offset:2px}
[data-vibeui-block="otp-010"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="otp-010"] [data-part="fill"]{transition:none}
[data-vibeui-block="otp-010"] *{animation:none!important}
}
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

/** Секунды в вид «2:05»: с ведущим нулём у секунд и без него у минут. */
function clock(total: number): string {
  const minutes = Math.floor(total / 60)
  const seconds = total % 60

  return `${minutes}:${String(seconds).padStart(2, "0")}`
}

/**
 * Код со сроком действия: остаток виден полосой и цифрами, истёкший заперт.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Otp010({
  title = "Код из письма",
  length = 6,
  seconds = 150,
  leftTemplate = "Код действует ещё {time}",
  expiredText = "Срок кода истёк",
  renewLabel = "Новый код",
  accent,
  background = "",
  className,
  style,
  ...props
}: Otp010Props) {
  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length }, () => ""),
  )
  const [left, setLeft] = useState(seconds)
  const cells = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (left <= 0) {
      return
    }

    const timer = setInterval(() => {
      setLeft((value) => (value <= 1 ? 0 : value - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [left])

  const put = (index: number, raw: string) => {
    const typed = raw.replace(/\D/g, "")
    const next = [...digits]

    if (typed === "") {
      next[index] = ""
      setDigits(next)
      return
    }

    typed.split("").forEach((character, offset) => {
      if (index + offset < length) {
        next[index + offset] = character
      }
    })

    setDigits(next)
    cells.current[Math.min(index + typed.length, length - 1)]?.focus()
  }

  const back = (index: number, key: string) => {
    if (key === "Backspace" && digits[index] === "" && index > 0) {
      cells.current[index - 1]?.focus()
    }
  }

  const renew = () => {
    setDigits(Array.from({ length }, () => ""))
    setLeft(seconds)
    cells.current[0]?.focus()
  }

  const palette = {
    ...(accent ? { "--vibeui-otp-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-otp-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const expired = left <= 0
  // Тревожный цвет за полминуты: раньше он кричит впустую, позже — уже поздно.
  const alarm = !expired && left <= 30
  const percent = Math.max(0, Math.round((left / Math.max(seconds, 1)) * 100))

  return (
    <>
      <style href="vibeui-otp-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input-otp"
        data-vibeui-block="otp-010"
        data-alarm={alarm || undefined}
        className={className}
        style={palette}
      >
        <p data-part="title">{title}</p>

        <div data-part="cells">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(node) => {
                cells.current[index] = node
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={length}
              value={digit}
              disabled={expired}
              aria-label={`Цифра ${index + 1} из ${length}`}
              onChange={(event) => put(index, event.target.value)}
              onKeyDown={(event) => back(index, event.key)}
            />
          ))}
        </div>

        {/* Полоса — то же число, что и в подписи: одна даёт мгновенную
            оценку, другая точность. Вслух объявляется только подпись. */}
        <span data-part="track" aria-hidden="true">
          <span data-part="fill" style={{ width: `${percent}%` }} />
        </span>

        <div data-part="foot">
          {/* Бегущие секунды вслух не читаются: aria-live превратил бы
              поле в непрерывную речь. Объявляется только истечение. */}
          <span data-part="left">
            {expired ? expiredText : leftTemplate.replace("{time}", clock(left))}
          </span>
          <span data-part="sr" aria-live="polite">
            {expired ? expiredText : ""}
          </span>
          {expired ? (
            <button type="button" data-part="renew" onClick={renew}>
              {renewLabel}
            </button>
          ) : null}
        </div>
      </div>
    </>
  )
}
