import type { ComponentProps, CSSProperties } from "react"

export type Button011Props = ComponentProps<"button"> & {
  arrow?: boolean
  accent?: string
}

// Идея компонента: самое лёгкое действие в наборе — текст со стрелкой.
// Подчёркивание не нарисовано постоянно: оно прочерчивается слева направо
// на наведении и фокусе, стрелка в это время уезжает вперёд. Ни фона,
// ни рамки, ни высоты — кнопка живёт внутри строки текста.
//
// Тема берётся из color-scheme окружения через light-dark(): кнопка стоит
// в строке текста и обязана менять цвет вместе с ней, поэтому и подпись,
// и акцент наведения объявлены парой светлот.
const STYLES = `
:where([data-vibeui-block="button-011"]){
--vibeui-button-011-fg:light-dark(oklch(0.35 0.015 265),oklch(0.88 0.008 265));
--vibeui-button-011-accent:light-dark(oklch(0.55 0.16 258),oklch(0.74 0.14 258));
--vibeui-button-011-ring:color-mix(in oklab, var(--vibeui-button-011-accent) 65%, transparent);
--vibeui-button-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-011"]{color-scheme:dark}
[data-vibeui-block="button-011"]{
position:relative;appearance:none;border:0;background:transparent;padding:0;cursor:pointer;
display:inline-flex;align-items:center;gap:0.375rem;
font-family:var(--vibeui-button-011-font);font-size:0.9375rem;font-weight:500;line-height:1.4;
color:var(--vibeui-button-011-fg);
transition:color .18s ease;
}
[data-vibeui-block="button-011"]::after{
content:"";position:absolute;left:0;right:0;bottom:-2px;height:1px;
background:currentColor;transform:scaleX(0);transform-origin:left center;
transition:transform .28s cubic-bezier(0.16,1,0.3,1);
}
[data-vibeui-block="button-011"]:hover:not(:disabled),[data-vibeui-block="button-011"]:focus-visible{color:var(--vibeui-button-011-accent)}
[data-vibeui-block="button-011"]:hover:not(:disabled)::after,[data-vibeui-block="button-011"]:focus-visible::after{transform:scaleX(1)}
[data-vibeui-block="button-011"]:focus-visible{outline:2px solid var(--vibeui-button-011-ring);outline-offset:3px;border-radius:2px}
[data-vibeui-block="button-011"]:disabled{cursor:not-allowed;opacity:.5}
[data-vibeui-block="button-011"] svg{width:0.75rem;height:0.75rem;flex:none;transition:transform .28s cubic-bezier(0.16,1,0.3,1)}
[data-vibeui-block="button-011"]:hover:not(:disabled) svg{transform:translateX(3px)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-011"],[data-vibeui-block="button-011"]::after,[data-vibeui-block="button-011"] svg{transition:none!important}}
`

/**
 * Минимальное текстовое действие: подчёркивание прочерчивается на наведении.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button011({
  arrow = true,
  accent,
  type = "button",
  className,
  style,
  children = "Смотреть все возможности",
  ...props
}: Button011Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-011" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-011"
        className={className}
        style={palette}
      >
        {children}
        {arrow ? (
          <svg viewBox="0 0 12 10" fill="none" aria-hidden="true">
            <path
              d="M1 5h9M6.5 1.5 10 5l-3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </button>
    </>
  )
}
