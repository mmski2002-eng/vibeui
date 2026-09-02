"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties, KeyboardEvent } from "react"

export type Menubar002Item = {
  label: string
  keys?: string
  disabled?: boolean
}

export type Menubar002Menu = {
  label: string
  items: Menubar002Item[]
}

export type Menubar002Props = {
  menus?: Menubar002Menu[]
  /** Имя строки меню для скринридера. */
  menubarLabel?: string
  /** Подсказка справа: компонент несёт русскую, проект подставляет свою. */
  hint?: string
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: строка меню, по которой ходят стрелками, как в системном
// приложении. Влево и вправо переводят раздел, вниз открывает список и ставит
// фокус на первый пункт, Escape возвращает фокус на кнопку раздела. В Tab-порядке
// живёт только один раздел (roving tabindex), поэтому меню не ловит табуляцию.
const STYLES = `
:where([data-vibeui-block="menubar-002"]){
--vibeui-menubar-002-bg:transparent;
--vibeui-menubar-002-panel:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-menubar-002-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-menubar-002-muted:light-dark(oklch(0.58 0.014 265),oklch(0.68 0.012 265));
--vibeui-menubar-002-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-menubar-002-hover:light-dark(oklch(0.55 0.02 265 / 10%),oklch(0.88 0.02 265 / 14%));
--vibeui-menubar-002-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-menubar-002-shadow:light-dark(oklch(0.2 0.03 265 / 45%),oklch(0 0 0 / 62%));
--vibeui-menubar-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="menubar-002"]{
box-sizing:border-box;width:100%;max-width:34rem;padding:0.25rem;
display:flex;align-items:center;gap:0.125rem;
background:var(--vibeui-menubar-002-bg);color:var(--vibeui-menubar-002-fg);
border:1px solid var(--vibeui-menubar-002-border);border-radius:0.625rem;
font-family:var(--vibeui-menubar-002-font);
}
[data-vibeui-block="menubar-002"] [data-part="slot"]{position:relative}
[data-vibeui-block="menubar-002"] [data-part="trigger"]{
appearance:none;border:0;background:none;cursor:pointer;
height:1.875rem;padding:0 0.625rem;border-radius:0.4375rem;
font:inherit;font-size:0.8125rem;color:inherit;
transition:background-color .14s ease;
}
[data-vibeui-block="menubar-002"] [data-part="trigger"]:hover{background:var(--vibeui-menubar-002-hover)}
[data-vibeui-block="menubar-002"] [data-part="trigger"][aria-expanded="true"]{background:var(--vibeui-menubar-002-hover)}
[data-vibeui-block="menubar-002"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-menubar-002-accent);outline-offset:-2px}
[data-vibeui-block="menubar-002"] [data-part="menu"]{
position:absolute;top:calc(100% + 0.375rem);left:0;z-index:30;
min-width:12rem;padding:0.25rem;box-sizing:border-box;
background:var(--vibeui-menubar-002-panel);color:var(--vibeui-menubar-002-fg);
border:1px solid var(--vibeui-menubar-002-border);border-radius:0.625rem;
box-shadow:0 16px 36px -18px var(--vibeui-menubar-002-shadow);
}
[data-vibeui-block="menubar-002"] [data-part="item"]{
display:flex;align-items:center;justify-content:space-between;gap:1.5rem;
width:100%;min-height:1.875rem;padding:0 0.5rem;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;border-radius:0.4375rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
}
[data-vibeui-block="menubar-002"] [data-part="item"]:hover:not(:disabled){background:var(--vibeui-menubar-002-hover)}
[data-vibeui-block="menubar-002"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-menubar-002-accent);outline-offset:-2px}
[data-vibeui-block="menubar-002"] [data-part="item"]:disabled{color:var(--vibeui-menubar-002-muted);cursor:default}
[data-vibeui-block="menubar-002"] [data-part="keys"]{font-size:0.75rem;color:var(--vibeui-menubar-002-muted)}
[data-vibeui-block="menubar-002"] [data-part="hint"]{
margin-left:auto;padding-right:0.375rem;font-size:0.6875rem;color:var(--vibeui-menubar-002-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="menubar-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_MENUS: Menubar002Menu[] = [
  {
    label: "Файл",
    items: [
      { label: "Новый проект", keys: "⌘N" },
      { label: "Открыть…", keys: "⌘O" },
      { label: "Сохранить", keys: "⌘S" },
      { label: "Вернуть версию", disabled: true },
    ],
  },
  {
    label: "Правка",
    items: [
      { label: "Отменить", keys: "⌘Z" },
      { label: "Повторить", keys: "⇧⌘Z" },
      { label: "Найти в проекте", keys: "⌘F" },
    ],
  },
  {
    label: "Вид",
    items: [
      { label: "Показать сетку" },
      { label: "Показать линейки" },
      { label: "Во весь экран", keys: "F11" },
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

/**
 * Строка меню приложения с переходом между разделами стрелками.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Menubar002({
  menus = DEFAULT_MENUS,
  menubarLabel = "Меню приложения",
  hint = "← → между разделами",
  background = "",
  accent,
  className,
  style,
}: Menubar002Props) {
  const [open, setOpen] = useState<number | null>(null)
  const [focused, setFocused] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const wanted = useRef<"first" | "last" | null>(null)

  const palette = {
    ...(accent ? { "--vibeui-menubar-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-menubar-002-bg": background,
          "--vibeui-menubar-002-panel": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  // Клик мимо закрывает меню: без этого открытый список остаётся висеть,
  // когда человек ушёл работать в другую часть страницы.
  useEffect(() => {
    if (open === null) {
      return
    }

    function onOutside(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(null)
      }
    }

    document.addEventListener("pointerdown", onOutside)
    return () => document.removeEventListener("pointerdown", onOutside)
  }, [open])

  // Фокус на пункт ставится после отрисовки списка: до неё узла ещё нет.
  useEffect(() => {
    const mode = wanted.current
    wanted.current = null

    if (open === null || !mode) {
      return
    }

    const items = itemNodes()
    ;(mode === "first" ? items[0] : items[items.length - 1])?.focus()
  }, [open])

  function itemNodes() {
    return Array.from(
      rootRef.current?.querySelectorAll<HTMLButtonElement>(
        '[data-part="item"]:not(:disabled)',
      ) ?? [],
    )
  }

  function focusTrigger(index: number) {
    rootRef.current
      ?.querySelectorAll<HTMLButtonElement>('[data-part="trigger"]')
      [index]?.focus()
  }

  function goTo(index: number, keepOpen: boolean) {
    setFocused(index)
    focusTrigger(index)

    if (keepOpen) {
      wanted.current = null
      setOpen(index)
    }
  }

  function onBarKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = menus.length - 1

    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault()
      const step = event.key === "ArrowRight" ? 1 : -1
      goTo((focused + step + menus.length) % menus.length, open !== null)
      return
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault()
      goTo(event.key === "Home" ? 0 : last, open !== null)
      return
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      wanted.current = event.key === "ArrowDown" ? "first" : "last"
      setOpen(focused)
    }
  }

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault()
      setOpen(null)
      focusTrigger(focused)
      return
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault()
      const step = event.key === "ArrowRight" ? 1 : -1
      const next = (focused + step + menus.length) % menus.length
      setFocused(next)
      wanted.current = "first"
      setOpen(next)
      return
    }

    const keys = ["ArrowDown", "ArrowUp", "Home", "End"]

    if (!keys.includes(event.key)) {
      return
    }

    event.preventDefault()

    const items = itemNodes()
    const index = items.indexOf(document.activeElement as HTMLButtonElement)
    const last = items.length - 1
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? last
          : event.key === "ArrowDown"
            ? (index + 1) % items.length
            : (index - 1 + items.length) % items.length

    items[next]?.focus()
  }

  return (
    <>
      <style href="vibeui-menubar-002" precedence="medium">
        {STYLES}
      </style>
      <div
        ref={rootRef}
        data-vibeui-block="menubar-002"
        role="menubar"
        aria-label={menubarLabel}
        className={className}
        style={palette}
        onKeyDown={onBarKeyDown}
      >
        {menus.map((menu, index) => (
          <span key={menu.label} data-part="slot">
            <button
              type="button"
              data-part="trigger"
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={open === index}
              tabIndex={index === focused ? 0 : -1}
              onClick={() => {
                setFocused(index)
                setOpen(open === index ? null : index)
              }}
            >
              {menu.label}
            </button>
            {open === index ? (
              <div
                data-part="menu"
                role="menu"
                aria-label={menu.label}
                onKeyDown={onMenuKeyDown}
              >
                {menu.items.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    data-part="item"
                    role="menuitem"
                    disabled={item.disabled}
                    tabIndex={-1}
                    onClick={() => {
                      setOpen(null)
                      focusTrigger(index)
                    }}
                  >
                    {item.label}
                    {item.keys ? (
                      <span data-part="keys">{item.keys}</span>
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </span>
        ))}
        <span data-part="hint">{hint}</span>
      </div>
    </>
  )
}
