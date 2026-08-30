"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Menu007Action = {
  label: string
  hint?: string
  danger?: boolean
}

export type Menu007Props = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  title?: string
  actions?: Menu007Action[]
  cancelLabel?: string
  accent?: string
}

// Идея компонента: меню действий, которое на телефоне выезжает снизу. Список у
// края экрана — единственное место, куда дотягивается большой палец; выпадающее
// меню в верхнем углу для этого не годится. Кнопка «отмена» стоит отдельно и
// крупно: закрыть лист должно быть так же легко, как открыть.
const STYLES = `
:where([data-vibeui-block="menu-007"]){
--vibeui-menu-007-bg:oklch(1 0 0);
--vibeui-menu-007-fg:oklch(0.24 0.014 265);
--vibeui-menu-007-muted:oklch(0.56 0.014 265);
--vibeui-menu-007-border:oklch(0.9 0.006 265);
--vibeui-menu-007-hover:oklch(0.96 0.004 265);
--vibeui-menu-007-danger:oklch(0.56 0.19 25);
--vibeui-menu-007-accent:oklch(0.55 0.17 265);
--vibeui-menu-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="menu-007"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:17rem;box-sizing:border-box;
font-family:var(--vibeui-menu-007-font);color:var(--vibeui-menu-007-fg);
}
[data-vibeui-block="menu-007"] [data-part="trigger"]{
appearance:none;cursor:pointer;align-self:flex-start;
height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-menu-007-border);border-radius:0.625rem;
background:var(--vibeui-menu-007-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="menu-007"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-menu-007-accent);outline-offset:2px}
/* Лист прижат к нижнему краю: туда дотягивается большой палец. */
[data-vibeui-block="menu-007"] [data-part="sheet"]{
display:flex;flex-direction:column;gap:0.5rem;
padding:0.5rem 0.5rem calc(0.5rem + env(safe-area-inset-bottom,0px));
border:1px solid var(--vibeui-menu-007-border);
border-radius:1.125rem 1.125rem 0.875rem 0.875rem;
background:var(--vibeui-menu-007-bg);
box-shadow:0 -12px 32px -24px oklch(0.2 0.02 265 / 55%);
}
[data-vibeui-block="menu-007"] [data-part="grabber"]{
align-self:center;width:2.25rem;height:0.25rem;margin:0.125rem 0 0.25rem;
border-radius:9999px;background:var(--vibeui-menu-007-border);
}
[data-vibeui-block="menu-007"] [data-part="title"]{
padding:0 0.5rem 0.25rem;font-size:0.75rem;color:var(--vibeui-menu-007-muted);
}
[data-vibeui-block="menu-007"] [data-part="item"]{
display:flex;flex-direction:column;gap:0.0625rem;
width:100%;min-height:2.75rem;padding:0.4375rem 0.75rem;
appearance:none;border:0;border-radius:0.75rem;background:transparent;color:inherit;
font:inherit;font-size:0.9375rem;font-weight:600;text-align:left;cursor:pointer;
}
[data-vibeui-block="menu-007"] [data-part="item"]:hover{background:var(--vibeui-menu-007-hover)}
[data-vibeui-block="menu-007"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-menu-007-accent);outline-offset:-2px}
[data-vibeui-block="menu-007"] [data-part="item"][data-danger="true"]{color:var(--vibeui-menu-007-danger)}
[data-vibeui-block="menu-007"] [data-part="hint"]{font-size:0.75rem;font-weight:500;color:var(--vibeui-menu-007-muted)}
/* Отмена крупная и отдельная: закрыть должно быть так же легко, как открыть. */
[data-vibeui-block="menu-007"] [data-part="cancel"]{
width:100%;min-height:2.75rem;
appearance:none;border:1px solid var(--vibeui-menu-007-border);border-radius:0.75rem;
background:var(--vibeui-menu-007-bg);color:inherit;
font:inherit;font-size:0.9375rem;font-weight:650;cursor:pointer;
}
[data-vibeui-block="menu-007"] [data-part="cancel"]:focus-visible{outline:2px solid var(--vibeui-menu-007-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="menu-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ACTIONS: Menu007Action[] = [
  { label: "Поделиться", hint: "Ссылка с правом на просмотр" },
  { label: "Дублировать", hint: "Копия появится рядом" },
  { label: "Переместить в архив" },
  { label: "Удалить", hint: "Отменить будет нельзя", danger: true },
]

/**
 * Лист действий снизу: крупные цели и отдельная кнопка отмены.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Menu007({
  title = "Проект «Каталог»",
  actions = DEFAULT_ACTIONS,
  cancelLabel = "Отмена",
  accent,
  className,
  style,
  ...props
}: Menu007Props) {
  const [open, setOpen] = useState(true)

  const palette = {
    ...(accent ? { "--vibeui-menu-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-menu-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="menu-007"
        className={className}
        style={palette}
      >
        {open ? null : (
          <button
            type="button"
            data-part="trigger"
            onClick={() => setOpen(true)}
          >
            Действия
          </button>
        )}
        {open ? (
          <div data-part="sheet" role="menu" aria-label={title}>
            <span data-part="grabber" aria-hidden="true" />
            <p data-part="title">{title}</p>
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                role="menuitem"
                data-part="item"
                data-danger={action.danger}
                onClick={() => setOpen(false)}
              >
                {action.label}
                {action.hint ? (
                  <span data-part="hint">{action.hint}</span>
                ) : null}
              </button>
            ))}
            <button
              type="button"
              data-part="cancel"
              onClick={() => setOpen(false)}
            >
              {cancelLabel}
            </button>
          </div>
        ) : null}
      </div>
    </>
  )
}
