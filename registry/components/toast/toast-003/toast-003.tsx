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
}

// Идея компонента: стопка сообщений с пределом. Больше трёх карточек подряд
// никто не читает — остальные сворачиваются в строку «и ещё N». Новые
// приходят сверху, потому что читают сверху вниз, а не наоборот.
const STYLES = `
:where([data-vibeui-block="toast-003"]){
--vibeui-toast-003-bg:oklch(1 0 0);
--vibeui-toast-003-fg:oklch(0.22 0.014 265);
--vibeui-toast-003-muted:oklch(0.56 0.014 265);
--vibeui-toast-003-border:oklch(0.9 0.006 265);
--vibeui-toast-003-info:oklch(0.58 0.16 265);
--vibeui-toast-003-success:oklch(0.58 0.15 152);
--vibeui-toast-003-danger:oklch(0.58 0.19 25);
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
box-shadow:0 12px 28px -22px oklch(0.2 0.02 265 / 55%);
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
[data-vibeui-block="toast-003"] [data-part="close"]:hover{background:oklch(0.95 0.004 265);color:var(--vibeui-toast-003-fg)}
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
 * Стопка сообщений с пределом: хвост сворачивается в строку «и ещё N».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast003({
  items = DEFAULT_ITEMS,
  max = 3,
  accent,
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
        aria-label="Сообщения"
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
              aria-label={`Скрыть сообщение: ${item.title}`}
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
            <span>и ещё {rest}</span>
            <button type="button" onClick={() => setExpanded(true)}>
              Показать все
            </button>
          </p>
        ) : null}
        {expanded && list.length > limit ? (
          <p data-part="more">
            <span>Показаны все {list.length}</span>
            <button type="button" onClick={() => setExpanded(false)}>
              Свернуть
            </button>
          </p>
        ) : null}
      </div>
    </>
  )
}
