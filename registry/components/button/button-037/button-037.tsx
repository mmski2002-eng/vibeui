"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Button037Action = { id: string; label: string }

export type Button037Props = Omit<
  ComponentProps<"div">,
  "children" | "onSelect"
> & {
  label?: string
  /** Быстрые действия, которые выезжают из-под кнопки. */
  actions?: Button037Action[]
  defaultOpen?: boolean
  onSelect?: (id: string) => void
  accent?: string
}

// Идея компонента: круглая кнопка главного действия, из которой веером
// выезжают быстрые действия. В отличие от одиночного FAB здесь у каждого
// действия своя подпись слева, а выезд идёт лесенкой: у i-го элемента
// свой transition-delay, поэтому стопка читается как раскрытие, а не рывок.
const STYLES = `
:where([data-vibeui-block="button-037"]){
--vibeui-button-037-accent:light-dark(oklch(0.56 0.2 25),oklch(0.66 0.19 25));
--vibeui-button-037-fg:light-dark(oklch(0.99 0.01 25),oklch(0.98 0.014 25));
--vibeui-button-037-surface:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-button-037-ink:light-dark(oklch(0.26 0.016 265),oklch(0.93 0.006 265));
--vibeui-button-037-border:light-dark(oklch(0.9 0.006 265),oklch(0.38 0.014 265));
--vibeui-button-037-size:3.25rem;
--vibeui-button-037-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-037"]{color-scheme:dark}
[data-vibeui-block="button-037"]{
position:relative;display:inline-flex;
font-family:var(--vibeui-button-037-font);
}
[data-vibeui-block="button-037"] [data-part="main"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:var(--vibeui-button-037-size);height:var(--vibeui-button-037-size);
border-radius:50%;background:var(--vibeui-button-037-accent);color:var(--vibeui-button-037-fg);
box-shadow:0 14px 28px -14px color-mix(in oklab,var(--vibeui-button-037-accent) 75%,transparent);
transition:filter .16s ease;
}
[data-vibeui-block="button-037"] [data-part="main"]:hover{filter:brightness(1.06)}
[data-vibeui-block="button-037"] [data-part="main"]:focus-visible{outline:2px solid var(--vibeui-button-037-accent);outline-offset:3px}
[data-vibeui-block="button-037"] [data-part="cross"]{position:relative;width:1.125rem;height:1.125rem;transition:transform .22s cubic-bezier(0.16,1,0.3,1)}
[data-vibeui-block="button-037"] [data-part="cross"]::before,
[data-vibeui-block="button-037"] [data-part="cross"]::after{
content:"";position:absolute;left:50%;top:50%;background:currentColor;border-radius:2px;
}
[data-vibeui-block="button-037"] [data-part="cross"]::before{width:1.125rem;height:2px;margin:-1px 0 0 -0.5625rem}
[data-vibeui-block="button-037"] [data-part="cross"]::after{width:2px;height:1.125rem;margin:-0.5625rem 0 0 -1px}
[data-vibeui-block="button-037"][data-open="true"] [data-part="cross"]{transform:rotate(135deg)}
[data-vibeui-block="button-037"] [data-part="dial"]{
position:absolute;left:50%;bottom:calc(var(--vibeui-button-037-size) + 0.625rem);
transform:translateX(-50%);
display:flex;flex-direction:column-reverse;align-items:center;gap:0.5rem;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="button-037"] [data-part="dial"][hidden]{display:none}
[data-vibeui-block="button-037"] [data-part="item"]{
display:flex;align-items:center;gap:0.5rem;
opacity:0;transform:translateY(0.75rem) scale(.9);
transition:opacity .18s ease,transform .22s cubic-bezier(0.16,1,0.3,1);
transition-delay:calc(var(--vibeui-button-037-index) * 45ms);
}
[data-vibeui-block="button-037"][data-open="true"] [data-part="item"]{opacity:1;transform:none}
[data-vibeui-block="button-037"] [data-part="action"]{
appearance:none;cursor:pointer;white-space:nowrap;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.25rem;padding:0 0.875rem;border-radius:9999px;
border:1px solid var(--vibeui-button-037-border);
background:var(--vibeui-button-037-surface);color:var(--vibeui-button-037-ink);
font:inherit;font-size:0.8125rem;font-weight:600;line-height:1;
box-shadow:0 8px 18px -14px oklch(0 0 0 / 55%);
transition:border-color .16s ease,color .16s ease;
}
[data-vibeui-block="button-037"] [data-part="action"]:hover{border-color:var(--vibeui-button-037-accent);color:var(--vibeui-button-037-accent)}
[data-vibeui-block="button-037"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-button-037-accent);outline-offset:2px}
[data-vibeui-block="button-037"] [data-part="bullet"]{
flex:none;width:0.4375rem;height:0.4375rem;border-radius:50%;
background:var(--vibeui-button-037-accent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-037"] *{animation:none!important;transition:none!important}}
`

/**
 * Круглая кнопка главного действия с веером быстрых действий.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button037({
  label = "Быстрые действия",
  actions = [
    { id: "task", label: "Новая задача" },
    { id: "note", label: "Заметка" },
    { id: "upload", label: "Загрузить файл" },
  ],
  defaultOpen = false,
  onSelect,
  accent,
  className,
  style,
  ...props
}: Button037Props) {
  const [open, setOpen] = useState(defaultOpen)

  const palette = {
    ...(accent ? { "--vibeui-button-037-accent": accent } : null),
    ...style,
  } as CSSProperties

  // Esc закрывает веер с любого элемента внутри: раскрытая стопка
  // перекрывает интерфейс, и выход из неё должен быть на одной клавише.
  const escape = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && open) {
      event.stopPropagation()
      setOpen(false)
    }
  }

  return (
    <>
      <style href="vibeui-button-037" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button"
        data-vibeui-block="button-037"
        data-open={String(open)}
        className={className}
        style={palette}
        onKeyDown={escape}
      >
        <ul data-part="dial" hidden={!open}>
          {actions.map((action, index) => (
            <li
              key={action.id}
              data-part="item"
              style={
                {
                  "--vibeui-button-037-index": String(index),
                } as CSSProperties
              }
            >
              <button
                type="button"
                data-part="action"
                onClick={() => {
                  setOpen(false)
                  onSelect?.(action.id)
                }}
              >
                <span data-part="bullet" aria-hidden="true" />
                {action.label}
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          data-part="main"
          aria-label={label}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span data-part="cross" aria-hidden="true" />
        </button>
      </div>
    </>
  )
}
