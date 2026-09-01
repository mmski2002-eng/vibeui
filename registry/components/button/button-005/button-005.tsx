"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button005Props = Omit<
  ComponentPropsWithoutRef<"button">,
  "onClick"
> & {
  confirmLabel?: string
  /** Сколько окно подтверждения остаётся открытым, мс. */
  timeout?: number
  onConfirm?: () => void
  accent?: string
}

// Идея компонента: подтверждение без модального окна. Первый клик открывает
// окно подтверждения прямо в кнопке — подпись меняется, а по нижнему краю
// убывает полоса оставшегося времени. Второй клик внутри окна подтверждает,
// иначе кнопка сама возвращается в исходное состояние.
const STYLES = `
:where([data-vibeui-block="button-005"]){
--vibeui-button-005-bg:oklch(0.96 0.004 265);
--vibeui-button-005-fg:oklch(0.28 0.014 265);
--vibeui-button-005-border:oklch(0.55 0.02 265 / 24%);
--vibeui-button-005-armed-bg:oklch(0.93 0.07 84);
--vibeui-button-005-armed-fg:oklch(0.36 0.09 70);
--vibeui-button-005-armed-bar:oklch(0.7 0.15 62);
--vibeui-button-005-ring:oklch(0.55 0.02 265 / 60%);
--vibeui-button-005-radius:0.625rem;
--vibeui-button-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-005"]{
position:relative;overflow:hidden;appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
height:2.5rem;padding:0 1.125rem;border:1px solid var(--vibeui-button-005-border);
border-radius:var(--vibeui-button-005-radius);
font-family:var(--vibeui-button-005-font);font-size:0.875rem;font-weight:500;line-height:1;
background:var(--vibeui-button-005-bg);color:var(--vibeui-button-005-fg);
transition:background-color .18s ease,color .18s ease,border-color .18s ease;
}
[data-vibeui-block="button-005"][data-armed="true"]{
background:var(--vibeui-button-005-armed-bg);color:var(--vibeui-button-005-armed-fg);
border-color:color-mix(in oklab, var(--vibeui-button-005-armed-bar) 45%, transparent);
}
[data-vibeui-block="button-005"] [data-part="bar"]{
position:absolute;left:0;bottom:0;height:2px;width:100%;
background:var(--vibeui-button-005-armed-bar);transform-origin:left center;
animation:vibeui-button-005-drain linear forwards;
}
@keyframes vibeui-button-005-drain{from{transform:scaleX(1)}to{transform:scaleX(0)}}
[data-vibeui-block="button-005"]:hover:not(:disabled){border-color:color-mix(in oklab, var(--vibeui-button-005-fg) 35%, transparent)}
[data-vibeui-block="button-005"]:focus-visible{outline:2px solid var(--vibeui-button-005-ring);outline-offset:2px}
[data-vibeui-block="button-005"]:disabled{cursor:not-allowed;opacity:.55}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-005"] [data-part="bar"]{animation:none!important;transform:scaleX(1)}}
`

/**
 * Подтверждение в два шага прямо в кнопке. Один файл, ноль зависимостей,
 * собственная палитра. Клиентский компонент: окно подтверждения — состояние.
 */
export function Button005({
  confirmLabel = "Точно удалить?",
  timeout = 3000,
  onConfirm,
  accent,
  type = "button",
  disabled,
  className,
  style,
  children = "Удалить проект",
  ...props
}: Button005Props) {
  const [armed, setArmed] = useState(false)
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!armed) {
      return
    }

    timerRef.current = window.setTimeout(() => setArmed(false), timeout)

    return () => window.clearTimeout(timerRef.current)
  }, [armed, timeout])

  const palette = {
    ...(accent ? { "--vibeui-button-005-armed-bar": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-005" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-vibeui-block="button-005"
        data-armed={armed}
        disabled={disabled}
        className={className}
        style={palette}
        onClick={() => {
          if (!armed) {
            setArmed(true)
            return
          }

          setArmed(false)
          onConfirm?.()
        }}
      >
        {armed ? confirmLabel : children}
        {armed ? (
          <span
            data-part="bar"
            aria-hidden="true"
            style={{ animationDuration: `${timeout}ms` }}
          />
        ) : null}
      </button>
    </>
  )
}
