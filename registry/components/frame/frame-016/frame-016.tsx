import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Frame016Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "title"
> & {
  time?: string
  subtitle?: string
  caption?: string
  /** Цвет корпуса часов. Пусто — металлик из палитры компонента. */
  caseColor?: string
  children?: ReactNode
}

// Идея компонента: кадр умных часов с круглым экраном — форма, которую не
// спутать с телефоном или планшетом. Ремешок нарисован двумя трапециями на
// clip-path сверху и снизу корпуса, тем же приёмом, что и основание ноутбука
// в frame-005: без изображений и без второго прямоугольника. Коронка сбоку —
// маленький прямоугольник в absolute за пределами круга корпуса. Корпус
// светлый металлик, а не тёмный силикон: тёмный силуэт растворился бы
// в тёмной подложке каталога, как и у телефона в frame-004.
const STYLES = `
:where([data-vibeui-block="frame-016"]){
--vibeui-frame-016-case:light-dark(oklch(0.88 0.006 265),oklch(0.52 0.008 265));
--vibeui-frame-016-case-edge:light-dark(oklch(0.74 0.008 265),oklch(0.63 0.01 265));
--vibeui-frame-016-strap:light-dark(oklch(0.8 0.006 265),oklch(0.43 0.008 265));
--vibeui-frame-016-screen:oklch(0.18 0.014 265);
--vibeui-frame-016-fg:oklch(0.97 0.004 95);
--vibeui-frame-016-muted:color-mix(in oklab,oklch(0.97 0.004 95) 60%,transparent);
--vibeui-frame-016-caption:light-dark(oklch(0.55 0.014 265),oklch(0.72 0.012 265));
--vibeui-frame-016-shadow:light-dark(oklch(0.2 0.02 265 / 0.22),oklch(0 0 0 / 0.5));
--vibeui-frame-016-size:11rem;
--vibeui-frame-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="frame-016"]{
display:block;margin:0;width:100%;box-sizing:border-box;
font-family:var(--vibeui-frame-016-font);
}
[data-vibeui-block="frame-016"] *{box-sizing:border-box}
[data-vibeui-block="frame-016"] [data-part="stage"]{
display:flex;justify-content:center;padding:2rem 1rem;
}
[data-vibeui-block="frame-016"] [data-part="device"]{
position:relative;
width:var(--vibeui-frame-016-size);
aspect-ratio:1 / 1;
}
[data-vibeui-block="frame-016"] [data-part="strap"]{
position:absolute;left:50%;transform:translateX(-50%);
width:56%;height:2.75rem;
background:var(--vibeui-frame-016-strap);
}
[data-vibeui-block="frame-016"] [data-part="strap"][data-pos="top"]{
top:-2.25rem;
clip-path:polygon(18% 100%,82% 100%,100% 0,0 0);
}
[data-vibeui-block="frame-016"] [data-part="strap"][data-pos="bottom"]{
bottom:-2.25rem;
clip-path:polygon(0 100%,100% 100%,82% 0,18% 0);
}
[data-vibeui-block="frame-016"] [data-part="case"]{
position:relative;z-index:1;
width:100%;height:100%;padding:0.5rem;
background:var(--vibeui-frame-016-case);
border:1px solid var(--vibeui-frame-016-case-edge);
border-radius:9999px;
box-shadow:0 0.75rem 1.5rem var(--vibeui-frame-016-shadow);
}
[data-vibeui-block="frame-016"] [data-part="crown"]{
position:absolute;top:38%;right:-0.3rem;
width:0.5rem;height:1.5rem;border-radius:0.2rem;
background:var(--vibeui-frame-016-case-edge);
}
[data-vibeui-block="frame-016"] [data-part="screen"]{
position:relative;overflow:hidden;
display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.25rem;
width:100%;height:100%;border-radius:9999px;
background:var(--vibeui-frame-016-screen);
color:var(--vibeui-frame-016-fg);
text-align:center;padding:0.75rem;
}
[data-vibeui-block="frame-016"] [data-part="screen"] > *{max-width:100%}
[data-vibeui-block="frame-016"] [data-part="time"]{
margin:0;font-size:1.75rem;font-weight:700;line-height:1;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="frame-016"] [data-part="subtitle"]{
margin:0;font-size:0.6875rem;color:var(--vibeui-frame-016-muted);
}
[data-vibeui-block="frame-016"] figcaption{
margin-top:0.75rem;padding:0 1rem;
font-size:0.75rem;line-height:1.4;text-align:center;
color:var(--vibeui-frame-016-caption);
}
@container (max-width: 18rem){
[data-vibeui-block="frame-016"] [data-part="device"]{width:9rem}
[data-vibeui-block="frame-016"] [data-part="time"]{font-size:1.375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="frame-016"] *{animation:none!important;transition:none!important}}
`

/**
 * Кадр умных часов с круглым экраном: ремешок на clip-path, коронка сбоку
 * и слот под содержимое циферблата. Один файл, ноль зависимостей.
 */
export function Frame016({
  time = "9:41",
  subtitle = "6 482 шага",
  caption = "Кадр умных часов с круглым экраном",
  caseColor,
  children,
  className,
  style,
  ...props
}: Frame016Props) {
  const palette = {
    ...(caseColor ? { "--vibeui-frame-016-case": caseColor } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-frame-016" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="frame-016"
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="device">
            <span data-part="strap" data-pos="top" aria-hidden="true" />
            <span data-part="strap" data-pos="bottom" aria-hidden="true" />
            <div data-part="case">
              <span data-part="crown" aria-hidden="true" />
              <div data-part="screen">
                {children ?? (
                  <>
                    <p data-part="time">{time}</p>
                    <p data-part="subtitle">{subtitle}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </>
  )
}
