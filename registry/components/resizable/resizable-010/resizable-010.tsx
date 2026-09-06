"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentProps,
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
} from "react"

export type Resizable010Props = Omit<
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
  listLabel?: string
  listTitle?: string
  tasks?: string[]
  detailsLabel?: string
  detailsTitle?: string
  detailsText?: string
  /** Строка состояния; {size} заменяется на текущий процент. */
  statusText?: string
  equalText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: вертикальное разделение списка и подробностей, но, в
// отличие от процентной высоты, доля хранится в fr прямо в grid-template-rows.
// При изменении высоты рамки список и подробности делят место в той же
// пропорции сами — без обработчика resize и без пересчёта в пикселях.
const STYLES = `
:where([data-vibeui-block="resizable-010"]){
--vibeui-resizable-010-bg:transparent;
--vibeui-resizable-010-pane:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-resizable-010-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-resizable-010-muted:color-mix(in oklab,var(--vibeui-resizable-010-fg) 68%,transparent);
--vibeui-resizable-010-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-resizable-010-surface:light-dark(oklch(0.975 0 265),oklch(0.31 0 265));
--vibeui-resizable-010-accent:light-dark(oklch(0.58 0.16 40),oklch(0.78 0.15 40));
--vibeui-resizable-010-top:1;
--vibeui-resizable-010-bottom:1;
--vibeui-resizable-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="resizable-010"]{color-scheme:dark}
[data-vibeui-block="resizable-010"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:26rem;padding:0.875rem;
border:1px solid var(--vibeui-resizable-010-border);border-radius:0.875rem;
background:var(--vibeui-resizable-010-bg);color:var(--vibeui-resizable-010-fg);
font-family:var(--vibeui-resizable-010-font);
}
[data-vibeui-block="resizable-010"] *{box-sizing:border-box}
/* Пропорция живёт в grid-template-rows: доля fr сверху, полоса, доля fr снизу. */
[data-vibeui-block="resizable-010"] [data-part="frame"]{
display:grid;height:16rem;
grid-template-rows:calc(var(--vibeui-resizable-010-top) * 1fr) 0.75rem calc(var(--vibeui-resizable-010-bottom) * 1fr);
border:1px solid var(--vibeui-resizable-010-border);border-radius:0.75rem;overflow:hidden;
}
[data-vibeui-block="resizable-010"] [data-part="pane"]{min-height:0;padding:0.75rem;overflow:auto;background:var(--vibeui-resizable-010-pane)}
[data-vibeui-block="resizable-010"] [data-part="pane"][data-role="details"]{background:var(--vibeui-resizable-010-surface)}
[data-vibeui-block="resizable-010"] h3{margin:0 0 0.375rem;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="resizable-010"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.3125rem}
[data-vibeui-block="resizable-010"] li{
font-size:0.75rem;line-height:1.3;padding:0.25rem 0.375rem;border-radius:0.375rem;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="resizable-010"] li[data-active="true"]{
background:color-mix(in oklab,var(--vibeui-resizable-010-accent) 14%,transparent);
color:color-mix(in oklab,var(--vibeui-resizable-010-accent) 72%,light-dark(black,white));
font-weight:650;
}
[data-vibeui-block="resizable-010"] p{margin:0;font-size:0.75rem;line-height:1.55;color:var(--vibeui-resizable-010-muted)}
/* Разделитель горизонтальный: цель нажатия выше своей видимой линии. */
[data-vibeui-block="resizable-010"] [data-part="split"]{
position:relative;background:var(--vibeui-resizable-010-surface);
cursor:row-resize;touch-action:none;
}
[data-vibeui-block="resizable-010"] [data-part="split"]::before{
content:"";position:absolute;inset:calc(50% - 0.5px) 0;background:var(--vibeui-resizable-010-border);
transition:background-color .15s ease;
}
[data-vibeui-block="resizable-010"] [data-part="split"]:hover::before,
[data-vibeui-block="resizable-010"] [data-part="split"][data-dragging="true"]::before{
inset:calc(50% - 1.5px) 0;background:var(--vibeui-resizable-010-accent);
}
[data-vibeui-block="resizable-010"] [data-part="split"]:focus-visible{
outline:2px solid var(--vibeui-resizable-010-accent);outline-offset:-2px;
}
[data-vibeui-block="resizable-010"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="resizable-010"] [data-part="status"]{
margin:0;font-size:0.75rem;color:var(--vibeui-resizable-010-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="resizable-010"] button{
appearance:none;cursor:pointer;font:inherit;border:0;background:none;padding:0;
color:var(--vibeui-resizable-010-accent);font-size:0.75rem;font-weight:600;
text-decoration:underline;text-underline-offset:0.2em;
}
[data-vibeui-block="resizable-010"] button:focus-visible{
outline:2px solid var(--vibeui-resizable-010-accent);outline-offset:2px;border-radius:0.25rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="resizable-010"] *{animation:none!important;transition:none!important}}
`

const TASKS = [
  "Проверить макет",
  "Согласовать смету",
  "Написать отчёт",
  "Созвониться с клиентом",
]

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
 * Вертикальное разделение списка задач и подробностей: доля в fr, горизонтальный
 * разделитель со стрелками вверх-вниз. Один файл, ноль зависимостей.
 */
export function Resizable010({
  label = "Высота списка",
  defaultRatio = 45,
  min = 20,
  max = 80,
  step = 5,
  onChange,
  listLabel = "Список задач",
  listTitle = "Задачи",
  tasks = TASKS,
  detailsLabel = "Подробности",
  detailsTitle = "Согласовать смету",
  detailsText = "Срок — пятница, исполнитель — бухгалтерия. Подробности растут вниз вместе с высотой нижней доли.",
  statusText = "Список — {size}% высоты.",
  equalText = "Поровну",
  background = "",
  accent,
  className,
  style,
  ...props
}: Resizable010Props) {
  const [ratio, setRatio] = useState(defaultRatio)
  const [dragging, setDragging] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const listId = useId()

  const palette = {
    "--vibeui-resizable-010-top": String(Math.round(ratio)),
    "--vibeui-resizable-010-bottom": String(100 - Math.round(ratio)),
    ...(accent ? { "--vibeui-resizable-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-resizable-010-bg": background,
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
    if (event.key === "ArrowUp") {
      event.preventDefault()
      apply(ratio - step)
    } else if (event.key === "ArrowDown") {
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

  return (
    <>
      <style href="vibeui-resizable-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="resizable"
        data-vibeui-block="resizable-010"
        className={className}
        style={palette}
      >
        <div data-part="frame" ref={frame}>
          <section data-part="pane" id={listId} aria-label={listLabel}>
            <h3>{listTitle}</h3>
            <ul>
              {tasks.map((task, index) => (
                <li key={task} data-active={index === 1 || undefined}>
                  {task}
                </li>
              ))}
            </ul>
          </section>
          <div
            data-part="split"
            role="separator"
            tabIndex={0}
            aria-orientation="horizontal"
            aria-label={label}
            aria-controls={listId}
            aria-valuenow={Math.round(ratio)}
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
          <section
            data-part="pane"
            data-role="details"
            aria-label={detailsLabel}
          >
            <h3>{detailsTitle}</h3>
            <p>{detailsText}</p>
          </section>
        </div>
        <div data-part="foot">
          <p data-part="status" role="status">
            {statusText.replace("{size}", String(Math.round(ratio)))}
          </p>
          <button type="button" onClick={() => apply(50)}>
            {equalText}
          </button>
        </div>
      </div>
    </>
  )
}
