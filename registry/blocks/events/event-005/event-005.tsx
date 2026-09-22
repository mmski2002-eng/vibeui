import type { CSSProperties } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"
import { Button077 } from "@/registry/components/button/button-077/button-077"

export type Event005Item = {
  title: string
  image?: string
  imageAlt?: string
  /** Направление: «#Музыка». */
  tag?: string
  /** Цвет капсулы направления. */
  tagColor?: string
  tagInk?: string
  /** «Главная сцена». */
  stage?: string
  /** «сб, 19:30». */
  time?: string
  /** Плашка в углу фото: «Бесплатно», «18+». */
  badge?: string
  href?: string
}

export type Event005Pick = {
  label?: string
  image?: string
  imageAlt?: string
  title: string
  date?: string
  actionLabel?: string
  href?: string
}

export type Event005Props = {
  eyebrow?: string
  title?: string
  items?: readonly Event005Item[]
  /** Липкая карточка справа: «Выбор дня». */
  pick?: Event005Pick
  moreLabel?: string
  moreHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Программа фестиваля журнальной сеткой: слева карточки событий в четыре
// колонки — фото 4:3, заголовок, направление цветной капсулой, сцена и
// время; справа липкая высокая карточка «Выбор дня» с фото на всю высоту,
// матовой плашкой сверху, заголовком в стекле и акцентной кнопкой. Карточки
// появляются каскадом, фото приближается по наведению. Серверный.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="event-005"]){
--vibeui-event-005-bg:light-dark(#ffffff,#0e0f12);
--vibeui-event-005-fg:light-dark(#111111,#f4f4f5);
--vibeui-event-005-muted:light-dark(#6b6b70,#a1a1aa);
--vibeui-event-005-line:light-dark(#e8e8ea,#26272d);
--vibeui-event-005-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-event-005-on-accent:oklch(from var(--vibeui-event-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-event-005-display:"Inter Tight","Inter",ui-sans-serif,system-ui,sans-serif;
--vibeui-event-005-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="event-005"]{color-scheme:dark}
:where([data-vibeui-block="event-005"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="event-005"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="event-005"]{box-sizing:border-box;display:block;background:var(--vibeui-event-005-bg);color:var(--vibeui-event-005-fg);font-family:var(--vibeui-event-005-font);font-size:1rem;line-height:1.4}
[data-vibeui-block="event-005"] *{box-sizing:border-box}
[data-vibeui-block="event-005"] a{color:inherit;text-decoration:none}
[data-vibeui-block="event-005"] a:focus-visible{outline:2px solid var(--vibeui-event-005-fg);outline-offset:3px;border-radius:.75rem}
[data-vibeui-block="event-005"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:2rem 1.25rem 3rem}
[data-vibeui-block="event-005"] [data-part="grid"]{display:grid;gap:2rem}
[data-vibeui-block="event-005"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:.5rem 1rem;padding-top:1.25rem;border-top:1px solid var(--vibeui-event-005-line)}
[data-vibeui-block="event-005"] [data-part="eyebrow"]{margin:0;font-size:1.05rem}
[data-vibeui-block="event-005"] [data-part="title"]{margin:.5rem 0 1.5rem;font-family:var(--vibeui-event-005-display);font-size:clamp(1.6rem,3.4cqi,2.4rem);font-weight:600;letter-spacing:-.03em;line-height:1.1}
[data-vibeui-block="event-005"] [data-part="list"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2rem 1.25rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="event-005"] [data-part="card"]{display:grid;gap:.75rem;animation:vibeui-event-005-in .6s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-event-005-n) * 60ms)}
@keyframes vibeui-event-005-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
[data-vibeui-block="event-005"] [data-part="photo"]{position:relative;display:block;aspect-ratio:4/3;overflow:hidden;border-radius:1rem;background:light-dark(#efeff1,#1f2026)}
[data-vibeui-block="event-005"] [data-part="photo"] img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 1s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="event-005"] [data-part="card"]:hover [data-part="photo"] img{transform:scale(1.05)}
[data-vibeui-block="event-005"] [data-part="badge"]{position:absolute;left:.6rem;top:.6rem;padding:.3rem .65rem;border-radius:999px;background:rgb(17 17 17 / .55);color:#fff;font-size:.72rem;font-weight:500;backdrop-filter:blur(8px)}
[data-vibeui-block="event-005"] [data-part="card-title"]{margin:0;font-family:var(--vibeui-event-005-display);font-size:1.25rem;font-weight:600;line-height:1.2;letter-spacing:-.02em}
[data-vibeui-block="event-005"] [data-part="card-title"] a:hover{opacity:.7}
[data-vibeui-block="event-005"] [data-part="meta"]{display:flex;flex-wrap:wrap;align-items:center;gap:.4rem .6rem;margin:0;font-size:.9rem;color:var(--vibeui-event-005-muted)}
[data-vibeui-block="event-005"] [data-part="tag"]{padding:.2rem .6rem;border-radius:999px;background:var(--vibeui-event-005-tag,#f1f1f3);color:var(--vibeui-event-005-ink,#111);font-weight:500;font-size:.8rem}
[data-vibeui-block="event-005"] [data-part="pick"]{position:relative;display:flex;flex-direction:column;justify-content:space-between;min-height:34rem;padding:1rem;border-radius:1.5rem;overflow:hidden;background:#111;color:#fff;isolation:isolate}
[data-vibeui-block="event-005"] [data-part="pick"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-1;transition:transform 8s linear}
[data-vibeui-block="event-005"] [data-part="pick"]:hover img{transform:scale(1.08)}
[data-vibeui-block="event-005"] [data-part="pick"]::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,rgb(0 0 0 / .1),rgb(0 0 0 / .05) 50%,rgb(0 0 0 / .45))}
[data-vibeui-block="event-005"] [data-part="pick-label"]{align-self:flex-start;padding:.5rem .95rem;border-radius:999px;background:rgb(255 255 255 / .18);backdrop-filter:blur(10px);font-size:.95rem;font-weight:500}
[data-vibeui-block="event-005"] [data-part="pick-body"]{display:grid;gap:.75rem}
[data-vibeui-block="event-005"] [data-part="pick-card"]{padding:1rem 1.1rem;border-radius:1rem;background:rgb(255 255 255 / .16);backdrop-filter:blur(14px);border:1px solid rgb(255 255 255 / .18)}
[data-vibeui-block="event-005"] [data-part="pick-title"]{margin:0;font-family:var(--vibeui-event-005-display);font-size:1.35rem;font-weight:600;line-height:1.2;letter-spacing:-.02em}
[data-vibeui-block="event-005"] [data-part="pick-date"]{margin:.4rem 0 0;font-size:.9rem;opacity:.85}
@container (min-width: 48rem){
[data-vibeui-block="event-005"] [data-part="list"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@container (min-width: 68rem){
[data-vibeui-block="event-005"] [data-part="shell"]{padding:2.5rem 2rem 4rem}
[data-vibeui-block="event-005"] [data-part="grid"]{grid-template-columns:minmax(0,1fr) 19rem;gap:3rem;align-items:start}
[data-vibeui-block="event-005"] [data-part="list"]{grid-template-columns:repeat(4,minmax(0,1fr))}
[data-vibeui-block="event-005"] [data-part="aside"]{position:sticky;top:5.5rem}
[data-vibeui-block="event-005"] [data-part="pick"]{min-height:38rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="event-005"] *{animation:none!important;transition:none!important}}`

const P = "/demo/festival"

const DEFAULT_ITEMS: Event005Item[] = [
  { title: "Открытие: оркестр на воде и салют из конфетти", image: `${P}/event-01.webp`, tag: "#Музыка", tagColor: "#ffe2d6", stage: "Главная сцена", time: "пт, 20:00", href: "#" },
  { title: "Гастрономический ряд: 24 кухни города", image: `${P}/event-02.webp`, tag: "#Еда", tagColor: "#c2df37", stage: "Фуд-корт", time: "все дни, 12:00–23:00", badge: "Бесплатно", href: "#" },
  { title: "Большая картина: рисуем полотно 30 метров", image: `${P}/event-03.webp`, tag: "#Дети", tagColor: "#9854d1", tagInk: "#fff", stage: "Детская поляна", time: "сб, 11:00", badge: "0+", href: "#" },
  { title: "Как город слышит: лекция о звуке улиц", image: `${P}/event-04.webp`, tag: "#Лекции", tagColor: "#f1ddbc", stage: "Лекторий", time: "сб, 15:00", badge: "Бесплатно", href: "#" },
  { title: "Маркет локальных брендов и керамики", image: `${P}/event-05.webp`, tag: "#Маркет", tagColor: "#006461", tagInk: "#fff", stage: "Аллея", time: "сб–вс, 12:00–21:00", href: "#" },
  { title: "Кино под небом: короткий метр о городе", image: `${P}/event-06.webp`, tag: "#Кино", tagColor: "#f3c37d", stage: "Набережная", time: "сб, 21:30", href: "#" },
  { title: "Утренняя йога на набережной", image: `${P}/event-07.webp`, tag: "#Утро", tagColor: "#98f5af", stage: "Набережная", time: "сб–вс, 08:00", badge: "Бесплатно", href: "#" },
  { title: "Тихая дискотека: три диджея в наушниках", image: `${P}/event-08.webp`, tag: "#Ночь", tagColor: "#122378", tagInk: "#fff", stage: "Танцпол", time: "сб, 23:00", badge: "18+", href: "#" },
]

/** Программа фестиваля сеткой карточек и липкая карточка «Выбор дня». */
export function Event005({
  eyebrow = "Программа",
  title = "Что происходит на площадках",
  items = DEFAULT_ITEMS,
  pick = { label: "Выбор дня", image: `${P}/pick.webp`, title: "Ночной концерт на воде: сцена посреди пруда", date: "суббота, 22:00 · Главная сцена", actionLabel: "К событию →", href: "#" },
  moreLabel = "Вся программа →",
  moreHref = "#schedule",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Event005Props) {
  const palette = {
    ...(accent ? { "--vibeui-event-005-accent": accent } : null),
    ...(background ? { "--vibeui-event-005-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-event-005" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="event-005" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="grid">
            <div>
              <div data-part="head">
                {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
                {moreLabel ? (
                  <Button077
                    data-part="more"
                    label={moreLabel}
                    href={moreHref}
                    accent={accent}
                  />
                ) : null}
              </div>
              <h2 data-part="title">{title}</h2>
              <ul data-part="list">
                {items.map((item, index) => (
                  <li key={item.title} data-part="card" style={{ ["--vibeui-event-005-n" as string]: index }}>
                    <a data-part="photo" href={item.href ?? "#"} tabIndex={-1} aria-hidden="true">
                      {item.image ? <img src={item.image} alt={item.imageAlt ?? ""} loading="lazy" /> : null}
                      {item.badge ? <span data-part="badge">{item.badge}</span> : null}
                    </a>
                    <h3 data-part="card-title">{item.href ? <a href={item.href}>{item.title}</a> : item.title}</h3>
                    <p data-part="meta">
                      {item.tag ? (
                        <span data-part="tag" style={{ ["--vibeui-event-005-tag" as string]: item.tagColor, ["--vibeui-event-005-ink" as string]: item.tagInk ?? "#111" }}>
                          {item.tag}
                        </span>
                      ) : null}
                      {item.stage ? <span>{item.stage}</span> : null}
                      {item.time ? <span>· {item.time}</span> : null}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            {pick ? (
              <aside data-part="aside">
                <div data-part="pick">
                  {pick.image ? <img src={pick.image} alt={pick.imageAlt ?? ""} loading="lazy" /> : null}
                  {pick.label ? <span data-part="pick-label">{pick.label}</span> : null}
                  <div data-part="pick-body">
                    <div data-part="pick-card">
                      <p data-part="pick-title">{pick.title}</p>
                      {pick.date ? <p data-part="pick-date">{pick.date}</p> : null}
                    </div>
                    {pick.actionLabel ? (
                      <Button016
                        data-part="pick-action"
                        label={pick.actionLabel}
                        href={pick.href ?? "#"}
                        external={false}
                        size="md"
                        tone="accent"
                        accent={accent}
                      />
                    ) : null}
                  </div>
                </div>
              </aside>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
