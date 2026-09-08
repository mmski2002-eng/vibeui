"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Toast022Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  title?: string
  message?: string
  actionLabel?: string
  closeLabel?: string
  /** Подпись у переключателя подавления. */
  muteLabel?: string
  /** Что показать на месте сообщения после подавления. */
  mutedText?: string
  /** Что показать на месте сообщения после обычного закрытия. */
  closedText?: string
  /** Подпись кнопки возврата подсказок. */
  restoreLabel?: string
  tone?: string
  /** Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: подсказка, которую можно попросить больше не показывать.
// Совет полезен один раз, а на десятый превращается в помеху, и человек
// начинает закрывать сообщения не читая. Здесь подавление стоит прямо в
// сообщении, а не в настройках через три экрана: решение принимают там же,
// где раздражение. Отказ не безвозвратен — на месте сообщения остаётся
// строка с возвратом, потому что «больше не показывать» люди нажимают и
// случайно.
const STYLES = `
:where([data-vibeui-block="toast-022"]){
--vibeui-toast-022-bg:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-toast-022-fg:light-dark(oklch(0.24 0 265),oklch(0.95 0 265));
--vibeui-toast-022-muted:color-mix(in oklab,var(--vibeui-toast-022-fg) 64%,transparent);
--vibeui-toast-022-border:light-dark(oklch(0.89 0 265),oklch(0.36 0 265));
--vibeui-toast-022-hover:light-dark(oklch(0 0 0 / 5%),oklch(1 0 0 / 7%));
--vibeui-toast-022-tone:light-dark(oklch(0.5 0.16 39.8),oklch(0.78 0.12 39.8));
--vibeui-toast-022-on-tone:oklch(from var(--vibeui-toast-022-tone) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-toast-022-shadow:light-dark(oklch(0.2 0 265 / 22%),oklch(0 0 0 / 58%));
--vibeui-toast-022-radius:0.875rem;
--vibeui-toast-022-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toast-022"]{color-scheme:dark}
[data-vibeui-block="toast-022"]{
width:100%;max-width:23rem;box-sizing:border-box;
font-family:var(--vibeui-toast-022-font);color:var(--vibeui-toast-022-fg);
}
[data-vibeui-block="toast-022"] *{box-sizing:border-box}
[data-vibeui-block="toast-022"] [data-part="card"]{
display:flex;flex-direction:column;gap:0.5rem;
padding:0.75rem 0.875rem;
border:1px solid var(--vibeui-toast-022-border);border-radius:var(--vibeui-toast-022-radius);
background:var(--vibeui-toast-022-bg);
box-shadow:0 16px 40px -26px var(--vibeui-toast-022-shadow);
}
[data-vibeui-block="toast-022"] [data-part="head"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="toast-022"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="toast-022"] [data-part="text"]{
margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-toast-022-muted);
}
[data-vibeui-block="toast-022"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;border-radius:0.4375rem;
background:transparent;color:var(--vibeui-toast-022-muted);font:inherit;
}
[data-vibeui-block="toast-022"] [data-part="close"]:hover{background:var(--vibeui-toast-022-hover);color:var(--vibeui-toast-022-fg)}
[data-vibeui-block="toast-022"] [data-part="foot"]{
display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.5rem;
}
/* Подавление живёт в самом сообщении: решение принимают там, где возникло
   раздражение, а не в настройках через три экрана. */
[data-vibeui-block="toast-022"] [data-part="mute"]{
display:inline-flex;align-items:center;gap:0.4375rem;cursor:pointer;
font-size:0.75rem;color:var(--vibeui-toast-022-muted);
}
[data-vibeui-block="toast-022"] [data-part="mute"] input{
width:0.875rem;height:0.875rem;margin:0;accent-color:var(--vibeui-toast-022-tone);
}
[data-vibeui-block="toast-022"] [data-part="action"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:1.875rem;padding:0.25rem 0.75rem;border-radius:0.5rem;
background:var(--vibeui-toast-022-tone);color:var(--vibeui-toast-022-on-tone);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="toast-022"] [data-part="muted"]{
display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.625rem 0.875rem;
border:1px dashed var(--vibeui-toast-022-border);border-radius:var(--vibeui-toast-022-radius);
font-size:0.8125rem;color:var(--vibeui-toast-022-muted);
}
/* Возврат стоит на месте сообщения: «больше не показывать» нажимают и
   случайно, и отменить это должно быть можно сразу. */
[data-vibeui-block="toast-022"] [data-part="restore"]{
appearance:none;cursor:pointer;
min-height:1.75rem;padding:0.1875rem 0.625rem;border-radius:0.4375rem;
border:1px solid var(--vibeui-toast-022-border);
background:transparent;color:var(--vibeui-toast-022-fg);
font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="toast-022"] :focus-visible{outline:2px solid var(--vibeui-toast-022-tone);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-022"] *{animation:none!important;transition:none!important}}
`

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
 * Сообщение с подавлением: «больше не показывать» рядом с самой подсказкой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast022({
  title = "Черновик сохраняется сам",
  message = "Каждые тридцать секунд и при уходе со страницы. Кнопка сохранения не нужна.",
  actionLabel = "Понятно",
  closeLabel = "Закрыть сообщение",
  muteLabel = "Больше не показывать",
  mutedText = "Подсказка отключена",
  closedText = "Сообщение закрыто",
  restoreLabel = "Вернуть",
  tone,
  background = "",
  className,
  style,
  ...props
}: Toast022Props) {
  const [state, setState] = useState<"open" | "closed" | "muted">("open")
  const [wantMute, setWantMute] = useState(false)

  const palette = {
    ...(tone ? { "--vibeui-toast-022-tone": tone } : null),
    ...(background
      ? {
          "--vibeui-toast-022-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  // Галочка срабатывает при закрытии, а не сразу: отметить и передумать
  // человек должен успеть, не теряя сообщение.
  const close = () => setState(wantMute ? "muted" : "closed")

  return (
    <>
      <style href="vibeui-toast-022" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="toast"
        data-vibeui-block="toast-022"
        role="status"
        aria-live="polite"
        className={className}
        style={palette}
      >
        {state !== "open" ? (
          // Закрытое сообщение не исчезает бесследно: на его месте остаётся
          // строка возврата — «больше не показывать» нажимают и случайно.
          <div data-part="muted">
            {state === "muted" ? mutedText : closedText}
            <button
              type="button"
              data-part="restore"
              onClick={() => {
                setState("open")
                setWantMute(false)
              }}
            >
              {restoreLabel}
            </button>
          </div>
        ) : (
          <div data-part="card">
            <div data-part="head">
              <p data-part="title">{title}</p>
              <button
                type="button"
                data-part="close"
                aria-label={closeLabel}
                onClick={close}
              >
                ×
              </button>
            </div>

            <p data-part="text">{message}</p>

            <div data-part="foot">
              <label data-part="mute">
                <input
                  type="checkbox"
                  checked={wantMute}
                  onChange={(event) => setWantMute(event.target.checked)}
                />
                {muteLabel}
              </label>
              <button type="button" data-part="action" onClick={close}>
                {actionLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
