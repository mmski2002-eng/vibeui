import type { CSSProperties } from "react"
import { Card140 } from "@/registry/components/card/card-140/card-140"

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
  /** Фото-карта (аэро-вид) в панель карты; пусто — рисованный SVG-схематик. */
  mapImage?: string
  mapImageAlt?: string
  /** Как добраться и что дальше: машина, трансфер, ночёвка, парковка. */
  ways?: readonly Map009Way[]
  openLabel?: string
  theme?: "auto" | "light" | "dark"
  /** alt картинки карты и aria рисованной карты. */
  mapAlt?: string
  drawnMapLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Как доехать» зимней свадьбы: статичная стилизованная карта — инлайновый
// SVG без внешних embed, скриптов и трекеров — с одной меткой дома, рядом
// фото дома в морозной раме с рукописной подписью и адрес; ниже карточки
// «на машине», «трансфер», «ночёвка», «парковка» с иконками в светящихся
// кольцах. Серверный, без состояния, ноль сетевых запросов.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Marck+Script&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="map-009"]){
--vibeui-map-009-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-map-009-card:light-dark(#ffffff,#242424);
--vibeui-map-009-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-map-009-muted:light-dark(#6b6b6b,#a3a3a3);
--vibeui-map-009-line:light-dark(color-mix(in oklab,var(--vibeui-map-009-fg) 16%,transparent),color-mix(in oklab,var(--vibeui-map-009-fg) 24%,transparent));
--vibeui-map-009-accent:light-dark(#1a1a1a,#f2f2f2);
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
[data-vibeui-block="map-009"] [data-part="map"] svg{position:absolute;inset:0;width:100%;height:100%;display:block}
[data-vibeui-block="map-009"] [data-part="map"]::after{content:"";position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 60px rgb(11 18 32 / .6);border-radius:1rem}
[data-vibeui-block="map-009"] [data-part="map"] path[data-route]{animation:vibeui-map-009-dash 6s linear infinite}
[data-vibeui-block="map-009"] [data-part="map"] circle[data-pulse]{animation:vibeui-map-009-pulse 2.8s ease-out infinite}
@keyframes vibeui-map-009-dash{to{stroke-dashoffset:-16}}
@keyframes vibeui-map-009-pulse{0%{r:8;opacity:.55}100%{r:24;opacity:0}}
[data-vibeui-block="map-009"] [data-part="map"] .vibeui-map-009-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
[data-vibeui-block="map-009"] [data-part="map"][data-photo="true"] svg{display:none}
[data-vibeui-block="map-009"] [data-part="map"][data-photo="true"]::after{box-shadow:inset 0 0 130px rgb(11 18 32 / .8)}
[data-vibeui-block="map-009"] [data-part="marker"]{position:absolute;left:50%;top:47%;z-index:2;width:2.6rem;height:2.6rem;transform:translate(-50%,-100%) rotate(45deg);display:grid;place-items:center;border-radius:50% 50% 50% 0;background:var(--vibeui-map-009-accent);box-shadow:0 8px 20px -4px rgb(0 0 0 / .7),0 0 26px rgb(242 182 79 / .6)}
[data-vibeui-block="map-009"] [data-part="marker"] svg{transform:rotate(-45deg);width:1.25rem;height:1.25rem;fill:none;stroke:#0b1220;stroke-width:1.8;stroke-linecap:round}
[data-vibeui-block="map-009"] [data-part="marker"]::after{content:"";position:absolute;left:50%;top:50%;z-index:-1;width:3.6rem;height:3.6rem;border-radius:50%;background:radial-gradient(circle,rgb(242 182 79 / .4),transparent 68%);animation:vibeui-map-009-ping 2.8s ease-out infinite}
@keyframes vibeui-map-009-ping{0%{opacity:.7;transform:translate(-50%,-50%) scale(.5)}100%{opacity:0;transform:translate(-50%,-50%) scale(1.5)}}
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


/** «Как доехать»: статичная стилизованная карта с домом, фото в морозной раме, адрес и карточки «машина / трансфер / ночёвка / парковка». */
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
  mapImage,
  mapImageAlt = "",
  ways = [
    { icon: "car", title: "На машине", text: "Час от центра без пробок. Точка в навигаторе — по кнопке выше. Въезд через ворота, охрана знает про свадьбу." },
    { icon: "bus", title: "Трансфер", text: "От метро «Тушинская» в 14:30 и 15:15, автобусы с табличкой «В ❄ Д». Обратно — в 00:30 и 01:00." },
    { icon: "bed", title: "Ночёвка", text: "В доме двенадцать комнат: кто хочет остаться — отметьте в анкете, мы распределим и напишем." },
    { icon: "parking", title: "Парковка", text: "Под навесом на двадцать машин, ещё столько же у ворот. Утром машины будут в снегу — щётка у охраны." },
  ],
  openLabel = "Открыть в Яндекс Картах",
  theme = "auto",
  mapAlt = "Карта проезда: {address}",
  drawnMapLabel = "Стилизованная карта проезда: {address}",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Map009Props) {
  const palette = {
    ...(accent ? { "--vibeui-map-009-accent": accent } : null),
    ...(ink ? { "--vibeui-map-009-fg": ink } : null),
    ...(background ? { "--vibeui-map-009-bg": background } : null),
    ...style,
  } as CSSProperties
  const mapDark = theme === "auto" ? tone !== "light" : theme === "dark"
  const point = `${longitude.toFixed(5)},${latitude.toFixed(5)}`
  const openHref = `https://yandex.ru/maps/?ll=${point}&z=${zoom}&pt=${point}`

  // Статичная иллюстрация местности: рисуется из координат детерминированным
  // псевдослучайным сдвигом, без единого сетевого запроса — разные адреса
  // выглядят по-разному, но повторяемо для одних и тех же координат.
  const seed = Math.abs(Math.round(latitude * 9973 + longitude * 5741))
  const rand = (n: number) => {
    const x = Math.sin(seed + n * 12.9898) * 43758.5453
    return x - Math.floor(x)
  }
  const jitter = (n: number, spread: number) => (rand(n) - 0.5) * spread
  const mapBg = mapDark ? "#131c2e" : "#eef1ea"
  const mapRoad = mapDark ? "#9fb0c8" : "#7c8a9e"
  const mapInk = mapDark ? "#f2eee6" : "#1a2433"
  const pinX = 348 + jitter(1, 18)
  const pinY = 122 + jitter(2, 14)
  const flakeX = pinX
  const flakeY = pinY - 24
  const mainRoad = `M -20 ${(196 + jitter(3, 40)).toFixed(1)} C 90 ${(150 + jitter(4, 30)).toFixed(1)}, 150 ${(232 + jitter(5, 30)).toFixed(1)}, 250 ${(170 + jitter(6, 26)).toFixed(1)} S 420 ${(92 + jitter(7, 20)).toFixed(1)} 500 ${(70 + jitter(7, 14)).toFixed(1)}`
  const branchRoad = `M ${(258 + jitter(8, 10)).toFixed(1)} ${(172 + jitter(9, 8)).toFixed(1)} C ${(290 + jitter(10, 12)).toFixed(1)} ${(150 + jitter(11, 10)).toFixed(1)}, ${(320 + jitter(12, 10)).toFixed(1)} ${(140 + jitter(13, 8)).toFixed(1)}, ${pinX.toFixed(1)} ${pinY.toFixed(1)}`
  const sideRoad = `M ${(160 + jitter(16, 30)).toFixed(1)} 300 C ${(170 + jitter(17, 20)).toFixed(1)} 250, ${(190 + jitter(18, 20)).toFixed(1)} 220, ${(214 + jitter(5, 10)).toFixed(1)} ${(228 + jitter(19, 10)).toFixed(1)}`
  const routeLine = `M 30 ${(214 + jitter(14, 20)).toFixed(1)} Q 150 ${(198 + jitter(15, 16)).toFixed(1)} 258 ${(172 + jitter(9, 8)).toFixed(1)} T ${pinX.toFixed(1)} ${pinY.toFixed(1)}`
  const contours = [70, 132, 252].map((baseY, i) => {
    const y1 = baseY + jitter(40 + i, 14)
    const y2 = baseY + jitter(41 + i, 14) - 16
    const y3 = baseY + jitter(42 + i, 14)
    const y4 = baseY + jitter(43 + i, 14) + 6
    return `M -10 ${y1.toFixed(1)} Q 160 ${y2.toFixed(1)} 320 ${y3.toFixed(1)} T 500 ${y4.toFixed(1)}`
  })
  const treeCount = Math.max(4, Math.min(10, Math.round(zoom * 0.7)))
  const trees = Array.from({ length: treeCount }, (_, i) => {
    const x = 232 + rand(10 + i) * 210
    const y = 26 + rand(20 + i) * 190
    const s = 5 + rand(30 + i) * 3
    return { x, y, s, key: `tree-${i}` }
  }).filter((t) => Math.hypot(t.x - pinX, t.y - pinY) > 26)
  const snow = Array.from({ length: 16 }, (_, i) => ({
    x: rand(50 + i) * 480,
    y: rand(70 + i) * 300,
    r: 0.6 + rand(90 + i) * 1.1,
    o: 0.18 + rand(110 + i) * 0.32,
    key: `snow-${i}`,
  }))
  const flakeLines = [0, 60, 120].map((deg) => {
    const r = (deg * Math.PI) / 180
    const dx = Math.cos(r) * 5
    const dy = Math.sin(r) * 5
    return `M ${(flakeX - dx).toFixed(1)} ${(flakeY - dy).toFixed(1)} L ${(flakeX + dx).toFixed(1)} ${(flakeY + dy).toFixed(1)}`
  })
  const coordsLabel = `${Math.abs(latitude).toFixed(4)}° ${latitude >= 0 ? "N" : "S"}, ${Math.abs(longitude).toFixed(4)}° ${longitude >= 0 ? "E" : "W"}`

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
            <div data-part="map" data-photo={mapImage ? "true" : undefined}>
              {mapImage ? (
                <>
                  <img className="vibeui-map-009-photo" src={mapImage} alt={mapImageAlt || mapAlt.replace("{address}", address)} loading="lazy" />
                  <span data-part="marker" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
                    </svg>
                  </span>
                </>
              ) : null}
              <svg viewBox="0 0 480 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label={drawnMapLabel.replace("{address}", address)}>
                <rect x="0" y="0" width="480" height="300" fill={mapBg} />
                {contours.map((d, i) => (
                  <path key={`contour-${i}`} d={d} fill="none" stroke={mapInk} strokeWidth="1" strokeOpacity="0.06" />
                ))}
                <path d={sideRoad} fill="none" stroke={mapRoad} strokeWidth="2" strokeOpacity="0.26" strokeLinecap="round" />
                <path d={mainRoad} fill="none" stroke={mapRoad} strokeWidth="3.2" strokeOpacity="0.4" strokeLinecap="round" />
                <path d={branchRoad} fill="none" stroke={mapRoad} strokeWidth="2.4" strokeOpacity="0.46" strokeLinecap="round" />
                {trees.map((t) => (
                  <path
                    key={t.key}
                    d={`M ${t.x.toFixed(1)} ${(t.y + t.s).toFixed(1)} L ${(t.x - t.s * 0.7).toFixed(1)} ${(t.y + t.s).toFixed(1)} L ${t.x.toFixed(1)} ${(t.y - t.s * 1.3).toFixed(1)} Z M ${t.x.toFixed(1)} ${(t.y + t.s * 0.4).toFixed(1)} L ${(t.x - t.s * 0.55).toFixed(1)} ${(t.y + t.s * 0.4).toFixed(1)} L ${t.x.toFixed(1)} ${(t.y - t.s * 0.5).toFixed(1)} Z`}
                    fill={mapRoad}
                    fillOpacity="0.32"
                  />
                ))}
                {snow.map((s) => (
                  <circle key={s.key} cx={s.x} cy={s.y} r={s.r} fill={mapInk} fillOpacity={s.o} />
                ))}
                <path data-route d={routeLine} fill="none" stroke="var(--vibeui-map-009-accent)" strokeWidth="1.6" strokeDasharray="1 7" strokeLinecap="round" opacity="0.85" />
                <circle cx={flakeX} cy={flakeY} r="18" fill="var(--vibeui-map-009-accent)" opacity="0.14" />
                <circle data-pulse cx={flakeX} cy={flakeY} r="8" fill="none" stroke="var(--vibeui-map-009-accent)" strokeWidth="1.4" opacity="0.55" />
                <path d={`M ${pinX.toFixed(1)} ${pinY.toFixed(1)} L ${(pinX - 11).toFixed(1)} ${(pinY - 24).toFixed(1)} A 11 11 0 1 1 ${(pinX + 11).toFixed(1)} ${(pinY - 24).toFixed(1)} Z`} fill="var(--vibeui-map-009-accent)" />
                <circle cx={flakeX} cy={flakeY} r="8" fill={mapBg} />
                <g stroke="var(--vibeui-map-009-accent)" strokeWidth="1.3" strokeLinecap="round">
                  {flakeLines.map((d, i) => (
                    <path key={`flake-${i}`} d={d} />
                  ))}
                </g>
                <text x="14" y="286" fontSize="8" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fill={mapInk} fillOpacity="0.5" letterSpacing="0.04em">
                  {coordsLabel}
                </text>
              </svg>
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
                <Card140 key={way.title} data-part="way" title={way.title} icon={way.icon} text={way.text} accent={accent} />
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    </>
  )
}
