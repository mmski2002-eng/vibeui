"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Checkbox013Props = Omit<
  ComponentPropsWithoutRef<"form">,
  "children" | "onChange" | "onSubmit"
> & {
  title?: string
  terms?: string
  optional?: string
  submitLabel?: string
  onConfirm?: (subscribed: boolean) => void
  accent?: string
}

// Идея компонента: обязательная галочка как ворота формы. Кнопка отправки
// выключена, пока условие не принято, и рядом с ней написано, почему именно, —
// выключенная кнопка без объяснения читается как поломка. Вторая галочка
// подчёркнуто необязательная: обязательное и добровольное не смешиваются.
const STYLES = `
:where([data-vibeui-block="checkbox-013"]){
--vibeui-checkbox-013-bg:oklch(1 0 0);
--vibeui-checkbox-013-fg:oklch(0.21 0.014 265);
--vibeui-checkbox-013-muted:oklch(0.55 0.014 265);
--vibeui-checkbox-013-border:oklch(0.9 0.006 265);
--vibeui-checkbox-013-surface:oklch(0.98 0.003 265);
--vibeui-checkbox-013-accent:oklch(0.5 0.16 255);
--vibeui-checkbox-013-required:oklch(0.55 0.2 25);
--vibeui-checkbox-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="checkbox-013"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:23rem;box-sizing:border-box;
padding:1rem;border:1px solid var(--vibeui-checkbox-013-border);border-radius:1rem;
background:var(--vibeui-checkbox-013-bg);
font-family:var(--vibeui-checkbox-013-font);color:var(--vibeui-checkbox-013-fg);
}
[data-vibeui-block="checkbox-013"] [data-part="title"]{
margin:0;font-size:0.9375rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="checkbox-013"] label{
display:grid;grid-template-columns:auto 1fr;gap:0.625rem;align-items:start;
padding:0.625rem;border-radius:0.625rem;
background:var(--vibeui-checkbox-013-surface);
font-size:0.8125rem;line-height:1.45;cursor:pointer;
}
[data-vibeui-block="checkbox-013"] input{
appearance:none;position:relative;flex:none;cursor:inherit;margin:0.0625rem 0 0;
width:1.0625rem;height:1.0625rem;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-013-border);border-radius:0.3125rem;
background:var(--vibeui-checkbox-013-bg);
transition:background-color .15s ease,border-color .15s ease;
}
[data-vibeui-block="checkbox-013"] input:checked{border-color:transparent;background:var(--vibeui-checkbox-013-accent)}
[data-vibeui-block="checkbox-013"] input:checked::after{
content:"";position:absolute;left:50%;top:50%;
width:0.25rem;height:0.4375rem;margin:-0.3125rem 0 0 -0.125rem;
border-right:2px solid oklch(0.99 0.01 255);border-bottom:2px solid oklch(0.99 0.01 255);
transform:rotate(45deg);
}
[data-vibeui-block="checkbox-013"] input:focus-visible{outline:2px solid var(--vibeui-checkbox-013-accent);outline-offset:2px}
/* Звёздочка обязательности — на самой строке, а не только у заголовка формы:
   галочку читают отдельно от всего остального. */
[data-vibeui-block="checkbox-013"] [data-part="star"]{
color:var(--vibeui-checkbox-013-required);font-weight:700;
}
[data-vibeui-block="checkbox-013"] [data-part="soft"]{
display:block;margin-top:0.125rem;font-size:0.75rem;color:var(--vibeui-checkbox-013-muted);
}
[data-vibeui-block="checkbox-013"] button{
appearance:none;border:0;cursor:pointer;
height:2.375rem;border-radius:0.625rem;padding:0 1rem;
font:inherit;font-size:0.875rem;font-weight:650;
background:var(--vibeui-checkbox-013-accent);color:oklch(0.99 0.01 255);
transition:opacity .15s ease;
}
[data-vibeui-block="checkbox-013"] button:disabled{cursor:not-allowed;opacity:.4}
[data-vibeui-block="checkbox-013"] button:focus-visible{outline:2px solid var(--vibeui-checkbox-013-accent);outline-offset:2px}
[data-vibeui-block="checkbox-013"] [data-part="why"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-checkbox-013-muted);
}
[data-vibeui-block="checkbox-013"] [data-part="done"]{
margin:0;font-size:0.8125rem;font-weight:600;color:var(--vibeui-checkbox-013-accent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-013"] *{animation:none!important;transition:none!important}}
`

/**
 * Форма с обязательной галочкой: отправка заблокирована, пока условие не
 * принято, и рядом сказано почему. Один файл, ноль зависимостей.
 */
export function Checkbox013({
  title = "Подтверждение заказа",
  terms = "Я принимаю условия оферты и правила возврата",
  optional = "Присылать письма о скидках",
  submitLabel = "Оформить",
  onConfirm,
  accent,
  className,
  style,
  ...props
}: Checkbox013Props) {
  const [accepted, setAccepted] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [sent, setSent] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-checkbox-013-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-checkbox-013" precedence="medium">
        {STYLES}
      </style>
      <form
        {...props}
        data-vibeui-block="checkbox-013"
        className={className}
        style={palette}
        onSubmit={(event) => {
          event.preventDefault()
          setSent(true)
          onConfirm?.(subscribed)
        }}
      >
        <h3 data-part="title">{title}</h3>
        <label>
          <input
            type="checkbox"
            required
            checked={accepted}
            onChange={(event) => {
              setAccepted(event.target.checked)
              setSent(false)
            }}
          />
          <span>
            {terms} <span data-part="star">*</span>
            <span data-part="soft">Обязательное условие</span>
          </span>
        </label>
        <label>
          <input
            type="checkbox"
            checked={subscribed}
            onChange={(event) => setSubscribed(event.target.checked)}
          />
          <span>
            {optional}
            <span data-part="soft">Необязательно, отключается в письме</span>
          </span>
        </label>
        <button type="submit" disabled={!accepted}>
          {submitLabel}
        </button>
        {sent ? (
          <p data-part="done" role="status">
            Готово: заказ отправлен.
          </p>
        ) : (
          <p data-part="why">
            {accepted
              ? "Условия приняты — кнопка активна."
              : "Кнопка включится после согласия с условиями."}
          </p>
        )}
      </form>
    </>
  )
}
