"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
} from "react"

export type Resizable010Props = Omit<
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

// Идея компонента: вертикальное разделение списка и подробностей, но, в
// отличие от процентной высоты, доля хранится в fr прямо в grid-template-rows.
// При изменении высоты рамки список и подробности делят место в той же
// пропорции сами — без обработчика resize и без пересчёта в пикселях.
const STYLES = `
:where([data-vibeui-block="resizable-010"]){
--vibeui-resizable-010-bg:oklch(1 0 0);
--vibeui-resizable-010-fg:oklch(0.22 0.014 265);
--vibeui-resizable-010-muted:oklch(0.55 0.014 265);
--vibeui-resizable-010-border:oklch(0.9 0.006 265);
--vibeui-resizable-010-surface:oklch(0.975 0.004 265);
--vibeui-resizable-010-accent:oklch(0.64 0.17 40);
--vibeui-resizable-010-top:1;
--vibeui-resizable-010-bottom:1;
--vibeui-resizable-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="resizable-010"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:26rem;padding:0.875rem;
border:1px solid var(--vibeui-resizable-010-border);border-radius:0.875rem;
background:var(--vibeui-resizable-010-bg);color:var(--vibeui-resizable-010-fg);
font-family:var(--vibeui-resizable-010-font);
}
[data-vibeui-block="resizable-010"] *{box-sizing:border-box}
/* Пропорция живёт в grid-template-rows: доля fr сверху, полоса, доля fr снизу. */
[data-vibeui-block="resizable-010"] [data-part="frame"]{
display:grid;height:16rem;
grid-template-rows:calc(var(--vibeui-resizable-010-top) * 1fr) 0.75rem calc(var(--vibeui-resizable-010-bottom) * 1fr);
border:1px solid var(--vibeui-resizable-010-border);border-radius:0.75rem;overflow:hidden;
}
[data-vibeui-block="resizable-010"] [data-part="pane"]{min-height:0;padding:0.75rem;overflow:auto}
[data-vibeui-block="resizable-010"] [data-part="pane"][data-role="details"]{background:var(--vibeui-resizable-010-surface)}
[data-vibeui-block="resizable-010"] h3{margin:0 0 0.375rem;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="resizable-010"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.3125rem}
[data-vibeui-block="resizable-010"] li{
font-size:0.75rem;line-height:1.3;padding:0.25rem 0.375rem;border-radius:0.375rem;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="resizable-010"] li[data-active="true"]{
background:color-mix(in oklab,var(--vibeui-resizable-010-accent) 12%,transparent);
color:color-mix(in oklab,var(--vibeui-resizable-010-accent) 70%,black);
font-weight:650;
}
[data-vibeui-block="resizable-010"] p{margin:0;font-size:0.75rem;line-height:1.55;color:var(--vibeui-resizable-010-muted)}
/* Разделитель горизонтальный: цель нажатия выше своей видимой линии. */
[data-vibeui-block="resizable-010"] [data-part="split"]{
position:relative;background:var(--vibeui-resizable-010-surface);
cursor:row-resize;touch-action:none;
}
[data-vibeui-block="resizable-010"] [data-part="split"]::before{
content:"";position:absolute;inset:calc(50% - 0.5px) 0;background:var(--vibeui-resizable-010-border);
transition:background-color .15s ease;
}
[data-vibeui-block="resizable-010"] [data-part="split"]:hover::before,
[data-vibeui-block="resizable-010"] [data-part="split"][data-dragging="true"]::before{
inset:calc(50% - 1.5px) 0;background:var(--vibeui-resizable-010-accent);
}
[data-vibeui-block="resizable-010"] [data-part="split"]:focus-visible{
outline:2px solid var(--vibeui-resizable-010-accent);outline-offset:-2px;
}
[data-vibeui-block="resizable-010"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="resizable-010"] [data-part="status"]{
margin:0;font-size:0.75rem;color:var(--vibeui-resizable-010-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="resizable-010"] button{
appearance:none;cursor:pointer;font:inherit;border:0;background:none;padding:0;
color:var(--vibeui-resizable-010-accent);font-size:0.75rem;font-weight:600;
text-decoration:underline;text-underline-offset:0.2em;
}
[data-vibeui-block="resizable-010"] button:focus-visible{
outline:2px solid var(--vibeui-resizable-010-accent);outline-offset:2px;border-radius:0.25rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="resizable-010"] *{animation:none!important;transition:none!important}}
`

const TASKS = ["Проверить макет", "Согласовать смету", "Написать отчёт", "Созвониться с клиентом"]

/**
 * Вертикальное разделение списка задач и подробностей: доля в fr, горизонтальный
 * разделитель со стрелками вверх-вниз. Один файл, ноль зависимостей.
 */
export function Resizable010({
  label = "Высота списка",
  defaultRatio = 45,
  min = 20,
  max = 80,
  step = 5,
  onChange,
  accent,
  className,
  style,
  ...props
}: Resizable010Props) {
  const [ratio, setRatio] = useState(defaultRatio)
  const [dragging, setDragging] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const listId = useId()

  const palette = {
    "--vibeui-resizable-010-top": String(Math.round(ratio)),
    "--vibeui-resizable-010-bottom": String(100 - Math.round(ratio)),
    ...(accent ? { "--vibeui-resizable-010-accent": accent } : null),
    ...style,
  } as CSSProperties

  const apply = (next: number) => {
    const clamped = Math.min(max, Math.max(min, next))

    setRatio(clamped)
    onChange?.(clamped)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault()
      apply(ratio - step)
    } else if (event.key === "ArrowDown") {
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

  return (
    <>
      <style href="vibeui-resizable-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="resizable-010"
        className={className}
        style={palette}
      >
        <div data-part="frame" ref={frame}>
          <section data-part="pane" id={listId} aria-label="Список задач">
            <h3>Задачи</h3>
            <ul>
              {TASKS.map((task, index) => (
                <li key={task} data-active={index === 1 || undefined}>
                  {task}
                </li>
              ))}
            </ul>
          </section>
          <div
            data-part="split"
            role="separator"
            tabIndex={0}
            aria-orientation="horizontal"
            aria-label={label}
            aria-controls={listId}
            aria-valuenow={Math.round(ratio)}
            aria-valuemin={min}
            aria-valuemax={max}
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
          <section data-part="pane" data-role="details" aria-label="Подробности">
            <h3>Согласовать смету</h3>
            <p>
              Срок — пятница, исполнитель — бухгалтерия. Подробности растут
              вниз вместе с высотой нижней доли.
            </p>
          </section>
        </div>
        <div data-part="foot">
          <p data-part="status" role="status">
            Список — {Math.round(ratio)}% высоты.
          </p>
          <button type="button" onClick={() => apply(50)}>
            Поровну
          </button>
        </div>
      </div>
    </>
  )
}
