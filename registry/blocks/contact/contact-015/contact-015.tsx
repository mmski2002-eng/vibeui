import type { CSSProperties } from "react"

export type Contact015Props = {
  eyebrow?: string
  title?: string
  cardTitle?: string
  address?: string
  addressNote?: string
  hoursLine?: string
  mapHref?: string
  mapLabel?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Карта здесь — главный герой: сетка улиц нарисована повторяющимися
// градиентами, диагональный проспект — ещё одним слоем, пин — оранжевая
// капля с пульсирующим кольцом. Ни одного внешнего запроса и куки. Рисунок
// декоративен и скрыт от скринридеров: смысл несёт карточка с адресом,
// а точность даёт ссылка в настоящие карты.
const STYLES = `
:where([data-vibeui-block="contact-015"]){
--vibeui-contact-015-bg:transparent;
--vibeui-contact-015-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-contact-015-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-contact-015-muted:light-dark(oklch(0.5 0 0),oklch(0.71 0 0));
--vibeui-contact-015-border:light-dark(oklch(0.91 0 0),oklch(0.32 0 0));
--vibeui-contact-015-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-contact-015-accent-fill:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-contact-015-ground:light-dark(oklch(0.955 0.004 60),oklch(0.24 0 0));
--vibeui-contact-015-street:light-dark(oklch(1 0 0),oklch(0.3 0 0));
--vibeui-contact-015-shadow:light-dark(oklch(0.2 0.02 40 / 55%),oklch(0.05 0 0 / 85%));
--vibeui-contact-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contact-015"]{color-scheme:dark}
[data-vibeui-block="contact-015"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-contact-015-bg);color:var(--vibeui-contact-015-ink);
font-family:var(--vibeui-contact-015-font);
}
[data-vibeui-block="contact-015"] [data-part="shell"]{max-width:70rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="contact-015"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-contact-015-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="contact-015"] [data-part="title"]{
margin:0 0 1.5rem;max-width:24ch;
font-size:clamp(1.625rem,5cqi,2.375rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="contact-015"] [data-part="scene"]{position:relative}
[data-vibeui-block="contact-015"] [data-part="map"]{
position:relative;overflow:hidden;min-height:16rem;
border:1px solid var(--vibeui-contact-015-border);border-radius:1.25rem;
background:
linear-gradient(115deg,transparent 0 46%,var(--vibeui-contact-015-street) 46% 49.5%,transparent 49.5%),
radial-gradient(20rem 12rem at 80% 18%,color-mix(in oklab,var(--vibeui-contact-015-accent) 10%,var(--vibeui-contact-015-ground)),transparent 70%),
repeating-linear-gradient(0deg,transparent 0 3.25rem,var(--vibeui-contact-015-street) 3.25rem 3.5rem),
repeating-linear-gradient(90deg,transparent 0 4.5rem,var(--vibeui-contact-015-street) 4.5rem 4.75rem),
var(--vibeui-contact-015-ground);
}
[data-vibeui-block="contact-015"] [data-part="pulse"]{
position:absolute;left:50%;top:40%;width:3.5rem;height:3.5rem;
translate:-50% -50%;border-radius:999px;
border:2px solid var(--vibeui-contact-015-accent);opacity:0;
animation:vibeui-contact-015-ping 2.4s ease-out infinite;
}
@keyframes vibeui-contact-015-ping{
0%{scale:0.4;opacity:0.8}
80%{scale:1.15;opacity:0}
100%{scale:1.15;opacity:0}
}
[data-vibeui-block="contact-015"] [data-part="pin"]{
position:absolute;left:50%;top:40%;width:2.25rem;height:2.25rem;
translate:-50% -90%;rotate:-45deg;border-radius:50% 50% 50% 0;
background:var(--vibeui-contact-015-accent-fill);
border:3px solid var(--vibeui-contact-015-card);
box-shadow:0 14px 28px -14px var(--vibeui-contact-015-shadow);
}
[data-vibeui-block="contact-015"] [data-part="pin"]::after{
content:"";position:absolute;inset:0;margin:auto;width:0.625rem;height:0.625rem;
border-radius:999px;background:var(--vibeui-contact-015-card);
}
[data-vibeui-block="contact-015"] [data-part="card"]{
margin-top:1rem;display:grid;gap:0.375rem;max-width:24rem;
padding:1.375rem;border:1px solid var(--vibeui-contact-015-border);border-radius:1rem;
background:var(--vibeui-contact-015-card);
}
[data-vibeui-block="contact-015"] [data-part="cardtitle"]{
margin:0;font-size:1.125rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="contact-015"] [data-part="address"]{
margin:0;font-style:normal;font-size:0.9375rem;line-height:1.55;
}
[data-vibeui-block="contact-015"] [data-part="addressnote"]{
margin:0;color:var(--vibeui-contact-015-muted);font-size:0.8125rem;line-height:1.5;
}
[data-vibeui-block="contact-015"] [data-part="hoursline"]{
margin:0.25rem 0 0;padding-top:0.625rem;border-top:1px solid var(--vibeui-contact-015-border);
color:var(--vibeui-contact-015-muted);font-size:0.8125rem;line-height:1.5;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="contact-015"] [data-part="maplink"]{
margin-top:0.375rem;display:inline-flex;align-items:center;gap:0.375rem;justify-self:start;
color:var(--vibeui-contact-015-accent);font-size:0.9375rem;font-weight:650;text-decoration:none;
}
[data-vibeui-block="contact-015"] [data-part="maplink"]::after{content:"→";transition:translate 0.18s ease}
[data-vibeui-block="contact-015"] [data-part="maplink"]:hover{text-decoration:underline;text-underline-offset:0.25em}
[data-vibeui-block="contact-015"] [data-part="maplink"]:hover::after{translate:0.25rem 0}
[data-vibeui-block="contact-015"] [data-part="maplink"]:focus-visible{
outline:2px solid var(--vibeui-contact-015-accent);outline-offset:3px;border-radius:0.25rem;
}
@container (min-width: 40rem){
[data-vibeui-block="contact-015"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="contact-015"] [data-part="map"]{min-height:24rem}
[data-vibeui-block="contact-015"] [data-part="card"]{
position:absolute;left:1.5rem;bottom:1.5rem;margin-top:0;
box-shadow:0 24px 48px -32px var(--vibeui-contact-015-shadow);
}
[data-vibeui-block="contact-015"] [data-part="pin"]{left:62%}
[data-vibeui-block="contact-015"] [data-part="pulse"]{left:62%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-015"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/** Декоративная CSS-карта с оранжевым пином и карточкой адреса поверх. */
export function Contact015({
  eyebrow = "Как нас найти",
  title = "Офис на карте",
  cardTitle = "Студия VibeUI",
  address = "Москва, Большая Дмитровка, 14, строение 2",
  addressNote = "Вход со двора, синяя дверь без вывески. Второй этаж, направо до конца коридора.",
  hoursLine = "Пн–Пт, 10:00–19:00 · гостям — кофе",
  mapHref = "https://maps.example",
  mapLabel = "Открыть в картах",
  background = "",
  accent,
  className,
  style,
}: Contact015Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-contact-015-accent": accent,
          "--vibeui-contact-015-accent-fill": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-contact-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contact-015" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="contact-015"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="scene">
            <div data-part="map" aria-hidden="true">
              <span data-part="pulse" />
              <span data-part="pin" />
            </div>
            <div data-part="card">
              <h3 data-part="cardtitle">{cardTitle}</h3>
              <address data-part="address">{address}</address>
              <p data-part="addressnote">{addressNote}</p>
              <p data-part="hoursline">{hoursLine}</p>
              <a data-part="maplink" href={mapHref}>
                {mapLabel}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
