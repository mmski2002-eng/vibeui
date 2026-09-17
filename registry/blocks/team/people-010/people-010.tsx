import type { CSSProperties } from "react"

export type People010Person = {
  name: string
  /** Роль: «свидетельница», «организатор». */
  role: string
  text?: string
  image?: string
  imageAlt?: string
  /** Подпись контакта и ссылка: «написать в Telegram». */
  contactLabel?: string
  contactHref?: string
}

export type People010Props = {
  eyebrow?: string
  title?: string
  lede?: string
  people?: readonly People010Person[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «С кем вы встретитесь»: свидетели и организатор полароидами — белая
// рамка с толстым низом, кадр квадратом, подпись рукописным курсивом.
// Карточки чуть повёрнуты вразнобой и выпрямляются по наведению, у
// каждой ссылка «написать» — по любому вопросу до свадьбы. Серверный.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="people-010"]){
--vibeui-people-010-bg:light-dark(#fffaf3,#1d1620);
--vibeui-people-010-fg:light-dark(#2b1a24,#f3ebe4);
--vibeui-people-010-muted:light-dark(#7a6a70,#b3a5aa);
--vibeui-people-010-line:light-dark(#e2d8ca,#372b31);
--vibeui-people-010-paper:light-dark(#ffffff,#2a2230);
--vibeui-people-010-accent:#b8552f;
--vibeui-people-010-plum:light-dark(#4a1f36,#e9c7d6);
--vibeui-people-010-sand:light-dark(#d9c5a5,#5a4a3a);
--vibeui-people-010-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-people-010-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="people-010"]{color-scheme:dark}
:where([data-vibeui-block="people-010"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="people-010"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="people-010"]{box-sizing:border-box;display:block;background:var(--vibeui-people-010-bg);color:var(--vibeui-people-010-fg);font-family:var(--vibeui-people-010-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="people-010"] *{box-sizing:border-box}
[data-vibeui-block="people-010"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="people-010"] [data-part="head"]{max-width:40rem;margin-bottom:2.5rem}
[data-vibeui-block="people-010"] [data-part="eyebrow"]{margin:0 0 .6rem;font-size:.72rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--vibeui-people-010-accent)}
[data-vibeui-block="people-010"] [data-part="title"]{margin:0;font-family:var(--vibeui-people-010-display);font-size:clamp(2rem,5cqi,3.6rem);font-weight:500;font-style:italic;line-height:1.05;color:var(--vibeui-people-010-plum);text-wrap:balance}
[data-vibeui-block="people-010"] [data-part="lede"]{margin:.8rem 0 0;color:var(--vibeui-people-010-muted)}
[data-vibeui-block="people-010"] [data-part="grid"]{display:grid;gap:2rem;margin:0;padding:0;list-style:none;justify-items:center}
[data-vibeui-block="people-010"] [data-part="card"]{width:min(100%,18rem);padding:.9rem .9rem 1.2rem;background:var(--vibeui-people-010-paper);box-shadow:0 20px 40px -24px rgb(43 26 36 / .55),0 1px 0 var(--vibeui-people-010-line);transform:rotate(var(--vibeui-people-010-tilt,0deg));transition:transform .4s cubic-bezier(.2,.9,.3,1.2),box-shadow .4s}
[data-vibeui-block="people-010"] [data-part="grid"] li:nth-child(3n+1) [data-part="card"]{--vibeui-people-010-tilt:-2.5deg}
[data-vibeui-block="people-010"] [data-part="grid"] li:nth-child(3n+2) [data-part="card"]{--vibeui-people-010-tilt:1.5deg}
[data-vibeui-block="people-010"] [data-part="grid"] li:nth-child(3n) [data-part="card"]{--vibeui-people-010-tilt:-1deg}
[data-vibeui-block="people-010"] [data-part="card"]:hover{transform:rotate(0) translateY(-.4rem);box-shadow:0 30px 50px -24px rgb(43 26 36 / .6),0 1px 0 var(--vibeui-people-010-line)}
[data-vibeui-block="people-010"] [data-part="pic"]{display:block;aspect-ratio:1;overflow:hidden;background:var(--vibeui-people-010-sand)}
[data-vibeui-block="people-010"] [data-part="pic"] img{display:block;width:100%;height:100%;object-fit:cover;filter:saturate(.9)}
[data-vibeui-block="people-010"] [data-part="name"]{margin:1rem 0 0;font-family:var(--vibeui-people-010-display);font-style:italic;font-size:1.6rem;font-weight:500;line-height:1.1;color:var(--vibeui-people-010-plum)}
[data-vibeui-block="people-010"] [data-part="role"]{display:block;margin-top:.2rem;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-people-010-accent)}
[data-vibeui-block="people-010"] [data-part="text"]{margin:.6rem 0 0;font-size:.92rem;color:var(--vibeui-people-010-muted)}
[data-vibeui-block="people-010"] [data-part="contact"]{display:inline-flex;align-items:center;gap:.4rem;margin-top:.8rem;font-size:.88rem;font-weight:600;color:var(--vibeui-people-010-fg);text-decoration:none;border-bottom:1px solid var(--vibeui-people-010-accent);transition:color .25s}
[data-vibeui-block="people-010"] [data-part="contact"]:hover{color:var(--vibeui-people-010-accent)}
[data-vibeui-block="people-010"] [data-part="contact"]:focus-visible{outline:2px solid var(--vibeui-people-010-accent);outline-offset:3px}
[data-vibeui-block="people-010"] [data-part="contact"] svg{width:.95rem;height:.95rem;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
@container (min-width:44rem){
[data-vibeui-block="people-010"] [data-part="grid"]{grid-template-columns:repeat(auto-fit,minmax(15rem,18rem));justify-content:center;gap:2.5rem 2rem}
}
@container (min-width:64rem){
[data-vibeui-block="people-010"] [data-part="shell"]{padding:5rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="people-010"] *{animation:none!important;transition:none!important}}`

/** Свидетели и организатор свадьбы полароидами вразнобой с ролью и ссылкой «написать». */
export function People010({
  eyebrow = "С кем вы встретитесь",
  title = "Три человека, к которым можно с любым вопросом",
  lede = "Мы будем заняты друг другом. Поэтому по всему организационному — к ним: они знают больше нас.",
  people = [
    { name: "Ксения", role: "Свидетельница", text: "Лучшая подруга Василисы с первого курса. Знает, где сидеть, что дарить и кто с кем не разговаривает.", contactLabel: "Написать в Telegram", contactHref: "#" },
    { name: "Даниил", role: "Свидетель", text: "Брат Артёма. Отвечает за трансфер, парковку и тех, кто потерялся по дороге.", contactLabel: "Написать в Telegram", contactHref: "#" },
    { name: "Полина", role: "Организатор", text: "Собирает весь день по минутам. Аллергии, отели, детские стулья — это к ней.", contactLabel: "Позвонить", contactHref: "tel:+70000000000" },
  ],
  tone = "auto",
  accent,
  background,
  className,
  style,
}: People010Props) {
  const palette = {
    ...(accent ? { "--vibeui-people-010-accent": accent } : null),
    ...(background ? { "--vibeui-people-010-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-people-010" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="people-010" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <p data-part="eyebrow">{eyebrow}</p>
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <ul data-part="grid">
            {people.map((person) => (
              <li key={person.name}>
                <article data-part="card">
                  <span data-part="pic">{person.image ? <img src={person.image} alt={person.imageAlt ?? person.name} loading="lazy" /> : null}</span>
                  <h3 data-part="name">{person.name}</h3>
                  <span data-part="role">{person.role}</span>
                  {person.text ? <p data-part="text">{person.text}</p> : null}
                  {person.contactLabel && person.contactHref ? (
                    <a data-part="contact" href={person.contactHref}>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        {person.contactHref.startsWith("tel:") ? (
                          <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2 3.6.8v3.2A1.5 1.5 0 0 1 17.5 21 16 16 0 0 1 3 6.5 1.5 1.5 0 0 1 4.8 5H8l.8 3.6z" />
                        ) : person.contactHref.startsWith("mailto:") ? (
                          <path d="M4 6h16v12H4zM4 7l8 6 8-6" />
                        ) : (
                          <path d="M4 12l16-7-4 14-4-5zM12 14l8-9" />
                        )}
                      </svg>
                      {person.contactLabel}
                    </a>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
