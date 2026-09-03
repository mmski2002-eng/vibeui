"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentProps,
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
} from "react"

export type Resizable001Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  defaultSize?: number
  min?: number
  max?: number
  step?: number
  onChange?: (size: number) => void
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  primaryLabel?: string
  primaryTitle?: string
  primaryText?: string
  restLabel?: string
  restTitle?: string
  restText?: string
  /** Строка состояния; {size} заменяется на текущий процент. */
  statusText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: две панели с перетаскиваемым разделителем, у которого мышь
// — не единственный способ. Разделитель объявлен role="separator" с
// aria-valuenow и берёт фокус, поэтому размер меняется стрелками, а Home и End
// уводят его к краям. Захват указателя отдан браузеру: setPointerCapture
// продолжает слать события, даже когда курсор ушёл за пределы полосы.
const STYLES = `
:where([data-vibeui-block="resizable-001"]){
--vibeui-resizable-001-bg:transparent;
--vibeui-resizable-001-pane:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-resizable-001-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-resizable-001-muted:color-mix(in oklab,var(--vibeui-resizable-001-fg) 68%,transparent);
--vibeui-resizable-001-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-resizable-001-surface:light-dark(oklch(0.975 0.004 265),oklch(0.31 0.011 265));
--vibeui-resizable-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-resizable-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="resizable-001"]{color-scheme:dark}
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
min-width:0;padding:0.75rem;overflow:auto;background:var(--vibeui-resizable-001-pane);
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
  primaryLabel = "Список писем",
  primaryTitle = "Входящие",
  primaryText = "Тяните разделитель или встаньте на него табом и жмите стрелки.",
  restLabel = "Письмо",
  restTitle = "Договор на подпись",
  restText = "Правая панель занимает остаток: её ширина не хранится отдельно и потому не может разойтись с левой.",
  statusText = "Левая панель — {size}% ширины.",
  background = "",
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
    ...(background
      ? {
          "--vibeui-resizable-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        data-slot="resizable"
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
            aria-label={primaryLabel}
          >
            <h3>{primaryTitle}</h3>
            <p>{primaryText}</p>
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
          <section data-part="pane" data-role="rest" aria-label={restLabel}>
            <h3>{restTitle}</h3>
            <p>{restText}</p>
          </section>
        </div>
        <p data-part="status" role="status">
          {statusText.replace("{size}", String(Math.round(size)))}
        </p>
      </div>
    </>
  )
}
