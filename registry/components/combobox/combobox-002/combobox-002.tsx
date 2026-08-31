"use client"

import { useId, useMemo, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Combobox002Group = {
  label: string
  options: string[]
}

export type Combobox002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  groups?: Combobox002Group[]
  emptyLabel?: string
  onSelect?: (value: string) => void
  accent?: string
}

// Идея компонента: одинаковые названия в разных разделах перестают путаться,
// если у списка есть заголовки групп. Заголовок — не строка списка: он
// помечен role="presentation" и подписывает role="group", поэтому стрелки
// через него перепрыгивают, а скринридер всё равно называет раздел.
const STYLES = `
:where([data-vibeui-block="combobox-002"]){
--vibeui-combobox-002-bg:oklch(1 0 0);
--vibeui-combobox-002-fg:oklch(0.21 0.015 190);
--vibeui-combobox-002-muted:oklch(0.52 0.016 190);
--vibeui-combobox-002-border:oklch(0.9 0.008 190);
--vibeui-combobox-002-field:oklch(0.985 0.004 190);
--vibeui-combobox-002-active:oklch(0.95 0.03 190);
--vibeui-combobox-002-accent:oklch(0.52 0.11 190);
--vibeui-combobox-002-radius:0.625rem;
--vibeui-combobox-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="combobox-002"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-002-bg);
border:1px solid var(--vibeui-combobox-002-border);
border-radius:calc(var(--vibeui-combobox-002-radius) + 0.25rem);
color:var(--vibeui-combobox-002-fg);
font-family:var(--vibeui-combobox-002-font);
}
[data-vibeui-block="combobox-002"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-002"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-combobox-002-border);
border-radius:var(--vibeui-combobox-002-radius);
background:var(--vibeui-combobox-002-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-002"] input::placeholder{color:var(--vibeui-combobox-002-muted)}
[data-vibeui-block="combobox-002"] input:focus-visible{outline:2px solid var(--vibeui-combobox-002-accent);outline-offset:1px;border-color:transparent}
[data-vibeui-block="combobox-002"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;max-height:12rem;overflow-y:auto;
border:1px solid var(--vibeui-combobox-002-border);
border-radius:var(--vibeui-combobox-002-radius);
background:var(--vibeui-combobox-002-bg);
}
[data-vibeui-block="combobox-002"] [data-part="group"]{margin:0;padding:0;list-style:none}
[data-vibeui-block="combobox-002"] [data-part="group"] + [data-part="group"]{
margin-top:0.25rem;padding-top:0.25rem;border-top:1px solid var(--vibeui-combobox-002-border);
}
[data-vibeui-block="combobox-002"] [data-part="grouplabel"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.3rem 0.5rem 0.2rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-combobox-002-muted);
}
[data-vibeui-block="combobox-002"] [data-part="count"]{
font-size:0.6875rem;font-weight:600;letter-spacing:0;
color:var(--vibeui-combobox-002-accent);
}
[data-vibeui-block="combobox-002"] [data-part="option"]{
display:flex;align-items:center;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="combobox-002"] [data-part="option"][data-active="true"]{background:var(--vibeui-combobox-002-active)}
[data-vibeui-block="combobox-002"] [data-part="option"][aria-selected="true"]{font-weight:650;color:var(--vibeui-combobox-002-accent)}
[data-vibeui-block="combobox-002"] [data-part="empty"]{padding:0.5rem;font-size:0.8125rem;color:var(--vibeui-combobox-002-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Combobox002Group[] = [
  {
    label: "Продажи",
    options: ["Новая сделка", "Отчёт по воронке", "Список клиентов"],
  },
  {
    label: "Поддержка",
    options: ["Новая заявка", "Очередь обращений", "База знаний"],
  },
  {
    label: "Настройки",
    options: ["Пользователи", "Роли и доступы", "Интеграции"],
  },
]

/**
 * Combobox с группами: заголовки разделов остаются в списке при фильтрации,
 * пустые группы скрываются.
 */
export function Combobox002({
  label = "Раздел",
  placeholder = "Найти раздел",
  groups = DEFAULT_GROUPS,
  emptyLabel = "Ничего не нашлось",
  onSelect,
  accent,
  className,
  style,
  ...props
}: Combobox002Props) {
  const id = useId()
  const [query, setQuery] = useState("")
  const [value, setValue] = useState("")
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const found = groups
      .map((group) => ({
        label: group.label,
        options: needle
          ? group.options.filter((option) =>
              option.toLowerCase().includes(needle),
            )
          : group.options,
      }))
      .filter((group) => group.options.length > 0)

    // Плоский порядок нужен клавиатуре: стрелки ходят по строкам, а не по
    // группам. Сквозной индекс первой строки группы считается здесь, чтобы
    // в разметке не пришлось вести счётчик — на нём держится
    // aria-activedescendant.
    const flat: string[] = []
    const filtered = found.map((group) => {
      const start = flat.length
      flat.push(...group.options)
      return { ...group, start }
    })

    return { filtered, flat }
  }, [groups, query])

  const palette = {
    ...(accent ? { "--vibeui-combobox-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  const commit = (option: string) => {
    setValue(option)
    setQuery("")
    setActive(0)
    onSelect?.(option)
  }

  const move = (delta: number) => {
    const total = visible.flat.length
    if (!total) return
    const next = (active + delta + total) % total
    setActive(next)
    listRef.current
      ?.querySelectorAll('[role="option"]')
      [next]?.scrollIntoView({ block: "nearest" })
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      move(1)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      move(-1)
    } else if (event.key === "Enter") {
      event.preventDefault()
      const option = visible.flat[active]
      if (option) commit(option)
    } else if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
      setActive(0)
    }
  }

  return (
    <>
      <style href="vibeui-combobox-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="combobox-002"
        className={className}
        style={palette}
      >
        <label htmlFor={`${id}-input`}>{label}</label>
        <input
          id={`${id}-input`}
          type="text"
          role="combobox"
          autoComplete="off"
          placeholder={value || placeholder}
          aria-expanded="true"
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={
            visible.flat[active] ? `${id}-option-${active}` : undefined
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
          {visible.filtered.map((group) => (
            <li key={group.label} data-part="group" role="presentation">
              <ul
                role="group"
                aria-labelledby={`${id}-group-${group.label}`}
                data-part="group"
              >
                <li
                  id={`${id}-group-${group.label}`}
                  role="presentation"
                  data-part="grouplabel"
                >
                  {group.label}
                  <span data-part="count">{group.options.length}</span>
                </li>
                {group.options.map((option, offset) => {
                  const index = group.start + offset

                  return (
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
                      {option}
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
          {visible.flat.length === 0 ? (
            <li data-part="empty" role="presentation">
              {emptyLabel}
            </li>
          ) : null}
        </ul>
      </div>
    </>
  )
}
