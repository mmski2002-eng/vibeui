"use client"

import type { ComponentProps, CSSProperties } from "react"

export type Card160Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  pageSizeLabel?: string
  setPage?: (value: number) => void
  setSize?: (value: number) => void
  size?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

const SIZES = [5, 10, 20]

// Часть блока datagrid-010, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-160"]){
--vibeui-card-160-accent:light-dark(oklch(0.287 0 0),oklch(0.905 0 0));
--vibeui-card-160-border:light-dark(oklch(0.92 0.006 20),oklch(0.34 0.012 20));
--vibeui-card-160-fg:light-dark(oklch(0.23 0.014 20),oklch(0.93 0.006 20));
--vibeui-card-160-field:light-dark(oklch(1 0 0),oklch(0.22 0.012 20));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-160"]{color-scheme:dark}
[data-vibeui-block="card-160"]{box-sizing:border-box}
[data-vibeui-block="card-160"] *{box-sizing:border-box}
[data-vibeui-block="card-160"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-card-160-border);}
[data-vibeui-block="card-160"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="card-160"] select{font:inherit;font-size:0.75rem;color:var(--vibeui-card-160-fg);
padding:0.25rem 0.5rem;border-radius:0.375rem;
border:1px solid var(--vibeui-card-160-border);background:var(--vibeui-card-160-field);}
[data-vibeui-block="card-160"] select:focus-visible{outline:2px solid var(--vibeui-card-160-accent);outline-offset:1px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-160"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Постраничная таблица»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card160({
  heading = "Участники",
  pageSizeLabel = "Строк на странице",
  setPage = () => {},
  setSize = () => {},
  size,
  accent,
  className,
  style,
  ...props
}: Card160Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-160-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-160" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-160"
      className={className}
      style={palette}
      >
        <h3 data-part="title">{heading}</h3>
        <label>
          {pageSizeLabel}
          <select
            value={size}
            onChange={(event) => {
              setSize(Number(event.target.value))
              setPage(1)
            }}
          >
            {SIZES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>
    </>
  )
}
