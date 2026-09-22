"use client"

import type { Dispatch, SetStateAction, ComponentProps, CSSProperties } from "react"

export type Card161Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  removeFilterLabel?: string
  resetAllLabel?: string
  applied?: readonly (typeof FILTERS)[number][]
  filterLabel?: (id: string) => string
  setActive?: Dispatch<SetStateAction<string[]>>
  accent?: string
  className?: string
  style?: CSSProperties
}

const FILTERS: {
  id: string
  test: (row: Card161Row) => boolean
}[] = [
  { id: "status", test: (row) => row.status === "Архив" },
  { id: "city", test: (row) => row.city === "Сочи" },
  { id: "score", test: (row) => row.score >= 90 },
]

// Часть блока datagrid-011, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
export type Card161Row = {
  id: string
  request: string
  city: string
  status: "Новая" | "В работе" | "Архив"
  score: number
}

const STYLES = `
:where([data-vibeui-block="card-161"]){
--vibeui-card-161-accent:light-dark(oklch(0.28 0 0),oklch(0.91 0 0));
--vibeui-card-161-accent-soft:light-dark(oklch(0.28 0 0 / 10%),oklch(0.91 0 0 / 18%));
--vibeui-card-161-border:light-dark(oklch(0.92 0.006 210),oklch(0.34 0.012 210));
--vibeui-card-161-fg:light-dark(oklch(0.23 0.014 210),oklch(0.93 0.006 210));
--vibeui-card-161-field:light-dark(oklch(1 0 0),oklch(0.22 0.012 210));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-161"]{color-scheme:dark}
[data-vibeui-block="card-161"]{box-sizing:border-box}
[data-vibeui-block="card-161"] *{box-sizing:border-box}
[data-vibeui-block="card-161"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-card-161-border);}
[data-vibeui-block="card-161"] [data-part="title"]{margin:0 0.5rem 0 0;font-size:0.875rem;font-weight:650;}
[data-vibeui-block="card-161"] [data-part="chip"]{display:inline-flex;align-items:center;gap:0.375rem;
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;
padding:0.25rem 0.5rem;border-radius:999px;
color:var(--vibeui-card-161-accent);background:var(--vibeui-card-161-accent-soft);
border:1px solid transparent;}
[data-vibeui-block="card-161"] [data-part="chip"]:hover{border-color:var(--vibeui-card-161-accent)}
[data-vibeui-block="card-161"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-card-161-accent);outline-offset:2px}
[data-vibeui-block="card-161"] [data-part="reset"]{margin-inline-start:auto;
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;
padding:0.3125rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-card-161-border);
background:var(--vibeui-card-161-field);color:var(--vibeui-card-161-fg);}
[data-vibeui-block="card-161"] [data-part="reset"]:disabled{opacity:.45;cursor:not-allowed}
[data-vibeui-block="card-161"] [data-part="reset"]:focus-visible{outline:2px solid var(--vibeui-card-161-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-161"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Пустой результат»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card161({
  heading = "Заявки",
  removeFilterLabel = "Снять фильтр «{filter}»",
  resetAllLabel = "Сбросить всё",
  applied = [],
  filterLabel = () => "",
  setActive = () => {},
  accent,
  className,
  style,
  ...props
}: Card161Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-161-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-161" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-161"
      className={className}
      style={palette}
      >
        <h3 data-part="title">{heading}</h3>
        {applied.map((one) => (
          <button
            key={one.id}
            type="button"
            data-part="chip"
            aria-label={removeFilterLabel.replace(
              "{filter}",
              filterLabel(one.id),
            )}
            onClick={() =>
              setActive((current) =>
                current.filter((value) => value !== one.id),
              )
            }
          >
            {filterLabel(one.id)}
            <span aria-hidden="true">×</span>
          </button>
        ))}
        <button
          type="button"
          data-part="reset"
          disabled={applied.length === 0}
          onClick={() => setActive([])}
        >
          {resetAllLabel}
        </button>
      </div>
    </>
  )
}
