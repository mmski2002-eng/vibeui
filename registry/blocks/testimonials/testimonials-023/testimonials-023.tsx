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
// моноширинный текст, «№ 0412 · 08:14». При появлении в кадре чек
// «выползает» из щели принтера: маска раскрывает бумагу сверху вниз
// рывками, нижний край раскрытия — зубчатый (conic-gradient в маске), а
// строки допечатываются в такт. Чеки чуть повёрнуты вразнобой, по наведению
// приподнимаются. Заголовок секции поднимается словами из-под маски.
// Интерактив — только IntersectionObserver.
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
--vibeui-testimonials-023-ease:cubic-bezier(.2,.8,.2,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-023"]{color-scheme:dark}
:where([data-vibeui-block="testimonials-023"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="testimonials-023"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="testimonials-023"]{box-sizing:border-box;position:relative;overflow:clip;padding:5.5rem 0;background:var(--vibeui-testimonials-023-panel);color:var(--vibeui-testimonials-023-fg);font-family:var(--vibeui-testimonials-023-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="testimonials-023"] *{box-sizing:border-box}
[data-vibeui-block="testimonials-023"] [data-part="glow"]{position:absolute;right:-10rem;top:-6rem;width:40rem;height:26rem;border-radius:50%;background:radial-gradient(closest-side,color-mix(in oklab,var(--vibeui-testimonials-023-accent) 12%,transparent),transparent 70%);filter:blur(40px);pointer-events:none}
[data-vibeui-block="testimonials-023"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="testimonials-023"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.5rem;font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--vibeui-testimonials-023-accent);font-weight:600;margin:0 0 1.1rem}
[data-vibeui-block="testimonials-023"] [data-part="eyebrow"]::before{content:"";width:1.4rem;height:2px;background:var(--vibeui-testimonials-023-accent);border-radius:2px}
[data-vibeui-block="testimonials-023"] [data-part="title"]{margin:0;font-family:var(--vibeui-testimonials-023-display);font-weight:600;letter-spacing:-.025em;line-height:1.02;font-size:clamp(2.2rem,5cqi,4rem)}
[data-vibeui-block="testimonials-023"] [data-part="word"]{display:inline-block;overflow:clip;vertical-align:top;padding:.04em .06em .14em 0;margin:-.04em 0 -.14em}
[data-vibeui-block="testimonials-023"] [data-part="word"] i{display:inline-block;font-style:normal;transform:translateY(112%)}
[data-vibeui-block="testimonials-023"][data-shown="true"] [data-part="word"] i{animation:vibeui-testimonials-023-rise .9s var(--vibeui-testimonials-023-ease) both;animation-delay:calc(var(--vibeui-testimonials-023-n) * .09s)}
[data-vibeui-block="testimonials-023"] [data-part="lede"]{font-size:1.06rem;color:var(--vibeui-testimonials-023-muted);max-width:34rem;margin:1rem 0 0;opacity:0;translate:0 1rem}
[data-vibeui-block="testimonials-023"][data-shown="true"] [data-part="lede"]{animation:vibeui-testimonials-023-in .8s var(--vibeui-testimonials-023-ease) .3s both}
[data-vibeui-block="testimonials-023"] [data-part="row"]{display:flex;gap:1.5rem;flex-wrap:wrap;justify-content:center;margin-top:2.5rem;align-items:flex-start}
[data-vibeui-block="testimonials-023"] [data-part="slot"]{position:relative;width:15.5rem;padding-top:.9rem;filter:drop-shadow(0 18px 22px rgb(0 0 0 / .2));transform:rotate(var(--vibeui-testimonials-023-r));transition:transform .5s var(--vibeui-testimonials-023-ease)}
[data-vibeui-block="testimonials-023"] [data-part="slot"]:hover{transform:rotate(var(--vibeui-testimonials-023-r)) translateY(-.4rem)}
[data-vibeui-block="testimonials-023"] [data-part="slit"]{position:absolute;left:.2rem;right:.2rem;top:0;height:.75rem;border-radius:999px;background:linear-gradient(180deg,#3a322c,#14100d 60%,#2b2622);box-shadow:0 1px 0 rgb(255 255 255 / .35),0 6px 14px -6px rgb(0 0 0 / .6);z-index:2}
[data-vibeui-block="testimonials-023"] [data-part="paper"]{mask-image:linear-gradient(#000,#000),conic-gradient(from -45deg at 50% 100%,#000 90deg,#0000 0);mask-repeat:no-repeat,repeat-x;mask-size:100% 0,.7rem .7rem;mask-position:0 0,0 0}
[data-vibeui-block="testimonials-023"] [data-part="slot"][data-shown="true"] [data-part="paper"]{animation:vibeui-testimonials-023-feed var(--vibeui-testimonials-023-t) steps(34) both;animation-delay:var(--vibeui-testimonials-023-d)}
[data-vibeui-block="testimonials-023"] [data-part="receipt"]{position:relative;padding:1.3rem 1.2rem 1.6rem;background:var(--vibeui-testimonials-023-paper);color:var(--vibeui-testimonials-023-ink);font-family:var(--vibeui-testimonials-023-mono);font-size:.8rem;line-height:1.55;clip-path:polygon(0 0,100% 0,100% calc(100% - .5rem),${TEETH},0 calc(100% - .5rem))}
[data-vibeui-block="testimonials-023"] [data-part="receipt"]::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 3px,rgb(0 0 0 / .025) 3px 4px);pointer-events:none}
[data-vibeui-block="testimonials-023"] [data-part="receipt"] > *{opacity:0;transform:translateY(-.2rem)}
[data-vibeui-block="testimonials-023"] [data-part="slot"][data-shown="true"] [data-part="receipt"] > *{animation:vibeui-testimonials-023-print .3s steps(3) forwards;animation-delay:calc(var(--vibeui-testimonials-023-d) + .15s + var(--vibeui-testimonials-023-i) * .22s)}
[data-vibeui-block="testimonials-023"] [data-part="head"]{display:flex;justify-content:space-between;font-weight:700;letter-spacing:.06em}
[data-vibeui-block="testimonials-023"] [data-part="dash"]{border:0;border-top:1px dashed rgb(0 0 0 / .35);margin:.55rem 0}
[data-vibeui-block="testimonials-023"] [data-part="line"]{display:block}
[data-vibeui-block="testimonials-023"] [data-part="foot"]{display:flex;justify-content:space-between;font-weight:700}
[data-vibeui-block="testimonials-023"] [data-part="guest"]{text-transform:uppercase;letter-spacing:.08em;font-size:.72rem;color:#6b625b}
[data-vibeui-block="testimonials-023"] [data-part="thanks"]{font-family:var(--vibeui-testimonials-023-hand);font-size:1.2rem;color:var(--vibeui-testimonials-023-accent);text-align:center;margin-top:.4rem}
[data-vibeui-block="testimonials-023"] [data-part="bar"]{height:.55rem;margin-top:.5rem;background:repeating-linear-gradient(90deg,var(--vibeui-testimonials-023-ink) 0 2px,transparent 2px 3px,var(--vibeui-testimonials-023-ink) 3px 6px,transparent 6px 7px,var(--vibeui-testimonials-023-ink) 7px 8px,transparent 8px 11px)}
@keyframes vibeui-testimonials-023-print{to{opacity:1;transform:none}}
@keyframes vibeui-testimonials-023-feed{from{mask-size:100% 0,.7rem .7rem;mask-position:0 0,0 0}to{mask-size:100% 100%,.7rem .7rem;mask-position:0 0,0 100%}}
@keyframes vibeui-testimonials-023-rise{0%{transform:translateY(112%) scaleY(.8)}70%{transform:translateY(-2%)}100%{transform:none}}
@keyframes vibeui-testimonials-023-in{from{opacity:0;translate:0 1rem}to{opacity:1;translate:0 0}}
@container (min-width: 72rem){[data-vibeui-block="testimonials-023"] [data-part="row"]{justify-content:space-between}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-023"] *{animation:none!important;transition:none!important}[data-vibeui-block="testimonials-023"] [data-part="receipt"] > *{opacity:1;transform:none}[data-vibeui-block="testimonials-023"] [data-part="paper"]{mask:none}[data-vibeui-block="testimonials-023"] [data-part="word"] i{transform:none}[data-vibeui-block="testimonials-023"] [data-part="lede"]{opacity:1;translate:none}}`

const DEFAULT_REVIEWS: Testimonials023Review[] = [
  { no: "0412", time: "08:14", name: "Марина", lines: ["Тартин ещё тёплый,", "корка хрустит на весь", "трамвай. Соседи смотрели."], sum: "420 ₽" },
  { no: "0587", time: "07:32", name: "Илья", lines: ["Флэт уайт лучше,", "чем в трёх местах рядом.", "Проверил все три."], sum: "270 ₽" },
  { no: "0633", time: "11:06", name: "Катя и Лев", lines: ["Булочка с корицей", "закончилась у нас в руках", "за четыре минуты."], sum: "480 ₽" },
  { no: "0701", time: "16:48", name: "Пётр", lines: ["Заказал коробку", "к восьми — в 7:58 стояла", "на стойке. Без вопросов."], sum: "1 060 ₽" },
]

function useShown<T extends HTMLElement>(rootMargin: string) {
  const ref = useRef<T>(null)
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
      { rootMargin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin])

  return { ref, shown }
}

function Receipt({ review, index, brand, place, totalLabel, guestLabel, thanks }: { review: Testimonials023Review; index: number; brand: string; place: string; totalLabel: string; guestLabel: string; thanks: string }) {
  const { ref, shown } = useShown<HTMLDivElement>("-15% 0px")

  const rotate = [-2.5, 1.5, -1, 2.2][index % 4]
  // Сколько элементов печатается — чтобы бумага выползала в такт строкам.
  const count = 4 + review.lines.length + (review.sum ? 1 : 0) + (thanks ? 1 : 0) + 1
  let i = 0
  const next = () => ({ ["--vibeui-testimonials-023-i" as string]: i++ }) as CSSProperties

  return (
    <div
      ref={ref}
      data-part="slot"
      data-shown={shown}
      style={{ ["--vibeui-testimonials-023-r" as string]: `${rotate}deg`, ["--vibeui-testimonials-023-d" as string]: `${index * 0.15}s`, ["--vibeui-testimonials-023-t" as string]: `${(count * 0.22 + 0.4).toFixed(2)}s` }}
    >
      <i data-part="slit" aria-hidden="true" />
      <div data-part="paper">
        <article data-part="receipt" aria-label={`Отзыв: ${review.name}`}>
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
      </div>
    </div>
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
  const { ref, shown } = useShown<HTMLElement>("-10% 0px")
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
      <section ref={ref} data-vibeui-block="testimonials-023" data-tone={tone === "auto" ? undefined : tone} data-shown={shown} className={className} style={palette}>
        <div data-part="glow" aria-hidden="true" />
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">
            {title.split(" ").map((word, index, all) => (
              <span key={`${word}-${index}`}>
                <span data-part="word" style={{ ["--vibeui-testimonials-023-n" as string]: index }}>
                  <i>{word}</i>
                </span>
                {index < all.length - 1 ? " " : ""}
              </span>
            ))}
          </h2>
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
