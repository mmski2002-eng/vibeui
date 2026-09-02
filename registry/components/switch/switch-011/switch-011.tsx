"use client"

import { useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Switch011Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  description?: string
  /** Текст вопроса в модальном окне: что именно случится после включения. */
  question?: string
  confirmText?: string
  cancelText?: string
  /** Пусто — подложки нет, карточка держится рамкой на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: обратная опасность по сравнению с обычным «опасным»
// переключателем. Здесь рискует именно включение — например открытие
// публичного доступа, — поэтому тумблер физически не двигается, пока
// человек не подтвердит действие в нативном <dialog>. Выключение обратно
// безопасно и срабатывает мгновенно, без вопросов.
const STYLES = `
:where([data-vibeui-block="switch-011"]){
--vibeui-switch-011-bg:transparent;
/* Диалог поверх страницы обязан быть непрозрачным: у него своя заливка,
   не связанная с подложкой самой строки. */
--vibeui-switch-011-panel:light-dark(oklch(1 0 0),oklch(0.24 0.012 265));
--vibeui-switch-011-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-switch-011-muted:light-dark(oklch(0.54 0.014 265),oklch(0.7 0.012 265));
--vibeui-switch-011-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-switch-011-track:light-dark(oklch(0.88 0.008 265),oklch(0.43 0.014 265));
--vibeui-switch-011-thumb:light-dark(oklch(1 0 0),oklch(0.93 0.004 265));
--vibeui-switch-011-accent:light-dark(oklch(0.55 0.2 25),oklch(0.68 0.18 25));
--vibeui-switch-011-accent-ink:light-dark(oklch(1 0 0),oklch(0.18 0.04 25));
--vibeui-switch-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="switch-011"]{
display:flex;align-items:center;gap:1rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-switch-011-bg);
border:1px solid var(--vibeui-switch-011-border);border-radius:0.875rem;
font-family:var(--vibeui-switch-011-font);color:var(--vibeui-switch-011-fg);
}
[data-vibeui-block="switch-011"] [data-part="row"]{display:flex;align-items:center;gap:1rem;flex:1 1 auto;cursor:pointer;min-width:0}
[data-vibeui-block="switch-011"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="switch-011"] [data-part="label"]{font-size:0.9375rem;font-weight:600;line-height:1.3}
[data-vibeui-block="switch-011"] [data-part="description"]{font-size:0.8125rem;line-height:1.4;color:var(--vibeui-switch-011-muted)}
[data-vibeui-block="switch-011"] [data-part="track"]{position:relative;display:flex;flex:none}
[data-vibeui-block="switch-011"] input{
appearance:none;-webkit-appearance:none;margin:0;
width:2.75rem;height:1.5rem;border-radius:9999px;
background:var(--vibeui-switch-011-track);cursor:inherit;
transition:background-color .18s ease;
}
[data-vibeui-block="switch-011"] input:checked{background:var(--vibeui-switch-011-accent)}
[data-vibeui-block="switch-011"] input:focus-visible{outline:2px solid var(--vibeui-switch-011-accent);outline-offset:2px}
[data-vibeui-block="switch-011"] [data-part="thumb"]{
position:absolute;left:0.1875rem;top:0.1875rem;
width:1.125rem;height:1.125rem;border-radius:9999px;pointer-events:none;
background:var(--vibeui-switch-011-thumb);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 28%);
transition:transform .18s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="switch-011"] input:checked + [data-part="thumb"]{transform:translateX(1.25rem)}
/* Нативный <dialog> вместо встроенной панели: настоящая модальная ловушка
   фокуса и закрытие по Esc достаются даром, без ручной разметки. */
[data-vibeui-block="switch-011"] [data-part="dialog"]{
box-sizing:border-box;width:min(22rem,calc(100vw - 2rem));
padding:1.125rem;border:1px solid var(--vibeui-switch-011-border);border-radius:0.875rem;
background:var(--vibeui-switch-011-panel);color:var(--vibeui-switch-011-fg);
font-family:var(--vibeui-switch-011-font);
box-shadow:0 20px 44px oklch(0.2 0.02 265 / 22%);
}
[data-vibeui-block="switch-011"] [data-part="dialog"]::backdrop{
background:oklch(0.15 0.01 265 / 45%);
}
[data-vibeui-block="switch-011"] [data-part="dialog"][open]{
animation:vibeui-switch-011-in .16s ease-out;
}
@keyframes vibeui-switch-011-in{from{opacity:0;transform:translateY(-0.375rem)}to{opacity:1;transform:none}}
[data-vibeui-block="switch-011"] [data-part="question"]{margin:0 0 0.875rem;font-size:0.875rem;line-height:1.5}
[data-vibeui-block="switch-011"] [data-part="actions"]{display:flex;gap:0.5rem}
[data-vibeui-block="switch-011"] button{
flex:1 1 0;appearance:none;cursor:pointer;
height:2.25rem;padding:0 0.75rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;font-weight:600;
transition:filter .16s ease;
}
[data-vibeui-block="switch-011"] [data-part="confirm"]{
border:0;background:var(--vibeui-switch-011-accent);color:var(--vibeui-switch-011-accent-ink);
}
[data-vibeui-block="switch-011"] [data-part="cancel"]{
border:1px solid var(--vibeui-switch-011-border);
background:var(--vibeui-switch-011-panel);color:inherit;
}
[data-vibeui-block="switch-011"] button:hover{filter:brightness(.96)}
[data-vibeui-block="switch-011"] button:focus-visible{outline:2px solid var(--vibeui-switch-011-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="switch-011"] *{animation:none!important;transition:none!important}}
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
 * Переключатель опасного включения: подтверждение спрашивается в нативном
 * диалоге только у включения, выключение мгновенно.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Switch011({
  label = "Публичная ссылка на проект",
  description = "Любой человек со ссылкой сможет открыть проект без приглашения.",
  question = "Открыть доступ по ссылке? Проект смогут увидеть все, у кого она окажется.",
  confirmText = "Открыть доступ",
  cancelText = "Отмена",
  background = "",
  accent,
  className,
  style,
  ...props
}: Switch011Props) {
  const id = useId()
  const [checked, setChecked] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-switch-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-switch-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-switch-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="switch-011"
        className={className}
        style={palette}
      >
        <label data-part="row" htmlFor={id}>
          <span data-part="text">
            <span data-part="label">{label}</span>
            <span data-part="description">{description}</span>
          </span>
          <span data-part="track">
            <input
              id={id}
              type="checkbox"
              role="switch"
              checked={checked}
              onChange={(event) => {
                if (!event.target.checked) {
                  // Обратное направление безопасно — применяется сразу.
                  setChecked(false)
                  return
                }

                if (!dialogRef.current?.open) {
                  dialogRef.current?.showModal()
                }
              }}
            />
            <span data-part="thumb" aria-hidden="true" />
          </span>
        </label>
        <dialog
          ref={dialogRef}
          data-part="dialog"
          aria-labelledby={`${id}-question`}
        >
          <p data-part="question" id={`${id}-question`}>
            {question}
          </p>
          <div data-part="actions">
            <button
              type="button"
              data-part="confirm"
              onClick={() => {
                setChecked(true)
                dialogRef.current?.close()
              }}
            >
              {confirmText}
            </button>
            <button
              type="button"
              data-part="cancel"
              onClick={() => dialogRef.current?.close()}
            >
              {cancelText}
            </button>
          </div>
        </dialog>
      </div>
    </>
  )
}
