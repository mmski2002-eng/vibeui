"use client"

import { useRef, useState } from "react"
import type {
  ChangeEvent,
  ComponentPropsWithoutRef,
  CSSProperties,
  DragEvent,
} from "react"

export type Button031Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  /** Строка ограничений под подписью: форматы и вес. */
  hint?: string
  /** Значение атрибута accept у скрытого input. */
  accept?: string
  resetLabel?: string
  onFileChange?: (file: File | null) => void
  accent?: string
}

// Идея компонента: кнопка выбора файла остаётся настоящим input[type=file].
// Он лежит внутри label и растянут по всей плашке: клик, Tab и Enter работают
// без единого обработчика, диалог открывает браузер. JS добавлен только там,
// где без него нельзя, — показать имя и вес выбранного файла, принять
// перетаскивание и очистить выбор.
const STYLES = `
:where([data-vibeui-block="button-031"]){
--vibeui-button-031-bg:oklch(1 0 0);
--vibeui-button-031-fg:oklch(0.26 0.016 265);
--vibeui-button-031-muted:oklch(0.55 0.014 265);
--vibeui-button-031-border:oklch(0.86 0.008 265);
--vibeui-button-031-accent:oklch(0.55 0.17 265);
--vibeui-button-031-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-031"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;
font-family:var(--vibeui-button-031-font);color:var(--vibeui-button-031-fg);
}
[data-vibeui-block="button-031"] [data-part="field"]{
position:relative;cursor:pointer;
display:flex;align-items:center;gap:0.75rem;
padding:0.75rem 0.875rem;box-sizing:border-box;
border:1.5px dashed var(--vibeui-button-031-border);border-radius:0.75rem;
background:var(--vibeui-button-031-bg);
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="button-031"] [data-part="field"]:hover{border-color:var(--vibeui-button-031-accent)}
[data-vibeui-block="button-031"] [data-part="field"][data-drag="true"]{
border-color:var(--vibeui-button-031-accent);
background:color-mix(in oklab,var(--vibeui-button-031-accent) 7%,var(--vibeui-button-031-bg));
}
/* Фокус приходит от скрытого input: обводку рисуем на плашке. */
[data-vibeui-block="button-031"] [data-part="field"]:has(input:focus-visible){
outline:2px solid var(--vibeui-button-031-accent);outline-offset:2px;
}
[data-vibeui-block="button-031"] input{
position:absolute;width:1px;height:1px;padding:0;margin:0;
opacity:0;clip-path:inset(50%);overflow:hidden;
}
[data-vibeui-block="button-031"] [data-part="clip"]{
flex:none;position:relative;width:0.5rem;height:1rem;box-sizing:border-box;
border:1.5px solid var(--vibeui-button-031-accent);border-radius:9999px;
transform:rotate(45deg);
}
[data-vibeui-block="button-031"] [data-part="clip"]::after{
content:"";position:absolute;left:1px;top:0.1875rem;width:0.1875rem;height:0.5rem;
box-sizing:border-box;border:1.5px solid var(--vibeui-button-031-accent);
border-top:0;border-radius:0 0 0.125rem 0.125rem;
}
[data-vibeui-block="button-031"] [data-part="text"]{display:flex;flex-direction:column;gap:0.1875rem;min-width:0}
[data-vibeui-block="button-031"] [data-part="name"]{
font-size:0.875rem;font-weight:650;line-height:1.2;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="button-031"] [data-part="hint"]{
color:var(--vibeui-button-031-muted);font-size:0.75rem;line-height:1.2;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="button-031"] [data-part="reset"]{
appearance:none;border:0;cursor:pointer;align-self:flex-start;
padding:0;background:none;color:var(--vibeui-button-031-muted);
font:inherit;font-size:0.75rem;text-decoration:underline;text-underline-offset:2px;
}
[data-vibeui-block="button-031"] [data-part="reset"]:hover{color:var(--vibeui-button-031-fg)}
[data-vibeui-block="button-031"] [data-part="reset"]:focus-visible{outline:2px solid var(--vibeui-button-031-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-031"] *{animation:none!important;transition:none!important}}
`

function weight(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} МБ`
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} КБ`

  return `${bytes} Б`
}

/**
 * Кнопка выбора файла поверх настоящего input[type=file].
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button031({
  label = "Выберите файл или перетащите",
  hint = "PDF или PNG, до 10 МБ",
  accept = ".pdf,.png,.jpg",
  resetLabel = "Убрать файл",
  onFileChange,
  accent,
  className,
  style,
  ...props
}: Button031Props) {
  const [file, setFile] = useState<File | null>(null)
  const [drag, setDrag] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  const take = (next: File | null) => {
    setFile(next)
    onFileChange?.(next)
  }

  const change = (event: ChangeEvent<HTMLInputElement>) => {
    take(event.target.files?.[0] ?? null)
  }

  const drop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setDrag(false)

    const dropped = event.dataTransfer.files
    if (!dropped.length) return

    // Кладём файл в сам input: форма отправится обычным способом,
    // без ручной сборки FormData на стороне приложения.
    if (input.current) input.current.files = dropped
    take(dropped[0])
  }

  const clear = () => {
    if (input.current) input.current.value = ""
    take(null)
  }

  const palette = {
    ...(accent ? { "--vibeui-button-031-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-031" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="button-031"
        className={className}
        style={palette}
      >
        <label
          data-part="field"
          data-drag={String(drag)}
          onDragOver={(event) => {
            event.preventDefault()
            setDrag(true)
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={drop}
        >
          <input ref={input} type="file" accept={accept} onChange={change} />
          <span data-part="clip" aria-hidden="true" />
          <span data-part="text">
            <span data-part="name">{file ? file.name : label}</span>
            <span data-part="hint">{file ? weight(file.size) : hint}</span>
          </span>
        </label>
        {file ? (
          <button type="button" data-part="reset" onClick={clear}>
            {resetLabel}
          </button>
        ) : null}
      </div>
    </>
  )
}
