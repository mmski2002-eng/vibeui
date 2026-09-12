import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Mockup006Props = Omit<ComponentProps<"figure">, "children"> & {
  /** Кадр экрана. Без него экран берёт children, а без них — заглушку. */
  src?: string
  alt?: string
  /** Живое содержимое экрана: любая разметка вместо картинки. */
  children?: ReactNode
  /**
   * Фото корпуса: PNG или WebP с прозрачным вырезом экрана. Вырез должен
   * совпадать с переменными --vibeui-mockup-006-screen-* (доли кадра фото).
   */
  frame?: string
  /** Блик на стекле экрана. */
  glare?: boolean
  /** Мягкая тень под корпусом. */
  shadow?: boolean
  /** Подпись под устройством. */
  caption?: string
}

// Идея: фото умных часов под квадратный кадр. Корпус, колёсико и
// ремешок — из фото, под вырезом — кадр или заглушка-циферблат: время,
// дата и три кольца активности на conic-gradient.
const STYLES = `
:where([data-vibeui-block="mockup-006"]){
--vibeui-mockup-006-fg:light-dark(oklch(0.25 0.014 265),oklch(0.95 0.005 265));
--vibeui-mockup-006-muted:color-mix(in oklab,var(--vibeui-mockup-006-fg) 62%,transparent);
--vibeui-mockup-006-screen-bg:oklch(0.2 0.01 265);
--vibeui-mockup-006-shadow:light-dark(oklch(0 0 0 / 0.35),oklch(0 0 0 / 0.65));
--vibeui-mockup-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
/* Вырез экрана в фото корпуса, доли от кадра фото. */
--vibeui-mockup-006-screen-left:11.38%;
--vibeui-mockup-006-screen-top:21.2%;
--vibeui-mockup-006-screen-width:72.57%;
--vibeui-mockup-006-screen-height:52.75%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="mockup-006"]{color-scheme:dark}
[data-vibeui-block="mockup-006"]{
display:block;box-sizing:border-box;margin:0 auto;width:100%;max-width:14rem;
container-type:inline-size;
color:var(--vibeui-mockup-006-fg);font-family:var(--vibeui-mockup-006-font);
}
[data-vibeui-block="mockup-006"] *{box-sizing:border-box}
[data-vibeui-block="mockup-006"] [data-part="device"]{
position:relative;isolation:isolate;width:100%;aspect-ratio:791/1236;
}
/* Корпус — верхний слой: прозрачный вырез открывает экран под ним. */
[data-vibeui-block="mockup-006"] [data-part="frame"]{
position:absolute;inset:0;z-index:2;display:block;width:100%;height:100%;
pointer-events:none;user-select:none;
}
[data-vibeui-block="mockup-006"] [data-part="screen"]{
position:absolute;z-index:1;overflow:hidden;isolation:isolate;
left:var(--vibeui-mockup-006-screen-left);top:var(--vibeui-mockup-006-screen-top);
width:var(--vibeui-mockup-006-screen-width);height:var(--vibeui-mockup-006-screen-height);
background:var(--vibeui-mockup-006-screen-bg);
}
[data-vibeui-block="mockup-006"] [data-part="screen"] > img{
display:block;width:100%;height:100%;object-fit:cover;object-position:top center;
}
[data-vibeui-block="mockup-006"] [data-part="content"]{position:absolute;inset:0;overflow:hidden}
[data-vibeui-block="mockup-006"] [data-part="glare"]{
position:absolute;inset:0;z-index:1;pointer-events:none;
background:radial-gradient(ellipse at 25% 15%,oklch(1 0 0 / 0.2),transparent 45%);
}
/* Заглушка: циферблат с кольцами активности. */
[data-vibeui-block="mockup-006"] [data-part="face"]{
position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
gap:2cqw;padding:6cqw;color:oklch(1 0 0);background:oklch(0.05 0 0);
}
[data-vibeui-block="mockup-006"] [data-part="time"]{
font-size:16cqw;font-weight:500;line-height:1;letter-spacing:-0.03em;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="mockup-006"] [data-part="date"]{
font-size:5cqw;color:oklch(0.62 0.2 25);font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
}
[data-vibeui-block="mockup-006"] [data-part="rings"]{
position:relative;width:26cqw;aspect-ratio:1;margin-top:2cqw;
}
/* Кольца — соседи, а не вложение: mask родителя срезала бы внутренние. */
[data-vibeui-block="mockup-006"] [data-part="rings"] > i{
position:absolute;inset:0;border-radius:50%;
background:conic-gradient(oklch(0.68 0.24 15) 0 78%,oklch(0.68 0.24 15 / 0.2) 78%);
-webkit-mask:radial-gradient(circle,transparent 62%,#000 63%);
mask:radial-gradient(circle,transparent 62%,#000 63%);
}
[data-vibeui-block="mockup-006"] [data-part="rings"] > i:nth-child(2){
inset:16%;
background:conic-gradient(oklch(0.85 0.22 130) 0 55%,oklch(0.85 0.22 130 / 0.2) 55%);
-webkit-mask:radial-gradient(circle,transparent 60%,#000 61%);
mask:radial-gradient(circle,transparent 60%,#000 61%);
}
[data-vibeui-block="mockup-006"] [data-part="rings"] > i:nth-child(3){
inset:32%;
background:conic-gradient(oklch(0.82 0.16 200) 0 32%,oklch(0.82 0.16 200 / 0.2) 32%);
-webkit-mask:radial-gradient(circle,transparent 58%,#000 59%);
mask:radial-gradient(circle,transparent 58%,#000 59%);
}
/* Тень: плотная под серединой, растянутая к краям — как от предмета на
   столе, а не от плоской карточки. */
[data-vibeui-block="mockup-006"] [data-part="shadow"]{
position:absolute;z-index:0;border-radius:50%;
left:14%;right:14%;bottom:-1cqw;height:6cqw;filter:blur(1.6cqw);
background:radial-gradient(ellipse at center,var(--vibeui-mockup-006-shadow),transparent 70%);
}
[data-vibeui-block="mockup-006"] figcaption{
margin-top:1.25rem;text-align:center;
font-size:0.875rem;line-height:1.4;color:var(--vibeui-mockup-006-muted);
}
`

/**
 * Умные часы с фото-корпусом: кадр или живая разметка под стеклом, циферблат-заглушка с кольцами.
 * Один файл, ноль зависимостей: корпус — фото с прозрачным вырезом.
 */
export function Mockup006({
  src,
  alt = "",
  children,
  frame,
  glare = true,
  shadow = true,
  caption,
  className,
  style,
  ...props
}: Mockup006Props) {
  return (
    <>
      <style href="vibeui-mockup-006" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="mockup"
        data-vibeui-block="mockup-006"
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="device">
          <div data-part="screen">
            {src ? (
              <img src={src} alt={alt} loading="lazy" decoding="async" />
            ) : children ? (
              <div data-part="content">{children}</div>
            ) : (
              <div data-part="face" aria-hidden="true">
                <span data-part="date">Пт 12</span>
                <span data-part="time">10:09</span>
                <span data-part="rings">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            )}
            {glare ? <span data-part="glare" aria-hidden="true" /> : null}
          </div>
          <img
            data-part="frame"
            src={frame ?? "/demo/devices/watch-front.webp"}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
          {shadow ? <span data-part="shadow" aria-hidden="true" /> : null}
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </>
  )
}
