"use client"

import { useEffect, useState } from "react"
import type { ComponentPropsWithoutRef } from "react"

export type Toast016Status = "offline" | "reconnecting" | "online"

export type Toast016Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  offlineText?: string
  reconnectingText?: string
  onlineText?: string
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
const STYLES = `
:where([data-vibeui-block="toast-016"]){
--vibeui-toast-016-bg:oklch(0.99 0.002 265);
--vibeui-toast-016-fg:oklch(0.22 0.014 265);
--vibeui-toast-016-muted:oklch(0.56 0.014 265);
--vibeui-toast-016-border:oklch(0.9 0.006 265);
--vibeui-toast-016-danger:oklch(0.58 0.19 25);
--vibeui-toast-016-warning:oklch(0.68 0.15 75);
--vibeui-toast-016-success:oklch(0.58 0.15 152);
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
box-shadow:0 16px 34px -24px oklch(0.18 0.02 265 / 55%);
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
 * Сетевой статус: пропало соединение, идёт попытка восстановить, соединение
 * вернулось — три кадра одной истории со сменой индикатора и роли.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast016({
  offlineText = "Соединение потеряно",
  reconnectingText = "Пробуем восстановить соединение…",
  onlineText = "Соединение восстановлено",
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
      ? "Проверьте кабель или Wi-Fi"
      : status === "reconnecting"
        ? "Это займёт несколько секунд"
        : "Можно продолжать работу"

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
        style={style}
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
