"use client"

import type { ComponentProps, CSSProperties } from "react"

export type Card152Row = {
  id: string
  client: string
  plan: string
  seats: number
  amount: number
}

export type Card152Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  selectedText?: string
  rows?: Card152Row[]
  heading?: string
  countText?: string
  actionLabel?: string
  exportLabel?: string
  clearLabel?: string
  money?: (value: number) => string
  selected?: string[]
  setSelected?: (value: string[]) => void
  total?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

const DEFAULT_ROWS: Card152Row[] = [
  { id: "c-1", client: "Атлас", plan: "Команда", seats: 24, amount: 96000 },
  { id: "c-2", client: "Берег", plan: "Старт", seats: 5, amount: 12500 },
  { id: "c-3", client: "Ветка", plan: "Команда", seats: 18, amount: 72000 },
  { id: "c-4", client: "Гранат", plan: "Бизнес", seats: 60, amount: 310000 },
  { id: "c-5", client: "Дельта", plan: "Старт", seats: 3, amount: 7500 },
  { id: "c-6", client: "Ёлка", plan: "Команда", seats: 12, amount: 48000 },
]

// Часть блока datagrid-002, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-152"]){
--vibeui-card-152-accent:light-dark(oklch(0.275 0 0),oklch(0.903 0 0));
--vibeui-card-152-accent-soft:light-dark(oklch(0.275 0 0 / 9%),oklch(0.903 0 0 / 16%));
--vibeui-card-152-border:light-dark(oklch(0.92 0 275),oklch(0.34 0 275));
--vibeui-card-152-btn:light-dark(oklch(1 0 0 / 80%),oklch(0.32 0 275 / 80%));
--vibeui-card-152-dur-2:180ms;
--vibeui-card-152-fg:light-dark(oklch(0.23 0 275),oklch(0.93 0 275));
--vibeui-card-152-muted:color-mix(in oklab,var(--vibeui-card-152-fg) 68%,transparent);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-152"]{color-scheme:dark}
[data-vibeui-block="card-152"]{box-sizing:border-box}
[data-vibeui-block="card-152"] *{box-sizing:border-box}
[data-vibeui-block="card-152"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
min-height:3.25rem;padding:0.625rem 0.875rem;
border-bottom:1px solid var(--vibeui-card-152-border);
transition:background-color var(--vibeui-card-152-dur-2) ease;}
[data-vibeui-block="card-152"][data-active="true"]{background:var(--vibeui-card-152-accent-soft);}
[data-vibeui-block="card-152"] [data-part="bar-title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="card-152"] [data-part="bar-note"]{margin:0;font-size:0.75rem;color:var(--vibeui-card-152-muted);}
[data-vibeui-block="card-152"] [data-part="bar-text"]{margin-inline-end:auto}
[data-vibeui-block="card-152"] [data-part="count"]{font-size:0.875rem;font-weight:650;color:var(--vibeui-card-152-accent);}
[data-vibeui-block="card-152"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.375rem}
[data-vibeui-block="card-152"] [data-part="actions"] button{appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:550;
padding:0.375rem 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-card-152-border);
background:var(--vibeui-card-152-btn);color:var(--vibeui-card-152-fg);}
[data-vibeui-block="card-152"] [data-part="actions"] button[data-tone="primary"]{border-color:transparent;background:var(--vibeui-card-152-accent);color:oklch(from var(--vibeui-card-152-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="card-152"] [data-part="actions"] button:focus-visible{outline:2px solid var(--vibeui-card-152-accent);outline-offset:2px;}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-152"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Полоса массовых действий»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card152({
  selectedText = "Выбрано {count} из {total} · {sum}",
  rows = DEFAULT_ROWS,
  heading = "Договоры на продление",
  countText = "{count} клиентов",
  actionLabel = "Выставить счёт",
  exportLabel = "Экспорт CSV",
  clearLabel = "Снять выделение",
  money = () => "",
  selected = [],
  setSelected = () => {},
  total = 0,
  accent,
  className,
  style,
  ...props
}: Card152Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-152-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-152" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-152" data-active={selected.length > 0}
      className={className}
      style={palette}
      >
        <div data-part="bar-text">
          {selected.length > 0 ? (
            <p data-part="count" aria-live="polite">
              {selectedText
                .replace("{count}", String(selected.length))
                .replace("{total}", String(rows.length))
                .replace("{sum}", money(total))}
            </p>
          ) : (
            <>
              <h3 data-part="bar-title">{heading}</h3>
              <p data-part="bar-note">
                {countText.replace("{count}", String(rows.length))}
              </p>
            </>
          )}
        </div>
        {selected.length > 0 ? (
          <div data-part="actions">
            <button type="button" data-tone="primary">
              {actionLabel}
            </button>
            <button type="button">{exportLabel}</button>
            <button type="button" onClick={() => setSelected([])}>
              {clearLabel}
            </button>
          </div>
        ) : null}
      </div>
    </>
  )
}
