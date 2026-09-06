"use client"

import { useRef, useState } from "react"
import type { ComponentProps, CSSProperties, MouseEvent } from "react"

export type Contextmenu004Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  /**
   * Показать меню развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  title?: string
  cards?: string[]
  /** Подписи пунктов правки: компонент несёт русские, проект подставляет свои. */
  actionText?: Record<"cut" | "copy" | "paste", string>
  /** Подпись кнопки вызова меню на карточке. */
  menuButtonLabel?: string
  /** Имя кнопки для скринридера; {card} — название карточки. */
  cardMenuLabel?: string
  /** Имя открытого меню; {card} — название карточки. */
  menuLabel?: string
  /** Имя меню, когда цель ещё не выбрана. */
  menuTitle?: string
  bufferLabel?: string
  bufferEmpty?: string
  /** Подсказка у выключенной вставки. */
  pasteDisabledHint?: string
  /** Имя копии; {name} — исходное название карточки. */
  copyText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: контекстное меню буфера обмена, где «вставить» действительно
// выключено, пока копировать нечего. Пункт без состояния врёт: пользователь
// жмёт «вставить», ничего не происходит, и он винит себя. Здесь буфер живёт в
// состоянии компонента, его содержимое написано в шапке меню, а вырезанная
// карточка исчезает из списка — вставка возвращает её на новое место.
const STYLES = `
:where([data-vibeui-block="contextmenu-004"]){
--vibeui-contextmenu-004-bg:transparent;
--vibeui-contextmenu-004-surface:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-contextmenu-004-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-contextmenu-004-muted:color-mix(in oklab,var(--vibeui-contextmenu-004-fg) 68%,transparent);
--vibeui-contextmenu-004-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-contextmenu-004-hover:light-dark(oklch(0.96 0 265),oklch(0.31 0 265));
--vibeui-contextmenu-004-accent:light-dark(oklch(0.58 0.17 300),oklch(0.76 0.14 300));
--vibeui-contextmenu-004-shadow:light-dark(oklch(0.2 0 265 / 50%),oklch(0 0 0 / 72%));
--vibeui-contextmenu-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-contextmenu-004-x:50%;
--vibeui-contextmenu-004-y:50%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contextmenu-004"]{color-scheme:dark}
[data-vibeui-block="contextmenu-004"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-contextmenu-004-bg);color:var(--vibeui-contextmenu-004-fg);
border:1px solid var(--vibeui-contextmenu-004-border);border-radius:1rem;
font-family:var(--vibeui-contextmenu-004-font);
}
[data-vibeui-block="contextmenu-004"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="contextmenu-004"] [data-part="list"]{
display:flex;flex-direction:column;gap:0.375rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="contextmenu-004"] [data-part="card"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.5rem 0.625rem;box-sizing:border-box;
border:1px solid var(--vibeui-contextmenu-004-border);border-radius:0.625rem;
font-size:0.8125rem;touch-action:manipulation;
transition:border-color .14s ease;
}
[data-vibeui-block="contextmenu-004"] [data-part="card"][data-active="true"]{border-color:var(--vibeui-contextmenu-004-accent)}
[data-vibeui-block="contextmenu-004"] [data-part="grip"]{
flex:none;width:0.375rem;height:1rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-contextmenu-004-accent) 45%,transparent);
}
[data-vibeui-block="contextmenu-004"] [data-part="menu-button"]{
appearance:none;cursor:pointer;margin-left:auto;flex:none;
height:1.5rem;padding:0 0.4375rem;
border:1px solid var(--vibeui-contextmenu-004-border);border-radius:0.4375rem;
background:none;color:var(--vibeui-contextmenu-004-muted);font:inherit;font-size:0.6875rem;
}
[data-vibeui-block="contextmenu-004"] [data-part="menu-button"]:hover{background:var(--vibeui-contextmenu-004-hover)}
[data-vibeui-block="contextmenu-004"] [data-part="menu-button"]:focus-visible{outline:2px solid var(--vibeui-contextmenu-004-accent);outline-offset:1px}
[data-vibeui-block="contextmenu-004"] [data-part="buffer"]{
display:flex;align-items:center;gap:0.375rem;
margin:0;font-size:0.6875rem;color:var(--vibeui-contextmenu-004-muted);
}
[data-vibeui-block="contextmenu-004"] [data-part="chip"]{
padding:0.125rem 0.4375rem;border-radius:9999px;
background:var(--vibeui-contextmenu-004-hover);color:var(--vibeui-contextmenu-004-fg);
font-weight:600;
}
[data-vibeui-block="contextmenu-004"] [data-part="menu"]{
position:fixed;margin:0;padding:0.3125rem;
top:var(--vibeui-contextmenu-004-y);left:var(--vibeui-contextmenu-004-x);
min-width:12.5rem;box-sizing:border-box;
background:var(--vibeui-contextmenu-004-surface);color:var(--vibeui-contextmenu-004-fg);
border:1px solid var(--vibeui-contextmenu-004-border);border-radius:0.75rem;
box-shadow:0 18px 40px -20px var(--vibeui-contextmenu-004-shadow);
font-family:var(--vibeui-contextmenu-004-font);
}
[data-vibeui-block="contextmenu-004"] [data-part="head"]{
padding:0.375rem 0.5rem 0.3125rem;margin-bottom:0.25rem;
border-bottom:1px solid var(--vibeui-contextmenu-004-border);
font-size:0.6875rem;color:var(--vibeui-contextmenu-004-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="contextmenu-004"] [data-part="item"]{
display:flex;align-items:center;justify-content:space-between;gap:1.25rem;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="contextmenu-004"] [data-part="item"]:hover{background:var(--vibeui-contextmenu-004-hover)}
[data-vibeui-block="contextmenu-004"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-contextmenu-004-accent);outline-offset:-2px}
/* Выключенный пункт остаётся видимым и фокусируемым: он объясняет, почему нельзя. */
[data-vibeui-block="contextmenu-004"] [data-part="item"][aria-disabled="true"]{
color:var(--vibeui-contextmenu-004-muted);cursor:not-allowed;
}
[data-vibeui-block="contextmenu-004"] [data-part="item"][aria-disabled="true"]:hover{background:none}
[data-vibeui-block="contextmenu-004"] [data-part="keys"]{font-size:0.6875rem;color:var(--vibeui-contextmenu-004-muted)}
/* Развёрнутый режим: меню стоит в потоке под областью, а не в верхнем слое. */
[data-vibeui-block="contextmenu-004"] [data-part="menu"][data-open="true"]{
position:static;margin-block-start:0.5rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contextmenu-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CARDS = ["Бриф клиента", "Сценарий ролика", "Смета на съёмку"]

const DEFAULT_ACTION_TEXT: Record<"cut" | "copy" | "paste", string> = {
  cut: "Вырезать",
  copy: "Копировать",
  paste: "Вставить",
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
 * Контекстное меню буфера обмена: вырезать, копировать и вставить с состоянием.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Contextmenu004({
  open = false,
  title = "Доска",
  cards = DEFAULT_CARDS,
  actionText = DEFAULT_ACTION_TEXT,
  menuButtonLabel = "меню",
  cardMenuLabel = "Меню: {card}",
  menuLabel = "Правка: {card}",
  menuTitle = "Правка",
  bufferLabel = "Буфер:",
  bufferEmpty = "пуст",
  pasteDisabledHint = "буфер пуст",
  copyText = "{name} — копия",
  background = "",
  accent,
  className,
  style,
  ...props
}: Contextmenu004Props) {
  const menu = useRef<HTMLDivElement>(null)
  const [list, setList] = useState(cards)
  const [buffer, setBuffer] = useState<string | null>(null)
  const [target, setTarget] = useState<string | null>(null)
  const [spot, setSpot] = useState<{ x: string; y: string } | null>(null)

  const openAt = (x: number, y: number, card: string) => {
    setTarget(card)
    setSpot({ x: `${Math.round(x)}px`, y: `${Math.round(y)}px` })
    menu.current?.showPopover()
    requestAnimationFrame(() =>
      menu.current?.querySelector<HTMLElement>('[data-part="item"]')?.focus(),
    )
  }

  const close = () => menu.current?.hidePopover()

  const cut = () => {
    if (target) {
      setBuffer(target)
      setList((current) => current.filter((card) => card !== target))
    }

    close()
  }

  const copy = () => {
    setBuffer(target)
    close()
  }

  const paste = () => {
    if (!buffer || !target) {
      return
    }

    setList((current) => {
      const at = current.indexOf(target)
      const next = [...current]
      next.splice(at + 1, 0, copyText.replace("{name}", buffer))
      return next
    })
    close()
  }

  const palette = {
    ...(accent ? { "--vibeui-contextmenu-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-contextmenu-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...(spot
      ? {
          "--vibeui-contextmenu-004-x": spot.x,
          "--vibeui-contextmenu-004-y": spot.y,
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contextmenu-004" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="context-menu"
        data-vibeui-block="contextmenu-004"
        aria-label={title}
        className={className}
        style={palette}
      >
        <h3 data-part="title">{title}</h3>
        <ul data-part="list">
          {list.map((card) => (
            <li
              key={card}
              data-part="card"
              data-active={target === card || undefined}
              onContextMenu={(event: MouseEvent<HTMLLIElement>) => {
                event.preventDefault()
                openAt(event.clientX, event.clientY, card)
              }}
            >
              <span data-part="grip" aria-hidden="true" />
              {card}
              <button
                type="button"
                data-part="menu-button"
                aria-haspopup="menu"
                aria-label={cardMenuLabel.replace("{card}", card)}
                onClick={(event) => {
                  const box = event.currentTarget.getBoundingClientRect()
                  openAt(box.left, box.bottom + 4, card)
                }}
              >
                {menuButtonLabel}
              </button>
            </li>
          ))}
        </ul>
        <p data-part="buffer" role="status">
          {bufferLabel}
          <span data-part="chip">{buffer ?? bufferEmpty}</span>
        </p>
        <div
          ref={menu}
          data-part="menu"
          popover={open ? undefined : "auto"}
          data-open={open || undefined}
          role="menu"
          aria-label={target ? menuLabel.replace("{card}", target) : menuTitle}
          onKeyDown={(event) => {
            if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
              return
            }

            event.preventDefault()
            const items = Array.from(
              menu.current?.querySelectorAll<HTMLElement>(
                '[data-part="item"]',
              ) ?? [],
            )

            if (items.length === 0) {
              return
            }

            const delta = event.key === "ArrowDown" ? 1 : -1
            const from = items.indexOf(document.activeElement as HTMLElement)
            items[(from + delta + items.length) % items.length].focus()
          }}
        >
          <div data-part="head">{target}</div>
          <button type="button" role="menuitem" data-part="item" onClick={cut}>
            {actionText.cut}
            <span data-part="keys">Ctrl+X</span>
          </button>
          <button type="button" role="menuitem" data-part="item" onClick={copy}>
            {actionText.copy}
            <span data-part="keys">Ctrl+C</span>
          </button>
          <button
            type="button"
            role="menuitem"
            data-part="item"
            aria-disabled={buffer === null}
            onClick={paste}
          >
            {actionText.paste}
            <span data-part="keys">
              {buffer === null ? pasteDisabledHint : "Ctrl+V"}
            </span>
          </button>
        </div>
      </section>
    </>
  )
}
