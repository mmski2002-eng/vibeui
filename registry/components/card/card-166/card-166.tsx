"use client"

import type { ComponentProps, CSSProperties } from "react"

export type Aggregate = (typeof AGGREGATES)[number]

export type Card166Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  pickerText?: string
  aggregateText?: Record<string, string>
  mode?: "sum" | "avg" | "min" | "max"
  setChosen?: (value: Aggregate | null) => void
  accent?: string
  className?: string
  style?: CSSProperties
}

const AGGREGATE_TEXT: Record<string, string> = {
  sum: "Сумма",
  avg: "Среднее",
  min: "Минимум",
  max: "Максимум",
}

const AGGREGATES = ["sum", "avg", "min", "max"] as const

// Часть блока datagrid-016, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-166"]){
--vibeui-card-166-accent:light-dark(oklch(0.275 0 0),oklch(0.91 0 0));
--vibeui-card-166-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-card-166-muted:color-mix(in oklab,var(--vibeui-card-166-fg) 68%,transparent);
--vibeui-card-166-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-166"]{color-scheme:dark}
[data-vibeui-block="card-166"]{box-sizing:border-box}
[data-vibeui-block="card-166"] *{box-sizing:border-box}
[data-vibeui-block="card-166"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-card-166-border);}
[data-vibeui-block="card-166"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="card-166"] [data-part="pickerLabel"]{display:inline-flex;align-items:center;gap:0.375rem;font-size:0.75rem;color:var(--vibeui-card-166-muted);}
[data-vibeui-block="card-166"] select{font:inherit;font-size:0.75rem;color:inherit;padding:0.25rem 0.4375rem;
border:1px solid var(--vibeui-card-166-border);border-radius:0.4375rem;
background:transparent;}
[data-vibeui-block="card-166"] select:focus-visible{outline:2px solid var(--vibeui-card-166-accent);outline-offset:1px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-166"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Итог по выделению»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card166({
  heading = "Кампании квартала",
  pickerText = "Свёртка",
  aggregateText = AGGREGATE_TEXT,
  mode,
  setChosen = () => {},
  accent,
  className,
  style,
  ...props
}: Card166Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-166-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-166" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-166"
      className={className}
      style={palette}
      >
        <h3 data-part="title">{heading}</h3>
        <label data-part="pickerLabel">
          {pickerText}
          <select
            value={mode}
            onChange={(event) => setChosen(event.target.value as Aggregate)}
          >
            {AGGREGATES.map((value) => (
              <option key={value} value={value}>
                {aggregateText[value] ?? AGGREGATE_TEXT[value]}
              </option>
            ))}
          </select>
        </label>
      </div>
    </>
  )
}
