import type { ComponentProps, CSSProperties } from "react"

export type Card121Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  time?: string
  title?: string
  icon?: string
  place?: string
  text?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

const ICONS: Record<string, string> = {
  glass: "M8 3h8l-1 7a3 3 0 0 1-6 0zM12 13v7M8 20h8",
  rings: "M9 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10zM15 19a5 5 0 1 1 0-10 5 5 0 0 1 0 10z",
  dinner: "M4 4v7a2 2 0 0 0 2 2v7M6 4v5M8 4v5M8 4v7a2 2 0 0 1-2 2M17 4c-2 1-3 4-3 7h3v9",
  music: "M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM20 16a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM9 18V6l11-2v12",
  sparkles: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM5 18l.7 1.8L7.5 20.5l-1.8.7L5 23l-.7-1.8-1.8-.7 1.8-.7z",
  cake: "M4 20h16M5 20v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6M5 15c1.5 1.5 3 1.5 4.5 0s3 1.5 4.5 0 3 1.5 4.5 0M12 8V6M12 6a1.5 1.5 0 1 0-.01 0",
  bus: "M5 4h14a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1zM4 10h16M7 18v2M17 18v2M8 14h.01M16 14h.01",
  camera: "M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
}

// Часть блока event-008, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-121"]){
--vibeui-card-121-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-121-card:light-dark(#fffaf3,#242424);
--vibeui-card-121-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-card-121-line:light-dark(#e2d8ca,#2e2e2e);
--vibeui-card-121-muted:light-dark(#7a6a70,#a3a3a3);
--vibeui-card-121-on-accent:oklch(from var(--vibeui-card-121-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-card-121-plum:var(--vibeui-card-121-fg);
--vibeui-card-121-sage:#8a9a7b;
--vibeui-card-121-fg:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-121"]{color-scheme:dark}
[data-vibeui-block="card-121"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-121"] *{box-sizing:border-box}
[data-vibeui-block="card-121"]{position:relative;display:grid;grid-template-columns:3.6rem 3rem minmax(0,1fr);align-items:start;gap:.5rem 0;padding:1rem 0}
[data-vibeui-block="card-121"] [data-part="time"]{padding-top:.35rem;font-family:var(--vibeui-card-121-display);font-size:1.45rem;font-weight:500;line-height:1;color:var(--vibeui-card-121-plum);font-variant-numeric:tabular-nums}
[data-vibeui-block="card-121"] [data-part="dot"]{display:grid;place-items:center;width:2.4rem;height:2.4rem;margin-left:.3rem;border:1px solid var(--vibeui-card-121-line);border-radius:50%;background:var(--vibeui-card-121-card);color:var(--vibeui-card-121-plum);transition:transform .3s cubic-bezier(.2,.9,.3,1.4),background .3s,color .3s}
[data-vibeui-block="card-121"] [data-part="dot"] svg{width:1.1rem;height:1.1rem;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
[data-vibeui-block="card-121"]:hover [data-part="dot"]{transform:scale(1.1);border-color:var(--vibeui-card-121-accent);color:var(--vibeui-card-121-accent)}
[data-vibeui-block="card-121"][data-current="true"] [data-part="dot"]{background:var(--vibeui-card-121-accent);border-color:var(--vibeui-card-121-accent);color:var(--vibeui-card-121-on-accent);box-shadow:0 0 0 .4rem color-mix(in oklab,var(--vibeui-card-121-accent) 18%,transparent)}
[data-vibeui-block="card-121"] [data-part="body"]{padding:.15rem 0 0 .6rem}
[data-vibeui-block="card-121"][data-current="true"] [data-part="body"]{border-radius:.9rem;background:color-mix(in oklab,var(--vibeui-card-121-accent) 8%,transparent);padding:.75rem .9rem;margin-left:.2rem}
[data-vibeui-block="card-121"] [data-part="name"]{margin:0;font-family:var(--vibeui-card-121-display);font-size:1.5rem;font-weight:500;line-height:1.15}
[data-vibeui-block="card-121"] [data-part="place"]{display:inline-flex;align-items:center;gap:.35rem;margin-top:.2rem;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-card-121-sage)}
[data-vibeui-block="card-121"] [data-part="text"]{margin:.35rem 0 0;font-size:.95rem;color:var(--vibeui-card-121-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-121"] *{animation:none!important;transition:none!important}}
`

/** Шаг таймлайна: время, точка, заголовок и описание; текущий по data-current. */
export function Card121({
  time = "15:00",
  title = "Сбор гостей",
  icon = "Шаг таймлайна дня",
  place = "Шаг таймлайна дня",
  text = "Шаг таймлайна дня",
  accent,
  className,
  style,
  ...props
}: Card121Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-121-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-121" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-121"
        className={className}
        style={palette}
      >
        <span data-part="time">{time}</span>
        <span data-part="dot" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d={ICONS[icon ?? ""] ?? ICONS.sparkles} />
          </svg>
        </span>
        <div data-part="body">
          <h3 data-part="name">{title}</h3>
          {place ? <span data-part="place">{place}</span> : null}
          {text ? <p data-part="text">{text}</p> : null}
        </div>
      </li>
    </>
  )
}
