"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type App001Feature = {
  title: string
  text: string
  /** Экран в телефоне: breath — дышащий круг, sleep — график сна, alarm — будильник, stats — серия дней. */
  screen: "breath" | "sleep" | "alarm" | "stats"
  /** Подпись на экране. */
  screenTitle?: string
}

export type App001Props = {
  eyebrow?: string
  title?: string
  features?: readonly App001Feature[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Возможности с липким телефоном: слева список фич, каждая — экран высотой
// в половину окна; телефон из CSS прилипает справа, и по мере прокрутки
// его экран переключается на тот, что напротив активной фичи (IntersectionObserver
// по каждой фиче, активная — с акцентной чертой слева). Четыре экрана
// нарисованы CSS: дыхание, график сна, будильник, серия дней.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="app-001"]){
--vibeui-app-001-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-app-001-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-app-001-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-app-001-muted:color-mix(in oklab,var(--vibeui-app-001-fg) 60%,var(--vibeui-app-001-bg));
--vibeui-app-001-line:color-mix(in oklab,var(--vibeui-app-001-fg) 12%,transparent);
--vibeui-app-001-panel:color-mix(in oklab,var(--vibeui-app-001-fg) 5%,var(--vibeui-app-001-bg));
--vibeui-app-001-screen:#151428;
--vibeui-app-001-screen-fg:#f4f2fb;
--vibeui-app-001-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-app-001-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="app-001"]{color-scheme:dark}
:where([data-vibeui-block="app-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="app-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="app-001"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-app-001-panel);color:var(--vibeui-app-001-fg);font-family:var(--vibeui-app-001-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="app-001"] *{box-sizing:border-box}
[data-vibeui-block="app-001"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="app-001"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.8rem;font-weight:600;color:var(--vibeui-app-001-accent)}
[data-vibeui-block="app-001"] [data-part="title"]{margin:0 0 2.5rem;font-weight:800;font-size:clamp(2rem,5cqi,3.4rem);line-height:1.05;letter-spacing:-.03em;max-width:40rem}
[data-vibeui-block="app-001"] [data-part="grid"]{display:grid;gap:2rem;align-items:start}
[data-vibeui-block="app-001"] [data-part="list"]{display:grid;gap:1rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="app-001"] [data-part="f"]{position:relative;padding:1.4rem 1.4rem 1.4rem 1.8rem;border-radius:1.2rem;background:var(--vibeui-app-001-bg);box-shadow:0 0 0 1px var(--vibeui-app-001-line);min-height:11rem;transition:box-shadow .3s,transform .3s}
[data-vibeui-block="app-001"] [data-part="f"]::before{content:"";position:absolute;left:0;top:1.4rem;bottom:1.4rem;width:3px;border-radius:3px;background:var(--vibeui-app-001-line);transition:background .3s}
[data-vibeui-block="app-001"] [data-part="f"][data-active="true"]{box-shadow:0 0 0 1px var(--vibeui-app-001-accent),0 20px 40px -30px rgb(0 0 0 / .4);transform:translateX(.3rem)}
[data-vibeui-block="app-001"] [data-part="f"][data-active="true"]::before{background:var(--vibeui-app-001-accent)}
[data-vibeui-block="app-001"] [data-part="f"] h3{margin:0;font-size:1.5rem;font-weight:800;letter-spacing:-.02em;line-height:1.1}
[data-vibeui-block="app-001"] [data-part="f"] p{margin:.6rem 0 0;color:var(--vibeui-app-001-muted);font-size:1.05rem;max-width:30rem}
[data-vibeui-block="app-001"] [data-part="f"] [data-part="mini"]{display:none}
[data-vibeui-block="app-001"] [data-part="sticky"]{display:none;position:sticky;top:5rem;justify-content:center}
[data-vibeui-block="app-001"] [data-part="phone"]{position:relative;width:17rem;aspect-ratio:9 / 19;border-radius:2.4rem;background:#0b0b16;padding:.55rem;box-shadow:0 40px 80px -30px rgb(0 0 0 / .6),0 0 0 2px #2a2a3a,0 0 0 6px #0b0b16}
[data-vibeui-block="app-001"] [data-part="phone"]::before{content:"";position:absolute;left:50%;top:.85rem;width:4.5rem;height:1.3rem;border-radius:999px;background:#0b0b16;transform:translateX(-50%);z-index:2}
[data-vibeui-block="app-001"] [data-part="screen"]{position:relative;height:100%;border-radius:1.9rem;background:var(--vibeui-app-001-screen);color:var(--vibeui-app-001-screen-fg);overflow:hidden}
[data-vibeui-block="app-001"] [data-part="view"]{position:absolute;inset:0;padding:3rem 1.2rem 1.4rem;display:grid;grid-template-rows:auto 1fr;gap:1rem;opacity:0;transform:translateY(1rem);transition:opacity .45s,transform .45s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="app-001"] [data-part="view"][data-on="true"]{opacity:1;transform:none}
[data-vibeui-block="app-001"] [data-part="vt"]{font-size:.8rem;font-weight:600;opacity:.75;text-align:center}
[data-vibeui-block="app-001"] [data-part="orb"]{align-self:center;justify-self:center;width:7rem;height:7rem;border-radius:50%;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-app-001-accent) 90%,white),var(--vibeui-app-001-accent) 60%,transparent 72%);animation:vibeui-app-001-breath 6s ease-in-out infinite}
[data-vibeui-block="app-001"] [data-part="bars"]{align-self:end;display:flex;align-items:flex-end;gap:.35rem;height:7rem}
[data-vibeui-block="app-001"] [data-part="bars"] i{flex:1;border-radius:.3rem .3rem 0 0;background:color-mix(in oklab,var(--vibeui-app-001-accent) 70%,white);height:calc(var(--vibeui-app-001-h) * 100%);transform-origin:bottom;animation:vibeui-app-001-grow .8s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-app-001-i) * .08s)}
[data-vibeui-block="app-001"] [data-part="bars"] i:nth-child(odd){background:color-mix(in oklab,var(--vibeui-app-001-accent) 40%,transparent)}
[data-vibeui-block="app-001"] [data-part="clock"]{align-self:center;text-align:center;font-family:var(--vibeui-app-001-mono)}
[data-vibeui-block="app-001"] [data-part="clock"] b{display:block;font-size:2.8rem;font-weight:500;letter-spacing:-.04em;line-height:1}
[data-vibeui-block="app-001"] [data-part="clock"] small{display:block;margin-top:.5rem;font-size:.7rem;opacity:.7}
[data-vibeui-block="app-001"] [data-part="clock"] span{display:inline-block;margin-top:1rem;padding:.35rem .8rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-app-001-accent) 25%,transparent);font-size:.7rem;font-family:var(--vibeui-app-001-font);font-weight:600}
[data-vibeui-block="app-001"] [data-part="days"]{align-self:center;display:grid;grid-template-columns:repeat(7,1fr);gap:.35rem}
[data-vibeui-block="app-001"] [data-part="days"] i{aspect-ratio:1;border-radius:.4rem;background:rgb(255 255 255 / .08)}
[data-vibeui-block="app-001"] [data-part="days"] i[data-on="true"]{background:var(--vibeui-app-001-accent);animation:vibeui-app-001-pop .4s cubic-bezier(.2,1.5,.4,1) both;animation-delay:calc(var(--vibeui-app-001-i) * .04s)}
[data-vibeui-block="app-001"] [data-part="days"] b{grid-column:1 / -1;text-align:center;font-family:var(--vibeui-app-001-mono);font-weight:500;font-size:1.4rem;margin-top:.6rem}
@keyframes vibeui-app-001-breath{0%,100%{transform:scale(.7)}50%{transform:scale(1)}}
@keyframes vibeui-app-001-grow{from{transform:scaleY(0)}to{transform:none}}
@keyframes vibeui-app-001-pop{from{transform:scale(0)}to{transform:none}}
@container (min-width: 60rem){[data-vibeui-block="app-001"] [data-part="grid"]{grid-template-columns:minmax(0,1fr) 22rem;gap:4rem}[data-vibeui-block="app-001"] [data-part="sticky"]{display:flex}[data-vibeui-block="app-001"] [data-part="f"]{min-height:13rem;display:grid;align-content:center;padding:2rem 2rem 2rem 2.4rem}}
@container (max-width: 59.98rem){[data-vibeui-block="app-001"] [data-part="f"] [data-part="mini"]{display:block;margin-top:1rem;font-family:var(--vibeui-app-001-mono);font-size:.72rem;color:var(--vibeui-app-001-accent)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="app-001"] *{animation:none!important;transition:none!important}}`

const DEFAULT_FEATURES: App001Feature[] = [
  { title: "Дыхание, которое ведёт", text: "Круг растёт и сжимается, а вы просто следуете. Три практики: 4-7-8, коробочное, «вечер».", screen: "breath", screenTitle: "Вечернее дыхание" },
  { title: "Сон по фазам, а не по часам", text: "Телефон слушает дыхание рядом с подушкой и рисует ночь: глубокий, лёгкий, пробуждения.", screen: "sleep", screenTitle: "Эта ночь · 7 ч 42 мин" },
  { title: "Будильник в лёгкой фазе", text: "Окно в 30 минут: разбудим, когда сон уже поверхностный, — без разбитости.", screen: "alarm", screenTitle: "Будильник" },
  { title: "Серия дней вместо графиков", text: "Один экран: сколько дней подряд вы ложились вовремя. Дни, а не проценты.", screen: "stats", screenTitle: "Сентябрь" },
]

const BARS = [0.55, 0.9, 0.7, 0.85, 0.6, 0.95, 0.75]
const DAYS = [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

function Screen({ kind, title, on }: { kind: App001Feature["screen"]; title?: string; on: boolean }) {
  return (
    <div data-part="view" data-on={on} aria-hidden={!on}>
      <div data-part="vt">{title}</div>
      {kind === "breath" ? <div data-part="orb" /> : null}
      {kind === "sleep" ? (
        <div data-part="bars">
          {BARS.map((h, i) => (
            <i key={i} style={{ ["--vibeui-app-001-h" as string]: h, ["--vibeui-app-001-i" as string]: i }} />
          ))}
        </div>
      ) : null}
      {kind === "alarm" ? (
        <div data-part="clock">
          <b>06:40</b>
          <small>окно 06:20 — 06:50</small>
          <span>лёгкая фаза</span>
        </div>
      ) : null}
      {kind === "stats" ? (
        <div data-part="days">
          {DAYS.map((d, i) => (
            <i key={i} data-on={d === 1} style={{ ["--vibeui-app-001-i" as string]: i }} />
          ))}
          <b>18 дней подряд</b>
        </div>
      ) : null}
    </div>
  )
}

/** Возможности с липким CSS-телефоном, экран меняется по прокрутке. */
export function App001({
  eyebrow = "Что внутри",
  title = "Четыре экрана, которые вы откроете перед сном",
  features = DEFAULT_FEATURES,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: App001Props) {
  const list = useRef<HTMLOListElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const items = Array.from(list.current?.children ?? []) as HTMLElement[]
    if (items.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(items.indexOf(visible.target as HTMLElement))
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.5, 1] },
    )
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [features])

  const palette = {
    ...(accent ? { "--vibeui-app-001-accent": accent } : null),
    ...(ink ? { "--vibeui-app-001-fg": ink } : null),
    ...(background ? { "--vibeui-app-001-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-app-001" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="app-001" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          <div data-part="grid">
            <ol ref={list} data-part="list">
              {features.map((feature, index) => (
                <li key={feature.title} data-part="f" data-active={index === active}>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                  <span data-part="mini">
                    экран · {feature.screenTitle ?? feature.screen}
                  </span>
                </li>
              ))}
            </ol>
            <div data-part="sticky">
              <div data-part="phone" aria-label="Экран приложения">
                <div data-part="screen">
                  {features.map((feature, index) => (
                    <Screen key={feature.title} kind={feature.screen} title={feature.screenTitle} on={index === active} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
