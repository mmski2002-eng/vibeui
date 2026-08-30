"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Menu005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  views?: string[]
  toggles?: string[]
  onChange?: (state: { view: string; on: string[] }) => void
  accent?: string
}

// Идея компонента: меню настроек с переключателями и выбором одного из
// вариантов. Состояние остаётся видимым после нажатия, а меню не закрывается:
// настройки почти всегда меняют пачкой, и захлопывающийся список заставляет
// открывать его пять раз подряд.
const STYLES = `
:where([data-vibeui-block="menu-005"]){
--vibeui-menu-005-bg:oklch(1 0 0);
--vibeui-menu-005-fg:oklch(0.24 0.014 265);
--vibeui-menu-005-muted:oklch(0.56 0.014 265);
--vibeui-menu-005-border:oklch(0.9 0.006 265);
--vibeui-menu-005-hover:oklch(0.96 0.004 265);
--vibeui-menu-005-accent:oklch(0.55 0.17 265);
--vibeui-menu-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
 * Меню настроек: переключатели и выбор вида, меню не закрывается по нажатию.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Menu005({
  label = "Вид каталога",
  views = DEFAULT_VIEWS,
  toggles = DEFAULT_TOGGLES,
  onChange,
  accent,
  className,
  style,
  ...props
}: Menu005Props) {
  const id = useId()
  const [view, setView] = useState(views[0])
  const [on, setOn] = useState<string[]>([toggles[0]])

  const palette = {
    ...(accent ? { "--vibeui-menu-005-accent": accent } : null),
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
        data-vibeui-block="menu-005"
        role="menu"
        aria-label={label}
        className={className}
        style={palette}
      >
        <p data-part="label">{label}</p>
        {views.map((item) => (
          <label key={item} role="menuitemradio" aria-checked={view === item}>
            <input
              type="radio"
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
          <label
            key={item}
            role="menuitemcheckbox"
            aria-checked={on.includes(item)}
          >
            <input
              type="checkbox"
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
