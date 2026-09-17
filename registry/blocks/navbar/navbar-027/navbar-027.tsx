"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Navbar027Link = { label: string; href: string }

export type Navbar027Props = {
  /** Монограмма: две буквы, между ними снежинка. */
  initials?: readonly [string, string]
  names?: string
  brandHref?: string
  links?: readonly Navbar027Link[]
  actionLabel?: string
  actionHref?: string
  /** Путь к треку; пусто — кнопки музыки нет. */
  music?: string
  musicLabel?: string
  playingLabel?: string
  /** Кнопка «снег»: ставит data-vibeui-snow на <html> и шлёт событие vibeui-snow. */
  snowToggle?: boolean
  snowLabel?: string
  placement?: "fixed" | "static"
  spy?: boolean
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Шапка зимней свадьбы: тонкая полоса, по нижнему краю гирлянда из
// лампочек на провисающем проводе (редкое тёплое мерцание), слева
// монограмма «В ❄ Д» серебром и имена курсивом, по центру разделы
// капителями, справа выключатель снега, музыка и «Ответить». До прокрутки
// прозрачна над фото, при прокрутке ложится на стекло с инеем.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Marck+Script&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-027"]){
--vibeui-navbar-027-bg:light-dark(rgb(242 238 230 / .88),rgb(11 18 32 / .78));
--vibeui-navbar-027-fg:light-dark(#1c2740,#f2eee6);
--vibeui-navbar-027-muted:light-dark(#5b6880,#9fb0c8);
--vibeui-navbar-027-line:light-dark(rgb(28 39 64 / .18),rgb(159 176 200 / .28));
--vibeui-navbar-027-accent:#f2b64f;
--vibeui-navbar-027-silver:#9fb0c8;
--vibeui-navbar-027-fire:#ff9a3c;
--vibeui-navbar-027-on-accent:#0b1220;
--vibeui-navbar-027-display:"Cormorant Garamond",Georgia,serif;
--vibeui-navbar-027-script:"Marck Script","Segoe Script",cursive;
--vibeui-navbar-027-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-027"]{color-scheme:dark}
:where([data-vibeui-block="navbar-027"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-027"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-027"]{box-sizing:border-box;position:relative;display:block;color:var(--vibeui-navbar-027-fg);font-family:var(--vibeui-navbar-027-font);font-size:1rem;line-height:1.3}
[data-vibeui-block="navbar-027"] *{box-sizing:border-box}
[data-vibeui-block="navbar-027"][data-placement="fixed"]{position:fixed;top:0;left:0;right:0;z-index:40}
[data-vibeui-block="navbar-027"][data-placement="fixed"]:not([data-scrolled="true"]):not([data-open="true"]){--vibeui-navbar-027-fg:#f2eee6;--vibeui-navbar-027-muted:rgb(242 238 230 / .75);--vibeui-navbar-027-line:rgb(242 238 230 / .3);text-shadow:0 1px 14px rgb(11 18 32 / .6)}
[data-vibeui-block="navbar-027"] a{color:inherit;text-decoration:none}
[data-vibeui-block="navbar-027"] a:focus-visible,[data-vibeui-block="navbar-027"] button:focus-visible{outline:2px solid var(--vibeui-navbar-027-accent);outline-offset:3px;border-radius:.5rem}
[data-vibeui-block="navbar-027"] [data-part="veil"]{position:absolute;inset:0;z-index:-1;background:var(--vibeui-navbar-027-bg);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);border-bottom:1px solid var(--vibeui-navbar-027-line);opacity:0;transition:opacity .35s}
[data-vibeui-block="navbar-027"][data-placement="static"] [data-part="veil"],[data-vibeui-block="navbar-027"][data-scrolled="true"] [data-part="veil"],[data-vibeui-block="navbar-027"][data-open="true"] [data-part="veil"]{opacity:1}
[data-vibeui-block="navbar-027"] [data-part="garland"]{position:absolute;left:0;right:0;bottom:-.9rem;height:1.4rem;pointer-events:none;overflow:visible;transition:opacity .4s,transform .4s}
[data-vibeui-block="navbar-027"][data-scrolled="true"] [data-part="garland"]{opacity:0;transform:translateY(-.4rem)}
[data-vibeui-block="navbar-027"] [data-part="garland"] svg{display:block;width:100%;height:100%}
[data-vibeui-block="navbar-027"] [data-part="garland"] svg+svg{position:absolute;inset:0}
[data-vibeui-block="navbar-027"] [data-part="garland"] path{fill:none;stroke:rgb(159 176 200 / .45);stroke-width:1;vector-effect:non-scaling-stroke}
[data-vibeui-block="navbar-027"] [data-part="garland"] circle{fill:var(--vibeui-navbar-027-accent);filter:drop-shadow(0 0 3px var(--vibeui-navbar-027-accent));animation:vibeui-navbar-027-twinkle 4s ease-in-out infinite}
[data-vibeui-block="navbar-027"] [data-part="garland"] circle:nth-child(3n){animation-delay:-1.3s;fill:var(--vibeui-navbar-027-fire)}
[data-vibeui-block="navbar-027"] [data-part="garland"] circle:nth-child(3n+1){animation-delay:-2.6s}
[data-vibeui-block="navbar-027"] [data-part="garland"] circle:nth-child(5n){animation-delay:-.7s;fill:#f2eee6}
@keyframes vibeui-navbar-027-twinkle{0%,100%{opacity:.85}50%{opacity:.35}}
[data-vibeui-block="navbar-027"] [data-part="row"]{position:relative;z-index:1;display:flex;align-items:center;gap:1rem;max-width:80rem;margin:0 auto;padding:.9rem 1.25rem;transition:padding .45s cubic-bezier(.2,.9,.3,1)}
[data-vibeui-block="navbar-027"][data-scrolled="true"] [data-part="row"]{padding:.55rem 1.25rem}
[data-vibeui-block="navbar-027"] [data-part="brand"]{display:flex;align-items:center;gap:.8rem;margin-right:auto;min-width:0}
[data-vibeui-block="navbar-027"] [data-part="mono"]{display:inline-flex;align-items:center;gap:.3rem;font-family:var(--vibeui-navbar-027-display);font-size:1.5rem;font-weight:500;letter-spacing:.08em;line-height:1;color:var(--vibeui-navbar-027-fg)}
[data-vibeui-block="navbar-027"] [data-part="mono"] svg{width:.95rem;height:.95rem;fill:none;stroke:var(--vibeui-navbar-027-silver);stroke-width:1.4;stroke-linecap:round;animation:vibeui-navbar-027-spin 24s linear infinite}
@keyframes vibeui-navbar-027-spin{to{transform:rotate(360deg)}}
[data-vibeui-block="navbar-027"] [data-part="names"]{display:none;font-family:var(--vibeui-navbar-027-script);font-size:1.25rem;line-height:1;color:var(--vibeui-navbar-027-muted);white-space:nowrap;padding-left:.8rem;border-left:1px solid var(--vibeui-navbar-027-line)}
[data-vibeui-block="navbar-027"] [data-part="links"]{display:none;gap:.1rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="navbar-027"] [data-part="link"]{position:relative;display:inline-flex;align-items:center;height:2.3rem;padding:0 .8rem;font-family:var(--vibeui-navbar-027-display);font-size:1.02rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-navbar-027-fg);opacity:.78;transition:opacity .25s,color .25s}
[data-vibeui-block="navbar-027"] [data-part="link"]::after{content:"";position:absolute;left:50%;bottom:.3rem;width:.25rem;height:.25rem;margin-left:-.125rem;border-radius:50%;background:var(--vibeui-navbar-027-accent);box-shadow:0 0 6px var(--vibeui-navbar-027-accent);opacity:0;transform:scale(0);transition:transform .3s cubic-bezier(.2,.9,.3,1),opacity .3s}
[data-vibeui-block="navbar-027"] [data-part="link"]:hover,[data-vibeui-block="navbar-027"] [data-part="link"][aria-current="true"]{opacity:1}
[data-vibeui-block="navbar-027"] [data-part="link"]:hover::after,[data-vibeui-block="navbar-027"] [data-part="link"][aria-current="true"]::after{opacity:1;transform:scale(1)}
[data-vibeui-block="navbar-027"] [data-part="tools"]{display:flex;align-items:center;gap:.5rem}
[data-vibeui-block="navbar-027"] [data-part="pill"]{display:inline-flex;align-items:center;justify-content:center;gap:.45rem;height:2.5rem;min-width:2.5rem;padding:0 .8rem;border:1px solid var(--vibeui-navbar-027-line);border-radius:999px;background:transparent;color:var(--vibeui-navbar-027-muted);font-family:var(--vibeui-navbar-027-script);font-size:1.05rem;line-height:1;cursor:pointer;transition:color .25s,border-color .25s,background .25s}
[data-vibeui-block="navbar-027"] [data-part="pill"]:hover{color:var(--vibeui-navbar-027-fg);border-color:var(--vibeui-navbar-027-fg)}
[data-vibeui-block="navbar-027"] [data-part="pill"][aria-pressed="true"]{color:var(--vibeui-navbar-027-accent);border-color:color-mix(in oklab,var(--vibeui-navbar-027-accent) 55%,transparent);background:color-mix(in oklab,var(--vibeui-navbar-027-accent) 10%,transparent)}
[data-vibeui-block="navbar-027"] [data-part="pill"] svg{width:1rem;height:1rem;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;flex:none}
[data-vibeui-block="navbar-027"] [data-part="pill"][data-snow]{padding:0;width:2.5rem}
[data-vibeui-block="navbar-027"] [data-part="pill"][data-snow][aria-pressed="true"] svg{animation:vibeui-navbar-027-spin 14s linear infinite}
[data-vibeui-block="navbar-027"] [data-part="wave"]{display:inline-flex;align-items:center;gap:2px;height:1rem}
[data-vibeui-block="navbar-027"] [data-part="wave"] i{display:block;width:2px;height:.35rem;border-radius:1px;background:currentColor;transform-origin:center}
[data-vibeui-block="navbar-027"] [data-part="wave"] i:nth-child(2){height:.7rem}
[data-vibeui-block="navbar-027"] [data-part="wave"] i:nth-child(3){height:.5rem}
[data-vibeui-block="navbar-027"] [data-part="wave"] i:nth-child(4){height:.85rem}
[data-vibeui-block="navbar-027"] [data-part="pill"][data-music][aria-pressed="true"] [data-part="wave"] i{animation:vibeui-navbar-027-wave .8s ease-in-out infinite alternate}
[data-vibeui-block="navbar-027"] [data-part="pill"][data-music][aria-pressed="true"] [data-part="wave"] i:nth-child(2){animation-delay:-.2s}
[data-vibeui-block="navbar-027"] [data-part="pill"][data-music][aria-pressed="true"] [data-part="wave"] i:nth-child(3){animation-delay:-.45s}
[data-vibeui-block="navbar-027"] [data-part="pill"][data-music][aria-pressed="true"] [data-part="wave"] i:nth-child(4){animation-delay:-.6s}
@keyframes vibeui-navbar-027-wave{from{transform:scaleY(.3)}to{transform:scaleY(1)}}
[data-vibeui-block="navbar-027"] [data-part="music-label"]{display:none}
[data-vibeui-block="navbar-027"] [data-part="action"]{display:none;align-items:center;gap:.4rem;height:2.5rem;padding:0 1.1rem;border-radius:999px;background:var(--vibeui-navbar-027-accent);color:var(--vibeui-navbar-027-on-accent);font-family:var(--vibeui-navbar-027-display);font-size:1.02rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;text-shadow:none;box-shadow:0 0 22px -4px var(--vibeui-navbar-027-accent);transition:transform .2s,box-shadow .25s}
[data-vibeui-block="navbar-027"] [data-part="action"]:hover{transform:translateY(-1px);box-shadow:0 0 28px -2px var(--vibeui-navbar-027-accent)}
[data-vibeui-block="navbar-027"] [data-part="toggle"]{display:inline-flex;align-items:center;justify-content:center;width:2.5rem;height:2.5rem;border:1px solid var(--vibeui-navbar-027-line);border-radius:999px;background:transparent;color:inherit;cursor:pointer}
[data-vibeui-block="navbar-027"] [data-part="toggle"] svg{width:1.1rem;height:1.1rem;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round}
[data-vibeui-block="navbar-027"] [data-part="sheet"]{display:none;flex-direction:column;gap:.1rem;margin:0;padding:.25rem 1.25rem 1.25rem;list-style:none;background:var(--vibeui-navbar-027-bg);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);border-bottom:1px solid var(--vibeui-navbar-027-line)}
[data-vibeui-block="navbar-027"][data-open="true"] [data-part="sheet"]{display:flex;animation:vibeui-navbar-027-drop .3s cubic-bezier(.2,.9,.3,1) both}
@keyframes vibeui-navbar-027-drop{from{opacity:0;transform:translateY(-.5rem)}}
[data-vibeui-block="navbar-027"] [data-part="sheet"] a{display:block;padding:.65rem 0;border-bottom:1px solid var(--vibeui-navbar-027-line);font-family:var(--vibeui-navbar-027-display);font-size:1.2rem;letter-spacing:.14em;text-transform:uppercase}
[data-vibeui-block="navbar-027"] [data-part="sheet"] [data-part="action"]{display:inline-flex;margin-top:.75rem;align-self:flex-start;border-bottom:0}
@container (min-width:60rem){
[data-vibeui-block="navbar-027"] [data-part="names"]{display:block}
[data-vibeui-block="navbar-027"] [data-part="links"]{display:flex}
[data-vibeui-block="navbar-027"] [data-part="row"] [data-part="action"]{display:inline-flex}
[data-vibeui-block="navbar-027"] [data-part="music-label"]{display:inline}
[data-vibeui-block="navbar-027"] [data-part="toggle"],[data-vibeui-block="navbar-027"] [data-part="sheet"]{display:none!important}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-027"] *{animation:none!important;transition:none!important}}`

const BULBS = 28

function Snowflake() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19M12 2l-2.5 2.5M12 2l2.5 2.5M12 22l-2.5-2.5M12 22l2.5-2.5M2 12l2.5-2.5M2 12l2.5 2.5M22 12l-2.5-2.5M22 12l-2.5 2.5" />
    </svg>
  )
}

/** Шапка зимней свадьбы: гирлянда лампочек по краю, монограмма со снежинкой, разделы капителями, выключатель снега, музыка и «Ответить». */
export function Navbar027({
  initials = ["В", "Д"],
  names = "Валерия и Дмитрий",
  brandHref = "#",
  links = [
    { label: "История", href: "#story" },
    { label: "Вечер", href: "#evening" },
    { label: "Дорога", href: "#place" },
    { label: "Вопросы", href: "#faq" },
  ],
  actionLabel = "Ответить",
  actionHref = "#rsvp",
  music,
  musicLabel = "Наша музыка",
  playingLabel = "Играет",
  snowToggle = true,
  snowLabel = "Снег",
  placement = "fixed",
  spy = true,
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Navbar027Props) {
  const audio = useRef<HTMLAudioElement>(null)
  const [active, setActive] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [snowing, setSnowing] = useState(true)
  const palette = {
    ...(accent ? { "--vibeui-navbar-027-accent": accent } : null),
    ...(background ? { "--vibeui-navbar-027-bg": background } : null),
    ...style,
  } as CSSProperties

  useEffect(() => {
    if (placement === "static") return
    const onScroll = () => setScrolled(window.scrollY > 40)
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
    node.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }

  function toggleSnow() {
    const next = !snowing
    setSnowing(next)
    if (next) delete document.documentElement.dataset.vibeuiSnow
    else document.documentElement.dataset.vibeuiSnow = "off"
    window.dispatchEvent(new Event("vibeui-snow"))
  }

  const action = actionLabel ? (
    <a data-part="action" href={actionHref} onClick={() => setOpen(false)}>
      {actionLabel}
    </a>
  ) : null

  // Гирлянда: провод провисает дугами между точками крепления, лампочки в нижних точках дуг.
  const segments = Array.from({ length: BULBS }, (_, index) => index)
  const step = 1000 / BULBS

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-027" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-027" data-tone={tone === "auto" ? undefined : tone} data-placement={placement} data-scrolled={scrolled ? "true" : undefined} data-open={open ? "true" : undefined} className={className} style={palette}>
        <span data-part="veil" aria-hidden="true" />
        <span data-part="garland" aria-hidden="true">
          <svg viewBox="0 0 1000 20" preserveAspectRatio="none">
            <path d={`M0 2 ${segments.map((index) => `Q${(index * step + step / 2).toFixed(1)} 14 ${((index + 1) * step).toFixed(1)} 2`).join(" ")}`} />
          </svg>
          <svg viewBox="0 0 1000 20" preserveAspectRatio="none">
            {segments.map((index) => (
              <circle key={index} cx={(index * step + step / 2).toFixed(1)} cy={9.5} r={2.4} />
            ))}
          </svg>
        </span>
        <div data-part="row">
          <a data-part="brand" href={brandHref} aria-label={names}>
            <span data-part="mono">
              {initials[0]}
              <Snowflake />
              {initials[1]}
            </span>
            <span data-part="names">{names}</span>
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
          <div data-part="tools">
            {snowToggle ? (
              <button type="button" data-part="pill" data-snow="" aria-pressed={snowing} aria-label={snowLabel} title={snowLabel} onClick={toggleSnow}>
                <Snowflake />
              </button>
            ) : null}
            {music ? (
              <>
                <audio ref={audio} src={music} loop preload="none" onEnded={() => setPlaying(false)} />
                <button type="button" data-part="pill" data-music="" aria-pressed={playing} aria-label={musicLabel} title={musicLabel} onClick={toggleMusic}>
                  <span data-part="wave" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                  <span data-part="music-label">{playing ? playingLabel : musicLabel}</span>
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
