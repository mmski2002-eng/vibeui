import type { ComponentProps, CSSProperties } from "react"

export type Button101Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  title?: string
  styleText?: string
  image?: string
  imageAlt?: string
  meta?: string
  styleLabel?: (key: string) => string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока portfolio-007, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-101"]){
--vibeui-button-101-accent:#ff2bd6;
--vibeui-button-101-card:#110e1a;
--vibeui-button-101-cyan:#22f3ff;
--vibeui-button-101-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-button-101-line:rgb(255 255 255 / .12);
--vibeui-button-101-mono:"JetBrains Mono",ui-monospace,monospace;
--vibeui-button-101-muted:#a39bb5;
}
[data-vibeui-block="button-101"]{box-sizing:border-box}
[data-vibeui-block="button-101"] *{box-sizing:border-box}
[data-vibeui-block="button-101"]:focus-visible{outline:2px solid var(--vibeui-button-101-cyan);outline-offset:3px}
[data-vibeui-block="button-101"]{position:relative;display:block;width:100%;aspect-ratio:4/5;padding:0;border:0;border-radius:.9rem;overflow:hidden;background:var(--vibeui-button-101-card);cursor:pointer;color:inherit;font:inherit;text-align:left;isolation:isolate}
[data-vibeui-block="button-101"] img{width:100%;height:100%;object-fit:cover;display:block;filter:grayscale(1) contrast(1.1);transition:filter .6s,transform .9s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="button-101"]:hover img,[data-vibeui-block="button-101"]:focus-visible img{filter:grayscale(0) contrast(1);transform:scale(1.05)}
[data-vibeui-block="button-101"]::before{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 0 1px transparent;transition:box-shadow .4s;pointer-events:none;z-index:2}
[data-vibeui-block="button-101"]:hover::before{box-shadow:inset 0 0 0 1px var(--vibeui-button-101-accent),inset 0 0 24px color-mix(in oklab,var(--vibeui-button-101-accent) 35%,transparent),0 0 24px color-mix(in oklab,var(--vibeui-button-101-accent) 45%,transparent)}
[data-vibeui-block="button-101"] [data-part="cap"]{position:absolute;left:0;right:0;bottom:0;z-index:1;padding:2.5rem .9rem .9rem;background:linear-gradient(0deg,rgb(7 6 11 / .9),transparent);transform:translateY(30%);opacity:0;transition:transform .4s cubic-bezier(.2,.8,.2,1),opacity .4s}
[data-vibeui-block="button-101"]:hover [data-part="cap"],[data-vibeui-block="button-101"]:focus-visible [data-part="cap"]{transform:none;opacity:1}
[data-vibeui-block="button-101"] [data-part="cap"] b{display:block;font-family:var(--vibeui-button-101-display);font-size:.95rem;font-weight:600;line-height:1.2}
[data-vibeui-block="button-101"] [data-part="cap"] span{display:block;margin-top:.2rem;font-size:.78rem;color:var(--vibeui-button-101-muted)}
[data-vibeui-block="button-101"] [data-part="style-tag"]{position:absolute;left:.7rem;top:.7rem;z-index:1;padding:.25rem .55rem;border-radius:.35rem;background:rgb(7 6 11 / .65);border:1px solid var(--vibeui-button-101-line);font-family:var(--vibeui-button-101-mono);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;backdrop-filter:blur(6px)}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="button-101"] img{filter:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-101"] *{animation:none!important;transition:none!important}}
`

/** Кнопка-плитка портфолио: фото, тег стиля и подпись с названием и заметкой. */
export function Button101({
  title = "",
  styleText = "",
  image = "/demo/realty/object-01.webp",
  imageAlt = "/demo/realty/object-02.webp",
  meta = "Плитка работы с тегом стиля",
  styleLabel = (key) => key,
  accent,
  className,
  style,
  ...props
}: Button101Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-101-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-101" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-101" type="button" aria-label={`${title}, ${styleLabel?.(styleText)}`}
        className={className}
        style={palette}
      >
        <img src={image} alt={imageAlt ?? ""} loading="lazy" />
        <span data-part="style-tag">{styleLabel?.(styleText)}</span>
        <span data-part="cap">
          <b>{title}</b>
          {meta ? <span>{meta}</span> : null}
        </span>
      </button>
    </>
  )
}
