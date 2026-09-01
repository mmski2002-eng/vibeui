"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
} from "react"

export type Resizable009Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  defaultFolders?: number
  defaultList?: number
  minFolders?: number
  maxFolders?: number
  minList?: number
  maxList?: number
  step?: number
  onChange?: (sizes: [number, number]) => void
  accent?: string
}

// Идея компонента: три колонки почтового клиента и два независимых
// разделителя в пикселях. В отличие от связанной модели с общими границами,
// здесь у каждой полосы свой размер и свои пределы — ширина папок не тянет за
// собой ширину списка писем. Третья колонка размер не хранит и забирает
// остаток, поэтому сумма всегда сходится.
const STYLES = `
:where([data-vibeui-block="resizable-009"]){
--vibeui-resizable-009-bg:oklch(1 0 0);
--vibeui-resizable-009-fg:oklch(0.22 0.014 265);
--vibeui-resizable-009-muted:oklch(0.55 0.014 265);
--vibeui-resizable-009-border:oklch(0.9 0.006 265);
--vibeui-resizable-009-surface:oklch(0.975 0.004 265);
--vibeui-resizable-009-accent:oklch(0.62 0.14 165);
--vibeui-resizable-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="resizable-009"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:40rem;padding:0.875rem;
border:1px solid var(--vibeui-resizable-009-border);border-radius:0.875rem;
background:var(--vibeui-resizable-009-bg);color:var(--vibeui-resizable-009-fg);
font-family:var(--vibeui-resizable-009-font);
}
[data-vibeui-block="resizable-009"] *{box-sizing:border-box}
[data-vibeui-block="resizable-009"] [data-part="frame"]{
display:flex;align-items:stretch;height:11rem;
border:1px solid var(--vibeui-resizable-009-border);border-radius:0.75rem;overflow:hidden;
}
[data-vibeui-block="resizable-009"] [data-part="pane"]{min-width:0;padding:0.625rem;overflow:auto}
[data-vibeui-block="resizable-009"] [data-part="pane"][data-role="fixed"]{flex:none}
[data-vibeui-block="resizable-009"] [data-part="pane"][data-role="fixed"]:first-child{background:var(--vibeui-resizable-009-surface)}
[data-vibeui-block="resizable-009"] [data-part="pane"][data-role="rest"]{flex:1;background:var(--vibeui-resizable-009-bg)}
[data-vibeui-block="resizable-009"] h3{
margin:0 0 0.3125rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-resizable-009-muted);
}
[data-vibeui-block="resizable-009"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.25rem}
[data-vibeui-block="resizable-009"] li{
font-size:0.75rem;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="resizable-009"] p{margin:0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-resizable-009-muted)}
[data-vibeui-block="resizable-009"] [data-part="split"]{
flex:none;width:0.6875rem;position:relative;
background:var(--vibeui-resizable-009-surface);cursor:col-resize;touch-action:none;
}
[data-vibeui-block="resizable-009"] [data-part="split"]::before{
content:"";position:absolute;inset:0 calc(50% - 0.5px);background:var(--vibeui-resizable-009-border);
transition:background-color .15s ease;
}
[data-vibeui-block="resizable-009"] [data-part="split"]:hover::before,
[data-vibeui-block="resizable-009"] [data-part="split"][data-dragging="true"]::before{
inset:0 calc(50% - 1.5px);background:var(--vibeui-resizable-009-accent);
}
[data-vibeui-block="resizable-009"] [data-part="split"]:focus-visible{
outline:2px solid var(--vibeui-resizable-009-accent);outline-offset:-2px;
}
[data-vibeui-block="resizable-009"] [data-part="status"]{
margin:0;font-size:0.75rem;color:var(--vibeui-resizable-009-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="resizable-009"] *{animation:none!important;transition:none!important}}
`

/**
 * Три колонки почтового клиента и два независимых разделителя в пикселях,
 * у каждого свои пределы. Один файл, ноль зависимостей.
 */
export function Resizable009({
  label = "Колонка",
  defaultFolders = 168,
  defaultList = 224,
  minFolders = 120,
  maxFolders = 220,
  minList = 170,
  maxList = 300,
  step = 12,
  onChange,
  accent,
  className,
  style,
  ...props
}: Resizable009Props) {
  const [folders, setFolders] = useState(defaultFolders)
  const [list, setList] = useState(defaultList)
  const [dragging, setDragging] = useState(-1)
  const frame = useRef<HTMLDivElement>(null)

  const foldersId = useId()
  const listId = useId()

  const palette = {
    ...(accent ? { "--vibeui-resizable-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  const applyFolders = (next: number) => {
    const clamped = Math.round(Math.min(maxFolders, Math.max(minFolders, next)))

    setFolders(clamped)
    onChange?.([clamped, list])
  }

  const applyList = (next: number) => {
    const clamped = Math.round(Math.min(maxList, Math.max(minList, next)))

    setList(clamped)
    onChange?.([folders, clamped])
  }

  const onKeyDownFolders = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      applyFolders(folders - step)
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      applyFolders(folders + step)
    } else if (event.key === "Home") {
      event.preventDefault()
      applyFolders(minFolders)
    } else if (event.key === "End") {
      event.preventDefault()
      applyFolders(maxFolders)
    }
  }

  const onKeyDownList = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      applyList(list - step)
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      applyList(list + step)
    } else if (event.key === "Home") {
      event.preventDefault()
      applyList(minList)
    } else if (event.key === "End") {
      event.preventDefault()
      applyList(maxList)
    }
  }

  return (
    <>
      <style href="vibeui-resizable-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="resizable-009"
        className={className}
        style={palette}
      >
        <div data-part="frame" ref={frame}>
          <section
            data-part="pane"
            data-role="fixed"
            id={foldersId}
            style={{ width: `${folders}px` }}
            aria-label="Папки"
          >
            <h3>Папки</h3>
            <ul>
              <li>Входящие</li>
              <li>Отправленные</li>
              <li>Черновики</li>
              <li>Спам</li>
            </ul>
          </section>
          <div
            data-part="split"
            role="separator"
            tabIndex={0}
            aria-orientation="vertical"
            aria-label={`${label} «Папки»`}
            aria-controls={foldersId}
            aria-valuenow={folders}
            aria-valuemin={minFolders}
            aria-valuemax={maxFolders}
            aria-valuetext={`${folders} пикселей`}
            data-dragging={dragging === 0}
            onKeyDown={onKeyDownFolders}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId)
              setDragging(0)
            }}
            onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
              if (dragging !== 0) {
                return
              }

              const box = frame.current?.getBoundingClientRect()

              if (!box) {
                return
              }

              applyFolders(event.clientX - box.left)
            }}
            onPointerUp={(event) => {
              event.currentTarget.releasePointerCapture(event.pointerId)
              setDragging(-1)
            }}
            onPointerCancel={() => setDragging(-1)}
          />
          <section
            data-part="pane"
            data-role="fixed"
            id={listId}
            style={{ width: `${list}px` }}
            aria-label="Письма"
          >
            <h3>Письма</h3>
            <ul>
              <li>Анна · Правки макета</li>
              <li>Игорь · Счёт № 118</li>
              <li>Отдел кадров · Отпуск</li>
              <li>Марина · Договор</li>
            </ul>
          </section>
          <div
            data-part="split"
            role="separator"
            tabIndex={0}
            aria-orientation="vertical"
            aria-label={`${label} «Письма»`}
            aria-controls={listId}
            aria-valuenow={list}
            aria-valuemin={minList}
            aria-valuemax={maxList}
            aria-valuetext={`${list} пикселей`}
            data-dragging={dragging === 1}
            onKeyDown={onKeyDownList}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId)
              setDragging(1)
            }}
            onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
              if (dragging !== 1) {
                return
              }

              const box = frame.current?.getBoundingClientRect()

              if (!box) {
                return
              }

              applyList(event.clientX - box.left - folders)
            }}
            onPointerUp={(event) => {
              event.currentTarget.releasePointerCapture(event.pointerId)
              setDragging(-1)
            }}
            onPointerCancel={() => setDragging(-1)}
          />
          <section data-part="pane" data-role="rest" aria-label="Письмо">
            <h3>Письмо</h3>
            <p>
              Правая колонка размер не хранит и забирает остаток ширины
              рамки — сумма трёх колонок не может разойтись.
            </p>
          </section>
        </div>
        <p data-part="status" role="status">
          Папки — {folders} px · Письма — {list} px · остаток — чтение.
        </p>
      </div>
    </>
  )
}
