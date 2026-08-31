"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
} from "react"

export type Resizable002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  min?: number
  step?: number
  defaultLeft?: number
  defaultMiddle?: number
  onChange?: (sizes: number[]) => void
  accent?: string
}

// Идея компонента: три панели и два разделителя. Состояние хранится не как
// ширины панелей, а как положения границ — тогда соседняя панель не может
// «съехать» вслед за чужим округлением, а ограничения превращаются в простой
// зажим границы между соседями.
const STYLES = `
:where([data-vibeui-block="resizable-002"]){
--vibeui-resizable-002-bg:oklch(1 0 0);
--vibeui-resizable-002-fg:oklch(0.22 0.014 265);
--vibeui-resizable-002-muted:oklch(0.55 0.014 265);
--vibeui-resizable-002-border:oklch(0.9 0.006 265);
--vibeui-resizable-002-surface:oklch(0.975 0.004 265);
--vibeui-resizable-002-accent:oklch(0.56 0.15 195);
--vibeui-resizable-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="resizable-002"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:38rem;padding:0.875rem;
border:1px solid var(--vibeui-resizable-002-border);border-radius:0.875rem;
background:var(--vibeui-resizable-002-bg);color:var(--vibeui-resizable-002-fg);
font-family:var(--vibeui-resizable-002-font);
}
[data-vibeui-block="resizable-002"] *{box-sizing:border-box}
[data-vibeui-block="resizable-002"] [data-part="frame"]{
display:flex;align-items:stretch;height:10.5rem;
border:1px solid var(--vibeui-resizable-002-border);border-radius:0.75rem;overflow:hidden;
}
[data-vibeui-block="resizable-002"] [data-part="pane"]{
min-width:0;padding:0.625rem;overflow:auto;background:var(--vibeui-resizable-002-bg);
}
[data-vibeui-block="resizable-002"] [data-part="pane"][data-role="rest"]{flex:1}
[data-vibeui-block="resizable-002"] [data-part="pane"][data-role="fixed"]{flex:none}
[data-vibeui-block="resizable-002"] h3{
margin:0 0 0.3125rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-resizable-002-muted);
}
[data-vibeui-block="resizable-002"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.25rem}
[data-vibeui-block="resizable-002"] li{
font-size:0.75rem;line-height:1.3;padding:0.25rem 0.375rem;border-radius:0.375rem;
background:var(--vibeui-resizable-002-surface);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="resizable-002"] p{margin:0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-resizable-002-muted)}
[data-vibeui-block="resizable-002"] [data-part="split"]{
flex:none;width:0.6875rem;position:relative;
background:var(--vibeui-resizable-002-surface);
cursor:col-resize;touch-action:none;
}
[data-vibeui-block="resizable-002"] [data-part="split"]::before{
content:"";position:absolute;inset:0 calc(50% - 0.5px);background:var(--vibeui-resizable-002-border);
transition:background-color .15s ease;
}
[data-vibeui-block="resizable-002"] [data-part="split"]:hover::before,
[data-vibeui-block="resizable-002"] [data-part="split"][data-dragging="true"]::before{
inset:0 calc(50% - 1.5px);background:var(--vibeui-resizable-002-accent);
}
[data-vibeui-block="resizable-002"] [data-part="split"]:focus-visible{
outline:2px solid var(--vibeui-resizable-002-accent);outline-offset:-2px;
}
[data-vibeui-block="resizable-002"] [data-part="status"]{
margin:0;font-size:0.75rem;color:var(--vibeui-resizable-002-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="resizable-002"] *{animation:none!important;transition:none!important}}
`

/**
 * Три панели и два разделителя: состояние — положения границ, каждая
 * зажата между соседями. Мышь и клавиатура равноправны. Один файл.
 */
export function Resizable002({
  label = "Граница",
  min = 14,
  step = 3,
  defaultLeft = 26,
  defaultMiddle = 40,
  onChange,
  accent,
  className,
  style,
  ...props
}: Resizable002Props) {
  const [edges, setEdges] = useState([defaultLeft, defaultLeft + defaultMiddle])
  const [dragging, setDragging] = useState(-1)
  const frame = useRef<HTMLDivElement>(null)

  const first = useId()
  const second = useId()
  const third = useId()
  const paneIds = [first, second, third]

  const palette = {
    ...(accent ? { "--vibeui-resizable-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  const limits = (index: number) => ({
    low: index === 0 ? min : edges[0] + min,
    high: index === 0 ? edges[1] - min : 100 - min,
  })

  const apply = (index: number, value: number) => {
    const { low, high } = limits(index)
    const next = [...edges]

    next[index] = Math.min(high, Math.max(low, value))
    setEdges(next)
    onChange?.([next[0], next[1] - next[0], 100 - next[1]])
  }

  const dragTo = (index: number, event: PointerEvent<HTMLDivElement>) => {
    const box = frame.current?.getBoundingClientRect()

    if (!box || box.width === 0) {
      return
    }

    apply(index, ((event.clientX - box.left) / box.width) * 100)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    const { low, high } = limits(index)

    if (event.key === "ArrowLeft") {
      event.preventDefault()
      apply(index, edges[index] - step)
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      apply(index, edges[index] + step)
    } else if (event.key === "Home") {
      event.preventDefault()
      apply(index, low)
    } else if (event.key === "End") {
      event.preventDefault()
      apply(index, high)
    }
  }

  const widths = [edges[0], edges[1] - edges[0]]

  const splitProps = (index: number) => ({
    "data-part": "split",
    role: "separator" as const,
    tabIndex: 0,
    "aria-orientation": "vertical" as const,
    "aria-label": `${label} ${index + 1}`,
    "aria-controls": paneIds[index],
    "aria-valuenow": Math.round(edges[index]),
    "aria-valuemin": Math.round(limits(index).low),
    "aria-valuemax": Math.round(limits(index).high),
    "data-dragging": dragging === index,
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) =>
      onKeyDown(event, index),
    onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId)
      setDragging(index)
    },
    onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
      if (dragging === index) {
        dragTo(index, event)
      }
    },
    onPointerUp: (event: PointerEvent<HTMLDivElement>) => {
      event.currentTarget.releasePointerCapture(event.pointerId)
      setDragging(-1)
    },
    onPointerCancel: () => setDragging(-1),
  })

  return (
    <>
      <style href="vibeui-resizable-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="resizable-002"
        className={className}
        style={palette}
      >
        <div data-part="frame" ref={frame}>
          <section
            data-part="pane"
            data-role="fixed"
            id={paneIds[0]}
            style={{ width: `${widths[0]}%` }}
            aria-label="Проекты"
          >
            <h3>Проекты</h3>
            <ul>
              <li>Витрина</li>
              <li>Каталог</li>
              <li>Документы</li>
            </ul>
          </section>
          <div {...splitProps(0)} />
          <section
            data-part="pane"
            data-role="fixed"
            id={paneIds[1]}
            style={{ width: `${widths[1]}%` }}
            aria-label="Задачи"
          >
            <h3>Задачи</h3>
            <ul>
              <li>Собрать реестр</li>
              <li>Проверить превью</li>
              <li>Обновить документацию</li>
            </ul>
          </section>
          <div {...splitProps(1)} />
          <section
            data-part="pane"
            data-role="rest"
            id={paneIds[2]}
            aria-label="Описание"
          >
            <h3>Описание</h3>
            <p>
              Правая панель забирает остаток ширины, поэтому сумма всегда
              сходится к сотне процентов без пересчёта.
            </p>
          </section>
        </div>
        <p data-part="status" role="status">
          {Math.round(widths[0])}% · {Math.round(widths[1])}% ·{" "}
          {Math.round(100 - edges[1])}%
        </p>
      </div>
    </>
  )
}
