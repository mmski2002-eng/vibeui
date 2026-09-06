"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Toast013Props = Omit<ComponentProps<"div">, "children"> & {
  message?: string
  /** Текст после возврата: компонент несёт русский, проект подставляет свой. */
  returnedMessage?: string
  returnLabel?: string
  expiredText?: string
  /** Шаблон обратного отсчёта, {seconds} — оставшиеся секунды. */
  countdownText?: string
  /** Сколько секунд можно передумать. */
  seconds?: number
  /** Цвет кольца и кнопки. Пусто — штатная палитра. */
  tone?: string
  /** Подложка карточки. Пусто — штатная палитра. */
  background?: string
  onReturn?: () => void
  onExpire?: () => void
}

// Идея компонента: пачечное действие с отменой, у которой видно не полосу,
// а число. Кольцо тает по кругу и в центре считает секунды — так понятно,
// сколько ещё есть времени, не отвлекаясь на линию где-то с краю карточки.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// подложка светлее фона страницы, а граница светлее подложки — иначе карточка
// растворилась бы в тёмной странице.
const STYLES = `
:where([data-vibeui-block="toast-013"]){
--vibeui-toast-013-bg:light-dark(oklch(0.99 0 265),oklch(0.25 0 265));
--vibeui-toast-013-fg:light-dark(oklch(0.24 0 265),oklch(0.97 0 265));
--vibeui-toast-013-muted:color-mix(in oklab,var(--vibeui-toast-013-fg) 68%,transparent);
--vibeui-toast-013-line:light-dark(oklch(0.9 0 265),oklch(0.38 0 265));
--vibeui-toast-013-track:light-dark(oklch(0.2 0 265 / 14%),oklch(1 0 0 / 20%));
--vibeui-toast-013-key:light-dark(oklch(0.2 0 265 / 7%),oklch(1 0 0 / 12%));
--vibeui-toast-013-key-hover:light-dark(oklch(0.2 0 265 / 12%),oklch(1 0 0 / 18%));
--vibeui-toast-013-shadow:light-dark(oklch(0.55 0 265 / 20%),oklch(0.12 0 265 / 62%));
--vibeui-toast-013-tone:light-dark(oklch(0.5 0.12 39.8),oklch(0.78 0.14 39.8));
--vibeui-toast-013-percent:100;
--vibeui-toast-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toast-013"]{color-scheme:dark}
[data-vibeui-block="toast-013"]{
display:flex;align-items:center;gap:0.75rem;
width:100%;max-width:23rem;box-sizing:border-box;
padding:0.75rem 0.875rem;border-radius:0.75rem;
border:1px solid var(--vibeui-toast-013-line);
background:var(--vibeui-toast-013-bg);color:var(--vibeui-toast-013-fg);
font-family:var(--vibeui-toast-013-font);
box-shadow:0 18px 40px -22px var(--vibeui-toast-013-shadow);
}
/* Кольцо-таймер: конический градиент по проценту, число — поверх него. */
[data-vibeui-block="toast-013"] [data-part="ring"]{
position:relative;flex:none;width:2rem;height:2rem;border-radius:9999px;
background:conic-gradient(
  var(--vibeui-toast-013-tone) calc(var(--vibeui-toast-013-percent) * 1%),
  var(--vibeui-toast-013-track) 0
);
transition:background .2s linear;
}
[data-vibeui-block="toast-013"] [data-part="ring"]::before{
content:"";position:absolute;inset:0.1875rem;border-radius:inherit;
background:var(--vibeui-toast-013-bg);
}
[data-vibeui-block="toast-013"] [data-part="ring-value"]{
position:relative;z-index:1;display:flex;height:100%;width:100%;
align-items:center;justify-content:center;
font-size:0.6875rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="toast-013"] [data-part="text"]{flex:1;min-width:0;font-size:0.875rem;line-height:1.35}
[data-vibeui-block="toast-013"] [data-part="sub"]{display:block;margin-top:0.125rem;font-size:0.75rem;color:var(--vibeui-toast-013-muted)}
[data-vibeui-block="toast-013"] button{
appearance:none;cursor:pointer;flex:none;
height:2rem;padding:0 0.75rem;border:0;border-radius:0.5rem;
background:var(--vibeui-toast-013-key);color:var(--vibeui-toast-013-tone);
font:inherit;font-size:0.8125rem;font-weight:700;
}
[data-vibeui-block="toast-013"] button:hover{background:var(--vibeui-toast-013-key-hover)}
[data-vibeui-block="toast-013"] button:focus-visible{outline:2px solid var(--vibeui-toast-013-tone);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-013"] *{animation:none!important;transition:none!important}}
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
 * Пачечная отмена: кольцевой таймер с числом секунд и кнопка «Вернуть».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast013({
  message = "5 писем перемещены в архив",
  returnedMessage = "Письма возвращены из архива",
  returnLabel = "Вернуть",
  expiredText = "Время вышло",
  countdownText = "Отменить можно ещё {seconds} с",
  seconds = 6,
  tone = "",
  background = "",
  onReturn,
  onExpire,
  className,
  style,
  ...props
}: Toast013Props) {
  const [left, setLeft] = useState(seconds * 1000)
  const [returned, setReturned] = useState(false)
  const paused = useRef(false)
  const expiredRef = useRef(false)

  useEffect(() => {
    if (returned) return

    const timer = setInterval(() => {
      if (paused.current) return

      setLeft((value) => Math.max(0, value - 100))
    }, 100)

    return () => clearInterval(timer)
  }, [returned])

  useEffect(() => {
    if (left === 0 && !returned && !expiredRef.current) {
      expiredRef.current = true
      onExpire?.()
    }
  }, [left, returned, onExpire])

  const total = seconds * 1000
  const percent = total > 0 ? (left / total) * 100 : 0
  const secondsLeft = Math.ceil(left / 1000)
  const expired = left === 0

  const palette = {
    "--vibeui-toast-013-percent": percent,
    ...(tone ? { "--vibeui-toast-013-tone": tone } : null),
    ...(background
      ? {
          "--vibeui-toast-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toast-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="toast"
        data-vibeui-block="toast-013"
        role="status"
        aria-live="polite"
        className={className}
        style={palette}
        onMouseEnter={() => {
          paused.current = true
        }}
        onMouseLeave={() => {
          paused.current = false
        }}
        onFocusCapture={() => {
          paused.current = true
        }}
        onBlurCapture={() => {
          paused.current = false
        }}
      >
        <span data-part="ring" aria-hidden="true">
          <span data-part="ring-value">
            {returned ? "✓" : expired ? "" : secondsLeft}
          </span>
        </span>
        <span data-part="text">
          {returned ? returnedMessage : message}
          {!returned ? (
            <span data-part="sub">
              {expired
                ? expiredText
                : countdownText.replace("{seconds}", String(secondsLeft))}
            </span>
          ) : null}
        </span>
        {!returned && !expired ? (
          <button
            type="button"
            onClick={() => {
              setReturned(true)
              onReturn?.()
            }}
          >
            {returnLabel}
          </button>
        ) : null}
      </div>
    </>
  )
}
