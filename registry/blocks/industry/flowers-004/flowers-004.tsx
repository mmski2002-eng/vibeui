"use client"

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type PointerEvent } from "react"
import { Card087 } from "@/registry/components/card/card-087/card-087"

export type Flowers004Month = {
  name: string
  /** Что цветёт: 2–4 названия. */
  flowers: readonly string[]
  /** Короткая пометка: «пик пионов», «дорого, но можно». */
  note?: string
  /** Цвет месяца: им подсвечивается фон и летят лепестки. */
  color?: string
}

export type Flowers004Props = {
  eyebrow?: string
  title?: string
  lede?: string
  months?: readonly Flowers004Month[]
  /** Подпись у текущего месяца. */
  nowLabel?: string
  /** aria стрелок и ленты, подсказка под лентой. */
  prevLabel?: string
  nextLabel?: string
  ribbonLabel?: string
  hint?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Сезонный календарь: двенадцать месяцев одной горизонтальной лентой,
// которую можно тянуть мышью (drag-scroll через pointer capture) или
// колесом. Текущий месяц берётся из useSyncExternalStore (на сервере
// пусто — ни один не подсвечен, после гидрации лента сама подъезжает к
// нему), его карточка получает чернильную рамку и рукописную пометку
// «цветёт сейчас». Стрелки по краям — для клавиатуры и тех, кто не тянет.
// У каждого месяца свой цвет: под карточкой, на которую навели (иначе —
// текущей), фон секции мягко подсвечивается им, а сверху медленно падают
// лепестки того же цвета — цвет переливается через transition.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="flowers-004"]){
--vibeui-flowers-004-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-flowers-004-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-flowers-004-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-flowers-004-on-accent:oklch(from var(--vibeui-flowers-004-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-flowers-004-muted:color-mix(in oklab,var(--vibeui-flowers-004-fg) 62%,var(--vibeui-flowers-004-bg));
--vibeui-flowers-004-line:color-mix(in oklab,var(--vibeui-flowers-004-fg) 16%,transparent);
--vibeui-flowers-004-paper:color-mix(in oklab,var(--vibeui-flowers-004-fg) 5%,var(--vibeui-flowers-004-bg));
--vibeui-flowers-004-display:"Cormorant",Georgia,"Times New Roman",serif;
--vibeui-flowers-004-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-flowers-004-hand:"Caveat","Segoe Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="flowers-004"]{color-scheme:dark}
:where([data-vibeui-block="flowers-004"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="flowers-004"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="flowers-004"]{box-sizing:border-box;padding:4rem 0;overflow:hidden;background:var(--vibeui-flowers-004-bg);color:var(--vibeui-flowers-004-fg);font-family:var(--vibeui-flowers-004-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="flowers-004"] *{box-sizing:border-box}
[data-vibeui-block="flowers-004"] [data-part="month"]{flex:0 0 15rem}
[data-vibeui-block="flowers-004"]{position:relative;isolation:isolate}
[data-vibeui-block="flowers-004"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="flowers-004"] [data-part="aura"]{position:absolute;right:-10%;top:-30%;z-index:-1;width:70%;aspect-ratio:1;border-radius:50%;background-color:var(--vibeui-flowers-004-glow);opacity:.22;filter:blur(90px);transition:background-color 1s ease;pointer-events:none}
[data-vibeui-block="flowers-004"] [data-part="fall"]{position:absolute;top:-2rem;left:var(--vibeui-flowers-004-l);z-index:-1;width:calc(.7rem + var(--vibeui-flowers-004-sz) * .5rem);aspect-ratio:3/4;border-radius:100% 0 100% 0;background-color:var(--vibeui-flowers-004-glow);opacity:0;transition:background-color 1s ease;pointer-events:none;animation:vibeui-flowers-004-fall var(--vibeui-flowers-004-t) linear var(--vibeui-flowers-004-d) infinite}
@keyframes vibeui-flowers-004-fall{0%{translate:0 0;rotate:0deg;opacity:0}10%{opacity:.7}90%{opacity:.6}100%{translate:-6rem 42rem;rotate:520deg;opacity:0}}
[data-vibeui-block="flowers-004"] [data-part="head"]{display:grid;gap:1.2rem;align-items:end;margin:0 0 2.2rem}
[data-vibeui-block="flowers-004"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.74rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-flowers-004-muted)}
[data-vibeui-block="flowers-004"] [data-part="title"]{margin:0;font-family:var(--vibeui-flowers-004-display);font-weight:500;font-size:clamp(2.2rem,5.4cqi,4.2rem);line-height:1;letter-spacing:-.02em}
[data-vibeui-block="flowers-004"] [data-part="lede"]{margin:.8rem 0 0;max-width:34rem;color:var(--vibeui-flowers-004-muted)}
[data-vibeui-block="flowers-004"] [data-part="arrows"]{display:flex;gap:.5rem}
[data-vibeui-block="flowers-004"] [data-part="arrows"] button{width:2.8rem;height:2.8rem;border-radius:50%;border:1px solid var(--vibeui-flowers-004-fg);background:transparent;color:var(--vibeui-flowers-004-fg);cursor:pointer;display:grid;place-items:center;transition:background .2s,color .2s}
[data-vibeui-block="flowers-004"] [data-part="arrows"] button:hover{background:var(--vibeui-flowers-004-accent);border-color:var(--vibeui-flowers-004-accent);color:var(--vibeui-flowers-004-on-accent)}
[data-vibeui-block="flowers-004"] [data-part="arrows"] button:focus-visible{outline:2px solid var(--vibeui-flowers-004-accent);outline-offset:3px}
[data-vibeui-block="flowers-004"] [data-part="arrows"] svg{width:1.1rem;height:1.1rem}
[data-vibeui-block="flowers-004"] [data-part="ribbon"]{display:flex;gap:1rem;margin:0 -1.25rem;padding:1.4rem 1.25rem 1.6rem;list-style:none;overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:none;cursor:grab;user-select:none;-webkit-user-select:none}
[data-vibeui-block="flowers-004"] [data-part="ribbon"]::-webkit-scrollbar{display:none}
[data-vibeui-block="flowers-004"] [data-part="ribbon"][data-drag="true"]{cursor:grabbing;scroll-snap-type:none;scroll-behavior:auto}
[data-vibeui-block="flowers-004"] [data-part="hint"]{margin:.4rem 0 0;font-family:var(--vibeui-flowers-004-hand);font-size:1.3rem;color:var(--vibeui-flowers-004-muted)}
@container (min-width: 40rem){[data-vibeui-block="flowers-004"] [data-part="head"]{grid-template-columns:minmax(0,1fr) auto}}

@media (prefers-reduced-motion:reduce){[data-vibeui-block="flowers-004"] *{animation:none!important;transition:none!important}}
@container (min-width: 60rem){[data-vibeui-block="flowers-004"] [data-part="month"]{flex-basis:17rem}}
`

const DEFAULT_MONTHS: Flowers004Month[] = [
  { name: "Январь", flowers: ["амариллис", "гиацинт", "тюльпан"], note: "тепличные, но живые и ароматные", color: "#d94b5b" },
  { name: "Февраль", flowers: ["мимоза", "тюльпан", "ранункулюс"], note: "мимоза — ровно две недели", color: "#f2c230" },
  { name: "Март", flowers: ["нарцисс", "ранункулюс", "анемон"], note: "первые голландские анемоны", color: "#f5e27a" },
  { name: "Апрель", flowers: ["сирень", "фрезия", "тюльпан"], note: "сирень едет из Крыма", color: "#b995e0" },
  { name: "Май", flowers: ["пион", "ландыш", "мак"], note: "пионы — с 20 мая", color: "#f2a3bd" },
  { name: "Июнь", flowers: ["пион", "мак", "ромашка"], note: "пик пионов, лучшая цена", color: "#ff6b57" },
  { name: "Июль", flowers: ["лаванда", "дельфиниум", "василёк"], note: "полевые с ферм Ленобласти", color: "#7f8cf0" },
  { name: "Август", flowers: ["георгин", "подсолнух", "гортензия"], note: "георгины до заморозков", color: "#ffb938" },
  { name: "Сентябрь", flowers: ["георгин", "астра", "скабиоза"], note: "самая тёмная палитра года", color: "#c23a6b" },
  { name: "Октябрь", flowers: ["хризантема", "физалис", "рябина"], note: "ягоды и сухоцветы", color: "#ff8a3d" },
  { name: "Ноябрь", flowers: ["амариллис", "эвкалипт", "хлопок"], note: "начинаем сушить", color: "#9fb5a0" },
  { name: "Декабрь", flowers: ["ель", "илекс", "пуансеттия"], note: "хвоя и красные ягоды", color: "#e0433f" },
]

// Лепестки: позиция, размер, длительность и задержка заданы заранее — без Math.random.
const PETALS = Array.from({ length: 12 }, (_, index) => ({
  left: `${(index * 37 + 11) % 100}%`,
  size: (index * 7) % 5,
  time: `${11 + ((index * 5) % 7)}s`,
  delay: `${-((index * 13) % 17)}s`,
}))

function subscribeDay(callback: () => void) {
  const id = setInterval(callback, 3_600_000)
  return () => clearInterval(id)
}

function readMonth() {
  return new Date().getMonth()
}

/** Сезонный календарь: 12 месяцев лентой с drag-scroll, текущий подсвечен. */
export function Flowers004({
  eyebrow = "Сезон",
  title = "Что цветёт в этом месяце",
  lede = "Мы не возим розы из Эквадора круглый год. Вот честный календарь: что свежее, что дешевле и что стоит дольше.",
  months = DEFAULT_MONTHS,
  nowLabel = "цветёт сейчас",
  prevLabel = "Раньше",
  nextLabel = "Позже",
  ribbonLabel = "Календарь сезона",
  hint = "← тяните ленту или листайте стрелками",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Flowers004Props) {
  const month = useSyncExternalStore(subscribeDay, readMonth, () => null)
  const ribbonRef = useRef<HTMLUListElement>(null)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)
  const [hover, setHover] = useState<number | null>(null)
  const lit = hover ?? month ?? 5
  const glow = months[lit]?.color ?? "var(--vibeui-flowers-004-accent)"

  useEffect(() => {
    const ribbon = ribbonRef.current
    if (ribbon === null || month === null) return
    const card = ribbon.children[month] as HTMLElement | undefined
    if (!card) return
    ribbon.scrollLeft = card.offsetLeft - ribbon.clientWidth / 2 + card.offsetWidth / 2
  }, [month])

  const onDown = (event: PointerEvent<HTMLUListElement>) => {
    const ribbon = ribbonRef.current
    if (!ribbon || event.pointerType === "touch") return
    drag.current = { x: event.clientX, left: ribbon.scrollLeft, moved: false }
    ribbon.setPointerCapture(event.pointerId)
    ribbon.dataset.drag = "true"
  }
  const onMove = (event: PointerEvent<HTMLUListElement>) => {
    const ribbon = ribbonRef.current
    if (!ribbon || !drag.current) return
    const delta = event.clientX - drag.current.x
    if (Math.abs(delta) > 3) drag.current.moved = true
    ribbon.scrollLeft = drag.current.left - delta
  }
  const onUp = (event: PointerEvent<HTMLUListElement>) => {
    const ribbon = ribbonRef.current
    if (!ribbon || !drag.current) return
    drag.current = null
    ribbon.releasePointerCapture(event.pointerId)
    delete ribbon.dataset.drag
  }
  const scrollBy = (direction: number) => {
    const ribbon = ribbonRef.current
    if (!ribbon) return
    ribbon.scrollBy({ left: direction * ribbon.clientWidth * 0.7, behavior: "smooth" })
  }

  const palette = {
    ...(accent ? { "--vibeui-flowers-004-accent": accent } : null),
    ...(ink ? { "--vibeui-flowers-004-fg": ink } : null),
    ...(background ? { "--vibeui-flowers-004-bg": background } : null),
    "--vibeui-flowers-004-glow": glow,
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-flowers-004" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="flowers-004" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <i data-part="aura" aria-hidden="true" />
        {PETALS.map((petal, index) => (
          <i
            key={index}
            data-part="fall"
            aria-hidden="true"
            style={{ ["--vibeui-flowers-004-l" as string]: petal.left, ["--vibeui-flowers-004-sz" as string]: petal.size, ["--vibeui-flowers-004-t" as string]: petal.time, ["--vibeui-flowers-004-d" as string]: petal.delay } as CSSProperties}
          />
        ))}
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
            </div>
            <div data-part="arrows">
              <button type="button" onClick={() => scrollBy(-1)} aria-label={prevLabel}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 12H4M11 5l-7 7 7 7" />
                </svg>
              </button>
              <button type="button" onClick={() => scrollBy(1)} aria-label={nextLabel}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 12h16M13 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <ul data-part="ribbon" ref={ribbonRef} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
            onPointerOver={(event) => {
              const card = (event.target as HTMLElement).closest("li")
              const index = card ? Array.prototype.indexOf.call(ribbonRef.current?.children ?? [], card) : -1
              if (index >= 0) setHover(index)
            }}
            onPointerLeave={() => setHover(null)}
            aria-label={ribbonLabel}>
            {months.map((item, index) => (
              <Card087 key={item.name} data-part="month" name={item.name} flowers={item.flowers} note={item.note} nowLabel={nowLabel} month={month} index={index} data-now={month === index} accent={accent} />
            ))}
          </ul>
          <p data-part="hint">{hint}</p>
        </div>
      </section>
    </>
  )
}
