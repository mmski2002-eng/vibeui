"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Card132 } from "@/registry/components/card/card-132/card-132"

export type About013Frame = {
  date: string
  title: string
  text?: string
  image?: string
  imageAlt?: string
}

export type About013Props = {
  eyebrow?: string
  /** Часть в «кавычках» уходит в курсив. */
  title?: string
  lede?: string
  /** Четыре кадра — по метке на линии на каждый. */
  frames?: readonly About013Frame[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// История пары как редакционный таймлайн: тонкая линия проходит через
// секцию, на ней — метка на каждый кадр. Пока секцию прокручивают, кадры
// проявляются один за другим (opacity/translate), текущий — с акцентной
// меткой. Прогресс считает rAF из положения секции в окне, в state попадает
// только число проявленных кадров.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="about-013"]){
--vibeui-about-013-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-about-013-card:light-dark(#ffffff,#242424);
--vibeui-about-013-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-about-013-muted:light-dark(#6b6b6b,#a3a3a3);
--vibeui-about-013-line:light-dark(color-mix(in oklab,var(--vibeui-about-013-fg) 16%,transparent),color-mix(in oklab,var(--vibeui-about-013-fg) 22%,transparent));
--vibeui-about-013-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-about-013-silver:#9fb0c8;
--vibeui-about-013-display:"Cormorant Garamond",Georgia,serif;
--vibeui-about-013-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="about-013"]{color-scheme:dark}
:where([data-vibeui-block="about-013"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="about-013"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="about-013"]{box-sizing:border-box;position:relative;display:block;overflow:hidden;background:var(--vibeui-about-013-bg);color:var(--vibeui-about-013-fg);font-family:var(--vibeui-about-013-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="about-013"] *{box-sizing:border-box}
[data-vibeui-block="about-013"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4.5rem 1.25rem}
[data-vibeui-block="about-013"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-about-013-display);font-size:.85rem;font-weight:500;letter-spacing:.32em;text-transform:uppercase;color:var(--vibeui-about-013-silver)}
[data-vibeui-block="about-013"] [data-part="title"]{margin:0;font-family:var(--vibeui-about-013-display);font-size:clamp(2.2rem,5.5cqi,3.8rem);font-weight:500;line-height:1.05;letter-spacing:-.01em}
[data-vibeui-block="about-013"] [data-part="title"] em{font-style:italic;font-weight:400;color:var(--vibeui-about-013-accent)}
[data-vibeui-block="about-013"] [data-part="lede"]{max-width:36rem;margin:1rem 0 0;color:var(--vibeui-about-013-muted)}
[data-vibeui-block="about-013"] [data-part="frames"]{position:relative;display:grid;grid-template-columns:1fr;gap:2.75rem;margin:3.5rem 0 0;padding:.3rem 0 .3rem 1.6rem;list-style:none}
[data-vibeui-block="about-013"] [data-part="frames"]::before{content:"";position:absolute;left:0;top:0;bottom:0;width:1px;background:linear-gradient(to bottom,transparent,var(--vibeui-about-013-silver) 10%,var(--vibeui-about-013-silver) 90%,transparent);opacity:.4}
@container (min-width:56rem){
[data-vibeui-block="about-013"] [data-part="frames"]{grid-template-columns:repeat(4,minmax(0,1fr));gap:0 1.75rem;margin-top:4rem;padding:2.4rem 0 0}
[data-vibeui-block="about-013"] [data-part="frames"]::before{left:0;right:0;top:0;bottom:auto;width:auto;height:1px;background:linear-gradient(to right,transparent,var(--vibeui-about-013-silver) 6%,var(--vibeui-about-013-silver) 94%,transparent)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="about-013"] *{animation:none!important;transition:none!important}}`

/** История пары таймлайном: кадры проявляются при прокрутке, метка на линии подсвечивает текущий. */
export function About013({
  eyebrow = "Наша история",
  title = "Четыре зимы «до»",
  lede = "Мы познакомились зимой и с тех пор считаем годы не по календарю, а по снегу. Эта — четвёртая.",
  frames = [
    { date: "Декабрь 2023", title: "Каток", text: "Дима упал первым, Лера — второй. Встали вместе, так и держимся." },
    { date: "Январь 2025", title: "Ёлка на двоих", text: "Несли её через весь город. Игрушек хватило на одну ветку." },
    { date: "Февраль 2026", title: "Первая зима вместе", text: "Съехались в снегопад. Коробки разбирали до весны." },
    { date: "Ноябрь 2027", title: "Под ёлкой в лесу", text: "Дима спросил под большой елью с гирляндой. Лера сказала «да» и «холодно»." },
  ],
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: About013Props) {
  const root = useRef<HTMLElement>(null)
  const [lit, setLit] = useState(0)
  const palette = {
    ...(accent ? { "--vibeui-about-013-accent": accent } : null),
    ...(ink ? { "--vibeui-about-013-fg": ink } : null),
    ...(background ? { "--vibeui-about-013-bg": background } : null),
    ...style,
  } as CSSProperties

  // Кадры проявляются по прокрутке: секция входит снизу — ни одного,
  // её середина прошла центр окна — все четыре. В state только число.
  useEffect(() => {
    const node = root.current
    if (!node) return
    let frame = 0
    const read = () => {
      frame = 0
      const rect = node.getBoundingClientRect()
      const viewport = window.innerHeight
      const start = viewport * 0.85
      const end = viewport * 0.3 - rect.height * 0.3
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)))
      setLit(Math.min(4, Math.floor(progress * 4.999)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }
    frame = requestAnimationFrame(read)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const shown = frames.slice(0, 4)
  const [head, tail] = title.split("«")

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-about-013" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="about-013" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">
            {head}
            {tail ? <em>{`«${tail}`}</em> : null}
          </h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <ol data-part="frames">
            {shown.map((item, index) => (
              <Card132 key={item.title} data-part="frame" title={item.title} date={item.date} image={item.image} imageAlt={item.imageAlt} text={item.text} data-lit={index < lit ? "true" : undefined} data-now={index === lit - 1 ? "true" : undefined} accent={accent} />
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
