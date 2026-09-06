"use client"

import { useEffect, useRef } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Drawer001Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  text?: string
  primaryLabel?: string
  /** Подпись кнопки отмены: компонент несёт русскую, проект подставляет свою. */
  cancelLabel?: string
  /** Имя крестика для скринридера. */
  closeLabel?: string
  /** Пусто — подложки нет, триггер лежит прямо на фоне страницы. */
  background?: string
  /** Открыть шторку сразу и без модального режима: она остаётся внутри блока. */
  defaultOpen?: boolean
  accent?: string
}

// Идея компонента: панель, выезжающая сбоку, на нативном dialog. Модальный
// dialog даёт ловушку фокуса, затемнение и Escape без единой строки логики —
// повторить это руками стоит сотни строк и обычно выходит хуже. Панель
// шириной в 28rem: она перекрывает часть страницы, но не всю.
const STYLES = `
:where([data-vibeui-block="drawer-001"]){
--vibeui-drawer-001-bg:transparent;
--vibeui-drawer-001-surface:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-drawer-001-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-drawer-001-muted:color-mix(in oklab,var(--vibeui-drawer-001-fg) 68%,transparent);
--vibeui-drawer-001-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-drawer-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.73 0.15 265));
--vibeui-drawer-001-on-accent:light-dark(oklch(0.99 0 265),oklch(0.17 0 265));
--vibeui-drawer-001-hover:light-dark(oklch(0.96 0 265),oklch(0.29 0 265));
--vibeui-drawer-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="drawer-001"]{color-scheme:dark}
[data-vibeui-block="drawer-001"]{
display:inline-block;font-family:var(--vibeui-drawer-001-font);color:var(--vibeui-drawer-001-fg);
}
[data-vibeui-block="drawer-001"] [data-part="trigger"]{
appearance:none;cursor:pointer;
height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-drawer-001-border);border-radius:0.625rem;
background:var(--vibeui-drawer-001-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="drawer-001"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-drawer-001-accent);outline-offset:2px}
/* Нативный dialog: ловушка фокуса, затемнение и Escape — без логики. */
[data-vibeui-block="drawer-001"] dialog{
position:fixed;inset:0 0 0 auto;
width:min(28rem,100vw);max-width:100vw;height:100dvh;max-height:100dvh;
margin:0;padding:0;border:0;
background:var(--vibeui-drawer-001-surface);color:inherit;
box-shadow:-24px 0 60px -30px oklch(0.2 0 265 / 55%);
translate:100% 0;transition:translate .22s ease,overlay .22s allow-discrete,display .22s allow-discrete;
}
[data-vibeui-block="drawer-001"] dialog[open]{translate:0 0}
@starting-style{
[data-vibeui-block="drawer-001"] dialog[open]{translate:100% 0}
}
/* Затемнение позади ящика одно на обе темы: подложка гасит страницу, а не красится вместе с ней. */
[data-vibeui-block="drawer-001"] dialog::backdrop{background:oklch(0.2 0 265 / 45%)}
[data-vibeui-block="drawer-001"] [data-part="panel"]{
display:flex;flex-direction:column;gap:0.75rem;height:100%;box-sizing:border-box;padding:1.125rem;
}
[data-vibeui-block="drawer-001"] [data-part="head"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="drawer-001"] [data-part="title"]{margin:0;font-size:1rem;font-weight:680;line-height:1.25}
[data-vibeui-block="drawer-001"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;background:transparent;flex:none;
display:flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:0.5rem;color:var(--vibeui-drawer-001-muted);
}
[data-vibeui-block="drawer-001"] [data-part="close"]:hover{background:var(--vibeui-drawer-001-hover);color:var(--vibeui-drawer-001-fg)}
[data-vibeui-block="drawer-001"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-drawer-001-accent);outline-offset:2px}
[data-vibeui-block="drawer-001"] [data-part="cross"]{position:relative;width:0.625rem;height:0.625rem}
[data-vibeui-block="drawer-001"] [data-part="cross"]::before,
[data-vibeui-block="drawer-001"] [data-part="cross"]::after{
content:"";position:absolute;left:0;top:50%;width:100%;height:1.5px;
margin-top:-0.75px;background:currentColor;border-radius:9999px;
}
[data-vibeui-block="drawer-001"] [data-part="cross"]::before{transform:rotate(45deg)}
[data-vibeui-block="drawer-001"] [data-part="cross"]::after{transform:rotate(-45deg)}
[data-vibeui-block="drawer-001"] [data-part="text"]{margin:0;font-size:0.875rem;line-height:1.5;color:var(--vibeui-drawer-001-muted)}
/* Действия прижаты к низу: до них дотягиваются, не прокручивая панель. */
[data-vibeui-block="drawer-001"] [data-part="foot"]{
display:flex;gap:0.5rem;margin-top:auto;
padding-top:0.75rem;border-top:1px solid var(--vibeui-drawer-001-border);
}
[data-vibeui-block="drawer-001"] [data-part="foot"] button{
appearance:none;cursor:pointer;flex:1;
height:2.375rem;border-radius:0.625rem;
border:1px solid var(--vibeui-drawer-001-border);
background:transparent;color:inherit;font:inherit;font-size:0.875rem;font-weight:600;
}
[data-vibeui-block="drawer-001"] [data-part="foot"] button[data-primary="true"]{
border-color:transparent;background:var(--vibeui-drawer-001-accent);color:var(--vibeui-drawer-001-on-accent);
}
/* Немодальный показ: шторка остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так её показывают на витрине и в документации. */
[data-vibeui-block="drawer-001"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:24rem;
}
[data-vibeui-block="drawer-001"] dialog:not(:modal){position:absolute;max-width:100%;max-height:100%;z-index:1}
[data-vibeui-block="drawer-001"]:has(dialog:not(:modal)[open]) [data-part="trigger"]{display:none}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="drawer-001"] dialog{transition:none!important;translate:0 0}
}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Боковая панель на нативном dialog: ловушка фокуса и Escape — от браузера.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Drawer001({
  triggerLabel = "Открыть панель",
  title = "Настройки каталога",
  text = "Что показывать в списке, как сортировать и кому доступен каталог. Изменения применяются сразу.",
  primaryLabel = "Сохранить",
  cancelLabel = "Отмена",
  closeLabel = "Закрыть панель",
  background = "",
  defaultOpen = false,
  accent,
  className,
  style,
  ...props
}: Drawer001Props) {
  const panel = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!defaultOpen) {
      return
    }

    const active = document.activeElement

    // show() вместо showModal(): немодальная шторка живёт внутри своего блока
    // и не уводит страницу в верхний слой. Витрине нужна именно такая.
    panel.current?.show()

    // show() уводит фокус внутрь панели. Для немодального показа это лишнее:
    // страница не должна прыгать к шторке просто потому, что та открыта.
    if (active instanceof HTMLElement && active !== document.body) {
      active.focus()
    } else if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [defaultOpen])

  const palette = {
    ...(accent ? { "--vibeui-drawer-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-drawer-001-bg": background,
          "--vibeui-drawer-001-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-drawer-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="drawer"
        data-vibeui-block="drawer-001"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="trigger"
          onClick={() => panel.current?.showModal()}
        >
          {triggerLabel}
        </button>
        <dialog ref={panel} aria-label={title}>
          <div data-part="panel">
            <div data-part="head">
              <h2 data-part="title">{title}</h2>
              <button
                type="button"
                data-part="close"
                aria-label={closeLabel}
                onClick={() => panel.current?.close()}
              >
                <span data-part="cross" aria-hidden="true" />
              </button>
            </div>
            <p data-part="text">{text}</p>
            <div data-part="foot">
              <button type="button" onClick={() => panel.current?.close()}>
                {cancelLabel}
              </button>
              <button
                type="button"
                data-primary="true"
                onClick={() => panel.current?.close()}
              >
                {primaryLabel}
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </>
  )
}
