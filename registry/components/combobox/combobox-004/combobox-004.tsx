"use client"

import { useId, useMemo, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Combobox004Person = {
  name: string
  detail: string
}

export type Combobox004Props = Omit<
  ComponentProps<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  people?: Combobox004Person[]
  emptyLabel?: string
  defaultValue?: string
  onSelect?: (name: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: людей выбирают глазами, а не по строке. Строка списка
// двухэтажная — имя и почта, — а слева кружок с инициалами, оттенок которого
// считается из имени. Поиск идёт и по имени, и по второй строке: половина
// людей помнит почту, а не фамилию.
const STYLES = `
:where([data-vibeui-block="combobox-004"]){
--vibeui-combobox-004-bg:transparent;
--vibeui-combobox-004-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-combobox-004-muted:color-mix(in oklab,var(--vibeui-combobox-004-fg) 68%,transparent);
--vibeui-combobox-004-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-combobox-004-field:light-dark(oklch(0.985 0 265),oklch(0.3 0 265));
--vibeui-combobox-004-active:light-dark(oklch(0.955 0 265),oklch(0.35 0 265));
--vibeui-combobox-004-accent:light-dark(oklch(0.55 0.15 25),oklch(0.76 0.14 25));
--vibeui-combobox-004-radius:0.625rem;
--vibeui-combobox-004-hue:265;
--vibeui-combobox-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="combobox-004"]{color-scheme:dark}
[data-vibeui-block="combobox-004"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-004-bg);
border:1px solid var(--vibeui-combobox-004-border);
border-radius:calc(var(--vibeui-combobox-004-radius) + 0.25rem);
color:var(--vibeui-combobox-004-fg);
font-family:var(--vibeui-combobox-004-font);
}
[data-vibeui-block="combobox-004"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-004"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-combobox-004-border);
border-radius:var(--vibeui-combobox-004-radius);
background:var(--vibeui-combobox-004-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-004"] input::placeholder{color:var(--vibeui-combobox-004-muted)}
[data-vibeui-block="combobox-004"] input:focus-visible{outline:2px solid var(--vibeui-combobox-004-accent);outline-offset:1px;border-color:transparent}
[data-vibeui-block="combobox-004"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;max-height:13rem;overflow-y:auto;
border:1px solid var(--vibeui-combobox-004-border);
border-radius:var(--vibeui-combobox-004-radius);
}
[data-vibeui-block="combobox-004"] [data-part="option"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.4rem 0.5rem;border-radius:0.5rem;cursor:pointer;
}
[data-vibeui-block="combobox-004"] [data-part="option"][data-active="true"]{background:var(--vibeui-combobox-004-active)}
[data-vibeui-block="combobox-004"] [data-part="avatar"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:2rem;height:2rem;border-radius:999px;
font-size:0.75rem;font-weight:700;letter-spacing:0.02em;
background:light-dark(oklch(0.92 0.06 var(--vibeui-combobox-004-hue)),oklch(0.37 0.06 var(--vibeui-combobox-004-hue)));
color:light-dark(oklch(0.38 0.11 var(--vibeui-combobox-004-hue)),oklch(0.9 0.07 var(--vibeui-combobox-004-hue)));
}
[data-vibeui-block="combobox-004"] [data-part="text"]{display:flex;flex-direction:column;min-width:0;gap:0.05rem}
[data-vibeui-block="combobox-004"] [data-part="name"]{
font-size:0.875rem;font-weight:600;line-height:1.2;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="combobox-004"] [data-part="detail"]{
font-size:0.75rem;color:var(--vibeui-combobox-004-muted);line-height:1.2;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="combobox-004"] [data-part="check"]{
margin-left:auto;flex:none;font-size:0.85rem;font-weight:700;
color:var(--vibeui-combobox-004-accent);
}
[data-vibeui-block="combobox-004"] [data-part="empty"]{padding:0.5rem;font-size:0.8125rem;color:var(--vibeui-combobox-004-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-004"] *{animation:none!important;transition:none!important}}
/* Скрытый список: у ul браузерный display перебивает hidden, если
   компонент задаёт ему свой. */
[data-vibeui-block="combobox-004"] [role="listbox"][hidden]{display:none}

`

const DEFAULT_PEOPLE: Combobox004Person[] = [
  { name: "Анна Ковалёва", detail: "anna@studio.ru · дизайн" },
  { name: "Борис Ильин", detail: "boris@studio.ru · фронтенд" },
  { name: "Вера Наумова", detail: "vera@studio.ru · аналитика" },
  { name: "Глеб Осипов", detail: "gleb@studio.ru · бэкенд" },
  { name: "Дарья Титова", detail: "daria@studio.ru · поддержка" },
  { name: "Егор Панов", detail: "egor@studio.ru · инфраструктура" },
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
 * Ветка темы для заданного фона: светлая плашка иначе досталась бы тексту
 * тёмной ветки, потому что light-dark() смотрит на color-scheme, а не на цвет.
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
 * Combobox с людьми: аватар с инициалами, вторая строка с почтой и ролью,
 * поиск по обеим строкам.
 */
export function Combobox004({
  label = "Исполнитель",
  placeholder = "Имя или почта",
  people = DEFAULT_PEOPLE,
  emptyLabel = "Никого не нашлось",
  defaultValue = "Вера Наумова",
  onSelect,
  background = "",
  accent,
  className,
  style,
  ...props
}: Combobox004Props) {
  const id = useId()
  const [query, setQuery] = useState("")
  const [value, setValue] = useState(defaultValue)
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return people
    return people.filter((person) =>
      `${person.name} ${person.detail}`.toLowerCase().includes(needle),
    )
  }, [people, query])

  const [open, setOpen] = useState(false)
  const pressingList = useRef(false)

  const palette = {
    ...(accent ? { "--vibeui-combobox-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-combobox-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const commit = (person: Combobox004Person) => {
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
      <style href="vibeui-combobox-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="combobox"
        data-vibeui-block="combobox-004"
        onFocusCapture={() => setOpen(true)}
        onBlurCapture={(event) => {
          // Уход фокуса за пределы поля закрывает список; переход внутрь
          // (поле → кнопка очистки) оставляет его открытым. Нажатие по строке
          // списка фокус тоже уводит, но список должен дожить до выбора.
          if (pressingList.current) {
            return
          }

          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setOpen(false)
          }
        }}
        onKeyDownCapture={(event) => {
          if (event.key === "Escape") {
            setOpen(false)
          }
        }}
        onPointerDownCapture={(event) => {
          // Гасить нажатие нельзя: часть строк выбирается на mousedown, и
          // preventDefault отменил бы сам выбор. Держим флаг и не закрываем
          // список, пока кнопка мыши не отпущена.
          if ((event.target as HTMLElement).closest('[role="listbox"]')) {
            pressingList.current = true
            return
          }

          setOpen(true)
        }}
        onPointerUpCapture={() => {
          pressingList.current = false
        }}
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
          aria-expanded={open}
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
          hidden={!open}
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
                data-part="avatar"
                aria-hidden="true"
                style={
                  {
                    "--vibeui-combobox-004-hue": hue(person.name),
                  } as CSSProperties
                }
              >
                {initials(person.name)}
              </span>
              <span data-part="text">
                <span data-part="name">{person.name}</span>
                <span data-part="detail">{person.detail}</span>
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
