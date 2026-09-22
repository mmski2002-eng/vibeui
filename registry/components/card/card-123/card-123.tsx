import type { ComponentProps, CSSProperties } from "react"

export type Card123Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  title?: string
  icon?: string
  value?: string
  text?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

const ICONS: Record<string, string> = {
  plane: "M21 12.5c0 .6-.5 1-1.1 1L13 12.9 9.5 20H7.6l1.7-7.4-4.6-.6-1.7 2H1.6l1.2-3.5L1.6 7.1H3l1.7 2 4.6-.6L7.6 1h1.9L13 8.1l6.9-.6c.6 0 1.1.4 1.1 1v4z",
  passport: "M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM12 13a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM8 17h8",
  cash: "M3 7h18v10H3zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 10h.01M18 14h.01",
  sim: "M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM8 12h8v6H8zM11 12v6M8 15h8",
  shield: "M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6zM9 12l2 2 4-4",
  phone: "M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2 3.6.8v3.2A1.5 1.5 0 0 1 17.5 21 16 16 0 0 1 3 6.5 1.5 1.5 0 0 1 4.8 5H8l.8 3.6z",
}

// Часть блока event-011, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-123"]){
--vibeui-card-123-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-123-display:"Oswald","Arial Narrow",Impact,sans-serif;
--vibeui-card-123-line:light-dark(#e3d7bf,#2e2e2e);
--vibeui-card-123-muted:light-dark(#5b6f78,#a3a3a3);
--vibeui-card-123-sand:light-dark(#f4f4f4,#242424);
--vibeui-card-123-sea:#2aa7a0;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-123"]{color-scheme:dark}
[data-vibeui-block="card-123"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-123"] *{box-sizing:border-box}
[data-vibeui-block="card-123"]{position:relative;display:grid;grid-template-columns:2.8rem minmax(0,1fr);gap:.2rem 1rem;padding:1.1rem 1.2rem 1.1rem 1.4rem;border:1px solid var(--vibeui-card-123-line);border-radius:.8rem;background:var(--vibeui-card-123-sand);overflow:hidden;transition:transform .25s,border-color .25s}
[data-vibeui-block="card-123"]::before{content:"";position:absolute;left:.55rem;top:0;bottom:0;width:2px;background:radial-gradient(circle,var(--vibeui-card-123-bg) 0 2px,transparent 2.5px) 0 0/2px 9px repeat-y}
[data-vibeui-block="card-123"]:hover{transform:translateY(-2px);border-color:var(--vibeui-card-123-sea)}
[data-vibeui-block="card-123"] svg{grid-row:1 / span 3;width:2.8rem;height:2.8rem;padding:.65rem;border-radius:50%;background:var(--vibeui-card-123-bg);color:var(--vibeui-card-123-sea);fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
[data-vibeui-block="card-123"] h3{margin:0;font-family:var(--vibeui-card-123-display);font-size:.78rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--vibeui-card-123-muted)}
[data-vibeui-block="card-123"] b{font-family:var(--vibeui-card-123-display);font-size:1.5rem;font-weight:600;line-height:1.1;letter-spacing:.02em}
[data-vibeui-block="card-123"] p{margin:0;font-size:.92rem;color:var(--vibeui-card-123-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-123"] *{animation:none!important;transition:none!important}}
`

/** Карточка совета для гостей: иконка, заголовок и текст. */
export function Card123({
  title = "Перелёт",
  icon,
  value,
  text = "Прямой рейс Москва — Гавана, вылет 12 февраля в 09:40, багаж 23 кг включён.",
  accent,
  className,
  style,
  ...props
}: Card123Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-123-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-123" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-123"
        className={className}
        style={palette}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d={ICONS[icon ?? ""] ?? ICONS.plane} />
        </svg>
        <h3>{title}</h3>
        {value ? <b>{value}</b> : null}
        <p>{text}</p>
      </li>
    </>
  )
}
