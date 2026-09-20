"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Flowers005Item = {
  title: string
  text: string
  icon?: "scissors" | "water" | "sun" | "thermometer" | "vase"
}

export type Flowers005Props = {
  eyebrow?: string
  title?: string
  lede?: string
  items?: readonly Flowers005Item[]
  /** Большое число слева: сколько букетов собрали на этой неделе. */
  counter?: number
  counterLabel?: string
  counterNote?: string
  /** Какой пункт открыт при загрузке; −1 — все закрыты. */
  defaultOpen?: number
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Уход за цветами: слева большой счётчик «букетов на этой неделе», который
// докручивается, когда попадает в экран (IntersectionObserver + rAF), и
// рукописная пометка; справа аккордеон с советами. У каждого пункта
// линейная иконка, которая прорисовывается штрихом при раскрытии
// (stroke-dashoffset через pathLength=100), панель раскрывается через
// grid-template-rows 0fr → 1fr, так что высота не прыгает.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="flowers-005"]){
--vibeui-flowers-005-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-flowers-005-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-flowers-005-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-flowers-005-on-accent:oklch(from var(--vibeui-flowers-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-flowers-005-muted:color-mix(in oklab,var(--vibeui-flowers-005-fg) 62%,var(--vibeui-flowers-005-bg));
--vibeui-flowers-005-line:color-mix(in oklab,var(--vibeui-flowers-005-fg) 16%,transparent);
--vibeui-flowers-005-display:"Cormorant",Georgia,"Times New Roman",serif;
--vibeui-flowers-005-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-flowers-005-hand:"Caveat","Segoe Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="flowers-005"]{color-scheme:dark}
:where([data-vibeui-block="flowers-005"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="flowers-005"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="flowers-005"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-flowers-005-bg);color:var(--vibeui-flowers-005-fg);font-family:var(--vibeui-flowers-005-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="flowers-005"] *{box-sizing:border-box}
[data-vibeui-block="flowers-005"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem;align-items:start}
[data-vibeui-block="flowers-005"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.74rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-flowers-005-muted)}
[data-vibeui-block="flowers-005"] [data-part="title"]{margin:0;font-family:var(--vibeui-flowers-005-display);font-weight:500;font-size:clamp(2.2rem,5.4cqi,4.2rem);line-height:1;letter-spacing:-.02em}
[data-vibeui-block="flowers-005"] [data-part="lede"]{margin:.8rem 0 0;max-width:30rem;color:var(--vibeui-flowers-005-muted)}
[data-vibeui-block="flowers-005"] [data-part="counter"]{margin:2rem 0 0;padding:1.6rem 0 0;border-top:1px solid var(--vibeui-flowers-005-line)}
[data-vibeui-block="flowers-005"] [data-part="counter"] b{display:block;font-family:var(--vibeui-flowers-005-display);font-weight:500;font-size:clamp(4.5rem,12cqi,8rem);line-height:.85;letter-spacing:-.04em;font-variant-numeric:tabular-nums;color:var(--vibeui-flowers-005-accent)}
[data-vibeui-block="flowers-005"] [data-part="counter"] span{display:block;margin-top:.6rem;font-size:.95rem}
[data-vibeui-block="flowers-005"] [data-part="counter"] em{display:block;margin-top:.4rem;font-family:var(--vibeui-flowers-005-hand);font-style:normal;font-size:1.35rem;line-height:1.1;color:var(--vibeui-flowers-005-muted);transform:rotate(-2deg);transform-origin:left}
[data-vibeui-block="flowers-005"] [data-part="list"]{margin:0;padding:0;list-style:none;border-top:1px solid var(--vibeui-flowers-005-line)}
[data-vibeui-block="flowers-005"] [data-part="item"]{border-bottom:1px solid var(--vibeui-flowers-005-line)}
[data-vibeui-block="flowers-005"] [data-part="head"]{display:grid;grid-template-columns:2.4rem minmax(0,1fr) 1.6rem;align-items:center;gap:1.1rem;width:100%;padding:1.2rem 0;border:0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}
[data-vibeui-block="flowers-005"] [data-part="head"]:focus-visible{outline:2px solid var(--vibeui-flowers-005-accent);outline-offset:3px;border-radius:.4rem}
[data-vibeui-block="flowers-005"] [data-part="icon"]{width:2.4rem;height:2.4rem;color:var(--vibeui-flowers-005-muted);transition:color .3s}
[data-vibeui-block="flowers-005"] [data-part="icon"] path,[data-vibeui-block="flowers-005"] [data-part="icon"] circle{stroke-dasharray:100;stroke-dashoffset:0;opacity:.55;transition:opacity .3s}
[data-vibeui-block="flowers-005"] [data-part="head"][aria-expanded="true"] [data-part="icon"]{color:var(--vibeui-flowers-005-accent)}
[data-vibeui-block="flowers-005"] [data-part="head"][aria-expanded="true"] [data-part="icon"] :is(path,circle){opacity:1;animation:vibeui-flowers-005-draw .9s cubic-bezier(.2,.7,.2,1) both}
@keyframes vibeui-flowers-005-draw{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}
[data-vibeui-block="flowers-005"] [data-part="head"][aria-expanded="true"] [data-part="icon"] :is(path,circle):nth-child(2){transition-delay:.15s}
[data-vibeui-block="flowers-005"] [data-part="head"][aria-expanded="true"] [data-part="icon"] :is(path,circle):nth-child(3){transition-delay:.3s}
[data-vibeui-block="flowers-005"] [data-part="head"] h3{margin:0;font-family:var(--vibeui-flowers-005-display);font-weight:600;font-size:1.5rem;line-height:1.1;transition:color .3s}
[data-vibeui-block="flowers-005"] [data-part="head"]:hover h3{color:var(--vibeui-flowers-005-accent)}
[data-vibeui-block="flowers-005"] [data-part="plus"]{position:relative;width:1.6rem;height:1.6rem;border-radius:50%;border:1px solid var(--vibeui-flowers-005-line)}
[data-vibeui-block="flowers-005"] [data-part="plus"]::before,[data-vibeui-block="flowers-005"] [data-part="plus"]::after{content:"";position:absolute;left:50%;top:50%;width:.7rem;height:1px;background:currentColor;transform:translate(-50%,-50%);transition:transform .35s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="flowers-005"] [data-part="plus"]::after{transform:translate(-50%,-50%) rotate(90deg)}
[data-vibeui-block="flowers-005"] [data-part="head"][aria-expanded="true"] [data-part="plus"]::after{transform:translate(-50%,-50%) rotate(0)}
[data-vibeui-block="flowers-005"] [data-part="panel"]{display:grid;grid-template-rows:0fr;transition:grid-template-rows .45s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="flowers-005"] [data-part="panel"][data-open="true"]{grid-template-rows:1fr}
[data-vibeui-block="flowers-005"] [data-part="panel"]>div{overflow:hidden}
[data-vibeui-block="flowers-005"] [data-part="panel"] p{margin:0;padding:0 0 1.4rem 3.5rem;max-width:34rem;color:var(--vibeui-flowers-005-muted)}
@container (min-width: 60rem){[data-vibeui-block="flowers-005"] [data-part="shell"]{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:4rem}[data-vibeui-block="flowers-005"] [data-part="aside"]{position:sticky;top:5.5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="flowers-005"] *{animation:none!important;transition:none!important}[data-vibeui-block="flowers-005"] [data-part="icon"] :is(path,circle){stroke-dashoffset:0}}`

const ICONS = {
  scissors: (
    <>
      <circle pathLength={100} cx="6" cy="6" r="3" />
      <circle pathLength={100} cx="6" cy="18" r="3" />
      <path pathLength={100} d="M20 4 8.5 15.5M8.5 8.5 20 20" />
    </>
  ),
  water: (
    <>
      <path pathLength={100} d="M12 3c-3.5 5-6 8-6 11.5a6 6 0 0 0 12 0C18 11 15.5 8 12 3Z" />
      <path pathLength={100} d="M9 15.5a3 3 0 0 0 2 2.5" />
    </>
  ),
  sun: (
    <>
      <circle pathLength={100} cx="12" cy="12" r="4" />
      <path pathLength={100} d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  thermometer: (
    <>
      <path pathLength={100} d="M10 4a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0Z" />
      <path pathLength={100} d="M12 9v7" />
      <circle pathLength={100} cx="12" cy="17" r="1.2" />
    </>
  ),
  vase: (
    <>
      <path pathLength={100} d="M8 3h8c0 3 2 4 2 8s-2 8-4 10H10C8 19 6 15 6 11s2-5 2-8Z" />
      <path pathLength={100} d="M9 5h6" />
    </>
  ),
}

const DEFAULT_ITEMS: Flowers005Item[] = [
  { title: "Подрежьте стебли наискосок", text: "Два сантиметра острым ножом под углом 45°, лучше под водой — так стебель не втянет воздух и сразу начнёт пить. Повторяйте раз в два дня.", icon: "scissors" },
  { title: "Вода — прохладная, каждый день новая", text: "Ваза чистая, вода из-под крана, отстоянная полчаса. Пакетик подкормки из бумажного конверта — на литр. Листья ниже уровня воды оборвите, иначе они загниют.", icon: "water" },
  { title: "Никакого солнца и батарей", text: "Букет любит рассеянный свет и место подальше от окна, плиты и радиатора. Сквозняк тоже плох: лепестки высыхают за ночь.", icon: "sun" },
  { title: "Прохладнее — дольше", text: "Идеальные 16–18 °C. Если жарко, на ночь уносите букет в самую прохладную комнату или на балкон, пока он не остывает ниже +5.", icon: "thermometer" },
  { title: "Не ставьте рядом фрукты", text: "Яблоки и бананы выделяют этилен — цветы от него стареют вдвое быстрее. Отдельный стол — и пионы простоят на три дня дольше.", icon: "vase" },
]

/** Уход за цветами: аккордеон с прорисовкой иконок и счётчик букетов. */
export function Flowers005({
  eyebrow = "Уход",
  title = "Чтобы стояли дольше",
  lede = "Пять правил, которые мы кладём в каждый букет на открытке. Здесь — подробнее.",
  items = DEFAULT_ITEMS,
  counter = 312,
  counterLabel = "букетов собрали на этой неделе",
  counterNote = "и к каждому — открытка с этими правилами",
  defaultOpen = 0,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Flowers005Props) {
  const [open, setOpen] = useState(defaultOpen)
  const [shown, setShown] = useState(0)
  const counterRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const node = counterRef.current
    if (!node) return
    let frame = 0
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        const started = performance.now()
        const tick = (time: number) => {
          const progress = Math.min(1, (time - started) / 1600)
          const eased = 1 - Math.pow(1 - progress, 3)
          setShown(Math.round(counter * eased))
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [counter])

  const palette = {
    ...(accent ? { "--vibeui-flowers-005-accent": accent } : null),
    ...(ink ? { "--vibeui-flowers-005-fg": ink } : null),
    ...(background ? { "--vibeui-flowers-005-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-flowers-005" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="flowers-005" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="aside">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            {counter > 0 ? (
              <p data-part="counter" ref={counterRef}>
                <b aria-label={String(counter)}>{shown}</b>
                <span>{counterLabel}</span>
                {counterNote ? <em>{counterNote}</em> : null}
              </p>
            ) : null}
          </div>
          <ul data-part="list">
            {items.map((item, index) => {
              const expanded = open === index
              return (
                <li key={item.title} data-part="item">
                  <button data-part="head" type="button" aria-expanded={expanded} onClick={() => setOpen(expanded ? -1 : index)}>
                    <svg data-part="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {ICONS[item.icon ?? "vase"]}
                    </svg>
                    <h3>{item.title}</h3>
                    <i data-part="plus" aria-hidden="true" />
                  </button>
                  <div data-part="panel" data-open={expanded}>
                    <div>
                      <p>{item.text}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}
