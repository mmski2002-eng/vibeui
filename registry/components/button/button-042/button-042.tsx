import type { ComponentProps, CSSProperties } from "react"

export type Button042Props = ComponentProps<"button"> & {
  /** Величина среза угла в пикселях. */
  cut?: number
  accent?: string
}

// Идея компонента: срезанный угол через clip-path. Побочный эффект приёма —
// clip-path обрезает и системную обводку фокуса, поэтому focus-visible здесь
// нарисован внутренним кольцом inset box-shadow: оно лежит внутри фигуры
// и переживает обрезку. Второй срез повторён контрастной засечкой.
const STYLES = `
:where([data-vibeui-block="button-042"]){
--vibeui-button-042-cut:12px;
--vibeui-button-042-accent:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-button-042-fg:light-dark(oklch(0.98 0.02 39.8),oklch(0.97 0.022 39.8));
--vibeui-button-042-notch:oklch(0.22 0 0);
--vibeui-button-042-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-042"]{color-scheme:dark}
[data-vibeui-block="button-042"]{
position:relative;appearance:none;border:0;cursor:pointer;box-sizing:border-box;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.5rem;padding:0 1.25rem;
background:var(--vibeui-button-042-accent);color:var(--vibeui-button-042-fg);
font-family:var(--vibeui-button-042-font);font-size:0.875rem;font-weight:700;line-height:1;
letter-spacing:0.04em;text-transform:uppercase;
clip-path:polygon(0 0,100% 0,100% calc(100% - var(--vibeui-button-042-cut)),calc(100% - var(--vibeui-button-042-cut)) 100%,0 100%);
transition:background-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="button-042"]:hover:not(:disabled){
background:color-mix(in oklab,var(--vibeui-button-042-accent) 84%,white);
}
/* clip-path обрезает outline, поэтому кольцо фокуса — внутреннее. */
[data-vibeui-block="button-042"]:focus-visible{
outline:0;
box-shadow:inset 0 0 0 2px var(--vibeui-button-042-fg),inset 0 0 0 4px var(--vibeui-button-042-accent);
}
[data-vibeui-block="button-042"]:disabled{cursor:not-allowed;opacity:.5}
/* Засечка повторяет срез и подсказывает, что угол убран намеренно. */
[data-vibeui-block="button-042"]::after{
content:"";position:absolute;right:0;bottom:0;
width:var(--vibeui-button-042-cut);height:var(--vibeui-button-042-cut);
background:var(--vibeui-button-042-notch);
clip-path:polygon(100% 0,100% 100%,0 100%);
opacity:.9;
}
[data-vibeui-block="button-042"] [data-part="bar"]{
flex:none;width:0.1875rem;height:0.875rem;background:var(--vibeui-button-042-notch);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-042"]{transition:none!important}}
`

/**
 * Кнопка со скошенным углом: clip-path и внутреннее кольцо фокуса.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button042({
  cut = 12,
  accent,
  type = "button",
  className,
  style,
  children = "Запустить сборку",
  ...props
}: Button042Props) {
  const palette = {
    "--vibeui-button-042-cut": `${cut}px`,
    ...(accent ? { "--vibeui-button-042-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-042" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-042"
        className={className}
        style={palette}
      >
        <span data-part="bar" aria-hidden="true" />
        {children}
      </button>
    </>
  )
}
