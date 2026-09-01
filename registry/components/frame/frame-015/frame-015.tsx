import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Frame015Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "title"
> & {
  title?: string
  currentTime?: string
  duration?: string
  progress?: number
  caption?: string
  children?: ReactNode
}

// Идея компонента: кадр видеоплеера — обложка ролика, кнопка воспроизведения
// поверх затемнения и дорожка времени с уже пройденной долей. Затемнение
// снизу (scrim) нужно, чтобы заголовок и время читались на любой обложке,
// от светлого скриншота до тёмного кадра. Заполнение дорожки — единственный
// инлайн-стиль в файле: процент приходит из пропа и не выражается классом.
const STYLES = `
:where([data-vibeui-block="frame-015"]){
--vibeui-frame-015-bg:oklch(1 0 0);
--vibeui-frame-015-poster:oklch(0.24 0.02 265);
--vibeui-frame-015-fg:oklch(0.24 0.014 265);
--vibeui-frame-015-muted:oklch(0.55 0.014 265);
--vibeui-frame-015-border:oklch(0.89 0.006 265);
--vibeui-frame-015-light:oklch(0.98 0.002 265);
--vibeui-frame-015-accent:oklch(0.7 0.16 45);
--vibeui-frame-015-radius:0.875rem;
--vibeui-frame-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="frame-015"]{
display:block;margin:0;width:100%;max-width:30rem;box-sizing:border-box;
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
[data-vibeui-block="frame-015"] [data-part="stub"]{
display:grid;place-items:center;height:100%;padding:1rem;
text-align:center;font-size:0.8125rem;color:color-mix(in oklab,var(--vibeui-frame-015-light) 70%,transparent);
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
 * Кадр видеоплеера: обложка, кнопка воспроизведения и дорожка времени
 * с пройденной долей. Один файл, ноль зависимостей, собственная палитра.
 */
export function Frame015({
  title = "Обзор каталога VibeUI",
  currentTime = "1:24",
  duration = "4:12",
  progress = 32,
  caption = "Кадр видеоплеера: обложка, кнопка воспроизведения и дорожка времени",
  children,
  className,
  style,
  ...props
}: Frame015Props) {
  const fill = Math.min(100, Math.max(0, progress))

  return (
    <>
      <style href="vibeui-frame-015" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="frame-015"
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="shell">
          <div data-part="stage">
            <div data-part="poster">
              {children ?? <div data-part="stub">Обложка ролика</div>}
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
