import type { ComponentProps, CSSProperties } from "react"

export type Card083Props = Omit<ComponentProps<"figure">, "title" | "children"> & {
  image?: string
  name?: string
  badge?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока delivery-001, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-083"]){
--vibeui-card-083-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-083-card:color-mix(in oklab,var(--vibeui-card-083-fg) 6%,var(--vibeui-card-083-bg));
--vibeui-card-083-on-accent:oklch(from var(--vibeui-card-083-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-card-083-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-083-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-083"]{color-scheme:dark}
[data-vibeui-block="card-083"]{box-sizing:border-box}
[data-vibeui-block="card-083"] *{box-sizing:border-box}
[data-vibeui-block="card-083"]{position:relative;width:72%;margin:0 auto;aspect-ratio:1}
[data-vibeui-block="card-083"] img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="card-083"][data-shape="circle"] img{border-radius:50%}
[data-vibeui-block="card-083"][data-shape="drop"] img{border-radius:50% 50% 50% 8%}
[data-vibeui-block="card-083"][data-shape="blob"] img{border-radius:60% 40% 55% 45% / 45% 60% 40% 55%}
[data-vibeui-block="card-083"]:empty{border-radius:50%;background:radial-gradient(circle at 35% 30%,color-mix(in oklab,var(--vibeui-card-083-accent) 55%,var(--vibeui-card-083-card)),var(--vibeui-card-083-card))}
[data-vibeui-block="card-083"] [data-part="badge"]{position:absolute;top:2%;left:-4%;padding:.3rem .65rem;border-radius:.5rem;background:var(--vibeui-card-083-accent);color:var(--vibeui-card-083-on-accent);font-size:.68rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;transform:rotate(-8deg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-083"] *{animation:none!important;transition:none!important}}
`

/** Фигура с фото блюда и бейджем; форма маски по data-shape. */
export function Card083({
  image = "/demo/realty/object-01.webp",
  name = "Фото блюда",
  badge = "Фото блюда",
  accent,
  className,
  style,
  ...props
}: Card083Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-083-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-083" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="card"
        data-vibeui-block="card-083"
        className={className}
        style={palette}
      >
        {image ? <img src={image} alt={name} loading="lazy" /> : null}
        {badge ? <figcaption data-part="badge">{badge}</figcaption> : null}
      </figure>
    </>
  )
}
