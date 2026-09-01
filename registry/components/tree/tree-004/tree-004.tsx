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
  className?: string
  style?: CSSProperties
}

// Идея компонента: дерево с выбранным узлом и полной клавиатурой. Разметка
// вложенная — treeitem владеет своей группой, — а порядок обхода собирается
// отдельным плоским списком видимых узлов: по нему считаются стрелки, Home и
// End. Выбор и фокус разведены: стрелки только переносят фокус, выбирает
// Enter или пробел, поэтому дерево не «выбирает» всё, над чем пробежали.
const STYLES = `
:where([data-vibeui-block="tree-004"]){
--vibeui-tree-004-bg:oklch(1 0 0);
--vibeui-tree-004-fg:oklch(0.24 0.014 265);
--vibeui-tree-004-muted:oklch(0.56 0.014 265);
--vibeui-tree-004-border:oklch(0.9 0.006 265);
--vibeui-tree-004-hover:oklch(0.97 0.004 265);
--vibeui-tree-004-selected:oklch(0.94 0.04 265);
--vibeui-tree-004-accent:oklch(0.53 0.19 265);
--vibeui-tree-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
background:oklch(0.97 0.004 265);
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
 * Дерево с выбором узла и полной клавиатурой: стрелки, Home и End.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tree004({
  nodes = DEFAULT_NODES,
  label = "Направления",
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

  return (
    <>
      <style href="vibeui-tree-004" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="tree-004" className={className} style={style}>
        {renderLevel(nodes, 1, "", label)}
        <p data-part="status">
          {chosen ? (
            <>
              Выбрано: <strong>{chosen.name}</strong>
            </>
          ) : (
            "Стрелки — переход, Enter или пробел — выбор"
          )}
        </p>
      </div>
    </>
  )
}
