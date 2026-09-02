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
  /** Строка о числе находок; {count} — их количество. */
  countText?: string
  /** Что показать, когда ничего не нашлось. */
  emptyText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: поиск по дереву обязан оставлять путь до находки. Ветка
// остаётся в выдаче, если совпало её имя ИЛИ имя любого потомка, — иначе
// найденный файл повисает без папки и непонятно, где он лежит. Совпадение
// подсвечивается тегом mark, а не span с фоном: mark — семантика выделения,
// её объявляет и скринридер. Пока поле пустое, дерево показано целиком.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="tree-006"]){
--vibeui-tree-006-bg:transparent;
--vibeui-tree-006-field:light-dark(oklch(1 0 0),oklch(0.26 0.01 265));
--vibeui-tree-006-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-tree-006-muted:light-dark(oklch(0.56 0.014 265),oklch(0.67 0.012 265));
--vibeui-tree-006-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-tree-006-hover:light-dark(oklch(0.97 0.004 265),oklch(0.29 0.01 265));
--vibeui-tree-006-mark:light-dark(oklch(0.92 0.13 95),oklch(0.52 0.11 95));
--vibeui-tree-006-accent:light-dark(oklch(0.53 0.19 265),oklch(0.75 0.16 265));
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
background:var(--vibeui-tree-006-field);color:var(--vibeui-tree-006-fg);
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
 * Дерево с поиском: путь до находки остаётся, совпадение подсвечено.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tree006({
  nodes = DEFAULT_NODES,
  label = "Файлы",
  placeholder = "Поиск по дереву",
  countText = "Совпадений: {count}",
  emptyText = "Ничего не найдено",
  background = "",
  accent,
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
  const palette = {
    ...(accent ? { "--vibeui-tree-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tree-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tree-006" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="tree-006" className={className} style={palette}>
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
            {countText.replace("{count}", String(found))}
          </p>
        ) : null}
        {tree ?? <p data-part="empty">{emptyText}</p>}
      </div>
    </>
  )
}
