"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type File005Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  initials?: string
  zoom?: number
  /** Пояснение под подписью. */
  note?: string
  /** Подпись поверх рамки. */
  changeText?: string
  /** Подпись ползунка: {value} — масштаб в процентах. */
  zoomText?: string
  /** Альтернативный текст выбранного фото. */
  photoAlt?: string
  /** Уже загруженное фото: адрес из профиля. Пусто — показываются инициалы. */
  photo?: string
  onChange?: (name: string | null) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: аватар обрезается там же, где выбирается. Круглая рамка
// показывает ровно то, что увидят другие, а ползунок масштаба закрывает
// главный случай — лицо у края кадра. Масштаб живёт в transform, поэтому
// картинка не перерисовывается, а сам ползунок — нативный input[type=range]:
// его двигают стрелками с клавиатуры, и подпись значения объявляется вслух.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у карточки
// по умолчанию нет, она лежит прямо на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="file-005"]){
--vibeui-file-005-surface:transparent;
--vibeui-file-005-tile:light-dark(oklch(0.96 0 265),oklch(0.29 0 265));
--vibeui-file-005-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-file-005-muted:color-mix(in oklab,var(--vibeui-file-005-fg) 68%,transparent);
--vibeui-file-005-border:light-dark(oklch(0.88 0 265),oklch(0.42 0 265));
--vibeui-file-005-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-file-005-accent:light-dark(oklch(0.55 0.19 20),oklch(0.72 0.17 20));
--vibeui-file-005-zoom:1;
--vibeui-file-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="file-005"]{color-scheme:dark}
/* Карточка без собственной заливки: рамка очерчивает её на любом фоне. */
[data-vibeui-block="file-005"]{
display:flex;align-items:center;gap:0.875rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-file-005-surface);
border:1px solid var(--vibeui-file-005-shell);border-radius:0.875rem;
font-family:var(--vibeui-file-005-font);color:var(--vibeui-file-005-fg);
}
[data-vibeui-block="file-005"] *{box-sizing:border-box}
/* Круглая рамка показывает ровно то, что увидят другие. Правило именное:
   по голому label под него попадала и подпись ползунка — она получала круг
   80×80 и наезжала на текст карточки. */
[data-vibeui-block="file-005"] [data-part="frame"]{
position:relative;flex:none;display:grid;place-items:center;
width:5rem;height:5rem;overflow:hidden;cursor:pointer;
border-radius:9999px;background:var(--vibeui-file-005-tile);
box-shadow:0 0 0 1px var(--vibeui-file-005-border),0 0 0 4px var(--vibeui-file-005-surface),0 0 0 5px var(--vibeui-file-005-border);
}
[data-vibeui-block="file-005"] [data-part="frame"]:has(input:focus-visible){
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
display:flex;flex-direction:column;gap:0.25rem;
font-size:0.6875rem;color:var(--vibeui-file-005-muted);
}
[data-vibeui-block="file-005"] [data-part="zoom"] label{
font-variant-numeric:tabular-nums;
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
 * Загрузка аватара с круглой обрезкой и ползунком масштаба.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function File005({
  label = "Фото профиля",
  initials = "АК",
  zoom = 1.1,
  note = "Квадрат обрежется по кругу — так фото увидят в комментариях.",
  changeText = "сменить",
  zoomText = "Масштаб · {value}%",
  photoAlt = "Выбранное фото профиля",
  photo,
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: File005Props) {
  const id = useId()
  const [preview, setPreview] = useState<string | null>(photo ?? null)
  const [scale, setScale] = useState(zoom)
  // Освобождать нужно только собственные объектные ссылки: адрес из профиля
  // живёт своей жизнью, и revoke сломал бы его.
  const objectUrl = useRef<string | null>(null)

  useEffect(
    () => () => {
      if (objectUrl.current) {
        URL.revokeObjectURL(objectUrl.current)
      }
    },
    [],
  )

  const palette = {
    "--vibeui-file-005-zoom": String(scale),
    ...(accent ? { "--vibeui-file-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-file-005-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-file-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="file-upload"
        data-vibeui-block="file-005"
        className={className}
        style={palette}
      >
        <label data-part="frame" htmlFor={id}>
          {preview ? (
            <img src={preview} alt={photoAlt} />
          ) : (
            <span data-part="initials" aria-hidden="true">
              {initials}
            </span>
          )}
          <span data-part="veil">{changeText}</span>
          <input
            id={id}
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (!file) return

              if (objectUrl.current) {
                URL.revokeObjectURL(objectUrl.current)
              }

              objectUrl.current = URL.createObjectURL(file)
              setPreview(objectUrl.current)
              onChange?.(file.name)
            }}
          />
        </label>

        <div data-part="side">
          <span data-part="title">{label}</span>
          <p data-part="note">{note}</p>
          <span data-part="zoom">
            <label htmlFor={`${id}-zoom`}>
              {zoomText.replace("{value}", String(Math.round(scale * 100)))}
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
