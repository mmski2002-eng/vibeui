"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Select034Option = {
  value: string
  label: string
}

export type Select034Group = {
  label: string
  options: Select034Option[]
}

export type Select034Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  name?: string
  groups?: Select034Group[]
  defaultValue?: string
  /**
   * Показать список развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме список не всплывает над содержимым и не закрывается кликом мимо.
   */
  open?: boolean
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: список рисуем сами, а не отдаём операционной системе, —
// иначе разделы и галочку выбранного никто не увидит. Внутри listbox с
// настоящими role="group": заголовок раздела прилипает к верху при прокрутке,
// а текущее значение помечено галочкой в строке, а не одной подсветкой фона.
// Отличие от соседей: select-027 группирует нативным optgroup и рисунок списка
// остаётся системным, здесь же дизайн раскрытого списка виден целиком.
const STYLES = `
:where([data-vibeui-block="select-034"]){
--vibeui-select-034-bg:transparent;
--vibeui-select-034-fg:light-dark(oklch(0.23 0.016 265),oklch(0.94 0.005 265));
--vibeui-select-034-muted:color-mix(in oklab,var(--vibeui-select-034-fg) 68%,transparent);
--vibeui-select-034-border:light-dark(oklch(0.87 0.008 265),oklch(0.4 0.012 265));
--vibeui-select-034-accent:light-dark(oklch(0.52 0.18 262),oklch(0.76 0.15 262));
--vibeui-select-034-tint:color-mix(in oklab,var(--vibeui-select-034-accent) 14%,transparent);
--vibeui-select-034-panel:light-dark(oklch(1 0 0),oklch(0.25 0.014 265));
--vibeui-select-034-radius:0.625rem;
--vibeui-select-034-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="select-034"]{color-scheme:dark}
[data-vibeui-block="select-034"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:22rem;
/* container-type отрывает ширину от содержимого: без нижней границы блок
   схлопнется внутри flex-кадра. */
min-width:min(100%,15rem);container-type:inline-size;
background:var(--vibeui-select-034-bg);color:var(--vibeui-select-034-fg);
font-family:var(--vibeui-select-034-font);
}
[data-vibeui-block="select-034"] *{box-sizing:border-box}
[data-vibeui-block="select-034"] [data-part="label"]{
font-size:0.8125rem;font-weight:600;color:var(--vibeui-select-034-fg);
}
[data-vibeui-block="select-034"] [data-part="field"]{position:relative;display:block}
/* Подпись значения переводится и настраивается, поэтому высота набирается
   содержимым: фиксированная обрезала бы длинный вариант. */
[data-vibeui-block="select-034"] [data-part="trigger"]{
appearance:none;cursor:pointer;display:flex;align-items:center;gap:0.5rem;
width:100%;min-height:2.625rem;padding:0.4375rem 0.75rem;
border:1px solid var(--vibeui-select-034-border);
border-radius:var(--vibeui-select-034-radius);
background:transparent;color:var(--vibeui-select-034-fg);
font:inherit;font-size:0.9375rem;font-weight:500;text-align:left;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-034"] [data-part="trigger"]:hover{border-color:var(--vibeui-select-034-accent)}
[data-vibeui-block="select-034"] [data-part="trigger"]:focus-visible{
outline:none;border-color:var(--vibeui-select-034-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-034-accent) 24%,transparent);
}
[data-vibeui-block="select-034"] [data-part="value"]{flex:1;min-inline-size:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="select-034"] [data-part="group-of-value"]{
flex:none;font-size:0.75rem;font-weight:600;color:var(--vibeui-select-034-muted);
}
[data-vibeui-block="select-034"] [data-part="chevron"]{
flex:none;width:0.4375rem;height:0.4375rem;margin-inline-start:0.125rem;
border-right:1.5px solid var(--vibeui-select-034-muted);
border-bottom:1.5px solid var(--vibeui-select-034-muted);
transform:translateY(-0.125rem) rotate(45deg);transition:transform .16s ease;
}
[data-vibeui-block="select-034"] [data-part="trigger"][aria-expanded="true"] [data-part="chevron"]{
transform:translateY(0.0625rem) rotate(-135deg);
}
[data-vibeui-block="select-034"] [data-part="panel"]{
position:absolute;left:0;right:0;top:calc(100% + 0.375rem);z-index:20;
padding:0.3125rem;max-height:16rem;overflow-y:auto;
background:var(--vibeui-select-034-panel);
border:1px solid var(--vibeui-select-034-border);border-radius:0.875rem;
box-shadow:0 0.75rem 1.75rem light-dark(oklch(0 0 0 / 16%),oklch(0 0 0 / 48%));
}
[data-vibeui-block="select-034"] [data-part="panel"]:focus-visible{
outline:2px solid var(--vibeui-select-034-accent);outline-offset:-2px;
}
/* Витринный режим: список стоит в потоке под полем, а не всплывает слоем. */
[data-vibeui-block="select-034"] [data-part="panel"][data-open="true"]{
position:static;max-height:none;margin-block-start:0.375rem;box-shadow:none;
}
[data-vibeui-block="select-034"] [data-part="group-title"]{
position:sticky;top:-0.3125rem;z-index:1;
padding:0.4375rem 0.625rem 0.25rem;
background:var(--vibeui-select-034-panel);
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-select-034-muted);
}
[data-vibeui-block="select-034"] [data-part="group"] + [data-part="group"] [data-part="group-title"]{
margin-block-start:0.1875rem;
border-block-start:1px solid color-mix(in oklab,var(--vibeui-select-034-border) 70%,transparent);
}
[data-vibeui-block="select-034"] [data-part="option"]{
display:grid;grid-template-columns:1fr auto;align-items:center;gap:0.5rem;
padding:0.4375rem 0.625rem;border-radius:0.5rem;cursor:pointer;
font-size:0.875rem;line-height:1.3;color:var(--vibeui-select-034-fg);
}
[data-vibeui-block="select-034"] [data-part="option"][data-active="true"]{background:var(--vibeui-select-034-tint)}
[data-vibeui-block="select-034"] [data-part="option"][aria-selected="true"]{
color:var(--vibeui-select-034-accent);font-weight:650;
}
[data-vibeui-block="select-034"] [data-part="option-label"]{min-inline-size:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
/* Галочка рисуется двумя гранями: иконочная библиотека компоненту не нужна.
   Невыбранная строка держит её место, иначе текст прыгает при выборе. */
[data-vibeui-block="select-034"] [data-part="check"]{
flex:none;width:0.375rem;height:0.6875rem;margin-inline-end:0.125rem;visibility:hidden;
border-right:2px solid var(--vibeui-select-034-accent);
border-bottom:2px solid var(--vibeui-select-034-accent);
transform:rotate(45deg);
}
[data-vibeui-block="select-034"] [data-part="option"][aria-selected="true"] [data-part="check"]{visibility:visible}
@container (max-width: 17rem){
[data-vibeui-block="select-034"] [data-part="group-of-value"]{display:none}
[data-vibeui-block="select-034"] [data-part="group-title"]{padding-inline:0.5rem}
[data-vibeui-block="select-034"] [data-part="option"]{padding-inline:0.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-034"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Select034Group[] = [
  {
    label: "Разработка",
    options: [
      { value: "frontend", label: "Фронтенд" },
      { value: "backend", label: "Бэкенд" },
    ],
  },
  {
    label: "Дизайн",
    options: [
      { value: "product", label: "Продуктовый дизайн" },
      { value: "brand", label: "Бренд и графика" },
    ],
  },
  {
    label: "Поддержка",
    options: [
      { value: "support", label: "Первая линия" },
      { value: "success", label: "Работа с клиентами" },
    ],
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
 * Список с разделами: заголовки групп внутри раскрытого списка, выбранный
 * пункт помечен галочкой. Один файл, ноль зависимостей, своя палитра.
 */
export function Select034({
  label = "Команда",
  name,
  groups = DEFAULT_GROUPS,
  defaultValue,
  open = false,
  background = "",
  accent,
  id,
  className,
  style,
  ...props
}: Select034Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const listId = `${fieldId}-listbox`
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const flat = groups.flatMap((group) => group.options)
  const [value, setValue] = useState(defaultValue ?? flat[0]?.value ?? "")
  const [expanded, setExpanded] = useState(false)
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(
      0,
      flat.findIndex(
        (option) => option.value === (defaultValue ?? flat[0]?.value),
      ),
    ),
  )

  const visible = open || expanded
  const current = flat.find((option) => option.value === value) ?? flat[0]
  const currentGroup = groups.find((group) =>
    group.options.some((option) => option.value === current?.value),
  )

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
      panelRef.current?.focus()
    }
  }, [expanded])

  function choose(option: Select034Option) {
    setValue(option.value)
    setActiveIndex(flat.indexOf(option))
    setExpanded(false)
    triggerRef.current?.focus()
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      setExpanded(true)
    }
  }

  function handlePanelKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, flat.length - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === "Home") {
      event.preventDefault()
      setActiveIndex(0)
    } else if (event.key === "End") {
      event.preventDefault()
      setActiveIndex(flat.length - 1)
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      const option = flat[activeIndex]

      if (option) {
        choose(option)
      }
    } else if (event.key === "Escape") {
      event.preventDefault()
      setExpanded(false)
      triggerRef.current?.focus()
    } else if (event.key === "Tab") {
      setExpanded(false)
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-select-034-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-select-034-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-034" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={rootRef}
        data-slot="select"
        data-vibeui-block="select-034"
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
            aria-expanded={visible}
            aria-controls={listId}
            aria-labelledby={`${fieldId}-label ${fieldId}`}
            onClick={() => setExpanded((previous) => !previous)}
            onKeyDown={handleTriggerKeyDown}
          >
            <span data-part="value">{current?.label}</span>
            {currentGroup ? (
              <span data-part="group-of-value">{currentGroup.label}</span>
            ) : null}
            <span data-part="chevron" aria-hidden="true" />
          </button>
          {visible ? (
            <div
              ref={panelRef}
              data-part="panel"
              data-open={open || undefined}
              id={listId}
              role="listbox"
              aria-labelledby={`${fieldId}-label`}
              aria-activedescendant={`${listId}-${activeIndex}`}
              tabIndex={-1}
              onKeyDown={handlePanelKeyDown}
            >
              {groups.map((group, groupIndex) => (
                <div
                  key={group.label}
                  data-part="group"
                  role="group"
                  aria-labelledby={`${listId}-group-${groupIndex}`}
                >
                  <div
                    data-part="group-title"
                    id={`${listId}-group-${groupIndex}`}
                  >
                    {group.label}
                  </div>
                  {group.options.map((option) => {
                    const index = flat.indexOf(option)

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
                        <span data-part="option-label">{option.label}</span>
                        <span data-part="check" aria-hidden="true" />
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          ) : null}
        </span>
      </div>
    </>
  )
}
