"use client"

import { useState } from "react"
import { Card179 } from "@/registry/components/card/card-179/card-179"
import type { ComponentProps, CSSProperties } from "react"

export type Datagrid019Row = {
  id: string
  name: string
  region: string
  revenue: number
  overdue: number
}

export type Datagrid019Rule = {
  id: number
  field: "name" | "region" | "revenue" | "overdue"
  operator: string
  value: string
}

export type Datagrid019Props = Omit<ComponentProps<"section">, "children"> & {
  rows?: Datagrid019Row[]
  caption?: string
  joiner?: "and" | "or"
  /** Условия, с которыми конструктор открывается. */
  defaultRules?: Datagrid019Rule[]
  /** Заголовок конструктора условий. */
  legendText?: string
  /** Названия полей по ключу: компонент несёт русские. */
  fieldText?: Record<string, string>
  /** Названия операторов по ключу: компонент несёт русские. */
  operatorText?: Record<string, string>
  /** Связка между строками условий: and и or. */
  joinerText?: Record<string, string>
  /** Названия связок в списке: and и or. */
  joinerOptionText?: Record<string, string>
  /** Скрытая подпись у связки между условиями. */
  joinerHint?: string
  /** Подпись списка связок. */
  joinerLabel?: string
  /** Подписи полей условия. {index} — номер условия. */
  fieldLabel?: string
  operatorLabel?: string
  valueLabel?: string
  removeLabel?: string
  /** Подпись кнопки добавления условия. */
  addText?: string
  /** Счётчик подошедших строк. {count} и {total} — числа. */
  summaryTemplate?: string
  /** Строка, когда набор условий не пропустил ничего. */
  emptyText?: string
  /** Заголовки колонок по ключу: компонент несёт русские. */
  columnText?: Record<string, string>
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Пусто — подложки нет, сетка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: фильтр собирается из условий, а не выбирается из
// готового списка. Каждое условие — поле, оператор и значение; связка
// «и/или» одна на весь набор и стоит между строками условий, чтобы её
// нельзя было прочитать как часть соседнего условия. Набор живёт внутри
// fieldset с legend: для скринридера это одна группа, а не россыпь полей.
//
// Тема берётся из color-scheme окружения через light-dark(): сетка темнеет
// вместе со страницей и не носит собственной подложки.
const STYLES = `
:where([data-vibeui-block="datagrid-019"]){
--vibeui-datagrid-019-bg:transparent;
--vibeui-datagrid-019-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
--vibeui-datagrid-019-muted:color-mix(in oklab,var(--vibeui-datagrid-019-fg) 68%,transparent);
--vibeui-datagrid-019-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-datagrid-019-head:light-dark(oklch(0.975 0 285),oklch(0.27 0 285));
--vibeui-datagrid-019-accent:light-dark(oklch(0.275 0 0),oklch(0.906 0 0));
--vibeui-datagrid-019-danger:light-dark(oklch(0.55 0.17 28),oklch(0.76 0.15 28));
--vibeui-datagrid-019-panel:light-dark(oklch(0.985 0 285),oklch(0.26 0 285));
--vibeui-datagrid-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="datagrid-019"]{color-scheme:dark}
[data-vibeui-block="datagrid-019"]{
box-sizing:border-box;width:100%;max-width:52rem;margin:0 auto;
background:var(--vibeui-datagrid-019-bg);color:var(--vibeui-datagrid-019-fg);
border:1px solid var(--vibeui-datagrid-019-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-019-font);overflow:hidden;
}
[data-vibeui-block="datagrid-019"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-019"] [data-part="rule"]{margin-top:0.5rem}
[data-vibeui-block="datagrid-019"] [data-part="builder"]{
border:0;margin:0;padding:0.75rem 0.875rem;background:var(--vibeui-datagrid-019-panel);
border-bottom:1px solid var(--vibeui-datagrid-019-border);
}
[data-vibeui-block="datagrid-019"] [data-part="builder"] legend{
padding:0;font-size:0.6875rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-datagrid-019-muted);float:left;width:100%;
}
[data-vibeui-block="datagrid-019"] [data-part="joiner"]{
clear:both;display:flex;align-items:center;gap:0.375rem;margin-top:0.5rem;
font-size:0.6875rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:var(--vibeui-datagrid-019-accent);
}
[data-vibeui-block="datagrid-019"] [data-part="joiner"]::after{content:"";flex:1;height:1px;background:var(--vibeui-datagrid-019-border)}
[data-vibeui-block="datagrid-019"] [data-part="add"]{
clear:both;appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:600;
margin-top:0.625rem;padding:0.3125rem 0.625rem;border-radius:0.4375rem;
border:1px dashed var(--vibeui-datagrid-019-accent);background:transparent;color:var(--vibeui-datagrid-019-accent);
}
[data-vibeui-block="datagrid-019"] [data-part="add"]:disabled{opacity:.45;cursor:not-allowed}
[data-vibeui-block="datagrid-019"] [data-part="add"]:focus-visible{outline:2px solid var(--vibeui-datagrid-019-accent);outline-offset:2px}
[data-vibeui-block="datagrid-019"] [data-part="summary"]{
clear:both;margin:0.625rem 0 0;font-size:0.75rem;color:var(--vibeui-datagrid-019-muted);
}
[data-vibeui-block="datagrid-019"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-019"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-019-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-019"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-019"] caption{
padding:0.625rem 0.875rem;text-align:left;font-size:0.75rem;color:var(--vibeui-datagrid-019-muted);caption-side:top;
}
[data-vibeui-block="datagrid-019"] th,
[data-vibeui-block="datagrid-019"] td{
padding:0.5rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-datagrid-019-border);
}
[data-vibeui-block="datagrid-019"] thead th{background:var(--vibeui-datagrid-019-head);font-weight:600}
[data-vibeui-block="datagrid-019"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-019"] [data-late="true"]{color:var(--vibeui-datagrid-019-danger);font-weight:600}
[data-vibeui-block="datagrid-019"] [data-part="none"]{padding:1.5rem 0.875rem;text-align:center;color:var(--vibeui-datagrid-019-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-019"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Datagrid019Row[] = [
  {
    id: "a1",
    name: "Артель «Кама»",
    region: "Приволжье",
    revenue: 12400,
    overdue: 0,
  },
  {
    id: "a2",
    name: "Северный Порт",
    region: "Северо-Запад",
    revenue: 30100,
    overdue: 12,
  },
  {
    id: "a3",
    name: "Гранд-Сервис",
    region: "Центр",
    revenue: 4300,
    overdue: 41,
  },
  { id: "a4", name: "Мостовик", region: "Урал", revenue: 18700, overdue: 3 },
  {
    id: "a5",
    name: "Ювенко Логистика",
    region: "Центр",
    revenue: 8600,
    overdue: 0,
  },
  {
    id: "a6",
    name: "Дельта-Строй",
    region: "Урал",
    revenue: 26500,
    overdue: 27,
  },
]

const FIELDS = [
  { key: "name", numeric: false },
  { key: "region", numeric: false },
  { key: "revenue", numeric: true },
  { key: "overdue", numeric: true },
] as const

const TEXT_OPS = ["contains", "equals", "starts"] as const

const NUMBER_OPS = ["gt", "lt", "eq"] as const

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

const JOINER_TEXT: Record<string, string> = { and: "и", or: "или" }

const JOINER_OPTION_TEXT: Record<string, string> = {
  and: "все условия (и)",
  or: "любое условие (или)",
}

const COLUMN_TEXT: Record<string, string> = {
  name: "Контрагент",
  region: "Регион",
  revenue: "Выручка, тыс. ₽",
  overdue: "Просрочка, дн.",
}

type Rule = Datagrid019Rule

const DEFAULT_RULES: Datagrid019Rule[] = [
  { id: 1, field: "region", operator: "contains", value: "Урал" },
  { id: 2, field: "overdue", operator: "gt", value: "10" },
]

function test(row: Datagrid019Row, rule: Rule) {
  const field = FIELDS.find((item) => item.key === rule.field)

  if (!field) {
    return true
  }

  if (field.numeric) {
    const left = Number(row[rule.field as "revenue" | "overdue"])
    const right = Number(rule.value)

    if (Number.isNaN(right)) {
      return true
    }

    if (rule.operator === "gt") {
      return left > right
    }

    if (rule.operator === "lt") {
      return left < right
    }

    return left === right
  }

  const left = String(row[rule.field as "name" | "region"]).toLowerCase()
  const right = rule.value.trim().toLowerCase()

  if (right === "") {
    return true
  }

  if (rule.operator === "equals") {
    return left === right
  }

  if (rule.operator === "starts") {
    return left.startsWith(right)
  }

  return left.includes(right)
}

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Сетка с конструктором условий: поле, оператор и значение в каждой
 * строке, одна связка «и/или» на весь набор. Один файл, ноль зависимостей.
 */
export function Datagrid019({
  rows = DEFAULT_ROWS,
  caption = "Строки отбираются набором условий из конструктора",
  joiner = "and",
  defaultRules = DEFAULT_RULES,
  legendText = "Условия отбора",
  fieldText = FIELD_TEXT,
  operatorText = OPERATOR_TEXT,
  joinerText = JOINER_TEXT,
  joinerOptionText = JOINER_OPTION_TEXT,
  joinerHint = "связка условий",
  joinerLabel = "Связка между условиями",
  fieldLabel = "Поле условия {index}",
  operatorLabel = "Оператор условия {index}",
  valueLabel = "Значение условия {index}",
  removeLabel = "Удалить условие {index}",
  addText = "+ Добавить условие",
  summaryTemplate = "Подошло строк: {count} из {total}",
  emptyText = "Набор условий не пропустил ни одной строки",
  columnText = COLUMN_TEXT,
  scrollLabel = "Таблица контрагентов, прокручивается вбок",
  background = "",
  accent,
  className,
  style,
  ...props
}: Datagrid019Props) {
  // Выбор читателя живёт рядом с пропом, а не вместо него: смена joiner
  // снаружи обязана переставить связку, иначе проп сработал бы один раз.
  const [chosen, setChosen] = useState<"and" | "or" | null>(null)
  const [source, setSource] = useState<"and" | "or">(joiner)
  const [edited, setEdited] = useState<Rule[] | null>(null)
  const [seed, setSeed] = useState<Rule[]>(defaultRules)

  if (source !== joiner) {
    setSource(joiner)
    setChosen(null)
  }

  if (seed !== defaultRules) {
    setSeed(defaultRules)
    setEdited(null)
  }

  const join = chosen ?? joiner
  const rules = edited ?? defaultRules

  function setRules(next: (current: Rule[]) => Rule[]) {
    setEdited((current) => next(current ?? defaultRules))
  }

  const filtered = rows.filter((row) => {
    if (rules.length === 0) {
      return true
    }

    return join === "and"
      ? rules.every((rule) => test(row, rule))
      : rules.some((rule) => test(row, rule))
  })

  const palette = {
    ...(accent ? { "--vibeui-datagrid-019-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-datagrid-019-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  function patch(id: number, change: Partial<Rule>) {
    setRules((current) =>
      current.map((rule) => (rule.id === id ? { ...rule, ...change } : rule)),
    )
  }

  return (
    <>
      <style href="vibeui-datagrid-019" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="data-grid"
        data-vibeui-block="datagrid-019"
        className={className}
        style={palette}
      >
        <fieldset data-part="builder">
          <legend>{legendText}</legend>
          {rules.map((rule, index) => {
            const field = FIELDS.find((item) => item.key === rule.field)
            const operators = field?.numeric ? NUMBER_OPS : TEXT_OPS

            return (
              <div key={rule.id}>
                {index > 0 ? (
                  <p data-part="joiner">
                    {joinerText[join] ?? JOINER_TEXT[join]}
                    <span hidden>{joinerHint}</span>
                  </p>
                ) : null}
                <Card179 data-part="rule" field={rule.field} id={rule.id} operator={rule.operator} value={rule.value} fieldLabel={fieldLabel} fieldText={fieldText} operatorLabel={operatorLabel} operatorText={operatorText} valueLabel={valueLabel} removeLabel={removeLabel} joinerLabel={joinerLabel} joinerOptionText={joinerOptionText} join={join} operators={operators} patch={patch} setChosen={setChosen} setRules={setRules} index={index} accent={accent} />
              </div>
            )
          })}
          <button
            type="button"
            data-part="add"
            disabled={rules.length >= 4}
            onClick={() =>
              setRules((current) => [
                ...current,
                {
                  id: Math.max(0, ...current.map((rule) => rule.id)) + 1,
                  field: "name",
                  operator: "contains",
                  value: "",
                },
              ])
            }
          >
            {addText}
          </button>
          <p data-part="summary" role="status" aria-live="polite">
            {summaryTemplate
              .replace("{count}", String(filtered.length))
              .replace("{total}", String(rows.length))}
          </p>
        </fieldset>
        <div
          data-part="scroll"
          role="region"
          aria-label={scrollLabel}
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col">{columnText.name ?? COLUMN_TEXT.name}</th>
                <th scope="col">{columnText.region ?? COLUMN_TEXT.region}</th>
                <th scope="col" data-align="end">
                  {columnText.revenue ?? COLUMN_TEXT.revenue}
                </th>
                <th scope="col" data-align="end">
                  {columnText.overdue ?? COLUMN_TEXT.overdue}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.name}</th>
                  <td>{row.region}</td>
                  <td data-align="end">
                    {row.revenue.toLocaleString("ru-RU")}
                  </td>
                  <td
                    data-align="end"
                    data-late={row.overdue > 0 ? "true" : undefined}
                  >
                    {row.overdue}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} data-part="none">
                    {emptyText}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
