"use client"

import { useId, useMemo, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Combobox013Section = { title: string; items: string[] }

export type Combobox013Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  sections?: Combobox013Section[]
  defaultValue?: string
  onSelect?: (value: string, section: string) => void
  accent?: string
}

// Идея компонента: в длинном справочнике человек чаще помнит раздел, а не
// точное название. Поэтому список разложен на две колонки: слева разделы,
// справа значения выбранного раздела. Поиск при этом остаётся сквозным —
// как только в поле появляется текст, колонки схлопываются в один список
// совпадений с подписью раздела у каждой строки.
const STYLES = `
:where([data-vibeui-block="combobox-013"]){
--vibeui-combobox-013-bg:oklch(1 0 0);
--vibeui-combobox-013-fg:oklch(0.22 0.014 250);
--vibeui-combobox-013-muted:oklch(0.55 0.014 250);
--vibeui-combobox-013-border:oklch(0.9 0.008 250);
--vibeui-combobox-013-field:oklch(0.985 0.004 250);
--vibeui-combobox-013-soft:oklch(0.96 0.008 250);
--vibeui-combobox-013-accent:oklch(0.5 0.13 250);
--vibeui-combobox-013-accentsoft:oklch(0.94 0.04 250);
--vibeui-combobox-013-radius:0.625rem;
--vibeui-combobox-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="combobox-013"]{
display:flex;flex-direction:column;gap:0.4rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-013-bg);
border:1px solid var(--vibeui-combobox-013-border);
border-radius:calc(var(--vibeui-combobox-013-radius) + 0.25rem);
color:var(--vibeui-combobox-013-fg);
font-family:var(--vibeui-combobox-013-font);
}
[data-vibeui-block="combobox-013"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-013"] input{
box-sizing:border-box;width:100%;height:2.4rem;padding:0 0.6rem;
border:1px solid var(--vibeui-combobox-013-border);
border-radius:var(--vibeui-combobox-013-radius);
background:var(--vibeui-combobox-013-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-013"] input::placeholder{color:var(--vibeui-combobox-013-muted)}
[data-vibeui-block="combobox-013"] input:focus-visible{
outline:2px solid var(--vibeui-combobox-013-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="combobox-013"] [data-part="panes"]{
display:grid;grid-template-columns:8.5rem 1fr;gap:0.4rem;
border:1px solid var(--vibeui-combobox-013-border);
border-radius:var(--vibeui-combobox-013-radius);
padding:0.3rem;
}
[data-vibeui-block="combobox-013"] [data-part="sections"],
[data-vibeui-block="combobox-013"] [data-part="values"]{
margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.1rem;
max-height:11rem;overflow:auto;
}
[data-vibeui-block="combobox-013"] [data-part="sections"]{
border-right:1px solid var(--vibeui-combobox-013-border);padding-right:0.3rem;
}
[data-vibeui-block="combobox-013"] [data-part="section"],
[data-vibeui-block="combobox-013"] [data-part="value"]{
appearance:none;cursor:pointer;font:inherit;width:100%;
display:flex;align-items:center;justify-content:space-between;gap:0.35rem;
box-sizing:border-box;padding:0.4rem 0.5rem;
border:0;border-radius:0.45rem;background:transparent;color:inherit;
font-size:0.8125rem;text-align:left;
transition:background-color .16s ease;
}
[data-vibeui-block="combobox-013"] [data-part="section"]:hover,
[data-vibeui-block="combobox-013"] [data-part="value"]:hover{background:var(--vibeui-combobox-013-soft)}
[data-vibeui-block="combobox-013"] [data-part="section"]:focus-visible,
[data-vibeui-block="combobox-013"] [data-part="value"]:focus-visible{
outline:2px solid var(--vibeui-combobox-013-accent);outline-offset:-2px;
}
[data-vibeui-block="combobox-013"] [data-part="section"][aria-pressed="true"]{
background:var(--vibeui-combobox-013-accentsoft);font-weight:600;
}
[data-vibeui-block="combobox-013"] [data-part="value"][aria-selected="true"]{
background:var(--vibeui-combobox-013-accent);color:var(--vibeui-combobox-013-bg);font-weight:600;
}
[data-vibeui-block="combobox-013"] [data-part="count"]{
flex:none;font-size:0.7rem;color:var(--vibeui-combobox-013-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="combobox-013"] [data-part="section"][aria-pressed="true"] [data-part="count"]{color:inherit}
[data-vibeui-block="combobox-013"] [data-part="where"]{
flex:none;font-size:0.68rem;color:var(--vibeui-combobox-013-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:7rem;
}
[data-vibeui-block="combobox-013"] [data-part="value"][aria-selected="true"] [data-part="where"]{color:inherit}
[data-vibeui-block="combobox-013"] [data-part="empty"]{
margin:0;padding:0.6rem 0.5rem;font-size:0.8125rem;color:var(--vibeui-combobox-013-muted);
}
[data-vibeui-block="combobox-013"] [data-part="foot"]{
margin:0;font-size:0.78rem;color:var(--vibeui-combobox-013-muted);
}
[data-vibeui-block="combobox-013"] [data-part="foot"] b{color:var(--vibeui-combobox-013-fg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-013"] *{animation:none!important;transition:none!important}}
`

const CATALOG: Combobox013Section[] = [
  {
    title: "Бухгалтерия",
    items: [
      "Акт сверки",
      "Счёт на оплату",
      "Товарная накладная",
      "Авансовый отчёт",
    ],
  },
  {
    title: "Кадры",
    items: ["Заявление на отпуск", "Трудовой договор", "Приказ о переводе"],
  },
  {
    title: "Закупки",
    items: ["Заявка на закупку", "Спецификация", "Протокол выбора поставщика"],
  },
  {
    title: "Юристы",
    items: ["Доверенность", "Претензия", "Соглашение о неразглашении"],
  },
]

/**
 * Выбор по иерархии «раздел → значение» с двумя колонками и сквозным поиском.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Combobox013({
  label = "Тип документа",
  placeholder = "Поиск по всем разделам",
  sections = CATALOG,
  defaultValue = "Акт сверки",
  onSelect,
  accent,
  className,
  style,
  ...props
}: Combobox013Props) {
  const id = useId()
  const [query, setQuery] = useState("")
  const [section, setSection] = useState(sections[0]?.title ?? "")
  const [value, setValue] = useState(defaultValue)

  const searching = query.trim().length > 0

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()

    if (!needle) {
      const current = sections.find((entry) => entry.title === section)

      return (current?.items ?? []).map((item) => ({
        item,
        section: current?.title ?? "",
      }))
    }

    return sections.flatMap((entry) =>
      entry.items
        .filter((item) => item.toLowerCase().includes(needle))
        .map((item) => ({ item, section: entry.title })),
    )
  }, [query, section, sections])

  const commit = (item: string, from: string) => {
    setValue(item)
    setSection(from)
    setQuery("")
    onSelect?.(item, from)
  }

  const palette = {
    ...(accent ? { "--vibeui-combobox-013-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-combobox-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="combobox-013"
        className={className}
        style={palette}
      >
        <label htmlFor={`${id}-input`}>{label}</label>
        <input
          id={`${id}-input`}
          type="text"
          role="combobox"
          autoComplete="off"
          placeholder={placeholder}
          aria-expanded="true"
          aria-controls={`${id}-values`}
          aria-autocomplete="list"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div data-part="panes">
          <ul data-part="sections" aria-label="Разделы" hidden={searching}>
            {sections.map((entry) => (
              <li key={entry.title}>
                <button
                  type="button"
                  data-part="section"
                  aria-pressed={entry.title === section}
                  onClick={() => setSection(entry.title)}
                >
                  <span>{entry.title}</span>
                  <span data-part="count">{entry.items.length}</span>
                </button>
              </li>
            ))}
          </ul>
          <ul
            id={`${id}-values`}
            role="listbox"
            aria-label={searching ? "Совпадения" : section}
            data-part="values"
          >
            {matches.length === 0 ? (
              <li role="none">
                <p data-part="empty">Ничего не нашлось</p>
              </li>
            ) : (
              matches.map((match) => (
                <li key={`${match.section}-${match.item}`} role="none">
                  <button
                    type="button"
                    role="option"
                    data-part="value"
                    aria-selected={match.item === value}
                    onClick={() => commit(match.item, match.section)}
                  >
                    <span>{match.item}</span>
                    {searching ? (
                      <span data-part="where">{match.section}</span>
                    ) : null}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
        <p data-part="foot" aria-live="polite">
          Выбрано: <b>{value || "ничего"}</b>
          {value ? ` · ${section}` : ""}
        </p>
      </div>
    </>
  )
}
