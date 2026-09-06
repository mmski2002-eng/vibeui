import type { ComponentProps, CSSProperties } from "react"

export type Button039Props = ComponentProps<"button"> & {
  size?: "sm" | "md" | "lg" | "xl"
  accent?: string
}

// Идея компонента: размер — это одно число, а не четыре набора правил.
// Вся геометрия (высота, паддинги, кегль, радиус, значок, разрядка) считается
// из --vibeui-button-039-step через calc, поэтому шкала остаётся
// пропорциональной, а новый размер добавляется одной строкой.
const STYLES = `
:where([data-vibeui-block="button-039"]){
--vibeui-button-039-step:1;
--vibeui-button-039-unit:2rem;
--vibeui-button-039-accent:light-dark(oklch(0.52 0.17 39.8),oklch(0.66 0.18 39.8));
--vibeui-button-039-hover-filter:light-dark(brightness(1.45),brightness(0.9));
--vibeui-button-039-fg:light-dark(oklch(0.99 0 265),oklch(0.17 0.01 265));
--vibeui-button-039-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-039"]{color-scheme:dark}
[data-vibeui-block="button-039"]{
appearance:none;border:0;cursor:pointer;box-sizing:border-box;
display:inline-flex;align-items:center;justify-content:center;
gap:calc(0.375rem * var(--vibeui-button-039-step));
height:calc(var(--vibeui-button-039-unit) * var(--vibeui-button-039-step));
padding:0 calc(0.875rem * var(--vibeui-button-039-step));
border-radius:calc(0.5rem * var(--vibeui-button-039-step));
background:var(--vibeui-button-039-accent);color:var(--vibeui-button-039-fg);
font-family:var(--vibeui-button-039-font);
font-size:calc(0.8125rem * var(--vibeui-button-039-step));
font-weight:600;line-height:1;
letter-spacing:calc(0.01em / var(--vibeui-button-039-step));
transition:filter .16s ease;
}
[data-vibeui-block="button-039"][data-size="sm"]{--vibeui-button-039-step:0.82}
[data-vibeui-block="button-039"][data-size="md"]{--vibeui-button-039-step:1}
[data-vibeui-block="button-039"][data-size="lg"]{--vibeui-button-039-step:1.22}
[data-vibeui-block="button-039"][data-size="xl"]{--vibeui-button-039-step:1.5}
[data-vibeui-block="button-039"]:hover:not(:disabled){filter:brightness(1.07)}
[data-vibeui-block="button-039"]:focus-visible{
outline:calc(2px * var(--vibeui-button-039-step)) solid var(--vibeui-button-039-accent);
outline-offset:calc(2px * var(--vibeui-button-039-step));
}
[data-vibeui-block="button-039"]:disabled{cursor:not-allowed;opacity:.5}
/* Значок тоже часть шкалы: он растёт вместе с кеглем, а не остаётся 16px. */
[data-vibeui-block="button-039"] [data-part="mark"]{
position:relative;flex:none;
width:calc(0.75rem * var(--vibeui-button-039-step));
height:calc(0.75rem * var(--vibeui-button-039-step));
}
[data-vibeui-block="button-039"] [data-part="mark"]::before,
[data-vibeui-block="button-039"] [data-part="mark"]::after{
content:"";position:absolute;background:currentColor;border-radius:9999px;
}
[data-vibeui-block="button-039"] [data-part="mark"]::before{
left:0;top:50%;width:100%;height:calc(1.5px * var(--vibeui-button-039-step));transform:translateY(-50%);
}
[data-vibeui-block="button-039"] [data-part="mark"]::after{
left:50%;top:0;height:100%;width:calc(1.5px * var(--vibeui-button-039-step));transform:translateX(-50%);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-039"]{transition:none!important}}
`

/**
 * Размерная шкала sm/md/lg/xl из одной переменной: вся геометрия на calc.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button039({
  size = "md",
  accent,
  type = "button",
  className,
  style,
  children = "Добавить блок",
  ...props
}: Button039Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-039-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-039" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-039"
        data-size={size}
        className={className}
        style={palette}
      >
        <span data-part="mark" aria-hidden="true" />
        {children}
      </button>
    </>
  )
}
