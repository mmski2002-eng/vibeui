"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toggle006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  delay?: number
  defaultPressed?: boolean
  onChange?: (pressed: boolean) => void
  accent?: string
}

// Идея компонента: toggle, за которым стоит запрос. Состояние переключается
// только после ответа: пока идёт сохранение, кнопка держит старое aria-pressed
// и добавляет aria-busy, поэтому она не врёт о том, что уже сохранено.
const STYLES = `
:where([data-vibeui-block="toggle-006"]){
--vibeui-toggle-006-bg:oklch(1 0 0);
--vibeui-toggle-006-fg:oklch(0.22 0.014 265);
--vibeui-toggle-006-muted:oklch(0.55 0.014 265);
--vibeui-toggle-006-border:oklch(0.9 0.006 265);
--vibeui-toggle-006-accent:oklch(0.55 0.15 155);
--vibeui-toggle-006-soft:oklch(0.95 0.04 155);
--vibeui-toggle-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toggle-006"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.5rem;align-items:flex-start;
width:100%;max-width:19rem;padding:0.875rem;
border:1px solid var(--vibeui-toggle-006-border);border-radius:0.875rem;
background:var(--vibeui-toggle-006-bg);color:var(--vibeui-toggle-006-fg);
font-family:var(--vibeui-toggle-006-font);
}
[data-vibeui-block="toggle-006"] *{box-sizing:border-box}
[data-vibeui-block="toggle-006"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
min-width:11rem;height:2.375rem;padding:0 1rem;
border:1px solid var(--vibeui-toggle-006-border);border-radius:0.625rem;
background:var(--vibeui-toggle-006-bg);color:var(--vibeui-toggle-006-fg);
font-size:0.875rem;font-weight:600;line-height:1;
transition:background-color .16s ease,border-color .16s ease,color .16s ease;
}
[data-vibeui-block="toggle-006"] button:focus-visible{
outline:2px solid var(--vibeui-toggle-006-accent);outline-offset:2px;
}
[data-vibeui-block="toggle-006"] button[aria-pressed="true"]{
background:var(--vibeui-toggle-006-soft);
border-color:var(--vibeui-toggle-006-accent);
color:oklch(0.36 0.09 155);
}
/* Ширина кнопки зафиксирована: значок меняется с галочки на волчок, и без
   min-width кнопка дёргалась бы на каждое сохранение. */
[data-vibeui-block="toggle-006"] button[aria-busy="true"]{cursor:progress;color:var(--vibeui-toggle-006-muted)}
[data-vibeui-block="toggle-006"] svg{width:1rem;height:1rem;flex:none}
[data-vibeui-block="toggle-006"] [data-part="spinner"]{
width:1rem;height:1rem;flex:none;border-radius:50%;
border:2px solid var(--vibeui-toggle-006-border);
border-top-color:var(--vibeui-toggle-006-accent);
animation:vibeui-toggle-006-spin .7s linear infinite;
}
@keyframes vibeui-toggle-006-spin{to{transform:rotate(1turn)}}
[data-vibeui-block="toggle-006"] [data-part="status"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-toggle-006-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toggle-006"] *{animation:none!important;transition:none!important}}
`

/**
 * Toggle с сохранением на сервере: пока идёт запрос, кнопка помечена
 * aria-busy и не меняет состояние. Один файл, ноль зависимостей.
 */
export function Toggle006({
  label = "Опубликовано",
  delay = 1200,
  defaultPressed = false,
  onChange,
  accent,
  className,
  style,
  ...props
}: Toggle006Props) {
  const [pressed, setPressed] = useState(defaultPressed)
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
    },
    [],
  )

  const palette = {
    ...(accent ? { "--vibeui-toggle-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  const save = () => {
    if (busy) {
      return
    }

    setBusy(true)
    setSaved(false)

    timer.current = setTimeout(() => {
      const next = !pressed

      setPressed(next)
      setBusy(false)
      setSaved(true)
      onChange?.(next)
    }, delay)
  }

  return (
    <>
      <style href="vibeui-toggle-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="toggle-006"
        className={className}
        style={palette}
      >
        <button
          type="button"
          aria-pressed={pressed}
          aria-busy={busy}
          onClick={save}
        >
          {busy ? (
            <span data-part="spinner" aria-hidden="true" />
          ) : (
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d={pressed ? "M3 8.4l3.2 3.2L13 5" : "M8 3.2v9.6M3.2 8h9.6"}
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {label}
        </button>
        <p data-part="status" role="status">
          {busy
            ? "Сохраняем…"
            : saved
              ? pressed
                ? "Сохранено: страница видна всем"
                : "Сохранено: страница снята с публикации"
              : "Изменение уходит на сервер сразу"}
        </p>
      </div>
    </>
  )
}
