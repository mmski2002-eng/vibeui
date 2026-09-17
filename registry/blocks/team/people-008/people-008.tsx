import type { CSSProperties } from "react"

export type People008Person = {
  name: string
  role: string
  image?: string
  /** Раскрывается по наведению и фокусу. */
  text?: string
  /** Цвет подложки карточки. */
  color: string
  ink?: string
  /** Направление: «#Музыка». */
  tag?: string
  /** «сб, 20:00 · Главная сцена». */
  when?: string
  href?: string
}

export type People008Props = {
  eyebrow?: string
  title?: string
  people?: readonly People008Person[]
  moreLabel?: string
  moreHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Хедлайнеры и спикеры: карточки на цветных подложках, портрет кружком,
// имя крупно, роль и когда выступает. По наведению или фокусу карточка
// выдвигает снизу шторку с описанием поверх содержимого (transform,
// высота карточки не меняется — сетка не дёргается), портрет чуть
// поворачивается. Сетка 2/3 колонки, карточки появляются каскадом.
// Серверный, без состояния.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="people-008"]){
--vibeui-people-008-bg:light-dark(#ffffff,#0e0f12);
--vibeui-people-008-fg:light-dark(#111111,#f4f4f5);
--vibeui-people-008-muted:light-dark(#6b6b70,#a1a1aa);
--vibeui-people-008-line:light-dark(#e8e8ea,#26272d);
--vibeui-people-008-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-008-on-accent:oklch(from var(--vibeui-people-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-people-008-display:"Inter Tight","Inter",ui-sans-serif,system-ui,sans-serif;
--vibeui-people-008-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="people-008"]{color-scheme:dark}
:where([data-vibeui-block="people-008"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="people-008"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="people-008"]{box-sizing:border-box;display:block;background:var(--vibeui-people-008-bg);color:var(--vibeui-people-008-fg);font-family:var(--vibeui-people-008-font);font-size:1rem;line-height:1.4}
[data-vibeui-block="people-008"] *{box-sizing:border-box}
[data-vibeui-block="people-008"] a{color:inherit;text-decoration:none}
[data-vibeui-block="people-008"] a:focus-visible{outline:2px solid var(--vibeui-people-008-fg);outline-offset:3px;border-radius:.5rem}
[data-vibeui-block="people-008"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:2rem 1.25rem 3rem}
[data-vibeui-block="people-008"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:.5rem 1rem;padding-top:1.25rem;border-top:1px solid var(--vibeui-people-008-line)}
[data-vibeui-block="people-008"] [data-part="eyebrow"]{margin:0;font-size:1.05rem}
[data-vibeui-block="people-008"] [data-part="more"]{color:var(--vibeui-people-008-muted);transition:color .2s}
[data-vibeui-block="people-008"] [data-part="more"]:hover{color:var(--vibeui-people-008-fg)}
[data-vibeui-block="people-008"] [data-part="title"]{margin:.5rem 0 1.5rem;font-family:var(--vibeui-people-008-display);font-size:clamp(1.6rem,3.4cqi,2.4rem);font-weight:600;letter-spacing:-.03em;line-height:1.1}
[data-vibeui-block="people-008"] [data-part="grid"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.9rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="people-008"] [data-part="card"]{position:relative;display:grid;gap:.9rem;padding:1.1rem;border-radius:1.4rem;overflow:hidden;isolation:isolate;background:var(--vibeui-people-008-card);color:var(--vibeui-people-008-ink,#111);animation:vibeui-people-008-in .55s cubic-bezier(.2,.9,.3,1.2) both;animation-delay:calc(var(--vibeui-people-008-n) * 60ms);transition:transform .35s cubic-bezier(.2,.9,.3,1.3),box-shadow .35s}
@keyframes vibeui-people-008-in{from{opacity:0;transform:scale(.92) translateY(10px)}to{opacity:1;transform:none}}
[data-vibeui-block="people-008"] [data-part="card"]:hover,[data-vibeui-block="people-008"] [data-part="card"]:focus-within{transform:translateY(-4px);box-shadow:0 24px 40px -26px rgb(0 0 0 / .4)}
[data-vibeui-block="people-008"] [data-part="top"]{display:flex;align-items:center;justify-content:space-between;gap:.75rem}
[data-vibeui-block="people-008"] [data-part="avatar"]{width:4.5rem;height:4.5rem;border-radius:50%;object-fit:cover;flex:none;background:rgb(0 0 0 / .1);border:3px solid rgb(255 255 255 / .6);transition:transform .45s cubic-bezier(.2,.9,.3,1.3)}
[data-vibeui-block="people-008"] [data-part="card"]:hover [data-part="avatar"]{transform:rotate(-8deg) scale(1.06)}
[data-vibeui-block="people-008"] [data-part="tag"]{padding:.25rem .65rem;border-radius:999px;background:rgb(255 255 255 / .55);color:#111;font-size:.75rem;font-weight:600}
[data-vibeui-block="people-008"] [data-part="card"][data-dark="true"] [data-part="tag"]{background:rgb(0 0 0 / .3);color:#fff}
[data-vibeui-block="people-008"] [data-part="name"]{margin:0;font-family:var(--vibeui-people-008-display);font-size:1.35rem;font-weight:600;line-height:1.15;letter-spacing:-.02em}
[data-vibeui-block="people-008"] [data-part="role"]{margin:.2rem 0 0;font-size:.92rem;opacity:.8}
[data-vibeui-block="people-008"] [data-part="when"]{margin:.5rem 0 0;font-size:.85rem;font-weight:500;opacity:.9}
[data-vibeui-block="people-008"] [data-part="reveal"]{position:absolute;left:0;right:0;bottom:0;z-index:1;padding:1rem 1.1rem 1.1rem;background:var(--vibeui-people-008-card);box-shadow:0 -12px 24px -16px rgb(0 0 0 / .35);transform:translateY(102%);transition:transform .45s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="people-008"] [data-part="card"]:hover [data-part="reveal"],[data-vibeui-block="people-008"] [data-part="card"]:focus-within [data-part="reveal"]{transform:none}
[data-vibeui-block="people-008"] [data-part="reveal"]>p{margin:0;font-size:.92rem;line-height:1.45}
[data-vibeui-block="people-008"] [data-part="reveal"]>p span{display:block;padding-top:.7rem;border-top:1px solid rgb(0 0 0 / .14)}
[data-vibeui-block="people-008"] [data-part="card"][data-dark="true"] [data-part="reveal"]>p span{border-color:rgb(255 255 255 / .25)}
[data-vibeui-block="people-008"] [data-part="reveal"] b{display:block;margin-bottom:.25rem;font-family:var(--vibeui-people-008-display);font-size:1rem;font-weight:600}
@container (min-width: 48rem){[data-vibeui-block="people-008"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}}
@container (min-width: 68rem){
[data-vibeui-block="people-008"] [data-part="shell"]{padding:2.5rem 2rem 4rem}
[data-vibeui-block="people-008"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.25rem}
[data-vibeui-block="people-008"] [data-part="card"]{padding:1.5rem}
[data-vibeui-block="people-008"] [data-part="reveal"]{padding:1.25rem 1.5rem 1.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="people-008"] *{animation:none!important;transition:none!important}}`

const P = "/demo/festival"

const DEFAULT_PEOPLE: People008Person[] = [
  { name: "Соня Волна", role: "певица, хедлайнер", image: `${P}/speaker-01.webp`, color: "#ffe2d6", tag: "#Музыка", when: "сб, 20:00 · Главная сцена", text: "Альбом «Пригород» стал саундтреком прошлого лета. На фестивале — с оркестром из сорока человек.", href: "#" },
  { name: "Марат Гусев", role: "шеф, «Двор»", image: `${P}/speaker-02.webp`, color: "#c2df37", tag: "#Еда", when: "сб, 13:00 · Фуд-корт", text: "Готовит из того, что растёт в радиусе ста километров. На фестивале ведёт мастер-класс по пасте.", href: "#" },
  { name: "Вера Ланская", role: "архитектор, урбанист", image: `${P}/speaker-03.webp`, color: "#d9cafe", tag: "#Лекции", when: "вс, 14:00 · Лекторий", text: "Автор проекта набережной, на которой стоит фестиваль. Дискуссия о том, кому принадлежит двор.", href: "#" },
  { name: "Ян Рощин", role: "диджей, «Ночь»", image: `${P}/speaker-04.webp`, color: "#464dff", ink: "#fff", tag: "#Ночь", when: "пт, 22:00 · Набережная", text: "Резидент клубов трёх городов. Открывает ночную программу сетом на воде.", href: "#" },
  { name: "Лера Пак", role: "иллюстратор", image: `${P}/speaker-05.webp`, color: "#f3c37d", tag: "#Дети", when: "сб, 11:00 · Детская поляна", text: "Рисует книги для детей и муралы для дворов. Ведёт «Большую картину» — полотно на тридцать метров.", href: "#" },
  { name: "Даниил Орлов", role: "режиссёр", image: `${P}/speaker-06.webp`, color: "#98f5af", tag: "#Кино", when: "сб, 21:30 · Набережная", text: "Куратор программы короткого метра о городе: девять фильмов за полтора часа.", href: "#" },
]

/** Хедлайнеры и спикеры: цветные карточки с портретом, раскрываются по наведению. */
export function People008({
  eyebrow = "Участники",
  title = "Кто выходит на сцены",
  people = DEFAULT_PEOPLE,
  moreLabel = "Все участники →",
  moreHref = "#",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: People008Props) {
  const palette = {
    ...(accent ? { "--vibeui-people-008-accent": accent } : null),
    ...(background ? { "--vibeui-people-008-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-people-008" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="people-008" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            {moreLabel ? (
              <a data-part="more" href={moreHref}>
                {moreLabel}
              </a>
            ) : null}
          </div>
          <h2 data-part="title">{title}</h2>
          <ul data-part="grid">
            {people.map((person, index) => (
              <li key={person.name} data-part="card" data-dark={person.ink ? "true" : undefined} style={{ ["--vibeui-people-008-card" as string]: person.color, ["--vibeui-people-008-ink" as string]: person.ink ?? "#111", ["--vibeui-people-008-n" as string]: index }}>
                <div data-part="top">
                  {person.image ? <img data-part="avatar" src={person.image} alt="" loading="lazy" /> : <span data-part="avatar" />}
                  {person.tag ? <span data-part="tag">{person.tag}</span> : null}
                </div>
                <div>
                  <h3 data-part="name">{person.href ? <a href={person.href}>{person.name}</a> : person.name}</h3>
                  <p data-part="role">{person.role}</p>
                  {person.when ? <p data-part="when">{person.when}</p> : null}
                </div>
                {person.text ? (
                  <div data-part="reveal" aria-hidden="true">
                    <p>
                      <span>
                        <b>{person.name}</b>
                        {person.text}
                      </span>
                    </p>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
