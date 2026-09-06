"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Select014Person = {
  value: string
  name: string
  role: string
}

export type Select014Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  name?: string
  people?: Select014Person[]
  defaultValue?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: выбор исполнителя опознаётся по лицу быстрее, чем по
// фамилии — аватар с инициалами и подпись роли живут в каждой строке
// списка и в самом триггере. Своя открывающая кнопка и listbox, как в
// select-013/014-родственниках: система не умеет рисовать вторую строку
// и цветной кружок внутри option нативного select.
const STYLES = `
:where([data-vibeui-block="select-014"]){
--vibeui-select-014-surface:transparent;
--vibeui-select-014-surface-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-select-014-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-select-014-muted:color-mix(in oklab,var(--vibeui-select-014-fg) 68%,transparent);
--vibeui-select-014-border:light-dark(oklch(0.87 0 265),oklch(0.4 0 265));
--vibeui-select-014-accent:light-dark(oklch(0.55 0.19 262),oklch(0.73 0.17 262));
--vibeui-select-014-tint:light-dark(oklch(0.55 0.19 262 / 12%),oklch(0.73 0.17 262 / 20%));
--vibeui-select-014-panel:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-select-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="select-014"]{color-scheme:dark}
[data-vibeui-block="select-014"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-014-surface);
border:1px solid var(--vibeui-select-014-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-014-font);color:var(--vibeui-select-014-fg);
container-type:inline-size;
}
[data-vibeui-block="select-014"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-014"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-014"] [data-part="trigger"]{
display:flex;align-items:center;gap:0.625rem;
box-sizing:border-box;width:100%;min-height:3rem;padding:0.375rem 2.25rem 0.375rem 0.5rem;
border:1px solid var(--vibeui-select-014-border);border-radius:0.75rem;
background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-014"] [data-part="trigger"]:hover{border-color:var(--vibeui-select-014-accent)}
[data-vibeui-block="select-014"] [data-part="trigger"]:focus-visible{
outline:none;border-color:var(--vibeui-select-014-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-014-accent) 22%,transparent);
}
[data-vibeui-block="select-014"] [data-part="avatar"]{
flex:none;display:flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;border-radius:9999px;
background:light-dark(oklch(0.9 0.05 var(--vibeui-select-014-hue,265)),oklch(0.37 0.05 var(--vibeui-select-014-hue,265)));
color:light-dark(oklch(0.35 0.09 var(--vibeui-select-014-hue,265)),oklch(0.9 0.06 var(--vibeui-select-014-hue,265)));
font-size:0.75rem;font-weight:700;
}
[data-vibeui-block="select-014"] [data-part="body"]{min-width:0;display:flex;flex-direction:column;gap:0.0625rem}
[data-vibeui-block="select-014"] [data-part="name"]{
font-size:0.9375rem;font-weight:600;line-height:1.25;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="select-014"] [data-part="role"]{
font-size:0.75rem;line-height:1.2;color:var(--vibeui-select-014-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="select-014"] [data-part="chevron"]{
position:absolute;right:0.875rem;top:50%;
width:0.4375rem;height:0.4375rem;margin-top:-0.3125rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-select-014-muted);
border-bottom:1.5px solid var(--vibeui-select-014-muted);
transform:rotate(45deg);transition:transform .16s ease;
}
[data-vibeui-block="select-014"] [data-part="trigger"][aria-expanded="true"] ~ [data-part="chevron"]{
transform:rotate(-135deg);
}
[data-vibeui-block="select-014"] [data-part="panel"]{
position:absolute;left:0;right:0;top:calc(100% + 0.375rem);z-index:20;
margin:0;padding:0.375rem;list-style:none;
max-height:16rem;overflow-y:auto;
background:var(--vibeui-select-014-panel);
border:1px solid var(--vibeui-select-014-border);border-radius:0.875rem;
box-shadow:0 0.75rem 1.75rem light-dark(oklch(0 0 0 / 16%),oklch(0 0 0 / 48%));
}
[data-vibeui-block="select-014"] [data-part="option"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.4375rem 0.5rem;border-radius:0.625rem;cursor:pointer;
}
[data-vibeui-block="select-014"] [data-part="option"][data-active="true"]{
background:var(--vibeui-select-014-tint);
}
[data-vibeui-block="select-014"] [data-part="option"][aria-selected="true"] [data-part="name"]{
color:var(--vibeui-select-014-accent);
}
@container (max-width: 15rem){
[data-vibeui-block="select-014"] [data-part="avatar"]{width:1.875rem;height:1.875rem;font-size:0.6875rem}
[data-vibeui-block="select-014"] [data-part="name"]{font-size:0.875rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PEOPLE: Select014Person[] = [
  { value: "anna", name: "Анна Петрова", role: "Дизайнер" },
  { value: "oleg", name: "Олег Дроздов", role: "Backend-разработчик" },
  { value: "irina", name: "Ирина Ким", role: "Продакт-менеджер" },
  { value: "mark", name: "Марк Ильин", role: "Frontend-разработчик" },
]

// Оттенок аватара из имени: FNV-1a по кодовым точкам, разложенный по
// двенадцати ступеням круга — сумма кодов символов сводит кириллические
// имена в один сектор, ступени в 30° дают заведомо различимые цвета.
function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
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
 * Select исполнителя: аватар с инициалами и подпись роли у каждого
 * варианта и в самом триггере. Один файл, ноль зависимостей, собственная
 * палитра, клавиатура и listbox — свои.
 */
export function Select014({
  label = "Исполнитель",
  name,
  people = DEFAULT_PEOPLE,
  defaultValue = people[0]?.value,
  background = "",
  accent,
  id,
  className,
  style,
  ...props
}: Select014Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const listId = `${fieldId}-listbox`
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const [value, setValue] = useState(defaultValue ?? DEFAULT_PEOPLE[0].value)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(
      0,
      people.findIndex((person) => person.value === value),
    ),
  )

  const current = people.find((person) => person.value === value) ?? people[0]

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

  function choose(person: Select014Person) {
    setValue(person.value)
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
      setActiveIndex((index) => Math.min(index + 1, people.length - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      const person = people[activeIndex]
      if (person) choose(person)
    } else if (event.key === "Escape") {
      event.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
    } else if (event.key === "Tab") {
      setOpen(false)
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-select-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-select-014-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-014" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={rootRef}
        data-slot="select"
        data-vibeui-block="select-014"
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
            <span
              data-part="avatar"
              aria-hidden="true"
              style={
                {
                  "--vibeui-select-014-hue": hue(current.name),
                } as CSSProperties
              }
            >
              {initials(current.name)}
            </span>
            <span data-part="body">
              <span data-part="name">{current.name}</span>
              <span data-part="role">{current.role}</span>
            </span>
          </button>
          <span data-part="chevron" aria-hidden="true" />
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
              {people.map((person, index) => (
                <li
                  key={person.value}
                  id={`${listId}-${index}`}
                  data-part="option"
                  data-active={index === activeIndex}
                  role="option"
                  aria-selected={person.value === value}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    choose(person)
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <span
                    data-part="avatar"
                    aria-hidden="true"
                    style={
                      {
                        "--vibeui-select-014-hue": hue(person.name),
                      } as CSSProperties
                    }
                  >
                    {initials(person.name)}
                  </span>
                  <span data-part="body">
                    <span data-part="name">{person.name}</span>
                    <span data-part="role">{person.role}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </span>
      </div>
    </>
  )
}
