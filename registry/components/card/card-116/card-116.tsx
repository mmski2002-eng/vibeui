import type { ComponentProps, CSSProperties } from "react"

export type Card116Props = Omit<ComponentProps<"article">, "title" | "children"> & {
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

// Часть блока people-011, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-116"]){
--vibeui-card-116-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-116-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-116-card:light-dark(#ffffff,#242424);
--vibeui-card-116-display:"Cormorant Garamond",Georgia,serif;
--vibeui-card-116-fire:#ff9a3c;
--vibeui-card-116-line:light-dark(color-mix(in oklab,var(--vibeui-card-116-fg) 16%,transparent),color-mix(in oklab,var(--vibeui-card-116-fg) 24%,transparent));
--vibeui-card-116-muted:light-dark(#6b6b6b,#a3a3a3);
--vibeui-card-116-script:"Marck Script","Segoe Script",cursive;
--vibeui-card-116-silver:#9fb0c8;
--vibeui-card-116-fg:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-116"]{color-scheme:dark}
[data-vibeui-block="card-116"]{box-sizing:border-box}
[data-vibeui-block="card-116"] *{box-sizing:border-box}
@keyframes vibeui-card-116-flicker{0%,100%{transform:scaleX(1) scaleY(1)}30%{transform:scaleX(.9) scaleY(1.1)}60%{transform:scaleX(1.05) scaleY(.92)}}
[data-vibeui-block="card-116"]{position:relative;display:grid;grid-template-columns:5.5rem minmax(0,1fr);gap:.2rem 1.2rem;align-items:start;padding:1.4rem;border:1px solid var(--vibeui-card-116-line);border-radius:1rem;background:var(--vibeui-card-116-card);overflow:hidden;transition:border-color .4s,box-shadow .4s,transform .4s cubic-bezier(.2,.9,.3,1)}
[data-vibeui-block="card-116"]::before{content:"";position:absolute;inset:0;background:radial-gradient(30% 40% at 0 0,rgb(242 238 230 / .08),transparent 70%);pointer-events:none}
[data-vibeui-block="card-116"]:hover{transform:translateY(-.25rem);border-color:rgb(242 182 79 / .45);box-shadow:0 0 0 1px rgb(242 182 79 / .12),0 30px 50px -30px rgb(242 182 79 / .4)}
[data-vibeui-block="card-116"] [data-part="pic"]{grid-row:span 4;position:relative;display:block;width:5.5rem;height:5.5rem;border-radius:50%;overflow:hidden;background:var(--vibeui-card-116-bg);box-shadow:0 0 0 2px var(--vibeui-card-116-card),0 0 0 3px var(--vibeui-card-116-silver)}
[data-vibeui-block="card-116"] [data-part="pic"] img{display:block;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="card-116"] [data-part="candle"]{position:absolute;right:1.4rem;top:1.2rem;width:.7rem;height:1.5rem;border-radius:.15rem .15rem .1rem .1rem;background:linear-gradient(90deg,#e9e2d3,#fff9ea 40%,#d9d0bd)}
[data-vibeui-block="card-116"] [data-part="candle"]::before{content:"";position:absolute;left:50%;top:-.5rem;width:.12rem;height:.5rem;margin-left:-.06rem;background:#2a2118}
[data-vibeui-block="card-116"] [data-part="candle"]::after{content:"";position:absolute;left:50%;top:-1.25rem;width:.5rem;height:.85rem;margin-left:-.25rem;border-radius:50% 50% 45% 45%;background:radial-gradient(50% 60% at 50% 70%,#fff6d6,var(--vibeui-card-116-fire) 55%,transparent 80%);box-shadow:0 0 12px 3px rgb(255 154 60 / .4);transform-origin:50% 100%;animation:vibeui-card-116-flicker 1.5s ease-in-out infinite;transition:box-shadow .4s}
[data-vibeui-block="card-116"]:hover [data-part="candle"]::after{box-shadow:0 0 22px 8px rgb(255 154 60 / .55)}
[data-vibeui-block="card-116"] [data-part="name"]{margin:0;padding-right:2rem;font-family:var(--vibeui-card-116-display);font-size:1.7rem;font-weight:500;line-height:1.1}
[data-vibeui-block="card-116"] [data-part="role"]{font-family:var(--vibeui-card-116-script);font-size:1.15rem;color:var(--vibeui-card-116-accent)}
[data-vibeui-block="card-116"] [data-part="text"]{margin:.4rem 0 0;font-size:.92rem;color:var(--vibeui-card-116-muted)}
[data-vibeui-block="card-116"] [data-part="contact"]{display:inline-flex;align-items:center;gap:.45rem;margin-top:.8rem;width:max-content;font-family:var(--vibeui-card-116-display);font-size:.98rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--vibeui-card-116-silver);border-bottom:1px solid var(--vibeui-card-116-line);transition:color .25s,border-color .25s}
[data-vibeui-block="card-116"] [data-part="contact"]:hover{color:var(--vibeui-card-116-accent);border-color:var(--vibeui-card-116-accent)}
[data-vibeui-block="card-116"] [data-part="contact"] svg{width:1rem;height:1rem;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
@container (min-width:56rem){
[data-vibeui-block="card-116"] [data-part="pic"]{grid-row:auto;width:7rem;height:7rem;margin-bottom:.6rem}
[data-vibeui-block="card-116"] [data-part="name"]{padding-right:0}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-116"] *{animation:none!important;transition:none!important}}
`

/** Карточка сотрудника с «свечой»: фото, имя, роль; тёплый свет при наведении. */
export function Card116({
  image,
  imageAlt,
  name = "Кристина",
  role = "Свидетельница",
  text,
  contactLabel,
  contactHref,
  accent,
  className,
  style,
  ...props
}: Card116Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-116-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-116" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-slot="card"
        data-vibeui-block="card-116"
        className={className}
        style={palette}
      >
        <i data-part="candle" aria-hidden="true" />
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
