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

// Сообщество проекта: три числа считают вверх при появлении, рядом стена
// контрибьюторов — кружки с инициалами, размер которых зависит от числа
// коммитов, цвет — от хеша имени; по наведению кружок раскрывает имя и
// число коммитов. Без фото и внешних сервисов: всё из строк.
const FONTS = "https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="stats-002"]){
--vibeui-stats-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-stats-002-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-stats-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-stats-002-muted:color-mix(in oklab,var(--vibeui-stats-002-fg) 60%,var(--vibeui-stats-002-bg));
--vibeui-stats-002-line:color-mix(in oklab,var(--vibeui-stats-002-fg) 12%,transparent);
--vibeui-stats-002-panel:color-mix(in oklab,var(--vibeui-stats-002-fg) 4%,var(--vibeui-stats-002-bg));
--vibeui-stats-002-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-stats-002-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="stats-002"]{color-scheme:dark}
:where([data-vibeui-block="stats-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="stats-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="stats-002"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-stats-002-panel);color:var(--vibeui-stats-002-fg);font-family:var(--vibeui-stats-002-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="stats-002"] *{box-sizing:border-box}
[data-vibeui-block="stats-002"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem}
[data-vibeui-block="stats-002"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-stats-002-mono);font-size:.75rem;color:var(--vibeui-stats-002-accent)}
[data-vibeui-block="stats-002"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2rem,4.6cqi,3.2rem);line-height:1.05;letter-spacing:-.03em}
[data-vibeui-block="stats-002"] [data-part="lede"]{margin:1rem 0 0;max-width:30rem;color:var(--vibeui-stats-002-muted)}
[data-vibeui-block="stats-002"] [data-part="stats"]{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;margin:1.8rem 0 0;padding:0;list-style:none;border:1px solid var(--vibeui-stats-002-line);border-radius:10px;overflow:hidden;background:var(--vibeui-stats-002-line)}
[data-vibeui-block="stats-002"] [data-part="stats"] li{padding:1rem 1.1rem;background:var(--vibeui-stats-002-bg)}
[data-vibeui-block="stats-002"] [data-part="num"]{display:block;font-weight:800;font-size:clamp(1.6rem,3.4cqi,2.4rem);letter-spacing:-.03em;line-height:1;font-variant-numeric:tabular-nums}
[data-vibeui-block="stats-002"] [data-part="stats"] small{display:block;margin-top:.35rem;font-family:var(--vibeui-stats-002-mono);font-size:.68rem;color:var(--vibeui-stats-002-muted)}
[data-vibeui-block="stats-002"] [data-part="wall"]{border:1px solid var(--vibeui-stats-002-line);border-radius:12px;padding:1.4rem;background:var(--vibeui-stats-002-bg)}
[data-vibeui-block="stats-002"] [data-part="wlabel"]{margin:0 0 1rem;font-family:var(--vibeui-stats-002-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-stats-002-muted)}
[data-vibeui-block="stats-002"] [data-part="people"]{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;margin:0;padding:0;list-style:none}
[data-vibeui-block="stats-002"] [data-part="p"]{position:relative;display:grid;place-items:center;width:calc(2.2rem + var(--vibeui-stats-002-k) * 1.6rem);height:calc(2.2rem + var(--vibeui-stats-002-k) * 1.6rem);border-radius:50%;background:oklch(0.72 0.14 var(--vibeui-stats-002-h));color:#fff;font-family:var(--vibeui-stats-002-mono);font-weight:600;font-size:calc(.65rem + var(--vibeui-stats-002-k) * .3rem);text-decoration:none;transition:transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s}
[data-vibeui-block="stats-002"] [data-part="p"]:hover{transform:scale(1.12);box-shadow:0 0 0 3px var(--vibeui-stats-002-bg),0 0 0 5px var(--vibeui-stats-002-accent);z-index:1}
[data-vibeui-block="stats-002"] [data-part="p"] span{position:absolute;left:50%;bottom:calc(100% + .5rem);transform:translate(-50%,.3rem);padding:.35rem .6rem;border-radius:6px;background:var(--vibeui-stats-002-fg);color:var(--vibeui-stats-002-bg);font-size:.68rem;font-weight:500;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .2s,transform .2s}
[data-vibeui-block="stats-002"] [data-part="p"]:hover span,[data-vibeui-block="stats-002"] [data-part="p"]:focus-visible span{opacity:1;transform:translate(-50%,0)}
[data-vibeui-block="stats-002"] [data-part="p"]:focus-visible{outline:2px solid var(--vibeui-stats-002-accent);outline-offset:2px}
[data-vibeui-block="stats-002"] [data-part="more"]{display:inline-block;margin-top:1rem;font-family:var(--vibeui-stats-002-mono);font-size:.78rem;color:var(--vibeui-stats-002-accent);text-decoration:none}
@container (min-width: 60rem){[data-vibeui-block="stats-002"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:4rem;align-items:start}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="stats-002"] *{transition:none!important}}`

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

function Counter({ stat, run }: { stat: Stats002Stat; run: boolean }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!run) return
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1300)
      setValue(stat.value * (1 - Math.pow(1 - t, 3)))
      if (t < 1) raf = window.requestAnimationFrame(tick)
    }
    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [run, stat.value])
  return (
    <li>
      <span data-part="num">
        {new Intl.NumberFormat("ru-RU", { maximumFractionDigits: Number.isInteger(stat.value) ? 0 : 1 }).format(run ? value : 0)}
        {stat.suffix ?? ""}
      </span>
      <small>{stat.label}</small>
    </li>
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
      <section ref={root} data-vibeui-block="stats-002" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <ul data-part="stats">
              {stats.map((stat) => (
                <Counter key={stat.label} stat={stat} run={shown} />
              ))}
            </ul>
          </div>
          <div data-part="wall">
            {wallLabel ? <p data-part="wlabel">{wallLabel}</p> : null}
            <ul data-part="people">
              {contributors.map((person) => (
                <li key={person.name}>
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
      </section>
    </>
  )
}
