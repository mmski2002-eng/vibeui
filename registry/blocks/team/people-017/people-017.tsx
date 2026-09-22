import type { CSSProperties } from "react"
import { Card059 } from "@/registry/components/card/card-059/card-059"

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
  /** Строки фактов карточки; {n} выделяется жирным. */
  yearsLine?: string
  objectsLine?: string
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
  yearsLine = "стаж {n} лет",
  objectsLine = "сдано {n}",
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
              <Card059 key={person.name} data-part="card" name={person.name} photo={person.photo} role={person.role} years={person.years} objects={person.objects} text={person.text} now={person.now} yearsLine={yearsLine} objectsLine={objectsLine} nowLabel={nowLabel} index={index} accent={accent} />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
