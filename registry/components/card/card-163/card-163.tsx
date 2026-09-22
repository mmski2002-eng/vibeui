"use client"

import type { Dispatch, SetStateAction, ComponentProps, CSSProperties } from "react"

export type ColumnKey = "product" | "vendor" | "stock" | "price" | "updated"

export type Card163Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  heading?: string
  countTemplate?: string
  menuLabel?: string
  legendText?: string
  columnText?: Record<string, string>
  resetText?: string
  hidden?: ColumnKey[]
  last?: boolean
  open?: boolean
  setHidden?: Dispatch<SetStateAction<ColumnKey[]>>
  setOpen?: Dispatch<SetStateAction<boolean>>
  visible?: readonly (typeof COLUMNS)[number][]
  accent?: string
  className?: string
  style?: CSSProperties
}

const COLUMN_TEXT: Record<string, string> = {
  product: "Товар",
  vendor: "Поставщик",
  stock: "Остаток",
  price: "Цена",
  updated: "Обновлено",
}

const COLUMNS: { key: ColumnKey; numeric: boolean }[] = [
  { key: "product", numeric: false },
  { key: "vendor", numeric: false },
  { key: "stock", numeric: true },
  { key: "price", numeric: true },
  { key: "updated", numeric: false },
]

// Часть блока datagrid-013, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-163"]){
--vibeui-card-163-accent:light-dark(oklch(0.28 0 0),oklch(0.906 0 0));
--vibeui-card-163-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-card-163-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
--vibeui-card-163-muted:color-mix(in oklab,var(--vibeui-card-163-fg) 68%,transparent);
--vibeui-card-163-panel:light-dark(oklch(1 0 0),oklch(0.24 0 285));
--vibeui-card-163-shadow:light-dark(oklch(0.23 0 285 / 14%),oklch(0 0 0 / 50%));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-163"]{color-scheme:dark}
[data-vibeui-block="card-163"]{box-sizing:border-box}
[data-vibeui-block="card-163"] *{box-sizing:border-box}
[data-vibeui-block="card-163"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-card-163-border);}
[data-vibeui-block="card-163"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="card-163"] [data-part="count"]{margin:0;font-size:0.75rem;color:var(--vibeui-card-163-muted)}
[data-vibeui-block="card-163"] [data-part="menu-wrap"]{position:relative}
[data-vibeui-block="card-163"] [data-part="trigger"]{appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:550;
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.375rem 0.6875rem;border-radius:0.5rem;
border:1px solid var(--vibeui-card-163-border);
background:transparent;color:var(--vibeui-card-163-fg);}
[data-vibeui-block="card-163"] [data-part="trigger"][aria-expanded="true"]{border-color:var(--vibeui-card-163-accent);color:var(--vibeui-card-163-accent);}
[data-vibeui-block="card-163"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-card-163-accent);outline-offset:2px}
[data-vibeui-block="card-163"] [data-part="trigger"]::after{content:"";width:0.375rem;height:0.375rem;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:translateY(-1px) rotate(45deg)}
[data-vibeui-block="card-163"] [data-part="menu"]{position:absolute;inset-inline-end:0;inset-block-start:calc(100% + 0.375rem);z-index:5;
min-width:12rem;margin:0;padding:0.625rem 0.75rem 0.5rem;
border:1px solid var(--vibeui-card-163-border);border-radius:0.75rem;
background:var(--vibeui-card-163-panel);box-shadow:0 12px 28px var(--vibeui-card-163-shadow);}
[data-vibeui-block="card-163"] [data-part="menu"] legend{padding:0;font-size:0.6875rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-card-163-muted);}
[data-vibeui-block="card-163"] [data-part="option"]{display:flex;align-items:center;gap:0.5rem;padding:0.3125rem 0;font-size:0.8125rem;cursor:pointer;}
[data-vibeui-block="card-163"] [data-part="option"]:has(input:disabled){cursor:not-allowed;color:var(--vibeui-card-163-muted)}
[data-vibeui-block="card-163"] [data-part="option"] input{accent-color:var(--vibeui-card-163-accent);margin:0;width:0.9375rem;height:0.9375rem}
[data-vibeui-block="card-163"] [data-part="option"] input:focus-visible{outline:2px solid var(--vibeui-card-163-accent);outline-offset:2px}
[data-vibeui-block="card-163"] [data-part="reset"]{appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;padding:0.25rem 0;margin-top:0.25rem;
border:0;border-top:1px solid var(--vibeui-card-163-border);width:100%;text-align:start;
background:transparent;color:var(--vibeui-card-163-accent);}
[data-vibeui-block="card-163"] [data-part="reset"]:focus-visible{outline:2px solid var(--vibeui-card-163-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-163"] *{animation:none!important;transition:none!important}}
`

/** Шапка таблицы «Видимость колонок»: заголовок, подсказка или статус и элементы управления над данными. */
export function Card163({
  heading = "Складские остатки",
  countTemplate = "Показано колонок: {shown} из {total}",
  menuLabel = "Колонки",
  legendText = "Видимость колонок",
  columnText = COLUMN_TEXT,
  resetText = "Показать все колонки",
  hidden = [],
  last = false,
  open = false,
  setHidden = () => {},
  setOpen = () => {},
  visible = [],
  accent,
  className,
  style,
  ...props
}: Card163Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-163-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-163" precedence="medium">
        {STYLES}
      </style>
      <div
      {...props}
      data-slot="card"
      data-vibeui-block="card-163"
      className={className}
      style={palette}
      >
        <h3 data-part="title">{heading}</h3>
        <p data-part="count" aria-live="polite">
          {countTemplate
            .replace("{shown}", String(visible.length))
            .replace("{total}", String(COLUMNS.length))}
        </p>
        <div data-part="menu-wrap">
          <button
            type="button"
            data-part="trigger"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {menuLabel}
          </button>
          {open ? (
            <fieldset data-part="menu">
              <legend>{legendText}</legend>
              {COLUMNS.map((column) => {
                const shown = !hidden.includes(column.key)

                return (
                  <label key={column.key} data-part="option">
                    <input
                      type="checkbox"
                      checked={shown}
                      disabled={shown && last}
                      onChange={() =>
                        setHidden((current) =>
                          current.includes(column.key)
                            ? current.filter((key) => key !== column.key)
                            : [...current, column.key],
                        )
                      }
                    />
                    {columnText[column.key] ?? COLUMN_TEXT[column.key]}
                  </label>
                )
              })}
              <button
                type="button"
                data-part="reset"
                onClick={() => setHidden([])}
              >
                {resetText}
              </button>
            </fieldset>
          ) : null}
        </div>
      </div>
    </>
  )
}
