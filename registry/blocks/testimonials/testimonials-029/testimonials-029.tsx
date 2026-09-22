import type { CSSProperties } from "react"
import { Card113 } from "@/registry/components/card/card-113/card-113"

export type Testimonials029Review = {
  /** Номер акта: «0214». */
  number: string
  object: string
  date: string
  text: string
  name: string
  /** Оценка 1–5. */
  stars?: number
  /** Что было замечанием при приёмке и как закрыли. Пусто — «без замечаний». */
  remark?: string
}

export type Testimonials029Props = {
  eyebrow?: string
  title?: string
  lede?: string
  reviews?: readonly Testimonials029Review[]
  stampLabel?: string
  remarkStampLabel?: string
  signLabel?: string
  /** Заголовок акта, aria звёзд, подпись замечания. */
  actLabel?: string
  starsLabel?: string
  remarkLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Отзывы как акты приёмки: карточка-документ с номером акта, объектом и
// датой моно в шапке, цитатой заказчика, звёздами, строкой подписи с
// «рукописным» именем (Caveat) и штампом «ПРИНЯТО БЕЗ ЗАМЕЧАНИЙ», который
// стоит под наклоном. При появлении в экране штамп «ставится»: масштаб от
// 1.6 до 1 через animation-timeline: view() с фолбэком на обычный
// keyframes. Если было замечание — штамп другой и строка «замечание
// устранено».
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&family=Caveat:wght@600&display=swap"

const STYLES = `
:where([data-vibeui-block="testimonials-029"]){
--vibeui-testimonials-029-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-testimonials-029-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-029-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-029-on-accent:oklch(from var(--vibeui-testimonials-029-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-testimonials-029-muted:color-mix(in oklab,var(--vibeui-testimonials-029-fg) 62%,var(--vibeui-testimonials-029-bg));
--vibeui-testimonials-029-line:color-mix(in oklab,var(--vibeui-testimonials-029-fg) 16%,transparent);
--vibeui-testimonials-029-grid:color-mix(in oklab,var(--vibeui-testimonials-029-fg) 7%,transparent);
--vibeui-testimonials-029-paper:color-mix(in oklab,var(--vibeui-testimonials-029-bg) 90%,var(--vibeui-testimonials-029-fg));
--vibeui-testimonials-029-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-029-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-029-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-testimonials-029-hand:"Caveat",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-029"]{color-scheme:dark}
:where([data-vibeui-block="testimonials-029"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="testimonials-029"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="testimonials-029"]{box-sizing:border-box;padding:5rem 0;background-color:var(--vibeui-testimonials-029-bg);background-image:linear-gradient(var(--vibeui-testimonials-029-grid) 1px,transparent 1px),linear-gradient(90deg,var(--vibeui-testimonials-029-grid) 1px,transparent 1px);background-size:5rem 5rem;color:var(--vibeui-testimonials-029-fg);font-family:var(--vibeui-testimonials-029-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="testimonials-029"] *{box-sizing:border-box}
[data-vibeui-block="testimonials-029"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="testimonials-029"] [data-part="head"]{max-width:44rem;margin-bottom:2.5rem}
[data-vibeui-block="testimonials-029"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 1rem;font-family:var(--vibeui-testimonials-029-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-testimonials-029-muted)}
[data-vibeui-block="testimonials-029"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-testimonials-029-accent)}
[data-vibeui-block="testimonials-029"] [data-part="title"]{margin:0;font-family:var(--vibeui-testimonials-029-display);font-weight:800;font-size:clamp(2rem,5cqi,3.6rem);line-height:1;letter-spacing:-.035em;text-wrap:balance}
[data-vibeui-block="testimonials-029"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-testimonials-029-muted)}
[data-vibeui-block="testimonials-029"] [data-part="grid"]{display:grid;gap:1.2rem;margin:0;padding:0;list-style:none}
@supports (animation-timeline: view()){}
@keyframes vibeui-testimonials-029-stamp{from{transform:rotate(-8deg) scale(1.7);opacity:0}to{transform:rotate(-8deg) scale(1);opacity:.95}}
@container (min-width: 40rem){[data-vibeui-block="testimonials-029"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 64rem){[data-vibeui-block="testimonials-029"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-029"] *{animation:none!important;transition:none!important}}`

const DEFAULT_REVIEWS: Testimonials029Review[] = [
  { number: "0298", object: "Двушка на Ленинском, 62 м²", date: "14.08.2026", text: "Сдали на два дня раньше срока. Каждый вечер фото в чате, я ни разу не ездила проверять. Плитку в санузле переложили бы, если бы я попросила — не пришлось.", name: "Анна Р.", stars: 5 },
  { number: "0291", object: "Трёшка в Сколково, 96 м²", date: "02.07.2026", text: "Дизайнер из бюро сказала, что впервые бригада сделала скрытые двери с первого раза. Смета не выросла ни на рубль, хотя мы добавили розетки.", name: "Кирилл и Мария", stars: 5 },
  { number: "0284", object: "Студия на Таганке, 31 м²", date: "19.05.2026", text: "Косметика за четыре недели, как обещали. Уборка после себя — сдали чистую квартиру, я в тот же день заселил арендаторов.", name: "Олег Н.", stars: 5, remark: "царапина на подоконнике — заменили за два дня, до подписания акта" },
  { number: "0277", object: "Четырёшка в Хамовниках, 134 м²", date: "28.03.2026", text: "Перепланировку согласовали сами, я только подписывал. Прораб Игорь отвечает в течение часа даже в воскресенье — это отдельная ценность.", name: "Дмитрий В.", stars: 5 },
  { number: "0269", object: "Двушка на Речном, 54 м²", date: "11.02.2026", text: "Первый ремонт в жизни, боялась всего. Договор с датами этапов и штрафом успокоил лучше любых слов. Всё совпало день в день.", name: "Полина С.", stars: 5 },
  { number: "0260", object: "Однушка в Люблино, 38 м²", date: "23.12.2025", text: "Электрику переделали с нуля, щит подписан по линиям. Я сам инженер, придраться было не к чему — а я старался.", name: "Сергей К.", stars: 4, remark: "просили тише работать до 10:00 — график сдвинули с первого дня" },
]

/** Отзывы как акты приёмки со штампом «принято без замечаний». */
export function Testimonials029({
  eyebrow = "Акты приёмки",
  title = "Что пишут заказчики в день сдачи",
  lede = "Цитаты из актов приёмки за последний год. Замечания не прячем: если были — пишем, как закрыли.",
  reviews = DEFAULT_REVIEWS,
  stampLabel = "Принято без замечаний",
  remarkStampLabel = "Замечание устранено",
  signLabel = "Подпись заказчика",
  actLabel = "Акт приёмки № {n}",
  starsLabel = "{n} из 5",
  remarkLabel = "Замечание: ",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Testimonials029Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-029-accent": accent } : null),
    ...(ink ? { "--vibeui-testimonials-029-fg": ink } : null),
    ...(background ? { "--vibeui-testimonials-029-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-testimonials-029" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="testimonials-029" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <ul data-part="grid">
            {reviews.map((review) => {
              const stars = Math.max(0, Math.min(5, review.stars ?? 5))
              return (
                <Card113 key={review.number} data-part="act" number={review.number} object={review.object} date={review.date} text={review.text} remark={review.remark} name={review.name} actLabel={actLabel} starsLabel={starsLabel} remarkLabel={remarkLabel} signLabel={signLabel} remarkStampLabel={remarkStampLabel} stampLabel={stampLabel} stars={stars} accent={accent} />
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}
