"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Cascader018Status = "ok" | "repair" | "off"

export type Cascader018Node = {
  name: string
  status?: Cascader018Status
  children?: Cascader018Node[]
}

export type Cascader018Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onSelect"
> & {
  label?: string
  tree?: Cascader018Node[]
  defaultPath?: string[]
  levelLabels?: string[]
  /** Подпись колонки, для которой не задан levelLabels; {n} — номер уровня. */
  levelFallback?: string
  /** Статусы узла словами: их читает скринридер и показывает итог. */
  statusText?: Record<Cascader018Status, string>
  /** Итог, пока узел не выбран. */
  emptyText?: string
  onSelect?: (path: string[]) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: у каскадера с тремя колонками на узкой ширине выбор
// один — либо ломать колонки в столбик, либо прокручивать их горизонтально.
// Здесь колонки живут в полосе со scroll-snap: после выбора уровня следующая
// колонка встаёт по краю сама, как в файловом менеджере. У каждого узла
// оборудования есть статус точкой — по нему видно, куда вообще нельзя вешать
// заявку.
const STYLES = `
:where([data-vibeui-block="cascader-018"]){
--vibeui-cascader-018-bg:transparent;
/* Прилипающая шапка уровня обязана быть непрозрачной, иначе строки списка
   проступают сквозь неё. Canvas берёт фон окружения по color-scheme. */
--vibeui-cascader-018-head:Canvas;
--vibeui-cascader-018-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-cascader-018-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-cascader-018-border:light-dark(oklch(0.9 0.008 265),oklch(0.35 0.012 265));
--vibeui-cascader-018-soft:light-dark(oklch(0.965 0.006 265),oklch(0.28 0.012 265));
--vibeui-cascader-018-ok:light-dark(oklch(0.6 0.13 150),oklch(0.72 0.15 150));
--vibeui-cascader-018-repair:light-dark(oklch(0.7 0.14 75),oklch(0.79 0.15 75));
--vibeui-cascader-018-off:light-dark(oklch(0.62 0.15 25),oklch(0.72 0.16 25));
--vibeui-cascader-018-accent:light-dark(oklch(0.5 0.13 265),oklch(0.76 0.13 265));
--vibeui-cascader-018-accentsoft:light-dark(oklch(0.94 0.04 265),oklch(0.33 0.05 265));
--vibeui-cascader-018-radius:0.625rem;
--vibeui-cascader-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="cascader-018"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-cascader-018-bg);
border:1px solid var(--vibeui-cascader-018-border);
border-radius:calc(var(--vibeui-cascader-018-radius) + 0.25rem);
color:var(--vibeui-cascader-018-fg);
font-family:var(--vibeui-cascader-018-font);
}
[data-vibeui-block="cascader-018"] [data-part="title"]{
margin:0;font-size:0.875rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="cascader-018"] [data-part="strip"]{
display:flex;gap:0.4rem;overflow-x:auto;
scroll-snap-type:x mandatory;scroll-padding-left:0.3rem;
padding:0.3rem;
border:1px solid var(--vibeui-cascader-018-border);
border-radius:var(--vibeui-cascader-018-radius);
}
[data-vibeui-block="cascader-018"] [data-part="col"]{
flex:0 0 9.5rem;min-width:0;scroll-snap-align:start;
display:flex;flex-direction:column;gap:0.2rem;
}
[data-vibeui-block="cascader-018"] [data-part="colhead"]{
position:sticky;top:0;
font-size:0.62rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-cascader-018-muted);
background:var(--vibeui-cascader-018-head);padding:0.1rem 0.3rem;
}
[data-vibeui-block="cascader-018"] [data-part="col"] ul{
margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.1rem;
max-height:11rem;overflow-y:auto;
}
[data-vibeui-block="cascader-018"] [data-part="node"]{
appearance:none;cursor:pointer;font:inherit;width:100%;
display:flex;align-items:center;gap:0.35rem;
box-sizing:border-box;padding:0.35rem 0.4rem;
border:0;border-radius:0.4rem;background:transparent;color:inherit;text-align:left;
font-size:0.78rem;
transition:background-color .16s ease;
}
[data-vibeui-block="cascader-018"] [data-part="node"]:hover{background:var(--vibeui-cascader-018-soft)}
[data-vibeui-block="cascader-018"] [data-part="node"]:focus-visible{
outline:2px solid var(--vibeui-cascader-018-accent);outline-offset:-2px;
}
[data-vibeui-block="cascader-018"] [data-part="node"][aria-current="true"]{
background:var(--vibeui-cascader-018-accentsoft);font-weight:600;
}
[data-vibeui-block="cascader-018"] [data-part="dot"]{
flex:none;width:0.5rem;height:0.5rem;border-radius:50%;
background:var(--vibeui-cascader-018-ok);
}
[data-vibeui-block="cascader-018"] [data-part="dot"][data-status="repair"]{background:var(--vibeui-cascader-018-repair)}
[data-vibeui-block="cascader-018"] [data-part="dot"][data-status="off"]{background:var(--vibeui-cascader-018-off)}
[data-vibeui-block="cascader-018"] [data-part="text"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="cascader-018"] [data-part="foot"]{
margin:0;font-size:0.8125rem;color:var(--vibeui-cascader-018-muted);
}
[data-vibeui-block="cascader-018"] [data-part="foot"] b{color:var(--vibeui-cascader-018-fg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cascader-018"] *{animation:none!important;transition:none!important}}
`

const PLANT: Cascader018Node[] = [
  {
    name: "Цех сборки",
    status: "ok",
    children: [
      {
        name: "Линия А1",
        status: "ok",
        children: [
          { name: "Конвейер", status: "ok" },
          { name: "Робот-манипулятор", status: "repair" },
          { name: "Пост контроля", status: "ok" },
        ],
      },
      {
        name: "Линия А2",
        status: "repair",
        children: [
          { name: "Пресс 40т", status: "off" },
          { name: "Сварочный узел", status: "ok" },
        ],
      },
    ],
  },
  {
    name: "Цех окраски",
    status: "repair",
    children: [
      {
        name: "Камера К1",
        status: "repair",
        children: [
          { name: "Вентиляция", status: "repair" },
          { name: "Сушка", status: "ok" },
        ],
      },
    ],
  },
  {
    name: "Склад сырья",
    status: "ok",
    children: [
      {
        name: "Зона хранения",
        status: "ok",
        children: [{ name: "Штабелёр", status: "ok" }],
      },
    ],
  },
]

const STATUS_TEXT: Record<Cascader018Status, string> = {
  ok: "в работе",
  repair: "в ремонте",
  off: "остановлен",
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
 * Выбор узла оборудования: колонки уровней в полосе со scroll-snap.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Cascader018({
  label = "Узел оборудования",
  tree = PLANT,
  defaultPath = ["Цех сборки", "Линия А1"],
  levelLabels = ["Цех", "Линия", "Узел"],
  levelFallback = "Уровень {n}",
  statusText = STATUS_TEXT,
  emptyText = "Узел не выбран",
  onSelect,
  background = "",
  accent,
  className,
  style,
  ...props
}: Cascader018Props) {
  const [path, setPath] = useState(defaultPath)

  const columns: Cascader018Node[][] = [tree]
  let level = tree

  for (const name of path) {
    const node = level.find((entry) => entry.name === name)

    if (!node?.children?.length) break

    columns.push(node.children)
    level = node.children
  }

  const leaf = (() => {
    let found: Cascader018Node | undefined
    let cursor = tree

    for (const name of path) {
      found = cursor.find((entry) => entry.name === name)
      cursor = found?.children ?? []
    }

    return found
  })()

  const palette = {
    ...(accent ? { "--vibeui-cascader-018-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-cascader-018-bg": background,
          "--vibeui-cascader-018-head": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cascader-018" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="cascader-018"
        className={className}
        style={palette}
      >
        <h3 data-part="title">{label}</h3>
        <div data-part="strip">
          {columns.map((nodes, depth) => (
            <div key={levelLabels[depth] ?? depth} data-part="col">
              <span data-part="colhead">
                {levelLabels[depth] ??
                  levelFallback.replace("{n}", String(depth + 1))}
              </span>
              <ul
                aria-label={
                  levelLabels[depth] ??
                  levelFallback.replace("{n}", String(depth + 1))
                }
              >
                {nodes.map((node) => (
                  <li key={node.name}>
                    <button
                      type="button"
                      data-part="node"
                      aria-current={path[depth] === node.name}
                      aria-label={`${node.name}, ${statusText[node.status ?? "ok"] ?? STATUS_TEXT[node.status ?? "ok"]}`}
                      onClick={() => {
                        const next = [...path.slice(0, depth), node.name]

                        setPath(next)
                        onSelect?.(next)
                      }}
                    >
                      <span
                        data-part="dot"
                        data-status={node.status ?? "ok"}
                        aria-hidden="true"
                      />
                      <span data-part="text">{node.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p data-part="foot" aria-live="polite">
          {leaf ? (
            <>
              <b>{path.join(" / ")}</b> —{" "}
              {statusText[leaf.status ?? "ok"] ??
                STATUS_TEXT[leaf.status ?? "ok"]}
            </>
          ) : (
            emptyText
          )}
        </p>
      </section>
    </>
  )
}
