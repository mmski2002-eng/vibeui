import { useId, type CSSProperties } from "react"

export type Faq016Item = {
  question: string
  answer: string
}

export type Faq016Props = {
  eyebrow?: string
  title?: string
  lede?: string
  items?: readonly Faq016Item[]
  /** Подпись и ссылка под заголовком: «Не нашли ответ? Напишите». */
  noteLabel?: string
  noteHref?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Вопросы перед первой встречей: слева заголовок и ссылка «спросить», справа
// аккордеон на <details> с общим name — браузер сам закрывает предыдущий
// ответ. Вопросы серифом, номера капителью акцентом, плюс поворачивается в
// крест. Серверный компонент, без состояния.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="faq-016"]){
--vibeui-faq-016-bg:light-dark(#f3ede3,#14211b);
--vibeui-faq-016-fg:light-dark(#173b2e,#eef0ea);
--vibeui-faq-016-muted:light-dark(color-mix(in oklab,#173b2e 62%,#f3ede3),color-mix(in oklab,#eef0ea 62%,#14211b));
--vibeui-faq-016-line:light-dark(color-mix(in oklab,#173b2e 16%,#f3ede3),color-mix(in oklab,#eef0ea 16%,#14211b));
--vibeui-faq-016-accent:#b8925a;
--vibeui-faq-016-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-faq-016-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-016"]{color-scheme:dark}
:where([data-vibeui-block="faq-016"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="faq-016"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="faq-016"]{box-sizing:border-box;display:block;background:var(--vibeui-faq-016-bg);color:var(--vibeui-faq-016-fg);font-family:var(--vibeui-faq-016-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="faq-016"] *{box-sizing:border-box}
[data-vibeui-block="faq-016"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem;display:grid;gap:2rem}
[data-vibeui-block="faq-016"] [data-part="eyebrow"]{margin:0 0 .5rem;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-faq-016-accent);font-weight:600}
[data-vibeui-block="faq-016"] [data-part="title"]{margin:0;font-family:var(--vibeui-faq-016-display);font-weight:500;font-size:clamp(2rem,4.5cqi,3.25rem);line-height:1.05;letter-spacing:-.01em}
[data-vibeui-block="faq-016"] [data-part="lede"]{margin:.75rem 0 0;max-width:26rem;color:var(--vibeui-faq-016-muted)}
[data-vibeui-block="faq-016"] [data-part="note"]{display:inline-flex;align-items:center;gap:.5rem;margin-top:1.5rem;color:inherit;font-weight:600;text-decoration:none;border-bottom:1px solid var(--vibeui-faq-016-accent);padding-bottom:.15rem}
[data-vibeui-block="faq-016"] [data-part="note"]:focus-visible{outline:2px solid var(--vibeui-faq-016-accent);outline-offset:3px}
[data-vibeui-block="faq-016"] [data-part="list"]{border-top:1px solid var(--vibeui-faq-016-line)}
[data-vibeui-block="faq-016"] details{border-bottom:1px solid var(--vibeui-faq-016-line)}
[data-vibeui-block="faq-016"] summary{display:grid;grid-template-columns:2rem minmax(0,1fr) 1.5rem;align-items:baseline;gap:1rem;padding:1.15rem 0;cursor:pointer;list-style:none;font-family:var(--vibeui-faq-016-display);font-size:1.35rem;font-weight:600;line-height:1.2}
[data-vibeui-block="faq-016"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="faq-016"] summary:focus-visible{outline:2px solid var(--vibeui-faq-016-accent);outline-offset:2px;border-radius:.25rem}
[data-vibeui-block="faq-016"] [data-part="num"]{font-family:var(--vibeui-faq-016-font);font-size:.72rem;letter-spacing:.1em;color:var(--vibeui-faq-016-accent);font-weight:600}
[data-vibeui-block="faq-016"] [data-part="plus"]{position:relative;width:1.5rem;height:1.5rem;align-self:center;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="faq-016"] [data-part="plus"]::before,[data-vibeui-block="faq-016"] [data-part="plus"]::after{content:"";position:absolute;left:50%;top:50%;width:1rem;height:1.5px;background:currentColor;transform:translate(-50%,-50%)}
[data-vibeui-block="faq-016"] [data-part="plus"]::after{transform:translate(-50%,-50%) rotate(90deg)}
[data-vibeui-block="faq-016"] details[open] [data-part="plus"]{transform:rotate(45deg)}
[data-vibeui-block="faq-016"] [data-part="answer"]{margin:0;padding:0 2.5rem 1.35rem 3rem;color:var(--vibeui-faq-016-muted);max-width:40rem}
@container (min-width: 56rem){
[data-vibeui-block="faq-016"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1.5fr);gap:4rem;padding:5.5rem 2rem;align-items:start}
[data-vibeui-block="faq-016"] [data-part="head"]{position:sticky;top:6rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-016"] *{transition:none!important}}`

const DEFAULT_ITEMS: Faq016Item[] = [
  { question: "Сколько стоят ваши услуги?", answer: "При покупке — 2 % от цены, при продаже — 3 %, но не меньше 150 000 ₽. Оплата после регистрации сделки, никаких авансов." },
  { question: "Можно ли продать квартиру с ипотекой?", answer: "Да. Гасим ипотеку деньгами покупателя через аккредитив или переводим кредит на него — банк соглашается в девяти случаях из десяти." },
  { question: "Как проходит проверка квартиры?", answer: "Юрист поднимает историю переходов права, долги, прописанных, банкротство продавца и супругов. Заключение письменное, за него отвечаем." },
  { question: "Работаете ли с новостройками?", answer: "Со всеми застройщиками города по их прайсу: комиссию платит застройщик, для вас подбор и сделка бесплатны." },
  { question: "Что если квартира не продастся за 30 дней?", answer: "Пересматриваем цену и стратегию вместе с вами. Договор можно расторгнуть в любой момент без штрафов." },
]

/** Вопросы перед первой встречей: серифный аккордеон на details в две колонки. */
export function Faq016({
  eyebrow = "Вопросы",
  title = "Что спрашивают перед первой встречей",
  lede = "Коротко о деньгах, сроках и рисках. Остальное — по телефону, без обязательств.",
  items = DEFAULT_ITEMS,
  noteLabel = "Не нашли ответ? Спросите",
  noteHref = "#",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Faq016Props) {
  const group = useId()
  const palette = {
    ...(accent ? { "--vibeui-faq-016-accent": accent } : null),
    ...(background ? { "--vibeui-faq-016-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-faq-016" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="faq-016" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            {noteLabel ? (
              <a href={noteHref} data-part="note">
                {noteLabel} →
              </a>
            ) : null}
          </div>
          <div data-part="list">
            {items.map((item, index) => (
              <details key={item.question} name={group}>
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
      </section>
    </>
  )
}
