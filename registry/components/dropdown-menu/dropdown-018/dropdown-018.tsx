"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Dropdown018Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  /**
   * Показать меню развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  placeholder?: string
  people?: string[]
  onChange?: (value: string) => void
  /** Строка слева. Плейсхолдер {name}. */
  assignedTemplate?: string
  /** Строка слева, когда никто не назначен. */
  unassignedText?: string
  /** Доступное имя кнопки при выбранном исполнителе. Плейсхолдер {name}. */
  changeLabelTemplate?: string
  /** Доступное имя кнопки и меню, когда никто не назначен. */
  assignLabel?: string
  /** Строка на месте пустой выборки. */
  emptyText?: string
  accent?: string
  /** Подложка плашки и меню. Пусто — собственный фон по теме окружения. */
  background?: string
}

// Идея компонента: назначение исполнителя через поиск по имени. В отличие
// от Searchable Select триггер — маленькая круглая кнопка, а не поле во всю
// ширину: компонент рассчитан на карточку задачи, где место в строке уже
// занято другими значками. Фокус после открытия уходит в поле поиска на
// событии toggle, список — role=menuitemradio, выбор закрывает меню и
// возвращает фокус на кнопку.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте плашка светлее фона страницы, а её граница светлее плашки.
const STYLES = `
:where([data-vibeui-block="dropdown-018"]){
--vibeui-dropdown-018-bg:light-dark(oklch(1 0 0),oklch(0.25 0.012 275));
--vibeui-dropdown-018-fg:light-dark(oklch(0.24 0.014 275),oklch(0.94 0.006 275));
--vibeui-dropdown-018-muted:color-mix(in oklab,var(--vibeui-dropdown-018-fg) 68%,transparent);
--vibeui-dropdown-018-border:light-dark(oklch(0.9 0.006 275),oklch(0.37 0.012 275));
--vibeui-dropdown-018-hover:light-dark(oklch(0.96 0.004 275),oklch(0.32 0.014 275));
--vibeui-dropdown-018-accent:light-dark(oklch(0.56 0.18 275),oklch(0.76 0.14 275));
--vibeui-dropdown-018-chip:light-dark(oklch(0.92 0.05 275),oklch(0.42 0.09 275));
--vibeui-dropdown-018-chip-fg:light-dark(oklch(0.38 0.09 275),oklch(0.93 0.04 275));
--vibeui-dropdown-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dropdown-018"]{color-scheme:dark}
[data-vibeui-block="dropdown-018"]{
position:relative;display:inline-flex;align-items:center;gap:0.5rem;
box-sizing:border-box;padding:0.375rem 0.75rem 0.375rem 0.5rem;
background:var(--vibeui-dropdown-018-bg);color:var(--vibeui-dropdown-018-fg);
border:1px solid var(--vibeui-dropdown-018-border);border-radius:9999px;
font-family:var(--vibeui-dropdown-018-font);
}
[data-vibeui-block="dropdown-018"] [data-part="current"]{font-size:0.8125rem;color:var(--vibeui-dropdown-018-muted)}
[data-vibeui-block="dropdown-018"] [data-part="trigger"]{
appearance:none;cursor:pointer;flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:1.875rem;height:1.875rem;border-radius:9999px;
border:1px dashed var(--vibeui-dropdown-018-border);
background:var(--vibeui-dropdown-018-bg);color:var(--vibeui-dropdown-018-muted);
anchor-name:--vibeui-dropdown-018-anchor;
font:inherit;font-size:0.6875rem;font-weight:700;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="dropdown-018"] [data-part="trigger"]:hover{background:var(--vibeui-dropdown-018-hover);color:var(--vibeui-dropdown-018-fg)}
[data-vibeui-block="dropdown-018"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dropdown-018-accent);outline-offset:2px}
[data-vibeui-block="dropdown-018"] [data-part="trigger"][data-picked="true"]{
border-style:solid;background:var(--vibeui-dropdown-018-chip);color:var(--vibeui-dropdown-018-chip-fg);
}
[data-vibeui-block="dropdown-018"] [data-part="menu"]{
position:fixed;margin:0;padding:0.375rem;min-width:15rem;box-sizing:border-box;
background:var(--vibeui-dropdown-018-bg);color:var(--vibeui-dropdown-018-fg);
border:1px solid var(--vibeui-dropdown-018-border);border-radius:0.875rem;
box-shadow:0 20px 44px -24px oklch(0.2 0.03 275 / 50%);
font-family:var(--vibeui-dropdown-018-font);
opacity:0;transform:translateY(-0.25rem);
transition:opacity .14s ease,transform .14s ease,display .14s allow-discrete,overlay .14s allow-discrete;
}
[data-vibeui-block="dropdown-018"] [data-part="menu"]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-block="dropdown-018"] [data-part="menu"]:popover-open{opacity:0;transform:translateY(-0.25rem)}}
@supports (anchor-name: --a){
[data-vibeui-block="dropdown-018"] [data-part="menu"]{
position-anchor:--vibeui-dropdown-018-anchor;
position-area:bottom span-left;margin:0.375rem 0 0;
position-try-fallbacks:flip-block,flip-inline;
}
}
@supports not (anchor-name: --a){
[data-vibeui-block="dropdown-018"] [data-part="menu"]{position:absolute;top:calc(100% + 0.375rem);right:0;inset:auto}
}
[data-vibeui-block="dropdown-018"] [data-part="search"]{
width:100%;height:2rem;padding:0 0.5625rem;box-sizing:border-box;margin-bottom:0.3125rem;
border:1px solid var(--vibeui-dropdown-018-border);border-radius:0.5rem;
background:var(--vibeui-dropdown-018-bg);color:inherit;font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="dropdown-018"] [data-part="search"]:focus-visible{outline:2px solid var(--vibeui-dropdown-018-accent);outline-offset:-1px}
[data-vibeui-block="dropdown-018"] [data-part="list"]{max-height:11rem;overflow:auto}
[data-vibeui-block="dropdown-018"] [data-part="item"]{
display:flex;align-items:center;gap:0.5625rem;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="dropdown-018"] [data-part="item"]:hover{background:var(--vibeui-dropdown-018-hover)}
[data-vibeui-block="dropdown-018"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-dropdown-018-accent);outline-offset:-2px}
[data-vibeui-block="dropdown-018"] [data-part="item"][aria-checked="true"]{font-weight:650}
[data-vibeui-block="dropdown-018"] [data-part="face"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.5rem;height:1.5rem;border-radius:9999px;
background:light-dark(oklch(0.92 0.05 var(--vibeui-dropdown-018-hue)),oklch(0.34 0.065 var(--vibeui-dropdown-018-hue)));
color:light-dark(oklch(0.38 0.09 var(--vibeui-dropdown-018-hue)),oklch(0.88 0.063 var(--vibeui-dropdown-018-hue)));
font-size:0.625rem;font-weight:700;
}
[data-vibeui-block="dropdown-018"] [data-part="name"]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="dropdown-018"] [data-part="tick"]{
margin-left:auto;width:0.9375rem;height:0.9375rem;flex:none;
color:var(--vibeui-dropdown-018-accent);opacity:0;
}
[data-vibeui-block="dropdown-018"] [data-part="item"][aria-checked="true"] [data-part="tick"]{opacity:1}
[data-vibeui-block="dropdown-018"] [data-part="empty"]{
padding:0.75rem 0.5rem;font-size:0.8125rem;color:var(--vibeui-dropdown-018-muted);text-align:center;
}
/* Развёрнутый режим: меню стоит в потоке под кнопкой, а не в верхнем слое. */
[data-vibeui-block="dropdown-018"]:has([data-open="true"]){flex-wrap:wrap}
[data-vibeui-block="dropdown-018"] [data-part="menu"][data-open="true"]{
position:static;opacity:1;transform:none;margin-top:0.375rem;flex-basis:100%;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dropdown-018"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PEOPLE = [
  "Илья Веснин",
  "Ольга Крылова",
  "Тимур Шарипов",
  "Дарья Лунёва",
  "Женя Осипов",
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
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function stepFocus(list: HTMLElement | null, delta: number) {
  if (!list) {
    return
  }

  const items = Array.from(
    list.querySelectorAll<HTMLElement>('[data-part="item"]'),
  )

  if (items.length === 0) {
    return
  }

  const from = items.indexOf(document.activeElement as HTMLElement)
  items[(from + delta + items.length) % items.length].focus()
}

/**
 * Назначение исполнителя: круглая кнопка-триггер и поиск по имени в меню.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dropdown018({
  open = false,
  placeholder = "Поиск по имени",
  people = DEFAULT_PEOPLE,
  onChange,
  assignedTemplate = "Исполнитель: {name}",
  unassignedText = "Исполнитель не назначен",
  changeLabelTemplate = "Сменить исполнителя: {name}",
  assignLabel = "Назначить исполнителя",
  emptyText = "Никого не нашлось",
  accent,
  background = "",
  className,
  style,
  ...props
}: Dropdown018Props) {
  const id = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const search = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [picked, setPicked] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const shown = people.filter((person) =>
    person.toLowerCase().includes(query.trim().toLowerCase()),
  )

  const choose = (person: string) => {
    setPicked(person)
    onChange?.(person)
    menu.current?.hidePopover()
    trigger.current?.focus()
  }

  const palette = {
    ...(accent ? { "--vibeui-dropdown-018-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dropdown-018-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-018" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="dropdown-menu"
        data-vibeui-block="dropdown-018"
        className={className}
        style={palette}
      >
        <span data-part="current">
          {picked ? assignedTemplate.replace("{name}", picked) : unassignedText}
        </span>
        <button
          ref={trigger}
          type="button"
          data-part="trigger"
          data-picked={picked !== null}
          popoverTarget={`${id}-menu`}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label={
            picked ? changeLabelTemplate.replace("{name}", picked) : assignLabel
          }
        >
          {picked ? initials(picked) : "+"}
        </button>
        <div
          id={`${id}-menu`}
          ref={menu}
          popover={open ? undefined : "auto"}
          data-open={open || undefined}
          role="menu"
          aria-label={assignLabel}
          data-part="menu"
          onToggle={(event) => {
            setMenuOpen(event.newState === "open")
            setQuery("")
            requestAnimationFrame(() => {
              if (menu.current?.matches(":popover-open")) {
                search.current?.focus()
              }
            })
          }}
          onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === "ArrowDown") {
              event.preventDefault()
              stepFocus(menu.current, 1)
            } else if (event.key === "ArrowUp") {
              event.preventDefault()
              stepFocus(menu.current, -1)
            }
          }}
        >
          <input
            ref={search}
            data-part="search"
            type="search"
            value={query}
            placeholder={placeholder}
            aria-label={placeholder}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div data-part="list">
            {shown.length === 0 ? (
              <p data-part="empty">{emptyText}</p>
            ) : (
              shown.map((person) => (
                <button
                  key={person}
                  type="button"
                  role="menuitemradio"
                  aria-checked={picked === person}
                  data-part="item"
                  style={
                    {
                      "--vibeui-dropdown-018-hue": hue(person),
                    } as CSSProperties
                  }
                  onClick={() => choose(person)}
                >
                  <span data-part="face" aria-hidden="true">
                    {initials(person)}
                  </span>
                  <span data-part="name">{person}</span>
                  <svg
                    data-part="tick"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12.5l4.5 4.5L19 7"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
