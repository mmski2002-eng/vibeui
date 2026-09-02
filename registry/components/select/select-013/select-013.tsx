"use client"

import { useEffect, useId, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Select013Option = {
  value: string
  label: string
}

export type Select013Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  name?: string
  options?: Select013Option[]
  defaultValue?: string[]
  addLabel?: string
  emptyText?: string
  /** Подпись кнопки удаления чипа; {label} — название метки. */
  removeLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: множественный выбор без select[multiple] (см. select-004),
// где выбранное видно только по подсветке строк. Здесь каждое значение —
// отдельный чип с крестиком: видно сразу и весь набор, и как убрать один
// пункт, не открывая список заново. Список открывает наша кнопка, а не
// select, потому что чипам нужно жить отдельно от поля-триггера.
const STYLES = `
:where([data-vibeui-block="select-013"]){
--vibeui-select-013-surface:transparent;
--vibeui-select-013-surface-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-select-013-fg:light-dark(oklch(0.23 0.016 265),oklch(0.94 0.005 265));
--vibeui-select-013-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-select-013-border:light-dark(oklch(0.87 0.008 265),oklch(0.4 0.012 265));
--vibeui-select-013-accent:light-dark(oklch(0.55 0.19 262),oklch(0.73 0.17 262));
--vibeui-select-013-tint:light-dark(oklch(0.55 0.19 262 / 14%),oklch(0.73 0.17 262 / 22%));
--vibeui-select-013-panel:light-dark(oklch(1 0 0),oklch(0.25 0.014 265));
--vibeui-select-013-check:light-dark(oklch(1 0 0),oklch(0.19 0.014 265));
--vibeui-select-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="select-013"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-013-surface);
border:1px solid var(--vibeui-select-013-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-013-font);color:var(--vibeui-select-013-fg);
}
[data-vibeui-block="select-013"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-013"] [data-part="chips"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;min-height:1.75rem;
}
[data-vibeui-block="select-013"] [data-part="placeholder"]{font-size:0.8125rem;color:var(--vibeui-select-013-muted)}
[data-vibeui-block="select-013"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.25rem;
padding:0.25rem 0.375rem 0.25rem 0.625rem;border-radius:9999px;
background:var(--vibeui-select-013-tint);color:var(--vibeui-select-013-accent);
font-size:0.8125rem;font-weight:600;line-height:1.2;
}
[data-vibeui-block="select-013"] [data-part="remove"]{
display:grid;place-items:center;flex:none;
width:1.125rem;height:1.125rem;padding:0;margin:0;
border:none;border-radius:9999px;background:transparent;color:inherit;
font:inherit;font-size:0.9375rem;line-height:1;cursor:pointer;
}
[data-vibeui-block="select-013"] [data-part="remove"]:hover{
background:color-mix(in oklab,var(--vibeui-select-013-accent) 18%,transparent);
}
[data-vibeui-block="select-013"] [data-part="remove"]:focus-visible{
outline:2px solid var(--vibeui-select-013-accent);outline-offset:1px;
}
[data-vibeui-block="select-013"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-013"] [data-part="trigger"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.875rem;
border:1px dashed var(--vibeui-select-013-border);border-radius:0.625rem;
background:transparent;color:var(--vibeui-select-013-muted);
font:inherit;font-size:0.875rem;text-align:left;cursor:pointer;
transition:border-color .16s ease,color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-013"] [data-part="trigger"]:hover{
border-color:var(--vibeui-select-013-accent);color:var(--vibeui-select-013-accent);
}
[data-vibeui-block="select-013"] [data-part="trigger"]:focus-visible{
outline:none;border-style:solid;border-color:var(--vibeui-select-013-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-013-accent) 22%,transparent);
}
[data-vibeui-block="select-013"] [data-part="chevron"]{
flex:none;width:0.4375rem;height:0.4375rem;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg);transition:transform .16s ease;
}
[data-vibeui-block="select-013"] [data-part="trigger"][aria-expanded="true"] [data-part="chevron"]{
transform:rotate(-135deg);
}
[data-vibeui-block="select-013"] [data-part="panel"]{
position:absolute;left:0;right:0;top:calc(100% + 0.375rem);z-index:20;
margin:0;padding:0.375rem;list-style:none;
max-height:12rem;overflow-y:auto;
background:var(--vibeui-select-013-panel);
border:1px solid var(--vibeui-select-013-border);border-radius:0.75rem;
box-shadow:0 0.75rem 1.75rem oklch(0 0 0 / 16%);
}
[data-vibeui-block="select-013"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.5rem 0.625rem;border-radius:0.5rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="select-013"] [data-part="option"][data-active="true"]{
background:var(--vibeui-select-013-tint);
}
[data-vibeui-block="select-013"] [data-part="box"]{
flex:none;width:1rem;height:1rem;border-radius:0.3125rem;
border:1.5px solid var(--vibeui-select-013-border);
display:grid;place-items:center;
transition:background-color .12s ease,border-color .12s ease;
}
[data-vibeui-block="select-013"] [data-part="option"][aria-selected="true"] [data-part="box"]{
border-color:var(--vibeui-select-013-accent);background:var(--vibeui-select-013-accent);
}
[data-vibeui-block="select-013"] [data-part="check"]{
width:0.5rem;height:0.3125rem;
border-left:1.5px solid var(--vibeui-select-013-check);
border-bottom:1.5px solid var(--vibeui-select-013-check);
transform:rotate(-45deg) translateY(-1px);opacity:0;
}
[data-vibeui-block="select-013"] [data-part="option"][aria-selected="true"] [data-part="check"]{
opacity:1;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Select013Option[] = [
  { value: "design", label: "Дизайн" },
  { value: "tech", label: "Технологии" },
  { value: "business", label: "Бизнес" },
  { value: "opinion", label: "Мнение" },
  { value: "case", label: "Кейс" },
  { value: "news", label: "Новости" },
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
 * Множественный выбор с чипами: выбранные значения видны как чипы с
 * крестиком удаления, список открывает отдельная кнопка. Один файл, ноль
 * зависимостей, собственная палитра.
 */
export function Select013({
  label = "Метки статьи",
  name,
  options = DEFAULT_OPTIONS,
  defaultValue = ["design", "case"],
  addLabel = "Добавить метку",
  emptyText = "Пока не выбрано",
  removeLabel = "Убрать «{label}»",
  background = "",
  accent,
  id,
  className,
  style,
  ...props
}: Select013Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const listId = `${fieldId}-listbox`
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const [selected, setSelected] = useState<string[]>(defaultValue)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [])

  function toggleOption(option: Select013Option) {
    setSelected((current) =>
      current.includes(option.value)
        ? current.filter((value) => value !== option.value)
        : [...current, option.value],
    )
  }

  function removeValue(value: string) {
    setSelected((current) => current.filter((item) => item !== value))
    triggerRef.current?.focus()
  }

  // Кнопка только открывает панель — стрелками и Enter управляет сам
  // список, когда фокус переходит туда (см. эффект ниже и handleListKeyDown).
  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      setOpen(true)
    }
  }

  useEffect(() => {
    if (open) {
      listRef.current?.focus()
    }
  }, [open])

  function handleListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((current) => Math.min(current + 1, options.length - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((current) => Math.max(current - 1, 0))
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      const option = options[activeIndex]
      if (option) {
        toggleOption(option)
      }
    } else if (event.key === "Escape") {
      event.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
    } else if (event.key === "Tab") {
      setOpen(false)
    }
  }

  const chips = options.filter((option) => selected.includes(option.value))
  const palette = {
    ...(accent ? { "--vibeui-select-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-select-013-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={rootRef}
        data-vibeui-block="select-013"
        className={className}
        style={palette}
      >
        <span data-part="label" id={`${fieldId}-label`}>
          {label}
        </span>
        <div data-part="chips">
          {chips.length === 0 ? (
            <span data-part="placeholder">{emptyText}</span>
          ) : (
            chips.map((chip) => (
              <span key={chip.value} data-part="chip">
                {chip.label}
                <button
                  type="button"
                  data-part="remove"
                  aria-label={removeLabel.replace("{label}", chip.label)}
                  onClick={() => removeValue(chip.value)}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </span>
            ))
          )}
        </div>
        {name
          ? selected.map((value) => (
              <input key={value} type="hidden" name={name} value={value} />
            ))
          : null}
        <span data-part="field">
          <button
            ref={triggerRef}
            id={fieldId}
            type="button"
            data-part="trigger"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listId}
            aria-labelledby={`${fieldId}-label ${fieldId}`}
            onClick={() => setOpen((value) => !value)}
            onKeyDown={handleTriggerKeyDown}
          >
            <span>{addLabel}</span>
            <span data-part="chevron" aria-hidden="true" />
          </button>
          {open ? (
            <ul
              ref={listRef}
              data-part="panel"
              id={listId}
              role="listbox"
              aria-multiselectable="true"
              aria-activedescendant={`${listId}-${activeIndex}`}
              tabIndex={-1}
              onKeyDown={handleListKeyDown}
            >
              {options.map((option, index) => (
                <li
                  key={option.value}
                  id={`${listId}-${index}`}
                  data-part="option"
                  data-active={index === activeIndex}
                  role="option"
                  aria-selected={selected.includes(option.value)}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    toggleOption(option)
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <span data-part="box" aria-hidden="true">
                    <span data-part="check" />
                  </span>
                  {option.label}
                </li>
              ))}
            </ul>
          ) : null}
        </span>
      </div>
    </>
  )
}
