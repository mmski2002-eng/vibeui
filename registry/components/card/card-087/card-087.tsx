import type { ComponentProps, CSSProperties } from "react"

export type Card087Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  flowers?: readonly string[]
  note?: string
  nowLabel?: string
  month?: number | null
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока flowers-004, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-087"]){
--vibeui-card-087-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-087-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-087-display:"Cormorant",Georgia,"Times New Roman",serif;
--vibeui-card-087-hand:"Caveat","Segoe Script",cursive;
--vibeui-card-087-line:color-mix(in oklab,var(--vibeui-card-087-fg) 16%,transparent);
--vibeui-card-087-muted:color-mix(in oklab,var(--vibeui-card-087-fg) 62%,var(--vibeui-card-087-bg));
--vibeui-card-087-on-accent:oklch(from var(--vibeui-card-087-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-card-087-paper:color-mix(in oklab,var(--vibeui-card-087-fg) 5%,var(--vibeui-card-087-bg));
--vibeui-card-087-fg:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-087"]{color-scheme:dark}
[data-vibeui-block="card-087"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-087"] *{box-sizing:border-box}
[data-vibeui-block="card-087"]{position:relative;flex:0 0 15rem;display:grid;align-content:start;gap:.9rem;padding:1.3rem 1.2rem 1.4rem;border-radius:1rem;border:1px solid var(--vibeui-card-087-line);background:var(--vibeui-card-087-paper);scroll-snap-align:center;transition:transform .35s cubic-bezier(.2,.7,.2,1),border-color .3s,box-shadow .3s}
[data-vibeui-block="card-087"]:hover{transform:translateY(-4px)}
[data-vibeui-block="card-087"][data-now="true"]{border-color:var(--vibeui-card-087-accent);box-shadow:0 0 0 1px var(--vibeui-card-087-accent),0 24px 40px -30px var(--vibeui-card-087-accent)}
[data-vibeui-block="card-087"] [data-part="num"]{font-size:.74rem;letter-spacing:.14em;color:var(--vibeui-card-087-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="card-087"] h3{margin:0;font-family:var(--vibeui-card-087-display);font-weight:500;font-size:2.2rem;line-height:.95;letter-spacing:-.02em}
[data-vibeui-block="card-087"][data-now="true"] h3{color:var(--vibeui-card-087-accent)}
[data-vibeui-block="card-087"] ul{margin:0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:.35rem}
[data-vibeui-block="card-087"] li{padding:.25rem .6rem;border-radius:999px;border:1px solid var(--vibeui-card-087-line);font-size:.8rem;background:var(--vibeui-card-087-bg)}
[data-vibeui-block="card-087"] p{margin:0;padding-right:2rem;font-size:.82rem;color:var(--vibeui-card-087-muted)}
[data-vibeui-block="card-087"] [data-part="now"]{position:absolute;right:.8rem;top:-.9rem;padding:.1rem .6rem;border-radius:999px;background:var(--vibeui-card-087-accent);color:var(--vibeui-card-087-on-accent);font-family:var(--vibeui-card-087-hand);font-size:1.15rem;line-height:1.3;transform:rotate(3deg)}
[data-vibeui-block="card-087"] [data-part="petal"]{position:absolute;right:1rem;bottom:1rem;width:1.6rem;height:1.6rem;color:var(--vibeui-card-087-accent);opacity:.5}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-087"] *{animation:none!important;transition:none!important}}
`

/** Карточка сезонного календаря: номер, месяц, цветы сезона, заметка и лепесток; текущий месяц с меткой. */
export function Card087({
  name = "Январь",
  flowers = ["амариллис", "гиацинт", "тюльпан"],
  note = "Карточка месяца",
  nowLabel = "цветёт сейчас",
  month,
  index = 0,
  accent,
  className,
  style,
  ...props
}: Card087Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-087-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-087" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-087"
        className={className}
        style={palette}
      >
        {month === index ? <span data-part="now">{nowLabel}</span> : null}
        <span data-part="num">{String(index + 1).padStart(2, "0")} / 12</span>
        <h3>{name}</h3>
        <ul>
          {flowers.map((flower) => (
            <li key={flower}>{flower}</li>
          ))}
        </ul>
        {note ? <p>{note}</p> : null}
        <svg data-part="petal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 21c0-6 1-11 3-16M12 21c-5-1-8-5-8-10 5 0 8 4 8 10ZM12 21c5-1 8-5 8-10-5 0-8 4-8 10Z" />
        </svg>
      </li>
    </>
  )
}
