"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type File008Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  current?: string
  meta?: string
  onChange?: (name: string) => void
  accent?: string
}

// Идея компонента: замена файла с возвратом. Кнопка «Заменить» рядом с уже
// загруженным файлом выглядит безобидно, но старую версию после неё обычно
// не вернуть — а перепутать соседние файлы в диалоге проще всего. Здесь
// прошлое имя остаётся на виду вместе с кнопкой «Вернуть», пока страницу не
// сохранили: отмена стоит одного нажатия, а не повторного поиска файла.
const STYLES = `
:where([data-vibeui-block="file-008"]){
--vibeui-file-008-surface:oklch(1 0 0);
--vibeui-file-008-tile:oklch(0.975 0.004 265);
--vibeui-file-008-fg:oklch(0.23 0.014 265);
--vibeui-file-008-muted:oklch(0.55 0.014 265);
--vibeui-file-008-border:oklch(0.88 0.008 265);
--vibeui-file-008-shell:oklch(0.91 0.006 265);
--vibeui-file-008-accent:oklch(0.5 0.17 300);
--vibeui-file-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: карточку показывают поверх любого фона. */
[data-vibeui-block="file-008"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-file-008-surface);
border:1px solid var(--vibeui-file-008-shell);border-radius:0.875rem;
font-family:var(--vibeui-file-008-font);color:var(--vibeui-file-008-fg);
}
[data-vibeui-block="file-008"] *{box-sizing:border-box}
[data-vibeui-block="file-008"] [data-part="title"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="file-008"] [data-part="card"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.625rem;border-radius:0.75rem;
background:var(--vibeui-file-008-tile);
border:1px solid var(--vibeui-file-008-border);
}
[data-vibeui-block="file-008"] [data-part="sheet"]{
position:relative;flex:none;width:2rem;height:2.5rem;
background:var(--vibeui-file-008-surface);
border:1px solid var(--vibeui-file-008-border);border-radius:0.25rem;
overflow:hidden;
}
[data-vibeui-block="file-008"] [data-part="sheet"]::before{
content:"";position:absolute;right:0;top:0;
border-width:0 0.5rem 0.5rem 0;border-style:solid;
border-color:transparent var(--vibeui-file-008-border) transparent transparent;
}
[data-vibeui-block="file-008"] [data-part="sheet"]::after{
content:"";position:absolute;left:0.3125rem;right:0.3125rem;bottom:0.4375rem;
height:1px;background:var(--vibeui-file-008-border);
box-shadow:0 -0.3125rem var(--vibeui-file-008-border),0 -0.625rem var(--vibeui-file-008-border);
}
[data-vibeui-block="file-008"] [data-part="body"]{display:flex;flex-direction:column;gap:0.0625rem;min-width:0;flex:1}
[data-vibeui-block="file-008"] [data-part="name"]{
font-size:0.8125rem;font-weight:650;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="file-008"] [data-part="meta"]{font-size:0.6875rem;color:var(--vibeui-file-008-muted)}
[data-vibeui-block="file-008"] label{
flex:none;cursor:pointer;
padding:0.375rem 0.6875rem;border-radius:0.5rem;
border:1px solid var(--vibeui-file-008-border);
background:var(--vibeui-file-008-surface);
font-size:0.75rem;font-weight:650;
transition:border-color .16s ease,color .16s ease;
}
[data-vibeui-block="file-008"] label:hover{border-color:var(--vibeui-file-008-accent);color:var(--vibeui-file-008-accent)}
[data-vibeui-block="file-008"] label:has(input:focus-visible){outline:2px solid var(--vibeui-file-008-accent);outline-offset:2px}
[data-vibeui-block="file-008"] input{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);border:0;
}
/* Прошлое имя остаётся на виду: отмена стоит одного нажатия. */
[data-vibeui-block="file-008"] [data-part="undo"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.4375rem 0.625rem;border-radius:0.5rem;
background:color-mix(in oklab,var(--vibeui-file-008-accent) 7%,oklch(1 0 0));
font-size:0.75rem;line-height:1.4;
}
[data-vibeui-block="file-008"] [data-part="was"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
color:var(--vibeui-file-008-muted);
}
[data-vibeui-block="file-008"] button{
appearance:none;flex:none;cursor:pointer;border:0;background:none;padding:0;
color:var(--vibeui-file-008-accent);
font:inherit;font-size:0.75rem;font-weight:700;text-decoration:underline;
}
[data-vibeui-block="file-008"] button:focus-visible{outline:2px solid var(--vibeui-file-008-accent);outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="file-008"] [data-part="hint"]{
margin:0;font-size:0.6875rem;line-height:1.4;color:var(--vibeui-file-008-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="file-008"] *{animation:none!important;transition:none!important}}
`

/**
 * Замена уже загруженного файла с возвратом прошлой версии одним нажатием.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function File008({
  label = "Договор оферты",
  current = "oferta-2025-v4.pdf",
  meta = "PDF · 1,8 МБ · загружен 12 марта",
  onChange,
  accent,
  className,
  style,
  ...props
}: File008Props) {
  const id = useId()
  const [name, setName] = useState(current)
  const [previous, setPrevious] = useState<string | null>(null)

  const palette = {
    ...(accent ? { "--vibeui-file-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  const replace = (file: File | undefined) => {
    if (!file) return
    setPrevious(name)
    setName(file.name)
    onChange?.(file.name)
  }

  const undo = () => {
    if (!previous) return
    setName(previous)
    setPrevious(null)
    onChange?.(previous)
  }

  return (
    <>
      <style href="vibeui-file-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="file-008"
        className={className}
        style={palette}
      >
        <span data-part="title">{label}</span>
        <div data-part="card">
          <span data-part="sheet" aria-hidden="true" />
          <span data-part="body">
            <span data-part="name">{name}</span>
            <span data-part="meta">
              {previous ? "Новая версия, ещё не сохранена" : meta}
            </span>
          </span>
          <label htmlFor={id}>
            Заменить
            <input
              id={id}
              type="file"
              accept="application/pdf"
              onChange={(event) => replace(event.target.files?.[0])}
            />
          </label>
        </div>

        {previous ? (
          <p data-part="undo" role="status">
            <span data-part="was">Было: {previous}</span>
            <button type="button" onClick={undo}>
              Вернуть
            </button>
          </p>
        ) : (
          <p data-part="hint">
            Замена не удаляет прошлую версию — она остаётся в истории документа.
          </p>
        )}
      </div>
    </>
  )
}
