"use client"

import { useLayoutEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, DragEvent } from "react"

export type Sortable001Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  title?: string
  hint?: string
  items?: string[]
  onChange?: (items: string[]) => void
  /** Подпись кнопки «выше»: {item} — строка, {position} — номер, {total} — всего. */
  moveUpLabel?: string
  /** Подпись кнопки «ниже»: те же подстановки. */
  moveDownLabel?: string
  /** Индекс приподнятой строки: показать перенос на статичной картинке. */
  defaultDragged?: number
  /** Индекс строки, перед которой встанет вставка. */
  defaultOver?: number
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: список с ручной сортировкой. Перетаскивание сделано на
// нативном HTML5 drag and drop, поэтому библиотека не нужна. Но мышью владеют
// не все, а drag с клавиатуры не работает в принципе — поэтому у каждой строки
// есть кнопки «выше» и «ниже», и они не дублирующая роскошь, а единственный
// доступный путь. Порядок объявляется вслух: строка называет свой номер из N.
const STYLES = `
:where([data-vibeui-block="sortable-001"]){
--vibeui-sortable-001-bg:transparent;
--vibeui-sortable-001-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-sortable-001-muted:color-mix(in oklab,var(--vibeui-sortable-001-fg) 68%,transparent);
--vibeui-sortable-001-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-sortable-001-hover:light-dark(oklch(0.55 0 265 / 7%),oklch(0.85 0 265 / 12%));
--vibeui-sortable-001-shadow:light-dark(oklch(0.2 0 265 / 16%),oklch(0 0 0 / 46%));
--vibeui-sortable-001-accent:light-dark(oklch(0.287 0 0),oklch(0.901 0 0));
--vibeui-sortable-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sortable-001"]{color-scheme:dark}
[data-vibeui-block="sortable-001"]{
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-sortable-001-bg);
border:1px solid var(--vibeui-sortable-001-border);border-radius:0.875rem;
font-family:var(--vibeui-sortable-001-font);color:var(--vibeui-sortable-001-fg);
}
[data-vibeui-block="sortable-001"] *{box-sizing:border-box}
[data-vibeui-block="sortable-001"] h3{margin:0 0 0.125rem;font-size:0.875rem;font-weight:650}
[data-vibeui-block="sortable-001"] [data-part="hint"]{margin:0 0 0.625rem;font-size:0.75rem;color:var(--vibeui-sortable-001-muted)}
[data-vibeui-block="sortable-001"] ol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.375rem}
[data-vibeui-block="sortable-001"] li{
display:flex;align-items:center;gap:0.5rem;
padding:0.4375rem 0.5rem;border-radius:0.625rem;
border:1px solid var(--vibeui-sortable-001-border);
background:var(--vibeui-sortable-001-bg);font-size:0.8125rem;
}
/* Строка «в руке» приподнята тенью и сдвигом: одной полупрозрачности мало —
   на миниатюре она читается как выключенная строка, а не как переносимая. */
[data-vibeui-block="sortable-001"] li[data-dragging="true"]{
opacity:.45;border-style:dashed;border-color:var(--vibeui-sortable-001-accent);
}
/* Строки переезжают на новое место сами: список перестраивается прямо во
   время перетаскивания, а сдвиг каждой строки анимируется через WAAPI. */
[data-vibeui-block="sortable-001"] li[data-over="true"]{border-color:var(--vibeui-sortable-001-accent)}
[data-vibeui-block="sortable-001"] [data-part="grip"]{
flex:none;cursor:grab;display:flex;flex-direction:column;gap:2px;padding:0.25rem;
}
[data-vibeui-block="sortable-001"] [data-part="grip"] span{
display:block;width:0.75rem;height:2px;border-radius:1px;
background:var(--vibeui-sortable-001-muted);opacity:.6;
}
[data-vibeui-block="sortable-001"] [data-part="index"]{
flex:none;width:1.25rem;text-align:right;
font-size:0.75rem;color:var(--vibeui-sortable-001-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="sortable-001"] [data-part="text"]{flex:1 1 auto;min-width:0}
/* Кнопки — не дубль перетаскивания, а единственный путь с клавиатуры. */
[data-vibeui-block="sortable-001"] [data-part="move"]{
appearance:none;border:0;background:none;cursor:pointer;flex:none;
width:1.5rem;height:1.5rem;border-radius:0.375rem;
color:var(--vibeui-sortable-001-muted);font:inherit;font-size:0.6875rem;line-height:1;
}
[data-vibeui-block="sortable-001"] [data-part="move"]:hover:not(:disabled){background:var(--vibeui-sortable-001-hover);color:var(--vibeui-sortable-001-fg)}
[data-vibeui-block="sortable-001"] [data-part="move"]:disabled{opacity:.35;cursor:default}
[data-vibeui-block="sortable-001"] [data-part="move"]:focus-visible{outline:2px solid var(--vibeui-sortable-001-accent);outline-offset:1px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sortable-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS = [
  "Hero с одним действием",
  "Три преимущества",
  "Тарифы",
  "Отзывы",
  "Форма заявки",
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
 * Список с ручной сортировкой: нативный drag и кнопки для клавиатуры.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sortable001({
  title = "Порядок секций",
  hint = "Перетащите строку или используйте кнопки со стрелками",
  items = DEFAULT_ITEMS,
  onChange,
  moveUpLabel = "Поднять «{item}», сейчас {position} из {total}",
  moveDownLabel = "Опустить «{item}», сейчас {position} из {total}",
  defaultDragged,
  defaultOver,
  background = "",
  accent,
  className,
  style,
  ...props
}: Sortable001Props) {
  const [order, setOrder] = useState(items)
  const [dragged, setDragged] = useState<string | null>(
    items[defaultDragged ?? -1] ?? null,
  )
  const [over, setOver] = useState<string | null>(
    items[defaultOver ?? -1] ?? null,
  )
  const rows = useRef(new Map<string, HTMLLIElement>())
  const rects = useRef(new Map<string, DOMRect>())

  // FLIP: после каждого рендера сравниваем прежнее и новое положение строк и
  // проигрываем сдвиг с прежнего места. Так перестановка видна как движение,
  // а не как мгновенная подмена.
  useLayoutEffect(() => {
    const next = new Map<string, DOMRect>()
    rows.current.forEach((node, key) => next.set(key, node.getBoundingClientRect()))
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!calm) {
      rows.current.forEach((node, key) => {
        const before = rects.current.get(key)
        const after = next.get(key)
        if (!before || !after) return
        const dx = before.left - after.left
        const dy = before.top - after.top
        if (!dx && !dy) return
        node.animate(
          [{ transform: `translate(${dx}px,${dy}px)` }, { transform: "none" }],
          { duration: 220, easing: "cubic-bezier(.2,.8,.2,1)" },
        )
      })
    }
    rects.current = next
  })

  // Живая перестановка: строка встаёт на место той, над которой висит курсор,
  // ещё до отпускания — остальные раздвигаются, а не накладываются.
  const hover = (target: string) => {
    if (!dragged || dragged === target) return
    const from = order.indexOf(dragged)
    const to = order.indexOf(target)
    if (from < 0 || to < 0 || from === to) return
    const next = [...order]
    next.splice(from, 1)
    next.splice(to, 0, dragged)
    setOrder(next)
  }

  const apply = (next: string[]) => {
    setOrder(next)
    onChange?.(next)
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return
    const next = [...order]
    const [row] = next.splice(from, 1)
    next.splice(to, 0, row)
    setDragged(null)
    setOver(null)
    apply(next)
  }

  const drop = (event: DragEvent<HTMLLIElement>) => {
    event.preventDefault()
    setOver(null)
    setDragged(null)
    onChange?.(order)
  }

  const label = (template: string, row: string, index: number) =>
    template
      .replace("{item}", row)
      .replace("{position}", String(index + 1))
      .replace("{total}", String(order.length))

  const palette = {
    ...(accent ? { "--vibeui-sortable-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-sortable-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sortable-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="sortable"
        data-vibeui-block="sortable-001"
        className={className}
        style={palette}
      >
        <h3>{title}</h3>
        <p data-part="hint">{hint}</p>
        <ol>
          {order.map((row, index) => (
            <li
              key={row}
              ref={(node) => {
                if (node) rows.current.set(row, node)
                else rows.current.delete(row)
              }}
              draggable
              data-dragging={row === dragged}
              data-over={row === over}
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "move"
                setDragged(row)
              }}
              onDragEnd={() => {
                setDragged(null)
                setOver(null)
              }}
              onDragOver={(event) => {
                event.preventDefault()
                setOver(row)
                hover(row)
              }}
              onDrop={drop}
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
                aria-label={label(moveUpLabel, row, index)}
                onClick={() => move(index, index - 1)}
              >
                ▲
              </button>
              <button
                type="button"
                data-part="move"
                disabled={index === order.length - 1}
                aria-label={label(moveDownLabel, row, index)}
                onClick={() => move(index, index + 1)}
              >
                ▼
              </button>
            </li>
          ))}
        </ol>
      </div>
    </>
  )
}
