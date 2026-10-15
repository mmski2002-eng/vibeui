"use client"

import { useState, type CSSProperties } from "react"

export type Faq025Item = { question: string; answer: string }

export type Faq025Props = {
  eyebrow?: string
  title?: string
  items?: readonly Faq025Item[]
  cardTitle?: string
  cardText?: string
  cardLabel?: string
  cardHref?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Тёмный аккордеон: номер вопроса моно, плюс поворачивается в крест,
// ответ раскрывается плавно через grid-template-rows 0fr → 1fr — без
// измерения высоты в JS. Открыт один вопрос; слева заголовок и
// стеклянная карточка «не нашли ответ» с кнопкой в чат.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"

const S = '[data-vibeui-block="faq-025"]'
const STYLES = `
:where(${S}){
--vibeui-faq-025-bg:light-dark(#f4f1ec,#0e0f10);
--vibeui-faq-025-fg:light-dark(#16181a,#f2efe9);
--vibeui-faq-025-accent:#e8a35c;
--vibeui-faq-025-on-accent:oklch(from var(--vibeui-faq-025-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-faq-025-muted:color-mix(in oklab,var(--vibeui-faq-025-fg) 58%,transparent);
--vibeui-faq-025-line:color-mix(in oklab,var(--vibeui-faq-025-fg) 12%,transparent);
--vibeui-faq-025-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-faq-025-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) ${S}{color-scheme:dark}
:where(${S}[data-tone="light"]){color-scheme:light}
:where(${S}[data-tone="dark"]){color-scheme:dark}
${S}{padding:clamp(4rem,9cqi,7.5rem) 0;background:var(--vibeui-faq-025-bg);color:var(--vibeui-faq-025-fg);font-family:var(--vibeui-faq-025-font)}
${S} *{box-sizing:border-box}
${S} [data-part="shell"]{display:grid;gap:2.5rem;max-width:90rem;margin:0 auto;padding:0 clamp(1rem,3cqi,2.5rem)}
${S} [data-part="eyebrow"]{display:flex;align-items:center;gap:.7rem;margin:0 0 1rem;font-family:var(--vibeui-faq-025-mono);font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-faq-025-muted)}
${S} [data-part="eyebrow"]::before{content:"";width:1.6rem;height:1px;background:var(--vibeui-faq-025-accent)}
${S} [data-part="title"]{margin:0;font-weight:300;font-size:clamp(2.2rem,5cqi,4.2rem);line-height:1;letter-spacing:-.04em}
${S} [data-part="card"]{margin-top:2rem;padding:1.4rem;border:1px solid var(--vibeui-faq-025-line);border-radius:1.4rem;background:linear-gradient(140deg,color-mix(in oklab,var(--vibeui-faq-025-accent) 14%,transparent),transparent 60%)}
${S} [data-part="card"] h3{margin:0;font-size:1.1rem;font-weight:600}
${S} [data-part="card"] p{margin:.4rem 0 1.1rem;font-size:.88rem;color:var(--vibeui-faq-025-muted)}
${S} [data-part="card"] a{display:inline-flex;align-items:center;gap:.6rem;height:2.7rem;padding:0 .35rem 0 1.1rem;border-radius:999px;background:var(--vibeui-faq-025-fg);color:var(--vibeui-faq-025-bg);font-weight:600;font-size:.85rem;text-decoration:none;transition:background-color .35s,color .35s}
${S} [data-part="card"] a i{display:grid;place-items:center;width:2rem;height:2rem;border-radius:50%;background:var(--vibeui-faq-025-bg);color:var(--vibeui-faq-025-fg);transition:transform .45s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="card"] a:hover i{transform:rotate(45deg)}
${S} [data-part="card"] svg{width:.9rem;height:.9rem}
${S} [data-part="list"]{margin:0;padding:0;list-style:none;border-top:1px solid var(--vibeui-faq-025-line)}
${S} [data-part="item"]{border-bottom:1px solid var(--vibeui-faq-025-line)}
${S} [data-part="q"]{display:grid;grid-template-columns:2.6rem 1fr 2.4rem;align-items:center;gap:.5rem;width:100%;padding:1.35rem 0;border:0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}
${S} [data-part="q"] small{font-family:var(--vibeui-faq-025-mono);font-size:.72rem;color:var(--vibeui-faq-025-muted);transition:color .3s}
${S} [data-part="q"] span{font-size:clamp(1.02rem,1.8cqi,1.3rem);font-weight:500;letter-spacing:-.015em;transition:color .3s}
${S} [data-part="q"]:hover span{color:var(--vibeui-faq-025-accent)}
${S} [data-part="q"] i{position:relative;display:block;width:2.4rem;height:2.4rem;border:1px solid var(--vibeui-faq-025-line);border-radius:50%;transition:transform .5s cubic-bezier(.2,.8,.2,1),background-color .3s,border-color .3s}
${S} [data-part="q"] i::before,${S} [data-part="q"] i::after{content:"";position:absolute;left:50%;top:50%;width:.8rem;height:1px;margin:-.5px 0 0 -.4rem;background:currentColor}
${S} [data-part="q"] i::after{transform:rotate(90deg)}
${S} [data-part="q"][aria-expanded="true"] small{color:var(--vibeui-faq-025-accent)}
${S} [data-part="q"][aria-expanded="true"] i{transform:rotate(135deg);background:var(--vibeui-faq-025-accent);border-color:transparent;color:var(--vibeui-faq-025-on-accent)}
${S} [data-part="a"]{display:grid;grid-template-rows:0fr;transition:grid-template-rows .55s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="a"][data-open="true"]{grid-template-rows:1fr}
${S} [data-part="a"] > div{overflow:hidden}
${S} [data-part="a"] p{margin:0;padding:0 3rem 1.5rem 3.1rem;max-width:46rem;color:var(--vibeui-faq-025-muted);line-height:1.6;opacity:0;transform:translateY(-6px);transition:opacity .4s,transform .5s}
${S} [data-part="a"][data-open="true"] p{opacity:1;transform:none;transition-delay:.1s}
${S} a:focus-visible,${S} button:focus-visible{outline:2px solid var(--vibeui-faq-025-accent);outline-offset:2px}
@container (min-width: 60rem){${S} [data-part="shell"]{grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:5rem}${S} [data-part="side"]{position:sticky;top:6rem;align-self:start}}
@media (prefers-reduced-motion:reduce){${S} *{transition:none!important}}
${S} [data-part="card"] a{position:relative;isolation:isolate;overflow:hidden;transition:color .55s cubic-bezier(.2,.8,.2,1),transform .3s cubic-bezier(.2,.8,.2,1),box-shadow .5s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="card"] a::before{content:"";position:absolute;z-index:-1;right:.45rem;top:50%;width:2rem;height:2rem;border-radius:50%;background:var(--vibeui-faq-025-accent);transform:translateY(-50%) scale(0);transition:transform .75s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="card"] a:hover::before{transform:translateY(-50%) scale(28)}
${S} [data-part="card"] a:hover{color:var(--vibeui-faq-025-on-accent);box-shadow:0 14px 34px -14px color-mix(in oklab,var(--vibeui-faq-025-accent) 70%,transparent)}
${S} [data-part="card"] a:active{transform:scale(.965);transition-duration:.12s}
${S} [data-part="card"] a i{overflow:hidden}
${S} [data-part="card"] a:hover i{transform:none}
${S} [data-part="card"] a:hover i svg{animation:vibeui-faq-025-fly .65s cubic-bezier(.6,0,.2,1)}
${S} [data-part="q"]:active i{transform:scale(.88)}
${S} [data-part="q"][aria-expanded="true"]:active i{transform:rotate(135deg) scale(.88)}
@keyframes vibeui-faq-025-fly{0%{transform:none}45%{transform:translate(140%,-140%)}46%{transform:translate(-140%,140%)}100%{transform:none}}
@keyframes vibeui-faq-025-pop{0%{transform:scale(.94)}60%{transform:scale(1.04)}100%{transform:none}}
@media (prefers-reduced-motion:reduce){${S} *,${S} *::before{animation:none!important;transition:none!important}}`

const DEFAULT_ITEMS: Faq025Item[] = [
  { question: "Даст ли клеёный брус усадку?", answer: "Меньше 1 % за первый год — против 5–8 % у бревна естественной влажности. Поэтому окна, двери и отделку ставим сразу, а не через год." },
  { question: "Можно строить зимой?", answer: "Да, зима — лучшее время для сборки: брус не набирает влагу, а техника спокойно заходит по мёрзлому грунту. Фундамент на сваях делаем в любой сезон." },
  { question: "Работаете с ипотекой и маткапиталом?", answer: "Аккредитованы в Сбере, ВТБ и ДОМ.РФ: ставка по ИЖС от 6 %, оплата поэтапно через эскроу. Маткапитал принимаем как первый взнос." },
  { question: "Что входит в «под ключ»?", answer: "Фундамент, домокомплект и сборка, кровля, окна и двери, электрика, отопление, водоснабжение и канализация, шлифовка и покрытие стен, чистовые полы и сантехника." },
  { question: "Какая гарантия?", answer: "10 лет на конструктив и 3 года на инженерные системы. Через год после сдачи бесплатно приезжаем на сезонный осмотр." },
  { question: "Можно изменить готовый проект?", answer: "Да: передвинуть стены, добавить терраску или второй свет. Изменения до 15 % площади — без доплаты за проектирование." },
]

/** Аккордеон частых вопросов с карточкой «не нашли ответ». */
export function Faq025({
  eyebrow = "Вопросы",
  title = "Что обычно спрашивают",
  items = DEFAULT_ITEMS,
  cardTitle = "Не нашли ответ?",
  cardText = "Инженер ответит в мессенджере за 15 минут в рабочее время.",
  cardLabel = "Спросить инженера",
  cardHref = "#contact",
  tone = "dark",
  accent,
  ink,
  background,
  className,
  style,
}: Faq025Props) {
  const [open, setOpen] = useState(0)

  const palette = {
    ...(accent ? { "--vibeui-faq-025-accent": accent } : null),
    ...(ink ? { "--vibeui-faq-025-fg": ink } : null),
    ...(background ? { "--vibeui-faq-025-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-faq-025" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="faq-025" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="side">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {cardTitle ? (
              <div data-part="card">
                <h3>{cardTitle}</h3>
                {cardText ? <p>{cardText}</p> : null}
                <a href={cardHref}>
                  {cardLabel}
                  <i aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M5 11 11 5M6 5h5v5" />
                    </svg>
                  </i>
                </a>
              </div>
            ) : null}
          </div>
          <ul data-part="list">
            {items.map((item, itemIndex) => {
              const isOpen = itemIndex === open
              return (
                <li key={item.question} data-part="item">
                  <button data-part="q" type="button" aria-expanded={isOpen} aria-controls={`vibeui-faq-025-${itemIndex}`} onClick={() => setOpen(isOpen ? -1 : itemIndex)}>
                    <small>{String(itemIndex + 1).padStart(2, "0")}</small>
                    <span>{item.question}</span>
                    <i aria-hidden="true" />
                  </button>
                  <div data-part="a" id={`vibeui-faq-025-${itemIndex}`} data-open={isOpen} role="region" hidden={false} aria-hidden={!isOpen}>
                    <div>
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}
