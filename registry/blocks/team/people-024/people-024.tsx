import type { CSSProperties } from "react"
import { Card060 } from "@/registry/components/card/card-060/card-060"

export type People024Person = {
  name: string
  role: string
  /** Рукописная фраза от человека: «люблю чай и длинные разговоры». */
  quote?: string
  image?: string
  imageAlt?: string
}

export type People024Props = {
  eyebrow?: string
  title?: string
  lede?: string
  people?: readonly People024Person[]
  /** Карточка «и ещё N волонтёров». 0 — не показывать. */
  moreCount?: number
  moreLabel?: string
  moreHref?: string
  /** Инициалы на карточке «ещё N» и подписи к ней. */
  initials?: readonly string[]
  moreCountLine?: string
  joinLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Команда фонда как полароиды на столе: фото в белой рамке с толстым
// низом, имя и роль написаны от руки Caveat, у каждой карточки своя
// ротация и кусок скотча сверху. По наведению карточка выравнивается и
// приподнимается, фото чуть увеличивается. Последняя карточка —
// «и ещё N волонтёров» с кружками-инициалами. Без хуков, всё на CSS.
const FONTS = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;700&display=swap"

const STYLES = `
:where([data-vibeui-block="people-024"]){
--vibeui-people-024-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-people-024-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-024-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-024-on-accent:oklch(from var(--vibeui-people-024-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-people-024-muted:color-mix(in oklab,var(--vibeui-people-024-fg) 62%,var(--vibeui-people-024-bg));
--vibeui-people-024-line:color-mix(in oklab,var(--vibeui-people-024-fg) 16%,transparent);
--vibeui-people-024-soft:color-mix(in oklab,var(--vibeui-people-024-fg) 6%,var(--vibeui-people-024-bg));
--vibeui-people-024-paper:color-mix(in oklab,#ffffff 70%,var(--vibeui-people-024-bg));
--vibeui-people-024-second:color-mix(in oklab,var(--vibeui-people-024-accent) 45%,#e0b000);
--vibeui-people-024-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-people-024-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-people-024-hand:"Caveat","Segoe Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="people-024"]{color-scheme:dark}
:where([data-vibeui-block="people-024"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="people-024"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="people-024"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-people-024-bg);color:var(--vibeui-people-024-fg);font-family:var(--vibeui-people-024-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="people-024"] *{box-sizing:border-box}
[data-vibeui-block="people-024"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="people-024"] [data-part="head"]{max-width:40rem}
[data-vibeui-block="people-024"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.8rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-people-024-accent)}
[data-vibeui-block="people-024"] [data-part="title"]{margin:0;font-family:var(--vibeui-people-024-display);font-weight:500;font-size:clamp(2rem,4.6cqi,3.4rem);line-height:1.08;letter-spacing:-.02em}
[data-vibeui-block="people-024"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-people-024-muted)}
[data-vibeui-block="people-024"] [data-part="grid"]{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr));gap:2.5rem 1.6rem;margin:3.5rem 0 0;padding:0 .5rem;list-style:none}
[data-vibeui-block="people-024"] [data-part="more"]{display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:1rem;padding:1.5rem;border:1px dashed var(--vibeui-people-024-line);border-radius:1rem;text-decoration:none;color:inherit;transition:border-color .2s,background .2s}
[data-vibeui-block="people-024"] [data-part="more"]:hover{border-color:var(--vibeui-people-024-accent);background:var(--vibeui-people-024-soft)}
[data-vibeui-block="people-024"] [data-part="more"]:focus-visible{outline:2px solid var(--vibeui-people-024-accent);outline-offset:2px}
[data-vibeui-block="people-024"] [data-part="stack"]{display:flex}
[data-vibeui-block="people-024"] [data-part="stack"] i{width:2.4rem;height:2.4rem;margin-left:-.6rem;border-radius:50%;border:2px solid var(--vibeui-people-024-bg);background:var(--vibeui-people-024-soft);color:var(--vibeui-people-024-fg);display:grid;place-items:center;font-family:var(--vibeui-people-024-hand);font-style:normal;font-weight:700;font-size:1.05rem}
[data-vibeui-block="people-024"] [data-part="stack"] i:first-child{margin-left:0}
[data-vibeui-block="people-024"] [data-part="stack"] i:nth-child(2n){background:color-mix(in oklab,var(--vibeui-people-024-accent) 22%,var(--vibeui-people-024-bg))}
[data-vibeui-block="people-024"] [data-part="stack"] i:last-child{background:var(--vibeui-people-024-accent);color:var(--vibeui-people-024-on-accent)}
[data-vibeui-block="people-024"] [data-part="more"] strong{font-family:var(--vibeui-people-024-display);font-weight:700;font-size:2.4rem;line-height:1;letter-spacing:-.02em}
[data-vibeui-block="people-024"] [data-part="more"] span{font-size:.95rem;color:var(--vibeui-people-024-muted)}
[data-vibeui-block="people-024"] [data-part="more"] em{font-family:var(--vibeui-people-024-hand);font-style:normal;font-size:1.3rem;color:var(--vibeui-people-024-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="people-024"] *{animation:none!important;transition:none!important}}`

const DEFAULT_PEOPLE: People024Person[] = [
  { name: "Марина Соколова", role: "Директор фонда", quote: "«Начала с одной бабушки в своём подъезде. Было в 2018-м.»" },
  { name: "Игорь Лапин", role: "Логистика и ремонты", quote: "«Знаю все дороги области и где подешевле краны.»" },
  { name: "Катя Рябова", role: "Старший соцработник", quote: "«Мои среды — это Нина Петровна, чай и давление.»" },
]

/** Команда фонда полароидами с рукописными подписями. */
export function People024({
  eyebrow = "Команда",
  title = "Нас мало, и мы все с именами",
  lede = "Пять человек в штате, сорок волонтёров, один старый «Ларгус». Каждого можно найти в отчёте, каждому можно позвонить.",
  people = DEFAULT_PEOPLE,
  moreCount = 40,
  moreLabel = "волонтёров, которых мы обнимаем",
  moreHref = "#volunteer",
  initials = ["АН", "ЛВ", "СМ", "ЮК"],
  moreCountLine = "ещё {n}",
  joinLabel = "стать одним из них →",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: People024Props) {
  const palette = {
    ...(accent ? { "--vibeui-people-024-accent": accent } : null),
    ...(ink ? { "--vibeui-people-024-fg": ink } : null),
    ...(background ? { "--vibeui-people-024-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-people-024" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="people-024" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <ul data-part="grid">
            {people.map((person) => (
              <Card060 key={person.name} data-part="card" name={person.name} image={person.image} imageAlt={person.imageAlt} role={person.role} quote={person.quote} accent={accent} />
            ))}
            {moreCount > 0 ? (
              <li>
                <a data-part="more" href={moreHref}>
                  <span data-part="stack" aria-hidden="true">
                    {initials.map((initial) => (
                      <i key={initial}>{initial}</i>
                    ))}
                    <i>+</i>
                  </span>
                  <strong>{moreCountLine.replace("{n}", String(moreCount))}</strong>
                  <span>{moreLabel}</span>
                  <em>{joinLabel}</em>
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </section>
    </>
  )
}
