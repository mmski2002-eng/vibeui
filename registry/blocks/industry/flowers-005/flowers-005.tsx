"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Button082 } from "@/registry/components/button/button-082/button-082"

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
[data-vibeui-block="flowers-005"]{box-sizing:border-box;padding:4rem 0;background:var(--vibeui-flowers-005-bg);color:var(--vibeui-flowers-005-fg);font-family:var(--vibeui-flowers-005-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="flowers-005"] *{box-sizing:border-box}
[data-vibeui-block="flowers-005"] [data-part="head"]{width:100%}
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
@keyframes vibeui-flowers-005-draw{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}
[data-vibeui-block="flowers-005"] [data-part="panel"]{display:grid;grid-template-rows:0fr;transition:grid-template-rows .45s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="flowers-005"] [data-part="panel"][data-open="true"]{grid-template-rows:1fr}
[data-vibeui-block="flowers-005"] [data-part="panel"]>div{overflow:hidden}
[data-vibeui-block="flowers-005"] [data-part="panel"] p{margin:0;padding:0 0 1.4rem 3.5rem;max-width:34rem;color:var(--vibeui-flowers-005-muted)}
@container (min-width: 60rem){[data-vibeui-block="flowers-005"] [data-part="shell"]{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:4rem}[data-vibeui-block="flowers-005"] [data-part="aside"]{position:sticky;top:5.5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="flowers-005"] *{animation:none!important;transition:none!important}}`


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
                  <Button082 data-part="head" icon={item.icon} title={item.title} aria-expanded={expanded} onClick={() => setOpen(expanded ? -1 : index)} accent={accent} />
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
