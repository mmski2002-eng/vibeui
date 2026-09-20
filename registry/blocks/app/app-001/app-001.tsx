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
  /** Текст на макетах экранов будильника и серии, подпись «экран ·» и aria телефона. */
  alarmWindow?: string
  alarmPhase?: string
  streak?: string
  screenPrefix?: string
  phoneLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Возможности с липким телефоном: слева список фич, каждая — экран высотой
// в половину окна; телефон из CSS прилипает справа, и по мере прокрутки
// его экран «свайпается» на тот, что напротив активной фичи (IntersectionObserver
// по каждой фиче, уходящий экран уезжает влево, новый въезжает справа с
// кроссфейдом). Активная фича подсвечена, а полоска слева заполняется по мере
// прокрутки через неё (доля считается в rAF по scroll). Телефон слегка
// поворачивается вслед за прогрессом. Четыре экрана нарисованы CSS: дыхание,
// график сна, будильник, серия дней. Заголовок и карточки въезжают каскадом.
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
--vibeui-app-001-p:0;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="app-001"]{color-scheme:dark}
:where([data-vibeui-block="app-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="app-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="app-001"]{box-sizing:border-box;position:relative;overflow:hidden;padding:5rem 0;background:var(--vibeui-app-001-panel);color:var(--vibeui-app-001-fg);font-family:var(--vibeui-app-001-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="app-001"] *{box-sizing:border-box}
[data-vibeui-block="app-001"] [data-part="mesh"]{position:absolute;inset:0;pointer-events:none}
[data-vibeui-block="app-001"] [data-part="mesh"] i{position:absolute;border-radius:50%;filter:blur(50px);opacity:.5;animation:vibeui-app-001-float 18s ease-in-out infinite alternate}
[data-vibeui-block="app-001"] [data-part="mesh"] i:nth-child(1){right:-10%;top:10%;width:40%;aspect-ratio:1;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-app-001-accent) 30%,transparent),transparent 65%)}
[data-vibeui-block="app-001"] [data-part="mesh"] i:nth-child(2){left:-15%;bottom:-10%;width:45%;aspect-ratio:1;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-app-001-accent) 16%,#ff9ad5),transparent 65%);animation-delay:-9s;opacity:.35}
[data-vibeui-block="app-001"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="app-001"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.8rem;font-weight:600;color:var(--vibeui-app-001-accent)}
[data-vibeui-block="app-001"] [data-part="title"]{margin:0 0 2.5rem;font-weight:800;font-size:clamp(2.2rem,5.6cqi,4rem);line-height:1.02;letter-spacing:-.035em;max-width:44rem}
[data-vibeui-block="app-001"] [data-part="w"]{display:inline-block;overflow:hidden;vertical-align:bottom;padding:.06em .04em .12em 0;margin:-.06em 0 -.12em}
[data-vibeui-block="app-001"] [data-part="w"] span{display:inline-block;transition:transform 1s cubic-bezier(.2,.8,.2,1);transition-delay:calc(var(--vibeui-app-001-i) * .06s)}
[data-vibeui-block="app-001"][data-motion="true"] [data-reveal]:not([data-in="true"]) [data-part="w"] span{transform:translateY(112%)}
[data-vibeui-block="app-001"] [data-part="grid"]{display:grid;gap:2rem;align-items:start}
[data-vibeui-block="app-001"] [data-part="list"]{display:grid;gap:1rem;margin:0;padding:0;list-style:none;counter-reset:vibeui-app-001}
[data-vibeui-block="app-001"] [data-part="f"]{position:relative;padding:1.4rem 1.4rem 1.4rem 1.9rem;border-radius:1.3rem;background:var(--vibeui-app-001-bg);box-shadow:0 0 0 1px var(--vibeui-app-001-line);min-height:11rem;counter-increment:vibeui-app-001;transition:box-shadow .5s,transform .7s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="app-001"][data-motion="true"] [data-part="f"]:not([data-in="true"]){opacity:0}
[data-vibeui-block="app-001"] [data-part="f"][data-in="true"]{animation:vibeui-app-001-rise .8s cubic-bezier(.2,.8,.2,1) backwards;animation-delay:calc(var(--vibeui-app-001-i) * .09s)}
[data-vibeui-block="app-001"] [data-part="f"]::before{content:"";position:absolute;left:0;top:1.4rem;bottom:1.4rem;width:3px;border-radius:3px;background:var(--vibeui-app-001-line)}
[data-vibeui-block="app-001"] [data-part="f"]::after{content:"";position:absolute;left:0;top:1.4rem;bottom:1.4rem;width:3px;border-radius:3px;background:var(--vibeui-app-001-accent);transform:scaleY(0);transform-origin:top;transition:transform .15s linear}
[data-vibeui-block="app-001"] [data-part="f"][data-active="true"]{box-shadow:0 0 0 1px var(--vibeui-app-001-accent),0 30px 60px -30px color-mix(in oklab,var(--vibeui-app-001-accent) 55%,transparent);transform:translateX(.4rem)}
[data-vibeui-block="app-001"] [data-part="f"][data-active="true"]::after{transform:scaleY(var(--vibeui-app-001-p))}
[data-vibeui-block="app-001"] [data-part="f"][data-done="true"]::after{transform:scaleY(1)}
[data-vibeui-block="app-001"] [data-part="f"] h3{margin:0;font-size:1.5rem;font-weight:800;letter-spacing:-.02em;line-height:1.1}
[data-vibeui-block="app-001"] [data-part="f"] h3::before{content:"0" counter(vibeui-app-001);display:block;margin-bottom:.6rem;font-family:var(--vibeui-app-001-mono);font-size:.72rem;font-weight:500;letter-spacing:.08em;color:var(--vibeui-app-001-muted);transition:color .3s}
[data-vibeui-block="app-001"] [data-part="f"][data-active="true"] h3::before{color:var(--vibeui-app-001-accent)}
[data-vibeui-block="app-001"] [data-part="f"] p{margin:.6rem 0 0;color:var(--vibeui-app-001-muted);font-size:1.05rem;max-width:30rem}
[data-vibeui-block="app-001"] [data-part="f"] [data-part="mini"]{display:none}
[data-vibeui-block="app-001"] [data-part="sticky"]{display:none;position:sticky;top:5rem;justify-content:center;perspective:1400px}
[data-vibeui-block="app-001"] [data-part="phone"]{position:relative;width:17rem;aspect-ratio:9 / 19;border-radius:2.4rem;background:#0b0b16;padding:.55rem;box-shadow:0 60px 100px -36px color-mix(in oklab,var(--vibeui-app-001-accent) 60%,transparent),0 30px 50px -30px rgb(0 0 0 / .6),0 0 0 2px #2a2a3a,0 0 0 6px #0b0b16;transform:rotateY(calc((var(--vibeui-app-001-p) - .5) * -10deg)) rotateX(calc((var(--vibeui-app-001-p) - .5) * 4deg));transition:transform .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="app-001"] [data-part="phone"]::before{content:"";position:absolute;left:50%;top:.85rem;width:4.5rem;height:1.3rem;border-radius:999px;background:#0b0b16;transform:translateX(-50%);z-index:2}
[data-vibeui-block="app-001"] [data-part="phone"]::after{content:"";position:absolute;inset:.55rem;border-radius:1.9rem;background:linear-gradient(115deg,transparent 40%,rgb(255 255 255 / .1) 50%,transparent 60%);pointer-events:none;z-index:3}
[data-vibeui-block="app-001"] [data-part="screen"]{position:relative;height:100%;border-radius:1.9rem;background:var(--vibeui-app-001-screen);color:var(--vibeui-app-001-screen-fg);overflow:hidden}
[data-vibeui-block="app-001"] [data-part="view"]{position:absolute;inset:0;padding:3rem 1.2rem 1.4rem;display:grid;grid-template-rows:auto 1fr;gap:1rem;opacity:0;transition:opacity .5s,transform .65s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="app-001"] [data-part="view"][data-pos="before"]{transform:translateX(-45%) scale(.94)}
[data-vibeui-block="app-001"] [data-part="view"][data-pos="after"]{transform:translateX(45%) scale(.94)}
[data-vibeui-block="app-001"] [data-part="view"][data-on="true"]{opacity:1;transform:none}
[data-vibeui-block="app-001"] [data-part="vt"]{font-size:.8rem;font-weight:600;opacity:.75;text-align:center}
[data-vibeui-block="app-001"] [data-part="orb"]{align-self:center;justify-self:center;width:7rem;height:7rem;border-radius:50%;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-app-001-accent) 90%,white),var(--vibeui-app-001-accent) 60%,transparent 72%);animation:vibeui-app-001-breath 6s ease-in-out infinite;box-shadow:0 0 60px color-mix(in oklab,var(--vibeui-app-001-accent) 50%,transparent)}
[data-vibeui-block="app-001"] [data-part="bars"]{align-self:end;display:flex;align-items:flex-end;gap:.35rem;height:7rem}
[data-vibeui-block="app-001"] [data-part="bars"] i{flex:1;border-radius:.3rem .3rem 0 0;background:color-mix(in oklab,var(--vibeui-app-001-accent) 70%,white);height:calc(var(--vibeui-app-001-h) * 100%);transform-origin:bottom;transform:scaleY(0);transition:transform .8s cubic-bezier(.2,.8,.2,1);transition-delay:calc(var(--vibeui-app-001-i) * .08s + .3s)}
[data-vibeui-block="app-001"] [data-part="view"][data-on="true"] [data-part="bars"] i{transform:none}
[data-vibeui-block="app-001"] [data-part="bars"] i:nth-child(odd){background:color-mix(in oklab,var(--vibeui-app-001-accent) 40%,transparent)}
[data-vibeui-block="app-001"] [data-part="clock"]{align-self:center;text-align:center;font-family:var(--vibeui-app-001-mono)}
[data-vibeui-block="app-001"] [data-part="clock"] b{display:block;font-size:2.8rem;font-weight:500;letter-spacing:-.04em;line-height:1}
[data-vibeui-block="app-001"] [data-part="clock"] b::after{content:"";display:inline-block;width:.35rem;height:.35rem;margin-left:.3rem;border-radius:50%;vertical-align:middle;background:var(--vibeui-app-001-accent);animation:vibeui-app-001-blink 1.6s ease-in-out infinite}
[data-vibeui-block="app-001"] [data-part="clock"] small{display:block;margin-top:.5rem;font-size:.7rem;opacity:.7}
[data-vibeui-block="app-001"] [data-part="clock"] span{display:inline-block;margin-top:1rem;padding:.35rem .8rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-app-001-accent) 25%,transparent);font-size:.7rem;font-family:var(--vibeui-app-001-font);font-weight:600}
[data-vibeui-block="app-001"] [data-part="days"]{align-self:center;display:grid;grid-template-columns:repeat(7,1fr);gap:.35rem}
[data-vibeui-block="app-001"] [data-part="days"] i{aspect-ratio:1;border-radius:.4rem;background:rgb(255 255 255 / .08)}
[data-vibeui-block="app-001"] [data-part="days"] i[data-on="true"]{background:var(--vibeui-app-001-accent);transform:scale(0);transition:transform .4s cubic-bezier(.2,1.5,.4,1);transition-delay:calc(var(--vibeui-app-001-i) * .04s + .3s)}
[data-vibeui-block="app-001"] [data-part="view"][data-on="true"] [data-part="days"] i[data-on="true"]{transform:none}
[data-vibeui-block="app-001"] [data-part="days"] b{grid-column:1 / -1;text-align:center;font-family:var(--vibeui-app-001-mono);font-weight:500;font-size:1.4rem;margin-top:.6rem}
@keyframes vibeui-app-001-breath{0%,100%{transform:scale(.7)}50%{transform:scale(1)}}
@keyframes vibeui-app-001-rise{from{opacity:0;transform:translateY(2rem)}}
@keyframes vibeui-app-001-blink{0%,100%{opacity:.3}50%{opacity:1}}
@keyframes vibeui-app-001-float{from{transform:translate(0,0)}to{transform:translate(-8%,10%)}}
@container (min-width: 60rem){[data-vibeui-block="app-001"] [data-part="grid"]{grid-template-columns:minmax(0,1fr) 22rem;gap:4rem}[data-vibeui-block="app-001"] [data-part="sticky"]{display:flex}[data-vibeui-block="app-001"] [data-part="f"]{min-height:13rem;display:grid;align-content:center;padding:2rem 2rem 2rem 2.4rem}}
@container (max-width: 59.98rem){[data-vibeui-block="app-001"] [data-part="f"] [data-part="mini"]{display:block;margin-top:1rem;font-family:var(--vibeui-app-001-mono);font-size:.72rem;color:var(--vibeui-app-001-accent)}}
[data-vibeui-block="app-001"] [data-part="w"]:not(:last-child)::after{content:"\\00a0"}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="app-001"] *{animation:none!important;transition:none!important}[data-vibeui-block="app-001"] [data-part="f"],[data-vibeui-block="app-001"] [data-part="w"] span{opacity:1!important;transform:none!important}}`

const DEFAULT_FEATURES: App001Feature[] = [
  { title: "Дыхание, которое ведёт", text: "Круг растёт и сжимается, а вы просто следуете. Три практики: 4-7-8, коробочное, «вечер».", screen: "breath", screenTitle: "Вечернее дыхание" },
  { title: "Сон по фазам, а не по часам", text: "Телефон слушает дыхание рядом с подушкой и рисует ночь: глубокий, лёгкий, пробуждения.", screen: "sleep", screenTitle: "Эта ночь · 7 ч 42 мин" },
  { title: "Будильник в лёгкой фазе", text: "Окно в 30 минут: разбудим, когда сон уже поверхностный, — без разбитости.", screen: "alarm", screenTitle: "Будильник" },
  { title: "Серия дней вместо графиков", text: "Один экран: сколько дней подряд вы ложились вовремя. Дни, а не проценты.", screen: "stats", screenTitle: "Сентябрь" },
]

const BARS = [0.55, 0.9, 0.7, 0.85, 0.6, 0.95, 0.75]
const DAYS = [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

function Words({ text }: { text: string }) {
  return text.split(/\s+/).map((word, index) => (
    <span data-part="w" key={index} style={{ ["--vibeui-app-001-i" as string]: index }}>
      <span>{word}</span>
    </span>
  ))
}

function Screen({ kind, title, pos, alarmWindow, alarmPhase, streak }: { kind: App001Feature["screen"]; title?: string; pos: "before" | "on" | "after"; alarmWindow: string; alarmPhase: string; streak: string }) {
  const on = pos === "on"
  return (
    <div data-part="view" data-on={on} data-pos={on ? undefined : pos} aria-hidden={!on}>
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
          <small>{alarmWindow}</small>
          <span>{alarmPhase}</span>
        </div>
      ) : null}
      {kind === "stats" ? (
        <div data-part="days">
          {DAYS.map((d, i) => (
            <i key={i} data-on={d === 1} style={{ ["--vibeui-app-001-i" as string]: i }} />
          ))}
          <b>{streak}</b>
        </div>
      ) : null}
    </div>
  )
}

/** Возможности с липким CSS-телефоном, экран «свайпается» по прокрутке. */
export function App001({
  eyebrow = "Что внутри",
  title = "Четыре экрана, которые вы откроете перед сном",
  features = DEFAULT_FEATURES,
  alarmWindow = "окно 06:20 — 06:50",
  alarmPhase = "лёгкая фаза",
  streak = "18 дней подряд",
  screenPrefix = "экран",
  phoneLabel = "Экран приложения",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: App001Props) {
  const root = useRef<HTMLElement>(null)
  const list = useRef<HTMLOListElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const element = root.current
    if (!element) return
    element.dataset.motion = "true"
    const targets = Array.from(element.querySelectorAll<HTMLElement>("[data-reveal]"))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          ;(entry.target as HTMLElement).dataset.in = "true"
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    )
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

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

  useEffect(() => {
    const element = root.current
    const item = list.current?.children[active] as HTMLElement | undefined
    if (!element || !item) return
    let frame = 0
    const measure = () => {
      frame = 0
      const rect = item.getBoundingClientRect()
      const middle = window.innerHeight / 2
      const progress = Math.min(1, Math.max(0, (middle - rect.top) / Math.max(1, rect.height)))
      element.style.setProperty("--vibeui-app-001-p", progress.toFixed(3))
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [active])

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
      <section ref={root} data-vibeui-block="app-001" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="mesh" aria-hidden="true">
          <i />
          <i />
        </div>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title" data-reveal="">
            <Words text={title} />
          </h2>
          <div data-part="grid">
            <ol ref={list} data-part="list">
              {features.map((feature, index) => (
                <li key={feature.title} data-part="f" data-reveal="" data-active={index === active} data-done={index < active} style={{ ["--vibeui-app-001-i" as string]: index }}>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                  <span data-part="mini">
                    {screenPrefix} · {feature.screenTitle ?? feature.screen}
                  </span>
                </li>
              ))}
            </ol>
            <div data-part="sticky">
              <div data-part="phone" aria-label={phoneLabel}>
                <div data-part="screen">
                  {features.map((feature, index) => (
                    <Screen key={feature.title} kind={feature.screen} title={feature.screenTitle} pos={index === active ? "on" : index < active ? "before" : "after"} alarmWindow={alarmWindow} alarmPhase={alarmPhase} streak={streak} />
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
