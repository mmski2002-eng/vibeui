import type { ComponentProps, CSSProperties } from "react"

export type Accordion020Item = {
  question: string
  answer: string
}

export type Accordion020Props = Omit<ComponentProps<"div">, "children"> & {
  items?: readonly Accordion020Item[]
  /** Открытым остаётся только один раздел: группировка через атрибут name. */
  exclusive?: boolean
  /** Имя группы взаимного исключения: двум аккордеонам на странице нужны разные. */
  group?: string
  /** Номер раздела, открытого сразу. -1 — все закрыты. */
  defaultOpen?: number
  accent?: string
  /** Цвет текста. Пусто — чернильный по color-scheme окружения. */
  ink?: string
  /** Цвет подложки страницы, от которого считаются приглушённые тона; фона компонент не рисует. */
  background?: string
}

// Идея компонента: римские номера курсивной антиквой перед вопросом, тонкая
// линия сверху раздела, открытый раздел ложится на тёплую плашку. Крест из
// двух линий складывается в одну при раскрытии.
const STYLES = `
:where([data-vibeui-block="accordion-020"]){
--vibeui-accordion-020-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-accordion-020-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-accordion-020-muted:light-dark(#7a6a70,#a3a3a3);
--vibeui-accordion-020-line:light-dark(#e2d8ca,#2e2e2e);
--vibeui-accordion-020-card:light-dark(#fffaf3,#242424);
--vibeui-accordion-020-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-accordion-020-plum:var(--vibeui-accordion-020-fg);
--vibeui-accordion-020-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-accordion-020-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="accordion-020"]{color-scheme:dark}
[data-vibeui-block="accordion-020"] summary:focus-visible{outline:2px solid var(--vibeui-accordion-020-accent);outline-offset:3px;border-radius:.6rem}
[data-vibeui-block="accordion-020"] [data-part="deck"]{display:grid;gap:.4rem}
[data-vibeui-block="accordion-020"] details{border-top:1px solid var(--vibeui-accordion-020-line);border-radius:.9rem;transition:background .3s}
[data-vibeui-block="accordion-020"] details[open]{background:var(--vibeui-accordion-020-card)}
[data-vibeui-block="accordion-020"] summary{display:grid;grid-template-columns:2.6rem minmax(0,1fr) 1.6rem;align-items:baseline;gap:.9rem;padding:1.1rem .9rem;cursor:pointer;list-style:none;font-family:var(--vibeui-accordion-020-display);font-size:1.35rem;font-weight:500;line-height:1.25}
[data-vibeui-block="accordion-020"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-020"] [data-part="num"]{font-size:.85rem;font-family:var(--vibeui-accordion-020-display);font-style:italic;letter-spacing:.06em;color:var(--vibeui-accordion-020-accent)}
[data-vibeui-block="accordion-020"] [data-part="mark"]{position:relative;width:1.2rem;height:1.2rem;align-self:center}
[data-vibeui-block="accordion-020"] [data-part="mark"]::before,[data-vibeui-block="accordion-020"] [data-part="mark"]::after{content:"";position:absolute;left:0;top:50%;width:100%;height:1px;background:var(--vibeui-accordion-020-plum);transition:transform .35s cubic-bezier(.2,.9,.3,1)}
[data-vibeui-block="accordion-020"] [data-part="mark"]::after{transform:rotate(90deg)}
[data-vibeui-block="accordion-020"] details[open] [data-part="mark"]::after{transform:rotate(0)}
[data-vibeui-block="accordion-020"] [data-part="answer"]{margin:0;padding:0 .9rem 1.2rem 4.4rem;color:var(--vibeui-accordion-020-muted);animation:vibeui-accordion-020-in .35s cubic-bezier(.2,.9,.3,1) both}
@keyframes vibeui-accordion-020-in{from{opacity:0;transform:translateY(-.25rem)}}
[data-vibeui-block="accordion-020"]{width:100%;min-width:min(100%,16rem);box-sizing:border-box;color:var(--vibeui-accordion-020-fg);font-family:var(--vibeui-accordion-020-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="accordion-020"] *{box-sizing:border-box}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-020"] *{animation:none!important;transition:none!important}}
`

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]

const DEFAULT_ITEMS: Accordion020Item[] = [
  { question: "Можно с детьми?", answer: "Да, и мы будем рады. На лужайке будет игровой уголок с аниматором с 17:00 до 21:00. Напишите возраст в анкете — приготовим детское меню." },
  { question: "Что дарить?", answer: "Лучший подарок — вы. Если хочется большего, мы собираем на путешествие — реквизиты в разделе «Подарки». Цветы, пожалуйста, не нужно: увезти их некуда." },
  { question: "Где парковаться?", answer: "У ворот усадьбы, бесплатно, места хватит всем. Если хотите выпить — есть трансфер до метро в 23:30." },
  { question: "Будет ли «горько»?", answer: "Не будет. И тамады тоже. Будут тосты от тех, кто захочет сказать, и много времени просто поговорить." },
  { question: "Можно фотографировать?", answer: "Конечно. На церемонии просим убрать телефоны на двадцать минут — для этого есть фотограф. Дальше снимайте что угодно и ставьте #василисаартём2027." },
  { question: "А если дождь?", answer: "Церемония переедет под крышу павильона, ужин — в оранжерею. Зонт всё равно не помешает: до пруда идти по саду." },
  { question: "Во сколько всё закончится?", answer: "Огни в 23:00, трансфер в 23:30. Кто остаётся в гостевом доме — может не спешить." },
]

/**
 * Аккордеон с римскими номерами и антиквой в вопросе.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion020({
  items = DEFAULT_ITEMS,
  exclusive = true,
  group = "vibeui-accordion-020",
  defaultOpen = -1,
  accent,
  ink,
  background,
  className,
  style,
  ...props
}: Accordion020Props) {
  const palette = {
    ...(accent ? { "--vibeui-accordion-020-accent": accent } : null),
    ...(ink ? { "--vibeui-accordion-020-fg": ink } : null),
    ...(background ? { "--vibeui-accordion-020-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-020" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="accordion"
        data-vibeui-block="accordion-020"
        className={className}
        style={palette}
      >
        <div data-part="deck">
          {items.map((item, index) => (
            <details
              key={item.question}
              name={exclusive ? group : undefined}
              open={index === defaultOpen}
            >
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
    </>
  )
}
