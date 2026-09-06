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
  /**
   * Показать первое меню развёрнутым в потоке строки: витрина, скриншот,
   * отладка. Дальше строка живёт как обычно: клик и клавиши закрывают меню.
   */
  open?: boolean
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
--vibeui-menubar-002-panel:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-menubar-002-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-menubar-002-muted:color-mix(in oklab,var(--vibeui-menubar-002-fg) 68%,transparent);
--vibeui-menubar-002-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-menubar-002-hover:light-dark(oklch(0.55 0 265 / 10%),oklch(0.88 0 265 / 14%));
--vibeui-menubar-002-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-menubar-002-shadow:light-dark(oklch(0.2 0 265 / 45%),oklch(0 0 0 / 62%));
--vibeui-menubar-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="menubar-002"]{color-scheme:dark}
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
/* Развёрнутый режим: меню стоит в потоке под своей кнопкой, а не поверх соседей. */
[data-vibeui-block="menubar-002"] [data-part="menu"][data-open="true"]{
position:static;margin-block-start:0.375rem;
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
      { label: "Новый проект", keys: "Ctrl+N" },
      { label: "Открыть…", keys: "Ctrl+O" },
      { label: "Сохранить", keys: "Ctrl+S" },
      { label: "Вернуть версию", disabled: true },
    ],
  },
  {
    label: "Правка",
    items: [
      { label: "Отменить", keys: "Ctrl+Z" },
      { label: "Повторить", keys: "Shift+Ctrl+Z" },
      { label: "Найти в проекте", keys: "Ctrl+F" },
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
  open = false,
  menus = DEFAULT_MENUS,
  menubarLabel = "Меню приложения",
  hint = "← → между разделами",
  background = "",
  accent,
  className,
  style,
}: Menubar002Props) {
  const [active, setActive] = useState<number | null>(open ? 0 : null)
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
    if (active === null) {
      return
    }

    function onOutside(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setActive(null)
      }
    }

    document.addEventListener("pointerdown", onOutside)
    return () => document.removeEventListener("pointerdown", onOutside)
  }, [active])

  // Фокус на пункт ставится после отрисовки списка: до неё узла ещё нет.
  useEffect(() => {
    const mode = wanted.current
    wanted.current = null

    if (active === null || !mode) {
      return
    }

    const items = itemNodes()
    ;(mode === "first" ? items[0] : items[items.length - 1])?.focus()
  }, [active])

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
      setActive(index)
    }
  }

  function onBarKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = menus.length - 1

    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault()
      const step = event.key === "ArrowRight" ? 1 : -1
      goTo((focused + step + menus.length) % menus.length, active !== null)
      return
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault()
      goTo(event.key === "Home" ? 0 : last, active !== null)
      return
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      wanted.current = event.key === "ArrowDown" ? "first" : "last"
      setActive(focused)
    }
  }

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault()
      setActive(null)
      focusTrigger(focused)
      return
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault()
      const step = event.key === "ArrowRight" ? 1 : -1
      const next = (focused + step + menus.length) % menus.length
      setFocused(next)
      wanted.current = "first"
      setActive(next)
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
        data-slot="menubar"
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
              aria-expanded={active === index}
              tabIndex={index === focused ? 0 : -1}
              onClick={() => {
                setFocused(index)
                setActive(active === index ? null : index)
              }}
            >
              {menu.label}
            </button>
            {active === index ? (
              <div
                data-part="menu"
                data-open={open || undefined}
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
                      setActive(null)
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
