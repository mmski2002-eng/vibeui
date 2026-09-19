"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Bento010Stat = {
  value: number
  label: string
  prefix?: string
  suffix?: string
  decimals?: number
}

export type Bento010Purchase = {
  who: string
  what: string
  ago: string
}

export type Bento010Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Главная плитка: большая цифра и подпись. */
  hero?: Bento010Stat
  heroText?: string
  /** Плитка выплат: заголовок, подпись и день недели 1–7, который подсвечен. */
  payoutTitle?: string
  payoutText?: string
  payoutDay?: number
  stats?: readonly Bento010Stat[]
  purchasesLabel?: string
  purchases?: readonly Bento010Purchase[]
  ctaLabel?: string
  ctaHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Bento «для авторов»: плитки разного размера, где цифры докручиваются,
// когда секция входит в viewport (IntersectionObserver + rAF, ease-out),
// — «80 %» на большой плитке, товары, авторы, загрузки. Плитка выплат с
// недельной полоской и подсвеченной пятницей, широкая плитка «купили
// только что» с бегущей строкой покупок и чёрная плитка-кнопка «стать
// автором» со стрелкой, которая уезжает по наведению.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="bento-010"]){
--vibeui-bento-010-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-bento-010-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bento-010-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bento-010-on-accent:oklch(from var(--vibeui-bento-010-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-bento-010-muted:color-mix(in oklab,var(--vibeui-bento-010-fg) 58%,var(--vibeui-bento-010-bg));
--vibeui-bento-010-line:color-mix(in oklab,var(--vibeui-bento-010-fg) 12%,transparent);
--vibeui-bento-010-soft:color-mix(in oklab,var(--vibeui-bento-010-fg) 4%,transparent);
--vibeui-bento-010-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-bento-010-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-bento-010-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="bento-010"]{color-scheme:dark}
:where([data-vibeui-block="bento-010"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="bento-010"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="bento-010"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-bento-010-bg);color:var(--vibeui-bento-010-fg);font-family:var(--vibeui-bento-010-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="bento-010"] *{box-sizing:border-box}
[data-vibeui-block="bento-010"] [data-part="shell"]{max-width:86rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="bento-010"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-bento-010-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-bento-010-muted)}
[data-vibeui-block="bento-010"] [data-part="title"]{margin:0;max-width:22ch;font-family:var(--vibeui-bento-010-display);font-weight:800;font-size:clamp(2rem,5cqi,3.6rem);line-height:.98;letter-spacing:-.04em}
[data-vibeui-block="bento-010"] [data-part="lede"]{margin:.8rem 0 0;max-width:34rem;color:var(--vibeui-bento-010-muted)}
[data-vibeui-block="bento-010"] [data-part="grid"]{display:grid;grid-template-columns:1fr;grid-auto-flow:dense;gap:.9rem;margin:2.5rem 0 0}
[data-vibeui-block="bento-010"] [data-part="tile"]{position:relative;display:grid;align-content:space-between;gap:1rem;min-height:11rem;padding:1.4rem;border-radius:1.4rem;border:1px solid var(--vibeui-bento-010-line);background:var(--vibeui-bento-010-soft);overflow:hidden;transition:transform .3s cubic-bezier(.2,.7,.2,1),border-color .2s}
[data-vibeui-block="bento-010"] [data-part="tile"]:hover{border-color:color-mix(in oklab,var(--vibeui-bento-010-fg) 30%,transparent)}
[data-vibeui-block="bento-010"] [data-part="label"]{margin:0;font-family:var(--vibeui-bento-010-mono);font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-bento-010-muted)}
[data-vibeui-block="bento-010"] [data-part="num"]{margin:0;color:inherit;font-family:var(--vibeui-bento-010-display);font-weight:800;font-size:clamp(2.4rem,4.5cqi,3.6rem);line-height:.95;letter-spacing:-.05em;font-variant-numeric:tabular-nums}
[data-vibeui-block="bento-010"] [data-part="tile"][data-tile="hero"]{background:var(--vibeui-bento-010-accent);color:var(--vibeui-bento-010-on-accent);border-color:transparent}
[data-vibeui-block="bento-010"] [data-part="tile"][data-tile="hero"] [data-part="label"]{color:inherit;opacity:.75}
[data-vibeui-block="bento-010"] [data-part="tile"][data-tile="hero"] [data-part="num"]{font-size:clamp(4.5rem,12cqi,10rem);letter-spacing:-.06em}
[data-vibeui-block="bento-010"] [data-part="tile"][data-tile="hero"] p:last-child{margin:0;max-width:26rem;font-size:1.02rem;opacity:.9}
[data-vibeui-block="bento-010"] [data-part="week"]{display:grid;grid-template-columns:repeat(7,1fr);gap:.3rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="bento-010"] [data-part="week"] li{display:grid;place-items:center;aspect-ratio:1;border-radius:.6rem;background:var(--vibeui-bento-010-bg);border:1px solid var(--vibeui-bento-010-line);font-family:var(--vibeui-bento-010-mono);font-size:.68rem;color:var(--vibeui-bento-010-muted)}
[data-vibeui-block="bento-010"] [data-part="week"] li[data-on="true"]{background:var(--vibeui-bento-010-accent);color:var(--vibeui-bento-010-on-accent);border-color:transparent;animation:vibeui-bento-010-day 2.4s ease-in-out infinite}
[data-vibeui-block="bento-010"] [data-part="tile"] h3{margin:0;font-family:var(--vibeui-bento-010-display);font-weight:700;font-size:1.3rem;letter-spacing:-.03em;line-height:1.1}
[data-vibeui-block="bento-010"] [data-part="tile"] p{margin:.3rem 0 0;font-size:.88rem;color:var(--vibeui-bento-010-muted)}
[data-vibeui-block="bento-010"] [data-part="tile"][data-tile="feed"]{padding:1.4rem 0;gap:.8rem}
[data-vibeui-block="bento-010"] [data-part="tile"][data-tile="feed"] [data-part="label"]{padding:0 1.4rem;display:flex;align-items:center;gap:.5rem}
[data-vibeui-block="bento-010"] [data-part="dot"]{width:.45rem;height:.45rem;border-radius:50%;background:var(--vibeui-bento-010-accent);animation:vibeui-bento-010-pulse 1.4s ease-in-out infinite}
[data-vibeui-block="bento-010"] [data-part="marquee"]{display:flex;overflow:hidden;mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
[data-vibeui-block="bento-010"] [data-part="marquee"] ul{display:flex;flex-shrink:0;gap:.6rem;margin:0;padding:0 .3rem;list-style:none;animation:vibeui-bento-010-run 32s linear infinite}
[data-vibeui-block="bento-010"] [data-part="tile"][data-tile="feed"]:hover [data-part="marquee"] ul{animation-play-state:paused}
[data-vibeui-block="bento-010"] [data-part="marquee"] li{display:inline-flex;align-items:center;gap:.5rem;height:2.4rem;padding:0 .9rem;border-radius:999px;background:var(--vibeui-bento-010-bg);border:1px solid var(--vibeui-bento-010-line);white-space:nowrap;font-size:.84rem}
[data-vibeui-block="bento-010"] [data-part="marquee"] li b{font-weight:600}
[data-vibeui-block="bento-010"] [data-part="marquee"] li span{font-family:var(--vibeui-bento-010-mono);font-size:.66rem;color:var(--vibeui-bento-010-muted)}
[data-vibeui-block="bento-010"] [data-part="tile"][data-tile="cta"]{background:var(--vibeui-bento-010-fg);color:var(--vibeui-bento-010-bg);border-color:transparent;text-decoration:none}
[data-vibeui-block="bento-010"] [data-part="tile"][data-tile="cta"]:hover{transform:translateY(-3px)}
[data-vibeui-block="bento-010"] [data-part="tile"][data-tile="cta"] h3{font-size:1.6rem}
[data-vibeui-block="bento-010"] [data-part="arrow"]{justify-self:end;width:2.6rem;height:2.6rem;border-radius:50%;display:grid;place-items:center;background:var(--vibeui-bento-010-accent);color:var(--vibeui-bento-010-on-accent)}
[data-vibeui-block="bento-010"] [data-part="arrow"] svg{width:1.1rem;height:1.1rem;transition:transform .3s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="bento-010"] [data-part="tile"][data-tile="cta"]:hover [data-part="arrow"] svg{transform:translate(2px,-2px)}
[data-vibeui-block="bento-010"] a:focus-visible{outline:2px solid var(--vibeui-bento-010-accent);outline-offset:2px}
@keyframes vibeui-bento-010-run{to{transform:translateX(-100%)}}
@keyframes vibeui-bento-010-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
@keyframes vibeui-bento-010-day{0%,100%{box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-bento-010-accent) 45%,transparent)}50%{box-shadow:0 0 0 6px transparent}}
@container (min-width: 40rem){[data-vibeui-block="bento-010"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}[data-vibeui-block="bento-010"] [data-part="tile"][data-tile="hero"],[data-vibeui-block="bento-010"] [data-part="tile"][data-tile="feed"]{grid-column:span 2}}
@container (min-width: 64rem){[data-vibeui-block="bento-010"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr))}[data-vibeui-block="bento-010"] [data-part="tile"][data-tile="hero"]{grid-column:span 2;grid-row:span 2}[data-vibeui-block="bento-010"] [data-part="tile"][data-tile="feed"]{grid-column:span 3}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="bento-010"] *{animation:none!important;transition:none!important}}`

const DEFAULT_STATS: Bento010Stat[] = [
  { value: 4812, label: "товаров в каталоге" },
  { value: 1240, label: "авторов получают выплаты" },
  { value: 2.1, decimals: 1, suffix: " млн", label: "загрузок за год" },
]

const DEFAULT_PURCHASES: Bento010Purchase[] = [
  { who: "Маша из Казани", what: "Атлас — UI-кит", ago: "только что" },
  { who: "Студия «Формат»", what: "Нарва Grotesk · команда", ago: "1 мин" },
  { who: "Кирилл из Тбилиси", what: "Рутина — второй мозг", ago: "2 мин" },
  { who: "Оля из Новосибирска", what: "Грань — 480 иконок", ago: "4 мин" },
  { who: "Артём из Минска", what: "Дашборд Про · коммерч.", ago: "6 мин" },
  { who: "Дина из Алматы", what: "Спринт — трекер продукта", ago: "9 мин" },
]

const DAYS = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]

function formatNumber(value: number, decimals = 0) {
  const fixed = value.toFixed(decimals)
  const [whole, fraction] = fixed.split(".")
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return fraction ? `${grouped},${fraction}` : grouped
}

/** Bento для авторов: докручивающиеся цифры, календарь выплат, лента покупок. */
export function Bento010({
  eyebrow = "для авторов",
  title = "Загрузили один раз — продаётся годами",
  lede = "Мы берём на себя оплату, лицензии, налоги по агентской схеме и поддержку покупателей. Вы — только продукт.",
  hero = { value: 80, suffix: " %", label: "от каждой продажи — автору" },
  heroText = "Без порогов и «первых 100 продаж по другой ставке». Ставка одна для всех, с первого рубля.",
  payoutTitle = "Выплаты каждую пятницу",
  payoutText = "На карту или счёт ИП, без минимальной суммы.",
  payoutDay = 5,
  stats = DEFAULT_STATS,
  purchasesLabel = "купили только что",
  purchases = DEFAULT_PURCHASES,
  ctaLabel = "Стать автором",
  ctaHref = "#become-author",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Bento010Props) {
  const rootRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(() => setProgress(1), 0)
      return () => window.clearTimeout(id)
    }
    let frame = 0
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        const started = performance.now()
        const duration = 1600
        const step = (time: number) => {
          const t = Math.min(1, (time - started) / duration)
          setProgress(1 - Math.pow(1 - t, 3))
          if (t < 1) frame = requestAnimationFrame(step)
        }
        frame = requestAnimationFrame(step)
      },
      { threshold: 0.25 },
    )
    observer.observe(root)
    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const show = (stat: Bento010Stat) => `${stat.prefix ?? ""}${formatNumber(stat.value * progress, stat.decimals ?? 0)}${stat.suffix ?? ""}`

  const palette = {
    ...(accent ? { "--vibeui-bento-010-accent": accent } : null),
    ...(ink ? { "--vibeui-bento-010-fg": ink } : null),
    ...(background ? { "--vibeui-bento-010-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-bento-010" precedence="medium">
        {STYLES}
      </style>
      <section ref={rootRef} data-vibeui-block="bento-010" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="grid">
            <div data-part="tile" data-tile="hero">
              <p data-part="label">{hero.label}</p>
              <p data-part="num">{show(hero)}</p>
              <p>{heroText}</p>
            </div>
            <div data-part="tile" data-tile="payout">
              <div>
                <h3>{payoutTitle}</h3>
                <p>{payoutText}</p>
              </div>
              <ul data-part="week" aria-label="Неделя">
                {DAYS.map((day, index) => (
                  <li key={day} data-on={index + 1 === payoutDay}>
                    {day}
                  </li>
                ))}
              </ul>
            </div>
            {stats.map((stat) => (
              <div key={stat.label} data-part="tile" data-tile="stat">
                <p data-part="num">{show(stat)}</p>
                <p data-part="label">{stat.label}</p>
              </div>
            ))}
            <div data-part="tile" data-tile="feed">
              <p data-part="label">
                <i data-part="dot" aria-hidden="true" />
                {purchasesLabel}
              </p>
              <div data-part="marquee">
                {[0, 1].map((copy) => (
                  <ul key={copy} aria-hidden={copy === 1 ? true : undefined}>
                    {purchases.map((purchase, index) => (
                      <li key={index}>
                        <b>{purchase.who}</b>
                        {purchase.what}
                        <span>{purchase.ago}</span>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
            <a data-part="tile" data-tile="cta" href={ctaHref}>
              <h3>{ctaLabel}</h3>
              <span data-part="arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
