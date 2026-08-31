"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Cascader005Node = {
  label: string
  children?: Cascader005Node[]
}

export type Cascader005Props = {
  rootLabel?: string
  submitLabel?: string
  tree?: Cascader005Node[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: выбор категории товара, где навигацию ведут хлебные
// крошки. Уровень открывается плитками в две колонки, а пройденный путь
// висит сверху и кликается — вернуться на два шага назад можно одним
// нажатием, а не серией «назад». Кнопка подтверждения показывает полный
// путь целиком: категория «Куртки» без ветки над ней ничего не значит.
const STYLES = `
:where([data-vibeui-block="cascader-005"]){
--vibeui-cascader-005-bg:oklch(1 0 0);
--vibeui-cascader-005-tile:oklch(0.975 0.004 90);
--vibeui-cascader-005-fg:oklch(0.24 0.014 90);
--vibeui-cascader-005-muted:oklch(0.55 0.012 90);
--vibeui-cascader-005-border:oklch(0.9 0.008 90);
--vibeui-cascader-005-accent:oklch(0.56 0.16 45);
--vibeui-cascader-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="cascader-005"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-cascader-005-bg);color:var(--vibeui-cascader-005-fg);
border:1px solid var(--vibeui-cascader-005-border);border-radius:1rem;
font-family:var(--vibeui-cascader-005-font);
box-shadow:0 18px 40px -32px oklch(0.2 0.03 90 / 55%);
}
[data-vibeui-block="cascader-005"] *{box-sizing:border-box}
[data-vibeui-block="cascader-005"] [data-part="crumbs"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.1875rem;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="cascader-005"] [data-part="crumb"]{
display:inline-flex;align-items:center;gap:0.1875rem;
}
[data-vibeui-block="cascader-005"] [data-part="crumb"] button{
padding:0.1875rem 0.4375rem;border:0;border-radius:0.4375rem;
background:transparent;color:var(--vibeui-cascader-005-muted);
font:inherit;font-size:0.75rem;cursor:pointer;
transition:background-color .14s ease,color .14s ease;
}
[data-vibeui-block="cascader-005"] [data-part="crumb"] button:hover{
background:color-mix(in oklab,var(--vibeui-cascader-005-accent) 12%,transparent);
color:var(--vibeui-cascader-005-fg);
}
[data-vibeui-block="cascader-005"] [data-part="crumb"] button:focus-visible{
outline:2px solid var(--vibeui-cascader-005-accent);outline-offset:1px;
}
[data-vibeui-block="cascader-005"] [data-part="crumb"][aria-current="page"] button{
color:var(--vibeui-cascader-005-fg);font-weight:650;cursor:default;
}
[data-vibeui-block="cascader-005"] [data-part="sep"]{
color:var(--vibeui-cascader-005-border);font-size:0.75rem;
}
[data-vibeui-block="cascader-005"] [data-part="tiles"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.375rem;
margin:0;padding:0;list-style:none;min-height:9rem;align-content:start;
}
[data-vibeui-block="cascader-005"] [data-part="tile"]{
display:flex;flex-direction:column;align-items:flex-start;gap:0.25rem;width:100%;
padding:0.5625rem 0.625rem;border-radius:0.75rem;cursor:pointer;text-align:left;
border:1px solid var(--vibeui-cascader-005-border);
background:var(--vibeui-cascader-005-tile);color:inherit;font:inherit;
transition:border-color .14s ease,background-color .14s ease,transform .14s ease;
}
[data-vibeui-block="cascader-005"] [data-part="tile"]:hover{
border-color:var(--vibeui-cascader-005-accent);transform:translateY(-1px);
}
[data-vibeui-block="cascader-005"] [data-part="tile"]:focus-visible{
outline:2px solid var(--vibeui-cascader-005-accent);outline-offset:2px;
}
[data-vibeui-block="cascader-005"] [data-part="tile"][aria-pressed="true"]{
border-color:var(--vibeui-cascader-005-accent);
background:color-mix(in oklab,var(--vibeui-cascader-005-accent) 12%,transparent);
}
[data-vibeui-block="cascader-005"] [data-part="tile-name"]{
font-size:0.8125rem;font-weight:600;line-height:1.25;
}
[data-vibeui-block="cascader-005"] [data-part="tile-meta"]{
font-size:0.6875rem;color:var(--vibeui-cascader-005-muted);
}
[data-vibeui-block="cascader-005"] [data-part="submit"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
width:100%;padding:0.5625rem 0.75rem;border:0;border-radius:0.75rem;
background:var(--vibeui-cascader-005-accent);color:oklch(1 0 0);
font:inherit;font-size:0.8125rem;font-weight:600;cursor:pointer;
transition:opacity .14s ease;
}
[data-vibeui-block="cascader-005"] [data-part="submit"]:disabled{
opacity:.4;cursor:not-allowed;
}
[data-vibeui-block="cascader-005"] [data-part="submit"]:focus-visible{
outline:2px solid var(--vibeui-cascader-005-accent);outline-offset:2px;
}
[data-vibeui-block="cascader-005"] [data-part="submit"] em{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-style:normal;font-weight:400;opacity:.85;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="cascader-005"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_TREE: Cascader005Node[] = [
  {
    label: "Одежда",
    children: [
      {
        label: "Верхняя",
        children: [
          { label: "Куртки" },
          { label: "Пальто" },
          { label: "Пуховики" },
        ],
      },
      {
        label: "Трикотаж",
        children: [{ label: "Свитеры" }, { label: "Кардиганы" }],
      },
      { label: "Джинсы" },
    ],
  },
  {
    label: "Обувь",
    children: [
      {
        label: "Ботинки",
        children: [{ label: "Зимние" }, { label: "Демисезон" }],
      },
      {
        label: "Кроссовки",
        children: [{ label: "Беговые" }, { label: "Городские" }],
      },
    ],
  },
  {
    label: "Аксессуары",
    children: [
      { label: "Сумки", children: [{ label: "Рюкзаки" }, { label: "Шоперы" }] },
      { label: "Ремни" },
    ],
  },
  { label: "Уход" },
]

function nodesAt(tree: Cascader005Node[], path: string[]) {
  let nodes = tree

  for (const step of path) {
    const found = nodes.find((node) => node.label === step)

    if (!found?.children?.length) {
      return nodes
    }

    nodes = found.children
  }

  return nodes
}

/**
 * Выбор категории товара: хлебные крошки ведут навигацию, уровень открывается плитками.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Cascader005({
  rootLabel = "Все товары",
  submitLabel = "Выбрать категорию",
  tree = DEFAULT_TREE,
  accent,
  className,
  style,
}: Cascader005Props) {
  const [path, setPath] = useState<string[]>(["Одежда"])
  const [leaf, setLeaf] = useState<string | null>(null)
  const nodes = nodesAt(tree, path)
  const trail = [rootLabel, ...path]
  const chosen = leaf ? [...path, leaf] : path

  const palette = {
    ...(accent ? { "--vibeui-cascader-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cascader-005" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="cascader-005"
        className={className}
        style={palette}
      >
        <nav aria-label="Текущий путь по каталогу">
          <ol data-part="crumbs">
            {trail.map((step, index) => (
              <li
                key={step}
                data-part="crumb"
                aria-current={index === trail.length - 1 ? "page" : undefined}
              >
                <button
                  type="button"
                  onClick={() => {
                    setPath(trail.slice(1, index + 1))
                    setLeaf(null)
                  }}
                >
                  {step}
                </button>
                {index < trail.length - 1 ? (
                  <span data-part="sep" aria-hidden="true">
                    /
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </nav>
        <ul data-part="tiles">
          {nodes.map((node) => (
            <li key={node.label}>
              <button
                data-part="tile"
                type="button"
                aria-pressed={leaf === node.label}
                onClick={() => {
                  if (node.children?.length) {
                    setPath([...path, node.label])
                    setLeaf(null)
                    return
                  }

                  setLeaf(node.label)
                }}
              >
                <span data-part="tile-name">{node.label}</span>
                <span data-part="tile-meta">
                  {node.children?.length
                    ? `${node.children.length} подкатегорий`
                    : "конечная категория"}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <button data-part="submit" type="button" disabled={chosen.length === 0}>
          <span>{submitLabel}</span>
          <em aria-live="polite">
            {chosen.length ? chosen.join(" › ") : "ничего не выбрано"}
          </em>
        </button>
      </div>
    </>
  )
}
