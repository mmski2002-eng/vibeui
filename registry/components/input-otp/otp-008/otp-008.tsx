"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Otp008Props = Omit<ComponentProps<"div">, "children" | "title"> & {
  title?: string
  hint?: string
  length?: number
  /** Код, который считается верным: демонстрация без сервера. */
  correctCode?: string
  checkingText?: string
  okText?: string
  errorText?: string
  /** Сколько миллисекунд «проверять»: имитация ответа сервера. */
  checkDelay?: number
  accent?: string
  /** Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: между вводом последней цифры и ответом сервера есть пауза,
// и в ней обычно не происходит ничего. Человек не понимает, принят код или он
// промахнулся, и жмёт цифры заново. Здесь пауза названа: поля запираются,
// подпись говорит «проверяем», а ответ приходит в то же место — туда, куда
// человек уже смотрит. Ошибка не стирает введённое: набирать шесть цифр
// заново из-за одной опечатки — наказание не по вине.
const STYLES = `
:where([data-vibeui-block="otp-008"]){
--vibeui-otp-008-bg:light-dark(oklch(0.99 0.002 265),oklch(0.23 0.014 265));
--vibeui-otp-008-fg:light-dark(oklch(0.25 0.014 265),oklch(0.95 0.005 265));
--vibeui-otp-008-muted:color-mix(in oklab,var(--vibeui-otp-008-fg) 62%,transparent);
--vibeui-otp-008-border:light-dark(oklch(0 0 0 / 16%),oklch(1 0 0 / 18%));
--vibeui-otp-008-cell:light-dark(oklch(1 0 0),oklch(1 0 0 / 6%));
--vibeui-otp-008-accent:light-dark(oklch(0.5 0.16 265),oklch(0.78 0.12 265));
--vibeui-otp-008-ok:light-dark(oklch(0.48 0.14 152),oklch(0.8 0.14 152));
--vibeui-otp-008-error:light-dark(oklch(0.55 0.19 25),oklch(0.79 0.15 25));
--vibeui-otp-008-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-otp-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="otp-008"]{color-scheme:dark}
[data-vibeui-block="otp-008"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы поле
   схлопывается в ниточку внутри flex-контейнера. */
min-width:min(100%,17rem);
max-width:20rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-otp-008-bg);
border:1px solid var(--vibeui-otp-008-border);border-radius:0.875rem;
font-family:var(--vibeui-otp-008-font);color:var(--vibeui-otp-008-fg);
}
[data-vibeui-block="otp-008"] *{box-sizing:border-box}
[data-vibeui-block="otp-008"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="otp-008"] [data-part="hint"]{
margin:0;font-size:0.8125rem;line-height:1.4;color:var(--vibeui-otp-008-muted);
}
[data-vibeui-block="otp-008"] [data-part="cells"]{
display:flex;gap:0.375rem;margin:0.125rem 0;
}
[data-vibeui-block="otp-008"] input{
flex:1;min-width:0;width:100%;height:2.75rem;padding:0;
border:1px solid var(--vibeui-otp-008-border);border-radius:0.625rem;
background:var(--vibeui-otp-008-cell);color:inherit;
font-family:var(--vibeui-otp-008-mono);font-size:1.125rem;text-align:center;
}
[data-vibeui-block="otp-008"] input:focus-visible{
outline:2px solid var(--vibeui-otp-008-accent);outline-offset:1px;
border-color:var(--vibeui-otp-008-accent);
}
/* Запертые поля во время проверки: повторное нажатие цифры ничего не даёт,
   и лучше это показать, чем принимать ввод в никуда. */
[data-vibeui-block="otp-008"] input:disabled{opacity:.7;cursor:progress}
[data-vibeui-block="otp-008"][data-state="error"] input{border-color:var(--vibeui-otp-008-error)}
[data-vibeui-block="otp-008"][data-state="ok"] input{border-color:var(--vibeui-otp-008-ok)}
[data-vibeui-block="otp-008"] [data-part="status"]{
display:flex;align-items:center;gap:0.375rem;min-height:1.25rem;
font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="otp-008"][data-state="checking"] [data-part="status"]{color:var(--vibeui-otp-008-muted)}
[data-vibeui-block="otp-008"][data-state="ok"] [data-part="status"]{color:var(--vibeui-otp-008-ok)}
[data-vibeui-block="otp-008"][data-state="error"] [data-part="status"]{color:var(--vibeui-otp-008-error)}
/* Кружок вращается только пока идёт проверка: анимация без причины
   отвлекает, а при выключенном движении заменяется точкой. */
[data-vibeui-block="otp-008"] [data-part="spinner"]{
width:0.875rem;height:0.875rem;flex:none;border-radius:50%;
border:2px solid color-mix(in oklab,var(--vibeui-otp-008-fg) 30%,transparent);
border-top-color:var(--vibeui-otp-008-accent);
animation:vibeui-otp-008-spin .7s linear infinite;
}
@keyframes vibeui-otp-008-spin{to{rotate:360deg}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="otp-008"] [data-part="spinner"]{animation:none;border-top-color:var(--vibeui-otp-008-accent)}
[data-vibeui-block="otp-008"] *{transition:none!important}
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

/**
 * Ввод кода с проверкой: пауза до ответа названа, ошибка не стирает набранное.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Otp008({
  title = "Код подтверждения",
  hint = "Введите код из сообщения. Для примера подойдёт 482913.",
  length = 6,
  correctCode = "482913",
  checkingText = "Проверяем код…",
  okText = "Код принят",
  errorText = "Код не подошёл. Проверьте последние цифры.",
  checkDelay = 1200,
  accent,
  background = "",
  className,
  style,
  ...props
}: Otp008Props) {
  const [digits, setDigits] = useState<string[]>(() =>
    Array.from({ length }, () => ""),
  )
  const [state, setState] = useState<"idle" | "checking" | "ok" | "error">(
    "idle",
  )
  const cells = useRef<(HTMLInputElement | null)[]>([])
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const check = (code: string) => {
    setState("checking")

    if (timer.current) clearTimeout(timer.current)

    timer.current = setTimeout(() => {
      // Ошибка не стирает набранное: править одну цифру проще, чем вводить
      // шесть заново.
      setState(code === correctCode ? "ok" : "error")
    }, checkDelay)
  }

  const put = (index: number, raw: string) => {
    const typed = raw.replace(/\D/g, "")

    if (typed === "") {
      const next = [...digits]
      next[index] = ""
      setDigits(next)
      setState("idle")
      return
    }

    const next = [...digits]

    // Вставка целиком раскладывается по клеткам: код из сообщения приходит
    // одной строкой, и разбивать её руками человек не должен.
    typed.split("").forEach((character, offset) => {
      if (index + offset < length) {
        next[index + offset] = character
      }
    })

    setDigits(next)

    const filled = Math.min(index + typed.length, length - 1)
    cells.current[filled]?.focus()

    const code = next.join("")

    if (code.length === length && !next.includes("")) {
      check(code)
    } else {
      setState("idle")
    }
  }

  const back = (index: number, key: string) => {
    if (key === "Backspace" && digits[index] === "" && index > 0) {
      cells.current[index - 1]?.focus()
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-otp-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-otp-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const status =
    state === "checking"
      ? checkingText
      : state === "ok"
        ? okText
        : state === "error"
          ? errorText
          : ""

  return (
    <>
      <style href="vibeui-otp-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input-otp"
        data-vibeui-block="otp-008"
        data-state={state}
        className={className}
        style={palette}
      >
        <p data-part="title">{title}</p>
        <p data-part="hint">{hint}</p>

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
              disabled={state === "checking" || state === "ok"}
              aria-label={`Цифра ${index + 1} из ${length}`}
              aria-invalid={state === "error" || undefined}
              onChange={(event) => put(index, event.target.value)}
              onKeyDown={(event) => back(index, event.key)}
            />
          ))}
        </div>

        {/* Ответ приходит туда, куда человек уже смотрит, и объявляется
            вслух: смена подписи без aria-live для скринридера не событие. */}
        <p data-part="status" aria-live="polite">
          {state === "checking" ? (
            <span data-part="spinner" aria-hidden="true" />
          ) : null}
          {status}
        </p>
      </div>
    </>
  )
}
