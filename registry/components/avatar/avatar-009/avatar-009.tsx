import type { ComponentProps, CSSProperties } from "react"

export type Avatar009Props = Omit<ComponentProps<"span">, "children"> & {
  name?: string
  /** Показать три точки: ассистент печатает ответ. */
  typing?: boolean
  size?: "sm" | "md" | "lg"
  accent?: string
}

// Идея компонента: аватар ассистента, который нельзя спутать с человеком.
// Форма скруглённого квадрата, градиент вместо фотографии и глиф вместо
// инициалов: человека в переписке обозначает круг, машину — нет. Точки
// «печатает» гасятся при prefers-reduced-motion, иначе они дёргают внимание.
const STYLES = `:where([data-vibeui-block="avatar-009"]){
--vibeui-avatar-009-size:2.5rem;
--vibeui-avatar-009-accent:light-dark(oklch(0.62 0.17 285),oklch(0.76 0.17 285));
--vibeui-avatar-009-fg:light-dark(oklch(0.99 0 285),oklch(0.94 0 285));
--vibeui-avatar-009-dot:light-dark(oklch(0.99 0 285),oklch(0.88 0 285));
--vibeui-avatar-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-009"]{
position:relative;display:inline-flex;align-items:center;justify-content:center;flex:none;
width:var(--vibeui-avatar-009-size);height:var(--vibeui-avatar-009-size);
vertical-align:middle;
/* Скруглённый квадрат вместо круга: круг в переписке значит человека. */
border-radius:calc(var(--vibeui-avatar-009-size) * 0.32);
background:
radial-gradient(120% 120% at 25% 15%,color-mix(in oklab,var(--vibeui-avatar-009-accent) 55%,oklch(1 0 0)),transparent 60%),
linear-gradient(140deg,var(--vibeui-avatar-009-accent),oklch(0.42 0.13 265));
color:var(--vibeui-avatar-009-fg);font-family:var(--vibeui-avatar-009-font);
}
[data-vibeui-block="avatar-009"][data-size="sm"]{--vibeui-avatar-009-size:2rem}
[data-vibeui-block="avatar-009"][data-size="lg"]{--vibeui-avatar-009-size:3.5rem}
/* Глиф: кольцо с точкой внутри — знак машины, а не буква имени. */
[data-vibeui-block="avatar-009"] [data-part="glyph"]{
position:relative;
width:calc(var(--vibeui-avatar-009-size) * 0.38);
height:calc(var(--vibeui-avatar-009-size) * 0.38);
border:2px solid currentColor;border-radius:9999px;opacity:.92;
}
[data-vibeui-block="avatar-009"] [data-part="glyph"]::after{
content:"";position:absolute;left:50%;top:50%;
width:0.25rem;height:0.25rem;margin:-0.125rem 0 0 -0.125rem;
border-radius:9999px;background:currentColor;
}
[data-vibeui-block="avatar-009"] [data-part="typing"]{
position:absolute;right:-0.25rem;bottom:-0.25rem;
display:flex;align-items:center;gap:0.125rem;
padding:0.1875rem 0.3125rem;border-radius:9999px;
background:light-dark(oklch(0.22 0 285),oklch(0.86 0 285));box-shadow:0 0 0 2px oklch(1 0 0 / 85%);
}
[data-vibeui-block="avatar-009"] [data-part="typing"] i{
width:0.1875rem;height:0.1875rem;border-radius:9999px;background:var(--vibeui-avatar-009-dot);
animation:vibeui-avatar-009-blink 1.1s ease-in-out infinite;
}
[data-vibeui-block="avatar-009"] [data-part="typing"] i:nth-child(2){animation-delay:.18s}
[data-vibeui-block="avatar-009"] [data-part="typing"] i:nth-child(3){animation-delay:.36s}
@keyframes vibeui-avatar-009-blink{
0%,100%{opacity:.35}
50%{opacity:1}
}
[data-vibeui-block="avatar-009"] [data-part="text"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-009"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="avatar-009"] *{animation:none!important;transition:none!important}
[data-vibeui-block="avatar-009"] [data-part="typing"] i{opacity:.8}
}
`

/**
 * Аватар ассистента: квадратная форма и глиф вместо инициалов.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar009({
  name = "Ассистент",
  typing = true,
  size = "md",
  accent,
  className,
  style,
  ...props
}: Avatar009Props) {
  const palette = {
    ...(accent ? { "--vibeui-avatar-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-009" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="avatar"
        data-vibeui-block="avatar-009"
        data-size={size}
        className={className}
        style={palette}
        role="img"
        aria-label={typing ? `${name} печатает ответ` : name}
      >
        <span data-part="glyph" aria-hidden="true" />
        {typing ? (
          <span data-part="typing" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        ) : null}
        <span data-part="text">{name}</span>
      </span>
    </>
  )
}
