import type { ComponentProps, CSSProperties } from "react"

export type Card091Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  work?: string
  workAlt?: string
  gain?: string
  image?: string
  before?: string
  after?: string
  quote?: string
  href?: string
  beforeLabel?: string
  afterLabel?: string
  linkLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока course-003, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-091"]){
--vibeui-card-091-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-091-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-091-card:light-dark(#ffffff,#242424);
--vibeui-card-091-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-091-line:light-dark(#e5e7eb,#2e2e2e);
--vibeui-card-091-marker:light-dark(#d9f99d,rgb(163 230 53 / .3));
--vibeui-card-091-muted:light-dark(#6b7280,#a3a3a3);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-091"]{color-scheme:dark}
[data-vibeui-block="card-091"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-091"] *{box-sizing:border-box}
[data-vibeui-block="card-091"]{position:relative;flex:0 0 min(82%,34rem);scroll-snap-align:start;display:flex;flex-direction:column;overflow:hidden;border-radius:1.4rem;background:var(--vibeui-card-091-card);border:1px solid var(--vibeui-card-091-line);transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s}
[data-vibeui-block="card-091"]:hover{transform:translateY(-4px);box-shadow:0 30px 50px -30px rgb(17 24 39 / .35)}
[data-vibeui-block="card-091"]::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(22rem circle at var(--vibeui-course-003-mx,50%) var(--vibeui-course-003-my,50%),color-mix(in oklab,var(--vibeui-card-091-accent) 18%,transparent),transparent 60%);opacity:0;transition:opacity .4s}
[data-vibeui-block="card-091"]:hover::after{opacity:1}
[data-vibeui-block="card-091"] [data-part="work"]{position:relative;aspect-ratio:16/10;overflow:hidden;background:light-dark(#e5e7eb,#1f2430)}
[data-vibeui-block="card-091"] [data-part="work"] img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 1.2s cubic-bezier(.2,.8,.2,1);-webkit-user-drag:none;user-select:none}
[data-vibeui-block="card-091"]:hover [data-part="work"] img{transform:scale(1.04)}
[data-vibeui-block="card-091"] [data-part="gain"]{position:absolute;left:1rem;top:1rem;padding:.4rem .75rem;border-radius:.6rem;background:var(--vibeui-card-091-marker);color:#1a2e05;font-family:var(--vibeui-card-091-display);font-size:.78rem;font-weight:600;box-shadow:0 10px 20px -12px rgb(0 0 0 / .4)}
[data-vibeui-block="card-091"] [data-part="body"]{display:grid;gap:1rem;padding:1.25rem}
[data-vibeui-block="card-091"] [data-part="who"]{display:flex;align-items:center;gap:.75rem}
[data-vibeui-block="card-091"] [data-part="avatar"]{width:2.75rem;height:2.75rem;border-radius:50%;object-fit:cover;flex:none;background:light-dark(#e5e7eb,#1f2430);-webkit-user-drag:none}
[data-vibeui-block="card-091"] [data-part="name"]{font-weight:600}
[data-vibeui-block="card-091"] [data-part="path"]{display:grid;grid-template-columns:1fr auto 1fr;gap:.75rem;align-items:center;padding:.9rem 1rem;border-radius:.9rem;background:var(--vibeui-card-091-bg);font-size:.85rem}
[data-vibeui-block="card-091"] [data-part="path"] small{display:block;font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-card-091-muted);margin-bottom:.2rem}
[data-vibeui-block="card-091"] [data-part="after"]{font-weight:600;color:var(--vibeui-card-091-accent)}
[data-vibeui-block="card-091"] [data-part="arrow"]{width:2.75rem;height:1.5rem;color:var(--vibeui-card-091-accent)}
[data-vibeui-block="card-091"] [data-part="arrow"] path{stroke-dasharray:60;stroke-dashoffset:60;transition:stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1) .2s}
[data-vibeui-block="card-091"][data-seen="true"] [data-part="arrow"] path{stroke-dashoffset:0}
[data-vibeui-block="card-091"] [data-part="quote"]{margin:0;font-size:.95rem;color:var(--vibeui-card-091-muted);font-style:italic}
[data-vibeui-block="card-091"] [data-part="link"]{margin-top:auto;justify-self:start;color:inherit;font-size:.85rem;font-weight:600;text-decoration:none;border-bottom:1px solid var(--vibeui-card-091-accent);padding-bottom:.1rem}
[data-vibeui-block="card-091"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-card-091-accent);outline-offset:3px}
@container (min-width: 64rem){
[data-vibeui-block="card-091"] [data-part="body"]{padding:1.5rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="card-091"] [data-part="arrow"] path{stroke-dashoffset:0}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-091"] *{animation:none!important;transition:none!important}}
`

/** Карточка выпускника: работа с приростом, аватар и имя, путь «до → после»; свет за курсором по data-seen. */
export function Card091({
  name = "Артём Гусев",
  work = "/demo/realty/object-04.webp",
  workAlt = "работа выпускника",
  gain = "оффер через 2 месяца",
  image = "/demo/realty/object-01.webp",
  before = "маркетолог, 4 года",
  after = "продуктовый дизайнер, Ozon",
  quote = "Карточка кейса выпускника",
  href = "#",
  beforeLabel = "Было",
  afterLabel = "Стало",
  linkLabel = "Смотреть кейс",
  accent,
  className,
  style,
  ...props
}: Card091Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-091-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-091" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-091"
        className={className}
        style={palette}
      >
        <div data-part="work">
          {work ? <img src={work} alt={workAlt ?? ""} loading="lazy" draggable={false} /> : null}
          {gain ? <span data-part="gain">{gain}</span> : null}
        </div>
        <div data-part="body">
          <div data-part="who">
            {image ? <img data-part="avatar" src={image} alt="" loading="lazy" draggable={false} /> : <span data-part="avatar" />}
            <span data-part="name">{name}</span>
          </div>
          <div data-part="path">
            <span>
              <small>{beforeLabel}</small>
              {before}
            </span>
            <svg data-part="arrow" viewBox="0 0 44 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12h36M31 5l8 7-8 7" />
            </svg>
            <span data-part="after">
              <small>{afterLabel}</small>
              {after}
            </span>
          </div>
          {quote ? <p data-part="quote">«{quote}»</p> : null}
          {href && linkLabel ? (
            <a data-part="link" href={href} draggable={false}>
              {linkLabel} →
            </a>
          ) : null}
        </div>
      </li>
    </>
  )
}
