import type { ComponentProps, CSSProperties } from "react"

export type Card090Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  title?: string
  length?: string
  kind?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

const ICONS: Record<NonNullable<Card090Lesson["kind"]>, string> = {
  video: "M8 6.5v11l9-5.5z",
  live: "M12 12m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7",
  review: "M5 12.5l4 4 10-10",
  text: "M6 7h12M6 12h12M6 17h8",
}

// Часть блока course-002, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-090"]){
--vibeui-card-090-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-090-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-090-marker:light-dark(#d9f99d,rgb(163 230 53 / .3));
--vibeui-card-090-muted:light-dark(#6b7280,#a3a3a3);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-090"]{color-scheme:dark}
[data-vibeui-block="card-090"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-090"] *{box-sizing:border-box}
[data-vibeui-block="card-090"]{display:flex;align-items:center;gap:.75rem;padding:.55rem .75rem;border-radius:.6rem;background:var(--vibeui-card-090-bg);transition:transform .25s}
[data-vibeui-block="card-090"]:hover{transform:translateX(3px)}
[data-vibeui-block="card-090"] [data-part="icon"]{flex:none;width:1.6rem;height:1.6rem;border-radius:.45rem;display:grid;place-items:center;background:color-mix(in oklab,var(--vibeui-card-090-accent) 12%,transparent);color:var(--vibeui-card-090-accent)}
[data-vibeui-block="card-090"][data-kind="live"] [data-part="icon"]{background:var(--vibeui-card-090-marker);color:#1a2e05}
[data-vibeui-block="card-090"] [data-part="icon"] svg{width:.9rem;height:.9rem}
[data-vibeui-block="card-090"]>span:nth-child(2){flex:1}
[data-vibeui-block="card-090"] [data-part="length"]{font-size:.78rem;color:var(--vibeui-card-090-muted);font-variant-numeric:tabular-nums;white-space:nowrap}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-090"] *{animation:none!important;transition:none!important}}
`

/** Строка урока программы: иконка типа (видео, текст, практика), название и длительность. */
export function Card090({
  title = "Разбор домашек потока",
  length,
  kind,
  accent,
  className,
  style,
  ...props
}: Card090Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-090-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-090" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-090" data-kind={kind}
        className={className}
        style={palette}
      >
        <span data-part="icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill={kind === "video" ? "currentColor" : "none"} stroke={kind === "video" ? "none" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={ICONS[kind]} />
          </svg>
        </span>
        <span>{title}</span>
        {length ? <span data-part="length">{length}</span> : null}
      </li>
    </>
  )
}
