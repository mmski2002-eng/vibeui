"use client"

import { useEffect, useState } from "react"
import type { CSSProperties } from "react"

export type Cascader012Node = {
  label: string
  children: string[]
}

export type Cascader012Props = {
  heading?: string
  delay?: number
  tree?: Cascader012Node[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: каскад, у которого следующий уровень приходит с сервера.
// Пока запрос идёт, справа стоят скелетоны той же высоты, что и будущие
// строки, — панель не прыгает, когда данные приезжают. Уровень помечен
// aria-busy, поэтому скринридер объявляет загрузку, а не молчит. Таймер
// снимается в cleanup: без этого быстрые переключения перезаписывают друг
// друга и в списке оказывается ветка, которую уже никто не выбирал.
const STYLES = `
:where([data-vibeui-block="cascader-012"]){
--vibeui-cascader-012-bg:oklch(1 0 0);
--vibeui-cascader-012-panel:oklch(0.975 0.003 265);
--vibeui-cascader-012-fg:oklch(0.23 0.014 265);
--vibeui-cascader-012-muted:oklch(0.55 0.012 265);
--vibeui-cascader-012-border:oklch(0.9 0.006 265);
--vibeui-cascader-012-accent:oklch(0.58 0.17 35);
--vibeui-cascader-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="cascader-012"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:25rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-cascader-012-bg);color:var(--vibeui-cascader-012-fg);
border:1px solid var(--vibeui-cascader-012-border);border-radius:1rem;
font-family:var(--vibeui-cascader-012-font);
box-shadow:0 18px 40px -32px oklch(0.2 0.03 265 / 55%);
}
[data-vibeui-block="cascader-012"] *{box-sizing:border-box}
[data-vibeui-block="cascader-012"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="cascader-012"] [data-part="heading"]{
margin:0;font-size:0.8125rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="cascader-012"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.3125rem;
font-size:0.6875rem;color:var(--vibeui-cascader-012-muted);
}
[data-vibeui-block="cascader-012"] [data-part="spinner"]{
width:0.625rem;height:0.625rem;border-radius:50%;
border:1.5px solid color-mix(in oklab,var(--vibeui-cascader-012-accent) 30%,transparent);
border-top-color:var(--vibeui-cascader-012-accent);
animation:vibeui-cascader-012-spin .7s linear infinite;
}
@keyframes vibeui-cascader-012-spin{to{transform:rotate(360deg)}}
[data-vibeui-block="cascader-012"] [data-part="grid"]{
display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:0.375rem;
}
[data-vibeui-block="cascader-012"] [data-part="pane"]{
display:flex;flex-direction:column;gap:0.125rem;margin:0;padding:0.25rem;
list-style:none;height:10.5rem;overflow:auto;overscroll-behavior:contain;
background:var(--vibeui-cascader-012-panel);
border:1px solid var(--vibeui-cascader-012-border);border-radius:0.75rem;
}
[data-vibeui-block="cascader-012"] [data-part="option"]{
display:flex;align-items:center;gap:0.375rem;width:100%;
padding:0.375rem 0.5rem;border:0;border-radius:0.5rem;
background:transparent;color:inherit;font:inherit;font-size:0.8125rem;
text-align:left;cursor:pointer;
transition:background-color .14s ease,color .14s ease;
}
[data-vibeui-block="cascader-012"] [data-part="option"] span{
flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="cascader-012"] [data-part="option"]:hover{
background:color-mix(in oklab,var(--vibeui-cascader-012-accent) 10%,transparent);
}
[data-vibeui-block="cascader-012"] [data-part="option"]:focus-visible{
outline:2px solid var(--vibeui-cascader-012-accent);outline-offset:-2px;
}
[data-vibeui-block="cascader-012"] [data-part="option"][aria-current="true"]{
background:color-mix(in oklab,var(--vibeui-cascader-012-accent) 16%,transparent);
color:var(--vibeui-cascader-012-accent);font-weight:600;
}
[data-vibeui-block="cascader-012"] [data-part="arrow"]{
flex:0 0 auto;width:0.3125rem;height:0.3125rem;
border-right:1.5px solid currentColor;border-top:1.5px solid currentColor;
transform:rotate(45deg);opacity:.5;
}
/* Скелетон повторяет высоту будущей строки, иначе панель дёргается. */
[data-vibeui-block="cascader-012"] [data-part="skeleton"]{
height:1.625rem;margin:0 0.0625rem;border-radius:0.5rem;
background:linear-gradient(90deg,
oklch(0.93 0.006 265) 0%,
oklch(0.97 0.004 265) 50%,
oklch(0.93 0.006 265) 100%);
background-size:200% 100%;
animation:vibeui-cascader-012-shimmer 1.1s ease-in-out infinite;
}
@keyframes vibeui-cascader-012-shimmer{
from{background-position:200% 0}
to{background-position:-40% 0}
}
[data-vibeui-block="cascader-012"] [data-part="footer"]{
margin:0;padding-top:0.5rem;border-top:1px solid var(--vibeui-cascader-012-border);
font-size:0.75rem;color:var(--vibeui-cascader-012-muted);
}
[data-vibeui-block="cascader-012"] [data-part="footer"] b{
color:var(--vibeui-cascader-012-fg);font-weight:650;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="cascader-012"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_TREE: Cascader012Node[] = [
  {
    label: "Северо-Запад",
    children: ["Санкт-Петербург", "Псков", "Великий Новгород", "Мурманск"],
  },
  {
    label: "Центр",
    children: ["Москва", "Тула", "Ярославль", "Калуга", "Рязань"],
  },
  {
    label: "Урал",
    children: ["Екатеринбург", "Челябинск", "Пермь"],
  },
  {
    label: "Сибирь",
    children: ["Новосибирск", "Красноярск", "Томск", "Иркутск"],
  },
]

/**
 * Каскад с ленивой подгрузкой уровня: скелетоны на время запроса и aria-busy.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Cascader012({
  heading = "Регион и город",
  delay = 700,
  tree = DEFAULT_TREE,
  accent,
  className,
  style,
}: Cascader012Props) {
  const [branch, setBranch] = useState(0)
  const [leaf, setLeaf] = useState<string | null>(null)
  // Загрузка выведена из состояния, а не выставлена в эффекте: сравнение
  // «что показано» с «что выбрано» переключает скелетоны без лишнего рендера.
  const [ready, setReady] = useState<number | null>(null)
  const loading = ready !== branch

  useEffect(() => {
    const timer = setTimeout(() => setReady(branch), delay)

    return () => clearTimeout(timer)
  }, [branch, delay])

  const children = tree[branch]?.children ?? []

  const palette = {
    ...(accent ? { "--vibeui-cascader-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cascader-012" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="cascader-012"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <p data-part="heading">{heading}</p>
          <span data-part="status" aria-live="polite">
            {loading ? (
              <>
                <i data-part="spinner" aria-hidden="true" />
                Загружаем города
              </>
            ) : (
              `${children.length} городов`
            )}
          </span>
        </div>
        <div data-part="grid">
          <ul data-part="pane" aria-label="Регион">
            {tree.map((node, index) => (
              <li key={node.label}>
                <button
                  data-part="option"
                  type="button"
                  aria-current={index === branch ? "true" : undefined}
                  onClick={() => {
                    setBranch(index)
                    setLeaf(null)
                  }}
                >
                  <span>{node.label}</span>
                  <i data-part="arrow" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          <ul data-part="pane" aria-label="Город" aria-busy={loading}>
            {loading
              ? [0, 1, 2, 3].map((row) => (
                  <li key={row} data-part="skeleton" aria-hidden="true" />
                ))
              : children.map((city) => (
                  <li key={city}>
                    <button
                      data-part="option"
                      type="button"
                      aria-current={leaf === city ? "true" : undefined}
                      onClick={() => setLeaf(city)}
                    >
                      <span>{city}</span>
                    </button>
                  </li>
                ))}
          </ul>
        </div>
        <p data-part="footer" aria-live="polite">
          Выбрано:{" "}
          <b>{leaf ? `${tree[branch].label} → ${leaf}` : "только регион"}</b>
        </p>
      </div>
    </>
  )
}
