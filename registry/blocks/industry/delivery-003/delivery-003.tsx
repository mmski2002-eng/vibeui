"use client"

import { useState, type CSSProperties } from "react"

export type Delivery003Zone = {
  id: string
  name: string
  minutes: number
  fee: number
  /** С какой суммы доставка бесплатна в этой зоне. */
  freeFrom: number
}

export type Delivery003Address = {
  label: string
  /** id зоны из zones. */
  zone: string
}

export type Delivery003Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** От ближней к дальней. */
  zones?: readonly Delivery003Zone[]
  addresses?: readonly Delivery003Address[]
  kitchenLabel?: string
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

// Зона доставки на стилизованной карте: SVG-сетка кварталов, река,
// кухня в центре с расходящимися кольцами-пульсом. Кварталы раскрашены
// по трём зонам удаления, по наведению квартал подсвечивается, клик
// выбирает зону; чипы адресов сверху делают то же самое. Справа ответ:
// минуты, стоимость, порог бесплатной доставки. Выбор уходит событием
// vibeui-cart:zone — шапка меняет чип адреса, корзина — стоимость.
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
[data-vibeui-block="delivery-003"] [data-part="map"]{position:relative;border-radius:2rem;overflow:hidden;background:var(--vibeui-delivery-003-street);border:1px solid var(--vibeui-delivery-003-line)}
[data-vibeui-block="delivery-003"] [data-part="map"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="delivery-003"] [data-part="block"]{fill:var(--vibeui-delivery-003-accent);stroke:var(--vibeui-delivery-003-bg);stroke-width:1;cursor:pointer;transition:opacity .25s,transform .25s cubic-bezier(.2,.8,.2,1);transform-box:fill-box;transform-origin:center}
[data-vibeui-block="delivery-003"] [data-part="block"][data-zone="0"]{opacity:.85}
[data-vibeui-block="delivery-003"] [data-part="block"][data-zone="1"]{opacity:.45}
[data-vibeui-block="delivery-003"] [data-part="block"][data-zone="2"]{opacity:.18}
[data-vibeui-block="delivery-003"] [data-part="block"]:hover{opacity:1;transform:scale(1.12)}
[data-vibeui-block="delivery-003"] [data-part="block"][data-on="true"]{opacity:1;stroke:var(--vibeui-delivery-003-fg);stroke-width:1.5}
[data-vibeui-block="delivery-003"] [data-part="block"]:focus-visible{outline:none;stroke:var(--vibeui-delivery-003-fg);stroke-width:2}
[data-vibeui-block="delivery-003"] [data-part="river"]{fill:none;stroke:var(--vibeui-delivery-003-river);stroke-width:26;stroke-linecap:round}
[data-vibeui-block="delivery-003"] [data-part="ring"]{fill:none;stroke:var(--vibeui-delivery-003-fg);stroke-width:1.5;opacity:0;transform-box:fill-box;transform-origin:center;animation:vibeui-delivery-003-ring 3s ease-out infinite}
[data-vibeui-block="delivery-003"] [data-part="ring"]:nth-of-type(2){animation-delay:1s}
[data-vibeui-block="delivery-003"] [data-part="ring"]:nth-of-type(3){animation-delay:2s}
[data-vibeui-block="delivery-003"] [data-part="kitchen"]{fill:var(--vibeui-delivery-003-fg)}
[data-vibeui-block="delivery-003"] [data-part="kitchen-label"]{fill:var(--vibeui-delivery-003-fg);font-family:var(--vibeui-delivery-003-font);font-weight:700;font-size:12px;letter-spacing:.04em;paint-order:stroke;stroke:var(--vibeui-delivery-003-street);stroke-width:5;stroke-linejoin:round}
[data-vibeui-block="delivery-003"] [data-part="legend"]{position:absolute;left:1rem;bottom:1rem;display:flex;flex-wrap:wrap;gap:.4rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="delivery-003"] [data-part="legend"] button{display:inline-flex;align-items:center;gap:.4rem;height:1.9rem;padding:0 .7rem 0 .5rem;border-radius:999px;border:0;background:color-mix(in oklab,var(--vibeui-delivery-003-bg) 85%,transparent);backdrop-filter:blur(8px);color:var(--vibeui-delivery-003-fg);font:inherit;font-size:.72rem;font-weight:600;cursor:pointer}
[data-vibeui-block="delivery-003"] [data-part="legend"] button::before{content:"";width:.7rem;height:.7rem;border-radius:.2rem;background:var(--vibeui-delivery-003-accent);opacity:var(--vibeui-delivery-003-o)}
[data-vibeui-block="delivery-003"] [data-part="legend"] button[aria-pressed="true"]{outline:1.5px solid var(--vibeui-delivery-003-fg)}
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
@keyframes vibeui-delivery-003-ring{0%{transform:scale(.2);opacity:.8}100%{transform:scale(1);opacity:0}}
@keyframes vibeui-delivery-003-pop{from{transform:translateY(8px);opacity:0}}
@container (min-width: 52rem){[data-vibeui-block="delivery-003"] [data-part="layout"]{grid-template-columns:minmax(0,1.5fr) minmax(16rem,1fr)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="delivery-003"] *{animation:none!important;transition:none!important}}`

const DEFAULT_ZONES: Delivery003Zone[] = [
  { id: "near", name: "Центр — до 3 км", minutes: 25, fee: 0, freeFrom: 0 },
  { id: "mid", name: "Внутри ТТК", minutes: 35, fee: 149, freeFrom: 1500 },
  { id: "far", name: "До МКАД", minutes: 50, fee: 249, freeFrom: 2500 },
]

const DEFAULT_ADDRESSES: Delivery003Address[] = [
  { label: "Тверская, 12", zone: "near" },
  { label: "Бауманская, 7", zone: "near" },
  { label: "Ленинский, 40", zone: "mid" },
  { label: "Сокол", zone: "mid" },
  { label: "Люблино", zone: "far" },
  { label: "Кунцево", zone: "far" },
]

const WIDTH = 600
const HEIGHT = 420
const CENTER = { x: 300, y: 214 }

const riverX = (y: number) => 118 + y * 0.22 + Math.sin(y / 55) * 28

type Block = { x: number; y: number; w: number; h: number; zone: number }

// Кварталы считаются один раз: сетка 13×9, часть кварталов делится
// пополам «улочкой», кварталы у реки пропускаются.
const BLOCKS: Block[] = (() => {
  const list: Block[] = []
  const cols = 13
  const rows = 9
  const w = 38
  const h = 36
  const gap = 8
  const ox = (WIDTH - (cols * (w + gap) - gap)) / 2
  const oy = (HEIGHT - (rows * (h + gap) - gap)) / 2
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x = ox + col * (w + gap)
      const y = oy + row * (h + gap)
      const cx = x + w / 2
      const cy = y + h / 2
      if (Math.abs(cx - riverX(cy)) < 24) continue
      const distance = Math.hypot(cx - CENTER.x, (cy - CENTER.y) * 1.25)
      const zone = distance < 96 ? 0 : distance < 190 ? 1 : 2
      const split = (row * 7 + col * 13) % 5 === 0
      if (split) {
        list.push({ x, y, w: w / 2 - 3, h, zone })
        list.push({ x: x + w / 2 + 3, y, w: w / 2 - 3, h, zone })
      } else {
        list.push({ x, y, w, h, zone })
      }
    }
  }
  return list
})()

const RIVER_PATH = (() => {
  const points: string[] = []
  for (let y = -20; y <= HEIGHT + 20; y += 20) points.push(`${riverX(y).toFixed(1)} ${y}`)
  return `M ${points.join(" L ")}`
})()

function formatMoney(value: number, currency: string) {
  return `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${currency}`
}

/** Карта зон доставки: клик по кварталу или чип адреса → время и цена. */
export function Delivery003({
  eyebrow = "Куда везём",
  title = "Тапни свой квартал",
  lede = "Кухня одна, на Бауманской. Чем ближе к ней — тем быстрее и дешевле. Дальше МКАД пока не ездим.",
  zones = DEFAULT_ZONES,
  addresses = DEFAULT_ADDRESSES,
  kitchenLabel = "кухня",
  currency = "₽",
  addressesLabel = "Частые адреса",
  mapLabel = "Карта зон доставки: кварталы вокруг кухни",
  legendLabel = "Зоны",
  minutesUnit = "мин",
  yourAddressTitle = "Ваш адрес",
  pickZoneTitle = "Выберите зону",
  pickHint = "Нажмите на квартал или адрес выше",
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

  const choose = (index: number, label: string | null) => {
    const zone = zones[index]
    if (!zone) return
    setZoneIndex(index)
    setAddressLabel(label)
    window.dispatchEvent(new CustomEvent("vibeui-cart:zone", { detail: { label: label ?? zone.name, minutes: zone.minutes, fee: zone.fee, freeFrom: zone.freeFrom } }))
  }

  const palette = {
    ...(accent ? { "--vibeui-delivery-003-accent": accent } : null),
    ...(ink ? { "--vibeui-delivery-003-fg": ink } : null),
    ...(background ? { "--vibeui-delivery-003-bg": background } : null),
    ...style,
  } as CSSProperties

  const zone = zoneIndex === null ? null : zones[zoneIndex]
  const opacities = [0.85, 0.45, 0.18]

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
              <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} aria-label={mapLabel}>
                <title>{mapLabel}</title>
                <path data-part="river" d={RIVER_PATH} />
                {BLOCKS.map((block, index) => (
                  <rect
                    key={index}
                    data-part="block"
                    data-zone={block.zone}
                    data-on={zoneIndex === block.zone ? "true" : undefined}
                    x={block.x}
                    y={block.y}
                    width={block.w}
                    height={block.h}
                    rx="4"
                    tabIndex={0}
                    role="button"
                    aria-label={zones[block.zone]?.name ?? ""}
                    onClick={() => choose(block.zone, null)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        choose(block.zone, null)
                      }
                    }}
                  />
                ))}
                <circle data-part="ring" cx={CENTER.x} cy={CENTER.y} r="70" />
                <circle data-part="ring" cx={CENTER.x} cy={CENTER.y} r="70" />
                <circle data-part="ring" cx={CENTER.x} cy={CENTER.y} r="70" />
                <circle data-part="kitchen" cx={CENTER.x} cy={CENTER.y} r="9" />
                <circle cx={CENTER.x} cy={CENTER.y} r="4" fill="var(--vibeui-delivery-003-accent)" />
                <text data-part="kitchen-label" x={CENTER.x} y={CENTER.y - 16} textAnchor="middle">
                  {kitchenLabel}
                </text>
              </svg>
              <ul data-part="legend" aria-label={legendLabel}>
                {zones.map((item, index) => (
                  <li key={item.id}>
                    <button type="button" aria-pressed={zoneIndex === index} style={{ ["--vibeui-delivery-003-o" as string]: opacities[index] ?? 0.2 } as CSSProperties} onClick={() => choose(index, null)}>
                      {item.minutes} {minutesUnit}
                    </button>
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
