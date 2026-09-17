import type { CSSProperties } from "react"

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
[data-vibeui-block="people-011"] [data-part="card"]{position:relative;display:grid;grid-template-columns:5.5rem minmax(0,1fr);gap:.2rem 1.2rem;align-items:start;padding:1.4rem;border:1px solid var(--vibeui-people-011-line);border-radius:1rem;background:var(--vibeui-people-011-card);overflow:hidden;transition:border-color .4s,box-shadow .4s,transform .4s cubic-bezier(.2,.9,.3,1)}
[data-vibeui-block="people-011"] [data-part="card"]::before{content:"";position:absolute;inset:0;background:radial-gradient(30% 40% at 0 0,rgb(242 238 230 / .08),transparent 70%);pointer-events:none}
[data-vibeui-block="people-011"] [data-part="card"]:hover{transform:translateY(-.25rem);border-color:rgb(242 182 79 / .45);box-shadow:0 0 0 1px rgb(242 182 79 / .12),0 30px 50px -30px rgb(242 182 79 / .4)}
[data-vibeui-block="people-011"] [data-part="pic"]{grid-row:span 4;position:relative;display:block;width:5.5rem;height:5.5rem;border-radius:50%;overflow:hidden;background:var(--vibeui-people-011-bg);box-shadow:0 0 0 2px var(--vibeui-people-011-card),0 0 0 3px var(--vibeui-people-011-silver)}
[data-vibeui-block="people-011"] [data-part="pic"] img{display:block;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="people-011"] [data-part="candle"]{position:absolute;right:1.4rem;top:1.2rem;width:.7rem;height:1.5rem;border-radius:.15rem .15rem .1rem .1rem;background:linear-gradient(90deg,#e9e2d3,#fff9ea 40%,#d9d0bd)}
[data-vibeui-block="people-011"] [data-part="candle"]::before{content:"";position:absolute;left:50%;top:-.5rem;width:.12rem;height:.5rem;margin-left:-.06rem;background:#2a2118}
[data-vibeui-block="people-011"] [data-part="candle"]::after{content:"";position:absolute;left:50%;top:-1.25rem;width:.5rem;height:.85rem;margin-left:-.25rem;border-radius:50% 50% 45% 45%;background:radial-gradient(50% 60% at 50% 70%,#fff6d6,var(--vibeui-people-011-fire) 55%,transparent 80%);box-shadow:0 0 12px 3px rgb(255 154 60 / .4);transform-origin:50% 100%;animation:vibeui-people-011-flicker 1.5s ease-in-out infinite;transition:box-shadow .4s}
[data-vibeui-block="people-011"] [data-part="card"]:hover [data-part="candle"]::after{box-shadow:0 0 22px 8px rgb(255 154 60 / .55)}
@keyframes vibeui-people-011-flicker{0%,100%{transform:scaleX(1) scaleY(1)}30%{transform:scaleX(.9) scaleY(1.1)}60%{transform:scaleX(1.05) scaleY(.92)}}
[data-vibeui-block="people-011"] [data-part="name"]{margin:0;padding-right:2rem;font-family:var(--vibeui-people-011-display);font-size:1.7rem;font-weight:500;line-height:1.1}
[data-vibeui-block="people-011"] [data-part="role"]{font-family:var(--vibeui-people-011-script);font-size:1.15rem;color:var(--vibeui-people-011-accent)}
[data-vibeui-block="people-011"] [data-part="text"]{margin:.4rem 0 0;font-size:.92rem;color:var(--vibeui-people-011-muted)}
[data-vibeui-block="people-011"] [data-part="contact"]{display:inline-flex;align-items:center;gap:.45rem;margin-top:.8rem;width:max-content;font-family:var(--vibeui-people-011-display);font-size:.98rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--vibeui-people-011-silver);border-bottom:1px solid var(--vibeui-people-011-line);transition:color .25s,border-color .25s}
[data-vibeui-block="people-011"] [data-part="contact"]:hover{color:var(--vibeui-people-011-accent);border-color:var(--vibeui-people-011-accent)}
[data-vibeui-block="people-011"] [data-part="contact"] svg{width:1rem;height:1rem;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
@container (min-width:56rem){
[data-vibeui-block="people-011"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="people-011"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
[data-vibeui-block="people-011"] [data-part="card"]{grid-template-columns:1fr;justify-items:center;text-align:center;padding:2rem 1.5rem 1.6rem}
[data-vibeui-block="people-011"] [data-part="pic"]{grid-row:auto;width:7rem;height:7rem;margin-bottom:.6rem}
[data-vibeui-block="people-011"] [data-part="name"]{padding-right:0}
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
                <article data-part="card">
                  <i data-part="candle" aria-hidden="true" />
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
