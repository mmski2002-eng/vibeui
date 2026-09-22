import type { CSSProperties } from "react"
import { Card115 } from "@/registry/components/card/card-115/card-115"

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
  ink?: string
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
--vibeui-people-010-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-people-010-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-010-muted:light-dark(#7a6a70,#a3a3a3);
--vibeui-people-010-line:light-dark(#e2d8ca,#2e2e2e);
--vibeui-people-010-paper:light-dark(#ffffff,#2a2a2a);
--vibeui-people-010-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-010-plum:var(--vibeui-people-010-fg);
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
[data-vibeui-block="people-010"] [data-part="card"]{width:min(100%,18rem)}
[data-vibeui-block="people-010"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="people-010"] [data-part="head"]{max-width:40rem;margin-bottom:2.5rem}
[data-vibeui-block="people-010"] [data-part="eyebrow"]{margin:0 0 .6rem;font-size:.72rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--vibeui-people-010-accent)}
[data-vibeui-block="people-010"] [data-part="title"]{margin:0;font-family:var(--vibeui-people-010-display);font-size:clamp(2rem,5cqi,3.6rem);font-weight:500;font-style:italic;line-height:1.05;color:var(--vibeui-people-010-plum);text-wrap:balance}
[data-vibeui-block="people-010"] [data-part="lede"]{margin:.8rem 0 0;color:var(--vibeui-people-010-muted)}
[data-vibeui-block="people-010"] [data-part="grid"]{display:grid;gap:2rem;margin:0;padding:0;list-style:none;justify-items:center}
[data-vibeui-block="people-010"] [data-part="grid"] li:nth-child(3n+1) [data-vibeui-block="card-115"]{--vibeui-card-115-tilt:-2.5deg}
[data-vibeui-block="people-010"] [data-part="grid"] li:nth-child(3n+2) [data-vibeui-block="card-115"]{--vibeui-card-115-tilt:1.5deg}
[data-vibeui-block="people-010"] [data-part="grid"] li:nth-child(3n) [data-vibeui-block="card-115"]{--vibeui-card-115-tilt:-1deg}
@container (min-width:44rem){
[data-vibeui-block="people-010"] [data-part="grid"]{grid-template-columns:repeat(auto-fit,minmax(15rem,18rem));justify-content:start;justify-items:start;gap:2.5rem 2.5rem}
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
  ink,
  background,
  className,
  style,
}: People010Props) {
  const palette = {
    ...(accent ? { "--vibeui-people-010-accent": accent } : null),
    ...(ink ? { "--vibeui-people-010-fg": ink } : null),
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
                <Card115 data-part="card" image={person.image} imageAlt={person.imageAlt} name={person.name} role={person.role} text={person.text} contactLabel={person.contactLabel} contactHref={person.contactHref} accent={accent} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
