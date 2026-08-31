"use client"

import { useId, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
  ReactNode,
} from "react"

export type Command008Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  paths?: string[]
  placeholder?: string
  accent?: string
}

// Идея компонента: режим «перейти к файлу». Путь длиннее ширины строки, а
// важно в нём имя файла, поэтому строка разложена на две части: имя обычным
// цветом, каталог — приглушённый и урезается многоточием слева, чтобы конец
// пути (самое информативное) остался виден. Совпавший фрагмент подсвечивается
// тегом <mark>: он несёт смысл выделения и в скринридере.
const STYLES = `
:where([data-vibeui-block="command-008"]){
--vibeui-command-008-bg:oklch(1 0 0);
--vibeui-command-008-fg:oklch(0.23 0.014 265);
--vibeui-command-008-muted:oklch(0.57 0.014 265);
--vibeui-command-008-border:oklch(0.9 0.006 265);
--vibeui-command-008-accent:oklch(0.55 0.19 262);
--vibeui-command-008-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-command-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="command-008"]{
display:block;box-sizing:border-box;width:100%;max-width:25rem;overflow:hidden;
background:var(--vibeui-command-008-bg);color:var(--vibeui-command-008-fg);
border:1px solid var(--vibeui-command-008-border);border-radius:0.875rem;
box-shadow:0 18px 40px -28px oklch(0.2 0.03 265 / 60%);
font-family:var(--vibeui-command-008-font);
}
[data-vibeui-block="command-008"] [data-part="field"]{
display:flex;align-items:center;gap:0.5rem;
padding:0 0.75rem;border-bottom:1px solid var(--vibeui-command-008-border);
}
[data-vibeui-block="command-008"] [data-part="chip"]{
flex:none;padding:0.125rem 0.4375rem;border-radius:0.4375rem;
background:color-mix(in oklab,var(--vibeui-command-008-accent) 15%,transparent);
color:var(--vibeui-command-008-accent);
font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="command-008"] input{
flex:1;min-width:0;height:2.875rem;
appearance:none;border:0;background:none;color:inherit;
font-family:var(--vibeui-command-008-mono);font-size:0.875rem;outline:none;
}
[data-vibeui-block="command-008"] [data-part="field"]:focus-within{box-shadow:inset 0 -2px 0 0 var(--vibeui-command-008-accent)}
[data-vibeui-block="command-008"] [data-part="list"]{
list-style:none;margin:0;padding:0.3125rem;max-height:15rem;overflow-y:auto;
}
[data-vibeui-block="command-008"] [data-part="row"]{
display:flex;align-items:baseline;gap:0.5rem;
padding:0.4375rem 0.5625rem;border-radius:0.5rem;cursor:pointer;
font-family:var(--vibeui-command-008-mono);font-size:0.8125rem;
}
[data-vibeui-block="command-008"] [data-part="row"]:hover,
[data-vibeui-block="command-008"] [data-part="row"][aria-selected="true"]{
background:color-mix(in oklab,var(--vibeui-command-008-accent) 12%,transparent);
}
[data-vibeui-block="command-008"] [data-part="file"]{flex:none;font-weight:650}
/* Каталог урезается слева: конец пути информативнее его начала. */
[data-vibeui-block="command-008"] [data-part="dir"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;direction:rtl;text-align:left;
font-size:0.6875rem;color:var(--vibeui-command-008-muted);
}
[data-vibeui-block="command-008"] mark{background:oklch(0.85 0.16 95 / 60%);color:inherit;border-radius:0.1875rem}
[data-vibeui-block="command-008"] [data-part="empty"]{
margin:0;padding:1.125rem 0.875rem;font-size:0.875rem;color:var(--vibeui-command-008-muted);
}
[data-vibeui-block="command-008"] [data-part="foot"]{
margin:0;padding:0.4375rem 0.875rem;border-top:1px solid var(--vibeui-command-008-border);
font-family:var(--vibeui-command-008-mono);font-size:0.6875rem;
color:var(--vibeui-command-008-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="command-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PATHS = [
  "registry/components/navigation/command-008/command-008.tsx",
  "registry/components/navigation/registry.json",
  "registry/components/display/collapsible-001/collapsible-001.tsx",
  "scripts/validate-meta.mjs",
  "scripts/build-indexes.mjs",
  "app/components/[slug]/page.tsx",
  "app/globals.css",
  "docs/PIPELINE.md",
]

function highlight(text: string, needle: string): ReactNode {
  if (!needle) return text

  const at = text.toLowerCase().indexOf(needle)
  if (at < 0) return text

  return (
    <>
      {text.slice(0, at)}
      <mark>{text.slice(at, at + needle.length)}</mark>
      {text.slice(at + needle.length)}
    </>
  )
}

/**
 * Режим «перейти к файлу»: имя отдельно от каталога, совпадение в теге mark,
 * полный путь в подвале. Один файл, ноль зависимостей.
 */
export function Command008({
  paths = DEFAULT_PATHS,
  placeholder = "Имя файла…",
  accent,
  className,
  style,
  ...props
}: Command008Props) {
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const listId = useId()
  const rowId = useId()

  const needle = query.trim().toLowerCase()
  const rows = paths.filter((path) => path.toLowerCase().includes(needle))
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
    ...(accent ? { "--vibeui-command-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-command-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="command-008"
        className={className}
        style={paletteStyle}
        role="dialog"
        aria-label="Перейти к файлу"
      >
        <div data-part="field">
          <span data-part="chip" aria-hidden="true">
            файл
          </span>
          <input
            type="text"
            role="combobox"
            aria-expanded={rows.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              current ? `${rowId}-${rows.indexOf(current)}` : undefined
            }
            aria-label={placeholder}
            placeholder={placeholder}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
            }}
            onKeyDown={onKeyDown}
          />
        </div>
        {rows.length === 0 ? (
          <p data-part="empty">Такого файла нет в индексе проекта.</p>
        ) : (
          <ul id={listId} data-part="list" role="listbox" aria-label="Файлы">
            {rows.map((path, index) => {
              const cut = path.lastIndexOf("/")
              const file = path.slice(cut + 1)
              const dir = path.slice(0, cut + 1)

              return (
                <li
                  key={path}
                  id={`${rowId}-${index}`}
                  data-part="row"
                  role="option"
                  aria-selected={current === path}
                  onClick={() => setActive(index)}
                >
                  <span data-part="file">{highlight(file, needle)}</span>
                  <span data-part="dir">{dir}</span>
                </li>
              )
            })}
          </ul>
        )}
        <p data-part="foot">{current ?? "—"}</p>
      </div>
    </>
  )
}
