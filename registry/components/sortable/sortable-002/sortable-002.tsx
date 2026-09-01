"use client"

import { useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  DragEvent,
  KeyboardEvent,
} from "react"

export type Sortable002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  title?: string
  items?: string[]
  onChange?: (items: string[]) => void
  accent?: string
}

// Идея компонента: одна ручка вместо пары кнопок. В sortable-001 клавиатурный
// путь сделан отдельными стрелками «выше» и «ниже» — здесь ручка сама и есть
// клавиатурный орган: пробел берёт строку, стрелки несут, пробел кладёт,
// Escape возвращает к порядку на момент захвата. Это та же модель, что у мыши,
// поэтому объяснять её отдельно не приходится. Пока строка «в руке», у неё
// поднятый вид и aria-pressed на ручке, а каждый шаг произносится в живой
// области: без озвучки перенос вслепую невозможен.
const STYLES = `
:where([data-vibeui-block="sortable-002"]){
--vibeui-sortable-002-bg:oklch(1 0 0);
--vibeui-sortable-002-row:oklch(0.99 0.002 265);
--vibeui-sortable-002-fg:oklch(0.24 0.014 265);
--vibeui-sortable-002-muted:oklch(0.56 0.014 265);
--vibeui-sortable-002-border:oklch(0.9 0.006 265);
--vibeui-sortable-002-accent:oklch(0.55 0.2 262);
--vibeui-sortable-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="sortable-002"]{
position:relative;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-sortable-002-bg);
border:1px solid var(--vibeui-sortable-002-border);border-radius:0.875rem;
font-family:var(--vibeui-sortable-002-font);color:var(--vibeui-sortable-002-fg);
}
[data-vibeui-block="sortable-002"] *{box-sizing:border-box}
[data-vibeui-block="sortable-002"] h3{margin:0 0 0.125rem;font-size:0.875rem;font-weight:650}
[data-vibeui-block="sortable-002"] [data-part="hint"]{margin:0 0 0.625rem;font-size:0.6875rem;line-height:1.4;color:var(--vibeui-sortable-002-muted)}
[data-vibeui-block="sortable-002"] ol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.375rem}
[data-vibeui-block="sortable-002"] li{
display:flex;align-items:center;gap:0.5rem;
padding:0.375rem 0.5rem;border-radius:0.625rem;
border:1px solid var(--vibeui-sortable-002-border);
background:var(--vibeui-sortable-002-row);font-size:0.8125rem;
transition:transform .15s ease,box-shadow .15s ease,border-color .15s ease;
}
/* Поднятая строка отличается тенью и сдвигом: цвет рамки один не читается. */
[data-vibeui-block="sortable-002"] li[data-held="true"]{
border-color:var(--vibeui-sortable-002-accent);
box-shadow:0 8px 18px oklch(0.2 0.02 265 / 16%);
transform:translateY(-1px);
}
[data-vibeui-block="sortable-002"] li[data-dragging="true"]{opacity:.45}
[data-vibeui-block="sortable-002"] li[data-over="true"]{box-shadow:inset 0 2px 0 var(--vibeui-sortable-002-accent)}
/* Ручка — кнопка: только так стрелки достаются с клавиатуры. */
[data-vibeui-block="sortable-002"] [data-part="grip"]{
flex:none;appearance:none;border:0;background:none;cursor:grab;
display:grid;gap:2.5px;padding:0.375rem 0.3125rem;border-radius:0.5rem;
color:var(--vibeui-sortable-002-muted);
}
[data-vibeui-block="sortable-002"] [data-part="grip"] span{
display:block;width:0.75rem;height:2px;border-radius:1px;background:currentColor;opacity:.7;
}
[data-vibeui-block="sortable-002"] [data-part="grip"]:focus-visible{outline:2px solid var(--vibeui-sortable-002-accent);outline-offset:1px}
[data-vibeui-block="sortable-002"] [data-part="grip"][aria-pressed="true"]{cursor:grabbing;color:var(--vibeui-sortable-002-accent)}
[data-vibeui-block="sortable-002"] [data-part="index"]{
flex:none;width:1.125rem;text-align:right;
font-size:0.75rem;color:var(--vibeui-sortable-002-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="sortable-002"] [data-part="text"]{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="sortable-002"] [data-part="live"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sortable-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS = [
  "Обложка",
  "Описание объекта",
  "Планировки",
  "Расположение",
  "Условия покупки",
]

/**
 * Список с ручкой, которая работает и мышью, и клавиатурой: взять, нести, положить.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sortable002({
  title = "Порядок разделов",
  items = DEFAULT_ITEMS,
  onChange,
  accent,
  className,
  style,
  ...props
}: Sortable002Props) {
  const [order, setOrder] = useState(items)
  const [held, setHeld] = useState<string | null>(null)
  const [snapshot, setSnapshot] = useState(items)
  const [dragged, setDragged] = useState<string | null>(null)
  const [over, setOver] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState("")

  const apply = (next: string[]) => {
    setOrder(next)
    onChange?.(next)
  }

  const move = (from: number, to: number) => {
    const next = [...order]
    const [row] = next.splice(from, 1)
    next.splice(to, 0, row)
    apply(next)
    return next
  }

  const handleKey = (event: KeyboardEvent<HTMLButtonElement>, row: string) => {
    const index = order.indexOf(row)

    if (event.key === " " || event.key === "Enter") {
      event.preventDefault()

      if (held === row) {
        setHeld(null)
        setAnnouncement(
          `«${row}» положена на позицию ${index + 1} из ${order.length}.`,
        )
      } else {
        setHeld(row)
        setSnapshot(order)
        setAnnouncement(
          `«${row}» взята, позиция ${index + 1} из ${order.length}. Стрелки вверх и вниз несут строку.`,
        )
      }

      return
    }

    if (event.key === "Escape" && held === row) {
      event.preventDefault()
      apply(snapshot)
      setHeld(null)
      setAnnouncement(
        `Перенос отменён, «${row}» вернулась на позицию ${snapshot.indexOf(row) + 1}.`,
      )
      return
    }

    if (held !== row) return

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault()
      const to = index + (event.key === "ArrowUp" ? -1 : 1)

      if (to < 0 || to >= order.length) {
        setAnnouncement(
          `Край списка, «${row}» на позиции ${index + 1} из ${order.length}.`,
        )
        return
      }

      move(index, to)
      setAnnouncement(`«${row}» на позиции ${to + 1} из ${order.length}.`)
    }
  }

  const drop = (event: DragEvent<HTMLLIElement>, target: string) => {
    event.preventDefault()
    setOver(null)
    if (!dragged || dragged === target) return

    const next = move(order.indexOf(dragged), order.indexOf(target))
    setAnnouncement(
      `«${dragged}» перенесена на позицию ${next.indexOf(dragged) + 1} из ${next.length}.`,
    )
    setDragged(null)
  }

  const palette = {
    ...(accent ? { "--vibeui-sortable-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sortable-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="sortable-002"
        className={className}
        style={palette}
      >
        <h3>{title}</h3>
        <p data-part="hint">
          Мышью — за ручку. С клавиатуры: пробел берёт строку, стрелки несут,
          пробел кладёт, Escape отменяет.
        </p>
        <ol>
          {order.map((row, index) => (
            <li
              key={row}
              draggable
              data-held={row === held}
              data-dragging={row === dragged}
              data-over={row === over}
              onDragStart={() => setDragged(row)}
              onDragEnd={() => {
                setDragged(null)
                setOver(null)
              }}
              onDragOver={(event) => {
                event.preventDefault()
                setOver(row)
              }}
              onDrop={(event) => drop(event, row)}
            >
              <button
                type="button"
                data-part="grip"
                aria-pressed={row === held}
                aria-label={`Перенести «${row}», позиция ${index + 1} из ${order.length}`}
                onKeyDown={(event) => handleKey(event, row)}
                onBlur={() => {
                  if (held === row) setHeld(null)
                }}
              >
                <span />
                <span />
                <span />
              </button>
              <span data-part="index">{index + 1}</span>
              <span data-part="text">{row}</span>
            </li>
          ))}
        </ol>
        <span data-part="live" role="status" aria-live="assertive">
          {announcement}
        </span>
      </div>
    </>
  )
}
