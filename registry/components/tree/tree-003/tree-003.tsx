import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Tree003Node = {
  name: string
  children?: Tree003Node[]
  open?: boolean
}

export type Tree003Props = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  nodes?: Tree003Node[]
  label?: string
}

// Идея компонента: дерево разделов вообще без клиентского кода. Раскрытие
// держит нативный details, поэтому компонент остаётся серверным, работает до
// гидратации и находится встроенным поиском браузера. aria-level проставлен
// явно при обходе: из вложенности details скринридер глубину не выводит.
// В бейдже — число страниц во всей ветке, а не только в первом её уровне.
const STYLES = `
:where([data-vibeui-block="tree-003"]){
--vibeui-tree-003-bg:oklch(1 0 0);
--vibeui-tree-003-fg:oklch(0.24 0.014 265);
--vibeui-tree-003-muted:oklch(0.56 0.014 265);
--vibeui-tree-003-border:oklch(0.9 0.006 265);
--vibeui-tree-003-hover:oklch(0.97 0.004 265);
--vibeui-tree-003-chip:oklch(0.955 0.004 265);
--vibeui-tree-003-accent:oklch(0.55 0.17 265);
--vibeui-tree-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="tree-003"]{
width:100%;max-width:20rem;box-sizing:border-box;padding:0.5rem;
background:var(--vibeui-tree-003-bg);
border:1px solid var(--vibeui-tree-003-border);border-radius:0.875rem;
font-family:var(--vibeui-tree-003-font);font-size:0.8125rem;
color:var(--vibeui-tree-003-fg);
}
[data-vibeui-block="tree-003"] [data-part="caption"]{
display:block;padding:0.125rem 0.5rem 0.5rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;
color:var(--vibeui-tree-003-muted);
}
/* Раскрытие держит details: клиентского кода нет вовсе. */
[data-vibeui-block="tree-003"] summary{
list-style:none;cursor:pointer;
display:flex;align-items:center;gap:0.5rem;
min-height:2rem;padding:0 0.5rem;border-radius:0.5rem;
font-weight:600;
}
[data-vibeui-block="tree-003"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="tree-003"] summary:hover{background:var(--vibeui-tree-003-hover)}
[data-vibeui-block="tree-003"] summary:focus-visible{
outline:2px solid var(--vibeui-tree-003-accent);outline-offset:-2px;
}
[data-vibeui-block="tree-003"] [data-part="caret"]{
flex:none;width:0;height:0;
border-left:0.3125rem solid var(--vibeui-tree-003-muted);
border-top:0.25rem solid transparent;border-bottom:0.25rem solid transparent;
transition:transform .14s ease;
}
[data-vibeui-block="tree-003"] details[open] > summary [data-part="caret"]{transform:rotate(90deg)}
[data-vibeui-block="tree-003"] [data-part="title"]{
flex:1 1 auto;min-width:0;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
/* Число страниц во всей ветке: считается при обходе, а не по первому уровню. */
[data-vibeui-block="tree-003"] [data-part="count"]{
flex:none;padding:0.0625rem 0.375rem;border-radius:9999px;
background:var(--vibeui-tree-003-chip);color:var(--vibeui-tree-003-muted);
font-size:0.625rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="tree-003"] [data-part="children"]{
margin-left:0.6875rem;padding-left:0.5rem;
border-left:1px solid var(--vibeui-tree-003-border);
}
[data-vibeui-block="tree-003"] [data-part="leaf"]{
display:flex;align-items:center;gap:0.5rem;
min-height:1.875rem;padding:0 0.5rem;border-radius:0.5rem;
color:var(--vibeui-tree-003-fg);text-decoration:none;
}
[data-vibeui-block="tree-003"] [data-part="leaf"]:hover{background:var(--vibeui-tree-003-hover)}
[data-vibeui-block="tree-003"] [data-part="leaf"]:focus-visible{
outline:2px solid var(--vibeui-tree-003-accent);outline-offset:-2px;
}
[data-vibeui-block="tree-003"] [data-part="dash"]{
flex:none;width:0.4375rem;height:1px;background:var(--vibeui-tree-003-muted);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="tree-003"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_NODES: Tree003Node[] = [
  {
    name: "Начало работы",
    open: true,
    children: [
      { name: "Установка" },
      { name: "Первый компонент" },
      {
        name: "Настройка темы",
        children: [{ name: "Токены" }, { name: "Тёмная тема" }],
      },
    ],
  },
  {
    name: "Реестр",
    children: [
      { name: "Формат registry.json" },
      { name: "Сборка" },
      { name: "Публикация" },
    ],
  },
  { name: "Часто задаваемые вопросы" },
]

function countLeaves(nodes: Tree003Node[]): number {
  return nodes.reduce(
    (total, node) =>
      total + (node.children?.length ? countLeaves(node.children) : 1),
    0,
  )
}

function renderNodes(nodes: Tree003Node[], level: number) {
  return nodes.map((node) =>
    node.children?.length ? (
      <details key={node.name} open={node.open}>
        <summary role="treeitem" aria-level={level} aria-selected={false}>
          <span data-part="caret" aria-hidden="true" />
          <span data-part="title">{node.name}</span>
          <span data-part="count">{countLeaves(node.children)}</span>
        </summary>
        <div data-part="children" role="group">
          {renderNodes(node.children, level + 1)}
        </div>
      </details>
    ) : (
      <a
        key={node.name}
        data-part="leaf"
        role="treeitem"
        aria-level={level}
        aria-selected={false}
        href="#"
      >
        <span data-part="dash" aria-hidden="true" />
        <span data-part="title">{node.name}</span>
      </a>
    ),
  )
}

/**
 * Дерево разделов на нативных details: серверный рендер без клиентского кода.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tree003({
  nodes = DEFAULT_NODES,
  label = "Документация",
  className,
  style,
  ...props
}: Tree003Props) {
  return (
    <>
      <style href="vibeui-tree-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="tree-003"
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="caption">{label}</span>
        <div role="tree" aria-label={label}>
          {renderNodes(nodes, 1)}
        </div>
      </div>
    </>
  )
}
