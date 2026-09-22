import type { ComponentProps, CSSProperties } from "react"

export type Button094Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  aspect?: string
  caption?: string
  alt?: string
  src?: string
  openLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока restaurant-005, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-094"]){
--vibeui-button-094-accent:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-094"]{color-scheme:dark}
[data-vibeui-block="button-094"]{box-sizing:border-box}
[data-vibeui-block="button-094"] *{box-sizing:border-box}
[data-vibeui-block="button-094"]{position:relative;display:block;width:100%;padding:0;border:0;border-radius:.9rem;overflow:hidden;background:light-dark(#e7dfd2,#231d1a);cursor:zoom-in;aspect-ratio:var(--vibeui-button-094-aspect,3/2)}
[data-vibeui-block="button-094"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="button-094"]:hover img{transform:scale(1.05)}
[data-vibeui-block="button-094"][data-hidden="true"] img{visibility:hidden}
[data-vibeui-block="button-094"]:focus-visible{outline:2px solid var(--vibeui-button-094-accent);outline-offset:3px}
[data-vibeui-block="button-094"] [data-part="caption"]{position:absolute;left:.75rem;bottom:.75rem;padding:.3rem .6rem;border-radius:.4rem;background:rgb(20 17 16 / .6);color:#f2ebe0;font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;backdrop-filter:blur(6px);opacity:0;transform:translateY(4px);transition:opacity .3s,transform .3s}
[data-vibeui-block="button-094"]:hover [data-part="caption"]{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-094"] *{animation:none!important;transition:none!important}}
`

/** Кнопка-кадр галереи: фото с подписью и пропорцией через переменную; скрывается по data-hidden при открытии. */
export function Button094({
  aspect = "3 / 2",
  caption = "Кадр галереи",
  alt = "Кадр галереи",
  src = "/demo/realty/object-01.webp",
  openLabel = "Открыть фото",
  accent,
  className,
  style,
  ...props
}: Button094Props) {
  const palette = {
    ["--vibeui-button-094-aspect" as string]: aspect ?? "3 / 2",
    ...(accent ? { "--vibeui-button-094-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-094" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-094"
        type="button"
        aria-label={caption ?? alt ?? openLabel}
        className={className}
        style={palette}
      >
        {src ? <img src={src} alt={alt ?? ""} loading="lazy" /> : null}
        {caption ? <span data-part="caption">{caption}</span> : null}
      </button>
    </>
  )
}
