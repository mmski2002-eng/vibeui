"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Cascader004Node = {
  label: string
  note?: string
  children?: Cascader004Node[]
}

export type Cascader004Props = {
  heading?: string
  tree?: Cascader004Node[]
  /** Подпись кнопки возврата. */
  backText?: string
  /** Шаблон подписи шага: {step} и {heading}. */
  stepText?: string
  /** Подпись перед выбранным листом. */
  selectedText?: string
  /** Подпись перед текущим уровнем. */
  currentText?: string
  /** Как назван верхний уровень в строке пути. */
  rootText?: string
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: каскад для телефона — на экране всегда ровно один уровень.
// Колонки рядом на 360 px не помещаются, поэтому уровни идут шаг за шагом:
// шапка со стрелкой «назад» и названием текущего уровня, под ней крупные
// строки в один столбец. Панель едет влево при углублении и вправо при
// возврате — направление движения объясняет, куда пользователь попал.
const STYLES = `
:where([data-vibeui-block="cascader-004"]){
--vibeui-cascader-004-bg:transparent;
--vibeui-cascader-004-surface:light-dark(oklch(0.985 0.003 250),oklch(0.28 0.012 250));
--vibeui-cascader-004-fg:light-dark(oklch(0.22 0.014 250),oklch(0.94 0.006 250));
--vibeui-cascader-004-muted:light-dark(oklch(0.55 0.012 250),oklch(0.71 0.011 250));
--vibeui-cascader-004-border:light-dark(oklch(0.91 0.006 250),oklch(0.38 0.011 250));
--vibeui-cascader-004-accent:light-dark(oklch(0.58 0.15 190),oklch(0.78 0.13 190));
--vibeui-cascader-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="cascader-004"]{
display:flex;flex-direction:column;
width:100%;max-width:19rem;box-sizing:border-box;overflow:hidden;
background:var(--vibeui-cascader-004-bg);color:var(--vibeui-cascader-004-fg);
border:1px solid var(--vibeui-cascader-004-border);border-radius:1.125rem;
font-family:var(--vibeui-cascader-004-font);
box-shadow:0 20px 44px -34px oklch(0.2 0.03 250 / 65%);
}
[data-vibeui-block="cascader-004"] *{box-sizing:border-box}
[data-vibeui-block="cascader-004"] [data-part="bar"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.625rem 0.75rem;border-bottom:1px solid var(--vibeui-cascader-004-border);
}
[data-vibeui-block="cascader-004"] [data-part="back"]{
flex:0 0 auto;display:grid;place-items:center;width:1.75rem;height:1.75rem;
border:1px solid var(--vibeui-cascader-004-border);border-radius:0.625rem;
background:var(--vibeui-cascader-004-surface);color:var(--vibeui-cascader-004-fg);
cursor:pointer;transition:border-color .14s ease,opacity .14s ease;
}
[data-vibeui-block="cascader-004"] [data-part="back"]:hover:not(:disabled){
border-color:var(--vibeui-cascader-004-accent);
}
[data-vibeui-block="cascader-004"] [data-part="back"]:disabled{opacity:.35;cursor:not-allowed}
[data-vibeui-block="cascader-004"] [data-part="back"]:focus-visible{
outline:2px solid var(--vibeui-cascader-004-accent);outline-offset:2px;
}
[data-vibeui-block="cascader-004"] [data-part="back"] i{
width:0.4375rem;height:0.4375rem;
border-left:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg) translate(0.0625rem,-0.0625rem);
}
[data-vibeui-block="cascader-004"] [data-part="titles"]{
flex:1 1 auto;min-width:0;display:flex;flex-direction:column;
}
[data-vibeui-block="cascader-004"] [data-part="title"]{
margin:0;font-size:0.875rem;font-weight:650;letter-spacing:-0.01em;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="cascader-004"] [data-part="step"]{
margin:0;font-size:0.6875rem;color:var(--vibeui-cascader-004-muted);
}
[data-vibeui-block="cascader-004"] [data-part="viewport"]{overflow:hidden}
[data-vibeui-block="cascader-004"] [data-part="list"]{
display:flex;flex-direction:column;margin:0;padding:0.375rem;list-style:none;
min-height:9.5rem;
animation:vibeui-cascader-004-forward .2s ease both;
}
[data-vibeui-block="cascader-004"] [data-part="list"][data-direction="back"]{
animation-name:vibeui-cascader-004-back;
}
@keyframes vibeui-cascader-004-forward{
from{opacity:0;transform:translateX(1.25rem)}
to{opacity:1;transform:none}
}
@keyframes vibeui-cascader-004-back{
from{opacity:0;transform:translateX(-1.25rem)}
to{opacity:1;transform:none}
}
[data-vibeui-block="cascader-004"] [data-part="row"]{
display:flex;align-items:center;gap:0.625rem;width:100%;
padding:0.5625rem 0.625rem;border:0;border-radius:0.75rem;
background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;
transition:background-color .14s ease;
}
[data-vibeui-block="cascader-004"] [data-part="row"]:hover{
background:color-mix(in oklab,var(--vibeui-cascader-004-accent) 10%,transparent);
}
[data-vibeui-block="cascader-004"] [data-part="row"]:focus-visible{
outline:2px solid var(--vibeui-cascader-004-accent);outline-offset:-2px;
}
[data-vibeui-block="cascader-004"] [data-part="row"][aria-current="true"] [data-part="name"]{
color:var(--vibeui-cascader-004-accent);font-weight:650;
}
[data-vibeui-block="cascader-004"] [data-part="texts"]{flex:1 1 auto;min-width:0}
[data-vibeui-block="cascader-004"] [data-part="name"]{
display:block;font-size:0.875rem;line-height:1.3;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="cascader-004"] [data-part="note"]{
display:block;font-size:0.6875rem;line-height:1.3;color:var(--vibeui-cascader-004-muted);
}
[data-vibeui-block="cascader-004"] [data-part="next"]{
flex:0 0 auto;width:0.375rem;height:0.375rem;
border-right:1.5px solid var(--vibeui-cascader-004-muted);
border-top:1.5px solid var(--vibeui-cascader-004-muted);
transform:rotate(45deg);
}
[data-vibeui-block="cascader-004"] [data-part="foot"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.625rem 0.75rem;border-top:1px solid var(--vibeui-cascader-004-border);
background:color-mix(in oklab,var(--vibeui-cascader-004-accent) 6%,transparent);
}
[data-vibeui-block="cascader-004"] [data-part="crumbs"]{
margin:0;flex:1 1 auto;min-width:0;font-size:0.75rem;line-height:1.35;
color:var(--vibeui-cascader-004-muted);
}
[data-vibeui-block="cascader-004"] [data-part="crumbs"] b{
color:var(--vibeui-cascader-004-fg);font-weight:650;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="cascader-004"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_TREE: Cascader004Node[] = [
  {
    label: "Россия",
    note: "85 регионов",
    children: [
      {
        label: "Приморский край",
        note: "12 городов",
        children: [
          { label: "Владивосток", note: "600 тыс. жителей" },
          { label: "Находка", note: "140 тыс. жителей" },
          { label: "Уссурийск", note: "180 тыс. жителей" },
        ],
      },
      {
        label: "Татарстан",
        note: "22 города",
        children: [
          { label: "Казань", note: "1,3 млн жителей" },
          { label: "Челны", note: "530 тыс. жителей" },
        ],
      },
    ],
  },
  {
    label: "Казахстан",
    note: "17 областей",
    children: [
      {
        label: "Алматинская область",
        note: "9 городов",
        children: [{ label: "Алматы" }, { label: "Талдыкорган" }],
      },
      {
        label: "Акмолинская область",
        note: "6 городов",
        children: [{ label: "Астана" }, { label: "Кокшетау" }],
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

function nodesAt(tree: Cascader004Node[], path: string[]) {
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
 * Каскадный выбор шаг за шагом: один уровень на экране и кнопка «назад».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Cascader004({
  heading = "Куда доставить",
  tree = DEFAULT_TREE,
  backText = "Вернуться на уровень выше",
  stepText = "Шаг {step} · {heading}",
  selectedText = "Выбрано:",
  currentText = "Сейчас:",
  rootText = "верхний уровень",
  background = "",
  accent,
  className,
  style,
}: Cascader004Props) {
  const [path, setPath] = useState<string[]>(() =>
    tree[0]?.children?.length ? [tree[0].label] : [],
  )
  const [direction, setDirection] = useState<"forward" | "back">("forward")
  const [picked, setPicked] = useState<string[]>([])
  const nodes = nodesAt(tree, path)
  const title = path.length ? path[path.length - 1] : heading

  const open = (node: Cascader004Node) => {
    if (node.children?.length) {
      setDirection("forward")
      setPath([...path, node.label])
      setPicked([])
      return
    }

    setPicked([...path, node.label])
  }

  const goBack = () => {
    setDirection("back")
    setPath(path.slice(0, -1))
    setPicked([])
  }

  const palette = {
    ...(accent ? { "--vibeui-cascader-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-cascader-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cascader-004" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="cascader-004"
        className={className}
        style={palette}
      >
        <header data-part="bar">
          <button
            data-part="back"
            type="button"
            onClick={goBack}
            disabled={path.length === 0}
            aria-label={backText}
          >
            <i aria-hidden="true" />
          </button>
          <span data-part="titles">
            <strong data-part="title">{title}</strong>
            <small data-part="step">
              {stepText
                .replace("{step}", String(path.length + 1))
                .replace("{heading}", heading)}
            </small>
          </span>
        </header>
        <div data-part="viewport">
          <ul key={path.join("/")} data-part="list" data-direction={direction}>
            {nodes.map((node) => (
              <li key={node.label}>
                <button
                  data-part="row"
                  type="button"
                  aria-current={
                    picked[picked.length - 1] === node.label
                      ? "true"
                      : undefined
                  }
                  onClick={() => open(node)}
                >
                  <span data-part="texts">
                    <span data-part="name">{node.label}</span>
                    {node.note ? (
                      <span data-part="note">{node.note}</span>
                    ) : null}
                  </span>
                  {node.children?.length ? (
                    <i data-part="next" aria-hidden="true" />
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <footer data-part="foot">
          <p data-part="crumbs" aria-live="polite">
            {picked.length ? (
              <>
                {selectedText} <b>{picked.join(" → ")}</b>
              </>
            ) : (
              <>
                {currentText} <b>{path.length ? path.join(" → ") : rootText}</b>
              </>
            )}
          </p>
        </footer>
      </div>
    </>
  )
}
