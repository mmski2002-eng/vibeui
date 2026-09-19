"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"

export type Bakery005Line = {
  label: string
  value: string
}

export type Bakery005Props = {
  eyebrow?: string
  title?: string
  lede?: string
  cardTitle?: string
  cardText?: string
  /** Сколько штампов до бесплатного (шестой — подарок). */
  stamps?: number
  freeLabel?: string
  fine?: readonly string[]
  cardAction?: string
  cardHref?: string
  subTitle?: string
  subText?: string
  subLines?: readonly Bakery005Line[]
  subPrice?: string
  subNote?: string
  subAction?: string
  subHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Программа лояльности пекарни: перфокарта «шестой кофе — наш», на которой
// при появлении в кадре штампы «шлёпаются» один за другим (scale с
// перелётом и лёгким поворотом), последняя ячейка — рукописное «даром».
// Рядом карточка подписки на хлеб: строки условий появляются каскадом, цена
// докручивается от нуля, кнопка. Обе карточки ловят блик под курсором и
// чуть наклоняются к нему; заголовок поднимается из-под маски, за
// карточками — тёплое размытое пятно.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Golos+Text:wght@400;500;600&family=Caveat:wght@600&display=swap"

const STYLES = `
:where([data-vibeui-block="bakery-005"]){
--vibeui-bakery-005-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-bakery-005-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bakery-005-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bakery-005-on-accent:oklch(from var(--vibeui-bakery-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-bakery-005-muted:color-mix(in oklab,var(--vibeui-bakery-005-fg) 60%,var(--vibeui-bakery-005-bg));
--vibeui-bakery-005-panel:color-mix(in oklab,var(--vibeui-bakery-005-fg) 5%,var(--vibeui-bakery-005-bg));
--vibeui-bakery-005-line:color-mix(in oklab,var(--vibeui-bakery-005-fg) 12%,transparent);
--vibeui-bakery-005-card:light-dark(#fff,color-mix(in oklab,var(--vibeui-bakery-005-bg) 88%,var(--vibeui-bakery-005-fg)));
--vibeui-bakery-005-display:"Playfair Display",ui-serif,Georgia,serif;
--vibeui-bakery-005-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-bakery-005-hand:"Caveat",cursive;
--vibeui-bakery-005-ease:cubic-bezier(.2,.8,.2,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="bakery-005"]{color-scheme:dark}
:where([data-vibeui-block="bakery-005"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="bakery-005"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="bakery-005"]{box-sizing:border-box;position:relative;overflow:clip;padding:5.5rem 0;background:var(--vibeui-bakery-005-panel);color:var(--vibeui-bakery-005-fg);font-family:var(--vibeui-bakery-005-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="bakery-005"] *{box-sizing:border-box}
[data-vibeui-block="bakery-005"] [data-part="glow"]{position:absolute;right:-8rem;top:6rem;width:52rem;height:34rem;border-radius:50%;background:radial-gradient(closest-side,color-mix(in oklab,var(--vibeui-bakery-005-accent) 14%,transparent),transparent 70%);filter:blur(40px);pointer-events:none}
[data-vibeui-block="bakery-005"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="bakery-005"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.5rem;font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--vibeui-bakery-005-accent);font-weight:600;margin:0 0 1.1rem}
[data-vibeui-block="bakery-005"] [data-part="eyebrow"]::before{content:"";width:1.4rem;height:2px;background:var(--vibeui-bakery-005-accent);border-radius:2px}
[data-vibeui-block="bakery-005"] [data-part="title"]{margin:0;font-family:var(--vibeui-bakery-005-display);font-weight:600;letter-spacing:-.025em;line-height:1.02;font-size:clamp(2.2rem,5cqi,4rem)}
[data-vibeui-block="bakery-005"] [data-part="word"]{display:inline-block;overflow:clip;vertical-align:top;padding:.04em .06em .14em 0;margin:-.04em 0 -.14em}
[data-vibeui-block="bakery-005"] [data-part="word"] i{display:inline-block;font-style:normal;transform:translateY(112%)}
[data-vibeui-block="bakery-005"][data-shown="true"] [data-part="word"] i{animation:vibeui-bakery-005-rise .9s var(--vibeui-bakery-005-ease) both;animation-delay:calc(var(--vibeui-bakery-005-n) * .09s)}
[data-vibeui-block="bakery-005"] [data-part="lede"]{font-size:1.06rem;color:var(--vibeui-bakery-005-muted);max-width:34rem;margin:1rem 0 0}
[data-vibeui-block="bakery-005"] [data-part="lede"],[data-vibeui-block="bakery-005"] [data-part="card"],[data-vibeui-block="bakery-005"] [data-part="sub"] li{opacity:0;translate:0 1.5rem}
[data-vibeui-block="bakery-005"][data-shown="true"] [data-part="lede"]{animation:vibeui-bakery-005-in .8s var(--vibeui-bakery-005-ease) .3s both}
[data-vibeui-block="bakery-005"][data-shown="true"] [data-part="card"]{animation:vibeui-bakery-005-in 1s var(--vibeui-bakery-005-ease) both;animation-delay:calc(.35s + var(--vibeui-bakery-005-i) * .15s)}
[data-vibeui-block="bakery-005"][data-shown="true"] [data-part="sub"] li{animation:vibeui-bakery-005-in .7s var(--vibeui-bakery-005-ease) both;animation-delay:calc(.8s + var(--vibeui-bakery-005-i) * .1s)}
[data-vibeui-block="bakery-005"] [data-part="grid"]{display:grid;gap:2rem;margin-top:2.5rem}
[data-vibeui-block="bakery-005"] [data-part="card"]{position:relative;padding:1.75rem;display:flex;flex-direction:column;gap:1.2rem;border-radius:1.4rem;background:radial-gradient(20rem circle at var(--vibeui-bakery-005-x,50%) var(--vibeui-bakery-005-y,0%),color-mix(in oklab,var(--vibeui-bakery-005-accent) 11%,transparent),transparent 65%),var(--vibeui-bakery-005-card);box-shadow:0 1px 0 rgb(255 255 255 / .5) inset,0 24px 48px -32px rgb(0 0 0 / .35),0 1px 2px rgb(0 0 0 / .06);transform:perspective(60rem) rotateX(var(--vibeui-bakery-005-rx,0deg)) rotateY(var(--vibeui-bakery-005-ry,0deg));transition:transform .5s var(--vibeui-bakery-005-ease),box-shadow .5s}
[data-vibeui-block="bakery-005"] [data-part="card"]:hover{box-shadow:0 1px 0 rgb(255 255 255 / .5) inset,0 34px 60px -32px color-mix(in oklab,var(--vibeui-bakery-005-accent) 35%,rgb(0 0 0 / .45)),0 1px 2px rgb(0 0 0 / .06)}
[data-vibeui-block="bakery-005"] [data-part="card"] h3{margin:0;font-family:var(--vibeui-bakery-005-display);font-size:1.4rem;font-weight:600;letter-spacing:-.02em;line-height:1.1}
[data-vibeui-block="bakery-005"] [data-part="card"] p{margin:0;color:var(--vibeui-bakery-005-muted)}
[data-vibeui-block="bakery-005"] [data-part="punch"]{display:grid;grid-template-columns:repeat(var(--vibeui-bakery-005-cells),1fr);gap:.6rem;padding:1.1rem;border-radius:1rem;background:repeating-linear-gradient(0deg,var(--vibeui-bakery-005-card) 0 2px,color-mix(in oklab,var(--vibeui-bakery-005-card) 96%,var(--vibeui-bakery-005-fg)) 2px 4px);box-shadow:0 0 0 1px var(--vibeui-bakery-005-line),0 2px 4px rgb(0 0 0 / .06) inset}
[data-vibeui-block="bakery-005"] [data-part="punch"] i{position:relative;aspect-ratio:1;border-radius:50%;border:2px dashed color-mix(in oklab,var(--vibeui-bakery-005-fg) 25%,transparent);display:grid;place-items:center}
[data-vibeui-block="bakery-005"] [data-part="punch"] i::after{content:"";position:absolute;inset:.2rem;background:radial-gradient(circle at 40% 35%,color-mix(in oklab,var(--vibeui-bakery-005-accent) 75%,white),var(--vibeui-bakery-005-accent) 60%,color-mix(in oklab,var(--vibeui-bakery-005-accent) 75%,black));opacity:0;transform:scale(0) rotate(-20deg);border-radius:48% 52% 50% 50% / 50% 48% 52% 50%;box-shadow:0 0 0 2px color-mix(in oklab,var(--vibeui-bakery-005-accent) 35%,transparent) inset}
[data-vibeui-block="bakery-005"] [data-part="punch"][data-shown="true"] i::after{animation:vibeui-bakery-005-stamp .45s cubic-bezier(.2,1.5,.4,1) forwards;animation-delay:calc(var(--vibeui-bakery-005-i) * .25s)}
[data-vibeui-block="bakery-005"] [data-part="punch"] i:last-child{border-style:solid;border-color:var(--vibeui-bakery-005-accent)}
[data-vibeui-block="bakery-005"] [data-part="punch"] i:last-child::after{content:none}
[data-vibeui-block="bakery-005"] [data-part="punch"] i:last-child::before{content:attr(data-free);font-family:var(--vibeui-bakery-005-hand);font-size:1rem;color:var(--vibeui-bakery-005-accent);font-weight:600;transform:rotate(-10deg)}
[data-vibeui-block="bakery-005"] [data-part="fine"]{display:grid;gap:.4rem;font-size:.88rem;color:var(--vibeui-bakery-005-muted);margin:0;padding:0;list-style:none}
[data-vibeui-block="bakery-005"] [data-part="fine"] li{display:flex;gap:.5rem}
[data-vibeui-block="bakery-005"] [data-part="fine"] li::before{content:"·";color:var(--vibeui-bakery-005-accent);font-weight:700}
[data-vibeui-block="bakery-005"] [data-part="sub"]{display:grid;gap:.6rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="bakery-005"] [data-part="sub"] li{display:flex;justify-content:space-between;gap:1rem;padding:.8rem 1rem;border-radius:.9rem;background:var(--vibeui-bakery-005-panel);font-size:.95rem}
[data-vibeui-block="bakery-005"] [data-part="sub"] b{font-family:var(--vibeui-bakery-005-display);font-weight:600;white-space:nowrap}
[data-vibeui-block="bakery-005"] [data-part="price"]{display:flex;align-items:baseline;gap:.5rem;flex-wrap:wrap}
[data-vibeui-block="bakery-005"] [data-part="price"] b{font-family:var(--vibeui-bakery-005-display);font-size:2.4rem;font-weight:700;letter-spacing:-.04em;font-variant-numeric:tabular-nums}
[data-vibeui-block="bakery-005"] [data-part="price"] span{color:var(--vibeui-bakery-005-muted)}
[data-vibeui-block="bakery-005"] [data-part="action"]{margin-top:auto;align-self:flex-start;display:inline-flex;align-items:center;border-radius:999px;padding:.95rem 1.5rem;font-weight:600;font-size:.95rem;text-decoration:none;color:var(--vibeui-bakery-005-on-accent);background:var(--vibeui-bakery-005-accent);box-shadow:0 1px 0 rgb(255 255 255 / .35) inset,0 10px 24px -12px color-mix(in oklab,var(--vibeui-bakery-005-accent) 70%,transparent);transition:transform .18s,filter .18s}
[data-vibeui-block="bakery-005"] [data-part="action"][data-ghost="true"]{color:var(--vibeui-bakery-005-fg);background:var(--vibeui-bakery-005-panel);box-shadow:0 1px 0 rgb(255 255 255 / .6) inset,0 2px 4px rgb(0 0 0 / .08)}
[data-vibeui-block="bakery-005"] [data-part="action"]:hover{transform:translateY(-2px);filter:brightness(1.04)}
[data-vibeui-block="bakery-005"] [data-part="action"]:active{transform:translateY(1px) scale(.97)}
[data-vibeui-block="bakery-005"] a:focus-visible{outline:2px solid var(--vibeui-bakery-005-accent);outline-offset:3px}
@keyframes vibeui-bakery-005-stamp{0%{transform:scale(1.6) rotate(-20deg);opacity:0}60%{opacity:.95}100%{transform:scale(1) rotate(-12deg);opacity:.9}}
@keyframes vibeui-bakery-005-rise{0%{transform:translateY(112%) scaleY(.8)}70%{transform:translateY(-2%)}100%{transform:none}}
@keyframes vibeui-bakery-005-in{from{opacity:0;translate:0 1.5rem}to{opacity:1;translate:0 0}}
@container (min-width: 56rem){[data-vibeui-block="bakery-005"] [data-part="grid"]{grid-template-columns:1fr 1fr}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="bakery-005"] *{animation:none!important;transition:none!important}[data-vibeui-block="bakery-005"] [data-part="punch"] i::after{opacity:.9;transform:rotate(-12deg)}[data-vibeui-block="bakery-005"] [data-part="word"] i{transform:none}[data-vibeui-block="bakery-005"] [data-part="lede"],[data-vibeui-block="bakery-005"] [data-part="card"],[data-vibeui-block="bakery-005"] [data-part="sub"] li{opacity:1;translate:none}[data-vibeui-block="bakery-005"] [data-part="card"]{transform:none}}`

// Карточка чуть наклоняется к курсору и ловит блик; на тач — ничего.
function tilt(event: PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  event.currentTarget.style.setProperty("--vibeui-bakery-005-x", `${x}px`)
  event.currentTarget.style.setProperty("--vibeui-bakery-005-y", `${y}px`)
  if (event.pointerType === "touch") return
  event.currentTarget.style.setProperty("--vibeui-bakery-005-ry", `${((x / rect.width - 0.5) * 5).toFixed(2)}deg`)
  event.currentTarget.style.setProperty("--vibeui-bakery-005-rx", `${((0.5 - y / rect.height) * 5).toFixed(2)}deg`)
}

function untilt(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.removeProperty("--vibeui-bakery-005-rx")
  event.currentTarget.style.removeProperty("--vibeui-bakery-005-ry")
}

/** Перфокарта со штампами и подписка на хлеб. */
export function Bakery005({
  eyebrow = "Постоянным",
  title = "Шестой кофе — наш",
  lede = "Без приложения: карточка в кошельке, штамп у кассы. Хлеб — по подписке, чтобы не думать по субботам.",
  cardTitle = "Перфокарта",
  cardText = "Пять штампов — шестой напиток бесплатно. Любой, хоть большой латте.",
  stamps = 5,
  freeLabel = "даром",
  fine = ["штампы не сгорают — хоть через год", "карточку можно передать другу вместе с кофе", "на «кофе с собой» штамп ставим тоже"],
  cardAction = "Забрать карточку у кассы",
  cardHref = "#where",
  subTitle = "Хлеб по субботам",
  subText = "Абонемент на месяц: буханка на выбор ждёт вас каждую субботу с 8:00 до закрытия.",
  subLines = [
    { label: "Тартин или ржаной", value: "4 буханки" },
    { label: "Круассан в подарок в первую субботу", value: "+1" },
    { label: "Отложить неделю — одним сообщением", value: "да" },
  ],
  subPrice = "1 390 ₽",
  subNote = "в месяц · выгода 210 ₽",
  subAction = "Оформить подписку",
  subHref = "#newsletter",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Bakery005Props) {
  const root = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)
  const [counted, setCounted] = useState(0)
  // Цена докручивается: число берём из строки, остальное («₽», пробелы) оставляем как есть.
  const priceNumber = Number.parseInt(subPrice.replace(/\D/g, ""), 10)
  const priceDigits = subPrice.match(/[\d\s\u00a0\u202f]+/)?.[0] ?? ""

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
      { rootMargin: "-15% 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!shown || Number.isNaN(priceNumber)) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(() => setCounted(priceNumber), 0)
      return () => window.clearTimeout(id)
    }
    const start = performance.now()
    let raf = 0
    const step = (now: number) => {
      const t = Math.min(1, (now - start - 900) / 1100)
      const eased = t <= 0 ? 0 : 1 - Math.pow(1 - t, 3)
      setCounted(Math.round(priceNumber * eased))
      if (t < 1) raf = window.requestAnimationFrame(step)
    }
    raf = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(raf)
  }, [shown, priceNumber])

  const price = shown && !Number.isNaN(priceNumber) && priceDigits ? subPrice.replace(priceDigits, `${counted.toLocaleString("ru-RU")} `) : subPrice

  const palette = {
    ...(accent ? { "--vibeui-bakery-005-accent": accent } : null),
    ...(ink ? { "--vibeui-bakery-005-fg": ink } : null),
    ...(background ? { "--vibeui-bakery-005-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-bakery-005" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="bakery-005" data-tone={tone === "auto" ? undefined : tone} data-shown={shown} className={className} style={palette}>
        <div data-part="glow" aria-hidden="true" />
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">
            {title.split(" ").map((word, index, all) => (
              <span key={`${word}-${index}`}>
                <span data-part="word" style={{ ["--vibeui-bakery-005-n" as string]: index }}>
                  <i>{word}</i>
                </span>
                {index < all.length - 1 ? " " : ""}
              </span>
            ))}
          </h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="grid">
            <div data-part="card" style={{ ["--vibeui-bakery-005-i" as string]: 0 }} onPointerMove={tilt} onPointerLeave={untilt}>
              <h3>{cardTitle}</h3>
              {cardText ? <p>{cardText}</p> : null}
              <div data-part="punch" data-shown={shown} role="img" aria-label={`${stamps} штампов, ${stamps + 1}-й — бесплатно`} style={{ ["--vibeui-bakery-005-cells" as string]: stamps + 1 }}>
                {Array.from({ length: stamps }, (_, i) => (
                  <i key={i} style={{ ["--vibeui-bakery-005-i" as string]: i }} />
                ))}
                <i data-free={freeLabel} />
              </div>
              {fine.length > 0 ? (
                <ul data-part="fine">
                  {fine.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : null}
              {cardAction ? (
                <a data-part="action" data-ghost="true" href={cardHref}>
                  {cardAction}
                </a>
              ) : null}
            </div>
            <div data-part="card" style={{ ["--vibeui-bakery-005-i" as string]: 1 }} onPointerMove={tilt} onPointerLeave={untilt}>
              <h3>{subTitle}</h3>
              {subText ? <p>{subText}</p> : null}
              <ul data-part="sub">
                {subLines.map((line, index) => (
                  <li key={line.label} style={{ ["--vibeui-bakery-005-i" as string]: index }}>
                    {line.label} <b>{line.value}</b>
                  </li>
                ))}
              </ul>
              <div data-part="price">
                <b>{price}</b>
                {subNote ? <span>{subNote}</span> : null}
              </div>
              {subAction ? (
                <a data-part="action" href={subHref}>
                  {subAction}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
