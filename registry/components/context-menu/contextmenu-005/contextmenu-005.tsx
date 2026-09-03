"use client"

import { useRef, useState } from "react"
import type { ComponentProps, CSSProperties, MouseEvent } from "react"

export type Contextmenu005Props = Omit<
  ComponentProps<"section">,
  "children"
> & {
  /**
   * Показать меню развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  text?: string
  emptyHint?: string
  /** Команды меню: компонент несёт русские, проект подставляет свои. */
  actions?: string[]
  /** Доступное имя блока для скринридера. */
  sectionLabel?: string
  /** Подсказка под абзацем. */
  hint?: string
  /** Подпись кнопки-дублёра и имя открытого меню. */
  menuLabel?: string
  /** Цитата в шапке меню; {text} — выделенный кусок. */
  quoteText?: string
  /** Строка отчёта; {action} — команда, {text} — выделенный кусок. */
  doneText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: меню для выделенного текста. Оно читает выделение в момент
// вызова — до этого браузер ничего не знает о том, что выбрал пользователь, —
// и показывает кусок текста в шапке: команда «перевести» без предмета перевода
// бессмысленна. Пока ничего не выделено, пункты помечены aria-disabled и
// объясняют причину, а не молча не срабатывают.
const STYLES = `
:where([data-vibeui-block="contextmenu-005"]){
--vibeui-contextmenu-005-bg:transparent;
--vibeui-contextmenu-005-surface:light-dark(oklch(1 0 0),oklch(0.24 0.013 265));
--vibeui-contextmenu-005-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.005 265));
--vibeui-contextmenu-005-muted:color-mix(in oklab,var(--vibeui-contextmenu-005-fg) 68%,transparent);
--vibeui-contextmenu-005-border:light-dark(oklch(0.9 0.006 265),oklch(0.37 0.012 265));
--vibeui-contextmenu-005-hover:light-dark(oklch(0.96 0.004 265),oklch(0.31 0.014 265));
--vibeui-contextmenu-005-accent:light-dark(oklch(0.6 0.16 60),oklch(0.78 0.14 60));
--vibeui-contextmenu-005-shadow:light-dark(oklch(0.2 0.03 265 / 50%),oklch(0 0 0 / 72%));
--vibeui-contextmenu-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-contextmenu-005-x:50%;
--vibeui-contextmenu-005-y:50%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contextmenu-005"]{color-scheme:dark}
[data-vibeui-block="contextmenu-005"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-contextmenu-005-bg);color:var(--vibeui-contextmenu-005-fg);
border:1px solid var(--vibeui-contextmenu-005-border);border-radius:1rem;
font-family:var(--vibeui-contextmenu-005-font);
}
[data-vibeui-block="contextmenu-005"] [data-part="text"]{
margin:0;font-size:0.875rem;line-height:1.55;
}
[data-vibeui-block="contextmenu-005"] [data-part="text"]::selection{
background:color-mix(in oklab,var(--vibeui-contextmenu-005-accent) 35%,transparent);
}
[data-vibeui-block="contextmenu-005"] [data-part="row"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="contextmenu-005"] [data-part="hint"]{
font-size:0.6875rem;color:var(--vibeui-contextmenu-005-muted);
}
[data-vibeui-block="contextmenu-005"] [data-part="fallback"]{
appearance:none;cursor:pointer;flex:none;
height:1.875rem;padding:0 0.75rem;
border:1px solid var(--vibeui-contextmenu-005-border);border-radius:0.5rem;
background:none;color:inherit;font:inherit;font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="contextmenu-005"] [data-part="fallback"]:hover{background:var(--vibeui-contextmenu-005-hover)}
[data-vibeui-block="contextmenu-005"] [data-part="fallback"]:focus-visible{outline:2px solid var(--vibeui-contextmenu-005-accent);outline-offset:2px}
[data-vibeui-block="contextmenu-005"] [data-part="log"]{
margin:0;font-size:0.6875rem;color:var(--vibeui-contextmenu-005-muted);min-height:1rem;
}
[data-vibeui-block="contextmenu-005"] [data-part="menu"]{
position:fixed;margin:0;padding:0.3125rem;
top:var(--vibeui-contextmenu-005-y);left:var(--vibeui-contextmenu-005-x);
min-width:12.5rem;max-width:15rem;box-sizing:border-box;
background:var(--vibeui-contextmenu-005-surface);color:var(--vibeui-contextmenu-005-fg);
border:1px solid var(--vibeui-contextmenu-005-border);border-radius:0.75rem;
box-shadow:0 18px 40px -20px var(--vibeui-contextmenu-005-shadow);
font-family:var(--vibeui-contextmenu-005-font);
}
/* Шапка показывает предмет действия: «перевести» без текста ничего не значит. */
[data-vibeui-block="contextmenu-005"] [data-part="quote"]{
padding:0.375rem 0.5rem;margin-bottom:0.25rem;
border-bottom:1px solid var(--vibeui-contextmenu-005-border);
font-size:0.6875rem;font-style:italic;color:var(--vibeui-contextmenu-005-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="contextmenu-005"] [data-part="item"]{
display:flex;align-items:center;gap:0.625rem;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="contextmenu-005"] [data-part="item"]:hover{background:var(--vibeui-contextmenu-005-hover)}
[data-vibeui-block="contextmenu-005"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-contextmenu-005-accent);outline-offset:-2px}
[data-vibeui-block="contextmenu-005"] [data-part="item"][aria-disabled="true"]{color:var(--vibeui-contextmenu-005-muted);cursor:not-allowed}
[data-vibeui-block="contextmenu-005"] [data-part="item"][aria-disabled="true"]:hover{background:none}
[data-vibeui-block="contextmenu-005"] [data-part="dot"]{
flex:none;width:0.625rem;height:0.625rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-contextmenu-005-accent) 60%,transparent);
}
/* Развёрнутый режим: меню стоит в потоке под областью, а не в верхнем слое. */
[data-vibeui-block="contextmenu-005"] [data-part="menu"][data-open="true"]{
position:static;margin-block-start:0.5rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contextmenu-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TEXT =
  "Выделите любую фразу в этом абзаце и вызовите меню правой кнопкой: команда покажет, с каким именно текстом она будет работать."

const DEFAULT_ACTIONS = [
  "Копировать",
  "Найти в сети",
  "Перевести",
  "Процитировать",
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
 * Контекстное меню выделенного текста: читает выделение и показывает его в шапке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Contextmenu005({
  open = false,
  text = DEFAULT_TEXT,
  emptyHint = "Ничего не выделено",
  actions = DEFAULT_ACTIONS,
  sectionLabel = "Текст с меню выделения",
  hint = "правый клик по абзацу",
  menuLabel = "Действия с выделением",
  quoteText = "«{text}»",
  doneText = "{action}: «{text}»",
  background = "",
  accent,
  className,
  style,
  ...props
}: Contextmenu005Props) {
  const menu = useRef<HTMLDivElement>(null)
  const [picked, setPicked] = useState("")
  const [spot, setSpot] = useState<{ x: string; y: string } | null>(null)
  const [done, setDone] = useState("")

  // Выделение известно только в момент вызова: читаем его здесь, а не в рендере.
  const openAt = (x: number, y: number) => {
    setPicked(window.getSelection()?.toString().trim() ?? "")
    setSpot({ x: `${Math.round(x)}px`, y: `${Math.round(y)}px` })
    menu.current?.showPopover()
    requestAnimationFrame(() =>
      menu.current?.querySelector<HTMLElement>('[data-part="item"]')?.focus(),
    )
  }

  const run = (action: string) => {
    if (!picked) {
      return
    }

    setDone(doneText.replace("{action}", action).replace("{text}", picked))
    menu.current?.hidePopover()
  }

  const palette = {
    ...(accent ? { "--vibeui-contextmenu-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-contextmenu-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...(spot
      ? {
          "--vibeui-contextmenu-005-x": spot.x,
          "--vibeui-contextmenu-005-y": spot.y,
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contextmenu-005" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="context-menu"
        data-vibeui-block="contextmenu-005"
        aria-label={sectionLabel}
        className={className}
        style={palette}
      >
        <p
          data-part="text"
          onContextMenu={(event: MouseEvent<HTMLParagraphElement>) => {
            event.preventDefault()
            openAt(event.clientX, event.clientY)
          }}
        >
          {text}
        </p>
        <div data-part="row">
          <span data-part="hint">{hint}</span>
          <button
            type="button"
            data-part="fallback"
            aria-haspopup="menu"
            onClick={(event) => {
              const box = event.currentTarget.getBoundingClientRect()
              openAt(box.left, box.bottom + 6)
            }}
          >
            {menuLabel}
          </button>
        </div>
        <p data-part="log" role="status">
          {done}
        </p>
        <div
          ref={menu}
          data-part="menu"
          popover={open ? undefined : "auto"}
          data-open={open || undefined}
          role="menu"
          aria-label={menuLabel}
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
          <div data-part="quote">
            {picked ? quoteText.replace("{text}", picked) : emptyHint}
          </div>
          {actions.map((action) => (
            <button
              key={action}
              type="button"
              role="menuitem"
              data-part="item"
              aria-disabled={picked ? undefined : true}
              onClick={() => run(action)}
            >
              <span data-part="dot" aria-hidden="true" />
              {action}
            </button>
          ))}
        </div>
      </section>
    </>
  )
}
