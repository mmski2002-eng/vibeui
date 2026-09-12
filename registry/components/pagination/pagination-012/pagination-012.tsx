"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties, UIEvent } from "react"

export type Pagination012Props = {
  total?: number
  batch?: number
  height?: string
  delay?: number
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  labelText?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
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
--vibeui-pagination-012-bg:transparent;
--vibeui-pagination-012-row:light-dark(oklch(0.975 0 265),oklch(0.27 0 265));
--vibeui-pagination-012-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-pagination-012-muted:color-mix(in oklab,var(--vibeui-pagination-012-fg) 68%,transparent);
--vibeui-pagination-012-border:light-dark(oklch(0.91 0 265),oklch(0.38 0 265));
--vibeui-pagination-012-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-pagination-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pagination-012"]{color-scheme:dark}
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
animation:vibeui-pagination-012-pulse 1s ease-in-out infinite;color:oklch(from var(--vibeui-pagination-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
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

const LABEL: Record<string, string> = {
  feed: "Лента записей",
  row: "Запись из ленты — заголовок и дата",
  loading: "Загрузка…",
  shown: "Показано {shown} из {total}",
  done: "Показаны все записи: {total}",
  more: "Загрузить ещё",
}

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
  labelText = LABEL,
  background = "",
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
    ...(background
      ? {
          "--vibeui-pagination-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        data-slot="pagination"
        data-vibeui-block="pagination-012"
        className={className}
        style={palette}
      >
        <div
          data-part="feed"
          role="region"
          aria-label={labelText.feed ?? LABEL.feed}
          tabIndex={0}
          onScroll={onScroll}
        >
          <ul data-part="list">
            {Array.from({ length: shown }, (unused, index) => (
              <li key={index} data-part="row">
                <span data-part="num">{index + 1}</span>
                {labelText.row ?? LABEL.row}
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
              ? (labelText.done ?? LABEL.done).replace("{total}", String(total))
              : loading
                ? (labelText.loading ?? LABEL.loading)
                : (labelText.shown ?? LABEL.shown)
                    .replace("{shown}", String(shown))
                    .replace("{total}", String(total))}
          </span>
          {done ? null : (
            <button type="button" data-part="fallback" onClick={loadMore}>
              {labelText.more ?? LABEL.more}
            </button>
          )}
        </p>
      </div>
    </>
  )
}
