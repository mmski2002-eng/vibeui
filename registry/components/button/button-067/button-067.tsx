"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Button067Props = Omit<
  ComponentProps<"button">,
  "children" | "onClick"
> & {
  label?: string
  /** Подпись, пока грузится следующая порция. */
  loadingLabel?: string
  /** Подпись, когда показано всё. */
  doneLabel?: string
  /** Строка счётчика: {shown} и {total} подставляются числами. */
  counterText?: string
  /** Сколько уже показано и сколько всего. */
  shown?: number
  total?: number
  /** Сколько добавляет одно нажатие: витрине нужно живое поведение. */
  step?: number
  onLoadMore?: (next: number) => void
  accent?: string
  /** Поверхность страницы. Пусто — своя, из палитры. */
  background?: string
}

// Идея компонента: подгрузка списка кнопкой, а не бесконечной лентой. Кнопка
// всегда говорит, сколько уже показано и сколько всего, — без этого человек
// не понимает, десять раз ему жать или два. Полоса под подписью показывает
// ту же долю глазом: цифры читают не все.
//
// Данных компонент не грузит: он держит счётчик и зовёт onLoadMore со
// следующим значением. Запрос и вставка карточек — забота приложения.
const STYLES = `
:where([data-vibeui-block="button-067"]){
--vibeui-button-067-bg:transparent;
--vibeui-button-067-fg:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-067-muted:color-mix(in oklab,var(--vibeui-button-067-fg) 60%,transparent);
--vibeui-button-067-border:light-dark(oklch(0.88 0 265),oklch(0.36 0 265));
--vibeui-button-067-track:light-dark(oklch(0.92 0 265),oklch(0.31 0 265));
--vibeui-button-067-accent:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-067-radius:0.75rem;
--vibeui-button-067-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-067"]{color-scheme:dark}
[data-vibeui-block="button-067"]{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;
background:var(--vibeui-button-067-bg);
font-family:var(--vibeui-button-067-font);color:var(--vibeui-button-067-fg);
}
[data-vibeui-block="button-067"] *{box-sizing:border-box}
[data-vibeui-block="button-067"] [data-part="more"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
min-height:2.5rem;padding:0.375rem 1.125rem;
border:1px solid var(--vibeui-button-067-border);
border-radius:var(--vibeui-button-067-radius);
background:transparent;color:inherit;
font:inherit;font-size:0.875rem;font-weight:650;letter-spacing:-0.01em;line-height:1;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="button-067"] [data-part="more"]:hover:not(:disabled){
border-color:var(--vibeui-button-067-fg);
background:color-mix(in oklab,var(--vibeui-button-067-fg) 6%,transparent);
}
[data-vibeui-block="button-067"] [data-part="more"]:disabled{opacity:.55;cursor:not-allowed}
[data-vibeui-block="button-067"] [data-part="more"]:focus-visible{
outline:2px solid var(--vibeui-button-067-accent);outline-offset:2px;
}
/* Спиннер вместо стрелки: подпись остаётся на месте, поэтому кнопка не
   меняет ширину и список под ней не дёргается. */
[data-vibeui-block="button-067"] [data-part="mark"]{
width:0.875rem;height:0.875rem;flex:none;
}
[data-vibeui-block="button-067"] [data-part="mark"] svg{width:100%;height:100%;fill:currentColor}
[data-vibeui-block="button-067"][data-loading="true"] [data-part="mark"]{
border:2px solid color-mix(in oklab,var(--vibeui-button-067-fg) 30%,transparent);
border-top-color:var(--vibeui-button-067-fg);border-radius:9999px;
animation:vibeui-button-067-spin .7s linear infinite;
}
[data-vibeui-block="button-067"][data-loading="true"] [data-part="mark"] svg{display:none}
@keyframes vibeui-button-067-spin{to{rotate:360deg}}
[data-vibeui-block="button-067"] [data-part="counter"]{
margin:0;font-size:0.75rem;color:var(--vibeui-button-067-muted);font-variant-numeric:tabular-nums;
}
/* Полоса доли: те же числа, но глазом. Ширина идёт от переменной, поэтому
   пересчёта в JS не нужно. */
[data-vibeui-block="button-067"] [data-part="bar"]{
width:100%;height:2px;border-radius:9999px;overflow:hidden;
background:var(--vibeui-button-067-track);
}
[data-vibeui-block="button-067"] [data-part="bar"] span{
display:block;height:100%;border-radius:inherit;
width:calc(var(--vibeui-button-067-share) * 1%);
background:var(--vibeui-button-067-accent);
transition:width .25s ease;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-067"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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
 * Кнопка подгрузки списка: счётчик показанного, доля полосой и состояние
 * загрузки. Один файл, ноль зависимостей, собственная палитра.
 */
export function Button067({
  label = "Показать ещё",
  loadingLabel = "Загружаем…",
  doneLabel = "Показано всё",
  counterText = "Показано {shown} из {total}",
  shown = 20,
  total = 340,
  step = 20,
  onLoadMore,
  accent,
  background = "",
  className,
  style,
  type = "button",
  ...props
}: Button067Props) {
  const [count, setCount] = useState(Math.min(shown, total))
  const [loading, setLoading] = useState(false)
  const done = count >= total
  const share = total > 0 ? Math.min(100, (count / total) * 100) : 100

  const palette = {
    "--vibeui-button-067-share": share.toFixed(1),
    ...(accent ? { "--vibeui-button-067-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-067-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-067" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="button"
        data-vibeui-block="button-067"
        data-loading={loading}
        className={className}
        style={palette}
      >
        <button
          {...props}
          type={type}
          data-part="more"
          disabled={done || loading}
          onClick={() => {
            if (done || loading) {
              return
            }

            const next = Math.min(total, count + step)

            // Короткая задержка — это не имитация ради красоты: она держит
            // состояние загрузки видимым, пока приложение не подставит своё.
            setLoading(true)
            window.setTimeout(() => {
              setCount(next)
              setLoading(false)
              onLoadMore?.(next)
            }, 450)
          }}
        >
          <span data-part="mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 16.5 5.5 10l1.4-1.4L12 13.7l5.1-5.1L18.5 10z" />
            </svg>
          </span>
          <span>{done ? doneLabel : loading ? loadingLabel : label}</span>
        </button>

        <p data-part="counter" role="status">
          {counterText
            .replace("{shown}", String(count))
            .replace("{total}", String(total))}
        </p>

        <span data-part="bar" aria-hidden="true">
          <span />
        </span>
      </div>
    </>
  )
}
