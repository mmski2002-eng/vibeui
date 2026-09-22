import type { ComponentProps, CSSProperties } from "react"

export type Badge026Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  name?: string
  mark?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока bento-002, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="badge-026"]){
--vibeui-badge-026-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-badge-026-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-badge-026-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-badge-026-line:color-mix(in oklab,var(--vibeui-badge-026-fg) 14%,transparent);
--vibeui-badge-026-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-badge-026-muted:color-mix(in oklab,var(--vibeui-badge-026-fg) 60%,var(--vibeui-badge-026-bg));
--vibeui-badge-026-on-accent:oklch(from var(--vibeui-badge-026-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-badge-026-fg:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-026"]{color-scheme:dark}
[data-vibeui-block="badge-026"]{box-sizing:border-box}
[data-vibeui-block="badge-026"] *{box-sizing:border-box}
@keyframes vibeui-badge-026-spin{to{transform:rotate(360deg)}}
[data-vibeui-block="badge-026"]{position:relative;width:100%;height:100%;border-radius:50%;display:grid;place-items:center;background:var(--vibeui-badge-026-bg);border:1px solid var(--vibeui-badge-026-line);box-shadow:0 10px 24px -12px rgb(0 0 0 / .5);font-family:var(--vibeui-badge-026-mono);font-weight:500;font-size:.75rem;animation:vibeui-badge-026-spin var(--vibeui-bento-002-t) linear infinite reverse;transition:background .2s,color .2s,border-color .2s}
[data-vibeui-block="badge-026"]:hover{background:var(--vibeui-badge-026-accent);color:var(--vibeui-badge-026-on-accent);border-color:transparent;box-shadow:0 0 24px -4px var(--vibeui-badge-026-accent)}
[data-vibeui-block="badge-026"] span{position:absolute;top:calc(100% + .35rem);left:50%;transform:translateX(-50%);white-space:nowrap;font-family:var(--vibeui-badge-026-font);font-size:.68rem;color:var(--vibeui-badge-026-muted);opacity:0;transition:opacity .2s}
[data-vibeui-block="badge-026"]:hover span{opacity:1}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-026"] *{animation:none!important;transition:none!important}}
`

/** Круглый спутник орбиты интеграций: знак или первая буква имени, подпись под ним. */
export function Badge026({
  name = "Stripe",
  mark,
  accent,
  className,
  style,
  ...props
}: Badge026Props) {
  const palette = {
    ...(accent ? { "--vibeui-badge-026-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-026" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-026" aria-label={name}
        className={className}
        style={palette}
      >
        {mark ?? name.charAt(0)}
        <span aria-hidden="true">{name}</span>
      </div>
    </>
  )
}
