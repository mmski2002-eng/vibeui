import type { CSSProperties } from "react"
import { Card116 } from "@/registry/components/card/card-116/card-116"

export type People011Person = {
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

export type People011Props = {
  eyebrow?: string
  title?: string
  lede?: string
  people?: readonly People011Person[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Кто встречает»: свидетели и организатор в тёмных карточках на стекле —
// портрет в круге с серебряным ободком, рядом свечка с живым огоньком,
// роль курсивом, пара слов и ссылка «написать». Наведение — свечка ярче,
// карточка теплеет. Серверный.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Marck+Script&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="people-011"]){
--vibeui-people-011-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-people-011-card:light-dark(#ffffff,#242424);
--vibeui-people-011-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-011-muted:light-dark(#6b6b6b,#a3a3a3);
--vibeui-people-011-line:light-dark(color-mix(in oklab,var(--vibeui-people-011-fg) 16%,transparent),color-mix(in oklab,var(--vibeui-people-011-fg) 24%,transparent));
--vibeui-people-011-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-011-fire:#ff9a3c;
--vibeui-people-011-silver:#9fb0c8;
--vibeui-people-011-display:"Cormorant Garamond",Georgia,serif;
--vibeui-people-011-script:"Marck Script","Segoe Script",cursive;
--vibeui-people-011-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="people-011"]{color-scheme:dark}
:where([data-vibeui-block="people-011"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="people-011"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="people-011"]{box-sizing:border-box;display:block;background:var(--vibeui-people-011-bg);color:var(--vibeui-people-011-fg);font-family:var(--vibeui-people-011-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="people-011"] *{box-sizing:border-box}
[data-vibeui-block="people-011"] a{color:inherit;text-decoration:none}
[data-vibeui-block="people-011"] a:focus-visible{outline:2px solid var(--vibeui-people-011-accent);outline-offset:3px;border-radius:.4rem}
[data-vibeui-block="people-011"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4.5rem 1.25rem}
[data-vibeui-block="people-011"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-people-011-display);font-size:.85rem;font-weight:500;letter-spacing:.32em;text-transform:uppercase;color:var(--vibeui-people-011-silver)}
[data-vibeui-block="people-011"] [data-part="title"]{margin:0;font-family:var(--vibeui-people-011-display);font-size:clamp(2.2rem,5.5cqi,3.8rem);font-weight:500;line-height:1.05}
[data-vibeui-block="people-011"] [data-part="lede"]{max-width:36rem;margin:1rem 0 0;color:var(--vibeui-people-011-muted)}
[data-vibeui-block="people-011"] [data-part="grid"]{display:grid;gap:1.25rem;margin:2.5rem 0 0;padding:0;list-style:none}
@keyframes vibeui-people-011-flicker{0%,100%{transform:scaleX(1) scaleY(1)}30%{transform:scaleX(.9) scaleY(1.1)}60%{transform:scaleX(1.05) scaleY(.92)}}
@container (min-width:56rem){
[data-vibeui-block="people-011"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="people-011"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="people-011"] *{animation:none!important;transition:none!important}}`

/** «Кто встречает»: свидетели и организатор в карточках со свечкой — портрет в круге, роль курсивом, контакт; наведение — свечка ярче. */
export function People011({
  eyebrow = "Кто встречает",
  title = "Вас ждут у ворот",
  lede = "По любому вопросу до свадьбы — к ним. Они знают, где парковка, кто с кем сидит и когда фейерверк.",
  people = [
    { name: "Кристина", role: "Свидетельница", text: "Подруга Леры с первого класса. Знает про платья, шали и куда прятать телефоны на церемонии.", contactLabel: "Написать в Telegram", contactHref: "#" },
    { name: "Игорь", role: "Свидетель", text: "Брат Димы. Отвечает за трансферы, дрова и фейерверк — в этом порядке.", contactLabel: "Написать в Telegram", contactHref: "#" },
    { name: "Марина", role: "Организатор", text: "Собирает вечер по минутам. Комнаты, аллергии, детские стулья — это к ней.", contactLabel: "Позвонить", contactHref: "tel:+70000000000" },
  ],
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: People011Props) {
  const palette = {
    ...(accent ? { "--vibeui-people-011-accent": accent } : null),
    ...(ink ? { "--vibeui-people-011-fg": ink } : null),
    ...(background ? { "--vibeui-people-011-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-people-011" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="people-011" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <ul data-part="grid">
            {people.map((person) => (
              <li key={person.name}>
                <Card116 data-part="card" image={person.image} imageAlt={person.imageAlt} name={person.name} role={person.role} text={person.text} contactLabel={person.contactLabel} contactHref={person.contactHref} accent={accent} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
