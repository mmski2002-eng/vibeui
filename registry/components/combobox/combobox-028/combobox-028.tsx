"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
} from "react"

export type Combobox028Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  searchPlaceholder?: string
  options?: string[]
  emptyLabel?: string
  defaultValue?: string
  hotkeyLabel?: string
  triggerKey?: string
  onSelect?: (value: string) => void
  accent?: string
}

// Идея компонента: панель можно открыть с любого места страницы, не наводя
// курсор на кнопку. Глобальный слушатель ловит Ctrl/Cmd + клавишу, но
// пропускает нажатие, если фокус уже стоит в чужом текстовом поле — иначе
// сочетание перехватывало бы ввод в любой другой форме. Подсказка сочетания
// напечатана прямо на кнопке, чтобы не быть секретом.
const STYLES = `
:where([data-vibeui-block="combobox-028"]){
--vibeui-combobox-028-bg:oklch(1 0 0);
--vibeui-combobox-028-fg:oklch(0.22 0.014 80);
--vibeui-combobox-028-muted:oklch(0.53 0.014 80);
--vibeui-combobox-028-border:oklch(0.9 0.008 80);
--vibeui-combobox-028-field:oklch(0.985 0.004 80);
--vibeui-combobox-028-active:oklch(0.95 0.03 80);
--vibeui-combobox-028-accent:oklch(0.55 0.14 80);
--vibeui-combobox-028-radius:0.625rem;
--vibeui-combobox-028-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="combobox-028"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-028-bg);
border:1px solid var(--vibeui-combobox-028-border);
border-radius:calc(var(--vibeui-combobox-028-radius) + 0.25rem);
color:var(--vibeui-combobox-028-fg);
font-family:var(--vibeui-combobox-028-font);
}
[data-vibeui-block="combobox-028"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-028"] [data-part="trigger"]{
box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
width:100%;height:2.5rem;padding:0 0.5rem 0 0.75rem;cursor:pointer;text-align:left;
border:1px solid var(--vibeui-combobox-028-border);
border-radius:var(--vibeui-combobox-028-radius);
background:var(--vibeui-combobox-028-field);
color:inherit;font:inherit;font-size:0.875rem;
transition:border-color .16s ease;
}
[data-vibeui-block="combobox-028"] [data-part="trigger"]:hover{border-color:var(--vibeui-combobox-028-accent)}
[data-vibeui-block="combobox-028"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-combobox-028-accent);outline-offset:1px}
[data-vibeui-block="combobox-028"] [data-part="trigger"][data-empty="true"] [data-part="value"]{color:var(--vibeui-combobox-028-muted)}
[data-vibeui-block="combobox-028"] [data-part="value"]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="combobox-028"] kbd{
flex:none;padding:0.1rem 0.4rem;border-radius:0.35rem;
border:1px solid var(--vibeui-combobox-028-border);
background:var(--vibeui-combobox-028-bg);
font:inherit;font-size:0.7rem;font-weight:600;color:var(--vibeui-combobox-028-muted);
}
[data-vibeui-block="combobox-028"] [data-part="panel"]{
display:flex;flex-direction:column;gap:0.25rem;padding:0.375rem;
border:1px solid var(--vibeui-combobox-028-border);
border-radius:var(--vibeui-combobox-028-radius);
background:var(--vibeui-combobox-028-bg);
}
[data-vibeui-block="combobox-028"] input{
box-sizing:border-box;width:100%;height:2.125rem;padding:0 0.625rem;
border:1px solid var(--vibeui-combobox-028-border);
border-radius:0.5rem;background:var(--vibeui-combobox-028-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-028"] input:focus-visible{outline:2px solid var(--vibeui-combobox-028-accent);outline-offset:1px;border-color:transparent}
[data-vibeui-block="combobox-028"] [data-part="list"]{
margin:0;padding:0;list-style:none;max-height:9.5rem;overflow-y:auto;
}
[data-vibeui-block="combobox-028"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="combobox-028"] [data-part="option"][data-active="true"]{background:var(--vibeui-combobox-028-active)}
[data-vibeui-block="combobox-028"] [data-part="check"]{width:0.85rem;flex:none;color:var(--vibeui-combobox-028-accent);font-weight:700}
[data-vibeui-block="combobox-028"] [data-part="empty"]{padding:0.5rem;font-size:0.8125rem;color:var(--vibeui-combobox-028-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-028"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "Открыть проект",
  "Создать задачу",
  "Найти файл",
  "Пригласить участника",
  "Настройки команды",
  "Сменить тему",
]

const TEXT_INPUT_TAGS = new Set(["INPUT", "TEXTAREA"])

/**
 * Combobox, который открывается глобальной горячей клавишей: подсказка
 * сочетания напечатана на кнопке, слушатель пропускает набор в чужих полях.
 */
export function Combobox028({
  label = "Быстрые команды",
  placeholder = "Выберите команду",
  searchPlaceholder = "Поиск по командам",
  options = DEFAULT_OPTIONS,
  emptyLabel = "Ничего не нашлось",
  defaultValue = "",
  hotkeyLabel = "Ctrl+K",
  triggerKey = "k",
  onSelect,
  accent,
  className,
  style,
  ...props
}: Combobox028Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return options
    return options.filter((option) => option.toLowerCase().includes(needle))
  }, [options, query])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    const onGlobalKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTypingElsewhere =
        !!target &&
        (TEXT_INPUT_TAGS.has(target.tagName) || target.isContentEditable) &&
        target !== inputRef.current

      if (
        event.key.toLowerCase() === triggerKey.toLowerCase() &&
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        !isTypingElsewhere
      ) {
        event.preventDefault()
        setActive(0)
        setOpen(true)
        return
      }

      if (event.key === "Escape" && open) {
        setOpen(false)
        setQuery("")
        triggerRef.current?.focus()
      }
    }

    document.addEventListener("keydown", onGlobalKeyDown)
    return () => document.removeEventListener("keydown", onGlobalKeyDown)
  }, [open, triggerKey])

  const palette = {
    ...(accent ? { "--vibeui-combobox-028-accent": accent } : null),
    ...style,
  } as CSSProperties

  const close = (returnFocus: boolean) => {
    setOpen(false)
    setQuery("")
    if (returnFocus) triggerRef.current?.focus()
  }

  const commit = (option: string) => {
    setValue(option)
    onSelect?.(option)
    close(true)
  }

  const move = (delta: number) => {
    if (!matches.length) return
    const next = (active + delta + matches.length) % matches.length
    setActive(next)
    listRef.current?.children[next]?.scrollIntoView({ block: "nearest" })
  }

  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      move(1)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      move(-1)
    } else if (event.key === "Home") {
      event.preventDefault()
      move(-active)
    } else if (event.key === "End") {
      event.preventDefault()
      move(matches.length - 1 - active)
    } else if (event.key === "Enter") {
      event.preventDefault()
      if (matches[active]) commit(matches[active])
    } else if (event.key === "Escape") {
      event.preventDefault()
      close(true)
    }
  }

  return (
    <>
      <style href="vibeui-combobox-028" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="combobox-028"
        className={className}
        style={palette}
      >
        <span data-part="label" id={`${id}-label`}>
          {label}
        </span>
        <button
          ref={triggerRef}
          type="button"
          data-part="trigger"
          data-empty={value === ""}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={`${id}-label ${id}-trigger`}
          id={`${id}-trigger`}
          onClick={() => {
            setActive(Math.max(0, options.indexOf(value)))
            setOpen((previous) => !previous)
          }}
        >
          <span data-part="value">{value || placeholder}</span>
          <kbd aria-hidden="true">{hotkeyLabel}</kbd>
        </button>
        {open ? (
          <div data-part="panel">
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              autoComplete="off"
              placeholder={searchPlaceholder}
              aria-label={`${label}: фильтр`}
              aria-expanded="true"
              aria-controls={`${id}-list`}
              aria-autocomplete="list"
              aria-activedescendant={
                matches[active] ? `${id}-option-${active}` : undefined
              }
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setActive(0)
              }}
              onKeyDown={onKeyDown}
            />
            <ul
              ref={listRef}
              id={`${id}-list`}
              role="listbox"
              aria-label={label}
              data-part="list"
            >
              {matches.map((option, index) => (
                <li
                  key={option}
                  id={`${id}-option-${index}`}
                  role="option"
                  data-part="option"
                  data-active={index === active}
                  aria-selected={option === value}
                  onMouseEnter={() => setActive(index)}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    commit(option)
                  }}
                >
                  <span data-part="check" aria-hidden="true">
                    {option === value ? "✓" : ""}
                  </span>
                  {option}
                </li>
              ))}
              {matches.length === 0 ? (
                <li data-part="empty" role="presentation">
                  {emptyLabel}
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </div>
    </>
  )
}
