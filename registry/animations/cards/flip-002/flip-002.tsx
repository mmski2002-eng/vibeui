"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react"
import { createPortal } from "react-dom"

export type Flip002Props = {
  /** Лицевое фото карточки. */
  image?: string
  /** Фото на обороте. */
  imageBack?: string
  imageAlt?: string
  eyebrow?: string
  title?: string
  /** Подпись под заголовком на лицевой стороне. */
  hint?: string
  backTitle?: string
  text?: string
  linkLabel?: string
  linkHref?: string
  closeLabel?: string
  /** Своё содержимое панели на обороте вместо text и ссылки. */
  children?: ReactNode
  /** Пропорции карточки: «4 / 5», «3 / 2», «1». */
  aspect?: string
  /** Ширина карточки. */
  width?: string
  /** Во сколько раз окно больше карточки, если влезает в экран. */
  zoom?: number
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

type Box = { top: number; left: number; width: number; height: number }
type Phase = "closed" | "start" | "open" | "closing"

// Карточка, которая переворачивается в модальное окно. По клику копия
// карточки рендерится в портале ровно на её месте (fixed-слой с
// perspective), затем одним движением едет в центр, растёт и делает
// rotateY(180deg). Едет только transform (translate, scale, rotateY):
// раскладка копии считается один раз в размере окна, ничего не
// перерисовывается по кадрам — потому не тормозит даже с большими фото.
// Окно — та же карточка ×zoom; внутри её можно переворачивать дальше.
// Закрытие — те же transform назад. Фокус заперт, Escape закрывает.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="flip-002"]){
--vibeui-flip-002-bg:transparent;
--vibeui-flip-002-card:light-dark(#ffffff,#171a1f);
--vibeui-flip-002-fg:light-dark(#111318,#f4f2ee);
--vibeui-flip-002-muted:light-dark(color-mix(in oklab,#111318 60%,#ffffff),color-mix(in oklab,#f4f2ee 62%,#171a1f));
--vibeui-flip-002-line:light-dark(color-mix(in oklab,#111318 12%,#ffffff),color-mix(in oklab,#f4f2ee 14%,#171a1f));
--vibeui-flip-002-glass:light-dark(rgb(255 255 255 / .62),rgb(23 26 31 / .62));
--vibeui-flip-002-veil:light-dark(rgb(244 242 238 / .7),rgb(10 12 16 / .7));
--vibeui-flip-002-accent:#c2410c;
--vibeui-flip-002-radius:1.75rem;
--vibeui-flip-002-duration:.5s;
--vibeui-flip-002-ease:cubic-bezier(.2,.9,.25,1);
--vibeui-flip-002-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="flip-002"]{color-scheme:dark}
:where([data-vibeui-block="flip-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="flip-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="flip-002"]{box-sizing:border-box;color:var(--vibeui-flip-002-fg);font-family:var(--vibeui-flip-002-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="flip-002"] *{box-sizing:border-box}
[data-vibeui-block="flip-002"][data-part="host"]{display:block;background:var(--vibeui-flip-002-bg);width:var(--vibeui-flip-002-width,18rem);max-width:100%}
[data-vibeui-block="flip-002"] [data-part="card"]{position:relative;display:block;width:100%;aspect-ratio:var(--vibeui-flip-002-aspect,4/5);overflow:hidden;border-radius:var(--vibeui-flip-002-radius);border:1px solid var(--vibeui-flip-002-line);background:var(--vibeui-flip-002-card);cursor:pointer;-webkit-tap-highlight-color:transparent}
[data-vibeui-block="flip-002"] [data-part="card"]:focus-visible{outline:2px solid var(--vibeui-flip-002-accent);outline-offset:3px}
[data-vibeui-block="flip-002"] [data-part="card"][data-hidden="true"]{visibility:hidden}
[data-vibeui-block="flip-002"] [data-part="picture"]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="flip-002"] [data-part="panel"]{position:absolute;left:.75rem;right:.75rem;bottom:.75rem;display:grid;gap:.4rem;padding:1rem;border-radius:1rem;border:1px solid var(--vibeui-flip-002-line);background:var(--vibeui-flip-002-glass);color:var(--vibeui-flip-002-fg);backdrop-filter:blur(16px) saturate(1.5);-webkit-backdrop-filter:blur(16px) saturate(1.5)}
[data-vibeui-block="flip-002"] [data-part="eyebrow"]{margin:0;font-size:.75rem;font-weight:500;color:var(--vibeui-flip-002-muted)}
[data-vibeui-block="flip-002"] [data-part="title"]{margin:0;font-size:1.3rem;font-weight:500;line-height:1.15;letter-spacing:-.01em}
[data-vibeui-block="flip-002"] [data-part="hint"]{margin:0;font-size:.75rem;color:var(--vibeui-flip-002-muted)}
[data-vibeui-block="flip-002"] [data-part="text"]{margin:0;font-size:.8rem;line-height:1.5;color:var(--vibeui-flip-002-muted)}
[data-vibeui-block="flip-002"] [data-part="link"]{display:inline-flex;align-items:center;gap:.4rem;justify-self:start;margin-top:.5rem;height:2.5rem;padding:0 1rem;border-radius:999px;border:1px solid var(--vibeui-flip-002-line);background:var(--vibeui-flip-002-card);color:var(--vibeui-flip-002-fg);font-weight:500;font-size:.8rem;text-decoration:none;transition:background .2s}
[data-vibeui-block="flip-002"] [data-part="link"]:hover{background:var(--vibeui-flip-002-glass)}
[data-vibeui-block="flip-002"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-flip-002-accent);outline-offset:2px}
[data-vibeui-block="flip-002"] [data-part="badge"],[data-vibeui-block="flip-002"] [data-part="close"]{position:absolute;top:1rem;right:1rem;width:2.5rem;height:2.5rem;display:grid;place-items:center;border-radius:50%;border:1px solid var(--vibeui-flip-002-line);background:var(--vibeui-flip-002-glass);color:var(--vibeui-flip-002-fg);backdrop-filter:blur(16px) saturate(1.5);-webkit-backdrop-filter:blur(16px) saturate(1.5)}
[data-vibeui-block="flip-002"] [data-part="close"]{z-index:3;cursor:pointer;font:inherit;transition:background .2s}
[data-vibeui-block="flip-002"] [data-part="close"]:hover{background:var(--vibeui-flip-002-card)}
[data-vibeui-block="flip-002"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-flip-002-accent);outline-offset:2px}
[data-vibeui-block="flip-002"][data-part="layer"]{position:fixed;inset:0;z-index:60;perspective:1400px}
[data-vibeui-block="flip-002"] [data-part="backdrop"]{position:absolute;inset:0;background:var(--vibeui-flip-002-veil);backdrop-filter:blur(12px) saturate(1.4);-webkit-backdrop-filter:blur(12px) saturate(1.4);opacity:0;transition:opacity .35s ease}
[data-vibeui-block="flip-002"][data-phase="open"] [data-part="backdrop"]{opacity:1}
[data-vibeui-block="flip-002"] [data-part="flyer"]{position:absolute;transform-style:preserve-3d;transform-origin:center;will-change:transform;transition:transform var(--vibeui-flip-002-duration) var(--vibeui-flip-002-ease)}
[data-vibeui-block="flip-002"] [data-part="side"]{position:absolute;inset:0;overflow:hidden;border-radius:var(--vibeui-flip-002-radius);border:1px solid var(--vibeui-flip-002-line);background:var(--vibeui-flip-002-card);backface-visibility:hidden;-webkit-backface-visibility:hidden;transform:translateZ(1px);cursor:pointer;box-shadow:0 24px 48px -24px rgb(0 0 0 / .45)}
[data-vibeui-block="flip-002"] [data-part="side"][data-side="back"]{transform:rotateY(180deg) translateZ(1px)}
[data-vibeui-block="flip-002"] [data-part="side"][data-side="back"] [data-part="panel"]{gap:.5rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="flip-002"] [data-part="flyer"],[data-vibeui-block="flip-002"] [data-part="backdrop"]{transition:none!important}}`

const DURATION = 500
const FOCUSABLE = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])'

function rectOf(element: HTMLElement): Box {
  const rect = element.getBoundingClientRect()
  return { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
}

/** Окно — карточка ×zoom, по центру, но не больше экрана с отступом. */
function targetBox(from: Box, zoom: number): Box {
  const gutter = Math.min(window.innerWidth * 0.06, 32)
  const scale = Math.min(zoom, (window.innerWidth - gutter * 2) / from.width, (window.innerHeight - gutter * 2) / from.height)
  const width = from.width * scale
  const height = from.height * scale
  return { top: (window.innerHeight - height) / 2, left: (window.innerWidth - width) / 2, width, height }
}

/** Transform, ставящий летуна размера to ровно на место from. */
function offsetTransform(from: Box, to: Box): string {
  const dx = from.left + from.width / 2 - (to.left + to.width / 2)
  const dy = from.top + from.height / 2 - (to.top + to.height / 2)
  return `translate(${dx}px, ${dy}px) scale(${from.width / to.width}) rotateY(0deg)`
}

/** Карточка, которая переворачивается в модальное окно: лицевое фото спереди, второе фото и описание на обороте. */
export function Flip002({
  image = "",
  imageBack = "",
  imageAlt = "",
  eyebrow = "Частная коллекция",
  title = "Светлая комната",
  hint = "Нажмите, чтобы открыть историю",
  backTitle = "Спроектирована вокруг тишины",
  text = "Натуральные материалы и выверенные проёмы делают спокойное место для искусства, разговоров и меняющегося света.",
  linkLabel = "Смотреть проект",
  linkHref = "#",
  closeLabel = "Закрыть",
  children,
  aspect = "4 / 5",
  width = "18rem",
  zoom = 1.35,
  tone = "auto",
  accent,
  className,
  style,
}: Flip002Props) {
  const card = useRef<HTMLDivElement>(null)
  const layer = useRef<HTMLDivElement>(null)
  const closing = useRef(0)
  const returnFocus = useRef(false)
  const [phase, setPhase] = useState<Phase>("closed")
  const [side, setSide] = useState<"front" | "back">("front")
  const [from, setFrom] = useState<Box | null>(null)
  const [to, setTo] = useState<Box | null>(null)
  const palette = {
    ...(accent ? { "--vibeui-flip-002-accent": accent } : null),
    "--vibeui-flip-002-aspect": aspect,
    "--vibeui-flip-002-width": width,
    ...style,
  } as CSSProperties
  const dataTone = tone === "auto" ? undefined : tone

  const open = () => {
    if (phase !== "closed" || !card.current) return
    window.clearTimeout(closing.current)
    const start = rectOf(card.current)
    setFrom(start)
    setTo(targetBox(start, zoom))
    setSide("front")
    setPhase("start")
  }

  const close = useCallback(() => {
    if (phase !== "open" || !card.current) return
    setFrom(rectOf(card.current))
    setPhase("closing")
    closing.current = window.setTimeout(() => {
      returnFocus.current = true
      setPhase("closed")
    }, DURATION)
  }, [phase])

  const onCardKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      open()
    }
  }

  // Старт: после reflow и кадра летун получает целевой transform — едет,
  // растёт и переворачивается одним движением. Пока открыто: скролл
  // заперт, Escape закрывает, Tab ходит по кругу, resize перецентрует.
  useEffect(() => {
    if (phase === "closed") return
    let raf = 0
    if (phase === "start") {
      void layer.current?.offsetWidth
      raf = window.requestAnimationFrame(() => {
        setSide("back")
        setPhase("open")
      })
    }
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") close()
      if (event.key === "Tab" && layer.current) {
        const focusable = layer.current.querySelectorAll<HTMLElement>(FOCUSABLE)
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    const onResize = () => {
      if (card.current) {
        const start = rectOf(card.current)
        setFrom(start)
        setTo(targetBox(start, zoom))
      }
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
  }, [phase, close, zoom])

  useEffect(() => {
    if (phase !== "open") return
    const timer = window.setTimeout(() => layer.current?.querySelector<HTMLElement>('[data-side="back"] [data-part="close"]')?.focus(), DURATION)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase === "closed" && returnFocus.current) {
      returnFocus.current = false
      card.current?.focus({ preventScroll: true })
    }
  }, [phase])

  useEffect(() => () => window.clearTimeout(closing.current), [])

  const flyerTransform =
    phase === "open" && from && to ? `translate(0px, 0px) scale(1) rotateY(${side === "back" ? 180 : 0}deg)` : from && to ? offsetTransform(from, to) : undefined

  const front = (
    <>
      {image ? <img data-part="picture" src={image} alt={imageAlt} loading="lazy" /> : null}
      <span data-part="badge" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </span>
      <span data-part="panel">
        {eyebrow ? <span data-part="eyebrow">{eyebrow}</span> : null}
        <span data-part="title">{title}</span>
        {hint ? <span data-part="hint">{hint}</span> : null}
      </span>
    </>
  )

  const closeButton = (
    <button
      type="button"
      data-part="close"
      aria-label={closeLabel}
      onClick={(event) => {
        event.stopPropagation()
        close()
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <path d="M3 3l10 10M13 3L3 13" />
      </svg>
    </button>
  )

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-flip-002" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="flip-002" data-part="host" data-tone={dataTone} className={className} style={palette}>
        <div
          ref={card}
          data-part="card"
          data-hidden={phase !== "closed"}
          role="button"
          tabIndex={0}
          aria-haspopup="dialog"
          aria-expanded={phase === "open"}
          onClick={open}
          onKeyDown={onCardKey}
        >
          {front}
        </div>
      </div>
      {phase !== "closed" && from && to
        ? createPortal(
            <div ref={layer} data-vibeui-block="flip-002" data-part="layer" data-phase={phase} data-tone={dataTone} style={palette} role="dialog" aria-modal="true" aria-label={title}>
              <div data-part="backdrop" onClick={close} />
              <div data-part="flyer" style={{ top: to.top, left: to.left, width: to.width, height: to.height, transform: flyerTransform }}>
                <div data-part="side" data-side="front" inert={side === "back" ? true : undefined} onClick={() => setSide("back")}>
                  {front}
                  {closeButton}
                </div>
                <div data-part="side" data-side="back" inert={side === "front" ? true : undefined} onClick={() => setSide("front")}>
                  {imageBack || image ? <img data-part="picture" src={imageBack || image} alt={imageAlt} /> : null}
                  <div data-part="panel" onClick={(event) => event.stopPropagation()}>
                    <span data-part="title">{backTitle || title}</span>
                    {children ?? (
                      <>
                        {text ? <p data-part="text">{text}</p> : null}
                        {linkLabel ? (
                          <a data-part="link" href={linkHref}>
                            {linkLabel} ↗
                          </a>
                        ) : null}
                      </>
                    )}
                  </div>
                  {closeButton}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
