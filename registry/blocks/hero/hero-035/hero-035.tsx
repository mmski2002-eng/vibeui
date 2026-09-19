"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react"

export type Hero035PetKey = "cat" | "dog" | "rabbit"

export type Hero035Pet = {
  key: Hero035PetKey
  label: string
  eyebrow: string
  /** Слово в *звёздочках* красится в акцент. */
  title: string
  lede: string
  /** Реплика в пузыре у морды. */
  bubble: string
  /** Фото питомца — квадрат, морда по центру. */
  image: string
  imageAlt?: string
}

export type Hero035Stat = {
  value: number
  suffix?: string
  label: string
}

export type Hero035Props = {
  pets?: readonly Hero035Pet[]
  defaultPet?: Hero035PetKey
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  stats?: readonly Hero035Stat[]
  /** Имя события, которое летит в window при смене питомца: другие блоки могут подхватить. */
  eventName?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Хиро ветклиники: справа фото питомца в «капле», которая медленно меняет
// форму; фото чуть уходит от курсора (unitless --ex/--ey от −1 до 1 через
// ref, без ререндеров). Переключатель «кот / собака / кролик» меняет фото
// кроссфейдом, реплику в пузыре и тексты слева; наружу летит CustomEvent,
// чтобы прайс переключился вслед. Внизу счётчики докручиваются, когда
// попадают в viewport.
const FONTS = "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Golos+Text:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-035"]){
--vibeui-hero-035-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-hero-035-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-035-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-035-on-accent:oklch(from var(--vibeui-hero-035-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-035-muted:color-mix(in oklab,var(--vibeui-hero-035-fg) 62%,var(--vibeui-hero-035-bg));
--vibeui-hero-035-line:color-mix(in oklab,var(--vibeui-hero-035-fg) 12%,transparent);
--vibeui-hero-035-card:light-dark(#fff,color-mix(in oklab,var(--vibeui-hero-035-bg) 88%,#fff));
--vibeui-hero-035-leaf:#4f8f45;
--vibeui-hero-035-display:"Nunito",ui-rounded,ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-035-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-035"]{color-scheme:dark}
:where([data-vibeui-block="hero-035"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-035"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-035"]{box-sizing:border-box;position:relative;overflow:hidden;padding:3rem 0 4rem;background:var(--vibeui-hero-035-bg);color:var(--vibeui-hero-035-fg);font-family:var(--vibeui-hero-035-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-035"] *{box-sizing:border-box}
[data-vibeui-block="hero-035"] [data-part="blob"]{position:absolute;z-index:0;border-radius:50%;filter:blur(60px);opacity:.35;pointer-events:none;animation:vibeui-hero-035-float 16s ease-in-out infinite alternate}
[data-vibeui-block="hero-035"] [data-part="blob"]:nth-of-type(1){width:34rem;height:34rem;right:-10rem;top:-12rem;background:var(--vibeui-hero-035-accent)}
[data-vibeui-block="hero-035"] [data-part="blob"]:nth-of-type(2){width:26rem;height:26rem;left:-8rem;bottom:-10rem;background:var(--vibeui-hero-035-leaf);animation-delay:-7s}
[data-vibeui-block="hero-035"] [data-part="mark"]{position:absolute;z-index:0;width:3.2rem;height:3.2rem;color:var(--vibeui-hero-035-fg);opacity:.07;pointer-events:none}
[data-vibeui-block="hero-035"] [data-part="shell"]{position:relative;z-index:1;max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem;align-items:center}
[data-vibeui-block="hero-035"] [data-part="switch"]{display:inline-grid;grid-auto-flow:column;grid-auto-columns:1fr;position:relative;padding:.3rem;border-radius:999px;background:var(--vibeui-hero-035-card);border:1px solid var(--vibeui-hero-035-line);box-shadow:0 10px 30px -18px rgb(0 0 0 / .35);isolation:isolate}
[data-vibeui-block="hero-035"] [data-part="switch"]::before{content:"";position:absolute;z-index:-1;top:.3rem;bottom:.3rem;left:.3rem;width:calc((100% - .6rem) / var(--vibeui-hero-035-n));border-radius:999px;background:var(--vibeui-hero-035-accent);transform:translateX(calc(var(--vibeui-hero-035-i) * 100%));transition:transform .35s cubic-bezier(.34,1.4,.64,1)}
[data-vibeui-block="hero-035"] [data-part="switch"] button{padding:.55rem 1.1rem;border:0;border-radius:999px;background:transparent;color:var(--vibeui-hero-035-muted);font-family:var(--vibeui-hero-035-display);font-weight:800;font-size:.92rem;cursor:pointer;white-space:nowrap;transition:color .25s}
[data-vibeui-block="hero-035"] [data-part="switch"] button[aria-pressed="true"]{color:var(--vibeui-hero-035-on-accent)}
[data-vibeui-block="hero-035"] [data-part="switch"] button:focus-visible{outline:2px solid var(--vibeui-hero-035-accent);outline-offset:2px}
[data-vibeui-block="hero-035"] [data-part="eyebrow"]{margin:1.6rem 0 .8rem;font-weight:600;font-size:.85rem;letter-spacing:.02em;color:var(--vibeui-hero-035-leaf)}
[data-vibeui-block="hero-035"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-035-display);font-weight:900;font-size:clamp(2.5rem,6.4cqi,5.2rem);line-height:.98;letter-spacing:-.03em;animation:vibeui-hero-035-rise .5s cubic-bezier(.2,.8,.2,1) both}
[data-vibeui-block="hero-035"] [data-part="title"] em{font-style:normal;color:var(--vibeui-hero-035-accent);position:relative;white-space:nowrap}
[data-vibeui-block="hero-035"] [data-part="title"] em::after{content:"";position:absolute;left:0;right:0;bottom:-.05em;height:.18em;border-radius:1em;background:color-mix(in oklab,var(--vibeui-hero-035-accent) 25%,transparent);z-index:-1}
[data-vibeui-block="hero-035"] [data-part="lede"]{margin:1.2rem 0 0;max-width:32rem;font-size:1.08rem;color:var(--vibeui-hero-035-muted);animation:vibeui-hero-035-rise .5s .08s cubic-bezier(.2,.8,.2,1) both}
[data-vibeui-block="hero-035"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:.7rem;margin:1.8rem 0 0}
[data-vibeui-block="hero-035"] [data-part="primary"],[data-vibeui-block="hero-035"] [data-part="secondary"]{display:inline-flex;align-items:center;gap:.5rem;padding:.9rem 1.4rem;border-radius:999px;font-family:var(--vibeui-hero-035-display);font-weight:800;font-size:1rem;text-decoration:none;transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s,background .2s}
[data-vibeui-block="hero-035"] [data-part="primary"]{background:var(--vibeui-hero-035-accent);color:var(--vibeui-hero-035-on-accent)}
[data-vibeui-block="hero-035"] [data-part="primary"]:hover{transform:translateY(-2px) rotate(-1deg);box-shadow:0 14px 30px -12px var(--vibeui-hero-035-accent)}
[data-vibeui-block="hero-035"] [data-part="secondary"]{color:var(--vibeui-hero-035-fg);border:1px solid var(--vibeui-hero-035-line);background:var(--vibeui-hero-035-card)}
[data-vibeui-block="hero-035"] [data-part="secondary"]:hover{transform:translateY(-2px) rotate(1deg)}
[data-vibeui-block="hero-035"] [data-part="secondary"] svg{width:1rem;height:1rem;color:var(--vibeui-hero-035-accent)}
[data-vibeui-block="hero-035"] a:focus-visible{outline:2px solid var(--vibeui-hero-035-accent);outline-offset:2px}
[data-vibeui-block="hero-035"] [data-part="stats"]{display:flex;flex-wrap:wrap;gap:1.2rem 2.2rem;margin:2.4rem 0 0;padding:0;list-style:none}
[data-vibeui-block="hero-035"] [data-part="stats"] b{display:block;font-family:var(--vibeui-hero-035-display);font-weight:900;font-size:1.9rem;line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
[data-vibeui-block="hero-035"] [data-part="stats"] span{display:block;margin-top:.25rem;font-size:.82rem;color:var(--vibeui-hero-035-muted)}
[data-vibeui-block="hero-035"] [data-part="stage"]{position:relative;width:min(100%,26rem);margin:0 auto}
[data-vibeui-block="hero-035"] [data-part="bubble"]{position:absolute;z-index:3;top:-.4rem;right:-.2rem;max-width:12rem;padding:.7rem 1rem;border-radius:1.2rem 1.2rem 1.2rem .3rem;background:var(--vibeui-hero-035-card);border:1px solid var(--vibeui-hero-035-line);box-shadow:0 14px 30px -18px rgb(0 0 0 / .35);font-family:var(--vibeui-hero-035-display);font-weight:800;font-size:.92rem;line-height:1.3;transform-origin:bottom left;animation:vibeui-hero-035-pop .45s cubic-bezier(.34,1.56,.64,1) both}
[data-vibeui-block="hero-035"] [data-part="face"]{position:relative;width:100%;aspect-ratio:1;--vibeui-hero-035-ex:0;--vibeui-hero-035-ey:0;border-radius:58% 42% 55% 45% / 48% 56% 44% 52%;overflow:hidden;background:var(--vibeui-hero-035-card);box-shadow:0 40px 80px -40px rgb(0 0 0 / .45);animation:vibeui-hero-035-morph 12s ease-in-out infinite alternate}
@keyframes vibeui-hero-035-float{from{transform:translate(0,0)}to{transform:translate(6%,10%) scale(1.1)}}
@keyframes vibeui-hero-035-rise{from{opacity:0;transform:translateY(14px)}}
@keyframes vibeui-hero-035-pop{from{opacity:0;transform:scale(.6) rotate(-6deg)}}
@keyframes vibeui-hero-035-pant{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.82)}}
[data-vibeui-block="hero-035"] [data-part="face"] img{position:absolute;inset:-4%;width:108%;height:108%;object-fit:cover;opacity:0;transform:translate(calc(var(--vibeui-hero-035-ex) * -1.5%),calc(var(--vibeui-hero-035-ey) * -1.5%)) scale(1.06);transition:opacity .6s cubic-bezier(.2,.8,.2,1),transform .5s ease-out}
[data-vibeui-block="hero-035"] [data-part="face"] img[data-active="true"]{opacity:1;transform:translate(calc(var(--vibeui-hero-035-ex) * -1.5%),calc(var(--vibeui-hero-035-ey) * -1.5%)) scale(1)}
[data-vibeui-block="hero-035"] [data-part="paw"]{position:absolute;right:8%;bottom:7%;width:2.6rem;height:2.6rem;border-radius:50%;background:var(--vibeui-hero-035-accent);box-shadow:0 0 0 .6rem color-mix(in oklab,var(--vibeui-hero-035-accent) 22%,transparent);animation:vibeui-hero-035-pulse 2.2s ease-out infinite}
[data-vibeui-block="hero-035"] [data-part="paw"]::after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 62%,var(--vibeui-hero-035-on-accent) 26%,transparent 27%),radial-gradient(circle at 26% 34%,var(--vibeui-hero-035-on-accent) 11%,transparent 12%),radial-gradient(circle at 50% 22%,var(--vibeui-hero-035-on-accent) 11%,transparent 12%),radial-gradient(circle at 74% 34%,var(--vibeui-hero-035-on-accent) 11%,transparent 12%)}
@keyframes vibeui-hero-035-morph{to{border-radius:44% 56% 47% 53% / 55% 45% 55% 45%}}
@keyframes vibeui-hero-035-pulse{to{box-shadow:0 0 0 1.2rem transparent}}
@container (min-width: 60rem){[data-vibeui-block="hero-035"] [data-part="shell"]{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:3rem}[data-vibeui-block="hero-035"] [data-part="stage"]{width:min(100%,30rem)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-035"] *{animation:none!important;transition:none!important}}`

const DEFAULT_PETS: Hero035Pet[] = [
  { key: "cat", label: "Кот", eyebrow: "Ветклиника и груминг на Соколе · 24/7", title: "Лечим так, что *кот не заметит*", lede: "Тихие кабинеты без собачьего лая, приём по записи без очереди и врачи, которые сначала гладят, потом смотрят. Прививки, зубы, стерилизация — всё в одном месте.", bubble: "Мя. Меня даже не держали.", image: "/demo/vet/diary-01.webp", imageAlt: "Рыжий кот в пледе" },
  { key: "dog", label: "Собака", eyebrow: "Ветклиника и груминг на Соколе · 24/7", title: "Лечим так, что *хвост не перестаёт*", lede: "Отдельный вход для собак, весы прямо в холле и лакомство после укола. Ортопед, стоматолог, груминг — и никто не будет гладить против шерсти.", bubble: "Гав. Тут дают вкусняшки.", image: "/demo/vet/diary-04.webp", imageAlt: "Корги на прогулке" },
  { key: "rabbit", label: "Кролик", eyebrow: "Ветклиника и груминг на Соколе · 24/7", title: "Лечим так, что *уши не вянут*", lede: "Врач по грызунам и кроликам каждый день, а не «по четвергам». Зубы, ЖКТ, стрижка когтей — быстро, тихо и без стресса для длинноухих.", bubble: "Морковку взяла с собой.", image: "/demo/vet/diary-03.webp", imageAlt: "Вислоухий кролик" },
]

const DEFAULT_STATS: Hero035Stat[] = [
  { value: 12480, label: "хвостов вылечили с 2017-го" },
  { value: 4.9, suffix: " / 5", label: "средняя оценка на картах" },
  { value: 18, label: "минут — среднее ожидание приёма" },
]

const MARKS = [
  { left: "6%", top: "12%", rotate: -20 },
  { left: "40%", top: "6%", rotate: 15 },
  { left: "22%", top: "70%", rotate: 30 },
  { left: "88%", top: "62%", rotate: -35 },
  { left: "60%", top: "84%", rotate: 10 },
]

function PawMark({ left, top, rotate }: { left: string; top: string; rotate: number }) {
  return (
    <svg data-part="mark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ left, top, transform: `rotate(${rotate}deg)` }}>
      <ellipse cx="7" cy="8.2" rx="2.2" ry="2.9" />
      <ellipse cx="17" cy="8.2" rx="2.2" ry="2.9" />
      <ellipse cx="3.4" cy="13.2" rx="1.9" ry="2.4" />
      <ellipse cx="20.6" cy="13.2" rx="1.9" ry="2.4" />
      <path d="M12 11.3c3.4 0 6.2 2.7 6.2 5.8 0 2-1.6 3.4-3.6 3.4-1 0-1.7-.5-2.6-.5s-1.6.5-2.6.5c-2 0-3.6-1.4-3.6-3.4 0-3.1 2.8-5.8 6.2-5.8Z" />
    </svg>
  )
}

function renderTitle(title: string) {
  return title.split("*").map((chunk, index) => (index % 2 === 1 ? <em key={index}>{chunk}</em> : chunk))
}

function formatStat(value: number, progress: number) {
  const current = value * progress
  if (Number.isInteger(value)) return String(Math.round(current)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return current.toFixed(1).replace(".", ",")
}

function useCountUp(active: boolean) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!active) return
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1600)
      setProgress(1 - Math.pow(1 - t, 3))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active])
  return progress
}

/** Хиро ветклиники: CSS-морда следит за курсором, переключатель питомца. */
export function Hero035({
  pets = DEFAULT_PETS,
  defaultPet = "cat",
  primaryLabel = "Записаться на приём",
  primaryHref = "#contacts",
  secondaryLabel = "Что болит?",
  secondaryHref = "#symptoms",
  stats = DEFAULT_STATS,
  eventName = "vibeui-vet:pet",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero035Props) {
  const [petKey, setPetKey] = useState<Hero035PetKey>(defaultPet)
  const [seen, setSeen] = useState(false)
  const faceRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLUListElement>(null)
  const progress = useCountUp(seen)
  const index = Math.max(0, pets.findIndex((pet) => pet.key === petKey))
  const pet = pets[index] ?? pets[0]

  useEffect(() => {
    const node = statsRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const lookAt = (event: ReactPointerEvent<HTMLElement>) => {
    const face = faceRef.current
    if (!face) return
    const rect = face.getBoundingClientRect()
    const dx = (event.clientX - (rect.left + rect.width / 2)) / rect.width
    const dy = (event.clientY - (rect.top + rect.height / 2)) / rect.height
    face.style.setProperty("--vibeui-hero-035-ex", String(Math.max(-1, Math.min(1, dx * 2.2))))
    face.style.setProperty("--vibeui-hero-035-ey", String(Math.max(-1, Math.min(1, dy * 2.2))))
  }

  const lookForward = () => {
    const face = faceRef.current
    if (!face) return
    face.style.setProperty("--vibeui-hero-035-ex", "0")
    face.style.setProperty("--vibeui-hero-035-ey", "0")
  }

  const choose = (key: Hero035PetKey) => {
    setPetKey(key)
    window.dispatchEvent(new CustomEvent(eventName, { detail: { pet: key } }))
  }

  const palette = {
    ...(accent ? { "--vibeui-hero-035-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-035-fg": ink } : null),
    ...(background ? { "--vibeui-hero-035-bg": background } : null),
    ...style,
  } as CSSProperties

  const switchStyle = { ["--vibeui-hero-035-n" as string]: pets.length, ["--vibeui-hero-035-i" as string]: index } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-035" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-035" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette} onPointerMove={lookAt} onPointerLeave={lookForward}>
        <i data-part="blob" aria-hidden="true" />
        <i data-part="blob" aria-hidden="true" />
        {MARKS.map((mark) => (
          <PawMark key={mark.left + mark.top} {...mark} />
        ))}
        <div data-part="shell">
          <div data-part="copy">
            <div data-part="switch" role="group" aria-label="Кто у вас" style={switchStyle}>
              {pets.map((item) => (
                <button key={item.key} type="button" aria-pressed={item.key === pet.key} onClick={() => choose(item.key)}>
                  {item.label}
                </button>
              ))}
            </div>
            {pet.eyebrow ? <p data-part="eyebrow">{pet.eyebrow}</p> : null}
            <h1 data-part="title" key={`title-${pet.key}`}>
              {renderTitle(pet.title)}
            </h1>
            <p data-part="lede" key={`lede-${pet.key}`}>
              {pet.lede}
            </p>
            <div data-part="actions">
              {primaryLabel ? (
                <a data-part="primary" href={primaryHref}>
                  {primaryLabel}
                </a>
              ) : null}
              {secondaryLabel ? (
                <a data-part="secondary" href={secondaryHref}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 12h3l2-6 4 12 2-6h5" />
                  </svg>
                  {secondaryLabel}
                </a>
              ) : null}
            </div>
            {stats.length > 0 ? (
              <ul data-part="stats" ref={statsRef}>
                {stats.map((stat) => (
                  <li key={stat.label}>
                    <b>
                      {formatStat(stat.value, progress)}
                      {stat.suffix}
                    </b>
                    <span>{stat.label}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div data-part="stage">
            <p data-part="bubble" key={`bubble-${pet.key}`} aria-live="polite">
              {pet.bubble}
            </p>
            <div data-part="face" data-pet={pet.key} ref={faceRef} role="img" aria-label={pet.imageAlt ?? pet.label}>
              {pets.map((item) => (
                <img key={item.key} src={item.image} alt="" data-active={item.key === pet.key} loading={item.key === defaultPet ? "eager" : "lazy"} />
              ))}
              <i data-part="paw" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
