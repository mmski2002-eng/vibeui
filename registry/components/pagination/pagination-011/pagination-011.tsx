"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Pagination011Props = {
  total?: number
  batch?: number
  defaultShown?: number
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
--vibeui-pagination-011-bg:oklch(1 0 0);
--vibeui-pagination-011-fg:oklch(0.24 0.014 265);
--vibeui-pagination-011-muted:oklch(0.55 0.014 265);
--vibeui-pagination-011-border:oklch(0.91 0.006 265);
--vibeui-pagination-011-track:oklch(0.91 0.006 265);
--vibeui-pagination-011-accent:oklch(0.55 0.2 262);
--vibeui-pagination-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
background:var(--vibeui-pagination-011-bg);color:var(--vibeui-pagination-011-fg);
font-size:0.875rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pagination-011"] [data-part="count"]{
margin:0;font-size:0.8125rem;color:var(--vibeui-pagination-011-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pagination-011"] [data-part="now"]{color:var(--vibeui-pagination-011-fg);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pagination-011"] *{animation:none!important;transition:none!important}}
`

/**
 * «Показать ещё» в виде кольцевого индикатора: доля показанного заполняет
 * кнопку-кольцо, число внутри называет следующую порцию.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Pagination011({
  total = 240,
  batch = 60,
  defaultShown = 60,
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
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-pagination-011" precedence="medium">
        {STYLES}
      </style>
      <div
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
              ? `Загружено всё: ${total}`
              : `Показать ещё ${Math.min(batch, total - shown)} из ${total}`
          }
          onClick={() => setShown(Math.min(shown + batch, total))}
        >
          <span data-part="hole" aria-hidden="true">
            {done ? "✓" : `+${Math.min(batch, total - shown)}`}
          </span>
        </button>
        <p data-part="count" aria-live="polite">
          Показано <span data-part="now">{shown}</span> из {total}
        </p>
      </div>
    </>
  )
}
