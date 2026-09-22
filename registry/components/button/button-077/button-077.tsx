import type { ComponentProps, CSSProperties } from "react"

export type Button077Props = Omit<ComponentProps<"a">, "children"> & {
  label?: string
  href?: string
  /** Стрелка справа: при наведении уезжает вперёд. */
  arrow?: boolean
  /** Подчёркивание: всегда, при наведении или никогда. */
  underline?: "hover" | "always" | "none"
  size?: "sm" | "md"
  accent?: string
}

// Идея компонента: ссылка-действие без рамки и заливки — «задать вопрос»,
// «все тарифы», «читать дальше». Вес ей даёт цвет акцента и стрелка, а не
// коробка кнопки, поэтому она встаёт под абзацем и в конце карточки, не
// споря с настоящими кнопками рядом. Остаётся <a>: адрес копируется,
// открывается в новой вкладке, виден в статусной строке.
const STYLES = `
:where([data-vibeui-block="button-077"]){
--vibeui-button-077-accent:light-dark(oklch(0.287 0 0),oklch(0.883 0 0));
--vibeui-button-077-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-077"]{color-scheme:dark}
[data-vibeui-block="button-077"]{
display:inline-flex;align-items:center;gap:0.375rem;
color:var(--vibeui-button-077-accent);
font-family:var(--vibeui-button-077-font);font-size:0.9375rem;font-weight:560;line-height:1.3;
text-decoration:none;text-underline-offset:0.2em;
}
[data-vibeui-block="button-077"][data-size="sm"]{font-size:0.8125rem}
[data-vibeui-block="button-077"][data-underline="always"]{text-decoration:underline}
[data-vibeui-block="button-077"][data-underline="hover"]:hover{text-decoration:underline}
[data-vibeui-block="button-077"]:focus-visible{outline:2px solid var(--vibeui-button-077-accent);outline-offset:3px;border-radius:0.25rem}
/* Стрелка из бордюров и линии: одинакова во всех шрифтах и движках. */
[data-vibeui-block="button-077"] [data-part="arrow"]{
position:relative;flex:none;width:0.875rem;height:0.75rem;
transition:transform .18s ease;
}
[data-vibeui-block="button-077"] [data-part="arrow"]::before{
content:"";position:absolute;left:0;top:50%;width:100%;height:1.5px;margin-top:-0.75px;
background:currentColor;
}
[data-vibeui-block="button-077"] [data-part="arrow"]::after{
content:"";position:absolute;right:1px;top:50%;width:0.375rem;height:0.375rem;
border-top:1.5px solid currentColor;border-right:1.5px solid currentColor;
transform:translateY(-50%) rotate(45deg);
}
[data-vibeui-block="button-077"]:hover [data-part="arrow"]{transform:translateX(0.1875rem)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-077"] *{animation:none!important;transition:none!important}}
`

/**
 * Текстовая ссылка-действие со стрелкой: акцентный цвет вместо рамки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button077({
  label = "Задать свой вопрос",
  href = "#",
  arrow = true,
  underline = "hover",
  size = "md",
  accent,
  className,
  style,
  ...props
}: Button077Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-077-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-077" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-slot="button"
        data-vibeui-block="button-077"
        data-size={size}
        data-underline={underline}
        href={href}
        className={className}
        style={palette}
      >
        {label}
        {arrow ? <span data-part="arrow" aria-hidden="true" /> : null}
      </a>
    </>
  )
}
