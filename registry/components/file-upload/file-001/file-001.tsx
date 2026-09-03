"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, DragEvent } from "react"

export type File001Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  hint?: string
  accept?: string
  /** Строка размера файла: {size} — число килобайт. */
  sizeText?: string
  onChange?: (names: string[]) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: зона перетаскивания, которая остаётся кнопкой. Перетащить
// файл можно только мышью — поэтому внутри настоящий input с типом file и
// подписью-label: с клавиатуры и с телефона всё работает так же. Список
// выбранного показывается сразу: без него непонятно, что именно улетело.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у зоны
// по умолчанию нет, она лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="file-001"]){
--vibeui-file-001-bg:transparent;
--vibeui-file-001-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-file-001-muted:color-mix(in oklab,var(--vibeui-file-001-fg) 68%,transparent);
--vibeui-file-001-border:light-dark(oklch(0.86 0.008 265),oklch(0.42 0.014 265));
--vibeui-file-001-hover:light-dark(oklch(0.97 0.003 265),oklch(0.28 0.012 265));
--vibeui-file-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-file-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="file-001"]{color-scheme:dark}
[data-vibeui-block="file-001"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;
font-family:var(--vibeui-file-001-font);color:var(--vibeui-file-001-fg);
}
/* Зона — это label: клавиатура и телефон получают тот же выбор файла. */
[data-vibeui-block="file-001"] label{
position:relative;display:flex;flex-direction:column;align-items:center;gap:0.25rem;
padding:1.25rem 1rem;box-sizing:border-box;text-align:center;cursor:pointer;
border:1.5px dashed var(--vibeui-file-001-border);border-radius:0.875rem;
background:var(--vibeui-file-001-bg);
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="file-001"] label:hover{background:var(--vibeui-file-001-hover)}
[data-vibeui-block="file-001"][data-over="true"] label{
border-color:var(--vibeui-file-001-accent);
background:color-mix(in oklab,var(--vibeui-file-001-accent) 10%,transparent);
}
[data-vibeui-block="file-001"] label:has(input:focus-visible){outline:2px solid var(--vibeui-file-001-accent);outline-offset:2px}
[data-vibeui-block="file-001"] input{position:absolute;width:1px;height:1px;opacity:0}
[data-vibeui-block="file-001"] [data-part="arrow"]{
position:relative;width:1.5rem;height:1.5rem;margin-bottom:0.125rem;
}
[data-vibeui-block="file-001"] [data-part="arrow"]::before{
content:"";position:absolute;left:50%;top:0.125rem;width:2px;height:0.875rem;
margin-left:-1px;background:var(--vibeui-file-001-muted);border-radius:9999px;
}
[data-vibeui-block="file-001"] [data-part="arrow"]::after{
content:"";position:absolute;left:50%;top:0.1875rem;width:0.5rem;height:0.5rem;
margin-left:-0.25rem;
border-left:2px solid var(--vibeui-file-001-muted);
border-top:2px solid var(--vibeui-file-001-muted);
transform:rotate(45deg);
}
[data-vibeui-block="file-001"] [data-part="title"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="file-001"] [data-part="hint"]{font-size:0.75rem;line-height:1.4;color:var(--vibeui-file-001-muted)}
/* Список выбранного: без него непонятно, что именно улетело. */
[data-vibeui-block="file-001"] ul{display:flex;flex-direction:column;gap:0.25rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="file-001"] li{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.4375rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-file-001-border);
font-size:0.8125rem;
}
[data-vibeui-block="file-001"] [data-part="size"]{color:var(--vibeui-file-001-muted);font-size:0.75rem;font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="file-001"] *{animation:none!important;transition:none!important}}
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
 * Зона перетаскивания на настоящем input type="file" с списком выбранного.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function File001({
  label = "Перетащите файлы сюда",
  hint = "PNG, JPG или PDF до 10 МБ. Можно выбрать несколько",
  accept = "image/png,image/jpeg,application/pdf",
  sizeText = "{size} КБ",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: File001Props) {
  const id = useId()
  const [over, setOver] = useState(false)
  const [files, setFiles] = useState<{ name: string; size: string }[]>([])

  const palette = {
    ...(accent ? { "--vibeui-file-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-file-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const take = (list: FileList | null) => {
    if (!list) return
    const next = Array.from(list).map((file) => ({
      name: file.name,
      size: sizeText.replace(
        "{size}",
        String(Math.max(1, Math.round(file.size / 1024))),
      ),
    }))
    setFiles(next)
    onChange?.(next.map((file) => file.name))
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setOver(false)
    take(event.dataTransfer.files)
  }

  return (
    <>
      <style href="vibeui-file-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="file-upload"
        data-vibeui-block="file-001"
        data-over={over}
        className={className}
        style={palette}
        onDragOver={(event) => {
          event.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
      >
        <label htmlFor={id}>
          <span data-part="arrow" aria-hidden="true" />
          <span data-part="title">{label}</span>
          <span data-part="hint">{hint}</span>
          <input
            id={id}
            type="file"
            multiple
            accept={accept}
            onChange={(event) => take(event.target.files)}
          />
        </label>
        {files.length ? (
          <ul>
            {files.map((file) => (
              <li key={file.name}>
                <span>{file.name}</span>
                <span data-part="size">{file.size}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  )
}
