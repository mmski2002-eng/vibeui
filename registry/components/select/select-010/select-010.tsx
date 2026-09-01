"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Select010Option = {
  value: string
  label: string
}

export type Select010Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  name?: string
  options?: Select010Option[]
  placeholder?: string
  emptyText?: string
  defaultValue?: string
  accent?: string
}

// Идея компонента: поиск внутри длинного списка. Разделы через optgroup
// (см. select-002) помогают, только пока вариантов десяток-другой; когда их
// куда больше, быстрее набрать несколько букв, чем листать разделы. Поэтому
// поле — текстовый ввод с открывающимся списком: набор фильтрует варианты
// сразу, а стрелки и Enter выбирают без мыши, как в обычном select.
const STYLES = `
:where([data-vibeui-block="select-010"]){
--vibeui-select-010-surface:oklch(1 0 0);
--vibeui-select-010-surface-border:oklch(0.91 0.006 265);
--vibeui-select-010-fg:oklch(0.23 0.016 265);
--vibeui-select-010-muted:oklch(0.55 0.014 265);
--vibeui-select-010-field:oklch(0.985 0.002 265);
--vibeui-select-010-border:oklch(0.87 0.008 265);
--vibeui-select-010-accent:oklch(0.55 0.19 262);
--vibeui-select-010-tint:oklch(0.55 0.19 262 / 12%);
--vibeui-select-010-panel:oklch(1 0 0);
--vibeui-select-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="select-010"]{
position:relative;
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-010-surface);
border:1px solid var(--vibeui-select-010-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-010-font);color:var(--vibeui-select-010-fg);
}
[data-vibeui-block="select-010"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-010"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-010"] input{
appearance:none;-webkit-appearance:none;
box-sizing:border-box;width:100%;margin:0;height:2.75rem;
padding:0 2.25rem 0 0.875rem;
border:1px solid var(--vibeui-select-010-border);border-radius:0.625rem;
background:var(--vibeui-select-010-field);color:inherit;
font:inherit;font-size:0.9375rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-010"] input:focus{
outline:none;border-color:var(--vibeui-select-010-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-010-accent) 22%,transparent);
}
/* Лупа нарисована кольцом и палочкой: иконочная библиотека не нужна. */
[data-vibeui-block="select-010"] [data-part="glass"]{
position:absolute;right:0.875rem;top:50%;margin-top:-0.5rem;
width:1rem;height:1rem;pointer-events:none;
}
[data-vibeui-block="select-010"] [data-part="glass"]::before{
content:"";position:absolute;left:0;top:0;
width:0.6875rem;height:0.6875rem;border-radius:9999px;
border:1.5px solid var(--vibeui-select-010-muted);
}
[data-vibeui-block="select-010"] [data-part="glass"]::after{
content:"";position:absolute;right:0;bottom:0;
width:0.4375rem;height:1.5px;background:var(--vibeui-select-010-muted);
transform:rotate(45deg);transform-origin:right center;
}
[data-vibeui-block="select-010"] [data-part="panel"]{
position:absolute;left:0;right:0;top:calc(100% + 0.375rem);z-index:20;
margin:0;padding:0.375rem;list-style:none;
max-height:13rem;overflow-y:auto;
background:var(--vibeui-select-010-panel);
border:1px solid var(--vibeui-select-010-border);border-radius:0.75rem;
box-shadow:0 0.75rem 1.75rem oklch(0 0 0 / 16%);
}
[data-vibeui-block="select-010"] [data-part="option"]{
padding:0.5rem 0.625rem;border-radius:0.5rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="select-010"] [data-part="option"][data-active="true"]{
background:var(--vibeui-select-010-tint);color:var(--vibeui-select-010-accent);
}
[data-vibeui-block="select-010"] [data-part="option"][aria-selected="true"]{font-weight:600}
[data-vibeui-block="select-010"] [data-part="empty"]{
margin:0;padding:0.5rem 0.625rem;font-size:0.8125rem;color:var(--vibeui-select-010-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Select010Option[] = [
  { value: "anna", label: "Анна Волкова" },
  { value: "boris", label: "Борис Титов" },
  { value: "irina", label: "Ирина Соколова" },
  { value: "kirill", label: "Кирилл Орлов" },
  { value: "marina", label: "Марина Егорова" },
  { value: "pavel", label: "Павел Гринёв" },
  { value: "sofia", label: "София Ким" },
  { value: "timur", label: "Тимур Байназаров" },
]

/**
 * Select с поиском: текстовый ввод фильтрует список, стрелки и Enter выбирают.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Select010({
  label = "Ответственный",
  name,
  options = DEFAULT_OPTIONS,
  placeholder = "Найдите имя",
  emptyText = "Никого не нашли",
  defaultValue = "",
  accent,
  id,
  className,
  style,
  ...props
}: Select010Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const listId = `${fieldId}-listbox`
  const rootRef = useRef<HTMLDivElement>(null)

  const [value, setValue] = useState(defaultValue)
  const selected = options.find((option) => option.value === value) ?? null
  const [query, setQuery] = useState(selected?.label ?? "")
  const [open, setOpen] = useState(false)
  const [rawActiveIndex, setRawActiveIndex] = useState(0)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()

    if (!needle) {
      return options
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(needle),
    )
  }, [options, query])

  // Отфильтрованный список короче исходного, поэтому индекс подсветки
  // считается от него же на каждый рендер — обновлять его отдельным
  // эффектом незачем.
  const activeIndex =
    filtered.length === 0 ? 0 : Math.min(rawActiveIndex, filtered.length - 1)

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
        setQuery(selected?.label ?? "")
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [selected])

  function selectOption(option: Select010Option) {
    setValue(option.value)
    setQuery(option.label)
    setOpen(false)
    setRawActiveIndex(0)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (!open) {
        setOpen(true)
        return
      }
      setRawActiveIndex(Math.min(activeIndex + 1, filtered.length - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      if (!open) {
        setOpen(true)
        return
      }
      setRawActiveIndex(Math.max(activeIndex - 1, 0))
    } else if (event.key === "Enter") {
      if (open && filtered[activeIndex]) {
        event.preventDefault()
        selectOption(filtered[activeIndex])
      }
    } else if (event.key === "Escape" && open) {
      event.preventDefault()
      setOpen(false)
      setQuery(selected?.label ?? "")
    }
  }

  const activeOption = filtered[activeIndex]
  const palette = {
    ...(accent ? { "--vibeui-select-010-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={rootRef}
        data-vibeui-block="select-010"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={fieldId}>
          {label}
        </label>
        <span data-part="field">
          <input
            id={fieldId}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={listId}
            aria-activedescendant={
              open && activeOption ? `${listId}-${activeIndex}` : undefined
            }
            autoComplete="off"
            placeholder={placeholder}
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value)
              setValue("")
              setOpen(true)
              setRawActiveIndex(0)
            }}
            onKeyDown={handleKeyDown}
          />
          <span data-part="glass" aria-hidden="true" />
        </span>
        {name ? <input type="hidden" name={name} value={value} /> : null}
        {open ? (
          <ul data-part="panel" id={listId} role="listbox">
            {filtered.length === 0 ? (
              <li data-part="empty">{emptyText}</li>
            ) : (
              filtered.map((option, index) => (
                <li
                  key={option.value}
                  id={`${listId}-${index}`}
                  data-part="option"
                  data-active={index === activeIndex}
                  role="option"
                  aria-selected={option.value === value}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    selectOption(option)
                  }}
                  onMouseEnter={() => setRawActiveIndex(index)}
                >
                  {option.label}
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>
    </>
  )
}
