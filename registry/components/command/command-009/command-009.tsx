"use client"

import { useId, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Command009Action = {
  label: string
  keys?: string
  tone?: "danger"
}

export type Command009Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  target?: string
  targetKind?: string
  actions?: Command009Action[]
  accent?: string
}

// Идея компонента: палитра действий над уже выбранным объектом. Обычная
// палитра отвечает на «что сделать», контекстная — на «что сделать вот с
// этим», поэтому объект закреплён строкой над полем и не уезжает при
// прокрутке списка. Опасные действия помечены цветом и отделены линией:
// «Удалить» не должно оказаться соседом «Переименовать» без границы, иначе
// промах стрелкой стоит слишком дорого.
const STYLES = `
:where([data-vibeui-block="command-009"]){
--vibeui-command-009-bg:oklch(1 0 0);
--vibeui-command-009-fg:oklch(0.23 0.014 265);
--vibeui-command-009-muted:oklch(0.57 0.014 265);
--vibeui-command-009-border:oklch(0.9 0.006 265);
--vibeui-command-009-accent:oklch(0.55 0.2 300);
--vibeui-command-009-danger:oklch(0.55 0.2 25);
--vibeui-command-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="command-009"]{
display:block;box-sizing:border-box;width:100%;max-width:23rem;overflow:hidden;
background:var(--vibeui-command-009-bg);color:var(--vibeui-command-009-fg);
border:1px solid var(--vibeui-command-009-border);border-radius:0.875rem;
box-shadow:0 18px 40px -28px oklch(0.2 0.03 265 / 60%);
font-family:var(--vibeui-command-009-font);
}
/* Объект закреплён над полем: контекст не должен уезжать вместе со списком. */
[data-vibeui-block="command-009"] [data-part="target"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.5rem 0.75rem;
background:color-mix(in oklab,var(--vibeui-command-009-accent) 9%,transparent);
border-bottom:1px solid var(--vibeui-command-009-border);
font-size:0.75rem;
}
[data-vibeui-block="command-009"] [data-part="kind"]{
flex:none;padding:0.0625rem 0.375rem;border-radius:0.375rem;
background:var(--vibeui-command-009-accent);color:oklch(1 0 0);
font-size:0.625rem;font-weight:750;letter-spacing:0.02em;text-transform:uppercase;
}
[data-vibeui-block="command-009"] [data-part="name"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:650;
}
[data-vibeui-block="command-009"] input{
box-sizing:border-box;width:100%;height:2.75rem;padding:0 0.875rem;
appearance:none;border:0;border-bottom:1px solid var(--vibeui-command-009-border);
background:none;color:inherit;font:inherit;font-size:0.9375rem;outline:none;
}
[data-vibeui-block="command-009"] input:focus{box-shadow:inset 0 -2px 0 0 var(--vibeui-command-009-accent)}
[data-vibeui-block="command-009"] [data-part="list"]{
list-style:none;margin:0;padding:0.3125rem;max-height:14rem;overflow-y:auto;
}
[data-vibeui-block="command-009"] [data-part="row"]{
display:flex;align-items:center;gap:0.75rem;
padding:0.4375rem 0.5625rem;border-radius:0.5rem;cursor:pointer;font-size:0.875rem;
}
[data-vibeui-block="command-009"] [data-part="row"]:hover,
[data-vibeui-block="command-009"] [data-part="row"][aria-selected="true"]{
background:color-mix(in oklab,var(--vibeui-command-009-accent) 12%,transparent);
}
[data-vibeui-block="command-009"] [data-part="row"][data-tone="danger"]{
margin-top:0.25rem;border-top:1px solid var(--vibeui-command-009-border);
border-radius:0 0 0.5rem 0.5rem;padding-top:0.5625rem;
color:var(--vibeui-command-009-danger);
}
[data-vibeui-block="command-009"] [data-part="row"][data-tone="danger"]:hover,
[data-vibeui-block="command-009"] [data-part="row"][data-tone="danger"][aria-selected="true"]{
background:color-mix(in oklab,var(--vibeui-command-009-danger) 12%,transparent);
}
[data-vibeui-block="command-009"] kbd{
margin-left:auto;
border:1px solid var(--vibeui-command-009-border);border-bottom-width:2px;border-radius:0.3125rem;
padding:0 0.3125rem;font:inherit;font-size:0.6875rem;color:var(--vibeui-command-009-muted);
}
[data-vibeui-block="command-009"] [data-part="empty"]{
margin:0;padding:1.125rem 0.875rem;font-size:0.875rem;color:var(--vibeui-command-009-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="command-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ACTIONS: Command009Action[] = [
  { label: "Переименовать", keys: "F2" },
  { label: "Дублировать", keys: "⌘D" },
  { label: "Выровнять по сетке" },
  { label: "Экспортировать в SVG" },
  { label: "Удалить слой", keys: "⌫", tone: "danger" },
]

/**
 * Палитра действий над выделенным объектом: контекст закреплён над полем,
 * опасное действие отделено. Один файл, ноль зависимостей.
 */
export function Command009({
  target = "Hero background",
  targetKind = "Слой",
  actions = DEFAULT_ACTIONS,
  accent,
  className,
  style,
  ...props
}: Command009Props) {
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const listId = useId()
  const rowId = useId()
  const titleId = useId()

  const needle = query.trim().toLowerCase()
  const rows = actions.filter((action) =>
    action.label.toLowerCase().includes(needle),
  )
  const current = rows[Math.min(active, rows.length - 1)]

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      if (rows.length === 0) return
      const step = event.key === "ArrowDown" ? 1 : -1
      setActive((index) => (index + step + rows.length) % rows.length)
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
      setActive(0)
    }
  }

  const paletteStyle = {
    ...(accent ? { "--vibeui-command-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-command-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="command-009"
        className={className}
        style={paletteStyle}
        role="dialog"
        aria-labelledby={titleId}
      >
        <p id={titleId} data-part="target">
          <span data-part="kind">{targetKind}</span>
          <span data-part="name">{target}</span>
        </p>
        <input
          type="text"
          role="combobox"
          aria-expanded={rows.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            current ? `${rowId}-${rows.indexOf(current)}` : undefined
          }
          aria-label={`Действие над «${target}»`}
          placeholder="Действие…"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
          }}
          onKeyDown={onKeyDown}
        />
        {rows.length === 0 ? (
          <p data-part="empty">Для этого объекта такого действия нет.</p>
        ) : (
          <ul id={listId} data-part="list" role="listbox" aria-label="Действия">
            {rows.map((action, index) => (
              <li
                key={action.label}
                id={`${rowId}-${index}`}
                data-part="row"
                data-tone={action.tone}
                role="option"
                aria-selected={current === action}
                onClick={() => setActive(index)}
              >
                {action.label}
                {action.keys ? <kbd>{action.keys}</kbd> : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
