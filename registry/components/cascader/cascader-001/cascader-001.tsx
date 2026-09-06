"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Cascader001Node = {
  label: string
  children?: Cascader001Node[]
}

export type Cascader001Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  tree?: Cascader001Node[]
  onChange?: (path: string[]) => void
  /** Подпись пустого пункта списка. */
  placeholderText?: string
  /** Подпись перед выбранным путём. */
  selectedText?: string
  /** Чем подписан пустой путь. */
  emptyText?: string
  /** Шаблон aria-подписи уровня: {label} и {level}. */
  levelText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
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
--vibeui-cascader-001-bg:transparent;
--vibeui-cascader-001-field:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-cascader-001-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-cascader-001-muted:color-mix(in oklab,var(--vibeui-cascader-001-fg) 68%,transparent);
--vibeui-cascader-001-border:light-dark(oklch(0.88 0 265),oklch(0.37 0 265));
--vibeui-cascader-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-cascader-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cascader-001"]{color-scheme:dark}
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
background:var(--vibeui-cascader-001-field);color:inherit;
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
function initialPath(tree: Cascader001Node[]): string[] {
  const first = tree[0]

  if (!first) {
    return []
  }

  const second = first.children?.[0]

  return second ? [first.label, second.label] : [first.label]
}

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
  placeholderText = "Выберите…",
  selectedText = "Выбрано:",
  emptyText = "ничего",
  levelText = "{label}: уровень {level}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Cascader001Props) {
  const id = useId()
  const [path, setPath] = useState<string[]>(() => initialPath(tree))
  const levels = levelOptions(tree, path)

  const pick = (index: number, value: string) => {
    const next = value ? [...path.slice(0, index), value] : path.slice(0, index)
    setPath(next)
    onChange?.(next)
  }

  const palette = {
    ...(accent ? { "--vibeui-cascader-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-cascader-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cascader-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="cascader"
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
              aria-label={levelText
                .replace("{label}", label)
                .replace("{level}", String(index + 1))}
              onChange={(event) => pick(index, event.target.value)}
            >
              <option value="">{placeholderText}</option>
              {nodes.map((node) => (
                <option key={node.label} value={node.label}>
                  {node.label}
                </option>
              ))}
            </select>
          ))}
        </div>
        <p data-part="path" aria-live="polite">
          {selectedText} <b>{path.length ? path.join(" → ") : emptyText}</b>
        </p>
      </div>
    </>
  )
}
