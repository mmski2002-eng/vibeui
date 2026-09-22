import type { CSSProperties } from "react"
import { Card120 } from "@/registry/components/card/card-120/card-120"

export type Event007Venue = {
  name: string
  /** Что здесь происходит. */
  text?: string
  image?: string
  imageAlt?: string
  /** Цвет рамки карточки. */
  color: string
  /** Факты: «2 000 мест», «навес от дождя». */
  facts?: readonly string[]
  /** Направления на площадке. */
  tags?: readonly string[]
  href?: string
}

export type Event007Props = {
  eyebrow?: string
  title?: string
  lede?: string
  venues?: readonly Event007Venue[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Площадки фестиваля: карточки в цветной рамке — снаружи заливка цветом
// площадки, внутри белая карточка с названием, описанием и фактами, справа
// вкладка-фото со скруглением. По наведению фото приподнимается и чуть
// поворачивается, рамка растёт. Серверный, без состояния.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="event-007"]){
--vibeui-event-007-bg:light-dark(#ffffff,#0e0f12);
--vibeui-event-007-fg:light-dark(#111111,#f4f4f5);
--vibeui-event-007-muted:light-dark(#6b6b70,#a1a1aa);
--vibeui-event-007-card:light-dark(#ffffff,#15161b);
--vibeui-event-007-line:light-dark(#e8e8ea,#26272d);
--vibeui-event-007-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-event-007-on-accent:oklch(from var(--vibeui-event-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-event-007-display:"Inter Tight","Inter",ui-sans-serif,system-ui,sans-serif;
--vibeui-event-007-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="event-007"]{color-scheme:dark}
:where([data-vibeui-block="event-007"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="event-007"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="event-007"]{box-sizing:border-box;display:block;background:var(--vibeui-event-007-bg);color:var(--vibeui-event-007-fg);font-family:var(--vibeui-event-007-font);font-size:1rem;line-height:1.4}
[data-vibeui-block="event-007"] *{box-sizing:border-box}
[data-vibeui-block="event-007"] a{color:inherit;text-decoration:none}
[data-vibeui-block="event-007"] a:focus-visible{outline:2px solid var(--vibeui-event-007-fg);outline-offset:3px;border-radius:.5rem}
[data-vibeui-block="event-007"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:2rem 1.25rem 3rem}
[data-vibeui-block="event-007"] [data-part="eyebrow"]{margin:0;padding-top:1.25rem;border-top:1px solid var(--vibeui-event-007-line);font-size:1.05rem}
[data-vibeui-block="event-007"] [data-part="title"]{margin:.5rem 0 0;font-family:var(--vibeui-event-007-display);font-size:clamp(1.6rem,3.4cqi,2.4rem);font-weight:600;letter-spacing:-.03em;line-height:1.1}
[data-vibeui-block="event-007"] [data-part="lede"]{margin:.5rem 0 1.5rem;max-width:36rem;color:var(--vibeui-event-007-muted)}
[data-vibeui-block="event-007"] [data-part="grid"]{display:grid;gap:1rem;margin:0;padding:0;list-style:none}
@keyframes vibeui-event-007-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@container (min-width: 44rem){[data-vibeui-block="event-007"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 68rem){
[data-vibeui-block="event-007"] [data-part="shell"]{padding:2.5rem 2rem 4rem}
[data-vibeui-block="event-007"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="event-007"] *{animation:none!important;transition:none!important}}`

const P = "/demo/festival"

const DEFAULT_VENUES: Event007Venue[] = [
  { name: "Главная сцена", text: "Сцена на понтонах посреди пруда, зрители — на склоне и на воде.", image: `${P}/venue-01.webp`, color: "#c2df37", facts: ["4 000 мест", "лайв-экраны", "навес от дождя"], tags: ["#Музыка", "#Ночь"], href: "#" },
  { name: "Фуд-корт", text: "Длинные столы под зонтами, 24 кухни и бар с местными пивоварнями.", image: `${P}/venue-02.webp`, color: "#ffe2d6", facts: ["12:00–23:00", "безнал", "веган-ряд"], tags: ["#Еда", "#Воркшопы"], href: "#" },
  { name: "Лекторий", text: "Белый шатёр с открытыми стенами: лекции, дискуссии и кино днём.", image: `${P}/venue-03.webp`, color: "#d9cafe", facts: ["300 мест", "перевод РЖЯ", "бесплатно"], tags: ["#Лекции", "#Кино"], href: "#" },
  { name: "Детская поляна", text: "Надувной городок, мастерские и тихая зона для самых маленьких.", image: `${P}/venue-04.webp`, color: "#98f5af", facts: ["0+", "пеленальные", "аниматоры"], tags: ["#Дети", "#Воркшопы"], href: "#" },
]

/** Площадки фестиваля: карточки в цветной рамке с фото-вкладкой и фактами. */
export function Event007({
  eyebrow = "Площадки",
  title = "Шесть точек на карте парка",
  lede = "Между любыми двумя — не больше семи минут пешком. Везде есть вода, туалеты и навигация.",
  venues = DEFAULT_VENUES,
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Event007Props) {
  const palette = {
    ...(accent ? { "--vibeui-event-007-accent": accent } : null),
    ...(background ? { "--vibeui-event-007-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-event-007" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="event-007" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <ul data-part="grid">
            {venues.map((venue, index) => (
              <Card120 key={venue.name} data-part="frame" name={venue.name} href={venue.href} text={venue.text} facts={venue.facts} tags={venue.tags} image={venue.image} imageAlt={venue.imageAlt} style={{ ["--vibeui-event-007-color" as string]: venue.color, ["--vibeui-event-007-n" as string]: index }} accent={accent} />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
