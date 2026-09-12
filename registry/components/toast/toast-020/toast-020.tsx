"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Toast020Props = Omit<ComponentProps<"div">, "children"> & {
  message?: string
  expiredMessage?: string
  extendLabel?: string
  closeLabel?: string
  /** Приписка к таймеру на паузе. */
  pausedText?: string
  /** Цвет полосы, таймера и кнопки. Пусто — штатная палитра. */
  tone?: string
  /** Подложка карточки. Пусто — штатная палитра. */
  background?: string
  /** Сколько секунд идёт обратный отсчёт до автодействия. */
  seconds?: number
  onExpire?: () => void
  onExtend?: () => void
}

// Идея компонента: автодействие, которое можно отложить, но не выключить
// незаметно. Полоса и цифры отсчитывают время вместе, наведение (и фокус
// клавиатурой) ставит отсчёт на паузу — читать уведомление важнее, чем
// уложиться в изначальный срок, а кнопка «Остаться» перезапускает отсчёт
// заново, а не просто гасит уведомление.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// подложка светлее фона страницы, граница светлее подложки, а дорожка полосы
// темнее подложки — иначе пустая часть полосы читалась бы как заполненная.
const STYLES = `
:where([data-vibeui-block="toast-020"]){
--vibeui-toast-020-bg:light-dark(oklch(0.99 0 265),oklch(0.25 0 265));
--vibeui-toast-020-fg:light-dark(oklch(0.22 0 265),oklch(0.96 0 265));
--vibeui-toast-020-muted:color-mix(in oklab,var(--vibeui-toast-020-fg) 68%,transparent);
--vibeui-toast-020-border:light-dark(oklch(0.9 0 265),oklch(0.38 0 265));
--vibeui-toast-020-track:light-dark(oklch(0.92 0 265),oklch(0.33 0 265));
--vibeui-toast-020-hover:light-dark(oklch(0.2 0 265 / 7%),oklch(1 0 0 / 12%));
--vibeui-toast-020-shadow:light-dark(oklch(0.18 0 265 / 55%),oklch(0.05 0 265 / 70%));
--vibeui-toast-020-tone:light-dark(oklch(0.295 0 0),oklch(0.906 0 0));
--vibeui-toast-020-on-tone:light-dark(oklch(0.99 0 265),oklch(0.2 0 0));
--vibeui-toast-020-paused-text:" · пауза";
--vibeui-toast-020-percent:100;
--vibeui-toast-020-radius:0.875rem;
--vibeui-toast-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toast-020"]{color-scheme:dark}
[data-vibeui-block="toast-020"]{
width:100%;max-width:23rem;box-sizing:border-box;
padding:0.875rem;border-radius:var(--vibeui-toast-020-radius);
border:1px solid var(--vibeui-toast-020-border);
background:var(--vibeui-toast-020-bg);color:var(--vibeui-toast-020-fg);
font-family:var(--vibeui-toast-020-font);
box-shadow:0 16px 34px -24px var(--vibeui-toast-020-shadow);
}
[data-vibeui-block="toast-020"] [data-part="head"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="toast-020"] [data-part="text"]{min-width:0;font-size:0.875rem;line-height:1.4}
[data-vibeui-block="toast-020"] [data-part="clock"]{
flex:none;font-size:0.8125rem;font-weight:700;color:var(--vibeui-toast-020-tone);
font-variant-numeric:tabular-nums;margin-top:0.0625rem;
}
[data-vibeui-block="toast-020"][data-paused="true"] [data-part="clock"]::after{content:var(--vibeui-toast-020-paused-text)}
[data-vibeui-block="toast-020"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;background:transparent;flex:none;
display:flex;align-items:center;justify-content:center;
width:1.25rem;height:1.25rem;padding:0;border-radius:9999px;
color:var(--vibeui-toast-020-muted);font-size:0.9375rem;line-height:1;
}
[data-vibeui-block="toast-020"] [data-part="close"]:hover{background:var(--vibeui-toast-020-hover);color:var(--vibeui-toast-020-fg)}
[data-vibeui-block="toast-020"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-toast-020-tone);outline-offset:2px}
[data-vibeui-block="toast-020"] [data-part="track"]{
margin-top:0.625rem;height:0.25rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-toast-020-track);
}
[data-vibeui-block="toast-020"] [data-part="fill"]{
height:100%;border-radius:inherit;width:calc(var(--vibeui-toast-020-percent) * 1%);
background:var(--vibeui-toast-020-tone);
transition:width .2s linear;
}
[data-vibeui-block="toast-020"][data-paused="true"] [data-part="fill"]{transition:none}
[data-vibeui-block="toast-020"] [data-part="row"]{margin-top:0.625rem;display:flex;justify-content:flex-end}
[data-vibeui-block="toast-020"] [data-part="extend"]{
appearance:none;cursor:pointer;border:0;border-radius:0.5rem;
padding:0.375rem 0.75rem;
background:var(--vibeui-toast-020-tone);color:var(--vibeui-toast-020-on-tone);
font:inherit;font-size:0.8125rem;font-weight:700;
}
[data-vibeui-block="toast-020"] [data-part="extend"]:hover{filter:brightness(1.05)}
[data-vibeui-block="toast-020"] [data-part="extend"]:focus-visible{outline:2px solid var(--vibeui-toast-020-tone);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-020"] *{transition:none!important}}
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

function formatClock(ms: number) {
  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, "0")}`
}

/**
 * Обратный отсчёт до автодействия с паузой по наведению и фокусу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast020({
  message = "Сессия завершится из-за бездействия",
  expiredMessage = "Сессия завершена",
  extendLabel = "Остаться в системе",
  closeLabel = "Закрыть",
  pausedText = " · пауза",
  tone = "",
  background = "",
  seconds = 30,
  onExpire,
  onExtend,
  className,
  style,
  ...props
}: Toast020Props) {
  const total = seconds * 1000
  const [left, setLeft] = useState(total)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(true)
  const pausedRef = useRef(false)
  const expiredRef = useRef(false)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  // Отсчёт зависит от факта «время ещё есть», а не от самого остатка:
  // иначе интервал пересоздавался бы каждые двести миллисекунд.
  const running = left > 0

  useEffect(() => {
    if (!running) {
      return
    }

    const timer = setInterval(() => {
      if (pausedRef.current) return
      setLeft((value) => Math.max(0, value - 200))
    }, 200)

    return () => clearInterval(timer)
  }, [running])

  useEffect(() => {
    if (left === 0 && !expiredRef.current) {
      expiredRef.current = true
      onExpire?.()
    }
  }, [left, onExpire])

  if (!visible) return null

  const percent = total > 0 ? (left / total) * 100 : 0
  const expired = left === 0

  // Приписку рисует ::after, поэтому строка уезжает в переменную уже в
  // кавычках: content принимает только строковый литерал.
  const palette = {
    "--vibeui-toast-020-percent": percent,
    "--vibeui-toast-020-paused-text": `"${pausedText}"`,
    ...(tone ? { "--vibeui-toast-020-tone": tone } : null),
    ...(background
      ? {
          "--vibeui-toast-020-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toast-020" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="toast"
        data-vibeui-block="toast-020"
        data-paused={paused && !expired}
        role="status"
        aria-live="polite"
        className={className}
        style={palette}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div data-part="head">
          <span data-part="text">{expired ? expiredMessage : message}</span>
          {!expired ? <span data-part="clock">{formatClock(left)}</span> : null}
          <button
            type="button"
            data-part="close"
            aria-label={closeLabel}
            onClick={() => setVisible(false)}
          >
            ×
          </button>
        </div>
        {!expired ? (
          <>
            <span data-part="track">
              <span data-part="fill" />
            </span>
            <div data-part="row">
              <button
                type="button"
                data-part="extend"
                onClick={() => {
                  expiredRef.current = false
                  setLeft(total)
                  onExtend?.()
                }}
              >
                {extendLabel}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </>
  )
}
