import type { ComponentProps, CSSProperties } from "react"

export type Badge033Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  mark?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока logocloud-014, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="badge-033"]){
--vibeui-badge-033-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-badge-033-glass:color-mix(in oklab,var(--vibeui-badge-033-fg) 5%,transparent);
--vibeui-badge-033-line:color-mix(in oklab,var(--vibeui-badge-033-fg) 11%,transparent);
--vibeui-badge-033-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-badge-033-fg:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-033"]{color-scheme:dark}
[data-vibeui-block="badge-033"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="badge-033"] *{box-sizing:border-box}
[data-vibeui-block="badge-033"]{display:inline-flex;align-items:center;gap:.6rem;padding:.55rem 1rem .55rem .55rem;border-radius:999px;background:var(--vibeui-badge-033-glass);border:1px solid var(--vibeui-badge-033-line);white-space:nowrap;font-weight:500;font-size:.92rem;transition:border-color .2s,background .2s}
[data-vibeui-block="badge-033"]:hover{border-color:color-mix(in oklab,var(--vibeui-badge-033-accent) 50%,transparent);background:color-mix(in oklab,var(--vibeui-badge-033-accent) 10%,transparent)}
[data-vibeui-block="badge-033"] i{display:grid;place-items:center;width:1.8rem;height:1.8rem;border-radius:.55rem;background:color-mix(in oklab,var(--vibeui-badge-033-accent) 16%,transparent);color:var(--vibeui-badge-033-accent);font-style:normal;font-family:var(--vibeui-badge-033-mono);font-size:.64rem;font-weight:600}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-033"] *{animation:none!important;transition:none!important}}
`

/** Чип логотипа для бегущей строки: буква-метка и название. */
export function Badge033({
  mark,
  name = "1С:Бухгалтерия",
  accent,
  className,
  style,
  ...props
}: Badge033Props) {
  const palette = {
    ...(accent ? { "--vibeui-badge-033-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-033" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-033"
        className={className}
        style={palette}
      >
        <i aria-hidden="true">{mark ?? name.slice(0, 2).toUpperCase()}</i>
        {name}
      </li>
    </>
  )
}
