"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Cascader011Node = {
  label: string
  count: number
  children?: Cascader011Node[]
}

export type Cascader011Props = {
  heading?: string
  unit?: string
  tree?: Cascader011Node[]
  /** Как назван верхний уровень в строке пути. */
  rootText?: string
  /** Приписка под суммой уровня: {unit}. */
  sumText?: string
  /** Подпись кнопки возврата. */
  upText?: string
  /** Приписка у строки без вложенности. */
  leafText?: string
  /** Шаблон aria-подписи строки: {label}, {count} и {unit}. */
  rowText?: string
  /** Локаль форматирования чисел. */
  locale?: string
  /** Пусто — подложки нет, панель лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: каскад, в котором уровень выбирают по числам. Рядом с
// названием стоит счётчик, а под ним — полоса доли от суммы уровня: так
// видно, что «Прочее» с четырьмя записями нет смысла раскрывать. Ширина
// полосы считается от суммы текущего уровня, а не от глобального максимума,
// иначе на глубине все полосы схлопываются в ниточки.
const STYLES = `
:where([data-vibeui-block="cascader-011"]){
--vibeui-cascader-011-bg:transparent;
--vibeui-cascader-011-fg:light-dark(oklch(0.23 0.014 240),oklch(0.94 0.006 240));
--vibeui-cascader-011-muted:light-dark(oklch(0.55 0.012 240),oklch(0.71 0.011 240));
--vibeui-cascader-011-border:light-dark(oklch(0.9 0.006 240),oklch(0.38 0.011 240));
--vibeui-cascader-011-track:light-dark(oklch(0.94 0.005 240),oklch(0.32 0.01 240));
--vibeui-cascader-011-accent:light-dark(oklch(0.55 0.16 215),oklch(0.76 0.13 215));
--vibeui-cascader-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="cascader-011"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-cascader-011-bg);color:var(--vibeui-cascader-011-fg);
border:1px solid var(--vibeui-cascader-011-border);border-radius:1rem;
font-family:var(--vibeui-cascader-011-font);
box-shadow:0 18px 40px -32px oklch(0.2 0.03 240 / 55%);
}
[data-vibeui-block="cascader-011"] *{box-sizing:border-box}
[data-vibeui-block="cascader-011"] [data-part="head"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="cascader-011"] [data-part="titles"]{min-width:0}
[data-vibeui-block="cascader-011"] [data-part="heading"]{
display:block;font-size:0.8125rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="cascader-011"] [data-part="trail"]{
display:block;font-size:0.6875rem;color:var(--vibeui-cascader-011-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="cascader-011"] [data-part="sum"]{
flex:0 0 auto;text-align:right;
}
[data-vibeui-block="cascader-011"] [data-part="sum"] b{
display:block;font-size:1.125rem;font-weight:700;line-height:1;
letter-spacing:-0.02em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="cascader-011"] [data-part="sum"] small{
font-size:0.625rem;color:var(--vibeui-cascader-011-muted);
}
[data-vibeui-block="cascader-011"] [data-part="up"]{
align-self:flex-start;padding:0.25rem 0.5rem;border-radius:0.5rem;cursor:pointer;
border:1px solid var(--vibeui-cascader-011-border);
background:transparent;color:var(--vibeui-cascader-011-muted);
font:inherit;font-size:0.6875rem;
transition:color .14s ease,border-color .14s ease;
}
[data-vibeui-block="cascader-011"] [data-part="up"]:hover:not(:disabled){
color:var(--vibeui-cascader-011-fg);border-color:var(--vibeui-cascader-011-accent);
}
[data-vibeui-block="cascader-011"] [data-part="up"]:disabled{opacity:.4;cursor:not-allowed}
[data-vibeui-block="cascader-011"] [data-part="up"]:focus-visible{
outline:2px solid var(--vibeui-cascader-011-accent);outline-offset:2px;
}
[data-vibeui-block="cascader-011"] [data-part="rows"]{
display:flex;flex-direction:column;gap:0.125rem;margin:0;padding:0;list-style:none;
min-height:9.5rem;
}
[data-vibeui-block="cascader-011"] [data-part="row"]{
display:grid;grid-template-columns:1fr auto;gap:0.125rem 0.5rem;width:100%;
padding:0.4375rem 0.5rem;border:0;border-radius:0.625rem;
background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;
transition:background-color .14s ease;
}
[data-vibeui-block="cascader-011"] [data-part="row"]:hover{
background:color-mix(in oklab,var(--vibeui-cascader-011-accent) 9%,transparent);
}
[data-vibeui-block="cascader-011"] [data-part="row"]:focus-visible{
outline:2px solid var(--vibeui-cascader-011-accent);outline-offset:-2px;
}
[data-vibeui-block="cascader-011"] [data-part="name"]{
min-width:0;font-size:0.8125rem;font-weight:600;line-height:1.25;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="cascader-011"] [data-part="value"]{
font-size:0.8125rem;font-variant-numeric:tabular-nums;
color:var(--vibeui-cascader-011-muted);
}
[data-vibeui-block="cascader-011"] [data-part="bar"]{
grid-column:1 / -1;height:0.25rem;border-radius:999px;
background:var(--vibeui-cascader-011-track);overflow:hidden;
}
[data-vibeui-block="cascader-011"] [data-part="fill"]{
display:block;height:100%;border-radius:999px;
width:var(--vibeui-cascader-011-share,0%);
background:var(--vibeui-cascader-011-accent);
transition:width .2s ease;
}
[data-vibeui-block="cascader-011"] [data-part="leafmark"]{
grid-column:1 / -1;font-size:0.625rem;color:var(--vibeui-cascader-011-muted);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="cascader-011"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_TREE: Cascader011Node[] = [
  {
    label: "Обращения клиентов",
    count: 1840,
    children: [
      {
        label: "Оплата и счета",
        count: 820,
        children: [
          { label: "Не прошёл платёж", count: 410 },
          { label: "Возврат средств", count: 260 },
          { label: "Смена реквизитов", count: 150 },
        ],
      },
      {
        label: "Доступ в аккаунт",
        count: 640,
        children: [
          { label: "Забыт пароль", count: 380 },
          { label: "Двухфакторная проверка", count: 260 },
        ],
      },
      { label: "Прочее", count: 380 },
    ],
  },
  {
    label: "Заявки партнёров",
    count: 470,
    children: [
      { label: "Подключение", count: 300 },
      { label: "Отчётность", count: 170 },
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

function nodesAt(tree: Cascader011Node[], path: string[]) {
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
 * Каскад со счётчиками: на каждом уровне видно число записей и долю от уровня.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Cascader011({
  heading = "Разбор обращений",
  unit = "обращений",
  tree = DEFAULT_TREE,
  rootText = "все источники",
  sumText = "{unit} на уровне",
  upText = "← На уровень выше",
  leafText = "последний уровень",
  rowText = "{label}: {count} {unit}",
  locale = "ru-RU",
  background = "",
  accent,
  className,
  style,
}: Cascader011Props) {
  const [path, setPath] = useState<string[]>(() =>
    tree[0]?.children?.length ? [tree[0].label] : [],
  )
  const nodes = nodesAt(tree, path)
  const total = nodes.reduce((sum, node) => sum + node.count, 0)

  const palette = {
    ...(accent ? { "--vibeui-cascader-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-cascader-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cascader-011" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="cascader-011"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span data-part="titles">
            <strong data-part="heading">{heading}</strong>
            <span data-part="trail">
              {path.length ? path.join(" › ") : rootText}
            </span>
          </span>
          <span data-part="sum" aria-live="polite">
            <b>{total.toLocaleString(locale)}</b>
            <small>{sumText.replace("{unit}", unit)}</small>
          </span>
        </div>
        <button
          data-part="up"
          type="button"
          onClick={() => setPath(path.slice(0, -1))}
          disabled={path.length === 0}
        >
          {upText}
        </button>
        <ul data-part="rows">
          {nodes.map((node) => (
            <li key={node.label}>
              <button
                data-part="row"
                type="button"
                onClick={() =>
                  node.children?.length ? setPath([...path, node.label]) : null
                }
                aria-label={rowText
                  .replace("{label}", node.label)
                  .replace("{count}", String(node.count))
                  .replace("{unit}", unit)}
              >
                <span data-part="name">{node.label}</span>
                <span data-part="value">
                  {node.count.toLocaleString(locale)}
                </span>
                <span data-part="bar">
                  <span
                    data-part="fill"
                    style={
                      {
                        "--vibeui-cascader-011-share": `${total ? Math.round((node.count / total) * 100) : 0}%`,
                      } as CSSProperties
                    }
                  />
                </span>
                {node.children?.length ? null : (
                  <span data-part="leafmark">{leafText}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
