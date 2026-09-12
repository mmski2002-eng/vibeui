import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Mockup009Props = Omit<ComponentProps<"figure">, "children"> & {
  /** Кадр переднего окна. Без него — children, а без них — заглушка. */
  src?: string
  alt?: string
  /** Кадры двух задних окон. Без них — заглушки. */
  backSrc?: string
  farSrc?: string
  /** Живое содержимое переднего окна. */
  children?: ReactNode
  /** Тема хрома окон. */
  theme?: "light" | "dark"
  /** Разлёт стопки: насколько задние окна выглядывают из-за переднего. */
  spread?: "tight" | "normal" | "wide"
  /** Мягкая тень под передним окном. */
  shadow?: boolean
  /** Подпись под стопкой. */
  caption?: string
}

// Идея: три окна браузера каскадом — показать несколько экранов продукта
// одним кадром. Переднее окно в полный размер, два задних сдвинуты вверх и
// влево, уменьшены и приглушены, поэтому глубина читается без 3D. Разлёт
// задаётся одной переменной: от неё считаются и сдвиг, и масштаб.
const STYLES = `
:where([data-vibeui-block="mockup-009"]){
--vibeui-mockup-009-spread:6cqw;
--vibeui-mockup-009-fg:light-dark(oklch(0.25 0.014 265),oklch(0.95 0.005 265));
--vibeui-mockup-009-muted:color-mix(in oklab,var(--vibeui-mockup-009-fg) 62%,transparent);
--vibeui-mockup-009-chrome:oklch(0.95 0.003 265);
--vibeui-mockup-009-chrome-fg:oklch(0.35 0.01 265);
--vibeui-mockup-009-chrome-line:oklch(0.85 0.005 265);
--vibeui-mockup-009-field:oklch(1 0 0);
--vibeui-mockup-009-screen-bg:oklch(0.98 0.002 265);
--vibeui-mockup-009-shadow:light-dark(oklch(0 0 0 / 0.3),oklch(0 0 0 / 0.6));
--vibeui-mockup-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="mockup-009"]{color-scheme:dark}
[data-vibeui-block="mockup-009"][data-chrome="dark"]{
--vibeui-mockup-009-chrome:oklch(0.26 0.006 265);
--vibeui-mockup-009-chrome-fg:oklch(0.9 0.005 265);
--vibeui-mockup-009-chrome-line:oklch(0.34 0.006 265);
--vibeui-mockup-009-field:oklch(0.32 0.006 265);
--vibeui-mockup-009-screen-bg:oklch(0.16 0.006 265);
}
[data-vibeui-block="mockup-009"][data-spread="tight"]{--vibeui-mockup-009-spread:3.5cqw}
[data-vibeui-block="mockup-009"][data-spread="wide"]{--vibeui-mockup-009-spread:9cqw}
[data-vibeui-block="mockup-009"]{
display:block;box-sizing:border-box;margin:0;width:100%;max-width:56rem;
container-type:inline-size;
color:var(--vibeui-mockup-009-fg);font-family:var(--vibeui-mockup-009-font);
}
[data-vibeui-block="mockup-009"] *{box-sizing:border-box}
[data-vibeui-block="mockup-009"] [data-part="stack"]{
position:relative;isolation:isolate;
padding:calc(var(--vibeui-mockup-009-spread) * 2) 0 0 calc(var(--vibeui-mockup-009-spread) * 2);
}
[data-vibeui-block="mockup-009"] [data-part="window"]{
position:relative;overflow:hidden;
border-radius:clamp(0.5rem,1.2cqw,0.75rem);
background:var(--vibeui-mockup-009-screen-bg);
box-shadow:0 0 0 1px oklch(0 0 0 / 0.12),inset 0 0 0 1px oklch(1 0 0 / 0.08);
transform-origin:0 0;
}
[data-vibeui-block="mockup-009"] [data-part="window"][data-depth="1"]{
position:absolute;inset:var(--vibeui-mockup-009-spread) auto auto var(--vibeui-mockup-009-spread);
width:calc(100% - var(--vibeui-mockup-009-spread) * 2);z-index:-1;
opacity:0.82;filter:brightness(0.92);
}
[data-vibeui-block="mockup-009"] [data-part="window"][data-depth="2"]{
position:absolute;inset:0 auto auto 0;
width:calc(100% - var(--vibeui-mockup-009-spread) * 2);z-index:-2;
opacity:0.6;filter:brightness(0.84);
}
[data-vibeui-block="mockup-009"][data-shadow="true"] [data-part="window"][data-depth="0"]{
box-shadow:
  0 0 0 1px oklch(0 0 0 / 0.12),inset 0 0 0 1px oklch(1 0 0 / 0.08),
  0 2.5cqw 5cqw -2cqw var(--vibeui-mockup-009-shadow),
  0 0.6cqw 1.4cqw -0.6cqw var(--vibeui-mockup-009-shadow);
}
[data-vibeui-block="mockup-009"] [data-part="bar"]{
display:flex;align-items:center;gap:clamp(0.375rem,0.9cqw,0.625rem);
padding:clamp(0.3rem,0.7cqw,0.5rem) clamp(0.5rem,1.1cqw,0.75rem);
background:var(--vibeui-mockup-009-chrome);
border-bottom:1px solid var(--vibeui-mockup-009-chrome-line);
}
[data-vibeui-block="mockup-009"] [data-part="lights"]{display:flex;gap:clamp(0.25rem,0.6cqw,0.45rem)}
[data-vibeui-block="mockup-009"] [data-part="lights"] > i{
width:clamp(0.45rem,1cqw,0.7rem);height:clamp(0.45rem,1cqw,0.7rem);border-radius:50%;
background:oklch(0.72 0.19 25);box-shadow:inset 0 0 0 1px oklch(0 0 0 / 0.12);
}
[data-vibeui-block="mockup-009"] [data-part="lights"] > i:nth-child(2){background:oklch(0.82 0.16 85)}
[data-vibeui-block="mockup-009"] [data-part="lights"] > i:nth-child(3){background:oklch(0.75 0.19 145)}
[data-vibeui-block="mockup-009"] [data-part="field"]{
flex:1;max-width:46%;margin:0 auto;height:clamp(0.9rem,2cqw,1.25rem);border-radius:999px;
background:var(--vibeui-mockup-009-field);
box-shadow:inset 0 0 0 1px var(--vibeui-mockup-009-chrome-line);
}
[data-vibeui-block="mockup-009"] [data-part="screen"]{
position:relative;overflow:hidden;width:100%;aspect-ratio:16/10;
}
[data-vibeui-block="mockup-009"] [data-part="screen"] > img{
display:block;width:100%;height:100%;object-fit:cover;object-position:top center;
}
[data-vibeui-block="mockup-009"] [data-part="content"]{position:absolute;inset:0;overflow:hidden}
/* Заглушки различаются раскладкой, чтобы стопка не выглядела копиями. */
[data-vibeui-block="mockup-009"] [data-part="placeholder"]{
position:absolute;inset:0;display:grid;gap:2.5cqw;padding:4cqw 6cqw;align-content:start;
}
[data-vibeui-block="mockup-009"] [data-part="placeholder"] > i{
display:block;border-radius:999px;
background:color-mix(in oklab,var(--vibeui-mockup-009-chrome-fg) 14%,transparent);
}
[data-vibeui-block="mockup-009"] [data-part="placeholder"] > i:nth-child(1){height:3.6cqw;width:52%;border-radius:0.8cqw;background:color-mix(in oklab,var(--vibeui-mockup-009-chrome-fg) 55%,transparent)}
[data-vibeui-block="mockup-009"] [data-part="placeholder"] > i:nth-child(2){height:1.3cqw;width:40%}
[data-vibeui-block="mockup-009"] [data-part="placeholder"] > i:nth-child(3){height:1.3cqw;width:32%}
[data-vibeui-block="mockup-009"] [data-part="placeholder"][data-layout="grid"]{
grid-template-columns:repeat(3,1fr);align-content:stretch;
}
[data-vibeui-block="mockup-009"] [data-part="placeholder"][data-layout="grid"] > i{
height:auto;border-radius:1cqw;width:auto;
background:color-mix(in oklab,var(--vibeui-mockup-009-chrome-fg) 10%,transparent);
}
[data-vibeui-block="mockup-009"] [data-part="placeholder"][data-layout="grid"] > i:nth-child(1){grid-column:1/-1;height:4cqw;background:color-mix(in oklab,var(--vibeui-mockup-009-chrome-fg) 40%,transparent)}
[data-vibeui-block="mockup-009"] [data-part="placeholder"][data-layout="split"]{
grid-template-columns:1fr 2fr;align-content:stretch;
}
[data-vibeui-block="mockup-009"] [data-part="placeholder"][data-layout="split"] > i{
height:auto;width:auto;border-radius:1cqw;grid-row:span 2;
background:color-mix(in oklab,var(--vibeui-mockup-009-chrome-fg) 10%,transparent);
}
[data-vibeui-block="mockup-009"] [data-part="placeholder"][data-layout="split"] > i:nth-child(1){grid-row:auto;height:3cqw;width:70%;background:color-mix(in oklab,var(--vibeui-mockup-009-chrome-fg) 40%,transparent)}
[data-vibeui-block="mockup-009"] figcaption{
margin-top:1.25rem;text-align:center;
font-size:0.875rem;line-height:1.4;color:var(--vibeui-mockup-009-muted);
}
`

/**
 * Стопка из трёх окон браузера на чистом CSS: три кадра одним блоком,
 * задние выглядывают из-за переднего. Один файл, ноль зависимостей.
 */
export function Mockup009({
  src,
  alt = "",
  backSrc,
  farSrc,
  children,
  theme = "light",
  spread = "normal",
  shadow = true,
  caption,
  className,
  style,
  ...props
}: Mockup009Props) {
  return (
    <>
      <style href="vibeui-mockup-009" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="mockup"
        data-vibeui-block="mockup-009"
        data-chrome={theme}
        data-spread={spread}
        data-shadow={shadow ? "true" : undefined}
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="stack">
          <div data-part="window" data-depth="2" aria-hidden="true">
            <div data-part="bar">
              <span data-part="lights">
                <i />
                <i />
                <i />
              </span>
              <span data-part="field" />
            </div>
            <div data-part="screen">
              {farSrc ? (
                <img src={farSrc} alt="" loading="lazy" decoding="async" />
              ) : (
                <div data-part="placeholder" data-layout="grid">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              )}
            </div>
          </div>
          <div data-part="window" data-depth="1" aria-hidden="true">
            <div data-part="bar">
              <span data-part="lights">
                <i />
                <i />
                <i />
              </span>
              <span data-part="field" />
            </div>
            <div data-part="screen">
              {backSrc ? (
                <img src={backSrc} alt="" loading="lazy" decoding="async" />
              ) : (
                <div data-part="placeholder" data-layout="split">
                  <i />
                  <i />
                  <i />
                </div>
              )}
            </div>
          </div>
          <div data-part="window" data-depth="0">
            <div data-part="bar" aria-hidden="true">
              <span data-part="lights">
                <i />
                <i />
                <i />
              </span>
              <span data-part="field" />
            </div>
            <div data-part="screen">
              {src ? (
                <img src={src} alt={alt} loading="lazy" decoding="async" />
              ) : children ? (
                <div data-part="content">{children}</div>
              ) : (
                <div data-part="placeholder" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
              )}
            </div>
          </div>
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </>
  )
}
