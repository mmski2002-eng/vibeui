import type { ComponentProps, CSSProperties } from "react"

export type Button036Props = ComponentProps<"button"> & {
  /** Значок слева: он говорит, что за действие. */
  leading?: "plus" | "search" | "none"
  /** Значок справа: он говорит, что будет после клика. */
  trailing?: "chevron" | "arrow" | "none"
  accent?: string
}

// Идея компонента: два значка с разными ролями. Левый называет действие,
// правый обещает продолжение, поэтому у них разные отступы и разное
// поведение на наведении: левый оживает на месте, правый уезжает вперёд.
// Оба нарисованы гранями псевдоэлементов — ни SVG, ни шрифта иконок.
const STYLES = `
:where([data-vibeui-block="button-036"]){
--vibeui-button-036-accent:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-036-hover-filter:light-dark(brightness(1.45),brightness(0.9));
--vibeui-button-036-fg:light-dark(oklch(0.99 0 265),oklch(0.17 0.01 265));
--vibeui-button-036-radius:0.625rem;
--vibeui-button-036-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-036"]{color-scheme:dark}
[data-vibeui-block="button-036"]{
appearance:none;border:0;cursor:pointer;box-sizing:border-box;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.5rem;padding:0 0.75rem 0 0.6875rem;border-radius:var(--vibeui-button-036-radius);
background:var(--vibeui-button-036-accent);color:oklch(from var(--vibeui-button-036-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-family:var(--vibeui-button-036-font);font-size:0.875rem;font-weight:600;line-height:1;
transition:filter .16s ease;
}
[data-vibeui-block="button-036"]:hover:not(:disabled){filter:brightness(1.08)}
[data-vibeui-block="button-036"]:focus-visible{outline:2px solid var(--vibeui-button-036-accent);outline-offset:2px}
[data-vibeui-block="button-036"]:disabled{cursor:not-allowed;opacity:.5}
[data-vibeui-block="button-036"] [data-part="lead"],
[data-vibeui-block="button-036"] [data-part="trail"]{
position:relative;flex:none;width:0.875rem;height:0.875rem;
}
[data-vibeui-block="button-036"] [data-part="lead"][data-icon="plus"]::before,
[data-vibeui-block="button-036"] [data-part="lead"][data-icon="plus"]::after{
content:"";position:absolute;left:50%;top:50%;background:currentColor;border-radius:1px;
}
[data-vibeui-block="button-036"] [data-part="lead"][data-icon="plus"]::before{width:0.75rem;height:1.75px;margin:-0.875px 0 0 -0.375rem}
[data-vibeui-block="button-036"] [data-part="lead"][data-icon="plus"]::after{width:1.75px;height:0.75rem;margin:-0.375rem 0 0 -0.875px}
[data-vibeui-block="button-036"] [data-part="lead"][data-icon="search"]::before{
content:"";position:absolute;left:0;top:0;width:0.625rem;height:0.625rem;
box-sizing:border-box;border:1.75px solid currentColor;border-radius:50%;
}
[data-vibeui-block="button-036"] [data-part="lead"][data-icon="search"]::after{
content:"";position:absolute;right:0.0625rem;bottom:0.0625rem;width:0.3125rem;height:1.75px;
background:currentColor;border-radius:1px;transform:rotate(45deg);transform-origin:right center;
}
[data-vibeui-block="button-036"] [data-part="lead"]{transition:transform .16s ease}
[data-vibeui-block="button-036"]:hover:not(:disabled) [data-part="lead"]{transform:rotate(90deg)}
[data-vibeui-block="button-036"] [data-part="lead"][data-icon="search"]{transition:transform .16s ease}
[data-vibeui-block="button-036"]:hover:not(:disabled) [data-part="lead"][data-icon="search"]{transform:scale(1.12) rotate(0deg)}
[data-vibeui-block="button-036"] [data-part="trail"]::before{
content:"";position:absolute;right:0.1875rem;top:50%;
width:0.4375rem;height:0.4375rem;box-sizing:border-box;
border:1.75px solid currentColor;border-left:0;border-bottom:0;
transform:translateY(-50%) rotate(45deg);
}
[data-vibeui-block="button-036"] [data-part="trail"][data-icon="arrow"]::after{
content:"";position:absolute;left:0;top:50%;width:0.75rem;height:1.75px;
margin-top:-0.875px;background:currentColor;border-radius:1px;
}
[data-vibeui-block="button-036"] [data-part="trail"]{transition:transform .18s cubic-bezier(0.16,1,0.3,1)}
[data-vibeui-block="button-036"]:hover:not(:disabled) [data-part="trail"]{transform:translateX(3px)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-036"] *{animation:none!important;transition:none!important}}
`

/**
 * Кнопка с двумя значками: левый называет действие, правый обещает переход.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button036({
  leading = "plus",
  trailing = "chevron",
  accent,
  type = "button",
  className,
  style,
  children = "Создать проект",
  ...props
}: Button036Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-036-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-036" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-036"
        className={className}
        style={palette}
      >
        {leading === "none" ? null : (
          <span data-part="lead" data-icon={leading} aria-hidden="true" />
        )}
        {children}
        {trailing === "none" ? null : (
          <span data-part="trail" data-icon={trailing} aria-hidden="true" />
        )}
      </button>
    </>
  )
}
