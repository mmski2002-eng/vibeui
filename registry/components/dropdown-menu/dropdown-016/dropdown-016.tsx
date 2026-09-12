"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Dropdown016Label = {
  name: string
  hue: number
  count: number
}

export type Dropdown016Props = Omit<ComponentProps<"div">, "children"> & {
  /**
   * Показать меню развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  trigger?: string
  labels?: Dropdown016Label[]
  /** Подпись над кнопкой: где стоит фильтр. */
  caption?: string
  /** Значок «фильтр не включён» в кнопке. */
  allText?: string
  /** Строка под списком при выборе. Плейсхолдер {count}. */
  selectedTemplate?: string
  /** Строка под списком при пустом выборе. */
  allShownText?: string
  /** Подпись кнопки сброса. */
  resetText?: string
  accent?: string
  /** Подложка карточки и меню. Пусто — собственный фон по теме окружения. */
  background?: string
}

// Идея компонента: фильтр по меткам доски. От обычного списка команд его
// отличают три вещи: нажатие не закрывает меню (метки включают пачкой),
// у каждой метки есть цветной кружок (по одному слову «Срочно» и «Баг» не
// различить в списке из десяти пунктов) и число карточек с этой меткой,
// чтобы было видно, включать ли фильтр вообще. Пустой выбор равен «показать всё».
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте карточка светлее фона страницы, а её граница светлее карточки.
const STYLES = `
:where([data-vibeui-block="dropdown-016"]){
--vibeui-dropdown-016-bg:light-dark(oklch(1 0 0),oklch(0.25 0.012 150));
--vibeui-dropdown-016-fg:light-dark(oklch(0.24 0.014 150),oklch(0.94 0.006 150));
--vibeui-dropdown-016-muted:color-mix(in oklab,var(--vibeui-dropdown-016-fg) 68%,transparent);
--vibeui-dropdown-016-border:light-dark(oklch(0.9 0.006 150),oklch(0.37 0.012 150));
--vibeui-dropdown-016-hover:light-dark(oklch(0.96 0.004 150),oklch(0.32 0.014 150));
--vibeui-dropdown-016-accent:light-dark(oklch(0.295 0 0),oklch(0.906 0 0));
--vibeui-dropdown-016-on-accent:light-dark(oklch(1 0 0),oklch(0.2 0.03 150));
--vibeui-dropdown-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dropdown-016"]{color-scheme:dark}
[data-vibeui-block="dropdown-016"]{
position:relative;display:inline-flex;flex-direction:column;gap:0.375rem;
box-sizing:border-box;padding:0.625rem 0.75rem;
background:var(--vibeui-dropdown-016-bg);color:var(--vibeui-dropdown-016-fg);
border:1px solid var(--vibeui-dropdown-016-border);border-radius:0.875rem;
font-family:var(--vibeui-dropdown-016-font);
}
[data-vibeui-block="dropdown-016"] [data-part="caption"]{
font-size:0.6875rem;font-weight:650;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-dropdown-016-muted);
}
[data-vibeui-block="dropdown-016"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.125rem;padding:0 0.75rem;
border:1px solid var(--vibeui-dropdown-016-border);border-radius:0.625rem;
background:var(--vibeui-dropdown-016-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
anchor-name:--vibeui-dropdown-016-anchor;
transition:background-color .16s ease;
}
[data-vibeui-block="dropdown-016"] [data-part="trigger"]:hover{background:var(--vibeui-dropdown-016-hover)}
[data-vibeui-block="dropdown-016"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dropdown-016-accent);outline-offset:2px}
[data-vibeui-block="dropdown-016"] [data-part="count"]{
display:inline-flex;align-items:center;justify-content:center;
min-width:1.25rem;height:1.25rem;padding:0 0.3125rem;box-sizing:border-box;
border-radius:9999px;font-size:0.6875rem;font-weight:700;
background:color-mix(in oklab,var(--vibeui-dropdown-016-accent) 16%,transparent);
color:var(--vibeui-dropdown-016-accent);
}
[data-vibeui-block="dropdown-016"] [data-part="menu"]{
position:fixed;margin:0;padding:0.3125rem;min-width:14.5rem;box-sizing:border-box;
background:var(--vibeui-dropdown-016-bg);color:var(--vibeui-dropdown-016-fg);
border:1px solid var(--vibeui-dropdown-016-border);border-radius:0.75rem;
box-shadow:0 18px 40px -22px oklch(0.2 0.03 150 / 45%);
font-family:var(--vibeui-dropdown-016-font);
opacity:0;transform:translateY(-0.25rem);
transition:opacity .14s ease,transform .14s ease,display .14s allow-discrete,overlay .14s allow-discrete;
}
[data-vibeui-block="dropdown-016"] [data-part="menu"]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-block="dropdown-016"] [data-part="menu"]:popover-open{opacity:0;transform:translateY(-0.25rem)}}
@supports (anchor-name: --a){
[data-vibeui-block="dropdown-016"] [data-part="menu"]{
position-anchor:--vibeui-dropdown-016-anchor;
position-area:bottom span-right;margin:0.375rem 0 0;
position-try-fallbacks:flip-block,flip-inline;
}
}
@supports not (anchor-name: --a){
[data-vibeui-block="dropdown-016"] [data-part="menu"]{position:absolute;top:calc(100% + 0.375rem);left:0;inset:auto}
}
[data-vibeui-block="dropdown-016"] [data-part="item"]{
display:flex;align-items:center;gap:0.625rem;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="dropdown-016"] [data-part="item"]:hover{background:var(--vibeui-dropdown-016-hover)}
[data-vibeui-block="dropdown-016"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-dropdown-016-accent);outline-offset:-2px}
/* Отметка занимает место всегда: иначе строки прыгают при переключении. */
[data-vibeui-block="dropdown-016"] [data-part="box"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.0625rem;height:1.0625rem;box-sizing:border-box;
border:1.5px solid var(--vibeui-dropdown-016-border);border-radius:0.3125rem;
transition:background-color .14s ease,border-color .14s ease;
}
[data-vibeui-block="dropdown-016"] [data-part="item"][aria-checked="true"] [data-part="box"]{
background:var(--vibeui-dropdown-016-accent);border-color:var(--vibeui-dropdown-016-accent);color:oklch(from var(--vibeui-dropdown-016-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="dropdown-016"] [data-part="box"] svg{width:0.75rem;height:0.75rem;opacity:0}
[data-vibeui-block="dropdown-016"] [data-part="item"][aria-checked="true"] [data-part="box"] svg{opacity:1;color:var(--vibeui-dropdown-016-on-accent)}
/* Цвет кружка — сама метка, а не оформление: он одинаков в обеих темах,
   иначе «Срочно» перестанет быть узнаваемым. Светлота средняя, чтобы
   читаться и на белой карточке, и на тёмной. */
[data-vibeui-block="dropdown-016"] [data-part="dot"]{
flex:none;width:0.5rem;height:0.5rem;border-radius:9999px;
background:oklch(0.62 0.16 var(--vibeui-dropdown-016-dot));
}
[data-vibeui-block="dropdown-016"] [data-part="label"]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="dropdown-016"] [data-part="tally"]{flex:none;font-size:0.75rem;color:var(--vibeui-dropdown-016-muted)}
[data-vibeui-block="dropdown-016"] [data-part="foot"]{
display:flex;justify-content:space-between;align-items:center;gap:0.75rem;
margin-top:0.3125rem;padding:0.4375rem 0.5rem 0.1875rem;
border-top:1px solid var(--vibeui-dropdown-016-border);
font-size:0.75rem;color:var(--vibeui-dropdown-016-muted);
}
[data-vibeui-block="dropdown-016"] [data-part="reset"]{
appearance:none;border:0;background:none;cursor:pointer;padding:0;
font:inherit;font-size:0.75rem;font-weight:600;color:var(--vibeui-dropdown-016-accent);
}
[data-vibeui-block="dropdown-016"] [data-part="reset"]:focus-visible{outline:2px solid var(--vibeui-dropdown-016-accent);outline-offset:2px}
/* Развёрнутый режим: меню стоит в потоке под кнопкой, а не в верхнем слое. */
[data-vibeui-block="dropdown-016"] [data-part="menu"][data-open="true"]{
position:static;opacity:1;transform:none;margin-top:0.375rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dropdown-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LABELS: Dropdown016Label[] = [
  { name: "Срочно", hue: 25, count: 4 },
  { name: "Баг", hue: 340, count: 9 },
  { name: "Улучшение", hue: 210, count: 6 },
  { name: "Вопрос", hue: 60, count: 2 },
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

function stepFocus(menu: HTMLElement | null, delta: number) {
  if (!menu) {
    return
  }

  const items = Array.from(
    menu.querySelectorAll<HTMLElement>('[data-part="item"]'),
  )

  if (items.length === 0) {
    return
  }

  const from = items.indexOf(document.activeElement as HTMLElement)
  items[(from + delta + items.length) % items.length].focus()
}

/**
 * Меню-фильтр по меткам: цветной кружок и число карточек на каждый пункт.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dropdown016({
  open = false,
  trigger = "Метки",
  labels = DEFAULT_LABELS,
  caption = "Доска спринта",
  allText = "Все",
  selectedTemplate = "Выбрано меток: {count}",
  allShownText = "Показаны все карточки",
  resetText = "Сбросить",
  accent,
  background = "",
  className,
  style,
  ...props
}: Dropdown016Props) {
  const id = useId()
  const anchorRef = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState<string[]>([])
  const [menuOpen, setMenuOpen] = useState(false)

  const toggle = (name: string) =>
    setOn((current) =>
      current.includes(name)
        ? current.filter((entry) => entry !== name)
        : [...current, name],
    )

  const palette = {
    ...(accent ? { "--vibeui-dropdown-016-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dropdown-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-016" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="dropdown-menu"
        data-vibeui-block="dropdown-016"
        className={className}
        style={palette}
      >
        <span data-part="caption">{caption}</span>
        <button
          ref={anchorRef}
          type="button"
          data-part="trigger"
          popoverTarget={`${id}-menu`}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault()
              const node = menu.current

              if (node) {
                if (!node.matches(":popover-open")) {
                  node.showPopover()
                }

                requestAnimationFrame(() =>
                  node
                    .querySelector<HTMLElement>('[data-part="item"]')
                    ?.focus(),
                )
              }
            }
          }}
        >
          {trigger}
          <span data-part="count">{on.length || allText}</span>
        </button>
        <div
          id={`${id}-menu`}
          ref={menu}
          popover={open ? undefined : "auto"}
          data-open={open || undefined}
          role="menu"
          aria-label={trigger}
          data-part="menu"
          onToggle={(event) => setMenuOpen(event.newState === "open")}
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
          {labels.map((label) => (
            <button
              key={label.name}
              type="button"
              role="menuitemcheckbox"
              aria-checked={on.includes(label.name)}
              data-part="item"
              onClick={() => toggle(label.name)}
            >
              <span data-part="box" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12.5l4.5 4.5L19 7"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span
                data-part="dot"
                aria-hidden="true"
                style={
                  { "--vibeui-dropdown-016-dot": label.hue } as CSSProperties
                }
              />
              <span data-part="label">{label.name}</span>
              <span data-part="tally">{label.count}</span>
            </button>
          ))}
          <div data-part="foot">
            <span>
              {on.length > 0
                ? selectedTemplate.replace("{count}", String(on.length))
                : allShownText}
            </span>
            {on.length > 0 ? (
              <button type="button" data-part="reset" onClick={() => setOn([])}>
                {resetText}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}
