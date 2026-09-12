import type { ComponentProps, CSSProperties } from "react"

export type Tree009Node = {
  /** Идентификатор раздела: по нему компонент находит текущий. */
  id: string
  name: string
  href?: string
  children?: Tree009Node[]
}

export type Tree009Props = Omit<ComponentProps<"nav">, "children"> & {
  nodes?: Tree009Node[]
  /** id текущего раздела: ветка до него раскрывается сама. */
  activeId?: string
  label?: string
  /** Подпись над оглавлением. Пустая строка убирает её. */
  title?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: оглавление, которое само знает, где читатель. Ветка до
// текущего раздела раскрыта, сам раздел помечен полосой на направляющей, а
// предки подсвечены слабее — так видно и место в тексте, и путь до него.
//
// Раскрытие держит нативный details с вычисленным open, поэтому компонент
// остаётся серверным: правильное состояние приходит с сервера и не мигает
// при гидратации, а встроенный поиск браузера находит скрытые пункты.
const STYLES = `
:where([data-vibeui-block="tree-009"]){
--vibeui-tree-009-bg:transparent;
--vibeui-tree-009-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-tree-009-muted:color-mix(in oklab,var(--vibeui-tree-009-fg) 62%,transparent);
--vibeui-tree-009-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-tree-009-rail:light-dark(oklch(0.92 0 265),oklch(0.32 0 265));
--vibeui-tree-009-hover:light-dark(oklch(0.97 0 265),oklch(0.29 0 265));
--vibeui-tree-009-accent:light-dark(oklch(0.28 0 0),oklch(0.905 0 0));
--vibeui-tree-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tree-009"]{color-scheme:dark}
[data-vibeui-block="tree-009"]{
width:100%;max-width:19rem;box-sizing:border-box;padding:0.75rem;
background:var(--vibeui-tree-009-bg);
border:1px solid var(--vibeui-tree-009-border);border-radius:0.875rem;
color:var(--vibeui-tree-009-fg);
font-family:var(--vibeui-tree-009-font);font-size:0.8125rem;
}
[data-vibeui-block="tree-009"] *{box-sizing:border-box}
[data-vibeui-block="tree-009"] [data-part="title"]{
margin:0 0 0.5rem;padding-inline:0.375rem;
font-size:0.6875rem;font-weight:650;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-tree-009-muted);
}
[data-vibeui-block="tree-009"] details{margin:0}
[data-vibeui-block="tree-009"] summary{
display:flex;align-items:center;gap:0.375rem;
padding:0.3125rem 0.375rem;border-radius:0.4375rem;
cursor:pointer;list-style:none;
transition:background-color .14s ease;
}
[data-vibeui-block="tree-009"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="tree-009"] summary:hover{background:var(--vibeui-tree-009-hover)}
[data-vibeui-block="tree-009"] summary:focus-visible,
[data-vibeui-block="tree-009"] [data-part="leaf"]:focus-visible{
outline:2px solid var(--vibeui-tree-009-accent);outline-offset:-2px;
}
[data-vibeui-block="tree-009"] [data-part="caret"]{
flex:none;inline-size:0.3125rem;block-size:0.3125rem;
border-right:1.5px solid var(--vibeui-tree-009-muted);
border-bottom:1.5px solid var(--vibeui-tree-009-muted);
rotate:-45deg;transition:rotate .16s ease;
}
[data-vibeui-block="tree-009"] details[open] > summary [data-part="caret"]{rotate:45deg}
/* Направляющая: она же держит полосу текущего раздела, поэтому линия и
   отметка никогда не разъезжаются. */
[data-vibeui-block="tree-009"] [data-part="children"]{
margin-inline-start:0.6875rem;padding-inline-start:0.5rem;
border-inline-start:1px solid var(--vibeui-tree-009-rail);
}
[data-vibeui-block="tree-009"] [data-part="leaf"]{
position:relative;display:block;
padding:0.3125rem 0.375rem;border-radius:0.4375rem;
color:var(--vibeui-tree-009-muted);text-decoration:none;line-height:1.35;
transition:background-color .14s ease,color .14s ease;
}
[data-vibeui-block="tree-009"] [data-part="leaf"]:hover{
background:var(--vibeui-tree-009-hover);color:var(--vibeui-tree-009-fg);
}
[data-vibeui-block="tree-009"] [data-part="leaf"][aria-current="page"]{
color:var(--vibeui-tree-009-accent);font-weight:650;
background:color-mix(in oklab,var(--vibeui-tree-009-accent) 10%,transparent);
}
/* Полоса стоит на месте направляющей: минус отступ ровно на её толщину. */
[data-vibeui-block="tree-009"] [data-part="leaf"][aria-current="page"]::before{
content:"";position:absolute;inset-block:0.125rem;
inset-inline-start:-0.5625rem;
inline-size:2px;border-radius:999px;
background:var(--vibeui-tree-009-accent);color:oklch(from var(--vibeui-tree-009-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
/* Предки текущего раздела подсвечены слабее: путь виден, но не спорит с
   самим разделом. */
[data-vibeui-block="tree-009"] summary[data-onpath="true"] [data-part="name"]{
color:var(--vibeui-tree-009-fg);font-weight:600;
}
[data-vibeui-block="tree-009"] [data-part="name"]{
min-inline-size:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
color:var(--vibeui-tree-009-muted);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="tree-009"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_NODES: Tree009Node[] = [
  {
    id: "start",
    name: "Начало работы",
    children: [
      { id: "install", name: "Установка", href: "#" },
      { id: "first", name: "Первый компонент", href: "#" },
      {
        id: "theme",
        name: "Тема и токены",
        children: [
          { id: "tokens", name: "Переменные компонента", href: "#" },
          { id: "dark", name: "Тёмная тема", href: "#" },
        ],
      },
    ],
  },
  {
    id: "registry",
    name: "Реестр",
    children: [
      { id: "format", name: "Формат registry.json", href: "#" },
      { id: "build", name: "Сборка", href: "#" },
      { id: "publish", name: "Публикация", href: "#" },
    ],
  },
  { id: "faq", name: "Частые вопросы", href: "#" },
]

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

/** Есть ли текущий раздел внутри ветки: по этому ответу ветка и раскрывается. */
function holdsActive(node: Tree009Node, activeId: string): boolean {
  if (node.id === activeId) {
    return true
  }

  return (node.children ?? []).some((child) => holdsActive(child, activeId))
}

function renderNodes(nodes: Tree009Node[], level: number, activeId: string) {
  return nodes.map((node) => {
    if (!node.children?.length) {
      return (
        <a
          key={node.id}
          data-part="leaf"
          role="treeitem"
          aria-level={level}
          aria-selected={node.id === activeId}
          aria-current={node.id === activeId ? "page" : undefined}
          href={node.href}
        >
          {node.name}
        </a>
      )
    }

    const onPath = holdsActive(node, activeId)

    return (
      <details key={node.id} open={onPath}>
        <summary
          role="treeitem"
          aria-level={level}
          aria-selected={false}
          data-onpath={onPath || undefined}
        >
          <span data-part="caret" aria-hidden="true" />
          <span data-part="name">{node.name}</span>
        </summary>
        <div data-part="children" role="group">
          {renderNodes(node.children, level + 1, activeId)}
        </div>
      </details>
    )
  })
}

/**
 * Оглавление, которое раскрывает ветку до текущего раздела и помечает его.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tree009({
  nodes = DEFAULT_NODES,
  activeId = "dark",
  label = "Разделы документации",
  title = "Документация",
  accent,
  background = "",
  className,
  style,
  ...props
}: Tree009Props) {
  const palette = {
    ...(accent ? { "--vibeui-tree-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tree-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tree-009" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="tree"
        data-vibeui-block="tree-009"
        className={className}
        style={palette}
        aria-label={label}
      >
        {title ? <p data-part="title">{title}</p> : null}
        <div role="tree" aria-label={label}>
          {renderNodes(nodes, 1, activeId)}
        </div>
      </nav>
    </>
  )
}
