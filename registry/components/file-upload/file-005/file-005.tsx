"use client"

import { useEffect, useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type File005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  initials?: string
  zoom?: number
  onChange?: (name: string | null) => void
  accent?: string
}

// Идея компонента: аватар обрезается там же, где выбирается. Круглая рамка
// показывает ровно то, что увидят другие, а ползунок масштаба закрывает
// главный случай — лицо у края кадра. Масштаб живёт в transform, поэтому
// картинка не перерисовывается, а сам ползунок — нативный input[type=range]:
// его двигают стрелками с клавиатуры, и подпись значения объявляется вслух.
const STYLES = `
:where([data-vibeui-block="file-005"]){
--vibeui-file-005-surface:oklch(1 0 0);
--vibeui-file-005-tile:oklch(0.96 0.006 265);
--vibeui-file-005-fg:oklch(0.23 0.014 265);
--vibeui-file-005-muted:oklch(0.55 0.014 265);
--vibeui-file-005-border:oklch(0.88 0.008 265);
--vibeui-file-005-shell:oklch(0.91 0.006 265);
--vibeui-file-005-accent:oklch(0.55 0.19 20);
--vibeui-file-005-zoom:1;
--vibeui-file-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: карточку показывают поверх любого фона. */
[data-vibeui-block="file-005"]{
display:flex;align-items:center;gap:0.875rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-file-005-surface);
border:1px solid var(--vibeui-file-005-shell);border-radius:0.875rem;
font-family:var(--vibeui-file-005-font);color:var(--vibeui-file-005-fg);
}
[data-vibeui-block="file-005"] *{box-sizing:border-box}
/* Круглая рамка показывает ровно то, что увидят другие. */
[data-vibeui-block="file-005"] label{
position:relative;flex:none;display:grid;place-items:center;
width:5rem;height:5rem;overflow:hidden;cursor:pointer;
border-radius:9999px;background:var(--vibeui-file-005-tile);
box-shadow:0 0 0 1px var(--vibeui-file-005-border),0 0 0 4px var(--vibeui-file-005-surface),0 0 0 5px var(--vibeui-file-005-border);
}
[data-vibeui-block="file-005"] label:has(input:focus-visible){
outline:2px solid var(--vibeui-file-005-accent);outline-offset:5px;
}
[data-vibeui-block="file-005"] input[type="file"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);border:0;
}
/* Масштаб через transform: картинка не перерисовывается на каждый шаг. */
[data-vibeui-block="file-005"] img{
width:100%;height:100%;object-fit:cover;display:block;
transform:scale(var(--vibeui-file-005-zoom));transform-origin:center;
transition:transform .12s linear;
}
[data-vibeui-block="file-005"] [data-part="initials"]{
font-size:1.375rem;font-weight:700;color:var(--vibeui-file-005-muted);
letter-spacing:0.02em;
}
[data-vibeui-block="file-005"] [data-part="veil"]{
position:absolute;inset:auto 0 0;padding:0.1875rem 0;
background:color-mix(in oklab,oklch(0 0 0) 55%,transparent);
color:oklch(1 0 0);font-size:0.5625rem;font-weight:650;text-align:center;
text-transform:uppercase;letter-spacing:0.04em;
}
[data-vibeui-block="file-005"] [data-part="side"]{
display:flex;flex-direction:column;gap:0.375rem;min-width:0;flex:1;
}
[data-vibeui-block="file-005"] [data-part="title"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="file-005"] [data-part="note"]{
margin:0;font-size:0.6875rem;line-height:1.4;color:var(--vibeui-file-005-muted);
}
[data-vibeui-block="file-005"] [data-part="zoom"]{
display:flex;flex-direction:column;gap:0.125rem;
font-size:0.6875rem;color:var(--vibeui-file-005-muted);
}
/* Нативный range: стрелки с клавиатуры и объявление значения даром. */
[data-vibeui-block="file-005"] input[type="range"]{
appearance:none;width:100%;height:1rem;background:none;cursor:pointer;margin:0;
}
[data-vibeui-block="file-005"] input[type="range"]::-webkit-slider-runnable-track{
height:0.25rem;border-radius:9999px;background:var(--vibeui-file-005-tile);
}
[data-vibeui-block="file-005"] input[type="range"]::-moz-range-track{
height:0.25rem;border-radius:9999px;background:var(--vibeui-file-005-tile);
}
[data-vibeui-block="file-005"] input[type="range"]::-webkit-slider-thumb{
appearance:none;width:0.875rem;height:0.875rem;margin-top:-0.3125rem;
border-radius:9999px;background:var(--vibeui-file-005-accent);
border:2px solid var(--vibeui-file-005-surface);
}
[data-vibeui-block="file-005"] input[type="range"]::-moz-range-thumb{
width:0.875rem;height:0.875rem;border-radius:9999px;
background:var(--vibeui-file-005-accent);
border:2px solid var(--vibeui-file-005-surface);
}
[data-vibeui-block="file-005"] input[type="range"]:focus-visible{outline:2px solid var(--vibeui-file-005-accent);outline-offset:2px;border-radius:9999px}
[data-vibeui-block="file-005"] input[type="range"]:disabled{cursor:not-allowed;opacity:.45}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="file-005"] *{animation:none!important;transition:none!important}}
`

/**
 * Загрузка аватара с круглой обрезкой и ползунком масштаба.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function File005({
  label = "Фото профиля",
  initials = "АК",
  zoom = 1.1,
  onChange,
  accent,
  className,
  style,
  ...props
}: File005Props) {
  const id = useId()
  const [preview, setPreview] = useState<string | null>(null)
  const [scale, setScale] = useState(zoom)

  // Ссылку обязательно освобождаем: иначе вкладка копит изображения в памяти.
  useEffect(() => {
    if (!preview) return
    return () => URL.revokeObjectURL(preview)
  }, [preview])

  const palette = {
    "--vibeui-file-005-zoom": String(scale),
    ...(accent ? { "--vibeui-file-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-file-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="file-005"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>
          {preview ? (
            <img src={preview} alt="Выбранное фото профиля" />
          ) : (
            <span data-part="initials" aria-hidden="true">
              {initials}
            </span>
          )}
          <span data-part="veil">сменить</span>
          <input
            id={id}
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (!file) return
              setPreview(URL.createObjectURL(file))
              onChange?.(file.name)
            }}
          />
        </label>

        <div data-part="side">
          <span data-part="title">{label}</span>
          <p data-part="note">
            Квадрат обрежется по кругу — так фото увидят в комментариях.
          </p>
          <span data-part="zoom">
            <label htmlFor={`${id}-zoom`}>
              Масштаб · {Math.round(scale * 100)}%
            </label>
            <input
              id={`${id}-zoom`}
              type="range"
              min={1}
              max={2}
              step={0.05}
              value={scale}
              disabled={!preview}
              onChange={(event) => setScale(Number(event.target.value))}
            />
          </span>
        </div>
      </div>
    </>
  )
}
