"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Navbar025Link = {
  label: string
  /** Якорь секции: «#story». По нему считается активный раздел. */
  href: string
}

export type Navbar025Props = {
  /** Две буквы монограммы: «В & А». */
  monogram?: string
  /** Подпись под монограммой: дата. */
  caption?: string
  brandHref?: string
  links?: readonly Navbar025Link[]
  actionLabel?: string
  actionHref?: string
  /** Путь к треку. Пусто — кнопки музыки нет. По умолчанию выключено. */
  music?: string
  musicLabel?: string
  /** fixed — поверх первого экрана, белеет при прокрутке; static — в потоке. */
  placement?: "fixed" | "static"
  spy?: boolean
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Шапка приглашения: монограмма пары в круге с датой под ней, разделы
// тонким serif'ом, справа значок музыки (по умолчанию выключено, играет
// только по клику) и капсула «Подтвердить». Поверх первого экрана шапка
// прозрачная, после прокрутки — кремовая с размытием. На узкой ширине
// разделы прячутся за кнопку «Меню» и раскрываются списком.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-025"]){
--vibeui-navbar-025-bg:light-dark(rgb(246 241 232 / .92),rgb(23 19 26 / .9));
--vibeui-navbar-025-fg:light-dark(#2b1a24,#f3ebe4);
--vibeui-navbar-025-muted:light-dark(#7a6a70,#b3a5aa);
--vibeui-navbar-025-line:light-dark(#e2d8ca,#372b31);
--vibeui-navbar-025-accent:#b8552f;
--vibeui-navbar-025-plum:light-dark(#4a1f36,#e9c7d6);
--vibeui-navbar-025-on-accent:#fff7ef;
--vibeui-navbar-025-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-navbar-025-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-025"]{color-scheme:dark}
:where([data-vibeui-block="navbar-025"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-025"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-025"]{box-sizing:border-box;display:block;color:var(--vibeui-navbar-025-fg);font-family:var(--vibeui-navbar-025-font);font-size:1rem;line-height:1.3}
[data-vibeui-block="navbar-025"] *{box-sizing:border-box}
[data-vibeui-block="navbar-025"][data-placement="fixed"]{position:fixed;top:0;left:0;right:0;z-index:40}
[data-vibeui-block="navbar-025"] a{color:inherit;text-decoration:none}
[data-vibeui-block="navbar-025"] a:focus-visible,[data-vibeui-block="navbar-025"] button:focus-visible{outline:2px solid var(--vibeui-navbar-025-accent);outline-offset:3px;border-radius:999px}
[data-vibeui-block="navbar-025"] [data-part="bar"]{position:relative;display:flex;align-items:center;gap:1rem;max-width:80rem;margin:0 auto;padding:.9rem 1.25rem;transition:background .35s,box-shadow .35s}
[data-vibeui-block="navbar-025"] [data-part="veil"]{position:absolute;inset:0;z-index:-1;background:var(--vibeui-navbar-025-bg);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-bottom:1px solid var(--vibeui-navbar-025-line);opacity:0;transition:opacity .35s}
[data-vibeui-block="navbar-025"][data-placement="static"] [data-part="veil"],[data-vibeui-block="navbar-025"][data-scrolled="true"] [data-part="veil"],[data-vibeui-block="navbar-025"][data-open="true"] [data-part="veil"]{opacity:1}
[data-vibeui-block="navbar-025"] [data-part="brand"]{display:flex;align-items:center;gap:.7rem;margin-right:auto}
[data-vibeui-block="navbar-025"] [data-part="seal"]{display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;width:2.9rem;height:2.9rem;border:1px solid var(--vibeui-navbar-025-plum);border-radius:50%;font-family:var(--vibeui-navbar-025-display);font-size:1.15rem;font-weight:500;font-style:italic;letter-spacing:.02em;color:var(--vibeui-navbar-025-plum);transition:transform .4s cubic-bezier(.2,.9,.3,1.3)}
[data-vibeui-block="navbar-025"] [data-part="brand"]:hover [data-part="seal"]{transform:rotate(-8deg)}
[data-vibeui-block="navbar-025"] [data-part="seal"] em{color:var(--vibeui-navbar-025-accent);font-style:italic;margin:0 .1em}
[data-vibeui-block="navbar-025"] [data-part="caption"]{display:none;font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-navbar-025-muted)}
[data-vibeui-block="navbar-025"] [data-part="links"]{display:none;gap:.25rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="navbar-025"] [data-part="link"]{position:relative;display:inline-flex;align-items:center;height:2.4rem;padding:0 .8rem;border-radius:999px;font-family:var(--vibeui-navbar-025-display);font-size:1.15rem;font-weight:500;letter-spacing:.01em;color:var(--vibeui-navbar-025-fg);transition:color .25s}
[data-vibeui-block="navbar-025"] [data-part="link"]::after{content:"";position:absolute;left:.8rem;right:.8rem;bottom:.35rem;height:1px;background:var(--vibeui-navbar-025-accent);transform:scaleX(0);transform-origin:left;transition:transform .3s cubic-bezier(.2,.9,.3,1)}
[data-vibeui-block="navbar-025"] [data-part="link"]:hover::after,[data-vibeui-block="navbar-025"] [data-part="link"][aria-current="true"]::after{transform:scaleX(1)}
[data-vibeui-block="navbar-025"] [data-part="link"][aria-current="true"]{color:var(--vibeui-navbar-025-accent)}
[data-vibeui-block="navbar-025"] [data-part="music"]{display:inline-flex;align-items:center;gap:.45rem;height:2.4rem;padding:0 .7rem;border:1px solid var(--vibeui-navbar-025-line);border-radius:999px;background:transparent;color:var(--vibeui-navbar-025-muted);font:inherit;font-size:.78rem;cursor:pointer;transition:color .25s,border-color .25s}
[data-vibeui-block="navbar-025"] [data-part="music"]:hover,[data-vibeui-block="navbar-025"] [data-part="music"][aria-pressed="true"]{color:var(--vibeui-navbar-025-accent);border-color:var(--vibeui-navbar-025-accent)}
[data-vibeui-block="navbar-025"] [data-part="music-label"]{display:none}
[data-vibeui-block="navbar-025"] [data-part="bars"]{display:inline-flex;align-items:flex-end;gap:3px;width:1.1rem;height:.9rem}
[data-vibeui-block="navbar-025"] [data-part="bars"] i{display:block;width:3px;height:30%;border-radius:2px;background:currentColor;transform-origin:bottom}
[data-vibeui-block="navbar-025"] [data-part="music"][aria-pressed="true"] [data-part="bars"] i{animation:vibeui-navbar-025-eq .9s ease-in-out infinite alternate}
[data-vibeui-block="navbar-025"] [data-part="bars"] i:nth-child(2){animation-delay:-.3s;height:60%}
[data-vibeui-block="navbar-025"] [data-part="bars"] i:nth-child(3){animation-delay:-.6s;height:45%}
@keyframes vibeui-navbar-025-eq{from{transform:scaleY(.35)}to{transform:scaleY(1)}}
[data-vibeui-block="navbar-025"] [data-part="action"]{display:none;align-items:center;height:2.5rem;padding:0 1.1rem;border-radius:999px;background:var(--vibeui-navbar-025-accent);color:var(--vibeui-navbar-025-on-accent);font-weight:600;font-size:.88rem;white-space:nowrap;transition:transform .2s,background .25s}
[data-vibeui-block="navbar-025"] [data-part="action"]:hover{transform:translateY(-1px);background:color-mix(in oklab,var(--vibeui-navbar-025-accent) 88%,#000)}
[data-vibeui-block="navbar-025"] [data-part="toggle"]{display:inline-flex;align-items:center;justify-content:center;width:2.5rem;height:2.5rem;border:1px solid var(--vibeui-navbar-025-line);border-radius:50%;background:transparent;color:inherit;cursor:pointer}
[data-vibeui-block="navbar-025"] [data-part="toggle"] svg{width:1.15rem;height:1.15rem;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round}
[data-vibeui-block="navbar-025"] [data-part="sheet"]{display:none;flex-direction:column;gap:.25rem;margin:0;padding:.5rem 1.25rem 1.25rem;list-style:none;background:var(--vibeui-navbar-025-bg);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-bottom:1px solid var(--vibeui-navbar-025-line)}
[data-vibeui-block="navbar-025"][data-open="true"] [data-part="sheet"]{display:flex;animation:vibeui-navbar-025-drop .3s cubic-bezier(.2,.9,.3,1) both}
@keyframes vibeui-navbar-025-drop{from{opacity:0;transform:translateY(-.5rem)}}
[data-vibeui-block="navbar-025"] [data-part="sheet"] a{display:block;padding:.6rem 0;border-bottom:1px solid var(--vibeui-navbar-025-line);font-family:var(--vibeui-navbar-025-display);font-size:1.35rem;font-weight:500}
[data-vibeui-block="navbar-025"] [data-part="sheet"] [data-part="action"]{display:inline-flex;margin-top:.75rem;align-self:flex-start}
@container (min-width:52rem){
[data-vibeui-block="navbar-025"] [data-part="caption"]{display:block}
[data-vibeui-block="navbar-025"] [data-part="links"]{display:flex}
[data-vibeui-block="navbar-025"] [data-part="bar"] [data-part="action"]{display:inline-flex}
[data-vibeui-block="navbar-025"] [data-part="toggle"],[data-vibeui-block="navbar-025"] [data-part="sheet"]{display:none!important}
[data-vibeui-block="navbar-025"] [data-part="music-label"]{display:inline}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-025"] *{animation:none!important;transition:none!important}}`

/** Шапка свадебного приглашения: монограмма пары, разделы, значок музыки и «Подтвердить»; поверх первого экрана прозрачная. */
export function Navbar025({
  monogram = "В & А",
  caption = "5 · 09 · 2027",
  brandHref = "#",
  links = [
    { label: "История", href: "#story" },
    { label: "Программа", href: "#program" },
    { label: "Место", href: "#place" },
    { label: "Вопросы", href: "#faq" },
  ],
  actionLabel = "Подтвердить",
  actionHref = "#rsvp",
  music,
  musicLabel = "Музыка",
  placement = "fixed",
  spy = true,
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Navbar025Props) {
  const audio = useRef<HTMLAudioElement>(null)
  const [active, setActive] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const palette = {
    ...(accent ? { "--vibeui-navbar-025-accent": accent } : null),
    ...(background ? { "--vibeui-navbar-025-bg": background } : null),
    ...style,
  } as CSSProperties

  // Монограмма: амперсанд подкрашивается акцентом, буквы — сливой.
  const [left, right] = monogram.split(/\s*&\s*/)

  useEffect(() => {
    if (placement === "static") return
    const onScroll = () => setScrolled(window.scrollY > 24)
    // Первое чтение — из кадра, а не из тела эффекта: страница могла
    // открыться уже прокрученной (якорь в адресе).
    const frame = requestAnimationFrame(onScroll)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
    }
  }, [placement])

  useEffect(() => {
    if (!spy || placement === "static" || typeof IntersectionObserver === "undefined") return
    const targets = links.map((link) => (link.href.startsWith("#") ? document.querySelector(link.href) : null)).filter((node): node is Element => node !== null)
    if (targets.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: "-40% 0px -55% 0px" },
    )
    targets.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [links, spy, placement])

  function toggleMusic() {
    const node = audio.current
    if (!node) return
    if (playing) {
      node.pause()
      setPlaying(false)
      return
    }
    // Автовоспроизведение браузеры блокируют — играем только по клику.
    node.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }

  const action = actionLabel ? (
    <a data-part="action" href={actionHref} onClick={() => setOpen(false)}>
      {actionLabel}
    </a>
  ) : null

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-025" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-025" data-tone={tone === "auto" ? undefined : tone} data-placement={placement} data-scrolled={scrolled ? "true" : undefined} data-open={open ? "true" : undefined} className={className} style={palette}>
        <div data-part="bar">
          <span data-part="veil" aria-hidden="true" />
          <a data-part="brand" href={brandHref} aria-label={`${monogram} — ${caption}`}>
            <span data-part="seal" aria-hidden="true">
              {left}
              <em>&amp;</em>
              {right}
            </span>
            <span data-part="caption">{caption}</span>
          </a>
          <ul data-part="links">
            {links.map((link) => (
              <li key={link.label}>
                <a data-part="link" href={link.href} aria-current={active === link.href ? "true" : undefined}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          {music ? (
            <>
              <audio ref={audio} src={music} loop preload="none" onEnded={() => setPlaying(false)} />
              <button type="button" data-part="music" aria-pressed={playing} aria-label={musicLabel} onClick={toggleMusic}>
                <span data-part="bars" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span data-part="music-label">{musicLabel}</span>
              </button>
            </>
          ) : null}
          {action}
          <button type="button" data-part="toggle" aria-expanded={open} aria-label={open ? "Закрыть меню" : "Меню"} onClick={() => setOpen((value) => !value)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
        <ul data-part="sheet">
          {links.map((link) => (
            <li key={link.label}>
              <a href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
          {action ? <li>{action}</li> : null}
        </ul>
      </header>
    </>
  )
}
