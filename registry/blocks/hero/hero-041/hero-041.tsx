"use client"

import { useEffect, useRef, type CSSProperties } from "react"

export type Hero041Card = {
  name: string
  /** Цена строкой, как печатать: «2 490 ₽». */
  price: string
  image: string
  /** Тип товара для моно-подписи: «figma», «notion», «иконки». */
  kind?: string
}

export type Hero041Props = {
  eyebrow?: string
  /** Строки заголовка: каждая въезжает из-под маски по очереди. */
  lines?: readonly string[]
  lede?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  /** Обложки на полке: 8 — сетка 4×2 на широком, первые 4 — 2×2 на узком. */
  cards?: readonly Hero041Card[]
  hint?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Хиро маркетплейса ассетов: sticky-сцена высотой в два экрана. На старте
// обложки товаров стоят «полкой» — в 3D-перспективе, внахлёст, повёрнутые
// на 32°. По прокрутке прогресс 0→1 пишется в CSS-переменную, и карточки
// разъезжаются в ровную сетку 4×2 (2×2 на узком): позиции считаются в
// calc() из индекса, колонки и строки, поэтому без JS-раскладки. Строки
// заголовка въезжают из-под маски overflow:hidden с задержкой по очереди.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-041"]){
--vibeui-hero-041-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-hero-041-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-041-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-041-on-accent:oklch(from var(--vibeui-hero-041-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-041-muted:color-mix(in oklab,var(--vibeui-hero-041-fg) 58%,var(--vibeui-hero-041-bg));
--vibeui-hero-041-line:color-mix(in oklab,var(--vibeui-hero-041-fg) 12%,transparent);
--vibeui-hero-041-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-041-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-041-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-hero-041-p:0;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-041"]{color-scheme:dark}
:where([data-vibeui-block="hero-041"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-041"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-041"]{box-sizing:border-box;position:relative;min-height:200svh;background:var(--vibeui-hero-041-bg);color:var(--vibeui-hero-041-fg);font-family:var(--vibeui-hero-041-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-041"] *{box-sizing:border-box}
[data-vibeui-block="hero-041"] [data-part="stage"]{position:sticky;top:0;min-height:100svh;display:flex;flex-direction:column;justify-content:center;gap:1.5rem;overflow:hidden;padding:5.5rem 1.25rem 2.5rem}
[data-vibeui-block="hero-041"] [data-part="head"]{max-width:60rem;margin:0 auto;text-align:center}
[data-vibeui-block="hero-041"] [data-part="eyebrow"]{margin:0 0 1rem;font-family:var(--vibeui-hero-041-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-hero-041-muted)}
[data-vibeui-block="hero-041"] [data-part="eyebrow"] b{font-weight:500;color:var(--vibeui-hero-041-accent)}
[data-vibeui-block="hero-041"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-041-display);font-weight:800;font-size:clamp(2.6rem,8cqi,6.5rem);line-height:.96;letter-spacing:-.045em}
[data-vibeui-block="hero-041"] [data-part="line"]{display:block;overflow:hidden;padding-bottom:.06em;margin-bottom:-.06em}
[data-vibeui-block="hero-041"] [data-part="word"]{display:block;transform:translateY(112%);animation:vibeui-hero-041-rise .9s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:calc(var(--vibeui-hero-041-i) * .09s + .1s)}
[data-vibeui-block="hero-041"] [data-part="word"] em{font-style:normal;color:var(--vibeui-hero-041-accent)}
[data-vibeui-block="hero-041"] [data-part="lede"]{max-width:34rem;margin:1.2rem auto 0;color:var(--vibeui-hero-041-muted);font-size:1.02rem}
[data-vibeui-block="hero-041"] [data-part="actions"]{display:flex;flex-wrap:wrap;justify-content:center;gap:.6rem;margin:1.5rem 0 0}
[data-vibeui-block="hero-041"] [data-part="primary"],[data-vibeui-block="hero-041"] [data-part="secondary"]{display:inline-flex;align-items:center;gap:.5rem;height:3rem;padding:0 1.35rem;border-radius:999px;font-weight:600;text-decoration:none;transition:transform .18s,box-shadow .2s,background .2s}
[data-vibeui-block="hero-041"] [data-part="primary"]{background:var(--vibeui-hero-041-accent);color:var(--vibeui-hero-041-on-accent)}
[data-vibeui-block="hero-041"] [data-part="primary"]:hover{transform:translateY(-1px);box-shadow:0 12px 30px -12px var(--vibeui-hero-041-accent)}
[data-vibeui-block="hero-041"] [data-part="secondary"]{color:var(--vibeui-hero-041-fg);border:1px solid var(--vibeui-hero-041-line)}
[data-vibeui-block="hero-041"] [data-part="secondary"]:hover{background:color-mix(in oklab,var(--vibeui-hero-041-fg) 5%,transparent)}
[data-vibeui-block="hero-041"] a:focus-visible{outline:2px solid var(--vibeui-hero-041-accent);outline-offset:2px}
[data-vibeui-block="hero-041"] [data-part="shelf"]{--vibeui-hero-041-cw:44cqi;--vibeui-hero-041-gap:3cqi;--vibeui-hero-041-cols:2;--vibeui-hero-041-rows:2;--vibeui-hero-041-n:4;--vibeui-hero-041-spread:12cqi;position:relative;width:100%;height:calc(var(--vibeui-hero-041-rows) * (var(--vibeui-hero-041-cw) * .75 + var(--vibeui-hero-041-gap)) - var(--vibeui-hero-041-gap));margin:.5rem auto 0;perspective:1400px;perspective-origin:50% 40%;transform-style:preserve-3d}
[data-vibeui-block="hero-041"] [data-part="card"]{--vibeui-hero-041-c:var(--vibeui-hero-041-c2);--vibeui-hero-041-r:var(--vibeui-hero-041-r2);--vibeui-hero-041-x0:calc((var(--vibeui-hero-041-i) - (var(--vibeui-hero-041-n) - 1) / 2) * var(--vibeui-hero-041-spread));--vibeui-hero-041-x1:calc((var(--vibeui-hero-041-c) - (var(--vibeui-hero-041-cols) - 1) / 2) * (var(--vibeui-hero-041-cw) + var(--vibeui-hero-041-gap)));--vibeui-hero-041-y1:calc((var(--vibeui-hero-041-r) - (var(--vibeui-hero-041-rows) - 1) / 2) * (var(--vibeui-hero-041-cw) * .75 + var(--vibeui-hero-041-gap)));position:absolute;left:50%;top:50%;width:var(--vibeui-hero-041-cw);aspect-ratio:4/3;margin-left:calc(var(--vibeui-hero-041-cw) / -2);margin-top:calc(var(--vibeui-hero-041-cw) * -.375);border-radius:clamp(.6rem,1.6cqi,1.1rem);overflow:hidden;background:var(--vibeui-hero-041-line);box-shadow:0 30px 60px -30px rgb(0 0 0 / .45);z-index:var(--vibeui-hero-041-i);transform:translate3d(calc(var(--vibeui-hero-041-x0) * (1 - var(--vibeui-hero-041-p)) + var(--vibeui-hero-041-x1) * var(--vibeui-hero-041-p)),calc(var(--vibeui-hero-041-y1) * var(--vibeui-hero-041-p)),calc(var(--vibeui-hero-041-i) * -28px * (1 - var(--vibeui-hero-041-p)))) rotateY(calc(-32deg * (1 - var(--vibeui-hero-041-p)))) rotateX(calc(8deg * (1 - var(--vibeui-hero-041-p)))) scale(calc(.9 + .1 * var(--vibeui-hero-041-p)))}
[data-vibeui-block="hero-041"] [data-part="card"][data-extra]{display:none}
[data-vibeui-block="hero-041"] [data-part="card"] img{display:block;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="hero-041"] [data-part="label"]{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:space-between;gap:.5rem;padding:.55rem .7rem;font-family:var(--vibeui-hero-041-mono);font-size:clamp(.58rem,1.1cqi,.72rem);color:#fff;background:linear-gradient(transparent,rgb(0 0 0 / .55));opacity:var(--vibeui-hero-041-p)}
[data-vibeui-block="hero-041"] [data-part="label"] span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="hero-041"] [data-part="hint"]{display:flex;justify-content:center;align-items:center;gap:.5rem;margin:.5rem 0 0;font-family:var(--vibeui-hero-041-mono);font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-hero-041-muted);opacity:calc(1 - var(--vibeui-hero-041-p) * 4)}
[data-vibeui-block="hero-041"] [data-part="hint"] svg{width:.9rem;height:.9rem;animation:vibeui-hero-041-bounce 1.6s ease-in-out infinite}
@keyframes vibeui-hero-041-rise{to{transform:translateY(0)}}
@keyframes vibeui-hero-041-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(4px)}}
@container (min-width: 48rem){[data-vibeui-block="hero-041"] [data-part="shelf"]{--vibeui-hero-041-cw:min(21cqi,16rem);--vibeui-hero-041-gap:min(2cqi,1.4rem);--vibeui-hero-041-cols:4;--vibeui-hero-041-n:8;--vibeui-hero-041-spread:9cqi}[data-vibeui-block="hero-041"] [data-part="card"]{--vibeui-hero-041-c:var(--vibeui-hero-041-c4);--vibeui-hero-041-r:var(--vibeui-hero-041-r4)}[data-vibeui-block="hero-041"] [data-part="card"][data-extra]{display:block}[data-vibeui-block="hero-041"] [data-part="stage"]{gap:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-041"] *{animation:none!important;transition:none!important}[data-vibeui-block="hero-041"]{--vibeui-hero-041-p:1!important}[data-vibeui-block="hero-041"] [data-part="word"]{transform:none}}`

const DEFAULT_CARDS: Hero041Card[] = [
  { name: "Атлас — UI-кит", price: "2 490 ₽", image: "/demo/market/cover-01.webp", kind: "figma" },
  { name: "Рутина — второй мозг", price: "990 ₽", image: "/demo/market/cover-02.webp", kind: "notion" },
  { name: "Грань — 480 иконок", price: "1 490 ₽", image: "/demo/market/cover-03.webp", kind: "иконки" },
  { name: "Нарва Grotesk", price: "3 900 ₽", image: "/demo/market/cover-04.webp", kind: "шрифт" },
  { name: "Дашборд Про", price: "3 200 ₽", image: "/demo/market/cover-05.webp", kind: "figma" },
  { name: "Спринт — трекер", price: "1 290 ₽", image: "/demo/market/cover-06.webp", kind: "notion" },
  { name: "Пиксель 3D", price: "1 990 ₽", image: "/demo/market/cover-07.webp", kind: "иконки" },
  { name: "Мото Script", price: "2 400 ₽", image: "/demo/market/cover-08.webp", kind: "шрифт" },
]

function renderLine(line: string) {
  const parts = line.split("*")
  return parts.map((part, index) => (index % 2 === 1 ? <em key={index}>{part}</em> : part))
}

/** Хиро с полкой обложек в 3D, которая по прокрутке разъезжается в сетку. */
export function Hero041({
  eyebrow = "маркетплейс цифровых товаров · *4 812* в каталоге",
  lines = ["Шаблоны и шрифты", "от тех, кто", "ими *живёт*"],
  lede = "Figma, Notion, иконки и шрифты от независимых авторов. Купил — скачал — в работе через минуту. 80 % цены уходит автору.",
  primaryLabel = "Смотреть каталог",
  primaryHref = "#catalog",
  secondaryLabel = "Продавать на Слое",
  secondaryHref = "#for-authors",
  cards = DEFAULT_CARDS,
  hint = "листайте — полка разъедется",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero041Props) {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let frame = 0
    const update = () => {
      frame = 0
      const rect = root.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1
      root.style.setProperty("--vibeui-hero-041-p", progress.toFixed(4))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-hero-041-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-041-fg": ink } : null),
    ...(background ? { "--vibeui-hero-041-bg": background } : null),
    ...style,
  } as CSSProperties

  const shown = cards.slice(0, 8)

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-041" precedence="medium">
        {STYLES}
      </style>
      <section ref={rootRef} data-vibeui-block="hero-041" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="stage">
          <div data-part="head">
            {eyebrow ? (
              <p data-part="eyebrow">
                {eyebrow.split("*").map((part, index) => (index % 2 === 1 ? <b key={index}>{part}</b> : part))}
              </p>
            ) : null}
            <h1 data-part="title">
              {lines.map((line, index) => (
                <span key={index} data-part="line">
                  <span data-part="word" style={{ ["--vibeui-hero-041-i" as string]: index }}>
                    {renderLine(line)}
                  </span>
                </span>
              ))}
            </h1>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="actions">
              {primaryLabel ? (
                <a data-part="primary" href={primaryHref}>
                  {primaryLabel}
                </a>
              ) : null}
              {secondaryLabel ? (
                <a data-part="secondary" href={secondaryHref}>
                  {secondaryLabel}
                </a>
              ) : null}
            </div>
          </div>
          <div data-part="shelf" aria-hidden="true">
            {shown.map((card, index) => (
              <div
                key={card.name}
                data-part="card"
                data-extra={index >= 4 ? "" : undefined}
                style={{
                  ["--vibeui-hero-041-i" as string]: index,
                  ["--vibeui-hero-041-c4" as string]: index % 4,
                  ["--vibeui-hero-041-r4" as string]: Math.floor(index / 4),
                  ["--vibeui-hero-041-c2" as string]: index % 2,
                  ["--vibeui-hero-041-r2" as string]: Math.floor(index / 2),
                }}
              >
                <img src={card.image} alt="" loading="eager" />
                <div data-part="label">
                  <span>{card.name}</span>
                  <span>{card.price}</span>
                </div>
              </div>
            ))}
          </div>
          {hint ? (
            <p data-part="hint">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14m-6-6 6 6 6-6" />
              </svg>
              {hint}
            </p>
          ) : null}
        </div>
      </section>
    </>
  )
}
