"use client"

import { useRef, useState } from "react"
import type { ComponentProps, CSSProperties, MouseEvent } from "react"

export type Tree011Node = {
  name: string
  children?: Tree011Node[]
}

export type Tree011Action = {
  label: string
  keys?: string
  danger?: boolean
}

export type Tree011Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  nodes?: Tree011Node[]
  actions?: Tree011Action[]
  /**
   * Показать меню узла развёрнутым в потоке: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  /** Подпись кнопки «⋯» для озвучки: к ней подставляется имя узла. */
  moreLabel?: string
  /** Строка под деревом: {action} — выбранное действие, {name} — узел. */
  hint?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: действия над узлом живут не в панели над деревом, а на
// самом узле. Правый клик по строке открывает её меню — так работают все
// файловые менеджеры, и это единственный способ не заводить кнопку на каждое
// действие. Правый клик недоступен с тача и с клавиатуры, поэтому у каждой
// строки есть кнопка «⋯»: она открывает то же меню под собой. Меню знает, чей
// оно, — имя узла стоит в его шапке, иначе после промаха человек переименует
// не то.
const STYLES = `
:where([data-vibeui-block="tree-011"]){
--vibeui-tree-011-bg:transparent;
--vibeui-tree-011-surface:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-tree-011-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-tree-011-muted:color-mix(in oklab,var(--vibeui-tree-011-fg) 68%,transparent);
--vibeui-tree-011-border:light-dark(oklch(0.89 0 265),oklch(0.37 0 265));
--vibeui-tree-011-hover:light-dark(oklch(0.55 0 265 / 9%),oklch(0.92 0 265 / 12%));
--vibeui-tree-011-accent:light-dark(oklch(0.52 0.16 39.8),oklch(0.78 0.12 39.8));
--vibeui-tree-011-danger:light-dark(oklch(0.55 0.19 25),oklch(0.74 0.16 25));
--vibeui-tree-011-shadow:light-dark(oklch(0.2 0 265 / 40%),oklch(0 0 0 / 70%));
--vibeui-tree-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-tree-011-x:50%;
--vibeui-tree-011-y:50%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tree-011"]{color-scheme:dark}
[data-vibeui-block="tree-011"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;
background:var(--vibeui-tree-011-bg);color:var(--vibeui-tree-011-fg);
font-family:var(--vibeui-tree-011-font);
}
[data-vibeui-block="tree-011"] *{box-sizing:border-box}
[data-vibeui-block="tree-011"] [data-part="title"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-tree-011-muted);
}
[data-vibeui-block="tree-011"] ul{margin:0;padding:0;list-style:none}
[data-vibeui-block="tree-011"] ul ul{
margin-inline-start:0.6875rem;padding-inline-start:0.6875rem;
border-inline-start:1px solid var(--vibeui-tree-011-border);
}
[data-vibeui-block="tree-011"] [data-part="row"]{
display:flex;align-items:center;gap:0.125rem;border-radius:0.4375rem;
}
[data-vibeui-block="tree-011"] [data-part="row"]:hover{background:var(--vibeui-tree-011-hover)}
[data-vibeui-block="tree-011"] [data-part="row"][data-active="true"]{
background:color-mix(in oklab,var(--vibeui-tree-011-accent) 18%,transparent);
}
[data-vibeui-block="tree-011"] [data-part="name"]{
display:flex;align-items:center;gap:0.375rem;flex:1 1 auto;min-width:0;
min-height:1.875rem;padding:0.1875rem 0.25rem;
appearance:none;border:0;background:none;cursor:pointer;border-radius:0.4375rem;
font:inherit;font-size:0.8125rem;line-height:1.3;color:inherit;text-align:left;
}
[data-vibeui-block="tree-011"] [data-part="text"]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
/* Уголок рисуется рамками, а не иконкой: у item'а нет зависимостей. */
[data-vibeui-block="tree-011"] [data-part="caret"]{
width:0.3125rem;height:0.3125rem;flex:none;
border-right:1.5px solid var(--vibeui-tree-011-muted);
border-bottom:1.5px solid var(--vibeui-tree-011-muted);
rotate:-45deg;transition:rotate .16s ease;
}
[data-vibeui-block="tree-011"] [data-part="name"][aria-expanded="true"] [data-part="caret"]{rotate:45deg}
[data-vibeui-block="tree-011"] [data-part="dot"]{
width:0.3125rem;height:0.3125rem;flex:none;border-radius:999px;
background:var(--vibeui-tree-011-muted);
}
[data-vibeui-block="tree-011"] [data-part="more"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:1.5rem;height:1.5rem;margin-inline-end:0.125rem;padding:0;
appearance:none;border:0;background:none;cursor:pointer;border-radius:0.375rem;
font:inherit;font-size:0.875rem;line-height:1;color:var(--vibeui-tree-011-muted);
}
[data-vibeui-block="tree-011"] [data-part="more"]:hover{background:var(--vibeui-tree-011-hover);color:var(--vibeui-tree-011-fg)}
[data-vibeui-block="tree-011"] [data-part="name"]:focus-visible,
[data-vibeui-block="tree-011"] [data-part="more"]:focus-visible{outline:2px solid var(--vibeui-tree-011-accent);outline-offset:-2px}
/* Координаты курсора известны только в момент клика — отсюда переменные. */
[data-vibeui-block="tree-011"] [data-part="menu"]{
position:fixed;margin:0;padding:0.25rem;
top:var(--vibeui-tree-011-y);left:var(--vibeui-tree-011-x);
min-width:11.5rem;
background:var(--vibeui-tree-011-surface);color:var(--vibeui-tree-011-fg);
border:1px solid var(--vibeui-tree-011-border);border-radius:0.625rem;
box-shadow:0 16px 36px -18px var(--vibeui-tree-011-shadow);
font-family:var(--vibeui-tree-011-font);
}
[data-vibeui-block="tree-011"] [data-part="menu-head"]{
display:block;padding:0.25rem 0.5rem 0.375rem;
font-size:0.75rem;font-weight:650;line-height:1.3;
color:var(--vibeui-tree-011-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="tree-011"] [data-part="action"]{
display:flex;align-items:center;justify-content:space-between;gap:1.5rem;
width:100%;min-height:1.875rem;padding:0.1875rem 0.5rem;
appearance:none;border:0;background:none;cursor:pointer;border-radius:0.4375rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
}
[data-vibeui-block="tree-011"] [data-part="action"]:hover{background:var(--vibeui-tree-011-hover)}
[data-vibeui-block="tree-011"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-tree-011-accent);outline-offset:-2px}
[data-vibeui-block="tree-011"] [data-part="action"][data-danger="true"]{color:var(--vibeui-tree-011-danger)}
[data-vibeui-block="tree-011"] [data-part="keys"]{font-size:0.75rem;color:var(--vibeui-tree-011-muted)}
[data-vibeui-block="tree-011"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.45;color:var(--vibeui-tree-011-muted);
}
/* Развёрнутый режим витрины: меню стоит в потоке под деревом, а не в
   верхнем слое, поэтому его видно на карточке каталога. */
[data-vibeui-block="tree-011"] [data-part="menu"][data-open="true"]{
position:static;width:fit-content;max-width:100%;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tree-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_NODES: Tree011Node[] = [
  {
    name: "Проект «Север»",
    children: [
      {
        name: "Исследование",
        children: [
          { name: "Интервью.md" },
          { name: "Сегменты.csv" },
          { name: "Выводы.pdf" },
        ],
      },
      {
        name: "Макеты",
        children: [{ name: "Главная.fig" }, { name: "Каталог.fig" }],
      },
      { name: "Смета.xlsx" },
    ],
  },
  { name: "Архив 2024", children: [{ name: "Отчёт за март.pdf" }] },
]

const DEFAULT_ACTIONS: Tree011Action[] = [
  { label: "Переименовать", keys: "F2" },
  { label: "Дублировать", keys: "Ctrl+D" },
  { label: "Удалить", keys: "Backspace", danger: true },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона.
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
 * Дерево, у каждого узла которого своё меню: правый клик по строке или
 * кнопка «⋯». Один файл, ноль зависимостей, собственная палитра.
 */
export function Tree011({
  label = "Файлы проекта",
  nodes = DEFAULT_NODES,
  actions = DEFAULT_ACTIONS,
  open = false,
  moreLabel = "Действия с узлом",
  hint = "Правый клик по строке или «⋯». Выбрано: {action} — {name}.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Tree011Props) {
  const menu = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState<string[]>([
    "/Проект «Север»",
    "/Проект «Север»/Исследование",
  ])
  const [target, setTarget] = useState(nodes[0]?.name ?? "")
  const [spot, setSpot] = useState<{ x: string; y: string } | null>(null)
  const [done, setDone] = useState("—")

  function openAt(name: string, x: number, y: number) {
    setTarget(name)
    setSpot({ x: `${Math.round(x)}px`, y: `${Math.round(y)}px` })

    // В витринном режиме меню уже стоит в потоке и попапом не является:
    // showPopover() на таком элементе бросает InvalidStateError.
    if (!open) {
      menu.current?.showPopover()
    }
  }

  function onRowContextMenu(event: MouseEvent<HTMLLIElement>, name: string) {
    event.preventDefault()
    event.stopPropagation()
    openAt(name, event.clientX, event.clientY)
  }

  function toggle(id: string) {
    setExpanded((previous) =>
      previous.includes(id)
        ? previous.filter((entry) => entry !== id)
        : [...previous, id],
    )
  }

  function renderLevel(list: Tree011Node[], parent: string) {
    return (
      <ul>
        {list.map((node) => {
          const id = `${parent}/${node.name}`
          const branch = Boolean(node.children?.length)
          const isOpen = expanded.includes(id)

          return (
            <li
              key={id}
              onContextMenu={(event) => onRowContextMenu(event, node.name)}
            >
              <div
                data-part="row"
                data-active={node.name === target || undefined}
              >
                <button
                  type="button"
                  data-part="name"
                  aria-expanded={branch ? isOpen : undefined}
                  onClick={() => (branch ? toggle(id) : setTarget(node.name))}
                >
                  {branch ? (
                    <span data-part="caret" aria-hidden="true" />
                  ) : (
                    <span data-part="dot" aria-hidden="true" />
                  )}
                  <span data-part="text">{node.name}</span>
                </button>
                <button
                  type="button"
                  data-part="more"
                  aria-label={`${moreLabel}: ${node.name}`}
                  aria-haspopup="menu"
                  onClick={(event) => {
                    const box = event.currentTarget.getBoundingClientRect()
                    openAt(node.name, box.left - 128, box.bottom + 4)
                  }}
                >
                  ⋯
                </button>
              </div>
              {branch && isOpen ? renderLevel(node.children!, id) : null}
            </li>
          )
        })}
      </ul>
    )
  }

  const palette = {
    ...(accent ? { "--vibeui-tree-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tree-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...(spot
      ? { "--vibeui-tree-011-x": spot.x, "--vibeui-tree-011-y": spot.y }
      : null),
    ...style,
  } as CSSProperties
  const hintText = hint.replace("{action}", done).replace("{name}", target)

  return (
    <>
      <style href="vibeui-tree-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tree"
        data-vibeui-block="tree-011"
        className={className}
        style={palette}
      >
        <p data-part="title">{label}</p>
        <nav aria-label={label}>{renderLevel(nodes, "")}</nav>
        <div
          data-part="menu"
          ref={menu}
          popover={open ? undefined : "auto"}
          data-open={open || undefined}
          role="menu"
          aria-label={`${moreLabel}: ${target}`}
        >
          <span data-part="menu-head">{target}</span>
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              data-part="action"
              data-danger={action.danger}
              role="menuitem"
              onClick={() => {
                setDone(action.label)

                if (!open) {
                  menu.current?.hidePopover()
                }
              }}
            >
              {action.label}
              {action.keys ? <span data-part="keys">{action.keys}</span> : null}
            </button>
          ))}
        </div>
        <p data-part="hint" aria-live="polite">
          {hintText}
        </p>
      </div>
    </>
  )
}
