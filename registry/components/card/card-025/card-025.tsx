import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Card025Ratio = "16/9" | "4/3" | "3/2" | "5/4" | "1/1" | "3/4" | "21/9" | "auto"

export type Card025Props = Omit<ComponentProps<"figure">, "children"> & {
  src?: string
  alt?: string
  ratio?: Card025Ratio
  /** Как картинка заполняет кадр: обрезать или вписать целиком. */
  fit?: "cover" | "contain"
  /** Скругление рамки: none — кадр внутри чужой рамки, lg — самостоятельный баннер. */
  radius?: "none" | "sm" | "md" | "lg"
  /** Плашка в углу кадра: дата, тег, «новое». */
  badge?: string
  /** Подпись под кадром. */
  caption?: string
  /** Затемнение снизу под наложенным содержимым. */
  scrim?: "none" | "bottom" | "full"
  /** Медленный дрейф картинки — для баннеров. */
  drift?: boolean
  /** Наложение поверх кадра внизу: заголовок, кнопки. */
  children?: ReactNode
  accent?: string
  /** Пусто — картинка без подложки; цвет виден, пока картинка не загрузилась, и при fit="contain". */
  background?: string
}

// Идея компонента: кадр — картинка в рамке с пропорцией, а всё, что поверх,
// приходит снаружи: плашка в углу, подпись, наложение внизу со скримом.
// Блокам с фотографией не нужно каждый раз заново собирать object-fit,
// радиус, затемнение и позиционирование наложения.
const STYLES = `
:where([data-vibeui-block="card-025"]){
--vibeui-card-025-bg:light-dark(oklch(0.94 0 0),oklch(0.25 0 0));
--vibeui-card-025-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-025-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-025-badge-bg:rgb(255 255 255 / .82);
--vibeui-card-025-badge-fg:#1a1a1a;
--vibeui-card-025-muted:color-mix(in oklab,var(--vibeui-card-025-fg) 60%,transparent);
--vibeui-card-025-radius:1.25rem;
--vibeui-card-025-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-card-025-ratio:16/9;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-025"]{color-scheme:dark}
[data-vibeui-block="card-025"]{
width:100%;margin:0;box-sizing:border-box;
color:var(--vibeui-card-025-fg);font-family:var(--vibeui-card-025-font);
}
[data-vibeui-block="card-025"] *{box-sizing:border-box}
[data-vibeui-block="card-025"] [data-part="frame"]{
position:relative;overflow:hidden;isolation:isolate;
aspect-ratio:var(--vibeui-card-025-ratio);
border-radius:var(--vibeui-card-025-radius);
background:var(--vibeui-card-025-bg);
}
[data-vibeui-block="card-025"][data-ratio="auto"] [data-part="frame"]{aspect-ratio:auto}
[data-vibeui-block="card-025"][data-radius="none"] [data-part="frame"]{border-radius:0}
[data-vibeui-block="card-025"][data-radius="sm"] [data-part="frame"]{border-radius:.5rem}
[data-vibeui-block="card-025"][data-radius="lg"] [data-part="frame"]{border-radius:2rem}
[data-vibeui-block="card-025"] [data-part="image"]{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;
}
[data-vibeui-block="card-025"][data-ratio="auto"] [data-part="image"]{position:static;height:auto}
[data-vibeui-block="card-025"][data-fit="contain"] [data-part="image"]{object-fit:contain}
[data-vibeui-block="card-025"][data-drift="true"] [data-part="image"]{animation:vibeui-card-025-drift 24s ease-in-out infinite alternate}
@keyframes vibeui-card-025-drift{from{transform:scale(1.04) translate(-1%,0)}to{transform:scale(1.1) translate(1%,-1%)}}
[data-vibeui-block="card-025"] [data-part="scrim"]{position:absolute;inset:0;pointer-events:none}
[data-vibeui-block="card-025"][data-scrim="bottom"] [data-part="scrim"]{background:linear-gradient(180deg,transparent 35%,rgb(0 0 0 / .62))}
[data-vibeui-block="card-025"][data-scrim="full"] [data-part="scrim"]{background:rgb(0 0 0 / .38)}
[data-vibeui-block="card-025"] [data-part="badge"]{
position:absolute;left:1rem;top:1rem;z-index:1;
padding:.4rem .8rem;border-radius:999px;
background:var(--vibeui-card-025-badge-bg);color:var(--vibeui-card-025-badge-fg);
font-size:.8125rem;font-weight:600;line-height:1;backdrop-filter:blur(6px);
}
[data-vibeui-block="card-025"] [data-part="overlay"]{
position:absolute;left:0;right:0;bottom:0;z-index:1;
display:flex;flex-wrap:wrap;align-items:end;justify-content:space-between;gap:1rem;
padding:1.25rem;color:#fff;
}
[data-vibeui-block="card-025"] [data-part="caption"]{margin:.625rem 0 0;color:var(--vibeui-card-025-muted);font-size:.875rem;line-height:1.5}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-025"] *{animation:none!important;transition:none!important}}
`

/**
 * Кадр: картинка с пропорцией, плашкой в углу, подписью и наложением внизу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Card025({
  src = "",
  alt = "",
  ratio = "16/9",
  fit = "cover",
  radius = "md",
  badge,
  caption,
  scrim = "none",
  drift = false,
  children,
  accent,
  background,
  className,
  style,
  ...props
}: Card025Props) {
  const palette = {
    ...(ratio !== "auto" ? { "--vibeui-card-025-ratio": ratio } : null),
    ...(accent ? { "--vibeui-card-025-accent": accent } : null),
    ...(background ? { "--vibeui-card-025-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-025" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="card"
        data-vibeui-block="card-025"
        data-ratio={ratio}
        data-fit={fit}
        data-radius={radius}
        data-scrim={scrim}
        data-drift={drift || undefined}
        className={className}
        style={palette}
      >
        <div data-part="frame">
          {src ? <img data-part="image" src={src} alt={alt} loading="lazy" /> : null}
          {scrim !== "none" ? <div data-part="scrim" aria-hidden="true" /> : null}
          {badge ? <span data-part="badge">{badge}</span> : null}
          {children ? <div data-part="overlay">{children}</div> : null}
        </div>
        {caption ? <figcaption data-part="caption">{caption}</figcaption> : null}
      </figure>
    </>
  )
}
