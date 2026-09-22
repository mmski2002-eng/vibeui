import type { ComponentProps, CSSProperties } from "react"

export type Button124Props = Omit<ComponentProps<"a">, "title" | "children"> & {
  prevHref?: string
  prevCaption?: string
  prevLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-016, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-124"]){
--vibeui-button-124-accent:#1a1a1a;
--vibeui-button-124-dur-2:180ms;
--vibeui-button-124-line:color-mix(in oklab,#000000 11%,transparent);
--vibeui-button-124-muted:color-mix(in oklab,#000000 56%,#ffffff);
}
[data-vibeui-block="button-124"]{box-sizing:border-box}
[data-vibeui-block="button-124"] *{box-sizing:border-box}
[data-vibeui-block="button-124"]{display:flex;flex-direction:column;gap:0.25rem;
padding:1rem 1.125rem;border:1px solid var(--vibeui-button-124-line);
color:inherit;text-decoration:none;min-width:0;
transition:border-color var(--vibeui-button-124-dur-2) ease;}
[data-vibeui-block="button-124"]:hover{border-color:var(--vibeui-button-124-accent);}
[data-vibeui-block="button-124"] span{font-size:0.8125rem;color:var(--vibeui-button-124-muted);}
[data-vibeui-block="button-124"] strong{font-size:1rem;font-weight:620;letter-spacing:-0.01em;line-height:1.35;}
[data-vibeui-block="button-124"][data-dir="next"]{text-align:right;align-items:flex-end}
[data-vibeui-block="button-124"][data-dir="next"] strong::after{content:" →"}
[data-vibeui-block="button-124"][data-dir="prev"] strong::before{content:"← "}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-124"] *{animation:none!important;transition:none!important}}
`

/** Ссылка навигации по страницам документации: подпись и название; направление по data-dir. */
export function Button124({
  prevHref = "#install",
  prevCaption = "Назад",
  prevLabel = "Установка",
  accent,
  className,
  style,
  ...props
}: Button124Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-124-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-124" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-slot="button"
        data-vibeui-block="button-124" data-dir="prev" href={prevHref}
        className={className}
        style={palette}
      >
        <span>{prevCaption}</span>
        <strong>{prevLabel}</strong>
      </a>
    </>
  )
}
