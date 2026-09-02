"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Resizable003Props = Omit<
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
  editorLabel?: string
  code?: string
  resultLabel?: string
  resultTitle?: string
  resultText?: string
  /** Строка состояния; {size} заменяется на текущий процент. */
  statusText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: вертикальное разделение — редактор сверху, результат снизу.
// Разделитель здесь горизонтальный, поэтому aria-orientation="horizontal", а
// размер меняют стрелки вверх и вниз: у направления клавиш и у оси движения
// обязана быть одна логика, иначе с клавиатуры панель ведёт себя наугад.
const STYLES = `
:where([data-vibeui-block="resizable-003"]){
--vibeui-resizable-003-bg:transparent;
--vibeui-resizable-003-pane:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-resizable-003-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-resizable-003-muted:light-dark(oklch(0.55 0.014 265),oklch(0.72 0.012 265));
--vibeui-resizable-003-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-resizable-003-surface:light-dark(oklch(0.975 0.004 265),oklch(0.31 0.011 265));
--vibeui-resizable-003-code:light-dark(oklch(0.28 0.02 265),oklch(0.18 0.014 265));
--vibeui-resizable-003-accent:light-dark(oklch(0.53 0.15 145),oklch(0.76 0.15 145));
--vibeui-resizable-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-resizable-003-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
[data-vibeui-block="resizable-003"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:26rem;padding:0.875rem;
border:1px solid var(--vibeui-resizable-003-border);border-radius:0.875rem;
background:var(--vibeui-resizable-003-bg);color:var(--vibeui-resizable-003-fg);
font-family:var(--vibeui-resizable-003-font);
}
[data-vibeui-block="resizable-003"] *{box-sizing:border-box}
[data-vibeui-block="resizable-003"] [data-part="frame"]{
display:flex;flex-direction:column;height:15rem;
border:1px solid var(--vibeui-resizable-003-border);border-radius:0.75rem;overflow:hidden;
}
[data-vibeui-block="resizable-003"] [data-part="pane"]{min-height:0;overflow:auto;background:var(--vibeui-resizable-003-pane)}
[data-vibeui-block="resizable-003"] [data-part="pane"][data-role="rest"]{flex:1}
[data-vibeui-block="resizable-003"] [data-part="pane"][data-role="fixed"]{flex:none}
[data-vibeui-block="resizable-003"] [data-part="editor"]{
background:var(--vibeui-resizable-003-code);color:oklch(0.95 0.01 265);
font-family:var(--vibeui-resizable-003-mono);font-size:0.75rem;line-height:1.6;
padding:0.625rem 0.75rem;margin:0;white-space:pre;
}
[data-vibeui-block="resizable-003"] [data-part="result"]{padding:0.75rem;background:var(--vibeui-resizable-003-pane)}
[data-vibeui-block="resizable-003"] h3{margin:0 0 0.375rem;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="resizable-003"] p{margin:0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-resizable-003-muted)}
/* Разделитель тянется на всю ширину и имеет высоту 0.75rem: горизонтальную
   полосу ловят курсором хуже вертикальной, потому что двигают руку по игреку. */
[data-vibeui-block="resizable-003"] [data-part="split"]{
flex:none;height:0.75rem;position:relative;
background:var(--vibeui-resizable-003-surface);
cursor:row-resize;touch-action:none;
}
[data-vibeui-block="resizable-003"] [data-part="split"]::before{
content:"";position:absolute;inset:calc(50% - 0.5px) 0;background:var(--vibeui-resizable-003-border);
}
[data-vibeui-block="resizable-003"] [data-part="split"]::after{
content:"";position:absolute;left:50%;top:50%;
width:1.75rem;height:0.1875rem;margin:-0.09375rem 0 0 -0.875rem;border-radius:9999px;
background:var(--vibeui-resizable-003-border);
transition:background-color .15s ease;
}
[data-vibeui-block="resizable-003"] [data-part="split"]:hover::after,
[data-vibeui-block="resizable-003"] [data-part="split"][data-dragging="true"]::after{
background:var(--vibeui-resizable-003-accent);
}
[data-vibeui-block="resizable-003"] [data-part="split"]:focus-visible{
outline:2px solid var(--vibeui-resizable-003-accent);outline-offset:-2px;
}
[data-vibeui-block="resizable-003"] [data-part="status"]{
margin:0;font-size:0.75rem;color:var(--vibeui-resizable-003-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="resizable-003"] *{animation:none!important;transition:none!important}}
`

const CODE = `.card {
  display: grid;
  gap: 12px;
  padding: 16px;
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
 * Вертикальное разделение: редактор сверху, результат снизу, размер меняют
 * перетаскивание и стрелки вверх-вниз. Один файл, ноль зависимостей.
 */
export function Resizable003({
  label = "Высота редактора",
  defaultSize = 52,
  min = 20,
  max = 80,
  step = 5,
  onChange,
  editorLabel = "Редактор",
  code = CODE,
  resultLabel = "Результат",
  resultTitle = "Карточка",
  resultText = "Нижняя панель занимает остаток высоты, поэтому результат не исчезает, даже когда редактор растянут до предела.",
  statusText = "Редактор занимает {size}% высоты.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Resizable003Props) {
  const [size, setSize] = useState(defaultSize)
  const [dragging, setDragging] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const editorId = useId()

  const palette = {
    ...(accent ? { "--vibeui-resizable-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-resizable-003-bg": background,
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
    if (event.key === "ArrowUp") {
      event.preventDefault()
      apply(size - step)
    } else if (event.key === "ArrowDown") {
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
      <style href="vibeui-resizable-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="resizable-003"
        className={className}
        style={palette}
      >
        <div data-part="frame" ref={frame}>
          <section
            data-part="pane"
            data-role="fixed"
            id={editorId}
            style={{ height: `${size}%` }}
            aria-label={editorLabel}
          >
            <pre data-part="editor">{code}</pre>
          </section>
          <div
            data-part="split"
            role="separator"
            tabIndex={0}
            aria-orientation="horizontal"
            aria-label={label}
            aria-controls={editorId}
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
          <section data-part="pane" data-role="rest" aria-label={resultLabel}>
            <div data-part="result">
              <h3>{resultTitle}</h3>
              <p>{resultText}</p>
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
