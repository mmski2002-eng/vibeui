"use client"

import { useState, type CSSProperties } from "react"
import { Card124 } from "@/registry/components/card/card-124/card-124"

export type Event012Swatch = { name: string; hex: string }

export type Event012Look = {
  who: string
  title: string
  text: string
  image?: string
  imageAlt?: string
}

export type Event012Props = {
  eyebrow?: string
  title?: string
  lede?: string
  swatches?: readonly Event012Swatch[]
  copiedLabel?: string
  looks?: readonly Event012Look[]
  /** Три правила пляжа: коротко, с иконками sun | sand | wind. */
  rules?: readonly { icon?: string; text: string }[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Дресс-код «beach formal»: полоса выгоревших цветов как образцы ткани
// (клик копирует HEX), два образа с фото на скотче — «ей» и «ему» — и три
// правила пляжа с иконками: солнце, песок, ветер. Никаких каблуков.
const FONTS = "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Lobster&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="event-012"]){
--vibeui-event-012-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-event-012-sand:light-dark(#f4f4f4,#242424);
--vibeui-event-012-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-event-012-muted:light-dark(#5b6f78,#a3a3a3);
--vibeui-event-012-line:light-dark(#e3d7bf,#2e2e2e);
--vibeui-event-012-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-event-012-sea:#2aa7a0;
--vibeui-event-012-sun:#f2c14e;
--vibeui-event-012-display:"Oswald","Arial Narrow",Impact,sans-serif;
--vibeui-event-012-script:"Lobster","Brush Script MT",cursive;
--vibeui-event-012-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="event-012"]{color-scheme:dark}
:where([data-vibeui-block="event-012"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="event-012"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="event-012"]{box-sizing:border-box;display:block;background:var(--vibeui-event-012-bg);color:var(--vibeui-event-012-fg);font-family:var(--vibeui-event-012-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="event-012"] *{box-sizing:border-box}
[data-vibeui-block="event-012"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="event-012"] [data-part="eyebrow"]{margin:0 0 .6rem;font-family:var(--vibeui-event-012-display);font-size:.8rem;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--vibeui-event-012-accent)}
[data-vibeui-block="event-012"] [data-part="title"]{margin:0;font-family:var(--vibeui-event-012-display);font-size:clamp(2.2rem,6cqi,4.2rem);font-weight:700;line-height:.98;text-transform:uppercase}
[data-vibeui-block="event-012"] [data-part="title"] em{font-family:var(--vibeui-event-012-script);font-style:normal;font-weight:400;text-transform:none;color:var(--vibeui-event-012-sea);font-size:.75em}
[data-vibeui-block="event-012"] [data-part="lede"]{max-width:36rem;margin:.8rem 0 0;color:var(--vibeui-event-012-muted)}
[data-vibeui-block="event-012"] [data-part="swatches"]{display:flex;flex-wrap:wrap;margin:2rem 0 0;padding:0;list-style:none;border-radius:.8rem;overflow:hidden;box-shadow:0 20px 40px -30px rgb(18 58 75 / .5)}
[data-vibeui-block="event-012"] [data-part="swatches"] li{display:contents}
[data-vibeui-block="event-012"] [data-part="swatch"]{flex:1 1 6.5rem;display:grid;align-content:end;gap:.15rem;min-height:7rem;padding:.8rem;border:0;background:var(--vibeui-event-012-chip);color:inherit;font:inherit;text-align:left;cursor:pointer;transition:flex .35s cubic-bezier(.2,.9,.3,1)}
[data-vibeui-block="event-012"] [data-part="swatch"]:hover,[data-vibeui-block="event-012"] [data-part="swatch"][data-copied="true"]{flex-grow:1.6}
[data-vibeui-block="event-012"] [data-part="swatch"]:focus-visible{outline:3px solid var(--vibeui-event-012-fg);outline-offset:-3px}
[data-vibeui-block="event-012"] [data-part="swatch"] b{font-family:var(--vibeui-event-012-display);font-size:.9rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--vibeui-event-012-ink)}
[data-vibeui-block="event-012"] [data-part="swatch"] code{font-family:var(--vibeui-event-012-font);font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-event-012-ink);opacity:.7}
[data-vibeui-block="event-012"] [data-part="swatch"][data-copied="true"] code{opacity:1}
[data-vibeui-block="event-012"] [data-part="grid"]{display:grid;gap:2rem;margin-top:2.5rem}
[data-vibeui-block="event-012"] [data-part="looks"]{display:grid;gap:1.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="event-012"] [data-part="rules"]{display:grid;gap:.6rem;margin:0;padding:1.4rem;list-style:none;border-radius:1rem;background:var(--vibeui-event-012-sand);align-self:start}
[data-vibeui-block="event-012"] [data-part="rules"] li{display:flex;align-items:center;gap:.8rem;font-size:.95rem}
[data-vibeui-block="event-012"] [data-part="rules"] svg{flex:none;width:2.2rem;height:2.2rem;padding:.45rem;border-radius:50%;background:var(--vibeui-event-012-bg);color:var(--vibeui-event-012-sea);fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
@container (min-width:56rem){
[data-vibeui-block="event-012"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="event-012"] [data-part="swatch"]{min-height:8.5rem;padding:1rem 1.1rem}
[data-vibeui-block="event-012"] [data-part="grid"]{grid-template-columns:minmax(0,1.5fr) minmax(16rem,.7fr);gap:3rem}
[data-vibeui-block="event-012"] [data-part="looks"]{grid-template-columns:1fr 1fr}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="event-012"] *{animation:none!important;transition:none!important}}`

const ICONS: Record<string, string> = {
  sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  sand: "M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0M12 4l3 6h-6zM9 8l-2 4M15 8l2 4",
  wind: "M3 8h10a2.5 2.5 0 1 0-2.5-2.5M3 13h14a3 3 0 1 1-3 3M3 18h7a2 2 0 1 1-2 2",
}

function inkFor(hex: string): string {
  const value = hex.replace("#", "")
  if (value.length !== 6) return "#123a4b"
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#123a4b" : "#fffaf0"
}

/** Дресс-код «beach formal»: полоса образцов ткани с копированием HEX, образы «ей» и «ему» на скотче и три правила пляжа. */
export function Event012({
  eyebrow = "Дресс-код",
  title = "Beach formal — то есть «красиво, но босиком»",
  lede = "Песок, солнце и ветер решают за нас: лён, светлое, ничего сложного. Цвета — с этого пляжа.",
  swatches = [
    { name: "Песок", hex: "#f3e9d2" },
    { name: "Мята", hex: "#bfe3d6" },
    { name: "Море", hex: "#2aa7a0" },
    { name: "Коралл", hex: "#ff6b57" },
    { name: "Солнце", hex: "#f2c14e" },
    { name: "Чернила", hex: "#123a4b" },
  ],
  copiedLabel = "скопировано",
  looks = [
    { who: "Ей", title: "Лён, миди, плоская подошва", text: "Платье или комбинезон в песке, мяте или коралле. Каблуки утонут — сандалии или босиком." },
    { who: "Ему", title: "Рубашка навыпуск, светлые брюки", text: "Лён или хлопок, рукав закатать. Пиджак не нужен, шляпа — очень." },
  ],
  rules = [
    { icon: "sun", text: "Церемония в 16:30 — солнце ещё высоко. Шляпа, очки, крем." },
    { icon: "sand", text: "Песок мелкий и горячий: обувь снимаем у входа на пляж." },
    { icon: "wind", text: "К вечеру ветер с моря — лёгкая рубашка или палантин пригодятся." },
  ],
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Event012Props) {
  const [copied, setCopied] = useState<string | null>(null)
  const palette = {
    ...(accent ? { "--vibeui-event-012-accent": accent } : null),
    ...(ink ? { "--vibeui-event-012-fg": ink } : null),
    ...(background ? { "--vibeui-event-012-bg": background } : null),
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
      <style href="vibeui-event-012" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="event-012" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">
            {head}
            {tail ? <em> — {tail}</em> : null}
          </h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <ul data-part="swatches">
            {swatches.map((swatch) => (
              <li key={swatch.hex}>
                <button type="button" data-part="swatch" data-copied={copied === swatch.hex ? "true" : undefined} onClick={() => copy(swatch.hex)} aria-label={`${swatch.name} ${swatch.hex}`} style={{ "--vibeui-event-012-chip": swatch.hex, "--vibeui-event-012-ink": inkFor(swatch.hex) } as CSSProperties}>
                  <b>{swatch.name}</b>
                  <code>{copied === swatch.hex ? copiedLabel : swatch.hex}</code>
                </button>
              </li>
            ))}
          </ul>
          <div data-part="grid">
            <ul data-part="looks">
              {looks.map((look) => (
                <Card124 key={look.who} data-part="look" who={look.who} image={look.image} imageAlt={look.imageAlt} title={look.title} text={look.text} accent={accent} />
              ))}
            </ul>
            {rules.length > 0 ? (
              <ul data-part="rules">
                {rules.map((rule) => (
                  <li key={rule.text}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d={ICONS[rule.icon ?? ""] ?? ICONS.sun} />
                    </svg>
                    {rule.text}
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
