"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"
import { Card075 } from "@/registry/components/card/card-075/card-075"

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
  /** Подписи чужих библиотек и единица в демо размера. */
  sizeOthers?: readonly [string, string]
  kbUnit?: string
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
[data-vibeui-block="bento-001"] [data-part="grid"]:hover [data-vibeui-block="card-075"]::before{opacity:1}
[data-vibeui-block="bento-001"][data-shown="true"] [data-demo="size"] i{transform:none}
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
@container (min-width: 44rem){[data-vibeui-block="bento-001"] [data-part="grid"]{grid-template-columns:repeat(2,1fr)}}
@container (min-width: 64rem){[data-vibeui-block="bento-001"] [data-part="grid"]{grid-template-columns:repeat(3,1fr)}}
[data-vibeui-block="bento-001"] [data-part="w"]:not(:last-child)::after{content:"\\00a0"}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="bento-001"] *{animation:none!important;transition:none!important}[data-vibeui-block="bento-001"] [data-part="w"] > span{transform:none}[data-vibeui-block="bento-001"] [data-reveal]{opacity:1}}`

const DEFAULT_FEATURES: Bento001Feature[] = [
  { title: "Виртуализация из коробки", text: "48 000 строк рендерятся как 12: в DOM только то, что в окне. Включается сама, когда строк больше двухсот.", demo: "rows", wide: true },
  { title: "Сортировка", text: "По любой колонке, с кастомным компаратором и стабильным порядком.", demo: "sort" },
  { title: "Группировка", text: "Один ключ — и строки собираются в раскрывающиеся группы с итогами.", demo: "group" },
  { title: "Типы выводятся из данных", text: "Колонки знают тип ячеек: редактор подскажет, TypeScript проверит.", demo: "types" },
  { title: "4 КБ и ноль зависимостей", text: "Меньше, чем иконка. Дерево-шейкинг: берёте только то, что используете.", demo: "size" },
]


/** Возможности bento-плитками с живыми CSS-микродемо и spotlight за курсором. */
export function Bento001({
  eyebrow = "// возможности",
  title = "Всё, что нужно таблице. Ничего, что не нужно",
  lede = "Пять вещей, которые вы обычно пишете сами и потом чините. Здесь они написаны один раз.",
  features = DEFAULT_FEATURES,
  sizeOthers = ["другие", "ещё одни"],
  kbUnit = "кб",
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
      tile.style.setProperty("--vibeui-card-075-x", `${(event.clientX - rect.left).toFixed(0)}px`)
      tile.style.setProperty("--vibeui-card-075-y", `${(event.clientY - rect.top).toFixed(0)}px`)
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
              <Card075 key={feature.title} data-part="tile" title={feature.title} wide={feature.wide} text={feature.text} demo={feature.demo} sizeOthers={sizeOthers} kbUnit={kbUnit} featureIndex={featureIndex} style={index(featureIndex + 2)} accent={accent} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
