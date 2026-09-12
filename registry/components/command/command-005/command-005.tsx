"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Command005Result = {
  label: string
  kind: "Файл" | "Символ" | "Настройка" | "Документ"
  detail: string
}

export type Command005Props = Omit<ComponentProps<"div">, "children"> & {
  items?: Command005Result[]
  placeholder?: string
  /** Подписи типов: ключ остаётся машинным, меняется только видимый текст. */
  kindText?: Record<string, string>
  /** Заголовок группы; {kind} — тип, {count} — число строк. */
  groupText?: string
  /** Подвал; {found} — найдено, {total} — всего. */
  footText?: string
  /** Имя панели для скринридера. */
  label?: string
  /** Имя списка результатов для скринридера. */
  listLabel?: string
  /** Ответ, когда ничего не нашлось. */
  emptyText?: string
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

// Идея компонента: поиск по всему проекту, где в одном списке лежат разные
// сущности. Без пометки типа файл и настройка выглядят одинаково, поэтому у
// каждой строки есть значок-квадрат с типом и приглушённая вторая строка с
// путём или контекстом. Группировка идёт по типу и считается из данных, а не
// задаётся руками: добавили новый тип — появилась новая группа.
//
// Тема берётся из color-scheme окружения через light-dark(): у значков типов
// своя пара светлот в каждой ветке, чтобы буква читалась на своей заливке.
const STYLES = `
:where([data-vibeui-block="command-005"]){
--vibeui-command-005-bg:light-dark(oklch(1 0 0),oklch(0.21 0 265));
--vibeui-command-005-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-command-005-muted:color-mix(in oklab,var(--vibeui-command-005-fg) 68%,transparent);
--vibeui-command-005-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-command-005-accent:light-dark(oklch(0.287 0 0),oklch(0.905 0 0));
--vibeui-command-005-shadow:light-dark(oklch(0.2 0 265 / 60%),oklch(0.04 0 265 / 70%));
--vibeui-command-005-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-command-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="command-005"]{color-scheme:dark}
[data-vibeui-block="command-005"]{
display:block;box-sizing:border-box;width:100%;max-width:25rem;overflow:hidden;
background:var(--vibeui-command-005-bg);color:var(--vibeui-command-005-fg);
border:1px solid var(--vibeui-command-005-border);border-radius:0.875rem;
box-shadow:0 18px 40px -28px var(--vibeui-command-005-shadow);
font-family:var(--vibeui-command-005-font);
}
[data-vibeui-block="command-005"] input{
box-sizing:border-box;width:100%;height:2.875rem;padding:0 0.875rem;
appearance:none;border:0;border-bottom:1px solid var(--vibeui-command-005-border);
background:none;color:inherit;font:inherit;font-size:0.9375rem;outline:none;
}
[data-vibeui-block="command-005"] input:focus{box-shadow:inset 0 -2px 0 0 var(--vibeui-command-005-accent)}
[data-vibeui-block="command-005"] [data-part="list"]{
list-style:none;margin:0;padding:0.3125rem;max-height:16rem;overflow-y:auto;
}
[data-vibeui-block="command-005"] [data-part="list"] [data-part="list"]{padding:0;max-height:none;overflow:visible}
[data-vibeui-block="command-005"] [data-part="group"]{
margin:0;padding:0.5rem 0.5625rem 0.25rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;
color:var(--vibeui-command-005-muted);
}
[data-vibeui-block="command-005"] [data-part="row"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.4375rem 0.5625rem;border-radius:0.5rem;cursor:pointer;
}
[data-vibeui-block="command-005"] [data-part="row"]:hover,
[data-vibeui-block="command-005"] [data-part="row"][aria-selected="true"]{
background:color-mix(in oklab,var(--vibeui-command-005-accent) 12%,transparent);
}
/* Значок типа — квадрат с буквой: он различает строки быстрее любой подписи. */
[data-vibeui-block="command-005"] [data-part="kind"]{
flex:none;display:grid;place-items:center;
width:1.375rem;height:1.375rem;border-radius:0.4375rem;
background:color-mix(in oklab,var(--vibeui-command-005-accent) 14%,transparent);
color:var(--vibeui-command-005-accent);
font-size:0.6875rem;font-weight:800;
}
[data-vibeui-block="command-005"] [data-part="row"][data-kind="Настройка"] [data-part="kind"]{background:light-dark(oklch(0.62 0.16 55 / 18%),oklch(0.72 0.15 55 / 26%));color:light-dark(oklch(0.52 0.16 55),oklch(0.82 0.12 55))}
[data-vibeui-block="command-005"] [data-part="row"][data-kind="Символ"] [data-part="kind"]{background:light-dark(oklch(0.55 0.2 300 / 16%),oklch(0.7 0.17 300 / 26%));color:light-dark(oklch(0.5 0.2 300),oklch(0.81 0.13 300))}
[data-vibeui-block="command-005"] [data-part="row"][data-kind="Документ"] [data-part="kind"]{background:light-dark(oklch(0.56 0.15 165 / 18%),oklch(0.7 0.13 165 / 26%));color:light-dark(oklch(0.46 0.13 165),oklch(0.8 0.11 165))}
[data-vibeui-block="command-005"] [data-part="text"]{display:flex;flex-direction:column;min-width:0}
[data-vibeui-block="command-005"] [data-part="label"]{font-size:0.875rem;line-height:1.25}
[data-vibeui-block="command-005"] [data-part="detail"]{
font-family:var(--vibeui-command-005-mono);font-size:0.6875rem;
color:var(--vibeui-command-005-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="command-005"] [data-part="empty"]{
margin:0;padding:1.125rem 0.875rem;font-size:0.875rem;color:var(--vibeui-command-005-muted);
}
[data-vibeui-block="command-005"] [data-part="foot"]{
margin:0;padding:0.4375rem 0.875rem;border-top:1px solid var(--vibeui-command-005-border);
font-size:0.6875rem;color:var(--vibeui-command-005-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="command-005"] *{animation:none!important;transition:none!important}}
/* Оболочка: в потоке видна только кнопка, панель всплывает под ней в
   верхнем слое нативного popover — карточка каталога её не обрезает,
   Esc и клик мимо достаются от браузера. */
[data-vibeui-shell="command-005"]{
display:inline-flex;box-sizing:border-box;
font-family:var(--vibeui-command-005-font,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-shell="command-005"]{color-scheme:dark}
[data-vibeui-shell="command-005"] [data-part="open"]{
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
[data-vibeui-shell="command-005"] [data-part="open"]:hover{
border-color:light-dark(oklch(0.6 0 265),oklch(0.55 0 265));
}
[data-vibeui-shell="command-005"] [data-part="open"]:focus-visible{
outline:2px solid light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));outline-offset:2px;
}
[data-vibeui-shell="command-005"] [data-part="open"] kbd{
font:inherit;font-size:0.75rem;
padding:0.125rem 0.375rem;border-radius:0.3125rem;
border:1px solid light-dark(oklch(0.88 0 265),oklch(0.4 0 265));
color:color-mix(in oklab,currentColor 70%,transparent);
}
[data-vibeui-menu="command-005"]{
margin:auto;padding:0;border:0;background:none;overflow:visible;
width:max-content;max-width:min(92vw,34rem);
}
/* Где anchor поддержан — панель висит под кнопкой; где нет — остаётся
   по центру экрана силами самого popover. */
@supports (anchor-name: --vibeui-command-005-anchor){
[data-vibeui-shell="command-005"] [data-part="open"]{anchor-name:--vibeui-command-005-anchor}
[data-vibeui-menu="command-005"]{
position-anchor:--vibeui-command-005-anchor;
position-area:block-end span-inline-end;
margin:0.375rem 0 0;
position-try-fallbacks:flip-block;
}
}
/* Развёрнутый режим витрины: панель стоит в потоке под кнопкой. Только пока
   popover закрыт — у открытого положение задаёт верхний слой. */
[data-vibeui-shell="command-005"]:has([data-open="true"]:not(:popover-open)){
flex-direction:column;align-items:flex-start;
}
[data-vibeui-menu="command-005"][data-open="true"]:not(:popover-open){
position:static;margin:0.375rem 0 0;
}
[data-vibeui-shell="command-005"] dialog::backdrop{
background:oklch(0 0 0 / 45%);
}

`

const DEFAULT_RESULTS: Command005Result[] = [
  {
    label: "registry.json",
    kind: "Файл",
    detail: "registry/components/navigation/",
  },
  {
    label: "command-001.tsx",
    kind: "Файл",
    detail: "registry/components/navigation/command-001/",
  },
  {
    label: "validateSource",
    kind: "Символ",
    detail: "scripts/validate-meta.mjs:218",
  },
  { label: "pascalCase", kind: "Символ", detail: "scripts/new-item.mjs:41" },
  { label: "Тема превью", kind: "Настройка", detail: "Каталог → Превью" },
  {
    label: "Порог предупреждений",
    kind: "Настройка",
    detail: "Сборка → Проверки",
  },
  { label: "Конвейер сборки", kind: "Документ", detail: "docs/PIPELINE.md" },
]

const KIND_LABEL: Record<string, string> = {
  Файл: "Файл",
  Символ: "Символ",
  Настройка: "Настройка",
  Документ: "Документ",
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
 * Поиск по проекту: файлы, символы, настройки и документы в одном списке,
 * группировка по типу. Один файл, ноль зависимостей.
 */
export function Command005({
  items = DEFAULT_RESULTS,
  placeholder = "Поиск по проекту…",
  kindText = KIND_LABEL,
  groupText = "{kind} · {count}",
  footText = "Найдено {found} из {total}",
  label = "Поиск по проекту",
  listLabel = "Результаты",
  emptyText = "По запросу ничего не найдено.",
  triggerLabel = "Открыть палитру",
  defaultOpen = false,
  menuId = "vibeui-command-005-panel",
  background = "",
  accent,
  className,
  style,
  ...props
}: Command005Props) {
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const listId = useId()
  const rowId = useId()

  const needle = query.trim().toLowerCase()
  const found = items.filter(
    (result) =>
      result.label.toLowerCase().includes(needle) ||
      result.detail.toLowerCase().includes(needle),
  )
  const groups = found.reduce<Record<string, Command005Result[]>>(
    (all, result) => {
      all[result.kind] = all[result.kind]
        ? [...all[result.kind], result]
        : [result]
      return all
    },
    {},
  )
  const ordered = Object.values(groups).flat()
  const current = ordered[Math.min(active, ordered.length - 1)]

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      if (ordered.length === 0) return
      const step = event.key === "ArrowDown" ? 1 : -1
      setActive((index) => (index + step + ordered.length) % ordered.length)
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
      setActive(0)
    }
  }

  const paletteStyle = {
    ...(accent ? { "--vibeui-command-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-command-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-command-005" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-shell="command-005">
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
          data-vibeui-menu="command-005"
          aria-label={triggerLabel}
        >
          <div
            {...props}
            data-slot="command"
            data-vibeui-block="command-005"
            className={className}
            style={paletteStyle}
            role="dialog"
            aria-label={label}
          >
            <input
              type="text"
              role="combobox"
              aria-expanded={ordered.length > 0}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={
                current ? `${rowId}-${ordered.indexOf(current)}` : undefined
              }
              aria-label={placeholder}
              placeholder={placeholder}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setActive(0)
              }}
              onKeyDown={onKeyDown}
            />
            {ordered.length === 0 ? (
              <p data-part="empty">{emptyText}</p>
            ) : (
              <ul
                id={listId}
                data-part="list"
                role="listbox"
                aria-label={listLabel}
              >
                {Object.entries(groups).map(([kind, rows]) => (
                  <li key={kind} role="presentation">
                    <p data-part="group">
                      {groupText
                        .replace("{kind}", kindText[kind] ?? kind)
                        .replace("{count}", String(rows.length))}
                    </p>
                    <ul
                      data-part="list"
                      role="group"
                      aria-label={kindText[kind] ?? kind}
                    >
                      {rows.map((result) => (
                        <li
                          key={`${result.kind}-${result.label}`}
                          id={`${rowId}-${ordered.indexOf(result)}`}
                          data-part="row"
                          data-kind={result.kind}
                          role="option"
                          aria-selected={current === result}
                          onClick={() => setActive(ordered.indexOf(result))}
                        >
                          <span data-part="kind" aria-hidden="true">
                            {(kindText[result.kind] ?? result.kind).charAt(0)}
                          </span>
                          <span data-part="text">
                            <span data-part="label">{result.label}</span>
                            <span data-part="detail">{result.detail}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
            <p data-part="foot">
              {footText
                .replace("{found}", String(ordered.length))
                .replace("{total}", String(items.length))}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
