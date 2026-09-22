"use client"

import type { ComponentProps, CSSProperties } from "react"

export type Card162Row = {
  id: string
  campaign: string
  channel: string
  leads: number
  cost: number
}

export type Card162Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  loadingText?: string
  readyText?: string
  rows?: Card162Row[]
  showDataLabel?: string
  showLoadingLabel?: string
  loading?: boolean
  setLoading?: (value: boolean) => void
  accent?: string
  className?: string
  style?: CSSProperties
}

const DEFAULT_ROWS: Card162Row[] = [
  {
    id: "k1",
    campaign: "Весенняя витрина",
    channel: "Поиск",
    leads: 412,
    cost: 184000,
  },
  {
    id: "k2",
    campaign: "Ретаргет корзины",
    channel: "Соцсети",
    leads: 268,
    cost: 96500,
  },
  {
    id: "k3",
    campaign: "Каталог мебели",
    channel: "Поиск",
    leads: 195,
    cost: 74200,
  },
  {
    id: "k4",
    campaign: "Рассылка «Новинки»",
    channel: "Почта",
    leads: 143,
    cost: 12800,
  },
  {
    id: "k5",
    campaign: "Партнёрские обзоры",
    channel: "Медиа",
    leads: 88,
    cost: 58000,
  },
  {
    id: "k6",
    campaign: "Локальная реклама",
    channel: "Карты",
    leads: 61,
    cost: 23400,
  },
]

// Часть блока datagrid-012, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-162"]){
--vibeui-card-162-accent:light-dark(oklch(0.275 0 0),oklch(0.906 0 0));
--vibeui-card-162-border:light-dark(oklch(0.92 0.006 145),oklch(0.34 0.012 145));
--vibeui-card-162-fg:light-dark(oklch(0.23 0.014 145),oklch(0.93 0.006 145));
--vibeui-card-162-field:light-dark(oklch(1 0 0),oklch(0.22 0.012 145));
--vibeui-card-162-muted:color-mix(in oklab,var(--vibeui-card-162-fg) 68%,transparent);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-162"]{color-scheme:dark}
[data-vibeui-block="card-162"]{box-sizing:border-box}
[data-vibeui-block="card-162"] *{box-sizing:border-box}
[data-vibeui-block="card-162"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-card-162-border);}
[data-vibeui-block="card-162"] [data-part="bar-text"]{margin-inline-end:auto}
[data-vibeui-block="card-162"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="card-162"] [data-part="status"]{margin:0;font-size:0.75rem;color:var(--vibeui-card-162-muted);}
[data-vibeui-block="card-162"] button{appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:550;
padding:0.375rem 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-card-162-border);
background:var(--vibeui-card-162-field);color:var(--vibeui-card-162-fg);}
[data-vibeui-block="card-162"] button:focus-visible{outline:2px solid var(--vibeui-card-162-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-162"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Скелетон загрузки»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card162({
  heading = "Кампании",
  loadingText = "Загружаем строки…",
  readyText = "Готово, строк: {count}",
  rows = DEFAULT_ROWS,
  showDataLabel = "Показать данные",
  showLoadingLabel = "Показать загрузку",
  loading = true,
  setLoading = () => {},
  accent,
  className,
  style,
  ...props
}: Card162Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-162-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-162" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-162"
      className={className}
      style={palette}
      >
        <div data-part="bar-text">
          <h3 data-part="title">{heading}</h3>
          <p data-part="status" role="status">
            {loading
              ? loadingText
              : readyText.replace("{count}", String(rows.length))}
          </p>
        </div>
        <button type="button" onClick={() => setLoading(!loading)}>
          {loading ? showDataLabel : showLoadingLabel}
        </button>
      </div>
    </>
  )
}
