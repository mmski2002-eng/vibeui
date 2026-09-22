import type { ComponentProps, CSSProperties } from "react"

export type Badge032Props = Omit<ComponentProps<"span">, "title" | "children"> & {
  name?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока logocloud-007, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="badge-032"]){
--vibeui-badge-032-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-badge-032-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-badge-032-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-badge-032-muted:color-mix(in oklab,var(--vibeui-badge-032-fg) 60%,var(--vibeui-badge-032-bg));
--vibeui-badge-032-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-032"]{color-scheme:dark}
[data-vibeui-block="badge-032"]{box-sizing:border-box}
[data-vibeui-block="badge-032"] *{box-sizing:border-box}
[data-vibeui-block="badge-032"]{display:inline-flex;align-items:center;gap:1.6rem;padding-right:1.6rem;font-size:clamp(1.6rem,3.6cqi,2.6rem);line-height:1;white-space:nowrap;color:var(--vibeui-badge-032-muted);transition:color .25s}
[data-vibeui-block="badge-032"]:hover{color:var(--vibeui-badge-032-fg)}
[data-vibeui-block="badge-032"]::after{content:"";width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-badge-032-accent)}
[data-vibeui-block="badge-032"][data-kind="0"]{font-weight:800;letter-spacing:-.04em}
[data-vibeui-block="badge-032"][data-kind="1"]{font-weight:400;letter-spacing:-.02em}
[data-vibeui-block="badge-032"][data-kind="2"]{font-family:var(--vibeui-badge-032-mono);font-weight:500;font-size:clamp(1.2rem,2.6cqi,1.9rem);text-transform:uppercase;letter-spacing:.06em}
[data-vibeui-block="badge-032"][data-kind="3"]{font-style:italic;font-weight:500}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="badge-032"][aria-hidden="true"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-032"] *{animation:none!important;transition:none!important}}
`

/** Название бренда в ленте: вид по data-kind, дубли скрыты от читалок. */
export function Badge032({
  name,
  accent,
  className,
  style,
  ...props
}: Badge032Props) {
  const palette = {
    ...(accent ? { "--vibeui-badge-032-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-032" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-032"
        className={className}
        style={palette}
      >
        {name}
      </span>
    </>
  )
}
