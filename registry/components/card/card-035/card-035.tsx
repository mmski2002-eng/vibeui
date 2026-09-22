import type { ComponentProps, CSSProperties } from "react"

export type Card035Props = Omit<ComponentProps<"article">, "title" | "children"> & {
  title?: string
  stars?: number
  text?: string
  name?: string
  date?: string
  store?: string
  starsLabel?: string
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

function Stars({ n, label }: { n: number; label: string }) {
  return (
    <span data-part="stars" aria-label={label.replace("{n}", String(n))}>
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} data-off={i > n} aria-hidden="true" style={{ ["--vibeui-card-035-i" as string]: i - 1 }}>
          ★
        </i>
      ))}
    </span>
  )
}

// Часть блока testimonials-025, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-035"]){
--vibeui-card-035-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-035-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-035-card:light-dark(#fff,color-mix(in oklab,var(--vibeui-card-035-bg) 85%,var(--vibeui-card-035-fg)));
--vibeui-card-035-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-035-line:color-mix(in oklab,var(--vibeui-card-035-fg) 12%,transparent);
--vibeui-card-035-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-card-035-muted:color-mix(in oklab,var(--vibeui-card-035-fg) 60%,var(--vibeui-card-035-bg));
--vibeui-card-035-star:#f5b301;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-035"]{color-scheme:dark}
[data-vibeui-block="card-035"]{box-sizing:border-box;min-width:min(100%,12rem)}
[data-vibeui-block="card-035"] *{box-sizing:border-box}
@keyframes vibeui-card-035-up{from{opacity:0;translate:0 2.5rem}to{opacity:1;translate:0 0}}
@keyframes vibeui-card-035-star{from{transform:scale(0) rotate(-40deg);opacity:0}to{transform:none;opacity:1}}
[data-vibeui-block="card-035"] [data-part="stars"]{display:inline-flex;gap:.1rem;color:var(--vibeui-card-035-star)}
[data-vibeui-block="card-035"] [data-part="stars"] i{display:inline-block}
[data-vibeui-block="card-035"] [data-part="stars"] i[data-off="true"]{color:var(--vibeui-card-035-line)}
[data-vibeui-block="card-035"]{position:relative;flex:0 0 min(22rem,85%);scroll-snap-align:start;display:grid;gap:.8rem;padding:1.6rem;border-radius:1.5rem;background:var(--vibeui-card-035-card);box-shadow:0 20px 40px -30px rgb(0 0 0 / .5),0 0 0 1px var(--vibeui-card-035-line);transition:transform .5s cubic-bezier(.2,.8,.2,1),box-shadow .5s}
[data-vibeui-block="card-035"]:hover{transform:translateY(-.4rem) rotateX(3deg) rotateY(-3deg);box-shadow:0 40px 60px -30px color-mix(in oklab,var(--vibeui-card-035-accent) 55%,transparent),0 0 0 1px color-mix(in oklab,var(--vibeui-card-035-accent) 40%,transparent)}
[data-vibeui-block="card-035"]::before{content:"\\201C";position:absolute;right:1.2rem;top:.4rem;font-size:5rem;line-height:1;font-weight:800;color:var(--vibeui-card-035-accent);opacity:.14;pointer-events:none}
[data-vibeui-block="card-035"] h3{margin:0;font-size:1.1rem;font-weight:700;letter-spacing:-.01em}
[data-vibeui-block="card-035"] p{margin:0;color:var(--vibeui-card-035-muted);font-size:.95rem}
[data-vibeui-block="card-035"] [data-part="who"]{display:flex;align-items:center;gap:.6rem;margin-top:auto;font-size:.82rem}
[data-vibeui-block="card-035"] [data-part="who"] b{font-weight:600}
[data-vibeui-block="card-035"] [data-part="who"] span{color:var(--vibeui-card-035-muted)}
[data-vibeui-block="card-035"] [data-part="store"]{margin-left:auto;font-family:var(--vibeui-card-035-mono);font-size:.65rem;padding:.2rem .5rem;border-radius:4px;background:var(--vibeui-card-035-fg);color:var(--vibeui-card-035-bg)}
[data-vibeui-block="card-035"]{animation:vibeui-card-035-up cubic-bezier(.2,.8,.2,1) both;animation-timeline:--vibeui-card-035-track;animation-range:entry 0% entry 60%}
[data-vibeui-block="card-035"] [data-part="stars"] i{animation:vibeui-card-035-star cubic-bezier(.2,1.4,.4,1) both;animation-timeline:--vibeui-card-035-track;animation-range:entry 40% entry 70%}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-035"] *{animation:none!important;transition:none!important}}
`

/** Карточка отзыва как в магазине приложений: звёзды, заголовок, текст, имя и дата, версия приложения мелким. */
export function Card035({
  title = "Тихо и без рекламы",
  stars,
  text = "Никаких «премиум за 3 990 в год» на каждом экране. Бесплатной версии хватает.",
  name = "Оля",
  date,
  store,
  starsLabel = "{n} из 5",
  index = 0,
  accent,
  className,
  style,
  ...props
}: Card035Props) {
  const palette = {
    ["--vibeui-card-035-i" as string]: index,
    ...(accent ? { "--vibeui-card-035-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-035" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-slot="card"
        data-vibeui-block="card-035"
        className={className}
        style={palette}
      >
        <Stars n={stars ?? 5} label={starsLabel} />
        <h3>{title}</h3>
        <p>{text}</p>
        <div data-part="who">
          <b>{name}</b>
          {date ? <span>· {date}</span> : null}
          {store ? <span data-part="store">{store}</span> : null}
        </div>
      </article>
    </>
  )
}
