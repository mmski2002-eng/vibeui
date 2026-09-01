"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toast013Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  message?: string
  returnLabel?: string
  /** Сколько секунд можно передумать. */
  seconds?: number
  onReturn?: () => void
  onExpire?: () => void
}

// Идея компонента: пачечное действие с отменой, у которой видно не полосу,
// а число. Кольцо тает по кругу и в центре считает секунды — так понятно,
// сколько ещё есть времени, не отвлекаясь на линию где-то с краю карточки.
const STYLES = `
:where([data-vibeui-block="toast-013"]){
--vibeui-toast-013-bg:oklch(0.24 0.02 265);
--vibeui-toast-013-fg:oklch(0.98 0.004 265);
--vibeui-toast-013-muted:oklch(0.82 0.012 265);
--vibeui-toast-013-track:oklch(1 0 0 / 18%);
--vibeui-toast-013-tone:oklch(0.78 0.14 195);
--vibeui-toast-013-percent:100;
--vibeui-toast-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toast-013"]{
display:flex;align-items:center;gap:0.75rem;
width:100%;max-width:23rem;box-sizing:border-box;
padding:0.75rem 0.875rem;border-radius:0.75rem;
background:var(--vibeui-toast-013-bg);color:var(--vibeui-toast-013-fg);
font-family:var(--vibeui-toast-013-font);
box-shadow:0 18px 40px -22px oklch(0.2 0.02 265 / 65%);
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
background:oklch(1 0 0 / 12%);color:var(--vibeui-toast-013-tone);
font:inherit;font-size:0.8125rem;font-weight:700;
}
[data-vibeui-block="toast-013"] button:hover{background:oklch(1 0 0 / 18%)}
[data-vibeui-block="toast-013"] button:focus-visible{outline:2px solid var(--vibeui-toast-013-tone);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-013"] *{animation:none!important;transition:none!important}}
`

/**
 * Пачечная отмена: кольцевой таймер с числом секунд и кнопка «Вернуть».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast013({
  message = "5 писем перемещены в архив",
  returnLabel = "Вернуть",
  seconds = 6,
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
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toast-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
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
          {returned ? "Письма возвращены из архива" : message}
          {!returned ? (
            <span data-part="sub">
              {expired ? "Время вышло" : `Отменить можно ещё ${secondsLeft} с`}
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
