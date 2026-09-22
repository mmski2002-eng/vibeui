import type { CSSProperties } from "react"
import { Card139 } from "@/registry/components/card/card-139/card-139"

export type Map008Point = {
  /** Код точки на карте: «HAV», «CYO». */
  code: string
  title: string
  text: string
  latitude: number
  longitude: number
}

export type Map008Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Точки — отель, пляж, аэропорт. Первая — центр карты. */
  points?: readonly Map008Point[]
  zoom?: number
  image?: string
  imageAlt?: string
  /** Подпись фото рукописным: «отель на Кайо-Ларго». */
  imageCaption?: string
  transferTitle?: string
  transferText?: string
  openLabel?: string
  theme?: "auto" | "light" | "dark"
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Где всё будет»: слева Яндекс Карта с метками отеля, пляжа и аэропорта в
// выцветших тонах, справа фото отеля на скотче с рукописной подписью и
// список точек с кодами, как в бортовом журнале; внизу плашка про
// трансфер. Серверный, без состояния.
const FONTS = "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Lobster&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="map-008"]){
--vibeui-map-008-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-map-008-paper:light-dark(#fffaf0,#1a1a1a);
--vibeui-map-008-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-map-008-muted:light-dark(#5b6f78,#a3a3a3);
--vibeui-map-008-line:light-dark(#e3d7bf,#2e2e2e);
--vibeui-map-008-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-map-008-sea:#2aa7a0;
--vibeui-map-008-sun:#f2c14e;
--vibeui-map-008-display:"Oswald","Arial Narrow",Impact,sans-serif;
--vibeui-map-008-script:"Lobster","Brush Script MT",cursive;
--vibeui-map-008-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="map-008"]{color-scheme:dark}
:where([data-vibeui-block="map-008"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="map-008"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="map-008"]{box-sizing:border-box;display:block;background:var(--vibeui-map-008-bg);color:var(--vibeui-map-008-fg);font-family:var(--vibeui-map-008-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="map-008"] *{box-sizing:border-box}
[data-vibeui-block="map-008"] a{color:inherit}
[data-vibeui-block="map-008"] a:focus-visible{outline:2px solid var(--vibeui-map-008-accent);outline-offset:3px;border-radius:.4rem}
[data-vibeui-block="map-008"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="map-008"] [data-part="eyebrow"]{margin:0 0 .6rem;font-family:var(--vibeui-map-008-display);font-size:.8rem;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--vibeui-map-008-accent)}
[data-vibeui-block="map-008"] [data-part="title"]{margin:0;font-family:var(--vibeui-map-008-display);font-size:clamp(2.2rem,6cqi,4.2rem);font-weight:700;line-height:.98;text-transform:uppercase}
[data-vibeui-block="map-008"] [data-part="lede"]{max-width:36rem;margin:.8rem 0 0;color:var(--vibeui-map-008-muted)}
[data-vibeui-block="map-008"] [data-part="grid"]{display:grid;gap:1.5rem;margin-top:2.5rem}
[data-vibeui-block="map-008"] [data-part="map"]{position:relative;min-height:20rem;border-radius:1rem;overflow:hidden;background:var(--vibeui-map-008-paper);box-shadow:0 0 0 6px var(--vibeui-map-008-paper),0 30px 60px -40px rgb(18 58 75 / .5)}
[data-vibeui-block="map-008"] iframe{position:absolute;inset:0;width:100%;height:100%;border:0;filter:saturate(.75) sepia(.2) contrast(.95)}
[data-vibeui-block="map-008"] [data-part="aside"]{display:grid;gap:1.25rem;align-content:start}
[data-vibeui-block="map-008"] [data-part="photo"]{position:relative;margin:0;padding:.7rem .7rem 2.2rem;background:var(--vibeui-map-008-paper);box-shadow:0 20px 40px -28px rgb(18 58 75 / .6);transform:rotate(-2deg);width:min(100%,20rem)}
[data-vibeui-block="map-008"] [data-part="photo"]::before{content:"";position:absolute;top:-.6rem;left:50%;width:5rem;height:1.4rem;margin-left:-2.5rem;background:rgb(255 255 255 / .55);box-shadow:0 1px 2px rgb(0 0 0 / .1);transform:rotate(-3deg)}
[data-vibeui-block="map-008"] [data-part="photo"] span{display:block;aspect-ratio:3/2;overflow:hidden;background:var(--vibeui-map-008-bg)}
[data-vibeui-block="map-008"] [data-part="photo"] img{display:block;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="map-008"] [data-part="photo"] figcaption{position:absolute;left:0;right:0;bottom:.5rem;text-align:center;font-family:var(--vibeui-map-008-script);font-size:1.15rem;color:var(--vibeui-map-008-fg)}
[data-vibeui-block="map-008"] [data-part="points"]{display:grid;gap:.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="map-008"] [data-part="open"]{display:inline-flex;align-items:center;gap:.4rem;width:max-content;font-family:var(--vibeui-map-008-display);font-size:.8rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;text-decoration:none;border-bottom:2px solid var(--vibeui-map-008-accent);transition:color .25s}
[data-vibeui-block="map-008"] [data-part="open"]:hover{color:var(--vibeui-map-008-accent)}
[data-vibeui-block="map-008"] [data-part="transfer"]{display:grid;grid-template-columns:auto minmax(0,1fr);gap:1rem;align-items:center;margin-top:1.5rem;padding:1.2rem 1.4rem;border-radius:.9rem;background:var(--vibeui-map-008-fg);color:var(--vibeui-map-008-bg)}
[data-vibeui-block="map-008"] [data-part="transfer"] svg{width:2.6rem;height:2.6rem;fill:none;stroke:var(--vibeui-map-008-sun);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
[data-vibeui-block="map-008"] [data-part="transfer"] b{display:block;font-family:var(--vibeui-map-008-display);font-size:1.1rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase}
[data-vibeui-block="map-008"] [data-part="transfer"] p{margin:0;font-size:.92rem;opacity:.85}
@container (min-width:56rem){
[data-vibeui-block="map-008"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="map-008"] [data-part="grid"]{grid-template-columns:minmax(0,1.3fr) minmax(18rem,.7fr);gap:2.5rem}
[data-vibeui-block="map-008"] [data-part="map"]{min-height:30rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="map-008"] *{animation:none!important;transition:none!important}}`

/** «Где всё будет» для свадьбы за границей: Яндекс Карта с отелем, пляжем и аэропортом, фото отеля на скотче, точки с кодами и трансфер. */
export function Map008({
  eyebrow = "Где",
  title = "Кайо-Ларго и Гавана",
  lede = "Два места, один остров. Прилетаем в Гавану, на второй день — сорок минут на маленьком самолёте до пляжа.",
  points = [
    { code: "CYO", title: "Отель на Кайо-Ларго", text: "Бунгало у воды, все номера наши на две ночи", latitude: 21.6098, longitude: -81.5476 },
    { code: "PLY", title: "Playa Paraíso", text: "Церемония и ужин, 10 минут пешком от отеля", latitude: 21.6245, longitude: -81.5628 },
    { code: "HAV", title: "Гавана, отель в старом городе", text: "Первая и последняя ночь, рядом Малекон", latitude: 23.1375, longitude: -82.3546 },
  ],
  zoom = 7,
  image,
  imageAlt = "",
  imageCaption = "наш отель на Кайо-Ларго",
  transferTitle = "Трансферы — на нас",
  transferText = "Из аэропорта в отель, между Гаваной и Кайо-Ларго, обратно в аэропорт. Ищите Мариэлу с табличкой.",
  openLabel = "Открыть в Яндекс Картах",
  theme = "auto",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Map008Props) {
  const palette = {
    ...(accent ? { "--vibeui-map-008-accent": accent } : null),
    ...(ink ? { "--vibeui-map-008-fg": ink } : null),
    ...(background ? { "--vibeui-map-008-bg": background } : null),
    ...style,
  } as CSSProperties
  const mapTheme = theme === "auto" ? (tone === "dark" ? "dark" : "light") : theme
  const centerLatitude = points.reduce((sum, point) => sum + point.latitude, 0) / Math.max(1, points.length)
  const centerLongitude = points.reduce((sum, point) => sum + point.longitude, 0) / Math.max(1, points.length)
  // Виджет без ключа: метки перечисляются в pt через «~», кодировать нельзя.
  const markers = points.map((point) => `${point.longitude.toFixed(5)},${point.latitude.toFixed(5)},pm2rdm`).join("~")
  const embed = `https://yandex.ru/map-widget/v1/?ll=${centerLongitude.toFixed(5)},${centerLatitude.toFixed(5)}&z=${zoom}&pt=${markers}&lang=ru_RU&theme=${mapTheme}`
  const openHref = `https://yandex.ru/maps/?ll=${centerLongitude.toFixed(5)},${centerLatitude.toFixed(5)}&z=${zoom}&pt=${markers}`

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-map-008" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="map-008" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="grid">
            <div data-part="map">
              <iframe src={embed} title={title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
            <div data-part="aside">
              {image ? (
                <figure data-part="photo">
                  <span>
                    <img src={image} alt={imageAlt} loading="lazy" />
                  </span>
                  {imageCaption ? <figcaption>{imageCaption}</figcaption> : null}
                </figure>
              ) : null}
              <ul data-part="points">
                {points.map((point) => (
                  <Card139 key={point.code} data-part="point" code={point.code} title={point.title} text={point.text} accent={accent} />
                ))}
              </ul>
              <a data-part="open" href={openHref} target="_blank" rel="noopener noreferrer">
                {openLabel} ↗
              </a>
            </div>
          </div>
          {transferTitle ? (
            <div data-part="transfer">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 4h14a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1zM4 10h16M7 18v2M17 18v2M8 14h.01M16 14h.01" />
              </svg>
              <div>
                <b>{transferTitle}</b>
                <p>{transferText}</p>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
