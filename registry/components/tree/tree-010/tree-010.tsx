import type { ComponentProps, CSSProperties } from "react"

export type Tree010Status = "added" | "modified" | "deleted" | "untracked"

export type Tree010Node = {
  name: string
  children?: Tree010Node[]
  /** Состояние файла. У папки не задаётся — она считает его по своей ветке. */
  status?: Tree010Status
  open?: boolean
}

export type Tree010Props = Omit<ComponentProps<"div">, "children"> & {
  nodes?: Tree010Node[]
  label?: string
  /** Подписи состояний для метки и для экранного диктора. */
  statusText?: Record<Tree010Status, string>
  /** Строка под деревом: {changed} и {total}. Пустая строка убирает её. */
  summaryTemplate?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: дерево, в котором видно, что менялось. Файл несёт метку
// состояния, а папка — число изменённых внутри неё, поэтому свёрнутая ветка
// всё равно говорит, есть ли там работа: иначе пришлось бы раскрывать все.
//
// Раскрытие держит нативный details, поэтому компонент остаётся серверным и
// работает до гидратации. Состояние передаётся и цветом, и буквой: цвет один
// не различают при дальтонизме и не читает экранный диктор.
const STYLES = `
:where([data-vibeui-block="tree-010"]){
--vibeui-tree-010-bg:transparent;
--vibeui-tree-010-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-tree-010-muted:color-mix(in oklab,var(--vibeui-tree-010-fg) 62%,transparent);
--vibeui-tree-010-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-tree-010-rail:light-dark(oklch(0.92 0 265),oklch(0.32 0 265));
--vibeui-tree-010-hover:light-dark(oklch(0.97 0 265),oklch(0.29 0 265));
--vibeui-tree-010-accent:light-dark(oklch(0.52 0.19 262),oklch(0.75 0.15 262));
--vibeui-tree-010-added:light-dark(oklch(0.52 0.15 152),oklch(0.76 0.14 152));
--vibeui-tree-010-modified:light-dark(oklch(0.58 0.13 75),oklch(0.8 0.12 85));
--vibeui-tree-010-deleted:light-dark(oklch(0.55 0.19 25),oklch(0.75 0.16 25));
--vibeui-tree-010-untracked:color-mix(in oklab,var(--vibeui-tree-010-fg) 55%,transparent);
--vibeui-tree-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-tree-010-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tree-010"]{color-scheme:dark}
[data-vibeui-block="tree-010"]{
width:100%;max-width:21rem;box-sizing:border-box;padding:0.625rem;
background:var(--vibeui-tree-010-bg);
border:1px solid var(--vibeui-tree-010-border);border-radius:0.875rem;
color:var(--vibeui-tree-010-fg);
font-family:var(--vibeui-tree-010-font);font-size:0.8125rem;
}
[data-vibeui-block="tree-010"] *{box-sizing:border-box}
[data-vibeui-block="tree-010"] details{margin:0}
[data-vibeui-block="tree-010"] summary,
[data-vibeui-block="tree-010"] [data-part="file"]{
display:flex;align-items:center;gap:0.375rem;
padding:0.25rem 0.375rem;border-radius:0.4375rem;
line-height:1.35;
transition:background-color .14s ease;
}
[data-vibeui-block="tree-010"] summary{cursor:pointer;list-style:none}
[data-vibeui-block="tree-010"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="tree-010"] summary:hover,
[data-vibeui-block="tree-010"] [data-part="file"]:hover{background:var(--vibeui-tree-010-hover)}
[data-vibeui-block="tree-010"] summary:focus-visible,
[data-vibeui-block="tree-010"] [data-part="file"]:focus-visible{
outline:2px solid var(--vibeui-tree-010-accent);outline-offset:-2px;
}
[data-vibeui-block="tree-010"] [data-part="caret"]{
flex:none;inline-size:0.3125rem;block-size:0.3125rem;
border-right:1.5px solid var(--vibeui-tree-010-muted);
border-bottom:1.5px solid var(--vibeui-tree-010-muted);
rotate:-45deg;transition:rotate .16s ease;
}
[data-vibeui-block="tree-010"] details[open] > summary [data-part="caret"]{rotate:45deg}
[data-vibeui-block="tree-010"] [data-part="children"]{
margin-inline-start:0.5625rem;padding-inline-start:0.5rem;
border-inline-start:1px solid var(--vibeui-tree-010-rail);
}
[data-vibeui-block="tree-010"] [data-part="file"]{
color:inherit;text-decoration:none;font-family:var(--vibeui-tree-010-mono);font-size:0.75rem;
}
[data-vibeui-block="tree-010"] [data-part="name"]{
min-inline-size:0;flex:1 1 auto;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
/* Метка состояния: буква и цвет вместе. По одному цвету состояние не
   различить при дальтонизме, а диктору достаётся только текст. */
[data-vibeui-block="tree-010"] [data-part="mark"]{
flex:none;display:grid;place-items:center;
inline-size:1rem;block-size:1rem;border-radius:0.25rem;
font-family:var(--vibeui-tree-010-mono);font-size:0.625rem;font-weight:700;line-height:1;
color:light-dark(oklch(1 0 0),oklch(0.16 0 265));
}
[data-vibeui-block="tree-010"] [data-part="mark"][data-status="added"]{background:var(--vibeui-tree-010-added)}
[data-vibeui-block="tree-010"] [data-part="mark"][data-status="modified"]{background:var(--vibeui-tree-010-modified)}
[data-vibeui-block="tree-010"] [data-part="mark"][data-status="deleted"]{background:var(--vibeui-tree-010-deleted)}
[data-vibeui-block="tree-010"] [data-part="mark"][data-status="untracked"]{background:var(--vibeui-tree-010-untracked)}
/* Текст только для диктора: класса из проекта у компонента быть не может. */
[data-vibeui-block="tree-010"] [data-part="reader"]{
position:absolute;inline-size:1px;block-size:1px;margin:-1px;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
}
[data-vibeui-block="tree-010"] [data-part="file"][data-status="deleted"] [data-part="name"]{
text-decoration:line-through;color:var(--vibeui-tree-010-muted);
}
/* Свод по свёрнутой ветке: без него пришлось бы раскрывать всё подряд. */
[data-vibeui-block="tree-010"] [data-part="count"]{
flex:none;min-inline-size:1.125rem;padding:0 0.3125rem;
border-radius:999px;
background:color-mix(in oklab,var(--vibeui-tree-010-accent) 16%,transparent);
color:var(--vibeui-tree-010-accent);
font-size:0.6875rem;font-weight:650;text-align:center;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="tree-010"] [data-part="folder"]{
min-inline-size:0;flex:1 1 auto;font-weight:600;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="tree-010"] [data-part="summary"]{
margin:0.4375rem 0.375rem 0;padding-block-start:0.4375rem;
border-block-start:1px solid var(--vibeui-tree-010-border);
font-size:0.75rem;color:var(--vibeui-tree-010-muted);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="tree-010"] *{animation:none!important;transition:none!important}
}
`

const STATUS_TEXT: Record<Tree010Status, string> = {
  added: "добавлен",
  modified: "изменён",
  deleted: "удалён",
  untracked: "не отслеживается",
}

const STATUS_MARK: Record<Tree010Status, string> = {
  added: "A",
  modified: "M",
  deleted: "D",
  untracked: "?",
}

const DEFAULT_NODES: Tree010Node[] = [
  {
    name: "app",
    open: true,
    children: [
      { name: "layout.tsx" },
      { name: "page.tsx", status: "modified" },
      {
        name: "components",
        open: true,
        children: [
          { name: "page.tsx", status: "modified" },
          { name: "loading.tsx", status: "added" },
        ],
      },
    ],
  },
  {
    name: "registry",
    children: [
      { name: "index.ts", status: "modified" },
      { name: "legacy.ts", status: "deleted" },
      { name: "draft.ts", status: "untracked" },
    ],
  },
  { name: "package.json" },
  { name: "README.md", status: "modified" },
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

function fillTemplate(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}

/** Сколько файлов в ветке помечено состоянием и сколько их всего. */
function tally(nodes: Tree010Node[]): { changed: number; total: number } {
  return nodes.reduce(
    (sum, node) => {
      if (node.children?.length) {
        const inner = tally(node.children)

        return {
          changed: sum.changed + inner.changed,
          total: sum.total + inner.total,
        }
      }

      return {
        changed: sum.changed + (node.status ? 1 : 0),
        total: sum.total + 1,
      }
    },
    { changed: 0, total: 0 },
  )
}

function renderNodes(
  nodes: Tree010Node[],
  level: number,
  statusText: Record<Tree010Status, string>,
) {
  return nodes.map((node) => {
    if (!node.children?.length) {
      return (
        <a
          key={node.name}
          data-part="file"
          data-status={node.status}
          role="treeitem"
          aria-level={level}
          aria-selected={false}
          href="#"
        >
          <span data-part="name">{node.name}</span>
          {node.status ? (
            <span data-part="mark" data-status={node.status}>
              <span aria-hidden="true">{STATUS_MARK[node.status]}</span>
              <span data-part="reader">{statusText[node.status]}</span>
            </span>
          ) : null}
        </a>
      )
    }

    const changed = tally(node.children).changed

    return (
      <details key={node.name} open={node.open}>
        <summary role="treeitem" aria-level={level} aria-selected={false}>
          <span data-part="caret" aria-hidden="true" />
          <span data-part="folder">{node.name}</span>
          {changed > 0 ? <span data-part="count">{changed}</span> : null}
        </summary>
        <div data-part="children" role="group">
          {renderNodes(node.children, level + 1, statusText)}
        </div>
      </details>
    )
  })
}

/**
 * Дерево файлов, в котором видно, что менялось: метка у файла, счёт у папки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tree010({
  nodes = DEFAULT_NODES,
  label = "Изменения в ветке",
  statusText = STATUS_TEXT,
  summaryTemplate = "Изменено файлов: {changed} из {total}.",
  accent,
  background = "",
  className,
  style,
  ...props
}: Tree010Props) {
  const totals = tally(nodes)

  const palette = {
    ...(accent ? { "--vibeui-tree-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tree-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tree-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tree"
        data-vibeui-block="tree-010"
        className={className}
        style={palette}
      >
        <div role="tree" aria-label={label}>
          {renderNodes(nodes, 1, statusText)}
        </div>
        {summaryTemplate ? (
          <p data-part="summary">
            {fillTemplate(summaryTemplate, totals)}
          </p>
        ) : null}
      </div>
    </>
  )
}
