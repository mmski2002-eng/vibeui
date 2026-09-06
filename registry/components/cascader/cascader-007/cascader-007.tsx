"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Cascader007Group = {
  label: string
  children: string[]
}

export type Cascader007Props = {
  heading?: string
  groups?: Cascader007Group[]
  /** Счётчик в шапке: {count}. */
  totalText?: string
  /** Что показать, когда не выбрано ничего. */
  emptyText?: string
  /** Пусто — подложки нет, панель лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: каскад с множественным выбором. Галочка на родителе
// включает всю ветку, снятие — выключает; частичный выбор показан третьим
// состоянием (indeterminate), иначе половинчатая ветка выглядит как
// невыбранная и её отмечают повторно. Итог собран чипами внизу: по дереву
// с прокруткой нельзя понять, сколько всего набрано.
const STYLES = `
:where([data-vibeui-block="cascader-007"]){
--vibeui-cascader-007-bg:transparent;
--vibeui-cascader-007-fg:light-dark(oklch(0.23 0 275),oklch(0.94 0 275));
--vibeui-cascader-007-muted:color-mix(in oklab,var(--vibeui-cascader-007-fg) 68%,transparent);
--vibeui-cascader-007-border:light-dark(oklch(0.9 0 275),oklch(0.38 0 275));
--vibeui-cascader-007-accent:light-dark(oklch(0.53 0.2 39.8),oklch(0.74 0.16 39.8));
--vibeui-cascader-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cascader-007"]{color-scheme:dark}
[data-vibeui-block="cascader-007"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-cascader-007-bg);color:var(--vibeui-cascader-007-fg);
border:1px solid var(--vibeui-cascader-007-border);border-radius:1rem;
font-family:var(--vibeui-cascader-007-font);
box-shadow:0 18px 40px -32px oklch(0.2 0 275 / 55%);
}
[data-vibeui-block="cascader-007"] *{box-sizing:border-box}
[data-vibeui-block="cascader-007"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="cascader-007"] [data-part="heading"]{
margin:0;font-size:0.8125rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="cascader-007"] [data-part="total"]{
font-size:0.6875rem;color:var(--vibeui-cascader-007-muted);
}
[data-vibeui-block="cascader-007"] [data-part="tree"]{
display:flex;flex-direction:column;gap:0.25rem;margin:0;padding:0;list-style:none;
max-height:12rem;overflow:auto;overscroll-behavior:contain;
}
[data-vibeui-block="cascader-007"] [data-part="branch"]{
display:flex;flex-direction:column;gap:0.125rem;margin:0;padding:0;list-style:none;
padding-left:1.0625rem;border-left:1px solid var(--vibeui-cascader-007-border);
margin-left:0.5rem;
}
[data-vibeui-block="cascader-007"] [data-part="row"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.25rem 0.375rem;border-radius:0.5rem;cursor:pointer;
transition:background-color .14s ease;
}
[data-vibeui-block="cascader-007"] [data-part="row"]:hover{
background:color-mix(in oklab,var(--vibeui-cascader-007-accent) 8%,transparent);
}
[data-vibeui-block="cascader-007"] [data-part="row"]:has(input:focus-visible){
outline:2px solid var(--vibeui-cascader-007-accent);outline-offset:-2px;
}
[data-vibeui-block="cascader-007"] [data-part="row"][data-level="parent"]{
font-weight:600;font-size:0.8125rem;
}
[data-vibeui-block="cascader-007"] [data-part="row"][data-level="child"]{
font-size:0.8125rem;
}
[data-vibeui-block="cascader-007"] input[type="checkbox"]{
flex:0 0 auto;width:0.9375rem;height:0.9375rem;margin:0;
accent-color:var(--vibeui-cascader-007-accent);
}
[data-vibeui-block="cascader-007"] [data-part="row"] span{
flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="cascader-007"] [data-part="badge"]{
flex:0 0 auto;font-size:0.6875rem;font-weight:500;
color:var(--vibeui-cascader-007-muted);
}
[data-vibeui-block="cascader-007"] [data-part="chips"]{
display:flex;flex-wrap:wrap;gap:0.25rem;margin:0;padding:0.5rem 0 0;list-style:none;
border-top:1px solid var(--vibeui-cascader-007-border);
}
[data-vibeui-block="cascader-007"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.25rem;
padding:0.1875rem 0.4375rem;border-radius:999px;
background:color-mix(in oklab,var(--vibeui-cascader-007-accent) 14%,transparent);
color:var(--vibeui-cascader-007-accent);
font-size:0.6875rem;font-weight:600;
}
[data-vibeui-block="cascader-007"] [data-part="chip"] small{
font-weight:400;opacity:.75;
}
[data-vibeui-block="cascader-007"] [data-part="none"]{
margin:0.5rem 0 0;padding-top:0.5rem;font-size:0.6875rem;
color:var(--vibeui-cascader-007-muted);
border-top:1px solid var(--vibeui-cascader-007-border);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="cascader-007"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_GROUPS: Cascader007Group[] = [
  {
    label: "Разработка",
    children: ["Фронтенд", "Бэкенд", "Мобильные"],
  },
  {
    label: "Дизайн",
    children: ["Продуктовый", "Графический"],
  },
  {
    label: "Маркетинг",
    children: ["Контент", "Перформанс", "Партнёрства"],
  },
]

function keyOf(group: string, child: string) {
  return `${group} → ${child}`
}

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

/**
 * Каскад с галочками: родитель включает всю ветку, частичный выбор виден третьим состоянием.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Cascader007({
  heading = "Направления рассылки",
  groups = DEFAULT_GROUPS,
  totalText = "выбрано {count}",
  emptyText = "Ни одно направление не выбрано — письмо не уйдёт никому.",
  background = "",
  accent,
  className,
  style,
}: Cascader007Props) {
  const [selected, setSelected] = useState<string[]>(() =>
    (groups[0]?.children ?? [])
      .slice(0, 2)
      .map((child) => keyOf(groups[0].label, child)),
  )

  const toggleChild = (group: string, child: string) => {
    const key = keyOf(group, child)

    setSelected((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    )
  }

  const toggleGroup = (group: Cascader007Group) => {
    const keys = group.children.map((child) => keyOf(group.label, child))

    setSelected((current) =>
      keys.every((key) => current.includes(key))
        ? current.filter((item) => !keys.includes(item))
        : [...current.filter((item) => !keys.includes(item)), ...keys],
    )
  }

  const palette = {
    ...(accent ? { "--vibeui-cascader-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-cascader-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cascader-007" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="cascader"
        data-vibeui-block="cascader-007"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <p data-part="heading">{heading}</p>
          <span data-part="total" aria-live="polite">
            {totalText.replace("{count}", String(selected.length))}
          </span>
        </div>
        <ul data-part="tree">
          {groups.map((group) => {
            const keys = group.children.map((child) =>
              keyOf(group.label, child),
            )
            const picked = keys.filter((key) => selected.includes(key))
            const all = picked.length === keys.length
            const some = picked.length > 0 && !all

            return (
              <li key={group.label}>
                <label data-part="row" data-level="parent">
                  <input
                    type="checkbox"
                    checked={all}
                    ref={(node) => {
                      if (node) {
                        node.indeterminate = some
                      }
                    }}
                    onChange={() => toggleGroup(group)}
                  />
                  <span>{group.label}</span>
                  <span data-part="badge">
                    {picked.length}/{keys.length}
                  </span>
                </label>
                <ul data-part="branch">
                  {group.children.map((child) => (
                    <li key={child}>
                      <label data-part="row" data-level="child">
                        <input
                          type="checkbox"
                          checked={selected.includes(keyOf(group.label, child))}
                          onChange={() => toggleChild(group.label, child)}
                        />
                        <span>{child}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>
        {selected.length ? (
          <ul data-part="chips">
            {selected.map((key) => (
              <li key={key} data-part="chip">
                <small>{key.split(" → ")[0]}</small>
                {key.split(" → ")[1]}
              </li>
            ))}
          </ul>
        ) : (
          <p data-part="none">{emptyText}</p>
        )}
      </div>
    </>
  )
}
