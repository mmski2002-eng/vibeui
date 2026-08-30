import type { CSSProperties } from "react"

export type Dialog006Props = {
  id?: string
  trigger?: string
  title?: string
  step?: string
  /** 0–100. `null` — длительность неизвестна, бежит отрезок. */
  value?: number | null
  note?: string
  cancelLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: окно операции, которую нельзя прервать кликом мимо.
// Поэтому здесь popover="manual", а не "auto": Esc и клик по подложке не
// закрывают его, единственный выход — кнопка отмены. Так окно не исчезает
// случайно на середине переноса домена или загрузки архива.
const STYLES = `
:where([data-vibeui-block="dialog-006"]){
--vibeui-dialog-006-fg:oklch(0.22 0.016 265);
--vibeui-dialog-006-muted:oklch(0.5 0.014 265);
--vibeui-dialog-006-bg:oklch(1 0 0);
--vibeui-dialog-006-border:oklch(0.89 0.006 265);
--vibeui-dialog-006-track:oklch(0.93 0.006 265);
--vibeui-dialog-006-accent:oklch(0.55 0.2 262);
--vibeui-dialog-006-radius:1rem;
--vibeui-dialog-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="dialog-006"]{display:inline-flex;font-family:var(--vibeui-dialog-006-font)}
[data-vibeui-block="dialog-006"] [data-part="trigger"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:500;
display:inline-flex;align-items:center;height:2.25rem;padding:0 0.9375rem;
border:1px solid var(--vibeui-dialog-006-border);border-radius:0.5rem;
background:var(--vibeui-dialog-006-bg);color:var(--vibeui-dialog-006-fg);
}
[data-vibeui-block="dialog-006"] [data-part="trigger"]:hover{background:color-mix(in oklab,var(--vibeui-dialog-006-border) 30%,transparent)}
[data-vibeui-block="dialog-006"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dialog-006-accent);outline-offset:2px}
[data-vibeui-dialog-006-window]{
position:fixed;inset:0;margin:auto;height:fit-content;
width:min(24rem,calc(100vw - 2rem));box-sizing:border-box;padding:1.375rem;
border:1px solid var(--vibeui-dialog-006-border,oklch(0.89 0.006 265));
border-radius:var(--vibeui-dialog-006-radius,1rem);
background:var(--vibeui-dialog-006-bg,oklch(1 0 0));
color:var(--vibeui-dialog-006-fg,oklch(0.22 0.016 265));
font-family:var(--vibeui-dialog-006-font,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 45%);
opacity:0;transform:scale(0.97);
transition:opacity .18s ease,transform .18s ease,display .18s allow-discrete,overlay .18s allow-discrete;
}
[data-vibeui-dialog-006-window]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-dialog-006-window]:popover-open{opacity:0;transform:scale(0.97)}}
[data-vibeui-dialog-006-window]::backdrop{background:oklch(0.18 0.02 265 / 55%);backdrop-filter:blur(2px)}
[data-vibeui-dialog-006-window] [data-part="head"]{display:flex;align-items:center;gap:0.75rem}
[data-vibeui-dialog-006-window] [data-part="spinner"]{
flex:none;width:1.25rem;height:1.25rem;border-radius:9999px;
border:2px solid color-mix(in oklab,var(--vibeui-dialog-006-accent,oklch(0.55 0.2 262)) 25%,transparent);
border-top-color:var(--vibeui-dialog-006-accent,oklch(0.55 0.2 262));
animation:vibeui-dialog-006-spin .9s linear infinite;
}
@keyframes vibeui-dialog-006-spin{to{transform:rotate(360deg)}}
[data-vibeui-dialog-006-window] [data-part="title"]{margin:0;font-size:1rem;font-weight:620;line-height:1.35}
[data-vibeui-dialog-006-window] [data-part="step"]{
margin:0.5rem 0 0;font-size:0.8125rem;line-height:1.5;
color:var(--vibeui-dialog-006-muted,oklch(0.5 0.014 265));
}
[data-vibeui-dialog-006-window] [data-part="track"]{
margin-top:0.875rem;height:0.375rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-dialog-006-track,oklch(0.93 0.006 265));
}
[data-vibeui-dialog-006-window] [data-part="bar"]{
display:block;height:100%;border-radius:inherit;
background:var(--vibeui-dialog-006-accent,oklch(0.55 0.2 262));
width:calc(var(--vibeui-dialog-006-value,0) * 1%);
transition:width .3s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-dialog-006-window][data-indeterminate="true"] [data-part="bar"]{
width:35%;transition:none;animation:vibeui-dialog-006-slide 1.4s ease-in-out infinite;
}
@keyframes vibeui-dialog-006-slide{0%{transform:translateX(-110%)}100%{transform:translateX(320%)}}
[data-vibeui-dialog-006-window] [data-part="note"]{
margin:0.75rem 0 0;font-size:0.75rem;line-height:1.45;
color:var(--vibeui-dialog-006-muted,oklch(0.5 0.014 265));
}
[data-vibeui-dialog-006-window] [data-part="actions"]{display:flex;justify-content:flex-end;margin-top:1.125rem}
[data-vibeui-dialog-006-window] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:600;
display:inline-flex;align-items:center;height:2.25rem;padding:0 1rem;
border-radius:0.5rem;background:transparent;color:inherit;
border:1px solid var(--vibeui-dialog-006-border,oklch(0.89 0.006 265));
}
[data-vibeui-dialog-006-window] button:hover{background:color-mix(in oklab,var(--vibeui-dialog-006-border,oklch(0.89 0.006 265)) 40%,transparent)}
[data-vibeui-dialog-006-window] button:focus-visible{outline:2px solid var(--vibeui-dialog-006-accent,oklch(0.55 0.2 262));outline-offset:2px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="dialog-006"] *{animation:none!important;transition:none!important}
[data-vibeui-dialog-006-window]{transition:none!important;opacity:1;transform:none}
[data-vibeui-dialog-006-window][data-indeterminate="true"] [data-part="bar"]{width:100%;opacity:.4}
}
`

/**
 * Окно операции, которое не закрывается кликом мимо: popover="manual".
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dialog006({
  id = "vibeui-dialog-006",
  trigger = "Перенести домен",
  title = "Переносим домен",
  step = "Проверяем DNS-записи — 2 из 5",
  value = 40,
  note = "Не закрывайте вкладку: перенос продолжится, но уведомления вы не увидите.",
  cancelLabel = "Прервать",
  accent,
  className,
  style,
}: Dialog006Props) {
  const indeterminate = value === null || value === undefined
  const clamped = indeterminate ? 0 : Math.min(100, Math.max(0, value))
  const palette = {
    "--vibeui-dialog-006-value": clamped,
    ...(accent ? { "--vibeui-dialog-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dialog-006" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="dialog-006" className={className} style={palette}>
        <button data-part="trigger" type="button" popoverTarget={id}>
          {trigger}
        </button>
        {/* manual вместо auto: Esc и клик мимо не должны прерывать операцию. */}
        <div
          id={id}
          popover="manual"
          data-vibeui-dialog-006-window=""
          data-indeterminate={indeterminate || undefined}
          role="dialog"
          aria-labelledby={`${id}-title`}
          aria-busy="true"
          style={palette}
        >
          <div data-part="head">
            <span data-part="spinner" aria-hidden="true" />
            <h2 data-part="title" id={`${id}-title`}>
              {title}
            </h2>
          </div>
          {step ? <p data-part="step">{step}</p> : null}
          <div
            data-part="track"
            role="progressbar"
            aria-label={title}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={indeterminate ? undefined : Math.round(clamped)}
          >
            <span data-part="bar" />
          </div>
          {note ? <p data-part="note">{note}</p> : null}
          <div data-part="actions">
            <button type="button" popoverTarget={id}>
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
