"use client"

import { useEffect, useId, useRef } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Alertdialog003Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  text?: string
  saveLabel?: string
  discardLabel?: string
  cancel?: string
  /** Открыть панель сразу и без модального режима: она остаётся внутри блока. */
  defaultOpen?: boolean
  accent?: string
  /** Подложка окна и кнопки открытия. Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: развилка о несохранённых изменениях. Здесь три исхода, а не
// два: сохранить, уйти без сохранения и остаться. Классическая ошибка — выкинуть
// «остаться» и оставить пару «сохранить / не сохранять», после чего закрытие
// окна крестиком означает неизвестно что. Разрушающий вариант оформлен
// вторичной кнопкой, а не красной: красная рядом с «Сохранить» нажимается по
// инерции. Закрытие по Escape равнозначно «остаться» — это самый безопасный исход.
const STYLES = `
:where([data-vibeui-block="alertdialog-003"]){
--vibeui-alertdialog-003-bg:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-alertdialog-003-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-alertdialog-003-muted:color-mix(in oklab,var(--vibeui-alertdialog-003-fg) 68%,transparent);
--vibeui-alertdialog-003-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-alertdialog-003-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.72 0.18 39.8));
--vibeui-alertdialog-003-on-accent:light-dark(oklch(1 0 0),oklch(0.17 0 262));
--vibeui-alertdialog-003-warn:light-dark(oklch(0.66 0.15 70),oklch(0.82 0.14 78));
--vibeui-alertdialog-003-warn-bg:light-dark(oklch(0.72 0.15 75 / 18%),oklch(0.82 0.14 78 / 20%));
--vibeui-alertdialog-003-shadow:light-dark(oklch(0.2 0 265 / 55%),oklch(0.02 0 265 / 70%));
--vibeui-alertdialog-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="alertdialog-003"]{color-scheme:dark}
[data-vibeui-block="alertdialog-003"]{
font-family:var(--vibeui-alertdialog-003-font);color:var(--vibeui-alertdialog-003-fg);
}
[data-vibeui-block="alertdialog-003"] *{box-sizing:border-box}
[data-vibeui-block="alertdialog-003"] [data-part="open"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-alertdialog-003-border);border-radius:0.625rem;
background:var(--vibeui-alertdialog-003-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-003"] [data-part="open"]:focus-visible{outline:2px solid var(--vibeui-alertdialog-003-accent);outline-offset:2px}
/* margin:auto — без него модалка липнет к левому верхнему углу. */
[data-vibeui-block="alertdialog-003"] dialog{
margin:auto;width:min(23rem,calc(100vw - 2rem));padding:1.125rem;
border:1px solid var(--vibeui-alertdialog-003-border);border-radius:0.875rem;
background:var(--vibeui-alertdialog-003-bg);color:var(--vibeui-alertdialog-003-fg);
box-shadow:0 24px 60px -24px var(--vibeui-alertdialog-003-shadow);
font-family:var(--vibeui-alertdialog-003-font);
}
[data-vibeui-block="alertdialog-003"] dialog::backdrop{background:light-dark(oklch(0.2 0 265 / 45%),oklch(0.08 0 265 / 62%))}
[data-vibeui-block="alertdialog-003"] [data-part="head"]{display:flex;gap:0.625rem;margin-bottom:0.75rem}
[data-vibeui-block="alertdialog-003"] [data-part="mark"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:9999px;
background:var(--vibeui-alertdialog-003-warn-bg);color:var(--vibeui-alertdialog-003-warn);
font-size:0.9375rem;font-weight:700;line-height:1;
}
[data-vibeui-block="alertdialog-003"] h2{margin:0 0 0.25rem;font-size:1rem;font-weight:700;line-height:1.3}
[data-vibeui-block="alertdialog-003"] [data-part="text"]{margin:0;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-alertdialog-003-muted)}
/* Три исхода в столбик: «остаться» нельзя выкидывать ради симметрии кнопок. */
[data-vibeui-block="alertdialog-003"] [data-part="actions"]{display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="alertdialog-003"] [data-part="actions"] button{
width:100%;appearance:none;cursor:pointer;height:2.375rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-003"] [data-part="save"]{border:0;background:var(--vibeui-alertdialog-003-accent);color:var(--vibeui-alertdialog-003-on-accent)}
/* Разрушающий вариант вторичной кнопкой: красная рядом жмётся по инерции. */
[data-vibeui-block="alertdialog-003"] [data-part="discard"],
[data-vibeui-block="alertdialog-003"] [data-part="stay"]{
border:1px solid var(--vibeui-alertdialog-003-border);
background:var(--vibeui-alertdialog-003-bg);color:inherit;
}
[data-vibeui-block="alertdialog-003"] [data-part="stay"]{border-color:transparent;color:var(--vibeui-alertdialog-003-muted)}
[data-vibeui-block="alertdialog-003"] dialog button:focus-visible{outline:2px solid var(--vibeui-alertdialog-003-accent);outline-offset:2px}
/* showModal() делает фон inert, но не запрещает прокрутку страницы. */
html:has([data-vibeui-block="alertdialog-003"] dialog[open]:modal){overflow:hidden}
/* Немодальный показ: панель остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так её показывают на витрине и в документации. */
[data-vibeui-block="alertdialog-003"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:22rem;
}
[data-vibeui-block="alertdialog-003"] dialog:not(:modal){position:absolute;max-width:100%;max-height:100%;z-index:1}
[data-vibeui-block="alertdialog-003"]:has(dialog:not(:modal)[open]) [data-part="open"]{display:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alertdialog-003"] *{animation:none!important;transition:none!important}}
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
 * Развилка о несохранённых изменениях: три исхода, а не два.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alertdialog003({
  triggerLabel = "Закрыть редактор",
  title = "Изменения не сохранены",
  text = "В блоке «Тарифы» есть правки, которых нет в опубликованной версии. Что с ними сделать?",
  saveLabel = "Сохранить и закрыть",
  discardLabel = "Закрыть без сохранения",
  cancel = "Остаться в редакторе",
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Alertdialog003Props) {
  const box = useRef<HTMLDialogElement>(null)
  const uid = useId()

  useEffect(() => {
    if (!defaultOpen) {
      return
    }

    const active = document.activeElement

    // show() вместо showModal(): немодальная панель живёт внутри своего блока
    // и не уводит страницу в верхний слой. Витрине нужна именно такая.
    box.current?.show()

    // show() уводит фокус внутрь панели. Для немодального показа это лишнее:
    // страница не должна прыгать к панели просто потому, что та открыта.
    if (active instanceof HTMLElement && active !== document.body) {
      active.focus()
    } else if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [defaultOpen])

  const palette = {
    ...(accent ? { "--vibeui-alertdialog-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-alertdialog-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alertdialog-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="alert-dialog"
        data-vibeui-block="alertdialog-003"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="open"
          onClick={() => box.current?.showModal()}
        >
          {triggerLabel}
        </button>

        <dialog
          ref={box}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={`${uid}-title`}
          aria-describedby={`${uid}-text`}
        >
          <div data-part="head">
            <span data-part="mark" aria-hidden="true">
              !
            </span>
            <div>
              <h2 id={`${uid}-title`}>{title}</h2>
              <p id={`${uid}-text`} data-part="text">
                {text}
              </p>
            </div>
          </div>

          <div data-part="actions">
            <button
              type="button"
              data-part="save"
              autoFocus
              onClick={() => box.current?.close()}
            >
              {saveLabel}
            </button>
            <button
              type="button"
              data-part="discard"
              onClick={() => box.current?.close()}
            >
              {discardLabel}
            </button>
            <button
              type="button"
              data-part="stay"
              onClick={() => box.current?.close()}
            >
              {cancel}
            </button>
          </div>
        </dialog>
      </div>
    </>
  )
}
