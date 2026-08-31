"use client"

import { useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  DragEvent,
  KeyboardEvent,
} from "react"

export type Sortable005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  title?: string
  tiles?: string[]
  columns?: number
  onChange?: (tiles: string[]) => void
  accent?: string
}

// Идея компонента: переупорядочивание в сетке, а не в столбце. Отличие от
// списка принципиальное: у плитки четыре соседа, поэтому стрелки влево и вправо
// двигают на одну позицию, а вверх и вниз — сразу на ширину ряда. Число колонок
// одно и то же для раскладки и для шага переноса — оно приходит пропом и
// подставляется в grid-template-columns переменной, иначе клавиатура начнёт
// считать ряды не так, как их видно. Плитка — кнопка, поэтому фокус и стрелки
// работают без tabindex-фокусов, а позиция называется рядом и колонкой:
// «шестая из восьми» в сетке не говорит ничего.
const STYLES = `
:where([data-vibeui-block="sortable-005"]){
--vibeui-sortable-005-bg:oklch(1 0 0);
--vibeui-sortable-005-tile:oklch(0.985 0.002 265);
--vibeui-sortable-005-fg:oklch(0.24 0.014 265);
--vibeui-sortable-005-muted:oklch(0.56 0.014 265);
--vibeui-sortable-005-border:oklch(0.9 0.006 265);
--vibeui-sortable-005-accent:oklch(0.55 0.2 262);
--vibeui-sortable-005-columns:3;
--vibeui-sortable-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="sortable-005"]{
position:relative;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-sortable-005-bg);
border:1px solid var(--vibeui-sortable-005-border);border-radius:0.875rem;
font-family:var(--vibeui-sortable-005-font);color:var(--vibeui-sortable-005-fg);
}
[data-vibeui-block="sortable-005"] *{box-sizing:border-box}
[data-vibeui-block="sortable-005"] h3{margin:0 0 0.125rem;font-size:0.875rem;font-weight:650}
[data-vibeui-block="sortable-005"] [data-part="hint"]{margin:0 0 0.625rem;font-size:0.6875rem;line-height:1.4;color:var(--vibeui-sortable-005-muted)}
[data-vibeui-block="sortable-005"] ol{
list-style:none;margin:0;padding:0;display:grid;gap:0.4375rem;
grid-template-columns:repeat(var(--vibeui-sortable-005-columns),minmax(0,1fr));
}
[data-vibeui-block="sortable-005"] [data-part="tile"]{
appearance:none;cursor:grab;width:100%;
display:grid;gap:0.1875rem;align-content:center;
aspect-ratio:1 / 1;padding:0.375rem;border-radius:0.625rem;
background:var(--vibeui-sortable-005-tile);
border:1px solid var(--vibeui-sortable-005-border);
color:inherit;font:inherit;font-size:0.6875rem;line-height:1.25;text-align:center;
transition:box-shadow .15s ease,border-color .15s ease,transform .15s ease;
}
[data-vibeui-block="sortable-005"] [data-part="tile"]:focus-visible{
outline:2px solid var(--vibeui-sortable-005-accent);outline-offset:2px;
border-color:var(--vibeui-sortable-005-accent);
box-shadow:0 6px 14px oklch(0.2 0.02 265 / 14%);
}
[data-vibeui-block="sortable-005"] [data-part="tile"][data-dragging="true"]{opacity:.45}
[data-vibeui-block="sortable-005"] [data-part="tile"][data-over="true"]{box-shadow:inset 0 0 0 2px var(--vibeui-sortable-005-accent)}
[data-vibeui-block="sortable-005"] [data-part="order"]{
color:var(--vibeui-sortable-005-muted);font-size:0.5625rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="sortable-005"] [data-part="live"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sortable-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TILES = [
  "Обложка",
  "Галерея",
  "Отзывы",
  "Тарифы",
  "Вопросы",
  "Контакты",
  "Команда",
  "Карта",
]

/**
 * Сетка плиток с переупорядочиванием: стрелки двигают на позицию и на ряд.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sortable005({
  title = "Плитки на главной",
  tiles = DEFAULT_TILES,
  columns = 3,
  onChange,
  accent,
  className,
  style,
  ...props
}: Sortable005Props) {
  const [order, setOrder] = useState(tiles)
  const [dragged, setDragged] = useState<string | null>(null)
  const [over, setOver] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState("")

  const spot = (index: number) =>
    `ряд ${Math.floor(index / columns) + 1}, колонка ${(index % columns) + 1}`

  const move = (from: number, to: number) => {
    const next = [...order]
    const [tile] = next.splice(from, 1)
    next.splice(to, 0, tile)
    setOrder(next)
    onChange?.(next)
    setAnnouncement(
      `«${tile}» на позиции ${to + 1} из ${next.length}: ${spot(to)}.`,
    )
  }

  const handleKey = (event: KeyboardEvent<HTMLButtonElement>, tile: string) => {
    const steps: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -columns,
      ArrowDown: columns,
    }

    const step = steps[event.key]
    if (step === undefined) return
    event.preventDefault()

    const from = order.indexOf(tile)
    const to = from + step

    if (to < 0 || to >= order.length) {
      setAnnouncement(`«${tile}» уже с краю сетки: ${spot(from)}.`)
      return
    }

    move(from, to)
  }

  const drop = (event: DragEvent<HTMLLIElement>, tile: string) => {
    event.preventDefault()
    setOver(null)
    if (!dragged || dragged === tile) return
    move(order.indexOf(dragged), order.indexOf(tile))
    setDragged(null)
  }

  const palette = {
    "--vibeui-sortable-005-columns": String(columns),
    ...(accent ? { "--vibeui-sortable-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sortable-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="sortable-005"
        className={className}
        style={palette}
      >
        <h3>{title}</h3>
        <p data-part="hint">
          Мышью — перетаскиванием. С клавиатуры: стрелки влево и вправо двигают
          на позицию, вверх и вниз — на ряд.
        </p>
        <ol>
          {order.map((tile, index) => (
            <li
              key={tile}
              draggable
              onDragStart={() => setDragged(tile)}
              onDragEnd={() => {
                setDragged(null)
                setOver(null)
              }}
              onDragOver={(event) => {
                event.preventDefault()
                setOver(tile)
              }}
              onDrop={(event) => drop(event, tile)}
            >
              <button
                type="button"
                data-part="tile"
                data-dragging={tile === dragged}
                data-over={tile === over}
                aria-label={`${tile}, позиция ${index + 1} из ${order.length}, ${spot(index)}. Стрелки переставляют плитку.`}
                onKeyDown={(event) => handleKey(event, tile)}
              >
                {tile}
                <span data-part="order" aria-hidden="true">
                  {index + 1}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <span data-part="live" role="status" aria-live="polite">
          {announcement}
        </span>
      </div>
    </>
  )
}
