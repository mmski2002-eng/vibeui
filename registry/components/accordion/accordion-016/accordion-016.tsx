import type { ComponentProps, CSSProperties } from "react"

export type Accordion016Item = {
  question: string
  answer: string
}

export type Accordion016Props = Omit<ComponentProps<"div">, "children"> & {
  items?: readonly Accordion016Item[]
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

// Идея компонента: серифный аккордеон с номером — строка вопроса набрана
// антиквой, номер и ответ — рубленым шрифтом. Плюс из двух полос
// поворачивается в крест при раскрытии. Разделы по умолчанию взаимно
// исключают друг друга через атрибут name — без единой строки JS.
// Шрифты компонент не грузит: Cormorant и Manrope подключает страница,
// без них честный откат на Georgia и системный гротеск.
const STYLES = `
:where([data-vibeui-block="accordion-016"]){
--vibeui-accordion-016-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-accordion-016-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-accordion-016-muted:color-mix(in oklab,var(--vibeui-accordion-016-fg) 62%,var(--vibeui-accordion-016-bg));
--vibeui-accordion-016-line:color-mix(in oklab,var(--vibeui-accordion-016-fg) 16%,var(--vibeui-accordion-016-bg));
--vibeui-accordion-016-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-accordion-016-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-accordion-016-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="accordion-016"]{color-scheme:dark}
[data-vibeui-block="accordion-016"] [data-part="deck"]{border-top:1px solid var(--vibeui-accordion-016-line)}
[data-vibeui-block="accordion-016"] details{border-bottom:1px solid var(--vibeui-accordion-016-line)}
[data-vibeui-block="accordion-016"] summary{display:grid;grid-template-columns:2rem minmax(0,1fr) 1.5rem;align-items:baseline;gap:1rem;padding:1.15rem 0;cursor:pointer;list-style:none;font-family:var(--vibeui-accordion-016-display);font-size:1.35rem;font-weight:600;line-height:1.2}
[data-vibeui-block="accordion-016"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-016"] summary:focus-visible{outline:2px solid var(--vibeui-accordion-016-accent);outline-offset:2px;border-radius:.25rem}
[data-vibeui-block="accordion-016"] [data-part="num"]{font-family:var(--vibeui-accordion-016-font);font-size:.72rem;letter-spacing:.1em;color:var(--vibeui-accordion-016-accent);font-weight:600}
[data-vibeui-block="accordion-016"] [data-part="plus"]{position:relative;width:1.5rem;height:1.5rem;align-self:center;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="accordion-016"] [data-part="plus"]::before,[data-vibeui-block="accordion-016"] [data-part="plus"]::after{content:"";position:absolute;left:50%;top:50%;width:1rem;height:1.5px;background:currentColor;transform:translate(-50%,-50%)}
[data-vibeui-block="accordion-016"] [data-part="plus"]::after{transform:translate(-50%,-50%) rotate(90deg)}
[data-vibeui-block="accordion-016"] details[open] [data-part="plus"]{transform:rotate(45deg)}
[data-vibeui-block="accordion-016"] [data-part="answer"]{margin:0;padding:0 2.5rem 1.35rem 3rem;color:var(--vibeui-accordion-016-muted);max-width:40rem}
[data-vibeui-block="accordion-016"]{width:100%;min-width:min(100%,16rem);box-sizing:border-box;color:var(--vibeui-accordion-016-fg);font-family:var(--vibeui-accordion-016-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="accordion-016"] *{box-sizing:border-box}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Accordion016Item[] = [
  { question: "Сколько стоят ваши услуги?", answer: "При покупке — 2 % от цены, при продаже — 3 %, но не меньше 150 000 ₽. Оплата после регистрации сделки, никаких авансов." },
  { question: "Можно ли продать квартиру с ипотекой?", answer: "Да. Гасим ипотеку деньгами покупателя через аккредитив или переводим кредит на него — банк соглашается в девяти случаях из десяти." },
  { question: "Как проходит проверка квартиры?", answer: "Юрист поднимает историю переходов права, долги, прописанных, банкротство продавца и супругов. Заключение письменное, за него отвечаем." },
  { question: "Работаете ли с новостройками?", answer: "Со всеми застройщиками города по их прайсу: комиссию платит застройщик, для вас подбор и сделка бесплатны." },
  { question: "Что если квартира не продастся за 30 дней?", answer: "Пересматриваем цену и стратегию вместе с вами. Договор можно расторгнуть в любой момент без штрафов." },
]

/**
 * Серифный аккордеон с номерами: антиква в вопросе, рубленый в номере.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion016({
  items = DEFAULT_ITEMS,
  exclusive = true,
  group = "vibeui-accordion-016",
  defaultOpen = -1,
  accent,
  ink = "Серифный аккордеон с номер…",
  background = "Серифный аккордеон с номер…",
  className,
  style,
  ...props
}: Accordion016Props) {
  const palette = {
    ...(accent ? { "--vibeui-accordion-016-accent": accent } : null),
    ...(ink ? { "--vibeui-accordion-016-fg": ink } : null),
    ...(background ? { "--vibeui-accordion-016-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-016" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="accordion"
        data-vibeui-block="accordion-016"
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
