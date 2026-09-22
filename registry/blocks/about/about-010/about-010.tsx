import type { CSSProperties } from "react"
import { Card129 } from "@/registry/components/card/card-129/card-129"

export type About010Point = {
  title: string
  text: string
}

export type About010Props = {
  eyebrow?: string
  title?: string
  /** Манифест; фраза в *звёздочках* светится неоном. */
  text?: string
  points?: readonly About010Point[]
  /** Два фото: зал и рабочее место. */
  imageHall?: string
  imageHallAlt?: string
  imageDesk?: string
  imageDeskAlt?: string
  /** Документы: лицензия, СЭС. */
  docs?: readonly string[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// О студии: манифест с неоновой фразой слева, справа два фото слоями с
// параллаксом по скроллу (scroll-driven, в старых браузерах статично):
// зал уходит назад, рабочее место наезжает сверху с неоновой рамкой.
// Ниже пункты про стерильность и документы плашками. Серверный.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"

const STYLES = `
:where([data-vibeui-block="about-010"]){
--vibeui-about-010-bg:#07060b;
--vibeui-about-010-fg:#f3eefc;
--vibeui-about-010-muted:#a39bb5;
--vibeui-about-010-line:rgb(255 255 255 / .12);
--vibeui-about-010-card:#110e1a;
--vibeui-about-010-accent:#ff2bd6;
--vibeui-about-010-accent-2:#8b5cff;
--vibeui-about-010-cyan:#22f3ff;
--vibeui-about-010-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-about-010-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-about-010-mono:"JetBrains Mono",ui-monospace,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="about-010"]{color-scheme:dark}
:where([data-vibeui-block="about-010"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="about-010"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="about-010"]{box-sizing:border-box;display:block;overflow:hidden;background:var(--vibeui-about-010-bg);color:var(--vibeui-about-010-fg);font-family:var(--vibeui-about-010-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="about-010"] *{box-sizing:border-box}
[data-vibeui-block="about-010"] [data-part="shell"]{display:grid;gap:2.5rem;max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="about-010"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 .75rem;font-family:var(--vibeui-about-010-mono);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-about-010-cyan);text-shadow:0 0 10px color-mix(in oklab,var(--vibeui-about-010-cyan) 70%,transparent)}
[data-vibeui-block="about-010"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-about-010-cyan);box-shadow:0 0 8px var(--vibeui-about-010-cyan)}
[data-vibeui-block="about-010"] [data-part="title"]{margin:0;font-family:var(--vibeui-about-010-display);font-size:clamp(1.8rem,3.8cqi,2.8rem);font-weight:700;line-height:1.05;letter-spacing:-.02em;text-transform:uppercase}
[data-vibeui-block="about-010"] [data-part="text"]{margin:1.25rem 0 0;font-size:clamp(1.1rem,2cqi,1.4rem);line-height:1.45;max-width:30rem}
[data-vibeui-block="about-010"] [data-part="text"] mark{background:none;color:var(--vibeui-about-010-accent);text-shadow:0 0 8px var(--vibeui-about-010-accent),0 0 24px color-mix(in oklab,var(--vibeui-about-010-accent) 60%,transparent)}
[data-vibeui-block="about-010"] [data-part="points"]{display:grid;gap:.75rem;margin:1.75rem 0 0;padding:0;list-style:none}
[data-vibeui-block="about-010"] [data-part="docs"]{display:flex;flex-wrap:wrap;gap:.4rem;margin:1.25rem 0 0;padding:0;list-style:none}
[data-vibeui-block="about-010"] [data-part="docs"] li{padding:.3rem .65rem;border-radius:.4rem;border:1px solid color-mix(in oklab,var(--vibeui-about-010-accent-2) 60%,transparent);font-family:var(--vibeui-about-010-mono);font-size:.72rem;letter-spacing:.06em;color:var(--vibeui-about-010-muted)}
[data-vibeui-block="about-010"] [data-part="media"]{position:relative;min-height:26rem}
[data-vibeui-block="about-010"] [data-part="hall"],[data-vibeui-block="about-010"] [data-part="desk"]{position:absolute;overflow:hidden;border-radius:1rem;background:#1a1526}
[data-vibeui-block="about-010"] [data-part="hall"]{inset:0 15% 20% 0;border:1px solid var(--vibeui-about-010-line)}
[data-vibeui-block="about-010"] [data-part="desk"]{right:0;bottom:0;width:60%;aspect-ratio:3/2;border:1px solid color-mix(in oklab,var(--vibeui-about-010-accent) 60%,transparent);box-shadow:0 0 30px color-mix(in oklab,var(--vibeui-about-010-accent) 35%,transparent),0 30px 60px -30px rgb(0 0 0 / .8)}
[data-vibeui-block="about-010"] [data-part="media"] img{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="about-010"] [data-part="hall"]::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgb(7 6 11 / .6))}
@supports (animation-timeline: view()){
[data-vibeui-block="about-010"] [data-part="hall"]{animation:vibeui-about-010-back linear both;animation-timeline:view();animation-range:entry 0% exit 100%}
[data-vibeui-block="about-010"] [data-part="desk"]{animation:vibeui-about-010-front linear both;animation-timeline:view();animation-range:entry 0% exit 100%}
}
@keyframes vibeui-about-010-back{from{transform:translateY(3rem)}to{transform:translateY(-3rem)}}
@keyframes vibeui-about-010-front{from{transform:translateY(5rem)}to{transform:translateY(-5rem)}}
@container (min-width: 60rem){
[data-vibeui-block="about-010"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:4rem;padding:5.5rem 2rem;align-items:center}
[data-vibeui-block="about-010"] [data-part="media"]{min-height:34rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="about-010"] *{animation:none!important;transition:none!important}}`

function markup(text: string) {
  return text.split(/(\*[^*]+\*)/).map((part, index) => (part.startsWith("*") && part.endsWith("*") ? <mark key={index}>{part.slice(1, -1)}</mark> : <span key={index}>{part}</span>))
}

/** О тату-студии: манифест с неоновой фразой, фото с параллаксом, стерильность и документы. */
export function About010({
  eyebrow = "О студии",
  title = "Тихое место с громкими работами",
  text = "Мы не салон у метро и не подвал с плакатами. Четыре кабинета, дневной свет, музыка потише и правило одно: *никаких компромиссов со стерильностью*.",
  points = [
    { title: "Одноразовое всё", text: "Иглы, картриджи, краски в капсулах и плёнка вскрываются при вас." },
    { title: "Автоклав и УФ", text: "Многоразовые держатели проходят автоклав класса B после каждого клиента." },
    { title: "Анестезия по запросу", text: "Сертифицированные кремы для чувствительных зон, обсуждаем заранее." },
  ],
  imageHall = "/demo/tattoo/studio-01.webp",
  imageHallAlt = "Зал студии",
  imageDesk = "/demo/tattoo/studio-02.webp",
  imageDeskAlt = "Стерильное рабочее место",
  docs = ["Лицензия № ЛО-78-01-011245", "Договор с СЭС", "Медкнижки мастеров"],
  tone = "auto",
  accent,
  background,
  className,
  style,
}: About010Props) {
  const palette = {
    ...(accent ? { "--vibeui-about-010-accent": accent } : null),
    ...(background ? { "--vibeui-about-010-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-about-010" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="about-010" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {text ? <p data-part="text">{markup(text)}</p> : null}
            {points.length > 0 ? (
              <ul data-part="points">
                {points.map((point) => (
                  <Card129 key={point.title} data-part="point" title={point.title} text={point.text} accent={accent} />
                ))}
              </ul>
            ) : null}
            {docs.length > 0 ? (
              <ul data-part="docs">
                {docs.map((doc) => (
                  <li key={doc}>{doc}</li>
                ))}
              </ul>
            ) : null}
          </div>
          <div data-part="media">
            <div data-part="hall">{imageHall ? <img src={imageHall} alt={imageHallAlt} loading="lazy" /> : null}</div>
            <div data-part="desk">{imageDesk ? <img src={imageDesk} alt={imageDeskAlt} loading="lazy" /> : null}</div>
          </div>
        </div>
      </section>
    </>
  )
}
