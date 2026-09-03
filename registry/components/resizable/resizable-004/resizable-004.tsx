"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentProps,
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
} from "react"

export type Resizable004Props = Omit<
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
  navTitle?: string
  navItems?: string[]
  mainTitle?: string
  mainText?: string
  /** Строка состояния; {size} заменяется на текущую ширину. */
  statusText?: string
  /** Плашка предела; {value} заменяется на границу диапазона. */
  minText?: string
  maxText?: string
  /** aria-valuetext разделителя; {size} заменяется на текущую ширину. */
  valueText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: панель с настоящими пределами в пикселях, а не в процентах.
// Меню шириной в проценты на узком экране превращается в обрубок, поэтому
// размер здесь хранится в пикселях и зажимается между min и max. Упор в предел
// не проглатывается молча: разделитель меняет цвет, а подпись называет предел.
const STYLES = `
:where([data-vibeui-block="resizable-004"]){
--vibeui-resizable-004-bg:transparent;
--vibeui-resizable-004-pane:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-resizable-004-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-resizable-004-muted:color-mix(in oklab,var(--vibeui-resizable-004-fg) 68%,transparent);
--vibeui-resizable-004-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-resizable-004-surface:light-dark(oklch(0.975 0.004 265),oklch(0.31 0.011 265));
--vibeui-resizable-004-accent:light-dark(oklch(0.55 0.17 275),oklch(0.74 0.15 275));
--vibeui-resizable-004-limit:light-dark(oklch(0.62 0.16 55),oklch(0.78 0.14 55));
--vibeui-resizable-004-badge:light-dark(oklch(0.93 0.045 55),oklch(0.38 0.06 55));
--vibeui-resizable-004-badge-fg:light-dark(oklch(0.42 0.12 55),oklch(0.9 0.08 55));
--vibeui-resizable-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="resizable-004"]{color-scheme:dark}
[data-vibeui-block="resizable-004"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:34rem;padding:0.875rem;
border:1px solid var(--vibeui-resizable-004-border);border-radius:0.875rem;
background:var(--vibeui-resizable-004-bg);color:var(--vibeui-resizable-004-fg);
font-family:var(--vibeui-resizable-004-font);
}
[data-vibeui-block="resizable-004"] *{box-sizing:border-box}
[data-vibeui-block="resizable-004"] [data-part="frame"]{
display:flex;align-items:stretch;height:11rem;
border:1px solid var(--vibeui-resizable-004-border);border-radius:0.75rem;overflow:hidden;
}
[data-vibeui-block="resizable-004"] [data-part="side"]{
flex:none;min-width:0;padding:0.75rem;overflow:auto;background:var(--vibeui-resizable-004-surface);
}
[data-vibeui-block="resizable-004"] [data-part="main"]{
flex:1;min-width:0;padding:0.75rem;overflow:auto;background:var(--vibeui-resizable-004-pane);
}
[data-vibeui-block="resizable-004"] h3{margin:0 0 0.375rem;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="resizable-004"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.3125rem}
[data-vibeui-block="resizable-004"] li{
font-size:0.75rem;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
color:var(--vibeui-resizable-004-muted);
}
[data-vibeui-block="resizable-004"] p{margin:0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-resizable-004-muted)}
[data-vibeui-block="resizable-004"] [data-part="split"]{
flex:none;width:0.75rem;position:relative;
background:var(--vibeui-resizable-004-surface);cursor:col-resize;touch-action:none;
}
[data-vibeui-block="resizable-004"] [data-part="split"]::before{
content:"";position:absolute;inset:0 calc(50% - 1px);border-radius:9999px;
background:var(--vibeui-resizable-004-border);
transition:background-color .15s ease;
}
[data-vibeui-block="resizable-004"] [data-part="split"]:hover::before{background:var(--vibeui-resizable-004-accent)}
[data-vibeui-block="resizable-004"] [data-part="split"]:focus-visible{
outline:2px solid var(--vibeui-resizable-004-accent);outline-offset:-2px;
}
/* Упор в предел красит полосу: без этого перетаскивание выглядит как
   зависший интерфейс — курсор едет, панель стоит. */
[data-vibeui-block="resizable-004"][data-limit="true"] [data-part="split"]::before{
background:var(--vibeui-resizable-004-limit);
}
[data-vibeui-block="resizable-004"] [data-part="status"]{
display:flex;align-items:center;gap:0.5rem;margin:0;
font-size:0.75rem;color:var(--vibeui-resizable-004-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="resizable-004"] [data-part="badge"]{
display:inline-flex;align-items:center;padding:0.0625rem 0.375rem;border-radius:9999px;
background:var(--vibeui-resizable-004-badge);
color:var(--vibeui-resizable-004-badge-fg);font-size:0.6875rem;font-weight:650;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="resizable-004"] *{animation:none!important;transition:none!important}}
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
 * Панель с пределами в пикселях: размер зажат между min и max, а упор в
 * предел показан цветом и подписью. Один файл, ноль зависимостей.
 */
export function Resizable004({
  label = "Ширина меню",
  defaultSize = 200,
  min = 144,
  max = 288,
  step = 16,
  onChange,
  navTitle = "Разделы",
  navItems = [
    "Заказы и возвраты",
    "Склад",
    "Отчёты за период",
    "Настройки доставки",
  ],
  mainTitle = "Заказ № 4821",
  mainText = "Основная область забирает остаток ширины, поэтому меню не может выдавить содержимое за край.",
  statusText = "Меню — {size} px",
  minText = "минимум {value}",
  maxText = "максимум {value}",
  valueText = "{size} пикселей",
  background = "",
  accent,
  className,
  style,
  ...props
}: Resizable004Props) {
  const [size, setSize] = useState(defaultSize)
  const [dragging, setDragging] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const sideId = useId()

  const palette = {
    ...(accent ? { "--vibeui-resizable-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-resizable-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const apply = (next: number) => {
    const clamped = Math.round(Math.min(max, Math.max(min, next)))

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

  const atLimit = size <= min || size >= max

  return (
    <>
      <style href="vibeui-resizable-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="resizable"
        data-vibeui-block="resizable-004"
        data-limit={atLimit}
        className={className}
        style={palette}
      >
        <div data-part="frame" ref={frame}>
          <nav
            data-part="side"
            id={sideId}
            style={{ width: `${size}px` }}
            aria-label={navTitle}
          >
            <h3>{navTitle}</h3>
            <ul>
              {navItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </nav>
          <div
            data-part="split"
            role="separator"
            tabIndex={0}
            aria-orientation="vertical"
            aria-label={label}
            aria-controls={sideId}
            aria-valuenow={size}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuetext={valueText.replace("{size}", String(size))}
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

              if (!box) {
                return
              }

              apply(event.clientX - box.left)
            }}
            onPointerUp={(event) => {
              event.currentTarget.releasePointerCapture(event.pointerId)
              setDragging(false)
            }}
            onPointerCancel={() => setDragging(false)}
          />
          <main data-part="main">
            <h3>{mainTitle}</h3>
            <p>{mainText}</p>
          </main>
        </div>
        <p data-part="status" role="status">
          {statusText.replace("{size}", String(size))}
          {size <= min ? (
            <span data-part="badge">
              {minText.replace("{value}", String(min))}
            </span>
          ) : null}
          {size >= max ? (
            <span data-part="badge">
              {maxText.replace("{value}", String(max))}
            </span>
          ) : null}
        </p>
      </div>
    </>
  )
}
