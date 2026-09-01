"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties, DragEvent } from "react"

export type Sortable006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  title?: string
  pinned?: string
  items?: string[]
  onChange?: (items: string[]) => void
  accent?: string
}

// Идея компонента: список с закреплённой первой позицией. Закрепление здесь не
// подпись, а правило: у закреплённой строки нет ручки и нет кнопок переноса, а
// подвижная строка не может встать выше неё — попытка не игнорируется молча, а
// проговаривается в живой области. Закреплённая строка отделена от остальных
// линией и помечена словом, а не только замком: значок без текста скринридер
// не читает. Кнопки «выше» и «ниже» дают перенос с клавиатуры, где drag
// недоступен в принципе.
const STYLES = `
:where([data-vibeui-block="sortable-006"]){
--vibeui-sortable-006-bg:oklch(1 0 0);
--vibeui-sortable-006-row:oklch(0.99 0.002 265);
--vibeui-sortable-006-fg:oklch(0.24 0.014 265);
--vibeui-sortable-006-muted:oklch(0.56 0.014 265);
--vibeui-sortable-006-border:oklch(0.9 0.006 265);
--vibeui-sortable-006-accent:oklch(0.55 0.2 262);
--vibeui-sortable-006-pin:oklch(0.62 0.13 78);
--vibeui-sortable-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="sortable-006"]{
position:relative;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-sortable-006-bg);
border:1px solid var(--vibeui-sortable-006-border);border-radius:0.875rem;
font-family:var(--vibeui-sortable-006-font);color:var(--vibeui-sortable-006-fg);
}
[data-vibeui-block="sortable-006"] *{box-sizing:border-box}
[data-vibeui-block="sortable-006"] h3{margin:0 0 0.5rem;font-size:0.875rem;font-weight:650}
[data-vibeui-block="sortable-006"] ol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.375rem}
[data-vibeui-block="sortable-006"] li{
display:flex;align-items:center;gap:0.5rem;
padding:0.4375rem 0.5rem;border-radius:0.625rem;
border:1px solid var(--vibeui-sortable-006-border);
background:var(--vibeui-sortable-006-row);font-size:0.8125rem;
}
/* Закреплённая строка отделена линией и цветом — и не имеет органов переноса. */
[data-vibeui-block="sortable-006"] li[data-pinned="true"]{
margin-bottom:0.25rem;
border-color:color-mix(in oklab,var(--vibeui-sortable-006-pin) 45%,transparent);
background:color-mix(in oklab,var(--vibeui-sortable-006-pin) 9%,var(--vibeui-sortable-006-bg));
box-shadow:0 1px 0 var(--vibeui-sortable-006-border);
}
[data-vibeui-block="sortable-006"] li[data-dragging="true"]{opacity:.45}
[data-vibeui-block="sortable-006"] li[data-over="true"]{box-shadow:inset 0 2px 0 var(--vibeui-sortable-006-accent)}
[data-vibeui-block="sortable-006"] [data-part="grip"]{
flex:none;display:grid;gap:2.5px;padding:0.25rem;cursor:grab;
}
[data-vibeui-block="sortable-006"] [data-part="grip"] span{
display:block;width:0.75rem;height:2px;border-radius:1px;
background:var(--vibeui-sortable-006-muted);opacity:.6;
}
[data-vibeui-block="sortable-006"] [data-part="lock"]{
flex:none;display:grid;place-items:center;width:1.25rem;height:1.25rem;
color:var(--vibeui-sortable-006-pin);font-size:0.75rem;line-height:1;
}
[data-vibeui-block="sortable-006"] [data-part="index"]{
flex:none;width:1.125rem;text-align:right;
font-size:0.75rem;color:var(--vibeui-sortable-006-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="sortable-006"] [data-part="text"]{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="sortable-006"] [data-part="badge"]{
flex:none;padding:0 0.375rem;border-radius:999px;
background:color-mix(in oklab,var(--vibeui-sortable-006-pin) 18%,transparent);
color:color-mix(in oklab,var(--vibeui-sortable-006-pin) 80%,black);
font-size:0.5625rem;font-weight:700;line-height:1.6;text-transform:uppercase;letter-spacing:0.04em;
}
[data-vibeui-block="sortable-006"] [data-part="move"]{
flex:none;appearance:none;border:0;background:none;cursor:pointer;
width:1.5rem;height:1.5rem;border-radius:0.375rem;
color:var(--vibeui-sortable-006-muted);font:inherit;font-size:0.6875rem;line-height:1;
}
[data-vibeui-block="sortable-006"] [data-part="move"]:hover:not(:disabled){color:var(--vibeui-sortable-006-fg)}
[data-vibeui-block="sortable-006"] [data-part="move"]:disabled{opacity:.35;cursor:default}
[data-vibeui-block="sortable-006"] [data-part="move"]:focus-visible{outline:2px solid var(--vibeui-sortable-006-accent);outline-offset:1px}
[data-vibeui-block="sortable-006"] [data-part="live"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sortable-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS = [
  "Заявки за сегодня",
  "Выручка за неделю",
  "Отказы по оплате",
  "Остатки на складе",
]

/**
 * Список с закреплённой первой позицией: подвижные строки не встают выше неё.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sortable006({
  title = "Виджеты дашборда",
  pinned = "Сводка за сегодня",
  items = DEFAULT_ITEMS,
  onChange,
  accent,
  className,
  style,
  ...props
}: Sortable006Props) {
  const [order, setOrder] = useState(items)
  const [dragged, setDragged] = useState<string | null>(null)
  const [over, setOver] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState("")

  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length) {
      setAnnouncement(
        to < 0
          ? `Выше нельзя: первая позиция закреплена за «${pinned}».`
          : `«${order[from]}» уже последняя в списке.`,
      )
      return
    }

    const next = [...order]
    const [row] = next.splice(from, 1)
    next.splice(to, 0, row)
    setOrder(next)
    onChange?.(next)
    setAnnouncement(
      `«${row}» на позиции ${to + 2} из ${next.length + 1}, ниже закреплённой «${pinned}».`,
    )
  }

  const drop = (event: DragEvent<HTMLLIElement>, target: string) => {
    event.preventDefault()
    setOver(null)
    if (!dragged || dragged === target) return
    move(order.indexOf(dragged), order.indexOf(target))
    setDragged(null)
  }

  const palette = {
    ...(accent ? { "--vibeui-sortable-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sortable-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="sortable-006"
        className={className}
        style={palette}
      >
        <h3>{title}</h3>
        <ol>
          <li data-pinned="true">
            <span data-part="lock" aria-hidden="true">
              ●
            </span>
            <span data-part="index">1</span>
            <span data-part="text">{pinned}</span>
            <span data-part="badge">закреплено</span>
          </li>
          {order.map((row, index) => (
            <li
              key={row}
              draggable
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
              <span data-part="grip" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span data-part="index">{index + 2}</span>
              <span data-part="text">{row}</span>
              <button
                type="button"
                data-part="move"
                disabled={index === 0}
                aria-label={`Поднять «${row}», сейчас ${index + 2} из ${order.length + 1}`}
                onClick={() => move(index, index - 1)}
              >
                ▲
              </button>
              <button
                type="button"
                data-part="move"
                disabled={index === order.length - 1}
                aria-label={`Опустить «${row}», сейчас ${index + 2} из ${order.length + 1}`}
                onClick={() => move(index, index + 1)}
              >
                ▼
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
