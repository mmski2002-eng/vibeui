"use client"

import { useRef, useState } from "react"
import type { ComponentProps, CSSProperties, MouseEvent } from "react"

export type Contextmenu007Props = Omit<
  ComponentProps<"section">,
  "children"
> & {
  /**
   * Показать меню развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  caption?: string
  columns?: string[]
  /** Ячейки по имени колонки: компонент несёт русские, проект подставляет свои. */
  cells?: Record<string, string[]>
  /** Подпись кнопки вызова; {count} — число видимых колонок. */
  buttonText?: string
  /** Доступное имя меню. */
  menuLabel?: string
  /** Заголовок внутри меню. */
  menuTitle?: string
  /** Пояснение, почему последняя колонка не выключается. */
  lockNote?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: меню видимости колонок, которое вызывается правым кликом по
// шапке таблицы — там, где о колонках и думают. Нажатие не закрывает меню:
// колонки прячут пачкой. Последняя оставшаяся колонка выключена, потому что
// таблица без колонок — это пустой прямоугольник, из которого нечем вернуться.
// Кнопка «Колонки» дублирует вызов: правого клика на телефоне нет.
const STYLES = `
:where([data-vibeui-block="contextmenu-007"]){
--vibeui-contextmenu-007-bg:transparent;
--vibeui-contextmenu-007-surface:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-contextmenu-007-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-contextmenu-007-muted:color-mix(in oklab,var(--vibeui-contextmenu-007-fg) 68%,transparent);
--vibeui-contextmenu-007-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-contextmenu-007-hover:light-dark(oklch(0.97 0 265),oklch(0.3 0 265));
--vibeui-contextmenu-007-accent:light-dark(oklch(0.56 0.15 195),oklch(0.76 0.12 195));
--vibeui-contextmenu-007-oncheck:light-dark(oklch(1 0 0),oklch(0.19 0.02 195));
--vibeui-contextmenu-007-shadow:light-dark(oklch(0.2 0 265 / 50%),oklch(0 0 0 / 72%));
--vibeui-contextmenu-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-contextmenu-007-x:50%;
--vibeui-contextmenu-007-y:50%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contextmenu-007"]{color-scheme:dark}
[data-vibeui-block="contextmenu-007"]{
display:block;width:100%;max-width:26rem;box-sizing:border-box;
background:var(--vibeui-contextmenu-007-bg);color:var(--vibeui-contextmenu-007-fg);
border:1px solid var(--vibeui-contextmenu-007-border);border-radius:0.875rem;
font-family:var(--vibeui-contextmenu-007-font);overflow:hidden;
}
[data-vibeui-block="contextmenu-007"] [data-part="bar"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.5rem 0.5rem 0.5rem 0.875rem;
border-bottom:1px solid var(--vibeui-contextmenu-007-border);
}
[data-vibeui-block="contextmenu-007"] [data-part="caption"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="contextmenu-007"] [data-part="button"]{
appearance:none;cursor:pointer;
height:1.875rem;padding:0 0.75rem;
border:1px solid var(--vibeui-contextmenu-007-border);border-radius:0.5rem;
background:none;color:inherit;font:inherit;font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="contextmenu-007"] [data-part="button"]:hover{background:var(--vibeui-contextmenu-007-hover)}
[data-vibeui-block="contextmenu-007"] [data-part="button"]:focus-visible{outline:2px solid var(--vibeui-contextmenu-007-accent);outline-offset:2px}
[data-vibeui-block="contextmenu-007"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="contextmenu-007"] thead{touch-action:manipulation}
[data-vibeui-block="contextmenu-007"] th{
padding:0.5rem 0.875rem;text-align:left;font-size:0.6875rem;font-weight:650;
letter-spacing:0.04em;text-transform:uppercase;color:var(--vibeui-contextmenu-007-muted);
border-bottom:1px solid var(--vibeui-contextmenu-007-border);
background:var(--vibeui-contextmenu-007-hover);cursor:context-menu;
}
[data-vibeui-block="contextmenu-007"] td{
padding:0.5rem 0.875rem;border-bottom:1px solid var(--vibeui-contextmenu-007-border);
}
[data-vibeui-block="contextmenu-007"] tbody tr:last-child td{border-bottom:0}
[data-vibeui-block="contextmenu-007"] [data-part="menu"]{
position:fixed;margin:0;padding:0.3125rem;
top:var(--vibeui-contextmenu-007-y);left:var(--vibeui-contextmenu-007-x);
min-width:12.5rem;box-sizing:border-box;
background:var(--vibeui-contextmenu-007-surface);color:var(--vibeui-contextmenu-007-fg);
border:1px solid var(--vibeui-contextmenu-007-border);border-radius:0.75rem;
box-shadow:0 18px 40px -20px var(--vibeui-contextmenu-007-shadow);
font-family:var(--vibeui-contextmenu-007-font);
}
[data-vibeui-block="contextmenu-007"] [data-part="head"]{
padding:0.375rem 0.5rem 0.3125rem;margin-bottom:0.25rem;
border-bottom:1px solid var(--vibeui-contextmenu-007-border);
font-size:0.6875rem;font-weight:650;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-contextmenu-007-muted);
}
[data-vibeui-block="contextmenu-007"] [data-part="item"]{
display:flex;align-items:center;gap:0.625rem;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="contextmenu-007"] [data-part="item"]:hover{background:var(--vibeui-contextmenu-007-hover)}
[data-vibeui-block="contextmenu-007"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-contextmenu-007-accent);outline-offset:-2px}
[data-vibeui-block="contextmenu-007"] [data-part="item"][aria-disabled="true"]{cursor:not-allowed;color:var(--vibeui-contextmenu-007-muted)}
[data-vibeui-block="contextmenu-007"] [data-part="box"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.0625rem;height:1.0625rem;box-sizing:border-box;
border:1.5px solid var(--vibeui-contextmenu-007-border);border-radius:0.3125rem;
transition:background-color .14s ease,border-color .14s ease;
}
[data-vibeui-block="contextmenu-007"] [data-part="item"][aria-checked="true"] [data-part="box"]{
background:var(--vibeui-contextmenu-007-accent);border-color:var(--vibeui-contextmenu-007-accent);
}
[data-vibeui-block="contextmenu-007"] [data-part="box"] svg{width:0.75rem;height:0.75rem;opacity:0;color:var(--vibeui-contextmenu-007-oncheck)}
[data-vibeui-block="contextmenu-007"] [data-part="item"][aria-checked="true"] [data-part="box"] svg{opacity:1}
[data-vibeui-block="contextmenu-007"] [data-part="note"]{
padding:0.375rem 0.5rem 0.1875rem;margin-top:0.3125rem;
border-top:1px solid var(--vibeui-contextmenu-007-border);
font-size:0.6875rem;color:var(--vibeui-contextmenu-007-muted);
}
/* Развёрнутый режим: меню стоит в потоке под таблицей, а не в верхнем слое. */
[data-vibeui-block="contextmenu-007"] [data-part="menu"][data-open="true"]{
position:static;margin-block-start:0.5rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contextmenu-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS = ["Задача", "Статус", "Автор", "Срок"]

const DEFAULT_CELLS: Record<string, string[]> = {
  Задача: ["Свести отчёт", "Обновить прайс", "Проверить оплату"],
  Статус: ["В работе", "Готово", "Ждёт"],
  Автор: ["Вера", "Игорь", "Аня"],
  Срок: ["12.03", "14.03", "18.03"],
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
 * Контекстное меню шапки таблицы с чекбоксами видимости колонок.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Contextmenu007({
  open = false,
  caption = "План недели",
  columns = DEFAULT_COLUMNS,
  cells = DEFAULT_CELLS,
  buttonText = "Колонки: {count}",
  menuLabel = "Видимость колонок",
  menuTitle = "Колонки",
  lockNote = "Последнюю колонку скрыть нельзя",
  background = "",
  accent,
  className,
  style,
  ...props
}: Contextmenu007Props) {
  const menu = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(columns)
  const [spot, setSpot] = useState<{ x: string; y: string } | null>(null)

  const openAt = (x: number, y: number) => {
    setSpot({ x: `${Math.round(x)}px`, y: `${Math.round(y)}px` })
    menu.current?.showPopover()
    requestAnimationFrame(() =>
      menu.current?.querySelector<HTMLElement>('[data-part="item"]')?.focus(),
    )
  }

  const toggle = (column: string) => {
    if (shown.length === 1 && shown.includes(column)) {
      return
    }

    setShown((current) =>
      current.includes(column)
        ? current.filter((entry) => entry !== column)
        : columns.filter(
            (entry) => current.includes(entry) || entry === column,
          ),
    )
  }

  const palette = {
    ...(accent ? { "--vibeui-contextmenu-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-contextmenu-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...(spot
      ? {
          "--vibeui-contextmenu-007-x": spot.x,
          "--vibeui-contextmenu-007-y": spot.y,
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contextmenu-007" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="context-menu"
        data-vibeui-block="contextmenu-007"
        aria-label={caption}
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <span data-part="caption">{caption}</span>
          <button
            type="button"
            data-part="button"
            aria-haspopup="menu"
            onClick={(event) => {
              const box = event.currentTarget.getBoundingClientRect()
              openAt(box.left - 80, box.bottom + 6)
            }}
          >
            {buttonText.replace("{count}", String(shown.length))}
          </button>
        </div>
        <table>
          <thead
            onContextMenu={(event: MouseEvent<HTMLTableSectionElement>) => {
              event.preventDefault()
              openAt(event.clientX, event.clientY)
            }}
          >
            <tr>
              {shown.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2].map((index) => (
              <tr key={index}>
                {shown.map((column) => (
                  <td key={column}>{cells[column]?.[index] ?? "—"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
          <div data-part="head">{menuTitle}</div>
          {columns.map((column) => {
            const checked = shown.includes(column)
            const locked = checked && shown.length === 1

            return (
              <button
                key={column}
                type="button"
                role="menuitemcheckbox"
                aria-checked={checked}
                aria-disabled={locked || undefined}
                data-part="item"
                onClick={() => toggle(column)}
              >
                <span data-part="box" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12.5l4.5 4.5L19 7"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {column}
              </button>
            )
          })}
          <p data-part="note">{lockNote}</p>
        </div>
      </section>
    </>
  )
}
