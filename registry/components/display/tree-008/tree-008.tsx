import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Tree008Node = {
  name: string
  note?: string
  children?: Tree008Node[]
}

export type Tree008Props = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  nodes?: Tree008Node[]
  label?: string
}

// Идея компонента: развёрнутая структура с настоящими направляющими. Уголок
// каждого узла рисуют два псевдоэлемента — вертикаль и поперечина, — а у
// последнего в ветке вертикаль обрезается по высоте уголка, поэтому линия
// заканчивается на нём, а не уходит в пустоту. Это ровно то, что печатает
// tree в терминале, но без псевдографики в тексте: символы ├ и └ уехали бы
// в буфер обмена при копировании имён.
const STYLES = `
:where([data-vibeui-block="tree-008"]){
--vibeui-tree-008-bg:oklch(1 0 0);
--vibeui-tree-008-fg:oklch(0.24 0.014 265);
--vibeui-tree-008-muted:oklch(0.56 0.014 265);
--vibeui-tree-008-border:oklch(0.9 0.006 265);
--vibeui-tree-008-line:oklch(0.85 0.008 265);
--vibeui-tree-008-row:1.75rem;
--vibeui-tree-008-indent:0.875rem;
--vibeui-tree-008-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
[data-vibeui-block="tree-008"]{
width:100%;max-width:22rem;box-sizing:border-box;padding:0.75rem 0.875rem;
background:var(--vibeui-tree-008-bg);
border:1px solid var(--vibeui-tree-008-border);border-radius:0.875rem;
font-family:var(--vibeui-tree-008-mono);font-size:0.8125rem;
color:var(--vibeui-tree-008-fg);
}
[data-vibeui-block="tree-008"] ul{margin:0;padding:0;list-style:none}
[data-vibeui-block="tree-008"] [role="group"] > li{
position:relative;padding-left:calc(var(--vibeui-tree-008-indent) + 0.375rem);
}
/* Вертикаль ветки: у последнего узла она обрезается по высоте уголка. */
[data-vibeui-block="tree-008"] [role="group"] > li::before{
content:"";position:absolute;left:0;top:0;bottom:0;
width:1px;background:var(--vibeui-tree-008-line);
}
[data-vibeui-block="tree-008"] [role="group"] > li:last-child::before{
bottom:auto;height:calc(var(--vibeui-tree-008-row) / 2);
}
/* Поперечина уголка: середина строки, ширина отступа уровня. */
[data-vibeui-block="tree-008"] [role="group"] > li::after{
content:"";position:absolute;left:0;
top:calc(var(--vibeui-tree-008-row) / 2);
width:var(--vibeui-tree-008-indent);height:1px;
background:var(--vibeui-tree-008-line);
}
[data-vibeui-block="tree-008"] [data-part="row"]{
display:flex;align-items:center;gap:0.4375rem;
height:var(--vibeui-tree-008-row);
}
[data-vibeui-block="tree-008"] [data-part="name"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="tree-008"] li[data-branch="true"] > [data-part="row"] [data-part="name"]{
font-weight:700;
}
[data-vibeui-block="tree-008"] [data-part="note"]{
margin-left:auto;padding-left:0.5rem;
color:var(--vibeui-tree-008-muted);font-size:0.6875rem;
font-variant-numeric:tabular-nums;white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="tree-008"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_NODES: Tree008Node[] = [
  {
    name: "dist",
    note: "412 КБ",
    children: [
      { name: "index.js", note: "184 КБ" },
      { name: "index.d.ts", note: "12 КБ" },
      {
        name: "chunks",
        note: "216 КБ",
        children: [
          { name: "vendor.js", note: "168 КБ" },
          { name: "runtime.js", note: "48 КБ" },
        ],
      },
    ],
  },
  {
    name: "src",
    note: "38 файлов",
    children: [
      { name: "index.ts" },
      { name: "types.ts" },
      { name: "utils.ts" },
    ],
  },
  { name: "package.json", note: "2 КБ" },
]

function renderNodes(nodes: Tree008Node[], level: number) {
  return nodes.map((node) => {
    const branch = Boolean(node.children?.length)

    return (
      <li
        key={node.name}
        role="treeitem"
        aria-level={level}
        aria-expanded={branch ? true : undefined}
        aria-selected={false}
        data-branch={branch || undefined}
      >
        <span data-part="row">
          <span data-part="name">{node.name}</span>
          {node.note ? <span data-part="note">{node.note}</span> : null}
        </span>
        {branch ? (
          <ul role="group" aria-label={node.name}>
            {renderNodes(node.children!, level + 1)}
          </ul>
        ) : null}
      </li>
    )
  })
}

/**
 * Развёрнутая структура с направляющими линиями уровней.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tree008({
  nodes = DEFAULT_NODES,
  label = "Состав пакета",
  className,
  style,
  ...props
}: Tree008Props) {
  return (
    <>
      <style href="vibeui-tree-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="tree-008"
        className={className}
        style={style as CSSProperties}
      >
        <ul role="tree" aria-label={label}>
          {renderNodes(nodes, 1)}
        </ul>
      </div>
    </>
  )
}
