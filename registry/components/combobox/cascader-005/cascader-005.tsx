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
  /** aria-подпись навигации по крошкам. */
  trailText?: string
  /** Приписка на плитке с ветками: {count}. */
  branchText?: string
  /** Приписка на плитке-листе. */
  leafText?: string
  /** Чем подписан пустой выбор. */
  emptyText?: string
  /** Пусто — подложки нет, панель лежит прямо на фоне страницы. */
  background?: string
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
--vibeui-cascader-005-bg:transparent;
--vibeui-cascader-005-tile:light-dark(oklch(0.975 0.004 90),oklch(0.27 0.012 90));
--vibeui-cascader-005-fg:light-dark(oklch(0.24 0.014 90),oklch(0.94 0.006 90));
--vibeui-cascader-005-muted:color-mix(in oklab,var(--vibeui-cascader-005-fg) 68%,transparent);
--vibeui-cascader-005-border:light-dark(oklch(0.9 0.008 90),oklch(0.38 0.012 90));
--vibeui-cascader-005-accent:light-dark(oklch(0.29 0 0),oklch(0.903 0 0));
--vibeui-cascader-005-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0 0));
--vibeui-cascader-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cascader-005"]{color-scheme:dark}
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
background:var(--vibeui-cascader-005-accent);color:oklch(from var(--vibeui-cascader-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
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
  trailText = "Текущий путь по каталогу",
  branchText = "{count} подкатегорий",
  leafText = "конечная категория",
  emptyText = "ничего не выбрано",
  background = "",
  accent,
  className,
  style,
}: Cascader005Props) {
  const [path, setPath] = useState<string[]>(() =>
    tree[0]?.children?.length ? [tree[0].label] : [],
  )
  const [leaf, setLeaf] = useState<string | null>(null)
  const nodes = nodesAt(tree, path)
  const trail = [rootLabel, ...path]
  const chosen = leaf ? [...path, leaf] : path

  const palette = {
    ...(accent ? { "--vibeui-cascader-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-cascader-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cascader-005" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="cascader"
        data-vibeui-block="cascader-005"
        className={className}
        style={palette}
      >
        <nav aria-label={trailText}>
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
                    ? branchText.replace(
                        "{count}",
                        String(node.children.length),
                      )
                    : leafText}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <button data-part="submit" type="button" disabled={chosen.length === 0}>
          <span>{submitLabel}</span>
          <em aria-live="polite">
            {chosen.length ? chosen.join(" › ") : emptyText}
          </em>
        </button>
      </div>
    </>
  )
}
