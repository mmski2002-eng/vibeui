"use client"

import { useState, type CSSProperties } from "react"

export type Bakery002Drink = {
  name: string
  text?: string
  price: string
  /** Доли слоёв в процентах высоты стакана: кофе снизу, молоко, пена сверху. */
  coffee: number
  milk: number
  foam: number
  volume?: string
  /** Американо: кофе разбавлен водой — слой светлее. */
  water?: boolean
}

export type Bakery002Props = {
  eyebrow?: string
  title?: string
  lede?: string
  softLabel?: string
  strongLabel?: string
  drinks?: readonly Bakery002Drink[]
  /** Индекс напитка по умолчанию. */
  initial?: number
  beanImage?: string
  beanTitle?: string
  beanText?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Шкала крепости кофе: ползунок «мягче — крепче» переключает напитки, а
// нарисованный стакан наполняется слоями — кофе, молоко, пена — с плавным
// переходом высот; стакан у эспрессо ниже, у латте выше. Пар над чашкой —
// три размытых пятна на CSS-анимации. Справа карточка: название, состав в
// процентах, объём, цена и зерно недели.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700&family=Golos+Text:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="bakery-002"]){
--vibeui-bakery-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-bakery-002-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bakery-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bakery-002-muted:color-mix(in oklab,var(--vibeui-bakery-002-fg) 60%,var(--vibeui-bakery-002-bg));
--vibeui-bakery-002-panel:color-mix(in oklab,var(--vibeui-bakery-002-fg) 5%,var(--vibeui-bakery-002-bg));
--vibeui-bakery-002-line:color-mix(in oklab,var(--vibeui-bakery-002-fg) 12%,transparent);
--vibeui-bakery-002-card:light-dark(#fff,color-mix(in oklab,var(--vibeui-bakery-002-bg) 88%,var(--vibeui-bakery-002-fg)));
--vibeui-bakery-002-cup:#ffffff;
--vibeui-bakery-002-coffee:#3b2216;
--vibeui-bakery-002-milk:#e6d3bd;
--vibeui-bakery-002-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-bakery-002-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="bakery-002"]{color-scheme:dark}
:where([data-vibeui-block="bakery-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="bakery-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="bakery-002"]{box-sizing:border-box;padding:5.5rem 0;background:var(--vibeui-bakery-002-bg);color:var(--vibeui-bakery-002-fg);font-family:var(--vibeui-bakery-002-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="bakery-002"] *{box-sizing:border-box}
[data-vibeui-block="bakery-002"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="bakery-002"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.5rem;font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--vibeui-bakery-002-accent);font-weight:600;margin:0 0 1.1rem}
[data-vibeui-block="bakery-002"] [data-part="eyebrow"]::before{content:"";width:1.4rem;height:2px;background:var(--vibeui-bakery-002-accent);border-radius:2px}
[data-vibeui-block="bakery-002"] [data-part="title"]{margin:0;font-family:var(--vibeui-bakery-002-display);font-weight:600;letter-spacing:-.02em;line-height:1.02;font-size:clamp(2rem,4.6cqi,3.6rem)}
[data-vibeui-block="bakery-002"] [data-part="lede"]{font-size:1.06rem;color:var(--vibeui-bakery-002-muted);max-width:34rem;margin:1rem 0 0}
[data-vibeui-block="bakery-002"] [data-part="grid"]{display:grid;gap:3rem;align-items:center;margin-top:2.5rem}
[data-vibeui-block="bakery-002"] [data-part="cupwrap"]{position:relative;display:grid;place-items:center;padding:3rem 0 1rem}
[data-vibeui-block="bakery-002"] [data-part="cupbody"]{position:relative;width:14rem;margin:0 auto}
[data-vibeui-block="bakery-002"] [data-part="steam"]{position:absolute;left:50%;bottom:100%;width:9rem;height:7rem;transform:translateX(-50%);pointer-events:none}
[data-vibeui-block="bakery-002"] [data-part="steam"] i{position:absolute;bottom:0;width:2.4rem;height:6rem;border-radius:50%;background:radial-gradient(closest-side,color-mix(in oklab,var(--vibeui-bakery-002-fg) 18%,transparent),transparent);filter:blur(6px);opacity:0;animation:vibeui-bakery-002-steam 3.2s ease-in-out infinite}
[data-vibeui-block="bakery-002"] [data-part="steam"] i:nth-child(1){left:1rem}
[data-vibeui-block="bakery-002"] [data-part="steam"] i:nth-child(2){left:3.4rem;animation-delay:1s}
[data-vibeui-block="bakery-002"] [data-part="steam"] i:nth-child(3){left:5.6rem;animation-delay:2s}
[data-vibeui-block="bakery-002"] [data-part="cup"]{position:relative;width:14rem;height:17rem;border-radius:.6rem .6rem 3.2rem 3.2rem;background:linear-gradient(180deg,var(--vibeui-bakery-002-cup),color-mix(in oklab,var(--vibeui-bakery-002-cup) 92%,#8b6a4a));box-shadow:0 1px 0 rgb(255 255 255) inset,0 30px 50px -30px rgb(0 0 0 / .5),0 0 0 1.5px rgb(0 0 0 / .16);overflow:hidden;transition:height .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="bakery-002"] [data-part="cup"]::before{content:"";position:absolute;left:0;right:0;top:0;height:.5rem;background:rgb(0 0 0 / .06);z-index:1}
[data-vibeui-block="bakery-002"] [data-part="cup"]::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgb(255 255 255 / .55),transparent 40%,transparent 70%,rgb(0 0 0 / .08));pointer-events:none}
[data-vibeui-block="bakery-002"] [data-part="layer"]{position:absolute;left:0;right:0;transition:height .6s cubic-bezier(.2,.8,.2,1),bottom .6s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="bakery-002"] [data-part="layer"][data-layer="coffee"]{bottom:0;background:linear-gradient(180deg,color-mix(in oklab,var(--vibeui-bakery-002-coffee) 75%,#a86a3a),var(--vibeui-bakery-002-coffee))}
[data-vibeui-block="bakery-002"] [data-part="layer"][data-layer="coffee"][data-water="true"]{background:linear-gradient(180deg,#7a4a2c,#4a2c1b)}
[data-vibeui-block="bakery-002"] [data-part="layer"][data-layer="milk"]{background:linear-gradient(180deg,color-mix(in oklab,var(--vibeui-bakery-002-milk) 60%,white),var(--vibeui-bakery-002-milk))}
[data-vibeui-block="bakery-002"] [data-part="layer"][data-layer="foam"]{background:radial-gradient(120% 80% at 50% 0,#fff,#efe4d2);border-radius:0 0 40% 40% / 0 0 30% 30%}
[data-vibeui-block="bakery-002"] [data-part="handle"]{position:absolute;left:100%;top:3rem;width:3.8rem;height:6.4rem;border:.95rem solid var(--vibeui-bakery-002-cup);border-left:0;border-radius:0 2.6rem 2.6rem 0;box-shadow:0 0 0 1.5px rgb(0 0 0 / .16),0 0 0 1.5px rgb(0 0 0 / .16) inset;margin-left:-.2rem}
[data-vibeui-block="bakery-002"] [data-part="saucer"]{width:20rem;height:1.2rem;border-radius:50%;background:linear-gradient(180deg,var(--vibeui-bakery-002-cup),color-mix(in oklab,var(--vibeui-bakery-002-cup) 90%,#8b6a4a));box-shadow:0 10px 20px -10px rgb(0 0 0 / .5);margin:-.2rem auto 0}
[data-vibeui-block="bakery-002"] [data-part="control"]{padding:1.6rem 1.75rem;border-radius:1.4rem;background:var(--vibeui-bakery-002-card);box-shadow:0 1px 0 rgb(255 255 255 / .5) inset,0 24px 48px -32px rgb(0 0 0 / .35),0 1px 2px rgb(0 0 0 / .06)}
[data-vibeui-block="bakery-002"] [data-part="scale"]{display:flex;justify-content:space-between;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-bakery-002-muted);font-weight:600;margin-bottom:.6rem}
[data-vibeui-block="bakery-002"] input[type=range]{width:100%;appearance:none;height:1.1rem;border-radius:999px;background:linear-gradient(90deg,#efe6d6,#c99b6b 50%,var(--vibeui-bakery-002-coffee));outline:0;box-shadow:0 2px 6px rgb(0 0 0 / .18) inset;cursor:pointer;margin:0}
[data-vibeui-block="bakery-002"] input[type=range]::-webkit-slider-thumb{appearance:none;width:2rem;height:2rem;border-radius:50%;background:#fff;border:4px solid var(--vibeui-bakery-002-accent);box-shadow:0 6px 14px -6px rgb(0 0 0 / .6);transition:transform .15s}
[data-vibeui-block="bakery-002"] input[type=range]:active::-webkit-slider-thumb{transform:scale(.92)}
[data-vibeui-block="bakery-002"] input[type=range]::-moz-range-thumb{width:2rem;height:2rem;border-radius:50%;background:#fff;border:4px solid var(--vibeui-bakery-002-accent)}
[data-vibeui-block="bakery-002"] input[type=range]:focus-visible{outline:2px solid var(--vibeui-bakery-002-accent);outline-offset:4px}
[data-vibeui-block="bakery-002"] [data-part="drink"]{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;margin-top:1.5rem}
[data-vibeui-block="bakery-002"] [data-part="drink"] h3{margin:0;font-family:var(--vibeui-bakery-002-display);font-size:1.6rem;font-weight:600;letter-spacing:-.02em;line-height:1.05}
[data-vibeui-block="bakery-002"] [data-part="drink"] b{font-family:var(--vibeui-bakery-002-display);font-weight:600;font-size:1.1rem;white-space:nowrap}
[data-vibeui-block="bakery-002"] [data-part="drink"] p{margin:.3rem 0 0;color:var(--vibeui-bakery-002-muted)}
[data-vibeui-block="bakery-002"] [data-part="parts"]{display:flex;gap:.5rem;flex-wrap:wrap;margin:1rem 0 0;list-style:none;padding:0}
[data-vibeui-block="bakery-002"] [data-part="parts"] li{display:inline-flex;align-items:center;gap:.4rem;font-size:.82rem;padding:.35rem .7rem;border-radius:999px;background:var(--vibeui-bakery-002-panel)}
[data-vibeui-block="bakery-002"] [data-part="parts"] i{width:.7rem;height:.7rem;border-radius:50%}
[data-vibeui-block="bakery-002"] [data-part="bean"]{display:grid;grid-template-columns:5rem 1fr;gap:1rem;align-items:center;margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--vibeui-bakery-002-line)}
[data-vibeui-block="bakery-002"] [data-part="bean"] img{width:5rem;height:5rem;object-fit:cover;border-radius:1rem;display:block}
[data-vibeui-block="bakery-002"] [data-part="bean"] h4{margin:0;font-family:var(--vibeui-bakery-002-display);font-weight:600;font-size:.95rem}
[data-vibeui-block="bakery-002"] [data-part="bean"] p{margin:.2rem 0 0;color:var(--vibeui-bakery-002-muted);font-size:.86rem}
@keyframes vibeui-bakery-002-steam{0%{transform:translateY(0) scaleX(1);opacity:0}30%{opacity:.8}100%{transform:translateY(-5rem) scaleX(1.6);opacity:0}}
@container (min-width: 56rem){[data-vibeui-block="bakery-002"] [data-part="grid"]{grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:4rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="bakery-002"] *{animation:none!important;transition:none!important}}`

const DEFAULT_DRINKS: Bakery002Drink[] = [
  { name: "Латте", text: "много молока, кофе — намёком", price: "290 ₽", milk: 62, foam: 10, coffee: 20, volume: "350 мл" },
  { name: "Флэт уайт", text: "двойной шот, шёлковое молоко", price: "270 ₽", milk: 48, foam: 6, coffee: 36, volume: "220 мл" },
  { name: "Капучино", text: "треть пены, классика", price: "250 ₽", milk: 34, foam: 28, coffee: 30, volume: "200 мл" },
  { name: "Американо", text: "эспрессо и горячая вода", price: "190 ₽", milk: 0, foam: 0, coffee: 70, volume: "250 мл", water: true },
  { name: "Эспрессо", text: "двойной, 18 г в 36 г", price: "160 ₽", milk: 0, foam: 0, coffee: 30, volume: "60 мл" },
]

/** Шкала крепости: ползунок переключает напитки, стакан наполняется слоями. */
export function Bakery002({
  eyebrow = "Кофе",
  title = "Насколько крепко?",
  lede = "Двигайте ползунок — стакан покажет, что внутри. Молоко фермерское, зерно обжариваем сами раз в неделю.",
  softLabel = "мягче",
  strongLabel = "крепче",
  drinks = DEFAULT_DRINKS,
  initial = 1,
  beanImage = "",
  beanTitle = "Зерно недели: Эфиопия, Гуджи",
  beanText = "Мытая обработка, светлая обжарка. Чёрная смородина, жасмин, долгое сладкое послевкусие.",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Bakery002Props) {
  const [index, setIndex] = useState(Math.min(initial, drinks.length - 1))
  const drink = drinks[index]
  const last = drinks.length - 1
  const height = 10 + (last - index) * 1.75

  const palette = {
    ...(accent ? { "--vibeui-bakery-002-accent": accent } : null),
    ...(ink ? { "--vibeui-bakery-002-fg": ink } : null),
    ...(background ? { "--vibeui-bakery-002-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-bakery-002" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="bakery-002" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="grid">
            <div data-part="cupwrap" aria-hidden="true">
              <div>
                <div data-part="cupbody">
                  <div data-part="steam">
                    <i />
                    <i />
                    <i />
                  </div>
                  <div data-part="cup" style={{ height: `${height}rem` }}>
                    <div data-part="layer" data-layer="coffee" data-water={drink.water ?? false} style={{ height: `${drink.coffee}%` }} />
                    <div data-part="layer" data-layer="milk" style={{ bottom: `${drink.coffee}%`, height: `${drink.milk}%` }} />
                    <div data-part="layer" data-layer="foam" style={{ bottom: `${drink.coffee + drink.milk}%`, height: `${drink.foam}%` }} />
                  </div>
                  <div data-part="handle" />
                </div>
                <div data-part="saucer" />
              </div>
            </div>
            <div data-part="control">
              <div data-part="scale" aria-hidden="true">
                <span>{softLabel}</span>
                <span>{strongLabel}</span>
              </div>
              <input
                type="range"
                min={0}
                max={last}
                step={1}
                value={index}
                onChange={(event) => setIndex(Number(event.target.value))}
                aria-label="Крепость напитка"
                aria-valuetext={drink.name}
              />
              <div data-part="drink" aria-live="polite">
                <div>
                  <h3>{drink.name}</h3>
                  {drink.text ? <p>{drink.text}</p> : null}
                </div>
                <b>{drink.price}</b>
              </div>
              <ul data-part="parts">
                <li>
                  <i style={{ background: "var(--vibeui-bakery-002-coffee)" }} aria-hidden="true" />
                  эспрессо {drink.coffee}%
                </li>
                {drink.milk > 0 ? (
                  <li>
                    <i style={{ background: "var(--vibeui-bakery-002-milk)" }} aria-hidden="true" />
                    молоко {drink.milk}%
                  </li>
                ) : null}
                {drink.foam > 0 ? (
                  <li>
                    <i style={{ background: "#fff", boxShadow: "0 0 0 1px var(--vibeui-bakery-002-line)" }} aria-hidden="true" />
                    пена {drink.foam}%
                  </li>
                ) : null}
                {drink.volume ? <li>{drink.volume}</li> : null}
              </ul>
              {beanTitle ? (
                <div data-part="bean">
                  {beanImage ? <img src={beanImage} alt="" /> : <span />}
                  <div>
                    <h4>{beanTitle}</h4>
                    {beanText ? <p>{beanText}</p> : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
