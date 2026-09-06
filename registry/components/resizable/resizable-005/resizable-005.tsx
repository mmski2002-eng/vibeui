"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentProps,
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
} from "react"

export type Resizable005Props = Omit<
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
  sideTitle?: string
  sideText?: string
  mainTitle?: string
  mainText?: string
  /** Строка состояния; {size} заменяется на текущую ширину. */
  statusText?: string
  collapsedStatusText?: string
  /** aria-valuetext разделителя; {size} заменяется на текущую ширину. */
  valueText?: string
  collapsedValueText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: разделитель, который умеет сворачивать панель в ноль.
// Двойное нажатие и Enter делают одно и то же, а прошлый размер запоминается,
// поэтому разворот возвращает панель туда же, откуда её убрали. Ноль остаётся
// честным значением aria-valuenow: свёрнутая панель — это размер 0, а не
// исчезнувший элемент.
const STYLES = `
:where([data-vibeui-block="resizable-005"]){
--vibeui-resizable-005-bg:transparent;
--vibeui-resizable-005-pane:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-resizable-005-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-resizable-005-muted:color-mix(in oklab,var(--vibeui-resizable-005-fg) 68%,transparent);
--vibeui-resizable-005-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-resizable-005-surface:light-dark(oklch(0.975 0 265),oklch(0.31 0 265));
--vibeui-resizable-005-accent:light-dark(oklch(0.55 0.16 25),oklch(0.75 0.15 25));
--vibeui-resizable-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="resizable-005"]{color-scheme:dark}
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
flex:1;min-width:0;padding:0.75rem;overflow:auto;background:var(--vibeui-resizable-005-pane);
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
  sideTitle = "Фильтры",
  sideText = "Свёрнутая панель остаётся в разметке: её ширина — ноль, а не отсутствие.",
  mainTitle = "Результаты",
  mainText = "Двойное нажатие на разделителе сворачивает панель, Enter делает то же самое с клавиатуры.",
  statusText = "Панель — {size} px",
  collapsedStatusText = "Панель свёрнута",
  valueText = "{size} пикселей",
  collapsedValueText = "свёрнута",
  background = "",
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
    ...(background
      ? {
          "--vibeui-resizable-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        data-slot="resizable"
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
            aria-label={sideTitle}
          >
            <div data-part="inner">
              <h3>{sideTitle}</h3>
              <p>{sideText}</p>
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
            aria-valuetext={
              collapsed
                ? collapsedValueText
                : valueText.replace("{size}", String(size))
            }
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
            <h3>{mainTitle}</h3>
            <p>{mainText}</p>
          </main>
        </div>
        <p data-part="status" role="status">
          {collapsed
            ? collapsedStatusText
            : statusText.replace("{size}", String(size))}
        </p>
      </div>
    </>
  )
}
