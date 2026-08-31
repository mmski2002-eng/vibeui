import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Carousel014Card = {
  title: string
  text?: string
  hue?: number
}

export type Carousel014Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  cards?: Carousel014Card[]
  label?: string
  /** Основа идентификаторов слайдов: два блока на одной странице не должны совпасть. */
  idPrefix?: string
}

// Идея компонента: карусель без единой строки JS, но со стрелками. Пара
// стрелок лежит внутри каждого слайда и ведёт на соседний якорь — поэтому
// «предыдущий» и «следующий» известны заранее, без знания текущей позиции.
// Прокрутку и остановку держит scroll-snap: палец, колесо, Tab и клавиши
// работают сами, а компонент остаётся серверным.
const STYLES = `
:where([data-vibeui-block="carousel-014"]){
--vibeui-carousel-014-bg:oklch(1 0 0);
--vibeui-carousel-014-fg:oklch(0.22 0.014 265);
--vibeui-carousel-014-muted:oklch(0.58 0.014 265);
--vibeui-carousel-014-border:oklch(0.91 0.006 265);
--vibeui-carousel-014-accent:oklch(0.55 0.17 265);
--vibeui-carousel-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="carousel-014"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-carousel-014-bg);
border:1px solid var(--vibeui-carousel-014-border);border-radius:1rem;
font-family:var(--vibeui-carousel-014-font);color:var(--vibeui-carousel-014-fg);
}
[data-vibeui-block="carousel-014"] [data-part="track"]{
display:flex;margin:0;padding:0;list-style:none;
overflow-x:auto;overscroll-behavior-x:contain;
scroll-snap-type:x mandatory;scroll-behavior:smooth;scrollbar-width:none;
border-radius:0.875rem;
}
[data-vibeui-block="carousel-014"] [data-part="track"]::-webkit-scrollbar{display:none}
[data-vibeui-block="carousel-014"] [data-part="slide"]{
position:relative;flex:0 0 100%;min-width:0;
scroll-snap-align:center;scroll-snap-stop:always;
display:flex;flex-direction:column;justify-content:flex-end;gap:0.25rem;
aspect-ratio:16 / 9;padding:1rem 2.75rem;box-sizing:border-box;
background:
radial-gradient(90% 80% at 22% 18%,oklch(0.9 0.06 var(--vibeui-carousel-014-hue,250)),transparent 70%),
linear-gradient(150deg,oklch(0.74 0.1 var(--vibeui-carousel-014-hue,250)),oklch(0.44 0.11 var(--vibeui-carousel-014-hue,250)));
color:oklch(0.99 0.003 265);
}
[data-vibeui-block="carousel-014"] [data-part="title"]{margin:0;font-size:1.0625rem;font-weight:680;line-height:1.2}
[data-vibeui-block="carousel-014"] [data-part="text"]{margin:0;font-size:0.8125rem;line-height:1.45;color:oklch(0.94 0.01 265)}
/* Стрелки лежат в самом слайде и ведут на соседний якорь: текущая позиция
   компоненту не нужна, а значит не нужен и JS. */
[data-vibeui-block="carousel-014"] [data-part="arrow"]{
position:absolute;top:50%;transform:translateY(-50%);
display:inline-flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;border-radius:9999px;
background:oklch(1 0 0 / 88%);color:oklch(0.24 0.02 265);
text-decoration:none;font-size:0.875rem;line-height:1;
}
[data-vibeui-block="carousel-014"] [data-part="arrow"]:hover{background:oklch(1 0 0)}
[data-vibeui-block="carousel-014"] [data-part="arrow"]:focus-visible{outline:2px solid var(--vibeui-carousel-014-accent);outline-offset:2px}
[data-vibeui-block="carousel-014"] [data-part="arrow"][data-way="prev"]{left:0.625rem}
[data-vibeui-block="carousel-014"] [data-part="arrow"][data-way="next"]{right:0.625rem}
[data-vibeui-block="carousel-014"] [data-part="hint"]{font-size:0.6875rem;color:var(--vibeui-carousel-014-muted);text-align:center}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="carousel-014"] [data-part="track"]{scroll-behavior:auto}
[data-vibeui-block="carousel-014"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_CARDS: Carousel014Card[] = [
  {
    title: "Сначала данные",
    text: "Компонент получает массив и рисует ровно то, что в нём есть",
    hue: 250,
  },
  {
    title: "Потом раскладка",
    text: "Ширина считается от контейнера, а не от окна браузера",
    hue: 160,
  },
  {
    title: "И только затем цвет",
    text: "Палитра живёт в локальных переменных и не спорит с вашей темой",
    hue: 35,
  },
  {
    title: "Ничего лишнего",
    text: "Ни рантайма, ни зависимостей: один файл в вашем проекте",
    hue: 300,
  },
]

/**
 * Карусель на scroll-snap без JS: стрелки — якорные ссылки внутри слайдов.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Carousel014({
  cards = DEFAULT_CARDS,
  label = "Принципы",
  idPrefix = "vibeui-carousel-014",
  className,
  style,
  ...props
}: Carousel014Props) {
  return (
    <>
      <style href="vibeui-carousel-014" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="carousel-014"
        aria-roledescription="карусель"
        aria-label={label}
        className={className}
        style={style as CSSProperties}
      >
        <ul data-part="track">
          {cards.map((card, index) => {
            const previous = cards[(index - 1 + cards.length) % cards.length]
            const next = cards[(index + 1) % cards.length]
            return (
              <li
                data-part="slide"
                key={card.title}
                id={`${idPrefix}-${index + 1}`}
                style={
                  {
                    "--vibeui-carousel-014-hue": card.hue ?? 250,
                  } as CSSProperties
                }
              >
                <a
                  data-part="arrow"
                  data-way="prev"
                  href={`#${idPrefix}-${((index - 1 + cards.length) % cards.length) + 1}`}
                  aria-label={`Предыдущий слайд: ${previous.title}`}
                >
                  ‹
                </a>
                <h3 data-part="title">{card.title}</h3>
                {card.text ? <p data-part="text">{card.text}</p> : null}
                <a
                  data-part="arrow"
                  data-way="next"
                  href={`#${idPrefix}-${((index + 1) % cards.length) + 1}`}
                  aria-label={`Следующий слайд: ${next.title}`}
                >
                  ›
                </a>
              </li>
            )
          })}
        </ul>
        <p data-part="hint">
          Листается пальцем, колесом и стрелками внутри кадра — без JavaScript.
        </p>
      </section>
    </>
  )
}
