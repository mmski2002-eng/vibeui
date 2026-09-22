"use client"

import type { ComponentProps, CSSProperties } from "react"

export type Card164Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  emptyPinText?: string
  pinnedTemplate?: string
  maxPinned?: number
  clearText?: string
  ordered?: readonly ColumnKey[]
  setPinned?: (value: ColumnKey[]) => void
  accent?: string
  className?: string
  style?: CSSProperties
}

const COLUMNS: { key: ColumnKey; numeric: boolean }[] = [
  { key: "city", numeric: false },
  { key: "manager", numeric: false },
  { key: "plan", numeric: true },
  { key: "fact", numeric: true },
  { key: "deals", numeric: true },
  { key: "churn", numeric: true },
  { key: "nps", numeric: true },
]

// Часть блока datagrid-014, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
export type ColumnKey =
  "city" | "manager" | "plan" | "fact" | "deals" | "churn" | "nps"

const STYLES = `
:where([data-vibeui-block="card-164"]){
--vibeui-card-164-accent:light-dark(oklch(0.275 0 0),oklch(0.91 0 0));
--vibeui-card-164-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-card-164-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
--vibeui-card-164-muted:color-mix(in oklab,var(--vibeui-card-164-fg) 68%,transparent);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-164"]{color-scheme:dark}
[data-vibeui-block="card-164"]{box-sizing:border-box}
[data-vibeui-block="card-164"] *{box-sizing:border-box}
[data-vibeui-block="card-164"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-card-164-border);}
[data-vibeui-block="card-164"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="card-164"] [data-part="state"]{margin:0;font-size:0.75rem;color:var(--vibeui-card-164-muted)}
[data-vibeui-block="card-164"] [data-part="clear"]{appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;
padding:0.3125rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-card-164-border);
background:transparent;color:var(--vibeui-card-164-fg);}
[data-vibeui-block="card-164"] [data-part="clear"]:disabled{opacity:.45;cursor:not-allowed}
[data-vibeui-block="card-164"] [data-part="clear"]:focus-visible{outline:2px solid var(--vibeui-card-164-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-164"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Закрепление по требованию»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card164({
  heading = "Продажи по филиалам",
  emptyPinText = "Закреплённых колонок нет",
  pinnedTemplate = "Закреплено: {count} из {max}",
  maxPinned = 2,
  clearText = "Снять закрепление",
  ordered = [],
  setPinned = () => {},
  accent,
  className,
  style,
  ...props
}: Card164Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-164-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-164" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-164"
      className={className}
      style={palette}
      >
        <h3 data-part="title">{heading}</h3>
        <p data-part="state" aria-live="polite">
          {ordered.length === 0
            ? emptyPinText
            : pinnedTemplate
                .replace("{count}", String(ordered.length))
                .replace("{max}", String(maxPinned))}
        </p>
        <button
          type="button"
          data-part="clear"
          disabled={ordered.length === 0}
          onClick={() => setPinned([])}
        >
          {clearText}
        </button>
      </div>
    </>
  )
}
