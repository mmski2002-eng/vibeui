"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
} from "react"

export type Resizable003Props = Omit<
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

// Идея компонента: вертикальное разделение — редактор сверху, результат снизу.
// Разделитель здесь горизонтальный, поэтому aria-orientation="horizontal", а
// размер меняют стрелки вверх и вниз: у направления клавиш и у оси движения
// обязана быть одна логика, иначе с клавиатуры панель ведёт себя наугад.
const STYLES = `
:where([data-vibeui-block="resizable-003"]){
--vibeui-resizable-003-bg:oklch(1 0 0);
--vibeui-resizable-003-fg:oklch(0.22 0.014 265);
--vibeui-resizable-003-muted:oklch(0.55 0.014 265);
--vibeui-resizable-003-border:oklch(0.9 0.006 265);
--vibeui-resizable-003-surface:oklch(0.975 0.004 265);
--vibeui-resizable-003-code:oklch(0.28 0.02 265);
--vibeui-resizable-003-accent:oklch(0.6 0.16 145);
--vibeui-resizable-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-resizable-003-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
[data-vibeui-block="resizable-003"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:26rem;padding:0.875rem;
border:1px solid var(--vibeui-resizable-003-border);border-radius:0.875rem;
background:var(--vibeui-resizable-003-bg);color:var(--vibeui-resizable-003-fg);
font-family:var(--vibeui-resizable-003-font);
}
[data-vibeui-block="resizable-003"] *{box-sizing:border-box}
[data-vibeui-block="resizable-003"] [data-part="frame"]{
display:flex;flex-direction:column;height:15rem;
border:1px solid var(--vibeui-resizable-003-border);border-radius:0.75rem;overflow:hidden;
}
[data-vibeui-block="resizable-003"] [data-part="pane"]{min-height:0;overflow:auto}
[data-vibeui-block="resizable-003"] [data-part="pane"][data-role="rest"]{flex:1}
[data-vibeui-block="resizable-003"] [data-part="pane"][data-role="fixed"]{flex:none}
[data-vibeui-block="resizable-003"] [data-part="editor"]{
background:var(--vibeui-resizable-003-code);color:oklch(0.95 0.01 265);
font-family:var(--vibeui-resizable-003-mono);font-size:0.75rem;line-height:1.6;
padding:0.625rem 0.75rem;margin:0;white-space:pre;
}
[data-vibeui-block="resizable-003"] [data-part="result"]{padding:0.75rem;background:var(--vibeui-resizable-003-bg)}
[data-vibeui-block="resizable-003"] h3{margin:0 0 0.375rem;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="resizable-003"] p{margin:0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-resizable-003-muted)}
/* Разделитель тянется на всю ширину и имеет высоту 0.75rem: горизонтальную
   полосу ловят курсором хуже вертикальной, потому что двигают руку по игреку. */
[data-vibeui-block="resizable-003"] [data-part="split"]{
flex:none;height:0.75rem;position:relative;
background:var(--vibeui-resizable-003-surface);
cursor:row-resize;touch-action:none;
}
[data-vibeui-block="resizable-003"] [data-part="split"]::before{
content:"";position:absolute;inset:calc(50% - 0.5px) 0;background:var(--vibeui-resizable-003-border);
}
[data-vibeui-block="resizable-003"] [data-part="split"]::after{
content:"";position:absolute;left:50%;top:50%;
width:1.75rem;height:0.1875rem;margin:-0.09375rem 0 0 -0.875rem;border-radius:9999px;
background:var(--vibeui-resizable-003-border);
transition:background-color .15s ease;
}
[data-vibeui-block="resizable-003"] [data-part="split"]:hover::after,
[data-vibeui-block="resizable-003"] [data-part="split"][data-dragging="true"]::after{
background:var(--vibeui-resizable-003-accent);
}
[data-vibeui-block="resizable-003"] [data-part="split"]:focus-visible{
outline:2px solid var(--vibeui-resizable-003-accent);outline-offset:-2px;
}
[data-vibeui-block="resizable-003"] [data-part="status"]{
margin:0;font-size:0.75rem;color:var(--vibeui-resizable-003-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="resizable-003"] *{animation:none!important;transition:none!important}}
`

const CODE = `.card {
  display: grid;
  gap: 12px;
  padding: 16px;
}`

/**
 * Вертикальное разделение: редактор сверху, результат снизу, размер меняют
 * перетаскивание и стрелки вверх-вниз. Один файл, ноль зависимостей.
 */
export function Resizable003({
  label = "Высота редактора",
  defaultSize = 52,
  min = 20,
  max = 80,
  step = 5,
  onChange,
  accent,
  className,
  style,
  ...props
}: Resizable003Props) {
  const [size, setSize] = useState(defaultSize)
  const [dragging, setDragging] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const editorId = useId()

  const palette = {
    ...(accent ? { "--vibeui-resizable-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  const apply = (next: number) => {
    const clamped = Math.min(max, Math.max(min, next))

    setSize(clamped)
    onChange?.(clamped)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault()
      apply(size - step)
    } else if (event.key === "ArrowDown") {
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
      <style href="vibeui-resizable-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="resizable-003"
        className={className}
        style={palette}
      >
        <div data-part="frame" ref={frame}>
          <section
            data-part="pane"
            data-role="fixed"
            id={editorId}
            style={{ height: `${size}%` }}
            aria-label="Редактор"
          >
            <pre data-part="editor">{CODE}</pre>
          </section>
          <div
            data-part="split"
            role="separator"
            tabIndex={0}
            aria-orientation="horizontal"
            aria-label={label}
            aria-controls={editorId}
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
              if (!dragging) {
                return
              }

              const box = frame.current?.getBoundingClientRect()

              if (!box || box.height === 0) {
                return
              }

              apply(((event.clientY - box.top) / box.height) * 100)
            }}
            onPointerUp={(event) => {
              event.currentTarget.releasePointerCapture(event.pointerId)
              setDragging(false)
            }}
            onPointerCancel={() => setDragging(false)}
          />
          <section data-part="pane" data-role="rest" aria-label="Результат">
            <div data-part="result">
              <h3>Карточка</h3>
              <p>
                Нижняя панель занимает остаток высоты, поэтому результат не
                исчезает, даже когда редактор растянут до предела.
              </p>
            </div>
          </section>
        </div>
        <p data-part="status" role="status">
          Редактор занимает {Math.round(size)}% высоты.
        </p>
      </div>
    </>
  )
}
