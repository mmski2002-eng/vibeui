import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Frame019Props = Omit<ComponentProps<"figure">, "title"> & {
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
--vibeui-frame-019-muted:color-mix(in oklab,var(--vibeui-frame-019-fg) 68%,transparent);
--vibeui-frame-019-border-a:light-dark(oklch(0.72 0.19 320),oklch(0.78 0.17 320));
--vibeui-frame-019-border-b:light-dark(oklch(0.75 0.17 230),oklch(0.8 0.15 230));
--vibeui-frame-019-glow-a:color-mix(in oklab,var(--vibeui-frame-019-border-a) 55%,transparent);
--vibeui-frame-019-glow-b:color-mix(in oklab,var(--vibeui-frame-019-border-b) 40%,transparent);
--vibeui-frame-019-radius:1rem;
--vibeui-frame-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="frame-019"]{color-scheme:dark}
[data-vibeui-block="frame-019"]{
display:block;margin:0;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:28rem;box-sizing:border-box;
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
/* Внутри светящейся рамки стоит небольшая карточка, а не строка текста:
   свечение должно обрамлять содержимое, иначе приём не читается. */
[data-vibeui-block="frame-019"] [data-part="card"] [data-part="stub"]{
display:flex;flex-direction:column;align-items:flex-start;gap:0.5rem;
min-height:9rem;padding:1.125rem 1.25rem;text-align:left;
font-size:0.8125rem;color:var(--vibeui-frame-019-muted);
}
[data-vibeui-block="frame-019"] [data-part="badge"]{
display:block;width:3rem;height:0.75rem;border-radius:9999px;
background:linear-gradient(120deg,var(--vibeui-frame-019-border-a),var(--vibeui-frame-019-border-b));
}
[data-vibeui-block="frame-019"] [data-part="stub-title"]{
margin:0;font-size:1rem;font-weight:700;line-height:1.25;
color:var(--vibeui-frame-019-fg);
}
[data-vibeui-block="frame-019"] [data-part="stub-line"]{
display:block;width:100%;height:0.4375rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-frame-019-fg) 16%,transparent);
}
[data-vibeui-block="frame-019"] [data-part="stub-line"] + [data-part="stub-line"]{width:64%}
[data-vibeui-block="frame-019"] [data-part="stub-cta"]{
display:block;width:5.5rem;height:1.5rem;margin-top:0.25rem;border-radius:0.5rem;
background:linear-gradient(120deg,var(--vibeui-frame-019-border-a),var(--vibeui-frame-019-border-b));
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
        data-slot="frame"
        data-vibeui-block="frame-019"
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="glow" aria-hidden="true" />
          <div data-part="border">
            <div data-part="card">
              {children ?? (
                <div data-part="stub">
                  <span data-part="badge" aria-hidden="true" />
                  <p data-part="stub-title">{stub}</p>
                  <span data-part="stub-line" aria-hidden="true" />
                  <span data-part="stub-line" aria-hidden="true" />
                  <span data-part="stub-cta" aria-hidden="true" />
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
