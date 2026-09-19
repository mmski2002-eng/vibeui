import type { CSSProperties } from "react"

export type Map011Fact = {
  label: string
  value: string
  href?: string
}

export type Map011Props = {
  eyebrow?: string
  title?: string
  address?: string
  /** Как найти: подпись под адресом. */
  howToFind?: string
  facts?: readonly Map011Fact[]
  /** Ссылки на навигаторы. */
  mapsLabel?: string
  mapsHref?: string
  navigatorLabel?: string
  navigatorHref?: string
  /** Подпись у метки на карте. */
  pinLabel?: string
  /** Подпись у точки старта маршрута (метро, шоссе). */
  fromLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Карта и контакты автосервиса: слева адрес, «как найти», телефон, часы и
// две кнопки в навигаторы; справа стилизованная карта на svg — сетка
// кварталов, дороги, река, точка старта («метро») и метка бокса с
// пульсирующими кольцами. Маршрут от старта до метки прорисовывается
// пунктиром (stroke-dashoffset) при появлении и повторяется. Без API карт
// и без JS: заказчик подставляет свои ссылки в навигаторы.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="map-011"]){
--vibeui-map-011-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-map-011-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-map-011-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-map-011-on-accent:oklch(from var(--vibeui-map-011-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-map-011-muted:color-mix(in oklab,var(--vibeui-map-011-fg) 60%,var(--vibeui-map-011-bg));
--vibeui-map-011-line:color-mix(in oklab,var(--vibeui-map-011-fg) 12%,transparent);
--vibeui-map-011-glass:color-mix(in oklab,var(--vibeui-map-011-fg) 5%,transparent);
--vibeui-map-011-road:color-mix(in oklab,var(--vibeui-map-011-fg) 22%,var(--vibeui-map-011-bg));
--vibeui-map-011-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-map-011-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-map-011-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="map-011"]{color-scheme:dark}
:where([data-vibeui-block="map-011"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="map-011"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="map-011"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-map-011-bg);color:var(--vibeui-map-011-fg);font-family:var(--vibeui-map-011-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="map-011"] *{box-sizing:border-box}
[data-vibeui-block="map-011"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2rem}
[data-vibeui-block="map-011"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 .8rem;font-family:var(--vibeui-map-011-mono);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-map-011-accent)}
[data-vibeui-block="map-011"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-map-011-accent)}
[data-vibeui-block="map-011"] [data-part="title"]{margin:0;font-family:var(--vibeui-map-011-display);font-weight:900;font-size:clamp(1.8rem,4.4cqi,3.2rem);line-height:1.02;letter-spacing:-.03em;text-transform:uppercase}
[data-vibeui-block="map-011"] [data-part="address"]{margin:1.4rem 0 0;font-family:var(--vibeui-map-011-display);font-weight:700;font-size:1.25rem;letter-spacing:-.01em;line-height:1.3}
[data-vibeui-block="map-011"] [data-part="how"]{margin:.5rem 0 0;color:var(--vibeui-map-011-muted)}
[data-vibeui-block="map-011"] [data-part="facts"]{display:grid;gap:.6rem;margin:1.6rem 0 0;padding:0;list-style:none}
[data-vibeui-block="map-011"] [data-part="facts"] li{display:grid;grid-template-columns:7rem 1fr;gap:.6rem;padding:.7rem 0;border-top:1px solid var(--vibeui-map-011-line);font-size:.95rem}
[data-vibeui-block="map-011"] [data-part="facts"] small{font-family:var(--vibeui-map-011-mono);font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-map-011-muted);padding-top:.15rem}
[data-vibeui-block="map-011"] [data-part="facts"] a{color:inherit;text-decoration:none;border-bottom:1px solid var(--vibeui-map-011-line);transition:border-color .2s,color .2s}
[data-vibeui-block="map-011"] [data-part="facts"] a:hover{color:var(--vibeui-map-011-accent);border-color:var(--vibeui-map-011-accent)}
[data-vibeui-block="map-011"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:.6rem;margin:1.6rem 0 0}
[data-vibeui-block="map-011"] [data-part="primary"],[data-vibeui-block="map-011"] [data-part="secondary"]{display:inline-flex;align-items:center;gap:.5rem;padding:.85rem 1.3rem;border-radius:.7rem;font-weight:700;font-size:.92rem;text-decoration:none;transition:transform .2s,box-shadow .25s,background .2s}
[data-vibeui-block="map-011"] [data-part="primary"]{background:var(--vibeui-map-011-accent);color:var(--vibeui-map-011-on-accent)}
[data-vibeui-block="map-011"] [data-part="primary"]:hover{transform:translateY(-1px);box-shadow:0 12px 30px -10px var(--vibeui-map-011-accent)}
[data-vibeui-block="map-011"] [data-part="secondary"]{border:1px solid var(--vibeui-map-011-line);color:var(--vibeui-map-011-fg)}
[data-vibeui-block="map-011"] [data-part="secondary"]:hover{background:var(--vibeui-map-011-glass)}
[data-vibeui-block="map-011"] a:focus-visible{outline:2px solid var(--vibeui-map-011-accent);outline-offset:2px}
[data-vibeui-block="map-011"] [data-part="map"]{position:relative;overflow:hidden;border-radius:1.4rem;border:1px solid var(--vibeui-map-011-line);background:var(--vibeui-map-011-glass);aspect-ratio:3/2}
[data-vibeui-block="map-011"] [data-part="map"] svg{position:absolute;inset:0;width:100%;height:100%;display:block}
[data-vibeui-block="map-011"] [data-part="blocks"]{fill:color-mix(in oklab,var(--vibeui-map-011-fg) 6%,transparent)}
[data-vibeui-block="map-011"] [data-part="road"]{fill:none;stroke:var(--vibeui-map-011-road);stroke-linecap:round;stroke-linejoin:round}
[data-vibeui-block="map-011"] [data-part="river"]{fill:none;stroke:color-mix(in oklab,var(--vibeui-map-011-accent) 18%,var(--vibeui-map-011-bg));stroke-width:26;stroke-linecap:round}
[data-vibeui-block="map-011"] [data-part="route"]{fill:none;stroke:var(--vibeui-map-011-accent);stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;animation:vibeui-map-011-route 5s cubic-bezier(.4,0,.2,1) infinite}
[data-vibeui-block="map-011"] [data-part="ring"]{fill:none;stroke:var(--vibeui-map-011-accent);stroke-width:2;transform-origin:center;transform-box:fill-box;animation:vibeui-map-011-ring 2.4s ease-out infinite}
[data-vibeui-block="map-011"] [data-part="ring"]:nth-of-type(2){animation-delay:1.2s}
[data-vibeui-block="map-011"] [data-part="pin"]{fill:var(--vibeui-map-011-accent)}
[data-vibeui-block="map-011"] [data-part="from"]{fill:var(--vibeui-map-011-fg)}
[data-vibeui-block="map-011"] [data-part="label"]{position:absolute;padding:.45rem .8rem;border-radius:.6rem;font-family:var(--vibeui-map-011-mono);font-size:.72rem;letter-spacing:.04em;white-space:nowrap;box-shadow:0 10px 30px -12px rgb(0 0 0 / .6)}
[data-vibeui-block="map-011"] [data-part="label"][data-kind="pin"]{left:58%;top:36%;background:var(--vibeui-map-011-accent);color:var(--vibeui-map-011-on-accent);font-weight:600;transform:translate(-50%,-100%) translateY(-1.2rem)}
[data-vibeui-block="map-011"] [data-part="label"][data-kind="from"]{left:18%;top:78%;background:var(--vibeui-map-011-bg);color:var(--vibeui-map-011-fg);border:1px solid var(--vibeui-map-011-line);transform:translate(-25%,.9rem)}
[data-vibeui-block="map-011"] [data-part="compass"]{position:absolute;right:1rem;top:1rem;width:2.2rem;height:2.2rem;border-radius:50%;border:1px solid var(--vibeui-map-011-line);background:var(--vibeui-map-011-bg);display:grid;place-items:center;font-family:var(--vibeui-map-011-mono);font-size:.7rem;color:var(--vibeui-map-011-muted)}
@keyframes vibeui-map-011-route{0%{stroke-dashoffset:1;opacity:0}8%{opacity:1}55%{stroke-dashoffset:0;opacity:1}90%{stroke-dashoffset:0;opacity:1}100%{stroke-dashoffset:0;opacity:0}}
@keyframes vibeui-map-011-ring{0%{transform:scale(.4);opacity:1}100%{transform:scale(2.6);opacity:0}}
@container (min-width: 60rem){[data-vibeui-block="map-011"] [data-part="shell"]{grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:3.5rem;align-items:center}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="map-011"] *{animation:none!important;transition:none!important}[data-vibeui-block="map-011"] [data-part="route"]{stroke-dashoffset:0}[data-vibeui-block="map-011"] [data-part="ring"]{opacity:.35}}`

const DEFAULT_FACTS: Map011Fact[] = [
  { label: "Телефон", value: "+7 (812) 420-42-42", href: "tel:+78124204242" },
  { label: "Мессенджер", value: "@garage42_spb", href: "#" },
  { label: "Часы", value: "Пн–Сб 9:00–21:00, Вс — выходной" },
  { label: "Парковка", value: "Своя, 6 мест у ворот бокса" },
]

/** Карта и контакты: стилизованная svg-карта с маршрутом и метка бокса. */
export function Map011({
  eyebrow = "Где мы",
  title = "Бокс на Обводном, ворота 42",
  address = "Санкт-Петербург, наб. Обводного канала, 150, корп. 3",
  howToFind = "Заезд с Курляндской, вторые ворота с зелёной вывеской. Позвоните — откроем шлагбаум.",
  facts = DEFAULT_FACTS,
  mapsLabel = "Открыть в Яндекс Картах",
  mapsHref = "#",
  navigatorLabel = "Маршрут в 2ГИС",
  navigatorHref = "#",
  pinLabel = "Гараж 42",
  fromLabel = "м. Балтийская · 7 мин",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Map011Props) {
  const palette = {
    ...(accent ? { "--vibeui-map-011-accent": accent } : null),
    ...(ink ? { "--vibeui-map-011-fg": ink } : null),
    ...(background ? { "--vibeui-map-011-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-map-011" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="map-011" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="copy">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            <p data-part="address">{address}</p>
            {howToFind ? <p data-part="how">{howToFind}</p> : null}
            {facts.length > 0 ? (
              <ul data-part="facts">
                {facts.map((fact) => (
                  <li key={fact.label}>
                    <small>{fact.label}</small>
                    {fact.href ? <a href={fact.href}>{fact.value}</a> : <span>{fact.value}</span>}
                  </li>
                ))}
              </ul>
            ) : null}
            <div data-part="actions">
              {mapsLabel ? (
                <a data-part="primary" href={mapsHref}>
                  {mapsLabel}
                </a>
              ) : null}
              {navigatorLabel ? (
                <a data-part="secondary" href={navigatorHref}>
                  {navigatorLabel}
                </a>
              ) : null}
            </div>
          </div>
          <div data-part="map" aria-label={`Схема проезда: ${pinLabel}`} role="img">
            <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <g data-part="blocks">
                <rect x="20" y="20" width="110" height="80" rx="6" />
                <rect x="150" y="20" width="160" height="80" rx="6" />
                <rect x="330" y="20" width="90" height="120" rx="6" />
                <rect x="440" y="20" width="140" height="60" rx="6" />
                <rect x="20" y="120" width="110" height="120" rx="6" />
                <rect x="150" y="120" width="160" height="60" rx="6" />
                <rect x="440" y="100" width="140" height="140" rx="6" />
                <rect x="20" y="260" width="60" height="120" rx="6" />
                <rect x="150" y="200" width="160" height="80" rx="6" />
                <rect x="330" y="160" width="90" height="120" rx="6" />
                <rect x="440" y="260" width="140" height="120" rx="6" />
                <rect x="150" y="300" width="270" height="80" rx="6" />
              </g>
              <path data-part="river" d="M-10 300 C 80 280 120 250 140 190 S 220 100 320 110 S 520 140 620 90" />
              <path data-part="road" strokeWidth="10" d="M140 -10 V410 M320 -10 V410 M430 -10 V410 M-10 110 H610 M-10 250 H610 M-10 290 H140" />
              <path data-part="road" strokeWidth="4" d="M90 110 V250 M480 110 V250 M320 190 H430 M140 290 H430" />
              <path data-part="route" pathLength={1} d="M108 312 L108 250 L140 250 L140 110 L320 110 L320 150 L348 150" />
              <circle data-part="ring" cx="348" cy="150" r="10" />
              <circle data-part="ring" cx="348" cy="150" r="10" />
              <circle data-part="pin" cx="348" cy="150" r="9" />
              <circle data-part="from" cx="108" cy="312" r="7" />
            </svg>
            <span data-part="label" data-kind="pin">
              {pinLabel}
            </span>
            <span data-part="label" data-kind="from">
              {fromLabel}
            </span>
            <span data-part="compass" aria-hidden="true">
              N
            </span>
          </div>
        </div>
      </section>
    </>
  )
}
