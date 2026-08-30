import type { CSSProperties, ReactNode } from "react"

export type Dialog007Action = {
  label: string
  href?: string
  danger?: boolean
}

export type Dialog007Props = {
  id?: string
  trigger?: string
  title?: string
  description?: string
  actions?: Dialog007Action[]
  cancelLabel?: string
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

// Идея компонента: лист действий, выезжающий снизу, — привычная форма выбора
// на телефоне, где до верха экрана большой палец не достаёт. На широком экране
// он превращается в обычное окно по центру: одна разметка, две раскладки,
// переключение обычным медиазапросом по ширине окна, а не блока — лист
// позиционируется относительно экрана, а не родителя.
const STYLES = `
:where([data-vibeui-block="dialog-007"]){
--vibeui-dialog-007-fg:oklch(0.22 0.016 265);
--vibeui-dialog-007-muted:oklch(0.5 0.014 265);
--vibeui-dialog-007-bg:oklch(1 0 0);
--vibeui-dialog-007-border:oklch(0.9 0.006 265);
--vibeui-dialog-007-danger:oklch(0.56 0.19 25);
--vibeui-dialog-007-accent:oklch(0.55 0.2 262);
--vibeui-dialog-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="dialog-007"]{display:inline-flex;font-family:var(--vibeui-dialog-007-font)}
[data-vibeui-block="dialog-007"] [data-part="trigger"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:500;
display:inline-flex;align-items:center;height:2.25rem;padding:0 0.9375rem;
border:1px solid var(--vibeui-dialog-007-border);border-radius:0.5rem;
background:var(--vibeui-dialog-007-bg);color:var(--vibeui-dialog-007-fg);
}
[data-vibeui-block="dialog-007"] [data-part="trigger"]:hover{background:color-mix(in oklab,var(--vibeui-dialog-007-border) 30%,transparent)}
[data-vibeui-block="dialog-007"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dialog-007-accent);outline-offset:2px}
/* Мобильная раскладка по умолчанию: лист прижат к нижнему краю экрана. */
[data-vibeui-dialog-007-sheet]{
position:fixed;inset:auto 0 0;margin:0;
width:100%;box-sizing:border-box;padding:0.75rem 0.75rem 1rem;
border:0;border-radius:1.25rem 1.25rem 0 0;
background:var(--vibeui-dialog-007-bg,oklch(1 0 0));
color:var(--vibeui-dialog-007-fg,oklch(0.22 0.016 265));
font-family:var(--vibeui-dialog-007-font,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 -12px 40px -20px oklch(0.2 0.03 265 / 45%);
translate:0 100%;
transition:translate .24s cubic-bezier(.32,.72,0,1),display .24s allow-discrete,overlay .24s allow-discrete;
}
[data-vibeui-dialog-007-sheet]:popover-open{translate:0 0}
@starting-style{[data-vibeui-dialog-007-sheet]:popover-open{translate:0 100%}}
[data-vibeui-dialog-007-sheet]::backdrop{background:oklch(0.18 0.02 265 / 45%)}
/* Полоска-ручка: сообщает, что лист пришёл снизу и туда же уйдёт. */
[data-vibeui-dialog-007-sheet] [data-part="grip"]{
display:block;width:2.25rem;height:0.25rem;margin:0 auto 0.75rem;
border-radius:9999px;background:var(--vibeui-dialog-007-border,oklch(0.9 0.006 265));
}
[data-vibeui-dialog-007-sheet] [data-part="head"]{padding:0 0.5rem 0.625rem}
[data-vibeui-dialog-007-sheet] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:620;line-height:1.35}
[data-vibeui-dialog-007-sheet] [data-part="description"]{margin:0.125rem 0 0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-dialog-007-muted,oklch(0.5 0.014 265))}
[data-vibeui-dialog-007-sheet] [data-part="list"]{display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-dialog-007-sheet] [data-part="action"]{
display:flex;align-items:center;width:100%;box-sizing:border-box;
padding:0.8125rem 0.75rem;border:0;border-radius:0.75rem;
background:transparent;color:inherit;text-decoration:none;
font:inherit;font-size:0.9375rem;cursor:pointer;text-align:left;
transition:background-color .16s ease;
}
[data-vibeui-dialog-007-sheet] [data-part="action"]:hover{background:color-mix(in oklab,var(--vibeui-dialog-007-border,oklch(0.9 0.006 265)) 35%,transparent)}
[data-vibeui-dialog-007-sheet] [data-part="action"][data-danger="true"]{color:var(--vibeui-dialog-007-danger,oklch(0.56 0.19 25))}
[data-vibeui-dialog-007-sheet] [data-cancel="true"]{
margin-top:0.5rem;justify-content:center;font-weight:600;
background:color-mix(in oklab,var(--vibeui-dialog-007-border,oklch(0.9 0.006 265)) 35%,transparent);
}
[data-vibeui-dialog-007-sheet] :focus-visible{outline:2px solid var(--vibeui-dialog-007-accent,oklch(0.55 0.2 262));outline-offset:-2px}
/* От 40rem ширины окна лист становится обычным окном по центру. */
@media (min-width: 40rem){
[data-vibeui-dialog-007-sheet]{
inset:0;margin:auto;height:fit-content;
width:min(22rem,calc(100vw - 2rem));
border:1px solid var(--vibeui-dialog-007-border,oklch(0.9 0.006 265));
border-radius:1rem;padding:1rem;
translate:0 0;opacity:0;transform:scale(0.97);
transition:opacity .18s ease,transform .18s ease,display .18s allow-discrete,overlay .18s allow-discrete;
}
[data-vibeui-dialog-007-sheet]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-dialog-007-sheet]:popover-open{opacity:0;transform:scale(0.97)}}
[data-vibeui-dialog-007-sheet] [data-part="grip"]{display:none}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="dialog-007"] *{animation:none!important;transition:none!important}
[data-vibeui-dialog-007-sheet]{transition:none!important;translate:0 0;opacity:1;transform:none}
}
`

const DEFAULT_ACTIONS: Dialog007Action[] = [
  { label: "Дублировать проект", href: "#" },
  { label: "Экспортировать в архив", href: "#" },
  { label: "Перенести в другую папку", href: "#" },
  { label: "Удалить проект", href: "#", danger: true },
]

/**
 * Лист действий снизу на телефоне и обычное окно на широком экране.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dialog007({
  id = "vibeui-dialog-007",
  trigger = "Действия",
  title = "Сайт студии",
  description = "Опубликован 12 марта",
  actions = DEFAULT_ACTIONS,
  cancelLabel = "Отмена",
  children,
  className,
  style,
}: Dialog007Props) {
  return (
    <>
      <style href="vibeui-dialog-007" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="dialog-007" className={className} style={style}>
        <button data-part="trigger" type="button" popoverTarget={id}>
          {trigger}
        </button>
        <div
          id={id}
          popover="auto"
          data-vibeui-dialog-007-sheet=""
          role="dialog"
          aria-labelledby={`${id}-title`}
          style={style}
        >
          <span data-part="grip" aria-hidden="true" />
          <div data-part="head">
            <p data-part="title" id={`${id}-title`}>
              {title}
            </p>
            {description ? <p data-part="description">{description}</p> : null}
          </div>
          <div data-part="list">
            {children ??
              actions.map((action) => (
                <a
                  key={action.label}
                  data-part="action"
                  data-danger={action.danger || undefined}
                  href={action.href}
                >
                  {action.label}
                </a>
              ))}
            <button
              data-part="action"
              data-cancel="true"
              type="button"
              popoverTarget={id}
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
