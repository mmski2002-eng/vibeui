"use client"

import { useState } from "react"
import { Card171 } from "@/registry/components/card/card-171/card-171"
import type { ComponentProps, CSSProperties } from "react"

export type Datagrid024Node = {
  id: string
  label: string
  owner: string
  amount: number
  children?: Datagrid024Node[]
}

export type Datagrid024Props = Omit<ComponentProps<"section">, "children"> & {
  tree?: Datagrid024Node[]
  caption?: string
  depthStep?: number
  /** Заголовок панели над таблицей. */
  heading?: string
  /** Подписи кнопки «свернуть/развернуть всё». */
  collapseAllText?: string
  expandAllText?: string
  /** Подписи переключателя ветки. {label} — название статьи. */
  collapseLabel?: string
  expandLabel?: string
  /** Заголовки колонок по ключу: компонент несёт русские. */
  columnText?: Record<string, string>
  /** Подпись строки итога. */
  totalText?: string
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Пусто — подложки нет, сетка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: строки образуют дерево, и это заявлено разметкой, а не
// одними отступами. У каждой строки есть aria-level, у родителя —
// aria-expanded, отступ считается от уровня через собственную переменную.
// Сумма родителя всегда пересчитывается по потомкам: свёрнутая ветка без
// собственного итога прячет данные, а не сворачивает их.
//
// Тема берётся из color-scheme окружения через light-dark(): сетка темнеет
// вместе со страницей и не носит собственной подложки.
const STYLES = `
:where([data-vibeui-block="datagrid-024"]){
--vibeui-datagrid-024-bg:transparent;
--vibeui-datagrid-024-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
--vibeui-datagrid-024-muted:color-mix(in oklab,var(--vibeui-datagrid-024-fg) 68%,transparent);
--vibeui-datagrid-024-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-datagrid-024-head:light-dark(oklch(0.975 0 285),oklch(0.27 0 285));
--vibeui-datagrid-024-accent:light-dark(oklch(0.27 0 0),oklch(0.906 0 0));
--vibeui-datagrid-024-step:1.25rem;
--vibeui-datagrid-024-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-datagrid-024-dur-2:180ms;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="datagrid-024"]{color-scheme:dark}
[data-vibeui-block="datagrid-024"]{
box-sizing:border-box;width:100%;max-width:48rem;margin:0 auto;
background:var(--vibeui-datagrid-024-bg);color:var(--vibeui-datagrid-024-fg);
border:1px solid var(--vibeui-datagrid-024-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-024-font);overflow:hidden;
}
[data-vibeui-block="datagrid-024"] *{box-sizing:border-box}
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
background:transparent;color:var(--vibeui-datagrid-024-accent);
transition:transform var(--vibeui-datagrid-024-dur-2) ease;
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

const COLUMN_TEXT: Record<string, string> = {
  label: "Статья",
  owner: "Исполнитель",
  amount: "Сумма, ₽",
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
  heading = "Смета проекта",
  collapseAllText = "Свернуть всё",
  expandAllText = "Развернуть всё",
  collapseLabel = "Свернуть ветку «{label}»",
  expandLabel = "Развернуть ветку «{label}»",
  columnText = COLUMN_TEXT,
  totalText = "Всего по смете",
  scrollLabel = "Дерево статей сметы, прокручивается вбок",
  background = "",
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
    ...(background
      ? {
          "--vibeui-datagrid-024-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
                  aria-label={(expanded ? collapseLabel : expandLabel).replace(
                    "{label}",
                    node.label,
                  )}
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
        data-slot="data-grid"
        data-vibeui-block="datagrid-024"
        className={className}
        style={palette}
      >
        <Card171 data-part="bar" heading={heading} collapseAllText={collapseAllText} expandAllText={expandAllText} branches={branches} open={open} setOpen={setOpen} accent={accent} />
        <div
          data-part="scroll"
          role="region"
          aria-label={scrollLabel}
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col">{columnText.label ?? COLUMN_TEXT.label}</th>
                <th scope="col">{columnText.owner ?? COLUMN_TEXT.owner}</th>
                <th scope="col" data-align="end">
                  {columnText.amount ?? COLUMN_TEXT.amount}
                </th>
              </tr>
            </thead>
            <tbody>{render(tree, 0)}</tbody>
            <tfoot>
              <tr>
                <th scope="row" colSpan={2}>
                  {totalText}
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
