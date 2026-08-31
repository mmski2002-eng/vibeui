"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
} from "react"

export type Resizable005Props = Omit<
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

// Идея компонента: разделитель, который умеет сворачивать панель в ноль.
// Двойное нажатие и Enter делают одно и то же, а прошлый размер запоминается,
// поэтому разворот возвращает панель туда же, откуда её убрали. Ноль остаётся
// честным значением aria-valuenow: свёрнутая панель — это размер 0, а не
// исчезнувший элемент.
const STYLES = `
:where([data-vibeui-block="resizable-005"]){
--vibeui-resizable-005-bg:oklch(1 0 0);
--vibeui-resizable-005-fg:oklch(0.22 0.014 265);
--vibeui-resizable-005-muted:oklch(0.55 0.014 265);
--vibeui-resizable-005-border:oklch(0.9 0.006 265);
--vibeui-resizable-005-surface:oklch(0.975 0.004 265);
--vibeui-resizable-005-accent:oklch(0.55 0.16 25);
--vibeui-resizable-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="resizable-005"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:34rem;padding:0.875rem;
border:1px solid var(--vibeui-resizable-005-border);border-radius:0.875rem;
background:var(--vibeui-resizable-005-bg);color:var(--vibeui-resizable-005-fg);
font-family:var(--vibeui-resizable-005-font);
}
[data-vibeui-block="resizable-005"] *{box-sizing:border-box}
[data-vibeui-block="resizable-005"] [data-part="frame"]{
display:flex;align-items:stretch;height:11rem;
border:1px solid var(--vibeui-resizable-005-border);border-radius:0.75rem;overflow:hidden;
}
[data-vibeui-block="resizable-005"] [data-part="side"]{
flex:none;min-width:0;overflow:hidden;background:var(--vibeui-resizable-005-surface);
transition:width .18s ease;
}
[data-vibeui-block="resizable-005"] [data-part="inner"]{padding:0.75rem;min-width:9rem}
[data-vibeui-block="resizable-005"] [data-part="main"]{
flex:1;min-width:0;padding:0.75rem;overflow:auto;background:var(--vibeui-resizable-005-bg);
}
[data-vibeui-block="resizable-005"] h3{margin:0 0 0.375rem;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="resizable-005"] p{margin:0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-resizable-005-muted)}
[data-vibeui-block="resizable-005"] [data-part="split"]{
flex:none;width:0.875rem;position:relative;
display:flex;align-items:center;justify-content:center;
background:var(--vibeui-resizable-005-surface);cursor:col-resize;touch-action:none;
border-left:1px solid var(--vibeui-resizable-005-border);
border-right:1px solid var(--vibeui-resizable-005-border);
}
[data-vibeui-block="resizable-005"] [data-part="split"] svg{
width:0.625rem;height:0.625rem;color:var(--vibeui-resizable-005-muted);
transition:transform .18s ease,color .15s ease;
}
[data-vibeui-block="resizable-005"] [data-part="split"]:hover svg{color:var(--vibeui-resizable-005-accent)}
[data-vibeui-block="resizable-005"] [data-part="split"]:focus-visible{
outline:2px solid var(--vibeui-resizable-005-accent);outline-offset:-2px;
}
/* Стрелка на разделителе смотрит туда, куда уедет панель: свёрнутая — вправо,
   развёрнутая — влево. Подсказка про двойное нажатие без неё не читается. */
[data-vibeui-block="resizable-005"][data-collapsed="true"] [data-part="split"]{cursor:e-resize}
[data-vibeui-block="resizable-005"][data-collapsed="true"] [data-part="split"] svg{transform:rotate(180deg)}
[data-vibeui-block="resizable-005"] [data-part="status"]{
margin:0;font-size:0.75rem;color:var(--vibeui-resizable-005-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="resizable-005"] *{animation:none!important;transition:none!important}}
`

/**
 * Разделитель со сворачиванием панели в ноль: двойное нажатие и Enter
 * сворачивают, прошлый размер запоминается. Один файл, ноль зависимостей.
 */
export function Resizable005({
  label = "Ширина панели фильтров",
  defaultSize = 210,
  min = 150,
  max = 320,
  step = 20,
  onChange,
  accent,
  className,
  style,
  ...props
}: Resizable005Props) {
  const [size, setSize] = useState(defaultSize)
  const [dragging, setDragging] = useState(false)
  const restore = useRef(defaultSize)
  const frame = useRef<HTMLDivElement>(null)
  const sideId = useId()

  const palette = {
    ...(accent ? { "--vibeui-resizable-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  const collapsed = size === 0

  const apply = (next: number) => {
    const clamped = Math.round(Math.min(max, Math.max(min, next)))

    setSize(clamped)
    onChange?.(clamped)
  }

  const toggle = () => {
    if (collapsed) {
      apply(restore.current)
      return
    }

    restore.current = size
    setSize(0)
    onChange?.(0)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      toggle()
    } else if (event.key === "ArrowLeft") {
      event.preventDefault()
      apply((collapsed ? restore.current : size) - step)
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      apply((collapsed ? min : size) + step)
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
      <style href="vibeui-resizable-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="resizable-005"
        data-collapsed={collapsed}
        className={className}
        style={palette}
      >
        <div data-part="frame" ref={frame}>
          <aside
            data-part="side"
            id={sideId}
            style={{ width: `${size}px` }}
            aria-label="Фильтры"
          >
            <div data-part="inner">
              <h3>Фильтры</h3>
              <p>
                Свёрнутая панель остаётся в разметке: её ширина — ноль, а не
                отсутствие.
              </p>
            </div>
          </aside>
          <div
            data-part="split"
            role="separator"
            tabIndex={0}
            aria-orientation="vertical"
            aria-label={label}
            aria-controls={sideId}
            aria-valuenow={size}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuetext={collapsed ? "свёрнута" : `${size} пикселей`}
            data-dragging={dragging}
            onKeyDown={onKeyDown}
            onDoubleClick={toggle}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId)
              setDragging(true)
            }}
            onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
              if (!dragging) {
                return
              }

              const box = frame.current?.getBoundingClientRect()

              if (!box) {
                return
              }

              const next = event.clientX - box.left

              // Тянуть панель ниже минимума бессмысленно: до половины
              // минимума она сворачивается целиком, а не мнётся в полоску.
              if (next < min / 2) {
                if (!collapsed) {
                  restore.current = size || restore.current
                  setSize(0)
                  onChange?.(0)
                }

                return
              }

              apply(next)
            }}
            onPointerUp={(event) => {
              event.currentTarget.releasePointerCapture(event.pointerId)
              setDragging(false)
            }}
            onPointerCancel={() => setDragging(false)}
          >
            <svg viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path
                d="M6.5 1.5 3 5l3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <main data-part="main">
            <h3>Результаты</h3>
            <p>
              Двойное нажатие на разделителе сворачивает панель, Enter делает то
              же самое с клавиатуры.
            </p>
          </main>
        </div>
        <p data-part="status" role="status">
          {collapsed ? "Панель свёрнута" : `Панель — ${size} px`}
        </p>
      </div>
    </>
  )
}
