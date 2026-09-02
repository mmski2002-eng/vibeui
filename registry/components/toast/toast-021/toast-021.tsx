"use client"

import { useEffect, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toast021Tone = "neutral" | "success" | "warning"

export type Toast021Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  message?: string
  tone?: Toast021Tone
  glyph?: string
  closeLabel?: string
  replayLabel?: string
  stageHint?: string
  /** Подложка сцены. Пусто — штатная палитра. */
  background?: string
  /** Через сколько мс пилюля прячется сама; 0 — не прятать. */
  autoHideMs?: number
  onDismiss?: () => void
}

// Идея компонента: системная пилюля, а не карточка сообщения. Она держится
// у верхнего края области, а не плывёт вместе с контентом, — как индикатор
// громкости или AirDrop в нативном интерфейсе. Сцена с сеткой изображает
// окно приложения: без неё «сверху по центру» показать нечем, а карточка
// заезжает сверху и уезжает сама через autoHideMs.
//
// Тема берётся из color-scheme окружения через light-dark(): пилюля всегда
// противоположна сцене по светлоте, поэтому в тёмной ветке она светлая, а
// подложка крестика на ней темнее, а не светлее.
const STYLES = `
:where([data-vibeui-block="toast-021"]){
--vibeui-toast-021-bg:light-dark(oklch(0.99 0.002 265),oklch(0.24 0.014 265));
--vibeui-toast-021-stage:light-dark(oklch(0.97 0.004 265),oklch(0.21 0.012 265));
--vibeui-toast-021-grid:light-dark(oklch(0.88 0.008 265 / 45%),oklch(0.52 0.014 265 / 40%));
--vibeui-toast-021-fg:light-dark(oklch(0.22 0.014 265),oklch(0.95 0.003 265));
--vibeui-toast-021-muted:light-dark(oklch(0.55 0.014 265),oklch(0.74 0.01 265));
--vibeui-toast-021-border:light-dark(oklch(0.9 0.006 265),oklch(0.38 0.014 265));
--vibeui-toast-021-key:light-dark(oklch(1 0 0 / 14%),oklch(0.2 0.02 265 / 12%));
--vibeui-toast-021-key-hover:light-dark(oklch(1 0 0 / 22%),oklch(0.2 0.02 265 / 20%));
--vibeui-toast-021-shadow:light-dark(oklch(0.15 0.02 265 / 70%),oklch(0.03 0.01 265 / 78%));
--vibeui-toast-021-tone:light-dark(oklch(0.58 0.16 265),oklch(0.6 0.15 265));
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
linear-gradient(0deg,var(--vibeui-toast-021-grid) 1px,transparent 1px) 0 0 / 100% 1.5rem,
linear-gradient(90deg,var(--vibeui-toast-021-grid) 1px,transparent 1px) 0 0 / 1.5rem 100%,
var(--vibeui-toast-021-stage);
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
box-shadow:0 16px 34px -20px var(--vibeui-toast-021-shadow);
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
background:var(--vibeui-toast-021-key);color:inherit;font-size:0.8125rem;line-height:1;
}
[data-vibeui-block="toast-021"] [data-part="close"]:hover{background:var(--vibeui-toast-021-key-hover)}
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

// Тон читается на самой пилюле, а она в тёмной теме светлая: пары светлот
// у каждого тона свои, инверсией одной ветки их не получить.
const TONE_COLOR: Record<Toast021Tone, string> = {
  neutral: "light-dark(oklch(0.82 0.02 265),oklch(0.45 0.02 265))",
  success: "light-dark(oklch(0.78 0.13 152),oklch(0.52 0.14 152))",
  warning: "light-dark(oklch(0.82 0.15 85),oklch(0.58 0.14 70))",
}

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
 * Компактная пилюля по центру сверху сцены: заезжает сверху, прячется сама
 * или по крестику. Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast021({
  message = "Обновление установлено",
  tone = "success",
  glyph = "✓",
  closeLabel = "Закрыть",
  replayLabel = "Показать снова",
  stageHint = "область приложения",
  background = "",
  autoHideMs = 3200,
  onDismiss,
  className,
  style,
  ...props
}: Toast021Props) {
  const [visible, setVisible] = useState(true)
  const [replayKey, setReplayKey] = useState(0)

  const palette = {
    ...(background
      ? {
          "--vibeui-toast-021-stage": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

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
        style={palette}
      >
        <div data-part="stage">
          <p data-part="hint">{stageHint}</p>
          {visible ? (
            <div
              key={replayKey}
              data-part="pill"
              role="status"
              aria-live="polite"
              style={
                { "--vibeui-toast-021-tone": TONE_COLOR[tone] } as CSSProperties
              }
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
