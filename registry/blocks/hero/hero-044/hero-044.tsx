"use client"

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react"

export type Hero044Milestone = {
  /** Сумма, на которой стоит веха. */
  at: number
  label: string
}

export type Hero044Props = {
  eyebrow?: string
  /** Заголовок; строки через \n, каждая выезжает из своей маски. */
  title?: string
  lede?: string
  /** Сколько собрано и сколько нужно. */
  raised?: number
  goal?: number
  currency?: string
  /** Сколько дней осталось. 0 — не показывать. */
  daysLeft?: number
  /** Сколько людей уже помогли. 0 — не показывать. */
  donors?: number
  milestones?: readonly Hero044Milestone[]
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  image?: string
  imageAlt?: string
  /** Рукописная подпись под фото. */
  caption?: string
  /** Формы «день», строки счётчика и фактов. */
  dayUnits?: readonly [string, string, string]
  leftLine?: string
  ofLine?: string
  barLabel?: string
  donorsLine?: string
  adsLine?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Хиро сбора благотворительного фонда: слева заголовок антиквой, строки
// которого выезжают из масок по очереди, под ним большой счётчик суммы —
// докручивается от нуля, когда блок попадает в viewport, и прогресс-полоса
// с зазубринами-вехами («продукты», «лекарства», «ремонт»), которая
// заполняется до собранного. Кнопка «Помочь» магнитная: тянется к курсору
// в радиусе обёртки. Справа портрет в бумажной рамке со скотчем и
// рукописной подписью. Зерно бумаги — svg feTurbulence поверх фона.
const FONTS = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;700&display=swap"

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E")`

const STYLES = `
:where([data-vibeui-block="hero-044"]){
--vibeui-hero-044-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-hero-044-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-044-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-044-on-accent:oklch(from var(--vibeui-hero-044-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-044-muted:color-mix(in oklab,var(--vibeui-hero-044-fg) 62%,var(--vibeui-hero-044-bg));
--vibeui-hero-044-line:color-mix(in oklab,var(--vibeui-hero-044-fg) 16%,transparent);
--vibeui-hero-044-soft:color-mix(in oklab,var(--vibeui-hero-044-fg) 6%,var(--vibeui-hero-044-bg));
--vibeui-hero-044-second:color-mix(in oklab,var(--vibeui-hero-044-accent) 45%,#e0b000);
--vibeui-hero-044-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-hero-044-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-044-hand:"Caveat","Segoe Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-044"]{color-scheme:dark}
:where([data-vibeui-block="hero-044"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-044"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-044"]{box-sizing:border-box;position:relative;overflow:hidden;padding:3rem 0 4rem;background:var(--vibeui-hero-044-bg);color:var(--vibeui-hero-044-fg);font-family:var(--vibeui-hero-044-font);font-size:1rem;line-height:1.5;isolation:isolate}
[data-vibeui-block="hero-044"]::before{content:"";position:absolute;inset:0;z-index:-1;background-image:${GRAIN};opacity:.16;mix-blend-mode:multiply;pointer-events:none}
[data-vibeui-block="hero-044"] *{box-sizing:border-box}
[data-vibeui-block="hero-044"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem;align-items:center}
[data-vibeui-block="hero-044"] [data-part="eyebrow"]{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem 1rem;margin:0 0 1.2rem;font-size:.82rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-hero-044-muted)}
[data-vibeui-block="hero-044"] [data-part="eyebrow"] em{font-family:var(--vibeui-hero-044-hand);font-style:normal;font-size:1.3rem;letter-spacing:0;text-transform:none;color:var(--vibeui-hero-044-accent);transform:rotate(-3deg)}
[data-vibeui-block="hero-044"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-044-display);font-weight:500;font-size:clamp(2.4rem,6.4cqi,5.2rem);line-height:1.02;letter-spacing:-.02em}
[data-vibeui-block="hero-044"] [data-part="line"]{display:block;overflow:hidden;padding-bottom:.08em;margin-bottom:-.08em}
[data-vibeui-block="hero-044"] [data-part="line"] span{display:block;transform:translateY(110%);animation:vibeui-hero-044-rise .9s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:calc(var(--vibeui-hero-044-i) * .12s + .1s)}
[data-vibeui-block="hero-044"] [data-part="line"] i{font-style:italic;color:var(--vibeui-hero-044-accent)}
[data-vibeui-block="hero-044"] [data-part="lede"]{margin:1.3rem 0 0;max-width:32rem;font-size:1.08rem;color:var(--vibeui-hero-044-muted);animation:vibeui-hero-044-fade .8s ease-out .6s both}
[data-vibeui-block="hero-044"] [data-part="fund"]{margin:2rem 0 0;animation:vibeui-hero-044-fade .8s ease-out .8s both}
[data-vibeui-block="hero-044"] [data-part="sum"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:.3rem .8rem}
[data-vibeui-block="hero-044"] [data-part="sum"] strong{font-family:var(--vibeui-hero-044-display);font-weight:700;font-size:clamp(2.2rem,5cqi,3.6rem);line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
[data-vibeui-block="hero-044"] [data-part="sum"] span{font-size:.95rem;color:var(--vibeui-hero-044-muted)}
[data-vibeui-block="hero-044"] [data-part="sum"] span b{font-weight:600;color:var(--vibeui-hero-044-fg)}
[data-vibeui-block="hero-044"] [data-part="bar"]{position:relative;height:.9rem;margin:1rem 0 0;border-radius:999px;background:var(--vibeui-hero-044-soft);border:1px solid var(--vibeui-hero-044-line);overflow:visible}
[data-vibeui-block="hero-044"] [data-part="fill"]{position:absolute;inset:0;width:var(--vibeui-hero-044-p);border-radius:999px;background:linear-gradient(90deg,var(--vibeui-hero-044-second),var(--vibeui-hero-044-accent));transform:scaleX(0);transform-origin:left;transition:transform 1.8s cubic-bezier(.2,.8,.2,1) .2s}
[data-vibeui-block="hero-044"][data-in="true"] [data-part="fill"]{transform:scaleX(1)}
[data-vibeui-block="hero-044"] [data-part="mark"]{position:absolute;top:-.55rem;left:var(--vibeui-hero-044-x);width:0;height:0;border-left:.4rem solid transparent;border-right:.4rem solid transparent;border-top:.55rem solid var(--vibeui-hero-044-line);transform:translateX(-50%);transition:border-top-color .4s}
[data-vibeui-block="hero-044"] [data-part="mark"][data-done="true"]{border-top-color:var(--vibeui-hero-044-accent)}
[data-vibeui-block="hero-044"] [data-part="mark"] span{position:absolute;top:1.15rem;left:50%;transform:translateX(-50%);white-space:nowrap;font-family:var(--vibeui-hero-044-hand);font-size:1.05rem;line-height:1;color:var(--vibeui-hero-044-muted)}
[data-vibeui-block="hero-044"] [data-part="mark"][data-done="true"] span{color:var(--vibeui-hero-044-accent)}
[data-vibeui-block="hero-044"] [data-part="mark"]:last-child span{left:auto;right:0;transform:none}
[data-vibeui-block="hero-044"] [data-part="mark"]:first-child span{left:0;transform:none}
[data-vibeui-block="hero-044"] [data-part="meta"]{display:flex;flex-wrap:wrap;gap:.4rem .8rem;margin:2.2rem 0 0;padding:0;list-style:none;font-size:.85rem;color:var(--vibeui-hero-044-muted)}
[data-vibeui-block="hero-044"] [data-part="meta"] li{padding:.35rem .75rem;border-radius:999px;border:1px solid var(--vibeui-hero-044-line)}
[data-vibeui-block="hero-044"] [data-part="meta"] li b{color:var(--vibeui-hero-044-fg);font-weight:600}
[data-vibeui-block="hero-044"] [data-part="actions"]{display:flex;flex-wrap:wrap;align-items:center;gap:1rem 1.4rem;margin:1.6rem 0 0;animation:vibeui-hero-044-fade .8s ease-out 1s both}
[data-vibeui-block="hero-044"] [data-part="magnet"]{display:inline-block;padding:.6rem;margin:-.6rem}
[data-vibeui-block="hero-044"] [data-part="primary"]{display:inline-flex;align-items:center;gap:.5rem;padding:1rem 1.8rem;border-radius:999px;background:var(--vibeui-hero-044-accent);color:var(--vibeui-hero-044-on-accent);text-decoration:none;font-weight:600;font-size:1.05rem;will-change:transform;transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .3s}
[data-vibeui-block="hero-044"] [data-part="primary"]:hover{box-shadow:0 16px 36px -14px var(--vibeui-hero-044-accent)}
[data-vibeui-block="hero-044"] [data-part="primary"] svg{width:1.1rem;height:1.1rem}
[data-vibeui-block="hero-044"] [data-part="secondary"]{color:var(--vibeui-hero-044-fg);text-decoration:none;font-weight:500;border-bottom:1px solid var(--vibeui-hero-044-line);transition:border-color .2s}
[data-vibeui-block="hero-044"] [data-part="secondary"]:hover{border-color:var(--vibeui-hero-044-accent)}
[data-vibeui-block="hero-044"] a:focus-visible{outline:2px solid var(--vibeui-hero-044-accent);outline-offset:3px}
[data-vibeui-block="hero-044"] [data-part="figure"]{position:relative;margin:0 auto;width:min(100%,30rem);padding:.75rem .75rem 3rem;background:var(--vibeui-hero-044-bg);border:1px solid var(--vibeui-hero-044-line);box-shadow:0 30px 60px -30px rgb(0 0 0 / .45);transform:rotate(1.5deg);animation:vibeui-hero-044-photo 1s cubic-bezier(.2,.8,.2,1) .3s both}
[data-vibeui-block="hero-044"] [data-part="figure"]::before{content:"";position:absolute;top:-.8rem;left:50%;width:6rem;height:1.6rem;transform:translateX(-50%) rotate(-3deg);background:color-mix(in oklab,var(--vibeui-hero-044-second) 55%,transparent);opacity:.8}
[data-vibeui-block="hero-044"] [data-part="photo"]{position:relative;aspect-ratio:4/3;overflow:hidden;background:linear-gradient(135deg,var(--vibeui-hero-044-soft),color-mix(in oklab,var(--vibeui-hero-044-accent) 25%,var(--vibeui-hero-044-bg)))}
[data-vibeui-block="hero-044"] [data-part="photo"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="hero-044"] [data-part="caption"]{position:absolute;left:1rem;right:1rem;bottom:.6rem;margin:0;font-family:var(--vibeui-hero-044-hand);font-size:1.4rem;line-height:1.1;color:var(--vibeui-hero-044-fg);transform:rotate(-1.5deg)}
@keyframes vibeui-hero-044-rise{to{transform:translateY(0)}}
@keyframes vibeui-hero-044-fade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes vibeui-hero-044-photo{from{opacity:0;transform:rotate(6deg) translateY(30px)}to{opacity:1;transform:rotate(1.5deg) translateY(0)}}
@container (min-width: 60rem){[data-vibeui-block="hero-044"] [data-part="shell"]{grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:4rem;min-height:min(46rem,calc(100svh - 4.25rem))}[data-vibeui-block="hero-044"] [data-part="photo"]{aspect-ratio:4/5}[data-vibeui-block="hero-044"] [data-part="figure"]{margin-right:1rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-044"] *{animation:none!important;transition:none!important}[data-vibeui-block="hero-044"] [data-part="line"] span{transform:none}[data-vibeui-block="hero-044"] [data-part="fill"]{transform:scaleX(1)}}`

function formatMoney(value: number) {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

function pluralDays(value: number, units: readonly [string, string, string]) {
  const mod10 = value % 10
  const mod100 = value % 100
  if (mod10 === 1 && mod100 !== 11) return units[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return units[1]
  return units[2]
}

/** Хиро сбора: строки из масок, счётчик, прогресс с вехами, магнитная кнопка. */
export function Hero044({
  eyebrow = "Сбор № 14 · сентябрь",
  title = "Чтобы к Нине Петровне\nпришли не только\n*по праздникам*",
  lede = "В Твери и области 312 одиноких пожилых людей, к которым мы ходим каждую неделю: продукты, лекарства, починить кран, поговорить. Этот сбор — на осень.",
  raised = 1_284_500,
  goal = 2_000_000,
  currency = "₽",
  daysLeft = 23,
  donors = 1_942,
  milestones = [
    { at: 500_000, label: "продукты" },
    { at: 1_000_000, label: "лекарства" },
    { at: 1_500_000, label: "ремонт" },
    { at: 2_000_000, label: "зима" },
  ],
  primaryLabel = "Помочь",
  primaryHref = "#donate",
  secondaryLabel = "Куда идут деньги",
  secondaryHref = "#report",
  image = "",
  imageAlt = "",
  caption = "Нина Петровна, 84 года. Ржев, ул. Ленина",
  dayUnits = ["день", "дня", "дней"],
  leftLine = "осталось {n} {days}",
  ofLine = "из {goal} · {percent}%",
  barLabel = "Собрано",
  donorsLine = "{n} человек уже помогли",
  adsLine = "{n} на рекламу",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero044Props) {
  const rootRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const [inView, setInView] = useState(false)
  const [shown, setShown] = useState(0)
  const lines = title.split("\n")
  const percent = Math.min(100, (raised / Math.max(1, goal)) * 100)

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      const id = window.setTimeout(() => setShown(raised), 0)
      return () => window.clearTimeout(id)
    }
    const duration = 1800
    let frame = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 4)
      setShown(Math.round(raised * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, raised])

  const magnet = (event: MouseEvent<HTMLSpanElement>) => {
    const button = buttonRef.current
    if (!button) return
    const box = event.currentTarget.getBoundingClientRect()
    const dx = event.clientX - (box.left + box.width / 2)
    const dy = event.clientY - (box.top + box.height / 2)
    button.style.transform = `translate(${dx * 0.28}px, ${dy * 0.28}px)`
  }

  const release = () => {
    const button = buttonRef.current
    if (button) button.style.transform = ""
  }

  const palette = {
    ...(accent ? { "--vibeui-hero-044-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-044-fg": ink } : null),
    ...(background ? { "--vibeui-hero-044-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-044" precedence="medium">
        {STYLES}
      </style>
      <section ref={rootRef} data-vibeui-block="hero-044" data-tone={tone === "auto" ? undefined : tone} data-in={inView} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? (
              <p data-part="eyebrow">
                <span>{eyebrow}</span>
                {daysLeft > 0 ? (
                  <em>
                    {leftLine.replace("{n}", String(daysLeft)).replace("{days}", pluralDays(daysLeft, dayUnits))}
                  </em>
                ) : null}
              </p>
            ) : null}
            <h1 data-part="title">
              {lines.map((line, index) => (
                <span key={index} data-part="line" style={{ ["--vibeui-hero-044-i" as string]: index }}>
                  <span>
                    {line.split(/(\*[^*]+\*)/).map((piece, pieceIndex) =>
                      piece.startsWith("*") && piece.endsWith("*") ? <i key={pieceIndex}>{piece.slice(1, -1)}</i> : <span key={pieceIndex}>{piece}</span>,
                    )}
                  </span>
                </span>
              ))}
            </h1>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="fund" aria-live="off">
              <p data-part="sum">
                <strong>
                  {formatMoney(shown)} {currency}
                </strong>
                <span>
                  {ofLine.split("{goal}")[0]}
                  <b>
                    {formatMoney(goal)} {currency}
                  </b>
                  {(ofLine.split("{goal}")[1] ?? "").replace("{percent}", String(Math.round(percent)))}
                </span>
              </p>
              <div data-part="bar" role="progressbar" aria-valuemin={0} aria-valuemax={goal} aria-valuenow={raised} aria-label={barLabel}>
                <i data-part="fill" style={{ ["--vibeui-hero-044-p" as string]: `${percent}%` }} />
                {milestones.map((milestone) => (
                  <i key={milestone.at} data-part="mark" data-done={inView && raised >= milestone.at} style={{ ["--vibeui-hero-044-x" as string]: `${Math.min(100, (milestone.at / Math.max(1, goal)) * 100)}%` }}>
                    <span>{milestone.label}</span>
                  </i>
                ))}
              </div>
              {donors > 0 || daysLeft > 0 ? (
                <ul data-part="meta">
                  {donors > 0 ? (
                    <li>
                      <b>{formatMoney(donors)}</b>
                      {donorsLine.split("{n}")[1]}
                    </li>
                  ) : null}
                  <li>
                    <b>0 %</b>
                    {adsLine.split("{n}")[1]}
                  </li>
                </ul>
              ) : null}
            </div>
            <div data-part="actions">
              <span data-part="magnet" onMouseMove={magnet} onMouseLeave={release}>
                <a ref={buttonRef} data-part="primary" href={primaryHref}>
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3.4 5 7 5c2 0 3.4 1.1 5 2.8C13.6 6.1 15 5 17 5c3.6 0 5.8 3.6 4.5 6.8C19.5 16.4 12 21 12 21Z" />
                  </svg>
                  {primaryLabel}
                </a>
              </span>
              {secondaryLabel ? (
                <a data-part="secondary" href={secondaryHref}>
                  {secondaryLabel}
                </a>
              ) : null}
            </div>
          </div>
          <figure data-part="figure">
            <div data-part="photo">{image ? <img src={image} alt={imageAlt} /> : null}</div>
            {caption ? <figcaption data-part="caption">{caption}</figcaption> : null}
          </figure>
        </div>
      </section>
    </>
  )
}
