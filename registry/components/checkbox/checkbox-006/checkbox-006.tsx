"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Checkbox006Row = {
  id: string
  name: string
  meta: string
}

export type Checkbox006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  rows?: Checkbox006Row[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  accent?: string
}

// Идея компонента: выбор строк таблицы с полосой действий. Полоса появляется
// только когда что-то выбрано и говорит числом, сколько именно: «применить к
// выбранным» без числа — самый частый способ удалить не то. Заголовочный
// чекбокс отмечает страницу, а не всю базу, и об этом сказано словами.
const STYLES = `
:where([data-vibeui-block="checkbox-006"]){
--vibeui-checkbox-006-bg:oklch(1 0 0);
--vibeui-checkbox-006-fg:oklch(0.22 0.014 265);
--vibeui-checkbox-006-muted:oklch(0.56 0.014 265);
--vibeui-checkbox-006-border:oklch(0.9 0.006 265);
--vibeui-checkbox-006-row:oklch(0.97 0.004 265);
--vibeui-checkbox-006-accent:oklch(0.55 0.17 265);
--vibeui-checkbox-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="checkbox-006"]{
display:flex;flex-direction:column;
width:100%;max-width:22rem;box-sizing:border-box;overflow:hidden;
background:var(--vibeui-checkbox-006-bg);
border:1px solid var(--vibeui-checkbox-006-border);border-radius:0.875rem;
font-family:var(--vibeui-checkbox-006-font);color:var(--vibeui-checkbox-006-fg);
}
/* Полоса действий появляется только с выбором и всегда называет число. */
[data-vibeui-block="checkbox-006"] [data-part="bar"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.5rem 0.75rem;
background:color-mix(in oklab,var(--vibeui-checkbox-006-accent) 10%,oklch(1 0 0));
border-bottom:1px solid var(--vibeui-checkbox-006-border);
font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="checkbox-006"] [data-part="bar"] button{
appearance:none;border:0;background:transparent;cursor:pointer;padding:0;
color:var(--vibeui-checkbox-006-accent);font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="checkbox-006"] [data-part="head"],
[data-vibeui-block="checkbox-006"] [data-part="row"]{
display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:0.625rem;
padding:0.5rem 0.75rem;border-bottom:1px solid var(--vibeui-checkbox-006-border);
font-size:0.8125rem;
}
[data-vibeui-block="checkbox-006"] [data-part="row"]:last-child{border-bottom:0}
[data-vibeui-block="checkbox-006"] [data-part="row"]:has(input:checked){background:var(--vibeui-checkbox-006-row)}
[data-vibeui-block="checkbox-006"] [data-part="head"]{color:var(--vibeui-checkbox-006-muted);font-size:0.75rem}
[data-vibeui-block="checkbox-006"] input{
appearance:none;flex:none;cursor:pointer;position:relative;
width:1.0625rem;height:1.0625rem;margin:0;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-006-border);border-radius:0.3125rem;
background:var(--vibeui-checkbox-006-bg);
}
[data-vibeui-block="checkbox-006"] input:checked,
[data-vibeui-block="checkbox-006"] input:indeterminate{border-color:transparent;background:var(--vibeui-checkbox-006-accent)}
[data-vibeui-block="checkbox-006"] input:checked::after{
content:"";position:absolute;left:50%;top:50%;
width:0.25rem;height:0.4375rem;margin:-0.3125rem 0 0 -0.125rem;
border-right:2px solid oklch(0.99 0.01 265);border-bottom:2px solid oklch(0.99 0.01 265);
transform:rotate(45deg);
}
[data-vibeui-block="checkbox-006"] input:indeterminate::after{
content:"";position:absolute;left:50%;top:50%;
width:0.5rem;height:2px;margin:-1px 0 0 -0.25rem;
background:oklch(0.99 0.01 265);border-radius:9999px;
}
[data-vibeui-block="checkbox-006"] input:focus-visible{outline:2px solid var(--vibeui-checkbox-006-accent);outline-offset:2px}
[data-vibeui-block="checkbox-006"] [data-part="name"]{font-weight:600}
[data-vibeui-block="checkbox-006"] [data-part="meta"]{color:var(--vibeui-checkbox-006-muted);font-size:0.75rem;justify-self:end}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Checkbox006Row[] = [
  { id: "1", name: "Акт № 42-118", meta: "12 480 ₽" },
  { id: "2", name: "Акт № 42-119", meta: "8 900 ₽" },
  { id: "3", name: "Счёт № 300", meta: "24 000 ₽" },
  { id: "4", name: "Счёт № 301", meta: "6 200 ₽" },
]

/**
 * Выбор строк таблицы: полоса действий с числом выбранного.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Checkbox006({
  rows = DEFAULT_ROWS,
  defaultValue = [],
  onChange,
  accent,
  className,
  style,
  ...props
}: Checkbox006Props) {
  const [value, setValue] = useState<string[]>(defaultValue)
  const head = useRef<HTMLInputElement>(null)

  const all = value.length === rows.length && rows.length > 0
  const some = value.length > 0 && !all

  useEffect(() => {
    if (head.current) head.current.indeterminate = some
  }, [some])

  const palette = {
    ...(accent ? { "--vibeui-checkbox-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  const update = (next: string[]) => {
    setValue(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-checkbox-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="checkbox-006"
        className={className}
        style={palette}
      >
        {value.length ? (
          <div data-part="bar" role="status">
            <span>Выбрано на странице: {value.length}</span>
            <button type="button" onClick={() => update([])}>
              Снять выбор
            </button>
          </div>
        ) : null}
        <div data-part="head">
          <input
            ref={head}
            type="checkbox"
            checked={all}
            aria-label="Выбрать все строки на странице"
            onChange={() => update(all ? [] : rows.map((row) => row.id))}
          />
          <span>Документ</span>
          <span data-part="meta">Сумма</span>
        </div>
        {rows.map((row) => (
          <label key={row.id} data-part="row">
            <input
              type="checkbox"
              checked={value.includes(row.id)}
              aria-label={`Выбрать ${row.name}`}
              onChange={() =>
                update(
                  value.includes(row.id)
                    ? value.filter((item) => item !== row.id)
                    : [...value, row.id],
                )
              }
            />
            <span data-part="name">{row.name}</span>
            <span data-part="meta">{row.meta}</span>
          </label>
        ))}
      </div>
    </>
  )
}
