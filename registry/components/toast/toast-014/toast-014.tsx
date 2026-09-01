"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toast014Corner =
  "top-left" | "top-right" | "bottom-left" | "bottom-right"

export type Toast014Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  defaultCorner?: Toast014Corner
  message?: string
  closeLabel?: string
}

// Идея компонента: угол — это не только положение, но и направление, откуда
// уведомление приходит. Переключатель меняет угол сцены, а карточка каждый
// раз въезжает со своей стороны, поэтому разница между углами видна сразу.
const STYLES = `
:where([data-vibeui-block="toast-014"]){
--vibeui-toast-014-bg:oklch(0.97 0.004 265);
--vibeui-toast-014-fg:oklch(0.24 0.014 265);
--vibeui-toast-014-muted:oklch(0.55 0.014 265);
--vibeui-toast-014-border:oklch(0.9 0.006 265);
--vibeui-toast-014-card:oklch(1 0 0);
--vibeui-toast-014-tone:oklch(0.58 0.16 265);
--vibeui-toast-014-offset:0.875rem;
--vibeui-toast-014-radius:0.875rem;
--vibeui-toast-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toast-014"]{
width:100%;max-width:30rem;box-sizing:border-box;
font-family:var(--vibeui-toast-014-font);color:var(--vibeui-toast-014-fg);
}
[data-vibeui-block="toast-014"] [data-part="picker"]{
display:flex;flex-wrap:wrap;gap:0.375rem;margin:0 0 0.625rem;
}
[data-vibeui-block="toast-014"] [data-part="picker"] button{
appearance:none;cursor:pointer;
border:1px solid var(--vibeui-toast-014-border);background:var(--vibeui-toast-014-card);
border-radius:0.5rem;padding:0.3125rem 0.625rem;
font:inherit;font-size:0.75rem;color:var(--vibeui-toast-014-muted);
transition:color .16s ease,border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="toast-014"] [data-part="picker"] button:hover{color:var(--vibeui-toast-014-fg)}
[data-vibeui-block="toast-014"] [data-part="picker"] button[aria-pressed="true"]{
color:var(--vibeui-toast-014-tone);border-color:var(--vibeui-toast-014-tone);
background:color-mix(in oklab,var(--vibeui-toast-014-tone) 10%,var(--vibeui-toast-014-card));
}
[data-vibeui-block="toast-014"] [data-part="picker"] button:focus-visible{outline:2px solid var(--vibeui-toast-014-tone);outline-offset:2px}
/* Сцена изображает окно приложения: без неё «угол экрана» показать нечем. */
[data-vibeui-block="toast-014"] [data-part="stage"]{
position:relative;overflow:hidden;box-sizing:border-box;
min-height:12rem;border:1px solid var(--vibeui-toast-014-border);
border-radius:1rem;
background:
linear-gradient(0deg,oklch(0.88 0.008 265 / 45%) 1px,transparent 1px) 0 0 / 100% 1.5rem,
linear-gradient(90deg,oklch(0.88 0.008 265 / 45%) 1px,transparent 1px) 0 0 / 1.5rem 100%,
var(--vibeui-toast-014-bg);
}
[data-vibeui-block="toast-014"] [data-part="hint"]{
position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
margin:0;font-size:0.75rem;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-toast-014-muted);
}
[data-vibeui-block="toast-014"] [data-part="card"]{
position:absolute;z-index:2;display:flex;align-items:center;gap:0.625rem;
box-sizing:border-box;max-width:calc(100% - var(--vibeui-toast-014-offset) * 2);
padding:0.6875rem 0.8125rem;
border:1px solid var(--vibeui-toast-014-border);
border-radius:var(--vibeui-toast-014-radius);
background:var(--vibeui-toast-014-card);
font-size:0.8125rem;line-height:1.35;
box-shadow:0 16px 34px -22px oklch(0.2 0.02 265 / 55%);
}
[data-vibeui-block="toast-014"][data-corner^="top"] [data-part="card"]{top:var(--vibeui-toast-014-offset)}
[data-vibeui-block="toast-014"][data-corner^="bottom"] [data-part="card"]{bottom:var(--vibeui-toast-014-offset)}
[data-vibeui-block="toast-014"][data-corner$="left"] [data-part="card"]{left:var(--vibeui-toast-014-offset)}
[data-vibeui-block="toast-014"][data-corner$="right"] [data-part="card"]{right:var(--vibeui-toast-014-offset)}
[data-vibeui-block="toast-014"][data-corner="top-left"] [data-part="card"]{animation:vibeui-toast-014-from-left .32s ease both}
[data-vibeui-block="toast-014"][data-corner="bottom-left"] [data-part="card"]{animation:vibeui-toast-014-from-left .32s ease both}
[data-vibeui-block="toast-014"][data-corner="top-right"] [data-part="card"]{animation:vibeui-toast-014-from-right .32s ease both}
[data-vibeui-block="toast-014"][data-corner="bottom-right"] [data-part="card"]{animation:vibeui-toast-014-from-right .32s ease both}
@keyframes vibeui-toast-014-from-left{from{opacity:0;translate:-1.25rem 0}to{opacity:1;translate:0 0}}
@keyframes vibeui-toast-014-from-right{from{opacity:0;translate:1.25rem 0}to{opacity:1;translate:0 0}}
[data-vibeui-block="toast-014"] [data-part="dot"]{
flex:none;width:0.5rem;height:0.5rem;border-radius:9999px;background:var(--vibeui-toast-014-tone);
}
[data-vibeui-block="toast-014"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;background:transparent;flex:none;
display:flex;align-items:center;justify-content:center;
width:1.25rem;height:1.25rem;padding:0;border-radius:9999px;
color:var(--vibeui-toast-014-muted);font-size:0.9375rem;line-height:1;
}
[data-vibeui-block="toast-014"] [data-part="close"]:hover{background:oklch(0 0 0 / 6%);color:var(--vibeui-toast-014-fg)}
[data-vibeui-block="toast-014"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-toast-014-tone);outline-offset:2px}
[data-vibeui-block="toast-014"] [data-part="legend"]{
display:flex;align-items:center;gap:0.375rem;margin:0.625rem 0 0;
font-size:0.75rem;color:var(--vibeui-toast-014-muted);
}
[data-vibeui-block="toast-014"] [data-part="legend"] b{color:var(--vibeui-toast-014-fg);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-014"] *{animation:none!important;transition:none!important}}
`

const CORNERS: { value: Toast014Corner; label: string }[] = [
  { value: "top-left", label: "Сверху слева" },
  { value: "top-right", label: "Сверху справа" },
  { value: "bottom-left", label: "Снизу слева" },
  { value: "bottom-right", label: "Снизу справа" },
]

/**
 * Выбор угла появления: переключатель меняет позицию, карточка въезжает со
 * своей стороны. Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast014({
  defaultCorner = "bottom-right",
  message = "Файл выгружен в облако",
  closeLabel = "Закрыть",
  className,
  style,
  ...props
}: Toast014Props) {
  const [corner, setCorner] = useState<Toast014Corner>(defaultCorner)
  const [visible, setVisible] = useState(true)

  return (
    <>
      <style href="vibeui-toast-014" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="toast-014"
        data-corner={corner}
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="picker" role="group" aria-label="Угол появления">
          {CORNERS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={corner === option.value}
              onClick={() => {
                setCorner(option.value)
                setVisible(true)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div data-part="stage">
          <p data-part="hint">область приложения</p>
          {visible ? (
            <div
              key={corner}
              data-part="card"
              role="status"
              aria-live="polite"
            >
              <span data-part="dot" aria-hidden="true" />
              <span>{message}</span>
              <button
                type="button"
                data-part="close"
                aria-label={closeLabel}
                onClick={() => setVisible(false)}
              >
                ×
              </button>
            </div>
          ) : null}
        </div>
        <p data-part="legend">
          угол появления: <b>{corner}</b>
        </p>
      </div>
    </>
  )
}
