import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Mockup008Props = Omit<ComponentProps<"figure">, "children"> & {
  /** Кадр экрана ноутбука. Без него — children, а без них — заглушка. */
  src?: string
  alt?: string
  /** Кадр экрана телефона. Без него — заглушка. */
  phoneSrc?: string
  phoneAlt?: string
  /** Живое содержимое экрана ноутбука. */
  children?: ReactNode
  /** Фото корпусов с прозрачным вырезом экрана. */
  frame?: string
  phoneFrame?: string
  /** Мягкая тень под устройствами. */
  shadow?: boolean
  /** Подпись под парой. */
  caption?: string
}

// Идея: пара «ноутбук + телефон» из двух фото-корпусов для секции «работает
// на любом экране». Ноутбук занимает ширину компонента, телефон перекрывает
// его правый нижний угол и стоит ближе к зрителю — с собственной тенью на
// крышку. Оба выреза объявлены в долях своих фото, размер телефона — в
// долях ширины компонента, поэтому пара масштабируется как одна картинка.
const STYLES = `
:where([data-vibeui-block="mockup-008"]){
--vibeui-mockup-008-fg:light-dark(oklch(0.25 0.014 265),oklch(0.95 0.005 265));
--vibeui-mockup-008-muted:color-mix(in oklab,var(--vibeui-mockup-008-fg) 62%,transparent);
--vibeui-mockup-008-screen-bg:oklch(0.2 0.01 265);
--vibeui-mockup-008-shadow:light-dark(oklch(0 0 0 / 0.35),oklch(0 0 0 / 0.65));
--vibeui-mockup-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
/* Вырезы экранов в фото корпусов, доли от кадра каждого фото. */
--vibeui-mockup-008-laptop-left:9.11%;
--vibeui-mockup-008-laptop-top:6.8%;
--vibeui-mockup-008-laptop-width:81.77%;
--vibeui-mockup-008-laptop-height:77.26%;
--vibeui-mockup-008-phone-left:7.85%;
--vibeui-mockup-008-phone-top:3.62%;
--vibeui-mockup-008-phone-width:84.29%;
--vibeui-mockup-008-phone-height:92.75%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="mockup-008"]{color-scheme:dark}
[data-vibeui-block="mockup-008"]{
display:block;box-sizing:border-box;margin:0 auto;width:100%;max-width:56rem;
container-type:inline-size;
color:var(--vibeui-mockup-008-fg);font-family:var(--vibeui-mockup-008-font);
}
[data-vibeui-block="mockup-008"] *{box-sizing:border-box}
[data-vibeui-block="mockup-008"] [data-part="scene"]{
position:relative;isolation:isolate;padding:0 6cqw 6cqw 0;
}
[data-vibeui-block="mockup-008"] [data-part="laptop"]{
position:relative;width:100%;aspect-ratio:1580/897;
}
[data-vibeui-block="mockup-008"] [data-part="frame"]{
position:absolute;inset:0;z-index:2;display:block;width:100%;height:100%;
pointer-events:none;user-select:none;
}
[data-vibeui-block="mockup-008"] [data-part="screen"]{
position:absolute;z-index:1;overflow:hidden;isolation:isolate;
left:var(--vibeui-mockup-008-laptop-left);top:var(--vibeui-mockup-008-laptop-top);
width:var(--vibeui-mockup-008-laptop-width);height:var(--vibeui-mockup-008-laptop-height);
background:var(--vibeui-mockup-008-screen-bg);
}
[data-vibeui-block="mockup-008"] [data-part="screen"] > img{
display:block;width:100%;height:100%;object-fit:cover;object-position:top center;
}
[data-vibeui-block="mockup-008"] [data-part="content"]{position:absolute;inset:0;overflow:hidden}
[data-vibeui-block="mockup-008"] [data-part="glare"]{
position:absolute;inset:0;z-index:1;pointer-events:none;
background:linear-gradient(115deg,oklch(1 0 0 / 0.12),oklch(1 0 0 / 0.05) 28%,transparent 46%);
}
[data-vibeui-block="mockup-008"] [data-part="placeholder"]{
position:absolute;inset:0;
background:
  radial-gradient(ellipse at 20% 15%,oklch(0.7 0.16 300 / 0.9),transparent 55%),
  radial-gradient(ellipse at 85% 80%,oklch(0.72 0.15 200 / 0.85),transparent 55%),
  linear-gradient(160deg,oklch(0.35 0.08 280),oklch(0.22 0.06 250));
}
[data-vibeui-block="mockup-008"] [data-part="placeholder"][data-device="phone"]{
background:
  radial-gradient(ellipse at 20% 10%,oklch(0.72 0.17 320 / 0.9),transparent 55%),
  radial-gradient(ellipse at 90% 85%,oklch(0.75 0.15 210 / 0.9),transparent 55%),
  linear-gradient(170deg,oklch(0.38 0.1 290),oklch(0.2 0.06 250));
}
/* Телефон: ближе к зрителю, перекрывает правый нижний угол ноутбука. */
[data-vibeui-block="mockup-008"] [data-part="phone"]{
position:absolute;right:0;bottom:0;z-index:3;width:22cqw;aspect-ratio:853/1738;
filter:drop-shadow(0 1.6cqw 2cqw oklch(0 0 0 / 0.45));
}
[data-vibeui-block="mockup-008"] [data-part="phone"] [data-part="screen"]{
left:var(--vibeui-mockup-008-phone-left);top:var(--vibeui-mockup-008-phone-top);
width:var(--vibeui-mockup-008-phone-width);height:var(--vibeui-mockup-008-phone-height);
}
[data-vibeui-block="mockup-008"] [data-part="shadow"]{
position:absolute;left:4cqw;right:10cqw;bottom:5cqw;height:3cqw;z-index:0;
border-radius:50%;
background:radial-gradient(ellipse at center,var(--vibeui-mockup-008-shadow),transparent 70%);
filter:blur(0.8cqw);
}
[data-vibeui-block="mockup-008"] figcaption{
margin-top:1.25rem;text-align:center;
font-size:0.875rem;line-height:1.4;color:var(--vibeui-mockup-008-muted);
}
`

/**
 * Пара ноутбук + телефон из фото-корпусов: два кадра в одном блоке, телефон
 * перекрывает угол крышки. Один файл, ноль зависимостей.
 */
export function Mockup008({
  src,
  alt = "",
  phoneSrc,
  phoneAlt = "",
  children,
  frame = "/demo/devices/laptop-front.webp",
  phoneFrame = "/demo/devices/phone-front.webp",
  shadow = true,
  caption,
  className,
  style,
  ...props
}: Mockup008Props) {
  return (
    <>
      <style href="vibeui-mockup-008" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="mockup"
        data-vibeui-block="mockup-008"
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="scene">
          <div data-part="laptop">
            <div data-part="screen">
              {src ? (
                <img src={src} alt={alt} loading="lazy" decoding="async" />
              ) : children ? (
                <div data-part="content">{children}</div>
              ) : (
                <div data-part="placeholder" aria-hidden="true" />
              )}
              <span data-part="glare" aria-hidden="true" />
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
          <div data-part="phone">
            <div data-part="screen">
              {phoneSrc ? (
                <img
                  src={phoneSrc}
                  alt={phoneAlt}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div
                  data-part="placeholder"
                  data-device="phone"
                  aria-hidden="true"
                />
              )}
            </div>
            <img
              data-part="frame"
              src={phoneFrame}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
          </div>
          {shadow ? <span data-part="shadow" aria-hidden="true" /> : null}
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </>
  )
}
