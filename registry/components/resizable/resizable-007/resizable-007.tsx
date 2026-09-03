"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentProps,
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
} from "react"

export type Resizable007Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  defaultRatio?: number
  min?: number
  max?: number
  step?: number
  onChange?: (ratio: number) => void
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  firstTitle?: string
  firstText?: string
  secondTitle?: string
  secondText?: string
  /** Строка состояния; {left} и {right} заменяются на доли пропорции. */
  statusText?: string
  /** aria-valuetext разделителя; {left} и {right} — доли пропорции. */
  valueText?: string
  equalText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: пропорция хранится в самой раскладке. Колонки заданы в fr,
// поэтому при изменении ширины контейнера панели делят место в той же
// пропорции — без обработчика resize, без пересчёта в пикселях и без прыжка
// при первом рендере на сервере.
const STYLES = `
:where([data-vibeui-block="resizable-007"]){
--vibeui-resizable-007-bg:transparent;
--vibeui-resizable-007-pane:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-resizable-007-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-resizable-007-muted:color-mix(in oklab,var(--vibeui-resizable-007-fg) 68%,transparent);
--vibeui-resizable-007-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-resizable-007-surface:light-dark(oklch(0.975 0.004 265),oklch(0.31 0.011 265));
--vibeui-resizable-007-accent:light-dark(oklch(0.54 0.17 300),oklch(0.76 0.15 300));
--vibeui-resizable-007-left:1;
--vibeui-resizable-007-right:1;
--vibeui-resizable-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="resizable-007"]{color-scheme:dark}
[data-vibeui-block="resizable-007"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:34rem;padding:0.875rem;
border:1px solid var(--vibeui-resizable-007-border);border-radius:0.875rem;
background:var(--vibeui-resizable-007-bg);color:var(--vibeui-resizable-007-fg);
font-family:var(--vibeui-resizable-007-font);
}
[data-vibeui-block="resizable-007"] *{box-sizing:border-box}
/* Пропорция живёт в grid-template-columns: две доли fr и полоса между ними.
   Меняется только одно число — раскладка пересчитывается сама. */
[data-vibeui-block="resizable-007"] [data-part="frame"]{
display:grid;height:11rem;
grid-template-columns:calc(var(--vibeui-resizable-007-left) * 1fr) 0.75rem calc(var(--vibeui-resizable-007-right) * 1fr);
border:1px solid var(--vibeui-resizable-007-border);border-radius:0.75rem;overflow:hidden;
}
[data-vibeui-block="resizable-007"] [data-part="pane"]{
min-width:0;padding:0.75rem;overflow:auto;background:var(--vibeui-resizable-007-pane);
}
[data-vibeui-block="resizable-007"] [data-part="pane"][data-role="second"]{background:var(--vibeui-resizable-007-surface)}
[data-vibeui-block="resizable-007"] h3{margin:0 0 0.375rem;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="resizable-007"] p{margin:0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-resizable-007-muted)}
[data-vibeui-block="resizable-007"] [data-part="split"]{
position:relative;background:var(--vibeui-resizable-007-surface);
cursor:col-resize;touch-action:none;
}
[data-vibeui-block="resizable-007"] [data-part="split"]::before{
content:"";position:absolute;inset:0 calc(50% - 0.5px);background:var(--vibeui-resizable-007-border);
transition:background-color .15s ease;
}
[data-vibeui-block="resizable-007"] [data-part="split"]:hover::before,
[data-vibeui-block="resizable-007"] [data-part="split"][data-dragging="true"]::before{
inset:0 calc(50% - 1.5px);background:var(--vibeui-resizable-007-accent);
}
[data-vibeui-block="resizable-007"] [data-part="split"]:focus-visible{
outline:2px solid var(--vibeui-resizable-007-accent);outline-offset:-2px;
}
[data-vibeui-block="resizable-007"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="resizable-007"] [data-part="status"]{
margin:0;font-size:0.75rem;color:var(--vibeui-resizable-007-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="resizable-007"] button{
appearance:none;cursor:pointer;font:inherit;border:0;background:none;padding:0;
color:var(--vibeui-resizable-007-accent);font-size:0.75rem;font-weight:600;
text-decoration:underline;text-underline-offset:0.2em;
}
[data-vibeui-block="resizable-007"] button:focus-visible{
outline:2px solid var(--vibeui-resizable-007-accent);outline-offset:2px;border-radius:0.25rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="resizable-007"] *{animation:none!important;transition:none!important}}
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
 * Две панели, которые держат пропорцию: доли заданы в fr, поэтому при смене
 * ширины контейнера отношение не меняется. Один файл, ноль зависимостей.
 */
export function Resizable007({
  label = "Пропорция панелей",
  defaultRatio = 38,
  min = 20,
  max = 80,
  step = 4,
  onChange,
  firstTitle = "Черновик",
  firstText = "Доли заданы в fr: при сужении окна обе панели уменьшаются вместе и отношение сохраняется.",
  secondTitle = "Просмотр",
  secondText = "Пиксельная ширина сюда не записывается, поэтому раскладка переживает поворот телефона без обработчика resize.",
  statusText = "Пропорция {left} : {right}",
  valueText = "{left} к {right}",
  equalText = "Поровну",
  background = "",
  accent,
  className,
  style,
  ...props
}: Resizable007Props) {
  const [ratio, setRatio] = useState(defaultRatio)
  const [dragging, setDragging] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const paneId = useId()

  const palette = {
    "--vibeui-resizable-007-left": String(Math.round(ratio)),
    "--vibeui-resizable-007-right": String(100 - Math.round(ratio)),
    ...(accent ? { "--vibeui-resizable-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-resizable-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const apply = (next: number) => {
    const clamped = Math.min(max, Math.max(min, next))

    setRatio(clamped)
    onChange?.(clamped)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      apply(ratio - step)
    } else if (event.key === "ArrowRight") {
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

  const left = Math.round(ratio / 5)
  const right = 20 - left

  return (
    <>
      <style href="vibeui-resizable-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="resizable"
        data-vibeui-block="resizable-007"
        className={className}
        style={palette}
      >
        <div data-part="frame" ref={frame}>
          <section data-part="pane" id={paneId} aria-label={firstTitle}>
            <h3>{firstTitle}</h3>
            <p>{firstText}</p>
          </section>
          <div
            data-part="split"
            role="separator"
            tabIndex={0}
            aria-orientation="vertical"
            aria-label={label}
            aria-controls={paneId}
            aria-valuenow={Math.round(ratio)}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuetext={valueText
              .replace("{left}", String(left))
              .replace("{right}", String(right))}
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
          <section data-part="pane" data-role="second" aria-label={secondTitle}>
            <h3>{secondTitle}</h3>
            <p>{secondText}</p>
          </section>
        </div>
        <div data-part="foot">
          <p data-part="status" role="status">
            {statusText
              .replace("{left}", String(left))
              .replace("{right}", String(right))}
          </p>
          <button type="button" onClick={() => apply(50)}>
            {equalText}
          </button>
        </div>
      </div>
    </>
  )
}
