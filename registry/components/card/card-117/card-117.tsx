import type { ComponentProps, CSSProperties } from "react"

export type Card117Props = Omit<ComponentProps<"a">, "title" | "children"> & {
  name?: string
  href?: string
  image?: string
  role?: string
  episode?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

const DEFAULT_GUESTS: Card117Guest[] = [
  { name: "Сергей Волков", role: "смотритель маяка", episode: "№ 112", image: "/demo/podcast/guest-01.webp", href: "#episodes" },
  { name: "Аня Резник", role: "керамист", episode: "№ 111", image: "/demo/podcast/guest-02.webp", href: "#episodes" },
  { name: "Марат Исмаилов", role: "кардиохирург", episode: "№ 110", image: "/demo/podcast/guest-03.webp", href: "#episodes" },
  { name: "Лена Царёва", role: "бэкенд-разработчица", episode: "№ 109", image: "/demo/podcast/guest-04.webp", href: "#episodes" },
  { name: "Игорь Найдёнов", role: "машинист", episode: "№ 108", image: "/demo/podcast/guest-05.webp", href: "#episodes" },
  { name: "Ольга Мень", role: "библиотекарь", episode: "№ 107", image: "/demo/podcast/guest-06.webp", href: "#episodes" },
  { name: "Даниил Штерн", role: "шеф-повар", episode: "№ 106", image: "/demo/podcast/guest-07.webp", href: "#episodes" },
  { name: "Вика Лим", role: "флорист", episode: "№ 105", image: "/demo/podcast/guest-08.webp", href: "#episodes" },
]

// Часть блока people-013, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-117"]){
--vibeui-card-117-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-117-display:"Sofia Sans Extra Condensed",Impact,"Arial Narrow",sans-serif;
--vibeui-card-117-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-card-117-line:color-mix(in oklab,var(--vibeui-card-117-fg) 12%,transparent);
--vibeui-card-117-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-card-117-muted:color-mix(in oklab,var(--vibeui-card-117-fg) 60%,var(--vibeui-card-117-bg));
--vibeui-card-117-panel:color-mix(in oklab,var(--vibeui-card-117-fg) 6%,var(--vibeui-card-117-bg));
--vibeui-card-117-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-117-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-117"]{color-scheme:dark}
[data-vibeui-block="card-117"]{box-sizing:border-box}
[data-vibeui-block="card-117"] *{box-sizing:border-box}
@keyframes vibeui-card-117-deal{from{opacity:0;translate:0 3rem;rotate:-6deg;scale:.9}}
[data-vibeui-block="card-117"]{position:relative;display:grid;grid-template-columns:5rem 1fr;gap:.9rem;align-items:center;width:18rem;padding:1rem 1rem 1rem;border-radius:1rem;background:var(--vibeui-card-117-panel);box-shadow:0 0 0 1px var(--vibeui-card-117-line),0 20px 40px -30px rgb(0 0 0 / .8);color:inherit;text-decoration:none;overflow:hidden;transition:transform .4s var(--vibeui-card-117-ease),box-shadow .4s}
[data-vibeui-block="card-117"]:nth-child(even){transform:translateY(1.2rem)}
[data-vibeui-block="card-117"]::before{content:"";position:absolute;right:-1.4rem;top:-1.4rem;width:2.8rem;height:2.8rem;rotate:45deg;background:var(--vibeui-card-117-accent);transition:scale .4s var(--vibeui-card-117-ease)}
[data-vibeui-block="card-117"]::after{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(115deg,transparent 35%,rgb(255 255 255 / .08) 50%,transparent 65%);translate:-100% 0;transition:translate .8s var(--vibeui-card-117-ease);pointer-events:none}
[data-vibeui-block="card-117"]:hover{transform:translateY(-.4rem) rotate(-1deg);box-shadow:0 0 0 2px var(--vibeui-card-117-accent),0 30px 60px -30px color-mix(in oklab,var(--vibeui-card-117-accent) 60%,rgb(0 0 0 / .6));z-index:1}
[data-vibeui-block="card-117"]:nth-child(even):hover{transform:translateY(.8rem) rotate(1deg)}
[data-vibeui-block="card-117"]:hover::before{scale:1.4}
[data-vibeui-block="card-117"]:hover::after{translate:100% 0}
[data-vibeui-block="card-117"]:focus-visible{outline:2px solid var(--vibeui-card-117-accent);outline-offset:3px}
[data-vibeui-block="card-117"] [data-part="pic"]{width:5rem;height:5rem;border-radius:.7rem;overflow:hidden;background:var(--vibeui-card-117-line);box-shadow:0 0 0 1px var(--vibeui-card-117-line)}
[data-vibeui-block="card-117"] [data-part="pic"] img{width:100%;height:100%;object-fit:cover;display:block;filter:grayscale(.6) contrast(1.05);transition:filter .5s,transform .6s var(--vibeui-card-117-ease)}
[data-vibeui-block="card-117"]:hover [data-part="pic"] img{filter:none;transform:scale(1.08)}
[data-vibeui-block="card-117"] [data-part="body"]{min-width:0;display:grid;gap:.15rem}
[data-vibeui-block="card-117"] [data-part="name"]{font-family:var(--vibeui-card-117-display);font-weight:700;font-size:1.5rem;line-height:1;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
[data-vibeui-block="card-117"] [data-part="role"]{font-size:.8rem;color:var(--vibeui-card-117-muted);line-height:1.25}
[data-vibeui-block="card-117"] [data-part="foot"]{display:flex;align-items:center;justify-content:space-between;gap:.6rem;margin-top:.5rem}
[data-vibeui-block="card-117"] [data-part="ep"]{font-family:var(--vibeui-card-117-mono);font-size:.68rem;letter-spacing:.12em;color:var(--vibeui-card-117-accent);white-space:nowrap}
[data-vibeui-block="card-117"] [data-part="code"]{flex:1;max-width:5rem;height:.9rem;background:repeating-linear-gradient(90deg,currentColor 0 2px,transparent 2px 4px,currentColor 4px 5px,transparent 5px 8px,currentColor 8px 11px,transparent 11px 13px);opacity:.35;transition:opacity .3s}
[data-vibeui-block="card-117"]:hover [data-part="code"]{opacity:.8}
@supports (animation-timeline: view()){
[data-vibeui-block="card-117"]{animation:vibeui-card-117-deal linear both;animation-timeline:view();animation-range:entry 0% entry 40%}
[data-vibeui-block="card-117"]:nth-child(8n+1){animation-range:entry 0% entry 30%}
[data-vibeui-block="card-117"]:nth-child(8n+2){animation-range:entry 0% entry 39%}
[data-vibeui-block="card-117"]:nth-child(8n+3){animation-range:entry 0% entry 48%}
[data-vibeui-block="card-117"]:nth-child(8n+4){animation-range:entry 0% entry 57%}
[data-vibeui-block="card-117"]:nth-child(8n+5){animation-range:entry 0% entry 66%}
[data-vibeui-block="card-117"]:nth-child(8n+6){animation-range:entry 0% entry 75%}
[data-vibeui-block="card-117"]:nth-child(8n+7){animation-range:entry 0% entry 84%}
[data-vibeui-block="card-117"]:nth-child(8n+8){animation-range:entry 0% entry 93%}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="card-117"][aria-hidden="true"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-117"] *{animation:none!important;transition:none!important}}
`

/** Ссылка-карточка гостя для бегущей ленты: фото, имя и подпись. */
export function Card117({
  name,
  href,
  image,
  role,
  episode,
  accent,
  className,
  style,
  ...props
}: Card117Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-117-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-117" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-slot="card"
        data-vibeui-block="card-117" href={href ?? "#"}
        className={className}
        style={palette}
      >
        <span data-part="pic">{image ? <img src={image} alt="" /> : null}</span>
        <span data-part="body">
          <span data-part="name">{name}</span>
          {role ? <span data-part="role">{role}</span> : null}
          <span data-part="foot">
            {episode ? <span data-part="ep">{episode}</span> : null}
            <span data-part="code" aria-hidden="true" />
          </span>
        </span>
      </a>
    </>
  )
}
