import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Frame011Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "title"
> & {
  tilt?: "left" | "right"
  caption?: string
  children?: ReactNode
}

// Идея компонента: кадр с 3D-разворотом скриншота — perspective и
// rotateX/rotateY имитируют вид на экран сбоку, приём для hero-секций
// продукта. Угол разворота живёт в data-tilt, а не в инлайн-стиле: так его
// можно переопределить в CSS, не трогая разметку. При наведении разворот
// слегка выравнивается — «экран поворачивается к посетителю» — эффект
// чисто CSS-псевдоклассом, без JS, и гасится по prefers-reduced-motion.
const STYLES = `
:where([data-vibeui-block="frame-011"]){
--vibeui-frame-011-bg:oklch(1 0 0);
--vibeui-frame-011-fg:oklch(0.24 0.014 265);
--vibeui-frame-011-muted:oklch(0.55 0.014 265);
--vibeui-frame-011-border:oklch(0.88 0.006 265);
--vibeui-frame-011-shadow:oklch(0.2 0.02 265 / 0.28);
--vibeui-frame-011-radius:0.875rem;
--vibeui-frame-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="frame-011"]{
display:block;margin:0;width:100%;max-width:28rem;box-sizing:border-box;
font-family:var(--vibeui-frame-011-font);color:var(--vibeui-frame-011-fg);
}
[data-vibeui-block="frame-011"] *{box-sizing:border-box}
[data-vibeui-block="frame-011"] [data-part="stage"]{
padding:2.5rem 1.5rem;
perspective:56rem;
}
[data-vibeui-block="frame-011"] [data-part="card"]{
overflow:hidden;
background:var(--vibeui-frame-011-bg);
border:1px solid var(--vibeui-frame-011-border);
border-radius:var(--vibeui-frame-011-radius);
box-shadow:1.5rem 1.75rem 3rem var(--vibeui-frame-011-shadow);
transform:rotateX(8deg) rotateY(-20deg);
transition:transform 0.4s ease;
}
[data-vibeui-block="frame-011"][data-tilt="right"] [data-part="card"]{transform:rotateX(8deg) rotateY(20deg)}
[data-vibeui-block="frame-011"] [data-part="stage"]:hover [data-part="card"]{transform:rotateX(3deg) rotateY(-8deg)}
[data-vibeui-block="frame-011"][data-tilt="right"] [data-part="stage"]:hover [data-part="card"]{transform:rotateX(3deg) rotateY(8deg)}
[data-vibeui-block="frame-011"] [data-part="bar"]{
display:flex;align-items:center;gap:0.375rem;
padding:0.625rem 0.75rem;
border-bottom:1px solid var(--vibeui-frame-011-border);
}
[data-vibeui-block="frame-011"] [data-part="dot"]{width:0.5rem;height:0.5rem;border-radius:9999px;background:var(--vibeui-frame-011-border)}
[data-vibeui-block="frame-011"] [data-part="body"]{display:block}
[data-vibeui-block="frame-011"] [data-part="body"] > *{display:block;width:100%}
[data-vibeui-block="frame-011"] img{display:block;width:100%;height:auto}
[data-vibeui-block="frame-011"] [data-part="stub"]{
display:grid;place-items:center;gap:0.5rem;
min-height:9rem;padding:1.5rem;text-align:center;
font-size:0.8125rem;color:var(--vibeui-frame-011-muted);
}
[data-vibeui-block="frame-011"] figcaption{
margin-top:1rem;font-size:0.75rem;line-height:1.4;
color:var(--vibeui-frame-011-muted);text-align:center;
}
@container (max-width: 22rem){
[data-vibeui-block="frame-011"] [data-part="stage"]{padding:1.75rem 1rem}
[data-vibeui-block="frame-011"] [data-part="card"]{transform:rotateX(5deg) rotateY(-12deg)}
[data-vibeui-block="frame-011"][data-tilt="right"] [data-part="card"]{transform:rotateX(5deg) rotateY(12deg)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="frame-011"] *{transition:none!important}
}
`

/**
 * Кадр с 3D-разворотом скриншота: perspective и rotateX/rotateY имитируют
 * вид на экран сбоку. Один файл, ноль зависимостей, собственная палитра.
 */
export function Frame011({
  tilt = "left",
  caption = "Кадр с разворотом в перспективе для hero-секции",
  children,
  className,
  style,
  ...props
}: Frame011Props) {
  return (
    <>
      <style href="vibeui-frame-011" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="frame-011"
        data-tilt={tilt}
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="stage">
          <div data-part="card">
            <div data-part="bar" aria-hidden="true">
              <span data-part="dot" />
              <span data-part="dot" />
              <span data-part="dot" />
            </div>
            <div data-part="body">
              {children ?? <div data-part="stub">Скриншот интерфейса</div>}
            </div>
          </div>
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </>
  )
}
