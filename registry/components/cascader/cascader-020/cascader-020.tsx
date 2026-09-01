"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Cascader020Node = { name: string; children?: Cascader020Node[] }

export type Cascader020Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSelect"
> & {
  label?: string
  tree?: Cascader020Node[]
  defaultPath?: string[]
  separator?: string
  onSelect?: (path: string[]) => void
  accent?: string
}

// Идея компонента: каскадер, который после выбора показывает в поле только
// последний уровень, врёт: «Игровые» без «Ноутбуки» ничего не значит.
// Поэтому здесь в поле лежит весь путь, а когда он не помещается — обрезается
// слева, а не справа: у пути значим хвост. Обрезку делает CSS через
// direction:rtl, поэтому она подстраивается под реальную ширину поля,
// а не считается по символам.
const STYLES = `
:where([data-vibeui-block="cascader-020"]){
--vibeui-cascader-020-bg:oklch(1 0 0);
--vibeui-cascader-020-fg:oklch(0.22 0.014 20);
--vibeui-cascader-020-muted:oklch(0.55 0.014 20);
--vibeui-cascader-020-border:oklch(0.9 0.008 20);
--vibeui-cascader-020-field:oklch(0.985 0.004 20);
--vibeui-cascader-020-soft:oklch(0.965 0.008 20);
--vibeui-cascader-020-accent:oklch(0.53 0.14 20);
--vibeui-cascader-020-accentsoft:oklch(0.95 0.04 20);
--vibeui-cascader-020-radius:0.625rem;
--vibeui-cascader-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="cascader-020"]{
display:flex;flex-direction:column;gap:0.4rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-cascader-020-bg);
border:1px solid var(--vibeui-cascader-020-border);
border-radius:calc(var(--vibeui-cascader-020-radius) + 0.25rem);
color:var(--vibeui-cascader-020-fg);
font-family:var(--vibeui-cascader-020-font);
}
[data-vibeui-block="cascader-020"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="cascader-020"] [data-part="field"]{
appearance:none;cursor:pointer;font:inherit;width:100%;
display:flex;align-items:center;gap:0.4rem;
box-sizing:border-box;min-height:2.5rem;padding:0.35rem 0.6rem;
border:1px solid var(--vibeui-cascader-020-border);
border-radius:var(--vibeui-cascader-020-radius);
background:var(--vibeui-cascader-020-field);color:inherit;text-align:left;
transition:border-color .16s ease;
}
[data-vibeui-block="cascader-020"] [data-part="field"]:hover{border-color:var(--vibeui-cascader-020-accent)}
[data-vibeui-block="cascader-020"] [data-part="field"]:focus-visible{
outline:2px solid var(--vibeui-cascader-020-accent);outline-offset:1px;border-color:transparent;
}
/* Обрезка пути слева: направление письма меняется только у контейнера
   строки, а сам текст остаётся в естественном порядке из-за plaintext. */
[data-vibeui-block="cascader-020"] [data-part="pathtext"]{
flex:1 1 auto;min-width:0;
direction:rtl;unicode-bidi:plaintext;text-align:left;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
font-size:0.85rem;font-weight:600;
}
[data-vibeui-block="cascader-020"] [data-part="pathtext"][data-empty="true"]{
font-weight:500;color:var(--vibeui-cascader-020-muted);
}
[data-vibeui-block="cascader-020"] [data-part="chevron"]{
flex:none;color:var(--vibeui-cascader-020-muted);font-size:0.8rem;
}
[data-vibeui-block="cascader-020"] [data-part="panel"]{
display:flex;flex-direction:column;gap:0.3rem;
padding:0.35rem;
border:1px solid var(--vibeui-cascader-020-border);
border-radius:var(--vibeui-cascader-020-radius);
}
[data-vibeui-block="cascader-020"] [data-part="back"]{
appearance:none;cursor:pointer;font:inherit;align-self:flex-start;
padding:0.2rem 0.5rem;border:0;border-radius:0.4rem;
background:var(--vibeui-cascader-020-soft);color:var(--vibeui-cascader-020-muted);
font-size:0.72rem;font-weight:600;
}
[data-vibeui-block="cascader-020"] [data-part="back"]:focus-visible,
[data-vibeui-block="cascader-020"] [data-part="node"]:focus-visible{
outline:2px solid var(--vibeui-cascader-020-accent);outline-offset:-2px;
}
[data-vibeui-block="cascader-020"] ul{
margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.1rem;
max-height:11rem;overflow:auto;
}
[data-vibeui-block="cascader-020"] [data-part="node"]{
appearance:none;cursor:pointer;font:inherit;width:100%;
display:flex;align-items:center;justify-content:space-between;gap:0.4rem;
box-sizing:border-box;padding:0.4rem 0.5rem;
border:0;border-radius:0.4rem;background:transparent;color:inherit;text-align:left;
font-size:0.8125rem;
transition:background-color .16s ease;
}
[data-vibeui-block="cascader-020"] [data-part="node"]:hover{background:var(--vibeui-cascader-020-soft)}
[data-vibeui-block="cascader-020"] [data-part="node"][aria-current="true"]{
background:var(--vibeui-cascader-020-accentsoft);font-weight:600;
}
[data-vibeui-block="cascader-020"] [data-part="hint"]{
margin:0;font-size:0.72rem;color:var(--vibeui-cascader-020-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cascader-020"] *{animation:none!important;transition:none!important}}
`

const CATALOG: Cascader020Node[] = [
  {
    name: "Электроника",
    children: [
      {
        name: "Ноутбуки и компьютеры",
        children: [
          { name: "Игровые ноутбуки" },
          { name: "Ультрабуки" },
          { name: "Моноблоки" },
        ],
      },
      {
        name: "Аудиотехника",
        children: [{ name: "Наушники" }, { name: "Колонки" }],
      },
    ],
  },
  {
    name: "Дом и сад",
    children: [
      {
        name: "Кухонная техника",
        children: [{ name: "Кофемашины" }, { name: "Блендеры" }],
      },
      { name: "Инструменты", children: [{ name: "Шуруповёрты" }] },
    ],
  },
]

/**
 * Каскадер, показывающий в поле весь путь и обрезающий его слева.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Cascader020({
  label = "Категория товара",
  tree = CATALOG,
  defaultPath = ["Электроника", "Ноутбуки и компьютеры", "Игровые ноутбуки"],
  separator = " / ",
  onSelect,
  accent,
  className,
  style,
  ...props
}: Cascader020Props) {
  const id = useId()
  const [path, setPath] = useState(defaultPath)
  const [open, setOpen] = useState(true)
  const [cursor, setCursor] = useState<string[]>([])

  let level = tree

  for (const name of cursor) {
    level = level.find((entry) => entry.name === name)?.children ?? []
  }

  const full = path.join(separator)

  const palette = {
    ...(accent ? { "--vibeui-cascader-020-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cascader-020" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="cascader-020"
        className={className}
        style={palette}
      >
        <span id={`${id}-label`} data-part="label">
          {label}
        </span>
        <button
          type="button"
          data-part="field"
          aria-labelledby={`${id}-label`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          title={full || undefined}
          onClick={() => setOpen(!open)}
        >
          <span data-part="pathtext" data-empty={path.length === 0}>
            {full || "Категория не выбрана"}
          </span>
          <span data-part="chevron" aria-hidden="true">
            {open ? "▴" : "▾"}
          </span>
        </button>
        {open ? (
          <div id={`${id}-panel`} data-part="panel">
            {cursor.length > 0 ? (
              <button
                type="button"
                data-part="back"
                onClick={() => setCursor(cursor.slice(0, -1))}
              >
                ← {cursor[cursor.length - 1]}
              </button>
            ) : null}
            <ul aria-label={`Уровень ${cursor.length + 1}`}>
              {level.map((node) => {
                const branch = Boolean(node.children?.length)
                const next = [...cursor, node.name]

                return (
                  <li key={node.name}>
                    <button
                      type="button"
                      data-part="node"
                      aria-current={
                        !branch && path.join(separator) === next.join(separator)
                      }
                      onClick={() => {
                        if (branch) {
                          setCursor(next)

                          return
                        }

                        setPath(next)
                        setOpen(false)
                        onSelect?.(next)
                      }}
                    >
                      <span>{node.name}</span>
                      <span aria-hidden="true">{branch ? "›" : "•"}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null}
        <p data-part="hint">
          В поле остаётся весь путь: длинный обрезается слева, начало прячется,
          последний уровень виден всегда
        </p>
      </div>
    </>
  )
}
