"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react"

export type House005Home = { image: string; place: string; year: string; area: string; code?: string }
export type House005Stat = { value: number; suffix?: string; label: string }

export type House005Props = {
  eyebrow?: string
  title?: string
  homes?: readonly House005Home[]
  stats?: readonly House005Stat[]
  prevLabel?: string
  nextLabel?: string
  galleryLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Построенные дома: счётчики докручиваются при появлении, ниже лента
// крупных карточек с прокруткой по снапу — тянется пальцем, колесом и
// стрелками, янтарная полоска показывает, где вы в ленте. Карточка при
// наведении чуть приподнимает фото и открывает подпись проекта.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"

const S = '[data-vibeui-block="house-005"]'
const STYLES = `
:where(${S}){
--vibeui-house-005-bg:light-dark(#f4f1ec,#0e0f10);
--vibeui-house-005-fg:light-dark(#16181a,#f2efe9);
--vibeui-house-005-accent:#e8a35c;
--vibeui-house-005-muted:color-mix(in oklab,var(--vibeui-house-005-fg) 58%,transparent);
--vibeui-house-005-line:color-mix(in oklab,var(--vibeui-house-005-fg) 12%,transparent);
--vibeui-house-005-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-house-005-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) ${S}{color-scheme:dark}
:where(${S}[data-tone="light"]){color-scheme:light}
:where(${S}[data-tone="dark"]){color-scheme:dark}
${S}{padding:clamp(4rem,9cqi,7.5rem) 0;background:var(--vibeui-house-005-bg);color:var(--vibeui-house-005-fg);font-family:var(--vibeui-house-005-font);overflow:hidden}
${S} *{box-sizing:border-box}
${S} [data-part="shell"]{max-width:90rem;margin:0 auto;padding:0 clamp(1rem,3cqi,2.5rem)}
${S} [data-part="eyebrow"]{display:flex;align-items:center;gap:.7rem;margin:0 0 1rem;font-family:var(--vibeui-house-005-mono);font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-house-005-muted)}
${S} [data-part="eyebrow"]::before{content:"";width:1.6rem;height:1px;background:var(--vibeui-house-005-accent)}
${S} [data-part="title"]{margin:0;max-width:18ch;font-weight:300;font-size:clamp(2.2rem,5.6cqi,4.6rem);line-height:1;letter-spacing:-.04em}
${S} [data-part="stats"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0;margin:2.5rem 0 0;border-top:1px solid var(--vibeui-house-005-line)}
${S} [data-part="stats"] div{padding:1.2rem 1rem 1.2rem 0}
${S} [data-part="stats"] dd{margin:0;font-size:clamp(2.2rem,5cqi,4rem);font-weight:300;letter-spacing:-.05em;font-variant-numeric:tabular-nums;line-height:1}
${S} [data-part="stats"] dd span{color:var(--vibeui-house-005-accent)}
${S} [data-part="stats"] dt{margin-top:.4rem;font-size:.78rem;color:var(--vibeui-house-005-muted)}
${S} [data-part="bar"]{display:flex;align-items:center;gap:1rem;margin:2.5rem 0 1.25rem}
${S} [data-part="track"]{flex:1;height:1px;background:var(--vibeui-house-005-line);overflow:hidden}
${S} [data-part="track"] i{display:block;height:100%;width:var(--vibeui-house-005-w,25%);background:var(--vibeui-house-005-accent);transform:translateX(calc(var(--vibeui-house-005-x,0) * (100% / var(--vibeui-house-005-w-n,0.25) - 100%)));transition:transform .2s linear}
${S} [data-part="bar"] button{display:grid;place-items:center;width:2.8rem;height:2.8rem;padding:0;border:1px solid var(--vibeui-house-005-line);border-radius:50%;background:transparent;color:inherit;cursor:pointer;transition:background-color .3s,color .3s}
${S} [data-part="bar"] button:hover{background:var(--vibeui-house-005-fg);color:var(--vibeui-house-005-bg)}
${S} [data-part="bar"] svg{width:1rem;height:1rem}
${S} [data-part="rail"]{display:grid;grid-auto-flow:column;grid-auto-columns:min(82%,34rem);gap:1rem;margin:0;padding:0 clamp(1rem,3cqi,2.5rem) 1rem;list-style:none;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-inline:clamp(1rem,3cqi,2.5rem);scrollbar-width:none;cursor:grab}
${S} [data-part="rail"]::-webkit-scrollbar{display:none}
${S} [data-part="rail"][data-drag="true"]{cursor:grabbing;scroll-snap-type:none}
${S} [data-part="rail"] li{scroll-snap-align:start}
${S} [data-part="rail"] figure{position:relative;margin:0;border-radius:1.5rem;overflow:hidden;aspect-ratio:3/2;background:var(--vibeui-house-005-line)}
${S} [data-part="rail"] img{width:100%;height:100%;object-fit:cover;display:block;transform:scale(1.04);transition:transform 1.4s cubic-bezier(.2,.8,.2,1);pointer-events:none}
${S} [data-part="rail"] li:hover img{transform:scale(1.1)}
${S} [data-part="rail"] figure::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 45%,rgb(8 9 10 / .78))}
${S} [data-part="rail"] figcaption{position:absolute;left:1.2rem;right:1.2rem;bottom:1.1rem;z-index:1;display:grid;grid-template-columns:1fr auto;gap:.2rem 1rem;color:#f2efe9}
${S} [data-part="rail"] figcaption b{font-size:1.25rem;font-weight:500;letter-spacing:-.02em}
${S} [data-part="rail"] figcaption span{font-family:var(--vibeui-house-005-mono);font-size:.72rem;opacity:.75}
${S} [data-part="rail"] figcaption em{grid-column:2;grid-row:1/3;align-self:end;padding:.35rem .7rem;border-radius:999px;background:rgb(242 239 233 / .14);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);font-style:normal;font-size:.72rem;opacity:0;transform:translateY(6px);transition:opacity .4s,transform .4s}
${S} [data-part="rail"] li:hover figcaption em{opacity:1;transform:none}
${S} button:focus-visible{outline:2px solid var(--vibeui-house-005-accent);outline-offset:2px}
${S} [data-part="rail"]:focus-visible{outline:2px solid var(--vibeui-house-005-accent);outline-offset:-2px}
@container (min-width: 48rem){${S} [data-part="stats"]{grid-template-columns:repeat(4,minmax(0,1fr))}${S} [data-part="rail"]{grid-auto-columns:min(46%,40rem)}}
@container (min-width: 90rem){${S} [data-part="rail"]{padding-inline:calc((100cqi - 85rem) / 2)}}
@media (prefers-reduced-motion:reduce){${S} *{transition:none!important}}
${S} [data-part="bar"] button{transition:background-color .35s,color .35s,border-color .35s,transform .3s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="bar"] button svg{transition:transform .45s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="bar"] button:active{transform:scale(.9);transition-duration:.12s}
${S} [data-part="bar"] button:hover svg[data-dir="next"]{transform:translateX(3px)}
${S} [data-part="bar"] button:hover svg[data-dir="prev"]{transform:translateX(-3px)}
${S} [data-part="bar"] button:hover svg[data-dir="up"]{transform:translateY(-3px)}
${S} [data-part="bar"] button:hover svg[data-dir="down"]{transform:translateY(3px)}
@keyframes vibeui-house-005-fly{0%{transform:none}45%{transform:translate(140%,-140%)}46%{transform:translate(-140%,140%)}100%{transform:none}}
@keyframes vibeui-house-005-pop{0%{transform:scale(.94)}60%{transform:scale(1.04)}100%{transform:none}}
@media (prefers-reduced-motion:reduce){${S} *,${S} *::before{animation:none!important;transition:none!important}}`

const DEFAULT_HOMES: House005Home[] = [
  { image: "/demo/house/built-01.webp", place: "Ладога, Лахденпохья", year: "2025", area: "212 м²", code: "КБ-212" },
  { image: "/demo/house/built-02.webp", place: "Истра, Подмосковье", year: "2024", area: "138 м²", code: "БХ-138" },
  { image: "/demo/house/built-03.webp", place: "Валдай, река Шегринка", year: "2025", area: "176 м²", code: "КБ-176" },
  { image: "/demo/house/built-04.webp", place: "Карелия, Сортавала", year: "2023", area: "242 м²", code: "КБ-242" },
]

const DEFAULT_STATS: House005Stat[] = [
  { value: 214, label: "домов сдано" },
  { value: 11, label: "лет строим из бруса" },
  { value: 14, label: "регионов" },
  { value: 0, suffix: " ₽", label: "доплат сверх договора" },
]

function Counter({ value, suffix, run }: { value: number; suffix?: string; run: boolean }) {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (!run) return
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1600
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = duration ? Math.min(1, (now - start) / duration) : 1
      setShown(Math.round(value * (1 - Math.pow(1 - t, 4))))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [run, value])
  return (
    <>
      {shown}
      {suffix ? <span>{suffix}</span> : null}
    </>
  )
}

/** Построенные дома: счётчики и лента фото с прокруткой по снапу. */
export function House005({
  eyebrow = "Построенные дома",
  title = "Живут в них уже сейчас",
  homes = DEFAULT_HOMES,
  stats = DEFAULT_STATS,
  prevLabel = "Назад",
  nextLabel = "Вперёд",
  galleryLabel = "Построенные дома",
  tone = "dark",
  accent,
  ink,
  background,
  className,
  style,
}: House005Props) {
  const rail = useRef<HTMLUListElement>(null)
  const statsRef = useRef<HTMLDListElement>(null)
  const [seen, setSeen] = useState(false)
  const [scroll, setScroll] = useState({ x: 0, w: 0.25 })
  const [drag, setDrag] = useState(false)

  useEffect(() => {
    const node = statsRef.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSeen(true)
        observer.disconnect()
      }
    }, { threshold: 0.4 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const node = rail.current
    if (!node) return
    const update = () => {
      const max = node.scrollWidth - node.clientWidth
      setScroll({ x: max > 0 ? node.scrollLeft / max : 0, w: Math.min(1, node.clientWidth / node.scrollWidth) })
    }
    const first = requestAnimationFrame(update)
    node.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      cancelAnimationFrame(first)
      node.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  const step = (direction: number) => {
    const node = rail.current
    const card = node?.querySelector("li")
    if (node && card) node.scrollBy({ left: direction * (card.clientWidth + 16), behavior: "smooth" })
  }

  const startDrag = (event: ReactPointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== "mouse") return
    const node = event.currentTarget
    const startX = event.clientX
    const startLeft = node.scrollLeft
    setDrag(true)
    const move = (moveEvent: PointerEvent) => {
      node.scrollLeft = startLeft - (moveEvent.clientX - startX)
    }
    const up = () => {
      setDrag(false)
      window.removeEventListener("pointermove", move)
    }
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", up, { once: true })
  }

  const palette = {
    ...(accent ? { "--vibeui-house-005-accent": accent } : null),
    ...(ink ? { "--vibeui-house-005-fg": ink } : null),
    ...(background ? { "--vibeui-house-005-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-house-005" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="house-005" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {stats.length ? (
            <dl data-part="stats" ref={statsRef}>
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dd>
                    <Counter value={stat.value} suffix={stat.suffix} run={seen} />
                  </dd>
                  <dt>{stat.label}</dt>
                </div>
              ))}
            </dl>
          ) : null}
          <div data-part="bar">
            <span data-part="track" aria-hidden="true">
              <i style={{ ["--vibeui-house-005-w" as string]: `${scroll.w * 100}%`, ["--vibeui-house-005-w-n" as string]: scroll.w, ["--vibeui-house-005-x" as string]: scroll.x }} />
            </span>
            <button type="button" aria-label={prevLabel} onClick={() => step(-1)}>
              <svg data-dir="prev" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M13 8H3M7 4 3 8l4 4" />
              </svg>
            </button>
            <button type="button" aria-label={nextLabel} onClick={() => step(1)}>
              <svg data-dir="next" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>
          </div>
        </div>
        <ul data-part="rail" ref={rail} data-drag={drag} aria-label={galleryLabel} tabIndex={0} onPointerDown={startDrag}>
          {homes.map((home) => (
            <li key={home.image + home.place}>
              <figure>
                <img src={home.image} alt={home.place} loading="lazy" draggable={false} />
                <figcaption>
                  <b>{home.place}</b>
                  <span>
                    {home.year} · {home.area}
                  </span>
                  {home.code ? <em>{home.code}</em> : null}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
