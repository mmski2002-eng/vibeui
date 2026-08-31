"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
} from "react"

export type Resizable001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  defaultSize?: number
  min?: number
  max?: number
  step?: number
  onChange?: (size: number) => void
  accent?: string
}

// Идея компонента: две панели с перетаскиваемым разделителем, у которого мышь
// — не единственный способ. Разделитель объявлен role="separator" с
// aria-valuenow и берёт фокус, поэтому размер меняется стрелками, а Home и End
// уводят его к краям. Захват указателя отдан браузеру: setPointerCapture
// продолжает слать события, даже когда курсор ушёл за пределы полосы.
const STYLES = `
:where([data-vibeui-block="resizable-001"]){
--vibeui-resizable-001-bg:oklch(1 0 0);
--vibeui-resizable-001-fg:oklch(0.22 0.014 265);
--vibeui-resizable-001-muted:oklch(0.55 0.014 265);
--vibeui-resizable-001-border:oklch(0.9 0.006 265);
--vibeui-resizable-001-surface:oklch(0.975 0.004 265);
--vibeui-resizable-001-accent:oklch(0.55 0.17 265);
--vibeui-resizable-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="resizable-001"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:34rem;padding:0.875rem;
border:1px solid var(--vibeui-resizable-001-border);border-radius:0.875rem;
background:var(--vibeui-resizable-001-bg);color:var(--vibeui-resizable-001-fg);
font-family:var(--vibeui-resizable-001-font);
}
[data-vibeui-block="resizable-001"] *{box-sizing:border-box}
[data-vibeui-block="resizable-001"] [data-part="frame"]{
display:flex;align-items:stretch;height:11rem;
border:1px solid var(--vibeui-resizable-001-border);border-radius:0.75rem;overflow:hidden;
background:var(--vibeui-resizable-001-surface);
}
[data-vibeui-block="resizable-001"] [data-part="pane"]{
min-width:0;padding:0.75rem;overflow:auto;background:var(--vibeui-resizable-001-bg);
}
[data-vibeui-block="resizable-001"] [data-part="pane"][data-role="primary"]{flex:none}
[data-vibeui-block="resizable-001"] [data-part="pane"][data-role="rest"]{flex:1}
[data-vibeui-block="resizable-001"] h3{margin:0 0 0.375rem;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="resizable-001"] p{margin:0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-resizable-001-muted)}
/* Полоса-разделитель шире своей видимой линии: попасть в 1 пиксель мышью
   почти невозможно, поэтому цель нажатия — 0.75rem, а линия внутри тонкая. */
[data-vibeui-block="resizable-001"] [data-part="split"]{
flex:none;width:0.75rem;padding:0;border:0;position:relative;
background:var(--vibeui-resizable-001-surface);
cursor:col-resize;touch-action:none;
transition:background-color .15s ease;
}
[data-vibeui-block="resizable-001"] [data-part="split"]::before{
content:"";position:absolute;inset:0 calc(50% - 0.5px);
background:var(--vibeui-resizable-001-border);
}
[data-vibeui-block="resizable-001"] [data-part="split"]::after{
content:"";position:absolute;top:50%;left:50%;
width:0.1875rem;height:1.75rem;margin:-0.875rem 0 0 -0.09375rem;border-radius:9999px;
background:var(--vibeui-resizable-001-border);
}
[data-vibeui-block="resizable-001"] [data-part="split"]:hover::after,
[data-vibeui-block="resizable-001"] [data-part="split"][data-dragging="true"]::after{
background:var(--vibeui-resizable-001-accent);
}
[data-vibeui-block="resizable-001"] [data-part="split"]:focus-visible{
outline:2px solid var(--vibeui-resizable-001-accent);outline-offset:-2px;
}
[data-vibeui-block="resizable-001"] [data-part="status"]{
margin:0;font-size:0.75rem;color:var(--vibeui-resizable-001-muted);
font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="resizable-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Две панели с разделителем, который работает и мышью, и с клавиатуры:
 * стрелки меняют размер, Home и End уводят к краям. Один файл.
 */
export function Resizable001({
  label = "Ширина списка",
  defaultSize = 42,
  min = 20,
  max = 80,
  step = 4,
  onChange,
  accent,
  className,
  style,
  ...props
}: Resizable001Props) {
  const [size, setSize] = useState(defaultSize)
  const [dragging, setDragging] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const paneId = useId()

  const palette = {
    ...(accent ? { "--vibeui-resizable-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  const apply = (next: number) => {
    const clamped = Math.min(max, Math.max(min, next))

    setSize(clamped)
    onChange?.(clamped)
  }

  const dragTo = (event: PointerEvent<HTMLDivElement>) => {
    const box = frame.current?.getBoundingClientRect()

    if (!box || box.width === 0) {
      return
    }

    apply(((event.clientX - box.left) / box.width) * 100)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      apply(size - step)
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      apply(size + step)
    } else if (event.key === "Home") {
      event.preventDefault()
      apply(min)
    } else if (event.key === "End") {
      event.preventDefault()
      apply(max)
    }
  }

  return (
    <>
      <style href="vibeui-resizable-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="resizable-001"
        className={className}
        style={palette}
      >
        <div data-part="frame" ref={frame}>
          <section
            data-part="pane"
            data-role="primary"
            id={paneId}
            style={{ width: `${size}%` }}
            aria-label="Список писем"
          >
            <h3>Входящие</h3>
            <p>
              Тяните разделитель или встаньте на него табом и жмите стрелки.
            </p>
          </section>
          <div
            data-part="split"
            role="separator"
            tabIndex={0}
            aria-orientation="vertical"
            aria-label={label}
            aria-controls={paneId}
            aria-valuenow={Math.round(size)}
            aria-valuemin={min}
            aria-valuemax={max}
            data-dragging={dragging}
            onKeyDown={onKeyDown}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId)
              setDragging(true)
            }}
            onPointerMove={(event) => {
              if (dragging) {
                dragTo(event)
              }
            }}
            onPointerUp={(event) => {
              event.currentTarget.releasePointerCapture(event.pointerId)
              setDragging(false)
            }}
            onPointerCancel={() => setDragging(false)}
          />
          <section data-part="pane" data-role="rest" aria-label="Письмо">
            <h3>Договор на подпись</h3>
            <p>
              Правая панель занимает остаток: её ширина не хранится отдельно и
              потому не может разойтись с левой.
            </p>
          </section>
        </div>
        <p data-part="status" role="status">
          Левая панель — {Math.round(size)}% ширины.
        </p>
      </div>
    </>
  )
}
