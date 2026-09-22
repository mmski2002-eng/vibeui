"use client"

import { useState, type CSSProperties } from "react"
import { Button086 } from "@/registry/components/button/button-086/button-086"

export type Renovation003Work = {
  name: string
  /** Фото до и после: одинаковый ракурс. */
  before: string
  after: string
  /** Короткие факты: тип ремонта, срок, бюджет. */
  type?: string
  weeks?: number
  price?: string
  area?: string
  text?: string
}

export type Renovation003Props = {
  eyebrow?: string
  title?: string
  lede?: string
  works?: readonly Renovation003Work[]
  beforeLabel?: string
  afterLabel?: string
  /** Начальное положение шторки, %. */
  defaultPosition?: number
  /** aria вкладок и шторки, подписи фактов, «нед». */
  tabsLabel?: string
  weekShort?: string
  afterAlt?: string
  beforeAlt?: string
  sliderLabel?: string
  areaLabel?: string
  typeLabel?: string
  termLabel?: string
  worksLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Объекты «до/после»: слева список объектов-вкладок с площадью и сроком,
// справа сравнение — фото «после» целиком, фото «до» поверх обрезано
// clip-path по положению шторки. Шторку двигает невидимый range на всю
// площадь: работает пальцем, мышью и стрелками. Ручка с двумя стрелками и
// размерная подпись «до | после» в процентах. При смене объекта шторка
// возвращается на середину с плавным переходом.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="renovation-003"]){
--vibeui-renovation-003-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-renovation-003-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-renovation-003-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-renovation-003-on-accent:oklch(from var(--vibeui-renovation-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-renovation-003-muted:color-mix(in oklab,var(--vibeui-renovation-003-fg) 62%,var(--vibeui-renovation-003-bg));
--vibeui-renovation-003-line:color-mix(in oklab,var(--vibeui-renovation-003-fg) 16%,transparent);
--vibeui-renovation-003-grid:color-mix(in oklab,var(--vibeui-renovation-003-fg) 7%,transparent);
--vibeui-renovation-003-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-renovation-003-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-renovation-003-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="renovation-003"]{color-scheme:dark}
:where([data-vibeui-block="renovation-003"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="renovation-003"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="renovation-003"]{box-sizing:border-box;padding:5rem 0;background-color:var(--vibeui-renovation-003-bg);background-image:linear-gradient(var(--vibeui-renovation-003-grid) 1px,transparent 1px),linear-gradient(90deg,var(--vibeui-renovation-003-grid) 1px,transparent 1px);background-size:5rem 5rem;color:var(--vibeui-renovation-003-fg);font-family:var(--vibeui-renovation-003-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="renovation-003"] *{box-sizing:border-box}
[data-vibeui-block="renovation-003"] [data-part="tab"]{min-width:13rem}
[data-vibeui-block="renovation-003"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="renovation-003"] [data-part="head"]{max-width:44rem;margin-bottom:2.5rem}
[data-vibeui-block="renovation-003"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 1rem;font-family:var(--vibeui-renovation-003-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-renovation-003-muted)}
[data-vibeui-block="renovation-003"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-renovation-003-accent)}
[data-vibeui-block="renovation-003"] [data-part="title"]{margin:0;font-family:var(--vibeui-renovation-003-display);font-weight:800;font-size:clamp(2rem,5cqi,3.6rem);line-height:1;letter-spacing:-.035em;text-wrap:balance}
[data-vibeui-block="renovation-003"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-renovation-003-muted)}
[data-vibeui-block="renovation-003"] [data-part="grid"]{display:grid;gap:1.25rem;align-items:start}
[data-vibeui-block="renovation-003"] [data-part="tabs"]{display:flex;gap:.5rem;margin:0;padding:0 0 .25rem;list-style:none;overflow-x:auto;scrollbar-width:none}
[data-vibeui-block="renovation-003"] [data-part="range"]:focus-visible + [data-part="handle"]{outline:2px solid var(--vibeui-renovation-003-accent);outline-offset:2px}
[data-vibeui-block="renovation-003"] [data-part="compare"]{position:relative;aspect-ratio:4/3;overflow:hidden;border:1px solid var(--vibeui-renovation-003-fg);background:color-mix(in oklab,var(--vibeui-renovation-003-fg) 8%,transparent);user-select:none;touch-action:pan-y}
[data-vibeui-block="renovation-003"] [data-part="compare"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="renovation-003"] [data-part="before"]{clip-path:inset(0 calc(100% - var(--vibeui-renovation-003-x)) 0 0)}
[data-vibeui-block="renovation-003"] [data-part="compare"][data-settling="true"] [data-part="before"]{transition:clip-path .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="renovation-003"] [data-part="compare"][data-settling="true"] [data-part="handle"]{transition:left .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="renovation-003"] [data-part="tag"]{position:absolute;top:.8rem;padding:.3rem .55rem;background:var(--vibeui-renovation-003-fg);color:var(--vibeui-renovation-003-bg);font-family:var(--vibeui-renovation-003-mono);font-size:.66rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;pointer-events:none}
[data-vibeui-block="renovation-003"] [data-part="tag"][data-side="before"]{left:.8rem}
[data-vibeui-block="renovation-003"] [data-part="tag"][data-side="after"]{right:.8rem;background:var(--vibeui-renovation-003-accent);color:var(--vibeui-renovation-003-on-accent)}
[data-vibeui-block="renovation-003"] [data-part="range"]{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:ew-resize;-webkit-appearance:none;appearance:none;z-index:3}
[data-vibeui-block="renovation-003"] [data-part="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:3rem;height:100%}
[data-vibeui-block="renovation-003"] [data-part="handle"]{position:absolute;top:0;bottom:0;left:var(--vibeui-renovation-003-x);width:0;border-left:2px solid var(--vibeui-renovation-003-accent);pointer-events:none;z-index:2}
[data-vibeui-block="renovation-003"] [data-part="handle"]::before{content:"";position:absolute;top:50%;left:-1.35rem;width:2.6rem;height:2.6rem;margin-top:-1.3rem;border-radius:50%;background:var(--vibeui-renovation-003-accent);box-shadow:0 8px 24px -8px rgb(0 0 0 / .6)}
[data-vibeui-block="renovation-003"] [data-part="handle"] svg{position:absolute;top:50%;left:-.8rem;width:1.6rem;height:1.6rem;margin-top:-.8rem;color:var(--vibeui-renovation-003-on-accent)}
[data-vibeui-block="renovation-003"] [data-part="handle"] span{position:absolute;bottom:.8rem;left:50%;transform:translateX(-50%);padding:.2rem .45rem;background:var(--vibeui-renovation-003-fg);color:var(--vibeui-renovation-003-bg);font-family:var(--vibeui-renovation-003-mono);font-size:.62rem;font-weight:500;white-space:nowrap}
[data-vibeui-block="renovation-003"] [data-part="facts"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));margin:0;border:1px solid var(--vibeui-renovation-003-line);border-top:0}
[data-vibeui-block="renovation-003"] [data-part="facts"] div{display:grid;gap:.15rem;padding:.7rem .9rem;border-right:1px solid var(--vibeui-renovation-003-line);border-bottom:1px solid var(--vibeui-renovation-003-line)}
[data-vibeui-block="renovation-003"] [data-part="facts"] dt{font-family:var(--vibeui-renovation-003-mono);font-size:.6rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-renovation-003-muted)}
[data-vibeui-block="renovation-003"] [data-part="facts"] dd{margin:0;font-family:var(--vibeui-renovation-003-mono);font-weight:500;font-size:.9rem;font-variant-numeric:tabular-nums}
[data-vibeui-block="renovation-003"] [data-part="text"]{margin:.9rem 0 0;font-size:.92rem;color:var(--vibeui-renovation-003-muted)}
@container (min-width: 40rem){[data-vibeui-block="renovation-003"] [data-part="facts"]{grid-template-columns:repeat(4,minmax(0,1fr))}[data-vibeui-block="renovation-003"] [data-part="facts"] div{border-bottom:0}[data-vibeui-block="renovation-003"] [data-part="facts"] div:last-child{border-right:0}}
@container (min-width: 60rem){
[data-vibeui-block="renovation-003"] [data-part="tab"]{min-width:0}[data-vibeui-block="renovation-003"] [data-part="grid"]{grid-template-columns:18rem minmax(0,1fr);gap:2rem}[data-vibeui-block="renovation-003"] [data-part="tabs"]{flex-direction:column;overflow:visible}[data-vibeui-block="renovation-003"] [data-part="compare"]{aspect-ratio:16/10}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="renovation-003"] *{animation:none!important;transition:none!important}}`

const DEFAULT_WORKS: Renovation003Work[] = [
  { name: "Двушка на Ленинском", before: "/demo/renovation/before-01.webp", after: "/demo/renovation/after-01.webp", type: "Капитальный", weeks: 11, price: "1,28 млн ₽", area: "62 м²", text: "Панельный дом 1974 года. Снесли встроенные шкафы, перенесли кухню в бывшую кладовую, стяжку выровняли на 4 см." },
  { name: "Трёшка в Сколково", before: "/demo/renovation/before-02.webp", after: "/demo/renovation/after-02.webp", type: "Дизайнерский", weeks: 16, price: "3,4 млн ₽", area: "96 м²", text: "Новостройка без отделки. Проект от бюро заказчика, мы вели авторский надзор и делали скрытые двери и шторный карниз в потолке." },
  { name: "Студия на Таганке", before: "/demo/renovation/before-03.webp", after: "/demo/renovation/after-03.webp", type: "Косметический", weeks: 4, price: "290 тыс. ₽", area: "31 м²", text: "Под сдачу: перекрасили стены, заменили ламинат, санузел — новая плитка на пол и ревизионный люк." },
]

/** Объекты до/после со шторкой и переключателем объектов. */
export function Renovation003({
  eyebrow = "Объекты",
  title = "Потяните шторку — увидите разницу",
  lede = "Один ракурс до и после. Фото снимаем сами в день сдачи, без ретуши и «стилиста».",
  works = DEFAULT_WORKS,
  beforeLabel = "до",
  afterLabel = "после",
  defaultPosition = 50,
  tabsLabel = "Объекты",
  weekShort = "нед",
  afterAlt = "{name}: после ремонта",
  beforeAlt = "{name}: до ремонта",
  sliderLabel = "Шторка до/после",
  areaLabel = "Площадь",
  typeLabel = "Тип",
  termLabel = "Срок",
  worksLabel = "Работы",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Renovation003Props) {
  const [index, setIndex] = useState(0)
  const [position, setPosition] = useState(defaultPosition)
  const [settling, setSettling] = useState(false)
  const work = works[Math.min(index, works.length - 1)]

  const pick = (next: number) => {
    setIndex(next)
    setSettling(true)
    setPosition(defaultPosition)
  }

  const palette = {
    ...(accent ? { "--vibeui-renovation-003-accent": accent } : null),
    ...(ink ? { "--vibeui-renovation-003-fg": ink } : null),
    ...(background ? { "--vibeui-renovation-003-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-renovation-003" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="renovation-003" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="grid">
            <ul data-part="tabs" role="tablist" aria-label={tabsLabel}>
              {works.map((item, itemIndex) => (
                <li key={item.name} role="presentation">
                  <Button086 data-part="tab" name={item.name} area={item.area} kindText={item.type} weeks={item.weeks} weekShort={weekShort} aria-selected={itemIndex === index} onClick={() => pick(itemIndex)} accent={accent} />
                </li>
              ))}
            </ul>
            <div data-part="panel" role="tabpanel">
              <div data-part="compare" data-settling={settling} style={{ ["--vibeui-renovation-003-x" as string]: `${position}%` }}>
                <img data-part="after" src={work.after} alt={afterAlt.replace("{name}", work.name)} loading="lazy" draggable={false} />
                <img data-part="before" src={work.before} alt={beforeAlt.replace("{name}", work.name)} loading="lazy" draggable={false} />
                <span data-part="tag" data-side="before">
                  {beforeLabel}
                </span>
                <span data-part="tag" data-side="after">
                  {afterLabel}
                </span>
                <input
                  data-part="range"
                  type="range"
                  min={0}
                  max={100}
                  value={position}
                  aria-label={sliderLabel}
                  onChange={(event) => setPosition(Number(event.target.value))}
                  onPointerDown={() => setSettling(false)}
                  onKeyDown={() => setSettling(false)}
                />
                <div data-part="handle" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />
                  </svg>
                  <span>
                    {beforeLabel} {position} % | {afterLabel} {100 - position} %
                  </span>
                </div>
              </div>
              <dl data-part="facts">
                {work.area ? (
                  <div>
                    <dt>{areaLabel}</dt>
                    <dd>{work.area}</dd>
                  </div>
                ) : null}
                {work.type ? (
                  <div>
                    <dt>{typeLabel}</dt>
                    <dd>{work.type}</dd>
                  </div>
                ) : null}
                {work.weeks ? (
                  <div>
                    <dt>{termLabel}</dt>
                    <dd>{work.weeks} {weekShort}</dd>
                  </div>
                ) : null}
                {work.price ? (
                  <div>
                    <dt>{worksLabel}</dt>
                    <dd>{work.price}</dd>
                  </div>
                ) : null}
              </dl>
              {work.text ? <p data-part="text">{work.text}</p> : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
