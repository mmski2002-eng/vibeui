"use client"

import { useId, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Command005Result = {
  label: string
  kind: "Файл" | "Символ" | "Настройка" | "Документ"
  detail: string
}

export type Command005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  items?: Command005Result[]
  placeholder?: string
  accent?: string
}

// Идея компонента: поиск по всему проекту, где в одном списке лежат разные
// сущности. Без пометки типа файл и настройка выглядят одинаково, поэтому у
// каждой строки есть значок-квадрат с типом и приглушённая вторая строка с
// путём или контекстом. Группировка идёт по типу и считается из данных, а не
// задаётся руками: добавили новый тип — появилась новая группа.
const STYLES = `
:where([data-vibeui-block="command-005"]){
--vibeui-command-005-bg:oklch(1 0 0);
--vibeui-command-005-fg:oklch(0.23 0.014 265);
--vibeui-command-005-muted:oklch(0.57 0.014 265);
--vibeui-command-005-border:oklch(0.9 0.006 265);
--vibeui-command-005-accent:oklch(0.55 0.19 262);
--vibeui-command-005-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-command-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="command-005"]{
display:block;box-sizing:border-box;width:100%;max-width:25rem;overflow:hidden;
background:var(--vibeui-command-005-bg);color:var(--vibeui-command-005-fg);
border:1px solid var(--vibeui-command-005-border);border-radius:0.875rem;
box-shadow:0 18px 40px -28px oklch(0.2 0.03 265 / 60%);
font-family:var(--vibeui-command-005-font);
}
[data-vibeui-block="command-005"] input{
box-sizing:border-box;width:100%;height:2.875rem;padding:0 0.875rem;
appearance:none;border:0;border-bottom:1px solid var(--vibeui-command-005-border);
background:none;color:inherit;font:inherit;font-size:0.9375rem;outline:none;
}
[data-vibeui-block="command-005"] input:focus{box-shadow:inset 0 -2px 0 0 var(--vibeui-command-005-accent)}
[data-vibeui-block="command-005"] [data-part="list"]{
list-style:none;margin:0;padding:0.3125rem;max-height:16rem;overflow-y:auto;
}
[data-vibeui-block="command-005"] [data-part="list"] [data-part="list"]{padding:0;max-height:none;overflow:visible}
[data-vibeui-block="command-005"] [data-part="group"]{
margin:0;padding:0.5rem 0.5625rem 0.25rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;
color:var(--vibeui-command-005-muted);
}
[data-vibeui-block="command-005"] [data-part="row"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.4375rem 0.5625rem;border-radius:0.5rem;cursor:pointer;
}
[data-vibeui-block="command-005"] [data-part="row"]:hover,
[data-vibeui-block="command-005"] [data-part="row"][aria-selected="true"]{
background:color-mix(in oklab,var(--vibeui-command-005-accent) 12%,transparent);
}
/* Значок типа — квадрат с буквой: он различает строки быстрее любой подписи. */
[data-vibeui-block="command-005"] [data-part="kind"]{
flex:none;display:grid;place-items:center;
width:1.375rem;height:1.375rem;border-radius:0.4375rem;
background:color-mix(in oklab,var(--vibeui-command-005-accent) 14%,transparent);
color:var(--vibeui-command-005-accent);
font-size:0.6875rem;font-weight:800;
}
[data-vibeui-block="command-005"] [data-part="row"][data-kind="Настройка"] [data-part="kind"]{background:oklch(0.62 0.16 55 / 18%);color:oklch(0.52 0.16 55)}
[data-vibeui-block="command-005"] [data-part="row"][data-kind="Символ"] [data-part="kind"]{background:oklch(0.55 0.2 300 / 16%);color:oklch(0.5 0.2 300)}
[data-vibeui-block="command-005"] [data-part="row"][data-kind="Документ"] [data-part="kind"]{background:oklch(0.56 0.15 165 / 18%);color:oklch(0.46 0.13 165)}
[data-vibeui-block="command-005"] [data-part="text"]{display:flex;flex-direction:column;min-width:0}
[data-vibeui-block="command-005"] [data-part="label"]{font-size:0.875rem;line-height:1.25}
[data-vibeui-block="command-005"] [data-part="detail"]{
font-family:var(--vibeui-command-005-mono);font-size:0.6875rem;
color:var(--vibeui-command-005-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="command-005"] [data-part="empty"]{
margin:0;padding:1.125rem 0.875rem;font-size:0.875rem;color:var(--vibeui-command-005-muted);
}
[data-vibeui-block="command-005"] [data-part="foot"]{
margin:0;padding:0.4375rem 0.875rem;border-top:1px solid var(--vibeui-command-005-border);
font-size:0.6875rem;color:var(--vibeui-command-005-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="command-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_RESULTS: Command005Result[] = [
  {
    label: "registry.json",
    kind: "Файл",
    detail: "registry/components/navigation/",
  },
  {
    label: "command-001.tsx",
    kind: "Файл",
    detail: "registry/components/navigation/command-001/",
  },
  {
    label: "validateSource",
    kind: "Символ",
    detail: "scripts/validate-meta.mjs:218",
  },
  { label: "pascalCase", kind: "Символ", detail: "scripts/new-item.mjs:41" },
  { label: "Тема превью", kind: "Настройка", detail: "Каталог → Превью" },
  {
    label: "Порог предупреждений",
    kind: "Настройка",
    detail: "Сборка → Проверки",
  },
  { label: "Конвейер сборки", kind: "Документ", detail: "docs/PIPELINE.md" },
]

/**
 * Поиск по проекту: файлы, символы, настройки и документы в одном списке,
 * группировка по типу. Один файл, ноль зависимостей.
 */
export function Command005({
  items = DEFAULT_RESULTS,
  placeholder = "Поиск по проекту…",
  accent,
  className,
  style,
  ...props
}: Command005Props) {
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const listId = useId()
  const rowId = useId()

  const needle = query.trim().toLowerCase()
  const found = items.filter(
    (result) =>
      result.label.toLowerCase().includes(needle) ||
      result.detail.toLowerCase().includes(needle),
  )
  const groups = found.reduce<Record<string, Command005Result[]>>(
    (all, result) => {
      all[result.kind] = all[result.kind]
        ? [...all[result.kind], result]
        : [result]
      return all
    },
    {},
  )
  const ordered = Object.values(groups).flat()
  const current = ordered[Math.min(active, ordered.length - 1)]

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      if (ordered.length === 0) return
      const step = event.key === "ArrowDown" ? 1 : -1
      setActive((index) => (index + step + ordered.length) % ordered.length)
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
      setActive(0)
    }
  }

  const paletteStyle = {
    ...(accent ? { "--vibeui-command-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-command-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="command-005"
        className={className}
        style={paletteStyle}
        role="dialog"
        aria-label="Поиск по проекту"
      >
        <input
          type="text"
          role="combobox"
          aria-expanded={ordered.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            current ? `${rowId}-${ordered.indexOf(current)}` : undefined
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
        {ordered.length === 0 ? (
          <p data-part="empty">По запросу ничего не найдено.</p>
        ) : (
          <ul
            id={listId}
            data-part="list"
            role="listbox"
            aria-label="Результаты"
          >
            {Object.entries(groups).map(([kind, rows]) => (
              <li key={kind} role="presentation">
                <p data-part="group">
                  {kind} · {rows.length}
                </p>
                <ul data-part="list" role="group" aria-label={kind}>
                  {rows.map((result) => (
                    <li
                      key={`${result.kind}-${result.label}`}
                      id={`${rowId}-${ordered.indexOf(result)}`}
                      data-part="row"
                      data-kind={result.kind}
                      role="option"
                      aria-selected={current === result}
                      onClick={() => setActive(ordered.indexOf(result))}
                    >
                      <span data-part="kind" aria-hidden="true">
                        {result.kind.charAt(0)}
                      </span>
                      <span data-part="text">
                        <span data-part="label">{result.label}</span>
                        <span data-part="detail">{result.detail}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
        <p data-part="foot">
          Найдено {ordered.length} из {items.length}
        </p>
      </div>
    </>
  )
}
