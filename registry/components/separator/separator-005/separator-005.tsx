import type { ComponentProps, CSSProperties } from "react"

export type Separator005Props = Omit<ComponentProps<"div">, "children"> & {
  glyph?: string
  tone?: "neutral" | "accent"
  label?: string
  /** Цвет линий и рамки кружка. Пусто — цвет из палитры компонента. */
  line?: string
}

// Идея компонента: разделитель со знаком в центре. Знак сидит в кружке со
// своей заливкой, поэтому линия не просвечивает сквозь него ни на светлом,
// ни на тёмном фоне. Знак декоративен и скрыт от скринридера: смысл границы
// несёт role="separator" с подписью, а «✦» вслух ничего не сообщает.
//
// Обе ветки палитры объявлены через light-dark(): кружок темнеет вместе с
// окружением и остаётся плотнее линии, а не выпадает белой наклейкой.
const STYLES = `
:where([data-vibeui-block="separator-005"]){
--vibeui-separator-005-line:light-dark(oklch(0.87 0.006 265),oklch(0.37 0.012 265));
--vibeui-separator-005-disc:light-dark(oklch(1 0 0),oklch(0.26 0.01 265));
--vibeui-separator-005-fg:light-dark(oklch(0.45 0.014 265),oklch(0.86 0.01 265));
--vibeui-separator-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="separator-005"]{color-scheme:dark}
[data-vibeui-block="separator-005"]{
display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:0.75rem;
width:100%;max-width:22rem;box-sizing:border-box;
font-family:var(--vibeui-separator-005-font);
}
[data-vibeui-block="separator-005"] [data-part="line"]{
height:1px;background:var(--vibeui-separator-005-line);
}
/* Кружок со своей заливкой: линия не просвечивает сквозь знак. */
[data-vibeui-block="separator-005"] [data-part="disc"]{
display:grid;place-items:center;
width:1.75rem;height:1.75rem;box-sizing:border-box;
border-radius:9999px;
background:var(--vibeui-separator-005-disc);
border:1px solid var(--vibeui-separator-005-line);
color:var(--vibeui-separator-005-fg);
font-size:0.75rem;line-height:1;
}
[data-vibeui-block="separator-005"][data-tone="accent"]{
--vibeui-separator-005-disc:light-dark(oklch(0.94 0.05 262),oklch(0.31 0.07 262));
--vibeui-separator-005-line:light-dark(oklch(0.85 0.05 262),oklch(0.47 0.09 262));
--vibeui-separator-005-fg:light-dark(oklch(0.45 0.16 262),oklch(0.85 0.11 262));
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="separator-005"] *{animation:none!important;transition:none!important}}
`

/**
 * Разделитель со знаком в кружке посередине линии.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Separator005({
  glyph = "✦",
  tone = "neutral",
  label = "Конец раздела",
  line = "",
  className,
  style,
  ...props
}: Separator005Props) {
  const palette = {
    ...(line ? { "--vibeui-separator-005-line": line } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-separator-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="separator"
        data-vibeui-block="separator-005"
        data-tone={tone}
        role="separator"
        aria-label={label}
        className={className}
        style={palette}
      >
        <span data-part="line" />
        <span data-part="disc" aria-hidden="true">
          {glyph}
        </span>
        <span data-part="line" />
      </div>
    </>
  )
}
