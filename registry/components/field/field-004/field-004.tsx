"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Field004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  limit?: number
  defaultValue?: string
  placeholder?: string
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: счётчик, который занимает угол, а не строку. Остаток
// показан кольцом на conic-gradient: доля заполнения читается краем глаза,
// а точное число стоит внутри кольца. Кольцо меняет цвет на последней
// четверти, потому что «осталось 12» и «осталось 120» должны выглядеть
// по-разному ещё до того, как человек прочитает цифру.
const STYLES = `
:where([data-vibeui-block="field-004"]){
--vibeui-field-004-bg:oklch(1 0 0);
--vibeui-field-004-surface:oklch(1 0 0);
--vibeui-field-004-fg:oklch(0.24 0.014 265);
--vibeui-field-004-muted:oklch(0.55 0.014 265);
--vibeui-field-004-border:oklch(0.88 0.008 265);
--vibeui-field-004-shell:oklch(0.91 0.006 265);
--vibeui-field-004-track:oklch(0.92 0.006 265);
--vibeui-field-004-accent:oklch(0.55 0.2 262);
--vibeui-field-004-danger:oklch(0.58 0.19 30);
--vibeui-field-004-ratio:0;
--vibeui-field-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: поле показывают поверх любого фона. */
[data-vibeui-block="field-004"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-field-004-surface);
border:1px solid var(--vibeui-field-004-shell);border-radius:0.875rem;
font-family:var(--vibeui-field-004-font);color:var(--vibeui-field-004-fg);
}
[data-vibeui-block="field-004"] *{box-sizing:border-box}
[data-vibeui-block="field-004"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="field-004"] [data-part="frame"]{
display:flex;align-items:center;gap:0.5rem;
padding:0 0.375rem 0 0.75rem;height:2.625rem;
background:var(--vibeui-field-004-bg);
border:1px solid var(--vibeui-field-004-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="field-004"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-field-004-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-field-004-accent) 18%,transparent);
}
[data-vibeui-block="field-004"] input{
flex:1;min-width:0;border:0;background:none;color:inherit;
font:inherit;font-size:0.875rem;padding:0;
}
[data-vibeui-block="field-004"] input:focus{outline:none}
[data-vibeui-block="field-004"] input::placeholder{color:var(--vibeui-field-004-muted)}
/* Кольцо остатка: доля видна краем глаза, число — внутри кольца. */
[data-vibeui-block="field-004"] [data-part="ring"]{
flex:none;position:relative;display:grid;place-items:center;
width:1.875rem;height:1.875rem;border-radius:9999px;
background:conic-gradient(var(--vibeui-field-004-accent) calc(var(--vibeui-field-004-ratio) * 1turn),var(--vibeui-field-004-track) 0);
transition:background .16s linear;
}
[data-vibeui-block="field-004"] [data-part="ring"]::before{
content:"";position:absolute;inset:2px;border-radius:9999px;
background:var(--vibeui-field-004-bg);
}
[data-vibeui-block="field-004"] [data-part="count"]{
position:relative;font-size:0.625rem;font-weight:700;line-height:1;
font-variant-numeric:tabular-nums;color:var(--vibeui-field-004-muted);
}
[data-vibeui-block="field-004"][data-low="true"] [data-part="ring"]{
background:conic-gradient(var(--vibeui-field-004-danger) calc(var(--vibeui-field-004-ratio) * 1turn),var(--vibeui-field-004-track) 0);
}
[data-vibeui-block="field-004"][data-low="true"] [data-part="count"]{color:var(--vibeui-field-004-danger)}
[data-vibeui-block="field-004"] [data-part="status"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
}
[data-vibeui-block="field-004"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-field-004-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="field-004"] *{animation:none!important;transition:none!important}}
`

/**
 * Поле с кольцевым счётчиком остатка символов в углу рамки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Field004({
  label = "Заголовок карточки",
  limit = 60,
  defaultValue = "Каталог AI-компонентов",
  placeholder = "Коротко и по делу",
  onChange,
  accent,
  className,
  style,
  ...props
}: Field004Props) {
  const [value, setValue] = useState(defaultValue)
  const left = Math.max(0, limit - value.length)
  const ratio = limit > 0 ? Math.min(1, value.length / limit) : 0
  const low = left <= Math.round(limit / 4)

  const palette = {
    "--vibeui-field-004-ratio": String(ratio),
    ...(accent ? { "--vibeui-field-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-field-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="field-004"
        data-low={low ? "true" : undefined}
        className={className}
        style={palette}
      >
        <label htmlFor="field-004-input">{label}</label>
        <div data-part="frame">
          <input
            id="field-004-input"
            type="text"
            value={value}
            maxLength={limit}
            placeholder={placeholder}
            aria-describedby="field-004-hint"
            onChange={(event) => {
              setValue(event.target.value)
              onChange?.(event.target.value)
            }}
          />
          <span data-part="ring" aria-hidden="true">
            <span data-part="count">{left}</span>
          </span>
        </div>
        {/* Вслух объявляем только последнюю четверть: иначе screen reader
            читает счётчик на каждую букву. */}
        <p data-part="status" role="status">
          {low ? `Осталось ${left} символов из ${limit}` : ""}
        </p>
        <p id="field-004-hint" data-part="hint">
          Не длиннее {limit} символов — столько помещается в карточку каталога.
        </p>
      </div>
    </>
  )
}
