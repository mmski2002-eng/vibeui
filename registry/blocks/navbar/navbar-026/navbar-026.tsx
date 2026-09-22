"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Navbar026Link = {
  label: string
  /** Якорь секции: «#route». По нему считается активный раздел. */
  href: string
}

export type Navbar026Props = {
  /** Имена рукописным: «Соня & Тимур». */
  names?: string
  brandHref?: string
  /** Коды аэропортов: откуда и куда. */
  from?: string
  to?: string
  /** Дата вылета в ISO — под кодами считаются дни до неё. */
  date?: string
  /** Подпись счётчика: «до вылета». */
  daysCaption?: string
  daysLabels?: readonly [string, string, string, string]
  links?: readonly Navbar026Link[]
  actionLabel?: string
  actionHref?: string
  /** Путь к треку. Пусто — кнопки музыки нет. По умолчанию выключено. */
  music?: string
  musicLabel?: string
  playingLabel?: string
  placement?: "fixed" | "static"
  spy?: boolean
  /** aria кнопки меню. */
  menuLabel?: string
  closeLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Шапка как верх посадочного талона: слева код рейса «SVO → HAV» с
// самолётиком и счётчик «до вылета», рядом имена рукописным; по центру
// разделы узким капсом; справа капсула музыки со звуковыми линиями и
// коралловая «Check-in». Нижний край — линия отрыва с перфорацией. При
// прокрутке полоса ужимается и ложится на бумажное стекло; до прокрутки
// (fixed, над фото первого экрана) текст кремовый с тенью.
const FONTS = "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Lobster&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-026"]){
--vibeui-navbar-026-bg:light-dark(rgb(255 255 255 / .9),rgb(26 26 26 / .9));
--vibeui-navbar-026-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-026-muted:light-dark(#5b6f78,#a3a3a3);
--vibeui-navbar-026-line:light-dark(#e3d7bf,#2e2e2e);
--vibeui-navbar-026-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-026-sea:#2aa7a0;
--vibeui-navbar-026-sun:#f2c14e;
--vibeui-navbar-026-on-accent:oklch(from var(--vibeui-navbar-026-accent) clamp(0,(0.72 - l) * 100,1) 0 0);
--vibeui-navbar-026-display:"Oswald","Arial Narrow",Impact,sans-serif;
--vibeui-navbar-026-script:"Lobster","Brush Script MT",cursive;
--vibeui-navbar-026-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-026"]{color-scheme:dark}
:where([data-vibeui-block="navbar-026"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="navbar-026"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="navbar-026"]{box-sizing:border-box;position:relative;display:block;color:var(--vibeui-navbar-026-fg);font-family:var(--vibeui-navbar-026-font);font-size:1rem;line-height:1.3}
[data-vibeui-block="navbar-026"] *{box-sizing:border-box}
[data-vibeui-block="navbar-026"] [data-part="action"]{display:none}
[data-vibeui-block="navbar-026"] [data-part="sheet"] [data-part="action"]{margin-top:.75rem;align-self:flex-start}
[data-vibeui-block="navbar-026"][data-placement="fixed"]{position:fixed;top:0;left:0;right:0;z-index:40}
[data-vibeui-block="navbar-026"][data-placement="fixed"]:not([data-scrolled="true"]):not([data-open="true"]){--vibeui-navbar-026-fg:#fffaf0!important;--vibeui-navbar-026-muted:rgb(255 250 240 / .78);--vibeui-navbar-026-line:rgb(255 250 240 / .4);text-shadow:0 1px 12px rgb(18 58 75 / .45)}
[data-vibeui-block="navbar-026"] a{color:inherit;text-decoration:none}
[data-vibeui-block="navbar-026"] button:focus-visible{outline:2px solid var(--vibeui-navbar-026-accent);outline-offset:3px;border-radius:.5rem}
[data-vibeui-block="navbar-026"] [data-part="veil"]{position:absolute;inset:0;z-index:-1;background:var(--vibeui-navbar-026-bg);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);opacity:0;transition:opacity .35s}
[data-vibeui-block="navbar-026"] [data-part="veil"]::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background:radial-gradient(circle,var(--vibeui-navbar-026-line) 0 1.5px,transparent 2px) 0 0/10px 2px repeat-x}
[data-vibeui-block="navbar-026"][data-placement="static"] [data-part="veil"],[data-vibeui-block="navbar-026"][data-scrolled="true"] [data-part="veil"],[data-vibeui-block="navbar-026"][data-open="true"] [data-part="veil"]{opacity:1}
[data-vibeui-block="navbar-026"] [data-part="row"]{position:relative;z-index:1;display:flex;align-items:center;gap:1rem;max-width:80rem;margin:0 auto;padding:.9rem 1.25rem;transition:padding .45s cubic-bezier(.2,.9,.3,1)}
[data-vibeui-block="navbar-026"][data-scrolled="true"] [data-part="row"]{padding:.5rem 1.25rem}
[data-vibeui-block="navbar-026"] [data-part="brand"]{display:flex;align-items:center;gap:.9rem;margin-right:auto;min-width:0}
[data-vibeui-block="navbar-026"] [data-part="flight"]{display:grid;gap:.1rem}
[data-vibeui-block="navbar-026"] [data-part="codes"]{display:inline-flex;align-items:center;gap:.4rem;font-family:var(--vibeui-navbar-026-display);font-size:1.25rem;font-weight:600;letter-spacing:.08em;line-height:1;text-transform:uppercase;color:var(--vibeui-navbar-026-fg)}
[data-vibeui-block="navbar-026"] [data-part="codes"] svg{width:1.05rem;height:1.05rem;fill:var(--vibeui-navbar-026-accent)}
[data-vibeui-block="navbar-026"] [data-part="days"]{font-size:.62rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-navbar-026-muted);white-space:nowrap;font-variant-numeric:tabular-nums;max-height:1.2rem;overflow:hidden;transition:max-height .4s cubic-bezier(.2,.9,.3,1),opacity .3s}
[data-vibeui-block="navbar-026"] [data-part="days"] b{color:var(--vibeui-navbar-026-sea)}
[data-vibeui-block="navbar-026"][data-scrolled="true"] [data-part="days"]{max-height:0;opacity:0}
[data-vibeui-block="navbar-026"] [data-part="names"]{display:none;font-family:var(--vibeui-navbar-026-script);font-size:1.35rem;line-height:1;color:var(--vibeui-navbar-026-accent);white-space:nowrap;padding-left:.9rem;border-left:1px dashed var(--vibeui-navbar-026-line)}
[data-vibeui-block="navbar-026"] [data-part="links"]{display:none;gap:.1rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="navbar-026"] [data-part="link"]{position:relative;display:inline-flex;align-items:center;height:2.3rem;padding:0 .75rem;font-family:var(--vibeui-navbar-026-display);font-size:.9rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-navbar-026-fg);opacity:.8;transition:opacity .25s,color .25s}
[data-vibeui-block="navbar-026"] [data-part="link"]::after{content:"";position:absolute;left:.75rem;right:.75rem;bottom:.35rem;height:2px;background:var(--vibeui-navbar-026-sea);transform:scaleX(0);transform-origin:left;transition:transform .3s cubic-bezier(.2,.9,.3,1)}
[data-vibeui-block="navbar-026"] [data-part="link"]:hover,[data-vibeui-block="navbar-026"] [data-part="link"][aria-current="true"]{opacity:1;color:var(--vibeui-navbar-026-sea)}
[data-vibeui-block="navbar-026"] [data-part="link"]:hover::after,[data-vibeui-block="navbar-026"] [data-part="link"][aria-current="true"]::after{transform:scaleX(1)}
[data-vibeui-block="navbar-026"] [data-part="tools"]{display:flex;align-items:center;gap:.5rem}
[data-vibeui-block="navbar-026"] [data-part="music"]{display:inline-flex;align-items:center;gap:.5rem;height:2.5rem;padding:0 .9rem 0 .75rem;border:1px solid var(--vibeui-navbar-026-line);border-radius:999px;background:transparent;color:var(--vibeui-navbar-026-muted);font-family:var(--vibeui-navbar-026-script);font-size:1rem;line-height:1;cursor:pointer;transition:color .25s,border-color .25s,background .25s}
[data-vibeui-block="navbar-026"] [data-part="music"]:hover{color:var(--vibeui-navbar-026-fg);border-color:var(--vibeui-navbar-026-fg)}
[data-vibeui-block="navbar-026"] [data-part="music"][aria-pressed="true"]{color:var(--vibeui-navbar-026-sea);border-color:color-mix(in oklab,var(--vibeui-navbar-026-sea) 55%,transparent);background:color-mix(in oklab,var(--vibeui-navbar-026-sea) 9%,transparent)}
[data-vibeui-block="navbar-026"] [data-part="wave"]{display:inline-flex;align-items:center;gap:2px;height:1rem}
[data-vibeui-block="navbar-026"] [data-part="wave"] i{display:block;width:2px;height:.35rem;border-radius:1px;background:currentColor;transform-origin:center}
[data-vibeui-block="navbar-026"] [data-part="wave"] i:nth-child(2){height:.7rem}
[data-vibeui-block="navbar-026"] [data-part="wave"] i:nth-child(3){height:.5rem}
[data-vibeui-block="navbar-026"] [data-part="wave"] i:nth-child(4){height:.85rem}
[data-vibeui-block="navbar-026"] [data-part="music"][aria-pressed="true"] [data-part="wave"] i{animation:vibeui-navbar-026-wave .7s ease-in-out infinite alternate}
[data-vibeui-block="navbar-026"] [data-part="music"][aria-pressed="true"] [data-part="wave"] i:nth-child(2){animation-delay:-.2s}
[data-vibeui-block="navbar-026"] [data-part="music"][aria-pressed="true"] [data-part="wave"] i:nth-child(3){animation-delay:-.45s}
[data-vibeui-block="navbar-026"] [data-part="music"][aria-pressed="true"] [data-part="wave"] i:nth-child(4){animation-delay:-.6s}
@keyframes vibeui-navbar-026-wave{from{transform:scaleY(.3)}to{transform:scaleY(1)}}
[data-vibeui-block="navbar-026"] [data-part="music-label"]{display:none}
[data-vibeui-block="navbar-026"] [data-part="toggle"]{display:inline-flex;align-items:center;justify-content:center;width:2.5rem;height:2.5rem;border:1px solid var(--vibeui-navbar-026-line);border-radius:.5rem;background:transparent;color:inherit;cursor:pointer}
[data-vibeui-block="navbar-026"] [data-part="toggle"] svg{width:1.1rem;height:1.1rem;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round}
[data-vibeui-block="navbar-026"] [data-part="sheet"]{display:none;flex-direction:column;gap:.1rem;margin:0;padding:.25rem 1.25rem 1.25rem;list-style:none;background:var(--vibeui-navbar-026-bg);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-bottom:2px dashed var(--vibeui-navbar-026-line)}
[data-vibeui-block="navbar-026"][data-open="true"] [data-part="sheet"]{display:flex;animation:vibeui-navbar-026-drop .3s cubic-bezier(.2,.9,.3,1) both}
@keyframes vibeui-navbar-026-drop{from{opacity:0;transform:translateY(-.5rem)}}
[data-vibeui-block="navbar-026"] [data-part="sheet"] a{display:block;padding:.6rem 0;border-bottom:1px solid var(--vibeui-navbar-026-line);font-family:var(--vibeui-navbar-026-display);font-size:1.1rem;letter-spacing:.12em;text-transform:uppercase}
@container (min-width:60rem){
[data-vibeui-block="navbar-026"] [data-part="names"]{display:block}
[data-vibeui-block="navbar-026"] [data-part="links"]{display:flex}
[data-vibeui-block="navbar-026"] [data-part="music-label"]{display:inline}
[data-vibeui-block="navbar-026"] [data-part="toggle"],[data-vibeui-block="navbar-026"] [data-part="sheet"]{display:none!important}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-026"] *{animation:none!important;transition:none!important}}`

const DAY = 86400000

function plural(count: number, labels: readonly [string, string, string, string]): string {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return labels[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return labels[1]
  return labels[2]
}

/** Шапка свадьбы-путешествия как посадочный талон: код рейса, счётчик до вылета, имена, разделы, музыка и «Check-in». */
export function Navbar026({
  names = "Соня & Тимур",
  brandHref = "#",
  from = "SVO",
  to = "HAV",
  date = "2027-02-12T09:40:00+03:00",
  daysCaption = "до вылета",
  daysLabels = ["день", "дня", "дней", "сегодня"],
  links = [
    { label: "Маршрут", href: "#route" },
    { label: "Три дня", href: "#days" },
    { label: "Дорога", href: "#travel" },
    { label: "Вопросы", href: "#faq" },
  ],
  actionLabel = "Check-in",
  actionHref = "#checkin",
  music,
  menuLabel = "Меню",
  closeLabel = "Закрыть меню",
  musicLabel = "Сон-кубано",
  playingLabel = "Играет",
  placement = "fixed",
  spy = true,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Navbar026Props) {
  const audio = useRef<HTMLAudioElement>(null)
  const [active, setActive] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [days, setDays] = useState<number | null>(null)
  const palette = {
    ...(accent ? { "--vibeui-navbar-026-accent": accent } : null),
    ...(ink ? { "--vibeui-navbar-026-fg": ink } : null),
    ...(background ? { "--vibeui-navbar-026-bg": background } : null),
    ...style,
  } as CSSProperties

  useEffect(() => {
    if (placement === "static") return
    const onScroll = () => setScrolled(window.scrollY > 40)
    // Первое чтение — из кадра, а не из тела эффекта.
    const frame = requestAnimationFrame(onScroll)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
    }
  }, [placement])

  useEffect(() => {
    const target = Date.parse(date)
    if (Number.isNaN(target)) return
    const tick = () => setDays(Math.floor((target - Date.now()) / DAY))
    const frame = requestAnimationFrame(tick)
    const timer = window.setInterval(tick, 60_000)
    return () => {
      cancelAnimationFrame(frame)
      window.clearInterval(timer)
    }
  }, [date])

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

  const action = actionLabel ? (
    <Button016
      data-part="action"
      onClick={() => setOpen(false)}
      label={actionLabel}
      href={actionHref}
      external={false}
      size="sm"
      tone="accent"
      accent={accent}
    />
  ) : null

  const countdown = days === null || days < 0 ? null : days === 0 ? daysLabels[3] : `${days} ${plural(days, daysLabels)}`

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-026" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-026" data-tone={tone === "auto" ? undefined : tone} data-placement={placement} data-scrolled={scrolled ? "true" : undefined} data-open={open ? "true" : undefined} className={className} style={palette}>
        <span data-part="veil" aria-hidden="true" />
        <div data-part="row">
          <a data-part="brand" href={brandHref} aria-label={`${names}, ${from} → ${to}`}>
            <span data-part="flight">
              <span data-part="codes">
                {from}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 12.5c0 .6-.5 1-1.1 1L13 12.9 9.5 20H7.6l1.7-7.4-4.6-.6-1.7 2H1.6l1.2-3.5L1.6 7.1H3l1.7 2 4.6-.6L7.6 1h1.9L13 8.1l6.9-.6c.6 0 1.1.4 1.1 1v4z" />
                </svg>
                {to}
              </span>
              <span data-part="days" aria-live="off">
                {countdown ? (
                  <>
                    {daysCaption} <b>{countdown}</b>
                  </>
                ) : null}
              </span>
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
            {music ? (
              <>
                <audio ref={audio} src={music} loop preload="none" onEnded={() => setPlaying(false)} />
                <button type="button" data-part="music" aria-pressed={playing} aria-label={musicLabel} title={musicLabel} onClick={toggleMusic}>
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
            <button type="button" data-part="toggle" aria-expanded={open} aria-label={open ? closeLabel : menuLabel} onClick={() => setOpen((value) => !value)}>
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
