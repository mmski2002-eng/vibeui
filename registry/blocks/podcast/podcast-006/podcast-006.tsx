"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"

export type Podcast006Stat = {
  /** Число для счётчика. */
  value: number
  /** Подпись до/после числа: «эпизодов», «млн». */
  label: string
  prefix?: string
  suffix?: string
}

export type Podcast006Platform = {
  name: string
  href: string
  /** Короткая подпись: «RSS», «Apple», «Я.Музыка». Пусто — первая буква имени. */
  mark?: string
}

export type Podcast006Props = {
  eyebrow?: string
  title?: string
  lede?: string
  stats?: readonly Podcast006Stat[]
  platformsLabel?: string
  platforms?: readonly Podcast006Platform[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Где слушать» со статистикой: три больших числа считают вверх при
// появлении в кадре (rAF, ease-out, 1.4 с), под ними — плитки платформ с
// монограммой-маркой, которые при наведении наклоняются к курсору и
// подсвечиваются акцентом. Числа форматируются с пробелами по-русски.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Sofia+Sans+Extra+Condensed:wght@700;800&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="podcast-006"]){
--vibeui-podcast-006-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-podcast-006-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-podcast-006-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-podcast-006-on-accent:oklch(from var(--vibeui-podcast-006-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-podcast-006-muted:color-mix(in oklab,var(--vibeui-podcast-006-fg) 60%,var(--vibeui-podcast-006-bg));
--vibeui-podcast-006-panel:color-mix(in oklab,var(--vibeui-podcast-006-fg) 6%,var(--vibeui-podcast-006-bg));
--vibeui-podcast-006-line:color-mix(in oklab,var(--vibeui-podcast-006-fg) 12%,transparent);
--vibeui-podcast-006-display:"Sofia Sans Extra Condensed",Impact,"Arial Narrow",sans-serif;
--vibeui-podcast-006-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-podcast-006-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="podcast-006"]{color-scheme:dark}
:where([data-vibeui-block="podcast-006"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="podcast-006"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="podcast-006"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-podcast-006-panel);color:var(--vibeui-podcast-006-fg);font-family:var(--vibeui-podcast-006-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="podcast-006"] *{box-sizing:border-box}
[data-vibeui-block="podcast-006"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="podcast-006"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-podcast-006-mono);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-podcast-006-accent)}
[data-vibeui-block="podcast-006"] [data-part="title"]{margin:0;font-family:var(--vibeui-podcast-006-display);font-weight:800;font-size:clamp(2.6rem,7cqi,5.5rem);line-height:.92;text-transform:uppercase}
[data-vibeui-block="podcast-006"] [data-part="lede"]{margin:1rem 0 0;max-width:34rem;color:var(--vibeui-podcast-006-muted)}
[data-vibeui-block="podcast-006"] [data-part="stats"]{display:grid;gap:1rem;margin:2.5rem 0 0;padding:0;list-style:none}
[data-vibeui-block="podcast-006"] [data-part="stats"] li{padding:1.4rem 1.5rem;border-radius:1.2rem;background:var(--vibeui-podcast-006-bg);box-shadow:0 0 0 1px var(--vibeui-podcast-006-line)}
[data-vibeui-block="podcast-006"] [data-part="num"]{display:block;font-family:var(--vibeui-podcast-006-display);font-weight:800;font-size:clamp(3rem,7cqi,5.2rem);line-height:.95;letter-spacing:-.01em;font-variant-numeric:tabular-nums;color:var(--vibeui-podcast-006-accent)}
[data-vibeui-block="podcast-006"] [data-part="stats"] small{display:block;margin-top:.4rem;font-family:var(--vibeui-podcast-006-mono);font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;color:var(--vibeui-podcast-006-muted)}
[data-vibeui-block="podcast-006"] [data-part="plabel"]{margin:3rem 0 1rem;font-family:var(--vibeui-podcast-006-mono);font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-podcast-006-muted)}
[data-vibeui-block="podcast-006"] [data-part="platforms"]{display:grid;grid-template-columns:repeat(auto-fill,minmax(9rem,1fr));gap:.8rem;margin:0;padding:0;list-style:none;perspective:900px}
[data-vibeui-block="podcast-006"] [data-part="p"]{display:grid;gap:.8rem;padding:1.1rem;border-radius:1rem;background:var(--vibeui-podcast-006-bg);box-shadow:0 0 0 1px var(--vibeui-podcast-006-line);color:inherit;text-decoration:none;transform:rotateX(calc(var(--vibeui-podcast-006-ty) * 8deg)) rotateY(calc(var(--vibeui-podcast-006-tx) * -8deg));transition:transform .25s,box-shadow .25s,background .25s}
[data-vibeui-block="podcast-006"] [data-part="p"]:hover{box-shadow:0 0 0 1px var(--vibeui-podcast-006-accent),0 20px 40px -24px rgb(0 0 0 / .6);background:color-mix(in oklab,var(--vibeui-podcast-006-accent) 8%,var(--vibeui-podcast-006-bg))}
[data-vibeui-block="podcast-006"] [data-part="p"]:focus-visible{outline:2px solid var(--vibeui-podcast-006-accent);outline-offset:3px}
[data-vibeui-block="podcast-006"] [data-part="mark"]{width:2.4rem;height:2.4rem;border-radius:.6rem;display:grid;place-items:center;background:var(--vibeui-podcast-006-fg);color:var(--vibeui-podcast-006-bg);font-family:var(--vibeui-podcast-006-display);font-weight:800;font-size:1.1rem;text-transform:uppercase}
[data-vibeui-block="podcast-006"] [data-part="p"]:hover [data-part="mark"]{background:var(--vibeui-podcast-006-accent);color:var(--vibeui-podcast-006-on-accent)}
[data-vibeui-block="podcast-006"] [data-part="p"] span{font-weight:500;font-size:.92rem}
@container (min-width: 48rem){[data-vibeui-block="podcast-006"] [data-part="stats"]{grid-template-columns:repeat(3,1fr)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="podcast-006"] *{transition:none!important;transform:none!important}}`

const format = (n: number, target: number) => new Intl.NumberFormat("ru-RU", { maximumFractionDigits: Number.isInteger(target) ? 0 : 1, minimumFractionDigits: Number.isInteger(target) ? 0 : 1 }).format(n)

function Counter({ stat, run }: { stat: Podcast006Stat; run: boolean }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!run) return
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1400)
      setValue(stat.value * (1 - Math.pow(1 - t, 3)))
      if (t < 1) raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [run, stat.value])

  return (
    <li>
      <span data-part="num">
        {stat.prefix ?? ""}
        {format(run ? value : 0, stat.value)}
        {stat.suffix ?? ""}
      </span>
      <small>{stat.label}</small>
    </li>
  )
}

/** Статистика count-up и плитки платформ с наклоном к курсору. */
export function Podcast006({
  eyebrow = "Где слушать",
  title = "Мы там же, где и вы",
  lede = "Подкаст выходит по четвергам во всех приложениях сразу. Ниже — цифры, которые мы сами не ожидали.",
  stats = [
    { value: 112, label: "эпизодов за три года" },
    { value: 1.8, label: "прослушиваний", suffix: " млн" },
    { value: 6240, label: "часов разговоров у слушателей" },
  ],
  platformsLabel = "Платформы",
  platforms = [
    { name: "Яндекс Музыка", href: "#", mark: "Я" },
    { name: "Apple Podcasts", href: "#", mark: "A" },
    { name: "Spotify", href: "#", mark: "S" },
    { name: "YouTube", href: "#", mark: "▶" },
    { name: "Telegram", href: "#", mark: "T" },
    { name: "RSS", href: "#", mark: "∿" },
  ],
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Podcast006Props) {
  const root = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const element = root.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: "-15% 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const tilt = (event: PointerEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--vibeui-podcast-006-tx", (((event.clientX - rect.left) / rect.width) * 2 - 1).toFixed(2))
    event.currentTarget.style.setProperty("--vibeui-podcast-006-ty", (((event.clientY - rect.top) / rect.height) * 2 - 1).toFixed(2))
  }
  const reset = (event: PointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty("--vibeui-podcast-006-tx", "0")
    event.currentTarget.style.setProperty("--vibeui-podcast-006-ty", "0")
  }

  const palette = {
    ...(accent ? { "--vibeui-podcast-006-accent": accent } : null),
    ...(ink ? { "--vibeui-podcast-006-fg": ink } : null),
    ...(background ? { "--vibeui-podcast-006-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-podcast-006" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="podcast-006" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          {stats.length > 0 ? (
            <ul data-part="stats">
              {stats.map((stat) => (
                <Counter key={stat.label} stat={stat} run={shown} />
              ))}
            </ul>
          ) : null}
          {platforms.length > 0 ? (
            <>
              <p data-part="plabel">{platformsLabel}</p>
              <ul data-part="platforms">
                {platforms.map((platform) => (
                  <li key={platform.name}>
                    <a data-part="p" href={platform.href} onPointerMove={tilt} onPointerLeave={reset} style={{ ["--vibeui-podcast-006-tx" as string]: 0, ["--vibeui-podcast-006-ty" as string]: 0 }}>
                      <span data-part="mark" aria-hidden="true">
                        {platform.mark ?? platform.name.charAt(0)}
                      </span>
                      <span>{platform.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </section>
    </>
  )
}
