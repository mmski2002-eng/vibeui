import type { ComponentProps, CSSProperties } from "react"

export type Icontile001Props = Omit<
  ComponentProps<"span">,
  "children" | "color"
> & {
  glyph?: string
  label?: string
  tone?: "neutral" | "accent" | "success" | "warning" | "danger"
  size?: "sm" | "md" | "lg"
  shape?: "square" | "circle"
}

// Идея компонента: подложка под иконку. Иконка сама по себе теряется в тексте,
// а плитка задаёт ей постоянный размер и место, поэтому список пунктов не
// прыгает, когда иконки разной ширины. Тон задаётся одной парой переменных —
// фон и цвет знака считаются от общего оттенка, а не подбираются вручную.
// Плитка декоративна: она скрыта от скринридера, а смысл несёт подпись рядом.
//
// Обе ветки темы считаются от того же оттенка: в тёмной заливка уходит вниз
// по светлоте, а знак — вверх, поэтому пара остаётся контрастной и не
// требует второго набора цветов.
const STYLES = `
:where([data-vibeui-block="icontile-001"]){
--vibeui-icontile-001-size:2.5rem;
--vibeui-icontile-001-hue:265;
--vibeui-icontile-001-chroma:0.02;
--vibeui-icontile-001-radius:0.75rem;
--vibeui-icontile-001-fill:light-dark(oklch(0.94 var(--vibeui-icontile-001-chroma) var(--vibeui-icontile-001-hue)),oklch(0.33 calc(var(--vibeui-icontile-001-chroma) * 1.7) var(--vibeui-icontile-001-hue)));
--vibeui-icontile-001-mark:light-dark(oklch(0.45 calc(var(--vibeui-icontile-001-chroma) * 4) var(--vibeui-icontile-001-hue)),oklch(0.89 calc(var(--vibeui-icontile-001-chroma) * 2.4) var(--vibeui-icontile-001-hue)));
--vibeui-icontile-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="icontile-001"]{color-scheme:dark}
/* Фон и знак считаются от одного оттенка: пара цветов не подбирается руками. */
[data-vibeui-block="icontile-001"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:var(--vibeui-icontile-001-size);height:var(--vibeui-icontile-001-size);
border-radius:var(--vibeui-icontile-001-radius);
background:var(--vibeui-icontile-001-fill);
color:var(--vibeui-icontile-001-mark);
font-family:var(--vibeui-icontile-001-font);
font-size:calc(var(--vibeui-icontile-001-size) * 0.44);
font-weight:650;line-height:1;
}
[data-vibeui-block="icontile-001"][data-shape="circle"]{--vibeui-icontile-001-radius:9999px}
[data-vibeui-block="icontile-001"][data-size="sm"]{--vibeui-icontile-001-size:2rem;--vibeui-icontile-001-radius:0.625rem}
[data-vibeui-block="icontile-001"][data-size="lg"]{--vibeui-icontile-001-size:3.25rem;--vibeui-icontile-001-radius:1rem}
[data-vibeui-block="icontile-001"][data-tone="accent"]{--vibeui-icontile-001-hue:262;--vibeui-icontile-001-chroma:0.05}
[data-vibeui-block="icontile-001"][data-tone="success"]{--vibeui-icontile-001-hue:152;--vibeui-icontile-001-chroma:0.045}
[data-vibeui-block="icontile-001"][data-tone="warning"]{--vibeui-icontile-001-hue:75;--vibeui-icontile-001-chroma:0.05}
[data-vibeui-block="icontile-001"][data-tone="danger"]{--vibeui-icontile-001-hue:25;--vibeui-icontile-001-chroma:0.05}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="icontile-001"]{transition:none!important}}
`

/**
 * Плитка под иконку: постоянный размер и тон из одного оттенка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Icontile001({
  glyph = "◆",
  label,
  tone = "accent",
  size = "md",
  shape = "square",
  className,
  style,
  ...props
}: Icontile001Props) {
  return (
    <>
      <style href="vibeui-icontile-001" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="icon-tile"
        data-vibeui-block="icontile-001"
        data-tone={tone}
        data-size={size}
        data-shape={shape}
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        className={className}
        style={style as CSSProperties}
      >
        {glyph}
      </span>
    </>
  )
}
