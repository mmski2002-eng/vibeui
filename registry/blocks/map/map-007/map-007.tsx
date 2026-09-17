import type { CSSProperties } from "react"

export type Map007Way = {
  /** Как: «На машине». */
  mode: string
  text: string
  /** Иконка: car | bus | taxi | train. */
  icon?: string
}

export type Map007Stay = {
  name: string
  text: string
  href?: string
}

export type Map007Props = {
  eyebrow?: string
  title?: string
  /** Название места и адрес под ним. */
  venue?: string
  address?: string
  /** Время сбора: «сбор гостей в 15:00». */
  timeNote?: string
  latitude?: number
  longitude?: number
  zoom?: number
  image?: string
  imageAlt?: string
  ways?: readonly Map007Way[]
  waysTitle?: string
  stays?: readonly Map007Stay[]
  staysTitle?: string
  staysNote?: string
  openLabel?: string
  /** Тема виджета Яндекс Карт. auto — по tone. */
  theme?: "auto" | "light" | "dark"
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Как добраться» для загородной свадьбы: слева фото усадьбы в арке с
// названием, адресом и временем сбора, справа Яндекс Карта с одной меткой.
// Ниже три способа доехать (машина, трансфер, такси) и «где переночевать»
// с парой отелей рядом. Серверный, без состояния.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="map-007"]){
--vibeui-map-007-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-map-007-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-map-007-muted:light-dark(#7a6a70,#a3a3a3);
--vibeui-map-007-line:light-dark(#e2d8ca,#2e2e2e);
--vibeui-map-007-card:light-dark(#fffaf3,#242424);
--vibeui-map-007-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-map-007-plum:var(--vibeui-map-007-fg);
--vibeui-map-007-sage:#8a9a7b;
--vibeui-map-007-sand:light-dark(#d9c5a5,#5a4a3a);
--vibeui-map-007-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-map-007-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="map-007"]{color-scheme:dark}
:where([data-vibeui-block="map-007"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="map-007"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="map-007"]{box-sizing:border-box;display:block;background:var(--vibeui-map-007-bg);color:var(--vibeui-map-007-fg);font-family:var(--vibeui-map-007-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="map-007"] *{box-sizing:border-box}
[data-vibeui-block="map-007"] a{color:inherit}
[data-vibeui-block="map-007"] a:focus-visible{outline:2px solid var(--vibeui-map-007-accent);outline-offset:3px;border-radius:.4rem}
[data-vibeui-block="map-007"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="map-007"] [data-part="eyebrow"]{margin:0 0 .6rem;font-size:.72rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--vibeui-map-007-accent)}
[data-vibeui-block="map-007"] [data-part="title"]{margin:0 0 2rem;font-family:var(--vibeui-map-007-display);font-size:clamp(2rem,5cqi,3.6rem);font-weight:500;font-style:italic;line-height:1.05;color:var(--vibeui-map-007-plum);text-wrap:balance}
[data-vibeui-block="map-007"] [data-part="top"]{display:grid;gap:1.5rem}
[data-vibeui-block="map-007"] [data-part="venue"]{display:grid;gap:1.2rem}
[data-vibeui-block="map-007"] [data-part="arch"]{display:block;aspect-ratio:4/3;border-radius:50% 50% 1rem 1rem / 30% 30% 1rem 1rem;overflow:hidden;background:var(--vibeui-map-007-sand)}
[data-vibeui-block="map-007"] [data-part="arch"] img{display:block;width:100%;height:100%;object-fit:cover;filter:saturate(.92)}
[data-vibeui-block="map-007"] [data-part="name"]{margin:0;font-family:var(--vibeui-map-007-display);font-size:1.8rem;font-weight:500;line-height:1.1;color:var(--vibeui-map-007-plum)}
[data-vibeui-block="map-007"] [data-part="address"]{margin:.3rem 0 0;color:var(--vibeui-map-007-muted)}
[data-vibeui-block="map-007"] [data-part="time"]{display:inline-flex;align-items:center;gap:.5rem;margin-top:.8rem;padding:.4rem .8rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-map-007-accent) 10%,transparent);color:var(--vibeui-map-007-accent);font-size:.82rem;font-weight:600}
[data-vibeui-block="map-007"] [data-part="open"]{display:inline-flex;align-items:center;gap:.4rem;margin-top:.5rem;font-size:.9rem;font-weight:600;text-decoration:none;color:var(--vibeui-map-007-fg);border-bottom:1px solid var(--vibeui-map-007-accent);width:max-content;transition:color .25s}
[data-vibeui-block="map-007"] [data-part="open"]:hover{color:var(--vibeui-map-007-accent)}
[data-vibeui-block="map-007"] [data-part="map"]{position:relative;min-height:18rem;border:1px solid var(--vibeui-map-007-line);border-radius:1.2rem;overflow:hidden;background:var(--vibeui-map-007-card)}
[data-vibeui-block="map-007"] iframe{position:absolute;inset:0;width:100%;height:100%;border:0;filter:saturate(.7) sepia(.15)}
[data-vibeui-block="map-007"] [data-part="ways"]{display:grid;gap:1rem;margin:2.5rem 0 0;padding:0;list-style:none}
[data-vibeui-block="map-007"] [data-part="way"]{display:grid;grid-template-columns:2.6rem minmax(0,1fr);gap:.9rem;padding:1.2rem;border:1px solid var(--vibeui-map-007-line);border-radius:1rem;background:var(--vibeui-map-007-card);transition:transform .25s,border-color .25s}
[data-vibeui-block="map-007"] [data-part="way"]:hover{transform:translateY(-2px);border-color:var(--vibeui-map-007-accent)}
[data-vibeui-block="map-007"] [data-part="way"] svg{width:2.6rem;height:2.6rem;padding:.6rem;border-radius:50%;background:color-mix(in oklab,var(--vibeui-map-007-sage) 18%,transparent);color:var(--vibeui-map-007-plum);fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
[data-vibeui-block="map-007"] [data-part="way"] h3{margin:0 0 .2rem;font-family:var(--vibeui-map-007-display);font-size:1.35rem;font-weight:500;line-height:1.15}
[data-vibeui-block="map-007"] [data-part="way"] p{margin:0;font-size:.92rem;color:var(--vibeui-map-007-muted)}
[data-vibeui-block="map-007"] [data-part="stays"]{margin-top:2.5rem;padding-top:2rem;border-top:1px solid var(--vibeui-map-007-line)}
[data-vibeui-block="map-007"] [data-part="stays"] h3{margin:0;font-family:var(--vibeui-map-007-display);font-size:1.6rem;font-weight:500;font-style:italic;color:var(--vibeui-map-007-plum)}
[data-vibeui-block="map-007"] [data-part="stays"] > p{margin:.3rem 0 1rem;font-size:.92rem;color:var(--vibeui-map-007-muted)}
[data-vibeui-block="map-007"] [data-part="stays"] ul{display:grid;gap:1rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="map-007"] [data-part="stay"]{display:grid;grid-template-columns:2.6rem minmax(0,1fr);gap:.15rem .9rem;padding:1.2rem;border:1px solid var(--vibeui-map-007-line);border-radius:1rem;background:var(--vibeui-map-007-card);transition:transform .25s,border-color .25s}
[data-vibeui-block="map-007"] [data-part="stay"]:hover{transform:translateY(-2px);border-color:var(--vibeui-map-007-accent)}
[data-vibeui-block="map-007"] [data-part="stay"] svg{grid-row:1 / span 2;width:2.6rem;height:2.6rem;padding:.6rem;border-radius:50%;background:color-mix(in oklab,var(--vibeui-map-007-accent) 12%,transparent);color:var(--vibeui-map-007-accent);fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
[data-vibeui-block="map-007"] [data-part="stay"] a,[data-vibeui-block="map-007"] [data-part="stay"] b{font-family:var(--vibeui-map-007-display);font-size:1.3rem;font-weight:500;line-height:1.15;text-decoration:none;width:max-content;max-width:100%;border-bottom:1px solid transparent;transition:border-color .25s}
[data-vibeui-block="map-007"] [data-part="stay"] a:hover{border-bottom-color:var(--vibeui-map-007-accent)}
[data-vibeui-block="map-007"] [data-part="stay"] span{font-size:.9rem;color:var(--vibeui-map-007-muted)}
@container (min-width:56rem){
[data-vibeui-block="map-007"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="map-007"] [data-part="top"]{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:2.5rem}
[data-vibeui-block="map-007"] [data-part="map"]{min-height:26rem}
[data-vibeui-block="map-007"] [data-part="ways"]{grid-template-columns:repeat(3,minmax(0,1fr))}
[data-vibeui-block="map-007"] [data-part="stays"] ul{grid-template-columns:1fr 1fr;gap:1rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="map-007"] *{animation:none!important;transition:none!important}}`

const ICONS: Record<string, string> = {
  car: "M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13M4 13h16v5H4zM7 18v2M17 18v2M7.5 15.5h.01M16.5 15.5h.01",
  bus: "M5 4h14a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1zM4 10h16M7 18v2M17 18v2M8 14h.01M16 14h.01",
  taxi: "M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13M4 13h16v5H4zM7 18v2M17 18v2M9 7V5h6v2",
  train: "M6 4h12a1 1 0 0 1 1 1v10a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V5a1 1 0 0 1 1-1zM5 10h14M8 18l-2 3M16 18l2 3M9 14h.01M15 14h.01",
}

/** «Как добраться» для загородной свадьбы: фото места в арке, Яндекс Карта, три способа доехать и где переночевать. */
export function Map007({
  eyebrow = "Место",
  title = "Усадьба Марфино, Подмосковье",
  venue = "Усадьба Марфино",
  address = "Московская область, Мытищинский район, село Марфино",
  timeNote = "Сбор гостей в 15:00",
  latitude = 56.07,
  longitude = 37.56,
  zoom = 13,
  image,
  imageAlt = "",
  ways = [
    { mode: "На машине", text: "45 минут от МКАД по Дмитровскому шоссе. Парковка у ворот усадьбы, бесплатно.", icon: "car" },
    { mode: "Трансфер", text: "Автобус от метро «Алтуфьево» в 13:30 и 14:15, обратно в 23:30. Отметьте в анкете — оставим место.", icon: "bus" },
    { mode: "Такси", text: "Из центра — около 2 500 ₽. Точка «Усадьба Марфино, главные ворота» есть во всех приложениях.", icon: "taxi" },
  ],
  waysTitle = "Как доехать",
  stays = [
    { name: "Гостевой дом «Липы»", text: "в 5 минутах пешком, 12 номеров, скажите, что от нас — оставят завтрак", href: "#" },
    { name: "Отель «Марфино Парк»", text: "в 10 минутах на машине, бассейн и сауна на утро после", href: "#" },
  ],
  staysTitle = "Где переночевать",
  staysNote = "Мы забронировали несколько номеров до 1 августа — напишите Полине, если хотите остаться.",
  openLabel = "Открыть в Яндекс Картах",
  theme = "auto",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Map007Props) {
  const palette = {
    ...(accent ? { "--vibeui-map-007-accent": accent } : null),
    ...(ink ? { "--vibeui-map-007-fg": ink } : null),
    ...(background ? { "--vibeui-map-007-bg": background } : null),
    ...style,
  } as CSSProperties
  const mapTheme = theme === "auto" ? (tone === "dark" ? "dark" : "light") : theme
  const point = `${longitude.toFixed(5)},${latitude.toFixed(5)}`
  // Виджет без ключа: метка передаётся в pt как «lon,lat,стиль».
  const embed = `https://yandex.ru/map-widget/v1/?ll=${point}&z=${zoom}&pt=${point},pm2dgm&lang=ru_RU&theme=${mapTheme}`
  const openHref = `https://yandex.ru/maps/?ll=${point}&z=${zoom}&pt=${point},pm2dgm`

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-map-007" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="map-007" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="top">
            <div data-part="venue">
              <span data-part="arch">{image ? <img src={image} alt={imageAlt} loading="lazy" /> : null}</span>
              <div>
                <h3 data-part="name">{venue}</h3>
                <p data-part="address">{address}</p>
                {timeNote ? <span data-part="time">{timeNote}</span> : null}
                <br />
                <a data-part="open" href={openHref} target="_blank" rel="noopener noreferrer">
                  {openLabel} ↗
                </a>
              </div>
            </div>
            <div data-part="map">
              <iframe src={embed} title={venue} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
          <h3 hidden>{waysTitle}</h3>
          <ul data-part="ways" aria-label={waysTitle}>
            {ways.map((way) => (
              <li key={way.mode} data-part="way">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={ICONS[way.icon ?? ""] ?? ICONS.car} />
                </svg>
                <div>
                  <h3>{way.mode}</h3>
                  <p>{way.text}</p>
                </div>
              </li>
            ))}
          </ul>
          {stays.length > 0 ? (
            <div data-part="stays">
              <h3>{staysTitle}</h3>
              {staysNote ? <p>{staysNote}</p> : null}
              <ul>
                {stays.map((stay) => (
                  <li key={stay.name} data-part="stay">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3 18V8M3 12h18v6M3 16h18M7 12V9.5A1.5 1.5 0 0 1 8.5 8h3A1.5 1.5 0 0 1 13 9.5V12" />
                    </svg>
                    {stay.href ? (
                      <a href={stay.href}>{stay.name}</a>
                    ) : (
                      <b>{stay.name}</b>
                    )}
                    <span>{stay.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
