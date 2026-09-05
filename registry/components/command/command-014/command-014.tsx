"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Command014Tab = {
  /** Пустой id — вкладка «Всё»: она не фильтрует. */
  id: string
  label: string
}

export type Command014Entry = {
  label: string
  /** id вкладки, к которой относится результат. */
  type: string
  /** Приписка справа: путь, роль, размер. */
  hint?: string
}

export type Command014Props = Omit<ComponentProps<"div">, "children"> & {
  tabs?: Command014Tab[]
  entries?: Command014Entry[]
  placeholder?: string
  label?: string
  listLabel?: string
  /** Строка вместо списка, когда в выбранной вкладке ничего нет. */
  emptyText?: string
  /** Подсказка внизу панели про клавиши. */
  hintText?: string
  /** Строка после запуска; {command} — что открыли. */
  doneText?: string
  /** Подложка панели. Пусто — цвет по умолчанию из палитры. */
  background?: string
  accent?: string
}

// Идея компонента: результаты поиска разного рода не сваливаются в один
// список, а разложены по вкладкам с числом совпадений у каждой. Число здесь
// не украшение: оно считается по текущему запросу, поэтому видно, где искать
// дальше, ещё до переключения — пустая вкладка честно показывает нуль вместо
// того, чтобы отправить человека на пустой экран.
//
// Клавиатура разведена по осям: стрелки вверх-вниз ходят по строкам, не
// уводя фокус из поля, а влево-вправо переключают вкладки, когда фокус на
// самой вкладке. Вкладки — настоящий tablist с одним фокусируемым элементом
// (roving tabindex), поэтому Tab проносит фокус мимо ряда целиком, а не по
// одной вкладке за нажатие.
const STYLES = `
:where([data-vibeui-block="command-014"]){
--vibeui-command-014-bg:light-dark(oklch(1 0 0),oklch(0.21 0.012 265));
--vibeui-command-014-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.006 265));
--vibeui-command-014-muted:color-mix(in oklab,var(--vibeui-command-014-fg) 64%,transparent);
--vibeui-command-014-border:light-dark(oklch(0.9 0.006 265),oklch(0.35 0.012 265));
--vibeui-command-014-chip:light-dark(oklch(0.96 0.004 265),oklch(0.27 0.012 265));
--vibeui-command-014-accent:light-dark(oklch(0.55 0.19 262),oklch(0.74 0.16 262));
--vibeui-command-014-on-accent:oklch(from var(--vibeui-command-014-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-command-014-shadow:light-dark(oklch(0.2 0.03 265 / 55%),oklch(0.04 0.015 265 / 70%));
--vibeui-command-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="command-014"]{color-scheme:dark}
[data-vibeui-block="command-014"]{
display:block;box-sizing:border-box;width:100%;max-width:27rem;
background:var(--vibeui-command-014-bg);color:var(--vibeui-command-014-fg);
border:1px solid var(--vibeui-command-014-border);border-radius:0.875rem;
box-shadow:0 18px 40px -28px var(--vibeui-command-014-shadow);
font-family:var(--vibeui-command-014-font);overflow:hidden;
}
[data-vibeui-block="command-014"] *{box-sizing:border-box}
[data-vibeui-block="command-014"] [data-part="field"]{
display:flex;align-items:center;gap:0.5rem;padding:0 0.875rem;
}
[data-vibeui-block="command-014"] [data-part="glyph"]{flex:none;color:var(--vibeui-command-014-muted);font-size:0.875rem}
[data-vibeui-block="command-014"] input{
flex:1;min-width:0;height:2.875rem;
appearance:none;border:0;background:none;color:inherit;
font:inherit;font-size:0.9375rem;outline:none;
}
[data-vibeui-block="command-014"] [data-part="field"]:focus-within{box-shadow:inset 0 -2px 0 0 var(--vibeui-command-014-accent)}
[data-vibeui-block="command-014"] [data-part="tabs"]{
display:flex;flex-wrap:wrap;gap:0.25rem;
padding:0.4375rem 0.625rem;
border-block:1px solid var(--vibeui-command-014-border);
}
/* Подпись вкладки переводится и растёт: высота набирается содержимым. */
[data-vibeui-block="command-014"] [data-part="tab"]{
appearance:none;border:0;cursor:pointer;background:none;color:var(--vibeui-command-014-muted);
display:inline-flex;align-items:center;gap:0.375rem;
min-height:1.75rem;padding:0.1875rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;line-height:1.3;
transition:background-color .14s ease,color .14s ease;
}
[data-vibeui-block="command-014"] [data-part="tab"]:hover{background:color-mix(in oklab,var(--vibeui-command-014-fg) 8%,transparent)}
[data-vibeui-block="command-014"] [data-part="tab"][aria-selected="true"]{
background:color-mix(in oklab,var(--vibeui-command-014-accent) 15%,transparent);
color:var(--vibeui-command-014-fg);font-weight:600;
}
[data-vibeui-block="command-014"] [data-part="tab"]:focus-visible{outline:2px solid var(--vibeui-command-014-accent);outline-offset:1px}
[data-vibeui-block="command-014"] [data-part="tally"]{
min-width:1.125rem;padding:0 0.25rem;border-radius:999px;
background:var(--vibeui-command-014-chip);
font-size:0.6875rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="command-014"] [data-part="tab"][aria-selected="true"] [data-part="tally"]{
background:var(--vibeui-command-014-accent);color:var(--vibeui-command-014-on-accent);
}
[data-vibeui-block="command-014"] [data-part="list"]{
list-style:none;margin:0;padding:0.3125rem;max-height:15rem;overflow-y:auto;
}
[data-vibeui-block="command-014"] [data-part="row"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.5rem 0.5625rem;border-radius:0.5rem;cursor:pointer;
font-size:0.875rem;line-height:1.35;
}
/* Подсветка одна на клавиатуру и мышь: две разные читаются как две позиции. */
[data-vibeui-block="command-014"] [data-part="row"]:hover,
[data-vibeui-block="command-014"] [data-part="row"][aria-selected="true"]{
background:color-mix(in oklab,var(--vibeui-command-014-accent) 13%,transparent);
}
[data-vibeui-block="command-014"] [data-part="mark"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;border-radius:0.4375rem;
background:var(--vibeui-command-014-chip);color:var(--vibeui-command-014-muted);
}
[data-vibeui-block="command-014"] [data-part="mark"] svg{width:0.875rem;height:0.875rem;display:block}
[data-vibeui-block="command-014"] [data-part="text"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="command-014"] [data-part="hint"]{
margin-left:auto;flex:none;padding-left:0.5rem;
font-size:0.75rem;color:var(--vibeui-command-014-muted);
}
[data-vibeui-block="command-014"] [data-part="empty"]{
margin:0;padding:1.125rem 0.875rem;font-size:0.875rem;color:var(--vibeui-command-014-muted);
}
[data-vibeui-block="command-014"] [data-part="foot"]{
display:flex;align-items:center;gap:0.75rem;
padding:0.4375rem 0.875rem;border-top:1px solid var(--vibeui-command-014-border);
font-size:0.6875rem;color:var(--vibeui-command-014-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="command-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TABS: Command014Tab[] = [
  { id: "", label: "Всё" },
  { id: "page", label: "Страницы" },
  { id: "person", label: "Люди" },
  { id: "file", label: "Файлы" },
]

const DEFAULT_ENTRIES: Command014Entry[] = [
  { label: "Дорожная карта релиза", type: "page", hint: "Продукт" },
  { label: "Регламент дежурств", type: "page", hint: "Поддержка" },
  { label: "Обзор недели", type: "page", hint: "Команда" },
  { label: "Мария Ковалёва", type: "person", hint: "Дизайн" },
  { label: "Артём Соколов", type: "person", hint: "Разработка" },
  { label: "смета-2025.xlsx", type: "file", hint: "84 КБ" },
  { label: "макет-главной.fig", type: "file", hint: "2,3 МБ" },
]

/** Значок рода результата: путь SVG на каждый тип, кружок — на незнакомый. */
const MARKS: Record<string, string> = {
  page: "M4 2.5h5L12 5.5v8h-8v-11Zm5 0V6h3",
  person:
    "M8 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm-4.5 5c0-2 2-3.5 4.5-3.5s4.5 1.5 4.5 3.5",
  file: "M2.5 5.5V12a1.5 1.5 0 0 0 1.5 1.5h8A1.5 1.5 0 0 0 13.5 12V6.5H8L6.5 4.5H4a1.5 1.5 0 0 0-1.5 1.5Z",
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
 * Палитра с рядом вкладок-фильтров по роду результата и числом совпадений у
 * каждой вкладки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Command014({
  tabs = DEFAULT_TABS,
  entries = DEFAULT_ENTRIES,
  placeholder = "Поиск по рабочему пространству…",
  label = "Поиск с фильтрами",
  listLabel = "Результаты",
  emptyText = "В этой вкладке ничего нет. Загляните в соседнюю — число рядом с ней подскажет, куда.",
  hintText = "↑↓ строки · ←→ вкладки · Enter открыть",
  doneText = "Открыто: {command}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Command014Props) {
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState(tabs[0]?.id ?? "")
  const [active, setActive] = useState(0)
  const [chosen, setChosen] = useState<string | null>(null)
  const listId = useId()
  const rowId = useId()
  const tabId = useId()

  const needle = query.trim().toLowerCase()
  // Счётчики считаются по запросу, но до фильтра по вкладке: иначе у каждой
  // вкладки, кроме открытой, стоял бы нуль.
  const matched = entries.filter((entry) =>
    entry.label.toLowerCase().includes(needle),
  )
  const shown = tab ? matched.filter((entry) => entry.type === tab) : matched
  const current = shown[Math.min(active, shown.length - 1)]

  const tally = (id: string) =>
    id ? matched.filter((entry) => entry.type === id).length : matched.length

  const onFieldKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      if (shown.length === 0) return
      const step = event.key === "ArrowDown" ? 1 : -1
      setActive((index) => (index + step + shown.length) % shown.length)
      return
    }

    if (event.key === "Enter" && current) {
      event.preventDefault()
      setChosen(current.label)
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
      setActive(0)
    }
  }

  const onTabsKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return
    }

    event.preventDefault()
    const at = tabs.findIndex((entry) => entry.id === tab)
    const step = event.key === "ArrowRight" ? 1 : -1
    const next = (at + step + tabs.length) % tabs.length

    setTab(tabs[next].id)
    setActive(0)
    // Фокус переносится вручную: при roving tabindex соседняя вкладка ещё
    // не фокусируема в момент нажатия, и браузер сам его не отдаст.
    const buttons = event.currentTarget.children
    const target = buttons[next]

    if (target instanceof HTMLElement) {
      target.focus()
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-command-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-command-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-command-014" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="command"
        data-vibeui-block="command-014"
        className={className}
        style={palette}
        role="dialog"
        aria-label={label}
      >
        <div data-part="field">
          <span data-part="glyph" aria-hidden="true">
            ⌕
          </span>
          <input
            type="text"
            role="combobox"
            aria-expanded={shown.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              current ? `${rowId}-${shown.indexOf(current)}` : undefined
            }
            aria-label={placeholder}
            placeholder={placeholder}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
            }}
            onKeyDown={onFieldKeyDown}
          />
        </div>
        <div
          data-part="tabs"
          role="tablist"
          aria-label={label}
          onKeyDown={onTabsKeyDown}
        >
          {tabs.map((entry) => (
            <button
              key={entry.id || "all"}
              type="button"
              data-part="tab"
              role="tab"
              id={`${tabId}-${entry.id || "all"}`}
              aria-selected={tab === entry.id}
              aria-controls={listId}
              tabIndex={tab === entry.id ? 0 : -1}
              onClick={() => {
                setTab(entry.id)
                setActive(0)
              }}
            >
              {entry.label}
              <span data-part="tally">{tally(entry.id)}</span>
            </button>
          ))}
        </div>
        {shown.length === 0 ? (
          <p data-part="empty" id={listId}>
            {emptyText}
          </p>
        ) : (
          <ul
            id={listId}
            data-part="list"
            role="listbox"
            aria-label={listLabel}
          >
            {shown.map((entry, index) => (
              <li
                key={`${entry.type}-${entry.label}`}
                id={`${rowId}-${index}`}
                data-part="row"
                role="option"
                aria-selected={current === entry}
                onClick={() => setChosen(entry.label)}
              >
                <span data-part="mark" aria-hidden="true">
                  <svg viewBox="0 0 16 16" fill="none">
                    <path
                      d={
                        MARKS[entry.type] ??
                        "M8 3.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z"
                      }
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span data-part="text">{entry.label}</span>
                {entry.hint ? <span data-part="hint">{entry.hint}</span> : null}
              </li>
            ))}
          </ul>
        )}
        <p data-part="foot" role="status">
          {chosen ? doneText.replace("{command}", chosen) : hintText}
        </p>
      </div>
    </>
  )
}
