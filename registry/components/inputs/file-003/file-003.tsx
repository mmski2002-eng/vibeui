"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type File003Item = {
  id: string
  name: string
  size: string
  progress: number
}

export type File003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  title?: string
  items?: File003Item[]
  onCancel?: (id: string) => void
  accent?: string
}

// Идея компонента: очередь загрузки, из которой можно выйти. Прогресс без
// отмены — это наблюдение за чужой работой: пользователь уже понял, что
// перепутал файл, а полоска всё ещё ползёт. Здесь у каждой строки своя
// полоска на нативном <progress> и своя кнопка отмены, называющая файл по
// имени, а завершённые строки меняют кнопку на «Убрать» — действие другое.
const STYLES = `
:where([data-vibeui-block="file-003"]){
--vibeui-file-003-surface:oklch(1 0 0);
--vibeui-file-003-fg:oklch(0.23 0.014 265);
--vibeui-file-003-muted:oklch(0.55 0.014 265);
--vibeui-file-003-border:oklch(0.89 0.008 265);
--vibeui-file-003-shell:oklch(0.91 0.006 265);
--vibeui-file-003-track:oklch(0.93 0.006 265);
--vibeui-file-003-accent:oklch(0.55 0.18 255);
--vibeui-file-003-ok:oklch(0.52 0.13 155);
--vibeui-file-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: очередь показывают поверх любого фона. */
[data-vibeui-block="file-003"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-file-003-surface);
border:1px solid var(--vibeui-file-003-shell);border-radius:0.875rem;
font-family:var(--vibeui-file-003-font);color:var(--vibeui-file-003-fg);
}
[data-vibeui-block="file-003"] *{box-sizing:border-box}
[data-vibeui-block="file-003"] h3{margin:0;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="file-003"] ul{display:flex;flex-direction:column;gap:0.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="file-003"] li{
display:grid;grid-template-columns:1fr auto;align-items:center;gap:0.25rem 0.625rem;
padding:0.5rem 0.625rem;border-radius:0.625rem;
border:1px solid var(--vibeui-file-003-border);
}
[data-vibeui-block="file-003"] [data-part="name"]{
min-width:0;font-size:0.8125rem;font-weight:600;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="file-003"] [data-part="meta"]{
grid-column:1;font-size:0.6875rem;color:var(--vibeui-file-003-muted);
font-variant-numeric:tabular-nums;
}
/* Нативный <progress>: доля и подпись достаются вспомогательным технологиям даром. */
[data-vibeui-block="file-003"] progress{
grid-column:1 / -1;appearance:none;width:100%;height:0.3125rem;border:0;
background:var(--vibeui-file-003-track);border-radius:9999px;overflow:hidden;
}
[data-vibeui-block="file-003"] progress::-webkit-progress-bar{background:var(--vibeui-file-003-track);border-radius:9999px}
[data-vibeui-block="file-003"] progress::-webkit-progress-value{background:var(--vibeui-file-003-accent);border-radius:9999px;transition:inline-size .2s ease}
[data-vibeui-block="file-003"] progress::-moz-progress-bar{background:var(--vibeui-file-003-accent);border-radius:9999px}
[data-vibeui-block="file-003"] li[data-done="true"] progress::-webkit-progress-value{background:var(--vibeui-file-003-ok)}
[data-vibeui-block="file-003"] li[data-done="true"] progress::-moz-progress-bar{background:var(--vibeui-file-003-ok)}
[data-vibeui-block="file-003"] li[data-done="true"] [data-part="meta"]{color:var(--vibeui-file-003-ok);font-weight:600}
/* Кнопка называет файл: «отменить» без имени бесполезно в списке из семи строк. */
[data-vibeui-block="file-003"] button{
grid-row:1 / 3;grid-column:2;align-self:center;
appearance:none;cursor:pointer;
width:1.75rem;height:1.75rem;padding:0;border-radius:0.5rem;
border:1px solid var(--vibeui-file-003-border);
background:none;color:var(--vibeui-file-003-muted);
font:inherit;font-size:0.875rem;line-height:1;
transition:color .16s ease,border-color .16s ease;
}
[data-vibeui-block="file-003"] button:hover{color:var(--vibeui-file-003-fg);border-color:var(--vibeui-file-003-muted)}
[data-vibeui-block="file-003"] button:focus-visible{outline:2px solid var(--vibeui-file-003-accent);outline-offset:2px}
[data-vibeui-block="file-003"] [data-part="empty"]{
margin:0;padding:0.75rem 0;font-size:0.8125rem;color:var(--vibeui-file-003-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="file-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: File003Item[] = [
  { id: "1", name: "brand-guide.pdf", size: "4,2 МБ", progress: 100 },
  { id: "2", name: "hero-desktop@2x.png", size: "8,7 МБ", progress: 64 },
  { id: "3", name: "screencast-onboarding.mp4", size: "128 МБ", progress: 18 },
]

/**
 * Очередь загрузки: полоска прогресса и отмена на каждой строке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function File003({
  title = "Загружается 3 файла",
  items = DEFAULT_ITEMS,
  onCancel,
  accent,
  className,
  style,
  ...props
}: File003Props) {
  const [list, setList] = useState(items)

  const palette = {
    ...(accent ? { "--vibeui-file-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  const drop = (id: string) => {
    setList((current) => current.filter((entry) => entry.id !== id))
    onCancel?.(id)
  }

  return (
    <>
      <style href="vibeui-file-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="file-003"
        className={className}
        style={palette}
      >
        <h3>{title}</h3>
        {list.length === 0 ? (
          <p data-part="empty">Очередь пуста — все загрузки отменены.</p>
        ) : (
          <ul>
            {list.map((entry) => {
              const done = entry.progress >= 100

              return (
                <li key={entry.id} data-done={done ? "true" : undefined}>
                  <span data-part="name">{entry.name}</span>
                  <span data-part="meta">
                    {done
                      ? `${entry.size} · загружен`
                      : `${entry.size} · ${entry.progress}%`}
                  </span>
                  <progress
                    max={100}
                    value={entry.progress}
                    aria-label={`Загрузка файла ${entry.name}`}
                  />
                  <button
                    type="button"
                    aria-label={
                      done ? `Убрать ${entry.name}` : `Отменить ${entry.name}`
                    }
                    onClick={() => drop(entry.id)}
                  >
                    ×
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
