import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Icontile004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  glyph?: string
  shape?: "square" | "circle" | "squircle"
}

// Идея компонента: размерная шкала плитки как один экспонат. Три ступени
// считаются от одного шага: 2rem → 2.75rem → 3.5rem, а радиус и кегль знака
// берутся долей от размера, поэтому пропорции на всех ступенях одинаковые.
// Такой ряд нужен, чтобы выбрать размер глазами и не изобретать четвёртый.
const STYLES = `
:where([data-vibeui-block="icontile-004"]){
--vibeui-icontile-004-step:0.75rem;
--vibeui-icontile-004-hue:262;
--vibeui-icontile-004-surface:oklch(1 0 0);
--vibeui-icontile-004-border:oklch(0.9 0.006 265);
--vibeui-icontile-004-fg:oklch(0.26 0.014 265);
--vibeui-icontile-004-muted:oklch(0.56 0.014 265);
--vibeui-icontile-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: подписи ступеней тёмные. */
[data-vibeui-block="icontile-004"]{
display:inline-flex;align-items:flex-end;gap:1.25rem;
box-sizing:border-box;padding:1rem 1.25rem;
background:var(--vibeui-icontile-004-surface);
border:1px solid var(--vibeui-icontile-004-border);border-radius:1rem;
font-family:var(--vibeui-icontile-004-font);color:var(--vibeui-icontile-004-fg);
}
[data-vibeui-block="icontile-004"] [data-part="step"]{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
}
/* Радиус и кегль — доли размера: пропорции одинаковы на всех ступенях. */
[data-vibeui-block="icontile-004"] [data-part="tile"]{
display:grid;place-items:center;flex:none;
width:var(--vibeui-icontile-004-size);height:var(--vibeui-icontile-004-size);
border-radius:calc(var(--vibeui-icontile-004-size) * 0.28);
background:oklch(0.93 0.04 var(--vibeui-icontile-004-hue));
color:oklch(0.44 0.16 var(--vibeui-icontile-004-hue));
font-size:calc(var(--vibeui-icontile-004-size) * 0.42);
font-weight:650;line-height:1;
}
[data-vibeui-block="icontile-004"] [data-part="step"][data-size="sm"]{--vibeui-icontile-004-size:calc(var(--vibeui-icontile-004-step) * 2.667)}
[data-vibeui-block="icontile-004"] [data-part="step"][data-size="md"]{--vibeui-icontile-004-size:calc(var(--vibeui-icontile-004-step) * 3.667)}
[data-vibeui-block="icontile-004"] [data-part="step"][data-size="lg"]{--vibeui-icontile-004-size:calc(var(--vibeui-icontile-004-step) * 4.667)}
[data-vibeui-block="icontile-004"][data-shape="circle"] [data-part="tile"]{border-radius:9999px}
[data-vibeui-block="icontile-004"][data-shape="squircle"] [data-part="tile"]{border-radius:calc(var(--vibeui-icontile-004-size) * 0.44)}
[data-vibeui-block="icontile-004"] [data-part="name"]{
font-size:0.75rem;font-weight:650;letter-spacing:0.02em;
}
[data-vibeui-block="icontile-004"] [data-part="value"]{
font-size:0.6875rem;color:var(--vibeui-icontile-004-muted);
font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="icontile-004"] *{animation:none!important;transition:none!important}}
`

const STEPS = [
  { size: "sm", value: "32px" },
  { size: "md", value: "44px" },
  { size: "lg", value: "56px" },
] as const

/**
 * Размерная шкала плитки: три ступени от одного шага и общих пропорций.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Icontile004({
  glyph = "◆",
  shape = "square",
  className,
  style,
  ...props
}: Icontile004Props) {
  return (
    <>
      <style href="vibeui-icontile-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="icontile-004"
        data-shape={shape}
        className={className}
        style={style as CSSProperties}
      >
        {STEPS.map((step) => (
          <div key={step.size} data-part="step" data-size={step.size}>
            <span data-part="tile" aria-hidden="true">
              {glyph}
            </span>
            <span data-part="name">{step.size}</span>
            <span data-part="value">{step.value}</span>
          </div>
        ))}
      </div>
    </>
  )
}
