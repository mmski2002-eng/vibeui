import type { ComponentProps, CSSProperties } from "react"

export type Button113Props = Omit<ComponentProps<"a">, "title" | "children"> & {
  actionHref?: string
  actionLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока navbar-044, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-113"]){
--vibeui-button-113-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-113-on-accent:oklch(from var(--vibeui-button-113-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-113"]{color-scheme:dark}
[data-vibeui-block="button-113"]{box-sizing:border-box}
[data-vibeui-block="button-113"] *{box-sizing:border-box}
@keyframes vibeui-button-113-beat{0%,100%{transform:scale(1)}30%{transform:scale(1.25)}60%{transform:scale(1.05)}}
[data-vibeui-block="button-113"]{display:inline-flex;align-items:center;gap:.45rem;padding:.6rem 1.15rem;border-radius:999px;background:var(--vibeui-button-113-accent);color:var(--vibeui-button-113-on-accent);text-decoration:none;font-weight:600;font-size:.9rem;white-space:nowrap;transition:transform .18s,box-shadow .2s}
[data-vibeui-block="button-113"] svg{width:1rem;height:1rem;transition:transform .2s}
[data-vibeui-block="button-113"]:hover{transform:translateY(-1px);box-shadow:0 10px 24px -10px var(--vibeui-button-113-accent)}
[data-vibeui-block="button-113"]:hover svg{animation:vibeui-button-113-beat .9s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-113"] *{animation:none!important;transition:none!important}}
`

/** Ссылка-кнопка шапки с иконкой сердца и подписью. */
export function Button113({
  actionHref = "#donate",
  actionLabel = "Помочь",
  accent,
  className,
  style,
  ...props
}: Button113Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-113-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-113" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-slot="button"
        data-vibeui-block="button-113" href={actionHref}
        className={className}
        style={palette}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3.4 5 7 5c2 0 3.4 1.1 5 2.8C13.6 6.1 15 5 17 5c3.6 0 5.8 3.6 4.5 6.8C19.5 16.4 12 21 12 21Z" />
        </svg>
        {actionLabel}
      </a>
    </>
  )
}
