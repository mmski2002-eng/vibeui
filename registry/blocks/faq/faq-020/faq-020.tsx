import { useId, type CSSProperties } from "react"

export type Faq020Item = {
  question: string
  answer: string
}

export type Faq020Props = {
  eyebrow?: string
  title?: string
  lede?: string
  items?: readonly Faq020Item[]
  /** Подпись и ссылка снизу: «Не нашли ответ? Напишите Полине». */
  askText?: string
  askLabel?: string
  askHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Вопросы гостей: аккордеон на details в одну колонку, слева римский
// номер serif'ом, справа крестик, который поворачивается в «−» у
// открытого вопроса; открытый вопрос подсвечивается кремовой плашкой.
// Открыт один за раз (name у details). Внизу — «спросите Полину».
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="faq-020"]){
--vibeui-faq-020-bg:light-dark(#f6f1e8,#17131a);
--vibeui-faq-020-fg:light-dark(#2b1a24,#f3ebe4);
--vibeui-faq-020-muted:light-dark(#7a6a70,#b3a5aa);
--vibeui-faq-020-line:light-dark(#e2d8ca,#372b31);
--vibeui-faq-020-card:light-dark(#fffaf3,#211a25);
--vibeui-faq-020-accent:#b8552f;
--vibeui-faq-020-plum:light-dark(#4a1f36,#e9c7d6);
--vibeui-faq-020-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-faq-020-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-020"]{color-scheme:dark}
:where([data-vibeui-block="faq-020"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="faq-020"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="faq-020"]{box-sizing:border-box;display:block;background:var(--vibeui-faq-020-bg);color:var(--vibeui-faq-020-fg);font-family:var(--vibeui-faq-020-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="faq-020"] *{box-sizing:border-box}
[data-vibeui-block="faq-020"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="faq-020"] [data-part="grid"]{display:grid;gap:2rem}
[data-vibeui-block="faq-020"] [data-part="eyebrow"]{margin:0 0 .6rem;font-size:.72rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--vibeui-faq-020-accent)}
[data-vibeui-block="faq-020"] [data-part="title"]{margin:0;font-family:var(--vibeui-faq-020-display);font-size:clamp(2rem,5cqi,3.6rem);font-weight:500;font-style:italic;line-height:1.05;color:var(--vibeui-faq-020-plum);text-wrap:balance}
[data-vibeui-block="faq-020"] [data-part="lede"]{margin:.8rem 0 0;color:var(--vibeui-faq-020-muted)}
[data-vibeui-block="faq-020"] [data-part="ask"]{margin:1.5rem 0 0;font-size:.95rem;color:var(--vibeui-faq-020-muted)}
[data-vibeui-block="faq-020"] [data-part="ask"] a{color:var(--vibeui-faq-020-fg);font-weight:600;text-decoration:none;border-bottom:1px solid var(--vibeui-faq-020-accent);transition:color .25s}
[data-vibeui-block="faq-020"] [data-part="ask"] a:hover{color:var(--vibeui-faq-020-accent)}
[data-vibeui-block="faq-020"] [data-part="ask"] a:focus-visible,[data-vibeui-block="faq-020"] summary:focus-visible{outline:2px solid var(--vibeui-faq-020-accent);outline-offset:3px;border-radius:.6rem}
[data-vibeui-block="faq-020"] [data-part="list"]{display:grid;gap:.4rem}
[data-vibeui-block="faq-020"] details{border-top:1px solid var(--vibeui-faq-020-line);border-radius:.9rem;transition:background .3s}
[data-vibeui-block="faq-020"] details[open]{background:var(--vibeui-faq-020-card)}
[data-vibeui-block="faq-020"] summary{display:grid;grid-template-columns:2.6rem minmax(0,1fr) 1.6rem;align-items:baseline;gap:.9rem;padding:1.1rem .9rem;cursor:pointer;list-style:none;font-family:var(--vibeui-faq-020-display);font-size:1.35rem;font-weight:500;line-height:1.25}
[data-vibeui-block="faq-020"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="faq-020"] [data-part="num"]{font-size:.85rem;font-family:var(--vibeui-faq-020-display);font-style:italic;letter-spacing:.06em;color:var(--vibeui-faq-020-accent)}
[data-vibeui-block="faq-020"] [data-part="mark"]{position:relative;width:1.2rem;height:1.2rem;align-self:center}
[data-vibeui-block="faq-020"] [data-part="mark"]::before,[data-vibeui-block="faq-020"] [data-part="mark"]::after{content:"";position:absolute;left:0;top:50%;width:100%;height:1px;background:var(--vibeui-faq-020-plum);transition:transform .35s cubic-bezier(.2,.9,.3,1)}
[data-vibeui-block="faq-020"] [data-part="mark"]::after{transform:rotate(90deg)}
[data-vibeui-block="faq-020"] details[open] [data-part="mark"]::after{transform:rotate(0)}
[data-vibeui-block="faq-020"] [data-part="answer"]{margin:0;padding:0 .9rem 1.2rem 4.4rem;color:var(--vibeui-faq-020-muted);animation:vibeui-faq-020-in .35s cubic-bezier(.2,.9,.3,1) both}
@keyframes vibeui-faq-020-in{from{opacity:0;transform:translateY(-.25rem)}}
@container (min-width:56rem){
[data-vibeui-block="faq-020"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="faq-020"] [data-part="grid"]{grid-template-columns:minmax(16rem,.8fr) minmax(0,1.4fr);gap:4rem}
[data-vibeui-block="faq-020"] [data-part="head"]{position:sticky;top:5rem;align-self:start}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-020"] *{animation:none!important;transition:none!important}}`

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]

/** Вопросы гостей свадьбы: аккордеон с римскими номерами, один открыт за раз, снизу «спросите организатора». */
export function Faq020({
  eyebrow = "Вопросы",
  title = "Что обычно спрашивают",
  lede = "Если вашего вопроса тут нет — напишите, ответим быстро.",
  items = [
    { question: "Можно с детьми?", answer: "Да, и мы будем рады. На лужайке будет игровой уголок с аниматором с 17:00 до 21:00. Напишите возраст в анкете — приготовим детское меню." },
    { question: "Что дарить?", answer: "Лучший подарок — вы. Если хочется большего, мы собираем на путешествие — реквизиты в разделе «Подарки». Цветы, пожалуйста, не нужно: увезти их некуда." },
    { question: "Где парковаться?", answer: "У ворот усадьбы, бесплатно, места хватит всем. Если хотите выпить — есть трансфер до метро в 23:30." },
    { question: "Будет ли «горько»?", answer: "Не будет. И тамады тоже. Будут тосты от тех, кто захочет сказать, и много времени просто поговорить." },
    { question: "Можно фотографировать?", answer: "Конечно. На церемонии просим убрать телефоны на двадцать минут — для этого есть фотограф. Дальше снимайте что угодно и ставьте #василисаартём2027." },
    { question: "А если дождь?", answer: "Церемония переедет под крышу павильона, ужин — в оранжерею. Зонт всё равно не помешает: до пруда идти по саду." },
    { question: "Во сколько всё закончится?", answer: "Огни в 23:00, трансфер в 23:30. Кто остаётся в гостевом доме — может не спешить." },
  ],
  askText = "Не нашли ответ?",
  askLabel = "Напишите Полине, нашему организатору",
  askHref = "#people",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Faq020Props) {
  const group = useId()
  const palette = {
    ...(accent ? { "--vibeui-faq-020-accent": accent } : null),
    ...(background ? { "--vibeui-faq-020-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-faq-020" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="faq-020" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="grid">
            <div data-part="head">
              <p data-part="eyebrow">{eyebrow}</p>
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
              {askLabel ? (
                <p data-part="ask">
                  {askText} <a href={askHref}>{askLabel}</a>
                </p>
              ) : null}
            </div>
            <div data-part="list">
              {items.map((item, index) => (
                <details key={item.question} name={group}>
                  <summary>
                    <span data-part="num" aria-hidden="true">
                      {ROMAN[index] ?? index + 1}
                    </span>
                    <span>{item.question}</span>
                    <span data-part="mark" aria-hidden="true" />
                  </summary>
                  <p data-part="answer">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
