"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Navbar025Link = {
  label: string
  /** Якорь секции: «#story». По нему считается активный раздел. */
  href: string
}

export type Navbar025Props = {
  /** Монограмма по центру: «В & А». Амперсанд подкрашивается. */
  monogram?: string
  brandHref?: string
  /** Дата слева: «05 · 09 · 2027». */
  caption?: string
  /** Дата свадьбы в ISO — под подписью считаются дни до неё. Пусто — без счётчика. */
  date?: string
  /** Склонение «дней»: подписи для 1, 2–4, 5+ и «сегодня». */
  daysLabels?: readonly [string, string, string, string]
  links?: readonly Navbar025Link[]
  actionLabel?: string
  actionHref?: string
  /** Путь к треку. Пусто — капсулы музыки нет. По умолчанию выключено. */
  music?: string
  musicLabel?: string
  /** Подпись, пока играет: «играет». */
  playingLabel?: string
  /** fixed — поверх страницы, складывается при прокрутке; static — в потоке (превью). */
  placement?: "fixed" | "static"
  spy?: boolean
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Шапка приглашения как верх открытки: два яруса. В первом слева дата и
// живой счётчик «до свадьбы 352 дня», по центру монограмма курсивным
// serif'ом с акцентным амперсандом, справа тихая капсула «Музыка» с четырьмя
// тонкими линиями, которые оживают пока играет (только по клику) и капсула «Подтвердить». Во втором —
// разделы через тонкие точки. При прокрутке ярусы складываются в одну
// одну строку: большая монограмма по центру тает, маленькая проявляется
// слева на месте даты, разделы поднимаются в её ряд — всё на transition. На узкой ширине разделы — за кнопкой «Меню».
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="navbar-025"]){
--vibeui-navbar-025-bg:light-dark(rgb(255 255 255 / .85),rgb(26 26 26 / .85));
--vibeui-navbar-025-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-025-muted:light-dark(#7a6a70,#a3a3a3);
--vibeui-navbar-025-line:light-dark(color-mix(in oklab,var(--vibeui-navbar-025-fg) 12%,transparent),color-mix(in oklab,var(--vibeui-navbar-025-fg) 14%,transparent));
--vibeui-navbar-025-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-navbar-025-plum:var(--vibeui-navbar-025-fg);
--vibeui-navbar-025-on-accent:oklch(from var(--vibeui-navbar-025-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
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
[data-vibeui-block="navbar-025"] [data-part="veil"]{position:absolute;inset:0;z-index:-1;background:var(--vibeui-navbar-025-bg);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);border-bottom:1px solid var(--vibeui-navbar-025-line);opacity:0;transition:opacity .35s}
[data-vibeui-block="navbar-025"]{position:relative}
[data-vibeui-block="navbar-025"][data-placement="static"] [data-part="veil"],[data-vibeui-block="navbar-025"][data-scrolled="true"] [data-part="veil"],[data-vibeui-block="navbar-025"][data-open="true"] [data-part="veil"]{opacity:1}
[data-vibeui-block="navbar-025"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:.9rem 1.25rem .8rem;transition:padding .5s cubic-bezier(.2,.9,.3,1)}
[data-vibeui-block="navbar-025"][data-scrolled="true"] [data-part="shell"]{padding:.5rem 1.25rem .45rem}
[data-vibeui-block="navbar-025"] [data-part="row"]{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;min-height:3rem;pointer-events:none}
[data-vibeui-block="navbar-025"] [data-part="row"] > *{pointer-events:auto}
[data-vibeui-block="navbar-025"] [data-part="date"]{display:grid;gap:.1rem;transition:opacity .4s;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-navbar-025-muted);white-space:nowrap;font-variant-numeric:tabular-nums}
[data-vibeui-block="navbar-025"] [data-part="days"]{font-family:var(--vibeui-navbar-025-display);font-style:italic;font-size:.95rem;letter-spacing:0;text-transform:none;color:var(--vibeui-navbar-025-accent);transition:opacity .35s,max-height .45s cubic-bezier(.2,.9,.3,1);max-height:1.4rem;overflow:hidden}
[data-vibeui-block="navbar-025"][data-scrolled="true"] [data-part="days"]{opacity:0;max-height:0}
[data-vibeui-block="navbar-025"][data-scrolled="true"] [data-part="date"]{opacity:0;pointer-events:none}
[data-vibeui-block="navbar-025"] [data-part="brand"]{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-family:var(--vibeui-navbar-025-display);font-style:italic;font-weight:500;font-size:2rem;line-height:1;letter-spacing:.01em;color:var(--vibeui-navbar-025-plum);white-space:nowrap;transition:opacity .45s ease,transform .55s cubic-bezier(.2,.9,.3,1)}
[data-vibeui-block="navbar-025"][data-scrolled="true"] [data-part="brand"]{opacity:0;transform:translate(-50%,-50%) scale(.9);pointer-events:none}
[data-vibeui-block="navbar-025"] [data-part="brand-small"]{position:absolute;left:0;top:50%;transform:translate(0,-50%);font-family:var(--vibeui-navbar-025-display);font-style:italic;font-weight:500;font-size:1.5rem;line-height:1;color:var(--vibeui-navbar-025-plum);white-space:nowrap;opacity:0;transition:opacity .55s ease .15s;pointer-events:none}
[data-vibeui-block="navbar-025"][data-scrolled="true"] [data-part="brand-small"]{opacity:1;pointer-events:auto}
[data-vibeui-block="navbar-025"] [data-part="brand-small"] em{color:var(--vibeui-navbar-025-accent);font-style:italic;margin:0 .12em}
[data-vibeui-block="navbar-025"] [data-part="brand"] em{color:var(--vibeui-navbar-025-accent);font-style:italic;margin:0 .12em}
[data-vibeui-block="navbar-025"] [data-part="tools"]{display:flex;align-items:center;justify-content:flex-end;gap:.5rem}
[data-vibeui-block="navbar-025"] [data-part="music"]{display:inline-flex;align-items:center;gap:.55rem;height:2.5rem;padding:0 .95rem 0 .8rem;border:1px solid var(--vibeui-navbar-025-line);border-radius:999px;background:transparent;color:var(--vibeui-navbar-025-muted);font-family:var(--vibeui-navbar-025-display);font-style:italic;font-size:1.05rem;line-height:1;cursor:pointer;transition:color .25s,border-color .25s,background .25s}
[data-vibeui-block="navbar-025"] [data-part="music"]:hover{color:var(--vibeui-navbar-025-plum);border-color:var(--vibeui-navbar-025-plum)}
[data-vibeui-block="navbar-025"] [data-part="music"][aria-pressed="true"]{color:var(--vibeui-navbar-025-accent);border-color:color-mix(in oklab,var(--vibeui-navbar-025-accent) 50%,transparent);background:color-mix(in oklab,var(--vibeui-navbar-025-accent) 7%,transparent)}
[data-vibeui-block="navbar-025"] [data-part="wave"]{display:inline-flex;align-items:center;gap:2px;height:1rem}
[data-vibeui-block="navbar-025"] [data-part="wave"] i{display:block;width:1px;height:.35rem;background:currentColor;border-radius:1px;transform-origin:center;transition:height .3s}
[data-vibeui-block="navbar-025"] [data-part="wave"] i:nth-child(2){height:.7rem}
[data-vibeui-block="navbar-025"] [data-part="wave"] i:nth-child(3){height:.5rem}
[data-vibeui-block="navbar-025"] [data-part="wave"] i:nth-child(4){height:.85rem}
[data-vibeui-block="navbar-025"] [data-part="music"][aria-pressed="true"] [data-part="wave"] i{animation:vibeui-navbar-025-wave 1.1s ease-in-out infinite alternate}
[data-vibeui-block="navbar-025"] [data-part="music"][aria-pressed="true"] [data-part="wave"] i:nth-child(2){animation-delay:-.25s}
[data-vibeui-block="navbar-025"] [data-part="music"][aria-pressed="true"] [data-part="wave"] i:nth-child(3){animation-delay:-.55s}
[data-vibeui-block="navbar-025"] [data-part="music"][aria-pressed="true"] [data-part="wave"] i:nth-child(4){animation-delay:-.8s}
@keyframes vibeui-navbar-025-wave{from{transform:scaleY(.35)}to{transform:scaleY(1)}}
[data-vibeui-block="navbar-025"] [data-part="music-label"]{display:none}
[data-vibeui-block="navbar-025"] [data-part="action"]{display:none;align-items:center;height:2.5rem;padding:0 1.1rem;border-radius:999px;background:var(--vibeui-navbar-025-accent);color:var(--vibeui-navbar-025-on-accent);font-weight:600;font-size:.86rem;white-space:nowrap;box-shadow:0 10px 24px -14px color-mix(in oklab,var(--vibeui-navbar-025-accent) 90%,transparent);transition:transform .2s,background .25s}
[data-vibeui-block="navbar-025"] [data-part="action"]:hover{transform:translateY(-1px);background:color-mix(in oklab,var(--vibeui-navbar-025-accent) 88%,#000)}
[data-vibeui-block="navbar-025"] [data-part="toggle"]{display:inline-flex;align-items:center;justify-content:center;width:2.5rem;height:2.5rem;border:1px solid var(--vibeui-navbar-025-line);border-radius:50%;background:transparent;color:inherit;cursor:pointer}
[data-vibeui-block="navbar-025"] [data-part="toggle"] svg{width:1.1rem;height:1.1rem;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round}
[data-vibeui-block="navbar-025"] [data-part="links"]{display:none;justify-content:center;align-items:center;gap:0;margin:.35rem 0 0;padding:0;list-style:none;pointer-events:none;transition:transform .55s cubic-bezier(.2,.9,.3,1),margin .55s cubic-bezier(.2,.9,.3,1)}
[data-vibeui-block="navbar-025"][data-scrolled="true"] [data-part="links"]{transform:translateY(-2.95rem);margin:.35rem 0 -2.2rem}
[data-vibeui-block="navbar-025"] [data-part="links"] li{display:flex;align-items:center;pointer-events:auto}
[data-vibeui-block="navbar-025"] [data-part="links"] li+li::before{content:"";width:.25rem;height:.25rem;margin:0 .9rem;border-radius:50%;background:var(--vibeui-navbar-025-accent);opacity:.6}
[data-vibeui-block="navbar-025"] [data-part="link"]{position:relative;display:inline-flex;align-items:center;height:2.2rem;font-family:var(--vibeui-navbar-025-display);font-size:1.15rem;transition:color .25s,font-size .35s cubic-bezier(.2,.9,.3,1);font-weight:500;letter-spacing:.01em;color:var(--vibeui-navbar-025-fg);transition:color .25s}
[data-vibeui-block="navbar-025"] [data-part="link"]::after{content:"";position:absolute;left:0;right:0;bottom:.3rem;height:1px;background:var(--vibeui-navbar-025-accent);transform:scaleX(0);transform-origin:left;transition:transform .3s cubic-bezier(.2,.9,.3,1)}
[data-vibeui-block="navbar-025"] [data-part="link"]:hover::after,[data-vibeui-block="navbar-025"] [data-part="link"][aria-current="true"]::after{transform:scaleX(1)}
[data-vibeui-block="navbar-025"] [data-part="link"][aria-current="true"]{color:var(--vibeui-navbar-025-accent)}
[data-vibeui-block="navbar-025"] [data-part="sheet"]{display:none;flex-direction:column;gap:.1rem;margin:0;padding:.25rem 1.25rem 1.25rem;list-style:none;background:var(--vibeui-navbar-025-bg);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);border-bottom:1px solid var(--vibeui-navbar-025-line)}
[data-vibeui-block="navbar-025"][data-open="true"] [data-part="sheet"]{display:flex;animation:vibeui-navbar-025-drop .3s cubic-bezier(.2,.9,.3,1) both}
@keyframes vibeui-navbar-025-drop{from{opacity:0;transform:translateY(-.5rem)}}
[data-vibeui-block="navbar-025"] [data-part="sheet"] a{display:block;padding:.55rem 0;border-bottom:1px solid var(--vibeui-navbar-025-line);font-family:var(--vibeui-navbar-025-display);font-size:1.35rem;font-weight:500}
[data-vibeui-block="navbar-025"] [data-part="sheet"] [data-part="action"]{display:inline-flex;margin-top:.75rem;align-self:flex-start;border-bottom:0}
@container (min-width:56rem){
[data-vibeui-block="navbar-025"] [data-part="links"]{display:flex}
[data-vibeui-block="navbar-025"] [data-part="music-label"]{display:inline}
[data-vibeui-block="navbar-025"] [data-part="row"] [data-part="action"]{display:inline-flex}
[data-vibeui-block="navbar-025"] [data-part="toggle"],[data-vibeui-block="navbar-025"] [data-part="sheet"]{display:none!important}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-025"] *{animation:none!important;transition:none!important}}`

const DAY = 86400000

function plural(count: number, labels: readonly [string, string, string, string]): string {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return labels[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return labels[1]
  return labels[2]
}

/** Шапка свадебного приглашения в два яруса: дата и счётчик дней, монограмма по центру, капсула музыки со звуковыми линиями и «Подтвердить»; разделы через точки. */
export function Navbar025({
  monogram = "В & А",
  brandHref = "#",
  caption = "05 · 09 · 2027",
  date = "2027-09-05T15:00:00+03:00",
  daysLabels = ["день", "дня", "дней", "сегодня"],
  links = [
    { label: "История", href: "#story" },
    { label: "Программа", href: "#program" },
    { label: "Место", href: "#place" },
    { label: "Вопросы", href: "#faq" },
  ],
  actionLabel = "Подтвердить",
  actionHref = "#rsvp",
  music,
  musicLabel = "Наша музыка",
  playingLabel = "Играет",
  placement = "fixed",
  spy = true,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Navbar025Props) {
  const audio = useRef<HTMLAudioElement>(null)
  const [active, setActive] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [days, setDays] = useState<number | null>(null)
  const palette = {
    ...(accent ? { "--vibeui-navbar-025-accent": accent } : null),
    ...(ink ? { "--vibeui-navbar-025-fg": ink } : null),
    ...(background ? { "--vibeui-navbar-025-bg": background } : null),
    ...style,
  } as CSSProperties
  const [left, right] = monogram.split(/\s*&\s*/)

  useEffect(() => {
    if (placement === "static") return
    const onScroll = () => setScrolled(window.scrollY > 40)
    // Первое чтение — из кадра, а не из тела эффекта: страница могла
    // открыться уже прокрученной (якорь в адресе).
    const frame = requestAnimationFrame(onScroll)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
    }
  }, [placement])

  // Дни считаются на клиенте: на сервере «сегодня» неизвестно, первый кадр
  // без счётчика, чтобы разметка совпала.
  useEffect(() => {
    const target = Date.parse(date)
    if (Number.isNaN(target)) return
    const tick = () => setDays(Math.ceil((target - Date.now()) / DAY))
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
    // Автовоспроизведение браузеры блокируют — играем только по клику.
    node.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }

  const action = actionLabel ? (
    <a data-part="action" href={actionHref} onClick={() => setOpen(false)}>
      {actionLabel}
    </a>
  ) : null

  const countdown = days === null || days < 0 ? null : days === 0 ? daysLabels[3] : `${days} ${plural(days, daysLabels)}`

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-navbar-025" precedence="medium">
        {STYLES}
      </style>
      <header data-vibeui-block="navbar-025" data-tone={tone === "auto" ? undefined : tone} data-placement={placement} data-scrolled={scrolled ? "true" : undefined} data-open={open ? "true" : undefined} className={className} style={palette}>
        <span data-part="veil" aria-hidden="true" />
        <div data-part="shell">
          <div data-part="row">
          <div data-part="date">
            <span>{caption}</span>
            <span data-part="days" aria-live="off">
              {countdown}
            </span>
          </div>
          <a data-part="brand" href={brandHref} aria-label={monogram}>
            {left}
            <em>&amp;</em>
            {right}
          </a>
          <a data-part="brand-small" href={brandHref} aria-hidden="true" tabIndex={-1}>
            {left}
            <em>&amp;</em>
            {right}
          </a>
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
            <button type="button" data-part="toggle" aria-expanded={open} aria-label={open ? "Закрыть меню" : "Меню"} onClick={() => setOpen((value) => !value)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
          </div>
          <ul data-part="links">
            {links.map((link) => (
              <li key={link.label}>
                <a data-part="link" href={link.href} aria-current={active === link.href ? "true" : undefined}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
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
