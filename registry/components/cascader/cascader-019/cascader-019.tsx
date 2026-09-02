"use client"

import { useId, useMemo, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Cascader019Entry = {
  code: string
  name: string
  /** Путь по классификатору сверху вниз, без самого элемента. */
  path: string[]
}

export type Cascader019Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  entries?: Cascader019Entry[]
  defaultCode?: string
  /** Подсказка под полем: правило поиска нельзя оставлять неявным. */
  hintText?: string
  /** Строка вместо списка, когда ничего не нашлось. */
  emptyText?: string
  /** Итог, {code} — код, {name} — название. */
  pickedText?: string
  /** Итог, пока код не выбран. */
  pickedEmptyText?: string
  onSelect?: (code: string, name: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: классификатор — единственный каскадер, где человек чаще
// знает не название, а код: «нам нужен 62.01». Ходить по трём уровням ради
// известного кода бессмысленно, поэтому здесь поиск принимает и код, и
// название, а найденную строку возвращает вместе с её путём — иерархия
// не исчезает, а показывается результатом.
const STYLES = `
:where([data-vibeui-block="cascader-019"]){
--vibeui-cascader-019-bg:transparent;
--vibeui-cascader-019-fg:light-dark(oklch(0.22 0.014 300),oklch(0.94 0.006 300));
--vibeui-cascader-019-muted:light-dark(oklch(0.55 0.014 300),oklch(0.71 0.012 300));
--vibeui-cascader-019-border:light-dark(oklch(0.9 0.008 300),oklch(0.35 0.012 300));
--vibeui-cascader-019-field:light-dark(oklch(0.985 0.004 300),oklch(0.27 0.012 300));
--vibeui-cascader-019-soft:light-dark(oklch(0.965 0.006 300),oklch(0.29 0.012 300));
--vibeui-cascader-019-accent:light-dark(oklch(0.5 0.13 300),oklch(0.77 0.13 300));
--vibeui-cascader-019-accentsoft:light-dark(oklch(0.94 0.04 300),oklch(0.33 0.05 300));
--vibeui-cascader-019-radius:0.625rem;
--vibeui-cascader-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-cascader-019-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
[data-vibeui-block="cascader-019"]{
display:flex;flex-direction:column;gap:0.45rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-cascader-019-bg);
border:1px solid var(--vibeui-cascader-019-border);
border-radius:calc(var(--vibeui-cascader-019-radius) + 0.25rem);
color:var(--vibeui-cascader-019-fg);
font-family:var(--vibeui-cascader-019-font);
}
[data-vibeui-block="cascader-019"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="cascader-019"] input{
box-sizing:border-box;width:100%;height:2.4rem;padding:0 0.6rem;
border:1px solid var(--vibeui-cascader-019-border);
border-radius:var(--vibeui-cascader-019-radius);
background:var(--vibeui-cascader-019-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="cascader-019"] input::placeholder{color:var(--vibeui-cascader-019-muted)}
[data-vibeui-block="cascader-019"] input:focus-visible{
outline:2px solid var(--vibeui-cascader-019-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="cascader-019"] [data-part="hint"]{
margin:0;font-size:0.7rem;color:var(--vibeui-cascader-019-muted);
}
[data-vibeui-block="cascader-019"] [data-part="list"]{
margin:0;padding:0.2rem;list-style:none;display:flex;flex-direction:column;gap:0.1rem;
max-height:13rem;overflow:auto;
border:1px solid var(--vibeui-cascader-019-border);
border-radius:var(--vibeui-cascader-019-radius);
}
[data-vibeui-block="cascader-019"] [data-part="row"]{
appearance:none;cursor:pointer;font:inherit;width:100%;
display:grid;grid-template-columns:3.6rem 1fr;align-items:baseline;gap:0.2rem 0.5rem;
box-sizing:border-box;padding:0.4rem 0.5rem;
border:0;border-radius:0.45rem;background:transparent;color:inherit;text-align:left;
transition:background-color .16s ease;
}
[data-vibeui-block="cascader-019"] [data-part="row"]:hover{background:var(--vibeui-cascader-019-soft)}
[data-vibeui-block="cascader-019"] [data-part="row"]:focus-visible{
outline:2px solid var(--vibeui-cascader-019-accent);outline-offset:-2px;
}
[data-vibeui-block="cascader-019"] [data-part="row"][aria-selected="true"]{
background:var(--vibeui-cascader-019-accentsoft);
}
[data-vibeui-block="cascader-019"] [data-part="code"]{
font-family:var(--vibeui-cascader-019-mono);font-size:0.78rem;font-weight:700;
}
[data-vibeui-block="cascader-019"] [data-part="name"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="cascader-019"] [data-part="trail"]{
grid-column:2;font-size:0.68rem;color:var(--vibeui-cascader-019-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="cascader-019"] [data-part="empty"]{
margin:0;padding:0.5rem;font-size:0.8125rem;color:var(--vibeui-cascader-019-muted);
}
[data-vibeui-block="cascader-019"] [data-part="picked"]{
margin:0;padding:0.5rem 0.65rem;border-radius:var(--vibeui-cascader-019-radius);
background:var(--vibeui-cascader-019-soft);
font-size:0.8125rem;line-height:1.35;
}
[data-vibeui-block="cascader-019"] [data-part="picked"] b{font-family:var(--vibeui-cascader-019-mono)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cascader-019"] *{animation:none!important;transition:none!important}}
`

const CLASSIFIER: Cascader019Entry[] = [
  {
    code: "62.01",
    name: "Разработка компьютерного программного обеспечения",
    path: ["J Информация и связь", "62 Разработка ПО и консультирование"],
  },
  {
    code: "62.02",
    name: "Консультирование в области компьютерных технологий",
    path: ["J Информация и связь", "62 Разработка ПО и консультирование"],
  },
  {
    code: "62.09",
    name: "Прочие услуги в области информационных технологий",
    path: ["J Информация и связь", "62 Разработка ПО и консультирование"],
  },
  {
    code: "63.11",
    name: "Обработка данных и размещение информации",
    path: ["J Информация и связь", "63 Деятельность в области информации"],
  },
  {
    code: "47.91",
    name: "Розничная торговля по почте и через интернет",
    path: ["G Торговля", "47 Розничная торговля"],
  },
  {
    code: "47.99",
    name: "Прочая розничная торговля вне магазинов",
    path: ["G Торговля", "47 Розничная торговля"],
  },
  {
    code: "70.22",
    name: "Консультирование по вопросам управления",
    path: ["M Профессиональная деятельность", "70 Управление предприятиями"],
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
 * Выбор кода классификатора: поиск по коду или названию с показом пути.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Cascader019({
  label = "Код деятельности",
  placeholder = "Код или название",
  entries = CLASSIFIER,
  defaultCode = "62.01",
  hintText = "Введите код целиком или его начало — 62, 62.0, 62.01 — либо часть названия",
  emptyText = "Такого кода в классификаторе нет",
  pickedText = "Выбран код {code} — {name}",
  pickedEmptyText = "Код не выбран",
  onSelect,
  background = "",
  accent,
  className,
  style,
  ...props
}: Cascader019Props) {
  const id = useId()
  const [query, setQuery] = useState("")
  const [code, setCode] = useState(defaultCode)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()

    if (!needle) return entries

    // Цифры и точка в запросе означают код: тогда ищем по началу кода,
    // а не по вхождению — «62» не должно приводить строки вроде «47.62».
    const byCode = /^[\d.]+$/.test(needle)

    return entries.filter((entry) =>
      byCode
        ? entry.code.startsWith(needle)
        : entry.name.toLowerCase().includes(needle) ||
          entry.path.join(" ").toLowerCase().includes(needle),
    )
  }, [query, entries])

  const picked = entries.find((entry) => entry.code === code)

  const [pickedBefore, pickedRest = ""] = pickedText.split("{code}")
  const [pickedMiddle, pickedAfter = ""] = pickedRest.split("{name}")

  const palette = {
    ...(accent ? { "--vibeui-cascader-019-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-cascader-019-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cascader-019" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="cascader-019"
        className={className}
        style={palette}
      >
        <label htmlFor={`${id}-input`}>{label}</label>
        <input
          id={`${id}-input`}
          type="text"
          role="combobox"
          inputMode="text"
          autoComplete="off"
          placeholder={placeholder}
          aria-expanded="true"
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-describedby={`${id}-hint`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <p id={`${id}-hint`} data-part="hint">
          {hintText}
        </p>
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          data-part="list"
        >
          {matches.length === 0 ? (
            <li role="none">
              <p data-part="empty">{emptyText}</p>
            </li>
          ) : (
            matches.map((entry) => (
              <li key={entry.code} role="none">
                <button
                  type="button"
                  role="option"
                  data-part="row"
                  aria-selected={entry.code === code}
                  onClick={() => {
                    setCode(entry.code)
                    onSelect?.(entry.code, entry.name)
                  }}
                >
                  <span data-part="code">{entry.code}</span>
                  <span data-part="name">{entry.name}</span>
                  <span data-part="trail">{entry.path.join(" › ")}</span>
                </button>
              </li>
            ))
          )}
        </ul>
        <p data-part="picked" aria-live="polite">
          {picked ? (
            <>
              {pickedBefore}
              <b>{picked.code}</b>
              {pickedMiddle}
              {picked.name}
              {pickedAfter}
            </>
          ) : (
            pickedEmptyText
          )}
        </p>
      </div>
    </>
  )
}
