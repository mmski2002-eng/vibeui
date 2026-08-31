import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Badge013Icon = "check" | "clock" | "alert" | "spark"

export type Badge013Props = ComponentPropsWithoutRef<"span"> & {
  icon?: Badge013Icon
  tone?: "neutral" | "positive" | "warning" | "accent"
}

// Идея компонента: плашка, у которой слева стоит знак. Иконка живёт в тех же
// единицах, что и текст: размер в em, оптический сдвиг вверх на пол-пикселя,
// flex:none — поэтому она не разъезжается при смене размера шрифта и не
// сжимается, когда подпись длинная.
const STYLES = `
:where([data-vibeui-block="badge-013"]){
--vibeui-badge-013-hue:265;
--vibeui-badge-013-chroma:0.014;
--vibeui-badge-013-bg:oklch(0.96 calc(var(--vibeui-badge-013-chroma) * 0.5) var(--vibeui-badge-013-hue));
--vibeui-badge-013-fg:oklch(0.34 var(--vibeui-badge-013-chroma) var(--vibeui-badge-013-hue));
--vibeui-badge-013-mark:oklch(0.52 calc(var(--vibeui-badge-013-chroma) * 1.6) var(--vibeui-badge-013-hue));
--vibeui-badge-013-border:oklch(0.89 calc(var(--vibeui-badge-013-chroma) * 0.8) var(--vibeui-badge-013-hue));
--vibeui-badge-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="badge-013"]{
display:inline-flex;align-items:center;gap:0.375em;
max-width:100%;box-sizing:border-box;
height:1.75rem;padding:0 0.6875rem;
border:1px solid var(--vibeui-badge-013-border);border-radius:9999px;
background:var(--vibeui-badge-013-bg);color:var(--vibeui-badge-013-fg);
font-family:var(--vibeui-badge-013-font);font-size:0.75rem;font-weight:600;line-height:1;
vertical-align:middle;
}
[data-vibeui-block="badge-013"] [data-part="icon"]{
/* Размер в em, а не в rem: знак обязан ехать вместе с подписью. */
width:1em;height:1em;flex:none;
margin-top:-0.0625em;
color:var(--vibeui-badge-013-mark);
}
[data-vibeui-block="badge-013"] [data-part="text"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="badge-013"][data-tone="positive"]{--vibeui-badge-013-hue:150;--vibeui-badge-013-chroma:0.05}
[data-vibeui-block="badge-013"][data-tone="warning"]{--vibeui-badge-013-hue:75;--vibeui-badge-013-chroma:0.07}
[data-vibeui-block="badge-013"][data-tone="accent"]{--vibeui-badge-013-hue:265;--vibeui-badge-013-chroma:0.06}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-013"] *{animation:none!important;transition:none!important}}
`

const ICONS: Record<Badge013Icon, ReactNode> = {
  check: <path d="M4 12.5 9 17.5 20 6.5" />,
  clock: <path d="M12 6.5V12l4 2.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
  alert: <path d="M12 4.5v9m0 4.5v.5M12 4.5 12 4.5" />,
  spark: <path d="M12 3.5 14 10l6.5 2-6.5 2-2 6.5-2-6.5L3.5 12l6.5-2 2-6.5Z" />,
}

/**
 * Плашка со знаком слева: иконка масштабируется вместе с текстом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge013({
  icon = "check",
  tone = "positive",
  className,
  style,
  children = "Оплачено",
  ...props
}: Badge013Props) {
  return (
    <>
      <style href="vibeui-badge-013" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="badge-013"
        data-tone={tone}
        className={className}
        style={style as CSSProperties}
      >
        <svg
          data-part="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          {ICONS[icon]}
        </svg>
        <span data-part="text">{children}</span>
      </span>
    </>
  )
}
