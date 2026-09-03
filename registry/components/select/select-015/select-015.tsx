"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Select015Option = {
  value: string
  label: string
  description: string
}

export type Select015Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  name?: string
  options?: Select015Option[]
  defaultValue?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: пояснение живёт не под полем (как в select-005), а
// прямо в списке — под каждым пунктом собственная вторая строка, так
// варианты сравнивают до выбора, а не после. Триггер после закрытия
// показывает только короткое название: описание своё дело уже сделало.
const STYLES = `
:where([data-vibeui-block="select-015"]){
--vibeui-select-015-surface:transparent;
--vibeui-select-015-surface-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-select-015-fg:light-dark(oklch(0.23 0.016 265),oklch(0.94 0.005 265));
--vibeui-select-015-muted:color-mix(in oklab,var(--vibeui-select-015-fg) 68%,transparent);
--vibeui-select-015-border:light-dark(oklch(0.87 0.008 265),oklch(0.4 0.012 265));
--vibeui-select-015-accent:light-dark(oklch(0.55 0.19 262),oklch(0.73 0.17 262));
--vibeui-select-015-tint:light-dark(oklch(0.55 0.19 262 / 12%),oklch(0.73 0.17 262 / 20%));
--vibeui-select-015-panel:light-dark(oklch(1 0 0),oklch(0.25 0.014 265));
--vibeui-select-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="select-015"]{color-scheme:dark}
[data-vibeui-block="select-015"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-015-surface);
border:1px solid var(--vibeui-select-015-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-015-font);color:var(--vibeui-select-015-fg);
container-type:inline-size;
}
[data-vibeui-block="select-015"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-015"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-015"] [data-part="trigger"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
box-sizing:border-box;width:100%;height:2.75rem;padding:0 0.875rem;
border:1px solid var(--vibeui-select-015-border);border-radius:0.625rem;
background:transparent;color:inherit;font:inherit;font-size:0.9375rem;font-weight:500;
text-align:left;cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-015"] [data-part="trigger"]:hover{border-color:var(--vibeui-select-015-accent)}
[data-vibeui-block="select-015"] [data-part="trigger"]:focus-visible{
outline:none;border-color:var(--vibeui-select-015-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-015-accent) 22%,transparent);
}
[data-vibeui-block="select-015"] [data-part="chevron"]{
flex:none;width:0.4375rem;height:0.4375rem;
border-right:1.5px solid var(--vibeui-select-015-muted);
border-bottom:1.5px solid var(--vibeui-select-015-muted);
transform:rotate(45deg);transition:transform .16s ease;
}
[data-vibeui-block="select-015"] [data-part="trigger"][aria-expanded="true"] [data-part="chevron"]{
transform:rotate(-135deg);
}
[data-vibeui-block="select-015"] [data-part="panel"]{
position:absolute;left:0;right:0;top:calc(100% + 0.375rem);z-index:20;
margin:0;padding:0.375rem;list-style:none;
max-height:18rem;overflow-y:auto;
background:var(--vibeui-select-015-panel);
border:1px solid var(--vibeui-select-015-border);border-radius:0.875rem;
box-shadow:0 0.75rem 1.75rem light-dark(oklch(0 0 0 / 16%),oklch(0 0 0 / 48%));
}
[data-vibeui-block="select-015"] [data-part="option"]{
display:flex;flex-direction:column;gap:0.1875rem;
padding:0.5rem 0.625rem;border-radius:0.625rem;cursor:pointer;
}
[data-vibeui-block="select-015"] [data-part="option"][data-active="true"]{
background:var(--vibeui-select-015-tint);
}
[data-vibeui-block="select-015"] [data-part="title"]{font-size:0.875rem;font-weight:600;line-height:1.25}
[data-vibeui-block="select-015"] [data-part="option"][aria-selected="true"] [data-part="title"]{
color:var(--vibeui-select-015-accent);
}
[data-vibeui-block="select-015"] [data-part="desc"]{
font-size:0.75rem;line-height:1.35;color:var(--vibeui-select-015-muted);
}
@container (max-width: 16rem){
[data-vibeui-block="select-015"] [data-part="desc"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Select015Option[] = [
  {
    value: "instant",
    label: "Мгновенно",
    description: "Уведомление придёт сразу после события",
  },
  {
    value: "daily",
    label: "Ежедневно",
    description: "Одно письмо со сводкой каждое утро в 9:00",
  },
  {
    value: "weekly",
    label: "Еженедельно",
    description: "Сводка по понедельникам, без ежедневного шума",
  },
  {
    value: "off",
    label: "Выключено",
    description: "Уведомления не приходят, историю можно посмотреть в ленте",
  },
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
 * Select с описанием под каждым вариантом: пункт двухстрочный, вторая
 * строка помогает выбрать до открытия деталей. Один файл, ноль
 * зависимостей, собственная палитра.
 */
export function Select015({
  label = "Периодичность уведомлений",
  name,
  options = DEFAULT_OPTIONS,
  defaultValue = options[0]?.value,
  background = "",
  accent,
  id,
  className,
  style,
  ...props
}: Select015Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const listId = `${fieldId}-listbox`
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const [value, setValue] = useState(defaultValue ?? DEFAULT_OPTIONS[0].value)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(
      0,
      options.findIndex((option) => option.value === value),
    ),
  )

  const current = options.find((option) => option.value === value) ?? options[0]

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [])

  useEffect(() => {
    if (open) {
      listRef.current?.focus()
    }
  }, [open])

  function choose(option: Select015Option) {
    setValue(option.value)
    setOpen(false)
    triggerRef.current?.focus()
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      setOpen(true)
    }
  }

  function handleListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, options.length - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      const option = options[activeIndex]
      if (option) choose(option)
    } else if (event.key === "Escape") {
      event.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
    } else if (event.key === "Tab") {
      setOpen(false)
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-select-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-select-015-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-015" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={rootRef}
        data-slot="select"
        data-vibeui-block="select-015"
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
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listId}
            aria-labelledby={`${fieldId}-label ${fieldId}`}
            onClick={() => setOpen((v) => !v)}
            onKeyDown={handleTriggerKeyDown}
          >
            <span>{current.label}</span>
            <span data-part="chevron" aria-hidden="true" />
          </button>
          {open ? (
            <ul
              ref={listRef}
              data-part="panel"
              id={listId}
              role="listbox"
              aria-labelledby={`${fieldId}-label`}
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
                  aria-selected={option.value === value}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    choose(option)
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <span data-part="title">{option.label}</span>
                  <span data-part="desc">{option.description}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </span>
      </div>
    </>
  )
}
