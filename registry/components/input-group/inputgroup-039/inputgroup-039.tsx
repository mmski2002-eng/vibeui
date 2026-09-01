"use client"

import { useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup039Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  name?: string
  label?: string
  accept?: string
  onChange?: (file: File | null) => void
  hint?: string
  accent?: string
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
}

// Идея компонента: выбранный файл — это отдельная плашка с собственной
// кнопкой удаления, а не просто текст рядом с полем выбора. Удаление не
// только чистит состояние React, но и обнуляет input[type=file].value —
// без этого повторный выбор того же файла не вызовет onChange повторно,
// потому что для браузера значение не изменилось.
const STYLES = `
:where([data-vibeui-block="inputgroup-039"]){
--vibeui-inputgroup-039-surface:oklch(1 0 0);
--vibeui-inputgroup-039-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-039-fg:oklch(0.22 0.014 265);
--vibeui-inputgroup-039-muted:oklch(0.55 0.014 265);
--vibeui-inputgroup-039-fixed:oklch(0.96 0.004 265);
--vibeui-inputgroup-039-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-039-accent:oklch(0.55 0.15 260);
--vibeui-inputgroup-039-danger:oklch(0.56 0.19 25);
--vibeui-inputgroup-039-radius:0.75rem;
--vibeui-inputgroup-039-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="inputgroup-039"]{
display:flex;flex-direction:column;gap:0.5rem;margin:0;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-039-surface);
border:1px solid var(--vibeui-inputgroup-039-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-039-font);color:var(--vibeui-inputgroup-039-fg);
}
[data-vibeui-block="inputgroup-039"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-039"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-039"] [data-part="input"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;
}
[data-vibeui-block="inputgroup-039"] [data-part="trigger"]{
appearance:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.5rem;
height:2.75rem;border:1px dashed var(--vibeui-inputgroup-039-border);border-radius:var(--vibeui-inputgroup-039-radius);
background:var(--vibeui-inputgroup-039-fixed);color:inherit;font:inherit;font-size:0.8125rem;font-weight:600;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="inputgroup-039"] [data-part="trigger"]:hover{
border-color:var(--vibeui-inputgroup-039-accent);
}
[data-vibeui-block="inputgroup-039"] [data-part="input"]:focus-visible + [data-part="trigger"]{
outline:2px solid var(--vibeui-inputgroup-039-accent);outline-offset:2px;
}
[data-vibeui-block="inputgroup-039"] [data-part="trigger"] svg{width:1rem;height:1rem;flex:none;display:block}
[data-vibeui-block="inputgroup-039"] [data-part="chip"]{
display:flex;align-items:center;gap:0.625rem;
border:1px solid var(--vibeui-inputgroup-039-border);border-radius:var(--vibeui-inputgroup-039-radius);
padding:0.5rem 0.625rem;
}
[data-vibeui-block="inputgroup-039"] [data-part="chip"] svg{
width:1.125rem;height:1.125rem;flex:none;color:var(--vibeui-inputgroup-039-accent);
}
[data-vibeui-block="inputgroup-039"] [data-part="meta"]{min-width:0;flex:1;display:flex;flex-direction:column;gap:0.0625rem}
[data-vibeui-block="inputgroup-039"] [data-part="filename"]{
font-size:0.8125rem;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="inputgroup-039"] [data-part="filesize"]{font-size:0.75rem;color:var(--vibeui-inputgroup-039-muted)}
[data-vibeui-block="inputgroup-039"] [data-part="remove"]{
appearance:none;flex:none;cursor:pointer;display:flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;border:0;border-radius:999px;background:transparent;color:var(--vibeui-inputgroup-039-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="inputgroup-039"] [data-part="remove"]:hover{
background:color-mix(in oklab,var(--vibeui-inputgroup-039-danger) 14%,transparent);
color:var(--vibeui-inputgroup-039-danger);
}
[data-vibeui-block="inputgroup-039"] [data-part="remove"]:focus-visible{
outline:2px solid var(--vibeui-inputgroup-039-accent);outline-offset:1px;
}
[data-vibeui-block="inputgroup-039"] [data-part="remove"] svg{width:0.875rem;height:0.875rem;flex:none;display:block}
[data-vibeui-block="inputgroup-039"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-039-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-039"] *{transition:none!important}}
`

/**
 * Сцепка «прикрепление файла»: скрытый настоящий input внутри своей label
 * запускает выбор, а выбранный файл выводится плашкой с именем, размером и
 * кнопкой удаления, которая обнуляет и состояние, и input.value.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup039({
  name = "attachment",
  label = "Прикрепить файл",
  accept,
  onChange,
  hint = "Один файл за раз: новый выбор заменяет предыдущий.",
  accent,
  className,
  style,
  ...props
}: Inputgroup039Props) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-039-accent": accent } : null),
    ...style,
  } as CSSProperties

  const remove = () => {
    setFile(null)
    onChange?.(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
    inputRef.current?.focus()
  }

  return (
    <>
      <style href="vibeui-inputgroup-039" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="inputgroup-039"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <input
          ref={inputRef}
          data-part="input"
          id={id}
          name={name}
          type="file"
          accept={accept}
          aria-describedby={`${id}-hint`}
          onChange={(event) => {
            const next = event.target.files?.[0] ?? null
            setFile(next)
            onChange?.(next)
          }}
        />
        {file ? (
          <div data-part="chip">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path
                d="M4 2h5l3 3v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z"
                strokeLinejoin="round"
              />
              <path d="M9 2v3h3" strokeLinejoin="round" />
            </svg>
            <div data-part="meta">
              <span data-part="filename">{file.name}</span>
              <span data-part="filesize">{formatSize(file.size)}</span>
            </div>
            <button
              type="button"
              data-part="remove"
              aria-label={`Удалить файл ${file.name}`}
              onClick={remove}
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ) : (
          <label htmlFor={id} data-part="trigger">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path
                d="M8 3v7M4.5 6.5 8 3l3.5 3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M3 12.5h10" strokeLinecap="round" />
            </svg>
            Выбрать файл
          </label>
        )}
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
