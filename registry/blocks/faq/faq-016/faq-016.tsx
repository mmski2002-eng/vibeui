import { useId, type CSSProperties } from "react"

import {
  Accordion016,
  type Accordion016Item,
} from "@/registry/components/accordion/accordion-016/accordion-016"

export type Faq016Item = Accordion016Item

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
  ink?: string
  openFirst?: boolean
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
--vibeui-faq-016-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-faq-016-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-faq-016-muted:color-mix(in oklab,var(--vibeui-faq-016-fg) 62%,var(--vibeui-faq-016-bg));
--vibeui-faq-016-line:color-mix(in oklab,var(--vibeui-faq-016-fg) 16%,var(--vibeui-faq-016-bg));
--vibeui-faq-016-accent:light-dark(#1a1a1a,#f2f2f2);
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
/* Список вопросов — accordion-016, ему отдаётся вся колонка. */
[data-vibeui-block="faq-016"] [data-part="list"]{width:100%;max-width:none}
[data-vibeui-block="faq-016"] [data-part="eyebrow"]{margin:0 0 .5rem;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-faq-016-accent);font-weight:600}
[data-vibeui-block="faq-016"] [data-part="title"]{margin:0;font-family:var(--vibeui-faq-016-display);font-weight:500;font-size:clamp(2rem,4.5cqi,3.25rem);line-height:1.05;letter-spacing:-.01em}
[data-vibeui-block="faq-016"] [data-part="lede"]{margin:.75rem 0 0;max-width:26rem;color:var(--vibeui-faq-016-muted)}
[data-vibeui-block="faq-016"] [data-part="note"]{display:inline-flex;align-items:center;gap:.5rem;margin-top:1.5rem;color:inherit;font-weight:600;text-decoration:none;border-bottom:1px solid var(--vibeui-faq-016-accent);padding-bottom:.15rem}
[data-vibeui-block="faq-016"] [data-part="note"]:focus-visible{outline:2px solid var(--vibeui-faq-016-accent);outline-offset:3px}
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
  ink,
  openFirst = false,
  background,
  className,
  style,
}: Faq016Props) {
  const group = useId()
  const palette = {
    ...(accent ? { "--vibeui-faq-016-accent": accent } : null),
    ...(ink ? { "--vibeui-faq-016-fg": ink } : null),
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
          <Accordion016
            defaultOpen={openFirst ? 0 : -1}
            data-part="list"
            items={items}
            group={group}
            accent={accent}
            ink={ink}
            background={background}
          />
        </div>
      </section>
    </>
  )
}
