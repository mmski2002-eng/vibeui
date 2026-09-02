import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Frame019Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "title"
> & {
  caption?: string
  /** Надпись пустого кадра: компонент несёт русскую. */
  stub?: string
  /** Первый цвет градиентной рамки; от него же берётся свечение. */
  accent?: string
  /** Заливка кадра под содержимым: она держит середину градиентной рамки. */
  background?: string
  children?: ReactNode
}

// Идея компонента: кадр с рамкой-градиентом и мягким свечением под ним.
// Градиентная рамка нарисована без border — внешний блок залит градиентом
// и держит паддинг в 2px, внутренний блок сплошным фоном перекрывает
// середину, оставляя градиент только по кромке. Свечение — отдельный слой
// позади кадра: размытый радиальный градиент, сдвинутый вниз и увеличенный,
// поэтому читается как подсветка из-под кадра, а не заливка внутри него.
// Едва заметная пульсация свечения гасится по prefers-reduced-motion.
const STYLES = `
:where([data-vibeui-block="frame-019"]){
--vibeui-frame-019-bg:light-dark(oklch(1 0 0),oklch(0.23 0.012 265));
--vibeui-frame-019-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.005 265));
--vibeui-frame-019-muted:light-dark(oklch(0.55 0.014 265),oklch(0.72 0.012 265));
--vibeui-frame-019-border-a:light-dark(oklch(0.72 0.19 320),oklch(0.78 0.17 320));
--vibeui-frame-019-border-b:light-dark(oklch(0.75 0.17 230),oklch(0.8 0.15 230));
--vibeui-frame-019-glow-a:color-mix(in oklab,var(--vibeui-frame-019-border-a) 55%,transparent);
--vibeui-frame-019-glow-b:color-mix(in oklab,var(--vibeui-frame-019-border-b) 40%,transparent);
--vibeui-frame-019-radius:1rem;
--vibeui-frame-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="frame-019"]{
display:block;margin:0;width:100%;max-width:28rem;box-sizing:border-box;
font-family:var(--vibeui-frame-019-font);color:var(--vibeui-frame-019-fg);
}
[data-vibeui-block="frame-019"] *{box-sizing:border-box}
[data-vibeui-block="frame-019"] [data-part="stage"]{
position:relative;
padding:2.5rem 1.5rem;
}
[data-vibeui-block="frame-019"] [data-part="glow"]{
position:absolute;
inset:1.75rem 1rem -1.25rem;
z-index:0;
border-radius:999px;
background:radial-gradient(60% 70% at 50% 40%,var(--vibeui-frame-019-glow-a),transparent 72%),
radial-gradient(50% 60% at 70% 60%,var(--vibeui-frame-019-glow-b),transparent 70%);
filter:blur(1.75rem);
transform:translateY(0.75rem);
animation:vibeui-frame-019-pulse 5s ease-in-out infinite;
}
[data-vibeui-block="frame-019"] [data-part="border"]{
position:relative;z-index:1;
padding:2px;border-radius:var(--vibeui-frame-019-radius);
background:linear-gradient(135deg,var(--vibeui-frame-019-border-a),var(--vibeui-frame-019-border-b));
}
[data-vibeui-block="frame-019"] [data-part="card"]{
overflow:hidden;
background:var(--vibeui-frame-019-bg);
border-radius:calc(var(--vibeui-frame-019-radius) - 2px);
}
[data-vibeui-block="frame-019"] [data-part="card"] > *{display:block;width:100%}
[data-vibeui-block="frame-019"] img{display:block;width:100%;height:auto}
[data-vibeui-block="frame-019"] [data-part="stub"]{
display:grid;place-items:center;gap:0.5rem;
min-height:9rem;padding:1.75rem;text-align:center;
font-size:0.8125rem;color:var(--vibeui-frame-019-muted);
}
[data-vibeui-block="frame-019"] figcaption{
position:relative;z-index:1;margin-top:1rem;
font-size:0.75rem;line-height:1.4;text-align:center;
color:var(--vibeui-frame-019-muted);
}
@keyframes vibeui-frame-019-pulse{
0%,100%{opacity:0.75;transform:translateY(0.75rem) scale(1)}
50%{opacity:1;transform:translateY(0.75rem) scale(1.04)}
}
@container (max-width: 20rem){
[data-vibeui-block="frame-019"] [data-part="stage"]{padding:1.75rem 1rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="frame-019"] [data-part="glow"]{animation:none}
[data-vibeui-block="frame-019"] *{transition:none!important}
}
`

/**
 * Ветка темы для заданной заливки. Без неё светлая заливка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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
 * Кадр с рамкой-градиентом и мягким свечением под ним: сплошная заливка
 * держит середину рамки, размытый слой позади — эффект подсветки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Frame019({
  caption = "Кадр с рамкой-градиентом и мягким свечением под ним",
  stub = "Содержимое кадра",
  accent,
  background = "",
  children,
  className,
  style,
  ...props
}: Frame019Props) {
  const palette = {
    ...(accent ? { "--vibeui-frame-019-border-a": accent } : null),
    ...(background
      ? {
          "--vibeui-frame-019-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-frame-019" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="frame-019"
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="glow" aria-hidden="true" />
          <div data-part="border">
            <div data-part="card">
              {children ?? <div data-part="stub">{stub}</div>}
            </div>
          </div>
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    </>
  )
}
