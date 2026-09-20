"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Cascader002Node = {
  label: string
  children?: Cascader002Node[]
}

export type Cascader002Props = {
  heading?: string
  tree?: Cascader002Node[]
  /** Шаблон aria-подписи колонки: {level}. */
  levelText?: string
  /** Подсказка в пустом слоте. */
  emptyText?: string
  /** Подпись перед выбранным путём. */
  pathText?: string
  /** Чем подписан пустой путь. */
  nothingText?: string
  /** Подпись кнопки сброса. */
  resetText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: все уровни дерева видны одновременно — три колонки рядом,
// как в файловом менеджере. Список не перерисовывается на месте, поэтому
// глазами видно, откуда пришёл выбор: родитель остаётся подсвеченным слева.
// Пустые колонки не исчезают, а держат место подсказкой: если колонка
// пропадает, панель прыгает по ширине на каждый клик.
const STYLES = `
:where([data-vibeui-block="cascader-002"]){
--vibeui-cascader-002-bg:transparent;
--vibeui-cascader-002-panel:light-dark(oklch(0.98 0 265),oklch(0.27 0 265));
--vibeui-cascader-002-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-cascader-002-muted:color-mix(in oklab,var(--vibeui-cascader-002-fg) 68%,transparent);
--vibeui-cascader-002-border:light-dark(oklch(0.9 0 265),oklch(0.38 0 265));
--vibeui-cascader-002-accent:light-dark(oklch(0.287 0 0),oklch(0.905 0 0));
--vibeui-cascader-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cascader-002"]{color-scheme:dark}
[data-vibeui-block="cascader-002"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:29rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-cascader-002-bg);color:var(--vibeui-cascader-002-fg);
border:1px solid var(--vibeui-cascader-002-border);border-radius:1rem;
font-family:var(--vibeui-cascader-002-font);
box-shadow:0 18px 40px -32px oklch(0.2 0 265 / 60%);
}
[data-vibeui-block="cascader-002"] *{box-sizing:border-box}
[data-vibeui-block="cascader-002"] [data-part="heading"]{
margin:0;font-size:0.8125rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="cascader-002"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.375rem;
height:11.5rem;
}
[data-vibeui-block="cascader-002"] [data-part="column"]{
display:flex;flex-direction:column;gap:0.125rem;margin:0;padding:0.25rem;
list-style:none;overflow:auto;overscroll-behavior:contain;
background:var(--vibeui-cascader-002-panel);
border:1px solid var(--vibeui-cascader-002-border);border-radius:0.75rem;
}
[data-vibeui-block="cascader-002"] [data-part="empty"]{
display:grid;place-items:center;padding:0.5rem;text-align:center;
font-size:0.6875rem;line-height:1.35;color:var(--vibeui-cascader-002-muted);
border:1px dashed var(--vibeui-cascader-002-border);border-radius:0.75rem;
}
[data-vibeui-block="cascader-002"] [data-part="option"]{
display:flex;align-items:center;gap:0.375rem;width:100%;
padding:0.3125rem 0.4375rem;border:0;border-radius:0.5rem;
background:transparent;color:inherit;font:inherit;font-size:0.8125rem;
text-align:left;cursor:pointer;
transition:background-color .14s ease,color .14s ease;
}
[data-vibeui-block="cascader-002"] [data-part="option"] span{
flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="cascader-002"] [data-part="option"]:hover{
background:color-mix(in oklab,var(--vibeui-cascader-002-accent) 10%,transparent);
}
[data-vibeui-block="cascader-002"] [data-part="option"]:focus-visible{
outline:2px solid var(--vibeui-cascader-002-accent);outline-offset:-2px;
}
[data-vibeui-block="cascader-002"] [data-part="option"][aria-current="true"]{
background:color-mix(in oklab,var(--vibeui-cascader-002-accent) 16%,transparent);
color:var(--vibeui-cascader-002-accent);font-weight:600;
}
[data-vibeui-block="cascader-002"] [data-part="arrow"]{
flex:0 0 auto;width:0.3125rem;height:0.3125rem;
border-right:1.5px solid currentColor;border-top:1.5px solid currentColor;
transform:rotate(45deg);opacity:.55;
}
[data-vibeui-block="cascader-002"] [data-part="footer"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding-top:0.5rem;border-top:1px solid var(--vibeui-cascader-002-border);
}
[data-vibeui-block="cascader-002"] [data-part="path"]{
margin:0;min-width:0;font-size:0.75rem;line-height:1.35;
color:var(--vibeui-cascader-002-muted);
}
[data-vibeui-block="cascader-002"] [data-part="path"] b{
color:var(--vibeui-cascader-002-fg);font-weight:650;
}
[data-vibeui-block="cascader-002"] [data-part="reset"]{
flex:0 0 auto;padding:0.3125rem 0.625rem;border-radius:0.5rem;cursor:pointer;
border:1px solid var(--vibeui-cascader-002-border);
background:var(--vibeui-cascader-002-panel);color:var(--vibeui-cascader-002-muted);
font:inherit;font-size:0.75rem;
transition:color .14s ease,border-color .14s ease;
}
[data-vibeui-block="cascader-002"] [data-part="reset"]:hover{
color:var(--vibeui-cascader-002-fg);border-color:var(--vibeui-cascader-002-accent);
}
[data-vibeui-block="cascader-002"] [data-part="reset"]:focus-visible{
outline:2px solid var(--vibeui-cascader-002-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="cascader-002"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_TREE: Cascader002Node[] = [
  {
    label: "Электроника",
    children: [
      {
        label: "Ноутбуки",
        children: [
          { label: "До 14 дюймов" },
          { label: "15–16 дюймов" },
          { label: "Игровые" },
        ],
      },
      {
        label: "Смартфоны",
        children: [{ label: "Флагманы" }, { label: "Бюджетные" }],
      },
      {
        label: "Наушники",
        children: [{ label: "Полноразмерные" }, { label: "Вкладыши" }],
      },
    ],
  },
  {
    label: "Дом и сад",
    children: [
      {
        label: "Освещение",
        children: [{ label: "Люстры" }, { label: "Торшеры" }],
      },
      { label: "Текстиль", children: [{ label: "Шторы" }, { label: "Пледы" }] },
    ],
  },
  {
    label: "Инструменты",
    children: [
      {
        label: "Ручной инструмент",
        children: [{ label: "Отвёртки" }, { label: "Ключи" }],
      },
      {
        label: "Электроинструмент",
        children: [{ label: "Дрели" }, { label: "Шлифмашины" }],
      },
    ],
  },
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

/** Начальный путь считается от дерева, а не зашит подписями. */
function initialPath(tree: Cascader002Node[]): string[] {
  const first = tree[0]

  if (!first) {
    return []
  }

  const second = first.children?.[0]

  return second ? [first.label, second.label] : [first.label]
}

function columnsFor(tree: Cascader002Node[], path: string[]) {
  const columns: Cascader002Node[][] = [tree]
  let nodes = tree

  for (const step of path) {
    const found = nodes.find((node) => node.label === step)

    if (!found?.children?.length) {
      break
    }

    columns.push(found.children)
    nodes = found.children
  }

  return columns
}

/**
 * Каскадный выбор колонками: все уровни дерева видны одновременно.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Cascader002({
  heading = "Раздел каталога",
  tree = DEFAULT_TREE,
  levelText = "Уровень {level}",
  emptyText = "Выберите слева",
  pathText = "Путь:",
  nothingText = "не выбран",
  resetText = "Сбросить",
  background = "",
  accent,
  className,
  style,
}: Cascader002Props) {
  const [path, setPath] = useState<string[]>(() => initialPath(tree))
  const columns = columnsFor(tree, path)
  const slots = [columns[0], columns[1], columns[2]]

  const palette = {
    ...(accent ? { "--vibeui-cascader-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-cascader-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cascader-002" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="cascader"
        data-vibeui-block="cascader-002"
        className={className}
        style={palette}
      >
        <p data-part="heading">{heading}</p>
        <div data-part="grid">
          {slots.map((nodes, level) =>
            nodes ? (
              <ul
                key={level}
                data-part="column"
                aria-label={levelText.replace("{level}", String(level + 1))}
              >
                {nodes.map((node) => (
                  <li key={node.label}>
                    <button
                      data-part="option"
                      type="button"
                      aria-current={
                        path[level] === node.label ? "true" : undefined
                      }
                      onClick={() =>
                        setPath([...path.slice(0, level), node.label])
                      }
                    >
                      <span>{node.label}</span>
                      {node.children?.length ? (
                        <i data-part="arrow" aria-hidden="true" />
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p key={level} data-part="empty">
                {emptyText}
              </p>
            ),
          )}
        </div>
        <div data-part="footer">
          <p data-part="path" aria-live="polite">
            {pathText} <b>{path.length ? path.join(" / ") : nothingText}</b>
          </p>
          <button
            data-part="reset"
            type="button"
            onClick={() => setPath([])}
            disabled={path.length === 0}
          >
            {resetText}
          </button>
        </div>
      </div>
    </>
  )
}
