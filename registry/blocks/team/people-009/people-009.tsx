import type { CSSProperties } from "react"
import { Card056 } from "@/registry/components/card/card-056/card-056"

export type People009Artist = {
  name: string
  /** Стили через запятую или список. */
  styles: readonly string[]
  /** «12 лет». */
  experience?: string
  image?: string
  /** Три работы на обороте. */
  works?: readonly string[]
  /** «ближайшее окно — 21 сентября». */
  slot?: string
  /** Цвет неоновой обводки. */
  color?: string
  href?: string
}

export type People009Props = {
  eyebrow?: string
  title?: string
  lede?: string
  artists?: readonly People009Artist[]
  bookLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Мастера: карточки-«полароиды» с неоновой обводкой своего цвета. Портрет
// сверху, имя подписано под ним, стили капсулами, опыт и ближайшее окно.
// При наведении карточка поворачивается в 3D (rotateY) и на обороте
// показывает три работы мастера и кнопку записи; на клавиатуре — по
// фокусу. Появление каскадом. Серверный, без состояния.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap"

const STYLES = `
:where([data-vibeui-block="people-009"]){
--vibeui-people-009-bg:#07060b;
--vibeui-people-009-fg:#f3eefc;
--vibeui-people-009-muted:#a39bb5;
--vibeui-people-009-line:rgb(255 255 255 / .12);
--vibeui-people-009-card:#110e1a;
--vibeui-people-009-accent:#ff2bd6;
--vibeui-people-009-cyan:#22f3ff;
--vibeui-people-009-ok:#c8ff3a;
--vibeui-people-009-on-accent:#15121c;
--vibeui-people-009-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-people-009-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-people-009-mono:"JetBrains Mono",ui-monospace,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="people-009"]{color-scheme:dark}
:where([data-vibeui-block="people-009"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="people-009"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="people-009"]{box-sizing:border-box;display:block;background:var(--vibeui-people-009-bg);color:var(--vibeui-people-009-fg);font-family:var(--vibeui-people-009-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="people-009"] *{box-sizing:border-box}
[data-vibeui-block="people-009"] a{color:inherit;text-decoration:none}
[data-vibeui-block="people-009"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="people-009"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 .75rem;font-family:var(--vibeui-people-009-mono);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-people-009-cyan);text-shadow:0 0 10px color-mix(in oklab,var(--vibeui-people-009-cyan) 70%,transparent)}
[data-vibeui-block="people-009"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-people-009-cyan);box-shadow:0 0 8px var(--vibeui-people-009-cyan)}
[data-vibeui-block="people-009"] [data-part="title"]{margin:0;font-family:var(--vibeui-people-009-display);font-size:clamp(1.8rem,3.8cqi,2.8rem);font-weight:700;line-height:1.05;letter-spacing:-.02em;text-transform:uppercase}
[data-vibeui-block="people-009"] [data-part="lede"]{margin:.75rem 0 2rem;max-width:36rem;color:var(--vibeui-people-009-muted)}
[data-vibeui-block="people-009"] [data-part="grid"]{display:grid;grid-template-columns:repeat(auto-fill,minmax(15rem,1fr));gap:1.25rem;margin:0;padding:0;list-style:none}
@keyframes vibeui-people-009-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@container (min-width: 64rem){[data-vibeui-block="people-009"] [data-part="shell"]{padding:5.5rem 2rem}[data-vibeui-block="people-009"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr));gap:1.5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="people-009"] *{animation:none!important;transition:none!important}}`

const P = "/demo/tattoo"

const DEFAULT_ARTISTS: People009Artist[] = [
  { name: "Ася", styles: ["олд-скул", "нео-традишнл"], experience: "9 лет", image: `${P}/artist-01.webp`, works: [`${P}/work-02.webp`, `${P}/work-08.webp`, `${P}/work-05.webp`], slot: "окно 21 сен", color: "#ff2bd6", href: "#booking" },
  { name: "Марк", styles: ["реализм", "чёрно-серый"], experience: "14 лет", image: `${P}/artist-02.webp`, works: [`${P}/work-01.webp`, `${P}/work-06.webp`, `${P}/work-12.webp`], slot: "окно 3 окт", color: "#8b5cff", href: "#booking" },
  { name: "Тимур", styles: ["графика", "орнамент"], experience: "7 лет", image: `${P}/artist-03.webp`, works: [`${P}/work-04.webp`, `${P}/work-10.webp`, `${P}/work-07.webp`], slot: "окно 24 сен", color: "#22f3ff", href: "#booking" },
  { name: "Лина", styles: ["минимализм", "акварель"], experience: "5 лет", image: `${P}/artist-04.webp`, works: [`${P}/work-03.webp`, `${P}/work-09.webp`, `${P}/work-11.webp`], slot: "окно завтра", color: "#c8ff3a", href: "#booking" },
]

/** Мастера тату-студии: полароиды с неоновой обводкой, переворачиваются и показывают работы. */
export function People009({
  eyebrow = "Мастера",
  title = "Четыре руки, четыре почерка",
  lede = "Каждый работает в своём стиле и не берётся за чужой: так работа выходит лучше, а вы попадаете к тому, кто именно это и любит.",
  artists = DEFAULT_ARTISTS,
  bookLabel = "Записаться",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: People009Props) {
  const palette = {
    ...(accent ? { "--vibeui-people-009-accent": accent } : null),
    ...(background ? { "--vibeui-people-009-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-people-009" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="people-009" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <ul data-part="grid">
            {artists.map((artist, index) => (
              <Card056 key={artist.name} data-part="scene" name={artist.name} color={artist.color} image={artist.image} styles={artist.styles} experience={artist.experience} slot={artist.slot} works={artist.works} href={artist.href} bookLabel={bookLabel} index={index} accent={accent} />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
