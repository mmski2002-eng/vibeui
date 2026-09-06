import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Frame015Props = Omit<ComponentProps<"figure">, "title"> & {
  title?: string
  currentTime?: string
  duration?: string
  progress?: number
  caption?: string
  /** Надпись пустой обложки: компонент несёт русскую. */
  posterStub?: string
  accent?: string
  /** Пусто — подложки нет, кадр ложится на фон страницы. */
  background?: string
  children?: ReactNode
}

// Идея компонента: кадр видеоплеера — обложка ролика, кнопка воспроизведения
// поверх затемнения и дорожка времени с уже пройденной долей. Затемнение
// снизу (scrim) нужно, чтобы заголовок и время читались на любой обложке,
// от светлого скриншота до тёмного кадра. Заполнение дорожки — единственный
// инлайн-стиль в файле: процент приходит из пропа и не выражается классом.
const STYLES = `
:where([data-vibeui-block="frame-015"]){
--vibeui-frame-015-bg:transparent;
--vibeui-frame-015-poster:oklch(0.24 0 265);
--vibeui-frame-015-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-frame-015-muted:color-mix(in oklab,var(--vibeui-frame-015-fg) 68%,transparent);
--vibeui-frame-015-border:light-dark(oklch(0.89 0 265),oklch(0.4 0 265));
--vibeui-frame-015-light:oklch(0.98 0 265);
--vibeui-frame-015-accent:light-dark(oklch(0.7 0.16 45),oklch(0.78 0.15 45));
--vibeui-frame-015-radius:0.875rem;
--vibeui-frame-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="frame-015"]{color-scheme:dark}
[data-vibeui-block="frame-015"]{
display:block;margin:0;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:30rem;box-sizing:border-box;
font-family:var(--vibeui-frame-015-font);color:var(--vibeui-frame-015-fg);
}
[data-vibeui-block="frame-015"] *{box-sizing:border-box}
[data-vibeui-block="frame-015"] [data-part="shell"]{
overflow:hidden;
background:var(--vibeui-frame-015-bg);
border:1px solid var(--vibeui-frame-015-border);
border-radius:var(--vibeui-frame-015-radius);
}
[data-vibeui-block="frame-015"] [data-part="stage"]{
position:relative;overflow:hidden;
aspect-ratio:16 / 9;
background:var(--vibeui-frame-015-poster);
}
[data-vibeui-block="frame-015"] [data-part="poster"]{position:absolute;inset:0}
[data-vibeui-block="frame-015"] [data-part="poster"] > *{display:block;width:100%;height:100%}
[data-vibeui-block="frame-015"] img{display:block;width:100%;height:100%;object-fit:cover}
/* Обложка по умолчанию — нарисованный градиентный постер, а не серое поле
   с надписью: плеер без обложки читается как ошибка загрузки. Название
   кадра ушло в aria-label: поверх постера уже стоит заголовок ролика. */
[data-vibeui-block="frame-015"] [data-part="poster"] [data-part="stub"]{
position:relative;overflow:hidden;height:100%;
background:
radial-gradient(60% 80% at 24% 22%,oklch(0.62 0.18 300),transparent 65%),
radial-gradient(55% 70% at 82% 30%,oklch(0.68 0.16 35),transparent 62%),
linear-gradient(150deg,oklch(0.34 0.09 285),var(--vibeui-frame-015-poster));
}
[data-vibeui-block="frame-015"] [data-part="wave"]{
position:absolute;inset:auto 0 0;height:46%;
background:color-mix(in oklab,var(--vibeui-frame-015-poster) 55%,transparent);
clip-path:polygon(0 42%,18% 22%,38% 52%,58% 18%,78% 46%,100% 26%,100% 100%,0 100%);
}
[data-vibeui-block="frame-015"] [data-part="scrim"]{
position:absolute;inset:0 0 0 0;
background:linear-gradient(to top,color-mix(in oklab,var(--vibeui-frame-015-poster) 88%,black) 0%,transparent 55%);
}
[data-vibeui-block="frame-015"] [data-part="play"]{
position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
display:grid;place-items:center;
width:3.25rem;height:3.25rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-frame-015-light) 22%,transparent);
border:1px solid color-mix(in oklab,var(--vibeui-frame-015-light) 45%,transparent);
}
[data-vibeui-block="frame-015"] [data-part="triangle"]{
width:0;height:0;margin-left:0.2rem;
border-top:0.55rem solid transparent;
border-bottom:0.55rem solid transparent;
border-left:0.85rem solid var(--vibeui-frame-015-light);
}
[data-vibeui-block="frame-015"] [data-part="title"]{
position:absolute;left:0.875rem;right:0.875rem;bottom:2.5rem;
margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.8125rem;font-weight:650;color:var(--vibeui-frame-015-light);
}
[data-vibeui-block="frame-015"] [data-part="controls"]{
position:absolute;left:0.875rem;right:0.875rem;bottom:0.75rem;
display:flex;align-items:center;gap:0.5rem;
}
[data-vibeui-block="frame-015"] [data-part="time"]{
flex:none;font-size:0.6875rem;font-variant-numeric:tabular-nums;
color:var(--vibeui-frame-015-light);
}
[data-vibeui-block="frame-015"] [data-part="track"]{
position:relative;flex:1 1 auto;height:0.25rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-frame-015-light) 30%,transparent);
}
[data-vibeui-block="frame-015"] [data-part="fill"]{
position:absolute;inset:0;width:0;border-radius:9999px;
background:var(--vibeui-frame-015-accent);
}
[data-vibeui-block="frame-015"] figcaption{
padding:0.75rem 1rem 1rem;
font-size:0.75rem;line-height:1.4;color:var(--vibeui-frame-015-muted);
}
@container (max-width: 22rem){
[data-vibeui-block="frame-015"] [data-part="play"]{width:2.75rem;height:2.75rem}
[data-vibeui-block="frame-015"] [data-part="title"]{font-size:0.75rem;bottom:2.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="frame-015"] *{animation:none!important;transition:none!important}}
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
 * Кадр видеоплеера: обложка, кнопка воспроизведения и дорожка времени
 * с пройденной долей. Один файл, ноль зависимостей, собственная палитра.
 */
export function Frame015({
  title = "Обзор каталога VibeUI",
  currentTime = "1:24",
  duration = "4:12",
  progress = 32,
  caption = "Кадр видеоплеера: обложка, кнопка воспроизведения и дорожка времени",
  posterStub = "Обложка ролика",
  accent,
  background = "",
  children,
  className,
  style,
  ...props
}: Frame015Props) {
  const fill = Math.min(100, Math.max(0, progress))
  const palette = {
    ...(accent ? { "--vibeui-frame-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-frame-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-frame-015" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="frame"
        data-vibeui-block="frame-015"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="stage">
            <div data-part="poster">
              {children ?? (
                <div data-part="stub" role="img" aria-label={posterStub}>
                  <span data-part="wave" />
                </div>
              )}
            </div>
            <div data-part="scrim" aria-hidden="true" />
            <span data-part="play" aria-hidden="true">
              <span data-part="triangle" />
            </span>
            <p data-part="title">{title}</p>
            <div data-part="controls">
              <span data-part="time">{currentTime}</span>
              <div data-part="track" aria-hidden="true">
                <div data-part="fill" style={{ width: `${fill}%` }} />
              </div>
              <span data-part="time">{duration}</span>
            </div>
          </div>
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </>
  )
}
