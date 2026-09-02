import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button014Props = Omit<
  ComponentPropsWithoutRef<"button">,
  "children"
> & {
  label?: string
  hint?: string
  accent?: string
}

// Идея компонента: круглая кнопка главного действия, у которой подпись
// выезжает при наведении и при фокусе. Круг с одним плюсом ничего не
// сообщает, а постоянная подпись занимает место в углу экрана — компромисс
// в том, чтобы имя было всегда доступно скринридеру и появлялось глазу.
const STYLES = `
:where([data-vibeui-block="button-014"]){
--vibeui-button-014-size:3.25rem;
--vibeui-button-014-accent:light-dark(oklch(0.55 0.17 265),oklch(0.63 0.18 265));
--vibeui-button-014-fg:oklch(0.99 0.01 265);
--vibeui-button-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-014"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5rem;
height:var(--vibeui-button-014-size);
/* Ширина едет от круга к пилюле: подпись раскрывается, а не появляется
   поверх соседей. */
padding:0 calc((var(--vibeui-button-014-size) - 1rem) / 2);
border-radius:9999px;
background:var(--vibeui-button-014-accent);color:var(--vibeui-button-014-fg);
font-family:var(--vibeui-button-014-font);font-size:0.875rem;font-weight:650;line-height:1;
box-shadow:0 12px 24px -12px color-mix(in oklab,var(--vibeui-button-014-accent) 70%,transparent);
transition:padding .18s ease,filter .16s ease;
}
[data-vibeui-block="button-014"]:hover{filter:brightness(0.96)}
[data-vibeui-block="button-014"]:focus-visible{outline:2px solid var(--vibeui-button-014-accent);outline-offset:3px}
[data-vibeui-block="button-014"] [data-part="plus"]{position:relative;flex:none;width:1rem;height:1rem}
[data-vibeui-block="button-014"] [data-part="plus"]::before,
[data-vibeui-block="button-014"] [data-part="plus"]::after{
content:"";position:absolute;left:50%;top:50%;background:currentColor;border-radius:9999px;
}
[data-vibeui-block="button-014"] [data-part="plus"]::before{width:0.875rem;height:1.75px;margin:-0.875px 0 0 -0.4375rem}
[data-vibeui-block="button-014"] [data-part="plus"]::after{width:1.75px;height:0.875rem;margin:-0.4375rem 0 0 -0.875px}
/* Подпись раскрывается по ширине: у скрытой ширины 0, но она в разметке. */
[data-vibeui-block="button-014"] [data-part="label"]{
display:inline-block;max-width:0;overflow:hidden;white-space:nowrap;
opacity:0;transition:max-width .18s ease,opacity .14s ease;
}
[data-vibeui-block="button-014"]:hover [data-part="label"],
[data-vibeui-block="button-014"]:focus-visible [data-part="label"]{max-width:12rem;opacity:1}
[data-vibeui-block="button-014"]:hover,
[data-vibeui-block="button-014"]:focus-visible{padding:0 1.125rem}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="button-014"] *{animation:none!important;transition:none!important}
[data-vibeui-block="button-014"]{transition:none!important}
}
`

/**
 * Круглая кнопка главного действия: подпись раскрывается при наведении.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button014({
  label = "Новая задача",
  hint,
  accent,
  type = "button",
  className,
  style,
  ...props
}: Button014Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-014-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-014" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-vibeui-block="button-014"
        className={className}
        style={palette}
        aria-label={label}
        title={hint ?? label}
      >
        <span data-part="plus" aria-hidden="true" />
        <span data-part="label" aria-hidden="true">
          {label}
        </span>
      </button>
    </>
  )
}
