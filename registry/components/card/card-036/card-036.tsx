import type { ComponentProps, CSSProperties } from "react"

export type Card036Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  pet?: string
  date?: string
  sticker?: string
  photo?: string
  text?: string
  owner?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока testimonials-027, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-036"]){
--vibeui-card-036-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-036-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-036-display:"Nunito",ui-rounded,ui-sans-serif,system-ui,sans-serif;
--vibeui-card-036-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-036-hand:"Caveat",cursive;
--vibeui-card-036-line:color-mix(in oklab,var(--vibeui-card-036-fg) 12%,transparent);
--vibeui-card-036-muted:color-mix(in oklab,var(--vibeui-card-036-fg) 62%,var(--vibeui-card-036-bg));
--vibeui-card-036-on-accent:oklch(from var(--vibeui-card-036-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-card-036-paper:light-dark(#fffdf8,#26221f);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-036"]{color-scheme:dark}
[data-vibeui-block="card-036"]{box-sizing:border-box;min-width:min(100%,12rem);list-style:none}
[data-vibeui-block="card-036"] *{box-sizing:border-box}
[data-vibeui-block="card-036"]{position:relative;flex:0 0 16rem;scroll-snap-align:center;padding:.9rem .9rem 1.1rem;border-radius:.4rem;background:var(--vibeui-card-036-paper);box-shadow:0 1px 0 rgb(255 255 255 / .5) inset,0 20px 40px -24px rgb(0 0 0 / .5),0 0 0 1px var(--vibeui-card-036-line);transform:rotate(var(--vibeui-card-036-r));transition:transform .3s cubic-bezier(.34,1.4,.64,1),box-shadow .3s}
[data-vibeui-block="card-036"]:nth-child(4n+1){--vibeui-card-036-r:-3deg}
[data-vibeui-block="card-036"]:nth-child(4n+2){--vibeui-card-036-r:2deg}
[data-vibeui-block="card-036"]:nth-child(4n+3){--vibeui-card-036-r:-1.5deg}
[data-vibeui-block="card-036"]:nth-child(4n+4){--vibeui-card-036-r:3deg}
[data-vibeui-block="card-036"]:hover{transform:rotate(0) translateY(-8px) scale(1.02);box-shadow:0 30px 50px -24px rgb(0 0 0 / .55),0 0 0 1px var(--vibeui-card-036-line);z-index:2}
[data-vibeui-block="card-036"] [data-part="tape"]{position:absolute;left:50%;top:-.7rem;width:6rem;height:1.5rem;margin-left:-3rem;background:color-mix(in oklab,var(--vibeui-card-036-accent) 30%,rgb(255 255 255 / .6));opacity:.8;transform:rotate(-2deg);box-shadow:0 1px 3px rgb(0 0 0 / .1)}
[data-vibeui-block="card-036"] [data-part="photo"]{position:relative;aspect-ratio:4/5;overflow:hidden;background:linear-gradient(160deg,color-mix(in oklab,var(--vibeui-card-036-accent) 25%,var(--vibeui-card-036-bg)),color-mix(in oklab,var(--vibeui-card-036-accent) 60%,var(--vibeui-card-036-fg)))}
[data-vibeui-block="card-036"] [data-part="photo"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}
[data-vibeui-block="card-036"] [data-part="sticker"]{position:absolute;right:-.6rem;top:.8rem;z-index:2;padding:.35rem .7rem;border-radius:999px;background:var(--vibeui-card-036-accent);color:var(--vibeui-card-036-on-accent);font-family:var(--vibeui-card-036-display);font-weight:800;font-size:.75rem;transform:rotate(8deg);box-shadow:0 6px 14px -6px var(--vibeui-card-036-accent)}
[data-vibeui-block="card-036"] [data-part="caption"]{margin:.8rem 0 0;font-family:var(--vibeui-card-036-hand);font-weight:500;font-size:1.25rem;line-height:1.15;color:var(--vibeui-card-036-fg)}
[data-vibeui-block="card-036"] [data-part="caption"] b{display:block;font-weight:700;font-size:1.5rem}
[data-vibeui-block="card-036"] [data-part="meta"]{display:flex;justify-content:space-between;gap:.6rem;margin:.7rem 0 0;font-size:.75rem;color:var(--vibeui-card-036-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-036"] *{animation:none!important;transition:none!important}}
`

/** Карточка-полароид с лентой скотча: фото питомца, запись владельца от руки, дата и наклейка настроения. */
export function Card036({
  pet = "Марсель",
  date = "8 июня",
  sticker,
  photo,
  text = "Дерматолог нашёл, на что аллергия, за один приём. Три года чесался, месяц — нет.",
  owner = "Ира, хозяйка",
  accent,
  className,
  style,
  ...props
}: Card036Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-036-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-036" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-036"
        className={className}
        style={palette}
      >
        <i data-part="tape" aria-hidden="true" />
        {sticker ? <span data-part="sticker">{sticker}</span> : null}
        <div data-part="photo">{photo ? <img src={photo} alt={pet} loading="lazy" draggable={false} /> : null}</div>
        <p data-part="caption">
          <b>{pet}</b>
          {text}
        </p>
        <p data-part="meta">
          <span>{owner}</span>
          <span>{date}</span>
        </p>
      </li>
    </>
  )
}
