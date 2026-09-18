"use client"

import { useEffect, useRef, type CSSProperties } from "react"

export type Portfolio012Project = {
  title: string
  role?: string
  year?: string
  text?: string
  tags?: readonly string[]
  image?: string
  imageAlt?: string
  href?: string
  /** Цвет карточки (фон). Пусто — панель темы. */
  color?: string
}

export type Portfolio012Props = {
  eyebrow?: string
  title?: string
  projects?: readonly Portfolio012Project[]
  openLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Проекты стопкой: каждая карточка — sticky с нарастающим отступом сверху,
// так что при прокрутке следующая наезжает на предыдущую, а та чуть
// уменьшается и темнеет (масштаб считается в rAF по положению следующей
// карточки и пишется в переменную — без ререндера). Номер, год, роль, теги,
// обложка с наездом по наведению, стрелка «открыть».
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;800&family=Golos+Text:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="portfolio-012"]){
--vibeui-portfolio-012-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-portfolio-012-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-portfolio-012-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-portfolio-012-muted:color-mix(in oklab,var(--vibeui-portfolio-012-fg) 60%,var(--vibeui-portfolio-012-bg));
--vibeui-portfolio-012-line:color-mix(in oklab,var(--vibeui-portfolio-012-fg) 12%,transparent);
--vibeui-portfolio-012-panel:color-mix(in oklab,var(--vibeui-portfolio-012-fg) 5%,var(--vibeui-portfolio-012-bg));
--vibeui-portfolio-012-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-portfolio-012-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-portfolio-012-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="portfolio-012"]{color-scheme:dark}
:where([data-vibeui-block="portfolio-012"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="portfolio-012"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="portfolio-012"]{box-sizing:border-box;padding:5rem 0 6rem;background:var(--vibeui-portfolio-012-bg);color:var(--vibeui-portfolio-012-fg);font-family:var(--vibeui-portfolio-012-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="portfolio-012"] *{box-sizing:border-box}
[data-vibeui-block="portfolio-012"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="portfolio-012"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-portfolio-012-mono);font-size:.78rem;color:var(--vibeui-portfolio-012-muted)}
[data-vibeui-block="portfolio-012"] [data-part="title"]{margin:0 0 2.5rem;font-family:var(--vibeui-portfolio-012-display);font-weight:800;font-size:clamp(2.2rem,6cqi,4.6rem);line-height:.95;letter-spacing:-.045em}
[data-vibeui-block="portfolio-012"] [data-part="stack"]{display:grid;gap:1.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="portfolio-012"] [data-part="card"]{position:sticky;top:calc(5rem + var(--vibeui-portfolio-012-i) * 1.2rem);display:grid;gap:1.5rem;padding:1.5rem;border-radius:1.4rem;background:var(--vibeui-portfolio-012-color,var(--vibeui-portfolio-012-panel));box-shadow:0 0 0 1px var(--vibeui-portfolio-012-line),0 30px 60px -40px rgb(0 0 0 / .5);transform:scale(var(--vibeui-portfolio-012-s,1));transform-origin:top center;filter:brightness(var(--vibeui-portfolio-012-b,1));transition:transform .1s linear,filter .1s linear}
[data-vibeui-block="portfolio-012"] [data-part="head"]{display:flex;align-items:baseline;gap:1rem;font-family:var(--vibeui-portfolio-012-mono);font-size:.75rem;color:var(--vibeui-portfolio-012-muted)}
[data-vibeui-block="portfolio-012"] [data-part="head"] b{font-weight:500;color:var(--vibeui-portfolio-012-accent)}
[data-vibeui-block="portfolio-012"] [data-part="head"] span:last-child{margin-left:auto}
[data-vibeui-block="portfolio-012"] [data-part="name"]{margin:0;font-family:var(--vibeui-portfolio-012-display);font-weight:800;font-size:clamp(1.6rem,3.6cqi,2.6rem);letter-spacing:-.035em;line-height:1}
[data-vibeui-block="portfolio-012"] [data-part="text"]{margin:.8rem 0 0;color:var(--vibeui-portfolio-012-muted);max-width:30rem}
[data-vibeui-block="portfolio-012"] [data-part="tags"]{display:flex;flex-wrap:wrap;gap:.4rem;margin:1rem 0 0;padding:0;list-style:none}
[data-vibeui-block="portfolio-012"] [data-part="tags"] li{font-family:var(--vibeui-portfolio-012-mono);font-size:.7rem;padding:.25rem .55rem;border-radius:999px;border:1px solid var(--vibeui-portfolio-012-line)}
[data-vibeui-block="portfolio-012"] [data-part="open"]{display:inline-flex;align-items:center;gap:.5rem;margin-top:1.4rem;color:inherit;text-decoration:none;font-weight:600}
[data-vibeui-block="portfolio-012"] [data-part="open"] i{display:grid;place-items:center;width:2.2rem;height:2.2rem;border-radius:50%;background:var(--vibeui-portfolio-012-fg);color:var(--vibeui-portfolio-012-bg);font-style:normal;transition:transform .3s,background .2s}
[data-vibeui-block="portfolio-012"] [data-part="card"]:hover [data-part="open"] i{transform:rotate(-45deg);background:var(--vibeui-portfolio-012-accent)}
[data-vibeui-block="portfolio-012"] [data-part="pic"]{aspect-ratio:16 / 10;border-radius:1rem;overflow:hidden;background:var(--vibeui-portfolio-012-line)}
[data-vibeui-block="portfolio-012"] [data-part="pic"] img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .8s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="portfolio-012"] [data-part="card"]:hover [data-part="pic"] img{transform:scale(1.04)}
[data-vibeui-block="portfolio-012"] a:focus-visible{outline:2px solid var(--vibeui-portfolio-012-accent);outline-offset:3px}
@container (min-width: 56rem){[data-vibeui-block="portfolio-012"] [data-part="card"]{grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);padding:2rem;align-items:center}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="portfolio-012"] *{transition:none!important}[data-vibeui-block="portfolio-012"] [data-part="card"]{position:relative;top:auto;transform:none!important;filter:none!important}}`

const DEFAULT_PROJECTS: Portfolio012Project[] = [
  { title: "Панель для сервиса доставки", role: "дизайн и фронтенд", year: "2026", text: "Переделал панель диспетчера: с 14 экранов до 3. Среднее время на заказ упало вдвое.", tags: ["React", "дизайн-система", "карты"], image: "/demo/portfolio/project-01.webp", href: "#" },
  { title: "Приложение прогулок по городу", role: "продуктовый дизайн", year: "2025", text: "Маршруты по интересам, офлайн-карта, дневник. 120 тысяч установок за первый сезон.", tags: ["iOS", "Android", "карты"], image: "/demo/portfolio/project-02.webp", href: "#" },
  { title: "Дизайн-система для банка", role: "ведущий дизайнер", year: "2025", text: "Токены, 60 компонентов, документация. Четыре команды перешли за квартал.", tags: ["Figma", "токены", "документация"], image: "/demo/portfolio/project-03.webp", href: "#" },
  { title: "Магазин керамики", role: "всё сам", year: "2024", text: "Сайт, каталог, оплата — за три недели. Первая продажа в день запуска.", tags: ["Next.js", "e-commerce", "SEO"], image: "/demo/portfolio/project-04.webp", href: "#" },
  { title: "Инфостена для офиса", role: "разработка", year: "2024", text: "Экран в лобби, который показывает живые метрики компании. Один WebSocket, ноль кликов.", tags: ["визуализация", "WebSocket", "экраны"], image: "/demo/portfolio/project-05.webp", href: "#" },
]

/** Проекты стопкой sticky-карточек с масштабом от прокрутки. */
export function Portfolio012({
  eyebrow = "избранное · 2024—2026",
  title = "Проекты, за которые не стыдно",
  projects = DEFAULT_PROJECTS,
  openLabel = "открыть",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Portfolio012Props) {
  const stack = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const list = stack.current
    if (!list) return
    const cards = Array.from(list.children) as HTMLElement[]
    let raf = 0
    const update = () => {
      raf = 0
      cards.forEach((card, index) => {
        const next = cards[index + 1]
        if (!next) return
        const top = card.getBoundingClientRect().top
        const nextTop = next.getBoundingClientRect().top
        // 0 — следующая далеко, 1 — накрыла полностью.
        const overlap = Math.min(1, Math.max(0, 1 - (nextTop - top) / card.offsetHeight))
        card.style.setProperty("--vibeui-portfolio-012-s", (1 - overlap * 0.06).toFixed(3))
        card.style.setProperty("--vibeui-portfolio-012-b", (1 - overlap * 0.25).toFixed(3))
      })
    }
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      window.cancelAnimationFrame(raf)
    }
  }, [projects])

  const palette = {
    ...(accent ? { "--vibeui-portfolio-012-accent": accent } : null),
    ...(ink ? { "--vibeui-portfolio-012-fg": ink } : null),
    ...(background ? { "--vibeui-portfolio-012-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-portfolio-012" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="portfolio-012" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          <ol ref={stack} data-part="stack">
            {projects.map((project, index) => (
              <li key={project.title} data-part="card" style={{ ["--vibeui-portfolio-012-i" as string]: index, ...(project.color ? { ["--vibeui-portfolio-012-color" as string]: project.color } : null) }}>
                <div>
                  <div data-part="head">
                    <b>{String(index + 1).padStart(2, "0")}</b>
                    {project.role ? <span>{project.role}</span> : null}
                    {project.year ? <span>{project.year}</span> : null}
                  </div>
                  <h3 data-part="name">{project.title}</h3>
                  {project.text ? <p data-part="text">{project.text}</p> : null}
                  {project.tags && project.tags.length > 0 ? (
                    <ul data-part="tags">
                      {project.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  ) : null}
                  {project.href ? (
                    <a data-part="open" href={project.href}>
                      <i aria-hidden="true">→</i>
                      {openLabel}
                    </a>
                  ) : null}
                </div>
                <div data-part="pic">{project.image ? <img src={project.image} alt={project.imageAlt ?? ""} loading="lazy" /> : null}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
