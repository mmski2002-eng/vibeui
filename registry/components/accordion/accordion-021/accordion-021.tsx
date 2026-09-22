import type { ComponentProps, CSSProperties } from "react"

export type Accordion021Item = {
  question: string
  answer: string
  /** Две-три буквы на бирке: узнаваемый код раздела. */
  tag?: string
}

export type Accordion021Props = Omit<ComponentProps<"div">, "children"> & {
  items?: readonly Accordion021Item[]
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

// Идея компонента: каждый раздел — багажная бирка: код раздела на ярлыке
// слева, вопрос крупным гротеском, крест-марка справа. Раскладка в две
// колонки от ширины компонента.
const STYLES = `
:where([data-vibeui-block="accordion-021"]){
--vibeui-accordion-021-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-accordion-021-sand:light-dark(#f4f4f4,#242424);
--vibeui-accordion-021-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-accordion-021-muted:light-dark(#5b6f78,#a3a3a3);
--vibeui-accordion-021-line:light-dark(#e3d7bf,#2e2e2e);
--vibeui-accordion-021-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-accordion-021-sea:#2aa7a0;
--vibeui-accordion-021-sun:#f2c14e;
--vibeui-accordion-021-display:"Oswald","Arial Narrow",Impact,sans-serif;
--vibeui-accordion-021-script:"Lobster","Brush Script MT",cursive;
--vibeui-accordion-021-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="accordion-021"]{color-scheme:dark}
[data-vibeui-block="accordion-021"] summary:focus-visible{outline:2px solid var(--vibeui-accordion-021-sea);outline-offset:3px;border-radius:.5rem}
[data-vibeui-block="accordion-021"] [data-part="deck"]{display:grid;gap:.8rem}
[data-vibeui-block="accordion-021"] details{position:relative;border-radius:.6rem;background:var(--vibeui-accordion-021-sand);transition:transform .3s cubic-bezier(.2,.9,.3,1),box-shadow .3s}
[data-vibeui-block="accordion-021"] details[open]{transform:translateY(-.2rem);box-shadow:0 22px 40px -28px rgb(18 58 75 / .55)}
[data-vibeui-block="accordion-021"] summary{display:grid;grid-template-columns:5rem minmax(0,1fr) 1.6rem;align-items:center;gap:.9rem;padding:0 1rem 0 0;cursor:pointer;list-style:none;min-height:3.8rem}
[data-vibeui-block="accordion-021"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-021"] [data-part="tag"]{position:relative;display:flex;align-items:center;justify-content:center;align-self:stretch;padding:.5rem .3rem .5rem 1.1rem;border-radius:.6rem 0 0 .6rem;background:var(--vibeui-accordion-021-sea);color:#fffaf0;font-family:var(--vibeui-accordion-021-display);font-size:.6rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;text-align:center;line-height:1.1;overflow-wrap:anywhere}
[data-vibeui-block="accordion-021"] [data-part="tag"]::after{content:"";position:absolute;left:.4rem;top:50%;width:.5rem;height:.5rem;margin-top:-.25rem;border-radius:50%;background:var(--vibeui-accordion-021-sand);box-shadow:inset 0 0 0 1.5px rgb(18 58 75 / .35)}
[data-vibeui-block="accordion-021"] details:nth-child(3n+2) [data-part="tag"]{background:var(--vibeui-accordion-021-accent)}
[data-vibeui-block="accordion-021"] details:nth-child(3n) [data-part="tag"]{background:var(--vibeui-accordion-021-sun);color:var(--vibeui-accordion-021-fg)}
[data-vibeui-block="accordion-021"] [data-part="q"]{font-family:var(--vibeui-accordion-021-display);font-size:1.15rem;font-weight:600;line-height:1.2;text-transform:uppercase;letter-spacing:.02em}
[data-vibeui-block="accordion-021"] [data-part="mark"]{position:relative;width:1.2rem;height:1.2rem}
[data-vibeui-block="accordion-021"] [data-part="mark"]::before,[data-vibeui-block="accordion-021"] [data-part="mark"]::after{content:"";position:absolute;left:0;top:50%;width:100%;height:2px;background:var(--vibeui-accordion-021-fg);transition:transform .35s cubic-bezier(.2,.9,.3,1)}
[data-vibeui-block="accordion-021"] [data-part="mark"]::after{transform:rotate(90deg)}
[data-vibeui-block="accordion-021"] details[open] [data-part="mark"]::after{transform:rotate(0)}
[data-vibeui-block="accordion-021"] [data-part="answer"]{margin:0;padding:0 1.2rem 1.2rem 5.3rem;color:var(--vibeui-accordion-021-muted);animation:vibeui-accordion-021-in .35s cubic-bezier(.2,.9,.3,1) both}
@keyframes vibeui-accordion-021-in{from{opacity:0;transform:translateY(-.25rem)}}
@container (min-width:56rem){
[data-vibeui-block="accordion-021"] [data-part="deck"]{grid-template-columns:1fr 1fr;gap:1rem;align-items:start}
}
[data-vibeui-block="accordion-021"]{width:100%;min-width:min(100%,16rem);box-sizing:border-box;color:var(--vibeui-accordion-021-fg);font-family:var(--vibeui-accordion-021-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="accordion-021"] *{box-sizing:border-box}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-021"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Accordion021Item[] = [
  { tag: "виза", question: "Нужна ли виза?", answer: "Нет. Россиянам — до 90 дней без визы, нужен только загранпаспорт, действующий ещё полгода после поездки." },
  { tag: "деньги", question: "Чем платить?", answer: "Наличными: доллары или евро, менять понемногу в отеле. Карты наших банков не работают, Apple Pay тоже." },
  { tag: "связь", question: "Будет ли интернет?", answer: "Медленный и в основном в отеле. Оформите eSIM Cubacel заранее — или отдохните от него три дня." },
  { tag: "солнце", question: "Насколько жарко?", answer: "Февраль — лучший месяц: +28° днём, +21° вечером, почти без дождей. Крем SPF 50 и шляпа обязательны." },
  { tag: "море", question: "Можно купаться после церемонии?", answer: "Нужно. Ужин начинается в 18:00, между церемонией и ужином — море и закат." },
  { tag: "дети", question: "Можно с детьми?", answer: "Да. На пляже безопасно и мелко, в отеле есть детские кроватки. Напишите возраст в анкете." },
  { tag: "рейс", question: "Сколько лететь?", answer: "Прямой рейс — около 13 часов. Есть варианты через Стамбул с пересадкой, но мы летим прямым." },
  { tag: "подарки", question: "Что везти в подарок?", answer: "Себя и загар. Если хочется — вклад в наш следующий рейс, реквизиты в разделе «Подарки». Цветы не переживут перелёт." },
]

/**
 * Аккордеон багажными бирками: ярлык с кодом, вопрос, марка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion021({
  items = DEFAULT_ITEMS,
  exclusive = true,
  group = "vibeui-accordion-021",
  defaultOpen = -1,
  accent,
  ink,
  background,
  className,
  style,
  ...props
}: Accordion021Props) {
  const palette = {
    ...(accent ? { "--vibeui-accordion-021-accent": accent } : null),
    ...(ink ? { "--vibeui-accordion-021-fg": ink } : null),
    ...(background ? { "--vibeui-accordion-021-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-021" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="accordion"
        data-vibeui-block="accordion-021"
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
                <span data-part="tag" aria-hidden="true">
                  {item.tag ?? "?"}
                </span>
                <span data-part="q">{item.question}</span>
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
