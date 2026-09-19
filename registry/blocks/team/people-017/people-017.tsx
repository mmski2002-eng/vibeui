import type { CSSProperties } from "react"

export type People017Person = {
  name: string
  role: string
  /** Стаж в годах и сдано объектов — уходят в моно-строку. */
  years?: number
  objects?: number
  /** За что отвечает — одна строка. */
  text?: string
  /** Где сейчас: «на Полежаевской». Пусто — свободен. */
  now?: string
  /** Фото; без него — монограмма из инициалов. */
  photo?: string
}

export type People017Props = {
  eyebrow?: string
  title?: string
  lede?: string
  people?: readonly People017Person[]
  /** Что написать в бейдже «сейчас»: «на объекте». */
  nowLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Бригада как штатное расписание на чертеже: карточки с рамкой и
// угловыми засечками, порядковый номер, монограмма (или фото) в квадрате,
// имя, должность, стаж и сдано объектов моно-цифрами, зона ответственности
// и бейдж «сейчас на объекте». По наведению засечки уголков разъезжаются
// наружу, карточка чуть приподнимается, монограмма заливается акцентом.
// Без JS.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="people-017"]){
--vibeui-people-017-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-people-017-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-017-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-017-on-accent:oklch(from var(--vibeui-people-017-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-people-017-muted:color-mix(in oklab,var(--vibeui-people-017-fg) 62%,var(--vibeui-people-017-bg));
--vibeui-people-017-line:color-mix(in oklab,var(--vibeui-people-017-fg) 16%,transparent);
--vibeui-people-017-grid:color-mix(in oklab,var(--vibeui-people-017-fg) 7%,transparent);
--vibeui-people-017-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-people-017-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-people-017-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="people-017"]{color-scheme:dark}
:where([data-vibeui-block="people-017"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="people-017"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="people-017"]{box-sizing:border-box;padding:5rem 0;background-color:var(--vibeui-people-017-bg);background-image:linear-gradient(var(--vibeui-people-017-grid) 1px,transparent 1px),linear-gradient(90deg,var(--vibeui-people-017-grid) 1px,transparent 1px);background-size:5rem 5rem;color:var(--vibeui-people-017-fg);font-family:var(--vibeui-people-017-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="people-017"] *{box-sizing:border-box}
[data-vibeui-block="people-017"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="people-017"] [data-part="head"]{max-width:44rem;margin-bottom:2.5rem}
[data-vibeui-block="people-017"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 1rem;font-family:var(--vibeui-people-017-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-people-017-muted)}
[data-vibeui-block="people-017"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-people-017-accent)}
[data-vibeui-block="people-017"] [data-part="title"]{margin:0;font-family:var(--vibeui-people-017-display);font-weight:800;font-size:clamp(2rem,5cqi,3.6rem);line-height:1;letter-spacing:-.035em;text-wrap:balance}
[data-vibeui-block="people-017"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-people-017-muted)}
[data-vibeui-block="people-017"] [data-part="grid"]{display:grid;gap:1rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="people-017"] [data-part="card"]{position:relative;display:grid;grid-template-columns:5rem minmax(0,1fr);gap:.4rem 1rem;padding:1.2rem;border:1px solid var(--vibeui-people-017-line);background:color-mix(in oklab,var(--vibeui-people-017-bg) 75%,transparent);transition:transform .25s cubic-bezier(.2,.8,.2,1),border-color .25s,box-shadow .25s}
[data-vibeui-block="people-017"] [data-part="card"]:hover{transform:translateY(-3px);border-color:color-mix(in oklab,var(--vibeui-people-017-fg) 45%,transparent);box-shadow:0 24px 40px -30px rgb(0 0 0 / .5)}
[data-vibeui-block="people-017"] [data-part="corner"]{position:absolute;width:.9rem;height:.9rem;border:0 solid var(--vibeui-people-017-fg);pointer-events:none;transition:transform .3s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="people-017"] [data-part="corner"]:nth-of-type(1){left:-1px;top:-1px;border-left-width:2px;border-top-width:2px}
[data-vibeui-block="people-017"] [data-part="corner"]:nth-of-type(2){right:-1px;top:-1px;border-right-width:2px;border-top-width:2px}
[data-vibeui-block="people-017"] [data-part="corner"]:nth-of-type(3){left:-1px;bottom:-1px;border-left-width:2px;border-bottom-width:2px}
[data-vibeui-block="people-017"] [data-part="corner"]:nth-of-type(4){right:-1px;bottom:-1px;border-right-width:2px;border-bottom-width:2px}
[data-vibeui-block="people-017"] [data-part="card"]:hover [data-part="corner"]:nth-of-type(1){transform:translate(-4px,-4px)}
[data-vibeui-block="people-017"] [data-part="card"]:hover [data-part="corner"]:nth-of-type(2){transform:translate(4px,-4px)}
[data-vibeui-block="people-017"] [data-part="card"]:hover [data-part="corner"]:nth-of-type(3){transform:translate(-4px,4px)}
[data-vibeui-block="people-017"] [data-part="card"]:hover [data-part="corner"]:nth-of-type(4){transform:translate(4px,4px)}
[data-vibeui-block="people-017"] [data-part="index"]{position:absolute;top:.6rem;right:.8rem;font-family:var(--vibeui-people-017-mono);font-size:.66rem;letter-spacing:.06em;color:var(--vibeui-people-017-muted)}
[data-vibeui-block="people-017"] [data-part="mark"]{grid-row:1 / span 3;width:5rem;aspect-ratio:1;display:grid;place-items:center;border:1px solid var(--vibeui-people-017-fg);background:color-mix(in oklab,var(--vibeui-people-017-fg) 5%,transparent);font-family:var(--vibeui-people-017-display);font-weight:800;font-size:1.6rem;letter-spacing:-.04em;overflow:hidden;transition:background .25s,color .25s}
[data-vibeui-block="people-017"] [data-part="mark"] img{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="people-017"] [data-part="card"]:hover [data-part="mark"]{background:var(--vibeui-people-017-accent);color:var(--vibeui-people-017-on-accent)}
[data-vibeui-block="people-017"] [data-part="name"]{margin:0;padding-right:2rem;font-family:var(--vibeui-people-017-display);font-weight:700;font-size:1.15rem;letter-spacing:-.02em;line-height:1.15}
[data-vibeui-block="people-017"] [data-part="role"]{margin:0;font-size:.88rem;color:var(--vibeui-people-017-muted)}
[data-vibeui-block="people-017"] [data-part="nums"]{display:flex;flex-wrap:wrap;gap:.3rem .9rem;margin:0;padding:0;list-style:none;font-family:var(--vibeui-people-017-mono);font-size:.72rem;color:var(--vibeui-people-017-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="people-017"] [data-part="nums"] b{font-weight:600;color:var(--vibeui-people-017-fg)}
[data-vibeui-block="people-017"] [data-part="text"]{grid-column:1 / -1;margin:.4rem 0 0;padding-top:.7rem;border-top:1px dashed var(--vibeui-people-017-line);font-size:.88rem;color:var(--vibeui-people-017-muted)}
[data-vibeui-block="people-017"] [data-part="now"]{grid-column:1 / -1;justify-self:start;display:inline-flex;align-items:center;gap:.4rem;margin-top:.3rem;padding:.25rem .55rem;background:var(--vibeui-people-017-accent);color:var(--vibeui-people-017-on-accent);font-family:var(--vibeui-people-017-mono);font-size:.64rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase}
[data-vibeui-block="people-017"] [data-part="now"]::before{content:"";width:.4rem;height:.4rem;border-radius:50%;background:currentColor}
@container (min-width: 40rem){[data-vibeui-block="people-017"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 64rem){[data-vibeui-block="people-017"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="people-017"] *{animation:none!important;transition:none!important}}`

const DEFAULT_PEOPLE: People017Person[] = [
  { name: "Игорь Савельев", role: "Прораб, руководитель бригады", years: 14, objects: 312, text: "Отвечает за график, приёмку скрытых работ и ежедневный отчёт. Его телефон — в договоре.", now: "на Полежаевской" },
  { name: "Дмитрий Клюев", role: "Электрик, допуск до 1000 В", years: 11, objects: 204, text: "Щиты, слаботочка, умный дом. Каждая линия промаркирована и есть в схеме.", now: "на Полежаевской" },
  { name: "Артём Гусев", role: "Сантехник", years: 9, objects: 176, text: "Коллекторная разводка, опрессовка с актом, тёплые полы." },
  { name: "Марат Ибрагимов", role: "Плиточник, полы", years: 12, objects: 158, text: "Крупный формат, керамогранит под 45°, инженерная доска, паркет ёлкой.", now: "на Ленинском" },
  { name: "Ольга Терехова", role: "Маляр", years: 8, objects: 120, text: "Шпаклёвка под покраску без «полос под лампой», обои в стык, микроцемент." },
  { name: "Ринат Валеев", role: "Плотник, монтаж", years: 7, objects: 96, text: "Скрытые двери, встроенная мебель по проекту, короба и ниши." },
]

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
}

/** Бригада карточками-«штатным расписанием» с угловыми засечками. */
export function People017({
  eyebrow = "Бригада",
  title = "Свои люди, а не «кто свободен»",
  lede = "Шесть человек, которые работают вместе больше семи лет. Субподряда нет: на объекте те, чьи имена в договоре.",
  people = DEFAULT_PEOPLE,
  nowLabel = "сейчас",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: People017Props) {
  const palette = {
    ...(accent ? { "--vibeui-people-017-accent": accent } : null),
    ...(ink ? { "--vibeui-people-017-fg": ink } : null),
    ...(background ? { "--vibeui-people-017-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-people-017" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="people-017" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <ul data-part="grid">
            {people.map((person, index) => (
              <li key={person.name} data-part="card">
                <i data-part="corner" aria-hidden="true" />
                <i data-part="corner" aria-hidden="true" />
                <i data-part="corner" aria-hidden="true" />
                <i data-part="corner" aria-hidden="true" />
                <span data-part="index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div data-part="mark" aria-hidden={person.photo ? undefined : true}>
                  {person.photo ? <img src={person.photo} alt={person.name} loading="lazy" /> : initials(person.name)}
                </div>
                <h3 data-part="name">{person.name}</h3>
                <p data-part="role">{person.role}</p>
                {person.years || person.objects ? (
                  <ul data-part="nums">
                    {person.years ? (
                      <li>
                        стаж <b>{person.years}</b> лет
                      </li>
                    ) : null}
                    {person.objects ? (
                      <li>
                        сдано <b>{person.objects}</b>
                      </li>
                    ) : null}
                  </ul>
                ) : null}
                {person.text ? <p data-part="text">{person.text}</p> : null}
                {person.now ? (
                  <span data-part="now">
                    {nowLabel} {person.now}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
