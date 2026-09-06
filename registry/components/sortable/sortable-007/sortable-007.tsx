"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties, DragEvent } from "react"

export type Sortable007Announcement = "moved" | "undone"

export type Sortable007Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  title?: string
  items?: string[]
  undoLabel?: string
  onChange?: (items: string[]) => void
  /** Описание шага: {item} — строка, {from} и {to} — позиции. */
  stepLabel?: string
  /** Строка полосы отмены: {step} — описание шага. */
  lastLabel?: string
  /** Подпись кнопки отмены: {undo} — её текст, {step} — описание шага. */
  undoHint?: string
  /** Подписи кнопок переноса: {item}, {position}, {total}. */
  moveUpLabel?: string
  moveDownLabel?: string
  /** Реплики живой области: {item}, {position}, {total}, {step}. */
  announcements?: Record<Sortable007Announcement, string>
  /** Готовый перенос в истории: полоса отмены видна на статичной картинке. */
  defaultMove?: { from: number; to: number }
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
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
--vibeui-sortable-007-bg:transparent;
--vibeui-sortable-007-row:light-dark(oklch(0.99 0 265),oklch(0.27 0 265));
--vibeui-sortable-007-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-sortable-007-muted:color-mix(in oklab,var(--vibeui-sortable-007-fg) 68%,transparent);
--vibeui-sortable-007-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-sortable-007-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.73 0.16 39.8));
--vibeui-sortable-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sortable-007"]{color-scheme:dark}
[data-vibeui-block="sortable-007"]{
position:relative;display:grid;grid-template-columns:minmax(0,1fr);gap:0.625rem;
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
background:color-mix(in oklab,var(--vibeui-sortable-007-accent) 8%,var(--vibeui-sortable-007-row));
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
color:color-mix(in oklab,var(--vibeui-sortable-007-accent) 80%,light-dark(black,white));
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

type Step = { items: string[]; label: string; item: string }

/**
 * Начальный порядок вместе с историей. Полоса отмены появляется только после
 * переноса, поэтому без готового шага её не видно ни на витрине, ни на
 * скриншоте в документации.
 */
function seedMove(
  items: string[],
  move: { from: number; to: number } | undefined,
  stepLabel: string,
): { order: string[]; history: Step[] } {
  if (
    !move ||
    move.from < 0 ||
    move.to < 0 ||
    move.from >= items.length ||
    move.to >= items.length ||
    move.from === move.to
  ) {
    return { order: items, history: [] }
  }

  const order = [...items]
  const [row] = order.splice(move.from, 1)
  order.splice(move.to, 0, row)

  return {
    order,
    history: [
      {
        items,
        item: row,
        label: stepLabel
          .replace("{item}", row)
          .replace("{from}", String(move.from + 1))
          .replace("{to}", String(move.to + 1)),
      },
    ],
  }
}

const DEFAULT_ANNOUNCEMENTS: Record<Sortable007Announcement, string> = {
  moved: "«{item}» на позиции {position} из {total}.",
  undone: "Отменено: {step}. «{item}» снова на позиции {position} из {total}.",
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

/**
 * Список с отменой последнего переноса: прежний порядок лежит в стеке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sortable007({
  title = "Цепочка писем",
  items = DEFAULT_ITEMS,
  undoLabel = "Отменить",
  stepLabel = "«{item}»: {from} → {to}",
  lastLabel = "Последний перенос: {step}",
  undoHint = "{undo} последний перенос: {step}",
  moveUpLabel = "Поднять «{item}», сейчас {position} из {total}",
  moveDownLabel = "Опустить «{item}», сейчас {position} из {total}",
  announcements = DEFAULT_ANNOUNCEMENTS,
  defaultMove,
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Sortable007Props) {
  const seed = seedMove(items, defaultMove, stepLabel)
  const [order, setOrder] = useState(seed.order)
  const [history, setHistory] = useState<Step[]>(seed.history)
  const [restored, setRestored] = useState<string | null>(null)
  const [dragged, setDragged] = useState<string | null>(null)
  const [over, setOver] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState("")

  const say = (
    key: Sortable007Announcement,
    row: string,
    position: number,
    total: number,
    step: string,
  ) =>
    (announcements[key] ?? DEFAULT_ANNOUNCEMENTS[key])
      .replace("{item}", row)
      .replace("{position}", String(position))
      .replace("{total}", String(total))
      .replace("{step}", step)

  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return

    const next = [...order]
    const [row] = next.splice(from, 1)
    next.splice(to, 0, row)

    setHistory([
      ...history,
      {
        items: order,
        item: row,
        label: stepLabel
          .replace("{item}", row)
          .replace("{from}", String(from + 1))
          .replace("{to}", String(to + 1)),
      },
    ])
    setRestored(null)
    setOrder(next)
    onChange?.(next)
    setAnnouncement(say("moved", row, to + 1, next.length, ""))
  }

  const undo = () => {
    const step = history[history.length - 1]
    if (!step) return

    setHistory(history.slice(0, -1))
    setOrder(step.items)
    onChange?.(step.items)

    setRestored(step.item)
    setAnnouncement(
      say(
        "undone",
        step.item,
        step.items.indexOf(step.item) + 1,
        step.items.length,
        step.label,
      ),
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
    ...(background
      ? {
          "--vibeui-sortable-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sortable-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="sortable"
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
                aria-label={moveUpLabel
                  .replace("{item}", row)
                  .replace("{position}", String(index + 1))
                  .replace("{total}", String(order.length))}
                onClick={() => move(index, index - 1)}
              >
                ▲
              </button>
              <button
                type="button"
                data-part="move"
                disabled={index === order.length - 1}
                aria-label={moveDownLabel
                  .replace("{item}", row)
                  .replace("{position}", String(index + 1))
                  .replace("{total}", String(order.length))}
                onClick={() => move(index, index + 1)}
              >
                ▼
              </button>
            </li>
          ))}
        </ol>
        {last ? (
          <div data-part="undobar">
            <span data-part="last">
              {lastLabel.replace("{step}", last.label)}
            </span>
            <button
              type="button"
              data-part="undo"
              aria-label={undoHint
                .replace("{undo}", undoLabel)
                .replace("{step}", last.label)}
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
