"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type File003Item = {
  id: string
  name: string
  size: string
  progress: number
}

export type File003Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  title?: string
  items?: File003Item[]
  /** Текст, когда очередь опустела. */
  emptyText?: string
  /** Подпись завершённой строки вместо доли. */
  doneText?: string
  /** Подпись полоски: {name} — имя файла. */
  progressLabel?: string
  /** Подпись кнопки у незавершённой строки: {name} — имя файла. */
  cancelLabel?: string
  /** Подпись кнопки у завершённой строки: {name} — имя файла. */
  removeLabel?: string
  onCancel?: (id: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: очередь загрузки, из которой можно выйти. Прогресс без
// отмены — это наблюдение за чужой работой: пользователь уже понял, что
// перепутал файл, а полоска всё ещё ползёт. Здесь у каждой строки своя
// полоска на нативном <progress> и своя кнопка отмены, называющая файл по
// имени, а завершённые строки меняют кнопку на «Убрать» — действие другое.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у панели
// по умолчанию нет, она лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="file-003"]){
--vibeui-file-003-surface:transparent;
--vibeui-file-003-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-file-003-muted:color-mix(in oklab,var(--vibeui-file-003-fg) 68%,transparent);
--vibeui-file-003-border:light-dark(oklch(0.89 0 265),oklch(0.4 0 265));
--vibeui-file-003-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-file-003-track:light-dark(oklch(0.93 0 265),oklch(0.32 0 265));
--vibeui-file-003-accent:light-dark(oklch(0.55 0.18 255),oklch(0.74 0.16 255));
--vibeui-file-003-ok:light-dark(oklch(0.52 0.13 155),oklch(0.76 0.14 155));
--vibeui-file-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="file-003"]{color-scheme:dark}
/* Панель без собственной заливки: рамка очерчивает очередь на любом фоне. */
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
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Очередь загрузки: полоска прогресса и отмена на каждой строке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function File003({
  title = "Загружается 3 файла",
  items = DEFAULT_ITEMS,
  emptyText = "Очередь пуста — все загрузки отменены.",
  doneText = "загружен",
  progressLabel = "Загрузка файла {name}",
  cancelLabel = "Отменить {name}",
  removeLabel = "Убрать {name}",
  onCancel,
  background = "",
  accent,
  className,
  style,
  ...props
}: File003Props) {
  const [list, setList] = useState(items)

  const palette = {
    ...(accent ? { "--vibeui-file-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-file-003-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        data-slot="file-upload"
        data-vibeui-block="file-003"
        className={className}
        style={palette}
      >
        <h3>{title}</h3>
        {list.length === 0 ? (
          <p data-part="empty">{emptyText}</p>
        ) : (
          <ul>
            {list.map((entry) => {
              const done = entry.progress >= 100

              return (
                <li key={entry.id} data-done={done ? "true" : undefined}>
                  <span data-part="name">{entry.name}</span>
                  <span data-part="meta">
                    {done
                      ? `${entry.size} · ${doneText}`
                      : `${entry.size} · ${entry.progress}%`}
                  </span>
                  <progress
                    max={100}
                    value={entry.progress}
                    aria-label={progressLabel.replace("{name}", entry.name)}
                  />
                  <button
                    type="button"
                    aria-label={(done ? removeLabel : cancelLabel).replace(
                      "{name}",
                      entry.name,
                    )}
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
