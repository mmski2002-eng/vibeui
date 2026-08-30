import type { CSSProperties } from "react"

export type Dialog003Props = {
  id?: string
  trigger?: string
  title?: string
  label?: string
  defaultValue?: string
  hint?: string
  submitLabel?: string
  cancelLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: окно с одним полем — переименовать, задать адрес, добавить
// метку. Внутри настоящая <form method="dialog">: Enter отправляет, Esc
// закрывает, а фокус при открытии сам уходит в поле благодаря autofocus.
// Открытие держит HTML popover, поэтому клиентского кода нет вовсе.
const STYLES = `
:where([data-vibeui-block="dialog-003"]){
--vibeui-dialog-003-fg:oklch(0.22 0.016 265);
--vibeui-dialog-003-muted:oklch(0.5 0.014 265);
--vibeui-dialog-003-bg:oklch(1 0 0);
--vibeui-dialog-003-border:oklch(0.89 0.006 265);
--vibeui-dialog-003-accent:oklch(0.55 0.2 262);
--vibeui-dialog-003-radius:1rem;
--vibeui-dialog-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="dialog-003"]{display:inline-flex;font-family:var(--vibeui-dialog-003-font)}
[data-vibeui-block="dialog-003"] [data-part="trigger"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:500;
display:inline-flex;align-items:center;height:2.25rem;padding:0 0.9375rem;
border:1px solid var(--vibeui-dialog-003-border);border-radius:0.5rem;
background:var(--vibeui-dialog-003-bg);color:var(--vibeui-dialog-003-fg);
}
[data-vibeui-block="dialog-003"] [data-part="trigger"]:hover{background:color-mix(in oklab,var(--vibeui-dialog-003-border) 30%,transparent)}
[data-vibeui-block="dialog-003"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dialog-003-accent);outline-offset:2px}
[data-vibeui-dialog-003-window]{
position:fixed;inset:0;margin:auto;height:fit-content;
width:min(26rem,calc(100vw - 2rem));box-sizing:border-box;padding:1.375rem;
border:1px solid var(--vibeui-dialog-003-border,oklch(0.89 0.006 265));
border-radius:var(--vibeui-dialog-003-radius,1rem);
background:var(--vibeui-dialog-003-bg,oklch(1 0 0));
color:var(--vibeui-dialog-003-fg,oklch(0.22 0.016 265));
font-family:var(--vibeui-dialog-003-font,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 45%);
opacity:0;transform:translateY(0.5rem);
transition:opacity .18s ease,transform .18s ease,display .18s allow-discrete,overlay .18s allow-discrete;
}
[data-vibeui-dialog-003-window]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-dialog-003-window]:popover-open{opacity:0;transform:translateY(0.5rem)}}
[data-vibeui-dialog-003-window]::backdrop{background:oklch(0.18 0.02 265 / 45%)}
[data-vibeui-dialog-003-window] [data-part="title"]{margin:0 0 0.875rem;font-size:1rem;font-weight:620;line-height:1.35}
[data-vibeui-dialog-003-window] label{display:flex;flex-direction:column;gap:0.375rem;font-size:0.8125rem;font-weight:500}
[data-vibeui-dialog-003-window] input{
width:100%;box-sizing:border-box;margin:0;height:2.375rem;padding:0 0.75rem;
border:1px solid var(--vibeui-dialog-003-border,oklch(0.89 0.006 265));
border-radius:0.5rem;background:oklch(1 0 0);color:inherit;
font:inherit;font-size:0.9375rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-dialog-003-window] input:focus{
outline:none;border-color:var(--vibeui-dialog-003-accent,oklch(0.55 0.2 262));
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-dialog-003-accent,oklch(0.55 0.2 262)) 22%,transparent);
}
[data-vibeui-dialog-003-window] [data-part="hint"]{
margin:0.375rem 0 0;font-size:0.75rem;line-height:1.45;
color:var(--vibeui-dialog-003-muted,oklch(0.5 0.014 265));
}
[data-vibeui-dialog-003-window] [data-part="actions"]{display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1.25rem}
[data-vibeui-dialog-003-window] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:600;
display:inline-flex;align-items:center;height:2.25rem;padding:0 1rem;
border-radius:0.5rem;border:1px solid transparent;
}
[data-vibeui-dialog-003-window] [data-part="cancel"]{background:transparent;color:inherit;border-color:var(--vibeui-dialog-003-border,oklch(0.89 0.006 265))}
[data-vibeui-dialog-003-window] [data-part="submit"]{background:var(--vibeui-dialog-003-accent,oklch(0.55 0.2 262));color:oklch(1 0 0)}
[data-vibeui-dialog-003-window] [data-part="submit"]:hover{filter:brightness(0.94)}
[data-vibeui-dialog-003-window] button:focus-visible{outline:2px solid var(--vibeui-dialog-003-accent,oklch(0.55 0.2 262));outline-offset:2px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="dialog-003"] *{animation:none!important;transition:none!important}
[data-vibeui-dialog-003-window]{transition:none!important;opacity:1;transform:none}
}
`

/**
 * Окно с одним полем: переименовать, задать адрес, добавить метку.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dialog003({
  id = "vibeui-dialog-003",
  trigger = "Переименовать",
  title = "Переименовать проект",
  label = "Название",
  defaultValue = "Сайт студии",
  hint = "Адрес проекта не изменится: его меняют отдельно, в настройках домена.",
  submitLabel = "Сохранить",
  cancelLabel = "Отмена",
  accent,
  className,
  style,
}: Dialog003Props) {
  const palette = {
    ...(accent ? { "--vibeui-dialog-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dialog-003" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="dialog-003" className={className} style={palette}>
        <button data-part="trigger" type="button" popoverTarget={id}>
          {trigger}
        </button>
        <div
          id={id}
          popover="auto"
          data-vibeui-dialog-003-window=""
          role="dialog"
          aria-labelledby={`${id}-title`}
          style={palette}
        >
          <h2 data-part="title" id={`${id}-title`}>
            {title}
          </h2>
          {/* method="dialog" даёт Enter как отправку без обработчика. */}
          <form method="dialog">
            <label>
              {label}
              <input
                type="text"
                name="value"
                defaultValue={defaultValue}
                autoFocus
              />
            </label>
            {hint ? <p data-part="hint">{hint}</p> : null}
            <div data-part="actions">
              <button data-part="cancel" type="button" popoverTarget={id}>
                {cancelLabel}
              </button>
              <button data-part="submit" type="submit" popoverTarget={id}>
                {submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
