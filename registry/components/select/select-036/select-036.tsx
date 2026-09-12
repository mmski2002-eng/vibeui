"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Select036Option = {
  value: string
  label: string
}

export type Select036Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  name?: string
  options?: Select036Option[]
  defaultValue?: string
  /** Заранее набранный запрос: витрина и отладка строки «Создать». */
  defaultQuery?: string
  placeholder?: string
  searchPlaceholder?: string
  /** Строка последнего пункта; {query} — то, что набрано в поиске. */
  createLabel?: string
  /** Плашка у значения, заведённого прямо из поиска. */
  newBadge?: string
  emptyText?: string
  /**
   * Показать список развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме список не всплывает над содержимым и не закрывается кликом мимо.
   */
  open?: boolean
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: справочник, который дополняет сам пользователь. Поиск живёт
// внутри раскрытого списка, совпавший кусок подсвечен, а строка «Создать» стоит
// последней и появляется только пока точного совпадения нет — иначе она
// предлагала бы завести дубль уже существующего значения. Заведённое значение
// остаётся в списке с плашкой «новое», чтобы его было видно среди справочных.
const STYLES = `
:where([data-vibeui-block="select-036"]){
--vibeui-select-036-bg:transparent;
--vibeui-select-036-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-select-036-muted:color-mix(in oklab,var(--vibeui-select-036-fg) 68%,transparent);
--vibeui-select-036-border:light-dark(oklch(0.87 0 265),oklch(0.4 0 265));
--vibeui-select-036-accent:light-dark(oklch(0.28 0 0),oklch(0.906 0 0));
--vibeui-select-036-on-accent:oklch(from var(--vibeui-select-036-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-select-036-tint:color-mix(in oklab,var(--vibeui-select-036-accent) 14%,transparent);
--vibeui-select-036-mark:color-mix(in oklab,var(--vibeui-select-036-accent) 26%,transparent);
--vibeui-select-036-panel:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-select-036-radius:0.625rem;
--vibeui-select-036-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="select-036"]{color-scheme:dark}
[data-vibeui-block="select-036"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:23rem;
/* container-type отрывает ширину от содержимого: без нижней границы блок
   схлопнется внутри flex-кадра. */
min-width:min(100%,15rem);container-type:inline-size;
background:var(--vibeui-select-036-bg);color:var(--vibeui-select-036-fg);
font-family:var(--vibeui-select-036-font);
}
[data-vibeui-block="select-036"] *{box-sizing:border-box}
[data-vibeui-block="select-036"] [data-part="label"]{
font-size:0.8125rem;font-weight:600;color:var(--vibeui-select-036-fg);
}
[data-vibeui-block="select-036"] [data-part="field"]{position:relative;display:block}
/* Значение настраивается и переводится, поэтому высота набирается
   содержимым: фиксированная обрезала бы длинное название. */
[data-vibeui-block="select-036"] [data-part="trigger"]{
appearance:none;cursor:pointer;display:flex;align-items:center;gap:0.5rem;
width:100%;min-height:2.625rem;padding:0.4375rem 0.75rem;
border:1px solid var(--vibeui-select-036-border);
border-radius:var(--vibeui-select-036-radius);
background:transparent;color:var(--vibeui-select-036-fg);
font:inherit;font-size:0.9375rem;font-weight:500;text-align:left;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-036"] [data-part="trigger"]:hover{border-color:var(--vibeui-select-036-accent)}
[data-vibeui-block="select-036"] [data-part="trigger"]:focus-visible{
outline:none;border-color:var(--vibeui-select-036-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-036-accent) 24%,transparent);
}
[data-vibeui-block="select-036"] [data-part="value"]{
flex:1;min-inline-size:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="select-036"] [data-part="value"][data-empty="true"]{
color:var(--vibeui-select-036-muted);font-weight:400;
}
[data-vibeui-block="select-036"] [data-part="chevron"]{
flex:none;width:0.4375rem;height:0.4375rem;
border-right:1.5px solid var(--vibeui-select-036-muted);
border-bottom:1.5px solid var(--vibeui-select-036-muted);
transform:translateY(-0.125rem) rotate(45deg);transition:transform .16s ease;
}
[data-vibeui-block="select-036"] [data-part="trigger"][aria-expanded="true"] [data-part="chevron"]{
transform:translateY(0.0625rem) rotate(-135deg);
}
[data-vibeui-block="select-036"] [data-part="panel"]{
position:absolute;left:0;right:0;top:calc(100% + 0.375rem);z-index:20;
padding:0.3125rem;
background:var(--vibeui-select-036-panel);
border:1px solid var(--vibeui-select-036-border);border-radius:0.875rem;
box-shadow:0 0.75rem 1.75rem light-dark(oklch(0 0 0 / 16%),oklch(0 0 0 / 48%));
}
/* Витринный режим: список стоит в потоке под полем, а не всплывает слоем. */
[data-vibeui-block="select-036"] [data-part="panel"][data-open="true"]{
position:static;margin-block-start:0.375rem;box-shadow:none;
}
[data-vibeui-block="select-036"] [data-part="search"]{
width:100%;min-height:2.125rem;padding:0.3125rem 0.625rem;margin-block-end:0.25rem;
border:1px solid var(--vibeui-select-036-border);border-radius:0.5rem;
background:transparent;color:var(--vibeui-select-036-fg);
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="select-036"] [data-part="search"]::placeholder{color:var(--vibeui-select-036-muted)}
[data-vibeui-block="select-036"] [data-part="search"]:focus-visible{
outline:none;border-color:var(--vibeui-select-036-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-036-accent) 24%,transparent);
}
[data-vibeui-block="select-036"] [data-part="list"]{max-height:12rem;overflow-y:auto}
[data-vibeui-block="select-036"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.4375rem 0.5rem;border-radius:0.5rem;cursor:pointer;
font-size:0.875rem;line-height:1.3;color:var(--vibeui-select-036-fg);
}
[data-vibeui-block="select-036"] [data-part="option"][data-active="true"]{background:var(--vibeui-select-036-tint)}
[data-vibeui-block="select-036"] [data-part="option"][aria-selected="true"]{
color:var(--vibeui-select-036-accent);font-weight:650;
}
[data-vibeui-block="select-036"] [data-part="option-label"]{
flex:1;min-inline-size:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
/* Подсветка совпадения: фон, а не цвет текста, — на цветной подложке
   перекрашенный текст перестаёт читаться. */
[data-vibeui-block="select-036"] [data-part="match"]{
padding:0 0.0625rem;border-radius:0.1875rem;
background:var(--vibeui-select-036-mark);color:inherit;font-weight:700;
}
[data-vibeui-block="select-036"] [data-part="badge"]{
flex:none;padding:0.0625rem 0.375rem;border-radius:9999px;
background:var(--vibeui-select-036-tint);color:var(--vibeui-select-036-accent);
font-size:0.6875rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="select-036"] [data-part="empty"]{
padding:0.625rem 0.5rem;font-size:0.8125rem;color:var(--vibeui-select-036-muted);
}
[data-vibeui-block="select-036"] [data-part="create"]{
display:flex;align-items:center;gap:0.5rem;
min-height:2.125rem;padding:0.375rem 0.5rem;margin-block-start:0.25rem;
border-block-start:1px solid color-mix(in oklab,var(--vibeui-select-036-border) 70%,transparent);
border-radius:0 0 0.5rem 0.5rem;cursor:pointer;
font-size:0.875rem;line-height:1.3;color:var(--vibeui-select-036-fg);
}
[data-vibeui-block="select-036"] [data-part="create"][data-active="true"]{background:var(--vibeui-select-036-tint)}
[data-vibeui-block="select-036"] [data-part="create-text"]{
flex:1;min-inline-size:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="select-036"] [data-part="plus"]{
flex:none;display:grid;place-items:center;width:1.125rem;height:1.125rem;
border-radius:9999px;background:var(--vibeui-select-036-accent);
color:oklch(from var(--vibeui-select-036-accent) clamp(0,(0.62 - l) * 100,1) 0 0);font-size:0.8125rem;font-weight:700;line-height:1;
}
[data-vibeui-block="select-036"] [data-part="kbd"]{
flex:none;padding:0.0625rem 0.3125rem;border-radius:0.25rem;
border:1px solid var(--vibeui-select-036-border);
font-size:0.6875rem;font-weight:600;color:var(--vibeui-select-036-muted);
}
@container (max-width: 17rem){
[data-vibeui-block="select-036"] [data-part="kbd"]{display:none}
[data-vibeui-block="select-036"] [data-part="option"]{padding-inline:0.375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-036"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Select036Option[] = [
  { value: "design-system", label: "Дизайн-система" },
  { value: "onboarding", label: "Онбординг" },
  { value: "analytics", label: "Аналитика" },
  { value: "billing", label: "Оплата и тарифы" },
  { value: "docs", label: "Документация" },
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

/** Подсветка совпавшего куска: до, само совпадение и после. */
function splitMatch(label: string, query: string) {
  const at = query ? label.toLowerCase().indexOf(query.toLowerCase()) : -1

  if (at < 0) {
    return { before: label, match: "", after: "" }
  }

  return {
    before: label.slice(0, at),
    match: label.slice(at, at + query.length),
    after: label.slice(at + query.length),
  }
}

/**
 * Список, который дополняется на ходу: поиск с подсветкой совпадения и
 * строка «Создать» последней. Один файл, ноль зависимостей, своя палитра.
 */
export function Select036({
  label = "Тема обращения",
  name,
  options = DEFAULT_OPTIONS,
  defaultValue = "",
  defaultQuery = "",
  placeholder = "Выберите или создайте",
  searchPlaceholder = "Найти или ввести своё",
  createLabel = "Создать «{query}»",
  newBadge = "новое",
  emptyText = "Ничего не нашлось",
  open = false,
  background = "",
  accent,
  id,
  className,
  style,
  ...props
}: Select036Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const panelId = `${fieldId}-panel`
  const listId = `${fieldId}-listbox`
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const [created, setCreated] = useState<Select036Option[]>([])
  const [value, setValue] = useState(defaultValue)
  const [query, setQuery] = useState(defaultQuery)
  const [activeIndex, setActiveIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)

  const visible = open || expanded
  const all = [...options, ...created]
  const current = all.find((option) => option.value === value)
  const needle = query.trim().toLowerCase()
  const found = all.filter((option) =>
    option.label.toLowerCase().includes(needle),
  )
  const exact = all.some((option) => option.label.toLowerCase() === needle)
  const canCreate = needle.length > 0 && !exact
  const rows = canCreate ? found.length + 1 : found.length

  useEffect(() => {
    if (!expanded) {
      return
    }

    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setExpanded(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [expanded])

  useEffect(() => {
    if (expanded) {
      searchRef.current?.focus()
    }
  }, [expanded])

  function close() {
    setExpanded(false)
    setQuery("")
    setActiveIndex(0)
  }

  function choose(option: Select036Option) {
    setValue(option.value)
    close()
    triggerRef.current?.focus()
  }

  function create() {
    const title = query.trim()

    if (!title) {
      return
    }

    const option = { value: `custom-${title.toLowerCase()}`, label: title }
    setCreated((current) => [...current, option])
    choose(option)
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, Math.max(rows - 1, 0)))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === "Enter") {
      event.preventDefault()

      if (activeIndex < found.length) {
        const option = found[activeIndex]

        if (option) {
          choose(option)
        }
      } else if (canCreate) {
        create()
      }
    } else if (event.key === "Escape") {
      event.preventDefault()
      close()
      triggerRef.current?.focus()
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-select-036-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-select-036-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-036" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={rootRef}
        data-slot="select"
        data-vibeui-block="select-036"
        className={className}
        style={palette}
      >
        <span data-part="label" id={`${fieldId}-label`}>
          {label}
        </span>
        {name ? <input type="hidden" name={name} value={value} /> : null}
        <span data-part="field">
          <button
            ref={triggerRef}
            id={fieldId}
            type="button"
            data-part="trigger"
            aria-expanded={visible}
            aria-controls={panelId}
            aria-labelledby={`${fieldId}-label ${fieldId}`}
            onClick={() => (expanded ? close() : setExpanded(true))}
          >
            <span data-part="value" data-empty={!current || undefined}>
              {current ? current.label : placeholder}
            </span>
            <span data-part="chevron" aria-hidden="true" />
          </button>
          {visible ? (
            <div data-part="panel" data-open={open || undefined} id={panelId}>
              <input
                ref={searchRef}
                type="text"
                data-part="search"
                role="combobox"
                value={query}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                aria-expanded="true"
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={`${listId}-${activeIndex}`}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setActiveIndex(0)
                }}
                onKeyDown={handleSearchKeyDown}
              />
              <div
                data-part="listbox"
                id={listId}
                role="listbox"
                aria-labelledby={`${fieldId}-label`}
              >
                <div data-part="list" role="presentation">
                  {found.length === 0 && !canCreate ? (
                    <p data-part="empty">{emptyText}</p>
                  ) : null}
                  {found.map((option, index) => {
                    const parts = splitMatch(option.label, query.trim())

                    return (
                      <div
                        key={option.value}
                        id={`${listId}-${index}`}
                        data-part="option"
                        data-active={index === activeIndex}
                        role="option"
                        aria-selected={option.value === value}
                        onMouseDown={(event) => {
                          event.preventDefault()
                          choose(option)
                        }}
                        onMouseEnter={() => setActiveIndex(index)}
                      >
                        <span data-part="option-label">
                          {parts.before}
                          {parts.match ? (
                            <mark data-part="match">{parts.match}</mark>
                          ) : null}
                          {parts.after}
                        </span>
                        {created.includes(option) ? (
                          <span data-part="badge">{newBadge}</span>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
                {canCreate ? (
                  <div
                    id={`${listId}-${found.length}`}
                    data-part="create"
                    data-active={found.length === activeIndex}
                    role="option"
                    aria-selected={false}
                    onMouseDown={(event) => {
                      event.preventDefault()
                      create()
                    }}
                    onMouseEnter={() => setActiveIndex(found.length)}
                  >
                    <span data-part="plus" aria-hidden="true">
                      +
                    </span>
                    <span data-part="create-text">
                      {createLabel.replace("{query}", query.trim())}
                    </span>
                    <span data-part="kbd" aria-hidden="true">
                      Enter
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </span>
      </div>
    </>
  )
}
