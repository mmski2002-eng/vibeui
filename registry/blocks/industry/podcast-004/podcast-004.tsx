"use client"

import { Fragment, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Podcast004Episode = {
  id: string
  number: string
  title: string
  guest?: string
  text?: string
  cover?: string
  /** Длительность в минутах — от неё длина полосы. */
  minutes: number
  date?: string
  tags?: readonly string[]
}

export type Podcast004Props = {
  eyebrow?: string
  title?: string
  lede?: string
  episodes?: readonly Podcast004Episode[]
  playLabel?: string
  minuteLabel?: string
  moreLabel?: string
  moreHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Лента эпизодов, где длительность — это длина: у каждой строки полоса,
// пропорциональная минутам (от самого длинного), номер моноширинным, обложка
// квадратом. Заголовок въезжает словами через маски, строки проявляются
// каскадом, когда лента попадает в кадр, полосы дорастают до своей длины.
// По наведению строка раскрывает описание и теги, под курсором ходит
// spotlight, обложка наклоняется за ним (3D-tilt), а по полосе бежит
// «дорожка» воспроизведения. Play шлёт событие `vibeui-player:play` — его
// ловит мини-плеер (podcast-007) и шапка. Текущий эпизод подсвечен по
// ответному событию `vibeui-player:state`, и его дорожка бежит постоянно.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Sofia+Sans+Extra+Condensed:wght@700;800&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="podcast-004"]){
--vibeui-podcast-004-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-podcast-004-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-podcast-004-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-podcast-004-on-accent:oklch(from var(--vibeui-podcast-004-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-podcast-004-muted:color-mix(in oklab,var(--vibeui-podcast-004-fg) 60%,var(--vibeui-podcast-004-bg));
--vibeui-podcast-004-panel:color-mix(in oklab,var(--vibeui-podcast-004-fg) 6%,var(--vibeui-podcast-004-bg));
--vibeui-podcast-004-line:color-mix(in oklab,var(--vibeui-podcast-004-fg) 12%,transparent);
--vibeui-podcast-004-display:"Sofia Sans Extra Condensed",Impact,"Arial Narrow",sans-serif;
--vibeui-podcast-004-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-podcast-004-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-podcast-004-ease:cubic-bezier(.2,.8,.2,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="podcast-004"]{color-scheme:dark}
:where([data-vibeui-block="podcast-004"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="podcast-004"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="podcast-004"]{box-sizing:border-box;position:relative;padding:6rem 0;background:var(--vibeui-podcast-004-bg);color:var(--vibeui-podcast-004-fg);font-family:var(--vibeui-podcast-004-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="podcast-004"] *{box-sizing:border-box}
[data-vibeui-block="podcast-004"] [data-part="all"]{margin-top:1.8rem}
[data-vibeui-block="podcast-004"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="podcast-004"] [data-part="eyebrow"]{margin:0 0 .9rem;font-family:var(--vibeui-podcast-004-mono);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-podcast-004-accent);animation:vibeui-podcast-004-up .7s var(--vibeui-podcast-004-ease) both paused}
[data-vibeui-block="podcast-004"] [data-part="title"]{margin:0;font-family:var(--vibeui-podcast-004-display);font-weight:800;font-size:clamp(3.6rem,10.5cqi,8.25rem);line-height:.88;letter-spacing:-.015em;text-transform:uppercase;text-wrap:balance}
[data-vibeui-block="podcast-004"] [data-part="w"]{display:inline-block;overflow:hidden;vertical-align:top;padding:.04em .08em .12em 0;margin:-.04em 0 -.12em 0}
[data-vibeui-block="podcast-004"] [data-part="w"] i{display:inline-block;font-style:normal;animation:vibeui-podcast-004-word .9s var(--vibeui-podcast-004-ease) both paused;animation-delay:calc(var(--vibeui-podcast-004-i) * 80ms)}
[data-vibeui-block="podcast-004"] [data-part="lede"]{margin:1.2rem 0 0;max-width:34rem;color:var(--vibeui-podcast-004-muted);animation:vibeui-podcast-004-up .8s var(--vibeui-podcast-004-ease) .3s both paused}
[data-vibeui-block="podcast-004"] [data-part="list"]{list-style:none;margin:3rem 0 0;padding:0;border-top:1px solid var(--vibeui-podcast-004-line);perspective:1200px}
[data-vibeui-block="podcast-004"] [data-part="row"]{position:relative;display:grid;grid-template-columns:auto 1fr auto;gap:1.2rem;align-items:center;padding:1.2rem .8rem;margin:0 -.8rem;border-bottom:1px solid var(--vibeui-podcast-004-line);border-radius:1rem;transition:background .3s;animation:vibeui-podcast-004-up .8s var(--vibeui-podcast-004-ease) both paused;animation-delay:calc(.25s + var(--vibeui-podcast-004-i) * 90ms)}
[data-vibeui-block="podcast-004"][data-in="true"] [data-part="row"],[data-vibeui-block="podcast-004"][data-in="true"] [data-part="w"] i,[data-vibeui-block="podcast-004"][data-in="true"] [data-part="eyebrow"],[data-vibeui-block="podcast-004"][data-in="true"] [data-part="lede"]{animation-play-state:running}
[data-vibeui-block="podcast-004"] [data-part="row"]::before{content:"";position:absolute;inset:0;border-radius:inherit;background:radial-gradient(28rem circle at var(--vibeui-podcast-004-x,50%) var(--vibeui-podcast-004-y,50%),color-mix(in oklab,var(--vibeui-podcast-004-accent) 14%,transparent),transparent 45%);opacity:0;transition:opacity .4s;pointer-events:none}
[data-vibeui-block="podcast-004"] [data-part="row"]:hover::before,[data-vibeui-block="podcast-004"] [data-part="row"]:focus-within::before{opacity:1}
[data-vibeui-block="podcast-004"] [data-part="row"]:hover,[data-vibeui-block="podcast-004"] [data-part="row"]:focus-within{background:var(--vibeui-podcast-004-panel)}
[data-vibeui-block="podcast-004"] [data-part="row"][data-current="true"]{background:color-mix(in oklab,var(--vibeui-podcast-004-accent) 10%,transparent)}
[data-vibeui-block="podcast-004"] [data-part="row"] > *{position:relative}
[data-vibeui-block="podcast-004"] [data-part="cover"]{width:5.4rem;height:5.4rem;border-radius:.8rem;overflow:hidden;background:var(--vibeui-podcast-004-panel);flex:none;box-shadow:0 12px 30px -14px rgb(0 0 0 / .8);transform:rotateX(calc(var(--vibeui-podcast-004-ty,0) * -14deg)) rotateY(calc(var(--vibeui-podcast-004-tx,0) * 16deg));transition:transform .35s var(--vibeui-podcast-004-ease),box-shadow .35s;transform-style:preserve-3d}
[data-vibeui-block="podcast-004"] [data-part="row"]:hover [data-part="cover"]{box-shadow:0 20px 40px -16px rgb(0 0 0 / .9),0 0 0 1px color-mix(in oklab,var(--vibeui-podcast-004-accent) 50%,transparent)}
[data-vibeui-block="podcast-004"] [data-part="cover"] img{width:100%;height:100%;object-fit:cover;display:block;transform:scale(1.08) translate(calc(var(--vibeui-podcast-004-tx,0) * -3%),calc(var(--vibeui-podcast-004-ty,0) * -3%));transition:transform .35s var(--vibeui-podcast-004-ease)}
[data-vibeui-block="podcast-004"] [data-part="cover"]::after{content:"";position:absolute;inset:0;background:linear-gradient(calc(120deg + var(--vibeui-podcast-004-tx,0) * 40deg),transparent 40%,rgb(255 255 255 / .18) 50%,transparent 60%);opacity:0;transition:opacity .3s;pointer-events:none}
[data-vibeui-block="podcast-004"] [data-part="row"]:hover [data-part="cover"]::after{opacity:1}
[data-vibeui-block="podcast-004"] [data-part="no"]{font-family:var(--vibeui-podcast-004-mono);font-size:.75rem;color:var(--vibeui-podcast-004-accent);letter-spacing:.1em}
[data-vibeui-block="podcast-004"] [data-part="name"]{margin:.2rem 0 0;font-family:var(--vibeui-podcast-004-display);font-weight:700;font-size:1.9rem;line-height:1;text-transform:uppercase;transition:translate .3s var(--vibeui-podcast-004-ease)}
[data-vibeui-block="podcast-004"] [data-part="row"]:hover [data-part="name"]{translate:.25rem 0}
[data-vibeui-block="podcast-004"] [data-part="guest"]{margin:.25rem 0 0;font-size:.9rem;color:var(--vibeui-podcast-004-muted)}
[data-vibeui-block="podcast-004"] [data-part="bar"]{position:relative;height:.5rem;margin-top:.7rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-podcast-004-fg) 10%,transparent);overflow:hidden;container-type:inline-size}
[data-vibeui-block="podcast-004"] [data-part="bar"]::before{content:"";position:absolute;inset:0;width:calc(var(--vibeui-podcast-004-w) * 100%);background:var(--vibeui-podcast-004-accent);border-radius:999px;transform-origin:left;animation:vibeui-podcast-004-grow 1.1s var(--vibeui-podcast-004-ease) both paused;animation-delay:calc(.5s + var(--vibeui-podcast-004-i) * 90ms)}
[data-vibeui-block="podcast-004"][data-in="true"] [data-part="bar"]::before{animation-play-state:running}
[data-vibeui-block="podcast-004"] [data-part="bar"]::after{content:"";position:absolute;top:0;bottom:0;left:0;width:4rem;border-radius:999px;background:linear-gradient(90deg,transparent,rgb(255 255 255 / .85));transform:translateX(-100%);opacity:0}
[data-vibeui-block="podcast-004"] [data-part="row"]:hover [data-part="bar"]::after,[data-vibeui-block="podcast-004"] [data-part="row"]:focus-within [data-part="bar"]::after{opacity:1;animation:vibeui-podcast-004-run 1.4s var(--vibeui-podcast-004-ease) infinite}
[data-vibeui-block="podcast-004"] [data-part="row"][data-current="true"] [data-part="bar"]::after{opacity:1;animation:vibeui-podcast-004-run 2.2s linear infinite}
[data-vibeui-block="podcast-004"] [data-part="more"]{grid-column:2 / -1;display:grid;grid-template-rows:0fr;transition:grid-template-rows .45s var(--vibeui-podcast-004-ease)}
[data-vibeui-block="podcast-004"] [data-part="row"]:hover [data-part="more"],[data-vibeui-block="podcast-004"] [data-part="row"]:focus-within [data-part="more"],[data-vibeui-block="podcast-004"] [data-part="row"][data-current="true"] [data-part="more"]{grid-template-rows:1fr}
[data-vibeui-block="podcast-004"] [data-part="more"] > div{overflow:hidden}
[data-vibeui-block="podcast-004"] [data-part="text"]{margin:.5rem 0 0;color:var(--vibeui-podcast-004-muted);font-size:.92rem;max-width:44rem}
[data-vibeui-block="podcast-004"] [data-part="tags"]{display:flex;gap:.4rem;flex-wrap:wrap;margin:.6rem 0 .2rem;padding:0;list-style:none}
[data-vibeui-block="podcast-004"] [data-part="tags"] li{font-family:var(--vibeui-podcast-004-mono);font-size:.7rem;padding:.25rem .55rem;border-radius:999px;border:1px solid var(--vibeui-podcast-004-line);transition:border-color .2s,color .2s}
[data-vibeui-block="podcast-004"] [data-part="tags"] li:hover{border-color:var(--vibeui-podcast-004-accent);color:var(--vibeui-podcast-004-accent)}
[data-vibeui-block="podcast-004"] [data-part="side"]{display:grid;justify-items:end;gap:.5rem;text-align:right}
[data-vibeui-block="podcast-004"] [data-part="len"]{font-family:var(--vibeui-podcast-004-mono);font-size:.78rem;color:var(--vibeui-podcast-004-muted);font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="podcast-004"] [data-part="play"]{width:3rem;height:3rem;border-radius:50%;border:1px solid var(--vibeui-podcast-004-line);background:var(--vibeui-podcast-004-bg);color:inherit;display:grid;place-items:center;cursor:pointer;transition:background .25s,color .25s,transform .3s var(--vibeui-podcast-004-ease),box-shadow .3s}
[data-vibeui-block="podcast-004"] [data-part="play"]:hover,[data-vibeui-block="podcast-004"] [data-part="row"][data-current="true"] [data-part="play"]{background:var(--vibeui-podcast-004-accent);color:var(--vibeui-podcast-004-on-accent);border-color:transparent;transform:scale(1.1);box-shadow:0 10px 30px -10px var(--vibeui-podcast-004-accent)}
[data-vibeui-block="podcast-004"] [data-part="play"]:active{transform:scale(.96)}
[data-vibeui-block="podcast-004"] [data-part="play"] svg{width:1rem;height:1rem;fill:currentColor}
[data-vibeui-block="podcast-004"] [data-part="play"]:focus-visible,[data-vibeui-block="podcast-004"] a:focus-visible{outline:2px solid var(--vibeui-podcast-004-accent);outline-offset:3px}
@keyframes vibeui-podcast-004-grow{from{transform:scaleX(0)}to{transform:none}}
@keyframes vibeui-podcast-004-run{to{transform:translateX(100cqw)}}
@keyframes vibeui-podcast-004-word{from{translate:0 110%;rotate:3deg}}
@keyframes vibeui-podcast-004-up{from{opacity:0;translate:0 1.4rem}}
@container (max-width: 40rem){[data-vibeui-block="podcast-004"] [data-part="row"]{grid-template-columns:auto 1fr;margin:0;padding:1.2rem .5rem}[data-vibeui-block="podcast-004"] [data-part="side"]{grid-column:1 / -1;grid-auto-flow:column;justify-content:space-between;align-items:center}[data-vibeui-block="podcast-004"] [data-part="cover"]{width:4.4rem;height:4.4rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="podcast-004"] *,[data-vibeui-block="podcast-004"] *::before,[data-vibeui-block="podcast-004"] *::after{animation:none!important;transition:none!important}[data-vibeui-block="podcast-004"] [data-part="cover"]{transform:none!important}}`

const DEFAULT_EPISODES: Podcast004Episode[] = [
  { id: "e112", number: "112", title: "Человек, который зажигает маяк", guest: "Сергей Волков, смотритель маяка", text: "Полтора часа о дне, в котором нет никого, кроме ветра и лампы на сорок километров.", cover: "/demo/podcast/episode-02.webp", minutes: 90, date: "12 сен", tags: ["одиночество", "море", "ремесло"] },
  { id: "e111", number: "111", title: "Тысяча одинаковых чашек", guest: "Аня Резник, керамист", text: "Почему серия сложнее, чем один шедевр, и что делать с браком.", cover: "/demo/podcast/episode-01.webp", minutes: 64, date: "5 сен", tags: ["ремесло", "серия"] },
  { id: "e110", number: "110", title: "Шесть часов над открытым сердцем", guest: "Марат Исмаилов, кардиохирург", text: "О концентрации, музыке в операционной и том, как отдыхать после.", cover: "/demo/podcast/episode-03.webp", minutes: 78, date: "29 авг", tags: ["медицина", "фокус"] },
  { id: "e109", number: "109", title: "Код, который никто не увидит", guest: "Лена Царёва, бэкенд-разработчица", text: "Про невидимую работу, легаси и радость от того, что «просто работает».", cover: "/demo/podcast/episode-04.webp", minutes: 52, date: "22 авг", tags: ["код", "невидимое"] },
  { id: "e108", number: "108", title: "Первый рейс в пять утра", guest: "Игорь Найдёнов, машинист", text: "Рассвет из кабины, тишина в депо и почему он до сих пор волнуется.", cover: "/demo/podcast/episode-05.webp", minutes: 71, date: "15 авг", tags: ["дорога", "рассвет"] },
  { id: "e107", number: "107", title: "Тишина как инструмент", guest: "Ольга Мень, библиотекарь", text: "Как устроен зал, где нельзя говорить, и кто туда приходит на самом деле.", cover: "/demo/podcast/episode-06.webp", minutes: 46, date: "8 авг", tags: ["тишина", "город"] },
]

const clampUnit = (n: number) => Math.max(-1, Math.min(1, n))

/** Лента эпизодов: длительность — длина полосы, play шлёт событие плееру. */
export function Podcast004({
  eyebrow = "Эпизоды",
  title = "Все выпуски",
  lede = "Длина полосы — это длина разговора. Наведите, чтобы прочитать, о чём он; нажмите play — включится внизу.",
  episodes = DEFAULT_EPISODES,
  playLabel = "Слушать",
  minuteLabel = "мин",
  moreLabel = "Архив: ещё 106 эпизодов",
  moreHref = "#",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Podcast004Props) {
  const root = useRef<HTMLElement>(null)
  const [current, setCurrent] = useState<string | null>(null)
  const [shown, setShown] = useState(false)
  const longest = Math.max(1, ...episodes.map((episode) => episode.minutes))
  const words = title.split(/\s+/).filter(Boolean)

  useEffect(() => {
    const onState = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string; playing?: boolean }>).detail
      setCurrent(detail?.playing && detail.id ? detail.id : null)
    }
    window.addEventListener("vibeui-player:state", onState)
    return () => window.removeEventListener("vibeui-player:state", onState)
  }, [])

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
      { rootMargin: "-10% 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const play = (episode: Podcast004Episode) => {
    setCurrent(episode.id)
    window.dispatchEvent(new CustomEvent("vibeui-player:play", { detail: { id: episode.id, title: episode.title, number: episode.number, cover: episode.cover, duration: episode.minutes * 60, guest: episode.guest } }))
  }

  const track = (event: PointerEvent<HTMLLIElement>) => {
    if (event.pointerType === "touch") return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    event.currentTarget.style.setProperty("--vibeui-podcast-004-x", `${(x * 100).toFixed(1)}%`)
    event.currentTarget.style.setProperty("--vibeui-podcast-004-y", `${(y * 100).toFixed(1)}%`)
    event.currentTarget.style.setProperty("--vibeui-podcast-004-tx", clampUnit(x * 2 - 1).toFixed(2))
    event.currentTarget.style.setProperty("--vibeui-podcast-004-ty", clampUnit(y * 2 - 1).toFixed(2))
  }
  const untrack = (event: PointerEvent<HTMLLIElement>) => {
    event.currentTarget.style.setProperty("--vibeui-podcast-004-tx", "0")
    event.currentTarget.style.setProperty("--vibeui-podcast-004-ty", "0")
  }

  const palette = {
    ...(accent ? { "--vibeui-podcast-004-accent": accent } : null),
    ...(ink ? { "--vibeui-podcast-004-fg": ink } : null),
    ...(background ? { "--vibeui-podcast-004-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-podcast-004" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="podcast-004" data-tone={tone === "auto" ? undefined : tone} data-in={shown} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">
            {words.map((word, i) => (
              <Fragment key={`${word}-${i}`}>
                <span data-part="w" style={{ ["--vibeui-podcast-004-i" as string]: i }}>
                  <i>{word}</i>
                </span>
                {i < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <ol data-part="list">
            {episodes.map((episode, index) => (
              <li key={episode.id} data-part="row" data-current={current === episode.id} style={{ ["--vibeui-podcast-004-i" as string]: index }} onPointerMove={track} onPointerLeave={untrack}>
                <div data-part="cover">{episode.cover ? <img src={episode.cover} alt="" /> : null}</div>
                <div>
                  <div data-part="no">
                    № {episode.number}
                    {episode.date ? ` · ${episode.date}` : ""}
                  </div>
                  <h3 data-part="name">{episode.title}</h3>
                  {episode.guest ? <p data-part="guest">{episode.guest}</p> : null}
                  <div data-part="bar" aria-hidden="true" style={{ ["--vibeui-podcast-004-w" as string]: episode.minutes / longest }} />
                  <div data-part="more">
                    <div>
                      {episode.text ? <p data-part="text">{episode.text}</p> : null}
                      {episode.tags && episode.tags.length > 0 ? (
                        <ul data-part="tags">
                          {episode.tags.map((tag) => (
                            <li key={tag}>#{tag}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div data-part="side">
                  <span data-part="len">
                    {episode.minutes} {minuteLabel}
                  </span>
                  <button type="button" data-part="play" aria-label={`${playLabel}: ${episode.title}`} onClick={() => play(episode)}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 5.5v13l11-6.5z" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ol>
          {moreLabel ? (
            <Button016
              data-part="all"
              label={moreLabel}
              href={moreHref}
              external={false}
              arrow
              size="md"
              tone="neutral"
              accent={accent}
            />
          ) : null}
        </div>
      </section>
    </>
  )
}
