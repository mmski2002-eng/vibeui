import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Frame012Props = Omit<ComponentPropsWithoutRef<"figure">, "title"> & {
  before?: ReactNode
  after?: ReactNode
  beforeLabel?: string
  afterLabel?: string
  caption?: string
}

// Идея компонента: сравнение «до» и «после» в одном кадре — два снимка
// side-by-side, разделённые вертикальной линией с ручкой посередине. Ручка
// декоративна и не перетаскивается: деление 50/50 задано flex-раскладкой,
// а не JS-драгом, поэтому компонент остаётся серверным. Подписи «До»/«После» —
// настоящий текст, а не оверлей на картинке, чтобы смысл не терялся без
// изображений и при печати.
const STYLES = `
:where([data-vibeui-block="frame-012"]){
--vibeui-frame-012-bg:oklch(1 0 0);
--vibeui-frame-012-fg:oklch(0.24 0.014 265);
--vibeui-frame-012-muted:oklch(0.55 0.014 265);
--vibeui-frame-012-border:oklch(0.89 0.006 265);
--vibeui-frame-012-accent:oklch(0.55 0.03 265);
--vibeui-frame-012-radius:0.875rem;
--vibeui-frame-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="frame-012"]{
display:block;margin:0;width:100%;box-sizing:border-box;
font-family:var(--vibeui-frame-012-font);color:var(--vibeui-frame-012-fg);
}
[data-vibeui-block="frame-012"] *{box-sizing:border-box}
[data-vibeui-block="frame-012"] [data-part="shell"]{
position:relative;overflow:hidden;
display:flex;
background:var(--vibeui-frame-012-bg);
border:1px solid var(--vibeui-frame-012-border);
border-radius:var(--vibeui-frame-012-radius);
aspect-ratio:16 / 9;
}
[data-vibeui-block="frame-012"] [data-part="pane"]{
position:relative;flex:1 1 50%;min-width:0;overflow:hidden;
}
[data-vibeui-block="frame-012"] [data-part="pane"]:first-child{border-right:1px solid var(--vibeui-frame-012-border)}
[data-vibeui-block="frame-012"] [data-part="pane"] > *{display:block;width:100%;height:100%}
[data-vibeui-block="frame-012"] img{display:block;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="frame-012"] [data-part="label"]{
position:absolute;top:0.625rem;left:0.625rem;z-index:2;
padding:0.25rem 0.625rem;border-radius:9999px;
background:var(--vibeui-frame-012-bg);
border:1px solid var(--vibeui-frame-012-border);
font-size:0.6875rem;font-weight:600;color:var(--vibeui-frame-012-fg);
}
[data-vibeui-block="frame-012"] [data-part="pane"]:last-child [data-part="label"]{left:auto;right:0.625rem}
[data-vibeui-block="frame-012"] [data-part="stub"]{
display:grid;place-items:center;height:100%;padding:1rem;
text-align:center;font-size:0.8125rem;color:var(--vibeui-frame-012-muted);
}
[data-vibeui-block="frame-012"] [data-part="handle"]{
position:absolute;top:50%;left:50%;z-index:3;
display:grid;place-items:center;
width:2rem;height:2rem;
transform:translate(-50%,-50%);
background:var(--vibeui-frame-012-bg);
border:1px solid var(--vibeui-frame-012-border);
border-radius:9999px;
font-size:0.625rem;color:var(--vibeui-frame-012-accent);
}
[data-vibeui-block="frame-012"] figcaption{
margin-top:0.75rem;font-size:0.75rem;line-height:1.4;
color:var(--vibeui-frame-012-muted);text-align:center;
}
@container (max-width: 22rem){
[data-vibeui-block="frame-012"] [data-part="shell"]{aspect-ratio:4 / 5;flex-direction:column}
[data-vibeui-block="frame-012"] [data-part="pane"]:first-child{border-right:0;border-bottom:1px solid var(--vibeui-frame-012-border)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="frame-012"] *{animation:none!important;transition:none!important}}
`

/**
 * Сравнение «до» и «после» двумя кадрами с разделителем по центру.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Frame012({
  before,
  after,
  beforeLabel = "До",
  afterLabel = "После",
  caption = "Сравнение до и после с разделителем по центру",
  className,
  style,
  ...props
}: Frame012Props) {
  return (
    <>
      <style href="vibeui-frame-012" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="frame-012"
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="shell">
          <div data-part="pane">
            <span data-part="label">{beforeLabel}</span>
            {before ?? <div data-part="stub">Кадр «до»</div>}
          </div>
          <div data-part="pane">
            <span data-part="label">{afterLabel}</span>
            {after ?? <div data-part="stub">Кадр «после»</div>}
          </div>
          <span data-part="handle" aria-hidden="true">
            ⟷
          </span>
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </>
  )
}
