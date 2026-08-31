"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
} from "react"

export type Resizable007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  defaultRatio?: number
  min?: number
  max?: number
  step?: number
  onChange?: (ratio: number) => void
  accent?: string
}

// Идея компонента: пропорция хранится в самой раскладке. Колонки заданы в fr,
// поэтому при изменении ширины контейнера панели делят место в той же
// пропорции — без обработчика resize, без пересчёта в пикселях и без прыжка
// при первом рендере на сервере.
const STYLES = `
:where([data-vibeui-block="resizable-007"]){
--vibeui-resizable-007-bg:oklch(1 0 0);
--vibeui-resizable-007-fg:oklch(0.22 0.014 265);
--vibeui-resizable-007-muted:oklch(0.55 0.014 265);
--vibeui-resizable-007-border:oklch(0.9 0.006 265);
--vibeui-resizable-007-surface:oklch(0.975 0.004 265);
--vibeui-resizable-007-accent:oklch(0.54 0.17 300);
--vibeui-resizable-007-left:1;
--vibeui-resizable-007-right:1;
--vibeui-resizable-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="resizable-007"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:34rem;padding:0.875rem;
border:1px solid var(--vibeui-resizable-007-border);border-radius:0.875rem;
background:var(--vibeui-resizable-007-bg);color:var(--vibeui-resizable-007-fg);
font-family:var(--vibeui-resizable-007-font);
}
[data-vibeui-block="resizable-007"] *{box-sizing:border-box}
/* Пропорция живёт в grid-template-columns: две доли fr и полоса между ними.
   Меняется только одно число — раскладка пересчитывается сама. */
[data-vibeui-block="resizable-007"] [data-part="frame"]{
display:grid;height:11rem;
grid-template-columns:calc(var(--vibeui-resizable-007-left) * 1fr) 0.75rem calc(var(--vibeui-resizable-007-right) * 1fr);
border:1px solid var(--vibeui-resizable-007-border);border-radius:0.75rem;overflow:hidden;
}
[data-vibeui-block="resizable-007"] [data-part="pane"]{
min-width:0;padding:0.75rem;overflow:auto;background:var(--vibeui-resizable-007-bg);
}
[data-vibeui-block="resizable-007"] [data-part="pane"][data-role="second"]{background:var(--vibeui-resizable-007-surface)}
[data-vibeui-block="resizable-007"] h3{margin:0 0 0.375rem;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="resizable-007"] p{margin:0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-resizable-007-muted)}
[data-vibeui-block="resizable-007"] [data-part="split"]{
position:relative;background:var(--vibeui-resizable-007-surface);
cursor:col-resize;touch-action:none;
}
[data-vibeui-block="resizable-007"] [data-part="split"]::before{
content:"";position:absolute;inset:0 calc(50% - 0.5px);background:var(--vibeui-resizable-007-border);
transition:background-color .15s ease;
}
[data-vibeui-block="resizable-007"] [data-part="split"]:hover::before,
[data-vibeui-block="resizable-007"] [data-part="split"][data-dragging="true"]::before{
inset:0 calc(50% - 1.5px);background:var(--vibeui-resizable-007-accent);
}
[data-vibeui-block="resizable-007"] [data-part="split"]:focus-visible{
outline:2px solid var(--vibeui-resizable-007-accent);outline-offset:-2px;
}
[data-vibeui-block="resizable-007"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="resizable-007"] [data-part="status"]{
margin:0;font-size:0.75rem;color:var(--vibeui-resizable-007-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="resizable-007"] button{
appearance:none;cursor:pointer;font:inherit;border:0;background:none;padding:0;
color:var(--vibeui-resizable-007-accent);font-size:0.75rem;font-weight:600;
text-decoration:underline;text-underline-offset:0.2em;
}
[data-vibeui-block="resizable-007"] button:focus-visible{
outline:2px solid var(--vibeui-resizable-007-accent);outline-offset:2px;border-radius:0.25rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="resizable-007"] *{animation:none!important;transition:none!important}}
`

/**
 * Две панели, которые держат пропорцию: доли заданы в fr, поэтому при смене
 * ширины контейнера отношение не меняется. Один файл, ноль зависимостей.
 */
export function Resizable007({
  label = "Пропорция панелей",
  defaultRatio = 38,
  min = 20,
  max = 80,
  step = 4,
  onChange,
  accent,
  className,
  style,
  ...props
}: Resizable007Props) {
  const [ratio, setRatio] = useState(defaultRatio)
  const [dragging, setDragging] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const paneId = useId()

  const palette = {
    "--vibeui-resizable-007-left": String(Math.round(ratio)),
    "--vibeui-resizable-007-right": String(100 - Math.round(ratio)),
    ...(accent ? { "--vibeui-resizable-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  const apply = (next: number) => {
    const clamped = Math.min(max, Math.max(min, next))

    setRatio(clamped)
    onChange?.(clamped)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      apply(ratio - step)
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      apply(ratio + step)
    } else if (event.key === "Home") {
      event.preventDefault()
      apply(min)
    } else if (event.key === "End") {
      event.preventDefault()
      apply(max)
    }
  }

  const left = Math.round(ratio / 5)
  const right = 20 - left

  return (
    <>
      <style href="vibeui-resizable-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="resizable-007"
        className={className}
        style={palette}
      >
        <div data-part="frame" ref={frame}>
          <section data-part="pane" id={paneId} aria-label="Черновик">
            <h3>Черновик</h3>
            <p>
              Доли заданы в fr: при сужении окна обе панели уменьшаются вместе и
              отношение сохраняется.
            </p>
          </section>
          <div
            data-part="split"
            role="separator"
            tabIndex={0}
            aria-orientation="vertical"
            aria-label={label}
            aria-controls={paneId}
            aria-valuenow={Math.round(ratio)}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuetext={`${left} к ${right}`}
            data-dragging={dragging}
            onKeyDown={onKeyDown}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId)
              setDragging(true)
            }}
            onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
              if (!dragging) {
                return
              }

              const box = frame.current?.getBoundingClientRect()

              if (!box || box.width === 0) {
                return
              }

              apply(((event.clientX - box.left) / box.width) * 100)
            }}
            onPointerUp={(event) => {
              event.currentTarget.releasePointerCapture(event.pointerId)
              setDragging(false)
            }}
            onPointerCancel={() => setDragging(false)}
          />
          <section data-part="pane" data-role="second" aria-label="Просмотр">
            <h3>Просмотр</h3>
            <p>
              Пиксельная ширина сюда не записывается, поэтому раскладка
              переживает поворот телефона без обработчика resize.
            </p>
          </section>
        </div>
        <div data-part="foot">
          <p data-part="status" role="status">
            Пропорция {left} : {right}
          </p>
          <button type="button" onClick={() => apply(50)}>
            Поровну
          </button>
        </div>
      </div>
    </>
  )
}
