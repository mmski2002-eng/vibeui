import type { ComponentProps, CSSProperties } from "react"

export type Card137Hours = {
  days: string
  time: string
}

export type Card137Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  address?: string
  hours?: readonly Card137Hours[]
  details?: readonly string[]
  routeLabel?: string
  phone?: string
  phoneHref?: string
  routeHref?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока map-005, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-137"]){
--vibeui-card-137-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-137-card:light-dark(#fffaf3,#1d1917);
--vibeui-card-137-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-card-137-glow:0 0 24px color-mix(in oklab,var(--vibeui-card-137-accent) 70%,transparent),0 0 70px color-mix(in oklab,var(--vibeui-card-137-accent) 35%,transparent);
--vibeui-card-137-line:color-mix(in oklab,var(--vibeui-card-137-fg) 14%,var(--vibeui-card-137-bg));
--vibeui-card-137-muted:light-dark(color-mix(in oklab,var(--vibeui-card-137-fg) 60%,var(--vibeui-card-137-bg)),color-mix(in oklab,var(--vibeui-card-137-fg) 58%,var(--vibeui-card-137-bg)));
--vibeui-card-137-on-accent:oklch(from var(--vibeui-card-137-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-card-137-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-137-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-137"]{color-scheme:dark}
[data-vibeui-block="card-137"]{box-sizing:border-box}
[data-vibeui-block="card-137"] *{box-sizing:border-box}
[data-vibeui-block="card-137"]{position:relative;z-index:2;display:grid;gap:1.25rem;padding:1.5rem;background:var(--vibeui-card-137-card);border-top:1px solid var(--vibeui-card-137-line)}
[data-vibeui-block="card-137"] [data-part="address"]{margin:0;font-family:var(--vibeui-card-137-display);font-size:1.5rem;font-weight:500;line-height:1.2;font-style:normal}
[data-vibeui-block="card-137"] [data-part="hours"]{margin:0;display:grid;grid-template-columns:auto 1fr;gap:.35rem 1.25rem;font-size:.9rem}
[data-vibeui-block="card-137"] [data-part="hours"] dt{color:var(--vibeui-card-137-muted)}
[data-vibeui-block="card-137"] [data-part="hours"] dd{margin:0;font-variant-numeric:tabular-nums}
[data-vibeui-block="card-137"] [data-part="details"]{margin:0;padding:0;list-style:none;display:grid;gap:.4rem;font-size:.85rem;color:var(--vibeui-card-137-muted)}
[data-vibeui-block="card-137"] [data-part="details"] li{display:flex;gap:.6rem;align-items:flex-start}
[data-vibeui-block="card-137"] [data-part="details"] li::before{content:"";flex:none;width:.4rem;height:.4rem;margin-top:.5rem;border-radius:50%;background:var(--vibeui-card-137-accent)}
[data-vibeui-block="card-137"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:.6rem}
[data-vibeui-block="card-137"] [data-part="actions"] a{display:inline-flex;align-items:center;height:2.75rem;padding:0 1.2rem;border-radius:999px;text-decoration:none;font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;background:var(--vibeui-card-137-accent);color:var(--vibeui-card-137-on-accent);box-shadow:var(--vibeui-card-137-glow)}
[data-vibeui-block="card-137"] [data-part="actions"] a[data-variant="ghost"]{background:transparent;color:inherit;border:1px solid var(--vibeui-card-137-line);box-shadow:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-137"] *{animation:none!important;transition:none!important}}
`

/** Карточка с адресом, часами работы и действиями: маршрут, телефон. */
export function Card137({
  address = "Санкт-Петербург, Большая Пушкарская, 20, вход со двора",
  hours = [ { days: "Пн–Чт", time: "12:00–23:00" }, { days: "Пт–Сб", time: "12:00–01:00" }, { days: "Вс", time: "11:00–22:00" }, ],
  details = ["м. «Горьковская» — 7 минут пешком", "Парковка во дворе, 6 мест, по брони", "Вход со двора, арка слева от аптеки"],
  routeLabel = "Построить маршрут",
  phone = "+7 812 305-00-40",
  phoneHref = "#",
  routeHref = "#",
  accent,
  className,
  style,
  ...props
}: Card137Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-137-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-137" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="card"
        data-vibeui-block="card-137"
        className={className}
        style={palette}
      >
        <address data-part="address">{address}</address>
        {hours.length > 0 ? (
          <dl data-part="hours">
            {hours.map((row) => (
              <div key={row.days} style={{ display: "contents" }}>
                <dt>{row.days}</dt>
                <dd>{row.time}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {details.length > 0 ? (
          <ul data-part="details">
            {details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        ) : null}
        <div data-part="actions">
          <a href={routeHref} target="_blank" rel="noreferrer noopener">
            {routeLabel}
          </a>
          {phone ? (
            <a data-variant="ghost" href={phoneHref}>
              {phone}
            </a>
          ) : null}
        </div>
      </div>
    </>
  )
}
