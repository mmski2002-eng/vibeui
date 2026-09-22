import type { ComponentProps, CSSProperties } from "react"

export type Card112Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  text?: string
  name?: string
  car?: string
  stars?: number
  starsLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function Star() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L1.3 7.8l6.1-.7z" />
    </svg>
  )
}

// Часть блока testimonials-026, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-112"]){
--vibeui-card-112-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-112-glass:color-mix(in oklab,var(--vibeui-card-112-fg) 5%,transparent);
--vibeui-card-112-line:color-mix(in oklab,var(--vibeui-card-112-fg) 12%,transparent);
--vibeui-card-112-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-card-112-muted:color-mix(in oklab,var(--vibeui-card-112-fg) 60%,var(--vibeui-card-112-bg));
--vibeui-card-112-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-112-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-112"]{color-scheme:dark}
[data-vibeui-block="card-112"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-112"] *{box-sizing:border-box}
[data-vibeui-block="card-112"]{display:grid;gap:.6rem;width:20rem;margin-right:1rem;padding:1.2rem 1.3rem;border-radius:1.1rem;border:1px solid var(--vibeui-card-112-line);background:var(--vibeui-card-112-glass)}
[data-vibeui-block="card-112"] [data-part="stars"]{display:inline-flex;gap:.15rem;color:var(--vibeui-card-112-accent)}
[data-vibeui-block="card-112"] [data-part="stars"] svg{width:.9rem;height:.9rem}
[data-vibeui-block="card-112"] p{margin:0;font-size:.95rem;line-height:1.45}
[data-vibeui-block="card-112"] [data-part="who"]{display:grid;margin-top:.2rem;font-size:.82rem}
[data-vibeui-block="card-112"] [data-part="who"] b{font-weight:600}
[data-vibeui-block="card-112"] [data-part="who"] span{font-family:var(--vibeui-card-112-mono);font-size:.72rem;color:var(--vibeui-card-112-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-112"] *{animation:none!important;transition:none!important}}
`

/** Карточка отзыва: звёзды, текст, имя и подпись. */
export function Card112({
  text,
  name,
  car,
  stars,
  starsLabel = "{n} из 5",
  accent,
  className,
  style,
  ...props
}: Card112Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-112-accent": accent } : null),
    ...style,
  } as CSSProperties
  const starsValue = stars ?? 5

  return (
    <>
      <style href="vibeui-card-112" precedence="medium">
        {STYLES}
      </style>
      <li
          {...props}
          data-slot="card"
          data-vibeui-block="card-112"
          className={className}
          style={palette}
        >
        <span data-part="stars" aria-label={starsLabel.replace("{n}", String(starsValue))}>
          {Array.from({ length: starsValue }, (_, index) => (
            <Star key={index} />
          ))}
        </span>
        <p>{text}</p>
        <span data-part="who">
          <b>{name}</b>
          <span>{car}</span>
        </span>
      </li>
    </>
  )
}
