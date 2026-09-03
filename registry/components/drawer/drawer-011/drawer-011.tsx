"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Drawer011Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  text?: string
  /** Ширины-пресеты в rem: узкая, средняя, широкая. */
  widths?: number[]
  /** Подписи пресетов в том же порядке. */
  widthText?: string[]
  /** Какая ширина выбрана при первом показе. */
  defaultWidth?: number
  /** Подпись ручки изменения ширины. */
  grabberLabel?: string
  closeLabel?: string
  /** Открыть шторку сразу и без модального режима: она остаётся внутри блока. */
  defaultOpen?: boolean
  accent?: string
  /** Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: рабочая панель, ширину которой подбирают под задачу.
// Обычно это делают перетаскиванием края, и тогда управление существует
// только для мыши: с клавиатуры и на телефоне панель остаётся такой, какой
// её сделал дизайнер. Здесь ширину двигают и мышью за край, и стрелками —
// ручка это настоящий разделитель с role=separator, у которого есть
// значение и границы. Рядом стоят три пресета: чаще всего нужна не любая
// ширина, а «узкая», «обычная» или «во весь экран».
const STYLES = `
:where([data-vibeui-block="drawer-011"]){
--vibeui-drawer-011-bg:light-dark(oklch(0.99 0.002 265),oklch(0.22 0.014 265));
--vibeui-drawer-011-fg:light-dark(oklch(0.25 0.014 265),oklch(0.95 0.005 265));
--vibeui-drawer-011-muted:color-mix(in oklab,var(--vibeui-drawer-011-fg) 62%,transparent);
--vibeui-drawer-011-border:light-dark(oklch(0 0 0 / 12%),oklch(1 0 0 / 13%));
--vibeui-drawer-011-head:light-dark(oklch(0 0 0 / 3%),oklch(1 0 0 / 4%));
--vibeui-drawer-011-hover:light-dark(oklch(0 0 0 / 5%),oklch(1 0 0 / 7%));
--vibeui-drawer-011-grip:light-dark(oklch(0 0 0 / 16%),oklch(1 0 0 / 22%));
--vibeui-drawer-011-accent:light-dark(oklch(0.5 0.16 265),oklch(0.78 0.12 265));
--vibeui-drawer-011-soft:color-mix(in oklab,var(--vibeui-drawer-011-accent) 14%,transparent);
--vibeui-drawer-011-scrim:light-dark(oklch(0.2 0.02 265 / 42%),oklch(0 0 0 / 62%));
--vibeui-drawer-011-shadow:light-dark(oklch(0.2 0.02 265 / 40%),oklch(0 0 0 / 70%));
--vibeui-drawer-011-width:26rem;
--vibeui-drawer-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="drawer-011"]{color-scheme:dark}
[data-vibeui-block="drawer-011"]{
display:inline-block;font-family:var(--vibeui-drawer-011-font);color:var(--vibeui-drawer-011-fg);
}
[data-vibeui-block="drawer-011"] *{box-sizing:border-box}
[data-vibeui-block="drawer-011"] [data-part="trigger"]{
appearance:none;cursor:pointer;
min-height:2.25rem;padding:0.375rem 0.875rem;
border:1px solid var(--vibeui-drawer-011-border);border-radius:0.625rem;
background:var(--vibeui-drawer-011-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="drawer-011"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-drawer-011-accent);outline-offset:2px}
/* Ширина живёт в переменной: её двигают и ручка, и пресеты, и раскладка от
   этого не пересобирается. */
[data-vibeui-block="drawer-011"] dialog{
position:fixed;inset:0 0 0 auto;
width:min(var(--vibeui-drawer-011-width),100vw);max-width:100vw;height:100%;
margin:0;padding:0;border:0;
background:var(--vibeui-drawer-011-bg);color:var(--vibeui-drawer-011-fg);
box-shadow:-24px 0 60px -30px var(--vibeui-drawer-011-shadow);
translate:100% 0;
transition:translate .22s ease,width .18s ease,overlay .22s allow-discrete,display .22s allow-discrete;
}
[data-vibeui-block="drawer-011"] dialog[open]{translate:0 0}
@starting-style{
[data-vibeui-block="drawer-011"] dialog[open]{translate:100% 0}
}
[data-vibeui-block="drawer-011"] dialog::backdrop{background:var(--vibeui-drawer-011-scrim)}
[data-vibeui-block="drawer-011"] [data-part="panel"]{
display:flex;height:100%;
}
/* Ручка — настоящий разделитель: у неё есть значение, границы и стрелки,
   поэтому ширину меняют и без мыши. */
[data-vibeui-block="drawer-011"] [data-part="grabber"]{
appearance:none;border:0;cursor:col-resize;flex:none;
width:0.75rem;align-self:stretch;
display:flex;align-items:center;justify-content:center;
background:transparent;
}
[data-vibeui-block="drawer-011"] [data-part="grabber"]::before{
content:"";width:0.1875rem;height:2.5rem;border-radius:999px;
background:var(--vibeui-drawer-011-grip);
transition:background-color .16s ease;
}
[data-vibeui-block="drawer-011"] [data-part="grabber"]:hover::before{background:var(--vibeui-drawer-011-accent)}
[data-vibeui-block="drawer-011"] [data-part="grabber"]:focus-visible{outline:2px solid var(--vibeui-drawer-011-accent);outline-offset:-2px}
[data-vibeui-block="drawer-011"] [data-part="body"]{
flex:1;min-width:0;display:flex;flex-direction:column;
border-inline-start:1px solid var(--vibeui-drawer-011-border);
}
[data-vibeui-block="drawer-011"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.875rem 1rem;
background:var(--vibeui-drawer-011-head);
border-bottom:1px solid var(--vibeui-drawer-011-border);
}
[data-vibeui-block="drawer-011"] [data-part="title"]{margin:0;font-size:1rem;font-weight:650}
[data-vibeui-block="drawer-011"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;flex:none;
display:flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:0.5rem;
background:transparent;color:var(--vibeui-drawer-011-muted);font:inherit;
}
[data-vibeui-block="drawer-011"] [data-part="close"]:hover{background:var(--vibeui-drawer-011-hover);color:var(--vibeui-drawer-011-fg)}
[data-vibeui-block="drawer-011"] [data-part="content"]{
flex:1;min-height:0;overflow-y:auto;
display:flex;flex-direction:column;gap:0.75rem;
padding:0.875rem 1rem;
scrollbar-width:thin;scrollbar-color:var(--vibeui-drawer-011-border) transparent;
}
[data-vibeui-block="drawer-011"] [data-part="text"]{margin:0;font-size:0.875rem;line-height:1.5}
[data-vibeui-block="drawer-011"] [data-part="sizes"]{display:flex;flex-wrap:wrap;gap:0.25rem}
[data-vibeui-block="drawer-011"] [data-part="size"]{
appearance:none;cursor:pointer;
min-height:1.875rem;padding:0.25rem 0.625rem;border-radius:999px;
border:1px solid var(--vibeui-drawer-011-border);
background:transparent;color:inherit;
font:inherit;font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="drawer-011"] [data-part="size"]:hover{background:var(--vibeui-drawer-011-hover)}
[data-vibeui-block="drawer-011"] [data-part="size"][aria-pressed="true"]{
background:var(--vibeui-drawer-011-soft);border-color:var(--vibeui-drawer-011-accent);
}
[data-vibeui-block="drawer-011"] [data-part="size"]:focus-visible{outline:2px solid var(--vibeui-drawer-011-accent);outline-offset:2px}
[data-vibeui-block="drawer-011"] [data-part="current"]{
margin:0;font-size:0.75rem;color:var(--vibeui-drawer-011-muted);font-variant-numeric:tabular-nums;
}
/* Немодальный показ: шторка остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так её показывают на витрине и в документации. */
[data-vibeui-block="drawer-011"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:24rem;
}
[data-vibeui-block="drawer-011"] dialog:not(:modal){position:absolute;max-width:100%;max-height:100%;z-index:1}
[data-vibeui-block="drawer-011"]:has(dialog:not(:modal)[open]) [data-part="trigger"]{display:none}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="drawer-011"] dialog{transition:none!important;translate:0 0}
[data-vibeui-block="drawer-011"] *{animation:none!important}
}
`

const DEFAULT_WIDTHS = [22, 30, 40]
const DEFAULT_WIDTH_TEXT = ["Узкая", "Обычная", "Широкая"]

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
 * Шторка с изменяемой шириной: ручка со стрелками и пресеты рядом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Drawer011({
  triggerLabel = "Открыть панель",
  title = "Свойства блока",
  text = "Ширину подбирают под задачу: узкая не мешает списку за спиной, широкая вмещает таблицу целиком. Потяните за край или нажмите стрелку.",
  widths = DEFAULT_WIDTHS,
  widthText = DEFAULT_WIDTH_TEXT,
  defaultWidth = 30,
  grabberLabel = "Ширина панели",
  closeLabel = "Закрыть",
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Drawer011Props) {
  const panel = useRef<HTMLDialogElement>(null)
  const [width, setWidth] = useState(defaultWidth)

  const min = Math.min(...widths)
  const max = Math.max(...widths)

  useEffect(() => {
    if (!defaultOpen) {
      return
    }

    const active = document.activeElement

    // show() вместо showModal(): немодальная шторка живёт внутри своего блока
    // и не уводит страницу в верхний слой. Витрине нужна именно такая.
    panel.current?.show()

    // show() уводит фокус внутрь панели. Для немодального показа это лишнее:
    // страница не должна прыгать к шторке просто потому, что та открыта.
    if (active instanceof HTMLElement && active !== document.body) {
      active.focus()
    } else if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [defaultOpen])

  const clamp = (value: number) => Math.min(max, Math.max(min, value))

  // Тянут влево — панель растёт: она прижата к правому краю, и движение
  // указателя читается как «шире», а не «правее».
  const drag = (startX: number, startWidth: number) => {
    const root = document.documentElement
    const step = Number.parseFloat(getComputedStyle(root).fontSize) || 16

    const move = (event: PointerEvent) => {
      setWidth(clamp(startWidth + (startX - event.clientX) / step))
    }

    const stop = () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", stop)
    }

    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", stop)
  }

  const keys = (event: KeyboardEvent<HTMLButtonElement>) => {
    const shift =
      event.key === "ArrowLeft" ? 2 : event.key === "ArrowRight" ? -2 : 0

    if (shift === 0) {
      if (event.key === "Home") {
        event.preventDefault()
        setWidth(min)
      } else if (event.key === "End") {
        event.preventDefault()
        setWidth(max)
      }

      return
    }

    event.preventDefault()
    setWidth((value) => clamp(value + shift))
  }

  const palette = {
    "--vibeui-drawer-011-width": `${width}rem`,
    ...(accent ? { "--vibeui-drawer-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-drawer-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-drawer-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="drawer"
        data-vibeui-block="drawer-011"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="trigger"
          onClick={() => panel.current?.showModal()}
        >
          {triggerLabel}
        </button>

        <dialog ref={panel} aria-label={title}>
          <div data-part="panel">
            <button
              type="button"
              data-part="grabber"
              role="separator"
              aria-label={grabberLabel}
              aria-orientation="vertical"
              aria-valuenow={Math.round(width)}
              aria-valuemin={min}
              aria-valuemax={max}
              onPointerDown={(event) => {
                event.preventDefault()
                drag(event.clientX, width)
              }}
              onKeyDown={keys}
            />

            <div data-part="body">
              <div data-part="head">
                <h2 data-part="title">{title}</h2>
                <button
                  type="button"
                  data-part="close"
                  aria-label={closeLabel}
                  onClick={() => panel.current?.close()}
                >
                  ×
                </button>
              </div>

              <div data-part="content">
                <p data-part="text">{text}</p>

                {/* Пресеты рядом с ручкой: чаще нужна не любая ширина, а
                    «узкая», «обычная» или «широкая». */}
                <div data-part="sizes" role="group" aria-label={grabberLabel}>
                  {widths.map((value, index) => (
                    <button
                      key={value}
                      type="button"
                      data-part="size"
                      aria-pressed={Math.round(width) === value}
                      onClick={() => setWidth(value)}
                    >
                      {widthText[index] ?? `${value} rem`}
                    </button>
                  ))}
                </div>

                <p data-part="current" aria-live="polite">
                  Ширина: {Math.round(width)} rem
                </p>
              </div>
            </div>
          </div>
        </dialog>
      </div>
    </>
  )
}
