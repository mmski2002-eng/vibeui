import type { ComponentProps, CSSProperties } from "react"

export type Card154Row = {
  code: string
  operation: string
  account: string
  amount: number
}

export type Card154Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  countText?: string
  rows?: Card154Row[]
  accent?: string
  className?: string
  style?: CSSProperties
}

const DEFAULT_ROWS: Card154Row[] = [
  {
    code: "OP-3041",
    operation: "Оплата хостинга",
    account: "Основной",
    amount: -18400,
  },
  {
    code: "OP-3042",
    operation: "Поступление от Атлас",
    account: "Основной",
    amount: 96000,
  },
  {
    code: "OP-3043",
    operation: "Реклама, март",
    account: "Маркетинг",
    amount: -54300,
  },
  {
    code: "OP-3044",
    operation: "Поступление от Ветка",
    account: "Основной",
    amount: 72000,
  },
  {
    code: "OP-3045",
    operation: "Аренда",
    account: "Основной",
    amount: -120000,
  },
  {
    code: "OP-3046",
    operation: "Возврат Дельта",
    account: "Основной",
    amount: -7500,
  },
  {
    code: "OP-3047",
    operation: "Поступление от Гранат",
    account: "Основной",
    amount: 310000,
  },
  {
    code: "OP-3048",
    operation: "Подписка на аналитику",
    account: "Продукт",
    amount: -12800,
  },
  {
    code: "OP-3049",
    operation: "Командировка, Казань",
    account: "Продажи",
    amount: -31200,
  },
  {
    code: "OP-3050",
    operation: "Поступление от Ёлка",
    account: "Основной",
    amount: 48000,
  },
  {
    code: "OP-3051",
    operation: "Оборудование",
    account: "Продукт",
    amount: -88000,
  },
  {
    code: "OP-3052",
    operation: "Поступление от Берег",
    account: "Основной",
    amount: 12500,
  },
  {
    code: "OP-3053",
    operation: "Юридические услуги",
    account: "Основной",
    amount: -26000,
  },
  {
    code: "OP-3054",
    operation: "Партнёрская выплата",
    account: "Маркетинг",
    amount: -14700,
  },
]

// Часть блока datagrid-004, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-154"]){
--vibeui-card-154-muted:color-mix(in oklab,var(--vibeui-card-154-fg) 68%,transparent);
--vibeui-card-154-fg:light-dark(oklch(0.23 0.012 160),oklch(0.93 0.006 160));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-154"]{color-scheme:dark}
[data-vibeui-block="card-154"]{box-sizing:border-box}
[data-vibeui-block="card-154"] *{box-sizing:border-box}
[data-vibeui-block="card-154"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.5rem;padding:0.875rem;}
[data-vibeui-block="card-154"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="card-154"] [data-part="hint"]{margin:0 0 0 auto;font-size:0.75rem;color:var(--vibeui-card-154-muted);}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-154"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Закреплённые итоги»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card154({
  heading = "Операции",
  countText = "{count} записей",
  rows = DEFAULT_ROWS,
  accent,
  className,
  style,
  ...props
}: Card154Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-154-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-154" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-154"
      className={className}
      style={palette}
      >
        <h3 data-part="title">{heading}</h3>
        <p data-part="hint">
          {countText.replace("{count}", String(rows.length))}
        </p>
      </div>
    </>
  )
}
