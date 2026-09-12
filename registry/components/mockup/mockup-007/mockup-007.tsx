import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Mockup007Props = Omit<ComponentProps<"figure">, "children"> & {
  /** Кадр экрана. Без него экран берёт children, а без них — заглушку. */
  src?: string
  alt?: string
  /** Живое содержимое экрана: любая разметка вместо картинки. */
  children?: ReactNode
  /**
   * Фото корпуса под углом с прозрачным вырезом экрана. Четыре угла выреза
   * зашиты в матрицу --vibeui-mockup-007-screen-matrix.
   */
  frame?: string
  /** Разворот: влево — как снято, вправо — зеркало. */
  angle?: "left" | "right"
  /** Блик на стекле экрана. */
  glare?: boolean
  /** Мягкая тень под корпусом. */
  shadow?: boolean
  /** Подпись под ноутбуком. */
  caption?: string
}

// Идея: ноутбук под углом с фото-корпусом. Экран в фото — не прямоугольник,
// а четырёхугольник, поэтому кадр укладывается в него гомографией:
// matrix3d переводит прямоугольник кадра в четыре угла выреза. Матрица
// считана в пикселях исходного фото, и чтобы она не зависела от ширины
// компонента, сцена рисуется в этих же пикселях и масштабируется целиком
// через tan(atan2()) — единственный способ получить число из отношения
// двух длин без деления в calc(). Правый разворот — зеркало сцены, а
// содержимое экрана зеркалится обратно, чтобы текст не перевернулся.
const FRAME_WIDTH = 1385
const FRAME_HEIGHT = 1024

const STYLES = `
:where([data-vibeui-block="mockup-007"]){
--vibeui-mockup-007-fg:light-dark(oklch(0.25 0.014 265),oklch(0.95 0.005 265));
--vibeui-mockup-007-muted:color-mix(in oklab,var(--vibeui-mockup-007-fg) 62%,transparent);
--vibeui-mockup-007-screen-bg:oklch(0.2 0.01 265);
--vibeui-mockup-007-shadow:light-dark(oklch(0 0 0 / 0.4),oklch(0 0 0 / 0.7));
--vibeui-mockup-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
/* Гомография: прямоугольник ${FRAME_WIDTH}×${FRAME_HEIGHT} → четыре угла выреза в фото. */
--vibeui-mockup-007-screen-matrix:matrix3d(0.627908,-0.0564302,0,0.0000734849,0.0852715,0.53019,0,-0.00000451971,0,0,1,0,48.0595,120.013,0,1);
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="mockup-007"]{color-scheme:dark}
[data-vibeui-block="mockup-007"]{
display:block;box-sizing:border-box;margin:0 auto;width:100%;max-width:48rem;
container-type:inline-size;
color:var(--vibeui-mockup-007-fg);font-family:var(--vibeui-mockup-007-font);
}
[data-vibeui-block="mockup-007"] *{box-sizing:border-box}
[data-vibeui-block="mockup-007"] [data-part="device"]{
position:relative;isolation:isolate;width:100%;aspect-ratio:${FRAME_WIDTH}/${FRAME_HEIGHT};
overflow:hidden;
}
/* Сцена в пикселях фото, масштаб — отношение ширины компонента к ширине фото. */
[data-vibeui-block="mockup-007"] [data-part="scene"]{
position:absolute;left:0;top:0;width:${FRAME_WIDTH}px;height:${FRAME_HEIGHT}px;
transform-origin:0 0;transform:scale(tan(atan2(100cqw,${FRAME_WIDTH}px)));
}
[data-vibeui-block="mockup-007"] [data-part="mirror"]{
position:absolute;inset:0;
}
[data-vibeui-block="mockup-007"][data-angle="right"] [data-part="mirror"]{transform:scaleX(-1)}
[data-vibeui-block="mockup-007"] [data-part="frame"]{
position:absolute;inset:0;z-index:2;display:block;width:100%;height:100%;
pointer-events:none;user-select:none;
}
[data-vibeui-block="mockup-007"] [data-part="screen"]{
position:absolute;left:0;top:0;z-index:1;overflow:hidden;isolation:isolate;
width:${FRAME_WIDTH}px;height:${FRAME_HEIGHT}px;
transform-origin:0 0;transform:var(--vibeui-mockup-007-screen-matrix);
background:var(--vibeui-mockup-007-screen-bg);
}
/* Зеркало сцены переворачивает и экран: содержимое зеркалим обратно. */
[data-vibeui-block="mockup-007"][data-angle="right"] [data-part="screen"] > *{transform:scaleX(-1)}
[data-vibeui-block="mockup-007"] [data-part="screen"] > img{
display:block;width:100%;height:100%;object-fit:cover;object-position:top center;
}
[data-vibeui-block="mockup-007"] [data-part="content"]{position:absolute;inset:0;overflow:hidden;font-size:1.6rem}
[data-vibeui-block="mockup-007"] [data-part="glare"]{
position:absolute;inset:0;z-index:1;pointer-events:none;
background:linear-gradient(115deg,oklch(1 0 0 / 0.14) 0%,oklch(1 0 0 / 0.05) 28%,transparent 46%);
}
/* Заглушка в пикселях сцены: она внутри масштабируемого слоя. */
[data-vibeui-block="mockup-007"] [data-part="placeholder"]{
position:absolute;inset:0;display:grid;place-items:center;
background:
  radial-gradient(ellipse at 20% 15%,oklch(0.7 0.16 300 / 0.9),transparent 55%),
  radial-gradient(ellipse at 85% 80%,oklch(0.72 0.15 200 / 0.85),transparent 55%),
  linear-gradient(160deg,oklch(0.35 0.08 280),oklch(0.22 0.06 250));
}
[data-vibeui-block="mockup-007"] [data-part="window"]{
width:62%;aspect-ratio:16/10;border-radius:14px;overflow:hidden;
background:oklch(1 0 0 / 0.92);
box-shadow:0 28px 56px -20px oklch(0 0 0 / 0.5);
}
[data-vibeui-block="mockup-007"] [data-part="titlebar"]{
display:flex;gap:8px;padding:14px 16px;
background:oklch(0.94 0.003 265);border-bottom:1px solid oklch(0.85 0.003 265);
}
[data-vibeui-block="mockup-007"] [data-part="titlebar"] > i{
width:14px;height:14px;border-radius:50%;background:oklch(0.78 0.16 25);
}
[data-vibeui-block="mockup-007"] [data-part="titlebar"] > i:nth-child(2){background:oklch(0.85 0.16 85)}
[data-vibeui-block="mockup-007"] [data-part="titlebar"] > i:nth-child(3){background:oklch(0.78 0.17 145)}
[data-vibeui-block="mockup-007"] [data-part="lines"]{display:grid;gap:15px;padding:28px 34px}
[data-vibeui-block="mockup-007"] [data-part="lines"] > i{
display:block;height:15px;border-radius:14px;background:oklch(0.86 0.005 265);
}
[data-vibeui-block="mockup-007"] [data-part="lines"] > i:nth-child(1){width:38%;height:25px;background:oklch(0.55 0.02 265)}
[data-vibeui-block="mockup-007"] [data-part="lines"] > i:nth-child(3){width:82%}
[data-vibeui-block="mockup-007"] [data-part="lines"] > i:nth-child(4){width:64%}
[data-vibeui-block="mockup-007"] [data-part="shadow"]{
position:absolute;left:6%;right:6%;bottom:0.5cqw;height:5cqw;z-index:0;
border-radius:50%;
background:radial-gradient(ellipse at center,var(--vibeui-mockup-007-shadow),transparent 70%);
filter:blur(1.4cqw);
}
[data-vibeui-block="mockup-007"] figcaption{
margin-top:1rem;text-align:center;
font-size:0.875rem;line-height:1.4;color:var(--vibeui-mockup-007-muted);
}
`

/**
 * Ноутбук под углом с фото-корпусом: кадр укладывается в четырёхугольник
 * выреза гомографией, два разворота. Один файл, ноль зависимостей.
 */
export function Mockup007({
  src,
  alt = "",
  children,
  frame = "/demo/devices/laptop-angle.webp",
  angle = "left",
  glare = true,
  shadow = true,
  caption,
  className,
  style,
  ...props
}: Mockup007Props) {
  return (
    <>
      <style href="vibeui-mockup-007" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="mockup"
        data-vibeui-block="mockup-007"
        data-angle={angle}
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="device">
          {shadow ? <span data-part="shadow" aria-hidden="true" /> : null}
          <div data-part="scene">
            <div data-part="mirror">
              <div data-part="screen">
                {src ? (
                  <img src={src} alt={alt} loading="lazy" decoding="async" />
                ) : children ? (
                  <div data-part="content">{children}</div>
                ) : (
                  <div data-part="placeholder" aria-hidden="true">
                    <div data-part="window">
                      <div data-part="titlebar">
                        <i />
                        <i />
                        <i />
                      </div>
                      <div data-part="lines">
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                    </div>
                  </div>
                )}
                {glare ? <span data-part="glare" aria-hidden="true" /> : null}
              </div>
              <img
                data-part="frame"
                src={frame}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </>
  )
}
