"use client"

import { useLayoutEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, DragEvent } from "react"

export type Sortable006Announcement = "moved" | "blocked" | "last"

export type Sortable006Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  title?: string
  pinned?: string
  /** Подпись метки закрепления. */
  pinnedBadge?: string
  items?: string[]
  onChange?: (items: string[]) => void
  /** Подпись кнопки «выше»: {item}, {position}, {total}. */
  moveUpLabel?: string
  /** Подпись кнопки «ниже»: те же подстановки. */
  moveDownLabel?: string
  /** Реплики живой области: {item}, {position}, {total}, {pinned}. */
  announcements?: Record<Sortable006Announcement, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  /** Цвет закрепления: метка, рамка и заливка первой строки. */
  pin?: string
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
--vibeui-sortable-006-bg:transparent;
--vibeui-sortable-006-row:light-dark(oklch(0.99 0 265),oklch(0.27 0 265));
--vibeui-sortable-006-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-sortable-006-muted:color-mix(in oklab,var(--vibeui-sortable-006-fg) 68%,transparent);
--vibeui-sortable-006-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-sortable-006-accent:light-dark(oklch(0.287 0 0),oklch(0.901 0 0));
--vibeui-sortable-006-pin:light-dark(oklch(0.305 0 0),oklch(0.906 0 0));
--vibeui-sortable-006-pin-ink:light-dark(oklch(0.27 0 0),oklch(0.925 0 0));
--vibeui-sortable-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sortable-006"]{color-scheme:dark}
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
background:color-mix(in oklab,var(--vibeui-sortable-006-pin) 9%,var(--vibeui-sortable-006-row));
box-shadow:0 1px 0 var(--vibeui-sortable-006-border);
}
[data-vibeui-block="sortable-006"] li[data-dragging="true"]{opacity:.45;border-style:dashed}
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
color:var(--vibeui-sortable-006-pin-ink);
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

const DEFAULT_ANNOUNCEMENTS: Record<Sortable006Announcement, string> = {
  moved:
    "«{item}» на позиции {position} из {total}, ниже закреплённой «{pinned}».",
  blocked: "Выше нельзя: первая позиция закреплена за «{pinned}».",
  last: "«{item}» уже последняя в списке.",
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
  pinnedBadge = "закреплено",
  items = DEFAULT_ITEMS,
  onChange,
  moveUpLabel = "Поднять «{item}», сейчас {position} из {total}",
  moveDownLabel = "Опустить «{item}», сейчас {position} из {total}",
  announcements = DEFAULT_ANNOUNCEMENTS,
  background = "",
  pin,
  accent,
  className,
  style,
  ...props
}: Sortable006Props) {
  const [order, setOrder] = useState(items)
  const [dragged, setDragged] = useState<string | null>(null)
  const [over, setOver] = useState<string | null>(null)
  const rows = useRef(new Map<string, HTMLLIElement>())
  const rects = useRef(new Map<string, { left: number; top: number }>())

  // FLIP: после каждого рендера сравниваем прежнее и новое положение элементов
  // и проигрываем сдвиг с прежнего места. Перестановка видна как движение,
  // а не как мгновенная подмена.
  useLayoutEffect(() => {
    const next = new Map<string, { left: number; top: number }>()
    // Положение считается относительно самого компонента, а не окна.
    // getBoundingClientRect меряет от края экрана: стоило странице
    // прокрутиться или карточке съехать в сетке между двумя рендерами, как
    // FLIP принимал это за переезд строк и проигрывал прыжок на всю
    // величину сдвига — по нажатию на что угодно внутри компонента.
    const first = rows.current.values().next().value
    const base = first?.closest("[data-vibeui-block]")?.getBoundingClientRect()
    rows.current.forEach((node, key) => {
      const box = node.getBoundingClientRect()
      next.set(key, {
        left: box.left - (base?.left ?? 0),
        top: box.top - (base?.top ?? 0),
      })
    })
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

  // Живая перестановка: элемент встаёт на место того, над которым висит
  // курсор, ещё до отпускания — остальные раздвигаются, а не накладываются.
  // Перестановка ждёт, пока курсор пройдёт середину цели. Иначе ровно на
  // границе двух строк список дрожал: перестановка подводила под курсор
  // соседнюю строку, та просила перестановку обратно, и так по кругу.
  const crossed = (event: DragEvent<HTMLElement>, forward: boolean) => {
    const box = event.currentTarget.getBoundingClientRect()
    const self = rows.current.get(dragged ?? "")?.getBoundingClientRect()
    // Ось берётся из взаимного положения, а не из раскладки: так одна и та же
    // проверка годится и списку строк, и ряду колонок, и сетке плиток.
    const vertical =
      !self || Math.abs(box.top - self.top) >= Math.abs(box.left - self.left)
    const middle = vertical ? box.top + box.height / 2 : box.left + box.width / 2

    return forward
      ? (vertical ? event.clientY : event.clientX) >= middle
      : (vertical ? event.clientY : event.clientX) <= middle
  }

  const hover = (target: string, event: DragEvent<HTMLElement>) => {
    if (!dragged || dragged === target) return
    const from = order.indexOf(dragged)
    const to = order.indexOf(target)
    if (from < 0 || to < 0 || from === to) return
    if (!crossed(event, to > from)) return
    const next = [...order]
    next.splice(from, 1)
    next.splice(to, 0, dragged)
    setOrder(next)
  }
  const [announcement, setAnnouncement] = useState("")

  const say = (
    key: Sortable006Announcement,
    row: string,
    position: number,
    total: number,
  ) =>
    (announcements[key] ?? DEFAULT_ANNOUNCEMENTS[key])
      .replace("{item}", row)
      .replace("{position}", String(position))
      .replace("{total}", String(total))
      .replace("{pinned}", pinned)

  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length) {
      setAnnouncement(
        say(
          to < 0 ? "blocked" : "last",
          order[from],
          from + 2,
          order.length + 1,
        ),
      )
      return
    }

    const next = [...order]
    const [row] = next.splice(from, 1)
    next.splice(to, 0, row)
    setOrder(next)
    onChange?.(next)
    setAnnouncement(say("moved", row, to + 2, next.length + 1))
  }

  const drop = (event: DragEvent<HTMLLIElement>) => {
    event.preventDefault()
    setOver(null)
    if (dragged) {
      onChange?.(order)
      setAnnouncement(say("moved", dragged, order.indexOf(dragged) + 2, order.length + 1))
    }
    setDragged(null)
  }

  const palette = {
    ...(accent ? { "--vibeui-sortable-006-accent": accent } : null),
    ...(pin ? { "--vibeui-sortable-006-pin": pin } : null),
    ...(background
      ? {
          "--vibeui-sortable-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sortable-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="sortable"
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
            <span data-part="badge">{pinnedBadge}</span>
          </li>
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
              onDragStart={() => setDragged(row)}
              onDragEnd={() => {
                setDragged(null)
                setOver(null)
              }}
              onDragOver={(event) => {
                event.preventDefault()
                setOver(row)
                hover(row, event)
              }}
              onDrop={drop}
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
                aria-label={moveUpLabel
                  .replace("{item}", row)
                  .replace("{position}", String(index + 2))
                  .replace("{total}", String(order.length + 1))}
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
                  .replace("{position}", String(index + 2))
                  .replace("{total}", String(order.length + 1))}
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
