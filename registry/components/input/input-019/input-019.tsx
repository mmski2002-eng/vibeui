"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Input019Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  placeholder?: string
  defaultValue?: string
  softLimit?: number
  hardLimit?: number
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: мягкий лимит — это не запрет, а совет. Печатать не
// прерывают на softLimit, поле красится и предупреждает; жёсткий hardLimit
// стоит на maxLength и физически не даёт напечатать больше. Счётчик и
// полоска выводятся из одной и той же длины значения, поэтому не расходятся.
const STYLES = `
:where([data-vibeui-block="input-019"]){
--vibeui-input-019-bg:oklch(1 0 0);
--vibeui-input-019-fg:oklch(0.22 0.014 265);
--vibeui-input-019-muted:oklch(0.56 0.014 265);
--vibeui-input-019-border:oklch(0.9 0.006 265);
--vibeui-input-019-field:oklch(0.985 0.002 265);
--vibeui-input-019-track:oklch(0.92 0.005 265);
--vibeui-input-019-accent:oklch(0.55 0.17 265);
--vibeui-input-019-soft:oklch(0.72 0.16 75);
--vibeui-input-019-max:oklch(0.55 0.19 25);
--vibeui-input-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="input-019"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-019-bg);
border:1px solid var(--vibeui-input-019-border);border-radius:0.875rem;
font-family:var(--vibeui-input-019-font);color:var(--vibeui-input-019-fg);
}
[data-vibeui-block="input-019"] *{box-sizing:border-box}
[data-vibeui-block="input-019"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="input-019"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-019"] [data-part="count"]{
font-size:0.75rem;font-weight:600;font-variant-numeric:tabular-nums;
color:var(--vibeui-input-019-muted);
transition:color .16s ease;
}
[data-vibeui-block="input-019"][data-tone="soft"] [data-part="count"]{color:var(--vibeui-input-019-soft)}
[data-vibeui-block="input-019"][data-tone="max"] [data-part="count"]{color:var(--vibeui-input-019-max)}
[data-vibeui-block="input-019"] input{
width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-input-019-border);border-radius:0.625rem;
background:var(--vibeui-input-019-field);color:inherit;
font:inherit;font-size:0.875rem;
transition:border-color .16s ease;
}
[data-vibeui-block="input-019"] input:focus-visible{
outline:2px solid var(--vibeui-input-019-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="input-019"][data-tone="soft"] input{border-color:var(--vibeui-input-019-soft)}
[data-vibeui-block="input-019"][data-tone="max"] input{border-color:var(--vibeui-input-019-max)}
[data-vibeui-block="input-019"] [data-part="track"]{
height:0.25rem;border-radius:9999px;background:var(--vibeui-input-019-track);overflow:hidden;
}
[data-vibeui-block="input-019"] [data-part="fill"]{
display:block;height:100%;border-radius:inherit;background:var(--vibeui-input-019-accent);
transition:width .16s ease,background-color .16s ease;
}
[data-vibeui-block="input-019"][data-tone="soft"] [data-part="fill"]{background:var(--vibeui-input-019-soft)}
[data-vibeui-block="input-019"][data-tone="max"] [data-part="fill"]{background:var(--vibeui-input-019-max)}
[data-vibeui-block="input-019"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-019-muted);
}
[data-vibeui-block="input-019"][data-tone="soft"] [data-part="note"]{color:var(--vibeui-input-019-soft)}
[data-vibeui-block="input-019"][data-tone="max"] [data-part="note"]{color:var(--vibeui-input-019-max)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-019"] *{animation:none!important;transition:none!important}}
`

function toneOf(length: number, soft: number, hard: number) {
  if (length >= hard) return "max"
  if (length > soft) return "soft"
  return "ok"
}

function messageOf(length: number, soft: number, hard: number, hint?: string) {
  if (length >= hard) return "Достигнут предел символов."
  if (length > soft) {
    return `Мягкий лимит ${soft} превышен на ${length - soft} — можно короче.`
  }
  return hint ?? "Коротко и по делу — то, что нужно."
}

/**
 * Поле со счётчиком символов и мягким лимитом: жёсткий предел не даёт
 * напечатать лишнее, мягкий только предупреждает. Один файл, ноль зависимостей.
 */
export function Input019({
  label = "Заголовок объявления",
  placeholder = "О чём объявление",
  defaultValue = "",
  softLimit = 60,
  hardLimit = 80,
  onChange,
  accent,
  className,
  style,
  ...props
}: Input019Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue.slice(0, hardLimit))

  const palette = {
    ...(accent ? { "--vibeui-input-019-accent": accent } : null),
    ...style,
  } as CSSProperties

  const length = value.length
  const tone = toneOf(length, softLimit, hardLimit)
  const message = messageOf(length, softLimit, hardLimit)

  return (
    <>
      <style href="vibeui-input-019" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="input-019"
        data-tone={tone}
        className={className}
        style={palette}
      >
        <div data-part="head">
          <label htmlFor={id}>{label}</label>
          <span data-part="count" aria-hidden="true">
            {length} / {softLimit}
          </span>
        </div>
        <input
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          maxLength={hardLimit}
          aria-describedby={`${id}-note`}
          onChange={(event) => {
            const next = event.target.value.slice(0, hardLimit)
            setValue(next)
            onChange?.(next)
          }}
        />
        <span data-part="track" aria-hidden="true">
          <span
            data-part="fill"
            style={{ width: `${Math.min(100, (length / hardLimit) * 100)}%` }}
          />
        </span>
        <p data-part="note" id={`${id}-note`} role="status" aria-live="polite">
          {message}
        </p>
      </div>
    </>
  )
}
