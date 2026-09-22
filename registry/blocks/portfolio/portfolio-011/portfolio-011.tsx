import type { CSSProperties } from "react"
import { Card127 } from "@/registry/components/card/card-127/card-127"

export type Portfolio011Shot = {
  src: string
  alt?: string
  /** Подпись-каракуля по наведению: «7:12, первый тартин». */
  note?: string
  /** Размер плитки в bento: big — 2×2, wide — 2×1, tall — 1×2. */
  span?: "big" | "wide" | "tall"
}

export type Portfolio011Props = {
  eyebrow?: string
  title?: string
  lede?: string
  shots?: readonly Portfolio011Shot[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Bento-галерея «одно утро по часам»: плитки разного размера в плотной
// сетке (grid-auto-flow: dense), по наведению плитка чуть вырастает и
// всплывает над соседями, фото наезжает, а снизу проявляется рукописная
// подпись со временем. На устройствах без hover подписи видны всегда.
// Появление — scroll-driven (`animation-timeline: view()`, без поддержки —
// просто видно): заголовок поднимается словами из-под маски, плитки
// всплывают каскадом, а фото внутри едут медленнее прокрутки — параллакс
// глубины. Без состояния: всё на CSS.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Golos+Text:wght@400;500;600&family=Caveat:wght@600&display=swap"

const STYLES = `
:where([data-vibeui-block="portfolio-011"]){
--vibeui-portfolio-011-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-portfolio-011-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-portfolio-011-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-portfolio-011-muted:color-mix(in oklab,var(--vibeui-portfolio-011-fg) 60%,var(--vibeui-portfolio-011-bg));
--vibeui-portfolio-011-panel:color-mix(in oklab,var(--vibeui-portfolio-011-fg) 6%,var(--vibeui-portfolio-011-bg));
--vibeui-portfolio-011-display:"Playfair Display",ui-serif,Georgia,serif;
--vibeui-portfolio-011-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-portfolio-011-hand:"Caveat",cursive;
--vibeui-portfolio-011-ease:cubic-bezier(.2,.8,.2,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="portfolio-011"]{color-scheme:dark}
:where([data-vibeui-block="portfolio-011"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="portfolio-011"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="portfolio-011"]{box-sizing:border-box;position:relative;overflow:clip;padding:5.5rem 0;background:var(--vibeui-portfolio-011-bg);color:var(--vibeui-portfolio-011-fg);font-family:var(--vibeui-portfolio-011-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="portfolio-011"] *{box-sizing:border-box}
[data-vibeui-block="portfolio-011"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="portfolio-011"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.5rem;font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--vibeui-portfolio-011-accent);font-weight:600;margin:0 0 1.1rem}
[data-vibeui-block="portfolio-011"] [data-part="eyebrow"]::before{content:"";width:1.4rem;height:2px;background:var(--vibeui-portfolio-011-accent);border-radius:2px}
[data-vibeui-block="portfolio-011"] [data-part="title"]{margin:0;font-family:var(--vibeui-portfolio-011-display);font-weight:600;letter-spacing:-.025em;line-height:1.02;font-size:clamp(2.2rem,5cqi,4rem)}
[data-vibeui-block="portfolio-011"] [data-part="word"]{display:inline-block;overflow:clip;vertical-align:top;padding:.04em .06em .14em 0;margin:-.04em 0 -.14em}
[data-vibeui-block="portfolio-011"] [data-part="word"] i{display:inline-block;font-style:normal}
[data-vibeui-block="portfolio-011"] [data-part="lede"]{font-size:1.06rem;color:var(--vibeui-portfolio-011-muted);max-width:34rem;margin:1rem 0 0}
[data-vibeui-block="portfolio-011"] [data-part="bento"]{display:grid;grid-template-columns:repeat(2,1fr);grid-auto-rows:10rem;grid-auto-flow:dense;gap:.8rem;margin-top:2.5rem}
@keyframes vibeui-portfolio-011-rise{from{transform:translateY(112%)}to{transform:none}}
@keyframes vibeui-portfolio-011-in{from{opacity:0;translate:0 2.5rem;scale:.94}to{opacity:1;translate:0 0;scale:1}}
@keyframes vibeui-portfolio-011-drift{from{translate:0 -5%}to{translate:0 5%}}
@supports (animation-timeline: view()){
[data-vibeui-block="portfolio-011"] [data-part="word"] i{animation:vibeui-portfolio-011-rise linear both;animation-timeline:view();animation-range:entry 0% entry 60%}
[data-vibeui-block="portfolio-011"] [data-part="lede"]{animation:vibeui-portfolio-011-in linear both;animation-timeline:view();animation-range:entry 0% entry 70%}
}
@container (min-width: 56rem){[data-vibeui-block="portfolio-011"] [data-part="bento"]{grid-template-columns:repeat(4,1fr);grid-auto-rows:12rem}}

@media (prefers-reduced-motion:reduce){[data-vibeui-block="portfolio-011"] *{animation:none!important;transition:none!important}}`

const DEFAULT_SHOTS: Portfolio011Shot[] = [
  { src: "/demo/bakery/hands-flour.webp", note: "5:40, формовка", alt: "Руки формуют тесто на столе в муке", span: "big" },
  { src: "/demo/bakery/story-04.webp", note: "7:12, первый тартин", alt: "Первая партия хлеба остывает на решётке" },
  { src: "/demo/bakery/coffee-flat.webp", note: "7:30, первый флэт", alt: "Флэт уайт с латте-артом" },
  { src: "/demo/bakery/queue.webp", note: "7:55, очередь", alt: "Небольшая очередь у входа в пекарню", span: "wide" },
  { src: "/demo/bakery/window.webp", note: "9:20, у окна", alt: "Гость читает у окна пекарни", span: "tall" },
  { src: "/demo/bakery/story-05.webp", note: "8:05, надрез", alt: "Нож режет свежий хлеб", span: "wide" },
  { src: "/demo/bakery/shelf.webp", note: "10:00, полка полна", alt: "Полка с хлебом" },
  { src: "/demo/bakery/coffee-espresso.webp", note: "10:40, двойной", alt: "Двойной эспрессо в стакане" },
  { src: "/demo/bakery/beans.webp", note: "11:00, зерно недели", alt: "Обжаренные зёрна кофе" },
  { src: "/demo/bakery/hero.webp", note: "12:10, витрина", alt: "Витрина пекарни днём" },
]

/** Bento-галерея с подписями-каракулями по наведению. */
export function Portfolio011({
  eyebrow = "Сегодня утром",
  title = "Как это выглядит",
  lede = "Один обычный вторник, снятый по часам. Наведите — скажем, во сколько.",
  shots = DEFAULT_SHOTS,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Portfolio011Props) {
  const palette = {
    ...(accent ? { "--vibeui-portfolio-011-accent": accent } : null),
    ...(ink ? { "--vibeui-portfolio-011-fg": ink } : null),
    ...(background ? { "--vibeui-portfolio-011-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-portfolio-011" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="portfolio-011" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">
            {title.split(" ").map((word, index, all) => (
              <span key={`${word}-${index}`}>
                <span data-part="word">
                  <i>{word}</i>
                </span>
                {index < all.length - 1 ? " " : ""}
              </span>
            ))}
          </h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="bento">
            {shots.map((shot) => (
              <Card127 key={shot.src} data-part="shot" src={shot.src} span={shot.span} alt={shot.alt} note={shot.note} accent={accent} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
