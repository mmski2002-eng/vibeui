"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type File008Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  current?: string
  meta?: string
  /** Подпись кнопки выбора нового файла. */
  replaceText?: string
  /** Подпись кнопки возврата. */
  undoText?: string
  /** Строка с прошлым именем: {name} — прежнее имя файла. */
  wasText?: string
  /** Пометка новой, ещё не сохранённой версии. */
  stagedText?: string
  /** Пояснение под карточкой, пока замены не было. */
  hint?: string
  onChange?: (name: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: замена файла с возвратом. Кнопка «Заменить» рядом с уже
// загруженным файлом выглядит безобидно, но старую версию после неё обычно
// не вернуть — а перепутать соседние файлы в диалоге проще всего. Здесь
// прошлое имя остаётся на виду вместе с кнопкой «Вернуть», пока страницу не
// сохранили: отмена стоит одного нажатия, а не повторного поиска файла.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у карточки
// по умолчанию нет, она лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="file-008"]){
--vibeui-file-008-surface:transparent;
--vibeui-file-008-tile:light-dark(oklch(0.975 0 265),oklch(0.27 0 265));
--vibeui-file-008-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-file-008-muted:color-mix(in oklab,var(--vibeui-file-008-fg) 68%,transparent);
--vibeui-file-008-border:light-dark(oklch(0.88 0 265),oklch(0.42 0 265));
--vibeui-file-008-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-file-008-accent:light-dark(oklch(0.5 0.17 39.8),oklch(0.76 0.15 39.8));
--vibeui-file-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="file-008"]{color-scheme:dark}
/* Панель без собственной заливки: рамка очерчивает карточку на любом фоне. */
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
background:color-mix(in oklab,var(--vibeui-file-008-accent) 12%,transparent);
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
 * Замена уже загруженного файла с возвратом прошлой версии одним нажатием.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function File008({
  label = "Договор оферты",
  current = "oferta-2025-v4.pdf",
  meta = "PDF · 1,8 МБ · загружен 12 марта",
  replaceText = "Заменить",
  undoText = "Вернуть",
  wasText = "Было: {name}",
  stagedText = "Новая версия, ещё не сохранена",
  hint = "Замена не удаляет прошлую версию — она остаётся в истории документа.",
  onChange,
  background = "",
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
    ...(background
      ? {
          "--vibeui-file-008-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        data-slot="file-upload"
        data-vibeui-block="file-008"
        className={className}
        style={palette}
      >
        <span data-part="title">{label}</span>
        <div data-part="card">
          <span data-part="sheet" aria-hidden="true" />
          <span data-part="body">
            <span data-part="name">{name}</span>
            <span data-part="meta">{previous ? stagedText : meta}</span>
          </span>
          <label htmlFor={id}>
            {replaceText}
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
            <span data-part="was">{wasText.replace("{name}", previous)}</span>
            <button type="button" onClick={undo}>
              {undoText}
            </button>
          </p>
        ) : (
          <p data-part="hint">{hint}</p>
        )}
      </div>
    </>
  )
}
