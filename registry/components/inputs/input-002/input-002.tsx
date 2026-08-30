import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Input002Props = Omit<
  ComponentPropsWithoutRef<"input">,
  "size" | "prefix"
> & {
  /** Неизменяемая часть слева: протокол, домен, символ валюты. */
  prefix?: ReactNode
  /** Неизменяемая часть справа: домен почты, единица измерения, расширение. */
  suffix?: ReactNode
  label?: string
  accent?: string
}

// Идея компонента: приставка и окончание живут внутри той же рамки, что и
// поле, а фокус подсвечивает группу целиком. Пользователь видит будущее
// значение полностью и не набирает то, что и так известно.
const STYLES = `
:where([data-vibeui-block="input-002"]){
--vibeui-input-002-surface:oklch(1 0 0);
--vibeui-input-002-surface-border:oklch(0.91 0.006 265);
--vibeui-input-002-fg:oklch(0.24 0.016 265);
--vibeui-input-002-muted:oklch(0.54 0.014 265);
--vibeui-input-002-bg:oklch(1 0 0);
--vibeui-input-002-fixed:oklch(0.97 0.003 265);
--vibeui-input-002-border:oklch(0.87 0.008 265);
--vibeui-input-002-accent:oklch(0.55 0.2 262);
--vibeui-input-002-radius:0.625rem;
--vibeui-input-002-height:2.75rem;
--vibeui-input-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Собственная подложка: подпись поля — это текст, и на тёмной странице
   он обязан читаться без правки палитры проекта. */
[data-vibeui-block="input-002"]{
box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-002-surface);
border:1px solid var(--vibeui-input-002-surface-border);border-radius:0.875rem;
display:flex;flex-direction:column;gap:0.375rem;
font-family:var(--vibeui-input-002-font);color:var(--vibeui-input-002-fg);
}
[data-vibeui-block="input-002"] [data-part="label"]{
font-size:0.8125rem;font-weight:500;
}
[data-vibeui-block="input-002"] [data-part="group"]{
display:flex;align-items:stretch;overflow:hidden;
height:var(--vibeui-input-002-height);
border:1px solid var(--vibeui-input-002-border);
border-radius:var(--vibeui-input-002-radius);
background:var(--vibeui-input-002-bg);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-002"] [data-part="group"]:focus-within{
border-color:var(--vibeui-input-002-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-002-accent) 22%,transparent);
}
[data-vibeui-block="input-002"] [data-part="fixed"]{
display:flex;align-items:center;flex:none;
padding:0 0.75rem;
background:var(--vibeui-input-002-fixed);
color:var(--vibeui-input-002-muted);
font-size:0.875rem;white-space:nowrap;user-select:none;
}
[data-vibeui-block="input-002"] [data-part="fixed"][data-side="start"]{border-right:1px solid var(--vibeui-input-002-border)}
[data-vibeui-block="input-002"] [data-part="fixed"][data-side="end"]{border-left:1px solid var(--vibeui-input-002-border)}
[data-vibeui-block="input-002"] input{
flex:1 1 auto;min-width:0;margin:0;border:0;outline:none;
padding:0 0.75rem;background:transparent;color:inherit;
font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="input-002"] input::placeholder{color:color-mix(in oklab,var(--vibeui-input-002-muted) 70%,transparent)}
[data-vibeui-block="input-002"] input:disabled{cursor:not-allowed}
[data-vibeui-block="input-002"]:has(input:disabled) [data-part="group"]{opacity:.55}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-002"] *{animation:none!important;transition:none!important}}
`

/**
 * Поле с неизменяемой приставкой и окончанием в одной рамке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input002({
  prefix = "vibeui.ru/",
  suffix,
  label = "Адрес страницы",
  accent,
  id,
  className,
  style,
  ...props
}: Input002Props) {
  const palette = {
    ...(accent ? { "--vibeui-input-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-input-002" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="input-002" className={className} style={palette}>
        {label ? (
          <label data-part="label" htmlFor={id}>
            {label}
          </label>
        ) : null}
        <div data-part="group">
          {prefix ? (
            <span data-part="fixed" data-side="start">
              {prefix}
            </span>
          ) : null}
          <input {...props} id={id} />
          {suffix ? (
            <span data-part="fixed" data-side="end">
              {suffix}
            </span>
          ) : null}
        </div>
      </div>
    </>
  )
}
