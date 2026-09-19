"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"

export type Bento001Feature = {
  title: string
  text: string
  /** Микродемо на CSS: rows — бегущие строки, sort — строки меняются местами, group — свёртка, types — подсказка типов «печатается», size — линейка, theme — тема переключается, none. */
  demo?: "rows" | "sort" | "group" | "types" | "size" | "theme" | "none"
  /** Плитка на две колонки. */
  wide?: boolean
}

export type Bento001Props = {
  eyebrow?: string
  title?: string
  lede?: string
  features?: readonly Bento001Feature[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Возможности библиотеки bento-плитками, в каждой — живое микродемо на
// чистом CSS, которое идёт само, без наведения: строки бесконечно бегут
// вверх (виртуализация), строки таблицы меняются местами (сортировка),
// группа сворачивается и раскрывается, подсказка типов «печатается»
// символ за символом, линейка размера растёт при появлении, мини-таблица
// переключает светлую и тёмную тему. Заголовок въезжает словами через
// маски, плитки проявляются каскадом, по сетке ходит spotlight за курсором.
const FONTS = "https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="bento-001"]){
--vibeui-bento-001-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-bento-001-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bento-001-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bento-001-muted:color-mix(in oklab,var(--vibeui-bento-001-fg) 60%,var(--vibeui-bento-001-bg));
--vibeui-bento-001-line:color-mix(in oklab,var(--vibeui-bento-001-fg) 12%,transparent);
--vibeui-bento-001-panel:color-mix(in oklab,var(--vibeui-bento-001-fg) 4%,var(--vibeui-bento-001-bg));
--vibeui-bento-001-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-bento-001-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-bento-001-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="bento-001"]{color-scheme:dark}
:where([data-vibeui-block="bento-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="bento-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="bento-001"]{box-sizing:border-box;padding:5.5rem 0;background:var(--vibeui-bento-001-panel);color:var(--vibeui-bento-001-fg);font-family:var(--vibeui-bento-001-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="bento-001"] *{box-sizing:border-box}
[data-vibeui-block="bento-001"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="bento-001"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-bento-001-mono);font-size:.75rem;color:var(--vibeui-bento-001-accent)}
[data-vibeui-block="bento-001"] [data-part="title"]{margin:0;max-width:46rem;font-weight:800;font-size:clamp(2.2rem,5.2cqi,3.8rem);line-height:1.02;letter-spacing:-.04em;text-wrap:balance}
[data-vibeui-block="bento-001"] [data-part="w"]{display:inline-block;overflow:hidden;vertical-align:bottom;padding:.05em .1em .18em 0;margin:-.05em -.1em -.18em 0}
[data-vibeui-block="bento-001"] [data-part="w"] > span{display:inline-block;transform:translateY(110%)}
[data-vibeui-block="bento-001"][data-shown="true"] [data-part="w"] > span{animation:vibeui-bento-001-rise .8s var(--vibeui-bento-001-ease) forwards;animation-delay:calc(var(--vibeui-bento-001-i,0) * .05s)}
[data-vibeui-block="bento-001"] [data-part="lede"]{margin:1rem 0 0;max-width:34rem;color:var(--vibeui-bento-001-muted);font-size:1.05rem}
[data-vibeui-block="bento-001"] [data-reveal]{opacity:0}
[data-vibeui-block="bento-001"][data-shown="true"] [data-reveal]{opacity:1;animation:vibeui-bento-001-up .8s var(--vibeui-bento-001-ease) backwards;animation-delay:calc(.15s + var(--vibeui-bento-001-i,0) * .09s)}
[data-vibeui-block="bento-001"] [data-part="grid"]{display:grid;gap:1px;margin-top:2.5rem;background:var(--vibeui-bento-001-line);border:1px solid var(--vibeui-bento-001-line);border-radius:16px;overflow:hidden}
[data-vibeui-block="bento-001"] [data-part="tile"]{position:relative;display:flex;flex-direction:column;gap:1rem;padding:1.6rem;background:var(--vibeui-bento-001-bg);min-height:17rem;transition:background .3s;overflow:hidden}
[data-vibeui-block="bento-001"] [data-part="tile"]::before{content:"";position:absolute;inset:0;background:radial-gradient(26rem circle at var(--vibeui-bento-001-x,50%) var(--vibeui-bento-001-y,50%),color-mix(in oklab,var(--vibeui-bento-001-accent) 12%,transparent),transparent 55%);opacity:0;transition:opacity .5s;pointer-events:none}
[data-vibeui-block="bento-001"] [data-part="grid"]:hover [data-part="tile"]::before{opacity:1}
[data-vibeui-block="bento-001"] [data-part="tile"] > *{position:relative}
[data-vibeui-block="bento-001"] [data-part="tile"] h3{margin:0;font-size:1.2rem;font-weight:700;letter-spacing:-.015em}
[data-vibeui-block="bento-001"] [data-part="tile"] p{margin:0;color:var(--vibeui-bento-001-muted);font-size:.93rem}
[data-vibeui-block="bento-001"] [data-part="demo"]{margin-top:auto;height:6.8rem;border-radius:10px;border:1px solid var(--vibeui-bento-001-line);background:var(--vibeui-bento-001-panel);overflow:hidden;position:relative;font-family:var(--vibeui-bento-001-mono);font-size:.72rem;color:var(--vibeui-bento-001-muted);transition:transform .5s var(--vibeui-bento-001-ease),border-color .3s}
[data-vibeui-block="bento-001"] [data-part="tile"]:hover [data-part="demo"]{transform:translateY(-3px);border-color:color-mix(in oklab,var(--vibeui-bento-001-accent) 35%,var(--vibeui-bento-001-line))}
[data-vibeui-block="bento-001"] [data-part="row"]{display:flex;gap:.6rem;align-items:center;padding:.45rem .8rem;border-bottom:1px solid var(--vibeui-bento-001-line);background:var(--vibeui-bento-001-bg)}
[data-vibeui-block="bento-001"] [data-part="row"] i{display:block;height:.45rem;border-radius:3px;background:var(--vibeui-bento-001-line)}
[data-vibeui-block="bento-001"] [data-part="row"] i:first-child{width:38%}
[data-vibeui-block="bento-001"] [data-part="row"] i:nth-child(2){width:18%}
[data-vibeui-block="bento-001"] [data-part="row"] i:nth-child(3){width:24%;margin-left:auto;background:color-mix(in oklab,var(--vibeui-bento-001-accent) 45%,var(--vibeui-bento-001-line))}
[data-vibeui-block="bento-001"] [data-demo="rows"] [data-part="stack"]{animation:vibeui-bento-001-scroll 6s linear infinite}
[data-vibeui-block="bento-001"] [data-demo="rows"]::after{content:"virtual · 12 of 48 000";position:absolute;right:.6rem;bottom:.5rem;padding:.15rem .4rem;border-radius:4px;background:var(--vibeui-bento-001-accent);color:var(--vibeui-bento-001-bg);font-size:.62rem}
[data-vibeui-block="bento-001"] [data-demo="sort"] [data-part="row"]:nth-child(1){animation:vibeui-bento-001-down 4.5s var(--vibeui-bento-001-ease) infinite alternate}
[data-vibeui-block="bento-001"] [data-demo="sort"] [data-part="row"]:nth-child(3){animation:vibeui-bento-001-upward 4.5s var(--vibeui-bento-001-ease) infinite alternate}
[data-vibeui-block="bento-001"] [data-demo="sort"]::after{content:"size ↓";position:absolute;right:.6rem;top:.5rem;color:var(--vibeui-bento-001-accent);font-size:.62rem;animation:vibeui-bento-001-blink 4.5s ease infinite alternate}
[data-vibeui-block="bento-001"] [data-demo="group"] [data-part="row"][data-head="true"]{color:var(--vibeui-bento-001-accent);cursor:default}
[data-vibeui-block="bento-001"] [data-demo="group"] [data-part="row"][data-head="true"]::before{content:"▾";display:inline-block;animation:vibeui-bento-001-chev 5s var(--vibeui-bento-001-ease) infinite alternate}
[data-vibeui-block="bento-001"] [data-demo="group"] [data-part="fold"]{display:grid;grid-template-rows:1fr;animation:vibeui-bento-001-fold 5s var(--vibeui-bento-001-ease) infinite alternate}
[data-vibeui-block="bento-001"] [data-demo="group"] [data-part="fold"] > div{overflow:hidden}
[data-vibeui-block="bento-001"] [data-demo="types"]{padding:.9rem;font-size:.8rem;color:var(--vibeui-bento-001-fg)}
[data-vibeui-block="bento-001"] [data-demo="types"] [data-part="typed"]{display:inline-block;overflow:hidden;white-space:nowrap;vertical-align:bottom;width:8ch;animation:vibeui-bento-001-type 3.6s steps(8) infinite alternate}
[data-vibeui-block="bento-001"] [data-demo="types"] b{color:var(--vibeui-bento-001-accent);font-weight:500}
[data-vibeui-block="bento-001"] [data-demo="types"] [data-part="caret"]{display:inline-block;width:.5em;height:1.05em;vertical-align:text-bottom;background:var(--vibeui-bento-001-accent);animation:vibeui-bento-001-caret 1s steps(1) infinite}
[data-vibeui-block="bento-001"] [data-demo="types"] [data-part="tip"]{position:absolute;left:1.8rem;top:2.9rem;padding:.5rem .7rem;border-radius:6px;background:var(--vibeui-bento-001-fg);color:var(--vibeui-bento-001-bg);font-size:.68rem;white-space:nowrap;box-shadow:0 10px 24px -10px rgb(0 0 0 / .5);animation:vibeui-bento-001-tip 3.6s var(--vibeui-bento-001-ease) infinite alternate}
[data-vibeui-block="bento-001"] [data-demo="types"] [data-part="tip"] u{text-decoration:none;color:#7ee787}
[data-vibeui-block="bento-001"] [data-demo="size"]{display:grid;align-content:center;gap:.5rem;padding:.9rem}
[data-vibeui-block="bento-001"] [data-demo="size"] div{display:grid;grid-template-columns:5rem 1fr auto;gap:.6rem;align-items:center}
[data-vibeui-block="bento-001"] [data-demo="size"] i{display:block;height:.5rem;border-radius:3px;background:var(--vibeui-bento-001-line);width:calc(var(--vibeui-bento-001-w) * 100%);transform-origin:left;transform:scaleX(0);transition:transform 1s var(--vibeui-bento-001-ease);transition-delay:calc(.5s + var(--vibeui-bento-001-w) * .3s)}
[data-vibeui-block="bento-001"][data-shown="true"] [data-demo="size"] i{transform:none}
[data-vibeui-block="bento-001"] [data-demo="size"] div:first-child i{background:var(--vibeui-bento-001-accent)}
[data-vibeui-block="bento-001"] [data-demo="theme"]{display:grid;grid-template-rows:auto 1fr;animation:vibeui-bento-001-theme 5s var(--vibeui-bento-001-ease) infinite alternate}
[data-vibeui-block="bento-001"] [data-demo="theme"] [data-part="row"]{background:transparent;border-color:color-mix(in oklab,currentColor 14%,transparent)}
[data-vibeui-block="bento-001"] [data-demo="theme"] [data-part="row"] i{background:currentColor;opacity:.16}
[data-vibeui-block="bento-001"] [data-demo="theme"] [data-part="row"] i:nth-child(3){background:var(--vibeui-bento-001-accent);opacity:.7}
[data-vibeui-block="bento-001"] [data-demo="theme"] [data-part="switch"]{display:flex;align-items:center;justify-content:space-between;gap:.5rem;padding:.45rem .8rem;border-bottom:1px solid color-mix(in oklab,currentColor 14%,transparent);font-size:.62rem}
[data-vibeui-block="bento-001"] [data-demo="theme"] [data-part="switch"] span{display:grid}
[data-vibeui-block="bento-001"] [data-demo="theme"] [data-part="switch"] span > i{grid-area:1/1;font-style:normal}
[data-vibeui-block="bento-001"] [data-demo="theme"] [data-part="switch"] span > i:first-child{animation:vibeui-bento-001-lbl-a 5s steps(1) infinite alternate}
[data-vibeui-block="bento-001"] [data-demo="theme"] [data-part="switch"] span > i:last-child{animation:vibeui-bento-001-lbl-b 5s steps(1) infinite alternate}
[data-vibeui-block="bento-001"] [data-demo="theme"] [data-part="knob"]{position:relative;width:1.8rem;height:1rem;border-radius:999px;background:var(--vibeui-bento-001-accent);flex:none}
[data-vibeui-block="bento-001"] [data-demo="theme"] [data-part="knob"]::after{content:"";position:absolute;top:.15rem;left:.15rem;width:.7rem;height:.7rem;border-radius:50%;background:#fff;animation:vibeui-bento-001-knob 5s var(--vibeui-bento-001-ease) infinite alternate}
@keyframes vibeui-bento-001-scroll{to{transform:translateY(-50%)}}
@keyframes vibeui-bento-001-rise{to{transform:none}}
@keyframes vibeui-bento-001-up{from{opacity:0;transform:translateY(22px)}}
@keyframes vibeui-bento-001-down{0%,35%{transform:none}65%,100%{transform:translateY(200%)}}
@keyframes vibeui-bento-001-upward{0%,35%{transform:none}65%,100%{transform:translateY(-200%)}}
@keyframes vibeui-bento-001-blink{0%,35%{opacity:0}55%,100%{opacity:1}}
@keyframes vibeui-bento-001-chev{0%,35%{transform:none}65%,100%{transform:rotate(-90deg)}}
@keyframes vibeui-bento-001-fold{0%,35%{grid-template-rows:1fr}65%,100%{grid-template-rows:0fr}}
@keyframes vibeui-bento-001-type{0%{width:0}55%,100%{width:8ch}}
@keyframes vibeui-bento-001-caret{50%{opacity:0}}
@keyframes vibeui-bento-001-tip{0%,62%{opacity:0;transform:translateY(.35rem)}78%,100%{opacity:1;transform:none}}
@keyframes vibeui-bento-001-theme{0%,38%{background:#ffffff;color:#1a1a1a}62%,100%{background:#0f1117;color:#e6e8ee}}
@keyframes vibeui-bento-001-knob{0%,38%{transform:none}62%,100%{transform:translateX(.8rem)}}
@keyframes vibeui-bento-001-lbl-a{0%,50%{opacity:1}51%,100%{opacity:0}}
@keyframes vibeui-bento-001-lbl-b{0%,50%{opacity:0}51%,100%{opacity:1}}
@container (min-width: 44rem){[data-vibeui-block="bento-001"] [data-part="grid"]{grid-template-columns:repeat(2,1fr)}[data-vibeui-block="bento-001"] [data-part="tile"][data-wide="true"]{grid-column:span 2}}
@container (min-width: 64rem){[data-vibeui-block="bento-001"] [data-part="grid"]{grid-template-columns:repeat(3,1fr)}[data-vibeui-block="bento-001"] [data-part="tile"]{padding:1.9rem}}
[data-vibeui-block="bento-001"] [data-part="w"]:not(:last-child)::after{content:"\\00a0"}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="bento-001"] *{animation:none!important;transition:none!important}[data-vibeui-block="bento-001"] [data-part="w"] > span{transform:none}[data-vibeui-block="bento-001"] [data-reveal]{opacity:1}[data-vibeui-block="bento-001"] [data-demo="size"] i{transform:none}[data-vibeui-block="bento-001"] [data-demo="types"] [data-part="tip"]{opacity:1;transform:none}}`

const DEFAULT_FEATURES: Bento001Feature[] = [
  { title: "Виртуализация из коробки", text: "48 000 строк рендерятся как 12: в DOM только то, что в окне. Включается сама, когда строк больше двухсот.", demo: "rows", wide: true },
  { title: "Сортировка", text: "По любой колонке, с кастомным компаратором и стабильным порядком.", demo: "sort" },
  { title: "Группировка", text: "Один ключ — и строки собираются в раскрывающиеся группы с итогами.", demo: "group" },
  { title: "Типы выводятся из данных", text: "Колонки знают тип ячеек: редактор подскажет, TypeScript проверит.", demo: "types" },
  { title: "4 КБ и ноль зависимостей", text: "Меньше, чем иконка. Дерево-шейкинг: берёте только то, что используете.", demo: "size" },
]

function Demo({ kind }: { kind: NonNullable<Bento001Feature["demo"]> }) {
  const row = (key: number) => (
    <div key={key} data-part="row">
      <i />
      <i />
      <i />
    </div>
  )
  if (kind === "rows")
    return (
      <div data-part="demo" data-demo="rows" aria-hidden="true">
        <div data-part="stack">{Array.from({ length: 12 }, (_, i) => row(i))}</div>
      </div>
    )
  if (kind === "sort")
    return (
      <div data-part="demo" data-demo="sort" aria-hidden="true">
        {[0, 1, 2].map(row)}
      </div>
    )
  if (kind === "group")
    return (
      <div data-part="demo" data-demo="group" aria-hidden="true">
        <div data-part="row" data-head="true">
          pdf · 2
        </div>
        <div data-part="fold">
          <div>{[0, 1].map(row)}</div>
        </div>
        <div data-part="row" data-head="true">
          image · 3
        </div>
      </div>
    )
  if (kind === "types")
    return (
      <div data-part="demo" data-demo="types" aria-hidden="true">
        <div>
          <span data-part="typed">
            row.<b>size</b>
          </span>
          <i data-part="caret" />
        </div>
        <div data-part="tip">
          (property) size: <u>number</u>
        </div>
      </div>
    )
  if (kind === "size")
    return (
      <div data-part="demo" data-demo="size" aria-hidden="true">
        {[
          ["tabl", 0.12, "4.1"],
          ["другие", 0.55, "19"],
          ["ещё одни", 1, "38"],
        ].map(([name, w, kb]) => (
          <div key={String(name)}>
            <span>{name}</span>
            <i style={{ ["--vibeui-bento-001-w" as string]: w }} />
            <span>{kb} кб</span>
          </div>
        ))}
      </div>
    )
  if (kind === "theme")
    return (
      <div data-part="demo" data-demo="theme" aria-hidden="true">
        <div data-part="switch">
          <span>
            <i>theme: light</i>
            <i>theme: dark</i>
          </span>
          <b data-part="knob" />
        </div>
        <div>{[0, 1, 2].map(row)}</div>
      </div>
    )
  return null
}

/** Возможности bento-плитками с живыми CSS-микродемо и spotlight за курсором. */
export function Bento001({
  eyebrow = "// возможности",
  title = "Всё, что нужно таблице. Ничего, что не нужно",
  lede = "Пять вещей, которые вы обычно пишете сами и потом чините. Здесь они написаны один раз.",
  features = DEFAULT_FEATURES,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Bento001Props) {
  const root = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const element = root.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: "-12% 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const spotlight = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return
    for (const tile of event.currentTarget.querySelectorAll<HTMLElement>('[data-part="tile"]')) {
      const rect = tile.getBoundingClientRect()
      tile.style.setProperty("--vibeui-bento-001-x", `${(event.clientX - rect.left).toFixed(0)}px`)
      tile.style.setProperty("--vibeui-bento-001-y", `${(event.clientY - rect.top).toFixed(0)}px`)
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-bento-001-accent": accent } : null),
    ...(ink ? { "--vibeui-bento-001-fg": ink } : null),
    ...(background ? { "--vibeui-bento-001-bg": background } : null),
    ...style,
  } as CSSProperties

  const words = title.split(" ").filter(Boolean)
  const index = (value: number) => ({ ["--vibeui-bento-001-i" as string]: value }) as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-bento-001" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="bento-001" data-tone={tone === "auto" ? undefined : tone} data-shown={shown} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? (
            <p data-part="eyebrow" data-reveal="" style={index(-1)}>
              {eyebrow}
            </p>
          ) : null}
          <h2 data-part="title">
            {words.map((word, wordIndex) => (
              <span key={wordIndex} data-part="w" style={index(wordIndex)}>
                <span>{word}</span>
                {wordIndex < words.length - 1 ? " " : null}
              </span>
            ))}
          </h2>
          {lede ? (
            <p data-part="lede" data-reveal="" style={index(1)}>
              {lede}
            </p>
          ) : null}
          <div data-part="grid" onPointerMove={spotlight}>
            {features.map((feature, featureIndex) => (
              <article key={feature.title} data-part="tile" data-wide={feature.wide ?? false} data-reveal="" style={index(featureIndex + 2)}>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
                {feature.demo && feature.demo !== "none" ? <Demo kind={feature.demo} /> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
