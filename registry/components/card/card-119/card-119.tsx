import type { ComponentProps, CSSProperties } from "react"

export type Card119Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  time?: string
  title?: string
  href?: string
  stage?: string
  tag?: string
  tagColor?: string
  tagInk?: string
  note?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока event-006, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-119"]){
--vibeui-card-119-chip:light-dark(#f1f1f3,#1f2026);
--vibeui-card-119-display:"Inter Tight","Inter",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-119-line:light-dark(#e8e8ea,#26272d);
--vibeui-card-119-muted:light-dark(#6b6b70,#a1a1aa);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-119"]{color-scheme:dark}
[data-vibeui-block="card-119"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-119"] *{box-sizing:border-box}
@keyframes vibeui-card-119-in{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
[data-vibeui-block="card-119"]{display:grid;grid-template-columns:4.5rem minmax(0,1fr);gap:.25rem 1rem;padding:1rem 0;border-bottom:1px solid var(--vibeui-card-119-line);animation:vibeui-card-119-in .45s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-event-006-n) * 40ms);transition:background .2s}
[data-vibeui-block="card-119"] [data-part="time"]{position:relative;padding-left:.9rem;font-family:var(--vibeui-card-119-display);font-size:1.25rem;font-weight:600;letter-spacing:-.02em;font-variant-numeric:tabular-nums;line-height:1.2}
[data-vibeui-block="card-119"] [data-part="time"]::before{content:"";position:absolute;left:0;top:.15rem;bottom:.1rem;width:4px;border-radius:4px;background:var(--vibeui-event-006-day)}
[data-vibeui-block="card-119"] [data-part="slot-title"]{margin:0;font-family:var(--vibeui-card-119-display);font-size:1.2rem;font-weight:600;line-height:1.25;letter-spacing:-.02em}
[data-vibeui-block="card-119"] [data-part="slot-title"] a:hover{opacity:.7}
[data-vibeui-block="card-119"] [data-part="slot-meta"]{display:flex;flex-wrap:wrap;align-items:center;gap:.4rem .6rem;margin:.25rem 0 0;font-size:.9rem;color:var(--vibeui-card-119-muted)}
[data-vibeui-block="card-119"] [data-part="tag"]{padding:.15rem .55rem;border-radius:999px;background:var(--vibeui-card-119-tag,#f1f1f3);color:var(--vibeui-card-119-ink,#111);font-size:.78rem;font-weight:500}
[data-vibeui-block="card-119"] [data-part="note"]{padding:.15rem .55rem;border-radius:999px;background:var(--vibeui-card-119-chip);font-size:.78rem}
@container (min-width: 56rem){
[data-vibeui-block="card-119"] [data-part="slot-meta"]{grid-column:3;margin:0;justify-content:flex-end}
[data-vibeui-block="card-119"]:hover{background:linear-gradient(90deg,color-mix(in oklab,var(--vibeui-event-006-day) 14%,transparent),transparent 60%)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-119"] *{animation:none!important;transition:none!important}}
`

/** Строка слота программы: время, заголовок со ссылкой, сцена и цветной тег. */
export function Card119({
  time,
  title,
  href,
  stage,
  tag,
  tagColor,
  tagInk,
  note,
  accent,
  className,
  style,
  ...props
}: Card119Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-119-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-119" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-119"
        className={className}
        style={palette}
      >
        <span data-part="time">{time}</span>
        <div>
          <h3 data-part="slot-title">{href ? <a href={href}>{title}</a> : title}</h3>
        </div>
        <p data-part="slot-meta">
          {stage ? <span>{stage}</span> : null}
          {tag ? (
            <span data-part="tag" style={{ ["--vibeui-card-119-tag" as string]: tagColor, ["--vibeui-card-119-ink" as string]: tagInk ?? "#111" }}>
              {tag}
            </span>
          ) : null}
          {note ? <span data-part="note">{note}</span> : null}
        </p>
      </li>
    </>
  )
}
