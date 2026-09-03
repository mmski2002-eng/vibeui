"use client"

import { useEffect, useId, useRef } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Alertdialog001Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  text?: string
  confirm?: string
  cancel?: string
  /** Открыть панель сразу и без модального режима: она остаётся внутри блока. */
  defaultOpen?: boolean
  accent?: string
  /** Подложка окна и кнопки открытия. Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: базовое подтверждение на нативном <dialog>. Модалка даёт
// ловушку фокуса, закрытие по Escape и фон — три вещи, которые в своей
// реализации чинятся дольше всего. Кнопка отмены стоит первой в разметке и
// получает фокус при открытии: если человек нажмёт Enter не глядя, ничего не
// случится. Заголовок формулирует вопрос, а кнопка называет действие —
// «Вы уверены?» с кнопками «Да» и «Нет» заставляет перечитывать текст.
const STYLES = `
:where([data-vibeui-block="alertdialog-001"]){
--vibeui-alertdialog-001-bg:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-alertdialog-001-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-alertdialog-001-muted:color-mix(in oklab,var(--vibeui-alertdialog-001-fg) 68%,transparent);
--vibeui-alertdialog-001-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-alertdialog-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262));
--vibeui-alertdialog-001-on-accent:light-dark(oklch(1 0 0),oklch(0.17 0.03 262));
--vibeui-alertdialog-001-shadow:light-dark(oklch(0.2 0.03 265 / 55%),oklch(0.02 0.01 265 / 70%));
--vibeui-alertdialog-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="alertdialog-001"]{color-scheme:dark}
[data-vibeui-block="alertdialog-001"]{
font-family:var(--vibeui-alertdialog-001-font);color:var(--vibeui-alertdialog-001-fg);
}
[data-vibeui-block="alertdialog-001"] *{box-sizing:border-box}
[data-vibeui-block="alertdialog-001"] [data-part="open"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-alertdialog-001-border);border-radius:0.625rem;
background:var(--vibeui-alertdialog-001-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-001"] [data-part="open"]:focus-visible{outline:2px solid var(--vibeui-alertdialog-001-accent);outline-offset:2px}
/* margin:auto — без него модалка липнет к левому верхнему углу. */
[data-vibeui-block="alertdialog-001"] dialog{
margin:auto;width:min(22rem,calc(100vw - 2rem));padding:1.125rem;
border:1px solid var(--vibeui-alertdialog-001-border);border-radius:0.875rem;
background:var(--vibeui-alertdialog-001-bg);color:var(--vibeui-alertdialog-001-fg);
box-shadow:0 24px 60px -24px var(--vibeui-alertdialog-001-shadow);
font-family:var(--vibeui-alertdialog-001-font);
}
[data-vibeui-block="alertdialog-001"] dialog::backdrop{background:light-dark(oklch(0.2 0.02 265 / 45%),oklch(0.08 0.014 265 / 62%))}
[data-vibeui-block="alertdialog-001"] h2{margin:0 0 0.375rem;font-size:1rem;font-weight:700;line-height:1.3}
[data-vibeui-block="alertdialog-001"] [data-part="text"]{
margin:0 0 1rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-alertdialog-001-muted);
}
/* Отмена первой в разметке и в фокусе: Enter вслепую ничего не ломает. */
[data-vibeui-block="alertdialog-001"] [data-part="actions"]{
display:flex;flex-direction:row-reverse;gap:0.5rem;
}
[data-vibeui-block="alertdialog-001"] button[data-part="confirm"],
[data-vibeui-block="alertdialog-001"] button[data-part="cancel"]{
flex:1 1 0;appearance:none;cursor:pointer;height:2.375rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-001"] [data-part="confirm"]{
border:0;background:var(--vibeui-alertdialog-001-accent);color:var(--vibeui-alertdialog-001-on-accent);
}
[data-vibeui-block="alertdialog-001"] [data-part="cancel"]{
border:1px solid var(--vibeui-alertdialog-001-border);
background:var(--vibeui-alertdialog-001-bg);color:inherit;
}
[data-vibeui-block="alertdialog-001"] dialog button:focus-visible{outline:2px solid var(--vibeui-alertdialog-001-accent);outline-offset:2px}
/* showModal() делает фон inert, но не запрещает прокрутку страницы. */
html:has([data-vibeui-block="alertdialog-001"] dialog[open]:modal){overflow:hidden}
/* Немодальный показ: панель остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так её показывают на витрине и в документации. */
[data-vibeui-block="alertdialog-001"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:22rem;
}
[data-vibeui-block="alertdialog-001"] dialog:not(:modal){position:absolute;max-width:100%;max-height:100%;z-index:1}
[data-vibeui-block="alertdialog-001"]:has(dialog:not(:modal)[open]) [data-part="open"]{display:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alertdialog-001"] *{animation:none!important;transition:none!important}}
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
 * Подтверждение на нативном dialog: фокус на отмене, действие названо кнопкой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alertdialog001({
  triggerLabel = "Опубликовать",
  title = "Опубликовать каталог?",
  text = "Страницы станут доступны всем по ссылке. Изменения можно откатить в истории версий.",
  confirm = "Опубликовать",
  cancel = "Не сейчас",
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Alertdialog001Props) {
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
    ...(accent ? { "--vibeui-alertdialog-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-alertdialog-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alertdialog-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="alert-dialog"
        data-vibeui-block="alertdialog-001"
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
          <h2 id={`${uid}-title`}>{title}</h2>
          <p id={`${uid}-text`} data-part="text">
            {text}
          </p>
          <div data-part="actions">
            <button
              type="button"
              data-part="confirm"
              onClick={() => box.current?.close()}
            >
              {confirm}
            </button>
            <button
              type="button"
              data-part="cancel"
              autoFocus
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
