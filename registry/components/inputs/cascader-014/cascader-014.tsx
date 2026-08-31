"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Cascader014Account = {
  code: string
  name: string
  archived?: boolean
  children?: Cascader014Account[]
}

export type Cascader014Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSelect"
> & {
  label?: string
  accounts?: Cascader014Account[]
  defaultPath?: string[]
  onSelect?: (code: string, name: string) => void
  accent?: string
}

// Идея компонента: в плане счетов человек мыслит кодом — 51.01.02, — и код
// собирается на глазах, сегмент за сегментом. Поэтому наверху стоит строка
// кода, где невыбранные сегменты показаны точками, а выбор возможен только
// на конечном уровне: проводку нельзя повесить на группу счетов.
const STYLES = `
:where([data-vibeui-block="cascader-014"]){
--vibeui-cascader-014-bg:oklch(1 0 0);
--vibeui-cascader-014-fg:oklch(0.22 0.014 250);
--vibeui-cascader-014-muted:oklch(0.55 0.014 250);
--vibeui-cascader-014-faint:oklch(0.76 0.01 250);
--vibeui-cascader-014-border:oklch(0.9 0.008 250);
--vibeui-cascader-014-soft:oklch(0.965 0.006 250);
--vibeui-cascader-014-accent:oklch(0.48 0.12 250);
--vibeui-cascader-014-accentsoft:oklch(0.94 0.04 250);
--vibeui-cascader-014-radius:0.625rem;
--vibeui-cascader-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-cascader-014-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
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
margin:0;padding:0.45rem 0.6rem;border-radius:var(--vibeui-cascader-014-radius);
background:var(--vibeui-cascader-014-accentsoft);
font-family:var(--vibeui-cascader-014-mono);font-size:1.05rem;font-weight:700;letter-spacing:0.04em;
}
[data-vibeui-block="cascader-014"] [data-part="code"] i{font-style:normal;color:var(--vibeui-cascader-014-faint)}
[data-vibeui-block="cascader-014"] [data-part="crumbs"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.2rem;margin:0;padding:0;list-style:none;
font-size:0.75rem;
}
[data-vibeui-block="cascader-014"] [data-part="crumb"]{
appearance:none;cursor:pointer;font:inherit;
padding:0.15rem 0.4rem;border-radius:0.35rem;
border:0;background:var(--vibeui-cascader-014-soft);color:var(--vibeui-cascader-014-muted);
}
[data-vibeui-block="cascader-014"] [data-part="crumb"]:hover{color:var(--vibeui-cascader-014-fg)}
[data-vibeui-block="cascader-014"] [data-part="crumb"]:focus-visible{
outline:2px solid var(--vibeui-cascader-014-accent);outline-offset:1px;
}
[data-vibeui-block="cascader-014"] [data-part="list"]{
margin:0;padding:0.2rem;list-style:none;display:flex;flex-direction:column;gap:0.1rem;
max-height:12rem;overflow:auto;
border:1px solid var(--vibeui-cascader-014-border);
border-radius:var(--vibeui-cascader-014-radius);
}
[data-vibeui-block="cascader-014"] [data-part="row"]{
appearance:none;cursor:pointer;font:inherit;width:100%;
display:grid;grid-template-columns:3.4rem 1fr auto;align-items:center;gap:0.4rem;
box-sizing:border-box;padding:0.4rem 0.5rem;
border:0;border-radius:0.45rem;background:transparent;color:inherit;text-align:left;
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
font-family:var(--vibeui-cascader-014-mono);font-size:0.78rem;font-weight:700;
}
[data-vibeui-block="cascader-014"] [data-part="name"]{
min-width:0;font-size:0.8125rem;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="cascader-014"] [data-part="more"]{color:var(--vibeui-cascader-014-muted);font-size:0.8rem}
[data-vibeui-block="cascader-014"] [data-part="note"]{
margin:0;font-size:0.78rem;color:var(--vibeui-cascader-014-muted);
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
 * Выбор счёта в плане счетов: код собирается сегмент за сегментом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Cascader014({
  label = "Счёт учёта",
  accounts = PLAN,
  defaultPath = ["51", "01"],
  onSelect,
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

  const palette = {
    ...(accent ? { "--vibeui-cascader-014-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cascader-014" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
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
              План счетов
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
        <ul data-part="list" aria-label="Счета уровня">
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
                    {node.archived ? " · архив" : ""}
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
              Выбран счёт <b>{chosen}</b>
            </>
          ) : (
            "Выбрать можно только конечный субсчёт"
          )}
        </p>
      </div>
    </>
  )
}
