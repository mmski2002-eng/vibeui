import type { CSSProperties } from "react"
import { Card114 } from "@/registry/components/card/card-114/card-114"

export type Testimonials031Review = {
  name: string
  /** Язык: «английский». */
  lang: string
  /** Сколько месяцев занимался. */
  months: number
  /** Уровень до и после — коды из levels. */
  before: string
  after: string
  quote: string
  /** Рукописная приписка на полях: «сдала IELTS на 7.0». */
  note?: string
}

export type Testimonials031Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Шкала уровней по возрастанию. */
  levels?: readonly string[]
  reviews?: readonly Testimonials031Review[]
  /** Формы слов и aria шкалы. */
  monthUnits?: readonly [string, string, string]
  levelUnits?: readonly [string, string, string]
  scaleLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Отзывы учеников с уровнем «до → после»: карточки-тетрадные листы с
// полями, цитата, имя, язык и срок. Внизу каждой — шкала A1…C1, на
// которой пустой кружок «было» и залитый «стало», между ними полоска
// прогресса. Полоска растёт по мере прокрутки (animation-timeline:
// view(), в старых браузерах — сразу заполнена). Стикер «+2 уровня»
// считается из шкалы. Без JS.
const FONTS = "https://fonts.googleapis.com/css2?family=Onest:wght@500;600;700;800&family=Golos+Text:wght@400;500;600&family=Marck+Script&display=swap"

const STYLES = `
:where([data-vibeui-block="testimonials-031"]){
--vibeui-testimonials-031-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-testimonials-031-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-031-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-031-on-accent:oklch(from var(--vibeui-testimonials-031-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-testimonials-031-muted:color-mix(in oklab,var(--vibeui-testimonials-031-fg) 62%,var(--vibeui-testimonials-031-bg));
--vibeui-testimonials-031-line:color-mix(in oklab,var(--vibeui-testimonials-031-fg) 12%,transparent);
--vibeui-testimonials-031-rule:color-mix(in oklab,var(--vibeui-testimonials-031-fg) 8%,transparent);
--vibeui-testimonials-031-paper:color-mix(in oklab,var(--vibeui-testimonials-031-bg) 92%,#fff);
--vibeui-testimonials-031-display:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-031-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-031-hand:"Marck Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-031"]{color-scheme:dark}
:where([data-vibeui-block="testimonials-031"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="testimonials-031"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="testimonials-031"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-testimonials-031-bg);color:var(--vibeui-testimonials-031-fg);font-family:var(--vibeui-testimonials-031-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="testimonials-031"] *{box-sizing:border-box}
[data-vibeui-block="testimonials-031"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="testimonials-031"] [data-part="head"]{max-width:40rem;margin:0 0 2.5rem}
[data-vibeui-block="testimonials-031"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-testimonials-031-hand);font-size:1.4rem;color:var(--vibeui-testimonials-031-accent)}
[data-vibeui-block="testimonials-031"] [data-part="title"]{margin:0;font-family:var(--vibeui-testimonials-031-display);font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.05;letter-spacing:-.03em;text-wrap:balance}
[data-vibeui-block="testimonials-031"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-testimonials-031-muted)}
[data-vibeui-block="testimonials-031"] [data-part="grid"]{display:grid;gap:1.4rem;margin:0;padding:0;list-style:none}
@supports (animation-timeline: view()){}
@keyframes vibeui-testimonials-031-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes vibeui-testimonials-031-pop{from{transform:translate(-50%,-50%) scale(0)}to{transform:translate(-50%,-50%) scale(1)}}
@container (min-width: 40rem){[data-vibeui-block="testimonials-031"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 64rem){[data-vibeui-block="testimonials-031"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-031"] *{animation:none!important;transition:none!important}}`

const DEFAULT_LEVELS = ["A1", "A2", "B1", "B2", "C1"]

const DEFAULT_REVIEWS: Testimonials031Review[] = [
  { name: "Марина", lang: "английский", months: 6, before: "A2", after: "B2", quote: "Пришла с «лондон из зе кэпитал», через полгода вела созвон с заказчиком из Дублина и даже поняла его шутку про погоду.", note: "сдала IELTS на 7.0" },
  { name: "Артём", lang: "испанский", months: 3, before: "A1", after: "A2", quote: "Учил для поездки. В Севилье заказал тапас, поспорил с таксистом и не потерялся в метро. Diego сказал, что акцент «terrible, pero encantador».", note: "поездка удалась" },
  { name: "Ксения", lang: "итальянский", months: 9, before: "A1", after: "B1", quote: "Три раза бросала приложения. Здесь группа держит: пропустишь — спросят, где была. Через девять месяцев читаю Феррante со словарём, но читаю.", note: "переехала в Милан" },
  { name: "Олег", lang: "английский", months: 4, before: "B1", after: "B2", quote: "Мне нужен был не язык, а уверенность на интервью. Эмма гоняла по behavioural questions, пока я не перестал говорить «эээ». Оффер получил.", note: "оффер в Амстердаме" },
  { name: "Даша", lang: "испанский", months: 6, before: "A2", after: "B1", quote: "Занималась утром в 8:00 перед работой. Думала, не выдержу. Выдержала — потому что группа в семь человек ждала, а не бот." },
  { name: "Игорь", lang: "английский", months: 12, before: "A1", after: "B1", quote: "Мне 47, начинал с нуля. Не стыдно было ни разу — это, наверное, главное. Теперь переписываюсь с сыном в Канаде без переводчика.", note: "лучший год" },
]



/** Отзывы с уровнем «до → после» на шкале A1–C1. */
export function Testimonials031({
  eyebrow = "отзывы",
  title = "Было → стало, в уровнях, а не в звёздочках",
  lede = "Уровень до и после — по нашему тесту и внешнему экзамену, если сдавали. Имена настоящие, с разрешения.",
  levels = DEFAULT_LEVELS,
  reviews = DEFAULT_REVIEWS,
  monthUnits = ["месяц", "месяца", "месяцев"],
  levelUnits = ["уровень", "уровня", "уровней"],
  scaleLabel = "Уровень: было {before}, стало {after}",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Testimonials031Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-031-accent": accent } : null),
    ...(ink ? { "--vibeui-testimonials-031-fg": ink } : null),
    ...(background ? { "--vibeui-testimonials-031-bg": background } : null),
    ...style,
  } as CSSProperties

  const position = (code: string) => {
    const index = Math.max(0, levels.indexOf(code))
    return levels.length > 1 ? (index / (levels.length - 1)) * 100 : 0
  }

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-testimonials-031" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="testimonials-031" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <ul data-part="grid">
            {reviews.map((review, index) => {
              const from = position(review.before)
              const to = position(review.after)
              const gained = Math.max(0, levels.indexOf(review.after) - levels.indexOf(review.before))
              return (
                <Card114 key={review.name + index} data-part="card" name={review.name} quote={review.quote} note={review.note} lang={review.lang} months={review.months} before={review.before} after={review.after} levelUnits={levelUnits} monthUnits={monthUnits} scaleLabel={scaleLabel} levels={levels} from={from} to={to} gained={gained} style={{ ["--vibeui-testimonials-031-tilt" as string]: index % 3 === 0 ? -0.8 : index % 3 === 1 ? 0.6 : -0.3 }} accent={accent} />
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}
