"use client"

import type { ComponentProps, CSSProperties } from "react"

export type Card111Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  text?: string
  role?: string
  project?: string
  interval?: number
  index?: number
  count?: number
  i?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

const TILTS = [-2.5, 1.5, -1, 2, -1.5, 1]

// Часть блока testimonials-024, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-111"]){
--vibeui-card-111-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-111-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-111-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-card-111-hand:"Caveat","Segoe Script",cursive;
--vibeui-card-111-line:color-mix(in oklab,var(--vibeui-card-111-fg) 12%,transparent);
--vibeui-card-111-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-card-111-muted:color-mix(in oklab,var(--vibeui-card-111-fg) 60%,var(--vibeui-card-111-bg));
--vibeui-card-111-paper:color-mix(in oklab,var(--vibeui-card-111-bg) 70%,light-dark(#ffffff,#2a2a2a));
--vibeui-card-111-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-111-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-111"]{color-scheme:dark}
[data-vibeui-block="card-111"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-111"] *{box-sizing:border-box}
@keyframes vibeui-card-111-fill{from{transform:scaleX(0)}to{transform:none}}
[data-vibeui-block="card-111"]{position:relative;padding:2.4rem 1.6rem 1.6rem;border-radius:.4rem;background:var(--vibeui-card-111-paper);box-shadow:0 1px 0 var(--vibeui-card-111-line),0 24px 40px -30px rgb(0 0 0 / .45);cursor:pointer;opacity:0;transform:rotate(calc(var(--vibeui-testimonials-024-r) * 1deg));transition:transform .5s var(--vibeui-card-111-ease),box-shadow .5s;z-index:1;isolation:isolate}
[data-vibeui-block="card-111"]::before{content:"";position:absolute;left:50%;top:-.7rem;width:6rem;height:1.5rem;transform:translateX(-50%) rotate(calc(var(--vibeui-testimonials-024-r) * -1.5deg));background:color-mix(in oklab,var(--vibeui-card-111-accent) 35%,rgb(255 255 255 / .5));box-shadow:0 1px 2px rgb(0 0 0 / .12);opacity:.85}
[data-vibeui-block="card-111"]::after{content:"";position:absolute;inset:0;border-radius:inherit;background:radial-gradient(16rem 16rem at var(--vibeui-testimonials-024-x,50%) var(--vibeui-testimonials-024-y,50%),color-mix(in oklab,var(--vibeui-card-111-accent) 12%,transparent),transparent 70%);opacity:0;transition:opacity .4s;pointer-events:none;z-index:-1}
[data-vibeui-block="card-111"]:hover::after{opacity:1}
[data-vibeui-block="card-111"] [data-part="quote"]{position:relative;margin:0;font-family:var(--vibeui-card-111-display);font-weight:600;font-size:clamp(1.15rem,1.6cqi,1.45rem);line-height:1.3;letter-spacing:-.02em;text-wrap:pretty}
[data-vibeui-block="card-111"] [data-part="quote"]::before{content:"«";color:var(--vibeui-card-111-accent)}
[data-vibeui-block="card-111"] [data-part="quote"]::after{content:"»";color:var(--vibeui-card-111-accent)}
[data-vibeui-block="card-111"] [data-part="who"]{position:relative;display:flex;align-items:baseline;gap:.6rem;flex-wrap:wrap;margin-top:1.4rem}
[data-vibeui-block="card-111"] [data-part="who"] b{font-family:var(--vibeui-card-111-hand);font-weight:600;font-size:1.5rem;line-height:1;color:var(--vibeui-card-111-accent)}
[data-vibeui-block="card-111"] [data-part="who"] span{font-size:.85rem;color:var(--vibeui-card-111-muted)}
[data-vibeui-block="card-111"] [data-part="who"] i{font-style:normal;font-family:var(--vibeui-card-111-mono);font-size:.68rem;padding:.2rem .5rem;border-radius:4px;border:1px solid var(--vibeui-card-111-line);margin-left:auto}
[data-vibeui-block="card-111"] [data-part="bar"]{position:absolute;left:1.6rem;right:1.6rem;bottom:.9rem;height:2px;background:var(--vibeui-card-111-line);overflow:hidden;opacity:0;transition:opacity .3s}
[data-vibeui-block="card-111"][data-active="true"] [data-part="bar"]{opacity:1}
[data-vibeui-block="card-111"] [data-part="bar"]::after{content:"";position:absolute;inset:0;background:var(--vibeui-card-111-accent);transform:scaleX(0);transform-origin:left}
[data-vibeui-block="card-111"][data-active="true"] [data-part="bar"]::after{animation:vibeui-card-111-fill var(--vibeui-testimonials-024-t) linear forwards}
[data-vibeui-block="card-111"]:focus-visible{outline:2px solid var(--vibeui-card-111-accent);outline-offset:4px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="card-111"]{opacity:1}
[data-vibeui-block="card-111"][data-active="true"] [data-part="bar"]::after{transform:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-111"] *{animation:none!important;transition:none!important}}
`

/** Заметка на пробковой доске: цитата, имя, роль и проект; наклон через переменную, активна по data-active. */
export function Card111({
  name = "Марина Соколова",
  text = "Даня сделал за три недели то, на что у нас ушло бы полгода согласований. И это работает до сих пор.",
  role,
  project,
  interval = 7,
  index = 0,
  count = 3,
  i = 0,
  accent,
  className,
  style,
  ...props
}: Card111Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-111-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-111" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-111"
        tabIndex={0}
        onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        setIndex(i)
        }
        }}
        className={className}
        style={palette}
      >
        <blockquote data-part="quote">{text}</blockquote>
        <div data-part="who">
          <b>{name}</b>
          {role ? <span>{role}</span> : null}
          {project ? <i>{project}</i> : null}
        </div>
        {interval && count > 1 ? <span key={i === index ? `on-${index}` : "off"} data-part="bar" aria-hidden="true" /> : null}
      </li>
    </>
  )
}
