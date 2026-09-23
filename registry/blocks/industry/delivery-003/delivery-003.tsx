"use client"

import { useState, type CSSProperties, type MouseEvent } from "react"
import type { ComponentProps } from "react"

export type Delivery003Zone = {
  id: string
  name: string
  minutes: number
  fee: number
  /** С какой суммы доставка бесплатна в этой зоне. */
  freeFrom: number
  /** Внешний радиус зоны от кухни, км. */
  radius: number
}

export type Delivery003Address = {
  label: string
  /** id зоны из zones. */
  zone: string
  /** Точка на карте: [долгота, широта]. */
  point?: readonly [number, number]
}

export type Delivery003Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** От ближней к дальней. */
  zones?: readonly Delivery003Zone[]
  addresses?: readonly Delivery003Address[]
  kitchenLabel?: string
  /** Кухня — центр карты и колец: [долгота, широта]. */
  kitchen?: readonly [number, number]
  /** Масштаб Яндекс Карты (целый, 9–13). */
  zoom?: number
  /** Язык подписей карты: ru_RU, en_US. */
  mapLang?: string
  currency?: string
  /** aria списков и карты, подписи панели зоны. */
  addressesLabel?: string
  mapLabel?: string
  legendLabel?: string
  minutesUnit?: string
  yourAddressTitle?: string
  pickZoneTitle?: string
  pickHint?: string
  etaNote?: string
  etaIdle?: string
  feeLabel?: string
  freeLabel?: string
  freeFromLabel?: string
  anySumLabel?: string
  zoneLabel?: string
  hint?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Зона доставки на Яндекс Карте: виджет Яндекса (без API-ключа) затемнён
// фильтром под тёмную тему и не двигается — поверх него кольца зон от кухни,
// кухня с пульсом и метки частых адресов. Координаты переводятся в пиксели
// от центра по проекции Меркатора, поэтому кольца и метки совпадают с картой
// при любом размере. Клик по карте выбирает зону по расстоянию до кухни,
// чипы адресов сверху — по адресу. Справа ответ: минуты, стоимость, порог
// бесплатной доставки. Выбор уходит событием vibeui-cart:zone — шапка меняет
// чип адреса, корзина — стоимость.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@700;900&family=Onest:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="delivery-003"]){
--vibeui-delivery-003-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-delivery-003-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-delivery-003-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-delivery-003-on-accent:oklch(from var(--vibeui-delivery-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-delivery-003-on-fg:oklch(from var(--vibeui-delivery-003-fg) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-delivery-003-muted:color-mix(in oklab,var(--vibeui-delivery-003-fg) 62%,var(--vibeui-delivery-003-bg));
--vibeui-delivery-003-line:color-mix(in oklab,var(--vibeui-delivery-003-fg) 14%,transparent);
--vibeui-delivery-003-card:color-mix(in oklab,var(--vibeui-delivery-003-fg) 6%,var(--vibeui-delivery-003-bg));
--vibeui-delivery-003-street:color-mix(in oklab,var(--vibeui-delivery-003-fg) 3%,var(--vibeui-delivery-003-bg));
--vibeui-delivery-003-river:color-mix(in oklab,#3b82f6 35%,var(--vibeui-delivery-003-bg));
--vibeui-delivery-003-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-delivery-003-font:"Onest",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="delivery-003"]{color-scheme:dark}
:where([data-vibeui-block="delivery-003"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="delivery-003"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="delivery-003"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-delivery-003-bg);color:var(--vibeui-delivery-003-fg);font-family:var(--vibeui-delivery-003-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="delivery-003"] *{box-sizing:border-box}
[data-vibeui-block="delivery-003"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="delivery-003"] [data-part="eyebrow"]{margin:0 0 .6rem;font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-delivery-003-accent)}
[data-vibeui-block="delivery-003"] [data-part="title"]{margin:0;font-family:var(--vibeui-delivery-003-display);font-weight:900;font-size:clamp(2rem,5cqi,3.6rem);line-height:1;letter-spacing:-.03em;text-transform:uppercase}
[data-vibeui-block="delivery-003"] [data-part="lede"]{margin:.8rem 0 0;max-width:34rem;color:var(--vibeui-delivery-003-muted)}
[data-vibeui-block="delivery-003"] [data-part="addresses"]{display:flex;flex-wrap:wrap;gap:.5rem;margin:1.6rem 0 0;padding:0;list-style:none}
[data-vibeui-block="delivery-003"] [data-part="addresses"] button{display:inline-flex;align-items:center;gap:.4rem;height:2.5rem;padding:0 1rem 0 .8rem;border-radius:999px;border:1px solid var(--vibeui-delivery-003-line);background:var(--vibeui-delivery-003-card);color:var(--vibeui-delivery-003-fg);font:inherit;font-weight:600;font-size:.88rem;cursor:pointer;transition:background .2s,color .2s,transform .18s}
[data-vibeui-block="delivery-003"] [data-part="addresses"] button svg{width:.9rem;height:.9rem;color:var(--vibeui-delivery-003-accent)}
[data-vibeui-block="delivery-003"] [data-part="addresses"] button:hover{transform:translateY(-1px)}
[data-vibeui-block="delivery-003"] [data-part="addresses"] button[aria-pressed="true"]{background:var(--vibeui-delivery-003-fg);color:var(--vibeui-delivery-003-on-fg);border-color:transparent}
[data-vibeui-block="delivery-003"] [data-part="addresses"] button[aria-pressed="true"] svg{color:inherit}
[data-vibeui-block="delivery-003"] [data-part="layout"]{display:grid;gap:1.5rem;margin-top:1.6rem;align-items:stretch}
[data-vibeui-block="delivery-003"] [data-part="map"]{position:relative;aspect-ratio:1;border-radius:2rem;overflow:hidden;background:#101012;border:1px solid var(--vibeui-delivery-003-line);isolation:isolate}
[data-vibeui-block="delivery-003"] [data-part="tiles"]{position:absolute;inset:-60px;width:calc(100% + 120px);height:calc(100% + 120px);border:0;pointer-events:none;filter:invert(.9) hue-rotate(180deg) saturate(.35) brightness(.85) contrast(1.05)}
[data-vibeui-block="delivery-003"] [data-part="tint"]{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,transparent 30%,color-mix(in oklab,#000 55%,transparent));pointer-events:none}
[data-vibeui-block="delivery-003"] [data-part="overlay"]{position:absolute;inset:0;cursor:crosshair}
[data-vibeui-block="delivery-003"] [data-part="zone-ring"]{position:absolute;left:50%;top:50%;width:calc(var(--vibeui-delivery-003-r) * 2);aspect-ratio:1;border-radius:50%;translate:-50% -50%;background:color-mix(in oklab,var(--vibeui-delivery-003-accent) var(--vibeui-delivery-003-fillp),transparent);border:1.5px dashed color-mix(in oklab,var(--vibeui-delivery-003-accent) 70%,transparent);pointer-events:none;transition:background .4s,border-color .4s,box-shadow .4s}
[data-vibeui-block="delivery-003"] [data-part="zone-ring"][data-on="true"]{border-style:solid;border-color:var(--vibeui-delivery-003-accent);box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-delivery-003-accent) 25%,transparent),inset 0 0 40px color-mix(in oklab,var(--vibeui-delivery-003-accent) 35%,transparent)}
[data-vibeui-block="delivery-003"] [data-part="ring"]{position:absolute;left:50%;top:50%;width:5rem;aspect-ratio:1;border-radius:50%;border:1.5px solid var(--vibeui-delivery-003-accent);translate:-50% -50%;opacity:0;pointer-events:none;animation:vibeui-delivery-003-ring 3s ease-out infinite}
[data-vibeui-block="delivery-003"] [data-part="ring"][data-late]{animation-delay:1.5s}
[data-vibeui-block="delivery-003"] [data-part="kitchen"]{position:absolute;left:50%;top:50%;display:grid;place-items:center;width:2.4rem;height:2.4rem;border-radius:.8rem;translate:-50% -50%;background:var(--vibeui-delivery-003-accent);color:var(--vibeui-delivery-003-on-accent);box-shadow:0 10px 30px -8px var(--vibeui-delivery-003-accent);pointer-events:none}
[data-vibeui-block="delivery-003"] [data-part="kitchen"] [data-part="glyph"]{width:1.2rem;height:1.2rem}
[data-vibeui-block="delivery-003"] [data-part="kitchen-label"]{position:absolute;left:50%;top:calc(50% + 1.6rem);translate:-50% 0;padding:.15rem .5rem;border-radius:999px;background:color-mix(in oklab,#000 65%,transparent);color:#fff;font-size:.7rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;pointer-events:none}
[data-vibeui-block="delivery-003"] [data-part="spot"]{position:absolute;left:calc(50% + var(--vibeui-delivery-003-x));top:calc(50% + var(--vibeui-delivery-003-y));display:flex;align-items:center;gap:.35rem;translate:-.45rem -50%;padding:0;border:0;background:none;color:#fff;font:inherit;font-size:.72rem;font-weight:600;white-space:nowrap;cursor:pointer}
[data-vibeui-block="delivery-003"] [data-part="dot"]{flex:none;width:.9rem;height:.9rem;border-radius:50%;background:#fff;border:3px solid #18181a;box-shadow:0 0 0 1px rgb(255 255 255 / .5);transition:scale .3s cubic-bezier(.3,1.6,.5,1),background .3s}
[data-vibeui-block="delivery-003"] [data-part="spot-label"]{padding:.12rem .45rem;border-radius:.4rem;background:color-mix(in oklab,#000 60%,transparent);opacity:.85;transition:opacity .3s,background .3s}
[data-vibeui-block="delivery-003"] [data-part="spot"]:hover [data-part="spot-label"]{opacity:1}
[data-vibeui-block="delivery-003"] [data-part="spot"][data-on="true"] [data-part="dot"]{scale:1.35;background:var(--vibeui-delivery-003-accent)}
[data-vibeui-block="delivery-003"] [data-part="spot"][data-on="true"] [data-part="spot-label"]{opacity:1;background:var(--vibeui-delivery-003-accent);color:var(--vibeui-delivery-003-on-accent)}
[data-vibeui-block="delivery-003"] [data-part="pick"]{position:absolute;left:calc(50% + var(--vibeui-delivery-003-x));top:calc(50% + var(--vibeui-delivery-003-y));width:1.6rem;height:1.6rem;translate:-50% -100%;color:var(--vibeui-delivery-003-accent);pointer-events:none;filter:drop-shadow(0 4px 6px rgb(0 0 0 / .5));animation:vibeui-delivery-003-drop .45s cubic-bezier(.3,1.6,.5,1)}
[data-vibeui-block="delivery-003"] [data-part="legend"]{position:absolute;z-index:2;left:1rem;bottom:1rem;display:flex;flex-wrap:wrap;gap:.4rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="delivery-003"] button:focus-visible{outline:2px solid var(--vibeui-delivery-003-accent);outline-offset:2px}
[data-vibeui-block="delivery-003"] [data-part="result"]{display:grid;align-content:start;gap:1rem;padding:1.6rem;border-radius:2rem;background:var(--vibeui-delivery-003-card);border:1px solid var(--vibeui-delivery-003-line)}
[data-vibeui-block="delivery-003"] [data-part="result"] h3{margin:0;font-size:.8rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-delivery-003-muted)}
[data-vibeui-block="delivery-003"] [data-part="where"]{margin:0;font-family:var(--vibeui-delivery-003-display);font-weight:700;font-size:1.05rem;line-height:1.25}
[data-vibeui-block="delivery-003"] [data-part="big"]{margin:0;font-family:var(--vibeui-delivery-003-display);font-weight:900;font-size:clamp(3rem,9cqi,5rem);line-height:.95;letter-spacing:-.04em;color:var(--vibeui-delivery-003-accent);font-variant-numeric:tabular-nums;animation:vibeui-delivery-003-pop .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="delivery-003"] [data-part="big"] small{display:block;margin-top:.2rem;font-family:var(--vibeui-delivery-003-font);font-weight:600;font-size:.9rem;letter-spacing:0;color:var(--vibeui-delivery-003-muted)}
[data-vibeui-block="delivery-003"] [data-part="facts"]{display:grid;gap:.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="delivery-003"] [data-part="facts"] li{display:flex;justify-content:space-between;gap:1rem;padding:.7rem 0;border-top:1px solid var(--vibeui-delivery-003-line);font-size:.92rem}
[data-vibeui-block="delivery-003"] [data-part="facts"] li span{color:var(--vibeui-delivery-003-muted)}
[data-vibeui-block="delivery-003"] [data-part="facts"] li b{font-weight:700;font-variant-numeric:tabular-nums;text-align:right}
[data-vibeui-block="delivery-003"] [data-part="hint"]{margin:0;font-size:.84rem;color:var(--vibeui-delivery-003-muted)}
@keyframes vibeui-delivery-003-ring{0%{scale:.4;opacity:.9}100%{scale:2.2;opacity:0}}
@keyframes vibeui-delivery-003-drop{from{translate:-50% -220%;opacity:0}}
@keyframes vibeui-delivery-003-pop{from{transform:translateY(8px);opacity:0}}
@container (min-width: 52rem){[data-vibeui-block="delivery-003"] [data-part="layout"]{grid-template-columns:minmax(0,1.5fr) minmax(16rem,1fr)}[data-vibeui-block="delivery-003"] [data-part="map"]{aspect-ratio:4/3;min-height:22rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="delivery-003"] *{animation:none!important;transition:none!important}}
[data-vibeui-block="delivery-003"] [data-part="zone"]{display:inline-flex;align-items:center;gap:.4rem;height:1.9rem;padding:0 .7rem 0 .5rem;border-radius:999px;border:0;background:color-mix(in oklab,var(--vibeui-delivery-003-bg) 85%,transparent);backdrop-filter:blur(8px);color:var(--vibeui-delivery-003-fg);font:inherit;font-size:.72rem;font-weight:600;cursor:pointer}
[data-vibeui-block="delivery-003"] [data-part="zone"]::before{content:"";width:.7rem;height:.7rem;border-radius:.2rem;background:var(--vibeui-delivery-003-accent);opacity:var(--vibeui-delivery-003-o)}
[data-vibeui-block="delivery-003"] [data-part="zone"][aria-pressed="true"]{outline:1.5px solid var(--vibeui-delivery-003-fg)}
`

const DEFAULT_ZONES: Delivery003Zone[] = [
  { id: "near", name: "Центр — до 5 км", minutes: 25, fee: 0, freeFrom: 0, radius: 5 },
  { id: "mid", name: "Внутри ТТК и рядом", minutes: 35, fee: 149, freeFrom: 1500, radius: 11.5 },
  { id: "far", name: "До МКАД", minutes: 50, fee: 249, freeFrom: 2500, radius: 18 },
]

const DEFAULT_ADDRESSES: Delivery003Address[] = [
  { label: "Тверская, 12", zone: "near", point: [37.6071, 55.7625] },
  { label: "Бауманская, 7", zone: "near", point: [37.6793, 55.7712] },
  { label: "Ленинский, 40", zone: "mid", point: [37.5856, 55.7068] },
  { label: "Сокол", zone: "mid", point: [37.515, 55.805] },
  { label: "Люблино", zone: "far", point: [37.7617, 55.6766] },
  { label: "Кунцево", zone: "far", point: [37.4461, 55.7306] },
]

const KITCHEN: [number, number] = [37.6795, 55.7722]

// Пиксели на экране от центра карты до точки на заданном масштабе (Web Mercator, тайл 256).
function toPixels(point: readonly [number, number], center: readonly [number, number], zoom: number) {
  const scale = (256 * 2 ** zoom) / 360
  const mercator = (lat: number) => (Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI
  const round = (value: number) => Math.round(value * 10) / 10
  return { x: round((point[0] - center[0]) * scale), y: round(-(mercator(point[1]) - mercator(center[1])) * scale) }
}

// Сколько километров в одном пикселе карты на широте центра.
function kmPerPixel(center: readonly [number, number], zoom: number) {
  return (40075.016 * Math.cos((center[1] * Math.PI) / 180)) / (256 * 2 ** zoom)
}

function formatMoney(value: number, currency: string) {
  return `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${currency}`
}

type ZoneProps = Omit<ComponentProps<"button">, "title" | "children"> & {
  minutes?: number
  minutesUnit?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function Zone({
  minutes = 25,
  minutesUnit = "мин",
  accent,
  className,
  style,
  ...props
}: ZoneProps) {
  const palette = {
    ...(accent ? { "--vibeui-delivery-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
      <button
        {...props} type="button"
        className={className}
        style={palette}
      >
        {minutes} {minutesUnit}
      </button>
  )
}

/** Карта зон доставки: клик по кварталу или чип адреса → время и цена. */
export function Delivery003({
  eyebrow = "Куда везём",
  title = "Тапни свой квартал",
  lede = "Кухня одна, на Бауманской. Чем ближе к ней — тем быстрее и дешевле. Дальше МКАД пока не ездим.",
  zones = DEFAULT_ZONES,
  addresses = DEFAULT_ADDRESSES,
  kitchenLabel = "кухня",
  kitchen = KITCHEN,
  zoom = 10,
  mapLang = "ru_RU",
  currency = "₽",
  addressesLabel = "Частые адреса",
  mapLabel = "Карта зон доставки вокруг кухни",
  legendLabel = "Зоны",
  minutesUnit = "мин",
  yourAddressTitle = "Ваш адрес",
  pickZoneTitle = "Выберите зону",
  pickHint = "Нажмите на карту или адрес выше",
  etaNote = "от оплаты до двери",
  etaIdle = "время доставки",
  feeLabel = "Доставка",
  freeLabel = "бесплатно",
  freeFromLabel = "Бесплатно от",
  anySumLabel = "любой суммы",
  zoneLabel = "Зона",
  hint = "Время — среднее за последние 30 дней в этой зоне. В снег и в пятницу вечером плюс 5–10 минут, честно.",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Delivery003Props) {
  const [zoneIndex, setZoneIndex] = useState<number | null>(null)
  const [addressLabel, setAddressLabel] = useState<string | null>(null)
  const [picked, setPicked] = useState<{ x: number; y: number } | null>(null)

  const perPixel = kmPerPixel(kitchen, zoom)

  const choose = (index: number, label: string | null) => {
    const zone = zones[index]
    if (!zone) return
    setZoneIndex(index)
    setAddressLabel(label)
    if (label) setPicked(null)
    window.dispatchEvent(new CustomEvent("vibeui-cart:zone", { detail: { label: label ?? zone.name, minutes: zone.minutes, fee: zone.fee, freeFrom: zone.freeFrom } }))
  }

  const palette = {
    ...(accent ? { "--vibeui-delivery-003-accent": accent } : null),
    ...(ink ? { "--vibeui-delivery-003-fg": ink } : null),
    ...(background ? { "--vibeui-delivery-003-bg": background } : null),
    ...style,
  } as CSSProperties

  // Клик по карте: зона по расстоянию от кухни; дальше последней — не возим.
  const pick = (event: MouseEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - box.left - box.width / 2
    const y = event.clientY - box.top - box.height / 2
    const distance = Math.hypot(x, y) * perPixel
    const index = zones.findIndex((item) => distance <= item.radius)
    if (index < 0) return
    setPicked({ x, y })
    choose(index, null)
  }

  const zone = zoneIndex === null ? null : zones[zoneIndex]
  const opacities = [0.85, 0.45, 0.18]
  const fills = ["26%", "14%", "7%"]
  const tiles = `https://yandex.ru/map-widget/v1/?ll=${kitchen[0]}%2C${kitchen[1]}&z=${zoom}&lang=${mapLang}`

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-delivery-003" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="delivery-003" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          {addresses.length > 0 ? (
            <ul data-part="addresses" aria-label={addressesLabel}>
              {addresses.map((address) => {
                const index = zones.findIndex((item) => item.id === address.zone)
                return (
                  <li key={address.label}>
                    <button type="button" aria-pressed={addressLabel === address.label} onClick={() => choose(index, address.label)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>
                      {address.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : null}
          <div data-part="layout">
            <div data-part="map">
              <iframe data-part="tiles" src={tiles} title={mapLabel} loading="lazy" tabIndex={-1} aria-hidden="true" />
              <i data-part="tint" />
              <div data-part="overlay" role="img" aria-label={mapLabel} onClick={pick}>
                {[...zones].reverse().map((item) => {
                  const index = zones.indexOf(item)
                  return (
                    <i
                      key={item.id}
                      data-part="zone-ring"
                      data-on={zoneIndex === index ? "true" : undefined}
                      style={{ ["--vibeui-delivery-003-r" as string]: `${Math.round(item.radius / perPixel)}px`, ["--vibeui-delivery-003-fillp" as string]: fills[index] ?? "6%" } as CSSProperties}
                    />
                  )
                })}
                <i data-part="ring" />
                <i data-part="ring" data-late="" />
                <span data-part="kitchen">
                  <svg data-part="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3c1 3 4 4.5 4 8.5a4 4 0 0 1-8 0c0-1.6.7-2.7 1.5-3.5.2 1.5 1 2.2 1.8 2.2C11 8.5 11 5.5 12 3Z" />
                  </svg>
                </span>
                <span data-part="kitchen-label">{kitchenLabel}</span>
                {addresses.map((address) => {
                  if (!address.point) return null
                  const offset = toPixels(address.point, kitchen, zoom)
                  const index = zones.findIndex((item) => item.id === address.zone)
                  return (
                    <button
                      key={address.label}
                      data-part="spot"
                      type="button"
                      data-on={addressLabel === address.label ? "true" : undefined}
                      style={{ ["--vibeui-delivery-003-x" as string]: `${offset.x}px`, ["--vibeui-delivery-003-y" as string]: `${offset.y}px` } as CSSProperties}
                      onClick={(event) => {
                        event.stopPropagation()
                        choose(index, address.label)
                      }}
                    >
                      <i data-part="dot" aria-hidden="true" />
                      <span data-part="spot-label">{address.label}</span>
                    </button>
                  )
                })}
                {picked ? (
                  <svg key={`${picked.x}-${picked.y}`} data-part="pick" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ ["--vibeui-delivery-003-x" as string]: `${picked.x}px`, ["--vibeui-delivery-003-y" as string]: `${picked.y}px` } as CSSProperties}>
                    <path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Zm0-9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
                  </svg>
                ) : null}
              </div>
              <ul data-part="legend" aria-label={legendLabel}>
                {zones.map((item, index) => (
                  <li key={item.id}>
                    <Zone data-part="zone" minutes={item.minutes} minutesUnit={minutesUnit} aria-pressed={zoneIndex === index} style={{ ["--vibeui-delivery-003-o" as string]: opacities[index] ?? 0.2 } as CSSProperties} onClick={() => choose(index, null)} accent={accent} />
                  </li>
                ))}
              </ul>
            </div>
            <div data-part="result" aria-live="polite">
              <h3>{zone ? yourAddressTitle : pickZoneTitle}</h3>
              <p data-part="where">{addressLabel ?? zone?.name ?? pickHint}</p>
              <p data-part="big" key={zone?.id ?? "none"}>
                {zone ? `${zone.minutes} ${minutesUnit}` : "—"}
                <small>{zone ? etaNote : etaIdle}</small>
              </p>
              <ul data-part="facts">
                <li>
                  <span>{feeLabel}</span>
                  <b>{zone ? (zone.fee === 0 ? freeLabel : formatMoney(zone.fee, currency)) : "—"}</b>
                </li>
                <li>
                  <span>{freeFromLabel}</span>
                  <b>{zone ? (zone.freeFrom === 0 ? anySumLabel : formatMoney(zone.freeFrom, currency)) : "—"}</b>
                </li>
                <li>
                  <span>{zoneLabel}</span>
                  <b>{zone ? zone.name : "—"}</b>
                </li>
              </ul>
              <p data-part="hint">{hint}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
