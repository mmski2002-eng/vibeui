"use client"

import type { ComponentProps, CSSProperties } from "react"

export type Rule = Card179Rule

export type Card179Rule = {
  id: number
  field: "name" | "region" | "revenue" | "overdue"
  operator: string
  value: string
}

export type Card179Props = Omit<ComponentProps<"div">, "title" | "children" | "id"> & {
  field?: string
  id?: number
  operator?: string
  value?: string
  fieldLabel?: string
  fieldText?: Record<string, string>
  operatorLabel?: string
  operatorText?: Record<string, string>
  valueLabel?: string
  removeLabel?: string
  joinerLabel?: string
  joinerOptionText?: Record<string, string>
  join?: "and" | "or"
  operators?: readonly string[]
  patch?: (id: number, change: Partial<Rule>) => void
  setChosen?: (value: "and" | "or" | null) => void
  setRules?: (next: (current: Rule[]) => Rule[]) => void
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

const FIELD_TEXT: Record<string, string> = {
  name: "Название",
  region: "Регион",
  revenue: "Выручка, тыс.",
  overdue: "Просрочка, дн.",
}

const OPERATOR_TEXT: Record<string, string> = {
  contains: "содержит",
  equals: "равно",
  starts: "начинается с",
  gt: "больше",
  lt: "меньше",
  eq: "равно",
}

const JOINER_OPTION_TEXT: Record<string, string> = {
  and: "все условия (и)",
  or: "любое условие (или)",
}

const NUMBER_OPS = ["gt", "lt", "eq"] as const

const FIELDS = [
  { key: "name", numeric: false },
  { key: "region", numeric: false },
  { key: "revenue", numeric: true },
  { key: "overdue", numeric: true },
] as const

// Часть блока datagrid-019, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-179"]){
--vibeui-card-179-accent:light-dark(oklch(0.275 0 0),oklch(0.906 0 0));
--vibeui-card-179-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-card-179-danger:light-dark(oklch(0.55 0.17 28),oklch(0.76 0.15 28));
--vibeui-card-179-muted:color-mix(in oklab,var(--vibeui-card-179-fg) 68%,transparent);
--vibeui-card-179-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-179"]{color-scheme:dark}
[data-vibeui-block="card-179"]{box-sizing:border-box}
[data-vibeui-block="card-179"] *{box-sizing:border-box}
[data-vibeui-block="card-179"]{clear:both;display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;margin-top:0.5rem}
[data-vibeui-block="card-179"] select,[data-vibeui-block="card-179"] [data-part="value"]{font:inherit;font-size:0.75rem;color:inherit;padding:0.3125rem 0.5rem;
border:1px solid var(--vibeui-card-179-border);border-radius:0.4375rem;
background:transparent;}
[data-vibeui-block="card-179"] [data-part="value"]{width:8rem;min-width:0}
[data-vibeui-block="card-179"] select:focus-visible,[data-vibeui-block="card-179"] [data-part="value"]:focus-visible{outline:2px solid var(--vibeui-card-179-accent);outline-offset:1px}
[data-vibeui-block="card-179"] [data-part="drop"]{appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;line-height:1;
width:1.75rem;height:1.75rem;border-radius:0.4375rem;
border:1px solid var(--vibeui-card-179-border);
background:transparent;color:var(--vibeui-card-179-muted);}
[data-vibeui-block="card-179"] [data-part="drop"]:hover{color:var(--vibeui-card-179-danger);border-color:var(--vibeui-card-179-danger)}
[data-vibeui-block="card-179"] [data-part="drop"]:focus-visible{outline:2px solid var(--vibeui-card-179-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-179"] *{animation:none!important;transition:none!important}}
`

/** Строка конструктора фильтров: поле, оператор, значение и кнопка удаления. */
export function Card179({
  field,
  id = 0,
  operator,
  value,
  fieldLabel = "Поле условия {index}",
  fieldText = FIELD_TEXT,
  operatorLabel = "Оператор условия {index}",
  operatorText = OPERATOR_TEXT,
  valueLabel = "Значение условия {index}",
  removeLabel = "Удалить условие {index}",
  joinerLabel = "Связка между условиями",
  joinerOptionText = JOINER_OPTION_TEXT,
  join,
  operators = NUMBER_OPS,
  patch = () => {},
  setChosen = () => {},
  setRules = () => {},
  index = 0,
  accent,
  className,
  style,
  ...props
}: Card179Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-179-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-179" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="card"
        data-vibeui-block="card-179"
        className={className}
        style={palette}
      >
        <select
          value={field}
          aria-label={fieldLabel.replace(
            "{index}",
            String(index + 1),
          )}
          onChange={(event) => {
            const next = FIELDS.find(
              (item) => item.key === event.target.value,
            )

            patch(id, {
              field: event.target.value as Rule["field"],
              operator: next?.numeric ? "gt" : "contains",
              value: "",
            })
          }}
        >
          {FIELDS.map((item) => (
            <option key={item.key} value={item.key}>
              {fieldText[item.key] ?? FIELD_TEXT[item.key]}
            </option>
          ))}
        </select>
        <select
          value={operator}
          aria-label={operatorLabel.replace(
            "{index}",
            String(index + 1),
          )}
          onChange={(event) =>
            patch(id, { operator: event.target.value })
          }
        >
          {operators.map((item) => (
            <option key={item} value={item}>
              {operatorText[item] ?? OPERATOR_TEXT[item]}
            </option>
          ))}
        </select>
        <input
          data-part="value"
          type={FIELDS.find((item) => item.key === field)?.numeric ? "number" : "text"}
          value={value}
          aria-label={valueLabel.replace(
            "{index}",
            String(index + 1),
          )}
          onChange={(event) =>
            patch(id, { value: event.target.value })
          }
        />
        <button
          type="button"
          data-part="drop"
          aria-label={removeLabel.replace(
            "{index}",
            String(index + 1),
          )}
          onClick={() =>
            setRules((current) =>
              current.filter((item) => item.id !== id),
            )
          }
        >
          ×
        </button>
        {index === 0 ? (
          <select
            value={join}
            aria-label={joinerLabel}
            onChange={(event) =>
              setChosen(event.target.value as "and" | "or")
            }
          >
            <option value="and">
              {joinerOptionText.and ?? JOINER_OPTION_TEXT.and}
            </option>
            <option value="or">
              {joinerOptionText.or ?? JOINER_OPTION_TEXT.or}
            </option>
          </select>
        ) : null}
      </div>
    </>
  )
}
