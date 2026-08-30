import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Badge002Tone = "neutral" | "success" | "warning" | "danger" | "info"

export type Badge002Props = ComponentPropsWithoutRef<"span"> & {
  tone?: Badge002Tone
  size?: "sm" | "md"
}

// Идея компонента: залитая плашка для одного акцента на экране. В отличие от
// соседа с цветной точкой она кричит намеренно — ею помечают одно, а не
// каждую строку таблицы. Текст на заливке взят из того же тона с другой
// светлотой, поэтому контраст держится в любом оттенке.
const STYLES = `
:where([data-vibeui-block="badge-002"]){
--vibeui-badge-002-hue:265;
--vibeui-badge-002-chroma:0.03;
--vibeui-badge-002-bg:oklch(0.93 var(--vibeui-badge-002-chroma) var(--vibeui-badge-002-hue));
--vibeui-badge-002-fg:oklch(0.36 calc(var(--vibeui-badge-002-chroma) * 2.2) var(--vibeui-badge-002-hue));
--vibeui-badge-002-radius:0.4375rem;
--vibeui-badge-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="badge-002"]{
display:inline-flex;align-items:center;
height:1.5rem;padding:0 0.5625rem;
border-radius:var(--vibeui-badge-002-radius);
background:var(--vibeui-badge-002-bg);color:var(--vibeui-badge-002-fg);
font-family:var(--vibeui-badge-002-font);font-size:0.75rem;font-weight:600;
line-height:1;white-space:nowrap;vertical-align:middle;
}
[data-vibeui-block="badge-002"][data-size="sm"]{height:1.25rem;padding:0 0.4375rem;font-size:0.6875rem}
/* Тон — это два числа: оттенок и насыщенность. Светлота фона и текста
   считается из них, поэтому контраст не приходится подбирать вручную. */
[data-vibeui-block="badge-002"][data-tone="success"]{--vibeui-badge-002-hue:152;--vibeui-badge-002-chroma:0.06}
[data-vibeui-block="badge-002"][data-tone="warning"]{--vibeui-badge-002-hue:75;--vibeui-badge-002-chroma:0.07}
[data-vibeui-block="badge-002"][data-tone="danger"]{--vibeui-badge-002-hue:25;--vibeui-badge-002-chroma:0.07}
[data-vibeui-block="badge-002"][data-tone="info"]{--vibeui-badge-002-hue:250;--vibeui-badge-002-chroma:0.06}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-002"] *{animation:none!important;transition:none!important}}
`

/**
 * Залитая плашка тона: фон и текст считаются из одного оттенка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge002({
  tone = "success",
  size = "md",
  className,
  style,
  children = "Оплачено",
  ...props
}: Badge002Props) {
  return (
    <>
      <style href="vibeui-badge-002" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="badge-002"
        data-tone={tone}
        data-size={size}
        className={className}
        style={style as CSSProperties}
      >
        {children}
      </span>
    </>
  )
}
