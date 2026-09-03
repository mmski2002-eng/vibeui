"use client"

import { useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Menu003Menu = {
  label: string
  items: string[]
}

export type Menu003Props = Omit<ComponentProps<"div">, "children"> & {
  menus?: Menu003Menu[]
  /** Имя строки меню для скринридера. */
  menubarLabel?: string
  /** Подсказка под строкой: компонент несёт русскую, проект подставляет свою. */
  hint?: string
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: строка меню как в настольной программе. Её отличие от ряда
// кнопок — в клавиатуре: стрелки влево-вправо ходят между заголовками, вниз
// открывает список, Escape закрывает. Открытое меню переключается наведением
// на соседний заголовок, и это тоже ожидаемое поведение, а не украшение.
const STYLES = `
:where([data-vibeui-block="menu-003"]){
--vibeui-menu-003-bg:transparent;
--vibeui-menu-003-panel:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-menu-003-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-menu-003-muted:color-mix(in oklab,var(--vibeui-menu-003-fg) 68%,transparent);
--vibeui-menu-003-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-menu-003-hover:light-dark(oklch(0.96 0.004 265),oklch(0.33 0.012 265));
--vibeui-menu-003-accent:light-dark(oklch(0.55 0.17 265),oklch(0.75 0.15 265));
--vibeui-menu-003-shadow:light-dark(oklch(0.2 0.02 265 / 55%),oklch(0 0 0 / 62%));
--vibeui-menu-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="menu-003"]{color-scheme:dark}
[data-vibeui-block="menu-003"]{
position:relative;display:inline-flex;flex-direction:column;
width:100%;max-width:22rem;box-sizing:border-box;
font-family:var(--vibeui-menu-003-font);color:var(--vibeui-menu-003-fg);
}
[data-vibeui-block="menu-003"] [data-part="bar"]{
display:flex;gap:0.125rem;padding:0.25rem;
border:1px solid var(--vibeui-menu-003-border);border-radius:0.625rem;
background:var(--vibeui-menu-003-bg);
}
[data-vibeui-block="menu-003"] [data-part="title"]{
appearance:none;cursor:pointer;
height:1.875rem;padding:0 0.625rem;border:0;border-radius:0.4375rem;
background:transparent;color:inherit;font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="menu-003"] [data-part="title"]:hover{background:var(--vibeui-menu-003-hover)}
[data-vibeui-block="menu-003"] [data-part="title"][aria-expanded="true"]{background:var(--vibeui-menu-003-hover)}
[data-vibeui-block="menu-003"] [data-part="title"]:focus-visible{outline:2px solid var(--vibeui-menu-003-accent);outline-offset:-2px}
/* Список висит под строкой и перекрывает содержимое: меню — верхний слой. */
[data-vibeui-block="menu-003"] [data-part="list"]{
position:absolute;top:calc(100% + 0.25rem);z-index:20;
display:flex;flex-direction:column;min-width:11rem;
margin:0;padding:0.3125rem;list-style:none;
border:1px solid var(--vibeui-menu-003-border);border-radius:0.75rem;
background:var(--vibeui-menu-003-panel);
box-shadow:0 18px 40px -22px var(--vibeui-menu-003-shadow);
}
[data-vibeui-block="menu-003"] [data-part="item"]{
display:block;width:100%;min-height:1.875rem;padding:0 0.5rem;
appearance:none;border:0;border-radius:0.4375rem;background:transparent;color:inherit;
font:inherit;font-size:0.8125rem;text-align:left;cursor:pointer;
}
[data-vibeui-block="menu-003"] [data-part="item"]:hover{background:var(--vibeui-menu-003-hover)}
[data-vibeui-block="menu-003"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-menu-003-accent);outline-offset:-2px}
[data-vibeui-block="menu-003"] [data-part="hint"]{
margin-top:0.5rem;font-size:0.75rem;color:var(--vibeui-menu-003-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="menu-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_MENUS: Menu003Menu[] = [
  { label: "Файл", items: ["Создать", "Открыть", "Сохранить", "Экспорт"] },
  { label: "Правка", items: ["Отменить", "Повторить", "Найти и заменить"] },
  { label: "Вид", items: ["Сетка", "Линейки", "Тёмная тема"] },
  { label: "Помощь", items: ["Документация", "Горячие клавиши"] },
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

/**
 * Строка меню с клавиатурой: стрелки ходят по заголовкам, вниз открывает.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Menu003({
  menus = DEFAULT_MENUS,
  menubarLabel = "Главное меню",
  hint = "Стрелки ходят по разделам, стрелка вниз открывает список",
  background = "",
  accent,
  className,
  style,
  ...props
}: Menu003Props) {
  const [open, setOpen] = useState<number | null>(null)
  const titles = useRef<(HTMLButtonElement | null)[]>([])

  const palette = {
    ...(accent ? { "--vibeui-menu-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-menu-003-bg": background,
          "--vibeui-menu-003-panel": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const onKeyDown = (event: KeyboardEvent<HTMLElement>, index: number) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault()
      const step = event.key === "ArrowRight" ? 1 : -1
      const next = (index + step + menus.length) % menus.length
      titles.current[next]?.focus()
      if (open !== null) setOpen(next)
    } else if (event.key === "ArrowDown") {
      event.preventDefault()
      setOpen(index)
    } else if (event.key === "Escape") {
      setOpen(null)
      titles.current[index]?.focus()
    }
  }

  return (
    <>
      <style href="vibeui-menu-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="menubar"
        data-vibeui-block="menu-003"
        className={className}
        style={palette}
      >
        <div data-part="bar" role="menubar" aria-label={menubarLabel}>
          {menus.map((menu, index) => (
            <button
              key={menu.label}
              ref={(node) => {
                titles.current[index] = node
              }}
              type="button"
              role="menuitem"
              data-part="title"
              aria-haspopup="true"
              aria-expanded={open === index}
              onClick={() => setOpen(open === index ? null : index)}
              onMouseEnter={() => {
                // Открытое меню переключается наведением: так работают все
                // настольные строки меню.
                if (open !== null) setOpen(index)
              }}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              {menu.label}
            </button>
          ))}
        </div>
        {open !== null ? (
          <ul
            data-part="list"
            role="menu"
            aria-label={menus[open].label}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setOpen(null)
                titles.current[open]?.focus()
              }
            }}
          >
            {menus[open].items.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  role="menuitem"
                  data-part="item"
                  onClick={() => setOpen(null)}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <p data-part="hint">{hint}</p>
      </div>
    </>
  )
}
