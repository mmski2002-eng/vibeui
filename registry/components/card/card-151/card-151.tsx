"use client"

import type { ComponentProps, CSSProperties } from "react"

export type SortKey = { column: Column; direction: Direction }

export type Column = keyof Card151Row

export type Card151Row = {
  title: string
  team: string
  stock: number
  price: number
  updated: string
}

export type Direction = "ascending" | "descending"

export type Card151Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  emptySortText?: string
  removeSortLabel?: string
  resetText?: string
  keys?: SortKey[]
  label?: (column: Column) => string
  setKeys?: (value: SortKey[]) => void
  accent?: string
  className?: string
  style?: CSSProperties
}

const ARROW = { ascending: "▲", descending: "▼" } as const

// Часть блока datagrid-001, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-151"]){
--vibeui-card-151-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-card-151-accent-soft:light-dark(oklch(0.287 0 0 / 10%),oklch(0.903 0 0 / 20%));
--vibeui-card-151-border:light-dark(oklch(0.92 0 265),oklch(0.34 0 265));
--vibeui-card-151-dur-2:180ms;
--vibeui-card-151-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-card-151-muted:color-mix(in oklab,var(--vibeui-card-151-fg) 68%,transparent);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-151"]{color-scheme:dark}
[data-vibeui-block="card-151"]{box-sizing:border-box}
[data-vibeui-block="card-151"] *{box-sizing:border-box}
[data-vibeui-block="card-151"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-card-151-border);}
[data-vibeui-block="card-151"] [data-part="bar-title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto;}
[data-vibeui-block="card-151"] [data-part="chips"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
margin:0;padding:0;list-style:none;}
[data-vibeui-block="card-151"] [data-part="chip"]{display:inline-flex;align-items:center;gap:0.375rem;
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;
padding:0.25rem 0.5rem;border-radius:999px;
color:var(--vibeui-card-151-accent);
background:var(--vibeui-card-151-accent-soft);
border:1px solid transparent;
transition:border-color var(--vibeui-card-151-dur-2) ease;}
[data-vibeui-block="card-151"] [data-part="chip"]:hover{border-color:var(--vibeui-card-151-accent)}
[data-vibeui-block="card-151"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-card-151-accent);outline-offset:2px}
[data-vibeui-block="card-151"] [data-part="empty-sort"]{font-size:0.75rem;color:var(--vibeui-card-151-muted);}
[data-vibeui-block="card-151"] [data-part="reset"]{appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;
padding:0.25rem 0.5rem;border-radius:0.5rem;
background:none;border:1px solid var(--vibeui-card-151-border);
color:var(--vibeui-card-151-muted);}
[data-vibeui-block="card-151"] [data-part="reset"]:hover:not(:disabled){color:var(--vibeui-card-151-fg)}
[data-vibeui-block="card-151"] [data-part="reset"]:disabled{opacity:.45;cursor:not-allowed}
[data-vibeui-block="card-151"] [data-part="reset"]:focus-visible{outline:2px solid var(--vibeui-card-151-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-151"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Сортировка по приоритету»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card151({
  heading = "Каталог склада",
  emptySortText = "Сортировка не задана",
  removeSortLabel = "Убрать сортировку по колонке «{column}»",
  resetText = "Сбросить",
  keys = [],
  label = () => "",
  setKeys = () => {},
  accent,
  className,
  style,
  ...props
}: Card151Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-151-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-151" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-151"
      className={className}
      style={palette}
      >
        <h3 data-part="bar-title">{heading}</h3>
        {keys.length === 0 ? (
          <p data-part="empty-sort">{emptySortText}</p>
        ) : (
          <ul data-part="chips">
            {keys.map((key, index) => (
              <li key={key.column}>
                <button
                  type="button"
                  data-part="chip"
                  aria-label={removeSortLabel.replace(
                    "{column}",
                    label(key.column),
                  )}
                  onClick={() =>
                    setKeys((current) =>
                      current.filter((item) => item.column !== key.column),
                    )
                  }
                >
                  <span aria-hidden="true">{index + 1}</span>
                  {label(key.column)}
                  <span aria-hidden="true">{ARROW[key.direction]}</span>
                  <span aria-hidden="true">×</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          data-part="reset"
          disabled={keys.length === 0}
          onClick={() => setKeys([])}
        >
          {resetText}
        </button>
      </div>
    </>
  )
}
