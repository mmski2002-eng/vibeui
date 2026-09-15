"use client"

import { useId, useState, type CSSProperties } from "react"

export type Pricing022Zone = {
  key: string
  label: string
  /** Множитель к базовой цене: сложная зона дороже. */
  factor: number
}

export type Pricing022Package = {
  name: string
  text?: string
  price: string
  /** «до 5 см», «1 сеанс». */
  hint?: string
  features: readonly string[]
  featured?: boolean
  color?: string
  actionLabel?: string
  actionHref?: string
}

export type Pricing022Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Калькулятор: цена за квадратный сантиметр и минимум. */
  ratePerCm?: number
  minPrice?: number
  minSize?: number
  maxSize?: number
  defaultSize?: number
  zones?: readonly Pricing022Zone[]
  packages?: readonly Pricing022Package[]
  currency?: string
  note?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Стоимость: калькулятор по размеру (неоновый ползунок в сантиметрах) и
// зоне тела (капсулы с множителем) — итог перелистывается при каждом
// изменении, рядом «примерно N часов». Ниже три пакета карточками с
// неоновой рамкой, выделенный — с бегущей conic-рамкой. Состояние: размер
// и зона.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"

const STYLES = `
@property --vibeui-pricing-022-a{syntax:"<angle>";inherits:false;initial-value:0deg}
:where([data-vibeui-block="pricing-022"]){
--vibeui-pricing-022-bg:#07060b;
--vibeui-pricing-022-fg:#f3eefc;
--vibeui-pricing-022-muted:#a39bb5;
--vibeui-pricing-022-line:rgb(255 255 255 / .12);
--vibeui-pricing-022-card:#110e1a;
--vibeui-pricing-022-accent:#ff2bd6;
--vibeui-pricing-022-accent-2:#8b5cff;
--vibeui-pricing-022-cyan:#22f3ff;
--vibeui-pricing-022-on-accent:#15121c;
--vibeui-pricing-022-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-pricing-022-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-pricing-022-mono:"JetBrains Mono",ui-monospace,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-022"]{color-scheme:dark}
:where([data-vibeui-block="pricing-022"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="pricing-022"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="pricing-022"]{box-sizing:border-box;display:block;background:var(--vibeui-pricing-022-bg);color:var(--vibeui-pricing-022-fg);font-family:var(--vibeui-pricing-022-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="pricing-022"] *{box-sizing:border-box}
[data-vibeui-block="pricing-022"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="pricing-022"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 .75rem;font-family:var(--vibeui-pricing-022-mono);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-pricing-022-cyan);text-shadow:0 0 10px color-mix(in oklab,var(--vibeui-pricing-022-cyan) 70%,transparent)}
[data-vibeui-block="pricing-022"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-pricing-022-cyan);box-shadow:0 0 8px var(--vibeui-pricing-022-cyan)}
[data-vibeui-block="pricing-022"] [data-part="title"]{margin:0;font-family:var(--vibeui-pricing-022-display);font-size:clamp(1.8rem,3.8cqi,2.8rem);font-weight:700;line-height:1.05;letter-spacing:-.02em;text-transform:uppercase}
[data-vibeui-block="pricing-022"] [data-part="lede"]{margin:.75rem 0 2rem;max-width:36rem;color:var(--vibeui-pricing-022-muted)}
[data-vibeui-block="pricing-022"] [data-part="calc"]{display:grid;gap:1.5rem;padding:1.5rem;border-radius:1.1rem;border:1px solid color-mix(in oklab,var(--vibeui-pricing-022-cyan) 40%,transparent);background:linear-gradient(135deg,color-mix(in oklab,var(--vibeui-pricing-022-cyan) 8%,var(--vibeui-pricing-022-card)),var(--vibeui-pricing-022-card));box-shadow:0 0 30px color-mix(in oklab,var(--vibeui-pricing-022-cyan) 12%,transparent)}
[data-vibeui-block="pricing-022"] [data-part="field"]{display:grid;gap:.6rem}
[data-vibeui-block="pricing-022"] [data-part="field"]>label,[data-vibeui-block="pricing-022"] [data-part="legend"]{display:flex;justify-content:space-between;gap:1rem;font-family:var(--vibeui-pricing-022-mono);font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-pricing-022-muted)}
[data-vibeui-block="pricing-022"] [data-part="field"] output{color:var(--vibeui-pricing-022-cyan);text-shadow:0 0 8px color-mix(in oklab,var(--vibeui-pricing-022-cyan) 60%,transparent)}
[data-vibeui-block="pricing-022"] input[type="range"]{-webkit-appearance:none;appearance:none;width:100%;height:1.5rem;margin:0;background:transparent;cursor:pointer}
[data-vibeui-block="pricing-022"] input[type="range"]::-webkit-slider-runnable-track{height:4px;border-radius:4px;background:linear-gradient(90deg,var(--vibeui-pricing-022-cyan) var(--vibeui-pricing-022-fill,0%),var(--vibeui-pricing-022-line) var(--vibeui-pricing-022-fill,0%));box-shadow:0 0 8px color-mix(in oklab,var(--vibeui-pricing-022-cyan) 40%,transparent)}
[data-vibeui-block="pricing-022"] input[type="range"]::-moz-range-track{height:4px;border-radius:4px;background:var(--vibeui-pricing-022-line)}
[data-vibeui-block="pricing-022"] input[type="range"]::-moz-range-progress{height:4px;border-radius:4px;background:var(--vibeui-pricing-022-cyan)}
[data-vibeui-block="pricing-022"] input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:1.4rem;height:1.4rem;margin-top:-.55rem;border-radius:50%;border:2px solid var(--vibeui-pricing-022-cyan);background:var(--vibeui-pricing-022-bg);box-shadow:0 0 12px var(--vibeui-pricing-022-cyan),0 0 30px color-mix(in oklab,var(--vibeui-pricing-022-cyan) 50%,transparent);transition:transform .2s}
[data-vibeui-block="pricing-022"] input[type="range"]::-moz-range-thumb{width:1.4rem;height:1.4rem;border-radius:50%;border:2px solid var(--vibeui-pricing-022-cyan);background:var(--vibeui-pricing-022-bg);box-shadow:0 0 12px var(--vibeui-pricing-022-cyan)}
[data-vibeui-block="pricing-022"] input[type="range"]:hover::-webkit-slider-thumb{transform:scale(1.15)}
[data-vibeui-block="pricing-022"] input[type="range"]:focus-visible{outline:2px solid var(--vibeui-pricing-022-cyan);outline-offset:6px;border-radius:4px}
[data-vibeui-block="pricing-022"] [data-part="zones"]{display:flex;flex-wrap:wrap;gap:.45rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="pricing-022"] [data-part="zone"]{height:2.3rem;padding:0 .9rem;border-radius:.5rem;border:1px solid var(--vibeui-pricing-022-line);background:transparent;color:var(--vibeui-pricing-022-muted);font:inherit;font-size:.88rem;font-weight:600;cursor:pointer;transition:color .25s,border-color .25s,box-shadow .3s,background .25s}
[data-vibeui-block="pricing-022"] [data-part="zone"][aria-pressed="true"]{color:var(--vibeui-pricing-022-fg);border-color:var(--vibeui-pricing-022-accent);background:color-mix(in oklab,var(--vibeui-pricing-022-accent) 14%,transparent);box-shadow:0 0 14px color-mix(in oklab,var(--vibeui-pricing-022-accent) 45%,transparent)}
[data-vibeui-block="pricing-022"] [data-part="zone"]:focus-visible,[data-vibeui-block="pricing-022"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-pricing-022-cyan);outline-offset:3px}
[data-vibeui-block="pricing-022"] [data-part="total"]{display:grid;gap:.25rem;padding-top:1.25rem;border-top:1px solid var(--vibeui-pricing-022-line)}
[data-vibeui-block="pricing-022"] [data-part="total"] small{font-family:var(--vibeui-pricing-022-mono);font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-pricing-022-muted)}
[data-vibeui-block="pricing-022"] [data-part="sum"]{position:relative;display:block;height:3.2rem;overflow:hidden;font-family:var(--vibeui-pricing-022-mono);font-size:2.6rem;font-weight:700;line-height:3.2rem;letter-spacing:-.04em;color:var(--vibeui-pricing-022-accent);text-shadow:0 0 14px color-mix(in oklab,var(--vibeui-pricing-022-accent) 70%,transparent);font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-022"] [data-part="sum"] span{display:block;animation:vibeui-pricing-022-flip .35s cubic-bezier(.2,.8,.2,1)}
@keyframes vibeui-pricing-022-flip{from{transform:translateY(100%);opacity:0}to{transform:none;opacity:1}}
[data-vibeui-block="pricing-022"] [data-part="hours"]{font-size:.9rem;color:var(--vibeui-pricing-022-muted)}
[data-vibeui-block="pricing-022"] [data-part="packages"]{display:grid;gap:1rem;margin:2rem 0 0;padding:0;list-style:none}
[data-vibeui-block="pricing-022"] [data-part="pack"]{position:relative;isolation:isolate;display:flex;flex-direction:column;gap:1rem;padding:1.5rem;border-radius:1.1rem;background:var(--vibeui-pricing-022-card);border:1px solid color-mix(in oklab,var(--vibeui-pricing-022-neon) 45%,transparent);box-shadow:0 0 18px color-mix(in oklab,var(--vibeui-pricing-022-neon) 18%,transparent);transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s}
[data-vibeui-block="pricing-022"] [data-part="pack"]:hover{transform:translateY(-4px);box-shadow:0 0 34px color-mix(in oklab,var(--vibeui-pricing-022-neon) 40%,transparent)}
[data-vibeui-block="pricing-022"] [data-part="pack"][data-featured="true"]::before{content:"";position:absolute;inset:-2px;padding:2px;border-radius:calc(1.1rem + 2px);pointer-events:none;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude;background:conic-gradient(from var(--vibeui-pricing-022-a),var(--vibeui-pricing-022-accent),var(--vibeui-pricing-022-cyan),transparent 45%,var(--vibeui-pricing-022-accent-2),var(--vibeui-pricing-022-accent));animation:vibeui-pricing-022-spin 5s linear infinite}
@keyframes vibeui-pricing-022-spin{to{--vibeui-pricing-022-a:360deg}}
[data-vibeui-block="pricing-022"] [data-part="pack-name"]{margin:0;font-family:var(--vibeui-pricing-022-display);font-size:1.15rem;font-weight:600;color:var(--vibeui-pricing-022-neon);text-shadow:0 0 12px color-mix(in oklab,var(--vibeui-pricing-022-neon) 60%,transparent)}
[data-vibeui-block="pricing-022"] [data-part="pack-text"]{margin:.3rem 0 0;font-size:.9rem;color:var(--vibeui-pricing-022-muted)}
[data-vibeui-block="pricing-022"] [data-part="price"]{font-family:var(--vibeui-pricing-022-mono);font-size:1.9rem;font-weight:700;letter-spacing:-.03em;line-height:1}
[data-vibeui-block="pricing-022"] [data-part="hint"]{margin-left:.5rem;font-size:.8rem;font-weight:500;color:var(--vibeui-pricing-022-muted);letter-spacing:0}
[data-vibeui-block="pricing-022"] [data-part="features"]{margin:0;padding:0;list-style:none;display:grid;gap:.5rem;font-size:.92rem}
[data-vibeui-block="pricing-022"] [data-part="features"] li{display:flex;gap:.6rem;align-items:flex-start}
[data-vibeui-block="pricing-022"] [data-part="features"] li::before{content:"";flex:none;width:.5rem;height:.5rem;margin-top:.5rem;border-radius:50%;background:var(--vibeui-pricing-022-neon);box-shadow:0 0 8px var(--vibeui-pricing-022-neon)}
[data-vibeui-block="pricing-022"] [data-part="action"]{display:inline-flex;align-items:center;justify-content:center;height:3rem;margin-top:auto;border-radius:.6rem;border:1px solid color-mix(in oklab,var(--vibeui-pricing-022-neon) 60%,transparent);color:inherit;font-weight:700;text-decoration:none;transition:background .25s,box-shadow .3s,transform .2s}
[data-vibeui-block="pricing-022"] [data-part="pack"][data-featured="true"] [data-part="action"]{background:var(--vibeui-pricing-022-accent);border-color:transparent;color:var(--vibeui-pricing-022-on-accent);box-shadow:0 0 18px color-mix(in oklab,var(--vibeui-pricing-022-accent) 55%,transparent)}
[data-vibeui-block="pricing-022"] [data-part="action"]:hover{transform:translateY(-2px);box-shadow:0 0 22px color-mix(in oklab,var(--vibeui-pricing-022-neon) 50%,transparent)}
[data-vibeui-block="pricing-022"] [data-part="note"]{margin:1.5rem 0 0;font-size:.85rem;color:var(--vibeui-pricing-022-muted)}
@container (min-width: 60rem){
[data-vibeui-block="pricing-022"] [data-part="shell"]{padding:5.5rem 2rem}
[data-vibeui-block="pricing-022"] [data-part="calc"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr) 16rem;align-items:end;gap:2rem;padding:2rem}
[data-vibeui-block="pricing-022"] [data-part="total"]{padding:0 0 0 2rem;border-top:0;border-left:1px solid var(--vibeui-pricing-022-line)}
[data-vibeui-block="pricing-022"] [data-part="packages"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-022"] *{animation:none!important;transition:none!important}}`

const DEFAULT_ZONES: Pricing022Zone[] = [
  { key: "arm", label: "Рука", factor: 1 },
  { key: "leg", label: "Нога", factor: 1 },
  { key: "back", label: "Спина", factor: 1.1 },
  { key: "chest", label: "Грудь", factor: 1.25 },
  { key: "ribs", label: "Рёбра", factor: 1.4 },
  { key: "neck", label: "Шея и кисти", factor: 1.5 },
]

const DEFAULT_PACKAGES: Pricing022Package[] = [
  { name: "Мини", text: "Маленькая работа за одну консультацию.", price: "от 5 000", hint: "до 5 см", features: ["Эскиз на месте", "40 минут", "Уход в подарок"], color: "#22f3ff", actionLabel: "Записаться", actionHref: "#booking" },
  { name: "Сеанс", text: "Работа среднего размера за один визит.", price: "от 15 000", hint: "до 4 часов", features: ["Индивидуальный эскиз", "Правки до «да»", "Бесплатная коррекция через месяц"], featured: true, color: "#ff2bd6", actionLabel: "Записаться", actionHref: "#booking" },
  { name: "Рукав", text: "Большой проект в несколько сеансов.", price: "от 60 000", hint: "3–6 сеансов", features: ["Концепт всей руки сразу", "Фиксированная цена за проект", "Рассрочка по сеансам"], color: "#8b5cff", actionLabel: "Обсудить проект", actionHref: "#booking" },
]

/** Стоимость тату: калькулятор по размеру и зоне с перелистыванием итога и три пакета с неоновыми рамками. */
export function Pricing022({
  eyebrow = "Стоимость",
  title = "Сколько это стоит",
  lede = "Цена зависит от размера, места и детализации. Калькулятор считает примерно, точную скажет мастер после эскиза.",
  ratePerCm = 180,
  minPrice = 5000,
  minSize = 3,
  maxSize = 40,
  defaultSize = 12,
  zones = DEFAULT_ZONES,
  packages = DEFAULT_PACKAGES,
  currency = "₽",
  note = "Консультация и эскиз бесплатно. Предоплата 20 % при бронировании даты, возвращается при отмене за 48 часов.",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Pricing022Props) {
  const [size, setSize] = useState(defaultSize)
  const [zone, setZone] = useState(zones[0]?.key ?? "")
  const id = useId()
  const format = new Intl.NumberFormat("ru-RU")
  const palette = {
    ...(accent ? { "--vibeui-pricing-022-accent": accent } : null),
    ...(background ? { "--vibeui-pricing-022-bg": background } : null),
    ...style,
  } as CSSProperties
  const factor = zones.find((item) => item.key === zone)?.factor ?? 1
  const total = Math.max(minPrice, Math.round((size * size * ratePerCm * factor) / 500) * 500)
  const hours = Math.max(1, Math.round((size * size) / 60))
  const fill = ((size - minSize) / (maxSize - minSize)) * 100

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-pricing-022" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="pricing-022" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="calc">
            <div data-part="field">
              <label htmlFor={`${id}-size`}>
                <span>Размер</span>
                <output htmlFor={`${id}-size`}>{size} см</output>
              </label>
              <input id={`${id}-size`} type="range" min={minSize} max={maxSize} step={1} value={size} onChange={(event) => setSize(Number(event.target.value))} style={{ ["--vibeui-pricing-022-fill" as string]: `${fill}%` }} />
            </div>
            <div data-part="field" role="group" aria-labelledby={`${id}-zone`}>
              <p id={`${id}-zone`} data-part="legend">
                <span>Зона</span>
                <span>×{factor}</span>
              </p>
              <ul data-part="zones">
                {zones.map((item) => (
                  <li key={item.key}>
                    <button type="button" data-part="zone" aria-pressed={zone === item.key} onClick={() => setZone(item.key)}>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div data-part="total" aria-live="polite">
              <small>Примерно</small>
              <span data-part="sum">
                <span key={total}>
                  {format.format(total)} {currency}
                </span>
              </span>
              <span data-part="hours">≈ {hours} ч работы</span>
            </div>
          </div>
          <ul data-part="packages">
            {packages.map((pack) => (
              <li key={pack.name} data-part="pack" data-featured={pack.featured ? "true" : undefined} style={{ ["--vibeui-pricing-022-neon" as string]: pack.color ?? "#ff2bd6" }}>
                <div>
                  <h3 data-part="pack-name">{pack.name}</h3>
                  {pack.text ? <p data-part="pack-text">{pack.text}</p> : null}
                </div>
                <p data-part="price">
                  {pack.price} {currency}
                  {pack.hint ? <span data-part="hint">{pack.hint}</span> : null}
                </p>
                <ul data-part="features">
                  {pack.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                {pack.actionLabel ? (
                  <a data-part="action" href={pack.actionHref ?? "#"}>
                    {pack.actionLabel}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
          {note ? <p data-part="note">{note}</p> : null}
        </div>
      </section>
    </>
  )
}
