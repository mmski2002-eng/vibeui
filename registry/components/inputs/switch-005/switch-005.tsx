"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Switch005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  description?: string
  /** Текст подтверждения: что именно случится после выключения. */
  question?: string
  confirmText?: string
  cancelText?: string
  accent?: string
}

// Идея компонента: переключатель опасного действия. Выключение защиты —
// не то же самое, что включение тёмной темы, поэтому тумблер не двигается
// сразу: сначала разворачивается панель с последствием и двумя кнопками.
// Обратное действие — безопасное — срабатывает мгновенно, без вопросов.
const STYLES = `
:where([data-vibeui-block="switch-005"]){
--vibeui-switch-005-bg:oklch(1 0 0);
--vibeui-switch-005-fg:oklch(0.22 0.014 265);
--vibeui-switch-005-muted:oklch(0.54 0.014 265);
--vibeui-switch-005-border:oklch(0.91 0.006 265);
--vibeui-switch-005-track:oklch(0.88 0.008 265);
--vibeui-switch-005-thumb:oklch(1 0 0);
--vibeui-switch-005-accent:oklch(0.55 0.16 155);
--vibeui-switch-005-danger:oklch(0.55 0.2 25);
--vibeui-switch-005-danger-tint:oklch(0.55 0.2 25 / 8%);
--vibeui-switch-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="switch-005"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-switch-005-bg);
border:1px solid var(--vibeui-switch-005-border);border-radius:0.875rem;
font-family:var(--vibeui-switch-005-font);color:var(--vibeui-switch-005-fg);
}
[data-vibeui-block="switch-005"] [data-part="row"]{display:flex;align-items:center;gap:1rem;cursor:pointer}
[data-vibeui-block="switch-005"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="switch-005"] [data-part="label"]{font-size:0.9375rem;font-weight:600;line-height:1.3}
[data-vibeui-block="switch-005"] [data-part="description"]{font-size:0.8125rem;line-height:1.4;color:var(--vibeui-switch-005-muted)}
[data-vibeui-block="switch-005"] [data-part="track"]{position:relative;display:flex;flex:none}
[data-vibeui-block="switch-005"] input{
appearance:none;-webkit-appearance:none;margin:0;
width:2.75rem;height:1.5rem;border-radius:9999px;
background:var(--vibeui-switch-005-track);cursor:inherit;
transition:background-color .18s ease;
}
[data-vibeui-block="switch-005"] input:checked{background:var(--vibeui-switch-005-accent)}
[data-vibeui-block="switch-005"] input:focus-visible{outline:2px solid var(--vibeui-switch-005-accent);outline-offset:2px}
[data-vibeui-block="switch-005"] [data-part="thumb"]{
position:absolute;left:0.1875rem;top:0.1875rem;
width:1.125rem;height:1.125rem;border-radius:9999px;pointer-events:none;
background:var(--vibeui-switch-005-thumb);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 28%);
transition:transform .18s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="switch-005"] input:checked + [data-part="thumb"]{transform:translateX(1.25rem)}
/* Панель подтверждения появляется на месте, а не поверх страницы: диалог
   ради одного вопроса перекрыл бы саму настройку, о которой спрашивают. */
[data-vibeui-block="switch-005"] [data-part="confirm"]{
display:flex;flex-direction:column;gap:0.625rem;
padding:0.75rem;border-radius:0.625rem;
background:var(--vibeui-switch-005-danger-tint);
border:1px solid color-mix(in oklab,var(--vibeui-switch-005-danger) 30%,transparent);
animation:vibeui-switch-005-in .18s ease-out;
}
@keyframes vibeui-switch-005-in{from{opacity:0;transform:translateY(-0.25rem)}to{opacity:1;transform:none}}
[data-vibeui-block="switch-005"] [data-part="question"]{margin:0;font-size:0.8125rem;line-height:1.45}
[data-vibeui-block="switch-005"] [data-part="actions"]{display:flex;gap:0.5rem}
[data-vibeui-block="switch-005"] button{
flex:1 1 0;appearance:none;cursor:pointer;
height:2.125rem;padding:0 0.75rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;font-weight:600;
transition:filter .16s ease;
}
[data-vibeui-block="switch-005"] [data-part="danger"]{
border:0;background:var(--vibeui-switch-005-danger);color:oklch(1 0 0);
}
[data-vibeui-block="switch-005"] [data-part="cancel"]{
border:1px solid var(--vibeui-switch-005-border);
background:var(--vibeui-switch-005-bg);color:inherit;
}
[data-vibeui-block="switch-005"] button:hover{filter:brightness(.96)}
[data-vibeui-block="switch-005"] button:focus-visible{outline:2px solid var(--vibeui-switch-005-danger);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="switch-005"] *{animation:none!important;transition:none!important}}
`

/**
 * Опасный переключатель: выключение спрашивает подтверждение, включение — нет.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Switch005({
  label = "Защита от удаления",
  description = "Проекты нельзя стереть без подтверждения по почте.",
  question = "Выключить защиту? Любой участник команды сможет удалить проект целиком.",
  confirmText = "Выключить",
  cancelText = "Оставить",
  accent,
  className,
  style,
  ...props
}: Switch005Props) {
  const id = useId()
  const [checked, setChecked] = useState(true)
  const [asking, setAsking] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-switch-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-switch-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="switch-005"
        className={className}
        style={palette}
      >
        <label data-part="row" htmlFor={id}>
          <span data-part="text">
            <span data-part="label">{label}</span>
            <span data-part="description">{description}</span>
          </span>
          <span data-part="track">
            <input
              id={id}
              type="checkbox"
              role="switch"
              checked={checked}
              aria-describedby={asking ? `${id}-question` : undefined}
              onChange={(event) => {
                // Опасное направление — только через вопрос.
                if (event.target.checked) {
                  setChecked(true)
                  setAsking(false)
                  return
                }
                setAsking(true)
              }}
            />
            <span data-part="thumb" aria-hidden="true" />
          </span>
        </label>
        {asking ? (
          <div
            data-part="confirm"
            role="group"
            aria-labelledby={`${id}-question`}
          >
            <p data-part="question" id={`${id}-question`}>
              {question}
            </p>
            <div data-part="actions">
              <button
                type="button"
                data-part="danger"
                onClick={() => {
                  setChecked(false)
                  setAsking(false)
                }}
              >
                {confirmText}
              </button>
              <button
                type="button"
                data-part="cancel"
                onClick={() => setAsking(false)}
              >
                {cancelText}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}
