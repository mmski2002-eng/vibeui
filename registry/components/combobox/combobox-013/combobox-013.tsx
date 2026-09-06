"use client"

import { useId, useMemo, useRef, useState } from "react"
import type { CSSProperties, ComponentProps, KeyboardEvent } from "react"

export type Combobox013Section = { title: string; items: string[] }

export type Combobox013Props = Omit<
  ComponentProps<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  sections?: Combobox013Section[]
  defaultValue?: string
  onSelect?: (value: string, section: string) => void
  /** Заголовок левой колонки для скринридера. */
  sectionsLabel?: string
  /** Заголовок правой колонки, когда идёт поиск. */
  matchesLabel?: string
  /** Строка на месте пустого списка совпадений. */
  emptyText?: string
  /** Подпись строки итога перед выбранным значением. */
  summaryLabel?: string
  /** Что стоит в итоге, пока ничего не выбрано. */
  emptyValueText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: в длинном справочнике человек чаще помнит раздел, а не
// точное название. Поэтому список разложен на две колонки: слева разделы,
// справа значения выбранного раздела. Поиск при этом остаётся сквозным —
// как только в поле появляется текст, колонки схлопываются в один список
// совпадений с подписью раздела у каждой строки.
const STYLES = `
:where([data-vibeui-block="combobox-013"]){
--vibeui-combobox-013-bg:transparent;
--vibeui-combobox-013-fg:light-dark(oklch(0.22 0 250),oklch(0.94 0 250));
--vibeui-combobox-013-muted:color-mix(in oklab,var(--vibeui-combobox-013-fg) 68%,transparent);
--vibeui-combobox-013-border:light-dark(oklch(0.9 0 250),oklch(0.35 0 250));
--vibeui-combobox-013-field:light-dark(oklch(0.985 0 250),oklch(0.27 0 250));
--vibeui-combobox-013-soft:light-dark(oklch(0.96 0 250),oklch(0.31 0 250));
--vibeui-combobox-013-accent:light-dark(oklch(0.5 0.13 250),oklch(0.72 0.13 250));
--vibeui-combobox-013-accentsoft:light-dark(oklch(0.94 0.04 250),oklch(0.36 0.06 250));
--vibeui-combobox-013-onaccent:light-dark(oklch(0.99 0 0),oklch(0.19 0 250));
--vibeui-combobox-013-radius:0.625rem;
--vibeui-combobox-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="combobox-013"]{color-scheme:dark}
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
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
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
font-size:0.875rem;text-align:left;
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
background:var(--vibeui-combobox-013-accent);color:var(--vibeui-combobox-013-onaccent);font-weight:600;
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
 * Выбор по иерархии «раздел → значение» с двумя колонками и сквозным поиском.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Combobox013({
  label = "Тип документа",
  placeholder = "Поиск по всем разделам",
  sections = CATALOG,
  defaultValue = "Акт сверки",
  onSelect,
  sectionsLabel = "Разделы",
  matchesLabel = "Совпадения",
  emptyText = "Ничего не нашлось",
  summaryLabel = "Выбрано",
  emptyValueText = "ничего",
  background = "",
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

  const rootRef = useRef<HTMLDivElement | null>(null)

  // Список открыт всегда, поэтому стрелки водят по нему настоящим фокусом:
  // варианты — обычные кнопки, и без клавиатуры роль listbox обещает
  // скринридеру навигацию, которой нет.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const options = Array.from(
      rootRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ??
        [],
    )

    if (options.length === 0) {
      return
    }

    const current = options.indexOf(document.activeElement as HTMLButtonElement)

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      const step = event.key === "ArrowDown" ? 1 : -1
      const next =
        current === -1 ? 0 : (current + step + options.length) % options.length
      options[next].focus()
    } else if (
      current !== -1 &&
      (event.key === "Home" || event.key === "End")
    ) {
      event.preventDefault()
      options[event.key === "Home" ? 0 : options.length - 1].focus()
    } else if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
      rootRef.current
        ?.querySelector<HTMLInputElement>('[role="combobox"]')
        ?.focus()
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-combobox-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-combobox-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-combobox-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={rootRef}
        onKeyDown={handleKeyDown}
        data-slot="combobox"
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
          <ul
            data-part="sections"
            aria-label={sectionsLabel}
            hidden={searching}
          >
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
            aria-label={searching ? matchesLabel : section}
            data-part="values"
          >
            {matches.length === 0 ? (
              <li role="none">
                <p data-part="empty">{emptyText}</p>
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
          {summaryLabel}: <b>{value || emptyValueText}</b>
          {value ? ` · ${section}` : ""}
        </p>
      </div>
    </>
  )
}
