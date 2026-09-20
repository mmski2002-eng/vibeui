"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Event013Slot = {
  time: string
  title: string
  place?: string
  text?: string
}

export type Event013Props = {
  eyebrow?: string
  title?: string
  lede?: string
  slots?: readonly Event013Slot[]
  /** Подпись под луной: «закат в 16:04». */
  skyNote?: string
  /** Фото вечера в левую панель; пусто — рисованное небо с луной. */
  image?: string
  imageAlt?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Программа вечера от заката до полуночи. Слева липкое небо: луна ползёт
// по дуге, пока список прокручивают, закатная полоса у горизонта гаснет и
// небо синеет до полуночного; звёзды проступают. Справа пункты вечера —
// время антиквой, место, пара слов; текущий (по прокрутке) подсвечен
// свечой. Прогресс считает rAF из положения секции в окне: в CSS уходит
// переменная --vibeui-event-013-k, в state — только номер активного пункта.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Marck+Script&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="event-013"]){
--vibeui-event-013-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-event-013-card:light-dark(#ffffff,#242424);
--vibeui-event-013-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-event-013-muted:light-dark(#6b6b6b,#a3a3a3);
--vibeui-event-013-line:light-dark(color-mix(in oklab,var(--vibeui-event-013-fg) 16%,transparent),color-mix(in oklab,var(--vibeui-event-013-fg) 22%,transparent));
--vibeui-event-013-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-event-013-fire:#ff9a3c;
--vibeui-event-013-silver:#9fb0c8;
--vibeui-event-013-display:"Cormorant Garamond",Georgia,serif;
--vibeui-event-013-script:"Marck Script","Segoe Script",cursive;
--vibeui-event-013-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-event-013-k:0;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="event-013"]{color-scheme:dark}
:where([data-vibeui-block="event-013"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="event-013"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="event-013"]{box-sizing:border-box;position:relative;display:block;background:var(--vibeui-event-013-bg);color:var(--vibeui-event-013-fg);font-family:var(--vibeui-event-013-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="event-013"] *{box-sizing:border-box}
[data-vibeui-block="event-013"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4.5rem 1.25rem}
[data-vibeui-block="event-013"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-event-013-display);font-size:.85rem;font-weight:500;letter-spacing:.32em;text-transform:uppercase;color:var(--vibeui-event-013-silver)}
[data-vibeui-block="event-013"] [data-part="title"]{margin:0;font-family:var(--vibeui-event-013-display);font-size:clamp(2.2rem,5.5cqi,3.8rem);font-weight:500;line-height:1.05}
[data-vibeui-block="event-013"] [data-part="lede"]{max-width:36rem;margin:1rem 0 0;color:var(--vibeui-event-013-muted)}
[data-vibeui-block="event-013"] [data-part="grid"]{display:grid;gap:1.5rem;margin-top:2.5rem}
[data-vibeui-block="event-013"] [data-part="sky"]{position:relative;height:13rem;overflow:hidden;border:1px solid var(--vibeui-event-013-line);border-radius:1rem;background:linear-gradient(180deg,#1c2740 0%,#2a3a5c 55%,#6b4a5a 82%,#c97b4a 100%)}
[data-vibeui-block="event-013"] [data-part="sky"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
[data-vibeui-block="event-013"] [data-part="sky"]::before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgb(5 9 15 / .85) 0%,rgb(11 18 32 / .6) 70%,#131c2e 100%);opacity:var(--vibeui-event-013-k)}
[data-vibeui-block="event-013"] [data-part="sky"] img+*,[data-vibeui-block="event-013"] [data-part="sky"] [data-part="skynote"]{z-index:2}
[data-vibeui-block="event-013"] [data-part="stars"]{position:absolute;inset:0;opacity:calc(var(--vibeui-event-013-k) * .9);background-image:radial-gradient(1px 1px at 12% 22%,#fff 50%,transparent 51%),radial-gradient(1.2px 1.2px at 28% 12%,#fff 50%,transparent 51%),radial-gradient(1px 1px at 44% 30%,#fff 50%,transparent 51%),radial-gradient(1.4px 1.4px at 58% 8%,#fff 50%,transparent 51%),radial-gradient(1px 1px at 70% 26%,#fff 50%,transparent 51%),radial-gradient(1.2px 1.2px at 84% 16%,#fff 50%,transparent 51%),radial-gradient(1px 1px at 92% 38%,#fff 50%,transparent 51%),radial-gradient(1px 1px at 20% 48%,#fff 50%,transparent 51%),radial-gradient(1.2px 1.2px at 76% 50%,#fff 50%,transparent 51%),radial-gradient(1px 1px at 36% 58%,#fff 50%,transparent 51%)}
[data-vibeui-block="event-013"] [data-part="trees"]{position:absolute;left:0;right:0;bottom:0;height:34%;background:linear-gradient(180deg,transparent,#05090f 70%)}
[data-vibeui-block="event-013"] [data-part="trees"] svg{position:absolute;left:0;right:0;bottom:0;width:100%;height:100%;fill:#070c15}
[data-vibeui-block="event-013"] [data-part="moon"]{position:absolute;left:50%;top:50%;width:0;height:0;transform:rotate(calc(-100deg + var(--vibeui-event-013-k) * 160deg))}
[data-vibeui-block="event-013"] [data-part="moon"] i{position:absolute;left:-1.6rem;top:-8.6rem;width:3.2rem;height:3.2rem;border-radius:50%;background:radial-gradient(circle at 40% 40%,#fff8e4,#f2e2b6 60%,#d9c58f);box-shadow:0 0 24px 6px rgb(242 226 182 / .35),0 0 70px 20px rgb(242 226 182 / .12);transform:rotate(calc(100deg - var(--vibeui-event-013-k) * 160deg))}
[data-vibeui-block="event-013"] [data-part="moon"] i::after{content:"";position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 30% 35%,transparent 55%,rgb(120 100 70 / .18) 56%,transparent 70%),radial-gradient(circle at 65% 65%,rgb(120 100 70 / .16) 0 18%,transparent 19%)}
[data-vibeui-block="event-013"] [data-part="skynote"]{position:absolute;left:1.1rem;bottom:.9rem;margin:0;font-family:var(--vibeui-event-013-script);font-size:1.15rem;color:rgb(242 238 230 / .8)}
[data-vibeui-block="event-013"] [data-part="list"]{display:grid;gap:.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="event-013"] [data-part="slot"]{position:relative;display:grid;grid-template-columns:4.2rem minmax(0,1fr);gap:.2rem 1rem;padding:1.1rem 1.2rem 1.1rem 1rem;border:1px solid transparent;border-radius:.8rem;transition:background .5s,border-color .5s,box-shadow .5s}
[data-vibeui-block="event-013"] [data-part="slot"][data-active="true"]{background:var(--vibeui-event-013-card);border-color:rgb(242 182 79 / .4);box-shadow:0 0 0 1px rgb(242 182 79 / .12),0 20px 40px -28px rgb(242 182 79 / .5)}
[data-vibeui-block="event-013"] [data-part="slot"] time{grid-row:span 3;align-self:start;font-family:var(--vibeui-event-013-display);font-size:1.6rem;font-weight:500;line-height:1;font-variant-numeric:lining-nums tabular-nums;color:var(--vibeui-event-013-muted);transition:color .5s}
[data-vibeui-block="event-013"] [data-part="slot"][data-active="true"] time{color:var(--vibeui-event-013-accent);text-shadow:0 0 18px rgb(242 182 79 / .5)}
[data-vibeui-block="event-013"] [data-part="slot"] h3{margin:0;font-family:var(--vibeui-event-013-display);font-size:1.45rem;font-weight:500;line-height:1.15}
[data-vibeui-block="event-013"] [data-part="slot"] h3 span{margin-left:.6rem;font-family:var(--vibeui-event-013-script);font-size:1.05rem;font-weight:400;color:var(--vibeui-event-013-silver)}
[data-vibeui-block="event-013"] [data-part="slot"] p{margin:0;font-size:.92rem;color:var(--vibeui-event-013-muted)}
[data-vibeui-block="event-013"] [data-part="slot"] i{position:absolute;left:-.35rem;top:1.35rem;width:.7rem;height:.7rem;border-radius:50%;background:var(--vibeui-event-013-line);transition:background .5s,box-shadow .5s}
[data-vibeui-block="event-013"] [data-part="slot"][data-active="true"] i,[data-vibeui-block="event-013"] [data-part="slot"][data-done="true"] i{background:var(--vibeui-event-013-accent);box-shadow:0 0 10px var(--vibeui-event-013-accent)}
[data-vibeui-block="event-013"] [data-part="list"]{position:relative;padding-left:.6rem}
[data-vibeui-block="event-013"] [data-part="list"]::before{content:"";position:absolute;left:0;top:1.5rem;bottom:1.5rem;width:1px;background:linear-gradient(180deg,var(--vibeui-event-013-accent) calc(var(--vibeui-event-013-k) * 100%),var(--vibeui-event-013-line) calc(var(--vibeui-event-013-k) * 100%))}
[data-vibeui-block="event-013"] [data-part="slot"] i{left:.25rem}
@container (min-width:56rem){
[data-vibeui-block="event-013"] [data-part="grid"]{grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:3rem;align-items:start}
[data-vibeui-block="event-013"] [data-part="sky"]{position:sticky;top:6rem;height:24rem}
[data-vibeui-block="event-013"] [data-part="moon"] i{top:-14rem;width:4rem;height:4rem;left:-2rem}
[data-vibeui-block="event-013"] [data-part="list"]{padding-left:1rem}
[data-vibeui-block="event-013"] [data-part="slot"]{padding:1.3rem 1.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="event-013"] *{animation:none!important;transition:none!important}}`

/** Программа вечера: луна ползёт по небу при прокрутке, небо темнеет, пункты вечера подсвечиваются свечой. */
export function Event013({
  eyebrow = "Вечер",
  title = "От заката до полуночи",
  lede = "Начинаем, когда садится солнце, заканчиваем, когда луна над лесом. Между — камин, глинтвейн и танцы.",
  skyNote = "закат в 16:04",
  image,
  imageAlt = "",
  slots = [
    { time: "15:30", title: "Сбор гостей", place: "у камина", text: "Чай, глинтвейн, пледы. Трансфер от метро подходит к 15:15." },
    { time: "16:00", title: "Церемония", place: "большая гостиная", text: "На закате, при свечах, двадцать минут. Телефоны — в карман, фотограф всё снимет." },
    { time: "17:00", title: "Глинтвейн на террасе", place: "терраса", text: "Первый снег на плечах, гирлянды, первые фотографии на улице." },
    { time: "18:30", title: "Ужин", place: "длинный стол", text: "Утка, рыба или вегетарианское — что выбрали в анкете. Тосты — по желанию." },
    { time: "21:00", title: "Танцы", place: "гостиная", text: "Первый танец — вальс, потом всё, что заказали в анкете." },
    { time: "23:00", title: "Фейерверк", place: "поляна в лесу", text: "Пять минут, тёплая обувь и куртки — на вешалке у выхода." },
    { time: "00:00", title: "Полночь", place: "терраса", text: "Трансфер обратно в 00:30 и 01:00. Кто остаётся — комнаты готовы." },
  ],
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Event013Props) {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const palette = {
    ...(accent ? { "--vibeui-event-013-accent": accent } : null),
    ...(ink ? { "--vibeui-event-013-fg": ink } : null),
    ...(background ? { "--vibeui-event-013-bg": background } : null),
    ...style,
  } as CSSProperties

  useEffect(() => {
    const node = root.current
    if (!node) return
    const count = slots.length
    let frame = 0
    const read = () => {
      frame = 0
      const rect = node.getBoundingClientRect()
      const viewport = window.innerHeight
      const start = viewport * 0.7
      const end = viewport * 0.5 - rect.height
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)))
      node.style.setProperty("--vibeui-event-013-k", progress.toFixed(3))
      setActive(Math.min(count - 1, Math.floor(progress * count)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }
    frame = requestAnimationFrame(read)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [slots.length])

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-event-013" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="event-013" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="grid">
            <div data-part="sky" aria-hidden="true">
              {image ? (
                <img src={image} alt={imageAlt} loading="lazy" />
              ) : (
                <>
                  <span data-part="stars" />
                  <span data-part="moon">
                    <i />
                  </span>
                  <span data-part="trees">
                    <svg viewBox="0 0 400 100" preserveAspectRatio="none">
                      <path d="M0 100V70l14-28 12 24 10-40 14 34 8-16 12 30 16-52 14 40 10-22 12 34 18-46 12 28 10-14 14 38 16-60 12 44 10-20 14 32 18-40 12 26 8-12 14 36 16-56 14 46 8-18 12 28 18-44 12 30 10-16 14 40V100z" />
                    </svg>
                  </span>
                </>
              )}
              {skyNote ? <p data-part="skynote">{skyNote}</p> : null}
            </div>
            <ol data-part="list">
              {slots.map((slot, index) => (
                <li key={slot.time + slot.title} data-part="slot" data-active={index === active ? "true" : undefined} data-done={index < active ? "true" : undefined}>
                  <i aria-hidden="true" />
                  <time>{slot.time}</time>
                  <h3>
                    {slot.title}
                    {slot.place ? <span>{slot.place}</span> : null}
                  </h3>
                  {slot.text ? <p>{slot.text}</p> : null}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  )
}
