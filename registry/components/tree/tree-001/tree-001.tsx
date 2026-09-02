import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Tree001Node = {
  name: string
  children?: Tree001Node[]
  open?: boolean
}

export type Tree001Props = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  nodes?: Tree001Node[]
  /** Подпись дерева для скринридера. */
  label?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: дерево файлов на вложенных details. Раскрытие, клавиатура
// и запоминание открытых веток достаются от браузера — своё дерево пришлось
// бы держать в состоянии и чинить в каждом браузере. Отступ рисуется линией
// слева, поэтому видно, к какой ветке относится строка.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="tree-001"]){
--vibeui-tree-001-bg:transparent;
--vibeui-tree-001-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-tree-001-muted:light-dark(oklch(0.56 0.014 265),oklch(0.67 0.012 265));
--vibeui-tree-001-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-tree-001-hover:light-dark(oklch(0.97 0.003 265),oklch(0.29 0.01 265));
--vibeui-tree-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-tree-001-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
[data-vibeui-block="tree-001"]{
width:100%;max-width:20rem;box-sizing:border-box;padding:0.625rem;
background:var(--vibeui-tree-001-bg);
border:1px solid var(--vibeui-tree-001-border);border-radius:0.875rem;
font-family:var(--vibeui-tree-001-mono);font-size:0.8125rem;color:var(--vibeui-tree-001-fg);
}
/* Раскрытие на вложенных details: состояние веток держит браузер. */
[data-vibeui-block="tree-001"] summary{
list-style:none;cursor:pointer;
display:flex;align-items:center;gap:0.375rem;
min-height:1.75rem;padding:0 0.375rem;border-radius:0.375rem;
}
[data-vibeui-block="tree-001"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="tree-001"] summary:hover{background:var(--vibeui-tree-001-hover)}
[data-vibeui-block="tree-001"] summary:focus-visible{outline:2px solid var(--vibeui-tree-001-accent);outline-offset:-2px}
[data-vibeui-block="tree-001"] [data-part="caret"]{
flex:none;width:0.375rem;height:0.375rem;
border-right:1.5px solid var(--vibeui-tree-001-muted);
border-bottom:1.5px solid var(--vibeui-tree-001-muted);
transform:rotate(-45deg);transition:transform .14s ease;
}
[data-vibeui-block="tree-001"] details[open] > summary [data-part="caret"]{transform:rotate(45deg)}
/* Линия отступа: видно, к какой ветке относится строка. */
[data-vibeui-block="tree-001"] [data-part="children"]{
margin-left:0.6875rem;padding-left:0.625rem;
border-left:1px solid var(--vibeui-tree-001-border);
}
[data-vibeui-block="tree-001"] [data-part="leaf"]{
display:flex;align-items:center;gap:0.375rem;
min-height:1.75rem;padding:0 0.375rem;border-radius:0.375rem;
color:var(--vibeui-tree-001-fg);text-decoration:none;
}
[data-vibeui-block="tree-001"] [data-part="leaf"]:hover{background:var(--vibeui-tree-001-hover)}
[data-vibeui-block="tree-001"] [data-part="leaf"]:focus-visible{outline:2px solid var(--vibeui-tree-001-accent);outline-offset:-2px}
[data-vibeui-block="tree-001"] [data-part="dot"]{
flex:none;width:0.3125rem;height:0.3125rem;margin:0 0.03125rem;
border-radius:9999px;background:var(--vibeui-tree-001-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tree-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_NODES: Tree001Node[] = [
  {
    name: "registry",
    open: true,
    children: [
      {
        name: "components",
        open: true,
        children: [{ name: "buttons" }, { name: "calendar" }, { name: "menu" }],
      },
      { name: "blocks", children: [{ name: "hero" }, { name: "pricing" }] },
    ],
  },
  { name: "package.json" },
]

function renderNodes(nodes: Tree001Node[]) {
  return nodes.map((node) =>
    node.children?.length ? (
      <details key={node.name} open={node.open}>
        <summary>
          <span data-part="caret" aria-hidden="true" />
          {node.name}
        </summary>
        <div data-part="children">{renderNodes(node.children)}</div>
      </details>
    ) : (
      <a key={node.name} data-part="leaf" href="#">
        <span data-part="dot" aria-hidden="true" />
        {node.name}
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
 * Дерево файлов на вложенных details: раскрытие и клавиатура от браузера.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tree001({
  nodes = DEFAULT_NODES,
  label = "Файлы проекта",
  background = "",
  accent,
  className,
  style,
  ...props
}: Tree001Props) {
  const palette = {
    ...(accent ? { "--vibeui-tree-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tree-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tree-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="tree-001"
        role="tree"
        aria-label={label}
        className={className}
        style={palette}
      >
        {renderNodes(nodes)}
      </div>
    </>
  )
}
