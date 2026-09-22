import type { CSSProperties } from "react"
import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Cta020Channel = {
  /** telegram | whatsapp | phone | max — иконка; иначе первая буква. */
  kind: string
  label: string
  href: string
}

export type Cta020Props = {
  /** Слово на неоновой табличке. */
  sign?: string
  title?: string
  text?: string
  phone?: string
  phoneHref?: string
  channels?: readonly Cta020Channel[]
  /** Часы работы. */
  hours?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Призыв: неоновая табличка «OPEN» с трубкой-рамкой и мерцанием, рядом
// заголовок, телефон крупно и мессенджеры капсулами со свечением. Фон —
// два плывущих пятна фуксии и фиолета. Серверный, без состояния.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"

const STYLES = `
:where([data-vibeui-block="cta-020"]){
--vibeui-cta-020-bg:#07060b;
--vibeui-cta-020-fg:#f3eefc;
--vibeui-cta-020-muted:#a39bb5;
--vibeui-cta-020-line:rgb(255 255 255 / .12);
--vibeui-cta-020-accent:#ff2bd6;
--vibeui-cta-020-accent-2:#8b5cff;
--vibeui-cta-020-cyan:#22f3ff;
--vibeui-cta-020-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-cta-020-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-cta-020-mono:"JetBrains Mono",ui-monospace,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-020"]{color-scheme:dark}
:where([data-vibeui-block="cta-020"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="cta-020"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="cta-020"]{box-sizing:border-box;position:relative;display:block;overflow:hidden;isolation:isolate;background:var(--vibeui-cta-020-bg);color:var(--vibeui-cta-020-fg);font-family:var(--vibeui-cta-020-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="cta-020"] *{box-sizing:border-box}
[data-vibeui-block="cta-020"] [data-part="phone"]{margin:1.5rem 0 0}
[data-vibeui-block="cta-020"] [data-part="hours"]{margin:.5rem 0 0}
[data-vibeui-block="cta-020"]::before,[data-vibeui-block="cta-020"]::after{content:"";position:absolute;z-index:-1;width:40rem;height:40rem;border-radius:50%;filter:blur(90px);opacity:.35;pointer-events:none}
[data-vibeui-block="cta-020"]::before{left:-15rem;top:-15rem;background:var(--vibeui-cta-020-accent);animation:vibeui-cta-020-drift 14s ease-in-out infinite alternate}
[data-vibeui-block="cta-020"]::after{right:-15rem;bottom:-20rem;background:var(--vibeui-cta-020-accent-2);animation:vibeui-cta-020-drift 18s ease-in-out infinite alternate-reverse}
@keyframes vibeui-cta-020-drift{from{transform:translate(0,0)}to{transform:translate(8rem,4rem)}}
/* Поверхность тёмная в обеих темах: части внутри переключаются в тёмную схему. */
[data-vibeui-block="cta-020"] [data-part="shell"]{color-scheme:dark}
[data-vibeui-block="cta-020"] [data-part="shell"]{display:grid;gap:2.5rem;max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="cta-020"] [data-part="sign"]{justify-self:start;padding:1rem 2rem;border:3px solid var(--vibeui-cta-020-accent);border-radius:1rem;font-family:var(--vibeui-cta-020-display);font-size:clamp(2.6rem,8cqi,5.5rem);font-weight:700;letter-spacing:.14em;text-transform:uppercase;line-height:1;color:var(--vibeui-cta-020-accent);text-shadow:0 0 8px var(--vibeui-cta-020-accent),0 0 24px var(--vibeui-cta-020-accent),0 0 60px color-mix(in oklab,var(--vibeui-cta-020-accent) 60%,transparent);box-shadow:0 0 12px var(--vibeui-cta-020-accent),inset 0 0 12px var(--vibeui-cta-020-accent),0 0 60px color-mix(in oklab,var(--vibeui-cta-020-accent) 45%,transparent);animation:vibeui-cta-020-flicker 6s infinite}
@keyframes vibeui-cta-020-flicker{0%,91%,100%{opacity:1}92%{opacity:.45}93%{opacity:1}95%{opacity:.7}96%{opacity:1}}
[data-vibeui-block="cta-020"] [data-part="title"]{margin:0;font-family:var(--vibeui-cta-020-display);font-size:clamp(1.8rem,3.8cqi,2.8rem);font-weight:700;line-height:1.05;letter-spacing:-.02em;text-transform:uppercase}
[data-vibeui-block="cta-020"] [data-part="text"]{margin:.75rem 0 0;max-width:32rem;color:var(--vibeui-cta-020-muted)}
[data-vibeui-block="cta-020"] [data-part="hours"]{margin:.5rem 0 0;font-family:var(--vibeui-cta-020-mono);font-size:.8rem;letter-spacing:.08em;color:var(--vibeui-cta-020-muted)}
[data-vibeui-block="cta-020"] [data-part="channels"]{display:flex;flex-wrap:wrap;gap:.6rem;margin:1.5rem 0 0;padding:0;list-style:none}
[data-vibeui-block="cta-020"] [data-part="channel"]{display:inline-flex;align-items:center;gap:.55rem;height:3rem;padding:0 1.2rem 0 .9rem;border-radius:.6rem;border:1px solid color-mix(in oklab,var(--vibeui-cta-020-accent) 55%,transparent);color:inherit;font-weight:700;text-decoration:none;transition:transform .2s,box-shadow .3s,background .3s}
[data-vibeui-block="cta-020"] [data-part="channel"]:hover{transform:translateY(-2px);background:color-mix(in oklab,var(--vibeui-cta-020-accent) 14%,transparent);box-shadow:0 0 20px color-mix(in oklab,var(--vibeui-cta-020-accent) 50%,transparent)}
[data-vibeui-block="cta-020"] [data-part="channel"] svg{width:1.15rem;height:1.15rem;fill:currentColor}
@container (min-width: 60rem){
[data-vibeui-block="cta-020"] [data-part="shell"]{grid-template-columns:auto minmax(0,1fr);gap:4rem;padding:5.5rem 2rem;align-items:center}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-020"] *{animation:none!important;transition:none!important}}`

const ICONS: Record<string, string> = {
  telegram: "M9.04 15.47 8.7 20.1c.5 0 .7-.2 1-.5l2.4-2.3 4.9 3.6c.9.5 1.6.2 1.8-.8L22 4.8c.3-1.3-.5-1.8-1.3-1.5L2.4 10.3c-1.3.5-1.3 1.2-.2 1.5l4.7 1.5L17.7 6.5c.5-.3 1-.2.6.2z",
  whatsapp: "M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4c1.7.7 2.1.6 2.8.5a2.4 2.4 0 0 0 1.6-1.1c.2-.6.2-1 .1-1.1l-.5-.3z",
  phone: "M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.6 3.6a1 1 0 0 1-.25 1z",
}

/** Призыв тату-студии: неоновая табличка, телефон, часы и мессенджеры. */
export function Cta020({
  sign = "Open",
  title = "Бесплатная консультация — сегодня",
  text = "Придите или напишите: покажем работы, посчитаем цену и нарисуем первый эскиз. Без предоплаты и обязательств.",
  phone = "+7 812 240-70-17",
  phoneHref = "tel:+78122407017",
  channels = [
    { kind: "telegram", label: "Telegram", href: "https://t.me/" },
    { kind: "whatsapp", label: "WhatsApp", href: "https://wa.me/" },
    { kind: "max", label: "Max", href: "#" },
  ],
  hours = "ежедневно 12:00–22:00 · Лиговский, 50",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Cta020Props) {
  const palette = {
    ...(accent ? { "--vibeui-cta-020-accent": accent } : null),
    ...(background ? { "--vibeui-cta-020-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-cta-020" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="cta-020" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {sign ? (
            <span data-part="sign" aria-hidden="true">
              {sign}
            </span>
          ) : null}
          <div>
            <h2 data-part="title">{title}</h2>
            {text ? <p data-part="text">{text}</p> : null}
            {phone ? (
              <Button016 data-part="phone" label={phone} href={phoneHref} external={false} size="lg" tone="accent" accent={accent} />
            ) : null}
            {hours ? <p data-part="hours">{hours}</p> : null}
            {channels.length > 0 ? (
              <ul data-part="channels">
                {channels.map((channel) => (
                  <li key={channel.label}>
                    <a data-part="channel" href={channel.href} target={channel.href.startsWith("http") ? "_blank" : undefined} rel={channel.href.startsWith("http") ? "noreferrer noopener" : undefined}>
                      {ICONS[channel.kind] ? (
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d={ICONS[channel.kind]} />
                        </svg>
                      ) : null}
                      {channel.label}
                    </a>
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
