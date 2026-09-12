import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Mockup002Props = Omit<ComponentProps<"figure">, "children"> & {
  /** Кадр экрана. Без него экран берёт children, а без них — заглушку. */
  src?: string
  alt?: string
  /** Живое содержимое экрана: любая разметка вместо картинки. */
  children?: ReactNode
  /**
   * Фото корпуса: PNG или WebP с прозрачным вырезом экрана. Вырез должен
   * совпадать с переменными --vibeui-mockup-002-screen-* (доли кадра фото).
   */
  frame?: string
  /** Блик на стекле экрана. */
  glare?: boolean
  /** Мягкая тень под корпусом. */
  shadow?: boolean
  /** Подпись под устройством. */
  caption?: string
}

// Идея: фото смартфона с прозрачным вырезом под любой вертикальный
// скриншот. Кадр 9/19.5 кроется по верху, поверх него — блик, снаружи —
// корпус с клавишами и рамкой из фото. Пропорции корпуса берутся из кадра
// фото, размеры заглушки — в долях ширины компонента.
const STYLES = `
:where([data-vibeui-block="mockup-002"]){
--vibeui-mockup-002-fg:light-dark(oklch(0.25 0.014 265),oklch(0.95 0.005 265));
--vibeui-mockup-002-muted:color-mix(in oklab,var(--vibeui-mockup-002-fg) 62%,transparent);
--vibeui-mockup-002-screen-bg:oklch(0.2 0.01 265);
--vibeui-mockup-002-shadow:light-dark(oklch(0 0 0 / 0.35),oklch(0 0 0 / 0.65));
--vibeui-mockup-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
/* Вырез экрана в фото корпуса, доли от кадра фото. */
--vibeui-mockup-002-screen-left:7.85%;
--vibeui-mockup-002-screen-top:3.62%;
--vibeui-mockup-002-screen-width:84.29%;
--vibeui-mockup-002-screen-height:92.75%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="mockup-002"]{color-scheme:dark}
[data-vibeui-block="mockup-002"]{
display:block;box-sizing:border-box;margin:0 auto;width:100%;max-width:18rem;
container-type:inline-size;
color:var(--vibeui-mockup-002-fg);font-family:var(--vibeui-mockup-002-font);
}
[data-vibeui-block="mockup-002"] *{box-sizing:border-box}
[data-vibeui-block="mockup-002"] [data-part="device"]{
position:relative;isolation:isolate;width:100%;aspect-ratio:853/1738;
}
/* Корпус — верхний слой: прозрачный вырез открывает экран под ним. */
[data-vibeui-block="mockup-002"] [data-part="frame"]{
position:absolute;inset:0;z-index:2;display:block;width:100%;height:100%;
pointer-events:none;user-select:none;
}
[data-vibeui-block="mockup-002"] [data-part="screen"]{
position:absolute;z-index:1;overflow:hidden;isolation:isolate;
left:var(--vibeui-mockup-002-screen-left);top:var(--vibeui-mockup-002-screen-top);
width:var(--vibeui-mockup-002-screen-width);height:var(--vibeui-mockup-002-screen-height);
background:var(--vibeui-mockup-002-screen-bg);
}
[data-vibeui-block="mockup-002"] [data-part="screen"] > img{
display:block;width:100%;height:100%;object-fit:cover;object-position:top center;
}
[data-vibeui-block="mockup-002"] [data-part="content"]{position:absolute;inset:0;overflow:hidden}
[data-vibeui-block="mockup-002"] [data-part="glare"]{
position:absolute;inset:0;z-index:1;pointer-events:none;
background:linear-gradient(160deg,oklch(1 0 0 / 0.12),oklch(1 0 0 / 0.04) 30%,transparent 50%);
}
/* Заглушка: обои, часы и сетка приложений. */
[data-vibeui-block="mockup-002"] [data-part="placeholder"]{
position:absolute;inset:0;display:flex;flex-direction:column;
padding:14cqw 6cqw 8cqw;gap:6cqw;
background:
  radial-gradient(ellipse at 20% 10%,oklch(0.72 0.17 320 / 0.9),transparent 55%),
  radial-gradient(ellipse at 90% 85%,oklch(0.75 0.15 210 / 0.9),transparent 55%),
  linear-gradient(170deg,oklch(0.38 0.1 290),oklch(0.2 0.06 250));
}
[data-vibeui-block="mockup-002"] [data-part="clock"]{
color:oklch(1 0 0 / 0.95);font-size:16cqw;font-weight:300;line-height:1;
letter-spacing:-0.02em;text-align:center;
}
[data-vibeui-block="mockup-002"] [data-part="apps"]{
display:grid;grid-template-columns:repeat(4,1fr);gap:5cqw 4cqw;padding:0 2cqw;margin-top:auto;
}
[data-vibeui-block="mockup-002"] [data-part="apps"] > i{
aspect-ratio:1;border-radius:4.6cqw;
background:oklch(1 0 0 / 0.22);box-shadow:inset 0 0 0 0.2cqw oklch(1 0 0 / 0.25);
}
[data-vibeui-block="mockup-002"] [data-part="dock"]{
display:grid;grid-template-columns:repeat(4,1fr);gap:4cqw;padding:3cqw;
border-radius:7cqw;background:oklch(1 0 0 / 0.18);
}
[data-vibeui-block="mockup-002"] [data-part="dock"] > i{
aspect-ratio:1;border-radius:4.6cqw;background:oklch(1 0 0 / 0.5);
}
/* Тень: плотная под серединой, растянутая к краям — как от предмета на
   столе, а не от плоской карточки. */
[data-vibeui-block="mockup-002"] [data-part="shadow"]{
position:absolute;z-index:0;border-radius:50%;
left:10cqw;right:10cqw;bottom:-1.5cqw;height:5cqw;filter:blur(1.2cqw);
background:radial-gradient(ellipse at center,var(--vibeui-mockup-002-shadow),transparent 70%);
}
[data-vibeui-block="mockup-002"] figcaption{
margin-top:1.25rem;text-align:center;
font-size:0.875rem;line-height:1.4;color:var(--vibeui-mockup-002-muted);
}
`

/**
 * Смартфон с фото-корпусом: вертикальный кадр или живая разметка под стеклом, блик и тень.
 * Один файл, ноль зависимостей: корпус — фото с прозрачным вырезом.
 */
export function Mockup002({
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
}: Mockup002Props) {
  return (
    <>
      <style href="vibeui-mockup-002" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="mockup"
        data-vibeui-block="mockup-002"
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
              <div data-part="placeholder" aria-hidden="true">
                <div data-part="clock">9:41</div>
                <div data-part="apps">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <div data-part="dock">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            )}
            {glare ? <span data-part="glare" aria-hidden="true" /> : null}
          </div>
          <img
            data-part="frame"
            src={frame ?? "/demo/devices/phone-front.webp"}
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
