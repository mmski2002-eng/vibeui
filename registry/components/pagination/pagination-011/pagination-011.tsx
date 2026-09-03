"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Pagination011Props = {
  total?: number
  batch?: number
  defaultShown?: number
  /** Строка счётчика. {shown} и {total} подставляются. */
  countText?: string
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  labelText?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: прогресс догрузки не обязан быть полоской. Здесь его несёт
// сама кнопка — кольцо конического градиента заполняется на долю показанного,
// а число внутри называет следующую порцию. Дочитали до конца — кольцо
// смыкается, кнопка гаснет и уступает место галочке.
const STYLES = `
:where([data-vibeui-block="pagination-011"]){
--vibeui-pagination-011-bg:transparent;
--vibeui-pagination-011-hole:light-dark(oklch(1 0 0),oklch(0.21 0.008 265));
--vibeui-pagination-011-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.006 265));
--vibeui-pagination-011-muted:color-mix(in oklab,var(--vibeui-pagination-011-fg) 68%,transparent);
--vibeui-pagination-011-border:light-dark(oklch(0.91 0.006 265),oklch(0.38 0.012 265));
--vibeui-pagination-011-track:light-dark(oklch(0.91 0.006 265),oklch(0.4 0.012 265));
--vibeui-pagination-011-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.16 262));
--vibeui-pagination-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pagination-011"]{color-scheme:dark}
[data-vibeui-block="pagination-011"]{
box-sizing:border-box;width:100%;max-width:16rem;padding:1.25rem 1rem;
display:flex;flex-direction:column;align-items:center;gap:0.75rem;
background:var(--vibeui-pagination-011-bg);color:var(--vibeui-pagination-011-fg);
border:1px solid var(--vibeui-pagination-011-border);border-radius:0.875rem;
font-family:var(--vibeui-pagination-011-font);
}
[data-vibeui-block="pagination-011"] [data-part="dial"]{
appearance:none;cursor:pointer;width:4.5rem;height:4.5rem;padding:0.3125rem;
box-sizing:border-box;border:0;border-radius:50%;
background:conic-gradient(var(--vibeui-pagination-011-accent) var(--vibeui-pagination-011-percent),var(--vibeui-pagination-011-track) 0);
transition:background .3s ease;
}
[data-vibeui-block="pagination-011"] [data-part="dial"]:disabled{cursor:default}
[data-vibeui-block="pagination-011"] [data-part="dial"]:focus-visible{outline:2px solid var(--vibeui-pagination-011-accent);outline-offset:2px}
[data-vibeui-block="pagination-011"] [data-part="hole"]{
width:100%;height:100%;border-radius:50%;box-sizing:border-box;
display:grid;place-items:center;
background:var(--vibeui-pagination-011-hole);color:var(--vibeui-pagination-011-fg);
font-size:0.875rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pagination-011"] [data-part="count"]{
margin:0;font-size:0.8125rem;color:var(--vibeui-pagination-011-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pagination-011"] [data-part="now"]{color:var(--vibeui-pagination-011-fg);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pagination-011"] *{animation:none!important;transition:none!important}}
`

const LABEL: Record<string, string> = {
  done: "Загружено всё: {total}",
  more: "Показать ещё {count} из {total}",
}

const COUNT_TEXT = "Показано {shown} из {total}"

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
 * «Показать ещё» в виде кольцевого индикатора: доля показанного заполняет
 * кнопку-кольцо, число внутри называет следующую порцию.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Pagination011({
  total = 240,
  batch = 60,
  defaultShown = 60,
  countText = COUNT_TEXT,
  labelText = LABEL,
  background = "",
  accent,
  className,
  style,
}: Pagination011Props) {
  const [shown, setShown] = useState(Math.min(defaultShown, total))

  const done = shown >= total
  const percent = Math.round((shown / total) * 100)

  const palette = {
    "--vibeui-pagination-011-percent": `${percent}%`,
    ...(accent ? { "--vibeui-pagination-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pagination-011-bg": background,
          "--vibeui-pagination-011-hole": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-pagination-011" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="pagination"
        data-vibeui-block="pagination-011"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="dial"
          disabled={done}
          aria-label={
            done
              ? (labelText.done ?? LABEL.done).replace("{total}", String(total))
              : (labelText.more ?? LABEL.more)
                  .replace("{count}", String(Math.min(batch, total - shown)))
                  .replace("{total}", String(total))
          }
          onClick={() => setShown(Math.min(shown + batch, total))}
        >
          <span data-part="hole" aria-hidden="true">
            {done ? "✓" : `+${Math.min(batch, total - shown)}`}
          </span>
        </button>
        <p data-part="count" aria-live="polite">
          {countText.split(/({shown}|{total})/).map((part, index) =>
            part === "{shown}" ? (
              <span key={index} data-part="now">
                {shown}
              </span>
            ) : part === "{total}" ? (
              String(total)
            ) : (
              part
            ),
          )}
        </p>
      </div>
    </>
  )
}
