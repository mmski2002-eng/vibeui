import type { CSSProperties } from "react"

export type People007Agent = {
  name: string
  /** Специализация: «Новостройки и ипотека». */
  role: string
  /** Чем гордится: «18 лет в сделках», «412 сделок». */
  fact?: string
  /** Портрет 4:5. */
  image?: string
  phone?: string
  phoneHref?: string
  chatLabel?: string
  chatHref?: string
}

export type People007Props = {
  eyebrow?: string
  title?: string
  lede?: string
  agents?: readonly People007Agent[]
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Агенты: портреты 4:5 в ряд, имя серифом, специализация и факт капителью,
// телефон и «написать» снизу карточки. Фото чуть приподнимается по
// наведению, снизу выезжает контактная строка. Без состояния.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="people-007"]){
--vibeui-people-007-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-people-007-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-007-muted:color-mix(in oklab,var(--vibeui-people-007-fg) 62%,var(--vibeui-people-007-bg));
--vibeui-people-007-card:light-dark(#fffdf9,#242424);
--vibeui-people-007-line:color-mix(in oklab,var(--vibeui-people-007-fg) 14%,var(--vibeui-people-007-bg));
--vibeui-people-007-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-007-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-people-007-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="people-007"]{color-scheme:dark}
:where([data-vibeui-block="people-007"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="people-007"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="people-007"]{box-sizing:border-box;display:block;background:var(--vibeui-people-007-bg);color:var(--vibeui-people-007-fg);font-family:var(--vibeui-people-007-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="people-007"] *{box-sizing:border-box}
[data-vibeui-block="people-007"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="people-007"] [data-part="eyebrow"]{margin:0 0 .5rem;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-people-007-accent);font-weight:600}
[data-vibeui-block="people-007"] [data-part="title"]{margin:0;font-family:var(--vibeui-people-007-display);font-weight:500;font-size:clamp(2rem,4.5cqi,3.25rem);line-height:1.05;letter-spacing:-.01em}
[data-vibeui-block="people-007"] [data-part="lede"]{margin:.75rem 0 0;max-width:36rem;color:var(--vibeui-people-007-muted)}
[data-vibeui-block="people-007"] [data-part="grid"]{display:grid;gap:1.5rem;margin:2.5rem 0 0;padding:0;list-style:none;grid-template-columns:repeat(auto-fill,minmax(14rem,1fr))}
[data-vibeui-block="people-007"] [data-part="card"]{display:flex;flex-direction:column;overflow:hidden;border-radius:1rem;background:var(--vibeui-people-007-card);border:1px solid var(--vibeui-people-007-line);transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s}
[data-vibeui-block="people-007"] [data-part="card"]:hover{transform:translateY(-4px);box-shadow:0 30px 40px -28px rgb(20 33 27 / .5)}
[data-vibeui-block="people-007"] [data-part="media"]{position:relative;aspect-ratio:4/5;overflow:hidden;background:light-dark(#e7dfd2,#2a2a2a)}
[data-vibeui-block="people-007"] [data-part="media"] img{display:block;width:100%;height:100%;object-fit:cover;object-position:center top;transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="people-007"] [data-part="card"]:hover [data-part="media"] img{transform:scale(1.04)}
[data-vibeui-block="people-007"] [data-part="fact"]{position:absolute;left:.75rem;bottom:.75rem;padding:.3rem .65rem;border-radius:999px;background:var(--vibeui-people-007-card);color:var(--vibeui-people-007-fg);font-size:.7rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
[data-vibeui-block="people-007"] [data-part="body"]{display:grid;gap:.25rem;padding:1rem 1.1rem 1.15rem}
[data-vibeui-block="people-007"] [data-part="name"]{margin:0;font-family:var(--vibeui-people-007-display);font-size:1.5rem;font-weight:600;line-height:1.1}
[data-vibeui-block="people-007"] [data-part="role"]{margin:0;color:var(--vibeui-people-007-muted);font-size:.85rem}
[data-vibeui-block="people-007"] [data-part="links"]{display:flex;flex-wrap:wrap;gap:.35rem 1rem;margin-top:.6rem;padding-top:.7rem;border-top:1px solid var(--vibeui-people-007-line);font-size:.85rem;font-weight:600}
[data-vibeui-block="people-007"] [data-part="links"] a{color:inherit;text-decoration:none;border-bottom:1px solid var(--vibeui-people-007-accent);padding-bottom:.1rem;transition:color .2s}
[data-vibeui-block="people-007"] [data-part="links"] a:hover{color:var(--vibeui-people-007-accent)}
[data-vibeui-block="people-007"] [data-part="links"] a:focus-visible{outline:2px solid var(--vibeui-people-007-accent);outline-offset:3px;border-radius:.2rem}
@container (min-width: 64rem){[data-vibeui-block="people-007"] [data-part="shell"]{padding:5.5rem 2rem}[data-vibeui-block="people-007"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="people-007"] *{transition:none!important}}`

const DEFAULT_AGENTS: People007Agent[] = [
  { name: "Марина Лебедева", role: "Руководитель. Исторический фонд, центр", fact: "18 лет в сделках", phone: "+7 812 240-00-41", phoneHref: "tel:+78122400041", chatLabel: "Написать", chatHref: "#" },
  { name: "Илья Громов", role: "Новостройки и ипотека, все программы банков", fact: "412 сделок", phone: "+7 812 240-00-42", phoneHref: "tel:+78122400042", chatLabel: "Написать", chatHref: "#" },
  { name: "Ксения Орлова", role: "Аренда и продажа: Петроградская, Васильевский", fact: "26 дней до сделки", phone: "+7 812 240-00-43", phoneHref: "tel:+78122400043", chatLabel: "Написать", chatHref: "#" },
  { name: "Андрей Фёдоров", role: "Юрист. История квартиры, долги, собственники", fact: "0 оспоренных сделок", phone: "+7 812 240-00-44", phoneHref: "tel:+78122400044", chatLabel: "Почта", chatHref: "mailto:law@example.com" },
]

/** Агенты: портреты 4:5 в ряд, имя серифом, специализация, факт и контакты. */
export function People007({
  eyebrow = "Команда",
  title = "Четыре человека, которые ведут вашу сделку",
  lede = "Один агент от первого звонка до ключей. Юрист подключается к каждой сделке, а не по запросу.",
  agents = DEFAULT_AGENTS,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: People007Props) {
  const palette = {
    ...(accent ? { "--vibeui-people-007-accent": accent } : null),
    ...(ink ? { "--vibeui-people-007-fg": ink } : null),
    ...(background ? { "--vibeui-people-007-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-people-007" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="people-007" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <ul data-part="grid">
            {agents.map((agent) => (
              <li key={agent.name} data-part="card">
                <div data-part="media">
                  {agent.image ? <img src={agent.image} alt={agent.name} loading="lazy" /> : null}
                  {agent.fact ? <span data-part="fact">{agent.fact}</span> : null}
                </div>
                <div data-part="body">
                  <h3 data-part="name">{agent.name}</h3>
                  <p data-part="role">{agent.role}</p>
                  {agent.phone || agent.chatLabel ? (
                    <div data-part="links">
                      {agent.phone ? <a href={agent.phoneHref ?? `tel:${agent.phone.replace(/[^\d+]/g, "")}`}>{agent.phone}</a> : null}
                      {agent.chatLabel ? <a href={agent.chatHref ?? "#"}>{agent.chatLabel}</a> : null}
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
