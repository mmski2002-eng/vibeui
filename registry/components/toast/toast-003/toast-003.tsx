"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toast003Item = {
  id: string
  title: string
  tone?: "info" | "success" | "danger"
}

export type Toast003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  items?: Toast003Item[]
  max?: number
  accent?: string
  /** Пусто — подложка карточек берётся из темы окружения. */
  background?: string
  /** Имя потока сообщений для скринридера. */
  listLabel?: string
  /** Подпись кнопки скрытия; {title} заменяется текстом сообщения. */
  dismissText?: string
  /** Строка свёрнутого хвоста; {count} заменяется числом. */
  moreText?: string
  /** Подпись кнопки, разворачивающей стопку. */
  expandLabel?: string
  /** Строка развёрнутой стопки; {count} заменяется числом. */
  allShownText?: string
  /** Подпись кнопки, сворачивающей стопку. */
  collapseLabel?: string
}

// Идея компонента: стопка сообщений с пределом. Больше трёх карточек подряд
// никто не читает — остальные сворачиваются в строку «и ещё N». Новые
// приходят сверху, потому что читают сверху вниз, а не наоборот.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// граница карточки светлее её подложки, а не темнее.
const STYLES = `
:where([data-vibeui-block="toast-003"]){
--vibeui-toast-003-bg:light-dark(oklch(1 0 0),oklch(0.26 0.014 265));
--vibeui-toast-003-fg:light-dark(oklch(0.22 0.014 265),oklch(0.95 0.004 265));
--vibeui-toast-003-muted:light-dark(oklch(0.56 0.014 265),oklch(0.72 0.012 265));
--vibeui-toast-003-border:light-dark(oklch(0.9 0.006 265),oklch(0.38 0.014 265));
--vibeui-toast-003-hover:light-dark(oklch(0.95 0.004 265),oklch(0.34 0.014 265));
--vibeui-toast-003-shadow:light-dark(oklch(0.2 0.02 265 / 55%),oklch(0.1 0.02 265 / 70%));
--vibeui-toast-003-info:light-dark(oklch(0.58 0.16 265),oklch(0.74 0.14 265));
--vibeui-toast-003-success:light-dark(oklch(0.58 0.15 152),oklch(0.75 0.15 152));
--vibeui-toast-003-danger:light-dark(oklch(0.58 0.19 25),oklch(0.7 0.18 25));
--vibeui-toast-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toast-003"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:21rem;box-sizing:border-box;
font-family:var(--vibeui-toast-003-font);color:var(--vibeui-toast-003-fg);
}
[data-vibeui-block="toast-003"] [data-part="item"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.625rem 0.75rem;box-sizing:border-box;
border:1px solid var(--vibeui-toast-003-border);border-radius:0.75rem;
background:var(--vibeui-toast-003-bg);
box-shadow:0 12px 28px -22px var(--vibeui-toast-003-shadow);
}
/* Тон — полоской слева, а не заливкой: сообщение остаётся читаемым. */
[data-vibeui-block="toast-003"] [data-part="bar"]{
flex:none;width:0.1875rem;align-self:stretch;border-radius:9999px;
background:var(--vibeui-toast-003-info);
}
[data-vibeui-block="toast-003"] [data-part="item"][data-tone="success"] [data-part="bar"]{background:var(--vibeui-toast-003-success)}
[data-vibeui-block="toast-003"] [data-part="item"][data-tone="danger"] [data-part="bar"]{background:var(--vibeui-toast-003-danger)}
[data-vibeui-block="toast-003"] [data-part="title"]{flex:1;min-width:0;font-size:0.8125rem;line-height:1.35}
[data-vibeui-block="toast-003"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;background:transparent;flex:none;
display:flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;padding:0;border-radius:9999px;
color:var(--vibeui-toast-003-muted);
}
[data-vibeui-block="toast-003"] [data-part="close"]:hover{background:var(--vibeui-toast-003-hover);color:var(--vibeui-toast-003-fg)}
[data-vibeui-block="toast-003"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-toast-003-info);outline-offset:1px}
[data-vibeui-block="toast-003"] [data-part="cross"]{position:relative;width:0.5rem;height:0.5rem}
[data-vibeui-block="toast-003"] [data-part="cross"]::before,
[data-vibeui-block="toast-003"] [data-part="cross"]::after{
content:"";position:absolute;left:0;top:50%;width:100%;height:1.5px;
margin-top:-0.75px;background:currentColor;border-radius:9999px;
}
[data-vibeui-block="toast-003"] [data-part="cross"]::before{transform:rotate(45deg)}
[data-vibeui-block="toast-003"] [data-part="cross"]::after{transform:rotate(-45deg)}
/* Хвост стопки — одной строкой: три карточки подряд ещё читают, десять нет. */
[data-vibeui-block="toast-003"] [data-part="more"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.5rem 0.75rem;border-radius:0.75rem;
border:1px dashed var(--vibeui-toast-003-border);
font-size:0.75rem;color:var(--vibeui-toast-003-muted);
}
[data-vibeui-block="toast-003"] [data-part="more"] button{
appearance:none;border:0;background:transparent;cursor:pointer;padding:0;
color:var(--vibeui-toast-003-info);font:inherit;font-size:0.75rem;font-weight:650;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Toast003Item[] = [
  { id: "1", title: "Компонент button-020 опубликован", tone: "success" },
  { id: "2", title: "Сборка каталога завершена за 42 с" },
  { id: "3", title: "Не удалось загрузить превью chart-009", tone: "danger" },
  { id: "4", title: "Обновлены зависимости" },
  { id: "5", title: "Кто-то вошёл с нового устройства" },
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
 * Стопка сообщений с пределом: хвост сворачивается в строку «и ещё N».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast003({
  items = DEFAULT_ITEMS,
  max = 3,
  accent,
  background = "",
  listLabel = "Сообщения",
  dismissText = "Скрыть сообщение: {title}",
  moreText = "и ещё {count}",
  expandLabel = "Показать все",
  allShownText = "Показаны все {count}",
  collapseLabel = "Свернуть",
  className,
  style,
  ...props
}: Toast003Props) {
  const [list, setList] = useState(items)
  const [expanded, setExpanded] = useState(false)
  const limit = Math.max(1, max)
  const shown = expanded ? list : list.slice(0, limit)
  const rest = list.length - shown.length

  const palette = {
    ...(accent ? { "--vibeui-toast-003-info": accent } : null),
    ...(background
      ? {
          "--vibeui-toast-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toast-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="toast-003"
        role="log"
        aria-live="polite"
        aria-label={listLabel}
        className={className}
        style={palette}
      >
        {shown.map((item) => (
          <div key={item.id} data-part="item" data-tone={item.tone ?? "info"}>
            <span data-part="bar" aria-hidden="true" />
            <span data-part="title">{item.title}</span>
            <button
              type="button"
              data-part="close"
              aria-label={dismissText.replace("{title}", item.title)}
              onClick={() =>
                setList(list.filter((entry) => entry.id !== item.id))
              }
            >
              <span data-part="cross" aria-hidden="true" />
            </button>
          </div>
        ))}
        {rest > 0 ? (
          <p data-part="more">
            <span>{moreText.replace("{count}", String(rest))}</span>
            <button type="button" onClick={() => setExpanded(true)}>
              {expandLabel}
            </button>
          </p>
        ) : null}
        {expanded && list.length > limit ? (
          <p data-part="more">
            <span>{allShownText.replace("{count}", String(list.length))}</span>
            <button type="button" onClick={() => setExpanded(false)}>
              {collapseLabel}
            </button>
          </p>
        ) : null}
      </div>
    </>
  )
}
