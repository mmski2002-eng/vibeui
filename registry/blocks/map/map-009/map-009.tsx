import type { CSSProperties } from "react"

export type Map009Way = {
  /** Иконка: car | bus | bed | parking. */
  icon?: string
  title: string
  text: string
}

export type Map009Props = {
  eyebrow?: string
  title?: string
  lede?: string
  address?: string
  latitude?: number
  longitude?: number
  zoom?: number
  image?: string
  imageAlt?: string
  imageCaption?: string
  /** Как добраться и что дальше: машина, трансфер, ночёвка, парковка. */
  ways?: readonly Map009Way[]
  openLabel?: string
  theme?: "auto" | "light" | "dark"
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Как доехать» зимней свадьбы: тёмная Яндекс Карта с одной меткой дома,
// рядом фото дома в морозной раме с рукописной подписью и адрес; ниже
// карточки «на машине», «трансфер», «ночёвка», «парковка» с иконками в
// светящихся кольцах. Серверный, без состояния.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Marck+Script&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="map-009"]){
--vibeui-map-009-bg:light-dark(#f2eee6,#0b1220);
--vibeui-map-009-card:light-dark(#ffffff,#131c2e);
--vibeui-map-009-fg:light-dark(#1c2740,#f2eee6);
--vibeui-map-009-muted:light-dark(#5b6880,#9fb0c8);
--vibeui-map-009-line:light-dark(rgb(28 39 64 / .16),rgb(159 176 200 / .24));
--vibeui-map-009-accent:#f2b64f;
--vibeui-map-009-silver:#9fb0c8;
--vibeui-map-009-display:"Cormorant Garamond",Georgia,serif;
--vibeui-map-009-script:"Marck Script","Segoe Script",cursive;
--vibeui-map-009-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="map-009"]{color-scheme:dark}
:where([data-vibeui-block="map-009"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="map-009"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="map-009"]{box-sizing:border-box;display:block;background:var(--vibeui-map-009-bg);color:var(--vibeui-map-009-fg);font-family:var(--vibeui-map-009-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="map-009"] *{box-sizing:border-box}
[data-vibeui-block="map-009"] a{color:inherit;text-decoration:none}
[data-vibeui-block="map-009"] a:focus-visible{outline:2px solid var(--vibeui-map-009-accent);outline-offset:3px;border-radius:.4rem}
[data-vibeui-block="map-009"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4.5rem 1.25rem}
[data-vibeui-block="map-009"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-map-009-display);font-size:.85rem;font-weight:500;letter-spacing:.32em;text-transform:uppercase;color:var(--vibeui-map-009-silver)}
[data-vibeui-block="map-009"] [data-part="title"]{margin:0;font-family:var(--vibeui-map-009-display);font-size:clamp(2.2rem,5.5cqi,3.8rem);font-weight:500;line-height:1.05}
[data-vibeui-block="map-009"] [data-part="lede"]{max-width:36rem;margin:1rem 0 0;color:var(--vibeui-map-009-muted)}
[data-vibeui-block="map-009"] [data-part="grid"]{display:grid;gap:1.5rem;margin-top:2.5rem}
[data-vibeui-block="map-009"] [data-part="map"]{position:relative;min-height:22rem;overflow:hidden;border:1px solid var(--vibeui-map-009-line);border-radius:1rem;background:var(--vibeui-map-009-card);box-shadow:0 30px 60px -40px rgb(0 0 0 / .8)}
[data-vibeui-block="map-009"] [data-part="map"] iframe{position:absolute;inset:0;width:100%;height:100%;border:0;filter:saturate(.7)}
[data-vibeui-block="map-009"] [data-part="map"]::after{content:"";position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 60px rgb(11 18 32 / .6);border-radius:1rem}
[data-vibeui-block="map-009"] [data-part="aside"]{display:grid;gap:1.25rem;align-content:start}
[data-vibeui-block="map-009"] [data-part="photo"]{position:relative;margin:0;padding:.45rem;border:1px solid var(--vibeui-map-009-line);border-radius:.5rem;background:var(--vibeui-map-009-card);box-shadow:0 24px 44px -30px rgb(0 0 0 / .8)}
[data-vibeui-block="map-009"] [data-part="photo"] span{position:relative;display:block;aspect-ratio:3/2;overflow:hidden;border-radius:.25rem;background:var(--vibeui-map-009-bg)}
[data-vibeui-block="map-009"] [data-part="photo"] span::after{content:"";position:absolute;inset:0;background:radial-gradient(35% 40% at 0 100%,rgb(242 238 230 / .38),transparent 70%),radial-gradient(30% 35% at 100% 0,rgb(242 238 230 / .28),transparent 70%);mix-blend-mode:screen;pointer-events:none}
[data-vibeui-block="map-009"] [data-part="photo"] img{display:block;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="map-009"] [data-part="photo"] figcaption{padding:.6rem .3rem .2rem;font-family:var(--vibeui-map-009-script);font-size:1.2rem;color:var(--vibeui-map-009-silver)}
[data-vibeui-block="map-009"] [data-part="address"]{display:grid;gap:.2rem;margin:0}
[data-vibeui-block="map-009"] [data-part="address"] b{font-family:var(--vibeui-map-009-display);font-size:1.5rem;font-weight:500;line-height:1.15}
[data-vibeui-block="map-009"] [data-part="address"] span{font-size:.9rem;color:var(--vibeui-map-009-muted)}
[data-vibeui-block="map-009"] [data-part="open"]{display:inline-flex;align-items:center;gap:.4rem;margin-top:.4rem;font-family:var(--vibeui-map-009-display);font-size:1rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--vibeui-map-009-accent);border-bottom:1px solid rgb(242 182 79 / .4);width:max-content}
[data-vibeui-block="map-009"] [data-part="ways"]{display:grid;gap:1rem;margin:2rem 0 0;padding:0;list-style:none}
[data-vibeui-block="map-009"] [data-part="way"]{display:grid;grid-template-columns:2.6rem minmax(0,1fr);gap:.2rem 1rem;padding:1.2rem 1.3rem;border:1px solid var(--vibeui-map-009-line);border-radius:.9rem;background:var(--vibeui-map-009-card);transition:border-color .3s,box-shadow .3s}
[data-vibeui-block="map-009"] [data-part="way"]:hover{border-color:rgb(242 182 79 / .4);box-shadow:0 0 30px -12px rgb(242 182 79 / .5)}
[data-vibeui-block="map-009"] [data-part="way"] svg{grid-row:span 2;width:2.6rem;height:2.6rem;padding:.6rem;border-radius:50%;border:1px solid var(--vibeui-map-009-line);color:var(--vibeui-map-009-accent);fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;box-shadow:0 0 14px -4px var(--vibeui-map-009-accent)}
[data-vibeui-block="map-009"] [data-part="way"] b{font-family:var(--vibeui-map-009-display);font-size:1.3rem;font-weight:500;line-height:1.15}
[data-vibeui-block="map-009"] [data-part="way"] p{margin:0;font-size:.92rem;color:var(--vibeui-map-009-muted)}
@container (min-width:56rem){
[data-vibeui-block="map-009"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="map-009"] [data-part="grid"]{grid-template-columns:minmax(0,1.3fr) minmax(0,.7fr);gap:2rem}
[data-vibeui-block="map-009"] [data-part="map"]{min-height:28rem}
[data-vibeui-block="map-009"] [data-part="ways"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (min-width:72rem){
[data-vibeui-block="map-009"] [data-part="ways"]{grid-template-columns:repeat(4,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="map-009"] *{animation:none!important;transition:none!important}}`

const ICONS: Record<string, string> = {
  car: "M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11M4 11h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1zM6 17v2M18 17v2M7 14h.01M17 14h.01",
  bus: "M5 4h14a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1zM4 10h16M7 18v2M17 18v2M8 14h.01M16 14h.01",
  bed: "M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 15h18M6 9V6a1 1 0 0 1 1-1h4v4M13 9V5h4a1 1 0 0 1 1 1v3",
  parking: "M6 4h7a4 4 0 0 1 0 8H9v8H6zM9 7v2h4a1 1 0 0 0 0-2z",
}

/** «Как доехать»: тёмная Яндекс Карта с домом, фото в морозной раме, адрес и карточки «машина / трансфер / ночёвка / парковка». */
export function Map009({
  eyebrow = "Как доехать",
  title = "Лесная усадьба",
  lede = "Сорок километров от МКАД по Новорижскому шоссе, потом десять минут по лесу. Навигатор ведёт правильно, снег чистят.",
  address = "Московская область, Истринский район, деревня Лесная, 12",
  latitude = 55.9107,
  longitude = 36.8624,
  zoom = 11,
  image,
  imageAlt = "",
  imageCaption = "дом, где всё случится",
  ways = [
    { icon: "car", title: "На машине", text: "Час от центра без пробок. Точка в навигаторе — по кнопке выше. Въезд через ворота, охрана знает про свадьбу." },
    { icon: "bus", title: "Трансфер", text: "От метро «Тушинская» в 14:30 и 15:15, автобусы с табличкой «В ❄ Д». Обратно — в 00:30 и 01:00." },
    { icon: "bed", title: "Ночёвка", text: "В доме двенадцать комнат: кто хочет остаться — отметьте в анкете, мы распределим и напишем." },
    { icon: "parking", title: "Парковка", text: "Под навесом на двадцать машин, ещё столько же у ворот. Утром машины будут в снегу — щётка у охраны." },
  ],
  openLabel = "Открыть в Яндекс Картах",
  theme = "auto",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Map009Props) {
  const palette = {
    ...(accent ? { "--vibeui-map-009-accent": accent } : null),
    ...(background ? { "--vibeui-map-009-bg": background } : null),
    ...style,
  } as CSSProperties
  const mapTheme = theme === "auto" ? (tone === "light" ? "light" : "dark") : theme
  // Виджет без ключа: координаты в адресе, кодировать нельзя.
  const point = `${longitude.toFixed(5)},${latitude.toFixed(5)}`
  const embed = `https://yandex.ru/map-widget/v1/?ll=${point}&z=${zoom}&pt=${point},pm2ywm&lang=ru_RU&theme=${mapTheme}`
  const openHref = `https://yandex.ru/maps/?ll=${point}&z=${zoom}&pt=${point}`

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-map-009" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="map-009" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
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
              <p data-part="address">
                <b>{title}</b>
                <span>{address}</span>
                <a data-part="open" href={openHref} target="_blank" rel="noopener noreferrer">
                  {openLabel} ↗
                </a>
              </p>
            </div>
          </div>
          {ways.length > 0 ? (
            <ul data-part="ways">
              {ways.map((way) => (
                <li key={way.title} data-part="way">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d={ICONS[way.icon ?? ""] ?? ICONS.car} />
                  </svg>
                  <b>{way.title}</b>
                  <p>{way.text}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    </>
  )
}
