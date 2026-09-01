"use client"

import { useEffect, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toast021Tone = "neutral" | "success" | "warning"

export type Toast021Props = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  message?: string
  tone?: Toast021Tone
  glyph?: string
  closeLabel?: string
  replayLabel?: string
  /** Через сколько мс пилюля прячется сама; 0 — не прятать. */
  autoHideMs?: number
  onDismiss?: () => void
}

// Идея компонента: системная пилюля, а не карточка сообщения. Она держится
// у верхнего края области, а не плывёт вместе с контентом, — как индикатор
// громкости или AirDrop в нативном интерфейсе. Сцена с сеткой изображает
// окно приложения: без неё «сверху по центру» показать нечем, а карточка
// заезжает сверху и уезжает сама через autoHideMs.
const STYLES = `
:where([data-vibeui-block="toast-021"]){
--vibeui-toast-021-bg:oklch(0.99 0.002 265);
--vibeui-toast-021-fg:oklch(0.22 0.014 265);
--vibeui-toast-021-muted:oklch(0.55 0.014 265);
--vibeui-toast-021-border:oklch(0.9 0.006 265);
--vibeui-toast-021-tone:oklch(0.58 0.16 265);
--vibeui-toast-021-offset:0.75rem;
--vibeui-toast-021-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toast-021"]{
width:100%;max-width:30rem;box-sizing:border-box;
font-family:var(--vibeui-toast-021-font);color:var(--vibeui-toast-021-fg);
}
[data-vibeui-block="toast-021"] [data-part="stage"]{
position:relative;overflow:hidden;box-sizing:border-box;
min-height:10rem;border:1px solid var(--vibeui-toast-021-border);
border-radius:1rem;
background:
linear-gradient(0deg,oklch(0.88 0.008 265 / 45%) 1px,transparent 1px) 0 0 / 100% 1.5rem,
linear-gradient(90deg,oklch(0.88 0.008 265 / 45%) 1px,transparent 1px) 0 0 / 1.5rem 100%,
var(--vibeui-toast-021-bg);
}
[data-vibeui-block="toast-021"] [data-part="hint"]{
position:absolute;left:50%;bottom:0.875rem;transform:translateX(-50%);
margin:0;font-size:0.75rem;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-toast-021-muted);
}
[data-vibeui-block="toast-021"] [data-part="pill"]{
position:absolute;z-index:2;top:var(--vibeui-toast-021-offset);left:50%;
display:inline-flex;align-items:center;gap:0.5rem;
max-width:calc(100% - var(--vibeui-toast-021-offset) * 2);
box-sizing:border-box;padding:0.4375rem 0.5rem 0.4375rem 0.75rem;
border-radius:9999px;background:var(--vibeui-toast-021-fg);color:var(--vibeui-toast-021-bg);
font-size:0.8125rem;line-height:1.35;white-space:nowrap;
box-shadow:0 16px 34px -20px oklch(0.15 0.02 265 / 70%);
animation:vibeui-toast-021-drop .28s cubic-bezier(.2,.8,.3,1) both;
}
[data-vibeui-block="toast-021"] [data-part="glyph"]{
flex:none;display:flex;align-items:center;justify-content:center;
width:1.125rem;height:1.125rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-toast-021-tone) 55%,transparent);
font-size:0.625rem;font-weight:800;line-height:1;
}
[data-vibeui-block="toast-021"] [data-part="message"]{overflow:hidden;text-overflow:ellipsis}
[data-vibeui-block="toast-021"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;flex:none;
display:flex;align-items:center;justify-content:center;
width:1.25rem;height:1.25rem;padding:0;border-radius:9999px;
background:oklch(1 0 0 / 14%);color:inherit;font-size:0.8125rem;line-height:1;
}
[data-vibeui-block="toast-021"] [data-part="close"]:hover{background:oklch(1 0 0 / 22%)}
[data-vibeui-block="toast-021"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-toast-021-tone);outline-offset:2px}
@keyframes vibeui-toast-021-drop{
from{opacity:0;transform:translate(-50%,-0.625rem) scale(.94)}
to{opacity:1;transform:translate(-50%,0) scale(1)}
}
[data-vibeui-block="toast-021"] [data-part="replay"]{
margin-top:0.625rem;appearance:none;cursor:pointer;
border:1px solid var(--vibeui-toast-021-border);background:transparent;
border-radius:0.5rem;padding:0.3125rem 0.625rem;
font:inherit;font-size:0.75rem;color:var(--vibeui-toast-021-muted);
}
[data-vibeui-block="toast-021"] [data-part="replay"]:hover{color:var(--vibeui-toast-021-fg)}
[data-vibeui-block="toast-021"] [data-part="replay"]:focus-visible{outline:2px solid var(--vibeui-toast-021-tone);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-021"] *{animation:none!important;transition:none!important}}
`

const TONE_COLOR: Record<Toast021Tone, string> = {
  neutral: "oklch(0.82 0.02 265)",
  success: "oklch(0.78 0.13 152)",
  warning: "oklch(0.82 0.15 85)",
}

/**
 * Компактная пилюля по центру сверху сцены: заезжает сверху, прячется сама
 * или по крестику. Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast021({
  message = "Обновление установлено",
  tone = "success",
  glyph = "✓",
  closeLabel = "Закрыть",
  replayLabel = "Показать снова",
  autoHideMs = 3200,
  onDismiss,
  className,
  style,
  ...props
}: Toast021Props) {
  const [visible, setVisible] = useState(true)
  const [replayKey, setReplayKey] = useState(0)

  useEffect(() => {
    if (!visible || autoHideMs <= 0) return

    const timer = setTimeout(() => {
      setVisible(false)
      onDismiss?.()
    }, autoHideMs)

    return () => clearTimeout(timer)
  }, [visible, autoHideMs, onDismiss, replayKey])

  return (
    <>
      <style href="vibeui-toast-021" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="toast-021"
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="stage">
          <p data-part="hint">область приложения</p>
          {visible ? (
            <div
              key={replayKey}
              data-part="pill"
              role="status"
              aria-live="polite"
              style={{ "--vibeui-toast-021-tone": TONE_COLOR[tone] } as CSSProperties}
            >
              {glyph ? (
                <span data-part="glyph" aria-hidden="true">
                  {glyph}
                </span>
              ) : null}
              <span data-part="message">{message}</span>
              <button
                type="button"
                data-part="close"
                aria-label={closeLabel}
                onClick={() => {
                  setVisible(false)
                  onDismiss?.()
                }}
              >
                ×
              </button>
            </div>
          ) : null}
        </div>
        {!visible ? (
          <button
            type="button"
            data-part="replay"
            onClick={() => {
              setReplayKey((value) => value + 1)
              setVisible(true)
            }}
          >
            {replayLabel}
          </button>
        ) : null}
      </div>
    </>
  )
}
