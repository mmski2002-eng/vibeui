"use client"

import type { ComponentProps, CSSProperties } from "react"

export type Card156Row = {
  id: string
  client: string
  status: "Новый" | "В работе" | "Оплачен" | "Отменён"
  amount: number
}

export type Card156Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  foundText?: string
  rows?: Card156Row[]
  resetLabel?: string
  active?: boolean
  filtered?: readonly Card156Row[]
  setClient?: (value: string) => void
  setOrder?: (value: string) => void
  setStatus?: (value: string) => void
  accent?: string
  className?: string
  style?: CSSProperties
}

const DEFAULT_ROWS: Card156Row[] = [
  { id: "ORD-8801", client: "Атлас", status: "Оплачен", amount: 96000 },
  { id: "ORD-8802", client: "Берег", status: "Новый", amount: 12500 },
  { id: "ORD-8803", client: "Ветка", status: "В работе", amount: 72000 },
  { id: "ORD-8804", client: "Гранат", status: "Оплачен", amount: 310000 },
  { id: "ORD-8805", client: "Дельта", status: "Отменён", amount: 7500 },
  { id: "ORD-8806", client: "Ёлка", status: "В работе", amount: 48000 },
  { id: "ORD-8807", client: "Атлас", status: "Новый", amount: 21400 },
]

// Часть блока datagrid-006, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-156"]){
--vibeui-card-156-accent:light-dark(oklch(0.28 0 0),oklch(0.906 0 0));
--vibeui-card-156-border:light-dark(oklch(0.92 0 285),oklch(0.34 0 285));
--vibeui-card-156-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
--vibeui-card-156-field:light-dark(oklch(1 0 0),oklch(0.22 0 285));
--vibeui-card-156-muted:color-mix(in oklab,var(--vibeui-card-156-fg) 68%,transparent);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-156"]{color-scheme:dark}
[data-vibeui-block="card-156"]{box-sizing:border-box}
[data-vibeui-block="card-156"] *{box-sizing:border-box}
[data-vibeui-block="card-156"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-card-156-border);}
[data-vibeui-block="card-156"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="card-156"] [data-part="found"]{margin:0;font-size:0.75rem;color:var(--vibeui-card-156-muted);}
[data-vibeui-block="card-156"] [data-part="reset"]{appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;
padding:0.3125rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-card-156-border);
background:var(--vibeui-card-156-field);color:var(--vibeui-card-156-fg);}
[data-vibeui-block="card-156"] [data-part="reset"]:disabled{opacity:.45;cursor:not-allowed}
[data-vibeui-block="card-156"] [data-part="reset"]:focus-visible{outline:2px solid var(--vibeui-card-156-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-156"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Фильтры в шапке»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card156({
  heading = "Заказы",
  foundText = "Найдено {count} из {total}",
  rows = DEFAULT_ROWS,
  resetLabel = "Сбросить фильтры",
  active = false,
  filtered = [],
  setClient = () => {},
  setOrder = () => {},
  setStatus = () => {},
  accent,
  className,
  style,
  ...props
}: Card156Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-156-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-156" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-156"
      className={className}
      style={palette}
      >
        <h3 data-part="title">{heading}</h3>
        <p data-part="found" aria-live="polite">
          {foundText
            .replace("{count}", String(filtered.length))
            .replace("{total}", String(rows.length))}
        </p>
        <button
          type="button"
          data-part="reset"
          disabled={!active}
          onClick={() => {
            setOrder("")
            setClient("")
            setStatus("")
          }}
        >
          {resetLabel}
        </button>
      </div>
    </>
  )
}
