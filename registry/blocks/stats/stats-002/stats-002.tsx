"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Stats002Stat = {
  value: number
  label: string
  suffix?: string
}

export type Stats002Contributor = {
  name: string
  /** Вклад: число коммитов — от него размер кружка. */
  commits: number
  href?: string
}

export type Stats002Props = {
  eyebrow?: string
  title?: string
  lede?: string
  stats?: readonly Stats002Stat[]
  wallLabel?: string
  /** Подпись графика звёзд. */
  starLabel?: string
  /** История звёзд по месяцам — линия рисуется при появлении. */
  starHistory?: readonly number[]
  contributors?: readonly Stats002Contributor[]
  moreLabel?: string
  moreHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Сообщество проекта: три числа считают вверх при появлении, справа
// график звёзд за год — линия рисуется штрихом (stroke-dashoffset), точки
// «зажигаются» одна за другой, последняя пульсирует, число докручивается;
// ниже стена контрибьюторов — кружки с инициалами, размер которых зависит
// от числа коммитов, цвет — от хеша имени, появляются каскадом; по
// наведению кружок раскрывает имя и число коммитов. Без фото и внешних
// сервисов: всё из строк. Заголовок въезжает словами через маски.
const FONTS = "https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="stats-002"]){
--vibeui-stats-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-stats-002-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-stats-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-stats-002-muted:color-mix(in oklab,var(--vibeui-stats-002-fg) 60%,var(--vibeui-stats-002-bg));
--vibeui-stats-002-line:color-mix(in oklab,var(--vibeui-stats-002-fg) 12%,transparent);
--vibeui-stats-002-panel:color-mix(in oklab,var(--vibeui-stats-002-fg) 4%,var(--vibeui-stats-002-bg));
--vibeui-stats-002-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-stats-002-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-stats-002-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="stats-002"]{color-scheme:dark}
:where([data-vibeui-block="stats-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="stats-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="stats-002"]{box-sizing:border-box;padding:5.5rem 0;background:var(--vibeui-stats-002-panel);color:var(--vibeui-stats-002-fg);font-family:var(--vibeui-stats-002-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="stats-002"] *{box-sizing:border-box}
[data-vibeui-block="stats-002"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem}
[data-vibeui-block="stats-002"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-stats-002-mono);font-size:.75rem;color:var(--vibeui-stats-002-accent)}
[data-vibeui-block="stats-002"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2.2rem,5.2cqi,3.8rem);line-height:1.02;letter-spacing:-.04em;text-wrap:balance}
[data-vibeui-block="stats-002"] [data-part="w"]{display:inline-block;overflow:hidden;vertical-align:bottom;padding:.05em .1em .18em 0;margin:-.05em -.1em -.18em 0}
[data-vibeui-block="stats-002"] [data-part="w"] > span{display:inline-block;transform:translateY(110%)}
[data-vibeui-block="stats-002"][data-shown="true"] [data-part="w"] > span{animation:vibeui-stats-002-rise .8s var(--vibeui-stats-002-ease) forwards;animation-delay:calc(var(--vibeui-stats-002-i,0) * .05s)}
[data-vibeui-block="stats-002"] [data-reveal]{opacity:0}
[data-vibeui-block="stats-002"][data-shown="true"] [data-reveal]{opacity:1;animation:vibeui-stats-002-up .8s var(--vibeui-stats-002-ease) backwards;animation-delay:calc(.15s + var(--vibeui-stats-002-i,0) * .1s)}
[data-vibeui-block="stats-002"] [data-part="lede"]{margin:1rem 0 0;max-width:30rem;color:var(--vibeui-stats-002-muted);font-size:1.05rem}
[data-vibeui-block="stats-002"] [data-part="side"]{display:grid;gap:1rem}
[data-vibeui-block="stats-002"] [data-part="graph"]{border:1px solid var(--vibeui-stats-002-line);border-radius:14px;padding:1.2rem 1.4rem 1rem;background:var(--vibeui-stats-002-bg);box-shadow:0 30px 70px -45px color-mix(in oklab,var(--vibeui-stats-002-accent) 50%,rgb(0 0 0 / .4))}
[data-vibeui-block="stats-002"] [data-part="ghead"]{display:flex;align-items:baseline;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin:0 0 .6rem}
[data-vibeui-block="stats-002"] [data-part="gnum"]{font-weight:800;font-size:clamp(1.6rem,3cqi,2.2rem);letter-spacing:-.03em;line-height:1;font-variant-numeric:tabular-nums;display:inline-flex;align-items:center;gap:.4rem}
[data-vibeui-block="stats-002"] [data-part="gnum"] svg{width:1.1em;height:1.1em;fill:var(--vibeui-stats-002-accent)}
[data-vibeui-block="stats-002"] [data-part="gdelta"]{font-family:var(--vibeui-stats-002-mono);font-size:.72rem;color:var(--vibeui-stats-002-accent);padding:.2rem .5rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-stats-002-accent) 12%,transparent)}
[data-vibeui-block="stats-002"] [data-part="glabel"]{width:100%;margin:0;font-family:var(--vibeui-stats-002-mono);font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-stats-002-muted)}
[data-vibeui-block="stats-002"] [data-part="svg"]{display:block;width:100%;height:auto;overflow:visible}
[data-vibeui-block="stats-002"] [data-part="area"]{fill:url(#vibeui-stats-002-fade);opacity:0;transition:opacity 1.2s ease 1s}
[data-vibeui-block="stats-002"][data-shown="true"] [data-part="area"]{opacity:1}
[data-vibeui-block="stats-002"] [data-part="line"]{fill:none;stroke:var(--vibeui-stats-002-accent);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:420;stroke-dashoffset:420;transition:stroke-dashoffset 2.2s var(--vibeui-stats-002-ease) .3s}
[data-vibeui-block="stats-002"][data-shown="true"] [data-part="line"]{stroke-dashoffset:0}
[data-vibeui-block="stats-002"] [data-part="dot"]{fill:var(--vibeui-stats-002-bg);stroke:var(--vibeui-stats-002-accent);stroke-width:2;transform:scale(0);transform-box:fill-box;transform-origin:center;transition:transform .45s var(--vibeui-stats-002-ease);transition-delay:calc(.35s + var(--vibeui-stats-002-i) * .15s)}
[data-vibeui-block="stats-002"][data-shown="true"] [data-part="dot"]{transform:none}
[data-vibeui-block="stats-002"] [data-part="dot"][data-last="true"]{fill:var(--vibeui-stats-002-accent)}
[data-vibeui-block="stats-002"] [data-part="ring"]{fill:none;stroke:var(--vibeui-stats-002-accent);stroke-width:1.5;opacity:0;transform-box:fill-box;transform-origin:center}
[data-vibeui-block="stats-002"][data-shown="true"] [data-part="ring"]{animation:vibeui-stats-002-ring 2s ease-out 2.2s infinite}
[data-vibeui-block="stats-002"] [data-part="stats"]{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;margin:1.8rem 0 0;padding:0;list-style:none;border:1px solid var(--vibeui-stats-002-line);border-radius:10px;overflow:hidden;background:var(--vibeui-stats-002-line)}
[data-vibeui-block="stats-002"] [data-part="stats"] li{padding:1rem 1.1rem;background:var(--vibeui-stats-002-bg);transition:background .3s}
[data-vibeui-block="stats-002"] [data-part="stats"] li:hover{background:color-mix(in oklab,var(--vibeui-stats-002-accent) 6%,var(--vibeui-stats-002-bg))}
[data-vibeui-block="stats-002"] [data-part="num"]{display:block;font-weight:800;font-size:clamp(1.6rem,3.4cqi,2.4rem);letter-spacing:-.03em;line-height:1;font-variant-numeric:tabular-nums}
[data-vibeui-block="stats-002"] [data-part="stats"] small{display:block;margin-top:.35rem;font-family:var(--vibeui-stats-002-mono);font-size:.68rem;color:var(--vibeui-stats-002-muted)}
[data-vibeui-block="stats-002"] [data-part="wall"]{border:1px solid var(--vibeui-stats-002-line);border-radius:12px;padding:1.4rem;background:var(--vibeui-stats-002-bg)}
[data-vibeui-block="stats-002"] [data-part="wlabel"]{margin:0 0 1rem;font-family:var(--vibeui-stats-002-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-stats-002-muted)}
[data-vibeui-block="stats-002"] [data-part="people"]{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;margin:0;padding:0;list-style:none}
[data-vibeui-block="stats-002"] [data-part="p"]{position:relative;display:grid;place-items:center;width:calc(2.2rem + var(--vibeui-stats-002-k) * 1.6rem);height:calc(2.2rem + var(--vibeui-stats-002-k) * 1.6rem);border-radius:50%;background:oklch(0.72 0.14 var(--vibeui-stats-002-h));color:#fff;font-family:var(--vibeui-stats-002-mono);font-weight:600;font-size:calc(.65rem + var(--vibeui-stats-002-k) * .3rem);text-decoration:none;transition:transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s}
[data-vibeui-block="stats-002"] [data-part="p"]:hover{transform:scale(1.12);box-shadow:0 0 0 3px var(--vibeui-stats-002-bg),0 0 0 5px var(--vibeui-stats-002-accent);z-index:1}
[data-vibeui-block="stats-002"] [data-part="people"] li{opacity:0}
[data-vibeui-block="stats-002"][data-shown="true"] [data-part="people"] li{opacity:1;animation:vibeui-stats-002-pop .5s var(--vibeui-stats-002-ease) backwards;animation-delay:calc(.6s + var(--vibeui-stats-002-i) * .035s)}
[data-vibeui-block="stats-002"] [data-part="p"] span{position:absolute;left:50%;bottom:calc(100% + .5rem);transform:translate(-50%,.3rem);padding:.35rem .6rem;border-radius:6px;background:var(--vibeui-stats-002-fg);color:var(--vibeui-stats-002-bg);font-size:.68rem;font-weight:500;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .2s,transform .2s}
[data-vibeui-block="stats-002"] [data-part="p"]:hover span,[data-vibeui-block="stats-002"] [data-part="p"]:focus-visible span{opacity:1;transform:translate(-50%,0)}
[data-vibeui-block="stats-002"] [data-part="p"]:focus-visible{outline:2px solid var(--vibeui-stats-002-accent);outline-offset:2px}
[data-vibeui-block="stats-002"] [data-part="more"]{display:inline-block;margin-top:1rem;font-family:var(--vibeui-stats-002-mono);font-size:.78rem;color:var(--vibeui-stats-002-accent);text-decoration:none;transition:transform .3s var(--vibeui-stats-002-ease)}
[data-vibeui-block="stats-002"] [data-part="more"]:hover{transform:translateX(4px)}
@keyframes vibeui-stats-002-rise{to{transform:none}}
@keyframes vibeui-stats-002-up{from{opacity:0;transform:translateY(22px)}}
@keyframes vibeui-stats-002-pop{from{opacity:0;transform:scale(.4)}}
@keyframes vibeui-stats-002-ring{from{opacity:.8;transform:scale(1)}to{opacity:0;transform:scale(3.2)}}
@container (min-width: 60rem){[data-vibeui-block="stats-002"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:4rem;align-items:start}}
[data-vibeui-block="stats-002"] [data-part="w"]:not(:last-child)::after{content:"\\00a0"}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="stats-002"] *{animation:none!important;transition:none!important}[data-vibeui-block="stats-002"] [data-part="w"] > span{transform:none}[data-vibeui-block="stats-002"] [data-reveal],[data-vibeui-block="stats-002"] [data-part="people"] li,[data-vibeui-block="stats-002"] [data-part="area"]{opacity:1}[data-vibeui-block="stats-002"] [data-part="line"]{stroke-dashoffset:0}[data-vibeui-block="stats-002"] [data-part="dot"]{transform:none}}`

const NAMES = ["Аня Кравец", "Bart Meyer", "Илья Сорокин", "Yuki Tanaka", "Марта Гринь", "Diego Alves", "Олег Черных", "Priya Nair", "Настя Ли", "Tom Becker", "Кирилл Ус", "Lea Fischer", "Максим Дуб", "Sofia Rossi", "Женя Пак", "Ahmed Saleh", "Вика Мороз", "Nils Berg", "Данил Роз", "Chloé Martin", "Артём Гай", "Ola Nowak", "Лена Шаль", "Ravi Kumar"]
const DEFAULT_CONTRIBUTORS: Stats002Contributor[] = NAMES.map((name, i) => ({ name, commits: Math.max(1, Math.round(420 / (i + 1) ** 1.1)) }))

const hue = (name: string) => [...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7)
const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

function useCountUp(target: number, run: boolean, duration = 1300) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!run) return
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setValue(target * (1 - Math.pow(1 - t, 3)))
      if (t < 1) raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [run, target, duration])
  return run ? value : 0
}

const format = (value: number, digits: number) => new Intl.NumberFormat("ru-RU", { maximumFractionDigits: digits }).format(value)

function Counter({ stat, run }: { stat: Stats002Stat; run: boolean }) {
  const value = useCountUp(stat.value, run)
  return (
    <li>
      <span data-part="num">
        {format(value, Number.isInteger(stat.value) ? 0 : 1)}
        {stat.suffix ?? ""}
      </span>
      <small>{stat.label}</small>
    </li>
  )
}

function StarGraph({ history, label, run }: { history: readonly number[]; label: string; run: boolean }) {
  const last = history[history.length - 1] ?? 0
  const delta = last - (history[history.length - 2] ?? last)
  const total = useCountUp(last, run, 2200)
  const gain = useCountUp(delta, run, 2200)
  const width = 320
  const height = 110
  const max = Math.max(1, ...history)
  const min = Math.min(...history)
  const points = history.map((value, i) => [(i / Math.max(1, history.length - 1)) * width, 8 + (1 - (value - min) / Math.max(1, max - min)) * (height - 16)] as const)
  const line = points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ")
  const [lx, ly] = points[points.length - 1] ?? [width, height]
  return (
    <div data-part="graph">
      <div data-part="ghead">
        <span data-part="gnum">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" />
          </svg>
          {format(total, 0)}
        </span>
        {delta > 0 ? <span data-part="gdelta">+{format(gain, 0)} за месяц</span> : null}
        {label ? <p data-part="glabel">{label}</p> : null}
      </div>
      <svg data-part="svg" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
        <defs>
          <linearGradient id="vibeui-stats-002-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--vibeui-stats-002-accent)" }} stopOpacity=".28" />
            <stop offset="1" style={{ stopColor: "var(--vibeui-stats-002-accent)" }} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path data-part="area" d={`${line} L${width} ${height} L0 ${height} Z`} />
        <path data-part="line" d={line} />
        <circle data-part="ring" cx={lx} cy={ly} r="5" />
        {points.map(([x, y], i) => (
          <circle key={i} data-part="dot" data-last={i === points.length - 1} cx={x} cy={y} r={i === points.length - 1 ? 5 : 3.5} style={{ ["--vibeui-stats-002-i" as string]: i }} />
        ))}
      </svg>
    </div>
  )
}

/** Сообщество: count-up числа и стена контрибьюторов из инициалов. */
export function Stats002({
  eyebrow = "// сообщество",
  title = "Сделано 214 людьми из 31 страны",
  lede = "Каждый пулреквест ревьюят двое мейнтейнеров, каждый релиз проходит 1 900 тестов. Присоединяйтесь — good first issue всегда есть.",
  stats = [
    { value: 214, label: "контрибьюторов" },
    { value: 12480, label: "звёзд на GitHub" },
    { value: 3.2, label: "млн установок в месяц", suffix: "M" },
  ],
  wallLabel = "Контрибьюторы · размер — вклад",
  starLabel = "звёзды на GitHub · 12 месяцев",
  starHistory = [1240, 1900, 2650, 3400, 4300, 5150, 6400, 7600, 8900, 10150, 11300, 12480],
  contributors = DEFAULT_CONTRIBUTORS,
  moreLabel = "+190 на GitHub →",
  moreHref = "#",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Stats002Props) {
  const root = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)
  const max = Math.max(1, ...contributors.map((c) => c.commits))

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

  const words = title.split(" ").filter(Boolean)
  const at = (value: number) => ({ ["--vibeui-stats-002-i" as string]: value }) as CSSProperties

  const palette = {
    ...(accent ? { "--vibeui-stats-002-accent": accent } : null),
    ...(ink ? { "--vibeui-stats-002-fg": ink } : null),
    ...(background ? { "--vibeui-stats-002-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-stats-002" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="stats-002" data-tone={tone === "auto" ? undefined : tone} data-shown={shown} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? (
              <p data-part="eyebrow" data-reveal="" style={at(-1)}>
                {eyebrow}
              </p>
            ) : null}
            <h2 data-part="title">
              {words.map((word, index) => (
                <span key={index} data-part="w" style={at(index)}>
                  <span>{word}</span>
                  {index < words.length - 1 ? " " : null}
                </span>
              ))}
            </h2>
            {lede ? (
              <p data-part="lede" data-reveal="" style={at(1)}>
                {lede}
              </p>
            ) : null}
            <ul data-part="stats" data-reveal="" style={at(2)}>
              {stats.map((stat) => (
                <Counter key={stat.label} stat={stat} run={shown} />
              ))}
            </ul>
          </div>
          <div data-part="side">
            {starHistory.length > 1 ? (
              <div data-reveal="" style={at(2)}>
                <StarGraph history={starHistory} label={starLabel} run={shown} />
              </div>
            ) : null}
            <div data-part="wall" data-reveal="" style={at(3)}>
              {wallLabel ? <p data-part="wlabel">{wallLabel}</p> : null}
              <ul data-part="people">
                {contributors.map((person, index) => (
                  <li key={person.name} style={at(index)}>
                    <a data-part="p" href={person.href ?? "#"} style={{ ["--vibeui-stats-002-k" as string]: (person.commits / max).toFixed(2), ["--vibeui-stats-002-h" as string]: hue(person.name) }} aria-label={`${person.name}, ${person.commits} коммитов`}>
                      {initials(person.name)}
                      <span aria-hidden="true">
                        {person.name} · {person.commits}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              {moreLabel ? (
                <a data-part="more" href={moreHref}>
                  {moreLabel}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
