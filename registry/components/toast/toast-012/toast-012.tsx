"use client"

import { useEffect, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toast012Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  title?: string
  doneTitle?: string
  cancelLabel?: string
  /** Сколько миллисекунд идёт условная загрузка от 0 до 100%. */
  duration?: number
  onDone?: () => void
  onCancel?: () => void
}

// Идея компонента: карточка сама ведёт загрузку и сама объявляет результат.
// Никто не передаёт value каждый кадр — процент считает таймер внутри, а по
// достижении 100% карточка переключается на завершение без перезагрузки.
const STYLES = `
:where([data-vibeui-block="toast-012"]){
--vibeui-toast-012-bg:oklch(0.23 0.014 265);
--vibeui-toast-012-fg:oklch(0.97 0.002 265);
--vibeui-toast-012-muted:oklch(0.78 0.008 265);
--vibeui-toast-012-track:oklch(1 0 0 / 16%);
--vibeui-toast-012-tone:oklch(0.72 0.15 220);
--vibeui-toast-012-done:oklch(0.72 0.15 152);
--vibeui-toast-012-value:0;
--vibeui-toast-012-radius:0.875rem;
--vibeui-toast-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toast-012"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:23rem;box-sizing:border-box;
padding:0.875rem 0.9375rem;
border-radius:var(--vibeui-toast-012-radius);
background:var(--vibeui-toast-012-bg);color:var(--vibeui-toast-012-fg);
font-family:var(--vibeui-toast-012-font);
box-shadow:0 20px 44px -24px oklch(0.15 0.02 265 / 65%);
}
[data-vibeui-block="toast-012"] [data-part="head"]{display:flex;align-items:baseline;gap:0.75rem}
[data-vibeui-block="toast-012"] [data-part="title"]{
margin:0;flex:1 1 auto;min-width:0;font-size:0.875rem;font-weight:640;line-height:1.35;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="toast-012"] [data-part="percent"]{
flex:none;font-size:0.875rem;font-weight:700;font-variant-numeric:tabular-nums;
color:var(--vibeui-toast-012-tone);
}
[data-vibeui-block="toast-012"] [data-part="track"]{
position:relative;height:0.375rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-toast-012-track);
}
[data-vibeui-block="toast-012"] [data-part="fill"]{
position:absolute;inset:0 auto 0 0;border-radius:inherit;
width:calc(var(--vibeui-toast-012-value) * 1%);
background:linear-gradient(90deg,var(--vibeui-toast-012-tone),color-mix(in oklab,var(--vibeui-toast-012-tone) 55%,oklch(0.85 0.13 200)));
transition:width .15s linear;
}
[data-vibeui-block="toast-012"] [data-part="foot"]{display:flex;align-items:center;justify-content:space-between;gap:0.75rem}
[data-vibeui-block="toast-012"] [data-part="hint"]{font-size:0.75rem;color:var(--vibeui-toast-012-muted)}
[data-vibeui-block="toast-012"] [data-part="cancel"]{
appearance:none;cursor:pointer;border:0;background:transparent;
padding:0.25rem 0.375rem;margin:-0.25rem -0.375rem;border-radius:0.375rem;
font:inherit;font-size:0.75rem;font-weight:600;color:var(--vibeui-toast-012-muted);
transition:color .16s ease,background-color .16s ease;
}
[data-vibeui-block="toast-012"] [data-part="cancel"]:hover{color:var(--vibeui-toast-012-fg);background:oklch(1 0 0 / 10%)}
[data-vibeui-block="toast-012"] [data-part="cancel"]:focus-visible{outline:2px solid var(--vibeui-toast-012-tone);outline-offset:2px}
/* Готово: карточка не пересоздаётся, значок и строка меняются на месте. */
[data-vibeui-block="toast-012"] [data-part="done"]{display:flex;align-items:center;gap:0.625rem}
[data-vibeui-block="toast-012"] [data-part="mark"]{
flex:none;width:1.375rem;height:1.375rem;border-radius:9999px;
display:flex;align-items:center;justify-content:center;
background:var(--vibeui-toast-012-done);color:oklch(0.99 0.005 265);
font-size:0.75rem;font-weight:800;line-height:1;
animation:vibeui-toast-012-pop .28s ease both;
}
[data-vibeui-block="toast-012"] [data-part="done-title"]{font-size:0.875rem;font-weight:640;line-height:1.35}
@keyframes vibeui-toast-012-pop{from{transform:scale(0.6);opacity:0}to{transform:scale(1);opacity:1}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-012"] *{animation:none!important;transition:none!important}}
`

type Phase = "loading" | "done" | "cancelled"

/**
 * Уведомление, которое само ведёт загрузку и само переключается на «готово».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast012({
  title = "Экспортируем видео",
  doneTitle = "Видео готово к скачиванию",
  cancelLabel = "Отменить",
  duration = 4000,
  onDone,
  onCancel,
  className,
  style,
  ...props
}: Toast012Props) {
  const [value, setValue] = useState(0)
  const [phase, setPhase] = useState<Phase>("loading")

  useEffect(() => {
    if (phase !== "loading") return

    const step = 100
    const started = Date.now()

    const timer = setInterval(() => {
      const elapsed = Date.now() - started
      const next = Math.min(100, Math.round((elapsed / duration) * 100))
      setValue(next)

      if (next >= 100) {
        clearInterval(timer)
        setPhase("done")
        onDone?.()
      }
    }, step)

    return () => clearInterval(timer)
  }, [phase, duration, onDone])

  const palette = {
    "--vibeui-toast-012-value": value,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toast-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="toast-012"
        role="status"
        aria-live="polite"
        className={className}
        style={palette}
      >
        {phase === "done" ? (
          <div data-part="done">
            <span data-part="mark" aria-hidden="true">
              ✓
            </span>
            <p data-part="done-title">{doneTitle}</p>
          </div>
        ) : (
          <>
            <div data-part="head">
              <p data-part="title">{title}</p>
              <span data-part="percent">{value}%</span>
            </div>
            <div
              data-part="track"
              role="progressbar"
              aria-valuenow={value}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={title}
            >
              <span data-part="fill" />
            </div>
            <div data-part="foot">
              <span data-part="hint">
                {phase === "cancelled" ? "Загрузка отменена" : "Идёт загрузка"}
              </span>
              {phase === "loading" ? (
                <button
                  type="button"
                  data-part="cancel"
                  onClick={() => {
                    setPhase("cancelled")
                    onCancel?.()
                  }}
                >
                  {cancelLabel}
                </button>
              ) : null}
            </div>
          </>
        )}
      </div>
    </>
  )
}
