"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties, UIEvent } from "react"

export type Pagination012Props = {
  total?: number
  batch?: number
  height?: string
  delay?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: лента без кнопки — прокрутка сама подгружает следующую
// порцию, когда до низа остаётся немного места. Подгрузка не мгновенна:
// внизу на время запроса появляются пульсирующие точки, а состояние озвучено
// через aria-live. Кнопки на виду нет намеренно, но она не исчезла совсем —
// спрятанная, но фокусируемая, она остаётся рабочим способом догрузки
// с клавиатуры и для скринридера.
const STYLES = `
:where([data-vibeui-block="pagination-012"]){
--vibeui-pagination-012-bg:oklch(1 0 0);
--vibeui-pagination-012-row:oklch(0.975 0.003 265);
--vibeui-pagination-012-fg:oklch(0.24 0.014 265);
--vibeui-pagination-012-muted:oklch(0.55 0.014 265);
--vibeui-pagination-012-border:oklch(0.91 0.006 265);
--vibeui-pagination-012-accent:oklch(0.55 0.2 262);
--vibeui-pagination-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="pagination-012"]{
box-sizing:border-box;width:100%;max-width:26rem;
background:var(--vibeui-pagination-012-bg);color:var(--vibeui-pagination-012-fg);
border:1px solid var(--vibeui-pagination-012-border);border-radius:0.875rem;
font-family:var(--vibeui-pagination-012-font);overflow:hidden;position:relative;
}
[data-vibeui-block="pagination-012"] [data-part="feed"]{
height:var(--vibeui-pagination-012-height);overflow-y:auto;padding:0.5rem;box-sizing:border-box;
}
[data-vibeui-block="pagination-012"] [data-part="list"]{margin:0;padding:0;list-style:none;display:grid;gap:0.25rem}
[data-vibeui-block="pagination-012"] [data-part="row"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.5rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-pagination-012-row);font-size:0.8125rem;
}
[data-vibeui-block="pagination-012"] [data-part="num"]{
min-width:1.75rem;font-variant-numeric:tabular-nums;color:var(--vibeui-pagination-012-muted);
}
[data-vibeui-block="pagination-012"] [data-part="bottom"]{
display:flex;align-items:center;justify-content:center;gap:0.5rem;
min-height:2.25rem;padding:0.375rem 0.75rem;border-top:1px solid var(--vibeui-pagination-012-border);
font-size:0.75rem;color:var(--vibeui-pagination-012-muted);
}
[data-vibeui-block="pagination-012"] [data-part="dots"]{display:inline-flex;gap:0.25rem;visibility:hidden}
[data-vibeui-block="pagination-012"] [data-part="dots"][data-active="true"]{visibility:visible}
[data-vibeui-block="pagination-012"] [data-part="dots"] span{
width:0.375rem;height:0.375rem;border-radius:50%;background:var(--vibeui-pagination-012-accent);
animation:vibeui-pagination-012-pulse 1s ease-in-out infinite;
}
[data-vibeui-block="pagination-012"] [data-part="dots"] span:nth-child(2){animation-delay:.15s}
[data-vibeui-block="pagination-012"] [data-part="dots"] span:nth-child(3){animation-delay:.3s}
@keyframes vibeui-pagination-012-pulse{0%,80%,100%{opacity:.25;transform:scale(.75)}40%{opacity:1;transform:scale(1)}}
/* Спрятанная, но фокусируемая кнопка: работает с клавиатуры, когда прокрутка недоступна. */
[data-vibeui-block="pagination-012"] [data-part="fallback"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip:rect(0,0,0,0);white-space:nowrap;border:0;background:none;color:inherit;font:inherit;cursor:pointer;
}
[data-vibeui-block="pagination-012"] [data-part="fallback"]:focus-visible{
position:static;width:auto;height:auto;margin:0.375rem auto 0;padding:0.25rem 0.75rem;
overflow:visible;clip:auto;white-space:normal;display:block;
border:1px solid var(--vibeui-pagination-012-border);border-radius:0.5rem;
outline:2px solid var(--vibeui-pagination-012-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pagination-012"] *{animation:none!important;transition:none!important}}
`

/**
 * Бесконечная лента с автоматической подгрузкой по прокрутке и точками
 * внизу вместо кнопки. Скрытая, но фокусируемая кнопка остаётся запасным
 * способом догрузки с клавиатуры.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Pagination012({
  total = 90,
  batch = 15,
  height = "13rem",
  delay = 450,
  accent,
  className,
  style,
}: Pagination012Props) {
  const [shown, setShown] = useState(Math.min(batch, total))
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const done = shown >= total

  const palette = {
    "--vibeui-pagination-012-height": height,
    ...(accent ? { "--vibeui-pagination-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  useEffect(() => {
    return () => clearTimeout(timer.current)
  }, [])

  function loadMore() {
    if (loading || done) {
      return
    }

    setLoading(true)
    timer.current = setTimeout(() => {
      setShown((current) => Math.min(current + batch, total))
      setLoading(false)
    }, delay)
  }

  function onScroll(event: UIEvent<HTMLDivElement>) {
    const node = event.currentTarget
    const distanceToBottom =
      node.scrollHeight - node.scrollTop - node.clientHeight

    if (distanceToBottom < 32) {
      loadMore()
    }
  }

  return (
    <>
      <style href="vibeui-pagination-012" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="pagination-012"
        className={className}
        style={palette}
      >
        <div
          data-part="feed"
          role="region"
          aria-label="Лента записей"
          tabIndex={0}
          onScroll={onScroll}
        >
          <ul data-part="list">
            {Array.from({ length: shown }, (unused, index) => (
              <li key={index} data-part="row">
                <span data-part="num">{index + 1}</span>
                Запись из ленты — заголовок и дата
              </li>
            ))}
          </ul>
        </div>
        <p data-part="bottom">
          <span
            data-part="dots"
            data-active={loading || undefined}
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
          </span>
          <span aria-live="polite">
            {done
              ? `Показаны все записи: ${total}`
              : loading
                ? "Загрузка…"
                : `Показано ${shown} из ${total}`}
          </span>
          {done ? null : (
            <button type="button" data-part="fallback" onClick={loadMore}>
              Загрузить ещё
            </button>
          )}
        </p>
      </div>
    </>
  )
}
