import type { ComponentProps, CSSProperties } from "react"

export type Card106Props = Omit<ComponentProps<"a">, "title" | "children"> & {
  text?: string
  href?: string
  who?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока podcast-005, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-106"]){
--vibeui-card-106-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-106-display:"Sofia Sans Extra Condensed",Impact,"Arial Narrow",sans-serif;
--vibeui-card-106-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-card-106-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-card-106-muted:color-mix(in oklab,var(--vibeui-card-106-fg) 60%,var(--vibeui-card-106-bg));
--vibeui-card-106-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-106-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-106"]{color-scheme:dark}
[data-vibeui-block="card-106"]{box-sizing:border-box}
[data-vibeui-block="card-106"] *{box-sizing:border-box}
@keyframes vibeui-card-106-run{from{translate:-100% 0}to{translate:100cqw 0}}
[data-vibeui-block="card-106"]{position:relative;display:inline-flex;align-items:baseline;gap:1rem;padding:.1em 2rem .35em;color:inherit;text-decoration:none;white-space:nowrap}
[data-vibeui-block="card-106"] b{font-family:var(--vibeui-card-106-display);font-weight:800;font-size:clamp(2.6rem,6.5cqi,5rem);line-height:1;text-transform:uppercase;letter-spacing:-.01em;transition:color .3s,translate .4s var(--vibeui-card-106-ease)}
[data-vibeui-block="card-106"]:hover b{color:var(--vibeui-card-106-accent);translate:0 -.06em}
[data-vibeui-block="card-106"] small{font-family:var(--vibeui-card-106-mono);font-size:.72rem;letter-spacing:.1em;color:var(--vibeui-card-106-muted);text-transform:uppercase}
[data-vibeui-block="card-106"]::after{content:"◆";margin-left:2rem;color:var(--vibeui-card-106-accent);font-size:.9rem;align-self:center}
[data-vibeui-block="card-106"]::before{content:"";position:absolute;left:2rem;right:4.5rem;bottom:0;height:3px;border-radius:999px;background:color-mix(in oklab,var(--vibeui-card-106-accent) 35%,transparent);transform:scaleX(0);transform-origin:left;transition:transform .5s var(--vibeui-card-106-ease)}
[data-vibeui-block="card-106"]:hover::before,[data-vibeui-block="card-106"]:focus-visible::before{transform:none}
[data-vibeui-block="card-106"] u{position:absolute;left:2rem;right:4.5rem;bottom:-.1rem;height:.4rem;container-type:inline-size;pointer-events:none;text-decoration:none;overflow:hidden;border-radius:999px}
[data-vibeui-block="card-106"] u::after{content:"";position:absolute;inset:0 auto 0 0;width:3rem;border-radius:999px;background:linear-gradient(90deg,transparent,var(--vibeui-card-106-accent) 60%,#fff);box-shadow:0 0 12px var(--vibeui-card-106-accent);opacity:0;translate:-100% 0}
[data-vibeui-block="card-106"]:hover u::after{opacity:1;animation:vibeui-card-106-run 1.3s var(--vibeui-card-106-ease) .15s infinite}
[data-vibeui-block="card-106"]:focus-visible{outline:2px solid var(--vibeui-card-106-accent);outline-offset:3px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="card-106"][aria-hidden="true"]{display:none}
[data-vibeui-block="card-106"] b{white-space:normal}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-106"] *{animation:none!important;transition:none!important}}
`

/** Ссылка-цитата для бегущей строки: текст в кавычках, автор и подчёркивание при наведении. */
export function Card106({
  text = "Цитата бегущей строки",
  href = "#",
  who = "Сергей Волков · № 112",
  accent,
  className,
  style,
  ...props
}: Card106Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-106-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-106" precedence="medium">
        {STYLES}
      </style>
      <a
      {...props}
      data-slot="card"
      data-vibeui-block="card-106" href={href ?? "#"}
      className={className}
      style={palette}
      >
        <b>«{text}»</b>
        {who ? <small>{who}</small> : null}
        <u aria-hidden="true" />
      </a>
    </>
  )
}
