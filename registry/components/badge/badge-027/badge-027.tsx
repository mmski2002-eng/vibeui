import type { ComponentProps, CSSProperties } from "react"

export type Badge027Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  label?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока bento-008, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="badge-027"]){
--vibeui-badge-027-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-badge-027-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-badge-027-line:color-mix(in oklab,var(--vibeui-badge-027-fg) 12%,transparent);
--vibeui-badge-027-fg:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-027"]{color-scheme:dark}
[data-vibeui-block="badge-027"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="badge-027"] *{box-sizing:border-box}
[data-vibeui-block="badge-027"]{display:inline-flex;align-items:center;gap:.4rem;padding:.35rem .7rem;border-radius:999px;border:1px solid var(--vibeui-badge-027-line);background:var(--vibeui-badge-027-bg);font-size:.8rem;font-weight:600;transform:rotate(calc(var(--vibeui-bento-008-r) * 1deg))}
[data-vibeui-block="badge-027"]::before{content:"";width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-badge-027-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-027"] *{animation:none!important;transition:none!important}}
`

/** Чип с точкой и подписью, слегка повёрнут через переменную поворота. */
export function Badge027({
  label,
  accent,
  className,
  style,
  ...props
}: Badge027Props) {
  const palette = {
    ...(accent ? { "--vibeui-badge-027-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-027" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-027"
        className={className}
        style={palette}
      >
        {label}
      </li>
    </>
  )
}
