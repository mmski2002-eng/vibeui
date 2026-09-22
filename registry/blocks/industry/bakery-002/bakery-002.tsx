"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"
import { Word001 } from "@/registry/components/typography/word-001/word-001"

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
  /** Фото напитка; если есть хотя бы у одного — вместо рисованного стакана показываются фото с кроссфейдом. */
  image?: string
  imageAlt?: string
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
  /** Подписи состава стакана и aria ползунка. */
  espressoLabel?: string
  milkLabel?: string
  foamLabel?: string
  strengthLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Шкала крепости кофе: ползунок «мягче — крепче» переключает напитки, а
// фото стакана меняется кроссфейдом с лёгким «глотком» (пружинный scale
// и наклон), стакан чуть наклоняется в сторону выбора. Если у напитков нет
// фото — рисованный стакан наполняется слоями кофе, молоко, пена с плавным
// переходом высот. Пар над чашкой — четыре размытых пятна на CSS-анимации,
// за чашкой тёплое пятно света. Справа карточка с бликом под курсором:
// название, состав в процентах, объём, цена и зерно недели. Заголовок
// поднимается из-под маски, стакан и карточка въезжают в кадре.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Golos+Text:wght@400;500;600&display=swap"

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
--vibeui-bakery-002-display:"Playfair Display",ui-serif,Georgia,serif;
--vibeui-bakery-002-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-bakery-002-ease:cubic-bezier(.2,.8,.2,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="bakery-002"]{color-scheme:dark}
:where([data-vibeui-block="bakery-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="bakery-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="bakery-002"]{box-sizing:border-box;position:relative;overflow:clip;padding:5.5rem 0;background:var(--vibeui-bakery-002-bg);color:var(--vibeui-bakery-002-fg);font-family:var(--vibeui-bakery-002-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="bakery-002"] *{box-sizing:border-box}
[data-vibeui-block="bakery-002"] [data-part="word"]{margin:-.04em 0 -.14em}
[data-vibeui-block="bakery-002"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="bakery-002"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.5rem;font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--vibeui-bakery-002-accent);font-weight:600;margin:0 0 1.1rem}
[data-vibeui-block="bakery-002"] [data-part="eyebrow"]::before{content:"";width:1.4rem;height:2px;background:var(--vibeui-bakery-002-accent);border-radius:2px}
[data-vibeui-block="bakery-002"] [data-part="title"]{margin:0;font-family:var(--vibeui-bakery-002-display);font-weight:600;letter-spacing:-.025em;line-height:1.02;font-size:clamp(2.2rem,5cqi,4rem)}
[data-vibeui-block="bakery-002"][data-shown="true"] [data-vibeui-block="word-001"] i{animation:vibeui-bakery-002-rise .9s var(--vibeui-bakery-002-ease) both;animation-delay:calc(var(--vibeui-bakery-002-n) * .09s)}
[data-vibeui-block="bakery-002"] [data-part="lede"]{font-size:1.06rem;color:var(--vibeui-bakery-002-muted);max-width:34rem;margin:1rem 0 0}
[data-vibeui-block="bakery-002"] [data-part="lede"],[data-vibeui-block="bakery-002"] [data-part="cupwrap"],[data-vibeui-block="bakery-002"] [data-part="control"]{opacity:0;translate:0 1.5rem}
[data-vibeui-block="bakery-002"][data-shown="true"] [data-part="lede"]{animation:vibeui-bakery-002-in .8s var(--vibeui-bakery-002-ease) .3s both}
[data-vibeui-block="bakery-002"][data-shown="true"] [data-part="cupwrap"]{animation:vibeui-bakery-002-in 1s var(--vibeui-bakery-002-ease) .35s both}
[data-vibeui-block="bakery-002"][data-shown="true"] [data-part="control"]{animation:vibeui-bakery-002-in 1s var(--vibeui-bakery-002-ease) .5s both}
[data-vibeui-block="bakery-002"] [data-part="grid"]{display:grid;gap:3rem;align-items:center;margin-top:2.5rem}
[data-vibeui-block="bakery-002"] [data-part="cupwrap"]{position:relative;display:grid;place-items:center;padding:3rem 0 1rem}
[data-vibeui-block="bakery-002"] [data-part="cupwrap"]::before{content:"";position:absolute;left:50%;top:55%;width:30rem;height:30rem;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(closest-side,color-mix(in oklab,var(--vibeui-bakery-002-accent) 22%,#ffb36b),color-mix(in oklab,var(--vibeui-bakery-002-accent) 8%,transparent) 50%,transparent 72%);filter:blur(30px);opacity:.5;pointer-events:none}
[data-vibeui-block="bakery-002"] [data-part="cupbody"]{position:relative;width:14rem;margin:0 auto;transform:rotate(calc(var(--vibeui-bakery-002-k,0) * 3deg));transform-origin:50% 100%;transition:transform .7s cubic-bezier(.3,1.3,.4,1)}
[data-vibeui-block="bakery-002"] [data-part="steam"]{position:absolute;left:50%;bottom:100%;width:9rem;height:7rem;transform:translateX(-50%);pointer-events:none}
[data-vibeui-block="bakery-002"] [data-part="steam"] i{position:absolute;bottom:0;width:2.4rem;height:6rem;border-radius:50%;background:radial-gradient(closest-side,color-mix(in oklab,var(--vibeui-bakery-002-fg) 18%,transparent),transparent);filter:blur(6px);opacity:0;animation:vibeui-bakery-002-steam 3.2s ease-in-out infinite}
[data-vibeui-block="bakery-002"] [data-part="steam"] i:nth-child(1){left:1rem}
[data-vibeui-block="bakery-002"] [data-part="steam"] i:nth-child(2){left:3.4rem;animation-delay:1s}
[data-vibeui-block="bakery-002"] [data-part="steam"] i:nth-child(3){left:5.6rem;animation-delay:2s}
[data-vibeui-block="bakery-002"] [data-part="steam"] i:nth-child(4){left:2.4rem;width:3.2rem;animation-delay:.5s;animation-duration:4s}
[data-vibeui-block="bakery-002"] [data-part="cup"]{position:relative;width:14rem;height:17rem;border-radius:.6rem .6rem 3.2rem 3.2rem;background:linear-gradient(180deg,var(--vibeui-bakery-002-cup),color-mix(in oklab,var(--vibeui-bakery-002-cup) 92%,#8b6a4a));box-shadow:0 1px 0 rgb(255 255 255) inset,0 30px 50px -30px rgb(0 0 0 / .5),0 0 0 1.5px rgb(0 0 0 / .16);overflow:hidden;transition:height .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="bakery-002"] [data-part="cup"]::before{content:"";position:absolute;left:0;right:0;top:0;height:.5rem;background:rgb(0 0 0 / .06);z-index:1}
[data-vibeui-block="bakery-002"] [data-part="cup"]::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgb(255 255 255 / .55),transparent 40%,transparent 70%,rgb(0 0 0 / .08));pointer-events:none}
[data-vibeui-block="bakery-002"] [data-part="layer"]{position:absolute;left:0;right:0;transition:height .6s cubic-bezier(.2,.8,.2,1),bottom .6s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="bakery-002"] [data-part="layer"]::before{content:"";position:absolute;left:-10%;right:-10%;top:-.35rem;height:.7rem;border-radius:50%;background:inherit;opacity:.9;transform:scaleY(0);transition:transform .3s}
[data-vibeui-block="bakery-002"] [data-part="cup"][data-slosh="true"] [data-part="layer"]::before{animation:vibeui-bakery-002-slosh .8s ease-out}
[data-vibeui-block="bakery-002"] [data-part="layer"][data-layer="coffee"]{bottom:0;background:linear-gradient(180deg,color-mix(in oklab,var(--vibeui-bakery-002-coffee) 75%,#a86a3a),var(--vibeui-bakery-002-coffee))}
[data-vibeui-block="bakery-002"] [data-part="layer"][data-layer="coffee"][data-water="true"]{background:linear-gradient(180deg,#7a4a2c,#4a2c1b)}
[data-vibeui-block="bakery-002"] [data-part="layer"][data-layer="milk"]{background:linear-gradient(180deg,color-mix(in oklab,var(--vibeui-bakery-002-milk) 60%,white),var(--vibeui-bakery-002-milk))}
[data-vibeui-block="bakery-002"] [data-part="layer"][data-layer="foam"]{background:radial-gradient(120% 80% at 50% 0,#fff,#efe4d2);border-radius:0 0 40% 40% / 0 0 30% 30%}
[data-vibeui-block="bakery-002"] [data-part="handle"]{position:absolute;left:100%;top:3rem;width:3.8rem;height:6.4rem;border:.95rem solid var(--vibeui-bakery-002-cup);border-left:0;border-radius:0 2.6rem 2.6rem 0;box-shadow:0 0 0 1.5px rgb(0 0 0 / .16),0 0 0 1.5px rgb(0 0 0 / .16) inset;margin-left:-.2rem}
[data-vibeui-block="bakery-002"] [data-part="saucer"]{width:20rem;height:1.2rem;border-radius:50%;background:linear-gradient(180deg,var(--vibeui-bakery-002-cup),color-mix(in oklab,var(--vibeui-bakery-002-cup) 90%,#8b6a4a));box-shadow:0 10px 20px -10px rgb(0 0 0 / .5);margin:-.2rem auto 0}
[data-vibeui-block="bakery-002"] [data-part="control"]{padding:1.6rem 1.75rem;border-radius:1.4rem;background:radial-gradient(18rem circle at var(--vibeui-bakery-002-x,50%) var(--vibeui-bakery-002-y,0%),color-mix(in oklab,var(--vibeui-bakery-002-accent) 10%,transparent),transparent 65%),var(--vibeui-bakery-002-card);box-shadow:0 1px 0 rgb(255 255 255 / .5) inset,0 24px 48px -32px rgb(0 0 0 / .35),0 1px 2px rgb(0 0 0 / .06)}
[data-vibeui-block="bakery-002"] [data-part="scale"]{display:flex;justify-content:space-between;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-bakery-002-muted);font-weight:600;margin-bottom:.6rem}
[data-vibeui-block="bakery-002"] input[type=range]{width:100%;appearance:none;height:1.1rem;border-radius:999px;background:linear-gradient(90deg,#efe6d6,#c99b6b 50%,var(--vibeui-bakery-002-coffee));outline:0;box-shadow:0 2px 6px rgb(0 0 0 / .18) inset;cursor:pointer;margin:0}
[data-vibeui-block="bakery-002"] input[type=range]::-webkit-slider-thumb{appearance:none;width:2rem;height:2rem;border-radius:50%;background:#fff;border:4px solid var(--vibeui-bakery-002-accent);box-shadow:0 6px 14px -6px rgb(0 0 0 / .6);transition:transform .15s}
[data-vibeui-block="bakery-002"] input[type=range]:active::-webkit-slider-thumb{transform:scale(.92)}
[data-vibeui-block="bakery-002"] input[type=range]::-moz-range-thumb{width:2rem;height:2rem;border-radius:50%;background:#fff;border:4px solid var(--vibeui-bakery-002-accent)}
[data-vibeui-block="bakery-002"] input[type=range]:focus-visible{outline:2px solid var(--vibeui-bakery-002-accent);outline-offset:4px}
[data-vibeui-block="bakery-002"] [data-part="drink"]{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;margin-top:1.5rem}
[data-vibeui-block="bakery-002"] [data-part="drink"] h3{margin:0;font-family:var(--vibeui-bakery-002-display);font-size:1.7rem;font-weight:600;letter-spacing:-.02em;line-height:1.05;overflow:clip;padding-bottom:.1em;margin-bottom:-.1em}
[data-vibeui-block="bakery-002"] [data-part="drink"] h3 span{display:block;animation:vibeui-bakery-002-word .5s var(--vibeui-bakery-002-ease) both}
[data-vibeui-block="bakery-002"] [data-part="drink"] b{display:inline-block;animation:vibeui-bakery-002-in .5s var(--vibeui-bakery-002-ease) both}
[data-vibeui-block="bakery-002"] [data-part="drink"] b{font-family:var(--vibeui-bakery-002-display);font-weight:600;font-size:1.1rem;white-space:nowrap}
[data-vibeui-block="bakery-002"] [data-part="drink"] p{margin:.3rem 0 0;color:var(--vibeui-bakery-002-muted)}
[data-vibeui-block="bakery-002"] [data-part="parts"]{display:flex;gap:.5rem;flex-wrap:wrap;margin:1rem 0 0;list-style:none;padding:0}
[data-vibeui-block="bakery-002"] [data-part="parts"] li{display:inline-flex;align-items:center;gap:.4rem;font-size:.82rem;padding:.35rem .7rem;border-radius:999px;background:var(--vibeui-bakery-002-panel);animation:vibeui-bakery-002-in .5s var(--vibeui-bakery-002-ease) both;animation-delay:calc(var(--vibeui-bakery-002-i) * .06s)}
[data-vibeui-block="bakery-002"] [data-part="parts"] i{width:.7rem;height:.7rem;border-radius:50%}
[data-vibeui-block="bakery-002"] [data-part="bean"]{display:grid;grid-template-columns:5rem 1fr;gap:1rem;align-items:center;margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--vibeui-bakery-002-line)}
[data-vibeui-block="bakery-002"] [data-part="bean"] img{width:5rem;height:5rem;object-fit:cover;border-radius:1rem;display:block}
[data-vibeui-block="bakery-002"] [data-part="bean"] h4{margin:0;font-family:var(--vibeui-bakery-002-display);font-weight:600;font-size:.95rem}
[data-vibeui-block="bakery-002"] [data-part="bean"] p{margin:.2rem 0 0;color:var(--vibeui-bakery-002-muted);font-size:.86rem}
@keyframes vibeui-bakery-002-steam{0%{transform:translateY(0) scaleX(1);opacity:0}30%{opacity:.9}100%{transform:translateY(-5.5rem) scaleX(1.7);opacity:0}}
@keyframes vibeui-bakery-002-slosh{0%{transform:scaleY(1) translateX(0)}30%{transform:scaleY(1.4) translateX(4%)}60%{transform:scaleY(.8) translateX(-3%)}100%{transform:scaleY(0) translateX(0)}}
@keyframes vibeui-bakery-002-rise{0%{transform:translateY(112%) scaleY(.8)}70%{transform:translateY(-2%)}100%{transform:none}}
@keyframes vibeui-bakery-002-word{from{transform:translateY(110%)}to{transform:none}}
@keyframes vibeui-bakery-002-in{from{opacity:0;translate:0 1rem}to{opacity:1;translate:0 0}}
@container (min-width: 56rem){[data-vibeui-block="bakery-002"] [data-part="grid"]{grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:4rem}}
[data-vibeui-block="bakery-002"] [data-part="photos"]{position:relative;width:min(100%,24rem);aspect-ratio:4/5}
[data-vibeui-block="bakery-002"] [data-part="photos"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:50% 100%;filter:drop-shadow(0 30px 30px rgb(0 0 0 / .25));opacity:0;transform:scale(.94) translateY(1rem);transition:opacity .6s var(--vibeui-bakery-002-ease),transform .7s cubic-bezier(.3,1.3,.4,1)}
[data-vibeui-block="bakery-002"] [data-part="photos"] img[data-active="true"]{opacity:1;transform:none}
[data-vibeui-block="bakery-002"] [data-part="photos"][data-slosh="true"] img[data-active="true"]{animation:vibeui-bakery-002-sip .7s cubic-bezier(.3,1.3,.4,1)}
@keyframes vibeui-bakery-002-sip{0%{transform:scale(.97) rotate(-1.5deg)}60%{transform:scale(1.02) rotate(1deg)}100%{transform:none}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="bakery-002"] *{animation:none!important;transition:none!important}[data-vibeui-block="bakery-002"] [data-part="lede"],[data-vibeui-block="bakery-002"] [data-part="cupwrap"],[data-vibeui-block="bakery-002"] [data-part="control"]{opacity:1;translate:none}[data-vibeui-block="bakery-002"] [data-part="steam"] i{opacity:.5}}`

function spotlight(event: PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty("--vibeui-bakery-002-x", `${event.clientX - rect.left}px`)
  event.currentTarget.style.setProperty("--vibeui-bakery-002-y", `${event.clientY - rect.top}px`)
}

const DEFAULT_DRINKS: Bakery002Drink[] = [
  { name: "Латте", text: "много молока, кофе — намёком", price: "290 ₽", milk: 62, foam: 10, coffee: 20, volume: "350 мл", image: "/demo/bakery/cup-latte.png", imageAlt: "Латте в стеклянном стакане" },
  { name: "Флэт уайт", text: "двойной шот, шёлковое молоко", price: "270 ₽", milk: 48, foam: 6, coffee: 36, volume: "220 мл", image: "/demo/bakery/cup-latte.png", imageAlt: "Флэт уайт" },
  { name: "Капучино", text: "треть пены, классика", price: "250 ₽", milk: 34, foam: 28, coffee: 30, volume: "200 мл", image: "/demo/bakery/cup-latte.png", imageAlt: "Капучино" },
  { name: "Американо", text: "эспрессо и горячая вода", price: "190 ₽", milk: 0, foam: 0, coffee: 70, volume: "250 мл", water: true, image: "/demo/bakery/cup-espresso.png", imageAlt: "Американо" },
  { name: "Эспрессо", text: "двойной, 18 г в 36 г", price: "160 ₽", milk: 0, foam: 0, coffee: 30, volume: "60 мл", image: "/demo/bakery/cup-espresso.png", imageAlt: "Двойной эспрессо" },
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
  espressoLabel = "эспрессо",
  milkLabel = "молоко",
  foamLabel = "пена",
  strengthLabel = "Крепость напитка",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Bakery002Props) {
  const root = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)
  const [index, setIndex] = useState(Math.min(initial, drinks.length - 1))
  const [slosh, setSlosh] = useState(false)
  const drink = drinks[index]
  const last = drinks.length - 1
  const height = 10 + (last - index) * 1.75
  const lean = last > 0 ? (index - last / 2) / (last / 2) : 0
  const photos = drinks.some((item) => item.image)

  useEffect(() => {
    const element = root.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: "-10% 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const choose = (next: number) => {
    setIndex(next)
    setSlosh(true)
    window.setTimeout(() => setSlosh(false), 800)
  }

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
      <section ref={root} data-vibeui-block="bakery-002" data-tone={tone === "auto" ? undefined : tone} data-shown={shown} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">
            {title.split(" ").map((word, position, all) => (
              <span key={`${word}-${position}`}>
                <Word001 data-part="word" word={word} style={{ ["--vibeui-bakery-002-n" as string]: position }} accent={accent} />
                {position < all.length - 1 ? " " : ""}
              </span>
            ))}
          </h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="grid">
            <div data-part="cupwrap" aria-hidden="true">
              <div>
                <div data-part="cupbody" style={{ ["--vibeui-bakery-002-k" as string]: lean.toFixed(2) }}>
                  <div data-part="steam">
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                  {photos ? (
                    <div data-part="photos" data-slosh={slosh}>
                      {drinks.map((item, position) =>
                        item.image ? <img key={item.name} src={item.image} alt={item.imageAlt ?? item.name} data-active={position === index} loading={position === initial ? "eager" : "lazy"} /> : null,
                      )}
                    </div>
                  ) : (
                    <div data-part="cup" data-slosh={slosh} style={{ height: `${height}rem` }}>
                      <div data-part="layer" data-layer="coffee" data-water={drink.water ?? false} style={{ height: `${drink.coffee}%` }} />
                      <div data-part="layer" data-layer="milk" style={{ bottom: `${drink.coffee}%`, height: `${drink.milk}%` }} />
                      <div data-part="layer" data-layer="foam" style={{ bottom: `${drink.coffee + drink.milk}%`, height: `${drink.foam}%` }} />
                    </div>
                  )}
                  {photos ? null : <div data-part="handle" />}
                </div>
                {photos ? null : <div data-part="saucer" />}
              </div>
            </div>
            <div data-part="control" onPointerMove={spotlight}>
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
                onChange={(event) => choose(Number(event.target.value))}
                aria-label={strengthLabel}
                aria-valuetext={drink.name}
              />
              <div data-part="drink" aria-live="polite">
                <div>
                  <h3>
                    <span key={index}>{drink.name}</span>
                  </h3>
                  {drink.text ? <p>{drink.text}</p> : null}
                </div>
                <b key={index}>{drink.price}</b>
              </div>
              <ul data-part="parts" key={index}>
                <li style={{ ["--vibeui-bakery-002-i" as string]: 0 }}>
                  <i style={{ background: "var(--vibeui-bakery-002-coffee)" }} aria-hidden="true" />
                  {espressoLabel} {drink.coffee}%
                </li>
                {drink.milk > 0 ? (
                  <li style={{ ["--vibeui-bakery-002-i" as string]: 1 }}>
                    <i style={{ background: "var(--vibeui-bakery-002-milk)" }} aria-hidden="true" />
                    {milkLabel} {drink.milk}%
                  </li>
                ) : null}
                {drink.foam > 0 ? (
                  <li style={{ ["--vibeui-bakery-002-i" as string]: 2 }}>
                    <i style={{ background: "#fff", boxShadow: "0 0 0 1px var(--vibeui-bakery-002-line)" }} aria-hidden="true" />
                    {foamLabel} {drink.foam}%
                  </li>
                ) : null}
                {drink.volume ? <li style={{ ["--vibeui-bakery-002-i" as string]: 3 }}>{drink.volume}</li> : null}
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
