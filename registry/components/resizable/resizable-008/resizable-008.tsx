"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
} from "react"

export type Resizable008Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  defaultSize?: number
  min?: number
  max?: number
  step?: number
  onChange?: (size: number) => void
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  codeLabel?: string
  code?: string
  previewLabel?: string
  previewTitle?: string
  previewText?: string
  buttonText?: string
  /** Строка состояния; {size} заменяется на текущий процент. */
  statusText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: панель кода слева и живое превью справа, разделённые
// вертикальной полосой. Код набран моноширинным шрифтом на тёмной подложке,
// превью — на светлой: контраст подложек виден на глаз даже без чтения текста.
// Ширина хранится в процентах, поэтому окно можно сузить или расширить без
// пересчёта в пикселях.
const STYLES = `
:where([data-vibeui-block="resizable-008"]){
--vibeui-resizable-008-bg:transparent;
--vibeui-resizable-008-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-resizable-008-muted:light-dark(oklch(0.55 0.014 265),oklch(0.72 0.012 265));
--vibeui-resizable-008-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-resizable-008-surface:light-dark(oklch(0.975 0.004 265),oklch(0.29 0.011 265));
--vibeui-resizable-008-code:light-dark(oklch(0.26 0.02 265),oklch(0.17 0.014 265));
--vibeui-resizable-008-accent:light-dark(oklch(0.52 0.16 230),oklch(0.74 0.14 230));
--vibeui-resizable-008-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0.02 230));
--vibeui-resizable-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-resizable-008-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
[data-vibeui-block="resizable-008"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:34rem;padding:0.875rem;
border:1px solid var(--vibeui-resizable-008-border);border-radius:0.875rem;
background:var(--vibeui-resizable-008-bg);color:var(--vibeui-resizable-008-fg);
font-family:var(--vibeui-resizable-008-font);
}
[data-vibeui-block="resizable-008"] *{box-sizing:border-box}
[data-vibeui-block="resizable-008"] [data-part="frame"]{
display:flex;align-items:stretch;height:12rem;
border:1px solid var(--vibeui-resizable-008-border);border-radius:0.75rem;overflow:hidden;
}
[data-vibeui-block="resizable-008"] [data-part="pane"]{min-width:0;overflow:auto}
[data-vibeui-block="resizable-008"] [data-part="pane"][data-role="fixed"]{flex:none}
[data-vibeui-block="resizable-008"] [data-part="pane"][data-role="rest"]{flex:1;background:var(--vibeui-resizable-008-surface)}
[data-vibeui-block="resizable-008"] [data-part="code"]{
margin:0;padding:0.75rem;height:100%;
background:var(--vibeui-resizable-008-code);color:oklch(0.95 0.01 265);
font-family:var(--vibeui-resizable-008-mono);font-size:0.75rem;line-height:1.6;white-space:pre;
}
[data-vibeui-block="resizable-008"] [data-part="preview"]{
padding:0.875rem;display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="resizable-008"] [data-part="preview"] h3{margin:0;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="resizable-008"] [data-part="preview"] p{margin:0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-resizable-008-muted)}
[data-vibeui-block="resizable-008"] [data-part="button"]{
align-self:flex-start;padding:0.375rem 0.75rem;border-radius:0.5rem;
background:var(--vibeui-resizable-008-accent);color:var(--vibeui-resizable-008-on-accent);
font-size:0.75rem;font-weight:650;
}
/* Полоса шире своей видимой линии: цель нажатия — 0.75rem, линия внутри тонкая. */
[data-vibeui-block="resizable-008"] [data-part="split"]{
flex:none;width:0.75rem;position:relative;
background:var(--vibeui-resizable-008-surface);cursor:col-resize;touch-action:none;
}
[data-vibeui-block="resizable-008"] [data-part="split"]::before{
content:"";position:absolute;inset:0 calc(50% - 0.5px);background:var(--vibeui-resizable-008-border);
transition:background-color .15s ease;
}
[data-vibeui-block="resizable-008"] [data-part="split"]:hover::before,
[data-vibeui-block="resizable-008"] [data-part="split"][data-dragging="true"]::before{
inset:0 calc(50% - 1.5px);background:var(--vibeui-resizable-008-accent);
}
[data-vibeui-block="resizable-008"] [data-part="split"]:focus-visible{
outline:2px solid var(--vibeui-resizable-008-accent);outline-offset:-2px;
}
[data-vibeui-block="resizable-008"] [data-part="status"]{
margin:0;font-size:0.75rem;color:var(--vibeui-resizable-008-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="resizable-008"] *{animation:none!important;transition:none!important}}
`

const CODE = `function Price({ value }) {
  return (
    <strong>
      {value} ₽
    </strong>
  )
}`

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
 * Панель кода и превью с перетаскиваемой вертикальной границей.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Resizable008({
  label = "Ширина кода",
  defaultSize = 48,
  min = 25,
  max = 75,
  step = 4,
  onChange,
  codeLabel = "Код",
  code = CODE,
  previewLabel = "Превью",
  previewTitle = "Карточка товара",
  previewText = "Превью обновляется вместе с кодом слева.",
  buttonText = "Купить",
  statusText = "Код занимает {size}% ширины.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Resizable008Props) {
  const [size, setSize] = useState(defaultSize)
  const [dragging, setDragging] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const codeId = useId()

  const palette = {
    ...(accent ? { "--vibeui-resizable-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-resizable-008-bg": background,
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
      <style href="vibeui-resizable-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="resizable-008"
        className={className}
        style={palette}
      >
        <div data-part="frame" ref={frame}>
          <section
            data-part="pane"
            data-role="fixed"
            id={codeId}
            style={{ width: `${size}%` }}
            aria-label={codeLabel}
          >
            <pre data-part="code">{code}</pre>
          </section>
          <div
            data-part="split"
            role="separator"
            tabIndex={0}
            aria-orientation="vertical"
            aria-label={label}
            aria-controls={codeId}
            aria-valuenow={Math.round(size)}
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
          <section data-part="pane" data-role="rest" aria-label={previewLabel}>
            <div data-part="preview">
              <h3>{previewTitle}</h3>
              <p>{previewText}</p>
              <span data-part="button">{buttonText}</span>
            </div>
          </section>
        </div>
        <p data-part="status" role="status">
          {statusText.replace("{size}", String(Math.round(size)))}
        </p>
      </div>
    </>
  )
}
