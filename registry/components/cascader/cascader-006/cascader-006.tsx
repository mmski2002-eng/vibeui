"use client"

import { useId, useMemo, useState } from "react"
import type { CSSProperties } from "react"

export type Cascader006Node = {
  label: string
  children?: Cascader006Node[]
}

export type Cascader006Props = {
  label?: string
  placeholder?: string
  tree?: Cascader006Node[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: в глубоком дереве быстрее найти, чем пройти. Поиск идёт
// сразу по всем уровням, а в результате показывается полный путь до узла —
// без него два одинаковых «Общие» из разных веток неразличимы. Совпавшая
// часть подсвечивается, чтобы было видно, почему строка попала в выдачу.
// Пустой запрос показывает верхний уровень: пустая панель выглядит поломкой.
const STYLES = `
:where([data-vibeui-block="cascader-006"]){
--vibeui-cascader-006-bg:oklch(1 0 0);
--vibeui-cascader-006-field:oklch(0.975 0.003 265);
--vibeui-cascader-006-fg:oklch(0.23 0.014 265);
--vibeui-cascader-006-muted:oklch(0.55 0.012 265);
--vibeui-cascader-006-border:oklch(0.9 0.006 265);
--vibeui-cascader-006-accent:oklch(0.55 0.19 150);
--vibeui-cascader-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="cascader-006"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-cascader-006-bg);color:var(--vibeui-cascader-006-fg);
border:1px solid var(--vibeui-cascader-006-border);border-radius:1rem;
font-family:var(--vibeui-cascader-006-font);
box-shadow:0 18px 40px -32px oklch(0.2 0.03 265 / 55%);
}
[data-vibeui-block="cascader-006"] *{box-sizing:border-box}
[data-vibeui-block="cascader-006"] [data-part="label"]{
font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="cascader-006"] [data-part="field"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.4375rem 0.625rem;border-radius:0.75rem;
border:1px solid var(--vibeui-cascader-006-border);
background:var(--vibeui-cascader-006-field);
transition:border-color .14s ease;
}
[data-vibeui-block="cascader-006"] [data-part="field"]:focus-within{
border-color:var(--vibeui-cascader-006-accent);
}
[data-vibeui-block="cascader-006"] [data-part="glass"]{
flex:0 0 auto;width:0.75rem;height:0.75rem;border-radius:50%;
border:1.5px solid var(--vibeui-cascader-006-muted);position:relative;
}
[data-vibeui-block="cascader-006"] [data-part="glass"]::after{
content:"";position:absolute;right:-0.25rem;bottom:-0.1875rem;
width:0.3125rem;height:1.5px;border-radius:1px;
background:var(--vibeui-cascader-006-muted);transform:rotate(45deg);
}
[data-vibeui-block="cascader-006"] input{
flex:1 1 auto;min-width:0;border:0;background:transparent;color:inherit;
font:inherit;font-size:0.8125rem;outline:none;
}
[data-vibeui-block="cascader-006"] [data-part="count"]{
flex:0 0 auto;font-size:0.6875rem;color:var(--vibeui-cascader-006-muted);
}
[data-vibeui-block="cascader-006"] [data-part="results"]{
display:flex;flex-direction:column;gap:0.125rem;margin:0;padding:0;list-style:none;
height:11rem;overflow:auto;overscroll-behavior:contain;
}
[data-vibeui-block="cascader-006"] [data-part="hit"]{
display:flex;flex-direction:column;gap:0.125rem;width:100%;
padding:0.4375rem 0.5rem;border:0;border-radius:0.625rem;
background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;
transition:background-color .14s ease;
}
[data-vibeui-block="cascader-006"] [data-part="hit"]:hover{
background:color-mix(in oklab,var(--vibeui-cascader-006-accent) 10%,transparent);
}
[data-vibeui-block="cascader-006"] [data-part="hit"]:focus-visible{
outline:2px solid var(--vibeui-cascader-006-accent);outline-offset:-2px;
}
[data-vibeui-block="cascader-006"] [data-part="hit-name"]{
font-size:0.8125rem;font-weight:600;line-height:1.25;
}
[data-vibeui-block="cascader-006"] [data-part="hit-name"] mark{
background:color-mix(in oklab,var(--vibeui-cascader-006-accent) 28%,transparent);
color:inherit;border-radius:0.1875rem;padding:0 0.0625rem;
}
[data-vibeui-block="cascader-006"] [data-part="hit-path"]{
font-size:0.6875rem;line-height:1.3;color:var(--vibeui-cascader-006-muted);
}
[data-vibeui-block="cascader-006"] [data-part="empty"]{
margin:0;padding:1.5rem 0.5rem;text-align:center;
font-size:0.75rem;line-height:1.4;color:var(--vibeui-cascader-006-muted);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="cascader-006"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_TREE: Cascader006Node[] = [
  {
    label: "Продукт",
    children: [
      {
        label: "Онбординг",
        children: [
          { label: "Приветственный экран" },
          { label: "Импорт данных" },
          { label: "Общие настройки" },
        ],
      },
      {
        label: "Уведомления",
        children: [{ label: "Почта" }, { label: "Пуш-сообщения" }],
      },
    ],
  },
  {
    label: "Инфраструктура",
    children: [
      {
        label: "Хранилище",
        children: [{ label: "Резервные копии" }, { label: "Общие настройки" }],
      },
      {
        label: "Сеть",
        children: [{ label: "Домены" }, { label: "Сертификаты" }],
      },
    ],
  },
  {
    label: "Поддержка",
    children: [
      {
        label: "Обращения",
        children: [{ label: "Очередь" }, { label: "Шаблоны ответов" }],
      },
    ],
  },
]

type Hit = { label: string; path: string[] }

function flatten(nodes: Cascader006Node[], trail: string[] = []): Hit[] {
  return nodes.flatMap((node) =>
    node.children?.length
      ? flatten(node.children, [...trail, node.label])
      : [{ label: node.label, path: trail }],
  )
}

function split(label: string, query: string) {
  const at = label.toLowerCase().indexOf(query.toLowerCase())

  if (!query || at < 0) {
    return [label, "", ""] as const
  }

  return [
    label.slice(0, at),
    label.slice(at, at + query.length),
    label.slice(at + query.length),
  ] as const
}

/**
 * Каскад с поиском по всему дереву: результат несёт полный путь до узла.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Cascader006({
  label = "Раздел настроек",
  placeholder = "Искать по всем уровням",
  tree = DEFAULT_TREE,
  accent,
  className,
  style,
}: Cascader006Props) {
  const id = useId()
  const [query, setQuery] = useState("общие")
  const [chosen, setChosen] = useState<string | null>(null)
  const all = useMemo(() => flatten(tree), [tree])
  const trimmed = query.trim()

  const hits = trimmed
    ? all.filter((hit) =>
        [...hit.path, hit.label]
          .join(" ")
          .toLowerCase()
          .includes(trimmed.toLowerCase()),
      )
    : all

  const palette = {
    ...(accent ? { "--vibeui-cascader-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cascader-006" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="cascader-006"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={id}>
          {label}
        </label>
        <div data-part="field">
          <i data-part="glass" aria-hidden="true" />
          <input
            id={id}
            type="search"
            value={query}
            placeholder={placeholder}
            onChange={(event) => setQuery(event.target.value)}
          />
          <span data-part="count" aria-live="polite">
            {hits.length}
          </span>
        </div>
        {hits.length ? (
          <ul data-part="results">
            {hits.map((hit) => {
              const [before, match, after] = split(hit.label, trimmed)

              return (
                <li key={[...hit.path, hit.label].join("/")}>
                  <button
                    data-part="hit"
                    type="button"
                    aria-current={
                      chosen === [...hit.path, hit.label].join(" › ")
                        ? "true"
                        : undefined
                    }
                    onClick={() =>
                      setChosen([...hit.path, hit.label].join(" › "))
                    }
                  >
                    <span data-part="hit-name">
                      {before}
                      {match ? <mark>{match}</mark> : null}
                      {after}
                    </span>
                    <span data-part="hit-path">{hit.path.join(" › ")}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <p data-part="empty">
            Ничего не найдено. Попробуйте название родительского раздела — поиск
            смотрит и на путь тоже.
          </p>
        )}
      </div>
    </>
  )
}
