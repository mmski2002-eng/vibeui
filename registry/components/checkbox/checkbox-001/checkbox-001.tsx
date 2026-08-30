import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Checkbox001Props = Omit<
  ComponentPropsWithoutRef<"input">,
  "type" | "size"
> & {
  label?: string
  /** Пояснение под подписью. Кликается вместе с ней. */
  description?: string
  accent?: string
}

// Идея компонента: кликабельна вся строка, а не квадратик 16×16. Галка
// рисуется двумя гранями и появляется прочерком времени, а не картинкой:
// иконочная библиотека не нужна, состояние держит нативный input.
const STYLES = `
:where([data-vibeui-block="checkbox-001"]){
--vibeui-checkbox-001-surface:oklch(1 0 0);
--vibeui-checkbox-001-surface-border:oklch(0.91 0.006 265);
--vibeui-checkbox-001-fg:oklch(0.24 0.016 265);
--vibeui-checkbox-001-muted:oklch(0.54 0.014 265);
--vibeui-checkbox-001-bg:oklch(1 0 0);
--vibeui-checkbox-001-border:oklch(0.82 0.01 265);
--vibeui-checkbox-001-accent:oklch(0.55 0.2 262);
--vibeui-checkbox-001-mark:oklch(1 0 0);
--vibeui-checkbox-001-hover:oklch(0.55 0.02 265 / 7%);
--vibeui-checkbox-001-radius:0.625rem;
--vibeui-checkbox-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Собственная подложка: подпись и пояснение — это текст, и на тёмной
   странице он обязан читаться без правки палитры проекта. */
[data-vibeui-block="checkbox-001"]{
box-sizing:border-box;padding:0.75rem 0.875rem;
background:var(--vibeui-checkbox-001-surface);
border:1px solid var(--vibeui-checkbox-001-surface-border);border-radius:0.875rem;
display:flex;align-items:flex-start;gap:0.6875rem;
padding:0.625rem 0.75rem;margin:-0.625rem -0.75rem;
border-radius:var(--vibeui-checkbox-001-radius);cursor:pointer;
font-family:var(--vibeui-checkbox-001-font);color:var(--vibeui-checkbox-001-fg);
transition:background-color .16s ease;
}
[data-vibeui-block="checkbox-001"]:hover:not(:has(input:disabled)){background:var(--vibeui-checkbox-001-hover)}
[data-vibeui-block="checkbox-001"]:has(input:disabled){cursor:not-allowed;opacity:.55}
[data-vibeui-block="checkbox-001"] input{
appearance:none;-webkit-appearance:none;
flex:none;margin:0.0625rem 0 0;width:1.125rem;height:1.125rem;
border:1.5px solid var(--vibeui-checkbox-001-border);border-radius:0.375rem;
background:var(--vibeui-checkbox-001-bg);cursor:inherit;
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="checkbox-001"] input:checked{
background:var(--vibeui-checkbox-001-accent);
border-color:var(--vibeui-checkbox-001-accent);
}
[data-vibeui-block="checkbox-001"] input:focus-visible{
outline:2px solid var(--vibeui-checkbox-001-accent);outline-offset:2px;
}
[data-vibeui-block="checkbox-001"] [data-part="box"]{position:relative;display:flex;flex:none}
/* Галка — две грани квадрата, повёрнутые на 45°; растёт из нуля при отметке. */
[data-vibeui-block="checkbox-001"] [data-part="mark"]{
position:absolute;left:0.375rem;top:0.1875rem;
width:0.3125rem;height:0.5625rem;pointer-events:none;
border-right:2px solid var(--vibeui-checkbox-001-mark);
border-bottom:2px solid var(--vibeui-checkbox-001-mark);
transform:rotate(45deg) scale(0.4);transform-origin:center;
opacity:0;transition:opacity .14s ease,transform .14s ease;
}
[data-vibeui-block="checkbox-001"] input:checked + [data-part="mark"]{opacity:1;transform:rotate(45deg) scale(1)}
[data-vibeui-block="checkbox-001"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="checkbox-001"] [data-part="title"]{font-size:0.9375rem;line-height:1.35}
[data-vibeui-block="checkbox-001"] [data-part="description"]{font-size:0.8125rem;line-height:1.4;color:var(--vibeui-checkbox-001-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Чекбокс со строкой-мишенью: подпись, пояснение и галка на чистом CSS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Checkbox001({
  label = "Присылать отчёты",
  description = "Раз в неделю, коротким письмом. Отключается в любой момент.",
  accent,
  className,
  style,
  ...props
}: Checkbox001Props) {
  const palette = {
    ...(accent ? { "--vibeui-checkbox-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-checkbox-001" precedence="medium">
        {STYLES}
      </style>
      <label
        data-vibeui-block="checkbox-001"
        className={className}
        style={palette}
      >
        <span data-part="box">
          <input {...props} type="checkbox" />
          <span data-part="mark" aria-hidden="true" />
        </span>
        <span data-part="text">
          <span data-part="title">{label}</span>
          {description ? (
            <span data-part="description">{description}</span>
          ) : null}
        </span>
      </label>
    </>
  )
}
