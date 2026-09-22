import type { ComponentProps, CSSProperties } from "react"

export type Card104Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  title?: string
  text?: string
  screenTitle?: string
  screen?: "breath" | "sleep" | "alarm" | "stats"
  screenPrefix?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока app-001, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-104"]){
--vibeui-card-104-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-104-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-104-line:color-mix(in oklab,var(--vibeui-card-104-fg) 12%,transparent);
--vibeui-card-104-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-card-104-muted:color-mix(in oklab,var(--vibeui-card-104-fg) 60%,var(--vibeui-card-104-bg));
--vibeui-card-104-p:0;
--vibeui-card-104-fg:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-104"]{color-scheme:dark}
[data-vibeui-block="card-104"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-104"] *{box-sizing:border-box}
@keyframes vibeui-card-104-rise{from{opacity:0;transform:translateY(2rem)}}
[data-vibeui-block="card-104"]{position:relative;padding:1.4rem 1.4rem 1.4rem 1.9rem;border-radius:1.3rem;background:var(--vibeui-card-104-bg);box-shadow:0 0 0 1px var(--vibeui-card-104-line);min-height:11rem;counter-increment:vibeui-app-001;transition:box-shadow .5s,transform .7s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="card-104"][data-in="true"]{animation:vibeui-card-104-rise .8s cubic-bezier(.2,.8,.2,1) backwards;animation-delay:calc(var(--vibeui-app-001-i) * .09s)}
[data-vibeui-block="card-104"]::before{content:"";position:absolute;left:0;top:1.4rem;bottom:1.4rem;width:3px;border-radius:3px;background:var(--vibeui-card-104-line)}
[data-vibeui-block="card-104"]::after{content:"";position:absolute;left:0;top:1.4rem;bottom:1.4rem;width:3px;border-radius:3px;background:var(--vibeui-card-104-accent);transform:scaleY(0);transform-origin:top;transition:transform .15s linear}
[data-vibeui-block="card-104"][data-active="true"]{box-shadow:0 0 0 1px var(--vibeui-card-104-accent),0 30px 60px -30px color-mix(in oklab,var(--vibeui-card-104-accent) 55%,transparent);transform:translateX(.4rem)}
[data-vibeui-block="card-104"][data-active="true"]::after{transform:scaleY(var(--vibeui-card-104-p))}
[data-vibeui-block="card-104"][data-done="true"]::after{transform:scaleY(1)}
[data-vibeui-block="card-104"] h3{margin:0;font-size:1.5rem;font-weight:800;letter-spacing:-.02em;line-height:1.1}
[data-vibeui-block="card-104"] h3::before{content:"0" counter(vibeui-app-001);display:block;margin-bottom:.6rem;font-family:var(--vibeui-card-104-mono);font-size:.72rem;font-weight:500;letter-spacing:.08em;color:var(--vibeui-card-104-muted);transition:color .3s}
[data-vibeui-block="card-104"][data-active="true"] h3::before{color:var(--vibeui-card-104-accent)}
[data-vibeui-block="card-104"] p{margin:.6rem 0 0;color:var(--vibeui-card-104-muted);font-size:1.05rem;max-width:30rem}
[data-vibeui-block="card-104"] [data-part="mini"]{display:none}
@container (max-width: 59.98rem){
[data-vibeui-block="card-104"] [data-part="mini"]{display:block;margin-top:1rem;font-family:var(--vibeui-card-104-mono);font-size:.72rem;color:var(--vibeui-card-104-accent)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="card-104"]{opacity:1!important;transform:none!important}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-104"] *{animation:none!important;transition:none!important}}
`

/** Пункт списка возможностей рядом с телефоном: заголовок, текст и подпись экрана; активный и пройденные — по data-active/data-done. */
export function Card104({
  title = "Дыхание, которое ведёт",
  text = "Круг растёт и сжимается, а вы просто следуете. Три практики: 4-7-8, коробочное, «вечер».",
  screenTitle,
  screen,
  screenPrefix = "экран",
  accent,
  className,
  style,
  ...props
}: Card104Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-104-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-104" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-104" data-reveal=""
        className={className}
        style={palette}
      >
        <h3>{title}</h3>
        <p>{text}</p>
        <span data-part="mini">
          {screenPrefix} · {screenTitle ?? screen}
        </span>
      </li>
    </>
  )
}
