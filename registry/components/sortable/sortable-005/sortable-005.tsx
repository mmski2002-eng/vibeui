"use client"

import { useState } from "react"
import type {
  ComponentProps,
  CSSProperties,
  DragEvent,
  KeyboardEvent,
} from "react"

export type Sortable005Announcement = "moved" | "edge"

export type Sortable005Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  title?: string
  hint?: string
  tiles?: string[]
  columns?: number
  onChange?: (tiles: string[]) => void
  /** Место плитки: {row} — ряд, {column} — колонка. */
  spotLabel?: string
  /** Подпись плитки: {item}, {position}, {total}, {spot}. */
  tileLabel?: string
  /** Реплики живой области: {item}, {position}, {total}, {spot}. */
  announcements?: Record<Sortable005Announcement, string>
  /** Индекс приподнятой плитки: показать перенос на статичной картинке. */
  defaultDragged?: number
  /** Индекс плитки, на место которой встанет перенесённая. */
  defaultOver?: number
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
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
--vibeui-sortable-005-bg:transparent;
--vibeui-sortable-005-tile:light-dark(oklch(0.985 0 265),oklch(0.28 0 265));
--vibeui-sortable-005-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-sortable-005-muted:color-mix(in oklab,var(--vibeui-sortable-005-fg) 68%,transparent);
--vibeui-sortable-005-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-sortable-005-shadow:light-dark(oklch(0.2 0 265 / 14%),oklch(0 0 0 / 44%));
--vibeui-sortable-005-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.73 0.16 39.8));
--vibeui-sortable-005-columns:3;
--vibeui-sortable-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sortable-005"]{color-scheme:dark}
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
box-shadow:0 6px 14px var(--vibeui-sortable-005-shadow);
}
/* Плитка «в руке» приподнята тенью: одной полупрозрачности мало — на
   миниатюре она читается как выключенная, а не как переносимая. */
[data-vibeui-block="sortable-005"] [data-part="tile"][data-dragging="true"]{
opacity:.6;border-color:var(--vibeui-sortable-005-accent);
box-shadow:0 8px 18px var(--vibeui-sortable-005-shadow);
transform:translateY(-2px);
}
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

const DEFAULT_ANNOUNCEMENTS: Record<Sortable005Announcement, string> = {
  moved: "«{item}» на позиции {position} из {total}: {spot}.",
  edge: "«{item}» уже с краю сетки: {spot}.",
}

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
  hint = "Мышью — перетаскиванием. С клавиатуры: стрелки влево и вправо двигают на позицию, вверх и вниз — на ряд.",
  tiles = DEFAULT_TILES,
  columns = 3,
  onChange,
  spotLabel = "ряд {row}, колонка {column}",
  tileLabel = "{item}, позиция {position} из {total}, {spot}. Стрелки переставляют плитку.",
  announcements = DEFAULT_ANNOUNCEMENTS,
  defaultDragged,
  defaultOver,
  background = "",
  accent,
  className,
  style,
  ...props
}: Sortable005Props) {
  const [order, setOrder] = useState(tiles)
  const [dragged, setDragged] = useState<string | null>(
    tiles[defaultDragged ?? -1] ?? null,
  )
  const [over, setOver] = useState<string | null>(
    tiles[defaultOver ?? -1] ?? null,
  )
  const [announcement, setAnnouncement] = useState("")

  const spot = (index: number) =>
    spotLabel
      .replace("{row}", String(Math.floor(index / columns) + 1))
      .replace("{column}", String((index % columns) + 1))

  const say = (
    key: Sortable005Announcement,
    tile: string,
    position: number,
    total: number,
    index: number,
  ) =>
    (announcements[key] ?? DEFAULT_ANNOUNCEMENTS[key])
      .replace("{item}", tile)
      .replace("{position}", String(position))
      .replace("{total}", String(total))
      .replace("{spot}", spot(index))

  const move = (from: number, to: number) => {
    const next = [...order]
    const [tile] = next.splice(from, 1)
    next.splice(to, 0, tile)
    setDragged(null)
    setOver(null)
    setOrder(next)
    onChange?.(next)
    setAnnouncement(say("moved", tile, to + 1, next.length, to))
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
      setAnnouncement(say("edge", tile, from + 1, order.length, from))
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
    ...(background
      ? {
          "--vibeui-sortable-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sortable-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="sortable"
        data-vibeui-block="sortable-005"
        className={className}
        style={palette}
      >
        <h3>{title}</h3>
        <p data-part="hint">{hint}</p>
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
                aria-label={tileLabel
                  .replace("{item}", tile)
                  .replace("{position}", String(index + 1))
                  .replace("{total}", String(order.length))
                  .replace("{spot}", spot(index))}
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
