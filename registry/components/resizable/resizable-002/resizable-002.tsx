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
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  projectsTitle?: string
  projectsItems?: string[]
  tasksTitle?: string
  tasksItems?: string[]
  summaryTitle?: string
  summaryText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: три панели и два разделителя. Состояние хранится не как
// ширины панелей, а как положения границ — тогда соседняя панель не может
// «съехать» вслед за чужим округлением, а ограничения превращаются в простой
// зажим границы между соседями.
const STYLES = `
:where([data-vibeui-block="resizable-002"]){
--vibeui-resizable-002-bg:transparent;
--vibeui-resizable-002-pane:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-resizable-002-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-resizable-002-muted:light-dark(oklch(0.55 0.014 265),oklch(0.72 0.012 265));
--vibeui-resizable-002-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-resizable-002-surface:light-dark(oklch(0.975 0.004 265),oklch(0.31 0.011 265));
--vibeui-resizable-002-accent:light-dark(oklch(0.56 0.15 195),oklch(0.76 0.13 195));
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
min-width:0;padding:0.625rem;overflow:auto;background:var(--vibeui-resizable-002-pane);
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
  projectsTitle = "Проекты",
  projectsItems = ["Витрина", "Каталог", "Документы"],
  tasksTitle = "Задачи",
  tasksItems = ["Собрать реестр", "Проверить превью", "Обновить документацию"],
  summaryTitle = "Описание",
  summaryText = "Правая панель забирает остаток ширины, поэтому сумма всегда сходится к сотне процентов без пересчёта.",
  background = "",
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
    ...(background
      ? {
          "--vibeui-resizable-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
    // Рамку меряем прямо в обработчике: ref читается вне рендера, иначе
    // React не гарантирует, что значение соответствует показанной разметке.
    onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
      if (dragging !== index) return

      const box = frame.current?.getBoundingClientRect()

      if (!box || box.width === 0) return

      apply(index, ((event.clientX - box.left) / box.width) * 100)
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
            aria-label={projectsTitle}
          >
            <h3>{projectsTitle}</h3>
            <ul>
              {projectsItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <div {...splitProps(0)} />
          <section
            data-part="pane"
            data-role="fixed"
            id={paneIds[1]}
            style={{ width: `${widths[1]}%` }}
            aria-label={tasksTitle}
          >
            <h3>{tasksTitle}</h3>
            <ul>
              {tasksItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <div {...splitProps(1)} />
          <section
            data-part="pane"
            data-role="rest"
            id={paneIds[2]}
            aria-label={summaryTitle}
          >
            <h3>{summaryTitle}</h3>
            <p>{summaryText}</p>
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
