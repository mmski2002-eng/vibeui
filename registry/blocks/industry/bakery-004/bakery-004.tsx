"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Counter001 } from "@/registry/components/typography/counter-001/counter-001"

export type Bakery004Frame = {
  /** Часы на табло: «18:00». */
  time: string
  title: string
  text?: string
  image?: string
  /** Насколько темно в этот момент: 0 — день, 1 — ночь. */
  night?: number
}

export type Bakery004Props = {
  eyebrow?: string
  frames?: readonly Bakery004Frame[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  /** Цвет ночи, в который уходит фон на тёмных кадрах. */
  night?: string
  className?: string
  style?: CSSProperties
}

// Scroll-driven история хлеба «36 часов до буханки»: секция высотой в шесть
// экранов, внутри липкая сцена. По мере прокрутки меняется кадр (фото с
// плавной сменой), часы листаются как табло — каждая цифра едет в своей
// колонке, заголовок кадра поднимается из-под маски, а фон и текст плавно
// уходят в ночь и возвращаются к утру: солнце садится, встают луна и звёзды,
// фото темнеет. Ту же «ночь» блок отдаёт странице — пишет `--vibeui-night`
// на <html> и шлёт `vibeui-night:change` на window, чтобы фон всей страницы
// и шапка темнели вместе со сценой. Прогресс считается в rAF на scroll и
// пишется в CSS-переменные без ререндера; индекс кадра — единственное
// состояние. Поверх сцены — зерно бумаги.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Golos+Text:wght@400;500;600&display=swap"

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const STYLES = `
:where([data-vibeui-block="bakery-004"]){
--vibeui-bakery-004-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-bakery-004-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bakery-004-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bakery-004-night:#17130f;
--vibeui-bakery-004-night-fg:#f6f1e8;
--vibeui-bakery-004-display:"Playfair Display",ui-serif,Georgia,serif;
--vibeui-bakery-004-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-bakery-004-n:0;
--vibeui-bakery-004-ease:cubic-bezier(.2,.8,.2,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="bakery-004"]{color-scheme:dark}
:where([data-vibeui-block="bakery-004"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="bakery-004"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="bakery-004"]{box-sizing:border-box;position:relative;min-height:calc(var(--vibeui-bakery-004-frames) * 100svh);background:var(--vibeui-bakery-004-bg);color:var(--vibeui-bakery-004-fg);font-family:var(--vibeui-bakery-004-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="bakery-004"] *{box-sizing:border-box}
[data-vibeui-block="bakery-004"] [data-part="stage"]{position:sticky;top:0;min-height:100svh;max-height:100svh;overflow:hidden;display:grid;align-items:center;background:color-mix(in oklab,var(--vibeui-bakery-004-night) calc(var(--vibeui-bakery-004-n) * 100%),var(--vibeui-bakery-004-bg));color:color-mix(in oklab,var(--vibeui-bakery-004-night-fg) calc(var(--vibeui-bakery-004-n) * 100%),var(--vibeui-bakery-004-fg))}
[data-vibeui-block="bakery-004"] [data-part="grain"]{position:absolute;inset:0;z-index:2;pointer-events:none;opacity:.07;mix-blend-mode:multiply;background-image:${GRAIN}}
[data-vibeui-block="bakery-004"] [data-part="sun"]{position:absolute;right:8%;bottom:-6rem;width:22rem;height:22rem;border-radius:50%;pointer-events:none;background:radial-gradient(closest-side,color-mix(in oklab,var(--vibeui-bakery-004-accent) 55%,#ffc46b),color-mix(in oklab,var(--vibeui-bakery-004-accent) 30%,transparent) 45%,transparent 72%);filter:blur(24px);opacity:calc(1 - var(--vibeui-bakery-004-n));transform:translateY(calc(var(--vibeui-bakery-004-n) * 14rem))}
[data-vibeui-block="bakery-004"] [data-part="moon"]{position:absolute;left:10%;top:8%;width:6rem;height:6rem;border-radius:50%;pointer-events:none;background:radial-gradient(circle at 40% 35%,#fff9ea,#d9cfb8 70%,#b9ad94);box-shadow:0 0 60px 20px rgb(255 245 220 / .18),0 0 0 1px rgb(255 255 255 / .25) inset;opacity:calc(var(--vibeui-bakery-004-n) * var(--vibeui-bakery-004-n));transform:translateY(calc((1 - var(--vibeui-bakery-004-n)) * 8rem)) scale(calc(.8 + var(--vibeui-bakery-004-n) * .2))}
[data-vibeui-block="bakery-004"] [data-part="moon"]::after{content:"";position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 70% 60%,rgb(0 0 0 / .08) 0 .5rem,transparent .55rem),radial-gradient(circle at 35% 70%,rgb(0 0 0 / .07) 0 .35rem,transparent .4rem)}
[data-vibeui-block="bakery-004"] [data-part="stars"]{position:absolute;inset:0;pointer-events:none;opacity:var(--vibeui-bakery-004-n);animation:vibeui-bakery-004-twinkle 4s ease-in-out infinite;background-image:radial-gradient(1.5px 1.5px at 12% 18%,#fff,transparent),radial-gradient(1px 1px at 30% 40%,#fff,transparent),radial-gradient(2px 2px at 56% 12%,#fff,transparent),radial-gradient(1px 1px at 72% 30%,#fff,transparent),radial-gradient(1.5px 1.5px at 88% 22%,#fff,transparent),radial-gradient(1px 1px at 44% 70%,#fff,transparent),radial-gradient(1.5px 1.5px at 92% 76%,#fff,transparent)}
[data-vibeui-block="bakery-004"] [data-part="shell"]{position:relative;display:grid;gap:2rem;align-items:center;width:100%;max-width:80rem;margin:0 auto;padding:4.5rem 1.25rem}
[data-vibeui-block="bakery-004"] [data-part="frame"]{position:relative;aspect-ratio:3 / 2;border-radius:1.4rem;overflow:hidden;box-shadow:0 40px 80px -40px rgb(0 0 0 / .6);background:color-mix(in oklab,currentColor 8%,transparent)}
[data-vibeui-block="bakery-004"] [data-part="frame"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transform:scale(1.06);transition:opacity .7s,transform 1.4s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="bakery-004"] [data-part="frame"] img[data-active="true"]{opacity:1;transform:none}
[data-vibeui-block="bakery-004"] [data-part="frame"]::after{content:"";position:absolute;inset:0;pointer-events:none;background:var(--vibeui-bakery-004-night);opacity:calc(var(--vibeui-bakery-004-n) * .35);mix-blend-mode:multiply}
[data-vibeui-block="bakery-004"] [data-part="frame"]{transform:perspective(60rem) rotateY(calc((.5 - var(--vibeui-bakery-004-n)) * 4deg))}
[data-vibeui-block="bakery-004"] [data-part="copy"]{display:grid;gap:1rem}
[data-vibeui-block="bakery-004"] [data-part="eyebrow"]{font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;font-weight:600;opacity:.7;margin:0}
[data-vibeui-block="bakery-004"] [data-part="clock"]{font-family:var(--vibeui-bakery-004-display);font-weight:700;font-size:clamp(3.4rem,10cqi,7.5rem);letter-spacing:-.05em;line-height:1;display:flex;font-variant-numeric:tabular-nums}
[data-vibeui-block="bakery-004"] [data-part="clock"] span{display:inline-block;overflow:hidden;height:1em;position:relative}
[data-vibeui-block="bakery-004"] [data-part="clock"] span i{display:block;font-style:normal;transition:transform .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="bakery-004"] [data-part="clock"] span i b{display:block;font-weight:inherit}
[data-vibeui-block="bakery-004"] [data-part="clock"] span[data-sep]{width:.45em;text-align:center}
[data-vibeui-block="bakery-004"] [data-part="clock"] span[data-sep] i{animation:vibeui-bakery-004-blink 1.4s steps(1) infinite}
[data-vibeui-block="bakery-004"] [data-part="text"]{display:grid;gap:1rem}
[data-vibeui-block="bakery-004"] [data-part="copy"] h3{margin:0;font-family:var(--vibeui-bakery-004-display);font-size:clamp(1.8rem,3.8cqi,2.8rem);font-weight:600;letter-spacing:-.025em;line-height:1.05;overflow:clip;padding-bottom:.12em;margin-bottom:-.12em}
[data-vibeui-block="bakery-004"] [data-part="copy"] h3 span{display:block;animation:vibeui-bakery-004-rise .8s var(--vibeui-bakery-004-ease) both}
[data-vibeui-block="bakery-004"] [data-part="copy"] p{margin:0;max-width:30rem;font-size:1.06rem;opacity:.85;animation:vibeui-bakery-004-in .8s var(--vibeui-bakery-004-ease) .15s both}
[data-vibeui-block="bakery-004"] [data-part="dots"]{display:flex;gap:.45rem;margin-top:.6rem}
[data-vibeui-block="bakery-004"] [data-part="dots"] i{width:.5rem;height:.5rem;border-radius:50%;background:currentColor;opacity:.25;transition:opacity .3s,transform .3s}
[data-vibeui-block="bakery-004"] [data-part="dots"] i[data-active="true"]{opacity:1;transform:scale(1.3);background:var(--vibeui-bakery-004-accent)}
@keyframes vibeui-bakery-004-blink{50%{opacity:.25}}
@keyframes vibeui-bakery-004-twinkle{0%,100%{filter:brightness(1)}50%{filter:brightness(1.6)}}
@keyframes vibeui-bakery-004-rise{from{transform:translateY(110%)}to{transform:none}}
@keyframes vibeui-bakery-004-in{from{opacity:0;translate:0 .8rem}to{opacity:.85;translate:0 0}}
@container (min-width: 60rem){[data-vibeui-block="bakery-004"] [data-part="shell"]{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:4rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="bakery-004"] *{animation:none!important;transition:none!important}[data-vibeui-block="bakery-004"] [data-part="frame"]{transform:none}}`

const DEFAULT_FRAMES: Bakery004Frame[] = [
  { time: "18:00", title: "Замес", text: "Мука, вода, соль и закваска, которой шесть лет. Никаких дрожжей — только время.", image: "/demo/bakery/story-01.webp", night: 0.15 },
  { time: "22:00", title: "Складывание", text: "Каждые сорок минут тесто складывают, как письмо. Так у мякиша появляются большие поры.", image: "/demo/bakery/story-01.webp", night: 0.55 },
  { time: "01:30", title: "Холод", text: "Ночь в холодильнике при четырёх градусах. Вкус становится сложнее, корка — тоньше.", image: "/demo/bakery/story-02.webp", night: 1 },
  { time: "05:00", title: "Печь", text: "Первый человек в пекарне включает подовую печь. 250 градусов, пар, надрез лезвием.", image: "/demo/bakery/story-03.webp", night: 0.85 },
  { time: "07:00", title: "Первая партия", text: "Буханки остывают на решётках и потрескивают. Это единственный звук, который мы записываем.", image: "/demo/bakery/story-04.webp", night: 0.25 },
  { time: "07:40", title: "На полке", text: "Хлеб дошёл до вас. Резать лучше через час — но мы понимаем, если не дотерпите.", image: "/demo/bakery/story-05.webp", night: 0 },
]

/** Scroll-driven история: кадры, табло часов и фон от вечера к утру. */
export function Bakery004({
  eyebrow = "36 часов до буханки",
  frames = DEFAULT_FRAMES,
  tone = "auto",
  accent,
  ink,
  background,
  night,
  className,
  style,
}: Bakery004Props) {
  const root = useRef<HTMLElement>(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const element = root.current
    if (!element) return
    let raf = 0
    const update = () => {
      raf = 0
      const rect = element.getBoundingClientRect()
      const total = Math.max(1, rect.height - window.innerHeight)
      const progress = Math.min(1, Math.max(0, -rect.top / total))
      setIndex(Math.min(frames.length - 1, Math.floor(progress * frames.length)))
      // Ночь плавная между кадрами, а не ступенькой.
      const pos = progress * (frames.length - 1)
      const a = frames[Math.floor(pos)].night ?? 0
      const b = frames[Math.min(frames.length - 1, Math.ceil(pos))].night ?? 0
      const night = (a + (b - a) * (pos - Math.floor(pos))).toFixed(3)
      element.style.setProperty("--vibeui-bakery-004-n", night)
      // Страница темнеет вместе со сценой: переменная на <html> и событие для обёрток.
      document.documentElement.style.setProperty("--vibeui-night", night)
      window.dispatchEvent(new CustomEvent("vibeui-night:change", { detail: { night: Number(night), progress } }))
    }
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      window.cancelAnimationFrame(raf)
      document.documentElement.style.removeProperty("--vibeui-night")
      window.dispatchEvent(new CustomEvent("vibeui-night:change", { detail: { night: 0, progress: 0 } }))
    }
  }, [frames])

  const frame = frames[index]
  const palette = {
    "--vibeui-bakery-004-frames": frames.length,
    ...(accent ? { "--vibeui-bakery-004-accent": accent } : null),
    ...(ink ? { "--vibeui-bakery-004-fg": ink } : null),
    ...(background ? { "--vibeui-bakery-004-bg": background } : null),
    ...(night ? { "--vibeui-bakery-004-night": night } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-bakery-004" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="bakery-004" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette} aria-label={eyebrow}>
        <div data-part="stage">
          <div data-part="sun" aria-hidden="true" />
          <div data-part="stars" aria-hidden="true" />
          <div data-part="moon" aria-hidden="true" />
          <div data-part="grain" aria-hidden="true" />
          <div data-part="shell">
            <div data-part="frame">
              {frames.map((item, i) => (item.image ? <img key={i} src={item.image} alt={i === index ? item.title : ""} data-active={i === index} /> : null))}
              <Counter001 data-part="count" frames={frames} index={index} accent={accent} />
            </div>
            <div data-part="copy" aria-live="polite">
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <div data-part="clock" aria-label={frame.time}>
                {frame.time.split("").map((char, i) =>
                  /\d/.test(char) ? (
                    <span key={i}>
                      <i style={{ transform: `translateY(${-Number(char)}em)` }}>
                        {Array.from({ length: 10 }, (_, d) => (
                          <b key={d}>{d}</b>
                        ))}
                      </i>
                    </span>
                  ) : (
                    <span key={i} data-sep="">
                      <i>{char}</i>
                    </span>
                  ),
                )}
              </div>
              <div key={index} data-part="text">
                <h3>
                  <span>{frame.title}</span>
                </h3>
                {frame.text ? <p>{frame.text}</p> : null}
              </div>
              <div data-part="dots" aria-hidden="true">
                {frames.map((_, i) => (
                  <i key={i} data-active={i === index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
