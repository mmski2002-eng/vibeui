"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Cascader001Node = {
  label: string
  children?: Cascader001Node[]
}

export type Cascader001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  tree?: Cascader001Node[]
  onChange?: (path: string[]) => void
  accent?: string
}

// Идея компонента: выбор по уровням вместо длинного списка. Каждый уровень —
// нативный select, поэтому на телефоне открывается системный выбор, а с
// клавиатуры всё работает без единой строки своего кода. Следующий уровень
// появляется только после выбора на текущем, а не стоит пустым: пустой список
// выглядит сломанным. Выбранный путь показан строкой — иначе после закрытия
// списков непонятно, что именно выбрано.
const STYLES = `
:where([data-vibeui-block="cascader-001"]){
--vibeui-cascader-001-bg:oklch(1 0 0);
--vibeui-cascader-001-fg:oklch(0.24 0.014 265);
--vibeui-cascader-001-muted:oklch(0.56 0.014 265);
--vibeui-cascader-001-border:oklch(0.88 0.008 265);
--vibeui-cascader-001-accent:oklch(0.55 0.2 262);
--vibeui-cascader-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="cascader-001"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-cascader-001-bg);
border:1px solid var(--vibeui-cascader-001-border);border-radius:0.875rem;
font-family:var(--vibeui-cascader-001-font);color:var(--vibeui-cascader-001-fg);
}
[data-vibeui-block="cascader-001"] *{box-sizing:border-box}
[data-vibeui-block="cascader-001"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="cascader-001"] [data-part="levels"]{display:flex;flex-wrap:wrap;gap:0.375rem}
[data-vibeui-block="cascader-001"] select{
flex:1 1 8rem;min-width:0;height:2.25rem;padding:0 0.5rem;
background:var(--vibeui-cascader-001-bg);color:inherit;
border:1px solid var(--vibeui-cascader-001-border);border-radius:0.5rem;
font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="cascader-001"] select:focus-visible{outline:2px solid var(--vibeui-cascader-001-accent);outline-offset:1px}
/* Путь строкой: после закрытия списков иначе не видно, что выбрано. */
[data-vibeui-block="cascader-001"] [data-part="path"]{
margin:0;font-size:0.75rem;color:var(--vibeui-cascader-001-muted);
}
[data-vibeui-block="cascader-001"] [data-part="path"] b{color:var(--vibeui-cascader-001-fg);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cascader-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TREE: Cascader001Node[] = [
  {
    label: "Компоненты",
    children: [
      { label: "Формы", children: [{ label: "Поле" }, { label: "Выбор" }] },
      { label: "Таблицы", children: [{ label: "Данные" }, { label: "Счёт" }] },
      {
        label: "Навигация",
        children: [{ label: "Вкладки" }, { label: "Меню" }],
      },
    ],
  },
  {
    label: "Блоки",
    children: [
      { label: "Лендинг", children: [{ label: "Hero" }, { label: "Тарифы" }] },
      {
        label: "Кабинет",
        children: [{ label: "Обзор" }, { label: "Настройки" }],
      },
    ],
  },
]

function levelOptions(tree: Cascader001Node[], path: string[]) {
  const levels: Cascader001Node[][] = [tree]
  let nodes = tree
  for (const step of path) {
    const found = nodes.find((node) => node.label === step)
    if (!found?.children?.length) break
    levels.push(found.children)
    nodes = found.children
  }
  return levels
}

/**
 * Каскадный выбор: уровень за уровнем на нативных списках.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Cascader001({
  label = "Раздел каталога",
  tree = DEFAULT_TREE,
  onChange,
  accent,
  className,
  style,
  ...props
}: Cascader001Props) {
  const id = useId()
  const [path, setPath] = useState<string[]>(["Компоненты", "Формы"])
  const levels = levelOptions(tree, path)

  const pick = (index: number, value: string) => {
    const next = value ? [...path.slice(0, index), value] : path.slice(0, index)
    setPath(next)
    onChange?.(next)
  }

  const palette = {
    ...(accent ? { "--vibeui-cascader-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cascader-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="cascader-001"
        className={className}
        style={palette}
      >
        <span data-part="label" id={`${id}-label`}>
          {label}
        </span>
        <div data-part="levels">
          {levels.map((nodes, index) => (
            <select
              key={index}
              value={path[index] ?? ""}
              aria-label={`${label}: уровень ${index + 1}`}
              onChange={(event) => pick(index, event.target.value)}
            >
              <option value="">Выберите…</option>
              {nodes.map((node) => (
                <option key={node.label} value={node.label}>
                  {node.label}
                </option>
              ))}
            </select>
          ))}
        </div>
        <p data-part="path" aria-live="polite">
          Выбрано: <b>{path.length ? path.join(" → ") : "ничего"}</b>
        </p>
      </div>
    </>
  )
}
