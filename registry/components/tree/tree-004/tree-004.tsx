"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { CSSProperties, KeyboardEvent } from "react"

export type Tree004Node = {
  name: string
  children?: Tree004Node[]
  open?: boolean
}

export type Tree004Props = {
  nodes?: Tree004Node[]
  label?: string
  /** Строка о выбранном узле; {name} — его имя. */
  selectedText?: string
  /** Подсказка, пока ничего не выбрано. */
  hintText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: дерево с выбранным узлом и полной клавиатурой. Разметка
// вложенная — treeitem владеет своей группой, — а порядок обхода собирается
// отдельным плоским списком видимых узлов: по нему считаются стрелки, Home и
// End. Выбор и фокус разведены: стрелки только переносят фокус, выбирает
// Enter или пробел, поэтому дерево не «выбирает» всё, над чем пробежали.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="tree-004"]){
--vibeui-tree-004-bg:transparent;
--vibeui-tree-004-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-tree-004-muted:color-mix(in oklab,var(--vibeui-tree-004-fg) 68%,transparent);
--vibeui-tree-004-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-tree-004-hover:light-dark(oklch(0.97 0 265),oklch(0.29 0 265));
--vibeui-tree-004-selected:light-dark(oklch(0.94 0 0),oklch(0.34 0 0));
--vibeui-tree-004-panel:light-dark(oklch(0.97 0 265),oklch(0.28 0 265));
--vibeui-tree-004-accent:light-dark(oklch(0.282 0 0),oklch(0.905 0 0));
--vibeui-tree-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tree-004"]{color-scheme:dark}
[data-vibeui-block="tree-004"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.625rem;
background:var(--vibeui-tree-004-bg);
border:1px solid var(--vibeui-tree-004-border);border-radius:0.875rem;
font-family:var(--vibeui-tree-004-font);font-size:0.8125rem;
color:var(--vibeui-tree-004-fg);
}
[data-vibeui-block="tree-004"] ul{margin:0;padding:0;list-style:none}
[data-vibeui-block="tree-004"] [role="group"]{
margin-left:0.5625rem;padding-left:0.5rem;
border-left:1px solid var(--vibeui-tree-004-border);
}
[data-vibeui-block="tree-004"] li{outline:none}
[data-vibeui-block="tree-004"] [data-part="row"]{
display:flex;align-items:center;gap:0.4375rem;
min-height:1.875rem;padding:0 0.5rem;border-radius:0.5rem;cursor:pointer;
}
[data-vibeui-block="tree-004"] [data-part="row"]:hover{background:var(--vibeui-tree-004-hover)}
/* Выбор виден не только заливкой: слева встаёт полоса выбранного узла. */
[data-vibeui-block="tree-004"] li[aria-selected="true"] > [data-part="row"]{
background:var(--vibeui-tree-004-selected);font-weight:650;
box-shadow:inset 0.1875rem 0 0 var(--vibeui-tree-004-accent);
}
[data-vibeui-block="tree-004"] li:focus-visible > [data-part="row"]{
outline:2px solid var(--vibeui-tree-004-accent);outline-offset:-2px;
}
[data-vibeui-block="tree-004"] [data-part="caret"]{
flex:none;width:0.6875rem;text-align:center;
color:var(--vibeui-tree-004-muted);font-size:0.5625rem;line-height:1;
transition:transform .14s ease;
}
[data-vibeui-block="tree-004"] li[aria-expanded="true"] > [data-part="row"] [data-part="caret"]{
transform:rotate(90deg);
}
[data-vibeui-block="tree-004"] [data-part="name"]{
flex:1 1 auto;min-width:0;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="tree-004"] [data-part="status"]{
margin:0;padding:0.375rem 0.5rem;border-radius:0.5rem;
background:var(--vibeui-tree-004-panel);
font-size:0.6875rem;color:var(--vibeui-tree-004-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="tree-004"] [data-part="status"] strong{
color:var(--vibeui-tree-004-fg);font-weight:650;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="tree-004"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_NODES: Tree004Node[] = [
  {
    name: "Продажи",
    open: true,
    children: [
      { name: "Прямые продажи" },
      {
        name: "Партнёры",
        open: true,
        children: [{ name: "Реселлеры" }, { name: "Интеграторы" }],
      },
    ],
  },
  {
    name: "Маркетинг",
    children: [{ name: "Контент" }, { name: "Мероприятия" }],
  },
  { name: "Поддержка" },
]

type Flat = {
  id: string
  name: string
  level: number
  parent: string | null
  branch: boolean
}

function flatten(
  nodes: Tree004Node[],
  open: Set<string>,
  level = 1,
  parent: string | null = null,
  out: Flat[] = [],
) {
  for (const node of nodes) {
    const id = `${parent ?? ""}/${node.name}`
    const branch = Boolean(node.children?.length)

    out.push({ id, name: node.name, level, parent, branch })

    if (branch && open.has(id)) {
      flatten(node.children!, open, level + 1, id, out)
    }
  }

  return out
}

function collectOpen(
  nodes: Tree004Node[],
  parent = "",
  into = new Set<string>(),
) {
  for (const node of nodes) {
    const id = `${parent}/${node.name}`

    if (node.open) {
      into.add(id)
    }

    if (node.children?.length) {
      collectOpen(node.children, id, into)
    }
  }

  return into
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Дерево с выбором узла и полной клавиатурой: стрелки, Home и End.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tree004({
  nodes = DEFAULT_NODES,
  label = "Направления",
  selectedText = "Выбрано: {name}",
  hintText = "Стрелки — переход, Enter или пробел — выбор",
  background = "",
  accent,
  className,
  style,
}: Tree004Props) {
  const [open, setOpen] = useState(() => collectOpen(nodes))
  const order = useMemo(() => flatten(nodes, open), [nodes, open])
  const [focus, setFocus] = useState(() => order[0]?.id ?? "")
  const [selected, setSelected] = useState("")
  const elements = useRef(new Map<string, HTMLLIElement>())
  const moved = useRef(false)

  useEffect(() => {
    if (moved.current) {
      elements.current.get(focus)?.focus()
      moved.current = false
    }
  }, [focus])

  const index = Math.max(
    0,
    order.findIndex((entry) => entry.id === focus),
  )

  function move(next: number) {
    const target = order[Math.min(order.length - 1, Math.max(0, next))]

    if (target) {
      moved.current = true
      setFocus(target.id)
    }
  }

  function toggle(id: string, force?: boolean) {
    setOpen((previous) => {
      const next = new Set(previous)

      if (force ?? !next.has(id)) {
        next.add(id)
      } else {
        next.delete(id)
      }

      return next
    })
  }

  function onKeyDown(event: KeyboardEvent<HTMLLIElement>, row: Flat) {
    const keys = [
      "ArrowDown",
      "ArrowUp",
      "ArrowRight",
      "ArrowLeft",
      "Home",
      "End",
      "Enter",
      " ",
    ]

    if (!keys.includes(event.key)) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    if (event.key === "ArrowDown") {
      move(index + 1)
    } else if (event.key === "ArrowUp") {
      move(index - 1)
    } else if (event.key === "Home") {
      move(0)
    } else if (event.key === "End") {
      move(order.length - 1)
    } else if (event.key === "ArrowRight") {
      if (row.branch && !open.has(row.id)) {
        toggle(row.id, true)
      } else if (row.branch) {
        move(index + 1)
      }
    } else if (event.key === "ArrowLeft") {
      if (row.branch && open.has(row.id)) {
        toggle(row.id, false)
      } else if (row.parent) {
        move(order.findIndex((entry) => entry.id === row.parent))
      }
    } else {
      setSelected(row.id)

      if (row.branch) {
        toggle(row.id)
      }
    }
  }

  function renderLevel(
    list: Tree004Node[],
    level: number,
    parent: string,
    groupLabel: string,
  ) {
    return (
      <ul role={level === 1 ? "tree" : "group"} aria-label={groupLabel}>
        {list.map((node) => {
          const id = `${parent}/${node.name}`
          const branch = Boolean(node.children?.length)
          const row = order.find((entry) => entry.id === id)

          return (
            <li
              key={id}
              role="treeitem"
              aria-level={level}
              aria-expanded={branch ? open.has(id) : undefined}
              aria-selected={selected === id}
              tabIndex={focus === id ? 0 : -1}
              ref={(element) => {
                if (element) {
                  elements.current.set(id, element)
                } else {
                  elements.current.delete(id)
                }
              }}
              onKeyDown={(event) => (row ? onKeyDown(event, row) : undefined)}
              onFocus={(event) => {
                event.stopPropagation()
                setFocus(id)
              }}
            >
              <span
                data-part="row"
                onClick={(event) => {
                  event.stopPropagation()
                  setSelected(id)
                  setFocus(id)

                  if (branch) {
                    toggle(id)
                  }
                }}
              >
                <span data-part="caret" aria-hidden="true">
                  {branch ? "▶" : "·"}
                </span>
                <span data-part="name">{node.name}</span>
              </span>
              {branch && open.has(id)
                ? renderLevel(node.children!, level + 1, id, node.name)
                : null}
            </li>
          )
        })}
      </ul>
    )
  }

  const chosen = order.find((entry) => entry.id === selected)
  const [beforeName, afterName = ""] = selectedText.split("{name}")
  const palette = {
    ...(accent ? { "--vibeui-tree-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tree-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tree-004" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="tree"
        data-vibeui-block="tree-004"
        className={className}
        style={palette}
      >
        {renderLevel(nodes, 1, "", label)}
        <p data-part="status">
          {chosen ? (
            <>
              {beforeName}
              <strong>{chosen.name}</strong>
              {afterName}
            </>
          ) : (
            hintText
          )}
        </p>
      </div>
    </>
  )
}
