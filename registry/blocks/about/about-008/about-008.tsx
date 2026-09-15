import type { CSSProperties } from "react"

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
  /** Логотипы компаний текстом. */
  companies?: readonly string[]
  companiesLabel?: string
  facts?: readonly About008Fact[]
  /** Ссылка на профиль или портфолио. */
  linkLabel?: string
  linkHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Автор курса: портрет с цветной подложкой со сдвигом, имя крупно, роль,
// цитата с маркерным выделением, регалии галочками, компании текстом и
// три факта цифрами. Серверный, без состояния.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="about-008"]){
--vibeui-about-008-bg:light-dark(#ffffff,#0f1117);
--vibeui-about-008-fg:light-dark(#111827,#f3f4f6);
--vibeui-about-008-muted:light-dark(#6b7280,#9ca3af);
--vibeui-about-008-card:light-dark(#f8fafc,#161a23);
--vibeui-about-008-line:light-dark(#e5e7eb,#262b36);
--vibeui-about-008-accent:#4f46e5;
--vibeui-about-008-marker:light-dark(#d9f99d,rgb(163 230 53 / .3));
--vibeui-about-008-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-about-008-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="about-008"]{color-scheme:dark}
:where([data-vibeui-block="about-008"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="about-008"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="about-008"]{box-sizing:border-box;display:block;background:var(--vibeui-about-008-bg);color:var(--vibeui-about-008-fg);font-family:var(--vibeui-about-008-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="about-008"] *{box-sizing:border-box}
[data-vibeui-block="about-008"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem;display:grid;gap:2.5rem}
[data-vibeui-block="about-008"] [data-part="media"]{position:relative;padding:0 1.25rem 1.25rem 0}
[data-vibeui-block="about-008"] [data-part="media"]::before{content:"";position:absolute;inset:1.25rem 0 0 1.25rem;border-radius:1.25rem;background:color-mix(in oklab,var(--vibeui-about-008-accent) 18%,var(--vibeui-about-008-bg))}
[data-vibeui-block="about-008"] [data-part="portrait"]{position:relative;display:block;width:100%;aspect-ratio:4/5;object-fit:cover;object-position:center top;border-radius:1.25rem;background:light-dark(#e5e7eb,#1f2430)}
[data-vibeui-block="about-008"] [data-part="badge"]{position:absolute;right:0;bottom:2.5rem;padding:.6rem .9rem;border-radius:.75rem;background:var(--vibeui-about-008-marker);color:#1a2e05;font-family:var(--vibeui-about-008-display);font-size:.78rem;font-weight:600;transform:rotate(3deg);box-shadow:0 10px 20px -12px rgb(0 0 0 / .35)}
[data-vibeui-block="about-008"] [data-part="eyebrow"]{margin:0 0 .75rem;font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-about-008-accent);font-weight:700}
[data-vibeui-block="about-008"] [data-part="name"]{margin:0;font-family:var(--vibeui-about-008-display);font-weight:700;font-size:clamp(1.8rem,3.6cqi,2.75rem);line-height:1.1;letter-spacing:-.02em}
[data-vibeui-block="about-008"] [data-part="role"]{margin:.5rem 0 0;color:var(--vibeui-about-008-muted)}
[data-vibeui-block="about-008"] [data-part="quote"]{margin:1.5rem 0 0;font-size:1.15rem;line-height:1.45;font-weight:500}
[data-vibeui-block="about-008"] [data-part="quote"] mark{background:linear-gradient(transparent 55%,var(--vibeui-about-008-marker) 55%);color:inherit;padding:0 .1em}
[data-vibeui-block="about-008"] [data-part="text"]{margin:1rem 0 0;color:var(--vibeui-about-008-muted);max-width:34rem}
[data-vibeui-block="about-008"] [data-part="credentials"]{margin:1.5rem 0 0;padding:0;list-style:none;display:grid;gap:.5rem}
[data-vibeui-block="about-008"] [data-part="credentials"] li{display:flex;gap:.7rem;align-items:flex-start;font-size:.9rem}
[data-vibeui-block="about-008"] [data-part="credentials"] li::before{content:"";flex:none;width:1.1rem;height:1.1rem;margin-top:.15rem;border-radius:50%;background:var(--vibeui-about-008-accent) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M5.5 10.5l3 3 6-6' fill='none' stroke='%23fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/100% no-repeat}
[data-vibeui-block="about-008"] [data-part="companies"]{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem 1.25rem;margin-top:1.5rem}
[data-vibeui-block="about-008"] [data-part="companies-label"]{font-size:.75rem;color:var(--vibeui-about-008-muted)}
[data-vibeui-block="about-008"] [data-part="company"]{font-family:var(--vibeui-about-008-display);font-size:.9rem;font-weight:600;opacity:.55}
[data-vibeui-block="about-008"] [data-part="facts"]{display:flex;flex-wrap:wrap;gap:1.25rem 2.5rem;margin:1.75rem 0 0;padding:1.5rem 0 0;list-style:none;border-top:1px solid var(--vibeui-about-008-line)}
[data-vibeui-block="about-008"] [data-part="fact"] b{display:block;font-family:var(--vibeui-about-008-display);font-size:1.75rem;font-weight:700;line-height:1;letter-spacing:-.02em;color:var(--vibeui-about-008-accent)}
[data-vibeui-block="about-008"] [data-part="fact"] span{display:block;margin-top:.3rem;font-size:.8rem;color:var(--vibeui-about-008-muted)}
[data-vibeui-block="about-008"] [data-part="link"]{display:inline-block;margin-top:1.5rem;color:inherit;font-weight:600;text-decoration:none;border-bottom:1px solid var(--vibeui-about-008-accent);padding-bottom:.1rem}
[data-vibeui-block="about-008"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-about-008-accent);outline-offset:3px}
@container (min-width: 56rem){
[data-vibeui-block="about-008"] [data-part="shell"]{grid-template-columns:minmax(0,4fr) minmax(0,6fr);gap:5rem;padding:5.5rem 2rem;align-items:center}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="about-008"] *{transition:none!important}}`

function markup(text: string) {
  return text.split(/(\*[^*]+\*)/).map((part, index) => (part.startsWith("*") && part.endsWith("*") ? <mark key={index}>{part.slice(1, -1)}</mark> : <span key={index}>{part}</span>))
}

/** Автор курса: портрет с подложкой, цитата с маркером, регалии, компании и факты. */
export function About008({
  eyebrow = "Автор курса",
  name = "Ксения Мороз",
  role = "Ведущий продуктовый дизайнер, 12 лет в интерфейсах",
  quote = "Я не учу «рисовать красиво». Я учу *собирать интерфейс так, чтобы его можно было отдать в разработку завтра*.",
  text = "Собирала дизайн-системы для банка и маркетплейса, вела команды до двенадцати дизайнеров. Курс — это моя внутренняя программа онбординга, переписанная для людей снаружи.",
  image = "",
  imageAlt = "",
  credentials = ["Дизайн-система Тинькофф Бизнес, 2019–2022", "Лид дизайна в Самокате, 2022–2024", "Спикер Dribbble Meetup и ProductSense"],
  companies = ["Тинькофф", "Самокат", "Ozon"],
  companiesLabel = "Работала в",
  facts = [
    { value: "12", label: "лет в продуктах" },
    { value: "3 000+", label: "выпускников" },
    { value: "4,9", label: "оценка курса" },
  ],
  linkLabel = "Портфолио и статьи",
  linkHref = "#",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: About008Props) {
  const palette = {
    ...(accent ? { "--vibeui-about-008-accent": accent } : null),
    ...(background ? { "--vibeui-about-008-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-about-008" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="about-008" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="media">
            {image ? <img data-part="portrait" src={image} alt={imageAlt || name} loading="lazy" /> : <span data-part="portrait" />}
            {facts[0] ? (
              <span data-part="badge">
                {facts[0].value} {facts[0].label}
              </span>
            ) : null}
          </div>
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="name">{name}</h2>
            {role ? <p data-part="role">{role}</p> : null}
            {quote ? <p data-part="quote">{markup(quote)}</p> : null}
            {text ? <p data-part="text">{text}</p> : null}
            {credentials.length > 0 ? (
              <ul data-part="credentials">
                {credentials.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {companies.length > 0 ? (
              <div data-part="companies">
                {companiesLabel ? <span data-part="companies-label">{companiesLabel}</span> : null}
                {companies.map((company) => (
                  <span key={company} data-part="company">
                    {company}
                  </span>
                ))}
              </div>
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
              <a data-part="link" href={linkHref}>
                {linkLabel} →
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
