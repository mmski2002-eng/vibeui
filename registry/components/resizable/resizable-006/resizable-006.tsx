"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
} from "react"

export type Resizable006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  defaultRow?: number
  defaultColumn?: number
  step?: number
  onChange?: (value: { row: number; column: number }) => void
  accent?: string
}

// Идея компонента: вложенное разделение — горизонтальное внутри вертикального.
// У каждого разделителя своя система координат: верхний меряет высоту всей
// рабочей области, внутренний — ширину только верхней части. Общий контейнер
// на двоих даёт вторую панель, которая едет не туда, куда тянут.
const STYLES = `
:where([data-vibeui-block="resizable-006"]){
--vibeui-resizable-006-bg:oklch(1 0 0);
--vibeui-resizable-006-fg:oklch(0.22 0.014 265);
--vibeui-resizable-006-muted:oklch(0.55 0.014 265);
--vibeui-resizable-006-border:oklch(0.9 0.006 265);
--vibeui-resizable-006-surface:oklch(0.975 0.004 265);
--vibeui-resizable-006-console:oklch(0.26 0.02 265);
--vibeui-resizable-006-accent:oklch(0.58 0.16 165);
--vibeui-resizable-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-resizable-006-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
[data-vibeui-block="resizable-006"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:34rem;padding:0.875rem;
border:1px solid var(--vibeui-resizable-006-border);border-radius:0.875rem;
background:var(--vibeui-resizable-006-bg);color:var(--vibeui-resizable-006-fg);
font-family:var(--vibeui-resizable-006-font);
}
[data-vibeui-block="resizable-006"] *{box-sizing:border-box}
[data-vibeui-block="resizable-006"] [data-part="outer"]{
display:flex;flex-direction:column;height:15rem;
border:1px solid var(--vibeui-resizable-006-border);border-radius:0.75rem;overflow:hidden;
}
[data-vibeui-block="resizable-006"] [data-part="work"]{display:flex;min-height:0;flex:none}
[data-vibeui-block="resizable-006"] [data-part="tree"]{
flex:none;min-width:0;padding:0.625rem;overflow:auto;background:var(--vibeui-resizable-006-surface);
}
[data-vibeui-block="resizable-006"] [data-part="editor"]{
flex:1;min-width:0;padding:0.625rem;overflow:auto;background:var(--vibeui-resizable-006-bg);
}
[data-vibeui-block="resizable-006"] [data-part="console"]{
flex:1;min-height:0;overflow:auto;padding:0.625rem 0.75rem;
background:var(--vibeui-resizable-006-console);color:oklch(0.94 0.01 265);
font-family:var(--vibeui-resizable-006-mono);font-size:0.6875rem;line-height:1.6;
}
[data-vibeui-block="resizable-006"] h3{
margin:0 0 0.3125rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-resizable-006-muted);
}
[data-vibeui-block="resizable-006"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.1875rem}
[data-vibeui-block="resizable-006"] li{font-size:0.75rem;line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
[data-vibeui-block="resizable-006"] [data-part="console"] p{margin:0}
[data-vibeui-block="resizable-006"] [data-part="row-split"]{
flex:none;height:0.75rem;position:relative;background:var(--vibeui-resizable-006-surface);
cursor:row-resize;touch-action:none;
}
[data-vibeui-block="resizable-006"] [data-part="row-split"]::before{
content:"";position:absolute;inset:calc(50% - 1px) 35%;border-radius:9999px;
background:var(--vibeui-resizable-006-border);transition:background-color .15s ease;
}
[data-vibeui-block="resizable-006"] [data-part="col-split"]{
flex:none;width:0.75rem;position:relative;background:var(--vibeui-resizable-006-surface);
cursor:col-resize;touch-action:none;
}
[data-vibeui-block="resizable-006"] [data-part="col-split"]::before{
content:"";position:absolute;inset:30% calc(50% - 1px);border-radius:9999px;
background:var(--vibeui-resizable-006-border);transition:background-color .15s ease;
}
[data-vibeui-block="resizable-006"] [data-part="row-split"]:hover::before,
[data-vibeui-block="resizable-006"] [data-part="col-split"]:hover::before{
background:var(--vibeui-resizable-006-accent);
}
[data-vibeui-block="resizable-006"] [data-part="row-split"]:focus-visible,
[data-vibeui-block="resizable-006"] [data-part="col-split"]:focus-visible{
outline:2px solid var(--vibeui-resizable-006-accent);outline-offset:-2px;
}
[data-vibeui-block="resizable-006"] [data-part="status"]{
margin:0;font-size:0.75rem;color:var(--vibeui-resizable-006-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="resizable-006"] *{animation:none!important;transition:none!important}}
`

const MIN = 20
const MAX = 80

/**
 * Вложенное разделение: горизонтальный разделитель внутри вертикального,
 * у каждого своя система координат. Один файл, ноль зависимостей.
 */
export function Resizable006({
  defaultRow = 62,
  defaultColumn = 34,
  step = 4,
  onChange,
  accent,
  className,
  style,
  ...props
}: Resizable006Props) {
  const [row, setRow] = useState(defaultRow)
  const [column, setColumn] = useState(defaultColumn)
  const [dragging, setDragging] = useState("")
  const outer = useRef<HTMLDivElement>(null)
  const work = useRef<HTMLDivElement>(null)
  const workId = useId()
  const treeId = useId()

  const palette = {
    ...(accent ? { "--vibeui-resizable-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  const clamp = (value: number) => Math.min(MAX, Math.max(MIN, value))

  const applyRow = (value: number) => {
    const next = clamp(value)

    setRow(next)
    onChange?.({ row: next, column })
  }

  const applyColumn = (value: number) => {
    const next = clamp(value)

    setColumn(next)
    onChange?.({ row, column: next })
  }

  const keys = (
    event: KeyboardEvent<HTMLDivElement>,
    value: number,
    apply: (next: number) => void,
    axis: "row" | "column",
  ) => {
    const back = axis === "row" ? "ArrowUp" : "ArrowLeft"
    const forward = axis === "row" ? "ArrowDown" : "ArrowRight"

    if (event.key === back) {
      event.preventDefault()
      apply(value - step)
    } else if (event.key === forward) {
      event.preventDefault()
      apply(value + step)
    } else if (event.key === "Home") {
      event.preventDefault()
      apply(MIN)
    } else if (event.key === "End") {
      event.preventDefault()
      apply(MAX)
    }
  }

  return (
    <>
      <style href="vibeui-resizable-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="resizable-006"
        className={className}
        style={palette}
      >
        <div data-part="outer" ref={outer}>
          <div
            data-part="work"
            id={workId}
            ref={work}
            style={{ height: `${row}%` }}
          >
            <nav
              data-part="tree"
              id={treeId}
              style={{ width: `${column}%` }}
              aria-label="Файлы"
            >
              <h3>Файлы</h3>
              <ul>
                <li>app/page.tsx</li>
                <li>lib/utils.ts</li>
                <li>styles.css</li>
              </ul>
            </nav>
            <div
              data-part="col-split"
              role="separator"
              tabIndex={0}
              aria-orientation="vertical"
              aria-label="Ширина дерева файлов"
              aria-controls={treeId}
              aria-valuenow={Math.round(column)}
              aria-valuemin={MIN}
              aria-valuemax={MAX}
              data-dragging={dragging === "column"}
              onKeyDown={(event) => keys(event, column, applyColumn, "column")}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId)
                setDragging("column")
              }}
              onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
                if (dragging !== "column") {
                  return
                }

                const box = work.current?.getBoundingClientRect()

                if (!box || box.width === 0) {
                  return
                }

                applyColumn(((event.clientX - box.left) / box.width) * 100)
              }}
              onPointerUp={(event) => {
                event.currentTarget.releasePointerCapture(event.pointerId)
                setDragging("")
              }}
              onPointerCancel={() => setDragging("")}
            />
            <section data-part="editor" aria-label="Редактор">
              <h3>Редактор</h3>
              <ul>
                <li>export function Page() {"{"}</li>
                <li>&nbsp;&nbsp;return &lt;main /&gt;</li>
                <li>{"}"}</li>
              </ul>
            </section>
          </div>
          <div
            data-part="row-split"
            role="separator"
            tabIndex={0}
            aria-orientation="horizontal"
            aria-label="Высота рабочей области"
            aria-controls={workId}
            aria-valuenow={Math.round(row)}
            aria-valuemin={MIN}
            aria-valuemax={MAX}
            data-dragging={dragging === "row"}
            onKeyDown={(event) => keys(event, row, applyRow, "row")}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId)
              setDragging("row")
            }}
            onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
              if (dragging !== "row") {
                return
              }

              const box = outer.current?.getBoundingClientRect()

              if (!box || box.height === 0) {
                return
              }

              applyRow(((event.clientY - box.top) / box.height) * 100)
            }}
            onPointerUp={(event) => {
              event.currentTarget.releasePointerCapture(event.pointerId)
              setDragging("")
            }}
            onPointerCancel={() => setDragging("")}
          />
          <section data-part="console" aria-label="Консоль">
            <p>$ npm run build</p>
            <p>✓ собрано за 3.4 s</p>
          </section>
        </div>
        <p data-part="status" role="status">
          Рабочая область — {Math.round(row)}% высоты, дерево —{" "}
          {Math.round(column)}% её ширины.
        </p>
      </div>
    </>
  )
}
