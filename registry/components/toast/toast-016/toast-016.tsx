"use client"

import { useEffect, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toast016Status = "offline" | "reconnecting" | "online"

export type Toast016Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  offlineText?: string
  reconnectingText?: string
  onlineText?: string
  offlineHint?: string
  reconnectingHint?: string
  onlineHint?: string
  /** Подложка карточки. Пусто — штатная палитра. */
  background?: string
  /** Через сколько мс после обрыва начинается попытка переподключения (демо). */
  reconnectAfter?: number
  /** Через сколько мс после переподключения статус скрывается (демо). */
  hideAfter?: number
  onStatusChange?: (status: Toast016Status) => void
}

// Идея компонента: не просто «нет сети», а короткая история из трёх кадров —
// пропало соединение, идёт попытка восстановить, соединение вернулось.
// Индикатор — три точки-«сигнала», гаснущие или мигающие по статусу, без
// иконки wifi, которая на маленьком размере читается хуже, чем точки.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// подложка светлее фона страницы, граница светлее подложки, а сигнальные цвета
// подняты по светлоте, чтобы не проваливаться в тёмный фон.
const STYLES = `
:where([data-vibeui-block="toast-016"]){
--vibeui-toast-016-bg:light-dark(oklch(0.99 0.002 265),oklch(0.25 0.014 265));
--vibeui-toast-016-fg:light-dark(oklch(0.22 0.014 265),oklch(0.96 0.003 265));
--vibeui-toast-016-muted:light-dark(oklch(0.56 0.014 265),oklch(0.76 0.01 265));
--vibeui-toast-016-border:light-dark(oklch(0.9 0.006 265),oklch(0.38 0.014 265));
--vibeui-toast-016-shadow:light-dark(oklch(0.18 0.02 265 / 55%),oklch(0.05 0.01 265 / 70%));
--vibeui-toast-016-danger:light-dark(oklch(0.56 0.19 25),oklch(0.7 0.17 25));
--vibeui-toast-016-warning:light-dark(oklch(0.66 0.15 75),oklch(0.8 0.14 78));
--vibeui-toast-016-success:light-dark(oklch(0.56 0.15 152),oklch(0.74 0.15 152));
--vibeui-toast-016-radius:0.875rem;
--vibeui-toast-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toast-016"]{
display:flex;align-items:center;gap:0.75rem;
width:100%;max-width:22rem;box-sizing:border-box;
padding:0.75rem 0.875rem;border-radius:var(--vibeui-toast-016-radius);
border:1px solid var(--vibeui-toast-016-border);
background:var(--vibeui-toast-016-bg);color:var(--vibeui-toast-016-fg);
font-family:var(--vibeui-toast-016-font);
box-shadow:0 16px 34px -24px var(--vibeui-toast-016-shadow);
}
[data-vibeui-block="toast-016"] [data-part="signal"]{
flex:none;display:flex;align-items:flex-end;gap:0.1875rem;height:1rem;
}
[data-vibeui-block="toast-016"] [data-part="bar"]{
width:0.25rem;border-radius:1px;background:var(--vibeui-toast-016-border);
transition:background-color .2s ease;
}
[data-vibeui-block="toast-016"] [data-part="bar"]:nth-child(1){height:0.4rem}
[data-vibeui-block="toast-016"] [data-part="bar"]:nth-child(2){height:0.7rem}
[data-vibeui-block="toast-016"] [data-part="bar"]:nth-child(3){height:1rem}
[data-vibeui-block="toast-016"][data-status="offline"] [data-part="bar"]{background:var(--vibeui-toast-016-danger)}
[data-vibeui-block="toast-016"][data-status="reconnecting"] [data-part="bar"]{
background:var(--vibeui-toast-016-warning);animation:vibeui-toast-016-pulse 1s ease-in-out infinite;
}
[data-vibeui-block="toast-016"][data-status="reconnecting"] [data-part="bar"]:nth-child(2){animation-delay:.15s}
[data-vibeui-block="toast-016"][data-status="reconnecting"] [data-part="bar"]:nth-child(3){animation-delay:.3s}
[data-vibeui-block="toast-016"][data-status="online"] [data-part="bar"]{background:var(--vibeui-toast-016-success)}
@keyframes vibeui-toast-016-pulse{0%,100%{opacity:0.3}50%{opacity:1}}
[data-vibeui-block="toast-016"] [data-part="text"]{flex:1;min-width:0;font-size:0.8438rem;line-height:1.35}
[data-vibeui-block="toast-016"] [data-part="sub"]{display:block;margin-top:0.125rem;font-size:0.75rem;color:var(--vibeui-toast-016-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-016"] *{animation:none!important;transition:none!important}}
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
 * Сетевой статус: пропало соединение, идёт попытка восстановить, соединение
 * вернулось — три кадра одной истории со сменой индикатора и роли.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast016({
  offlineText = "Соединение потеряно",
  reconnectingText = "Пробуем восстановить соединение…",
  onlineText = "Соединение восстановлено",
  offlineHint = "Проверьте кабель или Wi-Fi",
  reconnectingHint = "Это займёт несколько секунд",
  onlineHint = "Можно продолжать работу",
  background = "",
  reconnectAfter = 1800,
  hideAfter = 2600,
  onStatusChange,
  className,
  style,
  ...props
}: Toast016Props) {
  const [status, setStatus] = useState<Toast016Status>("offline")
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    onStatusChange?.(status)
  }, [status, onStatusChange])

  useEffect(() => {
    if (status !== "offline") return

    const timer = setTimeout(() => setStatus("reconnecting"), reconnectAfter)
    return () => clearTimeout(timer)
  }, [status, reconnectAfter])

  useEffect(() => {
    if (status !== "reconnecting") return

    const timer = setTimeout(() => setStatus("online"), reconnectAfter)
    return () => clearTimeout(timer)
  }, [status, reconnectAfter])

  useEffect(() => {
    if (status !== "online") return

    const timer = setTimeout(() => setVisible(false), hideAfter)
    return () => clearTimeout(timer)
  }, [status, hideAfter])

  if (!visible) return null

  const text =
    status === "offline"
      ? offlineText
      : status === "reconnecting"
        ? reconnectingText
        : onlineText

  const sub =
    status === "offline"
      ? offlineHint
      : status === "reconnecting"
        ? reconnectingHint
        : onlineHint

  const palette = {
    ...(background
      ? {
          "--vibeui-toast-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toast-016" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="toast-016"
        data-status={status}
        role={status === "offline" ? "alert" : "status"}
        aria-live={status === "offline" ? "assertive" : "polite"}
        className={className}
        style={palette}
      >
        <span data-part="signal" aria-hidden="true">
          <span data-part="bar" />
          <span data-part="bar" />
          <span data-part="bar" />
        </span>
        <span data-part="text">
          {text}
          <span data-part="sub">{sub}</span>
        </span>
      </div>
    </>
  )
}
