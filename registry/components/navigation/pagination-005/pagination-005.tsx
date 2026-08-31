"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Pagination005Props = {
  total?: number
  perPage?: number
  defaultShown?: number
  label?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: вместо страниц — одна кнопка «показать ещё» с честной шкалой.
// Список растёт вниз, поэтому прочитанное не пропадает и место в нём не теряется,
// а полоса и подпись «12 из 84» отвечают на главный вопрос такого списка: сколько
// ещё осталось. Сообщение о догрузке уходит в aria-live, иначе оно пройдёт мимо.
const STYLES = `
:where([data-vibeui-block="pagination-005"]){
--vibeui-pagination-005-bg:oklch(1 0 0);
--vibeui-pagination-005-fg:oklch(0.24 0.014 265);
--vibeui-pagination-005-muted:oklch(0.55 0.014 265);
--vibeui-pagination-005-border:oklch(0.91 0.006 265);
--vibeui-pagination-005-track:oklch(0.94 0.004 265);
--vibeui-pagination-005-hover:oklch(0.55 0.02 265 / 8%);
--vibeui-pagination-005-accent:oklch(0.55 0.2 262);
--vibeui-pagination-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="pagination-005"]{
box-sizing:border-box;width:100%;max-width:26rem;padding:1rem;
display:flex;flex-direction:column;align-items:center;gap:0.625rem;
background:var(--vibeui-pagination-005-bg);color:var(--vibeui-pagination-005-fg);
border:1px solid var(--vibeui-pagination-005-border);border-radius:0.875rem;
font-family:var(--vibeui-pagination-005-font);
}
[data-vibeui-block="pagination-005"] [data-part="track"]{
width:100%;height:0.25rem;border-radius:999px;overflow:hidden;
background:var(--vibeui-pagination-005-track);
}
/* Ширина заливки приходит переменной: считать её в CSS не из чего. */
[data-vibeui-block="pagination-005"] [data-part="fill"]{
display:block;height:100%;border-radius:999px;
width:var(--vibeui-pagination-005-progress);
background:var(--vibeui-pagination-005-accent);
transition:width .28s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="pagination-005"] [data-part="count"]{
margin:0;font-size:0.8125rem;color:var(--vibeui-pagination-005-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pagination-005"] [data-part="now"]{color:var(--vibeui-pagination-005-fg);font-weight:650}
[data-vibeui-block="pagination-005"] [data-part="more"]{
appearance:none;cursor:pointer;
min-width:11rem;height:2.375rem;padding:0 1.25rem;box-sizing:border-box;
display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
border:1px solid var(--vibeui-pagination-005-border);border-radius:0.625rem;
background:none;color:inherit;font:inherit;font-size:0.875rem;font-weight:550;
transition:background-color .14s ease;
}
[data-vibeui-block="pagination-005"] [data-part="more"]:hover:not(:disabled){background:var(--vibeui-pagination-005-hover)}
[data-vibeui-block="pagination-005"] [data-part="more"]:focus-visible{outline:2px solid var(--vibeui-pagination-005-accent);outline-offset:2px}
[data-vibeui-block="pagination-005"] [data-part="more"]:disabled{color:var(--vibeui-pagination-005-muted);cursor:default}
[data-vibeui-block="pagination-005"] [data-part="chevron"]{
width:0.4375rem;height:0.4375rem;margin-top:-0.25rem;
border:1.5px solid currentColor;border-left:0;border-top:0;transform:rotate(45deg);
}
[data-vibeui-block="pagination-005"] [data-part="done"]{margin:0;font-size:0.8125rem;color:var(--vibeui-pagination-005-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pagination-005"] *{animation:none!important;transition:none!important}}
`

/**
 * «Показать ещё» вместо страниц: шкала прогресса и счётчик показанного.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Pagination005({
  total = 84,
  perPage = 12,
  defaultShown = 12,
  label = "Показать ещё",
  accent,
  className,
  style,
}: Pagination005Props) {
  const [shown, setShown] = useState(Math.min(defaultShown, total))

  const done = shown >= total
  const palette = {
    "--vibeui-pagination-005-progress": `${Math.round((shown / total) * 100)}%`,
    ...(accent ? { "--vibeui-pagination-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-pagination-005" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="pagination-005"
        className={className}
        style={palette}
      >
        <span
          data-part="track"
          role="progressbar"
          aria-valuenow={shown}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label="Показано из общего числа"
        >
          <span data-part="fill" />
        </span>
        <p data-part="count" aria-live="polite">
          Показано <span data-part="now">{shown}</span> из {total}
        </p>
        {done ? (
          <p data-part="done">Это всё, что нашлось</p>
        ) : (
          <button
            type="button"
            data-part="more"
            onClick={() => setShown(Math.min(shown + perPage, total))}
          >
            {label} {Math.min(perPage, total - shown)}
            <span data-part="chevron" aria-hidden="true" />
          </button>
        )}
      </div>
    </>
  )
}
