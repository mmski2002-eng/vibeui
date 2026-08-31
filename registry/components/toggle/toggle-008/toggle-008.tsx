"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toggle008Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  onHint?: string
  offHint?: string
  defaultPressed?: boolean
  onChange?: (pressed: boolean) => void
  accent?: string
}

// Идея компонента: toggle с подсказкой о текущем состоянии. Подсказка живёт
// в разметке всегда и привязана через aria-describedby, поэтому её слышит
// скринридер, а не только видит курсор. Всплывает она и по наведению, и по
// фокусу: подсказка, доступная одной мыши, — это подсказка для половины людей.
const STYLES = `
:where([data-vibeui-block="toggle-008"]){
--vibeui-toggle-008-bg:oklch(1 0 0);
--vibeui-toggle-008-fg:oklch(0.22 0.014 265);
--vibeui-toggle-008-muted:oklch(0.55 0.014 265);
--vibeui-toggle-008-border:oklch(0.9 0.006 265);
--vibeui-toggle-008-accent:oklch(0.55 0.16 25);
--vibeui-toggle-008-tip:oklch(0.24 0.02 265);
--vibeui-toggle-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toggle-008"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.5rem;align-items:flex-start;
width:100%;max-width:20rem;padding:2.75rem 0.875rem 0.875rem;
border:1px solid var(--vibeui-toggle-008-border);border-radius:0.875rem;
background:var(--vibeui-toggle-008-bg);color:var(--vibeui-toggle-008-fg);
font-family:var(--vibeui-toggle-008-font);
}
[data-vibeui-block="toggle-008"] *{box-sizing:border-box}
[data-vibeui-block="toggle-008"] [data-part="anchor"]{position:relative;display:inline-flex}
[data-vibeui-block="toggle-008"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-toggle-008-border);border-radius:0.625rem;
background:var(--vibeui-toggle-008-bg);color:var(--vibeui-toggle-008-fg);
font-size:0.875rem;font-weight:600;line-height:1;
transition:background-color .16s ease,border-color .16s ease,color .16s ease;
}
[data-vibeui-block="toggle-008"] button:focus-visible{
outline:2px solid var(--vibeui-toggle-008-accent);outline-offset:2px;
}
[data-vibeui-block="toggle-008"] button[aria-pressed="true"]{
background:var(--vibeui-toggle-008-accent);border-color:var(--vibeui-toggle-008-accent);
color:oklch(0.99 0 0);
}
[data-vibeui-block="toggle-008"] [data-part="dot"]{
width:0.5rem;height:0.5rem;border-radius:50%;flex:none;
background:var(--vibeui-toggle-008-muted);
}
[data-vibeui-block="toggle-008"] button[aria-pressed="true"] [data-part="dot"]{background:oklch(0.99 0 0)}
/* Подсказка лежит в потоке разметки и просто прячется: вынести её в title
   значило бы отдать текст браузеру — с клавиатуры он не показывается. */
[data-vibeui-block="toggle-008"] [data-part="tip"]{
position:absolute;bottom:calc(100% + 0.5rem);left:0;
max-width:15rem;padding:0.375rem 0.5rem;border-radius:0.5rem;
background:var(--vibeui-toggle-008-tip);color:oklch(0.98 0 0);
font-size:0.75rem;line-height:1.35;white-space:normal;
opacity:0;visibility:hidden;transform:translateY(0.25rem);
transition:opacity .14s ease,transform .14s ease,visibility .14s;
}
[data-vibeui-block="toggle-008"] [data-part="tip"]::after{
content:"";position:absolute;top:100%;left:0.875rem;
border:0.3125rem solid transparent;border-top-color:var(--vibeui-toggle-008-tip);
}
[data-vibeui-block="toggle-008"] button:hover + [data-part="tip"],
[data-vibeui-block="toggle-008"] button:focus-visible + [data-part="tip"]{
opacity:1;visibility:visible;transform:translateY(0);
}
[data-vibeui-block="toggle-008"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-toggle-008-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toggle-008"] *{animation:none!important;transition:none!important}}
`

/**
 * Toggle с подсказкой о текущем состоянии: она привязана через
 * aria-describedby и всплывает по наведению и по фокусу. Один файл.
 */
export function Toggle008({
  label = "Не беспокоить",
  onHint = "Сейчас уведомления скрыты до утра",
  offHint = "Сейчас уведомления приходят как обычно",
  defaultPressed = true,
  onChange,
  accent,
  className,
  style,
  ...props
}: Toggle008Props) {
  const [pressed, setPressed] = useState(defaultPressed)
  const tipId = useId()

  const palette = {
    ...(accent ? { "--vibeui-toggle-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toggle-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="toggle-008"
        className={className}
        style={palette}
      >
        <span data-part="anchor">
          <button
            type="button"
            aria-pressed={pressed}
            aria-describedby={tipId}
            onClick={() => {
              setPressed(!pressed)
              onChange?.(!pressed)
            }}
          >
            <span data-part="dot" aria-hidden="true" />
            {label}
          </button>
          <span data-part="tip" id={tipId} role="tooltip">
            {pressed ? onHint : offHint}
          </span>
        </span>
        <p data-part="note">
          Подсказка объясняет состояние, а подпись кнопки не меняется.
        </p>
      </div>
    </>
  )
}
