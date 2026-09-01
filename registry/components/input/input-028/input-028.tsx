"use client"

import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Input028Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  defaultValue?: string
  reason?: string
  actionLabel?: string
  onRequestChange?: () => void
  accent?: string
}

// Идея компонента: readonly-поле без объяснения — загадка для пользователя,
// который пытается кликнуть, стереть, вставить и не понимает, почему ничего
// не выходит. Здесь причина написана прямым текстом под полем и связана с
// ним через aria-describedby, замок в рамке — не единственный сигнал.
// Кнопка действия — не «редактировать», а путь в обход блокировки (обычно
// это не сам ввод, а обращение в поддержку или отдельная форма).
const STYLES = `
:where([data-vibeui-block="input-028"]){
--vibeui-input-028-surface:oklch(1 0 0);
--vibeui-input-028-shell:oklch(0.91 0.006 265);
--vibeui-input-028-fg:oklch(0.23 0.014 265);
--vibeui-input-028-muted:oklch(0.56 0.014 265);
--vibeui-input-028-field:oklch(0.96 0.003 265);
--vibeui-input-028-border:oklch(0.88 0.008 265);
--vibeui-input-028-accent:oklch(0.5 0.02 265);
--vibeui-input-028-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="input-028"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-028-surface);
border:1px solid var(--vibeui-input-028-shell);border-radius:0.875rem;
font-family:var(--vibeui-input-028-font);color:var(--vibeui-input-028-fg);
}
[data-vibeui-block="input-028"] *{box-sizing:border-box}
[data-vibeui-block="input-028"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-028"] [data-part="frame"]{
display:flex;align-items:center;gap:0.5rem;
height:2.5rem;padding:0 0.75rem;
background:var(--vibeui-input-028-field);
border:1px dashed var(--vibeui-input-028-border);border-radius:0.75rem;
}
[data-vibeui-block="input-028"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-028-accent);border-style:solid;
}
[data-vibeui-block="input-028"] input{
flex:1;min-width:0;height:100%;border:0;background:none;color:var(--vibeui-input-028-muted);
font:inherit;font-size:0.875rem;cursor:default;
}
[data-vibeui-block="input-028"] input:focus{outline:none}
[data-vibeui-block="input-028"] [data-part="lock"]{
flex:none;width:1rem;height:1rem;display:block;color:var(--vibeui-input-028-muted);
}
[data-vibeui-block="input-028"] [data-part="note"]{
margin:0;display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-028-muted);
}
[data-vibeui-block="input-028"] [data-part="action"]{
flex:none;appearance:none;cursor:pointer;border:0;background:none;padding:0;
color:var(--vibeui-input-028-accent);font:inherit;font-size:0.75rem;font-weight:650;
text-decoration:underline;text-underline-offset:0.15em;
}
[data-vibeui-block="input-028"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-input-028-accent);outline-offset:2px;border-radius:0.125rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-028"] *{animation:none!important;transition:none!important}}
`

/**
 * Readonly-поле с замком и объяснением причины блокировки под полем, плюс
 * необязательное действие в обход неё. Один файл, ноль зависимостей.
 */
export function Input028({
  label = "Электронная почта",
  defaultValue = "owner@acme.ru",
  reason = "Подтверждена при регистрации — изменить может только поддержка.",
  actionLabel = "Обратиться в поддержку",
  onRequestChange,
  accent,
  className,
  style,
  ...props
}: Input028Props) {
  const id = useId()

  const palette = {
    ...(accent ? { "--vibeui-input-028-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-input-028" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="input-028"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="frame">
          <input
            id={id}
            type="text"
            readOnly
            aria-readonly="true"
            value={defaultValue}
            aria-describedby={`${id}-note`}
          />
          <svg
            data-part="lock"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" />
            <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" strokeLinecap="round" />
          </svg>
        </div>
        <p data-part="note" id={`${id}-note`}>
          <span>{reason}</span>
          {onRequestChange ? (
            <button type="button" data-part="action" onClick={onRequestChange}>
              {actionLabel}
            </button>
          ) : null}
        </p>
      </div>
    </>
  )
}
