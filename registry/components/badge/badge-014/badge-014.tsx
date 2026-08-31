import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Badge014Props = ComponentPropsWithoutRef<"span"> & {
  hue?: number
  dashed?: boolean
}

// Идея компонента: плашка на обводке, а не на заливке. Весь набор цветов
// считается из одного числа — оттенка: рамка насыщенная, текст тёмный,
// подложка того же тона в восьми процентах. Пунктирная рамка отдана
// предварительным состояниям: «черновик» отличается от «опубликовано»
// формой линии, а не только цветом.
const STYLES = `
:where([data-vibeui-block="badge-014"]){
--vibeui-badge-014-hue:265;
--vibeui-badge-014-line:oklch(0.62 0.13 var(--vibeui-badge-014-hue));
--vibeui-badge-014-fg:oklch(0.42 0.12 var(--vibeui-badge-014-hue));
/* Плашка несёт собственную светлую подложку: на тёмной карточке каталога
   прозрачный фон оставил бы тёмный текст на тёмном. */
--vibeui-badge-014-bg:oklch(0.98 0.012 var(--vibeui-badge-014-hue));
--vibeui-badge-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="badge-014"]{
display:inline-flex;align-items:center;gap:0.375rem;
box-sizing:border-box;height:1.75rem;padding:0 0.6875rem;
border:1.5px solid var(--vibeui-badge-014-line);border-radius:9999px;
background:var(--vibeui-badge-014-bg);color:var(--vibeui-badge-014-fg);
font-family:var(--vibeui-badge-014-font);font-size:0.75rem;font-weight:600;line-height:1;
letter-spacing:0.005em;vertical-align:middle;
}
[data-vibeui-block="badge-014"][data-dashed="true"]{
border-style:dashed;
/* У черновика тон приглушён: рамка кричит меньше, чем у финального. */
--vibeui-badge-014-line:oklch(0.72 0.06 var(--vibeui-badge-014-hue));
--vibeui-badge-014-fg:oklch(0.5 0.05 var(--vibeui-badge-014-hue));
}
[data-vibeui-block="badge-014"] [data-part="dot"]{
width:0.375rem;height:0.375rem;flex:none;border-radius:9999px;
background:var(--vibeui-badge-014-line);
}
[data-vibeui-block="badge-014"][data-dashed="true"] [data-part="dot"]{
background:transparent;box-shadow:inset 0 0 0 1.5px var(--vibeui-badge-014-line);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-014"] *{animation:none!important;transition:none!important}}
`

/**
 * Плашка на обводке: вся палитра выводится из одного оттенка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge014({
  hue = 265,
  dashed = false,
  className,
  style,
  children = "Опубликовано",
  ...props
}: Badge014Props) {
  const palette = {
    "--vibeui-badge-014-hue": String(Math.round(hue) % 360),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-014" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="badge-014"
        data-dashed={dashed}
        className={className}
        style={palette}
      >
        <span data-part="dot" aria-hidden="true" />
        {children}
      </span>
    </>
  )
}
