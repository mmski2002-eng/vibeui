"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toast018Item = {
  id: string
  title: string
}

export type Toast018Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  groupTitle?: string
  items?: Toast018Item[]
  /** Сколько пунктов показывать свёрнутыми до счётчика «ещё N». */
  visibleCount?: number
  /** Подпись раскрытия, {count} — сколько пунктов ещё скрыто. */
  expandLabel?: string
  collapseLabel?: string
  closeLabel?: string
  emptyText?: string
  /** Цвет счётчика, точек и ссылки раскрытия. Пусто — штатная палитра. */
  accent?: string
  /** Подложка карточки. Пусто — штатная палитра. */
  background?: string
  onDismiss?: (id: string) => void
}

// Идея компонента: не колода и не стопка, а одна карточка-группа с явным
// счётчиком остатка и раскрытием по клику. Свёрнутое состояние — заголовок
// плюс первые пункты плюс строка «ещё N», раскрытое — тот же список
// целиком с высотой на max-height, чтобы раскрытие можно было анимировать
// без измерения содержимого в JS.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// подложка светлее фона страницы, а граница светлее подложки.
const STYLES = `
:where([data-vibeui-block="toast-018"]){
--vibeui-toast-018-bg:light-dark(oklch(0.99 0.002 265),oklch(0.25 0.014 265));
--vibeui-toast-018-fg:light-dark(oklch(0.22 0.014 265),oklch(0.96 0.003 265));
--vibeui-toast-018-muted:light-dark(oklch(0.56 0.014 265),oklch(0.76 0.01 265));
--vibeui-toast-018-border:light-dark(oklch(0.9 0.006 265),oklch(0.38 0.014 265));
--vibeui-toast-018-shadow:light-dark(oklch(0.18 0.02 265 / 55%),oklch(0.05 0.01 265 / 70%));
--vibeui-toast-018-hover:light-dark(oklch(0.2 0.02 265 / 7%),oklch(1 0 0 / 12%));
--vibeui-toast-018-accent:light-dark(oklch(0.55 0.16 260),oklch(0.72 0.15 260));
--vibeui-toast-018-accent-fg:light-dark(oklch(0.99 0.004 265),oklch(0.18 0.03 260));
--vibeui-toast-018-radius:0.875rem;
--vibeui-toast-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toast-018"]{
width:100%;max-width:23rem;box-sizing:border-box;
padding:0.875rem;border-radius:var(--vibeui-toast-018-radius);
border:1px solid var(--vibeui-toast-018-border);
background:var(--vibeui-toast-018-bg);color:var(--vibeui-toast-018-fg);
font-family:var(--vibeui-toast-018-font);
box-shadow:0 16px 34px -24px var(--vibeui-toast-018-shadow);
}
[data-vibeui-block="toast-018"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="toast-018"] [data-part="heading"]{font-size:0.875rem;font-weight:600}
[data-vibeui-block="toast-018"] [data-part="badge"]{
flex:none;min-width:1.25rem;height:1.25rem;padding:0 0.375rem;border-radius:9999px;
display:flex;align-items:center;justify-content:center;
background:var(--vibeui-toast-018-accent);color:var(--vibeui-toast-018-accent-fg);
font-size:0.6875rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="toast-018"] [data-part="list"]{
margin:0.625rem 0 0;padding:0;list-style:none;
display:flex;flex-direction:column;gap:0.4375rem;
overflow:hidden;max-height:6.5rem;
transition:max-height .22s ease;
}
[data-vibeui-block="toast-018"] [data-part="list"][data-expanded="true"]{max-height:24rem}
[data-vibeui-block="toast-018"] [data-part="row"]{
display:flex;align-items:center;gap:0.5rem;font-size:0.8125rem;line-height:1.4;
}
[data-vibeui-block="toast-018"] [data-part="dot"]{
flex:none;width:0.375rem;height:0.375rem;border-radius:9999px;background:var(--vibeui-toast-018-accent);
}
[data-vibeui-block="toast-018"] [data-part="row-title"]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="toast-018"] [data-part="row"] button{
appearance:none;border:0;cursor:pointer;background:transparent;flex:none;
width:1.25rem;height:1.25rem;padding:0;border-radius:9999px;
color:var(--vibeui-toast-018-muted);font-size:0.875rem;line-height:1;
}
[data-vibeui-block="toast-018"] [data-part="row"] button:hover{background:var(--vibeui-toast-018-hover);color:var(--vibeui-toast-018-fg)}
[data-vibeui-block="toast-018"] [data-part="row"] button:focus-visible{outline:2px solid var(--vibeui-toast-018-accent);outline-offset:2px}
[data-vibeui-block="toast-018"] [data-part="toggle"]{
margin-top:0.625rem;appearance:none;border:0;cursor:pointer;background:transparent;padding:0;
font:inherit;font-size:0.8125rem;font-weight:700;color:var(--vibeui-toast-018-accent);
}
[data-vibeui-block="toast-018"] [data-part="toggle"]:hover{text-decoration:underline}
[data-vibeui-block="toast-018"] [data-part="toggle"]:focus-visible{outline:2px solid var(--vibeui-toast-018-accent);outline-offset:2px}
[data-vibeui-block="toast-018"] [data-part="empty"]{margin:0.625rem 0 0;font-size:0.8125rem;color:var(--vibeui-toast-018-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-018"] *{transition:none!important}}
`

const DEFAULT_ITEMS: Toast018Item[] = [
  { id: "1", title: "Новый заказ №4821 на 3 позиции" },
  { id: "2", title: "Отзыв 5★ на товар «Керамическая ваза»" },
  { id: "3", title: "Вопрос от покупателя о доставке" },
  { id: "4", title: "Остаток товара «Плед шерстяной» ниже пяти штук" },
  { id: "5", title: "Возврат по заказу №4790 одобрен" },
]

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
 * Сгруппированные уведомления: заголовок со счётчиком, свёрнутый список
 * с «ещё N» и раскрытие по клику. Один файл, ноль зависимостей.
 */
export function Toast018({
  groupTitle = "Новые события магазина",
  items = DEFAULT_ITEMS,
  visibleCount = 2,
  expandLabel = "Показать все · ещё {count}",
  collapseLabel = "Свернуть",
  closeLabel = "Скрыть",
  emptyText = "Событий больше нет",
  accent = "",
  background = "",
  onDismiss,
  className,
  style,
  ...props
}: Toast018Props) {
  const [list, setList] = useState(items)
  const [expanded, setExpanded] = useState(false)

  function dismiss(id: string) {
    setList((current) => current.filter((entry) => entry.id !== id))
    onDismiss?.(id)
  }

  const hidden = Math.max(0, list.length - visibleCount)
  const shown = expanded ? list : list.slice(0, visibleCount)

  const palette = {
    ...(accent ? { "--vibeui-toast-018-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-toast-018-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toast-018" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="toast-018"
        role="status"
        aria-live="polite"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span data-part="heading">{groupTitle}</span>
          {list.length > 0 ? (
            <span data-part="badge">{list.length}</span>
          ) : null}
        </div>

        {list.length === 0 ? (
          <p data-part="empty">{emptyText}</p>
        ) : (
          <>
            <ul data-part="list" data-expanded={expanded}>
              {shown.map((item) => (
                <li key={item.id} data-part="row">
                  <span data-part="dot" aria-hidden="true" />
                  <span data-part="row-title">{item.title}</span>
                  <button
                    type="button"
                    aria-label={`${closeLabel}: ${item.title}`}
                    onClick={() => dismiss(item.id)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            {hidden > 0 || expanded ? (
              <button
                type="button"
                data-part="toggle"
                aria-expanded={expanded}
                onClick={() => setExpanded((value) => !value)}
              >
                {expanded
                  ? collapseLabel
                  : expandLabel.replace("{count}", String(hidden))}
              </button>
            ) : null}
          </>
        )}
      </div>
    </>
  )
}
