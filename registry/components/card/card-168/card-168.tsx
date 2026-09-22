"use client"

import type { ComponentProps, CSSProperties } from "react"

export type Card168Row = {
  id: string
  ticket: string
  subject: string
  requester: string
  team: string
}

export type Card168Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  searchLabel?: string
  placeholder?: string
  onlyText?: string
  rowsTemplate?: string
  rows?: Card168Row[]
  matchTemplate?: string
  inputId?: string
  matched?: readonly unknown[]
  needle?: string
  onlyHits?: boolean
  query?: string
  setOnlyHits?: (value: boolean) => void
  setTyped?: (value: string | null) => void
  total?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

const DEFAULT_ROWS: Card168Row[] = [
  {
    id: "t1",
    ticket: "SD-2041",
    subject: "Не приходит код подтверждения",
    requester: "Марина Соколова",
    team: "Поддержка",
  },
  {
    id: "t2",
    ticket: "SD-2042",
    subject: "Ошибка оплаты картой Мир",
    requester: "Игорь Панов",
    team: "Платежи",
  },
  {
    id: "t3",
    ticket: "SD-2043",
    subject: "Пропал доступ к отчётам",
    requester: "Ольга Мартынова",
    team: "Доступы",
  },
  {
    id: "t4",
    ticket: "SD-2044",
    subject: "Дубли в выгрузке платежей",
    requester: "Павел Игнатов",
    team: "Платежи",
  },
  {
    id: "t5",
    ticket: "SD-2045",
    subject: "Просит вернуть старый отчёт",
    requester: "Мария Ким",
    team: "Аналитика",
  },
]

// Часть блока datagrid-018, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-168"]){
--vibeui-card-168-accent:light-dark(oklch(0.287 0 0),oklch(0.91 0 0));
--vibeui-card-168-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-card-168-muted:color-mix(in oklab,var(--vibeui-card-168-fg) 68%,transparent);
--vibeui-card-168-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-168"]{color-scheme:dark}
[data-vibeui-block="card-168"]{box-sizing:border-box}
[data-vibeui-block="card-168"] *{box-sizing:border-box}
[data-vibeui-block="card-168"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.625rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-card-168-border);}
[data-vibeui-block="card-168"] [data-part="field"]{display:flex;align-items:center;gap:0.375rem;flex:1 1 12rem;min-width:9rem;
padding:0.3125rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-card-168-border);background:transparent;}
[data-vibeui-block="card-168"] [data-part="field"]:focus-within{border-color:var(--vibeui-card-168-accent)}
[data-vibeui-block="card-168"] [data-part="field"]::before{content:"";flex:none;width:0.75rem;height:0.75rem;border-radius:999px;
border:1.5px solid var(--vibeui-card-168-muted);
box-shadow:0.375rem 0.375rem 0 -0.28rem var(--vibeui-card-168-muted);}
[data-vibeui-block="card-168"] [data-part="field"] input{flex:1;min-width:0;border:0;outline:0;background:transparent;font:inherit;font-size:0.8125rem;color:inherit;}
[data-vibeui-block="card-168"] [data-part="only"]{display:inline-flex;align-items:center;gap:0.375rem;font-size:0.75rem;color:var(--vibeui-card-168-muted);cursor:pointer;}
[data-vibeui-block="card-168"] [data-part="only"] input{accent-color:var(--vibeui-card-168-accent);margin:0;width:0.9375rem;height:0.9375rem}
[data-vibeui-block="card-168"] [data-part="only"] input:focus-visible{outline:2px solid var(--vibeui-card-168-accent);outline-offset:2px}
[data-vibeui-block="card-168"] [data-part="count"]{margin:0;font-size:0.75rem;color:var(--vibeui-card-168-muted);flex:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-168"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Поиск по таблице»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card168({
  searchLabel = "Поиск по всей таблице обращений",
  placeholder = "Искать по таблице",
  onlyText = "Только совпавшие",
  rowsTemplate = "Строк: {count}",
  rows = DEFAULT_ROWS,
  matchTemplate = "{matches} совпадений в {rows} строках",
  inputId = "",
  matched = [],
  needle = "",
  onlyHits = false,
  query,
  setOnlyHits = () => {},
  setTyped = () => {},
  total = 0,
  accent,
  className,
  style,
  ...props
}: Card168Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-168-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-168" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-168"
      className={className}
      style={palette}
      >
        <span data-part="field">
          <label htmlFor={inputId} hidden>
            {searchLabel}
          </label>
          <input
            id={inputId}
            type="search"
            value={query}
            placeholder={placeholder}
            onChange={(event) => setTyped(event.target.value)}
          />
        </span>
        <label data-part="only">
          <input
            type="checkbox"
            checked={onlyHits}
            onChange={(event) => setOnlyHits(event.target.checked)}
          />
          {onlyText}
        </label>
        <p data-part="count" role="status" aria-live="polite">
          {needle === ""
            ? rowsTemplate.replace("{count}", String(rows.length))
            : matchTemplate
                .replace("{matches}", String(total))
                .replace("{rows}", String(matched.length))}
        </p>
      </div>
    </>
  )
}
