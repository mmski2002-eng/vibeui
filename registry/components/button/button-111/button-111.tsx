import type { ComponentProps, CSSProperties } from "react"

export type Button111Props = Omit<ComponentProps<"a">, "title" | "children"> & {
  actionHref?: string
  actionShort?: string
  actionLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока navbar-028, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-111"]){
--vibeui-button-111-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-111-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-button-111-on-accent:oklch(from var(--vibeui-button-111-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-111"]{color-scheme:dark}
[data-vibeui-block="button-111"]{box-sizing:border-box}
[data-vibeui-block="button-111"] *{box-sizing:border-box}
[data-vibeui-block="button-111"]{display:inline-flex;align-items:center;border-radius:999px;padding:.65rem .9rem;font-weight:600;font-size:.88rem;text-decoration:none;color:var(--vibeui-button-111-on-accent);background:var(--vibeui-button-111-accent);box-shadow:0 1px 0 rgb(255 255 255 / .35) inset,0 10px 24px -12px color-mix(in oklab,var(--vibeui-button-111-accent) 70%,transparent);white-space:nowrap;transform:translate(var(--vibeui-navbar-028-mx,0px),var(--vibeui-navbar-028-my,0px));transition:transform .35s var(--vibeui-button-111-ease),filter .18s,box-shadow .35s}
[data-vibeui-block="button-111"]:hover{filter:brightness(1.05);box-shadow:0 1px 0 rgb(255 255 255 / .35) inset,0 14px 28px -12px color-mix(in oklab,var(--vibeui-button-111-accent) 90%,transparent)}
[data-vibeui-block="button-111"]:active{transform:translate(var(--vibeui-navbar-028-mx,0px),var(--vibeui-navbar-028-my,0px)) scale(.97)}
[data-vibeui-block="button-111"] span{display:none}
@container (min-width: 40rem){
[data-vibeui-block="button-111"] span{display:inline}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-111"] *{animation:none!important;transition:none!important}}
`

/** Ссылка-кнопка, тянущаяся к курсору: короткая подпись и хвост. */
export function Button111({
  actionHref = "#box",
  actionShort = "Заказать",
  actionLabel = "Заказать к утру",
  accent,
  className,
  style,
  ...props
}: Button111Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-111-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-111" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-slot="button"
        data-vibeui-block="button-111" href={actionHref}
        className={className}
        style={palette}
      >
        {actionShort}
        <span>{" "}{(actionLabel.startsWith(actionShort) ? actionLabel.slice(actionShort.length) : actionLabel).trim()}</span>
      </a>
    </>
  )
}
