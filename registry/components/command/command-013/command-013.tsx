"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Command013Entry = {
  label: string
  /** Приписка справа: раздел, путь, тип результата. */
  hint?: string
}

export type Command013Props = Omit<ComponentProps<"div">, "children"> & {
  entries?: Command013Entry[]
  placeholder?: string
  label?: string
  /** Заголовок списка обычных результатов. */
  listLabel?: string
  /** Приставка первой строки; за ней идёт введённый текст. */
  askLabel?: string
  /** Первая строка, пока запрос пуст. */
  askIdleText?: string
  /** Строка вместо списка, когда совпадений нет. */
  emptyText?: string
  /** Подсказка внизу панели про клавиши. */
  hintText?: string
  /** Строка после запуска; {command} — что запустили. */
  doneText?: string
  /** Подложка панели. Пусто — цвет по умолчанию из палитры. */
  /** Подпись кнопки, которая открывает палитру. */
  triggerLabel?: string
  /**
   * Показать палитру раскрытой в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  defaultOpen?: boolean
  /** id всплывающего слоя: на странице он обязан быть уникальным. */
  menuId?: string
  background?: string
  accent?: string
}

// Идея компонента: в палитре, где есть ассистент, вопрос никогда не остаётся
// без ответа. Первой строкой всегда стоит «Спросить ИИ: <введённый текст>» —
// она не фильтруется вместе с остальными и потому не исчезает на запросе,
// под который нет ни одной команды. Именно этот случай и есть повод спросить
// модель, а обычная палитра отвечает на него «ничего не найдено».
//
// Отсюда порядок клавиатуры: активной по умолчанию стоит строка ИИ, поэтому
// Enter сразу после ввода уходит к ассистенту, а стрелка вниз опускает выбор
// к точным совпадениям. Строка ИИ размечена отдельной частью и своей иконкой:
// это другой род действия, чем переход по каталогу, и выглядеть как соседняя
// строка списка он не должен.
const STYLES = `
:where([data-vibeui-block="command-013"]){
--vibeui-command-013-bg:light-dark(oklch(1 0 0),oklch(0.21 0 265));
--vibeui-command-013-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-command-013-muted:color-mix(in oklab,var(--vibeui-command-013-fg) 64%,transparent);
--vibeui-command-013-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-command-013-accent:light-dark(oklch(0.56 0.2 39.8),oklch(0.76 0.16 39.8));
--vibeui-command-013-on-accent:oklch(from var(--vibeui-command-013-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-command-013-shadow:light-dark(oklch(0.2 0 265 / 55%),oklch(0.04 0 265 / 70%));
--vibeui-command-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="command-013"]{color-scheme:dark}
[data-vibeui-block="command-013"]{
display:block;box-sizing:border-box;width:100%;max-width:26rem;
background:var(--vibeui-command-013-bg);color:var(--vibeui-command-013-fg);
border:1px solid var(--vibeui-command-013-border);border-radius:0.875rem;
box-shadow:0 18px 40px -28px var(--vibeui-command-013-shadow);
font-family:var(--vibeui-command-013-font);overflow:hidden;
}
[data-vibeui-block="command-013"] *{box-sizing:border-box}
[data-vibeui-block="command-013"] [data-part="field"]{
display:flex;align-items:center;gap:0.5rem;
padding:0 0.875rem;border-bottom:1px solid var(--vibeui-command-013-border);
}
[data-vibeui-block="command-013"] [data-part="glyph"]{flex:none;color:var(--vibeui-command-013-muted);font-size:0.875rem}
[data-vibeui-block="command-013"] input{
flex:1;min-width:0;height:2.875rem;
appearance:none;border:0;background:none;color:inherit;
font:inherit;font-size:0.9375rem;outline:none;
}
[data-vibeui-block="command-013"] [data-part="field"]:focus-within{box-shadow:inset 0 -2px 0 0 var(--vibeui-command-013-accent)}
[data-vibeui-block="command-013"] [data-part="list"]{
list-style:none;margin:0;padding:0.3125rem;max-height:16rem;overflow-y:auto;
}
[data-vibeui-block="command-013"] [data-part="group"]{
padding:0.5rem 0.5625rem 0.25rem;margin:0;
font-size:0.6875rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;
color:var(--vibeui-command-013-muted);
}
[data-vibeui-block="command-013"] [data-part="row"],
[data-vibeui-block="command-013"] [data-part="ask"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.5rem 0.5625rem;border-radius:0.5rem;cursor:pointer;
font-size:0.875rem;line-height:1.35;
}
/* Подсветка одна на клавиатуру и мышь: две разные читаются как две позиции. */
[data-vibeui-block="command-013"] [data-part="row"]:hover,
[data-vibeui-block="command-013"] [data-part="row"][aria-selected="true"],
[data-vibeui-block="command-013"] [data-part="ask"]:hover,
[data-vibeui-block="command-013"] [data-part="ask"][aria-selected="true"]{
background:color-mix(in oklab,var(--vibeui-command-013-accent) 14%,transparent);
}
/* Строка ИИ — другой род действия: у неё своя иконка на заливке акцента. */
[data-vibeui-block="command-013"] [data-part="spark"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;border-radius:0.4375rem;
background:var(--vibeui-command-013-accent);color:var(--vibeui-command-013-on-accent);
}
[data-vibeui-block="command-013"] [data-part="spark"] svg{width:0.875rem;height:0.875rem;display:block}
[data-vibeui-block="command-013"] [data-part="mark"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;color:var(--vibeui-command-013-muted);
}
[data-vibeui-block="command-013"] [data-part="mark"] svg{width:0.875rem;height:0.875rem;display:block}
[data-vibeui-block="command-013"] [data-part="text"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="command-013"] [data-part="ask"] [data-part="text"] b{font-weight:650}
[data-vibeui-block="command-013"] [data-part="hint"]{
margin-left:auto;flex:none;padding-left:0.5rem;
font-size:0.75rem;color:var(--vibeui-command-013-muted);
}
[data-vibeui-block="command-013"] [data-part="empty"]{
margin:0;padding:0.625rem 0.5625rem 0.75rem;
font-size:0.8125rem;color:var(--vibeui-command-013-muted);
}
[data-vibeui-block="command-013"] [data-part="foot"]{
display:flex;align-items:center;gap:0.75rem;
padding:0.4375rem 0.875rem;border-top:1px solid var(--vibeui-command-013-border);
font-size:0.6875rem;color:var(--vibeui-command-013-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="command-013"] *{animation:none!important;transition:none!important}}
/* Оболочка: в потоке видна только кнопка, панель всплывает под ней в
   верхнем слое нативного popover — карточка каталога её не обрезает,
   Esc и клик мимо достаются от браузера. */
[data-vibeui-shell="command-013"]{
display:inline-flex;box-sizing:border-box;
font-family:var(--vibeui-command-013-font,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-shell="command-013"]{color-scheme:dark}
[data-vibeui-shell="command-013"] [data-part="open"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.625rem;
min-height:2.375rem;padding:0 0.875rem;box-sizing:border-box;
border:1px solid light-dark(oklch(0.88 0 265),oklch(0.36 0 265));
border-radius:0.625rem;
background:light-dark(oklch(1 0 0),oklch(0.24 0.01 265));
color:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
font:inherit;font-size:0.875rem;font-weight:650;line-height:1;
transition:border-color .16s ease;
}
[data-vibeui-shell="command-013"] [data-part="open"]:hover{
border-color:light-dark(oklch(0.6 0 265),oklch(0.55 0 265));
}
[data-vibeui-shell="command-013"] [data-part="open"]:focus-visible{
outline:2px solid light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));outline-offset:2px;
}
[data-vibeui-shell="command-013"] [data-part="open"] kbd{
font:inherit;font-size:0.75rem;
padding:0.125rem 0.375rem;border-radius:0.3125rem;
border:1px solid light-dark(oklch(0.88 0 265),oklch(0.4 0 265));
color:color-mix(in oklab,currentColor 70%,transparent);
}
[data-vibeui-menu="command-013"]{
margin:auto;padding:0;border:0;background:none;overflow:visible;
width:max-content;max-width:min(92vw,34rem);
}
/* Где anchor поддержан — панель висит под кнопкой; где нет — остаётся
   по центру экрана силами самого popover. */
@supports (anchor-name: --vibeui-command-013-anchor){
[data-vibeui-shell="command-013"] [data-part="open"]{anchor-name:--vibeui-command-013-anchor}
[data-vibeui-menu="command-013"]{
position-anchor:--vibeui-command-013-anchor;
position-area:block-end span-inline-end;
margin:0.375rem 0 0;
position-try-fallbacks:flip-block;
}
}
/* Развёрнутый режим витрины: панель стоит в потоке под кнопкой. Только пока
   popover закрыт — у открытого положение задаёт верхний слой. */
[data-vibeui-shell="command-013"]:has([data-open="true"]:not(:popover-open)){
flex-direction:column;align-items:flex-start;
}
[data-vibeui-menu="command-013"][data-open="true"]:not(:popover-open){
position:static;margin:0.375rem 0 0;
}
[data-vibeui-shell="command-013"] dialog::backdrop{
background:oklch(0 0 0 / 45%);
}

`

const DEFAULT_ENTRIES: Command013Entry[] = [
  { label: "Создать документ", hint: "Действие" },
  { label: "Пригласить в команду", hint: "Действие" },
  { label: "Отчёт за квартал", hint: "Документ" },
  { label: "Настройки уведомлений", hint: "Настройки" },
  { label: "Мария Ковалёва", hint: "Человек" },
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
 * Командная палитра, где первой строкой всегда стоит вопрос к ассистенту, а
 * ниже — обычные совпадения.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Command013({
  entries = DEFAULT_ENTRIES,
  placeholder = "Команда, документ или вопрос…",
  label = "Командная палитра с ассистентом",
  listLabel = "Результаты",
  askLabel = "Спросить ИИ",
  askIdleText = "Спросить ИИ о чём угодно",
  emptyText = "Точных совпадений нет — спросите ассистента.",
  hintText = "↑↓ выбор · Enter запуск · Esc сброс",
  doneText = "Запущено: {command}",
  triggerLabel = "Открыть палитру",
  defaultOpen = false,
  menuId = "vibeui-command-013-panel",
  background = "",
  accent,
  className,
  style,
  ...props
}: Command013Props) {
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const [chosen, setChosen] = useState<string | null>(null)
  const listId = useId()
  const rowId = useId()

  const needle = query.trim().toLowerCase()
  const found = entries.filter((entry) =>
    entry.label.toLowerCase().includes(needle),
  )
  // Строка ИИ не фильтруется вместе с остальными: она нужна именно там, где
  // список пуст, и потому живёт в нумерации отдельным нулевым индексом.
  const total = found.length + 1
  const current = Math.min(active, total - 1)
  const askText = query.trim() ? `${askLabel}: ${query.trim()}` : askIdleText

  const run = (index: number) => {
    setChosen(index === 0 ? askText : found[index - 1].label)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      const step = event.key === "ArrowDown" ? 1 : -1
      setActive((index) => (Math.min(index, total - 1) + step + total) % total)
      return
    }

    if (event.key === "Enter") {
      event.preventDefault()
      run(current)
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
      setActive(0)
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-command-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-command-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-command-013" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-shell="command-013">
        <button
          type="button"
          data-part="open"
          popoverTarget={defaultOpen ? undefined : menuId}
        >
          {triggerLabel}
          <kbd>Ctrl+K</kbd>
        </button>
        <div
          id={menuId}
          popover={defaultOpen ? undefined : "auto"}
          data-open={defaultOpen || undefined}
          data-vibeui-menu="command-013"
          aria-label={triggerLabel}
        >
          <div
            {...props}
            data-slot="command"
            data-vibeui-block="command-013"
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
                aria-expanded
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={`${rowId}-${current}`}
                aria-label={placeholder}
                placeholder={placeholder}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setActive(0)
                }}
                onKeyDown={onKeyDown}
              />
            </div>
            <ul
              id={listId}
              data-part="list"
              role="listbox"
              aria-label={listLabel}
            >
              <li
                id={`${rowId}-0`}
                data-part="ask"
                role="option"
                aria-selected={current === 0}
                onClick={() => run(0)}
              >
                <span data-part="spark" aria-hidden="true">
                  <svg viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 1.5 9.4 5.6 13.5 7l-4.1 1.4L8 12.5 6.6 8.4 2.5 7l4.1-1.4L8 1.5Zm4.5 6.8.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6.6-1.7Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span data-part="text">
                  {query.trim() ? (
                    <>
                      {askLabel}: <b>{query.trim()}</b>
                    </>
                  ) : (
                    askIdleText
                  )}
                </span>
                <span data-part="hint">Enter</span>
              </li>
              {found.length > 0 ? (
                <li role="presentation">
                  <p data-part="group">{listLabel}</p>
                </li>
              ) : null}
              {found.map((entry, index) => (
                <li
                  key={entry.label}
                  id={`${rowId}-${index + 1}`}
                  data-part="row"
                  role="option"
                  aria-selected={current === index + 1}
                  onClick={() => run(index + 1)}
                >
                  <span data-part="mark" aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 8h9m0 0L8.5 4.5M12 8l-3.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span data-part="text">{entry.label}</span>
                  {entry.hint ? (
                    <span data-part="hint">{entry.hint}</span>
                  ) : null}
                </li>
              ))}
              {found.length === 0 ? (
                <li role="presentation">
                  <p data-part="empty">{emptyText}</p>
                </li>
              ) : null}
            </ul>
            <p data-part="foot" role="status">
              {chosen ? doneText.replace("{command}", chosen) : hintText}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
