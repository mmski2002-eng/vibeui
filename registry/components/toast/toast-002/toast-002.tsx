"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toast002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  message?: string
  undoLabel?: string
  /** Сколько секунд можно передумать. */
  seconds?: number
  onUndo?: () => void
  accent?: string
}

// Идея компонента: сообщение с отменой вместо подтверждения. «Точно удалить?»
// останавливает всех ради ошибки одного; отмена после действия стоит одного
// нажатия и только тому, кто ошибся. Полоса показывает, сколько осталось
// времени, и таймер останавливается при наведении.
const STYLES = `
:where([data-vibeui-block="toast-002"]){
--vibeui-toast-002-bg:oklch(0.24 0.02 265);
--vibeui-toast-002-fg:oklch(0.98 0.004 265);
--vibeui-toast-002-muted:oklch(0.82 0.012 265);
--vibeui-toast-002-track:oklch(1 0 0 / 22%);
--vibeui-toast-002-accent:oklch(0.78 0.14 195);
--vibeui-toast-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toast-002"]{
position:relative;display:flex;align-items:center;gap:0.875rem;
width:100%;max-width:23rem;box-sizing:border-box;overflow:hidden;
padding:0.75rem 0.875rem;border-radius:0.75rem;
background:var(--vibeui-toast-002-bg);color:var(--vibeui-toast-002-fg);
font-family:var(--vibeui-toast-002-font);
box-shadow:0 18px 40px -22px oklch(0.2 0.02 265 / 65%);
}
[data-vibeui-block="toast-002"] [data-part="text"]{flex:1;min-width:0;font-size:0.875rem;line-height:1.35}
[data-vibeui-block="toast-002"] [data-part="left"]{display:block;margin-top:0.125rem;font-size:0.75rem;color:var(--vibeui-toast-002-muted);font-variant-numeric:tabular-nums}
/* Отмена — крупная и рядом: ею пользуются в спешке. */
[data-vibeui-block="toast-002"] button{
appearance:none;cursor:pointer;flex:none;
height:2rem;padding:0 0.75rem;border:0;border-radius:0.5rem;
background:oklch(1 0 0 / 12%);color:var(--vibeui-toast-002-accent);
font:inherit;font-size:0.8125rem;font-weight:700;
}
[data-vibeui-block="toast-002"] button:hover{background:oklch(1 0 0 / 18%)}
[data-vibeui-block="toast-002"] button:focus-visible{outline:2px solid var(--vibeui-toast-002-accent);outline-offset:2px}
/* Полоса времени: без неё непонятно, сколько ещё можно передумать. */
[data-vibeui-block="toast-002"] [data-part="track"]{
position:absolute;left:0;right:0;bottom:0;height:0.1875rem;background:var(--vibeui-toast-002-track);
}
[data-vibeui-block="toast-002"] [data-part="fill"]{
display:block;height:100%;background:var(--vibeui-toast-002-accent);
transition:width .2s linear;
}
[data-vibeui-block="toast-002"] [data-part="done"]{font-size:0.875rem;color:var(--vibeui-toast-002-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-002"] *{animation:none!important;transition:none!important}}
`

/**
 * Сообщение с отменой: полоса времени и пауза по наведению.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast002({
  message = "Проект перемещён в архив",
  undoLabel = "Отменить",
  seconds = 8,
  onUndo,
  accent,
  className,
  style,
  ...props
}: Toast002Props) {
  const [left, setLeft] = useState(seconds * 1000)
  const [undone, setUndone] = useState(false)
  const paused = useRef(false)

  useEffect(() => {
    if (undone) return
    const timer = setInterval(() => {
      if (paused.current) return
      setLeft((value) => Math.max(0, value - 100))
    }, 100)

    return () => clearInterval(timer)
  }, [undone])

  const palette = {
    ...(accent ? { "--vibeui-toast-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  const percent = (left / (seconds * 1000)) * 100
  const expired = left === 0

  return (
    <>
      <style href="vibeui-toast-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="toast-002"
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
        <span data-part="text">
          {undone ? "Действие отменено" : message}
          {!undone && !expired ? (
            <span data-part="left">
              Отменить можно ещё {Math.ceil(left / 1000)} с
            </span>
          ) : null}
        </span>
        {undone || expired ? (
          <span data-part="done">{undone ? "Готово" : "Время вышло"}</span>
        ) : (
          <button
            type="button"
            onClick={() => {
              setUndone(true)
              onUndo?.()
            }}
          >
            {undoLabel}
          </button>
        )}
        {undone || expired ? null : (
          <span data-part="track" aria-hidden="true">
            <span data-part="fill" style={{ width: `${percent}%` }} />
          </span>
        )}
      </div>
    </>
  )
}
