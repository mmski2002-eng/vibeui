"use client"

import { useRef, useState } from "react"
import type { ClipboardEvent, KeyboardEvent, CSSProperties } from "react"

export type Auth004Props = {
  title?: string
  lead?: string
  length?: number
  submit?: string
  resend?: string
  help?: string
  /** Адрес, на который ушёл код. */
  email?: string
  /** Подпись клетки; {index} и {total} подставляются числами. */
  digitLabel?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: подтверждение кодом из письма. Код набирают по клеткам, но
// вставка целиком обязана работать: человек копирует код из письма, а не
// перепечатывает по цифре. Поэтому обработчик вставки раскладывает строку по
// полям сам. Backspace на пустой клетке возвращает к предыдущей, иначе
// исправить опечатку можно только мышью. Каждому полю задан inputMode numeric
// и autoComplete one-time-code: телефон подставит код из СМС сам.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе с контекстом и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="auth-004"]){
--vibeui-auth-004-bg:transparent;
--vibeui-auth-004-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-auth-004-muted:light-dark(oklch(0.55 0.014 265),oklch(0.69 0.013 265));
--vibeui-auth-004-border:light-dark(oklch(0.88 0.008 265),oklch(0.36 0.012 265));
--vibeui-auth-004-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-auth-004-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.02 265));
--vibeui-auth-004-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-auth-004-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auth-004"]{color-scheme:dark}
[data-vibeui-block="auth-004"]{
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:23rem;box-sizing:border-box;padding:1.25rem;
background:var(--vibeui-auth-004-bg);
border:1px solid var(--vibeui-auth-004-border);border-radius:1rem;
font-family:var(--vibeui-auth-004-sans);color:var(--vibeui-auth-004-fg);
text-align:center;
}
[data-vibeui-block="auth-004"] *{box-sizing:border-box}
[data-vibeui-block="auth-004"] h2{margin:0 0 0.25rem;font-size:1.1875rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="auth-004"] [data-part="lead"]{
margin:0 auto 1rem;max-width:20rem;
font-size:0.8125rem;line-height:1.55;color:var(--vibeui-auth-004-muted);
}
[data-vibeui-block="auth-004"] [data-part="mail"]{font-weight:650;color:var(--vibeui-auth-004-fg)}
[data-vibeui-block="auth-004"] [data-part="cells"]{
display:flex;justify-content:center;gap:0.375rem;margin-bottom:0.875rem;
}
/* Клетки моноширинные: цифры одной ширины не пляшут при вводе. */
[data-vibeui-block="auth-004"] input{
width:2.5rem;height:3rem;padding:0;text-align:center;
border:1px solid var(--vibeui-auth-004-border);border-radius:0.625rem;
background:var(--vibeui-auth-004-bg);color:inherit;
font-family:var(--vibeui-auth-004-mono);font-size:1.125rem;font-weight:650;
}
[data-vibeui-block="auth-004"] input:focus-visible{
outline:2px solid var(--vibeui-auth-004-accent);outline-offset:1px;
border-color:var(--vibeui-auth-004-accent);
}
[data-vibeui-block="auth-004"] [data-part="submit"]{
width:100%;appearance:none;cursor:pointer;height:2.625rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-auth-004-accent);color:var(--vibeui-auth-004-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="auth-004"] [data-part="submit"]:disabled{opacity:.5;cursor:default}
[data-vibeui-block="auth-004"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-auth-004-accent);outline-offset:2px}
[data-vibeui-block="auth-004"] [data-part="resend"]{
margin-top:0.75rem;appearance:none;border:0;background:none;cursor:pointer;
color:var(--vibeui-auth-004-accent);font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="auth-004"] [data-part="resend"]:focus-visible{outline:2px solid var(--vibeui-auth-004-accent);outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="auth-004"] [data-part="help"]{
margin:0.75rem 0 0;font-size:0.6875rem;line-height:1.45;color:var(--vibeui-auth-004-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-004"] *{animation:none!important;transition:none!important}}
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
 * Подтверждение кодом: вставка целиком раскладывается по клеткам.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Auth004({
  title = "Подтвердите вход",
  lead = "Код из шести цифр отправлен на",
  length = 6,
  submit = "Подтвердить",
  resend = "Отправить код заново",
  help = "Письмо приходит за минуту. Проверьте папку со спамом, если его нет.",
  email = "anna@vibeui.ru",
  digitLabel = "Цифра {index} из {total}",
  background = "",
  accent,
  className,
  style,
}: Auth004Props) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""))
  const cells = useRef<(HTMLInputElement | null)[]>([])
  // Клетки считаются от length, а не от состояния: смена длины кода не
  // должна ждать пересоздания компонента.
  const values = Array.from({ length }, (_, index) => digits[index] ?? "")
  const filled = values.every((digit) => digit !== "")

  const put = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1)
    setDigits((current) => {
      const next = [...current]
      next[index] = digit
      return next
    })
    if (digit) cells.current[index + 1]?.focus()
  }

  // Backspace на пустой клетке возвращает назад: иначе опечатку правят мышью.
  const onKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Backspace" || digits[index]) return
    event.preventDefault()
    cells.current[index - 1]?.focus()
    setDigits((current) => {
      const next = [...current]
      next[Math.max(index - 1, 0)] = ""
      return next
    })
  }

  // Код копируют из письма целиком — вставка обязана раскладываться по клеткам.
  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const text = event.clipboardData.getData("text").replace(/\D/g, "")
    if (!text) return
    event.preventDefault()
    const next = Array(length)
      .fill("")
      .map((_, index) => text[index] ?? "")
    setDigits(next)
    cells.current[Math.min(text.length, length - 1)]?.focus()
  }

  const palette = {
    ...(accent ? { "--vibeui-auth-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-auth-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-004"
        className={className}
        style={palette}
        aria-label={title}
      >
        <h2>{title}</h2>
        <p data-part="lead">
          {lead} <span data-part="mail">{email}</span>
        </p>

        <div data-part="cells">
          {values.map((digit, index) => (
            <input
              key={index}
              ref={(node) => {
                cells.current[index] = node
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              aria-label={digitLabel
                .replace("{index}", String(index + 1))
                .replace("{total}", String(length))}
              onChange={(event) => put(index, event.target.value)}
              onKeyDown={(event) => onKeyDown(index, event)}
              onPaste={onPaste}
            />
          ))}
        </div>

        <button type="button" data-part="submit" disabled={!filled}>
          {submit}
        </button>
        <button type="button" data-part="resend">
          {resend}
        </button>
        <p data-part="help">{help}</p>
      </section>
    </>
  )
}
