"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties, DragEvent } from "react"

export type Sortable004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  sourceTitle?: string
  targetTitle?: string
  source?: string[]
  target?: string[]
  onChange?: (lists: { source: string[]; target: string[] }) => void
  /** Надпись в пустой панели. */
  emptyText?: string
  /** Подпись кнопки: {item} — строка, {from} и {to} — панели. */
  sendLabel?: string
  /**
   * Реплика живой области: {item}, {to}, {sourceTitle}, {sourceCount},
   * {targetTitle}, {targetCount}.
   */
  movedLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: перенос между двумя списками. Главная ошибка такого блока —
// когда список-приёмник пуст и превращается в невидимую полоску: тогда мышью
// некуда целиться, а с клавиатуры непонятно, куда переносят. Поэтому у пустого
// списка есть своя высота и объясняющая надпись, а обе колонки всегда одного
// роста. Перенос мышью — нативный drag на любую точку списка; с клавиатуры —
// кнопка со стрелкой у каждой строки, и она же называет обе стороны переноса.
// Результат и остатки объявляются в живой области.
const STYLES = `
:where([data-vibeui-block="sortable-004"]){
--vibeui-sortable-004-bg:transparent;
--vibeui-sortable-004-panel:light-dark(oklch(0.985 0.002 265),oklch(0.245 0.01 265));
--vibeui-sortable-004-row:light-dark(oklch(1 0 0),oklch(0.3 0.012 265));
--vibeui-sortable-004-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-sortable-004-muted:light-dark(oklch(0.56 0.014 265),oklch(0.68 0.012 265));
--vibeui-sortable-004-border:light-dark(oklch(0.9 0.006 265),oklch(0.37 0.012 265));
--vibeui-sortable-004-accent:light-dark(oklch(0.55 0.2 262),oklch(0.73 0.16 262));
--vibeui-sortable-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="sortable-004"]{
position:relative;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.625rem;
width:100%;max-width:30rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-sortable-004-bg);
border:1px solid var(--vibeui-sortable-004-border);border-radius:0.875rem;
font-family:var(--vibeui-sortable-004-font);color:var(--vibeui-sortable-004-fg);
}
[data-vibeui-block="sortable-004"] *{box-sizing:border-box}
/* Обе колонки одного роста: приёмник не должен схлопываться в полоску. */
[data-vibeui-block="sortable-004"] [data-part="panel"]{
display:flex;flex-direction:column;gap:0.5rem;min-width:0;min-height:9.5rem;
padding:0.5rem;border-radius:0.75rem;
background:var(--vibeui-sortable-004-panel);
border:1px dashed var(--vibeui-sortable-004-border);
}
[data-vibeui-block="sortable-004"] [data-part="panel"][data-over="true"]{
border-color:var(--vibeui-sortable-004-accent);border-style:solid;
background:color-mix(in oklab,var(--vibeui-sortable-004-accent) 6%,var(--vibeui-sortable-004-panel));
}
[data-vibeui-block="sortable-004"] [data-part="head"]{
margin:0;display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="sortable-004"] [data-part="count"]{
color:var(--vibeui-sortable-004-muted);font-size:0.6875rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="sortable-004"] ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.3125rem}
[data-vibeui-block="sortable-004"] li{
display:flex;align-items:center;gap:0.375rem;cursor:grab;
padding:0.3125rem 0.3125rem 0.3125rem 0.5rem;border-radius:0.5rem;
background:var(--vibeui-sortable-004-row);
border:1px solid var(--vibeui-sortable-004-border);
font-size:0.75rem;line-height:1.3;
}
[data-vibeui-block="sortable-004"] li[data-dragging="true"]{opacity:.45}
[data-vibeui-block="sortable-004"] [data-part="text"]{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
/* Кнопка переноса — единственный путь с клавиатуры, drag с неё недоступен. */
[data-vibeui-block="sortable-004"] [data-part="send"]{
flex:none;appearance:none;cursor:pointer;
width:1.375rem;height:1.375rem;border-radius:0.375rem;
border:1px solid var(--vibeui-sortable-004-border);
background:var(--vibeui-sortable-004-panel);color:var(--vibeui-sortable-004-muted);
font:inherit;font-size:0.6875rem;line-height:1;
}
[data-vibeui-block="sortable-004"] [data-part="send"]:hover{color:var(--vibeui-sortable-004-accent)}
[data-vibeui-block="sortable-004"] [data-part="send"]:focus-visible{outline:2px solid var(--vibeui-sortable-004-accent);outline-offset:1px}
[data-vibeui-block="sortable-004"] [data-part="empty"]{
margin:auto 0;padding:0.5rem;text-align:center;
color:var(--vibeui-sortable-004-muted);font-size:0.6875rem;line-height:1.35;
}
[data-vibeui-block="sortable-004"] [data-part="live"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sortable-004"] *{animation:none!important;transition:none!important}}
`

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

const DEFAULT_SOURCE = [
  "Артикул",
  "Поставщик",
  "Себестоимость",
  "Дата поставки",
]

const DEFAULT_TARGET = ["Название", "Остаток"]

/**
 * Перенос между двумя списками: мышью — drag, с клавиатуры — кнопка со стрелкой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sortable004({
  sourceTitle = "Доступные поля",
  targetTitle = "В отчёте",
  source = DEFAULT_SOURCE,
  target = DEFAULT_TARGET,
  onChange,
  emptyText = "Пусто. Перетащите поле сюда или нажмите стрелку в соседнем списке.",
  sendLabel = "Перенести «{item}» из «{from}» в «{to}»",
  movedLabel = "«{item}» перенесено в «{to}». {sourceTitle}: {sourceCount}, {targetTitle}: {targetCount}.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Sortable004Props) {
  const [left, setLeft] = useState(source)
  const [right, setRight] = useState(target)
  const [dragged, setDragged] = useState<string | null>(null)
  const [over, setOver] = useState<"left" | "right" | null>(null)
  const [announcement, setAnnouncement] = useState("")

  const send = (row: string, to: "left" | "right") => {
    const nextLeft =
      to === "left"
        ? left.includes(row)
          ? left
          : [...left, row]
        : left.filter((entry) => entry !== row)
    const nextRight =
      to === "right"
        ? right.includes(row)
          ? right
          : [...right, row]
        : right.filter((entry) => entry !== row)

    if (nextLeft.length === left.length && nextRight.length === right.length) {
      return
    }

    setLeft(nextLeft)
    setRight(nextRight)
    onChange?.({ source: nextLeft, target: nextRight })
    setAnnouncement(
      movedLabel
        .replace("{item}", row)
        .replace("{to}", to === "left" ? sourceTitle : targetTitle)
        .replace("{sourceTitle}", sourceTitle)
        .replace("{sourceCount}", String(nextLeft.length))
        .replace("{targetTitle}", targetTitle)
        .replace("{targetCount}", String(nextRight.length)),
    )
  }

  const drop = (event: DragEvent<HTMLElement>, to: "left" | "right") => {
    event.preventDefault()
    setOver(null)
    if (dragged) send(dragged, to)
    setDragged(null)
  }

  const palette = {
    ...(accent ? { "--vibeui-sortable-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-sortable-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const panels = [
    { side: "left" as const, title: sourceTitle, rows: left, arrow: "→" },
    { side: "right" as const, title: targetTitle, rows: right, arrow: "←" },
  ]

  return (
    <>
      <style href="vibeui-sortable-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="sortable-004"
        className={className}
        style={palette}
      >
        {panels.map((panel) => (
          <section
            key={panel.side}
            data-part="panel"
            data-over={panel.side === over}
            aria-label={`${panel.title}: ${panel.rows.length}`}
            onDragOver={(event) => {
              event.preventDefault()
              setOver(panel.side)
            }}
            onDragLeave={() => setOver(null)}
            onDrop={(event) => drop(event, panel.side)}
          >
            <p data-part="head">
              {panel.title}
              <span data-part="count">{panel.rows.length}</span>
            </p>
            {panel.rows.length === 0 ? (
              <p data-part="empty">{emptyText}</p>
            ) : (
              <ul>
                {panel.rows.map((row) => (
                  <li
                    key={row}
                    draggable
                    data-dragging={row === dragged}
                    onDragStart={() => setDragged(row)}
                    onDragEnd={() => {
                      setDragged(null)
                      setOver(null)
                    }}
                  >
                    <span data-part="text">{row}</span>
                    <button
                      type="button"
                      data-part="send"
                      aria-label={sendLabel
                        .replace("{item}", row)
                        .replace("{from}", panel.title)
                        .replace(
                          "{to}",
                          panel.side === "left" ? targetTitle : sourceTitle,
                        )}
                      onClick={() =>
                        send(row, panel.side === "left" ? "right" : "left")
                      }
                    >
                      {panel.arrow}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <span data-part="live" role="status" aria-live="polite">
          {announcement}
        </span>
      </div>
    </>
  )
}
