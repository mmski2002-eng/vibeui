"use client"

import { useId, useMemo, useState } from "react"
import type { CSSProperties, ReactNode } from "react"

export type Tree006Node = {
  name: string
  children?: Tree006Node[]
}

export type Tree006Props = {
  nodes?: Tree006Node[]
  label?: string
  placeholder?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: поиск по дереву обязан оставлять путь до находки. Ветка
// остаётся в выдаче, если совпало её имя ИЛИ имя любого потомка, — иначе
// найденный файл повисает без папки и непонятно, где он лежит. Совпадение
// подсвечивается тегом mark, а не span с фоном: mark — семантика выделения,
// её объявляет и скринридер. Пока поле пустое, дерево показано целиком.
const STYLES = `
:where([data-vibeui-block="tree-006"]){
--vibeui-tree-006-bg:oklch(1 0 0);
--vibeui-tree-006-fg:oklch(0.24 0.014 265);
--vibeui-tree-006-muted:oklch(0.56 0.014 265);
--vibeui-tree-006-border:oklch(0.9 0.006 265);
--vibeui-tree-006-hover:oklch(0.97 0.004 265);
--vibeui-tree-006-mark:oklch(0.92 0.13 95);
--vibeui-tree-006-accent:oklch(0.53 0.19 265);
--vibeui-tree-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="tree-006"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.625rem;
background:var(--vibeui-tree-006-bg);
border:1px solid var(--vibeui-tree-006-border);border-radius:0.875rem;
font-family:var(--vibeui-tree-006-font);font-size:0.8125rem;
color:var(--vibeui-tree-006-fg);
}
[data-vibeui-block="tree-006"] input{
box-sizing:border-box;width:100%;height:2rem;padding:0 0.625rem;
border:1px solid var(--vibeui-tree-006-border);border-radius:0.5rem;
background:var(--vibeui-tree-006-bg);color:var(--vibeui-tree-006-fg);
font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="tree-006"] input::placeholder{color:var(--vibeui-tree-006-muted)}
[data-vibeui-block="tree-006"] input:focus-visible{
outline:2px solid var(--vibeui-tree-006-accent);outline-offset:-1px;
}
[data-vibeui-block="tree-006"] ul{margin:0;padding:0;list-style:none}
[data-vibeui-block="tree-006"] [role="group"]{
margin-left:0.5625rem;padding-left:0.5rem;
border-left:1px solid var(--vibeui-tree-006-border);
}
[data-vibeui-block="tree-006"] [data-part="row"]{
display:flex;align-items:center;gap:0.4375rem;
min-height:1.8125rem;padding:0 0.5rem;border-radius:0.5rem;
}
[data-vibeui-block="tree-006"] [data-part="row"]:hover{background:var(--vibeui-tree-006-hover)}
[data-vibeui-block="tree-006"] li[data-branch="true"] > [data-part="row"]{font-weight:650}
[data-vibeui-block="tree-006"] [data-part="dot"]{
flex:none;width:0.3125rem;height:0.3125rem;border-radius:9999px;
background:var(--vibeui-tree-006-muted);
}
[data-vibeui-block="tree-006"] [data-part="name"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
/* Подсветка тегом mark: это семантика выделения, а не просто жёлтый фон. */
[data-vibeui-block="tree-006"] mark{
background:var(--vibeui-tree-006-mark);color:inherit;
border-radius:0.1875rem;padding:0 0.0625rem;
}
[data-vibeui-block="tree-006"] [data-part="empty"]{
margin:0;padding:0.75rem 0.5rem;text-align:center;
color:var(--vibeui-tree-006-muted);font-size:0.75rem;
}
[data-vibeui-block="tree-006"] [data-part="count"]{
margin:0;font-size:0.6875rem;color:var(--vibeui-tree-006-muted);
font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="tree-006"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_NODES: Tree006Node[] = [
  {
    name: "components",
    children: [
      { name: "button.tsx" },
      { name: "button-group.tsx" },
      { name: "calendar.tsx" },
      {
        name: "forms",
        children: [
          { name: "text-field.tsx" },
          { name: "select-field.tsx" },
          { name: "form-message.tsx" },
        ],
      },
    ],
  },
  {
    name: "lib",
    children: [{ name: "utils.ts" }, { name: "format-date.ts" }],
  },
  { name: "middleware.ts" },
]

function matches(node: Tree006Node, query: string): boolean {
  if (node.name.toLowerCase().includes(query)) {
    return true
  }

  return Boolean(node.children?.some((child) => matches(child, query)))
}

function countMatches(nodes: Tree006Node[], query: string): number {
  return nodes.reduce((total, node) => {
    const self = node.name.toLowerCase().includes(query) ? 1 : 0

    return total + self + countMatches(node.children ?? [], query)
  }, 0)
}

function highlight(name: string, query: string): ReactNode {
  if (!query) {
    return name
  }

  const at = name.toLowerCase().indexOf(query)

  if (at < 0) {
    return name
  }

  return (
    <>
      {name.slice(0, at)}
      <mark>{name.slice(at, at + query.length)}</mark>
      {name.slice(at + query.length)}
    </>
  )
}

/**
 * Дерево с поиском: путь до находки остаётся, совпадение подсвечено.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tree006({
  nodes = DEFAULT_NODES,
  label = "Файлы",
  placeholder = "Поиск по дереву",
  className,
  style,
}: Tree006Props) {
  const [query, setQuery] = useState("")
  const fieldId = useId()
  const needle = query.trim().toLowerCase()
  const found = useMemo(
    () => (needle ? countMatches(nodes, needle) : 0),
    [nodes, needle],
  )

  function renderLevel(
    list: Tree006Node[],
    level: number,
    parent: string,
    groupLabel: string,
  ) {
    const visible = needle ? list.filter((node) => matches(node, needle)) : list

    if (visible.length === 0) {
      return null
    }

    return (
      <ul role={level === 1 ? "tree" : "group"} aria-label={groupLabel}>
        {visible.map((node) => {
          const id = `${parent}/${node.name}`
          const branch = Boolean(node.children?.length)

          return (
            <li
              key={id}
              role="treeitem"
              aria-level={level}
              aria-expanded={branch ? true : undefined}
              aria-selected={false}
              data-branch={branch || undefined}
            >
              <span data-part="row">
                <span data-part="dot" aria-hidden="true" />
                <span data-part="name">{highlight(node.name, needle)}</span>
              </span>
              {branch
                ? renderLevel(node.children!, level + 1, id, node.name)
                : null}
            </li>
          )
        })}
      </ul>
    )
  }

  const tree = renderLevel(nodes, 1, "", label)

  return (
    <>
      <style href="vibeui-tree-006" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="tree-006" className={className} style={style}>
        <label htmlFor={fieldId} hidden>
          {placeholder}
        </label>
        <input
          id={fieldId}
          type="search"
          value={query}
          placeholder={placeholder}
          onChange={(event) => setQuery(event.target.value)}
        />
        {needle ? (
          <p data-part="count" role="status">
            Совпадений: {found}
          </p>
        ) : null}
        {tree ?? <p data-part="empty">Ничего не найдено</p>}
      </div>
    </>
  )
}
