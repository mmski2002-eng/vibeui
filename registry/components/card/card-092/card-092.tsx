import type { ComponentProps, CSSProperties } from "react"

export type Card092Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  title?: string
  kind?: string
  time?: string
  text?: string
  live?: boolean
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока course-004, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-092"]){
--vibeui-card-092-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-092-card:light-dark(#f8fafc,#242424);
--vibeui-card-092-line:light-dark(#e5e7eb,#2e2e2e);
--vibeui-card-092-marker:light-dark(#d9f99d,rgb(163 230 53 / .3));
--vibeui-card-092-muted:light-dark(#6b7280,#a3a3a3);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-092"]{color-scheme:dark}
[data-vibeui-block="card-092"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-092"] *{box-sizing:border-box}
@keyframes vibeui-card-092-pulse{0%{transform:scale(.4);opacity:.8}100%{transform:scale(1.4);opacity:0}}
[data-vibeui-block="card-092"]{position:relative;padding:.85rem .9rem .85rem 1.1rem;border-radius:.85rem;background:var(--vibeui-card-092-card);border:1px solid var(--vibeui-card-092-line);transition:transform .3s cubic-bezier(.2,.8,.2,1),box-shadow .3s,border-color .3s}
[data-vibeui-block="card-092"]::before{content:"";position:absolute;left:0;top:.75rem;bottom:.75rem;width:3px;border-radius:3px;background:var(--vibeui-card-092-accent)}
[data-vibeui-block="card-092"]:hover{transform:translateY(-2px);box-shadow:0 20px 30px -22px rgb(17 24 39 / .4);border-color:color-mix(in oklab,var(--vibeui-card-092-accent) 40%,var(--vibeui-card-092-line))}
[data-vibeui-block="card-092"][data-kind="live"]{background:var(--vibeui-card-092-marker);border-color:transparent;color:#1a2e05}
[data-vibeui-block="card-092"][data-kind="live"]::before{background:#1a2e05}
[data-vibeui-block="card-092"][data-kind="live"] [data-part="text"]{color:#365314}
[data-vibeui-block="card-092"] [data-part="meta"]{display:flex;flex-wrap:wrap;align-items:center;gap:.4rem .6rem;margin:0 0 .3rem;font-size:.7rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-card-092-muted)}
[data-vibeui-block="card-092"][data-kind="live"] [data-part="meta"]{color:#365314}
[data-vibeui-block="card-092"] [data-part="pulse"]{position:relative;width:.55rem;height:.55rem;border-radius:50%;background:#1a2e05}
[data-vibeui-block="card-092"] [data-part="pulse"]::after{content:"";position:absolute;inset:-.3rem;border-radius:50%;border:2px solid #1a2e05;opacity:0;animation:vibeui-card-092-pulse 1.8s ease-out infinite}
[data-vibeui-block="card-092"] [data-part="time"]{font-weight:500;letter-spacing:0;text-transform:none;font-variant-numeric:tabular-nums}
[data-vibeui-block="card-092"] [data-part="daytitle"]{margin:0;font-weight:600;font-size:.9rem;line-height:1.3}
[data-vibeui-block="card-092"] [data-part="text"]{margin:.3rem 0 0;font-size:.8rem;color:var(--vibeui-card-092-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-092"] *{animation:none!important;transition:none!important}}
`

/** Событие в календарной ленте: время, тип с пульсом для live, название и преподаватель. */
export function Card092({
  title = "Событие недели курса",
  kind = "Событие недели курса",
  time = "Событие недели курса",
  text = "Событие недели курса",
  live,
  accent,
  className,
  style,
  ...props
}: Card092Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-092-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-092" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-092" data-kind={live ? "live" : undefined}
        className={className}
        style={palette}
      >
        <p data-part="meta">
          {live ? <span data-part="pulse" aria-hidden="true" /> : null}
          {kind ? <span>{kind}</span> : null}
          {time ? <span data-part="time">{time}</span> : null}
        </p>
        <p data-part="daytitle">{title}</p>
        {text ? <p data-part="text">{text}</p> : null}
      </li>
    </>
  )
}
