import type { ComponentProps, CSSProperties } from "react"

export type Card115Props = Omit<ComponentProps<"article">, "title" | "children"> & {
  image?: string
  imageAlt?: string
  name?: string
  role?: string
  text?: string
  contactLabel?: string
  contactHref?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока people-010, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-115"]){
--vibeui-card-115-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-115-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-card-115-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-115-line:light-dark(#e2d8ca,#2e2e2e);
--vibeui-card-115-muted:light-dark(#7a6a70,#a3a3a3);
--vibeui-card-115-paper:light-dark(#ffffff,#2a2a2a);
--vibeui-card-115-plum:var(--vibeui-card-115-fg);
--vibeui-card-115-sand:light-dark(#d9c5a5,#5a4a3a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-115"]{color-scheme:dark}
[data-vibeui-block="card-115"]{box-sizing:border-box}
[data-vibeui-block="card-115"] *{box-sizing:border-box}
[data-vibeui-block="card-115"]{width:min(100%,18rem);padding:.9rem .9rem 1.2rem;background:var(--vibeui-card-115-paper);box-shadow:0 20px 40px -24px rgb(43 26 36 / .55),0 1px 0 var(--vibeui-card-115-line);transform:rotate(var(--vibeui-people-010-tilt,0deg));transition:transform .4s cubic-bezier(.2,.9,.3,1.2),box-shadow .4s}
[data-vibeui-block="card-115"]:hover{transform:rotate(0) translateY(-.4rem);box-shadow:0 30px 50px -24px rgb(43 26 36 / .6),0 1px 0 var(--vibeui-card-115-line)}
[data-vibeui-block="card-115"] [data-part="pic"]{display:block;aspect-ratio:1;overflow:hidden;background:var(--vibeui-card-115-sand)}
[data-vibeui-block="card-115"] [data-part="pic"] img{display:block;width:100%;height:100%;object-fit:cover;filter:saturate(.9)}
[data-vibeui-block="card-115"] [data-part="name"]{margin:1rem 0 0;font-family:var(--vibeui-card-115-display);font-style:italic;font-size:1.6rem;font-weight:500;line-height:1.1;color:var(--vibeui-card-115-plum)}
[data-vibeui-block="card-115"] [data-part="role"]{display:block;margin-top:.2rem;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-card-115-accent)}
[data-vibeui-block="card-115"] [data-part="text"]{margin:.6rem 0 0;font-size:.92rem;color:var(--vibeui-card-115-muted)}
[data-vibeui-block="card-115"] [data-part="contact"]{display:inline-flex;align-items:center;gap:.4rem;margin-top:.8rem;font-size:.88rem;font-weight:600;color:var(--vibeui-card-115-fg);text-decoration:none;border-bottom:1px solid var(--vibeui-card-115-accent);transition:color .25s}
[data-vibeui-block="card-115"] [data-part="contact"]:hover{color:var(--vibeui-card-115-accent)}
[data-vibeui-block="card-115"] [data-part="contact"]:focus-visible{outline:2px solid var(--vibeui-card-115-accent);outline-offset:3px}
[data-vibeui-block="card-115"] [data-part="contact"] svg{width:.95rem;height:.95rem;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-115"] *{animation:none!important;transition:none!important}}
`

/** Карточка сотрудника: фото, имя, роль и короткий текст. */
export function Card115({
  image = "/demo/realty/object-01.webp",
  imageAlt = "/demo/realty/object-02.webp",
  name = "Ксения",
  role = "Свидетельница",
  text = "Карточка человека с фото",
  contactLabel = "Написать в Telegram",
  contactHref = "#",
  accent,
  className,
  style,
  ...props
}: Card115Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-115-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-115" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-slot="card"
        data-vibeui-block="card-115"
        className={className}
        style={palette}
      >
        <span data-part="pic">{image ? <img src={image} alt={imageAlt ?? name} loading="lazy" /> : null}</span>
        <h3 data-part="name">{name}</h3>
        <span data-part="role">{role}</span>
        {text ? <p data-part="text">{text}</p> : null}
        {contactLabel && contactHref ? (
          <a data-part="contact" href={contactHref}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {contactHref.startsWith("tel:") ? (
                <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2 3.6.8v3.2A1.5 1.5 0 0 1 17.5 21 16 16 0 0 1 3 6.5 1.5 1.5 0 0 1 4.8 5H8l.8 3.6z" />
              ) : contactHref.startsWith("mailto:") ? (
                <path d="M4 6h16v12H4zM4 7l8 6 8-6" />
              ) : (
                <path d="M4 12l16-7-4 14-4-5zM12 14l8-9" />
              )}
            </svg>
            {contactLabel}
          </a>
        ) : null}
      </article>
    </>
  )
}
