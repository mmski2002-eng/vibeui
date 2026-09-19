"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Testimonials026Stat = {
  /** Число, до которого докручивается счётчик. */
  value: number
  /** Что после числа: «+», «%». */
  suffix?: string
  label: string
}

export type Testimonials026Review = {
  name: string
  /** Машина клиента: «BMW X5, 2021». */
  car: string
  text: string
  stars?: number
}

export type Testimonials026Props = {
  eyebrow?: string
  title?: string
  stats?: readonly Testimonials026Stat[]
  /** Марки для наклонной бегущей строки. */
  brands?: readonly string[]
  reviews?: readonly Testimonials026Review[]
  /** Секунд на полный круг ряда отзывов. */
  speed?: number
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Отзывы автосервиса: сверху ряд огромных счётчиков («машин за год»,
// «лет», «рейтинг»), которые докручиваются, когда попадают в экран
// (IntersectionObserver + rAF, ease-out). Между ними и отзывами —
// наклонная акцентная лента с марками, бежит бесконечно. Ниже два ряда
// карточек-отзывов едут навстречу друг другу (translateX −50% на
// дублированном контенте), по наведению останавливаются.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="testimonials-026"]){
--vibeui-testimonials-026-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-testimonials-026-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-026-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-026-on-accent:oklch(from var(--vibeui-testimonials-026-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-testimonials-026-muted:color-mix(in oklab,var(--vibeui-testimonials-026-fg) 60%,var(--vibeui-testimonials-026-bg));
--vibeui-testimonials-026-line:color-mix(in oklab,var(--vibeui-testimonials-026-fg) 12%,transparent);
--vibeui-testimonials-026-glass:color-mix(in oklab,var(--vibeui-testimonials-026-fg) 5%,transparent);
--vibeui-testimonials-026-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-026-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-026-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-026"]{color-scheme:dark}
:where([data-vibeui-block="testimonials-026"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="testimonials-026"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="testimonials-026"]{box-sizing:border-box;overflow:hidden;padding:5rem 0;background:var(--vibeui-testimonials-026-bg);color:var(--vibeui-testimonials-026-fg);font-family:var(--vibeui-testimonials-026-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="testimonials-026"] *{box-sizing:border-box}
[data-vibeui-block="testimonials-026"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="testimonials-026"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 .8rem;font-family:var(--vibeui-testimonials-026-mono);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-testimonials-026-accent)}
[data-vibeui-block="testimonials-026"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-testimonials-026-accent)}
[data-vibeui-block="testimonials-026"] [data-part="title"]{margin:0 0 2.2rem;font-family:var(--vibeui-testimonials-026-display);font-weight:900;font-size:clamp(1.8rem,4.4cqi,3.2rem);line-height:1.02;letter-spacing:-.03em;text-transform:uppercase;max-width:36rem}
[data-vibeui-block="testimonials-026"] [data-part="stats"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="testimonials-026"] [data-part="stat"]{display:grid;gap:.3rem;padding:1.2rem 0 0;border-top:2px solid var(--vibeui-testimonials-026-line)}
[data-vibeui-block="testimonials-026"] [data-part="stat"] b{font-family:var(--vibeui-testimonials-026-display);font-weight:900;font-size:clamp(2.4rem,6cqi,4.6rem);line-height:.95;letter-spacing:-.05em;font-variant-numeric:tabular-nums;color:var(--vibeui-testimonials-026-accent)}
[data-vibeui-block="testimonials-026"] [data-part="stat"] b small{font-size:.5em;letter-spacing:-.02em}
[data-vibeui-block="testimonials-026"] [data-part="stat"] span{font-size:.9rem;color:var(--vibeui-testimonials-026-muted)}
[data-vibeui-block="testimonials-026"] [data-part="band"]{position:relative;margin:3.5rem -2rem 3rem;padding:.8rem 0;transform:rotate(-2deg);background:var(--vibeui-testimonials-026-accent);color:var(--vibeui-testimonials-026-on-accent);overflow:hidden;white-space:nowrap}
[data-vibeui-block="testimonials-026"] [data-part="band"] ul{display:inline-flex;gap:0;margin:0;padding:0;list-style:none;animation:vibeui-testimonials-026-run 30s linear infinite}
[data-vibeui-block="testimonials-026"] [data-part="band"] li{padding:0 1.6rem;font-family:var(--vibeui-testimonials-026-display);font-weight:700;font-size:1.05rem;letter-spacing:.04em;text-transform:uppercase}
[data-vibeui-block="testimonials-026"] [data-part="band"] li::before{content:"✦";margin-right:1.6rem;font-size:.7rem;vertical-align:.15em}
[data-vibeui-block="testimonials-026"] [data-part="rows"]{display:grid;gap:1rem}
[data-vibeui-block="testimonials-026"] [data-part="row"]{overflow:hidden;mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
[data-vibeui-block="testimonials-026"] [data-part="track"]{display:flex;width:max-content;margin:0;padding:0;list-style:none;animation:vibeui-testimonials-026-run var(--vibeui-testimonials-026-t,60s) linear infinite}
[data-vibeui-block="testimonials-026"] [data-part="row"][data-dir="back"] [data-part="track"]{animation-direction:reverse}
[data-vibeui-block="testimonials-026"] [data-part="row"]:hover [data-part="track"]{animation-play-state:paused}
[data-vibeui-block="testimonials-026"] [data-part="review"]{display:grid;gap:.6rem;width:20rem;margin-right:1rem;padding:1.2rem 1.3rem;border-radius:1.1rem;border:1px solid var(--vibeui-testimonials-026-line);background:var(--vibeui-testimonials-026-glass)}
[data-vibeui-block="testimonials-026"] [data-part="stars"]{display:inline-flex;gap:.15rem;color:var(--vibeui-testimonials-026-accent)}
[data-vibeui-block="testimonials-026"] [data-part="stars"] svg{width:.9rem;height:.9rem}
[data-vibeui-block="testimonials-026"] [data-part="review"] p{margin:0;font-size:.95rem;line-height:1.45}
[data-vibeui-block="testimonials-026"] [data-part="who"]{display:grid;margin-top:.2rem;font-size:.82rem}
[data-vibeui-block="testimonials-026"] [data-part="who"] b{font-weight:600}
[data-vibeui-block="testimonials-026"] [data-part="who"] span{font-family:var(--vibeui-testimonials-026-mono);font-size:.72rem;color:var(--vibeui-testimonials-026-muted)}
@keyframes vibeui-testimonials-026-run{to{transform:translateX(-50%)}}
@container (min-width: 48rem){[data-vibeui-block="testimonials-026"] [data-part="stats"]{grid-template-columns:repeat(4,minmax(0,1fr));gap:1.6rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-026"] *{animation:none!important;transition:none!important}[data-vibeui-block="testimonials-026"] [data-part="row"]{overflow-x:auto}}`

const DEFAULT_STATS: Testimonials026Stat[] = [
  { value: 1840, label: "машин за прошлый год" },
  { value: 9, label: "лет в детейлинге" },
  { value: 72, suffix: "%", label: "приезжают снова" },
  { value: 4.9, label: "рейтинг на картах" },
]

const DEFAULT_BRANDS = ["Porsche", "BMW", "Mercedes-Benz", "Audi", "Lexus", "Toyota", "Volvo", "Tesla", "Land Rover", "Genesis", "Kia", "Geely"]

const DEFAULT_REVIEWS: Testimonials026Review[] = [
  { name: "Илья Р.", car: "Porsche Macan, 2022", text: "Керамику делал у Артёма. Через год мойка раз в две недели, вода скатывается сама. Ни одной голограммы под лампой.", stars: 5 },
  { name: "Ксения В.", car: "Mini Cooper S", text: "Приехала с фарами как у старого троллейбуса. Через два часа — как из салона, ещё и плёнку сверху наклеили.", stars: 5 },
  { name: "Дмитрий К.", car: "BMW X5, 2021", text: "Фронт в плёнке, стыков не видно даже на капоте. Прислали фото с каждого этапа, смету не меняли.", stars: 5 },
  { name: "Анна и Павел", car: "Volvo XC90", text: "Химчистка после двух детей и собаки. Даша вытащила всё, включая то, о чём мы предпочитали не думать.", stars: 5 },
  { name: "Роман Т.", car: "Tesla Model 3", text: "Полировка + керамика. Понравилось, что сначала показали толщину лака и объяснили, где нельзя жёстко.", stars: 5 },
  { name: "Егор М.", car: "Lexus RX", text: "Бокс чистый, светло, машину не трогают чужие. Забрал в срок, памятку по уходу дали на бумаге.", stars: 4 },
  { name: "Марина С.", car: "Audi Q5", text: "Диски покрыли керамикой — тормозная пыль теперь смывается водой из шланга. Мелочь, а приятно.", stars: 5 },
  { name: "Сергей Л.", car: "Land Rover Defender", text: "Записался через сайт в слот на субботу, подтвердили за минуту. Не «перезвоним», а реально работает.", stars: 5 },
]

function formatNumber(value: number, decimals: number) {
  const fixed = value.toFixed(decimals)
  const [whole, fraction] = fixed.split(".")
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return fraction ? `${grouped},${fraction}` : grouped
}

function Counter({ stat, run }: { stat: Testimonials026Stat; run: boolean }) {
  const [shown, setShown] = useState(0)
  const decimals = Number.isInteger(stat.value) ? 0 : 1

  useEffect(() => {
    if (!run) return
    const duration = 1600
    let frame = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setShown(stat.value * eased)
      if (t < 1) frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [run, stat.value])

  return (
    <li data-part="stat">
      <b>
        {formatNumber(shown, decimals)}
        {stat.suffix ? <small>{stat.suffix}</small> : null}
      </b>
      <span>{stat.label}</span>
    </li>
  )
}

function Star() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L1.3 7.8l6.1-.7z" />
    </svg>
  )
}

function Review({ review, hidden }: { review: Testimonials026Review; hidden?: boolean }) {
  const stars = review.stars ?? 5
  return (
    <li data-part="review" aria-hidden={hidden ? true : undefined}>
      <span data-part="stars" aria-label={`${stars} из 5`}>
        {Array.from({ length: stars }, (_, index) => (
          <Star key={index} />
        ))}
      </span>
      <p>{review.text}</p>
      <span data-part="who">
        <b>{review.name}</b>
        <span>{review.car}</span>
      </span>
    </li>
  )
}

/** Отзывы автосервиса: счётчики докручиваются, марки бегут лентой, отзывы едут в два ряда. */
export function Testimonials026({
  eyebrow = "Отзывы",
  title = "Возвращаются не за скидкой, а за результатом",
  stats = DEFAULT_STATS,
  brands = DEFAULT_BRANDS,
  reviews = DEFAULT_REVIEWS,
  speed = 70,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Testimonials026Props) {
  const statsRef = useRef<HTMLUListElement>(null)
  const [run, setRun] = useState(false)

  useEffect(() => {
    const node = statsRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRun(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const half = Math.ceil(reviews.length / 2)
  const first = reviews.slice(0, half)
  const second = reviews.slice(half)
  const rows = second.length > 0 ? [first, second] : [first]

  const palette = {
    ...(accent ? { "--vibeui-testimonials-026-accent": accent } : null),
    ...(ink ? { "--vibeui-testimonials-026-fg": ink } : null),
    ...(background ? { "--vibeui-testimonials-026-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-testimonials-026" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="testimonials-026" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {stats.length > 0 ? (
            <ul ref={statsRef} data-part="stats">
              {stats.map((stat) => (
                <Counter key={stat.label} stat={stat} run={run} />
              ))}
            </ul>
          ) : null}
        </div>
        {brands.length > 0 ? (
          <div data-part="band" aria-label="Марки, с которыми работаем">
            <ul>
              {[...brands, ...brands].map((brand, index) => (
                <li key={`${brand}-${index}`} aria-hidden={index >= brands.length ? true : undefined}>
                  {brand}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {reviews.length > 0 ? (
          <div data-part="rows">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} data-part="row" data-dir={rowIndex % 2 ? "back" : "forth"} style={{ ["--vibeui-testimonials-026-t" as string]: `${speed + rowIndex * 12}s` }}>
                <ul data-part="track">
                  {[...row, ...row].map((review, index) => (
                    <Review key={`${review.name}-${index}`} review={review} hidden={index >= row.length} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </>
  )
}
