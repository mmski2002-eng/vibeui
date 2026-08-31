import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Tooltip007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  /** Требование к вводу: показывается, пока поле в фокусе. */
  hint?: string
  placeholder?: string
  name?: string
}

// Идея компонента: подсказка у поля ввода, привязанная к фокусу, а не к
// наведению. Требования к паролю или формату нужны ровно в момент набора,
// поэтому :focus-within открывает их, а курсор мыши ничего не показывает.
const STYLES = `
:where([data-vibeui-block="tooltip-007"]){
--vibeui-tooltip-007-bg:oklch(1 0 0);
--vibeui-tooltip-007-fg:oklch(0.24 0.014 265);
--vibeui-tooltip-007-muted:oklch(0.54 0.014 265);
--vibeui-tooltip-007-border:oklch(0.88 0.006 265);
--vibeui-tooltip-007-tip:oklch(0.97 0.02 250);
--vibeui-tooltip-007-tipfg:oklch(0.35 0.07 250);
--vibeui-tooltip-007-accent:oklch(0.56 0.17 260);
--vibeui-tooltip-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="tooltip-007"]{
position:relative;
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;
padding:1rem;
border:1px solid var(--vibeui-tooltip-007-border);border-radius:0.875rem;
background:var(--vibeui-tooltip-007-bg);color:var(--vibeui-tooltip-007-fg);
font-family:var(--vibeui-tooltip-007-font);
}
[data-vibeui-block="tooltip-007"] [data-part="label"]{font-size:0.8125rem;font-weight:620}
[data-vibeui-block="tooltip-007"] [data-part="field"]{position:relative;display:flex}
[data-vibeui-block="tooltip-007"] [data-part="input"]{
width:100%;box-sizing:border-box;
height:2.375rem;padding:0 0.6875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-tooltip-007-border);
background:oklch(0.99 0.002 265);color:inherit;
font:inherit;font-size:0.875rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="tooltip-007"] [data-part="input"]::placeholder{color:oklch(0.68 0.01 265)}
[data-vibeui-block="tooltip-007"] [data-part="input"]:focus{
outline:none;border-color:var(--vibeui-tooltip-007-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-tooltip-007-accent) 22%,transparent);
}
/* Подсказка открывается фокусом, а не курсором: она нужна во время набора. */
[data-vibeui-block="tooltip-007"] [data-part="hint"]{
position:absolute;left:0;right:0;top:calc(100% + 0.4375rem);z-index:20;
box-sizing:border-box;padding:0.5rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-tooltip-007-tip);color:var(--vibeui-tooltip-007-tipfg);
font-size:0.75rem;line-height:1.45;
opacity:0;visibility:hidden;translate:0 -0.25rem;
transition:opacity .14s ease,translate .14s ease,visibility .14s;
}
[data-vibeui-block="tooltip-007"] [data-part="hint"]::before{
content:"";position:absolute;left:0.9375rem;top:-0.1875rem;
width:0.5rem;height:0.5rem;background:inherit;transform:rotate(45deg);
}
[data-vibeui-block="tooltip-007"] [data-part="field"]:focus-within [data-part="hint"]{
opacity:1;visibility:visible;translate:0 0;
}
[data-vibeui-block="tooltip-007"] [data-part="foot"]{
margin:0;font-size:0.75rem;line-height:1.45;color:var(--vibeui-tooltip-007-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-007"] *{animation:none!important;transition:none!important}}
`

/**
 * Подсказка у поля ввода, которая открывается фокусом, а не наведением.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tooltip007({
  label = "Новый пароль",
  hint = "От 12 знаков, хотя бы одна цифра и один спецсимвол. Пробелы считаются.",
  placeholder = "••••••••••••",
  name = "password",
  className,
  style,
  ...props
}: Tooltip007Props) {
  return (
    <>
      <style href="vibeui-tooltip-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="tooltip-007"
        className={className}
        style={style as CSSProperties}
      >
        <label data-part="label" htmlFor="vibeui-tooltip-007-input">
          {label}
        </label>
        <span data-part="field">
          <input
            data-part="input"
            id="vibeui-tooltip-007-input"
            name={name}
            type="password"
            placeholder={placeholder}
            aria-describedby="vibeui-tooltip-007-hint"
          />
          <span data-part="hint" id="vibeui-tooltip-007-hint" role="note">
            {hint}
          </span>
        </span>
        <p data-part="foot">Подсказка появляется, когда поле получает фокус.</p>
      </div>
    </>
  )
}
