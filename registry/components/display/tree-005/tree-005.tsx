"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"

export type Tree005Node = {
  name: string
  children?: Tree005Node[]
}

export type Tree005Props = {
  nodes?: Tree005Node[]
  label?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: дерево с частичным выбором. Состояние хранится только по
// листьям, а галка ветки выводится из них — иначе «выбрано 3 из 5» и вид
// родителя рано или поздно разойдутся. Третье состояние чекбокса в разметке
// объявить нельзя: свойство indeterminate ставится узлу в эффекте, поэтому
// ветка с частичным выбором не выглядит ни пустой, ни полной.
const STYLES = `
:where([data-vibeui-block="tree-005"]){
--vibeui-tree-005-bg:oklch(1 0 0);
--vibeui-tree-005-fg:oklch(0.24 0.014 265);
--vibeui-tree-005-muted:oklch(0.56 0.014 265);
--vibeui-tree-005-border:oklch(0.9 0.006 265);
--vibeui-tree-005-hover:oklch(0.97 0.004 265);
--vibeui-tree-005-accent:oklch(0.53 0.19 265);
--vibeui-tree-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="tree-005"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.625rem;
background:var(--vibeui-tree-005-bg);
border:1px solid var(--vibeui-tree-005-border);border-radius:0.875rem;
font-family:var(--vibeui-tree-005-font);font-size:0.8125rem;
color:var(--vibeui-tree-005-fg);
}
[data-vibeui-block="tree-005"] ul{margin:0;padding:0;list-style:none}
[data-vibeui-block="tree-005"] [role="group"]{
margin-left:0.5625rem;padding-left:0.5rem;
border-left:1px solid var(--vibeui-tree-005-border);
}
[data-vibeui-block="tree-005"] [data-part="row"]{
display:flex;align-items:center;gap:0.25rem;
min-height:1.875rem;padding:0 0.25rem;border-radius:0.5rem;
}
[data-vibeui-block="tree-005"] [data-part="row"]:hover{background:var(--vibeui-tree-005-hover)}
[data-vibeui-block="tree-005"] [data-part="caret"]{
appearance:none;border:0;background:none;cursor:pointer;
flex:none;width:1.125rem;height:1.125rem;padding:0;
display:grid;place-items:center;border-radius:0.25rem;
color:var(--vibeui-tree-005-muted);font-size:0.5625rem;line-height:1;
transition:transform .14s ease;
}
[data-vibeui-block="tree-005"] li[aria-expanded="true"] > [data-part="row"] [data-part="caret"]{
transform:rotate(90deg);
}
[data-vibeui-block="tree-005"] [data-part="spacer"]{flex:none;width:1.125rem}
[data-vibeui-block="tree-005"] label{
display:flex;align-items:center;gap:0.4375rem;
flex:1 1 auto;min-width:0;cursor:pointer;
}
[data-vibeui-block="tree-005"] input{
flex:none;width:0.9375rem;height:0.9375rem;margin:0;
accent-color:var(--vibeui-tree-005-accent);cursor:pointer;
}
[data-vibeui-block="tree-005"] [data-part="caret"]:focus-visible,
[data-vibeui-block="tree-005"] input:focus-visible{
outline:2px solid var(--vibeui-tree-005-accent);outline-offset:2px;
}
[data-vibeui-block="tree-005"] [data-part="name"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="tree-005"] li[data-branch="true"] > [data-part="row"] [data-part="name"]{
font-weight:650;
}
[data-vibeui-block="tree-005"] [data-part="total"]{
margin:0;padding:0.375rem 0.5rem;border-radius:0.5rem;
background:oklch(0.97 0.004 265);
font-size:0.6875rem;color:var(--vibeui-tree-005-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="tree-005"] [data-part="total"] strong{
color:var(--vibeui-tree-005-fg);font-weight:650;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="tree-005"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_NODES: Tree005Node[] = [
  {
    name: "Уведомления о задачах",
    children: [
      { name: "Назначена задача" },
      { name: "Изменён срок" },
      { name: "Добавлен комментарий" },
    ],
  },
  {
    name: "Уведомления о релизах",
    children: [
      { name: "Сборка упала" },
      { name: "Релиз выложен" },
      {
        name: "Откаты",
        children: [{ name: "Автоматический откат" }, { name: "Ручной откат" }],
      },
    ],
  },
  { name: "Дайджест за неделю" },
]

function leavesOf(node: Tree005Node, parent: string): string[] {
  const id = `${parent}/${node.name}`

  if (!node.children?.length) {
    return [id]
  }

  return node.children.flatMap((child) => leavesOf(child, id))
}

/**
 * Дерево чекбоксов с честным третьим состоянием у частично выбранных веток.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tree005({
  nodes = DEFAULT_NODES,
  label = "Что присылать на почту",
  className,
  style,
}: Tree005Props) {
  const allLeaves = nodes.flatMap((node) => leavesOf(node, ""))
  const [checked, setChecked] = useState<Set<string>>(
    () => new Set(allLeaves.slice(0, 2)),
  )
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(nodes.map((node) => `/${node.name}`)),
  )
  const boxes = useRef(new Map<string, HTMLInputElement>())
  const mixed = new Set<string>()

  function setBranch(node: Tree005Node, parent: string, value: boolean) {
    const leaves = leavesOf(node, parent)

    setChecked((previous) => {
      const next = new Set(previous)

      for (const leaf of leaves) {
        if (value) {
          next.add(leaf)
        } else {
          next.delete(leaf)
        }
      }

      return next
    })
  }

  function toggleOpen(id: string) {
    setOpen((previous) => {
      const next = new Set(previous)

      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return next
    })
  }

  function renderLevel(
    list: Tree005Node[],
    level: number,
    parent: string,
    groupLabel: string,
  ) {
    return (
      <ul role={level === 1 ? "tree" : "group"} aria-label={groupLabel}>
        {list.map((node) => {
          const id = `${parent}/${node.name}`
          const branch = Boolean(node.children?.length)
          const leaves = leavesOf(node, parent)
          const picked = leaves.filter((leaf) => checked.has(leaf)).length
          const full = picked === leaves.length
          const expanded = open.has(id)

          if (branch && picked > 0 && !full) {
            mixed.add(id)
          }

          return (
            <li
              key={id}
              role="treeitem"
              aria-level={level}
              aria-expanded={branch ? expanded : undefined}
              aria-selected={full}
              data-branch={branch || undefined}
            >
              <span data-part="row">
                {branch ? (
                  <button
                    type="button"
                    data-part="caret"
                    aria-label={
                      expanded
                        ? `Свернуть «${node.name}»`
                        : `Развернуть «${node.name}»`
                    }
                    onClick={() => toggleOpen(id)}
                  >
                    ▶
                  </button>
                ) : (
                  <span data-part="spacer" aria-hidden="true" />
                )}
                <label>
                  <input
                    type="checkbox"
                    checked={full}
                    ref={(element) => {
                      if (element) {
                        boxes.current.set(id, element)
                      } else {
                        boxes.current.delete(id)
                      }
                    }}
                    onChange={(event) =>
                      setBranch(node, parent, event.target.checked)
                    }
                  />
                  <span data-part="name">{node.name}</span>
                </label>
              </span>
              {branch && expanded
                ? renderLevel(node.children!, level + 1, id, node.name)
                : null}
            </li>
          )
        })}
      </ul>
    )
  }

  const tree = renderLevel(nodes, 1, "", label)

  // Третье состояние живёт только в свойстве узла: атрибута для него нет,
  // поэтому оно проставляется после отрисовки, когда состав веток уже известен.
  useEffect(() => {
    for (const [id, input] of boxes.current) {
      input.indeterminate = mixed.has(id)
    }
  })

  return (
    <>
      <style href="vibeui-tree-005" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="tree-005" className={className} style={style}>
        {tree}
        <p data-part="total" role="status">
          Выбрано <strong>{checked.size}</strong> из {allLeaves.length}
        </p>
      </div>
    </>
  )
}
