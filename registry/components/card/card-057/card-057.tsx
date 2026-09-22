import type { ComponentProps, CSSProperties } from "react"

export type Card057Props = Omit<ComponentProps<"article">, "title" | "children"> & {
  name?: string
  note?: string
  image?: string
  imageAlt?: string
  role?: string
  quote?: string
  peekLabel?: string
  noteLabel?: string
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока people-012, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-057"]){
--vibeui-card-057-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-057-display:"Playfair Display",ui-serif,Georgia,serif;
--vibeui-card-057-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-card-057-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-057-hand:"Caveat",cursive;
--vibeui-card-057-line:color-mix(in oklab,var(--vibeui-card-057-fg) 12%,transparent);
--vibeui-card-057-panel:color-mix(in oklab,var(--vibeui-card-057-fg) 6%,var(--vibeui-card-057-bg));
--vibeui-card-057-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-057"]{color-scheme:dark}
[data-vibeui-block="card-057"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="card-057"] *{box-sizing:border-box}
@keyframes vibeui-card-057-nudge{0%,100%{transform:translateY(0)}50%{transform:translateY(-.25rem)}}
@keyframes vibeui-card-057-in{from{opacity:0;translate:0 3rem;rotate:var(--vibeui-card-057-r,0deg)}to{opacity:1;translate:0 0;rotate:0deg}}
@keyframes vibeui-card-057-drift{from{translate:0 -4%}to{translate:0 4%}}
[data-vibeui-block="card-057"]{position:relative;display:grid;border-radius:1.4rem;overflow:clip;min-height:28rem;background:var(--vibeui-card-057-panel);box-shadow:0 30px 60px -40px rgb(0 0 0 / .5),0 0 0 1px var(--vibeui-card-057-line);transition:box-shadow .5s,transform .5s var(--vibeui-card-057-ease)}
[data-vibeui-block="card-057"]:hover{transform:translateY(-.4rem);box-shadow:0 40px 70px -40px color-mix(in oklab,var(--vibeui-card-057-accent) 40%,rgb(0 0 0 / .6)),0 0 0 1px var(--vibeui-card-057-line)}
[data-vibeui-block="card-057"] img{position:absolute;inset:-6% 0;width:100%;height:112%;object-fit:cover;object-position:50% 12%;transition:transform .8s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="card-057"]:hover img,[data-vibeui-block="card-057"]:focus-within img{transform:translateX(-18%) scale(1.04)}
[data-vibeui-block="card-057"] [data-part="front"]{position:relative;z-index:1;align-self:end;padding:1.5rem;background:linear-gradient(180deg,transparent,rgb(0 0 0 / .72));color:#fff}
[data-vibeui-block="card-057"] [data-part="front"] h3{margin:0;font-family:var(--vibeui-card-057-display);font-size:1.7rem;font-weight:600;letter-spacing:-.02em;line-height:1.05}
[data-vibeui-block="card-057"] [data-part="front"] p{margin:.3rem 0 0;opacity:.85;font-size:.92rem}
[data-vibeui-block="card-057"] [data-part="front"] q{display:block;margin-top:.9rem;font-family:var(--vibeui-card-057-hand);font-size:1.4rem;line-height:1.15;quotes:"«" "»"}
[data-vibeui-block="card-057"] [data-part="back"]{position:absolute;right:0;top:0;bottom:0;width:min(62%,20rem);z-index:2;padding:1.5rem;display:grid;align-content:center;gap:.75rem;background:var(--vibeui-card-057-panel);color:var(--vibeui-card-057-fg);transform:translateX(100%);transition:transform .6s cubic-bezier(.2,.8,.2,1);box-shadow:-20px 0 40px -30px rgb(0 0 0 / .5)}
[data-vibeui-block="card-057"]:hover [data-part="back"],[data-vibeui-block="card-057"]:focus-within [data-part="back"]{transform:none}
[data-vibeui-block="card-057"] [data-part="back"] small{font-size:.7rem;letter-spacing:.18em;text-transform:uppercase;font-weight:600;color:var(--vibeui-card-057-accent)}
[data-vibeui-block="card-057"] [data-part="back"] p{margin:0;font-family:var(--vibeui-card-057-hand);font-size:1.45rem;line-height:1.15}
[data-vibeui-block="card-057"] [data-part="back"]::before{content:"";position:absolute;left:.9rem;top:.9rem;width:2.4rem;height:.9rem;background:color-mix(in oklab,var(--vibeui-card-057-accent) 50%,transparent);transform:rotate(-8deg);border-radius:2px}
[data-vibeui-block="card-057"] [data-part="peek"]{position:absolute;right:1rem;top:1rem;z-index:3;padding:.4rem .7rem;border-radius:999px;background:rgb(255 255 255 / .85);backdrop-filter:blur(6px);font-size:.72rem;font-weight:600;color:#1a1a1a;animation:vibeui-card-057-nudge 2.6s ease-in-out infinite}
[data-vibeui-block="card-057"]{animation:vibeui-card-057-in linear both;animation-timeline:view();animation-range:entry 0% entry 45%}
[data-vibeui-block="card-057"] img{animation:vibeui-card-057-drift linear both;animation-timeline:view();animation-range:cover 0% cover 100%}
[data-vibeui-block="card-057"]:focus-visible{outline:2px solid var(--vibeui-card-057-accent);outline-offset:3px}
@media (hover:none){
[data-vibeui-block="card-057"] [data-part="back"]{position:relative;width:auto;transform:none;box-shadow:none}
[data-vibeui-block="card-057"] img{position:relative;height:20rem;inset:auto;animation:none}
[data-vibeui-block="card-057"] [data-part="front"]{position:absolute;left:0;right:0;top:0;height:20rem;align-content:end;display:grid}
[data-vibeui-block="card-057"] [data-part="peek"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-057"] *{animation:none!important;transition:none!important}}
`

/** Плитка участника для бенто-сетки: фото на всю плитку, имя и роль внизу, записка на обороте по фокусу. */
export function Card057({
  name = "Тимур",
  note = "В 5 утра я одна в пекарне. Включаю печь, ставлю чайник и слушаю, как потрескивает первая партия.",
  image = "/demo/realty/object-01.webp",
  imageAlt = "/demo/realty/object-02.webp",
  role = "Пекарь, закваске шесть лет",
  quote = "Бенто-плитка участника",
  peekLabel = "что в 5 утра?",
  noteLabel = "Записка",
  index = 0,
  accent,
  className,
  style,
  ...props
}: Card057Props) {
  const palette = {
    ["--vibeui-card-057-r" as string]: `${index % 2 === 0 ? -1.5 : 1.5}deg`,
    ...(accent ? { "--vibeui-card-057-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-057" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-slot="card"
        data-vibeui-block="card-057" tabIndex={note ? 0 : undefined}
        className={className}
        style={palette}
      >
        {image ? <img src={image} alt={imageAlt ?? `${name}${role ? `, ${role.toLowerCase()}` : ""}`} /> : null}
        {note && peekLabel ? (
          <span data-part="peek" aria-hidden="true">
            {peekLabel}
          </span>
        ) : null}
        <div data-part="front">
          <h3>{name}</h3>
          {role ? <p>{role}</p> : null}
          {quote ? <q>{quote}</q> : null}
        </div>
        {note ? (
          <div data-part="back">
            <small>{noteLabel}</small>
            <p>{note}</p>
          </div>
        ) : null}
      </article>
    </>
  )
}
