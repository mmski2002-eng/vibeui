"use client"

import { useId, useState } from "react"
import type {
  ChangeEvent,
  ComponentPropsWithoutRef,
  CSSProperties,
} from "react"

export type Inputgroup017Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  name?: string
  label?: string
  accept?: string
  hint?: string
  accent?: string
}

function formatSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} Б`
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} КБ`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
}

// Идея компонента: настоящий <input type="file"> никуда не девается — он
// просто визуально спрятан внутри своей же подписи. Кликабельна и
// таб-доступна именно подпись-обёртка (клик по label фокусирует и открывает
// системный диалог у обёрнутого input), а соседнее поле только показывает
// результат и никогда не участвует в отправке формы. Спрятанный input не
// display:none — он остаётся в таб-порядке, поэтому диалог открывается и с
// клавиатуры клавишей Enter или пробелом.
const STYLES = `
:where([data-vibeui-block="inputgroup-017"]){
--vibeui-inputgroup-017-surface:oklch(1 0 0);
--vibeui-inputgroup-017-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-017-fg:oklch(0.22 0.014 265);
--vibeui-inputgroup-017-muted:oklch(0.55 0.014 265);
--vibeui-inputgroup-017-field:oklch(0.99 0.002 265);
--vibeui-inputgroup-017-fixed:oklch(0.96 0.004 265);
--vibeui-inputgroup-017-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-017-accent:oklch(0.5 0.15 265);
--vibeui-inputgroup-017-radius:0.75rem;
--vibeui-inputgroup-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="inputgroup-017"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-017-surface);
border:1px solid var(--vibeui-inputgroup-017-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-017-font);color:var(--vibeui-inputgroup-017-fg);
}
[data-vibeui-block="inputgroup-017"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-017"] [data-part="caption"]{
display:block;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="inputgroup-017"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-017"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-017-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-017"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-017-radius) 0 0 var(--vibeui-inputgroup-017-radius);
}
[data-vibeui-block="inputgroup-017"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-017-radius) var(--vibeui-inputgroup-017-radius) 0;
}
[data-vibeui-block="inputgroup-017"] [data-part="trigger"]{
flex:none;cursor:pointer;display:inline-flex;align-items:center;gap:0.4375rem;
padding:0 1rem;
background:var(--vibeui-inputgroup-017-fixed);
font-size:0.8125rem;font-weight:650;
transition:background-color .16s ease;
}
[data-vibeui-block="inputgroup-017"] [data-part="trigger"]:hover{
background:color-mix(in oklab,var(--vibeui-inputgroup-017-accent) 14%,var(--vibeui-inputgroup-017-fixed));
}
[data-vibeui-block="inputgroup-017"] [data-part="trigger"]:has(input:focus-visible){
z-index:1;outline:2px solid var(--vibeui-inputgroup-017-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-017-accent);
}
[data-vibeui-block="inputgroup-017"] [data-part="trigger"] svg{width:0.9375rem;height:0.9375rem;display:block}
/* Реальный input остаётся в таб-порядке: скрыт визуально, не через display:none. */
[data-vibeui-block="inputgroup-017"] [data-part="trigger"] input{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;
}
[data-vibeui-block="inputgroup-017"] [data-part="name"]{
flex:1;min-width:0;display:flex;align-items:center;padding:0 0.75rem;
background:var(--vibeui-inputgroup-017-field);
font-size:0.8125rem;color:var(--vibeui-inputgroup-017-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="inputgroup-017"] [data-part="name"] b{
font-weight:650;color:var(--vibeui-inputgroup-017-fg);
}
[data-vibeui-block="inputgroup-017"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-017-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-017"] *{animation:none!important;transition:none!important}}
`

/**
 * Сцепка «кнопка выбора файла + имя файла»: настоящий file-input спрятан
 * внутри подписи-кнопки, соседнее поле только показывает результат.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup017({
  name = "attachment",
  label = "Прикрепить файл",
  accept,
  hint = "Кнопка открывает системный диалог выбора файла — имя и размер появятся в поле справа.",
  accent,
  className,
  style,
  ...props
}: Inputgroup017Props) {
  const id = useId()
  const [file, setFile] = useState<{ name: string; size: number } | null>(null)

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-017-accent": accent } : null),
    ...style,
  } as CSSProperties

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0]
    setFile(picked ? { name: picked.name, size: picked.size } : null)
  }

  return (
    <>
      <style href="vibeui-inputgroup-017" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="inputgroup-017"
        className={className}
        style={palette}
      >
        <span data-part="caption" id={`${id}-label`}>
          {label}
        </span>
        <div data-part="group">
          <label data-part="trigger" htmlFor={id}>
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path
                d="M8 2.5v8M4.5 6 8 2.5 11.5 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.5 10.5v2a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-2"
                strokeLinecap="round"
              />
            </svg>
            Выбрать файл
            <input
              id={id}
              name={name}
              type="file"
              accept={accept}
              aria-labelledby={`${id}-label`}
              aria-describedby={`${id}-hint`}
              onChange={handleChange}
            />
          </label>
          <span data-part="name" aria-live="polite">
            {file ? (
              <>
                <b>{file.name}</b>&nbsp;({formatSize(file.size)})
              </>
            ) : (
              "Файл не выбран"
            )}
          </span>
        </div>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
