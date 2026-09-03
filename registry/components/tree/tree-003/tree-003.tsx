import type { ComponentProps, CSSProperties } from "react"

export type Tree003Node = {
  name: string
  children?: Tree003Node[]
  open?: boolean
}

export type Tree003Props = Omit<ComponentProps<"div">, "children"> & {
  nodes?: Tree003Node[]
  label?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: дерево разделов вообще без клиентского кода. Раскрытие
// держит нативный details, поэтому компонент остаётся серверным, работает до
// гидратации и находится встроенным поиском браузера. aria-level проставлен
// явно при обходе: из вложенности details скринридер глубину не выводит.
// В бейдже — число страниц во всей ветке, а не только в первом её уровне.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="tree-003"]){
--vibeui-tree-003-bg:transparent;
--vibeui-tree-003-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-tree-003-muted:color-mix(in oklab,var(--vibeui-tree-003-fg) 68%,transparent);
--vibeui-tree-003-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-tree-003-hover:light-dark(oklch(0.97 0.004 265),oklch(0.29 0.01 265));
--vibeui-tree-003-chip:light-dark(oklch(0.955 0.004 265),oklch(0.32 0.012 265));
--vibeui-tree-003-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-tree-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tree-003"]{color-scheme:dark}
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
 * Дерево разделов на нативных details: серверный рендер без клиентского кода.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tree003({
  nodes = DEFAULT_NODES,
  label = "Документация",
  background = "",
  accent,
  className,
  style,
  ...props
}: Tree003Props) {
  const palette = {
    ...(accent ? { "--vibeui-tree-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tree-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tree-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tree"
        data-vibeui-block="tree-003"
        className={className}
        style={palette}
      >
        <span data-part="caption">{label}</span>
        <div role="tree" aria-label={label}>
          {renderNodes(nodes, 1)}
        </div>
      </div>
    </>
  )
}
