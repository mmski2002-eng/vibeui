import type { ComponentProps, CSSProperties } from "react"

export type Button004Props = ComponentProps<"button"> & {
  /** Точка-маркер слева. Отключается, если кнопка стоит в плотном ряду. */
  marker?: boolean
  tint?: string
}

// Идея компонента: минимальный вес в покое. Ни рамки, ни фона — только текст
// и маленькая точка-маркер. Подложка проявляется на наведении и фокусе,
// поэтому кнопка не конкурирует с главным действием на экране.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте подпись светлеет, а подложка наведения из тёмной становится
// светлой — тёмный налёт на тёмном фоне не читался бы.
const STYLES = `
:where([data-vibeui-block="button-004"]){
--vibeui-button-004-fg:light-dark(oklch(0.45 0 265),oklch(0.72 0 265));
--vibeui-button-004-fg-strong:light-dark(oklch(0.27 0 265),oklch(0.95 0 265));
--vibeui-button-004-wash:light-dark(oklch(0.55 0 265 / 10%),oklch(0.85 0 265 / 14%));
--vibeui-button-004-marker:light-dark(oklch(0.63 0 265),oklch(0.68 0 265));
--vibeui-button-004-ring:light-dark(oklch(0.55 0 265 / 60%),oklch(0.8 0 265 / 60%));
--vibeui-button-004-radius:0.5rem;
--vibeui-button-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-004"]{color-scheme:dark}
[data-vibeui-block="button-004"]{
appearance:none;border:0;background:transparent;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.25rem;padding:0 0.75rem;border-radius:var(--vibeui-button-004-radius);
font-family:var(--vibeui-button-004-font);font-size:0.875rem;font-weight:500;line-height:1;
color:var(--vibeui-button-004-fg);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="button-004"] [data-part="marker"]{
width:0.375rem;height:0.375rem;flex:none;border-radius:9999px;
background:var(--vibeui-button-004-marker);opacity:.7;
transition:opacity .16s ease,transform .16s ease;
}
[data-vibeui-block="button-004"]:hover:not(:disabled){background:var(--vibeui-button-004-wash);color:var(--vibeui-button-004-fg-strong)}
[data-vibeui-block="button-004"]:hover:not(:disabled) [data-part="marker"]{opacity:1;transform:scale(1.25)}
[data-vibeui-block="button-004"]:focus-visible{outline:2px solid var(--vibeui-button-004-ring);outline-offset:2px;background:var(--vibeui-button-004-wash)}
[data-vibeui-block="button-004"]:disabled{cursor:not-allowed;opacity:.5}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-004"] *{animation:none!important;transition:none!important}}
`

/**
 * Тихое второстепенное действие: без рамки и фона в покое. Один файл,
 * ноль зависимостей, собственная палитра.
 */
export function Button004({
  marker = true,
  tint,
  type = "button",
  className,
  style,
  children = "Отменить",
  ...props
}: Button004Props) {
  const palette = {
    ...(tint ? { "--vibeui-button-004-marker": tint } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-004" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-004"
        className={className}
        style={palette}
      >
        {marker ? <span data-part="marker" aria-hidden="true" /> : null}
        {children}
      </button>
    </>
  )
}
