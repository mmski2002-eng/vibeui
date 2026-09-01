"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Spinner009Props = Omit<
  ComponentPropsWithoutRef<"button">,
  "children" | "onClick"
> & {
  label?: string
  pendingLabel?: string
  pendingDuration?: number
  accent?: string
}

// Идея компонента: спиннер внутри кнопки, который блокирует повторное
// нажатие. Подпись кнопки не меняется — рядом с ней появляется индикатор,
// а сама кнопка получает disabled и aria-busy на время работы. Отдельная
// невидимая aria-live область объявляет начало и конец ожидания, не трогая
// видимый текст: так подпись не дёргается при каждом клике.
const STYLES = `
:where([data-vibeui-block="spinner-009"]){
--vibeui-spinner-009-accent:oklch(0.55 0.17 265);
--vibeui-spinner-009-fg:oklch(0.99 0.01 265);
--vibeui-spinner-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="spinner-009"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
height:2.5rem;padding:0 1.125rem;box-sizing:border-box;
border-radius:0.625rem;border:1.5px solid var(--vibeui-spinner-009-accent);
background:transparent;color:var(--vibeui-spinner-009-accent);
font-family:var(--vibeui-spinner-009-font);font-size:0.875rem;font-weight:650;line-height:1;
}
[data-vibeui-block="spinner-009"]:hover:not(:disabled){background:color-mix(in oklab,var(--vibeui-spinner-009-accent) 10%,transparent)}
[data-vibeui-block="spinner-009"]:focus-visible{outline:2px solid var(--vibeui-spinner-009-accent);outline-offset:2px}
[data-vibeui-block="spinner-009"]:disabled{cursor:progress;opacity:.7}
[data-vibeui-block="spinner-009"] [data-part="dots"]{
display:inline-flex;align-items:center;gap:0.1875rem;
}
[data-vibeui-block="spinner-009"] [data-part="dot"]{
width:0.3125rem;height:0.3125rem;border-radius:9999px;
background:currentColor;
animation:vibeui-spinner-009-bounce .9s ease-in-out infinite;
}
[data-vibeui-block="spinner-009"] [data-part="dot"]:nth-child(2){animation-delay:.15s}
[data-vibeui-block="spinner-009"] [data-part="dot"]:nth-child(3){animation-delay:.3s}
@keyframes vibeui-spinner-009-bounce{0%,80%,100%{opacity:.3}40%{opacity:1}}
/* Невидимая, но доступная область: только она объявляет смену состояния. */
[data-vibeui-block="spinner-009"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;
clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="spinner-009"] [data-part="dot"]{animation:none!important}
[data-vibeui-block="spinner-009"] [data-part="dot"]:nth-child(1){opacity:1}
[data-vibeui-block="spinner-009"] [data-part="dot"]:nth-child(2){opacity:.6}
[data-vibeui-block="spinner-009"] [data-part="dot"]:nth-child(3){opacity:.3}
}
`

/**
 * Кнопка со спиннером, которая блокирует повторное нажатие до завершения.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Spinner009({
  label = "Сохранить настройки",
  pendingLabel = "Сохраняем, подождите",
  pendingDuration = 1600,
  accent,
  type = "button",
  className,
  style,
  ...props
}: Spinner009Props) {
  const [pending, setPending] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const palette = {
    ...(accent ? { "--vibeui-spinner-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  const handleClick = () => {
    if (pending) return
    setPending(true)
    timer.current = setTimeout(() => setPending(false), pendingDuration)
  }

  return (
    <>
      <style href="vibeui-spinner-009" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-vibeui-block="spinner-009"
        data-state={pending ? "pending" : "idle"}
        className={className}
        style={palette}
        disabled={pending}
        aria-disabled={pending}
        aria-busy={pending}
        onClick={handleClick}
      >
        {pending ? (
          <span data-part="dots" aria-hidden="true">
            <span data-part="dot" />
            <span data-part="dot" />
            <span data-part="dot" />
          </span>
        ) : null}
        <span>{label}</span>
        <span data-part="sr" role="status" aria-live="polite">
          {pending ? pendingLabel : ""}
        </span>
      </button>
    </>
  )
}
