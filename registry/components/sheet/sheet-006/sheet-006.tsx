"use client"

import { useId, useRef } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Sheet006Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  text?: string
  consequences?: string[]
  confirmLabel?: string
  cancelLabel?: string
  /** Что озвучить вместо знака опасности: сам знак — фигура, её не прочитать. */
  warningLabel?: string
  /** Опасный цвет: знак, кнопка подтверждения и маркеры списка. */
  danger?: string
  /** Подложка листа и кнопки открытия. Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: подтверждение опасного действия на телефоне. Вопрос
// приезжает снизу, потому что до центра экрана большой палец не достаёт.
// Последствия перечислены списком, а не спрятаны в одну строку, фокус при
// открытии стоит на отказе: опасная кнопка не должна срабатывать по Enter.
//
// Тема берётся из color-scheme окружения через light-dark(): лист темнеет
// там, где тёмный контекст, и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="sheet-006"]){
--vibeui-sheet-006-bg:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-sheet-006-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.006 265));
--vibeui-sheet-006-muted:color-mix(in oklab,var(--vibeui-sheet-006-fg) 68%,transparent);
--vibeui-sheet-006-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-sheet-006-danger:light-dark(oklch(0.55 0.2 25),oklch(0.72 0.17 25));
--vibeui-sheet-006-danger-soft:color-mix(in oklab,var(--vibeui-sheet-006-danger) 18%,transparent);
--vibeui-sheet-006-on-danger:light-dark(oklch(0.99 0.01 25),oklch(0.18 0.04 25));
--vibeui-sheet-006-shadow:light-dark(oklch(0.2 0.02 265 / 60%),oklch(0.02 0.01 265 / 75%));
--vibeui-sheet-006-scrim:light-dark(oklch(0.17 0.02 265 / 55%),oklch(0.06 0.014 265 / 70%));
--vibeui-sheet-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sheet-006"]{color-scheme:dark}
[data-vibeui-block="sheet-006"]{
display:inline-block;font-family:var(--vibeui-sheet-006-font);color:var(--vibeui-sheet-006-fg);
}
[data-vibeui-block="sheet-006"] [data-part="trigger"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-sheet-006-border);border-radius:0.625rem;
background:var(--vibeui-sheet-006-bg);color:var(--vibeui-sheet-006-danger);
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="sheet-006"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-sheet-006-danger);outline-offset:2px}
[data-vibeui-block="sheet-006"] dialog{
position:fixed;inset:auto 0 0 0;margin:0;container-type:inline-size;
width:100%;max-width:100vw;max-height:85dvh;
padding:0;border:0;border-radius:1.25rem 1.25rem 0 0;overflow:hidden;
background:var(--vibeui-sheet-006-bg);color:var(--vibeui-sheet-006-fg);
box-shadow:0 -26px 60px -32px var(--vibeui-sheet-006-shadow);
translate:0 100%;transition:translate .24s ease,overlay .24s allow-discrete,display .24s allow-discrete;
}
[data-vibeui-block="sheet-006"] dialog[open]{translate:0 0}
@starting-style{
[data-vibeui-block="sheet-006"] dialog[open]{translate:0 100%}
}
[data-vibeui-block="sheet-006"] dialog::backdrop{background:var(--vibeui-sheet-006-scrim)}
[data-vibeui-block="sheet-006"] form{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;box-sizing:border-box;
padding:0.5rem 1.125rem calc(0.9375rem + env(safe-area-inset-bottom,0px));text-align:center;
}
/* Знак опасности нарисован фигурой и потому спрятан от скринридера —
   предупреждение ему отдаёт эта подпись. */
[data-vibeui-block="sheet-006"] [data-part="sr"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
[data-vibeui-block="sheet-006"] [data-part="grabber"]{
width:2.5rem;height:0.25rem;margin:0.25rem 0 0.5rem;
border-radius:9999px;background:var(--vibeui-sheet-006-border);
}
/* Знак опасности кругом с восклицанием: рисовать нечем, кроме CSS. */
[data-vibeui-block="sheet-006"] [data-part="mark"]{
position:relative;width:2.75rem;height:2.75rem;border-radius:9999px;
background:var(--vibeui-sheet-006-danger-soft);
}
[data-vibeui-block="sheet-006"] [data-part="mark"]::before{
content:"";position:absolute;left:50%;top:0.75rem;width:2px;height:0.8125rem;
margin-left:-1px;border-radius:9999px;background:var(--vibeui-sheet-006-danger);
}
[data-vibeui-block="sheet-006"] [data-part="mark"]::after{
content:"";position:absolute;left:50%;bottom:0.6875rem;width:2px;height:2px;
margin-left:-1px;border-radius:9999px;background:var(--vibeui-sheet-006-danger);
}
[data-vibeui-block="sheet-006"] [data-part="title"]{margin:0.25rem 0 0;font-size:1rem;font-weight:700;line-height:1.25}
[data-vibeui-block="sheet-006"] [data-part="text"]{
margin:0;max-width:34ch;font-size:0.875rem;line-height:1.45;color:var(--vibeui-sheet-006-muted);
}
[data-vibeui-block="sheet-006"] [data-part="list"]{
list-style:none;margin:0.5rem 0 0.25rem;padding:0.625rem 0.875rem;width:100%;box-sizing:border-box;
border:1px solid var(--vibeui-sheet-006-border);border-radius:0.875rem;
text-align:left;font-size:0.875rem;line-height:1.4;
}
[data-vibeui-block="sheet-006"] [data-part="item"]{position:relative;padding-left:0.875rem}
[data-vibeui-block="sheet-006"] [data-part="item"]+[data-part="item"]{margin-top:0.375rem}
[data-vibeui-block="sheet-006"] [data-part="item"]::before{
content:"";position:absolute;left:0;top:0.5rem;width:0.3125rem;height:0.3125rem;
border-radius:9999px;background:var(--vibeui-sheet-006-danger);
}
[data-vibeui-block="sheet-006"] [data-part="actions"]{display:flex;flex-direction:column;gap:0.5rem;width:100%;margin-top:0.5rem}
[data-vibeui-block="sheet-006"] [data-part="actions"] button{
appearance:none;cursor:pointer;width:100%;height:3rem;border-radius:0.875rem;
border:1px solid var(--vibeui-sheet-006-border);background:transparent;color:inherit;
font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="sheet-006"] [data-part="actions"] button[data-danger="true"]{
border-color:transparent;background:var(--vibeui-sheet-006-danger);color:var(--vibeui-sheet-006-on-danger);
}
[data-vibeui-block="sheet-006"] [data-part="actions"] button:focus-visible{outline:2px solid var(--vibeui-sheet-006-danger);outline-offset:2px}
/* Шкала категории: на планшете и шире лист получает крупный кегль и воздух. */
@container (min-width: 32rem){
[data-vibeui-block="sheet-006"] [data-part="text"]{font-size:0.9375rem}
[data-vibeui-block="sheet-006"] [data-part="list"]{font-size:0.9375rem;padding:0.75rem 1rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="sheet-006"] *{animation:none!important;transition:none!important}
[data-vibeui-block="sheet-006"] dialog{translate:0 0}
}
`

const DEFAULT_CONSEQUENCES = [
  "Адрес vitrina.ru перестанет открываться сразу",
  "Историю публикаций восстановить будет нельзя",
  "Участники команды потеряют доступ к исходникам",
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
 * Лист подтверждения на телефоне: последствия списком, фокус на отказе.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sheet006({
  triggerLabel = "Удалить проект",
  title = "Удалить проект «Витрина»?",
  text = "Действие необратимо и затрагивает всех участников пространства.",
  consequences = DEFAULT_CONSEQUENCES,
  confirmLabel = "Удалить навсегда",
  cancelLabel = "Не удалять",
  warningLabel = "Внимание",
  danger,
  background = "",
  className,
  style,
  ...props
}: Sheet006Props) {
  const sheet = useRef<HTMLDialogElement>(null)
  const heading = useId()

  const palette = {
    ...(danger ? { "--vibeui-sheet-006-danger": danger } : null),
    ...(background
      ? {
          "--vibeui-sheet-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-sheet-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="sheet"
        data-vibeui-block="sheet-006"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="trigger"
          onClick={() => sheet.current?.showModal()}
        >
          {triggerLabel}
        </button>
        <dialog
          ref={sheet}
          aria-labelledby={heading}
          onClick={(event) => {
            if (event.target === sheet.current) {
              sheet.current.close()
            }
          }}
        >
          <form method="dialog">
            <span data-part="grabber" aria-hidden="true" />
            <span data-part="mark" aria-hidden="true" />
            <span data-part="sr">{warningLabel}</span>
            <h2 data-part="title" id={heading}>
              {title}
            </h2>
            <p data-part="text">{text}</p>
            <ul data-part="list">
              {consequences.map((item) => (
                <li key={item} data-part="item">
                  {item}
                </li>
              ))}
            </ul>
            <div data-part="actions">
              <button type="submit" value="confirm" data-danger="true">
                {confirmLabel}
              </button>
              <button type="submit" value="cancel" autoFocus>
                {cancelLabel}
              </button>
            </div>
          </form>
        </dialog>
      </div>
    </>
  )
}
