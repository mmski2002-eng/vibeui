import type { CSSProperties } from "react"

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
[data-vibeui-block="testimonials-031"] [data-part="card"]{position:relative;display:grid;gap:1rem;align-content:start;padding:1.6rem 1.4rem 1.4rem 2.8rem;border-radius:.4rem 1.2rem 1.2rem .4rem;background:var(--vibeui-testimonials-031-paper);background-image:linear-gradient(90deg,transparent 1.9rem,color-mix(in oklab,var(--vibeui-testimonials-031-accent) 45%,transparent) 1.9rem,color-mix(in oklab,var(--vibeui-testimonials-031-accent) 45%,transparent) calc(1.9rem + 1px),transparent calc(1.9rem + 1px)),repeating-linear-gradient(180deg,transparent 0 calc(1.6rem - 1px),var(--vibeui-testimonials-031-rule) calc(1.6rem - 1px) 1.6rem);border:1px solid var(--vibeui-testimonials-031-line);transform:rotate(calc(var(--vibeui-testimonials-031-tilt) * 1deg));transition:transform .4s cubic-bezier(.2,.8,.2,1),box-shadow .4s}
[data-vibeui-block="testimonials-031"] [data-part="card"]:hover{transform:rotate(0) translateY(-4px);box-shadow:0 30px 50px -30px color-mix(in oklab,var(--vibeui-testimonials-031-fg) 55%,transparent)}
[data-vibeui-block="testimonials-031"] [data-part="sticker"]{position:absolute;right:-.5rem;top:-.8rem;padding:.35rem .7rem;border-radius:.3rem;background:var(--vibeui-testimonials-031-accent);color:var(--vibeui-testimonials-031-on-accent);font-family:var(--vibeui-testimonials-031-hand);font-size:1.1rem;line-height:1.1;transform:rotate(4deg)}
[data-vibeui-block="testimonials-031"] [data-part="quote"]{margin:0;font-size:1.02rem;line-height:1.6rem}
[data-vibeui-block="testimonials-031"] [data-part="quote"]::before{content:"«";color:var(--vibeui-testimonials-031-accent);font-family:var(--vibeui-testimonials-031-display);font-weight:800;font-size:1.4em;line-height:0;margin-right:.1em}
[data-vibeui-block="testimonials-031"] [data-part="note"]{margin:0;font-family:var(--vibeui-testimonials-031-hand);font-size:1.15rem;color:var(--vibeui-testimonials-031-accent);transform:rotate(-1.5deg);transform-origin:left}
[data-vibeui-block="testimonials-031"] [data-part="who"]{margin:0;font-size:.85rem;color:var(--vibeui-testimonials-031-muted)}
[data-vibeui-block="testimonials-031"] [data-part="who"] b{font-family:var(--vibeui-testimonials-031-display);font-weight:700;color:var(--vibeui-testimonials-031-fg)}
[data-vibeui-block="testimonials-031"] [data-part="scale"]{position:relative;margin:.4rem 0 0;padding:.2rem 0 1.3rem}
[data-vibeui-block="testimonials-031"] [data-part="track"]{position:relative;height:.35rem;border-radius:999px;background:var(--vibeui-testimonials-031-line)}
[data-vibeui-block="testimonials-031"] [data-part="fill"]{position:absolute;top:0;bottom:0;left:calc(var(--vibeui-testimonials-031-from) * 1%);width:calc((var(--vibeui-testimonials-031-to) - var(--vibeui-testimonials-031-from)) * 1%);border-radius:999px;background:var(--vibeui-testimonials-031-accent);transform-origin:left}
[data-vibeui-block="testimonials-031"] [data-part="pin"]{position:absolute;top:50%;width:.95rem;height:.95rem;border-radius:50%;transform:translate(-50%,-50%);background:var(--vibeui-testimonials-031-paper);border:2px solid var(--vibeui-testimonials-031-muted)}
[data-vibeui-block="testimonials-031"] [data-part="pin"][data-kind="after"]{background:var(--vibeui-testimonials-031-accent);border-color:var(--vibeui-testimonials-031-accent);box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-testimonials-031-accent) 22%,transparent)}
[data-vibeui-block="testimonials-031"] [data-part="ticks"]{display:flex;justify-content:space-between;margin:.5rem 0 0;padding:0;list-style:none;font-family:var(--vibeui-testimonials-031-display);font-size:.68rem;font-weight:700;color:var(--vibeui-testimonials-031-muted)}
[data-vibeui-block="testimonials-031"] [data-part="ticks"] li[data-from]{color:var(--vibeui-testimonials-031-fg)}
[data-vibeui-block="testimonials-031"] [data-part="ticks"] li[data-to]{color:var(--vibeui-testimonials-031-accent)}
@supports (animation-timeline: view()){[data-vibeui-block="testimonials-031"] [data-part="fill"]{animation:vibeui-testimonials-031-grow linear both;animation-timeline:view();animation-range:entry 30% entry 90%}[data-vibeui-block="testimonials-031"] [data-part="pin"][data-kind="after"]{animation:vibeui-testimonials-031-pop linear both;animation-timeline:view();animation-range:entry 70% entry 100%}}
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

function pluralMonths(count: number) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return "месяц"
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "месяца"
  return "месяцев"
}

function pluralLevels(count: number) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return "уровень"
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "уровня"
  return "уровней"
}

/** Отзывы с уровнем «до → после» на шкале A1–C1. */
export function Testimonials031({
  eyebrow = "отзывы",
  title = "Было → стало, в уровнях, а не в звёздочках",
  lede = "Уровень до и после — по нашему тесту и внешнему экзамену, если сдавали. Имена настоящие, с разрешения.",
  levels = DEFAULT_LEVELS,
  reviews = DEFAULT_REVIEWS,
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
                <li key={review.name + index} data-part="card" style={{ ["--vibeui-testimonials-031-tilt" as string]: index % 3 === 0 ? -0.8 : index % 3 === 1 ? 0.6 : -0.3 }}>
                  {gained > 0 ? (
                    <span data-part="sticker">
                      +{gained} {pluralLevels(gained)}
                    </span>
                  ) : null}
                  <blockquote data-part="quote">{review.quote}</blockquote>
                  {review.note ? <p data-part="note">{review.note}</p> : null}
                  <p data-part="who">
                    <b>{review.name}</b> · {review.lang} · {review.months} {pluralMonths(review.months)}
                  </p>
                  <div data-part="scale" aria-label={`Уровень: было ${review.before}, стало ${review.after}`}>
                    <div data-part="track" style={{ ["--vibeui-testimonials-031-from" as string]: from, ["--vibeui-testimonials-031-to" as string]: to }}>
                      <i data-part="fill" />
                      <i data-part="pin" data-kind="before" style={{ left: `${from}%` }} />
                      <i data-part="pin" data-kind="after" style={{ left: `${to}%` }} />
                    </div>
                    <ul data-part="ticks" aria-hidden="true">
                      {levels.map((level) => (
                        <li key={level} data-from={level === review.before ? "" : undefined} data-to={level === review.after ? "" : undefined}>
                          {level}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}
