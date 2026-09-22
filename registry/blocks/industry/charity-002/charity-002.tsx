"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"
import { Card081 } from "@/registry/components/card/card-081/card-081"

export type Charity002Story = {
  name: string
  /** Возраст и город: «84 года · Ржев». */
  meta: string
  /** Текст письма — печатается при открытии. */
  letter: string
  /** Подпись под письмом. Пусто — имя. */
  sign?: string
  image?: string
  imageAlt?: string
}

export type Charity002Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Рукописная пометка у ленты. */
  hint?: string
  stories?: readonly Charity002Story[]
  openLabel?: string
  closeLabel?: string
  /** aria стрелок, штамп «почта России», «от кого». */
  prevLabel?: string
  nextLabel?: string
  stampLines?: readonly [string, string]
  fromLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Истории подопечных как письма: горизонтальная лента с drag-scroll
// (мышью тянуть, на тач — нативно), карточки-конверты стоят с лёгкой
// ротацией, фото подопечного — марка с перфорацией, адрес написан от руки.
// Клик раскрывает конверт: клапан поворачивается в 3D, лицевая сторона
// уходит, а из конверта поднимается лист, на котором письмо печатается
// буква за буквой. «Сложить» возвращает конверт.
const FONTS = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;700&display=swap"

const STYLES = `
:where([data-vibeui-block="charity-002"]){
--vibeui-charity-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-charity-002-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-charity-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-charity-002-on-accent:oklch(from var(--vibeui-charity-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-charity-002-muted:color-mix(in oklab,var(--vibeui-charity-002-fg) 62%,var(--vibeui-charity-002-bg));
--vibeui-charity-002-line:color-mix(in oklab,var(--vibeui-charity-002-fg) 16%,transparent);
--vibeui-charity-002-soft:color-mix(in oklab,var(--vibeui-charity-002-fg) 6%,var(--vibeui-charity-002-bg));
--vibeui-charity-002-paper:color-mix(in oklab,var(--vibeui-charity-002-fg) 3%,var(--vibeui-charity-002-bg));
--vibeui-charity-002-second:color-mix(in oklab,var(--vibeui-charity-002-accent) 45%,#e0b000);
--vibeui-charity-002-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-charity-002-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-charity-002-hand:"Caveat","Segoe Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="charity-002"]{color-scheme:dark}
:where([data-vibeui-block="charity-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="charity-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="charity-002"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-charity-002-bg);color:var(--vibeui-charity-002-fg);font-family:var(--vibeui-charity-002-font);font-size:1rem;line-height:1.5;overflow:hidden}
[data-vibeui-block="charity-002"] *{box-sizing:border-box}
[data-vibeui-block="charity-002"] [data-part="env"]{width:100%}
[data-vibeui-block="charity-002"] [data-part="head"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:1.2rem;align-items:end}
[data-vibeui-block="charity-002"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.8rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-charity-002-accent)}
[data-vibeui-block="charity-002"] [data-part="title"]{margin:0;font-family:var(--vibeui-charity-002-display);font-weight:500;font-size:clamp(2rem,4.6cqi,3.4rem);line-height:1.08;letter-spacing:-.02em}
[data-vibeui-block="charity-002"] [data-part="lede"]{margin:1rem 0 0;max-width:34rem;color:var(--vibeui-charity-002-muted)}
[data-vibeui-block="charity-002"] [data-part="arrows"]{display:flex;gap:.5rem;align-items:center}
[data-vibeui-block="charity-002"] [data-part="hint"]{margin:0 .8rem 0 0;font-family:var(--vibeui-charity-002-hand);font-size:1.35rem;line-height:1.1;color:var(--vibeui-charity-002-accent);transform:rotate(-3deg)}
[data-vibeui-block="charity-002"] [data-part="arrow"]{width:2.8rem;height:2.8rem;border-radius:50%;border:1px solid var(--vibeui-charity-002-line);background:transparent;color:inherit;cursor:pointer;display:grid;place-items:center;transition:background .2s,border-color .2s}
[data-vibeui-block="charity-002"] [data-part="arrow"]:hover{background:var(--vibeui-charity-002-soft);border-color:var(--vibeui-charity-002-accent)}
[data-vibeui-block="charity-002"] [data-part="arrow"] svg{width:1.1rem;height:1.1rem}
[data-vibeui-block="charity-002"] [data-part="lane"]{display:flex;gap:1.5rem;margin:2.5rem 0 0;padding:1.5rem max(1.25rem,calc((100% - 80rem) / 2 + 1.25rem)) 2rem;overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:none;cursor:grab;user-select:none;-webkit-user-select:none}
[data-vibeui-block="charity-002"] [data-part="lane"]::-webkit-scrollbar{display:none}
[data-vibeui-block="charity-002"] [data-part="lane"][data-dragging="true"]{cursor:grabbing;scroll-snap-type:none}
[data-vibeui-block="charity-002"] [data-part="letter"]{position:relative;flex:0 0 auto;width:min(21rem,82cqi);height:27rem;scroll-snap-align:center;transform:rotate(var(--vibeui-charity-002-r));transition:transform .4s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="charity-002"] [data-part="letter"][data-open="true"]{transform:rotate(0) scale(1.02);z-index:2}
[data-vibeui-block="charity-002"] [data-part="letter"][data-open="true"] [data-vibeui-block="card-081"]{opacity:0;transform:scale(.96) translateY(6%);pointer-events:none;transition-delay:.3s}
[data-vibeui-block="charity-002"] [data-part="letter"][data-open="true"] [data-vibeui-block="card-081"] [data-part="flap"]{transform:rotateX(-175deg)}
[data-vibeui-block="charity-002"] [data-part="sheet"]{position:absolute;inset:.4rem;display:flex;flex-direction:column;padding:1.5rem 1.4rem 1.2rem;background:var(--vibeui-charity-002-bg);background-image:repeating-linear-gradient(transparent 0 calc(1.5em - 1px),var(--vibeui-charity-002-line) calc(1.5em - 1px) 1.5em);background-origin:content-box;border:1px solid var(--vibeui-charity-002-line);box-shadow:0 24px 48px -28px rgb(0 0 0 / .5);opacity:0;transform:translateY(40%);pointer-events:none;transition:opacity .45s ease,transform .6s cubic-bezier(.2,.8,.2,1);overflow:hidden}
[data-vibeui-block="charity-002"] [data-part="letter"][data-open="true"] [data-part="sheet"]{opacity:1;transform:translateY(0);pointer-events:auto;transition-delay:.35s}
[data-vibeui-block="charity-002"] [data-part="body"]{margin:0;flex:1;font-family:var(--vibeui-charity-002-hand);font-size:1.32rem;line-height:1.5em;color:var(--vibeui-charity-002-fg);white-space:pre-wrap}
[data-vibeui-block="charity-002"] [data-part="body"][data-typing="true"]::after{content:"";display:inline-block;width:.08em;height:1em;margin-left:.05em;vertical-align:-.15em;background:var(--vibeui-charity-002-accent);animation:vibeui-charity-002-blink 1s steps(2) infinite}
[data-vibeui-block="charity-002"] [data-part="sign"]{margin:.5rem 0 0;font-family:var(--vibeui-charity-002-hand);font-size:1.5rem;line-height:1.5em;text-align:right;color:var(--vibeui-charity-002-accent);opacity:0;transition:opacity .4s}
[data-vibeui-block="charity-002"] [data-part="sign"][data-show="true"]{opacity:1}
[data-vibeui-block="charity-002"] [data-part="close"]{align-self:flex-start;margin-top:.4rem;padding:.4rem .8rem;border-radius:999px;border:1px solid var(--vibeui-charity-002-line);background:var(--vibeui-charity-002-bg);color:var(--vibeui-charity-002-muted);font:inherit;font-size:.78rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;cursor:pointer;transition:color .2s,border-color .2s}
[data-vibeui-block="charity-002"] [data-part="close"]:hover{color:var(--vibeui-charity-002-fg);border-color:var(--vibeui-charity-002-accent)}
[data-vibeui-block="charity-002"] [data-part="close"]:focus-visible,[data-vibeui-block="charity-002"] [data-part="arrow"]:focus-visible{outline:2px solid var(--vibeui-charity-002-accent);outline-offset:2px}
@keyframes vibeui-charity-002-blink{to{opacity:0}}
@container (min-width: 48rem){[data-vibeui-block="charity-002"] [data-part="head"]{grid-template-columns:minmax(0,1fr) auto}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="charity-002"] *{animation:none!important;transition:none!important}}`

const DEFAULT_STORIES: Charity002Story[] = [
  { name: "Нина Петровна", meta: "84 года · Ржев", letter: "Здравствуйте, мои дорогие. Пишу, потому что телефон я так и не освоила. Спасибо за Катю — она приходит по средам, мы пьём чай и она ругает меня за давление. Кран на кухне теперь не капает, я сплю. Обнимаю всех, кого не знаю.", sign: "Нина П." },
  { name: "Виктор Ильич", meta: "79 лет · Торжок", letter: "Сорок лет проработал на вагонзаводе, а вот дверь в подъезде сам не осилил. Ребята приехали в субботу, поставили замок и заодно ушли с моей рыбалочной байкой. Хотя бы посмеялись. Спасибо. Продукты — тоже спасибо, но главное — что помнят.", sign: "В. Козлов" },
  { name: "Зинаида Фёдоровна", meta: "88 лет · Кувшиново", letter: "Лекарства привезли, всё по списку, чек приложили — вот это по-человечески. Мурзик передаёт привет вашему Серёже, который его кормил, пока я лежала в больнице. Живём. Не забывайте нас.", sign: "Зина" },
  { name: "Анна Семёновна", meta: "91 год · Тверь", letter: "Раньше по неделям ни с кем не разговаривала. Теперь по четвергам — Лена, а по воскресеньям звонит Игорь, читает мне газету. Мне кажется, я снова стала человеком, а не квартирой с номером.", sign: "А. С." },
]

/** Истории подопечных: лента конвертов с drag-scroll, письмо печатается. */
export function Charity002({
  eyebrow = "Кому мы помогаем",
  title = "Письма из тех квартир, где мы бываем каждую неделю",
  lede = "Мы не рассказываем истории за подопечных — они пишут сами. Иногда от руки, иногда диктуют соцработнику. Ничего не редактируем.",
  hint = "потяните ленту",
  stories = DEFAULT_STORIES,
  openLabel = "Открыть письмо",
  closeLabel = "Сложить",
  prevLabel = "Назад",
  nextLabel = "Вперёд",
  stampLines = ["почта", "России"],
  fromLabel = "от кого:",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Charity002Props) {
  const laneRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: 0 })
  const [dragging, setDragging] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [typed, setTyped] = useState(0)
  const openStory = openIndex === null ? null : (stories[openIndex] ?? null)

  useEffect(() => {
    if (!openStory) return
    const total = openStory.letter.length
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let count = 0
    const id = window.setInterval(
      () => {
        count = reduce ? total : count + 1
        setTyped(count)
        if (count >= total) window.clearInterval(id)
      },
      reduce ? 0 : 28,
    )
    return () => window.clearInterval(id)
  }, [openStory])

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !laneRef.current) return
    drag.current = { active: true, startX: event.clientX, startLeft: laneRef.current.scrollLeft, moved: 0 }
    setDragging(true)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active || !laneRef.current) return
    const dx = event.clientX - drag.current.startX
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx))
    laneRef.current.scrollLeft = drag.current.startLeft - dx
  }

  const onPointerUp = () => {
    if (!drag.current.active) return
    drag.current.active = false
    setDragging(false)
  }

  const open = (index: number) => {
    if (drag.current.moved > 6) return
    setTyped(0)
    setOpenIndex(index)
  }

  const scrollBy = (direction: -1 | 1) => {
    const lane = laneRef.current
    if (!lane) return
    lane.scrollBy({ left: direction * Math.min(360, lane.clientWidth * 0.8), behavior: "smooth" })
  }

  const palette = {
    ...(accent ? { "--vibeui-charity-002-accent": accent } : null),
    ...(ink ? { "--vibeui-charity-002-fg": ink } : null),
    ...(background ? { "--vibeui-charity-002-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-charity-002" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="charity-002" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="head">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="arrows">
            {hint ? (
              <span data-part="hint" aria-hidden="true">
                {hint}
              </span>
            ) : null}
            <button data-part="arrow" type="button" aria-label={prevLabel} onClick={() => scrollBy(-1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button data-part="arrow" type="button" aria-label={nextLabel} onClick={() => scrollBy(1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        <div ref={laneRef} data-part="lane" data-dragging={dragging} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onPointerLeave={onPointerUp}>
          {stories.map((story, index) => {
            const isOpen = openIndex === index
            const done = isOpen && typed >= story.letter.length
            return (
              <article key={story.name} data-part="letter" data-open={isOpen} style={{ ["--vibeui-charity-002-r" as string]: `${((index % 3) - 1) * 1.6}deg` }}>
                <Card081 data-part="env" name={story.name} image={story.image} imageAlt={story.imageAlt} meta={story.meta} openLabel={openLabel} stampLines={stampLines} fromLabel={fromLabel} tabIndex={isOpen ? -1 : 0} aria-expanded={isOpen} onClick={() => open(index)} accent={accent} />
                <div data-part="sheet" aria-hidden={!isOpen}>
                  <p data-part="body" data-typing={isOpen && !done}>
                    {isOpen ? story.letter.slice(0, typed) : ""}
                  </p>
                  <p data-part="sign" data-show={done}>
                    — {story.sign ?? story.name}
                  </p>
                  <button data-part="close" type="button" tabIndex={isOpen ? 0 : -1} onClick={() => setOpenIndex(null)}>
                    {closeLabel}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </>
  )
}
