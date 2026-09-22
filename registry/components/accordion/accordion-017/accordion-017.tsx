import type { ComponentProps, CSSProperties } from "react"

export type Accordion017Item = {
  question: string
  answer: string
}

export type Accordion017Props = Omit<ComponentProps<"div">, "children"> & {
  items?: readonly Accordion017Item[]
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

// Идея компонента: карточки-плитки с тонкой левой кромкой, которая
// подсвечивается акцентом у открытого раздела, и круглым плюсом, который
// заливается акцентом и поворачивается в крест. Разделы взаимно исключают
// друг друга через атрибут name — без JS.
const STYLES = `
:where([data-vibeui-block="accordion-017"]){
--vibeui-accordion-017-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-accordion-017-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-accordion-017-muted:light-dark(#6b7280,#a3a3a3);
--vibeui-accordion-017-card:light-dark(#f8fafc,#242424);
--vibeui-accordion-017-line:light-dark(#e5e7eb,#2e2e2e);
--vibeui-accordion-017-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-accordion-017-on-accent:oklch(from var(--vibeui-accordion-017-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-accordion-017-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-accordion-017-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="accordion-017"]{color-scheme:dark}
[data-vibeui-block="accordion-017"] [data-part="deck"]{display:grid;gap:.6rem}
[data-vibeui-block="accordion-017"] details{border:1px solid var(--vibeui-accordion-017-line);border-left:3px solid transparent;border-radius:.9rem;background:var(--vibeui-accordion-017-card);transition:border-color .25s}
[data-vibeui-block="accordion-017"] details[open]{border-left-color:var(--vibeui-accordion-017-accent)}
[data-vibeui-block="accordion-017"] summary{display:grid;grid-template-columns:minmax(0,1fr) 1.5rem;align-items:center;gap:1rem;padding:1rem 1.1rem;cursor:pointer;list-style:none;font-weight:600;font-size:1rem}
[data-vibeui-block="accordion-017"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-017"] summary:focus-visible{outline:2px solid var(--vibeui-accordion-017-accent);outline-offset:-2px;border-radius:.9rem}
[data-vibeui-block="accordion-017"] [data-part="plus"]{position:relative;width:1.5rem;height:1.5rem;border-radius:50%;background:var(--vibeui-accordion-017-bg);border:1px solid var(--vibeui-accordion-017-line);transition:transform .35s cubic-bezier(.2,.8,.2,1),background .25s,border-color .25s}
[data-vibeui-block="accordion-017"] [data-part="plus"]::before,[data-vibeui-block="accordion-017"] [data-part="plus"]::after{content:"";position:absolute;left:50%;top:50%;width:.7rem;height:1.5px;background:currentColor;transform:translate(-50%,-50%)}
[data-vibeui-block="accordion-017"] [data-part="plus"]::after{transform:translate(-50%,-50%) rotate(90deg)}
[data-vibeui-block="accordion-017"] details[open] [data-part="plus"]{transform:rotate(45deg);background:var(--vibeui-accordion-017-accent);border-color:var(--vibeui-accordion-017-accent);color:var(--vibeui-accordion-017-on-accent)}
[data-vibeui-block="accordion-017"] [data-part="answer"]{margin:0;padding:0 2.75rem 1.1rem 1.1rem;color:var(--vibeui-accordion-017-muted);animation:vibeui-accordion-017-in .35s ease}
@keyframes vibeui-accordion-017-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
[data-vibeui-block="accordion-017"]{width:100%;min-width:min(100%,16rem);box-sizing:border-box;color:var(--vibeui-accordion-017-fg);font-family:var(--vibeui-accordion-017-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="accordion-017"] *{box-sizing:border-box}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-017"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Accordion017Item[] = [
  { question: "Что если я не потяну темп?", answer: "Пять-семь часов в неделю — норма. Если выпадаете, куратор перенесёт дедлайн, а записи и чат остаются на год: можно догнать со следующим потоком бесплатно." },
  { question: "Нужен ли опыт в дизайне?", answer: "Нет. Первые две недели рассчитаны на тех, кто открывает Figma впервые. Тем, кто уже умеет, эти уроки помогут закрыть пробелы в автолейауте и компонентах." },
  { question: "Будет ли сертификат?", answer: "Да, именной сертификат после защиты проекта. Он ничего не «гарантирует» работодателю — гарантирует ваш кейс, и мы помогаем его оформить." },
  { question: "Можно ли вернуть деньги?", answer: "В первые семь дней — полностью, без объяснений. Дальше — пропорционально пройденному, по договору оферты." },
  { question: "Как работает рассрочка?", answer: "Без переплаты, от банка-партнёра, на 6 месяцев. Одобрение за пару минут при оформлении, курс открывается сразу." },
  { question: "Какая нужна техника?", answer: "Любой ноутбук последних пяти лет и бесплатный тариф Figma. Планшет не подойдёт: нет полноценного редактора." },
]

/**
 * Аккордеон-плитки с акцентной кромкой у открытого раздела и круглым плюсом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion017({
  items = DEFAULT_ITEMS,
  exclusive = true,
  group = "vibeui-accordion-017",
  defaultOpen = -1,
  accent,
  ink = "Аккордеон-плитки с кромкой",
  background = "Аккордеон-плитки с кромкой",
  className,
  style,
  ...props
}: Accordion017Props) {
  const palette = {
    ...(accent ? { "--vibeui-accordion-017-accent": accent } : null),
    ...(ink ? { "--vibeui-accordion-017-fg": ink } : null),
    ...(background ? { "--vibeui-accordion-017-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-017" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="accordion"
        data-vibeui-block="accordion-017"
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
