"use client"

import { useState, type CSSProperties } from "react"

export type Event009Swatch = {
  name: string
  /** Цвет #rrggbb. Копируется по клику. */
  hex: string
}

export type Event009Look = {
  /** Кому: «ей», «ему». */
  who: string
  title: string
  text: string
}

export type Event009Props = {
  eyebrow?: string
  title?: string
  lede?: string
  swatches?: readonly Event009Swatch[]
  /** Подсказка под палитрой: «нажмите — скопируется код цвета». */
  hint?: string
  copiedLabel?: string
  looks?: readonly Event009Look[]
  avoidTitle?: string
  avoidItems?: readonly string[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Дресс-код палитрой: пять крупных кругов цвета в ряд, каждый чуть
// перекрывает соседа как мазки на пробнике; клик копирует HEX, круг
// подпрыгивает и показывает «скопировано». Ниже два образа («ей», «ему»)
// и короткий список «чего лучше избежать» — белого, чёрного платья и т.д.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="event-009"]){
--vibeui-event-009-bg:light-dark(#fffaf3,#1d1620);
--vibeui-event-009-fg:light-dark(#2b1a24,#f3ebe4);
--vibeui-event-009-muted:light-dark(#7a6a70,#b3a5aa);
--vibeui-event-009-line:light-dark(#e2d8ca,#372b31);
--vibeui-event-009-card:light-dark(#f6f1e8,#17131a);
--vibeui-event-009-accent:#b8552f;
--vibeui-event-009-plum:light-dark(#4a1f36,#e9c7d6);
--vibeui-event-009-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-event-009-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="event-009"]{color-scheme:dark}
:where([data-vibeui-block="event-009"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="event-009"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="event-009"]{box-sizing:border-box;display:block;background:var(--vibeui-event-009-bg);color:var(--vibeui-event-009-fg);font-family:var(--vibeui-event-009-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="event-009"] *{box-sizing:border-box}
[data-vibeui-block="event-009"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="event-009"] [data-part="eyebrow"]{margin:0 0 .6rem;font-size:.72rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--vibeui-event-009-accent)}
[data-vibeui-block="event-009"] [data-part="title"]{margin:0;font-family:var(--vibeui-event-009-display);font-size:clamp(2rem,5cqi,3.6rem);font-weight:500;font-style:italic;line-height:1.05;color:var(--vibeui-event-009-plum);text-wrap:balance}
[data-vibeui-block="event-009"] [data-part="lede"]{max-width:36rem;margin:.8rem 0 0;color:var(--vibeui-event-009-muted)}
[data-vibeui-block="event-009"] [data-part="palette"]{display:flex;flex-wrap:wrap;gap:.75rem 0;margin:2.5rem 0 0;padding:0 .75rem 0 0;list-style:none}
[data-vibeui-block="event-009"] [data-part="swatch"]{position:relative;display:grid;gap:.5rem;justify-items:center;margin-right:-.75rem;padding:0;border:0;background:transparent;color:inherit;font:inherit;cursor:pointer}
[data-vibeui-block="event-009"] [data-part="chip"]{display:block;width:clamp(4.5rem,14cqi,7.5rem);aspect-ratio:1;border-radius:50%;background:var(--vibeui-event-009-chip);box-shadow:0 0 0 .3rem var(--vibeui-event-009-bg),0 18px 30px -18px rgb(43 26 36 / .6);transition:transform .35s cubic-bezier(.2,.9,.3,1.4)}
[data-vibeui-block="event-009"] [data-part="swatch"]:hover [data-part="chip"],[data-vibeui-block="event-009"] [data-part="swatch"]:focus-visible [data-part="chip"]{transform:translateY(-.5rem) scale(1.05)}
[data-vibeui-block="event-009"] [data-part="swatch"][data-copied="true"] [data-part="chip"]{animation:vibeui-event-009-pop .5s cubic-bezier(.2,.9,.3,1.4)}
@keyframes vibeui-event-009-pop{40%{transform:translateY(-.9rem) scale(1.1)}}
[data-vibeui-block="event-009"] [data-part="swatch"]:focus-visible{outline:none}
[data-vibeui-block="event-009"] [data-part="swatch"] small{display:grid;justify-items:center;gap:.1rem;font-size:.72rem;letter-spacing:.06em;color:var(--vibeui-event-009-muted)}
[data-vibeui-block="event-009"] [data-part="swatch"] small b{font-weight:600;color:var(--vibeui-event-009-fg)}
[data-vibeui-block="event-009"] [data-part="swatch"] small code{font-family:inherit;font-variant-numeric:tabular-nums;text-transform:uppercase}
[data-vibeui-block="event-009"] [data-part="swatch"][data-copied="true"] small code{color:var(--vibeui-event-009-accent)}
[data-vibeui-block="event-009"] [data-part="hint"]{margin:1rem 0 0;font-size:.8rem;color:var(--vibeui-event-009-muted)}
[data-vibeui-block="event-009"] [data-part="grid"]{display:grid;gap:1rem;margin-top:2.5rem}
[data-vibeui-block="event-009"] [data-part="look"]{padding:1.5rem;border:1px solid var(--vibeui-event-009-line);border-radius:1.2rem;background:var(--vibeui-event-009-card)}
[data-vibeui-block="event-009"] [data-part="look"] span{display:block;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-event-009-accent)}
[data-vibeui-block="event-009"] [data-part="look"] h3{margin:.4rem 0 .5rem;font-family:var(--vibeui-event-009-display);font-size:1.5rem;font-weight:500;line-height:1.15;color:var(--vibeui-event-009-plum)}
[data-vibeui-block="event-009"] [data-part="look"] p{margin:0;font-size:.95rem;color:var(--vibeui-event-009-muted)}
[data-vibeui-block="event-009"] [data-part="avoid"]{padding:1.5rem;border-radius:1.2rem;background:color-mix(in oklab,var(--vibeui-event-009-accent) 8%,transparent)}
[data-vibeui-block="event-009"] [data-part="avoid"] h3{margin:0 0 .6rem;font-family:var(--vibeui-event-009-display);font-size:1.4rem;font-weight:500;font-style:italic;color:var(--vibeui-event-009-plum)}
[data-vibeui-block="event-009"] [data-part="avoid"] ul{margin:0;padding:0;list-style:none;display:grid;gap:.4rem;font-size:.95rem}
[data-vibeui-block="event-009"] [data-part="avoid"] li{display:flex;gap:.6rem}
[data-vibeui-block="event-009"] [data-part="avoid"] li::before{content:"—";color:var(--vibeui-event-009-accent)}
@container (min-width:56rem){
[data-vibeui-block="event-009"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="event-009"] [data-part="grid"]{grid-template-columns:1fr 1fr 1fr}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="event-009"] *{animation:none!important;transition:none!important}}`

/** Дресс-код палитрой: круги цветов с копированием HEX, образы «ей» и «ему», чего избегать. */
export function Event009({
  eyebrow = "Дресс-код",
  title = "Тёплые нейтральные — и что-нибудь своё",
  lede = "Мы не просим форму. Хочется, чтобы на фото все смотрелись как одна компания в одном свете — вот палитра, от которой можно отталкиваться.",
  swatches = [
    { name: "Крем", hex: "#f1e8d8" },
    { name: "Песок", hex: "#d9c5a5" },
    { name: "Шалфей", hex: "#8a9a7b" },
    { name: "Терракота", hex: "#b8552f" },
    { name: "Слива", hex: "#4a1f36" },
  ],
  hint = "Нажмите на цвет — код скопируется, покажете в магазине.",
  copiedLabel = "скопировано",
  looks = [
    { who: "Ей", title: "Платье до середины икры, лён или шёлк", text: "Любая длина и любой цвет из палитры. Каблук утонет в лужайке — лучше плоская подошва или блок." },
    { who: "Ему", title: "Рубашка, брюки, можно без пиджака", text: "Льняная рубашка в песке или шалфее, брюки темнее. Галстук не нужен, кеды — можно." },
  ],
  avoidTitle = "Чего лучше избежать",
  avoidItems = ["Белого и айвори — это оставим Василисе", "Крупных принтов и неона: спорят со светом", "Шпилек — гравий и трава"],
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Event009Props) {
  const [copied, setCopied] = useState<string | null>(null)
  const palette = {
    ...(accent ? { "--vibeui-event-009-accent": accent } : null),
    ...(background ? { "--vibeui-event-009-bg": background } : null),
    ...style,
  } as CSSProperties

  async function copy(hex: string) {
    try {
      await navigator.clipboard.writeText(hex)
      setCopied(hex)
      window.setTimeout(() => setCopied((value) => (value === hex ? null : value)), 1600)
    } catch {
      setCopied(null)
    }
  }

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-event-009" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="event-009" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <ul data-part="palette">
            {swatches.map((swatch) => (
              <li key={swatch.hex}>
                <button type="button" data-part="swatch" data-copied={copied === swatch.hex ? "true" : undefined} onClick={() => copy(swatch.hex)} aria-label={`${swatch.name} ${swatch.hex}`} style={{ "--vibeui-event-009-chip": swatch.hex } as CSSProperties}>
                  <span data-part="chip" aria-hidden="true" />
                  <small aria-hidden="true">
                    <b>{swatch.name}</b>
                    <code>{copied === swatch.hex ? copiedLabel : swatch.hex}</code>
                  </small>
                </button>
              </li>
            ))}
          </ul>
          {hint ? <p data-part="hint">{hint}</p> : null}
          <div data-part="grid">
            {looks.map((look) => (
              <article key={look.who} data-part="look">
                <span>{look.who}</span>
                <h3>{look.title}</h3>
                <p>{look.text}</p>
              </article>
            ))}
            {avoidItems.length > 0 ? (
              <aside data-part="avoid">
                <h3>{avoidTitle}</h3>
                <ul>
                  {avoidItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </aside>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
