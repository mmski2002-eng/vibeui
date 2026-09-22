"use client"

import type { ComponentProps, CSSProperties } from "react"

export type Card167Row = {
  id: string
  contract: string
  counterparty: string
  signed: string
  amount: number
}

export type Card167Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  statusTemplate?: string
  rows?: Card167Row[]
  exportLabel?: string
  done?: string
  selected?: Card167Row[]
  setDone?: (value: string) => void
  accent?: string
  className?: string
  style?: CSSProperties
}

const DEFAULT_ROWS: Card167Row[] = [
  {
    id: "d1",
    contract: "ДГ-1104",
    counterparty: "Артель «Кама»",
    signed: "04.02.2026",
    amount: 1240000,
  },
  {
    id: "d2",
    contract: "ДГ-1105",
    counterparty: "Ювенко Логистика",
    signed: "11.02.2026",
    amount: 386000,
  },
  {
    id: "d3",
    contract: "ДГ-1106",
    counterparty: "Северный Порт",
    signed: "19.02.2026",
    amount: 2015000,
  },
  {
    id: "d4",
    contract: "ДГ-1107",
    counterparty: "Гранд-Сервис",
    signed: "27.02.2026",
    amount: 94000,
  },
  {
    id: "d5",
    contract: "ДГ-1108",
    counterparty: "Мостовик",
    signed: "03.03.2026",
    amount: 771000,
  },
]

// Часть блока datagrid-017, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-167"]){
--vibeui-card-167-accent:light-dark(oklch(0.275 0 0),oklch(0.899 0 0));
--vibeui-card-167-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-card-167-muted:color-mix(in oklab,var(--vibeui-card-167-fg) 68%,transparent);
--vibeui-card-167-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-167"]{color-scheme:dark}
[data-vibeui-block="card-167"]{box-sizing:border-box}
[data-vibeui-block="card-167"] *{box-sizing:border-box}
[data-vibeui-block="card-167"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-card-167-border);}
[data-vibeui-block="card-167"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="card-167"] [data-part="status"]{margin:0;font-size:0.75rem;color:var(--vibeui-card-167-muted)}
[data-vibeui-block="card-167"] [data-part="go"]{appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:600;
padding:0.375rem 0.75rem;border-radius:0.5rem;border:1px solid transparent;
background:var(--vibeui-card-167-accent);color:oklch(from var(--vibeui-card-167-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="card-167"] [data-part="go"]:disabled{opacity:.4;cursor:not-allowed}
[data-vibeui-block="card-167"] [data-part="go"]:focus-visible{outline:2px solid var(--vibeui-card-167-accent);outline-offset:2px}
[data-vibeui-block="card-167"] [data-part="go"]{display:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-167"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Подтверждение выгрузки»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card167({
  heading = "Договоры",
  statusTemplate = "Отмечено: {count} из {total}",
  rows = DEFAULT_ROWS,
  exportLabel = "Экспортировать",
  done = "",
  selected = [],
  setDone = () => {},
  accent,
  className,
  style,
  ...props
}: Card167Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-167-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-167" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-167"
      className={className}
      style={palette}
      >
        <h3 data-part="title">{heading}</h3>
        <p data-part="status" role="status" aria-live="polite">
          {done ||
            statusTemplate
              .replace("{count}", String(selected.length))
              .replace("{total}", String(rows.length))}
        </p>
        <button
          type="button"
          data-part="go"
          disabled={selected.length === 0}
          onClick={() => {
            setDone("")
            dialogRef.current?.showModal()
          }}
        >
          {exportLabel}
        </button>
      </div>
    </>
  )
}
