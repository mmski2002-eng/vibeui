import type { CSSProperties } from "react"

export type Map006Point = {
  name: string
  latitude: number
  longitude: number
  /** Цвет точки в легенде. */
  color: string
}

export type Map006Route = {
  /** «Метро», «Автобус», «Велосипед». */
  mode: string
  text: string
  /** Эмодзи-стикер слева. */
  emoji?: string
  color?: string
  ink?: string
}

export type Map006Props = {
  eyebrow?: string
  title?: string
  address?: string
  /** Точки сцен и площадок — метки на Яндекс Карте и легенда. */
  points?: readonly Map006Point[]
  zoom?: number
  /** Как добраться — цветные строки. */
  routes?: readonly Map006Route[]
  routesLabel?: string
  openLabel?: string
  /** Тема карты: auto следует за схемой страницы. */
  theme?: "auto" | "light" | "dark"
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Карта фестиваля: слева Яндекс Карта без ключа (виджет map-widget/v1) с
// метками всех площадок, справа легенда точек цветными кружками и список
// «как добраться» — каждая строка на своей цветной капсуле со стикером.
// Серверный, без состояния: метки и центр считаются из массива points.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="map-006"]){
--vibeui-map-006-bg:light-dark(#ffffff,#0e0f12);
--vibeui-map-006-fg:light-dark(#111111,#f4f4f5);
--vibeui-map-006-muted:light-dark(#6b6b70,#a1a1aa);
--vibeui-map-006-line:light-dark(#e8e8ea,#26272d);
--vibeui-map-006-chip:light-dark(#f1f1f3,#1f2026);
--vibeui-map-006-accent:#d3f43a;
--vibeui-map-006-display:"Inter Tight","Inter",ui-sans-serif,system-ui,sans-serif;
--vibeui-map-006-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="map-006"]{color-scheme:dark}
:where([data-vibeui-block="map-006"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="map-006"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="map-006"]{box-sizing:border-box;display:block;background:var(--vibeui-map-006-bg);color:var(--vibeui-map-006-fg);font-family:var(--vibeui-map-006-font);font-size:1rem;line-height:1.4}
[data-vibeui-block="map-006"] *{box-sizing:border-box}
[data-vibeui-block="map-006"] a{color:inherit;text-decoration:none}
[data-vibeui-block="map-006"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:2rem 1.25rem 3rem}
[data-vibeui-block="map-006"] [data-part="eyebrow"]{margin:0;padding-top:1.25rem;border-top:1px solid var(--vibeui-map-006-line);font-size:1.05rem}
[data-vibeui-block="map-006"] [data-part="title"]{margin:.5rem 0 0;font-family:var(--vibeui-map-006-display);font-size:clamp(1.6rem,3.4cqi,2.4rem);font-weight:600;letter-spacing:-.03em;line-height:1.1}
[data-vibeui-block="map-006"] [data-part="address"]{margin:.4rem 0 1.5rem;color:var(--vibeui-map-006-muted)}
[data-vibeui-block="map-006"] [data-part="grid"]{display:grid;gap:1.25rem}
[data-vibeui-block="map-006"] [data-part="frame"]{position:relative;overflow:hidden;border-radius:1.5rem;background:var(--vibeui-map-006-chip);aspect-ratio:4/3}
[data-vibeui-block="map-006"] iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
[data-vibeui-block="map-006"] [data-part="legend"]{display:flex;flex-wrap:wrap;gap:.4rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="map-006"] [data-part="legend"] li{display:inline-flex;align-items:center;gap:.45rem;padding:.35rem .75rem .35rem .5rem;border-radius:999px;background:var(--vibeui-map-006-chip);font-size:.85rem;font-weight:500}
[data-vibeui-block="map-006"] [data-part="legend"] i{width:.75rem;height:.75rem;border-radius:50%;background:var(--vibeui-map-006-dot)}
[data-vibeui-block="map-006"] [data-part="routes-label"]{margin:1.5rem 0 .6rem;font-size:.85rem;color:var(--vibeui-map-006-muted)}
[data-vibeui-block="map-006"] [data-part="routes"]{display:grid;gap:.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="map-006"] [data-part="route"]{display:grid;grid-template-columns:3rem minmax(0,1fr);gap:.9rem;align-items:center;padding:.6rem .9rem .6rem .6rem;border-radius:1.1rem;background:var(--vibeui-map-006-route,#f1f1f3);color:var(--vibeui-map-006-ink,#111);transition:transform .3s cubic-bezier(.2,.9,.3,1.3)}
[data-vibeui-block="map-006"] [data-part="route"]:hover{transform:translateX(4px)}
[data-vibeui-block="map-006"] [data-part="emoji"]{display:grid;place-items:center;width:3rem;height:3rem;border-radius:.8rem;background:color-mix(in oklab,var(--vibeui-map-006-route) 82%,#000);font-size:1.5rem;line-height:1;filter:drop-shadow(0 4px 4px rgb(0 0 0 / .2))}
[data-vibeui-block="map-006"] [data-part="mode"]{display:block;font-family:var(--vibeui-map-006-display);font-weight:600;letter-spacing:-.01em}
[data-vibeui-block="map-006"] [data-part="route"] span span{display:block;font-size:.88rem;opacity:.8}
[data-vibeui-block="map-006"] [data-part="open"]{display:inline-flex;align-items:center;height:2.6rem;padding:0 1.15rem;margin-top:1.25rem;border-radius:999px;background:var(--vibeui-map-006-accent);color:#111;font-weight:600;transition:transform .2s}
[data-vibeui-block="map-006"] [data-part="open"]:hover{transform:translateY(-2px)}
[data-vibeui-block="map-006"] [data-part="open"]:focus-visible{outline:2px solid var(--vibeui-map-006-fg);outline-offset:3px}
@container (min-width: 60rem){
[data-vibeui-block="map-006"] [data-part="shell"]{padding:2.5rem 2rem 4rem}
[data-vibeui-block="map-006"] [data-part="grid"]{grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:2.5rem;align-items:start}
[data-vibeui-block="map-006"] [data-part="frame"]{aspect-ratio:16/11}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="map-006"] *{transition:none!important}}`

const DEFAULT_POINTS: Map006Point[] = [
  { name: "Главная сцена", latitude: 55.7467, longitude: 37.6178, color: "#c2df37" },
  { name: "Фуд-корт", latitude: 55.7455, longitude: 37.6205, color: "#ffa5b1" },
  { name: "Лекторий", latitude: 55.7478, longitude: 37.6215, color: "#9854d1" },
  { name: "Детская поляна", latitude: 55.7448, longitude: 37.6165, color: "#98f5af" },
  { name: "Набережная", latitude: 55.7440, longitude: 37.6230, color: "#464dff" },
]

const DEFAULT_ROUTES: Map006Route[] = [
  { mode: "Метро", text: "«Парк культуры», 7 минут пешком до входа №1", emoji: "🚇", color: "#ffe2d6" },
  { mode: "Автобус", text: "Б, 10, 79 — остановка «Крымский мост»", emoji: "🚌", color: "#d9cafe" },
  { mode: "Велосипед", text: "600 парковочных мест у каждого входа, прокат на набережной", emoji: "🚲", color: "#c2df37" },
  { mode: "Машина", text: "Парковок у парка нет — оставьте на перехватывающей у метро", emoji: "🚗", color: "#f1ddbc" },
]

/** Карта фестиваля: Яндекс Карта с метками площадок, легенда и «как добраться». */
export function Map006({
  eyebrow = "Как добраться",
  title = "Парк «Остров», три входа",
  address = "Крымский Вал, 9 · вход №1 у метро, №2 с набережной, №3 со стороны моста",
  points = DEFAULT_POINTS,
  zoom = 15,
  routes = DEFAULT_ROUTES,
  routesLabel = "Дорога",
  openLabel = "Открыть в Яндекс Картах",
  theme = "auto",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Map006Props) {
  const palette = {
    ...(accent ? { "--vibeui-map-006-accent": accent } : null),
    ...(background ? { "--vibeui-map-006-bg": background } : null),
    ...style,
  } as CSSProperties
  const centerLatitude = points.reduce((sum, point) => sum + point.latitude, 0) / Math.max(1, points.length)
  const centerLongitude = points.reduce((sum, point) => sum + point.longitude, 0) / Math.max(1, points.length)
  // Виджет без ключа: метки перечисляются в pt через «~», кодировать нельзя.
  const markers = points.map((point) => `${point.longitude},${point.latitude},pm2dgm`).join("~")
  const mapTheme = theme === "auto" ? (tone === "dark" ? "dark" : "light") : theme
  const embed = `https://yandex.ru/map-widget/v1/?ll=${centerLongitude.toFixed(5)},${centerLatitude.toFixed(5)}&z=${zoom}&pt=${markers}&lang=ru_RU&theme=${mapTheme}`
  const openHref = `https://yandex.ru/maps/?ll=${centerLongitude.toFixed(5)},${centerLatitude.toFixed(5)}&z=${zoom}&pt=${markers}`

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-map-006" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="map-006" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {address ? <p data-part="address">{address}</p> : null}
          <div data-part="grid">
            <div data-part="frame">
              <iframe src={embed} title={title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
            <div>
              {points.length > 0 ? (
                <ul data-part="legend" aria-label="Площадки">
                  {points.map((point) => (
                    <li key={point.name} style={{ ["--vibeui-map-006-dot" as string]: point.color }}>
                      <i aria-hidden="true" />
                      {point.name}
                    </li>
                  ))}
                </ul>
              ) : null}
              {routes.length > 0 ? (
                <>
                  {routesLabel ? <p data-part="routes-label">{routesLabel}</p> : null}
                  <ul data-part="routes">
                    {routes.map((route) => (
                      <li key={route.mode} data-part="route" style={{ ["--vibeui-map-006-route" as string]: route.color ?? "#f1f1f3", ["--vibeui-map-006-ink" as string]: route.ink ?? "#111" }}>
                        <span data-part="emoji" aria-hidden="true">
                          {route.emoji ?? "→"}
                        </span>
                        <span>
                          <span data-part="mode">{route.mode}</span>
                          <span>{route.text}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {openLabel ? (
                <a data-part="open" href={openHref} target="_blank" rel="noreferrer noopener">
                  {openLabel}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
