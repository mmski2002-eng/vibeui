"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Toast002Props = Omit<ComponentProps<"div">, "children"> & {
  message?: string
  undoLabel?: string
  /** Сообщение после нажатия «Отменить». */
  undoneMessage?: string
  /** Строка обратного отсчёта; {seconds} заменяется на число секунд. */
  countdownText?: string
  /** Подпись после успешной отмены. */
  doneLabel?: string
  /** Подпись, когда время вышло. */
  expiredLabel?: string
  /** Сколько секунд можно передумать. */
  seconds?: number
  onUndo?: () => void
  accent?: string
  /** Пусто — подложка берётся из темы окружения. */
  background?: string
}

// Идея компонента: сообщение с отменой вместо подтверждения. «Точно удалить?»
// останавливает всех ради ошибки одного; отмена после действия стоит одного
// нажатия и только тому, кто ошибся. Полоса показывает, сколько осталось
// времени, и таймер останавливается при наведении.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// граница светлее подложки, а не темнее.
const STYLES = `
:where([data-vibeui-block="toast-002"]){
--vibeui-toast-002-bg:light-dark(oklch(0.99 0 265),oklch(0.24 0 265));
--vibeui-toast-002-fg:light-dark(oklch(0.24 0 265),oklch(0.98 0 265));
--vibeui-toast-002-muted:color-mix(in oklab,var(--vibeui-toast-002-fg) 68%,transparent);
--vibeui-toast-002-line:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-toast-002-track:light-dark(oklch(0.2 0 265 / 12%),oklch(1 0 0 / 22%));
--vibeui-toast-002-button:light-dark(oklch(0.2 0 265 / 8%),oklch(1 0 0 / 12%));
--vibeui-toast-002-button-hover:light-dark(oklch(0.2 0 265 / 14%),oklch(1 0 0 / 18%));
--vibeui-toast-002-shadow:light-dark(oklch(0.55 0 265 / 20%),oklch(0.2 0 265 / 65%));
--vibeui-toast-002-accent:light-dark(oklch(0.5 0.12 39.8),oklch(0.78 0.14 39.8));
--vibeui-toast-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toast-002"]{color-scheme:dark}
[data-vibeui-block="toast-002"]{
position:relative;display:flex;align-items:center;gap:0.875rem;
width:100%;max-width:23rem;box-sizing:border-box;overflow:hidden;
padding:0.75rem 0.875rem;border-radius:0.75rem;
background:var(--vibeui-toast-002-bg);color:var(--vibeui-toast-002-fg);
font-family:var(--vibeui-toast-002-font);
box-shadow:0 0 0 1px var(--vibeui-toast-002-line),0 18px 40px -22px var(--vibeui-toast-002-shadow);
}
[data-vibeui-block="toast-002"] [data-part="text"]{flex:1;min-width:0;font-size:0.875rem;line-height:1.35}
[data-vibeui-block="toast-002"] [data-part="left"]{display:block;margin-top:0.125rem;font-size:0.75rem;color:var(--vibeui-toast-002-muted);font-variant-numeric:tabular-nums}
/* Отмена — крупная и рядом: ею пользуются в спешке. */
[data-vibeui-block="toast-002"] button{
appearance:none;cursor:pointer;flex:none;
height:2rem;padding:0 0.75rem;border:0;border-radius:0.5rem;
background:var(--vibeui-toast-002-button);color:var(--vibeui-toast-002-accent);
font:inherit;font-size:0.8125rem;font-weight:700;
}
[data-vibeui-block="toast-002"] button:hover{background:var(--vibeui-toast-002-button-hover)}
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
 * Сообщение с отменой: полоса времени и пауза по наведению.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast002({
  message = "Проект перемещён в архив",
  undoLabel = "Отменить",
  undoneMessage = "Действие отменено",
  countdownText = "Отменить можно ещё {seconds} с",
  doneLabel = "Готово",
  expiredLabel = "Время вышло",
  seconds = 8,
  onUndo,
  accent,
  background = "",
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
    ...(background
      ? {
          "--vibeui-toast-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        data-slot="toast"
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
          {undone ? undoneMessage : message}
          {!undone && !expired ? (
            <span data-part="left">
              {countdownText.replace(
                "{seconds}",
                String(Math.ceil(left / 1000)),
              )}
            </span>
          ) : null}
        </span>
        {undone || expired ? (
          <span data-part="done">{undone ? doneLabel : expiredLabel}</span>
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
