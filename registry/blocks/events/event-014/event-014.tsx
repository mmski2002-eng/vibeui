"use client"

import { useState, type CSSProperties } from "react"

export type Event014Swatch = { name: string; hex: string }

export type Event014Look = {
  who: string
  title: string
  text: string
  image?: string
  imageAlt?: string
}

export type Event014Props = {
  eyebrow?: string
  /** После « — » уходит в курсив. */
  title?: string
  lede?: string
  swatches?: readonly Event014Swatch[]
  copiedLabel?: string
  looks?: readonly Event014Look[]
  /** Правила вечера с иконками snow | flame | boot. */
  rules?: readonly { icon?: string; text: string }[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Дресс-код «бархат и шерсть»: образцы ткани висят лентами на серебряной
// планке — наведение опускает ленту ниже, клик копирует HEX; два образа с
// фото в морозных рамах — «ей» и «ему»; правила вечера с иконками: снег,
// свеча, сменная обувь.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Marck+Script&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="event-014"]){
--vibeui-event-014-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-event-014-card:light-dark(#ffffff,#242424);
--vibeui-event-014-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-event-014-muted:light-dark(#6b6b6b,#a3a3a3);
--vibeui-event-014-line:light-dark(color-mix(in oklab,var(--vibeui-event-014-fg) 16%,transparent),color-mix(in oklab,var(--vibeui-event-014-fg) 24%,transparent));
--vibeui-event-014-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-event-014-silver:#9fb0c8;
--vibeui-event-014-display:"Cormorant Garamond",Georgia,serif;
--vibeui-event-014-script:"Marck Script","Segoe Script",cursive;
--vibeui-event-014-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="event-014"]{color-scheme:dark}
:where([data-vibeui-block="event-014"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="event-014"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="event-014"]{box-sizing:border-box;display:block;background:var(--vibeui-event-014-bg);color:var(--vibeui-event-014-fg);font-family:var(--vibeui-event-014-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="event-014"] *{box-sizing:border-box}
[data-vibeui-block="event-014"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4.5rem 1.25rem}
[data-vibeui-block="event-014"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-event-014-display);font-size:.85rem;font-weight:500;letter-spacing:.32em;text-transform:uppercase;color:var(--vibeui-event-014-silver)}
[data-vibeui-block="event-014"] [data-part="title"]{margin:0;font-family:var(--vibeui-event-014-display);font-size:clamp(2.2rem,5.5cqi,3.8rem);font-weight:500;line-height:1.05}
[data-vibeui-block="event-014"] [data-part="title"] em{font-style:italic;font-weight:400;color:var(--vibeui-event-014-accent)}
[data-vibeui-block="event-014"] [data-part="lede"]{max-width:36rem;margin:1rem 0 0;color:var(--vibeui-event-014-muted)}
[data-vibeui-block="event-014"] [data-part="rail"]{position:relative;margin:2.5rem 0 0;padding-top:.5rem}
[data-vibeui-block="event-014"] [data-part="rail"]::before{content:"";position:absolute;left:0;right:0;top:0;height:.35rem;border-radius:.2rem;background:linear-gradient(90deg,#6f7f96,#c9d3e0 30%,#8d9db4 60%,#c9d3e0 85%,#6f7f96);box-shadow:0 2px 6px rgb(0 0 0 / .3)}
[data-vibeui-block="event-014"] [data-part="swatches"]{display:flex;flex-wrap:wrap;gap:.6rem;margin:0;padding:0 .4rem;list-style:none}
[data-vibeui-block="event-014"] [data-part="swatches"] li{display:contents}
[data-vibeui-block="event-014"] [data-part="swatch"]{flex:1 1 6rem;display:grid;align-content:end;gap:.15rem;min-height:8rem;padding:.8rem .7rem;border:0;border-radius:0 0 .5rem .5rem;background:linear-gradient(180deg,rgb(255 255 255 / .1),transparent 30%,rgb(0 0 0 / .18)),var(--vibeui-event-014-chip);color:inherit;font:inherit;text-align:left;cursor:pointer;box-shadow:0 14px 26px -18px rgb(0 0 0 / .8);transform-origin:top center;transition:transform .4s cubic-bezier(.2,.9,.3,1),min-height .4s cubic-bezier(.2,.9,.3,1)}
[data-vibeui-block="event-014"] [data-part="swatch"]::before{content:"";position:absolute;left:50%;top:-.2rem;width:.5rem;height:.5rem;margin-left:-.25rem;border-radius:50%;background:#dfe6ef;box-shadow:inset 0 0 0 1.5px #6f7f96}
[data-vibeui-block="event-014"] [data-part="swatch"]{position:relative}
[data-vibeui-block="event-014"] [data-part="swatch"]:hover,[data-vibeui-block="event-014"] [data-part="swatch"][data-copied="true"]{min-height:9.4rem}
[data-vibeui-block="event-014"] [data-part="swatch"]:focus-visible{outline:2px solid var(--vibeui-event-014-accent);outline-offset:2px}
[data-vibeui-block="event-014"] [data-part="swatch"] b{font-family:var(--vibeui-event-014-display);font-size:1.05rem;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--vibeui-event-014-ink)}
[data-vibeui-block="event-014"] [data-part="swatch"] code{font-family:var(--vibeui-event-014-font);font-size:.66rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-event-014-ink);opacity:.7}
[data-vibeui-block="event-014"] [data-part="swatch"][data-copied="true"] code{opacity:1}
[data-vibeui-block="event-014"] [data-part="grid"]{display:grid;gap:2rem;margin-top:3rem}
[data-vibeui-block="event-014"] [data-part="looks"]{display:grid;gap:1.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="event-014"] [data-part="look"]{display:grid;grid-template-columns:7rem minmax(0,1fr);gap:1.1rem;align-items:center}
[data-vibeui-block="event-014"] [data-part="look"] figure{position:relative;margin:0;padding:.35rem;border:1px solid var(--vibeui-event-014-line);border-radius:.4rem;background:var(--vibeui-event-014-card);box-shadow:0 20px 40px -28px rgb(0 0 0 / .8),inset 0 0 0 1px rgb(242 238 230 / .05)}
[data-vibeui-block="event-014"] [data-part="look"] span{position:relative;display:block;aspect-ratio:4/5;overflow:hidden;border-radius:.2rem;background:var(--vibeui-event-014-bg)}
[data-vibeui-block="event-014"] [data-part="look"] span::after{content:"";position:absolute;inset:0;background:radial-gradient(40% 30% at 0 100%,rgb(242 238 230 / .4),transparent 70%),radial-gradient(35% 25% at 100% 0,rgb(242 238 230 / .3),transparent 70%);mix-blend-mode:screen;pointer-events:none}
[data-vibeui-block="event-014"] [data-part="look"] img{display:block;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="event-014"] [data-part="look"] small{display:block;font-family:var(--vibeui-event-014-script);font-size:1.2rem;color:var(--vibeui-event-014-accent)}
[data-vibeui-block="event-014"] [data-part="look"] h3{margin:.1rem 0 .3rem;font-family:var(--vibeui-event-014-display);font-size:1.5rem;font-weight:500;line-height:1.1}
[data-vibeui-block="event-014"] [data-part="look"] p{margin:0;font-size:.92rem;color:var(--vibeui-event-014-muted)}
[data-vibeui-block="event-014"] [data-part="rules"]{display:grid;gap:.7rem;margin:0;padding:1.4rem;list-style:none;border:1px solid var(--vibeui-event-014-line);border-radius:1rem;background:var(--vibeui-event-014-card);align-self:start}
[data-vibeui-block="event-014"] [data-part="rules"] li{display:flex;align-items:center;gap:.8rem;font-size:.95rem}
[data-vibeui-block="event-014"] [data-part="rules"] svg{flex:none;width:2.3rem;height:2.3rem;padding:.5rem;border-radius:50%;border:1px solid var(--vibeui-event-014-line);color:var(--vibeui-event-014-accent);fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;box-shadow:0 0 14px -4px var(--vibeui-event-014-accent)}
@container (min-width:56rem){
[data-vibeui-block="event-014"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="event-014"] [data-part="swatch"]{min-height:9.5rem;padding:1rem}
[data-vibeui-block="event-014"] [data-part="swatch"]:hover,[data-vibeui-block="event-014"] [data-part="swatch"][data-copied="true"]{min-height:11rem}
[data-vibeui-block="event-014"] [data-part="grid"]{grid-template-columns:minmax(0,1.5fr) minmax(16rem,.7fr);gap:3rem}
[data-vibeui-block="event-014"] [data-part="looks"]{grid-template-columns:1fr 1fr}
[data-vibeui-block="event-014"] [data-part="look"]{grid-template-columns:8rem minmax(0,1fr)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="event-014"] *{animation:none!important;transition:none!important}}`

const ICONS: Record<string, string> = {
  snow: "M12 2v20M2 12h20M5 5l14 14M19 5L5 19M12 2l-2 2M12 2l2 2M12 22l-2-2M12 22l2-2M2 12l2-2M2 12l2 2M22 12l-2-2M22 12l-2 2",
  flame: "M12 3c1 3 4 4.5 4 8.5a4 4 0 0 1-8 0c0-1.5.5-2.5 1.2-3.5.4 1 1 1.6 1.8 2 .3-2.5 0-4.5 1-7zM9 19h6M10 22h4",
  boot: "M6 3h6v8l6 3v3H6zM6 17h12v3H6zM9 6h3",
}

function inkFor(hex: string): string {
  const value = hex.replace("#", "")
  if (value.length !== 6) return "#f2eee6"
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#1c2740" : "#f2eee6"
}

/** Дресс-код «бархат и шерсть»: ленты образцов ткани на серебряной планке с копированием HEX, образы «ей» и «ему» в морозных рамах, правила вечера. */
export function Event014({
  eyebrow = "Дресс-код",
  title = "Бархат и шерсть — тепло и нарядно",
  lede = "Вечер при свечах в загородном доме: глубокие цвета, плотные ткани, ничего блестящего. Ткани — с этой планки.",
  swatches = [
    { name: "Ночь", hex: "#0b1220" },
    { name: "Индиго", hex: "#1c2740" },
    { name: "Бордо", hex: "#7a2b35" },
    { name: "Хвоя", hex: "#2f5d50" },
    { name: "Серебро", hex: "#9fb0c8" },
    { name: "Свеча", hex: "#f2b64f" },
  ],
  copiedLabel = "скопировано",
  looks = [
    { who: "Ей", title: "Длинное и тёплое", text: "Бархат, шерсть, плотный шёлк — в ночи, бордо или хвое. Шаль дадим на террасе. Каблук можно: в доме паркет." },
    { who: "Ему", title: "Тёмный костюм, водолазка или рубашка", text: "Синий, графит, бутылочный. Шарф приветствуется, галстук — по желанию." },
  ],
  rules = [
    { icon: "snow", text: "На террасе и в лесу снег: сменная обувь или тёплые ботинки — оставим у выхода." },
    { icon: "flame", text: "Церемония при свечах: ничего пышного из синтетики, пожалуйста." },
    { icon: "boot", text: "Фейерверк в 23:00 на поляне — куртки и шапки не оставляйте в машине." },
  ],
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Event014Props) {
  const [copied, setCopied] = useState<string | null>(null)
  const palette = {
    ...(accent ? { "--vibeui-event-014-accent": accent } : null),
    ...(ink ? { "--vibeui-event-014-fg": ink } : null),
    ...(background ? { "--vibeui-event-014-bg": background } : null),
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

  const [head, tail] = title.split(" — ")

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-event-014" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="event-014" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">
            {head}
            {tail ? <em> — {tail}</em> : null}
          </h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="rail">
            <ul data-part="swatches">
              {swatches.map((swatch) => (
                <li key={swatch.hex}>
                  <button type="button" data-part="swatch" data-copied={copied === swatch.hex ? "true" : undefined} onClick={() => copy(swatch.hex)} aria-label={`${swatch.name} ${swatch.hex}`} style={{ "--vibeui-event-014-chip": swatch.hex, "--vibeui-event-014-ink": inkFor(swatch.hex) } as CSSProperties}>
                    <b>{swatch.name}</b>
                    <code>{copied === swatch.hex ? copiedLabel : swatch.hex}</code>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div data-part="grid">
            <ul data-part="looks">
              {looks.map((look) => (
                <li key={look.who} data-part="look">
                  <figure>
                    <span>{look.image ? <img src={look.image} alt={look.imageAlt ?? ""} loading="lazy" /> : null}</span>
                  </figure>
                  <div>
                    <small>{look.who}</small>
                    <h3>{look.title}</h3>
                    <p>{look.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            {rules.length > 0 ? (
              <ul data-part="rules">
                {rules.map((rule) => (
                  <li key={rule.text}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d={ICONS[rule.icon ?? ""] ?? ICONS.snow} />
                    </svg>
                    <span>{rule.text}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
