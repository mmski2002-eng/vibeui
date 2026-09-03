import type { ComponentProps, CSSProperties } from "react"

export type Button006Props = ComponentProps<"button"> & {
  danger?: string
}

// Идея компонента: необратимость видно до клика. По левому краю идёт узкая
// полоса предупреждающей штриховки — она проявляется на наведении и фокусе
// и физически расширяется, отодвигая подпись. Цвет здесь не единственный
// сигнал: штриховка читается и без цветовосприятия.
//
// Тема берётся из color-scheme окружения через light-dark(): красный в тёмном
// контексте светлее, а граница и наведение подмешивают не чёрный, а белый —
// иначе край кнопки уходит в фон страницы.
const STYLES = `
:where([data-vibeui-block="button-006"]){
--vibeui-button-006-danger:light-dark(oklch(0.55 0.21 26),oklch(0.62 0.195 26));
--vibeui-button-006-fg:oklch(0.99 0.005 26);
--vibeui-button-006-hatch:oklch(1 0 0 / 30%);
--vibeui-button-006-shade:light-dark(black,white);
--vibeui-button-006-ring:color-mix(in oklab, var(--vibeui-button-006-danger) 75%, transparent);
--vibeui-button-006-radius:0.5rem;
--vibeui-button-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-006"]{color-scheme:dark}
[data-vibeui-block="button-006"]{
position:relative;overflow:hidden;appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
height:2.5rem;padding:0 1.125rem;border:1px solid color-mix(in oklab, var(--vibeui-button-006-shade) 18%, var(--vibeui-button-006-danger));
border-radius:var(--vibeui-button-006-radius);
font-family:var(--vibeui-button-006-font);font-size:0.875rem;font-weight:600;line-height:1;
letter-spacing:0.01em;background:var(--vibeui-button-006-danger);color:var(--vibeui-button-006-fg);
transition:padding-left .22s cubic-bezier(0.16,1,0.3,1),background-color .18s ease;
}
[data-vibeui-block="button-006"]::before{
content:"";position:absolute;left:0;top:0;bottom:0;width:0.75rem;
background:repeating-linear-gradient(45deg,var(--vibeui-button-006-hatch) 0 3px,transparent 3px 6px);
transform:translateX(-100%);transition:transform .22s cubic-bezier(0.16,1,0.3,1);
}
[data-vibeui-block="button-006"]:hover:not(:disabled),[data-vibeui-block="button-006"]:focus-visible{
padding-left:1.75rem;background:color-mix(in oklab, var(--vibeui-button-006-danger) 88%, var(--vibeui-button-006-shade));
}
[data-vibeui-block="button-006"]:hover:not(:disabled)::before,[data-vibeui-block="button-006"]:focus-visible::before{transform:translateX(0)}
[data-vibeui-block="button-006"]:focus-visible{outline:2px solid var(--vibeui-button-006-ring);outline-offset:2px}
[data-vibeui-block="button-006"]:disabled{cursor:not-allowed;opacity:.55}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-006"],[data-vibeui-block="button-006"]::before{transition:none!important}}
`

/**
 * Необратимое действие: предупреждающая штриховка выезжает по левому краю
 * на наведении и фокусе. Один файл, ноль зависимостей, собственная палитра.
 */
export function Button006({
  danger,
  type = "button",
  className,
  style,
  children = "Удалить навсегда",
  ...props
}: Button006Props) {
  const palette = {
    ...(danger ? { "--vibeui-button-006-danger": danger } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-006" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-006"
        className={className}
        style={palette}
      >
        {children}
      </button>
    </>
  )
}
