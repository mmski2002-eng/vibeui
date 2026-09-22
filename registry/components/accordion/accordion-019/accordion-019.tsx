import type { ComponentProps, CSSProperties } from "react"

export type Accordion019Item = {
  question: string
  answer: string
}

export type Accordion019Props = Omit<ComponentProps<"div">, "children"> & {
  items?: readonly Accordion019Item[]
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

// Идея компонента: тёмный аккордеон, у открытого раздела вдоль левого края
// загорается неоновая линия с мягким свечением, номер в моноширинном
// подсвечивается тем же цветом. Палитра нарочно тёмная и фиксированная —
// неон на светлом не светится.
const STYLES = `
:where([data-vibeui-block="accordion-019"]){
--vibeui-accordion-019-bg:#07060b;
--vibeui-accordion-019-fg:#f3eefc;
--vibeui-accordion-019-muted:#a39bb5;
--vibeui-accordion-019-line:rgb(255 255 255 / .12);
--vibeui-accordion-019-accent:#ff2bd6;
--vibeui-accordion-019-cyan:#22f3ff;
--vibeui-accordion-019-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-accordion-019-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-accordion-019-mono:"JetBrains Mono",ui-monospace,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="accordion-019"]{color-scheme:dark}
[data-vibeui-block="accordion-019"] [data-part="deck"]{display:grid;gap:.5rem}
[data-vibeui-block="accordion-019"] details{position:relative;border:1px solid var(--vibeui-accordion-019-line);border-radius:.8rem;background:linear-gradient(180deg,rgb(255 255 255 / .03),transparent);transition:border-color .3s,box-shadow .3s}
[data-vibeui-block="accordion-019"] details::before{content:"";position:absolute;left:-1px;top:1rem;bottom:1rem;width:3px;border-radius:3px;background:var(--vibeui-accordion-019-accent);box-shadow:0 0 10px var(--vibeui-accordion-019-accent),0 0 24px color-mix(in oklab,var(--vibeui-accordion-019-accent) 50%,transparent);transform:scaleY(0);transition:transform .35s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="accordion-019"] details[open]{border-color:color-mix(in oklab,var(--vibeui-accordion-019-accent) 45%,transparent);box-shadow:0 0 22px color-mix(in oklab,var(--vibeui-accordion-019-accent) 15%,transparent)}
[data-vibeui-block="accordion-019"] details[open]::before{transform:scaleY(1)}
[data-vibeui-block="accordion-019"] summary{display:grid;grid-template-columns:2.2rem minmax(0,1fr) 1.5rem;align-items:center;gap:.75rem;padding:1rem 1.1rem;cursor:pointer;list-style:none;font-family:var(--vibeui-accordion-019-display);font-size:1.05rem;font-weight:600;line-height:1.25}
[data-vibeui-block="accordion-019"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-019"] summary:focus-visible{outline:2px solid var(--vibeui-accordion-019-cyan);outline-offset:-2px;border-radius:.8rem}
[data-vibeui-block="accordion-019"] [data-part="num"]{font-family:var(--vibeui-accordion-019-mono);font-size:.75rem;color:var(--vibeui-accordion-019-muted);transition:color .3s,text-shadow .3s}
[data-vibeui-block="accordion-019"] details[open] [data-part="num"]{color:var(--vibeui-accordion-019-accent);text-shadow:0 0 8px var(--vibeui-accordion-019-accent)}
[data-vibeui-block="accordion-019"] [data-part="plus"]{position:relative;width:1.5rem;height:1.5rem;border-radius:50%;border:1px solid var(--vibeui-accordion-019-line);transition:transform .35s cubic-bezier(.2,.8,.2,1),border-color .3s}
[data-vibeui-block="accordion-019"] details[open] [data-part="plus"]{transform:rotate(45deg);border-color:var(--vibeui-accordion-019-accent)}
[data-vibeui-block="accordion-019"] [data-part="plus"]::before,[data-vibeui-block="accordion-019"] [data-part="plus"]::after{content:"";position:absolute;left:50%;top:50%;width:.7rem;height:1.5px;background:currentColor;transform:translate(-50%,-50%)}
[data-vibeui-block="accordion-019"] [data-part="plus"]::after{transform:translate(-50%,-50%) rotate(90deg)}
[data-vibeui-block="accordion-019"] [data-part="answer"]{margin:0;padding:0 1.1rem 1.1rem 4.05rem;color:var(--vibeui-accordion-019-muted);animation:vibeui-accordion-019-in .35s cubic-bezier(.2,.8,.2,1)}
@keyframes vibeui-accordion-019-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
[data-vibeui-block="accordion-019"]{width:100%;min-width:min(100%,16rem);box-sizing:border-box;color:var(--vibeui-accordion-019-fg);font-family:var(--vibeui-accordion-019-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="accordion-019"] *{box-sizing:border-box}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-019"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Accordion019Item[] = [
  { question: "Это больно?", answer: "Терпимо. Ощущения зависят от зоны: плечо и предплечье почти не чувствуются, рёбра и ступни — острее. Перерывы каждые 40 минут, для чувствительных зон есть анестезия." },
  { question: "Сколько заживает?", answer: "Верхний слой — 10–14 дней, полностью — месяц. Первые три дня под плёнкой, потом крем два раза в день. Инструкцию выдаём с собой." },
  { question: "Можно ли прийти с 16 лет?", answer: "С 18. Исключений нет, паспорт спросим на первом сеансе." },
  { question: "Как выбрать мастера?", answer: "По стилю. Реализм — к Марку, олд-скул — к Асе, графика — к Тимуру, минимализм — к Лине. Если не уверены, напишите, подскажем." },
  { question: "Можно ли перекрыть старую татуировку?", answer: "Чаще всего да. Пришлите фото — скажем, что получится сделать и нужно ли сначала осветлить лазером." },
  { question: "Что нельзя перед сеансом?", answer: "Алкоголь за сутки, солнце и солярий за три дня, кроворазжижающие. Выспаться и поесть — можно и нужно." },
]

/**
 * Тёмный аккордеон с неоновой линией у открытого раздела.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion019({
  items = DEFAULT_ITEMS,
  exclusive = true,
  group = "vibeui-accordion-019",
  defaultOpen = -1,
  accent,
  ink = "Неоновый аккордеон",
  background = "Неоновый аккордеон",
  className,
  style,
  ...props
}: Accordion019Props) {
  const palette = {
    ...(accent ? { "--vibeui-accordion-019-accent": accent } : null),
    ...(ink ? { "--vibeui-accordion-019-fg": ink } : null),
    ...(background ? { "--vibeui-accordion-019-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-019" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="accordion"
        data-vibeui-block="accordion-019"
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
                <span data-part="num">{String(index + 1).padStart(2, "0")}</span>
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
