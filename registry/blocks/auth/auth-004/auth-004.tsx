"use client"

import { useRef, useState } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button001 } from "@/registry/components/button/button-001/button-001"

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
--vibeui-auth-004-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-auth-004-muted:light-dark(oklch(0.55 0 265),oklch(0.69 0 265));
--vibeui-auth-004-border:light-dark(oklch(0.88 0 265),oklch(0.36 0 265));
--vibeui-auth-004-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-auth-004-on-accent:oklch(from var(--vibeui-auth-004-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
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
min-width:min(100%,16rem);max-width:23rem;margin-inline:auto;box-sizing:border-box;padding:1.25rem;
background:var(--vibeui-auth-004-bg);
border:1px solid var(--vibeui-auth-004-border);border-radius:1rem;
font-family:var(--vibeui-auth-004-sans);color:var(--vibeui-auth-004-fg);
text-align:center;
}
[data-vibeui-block="auth-004"] *{box-sizing:border-box}
[data-vibeui-block="auth-004"] [data-part="heading"]{margin-bottom:0.25rem}
[data-vibeui-block="auth-004"] [data-part="submit"]{width:100%}
[data-vibeui-block="auth-004"] [data-part="resend"]{margin-top:0.75rem}
[data-vibeui-block="auth-004"] [data-part="lead"]{
margin:0 auto 1rem;max-width:20rem;
font-size:0.8125rem;line-height:1.55;color:var(--vibeui-auth-004-muted);
}
[data-vibeui-block="auth-004"] [data-part="mail"]{font-weight:650;color:var(--vibeui-auth-004-fg)}
[data-vibeui-block="auth-004"] [data-part="cells"]{
display:flex;justify-content:center;gap:0.375rem;margin-bottom:0.875rem;
}
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
        <Heading001
          data-part="heading"
          title={title}
          size="xs"
          accent={accent}
        />
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

        <Button001 data-part="submit" type="button" disabled={!filled} size="lg" tone="solid" accent={accent}>
          {submit}
        </Button001>
        <Button001 data-part="resend" type="button" tone="outline" accent={accent}>
          {resend}
        </Button001>
        <p data-part="help">{help}</p>
      </section>
    </>
  )
}
