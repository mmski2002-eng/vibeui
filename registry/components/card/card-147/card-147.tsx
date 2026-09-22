import type { ComponentProps, CSSProperties } from "react"

export type Card147Props = Omit<ComponentProps<"a">, "title" | "children"> & {
  href?: string
  kicker?: string
  look?: "warm" | "paper" | "dark"
  src?: string
  title?: string
  note?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока footer-017, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-147"]){
--vibeui-card-147-accent:#1a1a1a;
--vibeui-card-147-dur-2:180ms;
--vibeui-card-147-muted:color-mix(in oklab,#000000 56%,#ffffff);
}
[data-vibeui-block="card-147"]{box-sizing:border-box}
[data-vibeui-block="card-147"] *{box-sizing:border-box}
[data-vibeui-block="card-147"]{display:flex;flex-direction:column;gap:0.875rem;
color:inherit;text-decoration:none;}
[data-vibeui-block="card-147"] [data-part="kicker"]{display:inline-flex;align-items:center;gap:0.625rem;
font-size:0.8125rem;font-weight:640;letter-spacing:0.1em;text-transform:uppercase;
color:var(--vibeui-card-147-accent);}
[data-vibeui-block="card-147"] [data-part="frame"]{aspect-ratio:21/9;overflow:hidden;position:relative;
background:linear-gradient(150deg,#3b3129 0%,#14100d 76%);}
[data-vibeui-block="card-147"] [data-part="frame"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;}
[data-vibeui-block="card-147"] [data-part="frame"]::after{content:"";position:absolute;inset:0;
background:radial-gradient(24rem 13rem at 70% 26%,rgb(255 165 95 / 30%),transparent 64%);}
[data-vibeui-block="card-147"] [data-part="frame"][data-look="paper"]{background:linear-gradient(150deg,#ececea 0%,#d2cfc8 100%);}
[data-vibeui-block="card-147"] [data-part="frame"][data-look="paper"]::after{content:none}
[data-vibeui-block="card-147"] [data-part="frame"][data-look="dark"]{background:linear-gradient(150deg,#1a1a1a 0%,#000000 88%);}
[data-vibeui-block="card-147"] [data-part="frame"][data-look="dark"]::after{content:none}
[data-vibeui-block="card-147"]:hover [data-part="frame"]{outline:3px solid var(--vibeui-card-147-accent);outline-offset:-3px;}
[data-vibeui-block="card-147"] [data-part="caption"]{display:flex;align-items:baseline;gap:1rem;flex-wrap:wrap;}
[data-vibeui-block="card-147"] [data-part="caption"] strong{font-size:clamp(1.5rem,3.6cqi,2.375rem);letter-spacing:-0.02em;font-weight:690;
transition:color var(--vibeui-card-147-dur-2) ease;}
[data-vibeui-block="card-147"]:hover strong{color:var(--vibeui-card-147-accent)}
[data-vibeui-block="card-147"] [data-part="caption"] span{font-size:0.9375rem;color:var(--vibeui-card-147-muted);}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-147"] *{animation:none!important;transition:none!important}}
`

/** Ссылка-карточка следующего проекта: кикер, кадр с фото по data-look и подпись. */
export function Card147({
  href = "#next-case",
  kicker = "Следующий проект",
  look = "warm",
  src = "/demo/realty/object-01.webp",
  title = "Дом на склоне",
  note = "Архитектура · 2026",
  accent,
  className,
  style,
  ...props
}: Card147Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-147-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-147" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-slot="card"
        data-vibeui-block="card-147" href={href}
        className={className}
        style={palette}
      >
        <span data-part="kicker">{kicker}</span>
        <span
          data-part="frame"
          data-look={look === "warm" ? undefined : look}
          aria-hidden={src ? undefined : "true"}
        >
          {src ? <img src={src} alt={title} /> : null}
        </span>
        <span data-part="caption">
          <strong>{title}</strong>
          <span>{note}</span>
        </span>
      </a>
    </>
  )
}
