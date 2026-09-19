"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Testimonials023Review = {
  /** Номер чека: «0412». */
  no: string
  time?: string
  name: string
  /** Строки отзыва — каждая печатается отдельно. */
  lines: readonly string[]
  sum?: string
}

export type Testimonials023Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Имя заведения в шапке чека. */
  brand?: string
  place?: string
  totalLabel?: string
  guestLabel?: string
  thanks?: string
  reviews?: readonly Testimonials023Review[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Отзывы на термочеках: узкие карточки с зубчатым низом (clip-path),
// моноширинный текст, «№ 0412 · 08:14». При появлении в кадре строки
// допечатываются сверху вниз по одной — как из кассового принтера. Чеки
// чуть повёрнуты вразнобой. Интерактив — только IntersectionObserver.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Golos+Text:wght@400;500;600&family=Caveat:wght@600&display=swap"

const TEETH = Array.from({ length: 40 }, (_, i) => `${(i * 2.5).toFixed(1)}% ${i % 2 === 0 ? "calc(100% - .5rem)" : "100%"}`).join(",")

const STYLES = `
:where([data-vibeui-block="testimonials-023"]){
--vibeui-testimonials-023-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-testimonials-023-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-023-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-023-muted:color-mix(in oklab,var(--vibeui-testimonials-023-fg) 60%,var(--vibeui-testimonials-023-bg));
--vibeui-testimonials-023-panel:color-mix(in oklab,var(--vibeui-testimonials-023-fg) 5%,var(--vibeui-testimonials-023-bg));
--vibeui-testimonials-023-paper:#ffffff;
--vibeui-testimonials-023-ink:#2b2622;
--vibeui-testimonials-023-display:"Playfair Display",ui-serif,Georgia,serif;
--vibeui-testimonials-023-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-023-hand:"Caveat",cursive;
--vibeui-testimonials-023-mono:ui-monospace,"JetBrains Mono",Menlo,Consolas,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-023"]{color-scheme:dark}
:where([data-vibeui-block="testimonials-023"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="testimonials-023"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="testimonials-023"]{box-sizing:border-box;overflow:hidden;padding:5.5rem 0;background:var(--vibeui-testimonials-023-panel);color:var(--vibeui-testimonials-023-fg);font-family:var(--vibeui-testimonials-023-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="testimonials-023"] *{box-sizing:border-box}
[data-vibeui-block="testimonials-023"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="testimonials-023"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.5rem;font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--vibeui-testimonials-023-accent);font-weight:600;margin:0 0 1.1rem}
[data-vibeui-block="testimonials-023"] [data-part="eyebrow"]::before{content:"";width:1.4rem;height:2px;background:var(--vibeui-testimonials-023-accent);border-radius:2px}
[data-vibeui-block="testimonials-023"] [data-part="title"]{margin:0;font-family:var(--vibeui-testimonials-023-display);font-weight:600;letter-spacing:-.02em;line-height:1.02;font-size:clamp(2rem,4.6cqi,3.6rem)}
[data-vibeui-block="testimonials-023"] [data-part="lede"]{font-size:1.06rem;color:var(--vibeui-testimonials-023-muted);max-width:34rem;margin:1rem 0 0}
[data-vibeui-block="testimonials-023"] [data-part="row"]{display:flex;gap:1.5rem;flex-wrap:wrap;justify-content:center;margin-top:2.5rem;align-items:flex-start}
[data-vibeui-block="testimonials-023"] [data-part="receipt"]{position:relative;width:15.5rem;padding:1.3rem 1.2rem 1.6rem;background:var(--vibeui-testimonials-023-paper);color:var(--vibeui-testimonials-023-ink);font-family:var(--vibeui-testimonials-023-mono);font-size:.8rem;line-height:1.55;box-shadow:0 20px 40px -24px rgb(0 0 0 / .5);transform:rotate(var(--vibeui-testimonials-023-r));clip-path:polygon(0 0,100% 0,100% calc(100% - .5rem),${TEETH},0 calc(100% - .5rem))}
[data-vibeui-block="testimonials-023"] [data-part="receipt"]::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 3px,rgb(0 0 0 / .025) 3px 4px);pointer-events:none}
[data-vibeui-block="testimonials-023"] [data-part="receipt"] > *{opacity:0;transform:translateY(-.2rem)}
[data-vibeui-block="testimonials-023"] [data-part="receipt"][data-shown="true"] > *{animation:vibeui-testimonials-023-print .3s steps(3) forwards;animation-delay:calc(var(--vibeui-testimonials-023-d) + var(--vibeui-testimonials-023-i) * .22s)}
[data-vibeui-block="testimonials-023"] [data-part="head"]{display:flex;justify-content:space-between;font-weight:700;letter-spacing:.06em}
[data-vibeui-block="testimonials-023"] [data-part="dash"]{border:0;border-top:1px dashed rgb(0 0 0 / .35);margin:.55rem 0}
[data-vibeui-block="testimonials-023"] [data-part="line"]{display:block}
[data-vibeui-block="testimonials-023"] [data-part="foot"]{display:flex;justify-content:space-between;font-weight:700}
[data-vibeui-block="testimonials-023"] [data-part="guest"]{text-transform:uppercase;letter-spacing:.08em;font-size:.72rem;color:#6b625b}
[data-vibeui-block="testimonials-023"] [data-part="thanks"]{font-family:var(--vibeui-testimonials-023-hand);font-size:1.2rem;color:var(--vibeui-testimonials-023-accent);text-align:center;margin-top:.4rem}
[data-vibeui-block="testimonials-023"] [data-part="bar"]{height:.55rem;margin-top:.5rem;background:repeating-linear-gradient(90deg,var(--vibeui-testimonials-023-ink) 0 2px,transparent 2px 3px,var(--vibeui-testimonials-023-ink) 3px 6px,transparent 6px 7px,var(--vibeui-testimonials-023-ink) 7px 8px,transparent 8px 11px)}
@keyframes vibeui-testimonials-023-print{to{opacity:1;transform:none}}
@container (min-width: 72rem){[data-vibeui-block="testimonials-023"] [data-part="row"]{justify-content:space-between}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-023"] *{animation:none!important;transition:none!important}[data-vibeui-block="testimonials-023"] [data-part="receipt"] > *{opacity:1;transform:none}}`

const DEFAULT_REVIEWS: Testimonials023Review[] = [
  { no: "0412", time: "08:14", name: "Марина", lines: ["Тартин ещё тёплый,", "корка хрустит на весь", "трамвай. Соседи смотрели."], sum: "420 ₽" },
  { no: "0587", time: "07:32", name: "Илья", lines: ["Флэт уайт лучше,", "чем в трёх местах рядом.", "Проверил все три."], sum: "270 ₽" },
  { no: "0633", time: "11:06", name: "Катя и Лев", lines: ["Булочка с корицей", "закончилась у нас в руках", "за четыре минуты."], sum: "480 ₽" },
  { no: "0701", time: "16:48", name: "Пётр", lines: ["Заказал коробку", "к восьми — в 7:58 стояла", "на стойке. Без вопросов."], sum: "1 060 ₽" },
]

function Receipt({ review, index, brand, place, totalLabel, guestLabel, thanks }: { review: Testimonials023Review; index: number; brand: string; place: string; totalLabel: string; guestLabel: string; thanks: string }) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const element = ref.current
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

  const rotate = [-2.5, 1.5, -1, 2.2][index % 4]
  let i = 0
  const next = () => ({ ["--vibeui-testimonials-023-i" as string]: i++ }) as CSSProperties

  return (
    <article
      ref={ref}
      data-part="receipt"
      data-shown={shown}
      style={{ ["--vibeui-testimonials-023-r" as string]: `${rotate}deg`, ["--vibeui-testimonials-023-d" as string]: `${index * 0.15}s` }}
      aria-label={`Отзыв: ${review.name}`}
    >
      <div data-part="head" style={next()}>
        <span>{brand.toUpperCase()}</span>
        <span>№ {review.no}</span>
      </div>
      <div style={next()}>
        {review.time ? `${review.time} · ` : ""}
        {place}
      </div>
      <hr data-part="dash" style={next()} />
      {review.lines.map((line) => (
        <span key={line} data-part="line" style={next()}>
          {line}
        </span>
      ))}
      <hr data-part="dash" style={next()} />
      {review.sum ? (
        <div data-part="foot" style={next()}>
          <span>{totalLabel}</span>
          <span>{review.sum}</span>
        </div>
      ) : null}
      <div data-part="guest" style={next()}>
        {guestLabel}: {review.name}
      </div>
      {thanks ? (
        <div data-part="thanks" style={next()}>
          {thanks}
        </div>
      ) : null}
      <div data-part="bar" style={next()} aria-hidden="true" />
    </article>
  )
}

/** Отзывы-чеки, печатающиеся построчно при появлении. */
export function Testimonials023({
  eyebrow = "Отзывы",
  title = "Что печатает касса",
  lede = "Настоящие слова гостей — на чеках, как их и оставляют: коротко, пока кофе не остыл.",
  brand = "Корка",
  place = "Хамовники",
  totalLabel = "ИТОГО",
  guestLabel = "гость",
  thanks = "спасибо, приходите к горячему",
  reviews = DEFAULT_REVIEWS,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Testimonials023Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-023-accent": accent } : null),
    ...(ink ? { "--vibeui-testimonials-023-fg": ink } : null),
    ...(background ? { "--vibeui-testimonials-023-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-testimonials-023" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="testimonials-023" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="row">
            {reviews.map((review, index) => (
              <Receipt key={review.no} review={review} index={index} brand={brand} place={place} totalLabel={totalLabel} guestLabel={guestLabel} thanks={thanks} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
