"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"
import { createPortal } from "react-dom"

export type Restaurant005Photo = {
  src: string
  alt?: string
  /** Пропорции кадра: «3 / 2», «2 / 3», «1». */
  aspect?: string
  caption?: string
}

export type Restaurant005Props = {
  eyebrow?: string
  title?: string
  lede?: string
  photos?: readonly Restaurant005Photo[]
  closeLabel?: string
  /** aria кадра без подписи и диалога. */
  openLabel?: string
  photoLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Галерея зала: три колонки разной высоты, при скролле колонки едут с
// разной скоростью (параллакс через одну CSS-переменную прогресса, пишется
// в rAF без ререндера). Клик — лайтбокс в портале: кадр вылетает из своей
// коробки в центр, Escape и клик по фону закрывают.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="restaurant-005"]){
--vibeui-restaurant-005-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-restaurant-005-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-restaurant-005-muted:light-dark(color-mix(in oklab,var(--vibeui-restaurant-005-fg) 60%,var(--vibeui-restaurant-005-bg)),color-mix(in oklab,var(--vibeui-restaurant-005-fg) 58%,var(--vibeui-restaurant-005-bg)));
--vibeui-restaurant-005-line:color-mix(in oklab,var(--vibeui-restaurant-005-fg) 14%,var(--vibeui-restaurant-005-bg));
--vibeui-restaurant-005-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-restaurant-005-glow:0 0 24px color-mix(in oklab,var(--vibeui-restaurant-005-accent) 70%,transparent),0 0 70px color-mix(in oklab,var(--vibeui-restaurant-005-accent) 35%,transparent);
--vibeui-restaurant-005-accent-ink:light-dark(var(--vibeui-restaurant-005-accent),color-mix(in oklab,var(--vibeui-restaurant-005-accent) 55%,var(--vibeui-restaurant-005-fg)));
--vibeui-restaurant-005-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-restaurant-005-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-restaurant-005-p:0;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="restaurant-005"]{color-scheme:dark}
:where([data-vibeui-block="restaurant-005"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="restaurant-005"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="restaurant-005"]{box-sizing:border-box;display:block;background:var(--vibeui-restaurant-005-bg);color:var(--vibeui-restaurant-005-fg);font-family:var(--vibeui-restaurant-005-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="restaurant-005"] *{box-sizing:border-box}
[data-vibeui-block="restaurant-005"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem;overflow:hidden}
[data-vibeui-block="restaurant-005"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1rem 3rem;margin-bottom:4rem}
[data-vibeui-block="restaurant-005"] [data-part="eyebrow"]{margin:0 0 .75rem;font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;color:var(--vibeui-restaurant-005-accent-ink);font-weight:600}
[data-vibeui-block="restaurant-005"] [data-part="title"]{margin:0;font-family:var(--vibeui-restaurant-005-display);font-weight:400;font-size:clamp(2.25rem,5cqi,3.5rem);line-height:1.05;letter-spacing:-.01em}
[data-vibeui-block="restaurant-005"] [data-part="lede"]{margin:0;max-width:26rem;color:var(--vibeui-restaurant-005-muted)}
[data-vibeui-block="restaurant-005"] [data-part="grid"]{display:grid;gap:1rem;grid-template-columns:repeat(2,minmax(0,1fr))}
[data-vibeui-block="restaurant-005"] [data-part="column"]{display:grid;gap:1rem;align-content:start;will-change:transform;transform:translateY(calc(var(--vibeui-restaurant-005-p) * var(--vibeui-restaurant-005-k)))}
[data-vibeui-block="restaurant-005"] [data-part="column"]:nth-child(1){--vibeui-restaurant-005-k:-1rem}
[data-vibeui-block="restaurant-005"] [data-part="column"]:nth-child(2){--vibeui-restaurant-005-k:1.5rem}
[data-vibeui-block="restaurant-005"] [data-part="column"]:nth-child(3){--vibeui-restaurant-005-k:-2rem}
[data-vibeui-block="restaurant-005"] [data-part="frame"]{position:relative;display:block;width:100%;padding:0;border:0;border-radius:.9rem;overflow:hidden;background:light-dark(#e7dfd2,#231d1a);cursor:zoom-in;aspect-ratio:var(--vibeui-restaurant-005-aspect,3/2)}
[data-vibeui-block="restaurant-005"] [data-part="frame"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="restaurant-005"] [data-part="frame"]:hover img{transform:scale(1.05)}
[data-vibeui-block="restaurant-005"] [data-part="frame"][data-hidden="true"] img{visibility:hidden}
[data-vibeui-block="restaurant-005"] [data-part="frame"]:focus-visible{outline:2px solid var(--vibeui-restaurant-005-accent);outline-offset:3px}
[data-vibeui-block="restaurant-005"] [data-part="caption"]{position:absolute;left:.75rem;bottom:.75rem;padding:.3rem .6rem;border-radius:.4rem;background:rgb(20 17 16 / .6);color:#f2ebe0;font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;backdrop-filter:blur(6px);opacity:0;transform:translateY(4px);transition:opacity .3s,transform .3s}
[data-vibeui-block="restaurant-005"] [data-part="frame"]:hover [data-part="caption"]{opacity:1;transform:none}
[data-vibeui-block="restaurant-005"][data-part="layer"]{position:fixed;inset:0;z-index:60;color:#f2ebe0}
[data-vibeui-block="restaurant-005"] [data-part="backdrop"]{position:absolute;inset:0;background:rgb(20 17 16 / .88);opacity:0;transition:opacity .4s}
[data-vibeui-block="restaurant-005"][data-phase="open"] [data-part="backdrop"]{opacity:1}
[data-vibeui-block="restaurant-005"] [data-part="flyer"]{position:absolute;border-radius:.9rem;overflow:hidden;transition:top .55s cubic-bezier(.2,.8,.2,1),left .55s cubic-bezier(.2,.8,.2,1),width .55s cubic-bezier(.2,.8,.2,1),height .55s cubic-bezier(.2,.8,.2,1);box-shadow:0 40px 80px -30px rgb(0 0 0 / .7)}
[data-vibeui-block="restaurant-005"] [data-part="flyer"] img{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="restaurant-005"] [data-part="label"]{position:absolute;left:0;right:0;bottom:1.5rem;text-align:center;font-family:var(--vibeui-restaurant-005-display);font-style:italic;font-size:1.1rem;opacity:0;transition:opacity .4s .3s}
[data-vibeui-block="restaurant-005"][data-phase="open"] [data-part="label"]{opacity:1}
[data-vibeui-block="restaurant-005"] [data-part="close"]{position:absolute;top:1.25rem;right:1.25rem;width:2.75rem;height:2.75rem;display:grid;place-items:center;border-radius:50%;border:1px solid rgb(242 235 224 / .3);background:rgb(20 17 16 / .5);color:#f2ebe0;cursor:pointer;font:inherit}
[data-vibeui-block="restaurant-005"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-restaurant-005-accent);outline-offset:2px}
@container (min-width: 48rem){
[data-vibeui-block="restaurant-005"] [data-part="shell"]{padding:5.5rem 2rem}
[data-vibeui-block="restaurant-005"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.25rem}
[data-vibeui-block="restaurant-005"] [data-part="column"]{gap:1.25rem}
[data-vibeui-block="restaurant-005"] [data-part="column"]:nth-child(2){padding-top:1.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="restaurant-005"] *{transition:none!important}[data-vibeui-block="restaurant-005"] [data-part="column"]{transform:none!important}}`

type Box = { top: number; left: number; width: number; height: number }
const DURATION = 550

const DEFAULT_PHOTOS: Restaurant005Photo[] = [
  { src: "", aspect: "3 / 2", caption: "бар" },
  { src: "", aspect: "2 / 3", caption: "у окна" },
  { src: "", aspect: "1", caption: "сервировка" },
  { src: "", aspect: "3 / 2", caption: "терраса" },
  { src: "", aspect: "1", caption: "кухня" },
  { src: "", aspect: "2 / 3", caption: "зал" },
]

function rectOf(element: Element): Box {
  const rect = element.getBoundingClientRect()
  return { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
}

function fitBox(ratio: number): Box {
  const gutter = Math.min(window.innerWidth * 0.06, 48)
  const maxWidth = window.innerWidth - gutter * 2
  const maxHeight = window.innerHeight - gutter * 2 - 40
  let width = maxWidth
  let height = width / ratio
  if (height > maxHeight) {
    height = maxHeight
    width = height * ratio
  }
  return { top: (window.innerHeight - 40 - height) / 2, left: (window.innerWidth - width) / 2, width, height }
}

/** Галерея зала: колонки с параллаксом при скролле и лайтбокс с вылетом кадра. */
export function Restaurant005({
  eyebrow = "Зал",
  title = "Свечи, дерево и вид на двор",
  lede = "Сорок мест в зале, восемь у бара и терраса на лето. Столы для компаний до двенадцати — в дальнем зале.",
  photos = DEFAULT_PHOTOS,
  closeLabel = "Закрыть",
  openLabel = "Открыть фото",
  photoLabel = "Фото",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Restaurant005Props) {
  const root = useRef<HTMLElement>(null)
  const frames = useRef<Record<number, HTMLButtonElement | null>>({})
  const closing = useRef(0)
  const [phase, setPhase] = useState<"closed" | "start" | "open" | "closing">("closed")
  const [current, setCurrent] = useState<number | null>(null)
  const [box, setBox] = useState<Box | null>(null)
  const palette = {
    ...(accent ? { "--vibeui-restaurant-005-accent": accent } : null),
    ...(ink ? { "--vibeui-restaurant-005-fg": ink } : null),
    ...(background ? { "--vibeui-restaurant-005-bg": background } : null),
    ...style,
  } as CSSProperties
  // Колонки набираем по высоте: каждое следующее (по убыванию высоты) фото
  // идёт в самую короткую колонку — низ колонок сходится, пустот нет.
  const columns = (() => {
    const heightOf = (aspect?: string) => {
      const [w, h = 1] = (aspect ?? "3 / 2").split("/").map((part) => Number(part.trim()))
      return w ? h / w : 0.667
    }
    const order = photos.map((photo, index) => ({ photo, index, h: heightOf(photo.aspect) })).sort((a, b) => b.h - a.h || a.index - b.index)
    const buckets: { items: { photo: Restaurant005Photo; index: number }[]; h: number }[] = [0, 1, 2].map(() => ({ items: [], h: 0 }))
    for (const entry of order) {
      const target = buckets.reduce((best, bucket) => (bucket.h < best.h ? bucket : best), buckets[0])
      target.items.push({ photo: entry.photo, index: entry.index })
      target.h += entry.h
    }
    return buckets.map((bucket) => bucket.items.sort((a, b) => a.index - b.index))
  })()

  // Параллакс: прогресс секции во вьюпорте (−1…1) в одну переменную.
  useEffect(() => {
    const element = root.current
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const rect = element.getBoundingClientRect()
      const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight
      element.style.setProperty("--vibeui-restaurant-005-p", String(Math.max(-1, Math.min(1, progress)).toFixed(3)))
    }
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      window.cancelAnimationFrame(raf)
    }
  }, [])

  const open = (index: number) => {
    const frame = frames.current[index]
    if (phase !== "closed" || !frame) return
    window.clearTimeout(closing.current)
    setCurrent(index)
    setBox(rectOf(frame))
    setPhase("start")
  }

  const close = useCallback(() => {
    const frame = current !== null ? frames.current[current] : null
    if (phase !== "open" || !frame) return
    setBox(rectOf(frame))
    setPhase("closing")
    closing.current = window.setTimeout(() => {
      setPhase("closed")
      frame.focus({ preventScroll: true })
    }, DURATION)
  }, [phase, current])

  useEffect(() => {
    if (phase === "closed" || current === null) return
    const photo = photos[current]
    const ratio = (() => {
      const [w, h = 1] = (photo.aspect ?? "3 / 2").split("/").map((part) => Number(part.trim()))
      return w ? w / h : 1.5
    })()
    let raf = 0
    if (phase === "start") {
      void root.current?.offsetWidth
      raf = window.requestAnimationFrame(() => {
        setBox(fitBox(ratio))
        setPhase("open")
      })
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
    }
    const onResize = () => {
      if (phase === "open") setBox(fitBox(ratio))
    }
    const body = document.body
    const previous = { overflow: body.style.overflow, padding: body.style.paddingRight }
    const gutter = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = "hidden"
    if (gutter > 0) body.style.paddingRight = `${gutter}px`
    window.addEventListener("keydown", onKey)
    window.addEventListener("resize", onResize)
    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("resize", onResize)
      body.style.overflow = previous.overflow
      body.style.paddingRight = previous.padding
    }
  }, [phase, current, photos, close])

  useEffect(() => () => window.clearTimeout(closing.current), [])

  const dataTone = tone === "auto" ? undefined : tone

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-restaurant-005" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="restaurant-005" data-tone={dataTone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
            </div>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="grid">
            {columns.map((column, columnIndex) => (
              <div key={columnIndex} data-part="column">
                {column.map(({ photo, index }) => (
                  <button
                    key={index}
                    ref={(element) => {
                      frames.current[index] = element
                    }}
                    type="button"
                    data-part="frame"
                    data-hidden={phase !== "closed" && current === index}
                    style={{ ["--vibeui-restaurant-005-aspect" as string]: photo.aspect ?? "3 / 2" }}
                    aria-label={photo.caption ?? photo.alt ?? openLabel}
                    onClick={() => open(index)}
                  >
                    {photo.src ? <img src={photo.src} alt={photo.alt ?? ""} loading="lazy" /> : null}
                    {photo.caption ? <span data-part="caption">{photo.caption}</span> : null}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      {phase !== "closed" && box && current !== null
        ? createPortal(
            <div data-vibeui-block="restaurant-005" data-part="layer" data-phase={phase} data-tone={dataTone} style={palette} role="dialog" aria-modal="true" aria-label={photos[current].caption ?? photoLabel}>
              <div data-part="backdrop" onClick={close} />
              <div data-part="flyer" style={{ top: box.top, left: box.left, width: box.width, height: box.height }}>
                <img src={photos[current].src} alt={photos[current].alt ?? ""} />
              </div>
              {photos[current].caption ? <p data-part="label">{photos[current].caption}</p> : null}
              <button type="button" data-part="close" aria-label={closeLabel} onClick={close} autoFocus>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              </button>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
