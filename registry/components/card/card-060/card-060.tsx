import type { ComponentProps, CSSProperties } from "react"

export type Card060Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  image?: string
  imageAlt?: string
  role?: string
  quote?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока people-024, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-060"]){
--vibeui-card-060-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-060-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-060-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-060-hand:"Caveat","Segoe Script",cursive;
--vibeui-card-060-line:color-mix(in oklab,var(--vibeui-card-060-fg) 16%,transparent);
--vibeui-card-060-muted:color-mix(in oklab,var(--vibeui-card-060-fg) 62%,var(--vibeui-card-060-bg));
--vibeui-card-060-paper:color-mix(in oklab,#ffffff 70%,var(--vibeui-card-060-bg));
--vibeui-card-060-second:color-mix(in oklab,var(--vibeui-card-060-accent) 45%,#e0b000);
--vibeui-card-060-soft:color-mix(in oklab,var(--vibeui-card-060-fg) 6%,var(--vibeui-card-060-bg));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-060"]{color-scheme:dark}
[data-vibeui-block="card-060"]{box-sizing:border-box;min-width:min(100%,12rem);list-style:none}
[data-vibeui-block="card-060"] *{box-sizing:border-box}
[data-vibeui-block="card-060"]{position:relative;padding:.75rem .75rem 1rem;background:var(--vibeui-card-060-paper);border:1px solid var(--vibeui-card-060-line);box-shadow:0 24px 40px -28px rgb(0 0 0 / .5);transform:rotate(var(--vibeui-card-060-r));transition:transform .45s cubic-bezier(.2,.8,.2,1),box-shadow .4s}
[data-vibeui-block="card-060"]:nth-child(4n+1){--vibeui-card-060-r:-2.2deg}
[data-vibeui-block="card-060"]:nth-child(4n+2){--vibeui-card-060-r:1.6deg}
[data-vibeui-block="card-060"]:nth-child(4n+3){--vibeui-card-060-r:-1deg}
[data-vibeui-block="card-060"]:nth-child(4n+4){--vibeui-card-060-r:2.4deg}
[data-vibeui-block="card-060"]:hover{transform:rotate(0) translateY(-8px);box-shadow:0 34px 50px -30px rgb(0 0 0 / .55);z-index:1}
[data-vibeui-block="card-060"]::before{content:"";position:absolute;top:-.7rem;left:50%;width:5rem;height:1.4rem;transform:translateX(-50%) rotate(var(--vibeui-card-060-r));background:color-mix(in oklab,var(--vibeui-card-060-second) 55%,transparent);opacity:.85}
[data-vibeui-block="card-060"] [data-part="photo"]{position:relative;aspect-ratio:4/5;overflow:hidden;background:linear-gradient(135deg,var(--vibeui-card-060-soft),color-mix(in oklab,var(--vibeui-card-060-accent) 28%,var(--vibeui-card-060-bg)))}
[data-vibeui-block="card-060"] [data-part="photo"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .7s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="card-060"]:hover [data-part="photo"] img{transform:scale(1.05)}
[data-vibeui-block="card-060"] [data-part="name"]{margin:.9rem 0 0;font-family:var(--vibeui-card-060-hand);font-weight:700;font-size:1.75rem;line-height:1.05;color:var(--vibeui-card-060-fg)}
[data-vibeui-block="card-060"] [data-part="role"]{margin:.15rem 0 0;font-size:.82rem;font-weight:500;letter-spacing:.04em;text-transform:uppercase;color:var(--vibeui-card-060-accent)}
[data-vibeui-block="card-060"] [data-part="quote"]{margin:.6rem 0 0;font-family:var(--vibeui-card-060-hand);font-size:1.2rem;line-height:1.2;color:var(--vibeui-card-060-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-060"] *{animation:none!important;transition:none!important}}
`

/** Полароид участника команды: фото в белой рамке, подпись от руки и роль, лёгкий поворот через переменную. */
export function Card060({
  name = "Катя Рябова",
  image,
  imageAlt,
  role = "Старший соцработник",
  quote,
  accent,
  className,
  style,
  ...props
}: Card060Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-060-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-060" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-060"
        className={className}
        style={palette}
      >
        <div data-part="photo">{image ? <img src={image} alt={imageAlt ?? name} /> : null}</div>
        <h3 data-part="name">{name}</h3>
        <p data-part="role">{role}</p>
        {quote ? <p data-part="quote">{quote}</p> : null}
      </li>
    </>
  )
}
