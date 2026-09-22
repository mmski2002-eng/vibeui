import type { ComponentProps, CSSProperties } from "react"

export type Button099Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  pauseLabel?: string
  playLabel?: string
  playing?: boolean
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока podcast-007, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-099"]){
--vibeui-button-099-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-099-on-accent:oklch(from var(--vibeui-button-099-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-button-099-spring:cubic-bezier(.34,1.56,.64,1);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-099"]{color-scheme:dark}
[data-vibeui-block="button-099"]{box-sizing:border-box}
[data-vibeui-block="button-099"] *{box-sizing:border-box}
[data-vibeui-block="button-099"]{width:2.8rem;height:2.8rem;border-radius:50%;border:0;background:var(--vibeui-button-099-accent);color:var(--vibeui-button-099-on-accent);display:grid;place-items:center;cursor:pointer;box-shadow:0 8px 24px -8px var(--vibeui-button-099-accent);transition:transform .25s var(--vibeui-button-099-spring),box-shadow .3s}
[data-vibeui-block="button-099"]:hover{transform:scale(1.1)}
[data-vibeui-block="button-099"]:active{transform:scale(.94)}
[data-vibeui-block="button-099"] svg{width:1.1rem;height:1.1rem;fill:currentColor}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-099"] *{animation:none!important;transition:none!important}}
`

/** Кнопка воспроизведения мини-плеера: иконка play или pause по состоянию. */
export function Button099({
  pauseLabel = "Пауза",
  playLabel = "Слушать",
  playing,
  accent,
  className,
  style,
  ...props
}: Button099Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-099-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-099" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-099" type="button" aria-label={playing ? pauseLabel : playLabel} aria-pressed={playing}
        className={className}
        style={palette}
      >
        {playing ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
        )}
      </button>
    </>
  )
}
