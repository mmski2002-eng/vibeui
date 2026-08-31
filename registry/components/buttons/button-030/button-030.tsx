import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button030Props = Omit<
  ComponentPropsWithoutRef<"button">,
  "children"
> & {
  label?: string
  /** Сколько непрочитанного. Ноль прячет бейдж целиком. */
  count?: number
  /** С какого числа показывать «99+». */
  cap?: number
  badge?: string
}

// Идея компонента: счётчик поверх угла кнопки. Число попадает и в бейдж, и в
// aria-label, поэтому «12 непрочитанных» слышно, а не только видно. Бейдж
// обведён кольцом цвета подложки — иначе цифра на границе значка теряется, —
// а большие числа схлопываются в «99+», чтобы кнопка не растягивалась.
const STYLES = `
:where([data-vibeui-block="button-030"]){
--vibeui-button-030-bg:oklch(1 0 0);
--vibeui-button-030-fg:oklch(0.32 0.016 265);
--vibeui-button-030-border:oklch(0.9 0.006 265);
--vibeui-button-030-accent:oklch(0.55 0.17 265);
--vibeui-button-030-badge:oklch(0.55 0.19 25);
--vibeui-button-030-badge-fg:oklch(0.99 0.01 25);
--vibeui-button-030-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-030"]{
appearance:none;cursor:pointer;position:relative;
display:inline-flex;align-items:center;justify-content:center;
width:2.5rem;height:2.5rem;padding:0;box-sizing:border-box;
border:1px solid var(--vibeui-button-030-border);border-radius:0.75rem;
background:var(--vibeui-button-030-bg);color:var(--vibeui-button-030-fg);
font-family:var(--vibeui-button-030-font);
transition:color .16s ease,border-color .16s ease;
}
[data-vibeui-block="button-030"]:hover{color:var(--vibeui-button-030-accent);border-color:var(--vibeui-button-030-accent)}
[data-vibeui-block="button-030"]:focus-visible{outline:2px solid var(--vibeui-button-030-accent);outline-offset:2px}
[data-vibeui-block="button-030"] [data-part="bell"]{
position:relative;width:0.875rem;height:0.8125rem;box-sizing:border-box;
border:1.5px solid currentColor;border-bottom:0;border-radius:0.5rem 0.5rem 0.0625rem 0.0625rem;
}
[data-vibeui-block="button-030"] [data-part="bell"]::before{
content:"";position:absolute;left:-0.1875rem;bottom:-1.5px;width:1.1875rem;height:1.5px;
border-radius:1px;background:currentColor;
}
[data-vibeui-block="button-030"] [data-part="bell"]::after{
content:"";position:absolute;left:50%;bottom:-0.3125rem;width:0.3125rem;height:0.1875rem;
margin-left:-0.15625rem;border-radius:0 0 0.15625rem 0.15625rem;background:currentColor;
}
/* Кольцо цвета подложки: цифра не липнет к краю значка. */
[data-vibeui-block="button-030"] [data-part="badge"]{
position:absolute;top:-0.3125rem;right:-0.3125rem;
display:inline-flex;align-items:center;justify-content:center;
min-width:1.125rem;height:1.125rem;padding:0 0.25rem;box-sizing:border-box;
border-radius:9999px;
background:var(--vibeui-button-030-badge);color:var(--vibeui-button-030-badge-fg);
box-shadow:0 0 0 2px var(--vibeui-button-030-bg);
font-size:0.6875rem;font-weight:700;line-height:1;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="button-030"] [data-part="halo"]{
position:absolute;top:-0.3125rem;right:-0.3125rem;
width:1.125rem;height:1.125rem;border-radius:9999px;
background:var(--vibeui-button-030-badge);
animation:vibeui-button-030-halo 2.4s ease-out infinite;
}
@keyframes vibeui-button-030-halo{
0%{opacity:.45;transform:scale(1)}
70%,100%{opacity:0;transform:scale(1.9)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="button-030"] *{animation:none!important;transition:none!important}
[data-vibeui-block="button-030"] [data-part="halo"]{display:none}
}
`

/**
 * Иконочная кнопка со счётчиком непрочитанного в углу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button030({
  label = "Уведомления",
  count = 12,
  cap = 99,
  badge,
  type = "button",
  className,
  style,
  ...props
}: Button030Props) {
  const shown = count > cap ? `${cap}+` : String(count)

  const palette = {
    ...(badge ? { "--vibeui-button-030-badge": badge } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-030" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-vibeui-block="button-030"
        className={className}
        style={palette}
        aria-label={count > 0 ? `${label}: ${count} непрочитанных` : label}
      >
        <span data-part="bell" aria-hidden="true" />
        {count > 0 ? (
          <>
            <span data-part="halo" aria-hidden="true" />
            <span data-part="badge" aria-hidden="true">
              {shown}
            </span>
          </>
        ) : null}
      </button>
    </>
  )
}
