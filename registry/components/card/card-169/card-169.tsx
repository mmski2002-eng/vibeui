"use client"

import type { Dispatch, SetStateAction, ComponentProps, CSSProperties } from "react"

export type Card169Row = {
  id: string
  position: string
  unit: string
  quantity: number
  price: number
}

export type Draft = Record<string, number>

export type Card169Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  noEditsText?: string
  editsTemplate?: string
  editLabel?: string
  revertAllText?: string
  rows?: Card169Row[]
  saveAllText?: string
  editing?: boolean
  entries?: readonly [string, string][]
  setDraft?: (value: Draft) => void
  setEditing?: Dispatch<SetStateAction<boolean>>
  setSaved?: Dispatch<SetStateAction<Card169Row[] | null>>
  cellValue?: (row: Card169Row, key: "quantity" | "price") => string | number
  accent?: string
  className?: string
  style?: CSSProperties
}

const DEFAULT_ROWS: Card169Row[] = [
  {
    id: "p1",
    position: "Профиль алюминиевый",
    unit: "м",
    quantity: 240,
    price: 410,
  },
  {
    id: "p2",
    position: "Уплотнитель EPDM",
    unit: "м",
    quantity: 180,
    price: 95,
  },
  {
    id: "p3",
    position: "Стеклопакет 4-16-4",
    unit: "м²",
    quantity: 62,
    price: 3400,
  },
  {
    id: "p4",
    position: "Фурнитура поворотная",
    unit: "компл.",
    quantity: 48,
    price: 1750,
  },
  {
    id: "p5",
    position: "Монтажная пена",
    unit: "балл.",
    quantity: 90,
    price: 380,
  },
]

// Часть блока datagrid-021, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-169"]){
--vibeui-card-169-accent:light-dark(oklch(0.275 0 0),oklch(0.903 0 0));
--vibeui-card-169-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-card-169-muted:color-mix(in oklab,var(--vibeui-card-169-fg) 68%,transparent);
--vibeui-card-169-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-169"]{color-scheme:dark}
[data-vibeui-block="card-169"]{box-sizing:border-box}
[data-vibeui-block="card-169"] *{box-sizing:border-box}
[data-vibeui-block="card-169"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;min-height:3rem;
padding:0.625rem 0.875rem;border-bottom:1px solid var(--vibeui-card-169-border);}
[data-vibeui-block="card-169"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="card-169"] [data-part="count"]{margin:0;font-size:0.75rem;color:var(--vibeui-card-169-muted)}
[data-vibeui-block="card-169"] [data-part="primary"]{border-color:transparent;background:var(--vibeui-card-169-accent);color:oklch(from var(--vibeui-card-169-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-169"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Пакетная правка»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card169({
  heading = "Спецификация заказа",
  noEditsText = "Несохранённых правок нет",
  editsTemplate = "Несохранённых правок: {count}",
  editLabel = "Режим правки",
  revertAllText = "Отменить всё",
  rows = DEFAULT_ROWS,
  saveAllText = "Сохранить всё",
  editing = true,
  entries = [],
  setDraft = () => {},
  setEditing = () => {},
  setSaved = () => {},
  cellValue = () => "",
  accent,
  className,
  style,
  ...props
}: Card169Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-169-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-169" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-169"
      className={className}
      style={palette}
      >
        <h3 data-part="title">{heading}</h3>
        <p data-part="count" role="status" aria-live="polite">
          {entries.length === 0
            ? noEditsText
            : editsTemplate.replace("{count}", String(entries.length))}
        </p>
        <button
          type="button"
          aria-pressed={editing}
          onClick={() => setEditing((value) => !value)}
        >
          {editLabel}
        </button>
        <button
          type="button"
          disabled={entries.length === 0}
          onClick={() => setDraft({})}
        >
          {revertAllText}
        </button>
        <button
          type="button"
          data-part="primary"
          disabled={entries.length === 0}
          onClick={() => {
            setSaved((current) =>
              (current ?? rows).map((row) => ({
                ...row,
                quantity: cellValue(row, "quantity"),
                price: cellValue(row, "price"),
              })),
            )
            setDraft({})
          }}
        >
          {saveAllText}
        </button>
      </div>
    </>
  )
}
