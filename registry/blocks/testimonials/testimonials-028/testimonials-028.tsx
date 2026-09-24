import type { CSSProperties } from "react"
import { Card037 } from "@/registry/components/card/card-037/card-037"

export type Testimonials028Review = {
  text: string
  name: string
  /** Город или район на «адресной» стороне открытки. */
  place?: string
  /** Дата на штемпеле: «12 июня». */
  date?: string
  /** По какому поводу был букет: «свадьба», «маме». */
  occasion?: string
}

export type Testimonials028Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Кому адресованы открытки — печатается на адресной стороне. */
  addressee?: string
  address?: string
  reviews?: readonly Testimonials028Review[]
  /** aria ленты и подписи на открытке. */
  stripLabel?: string
  postLabel?: string
  linesLabel?: string
  toLabel?: string
  whereLabel?: string
  fromLabel?: string
  hint?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Отзывы как почтовые открытки: слева рукописный текст (Caveat), справа
// адресная сторона — марка с цветком, круглый штемпель с датой, линии
// адреса и подпись. Открытки лежат в горизонтальной ленте со scroll-snap,
// каждая чуть повёрнута в свою сторону, по наведению выравнивается и
// приподнимается. Серверный блок, без JS.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="testimonials-028"]){
--vibeui-testimonials-028-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-testimonials-028-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-028-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-028-on-accent:oklch(from var(--vibeui-testimonials-028-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-testimonials-028-muted:color-mix(in oklab,var(--vibeui-testimonials-028-fg) 62%,var(--vibeui-testimonials-028-bg));
--vibeui-testimonials-028-line:color-mix(in oklab,var(--vibeui-testimonials-028-fg) 16%,transparent);
--vibeui-testimonials-028-card:color-mix(in oklab,var(--vibeui-testimonials-028-fg) 3%,var(--vibeui-testimonials-028-bg));
--vibeui-testimonials-028-display:"Cormorant",Georgia,"Times New Roman",serif;
--vibeui-testimonials-028-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-028-hand:"Caveat","Segoe Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-028"]{color-scheme:dark}
:where([data-vibeui-block="testimonials-028"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="testimonials-028"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="testimonials-028"]{box-sizing:border-box;padding:4rem 0;overflow:hidden;background:var(--vibeui-testimonials-028-bg);color:var(--vibeui-testimonials-028-fg);font-family:var(--vibeui-testimonials-028-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="testimonials-028"] *{box-sizing:border-box}
[data-vibeui-block="testimonials-028"] [data-part="card"]{flex:0 0 min(88%,34rem)}
[data-vibeui-block="testimonials-028"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="testimonials-028"] [data-part="head"]{max-width:40rem;margin:0 0 2.2rem}
[data-vibeui-block="testimonials-028"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.74rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-testimonials-028-muted)}
[data-vibeui-block="testimonials-028"] [data-part="title"]{margin:0;font-family:var(--vibeui-testimonials-028-display);font-weight:500;font-size:clamp(2.2rem,5.4cqi,4.2rem);line-height:1;letter-spacing:-.02em}
[data-vibeui-block="testimonials-028"] [data-part="lede"]{margin:.8rem 0 0;color:var(--vibeui-testimonials-028-muted)}
[data-vibeui-block="testimonials-028"] [data-part="strip"]{display:flex;gap:1.5rem;margin:0 -1.25rem;padding:1.5rem 1.25rem 2rem;list-style:none;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding:0 1.25rem;scrollbar-width:none}
[data-vibeui-block="testimonials-028"] [data-part="strip"]::-webkit-scrollbar{display:none}
[data-vibeui-block="testimonials-028"] [data-part="hint"]{margin:0;font-family:var(--vibeui-testimonials-028-hand);font-size:1.3rem;color:var(--vibeui-testimonials-028-muted)}

@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-028"] *{animation:none!important;transition:none!important}}
@container (min-width: 60rem){[data-vibeui-block="testimonials-028"] [data-part="card"]{flex-basis:36rem}}
`

const DEFAULT_REVIEWS: Testimonials028Review[] = [
  { text: "Заказала маме на юбилей «Утро на даче». Курьер приехал ровно к 11, как обещали, мама три дня всем показывала открытку с именем флориста.", name: "Ксения", place: "Петроградская", date: "12 июня", occasion: "маме, 60 лет" },
  { text: "Собрал в конструкторе букет из мака и ромашек за пять минут в такси. Привезли к часу, стоял восемь дней — считал.", name: "Антон", place: "Васильевский", date: "3 июля", occasion: "просто так" },
  { text: "Свадебный букет и бутоньерки: Вера сама приехала утром, поправила ленты и оставила запасные булавки. Спасибо за спокойствие.", name: "Маша и Илья", place: "Пушкин", date: "24 августа", occasion: "свадьба" },
  { text: "Подписка раз в две недели уже полгода. Ни разу не повторились, и всегда пишут, как ухаживать. Лучшее, что я себе покупаю.", name: "Ольга", place: "Коломна", date: "9 сентября", occasion: "подписка" },
]

/** Отзывы-открытки: рукописный текст, марка, штемпель, лента со snap. */
export function Testimonials028({
  eyebrow = "Открытки",
  title = "Что пишут нам в ответ",
  lede = "Каждый букет уходит с открыткой. Иногда открытки возвращаются — вот несколько.",
  addressee = "Мастерская «Стебель»",
  address = "Пестеля, 4, Санкт-Петербург",
  reviews = DEFAULT_REVIEWS,
  stripLabel = "Отзывы",
  postLabel = "почта",
  linesLabel = "Адресат",
  toLabel = "кому:",
  whereLabel = "куда:",
  fromLabel = "откуда:",
  hint = "← листайте открытки",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Testimonials028Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-028-accent": accent } : null),
    ...(ink ? { "--vibeui-testimonials-028-fg": ink } : null),
    ...(background ? { "--vibeui-testimonials-028-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-testimonials-028" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="testimonials-028" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <ul data-part="strip" aria-label={stripLabel}>
            {reviews.map((review) => (
              <Card037 key={review.name + review.text.slice(0, 12)} data-part="card" name={review.name} text={review.text} occasion={review.occasion} date={review.date} place={review.place} postLabel={postLabel} linesLabel={linesLabel} toLabel={toLabel} addressee={addressee} whereLabel={whereLabel} address={address} fromLabel={fromLabel} accent={accent} />
            ))}
          </ul>
          <p data-part="hint">{hint}</p>
        </div>
      </section>
    </>
  )
}
