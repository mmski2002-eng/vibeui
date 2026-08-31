"use client"

import { useRef } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Alertdialog003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  text?: string
  saveLabel?: string
  discardLabel?: string
  cancel?: string
  accent?: string
}

// Идея компонента: развилка о несохранённых изменениях. Здесь три исхода, а не
// два: сохранить, уйти без сохранения и остаться. Классическая ошибка — выкинуть
// «остаться» и оставить пару «сохранить / не сохранять», после чего закрытие
// окна крестиком означает неизвестно что. Разрушающий вариант оформлен
// вторичной кнопкой, а не красной: красная рядом с «Сохранить» нажимается по
// инерции. Закрытие по Escape равнозначно «остаться» — это самый безопасный исход.
const STYLES = `
:where([data-vibeui-block="alertdialog-003"]){
--vibeui-alertdialog-003-bg:oklch(1 0 0);
--vibeui-alertdialog-003-fg:oklch(0.22 0.014 265);
--vibeui-alertdialog-003-muted:oklch(0.55 0.014 265);
--vibeui-alertdialog-003-border:oklch(0.9 0.006 265);
--vibeui-alertdialog-003-accent:oklch(0.55 0.2 262);
--vibeui-alertdialog-003-warn:oklch(0.72 0.15 75);
--vibeui-alertdialog-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 55%);
font-family:var(--vibeui-alertdialog-003-font);
}
[data-vibeui-block="alertdialog-003"] dialog::backdrop{background:oklch(0.2 0.02 265 / 45%)}
[data-vibeui-block="alertdialog-003"] [data-part="head"]{display:flex;gap:0.625rem;margin-bottom:0.75rem}
[data-vibeui-block="alertdialog-003"] [data-part="mark"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:9999px;
background:oklch(0.72 0.15 75 / 18%);color:var(--vibeui-alertdialog-003-warn);
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
[data-vibeui-block="alertdialog-003"] [data-part="save"]{border:0;background:var(--vibeui-alertdialog-003-accent);color:oklch(1 0 0)}
/* Разрушающий вариант вторичной кнопкой: красная рядом жмётся по инерции. */
[data-vibeui-block="alertdialog-003"] [data-part="discard"],
[data-vibeui-block="alertdialog-003"] [data-part="stay"]{
border:1px solid var(--vibeui-alertdialog-003-border);
background:var(--vibeui-alertdialog-003-bg);color:inherit;
}
[data-vibeui-block="alertdialog-003"] [data-part="stay"]{border-color:transparent;color:var(--vibeui-alertdialog-003-muted)}
[data-vibeui-block="alertdialog-003"] dialog button:focus-visible{outline:2px solid var(--vibeui-alertdialog-003-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alertdialog-003"] *{animation:none!important;transition:none!important}}
`

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
  accent,
  className,
  style,
  ...props
}: Alertdialog003Props) {
  const box = useRef<HTMLDialogElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-alertdialog-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alertdialog-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
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

        <dialog ref={box} aria-labelledby="vibeui-alertdialog-003-title">
          <div data-part="head">
            <span data-part="mark" aria-hidden="true">
              !
            </span>
            <div>
              <h2 id="vibeui-alertdialog-003-title">{title}</h2>
              <p data-part="text">{text}</p>
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
