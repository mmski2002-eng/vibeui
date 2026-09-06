"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { CSSProperties, KeyboardEvent } from "react"

export type Tree002Node = {
  name: string
  children?: Tree002Node[]
  open?: boolean
  /** Пометка состояния файла: M — изменён, A — добавлен, D — удалён. */
  status?: "M" | "A" | "D"
}

export type Tree002Props = {
  nodes?: Tree002Node[]
  label?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: дерево файлов, где тип виден до чтения имени. Цвет значка
// считается из расширения хешем, поэтому новый тип файла получает свой оттенок
// сам, без таблицы соответствий. Раскрытием управляет состояние, а не details:
// нужны role="treeitem" и aria-expanded, которых у details нет. Фокус
// переезжает по узлам стрелками, в дереве всего один таб-стоп.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="tree-002"]){
--vibeui-tree-002-bg:transparent;
--vibeui-tree-002-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-tree-002-muted:color-mix(in oklab,var(--vibeui-tree-002-fg) 68%,transparent);
--vibeui-tree-002-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-tree-002-hover:light-dark(oklch(0.97 0 265),oklch(0.29 0 265));
--vibeui-tree-002-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.74 0.15 39.8));
--vibeui-tree-002-hue:265;
--vibeui-tree-002-level:1;
--vibeui-tree-002-indent:0.875rem;
--vibeui-tree-002-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tree-002"]{color-scheme:dark}
[data-vibeui-block="tree-002"]{
width:100%;max-width:21rem;box-sizing:border-box;padding:0.5rem;
background:var(--vibeui-tree-002-bg);
border:1px solid var(--vibeui-tree-002-border);border-radius:0.875rem;
font-family:var(--vibeui-tree-002-mono);font-size:0.8125rem;
color:var(--vibeui-tree-002-fg);
}
[data-vibeui-block="tree-002"] ul{margin:0;padding:0;list-style:none}
[data-vibeui-block="tree-002"] li{outline:none}
[data-vibeui-block="tree-002"] [data-part="row"]{
display:flex;align-items:center;gap:0.4375rem;
min-height:1.875rem;border-radius:0.4375rem;
padding-right:0.4375rem;
padding-left:calc(0.375rem + (var(--vibeui-tree-002-level) - 1) * var(--vibeui-tree-002-indent));
cursor:pointer;
}
[data-vibeui-block="tree-002"] [data-part="row"]:hover{background:var(--vibeui-tree-002-hover)}
[data-vibeui-block="tree-002"] li:focus-visible > [data-part="row"]{
outline:2px solid var(--vibeui-tree-002-accent);outline-offset:-2px;
}
[data-vibeui-block="tree-002"] [data-part="caret"]{
flex:none;width:0.75rem;display:grid;place-items:center;
color:var(--vibeui-tree-002-muted);font-size:0.5625rem;line-height:1;
transition:transform .14s ease;
}
[data-vibeui-block="tree-002"] li[aria-expanded="true"] > [data-part="row"] [data-part="caret"]{
transform:rotate(90deg);
}
/* Значок типа: оттенок считается из расширения, таблицы соответствий нет. */
[data-vibeui-block="tree-002"] [data-part="badge"]{
flex:none;display:grid;place-items:center;
width:1.125rem;height:1.125rem;border-radius:0.3125rem;
background:light-dark(oklch(0.93 0.06 var(--vibeui-tree-002-hue)),oklch(0.37 0.07 var(--vibeui-tree-002-hue)));
color:light-dark(oklch(0.4 0.14 var(--vibeui-tree-002-hue)),oklch(0.9 0.08 var(--vibeui-tree-002-hue)));
font-size:0.5rem;font-weight:800;letter-spacing:0.02em;
}
[data-vibeui-block="tree-002"] [data-part="badge"][data-kind="folder"]{
background:light-dark(oklch(0.94 0.05 85),oklch(0.38 0.06 85));
color:light-dark(oklch(0.45 0.11 75),oklch(0.9 0.08 80));
}
[data-vibeui-block="tree-002"] [data-part="name"]{
flex:1 1 auto;min-width:0;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
/* Состояние файла буквой, а не только цветом: цвет не читается без зрения. */
[data-vibeui-block="tree-002"] [data-part="status"]{
flex:none;font-size:0.6875rem;font-weight:700;
color:var(--vibeui-tree-002-muted);
}
[data-vibeui-block="tree-002"] [data-part="status"][data-value="M"]{color:light-dark(oklch(0.55 0.14 75),oklch(0.79 0.13 80))}
[data-vibeui-block="tree-002"] [data-part="status"][data-value="A"]{color:light-dark(oklch(0.52 0.14 155),oklch(0.76 0.14 155))}
[data-vibeui-block="tree-002"] [data-part="status"][data-value="D"]{color:light-dark(oklch(0.55 0.17 28),oklch(0.74 0.16 28))}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="tree-002"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_NODES: Tree002Node[] = [
  {
    name: "app",
    open: true,
    children: [
      { name: "layout.tsx", status: "M" },
      { name: "page.tsx" },
      { name: "globals.css", status: "A" },
    ],
  },
  {
    name: "registry",
    open: true,
    children: [
      {
        name: "components",
        children: [{ name: "tree-002.tsx" }, { name: "registry.json" }],
      },
      { name: "index.ts" },
    ],
  },
  { name: "package.json" },
  { name: "README.md", status: "D" },
]

function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

type Flat = {
  id: string
  node: Tree002Node
  level: number
  parent: string | null
  branch: boolean
  position: number
  size: number
}

// Список рисуется плоским, поэтому уровень и место в ветке приходится
// объявлять атрибутами: без них скринридер не расскажет структуру.
function flatten(
  nodes: Tree002Node[],
  open: Set<string>,
  level = 1,
  parent: string | null = null,
  out: Flat[] = [],
) {
  nodes.forEach((node, index) => {
    const id = `${parent ?? ""}/${node.name}`
    const branch = Boolean(node.children?.length)

    out.push({
      id,
      node,
      level,
      parent,
      branch,
      position: index + 1,
      size: nodes.length,
    })

    if (branch && open.has(id)) {
      flatten(node.children!, open, level + 1, id, out)
    }
  })

  return out
}

function collectOpen(
  nodes: Tree002Node[],
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
 * Дерево файлов с типовыми значками и переездом фокуса стрелками.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tree002({
  nodes = DEFAULT_NODES,
  label = "Файлы проекта",
  background = "",
  accent,
  className,
  style,
}: Tree002Props) {
  const [open, setOpen] = useState(() => collectOpen(nodes))
  const rows = useMemo(() => flatten(nodes, open), [nodes, open])
  const [active, setActive] = useState(() => rows[0]?.id ?? "")
  const elements = useRef(new Map<string, HTMLLIElement>())
  const moved = useRef(false)

  useEffect(() => {
    if (moved.current) {
      elements.current.get(active)?.focus()
      moved.current = false
    }
  }, [active])

  const current = rows.findIndex((row) => row.id === active)
  const focused = current >= 0 ? current : 0

  function move(index: number) {
    const next = rows[Math.min(rows.length - 1, Math.max(0, index))]

    if (next) {
      moved.current = true
      setActive(next.id)
    }
  }

  function toggle(id: string, force?: boolean) {
    setOpen((previous) => {
      const next = new Set(previous)
      const shouldOpen = force ?? !next.has(id)

      if (shouldOpen) {
        next.add(id)
      } else {
        next.delete(id)
      }

      return next
    })
  }

  function onKeyDown(event: KeyboardEvent<HTMLLIElement>, row: Flat) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      move(focused + 1)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      move(focused - 1)
    } else if (event.key === "ArrowRight") {
      event.preventDefault()

      if (row.branch && !open.has(row.id)) {
        toggle(row.id, true)
      } else if (row.branch) {
        move(focused + 1)
      }
    } else if (event.key === "ArrowLeft") {
      event.preventDefault()

      if (row.branch && open.has(row.id)) {
        toggle(row.id, false)
      } else if (row.parent) {
        move(rows.findIndex((entry) => entry.id === row.parent))
      }
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()

      if (row.branch) {
        toggle(row.id)
      }
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-tree-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tree-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tree-002" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="tree"
        data-vibeui-block="tree-002"
        className={className}
        style={palette}
      >
        <ul role="tree" aria-label={label}>
          {rows.map((row, index) => {
            const extension = row.branch
              ? "folder"
              : (row.node.name.split(".").pop() ?? "file")

            return (
              <li
                key={row.id}
                role="treeitem"
                aria-level={row.level}
                aria-posinset={row.position}
                aria-setsize={row.size}
                aria-expanded={row.branch ? open.has(row.id) : undefined}
                aria-selected={false}
                tabIndex={index === focused ? 0 : -1}
                ref={(element) => {
                  if (element) {
                    elements.current.set(row.id, element)
                  } else {
                    elements.current.delete(row.id)
                  }
                }}
                onKeyDown={(event) => onKeyDown(event, row)}
                onFocus={() => setActive(row.id)}
                style={
                  {
                    "--vibeui-tree-002-level": row.level,
                    "--vibeui-tree-002-hue": hue(extension),
                  } as CSSProperties
                }
              >
                <span
                  data-part="row"
                  onClick={() => row.branch && toggle(row.id)}
                >
                  <span data-part="caret" aria-hidden="true">
                    {row.branch ? "▶" : ""}
                  </span>
                  <span
                    data-part="badge"
                    data-kind={row.branch ? "folder" : "file"}
                    aria-hidden="true"
                  >
                    {row.branch ? "/" : extension.slice(0, 2).toUpperCase()}
                  </span>
                  <span data-part="name">{row.node.name}</span>
                  {row.node.status ? (
                    <span data-part="status" data-value={row.node.status}>
                      {row.node.status}
                    </span>
                  ) : null}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
