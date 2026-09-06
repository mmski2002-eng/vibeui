"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Cascader014Account = {
  code: string
  name: string
  archived?: boolean
  children?: Cascader014Account[]
}

export type Cascader014Props = Omit<
  ComponentProps<"div">,
  "children" | "onSelect"
> & {
  label?: string
  accounts?: Cascader014Account[]
  defaultPath?: string[]
  /** Первая крошка — возврат к корню плана счетов. */
  rootLabel?: string
  /** Подпись списка текущего уровня для скринридера. */
  listLabel?: string
  /** Пометка архивного счёта в строке. */
  archivedText?: string
  /** Строка под списком, {code} — выбранный счёт. */
  chosenText?: string
  /** Строка под списком, пока счёт не выбран. */
  hintText?: string
  onSelect?: (code: string, name: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: в плане счетов человек мыслит кодом — 51.01.02, — и код
// собирается на глазах, сегмент за сегментом. Поэтому наверху стоит строка
// кода, где невыбранные сегменты показаны точками, а выбор возможен только
// на конечном уровне: проводку нельзя повесить на группу счетов.
const STYLES = `
:where([data-vibeui-block="cascader-014"]){
--vibeui-cascader-014-bg:transparent;
--vibeui-cascader-014-fg:light-dark(oklch(0.22 0 250),oklch(0.94 0 250));
--vibeui-cascader-014-muted:color-mix(in oklab,var(--vibeui-cascader-014-fg) 68%,transparent);
--vibeui-cascader-014-faint:light-dark(oklch(0.76 0 250),oklch(0.55 0 250));
--vibeui-cascader-014-border:light-dark(oklch(0.9 0 250),oklch(0.35 0 250));
--vibeui-cascader-014-soft:light-dark(oklch(0.965 0 250),oklch(0.28 0 250));
--vibeui-cascader-014-accent:light-dark(oklch(0.48 0.12 39.8),oklch(0.76 0.13 39.8));
--vibeui-cascader-014-accentsoft:light-dark(oklch(0.94 0.04 39.8),oklch(0.34 0.055 39.8));
--vibeui-cascader-014-radius:0.625rem;
--vibeui-cascader-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-cascader-014-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cascader-014"]{color-scheme:dark}
[data-vibeui-block="cascader-014"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-cascader-014-bg);
border:1px solid var(--vibeui-cascader-014-border);
border-radius:calc(var(--vibeui-cascader-014-radius) + 0.25rem);
color:var(--vibeui-cascader-014-fg);
font-family:var(--vibeui-cascader-014-font);
}
[data-vibeui-block="cascader-014"] [data-part="title"]{
margin:0;font-size:0.875rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="cascader-014"] [data-part="code"]{
margin:0;padding:0.4375rem 0.625rem;border-radius:var(--vibeui-cascader-014-radius);
background:var(--vibeui-cascader-014-accentsoft);
font-family:var(--vibeui-cascader-014-mono);font-size:1.0625rem;font-weight:700;letter-spacing:0.04em;
}
[data-vibeui-block="cascader-014"] [data-part="code"] i{font-style:normal;color:var(--vibeui-cascader-014-faint)}
[data-vibeui-block="cascader-014"] [data-part="crumbs"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.1875rem;margin:0;padding:0;list-style:none;
font-size:0.75rem;
}
[data-vibeui-block="cascader-014"] [data-part="crumb"]{
appearance:none;cursor:pointer;font:inherit;
padding:0.125rem 0.375rem;border-radius:0.375rem;
border:0;background:var(--vibeui-cascader-014-soft);color:var(--vibeui-cascader-014-muted);
}
[data-vibeui-block="cascader-014"] [data-part="crumb"]:hover{color:var(--vibeui-cascader-014-fg)}
[data-vibeui-block="cascader-014"] [data-part="crumb"]:focus-visible{
outline:2px solid var(--vibeui-cascader-014-accent);outline-offset:1px;
}
[data-vibeui-block="cascader-014"] [data-part="list"]{
margin:0;padding:0.1875rem;list-style:none;display:flex;flex-direction:column;gap:0.125rem;
max-height:12rem;overflow:auto;
border:1px solid var(--vibeui-cascader-014-border);
border-radius:var(--vibeui-cascader-014-radius);
}
[data-vibeui-block="cascader-014"] [data-part="row"]{
appearance:none;cursor:pointer;font:inherit;width:100%;
display:grid;grid-template-columns:3.375rem 1fr auto;align-items:center;gap:0.375rem;
box-sizing:border-box;padding:0.375rem 0.5rem;
border:0;border-radius:0.4375rem;background:transparent;color:inherit;text-align:left;
transition:background-color .16s ease;
}
[data-vibeui-block="cascader-014"] [data-part="row"]:hover:not(:disabled){background:var(--vibeui-cascader-014-soft)}
[data-vibeui-block="cascader-014"] [data-part="row"]:focus-visible{
outline:2px solid var(--vibeui-cascader-014-accent);outline-offset:-2px;
}
[data-vibeui-block="cascader-014"] [data-part="row"]:disabled{cursor:not-allowed;color:var(--vibeui-cascader-014-faint)}
[data-vibeui-block="cascader-014"] [data-part="row"][aria-current="true"]{
background:var(--vibeui-cascader-014-accentsoft);font-weight:600;
}
[data-vibeui-block="cascader-014"] [data-part="num"]{
font-family:var(--vibeui-cascader-014-mono);font-size:0.8125rem;font-weight:700;
}
[data-vibeui-block="cascader-014"] [data-part="name"]{
min-width:0;font-size:0.8125rem;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="cascader-014"] [data-part="more"]{color:var(--vibeui-cascader-014-muted);font-size:0.8125rem}
[data-vibeui-block="cascader-014"] [data-part="note"]{
margin:0;font-size:0.8125rem;color:var(--vibeui-cascader-014-muted);
}
[data-vibeui-block="cascader-014"] [data-part="note"] b{color:var(--vibeui-cascader-014-fg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cascader-014"] *{animation:none!important;transition:none!important}}
`

const PLAN: Cascader014Account[] = [
  {
    code: "50",
    name: "Касса",
    children: [
      {
        code: "01",
        name: "Касса организации",
        children: [
          { code: "01", name: "Основная касса" },
          { code: "02", name: "Касса магазина" },
        ],
      },
      {
        code: "03",
        name: "Денежные документы",
        children: [{ code: "01", name: "Марки и бланки" }],
      },
    ],
  },
  {
    code: "51",
    name: "Расчётные счета",
    children: [
      {
        code: "01",
        name: "Рублёвые счета",
        children: [
          { code: "01", name: "Основной счёт" },
          { code: "02", name: "Счёт для налогов" },
          { code: "09", name: "Закрытый счёт", archived: true },
        ],
      },
      {
        code: "02",
        name: "Специальные счета",
        children: [{ code: "01", name: "Эскроу по договору" }],
      },
    ],
  },
  {
    code: "62",
    name: "Расчёты с покупателями",
    children: [
      {
        code: "01",
        name: "Расчёты в рублях",
        children: [
          { code: "01", name: "Оптовые покупатели" },
          { code: "02", name: "Розница" },
        ],
      },
    ],
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
 * Выбор счёта в плане счетов: код собирается сегмент за сегментом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Cascader014({
  label = "Счёт учёта",
  accounts = PLAN,
  defaultPath = ["51", "01"],
  rootLabel = "План счетов",
  listLabel = "Счета уровня",
  archivedText = " · архив",
  chosenText = "Выбран счёт {code}",
  hintText = "Выбрать можно только конечный субсчёт",
  onSelect,
  background = "",
  accent,
  className,
  style,
  ...props
}: Cascader014Props) {
  const [path, setPath] = useState(defaultPath)
  const [chosen, setChosen] = useState("")

  const trail: Cascader014Account[] = []
  let level = accounts

  for (const code of path) {
    const node = level.find((entry) => entry.code === code)

    if (!node) break

    trail.push(node)
    level = node.children ?? []
  }

  const segments = [path[0] ?? "", path[1] ?? "", chosen.split(".")[2] ?? ""]

  const [chosenBefore, chosenAfter] = chosenText.split("{code}")

  const palette = {
    ...(accent ? { "--vibeui-cascader-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-cascader-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cascader-014" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="cascader"
        data-vibeui-block="cascader-014"
        className={className}
        style={palette}
      >
        <h3 data-part="title">{label}</h3>
        <p data-part="code" aria-live="polite">
          {segments.map((segment, index) => (
            <span key={index}>
              {index > 0 ? "." : ""}
              {segment ? segment : <i>··</i>}
            </span>
          ))}
        </p>
        <ul data-part="crumbs">
          <li>
            <button
              type="button"
              data-part="crumb"
              onClick={() => {
                setPath([])
                setChosen("")
              }}
            >
              {rootLabel}
            </button>
          </li>
          {trail.map((node, index) => (
            <li key={node.code}>
              <span aria-hidden="true">›</span>{" "}
              <button
                type="button"
                data-part="crumb"
                onClick={() => {
                  setPath(path.slice(0, index + 1))
                  setChosen("")
                }}
              >
                {node.code} {node.name}
              </button>
            </li>
          ))}
        </ul>
        <ul data-part="list" aria-label={listLabel}>
          {level.map((node) => {
            const branch = Boolean(node.children?.length)
            const full = [...path, node.code].join(".")

            return (
              <li key={node.code}>
                <button
                  type="button"
                  data-part="row"
                  disabled={node.archived}
                  aria-current={!branch && chosen === full}
                  onClick={() => {
                    if (branch) {
                      setPath([...path, node.code])
                      setChosen("")

                      return
                    }

                    setChosen(full)
                    onSelect?.(full, node.name)
                  }}
                >
                  <span data-part="num">{node.code}</span>
                  <span data-part="name">
                    {node.name}
                    {node.archived ? archivedText : ""}
                  </span>
                  <span data-part="more" aria-hidden="true">
                    {branch ? "›" : "•"}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        <p data-part="note">
          {chosen ? (
            <>
              {chosenBefore}
              <b>{chosen}</b>
              {chosenAfter}
            </>
          ) : (
            hintText
          )}
        </p>
      </div>
    </>
  )
}
