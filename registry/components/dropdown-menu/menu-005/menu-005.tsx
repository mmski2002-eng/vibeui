"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Menu005Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  views?: string[]
  toggles?: string[]
  onChange?: (state: { view: string; on: string[] }) => void
  accent?: string
  /** Подложка панели. Пусто — собственный фон по теме окружения. */
  background?: string
}

// Идея компонента: меню настроек с переключателями и выбором одного из
// вариантов. Состояние остаётся видимым после нажатия, а меню не закрывается:
// настройки почти всегда меняют пачкой, и захлопывающийся список заставляет
// открывать его пять раз подряд.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте панель светлее фона страницы, а её граница светлее панели.
const STYLES = `
:where([data-vibeui-block="menu-005"]){
--vibeui-menu-005-bg:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-menu-005-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.006 265));
--vibeui-menu-005-muted:color-mix(in oklab,var(--vibeui-menu-005-fg) 68%,transparent);
--vibeui-menu-005-border:light-dark(oklch(0.9 0.006 265),oklch(0.37 0.012 265));
--vibeui-menu-005-hover:light-dark(oklch(0.96 0.004 265),oklch(0.32 0.014 265));
--vibeui-menu-005-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-menu-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="menu-005"]{color-scheme:dark}
[data-vibeui-block="menu-005"]{
display:flex;flex-direction:column;gap:0.3125rem;
width:100%;max-width:15rem;box-sizing:border-box;padding:0.375rem;
border:1px solid var(--vibeui-menu-005-border);border-radius:0.875rem;
background:var(--vibeui-menu-005-bg);
font-family:var(--vibeui-menu-005-font);color:var(--vibeui-menu-005-fg);
box-shadow:0 18px 40px -26px oklch(0.2 0.02 265 / 45%);
}
[data-vibeui-block="menu-005"] [data-part="label"]{
padding:0.3125rem 0.5rem 0.125rem;
font-size:0.6875rem;font-weight:650;letter-spacing:0.05em;text-transform:uppercase;
color:var(--vibeui-menu-005-muted);
}
[data-vibeui-block="menu-005"] label{
display:flex;align-items:center;gap:0.5rem;
min-height:2rem;padding:0 0.5rem;border-radius:0.5rem;
font-size:0.8125rem;cursor:pointer;
}
[data-vibeui-block="menu-005"] label:hover{background:var(--vibeui-menu-005-hover)}
[data-vibeui-block="menu-005"] input{position:absolute;width:1px;height:1px;opacity:0}
/* Отметка занимает место всегда: без неё строки прыгают при переключении. */
[data-vibeui-block="menu-005"] [data-part="mark"]{
flex:none;width:0.875rem;height:0.875rem;position:relative;
}
[data-vibeui-block="menu-005"] label:has(input:checked) [data-part="mark"]::after{
content:"";position:absolute;left:0.125rem;top:0;
width:0.3125rem;height:0.5625rem;
border-right:2px solid var(--vibeui-menu-005-accent);
border-bottom:2px solid var(--vibeui-menu-005-accent);
transform:rotate(45deg);
}
[data-vibeui-block="menu-005"] label:has(input:checked){font-weight:650}
[data-vibeui-block="menu-005"] label:has(input:focus-visible){outline:2px solid var(--vibeui-menu-005-accent);outline-offset:-2px}
[data-vibeui-block="menu-005"] [data-part="divider"]{
height:1px;margin:0.25rem 0.25rem;background:var(--vibeui-menu-005-border);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="menu-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_VIEWS = ["Сетка", "Список", "Таблица"]
const DEFAULT_TOGGLES = ["Показывать описания", "Только мои", "Скрыть архив"]

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
 * Меню настроек: переключатели и выбор вида, меню не закрывается по нажатию.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Menu005({
  label = "Вид каталога",
  views = DEFAULT_VIEWS,
  toggles = DEFAULT_TOGGLES,
  onChange,
  accent,
  background = "",
  className,
  style,
  ...props
}: Menu005Props) {
  const id = useId()
  const [view, setView] = useState(views[0])
  const [on, setOn] = useState<string[]>([toggles[0]])

  const palette = {
    ...(accent ? { "--vibeui-menu-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-menu-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const update = (next: { view?: string; on?: string[] }) => {
    const state = { view: next.view ?? view, on: next.on ?? on }
    setView(state.view)
    setOn(state.on)
    onChange?.(state)
  }

  return (
    <>
      <style href="vibeui-menu-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="dropdown-menu"
        data-vibeui-block="menu-005"
        role="menu"
        aria-label={label}
        className={className}
        style={palette}
      >
        <p data-part="label">{label}</p>
        {views.map((item) => (
          <label key={item}>
            {/* Роль пункта меню живёт на input, а не на label: фокус и
                стрелки достаются тому же элементу, что и роль. */}
            <input
              type="radio"
              role="menuitemradio"
              aria-checked={view === item}
              name={id}
              checked={view === item}
              onChange={() => update({ view: item })}
            />
            <span data-part="mark" aria-hidden="true" />
            {item}
          </label>
        ))}
        <div data-part="divider" role="separator" />
        {toggles.map((item) => (
          <label key={item}>
            <input
              type="checkbox"
              role="menuitemcheckbox"
              aria-checked={on.includes(item)}
              checked={on.includes(item)}
              onChange={() =>
                update({
                  on: on.includes(item)
                    ? on.filter((entry) => entry !== item)
                    : [...on, item],
                })
              }
            />
            <span data-part="mark" aria-hidden="true" />
            {item}
          </label>
        ))}
      </div>
    </>
  )
}
