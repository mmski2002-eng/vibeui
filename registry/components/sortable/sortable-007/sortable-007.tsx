"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties, DragEvent } from "react"

export type Sortable007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  title?: string
  items?: string[]
  undoLabel?: string
  onChange?: (items: string[]) => void
  accent?: string
}

// Идея компонента: перенос, который можно взять назад. Промах мышью в списке —
// обычное дело, а «перетащите обратно» требует помнить, откуда строка приехала.
// Поэтому каждый перенос кладёт в стек прежний порядок, а полоса внизу словами
// называет последнее действие и даёт кнопку отмены; кнопка исчезает, когда
// отменять нечего, — неактивная кнопка без причины сбивает с толку. Отмена
// объявляется в живой области вместе с новой позицией строки, чтобы результат
// был слышен, а не только виден.
const STYLES = `
:where([data-vibeui-block="sortable-007"]){
--vibeui-sortable-007-bg:oklch(1 0 0);
--vibeui-sortable-007-row:oklch(0.99 0.002 265);
--vibeui-sortable-007-fg:oklch(0.24 0.014 265);
--vibeui-sortable-007-muted:oklch(0.56 0.014 265);
--vibeui-sortable-007-border:oklch(0.9 0.006 265);
--vibeui-sortable-007-accent:oklch(0.55 0.2 262);
--vibeui-sortable-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="sortable-007"]{
position:relative;display:grid;gap:0.625rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-sortable-007-bg);
border:1px solid var(--vibeui-sortable-007-border);border-radius:0.875rem;
font-family:var(--vibeui-sortable-007-font);color:var(--vibeui-sortable-007-fg);
}
[data-vibeui-block="sortable-007"] *{box-sizing:border-box}
[data-vibeui-block="sortable-007"] h3{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="sortable-007"] ol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.375rem}
[data-vibeui-block="sortable-007"] li{
display:flex;align-items:center;gap:0.5rem;
padding:0.4375rem 0.5rem;border-radius:0.625rem;
border:1px solid var(--vibeui-sortable-007-border);
background:var(--vibeui-sortable-007-row);font-size:0.8125rem;
}
[data-vibeui-block="sortable-007"] li[data-dragging="true"]{opacity:.45}
[data-vibeui-block="sortable-007"] li[data-over="true"]{box-shadow:inset 0 2px 0 var(--vibeui-sortable-007-accent)}
/* Строка, которую только что вернули, подсвечена: иначе отмену не видно. */
[data-vibeui-block="sortable-007"] li[data-restored="true"]{
border-color:var(--vibeui-sortable-007-accent);
background:color-mix(in oklab,var(--vibeui-sortable-007-accent) 8%,var(--vibeui-sortable-007-bg));
}
[data-vibeui-block="sortable-007"] [data-part="grip"]{flex:none;display:grid;gap:2.5px;padding:0.25rem;cursor:grab}
[data-vibeui-block="sortable-007"] [data-part="grip"] span{
display:block;width:0.75rem;height:2px;border-radius:1px;
background:var(--vibeui-sortable-007-muted);opacity:.6;
}
[data-vibeui-block="sortable-007"] [data-part="index"]{
flex:none;width:1.125rem;text-align:right;
font-size:0.75rem;color:var(--vibeui-sortable-007-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="sortable-007"] [data-part="text"]{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="sortable-007"] [data-part="move"]{
flex:none;appearance:none;border:0;background:none;cursor:pointer;
width:1.5rem;height:1.5rem;border-radius:0.375rem;
color:var(--vibeui-sortable-007-muted);font:inherit;font-size:0.6875rem;line-height:1;
}
[data-vibeui-block="sortable-007"] [data-part="move"]:hover:not(:disabled){color:var(--vibeui-sortable-007-fg)}
[data-vibeui-block="sortable-007"] [data-part="move"]:disabled{opacity:.35;cursor:default}
[data-vibeui-block="sortable-007"] [data-part="move"]:focus-visible{outline:2px solid var(--vibeui-sortable-007-accent);outline-offset:1px}
/* Полоса отмены появляется только когда есть что отменять. */
[data-vibeui-block="sortable-007"] [data-part="undobar"]{
display:flex;align-items:center;gap:0.5rem;
padding-top:0.5rem;border-top:1px solid var(--vibeui-sortable-007-border);
font-size:0.6875rem;line-height:1.35;color:var(--vibeui-sortable-007-muted);
}
[data-vibeui-block="sortable-007"] [data-part="last"]{flex:1 1 auto;min-width:0}
[data-vibeui-block="sortable-007"] [data-part="undo"]{
flex:none;appearance:none;cursor:pointer;
padding:0.1875rem 0.625rem;border-radius:0.5rem;
border:1px solid color-mix(in oklab,var(--vibeui-sortable-007-accent) 45%,transparent);
background:color-mix(in oklab,var(--vibeui-sortable-007-accent) 10%,transparent);
color:color-mix(in oklab,var(--vibeui-sortable-007-accent) 80%,black);
font:inherit;font-size:0.6875rem;font-weight:650;line-height:1.5;
}
[data-vibeui-block="sortable-007"] [data-part="undo"]:focus-visible{outline:2px solid var(--vibeui-sortable-007-accent);outline-offset:2px}
[data-vibeui-block="sortable-007"] [data-part="live"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sortable-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS = [
  "Приветственное письмо",
  "Напоминание о корзине",
  "Отзыв о заказе",
  "Скидка на повтор",
  "Возврат неактивных",
]

type Step = { items: string[]; label: string }

/**
 * Список с отменой последнего переноса: прежний порядок лежит в стеке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sortable007({
  title = "Цепочка писем",
  items = DEFAULT_ITEMS,
  undoLabel = "Отменить",
  onChange,
  accent,
  className,
  style,
  ...props
}: Sortable007Props) {
  const [order, setOrder] = useState(items)
  const [history, setHistory] = useState<Step[]>([])
  const [restored, setRestored] = useState<string | null>(null)
  const [dragged, setDragged] = useState<string | null>(null)
  const [over, setOver] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState("")

  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return

    const next = [...order]
    const [row] = next.splice(from, 1)
    next.splice(to, 0, row)

    setHistory([
      ...history,
      { items: order, label: `«${row}»: ${from + 1} → ${to + 1}` },
    ])
    setRestored(null)
    setOrder(next)
    onChange?.(next)
    setAnnouncement(`«${row}» на позиции ${to + 1} из ${next.length}.`)
  }

  const undo = () => {
    const step = history[history.length - 1]
    if (!step) return

    setHistory(history.slice(0, -1))
    setOrder(step.items)
    onChange?.(step.items)

    const back = step.label.split("»")[0].replace("«", "")
    setRestored(back)
    setAnnouncement(
      `Отменено: ${step.label}. «${back}» снова на позиции ${step.items.indexOf(back) + 1} из ${step.items.length}.`,
    )
  }

  const drop = (event: DragEvent<HTMLLIElement>, target: string) => {
    event.preventDefault()
    setOver(null)
    if (!dragged || dragged === target) return
    move(order.indexOf(dragged), order.indexOf(target))
    setDragged(null)
  }

  const last = history[history.length - 1]

  const palette = {
    ...(accent ? { "--vibeui-sortable-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sortable-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="sortable-007"
        className={className}
        style={palette}
      >
        <h3>{title}</h3>
        <ol>
          {order.map((row, index) => (
            <li
              key={row}
              draggable
              data-dragging={row === dragged}
              data-over={row === over}
              data-restored={row === restored}
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
              <span data-part="grip" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span data-part="index">{index + 1}</span>
              <span data-part="text">{row}</span>
              <button
                type="button"
                data-part="move"
                disabled={index === 0}
                aria-label={`Поднять «${row}», сейчас ${index + 1} из ${order.length}`}
                onClick={() => move(index, index - 1)}
              >
                ▲
              </button>
              <button
                type="button"
                data-part="move"
                disabled={index === order.length - 1}
                aria-label={`Опустить «${row}», сейчас ${index + 1} из ${order.length}`}
                onClick={() => move(index, index + 1)}
              >
                ▼
              </button>
            </li>
          ))}
        </ol>
        {last ? (
          <div data-part="undobar">
            <span data-part="last">Последний перенос: {last.label}</span>
            <button
              type="button"
              data-part="undo"
              aria-label={`${undoLabel} последний перенос: ${last.label}`}
              onClick={undo}
            >
              {undoLabel}
            </button>
          </div>
        ) : null}
        <span data-part="live" role="status" aria-live="polite">
          {announcement}
        </span>
      </div>
    </>
  )
}
