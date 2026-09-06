"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Toast011Tone = "neutral" | "success" | "danger"

export type Toast011Item = {
  id: string
  title: string
  tone?: Toast011Tone
}

export type Toast011Props = Omit<ComponentProps<"div">, "children"> & {
  items?: Toast011Item[]
  closeLabel?: string
  emptyLabel?: string
  /** Строка о скрытых карточках; {count} заменяется их числом. */
  behindText?: string
  onDismiss?: (id: string) => void
  /** Пусто — подложка карточек берётся из темы окружения. */
  background?: string
}

// Идея компонента: колода уведомлений, а не список. Верхняя карточка
// читается целиком, под ней срезами видны следующие — понятно, что очередь
// не кончилась, но взгляд не распыляется на все сообщения сразу.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// граница карточки светлее её подложки, а не темнее.
const STYLES = `
:where([data-vibeui-block="toast-011"]){
--vibeui-toast-011-bg:light-dark(oklch(0.99 0 265),oklch(0.26 0 265));
--vibeui-toast-011-fg:light-dark(oklch(0.22 0 265),oklch(0.95 0 265));
--vibeui-toast-011-muted:color-mix(in oklab,var(--vibeui-toast-011-fg) 68%,transparent);
--vibeui-toast-011-border:light-dark(oklch(0.9 0 265),oklch(0.38 0 265));
--vibeui-toast-011-hover:light-dark(oklch(0 0 0 / 6%),oklch(1 0 0 / 10%));
--vibeui-toast-011-shadow:light-dark(oklch(0.18 0 265 / 55%),oklch(0.08 0 265 / 70%));
--vibeui-toast-011-neutral:light-dark(oklch(0.62 0 265),oklch(0.7 0 265));
--vibeui-toast-011-success:light-dark(oklch(0.58 0.15 152),oklch(0.75 0.15 152));
--vibeui-toast-011-danger:light-dark(oklch(0.58 0.19 25),oklch(0.7 0.18 25));
--vibeui-toast-011-radius:0.875rem;
--vibeui-toast-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toast-011"]{color-scheme:dark}
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
box-shadow:0 16px 34px -24px var(--vibeui-toast-011-shadow);
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
[data-vibeui-block="toast-011"] [data-part="title"]{font-size:0.875rem;line-height:1.4}
[data-vibeui-block="toast-011"] [data-part="count"]{font-size:0.75rem;color:var(--vibeui-toast-011-muted)}
[data-vibeui-block="toast-011"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;background:transparent;flex:none;
display:flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;padding:0;border-radius:9999px;
color:var(--vibeui-toast-011-muted);font-size:1rem;line-height:1;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="toast-011"] [data-part="close"]:hover{background:var(--vibeui-toast-011-hover);color:var(--vibeui-toast-011-fg)}
[data-vibeui-block="toast-011"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-toast-011-neutral);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Toast011Item[] = [
  { id: "1", title: "Резервная копия проекта создана", tone: "success" },
  { id: "2", title: "Новый комментарий к макету каталога" },
  { id: "3", title: "Не удалось синхронизировать плагин", tone: "danger" },
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
 * Колода уведомлений: карточки со сдвигом друг под другом, верхняя читается
 * целиком. Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast011({
  items = DEFAULT_ITEMS,
  closeLabel = "Закрыть",
  emptyLabel = "Уведомлений больше нет",
  behindText = "ещё {count} за этой карточкой",
  onDismiss,
  background = "",
  className,
  style,
  ...props
}: Toast011Props) {
  const [list, setList] = useState(items)
  const deckPalette = {
    ...(background
      ? {
          "--vibeui-toast-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

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
        data-slot="toast"
        data-vibeui-block="toast-011"
        className={className}
        style={deckPalette}
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
                        {behindText.replace("{count}", String(list.length - 1))}
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
