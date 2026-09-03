import type { ComponentProps, CSSProperties } from "react"

export type Icontile002Props = Omit<
  ComponentProps<"span">,
  "children" | "color"
> & {
  glyph?: string
  hue?: number
  size?: "sm" | "md" | "lg"
  label?: string
}

// Идея компонента: градиентная плитка, у которой весь цвет считается от
// одного числа — угла оттенка. Второй край градиента берётся сдвигом на 32°
// по тому же кругу, поэтому пара всегда согласована и её нельзя испортить
// случайным подбором. Светлая рамка внутри (inset-тень) отделяет плитку от
// тёмного фона: без неё градиент на тёмной подложке теряет границу.
const STYLES = `
:where([data-vibeui-block="icontile-002"]){
--vibeui-icontile-002-hue:262;
--vibeui-icontile-002-size:2.75rem;
--vibeui-icontile-002-radius:0.875rem;
--vibeui-icontile-002-edge:light-dark(oklch(1 0 0 / 24%),oklch(1 0 0 / 38%));
--vibeui-icontile-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="icontile-002"]{color-scheme:dark}
/* Оба края градиента считаются от одного угла: пару нельзя рассогласовать. */
[data-vibeui-block="icontile-002"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
box-sizing:border-box;
width:var(--vibeui-icontile-002-size);height:var(--vibeui-icontile-002-size);
border-radius:var(--vibeui-icontile-002-radius);
background:linear-gradient(145deg,
oklch(0.72 0.17 var(--vibeui-icontile-002-hue)) 0%,
oklch(0.5 0.19 calc(var(--vibeui-icontile-002-hue) + 32)) 100%);
box-shadow:inset 0 0 0 1px var(--vibeui-icontile-002-edge);
/* Глиф светлый в обеих темах: под ним насыщенный градиент, а не подложка страницы. */
color:oklch(0.99 0.01 var(--vibeui-icontile-002-hue));
font-family:var(--vibeui-icontile-002-font);
font-size:calc(var(--vibeui-icontile-002-size) * 0.42);
font-weight:650;line-height:1;
}
[data-vibeui-block="icontile-002"][data-size="sm"]{--vibeui-icontile-002-size:2rem;--vibeui-icontile-002-radius:0.625rem}
[data-vibeui-block="icontile-002"][data-size="lg"]{--vibeui-icontile-002-size:3.5rem;--vibeui-icontile-002-radius:1.125rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="icontile-002"]{animation:none!important;transition:none!important}}
`

/**
 * Градиентная плитка под иконку: обе точки градиента считаются от hue.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Icontile002({
  glyph = "◆",
  hue = 262,
  size = "md",
  label,
  className,
  style,
  ...props
}: Icontile002Props) {
  const palette = {
    "--vibeui-icontile-002-hue": hue,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-icontile-002" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="icon-tile"
        data-vibeui-block="icontile-002"
        data-size={size}
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        className={className}
        style={palette}
      >
        {glyph}
      </span>
    </>
  )
}
