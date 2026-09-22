import type { ComponentProps, CSSProperties } from "react"

export type Avatar033Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  initials?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока bento-008, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="avatar-033"]){
--vibeui-avatar-033-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-avatar-033-display:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-avatar-033-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-avatar-033-paper:color-mix(in oklab,var(--vibeui-avatar-033-bg) 92%,#fff);
--vibeui-avatar-033-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-033"]{color-scheme:dark}
[data-vibeui-block="avatar-033"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="avatar-033"] *{box-sizing:border-box}
@keyframes vibeui-avatar-033-wave{0%,70%,100%{transform:rotate(0);opacity:0}80%{opacity:1;transform:rotate(-15deg)}90%{opacity:1;transform:rotate(15deg)}}
@keyframes vibeui-avatar-033-hand{0%,70%,100%{transform:translateY(0)}80%,90%{transform:translateY(-5px)}}
[data-vibeui-block="avatar-033"]{position:relative;display:grid;place-items:center;width:2.6rem;height:2.6rem;margin-left:-.6rem;border-radius:50%;border:2px solid var(--vibeui-avatar-033-paper);background:color-mix(in oklab,var(--vibeui-avatar-033-accent) calc(var(--vibeui-bento-008-i) * 12% + 20%),var(--vibeui-avatar-033-fg));color:#fff;font-family:var(--vibeui-avatar-033-display);font-size:.72rem;font-weight:700}
[data-vibeui-block="avatar-033"]:first-child{margin-left:0}
[data-vibeui-block="avatar-033"][data-hand="true"]{animation:vibeui-avatar-033-hand 3s ease-in-out infinite}
[data-vibeui-block="avatar-033"][data-hand="true"]::after{content:"✋";position:absolute;right:-.5rem;top:-.6rem;font-size:.9rem;animation:vibeui-avatar-033-wave 3s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-033"] *{animation:none!important;transition:none!important}}
`

/** Круглый аватар с инициалами для стопки лиц; с data-hand машет рукой. */
export function Avatar033({
  initials,
  accent,
  className,
  style,
  ...props
}: Avatar033Props) {
  const palette = {
    ...(accent ? { "--vibeui-avatar-033-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-033" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="avatar"
        data-vibeui-block="avatar-033"
        className={className}
        style={palette}
      >
        {initials}
      </li>
    </>
  )
}
