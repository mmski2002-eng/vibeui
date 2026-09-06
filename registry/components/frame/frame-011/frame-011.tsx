import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Frame011Props = Omit<ComponentProps<"figure">, "title"> & {
  tilt?: "left" | "right"
  caption?: string
  /** Надпись пустого кадра: компонент несёт русскую. */
  stubText?: string
  /** Пусто — остаётся собственная поверхность кадра; сюда задают свой цвет. */
  background?: string
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
--vibeui-frame-011-bg:light-dark(oklch(1 0 0),oklch(0.28 0 265));
--vibeui-frame-011-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-frame-011-muted:color-mix(in oklab,var(--vibeui-frame-011-fg) 68%,transparent);
--vibeui-frame-011-border:light-dark(oklch(0.88 0 265),oklch(0.42 0 265));
--vibeui-frame-011-shadow:light-dark(oklch(0.2 0 265 / 0.28),oklch(0 0 0 / 0.5));
--vibeui-frame-011-soft:light-dark(oklch(0.965 0 265),oklch(0.33 0 265));
--vibeui-frame-011-accent:light-dark(oklch(0.55 0.16 262),oklch(0.72 0.15 262));
--vibeui-frame-011-radius:0.875rem;
--vibeui-frame-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="frame-011"]{color-scheme:dark}
[data-vibeui-block="frame-011"]{
display:block;margin:0;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:28rem;box-sizing:border-box;
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
/* Пустая карточка рисует условный экран: заголовок, показатели и график.
   Развёрнутый в перспективе серый прямоугольник ничего не показывает. */
[data-vibeui-block="frame-011"] [data-part="body"] [data-part="stub"]{
display:flex;flex-direction:column;gap:0.5rem;
min-height:9rem;padding:0.75rem;text-align:left;
}
[data-vibeui-block="frame-011"] [data-part="stub-title"]{
margin:0;font-size:0.8125rem;font-weight:700;color:var(--vibeui-frame-011-fg);
}
[data-vibeui-block="frame-011"] [data-part="tiles"]{display:grid;grid-template-columns:repeat(2,1fr);gap:0.5rem}
[data-vibeui-block="frame-011"] [data-part="tile"]{
display:flex;flex-direction:column;gap:0.3125rem;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
background:var(--vibeui-frame-011-soft);
border-left:2px solid var(--vibeui-frame-011-accent);
}
[data-vibeui-block="frame-011"] [data-part="tile"] span{
display:block;height:0.5rem;width:52%;border-radius:9999px;
background:var(--vibeui-frame-011-accent);
}
[data-vibeui-block="frame-011"] [data-part="tile"] i{
display:block;height:0.3125rem;width:80%;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-frame-011-fg) 20%,transparent);
}
[data-vibeui-block="frame-011"] [data-part="tile"]:nth-child(2){--vibeui-frame-011-accent:light-dark(oklch(0.6 0.15 160),oklch(0.74 0.14 160))}
[data-vibeui-block="frame-011"] [data-part="chart"]{
display:flex;align-items:flex-end;gap:0.375rem;
height:3rem;padding:0.5rem;border-radius:0.5rem;
background:var(--vibeui-frame-011-soft);
}
[data-vibeui-block="frame-011"] [data-part="chart"] i{
display:block;flex:1 1 0;border-radius:0.125rem 0.125rem 0 0;
background:color-mix(in oklab,var(--vibeui-frame-011-accent) 45%,transparent);
}
[data-vibeui-block="frame-011"] [data-part="chart"] i:nth-child(1){height:40%}
[data-vibeui-block="frame-011"] [data-part="chart"] i:nth-child(2){height:68%}
[data-vibeui-block="frame-011"] [data-part="chart"] i:nth-child(3){height:52%}
[data-vibeui-block="frame-011"] [data-part="chart"] i:nth-child(4){height:86%}
[data-vibeui-block="frame-011"] [data-part="chart"] i:nth-child(5){height:100%;background:var(--vibeui-frame-011-accent)}
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
 * Кадр с 3D-разворотом скриншота: perspective и rotateX/rotateY имитируют
 * вид на экран сбоку. Один файл, ноль зависимостей, собственная палитра.
 */
export function Frame011({
  tilt = "left",
  caption = "Кадр с разворотом в перспективе для hero-секции",
  stubText = "Скриншот интерфейса",
  background = "",
  children,
  className,
  style,
  ...props
}: Frame011Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-frame-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-frame-011" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="frame"
        data-vibeui-block="frame-011"
        data-tilt={tilt}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="card">
            <div data-part="bar" aria-hidden="true">
              <span data-part="dot" />
              <span data-part="dot" />
              <span data-part="dot" />
            </div>
            <div data-part="body">
              {children ?? (
                <div data-part="stub">
                  <p data-part="stub-title">{stubText}</p>
                  <div data-part="tiles" aria-hidden="true">
                    <span data-part="tile">
                      <span />
                      <i />
                    </span>
                    <span data-part="tile">
                      <span />
                      <i />
                    </span>
                  </div>
                  <div data-part="chart" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
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
