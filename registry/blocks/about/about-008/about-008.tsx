import type { CSSProperties } from "react"

import { Button077 } from "@/registry/components/button/button-077/button-077"

export type About008Fact = {
  value: string
  label: string
}

export type About008Props = {
  eyebrow?: string
  name?: string
  role?: string
  quote?: string
  text?: string
  image?: string
  imageAlt?: string
  /** Регалии: где работала, что вела. */
  credentials?: readonly string[]
  /** Логотипы компаний текстом — уходят в бегущую строку. */
  companies?: readonly string[]
  companiesLabel?: string
  facts?: readonly About008Fact[]
  /** Ссылка на профиль или портфолио. */
  linkLabel?: string
  linkHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Автор курса: цитата крупно на весь ряд, маркер под словом рисуется, когда
// строка входит в кадр (scroll-driven animation, в старых браузерах уже
// нарисован). Ниже портрет на цветной подложке с наклоном, имя, роль,
// регалии и факты. Внизу бегущая строка компаний и регалий, пауза по
// наведению. Серверный, без состояния.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="about-008"]){
--vibeui-about-008-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-about-008-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-about-008-muted:light-dark(#6b7280,#a3a3a3);
--vibeui-about-008-card:light-dark(#f8fafc,#242424);
--vibeui-about-008-line:light-dark(#e5e7eb,#2e2e2e);
--vibeui-about-008-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-about-008-marker:light-dark(#d9f99d,rgb(163 230 53 / .3));
--vibeui-about-008-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-about-008-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="about-008"]{color-scheme:dark}
:where([data-vibeui-block="about-008"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="about-008"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="about-008"]{box-sizing:border-box;display:block;overflow:hidden;background:var(--vibeui-about-008-bg);color:var(--vibeui-about-008-fg);font-family:var(--vibeui-about-008-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="about-008"] *{box-sizing:border-box}
[data-vibeui-block="about-008"] [data-part="link"]{margin-top:1.5rem}
[data-vibeui-block="about-008"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem 0}
[data-vibeui-block="about-008"] [data-part="eyebrow"]{margin:0 0 1.25rem;font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-about-008-accent);font-weight:700}
[data-vibeui-block="about-008"] [data-part="quote"]{margin:0 0 3rem;font-family:var(--vibeui-about-008-display);font-weight:600;font-size:clamp(1.35rem,3.2cqi,2.5rem);line-height:1.25;letter-spacing:-.02em;text-wrap:balance;max-width:30ch}
[data-vibeui-block="about-008"] [data-part="quote"] mark{background:linear-gradient(var(--vibeui-about-008-marker),var(--vibeui-about-008-marker)) no-repeat left 82% / 100% .35em;color:inherit;padding:0 .08em;box-decoration-break:clone;-webkit-box-decoration-break:clone}
@supports (animation-timeline: view()){
[data-vibeui-block="about-008"] [data-part="quote"] mark{background-size:0% .35em;animation:vibeui-about-008-draw linear both;animation-timeline:view();animation-range:entry 30% entry 90%}
}
@keyframes vibeui-about-008-draw{to{background-size:100% .35em}}
[data-vibeui-block="about-008"] [data-part="grid"]{display:grid;gap:2.5rem}
[data-vibeui-block="about-008"] [data-part="media"]{position:relative;padding:0 1.25rem 1.25rem 0;max-width:26rem}
[data-vibeui-block="about-008"] [data-part="media"]::before{content:"";position:absolute;inset:1.25rem 0 0 1.25rem;border-radius:1.25rem;background:color-mix(in oklab,var(--vibeui-about-008-accent) 18%,var(--vibeui-about-008-bg));transform:rotate(-2deg);transition:transform .6s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="about-008"] [data-part="media"]:hover::before{transform:rotate(2deg)}
[data-vibeui-block="about-008"] [data-part="portrait"]{position:relative;display:block;width:100%;aspect-ratio:4/5;object-fit:cover;object-position:center top;border-radius:1.25rem;background:light-dark(#e5e7eb,#1f2430)}
[data-vibeui-block="about-008"] [data-part="badge"]{position:absolute;right:0;bottom:2.5rem;padding:.6rem .9rem;border-radius:.75rem;background:var(--vibeui-about-008-marker);color:#1a2e05;font-family:var(--vibeui-about-008-display);font-size:.78rem;font-weight:600;transform:rotate(3deg);box-shadow:0 10px 20px -12px rgb(0 0 0 / .35)}
[data-vibeui-block="about-008"] [data-part="name"]{margin:0;font-family:var(--vibeui-about-008-display);font-weight:700;font-size:clamp(1.6rem,3cqi,2.25rem);line-height:1.1;letter-spacing:-.02em}
[data-vibeui-block="about-008"] [data-part="role"]{margin:.5rem 0 0;color:var(--vibeui-about-008-muted)}
[data-vibeui-block="about-008"] [data-part="text"]{margin:1.25rem 0 0;color:var(--vibeui-about-008-muted);max-width:34rem}
[data-vibeui-block="about-008"] [data-part="credentials"]{margin:1.5rem 0 0;padding:0;list-style:none;display:grid;gap:.5rem}
[data-vibeui-block="about-008"] [data-part="credentials"] li{display:flex;gap:.7rem;align-items:flex-start;font-size:.9rem}
[data-vibeui-block="about-008"] [data-part="credentials"] li::before{content:"";flex:none;width:1.1rem;height:1.1rem;margin-top:.15rem;border-radius:50%;background:var(--vibeui-about-008-accent) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M5.5 10.5l3 3 6-6' fill='none' stroke='%23fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/100% no-repeat}
[data-vibeui-block="about-008"] [data-part="facts"]{display:flex;flex-wrap:wrap;gap:1.25rem 2.5rem;margin:1.75rem 0 0;padding:1.5rem 0 0;list-style:none;border-top:1px solid var(--vibeui-about-008-line)}
[data-vibeui-block="about-008"] [data-part="fact"] b{display:block;font-family:var(--vibeui-about-008-display);font-size:1.75rem;font-weight:700;line-height:1;letter-spacing:-.02em;color:var(--vibeui-about-008-accent)}
[data-vibeui-block="about-008"] [data-part="fact"] span{display:block;margin-top:.3rem;font-size:.8rem;color:var(--vibeui-about-008-muted)}
[data-vibeui-block="about-008"] [data-part="ticker"]{position:relative;margin-top:3.5rem;padding:1.1rem 0;border-top:1px solid var(--vibeui-about-008-line);border-bottom:1px solid var(--vibeui-about-008-line);overflow:hidden;mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
[data-vibeui-block="about-008"] [data-part="track"]{display:flex;gap:3rem;width:max-content;animation:vibeui-about-008-run 32s linear infinite}
[data-vibeui-block="about-008"] [data-part="ticker"]:hover [data-part="track"]{animation-play-state:paused}
@keyframes vibeui-about-008-run{to{transform:translateX(-50%)}}
[data-vibeui-block="about-008"] [data-part="track"] ul{display:flex;gap:3rem;margin:0;padding:0;list-style:none;white-space:nowrap}
[data-vibeui-block="about-008"] [data-part="company"]{font-family:var(--vibeui-about-008-display);font-size:1.1rem;font-weight:700;letter-spacing:-.01em;opacity:.8}
[data-vibeui-block="about-008"] [data-part="cred"]{display:inline-flex;align-items:center;gap:.6rem;font-size:.85rem;color:var(--vibeui-about-008-muted)}
[data-vibeui-block="about-008"] [data-part="cred"]::before{content:"";width:.4rem;height:.4rem;border-radius:50%;background:var(--vibeui-about-008-accent)}
@container (min-width: 56rem){
[data-vibeui-block="about-008"] [data-part="shell"]{padding:5.5rem 2rem 0}
[data-vibeui-block="about-008"] [data-part="grid"]{grid-template-columns:minmax(0,4fr) minmax(0,6fr);gap:5rem;align-items:center}
[data-vibeui-block="about-008"] [data-part="media"]{max-width:none}
[data-vibeui-block="about-008"] [data-part="quote"]{margin-bottom:4rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="about-008"] *{animation:none!important;transition:none!important}[data-vibeui-block="about-008"] [data-part="quote"] mark{background-size:100% .35em}}`

function markup(text: string) {
  return text.split(/(\*[^*]+\*)/).map((part, index) => (part.startsWith("*") && part.endsWith("*") ? <mark key={index}>{part.slice(1, -1)}</mark> : <span key={index}>{part}</span>))
}

/** Автор курса: цитата крупно с рисующимся маркером, портрет, регалии, факты и бегущая строка компаний. */
export function About008({
  eyebrow = "Автор курса",
  name = "Ксения Мороз",
  role = "Ведущий продуктовый дизайнер, 12 лет в интерфейсах",
  quote = "Я не учу «рисовать красиво». Я учу *собирать интерфейс так, чтобы его можно было отдать в разработку завтра*.",
  text = "Собирала дизайн-системы для банка и маркетплейса, вела команды до двенадцати дизайнеров. Курс — это моя внутренняя программа онбординга, переписанная для людей снаружи.",
  image = "",
  imageAlt = "",
  credentials = ["Дизайн-система Тинькофф Бизнес, 2019–2022", "Лид дизайна в Самокате, 2022–2024", "Спикер Dribbble Meetup и ProductSense"],
  companies = ["Тинькофф", "Самокат", "Ozon", "Яндекс", "Авито"],
  companiesLabel = "Работала с",
  facts = [
    { value: "12", label: "лет в продуктах" },
    { value: "3 000+", label: "выпускников" },
    { value: "4,9", label: "оценка курса" },
  ],
  linkLabel = "Портфолио и статьи",
  linkHref = "#",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: About008Props) {
  const palette = {
    ...(accent ? { "--vibeui-about-008-accent": accent } : null),
    ...(ink ? { "--vibeui-about-008-fg": ink } : null),
    ...(background ? { "--vibeui-about-008-bg": background } : null),
    ...style,
  } as CSSProperties
  const ticker = [...companies.map((item) => ({ kind: "company", item })), ...credentials.map((item) => ({ kind: "cred", item }))]

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-about-008" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="about-008" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          {quote ? <p data-part="quote">{markup(quote)}</p> : null}
          <div data-part="grid">
            <div data-part="media">
              {image ? <img data-part="portrait" src={image} alt={imageAlt || name} loading="lazy" /> : <span data-part="portrait" />}
              {facts[0] ? (
                <span data-part="badge">
                  {facts[0].value} {facts[0].label}
                </span>
              ) : null}
            </div>
            <div>
              <h2 data-part="name">{name}</h2>
              {role ? <p data-part="role">{role}</p> : null}
              {text ? <p data-part="text">{text}</p> : null}
              {credentials.length > 0 ? (
                <ul data-part="credentials">
                  {credentials.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {facts.length > 0 ? (
                <ul data-part="facts">
                  {facts.map((fact) => (
                    <li key={fact.label} data-part="fact">
                      <b>{fact.value}</b>
                      <span>{fact.label}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {linkLabel ? (
                <Button077 data-part="link" label={linkLabel} href={linkHref} accent={accent} />
              ) : null}
            </div>
          </div>
        </div>
        {ticker.length > 0 ? (
          <div data-part="ticker" aria-label={companiesLabel}>
            <div data-part="track">
              {[0, 1].map((copy) => (
                <ul key={copy} aria-hidden={copy === 1}>
                  {ticker.map((entry) => (
                    <li key={entry.item} data-part={entry.kind}>
                      {entry.item}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </>
  )
}
