"use client"

import { useEffect, useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type File004Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  hint?: string
  accept?: string
  /** Подпись на пустой плитке. */
  pickText?: string
  /** Подпись под плиткой, пока файл не выбран. */
  emptyText?: string
  /** Подпись кнопки очистки. */
  removeText?: string
  /** Альтернативный текст превью: {name} — имя файла. */
  previewAlt?: string
  onChange?: (name: string | null) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: одна картинка и её превью на месте выбора. Имя файла
// ничего не говорит о содержимом — «IMG_2047.jpg» одинаково похоже и на
// нужный кадр, и на соседний. Превью строится из самого файла через
// createObjectURL, поэтому ничего не грузится на сервер до отправки формы, а
// прошлая ссылка обязательно освобождается: иначе вкладка копит изображения.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у поля
// по умолчанию нет, оно лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="file-004"]){
--vibeui-file-004-surface:transparent;
--vibeui-file-004-tile:light-dark(oklch(0.975 0.004 265),oklch(0.27 0.012 265));
--vibeui-file-004-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-file-004-muted:color-mix(in oklab,var(--vibeui-file-004-fg) 68%,transparent);
--vibeui-file-004-border:light-dark(oklch(0.88 0.008 265),oklch(0.42 0.014 265));
--vibeui-file-004-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-file-004-accent:light-dark(oklch(0.55 0.16 200),oklch(0.76 0.14 200));
--vibeui-file-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="file-004"]{color-scheme:dark}
/* Панель без собственной заливки: рамка очерчивает поле на любом фоне. */
[data-vibeui-block="file-004"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-file-004-surface);
border:1px solid var(--vibeui-file-004-shell);border-radius:0.875rem;
font-family:var(--vibeui-file-004-font);color:var(--vibeui-file-004-fg);
}
[data-vibeui-block="file-004"] *{box-sizing:border-box}
[data-vibeui-block="file-004"] [data-part="caption"]{font-size:0.8125rem;font-weight:650}
/* Плитка превью: и место выбора, и место показа — одно и то же. */
[data-vibeui-block="file-004"] label{
position:relative;display:flex;flex-direction:column;
align-items:center;justify-content:center;gap:0.3125rem;
aspect-ratio:16 / 10;padding:0.75rem;overflow:hidden;cursor:pointer;
background:var(--vibeui-file-004-tile);
border:1.5px dashed var(--vibeui-file-004-border);border-radius:0.75rem;
text-align:center;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="file-004"] label:hover{border-color:var(--vibeui-file-004-accent)}
[data-vibeui-block="file-004"] label:has(input:focus-visible){
outline:2px solid var(--vibeui-file-004-accent);outline-offset:2px;
}
[data-vibeui-block="file-004"][data-filled="true"] label{border-style:solid;padding:0}
[data-vibeui-block="file-004"] input{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);border:0;
}
[data-vibeui-block="file-004"] img{
width:100%;height:100%;object-fit:cover;display:block;
}
[data-vibeui-block="file-004"] [data-part="frame"]{
position:relative;width:1.75rem;height:1.5rem;
border:1.5px solid var(--vibeui-file-004-muted);border-radius:0.25rem;
overflow:hidden;
}
[data-vibeui-block="file-004"] [data-part="frame"]::before{
content:"";position:absolute;left:0.25rem;bottom:0.1875rem;
width:0.5rem;height:0.5rem;transform:rotate(45deg);
background:var(--vibeui-file-004-muted);
}
[data-vibeui-block="file-004"] [data-part="frame"]::after{
content:"";position:absolute;right:0.25rem;top:0.25rem;
width:0.3125rem;height:0.3125rem;border-radius:9999px;
background:var(--vibeui-file-004-muted);
}
[data-vibeui-block="file-004"] [data-part="pick"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="file-004"] [data-part="hint"]{
margin:0;font-size:0.6875rem;line-height:1.4;color:var(--vibeui-file-004-muted);
}
[data-vibeui-block="file-004"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;color:var(--vibeui-file-004-muted);
}
[data-vibeui-block="file-004"] [data-part="file"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="file-004"] button{
appearance:none;flex:none;cursor:pointer;
padding:0.25rem 0.5rem;border-radius:0.375rem;
border:1px solid var(--vibeui-file-004-border);background:none;color:inherit;
font:inherit;font-size:0.6875rem;font-weight:650;
}
[data-vibeui-block="file-004"] button:hover{border-color:var(--vibeui-file-004-accent);color:var(--vibeui-file-004-accent)}
[data-vibeui-block="file-004"] button:focus-visible{outline:2px solid var(--vibeui-file-004-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="file-004"] *{animation:none!important;transition:none!important}}
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
 * Загрузка одной картинки: превью строится из файла, до отправки ничего не летит.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function File004({
  label = "Обложка статьи",
  hint = "JPG или PNG, лучше 1200 × 750",
  accept = "image/png,image/jpeg,image/webp",
  pickText = "Выбрать изображение",
  emptyText = "Файл не выбран",
  removeText = "Убрать",
  previewAlt = "Превью файла {name}",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: File004Props) {
  const id = useId()
  const [preview, setPreview] = useState<string | null>(null)
  const [name, setName] = useState<string | null>(null)

  // Ссылку обязательно освобождаем: иначе вкладка копит изображения в памяти.
  useEffect(() => {
    if (!preview) return
    return () => URL.revokeObjectURL(preview)
  }, [preview])

  const palette = {
    ...(accent ? { "--vibeui-file-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-file-004-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const take = (file: File | undefined) => {
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setName(file.name)
    onChange?.(file.name)
  }

  const clear = () => {
    setPreview(null)
    setName(null)
    onChange?.(null)
  }

  return (
    <>
      <style href="vibeui-file-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="file-upload"
        data-vibeui-block="file-004"
        data-filled={preview ? "true" : undefined}
        className={className}
        style={palette}
      >
        <span data-part="caption">{label}</span>
        <label htmlFor={id}>
          {preview ? (
            <img src={preview} alt={previewAlt.replace("{name}", name ?? "")} />
          ) : (
            <>
              <span data-part="frame" aria-hidden="true" />
              <span data-part="pick">{pickText}</span>
              <span data-part="hint">{hint}</span>
            </>
          )}
          <input
            id={id}
            type="file"
            accept={accept}
            onChange={(event) => take(event.target.files?.[0])}
          />
        </label>
        <div data-part="foot">
          <span data-part="file">{name ?? emptyText}</span>
          {name ? (
            <button type="button" onClick={clear}>
              {removeText}
            </button>
          ) : null}
        </div>
      </div>
    </>
  )
}
