"use client"

import { useId, useMemo, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Combobox027Status = "online" | "away" | "offline"

export type Combobox027Person = {
  name: string
  role: string
  status: Combobox027Status
}

export type Combobox027Props = Omit<
  ComponentProps<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  people?: Combobox027Person[]
  emptyLabel?: string
  defaultValue?: string
  /** Слова статусов: компонент несёт русские, проект подставляет свои. */
  statusText?: Record<Combobox027Status, string>
  onSelect?: (name: string) => void
  /** Пусто — подложки нет, компонент лежит на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: при выборе исполнителя важно не только кто это, но и
// доступен ли он сейчас. Список сортируется по статусу — сначала те, кто в
// сети, — а у каждого аватара живёт цветная точка. Цвет дублируется словом
// в подписи, потому что точка без слова неразличима при дальтонизме.
//
// Тема берётся из color-scheme окружения через light-dark(). Обводка точки
// статуса живёт отдельным токеном ring: подложка блока прозрачна, а точке
// нужен непрозрачный ободок, чтобы читаться поверх аватара.
const STYLES = `
:where([data-vibeui-block="combobox-027"]){
--vibeui-combobox-027-bg:transparent;
--vibeui-combobox-027-ring:light-dark(oklch(1 0 0),oklch(0.24 0.012 160));
--vibeui-combobox-027-fg:light-dark(oklch(0.22 0.014 160),oklch(0.94 0.008 160));
--vibeui-combobox-027-muted:color-mix(in oklab,var(--vibeui-combobox-027-fg) 68%,transparent);
--vibeui-combobox-027-border:light-dark(oklch(0.9 0.006 160),oklch(0.36 0.012 160));
--vibeui-combobox-027-field:light-dark(oklch(0.985 0.002 160),oklch(0.27 0.01 160));
--vibeui-combobox-027-active:light-dark(oklch(0.955 0.02 160),oklch(0.34 0.03 160));
--vibeui-combobox-027-accent:light-dark(oklch(0.5 0.13 160),oklch(0.74 0.13 160));
--vibeui-combobox-027-online:light-dark(oklch(0.62 0.16 150),oklch(0.72 0.16 150));
--vibeui-combobox-027-away:light-dark(oklch(0.72 0.15 80),oklch(0.78 0.14 80));
--vibeui-combobox-027-offline:light-dark(oklch(0.65 0.01 160),oklch(0.55 0.01 160));
--vibeui-combobox-027-radius:0.625rem;
--vibeui-combobox-027-hue:265;
--vibeui-combobox-027-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="combobox-027"]{color-scheme:dark}
[data-vibeui-block="combobox-027"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-027-bg);
border:1px solid var(--vibeui-combobox-027-border);
border-radius:calc(var(--vibeui-combobox-027-radius) + 0.25rem);
color:var(--vibeui-combobox-027-fg);
font-family:var(--vibeui-combobox-027-font);
}
[data-vibeui-block="combobox-027"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-027"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-combobox-027-border);
border-radius:var(--vibeui-combobox-027-radius);
background:var(--vibeui-combobox-027-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-027"] input::placeholder{color:var(--vibeui-combobox-027-muted)}
[data-vibeui-block="combobox-027"] input:focus-visible{outline:2px solid var(--vibeui-combobox-027-accent);outline-offset:1px;border-color:transparent}
[data-vibeui-block="combobox-027"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;max-height:13rem;overflow-y:auto;
border:1px solid var(--vibeui-combobox-027-border);
border-radius:var(--vibeui-combobox-027-radius);
}
[data-vibeui-block="combobox-027"] [data-part="option"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.4rem 0.5rem;border-radius:0.5rem;cursor:pointer;
}
[data-vibeui-block="combobox-027"] [data-part="option"][data-active="true"]{background:var(--vibeui-combobox-027-active)}
[data-vibeui-block="combobox-027"] [data-part="avatarwrap"]{position:relative;flex:none;display:flex}
[data-vibeui-block="combobox-027"] [data-part="avatar"]{
display:flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:999px;
font-size:0.75rem;font-weight:700;letter-spacing:0.02em;
background:light-dark(oklch(0.92 0.06 var(--vibeui-combobox-027-hue)),oklch(0.37 0.06 var(--vibeui-combobox-027-hue)));
color:light-dark(oklch(0.38 0.11 var(--vibeui-combobox-027-hue)),oklch(0.9 0.07 var(--vibeui-combobox-027-hue)));
}
[data-vibeui-block="combobox-027"] [data-part="dot"]{
position:absolute;right:-0.05rem;bottom:-0.05rem;
width:0.55rem;height:0.55rem;border-radius:999px;
border:1.5px solid var(--vibeui-combobox-027-ring);
}
[data-vibeui-block="combobox-027"] [data-part="dot"][data-status="online"]{background:var(--vibeui-combobox-027-online)}
[data-vibeui-block="combobox-027"] [data-part="dot"][data-status="away"]{background:var(--vibeui-combobox-027-away)}
[data-vibeui-block="combobox-027"] [data-part="dot"][data-status="offline"]{background:var(--vibeui-combobox-027-offline)}
[data-vibeui-block="combobox-027"] [data-part="text"]{display:flex;flex-direction:column;min-width:0;gap:0.05rem}
[data-vibeui-block="combobox-027"] [data-part="name"]{
font-size:0.875rem;font-weight:600;line-height:1.2;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="combobox-027"] [data-part="detail"]{
font-size:0.75rem;color:var(--vibeui-combobox-027-muted);line-height:1.2;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="combobox-027"] [data-part="check"]{
margin-left:auto;flex:none;font-size:0.85rem;font-weight:700;color:var(--vibeui-combobox-027-accent);
}
[data-vibeui-block="combobox-027"] [data-part="empty"]{padding:0.5rem;font-size:0.8125rem;color:var(--vibeui-combobox-027-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-027"] *{animation:none!important;transition:none!important}}
`

const STATUS_LABEL: Record<Combobox027Status, string> = {
  online: "в сети",
  away: "отошёл",
  offline: "не в сети",
}

const STATUS_RANK: Record<Combobox027Status, number> = {
  online: 0,
  away: 1,
  offline: 2,
}

const DEFAULT_PEOPLE: Combobox027Person[] = [
  { name: "Анна Ковалёва", role: "дизайн", status: "online" },
  { name: "Борис Ильин", role: "фронтенд", status: "away" },
  { name: "Вера Наумова", role: "аналитика", status: "offline" },
  { name: "Глеб Осипов", role: "бэкенд", status: "online" },
  { name: "Дарья Титова", role: "поддержка", status: "offline" },
  { name: "Егор Панов", role: "инфраструктура", status: "away" },
]

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
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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
 * Combobox для выбора исполнителя с аватарами и статусом онлайн: сначала
 * те, кто в сети, у каждого аватара цветная точка и подпись статуса.
 */
export function Combobox027({
  label = "Исполнитель",
  placeholder = "Имя или роль",
  people = DEFAULT_PEOPLE,
  emptyLabel = "Никого не нашлось",
  defaultValue = "",
  statusText = STATUS_LABEL,
  onSelect,
  background = "",
  accent,
  className,
  style,
  ...props
}: Combobox027Props) {
  const id = useId()
  const [query, setQuery] = useState("")
  const [value, setValue] = useState(defaultValue)
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const filtered = people.filter(
      (person) =>
        !needle ||
        `${person.name} ${person.role}`.toLowerCase().includes(needle),
    )
    return [...filtered].sort(
      (left, right) => STATUS_RANK[left.status] - STATUS_RANK[right.status],
    )
  }, [people, query])

  const palette = {
    ...(accent ? { "--vibeui-combobox-027-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-combobox-027-bg": background,
          "--vibeui-combobox-027-ring": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const commit = (person: Combobox027Person) => {
    setValue(person.name)
    setQuery("")
    setActive(0)
    onSelect?.(person.name)
  }

  const move = (delta: number) => {
    if (!matches.length) return
    const next = (active + delta + matches.length) % matches.length
    setActive(next)
    listRef.current?.children[next]?.scrollIntoView({ block: "nearest" })
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
      if (matches[active]) commit(matches[active])
    } else if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
    }
  }

  return (
    <>
      <style href="vibeui-combobox-027" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="combobox"
        data-vibeui-block="combobox-027"
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
          {matches.map((person, index) => (
            <li
              key={person.name}
              id={`${id}-option-${index}`}
              role="option"
              data-part="option"
              data-active={index === active}
              aria-selected={person.name === value}
              onMouseEnter={() => setActive(index)}
              onMouseDown={(event) => {
                event.preventDefault()
                commit(person)
              }}
            >
              <span
                data-part="avatarwrap"
                style={
                  {
                    "--vibeui-combobox-027-hue": hue(person.name),
                  } as CSSProperties
                }
              >
                <span data-part="avatar" aria-hidden="true">
                  {initials(person.name)}
                </span>
                <span
                  data-part="dot"
                  data-status={person.status}
                  aria-hidden="true"
                />
              </span>
              <span data-part="text">
                <span data-part="name">{person.name}</span>
                <span data-part="detail">
                  {person.role} ·{" "}
                  {statusText[person.status] ?? STATUS_LABEL[person.status]}
                </span>
              </span>
              {person.name === value ? (
                <span data-part="check" aria-hidden="true">
                  ✓
                </span>
              ) : null}
            </li>
          ))}
          {matches.length === 0 ? (
            <li data-part="empty" role="presentation">
              {emptyLabel}
            </li>
          ) : null}
        </ul>
      </div>
    </>
  )
}
