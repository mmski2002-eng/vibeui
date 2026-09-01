"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toast020Props = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  message?: string
  expiredMessage?: string
  extendLabel?: string
  closeLabel?: string
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
const STYLES = `
:where([data-vibeui-block="toast-020"]){
--vibeui-toast-020-bg:oklch(0.99 0.002 265);
--vibeui-toast-020-fg:oklch(0.22 0.014 265);
--vibeui-toast-020-muted:oklch(0.56 0.014 265);
--vibeui-toast-020-border:oklch(0.9 0.006 265);
--vibeui-toast-020-track:oklch(0.92 0.006 265);
--vibeui-toast-020-tone:oklch(0.62 0.19 40);
--vibeui-toast-020-percent:100;
--vibeui-toast-020-radius:0.875rem;
--vibeui-toast-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toast-020"]{
width:100%;max-width:23rem;box-sizing:border-box;
padding:0.875rem;border-radius:var(--vibeui-toast-020-radius);
border:1px solid var(--vibeui-toast-020-border);
background:var(--vibeui-toast-020-bg);color:var(--vibeui-toast-020-fg);
font-family:var(--vibeui-toast-020-font);
box-shadow:0 16px 34px -24px oklch(0.18 0.02 265 / 55%);
}
[data-vibeui-block="toast-020"] [data-part="head"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="toast-020"] [data-part="text"]{min-width:0;font-size:0.8438rem;line-height:1.4}
[data-vibeui-block="toast-020"] [data-part="clock"]{
flex:none;font-size:0.8125rem;font-weight:700;color:var(--vibeui-toast-020-tone);
font-variant-numeric:tabular-nums;margin-top:0.0625rem;
}
[data-vibeui-block="toast-020"][data-paused="true"] [data-part="clock"]::after{content:" · пауза"}
[data-vibeui-block="toast-020"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;background:transparent;flex:none;
display:flex;align-items:center;justify-content:center;
width:1.25rem;height:1.25rem;padding:0;border-radius:9999px;
color:var(--vibeui-toast-020-muted);font-size:0.9375rem;line-height:1;
}
[data-vibeui-block="toast-020"] [data-part="close"]:hover{background:oklch(0 0 0 / 6%);color:var(--vibeui-toast-020-fg)}
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
background:var(--vibeui-toast-020-tone);color:oklch(0.99 0.004 265);
font:inherit;font-size:0.8125rem;font-weight:700;
}
[data-vibeui-block="toast-020"] [data-part="extend"]:hover{filter:brightness(1.05)}
[data-vibeui-block="toast-020"] [data-part="extend"]:focus-visible{outline:2px solid var(--vibeui-toast-020-tone);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-020"] *{transition:none!important}}
`

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

  useEffect(() => {
    if (left <= 0) return

    const timer = setInterval(() => {
      if (pausedRef.current) return
      setLeft((value) => Math.max(0, value - 200))
    }, 200)

    return () => clearInterval(timer)
  }, [left <= 0])

  useEffect(() => {
    if (left === 0 && !expiredRef.current) {
      expiredRef.current = true
      onExpire?.()
    }
  }, [left, onExpire])

  if (!visible) return null

  const percent = total > 0 ? (left / total) * 100 : 0
  const expired = left === 0

  return (
    <>
      <style href="vibeui-toast-020" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="toast-020"
        data-paused={paused && !expired}
        role="status"
        aria-live="polite"
        className={className}
        style={{ "--vibeui-toast-020-percent": percent, ...style } as CSSProperties}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div data-part="head">
          <span data-part="text">{expired ? expiredMessage : message}</span>
          {!expired ? (
            <span data-part="clock">{formatClock(left)}</span>
          ) : null}
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
