import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Frame012Props = Omit<ComponentProps<"figure">, "title"> & {
  before?: ReactNode
  after?: ReactNode
  beforeLabel?: string
  afterLabel?: string
  caption?: string
  /** Надпись пустой левой панели: компонент несёт русскую. */
  beforeStub?: string
  /** Надпись пустой правой панели: компонент несёт русскую. */
  afterStub?: string
  accent?: string
  /** Пусто — подложки нет, кадр ложится на фон страницы. */
  background?: string
}

// Идея компонента: сравнение «до» и «после» в одном кадре — два снимка
// side-by-side, разделённые вертикальной линией с ручкой посередине. Ручка
// декоративна и не перетаскивается: деление 50/50 задано flex-раскладкой,
// а не JS-драгом, поэтому компонент остаётся серверным. Подписи «До»/«После» —
// настоящий текст, а не оверлей на картинке, чтобы смысл не терялся без
// изображений и при печати.
const STYLES = `
:where([data-vibeui-block="frame-012"]){
--vibeui-frame-012-bg:transparent;
--vibeui-frame-012-chip:light-dark(oklch(1 0 0),oklch(0.3 0.01 265));
--vibeui-frame-012-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.005 265));
--vibeui-frame-012-muted:color-mix(in oklab,var(--vibeui-frame-012-fg) 68%,transparent);
--vibeui-frame-012-border:light-dark(oklch(0.89 0.006 265),oklch(0.4 0.011 265));
--vibeui-frame-012-accent:light-dark(oklch(0.55 0.03 265),oklch(0.76 0.03 265));
--vibeui-frame-012-radius:0.875rem;
--vibeui-frame-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="frame-012"]{color-scheme:dark}
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
background:var(--vibeui-frame-012-chip);
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
background:var(--vibeui-frame-012-chip);
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
 * Сравнение «до» и «после» двумя кадрами с разделителем по центру.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Frame012({
  before,
  after,
  beforeLabel = "До",
  afterLabel = "После",
  caption = "Сравнение до и после с разделителем по центру",
  beforeStub = "Кадр «до»",
  afterStub = "Кадр «после»",
  accent,
  background = "",
  className,
  style,
  ...props
}: Frame012Props) {
  const palette = {
    ...(accent ? { "--vibeui-frame-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-frame-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-frame-012" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="frame"
        data-vibeui-block="frame-012"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="pane">
            <span data-part="label">{beforeLabel}</span>
            {before ?? <div data-part="stub">{beforeStub}</div>}
          </div>
          <div data-part="pane">
            <span data-part="label">{afterLabel}</span>
            {after ?? <div data-part="stub">{afterStub}</div>}
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
