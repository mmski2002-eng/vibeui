"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Datagrid024Node = {
  id: string
  label: string
  owner: string
  amount: number
  children?: Datagrid024Node[]
}

export type Datagrid024Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  tree?: Datagrid024Node[]
  caption?: string
  depthStep?: number
  accent?: string
}

// Идея компонента: строки образуют дерево, и это заявлено разметкой, а не
// одними отступами. У каждой строки есть aria-level, у родителя —
// aria-expanded, отступ считается от уровня через собственную переменную.
// Сумма родителя всегда пересчитывается по потомкам: свёрнутая ветка без
// собственного итога прячет данные, а не сворачивает их.
const STYLES = `
:where([data-vibeui-block="datagrid-024"]){
--vibeui-datagrid-024-bg:oklch(1 0 0);
--vibeui-datagrid-024-fg:oklch(0.23 0.014 285);
--vibeui-datagrid-024-muted:oklch(0.55 0.014 285);
--vibeui-datagrid-024-border:oklch(0.92 0.006 285);
--vibeui-datagrid-024-head:oklch(0.975 0.003 285);
--vibeui-datagrid-024-accent:oklch(0.48 0.14 185);
--vibeui-datagrid-024-step:1.25rem;
--vibeui-datagrid-024-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="datagrid-024"]{
box-sizing:border-box;width:100%;max-width:48rem;margin:0 auto;
background:var(--vibeui-datagrid-024-bg);color:var(--vibeui-datagrid-024-fg);
border:1px solid var(--vibeui-datagrid-024-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-024-font);overflow:hidden;
}
[data-vibeui-block="datagrid-024"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-024"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-datagrid-024-border);
}
[data-vibeui-block="datagrid-024"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="datagrid-024"] [data-part="all"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;
padding:0.3125rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-datagrid-024-border);
background:var(--vibeui-datagrid-024-bg);color:var(--vibeui-datagrid-024-fg);
}
[data-vibeui-block="datagrid-024"] [data-part="all"]:focus-visible{outline:2px solid var(--vibeui-datagrid-024-accent);outline-offset:2px}
[data-vibeui-block="datagrid-024"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-024"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-024-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-024"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-024"] caption{
padding:0.625rem 0.875rem;text-align:left;font-size:0.75rem;color:var(--vibeui-datagrid-024-muted);caption-side:top;
}
[data-vibeui-block="datagrid-024"] th,
[data-vibeui-block="datagrid-024"] td{
padding:0.4375rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-datagrid-024-border);
}
[data-vibeui-block="datagrid-024"] thead th{background:var(--vibeui-datagrid-024-head);font-weight:600}
[data-vibeui-block="datagrid-024"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-024"] tbody th[scope="row"]{
padding-inline-start:calc(0.875rem + var(--vibeui-datagrid-024-step) * var(--vibeui-datagrid-024-depth,0));
font-weight:500;
}
[data-vibeui-block="datagrid-024"] tr[data-branch="true"] th[scope="row"]{font-weight:650}
[data-vibeui-block="datagrid-024"] tr[data-branch="true"] td{font-weight:600}
[data-vibeui-block="datagrid-024"] [data-part="row-inner"]{display:inline-flex;align-items:center;gap:0.4375rem}
[data-vibeui-block="datagrid-024"] [data-part="toggle"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.625rem;line-height:1;flex:none;
width:1.125rem;height:1.125rem;border-radius:0.3125rem;
border:1px solid var(--vibeui-datagrid-024-border);
background:var(--vibeui-datagrid-024-bg);color:var(--vibeui-datagrid-024-accent);
transition:transform .15s ease;
}
[data-vibeui-block="datagrid-024"] [data-part="toggle"][aria-expanded="true"]{transform:rotate(90deg)}
[data-vibeui-block="datagrid-024"] [data-part="toggle"]:focus-visible{outline:2px solid var(--vibeui-datagrid-024-accent);outline-offset:2px}
[data-vibeui-block="datagrid-024"] [data-part="leafdot"]{flex:none;width:1.125rem;text-align:center;color:var(--vibeui-datagrid-024-border)}
[data-vibeui-block="datagrid-024"] [data-part="owner"]{color:var(--vibeui-datagrid-024-muted)}
[data-vibeui-block="datagrid-024"] tfoot th,
[data-vibeui-block="datagrid-024"] tfoot td{
background:var(--vibeui-datagrid-024-head);font-weight:650;border-top:2px solid var(--vibeui-datagrid-024-accent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-024"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TREE: Datagrid024Node[] = [
  {
    id: "n1",
    label: "Проектирование",
    owner: "КБ",
    amount: 0,
    children: [
      { id: "n1a", label: "Эскизный проект", owner: "Ким", amount: 480000 },
      {
        id: "n1b",
        label: "Рабочая документация",
        owner: "Ким",
        amount: 920000,
      },
      {
        id: "n1c",
        label: "Согласования",
        owner: "Юрлова",
        amount: 0,
        children: [
          {
            id: "n1c1",
            label: "Пожарная часть",
            owner: "Юрлова",
            amount: 140000,
          },
          {
            id: "n1c2",
            label: "Энергонадзор",
            owner: "Юрлова",
            amount: 210000,
          },
        ],
      },
    ],
  },
  {
    id: "n2",
    label: "Строительно-монтажные работы",
    owner: "Подряд",
    amount: 0,
    children: [
      { id: "n2a", label: "Фундамент", owner: "Мостовик", amount: 3100000 },
      { id: "n2b", label: "Каркас", owner: "Мостовик", amount: 5400000 },
    ],
  },
  { id: "n3", label: "Пусконаладка", owner: "Сервис", amount: 760000 },
]

function total(node: Datagrid024Node): number {
  return node.children && node.children.length > 0
    ? node.children.reduce((sum, child) => sum + total(child), 0)
    : node.amount
}

function collectBranches(nodes: Datagrid024Node[]): string[] {
  return nodes.flatMap((node) =>
    node.children && node.children.length > 0
      ? [node.id, ...collectBranches(node.children)]
      : [],
  )
}

/**
 * Сетка-дерево с раскрывающимися дочерними строками: уровень объявлен
 * через aria-level, итог родителя считается по ветке. Один файл.
 */
export function Datagrid024({
  tree = DEFAULT_TREE,
  caption = "Сумма родителя пересчитывается по вложенным строкам",
  depthStep = 20,
  accent,
  className,
  style,
  ...props
}: Datagrid024Props) {
  const [open, setOpen] = useState<string[]>(["n1", "n2"])

  const branches = collectBranches(tree)
  const grand = tree.reduce((sum, node) => sum + total(node), 0)

  const palette = {
    "--vibeui-datagrid-024-step": `${depthStep / 16}rem`,
    ...(accent ? { "--vibeui-datagrid-024-accent": accent } : null),
    ...style,
  } as CSSProperties

  function render(nodes: Datagrid024Node[], depth: number) {
    return nodes.flatMap((node) => {
      const hasChildren = Boolean(node.children && node.children.length > 0)
      const expanded = open.includes(node.id)
      const rows = [
        <tr
          key={node.id}
          data-branch={hasChildren ? "true" : undefined}
          aria-level={depth + 1}
          aria-expanded={hasChildren ? expanded : undefined}
        >
          <th
            scope="row"
            style={{ "--vibeui-datagrid-024-depth": depth } as CSSProperties}
          >
            <span data-part="row-inner">
              {hasChildren ? (
                <button
                  type="button"
                  data-part="toggle"
                  aria-expanded={expanded}
                  aria-label={
                    expanded
                      ? `Свернуть ветку «${node.label}»`
                      : `Развернуть ветку «${node.label}»`
                  }
                  onClick={() =>
                    setOpen((current) =>
                      current.includes(node.id)
                        ? current.filter((id) => id !== node.id)
                        : [...current, node.id],
                    )
                  }
                >
                  <span aria-hidden="true">▶</span>
                </button>
              ) : (
                <span data-part="leafdot" aria-hidden="true">
                  ·
                </span>
              )}
              {node.label}
            </span>
          </th>
          <td data-part="owner">{node.owner}</td>
          <td data-align="end">{total(node).toLocaleString("ru-RU")}</td>
        </tr>,
      ]

      if (hasChildren && expanded) {
        rows.push(...render(node.children ?? [], depth + 1))
      }

      return rows
    })
  }

  return (
    <>
      <style href="vibeui-datagrid-024" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="datagrid-024"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <h3 data-part="title">Смета проекта</h3>
          <button
            type="button"
            data-part="all"
            onClick={() =>
              setOpen((current) =>
                current.length === branches.length ? [] : branches,
              )
            }
          >
            {open.length === branches.length
              ? "Свернуть всё"
              : "Развернуть всё"}
          </button>
        </div>
        <div
          data-part="scroll"
          role="region"
          aria-label="Дерево статей сметы, прокручивается вбок"
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col">Статья</th>
                <th scope="col">Исполнитель</th>
                <th scope="col" data-align="end">
                  Сумма, ₽
                </th>
              </tr>
            </thead>
            <tbody>{render(tree, 0)}</tbody>
            <tfoot>
              <tr>
                <th scope="row" colSpan={2}>
                  Всего по смете
                </th>
                <td data-align="end">{grand.toLocaleString("ru-RU")}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </>
  )
}
