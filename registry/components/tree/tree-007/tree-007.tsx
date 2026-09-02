"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"

export type Tree007Node = {
  name: string
  /** Дети, которые «лежат на сервере»: подгружаются при первом раскрытии. */
  lazy?: string[]
  children?: Tree007Node[]
}

export type Tree007Props = {
  nodes?: Tree007Node[]
  label?: string
  /** Задержка имитации запроса в миллисекундах. */
  delay?: number
  /** Подпись загружаемой ветки; {name} — её имя. */
  loadingText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: ветка подгружается при первом раскрытии, а не при показе
// дерева. Пока идёт запрос, ветка помечена aria-busy и держит место тремя
// строками-заглушками: без них дерево прыгает на высоту пришедшего списка.
// Результат кладётся в кэш, поэтому повторное раскрытие уже не грузит ничего.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="tree-007"]){
--vibeui-tree-007-bg:transparent;
--vibeui-tree-007-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-tree-007-muted:light-dark(oklch(0.56 0.014 265),oklch(0.67 0.012 265));
--vibeui-tree-007-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-tree-007-hover:light-dark(oklch(0.97 0.004 265),oklch(0.29 0.01 265));
--vibeui-tree-007-skeleton:light-dark(oklch(0.93 0.005 265),oklch(0.33 0.01 265));
--vibeui-tree-007-accent:light-dark(oklch(0.53 0.19 265),oklch(0.75 0.16 265));
--vibeui-tree-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="tree-007"]{
width:100%;max-width:21rem;box-sizing:border-box;padding:0.625rem;
background:var(--vibeui-tree-007-bg);
border:1px solid var(--vibeui-tree-007-border);border-radius:0.875rem;
font-family:var(--vibeui-tree-007-font);font-size:0.8125rem;
color:var(--vibeui-tree-007-fg);
}
[data-vibeui-block="tree-007"] ul{margin:0;padding:0;list-style:none}
[data-vibeui-block="tree-007"] [role="group"]{
margin-left:0.5625rem;padding-left:0.5rem;
border-left:1px solid var(--vibeui-tree-007-border);
}
[data-vibeui-block="tree-007"] [data-part="row"]{
appearance:none;border:0;background:none;cursor:pointer;
box-sizing:border-box;width:100%;
display:flex;align-items:center;gap:0.4375rem;
min-height:1.875rem;padding:0 0.5rem;border-radius:0.5rem;
font:inherit;color:inherit;text-align:left;
}
[data-vibeui-block="tree-007"] [data-part="row"]:hover{background:var(--vibeui-tree-007-hover)}
[data-vibeui-block="tree-007"] [data-part="row"]:focus-visible{
outline:2px solid var(--vibeui-tree-007-accent);outline-offset:-2px;
}
[data-vibeui-block="tree-007"] [data-part="caret"]{
flex:none;width:0.6875rem;text-align:center;
color:var(--vibeui-tree-007-muted);font-size:0.5625rem;line-height:1;
transition:transform .14s ease;
}
[data-vibeui-block="tree-007"] li[aria-expanded="true"] > [data-part="row"] [data-part="caret"]{
transform:rotate(90deg);
}
[data-vibeui-block="tree-007"] [data-part="name"]{
flex:1 1 auto;min-width:0;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="tree-007"] li[data-branch="true"] > [data-part="row"] [data-part="name"]{
font-weight:650;
}
[data-vibeui-block="tree-007"] [data-part="leaf"]{
display:flex;align-items:center;gap:0.4375rem;
min-height:1.75rem;padding:0 0.5rem;border-radius:0.5rem;
}
[data-vibeui-block="tree-007"] [data-part="dot"]{
flex:none;width:0.3125rem;height:0.3125rem;border-radius:9999px;
background:var(--vibeui-tree-007-muted);
}
/* Заглушки держат высоту ветки: иначе дерево прыгает на приходе данных. */
[data-vibeui-block="tree-007"] [data-part="ghost"]{
display:block;height:0.625rem;margin:0.5rem 0.5rem;border-radius:0.25rem;
background:var(--vibeui-tree-007-skeleton);
animation:vibeui-tree-007-pulse 1.2s ease-in-out infinite;
}
[data-vibeui-block="tree-007"] [data-part="ghost"]:nth-child(1){width:70%}
[data-vibeui-block="tree-007"] [data-part="ghost"]:nth-child(2){width:52%;animation-delay:.12s}
[data-vibeui-block="tree-007"] [data-part="ghost"]:nth-child(3){width:61%;animation-delay:.24s}
@keyframes vibeui-tree-007-pulse{
0%,100%{opacity:1}
50%{opacity:.45}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="tree-007"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_NODES: Tree007Node[] = [
  {
    name: "Основной кластер",
    lazy: ["api-gateway", "auth-service", "billing-service", "search-service"],
  },
  {
    name: "Тестовый кластер",
    lazy: ["api-gateway", "mock-payments"],
  },
  {
    name: "Архив",
    children: [{ name: "legacy-monolith" }],
  },
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

/**
 * Дерево с ленивой подгрузкой ветки при первом раскрытии.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tree007({
  nodes = DEFAULT_NODES,
  label = "Сервисы",
  delay = 900,
  loadingText = "{name}: загрузка",
  background = "",
  accent,
  className,
  style,
}: Tree007Props) {
  const [open, setOpen] = useState<Set<string>>(() => new Set())
  const [loading, setLoading] = useState<Set<string>>(() => new Set())
  const [loaded, setLoaded] = useState<Record<string, string[]>>({})
  const timers = useRef<number[]>([])

  useEffect(() => {
    const pending = timers.current

    return () => {
      for (const timer of pending) {
        window.clearTimeout(timer)
      }
    }
  }, [])

  function toggle(node: Tree007Node) {
    const id = node.name
    const isOpen = open.has(id)

    setOpen((previous) => {
      const next = new Set(previous)

      if (isOpen) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return next
    })

    // Кэш: повторное раскрытие уже ничего не запрашивает.
    if (isOpen || !node.lazy || loaded[id]) {
      return
    }

    setLoading((previous) => new Set(previous).add(id))

    const timer = window.setTimeout(
      () => {
        setLoaded((previous) => ({ ...previous, [id]: node.lazy ?? [] }))
        setLoading((previous) => {
          const next = new Set(previous)
          next.delete(id)
          return next
        })
      },
      Math.max(0, delay),
    )

    timers.current.push(timer)
  }

  const palette = {
    ...(accent ? { "--vibeui-tree-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tree-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tree-007" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="tree-007" className={className} style={palette}>
        <ul role="tree" aria-label={label}>
          {nodes.map((node) => {
            const id = node.name
            const expanded = open.has(id)
            const busy = loading.has(id)
            const children =
              loaded[id]?.map((name) => ({ name })) ?? node.children ?? []
            const branch = Boolean(node.lazy?.length || node.children?.length)

            return (
              <li
                key={id}
                role="treeitem"
                aria-level={1}
                aria-expanded={branch ? expanded : undefined}
                aria-busy={busy || undefined}
                aria-selected={false}
                data-branch={branch || undefined}
              >
                <button
                  type="button"
                  data-part="row"
                  onClick={() => toggle(node)}
                >
                  <span data-part="caret" aria-hidden="true">
                    ▶
                  </span>
                  <span data-part="name">{node.name}</span>
                </button>
                {expanded ? (
                  busy ? (
                    <div
                      role="group"
                      aria-label={loadingText.replace("{name}", node.name)}
                    >
                      <span data-part="ghost" />
                      <span data-part="ghost" />
                      <span data-part="ghost" />
                    </div>
                  ) : (
                    <ul role="group" aria-label={node.name}>
                      {children.map((child) => (
                        <li
                          key={child.name}
                          role="treeitem"
                          aria-level={2}
                          aria-selected={false}
                          data-part="leaf"
                        >
                          <span data-part="dot" aria-hidden="true" />
                          <span data-part="name">{child.name}</span>
                        </li>
                      ))}
                    </ul>
                  )
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
