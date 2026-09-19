import type { CSSProperties } from "react"

export type About017Photo = {
  src: string
  alt: string
  /** Рукописная подпись под снимком. */
  caption?: string
}

export type About017Person = {
  name: string
  role: string
  image: string
  alt?: string
  /** Одна фраза от первого лица. */
  quote: string
}

export type About017Props = {
  eyebrow?: string
  title?: string
  /** Абзацы истории; первый начинается с буквицы. */
  paragraphs?: readonly string[]
  /** Два снимка мастерской: большой и маленький, «приклеенный» сверху. */
  photos?: readonly About017Photo[]
  facts?: readonly { value: string; label: string }[]
  peopleTitle?: string
  people?: readonly About017Person[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// О мастерской как разворот ботанического журнала: слева большой снимок и
// второй поменьше, наклеенный поверх с наклоном и рукописной подписью;
// справа текст с буквицей и три факта в колонке. Ниже флористы —
// «полароиды» с рукописным именем и фразой от первого лица. Всё
// появляется по мере прокрутки через animation-timeline: view() — там,
// где не поддерживается, просто видно сразу. Серверный, без JS.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="about-017"]){
--vibeui-about-017-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-about-017-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-about-017-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-about-017-muted:color-mix(in oklab,var(--vibeui-about-017-fg) 62%,var(--vibeui-about-017-bg));
--vibeui-about-017-line:color-mix(in oklab,var(--vibeui-about-017-fg) 16%,transparent);
--vibeui-about-017-paper:color-mix(in oklab,var(--vibeui-about-017-fg) 5%,var(--vibeui-about-017-bg));
--vibeui-about-017-display:"Cormorant",Georgia,"Times New Roman",serif;
--vibeui-about-017-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-about-017-hand:"Caveat","Segoe Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="about-017"]{color-scheme:dark}
:where([data-vibeui-block="about-017"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="about-017"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="about-017"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-about-017-bg);color:var(--vibeui-about-017-fg);font-family:var(--vibeui-about-017-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="about-017"] *{box-sizing:border-box}
[data-vibeui-block="about-017"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="about-017"] [data-part="spread"]{display:grid;gap:3rem;align-items:start}
[data-vibeui-block="about-017"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.74rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-about-017-muted)}
[data-vibeui-block="about-017"] [data-part="title"]{margin:0 0 1.6rem;font-family:var(--vibeui-about-017-display);font-weight:500;font-size:clamp(2.2rem,5.4cqi,4.2rem);line-height:1;letter-spacing:-.02em}
[data-vibeui-block="about-017"] [data-part="text"] p{margin:0 0 1rem;max-width:34rem}
[data-vibeui-block="about-017"] [data-part="text"] h2 + p::first-letter{float:left;margin:.1em .12em 0 0;font-family:var(--vibeui-about-017-display);font-weight:600;font-size:4.2em;line-height:.8;color:var(--vibeui-about-017-accent)}
[data-vibeui-block="about-017"] [data-part="facts"]{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem;margin:2rem 0 0;padding:1.4rem 0 0;border-top:1px solid var(--vibeui-about-017-line);list-style:none}
[data-vibeui-block="about-017"] [data-part="facts"] b{display:block;font-family:var(--vibeui-about-017-display);font-weight:600;font-size:2rem;line-height:1;letter-spacing:-.02em}
[data-vibeui-block="about-017"] [data-part="facts"] span{display:block;margin-top:.3rem;font-size:.8rem;color:var(--vibeui-about-017-muted)}
[data-vibeui-block="about-017"] [data-part="collage"]{position:relative;padding:0 0 3.5rem 0}
[data-vibeui-block="about-017"] [data-part="big"]{margin:0;width:88%;aspect-ratio:4/5;overflow:hidden;border-radius:.4rem;background:var(--vibeui-about-017-paper)}
[data-vibeui-block="about-017"] [data-part="small"]{position:absolute;right:0;bottom:0;width:48%;margin:0;padding:.55rem .55rem 2.4rem;background:var(--vibeui-about-017-bg);box-shadow:0 20px 40px -20px rgb(0 0 0 / .5);transform:rotate(3deg)}
[data-vibeui-block="about-017"] [data-part="small"] div{aspect-ratio:1;overflow:hidden;background:var(--vibeui-about-017-paper)}
[data-vibeui-block="about-017"] [data-part="collage"] img{display:block;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="about-017"] [data-part="caption"]{position:absolute;left:.6rem;right:.6rem;bottom:.5rem;font-family:var(--vibeui-about-017-hand);font-size:1.25rem;line-height:1.1;color:var(--vibeui-about-017-fg);text-align:center}
[data-vibeui-block="about-017"] [data-part="tape"]{position:absolute;left:50%;top:-.7rem;width:5rem;height:1.4rem;transform:translateX(-50%) rotate(-4deg);background:color-mix(in oklab,var(--vibeui-about-017-accent) 35%,var(--vibeui-about-017-bg));opacity:.85}
[data-vibeui-block="about-017"] [data-part="bigcap"]{position:absolute;left:0;bottom:.4rem;max-width:40%;font-family:var(--vibeui-about-017-hand);font-size:1.3rem;line-height:1.05;color:var(--vibeui-about-017-accent);transform:rotate(-3deg)}
[data-vibeui-block="about-017"] [data-part="people"]{margin:4rem 0 0}
[data-vibeui-block="about-017"] [data-part="people"] h3{margin:0 0 1.4rem;font-family:var(--vibeui-about-017-display);font-weight:500;font-size:1.9rem;line-height:1;letter-spacing:-.02em}
[data-vibeui-block="about-017"] [data-part="cards"]{display:grid;gap:1.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="about-017"] [data-part="card"]{display:grid;grid-template-columns:7rem minmax(0,1fr);gap:1.2rem;align-items:start}
[data-vibeui-block="about-017"] [data-part="polaroid"]{margin:0;padding:.4rem .4rem 1.8rem;background:var(--vibeui-about-017-bg);box-shadow:0 14px 30px -18px rgb(0 0 0 / .5);border:1px solid var(--vibeui-about-017-line);transform:rotate(var(--vibeui-about-017-r));transition:transform .4s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="about-017"] [data-part="card"]:hover [data-part="polaroid"]{transform:rotate(0) scale(1.03)}
[data-vibeui-block="about-017"] [data-part="polaroid"] div{aspect-ratio:4/5;overflow:hidden;background:var(--vibeui-about-017-paper)}
[data-vibeui-block="about-017"] [data-part="polaroid"] img{display:block;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="about-017"] [data-part="polaroid"] figcaption{margin:.4rem 0 -1.4rem;font-family:var(--vibeui-about-017-hand);font-size:1.15rem;line-height:1;text-align:center}
[data-vibeui-block="about-017"] [data-part="who"]{margin:0;font-family:var(--vibeui-about-017-display);font-weight:600;font-size:1.4rem;line-height:1.1}
[data-vibeui-block="about-017"] [data-part="role"]{margin:.2rem 0 .6rem;font-size:.82rem;color:var(--vibeui-about-017-muted)}
[data-vibeui-block="about-017"] [data-part="quote"]{margin:0;font-family:var(--vibeui-about-017-display);font-style:italic;font-size:1.2rem;line-height:1.3}
[data-vibeui-block="about-017"] [data-part="quote"]::before{content:"«"}
[data-vibeui-block="about-017"] [data-part="quote"]::after{content:"»"}
@supports (animation-timeline: view()){
[data-vibeui-block="about-017"] [data-part="collage"],[data-vibeui-block="about-017"] [data-part="text"],[data-vibeui-block="about-017"] [data-part="card"]{animation:vibeui-about-017-in linear both;animation-timeline:view();animation-range:entry 0% entry 45%}
}
@keyframes vibeui-about-017-in{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
@container (min-width: 40rem){[data-vibeui-block="about-017"] [data-part="cards"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 60rem){[data-vibeui-block="about-017"] [data-part="spread"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:4rem}[data-vibeui-block="about-017"] [data-part="collage"]{position:sticky;top:5.5rem}[data-vibeui-block="about-017"] [data-part="people"]{margin-top:5rem}[data-vibeui-block="about-017"] [data-part="cards"]{grid-template-columns:repeat(3,minmax(0,1fr))}[data-vibeui-block="about-017"] [data-part="card"]{grid-template-columns:8rem minmax(0,1fr)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="about-017"] *{animation:none!important;transition:none!important}}`

const DEFAULT_PHOTOS: About017Photo[] = [
  { src: "/demo/flowers/workshop-01.webp", alt: "Рабочий стол мастерской: вёдра с цветами, крафтовая бумага, секатор", caption: "стол №2, утро" },
  { src: "/demo/flowers/workshop-02.webp", alt: "Руки флориста подрезают стебли пионов", caption: "подрезаем каждые два дня" },
]

const DEFAULT_PEOPLE: About017Person[] = [
  { name: "Вера Лапина", role: "основатель, флорист", image: "/demo/flowers/florist-01.webp", quote: "Букет должен пахнуть садом, а не магазином." },
  { name: "Гриша Ольхин", role: "флорист, закупки", image: "/demo/flowers/florist-02.webp", quote: "Я езжу на ферму по вторникам и выбираю сам." },
]

/** О мастерской: коллаж из снимков, буквица, факты и полароиды флористов. */
export function About017({
  eyebrow = "Мастерская",
  title = "Двенадцать лет на Пестеля",
  paragraphs = [
    "Стебель открылся в 2014-м в бывшей аптеке на Пестеля, 4: с тех пор здесь те же кафельные стены, тот же дубовый прилавок и всё тот же принцип — никакого целлофана, никаких крашеных роз и ничего, что не пахнет.",
    "Цветы приезжают три раза в неделю: с двух ферм в Ленобласти летом и из Голландии зимой. Мы не держим склад: то, что стоит на витрине, срезано вчера, и мы честно пишем, сколько простоит.",
    "В мастерской работают пять флористов. Каждый собирает букет от начала до конца — и подписывает открытку своим именем.",
  ],
  photos = DEFAULT_PHOTOS,
  facts = [
    { value: "2014", label: "год открытия" },
    { value: "3 / нед", label: "поставки с ферм" },
    { value: "5", label: "флористов" },
  ],
  peopleTitle = "Кто собирает",
  people = DEFAULT_PEOPLE,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: About017Props) {
  const palette = {
    ...(accent ? { "--vibeui-about-017-accent": accent } : null),
    ...(ink ? { "--vibeui-about-017-fg": ink } : null),
    ...(background ? { "--vibeui-about-017-bg": background } : null),
    ...style,
  } as CSSProperties

  const [big, small] = photos

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-about-017" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="about-017" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="spread">
            <div data-part="collage">
              {big ? (
                <figure data-part="big">
                  <img src={big.src} alt={big.alt} loading="lazy" />
                </figure>
              ) : null}
              {big?.caption ? (
                <span data-part="bigcap" aria-hidden="true">
                  {big.caption}
                </span>
              ) : null}
              {small ? (
                <figure data-part="small">
                  <i data-part="tape" aria-hidden="true" />
                  <div>
                    <img src={small.src} alt={small.alt} loading="lazy" />
                  </div>
                  {small.caption ? <figcaption data-part="caption">{small.caption}</figcaption> : null}
                </figure>
              ) : null}
            </div>
            <div data-part="text">
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {facts.length > 0 ? (
                <ul data-part="facts">
                  {facts.map((fact) => (
                    <li key={fact.label}>
                      <b>{fact.value}</b>
                      <span>{fact.label}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
          {people.length > 0 ? (
            <div data-part="people">
              <h3>{peopleTitle}</h3>
              <ul data-part="cards">
                {people.map((person, index) => (
                  <li key={person.name} data-part="card">
                    <figure data-part="polaroid" style={{ ["--vibeui-about-017-r" as string]: `${index % 2 ? 2.5 : -2.5}deg` }}>
                      <div>
                        <img src={person.image} alt={person.alt ?? person.name} loading="lazy" />
                      </div>
                      <figcaption>{person.name.split(" ")[0]}</figcaption>
                    </figure>
                    <div>
                      <p data-part="who">{person.name}</p>
                      <p data-part="role">{person.role}</p>
                      <p data-part="quote">{person.quote}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
