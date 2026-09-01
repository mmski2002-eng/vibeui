"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"

export type Pagination006Props = {
  total?: number
  batch?: number
  height?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: бесконечная лента, у которой всё-таки есть кнопка. Догрузку
// запускает IntersectionObserver по маячку в конце списка, но сам маячок — это
// живая кнопка: до неё доезжают табуляцией и жмут с клавиатуры, когда прокрутка
// недоступна. Итог догрузки объявляется через aria-live, иначе он проходит мимо.
const STYLES = `
:where([data-vibeui-block="pagination-006"]){
--vibeui-pagination-006-bg:oklch(1 0 0);
--vibeui-pagination-006-row:oklch(0.975 0.003 265);
--vibeui-pagination-006-fg:oklch(0.24 0.014 265);
--vibeui-pagination-006-muted:oklch(0.55 0.014 265);
--vibeui-pagination-006-border:oklch(0.91 0.006 265);
--vibeui-pagination-006-hover:oklch(0.55 0.02 265 / 8%);
--vibeui-pagination-006-accent:oklch(0.55 0.2 262);
--vibeui-pagination-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="pagination-006"]{
box-sizing:border-box;width:100%;max-width:26rem;
background:var(--vibeui-pagination-006-bg);color:var(--vibeui-pagination-006-fg);
border:1px solid var(--vibeui-pagination-006-border);border-radius:0.875rem;
font-family:var(--vibeui-pagination-006-font);overflow:hidden;
}
[data-vibeui-block="pagination-006"] [data-part="feed"]{
height:var(--vibeui-pagination-006-height);overflow-y:auto;padding:0.5rem;box-sizing:border-box;
}
[data-vibeui-block="pagination-006"] [data-part="list"]{margin:0;padding:0;list-style:none;display:grid;gap:0.25rem}
[data-vibeui-block="pagination-006"] [data-part="row"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.5rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-pagination-006-row);font-size:0.8125rem;
}
[data-vibeui-block="pagination-006"] [data-part="num"]{
min-width:1.75rem;font-variant-numeric:tabular-nums;color:var(--vibeui-pagination-006-muted);
}
/* Маячок и есть кнопка: наблюдатель следит за ней, клавиатура жмёт её же. */
[data-vibeui-block="pagination-006"] [data-part="beacon"]{
appearance:none;cursor:pointer;width:100%;margin-top:0.25rem;
height:2.25rem;border-radius:0.5rem;box-sizing:border-box;
border:1px dashed var(--vibeui-pagination-006-border);background:none;
font:inherit;font-size:0.8125rem;color:var(--vibeui-pagination-006-muted);
}
[data-vibeui-block="pagination-006"] [data-part="beacon"]:hover{background:var(--vibeui-pagination-006-hover);color:var(--vibeui-pagination-006-fg)}
[data-vibeui-block="pagination-006"] [data-part="beacon"]:focus-visible{outline:2px solid var(--vibeui-pagination-006-accent);outline-offset:-1px}
[data-vibeui-block="pagination-006"] [data-part="bar"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.5rem 0.75rem;border-top:1px solid var(--vibeui-pagination-006-border);
font-size:0.75rem;color:var(--vibeui-pagination-006-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pagination-006"] [data-part="top"]{
appearance:none;border:0;background:none;cursor:pointer;padding:0.125rem 0.25rem;
font:inherit;font-size:0.75rem;color:var(--vibeui-pagination-006-accent);border-radius:0.25rem;
}
[data-vibeui-block="pagination-006"] [data-part="top"]:focus-visible{outline:2px solid var(--vibeui-pagination-006-accent);outline-offset:1px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pagination-006"] *{animation:none!important;transition:none!important}}
`

/**
 * Бесконечная лента с кнопкой-якорем: догрузка по прокрутке и с клавиатуры.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Pagination006({
  total = 60,
  batch = 10,
  height = "13rem",
  accent,
  className,
  style,
}: Pagination006Props) {
  const [shown, setShown] = useState(Math.min(batch, total))
  const beaconRef = useRef<HTMLButtonElement>(null)
  const feedRef = useRef<HTMLDivElement>(null)

  const palette = {
    "--vibeui-pagination-006-height": height,
    ...(accent ? { "--vibeui-pagination-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  const done = shown >= total

  // Наблюдатель ограничен своей областью прокрутки: лента живёт внутри блока,
  // а не в окне, и следить за окном было бы неверно.
  useEffect(() => {
    const beacon = beaconRef.current

    if (!beacon || done) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown((current) => Math.min(current + batch, total))
        }
      },
      { root: feedRef.current, rootMargin: "0px 0px 40px 0px" },
    )

    observer.observe(beacon)
    return () => observer.disconnect()
  }, [batch, done, shown, total])

  return (
    <>
      <style href="vibeui-pagination-006" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="pagination-006"
        className={className}
        style={palette}
      >
        <div data-part="feed" ref={feedRef} tabIndex={0} aria-label="Лента">
          <ul data-part="list">
            {Array.from({ length: shown }, (unused, index) => (
              <li key={index} data-part="row">
                <span data-part="num">{index + 1}</span>
                Запись из ленты — заголовок и дата
              </li>
            ))}
          </ul>
          {done ? null : (
            <button
              type="button"
              data-part="beacon"
              ref={beaconRef}
              onClick={() => setShown(Math.min(shown + batch, total))}
            >
              Загрузить ещё {Math.min(batch, total - shown)}
            </button>
          )}
        </div>
        <p data-part="bar">
          <span aria-live="polite">
            {done
              ? `Загружено всё: ${total}`
              : `Загружено ${shown} из ${total}`}
          </span>
          <button
            type="button"
            data-part="top"
            onClick={() => feedRef.current?.scrollTo({ top: 0 })}
          >
            Наверх
          </button>
        </p>
      </div>
    </>
  )
}
