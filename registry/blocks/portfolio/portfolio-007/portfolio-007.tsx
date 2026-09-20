"use client"

import { useEffect, useId, useRef, useState, type CSSProperties } from "react"

export type Portfolio007Work = {
  title: string
  /** Стиль: ключ из styles. */
  style: string
  image: string
  imageAlt?: string
  /** Мастер и место: «Ася · предплечье». */
  meta?: string
  /** История эскиза для лайтбокса. */
  story?: string
  /** Часы работы: «4 ч». */
  hours?: string
}

export type Portfolio007Style = {
  key: string
  label: string
}

export type Portfolio007Props = {
  eyebrow?: string
  title?: string
  styles?: readonly Portfolio007Style[]
  works?: readonly Portfolio007Work[]
  allLabel?: string
  closeLabel?: string
  /** aria фильтров, пустое состояние и стрелки. */
  filtersLabel?: string
  emptyText?: string
  prevLabel?: string
  nextLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Портфолио тату: фильтр по стилю неоновыми капсулами, плитки 4:5 в
// колонках, каждая работа лежит чёрно-белой и «проявляется» в цвет при
// наведении, вокруг зажигается неоновая рамка. Смена фильтра перерисовывает
// сетку с каскадом. Клик открывает лайтбокс на <dialog>: фото на всю
// высоту, справа история эскиза, часы и мастер, стрелки листают.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"

const STYLES = `
:where([data-vibeui-block="portfolio-007"]){
--vibeui-portfolio-007-bg:#07060b;
--vibeui-portfolio-007-fg:#f3eefc;
--vibeui-portfolio-007-muted:#a39bb5;
--vibeui-portfolio-007-line:rgb(255 255 255 / .12);
--vibeui-portfolio-007-card:#110e1a;
--vibeui-portfolio-007-accent:#ff2bd6;
--vibeui-portfolio-007-accent-2:#8b5cff;
--vibeui-portfolio-007-cyan:#22f3ff;
--vibeui-portfolio-007-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-portfolio-007-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-portfolio-007-mono:"JetBrains Mono",ui-monospace,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="portfolio-007"]{color-scheme:dark}
:where([data-vibeui-block="portfolio-007"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="portfolio-007"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="portfolio-007"]{box-sizing:border-box;display:block;background:var(--vibeui-portfolio-007-bg);color:var(--vibeui-portfolio-007-fg);font-family:var(--vibeui-portfolio-007-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="portfolio-007"] *{box-sizing:border-box}
[data-vibeui-block="portfolio-007"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="portfolio-007"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1rem 2rem;margin-bottom:1.75rem}
[data-vibeui-block="portfolio-007"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 .75rem;font-family:var(--vibeui-portfolio-007-mono);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-portfolio-007-cyan);text-shadow:0 0 10px color-mix(in oklab,var(--vibeui-portfolio-007-cyan) 70%,transparent)}
[data-vibeui-block="portfolio-007"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-portfolio-007-cyan);box-shadow:0 0 8px var(--vibeui-portfolio-007-cyan)}
[data-vibeui-block="portfolio-007"] [data-part="title"]{margin:0;font-family:var(--vibeui-portfolio-007-display);font-size:clamp(1.8rem,3.8cqi,2.8rem);font-weight:700;line-height:1.05;letter-spacing:-.02em;text-transform:uppercase}
[data-vibeui-block="portfolio-007"] [data-part="filters"]{display:flex;flex-wrap:wrap;gap:.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="portfolio-007"] [data-part="filter"]{height:2.4rem;padding:0 1rem;border-radius:.5rem;border:1px solid var(--vibeui-portfolio-007-line);background:transparent;color:var(--vibeui-portfolio-007-muted);font:inherit;font-size:.9rem;font-weight:600;cursor:pointer;transition:color .25s,border-color .25s,box-shadow .3s,background .25s}
[data-vibeui-block="portfolio-007"] [data-part="filter"]:hover{color:var(--vibeui-portfolio-007-fg);border-color:color-mix(in oklab,var(--vibeui-portfolio-007-accent) 60%,transparent)}
[data-vibeui-block="portfolio-007"] [data-part="filter"][aria-pressed="true"]{color:var(--vibeui-portfolio-007-fg);border-color:var(--vibeui-portfolio-007-accent);background:color-mix(in oklab,var(--vibeui-portfolio-007-accent) 14%,transparent);box-shadow:0 0 14px color-mix(in oklab,var(--vibeui-portfolio-007-accent) 45%,transparent),inset 0 0 10px color-mix(in oklab,var(--vibeui-portfolio-007-accent) 20%,transparent)}
[data-vibeui-block="portfolio-007"] [data-part="filter"]:focus-visible,[data-vibeui-block="portfolio-007"] [data-part="tile"]:focus-visible,[data-vibeui-block="portfolio-007"] [data-part="nav"]:focus-visible,[data-vibeui-block="portfolio-007"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-portfolio-007-cyan);outline-offset:3px}
[data-vibeui-block="portfolio-007"] [data-part="grid"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.75rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="portfolio-007"] [data-part="grid"] li{animation:vibeui-portfolio-007-in .55s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-portfolio-007-n) * 45ms)}
@keyframes vibeui-portfolio-007-in{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:none}}
[data-vibeui-block="portfolio-007"] [data-part="tile"]{position:relative;display:block;width:100%;aspect-ratio:4/5;padding:0;border:0;border-radius:.9rem;overflow:hidden;background:var(--vibeui-portfolio-007-card);cursor:pointer;color:inherit;font:inherit;text-align:left;isolation:isolate}
[data-vibeui-block="portfolio-007"] [data-part="tile"] img{width:100%;height:100%;object-fit:cover;display:block;filter:grayscale(1) contrast(1.1);transition:filter .6s,transform .9s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="portfolio-007"] [data-part="tile"]:hover img,[data-vibeui-block="portfolio-007"] [data-part="tile"]:focus-visible img{filter:grayscale(0) contrast(1);transform:scale(1.05)}
[data-vibeui-block="portfolio-007"] [data-part="tile"]::before{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 0 1px transparent;transition:box-shadow .4s;pointer-events:none;z-index:2}
[data-vibeui-block="portfolio-007"] [data-part="tile"]:hover::before{box-shadow:inset 0 0 0 1px var(--vibeui-portfolio-007-accent),inset 0 0 24px color-mix(in oklab,var(--vibeui-portfolio-007-accent) 35%,transparent),0 0 24px color-mix(in oklab,var(--vibeui-portfolio-007-accent) 45%,transparent)}
[data-vibeui-block="portfolio-007"] [data-part="cap"]{position:absolute;left:0;right:0;bottom:0;z-index:1;padding:2.5rem .9rem .9rem;background:linear-gradient(0deg,rgb(7 6 11 / .9),transparent);transform:translateY(30%);opacity:0;transition:transform .4s cubic-bezier(.2,.8,.2,1),opacity .4s}
[data-vibeui-block="portfolio-007"] [data-part="tile"]:hover [data-part="cap"],[data-vibeui-block="portfolio-007"] [data-part="tile"]:focus-visible [data-part="cap"]{transform:none;opacity:1}
[data-vibeui-block="portfolio-007"] [data-part="cap"] b{display:block;font-family:var(--vibeui-portfolio-007-display);font-size:.95rem;font-weight:600;line-height:1.2}
[data-vibeui-block="portfolio-007"] [data-part="cap"] span{display:block;margin-top:.2rem;font-size:.78rem;color:var(--vibeui-portfolio-007-muted)}
[data-vibeui-block="portfolio-007"] [data-part="style-tag"]{position:absolute;left:.7rem;top:.7rem;z-index:1;padding:.25rem .55rem;border-radius:.35rem;background:rgb(7 6 11 / .65);border:1px solid var(--vibeui-portfolio-007-line);font-family:var(--vibeui-portfolio-007-mono);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;backdrop-filter:blur(6px)}
[data-vibeui-block="portfolio-007"] [data-part="empty"]{padding:3rem;border-radius:.9rem;border:1px dashed var(--vibeui-portfolio-007-line);text-align:center;color:var(--vibeui-portfolio-007-muted)}
[data-vibeui-block="portfolio-007"] [data-part="dialog"]{width:min(72rem,calc(100vw - 2rem));max-width:none;max-height:calc(100vh - 2rem);padding:0;border:1px solid color-mix(in oklab,var(--vibeui-portfolio-007-accent) 50%,transparent);border-radius:1rem;background:#0b0912;color:var(--vibeui-portfolio-007-fg);overflow:hidden;box-shadow:0 0 40px color-mix(in oklab,var(--vibeui-portfolio-007-accent) 40%,transparent),0 40px 80px -30px rgb(0 0 0 / .8)}
[data-vibeui-block="portfolio-007"] [data-part="dialog"]::backdrop{background:rgb(7 6 11 / .85);backdrop-filter:blur(10px)}
[data-vibeui-block="portfolio-007"] [data-part="dialog"][open]{animation:vibeui-portfolio-007-pop .35s cubic-bezier(.2,.8,.2,1)}
@keyframes vibeui-portfolio-007-pop{from{opacity:0;transform:scale(.96) translateY(10px)}to{opacity:1;transform:none}}
[data-vibeui-block="portfolio-007"] [data-part="modal"]{display:grid;grid-template-rows:minmax(0,1fr) auto;max-height:calc(100vh - 2rem)}
[data-vibeui-block="portfolio-007"] [data-part="stage"]{position:relative;background:#000;min-height:0}
[data-vibeui-block="portfolio-007"] [data-part="stage"] img{width:100%;height:100%;max-height:60vh;object-fit:contain;display:block;animation:vibeui-portfolio-007-fade .35s}
@keyframes vibeui-portfolio-007-fade{from{opacity:0}to{opacity:1}}
[data-vibeui-block="portfolio-007"] [data-part="nav"]{position:absolute;top:50%;width:2.75rem;height:2.75rem;margin-top:-1.4rem;border-radius:50%;border:1px solid var(--vibeui-portfolio-007-line);background:rgb(7 6 11 / .7);color:#fff;font:inherit;cursor:pointer;display:grid;place-items:center;transition:box-shadow .3s,border-color .3s}
[data-vibeui-block="portfolio-007"] [data-part="nav"]:hover{border-color:var(--vibeui-portfolio-007-accent);box-shadow:0 0 16px color-mix(in oklab,var(--vibeui-portfolio-007-accent) 60%,transparent)}
[data-vibeui-block="portfolio-007"] [data-part="nav"][data-dir="prev"]{left:.75rem}
[data-vibeui-block="portfolio-007"] [data-part="nav"][data-dir="next"]{right:.75rem}
[data-vibeui-block="portfolio-007"] [data-part="nav"] svg{width:1rem;height:1rem}
[data-vibeui-block="portfolio-007"] [data-part="info"]{display:grid;gap:.5rem;padding:1.1rem 1.25rem;border-top:1px solid var(--vibeui-portfolio-007-line)}
[data-vibeui-block="portfolio-007"] [data-part="info-head"]{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:.5rem 1rem}
[data-vibeui-block="portfolio-007"] [data-part="info"] h3{margin:0;font-family:var(--vibeui-portfolio-007-display);font-size:1.15rem;font-weight:600}
[data-vibeui-block="portfolio-007"] [data-part="info"] p{margin:0;color:var(--vibeui-portfolio-007-muted);font-size:.95rem}
[data-vibeui-block="portfolio-007"] [data-part="meta"]{display:flex;flex-wrap:wrap;gap:.5rem 1rem;font-family:var(--vibeui-portfolio-007-mono);font-size:.78rem;color:var(--vibeui-portfolio-007-cyan)}
[data-vibeui-block="portfolio-007"] [data-part="close"]{position:absolute;right:.75rem;top:.75rem;z-index:2;height:2.4rem;padding:0 .9rem;border-radius:.5rem;border:1px solid var(--vibeui-portfolio-007-line);background:rgb(7 6 11 / .7);color:#fff;font:inherit;font-size:.85rem;font-weight:600;cursor:pointer}
@container (min-width: 44rem){[data-vibeui-block="portfolio-007"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}}
@container (min-width: 64rem){
[data-vibeui-block="portfolio-007"] [data-part="shell"]{padding:5.5rem 2rem}
[data-vibeui-block="portfolio-007"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr))}
[data-vibeui-block="portfolio-007"] [data-part="modal"]{grid-template-rows:none;grid-template-columns:minmax(0,1.4fr) 22rem}
[data-vibeui-block="portfolio-007"] [data-part="stage"] img{max-height:calc(100vh - 2rem);height:100%}
[data-vibeui-block="portfolio-007"] [data-part="info"]{align-content:start;padding:2rem 1.75rem;border-top:0;border-left:1px solid var(--vibeui-portfolio-007-line)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="portfolio-007"] *{animation:none!important;transition:none!important}[data-vibeui-block="portfolio-007"] [data-part="tile"] img{filter:none}}`

const P = "/demo/tattoo"

const DEFAULT_STYLES: Portfolio007Style[] = [
  { key: "realism", label: "Реализм" },
  { key: "oldschool", label: "Олд-скул" },
  { key: "graphic", label: "Графика" },
  { key: "minimal", label: "Минимализм" },
  { key: "color", label: "Цвет" },
]

const DEFAULT_WORKS: Portfolio007Work[] = [
  { title: "Лев", style: "realism", image: `${P}/work-01.webp`, meta: "Марк · плечо", hours: "6 ч", story: "Референс — фото из заповедника. Свет собран так, чтобы грива читалась даже через пять лет." },
  { title: "Ласточка и роза", style: "oldschool", image: `${P}/work-02.webp`, meta: "Ася · предплечье", hours: "3 ч", story: "Классический американский флэш, переработан под изгиб руки." },
  { title: "Папоротник", style: "minimal", image: `${P}/work-03.webp`, meta: "Лина · ключица", hours: "1,5 ч", story: "Одна линия без отрыва, эскиз рисовался прямо на коже." },
  { title: "Мандала", style: "graphic", image: `${P}/work-04.webp`, meta: "Тимур · спина", hours: "9 ч", story: "Два сеанса. Симметрия по центру позвоночника с поправкой на осанку." },
  { title: "Карп", style: "color", image: `${P}/work-05.webp`, meta: "Марк · голень", hours: "7 ч", story: "Японская школа: вода закручена против движения рыбы." },
  { title: "Кот", style: "realism", image: `${P}/work-06.webp`, meta: "Марк · бедро", hours: "5 ч", story: "Цветной реализм по фото хозяйки, глаза — последним слоем." },
  { title: "Фазы луны", style: "minimal", image: `${P}/work-07.webp`, meta: "Лина · позвоночник", hours: "2 ч", story: "Точечная техника, каждая фаза — отдельная сессия иглы 3RL." },
  { title: "Лиса", style: "color", image: `${P}/work-08.webp`, meta: "Ася · плечо", hours: "5 ч", story: "Нео-традишнл: толстый контур, тёплая палитра, пионы вместо ромашек." },
  { title: "Мазок", style: "color", image: `${P}/work-09.webp`, meta: "Лина · лопатка", hours: "3 ч", story: "Акварель без контура, фуксия и циан — цвета студии." },
  { title: "Рукав", style: "graphic", image: `${P}/work-10.webp`, meta: "Тимур · рука", hours: "22 ч", story: "Четыре сеанса. Орнамент собран из узоров северных ковров." },
  { title: "Волна", style: "minimal", image: `${P}/work-11.webp`, meta: "Лина · запястье", hours: "40 мин", story: "Самая маленькая работа месяца. Сделана на консультации." },
  { title: "Часы и розы", style: "realism", image: `${P}/work-12.webp`, meta: "Марк · грудь", hours: "8 ч", story: "Чёрно-серый реализм, время на часах — дата рождения дочери." },
]

/** Портфолио тату: фильтр по стилю, плитки, проявляющиеся в цвет, и лайтбокс с историей эскиза. */
export function Portfolio007({
  eyebrow = "Работы",
  title = "Что выходит из-под иглы",
  styles = DEFAULT_STYLES,
  works = DEFAULT_WORKS,
  allLabel = "Все",
  closeLabel = "Закрыть",
  filtersLabel = "Стиль",
  emptyText = "Пока пусто — посмотрите другой стиль.",
  prevLabel = "Предыдущая",
  nextLabel = "Следующая",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Portfolio007Props) {
  const [filter, setFilter] = useState("")
  const [current, setCurrent] = useState<number | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const label = useId()
  const palette = {
    ...(accent ? { "--vibeui-portfolio-007-accent": accent } : null),
    ...(background ? { "--vibeui-portfolio-007-bg": background } : null),
    ...style,
  } as CSSProperties
  const visible = works.filter((work) => !filter || work.style === filter)
  const styleLabel = (key: string) => styles.find((item) => item.key === key)?.label ?? key

  const open = (index: number) => {
    setCurrent(index)
    dialog.current?.showModal()
  }
  const total = visible.length
  const shift = (direction: 1 | -1) => setCurrent((value) => (value === null ? null : (value + direction + total) % total))

  useEffect(() => {
    const node = dialog.current
    if (!node) return
    const onKey = (event: KeyboardEvent) => {
      const direction = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0
      if (direction) setCurrent((value) => (value === null ? null : (value + direction + total) % total))
    }
    node.addEventListener("keydown", onKey)
    return () => node.removeEventListener("keydown", onKey)
  }, [total])

  const work = current === null ? null : visible[current]

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-portfolio-007" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="portfolio-007" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
            </div>
            <ul data-part="filters" aria-label={filtersLabel}>
              <li>
                <button type="button" data-part="filter" aria-pressed={filter === ""} onClick={() => setFilter("")}>
                  {allLabel}
                </button>
              </li>
              {styles.map((item) => (
                <li key={item.key}>
                  <button type="button" data-part="filter" aria-pressed={filter === item.key} onClick={() => setFilter(filter === item.key ? "" : item.key)}>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {visible.length > 0 ? (
            <ul key={filter} data-part="grid">
              {visible.map((item, index) => (
                <li key={item.image} style={{ ["--vibeui-portfolio-007-n" as string]: index }}>
                  <button type="button" data-part="tile" onClick={() => open(index)} aria-label={`${item.title}, ${styleLabel(item.style)}`}>
                    <img src={item.image} alt={item.imageAlt ?? ""} loading="lazy" />
                    <span data-part="style-tag">{styleLabel(item.style)}</span>
                    <span data-part="cap">
                      <b>{item.title}</b>
                      {item.meta ? <span>{item.meta}</span> : null}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p data-part="empty">{emptyText}</p>
          )}
        </div>
        <dialog ref={dialog} data-part="dialog" aria-labelledby={label} onClose={() => setCurrent(null)} onClick={(event) => event.target === dialog.current && dialog.current.close()}>
          {work ? (
            <div data-part="modal">
              <div data-part="stage">
                <img key={work.image} src={work.image} alt={work.imageAlt ?? work.title} />
                {visible.length > 1 ? (
                  <>
                    <button type="button" data-part="nav" data-dir="prev" aria-label={prevLabel} onClick={() => shift(-1)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 5l-7 7 7 7" />
                      </svg>
                    </button>
                    <button type="button" data-part="nav" data-dir="next" aria-label={nextLabel} onClick={() => shift(1)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                ) : null}
                <button type="button" data-part="close" onClick={() => dialog.current?.close()}>
                  {closeLabel}
                </button>
              </div>
              <div data-part="info">
                <div data-part="info-head">
                  <h3 id={label}>{work.title}</h3>
                  <span data-part="meta">
                    <span>{styleLabel(work.style)}</span>
                    {work.hours ? <span>{work.hours}</span> : null}
                  </span>
                </div>
                {work.meta ? <p>{work.meta}</p> : null}
                {work.story ? <p>{work.story}</p> : null}
              </div>
            </div>
          ) : null}
        </dialog>
      </section>
    </>
  )
}
