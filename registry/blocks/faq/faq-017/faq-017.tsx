import { useId, type CSSProperties } from "react"

export type Faq017Item = {
  question: string
  answer: string
}

export type Faq017Props = {
  eyebrow?: string
  title?: string
  lede?: string
  items?: readonly Faq017Item[]
  /** Карточка «не нашли ответ»: подпись и ссылка на мессенджер. */
  askTitle?: string
  askText?: string
  askLabel?: string
  askHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Вопросы о курсе: две колонки — слева заголовок и карточка «спросить в
// Telegram», справа аккордеон на details с общим name (открыт один ответ),
// плюс превращается в крест, открытый вопрос подсвечивается акцентом слева.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="faq-017"]){
--vibeui-faq-017-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-faq-017-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-faq-017-muted:light-dark(#6b7280,#a3a3a3);
--vibeui-faq-017-card:light-dark(#f8fafc,#242424);
--vibeui-faq-017-line:light-dark(#e5e7eb,#2e2e2e);
--vibeui-faq-017-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-faq-017-on-accent:oklch(from var(--vibeui-faq-017-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-faq-017-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-faq-017-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-017"]{color-scheme:dark}
:where([data-vibeui-block="faq-017"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="faq-017"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="faq-017"]{box-sizing:border-box;display:block;background:var(--vibeui-faq-017-bg);color:var(--vibeui-faq-017-fg);font-family:var(--vibeui-faq-017-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="faq-017"] *{box-sizing:border-box}
[data-vibeui-block="faq-017"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem;display:grid;gap:2rem}
[data-vibeui-block="faq-017"] [data-part="eyebrow"]{margin:0 0 .75rem;font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-faq-017-accent);font-weight:700}
[data-vibeui-block="faq-017"] [data-part="title"]{margin:0;font-family:var(--vibeui-faq-017-display);font-weight:700;font-size:clamp(1.8rem,3.6cqi,2.75rem);line-height:1.1;letter-spacing:-.02em}
[data-vibeui-block="faq-017"] [data-part="lede"]{margin:.75rem 0 0;max-width:26rem;color:var(--vibeui-faq-017-muted)}
[data-vibeui-block="faq-017"] [data-part="ask"]{margin-top:1.5rem;padding:1.25rem;border-radius:1rem;background:var(--vibeui-faq-017-card);border:1px solid var(--vibeui-faq-017-line)}
[data-vibeui-block="faq-017"] [data-part="ask-title"]{margin:0;font-weight:600}
[data-vibeui-block="faq-017"] [data-part="ask-text"]{margin:.35rem 0 0;font-size:.875rem;color:var(--vibeui-faq-017-muted)}
[data-vibeui-block="faq-017"] [data-part="ask-link"]{display:inline-flex;align-items:center;height:2.6rem;margin-top:1rem;padding:0 1.1rem;border-radius:999px;background:var(--vibeui-faq-017-accent);color:var(--vibeui-faq-017-on-accent);font-size:.85rem;font-weight:600;text-decoration:none;transition:transform .2s}
[data-vibeui-block="faq-017"] [data-part="ask-link"]:hover{transform:translateY(-1px)}
[data-vibeui-block="faq-017"] [data-part="ask-link"]:focus-visible{outline:2px solid var(--vibeui-faq-017-accent);outline-offset:3px}
[data-vibeui-block="faq-017"] [data-part="list"]{display:grid;gap:.6rem}
[data-vibeui-block="faq-017"] details{border:1px solid var(--vibeui-faq-017-line);border-left:3px solid transparent;border-radius:.9rem;background:var(--vibeui-faq-017-card);transition:border-color .25s}
[data-vibeui-block="faq-017"] details[open]{border-left-color:var(--vibeui-faq-017-accent)}
[data-vibeui-block="faq-017"] summary{display:grid;grid-template-columns:minmax(0,1fr) 1.5rem;align-items:center;gap:1rem;padding:1rem 1.1rem;cursor:pointer;list-style:none;font-weight:600;font-size:1rem}
[data-vibeui-block="faq-017"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="faq-017"] summary:focus-visible{outline:2px solid var(--vibeui-faq-017-accent);outline-offset:-2px;border-radius:.9rem}
[data-vibeui-block="faq-017"] [data-part="plus"]{position:relative;width:1.5rem;height:1.5rem;border-radius:50%;background:var(--vibeui-faq-017-bg);border:1px solid var(--vibeui-faq-017-line);transition:transform .35s cubic-bezier(.2,.8,.2,1),background .25s,border-color .25s}
[data-vibeui-block="faq-017"] [data-part="plus"]::before,[data-vibeui-block="faq-017"] [data-part="plus"]::after{content:"";position:absolute;left:50%;top:50%;width:.7rem;height:1.5px;background:currentColor;transform:translate(-50%,-50%)}
[data-vibeui-block="faq-017"] [data-part="plus"]::after{transform:translate(-50%,-50%) rotate(90deg)}
[data-vibeui-block="faq-017"] details[open] [data-part="plus"]{transform:rotate(45deg);background:var(--vibeui-faq-017-accent);border-color:var(--vibeui-faq-017-accent);color:var(--vibeui-faq-017-on-accent)}
[data-vibeui-block="faq-017"] [data-part="answer"]{margin:0;padding:0 2.75rem 1.1rem 1.1rem;color:var(--vibeui-faq-017-muted);animation:vibeui-faq-017-in .35s ease}
@keyframes vibeui-faq-017-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
@container (min-width: 56rem){
[data-vibeui-block="faq-017"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1.5fr);gap:4rem;padding:5.5rem 2rem;align-items:start}
[data-vibeui-block="faq-017"] [data-part="head"]{position:sticky;top:6rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-017"] *{animation:none!important;transition:none!important}}`

const DEFAULT_ITEMS: Faq017Item[] = [
  { question: "Что если я не потяну темп?", answer: "Пять-семь часов в неделю — норма. Если выпадаете, куратор перенесёт дедлайн, а записи и чат остаются на год: можно догнать со следующим потоком бесплатно." },
  { question: "Нужен ли опыт в дизайне?", answer: "Нет. Первые две недели рассчитаны на тех, кто открывает Figma впервые. Тем, кто уже умеет, эти уроки помогут закрыть пробелы в автолейауте и компонентах." },
  { question: "Будет ли сертификат?", answer: "Да, именной сертификат после защиты проекта. Он ничего не «гарантирует» работодателю — гарантирует ваш кейс, и мы помогаем его оформить." },
  { question: "Можно ли вернуть деньги?", answer: "В первые семь дней — полностью, без объяснений. Дальше — пропорционально пройденному, по договору оферты." },
  { question: "Как работает рассрочка?", answer: "Без переплаты, от банка-партнёра, на 6 месяцев. Одобрение за пару минут при оформлении, курс открывается сразу." },
  { question: "Какая нужна техника?", answer: "Любой ноутбук последних пяти лет и бесплатный тариф Figma. Планшет не подойдёт: нет полноценного редактора." },
]

/** Вопросы о курсе: аккордеон на details, липкий заголовок и карточка «спросить». */
export function Faq017({
  eyebrow = "Вопросы",
  title = "Что спрашивают перед оплатой",
  lede = "Про темп, опыт, сертификат, деньги и технику. Остальное — в Telegram, отвечаем в течение часа.",
  items = DEFAULT_ITEMS,
  askTitle = "Не нашли ответ?",
  askText = "Напишите куратору набора — расскажет, подходит ли курс именно вам.",
  askLabel = "Спросить в Telegram",
  askHref = "https://t.me/",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Faq017Props) {
  const group = useId()
  const palette = {
    ...(accent ? { "--vibeui-faq-017-accent": accent } : null),
    ...(ink ? { "--vibeui-faq-017-fg": ink } : null),
    ...(background ? { "--vibeui-faq-017-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-faq-017" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="faq-017" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            {askTitle ? (
              <div data-part="ask">
                <p data-part="ask-title">{askTitle}</p>
                {askText ? <p data-part="ask-text">{askText}</p> : null}
                {askLabel ? (
                  <a data-part="ask-link" href={askHref} target="_blank" rel="noreferrer noopener">
                    {askLabel}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
          <div data-part="list">
            {items.map((item) => (
              <details key={item.question} name={group}>
                <summary>
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
