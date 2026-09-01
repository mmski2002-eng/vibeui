"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Textarea003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  placeholder?: string
  hint?: string
  /** Сколько строк поле занимает, пока пустое. */
  rows?: number
  accent?: string
}

// Идея компонента: поле, которое растёт под текст. Обычный способ —
// измерять scrollHeight и присваивать высоту вручную — даёт дрожание и
// лишний layout на каждом нажатии. Здесь высоту считает сама раскладка:
// обёртка — grid, в той же ячейке лежит невидимая копия текста через
// content:attr(), и textarea просто занимает всю высоту ячейки.
const STYLES = `
:where([data-vibeui-block="textarea-003"]){
--vibeui-textarea-003-bg:oklch(1 0 0);
--vibeui-textarea-003-fg:oklch(0.22 0.014 265);
--vibeui-textarea-003-muted:oklch(0.56 0.014 265);
--vibeui-textarea-003-border:oklch(0.9 0.006 265);
--vibeui-textarea-003-field:oklch(0.985 0.002 265);
--vibeui-textarea-003-accent:oklch(0.55 0.17 265);
--vibeui-textarea-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="textarea-003"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-textarea-003-bg);
border:1px solid var(--vibeui-textarea-003-border);border-radius:0.875rem;
font-family:var(--vibeui-textarea-003-font);color:var(--vibeui-textarea-003-fg);
}
[data-vibeui-block="textarea-003"] label{font-size:0.8125rem;font-weight:600}
/* Обёртка и копия текста: обе занимают одну ячейку grid, поэтому высота
   ячейки всегда равна высоте текста — без измерений и без скачков. */
[data-vibeui-block="textarea-003"] [data-part="grow"]{
display:grid;box-sizing:border-box;
padding:0.5rem 0.75rem;
border:1px solid var(--vibeui-textarea-003-border);border-radius:0.625rem;
background:var(--vibeui-textarea-003-field);
font-size:0.875rem;line-height:1.55;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="textarea-003"] [data-part="grow"]::after{
content:attr(data-value) " ";
grid-area:1 / 1 / 2 / 2;
visibility:hidden;white-space:pre-wrap;word-break:break-word;
font:inherit;
}
[data-vibeui-block="textarea-003"] textarea{
grid-area:1 / 1 / 2 / 2;
box-sizing:border-box;width:100%;
margin:0;padding:0;border:0;background:none;color:inherit;resize:none;overflow:hidden;
font:inherit;
}
[data-vibeui-block="textarea-003"] textarea:focus{outline:none}
[data-vibeui-block="textarea-003"] [data-part="grow"]:focus-within{
border-color:var(--vibeui-textarea-003-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-textarea-003-accent) 20%,transparent);
}
[data-vibeui-block="textarea-003"] [data-part="foot"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;margin:0;
font-size:0.75rem;color:var(--vibeui-textarea-003-muted);
}
[data-vibeui-block="textarea-003"] [data-part="lines"]{font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="textarea-003"] *{animation:none!important;transition:none!important}}
`

const START =
  "Коротко о задаче: что делаем, для кого и к какому сроку.\nПоле растёт вместе с текстом — попробуйте добавить строку."

/**
 * Авторастущее поле: высоту считает grid по копии текста, без measure-хаков.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Textarea003({
  label = "Задача для команды",
  placeholder = "Опишите задачу",
  hint = "Растёт по мере набора",
  rows = 2,
  accent,
  className,
  style,
  ...props
}: Textarea003Props) {
  const id = useId()
  const [value, setValue] = useState(START)

  const palette = {
    ...(accent ? { "--vibeui-textarea-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-textarea-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="textarea-003"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="grow" data-value={value}>
          <textarea
            id={id}
            rows={rows}
            value={value}
            placeholder={placeholder}
            onChange={(event) => setValue(event.target.value)}
          />
        </div>
        <p data-part="foot">
          <span>{hint}</span>
          <span data-part="lines">{value.split("\n").length} стр.</span>
        </p>
      </div>
    </>
  )
}
