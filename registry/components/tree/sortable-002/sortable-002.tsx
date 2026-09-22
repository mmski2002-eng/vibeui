"use client"

import { useLayoutEffect, useRef, useState } from "react"
import type {
  ComponentProps,
  CSSProperties,
  DragEvent,
  KeyboardEvent,
} from "react"

export type Sortable002Announcement =
  "picked" | "dropped" | "moved" | "edge" | "cancelled" | "dragged"

export type Sortable002Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  title?: string
  hint?: string
  items?: string[]
  onChange?: (items: string[]) => void
  /** Подпись ручки: {item} — строка, {position} — номер, {total} — всего. */
  gripLabel?: string
  /** Реплики живой области: те же подстановки, ключи из Sortable002Announcement. */
  announcements?: Record<Sortable002Announcement, string>
  /** Индекс строки «в руке»: показать захват на статичной картинке. */
  defaultHeld?: number
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
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
--vibeui-sortable-002-bg:transparent;
--vibeui-sortable-002-row:light-dark(oklch(0.99 0 265),oklch(0.27 0 265));
--vibeui-sortable-002-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-sortable-002-muted:color-mix(in oklab,var(--vibeui-sortable-002-fg) 68%,transparent);
--vibeui-sortable-002-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-sortable-002-shadow:light-dark(oklch(0.2 0 265 / 16%),oklch(0 0 0 / 46%));
--vibeui-sortable-002-accent:light-dark(oklch(0.287 0 0),oklch(0.901 0 0));
--vibeui-sortable-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sortable-002"]{color-scheme:dark}
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
box-shadow:0 8px 18px var(--vibeui-sortable-002-shadow);
transform:translateY(-1px);
}
[data-vibeui-block="sortable-002"] li[data-dragging="true"]{opacity:.45;border-style:dashed}
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

const DEFAULT_ANNOUNCEMENTS: Record<Sortable002Announcement, string> = {
  picked:
    "«{item}» взята, позиция {position} из {total}. Стрелки вверх и вниз несут строку.",
  dropped: "«{item}» положена на позицию {position} из {total}.",
  moved: "«{item}» на позиции {position} из {total}.",
  edge: "Край списка, «{item}» на позиции {position} из {total}.",
  cancelled: "Перенос отменён, «{item}» вернулась на позицию {position}.",
  dragged: "«{item}» перенесена на позицию {position} из {total}.",
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
  hint = "Мышью — за ручку. С клавиатуры: пробел берёт строку, стрелки несут, пробел кладёт, Escape отменяет.",
  items = DEFAULT_ITEMS,
  onChange,
  gripLabel = "Перенести «{item}», позиция {position} из {total}",
  announcements = DEFAULT_ANNOUNCEMENTS,
  defaultHeld,
  background = "",
  accent,
  className,
  style,
  ...props
}: Sortable002Props) {
  const [order, setOrder] = useState(items)
  const [held, setHeld] = useState<string | null>(
    items[defaultHeld ?? -1] ?? null,
  )
  const [snapshot, setSnapshot] = useState(items)
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

  const apply = (next: string[]) => {
    setOrder(next)
    onChange?.(next)
  }

  const say = (
    key: Sortable002Announcement,
    row: string,
    position: number,
    total: number,
  ) =>
    (announcements[key] ?? DEFAULT_ANNOUNCEMENTS[key])
      .replace("{item}", row)
      .replace("{position}", String(position))
      .replace("{total}", String(total))

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
        setAnnouncement(say("dropped", row, index + 1, order.length))
      } else {
        setHeld(row)
        setSnapshot(order)
        setAnnouncement(say("picked", row, index + 1, order.length))
      }

      return
    }

    if (event.key === "Escape" && held === row) {
      event.preventDefault()
      apply(snapshot)
      setHeld(null)
      setAnnouncement(
        say("cancelled", row, snapshot.indexOf(row) + 1, snapshot.length),
      )
      return
    }

    if (held !== row) return

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault()
      const to = index + (event.key === "ArrowUp" ? -1 : 1)

      if (to < 0 || to >= order.length) {
        setAnnouncement(say("edge", row, index + 1, order.length))
        return
      }

      move(index, to)
      setAnnouncement(say("moved", row, to + 1, order.length))
    }
  }

  const drop = (event: DragEvent<HTMLLIElement>) => {
    event.preventDefault()
    setOver(null)
    if (dragged) {
      onChange?.(order)
      setAnnouncement(
        say("dragged", dragged, order.indexOf(dragged) + 1, order.length),
      )
    }
    setDragged(null)
  }

  const palette = {
    ...(accent ? { "--vibeui-sortable-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-sortable-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sortable-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="sortable"
        data-vibeui-block="sortable-002"
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
                hover(row, event)
              }}
              onDrop={drop}
            >
              <button
                type="button"
                data-part="grip"
                aria-pressed={row === held}
                aria-label={gripLabel
                  .replace("{item}", row)
                  .replace("{position}", String(index + 1))
                  .replace("{total}", String(order.length))}
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
