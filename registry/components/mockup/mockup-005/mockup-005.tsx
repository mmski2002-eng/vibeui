import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Mockup005Props = Omit<ComponentProps<"figure">, "children"> & {
  /** Кадр экрана. Без него экран берёт children, а без них — заглушку. */
  src?: string
  alt?: string
  /** Живое содержимое экрана: любая разметка вместо картинки. */
  children?: ReactNode
  /**
   * Фото корпуса: PNG или WebP с прозрачным вырезом экрана. Вырез должен
   * совпадать с переменными --vibeui-mockup-005-screen-* (доли кадра фото).
   */
  frame?: string
  /** Блик на стекле экрана. */
  glare?: boolean
  /** Мягкая тень под корпусом. */
  shadow?: boolean
  /** Подпись под устройством. */
  caption?: string
}

// Идея: фото настольного монитора под широкий кадр. Ножка и подставка —
// из фото, экран — живой слой под вырезом. Тень лежит под подставкой,
// а не под всем корпусом: монитор стоит на ножке.
const STYLES = `
:where([data-vibeui-block="mockup-005"]){
--vibeui-mockup-005-fg:light-dark(oklch(0.25 0.014 265),oklch(0.95 0.005 265));
--vibeui-mockup-005-muted:color-mix(in oklab,var(--vibeui-mockup-005-fg) 62%,transparent);
--vibeui-mockup-005-screen-bg:oklch(0.2 0.01 265);
--vibeui-mockup-005-shadow:light-dark(oklch(0 0 0 / 0.35),oklch(0 0 0 / 0.65));
--vibeui-mockup-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
/* Вырез экрана в фото корпуса, доли от кадра фото. */
--vibeui-mockup-005-screen-left:2.94%;
--vibeui-mockup-005-screen-top:4.25%;
--vibeui-mockup-005-screen-width:94.11%;
--vibeui-mockup-005-screen-height:67.06%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="mockup-005"]{color-scheme:dark}
[data-vibeui-block="mockup-005"]{
display:block;box-sizing:border-box;margin:0 auto;width:100%;max-width:56rem;
container-type:inline-size;
color:var(--vibeui-mockup-005-fg);font-family:var(--vibeui-mockup-005-font);
}
[data-vibeui-block="mockup-005"] *{box-sizing:border-box}
[data-vibeui-block="mockup-005"] [data-part="device"]{
position:relative;isolation:isolate;width:100%;aspect-ratio:1562/941;
}
/* Корпус — верхний слой: прозрачный вырез открывает экран под ним. */
[data-vibeui-block="mockup-005"] [data-part="frame"]{
position:absolute;inset:0;z-index:2;display:block;width:100%;height:100%;
pointer-events:none;user-select:none;
}
[data-vibeui-block="mockup-005"] [data-part="screen"]{
position:absolute;z-index:1;overflow:hidden;isolation:isolate;
left:var(--vibeui-mockup-005-screen-left);top:var(--vibeui-mockup-005-screen-top);
width:var(--vibeui-mockup-005-screen-width);height:var(--vibeui-mockup-005-screen-height);
background:var(--vibeui-mockup-005-screen-bg);
}
[data-vibeui-block="mockup-005"] [data-part="screen"] > img{
display:block;width:100%;height:100%;object-fit:cover;object-position:top center;
}
[data-vibeui-block="mockup-005"] [data-part="content"]{position:absolute;inset:0;overflow:hidden}
[data-vibeui-block="mockup-005"] [data-part="glare"]{
position:absolute;inset:0;z-index:1;pointer-events:none;
background:linear-gradient(115deg,oklch(1 0 0 / 0.12) 0%,oklch(1 0 0 / 0.05) 28%,transparent 46%,transparent 70%,oklch(1 0 0 / 0.03) 100%);
}
/* Заглушка экрана: обои и окно с тремя точками — видно, что мокап живой
   и куда ляжет кадр. */
[data-vibeui-block="mockup-005"] [data-part="placeholder"]{
position:absolute;inset:0;display:grid;place-items:center;
background:
  radial-gradient(ellipse at 20% 15%,oklch(0.7 0.16 300 / 0.9),transparent 55%),
  radial-gradient(ellipse at 85% 80%,oklch(0.72 0.15 200 / 0.85),transparent 55%),
  linear-gradient(160deg,oklch(0.35 0.08 280),oklch(0.22 0.06 250));
}
[data-vibeui-block="mockup-005"] [data-part="window"]{
width:62%;aspect-ratio:16/10;border-radius:1cqw;overflow:hidden;
background:oklch(1 0 0 / 0.92);
box-shadow:0 2cqw 4cqw -1.5cqw oklch(0 0 0 / 0.5);
}
[data-vibeui-block="mockup-005"] [data-part="titlebar"]{
display:flex;gap:0.6cqw;padding:1cqw 1.2cqw;
background:oklch(0.94 0.003 265);border-bottom:0.1cqw solid oklch(0.85 0.003 265);
}
[data-vibeui-block="mockup-005"] [data-part="titlebar"] > i{
width:1cqw;height:1cqw;border-radius:50%;background:oklch(0.78 0.16 25);
}
[data-vibeui-block="mockup-005"] [data-part="titlebar"] > i:nth-child(2){background:oklch(0.85 0.16 85)}
[data-vibeui-block="mockup-005"] [data-part="titlebar"] > i:nth-child(3){background:oklch(0.78 0.17 145)}
[data-vibeui-block="mockup-005"] [data-part="lines"]{display:grid;gap:1.1cqw;padding:2cqw 2.4cqw}
[data-vibeui-block="mockup-005"] [data-part="lines"] > i{
display:block;height:1.1cqw;border-radius:1cqw;background:oklch(0.86 0.005 265);
}
[data-vibeui-block="mockup-005"] [data-part="lines"] > i:nth-child(1){width:38%;height:1.8cqw;background:oklch(0.55 0.02 265)}
[data-vibeui-block="mockup-005"] [data-part="lines"] > i:nth-child(3){width:82%}
[data-vibeui-block="mockup-005"] [data-part="lines"] > i:nth-child(4){width:64%}
/* Тень: плотная под серединой, растянутая к краям — как от предмета на
   столе, а не от плоской карточки. */
[data-vibeui-block="mockup-005"] [data-part="shadow"]{
position:absolute;z-index:0;border-radius:50%;
left:26%;right:26%;bottom:-0.6cqw;height:2.6cqw;filter:blur(0.8cqw);
background:radial-gradient(ellipse at center,var(--vibeui-mockup-005-shadow),transparent 70%);
}
[data-vibeui-block="mockup-005"] figcaption{
margin-top:1.25rem;text-align:center;
font-size:0.875rem;line-height:1.4;color:var(--vibeui-mockup-005-muted);
}
`

/**
 * Монитор с фото-корпусом: кадр 16/9 или живая разметка под вырезом экрана.
 * Один файл, ноль зависимостей: корпус — фото с прозрачным вырезом.
 */
export function Mockup005({
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
}: Mockup005Props) {
  return (
    <>
      <style href="vibeui-mockup-005" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="mockup"
        data-vibeui-block="mockup-005"
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
            src={frame ?? "/demo/devices/monitor-front.webp"}
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
