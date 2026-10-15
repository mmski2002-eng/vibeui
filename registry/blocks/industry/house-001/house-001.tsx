"use client"

import { useState, type CSSProperties, type PointerEvent } from "react"

export type House001Project = {
  code: string
  image: string
  /** Площадь в м² — по ней работают фильтры. */
  area: number
  floors?: string
  bedrooms?: string
  price: string
  priceNote?: string
  badge?: string
  href?: string
}

export type House001Filter = { label: string; min?: number; max?: number }

export type House001Props = {
  eyebrow?: string
  title?: string
  projects?: readonly House001Project[]
  filters?: readonly House001Filter[]
  allLabel?: string
  allCount?: number
  allHref?: string
  foundLabel?: string
  openLabel?: string
  areaUnit?: string
  filtersLabel?: string
  emptyText?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Каталог «Какой дом ваш?»: чипы по площади фильтруют сетку, карточки
// перестраиваются с каскадным появлением. Карточка — фото с медленным
// зумом и мягким пятном света, которое ходит за курсором, код проекта
// крупно, характеристики, цена моно и кнопка-пилюля со стрелкой.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"

const S = '[data-vibeui-block="house-001"]'
const STYLES = `
:where(${S}){
--vibeui-house-001-bg:light-dark(#f4f1ec,#0e0f10);
--vibeui-house-001-fg:light-dark(#16181a,#f2efe9);
--vibeui-house-001-card:light-dark(#ffffff,#17191b);
--vibeui-house-001-accent:#e8a35c;
--vibeui-house-001-on-accent:oklch(from var(--vibeui-house-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-house-001-muted:color-mix(in oklab,var(--vibeui-house-001-fg) 58%,transparent);
--vibeui-house-001-line:color-mix(in oklab,var(--vibeui-house-001-fg) 12%,transparent);
--vibeui-house-001-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-house-001-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) ${S}{color-scheme:dark}
:where(${S}[data-tone="light"]){color-scheme:light}
:where(${S}[data-tone="dark"]){color-scheme:dark}
${S}{padding:clamp(4rem,9cqi,7.5rem) 0;background:var(--vibeui-house-001-bg);color:var(--vibeui-house-001-fg);font-family:var(--vibeui-house-001-font)}
${S} *{box-sizing:border-box}
${S} [data-part="shell"]{max-width:90rem;margin:0 auto;padding:0 clamp(1rem,3cqi,2.5rem)}
${S} [data-part="head"]{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1.5rem 2rem}
${S} [data-part="eyebrow"]{display:flex;align-items:center;gap:.7rem;margin:0 0 1rem;font-family:var(--vibeui-house-001-mono);font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-house-001-muted)}
${S} [data-part="eyebrow"]::before{content:"";width:1.6rem;height:1px;background:var(--vibeui-house-001-accent)}
${S} [data-part="title"]{margin:0;font-weight:300;font-size:clamp(2.2rem,5.6cqi,4.6rem);line-height:1;letter-spacing:-.04em}
${S} [data-part="all"]{display:inline-flex;align-items:center;gap:.6rem;height:2.9rem;padding:0 .4rem 0 1.3rem;border-radius:999px;background:var(--vibeui-house-001-fg);color:var(--vibeui-house-001-bg);font-weight:600;font-size:.88rem;text-decoration:none;transition:background-color .35s,color .35s}
${S} [data-part="all"] i{display:grid;place-items:center;width:2.1rem;height:2.1rem;border-radius:50%;background:var(--vibeui-house-001-bg);color:var(--vibeui-house-001-fg);transition:transform .45s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="all"]:hover i{transform:rotate(45deg)}
${S} svg{width:.95rem;height:.95rem}
${S} [data-part="bar"]{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;margin:2.25rem 0 1.5rem}
${S} [data-part="chips"]{display:flex;gap:.45rem;margin:0;padding:0;list-style:none;overflow-x:auto;scrollbar-width:none}
${S} [data-part="chip"]{height:2.4rem;padding:0 1.1rem;border:1px solid var(--vibeui-house-001-line);border-radius:999px;background:transparent;color:var(--vibeui-house-001-muted);font:inherit;font-size:.82rem;white-space:nowrap;cursor:pointer;transition:background-color .35s,color .35s,border-color .35s}
${S} [data-part="chip"]:hover{color:var(--vibeui-house-001-fg);border-color:color-mix(in oklab,var(--vibeui-house-001-fg) 30%,transparent)}
${S} [data-part="chip"][aria-pressed="true"]{background:var(--vibeui-house-001-fg);border-color:transparent;color:var(--vibeui-house-001-bg)}
${S} [data-part="found"]{font-family:var(--vibeui-house-001-mono);font-size:.72rem;color:var(--vibeui-house-001-muted)}
${S} [data-part="found"] b{font-weight:500;color:var(--vibeui-house-001-accent)}
${S} [data-part="grid"]{display:grid;gap:1rem;margin:0;padding:0;list-style:none}
${S} [data-part="card"]{position:relative;display:flex;flex-direction:column;height:100%;padding:.6rem;border:0;border-radius:1.5rem;background:linear-gradient(180deg,color-mix(in oklab,var(--vibeui-house-001-card) 100%,var(--vibeui-house-001-fg) 3%),var(--vibeui-house-001-card));box-shadow:0 30px 60px -35px rgb(0 0 0 / .8);overflow:hidden;transition:transform .7s cubic-bezier(.2,.8,.2,1),box-shadow .7s;animation:vibeui-house-001-in .9s cubic-bezier(.2,.8,.2,1) backwards;animation-delay:calc(var(--vibeui-house-001-i) * 80ms)}
${S} [data-part="card"]::before{content:"";position:absolute;inset:0;z-index:1;background:radial-gradient(28rem circle at var(--vibeui-house-001-mx,50%) var(--vibeui-house-001-my,30%),color-mix(in oklab,var(--vibeui-house-001-accent) 16%,transparent),transparent 45%);opacity:0;transition:opacity .5s;pointer-events:none}
${S} [data-part="card"]:hover::before{opacity:1}
${S} [data-part="card"]::after{content:"";position:absolute;inset:0;z-index:3;padding:1px;border-radius:inherit;background:linear-gradient(160deg,color-mix(in oklab,var(--vibeui-house-001-fg) 30%,transparent),color-mix(in oklab,var(--vibeui-house-001-fg) 6%,transparent) 35%,transparent 60%,color-mix(in oklab,var(--vibeui-house-001-accent) 30%,transparent));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;transition:opacity .6s}
${S} [data-part="card"]:hover{transform:translateY(-6px);box-shadow:0 50px 80px -40px rgb(0 0 0 / .9),0 0 0 1px color-mix(in oklab,var(--vibeui-house-001-accent) 35%,transparent)}
${S} [data-part="photo"]{position:relative;aspect-ratio:4/3;margin:0;border-radius:1.1rem;overflow:hidden;background:var(--vibeui-house-001-line)}
${S} [data-part="photo"] img{width:100%;height:100%;object-fit:cover;display:block;transform:scale(1.02);transition:transform 1.4s cubic-bezier(.2,.8,.2,1),filter 1.4s}
${S} [data-part="card"]:hover [data-part="photo"] img{transform:scale(1.09);filter:saturate(1.12)}
${S} [data-part="badge"]{position:absolute;top:.8rem;left:.8rem;padding:.35rem .7rem;border-radius:999px;background:rgb(14 15 16 / .55);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);color:#f2efe9;font-size:.7rem;font-weight:600;letter-spacing:.04em}
${S} [data-part="body"]{position:relative;z-index:2;display:grid;grid-template-columns:1fr auto;gap:.2rem 1rem;padding:1.1rem .6rem .9rem}
${S} [data-part="code"]{margin:0;font-size:1.6rem;font-weight:500;letter-spacing:-.03em}
${S} [data-part="specs"]{margin:0;font-size:.76rem;color:var(--vibeui-house-001-muted)}
${S} [data-part="price"]{grid-column:2;grid-row:1/3;align-self:start;text-align:right;font-family:var(--vibeui-house-001-mono);font-size:1.05rem;font-weight:500;font-variant-numeric:tabular-nums;white-space:nowrap}
${S} [data-part="price"] small{display:block;font-family:var(--vibeui-house-001-font);font-size:.68rem;font-weight:400;color:var(--vibeui-house-001-muted)}
${S} [data-part="open"]{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;height:2.9rem;margin-top:auto;padding:0 .4rem 0 1.1rem;border:1px solid var(--vibeui-house-001-line);border-radius:999px;color:inherit;font-size:.85rem;font-weight:500;text-decoration:none;transition:background-color .35s,border-color .35s,color .35s}
${S} [data-part="open"]::after{content:"";position:absolute;inset:0}
${S} [data-part="open"] i{display:grid;place-items:center;width:2.1rem;height:2.1rem;border-radius:50%;transition:transform .45s cubic-bezier(.2,.8,.2,1),background-color .35s}
${S} [data-part="card"]:hover [data-part="open"]{background:var(--vibeui-house-001-fg);border-color:transparent;color:var(--vibeui-house-001-bg)}
${S} [data-part="card"]:hover [data-part="open"] i{transform:rotate(45deg);background:var(--vibeui-house-001-accent);color:var(--vibeui-house-001-on-accent)}
${S} [data-part="empty"]{padding:3rem 0;color:var(--vibeui-house-001-muted)}
${S} a:focus-visible,${S} button:focus-visible{outline:2px solid var(--vibeui-house-001-accent);outline-offset:2px}
@keyframes vibeui-house-001-in{from{opacity:0;transform:translateY(24px)}}
@container (min-width: 40rem){${S} [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 72rem){${S} [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.25rem}}
@media (prefers-reduced-motion:reduce){${S} *{animation:none!important;transition:none!important}}
${S} [data-part="all"]{position:relative;isolation:isolate;overflow:hidden;transition:color .55s cubic-bezier(.2,.8,.2,1),transform .3s cubic-bezier(.2,.8,.2,1),box-shadow .5s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="all"]::before{content:"";position:absolute;z-index:-1;right:.45rem;top:50%;width:2rem;height:2rem;border-radius:50%;background:var(--vibeui-house-001-accent);transform:translateY(-50%) scale(0);transition:transform .75s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="all"]:hover::before{transform:translateY(-50%) scale(28)}
${S} [data-part="all"]:hover{color:var(--vibeui-house-001-on-accent);box-shadow:0 14px 34px -14px color-mix(in oklab,var(--vibeui-house-001-accent) 70%,transparent)}
${S} [data-part="all"]:active{transform:scale(.965);transition-duration:.12s}
${S} [data-part="all"] i{overflow:hidden}
${S} [data-part="all"]:hover i{transform:none}
${S} [data-part="all"]:hover i svg{animation:vibeui-house-001-fly .65s cubic-bezier(.6,0,.2,1)}
${S} [data-part="chip"]{transition:background-color .35s,color .35s,border-color .35s,transform .3s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="chip"]:active{transform:scale(.95);transition-duration:.1s}
${S} [data-part="chip"][aria-pressed="true"]{animation:vibeui-house-001-pop .45s cubic-bezier(.3,1.6,.5,1)}
${S} [data-part="card"]:hover [data-part="open"] i svg{animation:vibeui-house-001-fly .65s cubic-bezier(.6,0,.2,1)}
${S} [data-part="open"]:active{transform:scale(.97)}
${S} [data-part="open"]{transition:background-color .35s,border-color .35s,color .35s,transform .3s cubic-bezier(.2,.8,.2,1)}
@keyframes vibeui-house-001-fly{0%{transform:none}45%{transform:translate(140%,-140%)}46%{transform:translate(-140%,140%)}100%{transform:none}}
@keyframes vibeui-house-001-pop{0%{transform:scale(.94)}60%{transform:scale(1.04)}100%{transform:none}}
@media (prefers-reduced-motion:reduce){${S} *,${S} *::before{animation:none!important;transition:none!important}}`

const DEFAULT_PROJECTS: House001Project[] = [
  { code: "КБ-86", image: "/demo/house/p-01.webp", area: 86, floors: "1 этаж", bedrooms: "2 спальни", price: "5 779 718 ₽", priceNote: "домокомплект", href: "#calc" },
  { code: "КБ-160", image: "/demo/house/p-02.webp", area: 160, floors: "1 этаж", bedrooms: "3 спальни", price: "12 389 979 ₽", priceNote: "под ключ", badge: "Хит сезона", href: "#calc" },
  { code: "КБ-242", image: "/demo/house/p-03.webp", area: 242, floors: "2 этажа", bedrooms: "4 спальни", price: "21 780 000 ₽", priceNote: "под ключ", href: "#calc" },
  { code: "ГД-64", image: "/demo/house/p-04.webp", area: 64, floors: "1 этаж", bedrooms: "баня + гостевая", price: "4 120 000 ₽", priceNote: "под ключ", badge: "Банный дом", href: "#calc" },
  { code: "КБ-198", image: "/demo/house/p-05.webp", area: 198, floors: "2 этажа", bedrooms: "4 спальни", price: "17 460 000 ₽", priceNote: "под ключ", href: "#calc" },
  { code: "БХ-138", image: "/demo/house/p-06.webp", area: 138, floors: "1 этаж", bedrooms: "3 спальни", price: "10 940 000 ₽", priceNote: "под ключ", badge: "Новинка", href: "#calc" },
]

const DEFAULT_FILTERS: House001Filter[] = [
  { label: "Все площади" },
  { label: "До 150 м²", max: 150 },
  { label: "150–200 м²", min: 150, max: 200 },
  { label: "Более 200 м²", min: 200 },
]

/** Каталог проектов домов с фильтром по площади. */
export function House001({
  eyebrow = "Каталог проектов",
  title = "Какой дом ваш?",
  projects = DEFAULT_PROJECTS,
  filters = DEFAULT_FILTERS,
  allLabel = "Все проекты",
  allCount = 26,
  allHref = "#projects",
  foundLabel = "Найдено",
  openLabel = "Смотреть проект",
  areaUnit = "м²",
  filtersLabel = "Площадь дома",
  emptyText = "В этом диапазоне пока нет проектов — спроектируем индивидуально.",
  tone = "dark",
  accent,
  ink,
  background,
  className,
  style,
}: House001Props) {
  const [active, setActive] = useState(0)
  const filter = filters[active] ?? {}
  const visible = projects.filter((project) => (filter.min === undefined || project.area >= filter.min) && (filter.max === undefined || project.area < filter.max))

  const track = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--vibeui-house-001-mx", `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty("--vibeui-house-001-my", `${event.clientY - rect.top}px`)
  }

  const palette = {
    ...(accent ? { "--vibeui-house-001-accent": accent } : null),
    ...(ink ? { "--vibeui-house-001-fg": ink } : null),
    ...(background ? { "--vibeui-house-001-bg": background } : null),
    ...style,
  } as CSSProperties

  const arrow = (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M5 11 11 5M6 5h5v5" />
    </svg>
  )

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-house-001" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="house-001" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
            </div>
            <a data-part="all" href={allHref}>
              {allLabel} ({allCount})<i>{arrow}</i>
            </a>
          </div>
          <div data-part="bar">
            <ul data-part="chips" aria-label={filtersLabel}>
              {filters.map((item, itemIndex) => (
                <li key={item.label}>
                  <button data-part="chip" type="button" aria-pressed={itemIndex === active} onClick={() => setActive(itemIndex)}>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
            <span data-part="found" aria-live="polite">
              {foundLabel}: <b>{visible.length}</b>
            </span>
          </div>
          {visible.length ? (
            <ul data-part="grid" key={active}>
              {visible.map((project, projectIndex) => (
                <li key={project.code}>
                  <article data-part="card" style={{ ["--vibeui-house-001-i" as string]: projectIndex }} onPointerMove={track}>
                    <figure data-part="photo">
                      <img src={project.image} alt="" loading="lazy" draggable={false} />
                      {project.badge ? <span data-part="badge">{project.badge}</span> : null}
                    </figure>
                    <div data-part="body">
                      <h3 data-part="code">{project.code}</h3>
                      <p data-part="specs">{[`${project.area} ${areaUnit}`, project.floors, project.bedrooms].filter(Boolean).join(" · ")}</p>
                      <p data-part="price">
                        {project.price}
                        {project.priceNote ? <small>{project.priceNote}</small> : null}
                      </p>
                    </div>
                    <a data-part="open" href={project.href ?? "#"} aria-label={`${openLabel} ${project.code}`}>
                      {openLabel}
                      <i>{arrow}</i>
                    </a>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <p data-part="empty">{emptyText}</p>
          )}
        </div>
      </section>
    </>
  )
}
