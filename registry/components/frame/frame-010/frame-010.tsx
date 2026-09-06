import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Frame010Props = Omit<ComponentProps<"figure">, "title"> & {
  back?: ReactNode
  middle?: ReactNode
  front?: ReactNode
  caption?: string
  /** Шаблон заглушки кадра: {index} подставляется номером. */
  stubText?: string
  /** Пусто — остаётся собственная бумага кадров; сюда задают свой цвет. */
  background?: string
}

// Идея компонента: коллаж из трёх кадров внахлёст — приём для обложек и
// hero-секций, когда одного скриншота мало, а галерея из трёх равных
// картинок в ряд смотрится плоско. Смещения и ширины заданы в процентах от
// собственной ширины stage, а не в пикселях: коллаж масштабируется вместе с
// контейнером, а не только с окном браузера. У каждого кадра свой поворот и
// z-index — так порядок наложения не зависит от порядка в разметке.
const STYLES = `
:where([data-vibeui-block="frame-010"]){
--vibeui-frame-010-bg:light-dark(oklch(1 0 0),oklch(0.28 0 265));
--vibeui-frame-010-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-frame-010-muted:color-mix(in oklab,var(--vibeui-frame-010-fg) 68%,transparent);
--vibeui-frame-010-border:light-dark(oklch(0.9 0 265),oklch(0.42 0 265));
--vibeui-frame-010-accent:light-dark(oklch(0.55 0.16 39.8),oklch(0.72 0.15 39.8));
--vibeui-frame-010-radius:0.75rem;
--vibeui-frame-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="frame-010"]{color-scheme:dark}
[data-vibeui-block="frame-010"]{
display:block;margin:0;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);box-sizing:border-box;
font-family:var(--vibeui-frame-010-font);color:var(--vibeui-frame-010-fg);
}
[data-vibeui-block="frame-010"] *{box-sizing:border-box}
[data-vibeui-block="frame-010"] [data-part="stage"]{
position:relative;width:100%;aspect-ratio:6 / 5;
}
[data-vibeui-block="frame-010"] [data-part="card"]{
position:absolute;overflow:hidden;
background:var(--vibeui-frame-010-bg);
border:1px solid var(--vibeui-frame-010-border);
border-radius:var(--vibeui-frame-010-radius);
box-shadow:0 0.5rem 1.5rem oklch(0 0 0 / 0.12);
}
[data-vibeui-block="frame-010"] [data-part="card"] > *{display:block;width:100%;height:100%}
[data-vibeui-block="frame-010"] img{display:block;width:100%;height:100%;object-fit:cover}
/* Смещения и повороты — процент/градус, не пиксели: коллаж живёт своей шириной. */
[data-vibeui-block="frame-010"] [data-part="card"][data-role="back"]{
top:1%;left:0%;width:56%;aspect-ratio:4 / 3;
transform:rotate(-9deg);z-index:1;
}
[data-vibeui-block="frame-010"] [data-part="card"][data-role="middle"]{
top:22%;left:36%;width:58%;aspect-ratio:4 / 3;
transform:rotate(6deg);z-index:2;
}
[data-vibeui-block="frame-010"] [data-part="card"][data-role="front"]{
top:42%;left:12%;width:62%;aspect-ratio:16 / 10;
transform:rotate(-3deg);z-index:3;
box-shadow:0 1rem 2rem oklch(0 0 0 / 0.16);
}
/* Каждый кадр коллажа несёт свою сцену: снимок, график и страница. Три
   одинаковых серых поля с номерами не объясняли бы, зачем коллаж нужен. */
[data-vibeui-block="frame-010"] [data-part="card"] [data-part="stub"]{
position:relative;overflow:hidden;
display:flex;flex-direction:column;justify-content:flex-end;gap:0.375rem;
width:100%;height:100%;padding:0.5rem;
}
[data-vibeui-block="frame-010"] [data-part="label"]{
align-self:flex-start;position:relative;
padding:0.0625rem 0.375rem;border-radius:0.3125rem;
background:color-mix(in oklab,var(--vibeui-frame-010-bg) 82%,transparent);
font-size:0.625rem;font-weight:650;color:var(--vibeui-frame-010-fg);
}
[data-vibeui-block="frame-010"] [data-part="stub"][data-scene="photo"]{
background:linear-gradient(180deg,oklch(0.7 0.13 265),oklch(0.82 0.12 45));
}
[data-vibeui-block="frame-010"] [data-part="sun"]{
position:absolute;left:22%;top:20%;width:26%;aspect-ratio:1 / 1;
border-radius:9999px;background:oklch(0.94 0.11 85);
}
[data-vibeui-block="frame-010"] [data-part="peak"]{
position:absolute;inset:auto 0 0;height:46%;
background:oklch(0.42 0.06 285);
clip-path:polygon(0 100%,32% 26%,58% 72%,78% 40%,100% 100%);
}
[data-vibeui-block="frame-010"] [data-part="stub"][data-scene="chart"]{
background:linear-gradient(180deg,color-mix(in oklab,var(--vibeui-frame-010-accent) 12%,transparent),transparent);
}
[data-vibeui-block="frame-010"] [data-part="bars"]{
display:flex;align-items:flex-end;gap:0.25rem;flex:1 1 auto;min-height:0;
}
[data-vibeui-block="frame-010"] [data-part="bars"] i{
display:block;flex:1 1 0;border-radius:0.125rem 0.125rem 0 0;
background:color-mix(in oklab,var(--vibeui-frame-010-accent) 55%,transparent);
}
[data-vibeui-block="frame-010"] [data-part="bars"] i:nth-child(2){height:70%}
[data-vibeui-block="frame-010"] [data-part="bars"] i:nth-child(1){height:44%}
[data-vibeui-block="frame-010"] [data-part="bars"] i:nth-child(3){height:56%}
[data-vibeui-block="frame-010"] [data-part="bars"] i:nth-child(4){height:96%;background:var(--vibeui-frame-010-accent)}
[data-vibeui-block="frame-010"] [data-part="topbar"]{
display:flex;align-items:center;gap:0.3125rem;
padding-bottom:0.375rem;border-bottom:1px solid var(--vibeui-frame-010-border);
}
[data-vibeui-block="frame-010"] [data-part="topbar"] i{
display:block;width:0.75rem;height:0.75rem;border-radius:0.25rem;
background:var(--vibeui-frame-010-accent);
}
[data-vibeui-block="frame-010"] [data-part="topbar"] i:last-child{
width:2.5rem;height:0.375rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-frame-010-fg) 20%,transparent);
}
[data-vibeui-block="frame-010"] [data-part="lines"]{
display:flex;flex-direction:column;gap:0.3125rem;flex:1 1 auto;
}
[data-vibeui-block="frame-010"] [data-part="lines"] i{
display:block;height:0.375rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-frame-010-fg) 16%,transparent);
}
[data-vibeui-block="frame-010"] [data-part="lines"] i:last-child{width:58%}
[data-vibeui-block="frame-010"] figcaption{
margin-top:0.75rem;font-size:0.75rem;line-height:1.4;
color:var(--vibeui-frame-010-muted);text-align:center;
}
@container (max-width: 22rem){
[data-vibeui-block="frame-010"] [data-part="card"][data-role="back"]{top:2%;left:2%;width:52%;transform:rotate(-5deg)}
[data-vibeui-block="frame-010"] [data-part="card"][data-role="middle"]{top:20%;left:38%;width:54%;transform:rotate(3deg)}
[data-vibeui-block="frame-010"] [data-part="card"][data-role="front"]{top:40%;left:16%;width:56%;transform:rotate(-2deg)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="frame-010"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Коллаж из трёх кадров внахлёст: смещения и повороты в процентах от
 * собственной ширины. Один файл, ноль зависимостей, собственная палитра.
 */
export function Frame010({
  back,
  middle,
  front,
  caption = "Три кадра внахлёст: коллаж для обложки",
  stubText = "Кадр {index}",
  background = "",
  className,
  style,
  ...props
}: Frame010Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-frame-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-frame-010" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="frame"
        data-vibeui-block="frame-010"
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="card" data-role="back">
            {back ?? (
              <div data-part="stub" data-scene="photo">
                <span data-part="sun" aria-hidden="true" />
                <span data-part="peak" aria-hidden="true" />
                <span data-part="label">
                  {stubText.replace("{index}", "1")}
                </span>
              </div>
            )}
          </div>
          <div data-part="card" data-role="middle">
            {middle ?? (
              <div data-part="stub" data-scene="chart">
                <span data-part="bars" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <span data-part="label">
                  {stubText.replace("{index}", "2")}
                </span>
              </div>
            )}
          </div>
          <div data-part="card" data-role="front">
            {front ?? (
              <div data-part="stub" data-scene="page">
                <span data-part="topbar" aria-hidden="true">
                  <i />
                  <i />
                </span>
                <span data-part="lines" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span data-part="label">
                  {stubText.replace("{index}", "3")}
                </span>
              </div>
            )}
          </div>
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </>
  )
}
