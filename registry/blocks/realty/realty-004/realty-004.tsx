"use client"

import { useState, type CSSProperties } from "react"

export type Realty004District = {
  name: string
  /** Цена за м², строкой: «285 тыс ₽». */
  price: string
  /** Сколько объектов сейчас. */
  count: string
  note?: string
  image?: string
  /** Точка на карте в координатах 0…100 по обеим осям. */
  x: number
  y: number
}

export type Realty004Props = {
  eyebrow?: string
  title?: string
  lede?: string
  districts?: readonly Realty004District[]
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Районы: стилизованная карта города — не тайлы, а контурный SVG-план с
// водой и кварталами, — и точки районов, которые пульсируют. Наведение на
// карточку района подсвечивает его точку и наоборот; карта переносима,
// внешних сервисов и ключей не требует.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap"

// Условный план города с рекой и островами: достаточно узнаваемо для
// петербургской темы, но не карта конкретного масштаба.
const WATER =
  "M0 44 C 14 40, 22 48, 34 46 C 46 44, 50 34, 62 36 C 74 38, 80 46, 100 40 L100 52 C 84 58, 76 50, 64 52 C 52 54, 48 62, 36 60 C 24 58, 16 66, 0 60 Z"
const RIVER = "M58 0 C 56 12, 62 22, 60 36 M 60 52 C 62 66, 54 80, 58 100"
const ROADS = [
  "M0 20 L100 24",
  "M0 76 L100 72",
  "M20 0 L26 100",
  "M78 0 L74 100",
  "M0 30 C 30 26, 60 30, 100 28",
  "M42 0 L44 100",
]

const STYLES = `
:where([data-vibeui-block="realty-004"]){
--vibeui-realty-004-bg:light-dark(#f3ede3,#14211b);
--vibeui-realty-004-fg:light-dark(#173b2e,#eef0ea);
--vibeui-realty-004-muted:light-dark(color-mix(in oklab,#173b2e 62%,#f3ede3),color-mix(in oklab,#eef0ea 62%,#14211b));
--vibeui-realty-004-card:light-dark(#fffdf9,#1b2c24);
--vibeui-realty-004-line:light-dark(color-mix(in oklab,#173b2e 14%,#f3ede3),color-mix(in oklab,#eef0ea 14%,#14211b));
--vibeui-realty-004-water:light-dark(#d8e2e0,#1f3a3a);
--vibeui-realty-004-land:light-dark(#ebe4d7,#1a2b24);
--vibeui-realty-004-accent:#b8925a;
--vibeui-realty-004-on-accent:#14211b;
--vibeui-realty-004-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-realty-004-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="realty-004"]{color-scheme:dark}
:where([data-vibeui-block="realty-004"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="realty-004"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="realty-004"]{box-sizing:border-box;display:block;background:var(--vibeui-realty-004-bg);color:var(--vibeui-realty-004-fg);font-family:var(--vibeui-realty-004-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="realty-004"] *{box-sizing:border-box}
[data-vibeui-block="realty-004"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem;display:grid;gap:2rem}
[data-vibeui-block="realty-004"] [data-part="eyebrow"]{margin:0 0 .5rem;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-realty-004-accent);font-weight:600}
[data-vibeui-block="realty-004"] [data-part="title"]{margin:0;font-family:var(--vibeui-realty-004-display);font-weight:500;font-size:clamp(2rem,4.5cqi,3.25rem);line-height:1.05}
[data-vibeui-block="realty-004"] [data-part="lede"]{margin:.75rem 0 0;max-width:36rem;color:var(--vibeui-realty-004-muted)}
[data-vibeui-block="realty-004"] [data-part="map"]{position:relative;aspect-ratio:4/3;border-radius:1rem;overflow:hidden;background:var(--vibeui-realty-004-land);border:1px solid var(--vibeui-realty-004-line)}
[data-vibeui-block="realty-004"] [data-part="map"] svg{position:absolute;inset:0;width:100%;height:100%}
[data-vibeui-block="realty-004"] [data-part="water"]{fill:var(--vibeui-realty-004-water)}
[data-vibeui-block="realty-004"] [data-part="river"]{fill:none;stroke:var(--vibeui-realty-004-water);stroke-width:3;stroke-linecap:round}
[data-vibeui-block="realty-004"] [data-part="road"]{fill:none;stroke:var(--vibeui-realty-004-line);stroke-width:.5}
[data-vibeui-block="realty-004"] [data-part="pin"]{position:absolute;transform:translate(-50%,-50%);display:grid;place-items:center;width:2.75rem;height:2.75rem;padding:0;border:0;background:none;cursor:pointer}
[data-vibeui-block="realty-004"] [data-part="pin"] i{position:absolute;inset:0;border-radius:50%;background:var(--vibeui-realty-004-accent);opacity:.25;animation:vibeui-realty-004-pulse 2.4s ease-out infinite;animation-delay:calc(var(--vibeui-realty-004-n) * .4s)}
[data-vibeui-block="realty-004"] [data-part="pin"] b{position:relative;width:.85rem;height:.85rem;border-radius:50%;background:var(--vibeui-realty-004-accent);border:2px solid var(--vibeui-realty-004-card);box-shadow:0 2px 6px rgb(0 0 0 / .3);transition:transform .25s}
[data-vibeui-block="realty-004"] [data-part="pin"][data-active] b,[data-vibeui-block="realty-004"] [data-part="pin"]:hover b{transform:scale(1.5)}
[data-vibeui-block="realty-004"] [data-part="pin"]:focus-visible{outline:2px solid var(--vibeui-realty-004-accent);outline-offset:2px;border-radius:50%}
@keyframes vibeui-realty-004-pulse{0%{transform:scale(.3);opacity:.45}100%{transform:scale(1.4);opacity:0}}
[data-vibeui-block="realty-004"] [data-part="tag"]{position:absolute;left:50%;top:100%;transform:translate(-50%,.15rem);padding:.25rem .55rem;border-radius:.4rem;background:var(--vibeui-realty-004-card);color:var(--vibeui-realty-004-fg);font-size:.72rem;font-weight:600;white-space:nowrap;box-shadow:0 4px 12px rgb(0 0 0 / .15);opacity:0;transition:opacity .2s;pointer-events:none}
[data-vibeui-block="realty-004"] [data-part="pin"][data-active] [data-part="tag"],[data-vibeui-block="realty-004"] [data-part="pin"]:hover [data-part="tag"]{opacity:1}
[data-vibeui-block="realty-004"] [data-part="list"]{display:grid;gap:.75rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="realty-004"] [data-part="district"]{display:grid;grid-template-columns:4.5rem minmax(0,1fr) auto;gap:1rem;align-items:center;padding:.75rem;border-radius:.9rem;border:1px solid var(--vibeui-realty-004-line);background:var(--vibeui-realty-004-card);cursor:pointer;transition:border-color .2s,transform .25s}
[data-vibeui-block="realty-004"] [data-part="district"][data-active],[data-vibeui-block="realty-004"] [data-part="district"]:hover{border-color:var(--vibeui-realty-004-accent);transform:translateX(4px)}
[data-vibeui-block="realty-004"] [data-part="thumb"]{width:4.5rem;height:3.25rem;border-radius:.5rem;object-fit:cover;background:var(--vibeui-realty-004-water)}
[data-vibeui-block="realty-004"] [data-part="district"] b{display:block;font-weight:600}
[data-vibeui-block="realty-004"] [data-part="district"] small{display:block;color:var(--vibeui-realty-004-muted);font-size:.8rem}
[data-vibeui-block="realty-004"] [data-part="rate"]{text-align:right}
[data-vibeui-block="realty-004"] [data-part="rate"] b{font-family:var(--vibeui-realty-004-display);font-size:1.35rem;font-weight:600;line-height:1}
[data-vibeui-block="realty-004"] [data-part="rate"] small{display:block;color:var(--vibeui-realty-004-muted);font-size:.72rem}
@container (min-width: 56rem){
[data-vibeui-block="realty-004"] [data-part="shell"]{grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);grid-template-areas:"head head" "map list";gap:2.5rem 3rem;padding:5.5rem 2rem}
[data-vibeui-block="realty-004"] [data-part="head"]{grid-area:head}
[data-vibeui-block="realty-004"] [data-part="map"]{grid-area:map;aspect-ratio:auto;min-height:26rem}
[data-vibeui-block="realty-004"] [data-part="list"]{grid-area:list;align-content:start}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="realty-004"] *{animation:none!important;transition:none!important}}`

const DEFAULT_DISTRICTS: Realty004District[] = [
  { name: "Петроградская", price: "285 тыс ₽", count: "164 объекта", note: "модерн, тихие дворы, 10 минут до центра", x: 36, y: 30 },
  { name: "Центральный", price: "310 тыс ₽", count: "402 объекта", note: "парадные, лепнина, лучшие школы", x: 60, y: 62 },
  { name: "Васильевский", price: "240 тыс ₽", count: "128 объектов", note: "набережные, линии, тихо вечером", x: 22, y: 52 },
  { name: "Приморский", price: "205 тыс ₽", count: "356 объектов", note: "новостройки у залива, парки", x: 18, y: 14 },
]

/** Районы на стилизованной карте: пульсирующие точки, цена за метр и карточки с фото. */
export function Realty004({
  eyebrow = "Районы",
  title = "Где вы будете жить",
  lede = "Средняя цена за метр и живые объекты по районам. Наведите на район — точка подсветится на карте.",
  districts = DEFAULT_DISTRICTS,
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Realty004Props) {
  const [active, setActive] = useState<number | null>(null)
  const palette = {
    ...(accent ? { "--vibeui-realty-004-accent": accent } : null),
    ...(background ? { "--vibeui-realty-004-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-realty-004" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="realty-004" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="map">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path data-part="water" d={WATER} />
              <path data-part="river" d={RIVER} />
              {ROADS.map((d) => (
                <path key={d} data-part="road" d={d} />
              ))}
            </svg>
            {districts.map((district, index) => (
              <button
                key={district.name}
                type="button"
                data-part="pin"
                data-active={active === index ? "" : undefined}
                style={{ left: `${district.x}%`, top: `${district.y}%`, ["--vibeui-realty-004-n" as string]: index }}
                aria-label={`${district.name}: ${district.price} за м²`}
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(index)}
                onBlur={() => setActive(null)}
              >
                <i aria-hidden="true" />
                <b aria-hidden="true" />
                <span data-part="tag">
                  {district.name} · {district.price}
                </span>
              </button>
            ))}
          </div>
          <ul data-part="list">
            {districts.map((district, index) => (
              <li
                key={district.name}
                data-part="district"
                data-active={active === index ? "" : undefined}
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(null)}
              >
                {district.image ? <img data-part="thumb" src={district.image} alt="" loading="lazy" /> : <span data-part="thumb" aria-hidden="true" />}
                <span>
                  <b>{district.name}</b>
                  <small>{district.note ?? district.count}</small>
                </span>
                <span data-part="rate">
                  <b>{district.price}</b>
                  <small>за м² · {district.count}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
