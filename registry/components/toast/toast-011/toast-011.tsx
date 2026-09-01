"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toast011Tone = "neutral" | "success" | "danger"

export type Toast011Item = {
  id: string
  title: string
  tone?: Toast011Tone
}

export type Toast011Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  items?: Toast011Item[]
  closeLabel?: string
  emptyLabel?: string
  onDismiss?: (id: string) => void
}

// Идея компонента: колода уведомлений, а не список. Верхняя карточка
// читается целиком, под ней срезами видны следующие — понятно, что очередь
// не кончилась, но взгляд не распыляется на все сообщения сразу.
const STYLES = `
:where([data-vibeui-block="toast-011"]){
--vibeui-toast-011-bg:oklch(0.99 0.002 265);
--vibeui-toast-011-fg:oklch(0.22 0.014 265);
--vibeui-toast-011-muted:oklch(0.56 0.014 265);
--vibeui-toast-011-border:oklch(0.9 0.006 265);
--vibeui-toast-011-neutral:oklch(0.62 0.02 265);
--vibeui-toast-011-success:oklch(0.58 0.15 152);
--vibeui-toast-011-danger:oklch(0.58 0.19 25);
--vibeui-toast-011-radius:0.875rem;
--vibeui-toast-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toast-011"]{
width:100%;max-width:22rem;box-sizing:border-box;
font-family:var(--vibeui-toast-011-font);color:var(--vibeui-toast-011-fg);
}
[data-vibeui-block="toast-011"] [data-part="deck"]{
position:relative;min-height:8.5rem;
}
[data-vibeui-block="toast-011"] [data-part="empty"]{
display:flex;align-items:center;justify-content:center;
box-sizing:border-box;min-height:4.5rem;
border-radius:var(--vibeui-toast-011-radius);
border:1px dashed var(--vibeui-toast-011-border);
font-size:0.8125rem;color:var(--vibeui-toast-011-muted);
}
/* Сдвиг, масштаб и прозрачность карты считаются от её индекса в колоде. */
[data-vibeui-block="toast-011"] [data-part="card"]{
position:absolute;left:0;right:0;top:0;box-sizing:border-box;
display:flex;align-items:flex-start;gap:0.625rem;
padding:0.8125rem 0.875rem;
border:1px solid var(--vibeui-toast-011-border);
border-radius:var(--vibeui-toast-011-radius);
background:var(--vibeui-toast-011-bg);color:var(--vibeui-toast-011-fg);
box-shadow:0 16px 34px -24px oklch(0.18 0.02 265 / 55%);
transform:
  translateY(calc(var(--vibeui-toast-011-index) * 0.7rem))
  scale(calc(1 - var(--vibeui-toast-011-index) * 0.05));
opacity:calc(1 - var(--vibeui-toast-011-index) * 0.24);
transition:transform .22s ease,opacity .22s ease;
}
[data-vibeui-block="toast-011"] [data-part="card"][data-behind="true"]{pointer-events:none}
[data-vibeui-block="toast-011"] [data-part="dot"]{
flex:none;width:0.5rem;height:0.5rem;margin-top:0.375rem;border-radius:9999px;
background:var(--vibeui-toast-011-neutral);
}
[data-vibeui-block="toast-011"] [data-part="card"][data-tone="success"] [data-part="dot"]{background:var(--vibeui-toast-011-success)}
[data-vibeui-block="toast-011"] [data-part="card"][data-tone="danger"] [data-part="dot"]{background:var(--vibeui-toast-011-danger)}
[data-vibeui-block="toast-011"] [data-part="text"]{flex:1;min-width:0;display:flex;flex-direction:column;gap:0.25rem}
[data-vibeui-block="toast-011"] [data-part="title"]{font-size:0.8438rem;line-height:1.4}
[data-vibeui-block="toast-011"] [data-part="count"]{font-size:0.75rem;color:var(--vibeui-toast-011-muted)}
[data-vibeui-block="toast-011"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;background:transparent;flex:none;
display:flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;padding:0;border-radius:9999px;
color:var(--vibeui-toast-011-muted);font-size:1rem;line-height:1;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="toast-011"] [data-part="close"]:hover{background:oklch(0 0 0 / 6%);color:var(--vibeui-toast-011-fg)}
[data-vibeui-block="toast-011"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-toast-011-neutral);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Toast011Item[] = [
  { id: "1", title: "Резервная копия проекта создана", tone: "success" },
  { id: "2", title: "Новый комментарий к макету каталога" },
  { id: "3", title: "Не удалось синхронизировать плагин", tone: "danger" },
]

/**
 * Колода уведомлений: карточки со сдвигом друг под другом, верхняя читается
 * целиком. Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast011({
  items = DEFAULT_ITEMS,
  closeLabel = "Закрыть",
  emptyLabel = "Уведомлений больше нет",
  onDismiss,
  className,
  style,
  ...props
}: Toast011Props) {
  const [list, setList] = useState(items)

  function dismiss(id: string) {
    setList((current) => current.filter((entry) => entry.id !== id))
    onDismiss?.(id)
  }

  return (
    <>
      <style href="vibeui-toast-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="toast-011"
        className={className}
        style={style}
      >
        <div data-part="deck" role="status" aria-live="polite">
          {list.length === 0 ? (
            <p data-part="empty">{emptyLabel}</p>
          ) : (
            list.map((item, index) => {
              const behind = index > 0
              const palette = {
                "--vibeui-toast-011-index": index,
                zIndex: list.length - index,
              } as CSSProperties

              return (
                <div
                  key={item.id}
                  data-part="card"
                  data-tone={item.tone ?? "neutral"}
                  data-behind={behind}
                  aria-hidden={behind}
                  style={palette}
                >
                  <span data-part="dot" aria-hidden="true" />
                  <span data-part="text">
                    <span data-part="title">{item.title}</span>
                    {index === 0 && list.length > 1 ? (
                      <span data-part="count">
                        ещё {list.length - 1} за этой карточкой
                      </span>
                    ) : null}
                  </span>
                  <button
                    type="button"
                    data-part="close"
                    tabIndex={behind ? -1 : 0}
                    aria-label={`${closeLabel}: ${item.title}`}
                    onClick={() => dismiss(item.id)}
                  >
                    ×
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
