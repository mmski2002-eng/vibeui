import type { ComponentProps, CSSProperties } from "react"

export type Accordion018Item = {
  question: string
  answer: string
  /** Цвет точки раздела; пусто — акцент. */
  color?: string
}

export type Accordion018Props = Omit<ComponentProps<"div">, "children"> & {
  items?: readonly Accordion018Item[]
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

// Идея компонента: у каждого раздела своя цветная точка — вопросы одной
// темы узнают по цвету, а не по подписи. Раскладка в две колонки от ширины
// самого компонента, плюс поворачивается в крест. Цвет точки — поле item
// (color); пусто — акцент.
const STYLES = `
:where([data-vibeui-block="accordion-018"]){
--vibeui-accordion-018-bg:light-dark(#ffffff,#0e0f12);
--vibeui-accordion-018-fg:light-dark(#111111,#f4f4f5);
--vibeui-accordion-018-muted:light-dark(#6b6b70,#a1a1aa);
--vibeui-accordion-018-line:light-dark(#e8e8ea,#26272d);
--vibeui-accordion-018-chip:light-dark(#f1f1f3,#1f2026);
--vibeui-accordion-018-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-accordion-018-on-accent:oklch(from var(--vibeui-accordion-018-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-accordion-018-display:"Inter Tight","Inter",ui-sans-serif,system-ui,sans-serif;
--vibeui-accordion-018-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="accordion-018"]{color-scheme:dark}
[data-vibeui-block="accordion-018"] summary:focus-visible{outline:2px solid var(--vibeui-accordion-018-fg);outline-offset:3px;border-radius:1rem}
[data-vibeui-block="accordion-018"] [data-part="deck"]{display:grid;gap:.5rem}
[data-vibeui-block="accordion-018"] details{border-radius:1.1rem;background:transparent;transition:background .3s}
[data-vibeui-block="accordion-018"] details[open]{background:var(--vibeui-accordion-018-chip)}
[data-vibeui-block="accordion-018"] summary{display:grid;grid-template-columns:1.5rem minmax(0,1fr) 1.5rem;align-items:center;gap:.9rem;padding:1rem 1.1rem;cursor:pointer;list-style:none;font-family:var(--vibeui-accordion-018-display);font-size:1.15rem;font-weight:600;letter-spacing:-.01em;line-height:1.25}
[data-vibeui-block="accordion-018"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-018"] [data-part="dot"]{width:.9rem;height:.9rem;margin:0 auto;border-radius:50%;background:var(--vibeui-accordion-018-dot);transition:transform .35s cubic-bezier(.2,.9,.3,1.4)}
[data-vibeui-block="accordion-018"] details[open] [data-part="dot"]{transform:scale(1.6)}
[data-vibeui-block="accordion-018"] [data-part="plus"]{position:relative;width:1.5rem;height:1.5rem;border-radius:50%;background:var(--vibeui-accordion-018-chip);transition:transform .35s cubic-bezier(.2,.8,.2,1),background .3s}
[data-vibeui-block="accordion-018"] details[open] [data-part="plus"]{transform:rotate(45deg);background:var(--vibeui-accordion-018-bg)}
[data-vibeui-block="accordion-018"] [data-part="plus"]::before,[data-vibeui-block="accordion-018"] [data-part="plus"]::after{content:"";position:absolute;left:50%;top:50%;width:.7rem;height:2px;background:currentColor;transform:translate(-50%,-50%)}
[data-vibeui-block="accordion-018"] [data-part="plus"]::after{transform:translate(-50%,-50%) rotate(90deg)}
[data-vibeui-block="accordion-018"] [data-part="answer"]{margin:0;padding:0 1.1rem 1.1rem 3.5rem;color:var(--vibeui-accordion-018-muted);animation:vibeui-accordion-018-in .35s cubic-bezier(.2,.8,.2,1)}
@keyframes vibeui-accordion-018-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
@container (min-width: 56rem){
[data-vibeui-block="accordion-018"] [data-part="deck"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:.5rem 2rem;align-items:start}
}
[data-vibeui-block="accordion-018"]{width:100%;min-width:min(100%,16rem);box-sizing:border-box;color:var(--vibeui-accordion-018-fg);font-family:var(--vibeui-accordion-018-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="accordion-018"] *{box-sizing:border-box}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-018"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Accordion018Item[] = [
  { question: "Можно ли прийти с детьми?", answer: "Да. Детям до 7 лет вход бесплатный с любым билетом, на Детской поляне работают аниматоры и мастерские с 11:00 до 19:00, есть тихая зона и пеленальные.", color: "#98f5af" },
  { question: "Что бесплатно, а что по билету?", answer: "Фуд-корт, маркет, лекторий, утренняя йога и велопарад открыты для всех. Сцены, кино и ночная программа — по браслету.", color: "#c2df37" },
  { question: "Что будет, если пойдёт дождь?", answer: "Главная сцена и лекторий под навесами, фуд-корт под зонтами. Отмена возможна только при штормовом предупреждении — тогда билеты вернём полностью.", color: "#464dff" },
  { question: "Можно ли приносить свою еду и воду?", answer: "Воду в пластиковых бутылках — да, на всех площадках есть бесплатные питьевые фонтаны. Еду и стекло — нет.", color: "#ffe2d6" },
  { question: "Как вернуть билет?", answer: "До 15 августа — полностью, через личный кабинет за минуту. Позже — только передача браслета другому человеку.", color: "#ffa5b1" },
  { question: "Пускают ли с собаками?", answer: "На поводке и с водой для собаки — да, кроме зоны Главной сцены после 20:00: там громко.", color: "#f3c37d" },
  { question: "Есть ли доступная среда?", answer: "Все входы без ступеней, у сцен выделены зоны для колясок, лекторий переводят на РЖЯ. Сопровождающий проходит бесплатно.", color: "#9854d1" },
  { question: "Где парковаться?", answer: "У парка парковок нет. Оставьте машину на перехватывающей у метро «Парк культуры» или приезжайте на велосипеде — стоянки у каждого входа.", color: "#d9cafe" },
]

/**
 * Аккордеон с цветными маркерами разделов в две колонки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion018({
  items = DEFAULT_ITEMS,
  exclusive = true,
  group = "vibeui-accordion-018",
  defaultOpen = -1,
  accent,
  ink = "Аккордеон с цветными точками",
  background = "Аккордеон с цветными точками",
  className,
  style,
  ...props
}: Accordion018Props) {
  const palette = {
    ...(accent ? { "--vibeui-accordion-018-accent": accent } : null),
    ...(ink ? { "--vibeui-accordion-018-fg": ink } : null),
    ...(background ? { "--vibeui-accordion-018-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-018" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="accordion"
        data-vibeui-block="accordion-018"
        className={className}
        style={palette}
      >
        <div data-part="deck">
          {items.map((item, index) => (
            <details
              key={item.question}
              name={exclusive ? group : undefined}
              open={index === defaultOpen}
              style={{ ["--vibeui-accordion-018-dot" as string]: item.color ?? "var(--vibeui-accordion-018-accent)" }}
            >
              <summary>
                <span data-part="dot" aria-hidden="true" />
                <span>{item.question}</span>
                <span data-part="plus" aria-hidden="true" />
              </summary>
              <p data-part="answer">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </>
  )
}
