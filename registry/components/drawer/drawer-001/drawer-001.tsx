"use client"

import { useRef } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Drawer001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  text?: string
  primaryLabel?: string
  accent?: string
}

// Идея компонента: панель, выезжающая сбоку, на нативном dialog. Модальный
// dialog даёт ловушку фокуса, затемнение и Escape без единой строки логики —
// повторить это руками стоит сотни строк и обычно выходит хуже. Панель
// шириной в 28rem: она перекрывает часть страницы, но не всю.
const STYLES = `
:where([data-vibeui-block="drawer-001"]){
--vibeui-drawer-001-bg:oklch(1 0 0);
--vibeui-drawer-001-fg:oklch(0.22 0.014 265);
--vibeui-drawer-001-muted:oklch(0.56 0.014 265);
--vibeui-drawer-001-border:oklch(0.9 0.006 265);
--vibeui-drawer-001-accent:oklch(0.55 0.17 265);
--vibeui-drawer-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
background:var(--vibeui-drawer-001-bg);color:inherit;
box-shadow:-24px 0 60px -30px oklch(0.2 0.02 265 / 55%);
translate:100% 0;transition:translate .22s ease,overlay .22s allow-discrete,display .22s allow-discrete;
}
[data-vibeui-block="drawer-001"] dialog[open]{translate:0 0}
@starting-style{
[data-vibeui-block="drawer-001"] dialog[open]{translate:100% 0}
}
[data-vibeui-block="drawer-001"] dialog::backdrop{background:oklch(0.2 0.02 265 / 45%)}
[data-vibeui-block="drawer-001"] [data-part="panel"]{
display:flex;flex-direction:column;gap:0.75rem;height:100%;box-sizing:border-box;padding:1.125rem;
}
[data-vibeui-block="drawer-001"] [data-part="head"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="drawer-001"] [data-part="title"]{margin:0;font-size:1.0625rem;font-weight:680;line-height:1.25}
[data-vibeui-block="drawer-001"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;background:transparent;flex:none;
display:flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:0.5rem;color:var(--vibeui-drawer-001-muted);
}
[data-vibeui-block="drawer-001"] [data-part="close"]:hover{background:oklch(0.96 0.004 265);color:var(--vibeui-drawer-001-fg)}
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
border-color:transparent;background:var(--vibeui-drawer-001-accent);color:oklch(0.99 0.01 265);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="drawer-001"] dialog{transition:none!important;translate:0 0}
}
`

/**
 * Боковая панель на нативном dialog: ловушка фокуса и Escape — от браузера.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Drawer001({
  triggerLabel = "Открыть панель",
  title = "Настройки каталога",
  text = "Что показывать в списке, как сортировать и кому доступен каталог. Изменения применяются сразу.",
  primaryLabel = "Сохранить",
  accent,
  className,
  style,
  ...props
}: Drawer001Props) {
  const panel = useRef<HTMLDialogElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-drawer-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-drawer-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
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
                aria-label="Закрыть панель"
                onClick={() => panel.current?.close()}
              >
                <span data-part="cross" aria-hidden="true" />
              </button>
            </div>
            <p data-part="text">{text}</p>
            <div data-part="foot">
              <button type="button" onClick={() => panel.current?.close()}>
                Отмена
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
